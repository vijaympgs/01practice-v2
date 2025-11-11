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
  Switch,
  FormControlLabel,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  ListItemAvatar,
  Slider,
  Rating,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  People as ReceivablesIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Assessment as ReportIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Flag as FlagIcon,
  PriorityHigh as PriorityHighIcon,
  Check as CheckIcon2,
  Cancel as CancelIcon,
  Send as SendIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';

const AdvancedReceivablesModule = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
  // Receivables state
  const [receivables, setReceivables] = useState([]);
  const [selectedReceivable, setSelectedReceivable] = useState(null);
  const [receivableDialog, setReceivableDialog] = useState({ open: false, receivable: null, type: 'add' });
  
  // Receivable form state
  const [receivableData, setReceivableData] = useState({
    id: '',
    receivableId: '',
    customerId: '',
    customerName: '',
    customerType: 'individual', // individual, business
    invoiceId: '',
    invoiceDate: '',
    dueDate: '',
    originalAmount: 0,
    outstandingAmount: 0,
    paidAmount: 0,
    creditLimit: 0,
    creditUsed: 0,
    creditAvailable: 0,
    paymentTerms: {
      days: 30,
      discountDays: 10,
      discountPercent: 2,
      lateFeePercent: 1.5,
    },
    aging: {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0,
    },
    status: 'outstanding', // outstanding, overdue, paid, disputed, written_off
    priority: 'medium', // low, medium, high, critical
    riskLevel: 'low', // low, medium, high, critical
    paymentHistory: [],
    reminders: {
      enabled: true,
      frequency: 'weekly', // daily, weekly, monthly
      lastSent: '',
      nextDue: '',
      template: 'standard',
    },
    automatedActions: {
      autoReminder: true,
      autoEscalation: true,
      autoCollection: false,
      autoWriteOff: false,
    },
    collection: {
      assignedTo: '',
      assignedDate: '',
      lastContact: '',
      contactMethod: '',
      notes: '',
      nextAction: '',
      nextActionDate: '',
    },
    metadata: {
      location: '',
      department: '',
      costCenter: '',
      notes: '',
      tags: [],
    },
  });
  
  // Payment state
  const [paymentDialog, setPaymentDialog] = useState({ open: false, receivable: null });
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    customer: '',
    dateFrom: '',
    dateTo: '',
    priority: 'all',
    riskLevel: 'all',
    assignedTo: '',
  });
  
  // Data states
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [summary, setSummary] = useState({
    totalOutstanding: 0,
    overdueAmount: 0,
    customersWithOverdue: 0,
    averageDaysOutstanding: 0,
    collectionRate: 0,
  });

  useEffect(() => {
    initializeAdvancedReceivables();
  }, []);

  const initializeAdvancedReceivables = async () => {
    try {
      setLoading(true);
      
      // Load currencies
      const currencyList = await currencyService.getActiveCurrencies();
      setCurrencies(currencyList);
      
      // Load mock data
      await loadReceivables();
      await calculateSummary();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize advanced receivables: ' + error.message, severity: 'error' });
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
          receivableId: 'REC-001',
          customerId: 'C001',
          customerName: 'John Doe',
          customerType: 'individual',
          invoiceId: 'INV-001',
          invoiceDate: '2025-01-15',
          dueDate: '2025-02-14',
          originalAmount: 5000.00,
          outstandingAmount: 5000.00,
          paidAmount: 0.00,
          creditLimit: 10000.00,
          creditUsed: 5000.00,
          creditAvailable: 5000.00,
          paymentTerms: {
            days: 30,
            discountDays: 10,
            discountPercent: 2,
            lateFeePercent: 1.5,
          },
          aging: {
            current: 5000.00,
            days30: 0,
            days60: 0,
            days90: 0,
            over90: 0,
          },
          status: 'outstanding',
          priority: 'medium',
          riskLevel: 'low',
          paymentHistory: [],
          reminders: {
            enabled: true,
            frequency: 'weekly',
            lastSent: '',
            nextDue: '2025-01-28',
            template: 'standard',
          },
          automatedActions: {
            autoReminder: true,
            autoEscalation: true,
            autoCollection: false,
            autoWriteOff: false,
          },
          collection: {
            assignedTo: '',
            assignedDate: '',
            lastContact: '',
            contactMethod: '',
            notes: '',
            nextAction: '',
            nextActionDate: '',
          },
          metadata: {
            location: 'Main Store',
            department: 'Sales',
            costCenter: 'CC001',
            notes: 'Regular customer - good payment history',
            tags: ['VIP', 'Regular'],
          },
        },
        {
          id: '2',
          receivableId: 'REC-002',
          customerId: 'C002',
          customerName: 'ABC Corporation',
          customerType: 'business',
          invoiceId: 'INV-002',
          invoiceDate: '2025-01-10',
          dueDate: '2025-02-09',
          originalAmount: 15000.00,
          outstandingAmount: 15000.00,
          paidAmount: 0.00,
          creditLimit: 50000.00,
          creditUsed: 15000.00,
          creditAvailable: 35000.00,
          paymentTerms: {
            days: 30,
            discountDays: 10,
            discountPercent: 2,
            lateFeePercent: 1.5,
          },
          aging: {
            current: 0,
            days30: 15000.00,
            days60: 0,
            days90: 0,
            over90: 0,
          },
          status: 'overdue',
          priority: 'high',
          riskLevel: 'medium',
          paymentHistory: [],
          reminders: {
            enabled: true,
            frequency: 'daily',
            lastSent: '2025-01-25',
            nextDue: '2025-01-26',
            template: 'urgent',
          },
          automatedActions: {
            autoReminder: true,
            autoEscalation: true,
            autoCollection: true,
            autoWriteOff: false,
          },
          collection: {
            assignedTo: 'Collection Team',
            assignedDate: '2025-01-20',
            lastContact: '2025-01-25',
            contactMethod: 'Email',
            notes: 'Customer requested extension',
            nextAction: 'Phone call',
            nextActionDate: '2025-01-28',
          },
          metadata: {
            location: 'Branch Store',
            department: 'Sales',
            costCenter: 'CC002',
            notes: 'Corporate account - payment issues',
            tags: ['Corporate', 'Overdue'],
          },
        },
        {
          id: '3',
          receivableId: 'REC-003',
          customerId: 'C003',
          customerName: 'Jane Smith',
          customerType: 'individual',
          invoiceId: 'INV-003',
          invoiceDate: '2025-01-05',
          dueDate: '2025-02-04',
          originalAmount: 2500.00,
          outstandingAmount: 2500.00,
          paidAmount: 0.00,
          creditLimit: 5000.00,
          creditUsed: 2500.00,
          creditAvailable: 2500.00,
          paymentTerms: {
            days: 30,
            discountDays: 10,
            discountPercent: 2,
            lateFeePercent: 1.5,
          },
          aging: {
            current: 0,
            days30: 0,
            days60: 2500.00,
            days90: 0,
            over90: 0,
          },
          status: 'overdue',
          priority: 'critical',
          riskLevel: 'high',
          paymentHistory: [],
          reminders: {
            enabled: true,
            frequency: 'daily',
            lastSent: '2025-01-26',
            nextDue: '2025-01-27',
            template: 'final_notice',
          },
          automatedActions: {
            autoReminder: true,
            autoEscalation: true,
            autoCollection: true,
            autoWriteOff: false,
          },
          collection: {
            assignedTo: 'Collection Manager',
            assignedDate: '2025-01-15',
            lastContact: '2025-01-26',
            contactMethod: 'Phone',
            notes: 'Customer unresponsive',
            nextAction: 'Legal notice',
            nextActionDate: '2025-01-30',
          },
          metadata: {
            location: 'Main Store',
            department: 'Sales',
            costCenter: 'CC001',
            notes: 'Individual customer - payment issues',
            tags: ['Individual', 'Critical'],
          },
        },
      ];
      
      setReceivables(mockReceivables);
    } catch (error) {
      console.error('Failed to load receivables:', error);
    }
  };

  const calculateSummary = () => {
    const totalOutstanding = receivables.reduce((sum, r) => sum + r.outstandingAmount, 0);
    const overdueAmount = receivables.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.outstandingAmount, 0);
    const customersWithOverdue = receivables.filter(r => r.status === 'overdue').length;
    const averageDaysOutstanding = receivables.length > 0 
      ? receivables.reduce((sum, r) => {
          const days = Math.floor((new Date() - new Date(r.invoiceDate)) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / receivables.length 
      : 0;
    const collectionRate = receivables.length > 0 
      ? (receivables.filter(r => r.status === 'paid').length / receivables.length) * 100 
      : 0;
    
    setSummary({
      totalOutstanding,
      overdueAmount,
      customersWithOverdue,
      averageDaysOutstanding,
      collectionRate,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleReceivableSelect = (receivable) => {
    setSelectedReceivable(receivable);
  };

  const handlePayment = async (receivableId, paymentAmount) => {
    try {
      const receivable = receivables.find(r => r.id === receivableId);
      if (!receivable) return;
      
      const updatedReceivable = {
        ...receivable,
        outstandingAmount: Math.max(0, receivable.outstandingAmount - paymentAmount),
        paidAmount: receivable.paidAmount + paymentAmount,
        status: receivable.outstandingAmount - paymentAmount <= 0 ? 'paid' : receivable.status,
        paymentHistory: [
          ...receivable.paymentHistory,
          {
            id: Date.now().toString(),
            amount: paymentAmount,
            paymentDate: new Date().toISOString(),
            paymentMethod: paymentData.paymentMethod,
            reference: paymentData.reference,
            notes: paymentData.notes,
          },
        ],
      };
      
      setReceivables(prev => prev.map(r => r.id === receivableId ? updatedReceivable : r));
      setPaymentDialog({ open: false, receivable: null });
      setSnackbar({ open: true, message: 'Payment recorded successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to record payment: ' + error.message, severity: 'error' });
    }
  };

  const handleSendReminder = async (receivableId) => {
    try {
      const receivable = receivables.find(r => r.id === receivableId);
      if (!receivable) return;
      
      const updatedReceivable = {
        ...receivable,
        reminders: {
          ...receivable.reminders,
          lastSent: new Date().toISOString(),
          nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      };
      
      setReceivables(prev => prev.map(r => r.id === receivableId ? updatedReceivable : r));
      setSnackbar({ open: true, message: 'Reminder sent successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to send reminder: ' + error.message, severity: 'error' });
    }
  };

  const handleEscalate = async (receivableId) => {
    try {
      const receivable = receivables.find(r => r.id === receivableId);
      if (!receivable) return;
      
      const updatedReceivable = {
        ...receivable,
        priority: receivable.priority === 'low' ? 'medium' : 
                 receivable.priority === 'medium' ? 'high' : 'critical',
        riskLevel: receivable.riskLevel === 'low' ? 'medium' : 
                   receivable.riskLevel === 'medium' ? 'high' : 'critical',
        collection: {
          ...receivable.collection,
          assignedTo: 'Collection Manager',
          assignedDate: new Date().toISOString(),
          nextAction: 'Escalated to collection team',
          nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      };
      
      setReceivables(prev => prev.map(r => r.id === receivableId ? updatedReceivable : r));
      setSnackbar({ open: true, message: 'Receivable escalated successfully!', severity: 'warning' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to escalate receivable: ' + error.message, severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      outstanding: 'info',
      overdue: 'warning',
      paid: 'success',
      disputed: 'error',
      written_off: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      outstanding: <ScheduleIcon />,
      overdue: <WarningIcon />,
      paid: <CheckIcon />,
      disputed: <ErrorIcon />,
      written_off: <CancelIcon />,
    };
    return icons[status] || <ScheduleIcon />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colors[priority] || 'default';
  };

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colors[riskLevel] || 'default';
  };

  const formatCurrency = (amount) => {
    return currencyService.formatCurrency(amount, selectedCurrency);
  };

  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getFilteredReceivables = () => {
    let filtered = receivables;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    
    if (filters.customer) {
      filtered = filtered.filter(r => 
        r.customerName.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(r => r.invoiceDate >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(r => r.invoiceDate <= filters.dateTo);
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(r => r.priority === filters.priority);
    }
    
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(r => r.riskLevel === filters.riskLevel);
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
            <ReceivablesIcon sx={{ fontSize: 40 }} />
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
                Advanced Receivables
              </Typography>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Credit management, aging analysis, and automated collection
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Summary Dashboard */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Total Outstanding
                </Typography>
                <Typography variant="h4" color="primary">
                  {formatCurrency(summary.totalOutstanding)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All receivables
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  Overdue Amount
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {formatCurrency(summary.overdueAmount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {summary.customersWithOverdue} customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main" gutterBottom>
                  Avg. Days Outstanding
                </Typography>
                <Typography variant="h4" color="info.main">
                  {Math.round(summary.averageDaysOutstanding)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Collection Rate
                </Typography>
                <Typography variant="h4" color="success.main">
                  {Math.round(summary.collectionRate)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Success rate
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
            <Tab icon={<ReceivablesIcon />} iconPosition="start" label="Receivables" />
            <Tab icon={<CreditCardIcon />} iconPosition="start" label="Credit Limits" />
            <Tab icon={<TimelineIcon />} iconPosition="start" label="Aging Analysis" />
            <Tab icon={<NotificationIcon />} iconPosition="start" label="Reminders" />
            <Tab icon={<ReportIcon />} iconPosition="start" label="Reports" />
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
                        <MenuItem value="disputed">Disputed</MenuItem>
                        <MenuItem value="written_off">Written Off</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        label="Priority"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Risk Level</InputLabel>
                      <Select
                        value={filters.riskLevel}
                        onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                        label="Risk Level"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="outlined"
                      onClick={() => setFilters({
                        status: 'all',
                        customer: '',
                        dateFrom: '',
                        dateTo: '',
                        priority: 'all',
                        riskLevel: 'all',
                        assignedTo: '',
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
                      <TableCell sx={{ fontWeight: 600 }}>Outstanding</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Days Overdue</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
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
                              {receivable.customerId} • {receivable.customerType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {receivable.invoiceId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(receivable.invoiceDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(receivable.dueDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(receivable.outstandingAmount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Credit: {formatCurrency(receivable.creditAvailable)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${getDaysOverdue(receivable.dueDate)} days`}
                            color={getDaysOverdue(receivable.dueDate) > 30 ? 'error' : 
                                   getDaysOverdue(receivable.dueDate) > 0 ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={receivable.priority}
                            color={getPriorityColor(receivable.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(receivable.status)}
                            label={receivable.status} 
                            color={getStatusColor(receivable.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleReceivableSelect(receivable)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Record Payment">
                              <IconButton 
                                size="small" 
                                onClick={() => setPaymentDialog({ open: true, receivable })}
                                color="success"
                              >
                                <PaymentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Send Reminder">
                              <IconButton 
                                size="small" 
                                onClick={() => handleSendReminder(receivable.id)}
                                color="warning"
                              >
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Escalate">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEscalate(receivable.id)}
                                color="error"
                              >
                                <PriorityHighIcon fontSize="small" />
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
                Credit Limit Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Credit limits, terms, and risk assessment
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aging Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed aging analysis and collection strategies
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Automated Reminders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reminder management and automated communications
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Receivables Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive reporting and analytics
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
            <Typography variant="h6">
              Record Payment
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Payment Date"
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paymentDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
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
                placeholder="Additional payment notes"
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
            onClick={() => handlePayment(paymentDialog.receivable.id, paymentData.amount)}
            disabled={paymentData.amount <= 0}
            startIcon={<PaymentIcon />}
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

export default AdvancedReceivablesModule;
