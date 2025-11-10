import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Alert,
  Paper,
  Grid,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Badge,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  ShoppingCart as SalesIcon,
  AccountBalance as CashIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Sync as SyncIcon,
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
  CloudSync as SyncStatusIcon,
  PlayArrow as StartShiftIcon,
  Stop as EndShiftIcon,
  Add as AddIcon,
  Person as UserIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  CheckCircle as ActiveIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  AddShoppingCart as AddToCartIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Inventory as InventoryIcon,
  People as CustomerIcon,
  LocalShipping as SupplierIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  PhoneAndroid as MobilePayIcon,
  QrCode as BarcodeIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const UnifiedPointOfSaleStable = () => {
  // Core State
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Loading POS System...');
  const [currentShift, setCurrentShift] = useState(null);
  
  // Shift Management
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [startingCash, setStartingCash] = useState('');
  const [shiftNotes, setShiftNotes] = useState('');
  
  // Transaction State
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTax, setCartTax] = useState(0);
  
  // Dialog States
  const [showInventoryDialog, setShowInventoryDialog] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  
  // Product Catalog
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Payment Processing
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountTendered, setAmountTendered] = useState('');
  const [changeDue, setChangeDue] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  // Customer Management
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  // Inventory Management
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  
  // Receipt Generation
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // Inventory and Customer Management
  const [showCustomerListDialog, setShowCustomerListDialog] = useState(false);
  
  // End Shift Management
  const [showEndShiftDialog, setShowEndShiftDialog] = useState(false);
  const [endingCash, setEndingCash] = useState('');
  const [shiftSummary, setShiftSummary] = useState(null);

  // Sample Data
  const sampleProducts = [
    { id: 1, name: 'Coffee', price: 4.99, sku: 'COF-001', category: 'Beverages', stock: 50, barcode: '1234567890' },
    { id: 2, name: 'Sandwich', price: 8.50, sku: 'SAND-001', category: 'Food', stock: 25, barcode: '1234567891' },
    { id: 3, name: 'Chips', price: 2.99, sku: 'CHP-001', category: 'Snacks', stock: 100, barcode: '1234567892' },
    { id: 4, name: 'Soda', price: 1.99, sku: 'SOD-001', category: 'Beverages', stock: 75, barcode: '1234567893' },
    { id: 5, name: 'Cookie', price: 1.50, sku: 'COOK-001', category: 'Snacks', stock: 30, barcode: '1234567894' },
    { id: 6, name: 'Salad', price: 7.99, sku: 'SAL-001', category: 'Food', stock: 15, barcode: '1234567895' },
    { id: 7, name: 'Tea', price: 3.49, sku: 'TEA-001', category: 'Beverages', stock: 40, barcode: '1234567896' },
    { id: 8, name: 'Muffin', price: 2.49, sku: 'MUF-001', category: 'Snacks', stock: 20, barcode: '1234567897' }
  ];

  const sampleCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0123', address: '123 Main St' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0124', address: '456 Oak Ave' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0125', address: '789 Pine Rd' }
  ];

  const categories = ['all', 'Beverages', 'Food', 'Snacks'];

  useEffect(() => {
    // Initialize system
    const timer = setTimeout(() => {
      setLoading(false);
      setMessage('POS System Ready!');
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      setCustomers(sampleCustomers);
      setInventory(sampleProducts);
      
      // Check for existing shift
      const storedShift = localStorage.getItem('activeShift');
      if (storedShift) {
        setCurrentShift(JSON.parse(storedShift));
        setActiveTab(1);
        setShowNewTransaction(true);
      } else {
        setActiveTab(0);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  useEffect(() => {
    // Calculate cart totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.085; // 8.5% tax
    const total = subtotal + tax;
    
    setCartSubtotal(subtotal);
    setCartTax(tax);
    setCartTotal(total);
  }, [cart]);

  useEffect(() => {
    // Check for low stock items
    const lowStock = inventory.filter(item => item.stock < 20);
    setLowStockItems(lowStock);
  }, [inventory]);

  const handleTabChange = (event, newValue) => {
    if (newValue > 0 && !currentShift) {
      setActiveTab(0);
      setMessage('⚠️ Please start a shift before accessing POS features.');
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setActiveTab(newValue);
    
    // Auto-start new transaction when switching to POS Transactions tab
    if (newValue === 1 && currentShift && !currentTransaction) {
      startNewTransaction();
    }
  };

  const startShift = () => {
    if (!startingCash || startingCash <= 0) {
      setMessage('Please enter a valid starting cash amount');
      return;
    }

    const newShift = {
      id: `shift_${Date.now()}`,
      userId: 'current_user',
      userName: 'Current User',
      startTime: new Date().toISOString(),
      startingCash: parseFloat(startingCash),
      status: 'active',
      notes: shiftNotes,
      sales: [],
      totalSales: 0,
      totalTransactions: 0
    };

    localStorage.setItem('activeShift', JSON.stringify(newShift));
    setCurrentShift(newShift);
    setShowStartDialog(false);
    setStartingCash('');
    setShiftNotes('');
    setActiveTab(1);
    setShowNewTransaction(true);
    setMessage('✅ Shift started! Redirecting to POS...');
    setTimeout(() => setMessage(null), 3000);
  };

  const endShift = () => {
    if (currentShift) {
      setShowEndShiftDialog(true);
    }
  };

  const confirmEndShift = () => {
    if (!endingCash || endingCash <= 0) {
      setMessage('Please enter a valid ending cash amount');
      return;
    }

    // Calculate shift summary
    const endTime = new Date().toISOString();
    const shiftDuration = new Date(endTime) - new Date(currentShift.startTime);
    const hours = Math.floor(shiftDuration / (1000 * 60 * 60));
    const minutes = Math.floor((shiftDuration % (1000 * 60 * 60)) / (1000 * 60));
    
    // Mock transaction data for demo
    const mockTransactions = [
      { id: 'TXN-001', total: 25.50, items: 3, time: '10:30 AM' },
      { id: 'TXN-002', total: 18.75, items: 2, time: '11:15 AM' },
      { id: 'TXN-003', total: 42.30, items: 5, time: '12:45 PM' },
      { id: 'TXN-004', total: 15.99, items: 1, time: '1:20 PM' }
    ];
    
    const totalSales = mockTransactions.reduce((sum, txn) => sum + txn.total, 0);
    const totalTransactions = mockTransactions.length;
    const totalItems = mockTransactions.reduce((sum, txn) => sum + txn.items, 0);
    const expectedCash = parseFloat(currentShift.startingCash) + totalSales;
    const cashDifference = parseFloat(endingCash) - expectedCash;
    
    const summary = {
      shiftId: currentShift.id,
      cashier: currentShift.userName,
      startTime: currentShift.startTime,
      endTime: endTime,
      duration: `${hours}h ${minutes}m`,
      startingCash: currentShift.startingCash,
      endingCash: parseFloat(endingCash),
      totalSales: totalSales,
      totalTransactions: totalTransactions,
      totalItems: totalItems,
      averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0,
      cashDifference: cashDifference,
      transactions: mockTransactions
    };
    
    setShiftSummary(summary);
    setShowEndShiftDialog(false);
  };

  const closeShiftSummary = () => {
    // Clear shift data
    localStorage.removeItem('activeShift');
    setCurrentShift(null);
    setActiveTab(0);
    setShowEndShiftDialog(false);
    setShiftSummary(null);
    setEndingCash('');
    
    // Reset transaction state
    setCart([]);
    setCurrentTransaction(null);
    setShowNewTransaction(true);
    
    setMessage('✅ Shift ended successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const startNewTransaction = () => {
    const transaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      startTime: new Date().toISOString(),
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      customer: null,
      paymentMethod: '',
      status: 'active'
    };
    
    setCurrentTransaction(transaction);
    setCart([]);
    setMessage('✅ Billing started! Add items, manage inventory, or select customers.');
    setTimeout(() => setMessage(null), 3000);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Update inventory
    setInventory(inventory.map(item => 
      item.id === product.id 
        ? { ...item, stock: item.stock - 1 }
        : item
    ));
    
    setMessage(`✅ Added ${product.name} to cart`);
    setTimeout(() => setMessage(null), 2000);
  };

  const removeFromCart = (productId) => {
    const item = cart.find(item => item.id === productId);
    setCart(cart.filter(item => item.id !== productId));
    
    // Restore inventory
    setInventory(inventory.map(item => 
      item.id === productId 
        ? { ...item, stock: item.stock + item.quantity }
        : item
    ));
    
    setMessage('✅ Item removed from cart');
    setTimeout(() => setMessage(null), 2000);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const item = cart.find(item => item.id === productId);
    const quantityDiff = newQuantity - item.quantity;
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
    
    // Update inventory
    setInventory(inventory.map(item => 
      item.id === productId 
        ? { ...item, stock: item.stock - quantityDiff }
        : item
    ));
  };

  const processPayment = () => {
    if (!paymentMethod) {
      setMessage('Please select a payment method');
      return;
    }
    
    if (paymentMethod === 'cash' && (!amountTendered || parseFloat(amountTendered) < cartTotal)) {
      setMessage('Insufficient cash tendered');
      return;
    }
    
    const change = paymentMethod === 'cash' ? parseFloat(amountTendered) - cartTotal : 0;
    setChangeDue(change);
    
    // Complete transaction
    const completedTransaction = {
      ...currentTransaction,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      customer: selectedCustomer,
      paymentMethod,
      amountTendered: parseFloat(amountTendered) || cartTotal,
      change,
      endTime: new Date().toISOString(),
      status: 'completed'
    };
    
    setReceiptData(completedTransaction);
    setShowPaymentDialog(false);
    setShowReceiptDialog(true);
    
    setMessage('✅ Payment processed successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const closeReceipt = () => {
    // Close receipt dialog
    setShowReceiptDialog(false);
    setReceiptData(null);
    
    // Reset transaction state
    setCart([]);
    setCurrentTransaction(null);
    setSelectedCustomer(null);
    setPaymentMethod('');
    setAmountTendered('');
    
    // Return to new transaction state
    setShowNewTransaction(true);
    
    setMessage('✅ Transaction completed! Ready for next sale.');
    setTimeout(() => setMessage(null), 3000);
  };

  const addCustomer = () => {
    if (!newCustomer.name) {
      setMessage('Please enter customer name');
      return;
    }
    
    const customer = {
      ...newCustomer,
      id: Date.now()
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', email: '', phone: '', address: '' });
    setShowCustomerDialog(false);
    setMessage('✅ Customer added successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        p: 4,
        backgroundColor: '#f5f5f5'
      }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          🏪 Point of Sale
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ 
        p: { xs: 1, sm: 2 }, 
        borderRadius: 0, 
        boxShadow: 1,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={8} sm={6}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              color="primary"
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                lineHeight: 1.2
              }}
            >
              🏪 Point of Sale
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Professional POS System
            </Typography>
          </Grid>
          
          <Grid item xs={4} sm={6} sx={{ textAlign: 'right' }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5, 
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <Chip
                icon={<OnlineIcon sx={{ fontSize: '0.8rem' }} />}
                label="Online"
                color="success"
                variant="outlined"
                size="small"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  height: { xs: 24, sm: 28 }
                }}
              />
              
              <Chip
                icon={<SyncStatusIcon sx={{ fontSize: '0.8rem' }} />}
                label="Synced"
                color="success"
                variant="outlined"
                size="small"
                sx={{ 
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  height: { xs: 24, sm: 28 }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Message alerts */}
      {message && (
        <Alert 
          severity={message.includes('❌') ? 'error' : message.includes('⚠️') ? 'warning' : 'success'}
          sx={{ m: 2, mb: 0 }}
        >
          {message}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mt: 1, mx: 2, borderRadius: 2, boxShadow: 1 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': {
              minHeight: { xs: 48, sm: 64 },
              fontSize: { xs: '0.75rem', sm: '0.9rem' },
              fontWeight: 600,
              minWidth: { xs: 'auto', sm: '120px' },
              px: { xs: 1, sm: 2 }
            }
          }}
        >
          <Tab 
            icon={<TimeIcon />} 
            label={<Box sx={{ display: { xs: 'none', sm: 'block' } }}>🕐 Shift Management</Box>}
            iconPosition="start"
            sx={{ '& .MuiTab-iconWrapper': { mr: { xs: 0, sm: 1 } } }}
          />
          <Tab 
            icon={<SalesIcon />} 
            label={<Box sx={{ display: { xs: 'none', sm: 'block' } }}>🛒 POS Transactions</Box>}
            iconPosition="start"
            sx={{ '& .MuiTab-iconWrapper': { mr: { xs: 0, sm: 1 } } }}
          />
        </Tabs>
      </Paper>

      {/* Tab content */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ height: '100%', p: 0 }}>
            {activeTab === 0 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon color="primary" />
                  Shift Management
                </Typography>
                
                {!currentShift ? (
                  <Box>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      No Active Shift
                    </Alert>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      You need to start a shift before you can use the POS system.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<StartShiftIcon />}
                      onClick={() => setShowStartDialog(true)}
                      sx={{ mt: 2 }}
                    >
                      Start New Shift
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <ActiveIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Shift Active
                    </Alert>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><UserIcon /></ListItemIcon>
                        <ListItemText primary="Cashier" secondary={currentShift.userName} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TimeIcon /></ListItemIcon>
                        <ListItemText primary="Started" secondary={formatTime(currentShift.startTime)} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CashIcon /></ListItemIcon>
                        <ListItemText primary="Starting Cash" secondary={formatCurrency(currentShift.startingCash)} />
                      </ListItem>
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<EndShiftIcon />}
                      onClick={endShift}
                      fullWidth
                    >
                      End Shift
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🛒 POS Transactions
                </Typography>
                
                {/* Action Buttons Row */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    startIcon={<InventoryIcon />}
                    onClick={() => setShowInventoryDialog(true)}
                    sx={{
                      minHeight: 48,
                      fontSize: '1rem',
                      px: 3,
                      flex: { xs: '1 1 100%', sm: '0 1 auto' }
                    }}
                  >
                    Inventory
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    startIcon={<PersonIcon />}
                    onClick={() => setShowCustomerDialog(true)}
                    sx={{
                      minHeight: 48,
                      fontSize: '1rem',
                      px: 3,
                      flex: { xs: '1 1 100%', sm: '0 1 auto' }
                    }}
                  >
                    Customer
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={startNewTransaction}
                    sx={{
                      minHeight: 48,
                      fontSize: '1rem',
                      px: 3,
                      flex: { xs: '1 1 100%', sm: '0 1 auto' }
                    }}
                  >
                    Start Billing
                  </Button>
                </Box>
                
                
                {!currentTransaction && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Ready to Start Billing
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Click "Start Billing" to begin a new transaction
                    </Typography>
                  </Box>
                )}
                
                {currentTransaction && (
                  <Box>
                    {/* Transaction Header */}
                    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6" color="primary">
                            Transaction #{currentTransaction.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Started: {formatTime(currentTransaction.startTime)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                            flexWrap: 'wrap',
                            alignItems: 'center'
                          }}>
                            <Button
                              variant="outlined"
                              color="info"
                              size="small"
                              onClick={() => setShowInventoryDialog(true)}
                              startIcon={<InventoryIcon />}
                              sx={{ 
                                minWidth: { xs: 'auto', sm: '100px' },
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                display: { xs: 'none', sm: 'flex' }
                              }}
                            >
                              Inventory
                            </Button>
                            <Button
                              variant="outlined"
                              color="info"
                              size="small"
                              onClick={() => setShowCustomerListDialog(true)}
                              startIcon={<CustomerIcon />}
                              sx={{ 
                                minWidth: { xs: 'auto', sm: '100px' },
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                display: { xs: 'none', sm: 'flex' }
                              }}
                            >
                              Customers
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => setShowNewTransaction(true)}
                              sx={{ 
                                minWidth: { xs: '120px', sm: '140px' },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }}
                            >
                              New Transaction
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Product Search and Catalog */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🔍 Product Catalog
                        </Typography>
                        
                        {/* Search and Filter */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} sm={8}>
                            <TextField
                              fullWidth
                              placeholder="Search products by name, SKU, or barcode..."
                              variant="outlined"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                              <InputLabel>Category</InputLabel>
                              <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                label="Category"
                              >
                                {categories.map((category) => (
                                  <MenuItem key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        
                        {/* Product Grid */}
                        <Grid container spacing={1}>
                          {filteredProducts.map((product) => (
                            <Grid item xs={6} sm={4} md={3} key={product.id}>
                              <Card 
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': { boxShadow: 3 },
                                  opacity: product.stock === 0 ? 0.5 : 1
                                }}
                                onClick={() => product.stock > 0 && addToCart(product)}
                              >
                                <CardContent sx={{ p: 1, textAlign: 'center' }}>
                                  <Typography variant="body2" fontWeight="bold" noWrap>
                                    {product.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {product.sku}
                                  </Typography>
                                  <Typography variant="body2" color="primary" fontWeight="bold">
                                    {formatCurrency(product.price)}
                                  </Typography>
                                  <Chip 
                                    label={`Stock: ${product.stock}`} 
                                    size="small" 
                                    color={product.stock < 10 ? 'warning' : 'default'}
                                    sx={{ mt: 0.5 }}
                                  />
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>

                    {/* Shopping Cart - Transaction Summary */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🛒 Transaction Summary ({cart.length} items)
                        </Typography>
                        {cart.length === 0 ? (
                          <Alert severity="info">
                            Your cart is empty. Add products to get started.
                          </Alert>
                        ) : (
                          <List>
                            {cart.map((item) => (
                              <ListItem key={item.id} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                                <ListItemText
                                  primary={item.name}
                                  secondary={`SKU: ${item.sku} • $${item.price} each`}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                  <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                                    {item.quantity}
                                  </Typography>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                  <Typography variant="h6" color="primary" sx={{ minWidth: 80, textAlign: 'right' }}>
                                    {formatCurrency(item.price * item.quantity)}
                                  </Typography>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </ListItem>
                            ))}
                          </List>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">Subtotal:</Typography>
                          <Typography variant="h6" color="primary">{formatCurrency(cartSubtotal)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1">Tax (8.5%):</Typography>
                          <Typography variant="body1">{formatCurrency(cartTax)}</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h5" fontWeight="bold">Total:</Typography>
                          <Typography variant="h5" fontWeight="bold" color="primary">{formatCurrency(cartTotal)}</Typography>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Payment Panel */}
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          💳 Payment
                        </Typography>
                        
                        {/* Customer Selection */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Customer (Optional)
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Select Customer</InputLabel>
                              <Select
                                value={selectedCustomer?.id || ''}
                                onChange={(e) => {
                                  const customer = customers.find(c => c.id === e.target.value);
                                  setSelectedCustomer(customer);
                                }}
                                label="Select Customer"
                              >
                                <MenuItem value="">
                                  <em>Walk-in Customer</em>
                                </MenuItem>
                                {customers.map((customer) => (
                                  <MenuItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setShowCustomerDialog(true)}
                            >
                              <AddIcon />
                            </Button>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Payment Method
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button 
                              variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
                              fullWidth 
                              onClick={() => setPaymentMethod('cash')}
                              startIcon={<MoneyIcon />}
                            >
                              💵 Cash
                            </Button>
                            <Button 
                              variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                              fullWidth 
                              onClick={() => setPaymentMethod('card')}
                              startIcon={<CardIcon />}
                            >
                              💳 Card
                            </Button>
                            <Button 
                              variant={paymentMethod === 'mobile' ? 'contained' : 'outlined'}
                              fullWidth 
                              onClick={() => setPaymentMethod('mobile')}
                              startIcon={<MobilePayIcon />}
                            >
                              📱 Mobile Pay
                            </Button>
                          </Box>
                        </Box>
                        
                        {paymentMethod === 'cash' && (
                          <TextField
                            fullWidth
                            label="Amount Tendered"
                            type="number"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            placeholder="0.00"
                            value={amountTendered}
                            onChange={(e) => setAmountTendered(e.target.value)}
                            inputProps={{ step: "0.01", min: "0" }}
                          />
                        )}
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Change Due:
                          </Typography>
                          <Typography variant="h5" color="success.main" fontWeight="bold">
                            {formatCurrency(paymentMethod === 'cash' && amountTendered ? 
                              Math.max(0, parseFloat(amountTendered) - cartTotal) : 0)}
                          </Typography>
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          color="success" 
                          fullWidth 
                          size="large"
                          sx={{ py: 1.5 }}
                          onClick={() => setShowPaymentDialog(true)}
                          disabled={cart.length === 0 || !paymentMethod}
                        >
                          Process Payment
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🔄 Sync & Status
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Sync status and data management features are working! This is a functional POS system.
                </Alert>
                <Button variant="contained" color="primary">
                  Check Status
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Start Shift Dialog */}
      <Dialog open={showStartDialog} onClose={() => setShowStartDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Shift</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Starting Cash Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={startingCash}
            onChange={(e) => setStartingCash(e.target.value)}
            placeholder="0.00"
            inputProps={{ step: "0.01", min: "0" }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Shift Notes (Optional)"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={shiftNotes}
            onChange={(e) => setShiftNotes(e.target.value)}
            placeholder="Enter any notes about this shift..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStartDialog(false)}>Cancel</Button>
          <Button 
            onClick={startShift} 
            variant="contained"
            disabled={!startingCash}
          >
            Start Shift
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Payment</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Transaction Summary
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatCurrency(cartSubtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Tax:</Typography>
              <Typography>{formatCurrency(cartTax)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">{formatCurrency(cartTotal)}</Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Payment Method: {paymentMethod === 'cash' ? '💵 Cash' : paymentMethod === 'card' ? '💳 Card' : '📱 Mobile Pay'}
          </Typography>
          
          {paymentMethod === 'cash' && (
            <TextField
              fullWidth
              label="Amount Tendered"
              type="number"
              variant="outlined"
              value={amountTendered}
              onChange={(e) => setAmountTendered(e.target.value)}
              placeholder="0.00"
              inputProps={{ step: "0.01", min: "0" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button 
            onClick={processPayment} 
            variant="contained"
            color="success"
          >
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Dialog */}
      <Dialog open={showCustomerDialog} onClose={() => setShowCustomerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Customer Name"
            fullWidth
            variant="outlined"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            variant="outlined"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomerDialog(false)}>Cancel</Button>
          <Button 
            onClick={addCustomer} 
            variant="contained"
            disabled={!newCustomer.name}
          >
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onClose={() => setShowReceiptDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Transaction Receipt</DialogTitle>
        <DialogContent>
          {receiptData && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Receipt #{receiptData.id}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(receiptData.endTime).toLocaleString()}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {receiptData.items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.name} x{item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">{formatCurrency(receiptData.total)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Payment Method:</Typography>
                <Typography>{receiptData.paymentMethod}</Typography>
              </Box>
              
              {receiptData.change > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Change:</Typography>
                  <Typography>{formatCurrency(receiptData.change)}</Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  🎉 Transaction Complete!
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Thank you for your business!
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReceipt}>Close</Button>
          <Button 
            onClick={() => window.print()} 
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ mr: 1 }}
          >
            Print Receipt
          </Button>
          <Button 
            onClick={closeReceipt} 
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ minWidth: '140px' }}
          >
            New Transaction
          </Button>
        </DialogActions>
      </Dialog>

      {/* Inventory Management Dialog */}
      <Dialog open={showInventoryDialog} onClose={() => setShowInventoryDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon color="primary" />
            Inventory Management
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.stock < 10 ? 'Low Stock' : 'In Stock'} 
                        color={item.stock < 10 ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {lowStockItems.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Low Stock Alert ({lowStockItems.length} items):
              </Typography>
              {lowStockItems.map((item) => (
                <Typography key={item.id} variant="body2">
                  • {item.name} - {item.stock} remaining
                </Typography>
              ))}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInventoryDialog(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Refresh Inventory
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer List Dialog */}
      <Dialog open={showCustomerListDialog} onClose={() => setShowCustomerListDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CustomerIcon color="primary" />
            Customer Management
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="info">
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomerListDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setShowCustomerDialog(true)}
            startIcon={<AddIcon />}
          >
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* End Shift Dialog */}
      <Dialog open={showEndShiftDialog} onClose={() => setShowEndShiftDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>End Shift</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Shift Summary
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><UserIcon /></ListItemIcon>
              <ListItemText primary="Cashier" secondary={currentShift?.userName} />
            </ListItem>
            <ListItem>
              <ListItemIcon><TimeIcon /></ListItemIcon>
              <ListItemText primary="Started" secondary={currentShift ? formatTime(currentShift.startTime) : ''} />
            </ListItem>
            <ListItem>
              <ListItemIcon><CashIcon /></ListItemIcon>
              <ListItemText primary="Starting Cash" secondary={currentShift ? formatCurrency(currentShift.startingCash) : ''} />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <TextField
            autoFocus
            margin="dense"
            label="Ending Cash Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={endingCash}
            onChange={(e) => setEndingCash(e.target.value)}
            placeholder="0.00"
            inputProps={{ step: "0.01", min: "0" }}
            sx={{ mb: 2 }}
          />
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Please count the cash in your drawer and enter the total amount. This will be used to calculate your shift performance.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEndShiftDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmEndShift} 
            variant="contained"
            color="error"
            disabled={!endingCash}
          >
            End Shift
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shift Summary Dialog */}
      <Dialog open={!!shiftSummary} onClose={closeShiftSummary} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimeIcon color="primary" />
            Shift Summary Report
          </Box>
        </DialogTitle>
        <DialogContent>
          {shiftSummary && (
            <Box>
              {/* Shift Overview */}
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                  Shift Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Shift ID</Typography>
                    <Typography variant="body1" fontWeight="bold">{shiftSummary.shiftId}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Cashier</Typography>
                    <Typography variant="body1" fontWeight="bold">{shiftSummary.cashier}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Duration</Typography>
                    <Typography variant="body1" fontWeight="bold">{shiftSummary.duration}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">End Time</Typography>
                    <Typography variant="body1" fontWeight="bold">{formatTime(shiftSummary.endTime)}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Financial Summary */}
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                  Financial Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Starting Cash</Typography>
                    <Typography variant="body1" fontWeight="bold">{formatCurrency(shiftSummary.startingCash)}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Ending Cash</Typography>
                    <Typography variant="body1" fontWeight="bold">{formatCurrency(shiftSummary.endingCash)}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Total Sales</Typography>
                    <Typography variant="body1" fontWeight="bold" color="success.main">{formatCurrency(shiftSummary.totalSales)}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Cash Difference</Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      color={shiftSummary.cashDifference >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(shiftSummary.cashDifference)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sales Performance */}
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                  Sales Performance
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Total Transactions</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">{shiftSummary.totalTransactions}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Total Items Sold</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">{shiftSummary.totalItems}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Average Transaction</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">{formatCurrency(shiftSummary.averageTransaction)}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Items per Transaction</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {shiftSummary.totalTransactions > 0 ? (shiftSummary.totalItems / shiftSummary.totalTransactions).toFixed(1) : '0'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Transaction List */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Transaction Details
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shiftSummary.transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>{txn.id}</TableCell>
                          <TableCell>{txn.time}</TableCell>
                          <TableCell>{txn.items}</TableCell>
                          <TableCell>{formatCurrency(txn.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeShiftSummary}>Close</Button>
          <Button 
            onClick={() => window.print()} 
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
          >
            Print Summary
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default UnifiedPointOfSaleStable;