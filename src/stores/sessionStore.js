// src/stores/sessionStore.js - Completed Google Drive focused version

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL, checkBackendAvailability } from '../config';

// Google Drive specific endpoints
const GOOGLE_DRIVE_ENDPOINTS = {
  PROVIDERS: `${API_BASE_URL}/api/google-drive/providers`,
  CONNECT: `${API_BASE_URL}/api/google-drive/connect`,
  STATUS: `${API_BASE_URL}/api/google-drive/status`,
  TEST: `${API_BASE_URL}/api/google-drive/test`,
  SAVE: `${API_BASE_URL}/api/google-drive/save`,
  LIST: `${API_BASE_URL}/api/google-drive/list`,
  LOAD: (fileId) => `${API_BASE_URL}/api/google-drive/load/${fileId}`,
  DELETE: (fileId) => `${API_BASE_URL}/api/google-drive/delete/${fileId}`,
  DISCONNECT: `${API_BASE_URL}/api/google-drive/disconnect`,
  DEBUG: `${API_BASE_URL}/api/google-drive/debug`
};

let globalInitialized = false;

const useSessionStore = create(
  persist(
    (set, get) => ({
      // ================== SIMPLIFIED STATE ==================
      sessionId: null,
      sessionToken: null,
      isSessionActive: false,
      
      // Google Drive connection state - SIMPLIFIED
      connectedProviders: [],
      googleDriveConnected: false,
      googleDriveStatus: null,
      
      // Local storage
      localCVs: [],
      
      // Capabilities - for backward compatibility
      capabilities: {
        canBuildLocally: true,
        canSaveLocally: true,
        canSaveToCloud: false,
        canAccessSavedCVs: false,
        canSyncAcrossDevices: false
      },
      
      // UI state
      loading: false,
      error: null,
      showCloudSetup: false,
      initializing: false,
      backendAvailable: false,

      // ================== GOOGLE DRIVE CONNECTION ==================
      
      // Connect to Google Drive (simplified)
      connectToCloudProvider: async (provider) => {
        if (provider !== 'google_drive') {
          throw new Error('Only Google Drive is currently supported');
        }
        
        console.log('🔗 Connecting to Google Drive...');
        set({ loading: true, error: null });
        
        try {
          // Ensure we have a session
          await get().createOrRestoreSession();
          
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.CONNECT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().sessionToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('🔗 Got Google Drive OAuth URL, redirecting...');
            
            // Store simple context for return
            localStorage.setItem('oauth_return_context', JSON.stringify({
              provider: 'google_drive',
              action: 'connect_only',
              timestamp: Date.now()
            }));
            
            // Redirect to OAuth
            window.location.href = data.auth_url;
            return true;
          } else {
            const errorText = await response.text();
            throw new Error(`Connection failed: ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive connection error:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Handle successful OAuth return for Google Drive
      handleOAuthReturn: async (provider) => {
        if (provider !== 'google_drive') {
          throw new Error('Only Google Drive is currently supported');
        }
        
        console.log('✅ Handling Google Drive OAuth return');
        
        try {
          set({ loading: true });
          
          // Give backend a moment to process the OAuth
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check Google Drive status
          const status = await get().checkGoogleDriveStatus();
          
          if (status.connected) {
            // Update state with successful connection
            set({
              connectedProviders: ['google_drive'],
              googleDriveConnected: true,
              googleDriveStatus: status,
              capabilities: {
                canBuildLocally: true,
                canSaveLocally: true,
                canSaveToCloud: true,
                canAccessSavedCVs: true,
                canSyncAcrossDevices: true
              },
              loading: false,
              error: null
            });
            
            // Clear OAuth context
            localStorage.removeItem('oauth_return_context');
            
            console.log('✅ Google Drive connection verified and saved');
            return { 
              success: true, 
              provider: 'google_drive',
              message: 'Successfully connected to Google Drive',
              email: status.email
            };
          } else {
            throw new Error('Google Drive connection verification failed');
          }
          
        } catch (error) {
          console.error('❌ Google Drive OAuth return handling failed:', error);
          set({ 
            loading: false, 
            error: `Failed to verify Google Drive connection: ${error.message}` 
          });
          return { success: false, error: error.message };
        }
      },

      // Check Google Drive status
      checkGoogleDriveStatus: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          return { connected: false, provider: 'google_drive' };
        }

        try {
          console.log('🔍 Checking Google Drive status...');
          
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.STATUS, {
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const status = await response.json();
            console.log('🔍 Google Drive status:', status);
            return status;
          } else {
            console.error('❌ Google Drive status check failed:', response.status);
            return { connected: false, provider: 'google_drive' };
          }
        } catch (error) {
          console.error('❌ Google Drive status check error:', error);
          return { connected: false, provider: 'google_drive' };
        }
      },

      // Test Google Drive connection
      testGoogleDriveConnection: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('🧪 Testing Google Drive connection...');
          
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.TEST, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('🧪 Google Drive test result:', result);
            return result;
          } else {
            const errorText = await response.text();
            throw new Error(`Test failed: ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive test failed:', error);
          throw error;
        }
      },

      // ================== GOOGLE DRIVE CV OPERATIONS ==================
      
      // Save CV to Google Drive
      // Save CV to Google Drive - FIXED VERSION
saveToConnectedCloud: async (cvData, provider = 'google_drive') => {
  if (provider !== 'google_drive') {
    return {
      success: false,
      error: 'Only Google Drive is currently supported',
      needsConnection: true
    };
  }
  
  console.log('💾 Saving to Google Drive...');
  
  const { connectedProviders, sessionToken } = get();
  
  if (!connectedProviders.includes('google_drive')) {
    return {
      success: false,
      error: 'Google Drive not connected. Please connect first.',
      needsConnection: true
    };
  }

  if (!sessionToken) {
    return { 
      success: false, 
      error: 'Session expired. Please reconnect.' 
    };
  }

  try {
    set({ loading: true, error: null });
    
    console.log('💾 Sending CV to Google Drive API...');

   const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 30 second timeout

    const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.SAVE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(cvData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    console.log('📊 Google Drive save response:', response.status, responseText);

    if (response.ok) {
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError);
        throw new Error('Invalid response from server');
      }
      
      console.log('✅ Google Drive save successful:', result);
      
      set({ loading: false });
      
      return {
        success: true,
        provider: 'google_drive',
        fileId: result.file_id,
        message: result.message
      };
    } else {
      console.error('❌ Google Drive save failed:', response.status, responseText);
      
      set({ loading: false });
      
      let errorMessage = `Save failed: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
    
  } catch (error) {
    console.error('❌ Google Drive save error:', error);
    set({ loading: false, error: error.message });
    return { 
      success: false, 
      error: `Network error: ${error.message}` 
    };
  }
},

      // List CVs from Google Drive
      listGoogleDriveCVs: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('📋 Listing CVs from Google Drive...');
          
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.LIST, {
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('📋 Google Drive CVs:', result);
            return result.files;
          } else {
            const errorText = await response.text();
            throw new Error(`List failed: ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive list failed:', error);
          throw error;
        }
      },

      // Load CV from Google Drive
      loadGoogleDriveCV: async (fileId) => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('📥 Loading CV from Google Drive:', fileId);
          
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.LOAD(fileId), {
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('📥 Google Drive CV loaded:', result);
            return result.cv_data;
          } else {
            const errorText = await response.text();
            throw new Error(`Load failed: ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive load failed:', error);
          throw error;
        }
      },

      // Delete CV from Google Drive
      deleteGoogleDriveCV: async (fileId) => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('🗑️ Deleting CV from Google Drive:', fileId);
          
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.DELETE(fileId), {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Google Drive delete successful:', result);
            return result;
          } else {
            const errorText = await response.text();
            throw new Error(`Delete failed: ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive delete failed:', error);
          throw error;
        }
      },

      // Disconnect Google Drive
      disconnectGoogleDrive: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('🔓 Disconnecting Google Drive...');
          
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.DISCONNECT, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Google Drive disconnected:', result);
            
            // Update state
            set({
              connectedProviders: [],
              googleDriveConnected: false,
              googleDriveStatus: null,
              capabilities: {
                canBuildLocally: true,
                canSaveLocally: true,
                canSaveToCloud: false,
                canAccessSavedCVs: get().localCVs.length > 0,
                canSyncAcrossDevices: false
              }
            });
            
            return result;
          } else {
            const errorText = await response.text();
            throw new Error(`Disconnect failed: ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive disconnect failed:', error);
          throw error;
        }
      },

      // Get debug info
      getGoogleDriveDebugInfo: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('🐛 Getting Google Drive debug info...');
          
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.DEBUG, {
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('🐛 Google Drive debug info:', result);
            return result;
          } else {
            const errorText = await response.text();
            throw new Error(`Debug failed: ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive debug failed:', error);
          throw error;
        }
      },

      // ================== EXISTING HELPER METHODS ==================
      
      createOrRestoreSession: async () => {
        if (get().sessionToken) {
          return { success: true, restored: true };
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });

          if (response.ok) {
            const data = await response.json();
            set({
              sessionId: data.session_id,
              sessionToken: data.token,
              isSessionActive: true
            });
            return { success: true, restored: false };
          }
          return { success: false };
        } catch (error) {
          console.error('Session creation failed:', error);
          return { success: false };
        }
      },
      
      // Local storage methods (keep existing)
      saveLocally: (cvData) => {
        try {
          if (!cvData) {
            return { success: false, error: "No CV data to save" };
          }
          
          const localCVs = get().loadLocalCVs();
          const cvId = cvData.id || `local_${Date.now()}`;
          const cvWithMeta = {
            ...cvData,
            id: cvId,
            storageType: 'local',
            lastModified: new Date().toISOString(),
            createdAt: cvData.createdAt || new Date().toISOString()
          };
          
          const existingIndex = localCVs.findIndex(cv => cv.id === cvId);
          if (existingIndex >= 0) {
            localCVs[existingIndex] = cvWithMeta;
          } else {
            localCVs.push(cvWithMeta);
          }

          localStorage.setItem('local_cvs', JSON.stringify(localCVs));
          
          const updatedLocalCVs = [...localCVs];
          
          set({ 
            localCVs: updatedLocalCVs,
            capabilities: {
              ...get().capabilities,
              canAccessSavedCVs: true
            }
          });
          
          return { 
            success: true, 
            cv: cvWithMeta,
            message: "CV saved locally"
          };
          
        } catch (error) {
          console.error('❌ Local save error:', error);
          return { 
            success: false, 
            error: error.message || "Failed to save locally" 
          };
        }
      },

      loadLocalCVs: () => {
        try {
          const stored = localStorage.getItem('local_cvs');
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      },

      initialize: async () => {
        if (globalInitialized) {
          return true;
        }
        
        console.log('🔧 Initializing session store...');
        globalInitialized = true;
        set({ loading: true, initializing: true });
        
        try {
          const backendAvailable = await checkBackendAvailability();
          const localCVs = get().loadLocalCVs();
          
          let connectedProviders = [];
          let googleDriveConnected = false;
          let googleDriveStatus = null;
          
          if (backendAvailable) {
            try {
              const sessionResult = await get().createOrRestoreSession();
              
              if (sessionResult.success) {
                const status = await get().checkGoogleDriveStatus();
                if (status.connected) {
                  connectedProviders = ['google_drive'];
                  googleDriveConnected = true;
                  googleDriveStatus = status;
                }
              }
            } catch (error) {
              console.warn('Google Drive initialization failed:', error.message);
            }
          }
          
          set({
            backendAvailable,
            localCVs,
            connectedProviders,
            googleDriveConnected,
            googleDriveStatus,
            capabilities: {
              canBuildLocally: true,
              canSaveLocally: true,
              canSaveToCloud: googleDriveConnected,
              canAccessSavedCVs: localCVs.length > 0 || googleDriveConnected,
              canSyncAcrossDevices: googleDriveConnected
            },
            loading: false,
            initializing: false,
            error: null
          });
          
          console.log('✅ Session store initialized successfully');
          return true;
          
        } catch (error) {
          console.error('❌ Initialization error:', error);
          set({
            backendAvailable: false,
            localCVs: get().loadLocalCVs(),
            connectedProviders: [],
            googleDriveConnected: false,
            googleDriveStatus: null,
            loading: false,
            initializing: false,
            error: 'Running in local-only mode'
          });
          return false;
        }
      },

      // UI helpers
      clearError: () => set({ error: null }),
      setShowCloudSetup: (show) => set({ showCloudSetup: show }),
      
      // Capabilities
      canSaveToCloud: () => get().googleDriveConnected,
      hasCloudConnection: () => get().googleDriveConnected
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionToken: state.sessionToken,
        connectedProviders: state.connectedProviders,
        googleDriveConnected: state.googleDriveConnected,
        googleDriveStatus: state.googleDriveStatus,
        localCVs: state.localCVs
      })
    }
  )
);

export default useSessionStore;