// src/components/clouds/SimpleCloudConnect.jsx - Updated with Dropbox support
import React, { useState } from 'react';
import { Cloud, CheckCircle, Loader2, Shield } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import cloudProviderService from '../../services/cloudProviderService';
import { useTranslation } from 'react-i18next';

const SimpleCloudConnect = ({ darkMode, selectedProvider = 'google_drive' }) => {
  const [connecting, setConnecting] = useState(false);
  const { t } = useTranslation();
  
  const { 
    connectedProviders, 
    connectToCloudProvider, 
    loading, 
    error,
    clearError,
    // Legacy Google Drive support
    googleDriveConnected
  } = useSessionStore();

  // Provider configurations
  const providerConfigs = {
    'google_drive': {
      name: 'Google Drive',
      icon: '📄',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-600',
      description: t('cloud.save_cvs_securely_google'),
      connectedText: t('cloud.google_drive_connected'),
      connectText: t('cloud.connect_google_drive'),
      privacyText: t('cloud.never_access_files'),
    },
    'onedrive': {
      name: 'OneDrive',
      icon: '☁️',
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-600',
      description: t('cloud.save_cvs_securely_onedrive', 'Save your CVs securely to OneDrive'),
      connectedText: t('cloud.onedrive_connected', 'OneDrive Connected'),
      connectText: t('cloud.connect_onedrive', 'Connect OneDrive'),
      privacyText: t('cloud.never_access_files'),
    },
    'dropbox': {
      name: 'Dropbox',
      icon: '📦',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-600',
      description: t('cloud.save_cvs_securely_dropbox', 'Save your CVs securely to Dropbox'),
      connectedText: t('cloud.dropbox_connected', 'Dropbox Connected'),
      connectText: t('cloud.connect_dropbox', 'Connect Dropbox'),
      privacyText: t('cloud.never_access_files'),
    }
  };

  const config = providerConfigs[selectedProvider] || providerConfigs['google_drive'];

  const handleConnect = async () => {
    setConnecting(true);
    clearError();
    
    try {
      console.log(`🔗 User clicked connect to ${config.name}`);
      
      // Always use the cloudProviderService
      const sessionStore = useSessionStore.getState();
      if (sessionStore.sessionToken) {
        cloudProviderService.setSessionToken(sessionStore.sessionToken);
      }
      
      await cloudProviderService.connectToProvider(selectedProvider);
      
      // If successful, this will redirect to OAuth, so we won't reach here
    } catch (error) {
      console.error('❌ Connection failed:', error);
      setConnecting(false);
    }
  };

  // Check if the selected provider is connected
  const isConnected = selectedProvider === 'google_drive' 
    ? googleDriveConnected || connectedProviders.includes('google_drive')
    : connectedProviders.includes(selectedProvider);

  // If already connected, show success state
  if (isConnected) {
    return (
      <div className={`max-w-md w-full p-6 rounded-xl border-2 ${
        darkMode 
          ? `border-green-500 bg-gray-800` 
          : `border-green-300 ${config.bgColor}`
      }`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
            darkMode ? 'bg-green-900/30' : 'bg-green-100'
          }`}>
            <CheckCircle className={`w-6 h-6 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
          </div>
          
          <div className="mb-4">
            <span className="text-2xl mr-2">{config.icon}</span>
            <span className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {config.connectedText}
            </span>
          </div>
          
          <p className={`text-sm mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('cloud.can_save_cvs_to_provider', { provider: config.name })}
          </p>
          
          <div className={`p-3 rounded-lg ${
            darkMode ? 'bg-green-900/20' : 'bg-green-100'
          }`}>
            <div className="flex items-center justify-center">
              <Shield className={`w-4 h-4 mr-2 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <span className={`text-xs ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                {t('cloud.data_stays_in_your_provider', { provider: config.name })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show connection button
  return (
    <div className={`max-w-md w-full p-6 rounded-xl border-2 border-dashed transition-all duration-200 ${
      darkMode 
        ? `${config.borderColor.replace('300', '600')} bg-gray-800 hover:${config.borderColor.replace('300', '500')}` 
        : `${config.borderColor} bg-white hover:${config.borderColor.replace('300', '500')} hover:shadow-md`
    }`}>
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
          darkMode 
            ? `bg-${getProviderColorClass(selectedProvider)}-900/30` 
            : config.bgColor
        }`}>
          <span className="text-2xl">{config.icon}</span>
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {config.connectText}
        </h3>
        
        <p className={`text-sm mb-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {config.description}
        </p>
        
        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            darkMode ? 'bg-red-900/20 text-red-300 border border-red-700' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {error}
          </div>
        )}
        
        <button
          onClick={handleConnect}
          disabled={connecting || loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            connecting || loading
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : `bg-gradient-to-r ${config.color} text-white hover:shadow-lg hover:scale-105`
          }`}
        >
          {connecting || loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
              {t('cloud.connecting')}...
            </>
          ) : (
            <>
              {config.icon} {config.connectText}
            </>
          )}
        </button>
        
        <div className={`mt-4 p-3 rounded-lg ${
          darkMode 
            ? 'bg-green-900/20 border border-green-700' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-start">
            <Shield className={`w-4 h-4 mt-0.5 mr-2 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <div className="text-left">
              <p className={`text-xs font-medium mb-1 ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                {t('cloud.privacy_protected')}
              </p>
              <p className={`text-xs ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {config.privacyText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get provider color class
const getProviderColorClass = (provider) => {
  switch (provider) {
    case 'onedrive':
      return 'purple';
    case 'dropbox':
      return 'blue';
    case 'google_drive':
    default:
      return 'blue';
  }
};

export default SimpleCloudConnect;