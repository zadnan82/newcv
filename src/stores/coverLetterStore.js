 // src/stores/coverLetterStore.js - FIXED VERSION with Local Storage
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import useSessionStore from './sessionStore'; // FIXED: Use session store instead 
import { API_BASE_URL, checkBackendAvailability, COVER_LETTER_ENDPOINTS } from '../config';
// Helper to generate unique local IDs
const generateLocalId = (prefix = 'local_cl') => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// FIXED: Updated API endpoints to match your backend structure
 

// Helper function for API calls - FIXED
const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  // FIXED: Get session token from session store instead of auth store
  const sessionToken = useSessionStore.getState().sessionToken;
  
  if (!sessionToken && method !== 'GET') {
    throw new Error('Session authentication required');
  }
  
  const headers = {};
  if (sessionToken) {
    headers['Authorization'] = `Bearer ${sessionToken}`;
  }

  // FIXED: Don't set Content-Type for FormData
  if (!isFormData && method !== 'GET' && body) {
    headers['Content-Type'] = 'application/json';
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  console.log(`🔄 Making ${method} request to: ${url}`);

  const config = {
    method,
    headers,
    ...(body ? { 
      body: isFormData ? body : JSON.stringify(body) 
    } : {})
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText);
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {
      // If we can't parse the error as JSON, just use the status message
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

const useCoverLetterStore = create(
  persist(
    (set, get) => ({
      // State
      coverLetters: [], // Combined local + cloud cover letters
      localCoverLetters: [], // Local-only cover letters
      currentLetter: null,
      isLoading: false,
      error: null,
      currentTask: null,
      
      // LOCAL STORAGE METHODS
      
      // Save cover letter locally (always works)
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
          
          // Update state with combined local + cloud letters
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

      // Load local cover letters
      loadLocalCoverLetters: () => {
        try {
          const stored = localStorage.getItem('local_cover_letters');
          return stored ? JSON.parse(stored) : [];
        } catch (error) {
          console.error('❌ Error loading local cover letters:', error);
          return [];
        }
      },

      // Delete local cover letter
      deleteLocalCoverLetter: (id) => {
        try {
          const localCoverLetters = get().loadLocalCoverLetters();
          const filtered = localCoverLetters.filter(cl => cl.id !== id);
          localStorage.setItem('local_cover_letters', JSON.stringify(filtered));
          
          // Update state
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

      // Get cloud cover letters from current state
      getCoverLettersFromCloud: () => {
        const { coverLetters, localCoverLetters } = get();
        return coverLetters.filter(cl => 
          !localCoverLetters.some(local => local.id === cl.id) &&
          cl.storageType !== 'local'
        );
      },

      // CLOUD STORAGE METHODS (Enhanced)
      
      // FIXED: Save cover letter to Google Drive
      saveCoverLetter: async (coverLetterData) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log("💾 Saving cover letter to Google Drive...");
          
          // Get session token from session store
          const sessionToken = useSessionStore.getState().sessionToken;
          
          if (!sessionToken) {
            throw new Error('No session token found. Please refresh the page.');
          }
          
          // Use the Google Drive API to save cover letter
          const response = await fetch(`${API_BASE_URL}/api/google-drive/save-cover-letter`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(coverLetterData)
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }
          
          const result = await response.json();
          console.log("✅ Cover letter saved successfully:", result);
          
          // Add to local state if successful
          if (result.success && result.cover_letter_data) {
            set(state => ({
              coverLetters: [...state.coverLetters, result.cover_letter_data],
              isLoading: false
            }));
          } else {
            set({ isLoading: false });
          }
          
          return result;
        } catch (error) {
          console.error("❌ Cover letter save failed:", error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to save cover letter' 
          });
          throw error;
        }
      },

      // FIXED: Generate cover letter with proper Google Drive CV loading
      generateCoverLetter: async (formData) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log("🤖 Generating cover letter...");
          console.log("📋 FormData keys:", Array.from(formData.keys()));
          
          // FIXED: Get session token from session store
          const sessionToken = useSessionStore.getState().sessionToken;
          
          if (!sessionToken) {
            throw new Error('No session token found. Please refresh the page.');
          }
          
          const response = await fetch(COVER_LETTER_ENDPOINTS.GENERATE, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              // Don't set Content-Type for FormData - let browser handle it
            },
            body: formData
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }
          
          const result = await response.json();
          console.log("✅ Cover letter response:", result);
          
          // Handle both sync and async responses
          if (result.task_id) {
            // Async processing
            set({ 
              currentTask: {
                id: result.task_id,
                status: result.status || 'processing'
              }
            });
          } else {
            // Sync response - success!
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
      
      // FIXED: Format cover letter for display - handles new JSON structure
     // FIXED: Format cover letter for display - handles new JSON structure
      formatCoverLetter: (letter) => {
        try {
          console.log("📝 Formatting cover letter:", letter);
          
          let formattedLetter = '';
          let contentObj = null;
          
          // Handle different content structures
          if (letter.cover_letter_content) {
            try {
              // Try to parse JSON content
              if (typeof letter.cover_letter_content === 'string') {
                contentObj = JSON.parse(letter.cover_letter_content);
              } else {
                contentObj = letter.cover_letter_content;
              }
            } catch (e) {
              console.warn("Failed to parse cover letter content as JSON:", e);
              // Use as plain text
              return letter.cover_letter_content;
            }
          } else if (letter.cover_letter) {
            // New API response format
            contentObj = letter.cover_letter;
          } else {
            // Fallback: create basic structure
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
              formattedLetter += `${paragraph}\n\n`;
            });
          } else if (Array.isArray(contentObj.body)) {
            contentObj.body.forEach(paragraph => {
              formattedLetter += `${paragraph}\n\n`;
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
            
      fetchCoverLetters: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall(COVER_LETTER_ENDPOINTS.ALL); 
          console.log("fetchCoverLetters response:", response);
          
          // FIX: Extract the cover_letters array from the response
          const coverLettersArray = response.cover_letters || response;
          
          set({ 
            coverLetters: Array.isArray(coverLettersArray) ? coverLettersArray : [],
            isLoading: false 
          });
          
          return coverLettersArray;
        } catch (error) {
          console.error('Error fetching cover letters:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch cover letters' 
          });
          return [];
        }
      },
            
      getCoverLetter: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall(COVER_LETTER_ENDPOINTS.BY_ID(id));
          
          set({ 
            currentLetter: response,
            isLoading: false 
          });
          
          return response;
        } catch (error) {
          console.error('Error fetching cover letter:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch cover letter' 
          });
          return null;
        }
      },
      

      // FIXED: Update cover letter
      updateCoverLetter: async (id, updateData) => {
        set({ isLoading: true, error: null });
        
        try {
          const sessionToken = useSessionStore.getState().sessionToken;
          
          if (!sessionToken) {
            throw new Error('No session token found');
          }
          
          const response = await fetch(`${API_BASE_URL}/api/cover-letter/update/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }
          
          const result = await response.json();
          
          // Update local state
          set(state => ({
            coverLetters: state.coverLetters.map(letter => 
              letter.id === id ? { ...letter, ...updateData } : letter
            ),
            isLoading: false
          }));
          
          return result;
        } catch (error) {
          console.error('Error updating cover letter:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to update cover letter' 
          });
          throw error;
        }
      },
      // Check task status (for async processing)
      checkTaskStatus: async (taskId) => {
        const { currentTask } = get();
        
        if (!taskId && (!currentTask || !currentTask.id)) {
          return null;
        }
        
        const id = taskId || currentTask.id;
        
        try {
          const response = await apiCall(COVER_LETTER_ENDPOINTS.TASK_STATUS(id));
          
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
          console.error('Error checking task status:', error);
          return null;
        }
      },
      
      clearCurrentTask: () => {
        set({ currentTask: null });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      setCurrentLetter: (letter) => {
        set({ currentLetter: letter });
      }
    }),
    {
      name: 'cover-letter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        coverLetters: state.coverLetters,
        error: state.error
      }),
    }
  )
);

export default useCoverLetterStore;