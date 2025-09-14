// src/stores/uiStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set, get) => ({
      // Modal states
      modals: {
        signup: false,
        login: false,
        template: false,
        addContent: false,
        education: false,
      },
      
      // Active navigation items
      activeItem: 'Resume',
      
      // Editor states
      editorActiveTab: 'content',
      showSettings: false,
      
      // Current editing data
      currentEducation: null,
      
      // Open and close modal functions
      openModal: (modalName) => set(state => ({
        modals: {
          ...state.modals,
          [modalName]: true
        }
      })),
      
      closeModal: (modalName) => set(state => ({
        modals: {
          ...state.modals,
          [modalName]: false
        }
      })),
      
      // Switch between signup and login modals
      switchToSignup: () => set(state => ({
        modals: {
          ...state.modals,
          signup: true,
          login: false
        }
      })),
      
      switchToLogin: () => set(state => ({
        modals: {
          ...state.modals,
          signup: false,
          login: true
        }
      })),
      
      // Set active navigation item
      setActiveItem: (item) => set({ 
        activeItem: item,
        showSettings: false 
      }),
      
      // Toggle settings panel
      toggleSettings: () => set(state => ({ 
        showSettings: !state.showSettings,
        activeItem: 'More' // Keep "More" highlighted when settings are open
      })),
      
      // Set editor active tab
      setEditorActiveTab: (tab) => set({ editorActiveTab: tab }),
      
      // Set current education for editing
      setCurrentEducation: (education) => set({ 
        currentEducation: education,
        modals: {
          ...get().modals,
          education: true
        }
      }),
      
      // Clear current education
      clearCurrentEducation: () => set({ 
        currentEducation: null 
      }),
      
      // Reset all UI state (useful on logout)
      resetUIState: () => set({
        modals: {
          signup: false,
          login: false,
          template: false,
          addContent: false,
          education: false,
        },
        activeItem: 'Resume',
        editorActiveTab: 'content',
        showSettings: false,
        currentEducation: null
      })
    }),
    {
      name: 'ui-storage',
      getStorage: () => localStorage,
      // Only persist selected UI states
      partialize: (state) => ({
        activeItem: state.activeItem,
        editorActiveTab: state.editorActiveTab
      })
    }
  )
);

// Make sure the default export is properly defined
export default useUIStore;