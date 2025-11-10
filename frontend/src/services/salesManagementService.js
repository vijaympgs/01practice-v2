import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.17:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const requestInterceptor = api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const salesManagementService = {
  // Sales Transactions
  getSales: (params = {}) => {
    return api.get('/sales/', { params });
  },

  getSale: (id) => {
    return api.get(`/sales/${id}/`);
  },

  createSale: (saleData) => {
    return api.post('/sales/', saleData);
  },

  updateSale: (id, data) => {
    return api.put(`/sales/${id}/`, data);
  },

  // Sale Items
  getSaleItems: (saleId) => {
    return api.get(`/sales/${saleId}/items/`);
  },

  // POS Sessions
  getPOSSessions: (params = {}) => {
    return api.get('/pos-sessions/', { params });
  },

  getPOSSession: (id) => {
    return api.get(`/pos-sessions/${id}/`);
  },

  createPOSSession: (sessionData) => {
    return api.post('/pos-sessions/', sessionData);
  },

  endPOSSession: (id) => {
    return api.post(`/pos-sessions/${id}/end/`);
  },

  getCurrentSession: () => {
    return api.get('/pos-sessions/current/');
  },

  // Payments
  getPayments: (params = {}) => {
    return api.get('/payments/', { params });
  },

  processPayment: (paymentData) => {
    return api.post('/payments/', paymentData);
  },

  getPayment: (id) => {
    return api.get(`/payments/${id}/`);
  },

  refundPayment: (id, refundData) => {
    return api.post(`/payments/${id}/refund/`, refundData);
  },

  // Reports & Analytics
  getSalesSummary: (dateRange = {}) => {
    return api.get('/reports/sales/summary/', { params: dateRange });
  },

  getSalesTrends: (params = {}) => {
    return api.get('/reports/sales/trends/', { params });
  },

  getProductSales: (params = {}) => {
    return api.get('/reports/sales/products/', { params });
  },

  getCustomerSales: (params = {}) => {
    return api.get('/reports/sales/customers/', { params });
  },

  // Filtering & Search
  searchSales: (query, filters = {}) => {
    return api.get('/sales/search/', {
      params: { q: query, ...filters }
    });
  },

  getSalesByDateRange: (startDate, endDate) => {
    return api.get('/sales/', {
      params: {
        start_date: startDate,
        end_date: endDate,
      }
    });
  },

  getSalesByCustomer: (customerId) => {
    return api.get('/sales/', {
      params: { customer: customerId }
    });
  },

  getSalesByProduct: (productId) => {
    return api.get('/sales/', {
      params: { product: productId }
    });
  },

  // Bulk Operations
  exportSales: (filters = {}) => {
    return api.get('/sales/export/', { params: filters });
  },

  // Dashboard Data
  getSalesDashboardData: () => {
    return api.get('/dashboard/sales/');
  },

  getTodaySales: () => {
    return api.get('/sales/today/');
  },

  getTopSellingProducts: (limit = 10) => {
    return api.get('/reports/products/top-selling/', {
      params: { limit }
    });
  },
};

export default salesManagementService;
