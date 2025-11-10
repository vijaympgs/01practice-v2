import api from './api';

const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}/`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Partial update user
  patchUser: async (id, userData) => {
    try {
      const response = await api.patch(`/users/${id}/`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user roles
  getUserRoles: () => {
    return [
      { value: 'admin', label: 'Administrator' },
      { value: 'manager', label: 'Manager' },
      { value: 'cashier', label: 'Cashier' },
    ];
  },

  // Search users
  searchUsers: async (query) => {
    try {
      const response = await api.get('/users/', {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get users by role
  getUsersByRole: async (role) => {
    try {
      const response = await api.get('/users/', {
        params: { role }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Activate/Deactivate user
  toggleUserStatus: async (id, isActive) => {
    try {
      const response = await api.patch(`/users/${id}/`, { is_active: isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change user password
  changePassword: async (id, passwordData) => {
    try {
      const response = await api.post(`/users/${id}/change-password/`, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk operations
  bulkDeleteUsers: async (userIds) => {
    try {
      const response = await api.post('/users/bulk-delete/', { ids: userIds });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bulkUpdateUsers: async (updates) => {
    try {
      const response = await api.post('/users/bulk-update/', { updates });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export users
  exportUsers: async (format = 'csv') => {
    try {
      const response = await api.get('/users/export/', {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Import users
  importUsers: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/users/import/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;



