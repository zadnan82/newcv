// src/components/clouds/CloudSetup.jsx - Fixed version
import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  HardDrive, 
  Shield, 
  Check, 
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Settings,
  Zap,
  X
} from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import { ENV_INFO } from '../../config';

const CloudSetup = ({ darkMode, onComplete, required = true }) => {
  const {
    connectedProviders,
    cloudStatus,
    loading,
    error,
    showCloudSetup,
    connectCloudProvider,
    checkCloudConnections,
    getAvailableProviders,
    setShowCloudSetup,
    clearError,
    backendAvailable,
    getEnvironmentInfo
  } = useSessionStore();

  const [availableProviders, setAvailableProviders] = useState([]);
  const [connectingProvider, setConnectingProvider] = useState(null);
  const [showDevOptions, setShowDevOptions] = useState(ENV_INFO.isDevelopment);

  // Load available providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await getAvailableProviders();
        setAvailableProviders(response.providers || []);
        console.log('✅ Loaded providers:', response.providers?.length || 0);
      } catch (error) {
        console.error('Failed to load providers:', error);
        // Set fallback providers
        setAvailableProviders([
          {
            id: 'google_drive',
            name: 'Google Drive',
            description: 'Store your CVs in Google Drive',
            supported_features: ['read', 'write', 'delete', 'folders']
          }
        ]);
      }
    };

    loadProviders();
  }, [getAvailableProviders]);

  // Auto-refresh status periodically
  useEffect(() => {
    if (connectedProviders.length > 0) {
      const interval = setInterval(() => {
        checkCloudConnections().catch(console.error);
      }, 300000); // Check every 300 seconds
      return () => clearInterval(interval);
    }
  }, [connectedProviders.length, checkCloudConnections]);

  const handleConnectProvider = async (providerId) => {
    setConnectingProvider(providerId);
    clearError();
    
    try {
      console.log('🔄 Connecting to provider:', providerId);
      await connectCloudProvider(providerId);
      
      // connectCloudProvider redirects to OAuth, so this code won't be reached
      // unless there's an error
      
    } catch (error) {
      console.error('Failed to connect provider:', error);
      setConnectingProvider(null);
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
    const status = cloudStatus[providerId];
    if (!status) return { connected: false, status: 'unknown' };
    return status;
  };

  const environmentInfo = getEnvironmentInfo();

  // Don't render if already connected and not required to show
  if (!showCloudSetup && connectedProviders.length > 0 && !required) {
    return null;
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
          
          {/* Development Mode Indicator */}
          {ENV_INFO.isDevelopment && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-200 text-sm">
              <Settings className="w-4 h-4 mr-2" />
              Development Mode
            </div>
          )}
        </div>

        {/* Environment Info (Development) */}
        {showDevOptions && (
          <div className={`px-8 py-4 border-b ${
            darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-yellow-50'
          }`}>
            <div className="flex items-start space-x-4">
              <Zap className={`w-6 h-6 mt-1 ${
                darkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
              <div>
                <h3 className={`font-semibold mb-2 ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-700'
                }`}>
                  Development Environment
                </h3>
                <ul className={`text-sm space-y-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <li>• Backend Available: {environmentInfo.backendAvailable ? '✅ Yes' : '❌ No'}</li>
                  <li>• API URL: {environmentInfo.apiBaseUrl}</li>
                  <li>• Session Active: {environmentInfo.sessionActive ? '✅ Yes' : '❌ No'}</li>
                  <li>• Connected Providers: {environmentInfo.connectedProviders}</li>
                </ul>
                
                {!environmentInfo.backendAvailable && (
                  <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    💡 Backend offline - OAuth will redirect through localhost:8000
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                            {provider?.name || providerId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            ✓ Connected • {status.email || 'Active'}
                          </p>
                        </div>
                      </div>
                      <div className="text-green-500">
                        <Check className="w-5 h-5" />
                      </div>
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
              const isConnecting = connectingProvider === provider.id;
              
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
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    
                    {isConnected && (
                      <div className={`p-1 rounded-full ${
                        darkMode ? 'bg-green-900/30' : 'bg-green-100'
                      }`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Features */}
                  {provider.supported_features && (
                    <div className="mb-4">
                      <p className={`text-xs font-medium mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Supported features:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {provider.supported_features.map(feature => (
                          <span key={feature} className={`px-2 py-1 rounded-full text-xs ${
                            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Connect Button */}
                  {!isConnected && (
                    <button
                      onClick={() => handleConnectProvider(provider.id)}
                      disabled={isConnecting}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        isConnecting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : darkMode
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  )}
                  
                  {isConnected && (
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-medium ${
                        darkMode 
                          ? 'bg-gray-600 text-gray-300 cursor-default' 
                          : 'bg-gray-200 text-gray-700 cursor-default'
                      }`}
                      disabled
                    >
                      Connected
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {connectedProviders.length === 0 && !required && (
              <button
                onClick={handleSkip}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Skip for now
              </button>
            )}
            
            {connectedProviders.length > 0 && (
              <button
                onClick={handleContinue}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors`}
              >
                Continue
              </button>
            )}
            
            {ENV_INFO.isDevelopment && (
              <button
                onClick={() => setShowDevOptions(!showDevOptions)}
                className={`py-3 px-6 rounded-lg font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showDevOptions ? 'Hide Debug' : 'Show Debug'}
              </button>
            )}
          </div>
        </div>
        
        {/* Footer Note */}
        <div className={`px-8 py-4 text-center ${
          darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}>
          <p className="text-sm">
            You can always connect additional cloud storage later from settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default CloudSetup;