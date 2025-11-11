import React, { useState, useEffect } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

import terminalManager from '../../services/TerminalManager';
import api from '../../services/api';
import PageTitle from '../../components/common/PageTitle';

const TerminalSetupPageEnhanced = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Location and Company data
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  
  // Terminal data - COMPREHENSIVE
  const [terminalData, setTerminalData] = useState({
    // Basic Information
    name: '',
    terminalCode: '',
    locationId: '',
    companyId: '',
    terminalType: 'till',
    isActive: true,
    
    // Contact Information
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    floorLocation: '',
    operatingHours: '',
    installationDate: '',
    
    // Network Information
    ipAddress: '',
    macAddress: '',
    serialNumber: '',
    
    // Regional Settings
    currency: 'USD',
    language: 'en',
    timezone: 'UTC',
    
    // Hardware Configuration
    printer: null,
    cashDrawer: null,
    scanner: null,
    receipt: null,
    display: null,
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

  // Load companies and locations
  useEffect(() => {
    const loadCompaniesAndLocations = async () => {
      try {
        setLoading(true);
        
        const companiesResponse = await api.get('/organization/companies/public/');
        setCompanies(companiesResponse.data);
        
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
            ...terminalData,
            ...terminal,
            settings: terminal.settings || {}
          });
          
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
          display: terminalData.display,
          printerModel: terminalData.printerModel,
          printerSettings: terminalData.printerSettings,
          scannerModel: terminalData.scannerModel,
          scannerSettings: terminalData.scannerSettings,
          displayModel: terminalData.displayModel,
          displaySettings: terminalData.displaySettings,
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
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <PageTitle 
          title="Terminal Setup - Complete Configuration" 
          subtitle="Advanced terminal configuration and management"
          showIcon={true}
          icon={<SettingsIcon />}
        />
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<ComputerIcon />} label="Basic Info" />
          <Tab icon={<NetworkIcon />} label="Network & Contact" />
          <Tab icon={<SettingsIcon />} label="Hardware" />
          <Tab icon={<LocalOfferIcon />} label="Business Rules" />
          <Tab icon={<MoneyIcon />} label="Tax & Currency" />
          <Tab icon={<BackupIcon />} label="Backup & Sync" />
          <Tab icon={<SecurityIcon />} label="Security" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Grid container spacing={2}>
        {/* Tab 0: Basic Information */}
        {activeTab === 0 && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📋 Basic Terminal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Terminal Name *"
                      value={terminalData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter terminal name (e.g., Till-01, Counter-02)"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Terminal Code"
                      value={terminalData.terminalCode}
                      onChange={(e) => handleInputChange('terminalCode', e.target.value)}
                      placeholder="Enter terminal code (auto-generated if empty)"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={companies}
                      value={selectedCompany}
                      onChange={handleCompanyChange}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Company *"
                          placeholder="Select company"
                          required
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={getFilteredLocations()}
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      getOptionLabel={(option) => `${option.name} (${option.code})`}
                      disabled={!selectedCompany}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location *"
                          placeholder={selectedCompany ? "Select location" : "Select company first"}
                          required
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Terminal Type</InputLabel>
                      <Select
                        value={terminalData.terminalType}
                        onChange={(e) => handleInputChange('terminalType', e.target.value)}
                        label="Terminal Type"
                      >
                        <MenuItem value="till">Till/Counter</MenuItem>
                        <MenuItem value="desktop">Desktop Machine</MenuItem>
                        <MenuItem value="mobile">Mobile Terminal</MenuItem>
                        <MenuItem value="kiosk">Self-Service Kiosk</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Installation Date"
                      type="date"
                      value={terminalData.installationDate}
                      onChange={(e) => handleInputChange('installationDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.isActive}
                          onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        />
                      }
                      label="Terminal Active"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Tab 1: Network & Contact */}
        {activeTab === 1 && (
          <>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🌐 Network Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="IP Address"
                      value={terminalData.ipAddress}
                      onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                      placeholder="192.168.1.100"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="MAC Address"
                      value={terminalData.macAddress}
                      onChange={(e) => handleInputChange('macAddress', e.target.value)}
                      placeholder="00:1B:44:11:3A:B7"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Serial Number"
                      value={terminalData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📞 Contact Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Person"
                      value={terminalData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Phone"
                      value={terminalData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Email"
                      type="email"
                      value={terminalData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Floor Location"
                      value={terminalData.floorLocation}
                      onChange={(e) => handleInputChange('floorLocation', e.target.value)}
                      placeholder="e.g., Ground Floor, Counter 3"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Operating Hours"
                      value={terminalData.operatingHours}
                      onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                      placeholder="e.g., 9:00 AM - 9:00 PM"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Tab 2: Hardware Configuration */}
        {activeTab === 2 && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🖨️ Hardware Configuration
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Printer</InputLabel>
                      <Select
                        value={terminalData.printer || ''}
                        onChange={(e) => handleInputChange('printer', e.target.value)}
                        label="Printer"
                      >
                        <MenuItem value="thermal_printer">Thermal Printer</MenuItem>
                        <MenuItem value="laser_printer">Laser Printer</MenuItem>
                        <MenuItem value="inkjet_printer">Inkjet Printer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Printer Model"
                      value={terminalData.printerModel}
                      onChange={(e) => handleInputChange('printerModel', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Cash Drawer</InputLabel>
                      <Select
                        value={terminalData.cashDrawer || ''}
                        onChange={(e) => handleInputChange('cashDrawer', e.target.value)}
                        label="Cash Drawer"
                      >
                        <MenuItem value="manual_drawer">Manual Drawer</MenuItem>
                        <MenuItem value="electric_drawer">Electric Drawer</MenuItem>
                        <MenuItem value="smart_drawer">Smart Drawer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Scanner</InputLabel>
                      <Select
                        value={terminalData.scanner || ''}
                        onChange={(e) => handleInputChange('scanner', e.target.value)}
                        label="Scanner"
                      >
                        <MenuItem value="barcode_scanner">Barcode Scanner</MenuItem>
                        <MenuItem value="qr_scanner">QR Scanner</MenuItem>
                        <MenuItem value="nfc_scanner">NFC Scanner</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Scanner Model"
                      value={terminalData.scannerModel}
                      onChange={(e) => handleInputChange('scannerModel', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Receipt</InputLabel>
                      <Select
                        value={terminalData.receipt || ''}
                        onChange={(e) => handleInputChange('receipt', e.target.value)}
                        label="Receipt"
                      >
                        <MenuItem value="thermal_receipt">Thermal Receipt</MenuItem>
                        <MenuItem value="paper_receipt">Paper Receipt</MenuItem>
                        <MenuItem value="digital_receipt">Digital Receipt</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Display</InputLabel>
                      <Select
                        value={terminalData.display || ''}
                        onChange={(e) => handleInputChange('display', e.target.value)}
                        label="Display"
                      >
                        <MenuItem value="touch_display">Touch Display</MenuItem>
                        <MenuItem value="standard_display">Standard Display</MenuItem>
                        <MenuItem value="dual_display">Dual Display</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Display Model"
                      value={terminalData.displayModel}
                      onChange={(e) => handleInputChange('displayModel', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Tab 3: Business Rules */}
        {activeTab === 3 && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📋 Business Rules & Policies
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.allowDiscounts}
                          onChange={(e) => handleInputChange('allowDiscounts', e.target.checked)}
                        />
                      }
                      label="Allow Discounts"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.allowRefunds}
                          onChange={(e) => handleInputChange('allowRefunds', e.target.checked)}
                        />
                      }
                      label="Allow Refunds"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.requireCustomerInfo}
                          onChange={(e) => handleInputChange('requireCustomerInfo', e.target.checked)}
                        />
                      }
                      label="Require Customer Information"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.enableLoyalty}
                          onChange={(e) => handleInputChange('enableLoyalty', e.target.checked)}
                        />
                      }
                      label="Enable Loyalty Program"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Maximum Transaction Amount"
                      type="number"
                      value={terminalData.maxTransactionAmount}
                      onChange={(e) => handleInputChange('maxTransactionAmount', parseFloat(e.target.value))}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Transaction Amount"
                      type="number"
                      value={terminalData.minTransactionAmount}
                      onChange={(e) => handleInputChange('minTransactionAmount', parseFloat(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Tab 4: Tax & Currency */}
        {activeTab === 4 && (
          <>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  💰 Currency Settings
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={terminalData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        label="Currency"
                      >
                        <MenuItem value="USD">USD - US Dollar</MenuItem>
                        <MenuItem value="EUR">EUR - Euro</MenuItem>
                        <MenuItem value="GBP">GBP - British Pound</MenuItem>
                        <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                        <MenuItem value="AED">AED - UAE Dirham</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={terminalData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        label="Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="ar">العربية</MenuItem>
                        <MenuItem value="hi">हिन्दी</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                        <MenuItem value="es">Español</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={terminalData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        label="Timezone"
                      >
                        <MenuItem value="UTC">UTC</MenuItem>
                        <MenuItem value="America/New_York">America/New_York</MenuItem>
                        <MenuItem value="Europe/London">Europe/London</MenuItem>
                        <MenuItem value="Asia/Dubai">Asia/Dubai</MenuItem>
                        <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📊 Tax Configuration
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tax Rate (%)"
                      type="number"
                      value={terminalData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.taxInclusive}
                          onChange={(e) => handleInputChange('taxInclusive', e.target.checked)}
                        />
                      }
                      label="Tax Inclusive Pricing"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Tab 5: Backup & Sync */}
        {activeTab === 5 && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🔄 Backup & Synchronization
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.enableOfflineMode}
                          onChange={(e) => handleInputChange('enableOfflineMode', e.target.checked)}
                        />
                      }
                      label="Enable Offline Mode"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.autoBackup}
                          onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
                        />
                      }
                      label="Automatic Backup"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.autoReceipt}
                          onChange={(e) => handleInputChange('autoReceipt', e.target.checked)}
                        />
                      }
                      label="Auto Receipt Generation"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.autoPrint}
                          onChange={(e) => handleInputChange('autoPrint', e.target.checked)}
                        />
                      }
                      label="Auto Print Receipt"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Sync Interval (seconds)"
                      type="number"
                      value={terminalData.syncInterval}
                      onChange={(e) => handleInputChange('syncInterval', parseInt(e.target.value))}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Backup Interval (seconds)"
                      type="number"
                      value={terminalData.backupInterval}
                      onChange={(e) => handleInputChange('backupInterval', parseInt(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Tab 6: Security */}
        {activeTab === 6 && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🔒 Security Settings
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.requirePin}
                          onChange={(e) => handleInputChange('requirePin', e.target.checked)}
                        />
                      }
                      label="Require PIN for Operations"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={terminalData.auditLogEnabled}
                          onChange={(e) => handleInputChange('auditLogEnabled', e.target.checked)}
                        />
                      }
                      label="Enable Audit Logging"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Session Timeout (seconds)"
                      type="number"
                      value={terminalData.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Terminal Status */}
        {terminalStatus && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📊 Terminal Status
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Chip
                    label={terminalStatus.hasTerminal ? 'Registered' : 'Not Registered'}
                    color={terminalStatus.hasTerminal ? 'success' : 'error'}
                    icon={terminalStatus.hasTerminal ? <CheckIcon /> : <ErrorIcon />}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
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
            </Paper>
          </Grid>
        )}

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
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
              
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleRegisterTerminal}
                disabled={loading || !terminalData.name || !selectedCompany || !selectedLocation}
                size="large"
              >
                {loading ? 'Registering...' : 'Register Terminal'}
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
              
              {validation.errors && validation.errors.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="error">Errors:</Typography>
                  {validation.errors.map((error, index) => (
                    <Typography key={index} variant="body2" color="error">• {error}</Typography>
                  ))}
                </Box>
              )}
              
              {validation.warnings && validation.warnings.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="warning.main">Warnings:</Typography>
                  {validation.warnings.map((warning, index) => (
                    <Typography key={index} variant="body2" color="warning.main">• {warning}</Typography>
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
                        <Typography variant="h6" color={result ? 'success.main' : 'error.main'}>
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

export default TerminalSetupPageEnhanced;

