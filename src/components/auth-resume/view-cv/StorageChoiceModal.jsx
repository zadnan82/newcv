// src/components/auth-resume/view-cv/StorageChoiceModal.jsx - Enhanced Multi-Provider Version
import React, { useState } from 'react';
import { X, HardDrive, Cloud, CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useSessionStore from '../../../stores/sessionStore';

const StorageChoiceModal = ({ 
  isOpen, 
  onClose, 
  onSaveLocal, 
  onSaveCloud, 
  onConnectCloud, 
  canSaveToCloud, 
  darkMode, 
  isSaving, 
  saveType 
}) => {
  const { t } = useTranslation();
  const { connectedProviders, getConnectedProviderDetails } = useSessionStore();
  const [selectedProvider, setSelectedProvider] = useState(null);

  if (!isOpen) return null;

  const connectedDetails = getConnectedProviderDetails();
  
  // Get provider display info
  const getProviderInfo = (provider) => {
    switch (provider) {
      case 'google_drive':
        return {
          name: 'Google Drive',
          icon: '📄',
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          description: 'Save to Google Drive (15GB free)'
        };
      case 'onedrive':
        return {
          name: 'OneDrive',
          icon: '☁️',
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          description: 'Save to Microsoft OneDrive (5GB free)'
        };
      default:
        return {
          name: provider,
          icon: '📦',
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          description: `Save to ${provider}`
        };
    }
  };

  const handleCloudSave = (provider) => {
    setSelectedProvider(provider);
    onSaveCloud(provider);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-lg w-full rounded-2xl ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      } shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('cloud3.choose_save_location')}
          </h3>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Options */}
        <div className="space-y-4">
          
          {/* Local Storage Option */}
          <div className={`border-2 rounded-xl p-4 transition-all ${
            darkMode 
              ? 'border-gray-600 bg-gray-700/50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}>
                  <HardDrive className={`w-6 h-6 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('cloud.this_device')}
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('cloud3.save_locally_description')}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onSaveLocal}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                  isSaving && saveType === 'local'
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
                }`}
              >
                {isSaving && saveType === 'local' ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {t('common.saving')}
                  </>
                ) : (
                  <>
                    <HardDrive size={16} className="mr-2" />
                    {t('cloud.save_locally')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cloud Storage Options */}
          {connectedDetails.length > 0 ? (
            <div className="space-y-3">
              <h4 className={`font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('cloud3.connected_providers')}
              </h4>
              
              {connectedDetails.map(({ provider, name, status }) => {
                const providerInfo = getProviderInfo(provider);
                const isCurrentlySaving = isSaving && saveType === 'cloud' && selectedProvider === provider;
                
                return (
                  <div key={provider} className={`border-2 rounded-xl p-4 transition-all ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700/50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${
                          darkMode 
                            ? provider === 'onedrive' ? 'bg-purple-900/30' : 'bg-blue-900/30'
                            : provider === 'onedrive' ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          <span className="text-2xl">{providerInfo.icon}</span>
                        </div>
                        <div>
                          <h4 className={`font-semibold flex items-center ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {providerInfo.name}
                            {status?.connected && (
                              <CheckCircle className={`w-4 h-4 ml-2 ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              }`} />
                            )}
                          </h4>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {providerInfo.description}
                            {status?.email && (
                              <span className="block text-xs mt-1">
                                {status.email}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleCloudSave(provider)}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                          isCurrentlySaving
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : `bg-gradient-to-r ${providerInfo.color} text-white hover:shadow-lg hover:scale-105`
                        }`}
                      >
                        {isCurrentlySaving ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            {t('common.saving')}
                          </>
                        ) : (
                          <>
                            <Cloud size={16} className="mr-2" />
                            {t('cloud3.save_to_provider', { provider: providerInfo.name })}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* No Cloud Providers Connected */
            <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
              darkMode 
                ? 'border-gray-600 bg-gray-700/30' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              <Cloud className={`w-12 h-12 mx-auto mb-3 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <h4 className={`font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('cloud.no_cloud_providers')}
              </h4>
              <p className={`text-sm mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('cloud.connect_provider_to_save')}
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={() => onConnectCloud('google_drive')}
                  className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
                >
                  📄 Connect Google Drive
                </button>
                
                <button
                  onClick={() => onConnectCloud('onedrive')}
                  className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
                >
                  ☁️ Connect OneDrive
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
           
            
            <button
              onClick={onClose}
              className={`text-sm ${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageChoiceModal;