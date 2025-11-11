import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  PlayArrow as ResumeIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import ProductSearch from './components/ProductSearch';
import Cart from './components/Cart';
import PaymentDialog from './components/PaymentDialog';
import SessionDialog from './components/SessionDialog';
import SuspendedSalesDialog from './components/SuspendedSalesDialog';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import QuickAccessPanel from './components/QuickAccessPanel';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import salesService from '../../services/salesService';

const POSScreen = () => {
  const currentUser = useSelector((state) => state.auth.user);
  
  // Session state
  const [session, setSession] = useState(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  
  // Dialog states
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [suspendedDialogOpen, setSuspendedDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  
  // UI state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [discountFieldRef, setDiscountFieldRef] = useState(null);

  // Check for active session on mount
  useEffect(() => {
    checkSession();
    checkForRecovery();
  }, []);

  // Handler functions (defined before useKeyboardShortcuts)
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      setCartItems([]);
      setCustomer(null);
      setDiscount(0);
      setNotes('');
      localStorage.removeItem('pos_cart_recovery');
    }
  };

  const handleSuspend = async () => {
    if (cartItems.length === 0) {
      showSnackbar('Cart is empty', 'warning');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        sale_type: 'cash',
        cashier: currentUser.id,
        customer: customer?.id || null,
        status: 'draft',
        discount_percentage: discount,
        notes,
        items: cartItems.map(item => ({
          product: item.product.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_amount: item.discount_amount,
          tax_rate: item.tax_rate,
        })),
      };

      await salesService.create(saleData);
      
      // Clear cart
      setCartItems([]);
      setCustomer(null);
      setDiscount(0);
      setNotes('');
      localStorage.removeItem('pos_cart_recovery');
      
      showSnackbar('Sale suspended successfully', 'success');
    } catch (error) {
      console.error('Error suspending sale:', error);
      showSnackbar('Failed to suspend sale', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showSnackbar('Cart is empty', 'warning');
      return;
    }
    
    if (!session) {
      showSnackbar('Please open a session first', 'error');
      setSessionDialogOpen(true);
      return;
    }
    
    setPaymentDialogOpen(true);
  };

  const handleResumeSale = (saleData) => {
    // Load suspended sale into cart
    const items = saleData.items.map(item => ({
      product: {
        id: item.product,
        name: item.product_name,
        barcode: item.product_barcode,
      },
      quantity: parseFloat(item.quantity),
      unit_price: parseFloat(item.unit_price),
      discount_amount: parseFloat(item.discount_amount),
      tax_rate: parseFloat(item.tax_rate),
    }));
    
    setCartItems(items);
    setCustomer(saleData.customer);
    setDiscount(parseFloat(saleData.discount_percentage));
    setNotes(saleData.notes || '');
    setSuspendedDialogOpen(false);
    
    showSnackbar('Sale resumed', 'success');
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewSale: handleClearCart,
    onSuspend: handleSuspend,
    onResume: () => setSuspendedDialogOpen(true),
    onCheckout: handleCheckout,
    onCustomer: () => setCustomerDialogOpen(true),
    onDiscount: () => {
      // Focus discount field
      const discountInput = document.querySelector('input[label="Bill Discount (%)"]');
      discountInput?.focus();
    },
    onSearchFocus: () => {
      const searchInput = document.getElementById('pos-search');
      searchInput?.focus();
    },
    onClearCart: handleClearCart,
    onHelp: () => setHelpDialogOpen(true),
  });

  // Auto-save cart state every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (cartItems.length > 0) {
        localStorage.setItem('pos_cart_recovery', JSON.stringify({
          items: cartItems,
          customer,
          discount,
          notes,
          timestamp: new Date().toISOString(),
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [cartItems, customer, discount, notes]);

  const checkSession = async () => {
    try {
      const sessionData = await salesService.getCurrentSession();
      setSession(sessionData);
    } catch (error) {
      console.log('No active session or authentication required:', error.message);
      // In development mode, don't force session dialog immediately
      // Just log that session check didn't work
    }
  };

  const checkForRecovery = () => {
    const recovery = localStorage.getItem('pos_cart_recovery');
    if (recovery) {
      const data = JSON.parse(recovery);
      if (window.confirm('Previous session found. Would you like to recover it?')) {
        setCartItems(data.items || []);
        setCustomer(data.customer || null);
        setDiscount(data.discount || 0);
        setNotes(data.notes || '');
      }
      localStorage.removeItem('pos_cart_recovery');
    }
  };

  const handleSessionOpen = (sessionData) => {
    setSession(sessionData);
    setSessionDialogOpen(false);
    showSnackbar('Session opened successfully', 'success');
  };

  const handleProductSelect = (product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      // Increment quantity
      setCartItems(cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: parseFloat(item.quantity) + 1 }
          : item
      ));
    } else {
      // Add new item
      setCartItems([...cartItems, {
        product,
        quantity: 1,
        unit_price: parseFloat(product.unit_price),
        discount_amount: 0,
        tax_rate: parseFloat(product.tax_rate),
      }]);
    }
    
    showSnackbar(`${product.name} added to cart`, 'success');
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity: parseFloat(quantity) }
        : item
    ));
  };

  const handleUpdatePrice = (productId, price) => {
    setCartItems(cartItems.map(item =>
      item.product.id === productId
        ? { ...item, unit_price: parseFloat(price) }
        : item
    ));
  };

  const handleUpdateDiscount = (productId, discountAmount) => {
    setCartItems(cartItems.map(item =>
      item.product.id === productId
        ? { ...item, discount_amount: parseFloat(discountAmount) || 0 }
        : item
    ));
  };

  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    
    cartItems.forEach(item => {
      const itemSubtotal = item.quantity * item.unit_price;
      const taxableAmount = itemSubtotal - item.discount_amount;
      const itemTax = (taxableAmount * item.tax_rate) / 100;
      
      subtotal += itemSubtotal;
      totalTax += itemTax;
    });
    
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + totalTax - discountAmount;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: totalTax.toFixed(2),
      discount: discountAmount.toFixed(2),
      total: Math.max(0, total).toFixed(2),
    };
  };

  // Duplicate handleSuspend removed - see definition above

  // Duplicate handleResumeSale removed - see definition above

  // Duplicate handleCheckout removed - see definition above

  const handlePaymentComplete = () => {
    setPaymentDialogOpen(false);
    setCartItems([]);
    setCustomer(null);
    setDiscount(0);
    setNotes('');
    localStorage.removeItem('pos_cart_recovery');
    showSnackbar('Sale completed successfully!', 'success');
  };

  // Duplicate showSnackbar removed - see definition above

  const totals = calculateTotals();

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 1, mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box>
            <PageTitle 
              title="Point of Sale ⚡" 
              subtitle="Full-screen POS mode • Access other features via navigation at the top"
              variant="h5"
            />
            {session && (
              <Typography variant="body2" color="text.secondary">
                Session: {session.session_number} | Cashier: {session.cashier_name}
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
            Press F1 for shortcuts
          </Typography>
        </Box>
        
        {/* Quick Access Panel */}
        <QuickAccessPanel
          cartItemCount={cartItems.length}
          onCustomer={() => setCustomerDialogOpen(true)}
          onDiscount={() => {
            const discountInput = document.querySelector('input[name="discount"]');
            discountInput?.focus();
          }}
          onSuspend={handleSuspend}
          onResume={() => setSuspendedDialogOpen(true)}
          onClear={handleClearCart}
          onCheckout={handleCheckout}
          onHelp={() => setHelpDialogOpen(true)}
          disabled={loading}
        />
      </Paper>

      {/* Main Content */}
      <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Left: Product Search */}
        <Grid item xs={12} md={7} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <ProductSearch onProductSelect={handleProductSelect} />
        </Grid>

        {/* Right: Cart */}
        <Grid item xs={12} md={5} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Cart
            items={cartItems}
            customer={customer}
            discount={discount}
            notes={notes}
            totals={totals}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdatePrice={handleUpdatePrice}
            onUpdateDiscount={handleUpdateDiscount}
            onRemoveItem={handleRemoveItem}
            onSetCustomer={setCustomer}
            onSetDiscount={setDiscount}
            onSetNotes={setNotes}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Dialogs */}
      <SessionDialog
        open={sessionDialogOpen}
        onClose={() => setSessionDialogOpen(false)}
        onSessionOpen={handleSessionOpen}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        cartItems={cartItems}
        customer={customer}
        discount={discount}
        notes={notes}
        totals={totals}
        session={session}
        onComplete={handlePaymentComplete}
      />

      <SuspendedSalesDialog
        open={suspendedDialogOpen}
        onClose={() => setSuspendedDialogOpen(false)}
        onResume={handleResumeSale}
      />

      <KeyboardShortcutsHelp
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default POSScreen;

