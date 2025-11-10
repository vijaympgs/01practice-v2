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
  Badge,
  Tooltip,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Stack,
  LinearProgress,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  Analytics as AnalyticsIcon,
  Loyalty as LoyaltyIcon,
} from '@mui/icons-material';
import { Fade } from '@mui/material';

const SimpleCustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeColor, setThemeColor] = useState('#1976d2');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    premium: 0,
    totalValue: 0
  });

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    customer_type: 'Individual',
    loyalty_points: 0,
    last_purchase: '',
    is_active: true,
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        (customer.display_name || customer.full_name || `${customer.first_name} ${customer.last_name}`)
          .toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        customer.customer_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(customer => 
        filterStatus === 'active' ? customer.is_active : !customer.is_active
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(customer => 
        customer.customer_type?.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.display_name || a.full_name || `${a.first_name} ${a.last_name}`;
          bVal = b.display_name || b.full_name || `${b.first_name} ${b.last_name}`;
          break;
        case 'email':
          aVal = a.email || '';
          bVal = b.email || '';
          break;
        case 'phone':
          aVal = a.phone || '';
          bVal = b.phone || '';
          break;
        case 'created':
          aVal = new Date(a.created_at || 0);
          bVal = new Date(b.created_at || 0);
          break;
        default:
          aVal = a.display_name || a.full_name || `${a.first_name} ${a.last_name}`;
          bVal = b.display_name || b.full_name || `${b.first_name} ${b.last_name}`;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, filterStatus, filterType, sortBy, sortOrder]);

  // Calculate stats
  useEffect(() => {
    const newStats = {
      total: customers.length,
      active: customers.filter(c => c.is_active).length,
      inactive: customers.filter(c => !c.is_active).length,
      premium: customers.filter(c => c.customer_type?.toLowerCase() === 'premium').length,
      totalValue: customers.reduce((sum, c) => sum + (c.lifetime_value || 0), 0)
    };
    setStats(newStats);
  }, [customers]);

  useEffect(() => {
    loadCustomers();
    
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

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers/');
      const customersData = response.data.results || response.data;
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading customers:', error);
      setSnackbar({
        open: true,
        message: 'Error loading customers. Please try again.',
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
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      customer_type: 'Individual',
      loyalty_points: 0,
      last_purchase: '',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.display_name || customer.full_name || `${customer.first_name} ${customer.last_name}`,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address_line_1 || '',
      customer_type: customer.customer_type || 'Individual',
      loyalty_points: 0,
      last_purchase: customer.last_purchase_date || '',
      is_active: customer.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setLoading(true);
        await api.delete(`/customers/${id}/`);
        setSnackbar({
          open: true,
          message: 'Customer deleted successfully!',
          severity: 'success',
        });
        // Reload customers
        await loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting customer. Please try again.',
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
        message: 'Customer name is required',
        severity: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API
      const customerData = {
        first_name: formData.name.split(' ')[0] || formData.name,
        last_name: formData.name.split(' ').slice(1).join(' ') || '',
        company_name: formData.customer_type === 'Corporate' ? formData.name : '',
        customer_type: formData.customer_type.toLowerCase(),
        phone: formData.phone,
        email: formData.email,
        address_line_1: formData.address,
        city: '',
        state: '',
        country: 'United States',
        is_active: formData.is_active,
        notes: ''
      };

      if (editingCustomer) {
        // Update existing customer
        await api.put(`/customers/${editingCustomer.id}/`, customerData);
        setSnackbar({
          open: true,
          message: 'Customer updated successfully!',
          severity: 'success',
        });
      } else {
        // Add new customer
        await api.post('/customers/', customerData);
        setSnackbar({
          open: true,
          message: 'Customer added successfully!',
          severity: 'success',
        });
      }

      // Reload customers
      await loadCustomers();
      setDialogOpen(false);
      setEditingCustomer(null);
      
    } catch (error) {
      console.error('Error saving customer:', error);
      setSnackbar({
        open: true,
        message: 'Error saving customer. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      customer_type: 'Individual',
      loyalty_points: 0,
      last_purchase: '',
      is_active: true,
    });
  };

  const handleBulkAction = (action) => {
    if (selectedCustomers.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select customers first',
        severity: 'warning',
      });
      return;
    }

    switch (action) {
      case 'activate':
        // Bulk activate customers
        setSnackbar({
          open: true,
          message: `${selectedCustomers.length} customers activated`,
          severity: 'success',
        });
        break;
      case 'deactivate':
        // Bulk deactivate customers
        setSnackbar({
          open: true,
          message: `${selectedCustomers.length} customers deactivated`,
          severity: 'success',
        });
        break;
      case 'export':
        // Export selected customers
        setSnackbar({
          open: true,
          message: `Exporting ${selectedCustomers.length} customers`,
          severity: 'info',
        });
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) {
          setSnackbar({
            open: true,
            message: `${selectedCustomers.length} customers deleted`,
            severity: 'success',
          });
          setSelectedCustomers([]);
        }
        break;
    }
    setAnchorEl(null);
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="Customers" 
          subtitle="Manage your customers and clients"
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
                    Total Customers
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: themeColor, 
                  width: 56, 
                  height: 56
                }}>
                  <GroupIcon sx={{ color: 'white' }} />
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
                    Active Customers
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: themeColor, 
                  width: 56, 
                  height: 56
                }}>
                  <PersonIcon sx={{ color: 'white' }} />
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
                    {stats.premium}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Premium Customers
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: themeColor, 
                  width: 56, 
                  height: 56
                }}>
                  <LoyaltyIcon sx={{ color: 'white' }} />
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
                    ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Lifetime Value
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
        <Box sx={{ 
          p: 3,
          background: themeColor,
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
            List
          </Typography>
        </Box>
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          backgroundColor: '#fdfdfd'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%', sm: '250px' } }}
              />
              <FormControl sx={{ width: { xs: '100%', sm: '150px' } }} size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: { xs: '100%', sm: '150px' } }} size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleMenuOpen}
                disabled={selectedCustomers.length === 0}
                sx={{ textTransform: 'none' }}
              >
                Bulk Actions ({selectedCustomers.length})
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleBulkAction('activate')}>Activate Selected</MenuItem>
                <MenuItem onClick={() => handleBulkAction('deactivate')}>Deactivate Selected</MenuItem>
                <MenuItem onClick={() => handleBulkAction('export')}>Export Selected</MenuItem>
                <Divider />
                <MenuItem onClick={() => handleBulkAction('delete')} sx={{ color: 'error.main' }}>Delete Selected</MenuItem>
              </Menu>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                  }
                }}
              >
                Add Customer
              </Button>
            </Box>
          </Box>

          {loading && <LinearProgress sx={{ height: 2, mb: -0.25 }} />}

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < filteredCustomers.length}
                      checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColor }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer, index) => (
                  <Fade in timeout={500 + index * 100} key={customer.id}>
                    <TableRow hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: themeColor, width: 40, height: 40 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: themeColor }}>
                              {customer.display_name || customer.full_name || `${customer.first_name} ${customer.last_name}`}
                            </Typography>
                            {customer.customer_code && (
                              <Typography variant="caption" color="text.secondary">
                                Code: {customer.customer_code}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.customer_type || 'Individual'}
                          color="secondary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {customer.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption">{customer.email}</Typography>
                            </Box>
                          )}
                          {customer.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption">{customer.phone}</Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {customer.address_line_1 || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{ 
                            borderRadius: 2,
                            backgroundColor: customer.is_active ? themeColor : 'grey.300',
                            color: customer.is_active ? 'white' : 'grey.700',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(customer)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(customer.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredCustomers.length === 0 && !loading && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No customers found. Add your first customer to get started.
              </Typography>
            </Box>
          )}
        </Card>

      {/* Enhanced Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: themeColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: themeColor }}>Customer Type</InputLabel>
                <Select
                  value={formData.customer_type}
                  label="Customer Type"
                  onChange={handleInputChange('customer_type')}
                  sx={{ borderRadius: 0 }}
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Corporate">Corporate</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleInputChange('email')}
                type="email"
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                multiline
                rows={2}
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
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
                label="Active Customer"
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
            {editingCustomer ? 'Update' : 'Create'}
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

export default SimpleCustomerPage;