// src/components/clouds/CloudSetup.jsx - Updated with Dropbox support
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

  const providers = [
    {
      id: 'google_drive',
      name: 'Google Drive',
      icon: '📄',
      description: t('cloud3.save_cvs_securely_google', 'Store your CVs in Google Drive'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      status: 'fully_supported',
      benefits: [
        t('cloud3.15gb_free_storage', '15GB free storage'),
        t('cloud3.automatic_sync', 'Automatic sync across devices'),
        t('cloud3.google_ecosystem', 'Integrates with Google ecosystem')
      ]
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '☁️',
      description: t('cloud3.save_cvs_securely_onedrive', 'Store your CVs in Microsoft OneDrive'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      status: 'fully_supported',
      benefits: [
        t('cloud3.5gb_free_storage', '5GB free storage'),
        t('cloud3.office_integration', 'Office 365 integration'),
        t('cloud3.microsoft_ecosystem', 'Works with Microsoft ecosystem')
      ]
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '📦',
      description: t('cloud.dropbox_description', 'Store your CVs in Dropbox'),
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      status: 'available',
      benefits: [
        t('cloud.2gb_free_storage', '2GB free storage'),
        t('cloud.reliable_sync', 'Reliable file synchronization'),
        t('cloud.cross_platform', 'Works on all platforms')
      ]
    }
  ];

  const selectedProviderData = providers.find(p => p.id === selectedProvider);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'fully_supported':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('cloud.fully_supported', 'Fully Supported')}
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Cloud className="w-3 h-3 mr-1" />
            {t('cloud.available', 'Available')}
          </span>
        );
      case 'coming_soon':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {t('cloud.coming_soon', 'Coming Soon')}
          </span>
        );
      default:
        return null;
    }
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

        {/* Provider Selection */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('cloud3.choose_provider', 'Choose Your Cloud Provider')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedProvider === provider.id
                    ? `border-transparent bg-gradient-to-r ${provider.color} text-white shadow-lg`
                    : darkMode
                      ? 'border-gray-600 bg-gray-800 hover:border-gray-500 text-gray-300'
                      : `border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:${provider.bgColor}`
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                    </div>
                  </div>
                  {!selectedProvider || selectedProvider !== provider.id ? (
                    <div className="text-right">
                      {getStatusBadge(provider.status)}
                    </div>
                  ) : null}
                </div>
                
                <p className={`text-sm mb-3 ${
                  selectedProvider === provider.id 
                    ? 'text-white/80' 
                    : darkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}>
                  {provider.description}
                </p>

                {selectedProvider === provider.id && (
                  <div className="space-y-1">
                    {provider.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-white/80" />
                        <span className="text-white/90">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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
              {t('cloud3.save_to', { provider: selectedProviderData?.name || 'Cloud Storage' })}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-4 ${
                  darkMode ? 'bg-blue-900/30' : selectedProviderData?.bgColor || 'bg-blue-100'
                }`}>
                  <Cloud className={`w-5 h-5 ${
                    darkMode ? 'text-blue-400' : selectedProviderData?.textColor || 'text-blue-600'
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
                    {t('cloud.data_stays_in_your_provider', { provider: selectedProviderData?.name })}
                  </p>
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${
              darkMode 
                ? `bg-${selectedProvider === 'onedrive' ? 'purple' : 'blue'}-900/20 border border-${selectedProvider === 'onedrive' ? 'purple' : 'blue'}-700` 
                : `${selectedProviderData?.bgColor} border border-${selectedProvider === 'onedrive' ? 'purple' : 'blue'}-200`
            }`}>
              <div className="flex items-start">
                <CheckCircle className={`w-5 h-5 mt-0.5 mr-3 ${
                  darkMode 
                    ? `text-${selectedProvider === 'onedrive' ? 'purple' : 'blue'}-400` 
                    : selectedProviderData?.textColor
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    darkMode 
                      ? `text-${selectedProvider === 'onedrive' ? 'purple' : 'blue'}-300` 
                      : selectedProviderData?.textColor
                  }`}>
                    {t('cloud.why_provider', { provider: selectedProviderData?.name })}
                  </p>
                  <p className={`text-sm mt-1 ${
                    darkMode 
                      ? `text-${selectedProvider === 'onedrive' ? 'purple' : 'blue'}-400` 
                      : selectedProviderData?.textColor?.replace('700', '600')
                  }`}>
                    {selectedProvider === 'onedrive' 
                      ? t('cloud3.onedrive_benefits', 'Reliable Microsoft cloud storage with Office integration')
                      : selectedProvider === 'dropbox'
                      ? t('cloud.dropbox_benefits', 'Trusted cloud storage with excellent reliability and sync')
                      : t('cloud.google_drive_benefits', 'Reliable cloud storage with excellent integration')
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Connection */}
          <div>
            <SimpleCloudConnect darkMode={darkMode} selectedProvider={selectedProvider} />
            
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