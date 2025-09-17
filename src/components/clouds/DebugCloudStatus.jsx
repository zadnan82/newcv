// src/components/debug/DebugCloudStatus.jsx - For debugging the status issue
import React, { useState } from 'react';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import { CLOUD_ENDPOINTS } from '../../config';

const DebugCloudStatus = ({ darkMode }) => {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRawResponse, setShowRawResponse] = useState(false);
  
  const { sessionToken, connectedProviders } = useSessionStore();

  const checkStatusDirect = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 DEBUG: Direct status check...');
      console.log('🔍 DEBUG: Using token:', sessionToken ? sessionToken.substring(0, 20) + '...' : 'NONE');
      
      const response = await fetch(CLOUD_ENDPOINTS.STATUS, {
        headers: { 
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔍 DEBUG: Response status:', response.status);
      console.log('🔍 DEBUG: Response headers:', [...response.headers.entries()]);
      
      const text = await response.text();
      console.log('🔍 DEBUG: Raw response text:', text);
      
      let parsedData = null;
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
      
      setDebugData({
        status: response.status,
        ok: response.ok,
        headers: [...response.headers.entries()],
        rawText: text,
        parsedData,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('🔍 DEBUG: Status check error:', error);
      setDebugData({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 rounded-lg ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Cloud Status Debug
        </h2>
        <button
          onClick={checkStatusDirect}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Check Status
        </button>
      </div>

      {/* Current Store State */}
      <div className={`mb-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Current Store State
        </h3>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <div><strong>Has Session Token:</strong> {sessionToken ? 'Yes' : 'No'}</div>
          <div><strong>Connected Providers:</strong> [{connectedProviders.join(', ') || 'None'}]</div>
          <div><strong>Provider Count:</strong> {connectedProviders.length}</div>
          {sessionToken && (
            <div><strong>Token Preview:</strong> {sessionToken.substring(0, 30)}...</div>
          )}
        </div>
      </div>

      {/* API Endpoint Info */}
      <div className={`mb-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          API Endpoint
        </h3>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <div><strong>URL:</strong> {CLOUD_ENDPOINTS.STATUS}</div>
        </div>
      </div>

      {/* Debug Results */}
      {debugData && (
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Debug Results
            </h3>
            <button
              onClick={() => setShowRawResponse(!showRawResponse)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              {showRawResponse ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showRawResponse ? 'Hide' : 'Show'} Raw Response
            </button>
          </div>
          
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-2`}>
            <div><strong>Timestamp:</strong> {debugData.timestamp}</div>
            
            {debugData.error ? (
              <div className="text-red-500">
                <strong>Error:</strong> {debugData.error}
              </div>
            ) : (
              <>
                <div>
                  <strong>HTTP Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    debugData.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {debugData.status}
                  </span>
                </div>
                
                <div><strong>Response OK:</strong> {debugData.ok ? 'Yes' : 'No'}</div>
                
                {debugData.parsedData && (
                  <div>
                    <strong>Parsed Data:</strong>
                    <pre className={`mt-2 p-3 rounded text-xs overflow-auto ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {JSON.stringify(debugData.parsedData, null, 2)}
                    </pre>
                  </div>
                )}

                {showRawResponse && (
                  <div>
                    <strong>Raw Response:</strong>
                    <pre className={`mt-2 p-3 rounded text-xs overflow-auto ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {debugData.rawText}
                    </pre>
                  </div>
                )}

                <div>
                  <strong>Headers:</strong>
                  <pre className={`mt-2 p-3 rounded text-xs overflow-auto ${
                    darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {debugData.headers.map(([key, value]) => `${key}: ${value}`).join('\n')}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugCloudStatus;