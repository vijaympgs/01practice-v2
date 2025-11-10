import api from './api';

const salesService = {
  // Sales
  async getAll(params = {}) {
    const response = await api.get('/sales/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/sales/${id}/`);
    return response.data;
  },

  async create(saleData) {
    const response = await api.post('/sales/', saleData);
    return response.data;
  },

  async update(id, saleData) {
    const response = await api.put(`/sales/${id}/`, saleData);
    return response.data;
  },

  async complete(id) {
    const response = await api.post(`/sales/${id}/complete/`);
    return response.data;
  },

  async cancel(id, reasonCode) {
    const response = await api.post(`/sales/${id}/cancel/`, { reason_code: reasonCode });
    return response.data;
  },

  async getSuspended() {
    const response = await api.get('/sales/suspended/');
    return response.data;
  },

  async resume(id) {
    const response = await api.post(`/sales/${id}/resume/`);
    return response.data;
  },

  async getTodaySummary() {
    const response = await api.get('/sales/today_summary/');
    return response.data;
  },

  // POS Sessions
  async openSession(openingCash) {
    const response = await api.post('/pos-sessions/', {
      opening_cash: openingCash,
    });
    return response.data;
  },

  async getCurrentSession() {
    const response = await api.get('/pos-sessions/current/');
    return response.data;
  },

  async closeSession(sessionId, closingCash, notes = '') {
    const response = await api.post(`/pos-sessions/${sessionId}/close/`, {
      closing_cash: closingCash,
      notes,
    });
    return response.data;
  },

  async getSessionSummary(sessionId) {
    const response = await api.get(`/pos-sessions/${sessionId}/summary/`);
    return response.data;
  },

  // Payments
  async createPayment(paymentData) {
    const response = await api.post('/payments/', paymentData);
    return response.data;
  },

  async getPayments(saleId) {
    const response = await api.get('/payments/', { params: { sale: saleId } });
    return response.data;
  },
};

export default salesService;





