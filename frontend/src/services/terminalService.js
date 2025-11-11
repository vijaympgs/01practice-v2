import api from './api';

const terminalService = {
  /**
   * Get all terminals with optional filtering
   */
  async getTerminals(params = {}) {
    try {
      const response = await api.get('/pos-masters/terminals/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch terminals');
    }
  },

  /**
   * Get a single terminal by ID
   */
  async getTerminal(id) {
    try {
      const response = await api.get(`/pos-masters/terminals/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch terminal');
    }
  },

  /**
   * Identify terminal by hostname/system_name
   * @param {string} hostname - System hostname/PC name
   * @param {string} locationId - Optional location ID to filter
   * @returns {Promise<Object>} Terminal data or null if not found
   */
  async identifyByHostname(hostname, locationId = null) {
    try {
      const params = { hostname };
      if (locationId) {
        params.location_id = locationId;
      }
      const response = await api.get('/pos-masters/terminals/identify_by_hostname/', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { found: false, created: false };
      }
      throw new Error(error.response?.data?.detail || 'Failed to identify terminal by hostname');
    }
  },

  /**
   * Find or create terminal by hostname
   * @param {string} hostname - System hostname/PC name
   * @param {string} locationId - Location ID to assign if creating
   * @param {boolean} autoCreate - Whether to auto-create if not found
   * @returns {Promise<Object>} Terminal data
   */
  async findOrCreateByHostname(hostname, locationId = null, autoCreate = false) {
    try {
      const payload = {
        hostname,
        auto_create: autoCreate
      };
      if (locationId) {
        payload.location_id = locationId;
      }
      const response = await api.post('/pos-masters/terminals/identify_by_hostname/', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to find or create terminal by hostname');
    }
  },

  /**
   * Get client hostname from backend (attempts to detect from request)
   * @returns {Promise<string>} Hostname
   */
  async getClientHostname() {
    try {
      const response = await api.get('/pos-masters/terminals/get_client_hostname/');
      return response.data.hostname;
    } catch (error) {
      console.warn('Could not get client hostname from backend:', error);
      return null;
    }
  },

  /**
   * Create a new terminal
   */
  async createTerminal(terminalData) {
    try {
      // Convert camelCase to snake_case for backend
      const backendData = this.convertToBackendFormat(terminalData);
      const response = await api.post('/pos-masters/terminals/', backendData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          'Failed to create terminal';
      throw new Error(errorMessage);
    }
  },

  /**
   * Update an existing terminal
   */
  async updateTerminal(id, terminalData) {
    try {
      // Convert camelCase to snake_case for backend
      const backendData = this.convertToBackendFormat(terminalData);
      const response = await api.put(`/pos-masters/terminals/${id}/`, backendData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          'Failed to update terminal';
      throw new Error(errorMessage);
    }
  },

  /**
   * Partially update an existing terminal
   */
  async patchTerminal(id, terminalData) {
    try {
      const backendData = this.convertToBackendFormat(terminalData);
      const response = await api.patch(`/pos-masters/terminals/${id}/`, backendData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          'Failed to update terminal';
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete a terminal
   */
  async deleteTerminal(id) {
    try {
      const response = await api.delete(`/pos-masters/terminals/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete terminal');
    }
  },

  /**
   * Toggle terminal active status
   */
  async toggleTerminalStatus(id) {
    try {
      const response = await api.post(`/pos-masters/terminals/${id}/toggle_status/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to toggle terminal status');
    }
  },

  /**
   * Update terminal status
   */
  async updateTerminalStatus(id, status) {
    try {
      const response = await api.post(`/pos-masters/terminals/${id}/update_status/`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update terminal status');
    }
  },

  /**
   * Sync terminal (update last_sync timestamp)
   */
  async syncTerminal(id) {
    try {
      const response = await api.post(`/pos-masters/terminals/${id}/sync/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to sync terminal');
    }
  },

  /**
   * Get available terminal types
   */
  async getTerminalTypes() {
    try {
      const response = await api.get('/pos-masters/terminals/terminal_types/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch terminal types');
    }
  },

  /**
   * Convert frontend camelCase format to backend snake_case format
   */
  convertToBackendFormat(data) {
    const convert = (obj) => {
      if (obj === null || obj === undefined) return obj;
      if (Array.isArray(obj)) return obj.map(convert);
      if (typeof obj !== 'object') return obj;

      const converted = {};
      for (const [key, value] of Object.entries(obj)) {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        
        // Handle nested objects
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          converted[snakeKey] = convert(value);
        } else {
          converted[snakeKey] = value;
        }
      }
      return converted;
    };

    return convert(data);
  },

  /**
   * Convert backend snake_case format to frontend camelCase format
   */
  convertToFrontendFormat(data) {
    const convert = (obj) => {
      if (obj === null || obj === undefined) return obj;
      if (Array.isArray(obj)) return obj.map(convert);
      if (typeof obj !== 'object') return obj;

      const converted = {};
      for (const [key, value] of Object.entries(obj)) {
        // Convert snake_case to camelCase
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        
        // Handle nested objects
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          converted[camelKey] = convert(value);
        } else {
          converted[camelKey] = value;
        }
      }
      return converted;
    };

    return convert(data);
  },

  /**
   * Format terminal data for display
   */
  formatTerminalForDisplay(terminal) {
    const formatted = { ...terminal };
    
    // Ensure all display fields are present
    if (terminal.last_sync) {
      formatted.lastSyncDisplay = new Date(terminal.last_sync).toLocaleString();
    }
    
    if (terminal.created_at) {
      formatted.createdAtDisplay = new Date(terminal.created_at).toLocaleString();
    }
    
    if (terminal.updated_at) {
      formatted.updatedAtDisplay = new Date(terminal.updated_at).toLocaleString();
    }

    return formatted;
  }
};

export default terminalService;


