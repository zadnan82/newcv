// src/stores/sessionStore.js - Redesigned for smooth local-first flow
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL, CLOUD_ENDPOINTS, checkBackendAvailability } from '../config';

// Global flag to prevent multiple initializations across the entire app
let globalInitialized = false;

const useSessionStore = create(
  persist(
    (set, get) => ({
      // ================== USER EXPERIENCE STATE ==================
      // Simple states: 'browsing' | 'building' | 'cloud_available' 
      userState: 'browsing',
      
      // Storage capabilities - what user can do right now
      capabilities: {
        canBuildLocally: true,     // Always true
        canSaveLocally: true,      // Always true  
        canSaveToCloud: false,     // True when cloud connected
        canAccessSavedCVs: false,  // True when has local OR cloud CVs
        canSyncAcrossDevices: false // True when cloud connected
      },

      // Session data
      sessionId: null,
      sessionToken: null,
      isSessionActive: false,
      
      // Cloud providers - simpler structure
      connectedProviders: [],
      cloudStatus: {}, // { google_drive: { connected: true, email: "...", quota: {...} } }
      
      // Local storage status
      localCVs: [], // List of locally stored CVs
      
      // UI state
      loading: false,
      error: null,
      showCloudUpgradeModal: false, // For save decision modal
      initializing: false, // Add initialization guard
      
      // Backend availability
      backendAvailable: false,
      
      // ================== INITIALIZATION ==================
      initialize: async () => {
        // Global guard to prevent any initialization
        if (globalInitialized) {
          console.log('🔧 Already globally initialized, skipping...');
          return true;
        }
        
        // Prevent multiple simultaneous initializations
        if (get().initializing || get().loading) {
          console.log('🔧 Initialization already in progress, skipping...');
          return true;
        }
        
        console.log('🔧 Starting sessionStore initialization...');
        globalInitialized = true; // Set global flag immediately
        set({ loading: true, initializing: true });
        
        try {
          // 1. Check backend availability (with timeout)
          const backendAvailable = await Promise.race([
            checkBackendAvailability(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Backend check timeout')), 5000))
          ]).catch(() => false);
          
          console.log(`🔧 Backend available: ${backendAvailable}`);
          
          // 2. Load local CVs (always works)
          const localCVs = get().loadLocalCVs();
          console.log(`🔧 Local CVs loaded: ${localCVs.length}`);
          
          // 3. Set basic capabilities (local always works)
          const basicCapabilities = {
            canBuildLocally: true,
            canSaveLocally: true,
            canSaveToCloud: false,
            canAccessSavedCVs: localCVs.length > 0,
            canSyncAcrossDevices: false
          };
          
          // 4. If backend available, try to restore cloud connections (but don't block on it)
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
              console.log('🔧 Cloud restoration failed (continuing with local-only):', error.message);
            }
          }
          
          // 5. Update capabilities with cloud info
          const finalCapabilities = {
            ...basicCapabilities,
            canSaveToCloud: connectedProviders.length > 0,
            canAccessSavedCVs: localCVs.length > 0 || connectedProviders.length > 0,
            canSyncAcrossDevices: connectedProviders.length > 0
          };
          
          // 6. Determine user state
          let userState = 'browsing';
          if (connectedProviders.length > 0) {
            userState = 'cloud_available';
          }
          
          // 7. Set final state
          set({
            backendAvailable,
            localCVs,
            cloudStatus,
            connectedProviders,
            capabilities: finalCapabilities,
            userState,
            loading: false,
            initializing: false, // Clear initialization flag
            error: null
          });
          
          console.log('✅ SessionStore initialization completed successfully');
          return true;
          
        } catch (error) {
          console.error('❌ SessionStore initialization error:', error);
          
          // Even if everything fails, set up basic local functionality
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
            initializing: false, // Clear initialization flag
            error: 'Running in local-only mode'
          });
          
          console.log('⚠️ Falling back to local-only mode');
          return false;
        }
      },

      // ================== LOCAL STORAGE MANAGEMENT ==================
      loadLocalCVs: () => {
        try {
          const stored = localStorage.getItem('local_cvs');
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      },

     

// Debug the local save functionality
// Add this debugging to your saveLocalCV method in sessionStore.js

saveLocalCV: (cvData) => {
  try {
    console.log('🔧 saveLocalCV called with:', cvData);
    
    // Check if cvData is valid
    if (!cvData) {
      console.error('❌ No CV data provided to saveLocalCV');
      throw new Error('No CV data provided');
    }
    
    // Check localStorage availability
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
    
    console.log('🔧 CV to save:', cvWithMeta);

    const existingIndex = localCVs.findIndex(cv => cv.id === cvId);
    if (existingIndex >= 0) {
      localCVs[existingIndex] = cvWithMeta;
      console.log('🔧 Updating existing CV at index:', existingIndex);
    } else {
      localCVs.push(cvWithMeta);
      console.log('🔧 Adding new CV');
    }

    // Try to save to localStorage with error handling
    try {
      const serializedData = JSON.stringify(localCVs);
      localStorage.setItem('local_cvs', serializedData);
      console.log('✅ Successfully saved to localStorage');
    } catch (storageError) {
      console.error('❌ localStorage save failed:', storageError);
      
      // Check if it's a quota exceeded error
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
    throw error; // Re-throw so the UI can handle it
  }
},

      deleteLocalCV: (cvId) => {
        const localCVs = get().loadLocalCVs().filter(cv => cv.id !== cvId);
        localStorage.setItem('local_cvs', JSON.stringify(localCVs));
        
        set({ 
          localCVs,
          capabilities: { 
            ...get().capabilities, 
            canAccessSavedCVs: localCVs.length > 0 || get().connectedProviders.length > 0
          }
        });
      },

      // ================== CLOUD MANAGEMENT ==================
      createOrRestoreSession: async () => {
        if (get().sessionToken) {
          return { success: true, restored: true };
        }

        try {
          // Add timeout to prevent hanging
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

      checkCloudConnections: async () => {
        const { sessionToken } = get();
        if (!sessionToken) {
          return { providers: [], status: {} };
        }

        try {
          // Add timeout to prevent hanging
          const response = await Promise.race([
            fetch(CLOUD_ENDPOINTS.STATUS, {
              headers: { 'Authorization': `Bearer ${sessionToken}` }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Cloud check timeout')), 8000))
          ]);

          if (response.ok) {
            const statusData = await response.json();
            const connected = Array.isArray(statusData) 
              ? statusData.filter(s => s.connected) 
              : [];
            
            const providers = connected.map(p => p.provider);
            const status = {};
            connected.forEach(p => {
              status[p.provider] = p;
            });

            return { providers, status };
          }
          return { providers: [], status: {} };
        } catch (error) {
          console.error('Cloud status check failed:', error);
          return { providers: [], status: {} };
        }
      },

      connectCloudProvider: async (provider) => {
        set({ loading: true });
        
        try {
          // Create session if needed
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
            // Redirect to OAuth
            window.location.href = data.auth_url;
            return true;
          }
          throw new Error('Failed to initiate cloud connection');
        } catch (error) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      // Called after successful OAuth
      onCloudConnected: async (provider) => {
        try {
          const cloudData = await get().checkCloudConnections();
          
          set({
            connectedProviders: cloudData.providers,
            cloudStatus: cloudData.status,
            capabilities: {
              ...get().capabilities,
              canSaveToCloud: true,
              canSyncAcrossDevices: true,
              canAccessSavedCVs: true
            },
            userState: 'cloud_available',
            loading: false
          });
          
          return true;
        } catch (error) {
          console.error('Post-connection setup failed:', error);
          return false;
        }
      },

      // ================== USER ACTIONS ==================
      
      // User wants to start building
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

      // In sessionStore.js, update the initiateSave method:
initiateSave: (cvData) => {
  const { capabilities } = get();
  
  // Store the data for when user makes a choice
  set({ 
    showCloudUpgradeModal: true,
    pendingSaveData: cvData // Make sure this is set
  });
  
  return {
    cvData,
    options: {
      local: {
        available: capabilities.canSaveLocally,
        description: "Save on this device only",
        pros: ["Instant save", "No setup required"],
        cons: ["Device only", "No backup", "No sync"]
      },
      cloud: {
        available: capabilities.canSaveToCloud,
        description: "Save to cloud storage for access anywhere",
        pros: ["Access anywhere", "Automatic backup", "Sync across devices"],
        cons: capabilities.canSaveToCloud ? [] : ["Requires cloud setup"]
      }
    }
  };
},

// Also add pendingSaveData to your state initialization:
// Add this to your initial state:
pendingSaveData: null,


      // User chooses local save
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

      // User chooses cloud save
      saveToCloud: async (cvData, provider = null) => {
        const { connectedProviders, sessionToken } = get();
        
        if (!connectedProviders.length) {
          return { 
            success: false, 
            needsCloudSetup: true,
            availableProviders: ['google_drive', 'onedrive', 'dropbox', 'box']
          };
        }

        const targetProvider = provider || connectedProviders[0];
        
        try {
          // Implementation for cloud save
          // This would call your existing cloud save logic
          return { 
            success: true, 
            provider: targetProvider,
            message: `CV saved to ${targetProvider}`
          };
        } catch (error) {
          return { 
            success: false, 
            error: error.message 
          };
        }
      },

      // User wants to access saved CVs
      getSavedCVs: async () => {
        const { localCVs, connectedProviders } = get();
        let allCVs = [...localCVs];

        // If cloud connected, fetch cloud CVs too
        if (connectedProviders.length > 0) {
          try {
            // Fetch cloud CVs - you'd implement this
            const cloudCVs = []; // await fetchCloudCVs();
            allCVs = [...allCVs, ...cloudCVs];
          } catch (error) {
            console.error('Failed to fetch cloud CVs:', error);
          }
        }

        return {
          cvs: allCVs,
          sources: {
            local: localCVs.length,
            cloud: allCVs.length - localCVs.length
          }
        };
      },

      // ================== UI HELPERS ==================
      showCloudUpgrade: () => set({ showCloudUpgradeModal: true }),
      hideCloudUpgrade: () => set({ showCloudUpgradeModal: false }),
      
      clearError: () => set({ error: null }),

      // Get current user experience state
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

      // Get environment info for DevTools
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

      // ================== BACKWARD COMPATIBILITY ==================
      // Keep old method names for existing components
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
        localCVs: state.localCVs
      })
    }
  )
);

export default useSessionStore;