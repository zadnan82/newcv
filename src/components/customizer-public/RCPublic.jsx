import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TemplateSelector from '../auth-resume/template-selector/TemplateSelector';
import TemplateRenderer from '../auth-resume/template-selector/TemplateRenderer';
import ColorSelector from '../auth-resume/template-selector/ColorSelector';
import FontSelector from '../auth-resume/template-selector/FontSelector';
import HeadersStyleToggle from '../auth-resume/template-selector/HeadersStyleSelector';
import SkillLevelToggle from '../auth-resume/template-selector/SkillLevelToggle'; 

// Add global styles for animations
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

// Custom hook for window size
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

// Sample resume data
const SAMPLE_RESUME_DATA = {
  id: "sample_resume",
  title: "Professional Resume",
  is_public: true,
  personal_info: {
    full_name: "Alex Johnson",
    email: "alex.johnson@example.com",
    mobile: "+1 (555) 123-4567",
    address: "123 Main Street, San Francisco, CA 94105",
    linkedin: "linkedin.com/in/alexjohnson",
    title: "Senior Software Engineer",
    date_of_birth: "1985-05-15",
    nationality: "American",
    place_of_birth: "Boston, MA",
    postal_code: "94105",
    driving_license: "Yes",
    city: "San Francisco",
    website: "alexjohnson.dev",
    summary: "Experienced software engineer with over 8 years of expertise in full-stack development. Passionate about creating elegant solutions to complex problems using modern technologies and best practices. Strong team player with a track record of successful project delivery."
  },
  educations: [
    {
      id: "edu_1",
      institution: "Stanford University",
      degree: "Master of Science",
      field_of_study: "Computer Science",
      location: "Stanford, CA",
      start_date: "2008-09-01",
      end_date: "2010-06-30",
      current: false,
      gpa: "3.9"
    },
    {
      id: "edu_2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field_of_study: "Computer Engineering",
      location: "Berkeley, CA",
      start_date: "2004-09-01",
      end_date: "2008-05-30",
      current: false,
      gpa: "3.8"
    }
  ],
  experiences: [
    {
      id: "exp_1",
      company: "TechCorp Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      description: "Led a team of 5 developers to build and maintain a cloud-based analytics platform. Implemented CI/CD pipelines and reduced deployment time by 60%. Designed and developed RESTful APIs serving over 1M requests daily.",
      start_date: "2020-03-01",
      end_date: "",
      current: true
    },
    {
      id: "exp_2",
      company: "DataSoft Solutions",
      position: "Software Engineer",
      location: "San Jose, CA",
      description: "Developed and optimized backend services for high-traffic e-commerce applications. Implemented scalable database solutions and reduced query response time by 40%. Collaborated with cross-functional teams to deliver features on time.",
      start_date: "2017-05-01",
      end_date: "2020-02-28",
      current: false
    },
    {
      id: "exp_3",
      company: "InnovateTech",
      position: "Junior Developer",
      location: "Mountain View, CA",
      description: "Built responsive web applications using React and Node.js. Participated in code reviews and agile development processes. Maintained and improved legacy code bases.",
      start_date: "2015-06-01",
      end_date: "2017-04-30",
      current: false
    }
  ],
  skills: [
    {
      id: "skill_1",
      name: "JavaScript",
      level: "Expert"
    },
    {
      id: "skill_2",
      name: "React",
      level: "Expert"
    },
    {
      id: "skill_3",
      name: "Node.js",
      level: "Advanced"
    },
    {
      id: "skill_4",
      name: "Python",
      level: "Advanced"
    },
    {
      id: "skill_5",
      name: "Docker",
      level: "Intermediate"
    },
    {
      id: "skill_6",
      name: "AWS",
      level: "Advanced"
    },
    {
      id: "skill_7",
      name: "SQL",
      level: "Advanced"
    },
    {
      id: "skill_8",
      name: "MongoDB",
      level: "Intermediate"
    }
  ],
  languages: [
    {
      id: "lang_1",
      name: "English",
      level: "Native"
    },
    {
      id: "lang_2",
      name: "Spanish",
      level: "Intermediate"
    },
    {
      id: "lang_3",
      name: "French",
      level: "Basic"
    }
  ],
  referrals: [
    {
      id: "ref_1",
      name: "Sarah Williams",
      relation: "Former Manager",
      phone: "+1 (555) 987-6543",
      email: "sarah.w@datasoft.com"
    },
    {
      id: "ref_2",
      name: "Michael Chen",
      relation: "Senior Colleague",
      phone: "+1 (555) 456-7890",
      email: "mchen@techcorp.com"
    }
  ],
  custom_sections: [
    {
      id: "custom_1",
      title: "Professional Certifications",
      content: "AWS Certified Solutions Architect (2022)\nGoogle Cloud Professional Developer (2021)\nMicrosoft Certified: Azure Developer Associate (2020)"
    }
  ],
  extracurriculars: [
    {
      id: "extra_1",
      title: "Tech Meetup Organizer",
      description: "Organize monthly meetups for local developers to discuss emerging technologies and best practices."
    },
    {
      id: "extra_2",
      title: "Open Source Contributor",
      description: "Active contributor to several open-source projects, including React-based UI libraries and Node.js utilities."
    }
  ],
  hobbies: [
    {
      id: "hobby_1",
      name: "Hiking"
    },
    {
      id: "hobby_2",
      name: "Photography"
    },
    {
      id: "hobby_3",
      name: "Playing Guitar"
    }
  ],
  courses: [
    {
      id: "course_1",
      name: "Advanced Machine Learning",
      institution: "Coursera",
      description: "Comprehensive course covering neural networks, deep learning, and practical ML applications."
    },
    {
      id: "course_2",
      name: "Cloud Architecture",
      institution: "Udacity",
      description: "In-depth study of cloud infrastructure design, scalability, and security best practices."
    }
  ],
  internships: [
    {
      id: "intern_1",
      company: "Google",
      position: "Software Engineering Intern",
      location: "Mountain View, CA",
      description: "Developed features for Google Maps. Optimized rendering performance and implemented new UI components.",
      start_date: "2014-05-01",
      end_date: "2014-08-30",
      current: false
    }
  ],
  photos: [
    {  
      photolink: "https://res.cloudinary.com/dgxhrgcqz/image/upload/v1745437631/cvati/user_366_1745437629831.png" 
    }
  ],
 
  created_at: "2023-01-15T10:30:00.000Z",
  updated_at: "2023-04-20T14:45:00.000Z",
  template: "stockholm",
  customization: {
    template: "stockholm",
    accent_color: "#6366f1",
    font_family: "Helvetica, Arial, sans-serif",
    line_spacing: 1.5,
    headings_uppercase: false,
    hide_skill_level: false
  }
};

const RCPublic = ({ darkMode = false }) => {
  const { t, i18n } = useTranslation();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isDarkMode = darkMode;
  const isRTL = i18n.dir() === 'rtl';
  const resumeRef = useRef(null);
  
  // Reset scroll position when component mounts
  useEffect(() => {
    // Reset window scroll position
    window.scrollTo(0, 0);
    
    // Reset any scrollable containers
    document.querySelectorAll('.overflow-auto').forEach(element => {
      if (element) {
        element.scrollTop = 0;
      }
    });
  }, []);
  
  // Resume customization state
  const [selectedTemplate, setSelectedTemplate] = useState('stockholm');
  const [customSettings, setCustomSettings] = useState({
    accentColor: '#6366f1',
    fontFamily: 'Helvetica, Arial, sans-serif',
    lineSpacing: 1.5,
    headingsUppercase: false,
    hideSkillLevel: false
  });
  
  // UI state
  const [previewScale, setPreviewScale] = useState(isMobile ? 0.5 : 0.7);
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('templates');
  
  // Update sidebar visibility when screen size changes
  useEffect(() => {
    setSidebarVisible(!isMobile);
  }, [isMobile]);
  
  // Event handlers
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
    // Check if user is authenticated using the auth store
    // Since we can't directly use the hook in this non-React context,
    // we need to access the store's state from localStorage
    const authState = JSON.parse(localStorage.getItem('auth-storage')) || {};
    const isAuthenticated = !!authState?.state?.token;
    
    // Create the modal with appropriate message based on auth status
    const warningToast = document.createElement('div');
    warningToast.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} text-center shadow-2xl z-50 animate-fade-in max-w-md`;
    
    if (isAuthenticated) {
      // Message for authenticated users
      warningToast.innerHTML = `
        <div class="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="${isDarkMode ? 'text-white' : 'text-gray-800'} text-lg font-medium mb-2">${t('revamp.needsResumeFirst')}</h3>
          <p class="${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6">${t('revamp.goToMyResumes')}</p>
          <div class="flex space-x-3">
            <button id="my-resumes-btn" class="py-2 px-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              ${t('navigation.myResumes')}
            </button>
            <button id="close-toast-btn" class="py-2 px-4 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} text-sm font-medium">
              ${t('common.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      `;
    } else {
      // Message for non-authenticated users
      warningToast.innerHTML = `
        <div class="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="${isDarkMode ? 'text-white' : 'text-gray-800'} text-lg font-medium mb-2">${t('revamp.needsResumeFirst')}</h3>
          <p class="${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6">${t('revamp.signInFirst')}</p>
          <div class="flex space-x-3">
            <button id="sign-in-btn" class="py-2 px-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              ${t('navigation.login', 'Login')}
            </button>
            <button id="close-toast-btn" class="py-2 px-4 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} text-sm font-medium">
              ${t('common.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      `;
    }
    
    document.body.appendChild(warningToast);
    
    // Add event listeners to buttons
    if (isAuthenticated) {
      document.getElementById('my-resumes-btn').addEventListener('click', () => {
        // Navigate to the My Resumes page
        window.location.href = "/my-resumes";
        document.body.removeChild(warningToast);
      });
    } else {
      document.getElementById('sign-in-btn').addEventListener('click', () => {
        // Navigate to the sign in page
        window.location.href = "/login";
        document.body.removeChild(warningToast);
      });
    }
    
    document.getElementById('close-toast-btn').addEventListener('click', () => {
      warningToast.classList.add('animate-fade-out');
      setTimeout(() => document.body.removeChild(warningToast), 300);
    });
  };
  
  const handleCreateResume = () => {
    // Always navigate directly to the resume builder page
    // Authentication will be handled there
    window.location.href = "/new-resume";
  };
  
  return (
    <div 
      className={`flex flex-col h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Elements */}
      {!isDarkMode && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        </div>
      )}
      
      {/* Header with controls */}
      <header className={`relative z-10 px-3 py-2 flex items-center justify-between shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="flex flex-1 items-center">
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
          
          {/* Button group with proper mobile layout */}
          <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center sm:gap-2">
            <button
              className={`py-1.5 px-1.5 sm:px-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center`}
              onClick={() => handleExport('DOCX')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">DOCX</span>
            </button>
            <button
              className="py-1.5 px-1.5 sm:px-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center"
              onClick={() => handleExport('PDF')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              className="py-1.5 px-1.5 sm:px-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center"
              onClick={handleCreateResume}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">{t('resumeDashboard.buttons.createNew', 'Create New Resume')}</span>
            </button>
          </div>
        </div>
        
        <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}> 
          {/* Zoom controls */}
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
        {/* Sidebar with customization options */}
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
              {t('resume.customizer.templates.templates', 'Templates')}
            </button>
            <button 
              className={`flex-1 py-2 text-xs font-medium transition-colors 
                ${activeTab === 'styling' 
                  ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
              `}
              onClick={() => setActiveTab('styling')}
            >
              {t('resume.customizer.templates.styling', 'Styling')}
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
                  {t('resume.customizer.templates.styles', 'Styles')}
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
                    {t('resume.customizer.spacing.title', 'Line Spacing')}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('resume.customizer.spacing.compact', 'Compact')}
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
                      {t('resume.customizer.spacing.spacious', 'Spacious')}
                    </span>
                  </div>
                </div>
                
                {/* Headers style selector */}
                <div className="mb-4">
                  <HeadersStyleToggle
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
                {t('resume.customizer.closeOptions', 'Close Options')}
              </button>
            </div>
          )}
        </aside>
        
        {/* Resume preview area */}
        <main 
          id="resumePreviewArea"
          className={`flex-1 overflow-auto p-3 relative z-10 ${isDarkMode ? 'bg-gray-900' : 'bg-transparent'} transition-colors duration-200`}
        >
          <div className="mx-auto max-w-4xl">
            <div 
              style={{ transform: `scale(${previewScale})` }}
              className="origin-top rounded-lg shadow-xl overflow-hidden transition-transform duration-200"
              ref={resumeRef}
            >
              <TemplateRenderer
                templateId={selectedTemplate}
                formData={SAMPLE_RESUME_DATA}
                customSettings={{
                  ...customSettings,
                  template: selectedTemplate
                }}
                darkMode={isDarkMode}
                isRTL={isRTL} 
                scale={1} // Scale is handled by the container
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RCPublic;