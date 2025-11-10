import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as PublicIcon,
  LocationCity as LocationCityIcon,
  LocationOn as LocationOnIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Flag as FlagIcon,
  Terrain as TerrainIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import themeService from '../../services/themeService';

const GeneralMasterPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Theme color state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue

  // Predefined currency options
  const currencyOptions = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
  ];

  // Form data for different entities
  const [countryForm, setCountryForm] = useState({
    name: '',
    code: '',
    phone_code: '',
    currency_code: '',
    is_active: true,
  });

  const [stateForm, setStateForm] = useState({
    name: '',
    code: '',
    country: '',
    is_active: true,
  });

  const [cityForm, setCityForm] = useState({
    name: '',
    code: '',
    state: '',
    country: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    is_active: true,
  });

  const tabConfig = [
    {
      label: 'Country',
      icon: <PublicIcon />,
      color: 'primary',
      data: countries,
      setData: setCountries,
      form: countryForm,
      setForm: setCountryForm,
      endpoint: '/geographical-data/countries/',
      columns: ['name', 'code', 'phone_code', 'currency_code', 'is_active'],
    },
    {
      label: 'State',
      icon: <TerrainIcon />,
      color: 'secondary',
      data: states,
      setData: setStates,
      form: stateForm,
      setForm: setStateForm,
      endpoint: '/geographical-data/states/',
      columns: ['name', 'code', 'country_name', 'is_active'],
    },
    {
      label: 'City',
      icon: <LocationCityIcon />,
      color: 'success',
      data: cities,
      setData: setCities,
      form: cityForm,
      setForm: setCityForm,
      endpoint: '/geographical-data/cities/',
      columns: ['name', 'code', 'state_name', 'country_name', 'is_active'],
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    // Load theme color from themeService
    const loadTheme = async () => {
      try {
        const theme = await themeService.getActiveTheme();
        if (theme && theme.primary_color) {
          setThemeColor(theme.primary_color);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
    
    if (token) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [countriesRes, statesRes, citiesRes] = await Promise.all([
        api.get('/geographical-data/countries/'),
        api.get('/geographical-data/states/'),
        api.get('/geographical-data/cities/'),
      ]);
      
      const countriesData = countriesRes.data.results || countriesRes.data;
      
      setCountries(countriesData);
      setStates(statesRes.data.results || statesRes.data);
      setCities(citiesRes.data.results || citiesRes.data);
      
      console.log('Loaded states:', statesRes.data.results || statesRes.data);
      console.log('First state:', (statesRes.data.results || statesRes.data)[0]);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication expired. Please log in again.',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error loading data. Please try again.',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (item = null) => {
    setEditingItem(item);
    
    if (item) {
      // Edit mode - populate forms
      if (activeTab === 0) {
        // Country form
        setCountryForm({
          ...item,
          phone_code: item.phone_code || '',
          currency_code: item.currency_code || '',
        });
      } else if (activeTab === 1) {
        // State form - find matching ID for existing country
        const countryId = countries.find(c => c.id === item.country)?.id || '';
        
        setStateForm({
          ...item,
          country: countryId,
        });
      } else if (activeTab === 2) {
        // City form - find matching IDs for existing country/state
        const countryId = countries.find(c => c.id === item.country)?.id || '';
        const stateId = states.find(s => s.id === item.state)?.id || '';
        
        console.log('Editing City - item:', item);
        console.log('Found countryId:', countryId);
        console.log('Found stateId:', stateId);
        console.log('Available countries:', countries);
        console.log('Available states:', states);
        
        setCityForm({
          ...item,
          country: countryId,
          state: stateId,
        });
      }
    } else {
      // Add mode - reset forms
      const currentTab = tabConfig[activeTab];
      if (activeTab === 0) {
        // Country form
        setCountryForm({
          name: '',
          code: '',
          phone_code: '',
          currency_code: '',
          is_active: true,
        });
      } else if (activeTab === 1) {
        // State form
        setStateForm({
          name: '',
          code: '',
          country: '',
          is_active: true,
        });
      } else if (activeTab === 2) {
        // City form
        setCityForm({
          name: '',
          code: '',
          state: '',
          country: '',
          postal_code: '',
          latitude: '',
          longitude: '',
          is_active: true,
        });
      }
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Special handling for country change in city form
    if (field === 'country' && activeTab === 2) {
      setCityForm(prev => ({
        ...prev,
        [field]: value,
        state: '', // Clear state when country changes
      }));
    } else {
      // Use specific form setters based on active tab
      if (activeTab === 0) {
        setCountryForm(prev => ({
          ...prev,
          [field]: value,
        }));
      } else if (activeTab === 1) {
        setStateForm(prev => ({
          ...prev,
          [field]: value,
        }));
      } else if (activeTab === 2) {
        setCityForm(prev => ({
          ...prev,
          [field]: value,
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      // Get the correct form data based on active tab
      let formData;
      if (activeTab === 0) {
        formData = countryForm;
      } else if (activeTab === 1) {
        formData = stateForm;
      } else if (activeTab === 2) {
        formData = cityForm;
      }
      
      console.log('Form data before processing:', formData);
      console.log('Active tab:', activeTab, 'Tab label:', tabConfig[activeTab].label);
      
      // Validation
      if (!formData.name.trim()) {
        setSnackbar({
          open: true,
          message: 'Name is required',
          severity: 'error',
        });
        return;
      }

      if (!formData.code.trim()) {
        setSnackbar({
          open: true,
          message: 'Code is required',
          severity: 'error',
        });
        return;
      }

      // Additional validation for states and cities
      if (activeTab === 1 && !formData.country) {
        setSnackbar({
          open: true,
          message: 'Country is required for State',
          severity: 'error',
        });
        return;
      }

      if (activeTab === 2 && !formData.state) {
        setSnackbar({
          open: true,
          message: 'State is required for City',
          severity: 'error',
        });
        return;
      }

      let dataToSend = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        name: formData.name.trim(),
      };

      // Clean up the data - ensure phone_code and currency_code are properly handled
      if (dataToSend.phone_code === '') {
        dataToSend.phone_code = null;
      }
      if (dataToSend.currency_code === '') {
        dataToSend.currency_code = null;
      }
      
      // Remove other empty fields that shouldn't be sent
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === '' && key !== 'name' && key !== 'code' && key !== 'country' && key !== 'state') {
          delete dataToSend[key];
        }
      });

      console.log('Sending data:', dataToSend);

      if (editingItem) {
        await api.put(`${tabConfig[activeTab].endpoint}${editingItem.id}/`, dataToSend);
        setSnackbar({
          open: true,
          message: `${tabConfig[activeTab].label} updated successfully!`,
          severity: 'success',
        });
      } else {
        await api.post(tabConfig[activeTab].endpoint, dataToSend);
        setSnackbar({
          open: true,
          message: `${tabConfig[activeTab].label} created successfully!`,
          severity: 'success',
        });
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error(`Error saving ${tabConfig[activeTab].label.toLowerCase()}:`, error);
      console.error('Error details:', error.response?.data);
      setSnackbar({
        open: true,
        message: `Error saving ${tabConfig[activeTab].label.toLowerCase()}. Please try again.`,
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${tabConfig[activeTab].label.toLowerCase()}?`)) {
      try {
        await api.delete(`${tabConfig[activeTab].endpoint}${id}/`);
        setSnackbar({
          open: true,
          message: `${tabConfig[activeTab].label} deleted successfully!`,
          severity: 'success',
        });
        loadData();
      } catch (error) {
        console.error(`Error deleting ${tabConfig[activeTab].label.toLowerCase()}:`, error);
        setSnackbar({
          open: true,
          message: `Error deleting ${tabConfig[activeTab].label.toLowerCase()}. Please try again.`,
          severity: 'error',
        });
      }
    }
  };

  const getStatesForCountry = (countryId) => {
    if (!countryId) return [];
    return states.filter(state => state.country === countryId);
  };

  const getCitiesForState = (stateId) => {
    if (!stateId) return [];
    return cities.filter(city => city.state === stateId);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please log in to access the General Master data management.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="General Masters" 
          subtitle="Manage Countries, States, and Cities in a unified interface"
        />
      </Box>

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Tab Header */}
        <Box sx={{ 
          background: themeColor,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="general master tabs"
              sx={{ 
                '& .MuiTab-root': { 
                  color: 'rgba(255,255,255,0.7)',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255,255,255,0.7)'
                  }
                },
                '& .Mui-selected': { 
                  color: 'white !important',
                  fontWeight: 600,
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: 3,
                  borderRadius: '0px 0px 0 0'
                }
              }}
            >
              {tabConfig.map((tab, index) => (
                <Tab 
                  key={index}
                  label={tab.label}
                  sx={{ minHeight: 60 }}
                />
              ))}
            </Tabs>
            
            <Button
              variant="contained"
              onClick={() => handleOpenDialog()}
              startIcon={<AddIcon />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 0,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Add {tabConfig[activeTab].label}
            </Button>
          </Box>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {/* Data Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Code</TableCell>
                  {activeTab === 1 && <TableCell sx={{ fontWeight: 600, color: themeColor }}>Country</TableCell>}
                  {activeTab === 2 && <TableCell sx={{ fontWeight: 600, color: themeColor }}>State</TableCell>}
                  {activeTab === 2 && <TableCell sx={{ fontWeight: 600, color: themeColor }}>Country</TableCell>}
                  {activeTab === 0 && <TableCell sx={{ fontWeight: 600, color: themeColor }}>Phone Code</TableCell>}
                  {activeTab === 0 && <TableCell sx={{ fontWeight: 600, color: themeColor }}>Currency</TableCell>}
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: themeColor }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tabConfig[activeTab].data.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" sx={{ color: themeColor }}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: themeColor }}>{item.code || '-'}</TableCell>
                    {activeTab === 1 && <TableCell sx={{ color: themeColor }}>{item.country_name || '-'}</TableCell>}
                    {activeTab === 2 && <TableCell sx={{ color: themeColor }}>{item.state_name || '-'}</TableCell>}
                    {activeTab === 2 && <TableCell sx={{ color: themeColor }}>{item.country_name || '-'}</TableCell>}
                    {activeTab === 0 && <TableCell sx={{ color: themeColor }}>{item.phone_code || '-'}</TableCell>}
                    {activeTab === 0 && <TableCell sx={{ color: themeColor }}>{item.currency_code || '-'}</TableCell>}
                    <TableCell>
                      <Chip
                        label={item.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          backgroundColor: item.is_active ? themeColor : 'grey.300',
                          color: item.is_active ? 'white' : 'grey.700',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(item)}
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.light', color: 'white' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item.id)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.light', color: 'white' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: themeColor,
          color: 'white'
        }}>
          {editingItem ? 'Edit' : 'Add'} {tabConfig[activeTab].label}
        </DialogTitle>
        <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Code"
                value={tabConfig[activeTab].form.code || ''}
                onChange={handleInputChange('code')}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                value={tabConfig[activeTab].form.name || ''}
                onChange={handleInputChange('name')}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>

            {/* Country-specific fields */}
            {activeTab === 0 && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Phone Code"
                    value={tabConfig[activeTab].form.phone_code || ''}
                    onChange={handleInputChange('phone_code')}
                    placeholder="+1"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Currency Code</InputLabel>
                    <Select
                      value={tabConfig[activeTab].form.currency_code || ''}
                      onChange={handleInputChange('currency_code')}
                      label="Currency Code"
                      sx={{ borderRadius: 0 }}
                    >
                      {currencyOptions.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {currency.symbol}
                            </Typography>
                            <Typography variant="body2">
                              {currency.code} - {currency.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* State-specific fields */}
            {activeTab === 1 && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Country</InputLabel>
                    <Select
                      value={tabConfig[activeTab].form.country || ''}
                      onChange={handleInputChange('country')}
                      label="Country"
                      required
                      sx={{ borderRadius: 0 }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* City-specific fields */}
            {activeTab === 2 && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Country</InputLabel>
                    <Select
                      value={tabConfig[activeTab].form.country || ''}
                      onChange={handleInputChange('country')}
                      label="Country"
                      required
                      sx={{ borderRadius: 0 }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>State</InputLabel>
                    <Select
                      value={tabConfig[activeTab].form.state || ''}
                      onChange={handleInputChange('state')}
                      label="State"
                      required
                      sx={{ borderRadius: 0 }}
                    >
                      {getStatesForCountry(tabConfig[activeTab].form.country).map((state) => (
                        <MenuItem key={state.id} value={state.id}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Postal Code Pattern"
                    value={tabConfig[activeTab].form.postal_code || ''}
                    onChange={handleInputChange('postal_code')}
                    placeholder="e.g., ^[0-9]{5}$"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Latitude"
                    value={tabConfig[activeTab].form.latitude || ''}
                    onChange={handleInputChange('latitude')}
                    type="number"
                    inputProps={{ step: "0.000001" }}
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Longitude"
                    value={tabConfig[activeTab].form.longitude || ''}
                    onChange={handleInputChange('longitude')}
                    type="number"
                    inputProps={{ step: "0.000001" }}
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
              </>
            )}

            {/* Status */}
            <Grid item xs={12} sx={{ mt: 0.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tabConfig[activeTab].form.is_active}
                    onChange={(e) => {
                      const currentTab = tabConfig[activeTab];
                      currentTab.setForm(prev => ({
                        ...prev,
                        is_active: e.target.checked,
                      }));
                    }}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                    }}
                  />
                }
                label="Active"
                sx={{ '& .MuiFormControlLabel-label': { color: themeColor, fontWeight: 500 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: 'grey.50' }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              borderColor: themeColor,
              color: themeColor,
              '&:hover': {
                borderColor: themeColor,
                backgroundColor: `${themeColor}20`
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ 
              backgroundColor: themeColor,
              '&:hover': {
                backgroundColor: `${themeColor}dd`
              }
            }}
          >
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
              sx={{ borderRadius: 0 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GeneralMasterPage;