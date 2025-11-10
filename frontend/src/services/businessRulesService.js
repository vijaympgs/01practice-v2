import api from './api';

class BusinessRulesService {
  // ========== BUSINESS RULES OPERATIONS ==========
  
  async getAllRules() {
    try {
      const response = await api.get('/business-rules/rules/');
      return response.data;
    } catch (error) {
      console.error('Error fetching business rules:', error);
      throw error;
    }
  }

  async getRuleById(id) {
    try {
      const response = await api.get(`/business-rules/rules/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business rule:', error);
      throw error;
    }
  }

  async updateRule(id, data) {
    try {
      const response = await api.patch(`/business-rules/rules/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating business rule:', error);
      throw error;
    }
  }

  async resetToDefault(id) {
    try {
      const response = await api.post(`/business-rules/rules/${id}/reset_to_default/`);
      return response.data;
    } catch (error) {
      console.error('Error resetting business rule:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await api.get('/business-rules/rules/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getRuleHistory(id) {
    try {
      const response = await api.get(`/business-rules/rules/${id}/history/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rule history:', error);
      throw error;
    }
  }

  // ========== SETTLEMENT SETTINGS ==========
  async getSettlementSettings() {
    try {
      const response = await api.get('/business-rules/settlement-settings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching settlement settings:', error);
      throw error;
    }
  }

  async updateSettlementSettings(data) {
    try {
      const response = await api.patch('/business-rules/settlement-settings/1/', data);
      return response.data;
    } catch (error) {
      console.error('Error updating settlement settings:', error);
      throw error;
    }
  }

  // ========== MOCK DATA FOR DEVELOPMENT ==========
  
  getMockRules() {
    return [
      // Stock Management
      {
        id: '1',
        name: 'Stock Check Required During Billing',
        code: 'STOCK_CHECK_REQUIRED',
        description: 'Mandatory stock availability checks during billing',
        category: 'stock_management',
        rule_type: 'boolean',
        default_value: 'true',
        current_value: 'true',
        help_text: 'Enable mandatory stock availability checks during billing process',
        is_active: true,
        is_required: true,
        validation_rules: {},
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '2',
        name: 'Batch Selection Through MRP',
        code: 'BATCH_SELECTION_MRP',
        description: 'Display products based on MRP for batch selection',
        category: 'stock_management',
        rule_type: 'boolean',
        default_value: 'false',
        current_value: 'false',
        help_text: 'Enable MRP-based batch selection for products',
        is_active: true,
        is_required: false,
        validation_rules: {},
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      
      // Pricing & Quantity
      {
        id: '3',
        name: 'Price Change Allowed',
        code: 'PRICE_CHANGE_ALLOWED',
        description: 'Allow cashier to change item price during billing',
        category: 'pricing_quantity',
        rule_type: 'boolean',
        default_value: 'true',
        current_value: 'true',
        help_text: 'Enable price modification during billing process',
        is_active: true,
        is_required: true,
        validation_rules: {},
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '4',
        name: 'Allow Quantity Change',
        code: 'QUANTITY_CHANGE_ALLOWED',
        description: 'Allow manual quantity entry instead of scanning multiple times',
        category: 'pricing_quantity',
        rule_type: 'boolean',
        default_value: 'true',
        current_value: 'true',
        help_text: 'Enable manual quantity input during billing',
        is_active: true,
        is_required: true,
        validation_rules: {},
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '5',
        name: 'Maximum Bill Discount %',
        code: 'MAX_BILL_DISCOUNT_PERCENT',
        description: 'Set maximum discount percentage allowed on bills',
        category: 'discounts_loyalty',
        rule_type: 'decimal',
        default_value: '10.0',
        current_value: '10.0',
        help_text: 'Maximum discount percentage allowed per bill',
        is_active: true,
        is_required: true,
        validation_rules: { min: 0, max: 100, step: 0.1 },
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '6',
        name: 'Round Off Level',
        code: 'ROUND_OFF_LEVEL',
        description: 'Decimal places (0-4) for rounding',
        category: 'rounding_amounts',
        rule_type: 'integer',
        default_value: '2',
        current_value: '2',
        help_text: 'Number of decimal places for rounding (0-4)',
        is_active: true,
        is_required: true,
        validation_rules: { min: 0, max: 4 },
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '7',
        name: 'Round Off Type',
        code: 'ROUND_OFF_TYPE',
        description: 'Select rounding method',
        category: 'rounding_amounts',
        rule_type: 'choice',
        default_value: 'normal',
        current_value: 'normal',
        help_text: 'Choose rounding method: Normal, Round Up, or Round Down',
        is_active: true,
        is_required: true,
        validation_rules: {
          choices: [
            { value: 'normal', label: 'Normal' },
            { value: 'round_up', label: 'Round Up' },
            { value: 'round_down', label: 'Round Down' }
          ]
        },
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
    ];
  }

  getMockCategories() {
    return [
      { value: 'stock_management', label: 'Stock Management' },
      { value: 'pricing_quantity', label: 'Pricing & Quantity' },
      { value: 'discounts_loyalty', label: 'Discounts & Loyalty' },
      { value: 'rounding_amounts', label: 'Rounding & Amounts' },
      { value: 'customer_sales', label: 'Customer & Sales Management' },
      { value: 'billing_documents', label: 'Billing & Documents' },
      { value: 'advanced_settings', label: 'Advanced Settings' },
    ];
  }

  getMockHistory() {
    return [
      {
        id: '1',
        business_rule: '1',
        old_value: 'false',
        new_value: 'true',
        changed_by: 'admin',
        changed_by_name: 'Administrator',
        changed_at: '2025-01-26T06:30:00Z',
        reason: 'Enabled stock checking for better inventory control'
      },
      {
        id: '2',
        business_rule: '1',
        old_value: 'true',
        new_value: 'false',
        changed_by: 'manager',
        changed_by_name: 'Store Manager',
        changed_at: '2025-01-25T14:20:00Z',
        reason: 'Temporarily disabled for testing'
      },
    ];
  }

  // ========== DEVELOPMENT MODE METHODS ==========
  
  async getAllRulesDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockRules());
      }, 500);
    });
  }

  async updateRuleDev(id, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rule = this.getMockRules().find(r => r.id === id);
        if (rule) {
          rule.current_value = data.current_value;
          rule.updated_at = new Date().toISOString();
        }
        resolve(rule);
      }, 300);
    });
  }

  async resetToDefaultDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rule = this.getMockRules().find(r => r.id === id);
        if (rule) {
          rule.current_value = rule.default_value;
          rule.updated_at = new Date().toISOString();
        }
        resolve(rule);
      }, 300);
    });
  }

  async getCategoriesDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockCategories());
      }, 200);
    });
  }

  async getRuleHistoryDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockHistory());
      }, 300);
    });
  }
}

// Create singleton instance
const businessRulesService = new BusinessRulesService();

// Use development mode if API is not available
if (process.env.NODE_ENV === 'development') {
  // Override methods with development versions
  businessRulesService.getAllRules = businessRulesService.getAllRulesDev;
  businessRulesService.updateRule = businessRulesService.updateRuleDev;
  businessRulesService.resetToDefault = businessRulesService.resetToDefaultDev;
  businessRulesService.getCategories = businessRulesService.getCategoriesDev;
  businessRulesService.getRuleHistory = businessRulesService.getRuleHistoryDev;
}

export { businessRulesService };
