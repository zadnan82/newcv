import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import
import useAuthStore from '../../stores/authStore';

const SocialCallback = ({ darkMode }) => { // Add darkMode prop
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState(t('auth.oauth.processing', 'Processing authentication...'));
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const processAuth = async () => {
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');
      
      // Add console logs for debugging
      console.log('OAuth callback received:', {
        token: token ? 'token-present' : 'no-token',
        error: errorParam
      });
      
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setStatus(t('auth.oauth.failed', 'Authentication failed'));
        return;
      }
      
      if (!token) {
        setError(t('auth.oauth.no_token', 'No authentication token received'));
        setStatus(t('auth.oauth.failed', 'Authentication failed'));
        return;
      }
      
      try {
        setStatus(t('auth.oauth.fetching_user', 'Fetching user details...'));
        
        // Use the store's methods directly to maintain consistency
        const authStore = useAuthStore.getState();
        
        // Set token first
        authStore.setTokenDirectly(token);
        
        // Fetch user info (using the auth store pattern you already have)
        const userData = await authStore.refreshUserInfo();
        
        if (!userData) {
          throw new Error(t('auth.oauth.user_fetch_failed', 'Failed to fetch user details'));
        }
        
        setStatus(t('auth.oauth.success', 'Authentication successful!'));
        
        // Dispatch auth change event (already done in refreshUserInfo, but just in case)
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect to dashboard/homepage after a short delay
        setTimeout(() => navigate('/'), 1000);
      } catch (err) {
        console.error('OAuth authentication error:', err);
        setError(err.message || t('auth.oauth.unknown_error', 'An unknown error occurred'));
        setStatus(t('auth.oauth.failed', 'Authentication failed'));
      }
    };
    
    processAuth();
  }, [searchParams, navigate, t]);
  
  // Add setTokenDirectly method to auth store if it doesn't exist yet
  useEffect(() => {
    if (!useAuthStore.getState().setTokenDirectly) {
      useAuthStore.setState({
        setTokenDirectly: (token) => {
          useAuthStore.setState({ token, loading: false, error: null });
        }
      });
    }
  }, []);
  
  return (
    <div className={`flex min-h-screen items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 right-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-sm mx-auto px-4">
        <div className={`rounded-xl p-6 shadow-xl backdrop-blur-sm border border-white/10 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        }`}>
          <h1 className={`text-xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('auth.oauth.title', 'Authentication')}
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
                {t('auth.oauth.try_again', 'Please try again or use another login method.')}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-2 text-sm text-white font-medium shadow-lg transition-all duration-300 hover:shadow-md"
              >
                {t('auth.oauth.back_to_login', 'Back to Login')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialCallback;