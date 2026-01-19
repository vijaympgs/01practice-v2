import api from './api';

const procurementService = {
  // ============================================================================
  // Purchase Requests
  // ============================================================================

  // Get all purchase requests
  getPurchaseRequests: async (params = {}) => {
    const response = await api.get('/procurement/purchase-requests/', { params });
    return response.data;
  },

  // Get purchase request by ID
  getPurchaseRequest: async (id) => {
    const response = await api.get(`/procurement/purchase-requests/${id}/`);
    return response.data;
  },

  // Create purchase request
  createPurchaseRequest: async (requestData) => {
    const response = await api.post('/procurement/purchase-requests/', requestData);
    return response.data;
  },

  // Update purchase request
  updatePurchaseRequest: async (id, requestData) => {
    const response = await api.put(`/procurement/purchase-requests/${id}/`, requestData);
    return response.data;
  },

  // Delete purchase request
  deletePurchaseRequest: async (id) => {
    const response = await api.delete(`/procurement/purchase-requests/${id}/`);
    return response.data;
  },

  // Approve purchase request
  approvePurchaseRequest: async (id) => {
    const response = await api.post(`/procurement/purchase-requests/${id}/approve/`);
    return response.data;
  },

  // Reject purchase request
  rejectPurchaseRequest: async (id, reason) => {
    const response = await api.post(`/procurement/purchase-requests/${id}/reject/`, { reason });
    return response.data;
  },

  // ============================================================================
  // Purchase Enquiries
  // ============================================================================

  getPurchaseEnquiries: async (params = {}) => {
    const response = await api.get('/procurement/purchase-enquiries/', { params });
    return response.data;
  },

  getPurchaseEnquiry: async (id) => {
    const response = await api.get(`/procurement/purchase-enquiries/${id}/`);
    return response.data;
  },

  createPurchaseEnquiry: async (enquiryData) => {
    const response = await api.post('/procurement/purchase-enquiries/', enquiryData);
    return response.data;
  },

  updatePurchaseEnquiry: async (id, enquiryData) => {
    const response = await api.put(`/procurement/purchase-enquiries/${id}/`, enquiryData);
    return response.data;
  },

  deletePurchaseEnquiry: async (id) => {
    const response = await api.delete(`/procurement/purchase-enquiries/${id}/`);
    return response.data;
  },

  // ============================================================================
  // Purchase Quotations
  // ============================================================================

  getPurchaseQuotations: async (params = {}) => {
    const response = await api.get('/procurement/purchase-quotations/', { params });
    return response.data;
  },

  getPurchaseQuotation: async (id) => {
    const response = await api.get(`/procurement/purchase-quotations/${id}/`);
    return response.data;
  },

  createPurchaseQuotation: async (quotationData) => {
    const response = await api.post('/procurement/purchase-quotations/', quotationData);
    return response.data;
  },

  updatePurchaseQuotation: async (id, quotationData) => {
    const response = await api.put(`/procurement/purchase-quotations/${id}/`, quotationData);
    return response.data;
  },

  deletePurchaseQuotation: async (id) => {
    const response = await api.delete(`/procurement/purchase-quotations/${id}/`);
    return response.data;
  },

  // ============================================================================
  // Purchase Orders
  // ============================================================================

  getPurchaseOrders: async (params = {}) => {
    const response = await api.get('/procurement/purchase-orders/', { params });
    return response.data;
  },

  getPurchaseOrder: async (id) => {
    const response = await api.get(`/procurement/purchase-orders/${id}/`);
    return response.data;
  },

  createPurchaseOrder: async (orderData) => {
    const response = await api.post('/procurement/purchase-orders/', orderData);
    return response.data;
  },

  updatePurchaseOrder: async (id, orderData) => {
    const response = await api.put(`/procurement/purchase-orders/${id}/`, orderData);
    return response.data;
  },

  deletePurchaseOrder: async (id) => {
    const response = await api.delete(`/procurement/purchase-orders/${id}/`);
    return response.data;
  },

  // Place order (approve and send)
  placePurchaseOrder: async (id) => {
    const response = await api.post(`/procurement/purchase-orders/${id}/place_order/`);
    return response.data;
  },

  // ============================================================================
  // Goods Received Notes (GRNs)
  // ============================================================================

  getGRNs: async (params = {}) => {
    const response = await api.get('/procurement/grns/', { params });
    return response.data;
  },

  // Alias for getGRNs (for consistency)
  getGoodsReceivedNotes: async (params = {}) => {
    const response = await api.get('/procurement/grns/', { params });
    return response.data;
  },

  getGRN: async (id) => {
    const response = await api.get(`/procurement/grns/${id}/`);
    return response.data;
  },

  getGoodsReceivedNote: async (id) => {
    const response = await api.get(`/procurement/grns/${id}/`);
    return response.data;
  },

  createGRN: async (grnData) => {
    const response = await api.post('/procurement/grns/', grnData);
    return response.data;
  },

  createGoodsReceivedNote: async (grnData) => {
    const response = await api.post('/procurement/grns/', grnData);
    return response.data;
  },

  updateGRN: async (id, grnData) => {
    const response = await api.put(`/procurement/grns/${id}/`, grnData);
    return response.data;
  },

  updateGoodsReceivedNote: async (id, grnData) => {
    const response = await api.put(`/procurement/grns/${id}/`, grnData);
    return response.data;
  },

  deleteGRN: async (id) => {
    const response = await api.delete(`/procurement/grns/${id}/`);
    return response.data;
  },

  deleteGoodsReceivedNote: async (id) => {
    const response = await api.delete(`/procurement/grns/${id}/`);
    return response.data;
  },

  // Complete GRN (receive goods)
  completeGRN: async (id) => {
    const response = await api.post(`/procurement/grns/${id}/complete/`);
    return response.data;
  },

  // ============================================================================
  // Purchase Invoices
  // ============================================================================

  getPurchaseInvoices: async (params = {}) => {
    const response = await api.get('/procurement/purchase-invoices/', { params });
    return response.data;
  },

  getPurchaseInvoice: async (id) => {
    const response = await api.get(`/procurement/purchase-invoices/${id}/`);
    return response.data;
  },

  createPurchaseInvoice: async (invoiceData) => {
    const response = await api.post('/procurement/purchase-invoices/', invoiceData);
    return response.data;
  },

  updatePurchaseInvoice: async (id, invoiceData) => {
    const response = await api.put(`/procurement/purchase-invoices/${id}/`, invoiceData);
    return response.data;
  },

  deletePurchaseInvoice: async (id) => {
    const response = await api.delete(`/procurement/purchase-invoices/${id}/`);
    return response.data;
  },

  // Approve invoice for payment
  approvePurchaseInvoice: async (id) => {
    const response = await api.post(`/procurement/purchase-invoices/${id}/approve/`);
    return response.data;
  },

  // Mark invoice as paid
  markInvoicePaid: async (id, paymentData) => {
    const response = await api.post(`/procurement/purchase-invoices/${id}/mark_paid/`, paymentData);
    return response.data;
  },

  // ============================================================================
  // Purchase Returns
  // ============================================================================

  getPurchaseReturns: async (params = {}) => {
    const response = await api.get('/procurement/purchase-returns/', { params });
    return response.data;
  },

  getPurchaseReturn: async (id) => {
    const response = await api.get(`/procurement/purchase-returns/${id}/`);
    return response.data;
  },

  createPurchaseReturn: async (returnData) => {
    const response = await api.post('/procurement/purchase-returns/', returnData);
    return response.data;
  },

  updatePurchaseReturn: async (id, returnData) => {
    const response = await api.put(`/procurement/purchase-returns/${id}/`, returnData);
    return response.data;
  },

  deletePurchaseReturn: async (id) => {
    const response = await api.delete(`/procurement/purchase-returns/${id}/`);
    return response.data;
  },

  // ============================================================================
  // Purchase Request Items (for nested operations)
  // ============================================================================

  getPurchaseRequestItems: async (requestId) => {
    const response = await api.get(`/procurement/purchase-request-items/`, {
      params: { purchase_request: requestId }
    });
    return response.data;
  },

  createPurchaseRequestItem: async (itemData) => {
    const response = await api.post('/procurement/purchase-request-items/', itemData);
    return response.data;
  },

  updatePurchaseRequestItem: async (id, itemData) => {
    const response = await api.put(`/procurement/purchase-request-items/${id}/`, itemData);
    return response.data;
  },

  deletePurchaseRequestItem: async (id) => {
    const response = await api.delete(`/procurement/purchase-request-items/${id}/`);
    return response.data;
  },

  // ============================================================================
  // Purchase Requisitions (New BBP 4.1)
  // ============================================================================

  getPurchaseRequisitions: async (params = {}) => {
    const response = await api.get('/procurement/purchase-requisitions/', { params });
    return response.data;
  },

  getPurchaseRequisition: async (id) => {
    const response = await api.get(`/procurement/purchase-requisitions/${id}/`);
    return response.data;
  },

  createPurchaseRequisition: async (data) => {
    const response = await api.post('/procurement/purchase-requisitions/', data);
    return response.data;
  },

  updatePurchaseRequisition: async (id, data) => {
    const response = await api.put(`/procurement/purchase-requisitions/${id}/`, data);
    return response.data;
  },

  deletePurchaseRequisition: async (id) => {
    const response = await api.delete(`/procurement/purchase-requisitions/${id}/`);
    return response.data;
  },

  submitPurchaseRequisition: async (id) => {
    const response = await api.post(`/procurement/purchase-requisitions/${id}/submit/`);
    return response.data;
  },

  approvePurchaseRequisition: async (id) => {
    const response = await api.post(`/procurement/purchase-requisitions/${id}/approve/`);
    return response.data;
  },

  rejectPurchaseRequisition: async (id, reason) => {
    const response = await api.post(`/procurement/purchase-requisitions/${id}/reject/`, { reason });
    return response.data;
  },

  cancelPurchaseRequisition: async (id) => {
    const response = await api.post(`/procurement/purchase-requisitions/${id}/cancel/`);
    return response.data;
  },
};

export default procurementService;

