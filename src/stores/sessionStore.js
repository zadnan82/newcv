// src/stores/sessionStore.js - Updated for multi-provider support
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL, checkBackendAvailability } from '../config';
import cloudProviderService from '../services/cloudProviderService';

let globalInitialized = false;

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

      // In sessionStore.js - update the connectToCloudProvider method
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

      // In sessionStore.js - update checkAllProviderStatuses
checkAllProviderStatuses: async () => {
  const { sessionToken } = get();
  
  if (!sessionToken) {
    return {};
  }

  cloudProviderService.setSessionToken(sessionToken);
  
  const availableProviders = cloudProviderService.getAvailableProviders();
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


      // In sessionStore.js - make sure this method uses the provider parameter
handleOAuthReturn: async (provider) => {
  console.log(`✅ Handling ${provider} OAuth return`); // Should log "onedrive" not "google_drive"
  
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
      
      cleanCVDataForAPI: (cvData) => {
        console.log('🧹 Cleaning CV data for API...');
        const cleaned = JSON.parse(JSON.stringify(cvData)); // Deep clone
        
        // Check for large image data and warn
        const dataSize = JSON.stringify(cleaned).length;
        console.log(`📊 CV data size: ${(dataSize / 1024).toFixed(1)}KB`);
        
        if (dataSize > 500000) { // 500KB
          console.warn('⚠️ Large CV data detected. This may cause timeout issues.');
        }
        
        // Helper function to validate and fix email
        const validateEmail = (email) => {
          if (!email || email.trim() === '') return null;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email.trim()) ? email.trim() : null;
        };
        
        // Helper function to convert partial dates to full dates
        const formatDateForAPI = (dateStr) => {
          if (!dateStr || dateStr.trim() === '') return null;
          
          // If it's already a full date (YYYY-MM-DD), return as is
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
          }
          
          // If it's a partial date (YYYY-MM), convert to YYYY-MM-01
          if (/^\d{4}-\d{2}$/.test(dateStr)) {
            return `${dateStr}-01`;
          }
          
          // If it's just a year (YYYY), convert to YYYY-01-01
          if (/^\d{4}$/.test(dateStr)) {
            return `${dateStr}-01-01`;
          }
          
          console.warn(`⚠️ Invalid date format: ${dateStr}, setting to null`);
          return null;
        };
        
        // Clean personal_info fields
        if (cleaned.personal_info) {
          // Handle date of birth
          cleaned.personal_info.date_of_birth = formatDateForAPI(cleaned.personal_info.date_of_birth);
          
          // Validate email
          if (cleaned.personal_info.email) {
            const validEmail = validateEmail(cleaned.personal_info.email);
            if (!validEmail) {
              console.warn(`⚠️ Invalid email format: ${cleaned.personal_info.email}, setting to null`);
            }
            cleaned.personal_info.email = validEmail;
          }
          
          // Clean other potentially problematic fields
          const fieldsToClean = [
            'full_name', 'title', 'mobile', 'city', 'address', 
            'postal_code', 'driving_license', 'nationality', 'place_of_birth',
            'linkedin', 'website', 'summary'
          ];
          
          fieldsToClean.forEach(field => {
            if (cleaned.personal_info[field] === '') {
              cleaned.personal_info[field] = null;
            }
          });
        }
        
        // Clean array sections with enhanced validation
        const sectionsToClean = [
          'educations', 'experiences', 'skills', 'languages', 'referrals',
          'custom_sections', 'extracurriculars', 'hobbies', 'courses', 'internships'
        ];
        
        sectionsToClean.forEach(section => {
          if (Array.isArray(cleaned[section])) {
            cleaned[section] = cleaned[section].map(item => {
              const cleanedItem = { ...item };
              
              // Clean and format date fields in array items
              if ('start_date' in cleanedItem) {
                cleanedItem.start_date = formatDateForAPI(cleanedItem.start_date);
              }
              if ('end_date' in cleanedItem) {
                cleanedItem.end_date = formatDateForAPI(cleanedItem.end_date);
              }
              if ('date_of_birth' in cleanedItem) {
                cleanedItem.date_of_birth = formatDateForAPI(cleanedItem.date_of_birth);
              }
              
              // Validate email fields in array items (like referrals)
              if ('email' in cleanedItem && cleanedItem.email) {
                const validEmail = validateEmail(cleanedItem.email);
                if (!validEmail) {
                  console.warn(`⚠️ Invalid email in ${section}: ${cleanedItem.email}, setting to null`);
                }
                cleanedItem.email = validEmail;
              }
              
              // Clean other empty string fields to null
              Object.keys(cleanedItem).forEach(key => {
                if (cleanedItem[key] === '') {
                  cleanedItem[key] = null;
                }
              });
              
              return cleanedItem;
            });
            
            // Remove any items that are completely empty or invalid
            cleaned[section] = cleaned[section].filter(item => {
              // Keep item if it has at least one non-null, meaningful value
              return Object.values(item).some(value => 
                value !== null && value !== '' && value !== undefined
              );
            });
          }
        });
        
        // Clean photo field - handle both 'photo' and 'photos' for backward compatibility
        if (cleaned.photo && cleaned.photo.photolink === '') {
          cleaned.photo.photolink = null;
        }
        if (cleaned.photos && cleaned.photos.photolink === '') {
          cleaned.photos.photolink = null;
        }
        
        // Check if photo data is very large
        if (cleaned.photo && cleaned.photo.photolink && typeof cleaned.photo.photolink === 'string') {
          const photoSize = cleaned.photo.photolink.length;
          if (photoSize > 100000) { // 100KB base64
            console.warn(`⚠️ Large photo detected: ${(photoSize / 1024).toFixed(1)}KB. Consider compressing.`);
          }
        }
        
        console.log('✅ CV data cleaned and validated successfully');
        return cleaned;
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