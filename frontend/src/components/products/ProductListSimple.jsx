import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../store/slices/productSlice';

const ProductListSimple = ({ onAddProduct, onEditProduct, onViewProduct }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId));
        dispatch(fetchProducts()); // Refresh the list
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const filteredProducts = products?.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Products List (Simple)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddProduct}
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

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    SKU: {product.sku}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${product.price}
                  </Typography>
                  
                  {product.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                  )}
                  <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => onViewProduct(product)}
                    >
                      👁️ View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => onEditProduct(product)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleDelete(product.id)}
                      color="error"
                    >
                      🗑️ Delete
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
              {searchTerm ? 'No products found matching your search' : 'No products found'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Click "Add Product" to create your first product'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Debug Information:
        </Typography>
        <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
          {JSON.stringify({ 
            loading, 
            error, 
            totalProducts: products?.length || 0,
            filteredProducts: filteredProducts.length,
            searchTerm 
          }, null, 2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductListSimple;

