// src/components/modals/StorageChoiceModal.jsx - NEW COMPONENT
import React from 'react';
import { X, HardDrive, Cloud, ChevronRight } from 'lucide-react';

const StorageChoiceModal = ({ 
  isOpen, 
  onClose, 
  onSaveLocal, 
  onSaveCloud, 
  canSaveToCloud,
  darkMode,
  isSaving,
  saveType,
  onConnectCloud // NEW: Add connect cloud handler
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full rounded-2xl ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      } shadow-2xl p-6 transform transition-all`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Where would you like to save your CV?
          </h3>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'
            }`}
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storage Options */}
        <div className="space-y-3">
          
          {/* Google Drive Option */}
          {canSaveToCloud ? (
            <button
              onClick={onSaveCloud}
              disabled={isSaving}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                isSaving && saveType === 'cloud'
                  ? 'border-purple-500 bg-purple-50 cursor-not-allowed'
                  : darkMode
                  ? 'border-gray-600 bg-gray-700 hover:border-purple-500 hover:bg-purple-900/20'
                  : 'border-gray-200 bg-gray-50 hover:border-purple-500 hover:bg-purple-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-4 ${
                  darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <Cloud className={`w-6 h-6 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Save to Google Drive
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Access from any device • Automatic backup
                  </p>
                </div>
              </div>
              <div className={`transition-transform group-hover:translate-x-1 ${
                isSaving && saveType === 'cloud' ? 'animate-spin' : ''
              }`}>
                {isSaving && saveType === 'cloud' ? (
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ChevronRight className={`w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                )}
              </div>
            </button>
          ) : (
            // Google Drive - Not Connected
            <div className={`w-full p-4 rounded-xl border-2 border-dashed ${
              darkMode 
                ? 'border-gray-600 bg-gray-700/50' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg mr-4 ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <Cloud className={`w-6 h-6 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      Google Drive
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Access from any device • Automatic backup
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onConnectCloud('google_drive')}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  disabled={isSaving}
                >
                  Connect
                </button>
              </div>
            </div>
          )}

          {/* OneDrive Option - Coming Soon */}
          <div className={`w-full p-4 rounded-xl border-2 border-dashed opacity-60 ${
            darkMode 
              ? 'border-gray-700 bg-gray-800/50' 
              : 'border-gray-200 bg-gray-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-4 ${
                  darkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'
                }`}>
                  {/* OneDrive Icon */}
                  <svg className={`w-6 h-6 ${
                    darkMode ? 'text-blue-400/60' : 'text-blue-600/60'
                  }`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.5 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5c0.2 0 0.4 0 0.6 0.1C6.6 6.9 8.2 6 10 6c2.2 0 4.1 1.4 4.8 3.4 0.1 0 0.2 0 0.2 0 1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-1v1.1c0 0.8 0.7 1.5 1.5 1.5s1.5-0.7 1.5-1.5V14h2c1.1 0 2-0.9 2-2s-0.9-2-2-2c0-2.8-2.2-5-5-5-1.9 0-3.6 1.1-4.4 2.7C8.6 7.3 7.1 7 5.5 7C2.5 7 0 9.5 0 12.5S2.5 18 5.5 18h9c1.4 0 2.5-1.1 2.5-2.5S15.9 13 14.5 13h-1v2.5H5.5z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white/60' : 'text-gray-800/60'
                  }`}>
                    OneDrive
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300/60' : 'text-gray-600/60'
                  }`}>
                    Microsoft integration • Office sync
                  </p>
                </div>
              </div>
              <span className={`px-3 py-2 text-xs rounded-lg font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                Coming Soon
              </span>
            </div>
          </div>

          {/* Dropbox Option - Coming Soon */}
          <div className={`w-full p-4 rounded-xl border-2 border-dashed opacity-60 ${
            darkMode 
              ? 'border-gray-700 bg-gray-800/50' 
              : 'border-gray-200 bg-gray-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-4 ${
                  darkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'
                }`}>
                  {/* Dropbox Icon */}
                  <svg className={`w-6 h-6 ${
                    darkMode ? 'text-blue-400/60' : 'text-blue-600/60'
                  }`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L7.2 3.6l4.8 3.6L7.2 10.8 12 7.2l4.8 3.6L12 14.4l-4.8-3.6L2.4 14.4 7.2 18 12 14.4l4.8 3.6 4.8-3.6-4.8-3.6L12 14.4l-4.8-3.6L12 7.2l4.8-3.6L12 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white/60' : 'text-gray-800/60'
                  }`}>
                    Dropbox
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300/60' : 'text-gray-600/60'
                  }`}>
                    File sharing focused • Team collaboration
                  </p>
                </div>
              </div>
              <span className={`px-3 py-2 text-xs rounded-lg font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                Coming Soon
              </span>
            </div>
          </div>

          {/* Local Storage Option */}
          <button
            onClick={onSaveLocal}
            disabled={isSaving}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
              isSaving && saveType === 'local'
                ? 'border-blue-500 bg-blue-50 cursor-not-allowed'
                : darkMode
                ? 'border-gray-600 bg-gray-700 hover:border-blue-500 hover:bg-blue-900/20'
                : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-4 ${
                darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <HardDrive className={`w-6 h-6 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div className="text-left">
                <h4 className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Save to This Device
                </h4>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Private • Works offline • This device only
                </p>
              </div>
            </div>
            <div className={`transition-transform group-hover:translate-x-1 ${
              isSaving && saveType === 'local' ? 'animate-spin' : ''
            }`}>
              {isSaving && saveType === 'local' ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ChevronRight className={`w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              )}
            </div>
          </button> 

          {/* Separator */}
          <div className="relative">
            <div className={`absolute inset-0 flex items-center ${darkMode ? '' : ''}`}>
              <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                or
              </span>
            </div>
          </div>

          {/* Connect More Clouds Section */}
          {!canSaveToCloud && (
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-blue-900/10 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-blue-300' : 'text-blue-800'
              }`}>
                💡 Connect cloud storage for device sync
              </p>
              <p className={`text-xs ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Your CV will be accessible from any device with your account
              </p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className={`mt-6 p-3 rounded-lg ${
          darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <p className={`text-xs text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            💡 Your work is auto-saved as you type - you won't lose anything!
          </p>
        </div>

      </div>
    </div>
  );
};

export default StorageChoiceModal;