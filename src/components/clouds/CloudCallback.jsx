// src/components/clouds/CloudCallback.jsx - Google Drive focused
import React, { useLayoutEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, Shield } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';

// ABSOLUTE GLOBAL LOCK
if (!window.__OAUTH_PROCESSED__) {
  window.__OAUTH_PROCESSED__ = new Set();
  window.__OAUTH_RESULTS__ = new Map();
}

const CloudCallback = ({ darkMode }) => {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Create unique key for this OAuth attempt
  const urlKey = `${provider}-${searchParams.get('success')}-${searchParams.get('error') || 'none'}`;
  
  // State with immediate default from global cache
  const [status, setStatus] = useState(() => {
    const cached = window.__OAUTH_RESULTS__.get(urlKey);
    return cached?.status || 'processing';
  });
  const [message, setMessage] = useState(() => {
    const cached = window.__OAUTH_RESULTS__.get(urlKey);
    return cached?.message || 'Processing Google Drive connection...';
  });

  const { handleOAuthReturn } = useSessionStore();

  // Use useLayoutEffect to run before React can duplicate
  useLayoutEffect(() => {
    // Check if this exact URL combination was already processed
    if (window.__OAUTH_PROCESSED__.has(urlKey)) {
      console.log('Google Drive OAuth already processed for this URL, using cached result');
      const cached = window.__OAUTH_RESULTS__.get(urlKey);
      if (cached) {
        setStatus(cached.status);
        setMessage(cached.message);
        if (cached.redirect) {
          setTimeout(() => navigate(cached.redirect.path, cached.redirect.options), 1000);
        }
      }
      return;
    }

    // Mark as processing to prevent other instances
    window.__OAUTH_PROCESSED__.add(urlKey);
    console.log('Processing Google Drive OAuth for:', urlKey);

    const processCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      let result = { status: 'error', message: 'Unknown error' };

      if (error) {
        result = {
          status: 'error',
          message: `Google Drive connection failed: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`
        };
      } else if (success === 'true') {
        try {
          // Set processing status
          const processingResult = {
            status: 'processing',
            message: 'Verifying Google Drive connection...'
          };
          window.__OAUTH_RESULTS__.set(urlKey, processingResult);
          setStatus('processing');
          setMessage('Verifying Google Drive connection...');

          // Wait for backend
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Try verification ONCE
          const verificationResult = await handleOAuthReturn('google_drive');

          if (verificationResult?.success) {
            result = {
              status: 'success',
              message: `Successfully connected to Google Drive!`,
              redirect: {
                path: '/new-resume',
                options: {
                  replace: true,
                  state: {
                    message: `Google Drive connected! You can now save your CV to the cloud.`,
                    provider: 'google_drive',
                    email: verificationResult.email
                  }
                }
              }
            };
          } else {
            result = {
              status: 'error',
              message: 'Backend verification failed. OAuth completed but status check shows disconnected. You can try the "Continue Anyway" option.'
            };
          }
        } catch (e) {
          result = {
            status: 'error',
            message: `Verification error: ${e.message}`
          };
        }
      } else {
        result = {
          status: 'error',
          message: 'No success confirmation received'
        };
      }

      // Cache the result globally
      window.__OAUTH_RESULTS__.set(urlKey, result);
      
      // Update this component's state
      setStatus(result.status);
      setMessage(result.message);

      // Handle redirect for success
      if (result.redirect) {
        setTimeout(() => {
          navigate(result.redirect.path, result.redirect.options);
        }, 2000);
      }
    };

    processCallback().catch(err => {
      const errorResult = {
        status: 'error',
        message: `Processing error: ${err.message}`
      };
      window.__OAUTH_RESULTS__.set(urlKey, errorResult);
      setStatus(errorResult.status);
      setMessage(errorResult.message);
    });

  }, [provider, urlKey, searchParams, navigate, handleOAuthReturn]);

  const handleContinueAnyway = () => {
    // Force set provider as connected
    const store = useSessionStore.getState();
    if (store.connectedProviders && !store.connectedProviders.includes('google_drive')) {
      // Manually update the store
      const newProviders = [...store.connectedProviders, 'google_drive'];
      useSessionStore.setState({ 
        connectedProviders: newProviders,
        googleDriveConnected: true,
        capabilities: {
          ...store.capabilities,
          canSaveToCloud: true,
          canSyncAcrossDevices: true
        }
      });
    }
    
    navigate('/new-resume', {
      state: {
        message: `Assuming Google Drive is connected. Try saving to test.`,
        provider: 'google_drive',
        assumeConnected: true
      }
    });
  };

  const handleRetry = () => {
    // Clear the cache for this URL to allow retry
    window.__OAUTH_PROCESSED__.delete(urlKey);
    window.__OAUTH_RESULTS__.delete(urlKey);
    navigate('/cloud-setup');
  };

  const handleGoHome = () => navigate('/');

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border text-center`}>
        
        {/* Status Icon */}
        <div className="mb-6">
          {status === 'processing' && (
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
            } mb-4`}>
              <Loader className={`w-8 h-8 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              } animate-spin`} />
            </div>
          )}
          {status === 'success' && (
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              darkMode ? 'bg-green-900/30' : 'bg-green-100'
            } mb-4`}>
              <CheckCircle className={`w-8 h-8 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
          )}
          {status === 'error' && (
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              darkMode ? 'bg-red-900/30' : 'bg-red-100'
            } mb-4`}>
              <AlertCircle className={`w-8 h-8 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {status === 'processing' && `Connecting to Google Drive...`}
          {status === 'success' && 'Connection Successful!'}
          {status === 'error' && 'Connection Issue'}
        </h1>

        {/* Message */}
        <p className={`text-base mb-6 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {message}
        </p>

        {/* Success Message */}
        {status === 'success' && (
          <div className={`mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center justify-center">
              <Shield className={`w-5 h-5 mr-2 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <span className={`text-sm font-medium ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                Your data stays in YOUR Google Drive account
              </span>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {status === 'processing' && (
          <div className={`w-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-full h-2 mb-6`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" 
                 style={{ width: '70%' }}>
            </div>
          </div>
        )}

        {/* Error Actions */}
        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={handleContinueAnyway}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Continue Anyway (Override Backend Check)
            </button>
            <button
              onClick={handleRetry}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Success redirect */}
        {status === 'success' && (
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Redirecting to resume builder...
          </p>
        )}

        {/* Debug */}
        {process.env.NODE_ENV === 'development' && (
          <div className={`mt-6 p-3 rounded-lg text-xs ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            <div><strong>URL Key:</strong> {urlKey}</div>
            <div><strong>Processed:</strong> {window.__OAUTH_PROCESSED__.has(urlKey) ? 'Yes' : 'No'}</div>
            <div><strong>Cached:</strong> {window.__OAUTH_RESULTS__.has(urlKey) ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudCallback;