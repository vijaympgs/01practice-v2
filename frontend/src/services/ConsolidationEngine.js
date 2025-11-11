/**
 * OptiMind Retail™ POS System - Consolidation Engine
 * 
 * Multi-store consolidation and comparison:
 * - Aggregate data from multiple stores
 * - Cross-store performance comparison
 * - Centralized reporting and analytics
 * - Store performance benchmarking
 * - Enterprise-wide insights
 */

import indexedDBManager from './IndexedDBManager.js';
import api from './api.js';

class ConsolidationEngine {
  constructor() {
    this.isInitialized = false;
    this.storeData = new Map();
    this.consolidationStatus = {
      lastConsolidation: null,
      isConsolidating: false,
      storesProcessed: 0,
      totalStores: 0
    };
  }

  /**
   * Initialize consolidation engine
   */
  async initialize() {
    try {
      await indexedDBManager.initialize();
      this.isInitialized = true;
      console.log('✅ Consolidation Engine initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Consolidation Engine:', error);
      throw error;
    }
  }

  /**
   * Consolidate data from multiple stores
   */
  async consolidateMultiStoreData(storeIds = []) {
    if (this.consolidationStatus.isConsolidating) {
      console.log('⚠️ Consolidation already in progress');
      return;
    }

    try {
      this.consolidationStatus.isConsolidating = true;
      this.consolidationStatus.storesProcessed = 0;
      this.consolidationStatus.totalStores = storeIds.length;
      
      console.log('🔄 Starting multi-store consolidation...');
      
      const consolidatedData = {
        stores: [],
        summary: {
          totalRevenue: 0,
          totalTransactions: 0,
          totalProducts: 0,
          totalCustomers: 0,
          averageTransactionValue: 0,
          topPerformingStore: null,
          lowestPerformingStore: null
        },
        comparisons: [],
        insights: []
      };

      // Process each store
      for (const storeId of storeIds) {
        try {
          const storeData = await this.getStoreData(storeId);
          consolidatedData.stores.push(storeData);
          this.consolidationStatus.storesProcessed++;
        } catch (error) {
          console.error(`❌ Failed to process store ${storeId}:`, error);
        }
      }

      // Calculate summary statistics
      consolidatedData.summary = this.calculateSummaryStatistics(consolidatedData.stores);
      
      // Generate comparisons
      consolidatedData.comparisons = this.generateStoreComparisons(consolidatedData.stores);
      
      // Generate insights
      consolidatedData.insights = this.generateConsolidationInsights(consolidatedData.stores);
      
      // Save consolidated data
      await this.saveConsolidatedData(consolidatedData);
      
      this.consolidationStatus.lastConsolidation = new Date();
      console.log('✅ Multi-store consolidation completed');
      
      return consolidatedData;
      
    } catch (error) {
      console.error('❌ Multi-store consolidation failed:', error);
      throw error;
    } finally {
      this.consolidationStatus.isConsolidating = false;
    }
  }

  /**
   * Get data for a specific store
   */
  async getStoreData(storeId) {
    try {
      const response = await api.get(`/stores/${storeId}/consolidated-data/`);
      const storeData = response.data;
      
      // Calculate store-specific metrics
      storeData.metrics = this.calculateStoreMetrics(storeData);
      
      return storeData;
    } catch (error) {
      console.error(`❌ Failed to get data for store ${storeId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate store-specific metrics
   */
  calculateStoreMetrics(storeData) {
    const metrics = {
      revenue: storeData.transactions?.reduce((sum, t) => sum + (t.total || 0), 0) || 0,
      transactionCount: storeData.transactions?.length || 0,
      averageTransactionValue: 0,
      productCount: storeData.products?.length || 0,
      customerCount: storeData.customers?.length || 0,
      inventoryValue: 0,
      topProducts: [],
      performanceScore: 0
    };

    // Calculate average transaction value
    if (metrics.transactionCount > 0) {
      metrics.averageTransactionValue = metrics.revenue / metrics.transactionCount;
    }

    // Calculate inventory value
    if (storeData.products && storeData.inventory) {
      metrics.inventoryValue = storeData.products.reduce((sum, product) => {
        const inventory = storeData.inventory.find(inv => inv.productId === product.id);
        return sum + (inventory?.currentStock || 0) * (product.cost || 0);
      }, 0);
    }

    // Get top products
    if (storeData.transactions) {
      const productSales = {};
      storeData.transactions.forEach(transaction => {
        transaction.items?.forEach(item => {
          productSales[item.productId] = (productSales[item.productId] || 0) + item.total;
        });
      });
      
      metrics.topProducts = Object.entries(productSales)
        .map(([productId, total]) => ({ productId, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    }

    // Calculate performance score
    metrics.performanceScore = this.calculatePerformanceScore(metrics);

    return metrics;
  }

  /**
   * Calculate performance score for a store
   */
  calculatePerformanceScore(metrics) {
    // Simple performance scoring algorithm
    const revenueScore = Math.min(metrics.revenue / 10000, 1) * 40; // Max 40 points for revenue
    const transactionScore = Math.min(metrics.transactionCount / 100, 1) * 30; // Max 30 points for transactions
    const efficiencyScore = metrics.averageTransactionValue > 50 ? 20 : 10; // Max 20 points for efficiency
    const inventoryScore = metrics.inventoryValue > 50000 ? 10 : 5; // Max 10 points for inventory
    
    return Math.round(revenueScore + transactionScore + efficiencyScore + inventoryScore);
  }

  /**
   * Calculate summary statistics
   */
  calculateSummaryStatistics(stores) {
    const summary = {
      totalRevenue: 0,
      totalTransactions: 0,
      totalProducts: 0,
      totalCustomers: 0,
      averageTransactionValue: 0,
      topPerformingStore: null,
      lowestPerformingStore: null
    };

    stores.forEach(store => {
      summary.totalRevenue += store.metrics.revenue;
      summary.totalTransactions += store.metrics.transactionCount;
      summary.totalProducts += store.metrics.productCount;
      summary.totalCustomers += store.metrics.customerCount;
    });

    // Calculate average transaction value
    if (summary.totalTransactions > 0) {
      summary.averageTransactionValue = summary.totalRevenue / summary.totalTransactions;
    }

    // Find top and lowest performing stores
    if (stores.length > 0) {
      const sortedStores = stores.sort((a, b) => b.metrics.performanceScore - a.metrics.performanceScore);
      summary.topPerformingStore = sortedStores[0];
      summary.lowestPerformingStore = sortedStores[sortedStores.length - 1];
    }

    return summary;
  }

  /**
   * Generate store comparisons
   */
  generateStoreComparisons(stores) {
    const comparisons = [];

    for (let i = 0; i < stores.length; i++) {
      for (let j = i + 1; j < stores.length; j++) {
        const store1 = stores[i];
        const store2 = stores[j];
        
        const comparison = {
          store1: store1.name,
          store2: store2.name,
          revenueDifference: store1.metrics.revenue - store2.metrics.revenue,
          transactionDifference: store1.metrics.transactionCount - store2.metrics.transactionCount,
          performanceDifference: store1.metrics.performanceScore - store2.metrics.performanceScore,
          betterPerformer: store1.metrics.performanceScore > store2.metrics.performanceScore ? store1.name : store2.name
        };
        
        comparisons.push(comparison);
      }
    }

    return comparisons;
  }

  /**
   * Generate consolidation insights
   */
  generateConsolidationInsights(stores) {
    const insights = [];

    if (stores.length === 0) return insights;

    // Revenue insights
    const totalRevenue = stores.reduce((sum, store) => sum + store.metrics.revenue, 0);
    const averageRevenue = totalRevenue / stores.length;
    
    insights.push({
      type: 'revenue',
      message: `Total revenue across all stores: $${totalRevenue.toLocaleString()}`,
      severity: 'info'
    });

    // Performance insights
    const topStore = stores.reduce((max, store) => 
      store.metrics.performanceScore > max.metrics.performanceScore ? store : max
    );
    
    insights.push({
      type: 'performance',
      message: `Top performing store: ${topStore.name} (Score: ${topStore.metrics.performanceScore})`,
      severity: 'success'
    });

    // Transaction insights
    const totalTransactions = stores.reduce((sum, store) => sum + store.metrics.transactionCount, 0);
    insights.push({
      type: 'transactions',
      message: `Total transactions across all stores: ${totalTransactions.toLocaleString()}`,
      severity: 'info'
    });

    // Inventory insights
    const totalInventoryValue = stores.reduce((sum, store) => sum + store.metrics.inventoryValue, 0);
    insights.push({
      type: 'inventory',
      message: `Total inventory value across all stores: $${totalInventoryValue.toLocaleString()}`,
      severity: 'info'
    });

    return insights;
  }

  /**
   * Save consolidated data
   */
  async saveConsolidatedData(consolidatedData) {
    try {
      const dataToSave = {
        id: 'consolidated_data',
        data: consolidatedData,
        timestamp: new Date(),
        version: '1.0.0'
      };

      await indexedDBManager.update('consolidatedData', dataToSave);
      console.log('💾 Consolidated data saved');
    } catch (error) {
      console.error('❌ Failed to save consolidated data:', error);
    }
  }

  /**
   * Get consolidated data
   */
  async getConsolidatedData() {
    try {
      const data = await indexedDBManager.get('consolidatedData', 'consolidated_data');
      return data?.data || null;
    } catch (error) {
      console.error('❌ Failed to get consolidated data:', error);
      return null;
    }
  }

  /**
   * Get consolidation status
   */
  getConsolidationStatus() {
    return {
      ...this.consolidationStatus,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Clear consolidated data
   */
  async clearConsolidatedData() {
    await indexedDBManager.clearStore('consolidatedData');
    console.log('🗑️ Consolidated data cleared');
  }
}

// Export singleton instance
const consolidationEngine = new ConsolidationEngine();
export default consolidationEngine;
