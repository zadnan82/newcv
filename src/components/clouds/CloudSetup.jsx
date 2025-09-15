// src/components/cloud/CloudSetup.jsx
import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  HardDrive, 
  Shield, 
  Check, 
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';

const CloudSetup = ({ darkMode, onComplete, required = true }) => {
  const {
    connectedProviders,
    providersStatus,
    loading,
    error,
    showCloudSetup,
    connectProvider,
    checkCloudStatus,
    getAvailableProviders,
    setShowCloudSetup,
    clearError,
    testProvider
  } = useSessionStore();

  const [availableProviders, setAvailableProviders] = useState([]);
  const [testingProvider, setTestingProvider] = useState(null);

  // Load available providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providers = await getAvailableProviders();
        setAvailableProviders(providers.providers || []);
      } catch (error) {
        console.error('Failed to load providers:', error);
      }
    };

    loadProviders();
  }, []);

  // Auto-check status periodically
  useEffect(() => {
    if (connectedProviders.length > 0) {
      const interval = setInterval(checkCloudStatus, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [connectedProviders]);

  const handleConnectProvider = async (providerId) => {
    try {
      clearError();
      await connectProvider(providerId);
      // The OAuth flow will redirect away from this page
    } catch (error) {
      console.error(`Failed to connect to ${providerId}:`, error);
    }
  };

  const handleTestConnection = async (providerId) => {
    setTestingProvider(providerId);
    try {
      await testProvider(providerId);
      // Refresh status after successful test
      await checkCloudStatus();
    } catch (error) {
      console.error(`Test failed for ${providerId}:`, error);
    } finally {
      setTestingProvider(null);
    }
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    } else {
      setShowCloudSetup(false);
    }
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    } else {
      setShowCloudSetup(false);
    }
  };

  const getProviderIcon = (providerId) => {
    const icons = {
      'google_drive': '🗂️',
      'onedrive': '☁️',
      'dropbox': '📦',
      'box': '📁'
    };
    return icons[providerId] || '☁️';
  };

  const getProviderStatus = (providerId) => {
    const status = providersStatus[providerId];
    if (!status) return { connected: false, status: 'unknown' };
    return status;
  };

  if (!showCloudSetup && connectedProviders.length > 0) {
    return null; // Don't show if already set up
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className={`max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className={`px-8 py-6 text-center ${
          darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-500 to-purple-600'
        }`}>
          <Cloud className="w-16 h-16 mx-auto mb-4 text-white" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Connect Your Cloud Storage
          </h1>
          <p className="text-blue-100">
            Your CV data will be stored securely in YOUR cloud storage account
          </p>
        </div>

        {/* Privacy Notice */}
        <div className={`px-8 py-6 border-b ${
          darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-blue-50'
        }`}>
          <div className="flex items-start space-x-4">
            <Shield className={`w-6 h-6 mt-1 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <div>
              <h3 className={`font-semibold mb-2 ${
                darkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                Your Privacy is Protected
              </h3>
              <ul className={`text-sm space-y-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li>• We never store your personal information on our servers</li>
                <li>• Your CV data lives entirely in your own cloud storage</li>
                <li>• We only access your files when you explicitly request it</li>
                <li>• You can revoke access at any time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-8 py-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Connected Providers */}
        {connectedProviders.length > 0 && (
          <div className="px-8 py-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Connected Storage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedProviders.map(providerId => {
                const status = getProviderStatus(providerId);
                const provider = availableProviders.find(p => p.id === providerId);
                
                return (
                  <div key={providerId} className={`p-4 rounded-lg border-2 border-green-200 ${
                    darkMode ? 'bg-gray-700' : 'bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getProviderIcon(providerId)}</span>
                        <div>
                          <p className={`font-medium ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {provider?.name || providerId}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            ✓ Connected • {status.email || 'Active'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTestConnection(providerId)}
                        disabled={testingProvider === providerId}
                        className={`p-2 rounded-full transition-colors ${
                          darkMode 
                            ? 'hover:bg-gray-600 text-gray-300' 
                            : 'hover:bg-green-100 text-green-600'
                        }`}
                        title="Test connection"
                      >
                        {testingProvider === providerId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {status.storage_quota && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Storage Used</span>
                          <span>
                            {Math.round(status.storage_quota.used / 1024 / 1024 / 1024 * 100) / 100} GB / 
                            {Math.round(status.storage_quota.total / 1024 / 1024 / 1024 * 100) / 100} GB
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, (status.storage_quota.used / status.storage_quota.total) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Providers */}
        <div className="px-8 py-6">
          <h3 className={`text-lg font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {connectedProviders.length > 0 ? 'Add More Storage' : 'Choose Your Cloud Storage'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableProviders.map(provider => {
              const isConnected = connectedProviders.includes(provider.id);
              
              return (
                <div key={provider.id} className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  isConnected 
                    ? darkMode 
                      ? 'border-green-500 bg-gray-700' 
                      : 'border-green-300 bg-green-50'
                    : darkMode 
                      ? 'border-gray-600 bg-gray-700 hover:border-purple-500 hover:bg-gray-650' 
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{getProviderIcon(provider.id)}</span>
                      <div>
                        <h4 className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {provider.name}
                        </h4>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    
                    {isConnected ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <ExternalLink className={`w-5 h-5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Features: {provider.supported_features?.join(', ') || 'File storage and management'}
                    </p>
                  </div>
                  
                  {!isConnected && (
                    <button
                      onClick={() => handleConnectProvider(provider.id)}
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        darkMode 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Connecting...
                        </div>
                      ) : (
                        `Connect to ${provider.name}`
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`px-8 py-6 border-t ${
          darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            
            {/* Info */}
            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {connectedProviders.length > 0 ? (
                <span>✓ You're ready to create and store CVs securely</span>
              ) : (
                <span>Connect at least one cloud storage to continue</span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              {!required && (
                <button
                  onClick={handleSkip}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-600' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Skip for now
                </button>
              )}
              
              {connectedProviders.length > 0 && (
                <button
                  onClick={handleContinue}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Continue to CV Builder
                </button>
              )}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className={`px-8 py-6 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <h4 className={`font-semibold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            How it works:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Connect your preferred cloud storage account
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Create and edit your CV using our builder
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Your CV is automatically saved to your cloud storage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudSetup;