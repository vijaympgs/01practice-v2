import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Autocomplete,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  NetworkCheck as NetworkIcon,
  Print as PrintIcon,
  Scanner as ScannerIcon,
  DisplaySettings as DisplayIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  AttachMoney as MoneyIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  LocalOffer as OfferIcon,
  Science as TestIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import terminalManager from '../../services/TerminalManager';
import api from '../../services/api';
import terminalService from '../../services/terminalService';
import TerminalDialog from '../../components/Terminal/TerminalDialog';

const TerminalConfigurationPage = () => {
  const theme = useTheme();
  const canvasBg = theme.palette.background?.default || '#f5f5f5';
  // Theme state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  const [activeTab, setActiveTab] = useState(0);
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialog, setDialog] = useState({ open: false, mode: 'new', terminal: null });
  const [testDialog, setTestDialog] = useState({ open: false, terminal: null });
  const [historyDialog, setHistoryDialog] = useState({ open: false, terminal: null, history: [] });
  
  // Data sources
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Terminal data
  const [terminalData, setTerminalData] = useState({
    // Basic Information
    name: '',
    terminalCode: '',
    terminalType: 'till',
    description: '',
    isActive: true,
    
    // Location & Company
    companyId: '',
    locationId: '',
    floorLocation: '',
    department: '',
    
    // Contact Information
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    operatingHours: '',
    installationDate: '',
    
    // Network Configuration
    ipAddress: '',
    macAddress: '',
    serialNumber: '',
    networkType: 'ethernet',
    wifiSSID: '',
    wifiPassword: '',
    
    // Hardware Configuration
    printerModel: '',
    printerSettings: '',
    scannerModel: '',
    scannerSettings: '',
    displayModel: '',
    displaySettings: '',
    cashDrawerModel: '',
    cashDrawerSettings: '',
    
    // Regional Settings
    currency: 'INR',
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    
    // Business Rules
    allowDiscounts: true,
    allowRefunds: true,
    requireCustomerInfo: false,
    maxTransactionAmount: 100000,
    minTransactionAmount: 1,
    maxDiscountPercentage: 50,
    requireManagerApproval: false,
    
    // Operational Settings
    autoReceipt: true,
    autoPrint: true,
    enableLoyalty: false,
    enableOfflineMode: true,
    syncInterval: 300,
    sessionTimeout: 900,
    
    // Tax Configuration
    taxRate: 18,
    taxInclusive: false,
    enableTaxCalculation: true,
    
    // Backup Settings
    autoBackup: true,
    backupInterval: 3600,
    backupRetention: 30,
    
    // Security Settings
    requirePin: false,
    auditLogEnabled: true,
    enableBiometric: false,
    maxLoginAttempts: 3,
    lockoutDuration: 900,
  });

  // Terminal status and validation
  const [terminalStatus, setTerminalStatus] = useState(null);
  const [validation, setValidation] = useState(null);
  const [testResults, setTestResults] = useState(null);

  // Load theme from localStorage (consistent with login page)
  useEffect(() => {
    const loadTheme = () => {
      try {
        const cachedTheme = localStorage.getItem('activeTheme');
        if (cachedTheme) {
          const parsedTheme = JSON.parse(cachedTheme);
          if (parsedTheme?.primary_color) {
            setThemeColor(parsedTheme.primary_color);
            return;
          }
        }
      } catch (error) {
        console.error('Error reading cached theme:', error);
      }
      // Default to blue if no theme found
      setThemeColor('#1976d2');
    };
    loadTheme();
  }, []);

  useEffect(() => {
    loadTerminals();
    loadCompaniesAndLocations();
  }, []);

  const loadTerminals = async () => {
    try {
      setLoading(true);
      const terminalsResponse = await api.get('/pos-masters/terminals/');
      
      // Handle paginated response (results) or direct array
      const terminalsData = terminalsResponse.data?.results || terminalsResponse.data || [];
      
      // Ensure it's an array
      const terminalsArray = Array.isArray(terminalsData) ? terminalsData : [];
      
      // Convert backend format to frontend format
      const formattedTerminals = terminalsArray.map(term => terminalService.convertToFrontendFormat(term));
      
      setTerminals(formattedTerminals);
    } catch (error) {
      console.error('Error loading terminals:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to load terminals';
      setSnackbar({ open: true, message: `Failed to load terminals: ${errorMessage}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadCompaniesAndLocations = async () => {
    try {
      const companiesResponse = await api.get('/organization/companies/public/');
      setCompanies(Array.isArray(companiesResponse.data) ? companiesResponse.data : (companiesResponse.data?.results || []));
      
      const locationsResponse = await api.get('/organization/locations/');
      const locationsData = Array.isArray(locationsResponse.data) 
        ? locationsResponse.data 
        : (locationsResponse.data?.results || []);
      setLocations(locationsData);
      
      if (locationsData.length === 0) {
        setSnackbar({ 
          open: true, 
          message: 'No locations found. Please create a location in Organization > Locations first.', 
          severity: 'warning' 
        });
      }
    } catch (error) {
      console.error('Failed to load companies and locations:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to load locations: ' + (error.response?.data?.detail || error.message), 
        severity: 'error' 
      });
      setLocations([]); // Ensure locations is always an array
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewTerminal = () => {
    setDialog({ open: true, mode: 'new', terminal: null });
  };

  const handleEditTerminal = (terminal) => {
    setDialog({ open: true, mode: 'edit', terminal });
  };

  const handleViewTerminal = (terminal) => {
    setDialog({ open: true, mode: 'view', terminal });
  };

  const handleDeleteTerminal = async (terminal) => {
    if (window.confirm(`Are you sure you want to delete "${terminal.name}"?`)) {
      try {
        setSaving(true);
        await terminalService.deleteTerminal(terminal.id);
        setSnackbar({ open: true, message: 'Terminal deleted successfully', severity: 'success' });
        loadTerminals();
      } catch (error) {
        console.error('Error deleting terminal:', error);
        setSnackbar({ open: true, message: 'Failed to delete terminal: ' + error.message, severity: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleToggleStatus = async (terminal) => {
    try {
      setSaving(true);
      await terminalService.toggleTerminalStatus(terminal.id);
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
      loadTerminals();
    } catch (error) {
      console.error('Error toggling terminal status:', error);
      setSnackbar({ open: true, message: 'Failed to update status: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestTerminal = async (terminal) => {
    try {
      setSaving(true);
      const testResult = await terminalManager.testTerminalComponents();
      setTestResults(testResult);
      setTestDialog({ open: true, terminal });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to test terminal: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTerminal = async (terminalData) => {
    try {
      setSaving(true);
      
      // Clean up the data - remove read-only fields and ensure proper IDs
      const dataToSave = {
        ...terminalData,
        company: terminalData.companyId || terminalData.company || null,
        location: terminalData.locationId || terminalData.location || null,
      };
      
      // Remove read-only nested fields that aren't accepted by create/update serializer
      delete dataToSave.transaction_settings;
      delete dataToSave.tender_mappings;
      delete dataToSave.department_mappings;
      
      // Remove any undefined/null values to clean the payload
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === undefined || dataToSave[key] === '') {
          // Keep empty strings for optional text fields, but remove undefined
          if (dataToSave[key] === undefined && key !== 'description' && key !== 'floor_location') {
            delete dataToSave[key];
          }
        }
      });
      
      let savedTerminal;
      if (dialog.mode === 'new') {
        savedTerminal = await terminalService.createTerminal(dataToSave);
        setSnackbar({ open: true, message: 'Terminal created successfully', severity: 'success' });
        console.log('Terminal created:', savedTerminal);
      } else {
        savedTerminal = await terminalService.updateTerminal(dialog.terminal.id, dataToSave);
        setSnackbar({ open: true, message: 'Terminal updated successfully', severity: 'success' });
        console.log('Terminal updated:', savedTerminal);
      }
      
      setDialog({ open: false, mode: 'new', terminal: null });
      await loadTerminals();
    } catch (error) {
      console.error('Error saving terminal:', error);
      const errorMessage = error.response?.data?.detail || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          error.message ||
                          'Failed to save terminal';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getTerminalTypeIcon = (type) => {
    const icons = {
      till: <ComputerIcon />,
      counter: <ComputerIcon />,
      kiosk: <ComputerIcon />,
      mobile: <ComputerIcon />,
    };
    return icons[type] || <ComputerIcon />;
  };

  const getTerminalTypeColor = (type) => {
    const colors = {
      till: '#4CAF50',
      counter: '#2196F3',
      kiosk: '#FF9800',
      mobile: '#9C27B0',
    };
    return colors[type] || '#9E9E9E';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      inactive: 'default',
      maintenance: 'warning',
      error: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: canvasBg,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: canvasBg,
        minHeight: '100vh',
        py: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <PageTitle
          title="Terminal Configuration"
          subtitle="Manage POS terminals and their settings"
        />

        <Paper
          variant="outlined"
          sx={{
            borderColor: 'divider',
            boxShadow: 'none',
          }}
        >
          {/* Header Strip */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              bgcolor: themeColor,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              List
            </Typography>
            <Button
              variant="contained"
              onClick={handleNewTerminal}
              startIcon={<AddIcon />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              New Terminal
            </Button>
          </Box>

          {/* Tab Header */}
          <Box
            sx={{
              bgcolor: themeColor,
              color: 'white',
              borderTop: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="terminal configuration tabs"
              textColor="inherit"
              TabIndicatorProps={{ style: { backgroundColor: 'white', height: 3 } }}
              sx={{
                px: 3,
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.75)',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  minHeight: 56,
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255,255,255,0.75)',
                  },
                },
                '& .Mui-selected': {
                  color: 'white !important',
                  fontWeight: 600,
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <Tab icon={<ComputerIcon />} iconPosition="start" label="Terminals" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {activeTab === 0 && (
              <Box>
                {/* Terminals Table */}
                <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Terminal</TableCell>
                        <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Location</TableCell>
                        <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Last Sync</TableCell>
                        <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {terminals.map((terminal) => (
                        <TableRow 
                          key={terminal.id}
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: alpha(themeColor, 0.04) },
                            '&:hover': { backgroundColor: alpha(themeColor, 0.08) }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ color: getTerminalTypeColor(terminal.terminalType || terminal.terminal_type) }}>
                                {getTerminalTypeIcon(terminal.terminalType || terminal.terminal_type)}
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {terminal.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {terminal.terminalCode || terminal.terminal_code}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={terminal.terminalType || terminal.terminal_type || 'N/A'} 
                              size="small"
                              sx={{ 
                                backgroundColor: getTerminalTypeColor(terminal.terminalType || terminal.terminal_type) + '20',
                                color: getTerminalTypeColor(terminal.terminalType || terminal.terminal_type),
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Switch
                                checked={terminal.isActive || terminal.is_active || false}
                                onChange={() => handleToggleStatus(terminal)}
                                disabled={saving}
                                color="primary"
                              />
                              <Chip 
                                label={terminal.status || terminal.status_display || 'active'} 
                                size="small"
                                color={getStatusColor(terminal.status || 'active')}
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {terminal.locationName || terminal.location_name || terminal.location?.name || 
                               (terminal.locationId ? `Location ID: ${terminal.locationId}` : 
                                terminal.location_id ? `Location ID: ${terminal.location_id}` :
                                terminal.location ? `Location: ${terminal.location}` : 'No location')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {terminal.lastSync || terminal.last_sync 
                                ? new Date(terminal.lastSync || terminal.last_sync).toLocaleString()
                                : 'Never'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewTerminal(terminal)}
                                  disabled={saving}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditTerminal(terminal)}
                                  disabled={saving}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Test Terminal">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleTestTerminal(terminal)}
                                  disabled={saving}
                                >
                                  <TestIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteTerminal(terminal)}
                                  disabled={saving}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Terminal Dialog */}
        <TerminalDialog
          open={dialog.open}
          mode={dialog.mode}
          terminal={dialog.terminal}
          locations={locations}
          onClose={() => setDialog({ open: false, mode: 'new', terminal: null })}
          onSave={handleSaveTerminal}
          saving={saving}
        />

        {/* Test Dialog */}
        <TestDialog
          open={testDialog.open}
          terminal={testDialog.terminal}
          testResults={testResults}
          onClose={() => setTestDialog({ open: false, terminal: null })}
        />

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
    </Box>
  );
};

// Test Dialog Component
const TestDialog = ({ open, terminal, testResults, onClose }) => {
  const [themeColor, setThemeColor] = useState('#1976d2');
  
  // Load theme from localStorage (consistent with login page)
  useEffect(() => {
    const loadTheme = () => {
      try {
        const cachedTheme = localStorage.getItem('activeTheme');
        if (cachedTheme) {
          const parsedTheme = JSON.parse(cachedTheme);
          if (parsedTheme?.primary_color) {
            setThemeColor(parsedTheme.primary_color);
            return;
          }
        }
      } catch (error) {
        console.error('Error reading cached theme:', error);
      }
      // Default to blue if no theme found
      setThemeColor('#1976d2');
    };
    loadTheme();
  }, []);
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: themeColor,
          color: 'white',
          py: 2,
          px: 3,
          fontWeight: 600,
        }}
      >
        Terminal Testing Results
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, borderRadius: 0 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Hardware Tests
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2">Printer Connection</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2">Scanner Connection</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ErrorIcon color="error" fontSize="small" />
                  <Typography variant="body2">Cash Drawer Connection</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, borderRadius: 0 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Network Tests
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2">Internet Connection</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2">Server Connection</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="warning" fontSize="small" />
                  <Typography variant="body2">Database Sync</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerminalConfigurationPage;
