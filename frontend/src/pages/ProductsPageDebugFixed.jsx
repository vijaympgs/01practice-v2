import React, { useState, useEffect } from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';

const ProductsPageDebugFixed = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);
  
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Form state
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
    is_active: true,
    is_taxable: true,
    tax_rate: '0.00'
  });

  useEffect(() => {
    console.log('🚀 ProductsPageDebugFixed: Loading products and categories');
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const resetForm = () => {
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
      is_active: true,
      is_taxable: true,
      tax_rate: '0.00'
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddProduct = () => {
    console.log('➕ Add Product clicked');
    setFormMode('create');
    setSelectedProduct(null);
    resetForm();
    setFormOpen(true);
  };

  const handleEditProduct = (product) => {
    console.log('✏️ Edit Product clicked:', product);
    setFormMode('edit');
    setSelectedProduct(product);
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
      is_active: product.is_active !== undefined ? product.is_active : true,
      is_taxable: product.is_taxable !== undefined ? product.is_taxable : true,
      tax_rate: product.tax_rate || '0.00'
    });
    setFormOpen(true);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        console.log('🗑️ Deleting product:', productId);
        const result = await dispatch(deleteProduct(productId));
        
        if (result.type.endsWith('/fulfilled')) {
          showSnackbar('Product deleted successfully!');
          dispatch(fetchProducts()); // Refresh the list
        } else {
          showSnackbar(`Error deleting product: ${result.payload}`, 'error');
        }
      } catch (error) {
        console.error('Delete error:', error);
        showSnackbar('Error deleting product', 'error');
      }
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showSnackbar('Product name is required', 'error');
      return false;
    }
    if (!formData.sku.trim()) {
      showSnackbar('SKU is required', 'error');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showSnackbar('Valid price is required', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('🔥 FORM SUBMIT STARTED');
    console.log('Form Mode:', formMode);
    console.log('Form Data:', formData);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim() || null,
        category: formData.category || null,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        minimum_stock: parseInt(formData.minimum_stock) || 0,
        is_active: formData.is_active,
        is_taxable: formData.is_taxable,
        tax_rate: parseFloat(formData.tax_rate) || 0
      };
      
      console.log('🚀 SUBMIT DATA:', submitData);
      
      let result;
      if (formMode === 'create') {
        console.log('📝 CREATING PRODUCT...');
        result = await dispatch(createProduct(submitData));
      } else {
        console.log('✏️ UPDATING PRODUCT...');
        result = await dispatch(updateProduct({ id: selectedProduct.id, ...submitData }));
      }
      
      console.log('📊 RESULT:', result);
      
      // Check if the action was successful
      if (result.type.endsWith('/fulfilled')) {
        console.log('🎉 SUCCESS!');
        showSnackbar(`Product ${formMode === 'create' ? 'created' : 'updated'} successfully!`);
        setFormOpen(false);
        resetForm();
        // Refresh products list
        dispatch(fetchProducts());
      } else if (result.type.endsWith('/rejected')) {
        console.error('❌ ACTION REJECTED:', result.payload);
        showSnackbar(`Error: ${result.payload}`, 'error');
      }
    } catch (error) {
      console.error('💥 FORM SUBMISSION ERROR:', error);
      showSnackbar(`Error saving product: ${error.message}`, 'error');
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    resetForm();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  console.log('🔍 RENDER STATE:', { 
    productsCount: products?.length, 
    loading, 
    error, 
    categoriesCount: categories?.length 
  });

  if (loading && (!products || products.length === 0)) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading products...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <PageTitle 
            title="Products Management (Debug Fixed)" 
            subtitle="Debug version with enhanced error handling and logging"
            showIcon={true}
            icon={<AddIcon />}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            color="primary"
            size="large"
          >
            Add Product
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {error}
          </Alert>
        )}

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      SKU: {product.sku}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      ${parseFloat(product.price).toFixed(2)}
                    </Typography>
                    {product.description && (
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.stock_quantity || 0}
                    </Typography>
                    
                    {/* Action Buttons */}
                    <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          const details = `Product: ${product.name}\nSKU: ${product.sku}\nPrice: $${product.price}\nStock: ${product.stock_quantity || 0}`;
                          alert(details);
                        }}
                        sx={{ minWidth: '60px' }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditProduct(product)}
                        sx={{ minWidth: '60px' }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        color="error"
                        sx={{ minWidth: '60px' }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click "Add Product" to create your first product
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Product Form Dialog */}
        <Dialog 
          open={formOpen} 
          onClose={handleCloseForm}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {formMode === 'create' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent>
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
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SKU *"
                    value={formData.sku}
                    onChange={handleInputChange('sku')}
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

                {/* Pricing */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
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
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                {/* Inventory */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Inventory
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleInputChange('stock_quantity')}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Stock"
                    type="number"
                    value={formData.minimum_stock}
                    onChange={handleInputChange('minimum_stock')}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                {/* Settings */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Settings
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
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
                
                <Grid item xs={12} sm={4}>
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
                
                <Grid item xs={12} sm={4}>
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
              <Button onClick={handleCloseForm} color="inherit">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Saving...' : (formMode === 'create' ? 'Create Product' : 'Update Product')}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Debug Info */}
        <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Debug Information:
          </Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
            {JSON.stringify({ 
              loading, 
              error, 
              productsCount: products?.length || 0,
              categoriesCount: categories?.length || 0,
              formOpen, 
              formMode, 
              selectedProduct: selectedProduct?.name || null,
              apiBaseUrl: 'http://127.0.0.1:8000/api'
            }, null, 2)}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsPageDebugFixed;
































