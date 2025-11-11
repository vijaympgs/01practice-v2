import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Autocomplete,
} from '@mui/material';
import {
  People as CustomerIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';
import { codeSettingsService } from '../../services/codeSettingsService';
import transactionManager from '../../services/TransactionManager';

const CustomerReceivablesModule = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
  // Receivables state
  const [receivables, setReceivables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerReceivables, setCustomerReceivables] = useState([]);
  
  // Payment state
  const [paymentDialog, setPaymentDialog] = useState({ open: false, receivable: null });
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString(),
    reference: '',
    notes: '',
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    customer: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  });
  
  // Data states
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [summary, setSummary] = useState({
    totalOutstanding: 0,
    totalOverdue: 0,
    totalCustomers: 0,
    averageReceivable: 0,
  });

  useEffect(() => {
    initializeReceivables();
  }, []);

  const initializeReceivables = async () => {
    try {
      setLoading(true);
      
      // Load currencies
      const currencyList = await currencyService.getActiveCurrencies();
      setCurrencies(currencyList);
      
      // Load mock data
      await loadReceivables();
      await loadCustomers();
      await calculateSummary();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize receivables: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadReceivables = async () => {
    try {
      // Mock data - replace with actual API call
      const mockReceivables = [
        {
          id: '1',
          customerId: '1',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+1234567890',
          invoiceNumber: 'INV-001',
          invoiceDate: '2025-01-20',
          dueDate: '2025-01-27',
          amount: 1500.00,
          paidAmount: 500.00,
          outstandingAmount: 1000.00,
          status: 'outstanding', // outstanding, overdue, paid
          daysOverdue: 0,
          notes: 'Partial payment received',
          createdDate: '2025-01-20',
          lastPaymentDate: '2025-01-25',
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerPhone: '+1234567891',
          invoiceNumber: 'INV-002',
          invoiceDate: '2025-01-15',
          dueDate: '2025-01-22',
          amount: 2500.00,
          paidAmount: 0.00,
          outstandingAmount: 2500.00,
          status: 'overdue',
          daysOverdue: 3,
          notes: 'Follow up required',
          createdDate: '2025-01-15',
          lastPaymentDate: null,
        },
        {
          id: '3',
          customerId: '3',
          customerName: 'Bob Johnson',
          customerEmail: 'bob@example.com',
          customerPhone: '+1234567892',
          invoiceNumber: 'INV-003',
          invoiceDate: '2025-01-18',
          dueDate: '2025-01-25',
          amount: 800.00,
          paidAmount: 800.00,
          outstandingAmount: 0.00,
          status: 'paid',
          daysOverdue: 0,
          notes: 'Payment completed',
          createdDate: '2025-01-18',
          lastPaymentDate: '2025-01-24',
        },
      ];
      
      setReceivables(mockReceivables);
    } catch (error) {
      console.error('Failed to load receivables:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCustomers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St, City',
          creditLimit: 5000.00,
          outstandingAmount: 1000.00,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          address: '456 Oak Ave, City',
          creditLimit: 3000.00,
          outstandingAmount: 2500.00,
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+1234567892',
          address: '789 Pine Rd, City',
          creditLimit: 2000.00,
          outstandingAmount: 0.00,
        },
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const calculateSummary = () => {
    const outstanding = receivables.filter(r => r.status === 'outstanding');
    const overdue = receivables.filter(r => r.status === 'overdue');
    
    const totalOutstanding = outstanding.reduce((sum, r) => sum + r.outstandingAmount, 0);
    const totalOverdue = overdue.reduce((sum, r) => sum + r.outstandingAmount, 0);
    const totalCustomers = new Set(receivables.map(r => r.customerId)).size;
    const averageReceivable = receivables.length > 0 
      ? receivables.reduce((sum, r) => sum + r.outstandingAmount, 0) / receivables.length 
      : 0;
    
    setSummary({
      totalOutstanding,
      totalOverdue,
      totalCustomers,
      averageReceivable,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    if (customer) {
      const customerReceivablesList = receivables.filter(r => r.customerId === customer.id);
      setCustomerReceivables(customerReceivablesList);
    } else {
      setCustomerReceivables([]);
    }
  };

  const handlePayment = (receivable) => {
    setPaymentDialog({ open: true, receivable });
    setPaymentData({
      amount: receivable.outstandingAmount,
      paymentMethod: 'cash',
      paymentDate: new Date().toISOString(),
      reference: '',
      notes: '',
    });
  };

  const processPayment = async () => {
    try {
      setSaving(true);
      
      const { receivable } = paymentDialog;
      
      // Create payment record
      const payment = {
        id: Date.now().toString(),
        receivableId: receivable.id,
        customerId: receivable.customerId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
        reference: paymentData.reference,
        notes: paymentData.notes,
        status: 'completed',
      };
      
      // Update receivable
      const updatedReceivables = receivables.map(r => {
        if (r.id === receivable.id) {
          const newPaidAmount = r.paidAmount + paymentData.amount;
          const newOutstandingAmount = r.amount - newPaidAmount;
          return {
            ...r,
            paidAmount: newPaidAmount,
            outstandingAmount: newOutstandingAmount,
            status: newOutstandingAmount <= 0 ? 'paid' : 'outstanding',
            lastPaymentDate: paymentData.paymentDate,
          };
        }
        return r;
      });
      
      setReceivables(updatedReceivables);
      setPaymentDialog({ open: false, receivable: null });
      
      // Recalculate summary
      await calculateSummary();
      
      setSnackbar({ open: true, message: 'Payment processed successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to process payment: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      outstanding: 'warning',
      overdue: 'error',
      paid: 'success',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount) => {
    return currencyService.formatCurrency(amount, selectedCurrency);
  };

  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  const getFilteredReceivables = () => {
    let filtered = receivables;
    
    if (filters.customer) {
      filtered = filtered.filter(r => 
        r.customerName.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    
    if (filters.amountMin) {
      filtered = filtered.filter(r => r.outstandingAmount >= parseFloat(filters.amountMin));
    }
    
    if (filters.amountMax) {
      filtered = filtered.filter(r => r.outstandingAmount <= parseFloat(filters.amountMax));
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 3
    }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          px: 3,
          mb: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <CustomerIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  mb: 0.5
                }}
              >
                Customer Receivables
              </Typography>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Manage customer outstanding payments and receivables
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Total Outstanding
                </Typography>
                <Typography variant="h4" color="primary">
                  {`${getCurrencySymbol()}${summary.totalOutstanding.toFixed(2)}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Overdue Amount
                </Typography>
                <Typography variant="h4" color="error">
                  {`${getCurrencySymbol()}${summary.totalOverdue.toFixed(2)}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Total Customers
                </Typography>
                <Typography variant="h4" color="secondary">
                  {summary.totalCustomers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Average Receivable
                </Typography>
                <Typography variant="h4" color="success.main">
                  {`${getCurrencySymbol()}${summary.averageReceivable.toFixed(2)}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: theme.palette.grey[600],
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light + '15',
                },
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
              },
            }}
          >
            <Tab icon={<ReceiptIcon />} iconPosition="start" label="All Receivables" />
            <Tab icon={<CustomerIcon />} iconPosition="start" label="Customer View" />
            <Tab icon={<PaymentIcon />} iconPosition="start" label="Payments" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Filters */}
              <Box sx={{ p: 3, borderBottom: '1px solid #dee2e6' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search Customer"
                      value={filters.customer}
                      onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        label="Status"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="outstanding">Outstanding</MenuItem>
                        <MenuItem value="overdue">Overdue</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Min Amount"
                      type="number"
                      value={filters.amountMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, amountMin: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Max Amount"
                      type="number"
                      value={filters.amountMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, amountMax: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterIcon />}
                      onClick={() => setFilters({
                        customer: '',
                        status: 'all',
                        dateFrom: '',
                        dateTo: '',
                        amountMin: '',
                        amountMax: '',
                      })}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Receivables Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Invoice</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Outstanding</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredReceivables().map((receivable) => (
                      <TableRow 
                        key={receivable.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {receivable.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {receivable.customerEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {receivable.invoiceNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(receivable.invoiceDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(receivable.dueDate).toLocaleDateString()}
                          </Typography>
                          {receivable.daysOverdue > 0 && (
                            <Typography variant="caption" color="error">
                              {receivable.daysOverdue} days overdue
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(receivable.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(receivable.outstandingAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={receivable.status} 
                            color={getStatusColor(receivable.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {receivable.outstandingAmount > 0 && (
                              <Tooltip title="Record Payment">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handlePayment(receivable)}
                                  color="primary"
                                >
                                  <PaymentIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Send Reminder">
                              <IconButton size="small" color="secondary">
                                <EmailIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Selection
              </Typography>
              
              <Autocomplete
                options={customers}
                value={selectedCustomer}
                onChange={(event, newValue) => handleCustomerSelect(newValue)}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Select Customer" />
                )}
                sx={{ mb: 3 }}
              />
              
              {selectedCustomer && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Customer Details
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email: {selectedCustomer.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {selectedCustomer.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Credit Limit: {formatCurrency(selectedCustomer.creditLimit)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Outstanding: {formatCurrency(selectedCustomer.outstandingAmount)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6" gutterBottom>
                    Receivables
                  </Typography>
                  
                  {customerReceivables.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No receivables found for this customer
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Invoice</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Outstanding</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {customerReceivables.map((receivable) => (
                            <TableRow key={receivable.id}>
                              <TableCell>{receivable.invoiceNumber}</TableCell>
                              <TableCell>{new Date(receivable.invoiceDate).toLocaleDateString()}</TableCell>
                              <TableCell>{formatCurrency(receivable.amount)}</TableCell>
                              <TableCell>{formatCurrency(receivable.outstandingAmount)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={receivable.status} 
                                  color={getStatusColor(receivable.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {receivable.outstandingAmount > 0 && (
                                  <Button
                                    size="small"
                                    startIcon={<PaymentIcon />}
                                    onClick={() => handlePayment(receivable)}
                                  >
                                    Pay
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment history and tracking will be displayed here
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onClose={() => setPaymentDialog({ open: false, receivable: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon />
            <Typography variant="h6">Record Payment</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {paymentDialog.receivable && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {paymentDialog.receivable.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Invoice: {paymentDialog.receivable.invoiceNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Outstanding: {formatCurrency(paymentDialog.receivable.outstandingAmount)}
              </Typography>
            </Box>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Amount"
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reference"
                value={paymentData.reference}
                onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="Payment reference number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={paymentData.notes}
                onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Payment notes"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog({ open: false, receivable: null })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={processPayment}
            disabled={saving || paymentData.amount <= 0}
            startIcon={saving ? <CircularProgress size={20} /> : <CheckIcon />}
          >
            Record Payment
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

export default CustomerReceivablesModule;
