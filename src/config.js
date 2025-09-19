// config.js - FIXED with clean cover letter endpoints
//import useAuthStore from './stores/authStore';

// ================== ENVIRONMENT DETECTION ==================
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

// Use localhost for development, production API for production
export const API_BASE_URL = isDevelopment ? 'http://localhost:8000' : 'https://api.cvati.com';

console.log(`🔧 API Mode: ${isDevelopment ? 'Development (localhost:8000)' : 'Production (api.cvati.com)'}`);

// ================== HEALTH AND INFO ENDPOINTS ==================
export const HEALTH_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  DETAILED_HEALTH: `${API_BASE_URL}/health/detailed`,
  API_INFO: `${API_BASE_URL}/api/info`,
};

// ================== CLOUD ENDPOINTS ==================
export const CLOUD_ENDPOINTS = {
  PROVIDERS: `${API_BASE_URL}/api/cloud/providers`,
  CONNECT: (provider) => `${API_BASE_URL}/api/cloud/connect/${provider}`,
  CALLBACK: (provider) => `${API_BASE_URL}/api/cloud/callback/${provider}`,
  STATUS: `${API_BASE_URL}/api/cloud/status`,
  STATUS_PROVIDER: (provider) => `${API_BASE_URL}/api/cloud/status/${provider}`,
  DISCONNECT: (provider) => `${API_BASE_URL}/api/cloud/disconnect/${provider}`,
  TEST: (provider) => `${API_BASE_URL}/api/cloud/test/${provider}`,
  HEALTH: `${API_BASE_URL}/api/cloud/health`,
  REFRESH_TOKENS: `${API_BASE_URL}/api/cloud/refresh-tokens`,
};

// ================== RESUME ENDPOINTS (CVs) ==================
export const RESUME_ENDPOINTS = {
  LIST: `${API_BASE_URL}/api/resume/`,
  GET_BY_ID: `${API_BASE_URL}/api/resume/`,
  CREATE: `${API_BASE_URL}/api/resume/`,
  UPDATE: `${API_BASE_URL}/api/resume/`,
  DELETE: `${API_BASE_URL}/api/resume/`,
  SEARCH: `${API_BASE_URL}/api/resume/search/`,
  BACKUP: `${API_BASE_URL}/api/resume/`,
  SYNC: `${API_BASE_URL}/api/resume/`,
  DUPLICATE: `${API_BASE_URL}/api/resume/`,
  VERSIONS: `${API_BASE_URL}/api/resume/`,
};

// ================== AI ENHANCEMENT ENDPOINTS ==================
export const AI_ENDPOINTS = {
  USAGE: `${API_BASE_URL}/api/ai/usage`,
  ENHANCE_SUMMARY: `${API_BASE_URL}/api/ai/enhance-summary`,
  ENHANCE_EXPERIENCE: `${API_BASE_URL}/api/ai/enhance-experience`,
  SUGGEST_SKILLS: `${API_BASE_URL}/api/ai/suggest-skills`,
  ANALYZE_JOB: `${API_BASE_URL}/api/ai/analyze-job-match`,
  MODELS: `${API_BASE_URL}/api/ai/models`,
}; 

// ================== DEVELOPMENT OAUTH REDIRECT URLS ==================
export const getOAuthRedirectUrl = (provider) => { 
  const baseUrl = isDevelopment ? window.location.origin : window.location.origin;
  return `${baseUrl}/api/cloud/callback/${provider}`;
};

// ================== SESSION ENDPOINTS ==================
export const SESSION_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/api/session`,
  VALIDATE: `${API_BASE_URL}/api/session/validate`,
  CLEAR: `${API_BASE_URL}/api/session/clear`,
};

// ================== DEPRECATED - OLD AUTH ENDPOINTS ==================
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/token`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  USER_INFO: `${API_BASE_URL}/auth/me`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
  REQUEST_PASSWORD_RESET: `${API_BASE_URL}/auth/request-password-reset`,
  CONFIRM_PASSWORD_RESET: `${API_BASE_URL}/auth/confirm-password-reset`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
};

// CV AI endpoints 
export const CV_AI_ENDPOINTS = {
  IMPROVE_SECTION: `${API_BASE_URL}/cv-ai/improve-section`,
  IMPROVE_SUMMARY: `${API_BASE_URL}/cv-ai/improve-section`,
  IMPROVE_FULL_CV: `${API_BASE_URL}/cv-ai/improve-full-cv`,
  USAGE_LIMIT: `${API_BASE_URL}/cv-ai/usage-limit`,
  TASK_STATUS: (taskId) => `${API_BASE_URL}/cv-ai/task-status/${taskId}`,  
};

export const FEEDBACK_ENDPOINTS = {
  SUBMIT: `${API_BASE_URL}/feedback/submit`,
  SUBMIT_ANONYMOUS: `${API_BASE_URL}/feedback/anonymous`,
  GET_MY_FEEDBACK: `${API_BASE_URL}/feedback/my`,
  ADMIN_GET_ALL: `${API_BASE_URL}/feedback/admin/all`,
  ADMIN_GET_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_GET_STATS: `${API_BASE_URL}/admin/stats`,
  ADMIN_GET_BY_ID: (id) => `${API_BASE_URL}/feedback/admin/${id}`,
  ADMIN_UPDATE_STATUS: (id) => `${API_BASE_URL}/feedback/admin/${id}/status`, 
  ADMIN_DELETE: (id) => `${API_BASE_URL}/feedback/admin/${id}`,
};

// ================== FIXED COVER LETTER ENDPOINTS - CLEAN SEPARATION ==================
export const COVER_LETTER_ENDPOINTS = {
  // Generation endpoint (still uses the original cover letter API)
  GENERATE: `${API_BASE_URL}/api/cover-letter/generate`,
  
  // CLEAN Google Drive endpoints for cover letters (separate from CVs)
  LIST: `${API_BASE_URL}/api/google-drive/cover-letters`,
  LOAD: (id) => `${API_BASE_URL}/api/google-drive/cover-letters/${id}`,
  DELETE: (id) => `${API_BASE_URL}/api/google-drive/cover-letters/${id}`,
  UPDATE: (id) => `${API_BASE_URL}/api/google-drive/cover-letters/${id}`,
  
  // Legacy endpoints (may still be used by generation process)
  BASE: `${API_BASE_URL}/api/cover-letter/`,
  ALL: `${API_BASE_URL}/api/cover-letter/list-cover-letters`,
  LEGACY_UPDATE: (id) => `${API_BASE_URL}/api/cover-letter/update/${id}`,
  BY_ID: (id) => `${API_BASE_URL}/api/cover-letter/${id}`,
  TASK_STATUS: (taskId) => `${API_BASE_URL}/api/cover-letter/task-status/${taskId}`,
  LEGACY_DELETE: (id) => `${API_BASE_URL}/api/cover-letter/delete/${id}`,
  SAVE: `${API_BASE_URL}/api/cover-letter/save`,    
};

// ================== GOOGLE DRIVE ENDPOINTS (CVs) ==================
export const GOOGLE_DRIVE_ENDPOINTS = {
  PROVIDERS: `${API_BASE_URL}/api/google-drive/providers`,
  CONNECT: `${API_BASE_URL}/api/google-drive/connect`,
  STATUS: `${API_BASE_URL}/api/google-drive/status`,
  TEST: `${API_BASE_URL}/api/google-drive/test`,
  
  // CV-specific endpoints
  SAVE: `${API_BASE_URL}/api/google-drive/save`,
  LIST: `${API_BASE_URL}/api/google-drive/list`,
  LOAD: (fileId) => `${API_BASE_URL}/api/google-drive/load/${fileId}`,
  DELETE: (fileId) => `${API_BASE_URL}/api/google-drive/delete/${fileId}`, 
  UPDATE: (fileId) => `${API_BASE_URL}/api/google-drive/update-file/${fileId}`,
  
  // Generic endpoints
  DISCONNECT: `${API_BASE_URL}/api/google-drive/disconnect`,
  DEBUG: `${API_BASE_URL}/api/google-drive/debug`,
  
  // Cover letter specific endpoints (separate from CVs)
  COVER_LETTERS: {
    LIST: `${API_BASE_URL}/api/google-drive/cover-letters`,
    LOAD: (fileId) => `${API_BASE_URL}/api/google-drive/cover-letters/${fileId}`,
    DELETE: (fileId) => `${API_BASE_URL}/api/google-drive/cover-letters/${fileId}`,
    UPDATE: (fileId) => `${API_BASE_URL}/api/google-drive/cover-letters/${fileId}`,
    SAVE: `${API_BASE_URL}/api/google-drive/save-cover-letter`,
  }
};

// ================== UTILITY FUNCTIONS ==================

// Helper to build resume API URLs with provider and file_id
export const buildResumeURL = (baseEndpoint, fileId, provider, action = '') => {
  const url = new URL(baseEndpoint + (action ? `${fileId}/${action}` : fileId));
  url.searchParams.set('provider', provider);
  return url.toString();
};

// Helper to build AI enhancement URLs
export const buildAIURL = (baseEndpoint, fileId, provider) => {
  const url = new URL(baseEndpoint);
  url.searchParams.set('cv_file_id', fileId);
  url.searchParams.set('provider', provider);
  return url.toString();
};

// ================== SESSION TOKEN MANAGEMENT ==================

// Get session token from localStorage or authStore
export const getSessionToken = () => {
  const sessionToken = localStorage.getItem('cv_session_token');
  if (sessionToken) {
    return sessionToken;
  }
  
  const authToken = useAuthStore.getState().token;
  return authToken;
};

// Set session token
export const setSessionToken = (token) => {
  localStorage.setItem('cv_session_token', token);
};

// Clear session token
export const clearSessionToken = () => {
  localStorage.removeItem('cv_session_token');
  localStorage.removeItem('cv_cloud_providers');
};

// ================== AXIOS INTERCEPTOR - UPDATED ==================
import axios from 'axios';

// Configure axios defaults
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL = API_BASE_URL;

// Updated axios interceptor for session-based auth
axios.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (isDevelopment) {
      console.log(`🔗 ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
axios.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (isDevelopment) {
      console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (isDevelopment) {
      console.error(`❌ ${error.response?.status || 'Network'} ${error.config?.url}`, {
        error: error.response?.data || error.message,
        status: error.response?.status
      });
    }
    
    if (error.response?.status === 401) {
      clearSessionToken();
      window.dispatchEvent(new CustomEvent('sessionExpired'));
    }
    return Promise.reject(error);
  }
);

// ================== DEVELOPMENT HELPERS ==================

// Check if backend is available
export const checkBackendAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend not available:', error);
    return false;
  }
};

// Export environment info
export const ENV_INFO = {
  isDevelopment,
  apiBaseUrl: API_BASE_URL,
  frontendUrl: isDevelopment ? 'http://localhost:5173' : window.location.origin
};

export default API_BASE_URL;