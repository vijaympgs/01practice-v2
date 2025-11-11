import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
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
  CircularProgress,
  Tooltip,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Person as CustomerIcon,
  LocalOffer as DiscountIcon,
  Print as PrintIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  QrCode as QRCodeIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  AccountBalanceWallet as WalletIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Inventory as InventoryIcon,
  Email as EmailIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import terminalManager from '../../services/TerminalManager.js';
import shiftManager from '../../services/ShiftManager.js';
import sessionManager from '../../services/SessionManager.js';
import productManager from '../../services/ProductManager.js';
import transactionManager from '../../services/TransactionManager.js';
import { businessRulesService } from '../../services/businessRulesService.js';
import { payModeService } from '../../services/payModeService.js';
import { currencyService } from '../../services/currencyService.js';
import { codeSettingsService } from '../../services/codeSettingsService.js';
import api from '../../services/api';
import indexedDBManager from '../../services/IndexedDBManager.js';
import salesService from '../../services/salesService.js';
import customerService from '../../services/customerService.js';
import { posMasterService } from '../../services/posMasterService.js';
import terminalService from '../../services/terminalService.js';
import { usePOSPermissions } from '../../hooks/usePOSPermissions.js';

/**
 * Desktop POS UI Component
 * 
 * Modern desktop POS interface inspired by leading POS systems:
 * - Square POS
 * - Toast POS
 * - Lightspeed Retail
 * - Clover POS
 * 
 * Features:
 * - Full-screen desktop layout
 * - Large touch-friendly buttons
 * - Product grid with visual browsing
 * - Prominent cart panel
 * - Keyboard shortcuts
 * - Professional retail appearance
 */
const POSDesktop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const searchInputRef = useRef(null);
  
  // POS Permissions hook
  const { canExecute, requiresApproval, loading: permissionsLoading } = usePOSPermissions();
  
  // Helper function to check if a function button should be disabled
  const isFunctionDisabled = (functionCode) => {
    if (permissionsLoading) return false; // Allow during loading (fail-open)
    return !canExecute(functionCode);
  };
  
  // Helper function to check if a function can be executed (for keyboard shortcuts)
  // Uses fail-open approach: allow if loading or if explicitly allowed
  const canExecuteFunction = (functionCode) => {
    if (permissionsLoading) return true; // Fail-open: allow during loading
    return canExecute(functionCode);
  };
  
  // State
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentTerminal, setCurrentTerminal] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);
  const [error, setError] = useState(null);
  const [showProductLookup, setShowProductLookup] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Product state
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Bill details state
  const [lastBillNumber, setLastBillNumber] = useState('-');
  const [lastBillAmount, setLastBillAmount] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [returnAmount, setReturnAmount] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  
  // Item entry form state (for section 2.1.2)
  const [itemForm, setItemForm] = useState({
    itemCode: '',
    itemName: '',
    qty: '',
    rate: '',
    discount: '',
    netAmount: ''
  });
  
  // Sale type state
  const [saleType, setSaleType] = useState('cash');
  const [saleTypes, setSaleTypes] = useState([
    { code: 'cash', name: 'Cash Sale' },
    { code: 'credit', name: 'Credit Sale' },
    { code: 'voucher', name: 'Gift Voucher Sale' },
    { code: 'layaway', name: 'Layaway Sale' },
    { code: 'service', name: 'Miscellaneous/Service Sale' },
  ]); // Default fallback sale types
  
  // Customer state
  const [customer, setCustomer] = useState(null);
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  // UI state
  const [showIdentifiers, setShowIdentifiers] = useState(false);
  const [showItemScan, setShowItemScan] = useState(false);
  const [buttonScrollIndex, setButtonScrollIndex] = useState(0); // Start at F1-F12 (index 0-11)
  const [scanInput, setScanInput] = useState('');
  
  // POS Function dialogs state
  const [lineItemDiscountDialogOpen, setLineItemDiscountDialogOpen] = useState(false);
  const [billDiscountDialogOpen, setBillDiscountDialogOpen] = useState(false);
  const [priceChangeDialogOpen, setPriceChangeDialogOpen] = useState(false);
  const [quantityChangeDialogOpen, setQuantityChangeDialogOpen] = useState(false);
  const [taxOverrideDialogOpen, setTaxOverrideDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);
  const [reprintDialogOpen, setReprintDialogOpen] = useState(false);
  const [billQueryDialogOpen, setBillQueryDialogOpen] = useState(false);
  const [settlementDialogOpen, setSettlementDialogOpen] = useState(false);
  const [forceQuitDialogOpen, setForceQuitDialogOpen] = useState(false);
  
  // Selected item for operations
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [transactionNotes, setTransactionNotes] = useState('');
  const [billDiscountPercent, setBillDiscountPercent] = useState(0);
  const [suspendedSales, setSuspendedSales] = useState([]);
  
  // Payment state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [tenderDialogOpen, setTenderDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(0);
  const [change, setChange] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  // Bill preview state
  const [billPreviewOpen, setBillPreviewOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [completedSaleChange, setCompletedSaleChange] = useState(0);
  
  // Business rules
  const [businessRules, setBusinessRules] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  
  // Notification
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Helper function for timeout
  const withTimeout = (promise, ms, description) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${description} timeout after ${ms}ms`)), ms)
      )
    ]);
  };

  // Initialize POS
  useEffect(() => {
    const INITIALIZATION_TIMEOUT = 15000; // 15 seconds max
    
    const initializePOS = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        setSessionReady(false); // Reset session ready state
        const startTime = Date.now();
        
        // CRITICAL: Initialize managers first before trying to get sessions
        // This ensures IndexedDB is ready and managers can access cached data
        console.log('🔄 Initializing managers...');
        try {
          await terminalManager.initialize().catch(err => console.warn('Terminal manager init warning:', err));
        } catch (err) {
          console.warn('Terminal manager init failed (non-critical):', err);
        }
        
        try {
          await shiftManager.initialize().catch(err => console.warn('Shift manager init warning:', err));
        } catch (err) {
          console.warn('Shift manager init failed (non-critical):', err);
        }
        
        try {
          await sessionManager.initialize().catch(err => console.warn('Session manager init warning:', err));
        } catch (err) {
          console.warn('Session manager init failed (non-critical):', err);
        }
        
        console.log('✅ Managers initialized');
        
        // Load products, payment methods, business rules, and sale types in parallel
        // These are non-critical and can fail without blocking the UI
        await Promise.all([
          loadProducts().catch(err => console.warn('Products load failed:', err)),
          loadPaymentMethods().catch(err => console.warn('Payment methods load failed:', err)),
          loadBusinessRules().catch(err => console.warn('Business rules load failed:', err)),
          loadSaleTypes().catch(err => console.warn('Sale types load failed:', err))
        ]);
        
        const elapsed = Date.now() - startTime;
        console.log(`⏱️ Initialization completed in ${elapsed}ms`);
        
        // Try to get session from client-side manager first (now that managers are initialized)
        let session = sessionManager.getCurrentSession();
        let shift = shiftManager.getCurrentShift();
        
        console.log('🔍 Checking for existing session:', { 
          sessionFromManager: !!session, 
          shiftFromManager: !!shift,
          sessionId: session?.id 
        });
        
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
                // Use user from Redux if available, otherwise fetch
                const currentUser = user || (await withTimeout(
                  api.get('/auth/users/me/'),
                  5000,
                  'Fetching user info'
                ).then(res => res.data).catch(() => null));
                
                const userId = currentUser?.id;
                
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
              } else {
                throw currentError;
              }
            }
            
            if (response?.data) {
              // Handle both string IDs and object IDs for terminal/location
              const terminalId = typeof response.data.terminal === 'object' 
                ? response.data.terminal?.id || response.data.terminal
                : response.data.terminal;
              const locationId = typeof response.data.location === 'object'
                ? response.data.location?.id || response.data.location
                : response.data.location;
              
              console.log('🔍 Terminal ID extracted from session response:', {
                terminal: response.data.terminal,
                terminalId_extracted: terminalId,
                terminal_type: typeof response.data.terminal,
                locationId: locationId
              });
              
              // Check status - accept 'open' status
              if (!response.data.status || response.data.status === 'open') {
                // Convert backend session format to client-side format
                session = {
                  id: response.data.id,
                  name: `Session ${response.data.session_number}`,
                  terminalId: terminalId || null,
                  locationId: locationId || null,
                  operatorId: response.data.cashier || null,
                  operatorName: response.data.cashier_name || user?.full_name || user?.username || 'Unknown',
                  startTime: response.data.opened_at,
                  status: response.data.status || 'open',
                  openingCash: parseFloat(response.data.opening_cash || 0),
                  totalSales: parseFloat(response.data.total_sales || 0),
                  totalTransactions: 0, // Can be calculated from sales if needed
                  session_number: response.data.session_number,
                  // Save original terminal object if it exists
                  terminal: response.data.terminal,
                  // Save to IndexedDB via sessionManager
                  ...response.data
                };
                console.log('✅ Converted session with terminal info:', {
                  id: session.id,
                  terminalId: session.terminalId,
                  terminal: session.terminal,
                  terminal_type: typeof session.terminal,
                  terminal_value: session.terminal,
                  has_terminal: session.terminal !== null && session.terminal !== undefined
                });
                
                // Debug: Log if terminal is null
                if (!session.terminal && !session.terminalId) {
                  console.warn('⚠️ WARNING: Session has no terminal assigned! Terminal field is null/undefined.');
                }
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
            }
          } catch (sessionError) {
            console.error('❌ Session loading error:', sessionError);
            // Don't throw here, let it fall through to show "no session" message
            // Set error only if it's a critical error, not a "no session" case
            if (sessionError.response?.status !== 404 && !sessionError.message?.includes('No open sessions')) {
              setError(`Session loading failed: ${sessionError.message || 'Unknown error'}`);
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
          setError(null); // Clear any errors
          
          // Load terminal details if terminal ID is available
          loadTerminalDetails(session);
        } else {
          console.log('No session found, setting error');
          setError('No active session found. Please open a session first from Session Open page.');
          setSessionReady(false); // Ensure sessionReady is false
        }
        
      } catch (err) {
        console.error('POS initialization error:', err);
        setError(err.message || 'Failed to initialize POS');
        setSessionReady(false); // Ensure sessionReady is false on error
      } finally {
        setLoading(false);
      }
    };
    
    // Safety timeout - ensure loading is always cleared
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Initialization timeout - forcing loading to false');
        setLoading(false);
        if (!sessionReady && !error) {
          setError('Initialization is taking longer than expected. Please refresh the page or check your connection.');
        }
      }
    }, INITIALIZATION_TIMEOUT);
    
    initializePOS();
    loadLastBill();
    
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [user, location.pathname]); // Re-run when user changes OR when navigating to this page

  // Load products
  const loadProducts = async () => {
    try {
      const response = await api.get('/products/', {
        params: { is_active: true, page_size: 100 }
      });
      const productsList = response.data.results || response.data || [];
      setProducts(productsList);
    } catch (err) {
      console.error('Failed to load products:', err);
      // Set empty array on error to prevent UI issues
      setProducts([]);
    }
  };

  // Load last bill details
  const loadLastBill = async () => {
    try {
      const response = await api.get('/sales/', {
        params: {
          ordering: '-sale_date',
          page_size: 1
        }
      });
      const sales = response.data.results || response.data || [];
      if (sales.length > 0) {
        const lastSale = sales[0];
        setLastBillNumber(lastSale.sale_number || '-');
        setLastBillAmount(parseFloat(lastSale.total_amount || 0));
      }
    } catch (err) {
      console.error('Failed to load last bill:', err);
    }
  };

  // Load payment methods
  const loadPaymentMethods = async () => {
    try {
      const methods = await payModeService.getAllPaymentMethods();
      setPaymentMethods(methods.filter(m => m.is_active));
    } catch (err) {
      console.error('Failed to load payment methods:', err);
    }
  };

  // Load business rules
  const loadBusinessRules = async () => {
    try {
      const rules = await businessRulesService.getAllRules();
      const rulesMap = {};
      rules.forEach(rule => {
        rulesMap[rule.setting_key] = rule;
      });
      setBusinessRules(rulesMap);
    } catch (err) {
      console.error('Failed to load business rules:', err);
    }
  };

  // Load terminal details from API using terminal ID from session
  const loadTerminalDetails = useCallback(async (session) => {
    if (!session) {
      console.log('⚠️ No session provided to loadTerminalDetails');
      setCurrentTerminal(null);
      return;
    }

    try {
      // Get terminal ID from session - check multiple possible locations
      let terminalId = null;
      
      console.log('🔍 Session data:', {
        terminal: session.terminal,
        terminalId: session.terminalId,
        tillId: session.tillId,
        till: session.till,
        terminal_type: typeof session.terminal,
        all_keys: Object.keys(session),
        full_session: session
      });

      // Try different ways to get terminal ID - check all possible field names
      // 1. Check session.terminal (object or ID)
      if (session.terminal) {
        if (typeof session.terminal === 'object' && session.terminal !== null) {
          terminalId = session.terminal.id || 
                      session.terminal.terminal_id || 
                      session.terminal.terminalId ||
                      session.terminal.uuid ||
                      session.terminal.pk;
        } else if (typeof session.terminal === 'string' || typeof session.terminal === 'number') {
          terminalId = session.terminal;
        }
      }
      
      // 2. Check session.terminalId
      if (!terminalId && session.terminalId) {
        terminalId = session.terminalId;
      }
      
      // 3. Check session.terminal_id (snake_case)
      if (!terminalId && session.terminal_id) {
        terminalId = session.terminal_id;
      }
      
      // 4. Check session.tillId
      if (!terminalId && session.tillId) {
        terminalId = session.tillId;
      }
      
      // 5. Check session.till_id (snake_case)
      if (!terminalId && session.till_id) {
        terminalId = session.till_id;
      }
      
      // 6. Check session.till (object or ID)
      if (!terminalId && session.till) {
        if (typeof session.till === 'object' && session.till !== null) {
          terminalId = session.till.id || 
                      session.till.terminal_id || 
                      session.till.terminalId ||
                      session.till.uuid ||
                      session.till.pk;
        } else if (typeof session.till === 'string' || typeof session.till === 'number') {
          terminalId = session.till;
        }
      }
      
      // 7. Check for terminal in nested structures (from backend spread)
      if (!terminalId) {
        // Check if terminal is nested as a string URL or ID
        const terminalField = session.terminal;
        if (terminalField && (typeof terminalField === 'string' || typeof terminalField === 'number')) {
          terminalId = terminalField;
        }
      }
      
      if (terminalId) {
        console.log('🔍 Loading terminal details for ID:', terminalId);
        try {
          const terminalData = await terminalService.getTerminal(terminalId);
          if (terminalData) {
            setCurrentTerminal(terminalData);
            console.log('✅ Terminal loaded successfully:', {
              id: terminalData.id,
              name: terminalData.name,
              terminal_code: terminalData.terminal_code,
              system_name: terminalData.system_name
            });
          } else {
            console.warn('⚠️ Terminal data is null or undefined');
            setCurrentTerminal(null);
          }
        } catch (terminalError) {
          console.error('❌ Failed to load terminal from API:', terminalError);
          console.error('Error details:', {
            message: terminalError.message,
            response: terminalError.response?.data,
            status: terminalError.response?.status
          });
          // Don't set to null immediately - keep trying or show fallback
          setCurrentTerminal(null);
        }
      } else {
        // Log detailed session structure for debugging
        console.warn('⚠️ No terminal ID found in session.');
        console.log('📋 Full session object:', session);
        console.log('📋 Session keys:', Object.keys(session || {}));
        console.log('📋 Terminal-related fields:', {
          terminal: session.terminal,
          terminalId: session.terminalId,
          terminal_id: session.terminal_id,
          tillId: session.tillId,
          till_id: session.till_id,
          till: session.till
        });
        
        // If terminal field exists but is null, that's a valid case (terminal not assigned)
        if (session.terminal === null || session.terminal === undefined) {
          console.info('ℹ️ Session has no terminal assigned (terminal field is null/undefined)');
        }
        
        setCurrentTerminal(null);
      }
    } catch (error) {
      console.error('⚠️ Error in loadTerminalDetails:', error);
      setCurrentTerminal(null);
    }
  }, []); // No dependencies - function is stable

  // Reload terminal details when currentSession changes
  useEffect(() => {
    if (currentSession) {
      loadTerminalDetails(currentSession);
    } else {
      setCurrentTerminal(null);
    }
  }, [currentSession, loadTerminalDetails]); // Reload when session changes

  // Load sale types from POSMaster
  const loadSaleTypes = async () => {
    try {
      const saleTypesData = await posMasterService.getMastersByType('sale_type');
      if (saleTypesData && saleTypesData.length > 0) {
        // Transform POSMaster data to our format
        const formattedSaleTypes = saleTypesData
          .filter(st => st.is_active) // Only active sale types
          .map(st => ({
            code: st.code,
            name: st.name,
            display_order: st.display_order || 999
          }))
          .sort((a, b) => (a.display_order || 999) - (b.display_order || 999));
        
        if (formattedSaleTypes.length > 0) {
          setSaleTypes(formattedSaleTypes);
          console.log('✅ Sale types loaded from POSMaster:', formattedSaleTypes);
        }
      }
    } catch (err) {
      console.warn('Failed to load sale types from POSMaster, using defaults:', err);
      // Keep default fallback sale types
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter products based on search query
  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      product.name?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.barcode?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Add to cart
  const handleProductSelect = (product) => {
    // Populate form fields in section 2.1.2
    const itemCode = product.sku || product.id;
    const itemName = product.name || '';
    setItemForm({
      itemCode: itemCode,
      itemName: itemName,
      qty: '1',
      rate: product.price || '0',
      discount: '',
      netAmount: product.price ? product.price.toFixed(2) : '0'
    });
    // Also add to cart
    addToCart(product);
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
      setCart([...cart, {
        ...product,
        quantity: 1,
        lineTotal: product.price
      }]);
    }
    
    // Clear search
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity, lineTotal: item.price * quantity }
          : item
      ));
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Calculate totals
  // Formula: Qty * Rate - Discount + Tax (tax is calculated after discount)
  useEffect(() => {
    let calculatedSubtotal = 0; // Sum of (Qty * Rate) for all items - displayed as Sub Total
    let totalItemDiscount = 0; // Sum of item-level discounts
    
    cart.forEach(item => {
      const itemPrice = item.price || 0;
      const itemQty = item.quantity || 0;
      const itemDiscount = item.discount || 0;
      
      // Qty * Rate
      const itemBaseAmount = itemPrice * itemQty;
      calculatedSubtotal += itemBaseAmount;
      totalItemDiscount += itemDiscount;
    });
    
    // Apply bill discount on subtotal
    const billDiscountAmount = (calculatedSubtotal * billDiscountPercent) / 100;
    
    // Total discounts (item + bill)
    const totalDiscount = totalItemDiscount + billDiscountAmount;
    
    // Calculate tax AFTER discount is applied
    // Tax on: (Subtotal - Total Discount)
    let calculatedTax = 0;
    if (businessRules.ENABLE_TAX_CALCULATION?.boolean_value) {
      const taxableAmount = calculatedSubtotal - totalDiscount;
      // Use weighted average tax rate if items have different tax rates
      // For simplicity, using the default tax rate from business rules
      const taxRate = businessRules.TAX_RATE?.number_value || 0;
      calculatedTax = taxableAmount * (taxRate / 100);
    }
    
    // Total calculation: (Qty * Rate - Discount) + Tax
    // Then apply other charges, return amount, round off
    const totalBeforeRoundOff = calculatedSubtotal - totalDiscount + calculatedTax + otherCharges - returnAmount;
    const calculatedRoundOff = Math.round(totalBeforeRoundOff) - totalBeforeRoundOff;
    const calculatedTotal = totalBeforeRoundOff + calculatedRoundOff;
    
    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setDiscount(billDiscountAmount);
    setRoundOff(calculatedRoundOff);
    setTotal(calculatedTotal);
    
    // Calculate change
    if (amountPaid > 0) {
      setChange(Math.max(0, amountPaid - calculatedTotal));
    }
  }, [cart, billDiscountPercent, businessRules, amountPaid, otherCharges, returnAmount]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: selectedCurrency || 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Process payment
  const processPayment = async () => {
    if (amountPaid < total) {
      setSnackbar({
        open: true,
        message: 'Amount paid is less than total',
        severity: 'error'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Calculate discount percentage if discount amount is provided
      const discountPercentage = discount > 0 ? (discount / subtotal) * 100 : 0;
      
      // Map payment method to sale type
      const saleTypeMap = {
        'cash': 'cash',
        'card': 'card',
        'credit_card': 'card',
        'debit_card': 'card',
        'upi': 'upi',
        'wallet': 'wallet',
        'bank_transfer': 'bank_transfer'
      };
      const saleType = saleTypeMap[paymentMethod] || 'cash';
      
      // Map payment method to valid Payment model choices: 'cash', 'card', 'upi', 'wallet', 'cheque', 'credit'
      const paymentMethodMap = {
        'cash': 'cash',
        'card': 'card',
        'credit_card': 'card',
        'debit_card': 'card',
        'upi': 'upi',
        'wallet': 'wallet',
        'cheque': 'cheque',
        'credit': 'credit',
        'bank_transfer': 'card' // Map bank_transfer to card for payment method
      };
      const validPaymentMethod = paymentMethodMap[paymentMethod] || 'cash';
      
      // Validate cart is not empty
      if (!cart || cart.length === 0) {
        setSnackbar({
          open: true,
          message: 'Cart is empty. Please add items before processing payment.',
          severity: 'error'
        });
        return;
      }
      
      // Validate required fields
      if (!user?.id && !currentSession?.operatorId) {
        setSnackbar({
          open: true,
          message: 'Cashier information is missing. Please ensure you are logged in.',
          severity: 'error'
        });
        return;
      }
      
      // Get location from current session - required by backend
      const locationId = currentSession?.locationId || currentSession?.location?.id || currentSession?.location;
      
      // Validate location is available (backend requires it)
      if (!locationId) {
        console.error('❌ Location missing - required for sale creation');
        setSnackbar({
          open: true,
          message: 'Location information is missing. Please ensure a POS session is open with a valid location.',
          severity: 'error',
          autoHideDuration: 10000
        });
        setLoading(false);
        return;
      }
      
      // Create sale transaction in the format expected by SaleCreateSerializer
      const saleData = {
        sale_type: saleType,
        customer: customer?.id || null,
        cashier: user?.id || currentSession?.operatorId || null,
        pos_session: currentSession?.id || null,
        location: locationId, // Include location explicitly (now guaranteed to be set)
        discount_percentage: discountPercentage,
        notes: transactionNotes || '',
        status: 'completed',
        items: cart.map(item => {
          // Validate item has required fields
          if (!item.id) {
            console.error('❌ Cart item missing product ID:', item);
            throw new Error(`Cart item "${item.name || 'Unknown'}" is missing product ID`);
          }
          if (!item.quantity || item.quantity <= 0) {
            console.error('❌ Cart item has invalid quantity:', item);
            throw new Error(`Cart item "${item.name || 'Unknown'}" has invalid quantity`);
          }
          if (!item.price && item.price !== 0) {
            console.error('❌ Cart item missing price:', item);
            throw new Error(`Cart item "${item.name || 'Unknown'}" is missing price`);
          }
          
          return {
            product: item.id,
            quantity: parseFloat(item.quantity) || 1,
            unit_price: parseFloat(item.price) || 0,
            discount_amount: parseFloat(item.discount || 0),
            tax_rate: parseFloat(item.tax_rate || businessRules.TAX_RATE?.number_value || 0)
          };
        }),
        payments: [{
          payment_method: validPaymentMethod, // Mapped to valid choices: 'cash', 'card', 'upi', 'wallet', 'cheque', 'credit'
          amount: parseFloat(amountPaid) || 0,
          status: 'completed', // Explicitly set status
          change_amount: parseFloat(change) || 0, // Write-only field, won't be stored
          ...(change > 0 && { notes: `Change: ${change.toFixed(2)}` }) // Optional notes for change
        }]
      };
      
      console.log('💳 Sale data prepared:', {
        ...saleData,
        items_count: saleData.items.length,
        location: locationId,
        cashier: saleData.cashier,
        payment_method_mapped: `${paymentMethod} → ${validPaymentMethod}`
      });
      
      // Log payment details for debugging
      console.log('💳 Payment details:', {
        original_method: paymentMethod,
        mapped_method: validPaymentMethod,
        amount: amountPaid,
        change: change,
        total: total
      });
      
      // Save sale using salesService with timeout protection
      console.log('💳 Processing payment with sale data:', saleData);
      
      // Add timeout protection for the API call (in addition to axios timeout)
      const PAYMENT_TIMEOUT = 35000; // 35 seconds (slightly more than axios timeout)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Payment request timed out. Please check your connection and try again.'));
        }, PAYMENT_TIMEOUT);
      });
      
      const savedSale = await Promise.race([
        salesService.create(saleData),
        timeoutPromise
      ]);
      
      console.log('✅ Sale created successfully:', savedSale);
      console.log('📋 Sale response structure:', {
        hasId: !!savedSale?.id,
        hasSaleNumber: !!savedSale?.sale_number,
        keys: savedSale ? Object.keys(savedSale) : [],
        id: savedSale?.id,
        sale_number: savedSale?.sale_number,
        fullResponse: savedSale
      });
      
      // Validate saved sale response - be more flexible with ID
      // The response might have id, sale_number, or both
      if (!savedSale) {
        throw new Error('Invalid sale response from server: No data returned');
      }
      
      // Extract ID from response - backend now returns full sale data with id and sale_number
      const saleId = savedSale.id || savedSale.sale_number;
      const saleNumber = savedSale.sale_number || savedSale.id;
      
      // Validate we have at least an ID or sale_number
      if (!saleId && !saleNumber) {
        console.error('❌ Critical: Sale response missing identifier. Full response:', JSON.stringify(savedSale, null, 2));
        throw new Error('Sale created but response missing identifier. Please contact support.');
      }
      
      // Store completed sale and change amount for bill preview
      // Backend now returns full sale data, so use it directly with fallbacks for safety
      const completedSaleData = {
        ...savedSale,
        // Ensure ID and sale_number are set
        id: saleId,
        sale_number: saleNumber,
        // Use backend values or fallback to local calculated values
        subtotal: savedSale.subtotal !== undefined ? savedSale.subtotal : subtotal,
        tax_amount: savedSale.tax_amount !== undefined ? savedSale.tax_amount : tax,
        discount_amount: savedSale.discount_amount !== undefined ? savedSale.discount_amount : discount,
        total_amount: savedSale.total_amount !== undefined ? savedSale.total_amount : total,
        // Use backend items if available, otherwise use cart data as fallback
        items: (savedSale.items && Array.isArray(savedSale.items) && savedSale.items.length > 0)
          ? savedSale.items
          : cart.map(item => ({
              id: item.id,
              product: savedSale.items?.[0]?.product || { 
                id: item.id, 
                name: item.name, 
                sku: item.sku 
              },
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
              line_total: item.price * item.quantity,
          total: item.price * item.quantity
        })),
        // Use backend payments if available, otherwise construct from payment data
        payments: (savedSale.payments && Array.isArray(savedSale.payments) && savedSale.payments.length > 0)
          ? savedSale.payments
          : [{
              payment_method: validPaymentMethod,
          amount: amountPaid,
              change_amount: change,
              status: 'completed'
        }],
        customer: savedSale.customer || customer,
        cashier: savedSale.cashier || user,
        // Ensure status is set
        status: savedSale.status || 'completed'
      };
      
      console.log('📦 Setting completed sale data:', completedSaleData);
      setCompletedSale(completedSaleData);
      setCompletedSaleChange(change);
      
      // Close payment dialog first
      setPaymentDialogOpen(false);
      
      // Clear cart immediately to prevent duplicate transactions
      setCart([]);
      setAmountPaid(0);
      setChange(0);
      
      // Small delay to ensure dialog closes before opening bill preview
      setTimeout(() => {
        console.log('📄 Opening bill preview dialog', {
          billPreviewOpen: true,
          completedSale: !!completedSaleData,
          saleId: completedSaleData.id
        });
        setBillPreviewOpen(true);
      }, 150);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Payment processed successfully! Sale #${completedSaleData.sale_number || completedSaleData.id}`,
        severity: 'success'
      });
      
    } catch (err) {
      console.error('❌ Payment processing error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        method: err.config?.method,
        requestData: err.config?.data,
        code: err.code,
        timeout: err.code === 'ECONNABORTED' || err.message?.includes('timeout')
      });
      
      // Log full error response for debugging
      if (err.response?.data) {
        console.error('📋 Full error response:', JSON.stringify(err.response.data, null, 2));
      }
      
      // Extract detailed error message
      let errorMessage = 'Failed to process payment';
      
      // Handle timeout errors specifically
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('timed out')) {
        errorMessage = 'Payment request timed out. Please check your internet connection and try again.';
      } else if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors.join(', ')
            : errorData.non_field_errors;
        } else {
          // Try to extract field-specific errors (handle nested objects/arrays)
          const fieldErrors = Object.entries(errorData)
            .filter(([key]) => key !== 'detail' && key !== 'message' && key !== 'error')
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(', ')}`;
              } else if (typeof value === 'object' && value !== null) {
                // Handle nested objects - convert to JSON string for readability
                try {
                  // If it's an array of objects, try to extract meaningful messages
                  if (Array.isArray(value)) {
                    const messages = value.map(v => {
                      if (typeof v === 'object') {
                        return Object.entries(v).map(([k, v]) => `${k}: ${v}`).join(', ');
                      }
                      return String(v);
                    });
                    return `${key}: ${messages.join('; ')}`;
                  } else {
                    // Single object - stringify it
                    return `${key}: ${JSON.stringify(value)}`;
                  }
                } catch (e) {
                  return `${key}: ${String(value)}`;
                }
              } else {
                return `${key}: ${String(value)}`;
              }
            })
            .join('; ');
          if (fieldErrors) {
            errorMessage = fieldErrors;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error('📋 Final error message:', errorMessage);
      
      setSnackbar({
        open: true,
        message: `Payment failed: ${errorMessage}`,
        severity: 'error',
        autoHideDuration: 10000
      });
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };
  
  // Handle return to POS billing (new mode)
  const handleReturnToPOS = () => {
    console.log('🔄 Returning to POS - resetting state');
    
    // Close bill preview dialog first
    setBillPreviewOpen(false);
    
    // Clear completed sale data
    setCompletedSale(null);
    setCompletedSaleChange(0);
    
    // Clear cart and reset to new mode
    setCart([]);
    setDiscount(0);
    setSubtotal(0);
    setTax(0);
    setTotal(0);
    setCustomer(null);
    setAmountPaid(0);
    setChange(0);
    setBillDiscountPercent(0);
    setTransactionNotes('');
    
    // Close any other open dialogs
    setPaymentDialogOpen(false);
    setTenderDialogOpen(false);
    setShowProductLookup(false);
    setShowCustomerLookup(false);
    
    // Reset item form
    setItemForm({
      itemCode: '',
      itemName: '',
      qty: '',
      rate: '',
      discount: '',
      netAmount: ''
    });
    
    // Clear scan input
    setScanInput('');
    setShowItemScan(false);
    
    console.log('✅ State reset complete - ready for new transaction');
    
    setSnackbar({
      open: true,
      message: 'Ready for new transaction',
      severity: 'info'
    });
    
    // Focus search for next transaction after a short delay
    setTimeout(() => {
      const scanInput = document.querySelector('#sub-section-1.1-item-scan input');
      if (scanInput) {
        scanInput.focus();
        console.log('✅ Focused on item scan input');
      } else {
        console.warn('⚠️ Item scan input not found');
      }
    }, 200);
  };
  
  // Handle print receipt
  const handlePrintReceipt = () => {
    const receiptContent = document.getElementById('bill-preview-content');
    
    if (!receiptContent) {
      window.print();
      return;
    }

    // Add print stylesheet if not already added
    let printStyleSheet = document.getElementById('receipt-print-style');
    if (!printStyleSheet) {
      printStyleSheet = document.createElement('style');
      printStyleSheet.id = 'receipt-print-style';
      printStyleSheet.innerHTML = `
              @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #bill-preview-content,
          #bill-preview-content * {
            visibility: visible;
          }
          #bill-preview-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            max-width: 80mm;
            margin: 0;
            padding: 8mm;
            background: white;
            box-shadow: none;
            border: none;
            border-radius: 0;
          }
          .MuiDialog-root,
          .MuiDialog-container,
          .MuiDialog-paper,
          .MuiDialogContent-root,
          .MuiDialogActions-root {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(printStyleSheet);
    }

    // Open print dialog directly
    window.print();
  };
  
  // Handle email receipt
  const handleEmailReceipt = async () => {
    if (!completedSale) return;
    
    const customerEmail = customer?.email || completedSale.customer?.email;
    
    if (!customerEmail) {
      setSnackbar({
        open: true,
        message: 'Customer email not available',
        severity: 'warning'
      });
      return;
    }
    
    try {
      // TODO: Implement email API endpoint
      // For now, show success message
      setSnackbar({
        open: true,
        message: `Receipt will be emailed to ${customerEmail}`,
        severity: 'info'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send email receipt',
        severity: 'error'
      });
    }
  };

  // POS Function Handlers
  const handleLineItemDiscount = () => {
    if (cart.length === 0) {
      setSnackbar({ open: true, message: 'Cart is empty', severity: 'warning' });
      return;
    }
    if (cart.length === 1) {
      setSelectedCartItem(cart[0]);
      setLineItemDiscountDialogOpen(true);
    } else {
      // If multiple items, show selection dialog or select first
      setSelectedCartItem(cart[0]);
      setLineItemDiscountDialogOpen(true);
    }
  };

  const handleBillDiscount = () => {
    setBillDiscountDialogOpen(true);
  };

  const handlePriceChange = () => {
    if (cart.length === 0) {
      setSnackbar({ open: true, message: 'Cart is empty', severity: 'warning' });
      return;
    }
    if (cart.length === 1) {
      setSelectedCartItem(cart[0]);
      setPriceChangeDialogOpen(true);
    } else {
      setSelectedCartItem(cart[0]);
      setPriceChangeDialogOpen(true);
    }
  };

  const handleQuantityChange = () => {
    if (cart.length === 0) {
      setSnackbar({ open: true, message: 'Cart is empty', severity: 'warning' });
      return;
    }
    if (cart.length === 1) {
      setSelectedCartItem(cart[0]);
      setQuantityChangeDialogOpen(true);
    } else {
      setSelectedCartItem(cart[0]);
      setQuantityChangeDialogOpen(true);
    }
  };

  const handleTaxOverride = () => {
    setTaxOverrideDialogOpen(true);
  };

  const handleNotes = () => {
    setNotesDialogOpen(true);
  };

  const handleRefund = async () => {
    setRefundDialogOpen(true);
  };

  const handleSuspend = async () => {
    if (cart.length === 0) {
      setSnackbar({ open: true, message: 'Cart is empty', severity: 'warning' });
      return;
    }
    try {
      setLoading(true);
      const saleData = {
        pos_session: currentSession?.id,
        sale_type: saleType || 'cash',
        cashier: user?.id,
        customer: customer?.id || null,
        status: 'draft',
        discount_percentage: billDiscountPercent,
        notes: transactionNotes,
        items: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          unit_price: item.price || 0,
          discount_amount: item.discount || 0,
          tax_rate: item.tax_rate || 0
        }))
      };
      
      await salesService.create(saleData);
      setSnackbar({ open: true, message: 'Transaction suspended successfully', severity: 'success' });
      setCart([]);
      setCustomer(null);
      setBillDiscountPercent(0);
      setTransactionNotes('');
      setSuspendDialogOpen(false);
    } catch (error) {
      console.error('Error suspending transaction:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.detail || 'Failed to suspend transaction', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setLoading(true);
      const suspended = await salesService.getSuspended();
      setSuspendedSales(suspended);
      setResumeDialogOpen(true);
    } catch (error) {
      console.error('Error loading suspended sales:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to load suspended sales', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resumeSale = async (saleId) => {
    try {
      setLoading(true);
      const saleData = await salesService.resume(saleId);
      
      // Restore cart from sale items
      if (saleData.items && saleData.items.length > 0) {
        const restoredCart = saleData.items.map(item => ({
          id: item.product?.id || item.product,
          name: item.product?.name || 'Unknown',
          price: parseFloat(item.unit_price || 0),
          quantity: parseFloat(item.quantity || 0),
          discount: parseFloat(item.discount_amount || 0),
          tax_rate: parseFloat(item.tax_rate || 0),
          lineTotal: parseFloat(item.total || 0)
        }));
        setCart(restoredCart);
      }
      
      // Restore customer
      if (saleData.customer) {
        setCustomer(saleData.customer);
      }
      
      // Restore discount and notes
      if (saleData.discount_percentage) {
        setBillDiscountPercent(parseFloat(saleData.discount_percentage));
      }
      if (saleData.notes) {
        setTransactionNotes(saleData.notes);
      }
      
      setSnackbar({ open: true, message: 'Sale resumed successfully', severity: 'success' });
      setResumeDialogOpen(false);
    } catch (error) {
      console.error('Error resuming sale:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.detail || 'Failed to resume sale', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExchange = () => {
    setExchangeDialogOpen(true);
  };

  const handleReprint = async () => {
    try {
      const response = await api.get('/sales/', {
        params: {
          ordering: '-sale_date',
          page_size: 1
        }
      });
      const sales = response.data.results || response.data || [];
      if (sales.length > 0) {
        setSnackbar({ open: true, message: `Reprinting receipt: ${sales[0].sale_number}`, severity: 'info' });
        // TODO: Implement actual print functionality
        window.print();
      } else {
        setSnackbar({ open: true, message: 'No recent sale to reprint', severity: 'warning' });
      }
    } catch (error) {
      console.error('Error loading last sale:', error);
      setSnackbar({ open: true, message: 'Failed to load last sale', severity: 'error' });
    }
  };

  const handleVoid = () => {
    if (cart.length === 0) {
      setSnackbar({ open: true, message: 'Cart is empty', severity: 'warning' });
      return;
    }
    if (window.confirm('Void current transaction? This will clear the cart.')) {
      setCart([]);
      setCustomer(null);
      setBillDiscountPercent(0);
      setTransactionNotes('');
      setSnackbar({ open: true, message: 'Transaction voided', severity: 'info' });
    }
  };

  const handleBillQuery = () => {
    setBillQueryDialogOpen(true);
  };

  const handleSettlement = () => {
    setSettlementDialogOpen(true);
  };

  const handleForceQuit = () => {
    setForceQuitDialogOpen(true);
  };

  const confirmForceQuit = () => {
    // Clear all state
    setCart([]);
    setCustomer(null);
    setBillDiscountPercent(0);
    setTransactionNotes('');
    setAmountPaid(0);
    setChange(0);
    setScanInput('');
    setShowItemScan(false);
    setShowProductLookup(false);
    
    // Close all dialogs
    setLineItemDiscountDialogOpen(false);
    setBillDiscountDialogOpen(false);
    setPriceChangeDialogOpen(false);
    setQuantityChangeDialogOpen(false);
    setTaxOverrideDialogOpen(false);
    setNotesDialogOpen(false);
    setRefundDialogOpen(false);
    setSuspendDialogOpen(false);
    setResumeDialogOpen(false);
    setExchangeDialogOpen(false);
    setReprintDialogOpen(false);
    setBillQueryDialogOpen(false);
    setSettlementDialogOpen(false);
    setTenderDialogOpen(false);
    setPaymentDialogOpen(false);
    setForceQuitDialogOpen(false);
    
    // Navigate to home
    navigate('/');
    
    setSnackbar({ 
      open: true, 
      message: 'Force quit completed. Returned to home.', 
      severity: 'info' 
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Allow F-keys and Escape to work even in input fields
      // Only block other shortcuts when typing in inputs
      const isInputField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      const isFunctionKey = e.key.startsWith('F') || e.key === 'Escape';
      
      if (isInputField && !isFunctionKey) {
        return;
      }
      
      // Function Keys
      if (e.key.startsWith('F') && !e.altKey && !e.ctrlKey) {
        const fKey = parseInt(e.key.substring(1));
        const functionCode = `F${fKey}`;
        e.preventDefault();
        
        // Check permission (fail-open during loading)
        if (!canExecuteFunction(functionCode)) {
          setSnackbar({
            open: true,
            message: `You don't have permission to use ${functionCode}`,
            severity: 'warning'
          });
          return;
        }
        
        // Check if requires approval
        if (requiresApproval(functionCode)) {
          setSnackbar({
            open: true,
            message: `${functionCode} requires approval. Please contact your supervisor.`,
            severity: 'info'
          });
          // Still allow execution but log for audit
          // TODO: Implement approval workflow
        }
        
        switch (fKey) {
          case 1: // F1 - Customer
            console.log('🔍 F1 pressed - opening customer lookup');
            setShowCustomerLookup(true);
            setShowProductLookup(false); // Ensure product lookup is closed
            break;
          case 2: // F2 - Product Lookup
            setShowProductLookup(true);
            break;
          case 3: // F3 - Line Item Discount
            handleLineItemDiscount();
            break;
          case 4: // F4 - Bill Discount
            handleBillDiscount();
            break;
          case 5: // F5 - Cancel
            if (window.confirm('Cancel current transaction?')) {
              setCart([]);
              setItemForm({
                itemCode: '',
                itemName: '',
                qty: '',
                rate: '',
                discount: '',
                netAmount: ''
              });
            }
            break;
          case 6: // F6 - Tender
            if (cart.length > 0) {
              setTenderDialogOpen(true);
            }
            break;
          case 7: // F7 - Price Change
            handlePriceChange();
            break;
          case 8: // F8 - Qty Change
            handleQuantityChange();
            break;
          case 9: // F9 - Clear
            if (window.confirm('Clear entire cart?')) {
              setCart([]);
              setItemForm({
                itemCode: '',
                itemName: '',
                qty: '',
                rate: '',
                discount: '',
                netAmount: ''
              });
            }
            break;
          case 10: // F10 - Item Scan (Toggle)
            setShowItemScan(prev => !prev);
            break;
          case 11: // F11 - Notes
            handleNotes();
            break;
          case 12: // F12 - Refund
            handleRefund();
            break;
        }
      }
      
      // Alt Function Keys
      if (e.altKey && e.key.startsWith('F')) {
        const fKey = parseInt(e.key.substring(1));
        const functionCode = `ALT_F${fKey}`;
        e.preventDefault();
        
        // Check permission (fail-open during loading)
        if (!canExecuteFunction(functionCode)) {
          setSnackbar({
            open: true,
            message: `You don't have permission to use ${functionCode}`,
            severity: 'warning'
          });
          return;
        }
        
        // Check if requires approval
        if (requiresApproval(functionCode)) {
          setSnackbar({
            open: true,
            message: `${functionCode} requires approval. Please contact your supervisor.`,
            severity: 'info'
          });
        }
        
        switch (fKey) {
          case 1: // Alt F1 - Add Item
            setShowProductLookup(true);
            break;
          case 3: // Alt F3 - Suspend
            handleSuspend();
            break;
          case 4: // Alt F4 - Resume
            handleResume();
            break;
          case 5: // Alt F5 - Exchange
            handleExchange();
            break;
        }
      }
      
      // Ctrl Function Keys
      if (e.ctrlKey && e.key.startsWith('F')) {
        const fKey = parseInt(e.key.substring(1));
        const functionCode = `CTRL_F${fKey}`;
        e.preventDefault();
        
        // Check permission (fail-open during loading)
        if (!canExecuteFunction(functionCode)) {
          setSnackbar({
            open: true,
            message: `You don't have permission to use ${functionCode}`,
            severity: 'warning'
          });
          return;
        }
        
        // Check if requires approval
        if (requiresApproval(functionCode)) {
          setSnackbar({
            open: true,
            message: `${functionCode} requires approval. Please contact your supervisor.`,
            severity: 'info'
          });
        }
        
        switch (fKey) {
          case 1: // Ctrl F1 - Reprint
            handleReprint();
            break;
          case 2: // Ctrl F2 - Void
            handleVoid();
            break;
          case 3: // Ctrl F3 - Bill Query
            handleBillQuery();
            break;
          case 4: // Ctrl F4 - Close/Settlement
            handleSettlement();
            break;
          case 5: // Ctrl F5 - Force Quit
            handleForceQuit();
            break;
        }
      }
      
      // Toggle identifiers with Ctrl+I
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        setShowIdentifiers(prev => !prev);
      }
      
      // Escape key - close dialogs
      if (e.key === 'Escape') {
        e.preventDefault();
        setPaymentDialogOpen(false);
        setShowCustomerLookup(false);
        setLineItemDiscountDialogOpen(false);
        setBillDiscountDialogOpen(false);
        setPriceChangeDialogOpen(false);
        setQuantityChangeDialogOpen(false);
        setTaxOverrideDialogOpen(false);
        setNotesDialogOpen(false);
        setRefundDialogOpen(false);
        setSuspendDialogOpen(false);
        setResumeDialogOpen(false);
        setExchangeDialogOpen(false);
        setReprintDialogOpen(false);
        setBillQueryDialogOpen(false);
        setSettlementDialogOpen(false);
        setForceQuitDialogOpen(false);
        setShowProductLookup(false);
        setShowCustomerLookup(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cart, currentSession, user, customer, billDiscountPercent, transactionNotes]);

  // Load customers when lookup opens
  useEffect(() => {
    if (showCustomerLookup) {
      console.log('🔍 Customer lookup opened - loading customers');
      loadCustomers();
    } else {
      // Reset search term when closed
      setCustomerSearchTerm('');
    }
  }, [showCustomerLookup]);
  
  // Debounce search term changes for API calls
  useEffect(() => {
    if (showCustomerLookup && customerSearchTerm) {
      const timeoutId = setTimeout(() => {
        loadCustomers();
      }, 300); // Debounce 300ms
      return () => clearTimeout(timeoutId);
    }
  }, [customerSearchTerm]);

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      console.log('📞 Loading customers...', { customerSearchTerm });
      
      const params = {
        is_active: true,
        page_size: 100, // Increased to get more customers
      };
      
      // Use search parameter if search term exists
      if (customerSearchTerm && customerSearchTerm.trim()) {
        params.search = customerSearchTerm.trim();
      }

      console.log('📞 Calling customerService.getCustomers with params:', params);
      const response = await customerService.getCustomers(params);
      console.log('✅ Customer service response:', response);
      
      // Handle different response formats
      let customerList = [];
      if (response) {
        if (Array.isArray(response)) {
          customerList = response;
        } else if (response.results && Array.isArray(response.results)) {
          customerList = response.results;
        } else if (response.data) {
          customerList = Array.isArray(response.data) ? response.data : (response.data.results || []);
        }
      }
      
      console.log(`✅ Loaded ${customerList.length} customers:`, customerList);
      setCustomers(customerList);
      
      if (customerList.length === 0 && !customerSearchTerm) {
        console.warn('⚠️ No customers found. Make sure customers exist in the system.');
      }
    } catch (error) {
      console.error('❌ Error loading customers:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setCustomers([]);
      setSnackbar({
        open: true,
        message: `Failed to load customers: ${error.message || 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerSelect = (selectedCustomer) => {
    setCustomer(selectedCustomer);
    setShowCustomerLookup(false);
    setCustomerSearchTerm('');
  };

  // Filter customers based on search term (client-side filtering for better UX)
  const filteredCustomers = React.useMemo(() => {
    if (!customerSearchTerm || !customerSearchTerm.trim()) {
      // Return all customers if no search term
      console.log(`🔍 No search term - showing all ${customers.length} customers`);
      return customers;
    }
    
    const searchLower = customerSearchTerm.toLowerCase().trim();
    console.log(`🔍 Filtering ${customers.length} customers with search term: "${searchLower}"`);
    
    const filtered = customers.filter(cust => {
      if (!cust) return false;
      
      // Check various fields
      const matchesFirstName = cust.first_name && cust.first_name.toLowerCase().includes(searchLower);
      const matchesLastName = cust.last_name && cust.last_name.toLowerCase().includes(searchLower);
      const matchesFullName = cust.full_name && cust.full_name.toLowerCase().includes(searchLower);
      const matchesCompanyName = cust.company_name && cust.company_name.toLowerCase().includes(searchLower);
      const matchesPhone = cust.phone && cust.phone.includes(customerSearchTerm);
      const matchesEmail = cust.email && cust.email.toLowerCase().includes(searchLower);
      const matchesCustomerCode = cust.customer_code && cust.customer_code.toLowerCase().includes(searchLower);
      
      return matchesFirstName || matchesLastName || matchesFullName || matchesCompanyName || 
             matchesPhone || matchesEmail || matchesCustomerCode;
    });
    
    console.log(`✅ Filtered to ${filtered.length} customers`);
    return filtered;
  }, [customers, customerSearchTerm]);

  // Show loading state (only during initial load, not after timeout)
  if (loading && !sessionReady && !error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: '#f5f5f5'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Initializing POS System...</Typography>
        <Typography variant="body2" color="text.secondary">
          Loading session and system data...
        </Typography>
      </Box>
    );
  }

  // Show error state or no session state
  // Always show something - never return null or empty
  if (error || !sessionReady || !currentSession) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        p: 3,
        backgroundColor: '#f5f5f5'
      }}>
        <Alert 
          severity={error ? "error" : "warning"} 
          sx={{ mb: 3, maxWidth: 600 }}
        >
          <Typography variant="h6" gutterBottom>
            {error ? 'POS Initialization Error' : 'Session Required'}
          </Typography>
          <Typography variant="body2">
            {error || 'No active session found. Please start a session first.'}
          </Typography>
        </Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/pos/session-open')}
            sx={{ px: 4 }}
          >
            Open Session
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => window.location.reload()}
            sx={{ px: 4 }}
          >
            Retry / Refresh
          </Button>
        </Box>
        {error && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" component="div">
              If this error persists, please check:
            </Typography>
            <Box component="ul" sx={{ mt: 1, textAlign: 'left', pl: 2 }}>
              <li>Backend server is running on http://localhost:8000</li>
              <li>You are logged in with a valid account</li>
              <li>Network connectivity is working</li>
              <li>Check browser console (F12) for detailed error logs</li>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* ============================================
          SECTION 1: TOP BAR / HEADER SECTION
          ============================================ */}
      <Paper 
        sx={{ 
          p: 2, 
          backgroundColor: '#2C3E50',
          color: 'white',
          borderRadius: 0,
          boxShadow: 2,
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}
        id="section-1-top-bar"
      >
        {showIdentifiers && (
          <Typography 
            variant="h6" 
            sx={{ 
              position: 'absolute',
              left: 8,
              top: 8,
              fontSize: '1.5rem',
              fontWeight: 500,
              lineHeight: 1,
              color: '#666',
              pointerEvents: 'none'
            }}
          >
            1
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CustomerIcon />}
            onClick={() => setShowCustomerLookup(true)}
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {customer ? customer.full_name || customer.first_name : 'Select Customer'}
          </Button>
          
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {currentTime.toLocaleTimeString()}
          </Typography>
        </Box>
      </Paper>

      {/* ============================================
          SECTION 2: MAIN CONTENT AREA
          ============================================ */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden', 
        gap: 1, 
        p: 1,
        minHeight: 0,
        position: 'relative'
      }}
      id="section-2-main-content"
      >
        
        {/* ============================================
            PANEL 2.1: LEFT PANEL (Product Area)
            ============================================ */}
        <Paper 
          sx={{ 
            width: '70%', 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 0,
            backgroundColor: '#ffffff',
            position: 'relative'
          }}
          id="panel-2.1-left-product-area"
        >
          {showIdentifiers && (
            <Typography 
              variant="h6" 
              sx={{ 
                position: 'absolute',
                left: 8,
                top: 8,
                fontSize: '1.5rem',
                fontWeight: 500,
                lineHeight: 1,
                color: '#666',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            >
              1
            </Typography>
          )}
          {/* Cart Items List (100%) */}
          <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0, position: 'relative' }} id="sub-section-cart-items-list">
            <TableContainer sx={{ height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {showIdentifiers && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    position: 'absolute',
                    left: 8,
                    top: 60,
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    lineHeight: 1,
                    color: '#666',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}
                >
                  1
                </Typography>
              )}
              {/* Cart Header similar to 2.2.1 */}
              <Box 
                sx={{ 
                  p: 1.5,
                  backgroundColor: '#1976d2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #1565C0'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                  <CartIcon sx={{ color: 'white' }} />
                  <Box component="span" sx={{ color: 'white' }}>Cart Items</Box>
                  {cart.length > 0 && (
                    <Chip 
                      label={cart.length} 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                  )}
                </Typography>
                {cart.length > 0 && (
                  <IconButton 
                    size="small" 
                    onClick={() => setCart([])}
                    sx={{ color: 'white' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, backgroundColor: '#f5f5f5', position: 'relative' }}>
                        Item Code
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, backgroundColor: '#f5f5f5' }}>Item Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, backgroundColor: '#f5f5f5' }}>Qty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, backgroundColor: '#f5f5f5' }}>Rate</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, backgroundColor: '#f5f5f5' }}>Discount</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, backgroundColor: '#f5f5f5' }}>Net Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Typography variant="body2" color="text.secondary">
                            No items added. Use product lookup to add items.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cart.map((item) => {
                        const discountAmount = (item.price * item.quantity * (item.discount || 0)) / 100;
                        const netAmount = (item.price * item.quantity) - discountAmount;
                        return (
                          <TableRow key={item.id} hover>
                            <TableCell>{item.sku || item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                            <TableCell align="right">
                              {item.discount ? `${item.discount}%` : '-'}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(netAmount)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          </Box>
          
          {/* Sub-section 1.1 - Item Scan / Barcode Entry (Toggleable) */}
          {showItemScan && (
            <Box 
              sx={{ 
                p: 1.5,
                borderTop: '2px solid #1976d2',
                backgroundColor: '#e3f2fd',
                position: 'relative',
                minHeight: '80px'
              }}
              id="sub-section-1.1-item-scan"
            >
              {showIdentifiers && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    position: 'absolute',
                    left: 8,
                    top: 8,
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    lineHeight: 1,
                    color: '#666',
                    pointerEvents: 'none'
                  }}
                >
                  1.1
                </Typography>
              )}
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Scan Barcode or Enter Item Code..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const value = scanInput.trim();
                    if (value) {
                      // Search for product by barcode or SKU
                      const foundProduct = products.find(p => 
                        p.barcode === value || 
                        p.sku === value ||
                        String(p.id) === value
                      );
                      if (foundProduct) {
                        addToCart(foundProduct);
                        setScanInput('');
                        setSnackbar({ 
                          open: true, 
                          message: `Added: ${foundProduct.name}`, 
                          severity: 'success' 
                        });
                      } else {
                        setSnackbar({ 
                          open: true, 
                          message: `Product not found: ${value}`, 
                          severity: 'warning' 
                        });
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    fontWeight: 500
                  }
                }}
              />
            </Box>
          )}
        </Paper>

        {/* ============================================
            PANEL 2.2: RIGHT PANEL (Transaction Area)
            ============================================ */}
        <Paper 
          sx={{ 
            width: '30%', 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 0,
            position: 'relative'
          }}
          id="panel-2.2-right-transaction-area"
        >
          {showIdentifiers && (
            <Typography 
              variant="h6" 
              sx={{ 
                position: 'absolute',
                left: 8,
                top: 8,
                fontSize: '1.5rem',
                fontWeight: 500,
                lineHeight: 1,
                color: '#666',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            >
              2
            </Typography>
          )}
          {showCustomerLookup ? (
            /* Customer Lookup View */
            <>
              {/* Sub-section 2.1: Customer Lookup Header */}
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#1976d2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                id="sub-section-2.1-customer-lookup-header"
              >
                {showIdentifiers && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      left: 8,
                      top: 4,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#666',
                      pointerEvents: 'none'
                    }}
                  >
                    2.2.1
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CustomerIcon />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Customer Lookup
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => setShowCustomerLookup(false)}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Sub-section 2.2: Customer Search & List */}
              <Box 
                sx={{ 
                  flex: 1, 
                  overflow: 'hidden', 
                  p: 2,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  minHeight: 0,
                  position: 'relative'
                }}
                id="sub-section-2.2-customer-search-list"
              >
                {showIdentifiers && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      left: 8,
                      top: 8,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#666',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}
                  >
                    2.2.2
                  </Typography>
                )}
                {/* Search Bar */}
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by name, phone, email, code..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: customerSearchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setCustomerSearchTerm('');
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                />

                {/* Customer List */}
                <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                  {loadingCustomers ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {/* Walk-in Customer - Always First */}
                      <ListItem
                        button
                        onClick={() => handleCustomerSelect(null)}
                        sx={{
                          border: '1px solid #1976d2',
                          borderRadius: 0,
                          mb: 1,
                          backgroundColor: customer === null ? '#e3f2fd' : 'white',
                          '&:hover': {
                            backgroundColor: '#e3f2fd',
                            borderColor: '#1976d2'
                          }
                        }}
                      >
                        <ListItemText
                          primary="Walk-in Customer"
                          primaryTypographyProps={{
                            variant: 'subtitle2',
                            sx: { fontWeight: 600, color: '#1976d2' }
                          }}
                          secondary="No customer assigned"
                          secondaryTypographyProps={{
                            variant: 'caption',
                            color: 'text.secondary'
                          }}
                        />
                        {customer === null && (
                          <ListItemSecondaryAction>
                            <CheckIcon color="primary" />
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                      
                      {/* Actual Customers */}
                      {filteredCustomers.length === 0 ? (
                        <Box sx={{ 
                          textAlign: 'center', 
                          py: 4,
                          color: 'text.secondary'
                        }}>
                          <CustomerIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {customerSearchTerm ? `No customers found matching "${customerSearchTerm}"` : 'No customers available'}
                          </Typography>
                          {!customerSearchTerm && (
                            <Typography variant="caption" color="text.secondary">
                              Total customers loaded: {customers.length}
                            </Typography>
                          )}
                          {loadingCustomers && (
                            <CircularProgress size={24} sx={{ mt: 2 }} />
                          )}
                        </Box>
                      ) : (
                        filteredCustomers.map((cust) => (
                          <ListItem
                            key={cust.id}
                            button
                            onClick={() => handleCustomerSelect(cust)}
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: 0,
                              mb: 1,
                              backgroundColor: customer?.id === cust.id ? '#e3f2fd' : 'white',
                              '&:hover': {
                                backgroundColor: '#f5f5f5',
                                borderColor: '#1976d2'
                              }
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }} component="span">
                                  {cust.first_name} {cust.last_name}
                                  {cust.company_name && ` (${cust.company_name})`}
                                </Typography>
                                {cust.is_vip && (
                                  <Chip label="VIP" size="small" color="warning" />
                                )}
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                {cust.phone && (
                                  <Typography variant="caption" color="text.secondary" component="span">
                                    Phone: {cust.phone}
                                  </Typography>
                                )}
                                {cust.email && (
                                  <Typography variant="caption" color="text.secondary" component="span">
                                    Email: {cust.email}
                                  </Typography>
                                )}
                                {cust.customer_code && (
                                  <Typography variant="caption" color="text.secondary" component="span">
                                    Code: {cust.customer_code}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            {customer?.id === cust.id && (
                              <ListItemSecondaryAction>
                                <CheckIcon color="primary" />
                              </ListItemSecondaryAction>
                            )}
                          </ListItem>
                        ))
                      )}
                    </List>
                  )}
                </Box>
              </Box>
            </>
          ) : showProductLookup ? (
            /* Product Lookup View */
            <>
              {/* Sub-section 2.1: Product Lookup Header */}
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#1976d2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                id="sub-section-2.1-product-lookup-header"
              >
                {showIdentifiers && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      left: 8,
                      top: 4,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#666',
                      pointerEvents: 'none'
                    }}
                  >
                    2.2.1
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Product Lookup
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => setShowProductLookup(false)}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Sub-section 2.2: Product Search & List */}
              <Box 
                sx={{ 
                  flex: 1, 
                  overflow: 'hidden', 
                  p: 2,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  minHeight: 0,
                  position: 'relative'
                }}
                id="sub-section-2.2-product-search-list"
              >
                {showIdentifiers && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      left: 8,
                      top: 8,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#666',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}
                  >
                    2.2.2
                  </Typography>
                )}
                {/* Search Bar */}
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by name, SKU, barcode..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
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
                          onClick={() => {
                            setSearchQuery('');
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                />

                {/* Product List */}
                <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : filteredProducts.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: 'text.secondary'
                    }}>
                      <InventoryIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                      <Typography variant="body2">
                        {searchQuery ? 'No products found' : 'No products available'}
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {filteredProducts.map((product) => (
                      <ListItem
                        key={product.id}
                        button
                        onClick={() => {
                          addToCart(product);
                          setShowProductLookup(false);
                        }}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 0,
                          mb: 1,
                          backgroundColor: 'white',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            borderColor: '#1976d2'
                          }
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }} component="div">
                            {product.name}
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" component="span">
                              SKU: {product.sku} | Stock: {product.stock_quantity || 0}
                            </Typography>
                            <Typography variant="h6" color="primary" component="div" sx={{ mt: 0.5 }}>
                              ₹{parseFloat(product.price || 0).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                              setShowProductLookup(false);
                            }}
                            color="primary"
                          >
                            <AddIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Box>
            </>
          ) : (
            /* Cart View */
            <>
              {/* Terminal and Session Details Section */}
              {currentSession && (
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#f5f5f5',
                    position: 'relative'
                  }}
                  id="sub-section-terminal-session"
                >
                  {/* Terminal Details */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75, pb: 0.75, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Terminal:</Typography>
                    <Chip 
                      label={(() => {
                        // Simple: Use system_name from terminal data if available
                        if (currentTerminal?.system_name) {
                          return currentTerminal.system_name;
                        }
                        
                        // Fallback: Use terminal name if system_name not available
                        if (currentTerminal?.name) {
                          return currentTerminal.name;
                        }
                        
                        // Fallback: Show terminal code
                        if (currentTerminal?.terminal_code) {
                          return currentTerminal.terminal_code;
                        }
                        
                        // Fallback: Show loading if session exists but terminal not loaded yet
                        if (currentSession) {
                          return 'Loading...';
                        }
                        
                        return 'N/A';
                      })()}
                      size="small"
                      sx={{ 
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontWeight: 600,
                        height: 20,
                        fontSize: '0.7rem',
                        '& .MuiChip-label': { px: 0.75 }
                      }}
                    />
                  </Box>
                  {/* Session Details */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Session:</Typography>
                    <Chip 
                      label={`#${currentSession.session_number || currentSession.id}`}
                      size="small"
                      sx={{ 
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontWeight: 600,
                        height: 20,
                        fontSize: '0.7rem',
                        '& .MuiChip-label': { px: 0.75 }
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Sale Type Section */}
              <Box 
                sx={{ 
                  p: 1.5, 
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#f5f5f5',
                  position: 'relative'
                }}
                id="sub-section-sale-type"
              >
                {showIdentifiers && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      left: 8,
                      top: 2,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#666',
                      pointerEvents: 'none'
                    }}
                  >
                    2
                  </Typography>
                )}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Sale Type:</Typography>
                  </Box>
                  <FormControl fullWidth size="small">
                    <Select
                      value={saleType}
                      onChange={(e) => setSaleType(e.target.value)}
                      sx={{ fontSize: '0.875rem' }}
                      displayEmpty
                    >
                      {saleTypes.map((st) => (
                        <MenuItem key={st.code} value={st.code}>
                          {st.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Customer Details */}
              <Box 
                sx={{ 
                  p: 1.5, 
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#e3f2fd',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
                id="sub-section-customer-details"
              >
                {showIdentifiers && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      left: 8,
                      top: 2,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#666',
                      pointerEvents: 'none'
                    }}
                  >
                    3
                  </Typography>
                )}
                {/* Customer Icon */}
                <CustomerIcon sx={{ color: '#1976d2', fontSize: '1.5rem' }} />
                
                <Box sx={{ flex: 1 }}>
                  {customer ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Customer:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                          {customer.first_name && customer.last_name 
                            ? `${customer.first_name} ${customer.last_name}`.trim()
                            : customer.company_name || customer.name || 'Walk-in Customer'}
                        </Typography>
                      </Box>
                      {customer.phone && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Phone:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                            {customer.phone}
                          </Typography>
                        </Box>
                      )}
                      {customer.email && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Email:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                            {customer.email}
                          </Typography>
                        </Box>
                      )}
                      {customer.customer_code && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Code:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                            {customer.customer_code}
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center' }}>
                      No customer selected
                    </Typography>
                  )}
                </Box>
                
                {/* Search Icon (Lens) */}
                <IconButton
                  size="small"
                  onClick={() => setShowCustomerLookup(true)}
                  sx={{ 
                    color: '#1976d2',
                    '&:hover': { 
                      backgroundColor: 'rgba(25, 118, 210, 0.1)' 
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>

              {/* Sub-section 2.2: Totals Section */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#fafafa',
                  position: 'relative'
                }}
                id="sub-section-2.2-totals"
              >
                {showIdentifiers && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      left: 8,
                      top: 4,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#666',
                      pointerEvents: 'none'
                    }}
                  >
                    4
                  </Typography>
                )}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Last Bill Number:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {lastBillNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Last Bill Amount:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {formatCurrency(lastBillAmount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Total Items:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {cart.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Total Qty:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Sub Total:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {formatCurrency(subtotal)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Other Charges:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {formatCurrency(otherCharges)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Discount:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: discount > 0 ? 'error.main' : 'text.secondary', fontSize: '0.8rem' }}>
                      {discount > 0 ? '-' : ''}{formatCurrency(discount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Tax:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem', color: tax > 0 ? 'inherit' : 'text.secondary' }}>
                      {formatCurrency(tax)}
                    </Typography>
                  </Box>
                  {returnAmount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Return Amount:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'error.main', fontSize: '0.8rem' }}>
                        -{formatCurrency(returnAmount)}
                      </Typography>
                    </Box>
                  )}
                  {roundOff !== 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Round off:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                        {formatCurrency(roundOff)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                    p: 1.5,
                    borderRadius: 1
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {formatCurrency(total)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Sub-section 2.2.1: POS Functions - Alt & Ctrl Buttons (Identifier 5 - Now Empty, buttons moved to identifier 6) */}
              <Box 
                sx={{ 
                  px: 1.5,
                  pt: 1.5,
                  pb: 1.5,
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#fafafa',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  minHeight: '60px'
                }}
                id="sub-section-2.2.1-pos-functions-alt-ctrl-merged"
              >
                {showIdentifiers && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      left: 8,
                      top: 4,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: '#666',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                    >
                    5
                  </Typography>
                )}
                {/* This section is intentionally left empty - buttons moved to identifier 6 with scroll functionality */}
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* ============================================
          SECTION 3: BOTTOM BAR / POS FUNCTIONS F1-F12 (Identifier 6)
          ============================================ */}
      <Paper 
        sx={{ 
          p: 1, 
          pt: 0.75,
          backgroundColor: '#f5f5f5',
          color: '#212121',
          borderRadius: 0,
          minHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          mt: -0.25
        }}
        id="section-3-status-bar"
      >
        {showIdentifiers && (
          <Typography 
            variant="h6" 
            sx={{ 
              position: 'absolute',
              left: 8,
              top: 8,
              fontSize: '1.5rem',
              fontWeight: 500,
              lineHeight: 1,
              color: '#666',
              pointerEvents: 'none',
                      zIndex: 1,
              backgroundColor: '#f5f5f5',
              padding: '2px 4px',
              borderRadius: '4px'
                    }}
                  >
            6
                  </Typography>
                )}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          width: '100%',
          ml: showIdentifiers ? '40px' : 0,
          mr: showIdentifiers ? 0 : 0,
          gap: 0.5
        }}>
          {/* Left Scroll Arrow - Double Chevron */}
          <IconButton
            onClick={() => setButtonScrollIndex(Math.max(0, buttonScrollIndex - 12))}
            disabled={buttonScrollIndex === 0}
            sx={{
              minWidth: '40px',
              width: '40px',
              height: '44px',
              backgroundColor: '#e0e0e0',
              '&:hover': { backgroundColor: '#d0d0d0' },
              '&:disabled': { backgroundColor: '#f5f5f5', opacity: 0.5 }
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                width: '2.2rem', 
                height: '2.2rem',
                stroke: '#212121',
                strokeWidth: '3.5',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                fill: 'none'
              }}
            >
              <path d="M11 18l-6.5-5.5 6.5-5.5" style={{ strokeWidth: '4.5' }} />
              <path d="M17 17l-4-4 4-4" style={{ strokeWidth: '3', transform: 'translateX(1px)' }} />
            </svg>
          </IconButton>

          {/* Scrollable Button Container */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            flex: 1,
            overflow: 'hidden'
          }}>
            {/* F1-F12 Buttons - Shown when scrollIndex is 0 */}
            {buttonScrollIndex === 0 && (
              <>
            {/* F1 - Customer */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          console.log('🔍 F1 Customer button clicked - opening customer lookup');
                          setShowCustomerLookup(true);
                        }}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#9C27B0',
                          '&:hover': { backgroundColor: '#7b1fa2' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F1</span>
            <span>Customer</span>
                      </Button>

          {/* F2 - Product Lookup */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setShowProductLookup(true);
                        }}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#2196F3',
                          '&:hover': { backgroundColor: '#1976d2' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F2</span>
            <span>Product Lookup</span>
                      </Button>

          {/* F3 - Line Item Discount */}
                      <Tooltip title={isFunctionDisabled('F3') ? 'You don\'t have permission to use this function' : ''}>
            <span>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleLineItemDiscount}
                            disabled={isFunctionDisabled('F3')}
                            sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                              backgroundColor: '#2196F3',
                              '&:hover': { backgroundColor: '#1976d2' },
                              '&:disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' },
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5,
                              whiteSpace: 'nowrap',
                  borderRadius: '6px'
                            }}
                          >
                            <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F3</span>
                <span>Line Item Discount</span>
                          </Button>
                        </span>
                      </Tooltip>
                    
          {/* F4 - Bill Discount */}
                      <Tooltip title={isFunctionDisabled('F4') ? 'You don\'t have permission to use this function' : ''}>
            <span>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleBillDiscount}
                            disabled={isFunctionDisabled('F4')}
                            sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                              backgroundColor: '#2196F3',
                              '&:hover': { backgroundColor: '#1976d2' },
                              '&:disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' },
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5,
                              whiteSpace: 'nowrap',
                  borderRadius: '6px'
                            }}
                          >
                            <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F4</span>
                <span>Bill Discount</span>
                          </Button>
                        </span>
                      </Tooltip>

          {/* F5 - Cancel */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          if (window.confirm('Cancel current transaction?')) {
                            setCart([]);
                            setItemForm({
                              itemCode: '',
                              itemName: '',
                              qty: '',
                              rate: '',
                              discount: '',
                              netAmount: ''
                            });
                          }
                        }}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#F44336',
                          '&:hover': { backgroundColor: '#d32f2f' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F5</span>
                        <span>Cancel</span>
                      </Button>

          {/* F6 - Tender */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          if (cart.length > 0) {
                            setTenderDialogOpen(true);
                          }
                        }}
                        disabled={cart.length === 0}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#4CAF50',
                          '&:hover': { backgroundColor: '#45a049' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F6</span>
                        <span>Tender</span>
                      </Button>
                    
          {/* F7 - Price Change */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handlePriceChange}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#607D8B',
                          '&:hover': { backgroundColor: '#455a64' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F7</span>
                        <span>Price Change</span>
                      </Button>

          {/* F8 - Qty Change */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleQuantityChange}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#2196F3',
                          '&:hover': { backgroundColor: '#1976d2' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F8</span>
                        <span>Qty Change</span>
                      </Button>

          {/* F9 - Clear */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          if (window.confirm('Clear entire cart?')) {
                            setCart([]);
                            setItemForm({
                              itemCode: '',
                              itemName: '',
                              qty: '',
                              rate: '',
                              discount: '',
                              netAmount: ''
                            });
                          }
                        }}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#F44336',
                          '&:hover': { backgroundColor: '#d32f2f' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F9</span>
                        <span>Clear</span>
                      </Button>
                    
          {/* F10 - Item Scan */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setShowItemScan(prev => !prev)}
                        sx={{
              py: 0.75,
              px: 1.5,
              minHeight: '40px',
              minWidth: 'auto',
                          backgroundColor: showItemScan ? '#4CAF50' : '#607D8B',
                          '&:hover': { backgroundColor: showItemScan ? '#45a049' : '#455a64' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              flexShrink: 0
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F10</span>
                        <span>Item Scan</span>
                      </Button>

          {/* F11 - Notes */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleNotes}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#757575',
                          '&:hover': { backgroundColor: '#616161' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F11</span>
                        <span>Notes</span>
                      </Button>

          {/* F12 - Refund */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleRefund}
                        sx={{
              py: 0.875,
              px: 1,
              minHeight: '44px',
              flex: 1,
              maxWidth: '100%',
                          backgroundColor: '#F44336',
                          '&:hover': { backgroundColor: '#d32f2f' },
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
              borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>F12</span>
                        <span>Refund</span>
                      </Button>
              </>
            )}

            {/* Alt/Ctrl Buttons - Shown when scrollIndex is 12 */}
            {buttonScrollIndex === 12 && (
              <>
            {/* Alt F1 - Add Item (from identifier 5) */}
              <Button
                variant="contained"
                size="small"
                onClick={() => setShowProductLookup(true)}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Alt F1</span>
                <span>Add Item</span>
              </Button>

            {/* Alt F3 - Suspend */}
              <Button
                variant="contained"
                size="small"
                onClick={handleSuspend}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#FF9800',
                  '&:hover': { backgroundColor: '#F57C00' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Alt F3</span>
                <span>Suspend</span>
              </Button>

            {/* Alt F4 - Resume */}
              <Button
                variant="contained"
                size="small"
                onClick={handleResume}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Alt F4</span>
                <span>Resume</span>
              </Button>

            {/* Alt F5 - Exchange */}
              <Button
                variant="contained"
                size="small"
                onClick={handleExchange}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#FF9800',
                  '&:hover': { backgroundColor: '#F57C00' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Alt F5</span>
                <span>Exchange</span>
              </Button>

            {/* Ctrl F1 - Reprint */}
              <Button
                variant="contained"
                size="small"
                onClick={handleReprint}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#757575',
                  '&:hover': { backgroundColor: '#616161' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Ctrl F1</span>
                <span>Reprint</span>
              </Button>

            {/* Ctrl F2 - Void */}
              <Button
                variant="contained"
                size="small"
                onClick={handleVoid}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#F44336',
                  '&:hover': { backgroundColor: '#d32f2f' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Ctrl F2</span>
                <span>Void</span>
              </Button>

            {/* Ctrl F3 - Bill Query */}
              <Button
                variant="contained"
                size="small"
                onClick={handleBillQuery}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976d2' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Ctrl F3</span>
                <span>Bill Query</span>
              </Button>

            {/* Ctrl F4 - Close */}
              <Button
                variant="contained"
                size="small"
                onClick={handleSettlement}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#9C27B0',
                  '&:hover': { backgroundColor: '#7B1FA2' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Ctrl F4</span>
                <span>Close</span>
              </Button>

            {/* Ctrl F5 - Force Quit */}
              <Button
                variant="contained"
                size="small"
                onClick={handleForceQuit}
                sx={{
                  py: 0.875,
                  px: 1,
                  minHeight: '44px',
                  flex: 1,
                  maxWidth: '100%',
                  backgroundColor: '#D32F2F',
                  '&:hover': { backgroundColor: '#C62828' },
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, flexShrink: 0 }}>Ctrl F5</span>
                <span>Force Quit</span>
              </Button>
              </>
            )}
          </Box>

          {/* Right Scroll Arrow - Double Chevron */}
          <IconButton
            onClick={() => setButtonScrollIndex(Math.min(12, buttonScrollIndex + 12))}
            disabled={buttonScrollIndex >= 12}
            sx={{
              minWidth: '40px',
              width: '40px',
              height: '44px',
              backgroundColor: '#e0e0e0',
              '&:hover': { backgroundColor: '#d0d0d0' },
              '&:disabled': { backgroundColor: '#f5f5f5', opacity: 0.5 }
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                width: '2.2rem', 
                height: '2.2rem',
                stroke: '#212121',
                strokeWidth: '3.5',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                fill: 'none'
              }}
            >
              <path d="M13 18l6.5-5.5-6.5-5.5" style={{ strokeWidth: '4.5' }} />
              <path d="M7 17l4-4-4-4" style={{ strokeWidth: '3', transform: 'translateX(-1px)' }} />
            </svg>
          </IconButton>
                </Box>
      </Paper>

      {/* Tender Dialog (2.2.2) */}
      <Dialog 
        open={tenderDialogOpen} 
        onClose={() => setTenderDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon />
            <Typography variant="h6">Select Payment Method</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 1 }}>
              {formatCurrency(total)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Total Amount
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={6} key={method.id}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setPaymentMethod(method.code);
                    setAmountPaid(total);
                    setTenderDialogOpen(false);
                    setPaymentDialogOpen(true);
                  }}
                  sx={{
                    py: 2,
                    backgroundColor: method.code === 'cash' ? '#4CAF50' : 
                                    method.code === 'card' ? '#2196F3' : '#757575',
                    '&:hover': {
                      backgroundColor: method.code === 'cash' ? '#45a049' : 
                                    method.code === 'card' ? '#1976d2' : '#616161',
                    },
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  {method.code === 'cash' && <MoneyIcon sx={{ mr: 1 }} />}
                  {method.code === 'card' && <CardIcon sx={{ mr: 1 }} />}
                  {method.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTenderDialogOpen(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon />
            <Typography variant="h6">Process Payment</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 1 }}>
              {formatCurrency(total)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Total Amount
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={6} key={method.id}>
                <Button
                  fullWidth
                  variant={paymentMethod === method.code ? 'contained' : 'outlined'}
                  onClick={() => setPaymentMethod(method.code)}
                  sx={{
                    py: 2,
                    backgroundColor: paymentMethod === method.code 
                      ? (method.code === 'cash' ? '#4CAF50' : method.code === 'card' ? '#2196F3' : '#757575')
                      : 'transparent',
                    borderColor: method.code === 'cash' ? '#4CAF50' : 
                                method.code === 'card' ? '#2196F3' : '#757575',
                    color: paymentMethod === method.code ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: paymentMethod === method.code 
                        ? (method.code === 'cash' ? '#45a049' : method.code === 'card' ? '#1976d2' : '#616161')
                        : 'rgba(0,0,0,0.04)',
                    }
                  }}
                >
                  {method.code === 'cash' && <MoneyIcon sx={{ mr: 1 }} />}
                  {method.code === 'card' && <CardIcon sx={{ mr: 1 }} />}
                  {method.name}
                </Button>
              </Grid>
            ))}
          </Grid>

          <TextField
            fullWidth
            label="Amount Paid"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MoneyIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mt: 3 }}
            autoFocus
          />

          {change > 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="h6">
                Change: {formatCurrency(change)}
              </Typography>
            </Alert>
          )}

          {amountPaid > 0 && amountPaid < total && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Remaining: {formatCurrency(total - amountPaid)}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPaymentDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={processPayment}
            disabled={amountPaid < total || loading}
            startIcon={<CheckIcon />}
            size="large"
            sx={{ 
              px: 4,
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Complete Payment
          </Button>
        </DialogActions>
      </Dialog>


      {/* Line Item Discount Dialog */}
      <Dialog open={lineItemDiscountDialogOpen} onClose={() => setLineItemDiscountDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Line Item Discount</DialogTitle>
        <DialogContent>
          {selectedCartItem && (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Item: {selectedCartItem.name || selectedCartItem.itemName}
              </Typography>
              <TextField
                fullWidth
                label="Discount Amount"
                type="number"
                defaultValue={selectedCartItem.discount || 0}
                onChange={(e) => {
                  const discountAmount = parseFloat(e.target.value) || 0;
                  setCart(cart.map(item =>
                    item.id === selectedCartItem.id
                      ? { ...item, discount: discountAmount }
                      : item
                  ));
                }}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLineItemDiscountDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setLineItemDiscountDialogOpen(false)} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Bill Discount Dialog */}
      <Dialog open={billDiscountDialogOpen} onClose={() => setBillDiscountDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bill Discount</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Discount Percentage (%)"
            type="number"
            value={billDiscountPercent}
            onChange={(e) => setBillDiscountPercent(parseFloat(e.target.value) || 0)}
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Discount Amount: {formatCurrency((subtotal * billDiscountPercent) / 100)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBillDiscountDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setBillDiscountDialogOpen(false)} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Price Change Dialog */}
      <Dialog open={priceChangeDialogOpen} onClose={() => setPriceChangeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Price</DialogTitle>
        <DialogContent>
          {selectedCartItem && (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Item: {selectedCartItem.name || selectedCartItem.itemName}
              </Typography>
              <TextField
                fullWidth
                label="New Price"
                type="number"
                defaultValue={selectedCartItem.price || 0}
                onChange={(e) => {
                  const newPrice = parseFloat(e.target.value) || 0;
                  setCart(cart.map(item =>
                    item.id === selectedCartItem.id
                      ? { ...item, price: newPrice, lineTotal: newPrice * item.quantity }
                      : item
                  ));
                }}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPriceChangeDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setPriceChangeDialogOpen(false)} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Quantity Change Dialog */}
      <Dialog open={quantityChangeDialogOpen} onClose={() => setQuantityChangeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Quantity</DialogTitle>
        <DialogContent>
          {selectedCartItem && (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Item: {selectedCartItem.name || selectedCartItem.itemName}
              </Typography>
              <TextField
                fullWidth
                label="New Quantity"
                type="number"
                defaultValue={selectedCartItem.quantity || 1}
                onChange={(e) => {
                  const newQty = parseFloat(e.target.value) || 1;
                  updateQuantity(selectedCartItem.id, newQty);
                }}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuantityChangeDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setQuantityChangeDialogOpen(false)} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Tax Override Dialog */}
      <Dialog open={taxOverrideDialogOpen} onClose={() => setTaxOverrideDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tax Override</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Override tax calculation for this transaction. This requires manager approval.
          </Alert>
          <TextField
            fullWidth
            label="Override Tax Amount"
            type="number"
            defaultValue={tax}
            onChange={(e) => {
              // TODO: Implement tax override logic
            }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaxOverrideDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setTaxOverrideDialogOpen(false)} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Transaction Notes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes"
            value={transactionNotes}
            onChange={(e) => setTransactionNotes(e.target.value)}
            placeholder="Enter transaction notes..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setNotesDialogOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onClose={() => setRefundDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Refund Transaction</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Select a completed sale to process refund.
          </Alert>
          <TextField
            fullWidth
            label="Sale Number"
            placeholder="Enter sale number..."
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Or search by customer name, date, or amount
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setRefundDialogOpen(false)} variant="contained" color="error">Process Refund</Button>
        </DialogActions>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={suspendDialogOpen} onClose={() => setSuspendDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Suspend Transaction</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This transaction will be saved as draft and can be resumed later.
          </Alert>
          <Typography variant="body2">
            Total Items: {cart.length}
          </Typography>
          <Typography variant="body2">
            Total Amount: {formatCurrency(total)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSuspend} variant="contained" disabled={loading}>
            {loading ? 'Suspending...' : 'Suspend'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resume Dialog */}
      <Dialog open={resumeDialogOpen} onClose={() => setResumeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Resume Suspended Sale</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : suspendedSales.length === 0 ? (
            <Alert severity="info">No suspended sales found.</Alert>
          ) : (
            <List>
              {suspendedSales.map((sale) => (
                <ListItem
                  key={sale.id}
                  button
                  onClick={() => resumeSale(sale.id)}
                  sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 1 }}
                >
                  <ListItemText
                    primary={sale.sale_number || sale.id}
                    secondary={`${formatCurrency(parseFloat(sale.total_amount || 0))} - ${sale.sale_date || 'Unknown date'}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResumeDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bill Query Dialog */}
      <Dialog open={billQueryDialogOpen} onClose={() => setBillQueryDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bill Query</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Search and view bill details by bill number, customer, or date range.
          </Alert>
          <TextField
            fullWidth
            label="Bill Number"
            placeholder="Enter bill number..."
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Customer Name/Phone"
            placeholder="Enter customer name or phone..."
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBillQueryDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setBillQueryDialogOpen(false)} variant="contained">Search</Button>
        </DialogActions>
      </Dialog>

      {/* Settlement Dialog */}
      <Dialog open={settlementDialogOpen} onClose={() => setSettlementDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Settlement - Close Session</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will trigger settlement and close the current POS session. Make sure all transactions are completed.
          </Alert>
          <Alert severity="info" sx={{ mb: 2 }}>
            Settlement allows you to count cash and reconcile payment methods before closing the session.
          </Alert>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Click "Proceed to Settlement" to open the full settlement module where you can:
            </Typography>
            <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
              <li>Count cash denominations</li>
              <li>Reconcile payment methods</li>
              <li>Record adjustments</li>
              <li>Complete session closure</li>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettlementDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setSettlementDialogOpen(false);
              navigate('/posv2/shift-workflow');
            }} 
            variant="contained"
            color="primary"
          >
            Proceed to Settlement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Force Quit Dialog */}
      <Dialog open={forceQuitDialogOpen} onClose={() => setForceQuitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Force Quit - Clear and Return to Home</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Warning:</strong> This will clear all current entries and return to the home page.
          </Alert>
          <Alert severity="warning" sx={{ mb: 2 }}>
            The following will be cleared:
            <Typography component="ul" variant="body2" sx={{ pl: 2, mt: 1 }}>
              <li>All cart items</li>
              <li>Customer selection</li>
              <li>Discounts and adjustments</li>
              <li>Payment information</li>
              <li>All open dialogs</li>
            </Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. Make sure you have saved or completed any pending transactions before proceeding.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForceQuitDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmForceQuit} 
            variant="contained"
            color="error"
          >
            Force Quit & Return Home
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exchange Dialog */}
      <Dialog open={exchangeDialogOpen} onClose={() => setExchangeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Exchange/Return</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Process exchange or return for a completed sale.
          </Alert>
          <TextField
            fullWidth
            label="Original Sale Number"
            placeholder="Enter sale number..."
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Select items to exchange or return
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExchangeDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setExchangeDialogOpen(false)} variant="contained">Process Exchange</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {/* Bill Preview Dialog */}
      <Dialog 
        open={billPreviewOpen && !!completedSale} 
        onClose={() => {
          // Allow closing via backdrop click - will trigger handleReturnToPOS behavior
          console.log('Bill preview dialog backdrop clicked - closing');
          handleReturnToPOS();
        }}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            maxWidth: '450px',
            width: '100%',
            m: 0,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
            paddingTop: '20px',
            paddingLeft: 0,
            paddingRight: 0,
            justifyContent: 'center',
            width: '100%',
            maxWidth: '450px',
            margin: '0 auto'
          },
          '& .MuiDialog-paper': {
            margin: 0,
            overflow: 'hidden',
            width: '100%',
            maxWidth: '450px'
          },
          '& .MuiDialogContent-root': {
            overflowY: 'hidden',
            overflowX: 'hidden',
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'center'
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
        disableEscapeKeyDown={false}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          },
          onClick: (e) => {
            // Prevent closing on backdrop click - user must use button
            e.stopPropagation();
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Receipt
              </Typography>
            </Box>
            <Chip 
              label="Paid" 
              color="success" 
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent 
          sx={{ 
            p: 0, 
            display: 'flex', 
            justifyContent: 'center',
            overflowX: 'hidden'
          }}
        >
          {completedSale && (
            <Box 
              id="bill-preview-content" 
              sx={{ 
                width: '100%',
                maxWidth: '100%',
                bgcolor: 'white',
                borderRadius: 0,
                p: 3,
                boxShadow: 'none',
                overflow: 'hidden'
              }}
            >
              {/* Compact Header */}
              <Box sx={{ textAlign: 'center', mb: 2, pb: 2, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 0.5 }}>
                  RETAIL POS
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {completedSale.sale_number || completedSale.id} • {completedSale.sale_date 
                    ? new Date(completedSale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>

              {/* Compact Sale Info */}
              <Box sx={{ mb: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <span>Cashier:</span>
                  <span>{completedSale.cashier?.full_name || completedSale.cashier?.username || 'N/A'}</span>
                </Box>
                {customer && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Customer:</span>
                    <span>{customer.first_name} {customer.last_name}</span>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

              {/* Compact Items Table */}
              <Box sx={{ mb: 2 }}>
                    {completedSale.items?.map((item, index) => (
                  <Box key={index} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.25 }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ flex: 1, pr: 1 }}>
                            {item.product?.name || item.product_name || 'Unknown Product'}
                          </Typography>
                      <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(item.total || (item.quantity * item.unit_price))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'text.secondary' }}>
                      <span>
                        {item.quantity} × {formatCurrency(item.unit_price)}
                        {item.product?.sku && ` • SKU: ${item.product.sku}`}
                      </span>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

              {/* Compact Totals */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem' }}>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(completedSale.subtotal || 0)}</span>
                </Box>
                {completedSale.tax_amount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem' }}>
                    <span>Tax:</span>
                    <span>{formatCurrency(completedSale.tax_amount || 0)}</span>
                  </Box>
                )}
                {completedSale.discount_amount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem', color: 'error.main' }}>
                    <span>Discount:</span>
                    <span>-{formatCurrency(completedSale.discount_amount || 0)}</span>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    TOTAL
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {formatCurrency(completedSale.total_amount || 0)}
                  </Typography>
                </Box>
              </Box>

              {/* Compact Payment Details */}
              {completedSale.payments && completedSale.payments.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                  <Box sx={{ mb: 2 }}>
                  {completedSale.payments.map((payment, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem' }}>
                        <span>{payment.payment_method?.replace('_', ' ').toUpperCase()}:</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(payment.amount)}</span>
                    </Box>
                  ))}
                  {completedSaleChange > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, fontSize: '0.875rem', fontWeight: 'bold', color: 'success.main' }}>
                        <span>Change:</span>
                        <span>{formatCurrency(completedSaleChange)}</span>
                    </Box>
                  )}
                  </Box>
                </>
              )}

              {/* Compact Footer */}
              <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Thank you for your business!
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: 2,
            pt: 1.5,
            gap: 1,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          <Button
            onClick={handlePrintReceipt}
            startIcon={<PrintIcon />}
            variant="outlined"
              size="medium"
              sx={{ 
                minWidth: 100,
                textTransform: 'none',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              Print
          </Button>
          <Button
            onClick={handleEmailReceipt}
            startIcon={<EmailIcon />}
            variant="outlined"
            disabled={!customer?.email && !completedSale?.customer?.email}
              size="medium"
              sx={{ 
                minWidth: 100,
                textTransform: 'none',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              Email
          </Button>
          </Box>
          <Button
            onClick={() => {
              console.log('🔄 Return to POS button clicked');
              handleReturnToPOS();
            }}
            variant="contained"
            color="primary"
            size="medium"
            sx={{ 
              minWidth: 140,
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
            autoFocus
          >
            New Sale
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default POSDesktop;

