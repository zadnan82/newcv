// src/components/auth-resume/view-cv/NewResumeBuilder.jsx - Updated with integrated save options
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; 
import { Eye, Edit, ChevronLeft, ChevronRight, Menu, X, Save, HardDrive, Cloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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

const NewResumeBuilder = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { t } = useTranslation();
  const { resumeId: paramResumeId } = useParams();
  
  // Use simplified session store
  const { 
    connectedProviders,
    canSaveToCloud,
    loading,
    saveLocally,
    saveToConnectedCloud
  } = useSessionStore();
  
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('edit');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showCloudSetup, setShowCloudSetup] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [saveType, setSaveType] = useState(null);
  
  // Show success message from cloud connection
  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, 'success');
      // Clear the state to prevent showing again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);
  
  // Blank resume template
  // Update the blankResumeTemplate to match CompleteCV schema
const blankResumeTemplate = {
  title: "My Resume",
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
};
  
  const [formData, setFormData] = useState(blankResumeTemplate);

  // Initialize builder
  useEffect(() => {
    console.log('🔧 NewResumeBuilder: Starting...');
    
    if (paramResumeId && paramResumeId !== 'new') {
      console.log('🔧 Loading existing resume:', paramResumeId);
      // TODO: Load existing resume logic
    }
    
    setIsLoading(false);
  }, [paramResumeId]);
  
  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
  
    useEffect(() => {
      const mediaQuery = window.matchMedia(query);
      setMatches(mediaQuery.matches);
  
      const handler = (event) => setMatches(event.matches);
      mediaQuery.addEventListener('change', handler);
  
      return () => {
        mediaQuery.removeEventListener('change', handler);
      };
    }, [query]);
  
    return matches;
  };
  
  const isMobileView = useMediaQuery('(max-width: 768px)');
  const isTabletView = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');   
  
  const hasUserStartedFilling = formData.personal_info?.full_name || 
    formData.personal_info?.email ||
    formData.experiences?.some(exp => exp?.company || exp?.position) ||
    formData.educations?.some(edu => edu?.institution || edu?.degree);
  
  const updateFormData = (section, data) => {
  console.log(`Updating section ${section} with:`, data);
  
  setFormData(prev => {
    let updatedData;
    
    if (section === 'title') {
      updatedData = { ...prev, title: data };
    } else if (section === 'is_public') {
      updatedData = { ...prev, is_public: data };
    } else if (section === 'customization') {
      updatedData = { ...prev, customization: { ...prev.customization, ...data } };
    } else if (section === 'photo') {
      updatedData = { ...prev, photo: data };
    } else if (section === 'personal_info') {
      updatedData = { 
        ...prev, 
        personal_info: { ...data }
      };
    } else {
      updatedData = { ...prev, [section]: data };
    }
    
    // Auto-save to localStorage as user types
    localStorage.setItem('cv_draft', JSON.stringify(updatedData));
    
    return updatedData;
  });
};
  
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  }; 
  
  const sections = [
  { id: 'title', name: t('resume.title.section', 'Resume Title'), component: ResumeTitle, dataKey: 'title' },
 // { id: 'visibility', name: t('resume.visibility.title', 'Visibility'), component: ResumeVisibility, dataKey: 'is_public' },
  //{ id: 'customization', name: t('resume.customization.title', 'Customization'), component: ResumeCustomization, dataKey: 'customization' },
  { id: 'personal', name: t('resume.personal_info.title'), component: PersonalInfo, dataKey: 'personal_info' }, 
  { id: 'education', name: t('resume.education.title'), component: Education, dataKey: 'educations' },
  { id: 'experience', name: t('resume.experience.title'), component: Experience, dataKey: 'experiences' },
  { id: 'skills', name: t('resume.skills.title'), component: Skills, dataKey: 'skills' },
  { id: 'languages', name: t('resume.languages.title'), component: Languages, dataKey: 'languages' },
  { id: 'referrals', name: t('resume.references.title'), component: Referrals, dataKey: 'referrals' },
  { id: 'custom', name: t('resume.custom_sections.title'), component: CustomSections, dataKey: 'custom_sections' },
  { id: 'activities', name: t('resume.extracurricular.activity'), component: ExtracurricularActivities, dataKey: 'extracurriculars' },
  { id: 'hobbies', name: t('resume.hobbies.title'), component: Hobbies, dataKey: 'hobbies' },
  { id: 'courses', name: t('resume.courses.title'), component: Courses, dataKey: 'courses' },
  { id: 'internships', name: t('resume.internships.title'), component: Internships, dataKey: 'internships' },
  //{ id: 'photo', name: t('resume.photo.title', 'Photo'), component: PhotoUpload, dataKey: 'photo' }
];
  
  const CurrentSection = sections.find(s => s.id === activeSection)?.component || PersonalInfo;
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'edit' ? 'preview' : 'edit');
  };
  
  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };
  
  const navigateSection = (direction) => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    const newIndex = 
      direction === 'next' 
        ? (currentIndex + 1) % sections.length 
        : (currentIndex - 1 + sections.length) % sections.length;
    
    setActiveSection(sections[newIndex].id);
  };

  // INTEGRATED SAVE HANDLERS
  const handleSaveLocal = async () => {
    if (!hasUserStartedFilling) {
      showToast('Please add some information to your CV before saving.', 'error');
      return;
    }

    setIsSaving(true);
    setSaveType('local');
    setSaveResult(null);

    try {
      const result = await saveLocally(formData);
      setSaveResult(result);
      if (result.success) {
        showToast(result.message || 'CV saved locally!', 'success');
      } else {
        showToast(result.error || 'Failed to save locally', 'error');
      }
    } catch (error) {
      const errorResult = {
        success: false,
        error: error.message || 'Failed to save locally'
      };
      setSaveResult(errorResult);
      showToast(errorResult.error, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCloud = async () => {
    if (!hasUserStartedFilling) {
      showToast('Please add some information to your CV before saving.', 'error');
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
      const result = await saveToConnectedCloud(formData, 'google_drive');
      setSaveResult(result);
      if (result.success) {
        showToast(result.message || 'CV saved to Google Drive!', 'success');
      } else {
        showToast(result.error || 'Failed to save to cloud', 'error');
      }
    } catch (error) {
      const errorResult = {
        success: false,
        error: error.message || 'Failed to save to cloud'
      };
      setSaveResult(errorResult);
      showToast(errorResult.error, 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  const Toast = ({ message, type, onClose }) => {
    let displayMessage = message;
    if (typeof message === 'object' && message !== null) {
      try {
        displayMessage = JSON.stringify(message, null, 2);
      } catch {
        displayMessage = String(message);
      }
    }
    
    return (
      <div 
        className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg transition-all duration-300 max-w-md overflow-hidden
          ${type === 'success' 
            ? 'bg-green-500 text-white' 
            : type === 'info'
              ? 'bg-blue-500 text-white'
              : 'bg-red-500 text-white'
          }`}
      >
        <div className="flex justify-between items-center">
          <span className="whitespace-normal break-words">{displayMessage}</span>
          <button 
            onClick={onClose} 
            className="ml-4 text-white hover:text-gray-200 flex-shrink-0"
          >
            ×
          </button>
        </div>
      </div>
    );
  }; 
  
  const closeToast = () => {
    setToast(null);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p>{t('common.loading', 'Loading...')}</p>
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
                onClick={handleSaveLocal}
                disabled={isSaving || !hasUserStartedFilling}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center ${
                  isSaving || !hasUserStartedFilling
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
                }`}
              >
                <Save size={16} className="mr-1" />
                Save
              </button>

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

        {/* Mobile Section Navigation (Slide-in Drawer) */}
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
          {/* Section Navigation - Responsive Grid */}
          <div className={`mb-4 sticky top-0 z-10 pb-2 border-b ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white/90 backdrop-blur-sm border-gray-200'
          }`}>
            {/* Desktop & Tablet Navigation */}
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

            {/* Mobile Section Title and Navigation */}
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
            ) : (
              <CurrentSection
                darkMode={darkMode}
                data={formData[sections.find(s => s.id === activeSection)?.dataKey || 'personal_info']}
                onChange={(data) => updateFormData(
                  sections.find(s => s.id === activeSection)?.dataKey || 'personal_info',
                  data
                )}
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
                      <span>{t('cards.resume.preview', 'Preview')}</span>
                    </>
                  ) : (
                    <>
                      <Edit size={16} />
                      <span>{t('actions.edit', 'Edit')}</span>
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
            <div className={`flex gap-2 p-2 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {/* Save Options */}
              <div className="flex gap-2">
                {/* Local Save Button */}
                <button
                  onClick={handleSaveLocal}
                  disabled={isSaving || !hasUserStartedFilling}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    isSaving && saveType === 'local'
                      ? 'bg-blue-500 text-white cursor-not-allowed'
                      : isSaving
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : !hasUserStartedFilling
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
                  }`}
                >
                  {isSaving && saveType === 'local' ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <HardDrive size={16} className="mr-2" />
                      Save Local
                    </>
                  )}
                </button>
                
                {/* Cloud Save Button */}
                <button
                  onClick={handleSaveCloud}
                  disabled={isSaving || !hasUserStartedFilling}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    isSaving && saveType === 'cloud'
                      ? 'bg-purple-500 text-white cursor-not-allowed'
                      : isSaving
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : !hasUserStartedFilling
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
                  }`}
                >
                  {isSaving && saveType === 'cloud' ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Cloud size={16} className="mr-2" />
                      Save Cloud
                    </>
                  )}
                </button>
              </div>
              
              {/* Storage status indicator */}
              <div className="text-xs text-gray-500 flex items-center">
                {canSaveToCloud() ? (
                  <span className="flex items-center">
                    <Cloud size={12} className="mr-1" />
                    Cloud Ready
                  </span>
                ) : (
                  <span className="flex items-center">
                    <HardDrive size={12} className="mr-1" />
                    Local Only
                  </span>
                )}
              </div>

              {/* Cloud Connect Button (if not connected) */}
              {!canSaveToCloud() && !isMobileView && (
                <button
                  onClick={() => setShowCloudSetup(true)}
                  className="px-3 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  Connect Cloud
                </button>
              )}
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
                    ? saveResult.message || 'Saved successfully!'
                    : saveResult.error || 'Save failed'
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

      {/* CLOUD SETUP MODAL */}
      {showCloudSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-2xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          } shadow-2xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Connect Cloud Storage
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
              Connect your Google Drive to save and access your CVs from anywhere.
            </p>

            <SimpleCloudConnect darkMode={darkMode} />

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowCloudSetup(false)}
                className={`text-sm ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </>
  );
};

export default NewResumeBuilder;