// src/components/auth/OAuthCallback.jsx - Updated for cloud providers
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';

const OAuthCallback = ({ darkMode }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState('Processing cloud connection...');
  const [error, setError] = useState(null);
  const { refreshSession } = useAuthStore();
  
  useEffect(() => {
    const processCloudConnection = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');
      const provider = searchParams.get('provider');
      
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setStatus('Connection failed');
        return;
      }
      
      if (!code || !state) {
        setError('Missing authorization parameters');
        setStatus('Connection failed');
        return;
      }
      
      try {
        setStatus('Connecting to your cloud storage...');
        
        // The backend handles the OAuth callback automatically
        // We just need to refresh our session to get the updated status
        await refreshSession();
        
        setStatus('Cloud storage connected successfully!');
        
        // Redirect to the resume builder
        setTimeout(() => navigate('/resume/new'), 1000);
        
      } catch (err) {
        console.error('Cloud connection error:', err);
        setError(err.message || 'Connection failed');
        setStatus('Connection failed');
      }
    };
    
    processCloudConnection();
  }, [searchParams, navigate, refreshSession]);
  
  return (
    <div className={`flex min-h-screen items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      <div className="relative z-10 w-full max-w-sm mx-auto px-4">
        <div className={`rounded-xl p-6 shadow-xl backdrop-blur-sm border border-white/10 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        }`}>
          <h1 className={`text-xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Cloud Storage
          </h1>
          
          {!error ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
              </div>
              <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {status}
              </p>
            </>
          ) : (
            <>
              <div className="mb-4 p-3 bg-red-100/90 text-red-700 rounded-md">
                {error}
              </div>
              <p className={`text-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please try connecting again.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-2 text-sm text-white font-medium shadow-lg transition-all duration-300 hover:shadow-md"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;