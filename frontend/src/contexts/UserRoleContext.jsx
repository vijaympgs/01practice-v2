import React, { createContext, useContext, useState, useEffect } from 'react';

const UserRoleContext = createContext();

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('store_manager');
  const [availableRoles] = useState([
    {
      id: 'sales_manager',
      name: 'Sales Manager',
      description: 'Revenue trends, top products, team performance',
      color: 'primary',
    },
    {
      id: 'store_manager',
      name: 'Store Manager',
      description: 'Daily targets, inventory alerts, staff schedules',
      color: 'success',
    },
    {
      id: 'cashier',
      name: 'Cashier',
      description: 'Quick sales, customer lookup, transaction history',
      color: 'info',
    },
    {
      id: 'inventory_manager',
      name: 'Inventory Manager',
      description: 'Stock levels, reorder alerts, supplier performance',
      color: 'warning',
    },
  ]);

  // Load user role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole && availableRoles.find(role => role.id === savedRole)) {
      setUserRole(savedRole);
    }
  }, [availableRoles]);

  // Save user role to localStorage when changed
  const changeUserRole = (newRole) => {
    if (availableRoles.find(role => role.id === newRole)) {
      setUserRole(newRole);
      localStorage.setItem('userRole', newRole);
    }
  };

  const getCurrentRole = () => {
    return availableRoles.find(role => role.id === userRole) || availableRoles[1];
  };

  const value = {
    userRole,
    availableRoles,
    changeUserRole,
    getCurrentRole,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};

