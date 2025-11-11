import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Code as CodeIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
  ContentCopy as CopyIcon,
  Flag as FlagIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';
import { codeSettingsService } from '../../services/codeSettingsService';

const CodeMasterModule = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
  // Code Master state
  const [codes, setCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [codeDialog, setCodeDialog] = useState({ open: false, code: null, type: 'add' });
  
  // Code form state
  const [codeData, setCodeData] = useState({
    id: '',
    codeType: '',
    code: '',
    name: '',
    description: '',
    isActive: true,
    parentCode: '',
    sortOrder: 0,
    metadata: {},
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    codeType: 'all',
    search: '',
    isActive: 'all',
  });
  
  // Data states
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [codeTypes, setCodeTypes] = useState([
    { value: 'COUNTRY', label: 'Country Codes', icon: <FlagIcon />, color: '#2196F3' },
    { value: 'STATE', label: 'State Codes', icon: <LocationIcon />, color: '#4CAF50' },
    { value: 'CITY', label: 'City Codes', icon: <LocationIcon />, color: '#FF9800' },
    { value: 'BANK', label: 'Bank Codes', icon: <BankIcon />, color: '#9C27B0' },
    { value: 'PAYMENT_METHOD', label: 'Payment Methods', icon: <PaymentIcon />, color: '#607D8B' },
    { value: 'SHIPPING_METHOD', label: 'Shipping Methods', icon: <ShippingIcon />, color: '#795548' },
    { value: 'CATEGORY', label: 'Category Codes', icon: <CategoryIcon />, color: '#E91E63' },
    { value: 'BUSINESS_TYPE', label: 'Business Types', icon: <BusinessIcon />, color: '#3F51B5' },
  ]);

  useEffect(() => {
    initializeCodeMaster();
  }, []);

  const initializeCodeMaster = async () => {
    try {
      setLoading(true);
      
      // Load currencies
      const currencyList = await currencyService.getActiveCurrencies();
      setCurrencies(currencyList);
      
      // Load mock data
      await loadCodes();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize code master: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadCodes = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCodes = [
        // Country Codes
        {
          id: '1',
          codeType: 'COUNTRY',
          code: 'IN',
          name: 'India',
          description: 'Republic of India',
          isActive: true,
          parentCode: '',
          sortOrder: 1,
          metadata: { currency: 'INR', phoneCode: '+91', timezone: 'IST' },
        },
        {
          id: '2',
          codeType: 'COUNTRY',
          code: 'US',
          name: 'United States',
          description: 'United States of America',
          isActive: true,
          parentCode: '',
          sortOrder: 2,
          metadata: { currency: 'USD', phoneCode: '+1', timezone: 'EST' },
        },
        {
          id: '3',
          codeType: 'COUNTRY',
          code: 'UK',
          name: 'United Kingdom',
          description: 'United Kingdom of Great Britain',
          isActive: true,
          parentCode: '',
          sortOrder: 3,
          metadata: { currency: 'GBP', phoneCode: '+44', timezone: 'GMT' },
        },
        
        // State Codes
        {
          id: '4',
          codeType: 'STATE',
          code: 'MH',
          name: 'Maharashtra',
          description: 'State of Maharashtra',
          isActive: true,
          parentCode: 'IN',
          sortOrder: 1,
          metadata: { capital: 'Mumbai', population: '112374333' },
        },
        {
          id: '5',
          codeType: 'STATE',
          code: 'KA',
          name: 'Karnataka',
          description: 'State of Karnataka',
          isActive: true,
          parentCode: 'IN',
          sortOrder: 2,
          metadata: { capital: 'Bangalore', population: '61130704' },
        },
        {
          id: '6',
          codeType: 'STATE',
          code: 'TN',
          name: 'Tamil Nadu',
          description: 'State of Tamil Nadu',
          isActive: true,
          parentCode: 'IN',
          sortOrder: 3,
          metadata: { capital: 'Chennai', population: '72147030' },
        },
        
        // City Codes
        {
          id: '7',
          codeType: 'CITY',
          code: 'MUM',
          name: 'Mumbai',
          description: 'Mumbai City',
          isActive: true,
          parentCode: 'MH',
          sortOrder: 1,
          metadata: { pincode: '400001', area: '603.4 km²' },
        },
        {
          id: '8',
          codeType: 'CITY',
          code: 'BLR',
          name: 'Bangalore',
          description: 'Bangalore City',
          isActive: true,
          parentCode: 'KA',
          sortOrder: 1,
          metadata: { pincode: '560001', area: '741 km²' },
        },
        {
          id: '9',
          codeType: 'CITY',
          code: 'CHN',
          name: 'Chennai',
          description: 'Chennai City',
          isActive: true,
          parentCode: 'TN',
          sortOrder: 1,
          metadata: { pincode: '600001', area: '426 km²' },
        },
        
        // Bank Codes
        {
          id: '10',
          codeType: 'BANK',
          code: 'SBI',
          name: 'State Bank of India',
          description: 'State Bank of India',
          isActive: true,
          parentCode: '',
          sortOrder: 1,
          metadata: { ifsc: 'SBIN0000001', micr: '400002001' },
        },
        {
          id: '11',
          codeType: 'BANK',
          code: 'HDFC',
          name: 'HDFC Bank',
          description: 'HDFC Bank Limited',
          isActive: true,
          parentCode: '',
          sortOrder: 2,
          metadata: { ifsc: 'HDFC0000001', micr: '400240001' },
        },
        {
          id: '12',
          codeType: 'BANK',
          code: 'ICICI',
          name: 'ICICI Bank',
          description: 'ICICI Bank Limited',
          isActive: true,
          parentCode: '',
          sortOrder: 3,
          metadata: { ifsc: 'ICIC0000001', micr: '400229001' },
        },
        
        // Payment Methods
        {
          id: '13',
          codeType: 'PAYMENT_METHOD',
          code: 'CASH',
          name: 'Cash',
          description: 'Cash Payment',
          isActive: true,
          parentCode: '',
          sortOrder: 1,
          metadata: { requiresChange: true, maxAmount: 10000 },
        },
        {
          id: '14',
          codeType: 'PAYMENT_METHOD',
          code: 'CARD',
          name: 'Card Payment',
          description: 'Credit/Debit Card Payment',
          isActive: true,
          parentCode: '',
          sortOrder: 2,
          metadata: { requiresPin: true, maxAmount: 50000 },
        },
        {
          id: '15',
          codeType: 'PAYMENT_METHOD',
          code: 'UPI',
          name: 'UPI Payment',
          description: 'Unified Payments Interface',
          isActive: true,
          parentCode: '',
          sortOrder: 3,
          metadata: { requiresUpiId: true, maxAmount: 100000 },
        },
        
        // Shipping Methods
        {
          id: '16',
          codeType: 'SHIPPING_METHOD',
          code: 'STANDARD',
          name: 'Standard Shipping',
          description: 'Standard delivery within 5-7 days',
          isActive: true,
          parentCode: '',
          sortOrder: 1,
          metadata: { deliveryDays: '5-7', cost: 50 },
        },
        {
          id: '17',
          codeType: 'SHIPPING_METHOD',
          code: 'EXPRESS',
          name: 'Express Shipping',
          description: 'Express delivery within 1-2 days',
          isActive: true,
          parentCode: '',
          sortOrder: 2,
          metadata: { deliveryDays: '1-2', cost: 150 },
        },
        {
          id: '18',
          codeType: 'SHIPPING_METHOD',
          code: 'SAME_DAY',
          name: 'Same Day Delivery',
          description: 'Same day delivery',
          isActive: true,
          parentCode: '',
          sortOrder: 3,
          metadata: { deliveryDays: '0-1', cost: 300 },
        },
      ];
      
      setCodes(mockCodes);
    } catch (error) {
      console.error('Failed to load codes:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCodeSelect = (code) => {
    setSelectedCode(code);
  };

  const handleAddCode = (codeType) => {
    setCodeData({
      id: '',
      codeType: codeType,
      code: '',
      name: '',
      description: '',
      isActive: true,
      parentCode: '',
      sortOrder: 0,
      metadata: {},
    });
    setCodeDialog({ open: true, code: null, type: 'add' });
  };

  const handleEditCode = (code) => {
    setCodeData(code);
    setCodeDialog({ open: true, code, type: 'edit' });
  };

  const handleSaveCode = async () => {
    try {
      setSaving(true);
      
      if (codeDialog.type === 'add') {
        const newCode = {
          ...codeData,
          id: Date.now().toString(),
        };
        setCodes(prev => [...prev, newCode]);
      } else {
        setCodes(prev => prev.map(code => 
          code.id === codeData.id ? codeData : code
        ));
      }
      
      setCodeDialog({ open: false, code: null, type: 'add' });
      setSnackbar({ open: true, message: 'Code saved successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save code: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCode = async (codeId) => {
    try {
      setCodes(prev => prev.filter(code => code.id !== codeId));
      setSnackbar({ open: true, message: 'Code deleted successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete code: ' + error.message, severity: 'error' });
    }
  };

  const getCodeTypeIcon = (codeType) => {
    const type = codeTypes.find(t => t.value === codeType);
    return type ? type.icon : <CodeIcon />;
  };

  const getCodeTypeColor = (codeType) => {
    const type = codeTypes.find(t => t.value === codeType);
    return type ? type.color : '#9E9E9E';
  };

  const getFilteredCodes = () => {
    let filtered = codes;
    
    if (filters.codeType !== 'all') {
      filtered = filtered.filter(code => code.codeType === filters.codeType);
    }
    
    if (filters.search) {
      filtered = filtered.filter(code => 
        code.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        code.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        code.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.isActive !== 'all') {
      const isActive = filters.isActive === 'active';
      filtered = filtered.filter(code => code.isActive === isActive);
    }
    
    return filtered;
  };

  const getCodesByType = (codeType) => {
    return codes.filter(code => code.codeType === codeType);
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
            <CodeIcon sx={{ fontSize: 40 }} />
            <Box>
              <PageTitle 
                title="Code Master" 
                subtitle="Manage system codes and master data"
                showIcon={true}
                icon={<CodeIcon />}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Code Type Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {codeTypes.map((type) => (
            <Grid item xs={12} sm={6} md={3} key={type.value}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setActiveTab(codeTypes.indexOf(type))}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: type.color, mb: 1 }}>
                    {type.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {type.label}
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {getCodesByType(type.value).length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    codes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
            {codeTypes.map((type) => (
              <Tab 
                key={type.value}
                icon={type.icon} 
                iconPosition="start" 
                label={type.label}
                sx={{ color: type.color }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            {/* Filters */}
            <Box sx={{ p: 3, borderBottom: '1px solid #dee2e6' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Search Codes"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.isActive}
                      onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                      label="Status"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setFilters({
                      codeType: 'all',
                      search: '',
                      isActive: 'all',
                    })}
                  >
                    Clear Filters
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddCode(codeTypes[activeTab]?.value)}
                    sx={{ 
                      backgroundColor: getCodeTypeColor(codeTypes[activeTab]?.value),
                      '&:hover': { 
                        backgroundColor: getCodeTypeColor(codeTypes[activeTab]?.value) + 'DD' 
                      }
                    }}
                  >
                    Add Code
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Codes Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Parent</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredCodes().map((code) => (
                    <TableRow 
                      key={code.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                        '&:hover': { backgroundColor: '#e3f2fd' }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: getCodeTypeColor(code.codeType) }}>
                            {getCodeTypeIcon(code.codeType)}
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {code.code}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {code.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {code.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {code.parentCode || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={code.isActive ? 'Active' : 'Inactive'} 
                          color={code.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleCodeSelect(code)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Code">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditCode(code)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy Code">
                            <IconButton size="small" color="secondary">
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Code">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteCode(code.id)}
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
          </CardContent>
        </Card>
      </Container>

      {/* Code Dialog */}
      <Dialog open={codeDialog.open} onClose={() => setCodeDialog({ open: false, code: null, type: 'add' })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon />
            <Typography variant="h6">
              {codeDialog.type === 'add' ? 'Add New Code' : 'Edit Code'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code"
                value={codeData.code}
                onChange={(e) => setCodeData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter code (e.g., IN, MH, MUM)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={codeData.name}
                onChange={(e) => setCodeData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={codeData.description}
                onChange={(e) => setCodeData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Parent Code"
                value={codeData.parentCode}
                onChange={(e) => setCodeData(prev => ({ ...prev, parentCode: e.target.value }))}
                placeholder="Enter parent code (optional)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={codeData.sortOrder}
                onChange={(e) => setCodeData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={codeData.isActive}
                    onChange={(e) => setCodeData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeDialog({ open: false, code: null, type: 'add' })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCode}
            disabled={saving || !codeData.code || !codeData.name}
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {codeDialog.type === 'add' ? 'Add Code' : 'Save Changes'}
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

export default CodeMasterModule;

