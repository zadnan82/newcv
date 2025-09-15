 // config.js - Updated for cloud storage backend
import useAuthStore from './stores/authStore';

export const API_BASE_URL = 'https://api.cvati.com';

// ================== HEALTH AND INFO ENDPOINTS ==================
export const HEALTH_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  DETAILED_HEALTH: `${API_BASE_URL}/health/detailed`,
  API_INFO: `${API_BASE_URL}/api/info`,
};

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

// ================== UPDATED RESUME ENDPOINTS ==================
export const RESUME_ENDPOINTS = {
  // All resume operations now require provider and file_id
  LIST: `${API_BASE_URL}/api/resume/`,
  GET_BY_ID: `${API_BASE_URL}/api/resume/`, // Will append file_id and provider as query params
  CREATE: `${API_BASE_URL}/api/resume/`,
  UPDATE: `${API_BASE_URL}/api/resume/`, // Will append file_id and provider as query params
  DELETE: `${API_BASE_URL}/api/resume/`, // Will append file_id and provider as query params
  SEARCH: `${API_BASE_URL}/api/resume/search/`,
  BACKUP: `${API_BASE_URL}/api/resume/`, // Will append file_id/backup
  SYNC: `${API_BASE_URL}/api/resume/`, // Will append file_id/sync
  DUPLICATE: `${API_BASE_URL}/api/resume/`, // Will append file_id/duplicate
  VERSIONS: `${API_BASE_URL}/api/resume/`, // Will append file_id/versions
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

// ================== COVER LETTER ENDPOINTS ==================
export const COVER_LETTER_ENDPOINTS = {
  LIST: `${API_BASE_URL}/api/cover-letter/`,
  GENERATE: `${API_BASE_URL}/api/cover-letter/generate`,
  GET_BY_ID: `${API_BASE_URL}/api/cover-letter/`, // Will append id
  DELETE: `${API_BASE_URL}/api/cover-letter/`, // Will append id
  CUSTOMIZE: `${API_BASE_URL}/api/cover-letter/customize`,
};

// ================== DEPRECATED - OLD AUTH ENDPOINTS ==================
// These are kept for backward compatibility during migration
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/token`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  USER_INFO: `${API_BASE_URL}/auth/me`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  // Keep these for existing social login if still needed
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
  REQUEST_PASSWORD_RESET: `${API_BASE_URL}/auth/request-password-reset`,
  CONFIRM_PASSWORD_RESET: `${API_BASE_URL}/auth/confirm-password-reset`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
};




  // CV AI endpoints 
export const CV_AI_ENDPOINTS = {
  IMPROVE_SECTION: `${API_BASE_URL}/cv-ai/improve-section`,
  IMPROVE_SUMMARY:  `${API_BASE_URL}/cv-ai/improve-section`, // ⭐ Check this
  IMPROVE_FULL_CV: `${API_BASE_URL}/cv-ai/improve-full-cv`,
  USAGE_LIMIT: `${API_BASE_URL}/cv-ai/usage-limit`,
  TASK_STATUS: (taskId) => `${API_BASE_URL}/cv-ai/task-status/${taskId}`,  
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
  // First try to get from the new session storage
  const sessionToken = localStorage.getItem('cv_session_token');
  if (sessionToken) {
    return sessionToken;
  }
  
  // Fallback to old auth token during migration
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

// Updated axios interceptor for session-based auth
axios.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or invalid
      clearSessionToken();
      // Don't automatically redirect - let components handle this
      window.dispatchEvent(new CustomEvent('sessionExpired'));
    }
    return Promise.reject(error);
  }
);

export default API_BASE_URL;





 