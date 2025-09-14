// config.js
import useAuthStore from './stores/authStore'; // Adjust the import path as needed

 
export const API_BASE_URL = 
//'http://localhost:8000';
//'https://51.20.70.82';
'https://api.cvati.com' ; 
 
  

// (window.location.hostname !== 'localhost') 
//   ? 'http://13.53.64.149:8000' 
//   : 'http://localhost:8000';
 
// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/token`,        // This is correct - matches your backend
  REGISTER: `${API_BASE_URL}/auth/register`,
  USER_INFO: `${API_BASE_URL}/auth/me`,       // Make sure this endpoint exists on backend
  SOCIAL_LOGIN: (provider) => `${API_BASE_URL}/social/${provider}/login`, 
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
  REQUEST_PASSWORD_RESET: `${API_BASE_URL}/auth/request-password-reset`,
  CONFIRM_PASSWORD_RESET: `${API_BASE_URL}/auth/confirm-password-reset`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
};

// Resume endpoints - these look correct
export const RESUME_ENDPOINTS = {
  GET_RESUME: `${API_BASE_URL}/resume/`,
  GET_RESUME_BY_ID: (id) => `${API_BASE_URL}/resume/${id}`,
  GET_RESUME_LIST: `${API_BASE_URL}/resume/list`,
  CREATE_RESUME: `${API_BASE_URL}/resume/`,
  UPDATE_RESUME: `${API_BASE_URL}/resume/`,
  DELETE_RESUME: (id) => `${API_BASE_URL}/resume/${id}`, // Fixed this to use id parameter
};

// CV AI endpoints 
export const CV_AI_ENDPOINTS = {
  IMPROVE_SECTION: `${API_BASE_URL}/cv-ai/improve-section`,
  IMPROVE_SUMMARY:  `${API_BASE_URL}/cv-ai/improve-section`, // ⭐ Check this
  IMPROVE_FULL_CV: `${API_BASE_URL}/cv-ai/improve-full-cv`,
  USAGE_LIMIT: `${API_BASE_URL}/cv-ai/usage-limit`,
  TASK_STATUS: (taskId) => `${API_BASE_URL}/cv-ai/task-status/${taskId}`,  
};

export const JOB_AI_ENDPOINTS = { 

};


// Cover Letter endpoints
export const COVER_LETTER_ENDPOINTS = {
  BASE: `${API_BASE_URL}/coverletter/`,
  GENERATE_COVER_LETTER: `${API_BASE_URL}/coverletter/generate`,
  BY_ID: (id) => `${API_BASE_URL}/coverletter/${id}`,
  TASK_STATUS: (taskId) => `${API_BASE_URL}/coverletter/task-status/${taskId}`, 
  REGENERATE: (id) => `${API_BASE_URL}/coverletter/${id}/regenerate`,
  EXPORT: (id) => `${API_BASE_URL}/coverletter/${id}/export`,
};

export const FEEDBACK_ENDPOINTS = {
  SUBMIT: `${API_BASE_URL}/feedback/submit`,
  SUBMIT_ANONYMOUS: `${API_BASE_URL}/feedback/anonymous`,
  GET_MY_FEEDBACK: `${API_BASE_URL}/feedback/my`,
  // Admin endpoints
  ADMIN_GET_ALL: `${API_BASE_URL}/feedback/admin/all`,
  ADMIN_GET_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_GET_STATS: `${API_BASE_URL}/admin/stats`,
  ADMIN_GET_BY_ID: (id) => `${API_BASE_URL}/feedback/admin/${id}`,
  ADMIN_UPDATE_STATUS: (id) => `${API_BASE_URL}/feedback/admin/${id}/status`, 
  ADMIN_DELETE: (id) => `${API_BASE_URL}/feedback/admin/${id}`,
};

// Configure axios defaults
import axios from 'axios';

// Set up default headers for all requests
axios.defaults.headers.common['Accept'] = 'application/json';
 
// Clean axios interceptor that adds the auth token to requests
axios.interceptors.request.use(
  (config) => {
    // Use Zustand store to get the token
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API_BASE_URL;