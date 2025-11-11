import axios from 'axios';

// Use relative URL to work with Vite proxy (works both locally and via tunnel)
// If VITE_API_BASE_URL is set, use it; otherwise use relative URL for proxy
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for API requests
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Only warn for authenticated endpoints, not for public ones
      const publicEndpoints = ['/auth/login/', '/auth/register/', '/theme/active-theme/'];
      const isPublicEndpoint = publicEndpoints.some(endpoint => config.url.includes(endpoint));
      
      if (!isPublicEndpoint) {
        console.warn('No access token found in localStorage for request to:', config.url);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - token expired or invalid
    // Only retry once to prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest._skipRetry) {
      originalRequest._retry = true;
      
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Use axios directly for refresh to avoid interceptor loop
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const { access } = response.data;
          if (access) {
            localStorage.setItem('accessToken', access);
            
            // Retry original request with new token (only once)
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return api(originalRequest);
          } else {
            throw new Error('No access token in refresh response');
          }
        } catch (refreshError) {
          // Refresh failed - clear tokens and stop retrying
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Mark request to skip further retries
          originalRequest._skipRetry = true;
          // Return error for component to handle
          return Promise.reject(error);
        }
      } else {
        // No refresh token - token expired and no way to refresh
        console.warn('401 error: No refresh token available');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Mark request to skip further retries
        originalRequest._skipRetry = true;
        return Promise.reject(error);
      }
    }
    
    // If already retried or skipped, don't retry again
    if (error.response?.status === 401 && (originalRequest._retry || originalRequest._skipRetry)) {
      // Prevent infinite loops - reject immediately
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default api;
