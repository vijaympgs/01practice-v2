import api from './api';

class CodeSettingsService {
  // ========== CODE SETTINGS OPERATIONS ==========
  
  async getAllCodeSettings() {
    try {
      const response = await api.get('/code-settings/settings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching code settings:', error);
      throw error;
    }
  }

  async getCodeSettingById(id) {
    try {
      const response = await api.get(`/code-settings/settings/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching code setting:', error);
      throw error;
    }
  }

  async createCodeSetting(data) {
    try {
      const response = await api.post('/code-settings/settings/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating code setting:', error);
      throw error;
    }
  }

  async updateCodeSetting(id, data) {
    try {
      const response = await api.patch(`/code-settings/settings/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating code setting:', error);
      throw error;
    }
  }

  async deleteCodeSetting(id) {
    try {
      const response = await api.delete(`/code-settings/settings/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting code setting:', error);
      throw error;
    }
  }

  async generateCode(id) {
    try {
      const response = await api.post(`/code-settings/settings/${id}/generate_code/`);
      return response.data.next_code;
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }

  async resetCounter(id) {
    try {
      const response = await api.post(`/code-settings/settings/${id}/reset_counter/`);
      return response.data;
    } catch (error) {
      console.error('Error resetting counter:', error);
      throw error;
    }
  }

  async getHistory(id) {
    try {
      const response = await api.get(`/code-settings/settings/${id}/history/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const response = await api.get(`/code-settings/settings/by_category/?category=${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching by category:', error);
      throw error;
    }
  }

  // ========== TEMPLATES OPERATIONS ==========
  
  async getAllTemplates() {
    try {
      const response = await api.get('/code-settings/templates/');
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  async applyTemplate(templateId) {
    try {
      const response = await api.post(`/code-settings/templates/${templateId}/apply_template/`);
      return response.data;
    } catch (error) {
      console.error('Error applying template:', error);
      throw error;
    }
  }

  // ========== RULES OPERATIONS ==========
  
  async getAllRules() {
    try {
      const response = await api.get('/code-settings/rules/');
      return response.data;
    } catch (error) {
      console.error('Error fetching rules:', error);
      throw error;
    }
  }

  // ========== MOCK DATA FOR DEVELOPMENT ==========
  
  getMockCodeSettings() {
    return [
      {
        id: '1',
        category: 'SYSTEM',
        code_type: 'Invoice Number',
        code_prefix: 'INV',
        code_suffix: '',
        starting_number: 1,
        current_number: 0,
        number_format: '000000',
        description: 'Auto-generated invoice numbers',
        is_active: true,
        auto_generate: true,
        reset_frequency: 'YEARLY',
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '2',
        category: 'SYSTEM',
        code_type: 'Receipt Number',
        code_prefix: 'RCP',
        code_suffix: '',
        starting_number: 1,
        current_number: 0,
        number_format: '000000',
        description: 'Auto-generated receipt numbers',
        is_active: true,
        auto_generate: true,
        reset_frequency: 'YEARLY',
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '3',
        category: 'TRANSACTION',
        code_type: 'Sales Order',
        code_prefix: 'SO',
        code_suffix: '',
        starting_number: 1,
        current_number: 0,
        number_format: '000000',
        description: 'Sales order numbers',
        is_active: true,
        auto_generate: true,
        reset_frequency: 'YEARLY',
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '4',
        category: 'CUSTOMER',
        code_type: 'Customer ID',
        code_prefix: 'CUST',
        code_suffix: '',
        starting_number: 1,
        current_number: 0,
        number_format: '000000',
        description: 'Customer identification numbers',
        is_active: true,
        auto_generate: true,
        reset_frequency: 'NEVER',
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '5',
        category: 'PRODUCT',
        code_type: 'Product SKU',
        code_prefix: 'SKU',
        code_suffix: '',
        starting_number: 1,
        current_number: 0,
        number_format: '000000',
        description: 'Product SKU numbers',
        is_active: true,
        auto_generate: true,
        reset_frequency: 'NEVER',
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
    ];
  }

  getMockHistory() {
    return [
      {
        id: '1',
        code_setting: '1',
        code_setting_name: 'Invoice Number',
        field_name: 'current_number',
        old_value: '0',
        new_value: '1',
        changed_by: 'admin',
        changed_by_name: 'Administrator',
        changed_at: '2025-01-26T06:30:00Z',
        reason: 'Generated first invoice'
      },
      {
        id: '2',
        code_setting: '1',
        code_setting_name: 'Invoice Number',
        field_name: 'code_prefix',
        old_value: 'IN',
        new_value: 'INV',
        changed_by: 'manager',
        changed_by_name: 'Store Manager',
        changed_at: '2025-01-25T14:20:00Z',
        reason: 'Updated prefix for better identification'
      },
    ];
  }

  // ========== DEVELOPMENT MODE METHODS ==========
  
  async getAllCodeSettingsDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockCodeSettings());
      }, 500);
    });
  }

  async createCodeSettingDev(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSetting = {
          id: Date.now().toString(),
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        resolve(newSetting);
      }, 300);
    });
  }

  async updateCodeSettingDev(id, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const setting = this.getMockCodeSettings().find(s => s.id === id);
        if (setting) {
          Object.assign(setting, data);
          setting.updated_at = new Date().toISOString();
        }
        resolve(setting);
      }, 300);
    });
  }

  async deleteCodeSettingDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Code setting deleted successfully' });
      }, 300);
    });
  }

  async generateCodeDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const setting = this.getMockCodeSettings().find(s => s.id === id);
        if (setting) {
          setting.current_number += 1;
          const formattedNumber = setting.current_number.toString().padStart(setting.number_format.length, '0');
          const generatedCode = `${setting.code_prefix}${formattedNumber}${setting.code_suffix}`;
          resolve(generatedCode);
        }
        resolve('INV000001');
      }, 300);
    });
  }

  async resetCounterDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const setting = this.getMockCodeSettings().find(s => s.id === id);
        if (setting) {
          setting.current_number = setting.starting_number - 1;
        }
        resolve({ message: 'Counter reset successfully' });
      }, 300);
    });
  }

  async getHistoryDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockHistory());
      }, 300);
    });
  }
}

// Create singleton instance
const codeSettingsService = new CodeSettingsService();

// Use development mode if API is not available
if (process.env.NODE_ENV === 'development') {
  // Override methods with development versions
  codeSettingsService.getAllCodeSettings = codeSettingsService.getAllCodeSettingsDev;
  codeSettingsService.createCodeSetting = codeSettingsService.createCodeSettingDev;
  codeSettingsService.updateCodeSetting = codeSettingsService.updateCodeSettingDev;
  codeSettingsService.deleteCodeSetting = codeSettingsService.deleteCodeSettingDev;
  codeSettingsService.generateCode = codeSettingsService.generateCodeDev;
  codeSettingsService.resetCounter = codeSettingsService.resetCounterDev;
  codeSettingsService.getHistory = codeSettingsService.getHistoryDev;
}

export { codeSettingsService };
