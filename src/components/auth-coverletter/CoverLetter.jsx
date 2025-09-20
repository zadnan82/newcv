import React, { useState, useEffect, useRef } from 'react'; 
import Alert from './Alert';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCoverLetterStore from '../../stores/coverLetterStore';
import useSessionStore from '../../stores/sessionStore';

const CoverLetter = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Session store for both local and cloud CVs
  const {
    listGoogleDriveCVs,
    loadGoogleDriveCV,
    loadLocalCVs,
    googleDriveConnected,
    sessionToken,
    localCVs
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
  const [googleDriveCVs, setGoogleDriveCVs] = useState([]);
  const [localStorageCVs, setLocalStorageCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [selectedCVSource, setSelectedCVSource] = useState(''); // 'local', 'google-drive', or 'upload'
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [generatedCoverLetterData, setGeneratedCoverLetterData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
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

  // Load both local and Google Drive CVs on component mount
  useEffect(() => {
    const loadAllCVs = async () => {
      // Load local CVs
      try {
        const localCVsData = loadLocalCVs();
        console.log('📱 Loaded local CVs:', localCVsData);
        setLocalStorageCVs(localCVsData || []);
      } catch (error) {
        console.error('❌ Failed to load local CVs:', error);
      }

      // Load Google Drive CVs if connected
      if (googleDriveConnected && sessionToken) {
        try {
          console.log('📋 Loading Google Drive CVs...');
          const cvs = await listGoogleDriveCVs();
          console.log('✅ Loaded Google Drive CVs:', cvs);
          setGoogleDriveCVs(cvs || []);
        } catch (error) {
          console.error('❌ Failed to load Google Drive CVs:', error);
        }
      }
    };

    loadAllCVs();
  }, [googleDriveConnected, sessionToken, listGoogleDriveCVs, loadLocalCVs]);

  // Handle CV selection from any source
  const handleCVSelection = async (source, cvId) => {
    try {
      console.log(`📥 Loading selected CV from ${source}:`, cvId);
      setSelectedResumeId(cvId);
      setSelectedCVSource(source);
      
      let cvData = null;
      
      if (source === 'google-drive') {
        cvData = await loadGoogleDriveCV(cvId);
      } else if (source === 'local') {
        // Find the CV in local storage
        const localCV = localStorageCVs.find(cv => cv.id === cvId);
        if (localCV) {
          cvData = localCV;
        } else {
          throw new Error('Local CV not found');
        }
      }
      
      console.log('✅ CV loaded:', cvData);
      setSelectedCV(cvData);
      
      // Auto-fill form with CV data
      if (cvData && cvData.personal_info) {
        setFormData(prev => ({
          ...prev,
          fullName: cvData.personal_info.full_name || '',
          email: cvData.personal_info.email || '',
          phone: cvData.personal_info.mobile || cvData.personal_info.phone || ''
        }));
      }
    } catch (error) {
      console.error('❌ Failed to load CV:', error);
      toast.error('Failed to load selected CV. Please try again.');
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setCvFile(e.target.files[0]);
      setSelectedResumeId('');
      setSelectedCVSource('upload');
      setSelectedCV(null);
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

  // Handle cover letter generation with proper data
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearCoverLetterError();
    setProgressStatus('');
    
    // Validate inputs
    if (!selectedResumeId && !cvFile) {
      toast.error(t('CoverLetter.alerts.selectResume', 'Please select a CV or upload a file'));
      return;
    }

    if (!formData.jobDescription.trim()) {
      toast.error(t('CoverLetter.alerts.requiredFields', 'Please provide a job description'));
      return;
    }

    if (!formData.jobTitle.trim()) {
      toast.error(t('CoverLetter.alerts.requiredFields', 'Please provide a job title'));
      return;
    }

    if (!formData.companyName.trim()) {
      toast.error(t('CoverLetter.alerts.requiredFields', 'Please provide a company name'));
      return;
    }

    try {
      console.log('🚀 Starting cover letter generation...');
      setProgressStatus(t('CoverLetter.form.generating', 'Generating your cover letter...'));
      
      // Create FormData for the API request
      const formDataToSend = new FormData();
      
      // Add job details
      formDataToSend.append('job_description', formData.jobDescription.trim());
      formDataToSend.append('job_title', formData.jobTitle.trim());
      formDataToSend.append('company_name', formData.companyName.trim());
      formDataToSend.append('recipient_name', formData.hiringManager.trim());
      formDataToSend.append('recipient_title', '');
      
      // Add CV source based on selection
      if (selectedCVSource === 'google-drive' && selectedResumeId) {
        formDataToSend.append('resume_id', selectedResumeId);
        console.log('📄 Using Google Drive CV:', selectedResumeId);
      } else if (selectedCVSource === 'local' && selectedCV) {
        // For local CVs, we need to send the CV data as JSON
        formDataToSend.append('resume_data', JSON.stringify(selectedCV));
        console.log('💾 Using local CV:', selectedCV.title || selectedCV.id);
      } else if (selectedCVSource === 'upload' && cvFile) {
        formDataToSend.append('resume_file', cvFile);
        console.log('📎 Using uploaded file:', cvFile.name);
      }

      // Optional fields
      formDataToSend.append('save_to_database', 'false');
      formDataToSend.append('title', `Cover Letter - ${formData.jobTitle} at ${formData.companyName}`);
      
      console.log('📤 Sending cover letter request...');
      const response = await generateCoverLetter(formDataToSend);
      
      if (response.success && response.cover_letter) {
        console.log('✅ Cover letter generated successfully');
        handleCoverLetterResult(response);
      } else if (response.task_id) {
        console.log('⏳ Cover letter generation started (async):', response.task_id);
        setProgressStatus(t('CoverLetter.form.generating', 'Cover letter generation started. Please wait...'));
      } else {
        throw new Error('No cover letter content received');
      }
    } catch (error) {
      console.error('❌ Cover letter generation failed:', error);
      setAlertType('error');
      setGeneratedLetter('');
      setProgressStatus('');
      toast.error(t('CoverLetter.errors.generation', 'Failed to generate cover letter') + `: ${error.message}`);
    }
  };

  // Handle cover letter result and format for display
  const handleCoverLetterResult = (result) => {
    try {
      console.log("📝 Processing cover letter result:", result);
      
      // Store the full AI response data for saving later
      setGeneratedCoverLetterData({
        title: `Cover Letter - ${formData.jobTitle} at ${formData.companyName}`,
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
        resume_id: selectedCVSource === 'google-drive' ? selectedResumeId : null,
        cv_source: selectedCVSource
      });
      
      let letterContent = '';
      
      if (result.cover_letter) {
        const coverLetter = result.cover_letter;
        
        // Add header with personal info
        if (formData.fullName) letterContent += `${formData.fullName}\n`;
        if (formData.email) letterContent += `${formData.email}\n`;
        if (formData.phone) letterContent += `${formData.phone}\n\n`;
        
        // Add date
        letterContent += `${new Date().toLocaleDateString()}\n\n`;
        
        // Add company info
        letterContent += `${formData.companyName}\n`;
        if (formData.hiringManager) letterContent += `${formData.hiringManager}\n`;
        letterContent += '\n';
        
        // Add greeting
        if (coverLetter.greeting) {
          letterContent += `${coverLetter.greeting}\n\n`;
        }
        
        // Add introduction
        if (coverLetter.introduction) {
          letterContent += `${coverLetter.introduction}\n\n`;
        }
        
        // Add body paragraphs
        if (Array.isArray(coverLetter.body_paragraphs)) {
          coverLetter.body_paragraphs.forEach(paragraph => {
            letterContent += `${paragraph}\n\n`;
          });
        }
        
        // Add closing
        if (coverLetter.closing) {
          letterContent += `${coverLetter.closing}\n\n`;
        }
        
        // Add signature
        if (coverLetter.signature) {
          letterContent += coverLetter.signature.replace(/\\n/g, '\n');
        }
      }
      
      setGeneratedLetter(letterContent);
      setAlertType('success');
      setProgressStatus('');
      clearCurrentTask();
      
      console.log('✅ Cover letter processed and displayed');
    } catch (error) {
      console.error('❌ Error processing cover letter:', error);
      setAlertType('error');
      setGeneratedLetter('');
      setProgressStatus('');
    }
  };

  // Handle saving cover letter (local-first with optional cloud sync)
  const handleSaveCoverLetter = async (saveToCloud = false) => {
    if (!generatedCoverLetterData) {
      toast.error(t('CoverLetter.errors.generation', 'No cover letter to save. Please generate one first.'));
      return;
    }

    try {
      setIsSaving(true);
      
      const result = await saveCoverLetter(generatedCoverLetterData, saveToCloud);
      
      if (result.success) {
        if (saveToCloud) {
          if (result.cloudResult?.success) {
            toast.success(t('CoverLetter.success.letter_generated', 'Cover letter saved locally and to Google Drive!'));
          } else {
            toast.success(t('CoverLetter.success.letter_generated', 'Cover letter saved locally! (Google Drive sync failed)'));
          }
        } else {
          toast.success(t('CoverLetter.success.letter_generated', 'Cover letter saved locally!'));
        }
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(t('CoverLetter.errors.generation', 'Failed to save') + `: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle task polling for async generation
  useEffect(() => {
    let interval;
    
    if (currentTask && currentTask.status === 'processing') {
      console.log('⏳ Starting task polling for:', currentTask.id);
      
      interval = setInterval(async () => {
        try {
          const result = await checkTaskStatus();
          
          if (result && result.status === 'completed') {
            console.log('✅ Task completed:', result);
            clearInterval(interval);
            
            if (result.result && result.result.cover_letter) {
              handleCoverLetterResult(result.result);
            }
          } else if (result && result.status === 'failed') {
            console.log('❌ Task failed:', result);
            clearInterval(interval);
            setProgressStatus('');
            setAlertType('error');
            toast.error(result.error || t('CoverLetter.errors.generation', 'Cover letter generation failed'));
          }
        } catch (error) {
          console.error('❌ Task polling error:', error);
        }
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTask, checkTaskStatus]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-24 w-48 h-48 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-24 left-24 w-48 h-48 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
 
      <div className="container mx-auto p-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Section */}
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white/80 backdrop-blur-sm'} rounded-lg shadow-lg p-4`}>
            <h2 className="text-base font-bold mb-4">{t('CoverLetter.title', 'AI Cover Letter Generator')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* CV Selection Section */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">
                  {t('common.select_file', 'Select Your CV')}
                </h3>
                
                {/* Local Storage CVs */}
                {localStorageCVs.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">
                      💾 {t('cloud.from_local_storage', 'From Local Storage')}
                    </label>
                    <select
                      value={selectedCVSource === 'local' ? selectedResumeId : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleCVSelection('local', e.target.value);
                        }
                      }}
                      className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                    >
                      <option value="">{t('cloud.select_local_cv', '-- Select a CV from Local Storage --')}</option>
                      {localStorageCVs.map(cv => (
                        <option key={cv.id} value={cv.id}>
                          {cv.title || cv.personal_info?.full_name || 'Untitled CV'} 
                          {cv.lastModified && ` (${new Date(cv.lastModified).toLocaleDateString()})`}
                        </option>
                      ))}
                    </select>
                    {selectedCVSource === 'local' && selectedCV && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {t('common.selected', 'Selected')}: {selectedCV.title || 'Local CV'}
                      </p>
                    )}
                  </div>
                )}

                {/* Google Drive CVs */}
                {googleDriveConnected && googleDriveCVs.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">
                      ☁️ {t('cloud.from_google_drive', 'From Google Drive')}
                    </label>
                    <select
                      value={selectedCVSource === 'google-drive' ? selectedResumeId : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleCVSelection('google-drive', e.target.value);
                        }
                      }}
                      className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                    >
                      <option value="">{t('CoverLetter.form.select_resume', '-- Select a CV from Google Drive --')}</option>
                      {googleDriveCVs.map(cv => (
                        <option key={cv.file_id} value={cv.file_id}>
                          {cv.name}
                        </option>
                      ))}
                    </select>
                    {selectedCVSource === 'google-drive' && selectedCV && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {t('common.selected', 'Selected')}: {selectedCV.title}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Upload Option */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    📎 {t('CoverLetter.form.upload_cv', 'Or upload a CV file')}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".txt,.doc,.docx,.pdf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileUpload}
                    className={`px-3 py-1.5 text-xs rounded-lg border ${
                      cvFile 
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : `${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`
                    } hover:bg-gray-100 transition-colors`}
                  >
                    {cvFile ? `✓ ${cvFile.name}` : t('cloud.choose_file', 'Choose File')}
                  </button>
                </div>
                
                {/* Help text */}
                <div className="text-xs space-y-1">
                  {localStorageCVs.length > 0 && (
                    <p className="text-blue-600">
                      💡 {localStorageCVs.length} CV{localStorageCVs.length !== 1 ? 's' : ''} available locally
                    </p>
                  )}
                  {!googleDriveConnected && (
                    <p className="text-amber-600">
                      💡 <a href="/cloud-setup" className="underline">{t('cloud.connect_google_drive', 'Connect Google Drive')}</a> {t('cloud.access_saved_cvs', 'to access your cloud CVs')}
                    </p>
                  )}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1">{t('CoverLetter.form.full_name', 'Full Name')}</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">{t('CoverLetter.form.email', 'Email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                  />
                </div>
              </div>
              
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1">{t('CoverLetter.form.company_name', 'Company Name')} *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
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
                    className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">{t('CoverLetter.form.hiring_manager', 'Hiring Manager')} ({t('cloud.optional', 'optional')})</label>
                <input
                  type="text"
                  name="hiringManager"
                  value={formData.hiringManager}
                  onChange={handleInputChange}
                  className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
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
                  className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                  placeholder={t('CoverLetter.form.jobDescription_placeholder', 'Paste the job description here...')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-3 text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {progressStatus || t('CoverLetter.form.generating', 'Generating...')}
                  </span>
                ) : (
                  t('CoverLetter.form.generate_button', 'Generate Cover Letter with AI')
                )}
              </button>

              {/* Error Display */}
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
                    className="px-2 py-1 text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded hover:shadow-lg"
                  >
                    {t('common.download', 'Download')}
                  </button>
                  {/* Save buttons */}
                  {generatedCoverLetterData && (
                    <>
                      <button 
                        onClick={() => handleSaveCoverLetter(false)}
                        disabled={isSaving}
                        className="px-2 py-1 text-xs bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <span className="flex items-center">
                            <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            {t('common.saving', 'Saving...')}
                          </span>
                        ) : (
                          t('cloud.save_locally', '💾 Save Locally')
                        )}
                      </button>
                      
                      {googleDriveConnected && (
                        <button 
                          onClick={() => handleSaveCoverLetter(true)}
                          disabled={isSaving}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded hover:shadow-lg hover:shadow-green-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              {t('common.saving', 'Saving...')}
                            </span>
                          ) : (
                            t('cloud.save_to_drive', '☁️ Save to Drive')
                          )}
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Show dashboard link */}
                  <Link
                    to="/cover-letters"
                    className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    {t('coverLetters.title', '📋 View All')}
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
                    {progressStatus || t('CoverLetter.preview.empty_state', 'Your AI-generated cover letter will appear here')}
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