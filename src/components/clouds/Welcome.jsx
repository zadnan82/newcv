// src/components/onboarding/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Cloud, 
  FileText, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Lock,
  Server,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useSessionStore from '../../stores/sessionStore';

const Welcome = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeWelcome, isActive, connectedProviders } = useSessionStore();

  const handleGetStarted = () => {
    completeWelcome();
    
    // If user already has providers connected, go to dashboard
    if (connectedProviders.length > 0) {
      navigate('/dashboard');
    } else {
      navigate('/connect-cloud');
    }
  };

  const handleBrowseTemplates = () => {
    navigate('/templates');
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'Your CV data never touches our servers. It lives securely in YOUR cloud storage.',
      color: 'green'
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: 'Multi-Cloud Support',
      description: 'Works with Google Drive, OneDrive, Dropbox, and Box. Your choice, your control.',
      color: 'blue'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI Enhancement',
      description: 'Smart suggestions to improve your CV content and match it to job requirements.',
      color: 'purple'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Professional Templates',
      description: 'ATS-friendly templates designed by professionals to get you noticed.',
      color: 'pink'
    }
  ];

  const securityPoints = [
    {
      icon: <Lock className="w-5 h-5" />,
      text: 'End-to-end encryption'
    },
    {
      icon: <Server className="w-5 h-5" />,
      text: 'No data stored on our servers'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      text: 'We never see your personal information'
    }
  ];

  if (!isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('welcome.title', 'Welcome to CV Cloud')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('welcome.subtitle', 'The privacy-focused CV manager that puts you in control')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
            >
              {t('welcome.getStarted', 'Get Started')}
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleBrowseTemplates}
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {t('welcome.browseTemplates', 'Browse Templates')}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white shadow-md'
              } transition-all hover:scale-105`}
            >
              <div className={`text-${feature.color}-500 mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Security Section */}
        <div className={`rounded-2xl p-8 mb-12 ${
          darkMode ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {t('welcome.securityTitle', 'Your Privacy is Our Priority')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('welcome.securityDescription', 'We built this platform with privacy at its core. Your data belongs to you, and only you.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {securityPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-green-500 flex-shrink-0">
                  {point.icon}
                </div>
                <span className="font-medium">{point.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="font-semibold">
              {t('welcome.readyToStart', 'Ready to take control of your CV?')}
            </span>
          </div>
          
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg flex items-center gap-2 transition-colors mx-auto"
          >
            {t('welcome.startNow', 'Start Now - It\'s Free')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;