// 1. First, update the sessionStore to remove auto-save complexity
// src/stores/sessionStore.js - Simplified version

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL, CLOUD_ENDPOINTS, checkBackendAvailability } from '../config';

let globalInitialized = false;

const useSessionStore = create(
  persist(
    (set, get) => ({
      // ================== SIMPLIFIED STATE ==================
      sessionId: null,
      sessionToken: null,
      isSessionActive: false,
      
      // Cloud connection state - SIMPLIFIED
      connectedProviders: [],
      cloudStatus: {},
      
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

      // ================== STEP 1: SIMPLE CLOUD CONNECTION ==================
      
      // Connect to cloud provider (no auto-save, just connect)
      connectToCloudProvider: async (provider) => {
        console.log('🔗 Simple cloud connection to:', provider);
        set({ loading: true, error: null });
        
        try {
          // Ensure we have a session
          await get().createOrRestoreSession();
          
          const response = await fetch(CLOUD_ENDPOINTS.CONNECT(provider), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().sessionToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('🔗 Got OAuth URL, redirecting...');
            
            // Store simple context for return
            localStorage.setItem('oauth_return_context', JSON.stringify({
              provider,
              action: 'connect_only',
              timestamp: Date.now()
            }));
            
            // Redirect to OAuth
            window.location.href = data.auth_url;
            return true;
          } else {
            throw new Error('Failed to initiate OAuth connection');
          }
        } catch (error) {
          console.error('❌ Connection error:', error);
          set({ error: error.message, loading: false });
          return false;
        }
      },

      // Handle successful OAuth return
      // Update handleOAuthReturn in sessionStore.js
handleOAuthReturn: async (provider) => {
  console.log('✅ Handling OAuth return for:', provider);
  
  try {
    set({ loading: true });
    
    // Give backend a moment to process the OAuth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify the connection by checking cloud status
    const cloudData = await get().checkCloudConnections();
    
    console.log('🔍 Connection verification:', {
      providers: cloudData.providers,
      isConnected: cloudData.providers.includes(provider),
      allStatus: cloudData.status
    });
    
    if (cloudData.providers.includes(provider)) {
      // Update state with successful connection
      set({
        connectedProviders: cloudData.providers,
        cloudStatus: cloudData.status,
        capabilities: {
          canBuildLocally: true,
          canSaveLocally: true,
          canSaveToCloud: cloudData.providers.length > 0,
          canAccessSavedCVs: true,
          canSyncAcrossDevices: cloudData.providers.length > 0
        },
        loading: false,
        error: null
      });
      
      // Clear OAuth context
      localStorage.removeItem('oauth_return_context');
      
      console.log('✅ Cloud connection verified and saved');
      return { 
        success: true, 
        provider,
        message: `Successfully connected to ${provider.replace('_', ' ')}` 
      };
    } else {
      // Check if we have any status info for this provider
      const providerStatus = cloudData.status[provider];
      if (providerStatus && providerStatus.error) {
        throw new Error(`Provider error: ${providerStatus.error}`);
      }
      throw new Error('Connection verification failed - provider not in connected list');
    }
    
  } catch (error) {
    console.error('❌ OAuth return handling failed:', error);
    set({ 
      loading: false, 
      error: `Failed to verify ${provider} connection: ${error.message}` 
    });
    return { success: false, error: error.message };
  }
},

      // ================== STEP 2: SIMPLE SAVE TO CLOUD ==================
      
      // Save CV to connected cloud (simple, direct)
      saveToConnectedCloud: async (cvData, provider = null) => {
        console.log('💾 Saving to connected cloud...');
        
        const { connectedProviders, sessionToken } = get();
        
        if (!connectedProviders.length) {
          return {
            success: false,
            error: 'No cloud providers connected. Please connect a provider first.',
            needsConnection: true
          };
        }
        
        const targetProvider = provider || connectedProviders[0];
        console.log('💾 Using provider:', targetProvider);

        if (!sessionToken) {
          return { 
            success: false, 
            error: 'Session expired. Please reconnect to cloud storage.' 
          };
        }

        try {
          set({ loading: true });
          
          // Format CV data for backend
          const formattedCV = {
            title: cvData.title || 'My Resume',
            template: cvData.template || 'stockholm',
            personal_info: cvData.personal_info || {},
            experiences: cvData.experiences || [],
            educations: cvData.educations || [],
            skills: cvData.skills || [],
            languages: cvData.languages || [],
            referrals: cvData.referrals || [],
            custom_sections: cvData.custom_sections || [],
            extracurriculars: cvData.extracurriculars || [],
            hobbies: cvData.hobbies || [],
            courses: cvData.courses || [],
            internships: cvData.internships || [],
            photos: cvData.photos || { photolink: null },
            customization: cvData.customization || {
              template: "stockholm",
              accent_color: "#1a5276",
              font_family: "Helvetica, Arial, sans-serif",
              line_spacing: 1.5,
              headings_uppercase: false,
              hide_skill_level: false
            }
          };

          const url = `${API_BASE_URL}/api/resume?provider=${targetProvider}`;
          console.log('💾 Saving to URL:', url);

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(formattedCV),
          });

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Cloud save successful:', result);
            
            set({ loading: false });
            
            return {
              success: true,
              provider: targetProvider,
              fileId: result.id,
              message: `CV "${cvData.title}" saved to ${targetProvider.replace('_', ' ')}`
            };
          } else {
            const errorText = await response.text();
            console.error('❌ Save failed:', response.status, errorText);
            
            set({ loading: false });
            
            return { 
              success: false, 
              error: `Save failed: ${errorText}` 
            };
          }
          
        } catch (error) {
          console.error('❌ Save error:', error);
          set({ loading: false });
          return { 
            success: false, 
            error: `Network error: ${error.message}` 
          };
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
      
      // Update the checkCloudConnections method in sessionStore.js
checkCloudConnections: async () => {
  const { sessionToken } = get();
  
  if (!sessionToken) {
    return { providers: [], status: {} };
  }

  try {
    const response = await fetch(CLOUD_ENDPOINTS.STATUS, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });

    if (response.ok) {
      const statusData = await response.json();
      
      console.log('🔍 Raw cloud status response:', statusData);
      
      // Handle different response formats
      let connectedProviders = [];
      let status = {};
      
      if (Array.isArray(statusData)) {
        // Array format: [{provider: 'google_drive', connected: true, ...}, ...]
        connectedProviders = statusData
          .filter(provider => provider.connected === true)
          .map(provider => provider.provider);
        
        statusData.forEach(provider => {
          status[provider.provider] = provider;
        });
      } else if (typeof statusData === 'object') {
        // Object format: {google_drive: {connected: true, ...}, ...}
        Object.entries(statusData).forEach(([provider, data]) => {
          if (data.connected === true) {
            connectedProviders.push(provider);
            status[provider] = data;
          }
        });
      }

      console.log('🔍 Processed cloud connections:', {
        connectedProviders,
        status
      });

      return { providers: connectedProviders, status };
    } else {
      console.error('❌ Cloud status check failed:', response.status);
      return { providers: [], status: {} };
    }
  } catch (error) {
    console.error('❌ Cloud status check error:', error);
    return { providers: [], status: {} };
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
          let cloudStatus = {};
          
          if (backendAvailable) {
            try {
              const sessionResult = await get().createOrRestoreSession();
              
              if (sessionResult.success) {
                const cloudData = await get().checkCloudConnections();
                connectedProviders = cloudData.providers;
                cloudStatus = cloudData.status;
              }
            } catch (error) {
              console.warn('Cloud initialization failed:', error.message);
            }
          }
          
          set({
            backendAvailable,
            localCVs,
            connectedProviders,
            cloudStatus,
            capabilities: {
              canBuildLocally: true,
              canSaveLocally: true,
              canSaveToCloud: connectedProviders.length > 0,
              canAccessSavedCVs: localCVs.length > 0 || connectedProviders.length > 0,
              canSyncAcrossDevices: connectedProviders.length > 0
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
            cloudStatus: {},
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
      canSaveToCloud: () => get().connectedProviders.length > 0,
      hasCloudConnection: () => get().connectedProviders.length > 0
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionToken: state.sessionToken,
        connectedProviders: state.connectedProviders,
        cloudStatus: state.cloudStatus,
        localCVs: state.localCVs
      })
    }
  )
);

export default useSessionStore;