// stores/index.js
// Central export for all stores

import useAuthStore from './authStore';
import useResumeStore from './resumeStore';
import useUIStore from './uiStore';
import useCoverLetterStore from './coverLetterStore';

 

const stores = {
  useAuthStore,
  useCoverLetterStore,
  useResumeStore,
  useUIStore
};

export default stores;