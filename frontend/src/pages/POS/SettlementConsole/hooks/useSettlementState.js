import { useState, useEffect, useCallback } from 'react';
import { currencyService } from '../../../../services/currencyService';
import transactionManager from '../../../../services/TransactionManager';
import shiftManager from '../../../../services/ShiftManager';
import sessionManager from '../../../../services/SessionManager';
import { businessRulesService } from '../../../../services/businessRulesService';
import salesService from '../../../../services/salesService';
import api from '../../../../services/api';

/**
 * Custom hook for managing settlement state
 * Handles all settlement operations, API calls, and state updates
 */
export const useSettlementState = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Settlement state
  const [settlement, setSettlement] = useState({
    id: '',
    sessionId: '',
    shiftId: '',
    cashierId: '',
    startTime: '',
    endTime: '',
    openingBalance: 0,
    closingBalance: 0,
    expectedCash: 0,
    actualCash: 0,
    difference: 0,
    status: 'pending', // pending, completed, verified
    notes: '',
    denominations: {
      '2000': { count: 0, amount: 0 },
      '500': { count: 0, amount: 0 },
      '200': { count: 0, amount: 0 },
      '100': { count: 0, amount: 0 },
      '50': { count: 0, amount: 0 },
      '20': { count: 0, amount: 0 },
      '10': { count: 0, amount: 0 },
      '5': { count: 0, amount: 0 },
      '2': { count: 0, amount: 0 },
      '1': { count: 0, amount: 0 },
    },
    transactions: [],
    refunds: [],
    adjustments: [],
  });
  
  // Additional state
  const [currentSession, setCurrentSession] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);
  const [settlementValidation, setSettlementValidation] = useState(null);
  const [settlementSettings, setSettlementSettings] = useState(null);

  // Initialize settlement on component mount
  useEffect(() => {
    initializeSettlement();
  }, []);

  const initializeSettlement = async () => {
    try {
      setLoading(true);
      
      // Load settlement settings
      try {
        const settings = await businessRulesService.getSettlementSettings();
        setSettlementSettings(settings);
      } catch (error) {
        console.error('Failed to load settlement settings:', error);
      }
      
      // Get current session from backend API
      let session = null;
      try {
        const response = await api.get('/sales/pos-sessions/current/');
        session = response.data;
      } catch (error) {
        // Fallback to localStorage
        session = sessionManager.getCurrentSession();
      }
      
      // Get shift
      const shift = shiftManager.getCurrentShift();
      
      if (session) {
        setCurrentSession(session);
        setCurrentShift(shift);
        
        // Validate settlement pre-conditions
        await validateSettlementPreConditions(session.id);
        
        // Initialize settlement
        const newSettlement = {
          id: Date.now().toString(),
          sessionId: session.id,
          shiftId: shift?.id || '',
          cashierId: session.operator?.id || session.operator_id || 'current_user',
          startTime: session.start_time || session.startTime || new Date().toISOString(),
          endTime: '',
          openingBalance: parseFloat(session.opening_cash || session.openingBalance || 0),
          closingBalance: 0,
          expectedCash: 0,
          actualCash: 0,
          difference: 0,
          status: 'pending',
          notes: '',
          denominations: {
            '2000': { count: 0, amount: 0 },
            '500': { count: 0, amount: 0 },
            '200': { count: 0, amount: 0 },
            '100': { count: 0, amount: 0 },
            '50': { count: 0, amount: 0 },
            '20': { count: 0, amount: 0 },
            '10': { count: 0, amount: 0 },
            '5': { count: 0, amount: 0 },
            '2': { count: 0, amount: 0 },
            '1': { count: 0, amount: 0 },
          },
          transactions: [],
          refunds: [],
          adjustments: [],
        };
        
        setSettlement(newSettlement);
        
        // Load transactions for this session
        await loadSessionTransactions(session.id);
      } else {
        console.warn('No active session found');
      }
      
    } catch (error) {
      console.error('Failed to initialize settlement:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateSettlementPreConditions = async (sessionId) => {
    try {
      const validation = await sessionManager.validateSettlement(sessionId);
      setSettlementValidation(validation);
      
      if (!validation.allowed) {
        const message = validation.details?.suspendedBills?.length > 0
          ? `Cannot proceed with settlement. ${validation.details.suspendedBills.length} suspended bill(s) must be completed first.`
          : validation.details?.partialTransactions?.length > 0
          ? `Cannot proceed with settlement. ${validation.details.partialTransactions.length} partial transaction(s) must be completed first.`
          : validation.reason || 'Cannot proceed with settlement due to pending transactions';
        
        console.warn(message);
      }
    } catch (error) {
      console.error('Failed to validate settlement:', error);
    }
  };

  const loadSessionTransactions = async (sessionId) => {
    try {
      // Try to load from backend API first
      let transactions = [];
      try {
        const response = await api.get('/sales/sales/', {
          params: {
            session: sessionId,
            page_size: 1000
          }
        });
        const sales = response.data.results || response.data || [];
        transactions = sales.map(sale => ({
          id: sale.id,
          saleNumber: sale.sale_number,
          total: parseFloat(sale.total_amount || 0),
          paymentMethod: sale.payment_method || 'cash',
          status: sale.status,
          createdAt: sale.created_at
        }));
      } catch (error) {
        // Fallback to transactionManager
        transactions = await transactionManager.getTransactions({ sessionId });
      }
      
      const cashTransactions = transactions.filter(t => 
        t.paymentMethod === 'cash' || t.payment_method === 'cash'
      );
      
      const expectedCash = cashTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
      
      setSettlement(prev => ({
        ...prev,
        transactions: transactions,
        expectedCash: expectedCash,
        closingBalance: prev.openingBalance + expectedCash,
      }));
    } catch (error) {
      console.error('Failed to load session transactions:', error);
    }
  };

  const updateSettlement = useCallback((updates) => {
    setSettlement(prev => ({ ...prev, ...updates }));
  }, []);

  const updateDenomination = useCallback((denomination, count) => {
    const sanitizedCount = Math.max(0, count);
    setSettlement(prev => {
      const updatedDenominations = {
        ...prev.denominations,
        [denomination]: {
          count: sanitizedCount,
          amount: parseInt(denomination, 10) * sanitizedCount,
        },
      };
      const totalCash = Object.values(updatedDenominations).reduce((sum, denom) => sum + denom.amount, 0);
      const difference = totalCash - prev.expectedCash;
      return {
        ...prev,
        denominations: updatedDenominations,
        actualCash: totalCash,
        difference,
      };
    });
  }, []);

  const addAdjustment = useCallback((adjustment) => {
    setSettlement(prev => ({
      ...prev,
      adjustments: [...prev.adjustments, adjustment],
    }));
  }, []);

  const removeAdjustment = useCallback((adjustmentId) => {
    setSettlement(prev => ({
      ...prev,
      adjustments: prev.adjustments.filter(a => a.id !== adjustmentId),
    }));
  }, []);

  const completeSettlement = useCallback(async () => {
    try {
      setSaving(true);
      
      // Validate settlement pre-conditions again before completing
      if (currentSession) {
        const validation = await sessionManager.validateSettlement(currentSession.id);
        if (!validation.allowed) {
          const message = validation.details?.suspendedBills?.length > 0
            ? `Cannot complete settlement. ${validation.details.suspendedBills.length} suspended bill(s) must be completed first.`
            : validation.details?.partialTransactions?.length > 0
            ? `Cannot complete settlement. ${validation.details.partialTransactions.length} partial transaction(s) must be completed first.`
            : validation.reason || 'Cannot complete settlement due to pending transactions';
          
          console.error(message);
          setSaving(false);
          return false;
        }
      }
      
      const completedSettlement = {
        ...settlement,
        endTime: new Date().toISOString(),
        status: 'completed',
      };
      
      // Close session with settlement data via backend API
      if (currentSession) {
        try {
          const settlementData = {
            closing_cash: settlement.actualCash,
            denominations: settlement.denominations,
            expected_cash: settlement.expectedCash,
            actual_cash: settlement.actualCash,
            variance: settlement.difference,
            adjustments: settlement.adjustments,
            notes: settlement.notes,
            settlement_completed: true
          };
          
          // Close session via API
          await api.post(`/sales/pos-sessions/${currentSession.id}/close/`, settlementData);
          
          // Also update local session manager
          await sessionManager.updateSessionSettlement(currentSession.id, {
            totalCash: settlement.actualCash,
            expectedCash: settlement.expectedCash,
            actualCash: settlement.actualCash,
            variance: settlement.difference,
            denominations: settlement.denominations,
            adjustments: settlement.adjustments
          });
        } catch (error) {
          console.error('Failed to close session via API:', error);
          // Fallback to localStorage
          await sessionManager.closeSession({
            closingCash: settlement.actualCash,
            settlementCompleted: true,
            settlementData: completedSettlement
          });
        }
      }
      
      // Save settlement to localStorage for history
      await saveSettlement(completedSettlement);
      
      // Update local state
      setSettlement(completedSettlement);
      
      console.log('Settlement completed successfully!');
      return true;
      
    } catch (error) {
      console.error('Failed to complete settlement:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
      console.error('Failed to complete settlement: ' + errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, [settlement, currentSession]);

  const saveSettlement = async (settlementData) => {
    try {
      // Save to localStorage for offline access
      const settlements = JSON.parse(localStorage.getItem('settlements') || '[]');
      settlements.push({
        ...settlementData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('settlements', JSON.stringify(settlements));
      
      console.log('Settlement saved to localStorage:', settlementData);
    } catch (error) {
      console.error('Failed to save settlement:', error);
      throw error;
    }
  };

  return {
    // State
    settlement,
    currentSession,
    currentShift,
    settlementValidation,
    settlementSettings,
    loading,
    saving,
    
    // Actions
    updateSettlement,
    updateDenomination,
    addAdjustment,
    removeAdjustment,
    completeSettlement,
    refreshSettlement: initializeSettlement,
    
    // Utilities
    formatCurrency: (amount) => currencyService.formatCurrency(amount, 'INR'),
    getCurrencySymbol: () => currencyService.getCurrencySymbol('INR'),
  };
};
