import api from './api';

class POSMasterService {
  // ========== POS MASTERS OPERATIONS ==========
  
  async getAllMasters() {
    try {
      const response = await api.get('/pos-masters/masters/');
      return response.data;
    } catch (error) {
      console.error('Error fetching POS masters:', error);
      throw error;
    }
  }

  async getMasterById(id) {
    try {
      const response = await api.get(`/pos-masters/masters/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching POS master:', error);
      throw error;
    }
  }

  async createMaster(data) {
    try {
      const response = await api.post('/pos-masters/masters/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating POS master:', error);
      throw error;
    }
  }

  async updateMaster(id, data) {
    try {
      const response = await api.patch(`/pos-masters/masters/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating POS master:', error);
      throw error;
    }
  }

  async deleteMaster(id) {
    try {
      const response = await api.delete(`/pos-masters/masters/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting POS master:', error);
      throw error;
    }
  }

  async toggleStatus(id, data) {
    try {
      const response = await api.post(`/pos-masters/masters/${id}/toggle_status/`, data);
      return response.data;
    } catch (error) {
      console.error('Error toggling status:', error);
      throw error;
    }
  }

  async getMasterHistory(id) {
    try {
      const response = await api.get(`/pos-masters/masters/${id}/history/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching master history:', error);
      throw error;
    }
  }

  async getMasterTypes() {
    try {
      const response = await api.get('/pos-masters/masters/master_types/');
      return response.data;
    } catch (error) {
      console.error('Error fetching master types:', error);
      throw error;
    }
  }

  async getMastersByType(type) {
    try {
      const response = await api.get(`/pos-masters/masters/by_type/?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching masters by type:', error);
      throw error;
    }
  }

  async getMasterMappings(id) {
    try {
      const response = await api.get(`/pos-masters/masters/${id}/mappings/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching master mappings:', error);
      throw error;
    }
  }

  async bulkImport(data) {
    try {
      const response = await api.post('/pos-masters/masters/bulk_import/', data);
      return response.data;
    } catch (error) {
      console.error('Error bulk importing masters:', error);
      throw error;
    }
  }

  // ========== SETTINGS OPERATIONS ==========
  
  async getSettings() {
    try {
      const response = await api.get('/pos-masters/settings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  async updateSettings(data) {
    try {
      const response = await api.patch('/pos-masters/settings/', data);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // ========== MAPPINGS OPERATIONS ==========
  
  async getAllMappings() {
    try {
      const response = await api.get('/pos-masters/mappings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching mappings:', error);
      throw error;
    }
  }

  async createMapping(data) {
    try {
      const response = await api.post('/pos-masters/mappings/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating mapping:', error);
      throw error;
    }
  }

  async updateMapping(id, data) {
    try {
      const response = await api.patch(`/pos-masters/mappings/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating mapping:', error);
      throw error;
    }
  }

  async deleteMapping(id) {
    try {
      const response = await api.delete(`/pos-masters/mappings/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting mapping:', error);
      throw error;
    }
  }

  // ========== MOCK DATA FOR DEVELOPMENT ==========
  
  getMockMasters() {
    return [
      // Bank Masters
      {
        id: '1',
        name: 'State Bank of India',
        code: 'SBI',
        master_type: 'bank',
        master_type_display: 'Bank',
        description: 'State Bank of India',
        is_active: true,
        is_system_generated: false,
        requires_authorization: false,
        display_order: 1,
        icon_name: 'account_balance',
        color_code: '#4CAF50',
        allow_edit: true,
        allow_delete: true,
        can_be_deleted_display: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '2',
        name: 'HDFC Bank',
        code: 'HDFC',
        master_type: 'bank',
        master_type_display: 'Bank',
        description: 'HDFC Bank Limited',
        is_active: true,
        is_system_generated: false,
        requires_authorization: false,
        display_order: 2,
        icon_name: 'account_balance',
        color_code: '#2196F3',
        allow_edit: true,
        allow_delete: true,
        can_be_deleted_display: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      
      // Currency Masters
      {
        id: '3',
        name: 'Indian Rupee',
        code: 'INR',
        master_type: 'currency',
        master_type_display: 'Currency',
        description: 'Indian Rupee',
        is_active: true,
        is_system_generated: true,
        requires_authorization: false,
        display_order: 1,
        icon_name: 'currency_rupee',
        color_code: '#4CAF50',
        allow_edit: false,
        allow_delete: false,
        can_be_deleted_display: false,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '4',
        name: 'US Dollar',
        code: 'USD',
        master_type: 'currency',
        master_type_display: 'Currency',
        description: 'US Dollar',
        is_active: true,
        is_system_generated: false,
        requires_authorization: false,
        display_order: 2,
        icon_name: 'attach_money',
        color_code: '#2196F3',
        allow_edit: true,
        allow_delete: true,
        can_be_deleted_display: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      
      // Tax Type Masters
      {
        id: '5',
        name: 'GST',
        code: 'GST',
        master_type: 'tax_type',
        master_type_display: 'Tax Type',
        description: 'Goods and Services Tax',
        is_active: true,
        is_system_generated: true,
        requires_authorization: false,
        display_order: 1,
        icon_name: 'receipt',
        color_code: '#4CAF50',
        allow_edit: false,
        allow_delete: false,
        can_be_deleted_display: false,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '6',
        name: 'CGST',
        code: 'CGST',
        master_type: 'tax_type',
        master_type_display: 'Tax Type',
        description: 'Central Goods and Services Tax',
        is_active: true,
        is_system_generated: true,
        requires_authorization: false,
        display_order: 2,
        icon_name: 'receipt',
        color_code: '#2196F3',
        allow_edit: false,
        allow_delete: false,
        can_be_deleted_display: false,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      
      // Customer Type Masters
      {
        id: '7',
        name: 'Regular Customer',
        code: 'REG',
        master_type: 'customer_type',
        master_type_display: 'Customer Type',
        description: 'Regular walk-in customer',
        is_active: true,
        is_system_generated: true,
        requires_authorization: false,
        display_order: 1,
        icon_name: 'person',
        color_code: '#4CAF50',
        allow_edit: false,
        allow_delete: false,
        can_be_deleted_display: false,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '8',
        name: 'VIP Customer',
        code: 'VIP',
        master_type: 'customer_type',
        master_type_display: 'Customer Type',
        description: 'VIP customer with special privileges',
        is_active: true,
        is_system_generated: false,
        requires_authorization: false,
        display_order: 2,
        icon_name: 'star',
        color_code: '#FF9800',
        allow_edit: true,
        allow_delete: true,
        can_be_deleted_display: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      
      // Unit of Measure Masters
      {
        id: '9',
        name: 'Piece',
        code: 'PCS',
        master_type: 'unit_of_measure',
        master_type_display: 'Unit of Measure',
        description: 'Individual pieces',
        is_active: true,
        is_system_generated: true,
        requires_authorization: false,
        display_order: 1,
        icon_name: 'inventory',
        color_code: '#4CAF50',
        allow_edit: false,
        allow_delete: false,
        can_be_deleted_display: false,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '10',
        name: 'Kilogram',
        code: 'KG',
        master_type: 'unit_of_measure',
        master_type_display: 'Unit of Measure',
        description: 'Weight in kilograms',
        is_active: true,
        is_system_generated: true,
        requires_authorization: false,
        display_order: 2,
        icon_name: 'scale',
        color_code: '#2196F3',
        allow_edit: false,
        allow_delete: false,
        can_be_deleted_display: false,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
    ];
  }

  getMockMasterTypes() {
    return [
      { value: 'bank', label: 'Bank' },
      { value: 'currency', label: 'Currency' },
      { value: 'tax_type', label: 'Tax Type' },
      { value: 'discount_type', label: 'Discount Type' },
      { value: 'customer_type', label: 'Customer Type' },
      { value: 'supplier_type', label: 'Supplier Type' },
      { value: 'product_category', label: 'Product Category' },
      { value: 'unit_of_measure', label: 'Unit of Measure' },
      { value: 'warehouse', label: 'Warehouse' },
      { value: 'counter', label: 'Counter' },
      { value: 'shift', label: 'Shift' },
      { value: 'reason_code', label: 'Reason Code' },
      { value: 'other', label: 'Other' },
    ];
  }

  getMockSettings() {
    return {
      id: '1',
      enable_auto_code_generation: true,
      code_prefix_length: 3,
      allow_duplicate_names: false,
      default_display_order: 0,
      show_inactive_items: false,
      require_description: false,
      validate_code_format: true,
      created_at: '2025-01-26T06:00:00Z',
      updated_at: '2025-01-26T06:00:00Z',
    };
  }

  getMockHistory() {
    return [
      {
        id: '1',
        pos_master: '1',
        pos_master_name: 'State Bank of India',
        field_name: 'is_active',
        old_value: 'false',
        new_value: 'true',
        changed_by: 'admin',
        changed_by_name: 'Administrator',
        changed_at: '2025-01-26T06:30:00Z',
        reason: 'Enabled bank for transactions'
      },
      {
        id: '2',
        pos_master: '1',
        pos_master_name: 'State Bank of India',
        field_name: 'description',
        old_value: 'SBI',
        new_value: 'State Bank of India',
        changed_by: 'manager',
        changed_by_name: 'Store Manager',
        changed_at: '2025-01-25T14:20:00Z',
        reason: 'Updated description for clarity'
      },
    ];
  }

  // ========== DEVELOPMENT MODE METHODS ==========
  
  async getAllMastersDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockMasters());
      }, 500);
    });
  }

  async createMasterDev(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMaster = {
          id: Date.now().toString(),
          ...data,
          master_type_display: this.getMockMasterTypes().find(t => t.value === data.master_type)?.label || data.master_type,
          can_be_deleted_display: !data.is_system_generated,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        resolve(newMaster);
      }, 300);
    });
  }

  async updateMasterDev(id, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const master = this.getMockMasters().find(m => m.id === id);
        if (master) {
          Object.assign(master, data);
          master.updated_at = new Date().toISOString();
        }
        resolve(master);
      }, 300);
    });
  }

  async deleteMasterDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'POS master deleted successfully' });
      }, 300);
    });
  }

  async toggleStatusDev(id, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const master = this.getMockMasters().find(m => m.id === id);
        if (master) {
          master.is_active = !master.is_active;
          master.updated_at = new Date().toISOString();
        }
        resolve(master);
      }, 300);
    });
  }

  async getMasterHistoryDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockHistory());
      }, 300);
    });
  }

  async getMasterTypesDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockMasterTypes());
      }, 200);
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
const posMasterService = new POSMasterService();

// Use development mode if API is not available
if (process.env.NODE_ENV === 'development') {
  // Override methods with development versions
  posMasterService.getAllMasters = posMasterService.getAllMastersDev;
  posMasterService.createMaster = posMasterService.createMasterDev;
  posMasterService.updateMaster = posMasterService.updateMasterDev;
  posMasterService.deleteMaster = posMasterService.deleteMasterDev;
  posMasterService.toggleStatus = posMasterService.toggleStatusDev;
  posMasterService.getMasterHistory = posMasterService.getMasterHistoryDev;
  posMasterService.getMasterTypes = posMasterService.getMasterTypesDev;
  posMasterService.getSettings = posMasterService.getSettingsDev;
  posMasterService.updateSettings = posMasterService.updateSettingsDev;
}

export { posMasterService };
