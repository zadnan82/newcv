import { create } from 'zustand';
import { persist } from 'zustand/middleware'; 
import { API_BASE_URL, AUTH_ENDPOINTS } from '../config';


const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      
      // Check if user is authenticated
      isAuthenticated: () => {
        const { token } = get();
        return !!token;
      },
      
      // Register a new user
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              first_name: userData.firstName,
              last_name: userData.lastName,
              email: userData.email,
              password: userData.password
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
          }
          
          const data = await response.json();
          const token = data.access_token || data.token;
          
          if (!token) {
            throw new Error('No token received from server');
          }
          
          // Fetch user info
          const userResponse = await fetch(AUTH_ENDPOINTS.USER_INFO, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!userResponse.ok) {
            throw new Error('Failed to fetch user info');
          }
          
          const userData = await userResponse.json();
          
          set({ 
            user: {
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name
            }, 
            token,
            loading: false 
          });
          
          // Dispatch auth change event
          window.dispatchEvent(new Event('authChange'));
          
          return { success: true };
        } catch (error) {
          console.error('Registration error:', error);
          set({ 
            error: error.message || 'Registration failed', 
            loading: false 
          });
          return { 
            success: false, 
            error: error.message || 'Registration failed'
          };
        }
      },
      
      // Log in a user
      // Update just the login method in your auth store 
// to include grant_type which your backend expects

login: async (credentials) => {
  set({ loading: true, error: null });
  try {
    // Force production API URL in production
    const apiURL = 'A';
    const loginEndpoint = `${apiURL}/auth/token`;
    
    // Prepare form data for login
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');
    
    //console.log('Logging in to:', loginEndpoint);
    
    // Login request with forced production URL
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include'
    });
     

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('Login error response:', errorData);
      } catch (e) {
        console.error('Could not parse error response');
        throw new Error(`Login failed (${response.status})`);
      }
      throw new Error(errorData.detail || 'Login failed');
    }
    
    const data = await response.json();
    //console.log('Login response data:', data);
    
    const token = data.access_token || data.token;
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    // Fetch user info
    const userResponse = await fetch(AUTH_ENDPOINTS.USER_INFO, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    const userData = await userResponse.json();
    
    // Update store state
    set({ 
      user: {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name
      }, 
      token,
      loading: false 
    });
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('authChange'));
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    set({ 
      error: error.message || 'Login failed', 
      loading: false 
    });
    return { 
      success: false, 
      error: error.message || 'Login failed'
    };
  }
},
      
// Add this method after the isAuthenticated method
setTokenDirectly: (token) => {
  if (token) {
    set({ token, loading: false, error: null });
  }
},

// Replace your current googleLogin method with this improved version
googleLogin: async (tokenResponse) => {
  set({ loading: true, error: null });
  try {
    if (!tokenResponse.access_token) {
      throw new Error('No access token received from Google');
    }
    
    console.log("Sending token to backend:", tokenResponse.access_token.substring(0, 10) + "...");
    
    const response = await fetch(AUTH_ENDPOINTS.GOOGLE_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: tokenResponse.access_token
      }),
      credentials: 'include'
    });
    
    let errorMessage = 'Google login failed';
    if (!response.ok) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If parsing JSON fails, use the default message
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    const token = data.access_token;
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    // Store the token before trying to fetch user info
    set({ token, loading: false });
    
    // Fetch user info
    const userData = await get().refreshUserInfo();
    
    if (!userData) {
      throw new Error('Failed to fetch user info after successful login');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Google login error:', error);
    set({ 
      error: error.message || 'Google login failed', 
      loading: false 
    });
    return { 
      success: false, 
      error: error.message || 'Google login failed'
    };
  }
},

// And improve your refreshUserInfo method slightly
refreshUserInfo: async () => {
  const { token } = get();
  
  if (!token) return null;
  
  try {
    const userResponse = await fetch(AUTH_ENDPOINTS.USER_INFO, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include credentials for cookies
    });
    
    if (!userResponse.ok) {
      if (userResponse.status === 401) {
        get().logout(); // Auto logout on unauthorized
      }
      throw new Error(`Failed to fetch user info: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    // Update user in state - now including role
    set({ 
      user: {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role  // Make sure to include the role!
      }
    });
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('authChange'));
    
    return userData;
  } catch (error) {
    console.error('Refresh user info error:', error);
    
    // If unauthorized, logout the user
    if (error.message.includes('401')) {
      get().logout();
    }
    
    return null;
  }
},
      

      // Log out the user
      logout: async () => {
        const { token } = get();
        
        try {
          if (token) {
            // Optional: Call logout endpoint if your backend supports it
            await fetch(AUTH_ENDPOINTS.LOGOUT, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        // Clear authentication state
        set({ 
          user: null, 
          token: null, 
          error: null,
          loading: false 
        });
        
        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));
      },
      
      
      
      // Clear error message
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      getStorage: () => localStorage,
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        token: state.token
      })
    }
  )
);

export default useAuthStore;