// src/components/dev/DevTools.jsx - Development testing utility
import React, { useState, useEffect } from 'react';
import { Settings, Trash2, RefreshCw, TestTube, CheckCircle, XCircle, Info } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import { ENV_INFO, checkBackendAvailability } from '../../config';

const DevTools = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  
  const {
    connectedProviders,
    providersStatus,
    isSessionActive,
    sessionId,
    forceConnectProvider,
    disconnectProvider,
    clearSession,
    getEnvironmentInfo,
    checkCloudStatus
  } = useSessionStore();

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      const available = await checkBackendAvailability();
      setBackendStatus(available ? 'online' : 'offline');
    };
    
    checkBackend();
    const interval = setInterval(checkBackend, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleForceConnect = (provider) => {
    forceConnectProvider(provider, {
      email: `dev-user@${provider.replace('_', '')}.com`,
      storage_quota: {
        total: 15 * 1024 * 1024 * 1024, // 15GB
        used: Math.floor(Math.random() * 5 * 1024 * 1024 * 1024), // Random usage up to 5GB
        available: 10 * 1024 * 1024 * 1024 // 10GB available
      }
    });
  };

  const handleDisconnect = async (provider) => {
    try {
      await disconnectProvider(provider);
      console.log(`🔧 Disconnected ${provider}`);
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error);
    }
  };

  const handleClearSession = async () => {
    try {
      await clearSession();
      console.log('🔧 Session cleared');
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await checkCloudStatus();
      console.log('🔧 Cloud status refreshed');
    } catch (error) {
      console.error('Failed to refresh status:', error);
    }
  };

  const providers = [
    { id: 'google_drive', name: 'Google Drive', icon: '🗂️' },
    { id: 'onedrive', name: 'OneDrive', icon: '☁️' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦' },
    { id: 'box', name: 'Box', icon: '📁' }
  ];

  const environmentInfo = getEnvironmentInfo();

  // Only show in development
  if (!ENV_INFO.isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-200 ${
          darkMode 
            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
        } ${isOpen ? 'rotate-45' : ''}`}
        title="Development Tools"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Dev Tools Panel */}
      {isOpen && (
        <div className={`fixed bottom-20 right-4 z-50 w-80 rounded-xl shadow-2xl border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`px-4 py-3 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`font-semibold flex items-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <TestTube className="w-4 h-4 mr-2" />
              Development Tools
            </h3>
          </div>

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            
            {/* Environment Status */}
            <div>
              <h4 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Environment Status
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Backend:</span>
                  <span className={`flex items-center ${
                    backendStatus === 'online' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {backendStatus === 'online' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {backendStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Session:</span>
                  <span className={isSessionActive ? 'text-green-500' : 'text-red-500'}>
                    {isSessionActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Providers:</span>
                  <span>{connectedProviders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>API:</span>
                  <span className="text-xs">{environmentInfo.apiBaseUrl}</span>
                </div>
              </div>
            </div>

            {/* Session Actions */}
            <div>
              <h4 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Session Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={handleRefreshStatus}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center justify-center ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh Status
                </button>
                <button
                  onClick={handleClearSession}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center justify-center ${
                    darkMode 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear Session
                </button>
              </div>
            </div>

            {/* Provider Testing */}
            <div>
              <h4 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Force Connect Providers
              </h4>
              <div className="space-y-2">
                {providers.map(provider => {
                  const isConnected = connectedProviders.includes(provider.id);
                  const status = providersStatus[provider.id];
                  
                  return (
                    <div key={provider.id} className={`flex items-center justify-between p-2 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center">
                        <span className="mr-2">{provider.icon}</span>
                        <div>
                          <div className={`text-xs font-medium ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {provider.name}
                          </div>
                          {isConnected && status?.email && (
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {status.email}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {isConnected ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <button
                              onClick={() => handleDisconnect(provider.id)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                darkMode 
                                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                                  : 'bg-red-500 hover:bg-red-600 text-white'
                              }`}
                            >
                              Disconnect
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleForceConnect(provider.id)}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              darkMode 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Debug Info */}
            <div>
              <h4 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Debug Info
              </h4>
              <div className={`p-2 rounded-lg text-xs ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <details>
                  <summary className="cursor-pointer">Session Data</summary>
                  <pre className={`mt-2 text-xs ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {JSON.stringify({
                      sessionId: sessionId ? `${sessionId.substring(0, 8)}...` : null,
                      isActive: isSessionActive,
                      connectedProviders,
                      backendAvailable: environmentInfo.backendAvailable
                    }, null, 2)}
                  </pre>
                </details>
              </div>
            </div>

            {/* Help */}
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-start">
                <Info className={`w-3 h-3 mt-0.5 mr-2 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className={`text-xs ${
                  darkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  Use "Force Connect" to simulate OAuth connections when backend is offline. 
                  Check console for detailed logs.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevTools;