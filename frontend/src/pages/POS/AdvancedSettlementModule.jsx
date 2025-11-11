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
  AccountBalance as SettlementIcon,
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
  Approval as ApprovalIcon,
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
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';

const AdvancedSettlementModule = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
  // Settlement state
  const [settlements, setSettlements] = useState([]);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [settlementDialog, setSettlementDialog] = useState({ open: false, settlement: null, type: 'add' });
  
  // Settlement form state
  const [settlementData, setSettlementData] = useState({
    id: '',
    settlementId: '',
    cashierId: '',
    cashierName: '',
    terminalId: '',
    shiftId: '',
    sessionId: '',
    settlementDate: '',
    startTime: '',
    endTime: '',
    openingBalance: 0,
    closingBalance: 0,
    expectedCash: 0,
    actualCash: 0,
    difference: 0,
    status: 'pending', // pending, submitted, approved, rejected, completed
    approvalWorkflow: {
      requiresApproval: true,
      approverId: '',
      approverName: '',
      approvalDate: '',
      approvalNotes: '',
      rejectionReason: '',
    },
    auditTrail: [],
    reports: {
      salesReport: false,
      cashReport: false,
      discrepancyReport: false,
      auditReport: false,
    },
    notifications: {
      emailSent: false,
      smsSent: false,
      managerNotified: false,
    },
    metadata: {
      location: '',
      department: '',
      costCenter: '',
      notes: '',
    },
  });
  
  // Workflow state
  const [workflowSteps, setWorkflowSteps] = useState([
    { label: 'Cash Count', completed: false, active: true },
    { label: 'Manager Review', completed: false, active: false },
    { label: 'Approval', completed: false, active: false },
    { label: 'Audit Trail', completed: false, active: false },
    { label: 'Reports Generated', completed: false, active: false },
  ]);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    cashier: '',
    dateFrom: '',
    dateTo: '',
    requiresApproval: 'all',
  });
  
  // Data states
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [summary, setSummary] = useState({
    totalSettlements: 0,
    pendingApprovals: 0,
    completedToday: 0,
    totalDiscrepancies: 0,
    averageSettlementTime: 0,
  });

  useEffect(() => {
    initializeAdvancedSettlement();
  }, []);

  const initializeAdvancedSettlement = async () => {
    try {
      setLoading(true);
      
      // Load currencies
      const currencyList = await currencyService.getActiveCurrencies();
      setCurrencies(currencyList);
      
      // Load mock data
      await loadSettlements();
      await calculateSummary();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize advanced settlement: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadSettlements = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSettlements = [
        {
          id: '1',
          settlementId: 'SET-001',
          cashierId: 'C001',
          cashierName: 'John Doe',
          terminalId: 'T001',
          shiftId: 'SH001',
          sessionId: 'SES001',
          settlementDate: '2025-01-27',
          startTime: '2025-01-27T09:00:00Z',
          endTime: '2025-01-27T17:00:00Z',
          openingBalance: 1000.00,
          closingBalance: 8500.00,
          expectedCash: 7500.00,
          actualCash: 7500.00,
          difference: 0.00,
          status: 'completed',
          approvalWorkflow: {
            requiresApproval: true,
            approverId: 'M001',
            approverName: 'Jane Manager',
            approvalDate: '2025-01-27T17:30:00Z',
            approvalNotes: 'Settlement approved - no discrepancies',
            rejectionReason: '',
          },
          auditTrail: [
            { timestamp: '2025-01-27T17:00:00Z', action: 'Settlement submitted', user: 'John Doe', details: 'Cash count completed' },
            { timestamp: '2025-01-27T17:15:00Z', action: 'Manager review started', user: 'Jane Manager', details: 'Reviewing settlement details' },
            { timestamp: '2025-01-27T17:30:00Z', action: 'Settlement approved', user: 'Jane Manager', details: 'No discrepancies found' },
            { timestamp: '2025-01-27T17:35:00Z', action: 'Reports generated', user: 'System', details: 'All reports generated successfully' },
          ],
          reports: {
            salesReport: true,
            cashReport: true,
            discrepancyReport: true,
            auditReport: true,
          },
          notifications: {
            emailSent: true,
            smsSent: false,
            managerNotified: true,
          },
          metadata: {
            location: 'Main Store',
            department: 'Sales',
            costCenter: 'CC001',
            notes: 'Regular settlement - no issues',
          },
        },
        {
          id: '2',
          settlementId: 'SET-002',
          cashierId: 'C002',
          cashierName: 'Alice Smith',
          terminalId: 'T002',
          shiftId: 'SH002',
          sessionId: 'SES002',
          settlementDate: '2025-01-27',
          startTime: '2025-01-27T14:00:00Z',
          endTime: '2025-01-27T22:00:00Z',
          openingBalance: 1000.00,
          closingBalance: 9200.00,
          expectedCash: 8200.00,
          actualCash: 8150.00,
          difference: -50.00,
          status: 'pending',
          approvalWorkflow: {
            requiresApproval: true,
            approverId: '',
            approverName: '',
            approvalDate: '',
            approvalNotes: '',
            rejectionReason: '',
          },
          auditTrail: [
            { timestamp: '2025-01-27T22:00:00Z', action: 'Settlement submitted', user: 'Alice Smith', details: 'Cash count completed with discrepancy' },
          ],
          reports: {
            salesReport: false,
            cashReport: false,
            discrepancyReport: false,
            auditReport: false,
          },
          notifications: {
            emailSent: false,
            smsSent: false,
            managerNotified: false,
          },
          metadata: {
            location: 'Branch Store',
            department: 'Sales',
            costCenter: 'CC002',
            notes: 'Discrepancy of $50 - requires manager review',
          },
        },
        {
          id: '3',
          settlementId: 'SET-003',
          cashierId: 'C003',
          cashierName: 'Bob Johnson',
          terminalId: 'T003',
          shiftId: 'SH003',
          sessionId: 'SES003',
          settlementDate: '2025-01-26',
          startTime: '2025-01-26T09:00:00Z',
          endTime: '2025-01-26T17:00:00Z',
          openingBalance: 1000.00,
          closingBalance: 6800.00,
          expectedCash: 5800.00,
          actualCash: 5800.00,
          difference: 0.00,
          status: 'approved',
          approvalWorkflow: {
            requiresApproval: true,
            approverId: 'M001',
            approverName: 'Jane Manager',
            approvalDate: '2025-01-26T17:45:00Z',
            approvalNotes: 'Settlement approved after review',
            rejectionReason: '',
          },
          auditTrail: [
            { timestamp: '2025-01-26T17:00:00Z', action: 'Settlement submitted', user: 'Bob Johnson', details: 'Cash count completed' },
            { timestamp: '2025-01-26T17:30:00Z', action: 'Manager review started', user: 'Jane Manager', details: 'Reviewing settlement details' },
            { timestamp: '2025-01-26T17:45:00Z', action: 'Settlement approved', user: 'Jane Manager', details: 'Approved after verification' },
          ],
          reports: {
            salesReport: true,
            cashReport: true,
            discrepancyReport: true,
            auditReport: false,
          },
          notifications: {
            emailSent: true,
            smsSent: true,
            managerNotified: true,
          },
          metadata: {
            location: 'Main Store',
            department: 'Sales',
            costCenter: 'CC001',
            notes: 'Standard settlement',
          },
        },
      ];
      
      setSettlements(mockSettlements);
    } catch (error) {
      console.error('Failed to load settlements:', error);
    }
  };

  const calculateSummary = () => {
    const totalSettlements = settlements.length;
    const pendingApprovals = settlements.filter(s => s.status === 'pending').length;
    const completedToday = settlements.filter(s => 
      s.settlementDate === new Date().toISOString().split('T')[0] && s.status === 'completed'
    ).length;
    const totalDiscrepancies = settlements.filter(s => s.difference !== 0).length;
    const averageSettlementTime = settlements.length > 0 
      ? settlements.reduce((sum, s) => {
          const start = new Date(s.startTime);
          const end = new Date(s.endTime);
          return sum + (end - start) / (1000 * 60 * 60); // hours
        }, 0) / settlements.length 
      : 0;
    
    setSummary({
      totalSettlements,
      pendingApprovals,
      completedToday,
      totalDiscrepancies,
      averageSettlementTime,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettlementSelect = (settlement) => {
    setSelectedSettlement(settlement);
  };

  const handleApproveSettlement = async (settlementId) => {
    try {
      const settlement = settlements.find(s => s.id === settlementId);
      if (!settlement) return;
      
      const updatedSettlement = {
        ...settlement,
        status: 'approved',
        approvalWorkflow: {
          ...settlement.approvalWorkflow,
          approverId: 'M001',
          approverName: 'Jane Manager',
          approvalDate: new Date().toISOString(),
          approvalNotes: 'Settlement approved',
        },
        auditTrail: [
          ...settlement.auditTrail,
          {
            timestamp: new Date().toISOString(),
            action: 'Settlement approved',
            user: 'Jane Manager',
            details: 'Approved after review',
          },
        ],
      };
      
      setSettlements(prev => prev.map(s => s.id === settlementId ? updatedSettlement : s));
      setSnackbar({ open: true, message: 'Settlement approved successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to approve settlement: ' + error.message, severity: 'error' });
    }
  };

  const handleRejectSettlement = async (settlementId, reason) => {
    try {
      const settlement = settlements.find(s => s.id === settlementId);
      if (!settlement) return;
      
      const updatedSettlement = {
        ...settlement,
        status: 'rejected',
        approvalWorkflow: {
          ...settlement.approvalWorkflow,
          approverId: 'M001',
          approverName: 'Jane Manager',
          approvalDate: new Date().toISOString(),
          rejectionReason: reason,
        },
        auditTrail: [
          ...settlement.auditTrail,
          {
            timestamp: new Date().toISOString(),
            action: 'Settlement rejected',
            user: 'Jane Manager',
            details: `Rejected: ${reason}`,
          },
        ],
      };
      
      setSettlements(prev => prev.map(s => s.id === settlementId ? updatedSettlement : s));
      setSnackbar({ open: true, message: 'Settlement rejected', severity: 'warning' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to reject settlement: ' + error.message, severity: 'error' });
    }
  };

  const handleGenerateReports = async (settlementId) => {
    try {
      setSettlements(prev => prev.map(s => 
        s.id === settlementId 
          ? {
              ...s,
              reports: {
                salesReport: true,
                cashReport: true,
                discrepancyReport: true,
                auditReport: true,
              },
              auditTrail: [
                ...s.auditTrail,
                {
                  timestamp: new Date().toISOString(),
                  action: 'Reports generated',
                  user: 'System',
                  details: 'All reports generated successfully',
                },
              ],
            }
          : s
      ));
      
      setSnackbar({ open: true, message: 'Reports generated successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to generate reports: ' + error.message, severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      submitted: 'info',
      approved: 'success',
      rejected: 'error',
      completed: 'success',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <ScheduleIcon />,
      submitted: <UploadIcon />,
      approved: <CheckIcon />,
      rejected: <ErrorIcon />,
      completed: <CheckIcon />,
    };
    return icons[status] || <ScheduleIcon />;
  };

  const formatCurrency = (amount) => {
    return currencyService.formatCurrency(amount, selectedCurrency);
  };

  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  const getFilteredSettlements = () => {
    let filtered = settlements;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    
    if (filters.cashier) {
      filtered = filtered.filter(s => 
        s.cashierName.toLowerCase().includes(filters.cashier.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(s => s.settlementDate >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(s => s.settlementDate <= filters.dateTo);
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
            <SettlementIcon sx={{ fontSize: 40 }} />
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
                Advanced Settlement
              </Typography>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Multi-shift settlement with approval workflows and audit trails
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
                  Total Settlements
                </Typography>
                <Typography variant="h4" color="primary">
                  {summary.totalSettlements}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  Pending Approvals
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {summary.pendingApprovals}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Awaiting review
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Completed Today
                </Typography>
                <Typography variant="h4" color="success.main">
                  {summary.completedToday}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Settlements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Discrepancies
                </Typography>
                <Typography variant="h4" color="error">
                  {summary.totalDiscrepancies}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Require attention
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
            <Tab icon={<SettlementIcon />} iconPosition="start" label="Settlements" />
            <Tab icon={<ApprovalIcon />} iconPosition="start" label="Approvals" />
            <Tab icon={<TimelineIcon />} iconPosition="start" label="Audit Trail" />
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
                      label="Search Cashier"
                      value={filters.cashier}
                      onChange={(e) => setFilters(prev => ({ ...prev, cashier: e.target.value }))}
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
                        <MenuItem value="submitted">Submitted</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="From Date"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="To Date"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="outlined"
                      onClick={() => setFilters({
                        status: 'all',
                        cashier: '',
                        dateFrom: '',
                        dateTo: '',
                        requiresApproval: 'all',
                      })}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Settlements Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Settlement</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Cashier</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Difference</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredSettlements().map((settlement) => (
                      <TableRow 
                        key={settlement.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {settlement.settlementId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {settlement.terminalId} • {settlement.metadata.location}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {settlement.cashierName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {settlement.cashierId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(settlement.settlementDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(settlement.startTime).toLocaleTimeString()} - {new Date(settlement.endTime).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(settlement.actualCash)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Expected: {formatCurrency(settlement.expectedCash)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={formatCurrency(settlement.difference)}
                            color={settlement.difference === 0 ? 'success' : settlement.difference > 0 ? 'info' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(settlement.status)}
                            label={settlement.status} 
                            color={getStatusColor(settlement.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleSettlementSelect(settlement)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {settlement.status === 'pending' && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleApproveSettlement(settlement.id)}
                                    color="success"
                                  >
                                    <CheckIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleRejectSettlement(settlement.id, 'Discrepancy found')}
                                    color="error"
                                  >
                                    <ErrorIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Generate Reports">
                              <IconButton 
                                size="small" 
                                onClick={() => handleGenerateReports(settlement.id)}
                                color="primary"
                              >
                                <ReportIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Print Settlement">
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
                Approval Workflow
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manager approval and review process
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Audit Trail
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete audit trail and compliance tracking
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Settlement Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive reporting and analytics
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

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

export default AdvancedSettlementModule;
