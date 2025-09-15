// src/stores/sessionStore.js - Complete version with real Google Drive OAuth
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      
      // Development mode flag - force true for development
      isDevelopmentMode: true,
      
      // ================== SESSION MANAGEMENT ==================
      
      // Initialize session store
      initialize: async () => {
        try {
          // Try to connect to backend first
          const response = await fetch('http://localhost:8000/health');
          
          if (response.ok) {
            // Backend is available - use real session
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            
            set({
              sessionId: sessionId,
              sessionToken: 'anonymous_session',
              sessionExpires: expires.toISOString(),
              isSessionActive: true,
            });
            
            // Try to check cloud status
            try {
              await get().checkCloudStatus();
            } catch (error) {
              console.log('Cloud status check failed during init:', error);
              set({
                connectedProviders: [],
                providersStatus: {},
                showCloudSetup: true
              });
            }
            
            return true;
          } else {
            throw new Error('Health check failed');
          }
        } catch (error) {
          console.error('Backend connection failed:', error);
          
          // In development, continue without backend but set up for real OAuth
          console.log('🔧 Development mode: Setting up for real Google Drive OAuth');
          
          const sessionId = `dev_session_${Date.now()}`;
          const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
          
          set({
            sessionId: sessionId,
            sessionToken: 'dev_session',
            sessionExpires: expires.toISOString(),
            isSessionActive: true,
            connectedProviders: [],
            providersStatus: {},
            showCloudSetup: true,
            error: null
          });
          
          return true;
        }
      },
      
      // Check if session is valid and active
      validateSession: async () => {
        const { sessionExpires } = get();
        
        // Check if session is expired
        if (sessionExpires && new Date() > new Date(sessionExpires)) {
          await get().clearSession();
          return false;
        }
        
        // In development mode, always consider session valid
        set({ isSessionActive: true });
        return true;
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
        try {
          const response = await fetch('http://localhost:8000/api/cloud/providers');
          
          if (!response.ok) {
            throw new Error('Failed to get available providers');
          }
          
          return await response.json();
        } catch (error) {
          console.error('Error getting providers:', error);
          
          // Return mock providers for development
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
        }
      },
      
      // Initiate cloud provider connection
      connectProvider: async (provider) => {
        set({ loading: true, error: null });
        
        try {
          // Use real OAuth flow for all providers
          const response = await fetch(`http://localhost:8000/api/cloud/connect/${provider}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`Failed to initiate ${provider} connection`);
          }
          
          const data = await response.json();
          
          // Redirect to OAuth URL
          window.location.href = data.auth_url;
          
          return data;
        } catch (error) {
          console.error(`Error connecting to ${provider}:`, error);
          set({ 
            error: error.message || `Failed to connect to ${provider}`,
            loading: false 
          });
          throw error;
        }
      },
      
      // Check status of all cloud providers
      checkCloudStatus: async () => {
        try {
          const response = await fetch('http://localhost:8000/api/cloud/status');
          
          if (!response.ok) {
            if (response.status === 401 || response.status === 404) {
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
          
          // Update connected providers
          const connected = statusData.filter(status => status.connected);
          const statusMap = {};
          
          statusData.forEach(status => {
            statusMap[status.provider] = status;
          });
          
          set({
            connectedProviders: connected.map(p => p.provider),
            providersStatus: statusMap,
          });
          
          if (connected.length === 0 && get().isSessionActive) {
            set({ showCloudSetup: true });
          }
          
          return statusData;
        } catch (error) {
          console.error('Error checking cloud status:', error);
          
          // In development, set empty state but don't error
          set({
            connectedProviders: [],
            providersStatus: {},
            showCloudSetup: get().isSessionActive
          });
          
          return [];
        }
      },
      
      // Disconnect from a cloud provider
      disconnectProvider: async (provider) => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch(`http://localhost:8000/api/cloud/disconnect/${provider}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error(`Failed to disconnect from ${provider}`);
          }
          
          // Update state
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
        try {
          const response = await fetch(`http://localhost:8000/api/cloud/test/${provider}`, {
            method: 'POST',
          });
          
          if (!response.ok) {
            throw new Error(`Failed to test ${provider} connection`);
          }
          
          return await response.json();
        } catch (error) {
          console.error(`Error testing ${provider}:`, error);
          throw error;
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
      
      // Handle OAuth callback success
      handleOAuthSuccess: async (provider) => {
        console.log(`🔗 Handling OAuth success for ${provider}`);
        
        try {
          // Refresh cloud status to get the real connection data
          await get().checkCloudStatus();
          
          set({ showCloudSetup: false });
          return true;
        } catch (error) {
          console.error('Error handling OAuth success:', error);
          return false;
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

// Auto-initialize session on store creation
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const store = useSessionStore.getState();
    if (!store.isSessionActive) {
      store.initialize().catch(console.error);
    }
  }, 100);
}

export default useSessionStore;