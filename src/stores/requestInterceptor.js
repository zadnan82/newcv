// import useAuthStore from './path/to/authStore';

// export const addTokenToRequest = (url, options = {}) => {
//   const token = useAuthStore.getState().token;
  
//   // Clone the options to avoid modifying the original
//   const newOptions = { ...options };
  
//   // Set headers, preserving any existing headers
//   newOptions.headers = {
//     ...newOptions.headers,
//     'Content-Type': 'application/json',
//   };
  
//   // Add authorization header if token exists
//   if (token) {
//     newOptions.headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   return { url, options: newOptions };
// };

// // Wrapper function for fetch that adds token
// export const fetchWithAuth = async (url, options = {}) => {
//   const { url: finalUrl, options: finalOptions } = addTokenToRequest(url, options);
//   return fetch(finalUrl, finalOptions);
// };