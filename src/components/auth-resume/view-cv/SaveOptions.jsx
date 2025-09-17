// src/components/resume/SaveOptions.jsx - Google Drive focused
import React, { useState } from 'react';
import { Save, HardDrive, Cloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import useSessionStore from '../../../stores/sessionStore';

const SaveOptions = ({ cvData, onSaveComplete, darkMode }) => {
  const [saving, setSaving] = useState(false);
  const [saveType, setSaveType] = useState(null);
  const [result, setResult] = useState(null);
  
  const {
    saveLocally,
    saveToConnectedCloud,
    connectedProviders,
    capabilities
  } = useSessionStore();

  const handleSaveLocal = async () => {
    setSaving(true);
    setSaveType('local');
    setResult(null);

    try {
      const result = await saveLocally(cvData);
      setResult(result);
      if (result.success) {
        onSaveComplete?.(result);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message || 'Failed to save locally'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCloud = async () => {
    setSaving(true);
    setSaveType('cloud');
    setResult(null);

    try {
      const result = await saveToConnectedCloud(cvData, 'google_drive');
      setResult(result);
      if (result.success) {
        onSaveComplete?.(result);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message || 'Failed to save to cloud'
      });
    } finally {
      setSaving(false);
    }
  };

  const canSaveToCloud = capabilities.canSaveToCloud && connectedProviders.includes('google_drive');

  return (
    <div className={`p-6 rounded-xl ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border`}>
      <h3 className={`text-lg font-semibold mb-4 flex items-center ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <Save className="w-5 h-5 mr-2" />
        Save Your CV
      </h3>

      {/* Save Options */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Local Save */}
        <button
          onClick={handleSaveLocal}
          disabled={saving}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            saving && saveType === 'local'
              ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
              : saving
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
              : darkMode
              ? 'border-gray-600 bg-gray-700 hover:border-blue-500 hover:bg-gray-600'
              : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center mb-2">
            <HardDrive className={`w-5 h-5 mr-2 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <span className={`font-medium ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Save Locally
            </span>
          </div>
          <p className={`text-xs text-left ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Store in your browser (always available)
          </p>
        </button>

        {/* Cloud Save */}
        <button
          onClick={handleSaveCloud}
          disabled={saving || !canSaveToCloud}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            !canSaveToCloud
              ? darkMode
                ? 'border-gray-700 bg-gray-800 cursor-not-allowed opacity-50'
                : 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
              : saving && saveType === 'cloud'
              ? 'border-purple-300 bg-purple-50 cursor-not-allowed'
              : saving
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
              : darkMode
              ? 'border-purple-600 bg-gray-700 hover:border-purple-500 hover:bg-gray-600'
              : 'border-purple-300 bg-white hover:border-purple-400 hover:bg-purple-50'
          }`}
        >
          <div className="flex items-center mb-2">
            <Cloud className={`w-5 h-5 mr-2 ${
              canSaveToCloud 
                ? darkMode ? 'text-purple-400' : 'text-purple-600'
                : darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`font-medium ${
              darkMode ? 'text-white' : canSaveToCloud ? 'text-gray-800' : 'text-gray-500'
            }`}>
              Save to Google Drive
            </span>
          </div>
          <p className={`text-xs text-left ${
            darkMode ? 'text-gray-400' : canSaveToCloud ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {canSaveToCloud ? 'Sync across devices' : 'Connect Google Drive first'}
          </p>
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`p-4 rounded-lg ${
          result.success
            ? darkMode
              ? 'bg-green-900/20 border border-green-700'
              : 'bg-green-50 border border-green-200'
            : darkMode
            ? 'bg-red-900/20 border border-red-700'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {result.success ? (
              <CheckCircle className={`w-5 h-5 mr-2 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            ) : (
              <AlertCircle className={`w-5 h-5 mr-2 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            )}
            <span className={`text-sm ${
              result.success
                ? darkMode ? 'text-green-300' : 'text-green-700'
                : darkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              {result.success 
                ? result.message || 'Saved successfully!'
                : result.error || 'Save failed'
              }
            </span>
          </div>
          {result.success && result.fileId && (
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              File ID: {result.fileId}
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {saving && (
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
        }`}>
          <div className="flex items-center">
            <Loader2 className={`w-5 h-5 mr-2 animate-spin ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <span className={`text-sm ${
              darkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {saveType === 'local' ? 'Saving locally...' : 'Saving to Google Drive...'}
            </span>
          </div>
        </div>
      )}

      {/* Cloud Setup Prompt */}
      {!canSaveToCloud && !saving && (
        <div className={`mt-4 p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className={`text-sm mb-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Want to save to Google Drive for automatic backups and sync?
          </p>
          <button
            onClick={() => window.location.href = '/cloud-setup'}
            className={`px-4 py-2 rounded-lg font-medium ${
              darkMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            Set Up Google Drive
          </button>
        </div>
      )}
    </div>
  );
};

export default SaveOptions;