// src/components/clouds/CloudSetup.jsx - Google Drive focused
import React, { useState } from 'react';
import { ArrowLeft, Shield, HardDrive, Cloud, CheckCircle } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import SimpleCloudConnect from './SimpleCloudConnect';
import { useTranslation } from 'react-i18next';

const CloudSetup = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useState('google_drive');

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} py-12 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className={`mr-4 p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('cloud.cloud_storage_setup')}
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Information */}
          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t('cloud.save_to_google_drive')}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-4 ${
                  darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}>
                  <Cloud className={`w-5 h-5 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className={`font-medium mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {t('cloud.automatic_backup_enabled')}
                  </h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('cloud.cvs_automatically_saved')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-4 ${
                  darkMode ? 'bg-green-900/30' : 'bg-green-100'
                }`}>
                  <HardDrive className={`w-5 h-5 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <h3 className={`font-medium mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {t('cloud.access_anywhere')}
                  </h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('cloud.access_cvs_any_device')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-4 ${
                  darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <Shield className={`w-5 h-5 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <h3 className={`font-medium mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {t('cloud.privacy_first')}
                  </h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('cloud.data_stays_in_your_drive')}
                  </p>
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${
              darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-start">
                <CheckCircle className={`w-5 h-5 mt-0.5 mr-3 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    darkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    {t('cloud.why_google_drive')}
                  </p>
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {t('cloud.google_drive_benefits')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Connection */}
          <div>
            <SimpleCloudConnect darkMode={darkMode} />
            
            {/* Local Storage Info */}
            <div className={`mt-6 p-6 rounded-xl ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {t('cloud.local_storage_always_available')}
              </h3>
              <p className={`text-sm mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('cloud.can_save_locally')}
              </p>
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('cloud.local_works_offline')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudSetup;