// src/Home.jsx - SIMPLIFIED VERSION - No complex store functions
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import ResumeCard from './components/cards/ResumeCard';
import CoverLetterCard from './components/cards/CoverLetterCard'; 
import useSessionStore from './stores/sessionStore';
import cvatiLogo from './assets/cvlogo.png';
import { ArrowRight, CheckCircle, Star, Zap, PenTool, FileText, Briefcase, Users, BarChart, Target, Layout, HardDrive, Cloud, Smartphone } from 'lucide-react';
import temp1 from './assets/temp1.png';
import temp2 from './assets/temp2.png';
import temp3 from './assets/temp3.png';
import temp4 from './assets/temp4.png';
import temp5 from './assets/temp5.png';
import temp6 from './assets/temp6.png';

const Home = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // SIMPLIFIED - Just get what we actually need
  const { 
    connectedProviders,
    localCVs,
    canSaveToCloud
  } = useSessionStore();

  // SIMPLIFIED handlers - no complex logic
  const handleCreateResumeClick = () => {
    navigate('/new-resume');
  };

  const handleCreateCoverLetterClick = () => {
    navigate('/cover-letter');
  };
  
  const handleExploreTemplatesClick = () => {
    navigate('/rc-public');
  };
  
  const handleMyResumesClick = () => {
    navigate('/my-resumes');
  };

  // Template carousel (same as before)
  const [currentIndex, setCurrentIndex] = useState(1);
  const templates = [temp1, temp2, temp3, temp4, temp5, temp6];
  const templateNames = [
    "Minimalist", "Professional", "Creative", "Executive", "Modern", "Classic"
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

  // SIMPLIFIED status indicators
  const hasCloudStorage = connectedProviders && connectedProviders.length > 0;
  const hasLocalCVs = localCVs && localCVs.length > 0;
  const totalCVs = (localCVs?.length || 0) + (hasCloudStorage ? 1 : 0); // Simplified count

  // Updated testimonials focusing on flexibility
  const testimonials = [
    {
      name: "Alex Johnson",
      role: t('revamp.testimonials.role1', 'Software Engineer'),
      content: "Love that I can start building immediately and choose where to save later. No signup hassle!",
      rating: 5
    },
    {
      name: "Sarah Williams", 
      role: t('revamp.testimonials.role2', 'Marketing Specialist'),
      content: "Built my CV locally first, then connected Google Drive when I needed it on my phone. Perfect!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: t('revamp.testimonials.role3', 'Data Analyst'), 
      content: "Finally, a CV platform that doesn't force me to create an account. Just works!",
      rating: 5
    }
  ];
  
  // Updated stats
  const stats = [
    { label: "CVs Created", value: "15,000+" },
    { label: "No Signups Required", value: "100%" },
    { label: "Instant Access", value: "0 seconds" },
    { label: "User Satisfaction", value: "98%" }
  ];

  // Updated features - emphasizing local-first approach
  const mainFeatures = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Instant Access",
      description: "Start building immediately. No signup, no barriers, just create your CV right now.",
      color: "purple"
    },
    {
      icon: <HardDrive className="h-6 w-6" />,
      title: "Local-First Design", 
      description: "Work entirely on your device. Save locally or upgrade to cloud storage when you need it.",
      color: "pink"
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Optional Cloud Upgrade",
      description: "Connect your cloud storage when you want to access your CVs from multiple devices.",
      color: "blue"
    }
  ];

  // Updated secondary features
  const secondaryFeatures = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Your Choice",
      description: "Save locally for privacy or to cloud for convenience. You decide."
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "No Lock-in",
      description: "Switch between local and cloud storage anytime. Your data, your choice."
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "Instant Preview",
      description: "See your CV in different templates immediately, no waiting."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Privacy First",
      description: "We never see your data unless you choose to use AI features."
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
            Start Building. Choose Storage Later.
          </h1>
          
          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } leading-relaxed`}>
            No signups. No barriers. Just start creating your professional CV right now. 
            Save locally or connect cloud storage when you need it.
          </p>

          {/* SIMPLIFIED Current Capabilities Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${
            hasCloudStorage 
              ? darkMode ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-700 border border-green-200'
              : darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-700/50' : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {hasCloudStorage 
              ? `Ready: Local + Cloud Storage (Connected)` 
              : 'Ready: Local Storage • Cloud Available'
            }
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
                    {templateNames[currentIndex]} Template
                  </h2>
                  
                  <p className={`text-sm md:text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Professional templates that work everywhere. Start building immediately with any design, 
                    then save to your device or cloud storage.
                  </p>
                  
                  <ul className={`mb-6 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex items-center gap-2 mb-2">
                      <CheckCircle className="size-4 text-green-500" />
                      No signup required - start immediately
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <CheckCircle className="size-4 text-green-500" />
                      Save locally or upgrade to cloud later
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      ATS-friendly and beautifully designed
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
                      >
                        <span className="text-base mr-2">Browse All Templates</span>
                        <ArrowRight size={16} />
                      </button>
                      
                      <button 
                        onClick={handleCreateResumeClick}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 flex items-center justify-center"
                      >
                        <span className="text-base mr-2">Start Building Now</span>
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
              Local-First. Cloud When You Need It.
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Start building immediately on your device, then choose your storage option.
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

        {/* Cards Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Create Professional Documents
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Start immediately. No signup required. Choose your storage option when you save.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
            <ResumeCard darkMode={darkMode} onCreateClick={handleCreateResumeClick} />
            <CoverLetterCard darkMode={darkMode} onCreateClick={handleCreateCoverLetterClick} /> 
          </div>
        </section>

        {/* Storage Options Showcase */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Your Data, Your Choice
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Work the way you want. Local privacy or cloud convenience - you decide.
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

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              How It Works
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Simple, flexible, and puts you in control of your data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
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
              <h3 className="text-lg font-semibold mb-2">Start Building</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Choose a template and start creating your CV immediately. No signup, no barriers.
              </p>
            </div>
            
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
              <h3 className="text-lg font-semibold mb-2">Choose Storage</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                When ready to save, choose local storage or connect your cloud for device sync.
              </p>
            </div>
            
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
                Local files stay on your device. Cloud files sync across all your devices automatically.
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
              What Our Users Say
            </h2>
            <p className={`max-w-2xl mx-auto text-sm md:text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              People love the flexibility and instant access.
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

        {/* Final CTA - SIMPLIFIED */}
        <section className="text-center">
          <div className={`max-w-3xl mx-auto p-8 rounded-2xl ${
            darkMode 
              ? 'bg-gray-800/80 border border-gray-700' 
              : 'bg-white/90 border border-gray-200/50'
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
                Ready to Build Your Professional CV?
              </h2>
              
              <p className={`text-sm md:text-base max-w-xl mx-auto mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Start immediately - no signup required. Save locally for privacy or connect cloud storage for convenience.
              </p>
              
              {/* SIMPLIFIED status indicator */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                hasCloudStorage 
                  ? darkMode ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-700 border border-green-200'
                  : darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-700/50' : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {hasCloudStorage 
                  ? `Ready: Local + Cloud Storage Available`
                  : 'Ready: Local Storage • Cloud Optional'
                }
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={handleCreateResumeClick}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 flex items-center justify-center"
                >
                  <span className="text-base mr-2">Start Building Now</span>
                  <ArrowRight size={16} />
                </button>
                
                <button 
                  onClick={handleMyResumesClick}
                  className={`w-full sm:w-auto px-6 py-3 rounded-full font-medium shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center ${
                    darkMode ? 
                      'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-purple-500/20' :
                      'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-purple-400/20'
                  }`}
                >
                  <span className="text-base mr-2">
                    {hasLocalCVs || hasCloudStorage 
                      ? `View My CVs ${totalCVs > 0 ? `(${totalCVs})` : ''}` 
                      : 'Browse Templates'
                    }
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
              
              {/* SIMPLIFIED suggestions */}
              {!hasCloudStorage && (
                <div className="mt-6">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                    💡 Tip: Connect cloud storage to access your CVs from any device
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;