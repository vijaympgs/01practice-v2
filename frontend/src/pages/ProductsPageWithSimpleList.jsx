import React, { useState, useEffect } from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fetchProducts } from '../store/slices/productSlice';
import ProductListSimple from '../components/products/ProductListSimple';
import ProductFormSimple from '../components/products/ProductFormSimple';

const ProductsPageWithSimpleList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    console.log('ProductsPageWithSimpleList: useEffect triggered');
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    console.log('Add Product clicked');
    setFormMode('create');
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product) => {
    console.log('Edit Product clicked:', product);
    setFormMode('edit');
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleViewProduct = (product) => {
    console.log('View Product clicked:', product);
    setSelectedProduct(product);
    // For now, just show an alert
    alert(`Viewing product: ${product.name}\nSKU: ${product.sku}\nPrice: $${product.price}`);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedProduct(null);
  };

  console.log('ProductsPageWithSimpleList: Render - loading:', loading, 'error:', error, 'products:', products?.length);

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
        <Box mb={3}>
          <PageTitle 
            title="Products Management" 
            subtitle="Simple list view with enhanced functionality"
            showIcon={true}
            icon={<AddIcon />}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {error}
          </Alert>
        )}

        {/* Product List */}
        <ProductListSimple
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onViewProduct={handleViewProduct}
        />

        {/* Product Form */}
        <ProductFormSimple
          open={formOpen}
          onClose={handleCloseForm}
          product={selectedProduct}
          mode={formMode}
        />

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
              formOpen, 
              formMode, 
              selectedProduct: selectedProduct?.name || null 
            }, null, 2)}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsPageWithSimpleList;
