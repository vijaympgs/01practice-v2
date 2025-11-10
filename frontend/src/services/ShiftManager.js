/**
 * OptiMind Retail™ POS System - Shift Manager
 * 
 * Handles shift management operations:
 * - Shift creation and management
 * - Shift status monitoring
 * - Shift reporting and analytics
 * - Shift validation and health checks
 * - Shift closure validation
 * - Business rule enforcement
 */

import indexedDBManager from './IndexedDBManager.js';
import sessionManager from './SessionManager.js';

class ShiftManager {
  constructor() {
    this.isInitialized = false;
    this.currentShift = null;
    this.shiftHistory = [];
    this.shiftSettings = {
      maxShiftDuration: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
      autoCloseAfterInactivity: 30 * 60 * 1000, // 30 minutes in milliseconds
      allowOverlappingShifts: false,
      requireShiftApproval: false
    };
  }

  /**
   * Initialize shift manager
   */
  async initialize() {
    try {
      await indexedDBManager.initialize();
      await this.loadShiftConfiguration();
      this.isInitialized = true;
      console.log('✅ Shift Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Shift Manager:', error);
      throw error;
    }
  }

  /**
   * Load shift configuration from IndexedDB
   */
  async loadShiftConfiguration() {
    try {
      const shift = await indexedDBManager.get('shift', 'current');
      if (shift) {
        this.currentShift = shift;
      }
      
      // Load shift history
      const history = await indexedDBManager.getAll('shiftHistory');
      this.shiftHistory = history || [];
    } catch (error) {
      console.log('No existing shift configuration found, will create new one');
    }
  }

  /**
   * Create new shift
   */
  async createShift(shiftData) {
    try {
      // Check if there's an active shift
      if (this.currentShift && this.currentShift.status === 'active') {
        throw new Error('Cannot create new shift while another shift is active');
      }

      const shift = {
        id: `SHIFT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: shiftData.name || `Shift ${new Date().toLocaleDateString()}`,
        terminalId: shiftData.terminalId || null,
        locationId: shiftData.locationId || null,
        companyId: shiftData.companyId || null,
        operatorId: shiftData.operatorId || null,
        operatorName: shiftData.operatorName || 'Unknown',
        startTime: new Date(),
        endTime: null,
        status: 'active',
        shiftType: shiftData.shiftType || 'regular',
        openingCash: shiftData.openingCash || 0,
        closingCash: null,
        expectedCash: shiftData.openingCash || 0,
        actualCash: null,
        cashDifference: null,
        totalSales: 0,
        totalTransactions: 0,
        totalRefunds: 0,
        totalVoidTransactions: 0,
        settings: {
          maxShiftDuration: this.shiftSettings.maxShiftDuration,
          autoCloseAfterInactivity: this.shiftSettings.autoCloseAfterInactivity,
          allowOverlappingShifts: this.shiftSettings.allowOverlappingShifts,
          requireShiftApproval: this.shiftSettings.requireShiftApproval
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await indexedDBManager.upsert('shift', shift);
      this.currentShift = shift;
      
      console.log('✅ Shift created:', shift.id);
      return shift;
    } catch (error) {
      console.error('❌ Failed to create shift:', error);
      throw error;
    }
  }

  /**
   * Close current shift
   */
  async closeShift(shiftData) {
    try {
      if (!this.currentShift || this.currentShift.status !== 'active') {
        throw new Error('No active shift to close');
      }

      const updatedShift = {
        ...this.currentShift,
        endTime: new Date(),
        status: 'closed',
        closingCash: shiftData.closingCash || 0,
        actualCash: shiftData.closingCash || 0,
        cashDifference: (shiftData.closingCash || 0) - this.currentShift.expectedCash,
        updatedAt: new Date()
      };

      // Move to history
      await indexedDBManager.upsert('shiftHistory', updatedShift);
      
      // Clear current shift
      await indexedDBManager.clearStore('shift');
      this.currentShift = null;
      
      console.log('✅ Shift closed:', updatedShift.id);
      return updatedShift;
    } catch (error) {
      console.error('❌ Failed to close shift:', error);
      throw error;
    }
  }

  /**
   * Update shift data
   */
  async updateShift(updateData) {
    try {
      if (!this.currentShift) {
        throw new Error('No active shift to update');
      }

      const updatedShift = {
        ...this.currentShift,
        ...updateData,
        updatedAt: new Date()
      };

      await indexedDBManager.upsert('shift', updatedShift);
      this.currentShift = updatedShift;
      
      console.log('✅ Shift updated');
      return updatedShift;
    } catch (error) {
      console.error('❌ Failed to update shift:', error);
      throw error;
    }
  }

  /**
   * Get current shift
   */
  getCurrentShift() {
    return this.currentShift;
  }

  /**
   * Get shift history
   */
  async getShiftHistory(limit = 50) {
    try {
      const history = await indexedDBManager.getAll('shiftHistory');
      this.shiftHistory = history || [];
      return this.shiftHistory.slice(0, limit);
    } catch (error) {
      console.error('❌ Failed to get shift history:', error);
      return [];
    }
  }

  /**
   * Get shift statistics
   */
  async getShiftStatistics() {
    try {
      const history = await this.getShiftHistory();
      
      const stats = {
        totalShifts: history.length,
        activeShifts: this.currentShift ? 1 : 0,
        averageShiftDuration: 0,
        totalSales: 0,
        totalTransactions: 0,
        totalRefunds: 0,
        totalVoidTransactions: 0,
        averageCashDifference: 0,
        shiftsByType: {},
        shiftsByOperator: {}
      };

      if (history.length > 0) {
        let totalDuration = 0;
        let totalCashDiff = 0;
        
        history.forEach(shift => {
          if (shift.endTime) {
            const duration = new Date(shift.endTime) - new Date(shift.startTime);
            totalDuration += duration;
          }
          
          totalSales += shift.totalSales || 0;
          totalTransactions += shift.totalTransactions || 0;
          totalRefunds += shift.totalRefunds || 0;
          totalVoidTransactions += shift.totalVoidTransactions || 0;
          
          if (shift.cashDifference !== null) {
            totalCashDiff += shift.cashDifference;
          }
          
          // Count by type
          stats.shiftsByType[shift.shiftType] = (stats.shiftsByType[shift.shiftType] || 0) + 1;
          
          // Count by operator
          stats.shiftsByOperator[shift.operatorName] = (stats.shiftsByOperator[shift.operatorName] || 0) + 1;
        });
        
        stats.averageShiftDuration = totalDuration / history.length;
        stats.averageCashDifference = totalCashDiff / history.length;
      }

      return stats;
    } catch (error) {
      console.error('❌ Failed to get shift statistics:', error);
      return null;
    }
  }

  /**
   * Validate shift
   */
  async validateShift() {
    try {
      const validation = {
        isValid: true,
        errors: [],
        warnings: []
      };

      if (!this.currentShift) {
        validation.isValid = false;
        validation.errors.push('No active shift');
        return validation;
      }

      // Check shift duration
      const now = new Date();
      const shiftDuration = now - new Date(this.currentShift.startTime);
      
      if (shiftDuration > this.shiftSettings.maxShiftDuration) {
        validation.warnings.push('Shift duration exceeds maximum allowed time');
      }

      // Check if shift is overdue
      if (shiftDuration > this.shiftSettings.maxShiftDuration * 1.5) {
        validation.errors.push('Shift is significantly overdue');
        validation.isValid = false;
      }

      // Check cash difference
      if (this.currentShift.cashDifference !== null) {
        if (Math.abs(this.currentShift.cashDifference) > 100) {
          validation.warnings.push('Significant cash difference detected');
        }
      }

      return validation;
    } catch (error) {
      console.error('❌ Shift validation failed:', error);
      throw error;
    }
  }

  /**
   * Get shift status
   */
  getShiftStatus() {
    return {
      isInitialized: this.isInitialized,
      hasActiveShift: !!this.currentShift,
      shiftId: this.currentShift?.id || null,
      shiftStatus: this.currentShift?.status || 'inactive',
      shiftDuration: this.currentShift ? 
        new Date() - new Date(this.currentShift.startTime) : 0,
      operatorName: this.currentShift?.operatorName || null,
      totalSales: this.currentShift?.totalSales || 0,
      totalTransactions: this.currentShift?.totalTransactions || 0
    };
  }

  /**
   * Clear shift configuration
   */
  async clearShiftConfiguration() {
    try {
      await indexedDBManager.clearStore('shift');
      await indexedDBManager.clearStore('shiftHistory');
      this.currentShift = null;
      this.shiftHistory = [];
      console.log('🗑️ Shift configuration cleared');
    } catch (error) {
      console.error('❌ Failed to clear shift configuration:', error);
      throw error;
    }
  }

  /**
   * ============================================
   * BUSINESS RULE VALIDATION FUNCTIONS
   * ============================================
   */

  /**
   * Get all sessions for a shift
   */
  async getShiftSessions(shiftId) {
    try {
      // Initialize session manager if not already done
      if (!sessionManager.isInitialized) {
        await sessionManager.initialize();
      }

      const history = await sessionManager.getSessionHistory();
      const shiftSessions = history.filter(s => s.shiftId === shiftId);
      
      return shiftSessions;
    } catch (error) {
      console.error('❌ Failed to get shift sessions:', error);
      return [];
    }
  }

  /**
   * Validate if shift can be closed
   * A Shift is allowed to Close only all the active Sessions are Closed
   */
  async canCloseShift(shiftId) {
    try {
      const validationResult = {
        allowed: true,
        reason: null,
        message: null,
        activeSessions: [],
        unsettledSessions: []
      };

      // Get all sessions in this shift
      const sessions = await this.getShiftSessions(shiftId);
      
      // Check if all sessions are closed
      const activeSessions = sessions.filter(s => s.status === 'active');
      if (activeSessions.length > 0) {
        validationResult.allowed = false;
        validationResult.reason = 'Active sessions exist';
        validationResult.message = `Cannot close shift. ${activeSessions.length} active session(s) must be closed first`;
        validationResult.activeSessions = activeSessions;
        return validationResult;
      }

      // Check if all sessions have completed settlement
      const sessionsWithoutSettlement = sessions.filter(s => {
        // A closed session must have settlement completed
        return s.status === 'closed' && (!s.settlement || !s.settlement.isCompleted);
      });

      if (sessionsWithoutSettlement.length > 0) {
        validationResult.allowed = false;
        validationResult.reason = 'Unsettled sessions exist';
        validationResult.message = `Cannot close shift. ${sessionsWithoutSettlement.length} session(s) need settlement`;
        validationResult.unsettledSessions = sessionsWithoutSettlement;
        return validationResult;
      }

      return validationResult;
    } catch (error) {
      console.error('❌ Failed to validate shift close:', error);
      return {
        allowed: false,
        reason: 'Validation error',
        message: error.message
      };
    }
  }

  /**
   * Validate if shift can be started
   */
  async canStartShift(terminalId, userId) {
    try {
      const validationResult = {
        allowed: true,
        reason: null,
        message: null,
        activeShift: null
      };

      // Check if there's an active shift
      if (this.currentShift && this.currentShift.status === 'active') {
        validationResult.allowed = false;
        validationResult.reason = 'Active shift exists';
        validationResult.message = 'You must close the current shift before starting a new one';
        validationResult.activeShift = this.currentShift;
        return validationResult;
      }

      return validationResult;
    } catch (error) {
      console.error('❌ Failed to validate shift start:', error);
      return {
        allowed: false,
        reason: 'Validation error',
        message: error.message
      };
    }
  }
}

// Export singleton instance
const shiftManager = new ShiftManager();
export default shiftManager;