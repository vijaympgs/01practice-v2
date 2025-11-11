import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

/**
 * Product Lookup Dialog Component
 * 
 * Provides a searchable, filterable product catalog for POS transactions
 * Features:
 * - Product search by name, SKU, barcode
 * - Category filtering
 * - Product grid display
 * - Click to select/add product
 */
const ProductLookupDialog = ({ open, onClose, onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load products and categories when dialog opens
  useEffect(() => {
    if (open) {
      loadProducts();
      loadCategories();
    } else {
      // Reset state when dialog closes
      setSearchQuery('');
      setSelectedCategory('all');
      setError(null);
    }
  }, [open]);

  // Filter products when search query or category changes
  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts({ is_active: true, page_size: 500 });
      const productsList = response.results || response || [];
      setProducts(productsList);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      const categoriesList = response.results || response || [];
      setCategories(categoriesList);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories([]);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.id === selectedCategory || 
        product.category?.name === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.barcode?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSelectProduct = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    onClose();
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            <Typography variant="h6">Product Lookup</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name, SKU, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoFocus
          />
        </Box>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All" value="all" />
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Tabs>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Products Grid */}
        {!loading && (
          <Box sx={{ 
            height: 'calc(90vh - 250px)', 
            overflow: 'auto',
            mt: 2
          }}>
            {filteredProducts.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                color: 'text.secondary'
              }}>
                <InventoryIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                <Typography variant="h6">
                  {searchQuery ? 'No products found' : 'No products available'}
                </Typography>
                <Typography variant="body2">
                  {searchQuery 
                    ? 'Try a different search term' 
                    : 'Add products in the backoffice to get started'}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={6} sm={4} md={3} key={product.id}>
                    <Card
                      onClick={() => handleSelectProduct(product)}
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        transition: 'all 0.2s',
                        border: '2px solid transparent',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                          borderColor: '#1976d2'
                        },
                        backgroundColor: product.stock_quantity > 0 ? 'white' : '#ffebee'
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        {/* Product Image Placeholder */}
                        <Box sx={{
                          width: '100%',
                          height: 120,
                          backgroundColor: '#e3f2fd',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1.5
                        }}>
                          <InventoryIcon sx={{ fontSize: 48, color: '#1976d2', opacity: 0.5 }} />
                        </Box>
                        
                        {/* Product Name */}
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {product.name}
                        </Typography>
                        
                        {/* SKU */}
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ display: 'block', mb: 1 }}
                        >
                          {product.sku}
                        </Typography>
                        
                        {/* Price */}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#1976d2',
                            mb: 0.5
                          }}
                        >
                          ₹{parseFloat(product.price || 0).toFixed(2)}
                        </Typography>
                        
                        {/* Stock Status */}
                        {product.stock_quantity > 0 ? (
                          <Chip 
                            label={`Stock: ${product.stock_quantity}`} 
                            size="small" 
                            color="success"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ) : (
                          <Chip 
                            label="Out of Stock" 
                            size="small" 
                            color="error"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default ProductLookupDialog;

