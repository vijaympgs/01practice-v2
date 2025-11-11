import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
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
  Switch,
  FormControlLabel,
  Autocomplete,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Print as PrintIcon,
  CreditCard as CreditCardIcon,
  Scanner as ScannerIcon,
  Receipt as ReceiptIcon,
  DisplaySettings as DisplayIcon,
  Save as SaveIcon,
  Science as TestIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  NetworkCheck as NetworkIcon,
  Timer as TimerIcon,
  LocalOffer as LocalOfferIcon,
  Language as LanguageIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

import terminalManager from '../../services/TerminalManager';
import api from '../../services/api';

const TerminalSetupPage = () => {
  // Theme state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Location and Company data
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Terminal data
  const [terminalData, setTerminalData] = useState({
    name: '',
    terminalCode: '',
    locationId: '',
    companyId: '',
    terminalType: 'till',
    isActive: true,
    printer: null,
    cashDrawer: null,
    scanner: null,
    receipt: null,
    display: null,
    // Additional Details
    ipAddress: '',
    macAddress: '',
    serialNumber: '',
    installationDate: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    floorLocation: '',
    operatingHours: '',
    currency: 'USD',
    language: 'en',
    timezone: '',
    // Hardware Configuration
    printerModel: '',
    printerSettings: '',
    scannerModel: '',
    scannerSettings: '',
    displayModel: '',
    displaySettings: '',
    // Business Rules
    allowDiscounts: true,
    allowRefunds: true,
    requireCustomerInfo: false,
    maxTransactionAmount: 10000,
    minTransactionAmount: 0,
    // Operational Settings
    autoReceipt: true,
    autoPrint: true,
    enableLoyalty: false,
    enableOfflineMode: true,
    syncInterval: 300,
    // Tax Configuration
    taxRate: 0,
    taxInclusive: false,
    // Backup Settings
    autoBackup: true,
    backupInterval: 3600,
    // Security Settings
    requirePin: false,
    sessionTimeout: 900,
    auditLogEnabled: true
  });

  // Terminal status
  const [terminalStatus, setTerminalStatus] = useState(null);
  const [validation, setValidation] = useState(null);
  const [testResults, setTestResults] = useState(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Load theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const themeResponse = await fetch('/api/theme/active-theme/');
        if (themeResponse.ok) {
          const themeData = await themeResponse.json();
          setThemeColor(themeData.primary_color || '#1976d2');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Load companies and locations
  useEffect(() => {
    const loadCompaniesAndLocations = async () => {
      try {
        setLoading(true);
        
        // Load companies
        const companiesResponse = await api.get('/organization/companies/public/');
        setCompanies(companiesResponse.data);
        
        // Load all locations
        const locationsResponse = await api.get('/organization/locations/');
        setLocations(locationsResponse.data);
        
      } catch (error) {
        console.error('Failed to load companies and locations:', error);
        setError('Failed to load companies and locations: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompaniesAndLocations();
  }, []);

  // Initialize terminal manager
  useEffect(() => {
    const initializeTerminal = async () => {
      try {
        await terminalManager.initialize();
        const status = terminalManager.getTerminalStatus();
        setTerminalStatus(status);
        
        if (status.hasTerminal) {
          const terminal = terminalManager.getCurrentTerminal();
          setTerminalData({
            name: terminal.name || '',
            terminalCode: terminal.terminalCode || '',
            locationId: terminal.locationId || '',
            companyId: terminal.companyId || '',
            terminalType: terminal.terminalType || 'till',
            isActive: terminal.isActive !== false,
            printer: terminal.settings?.printer || null,
            cashDrawer: terminal.settings?.cashDrawer || null,
            scanner: terminal.settings?.scanner || null,
            receipt: terminal.settings?.receipt || null,
            display: terminal.settings?.display || null
          });
          
          // Set selected company and location
          if (terminal.companyId) {
            const company = companies.find(c => c.id === terminal.companyId);
            if (company) setSelectedCompany(company);
          }
          if (terminal.locationId) {
            const location = locations.find(l => l.id === terminal.locationId);
            if (location) setSelectedLocation(location);
          }
        }
      } catch (error) {
        setError('Failed to initialize terminal manager: ' + error.message);
      }
    };

    if (companies.length > 0 && locations.length > 0) {
      initializeTerminal();
    }
  }, [companies, locations]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setTerminalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle company selection
  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    setSelectedLocation(null);
    setTerminalData(prev => ({
      ...prev,
      companyId: newValue?.id || '',
      locationId: ''
    }));
  };

  // Handle location selection
  const handleLocationChange = (event, newValue) => {
    setSelectedLocation(newValue);
    setTerminalData(prev => ({
      ...prev,
      locationId: newValue?.id || ''
    }));
  };

  // Get filtered locations based on selected company
  const getFilteredLocations = () => {
    if (!selectedCompany) return locations;
    return locations.filter(location => location.company === selectedCompany.id);
  };

  // Register terminal
  const handleRegisterTerminal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!terminalData.name || !terminalData.locationId || !terminalData.companyId) {
        throw new Error('Please fill in all required fields: Terminal Name, Company, and Location');
      }
      
      const terminalPayload = {
        ...terminalData,
        settings: {
          printer: terminalData.printer,
          cashDrawer: terminalData.cashDrawer,
          scanner: terminalData.scanner,
          receipt: terminalData.receipt,
          display: terminalData.display
        }
      };
      
      await terminalManager.registerTerminal(terminalPayload);
      
      const status = terminalManager.getTerminalStatus();
      setTerminalStatus(status);
      
      setSuccess('Terminal registered successfully!');
      setSnackbar({ open: true, message: 'Terminal registered successfully!', severity: 'success' });
      
    } catch (error) {
      setError('Failed to register terminal: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to register terminal: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Update terminal settings
  const handleUpdateSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const settings = {
        printer: terminalData.printer,
        cashDrawer: terminalData.cashDrawer,
        scanner: terminalData.scanner,
        receipt: terminalData.receipt,
        display: terminalData.display
      };
      
      await terminalManager.updateTerminalSettings(settings);
      
      const status = terminalManager.getTerminalStatus();
      setTerminalStatus(status);
      
      setSuccess('Terminal settings updated successfully!');
      setSnackbar({ open: true, message: 'Terminal settings updated successfully!', severity: 'success' });
      
    } catch (error) {
      setError('Failed to update terminal settings: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to update terminal settings: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Validate terminal
  const handleValidateTerminal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const validationResult = await terminalManager.validateTerminal();
      setValidation(validationResult);
      
      if (validationResult.isValid) {
        setSuccess('Terminal validation passed!');
        setSnackbar({ open: true, message: 'Terminal validation passed!', severity: 'success' });
      } else {
        setError('Terminal validation failed: ' + validationResult.errors.join(', '));
        setSnackbar({ open: true, message: 'Terminal validation failed: ' + validationResult.errors.join(', '), severity: 'error' });
      }
      
    } catch (error) {
      setError('Failed to validate terminal: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to validate terminal: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Test terminal components
  const handleTestComponents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const testResult = await terminalManager.testTerminalComponents();
      setTestResults(testResult);
      
      const allPassed = Object.values(testResult).every(result => result === true);
      if (allPassed) {
        setSuccess('All terminal components tested successfully!');
        setSnackbar({ open: true, message: 'All terminal components tested successfully!', severity: 'success' });
      } else {
        setError('Some terminal components failed testing');
        setSnackbar({ open: true, message: 'Some terminal components failed testing', severity: 'error' });
      }
      
    } catch (error) {
      setError('Failed to test terminal components: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to test terminal components: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', p: 2, backgroundColor: '#f5f5f5' }}>
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="Terminal Setup" 
          subtitle="Configure and setup POS terminal for operation"
        />
      </Box>
      
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: themeColor, color: 'white', borderRadius: 0 }}>
        <Typography variant="h6">Terminal Information</Typography>
      </Paper>

      <Grid container spacing={2}>
        {/* Terminal Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 0 }}>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Terminal Name *"
                  value={terminalData.name}
 onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter terminal name (e.g., Till-01, Counter-02)"
                  required
                  InputLabelProps={{ sx: { color: themeColor } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Terminal Code"
                  value={terminalData.terminalCode}
                  onChange={(e) => handleInputChange('terminalCode', e.target.value)}
                  placeholder="Enter terminal code (auto-generated if empty)"
                  InputLabelProps={{ sx: { color: themeColor } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Autocomplete
                  options={companies}
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Company *"
                      placeholder="Select company"
                      required
                      InputLabelProps={{ sx: { color: themeColor } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <BusinessIcon sx={{ mr: 1 }} />
                      {option.name} ({option.code})
                    </Box>
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Autocomplete
                  options={getFilteredLocations()}
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  getOptionLabel={(option) => `${option.name} (${option.code})`}
                  disabled={!selectedCompany}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Location *"
                      placeholder={selectedCompany ? "Select location" : "Select company first"}
                      required
                      InputLabelProps={{ sx: { color: themeColor } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <LocationIcon sx={{ mr: 1 }} />
                      {option.name} ({option.code}) - {option.location_type}
                    </Box>
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColor }}>Terminal Type</InputLabel>
                  <Select
                    value={terminalData.terminalType}
                    onChange={(e) => handleInputChange('terminalType', e.target.value)}
                    label="Terminal Type"
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: 0 } }}
                  >
                    <MenuItem value="till">Till/Counter</MenuItem>
                    <MenuItem value="desktop">Desktop Machine</MenuItem>
                    <MenuItem value="mobile">Mobile Terminal</MenuItem>
                    <MenuItem value="kiosk">Self-Service Kiosk</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={terminalData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: themeColor,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: themeColor,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500, color: themeColor }}>
                      Active
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleRegisterTerminal}
                disabled={loading || !terminalData.name || !selectedCompany || !selectedLocation}
              >
                {loading ? 'Registering...' : 'Register Terminal'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Terminal Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 0 }}>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColor }}>Printer</InputLabel>
                  <Select
                    value={terminalData.printer || ''}
                    onChange={(e) => handleInputChange('printer', e.target.value)}
                    label="Printer"
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: 0 } }}
                  >
                    <MenuItem value="thermal_printer">Thermal Printer</MenuItem>
                    <MenuItem value="laser_printer">Laser Printer</MenuItem>
                    <MenuItem value="inkjet_printer">Inkjet Printer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColor }}>Cash Drawer</InputLabel>
                  <Select
                    value={terminalData.cashDrawer || ''}
                    onChange={(e) => handleInputChange('cashDrawer', e.target.value)}
                    label="Cash Drawer"
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: 0 } }}
                  >
                    <MenuItem value="manual_drawer">Manual Drawer</MenuItem>
                    <MenuItem value="electric_drawer">Electric Drawer</MenuItem>
                    <MenuItem value="smart_drawer">Smart Drawer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColor }}>Scanner</InputLabel>
                  <Select
                    value={terminalData.scanner || ''}
                    onChange={(e) => handleInputChange('scanner', e.target.value)}
                    label="Scanner"
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: 0 } }}
                  >
                    <MenuItem value="barcode_scanner">Barcode Scanner</MenuItem>
                    <MenuItem value="qr_scanner">QR Scanner</MenuItem>
                    <MenuItem value="nfc_scanner">NFC Scanner</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColor }}>Receipt</InputLabel>
                  <Select
                    value={terminalData.receipt || ''}
                    onChange={(e) => handleInputChange('receipt', e.target.value)}
                    label="Receipt"
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: 0 } }}
                  >
                    <MenuItem value="thermal_receipt">Thermal Receipt</MenuItem>
                    <MenuItem value="paper_receipt">Paper Receipt</MenuItem>
                    <MenuItem value="digital_receipt">Digital Receipt</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColor }}>Display</InputLabel>
                  <Select
                    value={terminalData.display || ''}
                    onChange={(e) => handleInputChange('display', e.target.value)}
                    label="Display"
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: 0 } }}
                  >
                    <MenuItem value="touch_display">Touch Display</MenuItem>
                    <MenuItem value="standard_display">Standard Display</MenuItem>
                    <MenuItem value="dual_display">Dual Display</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleUpdateSettings}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Settings'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Terminal Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              📊 Terminal Status
            </Typography>
            
            {terminalStatus && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Chip
                      label={terminalStatus.hasTerminal ? 'Registered' : 'Not Registered'}
                      color={terminalStatus.hasTerminal ? 'success' : 'error'}
                      icon={terminalStatus.hasTerminal ? <CheckIcon /> : <ErrorIcon />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={terminalStatus.status}
                      color={terminalStatus.status === 'active' ? 'success' : 'warning'}
                    />
                  </Grid>
                </Grid>
                
                {terminalStatus.terminalId && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Terminal ID: {terminalStatus.terminalId}
                    </Typography>
                    {terminalData.terminalCode && (
                      <Typography variant="body2" color="text.secondary">
                        Terminal Code: {terminalData.terminalCode}
                      </Typography>
                    )}
                    {selectedCompany && (
                      <Typography variant="body2" color="text.secondary">
                        Company: {selectedCompany.name}
                      </Typography>
                    )}
                    {selectedLocation && (
                      <Typography variant="body2" color="text.secondary">
                        Location: {selectedLocation.name} ({selectedLocation.location_type})
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Type: {terminalData.terminalType}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Terminal Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              🔧 Terminal Actions
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<CheckIcon />}
                onClick={handleValidateTerminal}
                disabled={loading}
              >
                Validate Terminal
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<TestIcon />}
                onClick={handleTestComponents}
                disabled={loading}
              >
                Test Components
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Validation Results */}
        {validation && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                ✅ Validation Results
              </Typography>
              
              <Alert severity={validation.isValid ? 'success' : 'error'} sx={{ mb: 2 }}>
                {validation.isValid ? 'Terminal validation passed!' : 'Terminal validation failed!'}
              </Alert>
              
              {validation.errors.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="error">Errors:</Typography>
                  {validation.errors.map((error, index) => (
                    <Typography key={index} variant="body2" color="error">• {error}</Typography>
                  ))}
                </Box>
              )}
              
              {validation.warnings.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="warning">Warnings:</Typography>
                  {validation.warnings.map((warning, index) => (
                    <Typography key={index} variant="body2" color="warning">• {warning}</Typography>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        )}

        {/* Test Results */}
        {testResults && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🧪 Test Results
              </Typography>
              
              <Grid container spacing={2}>
                {Object.entries(testResults).map(([component, result]) => (
                  <Grid item xs={6} md={2} key={component}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color={result ? 'success' : 'error'}>
                          {result ? '✅' : '❌'}
                        </Typography>
                        <Typography variant="body2">
                          {component.charAt(0).toUpperCase() + component.slice(1)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default TerminalSetupPage;
