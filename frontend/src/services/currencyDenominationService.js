import api from './api';

class CurrencyDenominationService {
  // ========== CURRENCY DENOMINATION OPERATIONS ==========
  
  async getAllDenominations() {
    try {
      const response = await api.get('/pos-masters/currency-denominations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching currency denominations:', error);
      throw error;
    }
  }

  async getDenominationById(id) {
    try {
      const response = await api.get(`/pos-masters/currency-denominations/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching currency denomination:', error);
      throw error;
    }
  }

  async getDenominationsByCurrency(currencyId) {
    try {
      const response = await api.get(
        `/pos-masters/currency-denominations/by_currency/?currency_id=${currencyId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching denominations by currency:', error);
      throw error;
    }
  }

  async createDenomination(data) {
    try {
      const response = await api.post('/pos-masters/currency-denominations/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating currency denomination:', error);
      throw error;
    }
  }

  async updateDenomination(id, data) {
    try {
      const response = await api.patch(`/pos-masters/currency-denominations/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating currency denomination:', error);
      throw error;
    }
  }

  async deleteDenomination(id) {
    try {
      const response = await api.delete(`/pos-masters/currency-denominations/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting currency denomination:', error);
      throw error;
    }
  }

  async bulkCreateDenominations(currencyId, denominations) {
    try {
      const response = await api.post('/pos-masters/currency-denominations/bulk_create/', {
        currency_id: currencyId,
        denominations: denominations
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk creating currency denominations:', error);
      throw error;
    }
  }

  // ========== HELPER METHODS ==========
  
  /**
   * Get denominations grouped by type (notes/coins)
   */
  async getDenominationsGroupedByType(currencyId) {
    try {
      const denominations = await this.getDenominationsByCurrency(currencyId);
      
      const grouped = {
        notes: [],
        coins: []
      };
      
      denominations.forEach(denom => {
        if (denom.denomination_type === 'note') {
          grouped.notes.push(denom);
        } else if (denom.denomination_type === 'coin') {
          grouped.coins.push(denom);
        }
      });
      
      // Sort by value descending
      grouped.notes.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
      grouped.coins.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
      
      return grouped;
    } catch (error) {
      console.error('Error grouping denominations by type:', error);
      throw error;
    }
  }

  /**
   * Initialize default denominations for a currency
   */
  async initializeDefaultDenominations(currencyId, currencyCode) {
    try {
      // Default denominations based on currency code
      const defaultDenominations = this.getDefaultDenominations(currencyCode);
      
      const result = await this.bulkCreateDenominations(currencyId, defaultDenominations);
      return result;
    } catch (error) {
      console.error('Error initializing default denominations:', error);
      throw error;
    }
  }

  /**
   * Get default denominations based on currency code
   */
  getDefaultDenominations(currencyCode) {
    const defaults = {
      'USD': [
        { denomination_type: 'note', value: '100.00', display_name: '$100', display_order: 1 },
        { denomination_type: 'note', value: '50.00', display_name: '$50', display_order: 2 },
        { denomination_type: 'note', value: '20.00', display_name: '$20', display_order: 3 },
        { denomination_type: 'note', value: '10.00', display_name: '$10', display_order: 4 },
        { denomination_type: 'note', value: '5.00', display_name: '$5', display_order: 5 },
        { denomination_type: 'note', value: '1.00', display_name: '$1', display_order: 6 },
        { denomination_type: 'coin', value: '0.50', display_name: '50¢', display_order: 7 },
        { denomination_type: 'coin', value: '0.25', display_name: '25¢', display_order: 8 },
        { denomination_type: 'coin', value: '0.10', display_name: '10¢', display_order: 9 },
        { denomination_type: 'coin', value: '0.05', display_name: '5¢', display_order: 10 },
        { denomination_type: 'coin', value: '0.01', display_name: '1¢', display_order: 11 },
      ],
      'INR': [
        { denomination_type: 'note', value: '2000.00', display_name: '₹2000', display_order: 1 },
        { denomination_type: 'note', value: '500.00', display_name: '₹500', display_order: 2 },
        { denomination_type: 'note', value: '200.00', display_name: '₹200', display_order: 3 },
        { denomination_type: 'note', value: '100.00', display_name: '₹100', display_order: 4 },
        { denomination_type: 'note', value: '50.00', display_name: '₹50', display_order: 5 },
        { denomination_type: 'note', value: '20.00', display_name: '₹20', display_order: 6 },
        { denomination_type: 'note', value: '10.00', display_name: '₹10', display_order: 7 },
        { denomination_type: 'coin', value: '10.00', display_name: '₹10', display_order: 8 },
        { denomination_type: 'coin', value: '5.00', display_name: '₹5', display_order: 9 },
        { denomination_type: 'coin', value: '2.00', display_name: '₹2', display_order: 10 },
        { denomination_type: 'coin', value: '1.00', display_name: '₹1', display_order: 11 },
      ],
      'EUR': [
        { denomination_type: 'note', value: '500.00', display_name: '€500', display_order: 1 },
        { denomination_type: 'note', value: '200.00', display_name: '€200', display_order: 2 },
        { denomination_type: 'note', value: '100.00', display_name: '€100', display_order: 3 },
        { denomination_type: 'note', value: '50.00', display_name: '€50', display_order: 4 },
        { denomination_type: 'note', value: '20.00', display_name: '€20', display_order: 5 },
        { denomination_type: 'note', value: '10.00', display_name: '€10', display_order: 6 },
        { denomination_type: 'note', value: '5.00', display_name: '€5', display_order: 7 },
        { denomination_type: 'coin', value: '2.00', display_name: '€2', display_order: 8 },
        { denomination_type: 'coin', value: '1.00', display_name: '€1', display_order: 9 },
        { denomination_type: 'coin', value: '0.50', display_name: '50¢', display_order: 10 },
        { denomination_type: 'coin', value: '0.20', display_name: '20¢', display_order: 11 },
        { denomination_type: 'coin', value: '0.10', display_name: '10¢', display_order: 12 },
        { denomination_type: 'coin', value: '0.05', display_name: '5¢', display_order: 13 },
        { denomination_type: 'coin', value: '0.02', display_name: '2¢', display_order: 14 },
        { denomination_type: 'coin', value: '0.01', display_name: '1¢', display_order: 15 },
      ]
    };
    
    return defaults[currencyCode] || defaults['USD'];
  }
}

// Create singleton instance
const currencyDenominationService = new CurrencyDenominationService();

export { currencyDenominationService };
