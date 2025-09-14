import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import useAuthStore from './authStore';
import { API_BASE_URL, RESUME_ENDPOINTS } from '../config';

// Helper to generate unique local IDs
const generateLocalId = (prefix = 'local') => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// Helper function for API calls
// Update your apiCall function in resumeStore.js
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = useAuthStore.getState().token;
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const config = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  // Use the full URL from the RESUME_ENDPOINTS
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred');
  }
  
  // Check if there's no content (204) or if the response is empty
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null; // Return null for empty responses
  }
  
  return response.json();
};

// Helper to transform API response to store format
// Helper to transform API response to store format
const transformAPIResumeToStore = (apiResume) => {
  if (!apiResume) return null;
   
  
  // Handle array response (when getting all resumes)
  if (Array.isArray(apiResume)) {
    // If we got an array but it's empty, return null
    if (apiResume.length === 0) return null;
    
    // Otherwise, use the first resume in the array
    apiResume = apiResume[0]; 
  }
  
  return {
    id: apiResume.id || generateLocalId('resume'),
    server_id: apiResume.id,
    title: apiResume.title || 'My Resume',
    is_public: apiResume.is_public || false,
    personal_info: {
      full_name: apiResume.personal_info?.full_name || '',
      email: apiResume.personal_info?.email || '',
      mobile: apiResume.personal_info?.mobile || '',
      address: apiResume.personal_info?.address || '',
      linkedin: apiResume.personal_info?.linkedin || '',
      title: apiResume.personal_info?.title || '',
      date_of_birth: apiResume.personal_info?.date_of_birth || '',
      nationality: apiResume.personal_info?.nationality || '',
      place_of_birth: apiResume.personal_info?.place_of_birth || '',
      postal_code: apiResume.personal_info?.postal_code || '',
      driving_license: apiResume.personal_info?.driving_license || '',
      city: apiResume.personal_info?.city || '',
      website: apiResume.personal_info?.website || '',
      summary: apiResume.personal_info?.summary || ''
    },
    educations: (apiResume.educations || [])
      .map(edu => ({
        id: edu.id || generateLocalId('education'),
        institution: edu.institution || '',
        degree: edu.degree || '',
        field_of_study: edu.field_of_study || '',
        location: edu.location || '',
        start_date: edu.start_date || '',
        end_date: edu.end_date || '',
        current: edu.current || false,
        gpa: edu.gpa || ''
      }))
      .sort((a, b) => {
        // Current education should appear first
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        
        // Then sort by end_date or start_date (newest first)
        const aDate = a.current ? a.start_date : (a.end_date || a.start_date);
        const bDate = b.current ? b.start_date : (b.end_date || b.start_date);
        
        // Sort in reverse chronological order
        return new Date(bDate) - new Date(aDate);
      }),
    experiences: (apiResume.experiences || [])
      .map(exp => ({
        id: exp.id || generateLocalId('experience'),
        company: exp.company || '',
        position: exp.position || '',
        location: exp.location || '',
        description: exp.description || '',
        start_date: exp.start_date || '',
        end_date: exp.end_date || '',
        current: exp.current || false
      }))
      .sort((a, b) => {
        // Current positions should appear first
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        
        // Then sort by end_date or start_date (newest first)
        const aDate = a.current ? a.start_date : (a.end_date || a.start_date);
        const bDate = b.current ? b.start_date : (b.end_date || b.start_date);
        
        // Sort in reverse chronological order
        return new Date(bDate) - new Date(aDate);
      }),
    skills: (apiResume.skills || []).map(skill => ({
      id: skill.id || generateLocalId('skill'),
      name: skill.name || '',
      level: skill.level || 'Intermediate'
    })),
    languages: (apiResume.languages || []).map(lang => ({
      id: lang.id || generateLocalId('language'),
      name: lang.language || lang.name || '',
      level: lang.proficiency || lang.level || 'Intermediate'
    })),
    referrals: (apiResume.referrals || []).map(ref => ({
      id: ref.id || generateLocalId('referral'),
      name: ref.name || '',
      relation: ref.relation || '',
      phone: ref.phone || '',
      email: ref.email || ''
    })),
    custom_sections: (apiResume.custom_sections || []).map(section => ({
      id: section.id || generateLocalId('custom_section'),
      title: section.title || '',
      content: section.content || ''
    })),
    extracurriculars: (apiResume.extracurriculars || []).map(activity => ({
      id: activity.id || generateLocalId('extracurricular'),
      title: activity.name || activity.title || '',
      description: activity.description || ''
    })),
    hobbies: (apiResume.hobbies || []).map(hobby => ({
      id: hobby.id || generateLocalId('hobby'),
      name: hobby.name || ''
    })),
    courses: (apiResume.courses || []).map(course => ({
      id: course.id || generateLocalId('course'),
      name: course.name || '',
      institution: course.institution || '',
      description: course.description || ''
    })),
    internships: (apiResume.internships || [])
      .map(internship => ({
        id: internship.id || generateLocalId('internship'),
        company: internship.company || '',
        position: internship.position || '',
        location: internship.location || '',
        description: internship.description || '',
        start_date: internship.start_date || '',
        end_date: internship.end_date || '',
        current: internship.current || false
      }))
      .sort((a, b) => {
        // Current internships should appear first
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        
        // Then sort by end_date or start_date (newest first)
        const aDate = a.current ? a.start_date : (a.end_date || a.start_date);
        const bDate = b.current ? b.start_date : (b.end_date || b.start_date);
        
        // Sort in reverse chronological order
        return new Date(bDate) - new Date(aDate);
      }),
    photos: apiResume.photos || { photolink: null },
    created_at: apiResume.created_at || new Date().toISOString(),
    updated_at: apiResume.updated_at || new Date().toISOString(),
    // Add template and customization if they exist
    template: apiResume.template || apiResume.customization?.template || 'stockholm',
    customization: apiResume.customization || {
      template: 'stockholm',
      accent_color: "#1a5276",
      font_family: "Helvetica, Arial, sans-serif", 
      line_spacing: 1.5,
      headings_uppercase: false,
      hide_skill_level: false
    }
  };
};

// Helper to prepare resume data for API submission
const prepareResumeForAPI = (resumeData) => {
  // Make a defensive copy
  const result = {
    title: resumeData.title || 'My Resume',
    is_public: resumeData.is_public || false,
    personal_info: {
      full_name: resumeData.personal_info?.full_name || '',
      email: resumeData.personal_info?.email || '',
      mobile: resumeData.personal_info?.mobile || '',
      address: resumeData.personal_info?.address || '',
      linkedin: resumeData.personal_info?.linkedin || '',
      title: resumeData.personal_info?.title || '',
      date_of_birth: resumeData.personal_info?.date_of_birth || null,
      nationality: resumeData.personal_info?.nationality || '',
      place_of_birth: resumeData.personal_info?.place_of_birth || '',
      postal_code: resumeData.personal_info?.postal_code || '',
      driving_license: resumeData.personal_info?.driving_license || '',
      city: resumeData.personal_info?.city || '',
      website: resumeData.personal_info?.website || '',
      summary: resumeData.personal_info?.summary || ''
    },
    educations: (resumeData.educations || []).map(edu => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field_of_study: edu.field_of_study || '',
      location: edu.location || '',
      start_date: edu.start_date || null,
      end_date: edu.end_date || null,
      current: edu.current || false,
      gpa: edu.gpa || null
    })),
    experiences: (resumeData.experiences || []).map(exp => ({
      company: exp.company || '',
      position: exp.position || '',
      location: exp.location || '',
      description: exp.description || '',
      start_date: exp.start_date || null,
      end_date: exp.end_date || null,
      current: exp.current || false
    })),
    skills: (resumeData.skills || []).map(skill => ({
      name: skill.name || '',
      level: skill.level || 'Intermediate'
    })),
    languages: (resumeData.languages || []).map(lang => ({
      language: lang.name || '',
      proficiency: lang.level || 'Intermediate'
    })),
    referrals: (resumeData.referrals || []).map(ref => ({
      name: ref.name || '',
      relation: ref.relation || '',
      phone: ref.phone || '',
      email: ref.email || ''
    })),
    custom_sections: (resumeData.custom_sections || []).map(section => ({
      title: section.title || '',
      content: section.content || ''
    })),
    extracurriculars: (resumeData.extracurriculars || []).map(activity => ({
      name: activity.title || '',
      description: activity.description || ''
    })),
    hobbies: (resumeData.hobbies || []).map(hobby => ({
      name: hobby.name || ''
    })),
    courses: (resumeData.courses || []).map(course => ({
      name: course.name || '',
      institution: course.institution || '',
      description: course.description || ''
    })),
    internships: (resumeData.internships || []).map(internship => ({
      company: internship.company || '',
      position: internship.position || '',
      location: internship.location || '',
      description: internship.description || '',
      start_date: internship.start_date || null,
      end_date: internship.end_date || null,
      current: internship.current || false
    })),
    // IMPROVED PHOTO HANDLING:
    photo: (() => {
      // Log for debugging
      console.log('Processing photos for API submission:', {
        photosArray: Array.isArray(resumeData.photos) ? resumeData.photos : 'not array',
        photosObject: typeof resumeData.photos === 'object' ? resumeData.photos : 'not object',
        photosDirect: resumeData.photo,
        photosFromCurrentResume: resumeData.currentResume?.photos
      });
      
      // CASE 1: Check in the photos array from form data
      if (Array.isArray(resumeData.photos) && resumeData.photos.length > 0) {
        // If the array contains objects with photo property (from onChange in EditPhotoUpload)
        if (resumeData.photos[0].photo) {
          return { photolink: resumeData.photos[0].photo };
        }
        // If the array contains objects with photolink
        if (resumeData.photos[0].photolink) {
          return { photolink: resumeData.photos[0].photolink };
        }
      }
      
      // CASE 2: Check if photos is an object with photolink (store format)
      if (resumeData.photos && resumeData.photos.photolink) {
        return { photolink: resumeData.photos.photolink };
      }
      
      // CASE 3: Check if photo property exists directly
      if (resumeData.photo && resumeData.photo.photolink) {
        return { photolink: resumeData.photo.photolink };
      }
      
      // CASE 4: Get photos from currentResume if present
      const currentResume = resumeData.currentResume || window.resumeStore?.getState().currentResume;
      if (currentResume?.photos?.photolink) {
        return { photolink: currentResume.photos.photolink };
      }
      
      // Default to empty string photolink if no photo found
      // Using empty string instead of null to avoid nullish issues
      return { photolink: '' };
    })(),
    // Include template and customization if they exist
    template: resumeData.template || 'stockholm',
    customization: resumeData.customization || {
      template: 'stockholm',
      accent_color: "#1a5276",
      font_family: "Helvetica, Arial, sans-serif",
      line_spacing: 1.5,
      headings_uppercase: false,
      hide_skill_level: false
    }
  };
  
  // Debug log for the final result
  console.log('Final photo data being sent to API:', result.photo);
   
  return result;
};

// Local storage helper methods
const localStorageHelpers = {
  clearResumeData: () => {
    localStorage.removeItem('resumeFormData');
    console.log("Cleared resumeFormData from localStorage");
  },
  
  saveResumeToLocal: (resumeData) => {
    localStorage.setItem('resumeFormData', JSON.stringify(resumeData));
    console.log("Saved resumeFormData to localStorage");
  },
  
  getResumeFromLocal: () => {
    try {
      const data = localStorage.getItem('resumeFormData');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return null;
    }
  },
  
  // Check if the resume is just being created (not yet saved to server)
  isCreatingNewResume: () => {
    return !localStorage.getItem('resumeFormData_savedToServer');
  },
  
  // Mark that the resume has been saved to server
  markResumeSavedToServer: (resumeId) => {
    localStorage.setItem('resumeFormData_savedToServer', resumeId.toString());
  },
  
  // Clear the saved status
  clearResumeSavedStatus: () => {
    localStorage.removeItem('resumeFormData_savedToServer');
  }
};

// Resume Store
const useResumeStore = create(
  persist(
    (set, get) => ({
      resumes: [],
      currentResume: null,
      loading: false,
      error: null,
      isEditingLocally: false, // Flag to track local editing mode
      
      // Helper function to get correct section name
      _getSectionName: (sectionName) => {
        // Add any mappings if needed (e.g., 'hobby' -> 'hobbies')
        const mappings = {
          'hobby': 'hobbies',
          'education': 'educations',
          'experience': 'experiences',
          'skill': 'skills',
          'language': 'languages',
          'extracurricular': 'extracurriculars',
          'course': 'courses',
          'internship': 'internships',
          'referral': 'referrals',
          'custom_section': 'custom_sections'
        };
        
        return mappings[sectionName] || sectionName;
      },
      
      // Start a new resume (use local storage only, no server)
      startNewResume: () => {
        // Clear any existing local editing session
        localStorageHelpers.clearResumeData();
        localStorageHelpers.clearResumeSavedStatus();
        
        // Create a blank resume
        const blankResume = {
          id: generateLocalId('resume'),
          title: 'My Resume',
          is_public: false,
          personal_info: {
            full_name: '',
            email: '',
            mobile: '',
            address: '',
            linkedin: '',
            title: '',
            date_of_birth: '',
            nationality: '',
            place_of_birth: '',
            postal_code: '',
            driving_license: '',
            city: '',
            website: '',
            summary: ''
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
          photos: { photolink: null },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          template: 'stockholm',
          customization: {
            template: 'stockholm',
            accent_color: "#1a5276",
            font_family: "Helvetica, Arial, sans-serif",
            line_spacing: 1.5,
            headings_uppercase: false,
            hide_skill_level: false
          }
        };
        
        // Set as current resume and mark as local editing
        set({ 
          currentResume: blankResume, 
          isEditingLocally: true
        });
        
        // Save to local storage for the editing session
        localStorageHelpers.saveResumeToLocal(blankResume);
        
        return blankResume;
      },
      
      // Fetch all resumes
      fetchResumes: async () => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiCall(RESUME_ENDPOINTS.GET_RESUME);
          console.log("fetchResumes response:", response);
          
          // Handle both array and single object responses
          let processedResumes = [];
          if (Array.isArray(response)) {
            processedResumes = response.map(transformAPIResumeToStore).filter(Boolean);
          } else if (response) {
            const processed = transformAPIResumeToStore(response);
            if (processed) processedResumes = [processed];
          }
          
          set({ 
            resumes: processedResumes,
            currentResume: processedResumes[0] || null,
            loading: false,
            isEditingLocally: false // We're working with server data now
          });
          console.log("resumes are ", processedResumes);
          return processedResumes;
        } catch (err) {
          console.error('Error fetching resumes:', err);
          
          set({ 
            error: err.message || 'Failed to load resumes',
            loading: false 
          });
          return [];
        }
      },
      
      fetchResume: async (resumeId) => {
        set({ loading: true, error: null });
        
        try {
          
          // Validate the ID
          if (!resumeId || resumeId === 'default_resume') {
            throw new Error('Invalid resume ID provided');
          }
          
          // Always use the specific endpoint to fetch by ID to ensure we get exactly what we asked for
          if (!isNaN(parseInt(resumeId))) {
            const endpoint = RESUME_ENDPOINTS.GET_RESUME_BY_ID(resumeId);
            //console.log(`Fetching resume with endpoint: ${endpoint}`);
            
            try {
              const response = await apiCall(endpoint);
              //console.log("Response from specific resume endpoint:", response);
              
              if (!response || typeof response !== 'object') {
                throw new Error('Invalid response from server');
              }
              
              const processedResume = transformAPIResumeToStore(response);
              //console.log("Processed resume:", processedResume);
              
              if (!processedResume) {
                throw new Error('Failed to process resume data');
              }
              
              // Update the store state
              set({ 
                currentResume: processedResume,
                resumes: get().resumes.some(r => r.id == processedResume.id) 
                  ? get().resumes.map(r => r.id == processedResume.id ? processedResume : r)
                  : [...get().resumes, processedResume],
                loading: false,
                isEditingLocally: false
              });
              
              return processedResume;
            } catch (error) {
              console.error(`Error fetching resume with ID ${resumeId}:`, error);
              throw error;
            }
          } else {
            throw new Error('Invalid resume ID format');
          }
        } catch (err) {
          console.error("Error in fetchResume:", err);
          set({ 
            error: err.message || 'Failed to load resume',
            loading: false 
          });
          return null;
        }
      },

      // Create a new resume with localStorage clearing
      createResume: async (resumeData) => {
        set({ loading: true, error: null });
        
        try {
          // Prepare data for API
          const dataForAPI = prepareResumeForAPI(resumeData);
          
          console.log('Creating resume with data:', dataForAPI);
          
          const response = await apiCall(RESUME_ENDPOINTS.CREATE_RESUME, 'POST', dataForAPI);
          console.log('Create resume - API response:', response);
          
          const processedResume = transformAPIResumeToStore(response);
          console.log('Create resume - Processed resume:', processedResume);
          
          // Clear localStorage since we've successfully saved to server
          localStorageHelpers.clearResumeData();
          
          // Mark as saved to server
          if (processedResume && processedResume.id) {
            localStorageHelpers.markResumeSavedToServer(processedResume.id);
          }
          
          set(state => ({ 
            resumes: [...state.resumes, processedResume],
            currentResume: processedResume,
            loading: false,
            isEditingLocally: false // Now working with server data
          }));
          
          return processedResume;
        } catch (err) {
          console.error('Error creating resume:', err);
          
          set({ 
            error: err.message || 'Failed to create resume',
            loading: false 
          });
          throw err;
        }
      },
      
      // Update resume with localStorage management
      updateResume: async (resumeId, resumeData) => {
        set({ loading: true, error: null });
        
        try {
          // If no resumeId provided, use current resume ID
          const targetResumeId = resumeId || get().currentResume?.id;
          if (!targetResumeId) {
            throw new Error('No resume ID provided for update');
          }
          
          // Check if this is a numeric ID (server-side resume)
          const isServerResume = !isNaN(parseInt(targetResumeId));
          
          // If we're in local editing mode and not making a server update
          if (get().isEditingLocally && !isServerResume) {
            console.log('Saving resume to localStorage only');
            
            // Update local storage
            localStorageHelpers.saveResumeToLocal(resumeData);
            
            // Update the state
            set(state => ({
              currentResume: resumeData,
              loading: false
            }));
            
            return resumeData;
          }
          
          // Otherwise, this is a server update
          // Get endpoint for update
          const endpoint = RESUME_ENDPOINTS.UPDATE_RESUME.replace(':id', targetResumeId);
          
          // Prepare payload to match backend schema
          const payload = prepareResumeForAPI(resumeData);
          console.log('Updating resume with data:', payload);
          
          const response = await apiCall(endpoint, 'PATCH', payload);
          console.log('Update resume - API response:', response);
          
          const processedResume = transformAPIResumeToStore(response);
          console.log('Update resume - Processed resume:', processedResume);
          
          // Clear localStorage since we've successfully saved to server
          localStorageHelpers.clearResumeData();
          
          // Mark as saved to server
          if (processedResume && processedResume.id) {
            localStorageHelpers.markResumeSavedToServer(processedResume.id);
          }
          
          set(state => ({
            resumes: state.resumes.map(r => 
              r.id === targetResumeId ? processedResume : r
            ),
            currentResume: processedResume,
            loading: false,
            isEditingLocally: false // Now working with server data
          }));
          
          return processedResume;
        } catch (err) {
          console.error('Error updating resume:', err);
          
          set({ 
            error: err.message || 'Failed to update resume',
            loading: false 
          });
          throw err;
        }
      },
      
      // Delete resume with localStorage management
      deleteResume: async (resumeId) => {
        set({ loading: true, error: null });
        
        try {
          // If no resumeId provided, use current resume ID
          const targetResumeId = resumeId || get().currentResume?.id;
          if (!targetResumeId) {
            throw new Error('No resume ID provided for deletion');
          }
          
          // Check if this is a local-only resume
          const isLocalId = targetResumeId.toString().startsWith('local_');
          
          if (isLocalId) {
            // Just clear localStorage
            localStorageHelpers.clearResumeData();
            localStorageHelpers.clearResumeSavedStatus();
            
            set(state => ({
              resumes: state.resumes.filter(r => r.id !== targetResumeId),
              currentResume: state.currentResume?.id === targetResumeId ? null : state.currentResume,
              loading: false,
              isEditingLocally: false
            }));
            
            return true;
          }
           
          const endpoint = RESUME_ENDPOINTS.DELETE_RESUME(targetResumeId);
          await apiCall(endpoint, 'DELETE');
          
          // Clear associated localStorage if it exists
          localStorageHelpers.clearResumeData();
          localStorageHelpers.clearResumeSavedStatus();
          
          set(state => ({
            resumes: state.resumes.filter(r => r.id !== targetResumeId),
            currentResume: state.currentResume?.id === targetResumeId ? null : state.currentResume,
            loading: false,
            isEditingLocally: false
          }));
          
          return true;
        } catch (err) {
          console.error('Error deleting resume:', err);
          
          set({ 
            error: err.message || 'Failed to delete resume',
            loading: false 
          });
          throw err;
        }
      },
      
      // Save current state to localStorage
      saveToLocalStorage: () => {
        const currentResume = get().currentResume;
        if (currentResume) {
          localStorageHelpers.saveResumeToLocal(currentResume);
          set({ isEditingLocally: true });
        }
      },
      updatePhoto: async (photoUrl, resumeId = null) => {
        const state = get();
        
        // If resumeId is provided, use it; otherwise use the currentResume's ID
        const targetResumeId = resumeId || (state.currentResume?.server_id || state.currentResume?.id);
        
        if (!targetResumeId) {
          console.error("No resume ID provided or available for photo update");
          return null;
        }
        
        try {
          console.log(`Updating photo for resume ${targetResumeId} with URL: ${photoUrl}`);
          
          // If resumeId is a number or can be parsed as one, it's a server-side resume
          const isServerResume = !isNaN(parseInt(targetResumeId));
          
          // Update the database if this is a server-side resume
          if (isServerResume) {
            console.log(`Sending photo update to server for resume ${targetResumeId}`);
            
            // Call the API to update the photo
            await apiCall(
              `${RESUME_ENDPOINTS.GET_RESUME_BY_ID(targetResumeId)}/photo`,
              'PUT',
              { photolink: photoUrl || '' }
            );
            
            console.log(`Photo updated in database for resume ${targetResumeId}`);
          } else {
            console.log('Working with local resume, not sending to server yet');
          }
          
          // Get the current resume to update, either the one specified by resumeId or the current one in state
          let resumeToUpdate = null;
          if (resumeId && resumeId !== state.currentResume?.id) {
            // Find the resume in the list if it's not the current one
            resumeToUpdate = state.resumes.find(r => r.id === resumeId);
          } else {
            resumeToUpdate = state.currentResume;
          }
          
          if (!resumeToUpdate) {
            console.error(`Cannot find resume with ID ${targetResumeId} to update photo`);
            return null;
          }
          
          // Update the resume with the new photo URL
          const updatedResume = {
            ...resumeToUpdate,
            photos: { photolink: photoUrl || '' }
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          // Update state
          set({
            currentResume: state.currentResume?.id === updatedResume.id ? updatedResume : state.currentResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          });
          
          return photoUrl || '';
        } catch (err) {
          console.error('Error updating photo:', err);
          throw err;
        }
      },
      
      // Update deletePhoto method
      deletePhoto: async (resumeId) => {
        const state = get();
        if (!state.currentResume) return false;
        
        try {
          // If working with a server-side resume, send delete request
          if (resumeId && !isNaN(parseInt(resumeId))) {
            await apiCall(
              `${RESUME_ENDPOINTS.GET_RESUME_BY_ID(resumeId)}/photo`,
              'DELETE'
            );
            console.log(`Photo deleted for resume ${resumeId}`);
          }
          
          // Update the current resume in state
          const updatedResume = {
            ...state.currentResume,
            photos: { photolink: null } // Use empty string instead of null
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          // Update state
          set({
            currentResume: updatedResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          });
          
          return true;
        } catch (err) {
          console.error('Error deleting photo:', err);
          throw err;
        }
      },
      
      
      // Clear localStorage
      clearLocalStorage: () => {
        localStorageHelpers.clearResumeData();
        localStorageHelpers.clearResumeSavedStatus();
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Set current resume
      setCurrentResume: (resume) => {
        set({ 
          currentResume: resume,
          isEditingLocally: resume && resume.id && resume.id.toString().startsWith('local_')
        });
        
        // If setting a local resume, also update localStorage
        if (resume && (!resume.id || resume.id.toString().startsWith('local_'))) {
          localStorageHelpers.saveResumeToLocal(resume);
        }
      },
      
      // Add section item with localStorage sync
      addSectionItem: (sectionName, item) => {
        const storeSectionName = get()._getSectionName(sectionName);
        
        const newItem = {
          ...item,
          id: generateLocalId(sectionName)
        };
        
        set(state => {
          if (!state.currentResume) return state;
          
          const updatedResume = {
            ...state.currentResume,
            [storeSectionName]: [
              ...(state.currentResume[storeSectionName] || []),
              newItem
            ]
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          return {
            ...state,
            currentResume: updatedResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          };
        });
        
        return newItem;
      },
      
      // Update section item with localStorage sync
      updateSectionItem: (sectionName, itemId, updatedItem) => {
        // Convert section name to the correct plural form if needed
        const storeSectionName = get()._getSectionName(sectionName);
        
        set(state => {
          if (!state.currentResume) return state;
          
          const sectionItems = state.currentResume[storeSectionName] || [];
          const updatedItems = sectionItems.map(item => 
            item.id === itemId ? { ...item, ...updatedItem } : item
          );
          
          const updatedResume = {
            ...state.currentResume,
            [storeSectionName]: updatedItems
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          return {
            ...state,
            currentResume: updatedResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          };
        });
      },
      
      // Remove section item with localStorage sync
      removeSectionItem: (sectionName, itemId) => {
        // Convert section name to the correct plural form if needed
        const storeSectionName = get()._getSectionName(sectionName);
        
        set(state => {
          if (!state.currentResume) return state;
          
          const sectionItems = state.currentResume[storeSectionName] || [];
          const updatedItems = sectionItems.filter(item => item.id !== itemId);
          
          const updatedResume = {
            ...state.currentResume,
            [storeSectionName]: updatedItems
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          return {
            ...state,
            currentResume: updatedResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          };
        });
      },
      
      // Update personal info with localStorage sync
      updatePersonalInfo: (updatedInfo) => {
        set(state => {
          if (!state.currentResume) return state;
          
          const updatedResume = {
            ...state.currentResume,
            personal_info: {
              ...state.currentResume.personal_info,
              ...updatedInfo
            }
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          return {
            ...state,
            currentResume: updatedResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          };
        });
      },
      
      // Update resume title with localStorage sync
      updateResumeTitle: (title) => {
        set(state => {
          if (!state.currentResume) return state;
          
          const updatedResume = {
            ...state.currentResume,
            title
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          return {
            ...state,
            currentResume: updatedResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          };
        });
      },
      
      // Reorder section items with localStorage sync
      reorderSectionItems: (sectionName, newOrderedItems) => {
        set(state => {
          if (!state.currentResume) return state;
          
          const updatedResume = {
            ...state.currentResume,
            [sectionName]: newOrderedItems
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          return {
            ...state,
            currentResume: updatedResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          };
        });
      },
      
      // Function to convert local resume to server resume (save to server)
      saveLocalResumeToServer: async () => {
        // If there's no current resume or we're not in local mode, return
        if (!get().currentResume || !get().isEditingLocally) {
          console.log("No local resume to save or not in local editing mode");
          return null;
        }
        
        try {
          set({ loading: true, error: null });
          
          const resumeData = get().currentResume;
          const dataForAPI = prepareResumeForAPI(resumeData);
          
          console.log('Saving local resume to server:', dataForAPI);
          
          const response = await apiCall(RESUME_ENDPOINTS.CREATE_RESUME, 'POST', dataForAPI);
          const processedResume = transformAPIResumeToStore(response);
          
          // Clear localStorage since we've successfully saved to server
          localStorageHelpers.clearResumeData();
          
          // Mark as saved to server
          if (processedResume && processedResume.id) {
            localStorageHelpers.markResumeSavedToServer(processedResume.id);
          }
          
          set(state => ({ 
            resumes: [...state.resumes.filter(r => r.id !== resumeData.id), processedResume],
            currentResume: processedResume,
            loading: false,
            isEditingLocally: false // Now working with server data
          }));
          
          return processedResume;
        } catch (err) {
          console.error('Error saving local resume to server:', err);
          set({ 
            error: err.message || 'Failed to save resume to server',
            loading: false 
          });
          throw err;
        }
      },
      
      // Update the customization settings with localStorage sync
      updateCustomization: (updatedSettings) => {
        set(state => {
          if (!state.currentResume) return state;
          
          const updatedResume = {
            ...state.currentResume,
            customization: {
              ...state.currentResume.customization,
              ...updatedSettings
            },
            // Also update the template directly if it's included in the settings
            ...(updatedSettings.template ? { template: updatedSettings.template } : {})
          };
          
          // Update localStorage if we're in local editing mode
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume);
          }
          
          return {
            ...state,
            currentResume: updatedResume,
            resumes: state.resumes.map(r => 
              r.id === updatedResume.id ? updatedResume : r
            )
          };
        });
      }
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist specific parts of the state to avoid duplication with our manual localStorage management
      partialize: (state) => ({
        resumes: state.resumes,
        // Don't persist currentResume - we'll manage that separately
        error: state.error
      }),
    }
  )
);

export default useResumeStore;