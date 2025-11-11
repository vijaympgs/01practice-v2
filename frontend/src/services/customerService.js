import api from './api';

const customerService = {
  /**
   * Get all customers with optional filtering
   */
  async getCustomers(params = {}) {
    try {
      const response = await api.get('/customers/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch customers');
    }
  },

  /**
   * Get a single customer by ID
   */
  async getCustomer(id) {
    try {
      const response = await api.get(`/customers/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch customer');
    }
  },

  /**
   * Create a new customer
   */
  async createCustomer(customerData) {
    try {
      const response = await api.post('/customers/', customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create customer');
    }
  },

  /**
   * Update an existing customer
   */
  async updateCustomer(id, customerData) {
    try {
      const response = await api.put(`/customers/${id}/`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update customer');
    }
  },

  /**
   * Partially update an existing customer
   */
  async patchCustomer(id, customerData) {
    try {
      const response = await api.patch(`/customers/${id}/`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update customer');
    }
  },

  /**
   * Delete a customer
   */
  async deleteCustomer(id) {
    try {
      const response = await api.delete(`/customers/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete customer');
    }
  },

  /**
   * Get customer statistics
   */
  async getCustomerStats() {
    try {
      const response = await api.get('/customers/stats/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch customer statistics');
    }
  },

  /**
   * Search customers
   */
  async searchCustomers(query, filters = {}) {
    try {
      const params = { q: query, ...filters };
      const response = await api.get('/customers/search/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to search customers');
    }
  },

  /**
   * Get customer purchase history
   */
  async getCustomerHistory(id) {
    try {
      const response = await api.get(`/customers/${id}/history/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch customer history');
    }
  },

  /**
   * Bulk update customers
   */
  async bulkUpdateCustomers(customerIds, updates) {
    try {
      const response = await api.post('/customers/bulk_update/', {
        customer_ids: customerIds,
        updates: updates
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to bulk update customers');
    }
  },

  /**
   * Activate a customer
   */
  async activateCustomer(id) {
    try {
      const response = await api.post(`/customers/${id}/activate/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to activate customer');
    }
  },

  /**
   * Deactivate a customer
   */
  async deactivateCustomer(id) {
    try {
      const response = await api.post(`/customers/${id}/deactivate/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to deactivate customer');
    }
  },

  /**
   * Toggle VIP status
   */
  async toggleVipStatus(id) {
    try {
      const response = await api.post(`/customers/${id}/toggle_vip/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to toggle VIP status');
    }
  },

  /**
   * Get recent customers
   */
  async getRecentCustomers(days = 7) {
    try {
      const response = await api.get('/customers/recent/', { params: { days } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch recent customers');
    }
  },

  /**
   * Get customers with birthdays this month
   */
  async getBirthdayCustomers() {
    try {
      const response = await api.get('/customers/birthdays/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch birthday customers');
    }
  },

  /**
   * Export customers data
   */
  async exportCustomers(params = {}) {
    try {
      const response = await api.get('/customers/export/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to export customers');
    }
  },

  /**
   * Get customers by type
   */
  async getCustomersByType(customerType, params = {}) {
    try {
      const response = await api.get('/customers/', {
        params: { customer_type: customerType, ...params }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch customers by type');
    }
  },

  /**
   * Get active customers only
   */
  async getActiveCustomers(params = {}) {
    try {
      const response = await api.get('/customers/', {
        params: { is_active: true, ...params }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch active customers');
    }
  },

  /**
   * Get VIP customers only
   */
  async getVipCustomers(params = {}) {
    try {
      const response = await api.get('/customers/', {
        params: { is_vip: true, ...params }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch VIP customers');
    }
  },

  /**
   * Validate customer data
   */
  validateCustomerData(data) {
    const errors = {};

    // Required fields
    if (!data.first_name || data.first_name.trim().length < 2) {
      errors.first_name = 'First name must be at least 2 characters long';
    }

    if (!data.last_name || data.last_name.trim().length < 2) {
      errors.last_name = 'Last name must be at least 2 characters long';
    }

    if (!data.phone || data.phone.trim().length < 10) {
      errors.phone = 'Phone number is required and must be at least 10 digits';
    }

    // Business customer validation
    if (data.customer_type === 'business' && !data.company_name) {
      errors.company_name = 'Company name is required for business customers';
    }

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone validation
    if (data.phone && !/^\+?1?\d{9,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Invalid phone number format';
    }

    // Credit limit validation
    if (data.credit_limit && data.credit_limit < 0) {
      errors.credit_limit = 'Credit limit cannot be negative';
    }

    // Discount validation
    if (data.discount_percentage && (data.discount_percentage < 0 || data.discount_percentage > 100)) {
      errors.discount_percentage = 'Discount percentage must be between 0 and 100';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Format customer data for display
   */
  formatCustomerForDisplay(customer) {
    return {
      ...customer,
      display_name: customer.company_name 
        ? `${customer.company_name} (${customer.full_name})`
        : customer.full_name,
      display_phone: customer.phone || customer.mobile || 'N/A',
      display_address: customer.full_address || 'No address provided',
      display_credit_limit: customer.credit_limit 
        ? `$${parseFloat(customer.credit_limit).toFixed(2)}`
        : 'No credit',
      display_discount: customer.discount_percentage 
        ? `${parseFloat(customer.discount_percentage).toFixed(1)}%`
        : 'No discount',
      customer_type_display: customer.customer_type 
        ? customer.customer_type.charAt(0).toUpperCase() + customer.customer_type.slice(1)
        : 'Individual'
    };
  },

  /**
   * Get customer status color
   */
  getCustomerStatusColor(status) {
    const colors = {
      'active': '#4caf50',
      'inactive': '#f44336',
      'new': '#2196f3',
      'vip': '#ff9800',
      'inactive_long': '#9e9e9e',
      'inactive_recent': '#ff5722'
    };
    return colors[status] || '#757575';
  },

  /**
   * Get customer type color
   */
  getCustomerTypeColor(type) {
    const colors = {
      'individual': '#4caf50',
      'business': '#2196f3',
      'wholesale': '#9c27b0',
      'vip': '#ff9800'
    };
    return colors[type] || '#757575';
  },

  /**
   * Generate customer display summary
   */
  generateCustomerSummary(customer) {
    const summary = [];
    
    if (customer.company_name) {
      summary.push(`Company: ${customer.company_name}`);
    }
    
    summary.push(`Name: ${customer.full_name}`);
    summary.push(`Type: ${customer.customer_type_display || 'Individual'}`);
    
    if (customer.email) {
      summary.push(`Email: ${customer.email}`);
    }
    
    if (customer.phone) {
      summary.push(`Phone: ${customer.phone}`);
    }
    
    if (customer.city && customer.state) {
      summary.push(`Location: ${customer.city}, ${customer.state}`);
    }
    
    if (customer.is_vip) {
      summary.push('Status: VIP Customer');
    }
    
    if (customer.credit_limit > 0) {
      summary.push(`Credit Limit: $${customer.credit_limit}`);
    }
    
    return summary.join('\n');
  },

  /**
   * Get customer types for form dropdown
   */
  getCustomerTypes() {
    return [
      { 
        value: 'individual', 
        label: 'Individual', 
        icon: '👤'
      },
      { 
        value: 'business', 
        label: 'Business', 
        icon: '🏢'
      },
      { 
        value: 'wholesale', 
        label: 'Wholesale', 
        icon: '📦'
      },
      { 
        value: 'vip', 
        label: 'VIP Customer', 
        icon: '⭐'
      }
    ];
  }
};

export default customerService;


