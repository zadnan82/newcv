import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useNewCoverLetterStore from '../../stores/coverLetterStore';
import useSessionStore from '../../stores/sessionStore';
import toast from 'react-hot-toast';
import useCoverLetterStore from '../../stores/coverLetterStore';

const CoverLetterEditor = ({ darkMode }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  // FIXED: Get multi-provider session data
  const { 
    sessionToken, 
    connectedProviders,
    hasCloudConnection 
  } = useSessionStore();
  
  const {
    currentLetter,
    getCoverLetter,
    updateCoverLetter,
    isLoading,
    error,
    clearError,
    formatCoverLetter
  } = useCoverLetterStore();
  
  // Local state
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    jobTitle: '',
    recipientName: '',
    recipientTitle: '',
    jobDescription: '',
    coverLetterContent: ''
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [formattedLetter, setFormattedLetter] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); 

  useEffect(() => {
    console.log('🔍 Editor useEffect - ID:', id);
    console.log('🔍 Editor useEffect - sessionToken:', !!sessionToken);
    console.log('🔍 Editor useEffect - connectedProviders:', connectedProviders);
    console.log('🔍 Editor useEffect - hasCloudConnection:', hasCloudConnection);
     
    // FIXED: Don't redirect immediately, wait for session to load
    if (!sessionToken && isInitialized) {
      console.log('❌ No session token - redirecting to home');
      navigate('/', { replace: true });
      toast.error(t('auth.error.return_to_login', 'Please refresh the page to continue'));
      return;
    }
    
    // FIXED: Only require ANY cloud connection, not specifically Google Drive
    if (sessionToken && connectedProviders.length === 0 && isInitialized) {
      console.log('❌ No cloud providers connected - redirecting to cloud setup');
      navigate('/cloud-setup', { replace: true });
      toast.info(t('cloud.connect_provider_to_edit', 'Connect a cloud provider to edit cover letters'));
      return;
    }
    
    // Mark as initialized after first render
    if (!isInitialized) {
      setIsInitialized(true);
    }
    
    // Load the cover letter if we have session and ID
    if (sessionToken && connectedProviders.length > 0 && id && isInitialized) {
      const loadCoverLetter = async () => {
        try {
          console.log('📥 Loading cover letter for editing:', id);
          await getCoverLetter(id);
        } catch (err) {
          console.error('❌ Error loading cover letter:', err);
          toast.error(t('coverLetterDetail.errors.load', 'Failed to load cover letter'));
          navigate('/cover-letters', { replace: true });
        }
      };
      
      loadCoverLetter();
    }
  }, [id, sessionToken, connectedProviders, navigate, isInitialized]);
  
  // Set form data when letter loads
  useEffect(() => { 
    if (currentLetter) {
      console.log("📝 Setting form data from current letter:", currentLetter);
      
      // Try to parse the cover letter content
      let contentStr = '';
      
      try {
        if (!currentLetter.cover_letter_content) {
          console.log("No cover letter content found, using default empty structure");
          contentStr = JSON.stringify({
            greeting: t('coverLetterEditor.placeholders.greeting', 'Dear Hiring Manager,'),
            introduction: '',
            body_paragraphs: [''],
            closing: '',
            signature: t('coverLetterEditor.placeholders.signature', 'Sincerely,')
          }, null, 2);
        } else if (typeof currentLetter.cover_letter_content === 'string') {
          try {
            // Try to parse as JSON first
            const parsed = JSON.parse(currentLetter.cover_letter_content);
            contentStr = JSON.stringify(parsed, null, 2);
          } catch (jsonErr) {
            // If not JSON, use as plain text
            contentStr = currentLetter.cover_letter_content;
          }
        } else {
          // It's an object, stringify it
          contentStr = JSON.stringify(currentLetter.cover_letter_content, null, 2);
        }
      } catch (err) {
        console.error('❌ Error processing cover letter content:', err);
        contentStr = JSON.stringify({
          greeting: t('coverLetterEditor.placeholders.greeting', 'Dear Hiring Manager,'),
          introduction: '',
          body_paragraphs: [''],
          closing: '',
          signature: t('coverLetterEditor.placeholders.signature', 'Sincerely,')
        }, null, 2);
      }
      
      setFormData({
        title: currentLetter.title || '',
        companyName: currentLetter.company_name || '',
        jobTitle: currentLetter.job_title || '',
        recipientName: currentLetter.recipient_name || '',
        recipientTitle: currentLetter.recipient_title || '',
        jobDescription: currentLetter.job_description || '',
        coverLetterContent: contentStr
      });
      
      // Also generate formatted letter for preview
      const formatted = formatCoverLetter(currentLetter);
      setFormattedLetter(formatted);
    }
  }, [currentLetter, formatCoverLetter, t]); 
  
  // Update preview when in preview mode (with safety checks)
  useEffect(() => { 
    if (previewMode && formData.coverLetterContent) {
      try {
        // Don't interfere with editing by creating a temporary object
        const tempLetter = {
          id: id,
          title: formData.title,
          company_name: formData.companyName,
          job_title: formData.jobTitle,
          recipient_name: formData.recipientName,
          recipient_title: formData.recipientTitle,
          job_description: formData.jobDescription,
          cover_letter_content: formData.coverLetterContent,
          author_name: currentLetter?.author_name || '',
          author_email: currentLetter?.author_email || '',
          author_phone: currentLetter?.author_phone || ''
        };
        
        const formatted = formatCoverLetter(tempLetter);
        setFormattedLetter(formatted);
        
        console.log("📰 Preview updated (preview mode only)");
      } catch (err) {
        console.error('❌ Error formatting preview:', err);
        // Don't show error toast for preview issues to avoid disrupting editing
      }
    }
  }, [previewMode, formData, currentLetter, formatCoverLetter, id]); // Only update when in preview mode

  // Handle error display
  useEffect(() => { 
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const togglePreviewMode = () => {
    setPreviewMode(prev => !prev);
  };
  
  // Enhanced rich editor that preserves content
  const renderRichEditor = () => {
    let contentObject = {
      greeting: t('coverLetterEditor.placeholders.greeting', 'Dear Hiring Manager,'),
      introduction: '',
      body_paragraphs: [''],
      closing: '',
      signature: t('coverLetterEditor.placeholders.signature', 'Sincerely,')
    };
    
    // More robust parsing that preserves existing content
    if (formData.coverLetterContent && formData.coverLetterContent.trim() !== '') {
      try {
        const parsed = JSON.parse(formData.coverLetterContent);
        
        // Merge with defaults to ensure all fields exist
        contentObject = {
          greeting: parsed.greeting || contentObject.greeting,
          introduction: parsed.introduction || contentObject.introduction,
          body_paragraphs: Array.isArray(parsed.body_paragraphs) ? parsed.body_paragraphs : 
                           Array.isArray(parsed.body) ? parsed.body : contentObject.body_paragraphs,
          closing: parsed.closing || contentObject.closing,
          signature: parsed.signature || contentObject.signature
        };
        
        console.log("📝 Parsed content object:", contentObject);
      } catch (e) {
        console.warn("Failed to parse content for rich editor, preserving existing:", e);
        // Don't reset to defaults if parsing fails - keep current contentObject
      }
    }
    
    // Helper function with better error handling
    const updateContentField = (field, value) => {
      try {
        // Get current content object first
        let currentContent = contentObject;
        
        // Try to parse current form data to preserve other fields
        if (formData.coverLetterContent && formData.coverLetterContent.trim()) {
          try {
            currentContent = JSON.parse(formData.coverLetterContent);
          } catch (parseErr) {
            console.warn("Parse error in updateContentField, using current object:", parseErr);
          }
        }
        
        const updatedContent = { ...currentContent, [field]: value };
        
        console.log(`📝 Updating field ${field}:`, value);
        console.log(`📝 Full updated content:`, updatedContent);
        
        setFormData(prev => ({
          ...prev,
          coverLetterContent: JSON.stringify(updatedContent, null, 2)
        }));
      } catch (err) {
        console.error("❌ Error updating content field:", err);
        // Don't update if there's an error to prevent content loss
      }
    };
    
    // Helper to update paragraphs with better preservation
    const updateParagraph = (arrayField, index, value) => {
      try {
        // Get current content
        let currentContent = contentObject;
        
        if (formData.coverLetterContent && formData.coverLetterContent.trim()) {
          try {
            currentContent = JSON.parse(formData.coverLetterContent);
          } catch (parseErr) {
            console.warn("Parse error in updateParagraph, using current object:", parseErr);
          }
        }
        
        const paragraphs = Array.isArray(currentContent[arrayField]) 
          ? [...currentContent[arrayField]] 
          : [''];
        
        paragraphs[index] = value;
        
        const updatedContent = { ...currentContent, [arrayField]: paragraphs };
        
        setFormData(prev => ({
          ...prev,
          coverLetterContent: JSON.stringify(updatedContent, null, 2)
        }));
      } catch (err) {
        console.error("❌ Error updating paragraph:", err);
      }
    };
    
    // Helper to add paragraphs with preservation
    const addParagraph = (arrayField) => {
      try {
        let currentContent = contentObject;
        
        if (formData.coverLetterContent && formData.coverLetterContent.trim()) {
          try {
            currentContent = JSON.parse(formData.coverLetterContent);
          } catch (parseErr) {
            console.warn("Parse error in addParagraph, using current object:", parseErr);
          }
        }
        
        const paragraphs = Array.isArray(currentContent[arrayField]) 
          ? [...currentContent[arrayField]] 
          : [];
        
        paragraphs.push('');
        
        const updatedContent = { ...currentContent, [arrayField]: paragraphs };
        
        setFormData(prev => ({
          ...prev,
          coverLetterContent: JSON.stringify(updatedContent, null, 2)
        }));
      } catch (err) {
        console.error("❌ Error adding paragraph:", err);
      }
    };
    
    // Helper to remove paragraphs with preservation
    const removeParagraph = (arrayField, index) => {
      try {
        let currentContent = contentObject;
        
        if (formData.coverLetterContent && formData.coverLetterContent.trim()) {
          try {
            currentContent = JSON.parse(formData.coverLetterContent);
          } catch (parseErr) {
            console.warn("Parse error in removeParagraph, using current object:", parseErr);
          }
        }
        
        const paragraphs = Array.isArray(currentContent[arrayField]) 
          ? [...currentContent[arrayField]] 
          : [''];
        
        if (paragraphs.length > 1) {
          paragraphs.splice(index, 1);
          
          const updatedContent = { ...currentContent, [arrayField]: paragraphs };
          
          setFormData(prev => ({
            ...prev,
            coverLetterContent: JSON.stringify(updatedContent, null, 2)
          }));
        }
      } catch (err) {
        console.error("❌ Error removing paragraph:", err);
      }
    };
    
    const bodyField = contentObject.body_paragraphs 
      ? 'body_paragraphs' 
      : (contentObject.body ? 'body' : 'body_paragraphs');
    
    return (
      <div className="space-y-3">
        <div className="mb-2">
          <label className="block text-xs font-medium mb-1">
            {t('coverLetterEditor.fields.greeting', 'Greeting')}
          </label>
          <input
            type="text"
            value={contentObject.greeting || ''}
            onChange={(e) => updateContentField('greeting', e.target.value)}
            className={`w-full p-1.5 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'}`}
            placeholder={t('coverLetterEditor.placeholders.greeting', 'Dear Hiring Manager,')}
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-xs font-medium mb-1">
            {t('coverLetterEditor.fields.introduction', 'Introduction')}
          </label>
          <textarea
            value={contentObject.introduction || ''}
            onChange={(e) => updateContentField('introduction', e.target.value)}
            rows={2}
            className={`w-full p-1.5 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'}`}
            placeholder={t('coverLetterEditor.placeholders.introduction', 'I am writing to express my interest in...')}
          />
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium">
              {t('coverLetterEditor.fields.bodyParagraphs', 'Body Paragraphs')}
            </label>
            <button
              type="button"
              onClick={() => addParagraph(bodyField)}
              className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-sm hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
            >
              {t('coverLetterEditor.buttons.addParagraph', '+ Add Paragraph')}
            </button>
          </div>
          
          {Array.isArray(contentObject[bodyField]) ? (
            contentObject[bodyField].map((paragraph, index) => (
              <div key={index} className="mb-2 relative">
                <textarea
                  value={paragraph}
                  onChange={(e) => updateParagraph(bodyField, index, e.target.value)}
                  rows={2}
                  className={`w-full p-1.5 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} pr-8`}
                  placeholder={t('coverLetterEditor.placeholders.bodyParagraph', 'Describe your relevant experience...')}
                />
                {contentObject[bodyField].length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(bodyField, index)}
                    className="absolute top-1.5 right-1.5 text-red-500 hover:text-red-700 text-xs"
                    title={t('coverLetterEditor.buttons.removeParagraph', 'Remove Paragraph')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="mb-2">
              <button
                type="button"
                onClick={() => updateContentField(bodyField, [''])}
                className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-sm hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
              >
                {t('coverLetterEditor.buttons.initializeParagraphs', 'Initialize Body Paragraphs')}
              </button>
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <label className="block text-xs font-medium mb-1">
            {t('coverLetterEditor.fields.closing', 'Closing')}
          </label>
          <textarea
            value={contentObject.closing || ''}
            onChange={(e) => updateContentField('closing', e.target.value)}
            rows={2}
            className={`w-full p-1.5 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'}`}
            placeholder={t('coverLetterEditor.placeholders.closing', 'I am excited about the opportunity...')}
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-xs font-medium mb-1">
            {t('coverLetterEditor.fields.signature', 'Signature')}
          </label>
          <input
            type="text"
            value={contentObject.signature || ''}
            onChange={(e) => updateContentField('signature', e.target.value)}
            className={`w-full p-1.5 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'}`}
            placeholder={t('coverLetterEditor.placeholders.signature', 'Sincerely, [Your Name]')}
          />
        </div>
      </div>
    );
  };
  
  const handleSave = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      
      // Validate JSON content
      try {
        JSON.parse(formData.coverLetterContent);
      } catch (err) {
        console.error('❌ Error parsing content during save:', err);
        toast.error(t('coverLetterEditor.errors.invalidJson', 'Invalid content format'));
        return;
      }
      
      // Prepare update data
      const updateData = {
        title: formData.title,
        company_name: formData.companyName,
        job_title: formData.jobTitle,
        recipient_name: formData.recipientName,
        recipient_title: formData.recipientTitle,
        job_description: formData.jobDescription,
        cover_letter_content: formData.coverLetterContent,
        updated_at: new Date().toISOString()
      };
      
      console.log("💾 Saving cover letter:", updateData);
      
      const result = await updateCoverLetter(id, updateData);
      console.log("✅ Cover letter saved:", result);
      
      toast.success(t('coverLetterEditor.success.save', 'Cover letter saved successfully'));
      
      // Update the preview if in preview mode
      if (previewMode) {
        const tempLetter = {
          ...currentLetter,
          ...updateData
        };
        const formatted = formatCoverLetter(tempLetter);
        setFormattedLetter(formatted);
      }
    } catch (err) {
      console.error('❌ Error saving cover letter:', err);
      toast.error(t('coverLetterEditor.errors.save', 'Failed to save cover letter'));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Show loading state if still initializing or loading data
  if (!isInitialized || isLoading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        <div className="text-center">
          <svg className="animate-spin h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xs font-semibold">{t('common.loading', 'Loading cover letter...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 px-4 pt-4 pb-4 max-w-4xl mx-auto">
        <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800/70 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-100'} p-4`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold">{t('coverLetterEditor.title', 'Edit Cover Letter')}</h1>
              <p className="text-sm opacity-75">
                {currentLetter?.title || formData.title || t('common.loading', 'Loading...')}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/cover-letters')}
                disabled={isSaving}
                className={`px-3 py-1 text-sm rounded-md transition-all duration-300 ${
                  isSaving 
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {t('common.cancel', 'Cancel')}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-3 py-1 text-sm rounded-md transition-all duration-300 ${
                  isSaving
                    ? 'opacity-50 cursor-not-allowed bg-gray-500'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-md hover:shadow-purple-500/20 hover:scale-105'
                } text-white`}
              >
                {isSaving ? t('common.saving', 'Saving...') : t('common.save_changes', 'Save Changes')}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex">
              <button
                className={`py-2 px-3 text-sm font-medium ${
                  !previewMode 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setPreviewMode(false)}
              >
                {t('coverLetterEditor.tabs.edit', 'Edit')}
              </button>
              
              <button
                className={`py-2 px-3 text-sm font-medium ${
                  previewMode 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setPreviewMode(true)}
              >
                {t('coverLetterEditor.tabs.preview', 'Preview')}
              </button>
            </div>
          </div>
          
          {previewMode ? (
            /* Preview Mode */
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{formData.title || t('CoverLetter.title', 'Cover Letter')}</h2>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(formattedLetter);
                      toast.success(t('coverLetters.success.copied', 'Cover letter copied to clipboard!'));
                    }}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    {t('common.copy', 'Copy')}
                  </button>
                  <button 
                    onClick={() => {
                      const blob = new Blob([formattedLetter], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${formData.title || 'Cover_Letter'}.txt`.replace(/\s+/g, '_');
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast.success(t('coverLetters.success.downloaded', 'Cover letter downloaded!'));
                    }}
                    className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:shadow-sm hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
                  >
                    {t('common.download', 'Download')}
                  </button>
                </div>
              </div>
              
              <div className="overflow-auto mb-4">
                <div className={`whitespace-pre-wrap font-serif border p-4 rounded-lg shadow-inner min-h-[400px] text-sm ${
                  darkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white/90 border-gray-300 text-gray-800'
                }`}>
                  {formattedLetter || t('CoverLetter.preview.empty_state', 'Preview will appear here...')}
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('coverLetterEditor.fields.title', 'Cover Letter Title')} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-2 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.title', 'Enter cover letter title')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('coverLetterEditor.fields.companyName', 'Company Name')}
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full p-2 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.companyName', 'Enter company name')}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('coverLetterEditor.fields.jobTitle', 'Job Title')}
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={`w-full p-2 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.jobTitle', 'Enter job title')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('coverLetterEditor.fields.recipientName', 'Recipient Name')}
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className={`w-full p-2 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.recipientName', 'Hiring Manager Name')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('coverLetterEditor.fields.recipientTitle', 'Recipient Title')}
                </label>
                <input
                  type="text"
                  name="recipientTitle"
                  value={formData.recipientTitle}
                  onChange={handleInputChange}
                  className={`w-full p-2 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                  placeholder={t('coverLetterEditor.placeholders.recipientTitle', 'Hiring Manager Title')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('coverLetterEditor.fields.jobDescription', 'Job Description')}
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full p-2 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                  placeholder={t('coverLetterEditor.placeholders.jobDescription', 'Paste the job description here...')}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    {t('coverLetterEditor.fields.coverLetterContent', 'Cover Letter Content')}
                  </label>
                </div>
                
                {renderRichEditor()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterEditor;