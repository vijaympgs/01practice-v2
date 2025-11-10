/**
 * OptiMind Retail™ POS System - Session Manager
 * 
 * Handles session management operations:
 * - Session creation and management
 * - Session status monitoring
 * - Session reporting and analytics
 * - Session validation and health checks
 * - Multi-terminal session support
 * - Settlement validation
 * - Business rule enforcement
 */

import indexedDBManager from './IndexedDBManager.js';
import transactionManager from './TransactionManager.js';

class SessionManager {
  constructor() {
    this.isInitialized = false;
    this.currentSession = null;
    this.sessionHistory = [];
    this.sessionSettings = {
      maxSessionDuration: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
      autoCloseAfterInactivity: 60 * 60 * 1000, // 1 hour in milliseconds
      allowMultipleSessions: true,
      requireSessionApproval: false,
      sessionTimeout: 30 * 60 * 1000 // 30 minutes in milliseconds
    };
  }

  /**
   * Initialize session manager
   */
  async initialize() {
    try {
      await indexedDBManager.initialize();
      await this.loadSessionConfiguration();
      this.isInitialized = true;
      console.log('✅ Session Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Session Manager:', error);
      throw error;
    }
  }

  /**
   * Load session configuration from IndexedDB
   */
  async loadSessionConfiguration() {
    try {
      const session = await indexedDBManager.get('session', 'current');
      if (session) {
        this.currentSession = session;
      }
      
      // Load session history
      const history = await indexedDBManager.getAll('sessionHistory');
      this.sessionHistory = history || [];
    } catch (error) {
      console.log('No existing session configuration found, will create new one');
    }
  }

  /**
   * Create new session
   */
  async createSession(sessionData) {
    try {
      // Check if there's an active session for the same terminal
      if (this.currentSession && this.currentSession.status === 'active' && 
          this.currentSession.terminalId === sessionData.terminalId) {
        throw new Error('Cannot create new session while another session is active on this terminal');
      }

      const session = {
        id: `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: sessionData.name || `Session ${new Date().toLocaleDateString()}`,
        terminalId: sessionData.terminalId || null,
        locationId: sessionData.locationId || null,
        companyId: sessionData.companyId || null,
        operatorId: sessionData.operatorId || null,
        operatorName: sessionData.operatorName || 'Unknown',
        shiftId: sessionData.shiftId || null,
        startTime: new Date(),
        endTime: null,
        status: 'active',
        sessionType: sessionData.sessionType || 'regular',
        openingCash: sessionData.openingCash || 0,
        closingCash: null,
        expectedCash: sessionData.openingCash || 0,
        actualCash: null,
        cashDifference: null,
        totalSales: 0,
        totalTransactions: 0,
        totalRefunds: 0,
        totalVoidTransactions: 0,
        totalDiscounts: 0,
        totalTaxes: 0,
        paymentMethods: {
          cash: 0,
          card: 0,
          digital: 0,
          other: 0
        },
        settings: {
          maxSessionDuration: this.sessionSettings.maxSessionDuration,
          autoCloseAfterInactivity: this.sessionSettings.autoCloseAfterInactivity,
          allowMultipleSessions: this.sessionSettings.allowMultipleSessions,
          requireSessionApproval: this.sessionSettings.requireSessionApproval,
          sessionTimeout: this.sessionSettings.sessionTimeout
        },
        lastActivity: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await indexedDBManager.upsert('session', session);
      this.currentSession = session;
      
      console.log('✅ Session created:', session.id);
      return session;
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      throw error;
    }
  }

  /**
   * Close current session
   */
  async closeSession(sessionData) {
    try {
      if (!this.currentSession || this.currentSession.status !== 'active') {
        throw new Error('No active session to close');
      }

      // Determine settlement status
      // If settlement is completed, mark as completed; otherwise mark as pending
      const settlementStatus = sessionData.settlementCompleted ? 'completed' : 'pending';
      const totalExpectedCash = Number(sessionData.totalExpectedCash ?? this.currentSession.expectedCash ?? 0);
      const totalCountedCash = Number(sessionData.totalCountedCash ?? sessionData.closingCash ?? 0);

      const updatedSession = {
        ...this.currentSession,
        endTime: new Date(),
        status: 'closed',
        closingCash: totalCountedCash,
        actualCash: totalCountedCash,
        expectedCash: totalExpectedCash,
        cashDifference: totalCountedCash - totalExpectedCash,
        settlement_status: settlementStatus,
        settlementData: sessionData.settlementData || null,
        interimSettlements: sessionData.interimSettlements || [],
        updatedAt: new Date()
      };

      // Move to history
      await indexedDBManager.upsert('sessionHistory', updatedSession);
      
      // Clear current session
      await indexedDBManager.clearStore('session');
      this.currentSession = null;
      
      console.log('✅ Session closed:', updatedSession.id, 'Settlement:', settlementStatus);
      return updatedSession;
    } catch (error) {
      console.error('❌ Failed to close session:', error);
      throw error;
    }
  }

  /**
   * Update session data
   */
  async updateSession(updateData) {
    try {
      if (!this.currentSession) {
        throw new Error('No active session to update');
      }

      const updatedSession = {
        ...this.currentSession,
        ...updateData,
        lastActivity: new Date(),
        updatedAt: new Date()
      };

      await indexedDBManager.upsert('session', updatedSession);
      this.currentSession = updatedSession;
      
      console.log('✅ Session updated');
      return updatedSession;
    } catch (error) {
      console.error('❌ Failed to update session:', error);
      throw error;
    }
  }

  /**
   * Update session activity
   */
  async updateSessionActivity() {
    try {
      if (this.currentSession) {
        await this.updateSession({
          lastActivity: new Date()
        });
      }
    } catch (error) {
      console.error('❌ Failed to update session activity:', error);
    }
  }

  /**
   * Get current session
   */
  getCurrentSession() {
    return this.currentSession;
  }

  /**
   * Get session history
   */
  async getSessionHistory(limit = 50) {
    try {
      const history = await indexedDBManager.getAll('sessionHistory');
      this.sessionHistory = history || [];
      return this.sessionHistory.slice(0, limit);
    } catch (error) {
      console.error('❌ Failed to get session history:', error);
      return [];
    }
  }

  /**
   * Get session statistics
   */
  async getSessionStatistics() {
    try {
      const history = await this.getSessionHistory();
      
      const stats = {
        totalSessions: history.length,
        activeSessions: this.currentSession ? 1 : 0,
        averageSessionDuration: 0,
        totalSales: 0,
        totalTransactions: 0,
        totalRefunds: 0,
        totalVoidTransactions: 0,
        totalDiscounts: 0,
        totalTaxes: 0,
        averageCashDifference: 0,
        sessionsByType: {},
        sessionsByOperator: {},
        sessionsByTerminal: {},
        paymentMethodStats: {
          cash: 0,
          card: 0,
          digital: 0,
          other: 0
        }
      };

      if (history.length > 0) {
        let totalDuration = 0;
        let totalCashDiff = 0;
        
        history.forEach(session => {
          if (session.endTime) {
            const duration = new Date(session.endTime) - new Date(session.startTime);
            totalDuration += duration;
          }
          
          totalSales += session.totalSales || 0;
          totalTransactions += session.totalTransactions || 0;
          totalRefunds += session.totalRefunds || 0;
          totalVoidTransactions += session.totalVoidTransactions || 0;
          totalDiscounts += session.totalDiscounts || 0;
          totalTaxes += session.totalTaxes || 0;
          
          if (session.cashDifference !== null) {
            totalCashDiff += session.cashDifference;
          }
          
          // Count by type
          stats.sessionsByType[session.sessionType] = (stats.sessionsByType[session.sessionType] || 0) + 1;
          
          // Count by operator
          stats.sessionsByOperator[session.operatorName] = (stats.sessionsByOperator[session.operatorName] || 0) + 1;
          
          // Count by terminal
          stats.sessionsByTerminal[session.terminalId] = (stats.sessionsByTerminal[session.terminalId] || 0) + 1;
          
          // Payment method stats
          if (session.paymentMethods) {
            stats.paymentMethodStats.cash += session.paymentMethods.cash || 0;
            stats.paymentMethodStats.card += session.paymentMethods.card || 0;
            stats.paymentMethodStats.digital += session.paymentMethods.digital || 0;
            stats.paymentMethodStats.other += session.paymentMethods.other || 0;
          }
        });
        
        stats.averageSessionDuration = totalDuration / history.length;
        stats.averageCashDifference = totalCashDiff / history.length;
      }

      return stats;
    } catch (error) {
      console.error('❌ Failed to get session statistics:', error);
      return null;
    }
  }

  /**
   * Validate session
   */
  async validateSession() {
    try {
      const validation = {
        isValid: true,
        errors: [],
        warnings: []
      };

      if (!this.currentSession) {
        validation.isValid = false;
        validation.errors.push('No active session');
        return validation;
      }

      // Check session duration
      const now = new Date();
      const sessionDuration = now - new Date(this.currentSession.startTime);
      
      if (sessionDuration > this.sessionSettings.maxSessionDuration) {
        validation.warnings.push('Session duration exceeds maximum allowed time');
      }

      // Check if session is overdue
      if (sessionDuration > this.sessionSettings.maxSessionDuration * 1.5) {
        validation.errors.push('Session is significantly overdue');
        validation.isValid = false;
      }

      // Check session inactivity
      const inactivityDuration = now - new Date(this.currentSession.lastActivity);
      if (inactivityDuration > this.sessionSettings.autoCloseAfterInactivity) {
        validation.warnings.push('Session has been inactive for too long');
      }

      // Check cash difference
      if (this.currentSession.cashDifference !== null) {
        if (Math.abs(this.currentSession.cashDifference) > 100) {
          validation.warnings.push('Significant cash difference detected');
        }
      }

      return validation;
    } catch (error) {
      console.error('❌ Session validation failed:', error);
      throw error;
    }
  }

  /**
   * Get session status
   */
  getSessionStatus() {
    return {
      isInitialized: this.isInitialized,
      hasActiveSession: !!this.currentSession,
      sessionId: this.currentSession?.id || null,
      sessionStatus: this.currentSession?.status || 'inactive',
      sessionDuration: this.currentSession ? 
        new Date() - new Date(this.currentSession.startTime) : 0,
      operatorName: this.currentSession?.operatorName || null,
      terminalId: this.currentSession?.terminalId || null,
      totalSales: this.currentSession?.totalSales || 0,
      totalTransactions: this.currentSession?.totalTransactions || 0,
      lastActivity: this.currentSession?.lastActivity || null
    };
  }

  /**
   * Clear session configuration
   */
  async clearSessionConfiguration() {
    try {
      await indexedDBManager.clearStore('session');
      await indexedDBManager.clearStore('sessionHistory');
      this.currentSession = null;
      this.sessionHistory = [];
      console.log('🗑️ Session configuration cleared');
    } catch (error) {
      console.error('❌ Failed to clear session configuration:', error);
      throw error;
    }
  }

  /**
   * Get sessions by terminal
   */
  async getSessionsByTerminal(terminalId) {
    try {
      const history = await this.getSessionHistory();
      return history.filter(session => session.terminalId === terminalId);
    } catch (error) {
      console.error('❌ Failed to get sessions by terminal:', error);
      return [];
    }
  }

  /**
   * Get sessions by operator
   */
  async getSessionsByOperator(operatorId) {
    try {
      const history = await this.getSessionHistory();
      return history.filter(session => session.operatorId === operatorId);
    } catch (error) {
      console.error('❌ Failed to get sessions by operator:', error);
      return [];
    }
  }

  /**
   * Get sessions by location
   */
  async getSessionsByLocation(locationId) {
    try {
      const history = await this.getSessionHistory();
      return history.filter(session => session.locationId === locationId);
    } catch (error) {
      console.error('❌ Failed to get sessions by location:', error);
      return [];
    }
  }

  /**
   * ============================================
   * BUSINESS RULE VALIDATION FUNCTIONS
   * ============================================
   */

  /**
   * Check for suspended bills in session
   */
  async checkSuspendedBills(sessionId) {
    try {
      // Initialize transaction manager if not already done
      if (!transactionManager.initialized) {
        await transactionManager.initialize();
      }

      const suspendedTransactions = await transactionManager.getSuspendedTransactions();
      const sessionSuspendedBills = suspendedTransactions.filter(t => 
        t.sessionId === sessionId
      );

      return sessionSuspendedBills;
    } catch (error) {
      console.error('❌ Failed to check suspended bills:', error);
      return [];
    }
  }

  /**
   * Check for partial transactions in session
   */
  async checkPartialTransactions(sessionId) {
    try {
      // Initialize transaction manager if not already done
      if (!transactionManager.initialized) {
        await transactionManager.initialize();
      }

      const transactions = await transactionManager.getTransactions({ sessionId });
      const partialTransactions = transactions.filter(t => 
        t.status === 'partial' || 
        t.status === 'pending' ||
        (t.cart && t.cart.length === 0) || // Empty cart
        (t.total && t.total === 0) // Zero amount
      );

      return partialTransactions;
    } catch (error) {
      console.error('❌ Failed to check partial transactions:', error);
      return [];
    }
  }

  /**
   * Validate settlement pre-conditions
   * Settlement is allowed only if there are no pending transactions
   * e.g. Any Suspended bills, Partial Transaction etc
   */
  async validateSettlement(sessionId) {
    try {
      const validationResult = {
        allowed: true,
        reason: null,
        details: {
          suspendedBills: [],
          partialTransactions: []
        }
      };

      // Check for suspended bills
      const suspendedBills = await this.checkSuspendedBills(sessionId);
      if (suspendedBills.length > 0) {
        validationResult.allowed = false;
        validationResult.reason = 'Suspended bills pending';
        validationResult.details.suspendedBills = suspendedBills;
        return validationResult;
      }

      // Check for partial transactions
      const partialTransactions = await this.checkPartialTransactions(sessionId);
      if (partialTransactions.length > 0) {
        validationResult.allowed = false;
        validationResult.reason = 'Partial transactions pending';
        validationResult.details.partialTransactions = partialTransactions;
        return validationResult;
      }

      return validationResult;
    } catch (error) {
      console.error('❌ Settlement validation failed:', error);
      return {
        allowed: false,
        reason: 'Validation error',
        error: error.message
      };
    }
  }

  /**
   * Get last session for a terminal
   */
  async getLastSession(terminalId) {
    try {
      const history = await this.getSessionHistory();
      const terminalSessions = history
        .filter(s => s.terminalId === terminalId)
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      
      return terminalSessions.length > 0 ? terminalSessions[0] : null;
    } catch (error) {
      console.error('❌ Failed to get last session:', error);
      return null;
    }
  }

  /**
   * Get session settlement status
   */
  async getSessionSettlement(sessionId) {
    try {
      const session = await indexedDBManager.get('sessionHistory', sessionId);
      if (!session) {
        return { isCompleted: false };
      }

      // Check if session has settlement data
      const hasSettlement = session.settlement && session.settlement.isCompleted;
      
      return {
        isCompleted: hasSettlement || false,
        settlement: session.settlement || null,
        session: session
      };
    } catch (error) {
      console.error('❌ Failed to get session settlement:', error);
      return { isCompleted: false };
    }
  }

  /**
   * Validate if session can be started
   * A session is allowed to start only if previous session has completed settlement
   */
  async canStartSession(terminalId, userId) {
    try {
      const validationResult = {
        allowed: true,
        reason: null,
        message: null,
        activeSession: null,
        pendingSettlement: null
      };

      // Check if there's an active session
      const lastSession = await this.getLastSession(terminalId);
      if (lastSession && lastSession.status === 'active') {
        validationResult.allowed = false;
        validationResult.reason = 'Active session exists';
        validationResult.message = 'You must close the current session before starting a new one';
        validationResult.activeSession = lastSession;
        return validationResult;
      }

      // Check if previous session has pending settlement
      if (lastSession && lastSession.status === 'closed') {
        // Check settlement_status field (new approach)
        if (lastSession.settlement_status === 'pending') {
          validationResult.allowed = false;
          validationResult.reason = 'Pending settlement';
          validationResult.message = 'You must complete the counter settlement for the previous session before starting a new one';
          validationResult.pendingSettlement = { 
            sessionId: lastSession.id,
            sessionNumber: lastSession.session_number || lastSession.id,
            status: 'pending'
          };
          return validationResult;
        }
        
        // Fallback to old settlement check
        const settlement = await this.getSessionSettlement(lastSession.id);
        if (!settlement.isCompleted) {
          validationResult.allowed = false;
          validationResult.reason = 'Pending settlement';
          validationResult.message = 'You must complete the counter settlement for the previous session before starting a new one';
          validationResult.pendingSettlement = settlement;
          return validationResult;
        }
      }

      return validationResult;
    } catch (error) {
      console.error('❌ Failed to validate session start:', error);
      return {
        allowed: false,
        reason: 'Validation error',
        message: error.message
      };
    }
  }

  /**
   * Validate if session can be closed
   * A Session is allowed to Close only after the Settlement by the User of that Counter
   */
  async canCloseSession(sessionId, userId) {
    try {
      const validationResult = {
        allowed: true,
        reason: null,
        message: null,
        details: null
      };

      // Get current session
      const session = this.currentSession;
      if (!session || session.id !== sessionId) {
        validationResult.allowed = false;
        validationResult.reason = 'Session not found';
        validationResult.message = 'Session not found or not active';
        return validationResult;
      }

      // 1. Check if user owns the session
      if (session.operatorId !== userId) {
        validationResult.allowed = false;
        validationResult.reason = 'Session ownership validation failed';
        validationResult.message = 'Only the user who started this session can close it';
        return validationResult;
      }

      // 2. Validate settlement pre-conditions
      const settlementValidation = await this.validateSettlement(sessionId);
      if (!settlementValidation.allowed) {
        validationResult.allowed = false;
        validationResult.reason = settlementValidation.reason;
        validationResult.details = settlementValidation.details;
        
        // Create user-friendly message
        if (settlementValidation.details.suspendedBills.length > 0) {
          validationResult.message = `Cannot close session. ${settlementValidation.details.suspendedBills.length} suspended bill(s) must be completed first`;
        } else if (settlementValidation.details.partialTransactions.length > 0) {
          validationResult.message = `Cannot close session. ${settlementValidation.details.partialTransactions.length} partial transaction(s) must be completed first`;
        } else {
          validationResult.message = 'Cannot close session due to pending transactions';
        }
        
        return validationResult;
      }

      return validationResult;
    } catch (error) {
      console.error('❌ Failed to validate session close:', error);
      return {
        allowed: false,
        reason: 'Validation error',
        message: error.message
      };
    }
  }

  /**
   * Update session with settlement data
   */
  async updateSessionSettlement(sessionId, settlementData) {
    try {
      const session = this.currentSession;
      if (!session || session.id !== sessionId) {
        throw new Error('Session not found');
      }

      const totalExpectedCash = Number(settlementData.totalExpectedCash ?? settlementData.expectedCash ?? session.expectedCash ?? 0);
      const totalCountedCash = Number(settlementData.totalCountedCash ?? settlementData.actualCash ?? session.closingCash ?? 0);
      const currentActualCash = Number(settlementData.currentActualCash ?? settlementData.actualCash ?? 0);
      const variance = Number(settlementData.variance ?? (totalCountedCash - totalExpectedCash));

      const updatedSession = {
        ...session,
        interimSettlements: settlementData.interimSettlements || session.interimSettlements || [],
        varianceReasonId: settlementData.varianceReasonId || session.varianceReasonId || null,
        settlement: {
          isCompleted: true,
          denominations: settlementData.denominations || {},
          interimSettlements: settlementData.interimSettlements || [],
          varianceReasonId: settlementData.varianceReasonId || null,
          totalExpectedCash,
          totalCountedCash,
          currentActualCash,
          variance,
          settledAt: new Date(),
          settledBy: settlementData.settledBy || session.operatorId
        },
        closingCash: totalCountedCash,
        actualCash: currentActualCash,
        expectedCash: totalExpectedCash,
        cashDifference: variance,
        updatedAt: new Date()
      };

      await indexedDBManager.upsert('session', updatedSession);
      this.currentSession = updatedSession;
      
      console.log('✅ Session settlement updated');
      return updatedSession;
    } catch (error) {
      console.error('❌ Failed to update session settlement:', error);
      throw error;
    }
  }
}

// Export singleton instance
const sessionManager = new SessionManager();
export default sessionManager;
