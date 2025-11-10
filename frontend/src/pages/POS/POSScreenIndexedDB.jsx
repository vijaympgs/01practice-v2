import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Payment as PaymentIcon,
  Save as SaveIcon,
  PointOfSale as PointOfSaleIcon,
} from '@mui/icons-material';

// Import our IndexedDB-based managers
import PageTitle from '../../components/common/PageTitle';
import indexedDBManager from '../../services/IndexedDBManager';
import productManager from '../../services/ProductManager';
import transactionManager from '../../services/TransactionManager';
import { populateSampleData } from '../../services/populateSampleData';
import { clearIndexedDB } from '../../services/clearIndexedDB';

const POSScreenIndexedDB = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Product search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Cart and transaction
  const [cart, setCart] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [customer, setCustomer] = useState(null);
  
  // UI state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Initialize managers
  useEffect(() => {
    const initializeManagers = async () => {
      try {
        setLoading(true);
        await indexedDBManager.initialize();
        await productManager.initialize();
        await transactionManager.initialize();
        
        // Start a new transaction
        const transaction = await transactionManager.startTransaction('operator_1', 'session_1');
        setCurrentTransaction(transaction);
        
        setSuccess('POS System initialized successfully!');
        console.log('✅ POS System initialized with IndexedDB managers');
      } catch (error) {
        console.error('❌ Failed to initialize POS system:', error);
        setError('Failed to initialize POS system: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeManagers();
  }, []);

  // Search products
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const results = await productManager.searchProducts(searchQuery, { limit: 10 });
      setSearchResults(results);
      console.log('🔍 Search results:', results);
    } catch (error) {
      console.error('❌ Search failed:', error);
      setError('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const handleAddToCart = async (product) => {
    try {
      await transactionManager.addProductToCart(product, 1);
      const updatedCart = transactionManager.getCurrentCart();
      setCart(updatedCart);
      setSnackbar({ open: true, message: `Added ${product.name} to cart`, severity: 'success' });
      console.log('➕ Added product to cart:', product.name);
    } catch (error) {
      console.error('❌ Failed to add product to cart:', error);
      setError('Failed to add product to cart: ' + error.message);
    }
  };

  // Remove product from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      await transactionManager.removeProductFromCart(productId);
      const updatedCart = transactionManager.getCurrentCart();
      setCart(updatedCart);
      setSnackbar({ open: true, message: 'Product removed from cart', severity: 'info' });
    } catch (error) {
      console.error('❌ Failed to remove product from cart:', error);
      setError('Failed to remove product from cart: ' + error.message);
    }
  };

  // Update product quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await transactionManager.updateProductQuantity(productId, newQuantity);
      const updatedCart = transactionManager.getCurrentCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('❌ Failed to update quantity:', error);
      setError('Failed to update quantity: ' + error.message);
    }
  };

  // Clear database
  const handleClearDatabase = async () => {
    try {
      setLoading(true);
      await clearIndexedDB();
      setSnackbar({ 
        open: true, 
        message: 'Database cleared successfully! Please refresh the page.', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('❌ Failed to clear database:', error);
      setError('Failed to clear database: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Populate sample data
  const handlePopulateSampleData = async () => {
    try {
      setLoading(true);
      const result = await populateSampleData();
      if (result.success) {
        setSnackbar({ 
          open: true, 
          message: `Sample data populated! Added ${result.addedCount} products.`, 
          severity: 'success' 
        });
      } else {
        setError('Failed to populate sample data: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Failed to populate sample data:', error);
      setError('Failed to populate sample data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Complete transaction
  const handleCompleteTransaction = async () => {
    try {
      setLoading(true);
      
      // Add cash payment
      await transactionManager.addPayment('cash', currentTransaction?.total || 0);
      
      // Complete transaction
      const completedTransaction = await transactionManager.completeTransaction();
      
      setSnackbar({ 
        open: true, 
        message: `Transaction completed! Total: $${completedTransaction.total}`, 
        severity: 'success' 
      });
      
      // Start new transaction
      const newTransaction = await transactionManager.startTransaction('operator_1', 'session_1');
      setCurrentTransaction(newTransaction);
      setCart([]);
      
      console.log('✅ Transaction completed:', completedTransaction);
    } catch (error) {
      console.error('❌ Failed to complete transaction:', error);
      setError('Failed to complete transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <Box sx={{ height: '100vh', p: 2, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <PageTitle 
          title="NewBorn Retail™ POS System" 
          subtitle="Advanced offline-first point of sale system"
          showIcon={true}
          icon={<PointOfSaleIcon />}
        />
      </Paper>

      <Grid container spacing={2} sx={{ height: 'calc(100vh - 120px)' }}>
        {/* Left Column - Product Search */}
        <Grid item xs={4}>
          <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              🔍 Product Search
            </Typography>
            
            {/* Search Input */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch} disabled={loading}>
                      {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                    </IconButton>
                  ),
                }}
              />
            </Box>

            {/* Sample Data Buttons */}
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handlePopulateSampleData}
                disabled={loading}
                sx={{ mb: 1 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Populate Sample Data'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleClearDatabase}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Clear Database'}
              </Button>
            </Box>

            {/* Search Results */}
            <Box sx={{ maxHeight: '60%', overflow: 'auto' }}>
              {searchResults.map((product) => (
                <Card key={product.id} sx={{ mb: 1, cursor: 'pointer' }} onClick={() => setSelectedProduct(product)}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                    <Typography variant="body2">
                      Stock: {product.inventory?.current || 0}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Selected Product Details */}
            {selectedProduct && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Selected Product
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedProduct.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Price:</strong> ${selectedProduct.price}
                </Typography>
                <Typography variant="body1">
                  <strong>Category:</strong> {selectedProduct.category}
                </Typography>
                <Typography variant="body1">
                  <strong>Stock:</strong> {selectedProduct.inventory?.current || 0}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Cart */}
        <Grid item xs={8}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                🛒 Shopping Cart ({getCartItemCount()} items)
              </Typography>
              <Typography variant="h5" color="primary">
                Total: ${getCartTotal().toFixed(2)}
              </Typography>
            </Box>

            {/* Cart Items */}
            <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
              {cart.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Cart is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Search and add products to get started
                  </Typography>
                </Box>
              ) : (
                cart.map((item) => (
                  <Card key={item.id} sx={{ mb: 1 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${item.price} each
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                          <Typography variant="h6" color="primary" sx={{ minWidth: 80, textAlign: 'right' }}>
                            ${item.total.toFixed(2)}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFromCart(item.productId)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                disabled={cart.length === 0}
              >
                Suspend Sale
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<PaymentIcon />}
                onClick={handleCompleteTransaction}
                disabled={cart.length === 0 || loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Complete Sale'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default POSScreenIndexedDB;
