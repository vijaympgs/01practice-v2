import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct, clearError } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

const ProductFormSimple = ({ open, onClose, product, mode = 'create' }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);
  
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

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (open) {
      // Load categories when form opens
      dispatch(fetchCategories());
      
      // Clear any previous errors
      dispatch(clearError());
      
      if (mode === 'edit' && product) {
        // Populate form with existing product data
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
          is_active: product.is_active !== undefined ? product.is_active : true,
          is_taxable: product.is_taxable !== undefined ? product.is_taxable : true,
          tax_rate: product.tax_rate || '0.00'
        });
      } else {
        // Reset form for new product
        setFormData({
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
      }
      setFormErrors({});
    }
  }, [open, mode, product, dispatch]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.sku.trim()) {
      errors.sku = 'SKU is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }
    
    if (formData.cost && parseFloat(formData.cost) < 0) {
      errors.cost = 'Cost cannot be negative';
    }
    
    if (formData.stock_quantity && parseInt(formData.stock_quantity) < 0) {
      errors.stock_quantity = 'Stock quantity cannot be negative';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        minimum_stock: parseInt(formData.minimum_stock) || 0,
        maximum_stock: formData.maximum_stock ? parseInt(formData.maximum_stock) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        tax_rate: parseFloat(formData.tax_rate) || 0,
        category: formData.category || null
      };
      
      if (mode === 'create') {
        await dispatch(createProduct(submitData));
      } else {
        await dispatch(updateProduct({ id: product.id, ...submitData }));
      }
      
      // Close form on success
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </Typography>
          <Button
            onClick={handleClose}
            color="inherit"
            size="small"
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name *"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU *"
                value={formData.sku}
                onChange={handleInputChange('sku')}
                error={!!formErrors.sku}
                helperText={formErrors.sku}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Barcode"
                value={formData.barcode}
                onChange={handleInputChange('barcode')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleInputChange('category')}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>No Category</em>
                  </MenuItem>
                  {categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
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
                onChange={handleInputChange('description')}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Pricing
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price *"
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                error={!!formErrors.price}
                helperText={formErrors.price}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cost"
                type="number"
                value={formData.cost}
                onChange={handleInputChange('cost')}
                error={!!formErrors.cost}
                helperText={formErrors.cost}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Inventory
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleInputChange('stock_quantity')}
                error={!!formErrors.stock_quantity}
                helperText={formErrors.stock_quantity}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Minimum Stock"
                type="number"
                value={formData.minimum_stock}
                onChange={handleInputChange('minimum_stock')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Maximum Stock"
                type="number"
                value={formData.maximum_stock}
                onChange={handleInputChange('maximum_stock')}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={handleInputChange('brand')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={handleInputChange('model')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                value={formData.color}
                onChange={handleInputChange('color')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Size"
                value={formData.size}
                onChange={handleInputChange('size')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={handleInputChange('weight')}
                inputProps={{ min: 0, step: 0.001 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dimensions"
                value={formData.dimensions}
                onChange={handleInputChange('dimensions')}
                placeholder="L x W x H"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleInputChange('is_active')}
                  />
                }
                label="Active"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_taxable}
                    onChange={handleInputChange('is_taxable')}
                  />
                }
                label="Taxable"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                type="number"
                value={formData.tax_rate}
                onChange={handleInputChange('tax_rate')}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Saving...' : (mode === 'create' ? 'Create Product' : 'Update Product')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductFormSimple;


















































