import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context
const ActiveOperationContext = createContext();

// Custom hook to use the context
export const useActiveOperation = () => {
  const context = useContext(ActiveOperationContext);
  if (!context) {
    throw new Error('useActiveOperation must be used within an ActiveOperationProvider');
  }
  return context;
};

// Provider component
export const ActiveOperationProvider = ({ children }) => {
  const [activeOperations, setActiveOperations] = useState(new Set());

  // Operation types that should prevent location switching
  const OPERATION_TYPES = {
    BILLING: 'billing',
    ITEM_ENTRY: 'item_entry',
    CUSTOMER_ENTRY: 'customer_entry',
    PAYMENT_PROCESSING: 'payment_processing',
    ORDER_MODIFICATION: 'order_modification',
    INVENTORY_ADJUSTMENT: 'inventory_adjustment',
    DATA_ENTRY: 'data_entry',
  };

  // Start an active operation
  const startOperation = useCallback((operationType, details = {}) => {
    setActiveOperations(prev => {
      const newSet = new Set(prev);
      newSet.add({
        type: operationType,
        details,
        startTime: Date.now(),
      });
      return newSet;
    });
  }, []);

  // End an active operation
  const endOperation = useCallback((operationType) => {
    setActiveOperations(prev => {
      const newSet = new Set(prev);
      // Remove operations of this type
      for (const operation of newSet) {
        if (operation.type === operationType) {
          newSet.delete(operation);
        }
      }
      return newSet;
    });
  }, []);

  // Check if any operation is active
  const hasActiveOperation = useCallback(() => {
    return activeOperations.size > 0;
  }, [activeOperations]);

  // Check if a specific operation type is active
  const isOperationActive = useCallback((operationType) => {
    for (const operation of activeOperations) {
      if (operation.type === operationType) {
        return true;
      }
    }
    return false;
  }, [activeOperations]);

  // Get active operations count
  const getActiveOperationsCount = useCallback(() => {
    return activeOperations.size;
  }, [activeOperations]);

  // Get list of active operation types
  const getActiveOperationTypes = useCallback(() => {
    return Array.from(activeOperations).map(op => op.type);
  }, [activeOperations]);

  // Clear all operations (emergency use)
  const clearAllOperations = useCallback(() => {
    setActiveOperations(new Set());
  }, []);

  const value = {
    // State
    activeOperations,
    
    // Constants
    OPERATION_TYPES,
    
    // Methods
    startOperation,
    endOperation,
    hasActiveOperation,
    isOperationActive,
    getActiveOperationsCount,
    getActiveOperationTypes,
    clearAllOperations,
  };

  return (
    <ActiveOperationContext.Provider value={value}>
      {children}
    </ActiveOperationContext.Provider>
  );
};

export default ActiveOperationContext;
