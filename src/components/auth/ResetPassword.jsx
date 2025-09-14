import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AUTH_ENDPOINTS } from '../../config';

const ResetPassword = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(true);
  
  useEffect(() => {
    // Get token from URL query parameters
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    
    if (!resetToken) {
      setValidToken(false);
      setError(t('auth.reset_password.invalid_link', 'Invalid password reset link.'));
    } else {
      setToken(resetToken);
    }
  }, [location, t]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (newPassword !== confirmPassword) {
      setError(t('auth.reset_password.passwords_not_match', 'Passwords do not match.'));
      return;
    }
    
    if (newPassword.length < 8) {
      setError(t('auth.reset_password.password_too_short', 'Password must be at least 8 characters long.'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(AUTH_ENDPOINTS.CONFIRM_PASSWORD_RESET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
          confirm_password: confirmPassword
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to reset password.');
      }
      
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || t('auth.reset_password.generic_error', 'An error occurred. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRequestNewLink = () => {
    navigate('/login');
    // We'll add the logic to show the reset form on the login page
    // In a real implementation, we'd share some state between components or use URL parameters
  };
   
  if (!validToken) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
        <div className={`w-96 rounded p-6 shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className={`text-2xl font-bold text-center mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('auth.reset_password.invalid_link_title', 'Invalid Link')}
          </h1>
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
          <button
            onClick={handleRequestNewLink}
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            {t('auth.reset_password.request_new_link', 'Back to Login')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className={`w-96 rounded p-6 shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-2xl font-bold text-center mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('auth.reset_password.new_password_title', 'Set New Password')}
        </h1>
        
        {success ? (
          <div className="p-3 text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {t('auth.reset_password.success', 'Your password has been successfully reset.')}
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('auth.reset_password.redirecting', 'Redirecting to login page...')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-3 rounded bg-red-100 p-2 text-red-700">{error}</div>}
            
            <div className="mb-3">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('auth.reset_password.new_password', 'New Password')}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full rounded border p-2 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
                required
                minLength={8}
              />
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('auth.reset_password.password_requirements', 'Password must be at least 8 characters long and include uppercase, lowercase, and numeric characters.')}
              </p>
            </div>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('auth.reset_password.confirm_password', 'Confirm Password')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded border p-2 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting 
                ? t('auth.reset_password.resetting', 'Resetting...') 
                : t('auth.reset_password.reset_button', 'Reset Password')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;