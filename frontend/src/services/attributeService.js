import api from './api';

/**
 * Service for managing item attributes via the Django backend API
 */

/**
 * Fetch all attributes from the backend
 * @returns {Promise<Array>} Array of attribute objects
 */
export const fetchAttributes = async () => {
    try {
        const response = await api.get('/categories/attributes/');
        return response.data.results || response.data;
    } catch (error) {
        console.error('Error fetching attributes:', error);
        throw error;
    }
};

/**
 * Create a new attribute
 * @param {Object} attributeData - The attribute data to create
 * @returns {Promise<Object>} The created attribute
 */
export const createAttribute = async (attributeData) => {
    try {
        // Map frontend fields to backend fields
        const backendData = {
            name: attributeData.caption,
            description: attributeData.description || '',
            data_type: attributeData.data_type,
            is_active: attributeData.is_active,
            sort_order: attributeData.display_order || 0,
        };

        const response = await api.post('/categories/attributes/', backendData);
        return response.data;
    } catch (error) {
        console.error('Error creating attribute:', error);
        throw error;
    }
};

/**
 * Update an existing attribute
 * @param {string} id - The attribute ID
 * @param {Object} attributeData - The updated attribute data
 * @returns {Promise<Object>} The updated attribute
 */
export const updateAttribute = async (id, attributeData) => {
    try {
        // Map frontend fields to backend fields
        const backendData = {
            name: attributeData.caption,
            description: attributeData.description || '',
            data_type: attributeData.data_type,
            is_active: attributeData.is_active,
            sort_order: attributeData.display_order || 0,
        };

        const response = await api.put(`/categories/attributes/${id}/`, backendData);
        return response.data;
    } catch (error) {
        console.error('Error updating attribute:', error);
        throw error;
    }
};

/**
 * Delete an attribute
 * @param {string} id - The attribute ID
 * @returns {Promise<void>}
 */
export const deleteAttribute = async (id) => {
    try {
        await api.delete(`/categories/attributes/${id}/`);
    } catch (error) {
        console.error('Error deleting attribute:', error);
        throw error;
    }
};

/**
 * Map backend attribute to frontend format
 * @param {Object} backendAttribute - Attribute from backend
 * @returns {Object} Frontend-formatted attribute
 */
export const mapBackendToFrontend = (backendAttribute) => {
    return {
        id: backendAttribute.id,
        code: generateAttributeCode(backendAttribute.sort_order),
        caption: backendAttribute.name,
        description: backendAttribute.description || '',
        data_type: backendAttribute.data_type,
        is_required: false, // Not stored in backend, default to false
        is_active: backendAttribute.is_active,
        display_order: backendAttribute.sort_order,
        created_at: backendAttribute.created_at,
        updated_at: backendAttribute.updated_at,
    };
};

/**
 * Generate attribute code for display
 * @param {number} sortOrder - The sort order
 * @returns {string} Generated code
 */
const generateAttributeCode = (sortOrder) => {
    return `AC${sortOrder}`;
};
