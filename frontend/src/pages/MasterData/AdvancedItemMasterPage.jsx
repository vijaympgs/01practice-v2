import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Inventory as InventoryIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  Business as BusinessIcon,
  Inventory2 as PackageIcon,
  SwapHoriz as SwapHorizIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Description as DescriptionIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const AdvancedItemMasterPage = () => {
  const [items, setItems] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Tab 2: Attributes
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState({ attribute_name: '', attribute_value: '' });
  
  // Tab 3: Package
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ package_code: '', package_name: '', package_type: '', package_description: '', package_uom: '', package_quantity: 1, package_price: 0, package_cost: 0 });
  
  // Tab 4: UOM Conversion
  const [conversions, setConversions] = useState([]);
  
  // Tab 5: Secondary Supplier
  const [secondarySuppliers, setSecondarySuppliers] = useState([]);
  const [newSecondarySupplier, setNewSecondarySupplier] = useState({ supplier_code: '', supplier_name: '', supplier_item_code: '', supplier_item_description: '', country: '', priority: 1, lead_time: 0, minimum_order_qty: 0, cost_price: 0 });
  
  // Tab 6: Alternate Items
  const [alternateItems, setAlternateItems] = useState([]);
  const [newAlternateItem, setNewAlternateItem] = useState({ alternate_item: '', substitution_reason: '', priority: 1, auto_substitute: false, allow_package_substitution: false });
  
  // Tab 7: Component Mapping
  const [components, setComponents] = useState([]);
  const [newComponent, setNewComponent] = useState({ component_item: '', component_type: 'accessory', quantity: 1, mandatory: false });
  
  // Tab 8: Tax Details
  const [taxDetails, setTaxDetails] = useState([]);
  const [newTaxDetail, setNewTaxDetail] = useState({ tax_code: '', tax_slab: '', tax_type: '', tax_rate: 0, tax_inclusive: false, country: '', state: '', city: '', applicable_from: '', applicable_to: '' });
  
  // Tab 9: Specifications
  const [specifications, setSpecifications] = useState([]);
  const [newSpecification, setNewSpecification] = useState({ specifications: '', technical_details: '', additional_notes: '' });
  
  // Tab 10: Price Details
  const [priceHistory, setPriceHistory] = useState([]);
  const [newPriceDetail, setNewPriceDetail] = useState({ uom: '', price: 0, cost: 0, margin_percentage: 0, effective_date: new Date().toISOString().split('T')[0] });

  // Form state - Tab 1: General
  const [form, setForm] = useState({
    // General Information
    item_code: '',
    item_name: '',
    short_name: '',
    supplier: '',
    manufacturer: '',
    division: '',
    department: '',
    group: '',
    item_status: 'active',
    item_type: 'merchandise',
    stock_valuation_method: 'fifo',
    stock_issue_type: 'fifo',
    default_price_type: 'retail',
    movement_type: 'medium',
    taxable: true,
    batch_item_flag: false,
    pack_items: false,
    weighted_article_flag: false,
    serialized_item_flag: false,
    item_part_flag: false,
    accessory_flag: false,
    warranty_flag: false,
    warranty_type: 'none',
    warranty_period: 0,
    extended_warranty_type: '',
    extended_warranty_period: 0,
    warranty_in_months: 0,
    extended_warranty_details: '',
    hs_code: '',
    stock_uom: '',
    purchase_uom: '',
    sales_uom: '',
    item_image: null,
    weighted_average_cost: 0,
    is_active: true,
  });

  const itemTypeOptions = [
    { value: 'merchandise', label: 'Merchandise Item' },
    { value: 'non_merchandise', label: 'Non-Merchandise Item' },
    { value: 'non_physical', label: 'Non-Physical' },
  ];

  const valuationMethodOptions = [
    { value: 'fifo', label: 'First-In First-Out (FIFO)' },
    { value: 'lifo', label: 'Last-In Last-Out (LIFO)' },
    { value: 'average', label: 'Average Cost' },
  ];

  const issueTypeOptions = [
    { value: 'fifo', label: 'FIFO' },
    { value: 'lifo', label: 'LIFO' },
  ];

  const priceTypeOptions = [
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'customer_specific', label: 'Customer Specific' },
  ];

  const movementTypeOptions = [
    { value: 'fast', label: 'Fast Moving' },
    { value: 'medium', label: 'Medium Moving' },
    { value: 'slow', label: 'Slow Moving' },
  ];

  const warrantyTypeOptions = [
    { value: 'manufacturer', label: 'Manufacturer Warranty' },
    { value: 'extended', label: 'Extended Warranty' },
    { value: 'none', label: 'No Warranty' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    if (token) {
      loadData();
      loadUOMs();
    }
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
      const response = await api.get('/products/advanced-item-master/');
      setItems(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading Advanced Item Master data:', error);
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication expired. Please log in again.',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error loading Advanced Item Master data. Please try again.',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    setEditingItem(item);
    setTabValue(0);
    
    if (item) {
      // Edit mode - populate form
      setForm({
        item_code: item.item_code || '',
        item_name: item.item_name || '',
        short_name: item.short_name || '',
        supplier: item.supplier || '',
        manufacturer: item.manufacturer || '',
        division: item.division || '',
        department: item.department || '',
        group: item.group || '',
        item_status: item.item_status || 'active',
        item_type: item.item_type || 'merchandise',
        stock_valuation_method: item.stock_valuation_method || 'fifo',
        stock_issue_type: item.stock_issue_type || 'fifo',
        default_price_type: item.default_price_type || 'retail',
        movement_type: item.movement_type || 'medium',
        taxable: item.taxable !== false,
        batch_item_flag: item.batch_item_flag || false,
        pack_items: item.pack_items || false,
        weighted_article_flag: item.weighted_article_flag || false,
        serialized_item_flag: item.serialized_item_flag || false,
        item_part_flag: item.item_part_flag || false,
        accessory_flag: item.accessory_flag || false,
        warranty_flag: item.warranty_flag || false,
        warranty_type: item.warranty_type || 'none',
        warranty_period: item.warranty_period || 0,
        extended_warranty_type: item.extended_warranty_type || '',
        extended_warranty_period: item.extended_warranty_period || 0,
        warranty_in_months: item.warranty_in_months || 0,
        extended_warranty_details: item.extended_warranty_details || '',
        hs_code: item.hs_code || '',
        stock_uom: item.stock_uom || '',
        purchase_uom: item.purchase_uom || '',
        sales_uom: item.sales_uom || '',
        item_image: null,
        weighted_average_cost: item.weighted_average_cost || 0,
        is_active: item.is_active !== false,
      });
    } else {
      // Add mode - reset form
      setForm({
        item_code: '',
        item_name: '',
        short_name: '',
        supplier: '',
        manufacturer: '',
        division: '',
        department: '',
        group: '',
        item_status: 'active',
        item_type: 'merchandise',
        stock_valuation_method: 'fifo',
        stock_issue_type: 'fifo',
        default_price_type: 'retail',
        movement_type: 'medium',
        taxable: true,
        batch_item_flag: false,
        pack_items: false,
        weighted_article_flag: false,
        serialized_item_flag: false,
        item_part_flag: false,
        accessory_flag: false,
        warranty_flag: false,
        warranty_type: 'none',
        warranty_period: 0,
        extended_warranty_type: '',
        extended_warranty_period: 0,
        warranty_in_months: 0,
        extended_warranty_details: '',
        hs_code: '',
        stock_uom: '',
        purchase_uom: '',
        sales_uom: '',
        item_image: null,
        weighted_average_cost: 0,
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setTabValue(0);
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
      if (!form.item_code.trim()) {
        setSnackbar({
          open: true,
          message: 'Item Code is required',
          severity: 'error',
        });
        return;
      }

      if (!form.item_name.trim()) {
        setSnackbar({
          open: true,
          message: 'Item Name is required',
          severity: 'error',
        });
        return;
      }

      const dataToSend = {
        ...form,
        warranty_period: parseInt(form.warranty_period) || 0,
        extended_warranty_period: parseInt(form.extended_warranty_period) || 0,
        warranty_in_months: parseInt(form.warranty_in_months) || 0,
        weighted_average_cost: parseFloat(form.weighted_average_cost) || 0,
      };

      if (editingItem) {
        await api.put(`/products/advanced-item-master/${editingItem.id}/`, dataToSend);
        setSnackbar({
          open: true,
          message: 'Advanced Item updated successfully!',
          severity: 'success',
        });
      } else {
        await api.post('/products/advanced-item-master/', dataToSend);
        setSnackbar({
          open: true,
          message: 'Advanced Item created successfully!',
          severity: 'success',
        });
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error saving Advanced Item:', error);
      console.error('Error details:', error.response?.data);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error saving Advanced Item. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Advanced Item?')) {
      try {
        await api.delete(`/products/advanced-item-master/${id}/`);
        setSnackbar({
          open: true,
          message: 'Advanced Item deleted successfully!',
          severity: 'success',
        });
        loadData();
      } catch (error) {
        console.error('Error deleting Advanced Item:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting Advanced Item. Please try again.',
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
          Please log in to access the Advanced Item Master.
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
      <PageTitle 
        title="Advanced Item Master"
        subtitle="Comprehensive item management with advanced features"
      />

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Card Header */}
        <CardHeader title="List">
          <ActionButton
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Add Advanced Item
          </ActionButton>
        </CardHeader>

        <CardContent sx={{ p: 0 }}>
          {/* Data Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Item Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Manufacturer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Division</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Group</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InventoryIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" fontWeight="medium">
                          {item.item_code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>{item.supplier || '-'}</TableCell>
                    <TableCell>{item.manufacturer || '-'}</TableCell>
                    <TableCell>{item.division || '-'}</TableCell>
                    <TableCell>{item.department || '-'}</TableCell>
                    <TableCell>{item.group || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.is_active ? 'Active' : 'Inactive'}
                        color={item.is_active ? 'success' : 'default'}
                        size="small"
                        sx={{ borderRadius: 2 }}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogHeader 
          title={`${editingItem ? 'Edit' : 'Add'} Advanced Item`}
          icon={<InventoryIcon />}
        />
        <DialogContent sx={{ p: 0 }}>
          {/* Tabs */}
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
          >
            <Tab label="General" icon={<InfoIcon />} iconPosition="start" />
            <Tab label="Attributes" icon={<CategoryIcon />} iconPosition="start" />
            <Tab label="Package" icon={<PackageIcon />} iconPosition="start" />
            <Tab label="UOM & Conversion" icon={<SwapHorizIcon />} iconPosition="start" />
            <Tab label="Secondary Supplier" icon={<PeopleIcon />} iconPosition="start" />
            <Tab label="Alternate Items" icon={<BusinessIcon />} iconPosition="start" />
            <Tab label="Component Mapping" icon={<SettingsIcon />} iconPosition="start" />
            <Tab label="Tax Details" icon={<LocalOfferIcon />} iconPosition="start" />
            <Tab label="Specifications" icon={<DescriptionIcon />} iconPosition="start" />
            <Tab label="Price Details" icon={<TimelineIcon />} iconPosition="start" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {/* Tab 1: General */}
            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    General Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Item Code"
                    value={form.item_code}
                    onChange={handleInputChange('item_code')}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    value={form.item_name}
                    onChange={handleInputChange('item_name')}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Short Name"
                    value={form.short_name}
                    onChange={handleInputChange('short_name')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Supplier"
                    value={form.supplier}
                    onChange={handleInputChange('supplier')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Manufacturer"
                    value={form.manufacturer}
                    onChange={handleInputChange('manufacturer')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Division"
                    value={form.division}
                    onChange={handleInputChange('division')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={form.department}
                    onChange={handleInputChange('department')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Group"
                    value={form.group}
                    onChange={handleInputChange('group')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                {/* Status and Type */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                    Status and Type
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Item Status</InputLabel>
                    <Select
                      value={form.item_status}
                      onChange={handleInputChange('item_status')}
                      label="Item Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="hold">Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Item Type</InputLabel>
                    <Select
                      value={form.item_type}
                      onChange={handleInputChange('item_type')}
                      label="Item Type"
                    >
                      {itemTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Inventory Management */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                    Inventory Management
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Stock Valuation Method</InputLabel>
                    <Select
                      value={form.stock_valuation_method}
                      onChange={handleInputChange('stock_valuation_method')}
                      label="Stock Valuation Method"
                    >
                      {valuationMethodOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Stock Issue Type</InputLabel>
                    <Select
                      value={form.stock_issue_type}
                      onChange={handleInputChange('stock_issue_type')}
                      label="Stock Issue Type"
                    >
                      {issueTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Default Price Type</InputLabel>
                    <Select
                      value={form.default_price_type}
                      onChange={handleInputChange('default_price_type')}
                      label="Default Price Type"
                    >
                      {priceTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Movement Type</InputLabel>
                    <Select
                      value={form.movement_type}
                      onChange={handleInputChange('movement_type')}
                      label="Movement Type"
                    >
                      {movementTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Flags */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                    Item Flags
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.taxable}
                        onChange={handleInputChange('taxable')}
                        color="primary"
                      />
                    }
                    label="Taxable"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.batch_item_flag}
                        onChange={handleInputChange('batch_item_flag')}
                        color="primary"
                      />
                    }
                    label="Batch Item Flag"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.pack_items}
                        onChange={handleInputChange('pack_items')}
                        color="primary"
                      />
                    }
                    label="Pack Items"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.weighted_article_flag}
                        onChange={handleInputChange('weighted_article_flag')}
                        color="primary"
                      />
                    }
                    label="Weighted Article Flag"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.serialized_item_flag}
                        onChange={handleInputChange('serialized_item_flag')}
                        color="primary"
                      />
                    }
                    label="Serialized Item Flag"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.item_part_flag}
                        onChange={handleInputChange('item_part_flag')}
                        color="primary"
                      />
                    }
                    label="Item Part Flag"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.accessory_flag}
                        onChange={handleInputChange('accessory_flag')}
                        color="primary"
                      />
                    }
                    label="Accessory Flag"
                  />
                </Grid>
                
                {/* Warranty */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                    Warranty Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.warranty_flag}
                        onChange={handleInputChange('warranty_flag')}
                        color="primary"
                      />
                    }
                    label="Warranty Flag"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Warranty Type</InputLabel>
                    <Select
                      value={form.warranty_type}
                      onChange={handleInputChange('warranty_type')}
                      label="Warranty Type"
                    >
                      {warrantyTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Warranty Period"
                    type="number"
                    value={form.warranty_period}
                    onChange={handleInputChange('warranty_period')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Extended Warranty Type"
                    value={form.extended_warranty_type}
                    onChange={handleInputChange('extended_warranty_type')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Extended Warranty Period"
                    type="number"
                    value={form.extended_warranty_period}
                    onChange={handleInputChange('extended_warranty_period')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Warranty In Months"
                    type="number"
                    value={form.warranty_in_months}
                    onChange={handleInputChange('warranty_in_months')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Extended Warranty Details"
                    value={form.extended_warranty_details}
                    onChange={handleInputChange('extended_warranty_details')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                {/* HS Code and UOMs */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                    Trade and UOM Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="HS Code"
                    value={form.hs_code}
                    onChange={handleInputChange('hs_code')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Stock UOM</InputLabel>
                    <Select
                      value={form.stock_uom}
                      onChange={handleInputChange('stock_uom')}
                      label="Stock UOM"
                    >
                      {uoms.map((uom) => (
                        <MenuItem key={uom.id} value={uom.id}>
                          {uom.code} - {uom.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Purchase UOM</InputLabel>
                    <Select
                      value={form.purchase_uom}
                      onChange={handleInputChange('purchase_uom')}
                      label="Purchase UOM"
                    >
                      {uoms.map((uom) => (
                        <MenuItem key={uom.id} value={uom.id}>
                          {uom.code} - {uom.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <InputLabel>Sales UOM</InputLabel>
                    <Select
                      value={form.sales_uom}
                      onChange={handleInputChange('sales_uom')}
                      label="Sales UOM"
                    >
                      {uoms.map((uom) => (
                        <MenuItem key={uom.id} value={uom.id}>
                          {uom.code} - {uom.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Status */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                    Status
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.is_active}
                        onChange={handleInputChange('is_active')}
                        color="primary"
                      />
                    }
                    label="Active"
                    sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                  />
                </Grid>
              </Grid>
            )}

            {/* Tab 2: Attributes */}
            {tabValue === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Item Attributes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Define custom attributes for this item
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Add Attribute Form */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label="Attribute Name"
                          value={newAttribute.attribute_name}
                          onChange={(e) => setNewAttribute({ ...newAttribute, attribute_name: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label="Attribute Value"
                          value={newAttribute.attribute_value}
                          onChange={(e) => setNewAttribute({ ...newAttribute, attribute_value: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            if (newAttribute.attribute_name && newAttribute.attribute_value) {
                              setAttributes([...attributes, { ...newAttribute, id: Date.now() }]);
                              setNewAttribute({ attribute_name: '', attribute_value: '' });
                            }
                          }}
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                
                {/* Attributes List */}
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Attribute Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Attribute Value</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {attributes.map((attr, index) => (
                          <TableRow key={attr.id || index}>
                            <TableCell>{attr.attribute_name}</TableCell>
                            <TableCell>{attr.attribute_value}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => setAttributes(attributes.filter((_, i) => i !== index))}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {attributes.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No attributes added yet
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {/* Tab 3: Package */}
            {tabValue === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Package Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Define package details and components
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Add Package Form */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Package Code"
                          value={newPackage.package_code}
                          onChange={(e) => setNewPackage({ ...newPackage, package_code: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Package Name"
                          value={newPackage.package_name}
                          onChange={(e) => setNewPackage({ ...newPackage, package_name: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Package Type"
                          value={newPackage.package_type}
                          onChange={(e) => setNewPackage({ ...newPackage, package_type: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Package UOM</InputLabel>
                          <Select
                            value={newPackage.package_uom}
                            onChange={(e) => setNewPackage({ ...newPackage, package_uom: e.target.value })}
                            label="Package UOM"
                          >
                            {uoms.map((uom) => (
                              <MenuItem key={uom.id} value={uom.id}>
                                {uom.code} - {uom.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Package Quantity"
                          type="number"
                          value={newPackage.package_quantity}
                          onChange={(e) => setNewPackage({ ...newPackage, package_quantity: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Package Price"
                          type="number"
                          value={newPackage.package_price}
                          onChange={(e) => setNewPackage({ ...newPackage, package_price: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Package Cost"
                          type="number"
                          value={newPackage.package_cost}
                          onChange={(e) => setNewPackage({ ...newPackage, package_cost: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Package Description"
                          value={newPackage.package_description}
                          onChange={(e) => setNewPackage({ ...newPackage, package_description: e.target.value })}
                          size="small"
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            if (newPackage.package_code && newPackage.package_name) {
                              setPackages([...packages, { ...newPackage, id: Date.now() }]);
                              setNewPackage({ package_code: '', package_name: '', package_type: '', package_description: '', package_uom: '', package_quantity: 1, package_price: 0, package_cost: 0 });
                            }
                          }}
                        >
                          Add Package
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                
                {/* Packages List */}
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Package Code</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Package Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Cost</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {packages.map((pkg, index) => (
                          <TableRow key={pkg.id || index}>
                            <TableCell>{pkg.package_code}</TableCell>
                            <TableCell>{pkg.package_name}</TableCell>
                            <TableCell>{pkg.package_type || '-'}</TableCell>
                            <TableCell>{pkg.package_quantity}</TableCell>
                            <TableCell>{pkg.package_price}</TableCell>
                            <TableCell>{pkg.package_cost}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => setPackages(packages.filter((_, i) => i !== index))}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {packages.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No packages added yet
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {/* Tab 4: UOM & Conversion */}
            {tabValue === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    UOM & Conversion
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Manage unit conversions for this item
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 5 }}>
                    <SwapHorizIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      UOM Conversion Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Conversion factors between different UOMs will be managed here
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      This will use the UOM Conversion master data
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Tab 5: Secondary Supplier */}
            {tabValue === 4 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Secondary Supplier Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Manage alternative suppliers for this item
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Add Secondary Supplier Form */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Supplier Code"
                          value={newSecondarySupplier.supplier_code}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, supplier_code: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Supplier Name"
                          value={newSecondarySupplier.supplier_name}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, supplier_name: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Supplier Item Code"
                          value={newSecondarySupplier.supplier_item_code}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, supplier_item_code: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={newSecondarySupplier.country}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, country: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Priority"
                          type="number"
                          value={newSecondarySupplier.priority}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, priority: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Lead Time (days)"
                          type="number"
                          value={newSecondarySupplier.lead_time}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, lead_time: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Minimum Order Qty"
                          type="number"
                          value={newSecondarySupplier.minimum_order_qty}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, minimum_order_qty: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Cost Price"
                          type="number"
                          value={newSecondarySupplier.cost_price}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, cost_price: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Supplier Item Description"
                          value={newSecondarySupplier.supplier_item_description}
                          onChange={(e) => setNewSecondarySupplier({ ...newSecondarySupplier, supplier_item_description: e.target.value })}
                          size="small"
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            if (newSecondarySupplier.supplier_code && newSecondarySupplier.supplier_name) {
                              setSecondarySuppliers([...secondarySuppliers, { ...newSecondarySupplier, id: Date.now() }]);
                              setNewSecondarySupplier({ supplier_code: '', supplier_name: '', supplier_item_code: '', supplier_item_description: '', country: '', priority: 1, lead_time: 0, minimum_order_qty: 0, cost_price: 0 });
                            }
                          }}
                        >
                          Add Secondary Supplier
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                
                {/* Secondary Suppliers List */}
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Supplier Code</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Supplier Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Item Code</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Lead Time</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Cost Price</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {secondarySuppliers.map((supplier, index) => (
                          <TableRow key={supplier.id || index}>
                            <TableCell>{supplier.supplier_code}</TableCell>
                            <TableCell>{supplier.supplier_name}</TableCell>
                            <TableCell>{supplier.supplier_item_code || '-'}</TableCell>
                            <TableCell>{supplier.country || '-'}</TableCell>
                            <TableCell>{supplier.priority}</TableCell>
                            <TableCell>{supplier.lead_time} days</TableCell>
                            <TableCell>{supplier.cost_price}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => setSecondarySuppliers(secondarySuppliers.filter((_, i) => i !== index))}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {secondarySuppliers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No secondary suppliers added yet
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {/* Tab 6: Alternate Items */}
            {tabValue === 5 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Alternate Items Mapping
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Define substitute items for out-of-stock scenarios
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Add Alternate Item Form */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Alternate Item Code"
                          value={newAlternateItem.alternate_item}
                          onChange={(e) => setNewAlternateItem({ ...newAlternateItem, alternate_item: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Substitution Reason"
                          value={newAlternateItem.substitution_reason}
                          onChange={(e) => setNewAlternateItem({ ...newAlternateItem, substitution_reason: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Priority"
                          type="number"
                          value={newAlternateItem.priority}
                          onChange={(e) => setNewAlternateItem({ ...newAlternateItem, priority: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={newAlternateItem.auto_substitute}
                              onChange={(e) => setNewAlternateItem({ ...newAlternateItem, auto_substitute: e.target.checked })}
                            />
                          }
                          label="Auto Substitute"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={newAlternateItem.allow_package_substitution}
                              onChange={(e) => setNewAlternateItem({ ...newAlternateItem, allow_package_substitution: e.target.checked })}
                            />
                          }
                          label="Allow Package Substitution"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            if (newAlternateItem.alternate_item) {
                              setAlternateItems([...alternateItems, { ...newAlternateItem, id: Date.now() }]);
                              setNewAlternateItem({ alternate_item: '', substitution_reason: '', priority: 1, auto_substitute: false, allow_package_substitution: false });
                            }
                          }}
                        >
                          Add Alternate Item
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                
                {/* Alternate Items List */}
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Alternate Item</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Auto Substitute</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Package Substitution</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {alternateItems.map((item, index) => (
                          <TableRow key={item.id || index}>
                            <TableCell>{item.alternate_item}</TableCell>
                            <TableCell>{item.substitution_reason || '-'}</TableCell>
                            <TableCell>{item.priority}</TableCell>
                            <TableCell>{item.auto_substitute ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{item.allow_package_substitution ? 'Yes' : 'No'}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => setAlternateItems(alternateItems.filter((_, i) => i !== index))}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {alternateItems.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No alternate items added yet
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {/* Tab 7: Component Mapping */}
            {tabValue === 6 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Component Mapping
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Map accessories, parts, and pack items
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Add Component Form */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Component Item Code"
                          value={newComponent.component_item}
                          onChange={(e) => setNewComponent({ ...newComponent, component_item: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Component Type</InputLabel>
                          <Select
                            value={newComponent.component_type}
                            onChange={(e) => setNewComponent({ ...newComponent, component_type: e.target.value })}
                            label="Component Type"
                          >
                            <MenuItem value="accessory">Accessory</MenuItem>
                            <MenuItem value="item_part">Item Part</MenuItem>
                            <MenuItem value="pack_item">Pack Item</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={newComponent.quantity}
                          onChange={(e) => setNewComponent({ ...newComponent, quantity: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={newComponent.mandatory}
                              onChange={(e) => setNewComponent({ ...newComponent, mandatory: e.target.checked })}
                            />
                          }
                          label="Mandatory"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            if (newComponent.component_item) {
                              setComponents([...components, { ...newComponent, id: Date.now() }]);
                              setNewComponent({ component_item: '', component_type: 'accessory', quantity: 1, mandatory: false });
                            }
                          }}
                        >
                          Add Component
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                
                {/* Components List */}
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Component Item</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Component Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Mandatory</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {components.map((comp, index) => (
                          <TableRow key={comp.id || index}>
                            <TableCell>{comp.component_item}</TableCell>
                            <TableCell>
                              <Chip label={comp.component_type} size="small" />
                            </TableCell>
                            <TableCell>{comp.quantity}</TableCell>
                            <TableCell>{comp.mandatory ? 'Yes' : 'No'}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => setComponents(components.filter((_, i) => i !== index))}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {components.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No components added yet
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {/* Tab 8: Tax Details */}
            {tabValue === 7 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Tax Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Manage tax plans and tax details for this item
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Add Tax Detail Form */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tax Code"
                          value={newTaxDetail.tax_code}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, tax_code: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tax Slab"
                          value={newTaxDetail.tax_slab}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, tax_slab: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tax Type"
                          value={newTaxDetail.tax_type}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, tax_type: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tax Rate (%)"
                          type="number"
                          value={newTaxDetail.tax_rate}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, tax_rate: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={newTaxDetail.country}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, country: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="State"
                          value={newTaxDetail.state}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, state: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="City"
                          value={newTaxDetail.city}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, city: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Applicable From"
                          type="date"
                          value={newTaxDetail.applicable_from}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, applicable_from: e.target.value })}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Applicable To"
                          type="date"
                          value={newTaxDetail.applicable_to}
                          onChange={(e) => setNewTaxDetail({ ...newTaxDetail, applicable_to: e.target.value })}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={newTaxDetail.tax_inclusive}
                              onChange={(e) => setNewTaxDetail({ ...newTaxDetail, tax_inclusive: e.target.checked })}
                            />
                          }
                          label="Tax Inclusive"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            if (newTaxDetail.tax_code) {
                              setTaxDetails([...taxDetails, { ...newTaxDetail, id: Date.now() }]);
                              setNewTaxDetail({ tax_code: '', tax_slab: '', tax_type: '', tax_rate: 0, tax_inclusive: false, country: '', state: '', city: '', applicable_from: '', applicable_to: '' });
                            }
                          }}
                        >
                          Add Tax Detail
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                
                {/* Tax Details List */}
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Tax Code</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Tax Slab</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Tax Rate</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>State</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Tax Inclusive</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {taxDetails.map((tax, index) => (
                          <TableRow key={tax.id || index}>
                            <TableCell>{tax.tax_code}</TableCell>
                            <TableCell>{tax.tax_slab || '-'}</TableCell>
                            <TableCell>{tax.tax_rate}%</TableCell>
                            <TableCell>{tax.country || '-'}</TableCell>
                            <TableCell>{tax.state || '-'}</TableCell>
                            <TableCell>{tax.city || '-'}</TableCell>
                            <TableCell>{tax.tax_inclusive ? 'Yes' : 'No'}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => setTaxDetails(taxDetails.filter((_, i) => i !== index))}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {taxDetails.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No tax details added yet
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {/* Tab 9: Specifications */}
            {tabValue === 8 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Item Specifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add technical details and specifications
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specifications"
                    value={newSpecification.specifications}
                    onChange={(e) => setNewSpecification({ ...newSpecification, specifications: e.target.value })}
                    multiline
                    rows={6}
                    placeholder="Enter detailed specifications for this item..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Technical Details"
                    value={newSpecification.technical_details}
                    onChange={(e) => setNewSpecification({ ...newSpecification, technical_details: e.target.value })}
                    multiline
                    rows={4}
                    placeholder="Enter technical details..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    value={newSpecification.additional_notes}
                    onChange={(e) => setNewSpecification({ ...newSpecification, additional_notes: e.target.value })}
                    multiline
                    rows={3}
                    placeholder="Enter any additional notes..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => {
                      if (newSpecification.specifications) {
                        setSpecifications([{ ...newSpecification, id: Date.now() }]);
                        setSnackbar({ open: true, message: 'Specifications saved successfully!', severity: 'success' });
                      }
                    }}
                  >
                    Save Specifications
                  </Button>
                </Grid>
              </Grid>
            )}

            {/* Tab 10: Price Details */}
            {tabValue === 9 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Price Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Manage UOM-wise pricing and price history
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Add Price Detail Form */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>UOM</InputLabel>
                          <Select
                            value={newPriceDetail.uom}
                            onChange={(e) => setNewPriceDetail({ ...newPriceDetail, uom: e.target.value })}
                            label="UOM"
                          >
                            {uoms.map((uom) => (
                              <MenuItem key={uom.id} value={uom.id}>
                                {uom.code} - {uom.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Effective Date"
                          type="date"
                          value={newPriceDetail.effective_date}
                          onChange={(e) => setNewPriceDetail({ ...newPriceDetail, effective_date: e.target.value })}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Price"
                          type="number"
                          value={newPriceDetail.price}
                          onChange={(e) => setNewPriceDetail({ ...newPriceDetail, price: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Cost"
                          type="number"
                          value={newPriceDetail.cost}
                          onChange={(e) => setNewPriceDetail({ ...newPriceDetail, cost: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Margin %"
                          type="number"
                          value={newPriceDetail.margin_percentage}
                          onChange={(e) => setNewPriceDetail({ ...newPriceDetail, margin_percentage: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            if (newPriceDetail.uom && newPriceDetail.price) {
                              setPriceHistory([...priceHistory, { ...newPriceDetail, id: Date.now() }]);
                              setNewPriceDetail({ uom: '', price: 0, cost: 0, margin_percentage: 0, effective_date: new Date().toISOString().split('T')[0] });
                            }
                          }}
                        >
                          Add Price Detail
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                
                {/* Price History List */}
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>UOM</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Cost</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Margin %</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Effective Date</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {priceHistory.map((price, index) => (
                          <TableRow key={price.id || index}>
                            <TableCell>{price.uom}</TableCell>
                            <TableCell>{price.price}</TableCell>
                            <TableCell>{price.cost}</TableCell>
                            <TableCell>{price.margin_percentage}%</TableCell>
                            <TableCell>{price.effective_date}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => setPriceHistory(priceHistory.filter((_, i) => i !== index))}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {priceHistory.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No price details added yet
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCloseDialog}
            startIcon={<CancelIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
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

export default AdvancedItemMasterPage;

