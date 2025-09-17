// src/components/clouds/CloudConnectionSuccess.jsx - Updated for cleaner flow
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, FileText, FileSignature, FolderOpen, Cloud, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useSessionStore from '../../stores/sessionStore';

const CloudConnectionSuccess = ({ darkMode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [showAnimation, setShowAnimation] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(5);
  
  const provider = searchParams.get('provider');
  const { 
    checkCloudStatus, 
    connectedProviders, 
    completeOnboarding,
    canAccessCVFeatures
  } = useSessionStore();

  useEffect(() => {
    // Refresh cloud status after connection
    checkCloudStatus();
    
    // Show animation after a brief delay
    setTimeout(() => setShowAnimation(true), 500);
    
    // Complete onboarding since user connected a provider
    completeOnboarding();
  }, [checkCloudStatus, completeOnboarding]);

  // Auto-redirect timer
  useEffect(() => {
    if (redirectTimer > 0 && canAccessCVFeatures()) {
      const timer = setTimeout(() => {
        setRedirectTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (redirectTimer === 0) {
      navigate('/new-resume');
    }
  }, [redirectTimer, navigate, canAccessCVFeatures]);

  const handleCreateResume = () => {
    navigate('/new-resume');
  };

  const handleViewResumes = () => {
    navigate('/my-resumes');
  };

  const handleContinueExploring = () => {
    navigate('/');
  };

  const handleSkipTimer = () => {
    setRedirectTimer(0);
  };

  const providerNames = {
    google_drive: 'Google Drive',
    onedrive: 'OneDrive',
    dropbox: 'Dropbox',
    box: 'Box'
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} flex items-center justify-center p-4`}>
      <div className={`max-w-2xl w-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border p-8`}>
        
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} mb-6 transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <CheckCircle className={`w-12 h-12 ${darkMode ? 'text-green-400' : 'text-green-600'} transition-all duration-1000 delay-300 ${showAnimation ? 'scale-100' : 'scale-0'}`} />
          </div>
          
          <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎉 Successfully Connected!
          </h1>
          
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            Your {providerNames[provider] || 'cloud storage'} is now connected
          </p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-700/50' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
            <Cloud className="w-4 h-4 mr-2" />
            Privacy-First • Your Data Stays in YOUR Cloud
          </div>
        </div>

        {/* Auto-redirect notice */}
        {canAccessCVFeatures() && redirectTimer > 0 && (
          <div className={`text-center mb-6 p-4 rounded-lg ${darkMode ? 'bg-purple-900/20 border border-purple-700/50' : 'bg-purple-50 border border-purple-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'} mb-2`}>
              Automatically redirecting to CV builder in {redirectTimer} seconds...
            </p>
            <button
              onClick={handleSkipTimer}
              className={`text-sm font-medium ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} underline`}
            >
              Skip and go now
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            What would you like to do first?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create New Resume */}
            <button
              onClick={handleCreateResume}
              className={`group p-6 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105 ${darkMode ? 'border-purple-700 hover:border-purple-500 hover:bg-purple-900/20' : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50'}`}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${darkMode ? 'bg-purple-900/30 group-hover:bg-purple-800/50' : 'bg-purple-100 group-hover:bg-purple-200'} transition-colors`}>
                  <FileSignature className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Create Your First Resume
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Start building a professional resume with AI assistance
                </p>
                <div className="flex items-center justify-center mt-3 text-purple-500 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium mr-1">Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* Check Existing Resumes */}
            <button
              onClick={handleViewResumes}
              className={`group p-6 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105 ${darkMode ? 'border-blue-700 hover:border-blue-500 hover:bg-blue-900/20' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'}`}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${darkMode ? 'bg-blue-900/30 group-hover:bg-blue-800/50' : 'bg-blue-100 group-hover:bg-blue-200'} transition-colors`}>
                  <FolderOpen className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  View My Resumes
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Access existing resumes from your cloud storage
                </p>
                <div className="flex items-center justify-center mt-3 text-blue-500 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium mr-1">Browse Files</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mb-8">
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            More Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleContinueExploring}
              className={`flex items-center p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${darkMode ? 'border-gray-600 hover:border-green-500 hover:bg-green-900/10' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <FileText className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div className="text-left">
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Explore Templates
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Browse our template gallery
                </p>
              </div>
            </button>

            <div className={`flex items-center p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <Cloud className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <div className="text-left">
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Cloud Storage
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {connectedProviders.length} provider{connectedProviders.length !== 1 ? 's' : ''} connected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Reminder */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-start">
            <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'} mt-0.5 mr-3 flex-shrink-0`} />
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'} mb-1`}>
                Your Privacy is Protected
              </h4>
              <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                Your CV data is stored securely in your own {providerNames[provider] || 'cloud storage'} account. 
                We never see or store your personal information on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Connected Providers Count */}
        {connectedProviders.length > 1 && (
          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              You now have {connectedProviders.length} cloud providers connected
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudConnectionSuccess;