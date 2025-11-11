import React, { useState, useEffect } from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';

const ProductsPageSimple = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    console.log('ProductsPageSimple: useEffect triggered');
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    console.log('Add Product clicked');
    setShowForm(true);
  };

  console.log('ProductsPageSimple: Render - loading:', loading, 'error:', error, 'products:', products);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
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
            title="Products (Simple Version)" 
            subtitle="Streamlined product management interface"
            showIcon={true}
            icon={<AddIcon />}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            color="primary"
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

        {/* Products Count */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Total Products: {products ? products.length : 0}
          </Typography>
        </Box>

        {/* Products List */}
        {products && products.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Products List:
            </Typography>
            {products.map((product, index) => (
              <Box key={product.id || index} sx={{ p: 2, border: '1px solid #ddd', mb: 1, borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku} | Price: ${product.price}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click "Add Product" to create your first product
            </Typography>
          </Box>
        )}

        {/* Form Toggle */}
        {showForm && (
          <Box sx={{ mt: 3, p: 3, border: '1px solid #007bff', borderRadius: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom>
              Add Product Form (Placeholder)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is a placeholder for the product form. The actual form component will be implemented here.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => setShowForm(false)}
              sx={{ mt: 2 }}
            >
              Close Form
            </Button>
          </Box>
        )}

        {/* Debug Info */}
        <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Debug Information:
          </Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
            {JSON.stringify({ loading, error, productsCount: products?.length || 0 }, null, 2)}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsPageSimple;
































