import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API_BASE_URL, { AUTH_ENDPOINTS } from '../../config';

const Register = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if terms are accepted
    if (!termsAccepted) {
      setError(t('auth.register.terms_required', 'You must accept the Terms and Conditions to register'));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors
        if (res.status === 422) {
          const errorDetail = data.detail;
          if (Array.isArray(errorDetail)) {
            // Format validation errors
            const errors = errorDetail.map(err => `${err.loc[1]}: ${err.msg}`).join(', ');
            throw new Error(`Validation error: ${errors}`);
          }
        }
        throw new Error(data.detail || 'Registration failed');
      }

      // Navigate to login page on success
      navigate('/login');
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      {/* Background Elements - decorative elements similar to cards but more subtle */}
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
          <h1 className={`text-xl font-bold text-center mb-0.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('auth.register.create_account')}
          </h1>
          <p className={`text-xs text-center mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('auth.register.sign_up_to_start')}
          </p>
          
          {error && (
            <div className="mb-3 p-2 bg-red-100/90 text-red-700 rounded-md text-xs">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('auth.register.first_name')}
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className={`w-full rounded-md border p-2 text-sm ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                    : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('auth.register.last_name')}
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className={`w-full rounded-md border p-2 text-sm ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                    : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('auth.register.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full rounded-md border p-2 text-sm ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                    : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('auth.register.password')}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`w-full rounded-md border p-2 text-sm ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                    : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                }`}
                required
                minLength={8}
              />
            </div>
            
            {/* Terms and Conditions Checkbox */}
            <div className="mt-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-3.5 h-3.5 text-purple-600 bg-transparent border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
                <div className="ml-2 text-xs">
                  <label 
                    htmlFor="terms" 
                    className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('revamp.accept', 'I accept the')}
                    {' '}
                    <Link 
                      to="/terms" 
                      className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} hover:underline`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('legal.terms.title', 'Terms and Conditions')}
                    </Link>
                  </label>
                  {!termsAccepted && error && error.includes('Terms') && (
                    <p className="text-red-500 text-[0.65rem] mt-0.5">
                      {t('auth.register.terms_required', 'You must accept the Terms and Conditions to register')}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-2 text-sm text-white font-medium shadow-lg transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102 disabled:opacity-50 disabled:hover:scale-100 mt-3"
            >
              {loading ? t('auth.register.creating_account') : t('auth.register.sign_up')}
            </button>
          </form>
          
          <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('auth.register.haveAccount')}{' '}
            <button
              onClick={() => navigate('/login')}
              className={`font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'} hover:underline`}
            >
              {t('auth.register.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;