import api from './api';

const organizationService = {
    /**
     * Get all locations
     */
    async getLocations(params = {}) {
        try {
            const response = await api.get('/organization/locations/', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch locations');
        }
    },

    /**
     * Get a single location by ID
     */
    async getLocation(id) {
        try {
            const response = await api.get(`/organization/locations/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch location');
        }
    },

    /**
     * Get all companies
     */
    async getCompanies(params = {}) {
        try {
            const response = await api.get('/organization/companies/', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch companies');
        }
    }
};

export default organizationService;
