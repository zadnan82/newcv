import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import { AUTH_ENDPOINTS } from '../../config';

const GoogleLoginButton = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Make sure to access the store correctly
  const googleLogin = useAuthStore(state => state.googleLogin);
  
  const handleGoogleLogin = async (tokenResponse) => {
    console.log("Google login success, token response:", tokenResponse);
    setLoading(true);
    setError(null);
    
    try {
      // Instead of trying to use setToken directly, use the googleLogin function
      const result = await googleLogin(tokenResponse);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const login = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse);
      setError('Google login failed');
    },
    flow: 'implicit'
  });
  
  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 p-2 bg-red-100/90 text-red-700 rounded-lg text-xs">
          {error}
        </div>
      )}
      
      <button
        type="button"
        onClick={() => login()}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 rounded-md border ${
          darkMode 
            ? 'border-gray-600 bg-gray-700/50 text-white' 
            : 'border-gray-300 bg-white text-gray-700'
        } p-2 text-sm font-medium transition-all hover:bg-gray-100/80 disabled:opacity-50`}
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        {loading 
          ? t('auth.login.loading', 'Loading...') 
          : t('auth.social.or_continue_with' , 'Or continue with ')  + t('auth.social.google', 'Google')} 
      </button>
    </div>
  );
};

export default GoogleLoginButton;