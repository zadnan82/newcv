// src/stores/authStore.js - Updated for privacy-first backend
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      sessionId: null,
      sessionToken: null,
      cloudProviders: [],
      loading: false,
      error: null,
      
      // Check if session is active
      isAuthenticated: () => {
        const { sessionToken } = get();
        return !!sessionToken;
      },
      
      // Create anonymous session
      createSession: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (!response.ok) {
            throw new Error('Failed to create session');
          }
          
          const data = await response.json();
          
          set({
            sessionId: data.session_id,
            sessionToken: data.token || data.session_id,
            loading: false
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message,
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Connect to cloud provider
      connectCloudProvider: async (provider) => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          await get().createSession();
        }
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/cloud/connect/${provider}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${get().sessionToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              redirect_uri: window.location.origin + '/auth/callback'
            })
          });
          
          const data = await response.json();
          
          // Redirect to OAuth URL
          window.location.href = data.auth_url;
          
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Handle OAuth callback
      handleOAuthCallback: async (code, state, provider) => {
        // This will be handled by the backend redirect
        // Just refresh the session status
        await get().refreshSession();
      },
      
      // Refresh session and cloud provider status
      refreshSession: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) return;
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/cloud/status`, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`
            }
          });
          
          if (response.ok) {
            const providers = await response.json();
            set({ 
              cloudProviders: providers.filter(p => p.connected)
            });
          }
        } catch (error) {
          console.error('Failed to refresh session:', error);
        }
      },
      
      // Logout (clear session)
      logout: () => {
        set({
          sessionId: null,
          sessionToken: null,
          cloudProviders: [],
          error: null
        });
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'privacy-auth-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionToken: state.sessionToken,
        cloudProviders: state.cloudProviders
      })
    }
  )
);

export default useAuthStore;