// src/pages/SimpleCloudsPage.jsx - A dedicated page for cloud connection
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, CheckCircle } from 'lucide-react';
import SimpleCloudConnect from '../components/clouds/SimpleCloudConnect';
import useSessionStore from '../stores/sessionStore';

const SimpleCloudsPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [showBenefits, setShowBenefits] = useState(true);
  
  const { connectedProviders, canSaveToCloud } = useSessionStore();

  const handleContinueToBuilder = () => {
    navigate('/new-resume');
  };

  const benefits = [
    {
      icon: '🔒',
      title: 'Your Data Stays Private',
      description: 'Your CV data is stored directly in YOUR Google Drive account. We never see or access your personal information.'
    },
    {
      icon: '🌐',
      title: 'Access From Anywhere',
      description: 'Edit your CV from any device, anywhere in the world. Your changes sync automatically.'
    },
    {
      icon: '🚀',
      title: 'Never Lose Your Work',
      description: 'Your CV is automatically backed up in your own cloud storage. No more lost documents.'
    },
    {
      icon: '⚡',
      title: 'Quick & Easy Setup',
      description: 'One-click connection to Google Drive. Takes less than 30 seconds to set up.'
    }
  ];

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Connect Your Cloud Storage
          </h1>
          
          <p className={`text-xl mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Save your CV securely to your own Google Drive account
          </p>
          
          {/* Status Banner */}
          {canSaveToCloud() ? (
            <div className={`inline-flex items-center px-6 py-3 rounded-full ${
              darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-100 border border-green-200'
            }`}>
              <CheckCircle className={`w-5 h-5 mr-2 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <span className={`font-medium ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                ✨ Cloud storage connected! You're all set.
              </span>
            </div>
          ) : (
            <div className={`inline-flex items-center px-6 py-3 rounded-full ${
              darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-100 border border-blue-200'
            }`}>
              <Shield className={`w-5 h-5 mr-2 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`font-medium ${
                darkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                Connect Google Drive to unlock cloud features
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Side - Connection Card */}
          <div className="flex justify-center">
            <SimpleCloudConnect darkMode={darkMode} />
          </div>

          {/* Right Side - Benefits */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Connect Cloud Storage?
            </h2>

            {benefits.map((benefit, index) => (
              <div key={index} className={`p-4 rounded-lg border transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{benefit.icon}</div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 text-center space-y-4">
          <button
            onClick={handleContinueToBuilder}
            className={`inline-flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              canSaveToCloud()
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            {canSaveToCloud() ? (
              <>
                Continue to CV Builder
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Skip for Now (Save Locally)
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>

          {!canSaveToCloud() && (
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              You can connect cloud storage later from the CV builder
            </p>
          )}

          {canSaveToCloud() && (
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Your CV will be automatically saved to Google Drive
            </p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className={`mt-12 p-6 rounded-xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <div className="flex items-start space-x-4">
            <Shield className={`w-8 h-8 mt-1 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                Your Privacy is Our Priority
              </h3>
              <ul className={`text-sm space-y-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li>• <strong>Zero-Knowledge Architecture:</strong> We never see your CV data</li>
                <li>• <strong>Direct Storage:</strong> Files go straight to YOUR Google Drive</li>
                <li>• <strong>Full Control:</strong> You can revoke access at any time</li>
                <li>• <strong>No Tracking:</strong> We don't track or analyze your personal information</li>
                <li>• <strong>Open Source:</strong> Our code is transparent and auditable</li>
              </ul>
              
              <div className={`mt-4 p-3 rounded-lg ${
                darkMode ? 'bg-green-900/20' : 'bg-green-50'
              }`}>
                <p className={`text-xs ${
                  darkMode ? 'text-green-300' : 'text-green-700'
                }`}>
                  <strong>How it works:</strong> When you connect Google Drive, we get permission to create and edit files in a dedicated folder. Your CV data is encrypted and stored directly in your Google Drive. We act only as a secure bridge between your browser and your cloud storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCloudsPage;