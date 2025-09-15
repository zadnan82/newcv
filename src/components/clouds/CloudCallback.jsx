// src/components/clouds/CloudCallback.jsx - Updated version
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';

const CloudCallback = ({ darkMode }) => {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  
  const { handleOAuthSuccess, checkCloudStatus } = useSessionStore();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Connection failed: ${error}`);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Invalid callback parameters');
        return;
      }

      try {
        setMessage('Completing connection...');
        
        // In a real implementation, this would call your backend
        // For now, simulate the process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update session store
        await handleOAuthSuccess(provider);
        await checkCloudStatus();
        
        setStatus('success');
        setMessage('Successfully connected!');
        
        // Redirect to success page after a brief delay
        setTimeout(() => {
          navigate(`/cloud/connected?provider=${provider}`, { replace: true });
        }, 1500);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Failed to complete connection');
      }
    };

    handleCallback();
  }, [provider, searchParams, handleOAuthSuccess, checkCloudStatus, navigate]);

  const getProviderName = (provider) => {
    const names = {
      google_drive: 'Google Drive',
      onedrive: 'OneDrive',
      dropbox: 'Dropbox',
      box: 'Box'
    };
    return names[provider] || provider;
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
              onClick={() => navigate('/cloud-setup')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
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
      </div>
    </div>
  );
};

export default CloudCallback;