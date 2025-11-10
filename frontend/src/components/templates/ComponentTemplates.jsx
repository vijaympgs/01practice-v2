/**
 * 🎨 RetailPWA Component Templates Library
 * 
 * This file contains reusable component templates and patterns
 * that should be used consistently across all modules.
 * 
 * Features form categorization system:
 * - MASTER: Master data forms (Products, Categories, Customers)
 * - TRANSACTION: Business transaction forms (Sales, Purchases, Payments)
 * - REPORTS: Report generation and configuration forms
 * 
 * Usage: Copy and adapt these templates for new modules
 */

import { 
  getFormTypeConfig, 
  getFormType, 
  hasFeature, 
  getLayoutConfig,
  getFormTypeIndicator,
  FORM_TYPES 
} from '../../constants/formTypes';

import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, Box,
  Tabs, Tab, Paper, Divider, Alert, CircularProgress,
  Card, CardContent, Checkbox, Avatar, Chip, IconButton,
  Menu, MenuItem, InputAdornment, FormControl, InputLabel,
  Select, FormControlLabel, Switch, Tooltip, Pagination
} from '@mui/material';
import {
  Save as SaveIcon, Close as CloseIcon, Add as AddIcon,
  Search as SearchIcon, FilterList as FilterIcon,
  MoreVert as MoreVertIcon, Edit as EditIcon,
  Delete as DeleteIcon, Visibility as ViewIcon,
  AttachMoney as MoneyIcon, Inventory as InventoryIcon,
  Category as CategoryIcon, Warning as WarningIcon,
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

// ============================================================================
// 📝 ENHANCED FORM TEMPLATE
// ============================================================================

export const EnhancedFormTemplate = ({ 
  item, 
  onClose, 
  title = "Item", 
  moduleName = "products" // Used to determine form type and characteristics
}) => {
  // Get form configuration based on module type
  const formType = getFormType(moduleName);
  const formConfig = getFormTypeConfig(moduleName);
  const layoutConfig = getLayoutConfig(moduleName);
  const formIndicator = getFormTypeIndicator(moduleName);
  
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: hasFeature(moduleName, 'hasStatusToggle') ? true : undefined,
    // Add more fields as needed based on form type
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = `${title} name is required`;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = `${title} name must be at least 2 characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // API call logic here
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth={layoutConfig.dialogSize} 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">
              {item ? `Edit ${title}` : `Create New ${title}`}
            </Typography>
            <Chip
              label={formIndicator.label}
              color={formIndicator.color}
              size="small"
              variant="outlined"
            />
          </Box>
          <Button
            onClick={onClose}
            color="inherit"
            size="small"
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Error Alert */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the errors below
            </Alert>
          )}

          {/* Tabs for Complex Forms */}
          {hasFeature(moduleName, 'hasTabs') && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Basic Info" />
                {formType === FORM_TYPES.TRANSACTION && <Tab label="Line Items" />}
                {formType === FORM_TYPES.REPORTS && <Tab label="Parameters" />}
                <Tab label="Settings" />
                {hasFeature(moduleName, 'hasPreview') && <Tab label="Preview" />}
              </Tabs>
            </Box>
          )}

          {/* Tab Panel 0: Basic Info */}
          {tabValue === 0 && (
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`${title} Name *`}
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab Panel 1: Settings (conditional based on form type) */}
          {((hasFeature(moduleName, 'hasTabs') && tabValue === (formType === FORM_TYPES.TRANSACTION ? 2 : formType === FORM_TYPES.REPORTS ? 2 : 1)) || 
            (!hasFeature(moduleName, 'hasTabs') && tabValue === 1)) && (
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                {hasFeature(moduleName, 'hasStatusToggle') && (
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.is_active || false}
                          onChange={handleChange('is_active')}
                          color="primary"
                        />
                      }
                      label="Active Status"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Active items are visible and can be used
                    </Typography>
                  </Grid>
                )}
                
                {formType === FORM_TYPES.TRANSACTION && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Transaction Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Configure transaction-specific settings here
                    </Typography>
                  </Grid>
                )}
                
                {formType === FORM_TYPES.REPORTS && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Report Configuration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Configure report output and formatting options
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Preview Tab (conditional based on form characteristics) */}
          {hasFeature(moduleName, 'hasPreview') && tabValue === (hasFeature(moduleName, 'hasTabs') ? 
            (formType === FORM_TYPES.TRANSACTION ? 3 : formType === FORM_TYPES.REPORTS ? 3 : 2) : 2) && (
            <Box sx={{ py: 2 }}>
              <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {formType === FORM_TYPES.REPORTS ? 'Report Preview' : `${title} Preview`}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Name:</strong> {formData.name || `Untitled ${title}`}
                    </Typography>
                  </Grid>
                  
                  {formData.description && (
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Description:</strong> {formData.description}
                      </Typography>
                    </Grid>
                  )}
                  
                  {hasFeature(moduleName, 'hasStatusToggle') && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Status:</strong> 
                        <Chip 
                          label={formData.is_active ? 'Active' : 'Inactive'} 
                          color={formData.is_active ? 'success' : 'default'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Form Type:</strong> {formIndicator.label} - {formIndicator.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            size="large"
          >
            {loading ? 'Saving...' : (item ? `Update ${title}` : `Create ${title}`)}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// ============================================================================
// 📊 ENHANCED LIST TEMPLATE
// ============================================================================

export const EnhancedListTemplate = ({ 
  items = [], 
  title = "Items",
  moduleName = "products", // Used to determine form type and characteristics
  onAdd, 
  onEdit, 
  onView, 
  onDelete 
}) => {
  // Get form configuration based on module type
  const formType = getFormType(moduleName);
  const formConfig = getFormTypeConfig(moduleName);
  const layoutConfig = getLayoutConfig(moduleName);
  const formIndicator = getFormTypeIndicator(moduleName);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    is_active: null,
    category: ''
  });

  const itemsPerPage = 10;

  // Filter and search logic
  const filteredItems = items.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!item.name?.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (filters.is_active !== null && item.is_active !== filters.is_active) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ is_active: null, category: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const renderItemCard = (item) => (
    <Card key={item.id} sx={{ mb: 2, '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" flex={1}>
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onChange={() => handleSelectItem(item.id)}
              size="small"
            />
            
            <Avatar
              sx={{ 
                width: 48, 
                height: 48, 
                ml: 1, 
                mr: 2,
                bgcolor: 'primary.light',
                fontSize: '1.2rem'
              }}
            >
              {item.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                <Chip
                  label={item.is_active ? 'Active' : 'Inactive'}
                  color={item.is_active ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              
              {item.description && (
                <Typography variant="body2" color="text.secondary">
                  {item.description.length > 100 
                    ? `${item.description.substring(0, 100)}...` 
                    : item.description}
                </Typography>
              )}
            </Box>
          </Box>
          
          <IconButton
            size="small"
            onClick={(e) => handleMenuClick(e, item)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
            <Chip
              label={formIndicator.label}
              color={formIndicator.color}
              size="small"
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {filteredItems.length} of {items.length} items • {formIndicator.description}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          size="large"
        >
          Add {title.slice(0, -1)}
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
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
          
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <Button variant="outlined" onClick={clearFilters}>
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Filter Options */}
        {showFilters && hasFeature(moduleName, 'hasFilters') && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {hasFeature(moduleName, 'hasStatusToggle') && (
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.is_active === true}
                        onChange={(e) => handleFilterChange('is_active', e.target.checked ? true : null)}
                        size="small"
                      />
                    }
                    label="Active Only"
                  />
                </Grid>
              )}
              
              {formType === FORM_TYPES.TRANSACTION && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              {formType === FORM_TYPES.REPORTS && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={filters.report_type || ''}
                      onChange={(e) => handleFilterChange('report_type', e.target.value)}
                      label="Report Type"
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="summary">Summary</MenuItem>
                      <MenuItem value="detailed">Detailed</MenuItem>
                      <MenuItem value="analytical">Analytical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && hasFeature(moduleName, 'hasBulkActions') && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              {selectedItems.length} item(s) selected
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedItems([])}
            >
              Clear Selection
            </Button>
            
            {formType === FORM_TYPES.MASTER && (
              <>
                <Button size="small" variant="outlined" color="success">
                  Activate
                </Button>
                <Button size="small" variant="outlined" color="warning">
                  Deactivate
                </Button>
              </>
            )}
            
            {hasFeature(moduleName, 'hasExport') && (
              <Button size="small" variant="outlined" color="info">
                Export Selected
              </Button>
            )}
          </Box>
        </Paper>
      )}

      {/* Items List */}
      {paginatedItems.length > 0 ? (
        <>
          {/* Select All */}
          <Box mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                  indeterminate={selectedItems.length > 0 && selectedItems.length < filteredItems.length}
                  onChange={handleSelectAll}
                />
              }
              label={`Select All (${filteredItems.length} items)`}
            />
          </Box>

          {/* Item Cards */}
          {paginatedItems.map(renderItemCard)}

          {/* Pagination */}
          {totalPages > 1 && hasFeature(moduleName, 'hasPagination') && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery || Object.values(filters).some(v => v !== '' && v !== null) 
              ? `No ${title.toLowerCase()} found matching your criteria` 
              : `No ${title.toLowerCase()} found`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery || Object.values(filters).some(v => v !== '' && v !== null)
              ? 'Try adjusting your search or filters'
              : `Click "Add ${title.slice(0, -1)}" to create your first item`}
          </Typography>
        </Paper>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onView(selectedItem); handleMenuClose(); }}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => { onEdit(selectedItem); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Item
        </MenuItem>
        <MenuItem onClick={() => { onDelete(selectedItem?.id); handleMenuClose(); }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Item
        </MenuItem>
      </Menu>
    </Box>
  );
};

// ============================================================================
// 🎨 UTILITY FUNCTIONS
// ============================================================================

export const getStatusColor = (status) => {
  const statusColors = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
    error: 'error',
    info: 'info'
  };
  return statusColors[status] || 'default';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

export const formatPercentage = (value) => {
  return `${(value || 0).toFixed(1)}%`;
};

// ============================================================================
// 📝 USAGE EXAMPLES
// ============================================================================

/*
// ============================================================================
// 📋 USAGE EXAMPLES WITH FORM CATEGORIZATION
// ============================================================================

// MASTER DATA EXAMPLE (Customers)
import { EnhancedFormTemplate, EnhancedListTemplate } from '../templates/ComponentTemplates';

const CustomersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const customers = []; // Your data here

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <EnhancedListTemplate
          items={customers}
          title="Customers"
          moduleName="customers" // This determines it's a MASTER form
          onAdd={() => setShowForm(true)}
          onEdit={(customer) => { setSelectedCustomer(customer); setShowForm(true); }}
          onView={(customer) => console.log('View:', customer)}
          onDelete={(id) => console.log('Delete:', id)}
        />

        {showForm && (
          <EnhancedFormTemplate
            item={selectedCustomer}
            title="Customer"
            moduleName="customers" // Enables Master form features
            onClose={() => { setShowForm(false); setSelectedCustomer(null); }}
          />
        )}
      </Box>
    </Container>
  );
};

// TRANSACTION EXAMPLE (Sales)
const SalesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const sales = []; // Your data here

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <EnhancedListTemplate
          items={sales}
          title="Sales"
          moduleName="sales" // This determines it's a TRANSACTION form
          onAdd={() => setShowForm(true)}
          onEdit={(sale) => { setSelectedSale(sale); setShowForm(true); }}
          onView={(sale) => console.log('View:', sale)}
          onDelete={(id) => console.log('Delete:', id)}
        />

        {showForm && (
          <EnhancedFormTemplate
            item={selectedSale}
            title="Sale"
            moduleName="sales" // Enables Transaction form features (XL dialog, workflow tabs)
            onClose={() => { setShowForm(false); setSelectedSale(null); }}
          />
        )}
      </Box>
    </Container>
  );
};

// REPORTS EXAMPLE (Sales Reports)
const SalesReportsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const reports = []; // Your data here

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <EnhancedListTemplate
          items={reports}
          title="Sales Reports"
          moduleName="sales_reports" // This determines it's a REPORTS form
          onAdd={() => setShowForm(true)}
          onEdit={(report) => { setSelectedReport(report); setShowForm(true); }}
          onView={(report) => console.log('View:', report)}
          onDelete={(id) => console.log('Delete:', id)}
        />

        {showForm && (
          <EnhancedFormTemplate
            item={selectedReport}
            title="Sales Report"
            moduleName="sales_reports" // Enables Report form features (Parameters tab, no status toggle)
            onClose={() => { setShowForm(false); setSelectedReport(null); }}
          />
        )}
      </Box>
    </Container>
  );
};

// ============================================================================
// 🎯 AUTOMATIC FEATURES BASED ON MODULE TYPE
// ============================================================================

// When you specify moduleName="customers" (MASTER):
// ✅ Large dialog (lg)
// ✅ Tabs: Basic Info → Settings → Preview
// ✅ Status toggle (Active/Inactive)
// ✅ Search and filters enabled
// ✅ Bulk actions (Activate, Deactivate, Export)
// ✅ Pagination enabled
// ✅ Professional card layout with avatars

// When you specify moduleName="sales" (TRANSACTION):
// ✅ Extra large dialog (xl)
// ✅ Tabs: Basic Info → Line Items → Settings → Preview
// ✅ No status toggle (managed by workflow)
// ✅ Transaction-specific filters (Status: Draft, Pending, Approved)
// ✅ No bulk actions (transactions are individual)
// ✅ Pagination enabled
// ✅ Transaction card layout

// When you specify moduleName="sales_reports" (REPORTS):
// ✅ Large dialog (lg)
// ✅ Tabs: Basic Info → Parameters → Settings → Preview
// ✅ No status toggle
// ✅ Report-specific filters (Report Type: Summary, Detailed)
// ✅ No bulk actions
// ✅ No pagination (limited report configs)
// ✅ Simple card layout
*/
