// src/stores/coverLetterStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import useAuthStore from './authStore';
import API_BASE_URL, { COVER_LETTER_ENDPOINTS } from '../config';

// Helper to generate unique local IDs
const generateLocalId = (prefix = 'local') => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const token = useAuthStore.getState().token;
  
  if (!token && method !== 'GET') {
    throw new Error('Authentication required');
  }
  
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData && method !== 'GET' && body) {
    headers['Content-Type'] = 'application/json';
  }

  // Use the full URL from the endpoints
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  //console.log(`Making ${method} request to: ${url}`);

  // Make sure body is handled correctly here
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

// Transform API response to store format
const transformApiCoverLetterToStore = (apiCoverLetter) => {
  if (!apiCoverLetter) return null;
  
  // Handle array response
  if (Array.isArray(apiCoverLetter)) {
    if (apiCoverLetter.length === 0) return null;
    
    // Map each cover letter to our format
    return apiCoverLetter.map(letter => ({
      id: letter.id,
      title: letter.title || 'Untitled Cover Letter',
      company_name: letter.company_name || '',
      job_title: letter.job_title || '',
      job_description: letter.job_description || '',
      recipient_name: letter.recipient_name || '',
      recipient_title: letter.recipient_title || '',
      cover_letter_content: letter.cover_letter_content ? 
        (typeof letter.cover_letter_content === 'string' ? 
          letter.cover_letter_content : JSON.stringify(letter.cover_letter_content)) : '',
      resume_id: letter.resume_id || null,
      is_favorite: letter.is_favorite || false,
      created_at: letter.created_at || new Date().toISOString(),
      updated_at: letter.updated_at || new Date().toISOString()
    }));
  }
  
  // Single cover letter object
  return {
    id: apiCoverLetter.id,
    title: apiCoverLetter.title || 'Untitled Cover Letter',
    company_name: apiCoverLetter.company_name || '',
    job_title: apiCoverLetter.job_title || '',
    job_description: apiCoverLetter.job_description || '',
    recipient_name: apiCoverLetter.recipient_name || '',
    recipient_title: apiCoverLetter.recipient_title || '',
    cover_letter_content: apiCoverLetter.cover_letter_content ? 
      (typeof apiCoverLetter.cover_letter_content === 'string' ? 
        apiCoverLetter.cover_letter_content : JSON.stringify(apiCoverLetter.cover_letter_content)) : '',
    resume_id: apiCoverLetter.resume_id || null,
    is_favorite: apiCoverLetter.is_favorite || false,
    created_at: apiCoverLetter.created_at || new Date().toISOString(),
    updated_at: apiCoverLetter.updated_at || new Date().toISOString()
  };
};

// Create the store
const useCoverLetterStore = create(
  persist(
    (set, get) => ({
      // State
      coverLetters: [],
      currentLetter: null,
      isLoading: false,
      error: null,
      currentTask: null,
      
      // Fetch all cover letters for the user
      fetchCoverLetters: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall(COVER_LETTER_ENDPOINTS.BASE);
          //console.log("fetchCoverLetters response:", response);
          
          const processedLetters = transformApiCoverLetterToStore(response);
          
          set({ 
            coverLetters: Array.isArray(processedLetters) ? processedLetters : [processedLetters].filter(Boolean),
            isLoading: false 
          });
          
          return processedLetters;
        } catch (error) {
          console.error('Error fetching cover letters:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch cover letters' 
          });
          return [];
        }
      },
      
      // Get a specific cover letter by ID
      getCoverLetter: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall(COVER_LETTER_ENDPOINTS.BY_ID(id));
          //console.log("getCoverLetter response:", response);
          
          const processedLetter = transformApiCoverLetterToStore(response);
          
          set({ 
            currentLetter: processedLetter,
            isLoading: false 
          });
          
          return processedLetter;
        } catch (error) {
          console.error('Error fetching cover letter:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch cover letter' 
          });
          return null;
        }
      },
       
      generateCoverLetter: async (formData) => {
  set({ isLoading: true, error: null });
  
  try {
    console.log("Generating cover letter...");
    
    // Enable async processing
    formData.append('async_processing', 'true');  // Changed from 'false' to 'true'
    
    const response = await apiCall(
      COVER_LETTER_ENDPOINTS.GENERATE_COVER_LETTER, 
      'POST', 
      formData,
      true
    );
    
    console.log("generateCoverLetter response:", response);
    
    // For async responses, don't reset loading state yet
    if (response.task_id) {
      set({ 
        currentTask: {
          id: response.task_id,
          status: response.status || 'processing'
        }
        // Keep isLoading: true for async processing
      });
    } else {
      // Handle sync response
      set({ isLoading: false });
    }
    
    return response;  // Make sure you return the response
  } catch (error) {
    set({ 
      isLoading: false, 
      error: error.message || 'Failed to generate cover letter' 
    });
    throw error;
  }
},
      
      // Check async task status
      checkTaskStatus: async (taskId) => {
        const { currentTask } = get();
        
        if (!taskId && (!currentTask || !currentTask.id)) {
          console.error("No task ID provided and no current task found");
          return null;
        }
        
        const id = taskId || currentTask.id;
        
        try {
          const response = await apiCall(COVER_LETTER_ENDPOINTS.TASK_STATUS(id));
          console.log("Task status response:", response);
          
          const updatedTask = {
            id: response.task_id,
            status: response.status,
            result: response.result,
            error: response.error,
            message: response.message,
            completedAt: response.completed_at
          };
          
          set({ currentTask: updatedTask });
          
          // If task is completed and has a result with a cover letter
          if (response.status === 'completed' && 
              response.result && 
              response.result.cover_letter) {
            
            // Check if the letter was saved to the database
            if (response.result.cover_letter_id || 
                (response.result.cover_letter && response.result.cover_letter.id)) {
              
              const letterId = response.result.cover_letter_id || response.result.cover_letter.id;
              
              // Fetch the complete cover letter from the database
              const letter = await get().getCoverLetter(letterId);
              
              set({ 
                isLoading: false,
                currentTask: null
              });
              
              return {
                ...response,
                cover_letter: letter || response.result.cover_letter
              };
            }
            
            // Just return the cover letter from the response
            set({ 
              isLoading: false,
              currentTask: null
            });
            
            return response.result;
          }
          
          // If task failed
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
      
      // Clear current task
      clearCurrentTask: () => {
        set({ currentTask: null });
      },
      
      // Update a cover letter
      updateCoverLetter: async (id, updates) => {
        set({ isLoading: true, error: null });
        
        console.log("Updates being sent to API:", updates);
        
        try {
          const response = await apiCall(COVER_LETTER_ENDPOINTS.BY_ID(id), 'PUT', updates);
          console.log("API response for update:", response);
                
          const updatedLetter = transformApiCoverLetterToStore(response);
                
          set(state => ({ 
            coverLetters: state.coverLetters.map(letter => 
              letter.id === id ? updatedLetter : letter
            ),
            currentLetter: state.currentLetter?.id === id ? updatedLetter : state.currentLetter,
            isLoading: false 
          }));
                
          return updatedLetter;
        } catch (error) {
          console.error('Error updating cover letter:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to update cover letter' 
          });
          throw error;
        }
      },
      
      // Delete a cover letter
      deleteCoverLetter: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          await apiCall(COVER_LETTER_ENDPOINTS.BY_ID(id), 'DELETE');
          
          set(state => ({ 
            coverLetters: state.coverLetters.filter(letter => letter.id !== id),
            currentLetter: state.currentLetter?.id === id ? null : state.currentLetter,
            isLoading: false 
          }));
          
          return true;
        } catch (error) {
          console.error('Error deleting cover letter:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to delete cover letter' 
          });
          throw error;
        }
      },
      
      // Toggle favorite status of a cover letter
      toggleFavorite: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall(`${COVER_LETTER_ENDPOINTS.BY_ID(id)}/favorite`, 'POST');
          console.log("toggleFavorite response:", response);
          
          const updatedLetter = transformApiCoverLetterToStore(response);
          
          set(state => ({ 
            coverLetters: state.coverLetters.map(letter => 
              letter.id === id ? updatedLetter : letter
            ),
            currentLetter: state.currentLetter?.id === id ? updatedLetter : state.currentLetter,
            isLoading: false 
          }));
          
          return updatedLetter;
        } catch (error) {
          console.error('Error toggling favorite status:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to update favorite status' 
          });
          throw error;
        }
      },
      
      // Set current letter
      setCurrentLetter: (letter) => {
        set({ currentLetter: letter });
      },
      
      // Clear error
      clearError: () => {
        set({ error: null });
      },
      
      // Format cover letter for display
      formatCoverLetter: (letter) => {
        try {
          //console.log("Formatting letter with nested content structure:", letter);
          
          // Initialize letter content
          let formattedLetter = '';
          let contentObj = null;
          
          // Get the content field - this could be directly in cover_letter_content or nested
          let content = letter.cover_letter_content;
          
          // Check if content is a string and try to parse it
          if (typeof content === 'string') {
            try {
              // First, try parsing it as JSON
              const parsedContent = JSON.parse(content);
              
              // Check if this is a nested structure with a 'content' field
              if (parsedContent.content) {
                //console.log("Detected nested content structure");
                
                // The actual letter content is inside the 'content' field
                let innerContent = parsedContent.content;
                
                // If it's wrapped in markdown code blocks, remove them
                if (innerContent.includes('```')) {
                  innerContent = innerContent.replace(/```(?:json)?\n/, '').replace(/\n```$/, '');
                  //console.log("Removed markdown wrapper from inner content");
                }
                
                // Parse the inner content
                try {
                  contentObj = JSON.parse(innerContent);
                  //console.log("Successfully parsed inner JSON content:", contentObj);
                } catch (innerErr) {
                  console.error("Failed to parse inner content:", innerErr);
                }
              } else {
                // Not nested, use the parsed content directly
                contentObj = parsedContent;
              }
            } catch (outerErr) {
              console.error("Failed to parse outer content as JSON:", outerErr);
              
              // Check if it's markdown-wrapped JSON
              if (content.includes('```')) {
                const jsonStr = content.replace(/```(?:json)?\n/, '').replace(/\n```$/, '');
                try {
                  contentObj = JSON.parse(jsonStr);
                  console.log("Parsed content from markdown wrapper");
                } catch (err) {
                  console.error("Failed to parse markdown-wrapped content:", err);
                }
              }
            }
          } else if (typeof content === 'object') {
            // Content is already an object
            if (content && content.content) {
              // It's a nested structure
              let innerContent = content.content;
              if (typeof innerContent === 'string') {
                // If it's wrapped in markdown code blocks, remove them
                if (innerContent.includes('```')) {
                  innerContent = innerContent.replace(/```(?:json)?\n/, '').replace(/\n```$/, '');
                }
                
                try {
                  contentObj = JSON.parse(innerContent);
                } catch (err) {
                  console.error("Failed to parse inner content from object:", err);
                }
              } else if (typeof innerContent === 'object') {
                contentObj = innerContent;
              }
            } else {
              contentObj = content;
            }
          }
          
          // Get personal info (fallback to empty values if not available)
          const personalInfo = {
            full_name: letter.author_name || letter.full_name || '',
            email: letter.author_email || letter.email || '',
            mobile: letter.author_phone || letter.phone || ''
          };
          
          // Now format the letter using the parsed contentObj
          if (contentObj && typeof contentObj === 'object') {
            // Add personal info header
            if (personalInfo.full_name) formattedLetter += `${personalInfo.full_name}\n`;
            if (personalInfo.email) formattedLetter += `${personalInfo.email}\n`;
            if (personalInfo.mobile) formattedLetter += `${personalInfo.mobile}\n\n`;
            
            // Add date
            formattedLetter += `${new Date().toLocaleDateString()}\n\n`;
            
            // Add company and recipient
            if (letter.company_name) formattedLetter += `${letter.company_name}\n`;
            if (letter.recipient_name) formattedLetter += `${letter.recipient_name}\n`;
            if (letter.recipient_title) formattedLetter += `${letter.recipient_title}\n`;
            formattedLetter += '\n';
            
            // Add greeting
            if (contentObj.greeting) {
              formattedLetter += `${contentObj.greeting}\n\n`;
            } else {
              formattedLetter += `Dear ${letter.recipient_name || 'Hiring Manager'},\n\n`;
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
              // Replace escaped newlines with actual newlines
              formattedLetter += contentObj.signature.replace(/\\n/g, '\n');
            } else {
              formattedLetter += `Sincerely,\n${personalInfo.full_name || ''}`;
            }
          } else {
            // Fallback to a basic template
            if (personalInfo.full_name) formattedLetter += `${personalInfo.full_name}\n`;
            if (personalInfo.email) formattedLetter += `${personalInfo.email}\n`;
            if (personalInfo.mobile) formattedLetter += `${personalInfo.mobile}\n\n`;
            
            formattedLetter += `${new Date().toLocaleDateString()}\n\n`;
            
            if (letter.company_name) formattedLetter += `${letter.company_name}\n`;
            if (letter.recipient_name) formattedLetter += `${letter.recipient_name}\n\n`;
            
            formattedLetter += `Dear ${letter.recipient_name || 'Hiring Manager'},\n\n`;
            formattedLetter += `Thank you for the opportunity to apply for the ${letter.job_title || 'position'} at ${letter.company_name || 'your company'}.\n\n`;
            formattedLetter += `Sincerely,\n${personalInfo.full_name || ''}`;
          }
          
          //console.log("Final formatted letter (first 100 chars):", formattedLetter.substring(0, 100) + "...");
          return formattedLetter;
        } catch (error) {
          console.error("Error in formatNestedContent:", error);
          return "Error formatting cover letter content.";
        }
      }
    }),
    {
      name: 'cover-letter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        coverLetters: state.coverLetters,
        // Don't persist currentLetter - we'll manage that manually if needed
        error: state.error
      }),
    }
  )
);

export default useCoverLetterStore;