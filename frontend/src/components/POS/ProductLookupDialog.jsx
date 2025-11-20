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
  Snackbar,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import itemMasterService from '../../services/itemMasterService.js';
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
  const [quickItemDialogOpen, setQuickItemDialogOpen] = useState(false);
  const [quickItemForm, setQuickItemForm] = useState({
    name: '',
    code: '',
    price: '',
    taxInclusive: false,
  });
  const [quickItemErrors, setQuickItemErrors] = useState({});
  const [quickItemSubmitting, setQuickItemSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

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

  const normalizeItemMasterProduct = (item) => {
    const price = parseFloat(item.sell_price ?? item.mrp ?? 0) || 0;
    return {
      id: item.id,
      name: item.item_name,
      sku: item.item_code,
      barcode: item.ean_upc_code || '',
      price,
      stock_quantity: item.stock_quantity ?? 0,
      description: item.short_name || '',
      category: item.category
        ? { id: item.category, name: item.category_name }
        : item.category_name
        ? { id: null, name: item.category_name }
        : null,
      tax_inclusive: item.tax_inclusive,
      _source: 'item-master',
      _raw: item,
    };
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemMasterService.getItems({
        is_active: true,
        page_size: 500,
        ordering: 'item_name',
      });
      const items = response.results || response || [];
      setProducts(items.map(normalizeItemMasterProduct));
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const generateQuickItemCode = () => {
    const now = new Date();
    return `QI-${now.getFullYear()}${(now.getTime() % 1000000).toString().padStart(6, '0')}`;
  };

  const handleOpenQuickItemDialog = () => {
    setQuickItemForm({
      name: '',
      code: generateQuickItemCode(),
      price: '',
      taxInclusive: false,
    });
    setQuickItemErrors({});
    setQuickItemDialogOpen(true);
  };

  const handleCloseQuickItemDialog = () => {
    if (quickItemSubmitting) return;
    setQuickItemDialogOpen(false);
  };

  const handleQuickItemFieldChange = (field, value) => {
    setQuickItemForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateQuickItemForm = () => {
    const errors = {};
    if (!quickItemForm.name.trim()) {
      errors.name = 'Item name is required';
    } else if (quickItemForm.name.trim().length < 2) {
      errors.name = 'Item name must be at least 2 characters';
    }

    if (!quickItemForm.code.trim()) {
      errors.code = 'Item code/SKU is required';
    }

    const priceValue = parseFloat(quickItemForm.price);
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    return errors;
  };

  const handleQuickItemSubmit = async (event) => {
    event.preventDefault();
    const errors = validateQuickItemForm();
    if (Object.keys(errors).length > 0) {
      setQuickItemErrors(errors);
      return;
    }

    try {
      setQuickItemSubmitting(true);
      setQuickItemErrors({});

      const priceValue = parseFloat(quickItemForm.price) || 0;
      const payload = {
        item_name: quickItemForm.name.trim(),
        item_code: quickItemForm.code.trim(),
        short_name: quickItemForm.name.trim(),
        sell_price: priceValue,
        mrp: priceValue,
        cost_price: 0,
        landing_cost: 0,
        tax_inclusive: quickItemForm.taxInclusive,
        allow_negative_stock: true,
        allow_buy_back: false,
        store_pickup: false,
        material_type: 'finished',
        item_type: 'device',
        exchange_type: 'none',
        is_active: true,
      };

      const createdItem = await itemMasterService.createItem(payload);
      setQuickItemDialogOpen(false);
      setNotification({
        type: 'success',
        message: `Quick item "${createdItem.item_name}" created successfully.`,
      });
      setSearchQuery(createdItem.item_name || createdItem.item_code || '');
      await loadProducts();
    } catch (submitError) {
      setQuickItemErrors({
        form: submitError.message || 'Failed to create quick item',
      });
    } finally {
      setQuickItemSubmitting(false);
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
    <>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenQuickItemDialog}
                sx={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  '&:hover': { backgroundColor: '#155a9c' },
                }}
                variant="contained"
              >
                Quick Item
              </Button>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
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

      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {notification && (
          <Alert
            onClose={() => setNotification(null)}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>

      <Dialog open={quickItemDialogOpen} onClose={handleCloseQuickItemDialog} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleQuickItemSubmit}>
          <DialogTitle>Create Quick Item</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Capture quick sale items with minimal fields. You can complete full details in Item Master later.
            </Typography>

            {quickItemErrors.form && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {quickItemErrors.form}
              </Alert>
            )}

            <TextField
              label="Item Name"
              placeholder="e.g., USB-C Cable"
              fullWidth
              value={quickItemForm.name}
              onChange={(e) => handleQuickItemFieldChange('name', e.target.value)}
              error={Boolean(quickItemErrors.name)}
              helperText={quickItemErrors.name}
              disabled={quickItemSubmitting}
              sx={{ mb: 2 }}
              autoFocus
            />

            <TextField
              label="Item Code / SKU"
              placeholder="e.g., QUICK-001"
              fullWidth
              value={quickItemForm.code}
              onChange={(e) => handleQuickItemFieldChange('code', e.target.value)}
              error={Boolean(quickItemErrors.code)}
              helperText={quickItemErrors.code}
              disabled={quickItemSubmitting}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Selling Price"
              placeholder="0.00"
              fullWidth
              value={quickItemForm.price}
              onChange={(e) => handleQuickItemFieldChange('price', e.target.value)}
              error={Boolean(quickItemErrors.price)}
              helperText={quickItemErrors.price}
              disabled={quickItemSubmitting}
              type="number"
              inputProps={{ min: '0', step: '0.01' }}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={quickItemForm.taxInclusive}
                  onChange={(e) => handleQuickItemFieldChange('taxInclusive', e.target.checked)}
                  disabled={quickItemSubmitting}
                  color="primary"
                />
              }
              label="Price includes tax"
              sx={{ mb: 1 }}
            />

            <Alert severity="info">
              Saved quick items are persisted to Item Master and will appear here instantly.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseQuickItemDialog} disabled={quickItemSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={quickItemSubmitting}
            >
              {quickItemSubmitting ? 'Saving...' : 'Create Item'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default ProductLookupDialog;

