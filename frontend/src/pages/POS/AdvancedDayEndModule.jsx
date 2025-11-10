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
  Event as DayEndIcon,
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
  Backup as BackupIcon,
  CloudUpload as CloudUploadIcon,
  Storage as StorageIcon,
  DataUsage as DataUsageIcon,
  Analytics as AnalyticsIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  TableChart as TableChartIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  Description as DescriptionIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  DeleteForever as DeleteForeverIcon,
  Restore as RestoreIcon,
  Settings as SettingsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon2,
  NetworkCheck as NetworkCheckIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  BusinessCenter as BusinessCenterIcon,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  MonetizationOn as MonetizationOnIcon,
  TrendingFlat as TrendingFlatIcon,
  TrendingDown as TrendingDownIcon2,
  TrendingUp as TrendingUpIcon2,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';

const AdvancedDayEndModule = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
  // Day End state
  const [dayEndProcesses, setDayEndProcesses] = useState([]);
  const [selectedDayEnd, setSelectedDayEnd] = useState(null);
  const [dayEndDialog, setDayEndDialog] = useState({ open: false, dayEnd: null, type: 'add' });
  
  // Day End form state
  const [dayEndData, setDayEndData] = useState({
    id: '',
    dayEndId: '',
    location: '',
    department: '',
    processDate: '',
    startTime: '',
    endTime: '',
    status: 'pending', // pending, in_progress, completed, failed, cancelled
    initiatedBy: '',
    approvedBy: '',
    salesSummary: {
      totalSales: 0,
      totalTransactions: 0,
      averageTransactionValue: 0,
      cashSales: 0,
      cardSales: 0,
      onlineSales: 0,
      refunds: 0,
      discounts: 0,
    },
    inventorySummary: {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      damagedItems: 0,
      returnedItems: 0,
    },
    financialSummary: {
      totalRevenue: 0,
      totalCosts: 0,
      grossProfit: 0,
      netProfit: 0,
      taxes: 0,
      expenses: 0,
    },
    terminalSummary: {
      totalTerminals: 0,
      activeTerminals: 0,
      offlineTerminals: 0,
      syncErrors: 0,
      lastSync: '',
    },
    settlementSummary: {
      totalSettlements: 0,
      pendingSettlements: 0,
      completedSettlements: 0,
      discrepancies: 0,
      totalCash: 0,
    },
    receivablesSummary: {
      totalOutstanding: 0,
      newReceivables: 0,
      collectedAmount: 0,
      overdueAmount: 0,
      customersWithOverdue: 0,
    },
    deliverySummary: {
      totalDeliveries: 0,
      completedDeliveries: 0,
      pendingDeliveries: 0,
      failedDeliveries: 0,
      averageDeliveryTime: 0,
    },
    reports: {
      salesReport: false,
      inventoryReport: false,
      financialReport: false,
      terminalReport: false,
      settlementReport: false,
      receivablesReport: false,
      deliveryReport: false,
      consolidatedReport: false,
    },
    backups: {
      databaseBackup: false,
      fileBackup: false,
      cloudBackup: false,
      backupLocation: '',
      backupSize: 0,
      backupTime: '',
    },
    notifications: {
      emailSent: false,
      smsSent: false,
      managerNotified: false,
      lastNotification: '',
    },
    auditTrail: [],
    metadata: {
      notes: '',
      tags: [],
      priority: 'normal',
      costCenter: '',
    },
  });
  
  // Process state
  const [processSteps, setProcessSteps] = useState([
    { label: 'Sales Summary', completed: false, active: true },
    { label: 'Inventory Check', completed: false, active: false },
    { label: 'Financial Reconciliation', completed: false, active: false },
    { label: 'Terminal Sync', completed: false, active: false },
    { label: 'Settlement Review', completed: false, active: false },
    { label: 'Receivables Update', completed: false, active: false },
    { label: 'Delivery Status', completed: false, active: false },
    { label: 'Report Generation', completed: false, active: false },
    { label: 'Backup Creation', completed: false, active: false },
    { label: 'Process Complete', completed: false, active: false },
  ]);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    location: '',
    dateFrom: '',
    dateTo: '',
    initiatedBy: '',
  });
  
  // Data states
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [summary, setSummary] = useState({
    totalProcesses: 0,
    completedToday: 0,
    pendingProcesses: 0,
    failedProcesses: 0,
    averageProcessTime: 0,
    lastSuccessfulProcess: '',
  });

  useEffect(() => {
    initializeAdvancedDayEnd();
  }, []);

  const initializeAdvancedDayEnd = async () => {
    try {
      setLoading(true);
      
      // Load currencies
      const currencyList = await currencyService.getActiveCurrencies();
      setCurrencies(currencyList);
      
      // Load mock data
      await loadDayEndProcesses();
      await calculateSummary();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize advanced day end: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadDayEndProcesses = async () => {
    try {
      // Mock data - replace with actual API call
      const mockDayEndProcesses = [
        {
          id: '1',
          dayEndId: 'DE-001',
          location: 'Main Store',
          department: 'Sales',
          processDate: '2025-01-27',
          startTime: '2025-01-27T18:00:00Z',
          endTime: '2025-01-27T19:30:00Z',
          status: 'completed',
          initiatedBy: 'John Manager',
          approvedBy: 'Jane Supervisor',
          salesSummary: {
            totalSales: 125000.00,
            totalTransactions: 245,
            averageTransactionValue: 510.20,
            cashSales: 75000.00,
            cardSales: 40000.00,
            onlineSales: 10000.00,
            refunds: 2500.00,
            discounts: 5000.00,
          },
          inventorySummary: {
            totalItems: 1250,
            lowStockItems: 15,
            outOfStockItems: 3,
            damagedItems: 2,
            returnedItems: 8,
          },
          financialSummary: {
            totalRevenue: 125000.00,
            totalCosts: 75000.00,
            grossProfit: 50000.00,
            netProfit: 45000.00,
            taxes: 15000.00,
            expenses: 5000.00,
          },
          terminalSummary: {
            totalTerminals: 5,
            activeTerminals: 5,
            offlineTerminals: 0,
            syncErrors: 0,
            lastSync: '2025-01-27T18:45:00Z',
          },
          settlementSummary: {
            totalSettlements: 5,
            pendingSettlements: 0,
            completedSettlements: 5,
            discrepancies: 0,
            totalCash: 75000.00,
          },
          receivablesSummary: {
            totalOutstanding: 25000.00,
            newReceivables: 5000.00,
            collectedAmount: 3000.00,
            overdueAmount: 5000.00,
            customersWithOverdue: 3,
          },
          deliverySummary: {
            totalDeliveries: 12,
            completedDeliveries: 10,
            pendingDeliveries: 2,
            failedDeliveries: 0,
            averageDeliveryTime: 35,
          },
          reports: {
            salesReport: true,
            inventoryReport: true,
            financialReport: true,
            terminalReport: true,
            settlementReport: true,
            receivablesReport: true,
            deliveryReport: true,
            consolidatedReport: true,
          },
          backups: {
            databaseBackup: true,
            fileBackup: true,
            cloudBackup: true,
            backupLocation: 'Cloud Storage',
            backupSize: 2.5,
            backupTime: '2025-01-27T19:15:00Z',
          },
          notifications: {
            emailSent: true,
            smsSent: true,
            managerNotified: true,
            lastNotification: '2025-01-27T19:30:00Z',
          },
          auditTrail: [
            { timestamp: '2025-01-27T18:00:00Z', action: 'Day end process started', user: 'John Manager', details: 'Process initiated' },
            { timestamp: '2025-01-27T18:15:00Z', action: 'Sales summary generated', user: 'System', details: 'Sales data processed' },
            { timestamp: '2025-01-27T18:30:00Z', action: 'Inventory check completed', user: 'System', details: 'Inventory reconciled' },
            { timestamp: '2025-01-27T18:45:00Z', action: 'Terminal sync completed', user: 'System', details: 'All terminals synced' },
            { timestamp: '2025-01-27T19:00:00Z', action: 'Reports generated', user: 'System', details: 'All reports created' },
            { timestamp: '2025-01-27T19:15:00Z', action: 'Backup completed', user: 'System', details: 'Data backed up successfully' },
            { timestamp: '2025-01-27T19:30:00Z', action: 'Day end process completed', user: 'John Manager', details: 'Process completed successfully' },
          ],
          metadata: {
            notes: 'Regular day end process - no issues',
            tags: ['Standard', 'Completed'],
            priority: 'normal',
            costCenter: 'CC001',
          },
        },
        {
          id: '2',
          dayEndId: 'DE-002',
          location: 'Branch Store',
          department: 'Sales',
          processDate: '2025-01-27',
          startTime: '2025-01-27T18:00:00Z',
          endTime: '',
          status: 'in_progress',
          initiatedBy: 'Alice Manager',
          approvedBy: '',
          salesSummary: {
            totalSales: 85000.00,
            totalTransactions: 180,
            averageTransactionValue: 472.22,
            cashSales: 50000.00,
            cardSales: 30000.00,
            onlineSales: 5000.00,
            refunds: 1500.00,
            discounts: 3000.00,
          },
          inventorySummary: {
            totalItems: 800,
            lowStockItems: 8,
            outOfStockItems: 1,
            damagedItems: 1,
            returnedItems: 5,
          },
          financialSummary: {
            totalRevenue: 85000.00,
            totalCosts: 51000.00,
            grossProfit: 34000.00,
            netProfit: 30000.00,
            taxes: 10200.00,
            expenses: 4000.00,
          },
          terminalSummary: {
            totalTerminals: 3,
            activeTerminals: 2,
            offlineTerminals: 1,
            syncErrors: 2,
            lastSync: '2025-01-27T18:30:00Z',
          },
          settlementSummary: {
            totalSettlements: 3,
            pendingSettlements: 1,
            completedSettlements: 2,
            discrepancies: 1,
            totalCash: 50000.00,
          },
          receivablesSummary: {
            totalOutstanding: 15000.00,
            newReceivables: 3000.00,
            collectedAmount: 2000.00,
            overdueAmount: 3000.00,
            customersWithOverdue: 2,
          },
          deliverySummary: {
            totalDeliveries: 8,
            completedDeliveries: 6,
            pendingDeliveries: 2,
            failedDeliveries: 0,
            averageDeliveryTime: 40,
          },
          reports: {
            salesReport: true,
            inventoryReport: true,
            financialReport: false,
            terminalReport: false,
            settlementReport: false,
            receivablesReport: false,
            deliveryReport: false,
            consolidatedReport: false,
          },
          backups: {
            databaseBackup: false,
            fileBackup: false,
            cloudBackup: false,
            backupLocation: '',
            backupSize: 0,
            backupTime: '',
          },
          notifications: {
            emailSent: false,
            smsSent: false,
            managerNotified: false,
            lastNotification: '',
          },
          auditTrail: [
            { timestamp: '2025-01-27T18:00:00Z', action: 'Day end process started', user: 'Alice Manager', details: 'Process initiated' },
            { timestamp: '2025-01-27T18:15:00Z', action: 'Sales summary generated', user: 'System', details: 'Sales data processed' },
            { timestamp: '2025-01-27T18:30:00Z', action: 'Inventory check completed', user: 'System', details: 'Inventory reconciled' },
            { timestamp: '2025-01-27T18:45:00Z', action: 'Terminal sync issues', user: 'System', details: 'Terminal T003 offline' },
          ],
          metadata: {
            notes: 'Day end in progress - terminal sync issues',
            tags: ['In Progress', 'Issues'],
            priority: 'high',
            costCenter: 'CC002',
          },
        },
        {
          id: '3',
          dayEndId: 'DE-003',
          location: 'Main Store',
          department: 'Sales',
          processDate: '2025-01-26',
          startTime: '2025-01-26T18:00:00Z',
          endTime: '2025-01-26T19:45:00Z',
          status: 'completed',
          initiatedBy: 'Bob Manager',
          approvedBy: 'Jane Supervisor',
          salesSummary: {
            totalSales: 110000.00,
            totalTransactions: 220,
            averageTransactionValue: 500.00,
            cashSales: 66000.00,
            cardSales: 35000.00,
            onlineSales: 9000.00,
            refunds: 2000.00,
            discounts: 4000.00,
          },
          inventorySummary: {
            totalItems: 1200,
            lowStockItems: 12,
            outOfStockItems: 2,
            damagedItems: 1,
            returnedItems: 6,
          },
          financialSummary: {
            totalRevenue: 110000.00,
            totalCosts: 66000.00,
            grossProfit: 44000.00,
            netProfit: 39000.00,
            taxes: 13200.00,
            expenses: 5000.00,
          },
          terminalSummary: {
            totalTerminals: 5,
            activeTerminals: 5,
            offlineTerminals: 0,
            syncErrors: 0,
            lastSync: '2025-01-26T19:30:00Z',
          },
          settlementSummary: {
            totalSettlements: 5,
            pendingSettlements: 0,
            completedSettlements: 5,
            discrepancies: 0,
            totalCash: 66000.00,
          },
          receivablesSummary: {
            totalOutstanding: 20000.00,
            newReceivables: 4000.00,
            collectedAmount: 2500.00,
            overdueAmount: 4000.00,
            customersWithOverdue: 2,
          },
          deliverySummary: {
            totalDeliveries: 10,
            completedDeliveries: 9,
            pendingDeliveries: 1,
            failedDeliveries: 0,
            averageDeliveryTime: 32,
          },
          reports: {
            salesReport: true,
            inventoryReport: true,
            financialReport: true,
            terminalReport: true,
            settlementReport: true,
            receivablesReport: true,
            deliveryReport: true,
            consolidatedReport: true,
          },
          backups: {
            databaseBackup: true,
            fileBackup: true,
            cloudBackup: true,
            backupLocation: 'Cloud Storage',
            backupSize: 2.3,
            backupTime: '2025-01-26T19:30:00Z',
          },
          notifications: {
            emailSent: true,
            smsSent: true,
            managerNotified: true,
            lastNotification: '2025-01-26T19:45:00Z',
          },
          auditTrail: [
            { timestamp: '2025-01-26T18:00:00Z', action: 'Day end process started', user: 'Bob Manager', details: 'Process initiated' },
            { timestamp: '2025-01-26T18:15:00Z', action: 'Sales summary generated', user: 'System', details: 'Sales data processed' },
            { timestamp: '2025-01-26T18:30:00Z', action: 'Inventory check completed', user: 'System', details: 'Inventory reconciled' },
            { timestamp: '2025-01-26T18:45:00Z', action: 'Terminal sync completed', user: 'System', details: 'All terminals synced' },
            { timestamp: '2025-01-26T19:00:00Z', action: 'Reports generated', user: 'System', details: 'All reports created' },
            { timestamp: '2025-01-26T19:30:00Z', action: 'Backup completed', user: 'System', details: 'Data backed up successfully' },
            { timestamp: '2025-01-26T19:45:00Z', action: 'Day end process completed', user: 'Bob Manager', details: 'Process completed successfully' },
          ],
          metadata: {
            notes: 'Regular day end process - no issues',
            tags: ['Standard', 'Completed'],
            priority: 'normal',
            costCenter: 'CC001',
          },
        },
      ];
      
      setDayEndProcesses(mockDayEndProcesses);
    } catch (error) {
      console.error('Failed to load day end processes:', error);
    }
  };

  const calculateSummary = () => {
    const totalProcesses = dayEndProcesses.length;
    const completedToday = dayEndProcesses.filter(d => 
      d.processDate === new Date().toISOString().split('T')[0] && d.status === 'completed'
    ).length;
    const pendingProcesses = dayEndProcesses.filter(d => d.status === 'pending' || d.status === 'in_progress').length;
    const failedProcesses = dayEndProcesses.filter(d => d.status === 'failed').length;
    const averageProcessTime = dayEndProcesses.length > 0 
      ? dayEndProcesses.reduce((sum, d) => {
          if (d.endTime && d.startTime) {
            const start = new Date(d.startTime);
            const end = new Date(d.endTime);
            return sum + (end - start) / (1000 * 60 * 60); // hours
          }
          return sum;
        }, 0) / dayEndProcesses.length 
      : 0;
    const lastSuccessfulProcess = dayEndProcesses
      .filter(d => d.status === 'completed')
      .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))[0]?.endTime || '';
    
    setSummary({
      totalProcesses,
      completedToday,
      pendingProcesses,
      failedProcesses,
      averageProcessTime,
      lastSuccessfulProcess,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDayEndSelect = (dayEnd) => {
    setSelectedDayEnd(dayEnd);
  };

  const handleStartDayEnd = async (dayEndId) => {
    try {
      const dayEnd = dayEndProcesses.find(d => d.id === dayEndId);
      if (!dayEnd) return;
      
      const updatedDayEnd = {
        ...dayEnd,
        status: 'in_progress',
        startTime: new Date().toISOString(),
        auditTrail: [
          ...dayEnd.auditTrail,
          {
            timestamp: new Date().toISOString(),
            action: 'Day end process started',
            user: 'Current User',
            details: 'Process initiated',
          },
        ],
      };
      
      setDayEndProcesses(prev => prev.map(d => d.id === dayEndId ? updatedDayEnd : d));
      setSnackbar({ open: true, message: 'Day end process started successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to start day end process: ' + error.message, severity: 'error' });
    }
  };

  const handleCompleteDayEnd = async (dayEndId) => {
    try {
      const dayEnd = dayEndProcesses.find(d => d.id === dayEndId);
      if (!dayEnd) return;
      
      const updatedDayEnd = {
        ...dayEnd,
        status: 'completed',
        endTime: new Date().toISOString(),
        reports: {
          salesReport: true,
          inventoryReport: true,
          financialReport: true,
          terminalReport: true,
          settlementReport: true,
          receivablesReport: true,
          deliveryReport: true,
          consolidatedReport: true,
        },
        backups: {
          databaseBackup: true,
          fileBackup: true,
          cloudBackup: true,
          backupLocation: 'Cloud Storage',
          backupSize: 2.5,
          backupTime: new Date().toISOString(),
        },
        notifications: {
          emailSent: true,
          smsSent: true,
          managerNotified: true,
          lastNotification: new Date().toISOString(),
        },
        auditTrail: [
          ...dayEnd.auditTrail,
          {
            timestamp: new Date().toISOString(),
            action: 'Day end process completed',
            user: 'Current User',
            details: 'Process completed successfully',
          },
        ],
      };
      
      setDayEndProcesses(prev => prev.map(d => d.id === dayEndId ? updatedDayEnd : d));
      setSnackbar({ open: true, message: 'Day end process completed successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to complete day end process: ' + error.message, severity: 'error' });
    }
  };

  const handleGenerateReports = async (dayEndId) => {
    try {
      const dayEnd = dayEndProcesses.find(d => d.id === dayEndId);
      if (!dayEnd) return;
      
      const updatedDayEnd = {
        ...dayEnd,
        reports: {
          salesReport: true,
          inventoryReport: true,
          financialReport: true,
          terminalReport: true,
          settlementReport: true,
          receivablesReport: true,
          deliveryReport: true,
          consolidatedReport: true,
        },
        auditTrail: [
          ...dayEnd.auditTrail,
          {
            timestamp: new Date().toISOString(),
            action: 'Reports generated',
            user: 'System',
            details: 'All reports created successfully',
          },
        ],
      };
      
      setDayEndProcesses(prev => prev.map(d => d.id === dayEndId ? updatedDayEnd : d));
      setSnackbar({ open: true, message: 'Reports generated successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to generate reports: ' + error.message, severity: 'error' });
    }
  };

  const handleCreateBackup = async (dayEndId) => {
    try {
      const dayEnd = dayEndProcesses.find(d => d.id === dayEndId);
      if (!dayEnd) return;
      
      const updatedDayEnd = {
        ...dayEnd,
        backups: {
          databaseBackup: true,
          fileBackup: true,
          cloudBackup: true,
          backupLocation: 'Cloud Storage',
          backupSize: 2.5,
          backupTime: new Date().toISOString(),
        },
        auditTrail: [
          ...dayEnd.auditTrail,
          {
            timestamp: new Date().toISOString(),
            action: 'Backup created',
            user: 'System',
            details: 'Data backed up successfully',
          },
        ],
      };
      
      setDayEndProcesses(prev => prev.map(d => d.id === dayEndId ? updatedDayEnd : d));
      setSnackbar({ open: true, message: 'Backup created successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create backup: ' + error.message, severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'info',
      in_progress: 'warning',
      completed: 'success',
      failed: 'error',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <ScheduleIcon />,
      in_progress: <RefreshIcon />,
      completed: <CheckIcon />,
      failed: <ErrorIcon />,
      cancelled: <CancelIcon />,
    };
    return icons[status] || <ScheduleIcon />;
  };

  const formatCurrency = (amount) => {
    return currencyService.formatCurrency(amount, selectedCurrency);
  };

  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  const getFilteredDayEndProcesses = () => {
    let filtered = dayEndProcesses;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(d => d.status === filters.status);
    }
    
    if (filters.location) {
      filtered = filtered.filter(d => 
        d.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(d => d.processDate >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(d => d.processDate <= filters.dateTo);
    }
    
    if (filters.initiatedBy) {
      filtered = filtered.filter(d => 
        d.initiatedBy.toLowerCase().includes(filters.initiatedBy.toLowerCase())
      );
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
            <DayEndIcon sx={{ fontSize: 40 }} />
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
                Advanced Day End
              </Typography>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Multi-location closing, consolidated reports, and automated backups
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
                  Total Processes
                </Typography>
                <Typography variant="h4" color="primary">
                  {summary.totalProcesses}
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
                <Typography variant="h6" color="success.main" gutterBottom>
                  Completed Today
                </Typography>
                <Typography variant="h4" color="success.main">
                  {summary.completedToday}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Processes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  Pending Processes
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {summary.pendingProcesses}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Awaiting completion
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main" gutterBottom>
                  Avg. Process Time
                </Typography>
                <Typography variant="h4" color="info.main">
                  {Math.round(summary.averageProcessTime * 60)}m
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Minutes
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
            <Tab icon={<DayEndIcon />} iconPosition="start" label="Day End Processes" />
            <Tab icon={<BarChartIcon />} iconPosition="start" label="Consolidated Reports" />
            <Tab icon={<BackupIcon />} iconPosition="start" label="Automated Backups" />
            <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Advanced Analytics" />
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
                      label="Search Location"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
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
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
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
                        location: '',
                        dateFrom: '',
                        dateTo: '',
                        initiatedBy: '',
                      })}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Day End Processes Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Process</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Sales Summary</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredDayEndProcesses().map((dayEnd) => (
                      <TableRow 
                        key={dayEnd.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {dayEnd.dayEndId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dayEnd.initiatedBy}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {dayEnd.location}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dayEnd.department}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(dayEnd.processDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dayEnd.startTime ? new Date(dayEnd.startTime).toLocaleTimeString() : 'Not started'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(dayEnd.salesSummary.totalSales)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dayEnd.salesSummary.totalTransactions} transactions
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(dayEnd.status)}
                            label={dayEnd.status.replace('_', ' ')} 
                            color={getStatusColor(dayEnd.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {dayEnd.endTime && dayEnd.startTime ? 
                              `${Math.round((new Date(dayEnd.endTime) - new Date(dayEnd.startTime)) / (1000 * 60))}m` : 
                              'In progress'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDayEndSelect(dayEnd)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {dayEnd.status === 'pending' && (
                              <Tooltip title="Start Process">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleStartDayEnd(dayEnd.id)}
                                  color="success"
                                >
                                  <StartIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {dayEnd.status === 'in_progress' && (
                              <Tooltip title="Complete Process">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleCompleteDayEnd(dayEnd.id)}
                                  color="success"
                                >
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Generate Reports">
                              <IconButton 
                                size="small" 
                                onClick={() => handleGenerateReports(dayEnd.id)}
                                color="primary"
                              >
                                <ReportIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Create Backup">
                              <IconButton 
                                size="small" 
                                onClick={() => handleCreateBackup(dayEnd.id)}
                                color="secondary"
                              >
                                <BackupIcon fontSize="small" />
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
                Consolidated Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Multi-location consolidated reporting and analytics
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Automated Backups
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Automated backup creation and cloud storage management
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Advanced Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced analytics and business intelligence
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Day End Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive day end reporting and documentation
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

export default AdvancedDayEndModule;
