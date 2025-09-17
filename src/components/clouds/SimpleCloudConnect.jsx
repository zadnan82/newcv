// src/components/clouds/SimpleCloudConnect.jsx - Google Drive focused
import React, { useState } from 'react';
import { Cloud, CheckCircle, Loader2, Shield } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';

const SimpleCloudConnect = ({ darkMode }) => {
  const [connecting, setConnecting] = useState(false);
  
  const { 
    connectedProviders, 
    connectToCloudProvider, 
    loading, 
    error,
    clearError
  } = useSessionStore();

  const handleConnect = async () => {
    setConnecting(true);
    clearError();
    
    try {
      console.log('🔗 User clicked connect to Google Drive');
      await connectToCloudProvider('google_drive');
      // If successful, this will redirect to OAuth, so we won't reach here
    } catch (error) {
      console.error('❌ Connection failed:', error);
      setConnecting(false);
    }
  };

  // If already connected, show success state
  if (connectedProviders.includes('google_drive')) {
    return (
      <div className={`max-w-md w-full p-6 rounded-xl border-2 ${
        darkMode 
          ? 'border-green-500 bg-gray-800' 
          : 'border-green-300 bg-green-50'
      }`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
            darkMode ? 'bg-green-900/30' : 'bg-green-100'
          }`}>
            <CheckCircle className={`w-6 h-6 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
          </div>
          
          <h3 className={`text-lg font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Google Drive Connected
          </h3>
          
          <p className={`text-sm mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            You can now save your CVs directly to your Google Drive
          </p>
          
          <div className={`p-3 rounded-lg ${
            darkMode ? 'bg-green-900/20' : 'bg-green-100'
          }`}>
            <div className="flex items-center justify-center">
              <Shield className={`w-4 h-4 mr-2 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <span className={`text-xs ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                Your data stays in YOUR Google Drive
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show connection button
  return (
    <div className={`max-w-md w-full p-6 rounded-xl border-2 border-dashed transition-all duration-200 ${
      darkMode 
        ? 'border-blue-600 bg-gray-800 hover:border-blue-500' 
        : 'border-blue-300 bg-white hover:border-blue-500 hover:shadow-md'
    }`}>
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
          darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
        }`}>
          <Cloud className={`w-6 h-6 ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Connect Google Drive
        </h3>
        
        <p className={`text-sm mb-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Save your CVs securely to your own Google Drive account
        </p>
        
        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            darkMode ? 'bg-red-900/20 text-red-300 border border-red-700' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {error}
          </div>
        )}
        
        <button
          onClick={handleConnect}
          disabled={connecting || loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            connecting || loading
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          {connecting || loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
              Connecting...
            </>
          ) : (
            <>
              🗂️ Connect Google Drive
            </>
          )}
        </button>
        
        <div className={`mt-4 p-3 rounded-lg ${
          darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-start">
            <Shield className={`w-4 h-4 mt-0.5 mr-2 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <div className="text-left">
              <p className={`text-xs font-medium mb-1 ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                Privacy Protected
              </p>
              <p className={`text-xs ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                Your CVs are saved directly to your Google Drive - we never access your files
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCloudConnect;