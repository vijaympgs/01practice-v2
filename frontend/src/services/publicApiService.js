/**
 * Public API Service - For endpoints that don't require authentication
 * This service bypasses the auth interceptor for public endpoints
 */

import axios from 'axios';

// Use relative URL to work with Vite proxy (works both locally and via tunnel)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Create a dedicated axios instance for public endpoints
 * This instance does NOT add Authorization headers
 */
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Get all active companies (public endpoint for login form)
 * @returns {Promise<Array>} Array of company objects
 */
export const getPublicCompanies = async () => {
  try {
    const response = await publicApi.get('/organization/companies/public/');
    
    // Handle different response formats
    if (response.status === 200) {
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        return response.data.results;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn('Unexpected response format:', response.data);
        return [];
      }
    }
    
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    // Re-throw with more context
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to load companies';
    
    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.code = error.code;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
};

export default publicApi;

