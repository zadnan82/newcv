// src/components/cloud/CloudCallback.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';

const CloudCallback = ({ darkMode }) => {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Connecting to your cloud storage...');
  const [error, setError] = useState(null);

  const { handleOAuthSuccess, checkCloudStatus } = useSessionStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Check for OAuth errors
        if (error) {
          throw new Error(errorDescription || `OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        setMessage(`Completing ${provider} connection...`);

        // The OAuth callback is handled by the backend automatically
        // We just need to check if the connection was successful
        await new Promise(resolve => setTimeout(resolve, 2000)); // Give backend time to process

        // Check if the provider is now connected
        await checkCloudStatus();
        
        // Check if this provider is now in connected providers
        const sessionStore = useSessionStore.getState();
        if (sessionStore.connectedProviders.includes(provider)) {
          await handleOAuthSuccess(provider);
          setStatus('success');
          setMessage(`Successfully connected to ${provider}!`);
          
          // Redirect after success
          setTimeout(() => {
            navigate('/my-resumes', { replace: true });
          }, 2000);
        } else {
          throw new Error('Connection was not established successfully');
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setError(err.message);
        setMessage('Connection failed');
      }
    };

    handleCallback();
  }, [provider, searchParams, navigate, handleOAuthSuccess, checkCloudStatus]);

  const getProviderDisplayName = (providerId) => {
    const names = {
      'google_drive': 'Google Drive',
      'onedrive': 'Microsoft OneDrive',
      'dropbox': 'Dropbox',
      'box': 'Box'
    };
    return names[providerId] || providerId;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-16 h-16 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-8 text-center ${
          darkMode ? 'bg-gray-700' : getStatusColor()
        }`}>
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          
          <h1 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {status === 'processing' && 'Connecting...'}
            {status === 'success' && 'Connected!'}
            {status === 'error' && 'Connection Failed'}
          </h1>
          
          <p className={`text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {getProviderDisplayName(provider)}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className={`p-4 rounded-lg ${
            darkMode 
              ? 'bg-gray-700 border border-gray-600' 
              : status === 'error' 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={`text-center ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {message}
            </p>
            
            {error && (
              <div className={`mt-4 p-3 rounded-lg ${
                darkMode ? 'bg-red-900/50 border border-red-700' : 'bg-red-100 border border-red-300'
              }`}>
                <p className={`text-sm ${
                  darkMode ? 'text-red-300' : 'text-red-700'
                }`}>
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </div>

          {/* Progress indicator for processing state */}
          {status === 'processing' && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Establishing connection...</span>
                <span>Please wait</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out w-3/4"></div>
              </div>
            </div>
          )}

          {/* Success actions */}
          {status === 'success' && (
            <div className="mt-6 space-y-4">
              <div className={`text-center text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>✓ Your {getProviderDisplayName(provider)} account is now connected</p>
                <p>✓ Your CV data will be stored securely in your cloud</p>
                <p className="mt-2">Redirecting to your dashboard...</p>
              </div>
            </div>
          )}

          {/* Error actions */}
          {status === 'error' && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/cloud-setup')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  Go Home
                </button>
              </div>

              <div className={`text-center text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>Common issues:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Check if you granted all necessary permissions</li>
                  <li>• Ensure your {getProviderDisplayName(provider)} account is accessible</li>
                  <li>• Try connecting with a different browser if issues persist</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className={`px-6 py-4 border-t text-center ${
          darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <p className={`text-xs ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            This connection is secure and encrypted. You can revoke access at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CloudCallback;