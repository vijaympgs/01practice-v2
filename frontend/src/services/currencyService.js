import api from './api';
import { posMasterService } from './posMasterService';

class CurrencyService {
  // ========== CURRENCY OPERATIONS ==========
  
  async getAllCurrencies() {
    try {
      // First try to get from POS Masters
      const posMasters = await posMasterService.getAllMasters();
      const currencies = posMasters.filter(master => master.master_type?.toLowerCase() === 'currency');
      
      if (currencies.length > 0) {
        return currencies.map(currency => ({
          id: currency.id,
          code: currency.code,
          name: currency.name,
          description: currency.description,
          is_active: currency.is_active,
          created_at: currency.created_at,
          updated_at: currency.updated_at,
        }));
      }
      
      // Fallback to mock data if no POS Masters currencies
      return this.getMockCurrencies();
    } catch (error) {
      console.error('Error fetching currencies:', error);
      // Return mock data as fallback
      return this.getMockCurrencies();
    }
  }

  async getActiveCurrencies() {
    try {
      const currencies = await this.getAllCurrencies();
      return currencies.filter(currency => currency.is_active);
    } catch (error) {
      console.error('Error fetching active currencies:', error);
      return this.getMockCurrencies().filter(currency => currency.is_active);
    }
  }

  async getCurrencyByCode(code) {
    try {
      const currencies = await this.getAllCurrencies();
      return currencies.find(currency => currency.code === code);
    } catch (error) {
      console.error('Error fetching currency by code:', error);
      return null;
    }
  }

  async createCurrency(data) {
    try {
      // Create in POS Masters
      const currencyData = {
        master_type: 'currency',
        code: data.code,
        name: data.name,
        description: data.description,
        is_active: data.is_active !== false,
      };
      
      return await posMasterService.createMaster(currencyData);
    } catch (error) {
      console.error('Error creating currency:', error);
      throw error;
    }
  }

  async updateCurrency(id, data) {
    try {
      // Update in POS Masters
      const currencyData = {
        master_type: 'currency',
        code: data.code,
        name: data.name,
        description: data.description,
        is_active: data.is_active,
      };
      
      return await posMasterService.updateMaster(id, currencyData);
    } catch (error) {
      console.error('Error updating currency:', error);
      throw error;
    }
  }

  async deleteCurrency(id) {
    try {
      return await posMasterService.deleteMaster(id);
    } catch (error) {
      console.error('Error deleting currency:', error);
      throw error;
    }
  }

  async toggleCurrencyStatus(id, isActive) {
    try {
      return await posMasterService.toggleStatus(id, { is_active: isActive });
    } catch (error) {
      console.error('Error toggling currency status:', error);
      throw error;
    }
  }

  // ========== COUNTRY CURRENCY INTEGRATION ==========
  
  async getCurrenciesForCountry(countryCode) {
    try {
      // Get all active currencies
      const currencies = await this.getActiveCurrencies();
      
      // For now, return all currencies
      // In future, this could be filtered by country-specific currencies
      return currencies;
    } catch (error) {
      console.error('Error fetching currencies for country:', error);
      return this.getMockCurrencies().filter(currency => currency.is_active);
    }
  }

  async getDefaultCurrencyForCountry(countryCode) {
    try {
      // Country-specific default currency mapping
      const countryCurrencyMap = {
        'IN': 'INR', // India
        'US': 'USD', // United States
        'GB': 'GBP', // United Kingdom
        'DE': 'EUR', // Germany
        'FR': 'EUR', // France
        'IT': 'EUR', // Italy
        'ES': 'EUR', // Spain
        'AU': 'AUD', // Australia
        'CA': 'CAD', // Canada
        'JP': 'JPY', // Japan
        'CN': 'CNY', // China
        'BR': 'BRL', // Brazil
        'MX': 'MXN', // Mexico
        'RU': 'RUB', // Russia
        'ZA': 'ZAR', // South Africa
      };
      
      const defaultCode = countryCurrencyMap[countryCode] || 'USD';
      return await this.getCurrencyByCode(defaultCode);
    } catch (error) {
      console.error('Error fetching default currency for country:', error);
      return this.getCurrencyByCode('USD');
    }
  }

  // ========== CURRENCY FORMATTING ==========
  
  formatCurrency(amount, currencyCode = 'INR', locale = 'en-IN') {
    try {
      const currency = this.getCurrencyByCode(currencyCode);
      if (!currency) {
        return `${amount} ${currencyCode}`;
      }
      
      // Use Intl.NumberFormat for proper currency formatting
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${amount} ${currencyCode}`;
    }
  }

  getCurrencySymbol(currencyCode) {
    const symbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'AUD': 'A$',
      'CAD': 'C$',
      'CNY': '¥',
      'BRL': 'R$',
      'MXN': '$',
      'RUB': '₽',
      'ZAR': 'R',
    };
    
    return symbols[currencyCode] || currencyCode;
  }

  // ========== MOCK DATA FOR DEVELOPMENT ==========
  
  getMockCurrencies() {
    return [
      {
        id: '1',
        code: 'INR',
        name: 'Indian Rupee',
        description: 'Indian currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '2',
        code: 'USD',
        name: 'US Dollar',
        description: 'United States currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '3',
        code: 'EUR',
        name: 'Euro',
        description: 'European Union currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '4',
        code: 'GBP',
        name: 'British Pound',
        description: 'United Kingdom currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '5',
        code: 'JPY',
        name: 'Japanese Yen',
        description: 'Japanese currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '6',
        code: 'AUD',
        name: 'Australian Dollar',
        description: 'Australian currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '7',
        code: 'CAD',
        name: 'Canadian Dollar',
        description: 'Canadian currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '8',
        code: 'CNY',
        name: 'Chinese Yuan',
        description: 'Chinese currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '9',
        code: 'BRL',
        name: 'Brazilian Real',
        description: 'Brazilian currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
      {
        id: '10',
        code: 'MXN',
        name: 'Mexican Peso',
        description: 'Mexican currency',
        is_active: true,
        created_at: '2025-01-26T06:00:00Z',
        updated_at: '2025-01-26T06:00:00Z',
      },
    ];
  }

  // ========== DEVELOPMENT MODE METHODS ==========
  
  async getAllCurrenciesDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockCurrencies());
      }, 500);
    });
  }

  async getActiveCurrenciesDev() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockCurrencies().filter(currency => currency.is_active));
      }, 500);
    });
  }

  async getCurrencyByCodeDev(code) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currency = this.getMockCurrencies().find(c => c.code === code);
        resolve(currency || null);
      }, 300);
    });
  }

  async createCurrencyDev(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCurrency = {
          id: Date.now().toString(),
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        resolve(newCurrency);
      }, 300);
    });
  }

  async updateCurrencyDev(id, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currency = this.getMockCurrencies().find(c => c.id === id);
        if (currency) {
          Object.assign(currency, data);
          currency.updated_at = new Date().toISOString();
        }
        resolve(currency);
      }, 300);
    });
  }

  async deleteCurrencyDev(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Currency deleted successfully' });
      }, 300);
    });
  }

  async toggleCurrencyStatusDev(id, isActive) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currency = this.getMockCurrencies().find(c => c.id === id);
        if (currency) {
          currency.is_active = isActive;
          currency.updated_at = new Date().toISOString();
        }
        resolve(currency);
      }, 300);
    });
  }
}

// Create singleton instance
const currencyService = new CurrencyService();

// Use development mode if API is not available
if (process.env.NODE_ENV === 'development') {
  // Override methods with development versions
  currencyService.getAllCurrencies = currencyService.getAllCurrenciesDev;
  currencyService.getActiveCurrencies = currencyService.getActiveCurrenciesDev;
  currencyService.getCurrencyByCode = currencyService.getCurrencyByCodeDev;
  currencyService.createCurrency = currencyService.createCurrencyDev;
  currencyService.updateCurrency = currencyService.updateCurrencyDev;
  currencyService.deleteCurrency = currencyService.deleteCurrencyDev;
  currencyService.toggleCurrencyStatus = currencyService.toggleCurrencyStatusDev;
}

export { currencyService };
