// src/components/clouds/CloudCallback.jsx - Fixed to match backend flow
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import { ENV_INFO } from '../../config';

const CloudCallback = ({ darkMode }) => {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');

  const { onCloudConnected, backendAvailable, sessionToken, connectedProviders } =
    useSessionStore();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔍 CloudCallback processing...');

      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      console.log('🔍 Callback params:', { success, error, provider });

      if (error) {
        console.error('❌ OAuth error:', error, errorDescription);
        setStatus('error');
        setMessage(
          `Connection failed: ${error}${
            errorDescription ? ` - ${errorDescription}` : ''
          }`
        );
        return;
      }

      if (success === 'true') {
        try {
          setMessage('Completing connection...');
          const ok = await onCloudConnected(provider);

          if (ok) {
            console.log('✅ Connection verified successfully');
            setStatus('success');
            setMessage('Connection successful!');
            setTimeout(() => {
              navigate('/cloud/connected?provider=' + provider, {
                replace: true,
              });
            }, 1500);
          } else {
            console.error('❌ Connection verification failed');
            setStatus('error');
            setMessage(
              'Connection verification failed. The provider may not be properly connected.'
            );
          }
        } catch (e) {
          console.error('❌ Connection processing failed:', e);
          setStatus('error');
          setMessage('Failed to complete connection: ' + e.message);
        }
      } else {
        setStatus('error');
        setMessage('No success flag received from backend callback');
      }
    };

    handleCallback();
  }, [searchParams, navigate, provider, onCloudConnected]);

  const getProviderName = (provider) => {
    const names = {
      google_drive: 'Google Drive',
      onedrive: 'OneDrive',
      dropbox: 'Dropbox',
      box: 'Box',
    };
    return names[provider] || provider;
  };

  const handleRetry = () => navigate('/cloud-setup');
  const handleGoHome = () => navigate('/');

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode
          ? 'bg-gray-900'
          : 'bg-gradient-to-br from-blue-50 to-purple-50'
      }`}
    >
      <div
        className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border text-center`}
      >
        {/* Status Icon */}
        <div className="mb-6">
          {status === 'processing' && (
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              } mb-4`}
            >
              <Loader
                className={`w-8 h-8 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                } animate-spin`}
              />
            </div>
          )}
          {status === 'success' && (
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                darkMode ? 'bg-green-900/30' : 'bg-green-100'
              } mb-4`}
            >
              <CheckCircle
                className={`w-8 h-8 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}
              />
            </div>
          )}
          {status === 'error' && (
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                darkMode ? 'bg-red-900/30' : 'bg-red-100'
              } mb-4`}
            >
              <AlertCircle
                className={`w-8 h-8 ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {status === 'processing' &&
            `Connecting to ${getProviderName(provider)}...`}
          {status === 'success' && 'Connection Successful!'}
          {status === 'error' && 'Connection Failed'}
        </h1>

        {/* Message */}
        <p
          className={`text-base mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {message}
        </p>

        {/* Progress bar */}
        {status === 'processing' && (
          <div
            className={`w-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded-full h-2 mb-6`}
          >
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"
              style={{ width: '70%' }}
            ></div>
          </div>
        )}

        {/* Error Actions */}
        {status === 'error' && (
          <div className="space-y-3">
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

        {/* Success message */}
        {status === 'success' && (
          <p
            className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Redirecting you to get started...
          </p>
        )}

        {/* Development Debug Info */}
        {ENV_INFO.isDevelopment && (
          <div
            className={`mt-6 p-4 rounded-lg text-left ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <h3
              className={`text-sm font-semibold mb-2 ${
                darkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}
            >
              🔧 Debug Info
            </h3>
            <div
              className={`text-xs space-y-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <div>
                <strong>Provider:</strong> {provider}
              </div>
              <div>
                <strong>Backend Available:</strong>{' '}
                {backendAvailable ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Session Token:</strong>{' '}
                {sessionToken ? 'Present' : 'Missing'}
              </div>
              <div>
                <strong>Connected Providers:</strong>{' '}
                {connectedProviders.length}
              </div>
              <div>
                <strong>Status:</strong> {status}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudCallback;
