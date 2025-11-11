import api from './api';

const inventoryService = {
  // Inventory Management
  getInventoryList: (params = {}) => {
    return api.get('/inventory/inventory/', { params });
  },

  getInventoryItem: (id) => {
    return api.get(`/inventory/inventory/${id}/`);
  },

  updateInventoryItem: (id, data) => {
    return api.put(`/inventory/inventory/${id}/`, data);
  },

  createInventoryItem: (data) => {
    return api.post('/inventory/inventory/', data);
  },

  // Stock Adjustments
  adjustStock: (id, adjustmentData) => {
    return api.post(`/inventory/inventory/${id}/adjust_stock/`, adjustmentData);
  },

  reserveStock: (id, quantity) => {
    return api.post(`/inventory/inventory/${id}/reserve_stock/`, { quantity });
  },

  releaseStock: (id, quantity) => {
    return api.post(`/inventory/inventory/${id}/release_stock/`, { quantity });
  },

  // Inventory Filters
  getLowStockItems: () => {
    return api.get('/inventory/inventory/low_stock/');
  },

  getInventoryStats: () => {
    return api.get('/inventory/inventory/statistics/');
  },

  // Stock Movements
  getStockMovements: (params = {}) => {
    return api.get('/inventory/movements/', { params });
  },

  createStockMovement: (data) => {
    return api.post('/inventory/movements/', data);
  },

  updateStockMovement: (id, data) => {
    return api.put(`/inventory/movements/${id}/`, data);
  },

  deleteStockMovement: (id) => {
    return api.delete(`/inventory/movements/${id}/`);
  },

  patchStockMovementStatus: (id, data) => {
    return api.patch(`/inventory/movements/${id}/`, data);
  },

  createStockMovement: (data) => {
    return api.post('/inventory/movements/', data);
  },

  updateStockMovement: (id, data) => {
    return api.put(`/inventory/movements/${id}/`, data);
  },

  // Purchase Orders
  getPurchaseOrders: (params = {}) => {
    return api.get('/inventory/purchase-orders/', { params });
  },

  getPurchaseOrder: (id) => {
    return api.get(`/inventory/purchase-orders/${id}/`);
  },

  createPurchaseOrder: (orderData) => {
    return api.post('/inventory/purchase-orders/', orderData);
  },

  updatePurchaseOrder: (id, data) => {
    return api.put(`/inventory/purchase-orders/${id}/`, data);
  },

  approvePurchaseOrder: (id) => {
    return api.post(`/inventory/purchase-orders/${id}/approve/`);
  },

  receivePurchaseOrder: (id, itemsData) => {
    return api.post(`/inventory/purchase-orders/${id}/receive/`, { items: itemsData });
  },

  // Stock Alerts
  getStockAlerts: (params = {}) => {
    return api.get('/inventory/alerts/', { params });
  },

  getActiveAlerts: () => {
    return api.get('/inventory/alerts/', { params: { active_only: 'true' } });
  },

  resolveAlert: (id, notes = '') => {
    return api.post(`/inventory/alerts/${id}/resolve/`, { notes });
  },

  // Bulk Operations
  bulkAdjustStock: (adjustments) => {
    return api.post('/inventory/inventory/bulk_adjust/', adjustments);
  },

  // Reports
  getInventoryValuation: (date = null) => {
    return api.get('/inventory/reports/valuation/', { params: { date } });
  },

  getStockMovementReport: (params = {}) => {
    return api.get('/inventory/reports/movements/', { params });
  },

  getLowStockReport: () => {
    return api.get('/inventory/inventory/low_stock/');
  },
};

export default inventoryService;


