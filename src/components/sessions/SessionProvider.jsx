// src/components/session/SessionProvider.jsx
import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';

const SessionProvider = ({ children, darkMode }) => {
  const [initStatus, setInitStatus] = useState('initializing'); // initializing, ready, error
  const [retryCount, setRetryCount] = useState(0);
  const { 
    isSessionActive, 
    error, 
    initialize, 
    clearError 
  } = useSessionStore();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        setInitStatus('initializing');
        clearError();
        
        const success = await initialize();
        
        if (success) {
          setInitStatus('ready');
        } else {
          setInitStatus('error');
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        setInitStatus('error');
      }
    };

    // Only initialize if not already active
    if (!isSessionActive) {
      initializeSession();
    } else {
      setInitStatus('ready');
    }
  }, [isSessionActive, initialize, clearError]);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    clearError();
    
    try {
      setInitStatus('initializing');
      const success = await initialize();
      
      if (success) {
        setInitStatus('ready');
        setRetryCount(0);
      } else {
        setInitStatus('error');
      }
    } catch (error) {
      console.error('Retry failed:', error);
      setInitStatus('error');
    }
  };

  // Show loading state
  if (initStatus === 'initializing') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
      }`}>
        <div className={`max-w-md w-full text-center p-8 rounded-2xl shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <h2 className={`text-xl font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Initializing CV Platform
          </h2>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Setting up your secure session...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (initStatus === 'error') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 to-orange-50'
      }`}>
        <div className={`max-w-md w-full text-center p-8 rounded-2xl shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className={`text-xl font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Connection Error
          </h2>
          <p className={`text-sm mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {error || 'Unable to connect to the CV platform. Please check your internet connection and try again.'}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Retry {retryCount > 0 && `(${retryCount})`}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              Refresh Page
            </button>
          </div>
          
          {retryCount > 2 && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <p className="font-medium">Still having trouble?</p>
              <p>The platform might be undergoing maintenance. Please try again later.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Session is ready, render children
  return <>{children}</>;
};

export default SessionProvider;