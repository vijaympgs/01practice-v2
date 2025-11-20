import api from './api';

const itemMasterService = {
  /**
   * Fetch Item Master entries
   * @param {Object} params - optional query params
   */
  async getItems(params = {}) {
    try {
      const response = await api.get('/products/item-master/', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to load Item Master data:', error);
      throw new Error(error.response?.data?.detail || 'Failed to load Item Master data');
    }
  },

  /**
   * Create a new Item Master entry
   * @param {Object} data - item payload
   */
  async createItem(data) {
    try {
      const response = await api.post('/products/item-master/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create Item Master entry:', error);
      const message =
        error.response?.data?.detail ||
        Object.values(error.response?.data || {})?.[0]?.[0] ||
        'Failed to create quick item';
      throw new Error(message);
    }
  },
};

export default itemMasterService;

