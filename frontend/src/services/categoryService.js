import api from './api';

const categoryService = {
  // Get all categories
  getCategories: async (params = {}) => {
    const response = await api.get('/categories/', { params });
    return response.data;
  },

  // Get category by ID
  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories/', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}/`, categoryData);
    return response.data;
  },

  // Partially update category
  patchCategory: async (id, categoryData) => {
    const response = await api.patch(`/categories/${id}/`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}/`);
    return response.data;
  },

  // Get category tree
  getCategoryTree: async () => {
    const response = await api.get('/categories/tree/');
    return response.data;
  },

  // Search categories
  searchCategories: async (query, filters = {}) => {
    const params = { q: query, ...filters };
    const response = await api.get('/categories/search/', { params });
    return response.data;
  },

  // Bulk update categories
  bulkUpdateCategories: async (action, categoryIds, additionalData = {}) => {
    const response = await api.post('/categories/bulk-update/', {
      action,
      category_ids: categoryIds,
      ...additionalData
    });
    return response.data;
  },

  // Get category statistics
  getCategoryStats: async () => {
    const response = await api.get('/categories/stats/');
    return response.data;
  },

  // Get root categories only
  getRootCategories: async () => {
    const response = await api.get('/categories/', { 
      params: { root_only: true } 
    });
    return response.data;
  },

  // Get categories by parent
  getCategoriesByParent: async (parentId) => {
    const response = await api.get('/categories/', { 
      params: { parent_id: parentId } 
    });
    return response.data;
  },

  // Get active categories only
  getActiveCategories: async () => {
    const response = await api.get('/categories/', { 
      params: { is_active: true } 
    });
    return response.data;
  }
};

export default categoryService;





















































