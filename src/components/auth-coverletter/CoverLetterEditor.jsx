import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCoverLetterStore from '../../stores/coverLetterStore';
import useResumeStore from '../../stores/resumeStore';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const CoverLetterEditor = ({ darkMode }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Access stores
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const currentLetter = useCoverLetterStore(state => state.currentLetter);
  const getCoverLetter = useCoverLetterStore(state => state.getCoverLetter);
  const updateCoverLetter = useCoverLetterStore(state => state.updateCoverLetter);
  const isLoading = useCoverLetterStore(state => state.isLoading);
  const error = useCoverLetterStore(state => state.error);
  const clearError = useCoverLetterStore(state => state.clearError);
  const formatCoverLetter = useCoverLetterStore(state => state.formatCoverLetter);

  const currentResume = useResumeStore(state => state.currentResume);
  const fetchResume = useResumeStore(state => state.fetchResume);
  
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
  
  // Check authentication and fetch cover letter
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/cover-letter/${id}/edit` } });
      return;
    }
    
    const loadCoverLetter = async () => {
      try {
        await getCoverLetter(id);
      } catch (err) {
        console.error('Error loading cover letter:', err);
        toast.error(t('coverLetterEditor.errors.load', 'Failed to load cover letter'));
      }
    };
    
    loadCoverLetter();
  }, [id, isAuthenticated]);
  
  // Set form data when letter loads
  useEffect(() => {
    if (currentLetter) {
      //console.log("Setting form data from current letter:", currentLetter);
      
      // Try to parse the cover letter content
      let contentStr = '';
      
      try {
        // Check if cover_letter_content exists
        if (!currentLetter.cover_letter_content) {
          console.log("No cover letter content found, using default empty structure");
          contentStr = JSON.stringify({
            greeting: 'Dear Hiring Manager,',
            introduction: '',
            body_paragraphs: [''],
            closing: '',
            signature: 'Sincerely,'
          }, null, 2);
        } else if (typeof currentLetter.cover_letter_content === 'string') {
          //console.log("Cover letter content is a string:", currentLetter.cover_letter_content.substring(0, 100) + "...");
          contentStr = currentLetter.cover_letter_content;
          
          // Try to validate it's proper JSON
          try {
            JSON.parse(contentStr);
          } catch (jsonErr) {
            console.log("Not valid JSON, checking for markdown format");
            
            // If the content has markdown formatting, use it as is
            if (contentStr.includes('```json')) {
              // It's already in the right format
              console.log("Content appears to be in markdown format");
            } else {
              // Wrap non-JSON string in a basic content structure
              console.log("Wrapping content in a basic structure");
              contentStr = JSON.stringify({
                greeting: 'Dear Hiring Manager,',
                introduction: contentStr,
                body_paragraphs: [],
                closing: '',
                signature: 'Sincerely,'
              }, null, 2);
            }
          }
        } else {
          // It's an object, stringify it
          //console.log("Cover letter content is an object");
          contentStr = JSON.stringify(currentLetter.cover_letter_content, null, 2);
        }
      } catch (err) {
        console.error('Error processing cover letter content:', err);
        // Provide a default structure
        contentStr = JSON.stringify({
          greeting: 'Dear Hiring Manager,',
          introduction: '',
          body_paragraphs: [''],
          closing: '',
          signature: 'Sincerely,'
        }, null, 2);
      }
      
      //console.log("Final content string being set:", contentStr.substring(0, 100) + "...");
      
      setFormData({
        title: currentLetter.title || '',
        companyName: currentLetter.company_name || '',
        jobTitle: currentLetter.job_title || '',
        recipientName: currentLetter.recipient_name || '',
        recipientTitle: currentLetter.recipient_title || '',
        jobDescription: currentLetter.job_description || '',
        coverLetterContent: contentStr
      });
      
      // Also load formatted letter for preview
      const formatted = formatCoverLetter(currentLetter);
      setFormattedLetter(formatted);
      
      // If there's a resume ID, fetch that resume
      if (currentLetter.resume_id) {
        fetchResume(currentLetter.resume_id).catch(err => {
          console.error('Error fetching linked resume:', err);
        });
      }
    }
  }, [currentLetter]); 
  
  useEffect(() => {
    if (previewMode) {
      try {
        //console.log("Updating preview with current form data");
        
        // Get personal info from the resume if available
        let personalInfo = {
          full_name: '',
          email: '',
          mobile: ''
        };
        
        if (currentResume && currentResume.personal_info) {
          personalInfo = {
            full_name: currentResume.personal_info.full_name || '',
            email: currentResume.personal_info.email || '',
            mobile: currentResume.personal_info.mobile || ''
          };
        }
        
        // Create a temporary letter object with the current form data
        const tempLetter = {
          title: formData.title,
          company_name: formData.companyName,
          job_title: formData.jobTitle,
          recipient_name: formData.recipientName,
          recipient_title: formData.recipientTitle,
          job_description: formData.jobDescription,
          cover_letter_content: formData.coverLetterContent,
          author_name: personalInfo.full_name,
          author_email: personalInfo.email,
          author_phone: personalInfo.mobile
        };
        
        // Use the new formatter for nested content
        const formattedLetter = formatCoverLetter(tempLetter);
        
        // Update the preview
        setFormattedLetter(formattedLetter);
        //console.log("Preview updated successfully:", formattedLetter.substring(0, 100) + "...");
      } catch (err) {
        console.error('Error formatting preview:', err);
        toast.error(t('coverLetterEditor.errors.preview', 'Failed to generate preview'));
      }
    }
  }, [previewMode, formData, currentResume]);

  // Effect for error handling
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const togglePreviewMode = () => {
    setPreviewMode(prev => !prev);
  };
  
  // Helper function to render a rich editor for the cover letter content
  const renderRichEditor = () => {
    // Default empty structure
    let contentObject = {
      greeting: 'Dear Hiring Manager,',
      introduction: '',
      body_paragraphs: [''],
      closing: '',
      signature: 'Sincerely,'
    };
    
    // Only try to parse if we have content
    if (formData.coverLetterContent && formData.coverLetterContent.trim() !== '') {
      try {
        // First try parsing as regular JSON
        try {
          contentObject = JSON.parse(formData.coverLetterContent);
        } catch (firstErr) {
          console.log("Direct JSON parse failed, trying alternatives");
          
          // If that fails, check if it's markdown-formatted JSON
          if (typeof formData.coverLetterContent === 'string' && formData.coverLetterContent.includes('```json')) {
            const jsonContent = formData.coverLetterContent
              .replace(/```json\n/, '')
              .replace(/\n```$/, '');
            try {
              contentObject = JSON.parse(jsonContent);
            } catch (err) {
              console.log("Failed to parse markdown JSON");
            }
          } else if (typeof formData.coverLetterContent === 'string') {
            // Check if it's an object with a content property containing markdown
            try {
              const parsedObj = JSON.parse(formData.coverLetterContent);
              if (parsedObj.content && typeof parsedObj.content === 'string' && parsedObj.content.includes('```json')) {
                const jsonContent = parsedObj.content
                  .replace(/```json\n/, '')
                  .replace(/\n```$/, '');
                try {
                  contentObject = JSON.parse(jsonContent);
                } catch (err) {
                  console.log("Failed to parse nested markdown JSON");
                  contentObject = parsedObj;
                }
              } else {
                contentObject = parsedObj;
              }
            } catch (err) {
              console.log("Failed to parse as JSON object with content");
              // Initialize with default structure
            }
          }
        }
      } catch (err) {
        console.error('Error parsing content for rich editor:', err);
        console.log('Content that failed to parse:', formData.coverLetterContent);
        // Continue with the default structure
      }
    } else {
      //console.log("No content to parse, using default structure");
      // Initialize with empty structure for a new letter
      // We'll use the default contentObject defined above
    }
    
    // Helper function to update a specific field in the content object
    const updateContentField = (field, value) => {
      const updatedContent = { ...contentObject, [field]: value };
      setFormData(prev => ({
        ...prev,
        coverLetterContent: JSON.stringify(updatedContent, null, 2)
      }));
    };
    
    // Helper to update a paragraph in an array
    const updateParagraph = (arrayField, index, value) => {
      const paragraphs = Array.isArray(contentObject[arrayField]) 
        ? [...contentObject[arrayField]] 
        : [];
      
      paragraphs[index] = value;
      
      const updatedContent = { ...contentObject, [arrayField]: paragraphs };
      setFormData(prev => ({
        ...prev,
        coverLetterContent: JSON.stringify(updatedContent, null, 2)
      }));
    };
    
    // Helper to add a new paragraph
    const addParagraph = (arrayField) => {
      const paragraphs = Array.isArray(contentObject[arrayField]) 
        ? [...contentObject[arrayField]] 
        : [];
      
      paragraphs.push('');
      
      const updatedContent = { ...contentObject, [arrayField]: paragraphs };
      setFormData(prev => ({
        ...prev,
        coverLetterContent: JSON.stringify(updatedContent, null, 2)
      }));
    };
    
    // Helper to remove a paragraph
    const removeParagraph = (arrayField, index) => {
      const paragraphs = Array.isArray(contentObject[arrayField]) 
        ? [...contentObject[arrayField]] 
        : [];
      
      paragraphs.splice(index, 1);
      
      const updatedContent = { ...contentObject, [arrayField]: paragraphs };
      setFormData(prev => ({
        ...prev,
        coverLetterContent: JSON.stringify(updatedContent, null, 2)
      }));
    };
    
    // Determine which array field to use for body paragraphs
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
              </div>
            ))
          ) : (
            <div className="mb-2">
              <button
                type="button"
                onClick={() => updateContentField(bodyField, [])}
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
            placeholder={t('coverLetterEditor.placeholders.closing', 'I am excited about the opportunity to join your team...')}
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
    try {
      // Validate JSON content
      try {
        JSON.parse(formData.coverLetterContent);
      } catch (err) {
        console.error('Error parsing content during save:', err);
        toast.error(t('coverLetterEditor.errors.invalidJson', 'Invalid JSON format in cover letter content'));
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
        cover_letter_content: formData.coverLetterContent
      };
      
      console.log("Saving content:", updateData);
      
      const updatedLetter = await updateCoverLetter(id, updateData);
      console.log("Server response after save:", updatedLetter);
      
      toast.success(t('coverLetterEditor.success.save', 'Cover letter saved successfully'));
      
      // Update the preview after saving
      if (previewMode) {
        const formatted = formatCoverLetter({
          ...currentLetter,
          ...updateData
        });
        setFormattedLetter(formatted);
      }
    } catch (err) {
      console.error('Error saving cover letter:', err);
      toast.error(t('coverLetterEditor.errors.save', 'Failed to save cover letter'));
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 flex justify-center items-center">
        <div className="text-center">
          <svg className="animate-spin h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xs font-semibold">{t('common.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}>
      {/* Background Elements - decorative elements similar to cards but more subtle */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 px-4 pt-4 pb-4 max-w-3xl mx-auto">
        <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800/70 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-100'} p-3`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-lg font-bold">
              {t('coverLetterEditor.title', 'Edit Cover Letter')}
            </h1>
            
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/cover-letters')}
                className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              
              <button
                onClick={handleSave}
                className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-full shadow-sm transition-all duration-300 hover:shadow-purple-500/20 hover:scale-105"
              >
                {t('common.save', 'Save')}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-3">
            <div className="flex">
              <button
                className={`py-1 px-2 text-xs font-medium ${
                  !previewMode 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setPreviewMode(false)}
              >
                {t('coverLetterEditor.tabs.edit', 'Edit')}
              </button>
              
              <button
                className={`py-1 px-2 text-xs font-medium ${
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
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-semibold">{formData.title}</h2>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(formattedLetter);
                      toast.success(t('coverLetterEditor.success.copied', 'Cover letter copied to clipboard!'));
                    }}
                    className="px-2 py-0.5 text-xs bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    {t('common.copy', 'Copy')}
                  </button>
                  <button 
                    onClick={() => {
                      const blob = new Blob([formattedLetter], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Cover_Letter_${formData.jobTitle || 'Untitled'}.txt`.replace(/\s+/g, '_');
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast.success(t('coverLetterEditor.success.downloaded', 'Cover letter downloaded successfully'));
                    }}
                    className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-sm hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
                  >
                    {t('common.download', 'Download')}
                  </button>
                </div>
              </div>
              
              <div className="overflow-auto mb-3">
                <div className="whitespace-pre-wrap font-serif border p-2 rounded-lg bg-white text-black shadow-inner min-h-[250px] text-xs">
                  {formattedLetter}
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    {t('coverLetterEditor.fields.title', 'Cover Letter Title')} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-1 text-xs rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.title', 'Cover Letter for [Position] at [Company]')}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">
                    {t('coverLetterEditor.fields.companyName', 'Company Name')}
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full p-1 text-xs rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.companyName', 'Company Name')}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">
                    {t('coverLetterEditor.fields.jobTitle', 'Job Title')}
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={`w-full p-1 text-xs rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.jobTitle', 'Position Title')}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">
                    {t('coverLetterEditor.fields.recipientName', 'Recipient Name')}
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className={`w-full p-1 text-xs rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.recipientName', 'Hiring Manager Name')}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">
                    {t('coverLetterEditor.fields.recipientTitle', 'Recipient Title')}
                  </label>
                  <input
                    type="text"
                    name="recipientTitle"
                    value={formData.recipientTitle}
                    onChange={handleInputChange}
                    className={`w-full p-1.5 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                    placeholder={t('coverLetterEditor.placeholders.recipientTitle', 'Hiring Manager Title')}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1">
                  {t('coverLetterEditor.fields.jobDescription', 'Job Description')}
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-1.5 text-sm rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                  placeholder={t('coverLetterEditor.placeholders.jobDescription', 'Paste the job description here...')}
                />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium">
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