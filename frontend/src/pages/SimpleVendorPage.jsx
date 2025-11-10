import React, { useState, useEffect } from 'react';
import api from '../services/api';
import themeService from '../services/themeService';
import PageTitle from '../components/common/PageTitle';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

const SimpleVendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [themeColor, setThemeColor] = useState('#1976d2');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalCredit: 0,
  });

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    vendor_type: '',
    credit_limit: '',
    payment_terms: 'Net 30',
    is_active: true,
  });

  useEffect(() => {
    loadVendors();
    
    // Load theme color
    const loadTheme = async () => {
      try {
        const theme = await themeService.getActiveTheme();
        if (theme && theme.primary_color) {
          setThemeColor(theme.primary_color);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Calculate stats
  useEffect(() => {
    const newStats = {
      total: vendors.length,
      active: vendors.filter(v => v.is_active).length,
      inactive: vendors.filter(v => !v.is_active).length,
      totalCredit: vendors.reduce((sum, v) => sum + (v.credit_limit || 0), 0)
    };
    setStats(newStats);
  }, [vendors]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/suppliers/');
      const vendorsData = response.data.results || response.data;
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error loading vendors:', error);
      setSnackbar({
        open: true,
        message: 'Error loading vendors. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.company_name || vendor.display_name,
      phone: vendor.phone || '',
      email: vendor.email || '',
      address: vendor.address_line_1 || '',
      vendor_type: vendor.supplier_type || 'Distributor',
      credit_limit: vendor.credit_limit || 0,
      payment_terms: vendor.payment_terms || 'net_30',
      is_active: vendor.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        setLoading(true);
        await api.delete(`/suppliers/${id}/`);
        setSnackbar({
          open: true,
          message: 'Vendor deleted successfully!',
          severity: 'success',
        });
        // Reload vendors
        await loadVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting vendor. Please try again.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Vendor name is required',
        severity: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API
      const vendorData = {
        company_name: formData.name,
        trade_name: formData.vendor_type || '',
        supplier_type: formData.vendor_type?.toLowerCase().replace(' ', '_') || 'distributor',
        phone: formData.phone,
        email: formData.email,
        address_line_1: formData.address,
        city: '',
        state: '',
        country: 'United States',
        credit_limit: parseFloat(formData.credit_limit) || 0,
        payment_terms: formData.payment_terms || 'net_30',
        is_active: formData.is_active,
        notes: ''
      };

      if (editingVendor) {
        // Update existing vendor
        await api.put(`/suppliers/${editingVendor.id}/`, vendorData);
        setSnackbar({
          open: true,
          message: 'Vendor updated successfully!',
          severity: 'success',
        });
      } else {
        // Add new vendor
        await api.post('/suppliers/', vendorData);
        setSnackbar({
          open: true,
          message: 'Vendor added successfully!',
          severity: 'success',
        });
      }

      // Reload vendors
      await loadVendors();
      setDialogOpen(false);
      setEditingVendor(null);
      
    } catch (error) {
      console.error('Error saving vendor:', error);
      setSnackbar({
        open: true,
        message: 'Error saving vendor. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVendor(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      is_active: true,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="Vendors" 
          subtitle="Manage your vendors and suppliers"
        />
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Vendors
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: themeColor, 
                  width: 56, 
                  height: 56
                }}>
                  <StoreIcon sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.active}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Vendors
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: themeColor, 
                  width: 56, 
                  height: 56
                }}>
                  <TrendingUpIcon sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.inactive}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inactive Vendors
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: themeColor, 
                  width: 56, 
                  height: 56
                }}>
                  <BusinessIcon sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ${stats.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Credit Limit
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: themeColor, 
                  width: 56, 
                  height: 56
                }}>
                  <MoneyIcon sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header with Add Button */}
          <Box sx={{ 
            p: 3, 
            background: themeColor,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              List
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Add Vendor
            </Button>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Vendor Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Credit Limit</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {vendor.company_name || vendor.display_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vendor.supplier_type || 'Distributor'}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        ${vendor.credit_limit?.toLocaleString() || '0'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vendor.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          backgroundColor: vendor.is_active ? themeColor : 'grey.300',
                          color: vendor.is_active ? 'white' : 'grey.700',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(vendor)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(vendor.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {vendors.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No vendors found. Add your first vendor to get started.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: themeColor, color: 'white' }}>
          {editingVendor ? 'Edit' : 'Add'} Vendor
        </DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Vendor Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vendor Type"
                value={formData.vendor_type}
                onChange={handleInputChange('vendor_type')}
                placeholder="e.g., Technology Supplier"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credit Limit"
                type="number"
                value={formData.credit_limit}
                onChange={handleInputChange('credit_limit')}
                placeholder="0"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleInputChange('email')}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Terms"
                value={formData.payment_terms}
                onChange={handleInputChange('payment_terms')}
                placeholder="e.g., Net 30"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 0.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleInputChange('is_active')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: themeColor,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: themeColor,
                      },
                    }}
                  />
                }
                label="Active"
                sx={{ '& .MuiFormControlLabel-label': { color: themeColor, fontWeight: 500 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: 'grey.50' }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ 
              borderColor: themeColor,
              color: themeColor,
              '&:hover': {
                borderColor: themeColor,
                backgroundColor: `${themeColor}20`
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: themeColor,
              '&:hover': {
                backgroundColor: `${themeColor}dd`
              }
            }}
          >
            {editingVendor ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SimpleVendorPage;