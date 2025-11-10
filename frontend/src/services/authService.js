import api from './api.js';
import axios from 'axios';

export const authService = {
  async login(username, password) {
    const TIMEOUT_MS = 5000; // 5 second timeout - shorter for faster feedback
    
    // Declare timeout outside try block so it's accessible in catch
    let abortTimeout = null;
    
    try {
      // Use relative URL to work with Vite proxy (works both locally and via tunnel)
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const loginUrl = `${apiBaseUrl}/auth/login/`;
      
      console.log('🔍 Attempting login to:', loginUrl);
      
      // Create AbortController to cancel request if timeout
      const abortController = new AbortController();
      abortTimeout = setTimeout(() => {
        abortController.abort();
      }, TIMEOUT_MS);
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          if (abortTimeout) clearTimeout(abortTimeout);
          reject(new Error('Login request timed out after 5 seconds'));
        }, TIMEOUT_MS)
      );
      
      // Use axios directly for login with shorter timeout and AbortController
      const apiPromise = axios.post(loginUrl, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: TIMEOUT_MS, // 5 seconds - shorter than default 10s
        signal: abortController.signal, // Use AbortController to cancel request
      }).then((response) => {
        if (abortTimeout) clearTimeout(abortTimeout);
        return response;
      });
      
      // Race between API call and timeout
      const response = await Promise.race([apiPromise, timeoutPromise]);
      
      const { access, refresh, user } = response.data;
      
      // Store tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      console.log('✅ Login successful');
      return { access, refresh, user };
    } catch (error) {
      if (abortTimeout) clearTimeout(abortTimeout);
      
      // Log detailed error for debugging
      console.error('❌ Login error:', error);
      console.error('Login error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message.includes('timeout')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running on port 8000.');
      } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        throw new Error('Login request timed out. Please check your connection and try again.');
      } else if (error.response?.status === 401) {
        const errorMsg = error.response?.data?.detail || 
                        error.response?.data?.non_field_errors?.[0] ||
                        'Invalid username or password';
        throw new Error(errorMsg);
      } else {
        throw error;
      }
    }
  },

  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  async getCurrentUser() {
    const TIMEOUT_MS = 5000; // 5 second timeout
    let abortTimeout = null;
    
    try {
      // Use relative URL to work with Vite proxy
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const userUrl = `${apiBaseUrl}/auth/me/`;
      
      console.log('🔍 Fetching current user from:', userUrl);
      
      // Create AbortController
      const abortController = new AbortController();
      abortTimeout = setTimeout(() => {
        abortController.abort();
      }, TIMEOUT_MS);
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          if (abortTimeout) clearTimeout(abortTimeout);
          reject(new Error('Get current user request timed out after 5 seconds'));
        }, TIMEOUT_MS)
      );
      
      // Use axios directly with timeout
      const apiPromise = axios.get(userUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: TIMEOUT_MS,
        signal: abortController.signal,
      }).then((response) => {
        if (abortTimeout) clearTimeout(abortTimeout);
        return response;
      });
      
      const response = await Promise.race([apiPromise, timeoutPromise]);
      console.log('✅ User data fetched successfully');
      return response.data;
    } catch (error) {
      if (abortTimeout) clearTimeout(abortTimeout);
      console.error('❌ Error fetching current user:', error);
      throw error;
    }
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile/', userData);
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.post('/auth/change-password/', passwordData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  getToken() {
    return localStorage.getItem('accessToken');
  }
};

export default authService;








