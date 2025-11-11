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
import ActionButton from '../../components/common/ActionButton';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Inventory as InventoryIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import CategoryDialog from '../../components/MasterData/CategoryDialog';
import SubCategoryDialog from '../../components/MasterData/SubCategoryDialog';

const ItemMasterPage = () => {
  const [items, setItems] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemCategories, setItemCategories] = useState([]);
  const [itemSubCategories, setItemSubCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [themeColor, setThemeColor] = useState('#1976d2');
  
  // Dialog states
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openSubCategoryDialog, setOpenSubCategoryDialog] = useState(false);

  // Filter states
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // Form state
  const [form, setForm] = useState({
    // General
    ean_upc_code: '',
    item_code: '',
    item_name: '',
    short_name: '',
    brand: '',
    supplier: '',
    
    // Pricing
    cost_price: '',
    landing_cost: '',
    sell_price: '',
    mrp: '',
    store_pickup: false,
    sales_margin: '',
    
    // Taxes
    tax_inclusive: false,
    
    // Sales
    allow_buy_back: false,
    allow_negative_stock: false,
    
    // Packing
    base_uom: '',
    purchase_uom: '',
    sales_uom: '',
    
    // Category
    category: '',
    item_category: '',
    item_subcategory: '',
    
    // Local Tax (GST)
    tax_code: '',
    hsn_code: '',
    tax_slab: '',
    
    // Item Type
    material_type: 'finished',
    material_group: '',
    item_type: 'device',
    exchange_type: 'none',
    
    // Status
    is_active: true,
  });

  const materialTypeOptions = [
    { value: 'raw', label: 'Raw Material' },
    { value: 'finished', label: 'Finished Good' },
    { value: 'semi', label: 'Semi-Finished' },
    { value: 'consumable', label: 'Consumable' },
    { value: 'service', label: 'Service' },
  ];

  const itemTypeOptions = [
    { value: 'spare', label: 'Spare' },
    { value: 'device', label: 'Device' },
    { value: 'ew', label: 'EW' },
    { value: 'accessory', label: 'Accessory' },
  ];

  const exchangeTypeOptions = [
    { value: 'none', label: 'None' },
    { value: 'allowed', label: 'Allowed' },
    { value: 'exchange_only', label: 'Exchange Only' },
  ];

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const themeResponse = await fetch('/api/theme/active-theme/');
        if (themeResponse.ok) {
          const themeData = await themeResponse.json();
          setThemeColor(themeData.primary_color || '#1976d2');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    if (token) {
      loadData();
      loadUOMs();
      loadCategories();
      loadItemCategories();
      loadAttributes();
    }
  }, []);

  // Apply filters whenever items or filter criteria change
  useEffect(() => {
    let filtered = [...items];
    
    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(item => item.item_category === parseInt(filterCategory));
    }
    
    // Filter by subcategory
    if (filterSubCategory) {
      filtered = filtered.filter(item => item.item_subcategory === parseInt(filterSubCategory));
    }
    
    setFilteredItems(filtered);
  }, [items, filterCategory, filterSubCategory]);

  const loadUOMs = async () => {
    try {
      const response = await api.get('/products/uom/');
      setUoms(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading UOMs:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadItemCategories = async () => {
    try {
      const response = await api.get('/categories/itemcategories/?is_active=true');
      setItemCategories(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error loading item categories:', error);
    }
  };

  const loadItemSubCategories = async (categoryId = null) => {
    try {
      const url = categoryId 
        ? `/categories/itemsubcategories/?category_id=${categoryId}&is_active=true`
        : '/categories/itemsubcategories/?is_active=true';
      const response = await api.get(url);
      setItemSubCategories(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error loading item subcategories:', error);
    }
  };

  const loadAttributes = async () => {
    try {
      // Load attributes from localStorage (Attributes Management page)
      const savedAttributes = localStorage.getItem('attributes');
      const attrs = savedAttributes ? JSON.parse(savedAttributes).filter(attr => attr.is_active) : [];
      setAttributes(attrs);
      
      // Load attribute values from localStorage (Attribute Values page)
      const savedValues = localStorage.getItem('attributeValues');
      const allValues = savedValues ? JSON.parse(savedValues).filter(val => val.is_active) : [];
      
      // Group values by attribute_id
      const valuesMap = {};
      for (const attr of attrs) {
        valuesMap[attr.id] = allValues.filter(val => val.attribute_id === attr.id);
      }
      setAttributeValues(valuesMap);
    } catch (error) {
      console.error('Error loading attributes:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/item-master/');
      setItems(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading Item Master data:', error);
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication expired. Please log in again.',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error loading Item Master data. Please try again.',
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
        ean_upc_code: item.ean_upc_code || '',
        item_code: item.item_code || '',
        item_name: item.item_name || '',
        short_name: item.short_name || '',
        brand: item.brand || '',
        supplier: item.supplier || '',
        cost_price: item.cost_price || '',
        landing_cost: item.landing_cost || '',
        sell_price: item.sell_price || '',
        mrp: item.mrp || '',
        store_pickup: item.store_pickup || false,
        sales_margin: item.sales_margin || '',
        tax_inclusive: item.tax_inclusive || false,
        allow_buy_back: item.allow_buy_back || false,
        allow_negative_stock: item.allow_negative_stock || false,
        base_uom: item.base_uom || '',
        purchase_uom: item.purchase_uom || '',
        sales_uom: item.sales_uom || '',
        category: item.category || '',
        item_category: item.item_category || '',
        item_subcategory: item.item_subcategory || '',
        tax_code: item.tax_code || '',
        hsn_code: item.hsn_code || '',
        tax_slab: item.tax_slab || '',
        material_type: item.material_type || 'finished',
        material_group: item.material_group || '',
        item_type: item.item_type || 'device',
        exchange_type: item.exchange_type || 'none',
        is_active: item.is_active !== false,
      });
    } else {
      // Add mode - reset form
      setForm({
        ean_upc_code: '',
        item_code: '',
        item_name: '',
        short_name: '',
        brand: '',
        supplier: '',
        cost_price: '',
        landing_cost: '',
        sell_price: '',
        mrp: '',
        store_pickup: false,
        sales_margin: '',
        tax_inclusive: false,
        allow_buy_back: false,
        allow_negative_stock: false,
        base_uom: '',
        purchase_uom: '',
        sales_uom: '',
        category: '',
        item_category: '',
        item_subcategory: '',
        tax_code: '',
        hsn_code: '',
        tax_slab: '',
        material_type: 'finished',
        material_group: '',
        item_type: 'device',
        exchange_type: 'none',
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
        cost_price: form.cost_price ? parseFloat(form.cost_price) : 0,
        landing_cost: form.landing_cost ? parseFloat(form.landing_cost) : 0,
        sell_price: form.sell_price ? parseFloat(form.sell_price) : 0,
        mrp: form.mrp ? parseFloat(form.mrp) : 0,
        sales_margin: form.sales_margin ? parseFloat(form.sales_margin) : 0,
      };

      if (editingItem) {
        await api.put(`/products/item-master/${editingItem.id}/`, dataToSend);
        setSnackbar({
          open: true,
          message: 'Item updated successfully!',
          severity: 'success',
        });
      } else {
        await api.post('/products/item-master/', dataToSend);
        setSnackbar({
          open: true,
          message: 'Item created successfully!',
          severity: 'success',
        });
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error saving Item:', error);
      console.error('Error details:', error.response?.data);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error saving Item. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Item?')) {
      try {
        await api.delete(`/products/item-master/${id}/`);
        setSnackbar({
          open: true,
          message: 'Item deleted successfully!',
          severity: 'success',
        });
        loadData();
      } catch (error) {
        console.error('Error deleting Item:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting Item. Please try again.',
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
          Please log in to access the Item Master.
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
          title="Item Master"
          subtitle="Manage your product items with comprehensive details"
        />
      </Box>

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
            Add Item
          </ActionButton>
        </CardHeader>

        <CardContent sx={{ p: 0 }}>
          {/* Filters Section */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <FilterListIcon sx={{ color: themeColor }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: themeColor }}>
                Filters
              </Typography>
              {(filterCategory || filterSubCategory) && (
                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={() => {
                    setFilterCategory('');
                    setFilterSubCategory('');
                  }}
                  sx={{ 
                    borderColor: themeColor,
                    color: themeColor,
                    '&:hover': {
                      borderColor: themeColor,
                      backgroundColor: `${themeColor}20`
                    }
                  }}
                >
                  Clear All
                </Button>
              )}
            </Box>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setFilterSubCategory(''); // Reset subcategory when category changes
                    }}
                    label="Category"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {itemCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name} ({category.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sub-Category</InputLabel>
                  <Select
                    value={filterSubCategory}
                    onChange={(e) => setFilterSubCategory(e.target.value)}
                    label="Sub-Category"
                    disabled={!filterCategory}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  >
                    <MenuItem value="">All Sub-Categories</MenuItem>
                    {itemSubCategories
                      .filter(sub => !filterCategory || sub.category === filterCategory)
                      .map((subcategory) => (
                        <MenuItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name} ({subcategory.code})
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredItems.length} of {items.length} items
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Data Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Item Code</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Brand</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Cost Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Sell Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>MRP</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: themeColor }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
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
                    <TableCell>{item.brand || '-'}</TableCell>
                    <TableCell>{item.cost_price || '-'}</TableCell>
                    <TableCell>{item.sell_price || '-'}</TableCell>
                    <TableCell>{item.mrp || '-'}</TableCell>
                    <TableCell>{item.category_name || '-'}</TableCell>
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
        <DialogTitle sx={{ background: themeColor, color: 'white' }}>
          {`${editingItem ? 'Edit' : 'Add'} Item`}
        </DialogTitle>
        <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          {/* Tabs */}
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="General" />
            <Tab label="Pricing & Tax" />
            <Tab label="Preferences" />
            <Tab label="Attributes" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 1 }}>
            {/* General Tab */}
            {tabValue === 0 && (
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    label="EAN/UPC Code"
                    value={form.ean_upc_code}
                    onChange={handleInputChange('ean_upc_code')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    label="Item Code"
                    value={form.item_code}
                    onChange={handleInputChange('item_code')}
                    required
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    value={form.item_name}
                    onChange={handleInputChange('item_name')}
                    required
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Short Name"
                    value={form.short_name}
                    onChange={handleInputChange('short_name')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brand"
                    value={form.brand}
                    onChange={handleInputChange('brand')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Supplier"
                    value={form.supplier}
                    onChange={handleInputChange('supplier')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                
                {/* UOM Fields */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Base/Stock UOM</InputLabel>
                    <Select
                      value={form.base_uom}
                      onChange={handleInputChange('base_uom')}
                      label="Base/Stock UOM"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
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
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Purchase UOM</InputLabel>
                    <Select
                      value={form.purchase_uom}
                      onChange={handleInputChange('purchase_uom')}
                      label="Purchase UOM"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
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
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Sales UOM</InputLabel>
                    <Select
                      value={form.sales_uom}
                      onChange={handleInputChange('sales_uom')}
                      label="Sales UOM"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    >
                      {uoms.map((uom) => (
                        <MenuItem key={uom.id} value={uom.id}>
                          {uom.code} - {uom.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Category and Sub-Category Fields */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: themeColor }}>Category</InputLabel>
                      <Select
                        value={form.item_category}
                        onChange={(e) => {
                          handleInputChange('item_category')(e);
                          // Load subcategories for selected category
                          if (e.target.value) {
                            loadItemSubCategories(e.target.value);
                          } else {
                            loadItemSubCategories();
                          }
                        }}
                        label="Category"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                      >
                        {itemCategories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name} ({category.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOpenCategoryDialog(true)}
                      sx={{ 
                        minWidth: '40px',
                        height: '56px',
                        borderColor: themeColor,
                        color: themeColor,
                        '&:hover': {
                          borderColor: themeColor,
                          backgroundColor: `${themeColor}20`
                        }
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: themeColor }}>Sub-Category</InputLabel>
                      <Select
                        value={form.item_subcategory}
                        onChange={handleInputChange('item_subcategory')}
                        label="Sub-Category"
                        disabled={!form.item_category}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                      >
                        {itemSubCategories.map((subcategory) => (
                          <MenuItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name} ({subcategory.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOpenSubCategoryDialog(true)}
                      disabled={!form.item_category}
                      sx={{ 
                        minWidth: '40px',
                        height: '56px',
                        borderColor: themeColor,
                        color: themeColor,
                        '&:hover': {
                          borderColor: themeColor,
                          backgroundColor: `${themeColor}20`
                        }
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                </Grid>
                
                {/* Item Type, Exchange Type, Material Type */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Item Type</InputLabel>
                    <Select
                      value={form.item_type}
                      onChange={handleInputChange('item_type')}
                      label="Item Type"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    >
                      {itemTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Exchange Type</InputLabel>
                    <Select
                      value={form.exchange_type}
                      onChange={handleInputChange('exchange_type')}
                      label="Exchange Type"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    >
                      {exchangeTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Material Type</InputLabel>
                    <Select
                      value={form.material_type}
                      onChange={handleInputChange('material_type')}
                      label="Material Type"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    >
                      {materialTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {/* Pricing & Tax Tab */}
            {tabValue === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cost Price"
                    type="number"
                    value={form.cost_price}
                    onChange={handleInputChange('cost_price')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Landing Cost"
                    type="number"
                    value={form.landing_cost}
                    onChange={handleInputChange('landing_cost')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sell Price"
                    type="number"
                    value={form.sell_price}
                    onChange={handleInputChange('sell_price')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="MRP (Maximum Retail Price)"
                    type="number"
                    value={form.mrp}
                    onChange={handleInputChange('mrp')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sales Margin %"
                    type="number"
                    value={form.sales_margin}
                    onChange={handleInputChange('sales_margin')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                
                {/* Local Tax Fields */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Tax Code (GST)"
                    value={form.tax_code}
                    onChange={handleInputChange('tax_code')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="HSN Code"
                    value={form.hsn_code}
                    onChange={handleInputChange('hsn_code')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Tax Slab"
                    value={form.tax_slab}
                    onChange={handleInputChange('tax_slab')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
              </Grid>
            )}

            {/* Preferences Tab */}
            {tabValue === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.allow_negative_stock}
                        onChange={handleInputChange('allow_negative_stock')}
                        color="primary"
                      />
                    }
                    label="Allow Negative Stock"
                    sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.allow_buy_back}
                        onChange={handleInputChange('allow_buy_back')}
                        color="primary"
                      />
                    }
                    label="Allow Buy Back"
                    sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.store_pickup}
                        onChange={handleInputChange('store_pickup')}
                        color="primary"
                      />
                    }
                    label="Store Pickup"
                    sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.tax_inclusive}
                        onChange={handleInputChange('tax_inclusive')}
                        color="primary"
                      />
                    }
                    label="Tax Inclusive (Yes/No)"
                    sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                  />
                </Grid>
              </Grid>
            )}

            {/* Attributes Tab */}
            {tabValue === 3 && (
              <Grid container spacing={3}>
                {/* Dynamic Attributes */}
                {attributes.map((attr) => (
                  <Grid item xs={12} sm={6} key={attr.id}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: themeColor }}>{attr.caption}</InputLabel>
                      <Select
                        value={form[`attribute_${attr.id}`] || ''}
                        onChange={(e) => {
                          setForm(prev => ({
                            ...prev,
                            [`attribute_${attr.id}`]: e.target.value
                          }));
                        }}
                        label={attr.caption}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                      >
                        {(attributeValues[attr.id] || []).map((val) => (
                          <MenuItem key={val.id} value={val.id}>
                            {val.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: 'grey.50' }}>
          <FormControlLabel
            control={
              <Switch
                checked={form.is_active}
                onChange={handleInputChange('is_active')}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                }}
              />
            }
            label="Active"
            sx={{ '& .MuiFormControlLabel-label': { color: themeColor, fontWeight: 500 } }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
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
          </Box>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <CategoryDialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        onSuccess={(newCategory) => {
          setSnackbar({ open: true, message: 'Category created successfully!', severity: 'success' });
          loadItemCategories(); // Reload categories
          setOpenCategoryDialog(false);
        }}
        themeColor={themeColor}
      />

      {/* Sub-Category Dialog */}
      <SubCategoryDialog
        open={openSubCategoryDialog}
        onClose={() => setOpenSubCategoryDialog(false)}
        onSuccess={(newSubCategory) => {
          setSnackbar({ open: true, message: 'Sub-category created successfully!', severity: 'success' });
          // Reload subcategories for the currently selected category
          if (form.item_category) {
            loadItemSubCategories(form.item_category);
          }
          setOpenSubCategoryDialog(false);
        }}
        themeColor={themeColor}
      />

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
          sx={{ borderRadius: 0 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemMasterPage;
