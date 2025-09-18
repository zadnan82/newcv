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
import { Eye, Edit, ChevronLeft, ChevronRight, Menu, X, Download, Printer, FileSpreadsheet, Save, LogIn, Sparkles } from 'lucide-react';
import PersonalInfo from '../builder/PersonalInfo';  
import ResumeTitle from '../builder/ResumeTitle';
import EditPhotoUpload from '../builder/EditPhotoUpload';
import { exportToPDF, printResumeFn } from './js/pdfExporterUtilsNew';
import { exportToDocx } from './js/Exportdocx';
import { exportResumeToDocxAlt } from './js/AltWordExport'; 
import { CV_AI_ENDPOINTS } from '../../../config';

const EditResumeBuilder = ({ darkMode }) => {
  const navigate = useNavigate();
  const { resumeId: paramResumeId } = useParams();
  const location = useLocation(); 
  const { token } = useAuthStore();
  const { 
    currentResume, 
    updateResume, 
    loading, 
    error: storeError,
    fetchResume,
    setCurrentResume,
    isEditingLocally,
    saveToLocalStorage
  } = useResumeStore();
  const [activeSection, setActiveSection] = useState('personal'); 
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null); 
  const [viewMode, setViewMode] = useState('edit');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile action menu
  const [authToken, setAuthToken] = useState(token); 
  const [localError, setLocalError] = useState(null);
  const stateResumeId = location.state?.resumeId;
  const resumeId = paramResumeId || stateResumeId || 'default_resume';
  const { t } = useTranslation();
  const [searchParams] = useSearchParams(); 
  const [formData, setFormData] = useState(currentResume || {});
  const { isAuthenticated } = useAuthStore();
  const userIsAuthenticated = isAuthenticated();
  const htmlResumeRef = useRef(null);
  const [usageInfo, setUsageInfo] = useState(null);
  
  // Resume Preview Action States
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDocxExporting, setIsDocxExporting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
   
  useEffect(() => {
    const fetchResumeData = async () => {
      if (resumeId && resumeId !== 'default_resume') {
        try {
          setIsLoading(true);
          
          // Track if it's already been fetched to avoid multiple fetch calls
          const alreadyFetched = 
            currentResume && 
            currentResume.id.toString() === resumeId.toString();
            
          if (!alreadyFetched) {
            await fetchResume(resumeId);
          }
          
          // Set form data from the current resume
          if (currentResume) {
            setFormData(currentResume);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching resume:", error);
          setLocalError("Could not load the resume. Please try again.");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchResumeData();
    // Only include resumeId to avoid re-fetching when currentResume changes
  }, [resumeId, fetchResume]);
 
  useEffect(() => {
    if (!isLoading && !currentResume) {
      navigate('/my-resumes');
    }
  }, [currentResume, navigate, isLoading]);
   
  useEffect(() => {
    if (currentResume) {
      setFormData(currentResume);
    }
  }, [currentResume]);
  
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

  // Auto-save functionality
  useEffect(() => {
    if (hasUserStartedFilling && formData && isEditingLocally) {
      let saveTimeout;

      const currentDataStr = JSON.stringify(formData);
      const previousDataStr = useRef(null).current;
      const savedDataStr = localStorage.getItem('resumeFormData');

      if (currentDataStr !== previousDataStr && currentDataStr !== savedDataStr) {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          saveToLocalStorage();
          useRef(null).current = currentDataStr;
        }, 1000);
      }

      return () => {
        clearTimeout(saveTimeout);
      };
    }
  }, [formData, hasUserStartedFilling, isEditingLocally, saveToLocalStorage]);
 
  const updateFormData = (section, data) => {
    //console.log(`Updating form data for section "${section}":`, data);
    
    setFormData(prev => {
      if (section === 'title') {
        // For title, we're updating a string value directly at the root level
        return {
          ...prev,
          title: data
        };
      } else if (section === 'photos') {
        // Special handling for photos section with consistent format
        console.log('Updating photos in formData:', data);
        
        return {
          ...prev,
          photos: data  // This will be { photolink: url } from EditPhotoUpload
        };
      } else {
        // For other sections, we're updating an object or array
        return {
          ...prev,
          [section]: data
        };
      }
    });
  };
  
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  }; 
 
  const sections = [
    { id: 'photo', name: t('resume.photo.title'), component: EditPhotoUpload, dataKey: 'photos' },
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

  const CurrentSection = sections.find(s => s.id === activeSection)?.component || EditPhotoUpload;

  const toggleViewMode = () => {
    setViewMode(viewMode === 'edit' ? 'preview' : 'edit');
    setMobileMenuOpen(false); // Close the mobile menu when toggling views
  };

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
    setMobileMenuOpen(false); // Close the action menu when opening nav
  };
  
  const navigateSection = (direction) => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    const newIndex = 
      direction === 'next' 
        ? (currentIndex + 1) % sections.length 
        : (currentIndex - 1 + sections.length) % sections.length;
    
    setActiveSection(sections[newIndex].id);
  };

  // Function to handle HTML Resume reference
  const handleHTMLResumeRef = (ref) => {
    htmlResumeRef.current = ref;
  };

  // Resume action functions
  const handleLoginRedirect = () => {
    localStorage.setItem('tempResumeData', JSON.stringify(formData));
    navigate('/login', { state: { returnTo: location.pathname } });
  };

  const handleCustomize = (currentResume) => {
    
    navigate('/resume-customizer', { 
      state: { resumeId: currentResume.id } 
    });
  };

  const handleExportPDF = async () => {
    if (!userIsAuthenticated) {
      showToast(t('settings.not_authenticated', 'You must be logged in'), 'error');
      setShowAuthModal(true);
      return;
    }
    
    try {
      setIsPdfExporting(true);
      setLocalError('');
      
      const refs = { htmlResumeRef };
      const filename = await exportToPDF(refs, 'html', formData);
      
      if (filename) {
        showToast(t('preview.pdf_success'));
      } else {
        throw new Error(t('preview.pdf_error'));
      }
    } catch (err) {
      console.error('Error exporting PDF:', err);
      showToast(`${t('preview.pdf_error')}: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsPdfExporting(false);
      setMobileMenuOpen(false);
    }
  };

  const handlePrint = async () => {
    if (!userIsAuthenticated) {
      showToast(t('settings.not_authenticated', 'You must be logged in'), 'error');
      setShowAuthModal(true);
      return;
    }
    
    try {
      setIsPrinting(true);
      setLocalError('');
      
      const refs = { htmlResumeRef };
      const success = await printResumeFn(refs, 'html');
      
      if (!success) {
        throw new Error(t('preview.print_error'));
      }
    } catch (err) {
      console.error('Error printing:', err);
      showToast(t('preview.print_error'), 'error');
    } finally {
      setIsPrinting(false);
      setMobileMenuOpen(false);
    }
  };

  const handleWordExport = async () => {
    if (!userIsAuthenticated) {
      showToast(t('settings.not_authenticated', 'You must be logged in'), 'error');
      setShowAuthModal(true);
      return;
    }
    
    try {
      setIsDocxExporting(true);
      setLocalError('');
      
      const success = await exportToDocx(formData);
      if (!success) {
        const altSuccess = exportResumeToDocxAlt(formData);
        if (!altSuccess) {
          throw new Error(t('preview.word_error'));
        }
      }
      
      showToast(t('preview.word_success'));
    } catch (err) {
      console.error('Error exporting Word document:', err);
      showToast(t('preview.word_error'), 'error');
    } finally {
      setIsDocxExporting(false);
      setMobileMenuOpen(false);
    }
  };

  const handleAIEnhancement = () => {
    if (!userIsAuthenticated) {
      showToast(t('settings.not_authenticated', 'You must be logged in'), 'error');
      setShowAuthModal(true);
      return;
    }

    // Navigate to AI Enhancement page with current resume data
    navigate('/cv-ai-enhancement', { 
      state: { 
        resumeId: formData?.id || formData?.server_id 
      } 
    });
    setMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const Toast = ({ message, type, onClose }) => {
    // If message is an object or array, stringify it properly
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

  // Authentication Modal
  const AuthModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 backdrop-blur-sm pt-20">
        <div className={`p-6 rounded-xl shadow-lg max-w-md w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white/90 backdrop-blur-sm text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
          <h2 className="text-xl font-bold mb-4">{t('auth.login.title', 'Login Required')}</h2>
          <p className="mb-6 text-sm">{t('auth.login.sign_in_to_continue', 'Sign in to continue with this action.')}</p>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={onClose} 
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 hover:scale-105' 
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:shadow-lg hover:scale-105'
              }`}
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button 
              onClick={handleLoginRedirect} 
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 flex items-center text-sm"
            >
              <LogIn size={16} className="mr-2" />
              {t('navigation.login', 'Login')}
            </button>
          </div>
        </div>
      </div>
    );
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
      
  
      {/* Mobile View Mode Switcher with Action Dropdown */}
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
  
            <div className="relative mobile-menu-container">
              {/* Action menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 mr-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20'
                }`}
              >
                <FileSpreadsheet size={20} />
              </button>
  
              {/* View mode toggle button */}
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
  
              {/* Dropdown menu */}
              {mobileMenuOpen && (
                <div 
                  className={`absolute right-0 top-full mt-1 w-56 rounded-lg shadow-lg z-30 ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-white/95 backdrop-blur-sm border border-gray-200'
                  }`}
                >
                  <div className="py-1">
                    {/* <SaveButton  
                      formData={formData}
                      darkMode={darkMode}
                      isSaving={isSaving}
                      setIsSaving={setIsSaving}
                      showToast={showToast}
                      isLocalDraft={isEditingLocally}
                      forceCreate={location.pathname.includes('/new-resume')}
                      userIsAuthenticated={userIsAuthenticated}
                      onLoginRequired={() => setShowAuthModal(true)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        darkMode 
                          ? 'hover:bg-gray-600' 
                          : 'hover:bg-gray-100'
                      }`}
                    /> */}
                    
                    <button
                      onClick={handleAIEnhancement}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        darkMode 
                          ? 'hover:bg-gray-600' 
                          : 'hover:bg-gray-100'
                      } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
                      disabled={!userIsAuthenticated}
                    >
                      <Sparkles size={16} />
                      {t('navigation.aiEnhancement', 'AI Enhancement')}
                    </button>
                    
                    <button
                      onClick={handleExportPDF}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        darkMode 
                          ? 'hover:bg-gray-600' 
                          : 'hover:bg-gray-100'
                      } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
                      disabled={isPdfExporting || isPrinting || isDocxExporting || isSaving}
                    >
                      <Download size={16} />
                      {isPdfExporting ? t('resume.customizer.export.exporting') : t('preview.export_as_pdf')}
                    </button>
                    
                    <button
                      onClick={handleWordExport}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        darkMode 
                          ? 'hover:bg-gray-600' 
                          : 'hover:bg-gray-100'
                      } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
                      disabled={isPdfExporting || isPrinting || isDocxExporting || isSaving}
                    >
                      <FileSpreadsheet size={16} />
                      {isDocxExporting ? t('resume.customizer.export.exporting') : t('preview.export_as_docx')}
                    </button>
                    
                    <button
                      onClick={handlePrint}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        darkMode 
                          ? 'hover:bg-gray-600' 
                          : 'hover:bg-gray-100'
                      } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
                      disabled={isPdfExporting || isPrinting || isDocxExporting || isSaving}
                    >
                      <Printer size={16} />
                      {isPrinting ? t('common.preparing') : t('preview.print_resume')}
                    </button>
                    <button 
                      onClick={() => handleCustomize(currentResume)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        darkMode 
                          ? 'hover:bg-gray-600' 
                          : 'hover:bg-gray-100'
                      } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
                    > 
                      {t('resumeDashboard.buttons.customize', 'Customize')}
                    </button>
                   
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
   {usageInfo && isMobileView &&(
  <div className={`mb-3 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    {t('ai.limit_info', 'AI requests remaining: {{remaining}} of {{limit}}', {
      remaining: usageInfo.remaining,
      limit: usageInfo.limit
    })}
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
 {usageInfo && !isMobileView &&(
  <div className={`mb-3 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    {t('ai.limit_info', 'AI requests remaining: {{remaining}} of {{limit}}', {
      remaining: usageInfo.remaining,
      limit: usageInfo.limit
    })}
  </div>
)}
        
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
                {sections.find(s => s.id === activeSection)?.name || t('resume.photo.title')}
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
              data={formData[sections.find(s => s.id === activeSection)?.dataKey || 'photo']}
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
                    <span>{t('actions.preview', 'Preview')}</span>
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    <span>{t('common.edit', 'Edit')}</span>
                  </>
                )}
              </button>
              : 
              sections.find(s => s.id === activeSection)?.name || t('resume.photo.title')
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
        {/* Desktop Action Buttons - Moved from ResumePreview to here */}
        {!isMobileView && (
          <div className="flex gap-2 p-2 border-b">
            <SaveButton  
              formData={formData}
              darkMode={darkMode}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              showToast={showToast}
              isLocalDraft={isEditingLocally}
              forceCreate={location.pathname.includes('/new-resume')}
              userIsAuthenticated={userIsAuthenticated}
              onLoginRequired={() => setShowAuthModal(true)} 
            />
            
            <button
              onClick={handleAIEnhancement}
              className={`px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
              } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
              title={userIsAuthenticated ? t('common.ai_enhancement', 'AI Enhancement') : t('settings.not_authenticated', 'Login required')}
              disabled={!userIsAuthenticated}
            >
              <Sparkles size={14} />
              <span>{t('common.ai', 'AI')}</span>
            </button>
            
            <button
              onClick={handleExportPDF}
              className={`px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
              } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
              title={userIsAuthenticated ? t('preview.export_as_pdf') : t('settings.not_authenticated', 'Login required')}
              disabled={isPdfExporting || isPrinting || isDocxExporting || isSaving}
            >
              <Download size={14} />
              <span>{isPdfExporting ? t('resume.customizer.export.exporting') : t('preview.pdf')}</span>
            </button>
            
            <button
              onClick={handleWordExport}
              className={`px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-pink-600 to-blue-600 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105' 
                  : 'bg-gradient-to-r from-pink-600 to-blue-600 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105'
              } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
              title={userIsAuthenticated ? t('preview.export_as_docx') : t('settings.not_authenticated', 'Login required')}
              disabled={isPdfExporting || isPrinting || isDocxExporting || isSaving}
            >
              <FileSpreadsheet size={14} />
              <span>{isDocxExporting ? t('resume.customizer.export.exporting') : t('resume.customizer.export.word')}</span>
            </button>
            
            <button
              onClick={handlePrint}
              className={`px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
              } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
              title={userIsAuthenticated ? t('preview.print_resume') : t('settings.not_authenticated', 'Login required')}
              disabled={isPdfExporting || isPrinting || isDocxExporting || isSaving}
            >
              <Printer size={14} />
              <span>{isPrinting ? t('common.preparing') : t('preview.print_resume')}</span>
            </button>

            <button
                      onClick={() => handleCustomize(currentResume)}
                      className={`px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
                      } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
                    > 
                      {t('resumeDashboard.buttons.customize')}
                    </button>
          </div>
        )}
  
        <div className="flex-grow overflow-auto flex flex-col">
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
            onHTMLResumeRef={handleHTMLResumeRef}
            hideButtons={true}
          />
          
          {/* Bottom Navigation Arrows for Preview Mode - with Gradient Styling */}
          {viewMode === 'preview' && (
            <div className="mt-auto flex justify-between items-center py-3 px-4 m-2 rounded-lg bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5">
              <button 
                onClick={toggleViewMode}
                className="px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
              >
                <Edit size={16} />
                <span>{t('common.edit', 'Edit')}</span>
              </button>
              
              <button 
                onClick={handleExportPDF}
                disabled={isPdfExporting || isPrinting || isDocxExporting || isSaving || !userIsAuthenticated}
                className={`px-3 py-1 text-xs rounded-full text-white flex items-center gap-1 shadow-md transition-all duration-300 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 ${
                  (isPdfExporting || isPrinting || isDocxExporting || isSaving || !userIsAuthenticated) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Download size={16} />
                <span>{isPdfExporting ? t('resume.customizer.export.exporting') : t('preview.export_as_pdf', 'Export PDF')}</span>
              </button>
            </div>
          )}
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
  
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default EditResumeBuilder;