// src/components/modals/SimplifiedSaveDecisionModal.jsx
import React, { useState } from 'react';
import { X, HardDrive, Cloud, Check, ArrowRight, Smartphone, Shield, AlertTriangle } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';

const SimplifiedSaveDecisionModal = ({ darkMode, cvData, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { 
    saveLocally, 
    saveToConnectedCloud, 
    connectedProviders,
    canSaveToCloud
  } = useSessionStore();

  const handleSaveLocal = async () => {
    console.log('🔄 handleSaveLocal called');
    setLoading(true);
    
    try {
      const result = await saveLocally(cvData);
      console.log('✅ Local save result:', result);
      
      if (result.success) {
        onClose({ 
          success: true, 
          type: 'local', 
          message: result.message,
          cv: result.cv 
        });
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
    console.log('🔄 handleSaveCloud called');
    setLoading(true);
    
    try {
      const result = await saveToConnectedCloud(cvData);
      console.log('✅ Cloud save result:', result);
      
      if (result.success) {
        onClose({ 
          success: true, 
          type: 'cloud', 
          message: result.message,
          provider: result.provider,
          fileId: result.fileId
        });
      } else if (result.needsConnection) {
        // Redirect to cloud setup
        onClose({ needsCloudSetup: true });
      } else {
        alert('Failed to save to cloud: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Cloud save error:', error);
      alert('Failed to save to cloud: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
            Choose how to store your CV:
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
                    Save Locally
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
                    Save to Cloud
                  </h4>
                </div>
                {selectedOption === 'cloud' && (
                  <Check className="w-5 h-5 text-purple-500" />
                )}
              </div>

              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {canSaveToCloud() 
                  ? `Save to ${connectedProviders[0]?.replace('_', ' ').toUpperCase() || 'Google Drive'}`
                  : 'Connect Google Drive first'
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
                canSaveToCloud() 
                  ? darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
                  : darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start">
                  <Shield className={`w-4 h-4 mt-0.5 mr-2 ${
                    canSaveToCloud()
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <p className={`text-xs ${
                    canSaveToCloud() 
                      ? darkMode ? 'text-green-300' : 'text-green-700'
                      : darkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    {canSaveToCloud() 
                      ? 'Your data stays in your own Google Drive account.'
                      : 'Connect Google Drive to enable cloud saving.'
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
                  Saving...
                </div>
              ) : selectedOption === 'local' ? (
                'Save Locally'
              ) : canSaveToCloud() ? (
                'Save to Cloud'
              ) : (
                'Set up Cloud Storage'
              )}
            </button>
          </div>

          {/* Helper text */}
          <p className={`text-center text-xs mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You can always save to both locations for extra security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedSaveDecisionModal;