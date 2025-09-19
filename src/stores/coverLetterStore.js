// src/stores/newCoverLetterStore.js - COMPLETELY NEW CLEAN VERSION
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import useSessionStore from './sessionStore';

// Base API URL
const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.cvati.com';

// Clean Cover Letter API Endpoints - HARDCODED to avoid config issues
const COVER_LETTER_API = {
  LIST: `${API_BASE_URL}/api/google-drive/cover-letters`,
  SAVE:`${API_BASE_URL}/api/google-drive/cover-letter/save-cover-letter`,
  LOAD: (id) => `${API_BASE_URL}/api/google-drive/cover-letters/${id}`,
  DELETE: (id) => `${API_BASE_URL}/api/google-drive/cover-letters/${id}`,
  UPDATE: (id) => `${API_BASE_URL}/api/google-drive/cover-letters/${id}`,
  GENERATE: `${API_BASE_URL}/api/cover-letter/generate`,
  TASK_STATUS: (taskId) => `${API_BASE_URL}/api/cover-letter/task-status/${taskId}`,
};

// Helper to generate unique local IDs
const generateLocalId = (prefix = 'local_cl') => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const useNewCoverLetterStore = create(
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

      // LOCAL STORAGE METHODS
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

      // FAVORITES MANAGEMENT
      loadFavoritesFromStorage: () => {
        try {
          const favoritesList = JSON.parse(localStorage.getItem('cover_letter_favorites') || '[]');
          console.log('📂 Loaded favorites from localStorage:', favoritesList);
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

      // API HELPER
      makeApiCall: async (url, method = 'GET', body = null) => {
        const sessionToken = useSessionStore.getState().sessionToken;
        
        if (!sessionToken) {
          throw new Error('No session token found. Please refresh the page.');
        }

        console.log(`🔄 API Call: ${method} ${url}`);

        const config = {
          method,
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          }
        };

        if (body && method !== 'GET') {
          config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);

        console.log(`📡 Response: ${response.status} from ${url}`);

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`❌ API Error: ${response.status}`, errorData);
          throw new Error(`HTTP ${response.status}: ${errorData}`);
        }

        return response.json();
      },

      // CLOUD OPERATIONS

      // Fetch all cover letters
      // Fetch all cover letters from both local and cloud storage
fetchCoverLetters: async () => {
  set({ isLoading: true, error: null });
  
  try {
    console.log("🔄 Fetching cover letters from all sources...");
    
    const allCoverLetters = [];
    
    // 1. Load from local storage
    const localLetters = get().loadLocalCoverLetters();
    console.log("📱 Local cover letters:", localLetters.length);
    allCoverLetters.push(...localLetters);
    
    // 2. Load from Google Drive (if connected)
    const { googleDriveConnected } = useSessionStore.getState();
    if (googleDriveConnected) {
      try {
        // Load favorites from localStorage
        const favoritesList = get().loadFavoritesFromStorage();
        
        // Make API call to Google Drive
        const result = await get().makeApiCall(COVER_LETTER_API.LIST);
        console.log("☁️ Google Drive response:", result);
        
        const driveLetters = result.success && result.cover_letters ? result.cover_letters : [];
        
        // Process Google Drive letters and mark them as cloud storage
        const processedDriveLetters = driveLetters.map(letter => ({
          id: letter.id,
          title: letter.title || 'Untitled Cover Letter',
          company_name: letter.company_name || 'Not specified',
          job_title: letter.job_title || 'Not specified',
          created_at: letter.created_at || new Date().toISOString(),
          updated_at: letter.updated_at || new Date().toISOString(),
          is_favorite: favoritesList.includes(letter.id),
          recipient_name: letter.recipient_name || '',
          recipient_title: letter.recipient_title || '',
          cover_letter_content: letter.cover_letter_content || '',
          job_description: letter.job_description || '',
          author_name: letter.author_name || '',
          author_email: letter.author_email || '',
          author_phone: letter.author_phone || '',
          storageType: 'google-drive', // Mark as Google Drive
          syncedToCloud: true
        }));
        
        console.log("☁️ Google Drive cover letters:", processedDriveLetters.length);
        allCoverLetters.push(...processedDriveLetters);
      } catch (driveError) {
        console.warn("⚠️ Failed to load from Google Drive:", driveError);
        // Continue with local letters only
      }
    }
    
    // 3. Remove duplicates (prefer Google Drive version if both exist)
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


// Add this helper function inside your store object
removeDuplicatesByContent: (letters) => {
  const seen = new Map();
  
  for (const letter of letters) {
    // Create a key based on title, company, and job title
    const key = `${(letter.title || '').toLowerCase()}-${(letter.company_name || '').toLowerCase()}-${(letter.job_title || '').toLowerCase()}`;
    
    if (!seen.has(key)) {
      seen.set(key, letter);
    } else {
      // If duplicate exists, prefer Google Drive version
      const existing = seen.get(key);
      if (letter.storageType === 'google-drive' && existing.storageType === 'local') {
        seen.set(key, letter);
      }
    }
  }
  
  return Array.from(seen.values());
},

      // Load single cover letter
      getCoverLetter: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log("🔄 Loading cover letter:", id);
          console.log("🔗 Using URL:", COVER_LETTER_API.LOAD(id));
          
          const result = await get().makeApiCall(COVER_LETTER_API.LOAD(id));
          console.log("📄 Cover letter loaded:", result);
          
          let coverLetter = null;
          
          if (result.success && result.cover_letter_data) {
            coverLetter = result.cover_letter_data;
            console.log("✅ Cover letter data extracted:", coverLetter);
          }
          
          set({ 
            currentLetter: coverLetter,
            isLoading: false 
          });
          
          return coverLetter;
        } catch (error) {
          console.error('❌ Error fetching cover letter:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch cover letter' 
          });
          return null;
        }
      },

      // Delete cover letter
      deleteCoverLetter: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log("🗑️ Deleting cover letter:", id);
          console.log("🔗 Using URL:", COVER_LETTER_API.DELETE(id));
          
          const sessionToken = useSessionStore.getState().sessionToken;
          
          if (!sessionToken) {
            throw new Error('No session token found');
          }

          const response = await fetch(COVER_LETTER_API.DELETE(id), {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
            }
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }

          const result = await response.json();
          console.log("✅ Cover letter deleted successfully:", result);
          
          // Remove from favorites in localStorage
          const favoritesList = get().loadFavoritesFromStorage();
          const updatedFavorites = favoritesList.filter(fav => fav !== id);
          get().saveFavoritesToStorage(updatedFavorites);
          
          // Update state
          set(state => ({
            coverLetters: state.coverLetters.filter(letter => letter.id !== id),
            isLoading: false
          }));
          
          return result;
        } catch (error) {
          console.error('❌ Error deleting cover letter:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to delete cover letter' 
          });
          throw error;
        }
      },

      // Update cover letter
      updateCoverLetter: async (id, updateData) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log("🔄 Updating cover letter:", id);
          
          const result = await get().makeApiCall(COVER_LETTER_API.UPDATE(id), 'PUT', updateData);
          
          set(state => ({
            coverLetters: state.coverLetters.map(letter => 
              letter.id === id ? { ...letter, ...updateData } : letter
            ),
            isLoading: false
          }));
          
          return result;
        } catch (error) {
          console.error('❌ Error updating cover letter:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to update cover letter' 
          });
          throw error;
        }
      },

      // Toggle favorite
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

      // GENERATION AND TASKS
      
      // Generate cover letter
      generateCoverLetter: async (formData) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log("🤖 Generating cover letter...");
          
          const sessionToken = useSessionStore.getState().sessionToken;
          
          if (!sessionToken) {
            throw new Error('No session token found');
          }
          
          const response = await fetch(COVER_LETTER_API.GENERATE, {
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

      // Check task status
      checkTaskStatus: async (taskId) => {
        const { currentTask } = get();
        
        if (!taskId && (!currentTask || !currentTask.id)) {
          return null;
        }
        
        const id = taskId || currentTask.id;
        
        try {
          const response = await get().makeApiCall(COVER_LETTER_API.TASK_STATUS(id));
          
          const updatedTask = {
            id: response.task_id,
            status: response.status,
            result: response.result,
            error: response.error,
            message: response.message,
            completedAt: response.completed_at
          };
          
          set({ currentTask: updatedTask });
          
          if (response.status === 'completed') {
            set({ 
              isLoading: false,
              currentTask: null
            });
          }
          
          if (response.status === 'failed') {
            set({ 
              isLoading: false,
              error: response.error || 'Cover letter generation failed',
              currentTask: null
            });
          }
          
          return response;
        } catch (error) {
          console.error('❌ Error checking task status:', error);
          return null;
        }
      },

     saveCoverLetter: async (coverLetterData, saveToCloud = false) => {
  const results = {
    success: false,
    localResult: null,
    cloudResult: null,
    error: null
  };

  try {
    // ALWAYS save to local storage first (as backup)
    const localSave = get().saveLocalCoverLetter(coverLetterData);
    results.localResult = localSave;
    
    // ONLY save to cloud if specifically requested
    if (saveToCloud) {
      const { googleDriveConnected } = useSessionStore.getState();
      if (googleDriveConnected) {
        try {
          // Save to Google Drive via API
          const cloudSave = await get().makeApiCall(COVER_LETTER_API.SAVE, 'POST', {
            ...coverLetterData,
            storageType: 'google-drive'
          });
          results.cloudResult = cloudSave;
        } catch (cloudError) {
          console.warn('Cloud save failed, but local save succeeded:', cloudError);
          results.cloudResult = { success: false, error: cloudError.message };
        }
      } else {
        results.cloudResult = { success: false, error: 'Google Drive not connected' };
      }
    }
    
    results.success = true;
    return results;
    
  } catch (error) {
    results.error = error.message;
    return results;
  }
},

      // FORMAT COVER LETTER FOR DISPLAY
      formatCoverLetter: (letter) => {
        try {
          console.log("📝 Formatting cover letter:", letter);
          
          let formattedLetter = '';
          let contentObj = null;
          
          // Handle different content structures
          if (letter.cover_letter_content) {
            try {
              if (typeof letter.cover_letter_content === 'string') {
                contentObj = JSON.parse(letter.cover_letter_content);
              } else {
                contentObj = letter.cover_letter_content;
              }
            } catch (e) {
              console.warn("Failed to parse cover letter content as JSON:", e);
              return letter.cover_letter_content;
            }
          } else if (letter.cover_letter) {
            contentObj = letter.cover_letter;
          } else {
            contentObj = {
              greeting: 'Dear Hiring Manager,',
              introduction: '',
              body_paragraphs: [''],
              closing: '',
              signature: 'Sincerely,'
            };
          }
          
          // Get personal info for header
          const personalInfo = {
            full_name: letter.author_name || letter.applicant_info?.name || '',
            email: letter.author_email || letter.applicant_info?.email || '',
            mobile: letter.author_phone || letter.applicant_info?.phone || ''
          };
          
          // Build formatted letter
          if (personalInfo.full_name) formattedLetter += `${personalInfo.full_name}\n`;
          if (personalInfo.email) formattedLetter += `${personalInfo.email}\n`;
          if (personalInfo.mobile) formattedLetter += `${personalInfo.mobile}\n\n`;
          
          // Add date
          formattedLetter += `${new Date().toLocaleDateString()}\n\n`;
          
          // Add company info
          if (letter.company_name) formattedLetter += `${letter.company_name}\n`;
          if (letter.recipient_name) formattedLetter += `${letter.recipient_name}\n`;
          if (letter.recipient_title) formattedLetter += `${letter.recipient_title}\n`;
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

export default useNewCoverLetterStore;