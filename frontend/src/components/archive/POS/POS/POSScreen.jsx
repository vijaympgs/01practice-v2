import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Delete,
  Search,
  Person,
  Payment,
  Print,
  Save,
  PlayArrow,
  Pause,
  Stop,
  Receipt,
  LocalGroceryStore,
  AttachMoney,
  CreditCard,
  AccountBalanceWallet,
  QrCodeScanner,
  TrendingUp,
  Settings,
  Help,
  Notifications,
  AccountBalance,
  AssignmentReturn,
  LocalOffer,
  Assessment,
  Assignment,
  CardGiftcard,
  Schedule
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PaymentProcessor from './PaymentProcessor';
import CashDrawer from './CashDrawer';
import ReceiptGenerator from './ReceiptGenerator';
import CustomerManager from './CustomerManager';
import RefundProcessor from './RefundProcessor';
import BillManager from './BillManager';
import LoyaltyProgram from './LoyaltyProgram';
import ReportingDashboard from './ReportingDashboard';
import InventoryIntegration from './InventoryIntegration';
import SalesOrderManager from './SalesOrderManager';
import GiftVoucherManager from './GiftVoucherManager';
import LayawayManager from './LayawayManager';

const POSScreen = () => {
  const navigate = useNavigate();
  
  // State management
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [customerDialog, setCustomerDialog] = useState(false);
  const [productSearchDialog, setProductSearchDialog] = useState(false);
  const [cashDrawerDialog, setCashDrawerDialog] = useState(false);
  const [receiptDialog, setReceiptDialog] = useState(false);
  const [customerManagerDialog, setCustomerManagerDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [billManagerDialog, setBillManagerDialog] = useState(false);
  const [loyaltyDialog, setLoyaltyDialog] = useState(false);
  const [reportingDialog, setReportingDialog] = useState(false);
  const [inventoryDialog, setInventoryDialog] = useState(false);
  const [salesOrderDialog, setSalesOrderDialog] = useState(false);
  const [giftVoucherDialog, setGiftVoucherDialog] = useState(false);
  const [layawayDialog, setLayawayDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [session, setSession] = useState({
    id: 'SES001',
    user: { name: 'John Smith', role: 'Cashier' },
    startTime: new Date(),
    transactions: 0,
    totalSales: 0
  });

  // Mock data
  const mockProducts = [
    { id: 'P001', name: 'Premium Widget A', price: 150.00, stock: 100, category: 'Electronics', barcode: '1234567890' },
    { id: 'P002', name: 'Standard Component B', price: 75.00, stock: 50, category: 'Components', barcode: '1234567891' },
    { id: 'P003', name: 'Advanced Module C', price: 250.00, stock: 25, category: 'Electronics', barcode: '1234567892' },
    { id: 'P004', name: 'Testing Equipment D', price: 500.00, stock: 10, category: 'Equipment', barcode: '1234567893' },
    { id: 'P005', name: 'Quality Tool E', price: 125.00, stock: 75, category: 'Tools', barcode: '1234567894' }
  ];

  const mockCustomers = [
    { id: 'C001', name: 'ABC Corporation', phone: '+91-9876543210', email: 'contact@abc.com', type: 'Corporate' },
    { id: 'C002', name: 'John Doe', phone: '+91-9876543211', email: 'john@email.com', type: 'Individual' },
    { id: 'C003', name: 'XYZ Industries', phone: '+91-9876543212', email: 'info@xyz.com', type: 'Corporate' }
  ];

  // Cart calculations
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartTax = cartTotal * 0.18; // 18% tax
  const cartGrandTotal = cartTotal + cartTax;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Add product to cart
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setSnackbar({
      open: true,
      message: `${product.name} added to cart`,
      severity: 'success'
    });
  }, []);

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Handle barcode scan
  const handleBarcodeScan = (barcode) => {
    const product = mockProducts.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
    } else {
      setSnackbar({
        open: true,
        message: 'Product not found',
        severity: 'error'
      });
    }
  };

  // Handle payment
  const handlePayment = () => {
    if (cart.length === 0) {
      setSnackbar({
        open: true,
        message: 'Cart is empty',
        severity: 'warning'
      });
      return;
    }
    setPaymentDialog(true);
  };

  // Complete sale
  const completeSale = (paymentResult) => {
    const sale = {
      id: `SALE${Date.now()}`,
      items: cart,
      customer: selectedCustomer,
      total: cartTotal,
      tax: cartTax,
      grandTotal: cartGrandTotal,
      payment: paymentResult,
      timestamp: new Date(),
      cashier: session.user.name
    };

    // Process sale (would normally save to database)
    console.log('Sale completed:', sale);
    
    setSnackbar({
      open: true,
      message: `Sale completed successfully. Total: ₹${cartGrandTotal.toLocaleString()}`,
      severity: 'success'
    });

    // Clear cart and close dialogs
    setCart([]);
    setSelectedCustomer(null);
    setPaymentDialog(false);
    
    // Update session
    setSession(prev => ({
      ...prev,
      transactions: prev.transactions + 1,
      totalSales: prev.totalSales + cartGrandTotal
    }));

    // Open receipt dialog
    setReceiptDialog(sale);
  };

  // Hold sale
  const holdSale = () => {
    if (cart.length === 0) {
      setSnackbar({
        open: true,
        message: 'Cart is empty',
        severity: 'warning'
      });
      return;
    }
    
    const heldSale = {
      id: `HELD${Date.now()}`,
      items: cart,
      customer: selectedCustomer,
      total: cartTotal,
      tax: cartTax,
      grandTotal: cartGrandTotal,
      holdTime: new Date().toISOString(),
      cashier: session.user.name,
      status: 'held',
      expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
    };

    // Save to held sales (would normally save to database)
    console.log('Sale held:', heldSale);
    
    setSnackbar({
      open: true,
      message: `Sale held successfully. Total: ₹${cartGrandTotal.toLocaleString()}`,
      severity: 'info'
    });

    // Clear cart
    setCart([]);
    setSelectedCustomer(null);
  };

  // Resume bill
  const resumeBill = (bill) => {
    setCart(bill.items);
    setSelectedCustomer(bill.customer);
    setSnackbar({
      open: true,
      message: `Bill ${bill.id} resumed successfully`,
      severity: 'success'
    });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LocalGroceryStore />
            </Avatar>
            <Box>
              <Typography variant="h6">Point of Sale</Typography>
              <Typography variant="body2" color="text.secondary">
                {session.user.name} | Session: {session.id}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`Sales: ${session.transactions}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Total: ₹${session.totalSales.toLocaleString()}`}
              color="success"
              variant="outlined"
            />
            <Tooltip title="Refund Processing">
              <IconButton onClick={() => setRefundDialog(true)}>
                <AssignmentReturn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bill Management">
              <IconButton onClick={() => setBillManagerDialog(true)}>
                <Receipt />
              </IconButton>
            </Tooltip>
            <Tooltip title="Loyalty Program">
              <IconButton onClick={() => setLoyaltyDialog(true)} disabled={!selectedCustomer}>
                <LocalOffer />
              </IconButton>
            </Tooltip>
            <Tooltip title="Inventory">
              <IconButton onClick={() => setInventoryDialog(true)}>
                <Inventory />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sales Orders">
              <IconButton onClick={() => setSalesOrderDialog(true)}>
                <Assignment />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gift Vouchers">
              <IconButton onClick={() => setGiftVoucherDialog(true)}>
                <CardGiftcard />
              </IconButton>
            </Tooltip>
            <Tooltip title="Layaway">
              <IconButton onClick={() => setLayawayDialog(true)}>
                <Schedule />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reports">
              <IconButton onClick={() => setReportingDialog(true)}>
                <Assessment />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cash Drawer">
              <IconButton onClick={() => setCashDrawerDialog(true)}>
                <AccountBalance />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel - Product Search */}
        <Paper sx={{ width: 350, m: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Product Search
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search products or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<QrCodeScanner />}
              onClick={() => handleBarcodeScan('1234567890')} // Simulate scan
            >
              Scan
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Person />}
              onClick={() => setCustomerManagerDialog(true)}
            >
              Customer
            </Button>
          </Box>

          {/* Product List */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {mockProducts
              .filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.barcode.includes(searchTerm)
              )
              .map(product => (
                <Card key={product.id} sx={{ mb: 1, cursor: 'pointer' }} onClick={() => addToCart(product)}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.category} | Stock: {product.stock}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight="medium" color="primary">
                          ₹{product.price.toLocaleString()}
                        </Typography>
                        <IconButton size="small" color="primary">
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Paper>

        {/* Right Panel - Cart */}
        <Paper sx={{ flex: 1, m: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Shopping Cart ({cartItemCount} items)
            </Typography>
            {selectedCustomer && (
              <Chip
                label={`Customer: ${selectedCustomer.name}`}
                color="primary"
                onDelete={() => setSelectedCustomer(null)}
              />
            )}
          </Box>

          {/* Cart Items */}
          <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
            {cart.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add products to get started
                </Typography>
              </Box>
            ) : (
              <List>
                {cart.map(item => (
                  <ListItem key={item.id} divider>
                    <ListItemText
                      primary={item.name}
                      secondary={`₹${item.price.toLocaleString()} each`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Remove />
                      </IconButton>
                      <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Add />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <ListItemSecondaryAction>
                      <Typography variant="body2" fontWeight="medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">₹{cartTotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax (18%):</Typography>
                <Typography variant="body2">₹{cartTax.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ₹{cartGrandTotal.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={holdSale}
              disabled={cart.length === 0}
              sx={{ flex: 1 }}
            >
              Hold Sale
            </Button>
            <Button
              variant="contained"
              startIcon={<Payment />}
              onClick={handlePayment}
              disabled={cart.length === 0}
              sx={{ flex: 1 }}
            >
              Process Payment
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* New Payment Processor */}
      <PaymentProcessor
        open={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        cartTotal={cartTotal}
        cartTax={cartTax}
        grandTotal={cartGrandTotal}
        onPaymentComplete={completeSale}
      />

      {/* Cash Drawer */}
      <CashDrawer
        open={cashDrawerDialog}
        onClose={() => setCashDrawerDialog(false)}
        session={session}
      />

      {/* Receipt Generator */}
      <ReceiptGenerator
        open={!!receiptDialog}
        onClose={() => setReceiptDialog(false)}
        saleData={receiptDialog}
        session={session}
      />

      {/* Customer Manager */}
      <CustomerManager
        open={customerManagerDialog}
        onClose={() => setCustomerManagerDialog(false)}
        onCustomerSelect={(customer) => {
          setSelectedCustomer(customer);
          setCustomerManagerDialog(false);
        }}
        selectedCustomer={selectedCustomer}
      />

      {/* Refund Processor */}
      <RefundProcessor
        open={refundDialog}
        onClose={() => setRefundDialog(false)}
        session={session}
      />

      {/* Bill Manager */}
      <BillManager
        open={billManagerDialog}
        onClose={() => setBillManagerDialog(false)}
        session={session}
        onResumeBill={resumeBill}
      />

      {/* Loyalty Program */}
      <LoyaltyProgram
        open={loyaltyDialog}
        onClose={() => setLoyaltyDialog(false)}
        session={session}
        customer={selectedCustomer}
        cartTotal={cartTotal}
        onPointsRedemption={(redemption) => {
          // Handle points redemption
          console.log('Points redemption:', redemption);
        }}
      />

      {/* Reporting Dashboard */}
      <ReportingDashboard
        open={reportingDialog}
        onClose={() => setReportingDialog(false)}
        session={session}
      />

      {/* Inventory Integration */}
      <InventoryIntegration
        open={inventoryDialog}
        onClose={() => setInventoryDialog(false)}
        session={session}
        selectedProduct={cart.length > 0 ? cart[0] : null}
        onStockUpdate={(product) => {
          console.log('Stock updated:', product);
        }}
      />

      {/* Sales Order Manager */}
      <SalesOrderManager
        open={salesOrderDialog}
        onClose={() => setSalesOrderDialog(false)}
        session={session}
        onConvertToSale={(order) => {
          // Convert order to sale
          setCart(order.items);
          setSelectedCustomer(order.customer);
          setSalesOrderDialog(false);
          setSnackbar({
            open: true,
            message: `Order ${order.id} converted to sale`,
            severity: 'success'
          });
        }}
      />

      {/* Gift Voucher Manager */}
      <GiftVoucherManager
        open={giftVoucherDialog}
        onClose={() => setGiftVoucherDialog(false)}
        session={session}
        onVoucherRedemption={(redemption) => {
          console.log('Voucher redeemed:', redemption);
          // Apply voucher discount to cart
        }}
      />

      {/* Layaway Manager */}
      <LayawayManager
        open={layawayDialog}
        onClose={() => setLayawayDialog(false)}
        session={session}
        onLayawayCompletion={(layaway) => {
          console.log('Layaway completed:', layaway);
          // Process layaway completion
        }}
      />

      {/* Customer Dialog */}
      <Dialog open={customerDialog} onClose={() => setCustomerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Customer</DialogTitle>
        <DialogContent>
          <List>
            <ListItem button onClick={() => setSelectedCustomer(null)}>
              <ListItemText primary="Walk-in Customer" secondary="No customer selected" />
            </ListItem>
            {mockCustomers.map(customer => (
              <ListItem
                key={customer.id}
                button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setCustomerDialog(false);
                }}
              >
                <ListItemText
                  primary={customer.name}
                  secondary={`${customer.phone} | ${customer.type}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomerDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default POSScreen;
