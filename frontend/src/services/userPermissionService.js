import api from './api';

/**
 * User Permission Service
 * Handles all API calls for user permissions
 */

/**
 * Get all permissions for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Permissions object { menuItemId: { can_view, can_create, can_edit, can_delete } }
 */
export const getUserPermissions = async (userId) => {
  try {
    const response = await api.get(`/auth/users/${userId}/permissions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
};

/**
 * Get current user's permissions
 * @returns {Promise<Object>} Permissions object
 */
export const getMyPermissions = async () => {
  try {
    const response = await api.get('/auth/permissions/my/');
    return response.data;
  } catch (error) {
    console.error('Error fetching my permissions:', error);
    throw error;
  }
};

/**
 * Bulk save user permissions
 * @param {Array} permissionsData - Array of { user_id, permissions: { menuItemId: { can_view, can_create, ... } } }
 * @returns {Promise<Object>} Response with created/updated counts
 */
export const saveBulkPermissions = async (permissionsData) => {
  try {
    const response = await api.post('/auth/permissions/bulk/', permissionsData);
    return response.data;
  } catch (error) {
    console.error('Error saving permissions:', error);
    throw error;
  }
};

/**
 * Apply role template to a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Response with permissions created count
 */
export const applyRoleTemplate = async (userId, roleTemplate) => {
  try {
    const response = await api.post('/auth/permissions/apply-template/', {
      user_id: userId,
      role_template: roleTemplate,  // Pass the selected role template
    });
    return response.data;
  } catch (error) {
    console.error('Error applying role template:', error);
    throw error;
  }
};

/**
 * Get role template details for viewing
 * @param {string} roleTemplate - Role template name (admin, posmanager, etc.)
 * @returns {Promise<Object>} Template details with menu items and permissions
 */
export const getRoleTemplate = async (roleTemplate) => {
  try {
    const response = await api.get(`/auth/permissions/template/${roleTemplate}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role template:', error);
    throw error;
  }
};

/**
 * Format permissions for API
 * Converts frontend format to API format
 * @param {Object} permissions - Frontend permissions format
 * @returns {Array} API format permissions array
 */
export const formatPermissionsForAPI = (permissions) => {
  const formatted = [];
  
  for (const userId in permissions) {
    const userPermissions = permissions[userId];
    const permissionsObj = {};
    
    for (const menuItemId in userPermissions) {
      const perms = userPermissions[menuItemId];
      if (typeof perms === 'object' && perms !== null) {
        permissionsObj[menuItemId] = {
          can_access: perms.can_access || false,
          can_view: perms.can_view || false,
          can_create: perms.can_create || false,
          can_edit: perms.can_edit || false,
          can_delete: perms.can_delete || false,
          override: perms.override || false,
        };
      }
    }
    
    formatted.push({
      user_id: userId,
      permissions: permissionsObj,
    });
  }
  
  return formatted;
};

/**
 * Get all permissions for a specific role
 * @param {string} roleKey - Role key (admin, posmanager, posuser, etc.)
 * @returns {Promise<Object>} Permissions object { menuItemId: { can_view, can_create, can_edit, can_delete } }
 */
export const getRolePermissions = async (roleKey) => {
  try {
    const response = await api.get(`/auth/roles/${roleKey}/permissions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error;
  }
};

/**
 * Bulk save role permissions
 * @param {Array} permissionsData - Array of { role_key, permissions: { menuItemId: { can_view, can_create, ... } } }
 * @returns {Promise<Object>} Response with created/updated counts
 */
export const saveBulkRolePermissions = async (permissionsData) => {
  try {
    const response = await api.post('/auth/roles/permissions/bulk/', {
      permissions: permissionsData,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving role permissions:', error);
    throw error;
  }
};

/**
 * Format role permissions for API
 * Converts frontend format to API format for role permissions
 * @param {Object} permissions - Frontend permissions format { roleKey: { menuItemId: { can_view, ... } } }
 * @returns {Array} API format permissions array
 */
export const formatRolePermissionsForAPI = (permissions) => {
  const formatted = [];
  
  for (const roleKey in permissions) {
    const rolePermissions = permissions[roleKey];
    const permissionsObj = {};
    
    for (const menuItemId in rolePermissions) {
      const perms = rolePermissions[menuItemId];
      if (typeof perms === 'object' && perms !== null) {
        permissionsObj[menuItemId] = {
          can_access: perms.can_access || false,
          can_view: perms.can_view || false,
          can_create: perms.can_create || false,
          can_edit: perms.can_edit || false,
          can_delete: perms.can_delete || false,
        };
      }
    }
    
    formatted.push({
      role_key: roleKey,
      permissions: permissionsObj,
    });
  }
  
  return formatted;
};

/**
 * Apply a role template to a role (initializes role permissions)
 * @param {string} roleKey - Role key (admin, posmanager, etc.)
 * @param {string} templateKey - Optional template key (defaults to roleKey)
 * @returns {Promise<Object>} Response with permissions created/updated counts
 */
export const applyRoleTemplateToRole = async (roleKey, templateKey = null) => {
  try {
    const response = await api.post('/auth/roles/apply-template/', {
      role_key: roleKey,
      template_key: templateKey,
    });
    return response.data;
  } catch (error) {
    console.error('Error applying role template:', error);
    throw error;
  }
};

export default {
  getUserPermissions,
  getMyPermissions,
  saveBulkPermissions,
  applyRoleTemplate,
  getRoleTemplate,
  formatPermissionsForAPI,
  getRolePermissions,
  saveBulkRolePermissions,
  formatRolePermissionsForAPI,
  applyRoleTemplateToRole,
};

