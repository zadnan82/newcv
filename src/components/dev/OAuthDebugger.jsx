// src/components/dev/OAuthDebugger.jsx - Debug OAuth URLs (Fixed)
import React, { useState } from 'react';
import { Eye, Copy, ExternalLink } from 'lucide-react';

const OAuthDebugger = ({ darkMode }) => {
  const [showDebug, setShowDebug] = useState(false);

  const generateOAuthUrls = () => {
    // Fix: Use import.meta.env instead of process.env for Vite
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                    import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;
    const baseUrl = window.location.origin;
    
    if (!clientId) {
      return {
        error: 'VITE_GOOGLE_CLIENT_ID or REACT_APP_GOOGLE_CLIENT_ID not found in environment variables',
        clientId: null,
        urls: {},
        envVars: {
          vite: import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✅ Found' : '❌ Missing',
          react: import.meta.env.REACT_APP_GOOGLE_CLIENT_ID ? '✅ Found' : '❌ Missing'
        }
      };
    }

    const redirectUris = [
      `${baseUrl}/cloud/connected`,
      `${baseUrl}/api/cloud/callback/google_drive`,
      'http://localhost:8000/api/cloud/callback/google_drive'
    ];

    const urls = {};
    
    redirectUris.forEach((redirectUri, index) => {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'https://www.googleapis.com/auth/drive.file',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
        state: `dev_google_drive_${Date.now()}_${index}`
      });

      urls[`Option ${index + 1}`] = {
        redirectUri,
        fullUrl: `https://accounts.google.com/o/oauth2/auth?${params.toString()}`
      };
    });

    return {
      error: null,
      clientId,
      urls,
      envVars: {
        vite: import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✅ Found' : '❌ Missing',
        react: import.meta.env.REACT_APP_GOOGLE_CLIENT_ID ? '✅ Found' : '❌ Missing'
      }
    };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const { error, clientId, urls, envVars } = generateOAuthUrls();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className={`flex items-center text-sm ${
          darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
        }`}
      >
        <Eye className="w-4 h-4 mr-1" />
        {showDebug ? 'Hide' : 'Show'} OAuth Debug Info
      </button>

      {showDebug && (
        <div className={`mt-4 p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <h4 className={`font-medium mb-3 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            OAuth Configuration Debug
          </h4>

          {/* Environment Variables Check */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Environment Variables:
            </label>
            <div className="space-y-1 text-xs">
              <div>VITE_GOOGLE_CLIENT_ID: {envVars?.vite}</div>
              <div>REACT_APP_GOOGLE_CLIENT_ID: {envVars?.react}</div>
            </div>
          </div>

          {/* Client ID */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Google Client ID:
            </label>
            {clientId ? (
              <div className="flex items-center">
                <code className={`text-xs px-2 py-1 rounded ${
                  darkMode ? 'bg-gray-700 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  {clientId.substring(0, 20)}...
                </code>
                <button
                  onClick={() => copyToClipboard(clientId)}
                  className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                ❌ Not configured - add VITE_GOOGLE_CLIENT_ID or REACT_APP_GOOGLE_CLIENT_ID to .env.local
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className={`mb-4 p-3 rounded ${
              darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
            }`}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* OAuth URLs */}
          {Object.keys(urls).length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Generated OAuth URLs:
              </label>
              
              {Object.entries(urls).map(([option, { redirectUri, fullUrl }]) => (
                <div key={option} className={`mb-3 p-3 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {option}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => copyToClipboard(fullUrl)}
                        className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                        title="Copy URL"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => window.open(fullUrl, '_blank')}
                        className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                        title="Test URL"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className={`text-xs mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Redirect URI: <code>{redirectUri}</code>
                  </div>
                  
                  <div className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <details>
                      <summary className="cursor-pointer">Full URL</summary>
                      <code className="break-all">{fullUrl}</code>
                    </details>
                  </div>
                </div>
              ))}

              <div className={`mt-4 p-3 rounded ${
                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                <div className="text-sm">
                  <strong>✅ To fix redirect_uri_mismatch:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                    <li>Navigate to APIs & Services → Credentials</li>
                    <li>Click your OAuth 2.0 Client ID</li>
                    <li>Add these exact redirect URIs:</li>
                  </ol>
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                    {Object.values(urls).map(({ redirectUri }, index) => (
                      <li key={index}>
                        <code className="text-xs">{redirectUri}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Environment Setup Instructions */}
          {!clientId && (
            <div className={`mt-4 p-3 rounded ${
              darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
            }`}>
              <div className="text-sm">
                <strong>📝 Environment Setup:</strong>
                <p className="mt-1">Create a <code>.env.local</code> file in your project root with:</p>
                <pre className="mt-2 text-xs bg-black bg-opacity-20 p-2 rounded">
{`# For Vite (recommended)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# For Create React App (fallback)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here`}
                </pre>
                <p className="mt-2">Then restart your development server.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OAuthDebugger;
 