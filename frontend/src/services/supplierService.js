import api from './api';

const supplierService = {
  /**
   * Get all suppliers with optional filtering
   */
  async getSuppliers(params = {}) {
    try {
      const response = await api.get('/suppliers/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch suppliers');
    }
  },

  /**
   * Get a single supplier by ID
   */
  async getSupplier(id) {
    try {
      const response = await api.get(`/suppliers/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch supplier');
    }
  },

  /**
   * Create a new supplier
   */
  async createSupplier(supplierData) {
    try {
      const response = await api.post('/suppliers/', supplierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create supplier');
    }
  },

  /**
   * Update an existing supplier
   */
  async updateSupplier(id, supplierData) {
    try {
      const response = await api.put(`/suppliers/${id}/`, supplierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update supplier');
    }
  },

  /**
   * Partially update an existing supplier
   */
  async patchSupplier(id, supplierData) {
    try {
      const response = await api.patch(`/suppliers/${id}/`, supplierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update supplier');
    }
  },

  /**
   * Delete a supplier
   */
  async deleteSupplier(id) {
    try {
      const response = await api.delete(`/suppliers/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete supplier');
    }
  },

  /**
   * Get supplier statistics
   */
  async getSupplierStats() {
    try {
      const response = await api.get('/suppliers/stats/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch supplier statistics');
    }
  },

  /**
   * Search suppliers
   */
  async searchSuppliers(query, filters = {}) {
    try {
      const params = { q: query, ...filters };
      const response = await api.get('/suppliers/search/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to search suppliers');
    }
  },

  /**
   * Get supplier performance metrics
   */
  async getSupplierPerformance(id) {
    try {
      const response = await api.get(`/suppliers/${id}/performance/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch supplier performance');
    }
  },

  /**
   * Bulk update suppliers
   */
  async bulkUpdateSuppliers(supplierIds, updates) {
    try {
      const response = await api.post('/suppliers/bulk_update/', {
        supplier_ids: supplierIds,
        updates: updates
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to bulk update suppliers');
    }
  },

  /**
   * Get supplier contacts only
   */
  async getSupplierContacts(params = {}) {
    try {
      const response = await api.get('/suppliers/contacts/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch supplier contacts');
    }
  },

  /**
   * Activate a supplier
   */
  async activateSupplier(id) {
    try {
      const response = await api.post(`/suppliers/${id}/activate/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to activate supplier');
    }
  },

  /**
   * Deactivate a supplier
   */
  async deactivateSupplier(id) {
    try {
      const response = await api.post(`/suppliers/${id}/deactivate/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to deactivate supplier');
    }
  },

  /**
   * Toggle preferred status
   */
  async togglePreferredStatus(id) {
    try {
      const response = await api.post(`/suppliers/${id}/toggle_preferred/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to toggle preferred status');
    }
  },

  /**
   * Toggle verified status
   */
  async toggleVerifiedStatus(id) {
    try {
      const response = await api.post(`/suppliers/${id}/toggle_verified/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to toggle verified status');
    }
  },

  /**
   * Get recent suppliers
   */
  async getRecentSuppliers(days = 7) {
    try {
      const response = await api.get('/suppliers/recent/', { params: { days } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch recent suppliers');
    }
  },

  /**
   * Get preferred suppliers only
   */
  async getPreferredSuppliers(params = {}) {
    try {
      const response = await api.get('/suppliers/preferred/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch preferred suppliers');
    }
  },

  /**
   * Get suppliers by type
   */
  async getSuppliersByType(supplierType, params = {}) {
    try {
      const response = await api.get('/suppliers/by_type/', {
        params: { type: supplierType, ...params }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch suppliers by type');
    }
  },

  /**
   * Export suppliers data
   */
  async exportSuppliers(params = {}) {
    try {
      const response = await api.get('/suppliers/export/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to export suppliers');
    }
  },

  /**
   * Get active suppliers only
   */
  async getActiveSuppliers(params = {}) {
    try {
      const response = await api.get('/suppliers/', {
        params: { is_active: true, ...params }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch active suppliers');
    }
  },

  /**
   * Get verified suppliers only
   */
  async getVerifiedSuppliers(params = {}) {
    try {
      const response = await api.get('/suppliers/', {
        params: { is_verified: true, ...params }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch verified suppliers');
    }
  },

  /**
   * Validate supplier data
   */
  validateSupplierData(data) {
    const errors = {};

    // Required fields
    if (!data.company_name || data.company_name.trim().length < 2) {
      errors.company_name = 'Company name must be at least 2 characters long';
    }

    if (!data.phone || data.phone.trim().length < 10) {
      errors.phone = 'Phone number is required and must be at least 10 digits';
    }

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone validation
    if (data.phone && !/^\+?1?\d{9,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Invalid phone number format';
    }

    // Website validation
    if (data.website && !/^https?:\/\/.+/.test(data.website)) {
      errors.website = 'Website must be a valid URL (include http:// or https://)';
    }

    // Credit limit validation
    if (data.credit_limit && data.credit_limit < 0) {
      errors.credit_limit = 'Credit limit cannot be negative';
    }

    // Discount validation
    if (data.discount_percentage && (data.discount_percentage < 0 || data.discount_percentage > 100)) {
      errors.discount_percentage = 'Discount percentage must be between 0 and 100';
    }

    // Minimum order validation
    if (data.minimum_order_amount && data.minimum_order_amount < 0) {
      errors.minimum_order_amount = 'Minimum order amount cannot be negative';
    }

    // Lead time validation
    if (data.lead_time_days && data.lead_time_days < 0) {
      errors.lead_time_days = 'Lead time cannot be negative';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Format supplier data for display
   */
  formatSupplierForDisplay(supplier) {
    return {
      ...supplier,
      display_name: supplier.trade_name && supplier.trade_name !== supplier.company_name
        ? `${supplier.company_name} (${supplier.trade_name})`
        : supplier.company_name,
      display_phone: supplier.phone || supplier.mobile || 'N/A',
      display_address: supplier.full_address || 'No address provided',
      display_credit_limit: supplier.credit_limit 
        ? `$${parseFloat(supplier.credit_limit).toFixed(2)}`
        : 'No credit limit',
      display_discount: supplier.discount_percentage 
        ? `${parseFloat(supplier.discount_percentage).toFixed(1)}%`
        : 'No discount',
      display_lead_time: supplier.lead_time_days 
        ? `${supplier.lead_time_days} days`
        : 'Not specified',
      supplier_type_display: supplier.display_supplier_type || 'Distributor',
      payment_terms_display: supplier.display_payment_terms || 'Net 30 Days'
    };
  },

  /**
   * Get supplier status color
   */
  getSupplierStatusColor(status) {
    const colors = {
      'active': '#4caf50',
      'inactive': '#f44336',
      'new': '#2196f3',
      'preferred': '#ff9800',
      'unverified': '#9e9e9e',
      'inactive_long': '#757575',
      'inactive_recent': '#ff5722'
    };
    return colors[status] || '#757575';
  },

  /**
   * Get supplier type color
   */
  getSupplierTypeColor(type) {
    const colors = {
      'manufacturer': '#4caf50',
      'distributor': '#2196f3',
      'wholesaler': '#9c27b0',
      'retailer': '#ff9800',
      'dropshipper': '#00bcd4',
      'service_provider': '#607d8b'
    };
    return colors[type] || '#757575';
  },

  /**
   * Get payment terms color
   */
  getPaymentTermsColor(terms) {
    const colors = {
      'prepaid': '#4caf50',
      'cod': '#ff9800',
      'net_15': '#2196f3',
      'net_30': '#2196f3',
      'net_45': '#ff5722',
      'net_60': '#f44336',
      'credit_card': '#9c27b0',
      'custom': '#607d8b'
    };
    return colors[terms] || '#757575';
  },

  /**
   * Generate supplier display summary
   */
  generateSupplierSummary(supplier) {
    const summary = [];
    
    summary.push(`Company: ${supplier.company_name}`);
    
    if (supplier.trade_name && supplier.trade_name !== supplier.company_name) {
      summary.push(`Trade Name: ${supplier.trade_name}`);
    }
    
    summary.push(`Type: ${supplier.supplier_type_display || 'Distributor'}`);
    
    if (supplier.contact_person) {
      summary.push(`Contact: ${supplier.contact_person}`);
      if (supplier.contact_title) {
        summary.push(`Title: ${supplier.contact_title}`);
      }
    }
    
    if (supplier.email) {
      summary.push(`Email: ${supplier.email}`);
    }
    
    if (supplier.phone) {
      summary.push(`Phone: ${supplier.phone}`);
    }
    
    if (supplier.website) {
      summary.push(`Website: ${supplier.website}`);
    }
    
    if (supplier.city && supplier.state) {
      summary.push(`Location: ${supplier.city}, ${supplier.state}`);
    }
    
    summary.push(`Payment Terms: ${supplier.payment_terms_display || 'Net 30 Days'}`);
    summary.push(`Lead Time: ${supplier.display_lead_time || 'Not specified'}`);
    
    if (supplier.is_preferred) {
      summary.push('Status: Preferred Supplier');
    }
    
    if (supplier.is_verified) {
      summary.push('Verification: Verified');
    }
    
    if (supplier.credit_limit > 0) {
      summary.push(`Credit Limit: $${supplier.credit_limit}`);
    }
    
    if (supplier.discount_percentage > 0) {
      summary.push(`Discount: ${supplier.discount_percentage}%`);
    }
    
    return summary.join('\n');
  },

  /**
   * Get supplier types list
   */
  getSupplierTypes() {
    return [
      { value: 'manufacturer', label: 'Manufacturer' },
      { value: 'distributor', label: 'Distributor' },
      { value: 'wholesaler', label: 'Wholesaler' },
      { value: 'retailer', label: 'Retailer' },
      { value: 'dropshipper', label: 'Drop Shipper' },
      { value: 'service_provider', label: 'Service Provider' }
    ];
  },

  /**
   * Get payment terms list
   */
  getPaymentTerms() {
    return [
      { value: 'net_15', label: 'Net 15 Days' },
      { value: 'net_30', label: 'Net 30 Days' },
      { value: 'net_45', label: 'Net 45 Days' },
      { value: 'net_60', label: 'Net 60 Days' },
      { value: 'cod', label: 'Cash on Delivery' },
      { value: 'prepaid', label: 'Prepaid' },
      { value: 'credit_card', label: 'Credit Card' },
      { value: 'custom', label: 'Custom Terms' }
    ];
  }
};

export default supplierService;








