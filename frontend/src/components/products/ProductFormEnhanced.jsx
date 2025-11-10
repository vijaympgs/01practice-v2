import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Switch,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  InputAdornment,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Preview as PreviewIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  updateProduct,
  clearError
} from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductFormEnhanced = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);

  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category: '',
    price: '',
    cost: '',
    stock_quantity: '',
    minimum_stock: '',
    maximum_stock: '',
    weight: '',
    dimensions: '',
    color: '',
    size: '',
    brand: '',
    model: '',
    is_active: true,
    is_taxable: true,
    tax_rate: '0.00'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category: product.category?.id || '',
        price: product.price || '',
        cost: product.cost || '',
        stock_quantity: product.stock_quantity || '',
        minimum_stock: product.minimum_stock || '',
        maximum_stock: product.maximum_stock || '',
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        color: product.color || '',
        size: product.size || '',
        brand: product.brand || '',
        model: product.model || '',
        is_active: product.is_active ?? true,
        is_taxable: product.is_taxable ?? true,
        tax_rate: product.tax_rate || '0.00'
      });
    }
  }, [product]);

  useEffect(() => {
    // Fetch categories for category selection
    dispatch(fetchCategories({ is_active: true }));
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic Information Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    } else if (formData.sku.trim().length < 2) {
      newErrors.sku = 'SKU must be at least 2 characters';
    }

    // Pricing Validation
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.cost && parseFloat(formData.cost) < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }

    if (formData.cost && formData.price && parseFloat(formData.cost) > parseFloat(formData.price)) {
      newErrors.cost = 'Cost cannot be greater than price';
    }

    // Inventory Validation
    if (formData.stock_quantity && parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Stock quantity cannot be negative';
    }

    if (formData.minimum_stock && parseInt(formData.minimum_stock) < 0) {
      newErrors.minimum_stock = 'Minimum stock cannot be negative';
    }

    if (formData.maximum_stock && parseInt(formData.maximum_stock) < 0) {
      newErrors.maximum_stock = 'Maximum stock cannot be negative';
    }

    if (formData.minimum_stock && formData.maximum_stock && 
        parseInt(formData.minimum_stock) > parseInt(formData.maximum_stock)) {
      newErrors.minimum_stock = 'Minimum stock cannot be greater than maximum stock';
    }

    // Tax Rate Validation
    if (formData.tax_rate && (parseFloat(formData.tax_rate) < 0 || parseFloat(formData.tax_rate) > 100)) {
      newErrors.tax_rate = 'Tax rate must be between 0 and 100';
    }

    // Weight Validation
    if (formData.weight && parseFloat(formData.weight) < 0) {
      newErrors.weight = 'Weight cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        sku: formData.sku.trim().toUpperCase(),
        barcode: formData.barcode.trim() || null,
        category: formData.category || null,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        minimum_stock: parseInt(formData.minimum_stock) || 0,
        maximum_stock: formData.maximum_stock ? parseInt(formData.maximum_stock) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions.trim() || null,
        color: formData.color.trim() || null,
        size: formData.size.trim() || null,
        brand: formData.brand.trim() || null,
        model: formData.model.trim() || null,
        is_active: formData.is_active,
        is_taxable: formData.is_taxable,
        tax_rate: parseFloat(formData.tax_rate) || 0
      };

      if (product) {
        await dispatch(updateProduct({
          id: product.id,
          ...submitData
        })).unwrap();
      } else {
        await dispatch(createProduct(submitData)).unwrap();
      }

      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  // Calculate profit margin
  const calculateProfitMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    if (price > 0 && cost > 0) {
      return (((price - cost) / price) * 100).toFixed(2);
    }
    return '0.00';
  };

  // Get stock status
  const getStockStatus = () => {
    const stock = parseInt(formData.stock_quantity) || 0;
    const minStock = parseInt(formData.minimum_stock) || 0;
    const maxStock = parseInt(formData.maximum_stock) || 0;

    if (stock <= 0) return { status: 'Out of Stock', color: 'error' };
    if (stock <= minStock) return { status: 'Low Stock', color: 'warning' };
    if (maxStock > 0 && stock >= maxStock) return { status: 'Overstocked', color: 'info' };
    return { status: 'In Stock', color: 'success' };
  };

  const stockStatus = getStockStatus();

  return (
    <Dialog 
      open={true} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {product ? 'Edit Product' : 'Create New Product'}
          </Typography>
          <Button
            onClick={handleClose}
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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || 'An error occurred'}
            </Alert>
          )}

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="product form tabs">
              <Tab icon={<InfoIcon />} label="Basic Info" />
              <Tab icon={<MoneyIcon />} label="Pricing" />
              <Tab icon={<InventoryIcon />} label="Inventory" />
              <Tab icon={<SettingsIcon />} label="Settings" />
              <Tab icon={<PreviewIcon />} label="Preview" />
            </Tabs>
          </Box>

          {/* Basic Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={formData.sku}
                  onChange={handleChange('sku')}
                  error={!!errors.sku}
                  helperText={errors.sku}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Barcode"
                  value={formData.barcode}
                  onChange={handleChange('barcode')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleChange('category')}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>No Category</em>
                    </MenuItem>
                    {categories?.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.full_path || category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={formData.brand}
                  onChange={handleChange('brand')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={formData.model}
                  onChange={handleChange('model')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Color"
                  value={formData.color}
                  onChange={handleChange('color')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Size"
                  value={formData.size}
                  onChange={handleChange('size')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Dimensions"
                  value={formData.dimensions}
                  onChange={handleChange('dimensions')}
                  placeholder="L x W x H"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Pricing Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange('price')}
                  error={!!errors.price}
                  helperText={errors.price}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleChange('cost')}
                  error={!!errors.cost}
                  helperText={errors.cost}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tax Rate"
                  type="number"
                  value={formData.tax_rate}
                  onChange={handleChange('tax_rate')}
                  error={!!errors.tax_rate}
                  helperText={errors.tax_rate}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange('weight')}
                  error={!!errors.weight}
                  helperText={errors.weight}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.001 }}
                />
              </Grid>

              {/* Profit Margin Display */}
              {formData.price && formData.cost && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="h6">
                      Profit Margin: {calculateProfitMargin()}%
                    </Typography>
                    <Typography variant="body2">
                      Profit Amount: ${((parseFloat(formData.price) || 0) - (parseFloat(formData.cost) || 0)).toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Inventory Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleChange('stock_quantity')}
                  error={!!errors.stock_quantity}
                  helperText={errors.stock_quantity}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Minimum Stock"
                  type="number"
                  value={formData.minimum_stock}
                  onChange={handleChange('minimum_stock')}
                  error={!!errors.minimum_stock}
                  helperText={errors.minimum_stock}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Maximum Stock"
                  type="number"
                  value={formData.maximum_stock}
                  onChange={handleChange('maximum_stock')}
                  error={!!errors.maximum_stock}
                  helperText={errors.maximum_stock}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Stock Status Display */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Stock Status
                  </Typography>
                  <Chip 
                    label={stockStatus.status} 
                    color={stockStatus.color} 
                    variant="outlined"
                    size="large"
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Current Stock: {formData.stock_quantity || 0} units
                  </Typography>
                  {formData.stock_quantity && formData.price && (
                    <Typography variant="body2">
                      Stock Value: ${((parseInt(formData.stock_quantity) || 0) * (parseFloat(formData.price) || 0)).toFixed(2)}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={handleChange('is_active')}
                      color="primary"
                    />
                  }
                  label="Active Product"
                />
                <Typography variant="body2" color="text.secondary">
                  Active products are visible in the store and can be sold
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_taxable}
                      onChange={handleChange('is_taxable')}
                      color="primary"
                    />
                  }
                  label="Taxable Product"
                />
                <Typography variant="body2" color="text.secondary">
                  Taxable products will have tax applied during checkout
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Preview Tab */}
          <TabPanel value={tabValue} index={4}>
            <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Product Preview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {formData.name || 'Untitled Product'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>SKU:</strong> {formData.sku || 'Not specified'}
                  </Typography>
                  {formData.barcode && (
                    <Typography variant="body1">
                      <strong>Barcode:</strong> {formData.barcode}
                    </Typography>
                  )}
                  {formData.category && (
                    <Typography variant="body1">
                      <strong>Category:</strong> {
                        categories?.find(cat => cat.id === formData.category)?.name || 'Unknown'
                      }
                    </Typography>
                  )}
                  {formData.brand && (
                    <Typography variant="body1">
                      <strong>Brand:</strong> {formData.brand}
                    </Typography>
                  )}
                  {formData.model && (
                    <Typography variant="body1">
                      <strong>Model:</strong> {formData.model}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Price:</strong> ${parseFloat(formData.price || 0).toFixed(2)}
                  </Typography>
                  {formData.cost && (
                    <Typography variant="body1">
                      <strong>Cost:</strong> ${parseFloat(formData.cost).toFixed(2)}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Stock:</strong> {formData.stock_quantity || 0} units
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> 
                    <Chip 
                      label={formData.is_active ? 'Active' : 'Inactive'} 
                      color={formData.is_active ? 'success' : 'default'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body1">
                    <strong>Taxable:</strong> {formData.is_taxable ? 'Yes' : 'No'}
                  </Typography>
                  {formData.is_taxable && (
                    <Typography variant="body1">
                      <strong>Tax Rate:</strong> {formData.tax_rate}%
                    </Typography>
                  )}
                </Grid>

                {formData.description && (
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Description:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                      {formData.description}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            size="large"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductFormEnhanced;

















































