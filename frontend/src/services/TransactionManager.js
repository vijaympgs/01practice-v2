import api from './api';

class TransactionManager {
  constructor() {
    this.transactions = [];
    this.initialized = false;
  }

  async initialize() {
    try {
      // Load existing transactions from localStorage
      const savedTransactions = localStorage.getItem('pos_transactions');
      if (savedTransactions) {
        this.transactions = JSON.parse(savedTransactions);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize TransactionManager:', error);
      this.transactions = [];
      this.initialized = true;
    }
  }

  async saveTransaction(transaction) {
    try {
      // Add transaction to local array
      this.transactions.push(transaction);
      
      // Save to localStorage
      localStorage.setItem('pos_transactions', JSON.stringify(this.transactions));
      
      // In production, also save to backend
      if (process.env.NODE_ENV === 'production') {
        await api.post('/transactions/', transaction);
      }
      
      return transaction;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      throw error;
    }
  }

  async getTransactions(filters = {}) {
    try {
      let filteredTransactions = [...this.transactions];
      
      // Apply filters
      if (filters.sessionId) {
        filteredTransactions = filteredTransactions.filter(t => t.sessionId === filters.sessionId);
      }
      
      if (filters.shiftId) {
        filteredTransactions = filteredTransactions.filter(t => t.shiftId === filters.shiftId);
      }
      
      if (filters.dateFrom) {
        filteredTransactions = filteredTransactions.filter(t => 
          new Date(t.timestamp) >= new Date(filters.dateFrom)
        );
      }
      
      if (filters.dateTo) {
        filteredTransactions = filteredTransactions.filter(t => 
          new Date(t.timestamp) <= new Date(filters.dateTo)
        );
      }
      
      if (filters.status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
      }
      
      // Sort by timestamp (newest first)
      filteredTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return filteredTransactions;
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }

  async getTransactionById(id) {
    try {
      return this.transactions.find(t => t.id === id);
    } catch (error) {
      console.error('Failed to get transaction by ID:', error);
      return null;
    }
  }

  async updateTransaction(id, updates) {
    try {
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        this.transactions[index] = { ...this.transactions[index], ...updates };
        localStorage.setItem('pos_transactions', JSON.stringify(this.transactions));
        return this.transactions[index];
      }
      throw new Error('Transaction not found');
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id) {
    try {
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        this.transactions.splice(index, 1);
        localStorage.setItem('pos_transactions', JSON.stringify(this.transactions));
        return true;
      }
      throw new Error('Transaction not found');
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw error;
    }
  }

  async getTransactionSummary(filters = {}) {
    try {
      const transactions = await this.getTransactions(filters);
      
      const summary = {
        totalTransactions: transactions.length,
        totalSales: 0,
        totalTax: 0,
        totalDiscount: 0,
        averageTransactionValue: 0,
        paymentMethodBreakdown: {},
        hourlyBreakdown: {},
        topProducts: {},
      };
      
      transactions.forEach(transaction => {
        summary.totalSales += transaction.total || 0;
        summary.totalTax += transaction.tax || 0;
        summary.totalDiscount += transaction.discount || 0;
        
        // Payment method breakdown
        const paymentMethod = transaction.paymentMethod || 'unknown';
        summary.paymentMethodBreakdown[paymentMethod] = 
          (summary.paymentMethodBreakdown[paymentMethod] || 0) + 1;
        
        // Hourly breakdown
        const hour = new Date(transaction.timestamp).getHours();
        summary.hourlyBreakdown[hour] = 
          (summary.hourlyBreakdown[hour] || 0) + (transaction.total || 0);
        
        // Top products
        transaction.cart?.forEach(item => {
          summary.topProducts[item.name] = 
            (summary.topProducts[item.name] || 0) + item.quantity;
        });
      });
      
      summary.averageTransactionValue = summary.totalTransactions > 0 
        ? summary.totalSales / summary.totalTransactions 
        : 0;
      
      return summary;
    } catch (error) {
      console.error('Failed to get transaction summary:', error);
      return {
        totalTransactions: 0,
        totalSales: 0,
        totalTax: 0,
        totalDiscount: 0,
        averageTransactionValue: 0,
        paymentMethodBreakdown: {},
        hourlyBreakdown: {},
        topProducts: {},
      };
    }
  }

  async refundTransaction(transactionId, refundData) {
    try {
      const originalTransaction = await this.getTransactionById(transactionId);
      if (!originalTransaction) {
        throw new Error('Original transaction not found');
      }
      
      const refundTransaction = {
        id: Date.now().toString(),
        type: 'refund',
        originalTransactionId: transactionId,
        receiptNumber: `REF-${originalTransaction.receiptNumber}`,
        cart: refundData.items || originalTransaction.cart,
        subtotal: refundData.subtotal || originalTransaction.subtotal,
        tax: refundData.tax || originalTransaction.tax,
        discount: 0,
        total: refundData.total || originalTransaction.total,
        customer: originalTransaction.customer,
        paymentMethod: originalTransaction.paymentMethod,
        amountPaid: -(refundData.total || originalTransaction.total),
        change: 0,
        currency: originalTransaction.currency,
        sessionId: originalTransaction.sessionId,
        shiftId: originalTransaction.shiftId,
        timestamp: new Date().toISOString(),
        status: 'completed',
        reason: refundData.reason || 'Refund',
      };
      
      return await this.saveTransaction(refundTransaction);
    } catch (error) {
      console.error('Failed to process refund:', error);
      throw error;
    }
  }

  async suspendTransaction(transactionData) {
    try {
      const suspendedTransaction = {
        ...transactionData,
        id: Date.now().toString(),
        status: 'suspended',
        timestamp: new Date().toISOString(),
      };
      
      return await this.saveTransaction(suspendedTransaction);
    } catch (error) {
      console.error('Failed to suspend transaction:', error);
      throw error;
    }
  }

  async resumeTransaction(transactionId) {
    try {
      const transaction = await this.getTransactionById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      if (transaction.status !== 'suspended') {
        throw new Error('Transaction is not suspended');
      }
      
      return transaction;
    } catch (error) {
      console.error('Failed to resume transaction:', error);
      throw error;
    }
  }

  async getSuspendedTransactions() {
    try {
      return this.transactions.filter(t => t.status === 'suspended');
    } catch (error) {
      console.error('Failed to get suspended transactions:', error);
      return [];
    }
  }

  async clearOldTransactions(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const originalLength = this.transactions.length;
      this.transactions = this.transactions.filter(t => 
        new Date(t.timestamp) >= cutoffDate
      );
      
      localStorage.setItem('pos_transactions', JSON.stringify(this.transactions));
      
      return originalLength - this.transactions.length;
    } catch (error) {
      console.error('Failed to clear old transactions:', error);
      throw error;
    }
  }

  // Export transactions to CSV
  async exportTransactions(filters = {}, format = 'csv') {
    try {
      const transactions = await this.getTransactions(filters);
      
      if (format === 'csv') {
        const headers = [
          'ID', 'Receipt Number', 'Invoice Number', 'Date', 'Customer',
          'Subtotal', 'Tax', 'Discount', 'Total', 'Payment Method',
          'Amount Paid', 'Change', 'Currency', 'Status'
        ];
        
        const csvContent = [
          headers.join(','),
          ...transactions.map(t => [
            t.id,
            t.receiptNumber,
            t.invoiceNumber,
            new Date(t.timestamp).toLocaleString(),
            t.customer?.name || '',
            t.subtotal,
            t.tax,
            t.discount,
            t.total,
            t.paymentMethod,
            t.amountPaid,
            t.change,
            t.currency,
            t.status
          ].join(','))
        ].join('\n');
        
        return csvContent;
      }
      
      return transactions;
    } catch (error) {
      console.error('Failed to export transactions:', error);
      throw error;
    }
  }
}

// Create singleton instance
const transactionManager = new TransactionManager();

export default transactionManager;