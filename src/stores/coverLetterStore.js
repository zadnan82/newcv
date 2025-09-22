// src/stores/coverLetterStore.js - SIMPLIFIED VERSION using your existing API
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import useSessionStore from './sessionStore';

// Base API URL
const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.cvati.com';

// Helper to generate unique local IDs
const generateLocalId = (prefix = 'local_cl') => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const useCoverLetterStore = create(
  persist(
    (set, get) => ({
      // State
      coverLetters: [],
      localCoverLetters: [],
      currentLetter: null,
      isLoading: false,
      error: null,
      currentTask: null,
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Set current letter
      setCurrentLetter: (letter) => set({ currentLetter: letter }),
      
      // Clear current task
      clearCurrentTask: () => set({ currentTask: null }),

      // ================== SIMPLIFIED FETCH USING EXISTING API ==================
      // ================== COMPLETE FIXED FETCH USING EXISTING API ==================
fetchCoverLetters: async () => {
  set({ isLoading: true, error: null });
  
  try {
    console.log("📄 Fetching cover letters from all sources...");
    
    const allCoverLetters = [];
    
    // 1. Load from local storage
    const localLetters = get().loadLocalCoverLetters();
    console.log("📱 Local cover letters:", localLetters.length);
    allCoverLetters.push(...localLetters);
    
    // 2. Load from all connected cloud providers using existing API
    const sessionStore = useSessionStore.getState();
    const { connectedProviders, sessionToken } = sessionStore;
    
    if (sessionToken && connectedProviders.length > 0) {
      const favoritesList = get().loadFavoritesFromStorage();
      
      for (const provider of connectedProviders) {
        try {
          console.log(`☁️ Loading cover letters from ${provider}...`);
          
          // FIXED: Use your existing API endpoint
          const response = await fetch(`${API_BASE_URL}/api/cover-letter/list-cover-letters?provider=${provider}`, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'Content-Type': 'application/json',
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            const cloudLetters = result.cover_letters || [];
            console.log(`☁️ ${provider}: Found ${cloudLetters.length} cover letters`);
            
            // Process cloud letters - FIXED: Proper variable scoping
            const processedCloudLetters = cloudLetters.map(letter => {
              const letterId = letter.id || letter.file_id;
              return {
                id: letterId,
                title: letter.title || letter.name || 'Untitled Cover Letter',
                company_name: letter.company_name || 'Not specified',
                job_title: letter.job_title || 'Not specified',
                created_at: letter.created_at || new Date().toISOString(),
                updated_at: letter.updated_at || new Date().toISOString(),
                is_favorite: favoritesList.includes(letterId),
                recipient_name: letter.recipient_name || '',
                recipient_title: letter.recipient_title || '',
                cover_letter_content: letter.cover_letter_content || '',
                job_description: letter.job_description || '',
                author_name: letter.author_name || '',
                author_email: letter.author_email || '',
                author_phone: letter.author_phone || '',
                storageType: provider,
                provider: provider,
                syncedToCloud: true,
                file_id: letter.file_id || letterId
              };
            });
            
            allCoverLetters.push(...processedCloudLetters);
          } else {
            console.warn(`⚠️ ${provider} returned status: ${response.status}`);
          }
          
        } catch (providerError) {
          console.warn(`⚠️ Failed to load cover letters from ${provider}:`, providerError);
        }
      }
    }
    
    // 3. Remove duplicates
    const uniqueLetters = get().removeDuplicatesByContent(allCoverLetters);
    
    console.log("✅ Total unique cover letters:", uniqueLetters.length);
    
    set({ 
      coverLetters: uniqueLetters,
      localCoverLetters: localLetters,
      isLoading: false 
    });
    
    return uniqueLetters;
  } catch (error) {
    console.error('❌ Error fetching cover letters:', error);
    set({ 
      isLoading: false, 
      error: error.message || 'Failed to fetch cover letters' 
    });
    return [];
  }
},

      // ================== SIMPLIFIED SAVE USING EXISTING API ==================
      saveCoverLetter: async (coverLetterData, saveToCloud = false, preferredProvider = null) => {
        const results = {
          success: false,
          localResult: null,
          cloudResult: null,
          error: null
        };

        try {
          // ALWAYS save to local storage first
          console.log('💾 Saving cover letter locally...');
          const localSave = get().saveLocalCoverLetter(coverLetterData);
          results.localResult = localSave;
          
          // ONLY save to cloud if specifically requested
          if (saveToCloud) {
            const sessionStore = useSessionStore.getState();
            const { connectedProviders, sessionToken } = sessionStore;
            
            if (sessionToken && connectedProviders.length > 0) {
              let targetProvider = preferredProvider;
              if (!targetProvider || !connectedProviders.includes(targetProvider)) {
                targetProvider = connectedProviders[0];
              }
              
              try {
                console.log(`☁️ Saving cover letter to ${targetProvider}...`);
                
                // FIXED: Use your existing save endpoint
                const response = await fetch(`${API_BASE_URL}/api/cover-letter/save`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${sessionToken}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
  ...coverLetterData,
  save_to_cloud: true,           // ✅ CORRECT - tells backend to save to cloud
  preferred_provider: targetProvider, // ✅ CORRECT - tells backend which provider
  session_token: sessionToken
})
                });
                
                if (response.ok) {
                  const cloudSaveResult = await response.json();
                  results.cloudResult = { 
                    success: true, 
                    provider: targetProvider, 
                    file_id: cloudSaveResult.file_id,
                    message: cloudSaveResult.message
                  };
                  console.log(`✅ Cover letter saved to ${targetProvider}:`, cloudSaveResult.file_id);
                } else {
                  const errorText = await response.text();
                  throw new Error(`${targetProvider} save failed: ${response.status} - ${errorText}`);
                }
                
              } catch (cloudError) {
                console.warn('Cloud save failed, but local save succeeded:', cloudError);
                results.cloudResult = { 
                  success: false, 
                  error: cloudError.message, 
                  provider: targetProvider 
                };
              }
            } else {
              results.cloudResult = { success: false, error: 'No cloud providers connected' };
            }
          }
          
          results.success = true;
          return results;
          
        } catch (error) {
          console.error('❌ Save operation failed:', error);
          results.error = error.message;
          return results;
        }
      },

      // ================== SIMPLIFIED GET COVER LETTER ==================
    // Fixed getCoverLetter function in coverLetterStore.js
getCoverLetter: async (id) => {
  set({ isLoading: true, error: null });
  
  try {
    console.log("📄 Loading cover letter:", id);
    
    // First check if it's a local cover letter
    const localLetters = get().loadLocalCoverLetters();
    const localLetter = localLetters.find(letter => letter.id === id);
    
    if (localLetter) {
      console.log("📄 Cover letter found locally:", localLetter);
      set({ 
        currentLetter: localLetter,
        isLoading: false 
      });
      return localLetter;
    }
    
    // DETERMINE PROVIDER FROM FILE ID
    const sessionStore = useSessionStore.getState();
    const { connectedProviders, sessionToken } = sessionStore;
    
    if (!sessionToken || connectedProviders.length === 0) {
      throw new Error('No cloud providers connected');
    }
    
    // URL encode the ID to handle special characters
    const encodedId = encodeURIComponent(id);
    
    // IMPROVED PROVIDER DETECTION
    let providersToTry = [];
    
    if (id.includes('!')) {
      // OneDrive file ID pattern (contains exclamation mark)
      if (connectedProviders.includes('onedrive')) {
        providersToTry.push('onedrive');
      }
    // } else if (id.startsWith('/')) {
    //   // Dropbox file path pattern (starts with /)
    //   if (connectedProviders.includes('dropbox')) {
    //     providersToTry.push('dropbox');
    //   }
    } else {
      // Assume Google Drive for other patterns (typically alphanumeric)
      if (connectedProviders.includes('google_drive')) {
        providersToTry.push('google_drive');
      }
    }
    
    // Add remaining providers as fallback
    connectedProviders.forEach(provider => {
      if (!providersToTry.includes(provider)) {
        providersToTry.push(provider);
      }
    });
    
    console.log(`🔍 Will try providers in this order: ${providersToTry.join(', ')}`);
    
    // Try each provider in order
    for (const provider of providersToTry) {
      try {
        console.log(`🔍 Trying to load cover letter from ${provider}...`);
        
let apiUrl;
// Clean the encoded ID to prevent double slashes
let cleanEncodedId = encodedId;
if (cleanEncodedId.startsWith('/')) {
  cleanEncodedId = cleanEncodedId.substring(1);
}

if (provider === 'dropbox') {
  // FIXED: Use the correct Dropbox endpoint for cover letters with clean ID
  apiUrl = `${API_BASE_URL}/api/dropbox/cover-letters/${cleanEncodedId}`;
} else if (provider === 'google_drive') {
  // FIXED: Use the cover letter specific endpoint for Google Drive with clean ID
  apiUrl = `${API_BASE_URL}/api/google-drive/cover-letters/${cleanEncodedId}`;
} else if (provider === 'onedrive') {
  // FIXED: Use the cover letter specific endpoint for OneDrive with clean ID
  apiUrl = `${API_BASE_URL}/api/onedrive/cover-letters/${cleanEncodedId}`;
} else {
  // Fallback to generic cover letter API with clean ID
  apiUrl = `${API_BASE_URL}/api/cover-letter/${cleanEncodedId}?provider=${provider}`;
}
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          let coverLetter;
          
          if (result.cv_data) {
            // Dropbox format
            coverLetter = { ...result.cv_data, provider };
          } else if (result.cover_letter_data) {
            // Cover letter specific format
            coverLetter = { ...result.cover_letter_data, provider };
          } else {
            // Direct format
            coverLetter = { ...result, provider };
          }
          
          console.log(`✅ Cover letter found in ${provider}:`, coverLetter.title || 'Untitled');
          
          set({ 
            currentLetter: coverLetter,
            isLoading: false 
          });
          
          return coverLetter;
        } else {
          console.log(`❌ Cover letter not found in ${provider} (HTTP ${response.status})`);
        }
      } catch (providerError) {
        console.log(`❌ Cover letter not found in ${provider}:`, providerError.message);
      }
    }
    
    throw new Error('Cover letter not found in any connected provider');
    
  } catch (error) {
    console.error('❌ Error fetching cover letter:', error);
    set({ 
      isLoading: false, 
      error: error.message || 'Failed to fetch cover letter' 
    });
    return null;
  }
},

      // ================== FIXED DELETE ==================
// Replace your deleteCoverLetter function in coverLetterStore.js with this fixed version:

deleteCoverLetter: async (id) => {
  set({ isLoading: true, error: null });
  
  try {
    console.log("🗑️ Deleting cover letter:", id);
    
    // First check if it's a local cover letter
    const localLetters = get().loadLocalCoverLetters();
    const localLetter = localLetters.find(letter => letter.id === id);
    
    if (localLetter) {
      const success = get().deleteLocalCoverLetter(id);
      set({ isLoading: false });
      
      if (success) {
        const favoritesList = get().loadFavoritesFromStorage();
        const updatedFavorites = favoritesList.filter(fav => fav !== id);
        get().saveFavoritesToStorage(updatedFavorites);
        
        return { success: true, message: 'Cover letter deleted locally' };
      } else {
        throw new Error('Failed to delete local cover letter');
      }
    }
    
    // Try to delete from cloud providers using provider-specific endpoints
    const sessionStore = useSessionStore.getState();
    const { connectedProviders, sessionToken } = sessionStore;
    
    if (!sessionToken || connectedProviders.length === 0) {
      throw new Error('No cloud providers connected');
    }
    
    // Clean the ID for URL encoding (remove leading slash if present)
    let cleanId = id;
    if (cleanId.startsWith('/')) {
      cleanId = cleanId.substring(1);
    }
    const encodedId = encodeURIComponent(cleanId);
    
    // Determine the provider based on ID format
    let provider;
    if (id.includes('!')) {
      provider = 'onedrive';
    } else if (id.startsWith('/') || id.includes('Cover_Letters/') || id.includes('CVs/')) {
      provider = 'dropbox';
    } else {
      provider = 'google_drive';
    }
    
    // Make sure the determined provider is actually connected
    if (!connectedProviders.includes(provider)) {
      // Fallback to first available provider
      provider = connectedProviders[0];
      console.log(`🔄 Provider fallback to: ${provider}`);
    }
    
    console.log(`🗑️ Deleting cover letter from ${provider} with ID: ${encodedId}`);
    
    let response;
    if (provider === 'dropbox') {
      // Use Dropbox-specific endpoint
      response = await fetch(`${API_BASE_URL}/api/dropbox/cover-letters/${encodedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        }
      });
    } else if (provider === 'google_drive') {
      // Use Google Drive-specific endpoint  
      response = await fetch(`${API_BASE_URL}/api/google-drive/cover-letters/${encodedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        }
      });
    } else if (provider === 'onedrive') {
      // Use OneDrive-specific endpoint
      response = await fetch(`${API_BASE_URL}/api/onedrive/cover-letters/${encodedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        }
      });
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    if (response.ok) {
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Cover letter deleted from ${provider}`);
        
        // Remove from favorites
        const favoritesList = get().loadFavoritesFromStorage();
        const updatedFavorites = favoritesList.filter(fav => fav !== id);
        get().saveFavoritesToStorage(updatedFavorites);
        
        // Update state
        set(state => ({
          coverLetters: state.coverLetters.filter(letter => letter.id !== id),
          isLoading: false
        }));
        
        return result;
      } else {
        throw new Error(result.error || `Delete failed in ${provider}`);
      }
    } else {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Error deleting cover letter:', error);
    set({ 
      isLoading: false, 
      error: error.message || 'Failed to delete cover letter' 
    });
    throw error;
  }
},

// ================== FIXED UPDATE ==================
 
updateCoverLetter: async (id, updateData) => {
  set({ isLoading: true, error: null });
  
  try {
    console.log("📝 Updating cover letter:", id);
    
    // First check if it's a local cover letter
    const localLetters = get().loadLocalCoverLetters();
    const localLetter = localLetters.find(letter => letter.id === id);
    
    if (localLetter) {
      const updatedLetter = { ...localLetter, ...updateData, lastModified: new Date().toISOString() };
      const success = get().saveLocalCoverLetter(updatedLetter);
      set({ isLoading: false });
      
      if (success.success) {
        set(state => ({
          coverLetters: state.coverLetters.map(letter => 
            letter.id === id ? updatedLetter : letter
          )
        }));
        return { success: true, message: 'Cover letter updated locally' };
      } else {
        throw new Error('Failed to update local cover letter');
      }
    }
    
    // Try to update in cloud providers using provider-specific endpoints
    const sessionStore = useSessionStore.getState();
    const { connectedProviders, sessionToken } = sessionStore;
    
    if (!sessionToken || connectedProviders.length === 0) {
      throw new Error('No cloud providers connected');
    }
    
    // Clean the ID for URL encoding (remove leading slash if present)
    let cleanId = id;
    if (cleanId.startsWith('/')) {
      cleanId = cleanId.substring(1);
    }
    const encodedId = encodeURIComponent(cleanId);
    
    // Determine the provider based on ID format
    let provider;
    if (id.includes('!')) {
      provider = 'onedrive';
    } else if (id.startsWith('/') || id.includes('Cover_Letters/') || id.includes('CVs/')) {
      provider = 'dropbox';
    } else {
      provider = 'google_drive';
    }
    
    // Make sure the determined provider is actually connected
    if (!connectedProviders.includes(provider)) {
      // Fallback to first available provider
      provider = connectedProviders[0];
      console.log(`🔄 Provider fallback to: ${provider}`);
    }
    
    console.log(`📝 Updating cover letter in ${provider} with ID: ${encodedId}`);
    
    let response;
    if (provider === 'dropbox') {
      // Use Dropbox-specific endpoint
      response = await fetch(`${API_BASE_URL}/api/dropbox/cover-letters/${encodedId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
    } else if (provider === 'google_drive') {
      // Use Google Drive-specific endpoint  
      response = await fetch(`${API_BASE_URL}/api/google-drive/cover-letters/${encodedId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
    } else if (provider === 'onedrive') {
      // Use OneDrive-specific endpoint
      response = await fetch(`${API_BASE_URL}/api/onedrive/cover-letters/${encodedId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    if (response.ok) {
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Cover letter updated in ${provider}`);
        
        set(state => ({
          coverLetters: state.coverLetters.map(letter => 
            letter.id === id ? { ...letter, ...updateData } : letter
          ),
          isLoading: false
        }));
        
        return result;
      } else {
        throw new Error(result.error || `Update failed in ${provider}`);
      }
    } else {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Error updating cover letter:', error);
    set({ 
      isLoading: false, 
      error: error.message || 'Failed to update cover letter' 
    });
    throw error;
  }
},

      // ================== GENERATION USING EXISTING API ==================
      generateCoverLetter: async (formData) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log("🤖 Generating cover letter...");
          
          const sessionStore = useSessionStore.getState();
          const { sessionToken } = sessionStore;
          
          if (!sessionToken) {
            throw new Error('No session token found');
          }
          
          // FIXED: Use your existing generation endpoint
          const response = await fetch(`${API_BASE_URL}/api/cover-letter/generate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
            },
            body: formData
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }
          
          const result = await response.json();
          console.log("✅ Cover letter generation response:", result);
          
          if (result.task_id) {
            set({ 
              currentTask: {
                id: result.task_id,
                status: result.status || 'processing'
              }
            });
          } else {
            set({ isLoading: false });
          }
          
          return result;
        } catch (error) {
          console.error("❌ Cover letter generation failed:", error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to generate cover letter' 
          });
          throw error;
        }
      },

      checkTaskStatus: async (taskId) => {
        const { currentTask } = get();
        
        if (!taskId && (!currentTask || !currentTask.id)) {
          return null;
        }
        
        const id = taskId || currentTask.id;
        
        try {
          const sessionStore = useSessionStore.getState();
          const { sessionToken } = sessionStore;
          
          if (!sessionToken) {
            throw new Error('No session token found');
          }
          
          const response = await fetch(`${API_BASE_URL}/api/cover-letter/task-status/${id}`, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }
          
          const result = await response.json();
          
          const updatedTask = {
            id: result.task_id,
            status: result.status,
            result: result.result,
            error: result.error,
            message: result.message,
            completedAt: result.completed_at
          };
          
          set({ currentTask: updatedTask });
          
          if (result.status === 'completed') {
            set({ 
              isLoading: false,
              currentTask: null
            });
          }
          
          if (result.status === 'failed') {
            set({ 
              isLoading: false,
              error: result.error || 'Cover letter generation failed',
              currentTask: null
            });
          }
          
          return result;
        } catch (error) {
          console.error('❌ Error checking task status:', error);
          return null;
        }
      },

      // ================== LOCAL STORAGE METHODS (unchanged) ==================
      saveLocalCoverLetter: (coverLetterData) => {
        try {
          console.log("💾 Saving cover letter locally...");
          
          const localCoverLetters = get().loadLocalCoverLetters();
          const clId = coverLetterData.id || generateLocalId();
          
          const coverLetterWithMeta = {
            ...coverLetterData,
            id: clId,
            storageType: 'local',
            lastModified: new Date().toISOString(),
            createdAt: coverLetterData.createdAt || new Date().toISOString(),
            syncedToCloud: false
          };
          
          const existingIndex = localCoverLetters.findIndex(cl => cl.id === clId);
          if (existingIndex >= 0) {
            localCoverLetters[existingIndex] = coverLetterWithMeta;
          } else {
            localCoverLetters.push(coverLetterWithMeta);
          }

          localStorage.setItem('local_cover_letters', JSON.stringify(localCoverLetters));
          
          const allCoverLetters = [...localCoverLetters, ...get().getCoverLettersFromCloud()];
          
          set({ 
            localCoverLetters,
            coverLetters: allCoverLetters
          });
          
          console.log("✅ Cover letter saved locally:", clId);
          
          return { 
            success: true, 
            coverLetter: coverLetterWithMeta,
            message: "Cover letter saved locally"
          };
          
        } catch (error) {
          console.error('❌ Local save error:', error);
          return { 
            success: false, 
            error: error.message || "Failed to save locally" 
          };
        }
      },

      loadLocalCoverLetters: () => {
        try {
          const stored = localStorage.getItem('local_cover_letters');
          return stored ? JSON.parse(stored) : [];
        } catch (error) {
          console.error('❌ Error loading local cover letters:', error);
          return [];
        }
      },

      deleteLocalCoverLetter: (id) => {
        try {
          const localCoverLetters = get().loadLocalCoverLetters();
          const filtered = localCoverLetters.filter(cl => cl.id !== id);
          localStorage.setItem('local_cover_letters', JSON.stringify(filtered));
          
          const allCoverLetters = [...filtered, ...get().getCoverLettersFromCloud()];
          set({ 
            localCoverLetters: filtered,
            coverLetters: allCoverLetters 
          });
          
          console.log("✅ Local cover letter deleted:", id);
          return true;
        } catch (error) {
          console.error('❌ Error deleting local cover letter:', error);
          return false;
        }
      },

      getCoverLettersFromCloud: () => {
        const { coverLetters, localCoverLetters } = get();
        return coverLetters.filter(cl => 
          !localCoverLetters.some(local => local.id === cl.id) &&
          cl.storageType !== 'local'
        );
      },

      loadFavoritesFromStorage: () => {
        try {
          const favoritesList = JSON.parse(localStorage.getItem('cover_letter_favorites') || '[]');
          return favoritesList;
        } catch (error) {
          console.warn('⚠️ Failed to load favorites from localStorage:', error);
          return [];
        }
      },

      saveFavoritesToStorage: (favoritesList) => {
        try {
          localStorage.setItem('cover_letter_favorites', JSON.stringify(favoritesList));
          console.log(`💾 Favorites saved to localStorage:`, favoritesList);
        } catch (storageError) {
          console.warn('⚠️ Failed to save favorites to localStorage:', storageError);
        }
      },

      // ================== TOGGLE FAVORITE ==================
      toggleFavorite: async (id) => {
        try {
          const currentLetters = get().coverLetters;
          const letterIndex = currentLetters.findIndex(letter => letter.id === id);
          
          if (letterIndex === -1) {
            throw new Error('Cover letter not found');
          }
          
          const currentLetter = currentLetters[letterIndex];
          const newFavoriteStatus = !currentLetter.is_favorite;
          
          // Update UI immediately
          const updatedLetters = [...currentLetters];
          updatedLetters[letterIndex] = { 
            ...currentLetter, 
            is_favorite: newFavoriteStatus 
          };
          
          set({ coverLetters: updatedLetters });
          
          // Update localStorage
          const favoritesList = get().loadFavoritesFromStorage();
          
          if (newFavoriteStatus) {
            if (!favoritesList.includes(id)) {
              favoritesList.push(id);
            }
          } else {
            const index = favoritesList.indexOf(id);
            if (index > -1) {
              favoritesList.splice(index, 1);
            }
          }
          
          get().saveFavoritesToStorage(favoritesList);
          
          // Try to sync with backend (graceful failure)
          try {
            await get().updateCoverLetter(id, {
              is_favorite: newFavoriteStatus,
              updated_at: new Date().toISOString()
            });
            console.log(`✅ Favorite synced to backend: ${id} = ${newFavoriteStatus}`);
          } catch (backendError) {
            console.warn('⚠️ Failed to sync favorite to backend:', backendError);
          }
          
          console.log(`📌 Toggled favorite: ${id} = ${newFavoriteStatus}`);
          return true;
          
        } catch (error) {
          console.error('❌ Error toggling favorite:', error);
          throw error;
        }
      },

      // ================== UTILITY METHODS ==================
      removeDuplicatesByContent: (letters) => {
  const seen = new Map();
  
  for (const letter of letters) {
    // Use provider-specific unique identifier
    let uniqueKey;
    
    if (letter.storageType === 'local') {
      uniqueKey = `local_${letter.id}`;
    } else {
      // For cloud letters, use provider + file_id to ensure uniqueness
      uniqueKey = `${letter.provider}_${letter.file_id || letter.id}`;
    }
    
    // Only add if we haven't seen this exact letter before
    if (!seen.has(uniqueKey)) {
      seen.set(uniqueKey, letter);
    } else {
      console.log(`🔄 Skipping duplicate letter: ${uniqueKey}`);
    }
  }
  
  const result = Array.from(seen.values());
  console.log(`✅ Deduplication: ${letters.length} → ${result.length} letters`);
  return result;
},

      formatCoverLetter: (letter) => {
  try {
    console.log("🔍 Formatting cover letter:", letter);
    
    let formattedLetter = '';
    let contentObj = null;
    
    // Handle Dropbox structure (nested in cover_letter_data)
    let coverLetterData = letter;
    if (letter.cover_letter_data) {
      coverLetterData = letter.cover_letter_data;
    }
    
    // Handle different content structures
    if (coverLetterData.cover_letter_content) {
      try {
        if (typeof coverLetterData.cover_letter_content === 'string') {
          contentObj = JSON.parse(coverLetterData.cover_letter_content);
        } else {
          contentObj = coverLetterData.cover_letter_content;
        }
      } catch (e) {
        console.warn("Failed to parse cover letter content as JSON:", e);
        return coverLetterData.cover_letter_content;
      }
    } else if (coverLetterData.cover_letter) {
      contentObj = coverLetterData.cover_letter;
    } else {
      contentObj = {
        greeting: 'Dear Hiring Manager,',
        introduction: '',
        body_paragraphs: [''],
        closing: '',
        signature: 'Sincerely,'
      };
    }
    
    // Get personal info for header - check both locations
    const applicantInfo = coverLetterData.applicant_info || letter.applicant_info || {};
    const personalInfo = {
      full_name: applicantInfo.name || coverLetterData.author_name || letter.author_name || '',
      email: applicantInfo.email || coverLetterData.author_email || letter.author_email || '',
      mobile: applicantInfo.phone || coverLetterData.author_phone || letter.author_phone || ''
    };
    
    // Build formatted letter
    if (personalInfo.full_name) formattedLetter += `${personalInfo.full_name}\n`;
    if (personalInfo.email) formattedLetter += `${personalInfo.email}\n`;
    if (personalInfo.mobile) formattedLetter += `${personalInfo.mobile}\n\n`;
    
    // Add date
    formattedLetter += `${new Date().toLocaleDateString()}\n\n`;
    
    // Add company info
    if (coverLetterData.company_name) formattedLetter += `${coverLetterData.company_name}\n`;
    if (coverLetterData.recipient_name) formattedLetter += `${coverLetterData.recipient_name}\n`;
    if (coverLetterData.recipient_title) formattedLetter += `${coverLetterData.recipient_title}\n`;
    formattedLetter += '\n';
    
    // Add greeting
    if (contentObj.greeting) {
      formattedLetter += `${contentObj.greeting}\n\n`;
    }
    
    // Add introduction
    if (contentObj.introduction) {
      formattedLetter += `${contentObj.introduction}\n\n`;
    }
    
    // Add body paragraphs
    if (Array.isArray(contentObj.body_paragraphs)) {
      contentObj.body_paragraphs.forEach(paragraph => {
        if (paragraph) formattedLetter += `${paragraph}\n\n`;
      });
    } else if (Array.isArray(contentObj.body)) {
      contentObj.body.forEach(paragraph => {
        if (paragraph) formattedLetter += `${paragraph}\n\n`;
      });
    }
    
    // Add closing
    if (contentObj.closing) {
      formattedLetter += `${contentObj.closing}\n\n`;
    }
    
    // Add signature
    if (contentObj.signature) {
      formattedLetter += contentObj.signature.replace(/\\n/g, '\n');
    } else {
      formattedLetter += `Sincerely,\n${personalInfo.full_name}`;
    }
    
    console.log("✅ Cover letter formatted successfully");
    return formattedLetter;
    
  } catch (error) {
    console.error("❌ Error formatting cover letter:", error);
    return "Error formatting cover letter content.";
  }
},

      getConnectedProviders: () => {
        const sessionStore = useSessionStore.getState();
        return sessionStore.connectedProviders || [];
      },

      getPreferredProvider: () => {
        const sessionStore = useSessionStore.getState();
        return sessionStore.getPreferredProvider?.() || null;
      },
    }),
    {
      name: 'new-cover-letter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        coverLetters: state.coverLetters,
        localCoverLetters: state.localCoverLetters,
      }),
    }
  )
);

export default useCoverLetterStore;