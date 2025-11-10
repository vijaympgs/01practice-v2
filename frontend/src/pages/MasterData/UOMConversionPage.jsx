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
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import themeService from '../../services/themeService';

const UOMConversionPage = () => {
  const [conversions, setConversions] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeColor, setThemeColor] = useState('#1976d2');

  // Form state
  const [form, setForm] = useState({
    from_uom: '',
    to_uom: '',
    conversion_factor: '',
    is_active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    if (token) {
      loadData();
      loadUOMs();
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

  const loadUOMs = async () => {
    try {
      const response = await api.get('/products/uom/');
      setUoms(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading UOMs:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/uom-conversion/');
      setConversions(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading UOM Conversion data:', error);
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication expired. Please log in again.',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error loading UOM Conversion data. Please try again.',
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
        from_uom: item.from_uom || '',
        to_uom: item.to_uom || '',
        conversion_factor: item.conversion_factor || '',
        is_active: item.is_active !== false,
      });
    } else {
      // Add mode - reset form
      setForm({
        from_uom: '',
        to_uom: '',
        conversion_factor: '',
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
      if (!form.from_uom) {
        setSnackbar({
          open: true,
          message: 'From UOM is required',
          severity: 'error',
        });
        return;
      }

      if (!form.to_uom) {
        setSnackbar({
          open: true,
          message: 'To UOM is required',
          severity: 'error',
        });
        return;
      }

      if (form.from_uom === form.to_uom) {
        setSnackbar({
          open: true,
          message: 'From UOM and To UOM cannot be the same',
          severity: 'error',
        });
        return;
      }

      if (!form.conversion_factor || parseFloat(form.conversion_factor) <= 0) {
        setSnackbar({
          open: true,
          message: 'Conversion factor must be greater than 0',
          severity: 'error',
        });
        return;
      }

      const dataToSend = {
        ...form,
        conversion_factor: parseFloat(form.conversion_factor),
      };

      if (editingItem) {
        await api.put(`/products/uom-conversion/${editingItem.id}/`, dataToSend);
        setSnackbar({
          open: true,
          message: 'UOM Conversion updated successfully!',
          severity: 'success',
        });
      } else {
        await api.post('/products/uom-conversion/', dataToSend);
        setSnackbar({
          open: true,
          message: 'UOM Conversion created successfully!',
          severity: 'success',
        });
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error saving UOM Conversion:', error);
      console.error('Error details:', error.response?.data);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error saving UOM Conversion. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this UOM Conversion?')) {
      try {
        await api.delete(`/products/uom-conversion/${id}/`);
        setSnackbar({
          open: true,
          message: 'UOM Conversion deleted successfully!',
          severity: 'success',
        });
        loadData();
      } catch (error) {
        console.error('Error deleting UOM Conversion:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting UOM Conversion. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please log in to access the UOM Conversion.
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
          title="UOM Conversion" 
          subtitle="Manage unit conversions between different UOMs"
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
            Add Conversion
          </Button>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {/* Data Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>From UOM</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>To UOM</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Conversion Factor</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: themeColor }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conversions.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: themeColor }}>
                          {item.from_uom_code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.from_uom_description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: themeColor }}>
                          {item.to_uom_code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.to_uom_description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.conversion_factor}
                        size="small"
                        sx={{ borderColor: themeColor, color: themeColor, borderRadius: 2 }}
                        variant="outlined"
                      />
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
          {editingItem ? 'Edit' : 'Add'} UOM Conversion
        </DialogTitle>
        <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: themeColor }}>From UOM</InputLabel>
                <Select
                  value={form.from_uom}
                  onChange={handleInputChange('from_uom')}
                  label="From UOM"
                  required
                  sx={{ borderRadius: 0 }}
                >
                  {uoms.map((uom) => (
                    <MenuItem key={uom.id} value={uom.id}>
                      {uom.code} - {uom.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: themeColor }}>To UOM</InputLabel>
                <Select
                  value={form.to_uom}
                  onChange={handleInputChange('to_uom')}
                  label="To UOM"
                  required
                  sx={{ borderRadius: 0 }}
                >
                  {uoms.map((uom) => (
                    <MenuItem key={uom.id} value={uom.id}>
                      {uom.code} - {uom.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Conversion Factor"
                type="number"
                value={form.conversion_factor}
                onChange={handleInputChange('conversion_factor')}
                inputProps={{ min: 0, step: 0.0001 }}
                helperText="Multiplier to convert from UOM to To UOM"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sx={{ mt: 0.5 }}>
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

export default UOMConversionPage;



