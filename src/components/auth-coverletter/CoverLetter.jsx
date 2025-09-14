import React, { useState, useEffect, useRef } from 'react'; 
import Alert from './Alert';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import useCoverLetterStore from '../../stores/coverLetterStore';
import useResumeStore from '../../stores/resumeStore';
import { useNavigate } from 'react-router-dom';
import { CV_AI_ENDPOINTS } from '../../config';

const CoverLetter = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const taskCheckIntervalRef = useRef(null);
  const authStore = useAuthStore();
  
  const {
    generateCoverLetter,
    checkTaskStatus,
    currentTask,
    clearCurrentTask,
    isLoading: coverLetterLoading,
    error: coverLetterError,
    clearError: clearCoverLetterError,
    formatCoverLetter
  } = useCoverLetterStore();
  
  const { 
    resumes,
    currentResume,
    fetchResumes,
    loading: resumeLoading
  } = useResumeStore();
  
  const [cvFile, setCvFile] = useState(null);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [usageInfo, setUsageInfo] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    hiringManager: '',
    jobDescription: '',
  });
  const isLoading = coverLetterLoading || resumeLoading;
  const token = useAuthStore(state => state.token); // Get real token 
  useEffect(() => {
    if (authStore.isAuthenticated()) {
      fetchResumes();
    }
  }, [authStore.isAuthenticated(), fetchResumes]);

  useEffect(() => {
    if (coverLetterError) {
      setAlertType('error');
    }
  }, [coverLetterError]);

  useEffect(() => {
    if (authStore.isAuthenticated() && currentResume && selectedResumeId === '' && resumes.length > 0) {
      // Auto-select the current resume if available
      setSelectedResumeId(currentResume.id.toString());
      if (currentResume.personal_info) {
        setFormData(prevData => ({
          ...prevData,
          fullName: currentResume.personal_info.full_name || '',
          email: currentResume.personal_info.email || '',
          phone: currentResume.personal_info.mobile || ''
        }));
      }
    }
  }, [currentResume, selectedResumeId, resumes, authStore]);

  // Set up task polling when currentTask changes
  useEffect(() => {
    // Clear any existing intervals
    if (taskCheckIntervalRef.current) {
      clearInterval(taskCheckIntervalRef.current);
      taskCheckIntervalRef.current = null;
    }
    
    // If we have a task that's processing, start polling
    if (currentTask && currentTask.status === 'processing') {
      setProgressStatus('Generating your cover letter...');
      
      taskCheckIntervalRef.current = setInterval(async () => {
        const result = await checkTaskStatus();
        
        if (result) {
          console.log("Task status check result:", result);
          
          if (result.status === 'completed') {
            // Handle completed task
            clearInterval(taskCheckIntervalRef.current);
            taskCheckIntervalRef.current = null;
            
            if (result.result && result.result.cover_letter) {
              handleCoverLetterResult(result.result);
            } else if (result.cover_letter) {
              handleCoverLetterResult(result);
            }
          } 
          else if (result.status === 'failed') {
            // Handle failed task
            clearInterval(taskCheckIntervalRef.current);
            taskCheckIntervalRef.current = null;
            setProgressStatus('');
            setAlertType('error');
            alert(result.error || 'Failed to generate cover letter');
          } 
          else {
            // Task still processing
            setProgressStatus(result.message || 'Still generating your cover letter...');
          }
        }
      }, 2000); // Check every 2 seconds
    }
    
    // Cleanup on unmount
    return () => {
      if (taskCheckIntervalRef.current) {
        clearInterval(taskCheckIntervalRef.current);
      }
    };
  }, [currentTask, checkTaskStatus]);
  

  const checkUsageLimit = async () => {
    try {
      const response = await fetch(CV_AI_ENDPOINTS.USAGE_LIMIT, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsageInfo(data);
      }
    } catch (err) {
      console.error('Error checking usage limit:', err);
    }
  };
  useEffect(() => {
    if (token) {
      checkUsageLimit();
    }
  }, [token]);
  
  
  // Complete fixed handleCoverLetterResult function for CoverLetter.jsx
const handleCoverLetterResult = (result) => {
  try {
    console.log("Processing cover letter result:", result);
    
    // Personal info from form data
    const personalInfo = {
      full_name: formData.fullName,
      email: formData.email,
      mobile: formData.phone
    };
    
    // Initialize letter content
    let letterContent = '';
    
    // First check if we have the API response structure (cover_letter.content)
    if (result.cover_letter && result.cover_letter.content) {
      console.log("Detected API response format with cover_letter.content");
      
      let contentStr = result.cover_letter.content;
      
      // Remove markdown wrapper if present
      if (contentStr.includes('```')) {
        contentStr = contentStr.replace(/```(?:json)?\n/, '').replace(/\n```$/, '');
        console.log("Removed markdown wrapper");
      }
      
      try {
        // Parse the JSON content
        const contentObj = JSON.parse(contentStr);
        console.log("Successfully parsed JSON content:", contentObj);
        
        // Start building the formatted letter
        // Add personal info header
        letterContent += `${personalInfo.full_name}\n`;
        letterContent += `${personalInfo.email}\n`;
        letterContent += `${personalInfo.mobile}\n\n`;
        
        // Add date
        letterContent += `${new Date().toLocaleDateString()}\n\n`;
        
        // Add company info
        letterContent += `${formData.companyName}\n`;
        if (formData.hiringManager) {
          letterContent += `${formData.hiringManager}\n`;
        }
        letterContent += '\n';
        
        // Add greeting
        letterContent += `${contentObj.greeting || 'Dear Hiring Manager,'}\n\n`;
        
        // Add introduction
        if (contentObj.introduction) {
          letterContent += `${contentObj.introduction}\n\n`;
        }
        
        // Add body paragraphs
        if (Array.isArray(contentObj.body_paragraphs)) {
          contentObj.body_paragraphs.forEach(paragraph => {
            letterContent += `${paragraph}\n\n`;
          });
        } else if (Array.isArray(contentObj.body)) {
          contentObj.body.forEach(paragraph => {
            letterContent += `${paragraph}\n\n`;
          });
        }
        
        // Add closing
        if (contentObj.closing) {
          letterContent += `${contentObj.closing}\n\n`;
        }
        
        // Add signature
        if (contentObj.signature) {
          // Replace escaped newlines with actual newlines
          letterContent += contentObj.signature.replace(/\\n/g, '\n');
        } else {
          letterContent += `Sincerely,\n${personalInfo.full_name}`;
        }
        
        console.log("Successfully formatted letter");
      } catch (parseError) {
        console.error("Failed to parse cover letter content:", parseError);
        // Fallback to a basic template
        letterContent = `${personalInfo.full_name}\n`;
        letterContent += `${personalInfo.email}\n`;
        letterContent += `${personalInfo.mobile}\n\n`;
        letterContent += `${new Date().toLocaleDateString()}\n\n`;
        letterContent += `${formData.companyName}\n`;
        if (formData.hiringManager) {
          letterContent += `${formData.hiringManager}\n`;
        }
        letterContent += '\n';
        letterContent += 'Dear Hiring Manager,\n\n';
        letterContent += 'Thank you for the opportunity to apply for this position. I am excited about the possibility of joining your team.\n\n';
        letterContent += `Sincerely,\n${personalInfo.full_name}`;
      }
    } else {
      // Handle when result has cover_letter_content directly (like from database)
      try {
        let content = result.cover_letter_content;
        let contentObj = null;
        
        // Try to parse the content if it's a string
        if (typeof content === 'string') {
          try {
            if (content.includes('```')) {
              // Remove markdown wrapper
              const jsonStr = content.replace(/```(?:json)?\n/, '').replace(/\n```$/, '');
              contentObj = JSON.parse(jsonStr);
            } else {
              // Try as regular JSON
              contentObj = JSON.parse(content);
            }
          } catch (e) {
            contentObj = null;
          }
        } else if (typeof content === 'object') {
          contentObj = content;
        }
        
        if (contentObj) {
          // Add personal info header
          letterContent += `${personalInfo.full_name}\n`;
          letterContent += `${personalInfo.email}\n`;
          letterContent += `${personalInfo.mobile}\n\n`;
          
          // Add date
          letterContent += `${new Date().toLocaleDateString()}\n\n`;
          
          // Add company info
          letterContent += `${formData.companyName}\n`;
          if (formData.hiringManager) {
            letterContent += `${formData.hiringManager}\n`;
          }
          letterContent += '\n';
          
          // Add greeting
          letterContent += `${contentObj.greeting || 'Dear Hiring Manager,'}\n\n`;
          
          // Add introduction
          if (contentObj.introduction) {
            letterContent += `${contentObj.introduction}\n\n`;
          }
          
          // Add body paragraphs
          if (Array.isArray(contentObj.body_paragraphs)) {
            contentObj.body_paragraphs.forEach(para => {
              letterContent += `${para}\n\n`;
            });
          } else if (Array.isArray(contentObj.body)) {
            contentObj.body.forEach(para => {
              letterContent += `${para}\n\n`;
            });
          }
          
          // Add closing
          if (contentObj.closing) {
            letterContent += `${contentObj.closing}\n\n`;
          }
          
          // Add signature
          if (contentObj.signature) {
            letterContent += contentObj.signature.replace(/\\n/g, '\n');
          } else {
            letterContent += `Sincerely,\n${personalInfo.full_name}`;
          }
        } else {
          // Fallback to a basic template
          letterContent = `${personalInfo.full_name}\n`;
          letterContent += `${personalInfo.email}\n`;
          letterContent += `${personalInfo.mobile}\n\n`;
          letterContent += `${new Date().toLocaleDateString()}\n\n`;
          letterContent += `${formData.companyName}\n`;
          if (formData.hiringManager) {
            letterContent += `${formData.hiringManager}\n`;
          }
          letterContent += '\n';
          letterContent += 'Dear Hiring Manager,\n\n';
          letterContent += 'Thank you for the opportunity to apply for this position. I am excited about the possibility of joining your team.\n\n';
          letterContent += `Sincerely,\n${personalInfo.full_name}`;
        }
      } catch (err) {
        console.error('Error handling stored cover letter:', err);
        // Use the simplest fallback
        letterContent = `${personalInfo.full_name}\n`;
        letterContent += `${personalInfo.email}\n`;
        letterContent += `${personalInfo.mobile}\n\n`;
        letterContent += `${new Date().toLocaleDateString()}\n\n`;
        letterContent += `${formData.companyName}\n`;
        letterContent += `Dear Hiring Manager,\n\n`;
        letterContent += `Sincerely,\n${personalInfo.full_name}`;
      }
    }
    
    setGeneratedLetter(letterContent);
    setAlertType('success');
    setProgressStatus('');
    clearCurrentTask(); // Clear the task once complete 
  } catch (err) {
    console.error('Error processing cover letter:', err);
    setAlertType('error');
    setGeneratedLetter('');
    setProgressStatus(''); 
  }
};

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setCvFile(e.target.files[0]);
      // Clear selected resume when uploading file
      setSelectedResumeId('');
    }
  };
 
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleResumeSelect = (e) => {
    const resumeId = e.target.value;
    setSelectedResumeId(resumeId);
    
    // Clear file upload when selecting resume
    if (resumeId) {
      setCvFile(null);
    }
    
    // Fill form with personal info from selected resume
    if (resumeId) {
      const selectedResume = resumes.find(r => r.id.toString() === resumeId);
      if (selectedResume && selectedResume.personal_info) {
        setFormData(prevData => ({
          ...prevData,
          fullName: selectedResume.personal_info.full_name || '',
          email: selectedResume.personal_info.email || '',
          phone: selectedResume.personal_info.mobile || ''
        }));
      }
    }
  };

  const clearSelectedResume = () => {
    setSelectedResumeId('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveToggle = (e) => {
    setSaveToAccount(e.target.checked);
  };

  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { 
        from: '/cover-letter',
        message: t('auth.login_required', 'You need to be logged in to use our services') 
      } 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearCoverLetterError();
    setProgressStatus('');
    
    // Check if user is authenticated
    if (!authStore.isAuthenticated()) {
      // Show login modal instead of proceeding
      setShowLoginModal(true);
      return;
    }
    
    // Check if CV file or resume is selected
    if (!cvFile && !selectedResumeId) {
      setAlertType('error');
      setGeneratedLetter('');
      alert(t('CoverLetter.alerts.selectResume', 'Please upload a CV or select a resume from your account'));
      return;
    }
  
    // Create FormData object to send file and other data
    const formDataToSend = new FormData();
    
    if (cvFile) {
      formDataToSend.append('resume_file', cvFile);
    } else if (selectedResumeId) {
      formDataToSend.append('resume_id', selectedResumeId);
    }
    
    formDataToSend.append('job_description', formData.jobDescription);
    formDataToSend.append('job_title', formData.jobTitle);
    formDataToSend.append('company_name', formData.companyName);
    formDataToSend.append('recipient_name', formData.hiringManager);
    formDataToSend.append('recipient_title', ''); // Optional field
    
    // Add save to database option if authenticated and selected
    if (saveToAccount) {
      formDataToSend.append('save_to_database', 'true');
      formDataToSend.append('title', `${t('CoverLetter.form.title_prefix', 'Cover Letter for')} ${formData.jobTitle} ${t('common.at', 'at')} ${formData.companyName}`);
    }
  
    try {
      console.log("Submitting cover letter generation request");
      setProgressStatus('Starting cover letter generation...');
      
      const response = await generateCoverLetter(formDataToSend);

// Check if it's an async response (has task_id)
if (response && response.task_id) {
  console.log("Received async response with task ID:", response.task_id);
  setProgressStatus('Cover letter generation started. Please wait...');
  // The polling for task status is handled by the useEffect
} else if (response && response.cover_letter) {
  // Handle synchronous response
  console.log("Received synchronous cover letter response");
  handleCoverLetterResult(response);
} else {
  // No valid response
  throw new Error(t('CoverLetter.errors.no_content', 'No cover letter data received'));
}
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setAlertType('error');
      setGeneratedLetter('');
      setProgressStatus('');
    }
  };

  const LoginModal = () => {
    if (!showLoginModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-4 max-w-md mx-4`}>
          <h2 className="text-base font-bold mb-3">{t('auth.login_required', 'Login Required')}</h2>
          <p className="text-xs mb-4">{t('CoverLetter.login_message', 'You need to be logged in to generate cover letters.')}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowLoginModal(false)}
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              onClick={handleLoginRedirect}
              className="px-2.5 py-1.5 text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
            >
              {t('auth.login.title', 'Login')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      {/* Background Elements - decorative elements similar to cards but more subtle */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-24 w-48 h-48 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-24 left-24 w-48 h-48 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
 
      <div className="container mx-auto p-4 relative z-10">
        {usageInfo && (
  <div className={`mb-3 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    {t('ai.limit_info', 'AI requests remaining: {{remaining}} of {{limit}}', {
      remaining: usageInfo.remaining,
      limit: usageInfo.limit
    })}
  </div>
)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Section */}
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white/80 backdrop-blur-sm'} rounded-lg shadow-lg p-4`}>
            <h2 className="text-base font-bold mb-4">{t('CoverLetter.title', 'Cover Letter Generator')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Resume Selection Section */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">
                  {t('CoverLetter.form.resume_source', 'Select Resume Source')}
                </h3>
                
                {authStore.isAuthenticated() && resumes.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">
                      {t('CoverLetter.form.select_stored_resume', 'Select from your saved resumes')}
                    </label>
                    <div className="flex">
                      <select
                        name="resumeId"
                        value={selectedResumeId}
                        onChange={handleResumeSelect}
                        className={`w-full p-1.5 text-xs rounded-l border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                      >
                        <option value="">{t('CoverLetter.form.select_resume', '-- Select a resume --')}</option>
                        {resumes.map(resume => (
                          <option key={resume.id} value={resume.id}>
                            {resume.title || `Resume #${resume.id}`}
                          </option>
                        ))}
                      </select>
                      {selectedResumeId && (
                        <button
                          type="button"
                          onClick={clearSelectedResume}
                          className="px-2 py-1 bg-gray-200 rounded-r text-gray-700 text-xs hover:bg-gray-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    {t('CoverLetter.form.upload_cv', 'Or upload a resume file')}
                  </label>
                  <div className="flex flex-col space-y-2">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="cv"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    {/* Styled button to trigger file input */}
                    <button
                      type="button"
                      onClick={triggerFileUpload}
                      className={`px-3 py-1.5 text-xs rounded-lg border ${
                        cvFile 
                          ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
                          : `${darkMode ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`
                      } flex items-center justify-center transition-colors`}
                      disabled={false}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {cvFile 
                        ? t('CoverLetter.form.change_file', 'Change File') 
                        : t('common.select_file', 'Select Resume File')}
                    </button>
                    
                    {/* Display selected file name */}
                    {cvFile && (
                      <div className="flex items-center justify-between px-2 py-1 bg-green-50 border border-green-200 rounded text-green-700">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[0.7rem] truncate max-w-[200px]">{cvFile.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setCvFile(null)}
                          className="text-green-700 hover:text-green-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    {t('CoverLetter.form.supported_formats', 'Supported formats: .txt, .doc, .docx, .pdf')}
                  </p>
                </div>
                
                {!cvFile && !selectedResumeId && (
                  <p className="text-[0.7rem] text-amber-500">
                    {t('CoverLetter.form.resume_required', 'Please select a resume or upload a file')}
                  </p>
                )}
              </div>

              {/* Personal Info Section */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">
                  {t('CoverLetter.form.personal_info', 'Your Information')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t('CoverLetter.form.full_name', 'Full Name')}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                      placeholder={t('CoverLetter.form.fullName_placeholder', 'Your full name')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t('CoverLetter.form.email', 'Email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                      placeholder={t('CoverLetter.form.email_placeholder', 'Your email address')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t('CoverLetter.form.phone', 'Phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                      placeholder={t('CoverLetter.form.phone_placeholder', 'Your phone number')}
                    />
                  </div>
                </div>
              </div>
              
              {/* Job Details Section */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">
                  {t('CoverLetter.form.job_details', 'Job Details')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t('CoverLetter.form.company_name', 'Company Name')}
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                      placeholder={t('CoverLetter.form.companyName_placeholder', 'Company name')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t('CoverLetter.form.job_title', 'Job Title')}
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                      placeholder={t('CoverLetter.form.jobTitle_placeholder', 'Position you are applying for')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t('CoverLetter.form.hiring_manager', 'Hiring Manager (optional)')}
                    </label>
                    <input
                      type="text"
                      name="hiringManager"
                      value={formData.hiringManager}
                      onChange={handleInputChange}
                      className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                      placeholder={t('CoverLetter.form.hiringManager_placeholder', 'Name of hiring manager')}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">
                    {t('CoverLetter.form.job_description', 'Job Description')}
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full p-1.5 text-xs rounded border border-gray-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'}`}
                    placeholder={t('CoverLetter.form.jobDescription_placeholder', 'Paste the job description here')}
                  />
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    {t('CoverLetter.form.job_description_tip', 'The more complete the job description, the better tailored your cover letter will be')}
                  </p>
                </div>
              </div>

              {/* Save options - only show if authenticated */}
              {authStore.isAuthenticated() && (
                <div className="mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveToAccount"
                      name="saveToAccount"
                      checked={saveToAccount}
                      onChange={handleSaveToggle}
                      className="h-3 w-3 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="saveToAccount" className="ml-2 text-xs">
                      {t('CoverLetter.form.save_to_account', 'Save this cover letter to my account')}
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span className="text-xs">
                      {progressStatus || t('CoverLetter.form.generating', 'Generating...')}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs">{t('CoverLetter.form.generate_button', 'Generate Cover Letter')}</span>
                )}
              </button>

              {/* Alert Display */}
              {coverLetterError && (
                <Alert type="error">{coverLetterError}</Alert>
              )}
              
              {/* Login Notice - Show if not authenticated */}
              {!authStore.isAuthenticated() && (
                <div className="mt-2 text-center text-[0.7rem]">
                  <p className="text-gray-600 dark:text-gray-300">
                    <a href="/login" className="text-blue-500 hover:underline">
                      {t('auth.login.title', 'Log in')}
                    </a> {t('CoverLetter.login_notice', 'to save your cover letters and use your stored resumes')}
                  </p>
                </div>
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
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLetter);
                      setAlertType('success');
                      alert(t('CoverLetter.success.copied', 'Cover letter copied to clipboard!'));
                    }}
                    className="px-2 py-1 text-[0.7rem] bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    {t('common.copy', 'Copy')}
                  </button>
                  <button 
                    onClick={() => {
                      const blob = new Blob([generatedLetter], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${t('CoverLetter.download_prefix', 'Cover_Letter')}_${formData.jobTitle.replace(/\s+/g, '_')}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="px-2 py-1 text-[0.7rem] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
                  >
                    {t('common.download', 'Download')}
                  </button>
                </div>
              )}
            </div>
            
            {generatedLetter ? (
              <div className="whitespace-pre-wrap font-serif border p-3 rounded-lg bg-white text-black shadow-inner min-h-[400px] text-xs">
                {generatedLetter}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 bg-gray-50 border border-gray-200 rounded-lg min-h-[400px] flex items-center justify-center">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs">
                    {progressStatus || t('CoverLetter.preview.empty_state', 'Your cover letter will appear here once generated')}
                  </p>
                </div>
              </div> 
            )}
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal />
    </div>
  );
};

export default CoverLetter;