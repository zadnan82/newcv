// src/components/auth/Login.jsx - Privacy-First Version
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import CloudProviderButton from './CloudProviderButton';

const Login = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createSession, connectCloudProvider, sessionToken } = useAuthStore();

  // Create anonymous session on mount
  useEffect(() => {
    if (!sessionToken) {
      createSession();
    }
  }, [sessionToken, createSession]);

  const handleCloudConnect = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      await connectCloudProvider(provider);
      // The OAuth flow will redirect, so we don't need to navigate here
    } catch (err) {
      setError(err.message || 'Failed to connect to cloud provider');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 right-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className={`rounded-xl p-6 shadow-xl backdrop-blur-sm border border-white/10 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        }`}>
          <h1 className={`text-2xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Connect Your Storage
          </h1>
          <p className={`text-sm text-center mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your CV data will be stored in your own cloud storage. We never store your personal information.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100/90 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <CloudProviderButton
              provider="google_drive"
              name="Google Drive"
              icon="🔷"
              onClick={() => handleCloudConnect('google_drive')}
              loading={loading}
              darkMode={darkMode}
            />
            
            <CloudProviderButton
              provider="onedrive"
              name="Microsoft OneDrive"
              icon="🔵"
              onClick={() => handleCloudConnect('onedrive')}
              loading={loading}
              darkMode={darkMode}
            />
            
            <CloudProviderButton
              provider="dropbox"
              name="Dropbox"
              icon="🔹"
              onClick={() => handleCloudConnect('dropbox')}
              loading={loading}
              darkMode={darkMode}
            />
          </div>

          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50/80'}`}>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Why is this better?
            </h3>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Your data stays in YOUR cloud storage</li>
              <li>• We never see or store your personal information</li>
              <li>• You maintain full control and ownership</li>
              <li>• GDPR compliant by design</li>
            </ul>
          </div>

          <p className={`text-center text-xs mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No account required. Anonymous and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;