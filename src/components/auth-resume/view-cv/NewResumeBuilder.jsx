 // src/components/auth-resume/view-cv/NewResumeBuilder.jsx - REWRITTEN CLEAN VERSION
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; 
import { Eye, Edit, ChevronLeft, ChevronRight, Menu, X, Save, HardDrive, Cloud, CheckCircle, AlertCircle, Loader2, Palette, Sparkles } from 'lucide-react';

// Import components
import Education from '../builder/Education';
import Experience from '../builder/Experience';
import Skills from '../builder/Skills';
import Languages from '../builder/Languages';
import Referrals from '../builder/Referrals';
import CustomSections from '../builder/CustomSections';
import ExtracurricularActivities from '../builder/ExtracurricularActivities';
import Hobbies from '../builder/Hobbies';
import Courses from '../builder/Courses';
import Internships from '../builder/Internships'; 
import Alert from '../../shared/Alert';  
import ResumePreview from './ResumePreview';
import PersonalInfo from '../builder/PersonalInfo';  
import ResumeTitle from '../builder/ResumeTitle'; 

// Import simplified components
import useSessionStore from '../../../stores/sessionStore';
import SimpleCloudConnect from '../../clouds/SimpleCloudConnect';
import Base64PhotoUpload from '../builder/Base64PhotoUpload';
import StorageChoiceModal from './StorageChoiceModal';

const NewResumeBuilder = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { t } = useTranslation();
  const { resumeId: paramResumeId } = useParams();
  
  // Session store
  const { 
    connectedProviders,
    canSaveToCloud,
    loading: sessionLoading,
    saveLocally,
    saveToConnectedCloud,
    connectToCloudProvider
  } = useSessionStore();
  
  // Blank resume template - CONSTANT
  const BLANK_RESUME_TEMPLATE = useMemo(() => ({
    title: t('resumeDashboard.defaultTitle'),
    is_public: false,
    customization: {
      template: "stockholm",
      accent_color: "#1a5276",
      font_family: "Helvetica, Arial, sans-serif",
      line_spacing: 1.5,
      headings_uppercase: false,
      hide_skill_level: false,
      language: "en"
    },
    personal_info: {
      full_name: '',
      title: '',
      email: '',
      mobile: '', 
      city: '',
      address: '',
      postal_code: '',
      driving_license: '',
      nationality: '',
      place_of_birth: '',
      date_of_birth: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    educations: [],
    experiences: [],
    skills: [],
    languages: [],
    referrals: [],
    custom_sections: [],
    extracurriculars: [],
    hobbies: [],
    courses: [],
    internships: [],
    photo: { photolink: null }
  }), [t]);
  
  // Add this quick fix at the top of NewResumeBuilder component:
  
  // QUICK FIX: Clear any stuck OAuth processing flags on mount
  useEffect(() => {
    // Clear any stuck OAuth processing from CloudCallback
    const currentUrl = window.location.href;
    if (currentUrl.includes('/new-resume') && window.__OAUTH_PROCESSED__) {
      // Clear the OAuth processing cache if we're in NewResumeBuilder
      const keysToRemove = [];
      for (const key of window.__OAUTH_PROCESSED__) {
        if (key.includes('google_drive')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        window.__OAUTH_PROCESSED__.delete(key);
        if (window.__OAUTH_RESULTS__) {
          window.__OAUTH_RESULTS__.delete(key);
        }
      });
      console.log('🧹 Cleared OAuth cache to prevent loops');
    }
  }, []);

  // Component state
  const [formData, setFormData] = useState(BLANK_RESUME_TEMPLATE);
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('edit');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showCloudSetup, setShowCloudSetup] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [saveType, setSaveType] = useState(null);
  const [showStorageChoice, setShowStorageChoice] = useState(false);
  
  // Auto-save refs
  const autoSaveTimeoutRef = useRef(null);
  const previousDataRef = useRef(null);
  const isInitializedRef = useRef(false);
  
  // Media queries
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isTabletView, setIsTabletView] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      setIsTabletView(window.innerWidth > 768 && window.innerWidth <= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sections configuration
  const sections = useMemo(() => [
    { id: 'title', name: t('resume.title.section'), component: ResumeTitle, dataKey: 'title' },
    { id: 'personal', name: t('resume.personal_info.title'), component: PersonalInfo, dataKey: 'personal_info' },
    { id: 'photo', name: t('resume.photo.title'), component: Base64PhotoUpload, dataKey: 'photo' }, 
    { id: 'education', name: t('resume.education.title'), component: Education, dataKey: 'educations' },
    { id: 'experience', name: t('resume.experience.title'), component: Experience, dataKey: 'experiences' },
    { id: 'skills', name: t('resume.skills.title'), component: Skills, dataKey: 'skills' },
    { id: 'languages', name: t('resume.languages.title'), component: Languages, dataKey: 'languages' },
    { id: 'referrals', name: t('resume.references.title'), component: Referrals, dataKey: 'referrals' },
    { id: 'custom', name: t('resume.custom_sections.title'), component: CustomSections, dataKey: 'custom_sections' },
    { id: 'activities', name: t('resume.extracurricular.activity'), component: ExtracurricularActivities, dataKey: 'extracurriculars' },
    { id: 'hobbies', name: t('resume.hobbies.title'), component: Hobbies, dataKey: 'hobbies' },
    { id: 'courses', name: t('resume.courses.title'), component: Courses, dataKey: 'courses' },
    { id: 'internships', name: t('resume.internships.title'), component: Internships, dataKey: 'internships' }
  ], [t]);
  
  // Computed values
  const hasUserStartedFilling = useMemo(() => {
    return !!(
      formData.personal_info?.full_name || 
      formData.personal_info?.email ||
      formData.experiences?.some(exp => exp?.company || exp?.position) ||
      formData.educations?.some(edu => edu?.institution || edu?.degree)
    );
  }, [formData]);
  
  const CurrentSection = sections.find(s => s.id === activeSection)?.component || PersonalInfo;
   


// Auto-save function
  const autoSave = useCallback((data) => {
    if (!isInitializedRef.current) return;
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    const currentDataString = JSON.stringify(data);
    if (currentDataString === previousDataRef.current) return;
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      try {
        const autoSaveData = {
          ...data,
          _autoSave: {
            timestamp: Date.now(),
            version: '1.0'
          }
        };
        
        localStorage.setItem('cv_draft_autosave', JSON.stringify(autoSaveData));
        localStorage.setItem('cv_draft', JSON.stringify(data)); // Keep existing functionality
        previousDataRef.current = currentDataString;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Auto-saved CV draft');
        }
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
      }
    }, 300);
  }, []);
  
  // Auto-save whenever formData changes
  useEffect(() => {
    if (isInitializedRef.current) {
      autoSave(formData);
    }
  }, [formData, autoSave]);
  
  // Toast function
  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);
  
  // Update form data function
  const updateFormData = useCallback((section, data) => {
    console.log(`📄 Updating section ${section}`);
    
    setFormData(prev => {
      let updatedData;
      
      if (section === 'title') {
        updatedData = { ...prev, title: data };
      } else if (section === 'is_public') {
        updatedData = { ...prev, is_public: data };
      } else if (section === 'customization') {
        updatedData = { ...prev, customization: { ...prev.customization, ...data } };
      } else if (section === 'photo') {
        if (data && typeof data === 'object' && 'photolink' in data) {
          updatedData = { ...prev, photo: data };
        } else if (typeof data === 'string') {
          updatedData = { ...prev, photo: { photolink: data } };
        } else {
          updatedData = { ...prev, photo: { photolink: null } };
        }
      } else if (section === 'personal_info') {
        updatedData = { 
          ...prev, 
          personal_info: { ...prev.personal_info, ...data }
        };
      } else {
        updatedData = { ...prev, [section]: data };
      }
      
      return updatedData;
    });
  }, []);
  
  // Navigation functions
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'edit' ? 'preview' : 'edit');
  }, []);
  
  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen(prev => !prev);
  }, []);
  
  const navigateSection = useCallback((direction) => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    const newIndex = 
      direction === 'next' 
        ? (currentIndex + 1) % sections.length 
        : (currentIndex - 1 + sections.length) % sections.length;
    
    setActiveSection(sections[newIndex].id);
  }, [activeSection, sections]);
  
  // Save handlers
  const clearAutoSave = useCallback(() => {
    localStorage.removeItem('cv_draft_autosave');
  }, []);
  
const handleSaveLocal = useCallback(async () => {
  if (!hasUserStartedFilling) {
    showToast(t('common.error'), 'error');
    return;
  }

  setIsSaving(true);
  setSaveType('local');
  setSaveResult(null);

  try {
    const result = await saveLocally(formData);
    setSaveResult(result);
    if (result.success) {
      localStorage.setItem('last_save_method', 'local');
      setShowStorageChoice(false);
      clearAutoSave();
      showToast('CV saved locally on this device', 'success');
    } else {
      showToast(result.error || t('common.error'), 'error');
    }
  } catch (error) {
    showToast(error.message || t('common.error'), 'error');
  } finally {
    setIsSaving(false);
  }
}, [hasUserStartedFilling, formData, saveLocally, showToast, clearAutoSave, t]);
 const handleSaveCloud = useCallback(async (preferredProvider = null) => {
  if (!hasUserStartedFilling) {
    showToast(t('common.error'), 'error');
    return;
  }

  if (!canSaveToCloud()) {
    setShowCloudSetup(true);
    return;
  }

  setIsSaving(true);
  setSaveType('cloud');
  setSaveResult(null);

  try {
    let targetProvider = preferredProvider;
    
    if (!targetProvider) {
      const storedProvider = localStorage.getItem('preferred_cloud_provider');
      if (storedProvider && connectedProviders.includes(storedProvider)) {
        targetProvider = storedProvider;
      } else {
        targetProvider = connectedProviders[0];
      }
    }

    console.log(`Saving to cloud provider: ${targetProvider}`);
    
    const result = await saveToConnectedCloud(formData, targetProvider);
    setSaveResult(result);
    
    if (result.success) {
      localStorage.setItem('preferred_cloud_provider', targetProvider);
      localStorage.setItem('last_save_method', 'cloud');
      setShowStorageChoice(false);
      clearAutoSave();
      
      // Get provider display name
      const providerDisplayName = targetProvider === 'google_drive' ? 'Google Drive' : 
                                   targetProvider === 'onedrive' ? 'OneDrive' : 
                                   targetProvider === 'dropbox' ? 'Dropbox' : targetProvider;
      
      // CLEAR MESSAGE: Show where it was saved
      showToast(`CV saved to ${providerDisplayName}`, 'success');
      
      localStorage.removeItem('cv_draft');
    } else {
      showToast(result.error || 'Failed to save', 'error');
    }
  } catch (error) {
    console.error('Save failed:', error);
    showToast(error.message || 'Failed to save CV', 'error');
  } finally {
    setIsSaving(false);
  }
}, [hasUserStartedFilling, formData, canSaveToCloud, saveToConnectedCloud, connectedProviders, showToast, clearAutoSave, t]);


  const handleSave = useCallback(() => {
    if (!hasUserStartedFilling) {
      showToast(t('common.error'), 'error');
      return;
    }

    const lastSaveMethod = localStorage.getItem('last_save_method');
    
    if (lastSaveMethod === 'cloud' && canSaveToCloud()) {
      handleSaveCloud();
      return;
    }
    
    if (lastSaveMethod === 'local') {
      handleSaveLocal();
      return;
    }
    
    setShowStorageChoice(true);
  }, [hasUserStartedFilling, canSaveToCloud, handleSaveCloud, handleSaveLocal, showToast, t]);
  
  const handleConnectCloud = useCallback(async (provider) => {
    try {
      setShowStorageChoice(false);
      showToast(t('cloud.processing_connection'), 'info');
      await connectToCloudProvider(provider);
    } catch (error) {
      console.error('❌ Cloud connection failed:', error);
      showToast(`${t('cloud.connection_failed')}: ${error.message}`, 'error');
      setShowStorageChoice(true);
    }
  }, [connectToCloudProvider, showToast, t]);
  
  const handleCustomizeTemplate = useCallback(() => {
    // Save current data to localStorage so it persists when user comes back
    localStorage.setItem('cv_draft_for_customization', JSON.stringify(formData));
    navigate('/resume-customizer');
  }, [formData, navigate]);
  
  const handleAIEnhancement = useCallback(() => {
    // Check if user has meaningful content
    const hasContent = !!(
      formData.personal_info?.full_name ||
      formData.personal_info?.summary ||
      formData.experiences?.length > 0 ||
      formData.educations?.length > 0 ||
      formData.skills?.length > 0
    );

    if (!hasContent) {
      showToast(t('common.error'), 'error');
      return;
    }

    try {
      const aiEnhancementData = {
        ...formData,
        _prepared_for_ai: {
          timestamp: Date.now(),
          source: 'NewResumeBuilder',
          content_summary: {
            has_name: !!formData.personal_info?.full_name,
            has_summary: !!formData.personal_info?.summary,
            experiences_count: formData.experiences?.length || 0,
            skills_count: formData.skills?.length || 0
          }
        }
      };
      
      localStorage.setItem('cv_draft_for_ai', JSON.stringify(aiEnhancementData));
      localStorage.setItem('cv_draft', JSON.stringify(formData));
      
      console.log('🤖 Navigating to AI enhancement');
      navigate('/cv-ai-enhancement');
      
    } catch (error) {
      console.error('❌ Failed to prepare CV for AI:', error);
      showToast(t('common.error'), 'error');
    }
  }, [formData, navigate, showToast, t]);
  
  const closeToast = useCallback(() => {
    setToast(null);
  }, []);
  
  // SINGLE useEffect for initialization and OAuth handling
  useEffect(() => {
    console.log('🔧 NewResumeBuilder: Initializing...');
    
    // Handle OAuth return message - PREVENT MULTIPLE PROCESSING
    if (location.state?.message && !isInitializedRef.current) {
      console.log('📨 OAuth return detected:', location.state.message);
      
      // Immediately mark as initialized to prevent reprocessing
      isInitializedRef.current = true;
      
      // Show toast
      showToast(location.state.message, 'success');
      
      // Clear state after a small delay to ensure component is stable
      setTimeout(() => {
        if (location.state?.message) {
          navigate(location.pathname, { replace: true, state: {} });
        }
      }, 500);
    }
    
   // Check for auto-saved data - SILENTLY restore, no notification
if ((!paramResumeId || paramResumeId === 'new') && !isInitializedRef.current) {
  try {
    const autoSavedData = localStorage.getItem('cv_draft_autosave');
    if (autoSavedData) {
      const parsed = JSON.parse(autoSavedData);
      if (parsed._autoSave) {
        const timeSinceAutoSave = Date.now() - parsed._autoSave.timestamp;
        
        if (timeSinceAutoSave < 24 * 60 * 60 * 1000 && 
            (parsed.personal_info?.full_name || 
             parsed.experiences?.length > 0 || 
             parsed.educations?.length > 0)) {
          
          const { _autoSave, ...cleanData } = parsed;
          setFormData(cleanData);
          // NO TOAST - Silent restore
        }
      }
    }
  } catch (error) {
    console.error('Failed to restore auto-save:', error);
  }
}
    
    // Mark as initialized if not already done
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
    }
    
    console.log('✅ NewResumeBuilder: Initialization complete');
  }, []); // EMPTY DEPENDENCY ARRAY - Run only once on mount
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);
  
  // Don't show loading screen after OAuth return or during normal operation
  const isLoading = sessionLoading && !isInitializedRef.current;
  
  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }
   
  return (
    <>
      <div className={`flex flex-col md:flex-row h-full min-h-[calc(100vh-64px)] m-2 md:m-5 lg:m-10 ${
        darkMode ? 'text-gray-200' : 'text-gray-800'
      }`}>
        {/* Decorative Background Elements */}
        {!darkMode && (
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          </div>
        )}

        {/* Mobile View Mode Switcher */}
        {isMobileView && (
          <div className={`sticky top-0 z-20 w-full py-2 border-b mb-2 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white/80 backdrop-blur-sm border-gray-200'
          }`}>
            <div className="flex justify-between items-center px-2">
              <button 
                onClick={toggleMobileNav}
                className={`p-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20'
                }`}
              >
                {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="text-center text-lg font-semibold">
                {viewMode === 'edit' ? t('editor.edit_resume') : t('editor.preview_resume')}
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving || !hasUserStartedFilling}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center ${
                  isSaving || !hasUserStartedFilling
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
                }`}
              >
                <Save size={16} className="mr-1" />
                {isSaving ? t('resume.actions.saving') : t('common.save')}
              </button>

              {/* Mobile Template & AI Buttons */}
              <div className="flex gap-1">
                <button 
                  onClick={handleCustomizeTemplate}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20'
                  }`}
                  title={t('resume.customizer.title')}
                >
                  <Palette size={16} />
                </button>

                <button 
                  onClick={handleAIEnhancement}
                  disabled={!hasUserStartedFilling}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    !hasUserStartedFilling
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20'
                  }`}
                  title={t('common.ai_enhancement')}
                >
                  <Sparkles size={16} />
                </button>
              </div>

              <button 
                onClick={toggleViewMode}
                className={`p-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-pink-500/10 to-blue-500/10 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-blue-500/20'
                }`}
              >
                {viewMode === 'edit' ? <Eye size={20} /> : <Edit size={20} />}
              </button>
            </div>
          </div>
        )}

        {/* Mobile Section Navigation */}
        {isMobileView && mobileNavOpen && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={toggleMobileNav}>
            <div 
              className={`absolute top-0 left-0 h-full w-3/4 max-w-xs p-4 overflow-y-auto ${
                darkMode 
                  ? 'bg-gray-800 text-gray-200' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-800'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center mb-4 border-b pb-2 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className="font-bold text-lg">{t('editor.resume_sections')}</h3>
                <button onClick={toggleMobileNav}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setMobileNavOpen(false);
                      setViewMode('edit');
                    }}
                    className={`w-full px-3 py-2 rounded-md text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20'
                    }`}
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Left Side - Form */}
        <div 
          className={`relative z-10 ${
            isMobileView 
              ? viewMode === 'edit' ? 'block w-full' : 'hidden' 
              : isTabletView ? 'w-1/2' : 'w-[45%]'
          } p-2 md:p-4 overflow-y-auto md:m-2 lg:m-5 md:px-5 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white/80 backdrop-blur-sm border-gray-200'
          } border rounded-xl shadow-lg flex flex-col`}
        >
          {/* Section Navigation */}
          <div className={`mb-4 sticky top-0 z-10 pb-2 border-b ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white/90 backdrop-blur-sm border-gray-200'
          }`}>
            {!isMobileView && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-2 py-1 rounded-md text-xs transition-colors ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20'
                    }`}
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            )}

            {isMobileView && (
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigateSection('prev')}
                  className={`p-1 rounded-full ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 text-gray-700'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <h3 className="font-medium">
                  {sections.find(s => s.id === activeSection)?.name || t('resume.personal_info.title')}
                </h3>
                
                <button 
                  onClick={() => navigateSection('next')}
                  className={`p-1 rounded-full ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-blue-500/10 text-gray-700'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {localError && (
            <Alert variant="destructive" className="mb-3 text-sm">
              {localError}
            </Alert>
          )}
          
          {/* Current Section Form */}
          <div className="space-y-4 flex-grow">
            {activeSection === 'title' ? (
              <ResumeTitle
                title={formData.title}
                onChange={(value) => updateFormData('title', value)}
                darkMode={darkMode}
              />
            ) : activeSection === 'photo' ? (
              <Base64PhotoUpload
                darkMode={darkMode}
                data={formData.photo}
                onChange={(data) => updateFormData('photo', data)}
              />
            ) : (
              <CurrentSection
                darkMode={darkMode}
                data={formData[sections.find(s => s.id === activeSection)?.dataKey || 'personal_info']}
                onChange={(data) => updateFormData(
                  sections.find(s => s.id === activeSection)?.dataKey || 'personal_info',
                  data
                )}
                {...(activeSection === 'personal' ? { token: 'dummy_token' } : {})}
              />
            )}
          </div>
          
          {/* Bottom Navigation Arrows */}
          <div className={`flex justify-between items-center py-3 px-4 mt-3 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300' 
              : 'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 text-gray-700'
          } rounded-lg`}>
            <button 
              onClick={() => navigateSection('prev')}
              className="px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">{t('prod1.sections.previous')}</span>
            </button>
            
            <div className="text-sm font-medium">
              {activeSection === 'title' ? 
                <button 
                  onClick={toggleViewMode}
                  className="px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
                >
                  {viewMode === 'edit' ? (
                    <>
                      <Eye size={16} />
                      <span>{t('cards.resume.preview')}</span>
                    </>
                  ) : (
                    <>
                      <Edit size={16} />
                      <span>{t('actions.edit')}</span>
                    </>
                  )}
                </button>
                : 
                sections.find(s => s.id === activeSection)?.name || t('resume.personal_info.title')
              }
            </div>
            
            <button 
              onClick={() => navigateSection('next')}
              className="px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
            >
              <span className="hidden sm:inline">{t('prod1.sections.next')}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
       
        {/* Right Side - Preview */}
        <div 
          className={`relative z-10 ${
            isMobileView 
              ? viewMode === 'preview' ? 'block w-full' : 'hidden' 
              : isTabletView ? 'w-1/2' : 'w-[55%]'
          } ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white/80 backdrop-blur-sm border-gray-200'
          } flex flex-col rounded-xl shadow-lg overflow-hidden`}
        >
          {/* Desktop Action Buttons */}
          {!isMobileView && (
            <div className={`flex gap-3 p-3 border-b items-center justify-between ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              
              {/* Left Side - Save Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasUserStartedFilling}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center ${
                    isSaving || !hasUserStartedFilling
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      {saveType === 'cloud' ? t('cloud.saving_to_cloud') : saveType === 'local' ? t('cloud.saving_locally') : t('common.saving')}
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      {t('cloud.save_cv')}
                    </>
                  )}
                </button>
 
                {/* Save Method Indicator */}
<div className="text-xs text-gray-500 flex items-center">
  {(() => {
    const lastMethod = localStorage.getItem('last_save_method');
    const preferredProvider = localStorage.getItem('preferred_cloud_provider');
    
    if (lastMethod === 'cloud' && canSaveToCloud()) {
      if (preferredProvider === 'onedrive' && connectedProviders.includes('onedrive')) {
        return (
          <span className="flex items-center text-purple-600">
            <Cloud size={12} className="mr-1" />
            OneDrive
          </span>
        );
      } else if (preferredProvider === 'google_drive' && connectedProviders.includes('google_drive')) {
        return (
          <span className="flex items-center text-purple-600">
            <Cloud size={12} className="mr-1" />
            Google Drive
          </span>
        );
      } else if (connectedProviders.length > 0) {
        const provider = connectedProviders[0];
        const providerName = provider === 'google_drive' ? 'Google Drive' : 
                           provider === 'onedrive' ? 'OneDrive' : provider;
        return (
          <span className="flex items-center text-purple-600">
            <Cloud size={12} className="mr-1" />
            {providerName}
          </span>
        );
      }
    } else if (lastMethod === 'local') {
      return (
        <span className="flex items-center text-blue-600">
          <HardDrive size={12} className="mr-1" />
          {t('cloud.this_device')}
        </span>
      );
    } else if (canSaveToCloud()) {
      if (connectedProviders.length > 1) {
        return (
          <span className="flex items-center">
            <Cloud size={12} className="mr-1" />
            {connectedProviders.length} providers connected
          </span>
        );
      } else if (connectedProviders.length === 1) {
        const provider = connectedProviders[0];
        const providerName = provider === 'google_drive' ? 'Google Drive' : 
                           provider === 'onedrive' ? 'OneDrive' : provider;
        return (
          <span className="flex items-center">
            <Cloud size={12} className="mr-1" />
            {providerName}
          </span>
        );
      }
    } else {
      return (
        <span className="flex items-center">
          <HardDrive size={12} className="mr-1" />
          {t('cloud.local_only')}
        </span>
      );
    }
  })()}
</div>
              </div>

              {/* Right Side - Enhancement Actions */}
              <div className="flex items-center gap-2">
                {/* Template Customization Button */}
                <button
                  onClick={handleCustomizeTemplate}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    darkMode
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30'
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:bg-gradient-to-r hover:from-purple-200 hover:to-pink-200'
                  }`}
                  title={t('resume.customizer.title')}
                >
                  <Palette size={16} className="mr-2" />
                  {t('resume.customizer.title')}
                </button>

                {/* AI Enhancement Button */}
                <button
                  onClick={handleAIEnhancement}
                  disabled={!hasUserStartedFilling}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    !hasUserStartedFilling
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : darkMode
                      ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-300 hover:bg-gradient-to-r hover:from-yellow-600/30 hover:to-orange-600/30'
                      : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 hover:bg-gradient-to-r hover:from-yellow-200 hover:to-orange-200'
                  }`}
                  title={t('common.ai_enhancement')}
                >
                  <Sparkles size={16} className="mr-2" />
                  {t('common.ai_enhancement')}
                </button>

                {/* Change Save Location Button */}
                {(localStorage.getItem('last_save_method') && hasUserStartedFilling) && (
                  <button
                    onClick={() => setShowStorageChoice(true)}
                    disabled={isSaving}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t('cloud.change_location')}
                  </button>
                )}

                {/* Cloud Connect Button (if not connected) */}
                {!canSaveToCloud() && (
                  <button
                    onClick={() => setShowCloudSetup(true)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    {t('cloud.connect_cloud')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Save Result Display */}
          {saveResult && (
            <div className={`p-3 ${
              saveResult.success
                ? darkMode
                  ? 'bg-green-900/20 border-b border-green-700'
                  : 'bg-green-50 border-b border-green-200'
                : darkMode
                ? 'bg-red-900/20 border-b border-red-700'
                : 'bg-red-50 border-b border-red-200'
            }`}>
              <div className="flex items-center">
                {saveResult.success ? (
                  <CheckCircle className={`w-4 h-4 mr-2 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                ) : (
                  <AlertCircle className={`w-4 h-4 mr-2 ${
                    darkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                )}
                <span className={`text-sm ${
                  saveResult.success
                    ? darkMode ? 'text-green-300' : 'text-green-700'
                    : darkMode ? 'text-red-300' : 'text-red-700'
                }`}>
                  {saveResult.success 
                    ? saveResult.message || t('common.success')
                    : saveResult.error || t('common.error')
                  }
                </span>
              </div>
            </div>
          )}

          <div className="flex-grow overflow-auto">
            <ResumePreview
              formData={{
                ...formData,
                experiences: formData.experiences || [],
                educations: formData.educations || [],
                skills: formData.skills || [],
                languages: formData.languages || [],
              }}
              darkMode={darkMode}
              hasUserStartedFilling={hasUserStartedFilling}
              isMobileView={isMobileView}
              showPlaceholders={true}
              showToast={showToast}
            />
          </div>
        </div>
      </div>

      {/* Storage Choice Modal */}
      {showStorageChoice && (
        <StorageChoiceModal
          isOpen={showStorageChoice}
          onClose={() => setShowStorageChoice(false)}
          onSaveLocal={handleSaveLocal}
          onSaveCloud={handleSaveCloud}
          onConnectCloud={handleConnectCloud}
          canSaveToCloud={canSaveToCloud()}
          darkMode={darkMode}
          isSaving={isSaving}
          saveType={saveType}
        />
      )}

      {/* Cloud Setup Modal */}
      {showCloudSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-2xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          } shadow-2xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('cloud.connect_cloud_storage')}
              </h3>
              <button 
                onClick={() => setShowCloudSetup(false)}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('cloud.connect_drive_to_save')}
            </p>

            <SimpleCloudConnect darkMode={darkMode} />

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowCloudSetup(false)}
                className={`text-sm ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg transition-all duration-300 max-w-md overflow-hidden ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : toast.type === 'info'
                ? 'bg-blue-500 text-white'
                : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="whitespace-normal break-words">
              {typeof toast.message === 'object' ? JSON.stringify(toast.message) : toast.message}
            </span>
            <button 
              onClick={closeToast} 
              className="ml-4 text-white hover:text-gray-200 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewResumeBuilder;