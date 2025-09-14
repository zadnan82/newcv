 
import { create } from 'zustand';
import axios from 'axios';
import API_BASE_URL, { FEEDBACK_ENDPOINTS } from '../config';

const useAdminStore = create((set) => ({
  stats: null,
  users: [],
  loading: false,
  error: null,
  
  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(FEEDBACK_ENDPOINTS.ADMIN_GET_STATS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ stats: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.detail || 'Error fetching admin stats', loading: false });
      return null;
    }
  },
  
  fetchUsers: async (search = '', page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const skip = (page - 1) * limit;
      const params = { skip, limit };
      if (search) params.search = search;
      
      const response = await axios.get(FEEDBACK_ENDPOINTS.ADMIN_GET_USERS, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ users: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.detail || 'Error fetching users', loading: false });
      return [];
    }
  },
  
  createAdmin: async (adminData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/create-admin`, adminData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.detail || 'Error creating admin user', loading: false });
      return null;
    }
  }
}));

export default useAdminStore;