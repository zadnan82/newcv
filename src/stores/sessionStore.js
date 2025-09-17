// src/stores/sessionStore.js - Add missing functions and fix auto-save
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL, CLOUD_ENDPOINTS, checkBackendAvailability } from '../config';

// Global flag to prevent multiple initializations across the entire app
let globalInitialized = false;

const useSessionStore = create(
  persist(
    (set, get) => ({
      // ================== USER EXPERIENCE STATE ==================
      userState: 'browsing',
      
      // Storage capabilities
      capabilities: {
        canBuildLocally: true,
        canSaveLocally: true,
        canSaveToCloud: false,
        canAccessSavedCVs: false,
        canSyncAcrossDevices: false
      },

      // Session data
      sessionId: null,
      sessionToken: null,
      isSessionActive: false,
      
      // Cloud providers
      connectedProviders: [],
      cloudStatus: {},
      
      // Local storage status
      localCVs: [],
      
      // UI state
      loading: false,
      error: null,
      showCloudUpgradeModal: false,
      initializing: false,
      
      // Backend availability
      backendAvailable: false,
      
      // Persist pending save data across OAuth redirects
      pendingSaveData: null,
      pendingSaveContext: null,

      // ================== MISSING FUNCTION FIX ==================
      getAvailableProviders: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/cloud/providers`);
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Loaded available providers:', data);
            return data;
          } else {
            console.error('❌ Failed to load providers:', response.status);
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          console.error('❌ getAvailableProviders error:', error);
          // Return fallback providers
          return {
            providers: [
              {
                id: 'google_drive',
                name: 'Google Drive',
                description: 'Store your CVs in Google Drive',
                supported_features: ['read', 'write', 'delete', 'folders']
              },
              {
                id: 'onedrive',
                name: 'Microsoft OneDrive', 
                description: 'Store your CVs in OneDrive',
                supported_features: ['read', 'write', 'delete', 'folders']
              },
              {
                id: 'dropbox',
                name: 'Dropbox',
                description: 'Store your CVs in Dropbox', 
                supported_features: ['read', 'write', 'delete', 'folders']
              },
              {
                id: 'box',
                name: 'Box',
                description: 'Store your CVs in Box',
                supported_features: ['read', 'write', 'delete', 'folders']
              }
            ]
          };
        }
      },

      // ================== SAVE FLOW FIXES ==================
      
      initiateSave: (cvData) => {
        const { capabilities } = get();
        
        console.log('💾 initiateSave called with:', cvData?.title);
        
        // Store the data AND context for OAuth flow
        const saveContext = {
          timestamp: Date.now(),
          returnUrl: window.location.pathname,
          cvTitle: cvData?.title,
          action: 'save'
        };
        
        set({ 
          showCloudUpgradeModal: true,
          pendingSaveData: cvData,
          pendingSaveContext: saveContext
        });
        
        // Also store in localStorage as backup
        try {
          localStorage.setItem('pending_save_data', JSON.stringify(cvData));
          localStorage.setItem('pending_save_context', JSON.stringify(saveContext));
          console.log('💾 Stored pending save data in localStorage as backup');
        } catch (e) {
          console.warn('Failed to backup save data to localStorage:', e);
        }
        
        return { cvData, options: { local: { available: true }, cloud: { available: capabilities.canSaveToCloud } } };
      },

      connectCloudProvider: async (provider) => {
        set({ loading: true });
        
        try {
          console.log('🔗 Connecting to cloud provider:', provider);
          console.log('🔗 Pending save data exists:', !!get().pendingSaveData);
          
          // Ensure session exists
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
            
            // Store additional context before redirect
            const redirectContext = {
              provider,
              hasPendingSave: !!get().pendingSaveData,
              cvTitle: get().pendingSaveData?.title,
              timestamp: Date.now()
            };
            
            try {
              localStorage.setItem('oauth_redirect_context', JSON.stringify(redirectContext));
              console.log('🔗 Stored OAuth context for return');
            } catch (e) {
              console.warn('Failed to store OAuth context:', e);
            }
            
            console.log('🔗 Redirecting to OAuth URL:', data.auth_url);
            window.location.href = data.auth_url;
            return true;
          }
          throw new Error('Failed to initiate cloud connection');
        } catch (error) {
          console.error('❌ Cloud connection error:', error);
          set({ error: error.message, loading: false });
          return false;
        }
      },

      // ================== FIXED ONCLOUDCONNECTED ==================
      onCloudConnected: async (provider) => {
  try {
    console.log('✅ Cloud connected, checking for pending save...');
    
    // CRITICAL FIX: Update cloud status FIRST, then check pending save
    console.log('🔄 Refreshing cloud connection status...');
    const cloudData = await get().checkCloudConnections();
    
    console.log('🔍 Cloud data received:', {
      providers: cloudData.providers,
      providerCount: cloudData.providers.length,
      status: Object.keys(cloudData.status)
    });
    
    // CRITICAL: Update the store state BEFORE attempting to save
    set({
      connectedProviders: cloudData.providers,
      cloudStatus: cloudData.status,
      capabilities: {
        ...get().capabilities,
        canSaveToCloud: cloudData.providers.length > 0,
        canSyncAcrossDevices: cloudData.providers.length > 0,
        canAccessSavedCVs: true
      },
      userState: cloudData.providers.length > 0 ? 'cloud_available' : get().userState,
      loading: false
    });

    console.log('✅ Store updated with cloud providers:', cloudData.providers);

    // Now check for pending save with the updated state
    const pendingData = get().pendingSaveData || get().tryRestorePendingSaveData();
    
    if (pendingData) {
      console.log('💾 Found pending save data, auto-saving to cloud...');
      console.log('💾 Pending data structure:', {
        title: pendingData.title,
        hasPersonalInfo: !!pendingData.personal_info,
        hasEducations: Array.isArray(pendingData.educations),
        hasExperiences: Array.isArray(pendingData.experiences)
      });
      
      // CRITICAL: Get the updated connectedProviders from the store
      const { connectedProviders } = get();
      
      console.log('💾 Current connected providers for save:', connectedProviders);
      
      if (connectedProviders.length === 0) {
        console.error('❌ Still no connected providers after update!');
        return { success: false, autoSaved: false, error: 'Provider connection failed' };
      }
      
      // Auto-save to the newly connected cloud provider
      const saveResult = await get().saveToCloud(pendingData, provider);
      
      console.log('💾 Auto-save result:', saveResult);
      
      if (saveResult.success) {
        console.log('✅ Auto-save to cloud successful!');
        
        // Clear pending data
        get().clearPendingSaveData();
        
        return { success: true, autoSaved: true, provider, fileId: saveResult.fileId };
      } else {
        console.error('❌ Auto-save failed:', saveResult.error);
        return { success: true, autoSaved: false, error: saveResult.error };
      }
    } else {
      console.log('ℹ️ No pending save data found');
      return { success: true, autoSaved: false };
    }
    
  } catch (error) {
    console.error('❌ Post-connection error:', error);
    return { success: false, error: error.message };
  }
},

      // Helper: Try to restore pending save data from localStorage
      tryRestorePendingSaveData: () => {
        try {
          const storedData = localStorage.getItem('pending_save_data');
          const storedContext = localStorage.getItem('pending_save_context');
          
          if (storedData && storedContext) {
            const data = JSON.parse(storedData);
            const context = JSON.parse(storedContext);
            
            // Check if data is recent (within last 30 minutes)
            const isRecent = (Date.now() - context.timestamp) < 30 * 60 * 1000;
            
            if (isRecent) {
              console.log('🔄 Restored pending save data from localStorage');
              set({ 
                pendingSaveData: data, 
                pendingSaveContext: context 
              });
              return data;
            } else {
              console.log('⏰ Pending save data too old, clearing...');
              get().clearPendingSaveData();
            }
          }
        } catch (e) {
          console.error('Failed to restore pending save data:', e);
        }
        return null;
      },

      // Helper: Clear all pending save data
      clearPendingSaveData: () => {
        set({ 
          pendingSaveData: null, 
          pendingSaveContext: null,
          showCloudUpgradeModal: false 
        });
        
        // Also clear from localStorage
        try {
          localStorage.removeItem('pending_save_data');
          localStorage.removeItem('pending_save_context');
          localStorage.removeItem('oauth_redirect_context');
        } catch (e) {
          console.warn('Failed to clear localStorage:', e);
        }
      },

      // ================== IMPROVED SAVETOCLOUD ==================
      saveToCloud: async (cvData, provider = null) => {
        console.log('🌐 saveToCloud called with:', {
          cvData: !!cvData,
          provider,
          title: cvData?.title
        });

        const { connectedProviders, sessionToken } = get();

        if (!connectedProviders.length) {
          console.error('❌ No connected providers');
          return {
            success: false,
            needsCloudSetup: true,
            error: 'No cloud providers connected',
            availableProviders: ['google_drive', 'onedrive', 'dropbox', 'box'],
          };
        }

        const targetProvider = provider || connectedProviders[0];
        console.log('🌐 Using provider:', targetProvider);

        if (!sessionToken) {
          console.error('❌ No session token for cloud save');
          return { 
            success: false, 
            error: "No session token. Please reconnect to cloud storage." 
          };
        }

        if (!cvData) {
          console.error('❌ No CV data to save');
          return {
            success: false,
            error: "No CV data provided to save"
          };
        }

        try {
          // Ensure CV data has proper structure for backend
          const formattedCVData = {
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

          console.log('🌐 Formatted CV data:', {
            title: formattedCVData.title,
            template: formattedCVData.template,
            hasPersonalInfo: Object.keys(formattedCVData.personal_info).length > 0,
            experienceCount: formattedCVData.experiences.length,
            educationCount: formattedCVData.educations.length
          });

          const url = `${API_BASE_URL}/api/resume?provider=${targetProvider}`;
          console.log('🌐 Saving to URL:', url);

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(formattedCVData),
          });

          console.log('🌐 Response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Cloud save HTTP error:', response.status, errorText);
            
            if (response.status === 403) {
              return { 
                success: false, 
                error: "Cloud connection expired. Please reconnect.",
                needsReconnect: true 
              };
            }
            
            return { 
              success: false, 
              error: `Save failed (${response.status}): ${errorText}` 
            };
          }

          const result = await response.json();
          console.log('✅ Cloud save successful:', result);

          return {
            success: true,
            provider: targetProvider,
            message: `CV saved to ${targetProvider.replace('_', ' ')}`,
            fileId: result.id,
          };
          
        } catch (error) {
          console.error("❌ saveToCloud network error:", error);
          return { 
            success: false, 
            error: `Network error: ${error.message}` 
          };
        }
      },

      // ================== INITIALIZATION ==================
      
      initialize: async () => {
        if (globalInitialized) {
          console.log('🔧 Already globally initialized, skipping...');
          return true;
        }
        
        if (get().initializing || get().loading) {
          console.log('🔧 Initialization already in progress, skipping...');
          return true;
        }
        
        console.log('🔧 Starting sessionStore initialization...');
        globalInitialized = true;
        set({ loading: true, initializing: true });
        
        try {
          const backendAvailable = await Promise.race([
            checkBackendAvailability(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Backend check timeout')), 5000))
          ]).catch(() => false);
          
          console.log(`🔧 Backend available: ${backendAvailable}`);
          
          const localCVs = get().loadLocalCVs();
          console.log(`🔧 Local CVs loaded: ${localCVs.length}`);
          
          const basicCapabilities = {
            canBuildLocally: true,
            canSaveLocally: true,
            canSaveToCloud: false,
            canAccessSavedCVs: localCVs.length > 0,
            canSyncAcrossDevices: false
          };
          
          let cloudStatus = {};
          let connectedProviders = [];
          
          if (backendAvailable) {
            try {
              console.log('🔧 Attempting cloud restoration...');
              const sessionResult = await get().createOrRestoreSession();
              
              if (sessionResult.success) {
                console.log('🔧 Session created/restored');
                const cloudData = await get().checkCloudConnections();
                cloudStatus = cloudData.status;
                connectedProviders = cloudData.providers;
                console.log(`🔧 Cloud providers restored: ${connectedProviders.length}`);
              }
            } catch (error) {
              console.log('🔧 Cloud restoration failed:', error.message);
            }
          }
          
          const finalCapabilities = {
            ...basicCapabilities,
            canSaveToCloud: connectedProviders.length > 0,
            canAccessSavedCVs: localCVs.length > 0 || connectedProviders.length > 0,
            canSyncAcrossDevices: connectedProviders.length > 0
          };
          
          let userState = 'browsing';
          if (connectedProviders.length > 0) {
            userState = 'cloud_available';
          }
          
          set({
            backendAvailable,
            localCVs,
            cloudStatus,
            connectedProviders,
            capabilities: finalCapabilities,
            userState,
            loading: false,
            initializing: false,
            error: null
          });
          
          // Check for pending save data after initialization
          get().tryRestorePendingSaveData();
          
          console.log('✅ SessionStore initialization completed successfully');
          return true;
          
        } catch (error) {
          console.error('❌ SessionStore initialization error:', error);
          
          const localCVs = get().loadLocalCVs();
          
          set({
            backendAvailable: false,
            localCVs,
            cloudStatus: {},
            connectedProviders: [],
            capabilities: {
              canBuildLocally: true,
              canSaveLocally: true,
              canSaveToCloud: false,
              canAccessSavedCVs: localCVs.length > 0,
              canSyncAcrossDevices: false
            },
            userState: 'browsing',
            loading: false,
            initializing: false,
            error: 'Running in local-only mode'
          });
          
          console.log('⚠️ Falling back to local-only mode');
          return false;
        }
      },

      // ================== EXISTING METHODS ==================
      
      loadLocalCVs: () => {
        try {
          const stored = localStorage.getItem('local_cvs');
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      },

      saveLocalCV: (cvData) => {
        try {
          console.log('🔧 saveLocalCV called with:', cvData);
          
          if (!cvData) {
            console.error('❌ No CV data provided to saveLocalCV');
            throw new Error('No CV data provided');
          }
          
          if (typeof Storage === 'undefined') {
            console.error('❌ localStorage not supported');
            throw new Error('Local storage not supported by browser');
          }
          
          const localCVs = get().loadLocalCVs();
          console.log('🔧 Current local CVs:', localCVs);
          
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
            console.log('🔧 Updating existing CV at index:', existingIndex);
          } else {
            localCVs.push(cvWithMeta);
            console.log('🔧 Adding new CV');
          }

          try {
            const serializedData = JSON.stringify(localCVs);
            localStorage.setItem('local_cvs', serializedData);
            console.log('✅ Successfully saved to localStorage');
          } catch (storageError) {
            console.error('❌ localStorage save failed:', storageError);
            
            if (storageError.name === 'QuotaExceededError') {
              throw new Error('Storage quota exceeded. Please clear some space or use cloud storage.');
            }
            
            throw new Error(`Failed to save to local storage: ${storageError.message}`);
          }
          
          set({ 
            localCVs: [...localCVs],
            capabilities: { 
              ...get().capabilities, 
              canAccessSavedCVs: true 
            }
          });
          
          console.log('✅ Local save completed successfully');
          return cvWithMeta;
          
        } catch (error) {
          console.error('❌ saveLocalCV error:', error);
          throw error;
        }
      },

      saveLocally: (cvData) => {
        try {
          console.log('🔧 saveLocally called with cvData:', !!cvData);
          
          if (!cvData) {
            return { 
              success: false, 
              error: "No CV data to save" 
            };
          }
          
          const savedCV = get().saveLocalCV(cvData);
          return { 
            success: true, 
            cv: savedCV,
            message: "CV saved to this device"
          };
        } catch (error) {
          console.error('❌ saveLocally error:', error);
          return { 
            success: false, 
            error: error.message || "Failed to save locally" 
          };
        }
      },

      createOrRestoreSession: async () => {
        if (get().sessionToken) {
          return { success: true, restored: true };
        }

        try {
          const response = await Promise.race([
            fetch(`${API_BASE_URL}/api/session`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Session timeout')), 10000))
          ]);

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
      
      // Replace your checkCloudConnections function with this version for better debugging:

checkCloudConnections: async () => {
  const { sessionToken } = get();
  
  console.log('🔍 Checking cloud connections...', {
    hasToken: !!sessionToken,
    tokenPreview: sessionToken ? sessionToken.substring(0, 20) + '...' : 'none'
  });
  
  if (!sessionToken) {
    console.log('❌ No session token for cloud check');
    return { providers: [], status: {} };
  }

  try {
    console.log('🔍 Making request to:', CLOUD_ENDPOINTS.STATUS);
    
    const response = await Promise.race([
      fetch(CLOUD_ENDPOINTS.STATUS, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Cloud check timeout')), 8000))
    ]);

    console.log('🔍 Response status:', response.status);

    if (response.ok) {
      const statusData = await response.json();
      console.log('🔍 Raw response data:', statusData);
      
      // ENHANCED DEBUG: Log each provider's details
      if (Array.isArray(statusData)) {
        statusData.forEach((provider, index) => {
          console.log(`🔍 Provider ${index}:`, {
            provider: provider.provider,
            connected: provider.connected,
            email: provider.email,
            keys: Object.keys(provider)
          });
        });
      }
      
      // Handle different response formats
      let connected = [];
      if (Array.isArray(statusData)) {
        connected = statusData.filter(s => {
          console.log(`🔍 Checking if ${s.provider} is connected: ${s.connected}`);
          return s.connected === true; // Be explicit about boolean check
        });
      } else if (statusData.providers) {
        connected = statusData.providers.filter(s => s.connected === true);
      } else {
        console.warn('⚠️ Unexpected response format:', statusData);
        return { providers: [], status: {} };
      }
      
      console.log('🔍 Connected providers after filtering:', connected);
      
      const providers = connected.map(p => p.provider);
      const status = {};
      connected.forEach(p => {
        status[p.provider] = p;
      });

      console.log('✅ Processed cloud data:', {
        connectedCount: connected.length,
        providers,
        statusKeys: Object.keys(status)
      });

      return { providers, status };
    } else {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Cloud status check failed:', response.status, errorText);
      return { providers: [], status: {} };
    }
  } catch (error) {
    console.error('❌ Cloud status check error:', error);
    return { providers: [], status: {} };
  }
},

      // Keep other helper methods
      startBuilding: () => {
        set({ userState: 'building' });
        return { 
          canProceed: true, 
          redirect: '/new-resume',
          storageOptions: {
            local: true,
            cloud: get().capabilities.canSaveToCloud
          }
        };
      },

      showCloudUpgrade: () => set({ showCloudUpgradeModal: true }),
      hideCloudUpgrade: () => set({ showCloudUpgradeModal: false }),
      clearError: () => set({ error: null }),

      getUserExperience: () => {
        const { userState, capabilities, connectedProviders, localCVs } = get();
        
        return {
          state: userState,
          capabilities,
          storage: {
            local: localCVs.length,
            cloud: connectedProviders.length,
            canUpgrade: !connectedProviders.length
          },
          suggestions: get().getSuggestions()
        };
      },

      getSuggestions: () => {
        const { capabilities, connectedProviders, localCVs } = get();
        const suggestions = [];

        if (!connectedProviders.length) {
          suggestions.push({
            type: 'cloud_upgrade',
            title: 'Access your CVs anywhere',
            description: 'Connect cloud storage to sync across devices',
            action: 'Connect Cloud Storage'
          });
        }

        if (localCVs.length > 0 && connectedProviders.length > 0) {
          suggestions.push({
            type: 'sync_local',
            title: 'Backup local CVs',
            description: 'Save your local CVs to cloud storage',
            action: 'Sync to Cloud'
          });
        }

        return suggestions;
      },

      getEnvironmentInfo: () => ({
        backendAvailable: get().backendAvailable,
        apiBaseUrl: API_BASE_URL,
        isDevelopment: API_BASE_URL.includes('localhost'),
        connectedProviders: get().connectedProviders.length,
        sessionActive: get().isSessionActive,
        localCVs: get().localCVs.length,
        userState: get().userState,
        capabilities: get().capabilities
      }),

      // Backward compatibility
      checkCloudStatus: () => get().checkCloudConnections(),
      hasConnectedProviders: () => get().connectedProviders.length > 0,
      isAuthenticated: () => get().isSessionActive
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionToken: state.sessionToken,
        connectedProviders: state.connectedProviders,
        cloudStatus: state.cloudStatus,
        localCVs: state.localCVs,
        // Persist pending save data
        pendingSaveData: state.pendingSaveData,
        pendingSaveContext: state.pendingSaveContext
      })
    }
  )
);

export default useSessionStore;