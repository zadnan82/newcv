// src/components/clouds/CloudCallback.jsx - Updated for development mode
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import { ENV_INFO } from '../../config';

const CloudCallback = ({ darkMode }) => {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState({});
  
  const { handleOAuthSuccess, checkCloudStatus, backendAvailable } = useSessionStore();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Set debug info for development
      if (ENV_INFO.isDevelopment) {
        setDebugInfo({
          provider,
          code: code ? `${code.substring(0, 10)}...` : null,
          state: state ? `${state.substring(0, 10)}...` : null,
          error,
          errorDescription,
          backendAvailable,
          searchParams: Object.fromEntries(searchParams.entries())
        });
      }

      if (error) {
        setStatus('error');
        setMessage(`Connection failed: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from provider');
        return;
      }

      try {
        setMessage('Completing connection...');
        
        if (backendAvailable) {
          // Real backend flow
          console.log(`🔗 Processing OAuth callback for ${provider} with backend`);
          
          // Send the authorization code to your backend
          const response = await fetch(`${ENV_INFO.apiBaseUrl}/api/cloud/callback/${provider}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              state,
              redirect_uri: `${window.location.origin}/cloud/connected`
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Backend callback failed: ${response.status}`);
          }

          const result = await response.json();
          console.log('✅ Backend callback successful:', result);
          
        } else {
          // Development simulation
          console.log(`🔧 Simulating OAuth callback for ${provider} (no backend)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Update session store
        const success = await handleOAuthSuccess(provider);
        
        if (success) {
          setStatus('success');
          setMessage('Successfully connected!');
          
          // Redirect to success page after a brief delay
          setTimeout(() => {
            navigate(`/cloud/connected?provider=${provider}`, { replace: true });
          }, 1500);
        } else {
          throw new Error('Failed to update session after OAuth success');
        }
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to complete connection');
      }
    };

    handleCallback();
  }, [provider, searchParams, handleOAuthSuccess, checkCloudStatus, navigate, backendAvailable]);

  const getProviderName = (provider) => {
    const names = {
      google_drive: 'Google Drive',
      onedrive: 'OneDrive',
      dropbox: 'Dropbox',
      box: 'Box'
    };
    return names[provider] || provider;
  };

  const handleRetry = () => {
    navigate('/cloud-setup');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border text-center`}>
        
        {/* Status Icon */}
        <div className="mb-6">
          {status === 'processing' && (
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} mb-4`}>
              <Loader className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} animate-spin`} />
            </div>
          )}
          
          {status === 'success' && (
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} mb-4`}>
              <CheckCircle className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          )}
          
          {status === 'error' && (
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} mb-4`}>
              <AlertCircle className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {status === 'processing' && `Connecting to ${getProviderName(provider)}...`}
          {status === 'success' && 'Connection Successful!'}
          {status === 'error' && 'Connection Failed'}
        </h1>

        {/* Message */}
        <p className={`text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {message}
        </p>

        {/* Progress bar for processing */}
        {status === 'processing' && (
          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-6`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
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
              className={`w-full px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Success message */}
        {status === 'success' && (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Redirecting you to get started...
          </p>
        )}

        {/* Development Debug Info */}
        {ENV_INFO.isDevelopment && Object.keys(debugInfo).length > 0 && (
          <div className={`mt-6 p-4 rounded-lg text-left ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              🔧 Debug Info (Development)
            </h3>
            <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div><strong>Provider:</strong> {debugInfo.provider}</div>
              <div><strong>Backend Available:</strong> {debugInfo.backendAvailable ? 'Yes' : 'No'}</div>
              <div><strong>Auth Code:</strong> {debugInfo.code || 'None'}</div>
              <div><strong>State:</strong> {debugInfo.state || 'None'}</div>
              {debugInfo.error && <div><strong>Error:</strong> {debugInfo.error}</div>}
              {debugInfo.errorDescription && <div><strong>Error Description:</strong> {debugInfo.errorDescription}</div>}
              
              {Object.keys(debugInfo.searchParams).length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Search Params</summary>
                  <pre className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {JSON.stringify(debugInfo.searchParams, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudCallback;