// src/stores/sessionStore.js  
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL, checkBackendAvailability } from '../config';
import cloudProviderService from '../services/cloudProviderService';

let globalInitialized = false;


const formatDateForBackend = (dateStr) => {
  if (!dateStr) return '';
  
  // If it's just YYYY-MM, add -01 for first day of month
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    return `${dateStr}-01`;
  }
  
  // If it's already YYYY-MM-DD, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // If it's just YYYY, add -01-01
  if (/^\d{4}$/.test(dateStr)) {
    return `${dateStr}-01-01`;
  }
  
  return dateStr;
};

const validateAndCleanCVData = (cvData) => {
  const cleaned = { ...cvData };
  
  // Clean educations
  if (cleaned.educations && Array.isArray(cleaned.educations)) {
    cleaned.educations = cleaned.educations
      .filter(edu => edu && (edu.institution || edu.degree || edu.field_of_study))
      .map(edu => ({
        ...edu,
        institution: edu.institution || '',
        degree: edu.degree || '',
        field_of_study: edu.field_of_study || '',
        start_date: edu.start_date || '',
        end_date: edu.end_date || '',
        description: edu.description || ''
      }));
  }
  
  // Clean experiences
  if (cleaned.experiences && Array.isArray(cleaned.experiences)) {
    cleaned.experiences = cleaned.experiences
      .filter(exp => exp && (exp.company || exp.position))
      .map(exp => ({
        ...exp,
        company: exp.company || '',
        position: exp.position || '',
        start_date: exp.start_date || '',
        end_date: exp.end_date || '',
        description: exp.description || '',
        city: exp.city || ''
      }));
  }
  
  // Clean skills
  if (cleaned.skills && Array.isArray(cleaned.skills)) {
    cleaned.skills = cleaned.skills.filter(skill => 
      skill && (skill.name || (typeof skill === 'string' && skill.trim()))
    );
  }
  
  // Clean languages
  if (cleaned.languages && Array.isArray(cleaned.languages)) {
    cleaned.languages = cleaned.languages.filter(lang => 
      lang && (lang.language || (typeof lang === 'string' && lang.trim()))
    );
  }
  
  // Ensure personal_info fields are strings
  if (cleaned.personal_info) {
    Object.keys(cleaned.personal_info).forEach(key => {
      if (cleaned.personal_info[key] === null || cleaned.personal_info[key] === undefined) {
        cleaned.personal_info[key] = '';
      }
    });
    
    if (!cleaned.personal_info.mobile || cleaned.personal_info.mobile.length < 5) {
      cleaned.personal_info.mobile = '+0000000000';
    }
  }
  
  return cleaned;
};

const validateCVData = (cvData) => {
  const errors = [];
  
  if (!cvData.personal_info?.full_name) {
    errors.push('Full name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};


const useSessionStore = create(
  persist(
    (set, get) => ({
      // ================== SIMPLIFIED STATE ==================
      sessionId: null,
      sessionToken: null,
      isSessionActive: false,
      
      // Multi-provider state
      connectedProviders: [], // Array of connected provider names
      providerStatuses: {}, // Object with provider status details
      
      // Backward compatibility
      googleDriveConnected: false,
      googleDriveStatus: null,
      
      // Local storage
      localCVs: [],
      
      // Capabilities
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

      // ================== MULTI-PROVIDER METHODS ==================

      connectToCloudProvider: async (provider) => {
        console.log(`🔗 Connecting to ${provider}...`);
        set({ loading: true, error: null });
        
        try {
          // Ensure we have a session
          await get().createOrRestoreSession();
          
          // Set session token in service
          cloudProviderService.setSessionToken(get().sessionToken);
          
          // Use the unified service (this already uses correct endpoints)
          await cloudProviderService.connectToProvider(provider);
          
          return true;
        } catch (error) {
          console.error(`❌ ${provider} connection error:`, error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      checkAllProviderStatuses: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          return {};
        }

        cloudProviderService.setSessionToken(sessionToken);
        
        const availableProviders = ['google_drive', 'onedrive', 'dropbox'];  
        const statuses = {};
        const connectedProviders = [];
        
        for (const provider of availableProviders) {
          try {
            // This uses the correct provider-specific endpoints
            const status = await cloudProviderService.checkProviderStatus(provider);
            statuses[provider] = status;
            
            if (status.connected) {
              connectedProviders.push(provider);
            }
          } catch (error) {
            console.warn(`Failed to check ${provider} status:`, error);
            statuses[provider] = { connected: false, provider, error: error.message };
          }
        }

        // Update state
        set({
          connectedProviders,
          providerStatuses: statuses,
          googleDriveConnected: connectedProviders.includes('google_drive'),
          googleDriveStatus: statuses.google_drive || null,
          capabilities: {
            ...get().capabilities,
            canSaveToCloud: connectedProviders.length > 0,
            canAccessSavedCVs: get().localCVs.length > 0 || connectedProviders.length > 0,
            canSyncAcrossDevices: connectedProviders.length > 0
          }
        });

        return statuses;
      },

      handleOAuthReturn: async (provider) => {
        console.log(`✅ Handling ${provider} OAuth return`);
        
        try {
          set({ loading: true });
          
          // Give backend a moment to process
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check all provider statuses (this should call the right endpoints)
          await get().checkAllProviderStatuses();
          
          const { connectedProviders, providerStatuses } = get();
          
          if (connectedProviders.includes(provider)) {
            const status = providerStatuses[provider];
            
            set({ loading: false, error: null });
            
            return { 
              success: true, 
              provider,
              message: `Successfully connected to ${provider}`,
              email: status.email
            };
          } else {
            throw new Error(`${provider} connection verification failed`);
          }
          
        } catch (error) {
          console.error(`❌ ${provider} OAuth return handling failed:`, error);
          set({ 
            loading: false, 
            error: `Failed to verify ${provider} connection: ${error.message}` 
          });
          return { success: false, error: error.message };
        }
      },

      // Disconnect from specific provider
      disconnectFromProvider: async (provider) => {
        try {
          console.log(`🔓 Disconnecting from ${provider}...`);
          
          cloudProviderService.setSessionToken(get().sessionToken);
          await cloudProviderService.disconnectFromProvider(provider);
          
          // Update state
          const { connectedProviders, providerStatuses } = get();
          const updatedProviders = connectedProviders.filter(p => p !== provider);
          const updatedStatuses = { ...providerStatuses };
          updatedStatuses[provider] = { connected: false, provider };
          
          set({
            connectedProviders: updatedProviders,
            providerStatuses: updatedStatuses,
            // Backward compatibility
            googleDriveConnected: updatedProviders.includes('google_drive'),
            googleDriveStatus: provider === 'google_drive' ? null : get().googleDriveStatus,
            capabilities: {
              ...get().capabilities,
              canSaveToCloud: updatedProviders.length > 0,
              canAccessSavedCVs: get().localCVs.length > 0 || updatedProviders.length > 0,
              canSyncAcrossDevices: updatedProviders.length > 0
            }
          });
          
          console.log(`✅ ${provider} disconnected successfully`);
          return true;
        } catch (error) {
          console.error(`❌ ${provider} disconnect failed:`, error);
          throw error;
        }
      },

      // ================== UNIFIED CV OPERATIONS ==================

      // Save CV to any connected provider (or specific provider)
      saveToConnectedCloud: async (cvData, preferredProvider = null) => {
        const { connectedProviders, sessionToken } = get();
        
        if (!sessionToken) {
          return { 
            success: false, 
            error: 'Session expired. Please reconnect.' 
          };
        }

        if (connectedProviders.length === 0) {
          return {
            success: false,
            error: 'No cloud providers connected. Please connect first.',
            needsConnection: true
          };
        }

        // Determine which provider to use
        let targetProvider = preferredProvider;
        if (!targetProvider || !connectedProviders.includes(targetProvider)) {
          // Use first connected provider as fallback
          targetProvider = connectedProviders[0];
        }

        console.log(`💾 Saving CV to ${targetProvider}...`);

        try {
          set({ loading: true, error: null });
          
          cloudProviderService.setSessionToken(sessionToken);
          
          // Clean the data before sending
          const cleanedData = get().cleanCVDataForAPI(cvData);
          
          const result = await cloudProviderService.saveCVToProvider(targetProvider, cleanedData);
          
          set({ loading: false });
          
          return {
            success: true,
            provider: targetProvider,
            fileId: result.file_id,
            message: result.message || `CV saved to ${cloudProviderService.getProviderConfig(targetProvider).name} successfully`
          };

        } catch (error) {
          console.error(`❌ Save to ${targetProvider} failed:`, error);
          set({ loading: false, error: error.message });
          
          return { 
            success: false, 
            error: error.message,
            provider: targetProvider
          };
        }
      },

      // Update CV in specific provider
      updateConnectedCloudCV: async (cvData, fileId, provider) => {
        const { connectedProviders, sessionToken } = get();
        
        if (!sessionToken) {
          return { 
            success: false, 
            error: 'Session expired. Please reconnect.' 
          };
        }

        if (!connectedProviders.includes(provider)) {
          return {
            success: false,
            error: `${cloudProviderService.getProviderConfig(provider).name} not connected. Please connect first.`,
            needsConnection: true
          };
        }

        if (!fileId) {
          return {
            success: false,
            error: 'File ID is required for updates'
          };
        }

        console.log(`🔄 Updating CV in ${provider}...`, { fileId, title: cvData.title });

        try {
          cloudProviderService.setSessionToken(sessionToken);
          
          const result = await cloudProviderService.updateCVInProvider(provider, fileId, cvData);
          
          return {
            success: true,
            file_id: result.file_id || fileId,
            message: result.message || `CV updated in ${cloudProviderService.getProviderConfig(provider).name} successfully`,
            provider
          };

        } catch (error) {
          console.error(`❌ Update to ${provider} failed:`, error);
          return {
            success: false,
            error: error.message,
            provider
          };
        }
      },

      // List CVs from all connected providers
      listAllCloudCVs: async () => {
        const { connectedProviders, sessionToken } = get();
        
        if (!sessionToken || connectedProviders.length === 0) {
          return [];
        }

        cloudProviderService.setSessionToken(sessionToken);
        
        const allCVs = [];
        
        for (const provider of connectedProviders) {
          try {
            const files = await cloudProviderService.listCVsFromProvider(provider);
            allCVs.push(...files);
          } catch (error) {
            console.error(`Failed to list CVs from ${provider}:`, error);
            // Continue with other providers
          }
        }
        
        return allCVs;
      },

      // List CVs from specific provider
      listCVsFromProvider: async (provider) => {
        const { connectedProviders, sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        if (!connectedProviders.includes(provider)) {
          throw new Error(`${provider} not connected`);
        }

        cloudProviderService.setSessionToken(sessionToken);
        return await cloudProviderService.listCVsFromProvider(provider);
      },

      // Load CV from specific provider
      loadCVFromProvider: async (provider, fileId) => {
        const { connectedProviders, sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        if (!connectedProviders.includes(provider)) {
          throw new Error(`${provider} not connected`);
        }

        cloudProviderService.setSessionToken(sessionToken);
        return await cloudProviderService.loadCVFromProvider(provider, fileId);
      },

      // Delete CV from specific provider
      deleteCVFromProvider: async (provider, fileId) => {
        const { connectedProviders, sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        if (!connectedProviders.includes(provider)) {
          throw new Error(`${provider} not connected`);
        }

        cloudProviderService.setSessionToken(sessionToken);
        return await cloudProviderService.deleteCVFromProvider(provider, fileId);
      },

      // ================== BACKWARD COMPATIBILITY METHODS ==================
      
      // Legacy Google Drive methods (for backward compatibility)
      listGoogleDriveCVs: async () => {
        return await get().listCVsFromProvider('google_drive');
      },

      loadGoogleDriveCV: async (fileId) => {
        return await get().loadCVFromProvider('google_drive', fileId);
      },

      deleteGoogleDriveCV: async (fileId) => {
        return await get().deleteCVFromProvider('google_drive', fileId);
      },

      disconnectGoogleDrive: async () => {
        return await get().disconnectFromProvider('google_drive');
      },

      checkGoogleDriveStatus: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          return { connected: false, provider: 'google_drive' };
        }

        cloudProviderService.setSessionToken(sessionToken);
        return await cloudProviderService.checkProviderStatus('google_drive');
      },

      getGoogleDriveDebugInfo: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        cloudProviderService.setSessionToken(sessionToken);
        return await cloudProviderService.getProviderDebugInfo('google_drive');
      },

      testMinimalSave: async (provider = 'google_drive') => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        cloudProviderService.setSessionToken(sessionToken);
        return await cloudProviderService.testMinimalSave(provider);
      },

      // ================== PROVIDER PREFERENCE METHODS ==================

      getPreferredProvider: () => {
        const { connectedProviders } = get();
        
        // Check user preference
        const storedPreference = localStorage.getItem('preferred_cv_provider');
        if (storedPreference && connectedProviders.includes(storedPreference)) {
          return storedPreference;
        }
        
        // Fallback to first connected provider
        if (connectedProviders.length > 0) {
          return connectedProviders[0];
        }
        
        // Final fallback to local
        return 'local';
      },

      setPreferredProvider: (provider) => {
        const { connectedProviders } = get();
        
        if (provider === 'local' || connectedProviders.includes(provider)) {
          localStorage.setItem('preferred_cv_provider', provider);
          return true;
        }
        
        console.warn(`Cannot set ${provider} as preferred - not connected`);
        return false;
      },

      getStoredPreferredProvider: () => {
        return localStorage.getItem('preferred_cv_provider') || 'local';
      },

      // ================== HELPER METHODS ==================
      

      // Add this function in sessionStore.js before the cleanCVDataForAPI function
  

  cleanCVDataForAPI: (cvData) => {
        console.log('🧹 Cleaning CV data for API...');
        
        // Call the external helper function
        let cleaned = validateAndCleanCVData(cvData);
        
        // Remove UI-only fields
        const {
          _autoSave,
          _prepared_for_ai,
          lastModified,
          createdAt,
          storageType,
          localOnly,
          ...apiData
        } = cleaned;
        
        const dataSize = JSON.stringify(apiData).length;
        console.log(`📊 CV data size: ${(dataSize / 1024).toFixed(1)}KB`);
        
        // Validate
        const validation = validateCVData(apiData);
        if (!validation.isValid) {
          console.error('❌ CV data validation failed:', validation.errors);
          throw new Error(`Invalid CV data: ${validation.errors.join(', ')}`);
        }
        
        console.log('✅ CV data cleaned and validated successfully');
        return apiData;
      },

      // ================== SESSION MANAGEMENT ==================
      
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

      // ================== LOCAL STORAGE METHODS ==================
      
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

      // ================== INITIALIZATION ==================

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
          let providerStatuses = {};
          
          if (backendAvailable) {
            try {
              const sessionResult = await get().createOrRestoreSession();
              
              if (sessionResult.success) {
                // Check all provider statuses
                providerStatuses = await get().checkAllProviderStatuses();
                connectedProviders = Object.keys(providerStatuses).filter(
                  provider => providerStatuses[provider].connected
                );
              }
            } catch (error) {
              console.warn('Provider initialization failed:', error.message);
            }
          }
          
          set({
            backendAvailable,
            localCVs,
            connectedProviders,
            providerStatuses,
            // Backward compatibility
            googleDriveConnected: connectedProviders.includes('google_drive'),
            googleDriveStatus: providerStatuses.google_drive || null,
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
          console.log('📊 Connected providers:', connectedProviders);
          return true;
          
        } catch (error) {
          console.error('❌ Initialization error:', error);
          set({
            backendAvailable: false,
            localCVs: get().loadLocalCVs(),
            connectedProviders: [],
            providerStatuses: {},
            googleDriveConnected: false,
            googleDriveStatus: null,
            loading: false,
            initializing: false,
            error: 'Running in local-only mode'
          });
          return false;
        }
      },

      // ================== UI HELPERS ==================
      
      clearError: () => set({ error: null }),
      setShowCloudSetup: (show) => set({ showCloudSetup: show }),
      
      // Capabilities
      canSaveToCloud: () => get().connectedProviders.length > 0,
      hasCloudConnection: () => get().connectedProviders.length > 0,
      hasConnectedProviders: () => get().connectedProviders.length > 0,
      
      // Get provider status
      getProviderStatus: (provider) => {
        return get().providerStatuses[provider] || { connected: false, provider };
      },
      
      // Get all connected provider details
      getConnectedProviderDetails: () => {
        const { connectedProviders, providerStatuses } = get();
        return connectedProviders.map(provider => ({
          provider,
          name: cloudProviderService.getProviderConfig(provider).name,
          status: providerStatuses[provider]
        }));
      }
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionToken: state.sessionToken,
        connectedProviders: state.connectedProviders,
        providerStatuses: state.providerStatuses,
        // Backward compatibility
        googleDriveConnected: state.googleDriveConnected,
        googleDriveStatus: state.googleDriveStatus,
        localCVs: state.localCVs
      })
    }
  )
);

export default useSessionStore;