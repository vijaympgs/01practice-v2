import api from './api';

const posFunctionService = {
  /**
   * Get all POS functions
   */
  async getFunctions(params = {}) {
    const response = await api.get('/auth/pos-functions/', { params });
    return response.data;
  },

  /**
   * Get POS function by ID
   */
  async getFunction(id) {
    const response = await api.get(`/auth/pos-functions/${id}/`);
    return response.data;
  },

  /**
   * Get role-function mappings
   */
  async getRoleMappings(role = null) {
    const params = role ? { role } : {};
    const response = await api.get('/auth/role-pos-function-mappings/', { params });
    return response.data;
  },

  /**
   * Create or update role-function mapping
   */
  async saveRoleMapping(mappingData) {
    if (mappingData.id) {
      // Update existing mapping
      const response = await api.put(`/auth/role-pos-function-mappings/${mappingData.id}/`, mappingData);
      return response.data;
    } else {
      // Create new mapping
      const response = await api.post('/auth/role-pos-function-mappings/', mappingData);
      return response.data;
    }
  },

  /**
   * Delete role-function mapping
   */
  async deleteRoleMapping(id) {
    await api.delete(`/auth/role-pos-function-mappings/${id}/`);
  },

  /**
   * Bulk update role mappings
   */
  async bulkUpdateRoleMappings(role, mappings) {
    // Delete existing mappings for this role
    const existingMappings = await this.getRoleMappings(role);
    for (const mapping of existingMappings.results || existingMappings) {
      await this.deleteRoleMapping(mapping.id);
    }

    // Create new mappings
    const promises = mappings
      .filter(m => m.is_allowed)
      .map(mapping => this.saveRoleMapping({
        role,
        function: mapping.function_id || mapping.function,
        is_allowed: true,
        requires_approval: mapping.requires_approval || false
      }));

    await Promise.all(promises);
  },

  /**
   * Get current user's POS permissions
   */
  async getUserPermissions() {
    const response = await api.get('/auth/pos-permissions/');
    return response.data;
  }
};

export default posFunctionService;

