import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AUTH_ENDPOINTS } from '../../config';
import useAuthStore from '../../stores/authStore';
import GoogleLoginButton from './GoogleLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';
 
const GOOGLE_CLIENT_ID = "305787561199-gtd4k1sk83tt8fa7hv0jvpuaih8n1919.apps.googleusercontent.com";
const Login = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  
  // Check for error message passed from other components
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      // Clear the error from location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authStore = useAuthStore.getState();
      
      const result = await authStore.login({
        email,
        password
      });

      if (result.success) {
        setEmail('');
        setPassword('');
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const handleForgotPassword = () => {
    setShowResetForm(true);
  };
 
  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetEmailSent(false);

    try {
      const response = await fetch(AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to request password reset');
      }

      // Even if the email doesn't exist, the API returns success for security reasons
      setResetEmailSent(true);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset request error:', error);
      setResetError(error.message || 'An error occurred');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={`flex min-h-screen items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 right-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto px-4">
          <div className={`rounded-xl p-4 shadow-xl backdrop-blur-sm border border-white/10 ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}>
            {!showResetForm ? (
              // Login Form
              <>
                <h1 className={`text-xl font-bold text-center mb-0.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('auth.login.welcome_back')}
                </h1>
                <p className={`text-xs text-center mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('auth.login.sign_in_to_continue')}
                </p>
                
                {error && (
                  <div className="mb-3 p-2 bg-red-100/90 text-red-700 rounded-lg text-xs">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {t('auth.login.email')} 
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-md border p-2 text-sm ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                          : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                      }`}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {t('auth.login.password')}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-md border p-2 text-sm ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                          : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                      }`}
                      required
                    />
                    <div className="text-right mt-0.5">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'} hover:underline`}
                      >
                        {t('auth.login.forgotPassword', 'Forgot password?')}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-2 text-sm text-white font-medium shadow-lg transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102 disabled:opacity-50 disabled:hover:scale-100 mb-3"
                  >
                    {loading ? t('auth.login.loading') : t('auth.login.submit')}
                  </button>
                  
                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className={`flex-grow border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                    <span className={`mx-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('revamp.or', 'or')}
                    </span>
                    <div className={`flex-grow border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                  </div>
                  
                  {/* Google Login Button */}
                  <GoogleLoginButton darkMode={darkMode} />
                </form>
                
                <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('auth.login.noAccount')}{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className={`font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'} hover:underline`}
                  >
                    {t('auth.login.register')}
                  </button>
                </p>
              </>
            ) : (
              // Password Reset Form
              <>
                <h1 className={`text-xl font-bold text-center mb-0.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('auth.reset_password.title', 'Reset Password')}
                </h1>
                <p className={`text-xs text-center mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('auth.reset_password.instructions', 'Enter your email to receive a password reset link')}
                </p>
                
                {resetEmailSent ? (
                  <div className="mb-3 p-2 bg-green-100/90 text-green-700 rounded-md text-xs">
                    {t('auth.reset_password.email_sent', 'If your email is registered, you will receive a password reset link shortly.')}
                  </div>
                ) : (
                  <>
                    {resetError && (
                      <div className="mb-3 p-2 bg-red-100/90 text-red-700 rounded-md text-xs">
                        {resetError}
                      </div>
                    )}
                    
                    <form onSubmit={handlePasswordResetRequest}>
                      <div className="mb-3">
                        <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {t('auth.login.email')}
                        </label>
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className={`w-full rounded-md border p-2 text-sm ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                              : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                          }`}
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="w-full rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-2 text-sm text-white font-medium shadow-lg transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {resetLoading ? t('auth.reset_password.sending', 'Sending...') : t('auth.reset_password.send_link', 'Send Reset Link')}
                      </button>
                    </form>
                  </>
                )}
                
                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      setShowResetForm(false);
                      setResetEmail('');
                      setResetError('');
                      setResetEmailSent(false);
                    }}
                    className={`text-xs font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'} hover:underline`}
                  >
                    {t('auth.reset_password.back_to_login', 'Back to Login')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;