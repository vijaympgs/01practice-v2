import api from './api';

const productService = {
  /**
   * Get all products with optional filtering
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch products');
    }
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch product');
    }
  },

  /**
   * Create a new product
   */
  async createProduct(productData) {
    try {
      const response = await api.post('/products/', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create product');
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}/`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update product');
    }
  },

  /**
   * Partially update an existing product
   */
  async patchProduct(id, productData) {
    try {
      const response = await api.patch(`/products/${id}/`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update product');
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete product');
    }
  },

  /**
   * Get product statistics
   */
  async getProductStats() {
    try {
      const response = await api.get('/products/stats/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch product statistics');
    }
  },

  /**
   * Search products
   */
  async searchProducts(query, filters = {}) {
    try {
      const params = { q: query, ...filters };
      const response = await api.get('/products/search/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to search products');
    }
  },

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold = 0) {
    try {
      const response = await api.get('/products/low-stock/', { 
        params: { threshold } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch low stock products');
    }
  },

  /**
   * Bulk update stock quantities
   */
  async bulkUpdateStock(updates) {
    try {
      const response = await api.post('/products/bulk-update-stock/', { updates });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to bulk update stock');
    }
  },

  /**
   * Update product stock quantity
   */
  async updateStock(id, stockQuantity) {
    try {
      const response = await api.patch(`/products/${id}/`, { 
        stock_quantity: stockQuantity 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update stock');
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId, params = {}) {
    try {
      const response = await api.get('/products/', { 
        params: { category: categoryId, ...params } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch products by category');
    }
  },

  /**
   * Get products by stock status
   */
  async getProductsByStockStatus(status, params = {}) {
    try {
      const response = await api.get('/products/', { 
        params: { stock_status: status, ...params } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch products by stock status');
    }
  },

  /**
   * Get products by price range
   */
  async getProductsByPriceRange(minPrice, maxPrice, params = {}) {
    try {
      const response = await api.get('/products/', { 
        params: { min_price: minPrice, max_price: maxPrice, ...params } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch products by price range');
    }
  },

  /**
   * Get active products only
   */
  async getActiveProducts(params = {}) {
    try {
      const response = await api.get('/products/', { 
        params: { is_active: true, ...params } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch active products');
    }
  },

  /**
   * Get products that can be sold
   */
  async getSellableProducts(params = {}) {
    try {
      const response = await api.get('/products/', { 
        params: { is_active: true, stock_quantity__gt: 0, ...params } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch sellable products');
    }
  },

  /**
   * Validate product data
   */
  validateProductData(data) {
    const errors = {};

    // Required fields
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Product name must be at least 2 characters long';
    }

    if (!data.sku || data.sku.trim().length < 2) {
      errors.sku = 'SKU must be at least 2 characters long';
    }

    if (!data.price || data.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    // Optional validations
    if (data.cost && data.cost < 0) {
      errors.cost = 'Cost cannot be negative';
    }

    if (data.cost && data.price && data.cost > data.price) {
      errors.cost = 'Cost cannot be greater than price';
    }

    if (data.stock_quantity && data.stock_quantity < 0) {
      errors.stock_quantity = 'Stock quantity cannot be negative';
    }

    if (data.minimum_stock && data.minimum_stock < 0) {
      errors.minimum_stock = 'Minimum stock cannot be negative';
    }

    if (data.maximum_stock && data.maximum_stock < 0) {
      errors.maximum_stock = 'Maximum stock cannot be negative';
    }

    if (data.minimum_stock && data.maximum_stock && data.minimum_stock > data.maximum_stock) {
      errors.minimum_stock = 'Minimum stock cannot be greater than maximum stock';
    }

    if (data.tax_rate && (data.tax_rate < 0 || data.tax_rate > 100)) {
      errors.tax_rate = 'Tax rate must be between 0 and 100';
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Format product data for display
   */
  formatProductForDisplay(product) {
    return {
      ...product,
      display_price: product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'N/A',
      display_cost: product.cost ? `$${parseFloat(product.cost).toFixed(2)}` : 'N/A',
      display_profit_margin: product.profit_margin ? `${parseFloat(product.profit_margin).toFixed(1)}%` : 'N/A',
      display_stock_value: product.stock_value ? `$${parseFloat(product.stock_value).toFixed(2)}` : 'N/A',
      stock_status_display: product.stock_status ? product.stock_status.replace('_', ' ').toUpperCase() : 'UNKNOWN'
    };
  },

  /**
   * Get stock status color
   */
  getStockStatusColor(status) {
    const colors = {
      'out_of_stock': '#f44336',
      'low_stock': '#ff9800',
      'in_stock': '#4caf50',
      'overstocked': '#2196f3'
    };
    return colors[status] || '#757575';
  },

  /**
   * Get profit margin color
   */
  getProfitMarginColor(margin) {
    if (margin < 0) return '#f44336';
    if (margin < 20) return '#ff9800';
    return '#4caf50';
  }
};

export default productService;


















































