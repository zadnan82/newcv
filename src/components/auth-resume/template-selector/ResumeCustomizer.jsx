import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  
import { useTranslation } from 'react-i18next';
import TemplateSelector from './TemplateSelector'; 
import TemplateRenderer from './TemplateRenderer';
import ColorSelector from './ColorSelector';
import FontSelector from './FontSelector';
import HeadersStyleSelector from './HeadersStyleSelector';
import SkillLevelToggle from './SkillLevelToggle'; 
import useAuthStore from '../../../stores/authStore';
import useResumeStore from '../../../stores/resumeStore';
import ResumeQRCode from '../public-cv/ResumeQRCode';
import API_BASE_URL from '../../../config';
import PublicToggle from './PublicToggle';
import SaveCustomizationsButton from './SaveCustomizationsButton'; 
import { exportToDocx } from '../view-cv/js/Exportdocx';
import SaveConfirmationModal from './SaveConfirmationModal';
 
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return windowSize;
};
 
const addGlobalStyles = () => {
  const styleId = 'resume-customizer-animations';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.innerHTML = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fade-out {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
      }
      
      .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
      }
      
      .animate-fade-out {
        animation: fade-out 0.3s ease-in forwards;
      }
    `;
    document.head.appendChild(styleElement);
  }
}; 
addGlobalStyles();

export const ResumeCustomizer = ({ darkMode = false, formData: propFormData }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate(); 
  const resumeId = location.state?.resumeId; 
  const { token } = useAuthStore();
  const { currentResume, loading, fetchResume } = useResumeStore();  
  const { width } = useWindowSize();
  const isMobile = width < 768;  
  const [resumeData, setResumeData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('stockholm');
  const [customSettings, setCustomSettings] = useState({
    accentColor: '#6366f1', // Changed to match the purple from Home
    fontFamily: 'Helvetica, Arial, sans-serif',
    lineSpacing: 1.5,
    headingsUppercase: false,
    hideSkillLevel: false
  });
  const [previewScale, setPreviewScale] = useState(isMobile ? 0.5 : 0.7); // Reduced scale
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);  
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [activeTab, setActiveTab] = useState('templates');
  const resumeRef = useRef(null); 
  const isDarkMode = darkMode;
  const isRTL = i18n.dir() === 'rtl';
  
  useEffect(() => {
    if (!resumeId) { 
      setLocalError("No resume ID provided. Please create a resume first.");
      return;
    }
    fetchResume(resumeId);
  }, [resumeId, fetchResume]);
  
  useEffect(() => {
    setSidebarVisible(!isMobile);
  }, [isMobile]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) { 
        useResumeStore.setState(state => ({
          ...state,
          loading: false
        }));
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading]);
  

  useEffect(() => {
  // NEW: Handle data from NewResumeBuilder when no resumeId exists
  if (!resumeId) {
    console.log('No resumeId, checking for NewResumeBuilder data...');
    
    // Check for data from NewResumeBuilder
    const draftData = localStorage.getItem('cv_draft_for_customization');
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData);
        console.log('Found NewResumeBuilder draft data:', parsedData);
        
        setResumeData(parsedData);
        
        // Set customization from the draft data if available
        if (parsedData.customization) {
          setSelectedTemplate(parsedData.customization.template || 'stockholm');
          setCustomSettings({
            accentColor: parsedData.customization.accent_color || '#6366f1',
            fontFamily: parsedData.customization.font_family || 'Helvetica, Arial, sans-serif',
            lineSpacing: parsedData.customization.line_spacing || 1.5,
            headingsUppercase: parsedData.customization.headings_uppercase || false,
            hideSkillLevel: parsedData.customization.hide_skill_level || false
          });
        }
        
        // Clear the draft data since we've loaded it
        localStorage.removeItem('cv_draft_for_customization');
        
        setLocalError(null); // Clear any error
      } catch (error) {
        console.error('Error parsing NewResumeBuilder draft:', error);
        setLocalError("Error loading CV data from editor.");
      }
    } else {
      // No resumeId and no draft data
      setLocalError("No resume data found. Please create a resume first or return from the CV builder.");
    }
  }
}, [resumeId]); // Add resumeId as dependency

// ALSO ADD this to handle going back to NewResumeBuilder:
const handleBackToNewResumeBuilder = () => {
  // Save current customizations back to NewResumeBuilder format
  const updatedData = {
    ...resumeData,
    customization: {
      template: selectedTemplate,
      accent_color: customSettings.accentColor,
      font_family: customSettings.fontFamily,
      line_spacing: customSettings.lineSpacing,
      headings_uppercase: customSettings.headingsUppercase,
      hide_skill_level: customSettings.hideSkillLevel
    }
  };
  
  // Save to the draft that NewResumeBuilder will read
  localStorage.setItem('cv_draft', JSON.stringify(updatedData));
  
  // Navigate back to NewResumeBuilder
  navigate('/new-resume');
};

  const updateSetting = (key, value) => {
    setCustomSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
 
  const zoomIn = () => {
    setPreviewScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const zoomOut = () => {
    setPreviewScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleExport = (format) => {
    setPendingAction(format);
    setShowSaveConfirmation(true);
  };
   
  const handleSaveAndContinue = async () => {
    try {
      setIsExporting(true);
      console.log('Saving customizations for resume ID:', resumeId);
      
      const url = `${API_BASE_URL}/resume/${resumeId}/customization`;
      
      const customizationData = {
        template: selectedTemplate,
        accent_color: customSettings.accentColor || '#6366f1',
        font_family: customSettings.fontFamily || 'Helvetica, Arial, sans-serif',
        line_spacing: customSettings.lineSpacing || 1.5,
        headings_uppercase: customSettings.headingsUppercase || false,
        hide_skill_level: customSettings.hideSkillLevel || false
      };
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(customizationData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to save customizations');
      }
      
      // Success notification
      const successToast = document.createElement('div');
      successToast.className = `fixed bottom-4 ${isRTL ? 'left-4' : 'right-4'} p-4 rounded-md ${isDarkMode ? 'bg-green-800' : 'bg-green-600'} text-white shadow-lg z-50 animate-fade-in`;
      successToast.innerHTML = '✓ ' + t('resume.customizer.saveCustomizations.success');
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        successToast.classList.add('animate-fade-out');
        setTimeout(() => document.body.removeChild(successToast), 500);
      }, 3000);
      
      // Close modal and continue
      setShowSaveConfirmation(false);
      continueWithAction();
    } catch (error) {
      console.error('Error saving customizations:', error);
      alert(t('resume.customizer.saveConfirmation.error'));
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleContinueWithoutSaving = () => {
    setShowSaveConfirmation(false);
    continueWithAction();
  };
  
  const continueWithAction = () => {
    if (pendingAction === 'PDF') {
      navigate(`/resume/${currentResume.id}`);
    } else if (pendingAction === 'DOCX') {
      exportToDocx(currentResume);
    }
    
    setPendingAction(null);
  };
     
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-black'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent mb-3"></div>
          <p className="text-sm">{t('resume.customizer.loading')}</p>
        </div>
      </div>
    );
  }
    
  if (localError) {
  return (
    <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-black'}`}>
      <div className={`text-center max-w-md p-5 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className={`mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full ${isDarkMode ? 'bg-red-900' : 'bg-red-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold mb-2">{t('common.error')}</h2>
        <p className="mb-4 text-sm">{localError}</p>
        <div className="flex gap-2 justify-center">
          <button 
            onClick={handleBackToNewResumeBuilder}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            Back to CV Builder
          </button>
          <button 
            onClick={() => navigate('/my-resumes')}
            className="px-4 py-1.5 rounded-full bg-gray-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {t('resume.customizer.goBack')}
          </button>
        </div>
      </div>
    </div>
  );
}
    
  if (!resumeData && !currentResume) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-black'}`}>
        <div className={`text-center max-w-md p-5 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
          <div className={`mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-2">{t('resume.customizer.noResume')}</h2>
          <p className="mb-4 text-sm">{t('resume.customizer.pleaseCreate')}</p>
          <button 
            onClick={() => navigate('/resume')}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {t('resume.customizer.goToBuilder')}
          </button>
        </div>
      </div>
    );
  }
   
  return (
    <div 
      className={`flex flex-col h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Elements from Home.jsx */}
      {!isDarkMode && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        </div>
      )}
      
      {/* Redesigned header with brand and navigation */}
      <header className={`relative z-10 px-3 py-2 flex items-center justify-between shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className={`md:hidden p-1.5 rounded-md ${isRTL ? 'ml-2' : 'mr-2'} ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            {sidebarVisible ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            }
          </button>
          <button
            className={`py-1.5 px-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center ${isRTL ? 'ml-2' : 'mr-2'}`}
            onClick={() => handleExport('DOCX')}
            disabled={isExporting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            DOCX
          </button>
          <button
            className="py-1.5 px-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center"
            onClick={() => handleExport('PDF')}
            disabled={isExporting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
           PDF
          </button>
        </div>
        
        <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}> 
          {/* Preview controls */}
          <div className="flex items-center rounded-md">
            <button 
              onClick={zoomOut}
              className={`p-1 ${isRTL ? 'rounded-r-md' : 'rounded-l-md'} ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              disabled={previewScale <= 0.5}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <span className={`px-2 text-xs flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
              {Math.round(previewScale * 100)}%
            </span>
            <button 
              onClick={zoomIn}
              className={`p-1 ${isRTL ? 'rounded-l-md' : 'rounded-r-md'} ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              disabled={previewScale >= 1.5}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Redesigned sidebar with tabs for better organization */}
        <aside 
          className={`
            ${isRTL 
              ? (sidebarVisible ? 'translate-x-0' : 'translate-x-full') 
              : (sidebarVisible ? 'translate-x-0' : '-translate-x-full')}
            transition-transform duration-300 ease-in-out
            md:translate-x-0
            w-full md:w-64 lg:w-72
            flex flex-col
            ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}
            shadow-lg md:shadow-md
            z-20 md:z-auto
            absolute md:relative
            h-[calc(100%-3rem)] md:h-auto
            overflow-hidden
            ${isRTL ? 'right-0' : 'left-0'}
          `}
        >
          {/* Tab navigation */}
          <div className={`flex w-full border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              className={`flex-1 py-2 text-xs font-medium transition-colors 
                ${activeTab === 'templates' 
                  ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
              `}
              onClick={() => setActiveTab('templates')}
            >
              {t('resume.customizer.templates.templates')}
            </button>
            <button 
              className={`flex-1 py-2 text-xs font-medium transition-colors 
                ${activeTab === 'styling' 
                  ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
              `}
              onClick={() => setActiveTab('styling')}
            >
              {t('resume.customizer.templates.styling')}
            </button>
            <button 
              className={`flex-1 py-2 text-xs font-medium transition-colors 
                ${activeTab === 'sharing' 
                  ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
              `}
              onClick={() => setActiveTab('sharing')}
            >
              {t('resume.customizer.templates.sharing')}
            </button>
          </div>
          
          {/* Tab content with scrollable area */}
          <div className="flex-1 overflow-y-auto p-3">
            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div>
                <TemplateSelector 
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
            
            {/* Styling Tab */}
            {activeTab === 'styling' && (
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('resume.customizer.templates.styles')}
                </h3>
                
                {/* Color selector */}
                <div className="mb-4">
                  <ColorSelector
                    value={customSettings.accentColor}
                    onChange={(color) => updateSetting('accentColor', color)}
                    isDarkMode={isDarkMode}
                    isRTL={isRTL}
                  />
                </div>
                
                {/* Font selector */}
                <div className="mb-4">
                  <FontSelector 
                    value={customSettings.fontFamily}
                    onChange={(font) => updateSetting('fontFamily', font)}
                    isDarkMode={isDarkMode}
                    isRTL={isRTL}
                  />
                </div>
                
                {/* Line spacing */}
                <div className="mb-4">
                  <h4 className={`mb-1 text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('resume.customizer.spacing.title')}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('resume.customizer.spacing.compact')}
                    </span>
                    <input
                      type="range"
                      min="1.2"
                      max="2"
                      step="0.1"
                      value={customSettings.lineSpacing}
                      onChange={(e) => updateSetting('lineSpacing', parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('resume.customizer.spacing.spacious')}
                    </span>
                  </div>
                </div>
                
                {/* Headers style selector */}
                <div className="mb-4">
                  <HeadersStyleSelector
                    value={customSettings.headingsUppercase}
                    onChange={(value) => updateSetting('headingsUppercase', value)}
                    isDarkMode={isDarkMode}
                    isRTL={isRTL}
                  />
                </div>
                
                {/* Skill level display toggle */}
                <div className="mb-4">
                  <SkillLevelToggle
                    value={customSettings.hideSkillLevel}
                    onChange={(value) => updateSetting('hideSkillLevel', value)}
                    isDarkMode={isDarkMode}
                    isRTL={isRTL}
                  />
                </div>
              </div>
            )}
            
            {/* Sharing Tab */}
            {activeTab === 'sharing' && (
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('resume.customizer.templates.sharing')}
                </h3>
                
                {/* Save customizations */}
                <div className="mb-4">
                  <SaveCustomizationsButton 
                    resumeId={resumeId} 
                    selectedTemplate={selectedTemplate}
                    customSettings={customSettings}
                    isDarkMode={isDarkMode}
                    isRTL={isRTL}
                    onSaveSuccess={(data) => {
                      console.log("Customizations saved successfully:", data);
                    }}
                  />
                </div>
                
                {/* Public toggle */}
                <div className="mb-4">
                  <PublicToggle 
                    resumeId={resumeId}
                    isPublic={currentResume?.is_public || false}
                    isDarkMode={isDarkMode}
                    isRTL={isRTL}
                  />
                </div>
                
                {/* QR Code */}
                <div className="mb-4">
                  <ResumeQRCode 
                    resumeId={resumeId}
                    customSettings={{
                      template: selectedTemplate,
                      accentColor: customSettings.accentColor,
                      fontFamily: customSettings.fontFamily,
                      lineSpacing: customSettings.lineSpacing,
                      headingsUppercase: customSettings.headingsUppercase,
                      hideSkillLevel: customSettings.hideSkillLevel
                    }}
                    isDarkMode={isDarkMode}
                    isRTL={isRTL}
                    userData={resumeData || currentResume}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile only - close sidebar button */}
          {isMobile && sidebarVisible && (
            <div className={`p-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={toggleSidebar}
                className={`w-full py-1.5 rounded-md text-xs transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t('resume.customizer.closeOptions')}
              </button>
            </div>
          )}
        </aside>
        
        {/* Resume preview area */}
        <main className={`flex-1 overflow-auto p-3 relative z-10 ${isDarkMode ? 'bg-gray-900' : 'bg-transparent'} transition-colors duration-200`}>
          <div className="mx-auto max-w-4xl">
            <div 
              style={{ transform: `scale(${previewScale})` }}
              className="origin-top rounded-lg shadow-xl overflow-hidden transition-transform duration-200"
              ref={resumeRef}
            >
              <TemplateRenderer
                templateId={selectedTemplate}
                formData={resumeData || currentResume}
                customSettings={customSettings}
                darkMode={isDarkMode}
                isRTL={isRTL} 
                scale={1} // Scale is handled by the container
              />
            </div>
          </div>
        </main>
      </div>
      
      {/* Save confirmation modal */}
      <SaveConfirmationModal
        isOpen={showSaveConfirmation}
        onClose={() => setShowSaveConfirmation(false)}
        onSave={handleSaveAndContinue}
        onContinue={handleContinueWithoutSaving}
        isDarkMode={isDarkMode}
        isRTL={isRTL}
      />
    </div>
  );
};

export default ResumeCustomizer;