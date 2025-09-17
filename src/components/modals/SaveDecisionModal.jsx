// src/components/modals/SaveDecisionModal.jsx - Fixed cloud flow
import React, { useState } from 'react';
import { X, HardDrive, Cloud, Check, ArrowRight, Smartphone, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';

const SaveDecisionModal = ({ darkMode, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { 
    capabilities, 
    saveLocally, 
    saveToCloud, 
    connectCloudProvider,
    connectedProviders,
    pendingSaveData
  } = useSessionStore();

  const cvData = pendingSaveData;

  const handleSaveLocal = async () => {
    console.log('🔄 handleSaveLocal called with cvData:', cvData);
    setLoading(true);
    try {
      const result = await saveLocally(cvData);
      console.log('✅ saveLocally result:', result);
      if (result.success) {
        onClose({ success: true, type: 'local', cv: result.cv });
      } else {
        alert('Failed to save locally: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Local save error:', error);
      alert('Failed to save locally: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCloud = async () => {
    if (!capabilities.canSaveToCloud) {
      setSelectedOption('cloud-setup');
      return;
    }

    setLoading(true);
    try {
      console.log('💾 Attempting cloud save with data:', cvData);
      const result = await saveToCloud(cvData);
      
      if (result.success) {
        console.log('✅ Cloud save successful:', result);
        onClose({ success: true, type: 'cloud', provider: result.provider });
      } else {
        console.error('❌ Cloud save failed:', result.error);
        
        if (result.needsReconnect) {
          if (confirm('Your cloud connection expired. Would you like to reconnect?')) {
            setSelectedOption('cloud-setup');
          }
        } else {
          alert('Failed to save to cloud: ' + (result.error || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('❌ Cloud save error:', error);
      alert('Failed to save to cloud: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloudConnect = async (provider) => {
    setLoading(true);
    try {
      console.log('🔗 Connecting to cloud provider:', provider);
      console.log('🔗 CV data to save after connection:', cvData?.title);
      
      // This will store the CV data and redirect to OAuth
      await connectCloudProvider(provider);
      // OAuth redirect happens here - the CloudCallback will handle auto-save
      
    } catch (error) {
      console.error('Cloud connection error:', error);
      alert('Failed to connect to cloud storage: ' + error.message);
      setLoading(false);
    }
  };
 
  if (selectedOption === 'cloud-setup') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`max-w-md w-full rounded-2xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        } shadow-2xl`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Connect & Save
              </h3>
              <button 
                onClick={() => setSelectedOption(null)}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Important Notice */}
            <div className={`mb-6 p-4 rounded-lg border-l-4 ${
              darkMode ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-start">
                <Shield className={`w-5 h-5 mt-0.5 mr-3 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    darkMode ? 'text-blue-300' : 'text-blue-800'
                  }`}>
                    Your CV will be saved automatically
                  </p>
                  <p className={`text-xs ${
                    darkMode ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    After connecting, your CV "{cvData?.title}" will be saved directly to your chosen cloud storage.
                  </p>
                </div>
              </div>
            </div>

            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose a cloud storage provider. Your CV will be saved there automatically after connection:
            </p>

            <div className="space-y-3">
              {['google_drive', 'onedrive', 'dropbox', 'box'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleCloudConnect(provider)}
                  disabled={loading}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    loading
                      ? 'opacity-50 cursor-not-allowed border-gray-300'
                      : darkMode 
                        ? 'border-purple-700 hover:border-purple-500 hover:bg-purple-900/20' 
                        : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {provider === 'google_drive' && '🗂️'}
                        {provider === 'onedrive' && '☁️'}
                        {provider === 'dropbox' && '📦'}
                        {provider === 'box' && '📁'}
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {provider === 'google_drive' && 'Google Drive'}
                          {provider === 'onedrive' && 'OneDrive'}
                          {provider === 'dropbox' && 'Dropbox'}
                          {provider === 'box' && 'Box'}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {loading 
                            ? 'Connecting & saving...'
                            : 'Connect and auto-save CV'
                          }
                        </div>
                      </div>
                    </div>
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedOption(null)}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ← Back to storage options
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`max-w-md w-full rounded-2xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        } shadow-2xl p-6 text-center`}>
          <AlertTriangle className={`w-16 h-16 mx-auto mb-4 ${
            darkMode ? 'text-yellow-400' : 'text-yellow-500'
          }`} />
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No CV Data Found
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            There's no CV data to save. Please create or load a CV first.
          </p>
          <button
            onClick={() => onClose({ cancelled: true })}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-2xl w-full rounded-2xl ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      } shadow-2xl`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Save Your CV
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                "{cvData.title}"
              </p>
            </div>
            <button 
              onClick={() => onClose({ cancelled: true })}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose how to store your CV. You can always change this later or save to both locations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            
            {/* Local Storage Option */}
            <div className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selectedOption === 'local' 
                ? 'border-purple-500 ring-2 ring-purple-500 ring-opacity-20'
                : darkMode 
                  ? 'border-gray-600 hover:border-gray-500' 
                  : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption('local')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <HardDrive className={`w-6 h-6 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <h4 className={`ml-3 font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Local Storage
                  </h4>
                </div>
                {selectedOption === 'local' && (
                  <Check className="w-5 h-5 text-purple-500" />
                )}
              </div>

              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Save on this device only
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Instant save
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Complete privacy
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    No setup required
                  </span>
                </div>
              </div>

              <div className={`mt-4 p-3 rounded-lg ${
                darkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-start">
                  <Smartphone className={`w-4 h-4 mt-0.5 mr-2 ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <p className={`text-xs ${
                    darkMode ? 'text-yellow-300' : 'text-yellow-700'
                  }`}>
                    Available on this device only. Won't sync to other devices.
                  </p>
                </div>
              </div>
            </div>

            {/* Cloud Storage Option */}
            <div className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selectedOption === 'cloud' 
                ? 'border-purple-500 ring-2 ring-purple-500 ring-opacity-20'
                : darkMode 
                  ? 'border-gray-600 hover:border-gray-500' 
                  : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption('cloud')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <Cloud className={`w-6 h-6 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  </div>
                  <h4 className={`ml-3 font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Cloud Storage
                  </h4>
                </div>
                {selectedOption === 'cloud' && (
                  <Check className="w-5 h-5 text-purple-500" />
                )}
              </div>

              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {capabilities.canSaveToCloud 
                  ? `Save to ${connectedProviders[0]?.replace('_', ' ').toUpperCase() || 'cloud'}`
                  : 'Connect your cloud storage'
                }
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Access anywhere
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Automatic backup
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Sync across devices
                  </span>
                </div>
              </div>

              <div className={`mt-4 p-3 rounded-lg ${
                capabilities.canSaveToCloud 
                  ? darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
                  : darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start">
                  {capabilities.canSaveToCloud ? (
                    <RefreshCw className={`w-4 h-4 mt-0.5 mr-2 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  ) : (
                    <Shield className={`w-4 h-4 mt-0.5 mr-2 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  )}
                  <p className={`text-xs ${
                    capabilities.canSaveToCloud 
                      ? darkMode ? 'text-green-300' : 'text-green-700'
                      : darkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    {capabilities.canSaveToCloud 
                      ? 'Your data stays in your own cloud account. We never see it.'
                      : 'Quick setup required. Your data stays in YOUR cloud account.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onClose({ cancelled: true })}
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700 border border-gray-600' 
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>

            <button
              onClick={selectedOption === 'local' ? handleSaveLocal : handleSaveCloud}
              disabled={!selectedOption || loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                !selectedOption || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {selectedOption === 'cloud' && !capabilities.canSaveToCloud 
                    ? 'Connecting...' 
                    : 'Saving...'
                  }
                </div>
              ) : selectedOption === 'local' ? (
                'Save Locally'
              ) : capabilities.canSaveToCloud ? (
                'Save to Cloud'
              ) : (
                'Connect & Save to Cloud'
              )}
            </button>
          </div>

          {/* Helper text */}
          <p className={`text-center text-xs mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You can always save to the other location later, or save to both for extra security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaveDecisionModal;