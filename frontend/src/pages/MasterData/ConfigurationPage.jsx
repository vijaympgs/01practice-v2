import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
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
  Divider,
  Stack,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  BrandingWatermark as BrandIcon,
  Business as DepartmentIcon,
  Category as DivisionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import themeService from '../../services/themeService';

const ConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeColor, setThemeColor] = useState('#1976d2');

  // Form data for different entities
  const [brandForm, setBrandForm] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });

  const [divisionForm, setDivisionForm] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });

  const tabConfig = [
    {
      label: 'Brand',
      icon: <BrandIcon />,
      color: 'primary',
      data: brands,
      setData: setBrands,
      form: brandForm,
      setForm: setBrandForm,
      endpoint: '/products/brands/',
      columns: ['name', 'code', 'is_active'],
    },
    {
      label: 'Department',
      icon: <DepartmentIcon />,
      color: 'secondary',
      data: departments,
      setData: setDepartments,
      form: departmentForm,
      setForm: setDepartmentForm,
      endpoint: '/products/departments/',
      columns: ['name', 'code', 'is_active'],
    },
    {
      label: 'Division',
      icon: <DivisionIcon />,
      color: 'success',
      data: divisions,
      setData: setDivisions,
      form: divisionForm,
      setForm: setDivisionForm,
      endpoint: '/products/divisions/',
      columns: ['name', 'code', 'is_active'],
    },
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
      const [brandsRes, departmentsRes, divisionsRes] = await Promise.all([
        api.get('/products/brands/'),
        api.get('/products/departments/'),
        api.get('/products/divisions/'),
      ]);
      
      setBrands(brandsRes.data.results || brandsRes.data);
      setDepartments(departmentsRes.data.results || departmentsRes.data);
      setDivisions(divisionsRes.data.results || divisionsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication expired. Please log in again.',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error loading data. Please try again.',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (item = null) => {
    setEditingItem(item);
    const currentTab = tabConfig[activeTab];
    
    if (item) {
      // Edit mode - populate form
      currentTab.setForm({
        name: item.name || '',
        code: item.code || '',
        description: item.description || '',
        is_active: item.is_active !== false,
      });
    } else {
      // Add mode - reset form
      currentTab.setForm({
        name: '',
        code: '',
        description: '',
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
    const currentTab = tabConfig[activeTab];
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    currentTab.setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const currentTab = tabConfig[activeTab];
      const formData = currentTab.form;
      
      // Basic validation
      if (!formData.name.trim()) {
        setSnackbar({
          open: true,
          message: `${currentTab.label} name is required`,
          severity: 'error',
        });
        return;
      }

      if (editingItem) {
        await api.put(`${currentTab.endpoint}${editingItem.id}/`, formData);
        setSnackbar({
          open: true,
          message: `${currentTab.label} updated successfully!`,
          severity: 'success',
        });
      } else {
        await api.post(currentTab.endpoint, formData);
        setSnackbar({
          open: true,
          message: `${currentTab.label} created successfully!`,
          severity: 'success',
        });
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error saving data:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error saving data. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    const currentTab = tabConfig[activeTab];
    if (window.confirm(`Are you sure you want to delete this ${currentTab.label}?`)) {
      try {
        await api.delete(`${currentTab.endpoint}${id}/`);
        setSnackbar({
          open: true,
          message: `${currentTab.label} deleted successfully!`,
          severity: 'success',
        });
        loadData();
      } catch (error) {
        console.error('Error deleting data:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting data. Please try again.',
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
          Please log in to access the Merchandise management.
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

  const currentTab = tabConfig[activeTab];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="Merchandise Masters" 
          subtitle="Manage merchandise masters: Brand, Department, and Division"
        />
      </Box>

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Tab Header */}
        <Box sx={{ 
          background: themeColor,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              textColor="inherit"
              TabIndicatorProps={{
                style: { backgroundColor: 'white', height: 3 }
              }}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 64,
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255,255,255,0.7)',
                  }
                },
                '& .Mui-selected': {
                  color: 'white !important',
                  '& .MuiSvgIcon-root': {
                    color: 'white !important',
                  }
                }
              }}
            >
              {tabConfig.map((tab, index) => (
                <Tab 
                  key={index}
                  label={tab.label}
                />
              ))}
            </Tabs>
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
              Add {currentTab.label}
            </Button>
          </Box>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {loading && <LinearProgress />}
          
          {/* Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: themeColor }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentTab.data.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" sx={{ color: themeColor }}>
                        {item.code}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: themeColor }}>{item.name}</TableCell>
                    <TableCell sx={{ color: themeColor }}>{item.description || '-'}</TableCell>
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: themeColor,
          color: 'white'
        }}>
          {editingItem ? 'Edit' : 'Add'} {currentTab.label}
        </DialogTitle>
        <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                value={currentTab.form.name}
                onChange={handleInputChange('name')}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Code"
                value={currentTab.form.code}
                onChange={handleInputChange('code')}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Description"
                value={currentTab.form.description}
                onChange={handleInputChange('description')}
                multiline
                rows={3}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentTab.form.is_active}
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
            startIcon={<SaveIcon />}
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

export default ConfigurationPage;
