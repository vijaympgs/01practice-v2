/**
 * OptiMind Retail™ POS System - Access Control Manager
 * 
 * Handles user authentication, role-based access control, and session management:
 * - Operator authentication and authorization
 * - Role-based permissions
 * - Session management and security
 * - Access logging and audit trails
 * - Unauthorized access prevention
 */

import indexedDBManager from './IndexedDBManager.js';
import securityManager from './SecurityManager.js';

class AccessControlManager {
  constructor() {
    this.currentUser = null;
    this.currentSession = null;
    this.isInitialized = false;
    this.permissions = new Map();
  }

  /**
   * Initialize access control manager
   */
  async initialize() {
    try {
      await indexedDBManager.initialize();
      await securityManager.initialize();
      
      // Create default operator if none exists
      await this.createDefaultOperator();
      
      this.isInitialized = true;
      console.log('✅ Access Control Manager initialized');
      
      // Log initialization
      await this.logAccessEvent('ACCESS_INIT', 'Access control manager initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize Access Control Manager:', error);
      throw error;
    }
  }

  /**
   * Create default operator for testing
   */
  async createDefaultOperator() {
    try {
      const existingOperators = await indexedDBManager.getAll('operators');
      
      if (existingOperators.length === 0) {
        const defaultOperator = {
          id: 'operator_1',
          username: 'admin',
          password: await this.hashPassword('admin123'),
          name: 'Administrator',
          role: 'manager',
          permissions: ['all'],
          isActive: true,
          createdAt: new Date(),
          lastLogin: null
        };

        await indexedDBManager.add('operators', defaultOperator);
        console.log('✅ Created default operator: admin/admin123');
        
        // Log operator creation
        await this.logAccessEvent('OPERATOR_CREATED', 'Default operator created', {
          operatorId: defaultOperator.id,
          username: defaultOperator.username
        });
      }
    } catch (error) {
      console.error('❌ Failed to create default operator:', error);
      throw error;
    }
  }

  /**
   * Hash password using Web Crypto API
   */
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Authenticate operator
   */
  async authenticateOperator(username, password) {
    if (!this.isInitialized) {
      throw new Error('Access Control Manager not initialized');
    }

    try {
      const operators = await indexedDBManager.getAll('operators');
      const operator = operators.find(op => op.username === username && op.isActive);
      
      if (!operator) {
        await this.logAccessEvent('AUTH_FAILED', 'Authentication failed - user not found', { username });
        throw new Error('Invalid credentials');
      }

      const hashedPassword = await this.hashPassword(password);
      
      if (operator.password !== hashedPassword) {
        await this.logAccessEvent('AUTH_FAILED', 'Authentication failed - invalid password', { username });
        throw new Error('Invalid credentials');
      }

      // Update last login
      operator.lastLogin = new Date();
      await indexedDBManager.update('operators', operator);

      // Set current user
      this.currentUser = {
        id: operator.id,
        username: operator.username,
        name: operator.name,
        role: operator.role,
        permissions: operator.permissions
      };

      // Log successful authentication
      await this.logAccessEvent('AUTH_SUCCESS', 'Authentication successful', {
        operatorId: operator.id,
        username: operator.username,
        role: operator.role
      });

      console.log('✅ Operator authenticated:', operator.name);
      return this.currentUser;
      
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw error;
    }
  }

  /**
   * Start operator session
   */
  async startSession(operatorId, sessionType = 'pos') {
    try {
      const session = {
        id: `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        operatorId,
        sessionType,
        startTime: new Date(),
        endTime: null,
        status: 'active',
        cashDrawerOpen: false,
        transactionsCount: 0,
        totalSales: 0,
        notes: ''
      };

      await indexedDBManager.add('sessions', session);
      this.currentSession = session;

      // Log session start
      await this.logAccessEvent('SESSION_START', 'Operator session started', {
        sessionId: session.id,
        operatorId,
        sessionType
      });

      console.log('✅ Session started:', session.id);
      return session;
      
    } catch (error) {
      console.error('❌ Failed to start session:', error);
      throw error;
    }
  }

  /**
   * End operator session
   */
  async endSession(sessionId, notes = '') {
    try {
      const session = await indexedDBManager.get('sessions', sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }

      session.endTime = new Date();
      session.status = 'ended';
      session.notes = notes;

      await indexedDBManager.update('sessions', session);
      
      // Log session end
      await this.logAccessEvent('SESSION_END', 'Operator session ended', {
        sessionId: session.id,
        operatorId: session.operatorId,
        duration: session.endTime - session.startTime,
        transactionsCount: session.transactionsCount,
        totalSales: session.totalSales
      });

      console.log('✅ Session ended:', sessionId);
      return session;
      
    } catch (error) {
      console.error('❌ Failed to end session:', error);
      throw error;
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission) {
    if (!this.currentUser) {
      return false;
    }

    // Check if user has 'all' permissions
    if (this.currentUser.permissions.includes('all')) {
      return true;
    }

    // Check specific permission
    return this.currentUser.permissions.includes(permission);
  }

  /**
   * Require permission (throws error if not authorized)
   */
  requirePermission(permission) {
    if (!this.hasPermission(permission)) {
      throw new Error(`Access denied: Permission '${permission}' required`);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get current session
   */
  getCurrentSession() {
    return this.currentSession;
  }

  /**
   * Log access event
   */
  async logAccessEvent(eventType, description, metadata = {}) {
    const logEntry = {
      id: `ACCESS_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      eventType,
      description,
      metadata,
      timestamp: new Date(),
      operatorId: this.currentUser?.id || 'system',
      sessionId: this.currentSession?.id || null
    };

    // Save to IndexedDB
    await indexedDBManager.add('accessLogs', logEntry);
    
    console.log(`🔐 Access Event: ${eventType} - ${description}`);
  }

  /**
   * Get access audit log
   */
  async getAccessAuditLog(limit = 100) {
    const logs = await indexedDBManager.getAll('accessLogs');
    return logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get active sessions
   */
  async getActiveSessions() {
    const sessions = await indexedDBManager.getAll('sessions');
    return sessions.filter(session => session.status === 'active');
  }

  /**
   * Get session history
   */
  async getSessionHistory(operatorId = null, limit = 50) {
    let sessions = await indexedDBManager.getAll('sessions');
    
    if (operatorId) {
      sessions = sessions.filter(session => session.operatorId === operatorId);
    }
    
    return sessions
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit);
  }

  /**
   * Logout current user
   */
  async logout() {
    if (this.currentSession) {
      await this.endSession(this.currentSession.id, 'User logout');
    }

    // Log logout
    await this.logAccessEvent('LOGOUT', 'User logged out', {
      operatorId: this.currentUser?.id,
      sessionId: this.currentSession?.id
    });

    this.currentUser = null;
    this.currentSession = null;
    
    console.log('✅ User logged out');
  }

  /**
   * Get operator statistics
   */
  async getOperatorStats(operatorId) {
    const sessions = await this.getSessionHistory(operatorId);
    const accessLogs = await this.getAccessAuditLog();
    const operatorLogs = accessLogs.filter(log => log.operatorId === operatorId);
    
    return {
      totalSessions: sessions.length,
      totalTransactions: sessions.reduce((sum, session) => sum + session.transactionsCount, 0),
      totalSales: sessions.reduce((sum, session) => sum + session.totalSales, 0),
      averageSessionDuration: sessions.length > 0 ? 
        sessions.reduce((sum, session) => {
          const duration = session.endTime ? 
            new Date(session.endTime) - new Date(session.startTime) : 0;
          return sum + duration;
        }, 0) / sessions.length : 0,
      lastLogin: sessions.length > 0 ? sessions[0].startTime : null,
      accessEventsCount: operatorLogs.length
    };
  }

  /**
   * Clear access control data (for testing)
   */
  async clearAccessControlData() {
    await indexedDBManager.clearStore('operators');
    await indexedDBManager.clearStore('sessions');
    await indexedDBManager.clearStore('accessLogs');
    
    this.currentUser = null;
    this.currentSession = null;
    
    console.log('🗑️ Access control data cleared');
  }
}

// Export singleton instance
const accessControlManager = new AccessControlManager();
export default accessControlManager;
