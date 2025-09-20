// src/components/clouds/CloudConnected.jsx
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CloudConnected = ({ darkMode }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const provider = searchParams.get('provider');

  const getProviderName = (provider) => {
    const names = {
      google_drive: t('cloud.google_drive'),
      onedrive: t('cloud.onedrive'),
      dropbox: t('cloud.dropbox'),
      box: 'Box'
    };
    return names[provider] || provider;
  };

  const handleContinue = () => {
    navigate('/new-resume'); // Navigate to your new-resume page
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border text-center`}>
        
        {/* Success Icon */}
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} mb-4`}>
            <CheckCircle className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('cloud.connection_successful_title')}
        </h1>

        {/* Message */}
        <p className={`text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('cloud.provider_connected', { provider: getProviderName(provider) })}
        </p>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('cloud.continue_to_create')}
        </button>

        <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {t('cloud.can_now_save_access')}
        </p>
      </div>
    </div>
  );
};

export default CloudConnected;