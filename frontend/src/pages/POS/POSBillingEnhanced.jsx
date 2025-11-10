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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
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
  ExpandMore as ExpandMoreIcon,
  LocalOffer as DiscountIcon,
  Person as CustomerIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

import terminalManager from '../../services/TerminalManager.js';
import shiftManager from '../../services/ShiftManager.js';
import sessionManager from '../../services/SessionManager.js';
import productManager from '../../services/ProductManager.js';
import transactionManager from '../../services/TransactionManager.js';
import { businessRulesService } from '../../services/businessRulesService.js';
import { payModeService } from '../../services/payModeService.js';
import { currencyService } from '../../services/currencyService.js';
import { codeSettingsService } from '../../services/codeSettingsService.js';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import indexedDBManager from '../../services/IndexedDBManager.js';
import PageTitle from '../../components/common/PageTitle';

const POSBillingEnhanced = () => {
  const navigate = useNavigate();
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
  
  // Enhanced state
  const [activeStep, setActiveStep] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [businessRules, setBusinessRules] = useState({});
  const [codeSettings, setCodeSettings] = useState({});
  
  // Payment state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(0);
  const [change, setChange] = useState(0);
  const [multiplePayments, setMultiplePayments] = useState([]);
  
  // Receipt state
  const [lastTransaction, setLastTransaction] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  
  // Refs
  const searchInputRef = useRef(null);

  // Override body background for billing page (must be before any conditional returns)
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f5f5f5';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  // Initialize POS system with enhanced integrations
  useEffect(() => {
    const INITIALIZATION_TIMEOUT = 30000; // 30 seconds max
    
    const initializePOS = async () => {
      const startTime = Date.now();
      
      // Helper to create timeout promise
      const withTimeout = (promise, timeoutMs, errorMsg) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`${errorMsg} (timeout after ${timeoutMs}ms)`)), timeoutMs)
          )
        ]);
      };
      
      try {
        setLoading(true);
        console.log('🔄 Starting POS initialization...');
        
        // Initialize managers with timeout (5 seconds each)
        try {
          await withTimeout(terminalManager.initialize(), 5000, 'Terminal manager initialization');
          console.log('✅ Terminal manager initialized');
        } catch (err) {
          console.warn('⚠️ Terminal manager init failed:', err.message);
        }
        
        try {
          await withTimeout(shiftManager.initialize(), 5000, 'Shift manager initialization');
          console.log('✅ Shift manager initialized');
        } catch (err) {
          console.warn('⚠️ Shift manager init failed:', err.message);
        }
        
        try {
          await withTimeout(sessionManager.initialize(), 5000, 'Session manager initialization');
          console.log('✅ Session manager initialized');
        } catch (err) {
          console.warn('⚠️ Session manager init failed:', err.message);
        }
        
        try {
          await withTimeout(productManager.initialize(), 5000, 'Product manager initialization');
          console.log('✅ Product manager initialized');
        } catch (err) {
          console.warn('⚠️ Product manager init failed:', err.message);
        }
        
        try {
          await withTimeout(transactionManager.initialize(), 5000, 'Transaction manager initialization');
          console.log('✅ Transaction manager initialized');
        } catch (err) {
          console.warn('⚠️ Transaction manager init failed:', err.message);
        }
        
        // Load enhanced data with timeout (3 seconds each)
        try {
          await withTimeout(loadBusinessRules(), 3000, 'Loading business rules');
          console.log('✅ Business rules loaded');
        } catch (err) {
          console.warn('⚠️ Business rules load failed:', err.message);
        }
        
        try {
          await withTimeout(loadPaymentMethods(), 3000, 'Loading payment methods');
          console.log('✅ Payment methods loaded');
        } catch (err) {
          console.warn('⚠️ Payment methods load failed:', err.message);
        }
        
        try {
          await withTimeout(loadCurrencies(), 3000, 'Loading currencies');
          console.log('✅ Currencies loaded');
        } catch (err) {
          console.warn('⚠️ Currencies load failed:', err.message);
        }
        
        try {
          await withTimeout(loadCodeSettings(), 3000, 'Loading code settings');
          console.log('✅ Code settings loaded');
        } catch (err) {
          console.warn('⚠️ Code settings load failed:', err.message);
        }
        
        const elapsed = Date.now() - startTime;
        console.log(`⏱️ Initialization completed in ${elapsed}ms`);
        
        // Try to get session from client-side manager first
        let session = sessionManager.getCurrentSession();
        let shift = shiftManager.getCurrentShift();
        
        // If not found locally, fetch from backend API with timeout
        if (!session) {
          try {
            console.log('Fetching current session from backend...');
            
            // Try the /current/ endpoint first with timeout
            let response;
            try {
              response = await withTimeout(
                api.get('/pos-sessions/current/'),
                10000, // 10 second timeout
                'Fetching current session'
              );
              console.log('✅ Session response from /current/:', response.data);
            } catch (currentError) {
              // If /current/ fails with 404, try fetching all open sessions
              if (currentError.response?.status === 404 || currentError.message?.includes('timeout')) {
                console.log('No session from /current/, trying to fetch all open sessions...');
                
                // Fetch current user first to get user ID with timeout
                try {
                  const userResponse = await withTimeout(
                    api.get('/auth/users/me/'),
                    5000,
                    'Fetching user info'
                  );
                  const userId = userResponse.data?.id;
                  
                  if (userId) {
                    // Try fetching by cashier ID with timeout
                    const sessionsResponse = await withTimeout(
                      api.get('/pos-sessions/', {
                        params: {
                          cashier: userId,
                          status: 'open',
                          ordering: '-opened_at',
                          page_size: 1
                        }
                      }),
                      10000,
                      'Fetching sessions list'
                    );
                    
                    const sessions = sessionsResponse.data?.results || sessionsResponse.data || [];
                    if (sessions.length > 0) {
                      response = { data: sessions[0] };
                      console.log('✅ Found session from list:', response.data);
                    } else {
                      throw new Error('No open sessions found');
                    }
                  } else {
                    throw new Error('User ID not found');
                  }
                } catch (e) {
                  console.error('❌ Could not fetch sessions:', e.message || e);
                  throw new Error('Failed to fetch session: ' + (e.message || 'Unknown error'));
                }
              } else {
                throw currentError;
              }
            }
            
            if (response.data) {
              // Handle both string IDs and object IDs for terminal/location
              const terminalId = typeof response.data.terminal === 'object' 
                ? response.data.terminal?.id || response.data.terminal
                : response.data.terminal;
              const locationId = typeof response.data.location === 'object'
                ? response.data.location?.id || response.data.location
                : response.data.location;
              
              // Check status - accept 'open' status
              if (!response.data.status || response.data.status === 'open') {
                // Convert backend session format to client-side format
                session = {
                  id: response.data.id,
                  name: `Session ${response.data.session_number}`,
                  terminalId: terminalId || null,
                  locationId: locationId || null,
                  operatorId: response.data.cashier || null,
                  operatorName: response.data.cashier_name || 'Unknown',
                  startTime: response.data.opened_at,
                  status: response.data.status || 'open',
                  openingCash: parseFloat(response.data.opening_cash || 0),
                  totalSales: parseFloat(response.data.total_sales || 0),
                  totalTransactions: 0, // Can be calculated from sales if needed
                  session_number: response.data.session_number,
                  // Save to IndexedDB via sessionManager
                  ...response.data
                };
                console.log('Converted session:', session);
                // Save to IndexedDB for future use
                try {
                  await indexedDBManager.upsert('session', session);
                  sessionManager.currentSession = session;
                } catch (dbError) {
                  console.warn('Could not save session to IndexedDB:', dbError);
                }
              } else {
                console.warn('Session found but status is not open:', response.data.status);
              }
            } else {
              console.warn('No session data in response');
            }
          } catch (error) {
            console.error('Error fetching current session:', error);
            console.error('Error details:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              message: error.message
            });
            // 404 means no active session - that's okay, but log it
            if (error.response?.status === 404) {
              console.log('No active session found (404) - User may need to open a session');
            } else {
              console.warn('Error fetching current session:', error);
            }
          }
        }
        
        // Create a shift if session exists but no shift
        if (session && !shift) {
          // Create a temporary shift object from session
          try {
            shift = await shiftManager.createShift({
              name: `Shift ${session.session_number || session.id}`,
              terminalId: session.terminalId || session.terminal,
              locationId: session.locationId || session.location,
              operatorId: session.operatorId || session.cashier || session.cashier_id,
              operatorName: session.operatorName || 'Unknown',
              openingCash: session.openingCash || 0,
              shiftType: 'regular'
            });
          } catch (shiftError) {
            // If shift creation fails (e.g., active shift exists), just create a simple shift object
            console.warn('Could not create shift via manager, using temporary shift:', shiftError);
            shift = {
              id: `shift_${session.id}`,
              sessionId: session.id,
              startTime: session.opened_at || session.startTime || new Date().toISOString(),
              status: 'active',
              openingCash: session.openingCash || 0
            };
            // Save directly to IndexedDB
            try {
              await indexedDBManager.upsert('shift', shift);
              shiftManager.currentShift = shift;
            } catch (dbError) {
              console.warn('Could not save shift to IndexedDB:', dbError);
            }
          }
        }
        
        if (session) {
          console.log('Setting session ready:', session);
          setCurrentSession(session);
          setCurrentShift(shift);
          setSessionReady(true);
        } else {
          console.log('No session found, setting error');
          setError('No active session found. Please open a session first from Session Open page.');
        }
        
      } catch (error) {
        console.error('❌ POS Initialization Error:', error);
        const errorMsg = error.message || 'Failed to initialize POS system';
        setError(`Failed to initialize POS system: ${errorMsg}. Please check your connection and try again.`);
        // Even on error, allow user to proceed if session is found
        if (currentSession) {
          setSessionReady(true);
        }
      } finally {
        const totalTime = Date.now() - startTime;
        console.log(`⏱️ Total initialization time: ${totalTime}ms`);
        setLoading(false);
      }
    };
    
    initializePOS();
    
    // Safety timeout - force loading to false after 30 seconds
    const safetyTimeout = setTimeout(() => {
      console.warn('⚠️ Initialization timeout - forcing loading to false');
      setLoading(false);
      if (!sessionReady && !error) {
        setError('Initialization is taking longer than expected. Please refresh the page or check your connection.');
      }
    }, INITIALIZATION_TIMEOUT);
    
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, []); // Empty dependency array - only run once on mount

  // Load business rules
  const loadBusinessRules = async () => {
    try {
      const rules = await businessRulesService.getAllRules();
      const rulesMap = {};
      rules.forEach(rule => {
        rulesMap[rule.setting_key] = rule;
      });
      setBusinessRules(rulesMap);
    } catch (error) {
      console.error('Failed to load business rules:', error);
    }
  };

  // Load payment methods
  const loadPaymentMethods = async () => {
    try {
      const methods = await payModeService.getAllPaymentMethods();
      setPaymentMethods(methods.filter(method => method.is_active));
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  // Load currencies
  const loadCurrencies = async () => {
    try {
      const currencyList = await currencyService.getActiveCurrencies();
      setCurrencies(currencyList);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  // Load code settings
  const loadCodeSettings = async () => {
    try {
      const settings = await codeSettingsService.getAllCodeSettings();
      const settingsMap = {};
      settings.forEach(setting => {
        settingsMap[setting.code_type] = setting;
      });
      setCodeSettings(settingsMap);
    } catch (error) {
      console.error('Failed to load code settings:', error);
    }
  };

  // Calculate totals with business rules
  const calculateTotals = () => {
    let calculatedSubtotal = 0;
    let calculatedTax = 0;
    let calculatedDiscount = 0;
    
    cart.forEach(item => {
      calculatedSubtotal += item.price * item.quantity;
    });
    
    // Apply business rules for tax calculation
    if (businessRules.ENABLE_TAX_CALCULATION?.boolean_value) {
      const taxRate = businessRules.TAX_RATE?.number_value || 0;
      calculatedTax = calculatedSubtotal * (taxRate / 100);
    }
    
    // Apply business rules for discount
    if (businessRules.ALLOW_DISCOUNTS?.boolean_value) {
      const maxDiscount = businessRules.MAX_DISCOUNT_PERCENTAGE?.number_value || 0;
      if (discount > maxDiscount) {
        calculatedDiscount = calculatedSubtotal * (maxDiscount / 100);
      } else {
        calculatedDiscount = discount;
      }
    }
    
    const calculatedTotal = calculatedSubtotal + calculatedTax - calculatedDiscount;
    
    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setDiscount(calculatedDiscount);
    setTotal(calculatedTotal);
  };

  // Update totals when cart or discount changes
  useEffect(() => {
    calculateTotals();
  }, [cart, discount, businessRules]);

  // Add item to cart
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
    
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Search products
  const searchProducts = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await productManager.searchProducts(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Generate receipt number
  const generateReceiptNumber = async () => {
    try {
      if (codeSettings['Receipt Number']) {
        const receiptCode = await codeSettingsService.generateCode(codeSettings['Receipt Number'].id);
        setReceiptNumber(receiptCode);
      }
    } catch (error) {
      console.error('Failed to generate receipt number:', error);
    }
  };

  // Generate invoice number
  const generateInvoiceNumber = async () => {
    try {
      if (codeSettings['Invoice Number']) {
        const invoiceCode = await codeSettingsService.generateCode(codeSettings['Invoice Number'].id);
        setInvoiceNumber(invoiceCode);
      }
    } catch (error) {
      console.error('Failed to generate invoice number:', error);
    }
  };

  // Process payment
  const processPayment = async () => {
    try {
      setLoading(true);
      
      // Generate receipt and invoice numbers
      await generateReceiptNumber();
      await generateInvoiceNumber();
      
      // Create transaction
      const transaction = {
        id: Date.now().toString(),
        receiptNumber,
        invoiceNumber,
        cart: [...cart],
        subtotal,
        tax,
        discount,
        total,
        customer,
        paymentMethod,
        amountPaid,
        change,
        currency: selectedCurrency,
        sessionId: currentSession?.id,
        shiftId: currentShift?.id,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      // Save transaction
      await transactionManager.saveTransaction(transaction);
      
      // Update session totals
      if (currentSession) {
        await sessionManager.updateSessionTotals(currentSession.id, {
          totalSales: (currentSession.totalSales || 0) + total,
          transactionCount: (currentSession.transactionCount || 0) + 1
        });
      }
      
      setLastTransaction(transaction);
      setReceiptDialogOpen(true);
      setPaymentDialogOpen(false);
      
      // Clear cart
      setCart([]);
      setCustomer(null);
      setAmountPaid(0);
      setChange(0);
      
      setSnackbar({ open: true, message: 'Transaction completed successfully!', severity: 'success' });
      
    } catch (error) {
      setError('Payment processing failed: ' + error.message);
      setSnackbar({ open: true, message: 'Payment processing failed: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate change
  const calculateChange = () => {
    const changeAmount = amountPaid - total;
    setChange(Math.max(0, changeAmount));
  };

  // Update change when amount paid changes
  useEffect(() => {
    calculateChange();
  }, [amountPaid, total]);

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'cash') {
      setAmountPaid(total);
    } else {
      setAmountPaid(0);
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: <MoneyIcon />,
      card: <CardIcon />,
      upi: <QRCodeIcon />,
      wallet: <WalletIcon />,
    };
    return icons[method] || <MoneyIcon />;
  };

  // Get payment method color
  const getPaymentMethodColor = (method) => {
    const colors = {
      cash: '#4CAF50',
      card: '#2196F3',
      upi: '#9C27B0',
      wallet: '#FF9800',
    };
    return colors[method] || '#9E9E9E';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return currencyService.formatCurrency(amount, selectedCurrency);
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Initializing POS System...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  // Show session not ready state
  if (!sessionReady) {
    return (
      <Box sx={{ 
        p: 3, 
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No active session found. Please start a session first.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/posv2/session-open')}
          sx={{ mr: 2 }}
        >
          Open Session
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/posv2/day-open')}
        >
          Check Day Open
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#f5f5f5',
      width: '100%',
      position: 'relative'
    }}>
      {/* Header */}
      <Paper sx={{ p: 2, backgroundColor: '#1976d2', color: 'white', borderRadius: 0 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <PageTitle 
              title="POS Billing - Enhanced" 
              subtitle="Advanced point of sale billing system"
              showIcon={true}
              icon={<CartIcon />}
            />
          </Grid>
          <Grid item>
            <Chip 
              label={`Session: ${currentSession?.id || 'N/A'}`} 
              size="small" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Grid>
          <Grid item>
            <Chip 
              label={`Shift: ${currentShift?.id || 'N/A'}`} 
              size="small" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/posv2/shift-workflow')}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)'
                }
              }}
            >
              POS Console
            </Button>
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
              >
                {Array.isArray(currencies) && currencies.length > 0 ? (
                  currencies.map((currency) => (
                    <MenuItem key={currency?.code || currency?.id || Math.random()} value={currency?.code || 'INR'}>
                      {currency?.code || 'INR'} - {currency?.name || 'Indian Rupee'}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2 }}>
        {/* Left Panel - Product Search */}
        <Paper sx={{ width: '40%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Product Search
          </Typography>
          
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchProducts(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          {searchResults.length > 0 && (
            <List>
              {searchResults.map((product) => (
                <ListItem key={product.id} divider>
                  <ListItemText
                    primary={product.name}
                    secondary={`${getCurrencySymbol()}${product.price}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => addToCart(product)}>
                      <AddIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Right Panel - Cart and Payment */}
        <Paper sx={{ width: '60%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Shopping Cart
          </Typography>
          
          {cart.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CartIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search and add products to get started
              </Typography>
            </Box>
          ) : (
            <>
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
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography variant="body2">{item.quantity}</Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => removeFromCart(item.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Totals */}
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
                  <Typography>-{formatCurrency(discount)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">{formatCurrency(total)}</Typography>
                </Box>
              </Box>
              
              {/* Payment Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PaymentIcon />}
                onClick={() => setPaymentDialogOpen(true)}
                sx={{ 
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Process Payment
              </Button>
            </>
          )}
        </Paper>
      </Box>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon />
            <Typography variant="h6">Payment Processing</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Payment Methods */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Payment Methods
              </Typography>
              <Grid container spacing={1}>
                {paymentMethods.map((method) => (
                  <Grid item xs={6} key={method.id}>
                    <Button
                      fullWidth
                      variant={paymentMethod === method.code ? 'contained' : 'outlined'}
                      startIcon={getPaymentMethodIcon(method.code)}
                      onClick={() => handlePaymentMethodChange(method.code)}
                      sx={{
                        backgroundColor: paymentMethod === method.code ? getPaymentMethodColor(method.code) : 'transparent',
                        borderColor: getPaymentMethodColor(method.code),
                        color: paymentMethod === method.code ? 'white' : getPaymentMethodColor(method.code),
                        '&:hover': {
                          backgroundColor: paymentMethod === method.code ? getPaymentMethodColor(method.code) : getPaymentMethodColor(method.code) + '20',
                        }
                      }}
                    >
                      {method.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            {/* Payment Amount */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Payment Amount
              </Typography>
              <TextField
                fullWidth
                label="Amount Paid"
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              
              {change > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Change: {formatCurrency(change)}
                </Alert>
              )}
              
              {amountPaid < total && (
                <Alert severity="warning">
                  Amount paid is less than total. Remaining: {formatCurrency(total - amountPaid)}
                </Alert>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={processPayment}
            disabled={amountPaid < total || loading}
            startIcon={<CheckIcon />}
          >
            Complete Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon />
            <Typography variant="h6">Transaction Receipt</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {lastTransaction && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Receipt #{lastTransaction.receiptNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Invoice #{lastTransaction.invoiceNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date: {new Date(lastTransaction.timestamp).toLocaleString()}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Items:
              </Typography>
              {lastTransaction.cart.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
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
                <Typography>Discount:</Typography>
                <Typography>-{formatCurrency(lastTransaction.discount)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">{formatCurrency(lastTransaction.total)}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Payment Method:</Typography>
                <Typography>{lastTransaction.paymentMethod}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Amount Paid:</Typography>
                <Typography>{formatCurrency(lastTransaction.amountPaid)}</Typography>
              </Box>
              {lastTransaction.change > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Change:</Typography>
                  <Typography>{formatCurrency(lastTransaction.change)}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptDialogOpen(false)}>
            Continue Billing
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setReceiptDialogOpen(false);
              setTimeout(() => navigate('/posv2/shift-workflow'), 300);
            }}
            startIcon={<PaymentIcon />}
          >
            Go to POS Console
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
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
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default POSBillingEnhanced;
