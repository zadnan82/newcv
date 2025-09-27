import React, { useState, useEffect, useRef } from 'react'; 
import Alert from './Alert';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCoverLetterStore from '../../stores/coverLetterStore';
import useSessionStore from '../../stores/sessionStore';
import { extractTextFromFile, validateFile, getTextStats } from '../../services/fileConverterService';

const CoverLetter = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Session store for both local and cloud CVs
  const {
    listAllCloudCVs,
    loadCVFromProvider,
    loadLocalCVs,
    connectedProviders,
    sessionToken,
    localCVs,
    getConnectedProviderDetails
  } = useSessionStore();
  
  const {
    generateCoverLetter,
    saveCoverLetter,
    formatCoverLetter,
    isLoading: coverLetterLoading,
    error: coverLetterError,
    clearError: clearCoverLetterError,
    currentTask,
    checkTaskStatus,
    clearCurrentTask,
  } = useCoverLetterStore();
  
  const [cvFile, setCvFile] = useState(null);
  const [cloudCVs, setCloudCVs] = useState([]);
  const [localStorageCVs, setLocalStorageCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [selectedCVSource, setSelectedCVSource] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [generatedCoverLetterData, setGeneratedCoverLetterData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const [fileProcessing, setFileProcessing] = useState(false);
  const [extractedCVText, setExtractedCVText] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    hiringManager: '',
    jobDescription: '',
  });

  const isLoading = coverLetterLoading;

  // Load both local and cloud CVs on component mount
  useEffect(() => {
    const loadAllCVs = async () => {
      // Load local CVs
      try {
        const localCVsData = loadLocalCVs();
        console.log('📱 Loaded local CVs:', localCVsData?.length || 0);
        setLocalStorageCVs(localCVsData || []);
      } catch (error) {
        console.error('❌ Failed to load local CVs:', error);
      }

      // Load cloud CVs from all connected providers
      if (connectedProviders.length > 0 && sessionToken) {
        try {
          console.log('📋 Loading CVs from connected providers:', connectedProviders);
          const allCloudCVs = await listAllCloudCVs();
          console.log('✅ Loaded cloud CVs:', allCloudCVs?.length || 0);
          setCloudCVs(allCloudCVs || []);
        } catch (error) {
          console.error('❌ Failed to load cloud CVs:', error);
        }
      }
    };

    loadAllCVs();
  }, [connectedProviders, sessionToken, listAllCloudCVs, loadLocalCVs]);

  // Group cloud CVs by provider for display
  const groupedCloudCVs = cloudCVs.reduce((acc, cv) => {
    const provider = cv.provider || 'unknown';
    if (!acc[provider]) {
      acc[provider] = [];
    }
    acc[provider].push(cv);
    return acc;
  }, {});

  // Handle CV selection from any source
  const handleCVSelection = async (source, cvId) => {
    try {
      console.log(`🔥 Loading CV from ${source}:`, cvId);
      setSelectedResumeId(cvId);
      setSelectedCVSource(source);
      
      let cvData = null;
      
      if (source === 'local') {
        const localCV = localStorageCVs.find(cv => cv.id === cvId);
        if (localCV) {
          cvData = localCV;
          console.log('✅ Local CV loaded:', cvData.title || cvData.id);
        } else {
          throw new Error(t('cloud3.cv_not_found', 'Local CV not found'));
        }
      } else if (connectedProviders.includes(source)) {
        console.log(`☁️ Loading CV from ${source} cloud...`);
        cvData = await loadCVFromProvider(source, cvId);
        
        if (cvData) {
          console.log('✅ Cloud CV loaded successfully');
          cvData.source_provider = source;
          cvData.cloud_provider = source;
          cvData.cloud_file_id = cvId;
        } else {
          throw new Error(t('cloud3.failed_load_cv', `Failed to load CV from ${source}`));
        }
      } else {
        throw new Error(t('cloud3.unsupported_source', `Unsupported CV source: ${source}`));
      }
      
      if (!cvData) {
        throw new Error(t('cloud3.no_cv_data', 'No CV data available'));
      }
      
      if (!cvData.personal_info) {
        cvData.personal_info = {};
      }
      
      console.log('✅ CV ready for use:', {
        source,
        title: cvData.title || 'Untitled',
        hasPersonalInfo: !!cvData.personal_info?.full_name
      });
      
      setSelectedCV(cvData);
      
      // Auto-fill form
      if (cvData.personal_info) {
        setFormData(prev => ({
          ...prev,
          fullName: cvData.personal_info.full_name || '',
          email: cvData.personal_info.email || '',
          phone: cvData.personal_info.mobile || cvData.personal_info.phone || ''
        }));
      }
      
      const providerName = source === 'local' ? t('cloud.local_storage', 'Local Storage') : getProviderDisplayInfo(source).name;
      toast.success(t('cloud3.cv_loaded_from', `CV loaded from ${providerName}`));
      
    } catch (error) {
      console.error('❌ Failed to load CV:', error);
      setSelectedResumeId('');
      setSelectedCVSource('');
      setSelectedCV(null);
      toast.error(t('cloud3.failed_load_cv_retry', 'Failed to load CV. Please try again.'));
    }
  };

  // Handle file upload with text extraction
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file, {
      allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
      maxSizeMB: 10
    });
    
    if (!validation.valid) {
      toast.error(validation.error);
      e.target.value = '';
      return;
    }

    setFileProcessing(true);
    setCvFile(null);
    setSelectedResumeId('');
    setSelectedCVSource('upload');
    setSelectedCV(null);

    try {
      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error(t('cloud3.text_too_short', 'Extracted text is too short. Please ensure the file contains meaningful content.'));
      }

      setExtractedCVText(extractedText);
      
      const stats = getTextStats(extractedText);
      console.log('📝 Text extracted from file:', stats);
      
      toast.success(t('cloud3.file_processed', `File processed: "${file.name}". ${stats.wordCount} words extracted.`));
    } catch (error) {
      console.error('File processing failed:', error);
      toast.error(error.message || t('cloud3.file_process_failed', 'Failed to process file. Please try again or paste text directly.'));
      e.target.value = '';
      setExtractedCVText('');
    } finally {
      setFileProcessing(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle cover letter generation
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearCoverLetterError();
    setProgressStatus('');
    
    if (!selectedResumeId && !extractedCVText) {
      toast.error(t('cloud3.select_cv_or_upload', 'Please select a CV or upload a file'));
      return;
    }

    if (!formData.jobDescription.trim() || !formData.jobTitle.trim() || !formData.companyName.trim()) {
      toast.error(t('cloud3.fill_required_fields', 'Please fill in all required fields'));
      return;
    }

    if (selectedResumeId && !selectedCV && selectedCVSource !== 'upload') {
      toast.error(t('cloud3.cv_not_loaded', 'CV data not loaded. Please select the CV again.'));
      return;
    }

    try {
      console.log('🚀 Starting cover letter generation...');
      setProgressStatus(t('cloud3.generating_letter', 'Generating your cover letter...'));
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('job_description', formData.jobDescription.trim());
      formDataToSend.append('job_title', formData.jobTitle.trim());
      formDataToSend.append('company_name', formData.companyName.trim());
      formDataToSend.append('recipient_name', formData.hiringManager.trim());
      formDataToSend.append('recipient_title', '');
      
      if (selectedCVSource === 'upload' && extractedCVText) {
        console.log('📎 Using extracted text from uploaded file');
        
        const basicCVData = {
          title: t('cloud3.uploaded_resume', 'Uploaded Resume'),
          personal_info: {
            full_name: formData.fullName || t('cloud3.resume_holder', 'Resume Holder'),
            email: formData.email || 'user@example.com',
            mobile: formData.phone || '+1234567890',
            summary: extractedCVText.substring(0, 500)
          },
          experiences: [],
          educations: [],
          skills: [],
          languages: [],
          referrals: [],
          custom_sections: [],
          extracurriculars: [],
          hobbies: [],
          courses: [],
          internships: [],
          photo: { photolink: null }
        };
        
        formDataToSend.append('resume_data', JSON.stringify(basicCVData));
        formDataToSend.append('data_source', 'upload');
      } else if (selectedCV) {
        console.log(`📄 Using ${selectedCVSource} CV`);
        
        const cvDataForAPI = {
          title: selectedCV.title || t('cloud3.my_resume', 'My Resume'),
          personal_info: selectedCV.personal_info || {},
          experiences: selectedCV.experiences || [],
          educations: selectedCV.educations || [],
          skills: selectedCV.skills || [],
          languages: selectedCV.languages || [],
          referrals: selectedCV.referrals || [],
          custom_sections: selectedCV.custom_sections || [],
          extracurriculars: selectedCV.extracurriculars || [],
          hobbies: selectedCV.hobbies || [],
          courses: selectedCV.courses || [],
          internships: selectedCV.internships || [],
          photo: selectedCV.photo || selectedCV.photos || { photolink: null },
        };
        
        formDataToSend.append('resume_data', JSON.stringify(cvDataForAPI));
        
        console.log('✅ CV data prepared:', {
          hasPersonalInfo: !!cvDataForAPI.personal_info.full_name,
          experienceCount: cvDataForAPI.experiences.length,
          educationCount: cvDataForAPI.educations.length
        });
      }

      formDataToSend.append('save_to_database', 'false');
      formDataToSend.append('title', t('cloud3.cover_letter_title', `Cover Letter - ${formData.jobTitle} at ${formData.companyName}`));
      
      console.log('📤 Sending generation request...');
      
      const response = await generateCoverLetter(formDataToSend);
      
      if (response.success && response.cover_letter) {
        console.log('✅ Cover letter generated');
        handleCoverLetterResult(response);
      } else if (response.task_id) {
        console.log('⏳ Async generation started');
        setProgressStatus(t('cloud3.generation_started', 'Cover letter generation started...'));
      } else {
        throw new Error(t('cloud3.no_content_received', 'No cover letter content received'));
      }
    } catch (error) {
      console.error('❌ Generation failed:', error);
      setAlertType('error');
      setGeneratedLetter('');
      setProgressStatus('');
      toast.error(error.message || t('cloud3.generation_failed', 'Failed to generate cover letter'));
    }
  };

  // Handle cover letter result
  const handleCoverLetterResult = (result) => {
    try {
      console.log("📝 Processing cover letter result");
      
      setGeneratedCoverLetterData({
        title: t('cloud3.cover_letter_title', `Cover Letter - ${formData.jobTitle} at ${formData.companyName}`),
        company_name: formData.companyName,
        job_title: formData.jobTitle,
        job_description: formData.jobDescription,
        recipient_name: formData.hiringManager || '',
        recipient_title: '',
        cover_letter_content: result.cover_letter,
        applicant_info: result.applicant_info || {},
        job_info: result.job_info || {},
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        resume_id: connectedProviders.includes(selectedCVSource) ? selectedResumeId : null,
        cv_source: selectedCVSource,
        cv_provider: connectedProviders.includes(selectedCVSource) ? selectedCVSource : null
      });
      
      let letterContent = '';
      
      if (result.cover_letter) {
        const coverLetter = result.cover_letter;
        
        if (formData.fullName) letterContent += `${formData.fullName}\n`;
        if (formData.email) letterContent += `${formData.email}\n`;
        if (formData.phone) letterContent += `${formData.phone}\n\n`;
        
        letterContent += `${new Date().toLocaleDateString()}\n\n`;
        
        letterContent += `${formData.companyName}\n`;
        if (formData.hiringManager) letterContent += `${formData.hiringManager}\n`;
        letterContent += '\n';
        
        if (coverLetter.greeting) letterContent += `${coverLetter.greeting}\n\n`;
        if (coverLetter.introduction) letterContent += `${coverLetter.introduction}\n\n`;
        if (Array.isArray(coverLetter.body_paragraphs)) {
          coverLetter.body_paragraphs.forEach(p => letterContent += `${p}\n\n`);
        }
        if (coverLetter.closing) letterContent += `${coverLetter.closing}\n\n`;
        if (coverLetter.signature) letterContent += coverLetter.signature.replace(/\\n/g, '\n');
      }
      
      setGeneratedLetter(letterContent);
      setAlertType('success');
      setProgressStatus('');
      clearCurrentTask();
      
      toast.success(t('cloud3.letter_generated', 'Cover letter generated successfully!'));
    } catch (error) {
      console.error('❌ Error processing result:', error);
      setAlertType('error');
      setGeneratedLetter('');
      setProgressStatus('');
    }
  };

  // Save cover letter
  const handleSaveCoverLetter = async (saveToCloud = false, preferredProvider = null) => {
    if (!generatedCoverLetterData) {
      toast.error(t('cloud3.no_letter_to_save', 'No cover letter to save'));
      return;
    }

    try {
      setIsSaving(true);
      
      const result = await saveCoverLetter(generatedCoverLetterData, saveToCloud, preferredProvider);
      
      if (result.success) {
        if (saveToCloud && result.cloudResult?.success) {
          toast.success(t('cloud3.saved_local_and_cloud', `Saved locally and to ${result.cloudResult.provider}!`));
        } else {
          toast.success(t('cloud3.saved_locally', 'Cover letter saved locally!'));
        }
      } else {
        throw new Error(result.error || t('cloud3.save_failed', 'Save failed'));
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(t('cloud3.failed_to_save', `Failed to save: ${error.message}`));
    } finally {
      setIsSaving(false);
    }
  };

  // Task polling
  useEffect(() => {
    let interval;
    
    if (currentTask && currentTask.status === 'processing') {
      interval = setInterval(async () => {
        try {
          const result = await checkTaskStatus();
          
          if (result && result.status === 'completed') {
            clearInterval(interval);
            if (result.result && result.result.cover_letter) {
              handleCoverLetterResult(result.result);
            }
          } else if (result && result.status === 'failed') {
            clearInterval(interval);
            setProgressStatus('');
            setAlertType('error');
            toast.error(result.error || t('cloud3.generation_failed', 'Generation failed'));
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTask, checkTaskStatus]);

  // Provider display info
  const getProviderDisplayInfo = (provider) => {
    const providerDetails = getConnectedProviderDetails().find(p => p.provider === provider);
    if (providerDetails) {
      return {
        name: providerDetails.name,
        icon: provider === 'google_drive' ? '📄' : provider === 'onedrive' ? '☁️' :  provider === 'dropbox' ? '📦' :   '☁️'
      };
    }
    return { name: provider, icon: '🗃️' };
  };

  return (
    <div className={`min-h-screen pt-16 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Section */}
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white/80 backdrop-blur-sm'} rounded-lg shadow-lg p-4`}>
            <h2 className="text-base font-bold mb-4">{t('cloud3.ai_cover_letter_generator', 'AI Cover Letter Generator')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* CV Selection */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">{t('cloud3.select_your_cv', 'Select Your CV')}</h3>
                
                {/* Local CVs */}
                {localStorageCVs.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">
                      💾 {t('cloud3.from_local_storage', 'From Local Storage')}
                    </label>
                    <select
                      value={selectedCVSource === 'local' ? selectedResumeId : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleCVSelection('local', e.target.value);
                        }
                      }}
                      className={`w-full p-1.5 text-xs rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                    >
                      <option value="">{t('cloud3.select_local_storage', '-- Select from Local Storage --')}</option>
                      {localStorageCVs.map(cv => (
                        <option key={cv.id} value={cv.id}>
                          {cv.title || cv.personal_info?.full_name || t('common.untitled', 'Untitled')}
                          {cv.lastModified && ` (${new Date(cv.lastModified).toLocaleDateString()})`}
                        </option>
                      ))}
                    </select>
                    {selectedCVSource === 'local' && selectedCV && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {t('cloud3.selected', 'Selected')}: {selectedCV.title || t('cloud3.local_cv', 'Local CV')}
                      </p>
                    )}
                  </div>
                )}

                {/* Cloud CVs by Provider */}
               {Object.keys(groupedCloudCVs).map(provider => {
  const providerInfo = getProviderDisplayInfo(provider);
  const cvs = groupedCloudCVs[provider];
  
  return (
    <div key={provider} className="mb-3">
      <label className="block text-xs font-medium mb-1">
        {providerInfo.icon} {t('cloud3.from_provider', { provider: providerInfo.name })}
      </label>
      <select
        value={selectedCVSource === provider ? selectedResumeId : ''}
        onChange={(e) => {
          if (e.target.value) {
            handleCVSelection(provider, e.target.value);
          }
        }}
        className={`w-full p-1.5 text-xs rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
      >
        <option value="">
          {t('cloud3.select_from_provider', { provider: providerInfo.name })}
        </option>
        {cvs.map(cv => (
          <option key={cv.file_id || cv.id} value={cv.file_id || cv.id}>
            {cv.name || cv.title || t('common.untitled', 'Untitled')}
          </option>
        ))}
      </select>
      {selectedCVSource === provider && selectedCV && (
        <p className="text-xs text-green-600 mt-1">
          ✓ {t('cloud3.selected', 'Selected')}: {selectedCV.title || selectedCV.name || t('cloud3.cloud_cv', 'Cloud CV')}
        </p>
      )}
    </div>
  );
})}
                
                {/* Upload */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    📎 {t('cloud3.or_upload_file', 'Or upload a file')}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    disabled={fileProcessing}
                  />
                  <button
                    type="button"
                    onClick={triggerFileUpload}
                    disabled={fileProcessing}
                    className={`px-3 py-1.5 text-xs rounded-lg border ${
                      extractedCVText
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : `${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`
                    } hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {fileProcessing ? (
                      <span className="flex items-center gap-1">
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        {t('cloud3.processing', 'Processing...')}
                      </span>
                    ) : extractedCVText ? (
                      t('cloud3.file_processed_words', `✓ File processed (${getTextStats(extractedCVText).wordCount} words)`)
                    ) : (
                      t('cloud3.choose_file_types', 'Choose File (PDF, Word, TXT)')
                    )}
                  </button>
                </div>
                
                {/* Help text */}
             <div className="text-xs space-y-1">
  {localStorageCVs.length > 0 && (
    <p className="text-blue-600">
      💡 {t('cloud3.cvs_available_locally', { count: localStorageCVs.length })}
    </p>
  )}
  {Object.keys(groupedCloudCVs).length > 0 && (
    <p className="text-green-600">
      💡 {t('cloud3.cvs_in_cloud', { count: Object.values(groupedCloudCVs).flat().length })}
    </p>
  )}
  {connectedProviders.length === 0 && (
    <p className="text-amber-600">
      💡 <a href="/cloud-setup" className="underline">{t('cloud3.connect_cloud_access', 'Connect cloud storage')}</a> {t('cloud3.to_access_cloud_cvs', 'to access cloud CVs')}
    </p>
  )}
</div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">{t('resume.personal_info.full_name', 'Full Name')} *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-1.5 text-xs rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">{t('resume.personal_info.email', 'Email')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-1.5 text-xs rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">{t('CoverLetter.form.company_name', 'Company Name')} *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-1.5 text-xs rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">{t('CoverLetter.form.job_title', 'Job Title')} *</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-1.5 text-xs rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">{t('CoverLetter.form.hiring_manager', 'Hiring Manager')} ({t('cloud3.optional', 'optional')})</label>
                <input
                  type="text"
                  name="hiringManager"
                  value={formData.hiringManager}
                  onChange={handleInputChange}
                  className={`w-full p-1.5 text-xs rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1">{t('CoverLetter.form.job_description', 'Job Description')} *</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full p-1.5 text-xs rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder={t('CoverLetter.form.jobDescription_placeholder', 'Paste the job description...')}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-3 text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {progressStatus || t('cloud3.generating', 'Generating...')}
                  </span>
                ) : (
                  t('CoverLetter.form.generate_button', 'Generate Cover Letter with AI')
                )}
              </button>

              {coverLetterError && (
                <Alert type="error">{coverLetterError}</Alert>
              )}
            </form>
          </div>

          {/* Preview Section */}
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white/80 backdrop-blur-sm'} rounded-lg shadow-lg p-4`}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold">{t('CoverLetter.preview.title', 'Preview')}</h2>
              
              {generatedLetter && (
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => navigator.clipboard.writeText(generatedLetter)}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    {t('common.copy', 'Copy')}
                  </button>
                  <button 
                    onClick={() => {
                      const blob = new Blob([generatedLetter], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Cover_Letter_${formData.jobTitle.replace(/\s+/g, '_')}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-2 py-1 text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded hover:shadow-lg"
                  >
                    {t('common.download', 'Download')}
                  </button>
                  {generatedCoverLetterData && (
                    <>
                      <button 
                        onClick={() => handleSaveCoverLetter(false)}
                        disabled={isSaving}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:shadow-lg disabled:opacity-50"
                      >
                        {isSaving ? t('cloud3.saving', 'Saving...') : t('cloud3.save_locally_btn', '💾 Save Locally')}
                      </button>
                      
                    {connectedProviders.map(provider => {
  const providerInfo = getProviderDisplayInfo(provider);
  return (
    <button 
      key={provider}
      onClick={() => handleSaveCoverLetter(true, provider)}
      disabled={isSaving}
      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:shadow-lg disabled:opacity-50"
    >
      {isSaving ? t('cloud3.saving', 'Saving...') : (
        <>
          {providerInfo.icon} {t('cloud3.save_to_provider_btn', { name: providerInfo.name })}
        </>
      )}
    </button>
  );
})}
                    </>
                  )}
                  
                  <Link
                    to="/cover-letters"
                    className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    {t('cloud3.view_all', '📋 View All')}
                  </Link>
                </div>
              )}
            </div>
            
            {generatedLetter ? (
              <div className="whitespace-pre-wrap font-serif border p-3 rounded-lg bg-white text-black shadow-inner min-h-[400px] text-xs overflow-auto">
                {generatedLetter}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 bg-gray-50 border border-gray-200 rounded-lg min-h-[400px] flex items-center justify-center">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs">
                    {progressStatus || t('cloud3.cover_letter_preview', 'Your AI-generated cover letter will appear here')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;