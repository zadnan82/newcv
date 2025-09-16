import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; 
import useAuthStore from '../../../stores/authStore';
import useResumeStore from '../../../stores/resumeStore';
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
import { Eye, Edit, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import PersonalInfo from '../builder/PersonalInfo';  
import ResumeTitle from '../builder/ResumeTitle';
import SaveButton from './SaveButton';
import useSessionStore from '../../../stores/sessionStore';

const NewResumeBuilder = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { resumeId: paramResumeId } = useParams();
  const { token } = useAuthStore(); 
  const { 
    createResume, 
    loading, 
    error: storeError 
  } = useResumeStore(); 
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('edit');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [authToken, setAuthToken] = useState(token);
  const [localError, setLocalError] = useState(null); 
  const blankResumeTemplate = {
    title: "My Resume", 
    template: "stockholm",
    personal_info: {
      full_name: '',   // Required, must be filled by user
      title: '',
      email: '',       // Required, must be filled by user
      mobile: '',      // Required, must be filled by user 
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
    photos: { photolink: null },
    internships: [],
    customization: {
      template: "stockholm",
      accent_color: "#1a5276",
      font_family: "Helvetica, Arial, sans-serif",
      line_spacing: 1.5,
      headings_uppercase: false,
      hide_skill_level: false
    }
  };
  const [formData, setFormData] = useState(blankResumeTemplate);
  const stateResumeId = location.state?.resumeId;
  const resumeId = paramResumeId || stateResumeId || 'default_resume';
  const { isAuthenticated } = useAuthStore();
  const userIsAuthenticated = isAuthenticated();
  const { checkCloudStatus } = useSessionStore();
  useEffect(() => {
    const isUserAuthenticated = useAuthStore.getState().isAuthenticated();
    
    if (!isUserAuthenticated) {
      // Show a helpful message after a short delay
      const timer = setTimeout(() => {
        showToast(
          t('revamp.offline_mode', 'You can build your resume now. Sign in to save or download.'),
          'info'
        );
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  

  useEffect(() => {
    const checkCloudConnection = async () => {
      try {
        console.log('⏳ Checking cloud provider status...');
        
        // Don't check cloud status if we're on a callback page
        if (window.location.pathname.includes('/cloud/callback')) {
          console.log('⏳ OAuth callback in progress, skipping cloud check');
          return;
        }
        
        const providers = await checkCloudStatus();
        console.log('📊 Cloud providers:', providers);
        
        if (providers.length === 0) {
          console.log('No cloud providers connected, redirecting to setup...');
          navigate('/cloud-setup', { replace: true });
        }
      } catch (error) {
        console.error('Error checking cloud status:', error);
      }
    };

    checkCloudConnection();
  }, [checkCloudStatus, navigate]);
  
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
  
  useEffect(() => {
    if (storeError) {
      setLocalError(storeError);
    }
  }, [storeError]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) { 
        setIsLoading(false); 
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  const updateFormData = (section, data) => {
    console.log(`Updating section ${section} with:`, data);
    
    setFormData(prev => {
      let updatedData;
      
      if (section === 'title') {
        updatedData = {
          ...prev,
          title: data
        };
      } else if (section === 'photos') {
        console.log('Updating photos in formData:', data);
        
        updatedData = {
          ...prev,
          photos: data
        };
      } else if (section === 'personal_info') {
        updatedData = {
          ...prev,
          personal_info: {
            ...data
          }
        };
        
        console.log('Updated personal info in formData:', updatedData.personal_info);
      } else {
        updatedData = {
          ...prev,
          [section]: data
        };
      }
      
      localStorage.setItem('resumeFormData', JSON.stringify(updatedData));
      
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
    { id: 'internships', name: t('resume.internships.title'), component: Internships, dataKey: 'internships' }
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

  const handleLoginRedirect = () => {
    localStorage.setItem('tempResumeData', JSON.stringify(formData));
    navigate('/login', { state: { returnTo: location.pathname } });
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

            <SaveButton  
              formData={formData}
              darkMode={darkMode}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              showToast={showToast}
              isLocalDraft={false}
              forceCreate={true}
              userIsAuthenticated={userIsAuthenticated}
              onLoginRequired={handleLoginRedirect}
            />
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

      {/* Left Side - Form (hidden on mobile when in preview mode) */}
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
              token={authToken}
            />
          )}
        </div>
        
        {/* Bottom Navigation Arrows - with Gradient Styling */}
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
            <span className="hidden sm:inline"> {t('prod1.sections.previous')}</span>
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
            <span className="hidden sm:inline"> {t('prod1.sections.next')}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
     
      {/* Right Side - Preview (hidden on mobile when in edit mode) */}
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
            <SaveButton  
              formData={formData}
              darkMode={darkMode}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              showToast={showToast}
              isLocalDraft={false}
              forceCreate={true}
              userIsAuthenticated={userIsAuthenticated}
              onLoginRequired={handleLoginRedirect}
            />
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
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            showPlaceholders={true}
            showToast={showToast}
          />
        </div>

         
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </div>
  );
};

export default NewResumeBuilder;