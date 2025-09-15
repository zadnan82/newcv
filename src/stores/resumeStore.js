// src/stores/resumeStore.js - Updated for cloud storage backend
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  RESUME_ENDPOINTS, 
  buildResumeURL,
  getSessionToken 
} from '../config';
import useSessionStore from './sessionStore';

// Helper to generate unique local IDs
const generateLocalId = (prefix = 'local') => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// Helper function for API calls with cloud provider context
const apiCall = async (endpoint, method = 'GET', body = null, provider = null, fileId = null) => {
  const token = getSessionToken();
  
  if (!token) {
    throw new Error('No active session');
  }

  let url = endpoint;
  
  // For resume operations, build the URL with provider and fileId
  if (provider && (method !== 'GET' || fileId)) {
    if (endpoint.includes('/api/resume/')) {
      const baseUrl = endpoint.split('?')[0]; // Remove any existing query params
      url = new URL(baseUrl + (fileId || ''));
      url.searchParams.set('provider', provider);
      url = url.toString();
    }
  }

  const config = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }
  
  // Check if there's no content (204) or if the response is empty
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }
  
  return response.json();
};

// Transform API response to store format (same logic but with cloud metadata)
const transformAPIResumeToStore = (apiResume, provider = null, fileId = null) => {
  if (!apiResume) return null;
  
  if (Array.isArray(apiResume)) {
    if (apiResume.length === 0) return null;
    apiResume = apiResume[0];
  }
  
  return {
    id: fileId || apiResume.id || generateLocalId('resume'),
    cloud_file_id: fileId || apiResume.id,
    cloud_provider: provider,
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
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        const aDate = a.current ? a.start_date : (a.end_date || a.start_date);
        const bDate = b.current ? b.start_date : (b.end_date || b.start_date);
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
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        const aDate = a.current ? a.start_date : (a.end_date || a.start_date);
        const bDate = b.current ? b.start_date : (b.end_date || b.start_date);
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
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        const aDate = a.current ? a.start_date : (a.end_date || a.start_date);
        const bDate = b.current ? b.start_date : (b.end_date || b.start_date);
        return new Date(bDate) - new Date(aDate);
      }),
    photos: apiResume.photos || { photolink: null },
    created_at: apiResume.created_at || new Date().toISOString(),
    updated_at: apiResume.updated_at || new Date().toISOString(),
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

// Prepare resume data for API submission (updated for cloud format)
const prepareResumeForAPI = (resumeData) => {
  return {
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
    photo: {
      photolink: resumeData.photos?.photolink || 
                 resumeData.photo?.photolink || 
                 (Array.isArray(resumeData.photos) && resumeData.photos[0]?.photo) ||
                 (Array.isArray(resumeData.photos) && resumeData.photos[0]?.photolink) ||
                 ''
    },
    customization: resumeData.customization || {
      template: 'stockholm',
      accent_color: "#1a5276",
      font_family: "Helvetica, Arial, sans-serif",
      line_spacing: 1.5,
      headings_uppercase: false,
      hide_skill_level: false
    }
  };
};

// Local storage helpers (updated for cloud context)
const localStorageHelpers = {
  clearResumeData: () => {
    localStorage.removeItem('resumeFormData');
    localStorage.removeItem('currentCloudProvider');
    localStorage.removeItem('currentFileId');
  },
  
  saveResumeToLocal: (resumeData, provider = null, fileId = null) => {
    localStorage.setItem('resumeFormData', JSON.stringify(resumeData));
    if (provider) localStorage.setItem('currentCloudProvider', provider);
    if (fileId) localStorage.setItem('currentFileId', fileId);
  },
  
  getResumeFromLocal: () => {
    try {
      const data = localStorage.getItem('resumeFormData');
      const provider = localStorage.getItem('currentCloudProvider');
      const fileId = localStorage.getItem('currentFileId');
      
      return {
        resumeData: data ? JSON.parse(data) : null,
        provider,
        fileId
      };
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return { resumeData: null, provider: null, fileId: null };
    }
  },
  
  isCreatingNewResume: () => {
    return !localStorage.getItem('currentFileId');
  },
  
  markResumeSavedToCloud: (fileId, provider) => {
    localStorage.setItem('currentFileId', fileId);
    localStorage.setItem('currentCloudProvider', provider);
  },
  
  clearResumeSavedStatus: () => {
    localStorage.removeItem('currentFileId');
    localStorage.removeItem('currentCloudProvider');
  }
};

// Resume Store (updated for cloud storage)
const useResumeStore = create(
  persist(
    (set, get) => ({
      resumes: [],
      currentResume: null,
      currentProvider: null,
      currentFileId: null,
      loading: false,
      error: null,
      isEditingLocally: false,
      
      // Helper function to get correct section name
      _getSectionName: (sectionName) => {
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
      
      // ================== CLOUD-AWARE RESUME OPERATIONS ==================
      
      // Start a new resume (requires cloud provider selection)
      startNewResume: (provider = null) => {
        // Clear any existing local editing session
        localStorageHelpers.clearResumeData();
        
        // Get preferred provider if none specified
        if (!provider) {
          provider = useSessionStore.getState().getPreferredProvider();
        }
        
        if (!provider) {
          throw new Error('No cloud provider available. Please connect a cloud storage service first.');
        }
        
        // Create a blank resume
        const blankResume = {
          id: generateLocalId('resume'),
          cloud_provider: provider,
          cloud_file_id: null, // Will be set when saved to cloud
          title: 'My Resume',
          is_public: false,
          personal_info: {
            full_name: '', email: '', mobile: '', address: '', linkedin: '',
            title: '', date_of_birth: '', nationality: '', place_of_birth: '',
            postal_code: '', driving_license: '', city: '', website: '', summary: ''
          },
          educations: [], experiences: [], skills: [], languages: [], referrals: [],
          custom_sections: [], extracurriculars: [], hobbies: [], courses: [], internships: [],
          photos: { photolink: null },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          template: 'stockholm',
          customization: {
            template: 'stockholm', accent_color: "#1a5276",
            font_family: "Helvetica, Arial, sans-serif", line_spacing: 1.5,
            headings_uppercase: false, hide_skill_level: false
          }
        };
        
        set({ 
          currentResume: blankResume, 
          currentProvider: provider,
          currentFileId: null,
          isEditingLocally: true
        });
        
        localStorageHelpers.saveResumeToLocal(blankResume, provider, null);
        
        return blankResume;
      },
      
      // Fetch all resumes from all connected cloud providers
      fetchResumes: async () => {
        set({ loading: true, error: null });
        
        try {
          const sessionStore = useSessionStore.getState();
          const providers = sessionStore.connectedProviders;
          
          if (providers.length === 0) {
            set({ 
              resumes: [],
              currentResume: null,
              loading: false,
              isEditingLocally: false
            });
            return [];
          }
          
          // Fetch from all providers
          let allResumes = [];
          
          for (const provider of providers) {
            try {
              const url = new URL(RESUME_ENDPOINTS.LIST);
              url.searchParams.set('provider', provider);
              
              const response = await apiCall(url.toString(), 'GET', null, provider);
              
              if (Array.isArray(response)) {
                const providerResumes = response.map(file => 
                  transformAPIResumeToStore({ 
                    title: file.name.replace('.json', ''),
                    // We'll need to load the full resume content separately
                  }, provider, file.file_id)
                );
                allResumes = [...allResumes, ...providerResumes];
              }
            } catch (error) {
              console.error(`Error fetching resumes from ${provider}:`, error);
              // Continue with other providers
            }
          }
          
          set({ 
            resumes: allResumes,
            currentResume: allResumes[0] || null,
            loading: false,
            isEditingLocally: false
          });
          
          return allResumes;
        } catch (err) {
          console.error('Error fetching resumes:', err);
          set({ 
            error: err.message || 'Failed to load resumes',
            loading: false 
          });
          return [];
        }
      },
      
      // Fetch specific resume by file ID and provider
      fetchResume: async (fileId, provider = null) => {
        set({ loading: true, error: null });
        
        try {
          if (!fileId) {
            throw new Error('Invalid resume file ID provided');
          }
          
          // Use provided provider or get from session
          if (!provider) {
            provider = get().currentProvider || useSessionStore.getState().getPreferredProvider();
          }
          
          if (!provider) {
            throw new Error('No cloud provider specified');
          }
          
          const url = buildResumeURL(RESUME_ENDPOINTS.GET_BY_ID, fileId, provider);
          const response = await apiCall(url, 'GET', null, provider, fileId);
          
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid response from server');
          }
          
          const processedResume = transformAPIResumeToStore(response, provider, fileId);
          
          if (!processedResume) {
            throw new Error('Failed to process resume data');
          }
          
          set({ 
            currentResume: processedResume,
            currentProvider: provider,
            currentFileId: fileId,
            resumes: get().resumes.some(r => r.id === processedResume.id) 
              ? get().resumes.map(r => r.id === processedResume.id ? processedResume : r)
              : [...get().resumes, processedResume],
            loading: false,
            isEditingLocally: false
          });
          
          return processedResume;
        } catch (err) {
          console.error("Error in fetchResume:", err);
          set({ 
            error: err.message || 'Failed to load resume',
            loading: false 
          });
          return null;
        }
      },
      
      // Create a new resume in cloud storage
      createResume: async (resumeData, provider = null) => {
        set({ loading: true, error: null });
        
        try {
          // Use provided provider or get from current state
          if (!provider) {
            provider = get().currentProvider || useSessionStore.getState().getPreferredProvider();
          }
          
          if (!provider) {
            throw new Error('No cloud provider available');
          }
          
          const dataForAPI = prepareResumeForAPI(resumeData);
          
          const url = new URL(RESUME_ENDPOINTS.CREATE);
          url.searchParams.set('provider', provider);
          
          const response = await apiCall(url.toString(), 'POST', dataForAPI, provider);
          
          const fileId = response.id || response.file_id;
          const processedResume = transformAPIResumeToStore(response, provider, fileId);
          
          // Clear localStorage since we've successfully saved to cloud
          localStorageHelpers.clearResumeData();
          localStorageHelpers.markResumeSavedToCloud(fileId, provider);
          
          set(state => ({ 
            resumes: [...state.resumes, processedResume],
            currentResume: processedResume,
            currentProvider: provider,
            currentFileId: fileId,
            loading: false,
            isEditingLocally: false
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
      
      // Update resume in cloud storage
      updateResume: async (resumeData, fileId = null, provider = null) => {
        set({ loading: true, error: null });
        
        try {
          // Use provided values or get from current state
          const targetFileId = fileId || get().currentFileId;
          const targetProvider = provider || get().currentProvider;
          
          if (!targetFileId || !targetProvider) {
            throw new Error('No file ID or provider specified for update');
          }
          
          // If we're in local editing mode, save to cloud
          if (get().isEditingLocally) {
            const dataForAPI = prepareResumeForAPI(resumeData);
            
            const url = buildResumeURL(RESUME_ENDPOINTS.UPDATE, targetFileId, targetProvider);
            const response = await apiCall(url, 'PUT', dataForAPI, targetProvider, targetFileId);
            
            const processedResume = transformAPIResumeToStore(response, targetProvider, targetFileId);
            
            localStorageHelpers.clearResumeData();
            localStorageHelpers.markResumeSavedToCloud(targetFileId, targetProvider);
            
            set(state => ({
              resumes: state.resumes.map(r => 
                r.cloud_file_id === targetFileId && r.cloud_provider === targetProvider ? processedResume : r
              ),
              currentResume: processedResume,
              currentProvider: targetProvider,
              currentFileId: targetFileId,
              loading: false,
              isEditingLocally: false
            }));
            
            return processedResume;
          } else {
            // Update local state and localStorage for local editing
            localStorageHelpers.saveResumeToLocal(resumeData, targetProvider, targetFileId);
            
            set(state => ({
              currentResume: resumeData,
              loading: false
            }));
            
            return resumeData;
          }
        } catch (err) {
          console.error('Error updating resume:', err);
          set({ 
            error: err.message || 'Failed to update resume',
            loading: false 
          });
          throw err;
        }
      },
      
      // Delete resume from cloud storage
      deleteResume: async (fileId = null, provider = null) => {
        set({ loading: true, error: null });
        
        try {
          const targetFileId = fileId || get().currentFileId;
          const targetProvider = provider || get().currentProvider;
          
          if (!targetFileId || !targetProvider) {
            throw new Error('No file ID or provider specified for deletion');
          }
          
          // Check if this is a local-only resume
          const isLocalId = targetFileId.toString().startsWith('local_');
          
          if (isLocalId) {
            localStorageHelpers.clearResumeData();
            
            set(state => ({
              resumes: state.resumes.filter(r => r.id !== targetFileId),
              currentResume: state.currentResume?.id === targetFileId ? null : state.currentResume,
              currentFileId: null,
              currentProvider: null,
              loading: false,
              isEditingLocally: false
            }));
            
            return true;
          }
           
          const url = buildResumeURL(RESUME_ENDPOINTS.DELETE, targetFileId, targetProvider);
          await apiCall(url, 'DELETE', null, targetProvider, targetFileId);
          
          localStorageHelpers.clearResumeData();
          
          set(state => ({
            resumes: state.resumes.filter(r => 
              !(r.cloud_file_id === targetFileId && r.cloud_provider === targetProvider)
            ),
            currentResume: (state.currentResume?.cloud_file_id === targetFileId && 
                           state.currentResume?.cloud_provider === targetProvider) ? null : state.currentResume,
            currentFileId: state.currentFileId === targetFileId ? null : state.currentFileId,
            currentProvider: state.currentFileId === targetFileId ? null : state.currentProvider,
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
      
      // ================== LOCAL EDITING METHODS ==================
      
      // Save current state to localStorage
      saveToLocalStorage: () => {
        const { currentResume, currentProvider, currentFileId } = get();
        if (currentResume) {
          localStorageHelpers.saveResumeToLocal(currentResume, currentProvider, currentFileId);
          set({ isEditingLocally: true });
        }
      },
      
      // Clear localStorage
      clearLocalStorage: () => {
        localStorageHelpers.clearResumeData();
      },
      
      // Set current resume with cloud context
      setCurrentResume: (resume, provider = null, fileId = null) => {
        set({ 
          currentResume: resume,
          currentProvider: provider || resume?.cloud_provider,
          currentFileId: fileId || resume?.cloud_file_id,
          isEditingLocally: resume && (!resume.cloud_file_id || resume.id?.toString().startsWith('local_'))
        });
        
        if (resume && (!resume.cloud_file_id || resume.id?.toString().startsWith('local_'))) {
          localStorageHelpers.saveResumeToLocal(resume, provider, fileId);
        }
      },
      
      // ================== SECTION MANAGEMENT WITH LOCAL SYNC ==================
      
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
          
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume, state.currentProvider, state.currentFileId);
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
          
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume, state.currentProvider, state.currentFileId);
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
        const storeSectionName = get()._getSectionName(sectionName);
        
        set(state => {
          if (!state.currentResume) return state;
          
          const sectionItems = state.currentResume[storeSectionName] || [];
          const updatedItems = sectionItems.filter(item => item.id !== itemId);
          
          const updatedResume = {
            ...state.currentResume,
            [storeSectionName]: updatedItems
          };
          
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume, state.currentProvider, state.currentFileId);
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
          
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume, state.currentProvider, state.currentFileId);
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
          
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume, state.currentProvider, state.currentFileId);
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
      
      // Update customization settings with localStorage sync
      updateCustomization: (updatedSettings) => {
        set(state => {
          if (!state.currentResume) return state;
          
          const updatedResume = {
            ...state.currentResume,
            customization: {
              ...state.currentResume.customization,
              ...updatedSettings
            },
            ...(updatedSettings.template ? { template: updatedSettings.template } : {})
          };
          
          if (state.isEditingLocally) {
            localStorageHelpers.saveResumeToLocal(updatedResume, state.currentProvider, state.currentFileId);
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
      
      // ================== UTILITY METHODS ==================
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Check if user has connected cloud providers
      hasCloudProviders: () => {
        return useSessionStore.getState().hasConnectedProviders();
      },
      
      // Get current provider info
      getCurrentProviderInfo: () => {
        const { currentProvider } = get();
        if (!currentProvider) return null;
        
        return useSessionStore.getState().getProviderStatus(currentProvider);
      },
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resumes: state.resumes,
        error: state.error
        // Don't persist currentResume - we'll manage that separately with cloud context
      }),
    }
  )
);

export default useResumeStore;