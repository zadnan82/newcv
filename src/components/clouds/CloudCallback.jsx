// src/components/clouds/CloudCallback.jsx - FIXED TO STOP INFINITE LOOPS
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
  
  // Create unique key for this OAuth attempt
  const urlKey = `${provider}-${searchParams.get('success')}-${searchParams.get('error') || 'none'}`;
  
  // State
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState(t('cloud.processing_connection'));
  const [processed, setProcessed] = useState(false);

  const { handleOAuthReturn } = useSessionStore();

  // Use useLayoutEffect to run before React renders
  useLayoutEffect(() => {
    // Prevent multiple processing
    if (processed) return;
    
    console.log('🔧 CloudCallback: Processing OAuth return...');
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

          // Wait for backend to process
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Try verification
          const verificationResult = await handleOAuthReturn('google_drive');

          if (verificationResult?.success) {
            setStatus('success');
            setMessage(t('cloud.connection_successful'));
            
            // Redirect after success
            setTimeout(() => {
              navigate('/new-resume', {
                replace: true,
                state: {
                  message: t('cloud.connected_save_to_cloud'),
                  provider: 'google_drive',
                  email: verificationResult.email
                }
              });
            }, 2000);
          } else {
            setStatus('error');
            setMessage(t('cloud.verification_failed'));
          }
        } catch (e) {
          setStatus('error');
          setMessage(`${t('cloud.verification_error')}: ${e.message}`);
        }
      } else {
        setStatus('error');
        setMessage(t('cloud.no_success_confirmation'));
      }
    };

    processCallback().catch(err => {
      setStatus('error');
      setMessage(`${t('cloud.processing_error')}: ${err.message}`);
    });

    // Cleanup function
    return () => {
      console.log('🔧 CloudCallback: Cleanup');
    };
  }, [processed, provider, searchParams, navigate, handleOAuthReturn, t]);

  const handleContinueAnyway = () => {
    // Force set provider as connected
    const store = useSessionStore.getState();
    if (store.connectedProviders && !store.connectedProviders.includes('google_drive')) {
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
      replace: true,
      state: {
        message: t('cloud.assuming_connected'),
        provider: 'google_drive',
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

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {status === 'processing' && t('cloud.connecting_title')}
          {status === 'success' && t('cloud.connection_successful_title')}
          {status === 'error' && t('cloud.connection_issue_title')}
        </h1>

        {/* Message */}
        <p className={`text-base mb-6 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {message}
        </p>

        {/* Success Message */}
        {status === 'success' && (
          <>
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
                  {t('cloud.data_stays_in_your_drive')}
                </span>
              </div>
            </div>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {t('cloud.redirecting_to_builder')}
            </p>
          </>
        )}

        {/* Error Actions */}
        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={handleContinueAnyway}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {t('cloud.continue_anyway')}
            </button>
            <button
              onClick={handleRetry}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('cloud.try_again')}
            </button>
            <button
              onClick={handleGoHome}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('common.back')} {t('navigation.home')}
            </button>
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
      </div>
    </div>
  );
};

export default CloudCallback;