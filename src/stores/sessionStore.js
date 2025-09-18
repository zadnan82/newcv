// src/stores/sessionStore.js - Fixed version with proper Google Drive CV loading

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL, checkBackendAvailability, GOOGLE_DRIVE_ENDPOINTS } from '../config';

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

      // ================== HELPER METHODS ==================
      
      // Helper methods with comprehensive validation and formatting
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

      // ================== GOOGLE DRIVE CV OPERATIONS ==================

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
          
          // Clean the data before sending
          const cleanedData = get().cleanCVDataForAPI(cvData);
          
          // Check data size before sending
          const dataSize = JSON.stringify(cleanedData).length;
          const dataSizeKB = (dataSize / 1024).toFixed(1);
          
          console.log('💾 Sending cleaned CV to Google Drive API...');
          console.log(`📊 Final CV data size: ${dataSizeKB}KB (${dataSize} bytes)`);

          // Add timeout handling - increased to 90 seconds
          const controller = new AbortController();
          
          const timeoutId = setTimeout(() => {
            console.error('⏰ Request timed out after 90 seconds');
            controller.abort();
          }, 90000);

          const startTime = Date.now();
          console.log('🚀 Starting fetch request at:', new Date().toISOString());

          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.SAVE, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(cleanedData),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          
          const endTime = Date.now();
          const duration = ((endTime - startTime) / 1000).toFixed(2);
          console.log(`📊 Request completed in ${duration} seconds`);

          if (response.ok) {
            const responseText = await response.text();
            
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
              message: result.message || 'CV saved to Google Drive successfully'
            };
          } else {
            const responseText = await response.text();
            console.error('❌ Google Drive save failed:', response.status, responseText);
            
            set({ loading: false });
            
            let errorMessage = `Save failed: ${response.status}`;
            
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch (e) {
              if (responseText.includes('504 Gateway Time-out')) {
                errorMessage = 'Request timed out. The file might be too large. Try with a smaller image.';
              } else if (responseText.includes('413 Request Entity Too Large')) {
                errorMessage = 'File too large. Please use a smaller image.';
              } else if (responseText.includes('502 Bad Gateway')) {
                errorMessage = 'Server temporarily unavailable. Please try again in a moment.';
              } else {
                errorMessage = responseText || errorMessage;
              }
            }
            
            return { 
              success: false, 
              error: errorMessage 
            };
          }
          
        } catch (error) {
          console.error('❌ Google Drive save error:', error);
          set({ loading: false, error: error.message });
          
          // Handle specific error types
          if (error.name === 'AbortError') {
            const dataSize = JSON.stringify(cvData).length;
            const sizeKB = (dataSize / 1024).toFixed(1);
            
            let message = `Request timed out after 90 seconds (CV size: ${sizeKB}KB).`;
            
            if (dataSize > 500000) {
              message += ' Your CV appears to have large image data. Try compressing or removing the photo, or use a smaller image.';
            } else if (dataSize > 100000) {
              message += ' Try reducing the image size or check your internet connection.';
            } else {
              message += ' This might be due to a slow connection or server issue. Please try again.';
            }
            
            return { 
              success: false, 
              error: message 
            };
          }
          
          return { 
            success: false, 
            error: `Save failed: ${error.message}` 
          };
        }
      },

      // FIXED: List CVs from Google Drive - using config endpoints
      listGoogleDriveCVs: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('📋 Listing CVs from Google Drive...');
          
          // Use the predefined endpoint from config.js
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.LIST, {
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('📋 Google Drive API response:', result);
            
            // Handle the response structure properly
            let files = [];
            
            if (result.files && Array.isArray(result.files)) {
              // If result has a files property with an array
              files = result.files;
            } else if (Array.isArray(result)) {
              // If result is directly an array
              files = result;
            } else {
              console.warn('⚠️ Unexpected Google Drive API response structure:', result);
              files = [];
            }
            
            console.log(`📋 Extracted ${files.length} Google Drive files:`, files);
            
            return files; // Return just the files array
          } else {
            const errorText = await response.text();
            console.error('❌ Google Drive list API error:', response.status, errorText);
            throw new Error(`List failed: ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive list failed:', error);
          throw error;
        }
      },

      // Load CV from Google Drive - using config endpoints  
      loadGoogleDriveCV: async (fileId) => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('📥 Loading CV from Google Drive:', fileId);
          
          // Use the predefined endpoint from config.js
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.LOAD(fileId), {
            headers: { 'Authorization': `Bearer ${sessionToken}` }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('📥 Google Drive CV load response:', result);
            
            // The backend returns: {"success": True, "provider": "google_drive", "cv_data": response_data}
            if (result.success && result.cv_data) {
              console.log(`✅ Successfully loaded CV from Google Drive: ${fileId}`);
              return result.cv_data; // Return just the CV data
            } else {
              console.error('❌ Invalid response structure from Google Drive load:', result);
              return null;
            }
          } else {
            const errorText = await response.text();
            console.error('❌ Google Drive load failed:', response.status, errorText);
            throw new Error(`Load failed: ${response.status} - ${errorText}`);
          }
        } catch (error) {
          console.error('❌ Google Drive load error:', error);
          throw error;
        }
      },

      // Delete CV from Google Drive - using config endpoints
      deleteGoogleDriveCV: async (fileId) => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('🗑️ Deleting CV from Google Drive:', fileId);
          
          // Use the predefined endpoint from config.js
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

      // Disconnect Google Drive - using config endpoints
      disconnectGoogleDrive: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('🔓 Disconnecting Google Drive...');
          
          // Use the predefined endpoint from config.js
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

      // Get debug info - using config endpoints
      getGoogleDriveDebugInfo: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('🐛 Getting Google Drive debug info...');
          
          // Use the predefined endpoint from config.js
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

      // Test Google Drive connection with minimal data - using config endpoints
      testMinimalSave: async () => {
        const { sessionToken } = get();
        
        if (!sessionToken) {
          throw new Error('No session token available');
        }

        try {
          console.log('🧪 Testing minimal save to Google Drive...');
          
          // Create minimal test CV
          const testCV = {
            title: "Test CV",
            is_public: false,
            personal_info: {
              full_name: "Test User"
            },
            educations: [],
            experiences: [],
            skills: [],
            languages: [],
            referrals: [],
            custom_sections: [],
            extracurriculars: [],
            hobbies: [],
            courses: [],
            internships: [],
            photo: { photolink: null }
          };
          
          // Use the predefined endpoint from config.js
          const response = await fetch(GOOGLE_DRIVE_ENDPOINTS.SAVE, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(testCV)
          });

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Minimal save test successful:', result);
            return { success: true, result };
          } else {
            const errorText = await response.text();
            console.error('❌ Minimal save test failed:', response.status, errorText);
            return { success: false, error: errorText };
          }
        } catch (error) {
          console.error('❌ Minimal save test error:', error);
          return { success: false, error: error.message };
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

      // ================== UI HELPERS ==================
      
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