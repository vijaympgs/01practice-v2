import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  AccountBalanceWallet as WalletIcon,
  QrCode as QRCodeIcon,
  CheckCircle as CheckIcon,
  Error as AlertIcon,
} from '@mui/icons-material';

import terminalManager from '../../services/TerminalManager.js';
import shiftManager from '../../services/ShiftManager.js';
import sessionManager from '../../services/SessionManager.js';
import productManager from '../../services/ProductManager.js';
import transactionManager from '../../services/TransactionManager.js';

const POSBillingTransactionMode = () => {
  // Theme state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Session and shift state
  const [currentSession, setCurrentSession] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  
  // Transaction state
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Payment state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(0);
  const [change, setChange] = useState(0);
  
  // Receipt state
  const [lastTransaction, setLastTransaction] = useState(null);
  
  // Refs
  const searchInputRef = useRef(null);

  // Load theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const themeResponse = await fetch('/api/theme/active-theme/');
        if (themeResponse.ok) {
          const themeData = await themeResponse.json();
          setThemeColor(themeData.primary_color || '#1976d2');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Initialize POS system
  useEffect(() => {
    const initializePOS = async () => {
      try {
        setLoading(true);
        
        // Initialize managers
        await terminalManager.initialize();
        await shiftManager.initialize();
        await sessionManager.initialize();
        await productManager.initialize();
        await transactionManager.initialize();
        
        // Check for active session
        const session = sessionManager.getCurrentSession();
        const shift = shiftManager.getCurrentShift();
        
        if (!session) {
          setError('No active session. Please start a session first.');
          setSessionReady(false);
          return;
        }
        
        if (!shift) {
          setError('No active shift. Please start a shift first.');
          setSessionReady(false);
          return;
        }
        
        setCurrentSession(session);
        setCurrentShift(shift);
        setSessionReady(true);
        
        // Update session activity
        await sessionManager.updateSessionActivity();
        
      } catch (error) {
        setError('Failed to initialize POS: ' + error.message);
        setSessionReady(false);
      } finally {
        setLoading(false);
      }
    };

    initializePOS();
  }, []);

  // Update totals when cart changes
  useEffect(() => {
    const newSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTax = newSubtotal * 0.10; // 10% tax
    const newTotal = newSubtotal + newTax - discount;
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [cart, discount]);

  // Handle search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const products = await productManager.searchProducts(query);
      setSearchResults(products);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        ...product,
        quantity: 1,
        price: product.sellingPrice || product.price || 0
      }]);
    }
    
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  // Update quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Remove from cart
  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  // Handle payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const transaction = {
        items: cart,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        amountPaid,
        change,
        terminalId: currentSession?.terminalId,
        locationId: currentSession?.locationId,
        sessionId: currentSession?.id,
        shiftId: currentShift?.id,
        operatorId: currentSession?.operatorId,
        operatorName: currentSession?.operatorName
      };
      
      const createdTransaction = await transactionManager.createTransaction(transaction);
      setLastTransaction(createdTransaction);
      
      // Update session
      await sessionManager.updateSession({
        totalSales: (currentSession.totalSales || 0) + total,
        totalTransactions: (currentSession.totalTransactions || 0) + 1
      });
      
      // Clear cart
      handleClearCart();
      
      setPaymentDialogOpen(false);
      setReceiptDialogOpen(true);
      
      setSuccess('Transaction completed successfully!');
      setSnackbar({ open: true, message: 'Transaction completed successfully!', severity: 'success' });
      
    } catch (error) {
      setError('Failed to process payment: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to process payment: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle print receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (!sessionReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">
          {error || 'Please start a session and shift before using POS'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <PageTitle 
              title="POS Billing" 
              subtitle="Point of sale transaction processing"
              showIcon={true}
              icon={<ShoppingCart />}
            />
            <Typography variant="subtitle1">
              {currentSession?.operatorName} - {currentSession?.terminalId}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Chip label={`Session: ${currentSession?.id}`} color="success" sx={{ mr: 1 }} />
            <Chip label={`Shift: ${currentShift?.id}`} color="info" />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel - Product Search */}
        <Box sx={{ width: '400px', p: 2, overflow: 'auto' }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Search
            </Typography>
            <TextField
              fullWidth
              inputRef={searchInputRef}
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            
            {searchResults.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {searchResults.map((product) => (
                  <Card key={product.id} sx={{ mb: 1, cursor: 'pointer' }} onClick={() => handleAddToCart(product)}>
                    <CardContent>
                      <Typography variant="body1">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(product.sellingPrice || product.price || 0)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        {/* Center Panel - Cart */}
        <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Cart ({cart.length} items)
            </Typography>
            
            {cart.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CartIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                  Cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Search and add products to cart
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                              <RemoveIcon />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
                            <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="error" onClick={() => handleRemoveFromCart(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>

        {/* Right Panel - Totals and Payment */}
        <Box sx={{ width: '400px', p: 2 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatCurrency(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>{formatCurrency(tax)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Discount:</Typography>
                <Typography color="error">-{formatCurrency(discount)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">{formatCurrency(total)}</Typography>
              </Box>
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={() => setPaymentDialogOpen(true)}
              disabled={cart.length === 0 || loading}
            >
              Process Payment
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={handleClearCart}
              disabled={cart.length === 0 || loading}
            >
              Clear Cart
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Process Payment
          <IconButton
            onClick={() => setPaymentDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total: {formatCurrency(total)}
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Payment Method"
              >
                <MenuItem value="cash">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MoneyIcon sx={{ mr: 1 }} />
                    Cash
                  </Box>
                </MenuItem>
                <MenuItem value="card">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CardIcon sx={{ mr: 1 }} />
                    Card
                  </Box>
                </MenuItem>
                <MenuItem value="digital">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WalletIcon sx={{ mr: 1 }} />
                    Digital Payment
                  </Box>
                </MenuItem>
                <MenuItem value="qr">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QRCodeIcon sx={{ mr: 1 }} />
                    QR Code
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Amount Paid"
              type="number"
              value={amountPaid}
              onChange={(e) => {
                const paid = parseFloat(e.target.value) || 0;
                setAmountPaid(paid);
                setChange(Math.max(0, paid - total));
              }}
              inputProps={{ min: total, step: 0.01 }}
            />
            
            {change > 0 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Change: {formatCurrency(change)}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            disabled={loading || amountPaid < total}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Transaction Receipt
          <IconButton
            onClick={() => setReceiptDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {lastTransaction && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Receipt #{lastTransaction.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(lastTransaction.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Operator: {lastTransaction.operatorName}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" gutterBottom>
                <strong>Items:</strong>
              </Typography>
              {lastTransaction.items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatCurrency(lastTransaction.subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>{formatCurrency(lastTransaction.tax)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Total:</Typography>
                <Typography variant="h6">{formatCurrency(lastTransaction.total)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Payment Method:</Typography>
                <Typography>{lastTransaction.paymentMethod}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Amount Paid:</Typography>
                <Typography>{formatCurrency(lastTransaction.amountPaid)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptDialogOpen(false)}>Close</Button>
          <Button
            onClick={handlePrintReceipt}
            variant="contained"
            startIcon={<PrintIcon />}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default POSBillingTransactionMode;
