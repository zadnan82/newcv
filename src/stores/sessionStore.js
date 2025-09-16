import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL, CLOUD_ENDPOINTS, checkBackendAvailability } from '../config';

const useSessionStore = create(
  persist(
    (set, get) => ({
      // Session state
      sessionId: null,
      sessionToken: null,
      sessionExpires: null,
      isSessionActive: false,
      
      // Cloud providers state
      connectedProviders: [],
      providersStatus: {},
      
      // UI state
      loading: false,
      error: null,
      showCloudSetup: false,
      
      // Backend availability
      backendAvailable: false,
      
      // ================== SESSION MANAGEMENT ==================
      
      // Fix for sessionStore.js - Better initialization and timing

// Add initialization state
initializing: false,
initializeComplete: false,

// Updated initialize method
// Replace the existing initialize method with this:
initialize: async () => {
  // Prevent multiple simultaneous initializations
  if (get().initializing || get().initializeComplete) {
    console.log('⏭️ Skipping initialization - already in progress or complete');
    return get().initializeComplete;
  }
  
  console.log('🔧 Initializing session store...');
  set({ initializing: true, error: null });
  
  try {
    // Check if backend is available
    const backendAvailable = await checkBackendAvailability();
    console.log(`🔧 Backend available: ${backendAvailable}`);
    
    set({ backendAvailable });
    
    if (backendAvailable) {
      // Backend is available - use real session
      const sessionResult = await get().createSession();
      
      if (sessionResult.success) {
        // IMPORTANT: Always try to check cloud status after session creation
        console.log('✅ Session created, checking cloud status...');
        try {
          await get().checkCloudStatus();
          console.log('✅ Cloud status loaded:', get().connectedProviders);
        } catch (error) {
          console.log('ℹ️ No existing cloud connections found (this is normal for new users)');
          set({
            connectedProviders: [],
            providersStatus: {},
            showCloudSetup: true
          });
        }
        
        set({ 
          initializeComplete: true, 
          initializing: false 
        });
        return true;
      } else {
        throw new Error('Failed to create session');
      }
    } else {
      // Backend not available - set up offline mode
      console.log('🔧 Backend not available, setting up offline mode');
      
      const sessionId = `offline_session_${Date.now()}`;
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      set({
        sessionId: sessionId,
        sessionToken: 'offline_session',
        sessionExpires: expires.toISOString(),
        isSessionActive: true,
        connectedProviders: [],
        providersStatus: {},
        showCloudSetup: true,
        initializeComplete: true,
        initializing: false,
        error: null
      });
      
      return true;
    }
  } catch (error) {
    console.error('Session initialization failed:', error);
    set({ 
      error: error.message,
      isSessionActive: false,
      initializing: false,
      initializeComplete: false
    });
    return false;
  }
},

// Updated checkCloudStatus to be more robust
checkCloudStatus: async () => {
  const { backendAvailable, sessionToken, initializing } = get();
  
  // Don't run if we're still initializing
  if (initializing) {
    console.log('⏳ Session still initializing, skipping cloud status check');
    return [];
  }
  
  if (backendAvailable && sessionToken) {
    try {
      console.log('🔍 Checking cloud provider status...');
      const response = await fetch(CLOUD_ENDPOINTS.STATUS, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          console.log('ℹ️ No cloud connections found (empty response)');
          set({
            connectedProviders: [],
            providersStatus: {},
            showCloudSetup: get().isSessionActive
          });
          return [];
        }
        throw new Error('Failed to check cloud status');
      }
      
      const statusData = await response.json();
      console.log('📊 Cloud status response:', statusData);
      
      // Update connected providers - CRITICAL FIX
      const connected = Array.isArray(statusData) 
        ? statusData.filter(status => status.connected) 
        : [];
      
      const statusMap = {};
      
      if (Array.isArray(statusData)) {
        statusData.forEach(status => {
          statusMap[status.provider] = status;
        });
      }
      
      const connectedProviderIds = connected.map(p => p.provider);
      console.log('✅ Connected providers found:', connectedProviderIds);
      
      // THIS IS THE CRITICAL UPDATE
      set({
        connectedProviders: connectedProviderIds,
        providersStatus: statusMap,
        showCloudSetup: connectedProviderIds.length === 0 && get().isSessionActive
      });
      
      return statusData;
    } catch (error) {
      console.error('Error checking cloud status:', error);
      // On error, assume no providers but don't clear existing state completely
      if (get().connectedProviders.length === 0) {
        set({
          connectedProviders: [],
          providersStatus: {},
          showCloudSetup: get().isSessionActive
        });
      }
      return [];
    }
  } else {
    // Development mode or no session - use local state
    const { connectedProviders, providersStatus } = get();
    return Object.keys(providersStatus).map(provider => providersStatus[provider]);
  }
},
      
      // Create a new session with the backend
      createSession: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to create session');
          }
          
          const data = await response.json();
          console.log('✅ Session created:', data.session_id);
          
          set({
            sessionId: data.session_id,
            sessionToken: data.token || data.session_id,
            sessionExpires: data.expires_at,
            isSessionActive: true,
            error: null
          });
          
          return { success: true, data };
        } catch (error) {
          console.error('Failed to create session:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },
      
      // Check if session is valid and active
      validateSession: async () => {
        const { sessionExpires, backendAvailable } = get();
        
        // Check if session is expired
        if (sessionExpires && new Date() > new Date(sessionExpires)) {
          await get().clearSession();
          return false;
        }
        
        // If backend not available, just check local state
        if (!backendAvailable) {
          const isActive = !!get().sessionToken;
          set({ isSessionActive: isActive });
          return isActive;
        }
        
        // If we have a session, consider it valid
        const isActive = !!get().sessionToken;
        set({ isSessionActive: isActive });
        return isActive;
      },
      
      // Clear session data
      clearSession: async () => {
        set({
          sessionId: null,
          sessionToken: null,
          sessionExpires: null,
          isSessionActive: false,
          connectedProviders: [],
          providersStatus: {},
          showCloudSetup: false,
        });
      },
      
      // ================== CLOUD PROVIDER MANAGEMENT ==================
      
      // Get available cloud providers
      getAvailableProviders: async () => {
        const { backendAvailable } = get();
        
        if (backendAvailable) {
          try {
            const response = await fetch(CLOUD_ENDPOINTS.PROVIDERS);
            
            if (!response.ok) {
              throw new Error('Failed to get available providers');
            }
            
            return await response.json();
          } catch (error) {
            console.error('Error getting providers from backend:', error);
          }
        }
        
        // Return mock providers for development/offline mode
        return {
          providers: [
            {
              id: 'google_drive',
              name: 'Google Drive',
              description: 'Store your CVs in Google Drive',
              logo_url: '/static/logos/google-drive.png',
              supported_features: ['read', 'write', 'delete', 'folders']
            },
            {
              id: 'onedrive',
              name: 'Microsoft OneDrive',
              description: 'Store your CVs in OneDrive',
              logo_url: '/static/logos/onedrive.png',
              supported_features: ['read', 'write', 'delete', 'folders']
            },
            {
              id: 'dropbox',
              name: 'Dropbox',
              description: 'Store your CVs in Dropbox',
              logo_url: '/static/logos/dropbox.png',
              supported_features: ['read', 'write', 'delete', 'folders']
            },
            {
              id: 'box',
              name: 'Box',
              description: 'Store your CVs in Box',
              logo_url: '/static/logos/box.png',
              supported_features: ['read', 'write', 'delete', 'folders']
            }
          ]
        };
      },
      
      // Initiate cloud provider connection
      connectProvider: async (provider) => {
        set({ loading: true, error: null });
        
        const { backendAvailable, sessionToken } = get();
        
        try {
          if (backendAvailable) {
            // Use real backend OAuth flow
            const response = await fetch(CLOUD_ENDPOINTS.CONNECT(provider), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
              },
            });
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.detail || `Failed to initiate ${provider} connection`);
            }
            
            const data = await response.json();
            console.log(`🔗 Redirecting to ${provider} OAuth:`, data.auth_url);
            
            // Store the state for callback verification
            localStorage.setItem(`oauth_state_${provider}`, data.state);
            
            // Redirect to OAuth URL
            window.location.href = data.auth_url;
            
            return data;
          } else {
            // Development mode - simulate OAuth flow
            console.log(`🔧 Development mode: Simulating ${provider} OAuth flow`);
            
            // Get the real OAuth URLs for development
            const oauthUrls = get().getDevelopmentOAuthUrls(provider);
            
            if (oauthUrls[provider]) {
              console.log(`🔗 Redirecting to real ${provider} OAuth (development mode)`);
              window.location.href = oauthUrls[provider];
            } else {
              // Fallback simulation
              setTimeout(() => {
                get().simulateProviderConnection(provider);
              }, 2000);
            }
            
            return { success: true };
          }
        } catch (error) {
          console.error(`Error connecting to ${provider}:`, error);
          set({ 
            error: error.message || `Failed to connect to ${provider}`,
            loading: false 
          });
          throw error;
        }
      },

      // Add this method to your sessionStore.js in the store creation function
updateProviderConnection: (provider, status, userData = {}) => {
  set(state => ({
    connectedProviders: status.connected 
      ? [...new Set([...state.connectedProviders, provider])]
      : state.connectedProviders.filter(p => p !== provider),
    providersStatus: {
      ...state.providersStatus,
      [provider]: {
        provider,
        connected: status.connected,
        email: userData.email || null,
        storage_quota: userData.storage_quota || null,
        ...status
      }
    },
    showCloudSetup: status.connected ? false : state.showCloudSetup
  }));
},
      
      // Get development OAuth URLs for real testing
      getDevelopmentOAuthUrls: (provider) => {
         const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                   import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;
        // These would be configured in your .env file for development
        const devOAuthUrls = { 
          google_drive: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${window.location.origin}/cloud/connected&scope=https://www.googleapis.com/auth/drive.file&response_type=code&access_type=offline&prompt=consent&state=dev_${provider}_${Date.now()}`,
          onedrive: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.REACT_APP_MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/cloud/connected&scope=Files.ReadWrite&state=dev_${provider}_${Date.now()}`,
          dropbox: `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.REACT_APP_DROPBOX_APP_KEY}&response_type=code&redirect_uri=http://localhost:3000/cloud/connected&state=dev_${provider}_${Date.now()}`,
          box: `https://account.box.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_BOX_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/cloud/connected&state=dev_${provider}_${Date.now()}`
        };
        
        return devOAuthUrls;
      },
      
      // Simulate provider connection for development
      simulateProviderConnection: async (provider) => {
        console.log(`🔧 Simulating ${provider} connection...`);
        
        set(state => ({
          connectedProviders: [...state.connectedProviders, provider],
          providersStatus: {
            ...state.providersStatus,
            [provider]: {
              connected: true,
              provider: provider,
              email: `dev@${provider}.com`,
              storage_quota: {
                total: 15000000000, // 15GB
                used: 5000000000,   // 5GB
                available: 10000000000 // 10GB
              }
            }
          },
          loading: false,
          showCloudSetup: false
        }));
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('cloudConnected', { 
          detail: { provider } 
        }));
      },
      
     
      
      // Disconnect from a cloud provider
      disconnectProvider: async (provider) => {
        set({ loading: true, error: null });
        
        const { backendAvailable, sessionToken } = get();
        
        try {
          if (backendAvailable) {
            const response = await fetch(CLOUD_ENDPOINTS.DISCONNECT(provider), {
              method: 'DELETE',
              headers: {
                ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
              }
            });
            
            if (!response.ok) {
              throw new Error(`Failed to disconnect from ${provider}`);
            }
          }
          
          // Update state (both for backend and development mode)
          set(state => ({
            connectedProviders: state.connectedProviders.filter(p => p !== provider),
            providersStatus: {
              ...state.providersStatus,
              [provider]: { ...state.providersStatus[provider], connected: false }
            },
            loading: false,
          }));
          
          if (get().connectedProviders.length === 0) {
            set({ showCloudSetup: true });
          }
          
          return true;
        } catch (error) {
          console.error(`Error disconnecting from ${provider}:`, error);
          set({ 
            error: error.message || `Failed to disconnect from ${provider}`,
            loading: false 
          });
          throw error;
        }
      },
      
      // Test cloud provider connection
      testProvider: async (provider) => {
        const { backendAvailable, sessionToken } = get();
        
        if (backendAvailable) {
          try {
            const response = await fetch(CLOUD_ENDPOINTS.TEST(provider), {
              method: 'POST',
              headers: {
                ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
              }
            });
            
            if (!response.ok) {
              throw new Error(`Failed to test ${provider} connection`);
            }
            
            return await response.json();
          } catch (error) {
            console.error(`Error testing ${provider}:`, error);
            throw error;
          }
        } else {
          // Development mode - simulate test
          return {
            provider: provider,
            status: 'healthy',
            response_time_ms: 150,
            user_info: { name: 'Dev User', email: `dev@${provider}.com` },
            storage_quota: { total: 15000000000, used: 5000000000, available: 10000000000 }
          };
        }
      },
      
      // ================== UTILITY METHODS ==================
      
      // Check if user has any connected providers
      hasConnectedProviders: () => {
        return get().connectedProviders.length > 0;
      },
      
      // Get preferred provider (first connected one)
      getPreferredProvider: () => {
        const { connectedProviders } = get();
        return connectedProviders.length > 0 ? connectedProviders[0] : null;
      },
      
      // Show/hide cloud setup dialog
      setShowCloudSetup: (show) => {
        set({ showCloudSetup: show });
      },
      
      // Clear error
      clearError: () => {
        set({ error: null });
      },
      
     // Replace the existing handleOAuthSuccess method with this:
handleOAuthSuccess: async (provider) => {
  console.log('🔄 handleOAuthSuccess called for:', provider);
  console.log('Current connectedProviders:', get().connectedProviders);
  
  try {
    // Update the provider connection status immediately
    get().updateProviderConnection(
      provider,
      { connected: true },
      { 
        email: `user@${provider}.com`,
        storage_quota: {
          total: 15 * 1024 * 1024 * 1024,
          used: 5 * 1024 * 1024 * 1024,
          available: 10 * 1024 * 1024 * 1024
        }
      }
    );
    
    // In development mode, we're done
    if (!get().backendAvailable) {
      return true;
    }
    
    // For real backend, refresh cloud status to get the actual connection data
    await get().checkCloudStatus();
    
    return true;
  } catch (error) {
    console.error('Error handling OAuth success:', error);
    
    // Fallback: manually update the connection status
    get().updateProviderConnection(
      provider,
      { connected: true },
      { email: `user@${provider}.com` }
    );
    
    return true; // Still return true as we've manually updated the state
  }
},
      
      // Check if specific provider is connected
      isProviderConnected: (provider) => {
        return get().connectedProviders.includes(provider);
      },
      
      // Get provider status
      getProviderStatus: (provider) => {
        return get().providersStatus[provider] || { connected: false };
      },
      
      // ================== DEVELOPMENT HELPERS ==================
      
      // Force connect provider for development testing
      forceConnectProvider: (provider, userData = {}) => {
        console.log(`🔧 Force connecting ${provider} for development`);
        
        set(state => ({
          connectedProviders: [...new Set([...state.connectedProviders, provider])],
          providersStatus: {
            ...state.providersStatus,
            [provider]: {
              connected: true,
              provider: provider,
              email: userData.email || `dev@${provider}.com`,
              storage_quota: userData.storage_quota || {
                total: 15000000000,
                used: 5000000000,
                available: 10000000000
              }
            }
          },
          showCloudSetup: false
        }));
        
        window.dispatchEvent(new CustomEvent('cloudConnected', { 
          detail: { provider } 
        }));
      },
      
      // Get environment info
      getEnvironmentInfo: () => ({
        backendAvailable: get().backendAvailable,
        apiBaseUrl: API_BASE_URL,
        isDevelopment: API_BASE_URL.includes('localhost'),
        connectedProviders: get().connectedProviders.length,
        sessionActive: get().isSessionActive
      })
    }),
    {
      name: 'session-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionExpires: state.sessionExpires,
        connectedProviders: state.connectedProviders,
        providersStatus: state.providersStatus,
      }),
    }
  )
);

// Auto-initialize session on store creation (with rate limiting)
// Auto-initialize session on store creation (with rate limiting)
if (typeof window !== 'undefined') {
  // Use a flag to prevent multiple initializations
  let hasInitialized = false;
  
  const tryInitialize = () => {
    if (hasInitialized) return;
    
    const store = useSessionStore.getState();
    if (!store.isSessionActive && !store.loading) {
      hasInitialized = true;
      store.initialize().catch(console.error);
    }
  };
  
  // Initialize after a delay to avoid multiple rapid calls
  setTimeout(tryInitialize, 1000);
}

export default useSessionStore;