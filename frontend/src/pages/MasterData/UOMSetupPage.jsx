import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Scale as ScaleIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import themeService from '../../services/themeService';

const UOMSetupPage = () => {
  const [uoms, setUoms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeColor, setThemeColor] = useState('#1976d2');

  // Form state
  const [form, setForm] = useState({
    code: '',
    description: '',
    basis: '',
    decimals: '',
    is_stock_uom: false,
    is_purchase_uom: false,
    is_sales_uom: false,
    is_active: true,
  });

  const basisOptions = [
    { value: 'length', label: 'Length' },
    { value: 'units', label: 'Units' },
    { value: 'volume', label: 'Volume' },
    { value: 'capacity', label: 'Capacity' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    if (token) {
      loadData();
    }
    
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

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/uom/');
      setUoms(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading UOM data:', error);
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication expired. Please log in again.',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error loading UOM data. Please try again.',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    setEditingItem(item);
    
    if (item) {
      // Edit mode - populate form
      setForm({
        code: item.code || '',
        description: item.description || '',
        basis: item.basis || '',
        decimals: item.decimals || '',
        is_stock_uom: item.is_stock_uom || false,
        is_purchase_uom: item.is_purchase_uom || false,
        is_sales_uom: item.is_sales_uom || false,
        is_active: item.is_active !== false,
      });
    } else {
      // Add mode - reset form
      setForm({
        code: '',
        description: '',
        basis: '',
        decimals: '',
        is_stock_uom: false,
        is_purchase_uom: false,
        is_sales_uom: false,
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!form.code.trim()) {
        setSnackbar({
          open: true,
          message: 'UOM Code is required',
          severity: 'error',
        });
        return;
      }

      if (!form.description.trim()) {
        setSnackbar({
          open: true,
          message: 'UOM Description is required',
          severity: 'error',
        });
        return;
      }

      const dataToSend = {
        ...form,
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
      };

      if (editingItem) {
        await api.put(`/products/uom/${editingItem.id}/`, dataToSend);
        setSnackbar({
          open: true,
          message: 'UOM updated successfully!',
          severity: 'success',
        });
      } else {
        await api.post('/products/uom/', dataToSend);
        setSnackbar({
          open: true,
          message: 'UOM created successfully!',
          severity: 'success',
        });
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error saving UOM:', error);
      console.error('Error details:', error.response?.data);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error saving UOM. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this UOM?')) {
      try {
        await api.delete(`/products/uom/${id}/`);
        setSnackbar({
          open: true,
          message: 'UOM deleted successfully!',
          severity: 'success',
        });
        loadData();
      } catch (error) {
        console.error('Error deleting UOM:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting UOM. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const getBasisColor = (basis) => {
    const colors = {
      length: 'primary',
      units: 'success',
      volume: 'warning',
      capacity: 'info',
    };
    return colors[basis] || 'default';
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please log in to access the UOM Setup.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="UOM Setup" 
          subtitle="Manage Units of Measure for your products"
        />
      </Box>

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Card Header */}
        <Box sx={{ 
          background: themeColor,
          color: 'white',
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
            List
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
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
            Add UOM
          </Button>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {/* Data Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Basis</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Decimals</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Flags</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: themeColor }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uoms.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" sx={{ color: themeColor }}>
                        {item.code}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: themeColor }}>{item.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={basisOptions.find(opt => opt.value === item.basis)?.label || item.basis}
                        color={getBasisColor(item.basis)}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>{item.decimals}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {item.is_stock_uom && (
                          <Chip label="Stock" size="small" color="primary" variant="outlined" />
                        )}
                        {item.is_purchase_uom && (
                          <Chip label="Purchase" size="small" color="secondary" variant="outlined" />
                        )}
                        {item.is_sales_uom && (
                          <Chip label="Sales" size="small" color="success" variant="outlined" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          backgroundColor: item.is_active ? themeColor : 'grey.300',
                          color: item.is_active ? 'white' : 'grey.700',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(item)}
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.light', color: 'white' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item.id)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.light', color: 'white' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: themeColor,
          color: 'white'
        }}>
          {editingItem ? 'Edit' : 'Add'} Unit of Measure
        </DialogTitle>
        <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="UOM Code"
                value={form.code}
                onChange={handleInputChange('code')}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="UOM Description"
                value={form.description}
                onChange={handleInputChange('description')}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: themeColor }}>UOM Basis</InputLabel>
                <Select
                  value={form.basis}
                  onChange={handleInputChange('basis')}
                  label="UOM Basis"
                  sx={{ borderRadius: 0 }}
                >
                  {basisOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="UOM Decimals"
                type="number"
                value={form.decimals}
                onChange={handleInputChange('decimals')}
                inputProps={{ min: 0, max: 10 }}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_stock_uom}
                    onChange={handleInputChange('is_stock_uom')}
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
                label="Stock UOM"
                sx={{ '& .MuiFormControlLabel-label': { color: themeColor, fontWeight: 500 } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_purchase_uom}
                    onChange={handleInputChange('is_purchase_uom')}
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
                label="Purchase UOM"
                sx={{ '& .MuiFormControlLabel-label': { color: themeColor, fontWeight: 500 } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_sales_uom}
                    onChange={handleInputChange('is_sales_uom')}
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
                label="Sales UOM"
                sx={{ '& .MuiFormControlLabel-label': { color: themeColor, fontWeight: 500 } }}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_active}
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
            {editingItem ? 'Update' : 'Create'}
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
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UOMSetupPage;

