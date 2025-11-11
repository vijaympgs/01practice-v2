/**
 * OptiMind Retail™ POS System - Main Interface Component
 * 
 * This is the main POS interface component that demonstrates:
 * - IndexedDB integration
 * - Transaction processing
 * - Product search
 * - Real-time cart management
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import indexedDBManager from '../../services/IndexedDBManager.js';
import transactionManager from '../../services/TransactionManager.js';
import productManager from '../../services/ProductManager.js';

const POSInterface = () => {
  // State management
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentCart, setCurrentCart] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Initialize POS system
  useEffect(() => {
    initializePOS();
  }, []);

  const initializePOS = async () => {
    try {
      setLoading(true);
      setMessage('🚀 Initializing OptiMind Retail™ POS System...');
      
      console.log('🔄 Starting POS initialization...');
      
      // Initialize all managers
      console.log('🔄 Initializing IndexedDB...');
      await indexedDBManager.initialize();
      
      console.log('🔄 Initializing TransactionManager...');
      // await transactionManager.initialize(); // DISABLED FOR TESTING
      
      console.log('🔄 Initializing ProductManager...');
      // await productManager.initialize(); // DISABLED FOR TESTING
      
      // Load some sample products for testing
      await loadSampleProducts();
      
      // Get database stats
      const dbStats = await indexedDBManager.getStats();
      setStats(dbStats);
      
      setIsInitialized(true);
      setMessage('✅ POS System ready! IndexedDB initialized with unlimited offline storage.');
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(`❌ Initialization failed: ${error.message}`);
      console.error('POS Initialization Error:', error);
      console.error('Error stack:', error.stack);
      
      // Set a fallback state to prevent blank page
      setIsInitialized(true);
      setProducts([]);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleProducts = async () => {
    const sampleProducts = [
      {
        id: '1',
        name: 'Coca Cola 330ml',
        barcode: '1234567890123',
        category: 'Beverages',
        price: 2.50,
        cost: 1.80,
        taxRate: 10,
        currentStock: 100,
        minLevel: 10,
        maxLevel: 500
      },
      {
        id: '2',
        name: 'Chocolate Bar',
        barcode: '1234567890124',
        category: 'Snacks',
        price: 3.20,
        cost: 2.10,
        taxRate: 10,
        currentStock: 50,
        minLevel: 5,
        maxLevel: 200
      },
      {
        id: '3',
        name: 'Mineral Water 500ml',
        barcode: '1234567890125',
        category: 'Beverages',
        price: 1.80,
        cost: 1.20,
        taxRate: 10,
        currentStock: 75,
        minLevel: 15,
        maxLevel: 300
      },
      {
        id: '4',
        name: 'Sandwich',
        barcode: '1234567890126',
        category: 'Food',
        price: 5.50,
        cost: 3.80,
        taxRate: 10,
        currentStock: 25,
        minLevel: 5,
        maxLevel: 100
      }
    ];

    // Set products directly instead of using productManager
    setProducts(sampleProducts);
    setSearchResults(sampleProducts);
    
    console.log('✅ Sample products loaded:', sampleProducts.length);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(products);
      return;
    }
    
    try {
      setLoading(true);
      
      // Simple client-side search instead of using productManager
      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results);
    } catch (error) {
      setMessage(`❌ Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startNewTransaction = async () => {
    try {
      // Mock transaction creation
      const transaction = {
        id: `TXN-${Date.now()}`,
        operatorId: 'OP001',
        sessionId: 'SESS001',
        timestamp: new Date(),
        status: 'in_progress',
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0
      };
      
      setCurrentTransaction(transaction);
      setCurrentCart([]);
      setMessage('🛒 New transaction started');
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage(`❌ Failed to start transaction: ${error.message}`);
    }
  };

  const addToCart = async (product) => {
    if (!currentTransaction) {
      setMessage('⚠️ Please start a transaction first');
      return;
    }

    try {
      // Simple cart management without transactionManager
      const newItem = {
        id: `item-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
        barcode: product.barcode,
        category: product.category
      };
      
      setCurrentCart(prev => [...prev, newItem]);
      setMessage(`✅ Added ${product.name} to cart`);
      setTimeout(() => setMessage(null), 1500);
    } catch (error) {
      setMessage(`❌ Failed to add to cart: ${error.message}`);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      // Simple quantity update without transactionManager
      setCurrentCart(prev => 
        prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
            : item
        ).filter(item => item.quantity > 0)
      );
    } catch (error) {
      setMessage(`❌ Failed to update quantity: ${error.message}`);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      // Simple removal without transactionManager
      setCurrentCart(prev => prev.filter(item => item.productId !== productId));
      setMessage('✅ Item removed from cart');
      setTimeout(() => setMessage(null), 1500);
    } catch (error) {
      setMessage(`❌ Failed to remove item: ${error.message}`);
    }
  };

  const completeTransaction = async () => {
    if (!currentTransaction || currentCart.length === 0) {
      setMessage('⚠️ No transaction to complete');
      return;
    }

    try {
      // Add cash payment for full amount
      const total = currentCart.reduce((sum, item) => sum + item.total, 0);
      await transactionManager.addPayment('cash', total);
      
      // Complete transaction
      const completed = await transactionManager.completeTransaction();
      
      setMessage(`✅ Transaction completed! Total: $${total.toFixed(2)}`);
      
      // Reset interface
      setCurrentTransaction(null);
      setCurrentCart([]);
      
      // Refresh stats
      const dbStats = await indexedDBManager.getStats();
      setStats(dbStats);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(`❌ Failed to complete transaction: ${error.message}`);
    }
  };

  if (!isInitialized) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Initializing OptiMind Retail™ POS System...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Setting up IndexedDB for unlimited offline operation
        </Typography>
      </Box>
    );
  }

  // Debug: Log component state
  console.log('POSInterface render:', { isInitialized, loading, message, products, searchResults });

  return (
    <Box sx={{ p: 2, height: '100vh', overflow: 'hidden' }}>
      {message && (
        <Alert 
          severity={message.includes('❌') ? 'error' : message.includes('⚠️') ? 'warning' : 'success'}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Panel - Product Search */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🛍️ Product Search
              </Typography>
              
              {/* Search Bar */}
              <TextField
                fullWidth
                placeholder="Search products or scan barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Search'}
              </Button>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {searchResults.map((product) => (
                      <ListItem key={product.id} divider>
                        <ListItemText
                          primary={product.name}
                          secondary={`$${product.price.toFixed(2)} | Stock: ${product.inventory?.current || 0}`}
                        />
                        <ListItemSecondaryAction>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => addToCart(product)}
                            disabled={!currentTransaction}
                          >
                            <AddIcon />
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Cart & Transaction */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  🛒 Shopping Cart
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={startNewTransaction}
                  disabled={currentTransaction}
                >
                  New Transaction
                </Button>
              </Box>

              {/* Transaction Info */}
              {currentTransaction && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="body2">
                    Transaction: {currentTransaction.id}
                  </Typography>
                  <Typography variant="body2">
                    Status: {currentTransaction.status}
                  </Typography>
                </Paper>
              )}

              {/* Cart Items */}
              {currentCart.length > 0 ? (
                <Paper sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                  <List>
                    {currentCart.map((item) => (
                      <ListItem key={item.id} divider>
                        <ListItemText
                          primary={item.name}
                          secondary={`$${item.price.toFixed(2)} x ${item.quantity}`}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Chip label={item.quantity} size="small" />
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cart is empty. Search and add products to start.
                  </Typography>
                </Paper>
              )}

              {/* Cart Total */}
              {currentCart.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">
                      ${currentCart.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={completeTransaction}
                  disabled={!currentTransaction || currentCart.length === 0}
                  startIcon={<ReceiptIcon />}
                >
                  Complete Sale
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bottom Panel - System Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 System Status
              </Typography>
              {stats && (
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Chip 
                      label={`Products: ${stats.products || 0}`} 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Chip 
                      label={`Transactions: ${stats.transactions || 0}`} 
                      color="success" 
                      variant="outlined" 
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Chip 
                      label={`Inventory: ${stats.inventory || 0}`} 
                      color="warning" 
                      variant="outlined" 
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Chip 
                      label={`Sync Queue: ${stats.syncQueue || 0}`} 
                      color="info" 
                      variant="outlined" 
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POSInterface;
