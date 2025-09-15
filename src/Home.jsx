import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import ResumeCard from './components/cards/ResumeCard';
import CoverLetterCard from './components/cards/CoverLetterCard'; 
import useSessionStore from './stores/sessionStore'; // Updated import
import cvatiLogo from './assets/cvlogo.png';
import { ArrowRight, CheckCircle, Star, Zap, PenTool, FileText, Briefcase, Users, BarChart, Target, Layout } from 'lucide-react';
import temp1 from './assets/temp1.png';
import temp2 from './assets/temp2.png';
import temp3 from './assets/temp3.png';
import temp4 from './assets/temp4.png';
import temp5 from './assets/temp5.png';
import temp6 from './assets/temp6.png';

const Home = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Updated to use session store instead of auth store
  const { isSessionActive, hasConnectedProviders, initialize } = useSessionStore();
  
  const handleCreateResumeClick = async () => {
    // Check if we have an active session
    if (!isSessionActive) {
      // Initialize session if needed
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    }
    
    // Check if user has connected cloud providers
    if (hasConnectedProviders()) {
      navigate('/new-resume');
    } else {
      // Redirect to cloud setup first
      navigate('/cloud-setup');
    }
  };

  const handleCreateCoverLetterClick = async () => {
    // Check if we have an active session
    if (!isSessionActive) {
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    }
    
    // Check if user has connected cloud providers
    if (hasConnectedProviders()) {
      navigate('/cover-letter');
    } else {
      // Redirect to cloud setup first
      navigate('/cloud-setup');
    }
  };
  
  const handleExploreTemplatesClick = () => {
    console.log("Explore Templates button clicked");
    navigate('/rc-public');
    
    setTimeout(() => {
      if (window.location.pathname !== '/rc-public') {
        console.log("Navigation may have failed, using direct location change");
        window.location.href = "/rc-public";
      }
    }, 500);
  };
  
  const handleMyResumesClick = async () => {
    if (!isSessionActive) {
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    }
    
    if (hasConnectedProviders()) {
      navigate('/my-resumes');
    } else {
      navigate('/cloud-setup');
    }
  };

// Inside your Home component
const [currentIndex, setCurrentIndex] = useState(1); // Start with middle template
const templates = [temp1, temp2, temp3, temp4, temp5, temp6];
const templateNames = [
  "Minimalist",
  "Professional",
  "Creative",
  "Executive",
  "Modern",
  "Classic"
];

const nextTemplate = () => {
  setCurrentIndex((prevIndex) => 
    prevIndex === templates.length - 1 ? 0 : prevIndex + 1
  );
};

const prevTemplate = () => {
  setCurrentIndex((prevIndex) => 
    prevIndex === 0 ? templates.length - 1 : prevIndex - 1
  );
};

const getTemplateIndex = (offset) => {
  let index = currentIndex + offset;
  if (index < 0) index = templates.length - 1;
  if (index >= templates.length) index = 0;
  return index;
};

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Johnson",
      role: t('revamp.testimonials.role1', 'Software Engineer'),
      content: t('revamp.testimonials.content1', 'CVATI helped me land interviews at three major tech companies. The AI suggestions made my resume stand out from the crowd!'),
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: t('revamp.testimonials.role2', 'Marketing Specialist'),
      content: t('revamp.testimonials.content2', 'The cover letter generator is amazing! It perfectly captured my experience and the tone I was looking for. Saved me hours of work.'),
      rating: 5
    },
    {
      name: "Michael Chen",
      role: t('revamp.testimonials.role3', 'Data Analyst'),
      content: t('revamp.testimonials.content3', 'After struggling to get callbacks, I revamped my resume with CVATI and started getting interview requests within days.'),
      rating: 4
    }
  ];
  
  // Statistics data
  const stats = [
    { label: t('prod1.stats.resumes_created', 'Resumes Created'), value: "10,000+" },
    { label: t('prod1.stats.cover_letters', 'Cover Letters Generated'), value: "5,000+" },
    { label: t('prod1.stats.interview_rate', 'Interview Success Rate'), value: "78%" },
    { label: t('prod1.stats.job_match', 'Job Match Rate'), value: "92%" }
  ];

  // Features data - Updated descriptions for privacy-first approach
  const mainFeatures = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: t('prod1.features.ats_templates.title', 'ATS-Optimized Templates'),
      description: t('prod1.features.ats_templates.description', 'Our resume templates are designed to pass Applicant Tracking Systems and get your resume in front of hiring managers.'),
      color: "purple"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t('prod1.features.ai_content.title', 'AI-Powered Content Generation'),
      description: t('prod1.features.ai_content.description', 'Intelligent suggestions for skills, achievements, and job descriptions that match your target role.'),
      color: "pink"
    },
    {
      icon: <PenTool className="h-6 w-6" />,
      title: t('prod1.features.cover_letters.title', 'Privacy-First Cloud Storage'),
      description: 'Your CV data is stored securely in YOUR cloud storage account. We never see or store your personal information.',
      color: "blue"
    }
  ];

  // Secondary features - Updated for cloud storage
  const secondaryFeatures = [
    {
      icon: <Target className="h-5 w-5" />,
      title: t('prod1.features.keyword_optimization.title', 'Multi-Cloud Support'),
      description: 'Works with Google Drive, OneDrive, Dropbox, and Box. Your choice, your control.'
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: t('prod1.features.industry_content.title', 'No User Accounts'),
      description: 'Anonymous sessions mean no passwords, no data breaches, no privacy concerns.'
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: t('prod1.features.resume_analytics.title', 'Real-time Sync'),
      description: 'Access your CVs from any device. Changes sync automatically across all your devices.'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: t('prod1.features.expert_advice.title', 'GDPR Compliant'),
      description: 'Privacy by design. We comply with all data protection regulations by not storing your data.'
    }
  ];
  
  return (
    <div className={`flex-grow ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 pt-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
<header className="text-center relative py-12 md:py-16 lg:py-20">
  {/* Decorative elements */}
  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full opacity-70 blur-sm"></div>
  
  {/* Logo */}
  <div className="flex justify-center mb-6">
    <img 
      src={cvatiLogo} 
      alt="CVATI" 
      className="w-48 md:w-56 lg:w-64 h-auto drop-shadow-lg" 
    />
  </div>
  
  <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 leading-relaxed`}>
    {t('prod1.hero.title', 'Privacy-First CV Platform')}
  </h1>
  
  <p className={`text-base md:text-lg max-w-2xl mx-auto mb-8 ${
    darkMode ? 'text-gray-300' : 'text-gray-700'
  } leading-relaxed`}>
    Create stunning resumes with AI enhancement. Your data stays in YOUR cloud storage - we never see your personal information.
  </p>

  {/* Privacy Badge */}
  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${
    darkMode ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-700 border border-green-200'
  }`}>
    <CheckCircle className="w-4 h-4 mr-2" />
    Zero Data Liability • GDPR Compliant • Privacy by Design
  </div>

  {/* Artistic 3D Carousel Section */}
<section className="mb-16">
  <div className={`rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/90'} shadow-xl overflow-hidden relative`}>
    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 mix-blend-overlay"></div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 3D Carousel Column */}
      <div className="p-6 lg:p-10 flex items-center justify-center">
        <div className="relative w-full h-96">
          {/* Left Template (tilted) */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-64 rounded-lg shadow-lg overflow-hidden transform -rotate-6 transition-all duration-300 hover:z-10 hover:scale-105 cursor-pointer"
            onClick={() => {
              prevTemplate();
              handleExploreTemplatesClick();
            }}
          >
            <img 
              src={templates[getTemplateIndex(-1)]} 
              alt={`Resume Template ${getTemplateIndex(-1) + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${
              darkMode ? 'from-gray-900/80 to-transparent' : 'from-white/90 to-transparent'
            } p-2 text-center`}>
              <span className={`text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{templateNames[getTemplateIndex(-1)]}</span>
            </div>
          </div>

          {/* Center Template (focused) */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-80 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 z-10 hover:scale-110 cursor-pointer"
            onClick={handleExploreTemplatesClick}
          >
            <img 
              src={templates[currentIndex]} 
              alt={`Featured Resume Template ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Right Template (tilted) */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-64 rounded-lg shadow-lg overflow-hidden transform rotate-6 transition-all duration-300 hover:z-10 hover:scale-105 cursor-pointer"
            onClick={() => {
              nextTemplate();
              handleExploreTemplatesClick();
            }}
          >
            <img 
              src={templates[getTemplateIndex(1)]} 
              alt={`Resume Template ${getTemplateIndex(1) + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${
              darkMode ? 'from-gray-900/80 to-transparent' : 'from-white/90 to-transparent'
            } p-2 text-center`}>
              <span className={`text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{templateNames[getTemplateIndex(1)]}</span>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-all duration-200"
            aria-label="Previous template"
            onClick={(e) => {
              e.stopPropagation();
              prevTemplate();
            }}
          >
            <ArrowRight className="size-5 text-gray-800 rotate-180" />
          </button>
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-all duration-200"
            aria-label="Next template"
            onClick={(e) => {
              e.stopPropagation();
              nextTemplate();
            }}
          >
            <ArrowRight className="size-5 text-gray-800" />
          </button>
        </div>
      </div>
      
      {/* Text Content Column */}
      <div className="p-8 md:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <Layout className="size-5 text-purple-600" />
          <span className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {t('resume.customizer.templates.title', 'Resume Templates')}
          </span>
        </div>
        
        <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {templateNames[currentIndex]} {t('revamp.exploreTemplates', 'Template')}
        </h2>
        
        <p className={`text-sm md:text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('revamp.exploreTemplatesDescription', 'Our gallery showcases beautifully crafted templates that combine aesthetics with functionality. Each design is carefully created to make your resume stand out.')}
        </p>
        
        <ul className={`mb-6 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <li className="flex items-center gap-2 mb-2">
            <CheckCircle className="size-4 text-green-500" />
            Stored securely in YOUR cloud storage
          </li>
          <li className="flex items-center gap-2 mb-2">
            <CheckCircle className="size-4 text-green-500" />
            {t('revamp.modernLayouts', 'ATS-compatible and beautifully designed')}
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            {t('revamp.customizableDesigns', 'AI-enhanced content suggestions')}
          </li>
        </ul>
        
        {/* Action Buttons */}
        <div className="relative z-10 mt-4">
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button 
              onClick={() => navigate('/rc-public', { state: { selectedTemplate: currentIndex } })}
              className={`w-full sm:w-auto px-6 py-3 rounded-full font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center ${
                darkMode ? 
                  'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-purple-500/20' :
                  'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-purple-400/20'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <span className="text-base mr-2">Explore Templates</span>
              <ArrowRight size={16} />
            </button>
            
            <button 
              onClick={handleCreateResumeClick}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 flex items-center justify-center"
            >
              <span className="text-base mr-2">{t('cards.resume.actions.build', 'Create Resume')}</span>
              <ArrowRight size={16} />
            </button>
            
            <button 
              onClick={handleCreateCoverLetterClick}
              className={`w-full sm:w-auto px-6 py-3 rounded-full font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center ${
                darkMode ? 
                  'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-purple-500/20' :
                  'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-purple-400/20'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <span className="text-base mr-2">{t('cards.cover_letter.actions.create', 'Generate Cover Letter')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
        </header>

        {/* Main Features Section - Updated for privacy-first */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Privacy-First CV Platform
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your CV data never leaves your control. We use your cloud storage, not ours.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {mainFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`relative p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                  darkMode 
                    ? 'bg-gray-800/80 border border-gray-700/50' 
                    : 'bg-white/90 border border-gray-200/50 shadow-md'
                }`}
              >
                <div className="flex justify-start mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                    feature.color === 'purple' 
                      ? 'from-purple-500 to-purple-600 shadow-purple-500/20' 
                      : feature.color === 'pink' 
                        ? 'from-pink-500 to-pink-600 shadow-pink-500/20' 
                        : 'from-blue-500 to-blue-600 shadow-blue-500/20'
                  } shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cards Section - Updated with new handlers */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t('prod1.sections.job_winning_documents', 'Create Job-Winning Documents')}
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Stored securely in your cloud storage. Access from anywhere, anytime.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
            <ResumeCard darkMode={darkMode} onCreateClick={handleCreateResumeClick} />
            <CoverLetterCard darkMode={darkMode} onCreateClick={handleCreateCoverLetterClick} /> 
          </div>
        </section>

        {/* Secondary Features Grid - Updated for cloud features */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Why Choose Our Privacy-First Platform?
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Advanced features designed with your privacy and security in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondaryFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl ${
                  darkMode 
                    ? 'bg-gray-800/80 border border-gray-700/50' 
                    : 'bg-white/90 border border-gray-200/50 shadow-sm'
                }`}
              >
                <div className="flex items-start">
                  <div className={`mr-3 p-2 rounded-lg inline-flex items-center justify-center flex-shrink-0 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`} style={{ minWidth: '36px', minHeight: '36px' }}>
                    <div className={darkMode ? 'text-purple-400' : 'text-purple-600'}>
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works - Updated for cloud storage flow */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t('prod1.sections.how_it_works', 'How It Works')}
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get started in minutes with our privacy-first approach to CV building.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Step 1 - Updated */}
            <div className={`relative p-6 ${
              darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-800'
            } rounded-xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } shadow-sm`}>
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Cloud Storage</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Choose from Google Drive, OneDrive, Dropbox, or Box. Your data stays in YOUR account.
              </p>
            </div>
            
            {/* Step 2 - Updated */}
            <div className={`relative p-6 ${
              darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-800'
            } rounded-xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } shadow-sm`}>
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create & Enhance with AI</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Build your CV with our templates and get AI-powered suggestions for content improvement.
              </p>
            </div>
            
            {/* Step 3 - Updated */}
            <div className={`relative p-6 ${
              darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-800'
            } rounded-xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } shadow-sm`}>
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Access Anywhere</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your CV syncs across all devices. Download, share, or edit from anywhere, anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t('prod1.sections.what_users_say', 'What Our Users Say')}
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('prod1.sections.what_users_description', 'Success stories from job seekers who trust our privacy-first platform.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl ${
                  darkMode 
                    ? 'bg-gray-800/80 border border-gray-700/50' 
                    : 'bg-white/90 border border-gray-200/50 shadow-md'
                }`}
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.content}"
                </p>
                <div>
                  <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy-Focused CTA */}
        <section className="text-center">
          <div className={`max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-r ${
            darkMode 
              ? 'from-gray-800 via-gray-800 to-gray-800 border border-gray-700' 
              : 'from-white/90 via-white/90 to-white/90 border border-gray-200/50'
          } shadow-xl relative overflow-hidden`}>
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-600 blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-blue-600 blur-3xl"></div>
            </div>
            
            <div className="relative">
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Ready to Take Control of Your Career Data?
              </h2>
              
              <p className={`text-sm md:text-base max-w-xl mx-auto mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Join thousands of professionals who have chosen our privacy-first CV platform. Your data, your cloud, your control.
              </p>
              
              {/* Trust indicators */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                darkMode ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                <CheckCircle className="w-4 h-4 mr-2" />
                No Data Storage • No Privacy Risks • No Vendor Lock-in
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={handleCreateResumeClick}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 flex items-center justify-center"
                >
                  <span className="text-base mr-2">Start Building Securely</span>
                  <ArrowRight size={16} />
                </button>
                
                {hasConnectedProviders() && (
                  <button 
                    onClick={handleMyResumesClick}
                    className={`w-full sm:w-auto px-6 py-3 rounded-full font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center ${
                      darkMode ? 
                        'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-purple-500/20' :
                        'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-purple-400/20'
                    }`}
                  >
                    <span className="text-base mr-2">View My Resumes</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;