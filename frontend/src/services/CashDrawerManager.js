/**
 * OptiMind Retail™ POS System - Cash Drawer Manager
 * 
 * Handles cash drawer operations and balancing:
 * - Opening/closing cash drawer with count verification
 * - Real-time cash tracking during transactions
 * - Cash variance detection and reporting
 * - Multi-currency support
 * - Cash drawer security and audit trail
 */

import indexedDBManager from './IndexedDBManager.js';

class CashDrawerManager {
  constructor() {
    this.currentDrawer = null;
    this.drawerHistory = [];
    this.isDrawerOpen = false;
  }

  /**
   * Initialize cash drawer manager
   */
  async initialize() {
    await indexedDBManager.initialize();
    console.log('✅ Cash Drawer Manager initialized');
  }

  /**
   * Open cash drawer for shift
   */
  async openDrawer(operatorId, sessionId, openingCount) {
    // Close any existing drawer first
    if (this.currentDrawer && this.currentDrawer.status === 'open') {
      await this.closeDrawer(operatorId, 'Auto-closed for new drawer opening');
    }

    const drawerId = this.generateDrawerId();
    const openTime = new Date();

    const drawer = {
      id: drawerId,
      sessionId,
      operatorId,
      status: 'open',
      openTime,
      closeTime: null,
      openingCount: {
        ...openingCount,
        total: this.calculateTotal(openingCount)
      },
      closingCount: null,
      expectedAmount: 0,
      actualAmount: 0,
      variance: 0,
      variancePercentage: 0,
      transactions: [],
      cashMovements: [],
      notes: '',
      createdAt: new Date(),
      syncStatus: 'pending'
    };

    // Save to IndexedDB
    await indexedDBManager.add('cashDrawers', drawer);

    this.currentDrawer = drawer;
    this.isDrawerOpen = true;

    // Add to sync queue
    await indexedDBManager.addToSyncQueue(
      'cashDrawer',
      drawerId,
      'create',
      drawer,
      90 // Very high priority for cash operations
    );

    console.log(`💰 Cash drawer opened: $${drawer.openingCount.total.toFixed(2)}`);
    return drawer;
  }

  /**
   * Close cash drawer
   */
  async closeDrawer(operatorId, closingCount, notes = '') {
    if (!this.currentDrawer || this.currentDrawer.status !== 'open') {
      throw new Error('No open cash drawer to close');
    }

    const closeTime = new Date();
    const actualAmount = this.calculateTotal(closingCount);
    const expectedAmount = this.currentDrawer.openingCount.total + this.currentDrawer.expectedAmount;
    const variance = actualAmount - expectedAmount;
    const variancePercentage = expectedAmount > 0 ? (variance / expectedAmount) * 100 : 0;

    const closedDrawer = {
      ...this.currentDrawer,
      status: 'closed',
      closeTime,
      closingCount: {
        ...closingCount,
        total: actualAmount
      },
      actualAmount,
      variance,
      variancePercentage,
      notes: notes || this.currentDrawer.notes,
      closedAt: new Date()
    };

    // Update in IndexedDB
    await indexedDBManager.update('cashDrawers', closedDrawer);

    // Log variance if significant
    if (Math.abs(variance) > 0.01) { // More than 1 cent variance
      await this.logCashVariance(closedDrawer);
    }

    // Add to sync queue
    await indexedDBManager.addToSyncQueue(
      'cashDrawer',
      closedDrawer.id,
      'update',
      closedDrawer,
      90
    );

    console.log(`💰 Cash drawer closed: Expected $${expectedAmount.toFixed(2)}, Actual $${actualAmount.toFixed(2)}`);
    if (Math.abs(variance) > 0.01) {
      console.log(`⚠️ Cash variance: $${variance.toFixed(2)} (${variancePercentage.toFixed(2)}%)`);
    }

    // Reset current drawer
    this.currentDrawer = null;
    this.isDrawerOpen = false;

    return closedDrawer;
  }

  /**
   * Record cash transaction
   */
  async recordCashTransaction(transactionId, amount, type = 'sale') {
    if (!this.currentDrawer || this.currentDrawer.status !== 'open') {
      console.warn('No open cash drawer - transaction not recorded');
      return;
    }

    const cashMovement = {
      id: `CASH_${transactionId}_${Date.now()}`,
      transactionId,
      amount,
      type, // 'sale', 'refund', 'cash_in', 'cash_out'
      timestamp: new Date(),
      operatorId: this.currentDrawer.operatorId,
      sessionId: this.currentDrawer.sessionId
    };

    // Add to drawer's transaction list
    this.currentDrawer.transactions.push(cashMovement);
    this.currentDrawer.cashMovements.push(cashMovement);

    // Update expected amount
    if (type === 'sale' || type === 'cash_in') {
      this.currentDrawer.expectedAmount += amount;
    } else if (type === 'refund' || type === 'cash_out') {
      this.currentDrawer.expectedAmount -= amount;
    }

    // Update drawer in IndexedDB
    await indexedDBManager.update('cashDrawers', this.currentDrawer);

    // Save cash movement separately
    await indexedDBManager.add('cashMovements', cashMovement);

    console.log(`💵 Cash transaction recorded: ${type} $${amount.toFixed(2)}`);
  }

  /**
   * Add cash to drawer (manager override)
   */
  async addCash(amount, reason, operatorId) {
    if (!this.currentDrawer || this.currentDrawer.status !== 'open') {
      throw new Error('No open cash drawer');
    }

    const cashMovement = {
      id: `CASH_ADD_${Date.now()}`,
      transactionId: null,
      amount,
      type: 'cash_in',
      reason,
      operatorId,
      timestamp: new Date(),
      sessionId: this.currentDrawer.sessionId,
      isOverride: true
    };

    this.currentDrawer.cashMovements.push(cashMovement);
    this.currentDrawer.expectedAmount += amount;

    await indexedDBManager.update('cashDrawers', this.currentDrawer);
    await indexedDBManager.add('cashMovements', cashMovement);

    console.log(`💰 Cash added: $${amount.toFixed(2)} - ${reason}`);
  }

  /**
   * Remove cash from drawer (manager override)
   */
  async removeCash(amount, reason, operatorId) {
    if (!this.currentDrawer || this.currentDrawer.status !== 'open') {
      throw new Error('No open cash drawer');
    }

    const cashMovement = {
      id: `CASH_REMOVE_${Date.now()}`,
      transactionId: null,
      amount,
      type: 'cash_out',
      reason,
      operatorId,
      timestamp: new Date(),
      sessionId: this.currentDrawer.sessionId,
      isOverride: true
    };

    this.currentDrawer.cashMovements.push(cashMovement);
    this.currentDrawer.expectedAmount -= amount;

    await indexedDBManager.update('cashDrawers', this.currentDrawer);
    await indexedDBManager.add('cashMovements', cashMovement);

    console.log(`💰 Cash removed: $${amount.toFixed(2)} - ${reason}`);
  }

  /**
   * Get current drawer status
   */
  getCurrentDrawer() {
    return this.currentDrawer;
  }

  /**
   * Check if drawer is open
   */
  isDrawerCurrentlyOpen() {
    return this.isDrawerOpen && this.currentDrawer?.status === 'open';
  }

  /**
   * Get drawer history
   */
  async getDrawerHistory(limit = 50, offset = 0) {
    const allDrawers = await indexedDBManager.getAll('cashDrawers');
    
    const sortedDrawers = allDrawers
      .sort((a, b) => new Date(b.openTime) - new Date(a.openTime))
      .slice(offset, offset + limit);

    return sortedDrawers;
  }

  /**
   * Get cash variance report
   */
  async getCashVarianceReport(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const allDrawers = await indexedDBManager.getAll('cashDrawers');
    
    const recentDrawers = allDrawers.filter(drawer => 
      drawer.status === 'closed' && 
      new Date(drawer.closeTime) >= cutoffDate
    );

    const report = {
      period: `${days} days`,
      totalDrawers: recentDrawers.length,
      totalVariance: recentDrawers.reduce((sum, drawer) => sum + drawer.variance, 0),
      averageVariance: 0,
      varianceCount: {
        over: recentDrawers.filter(d => d.variance > 0.01).length,
        under: recentDrawers.filter(d => d.variance < -0.01).length,
        exact: recentDrawers.filter(d => Math.abs(d.variance) <= 0.01).length
      },
      largestOverage: 0,
      largestShortage: 0,
      operators: {}
    };

    if (report.totalDrawers > 0) {
      report.averageVariance = report.totalVariance / report.totalDrawers;
      
      const variances = recentDrawers.map(d => d.variance);
      report.largestOverage = Math.max(...variances, 0);
      report.largestShortage = Math.min(...variances, 0);

      // Calculate variance by operator
      recentDrawers.forEach(drawer => {
        if (!report.operators[drawer.operatorId]) {
          report.operators[drawer.operatorId] = {
            totalVariance: 0,
            drawerCount: 0,
            averageVariance: 0
          };
        }
        report.operators[drawer.operatorId].totalVariance += drawer.variance;
        report.operators[drawer.operatorId].drawerCount += 1;
      });

      // Calculate averages
      Object.keys(report.operators).forEach(operatorId => {
        const op = report.operators[operatorId];
        op.averageVariance = op.totalVariance / op.drawerCount;
      });
    }

    return report;
  }

  /**
   * Log cash variance for audit
   */
  async logCashVariance(drawer) {
    const varianceLog = {
      id: `VAR_${drawer.id}_${Date.now()}`,
      drawerId: drawer.id,
      sessionId: drawer.sessionId,
      operatorId: drawer.operatorId,
      expectedAmount: drawer.openingCount.total + drawer.expectedAmount,
      actualAmount: drawer.actualAmount,
      variance: drawer.variance,
      variancePercentage: drawer.variancePercentage,
      timestamp: new Date(),
      severity: Math.abs(drawer.variance) > 10 ? 'high' : Math.abs(drawer.variance) > 1 ? 'medium' : 'low'
    };

    await indexedDBManager.add('cashVarianceLogs', varianceLog);

    // Add to sync queue for immediate head office notification
    await indexedDBManager.addToSyncQueue(
      'cashVariance',
      varianceLog.id,
      'create',
      varianceLog,
      95 // Highest priority for cash variances
    );
  }

  /**
   * Calculate total from cash count object
   */
  calculateTotal(cashCount) {
    const denominations = {
      // Bills
      '100': 100.00,
      '50': 50.00,
      '20': 20.00,
      '10': 10.00,
      '5': 5.00,
      '1': 1.00,
      // Coins
      '0.50': 0.50,
      '0.25': 0.25,
      '0.10': 0.10,
      '0.05': 0.05,
      '0.01': 0.01
    };

    let total = 0;
    Object.keys(cashCount).forEach(denomination => {
      if (denominations[denomination]) {
        total += cashCount[denomination] * denominations[denomination];
      }
    });

    return total;
  }

  /**
   * Generate unique drawer ID
   */
  generateDrawerId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `DRAWER_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Get cash drawer statistics
   */
  async getDrawerStats() {
    const allDrawers = await indexedDBManager.getAll('cashDrawers');
    const allMovements = await indexedDBManager.getAll('cashMovements');
    
    const stats = {
      totalDrawers: allDrawers.length,
      openDrawers: allDrawers.filter(d => d.status === 'open').length,
      closedDrawers: allDrawers.filter(d => d.status === 'closed').length,
      totalCashMovements: allMovements.length,
      totalVariance: allDrawers.reduce((sum, d) => sum + (d.variance || 0), 0),
      averageVariance: 0,
      perfectDrawers: allDrawers.filter(d => Math.abs(d.variance || 0) <= 0.01).length
    };

    if (stats.closedDrawers > 0) {
      const closedDrawers = allDrawers.filter(d => d.status === 'closed');
      stats.averageVariance = closedDrawers.reduce((sum, d) => sum + (d.variance || 0), 0) / closedDrawers.length;
    }

    return stats;
  }

  /**
   * Validate cash count format
   */
  validateCashCount(cashCount) {
    const validDenominations = ['100', '50', '20', '10', '5', '1', '0.50', '0.25', '0.10', '0.05', '0.01'];
    
    for (const denomination of Object.keys(cashCount)) {
      if (!validDenominations.includes(denomination)) {
        throw new Error(`Invalid denomination: ${denomination}`);
      }
      
      if (typeof cashCount[denomination] !== 'number' || cashCount[denomination] < 0) {
        throw new Error(`Invalid count for ${denomination}: must be non-negative number`);
      }
    }
    
    return true;
  }
}

// Export singleton instance
const cashDrawerManager = new CashDrawerManager();
export default cashDrawerManager;
