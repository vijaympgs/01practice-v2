/**
 * OptiMind Retail™ POS System - Advanced Interface Component
 * 
 * Enhanced POS interface with advanced features:
 * - Multi-shift management with operator tracking
 * - Cash drawer operations and balancing
 * - Offline receipt generation and queuing
 * - Real-time performance monitoring
 * - Advanced transaction operations
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  AccountBalanceWallet as CashIcon,
  Schedule as ScheduleIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import indexedDBManager from '../../services/IndexedDBManager.js';
import transactionManager from '../../services/TransactionManager.js';
import productManager from '../../services/ProductManager.js';
import shiftManager from '../../services/ShiftManager.js';
import cashDrawerManager from '../../services/CashDrawerManager.js';
import receiptManager from '../../services/ReceiptManager.js';

const POSInterfaceAdvanced = () => {
  // State management
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentOperator, setCurrentOperator] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentDrawer, setCurrentDrawer] = useState(null);
  
  // Transaction state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentCart, setCurrentCart] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Dialog states
  const [operatorDialogOpen, setOperatorDialogOpen] = useState(false);
  const [cashDialogOpen, setCashDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  
  // Operator login state
  const [operatorId, setOperatorId] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [openingCash, setOpeningCash] = useState({});

  // Initialize POS system
  useEffect(() => {
    initializePOS();
  }, []);

  const initializePOS = async () => {
    try {
      setLoading(true);
      setMessage('🚀 Initializing Advanced OptiMind Retail™ POS System...');
      
      console.log('🔄 Starting Advanced POS initialization...');
      
      // Initialize all managers
      console.log('🔄 Initializing IndexedDB...');
      await indexedDBManager.initialize();
      
      console.log('🔄 Initializing TransactionManager...');
      await transactionManager.initialize();
      
      console.log('🔄 Initializing ProductManager...');
      await productManager.initialize();
      
      console.log('🔄 Initializing ShiftManager...');
      await shiftManager.initialize();
      
      console.log('🔄 Initializing CashDrawerManager...');
      await cashDrawerManager.initialize();
      
      console.log('🔄 Initializing ReceiptManager...');
      await receiptManager.initialize();
      
      // Load sample products
      await loadSampleProducts();
      
      // Get system stats
      const dbStats = await indexedDBManager.getStats();
      setStats(dbStats);
      
      setIsInitialized(true);
      setMessage('✅ Advanced POS System ready! Multi-shift management and cash drawer operations available.');
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(`❌ Initialization failed: ${error.message}`);
      console.error('Advanced POS Initialization Error:', error);
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
        name: 'Premium Coffee',
        barcode: '9876543210987',
        category: 'Beverages',
        price: 4.50,
        cost: 2.80,
        taxRate: 10,
        currentStock: 50,
        minLevel: 10,
        maxLevel: 200
      },
      {
        name: 'Organic Sandwich',
        barcode: '9876543210988',
        category: 'Food',
        price: 8.99,
        cost: 5.50,
        taxRate: 10,
        currentStock: 20,
        minLevel: 5,
        maxLevel: 100
      },
      {
        name: 'Energy Drink',
        barcode: '9876543210989',
        category: 'Beverages',
        price: 3.25,
        cost: 1.90,
        taxRate: 10,
        currentStock: 75,
        minLevel: 15,
        maxLevel: 300
      }
    ];

    for (const productData of sampleProducts) {
      try {
        await productManager.addProduct(productData);
      } catch (error) {
        console.log('Product already exists:', productData.name);
      }
    }
  };

  const handleOperatorLogin = async () => {
    if (!operatorId.trim() || !operatorName.trim()) {
      setMessage('⚠️ Please enter operator ID and name');
      return;
    }

    try {
      setLoading(true);
      
      // Start shift
      const session = await shiftManager.startShift(operatorId, operatorName, calculateTotalCash(openingCash));
      setCurrentSession(session);
      setCurrentOperator({ id: operatorId, name: operatorName });

      // Open cash drawer
      const drawer = await cashDrawerManager.openDrawer(operatorId, session.id, openingCash);
      setCurrentDrawer(drawer);

      setOperatorDialogOpen(false);
      setMessage(`✅ Welcome ${operatorName}! Shift started successfully.`);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(`❌ Failed to start shift: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOperatorLogout = async () => {
    if (!currentSession || !currentDrawer) {
      setMessage('⚠️ No active session to end');
      return;
    }

    try {
      setLoading(true);
      
      // Close cash drawer (mock closing count)
      const closingCount = { ...openingCash }; // In real app, operator would count
      await cashDrawerManager.closeDrawer(currentOperator.id, closingCount, 'End of shift');
      
      // End shift
      await shiftManager.endShift(closingCount, 'End of shift');
      
      // Reset state
      setCurrentSession(null);
      setCurrentOperator(null);
      setCurrentDrawer(null);
      setCurrentTransaction(null);
      setCurrentCart([]);
      
      setMessage(`✅ Goodbye ${currentOperator?.name}! Shift ended successfully.`);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(`❌ Failed to end shift: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const results = await productManager.searchProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      setMessage(`❌ Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startNewTransaction = async () => {
    if (!currentSession) {
      setMessage('⚠️ Please login to start a transaction');
      return;
    }

    try {
      const transaction = await transactionManager.startTransaction(currentOperator.id, currentSession.id);
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
      await transactionManager.addProductToCart(product, 1);
      const cart = transactionManager.getCurrentCart();
      setCurrentCart(cart);
      setMessage(`✅ Added ${product.name} to cart`);
      setTimeout(() => setMessage(null), 1500);
    } catch (error) {
      setMessage(`❌ Failed to add to cart: ${error.message}`);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await transactionManager.updateProductQuantity(productId, newQuantity);
      const cart = transactionManager.getCurrentCart();
      setCurrentCart(cart);
    } catch (error) {
      setMessage(`❌ Failed to update quantity: ${error.message}`);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await transactionManager.removeProductFromCart(productId);
      const cart = transactionManager.getCurrentCart();
      setCurrentCart(cart);
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
      // Calculate total
      const total = currentCart.reduce((sum, item) => sum + item.total, 0);
      
      // Add cash payment
      await transactionManager.addPayment('cash', total);
      
      // Complete transaction
      const completed = await transactionManager.completeTransaction();
      
      // Record cash movement
      await cashDrawerManager.recordCashTransaction(completed.id, total, 'sale');
      
      // Record in shift
      await shiftManager.recordTransaction(completed.id, completed);
      
      // Generate receipt
      const receipt = await receiptManager.generateReceipt(completed, {
        queueForPrint: true,
        queueForEmail: true
      });
      
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

  const calculateTotalCash = (cashCount) => {
    const denominations = {
      '100': 100.00, '50': 50.00, '20': 20.00, '10': 10.00, '5': 5.00, '1': 1.00,
      '0.50': 0.50, '0.25': 0.25, '0.10': 0.10, '0.05': 0.05, '0.01': 0.01
    };
    
    let total = 0;
    Object.keys(cashCount).forEach(denomination => {
      if (denominations[denomination]) {
        total += (cashCount[denomination] || 0) * denominations[denomination];
      }
    });
    
    return total;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!isInitialized) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Initializing Advanced OptiMind Retail™ POS System...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Setting up multi-shift management, cash drawer, and receipt systems
        </Typography>
      </Box>
    );
  }

  // Debug: Log component state
  console.log('POSInterfaceAdvanced render:', { isInitialized, loading, message, products, searchResults });

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

      {/* Header with operator info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          🚀 OptiMind Retail™ Advanced POS
        </Typography>
        
        {currentOperator ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<PersonIcon />}
              label={`${currentOperator.name} (${currentOperator.id})`}
              color="primary"
              variant="outlined"
            />
            <Chip 
              icon={<ScheduleIcon />}
              label={currentSession?.id || 'No Session'}
              color="success"
              variant="outlined"
            />
            <Chip 
              icon={<CashIcon />}
              label={`$${currentDrawer?.openingCount?.total?.toFixed(2) || '0.00'}`}
              color="warning"
              variant="outlined"
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleOperatorLogout}
              startIcon={<SecurityIcon />}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOperatorDialogOpen(true)}
            startIcon={<PersonIcon />}
          >
            Operator Login
          </Button>
        )}
      </Box>

      {/* Main content tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="🛒 Sales" />
        <Tab label="💰 Cash Drawer" />
        <Tab label="🧾 Receipts" />
        <Tab label="📊 Performance" />
        <Tab label="⚙️ Settings" />
      </Tabs>

      {/* Sales Tab */}
      {activeTab === 0 && (
        <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
          {/* Left Panel - Product Search */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🛍️ Product Search
                </Typography>
                
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Cash Drawer Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💰 Cash Drawer Management
            </Typography>
            
            {currentDrawer ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Current Drawer Status: <Chip label="OPEN" color="success" />
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Opening Cash: ${currentDrawer.openingCount.total.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Expected Amount: ${(currentDrawer.openingCount.total + currentDrawer.expectedAmount).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Transactions: {currentDrawer.transactions.length}
                </Typography>
                
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => setCashDialogOpen(true)}
                >
                  Close Drawer
                </Button>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No cash drawer open. Please login to start a shift.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Receipts Tab */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🧾 Receipt Management
            </Typography>
            <Button
              variant="contained"
              onClick={() => setReceiptDialogOpen(true)}
              startIcon={<ReceiptIcon />}
              sx={{ mb: 2 }}
            >
              View Receipt Queue
            </Button>
            <Typography variant="body2" color="text.secondary">
              Receipts are automatically generated and queued for printing and email delivery.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Performance Tab */}
      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Performance Dashboard
            </Typography>
            {currentSession && (
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    icon={<TrendingUpIcon />}
                    label={`Transactions: ${currentSession.transactionCount}`}
                    color="primary" 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    icon={<ReceiptIcon />}
                    label={`Sales: $${currentSession.totalSales.toFixed(2)}`}
                    color="success" 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    icon={<ScheduleIcon />}
                    label={`Duration: ${Math.round(currentSession.durationHours || 0)}h`}
                    color="info" 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    icon={<TrendingUpIcon />}
                    label={`Per Hour: ${Math.round(currentSession.performance?.transactionsPerHour || 0)}`}
                    color="warning" 
                    variant="outlined" 
                  />
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⚙️ System Settings
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
                    label={`Sessions: ${stats.sessions || 0}`} 
                    color="info" 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    label={`Receipts: ${stats.receipts || 0}`} 
                    color="warning" 
                    variant="outlined" 
                  />
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      )}

      {/* Operator Login Dialog */}
      <Dialog open={operatorDialogOpen} onClose={() => setOperatorDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>🕐 Operator Login - Start Shift</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Operator ID"
            fullWidth
            variant="outlined"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Operator Name"
            fullWidth
            variant="outlined"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Opening Cash Count:
          </Typography>
          
          <Grid container spacing={2}>
            {['100', '50', '20', '10', '5', '1', '0.50', '0.25', '0.10', '0.05', '0.01'].map(denomination => (
              <Grid item xs={4} sm={3} key={denomination}>
                <TextField
                  label={`$${denomination}`}
                  type="number"
                  value={openingCash[denomination] || 0}
                  onChange={(e) => setOpeningCash(prev => ({
                    ...prev,
                    [denomination]: parseInt(e.target.value) || 0
                  }))}
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Total Opening Cash: ${calculateTotalCash(openingCash).toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOperatorDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleOperatorLogin} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Start Shift'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default POSInterfaceAdvanced;
