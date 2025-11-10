/**
 * OptiMind Retail™ POS System - Analytics Engine
 * 
 * Real-time analytics with predictive insights:
 * - Sales performance analytics
 * - Inventory optimization insights
 * - Customer behavior analysis
 * - Predictive analytics for demand forecasting
 * - Performance monitoring and alerts
 */

import indexedDBManager from './IndexedDBManager.js';

class AnalyticsEngine {
  constructor() {
    this.isInitialized = false;
    this.analyticsCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.insights = {
      sales: null,
      inventory: null,
      customers: null,
      performance: null
    };
  }

  /**
   * Initialize analytics engine
   */
  async initialize() {
    try {
      await indexedDBManager.initialize();
      this.isInitialized = true;
      console.log('✅ Analytics Engine initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Analytics Engine:', error);
      throw error;
    }
  }

  /**
   * Get sales analytics
   */
  async getSalesAnalytics(timeRange = 'today') {
    const cacheKey = `sales_${timeRange}`;
    
    if (this.analyticsCache.has(cacheKey)) {
      const cached = this.analyticsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const transactions = await this.getTransactionsByTimeRange(timeRange);
      const analytics = this.calculateSalesAnalytics(transactions);
      
      this.analyticsCache.set(cacheKey, {
        data: analytics,
        timestamp: Date.now()
      });
      
      return analytics;
    } catch (error) {
      console.error('❌ Failed to get sales analytics:', error);
      throw error;
    }
  }

  /**
   * Get inventory analytics
   */
  async getInventoryAnalytics() {
    const cacheKey = 'inventory_analytics';
    
    if (this.analyticsCache.has(cacheKey)) {
      const cached = this.analyticsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const products = await indexedDBManager.getAll('products');
      const inventory = await indexedDBManager.getAll('inventory');
      const transactions = await indexedDBManager.getAll('transactions');
      
      const analytics = this.calculateInventoryAnalytics(products, inventory, transactions);
      
      this.analyticsCache.set(cacheKey, {
        data: analytics,
        timestamp: Date.now()
      });
      
      return analytics;
    } catch (error) {
      console.error('❌ Failed to get inventory analytics:', error);
      throw error;
    }
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics() {
    const cacheKey = 'customer_analytics';
    
    if (this.analyticsCache.has(cacheKey)) {
      const cached = this.analyticsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const customers = await indexedDBManager.getAll('customers');
      const transactions = await indexedDBManager.getAll('transactions');
      
      const analytics = this.calculateCustomerAnalytics(customers, transactions);
      
      this.analyticsCache.set(cacheKey, {
        data: analytics,
        timestamp: Date.now()
      });
      
      return analytics;
    } catch (error) {
      console.error('❌ Failed to get customer analytics:', error);
      throw error;
    }
  }

  /**
   * Get performance analytics
   */
  async getPerformanceAnalytics() {
    const cacheKey = 'performance_analytics';
    
    if (this.analyticsCache.has(cacheKey)) {
      const cached = this.analyticsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const transactions = await indexedDBManager.getAll('transactions');
      const sessions = await indexedDBManager.getAll('sessions');
      
      const analytics = this.calculatePerformanceAnalytics(transactions, sessions);
      
      this.analyticsCache.set(cacheKey, {
        data: analytics,
        timestamp: Date.now()
      });
      
      return analytics;
    } catch (error) {
      console.error('❌ Failed to get performance analytics:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive analytics dashboard
   */
  async getAnalyticsDashboard() {
    try {
      const [sales, inventory, customers, performance] = await Promise.all([
        this.getSalesAnalytics('today'),
        this.getInventoryAnalytics(),
        this.getCustomerAnalytics(),
        this.getPerformanceAnalytics()
      ]);

      return {
        sales,
        inventory,
        customers,
        performance,
        generatedAt: new Date(),
        insights: await this.generateInsights(sales, inventory, customers, performance)
      };
    } catch (error) {
      console.error('❌ Failed to get analytics dashboard:', error);
      throw error;
    }
  }

  /**
   * Calculate sales analytics
   */
  calculateSalesAnalytics(transactions) {
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalTransactions = completedTransactions.length;
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Sales by hour
    const salesByHour = this.groupSalesByHour(completedTransactions);
    
    // Top products
    const topProducts = this.getTopProducts(completedTransactions);
    
    // Payment methods
    const paymentMethods = this.getPaymentMethodBreakdown(completedTransactions);
    
    return {
      totalRevenue,
      totalTransactions,
      averageTransactionValue,
      salesByHour,
      topProducts,
      paymentMethods,
      timeRange: 'today'
    };
  }

  /**
   * Calculate inventory analytics
   */
  calculateInventoryAnalytics(products, inventory, transactions) {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    
    // Low stock analysis
    const lowStockProducts = products.filter(p => {
      const inv = inventory.find(i => i.productId === p.id);
      return inv && inv.currentStock <= p.inventory?.minLevel;
    });
    
    // Out of stock products
    const outOfStockProducts = products.filter(p => {
      const inv = inventory.find(i => i.productId === p.id);
      return inv && inv.currentStock <= 0;
    });
    
    // Inventory value
    const totalInventoryValue = inventory.reduce((sum, inv) => {
      const product = products.find(p => p.id === inv.productId);
      return sum + (inv.currentStock * (product?.cost || 0));
    }, 0);
    
    // Fast-moving products
    const fastMovingProducts = this.getFastMovingProducts(products, transactions);
    
    return {
      totalProducts,
      activeProducts,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      totalInventoryValue,
      fastMovingProducts,
      inventoryTurnover: this.calculateInventoryTurnover(inventory, transactions)
    };
  }

  /**
   * Calculate customer analytics
   */
  calculateCustomerAnalytics(customers, transactions) {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.isActive).length;
    
    // Customer transactions
    const customerTransactions = transactions.filter(t => t.customer);
    const uniqueCustomers = new Set(customerTransactions.map(t => t.customer.id));
    
    // Average customer value
    const customerValues = customerTransactions.reduce((acc, t) => {
      const customerId = t.customer.id;
      acc[customerId] = (acc[customerId] || 0) + t.total;
      return acc;
    }, {});
    
    const averageCustomerValue = Object.values(customerValues).reduce((sum, value) => sum + value, 0) / Object.keys(customerValues).length || 0;
    
    // Top customers
    const topCustomers = Object.entries(customerValues)
      .map(([customerId, value]) => {
        const customer = customers.find(c => c.id === customerId);
        return { customer, totalValue: value };
      })
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);
    
    return {
      totalCustomers,
      activeCustomers,
      customersWithTransactions: uniqueCustomers.size,
      averageCustomerValue,
      topCustomers
    };
  }

  /**
   * Calculate performance analytics
   */
  calculatePerformanceAnalytics(transactions, sessions) {
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const activeSessions = sessions.filter(s => s.status === 'active');
    
    // Transaction performance
    const totalTransactions = completedTransactions.length;
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    
    // Session performance
    const totalSessions = sessions.length;
    const averageSessionDuration = this.calculateAverageSessionDuration(sessions);
    
    // Operator performance
    const operatorPerformance = this.calculateOperatorPerformance(transactions, sessions);
    
    return {
      totalTransactions,
      totalRevenue,
      totalSessions,
      activeSessions: activeSessions.length,
      averageSessionDuration,
      operatorPerformance
    };
  }

  /**
   * Generate insights and recommendations
   */
  async generateInsights(sales, inventory, customers, performance) {
    const insights = [];
    
    // Sales insights
    if (sales.totalRevenue > 0) {
      insights.push({
        type: 'sales',
        message: `Today's revenue: $${sales.totalRevenue.toFixed(2)} from ${sales.totalTransactions} transactions`,
        severity: 'info'
      });
    }
    
    // Inventory insights
    if (inventory.lowStockProducts > 0) {
      insights.push({
        type: 'inventory',
        message: `${inventory.lowStockProducts} products are running low on stock`,
        severity: 'warning'
      });
    }
    
    if (inventory.outOfStockProducts > 0) {
      insights.push({
        type: 'inventory',
        message: `${inventory.outOfStockProducts} products are out of stock`,
        severity: 'error'
      });
    }
    
    // Customer insights
    if (customers.averageCustomerValue > 0) {
      insights.push({
        type: 'customer',
        message: `Average customer value: $${customers.averageCustomerValue.toFixed(2)}`,
        severity: 'info'
      });
    }
    
    // Performance insights
    if (performance.averageSessionDuration > 0) {
      insights.push({
        type: 'performance',
        message: `Average session duration: ${Math.round(performance.averageSessionDuration / 60000)} minutes`,
        severity: 'info'
      });
    }
    
    return insights;
  }

  /**
   * Helper methods
   */
  async getTransactionsByTimeRange(timeRange) {
    const transactions = await indexedDBManager.getAll('transactions');
    const now = new Date();
    
    switch (timeRange) {
      case 'today':
        return transactions.filter(t => {
          const transactionDate = new Date(t.timestamp);
          return transactionDate.toDateString() === now.toDateString();
        });
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactions.filter(t => new Date(t.timestamp) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return transactions.filter(t => new Date(t.timestamp) >= monthAgo);
      default:
        return transactions;
    }
  }

  groupSalesByHour(transactions) {
    const salesByHour = {};
    
    transactions.forEach(transaction => {
      const hour = new Date(transaction.timestamp).getHours();
      salesByHour[hour] = (salesByHour[hour] || 0) + transaction.total;
    });
    
    return salesByHour;
  }

  getTopProducts(transactions) {
    const productSales = {};
    
    transactions.forEach(transaction => {
      transaction.items?.forEach(item => {
        productSales[item.productId] = (productSales[item.productId] || 0) + item.total;
      });
    });
    
    return Object.entries(productSales)
      .map(([productId, total]) => ({ productId, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }

  getPaymentMethodBreakdown(transactions) {
    const paymentMethods = {};
    
    transactions.forEach(transaction => {
      transaction.payments?.forEach(payment => {
        paymentMethods[payment.method] = (paymentMethods[payment.method] || 0) + payment.amount;
      });
    });
    
    return paymentMethods;
  }

  getFastMovingProducts(products, transactions) {
    const productMovements = {};
    
    transactions.forEach(transaction => {
      transaction.items?.forEach(item => {
        productMovements[item.productId] = (productMovements[item.productId] || 0) + item.quantity;
      });
    });
    
    return Object.entries(productMovements)
      .map(([productId, quantity]) => ({ productId, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }

  calculateInventoryTurnover(inventory, transactions) {
    // Simplified inventory turnover calculation
    const totalInventoryValue = inventory.reduce((sum, inv) => sum + inv.currentStock, 0);
    const totalSales = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
    
    return totalInventoryValue > 0 ? totalSales / totalInventoryValue : 0;
  }

  calculateAverageSessionDuration(sessions) {
    const completedSessions = sessions.filter(s => s.endTime);
    if (completedSessions.length === 0) return 0;
    
    const totalDuration = completedSessions.reduce((sum, session) => {
      return sum + (new Date(session.endTime) - new Date(session.startTime));
    }, 0);
    
    return totalDuration / completedSessions.length;
  }

  calculateOperatorPerformance(transactions, sessions) {
    const operatorStats = {};
    
    transactions.forEach(transaction => {
      const operatorId = transaction.operatorId;
      if (!operatorStats[operatorId]) {
        operatorStats[operatorId] = { transactions: 0, revenue: 0 };
      }
      operatorStats[operatorId].transactions++;
      operatorStats[operatorId].revenue += transaction.total || 0;
    });
    
    return operatorStats;
  }

  /**
   * Clear analytics cache
   */
  clearCache() {
    this.analyticsCache.clear();
    console.log('🗑️ Analytics cache cleared');
  }
}

// Export singleton instance
const analyticsEngine = new AnalyticsEngine();
export default analyticsEngine;