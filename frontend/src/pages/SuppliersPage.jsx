import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Alert,
  Snackbar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuppliers } from '../store/slices/supplierSlice';
import SimpleVendorForm from '../components/suppliers/SimpleVendorForm';
import SupplierListEnhanced from '../components/suppliers/SupplierListEnhanced';
import QuickVendorDialog from '../components/suppliers/QuickVendorDialog';
import supplierService from '../services/supplierService';

const SuppliersPage = () => {
  const dispatch = useDispatch();
  // Only subscribe to suppliers data, not loading/error to prevent re-renders during form operations
  const suppliers = useSelector(state => state.suppliers.suppliers);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [quickVendorOpen, setQuickVendorOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddSupplier = useCallback(() => {
    setFormMode('create');
    setSelectedSupplier(null);
    setFormOpen(true);
  }, []);

  const handleAddQuickVendor = useCallback(() => {
    setQuickVendorOpen(true);
  }, []);

  const handleEditSupplier = useCallback((supplier) => {
    setFormMode('edit');
    setSelectedSupplier(supplier);
    setFormOpen(true);
  }, []);

  const handleViewSupplier = useCallback((supplier) => {
    const formattedSupplier = supplierService.formatSupplierForDisplay(supplier);
    const summary = supplierService.generateSupplierSummary(formattedSupplier);
    
    // Show supplier details in alert dialog
    alert(`Vendor Details:\n\n${summary}`);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setSelectedSupplier(null);
    // Don't refresh on every close - only refresh when actually needed
    // dispatch(fetchSuppliers());
  }, []);

  const handleCloseQuickVendor = useCallback(() => {
    setQuickVendorOpen(false);
  }, []);

  const handleSaveQuickVendor = useCallback(async (vendorData) => {
    setLoading(true);
    try {
      // Use the supplier service to create the vendor
      await supplierService.createSupplier(vendorData);
      setQuickVendorOpen(false);
      showSnackbar('Vendor created successfully!', 'success');
      dispatch(fetchSuppliers()); // Refresh the list
    } catch (error) {
      console.error('Error creating vendor:', error);
      showSnackbar('Failed to create vendor. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 5, pb: 3 }}>
        {/* Enhanced Vendor List */}
        <SupplierListEnhanced
          onAddSupplier={handleAddSupplier}
          onAddQuickVendor={handleAddQuickVendor}
          onEditSupplier={handleEditSupplier}
          onViewSupplier={handleViewSupplier}
        />

        {/* Simple Vendor Form */}
        <SimpleVendorForm
          open={formOpen}
          onClose={handleCloseForm}
          onSave={handleSaveQuickVendor}
        />

        {/* Quick Vendor Dialog */}
        <QuickVendorDialog
          open={quickVendorOpen}
          onClose={handleCloseQuickVendor}
          onSave={handleSaveQuickVendor}
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

export default SuppliersPage;




