import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Alert,
  Snackbar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../store/slices/customerSlice';
import SimpleCustomerForm from '../components/customers/SimpleCustomerForm';
import CustomerListEnhanced from '../components/customers/CustomerListEnhanced';
import QuickCustomerDialog from '../components/customers/QuickCustomerDialog';
import TestForm from '../components/test/TestForm';
import customerService from '../services/customerService';

const CustomersPage = () => {
  const dispatch = useDispatch();
  // Only subscribe to customers data, not loading/error to prevent re-renders during form operations
  const customers = useSelector(state => state.customers.customers);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [quickCustomerOpen, setQuickCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [testFormOpen, setTestFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddCustomer = useCallback(() => {
    setFormMode('create');
    setSelectedCustomer(null);
    setFormOpen(true);
  }, []);

  const handleAddQuickCustomer = useCallback(() => {
    setQuickCustomerOpen(true);
  }, []);

  const handleEditCustomer = useCallback((customer) => {
    setFormMode('edit');
    setSelectedCustomer(customer);
    setFormOpen(true);
  }, []);

  const handleViewCustomer = useCallback((customer) => {
    try {
      const formattedCustomer = customerService.formatCustomerForDisplay(customer);
      const summary = customerService.generateCustomerSummary ? 
        customerService.generateCustomerSummary(formattedCustomer) : 
        JSON.stringify(formattedCustomer, null, 2);
      
      // Show customer details in alert dialog
      alert(`Customer Details:\n\n${summary}`);
    } catch (error) {
      console.error('Error in handleViewCustomer:', error);
      alert(`Customer Details:\n\n${JSON.stringify(customer, null, 2)}`);
    }
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setSelectedCustomer(null);
    // Don't refresh on every close - only refresh when actually needed
    // dispatch(fetchCustomers());
  }, []);

  const handleCloseQuickCustomer = useCallback(() => {
    setQuickCustomerOpen(false);
  }, []);

  const handleSaveQuickCustomer = useCallback(async (customerData) => {
    setLoading(true);
    try {
      // Use the customer service to create the customer
      await customerService.createCustomer(customerData);
      setQuickCustomerOpen(false);
      showSnackbar('Customer created successfully!', 'success');
      dispatch(fetchCustomers()); // Refresh the list
    } catch (error) {
      console.error('Error creating customer:', error);
      showSnackbar('Failed to create customer. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 4, pb: 3 }}>
        {/* Enhanced Customer List */}
        <CustomerListEnhanced
          onAddCustomer={handleAddCustomer}
          onAddQuickCustomer={handleAddQuickCustomer}
          onEditCustomer={handleEditCustomer}
          onViewCustomer={handleViewCustomer}
        />

        {/* Test Form */}
        <TestForm
          open={testFormOpen}
          onClose={() => setTestFormOpen(false)}
        />

        {/* Simple Customer Form */}
        <SimpleCustomerForm
          open={formOpen}
          onClose={handleCloseForm}
          onSave={handleSaveQuickCustomer}
        />

        {/* Quick Customer Dialog */}
        <QuickCustomerDialog
          open={quickCustomerOpen}
          onClose={handleCloseQuickCustomer}
          onSave={handleSaveQuickCustomer}
          loading={loading}
        />

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default CustomersPage;
