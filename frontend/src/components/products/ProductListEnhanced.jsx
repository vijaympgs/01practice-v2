import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Pagination,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalOffer as OfferIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  deleteProduct,
  clearError
} from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

const ProductListEnhanced = ({ onAddProduct, onEditProduct, onViewProduct }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    is_active: null,
    is_taxable: null,
    stock_status: '',
    price_range: '',
    brand: ''
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      is_active: null,
      is_taxable: null,
      stock_status: '',
      price_range: '',
      brand: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        dispatch(fetchProducts());
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleEdit = () => {
    onEditProduct(selectedProduct);
    handleMenuClose();
  };

  const handleView = () => {
    onViewProduct(selectedProduct);
    handleMenuClose();
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Filter and search logic
  const filteredProducts = products?.filter(product => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!product.name?.toLowerCase().includes(query) &&
          !product.sku?.toLowerCase().includes(query) &&
          !product.brand?.toLowerCase().includes(query) &&
          !product.description?.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && product.category?.id !== filters.category) {
      return false;
    }

    // Active filter
    if (filters.is_active !== null && product.is_active !== filters.is_active) {
      return false;
    }

    // Taxable filter
    if (filters.is_taxable !== null && product.is_taxable !== filters.is_taxable) {
      return false;
    }

    // Stock status filter
    if (filters.stock_status) {
      const stock = parseInt(product.stock_quantity) || 0;
      const minStock = parseInt(product.minimum_stock) || 0;
      
      switch (filters.stock_status) {
        case 'out_of_stock':
          if (stock > 0) return false;
          break;
        case 'low_stock':
          if (stock > minStock || stock <= 0) return false;
          break;
        case 'in_stock':
          if (stock <= 0) return false;
          break;
        default:
          break;
      }
    }

    // Price range filter
    if (filters.price_range) {
      const price = parseFloat(product.price) || 0;
      switch (filters.price_range) {
        case 'under_10':
          if (price >= 10) return false;
          break;
        case '10_50':
          if (price < 10 || price >= 50) return false;
          break;
        case '50_100':
          if (price < 50 || price >= 100) return false;
          break;
        case 'over_100':
          if (price < 100) return false;
          break;
        default:
          break;
      }
    }

    // Brand filter
    if (filters.brand && product.brand?.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    return true;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get stock status
  const getStockStatus = (product) => {
    const stock = parseInt(product.stock_quantity) || 0;
    const minStock = parseInt(product.minimum_stock) || 0;

    if (stock <= 0) return { status: 'Out of Stock', color: 'error', icon: <WarningIcon /> };
    if (stock <= minStock) return { status: 'Low Stock', color: 'warning', icon: <TrendingDownIcon /> };
    return { status: 'In Stock', color: 'success', icon: <TrendingUpIcon /> };
  };

  // Get profit margin color
  const getProfitMarginColor = (product) => {
    if (!product.cost || !product.price) return 'default';
    const margin = ((parseFloat(product.price) - parseFloat(product.cost)) / parseFloat(product.price)) * 100;
    if (margin < 0) return 'error';
    if (margin < 20) return 'warning';
    return 'success';
  };

  const renderProductCard = (product) => {
    const stockStatus = getStockStatus(product);
    const profitMarginColor = getProfitMarginColor(product);
    const profitMargin = product.cost && product.price ? 
      (((parseFloat(product.price) - parseFloat(product.cost)) / parseFloat(product.price)) * 100).toFixed(1) : 
      'N/A';

    return (
      <Card key={product.id} sx={{ mb: 2, '&:hover': { boxShadow: 4 } }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" flex={1}>
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onChange={() => handleSelectProduct(product.id)}
                size="small"
              />
              
              <Avatar
                sx={{ 
                  width: 48, 
                  height: 48, 
                  ml: 1, 
                  mr: 2,
                  bgcolor: 'primary.light',
                  fontSize: '1.2rem'
                }}
              >
                {product.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Chip
                    label={product.is_active ? 'Active' : 'Inactive'}
                    color={product.is_active ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    {...stockStatus}
                    label={stockStatus.status}
                    size="small"
                    variant="outlined"
                    icon={stockStatus.icon}
                  />
                </Box>
                
                <Box display="flex" alignItems="center" gap={3} mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>SKU:</strong> {product.sku}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Price:</strong> ${parseFloat(product.price || 0).toFixed(2)}
                  </Typography>
                  {product.cost && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Cost:</strong> ${parseFloat(product.cost).toFixed(2)}
                    </Typography>
                  )}
                  <Chip
                    label={`Margin: ${profitMargin}%`}
                    color={profitMarginColor}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                
                <Box display="flex" alignItems="center" gap={3}>
                  <Typography variant="caption" color="text.secondary">
                    <InventoryIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Stock: {product.stock_quantity || 0}
                  </Typography>
                  {product.category && (
                    <Typography variant="caption" color="text.secondary">
                      <CategoryIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {product.category.name}
                    </Typography>
                  )}
                  {product.brand && (
                    <Typography variant="caption" color="text.secondary">
                      <OfferIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {product.brand}
                    </Typography>
                  )}
                  {product.is_taxable && (
                    <Chip
                      label={`Tax: ${product.tax_rate || 0}%`}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  )}
                </Box>
                
                {product.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title="Stock Value">
                <Chip
                  icon={<MoneyIcon />}
                  label={`$${((parseInt(product.stock_quantity) || 0) * (parseFloat(product.price) || 0)).toFixed(2)}`}
                  variant="outlined"
                  size="small"
                />
              </Tooltip>
              
              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, product)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading && products?.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredProducts.length} of {products?.length || 0} products
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddProduct}
          size="large"
        >
          Add Product
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products by name, SKU, brand, or description..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {Object.values(filters).filter(v => v !== '' && v !== null).length > 0 && 
                  `(${Object.values(filters).filter(v => v !== '' && v !== null).length})`}
              </Button>
              <Button
                variant="outlined"
                onClick={clearFilters}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Filter Options */}
        {showFilters && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories?.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Stock Status</InputLabel>
                  <Select
                    value={filters.stock_status}
                    onChange={(e) => handleFilterChange('stock_status', e.target.value)}
                    label="Stock Status"
                  >
                    <MenuItem value="">All Stock</MenuItem>
                    <MenuItem value="in_stock">In Stock</MenuItem>
                    <MenuItem value="low_stock">Low Stock</MenuItem>
                    <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={filters.price_range}
                    onChange={(e) => handleFilterChange('price_range', e.target.value)}
                    label="Price Range"
                  >
                    <MenuItem value="">All Prices</MenuItem>
                    <MenuItem value="under_10">Under $10</MenuItem>
                    <MenuItem value="10_50">$10 - $50</MenuItem>
                    <MenuItem value="50_100">$50 - $100</MenuItem>
                    <MenuItem value="over_100">Over $100</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.is_active === true}
                        onChange={(e) => handleFilterChange('is_active', e.target.checked ? true : null)}
                        size="small"
                      />
                    }
                    label="Active Only"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.is_taxable === true}
                        onChange={(e) => handleFilterChange('is_taxable', e.target.checked ? true : null)}
                        size="small"
                      />
                    }
                    label="Taxable Only"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              {selectedProducts.length} product(s) selected
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedProducts([])}
            >
              Clear Selection
            </Button>
          </Box>
        </Paper>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Products List */}
      {paginatedProducts.length > 0 ? (
        <>
          {/* Select All */}
          <Box mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                  onChange={handleSelectAll}
                />
              }
              label={`Select All (${filteredProducts.length} products)`}
            />
          </Box>

          {/* Product Cards */}
          {paginatedProducts.map(renderProductCard)}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery || Object.values(filters).some(v => v !== '' && v !== null) 
              ? 'No products found matching your criteria' 
              : 'No products found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery || Object.values(filters).some(v => v !== '' && v !== null)
              ? 'Try adjusting your search or filters'
              : 'Click "Add Product" to create your first product'}
          </Typography>
        </Paper>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Product
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedProduct?.id); handleMenuClose(); }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Product
        </MenuItem>
      </Menu>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default ProductListEnhanced;






