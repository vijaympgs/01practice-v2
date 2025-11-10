import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, InputAdornment,
  Alert, CircularProgress, Grid, Chip, Avatar, IconButton, Menu, MenuItem,
  FormControl, InputLabel, Select, Pagination, Tooltip, Badge, Divider
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, FilterList as FilterIcon,
  MoreVert as MoreVertIcon, Person as PersonIcon, Business as BusinessIcon,
  Star as StarIcon, Phone as PhoneIcon, Email as EmailIcon,
  Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon,
  LocationOn as LocationIcon, CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon, Refresh as RefreshIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCustomers, deleteCustomer, activateCustomer, deactivateCustomer,
  toggleVipStatus, setSearchTerm, setFilters, clearFilters
} from '../../store/slices/customerSlice';
import customerService from '../../services/customerService';

const CustomerListEnhanced = ({ onAddCustomer, onEditCustomer, onViewCustomer, onAddQuickCustomer }) => {
  const dispatch = useDispatch();
  const { customers, loading, error, pagination, searchTerm, filters } = useSelector(state => state.customers);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
    loadStats();
  }, [dispatch]);

  const loadStats = async () => {
    try {
      const statsData = await customerService.getCustomerStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load customer stats:', error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setLocalSearchTerm(value);
    dispatch(setSearchTerm(value));
    
    // Debounced search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      dispatch(fetchCustomers({ search: value, ...filters }));
    }, 500);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    dispatch(setFilters(newFilters));
    dispatch(fetchCustomers({ search: localSearchTerm, ...newFilters }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalSearchTerm('');
    dispatch(setSearchTerm(''));
    dispatch(fetchCustomers());
  };

  const handleRefresh = () => {
    dispatch(fetchCustomers({ search: localSearchTerm, ...filters }));
    loadStats();
  };

  const handleMenuClick = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Are you sure you want to delete customer "${customer.display_name}"?`)) {
      try {
        await dispatch(deleteCustomer(customer.id));
        handleRefresh();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    handleMenuClose();
  };

  const handleToggleStatus = async (customer) => {
    try {
      if (customer.is_active) {
        await dispatch(deactivateCustomer(customer.id));
      } else {
        await dispatch(activateCustomer(customer.id));
      }
      handleRefresh();
    } catch (error) {
      console.error('Status toggle error:', error);
    }
    handleMenuClose();
  };

  const handleToggleVip = async (customer) => {
    try {
      await dispatch(toggleVipStatus(customer.id));
      handleRefresh();
    } catch (error) {
      console.error('VIP toggle error:', error);
    }
    handleMenuClose();
  };

  const getCustomerTypeIcon = (type) => {
    switch (type) {
      case 'business':
      case 'wholesale':
        return <BusinessIcon />;
      case 'vip':
        return <StarIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'business':
        return 'primary';
      case 'wholesale':
        return 'secondary';
      case 'vip':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusColor = (customer) => {
    if (!customer.is_active) return 'error';
    if (customer.is_vip) return 'warning';
    return 'success';
  };

  const formatCustomerStats = (customer) => {
    const stats = [];
    if (customer.total_purchases > 0) {
      stats.push(`$${customer.total_purchases.toFixed(2)}`);
    }
    if (customer.purchase_count > 0) {
      stats.push(`${customer.purchase_count} orders`);
    }
    return stats.join(' • ') || 'No purchases';
  };

  if (loading && customers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header with Stats */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: '1.8rem', // Consistent with dashboard
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            Customer
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {stats && (
              <>
                <Chip
                  icon={<PersonIcon />}
                  label={`${stats.total_customers || 0} Total`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`${stats.active_customers || 0} Active`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  icon={<StarIcon />}
                  label={`${stats.vip_customers || 0} VIP`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  icon={<CreditCardIcon />}
                  label={`${stats.credit_customers || 0} Credit`}
                  color="info"
                  variant="outlined"
                />
              </>
            )}
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddQuickCustomer}
            size="large"
            sx={{
              borderColor: '#4caf50',
              color: '#4caf50',
              '&:hover': {
                borderColor: '#388e3c',
                backgroundColor: 'rgba(76, 175, 80, 0.04)'
              },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              px: 3,
              py: 1.5
            }}
          >
            Quick Customer
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddCustomer}
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              px: 3,
              py: 1.5,
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Add Customer
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search customers by name, contact, email, or phone..."
                value={localSearchTerm}
                onChange={handleSearch}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.customer_type || ''}
                  onChange={(e) => handleFilterChange('customer_type', e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="wholesale">Wholesale</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.is_active || ''}
                  onChange={(e) => handleFilterChange('is_active', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      {/* Customer Grid */}
      {customers.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {customers.map((customer) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={customer.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      transform: 'translateY(-4px)',
                      borderColor: '#1976d2',
                    }
                  }}
                >
                  {/* Status Badge */}
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, customer)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    {/* Customer Avatar and Basic Info */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: getStatusColor(customer) + '.main',
                          mr: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        {getCustomerTypeIcon(customer.customer_type)}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="h6" component="div" noWrap>
                          {customer.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {customer.customer_code}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Company Name */}
                    {customer.company_name && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" noWrap>
                          {customer.company_name}
                        </Typography>
                      </Box>
                    )}

                    {/* Contact Info */}
                    {customer.email && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" noWrap>
                          {customer.email}
                        </Typography>
                      </Box>
                    )}

                    {customer.phone && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" noWrap>
                          {customer.phone}
                        </Typography>
                      </Box>
                    )}

                    {/* Location */}
                    {(customer.city || customer.state) && (
                      <Box display="flex" alignItems="center" mb={2}>
                        <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" noWrap>
                          {[customer.city, customer.state].filter(Boolean).join(', ')}
                        </Typography>
                      </Box>
                    )}

                    {/* Customer Type and Status Chips */}
                    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                      <Chip
                        size="small"
                        label={customer.customer_type?.charAt(0).toUpperCase() + customer.customer_type?.slice(1)}
                        color={getCustomerTypeColor(customer.customer_type)}
                        variant="outlined"
                      />
                      {customer.is_vip && (
                        <Chip
                          size="small"
                          label="VIP"
                          color="warning"
                          icon={<StarIcon />}
                        />
                      )}
                      {!customer.is_active && (
                        <Chip
                          size="small"
                          label="Inactive"
                          color="error"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {/* Purchase Stats */}
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        {formatCustomerStats(customer)}
                      </Typography>
                    </Box>

                    {/* Credit Info */}
                    {customer.allow_credit && customer.credit_limit > 0 && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <CreditCardIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                        <Typography variant="body2" color="success.main">
                          Credit: ${customer.credit_limit}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <Divider />

                  {/* Action Buttons */}
                  <Box sx={{ p: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => onViewCustomer(customer)}
                          fullWidth
                        >
                          View
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => onEditCustomer(customer)}
                          fullWidth
                        >
                          Edit
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(customer)}
                          color="error"
                          fullWidth
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.count > pagination.pageSize && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(pagination.count / pagination.pageSize)}
                page={pagination.page}
                onChange={(event, page) => {
                  dispatch(fetchCustomers({
                    search: localSearchTerm,
                    ...filters,
                    page
                  }));
                }}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {localSearchTerm ? 'No customers found matching your search' : 'No customers found'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {localSearchTerm 
              ? 'Try adjusting your search terms or filters' 
              : 'Click "Add Customer" to create your first customer'
            }
          </Typography>
          {!localSearchTerm && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddCustomer}
            >
              ADD YOUR FIRST CUSTOMER
            </Button>
          )}
        </Card>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          onViewCustomer(selectedCustomer);
          handleMenuClose();
        }}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          onEditCustomer(selectedCustomer);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Customer
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(selectedCustomer)}>
          {selectedCustomer?.is_active ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={() => handleToggleVip(selectedCustomer)}>
          <StarIcon sx={{ mr: 1 }} />
          {selectedCustomer?.is_vip ? 'Remove VIP' : 'Make VIP'}
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDelete(selectedCustomer)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Customer
        </MenuItem>
      </Menu>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default CustomerListEnhanced;


