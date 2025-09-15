// src/components/dev/OAuthRedirectDebugger.jsx - Debug OAuth redirect URIs
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Copy, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

const OAuthRedirectDebugger = ({ darkMode }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Get current URL info
    const url = window.location.origin;
    setCurrentUrl(url);
    
    // Get client ID from environment
    const id = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
               import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;
    setClientId(id || '');
    
    // Generate debug info
    setDebugInfo({
      currentOrigin: window.location.origin,
      currentPort: window.location.port,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      isLocalhost: window.location.hostname === 'localhost',
      isSecure: window.location.protocol === 'https:',
      devServer: window.location.port === '5173' ? 'Vite' : 
                 window.location.port === '3000' ? 'CRA' : 
                 'Custom'
    });
  }, []);

  const generateCorrectRedirectUri = () => {
    return `${window.location.origin}/cloud/connected`;
  };

  const generateOAuthUrl = () => {
    if (!clientId) return null;
    
    const redirectUri = generateCorrectRedirectUri();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'https://www.googleapis.com/auth/drive.file',
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      state: `debug_test_${Date.now()}`
    });
    
    return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const correctRedirectUri = generateCorrectRedirectUri();
  const oauthUrl = generateOAuthUrl();

  return (
    <div className={`p-6 rounded-lg border-2 border-red-300 ${
      darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
    }`}>
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-bold">OAuth Redirect URI Fix</h3>
      </div>
      
      {/* Current Environment Info */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">🔍 Current Environment:</h4>
        <div className="space-y-1 text-sm font-mono">
          <div>URL: {debugInfo?.currentOrigin}</div>
          <div>Port: {debugInfo?.currentPort}</div>
          <div>Dev Server: {debugInfo?.devServer}</div>
          <div>Protocol: {debugInfo?.protocol}</div>
        </div>
      </div>

      {/* Client ID Status */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">🔑 Google Client ID:</h4>
        {clientId ? (
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm font-mono">{clientId.substring(0, 30)}...</span>
          </div>
        ) : (
          <div className="flex items-center">
            <XCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm">Not configured - add to .env.local</span>
          </div>
        )}
      </div>

      {/* The Exact Redirect URI */}
      <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded border">
        <h4 className="font-semibold mb-2">✅ ADD THIS EXACT URI TO GOOGLE CLOUD CONSOLE:</h4>
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border">
          <code className="text-sm font-bold text-green-600 dark:text-green-400">
            {correctRedirectUri}
          </code>
          <button
            onClick={() => copyToClipboard(correctRedirectUri)}
            className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Copy redirect URI"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step-by-step instructions */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">📋 Exact Steps to Fix:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            Go to{' '}
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Google Cloud Console Credentials
            </a>
          </li>
          <li>Click your <strong>OAuth 2.0 Client ID</strong></li>
          <li>Scroll down to <strong>"Authorized redirect URIs"</strong></li>
          <li>Click <strong>"+ ADD URI"</strong></li>
          <li>Paste exactly: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{correctRedirectUri}</code></li>
          <li>Click <strong>"SAVE"</strong></li>
          <li>Wait 1-2 minutes for changes to propagate</li>
          <li>Try connecting to Google Drive again</li>
        </ol>
      </div>

      {/* Test URL */}
      {oauthUrl && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">🧪 Test OAuth URL:</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(oauthUrl, '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Test OAuth Flow
            </button>
            <button
              onClick={() => copyToClipboard(oauthUrl)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Copy URL
            </button>
          </div>
          <p className="text-xs mt-2 opacity-75">
            This will open Google's OAuth page. If it works, your redirect URI is configured correctly.
          </p>
        </div>
      )}

      {/* Environment setup if no client ID */}
      {!clientId && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h4 className="font-semibold mb-2">⚙️ Environment Setup:</h4>
          <p className="text-sm mb-2">Create <code>.env.local</code> file with:</p>
          <pre className="text-xs bg-black text-green-400 p-2 rounded">
{`# .env.local
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here`}
          </pre>
          <p className="text-xs mt-2">Then restart your dev server: <code>npm run dev</code></p>
        </div>
      )}

      {/* Common redirect URIs for reference */}
      <details className="mt-4">
        <summary className="cursor-pointer font-semibold">📝 Common Redirect URIs (for reference)</summary>
        <div className="mt-2 text-xs space-y-1">
          <div>Vite (port 5173): <code>http://localhost:5173/cloud/connected</code></div>
          <div>Create React App (port 3000): <code>http://localhost:3000/cloud/connected</code></div>
          <div>Backend callback: <code>http://localhost:8000/api/cloud/callback/google_drive</code></div>
        </div>
      </details>
    </div>
  );
};

export default OAuthRedirectDebugger;