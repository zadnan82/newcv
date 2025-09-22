// src/components/clouds/CloudCallback.jsx - FIXED VERSION with Dropbox support
import React, { useLayoutEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, Shield } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import { useTranslation } from 'react-i18next';

const CloudCallback = ({ darkMode }) => {
  
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState(t('cloud.processing_connection'));
  const [processed, setProcessed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const { handleOAuthReturn } = useSessionStore();

  // Provider configurations for display
  const providerConfigs = {
    'google_drive': {
      name: 'Google Drive',
      icon: '📄',
      displayName: 'Google Drive'
    },
    'onedrive': {
      name: 'OneDrive', 
      icon: '☁️',
      displayName: 'Microsoft OneDrive'
    },
    'dropbox': {
      name: 'Dropbox',
      icon: '📦', 
      displayName: 'Dropbox'
    }
  };

  const currentProvider = providerConfigs[provider] || { 
    name: provider, 
    icon: '📁', 
    displayName: provider 
  };

  useLayoutEffect(() => {
    console.log(`🔧 CloudCallback: Processing ${provider} OAuth return...`);
    console.log(`🔧 URL params:`, Object.fromEntries(searchParams.entries()));
    
    // Make sure we're using the correct provider
    if (!provider) {
      console.error('❌ No provider detected in URL params');
      setStatus('error');
      setMessage('No provider specified in callback');
      return;
    }
    if (processed) return;
    
    console.log(`🔧 CloudCallback: Processing ${provider} OAuth return...`);
    setProcessed(true);

    const processCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setMessage(`${t('cloud.connection_failed')}: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        return;
      }

      if (success === 'true') {
        try {
          setStatus('processing');
          setMessage(t('cloud.verifying_connection'));

          // FIXED: Add timeout to prevent infinite loops
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Verification timeout')), 10000)
          );

          const verificationPromise = (async () => {
            // Wait for backend to process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Try verification with limited attempts
            let attempts = 0;
            const maxAttempts = 3;
            
            while (attempts < maxAttempts) {
              try {
                const result = await handleOAuthReturn(provider);
                if (result?.success) {
                  return result;
                }
                attempts++;
                if (attempts < maxAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 2000));
                }
              } catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                  throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
            }
            throw new Error('Max verification attempts reached');
          })();

          const verificationResult = await Promise.race([
            verificationPromise,
            timeoutPromise
          ]);

          if (verificationResult?.success) {
            setStatus('success');
            setMessage(t('cloud.connection_successful'));
            
            setTimeout(() => {
              navigate('/new-resume', {
                replace: true,
                state: {
                  message: `${currentProvider.displayName} connected successfully`,
                  provider: provider,
                  email: verificationResult.email
                }
              });
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Connection verification failed');
          }
        } catch (e) {
          console.error('Verification error:', e);
          setStatus('error');
          setMessage(`${t('cloud.verification_error')}: ${e.message}`);
        }
      } else {
        setStatus('error');
        setMessage(t('cloud.no_success_confirmation'));
      }
    };

    processCallback().catch(err => {
      console.error('Callback processing error:', err);
      setStatus('error');
      setMessage(`${t('cloud.processing_error')}: ${err.message}`);
    });
  }, [processed, provider, searchParams, navigate, handleOAuthReturn, t, currentProvider.displayName]);

  const handleContinueAnyway = () => {
    // Force success and continue
    const store = useSessionStore.getState();
    const newProviders = [...(store.connectedProviders || []), provider];
    useSessionStore.setState({ 
      connectedProviders: newProviders,
      providerStatuses: {
        ...store.providerStatuses,
        [provider]: { connected: true, provider, email: 'manual_override@example.com' }
      },
      capabilities: {
        ...store.capabilities,
        canSaveToCloud: true,
        canSyncAcrossDevices: true
      }
    });
    
    navigate('/new-resume', {
      replace: true,
      state: {
        message: `${currentProvider.displayName} connection assumed successful`,
        provider: provider,
        assumeConnected: true
      }
    });
  };

  const handleRetry = () => {
    navigate('/cloud-setup', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

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

        {/* Provider Icon and Title */}
        <div className="mb-4">
          <span className="text-3xl mb-2 block">{currentProvider.icon}</span>
          <h1 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {status === 'processing' && `Connecting to ${currentProvider.displayName}`}
            {status === 'success' && 'Connection Successful!'}
            {status === 'error' && 'Connection Issue'}
          </h1>
        </div>

        {/* Message */}
        <p className={`text-base mb-6 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {message}
        </p>

        {/* Error Actions */}
        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={handleContinueAnyway}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Continue Anyway (Force Success)
            </button>
            <button
              onClick={() => navigate('/cloud-setup', { replace: true })}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/', { replace: true })}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back Home
            </button>
          </div>
        )}

        {/* Success Actions */}
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
                Redirecting to CV builder...
              </span>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {status === 'processing' && (
          <div className={`w-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-full h-2 mb-4`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" 
                 style={{ width: '70%' }}>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudCallback;