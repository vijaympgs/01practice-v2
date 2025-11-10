import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, InputAdornment,
  Alert, CircularProgress, Grid, Chip, Avatar, IconButton, Menu, MenuItem,
  FormControl, InputLabel, Select, Pagination, Tooltip, Badge, Divider
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, FilterList as FilterIcon,
  MoreVert as MoreVertIcon, Business as BusinessIcon, Factory as FactoryIcon,
  Store as StoreIcon, LocalShipping as ShippingIcon, Build as BuildIcon,
  Phone as PhoneIcon, Email as EmailIcon, Language as LanguageIcon,
  Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon,
  LocationOn as LocationIcon, Star as StarIcon, Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon, Refresh as RefreshIcon, Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSuppliers, deleteSupplier, activateSupplier, deactivateSupplier,
  togglePreferredStatus, toggleVerifiedStatus, setSearchTerm, setFilters, clearFilters
} from '../../store/slices/supplierSlice';
import supplierService from '../../services/supplierService';

const SupplierListEnhanced = ({ onAddSupplier, onEditSupplier, onViewSupplier, onAddQuickVendor }) => {
  const dispatch = useDispatch();
  const { suppliers, loading, error, pagination, searchTerm, filters } = useSelector(state => state.suppliers);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dispatch(fetchSuppliers());
    loadStats();
  }, [dispatch]);

  const loadStats = async () => {
    try {
      const statsData = await supplierService.getSupplierStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load supplier stats:', error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setLocalSearchTerm(value);
    dispatch(setSearchTerm(value));
    
    // Debounced search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      dispatch(fetchSuppliers({ search: value, ...filters }));
    }, 500);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    dispatch(setFilters(newFilters));
    dispatch(fetchSuppliers({ search: localSearchTerm, ...newFilters }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalSearchTerm('');
    dispatch(setSearchTerm(''));
    dispatch(fetchSuppliers());
  };

  const handleRefresh = () => {
    dispatch(fetchSuppliers({ search: localSearchTerm, ...filters }));
    loadStats();
  };

  const handleMenuClick = (event, supplier) => {
    setAnchorEl(event.currentTarget);
    setSelectedSupplier(supplier);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSupplier(null);
  };

  const handleDelete = async (supplier) => {
    if (window.confirm(`Are you sure you want to delete supplier "${supplier.display_name || supplier.company_name}"?`)) {
      try {
        await dispatch(deleteSupplier(supplier.id));
        handleRefresh();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    handleMenuClose();
  };

  const handleToggleStatus = async (supplier) => {
    try {
      if (supplier.is_active) {
        await dispatch(deactivateSupplier(supplier.id));
      } else {
        await dispatch(activateSupplier(supplier.id));
      }
      handleRefresh();
    } catch (error) {
      console.error('Status toggle error:', error);
    }
    handleMenuClose();
  };

  const handleTogglePreferred = async (supplier) => {
    try {
      await dispatch(togglePreferredStatus(supplier.id));
      handleRefresh();
    } catch (error) {
      console.error('Preferred toggle error:', error);
    }
    handleMenuClose();
  };

  const handleToggleVerified = async (supplier) => {
    try {
      await dispatch(toggleVerifiedStatus(supplier.id));
      handleRefresh();
    } catch (error) {
      console.error('Verified toggle error:', error);
    }
    handleMenuClose();
  };

  const getSupplierTypeIcon = (type) => {
    switch (type) {
      case 'manufacturer':
        return <FactoryIcon />;
      case 'distributor':
        return <BusinessIcon />;
      case 'wholesaler':
        return <BusinessIcon />;
      case 'retailer':
        return <StoreIcon />;
      case 'dropshipper':
        return <ShippingIcon />;
      case 'service_provider':
        return <BuildIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  const getSupplierTypeColor = (type) => {
    switch (type) {
      case 'manufacturer':
        return 'success';
      case 'distributor':
        return 'primary';
      case 'wholesaler':
        return 'secondary';
      case 'retailer':
        return 'warning';
      case 'dropshipper':
        return 'info';
      case 'service_provider':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (supplier) => {
    if (!supplier.is_active) return 'error';
    if (supplier.is_preferred) return 'warning';
    if (supplier.is_verified) return 'info';
    return 'success';
  };

  const formatSupplierStats = (supplier) => {
    const stats = [];
    if (supplier.total_orders > 0) {
      stats.push(`$${supplier.total_orders.toFixed(2)}`);
    }
    if (supplier.order_count > 0) {
      stats.push(`${supplier.order_count} orders`);
    }
    if (supplier.lead_time_days) {
      stats.push(`${supplier.lead_time_days}d lead time`);
    }
    return stats.join(' • ') || 'No orders yet';
  };

  const supplierTypes = supplierService.getSupplierTypes();

  if (loading && suppliers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Stats - Arranged as per image */}
      <Box display="flex" flexDirection="column" mb={3}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000',
            lineHeight: 1.2,
            mb: 2
          }}
        >
          Vendor
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box display="flex" gap={2} alignItems="center">
            {stats && (
              <>
                <Chip
                  icon={<BusinessIcon />}
                  label={`${stats.total_suppliers} Total`}
                  sx={{
                    bgcolor: '#e3f2fd',
                    color: '#1976d2',
                    border: '1px solid #bbdefb',
                    fontWeight: 500,
                    height: 32
                  }}
                />
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`${stats.active_suppliers} Active`}
                  sx={{
                    bgcolor: '#e8f5e8',
                    color: '#2e7d32',
                    border: '1px solid #c8e6c9',
                    fontWeight: 500,
                    height: 32
                  }}
                />
                <Chip
                  icon={<StarIcon />}
                  label={`${stats.preferred_suppliers} Preferred`}
                  sx={{
                    bgcolor: '#fff3e0',
                    color: '#f57c00',
                    border: '1px solid #ffcc02',
                    fontWeight: 500,
                    height: 32
                  }}
                />
                <Chip
                  icon={<VerifiedIcon />}
                  label={`${stats.verified_suppliers} Verified`}
                  sx={{
                    bgcolor: '#e3f2fd',
                    color: '#1976d2',
                    border: '1px solid #bbdefb',
                    fontWeight: 500,
                    height: 32
                  }}
                />
              </>
            )}
            <Tooltip title="Refresh">
              <span>
                <IconButton onClick={handleRefresh} disabled={loading} sx={{ ml: 1 }}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddQuickVendor}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                backgroundColor: '#e8f5e8',
                fontWeight: 600,
                textTransform: 'uppercase',
                px: 3,
                py: 1,
                height: 32,
                '&:hover': {
                  borderColor: '#388e3c',
                  backgroundColor: '#c8e6c9'
                }
              }}
            >
              Quick Vendor
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddSupplier}
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                fontWeight: 600,
                textTransform: 'uppercase',
                px: 3,
                py: 1,
                height: 32,
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Add Vendor
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search vendors by company name, contact, email, or phone..."
                value={localSearchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.supplier_type || ''}
                  onChange={(e) => handleFilterChange('supplier_type', e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {supplierTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
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
                sx={{
                  height: 56,
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
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

      {/* Vendor Listing */}
      {suppliers.length > 0 ? (
        <>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {suppliers.map((supplier, index) => (
              <Box key={supplier.id}>
                <Box 
                  sx={{ 
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      transition: 'background-color 0.2s ease'
                    }
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    sx={{
                      bgcolor: getStatusColor(supplier) + '.main',
                      width: 56,
                      height: 56,
                      fontSize: '1.2rem'
                    }}
                  >
                    {getSupplierTypeIcon(supplier.supplier_type)}
                  </Avatar>

                  {/* Main Info */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
                        {supplier.company_name}
                      </Typography>
                      {supplier.trade_name && supplier.trade_name !== supplier.company_name && (
                        <Typography variant="body2" color="text.secondary">
                          ({supplier.trade_name})
                        </Typography>
                      )}
                      <Box display="flex" gap={1}>
                        <Chip
                          size="small"
                          label={supplier.display_supplier_type || supplier.supplier_type}
                          color={getSupplierTypeColor(supplier.supplier_type)}
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        {supplier.is_preferred && (
                          <Chip
                            size="small"
                            label="Preferred"
                            color="warning"
                            icon={<StarIcon />}
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                        {supplier.is_verified && (
                          <Chip
                            size="small"
                            label="Verified"
                            color="info"
                            icon={<VerifiedIcon />}
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                        {!supplier.is_active && (
                          <Chip
                            size="small"
                            label="Inactive"
                            color="error"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
                      {/* Contact Info */}
                      {supplier.contact_person && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Contact:</strong> {supplier.contact_person}
                            {supplier.contact_title && ` (${supplier.contact_title})`}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Email */}
                      {supplier.email && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {supplier.email}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Phone */}
                      {supplier.phone && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {supplier.phone}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Location */}
                      {(supplier.city || supplier.state) && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {[supplier.city, supplier.state].filter(Boolean).join(', ')}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Website */}
                      {supplier.website && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <LanguageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="primary">
                            <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                              Website
                            </a>
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    {/* Business Stats */}
                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        {formatSupplierStats(supplier)}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {supplier.display_payment_terms || 'Net 30'} • {supplier.lead_time_days || 7}d lead
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => onViewSupplier(supplier)}
                      variant="outlined"
                      sx={{ minWidth: 80 }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => onEditSupplier(supplier)}
                      variant="outlined"
                      sx={{ minWidth: 80 }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, supplier)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
                {index < suppliers.length - 1 && <Divider />}
              </Box>
            ))}
          </Card>

          {/* Pagination */}
          {pagination.count > pagination.pageSize && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(pagination.count / pagination.pageSize)}
                page={pagination.page}
                onChange={(event, page) => {
                  dispatch(fetchSuppliers({
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
          <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {localSearchTerm ? 'No vendors found matching your search' : 'No vendors found'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {localSearchTerm 
              ? 'Try adjusting your search terms or filters' 
              : 'Click "Add Vendor" to create your first vendor'
            }
          </Typography>
          {!localSearchTerm && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddSupplier}
            >
              Add Your First Vendor
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
          onViewSupplier(selectedSupplier);
          handleMenuClose();
        }}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          onEditSupplier(selectedSupplier);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Vendor
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(selectedSupplier)}>
          {selectedSupplier?.is_active ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={() => handleTogglePreferred(selectedSupplier)}>
          <StarIcon sx={{ mr: 1 }} />
          {selectedSupplier?.is_preferred ? 'Remove Preferred' : 'Make Preferred'}
        </MenuItem>
        <MenuItem onClick={() => handleToggleVerified(selectedSupplier)}>
          <VerifiedIcon sx={{ mr: 1 }} />
          {selectedSupplier?.is_verified ? 'Remove Verification' : 'Verify Vendor'}
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDelete(selectedSupplier)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Vendor
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

export default SupplierListEnhanced;








