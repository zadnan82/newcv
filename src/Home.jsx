import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import ResumeCard from './components/cards/ResumeCard';
import CoverLetterCard from './components/cards/CoverLetterCard'; 
import useAuthStore from './stores/authStore';
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
  const { isAuthenticated } = useAuthStore();
  
  const handleCreateResumeClick = () => {
    if (isAuthenticated) {
      navigate('/new-resume');
    } else {
      navigate('/login', { state: { redirectTo: '/new-resume' } });
    }
  };

  const handleCreateCoverLetterClick = () => {
    if (isAuthenticated) {
      navigate('/cover-letter');
    } else {
      navigate('/login', { state: { redirectTo: '/cover-letter' } });
    }
  };
  
  const handleExploreTemplatesClick = () => {
    console.log("Explore Templates button clicked");
    // Remove the alert as it can cause issues
    // Don't use try/catch as it doesn't help here
    navigate('/rc-public');
    
    // Add a fallback after a short delay
    setTimeout(() => {
      if (window.location.pathname !== '/rc-public') {
        console.log("Navigation may have failed, using direct location change");
        window.location.href = "/rc-public";
      }
    }, 500);
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

  // Features data
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
      title: t('prod1.features.cover_letters.title', 'Personalized Cover Letters'),
      description: t('prod1.features.cover_letters.description', 'Generate tailored cover letters that match the job description and highlight your relevant experience.'),
      color: "blue"
    }
  ];

  // Secondary features
  const secondaryFeatures = [
    {
      icon: <Target className="h-5 w-5" />,
      title: t('prod1.features.keyword_optimization.title', 'Keyword Optimization'),
      description: t('prod1.features.keyword_optimization.description', 'We analyze job descriptions to include the right keywords.')
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: t('prod1.features.industry_content.title', 'Industry-Specific Content'),
      description: t('prod1.features.industry_content.description', 'Tailored content for your industry and experience level.')
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: t('prod1.features.resume_analytics.title', 'Resume Analytics'),
      description: t('prod1.features.resume_analytics.description', 'See how your resume performs and get suggestions to improve it.')
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: t('prod1.features.expert_advice.title', 'Expert-Backed Advice'),
      description: t('prod1.features.expert_advice.description', 'Content based on insights from hiring managers and recruiters.')
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
    {t('prod1.hero.title', 'Land Your Dream Job')}
  </h1>
  
  <p className={`text-base md:text-lg max-w-2xl mx-auto mb-8 ${
    darkMode ? 'text-gray-300' : 'text-gray-700'
  } leading-relaxed`}>
    {t('prod1.hero.subtitle', 'Create stunning resumes and compelling cover letters with AI that gets you noticed by employers and passes ATS systems.')}
  </p>

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
            {t('revamp.atsFriendly', 'Visually striking yet ATS-compatible')}
          </li>
          <li className="flex items-center gap-2 mb-2">
            <CheckCircle className="size-4 text-green-500" />
            {t('revamp.modernLayouts', 'Balanced white space and typography')}
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            {t('revamp.customizableDesigns', 'Pixel-perfect print-ready formats')}
          </li>
        </ul>
        
        {/* Single "Use This Template" button that navigates to rc-public */}
<div className="relative z-10 mt-4"> {/* Added z-10 and relative positioning */}
  
  <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
  <button 
    onClick={() => navigate('/rc-public', { state: { selectedTemplate: currentIndex } })}
    className={`w-full sm:w-auto px-6 py-3 rounded-full font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center
      ${darkMode ? 
        'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-purple-500/20' :
        'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-purple-400/20'
      }`}
    style={{ pointerEvents: 'auto' }} // Ensure button is clickable
  >
    <span className="text-base mr-2"> {t('revamp.exploreTemplatesButton', 'Template')}</span>
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
              className={`w-full sm:w-auto px-6 py-3 rounded-full font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center
                ${darkMode ? 
                  'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-purple-500/20' :
                  'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-purple-400/20'
                }`}
              style={{ pointerEvents: 'auto' }} // Ensure button is clickable
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

        


        {/* Main Features Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t('prod1.sections.power_job_search', 'Power Your Job Search with AI')}
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('prod1.sections.power_job_description', 'Our powerful AI tools help you create professional-quality resumes and cover letters tailored to your target roles.')}
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
                {/* Icon container positioned better */}
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

        {/* Cards Section */}
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
              {t('prod1.sections.job_winning_description', 'Designed to help you stand out and make a strong impression on employers.')}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
            <ResumeCard darkMode={darkMode} />
            <CoverLetterCard darkMode={darkMode} /> 
          </div>
        </section>

        {/* Secondary Features Grid */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t('prod1.sections.everything_to_succeed', 'Everything You Need to Succeed')}
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('prod1.sections.everything_description', 'Packed with features to help you create standout application materials.')}
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
                  {/* Fixed icon container with proper spacing */}
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

        {/* How It Works */}
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
              {t('prod1.sections.how_it_works_description', 'Create professional resumes and cover letters in minutes with three simple steps.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Step 1 */}
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
              <h3 className="text-lg font-semibold mb-2">{t('prod1.steps.enter_details.title', 'Enter Your Details')}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('prod1.steps.enter_details.description', 'Fill in your information or upload an existing resume to get started quickly.')}
              </p>
            </div>
            
            {/* Step 2 */}
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
              <h3 className="text-lg font-semibold mb-2">{t('prod1.steps.ai_enhancement.title', 'AI Enhancement')}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('prod1.steps.ai_enhancement.description', 'Our AI analyzes your experience and the job requirements to suggest improvements.')}
              </p>
            </div>
            
            {/* Step 3 */}
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
              <h3 className="text-lg font-semibold mb-2">{t('prod1.steps.download_apply.title', 'Download & Apply')}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('prod1.steps.download_apply.description', 'Get your perfectly formatted resume or cover letter ready to impress employers.')}
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
              {t('prod1.sections.what_users_description', 'Success stories from job seekers who used CVATI to land their dream jobs.')}
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

        {/* Final CTA */}
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
                {t('prod1.cta.title', 'Ready to Land Your Dream Job?')}
              </h2>
              
              <p className={`text-sm md:text-base max-w-xl mx-auto mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('prod1.cta.description', 'Join thousands of professionals who have transformed their job search with our AI-powered tools.')}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={handleCreateResumeClick}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 flex items-center justify-center"
                >
                  <span className="text-base mr-2">{t('prod1.cta.build_resume', 'Build My Resume')}</span>
                  <ArrowRight size={16} />
                </button>
                
                <button 
                  onClick={handleCreateCoverLetterClick}
                  className={`w-full sm:w-auto px-6 py-3 rounded-full font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center
                    ${darkMode ? 
                      'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-purple-500/20' :
                      'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-purple-400/20'
                    }`}
                  style={{ pointerEvents: 'auto' }} // Ensure button is clickable
                >
                  <span className="text-base mr-2">{t('prod1.cta.create_cover_letter', 'Create Cover Letter')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;