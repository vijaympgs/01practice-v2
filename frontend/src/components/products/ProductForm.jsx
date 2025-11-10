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
  Divider,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  updateProduct,
  clearError
} from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

const ProductForm = ({ open, onClose, product, mode = 'create' }) => {
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
    tax_rate: '0.00',
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (open) {
      dispatch(fetchCategories());
      
      if (mode === 'edit' && product) {
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
          tax_rate: product.tax_rate || '0.00',
          image: null
        });
        setImagePreview(product.image);
      } else {
        // Reset form for create mode
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
          tax_rate: '0.00',
          image: null
        });
        setImagePreview(null);
      }
      setErrors({});
    }
  }, [open, mode, product, dispatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
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
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    // Optional validations
    if (formData.cost && formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }
    
    if (formData.cost && formData.price && formData.cost > formData.price) {
      newErrors.cost = 'Cost cannot be greater than price';
    }
    
    if (formData.stock_quantity && formData.stock_quantity < 0) {
      newErrors.stock_quantity = 'Stock quantity cannot be negative';
    }
    
    if (formData.minimum_stock && formData.minimum_stock < 0) {
      newErrors.minimum_stock = 'Minimum stock cannot be negative';
    }
    
    if (formData.maximum_stock && formData.maximum_stock < 0) {
      newErrors.maximum_stock = 'Maximum stock cannot be negative';
    }
    
    if (formData.minimum_stock && formData.maximum_stock && 
        formData.minimum_stock > formData.maximum_stock) {
      newErrors.minimum_stock = 'Minimum stock cannot be greater than maximum stock';
    }
    
    if (formData.tax_rate && (formData.tax_rate < 0 || formData.tax_rate > 100)) {
      newErrors.tax_rate = 'Tax rate must be between 0 and 100';
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
      const submitData = { ...formData };
      
      // Convert empty strings to null for optional fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          submitData[key] = null;
        }
      });
      
      // Convert numeric fields
      if (submitData.price) submitData.price = parseFloat(submitData.price);
      if (submitData.cost) submitData.cost = parseFloat(submitData.cost);
      if (submitData.stock_quantity) submitData.stock_quantity = parseInt(submitData.stock_quantity);
      if (submitData.minimum_stock) submitData.minimum_stock = parseInt(submitData.minimum_stock);
      if (submitData.maximum_stock) submitData.maximum_stock = parseInt(submitData.maximum_stock);
      if (submitData.weight) submitData.weight = parseFloat(submitData.weight);
      if (submitData.tax_rate) submitData.tax_rate = parseFloat(submitData.tax_rate);
      
      if (mode === 'create') {
        await dispatch(createProduct(submitData)).unwrap();
      } else {
        await dispatch(updateProduct({ id: product.id, productData: submitData })).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    dispatch(clearError());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name *"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU *"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value.toUpperCase())}
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
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                error={!!errors.barcode}
                helperText={errors.barcode}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">No Category</MenuItem>
                  {categories.map((category) => (
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
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            
            {/* Pricing */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Pricing
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price *"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cost"
                type="number"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                error={!!errors.cost}
                helperText={errors.cost}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            {/* Inventory */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Inventory
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                error={!!errors.stock_quantity}
                helperText={errors.stock_quantity}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Minimum Stock"
                type="number"
                value={formData.minimum_stock}
                onChange={(e) => handleInputChange('minimum_stock', e.target.value)}
                error={!!errors.minimum_stock}
                helperText={errors.minimum_stock}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Maximum Stock"
                type="number"
                value={formData.maximum_stock}
                onChange={(e) => handleInputChange('maximum_stock', e.target.value)}
                error={!!errors.maximum_stock}
                helperText={errors.maximum_stock}
              />
            </Grid>
            
            {/* Product Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Product Details
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                error={!!errors.brand}
                helperText={errors.brand}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                error={!!errors.model}
                helperText={errors.model}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                error={!!errors.color}
                helperText={errors.color}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                error={!!errors.size}
                helperText={errors.size}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                error={!!errors.weight}
                helperText={errors.weight}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dimensions (L x W x H)"
                value={formData.dimensions}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
                error={!!errors.dimensions}
                helperText={errors.dimensions}
                placeholder="e.g., 10 x 5 x 2"
              />
            </Grid>
            
            {/* Tax & Status */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Tax & Status
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  />
                }
                label="Active"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_taxable}
                    onChange={(e) => handleInputChange('is_taxable', e.target.checked)}
                  />
                }
                label="Taxable"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                type="number"
                value={formData.tax_rate}
                onChange={(e) => handleInputChange('tax_rate', e.target.value)}
                error={!!errors.tax_rate}
                helperText={errors.tax_rate}
                disabled={!formData.is_taxable}
              />
            </Grid>
            
            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Product Image
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="product-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="product-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon />}
                  >
                    Choose Image
                  </Button>
                </label>
                
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Product preview"
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #ddd'
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}
        >
          {mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
