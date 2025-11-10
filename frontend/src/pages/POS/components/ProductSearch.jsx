import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  QrCode as BarcodeIcon,
} from '@mui/icons-material';
// Remove lodash dependency - using custom debounce instead
import productService from '../../../services/productService';

const ProductSearch = ({ onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');

  // Load recent products on mount
  useEffect(() => {
    loadRecentProducts();
  }, []);

  // Barcode scanner listener
  useEffect(() => {
    let timeout;
    
    const handleKeyPress = (e) => {
      // Ignore if typing in an input field
      if (e.target.tagName === 'INPUT' && e.target !== document.activeElement) {
        return;
      }

      // Enter key completes barcode scan
      if (e.key === 'Enter' && barcodeBuffer) {
        e.preventDefault();
        searchByBarcode(barcodeBuffer);
        setBarcodeBuffer('');
        return;
      }

      // Build barcode buffer (numeric keys only)
      if (/^[0-9]$/.test(e.key)) {
        setBarcodeBuffer(prev => prev + e.key);
        
        // Clear buffer after 100ms of inactivity
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setBarcodeBuffer('');
        }, 100);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeout);
    };
  }, [barcodeBuffer]);

  const loadRecentProducts = async () => {
    try {
      const data = await productService.getAll({ page_size: 12, ordering: '-updated_at' });
      setRecentProducts(data.results || []);
    } catch (error) {
      console.error('Error loading recent products:', error);
    }
  };

  const searchProducts = async (term) => {
    if (!term || term.length < 2) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const data = await productService.getAll({ 
        search: term,
        is_active: true,
        page_size: 20,
      });
      setProducts(data.results || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchByBarcode = async (barcode) => {
    setLoading(true);
    try {
      const data = await productService.getAll({ 
        barcode,
        is_active: true,
      });
      
      if (data.results && data.results.length > 0) {
        // Directly add to cart
        onProductSelect(data.results[0]);
        setSearchTerm('');
        setProducts([]);
      } else {
        alert(`Product not found: ${barcode}`);
      }
    } catch (error) {
      console.error('Error searching by barcode:', error);
      alert('Error searching product');
    } finally {
      setLoading(false);
    }
  };

  // Simple debounce using timeout
  const timeoutRef = useRef(null);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      searchProducts(value);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setProducts([]);
  };

  const handleProductClick = (product) => {
    onProductSelect(product);
    // Optional: clear search after selection
    // setSearchTerm('');
    // setProducts([]);
  };

  const displayProducts = searchTerm ? products : recentProducts;

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Search Bar */}
      <TextField
        id="pos-search"
        fullWidth
        placeholder="Search by name, SKU, or scan barcode... (F2)"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BarcodeIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
        autoFocus
      />

      {/* Products Grid */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {loading ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            Searching...
          </Typography>
        ) : displayProducts.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            {searchTerm ? 'No products found' : 'Start typing to search products'}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {displayProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  {product.image && (
                    <CardMedia
                      component="img"
                      height="120"
                      image={product.image}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.sku}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${parseFloat(product.unit_price).toFixed(2)}
                      </Typography>
                      {product.is_active && (
                        <Chip label="In Stock" size="small" color="success" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Barcode indicator */}
      {barcodeBuffer && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            bgcolor: 'primary.main',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            Scanning: {barcodeBuffer}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ProductSearch;

