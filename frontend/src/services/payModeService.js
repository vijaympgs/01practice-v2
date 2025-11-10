import api from './api';

class PayModeService {
  // ========== PAYMENT METHODS OPERATIONS ==========
  
  async getAllPaymentMethods() {
    try {
      const response = await api.get('/pay-modes/modes/');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async getPaymentMethodById(id) {
    try {
      const response = await api.get(`/pay-modes/modes/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment method:', error);
      throw error;
    }
  }

  async createPaymentMethod(data) {
    try {
      const response = await api.post('/pay-modes/modes/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  }

  async updatePaymentMethod(id, data) {
    try {
      const response = await api.patch(`/pay-modes/modes/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  async deletePaymentMethod(id) {
    try {
      const response = await api.delete(`/pay-modes/modes/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  async toggleStatus(id, data) {
    try {
      const response = await api.post(`/pay-modes/modes/${id}/toggle_status/`, data);
      return response.data;
    } catch (error) {
      console.error('Error toggling status:', error);
      throw error;
    }
  }

  async getMethodHistory(id) {
    try {
      const response = await api.get(`/pay-modes/modes/${id}/history/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching method history:', error);
      throw error;
    }
  }

  async getPaymentTypes() {
    try {
      const response = await api.get('/pay-modes/modes/payment_types/');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment types:', error);
      throw error;
    }
  }

  async getAvailableForAmount(amount) {
    try {
      const response = await api.get(`/pay-modes/modes/available_for_amount/?amount=${amount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available methods:', error);
      throw error;
    }
  }

  // ========== SETTINGS OPERATIONS ==========
  
  async getSettings() {
    try {
      const response = await api.get('/pay-modes/settings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  async updateSettings(data) {
    try {
      const response = await api.patch('/pay-modes/settings/', data);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // ========== MOCK DATA FOR DEVELOPMENT ==========
  
  getMockPaymentMethods() {
    return [
      {
        id: '1',
        name: 'Cash',
        code: 'CASH',
        payment_type: 'cash',
        payment_type_display: 'Cash',
        description: 'Cash payment method',
        is_active: true,
        requires_authorization: false,
        min_amount: 0.00,
        max_amount: 999999.99,
        display_order: 1,
        icon_name: 'cash',
        color_code: '#4CAF50',
        allow_refund: true,
        allow_partial_refund: true,
        requires_receipt: false,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '2',
        name: 'Credit Card',
        code: 'CREDIT_CARD',
        payment_type: 'card',
        payment_type_display: 'Card',
        description: 'Credit card payment',
        is_active: true,
        requires_authorization: false,
        min_amount: 1.00,
        max_amount: 50000.00,
        display_order: 2,
        icon_name: 'credit_card',
        color_code: '#2196F3',
        allow_refund: true,
        allow_partial_refund: true,
        requires_receipt: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '3',
        name: 'UPI',
        code: 'UPI',
        payment_type: 'upi',
        payment_type_display: 'UPI',
        description: 'Unified Payments Interface',
        is_active: true,
        requires_authorization: false,
        min_amount: 1.00,
        max_amount: 100000.00,
        display_order: 3,
        icon_name: 'upi',
        color_code: '#9C27B0',
        allow_refund: true,
        allow_partial_refund: true,
        requires_receipt: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '4',
        name: 'Net Banking',
        code: 'NET_BANKING',
        payment_type: 'netbanking',
        payment_type_display: 'Net Banking',
        description: 'Internet banking payment',
        is_active: true,
        requires_authorization: false,
        min_amount: 1.00,
        max_amount: 200000.00,
        display_order: 4,
        icon_name: 'account_balance',
        color_code: '#607D8B',
        allow_refund: true,
        allow_partial_refund: true,
        requires_receipt: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '5',
        name: 'Digital Wallet',
        code: 'WALLET',
        payment_type: 'wallet',
        payment_type_display: 'Digital Wallet',
        description: 'Digital wallet payment (Paytm, PhonePe, etc.)',
        is_active: true,
        requires_authorization: false,
        min_amount: 1.00,
        max_amount: 25000.00,
        display_order: 5,
        icon_name: 'account_balance_wallet',
        color_code: '#E91E63',
        allow_refund: true,
        allow_partial_refund: true,
        requires_receipt: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '6',
        name: 'Cheque',
        code: 'CHEQUE',
        payment_type: 'cheque',
        payment_type_display: 'Cheque',
        description: 'Cheque payment',
        is_active: true,
        requires_authorization: true,
        min_amount: 1.00,
        max_amount: 1000000.00,
        display_order: 6,
        icon_name: 'description',
        color_code: '#795548',
        allow_refund: false,
        allow_partial_refund: false,
        requires_receipt: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
    ];
  }

  getMockSettings() {
    return {
      id: '1',
      default_cash_paymode: '1',
      default_cash_paymode_name: 'Cash',
      require_payment_confirmation: false,
      allow_multiple_payments: true,
      enable_cash_drawer: true,
      auto_open_cash_drawer: false,
      enable_card_payments: true,
      require_card_pin: false,
      enable_upi_payments: true,
      enable_qr_code: true,
      allow_refunds: true,
      require_refund_authorization: true,
      max_refund_percentage: 100.00,
      created_at: '2025-01-26T06:00:00Z',
      updated_at: '2025-01-26T06:00:00Z',
    };
  }

  getMockHistory() {
    return [
      {
        id: '1',
        paymode: '1',
        paymode_name: 'Cash',
        field_name: 'is_active',
        old_value: 'false',
        new_value: 'true',
        changed_by: 'admin',
        changed_by_name: 'Administrator',
        changed_at: '2025-01-26T06:30:00Z',
        reason: 'Enabled cash payments'
      },
      {
        id: '2',
        paymode: '1',
        paymode_name: 'Cash',
        field_name: 'max_amount',
        old_value: '50000.00',
        new_value: '999999.99',
        changed_by: 'manager',
        changed_by_name: 'Store Manager',
        changed_at: '2025-01-25T14:20:00Z',
        reason: 'Increased maximum amount limit'
      },
    ];
  }

  // ========== DEVELOPMENT MODE METHODS ==========
  
  async getAllPaymentMethodsDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockPaymentMethods());
      }, 500);
    });
  }

  async createPaymentMethodDev(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMethod = {
          id: Date.now().toString(),
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        resolve(newMethod);
      }, 300);
    });
  }

  async updatePaymentMethodDev(id, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const method = this.getMockPaymentMethods().find(m => m.id === id);
        if (method) {
          Object.assign(method, data);
          method.updated_at = new Date().toISOString();
        }
        resolve(method);
      }, 300);
    });
  }

  async deletePaymentMethodDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Payment method deleted successfully' });
      }, 300);
    });
  }

  async toggleStatusDev(id, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const method = this.getMockPaymentMethods().find(m => m.id === id);
        if (method) {
          method.is_active = !method.is_active;
          method.updated_at = new Date().toISOString();
        }
        resolve(method);
      }, 300);
    });
  }

  async getMethodHistoryDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockHistory());
      }, 300);
    });
  }

  async getSettingsDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockSettings());
      }, 300);
    });
  }

  async updateSettingsDev(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const settings = { ...this.getMockSettings(), ...data };
        settings.updated_at = new Date().toISOString();
        resolve(settings);
      }, 300);
    });
  }
}

// Create singleton instance
const payModeService = new PayModeService();

// Use development mode if API is not available
if (process.env.NODE_ENV === 'development') {
  // Override methods with development versions
  payModeService.getAllPaymentMethods = payModeService.getAllPaymentMethodsDev;
  payModeService.createPaymentMethod = payModeService.createPaymentMethodDev;
  payModeService.updatePaymentMethod = payModeService.updatePaymentMethodDev;
  payModeService.deletePaymentMethod = payModeService.deletePaymentMethodDev;
  payModeService.toggleStatus = payModeService.toggleStatusDev;
  payModeService.getMethodHistory = payModeService.getMethodHistoryDev;
  payModeService.getSettings = payModeService.getSettingsDev;
  payModeService.updateSettings = payModeService.updateSettingsDev;
}

export { payModeService };
