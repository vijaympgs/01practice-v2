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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Directions as DirectionsIcon,
  Timer as TimerIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';
import { codeSettingsService } from '../../services/codeSettingsService';
import transactionManager from '../../services/TransactionManager';

const HomeDeliveryConfirmationModule = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
  // Delivery state
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryDialog, setDeliveryDialog] = useState({ open: false, delivery: null });
  
  // Delivery form state
  const [deliveryData, setDeliveryData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryInstructions: '',
    deliveryFee: 0,
    paymentMethod: 'cash_on_delivery',
    status: 'pending', // pending, confirmed, out_for_delivery, delivered, cancelled
    driverName: '',
    driverPhone: '',
    estimatedDeliveryTime: '',
    actualDeliveryTime: '',
    deliveryNotes: '',
    signature: '',
    photo: '',
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    driver: '',
    customer: '',
  });
  
  // Data states
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [summary, setSummary] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    cancelledDeliveries: 0,
  });

  useEffect(() => {
    initializeDeliveries();
  }, []);

  const initializeDeliveries = async () => {
    try {
      setLoading(true);
      
      // Load currencies
      const currencyList = await currencyService.getActiveCurrencies();
      setCurrencies(currencyList);
      
      // Load mock data
      await loadDeliveries();
      await calculateSummary();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize deliveries: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveries = async () => {
    try {
      // Mock data - replace with actual API call
      const mockDeliveries = [
        {
          id: '1',
          orderNumber: 'ORD-001',
          customerName: 'John Doe',
          customerPhone: '+1234567890',
          customerEmail: 'john@example.com',
          deliveryAddress: '123 Main St, City, State 12345',
          deliveryDate: '2025-01-27',
          deliveryTime: '14:00',
          deliveryInstructions: 'Leave at front door if no answer',
          deliveryFee: 50.00,
          paymentMethod: 'cash_on_delivery',
          status: 'pending',
          driverName: '',
          driverPhone: '',
          estimatedDeliveryTime: '14:00-15:00',
          actualDeliveryTime: '',
          deliveryNotes: '',
          signature: '',
          photo: '',
          orderItems: [
            { name: 'Product A', quantity: 2, price: 100.00 },
            { name: 'Product B', quantity: 1, price: 150.00 },
          ],
          totalAmount: 350.00,
          createdDate: '2025-01-26',
          lastUpdated: '2025-01-26',
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customerName: 'Jane Smith',
          customerPhone: '+1234567891',
          customerEmail: 'jane@example.com',
          deliveryAddress: '456 Oak Ave, City, State 12345',
          deliveryDate: '2025-01-27',
          deliveryTime: '16:00',
          deliveryInstructions: 'Call before delivery',
          deliveryFee: 75.00,
          paymentMethod: 'card',
          status: 'confirmed',
          driverName: 'Mike Johnson',
          driverPhone: '+1234567892',
          estimatedDeliveryTime: '16:00-17:00',
          actualDeliveryTime: '',
          deliveryNotes: '',
          signature: '',
          photo: '',
          orderItems: [
            { name: 'Product C', quantity: 1, price: 200.00 },
            { name: 'Product D', quantity: 3, price: 50.00 },
          ],
          totalAmount: 425.00,
          createdDate: '2025-01-26',
          lastUpdated: '2025-01-26',
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          customerName: 'Bob Johnson',
          customerPhone: '+1234567893',
          customerEmail: 'bob@example.com',
          deliveryAddress: '789 Pine Rd, City, State 12345',
          deliveryDate: '2025-01-26',
          deliveryTime: '10:00',
          deliveryInstructions: 'Gate code: 1234',
          deliveryFee: 100.00,
          paymentMethod: 'cash_on_delivery',
          status: 'delivered',
          driverName: 'Sarah Wilson',
          driverPhone: '+1234567894',
          estimatedDeliveryTime: '10:00-11:00',
          actualDeliveryTime: '10:30',
          deliveryNotes: 'Delivered successfully',
          signature: 'signature_data_here',
          photo: 'delivery_photo_url',
          orderItems: [
            { name: 'Product E', quantity: 1, price: 300.00 },
          ],
          totalAmount: 400.00,
          createdDate: '2025-01-25',
          lastUpdated: '2025-01-26',
        },
      ];
      
      setDeliveries(mockDeliveries);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    }
  };

  const calculateSummary = () => {
    const pending = deliveries.filter(d => d.status === 'pending');
    const completed = deliveries.filter(d => d.status === 'delivered');
    const cancelled = deliveries.filter(d => d.status === 'cancelled');
    
    setSummary({
      totalDeliveries: deliveries.length,
      pendingDeliveries: pending.length,
      completedDeliveries: completed.length,
      cancelledDeliveries: cancelled.length,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDeliverySelect = (delivery) => {
    setSelectedDelivery(delivery);
    setDeliveryData(delivery);
  };

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      setSaving(true);
      
      const updatedDeliveries = deliveries.map(d => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
            actualDeliveryTime: newStatus === 'delivered' ? new Date().toISOString() : d.actualDeliveryTime,
          };
        }
        return d;
      });
      
      setDeliveries(updatedDeliveries);
      await calculateSummary();
      
      setSnackbar({ open: true, message: 'Delivery status updated successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update delivery status: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeliveryUpdate = async () => {
    try {
      setSaving(true);
      
      const updatedDeliveries = deliveries.map(d => {
        if (d.id === deliveryData.id) {
          return {
            ...d,
            ...deliveryData,
            lastUpdated: new Date().toISOString(),
          };
        }
        return d;
      });
      
      setDeliveries(updatedDeliveries);
      setDeliveryDialog({ open: false, delivery: null });
      
      setSnackbar({ open: true, message: 'Delivery updated successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update delivery: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      out_for_delivery: 'primary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <ScheduleIcon />,
      confirmed: <CheckIcon />,
      out_for_delivery: <DeliveryIcon />,
      delivered: <CheckIcon />,
      cancelled: <ErrorIcon />,
    };
    return icons[status] || <ScheduleIcon />;
  };

  const formatCurrency = (amount) => {
    return currencyService.formatCurrency(amount, selectedCurrency);
  };

  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  const getFilteredDeliveries = () => {
    let filtered = deliveries;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(d => d.status === filters.status);
    }
    
    if (filters.customer) {
      filtered = filtered.filter(d => 
        d.customerName.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }
    
    if (filters.driver) {
      filtered = filtered.filter(d => 
        d.driverName.toLowerCase().includes(filters.driver.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getDeliverySteps = (status) => {
    const steps = [
      { label: 'Order Placed', completed: true },
      { label: 'Confirmed', completed: ['confirmed', 'out_for_delivery', 'delivered'].includes(status) },
      { label: 'Out for Delivery', completed: ['out_for_delivery', 'delivered'].includes(status) },
      { label: 'Delivered', completed: status === 'delivered' },
    ];
    
    return steps;
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
            <DeliveryIcon sx={{ fontSize: 40 }} />
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
                Home Delivery Confirmation
              </Typography>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Manage home delivery orders and confirmations
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
                  Total Deliveries
                </Typography>
                <Typography variant="h4" color="primary">
                  {summary.totalDeliveries}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {summary.pendingDeliveries}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h4" color="success.main">
                  {summary.completedDeliveries}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Cancelled
                </Typography>
                <Typography variant="h4" color="error">
                  {summary.cancelledDeliveries}
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
            <Tab icon={<DeliveryIcon />} iconPosition="start" label="All Deliveries" />
            <Tab icon={<ScheduleIcon />} iconPosition="start" label="Pending" />
            <Tab icon={<CheckIcon />} iconPosition="start" label="Completed" />
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
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search Driver"
                      value={filters.driver}
                      onChange={(e) => setFilters(prev => ({ ...prev, driver: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterIcon />}
                      onClick={() => setFilters({
                        status: 'all',
                        dateFrom: '',
                        dateTo: '',
                        driver: '',
                        customer: '',
                      })}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Deliveries Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Delivery Address</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredDeliveries().map((delivery) => (
                      <TableRow 
                        key={delivery.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {delivery.orderNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(delivery.createdDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {delivery.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {delivery.customerPhone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ maxWidth: 200 }}>
                            <Typography variant="body2" sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {delivery.deliveryAddress}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {delivery.deliveryInstructions}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(delivery.deliveryDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {delivery.deliveryTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(delivery.totalAmount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fee: {formatCurrency(delivery.deliveryFee)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(delivery.status)}
                            label={delivery.status.replace('_', ' ')} 
                            color={getStatusColor(delivery.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeliverySelect(delivery)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Update Status">
                              <IconButton 
                                size="small" 
                                onClick={() => setDeliveryDialog({ open: true, delivery })}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Print Delivery Note">
                              <IconButton size="small" color="secondary">
                                <PrintIcon fontSize="small" />
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
                Pending Deliveries
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Deliveries awaiting confirmation and assignment
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed Deliveries
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successfully delivered orders
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Delivery Details Dialog */}
      <Dialog open={deliveryDialog.open} onClose={() => setDeliveryDialog({ open: false, delivery: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeliveryIcon />
            <Typography variant="h6">Delivery Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {deliveryDialog.delivery && (
            <Box>
              {/* Delivery Steps */}
              <Box sx={{ mb: 3 }}>
                <Stepper activeStep={getDeliverySteps(deliveryDialog.delivery.status).findIndex(step => !step.completed)}>
                  {getDeliverySteps(deliveryDialog.delivery.status).map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel>{step.label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              
              <Grid container spacing={3}>
                {/* Customer Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Name: {deliveryDialog.delivery.customerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phone: {deliveryDialog.delivery.customerPhone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {deliveryDialog.delivery.customerEmail}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    Delivery Address
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {deliveryDialog.delivery.deliveryAddress}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instructions: {deliveryDialog.delivery.deliveryInstructions}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Order Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Order Number: {deliveryDialog.delivery.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Date: {new Date(deliveryDialog.delivery.deliveryDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Time: {deliveryDialog.delivery.deliveryTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount: {formatCurrency(deliveryDialog.delivery.totalAmount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Fee: {formatCurrency(deliveryDialog.delivery.deliveryFee)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    Order Items
                  </Typography>
                  {deliveryDialog.delivery.orderItems.map((item, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.name} x {item.quantity} - {formatCurrency(item.price)}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
              
              {/* Status Update */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Update Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['confirmed', 'out_for_delivery', 'delivered', 'cancelled'].map((status) => (
                    <Button
                      key={status}
                      variant={deliveryDialog.delivery.status === status ? 'contained' : 'outlined'}
                      onClick={() => handleStatusChange(deliveryDialog.delivery.id, status)}
                      disabled={saving}
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeliveryDialog({ open: false, delivery: null })}>
            Close
          </Button>
          <Button variant="contained" startIcon={<PrintIcon />}>
            Print Delivery Note
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

export default HomeDeliveryConfirmationModule;
