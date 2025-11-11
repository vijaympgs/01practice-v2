import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
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
  Badge,
  LinearProgress,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  LocalShipping as LocalShippingIcon,
  Public as PublicIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Factory as FactoryIcon,
  Warehouse as WarehouseIcon,
  BusinessCenter as BusinessCenterIcon,
  Assessment as AssessmentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Map as MapIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
import api from '../../services/api';
import axios from 'axios';
import LocationMap from '../../components/common/LocationMap';

const UnifiedOrganizationPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Theme color state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  // Master data for dropdowns
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Form data for different entities
  const [companyForm, setCompanyForm] = useState({
    name: '',
    code: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    taxId: '',
    registrationNumber: '',
    currency: 'USD',
    timezone: 'UTC',
    logo: null,
    isActive: true,
  });

  const [locationForm, setLocationForm] = useState({
    name: '',
    code: '',
    description: '',
    companyId: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    email: '',
    manager: '',
    locationType: 'store',
    coordinates: {
      latitude: '',
      longitude: '',
    },
    operatingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: false },
    },
    isActive: true,
  });

  const tabConfig = [
    {
      label: 'Company',
      icon: <BusinessIcon />,
      color: 'primary',
      data: companies,
      setData: setCompanies,
      form: companyForm,
      setForm: setCompanyForm,
      endpoint: '/organization/companies/',
      columns: ['name', 'code', 'email', 'phone', 'isActive'],
    },
    {
      label: 'Locations',
      icon: <LocationOnIcon />,
      color: 'secondary',
      data: locations,
      setData: setLocations,
      form: locationForm,
      setForm: setLocationForm,
      endpoint: '/organization/locations/',
      columns: ['name', 'code', 'company', 'locationType', 'isActive'],
    },
  ];

  const locationTypeConfig = {
    store: { label: 'Store', icon: <StoreIcon />, color: 'primary' },
    headquarters: { label: 'Head Quarters', icon: <HomeIcon />, color: 'success' },
    warehouse: { label: 'Warehouse', icon: <WarehouseIcon />, color: 'warning' },
    distribution: { label: 'Distribution Center', icon: <LocalShippingIcon />, color: 'info' },
    factory: { label: 'Factory', icon: <FactoryIcon />, color: 'error' },
    showroom: { label: 'Showroom', icon: <BusinessCenterIcon />, color: 'secondary' },
  };

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

  useEffect(() => {
    loadData();
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      // Load countries
      const countriesResponse = await api.get('/geographical-data/countries/');
      const countriesData = countriesResponse.data.results || countriesResponse.data;
      console.log('Countries loaded:', countriesData);
      setCountries(countriesData);
      
      // Load states
      const statesResponse = await api.get('/geographical-data/states/');
      const statesData = statesResponse.data.results || statesResponse.data;
      console.log('States loaded:', statesData);
      console.log('First state structure:', statesData[0]);
      console.log('State country field:', statesData[0]?.country);
      setStates(statesData);
      
      // Load cities
      const citiesResponse = await api.get('/geographical-data/cities/');
      const citiesData = citiesResponse.data.results || citiesResponse.data;
      console.log('Cities loaded:', citiesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        console.warn('⚠️ No access token found');
        return;
      }

      setIsAuthenticated(true);
      console.log('🔄 Loading organization data...');

      // Load companies - use axios directly with localhost
      console.log('🔍 Fetching companies from: /organization/companies/');
      // Use relative URL to work with Vite proxy
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      
      const companiesResponse = await axios.get(`${apiBaseUrl}/organization/companies/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 5000,
      });
      const companiesData = companiesResponse.data.results || companiesResponse.data;
      console.log('✅ Companies API Response:', companiesResponse.data);
      console.log('✅ Companies data:', companiesData);
      console.log('✅ Companies count:', Array.isArray(companiesData) ? companiesData.length : 0);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);

      // Load locations - use axios directly with localhost
      console.log('🔍 Fetching locations from: /organization/locations/');
      const locationsResponse = await axios.get(`${apiBaseUrl}/organization/locations/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 5000,
      });
      const locationsData = locationsResponse.data.results || locationsResponse.data;
      console.log('✅ Locations API Response:', locationsResponse.data);
      console.log('✅ Locations data:', locationsData);
      console.log('✅ Locations count:', Array.isArray(locationsData) ? locationsData.length : 0);
      setLocations(Array.isArray(locationsData) ? locationsData : []);
      
      // Show success message if data loaded
      if ((Array.isArray(companiesData) && companiesData.length > 0) || 
          (Array.isArray(locationsData) && locationsData.length > 0)) {
        setSnackbar({ 
          open: true, 
          message: `Loaded ${companiesData.length || 0} companies and ${locationsData.length || 0} locations`, 
          severity: 'success' 
        });
      } else {
        setSnackbar({ 
          open: true, 
          message: 'No companies or locations found. Please create some from the admin panel.', 
          severity: 'info' 
        });
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setSnackbar({ 
          open: true, 
          message: 'Authentication required. Please log in.', 
          severity: 'error' 
        });
      } else {
        setSnackbar({ 
          open: true, 
          message: `Failed to load data: ${error.message || 'Unknown error'}`, 
          severity: 'error' 
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
    const currentTab = tabConfig[activeTab];
    
    if (item) {
      // Edit mode - map backend data to frontend form
      if (activeTab === 0) {
        // Company - find matching IDs for existing country/state/city names
        const countryId = countries.find(c => c.name === item.country)?.id || '';
        const stateId = states.find(s => s.name === item.state)?.id || '';
        const cityId = cities.find(c => c.name === item.city)?.id || '';
        
        setCompanyForm({
          name: item.name || '',
          code: item.code || '',
          description: item.description || '',
          address: item.address || '',
          city: cityId,
          state: stateId,
          country: countryId,
          postalCode: item.postal_code || '',
          phone: item.phone || '',
          email: item.email || '',
          website: item.website || '',
          taxId: item.tax_id || '',
          registrationNumber: item.registration_number || '',
          currency: item.currency || 'USD',
          timezone: item.timezone || 'UTC',
          logo: item.logo || null,
          isActive: item.is_active !== false,
        });
      } else {
        // Location - find matching IDs for existing country/state/city names
        const countryId = countries.find(c => c.name === item.country)?.id || '';
        const stateId = states.find(s => s.name === item.state)?.id || '';
        const cityId = cities.find(c => c.name === item.city)?.id || '';
        
        setLocationForm({
          name: item.name || '',
          code: item.code || '',
          description: item.description || '',
          companyId: item.company || '',
          address: item.address || '',
          city: cityId,
          state: stateId,
          country: countryId,
          postalCode: item.postal_code || '',
          phone: item.phone || '',
          email: item.email || '',
          manager: item.manager || '',
          locationType: item.location_type || 'store',
          coordinates: {
            latitude: item.latitude ? item.latitude.toString() : '',
            longitude: item.longitude ? item.longitude.toString() : '',
          },
          operatingHours: item.operating_hours || locationForm.operatingHours,
          isActive: item.is_active !== false,
        });
      }
    } else {
      // Add mode - reset forms
      if (activeTab === 0) {
        setCompanyForm({
          name: '',
          code: '',
          description: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          phone: '',
          email: '',
          website: '',
          taxId: '',
          registrationNumber: '',
          currency: 'USD',
          timezone: 'UTC',
          logo: null,
          isActive: true,
        });
      } else {
        setLocationForm({
          name: '',
          code: '',
          description: '',
          companyId: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          phone: '',
          email: '',
          manager: '',
          locationType: 'store',
          coordinates: {
            latitude: '',
            longitude: '',
          },
          operatingHours: {
            monday: { open: '09:00', close: '18:00', isOpen: true },
            tuesday: { open: '09:00', close: '18:00', isOpen: true },
            wednesday: { open: '09:00', close: '18:00', isOpen: true },
            thursday: { open: '09:00', close: '18:00', isOpen: true },
            friday: { open: '09:00', close: '18:00', isOpen: true },
            saturday: { open: '10:00', close: '16:00', isOpen: true },
            sunday: { open: '10:00', close: '16:00', isOpen: false },
          },
          isActive: true,
        });
      }
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    try {
      const currentTab = tabConfig[activeTab];
      
      if (activeTab === 0) {
        // Save Company
        const selectedCountry = countries.find(c => c.id === companyForm.country);
        const selectedState = states.find(s => s.id === companyForm.state);
        const selectedCity = cities.find(c => c.id === companyForm.city);
        
        const companyData = {
          name: companyForm.name.trim(),
          code: companyForm.code.toUpperCase().trim(),
          description: companyForm.description?.trim() || null,
          address: companyForm.address?.trim() || null,
          city: selectedCity?.name || companyForm.city?.trim() || null,
          state: selectedState?.name || companyForm.state?.trim() || null,
          country: selectedCountry?.name || companyForm.country?.trim() || null,
          postal_code: companyForm.postalCode?.trim() || null,
          phone: companyForm.phone?.trim() || null,
          email: companyForm.email?.trim() || null,
          website: companyForm.website?.trim() || null,
          tax_id: companyForm.taxId?.trim() || null,
          registration_number: companyForm.registrationNumber?.trim() || null,
          currency: companyForm.currency,
          timezone: companyForm.timezone,
          logo: companyForm.logo,
          is_active: companyForm.isActive,
        };

        if (editingItem) {
          const formData = new FormData();
          Object.keys(companyData).forEach(key => {
            if (companyData[key] !== null && companyData[key] !== undefined) {
              formData.append(key, companyData[key]);
            }
          });
          
          const response = await api.put(`${currentTab.endpoint}${editingItem.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setCompanies(prev => 
            prev.map(company => 
              company.id === editingItem.id ? response.data : company
            )
          );
          setSnackbar({ open: true, message: 'Company updated successfully!', severity: 'success' });
        } else {
          const formData = new FormData();
          Object.keys(companyData).forEach(key => {
            if (companyData[key] !== null && companyData[key] !== undefined) {
              formData.append(key, companyData[key]);
            }
          });
          
          const response = await api.post(currentTab.endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setCompanies(prev => [...prev, response.data]);
          setSnackbar({ open: true, message: 'Company added successfully!', severity: 'success' });
        }
      } else {
        // Save Location
        const selectedCountry = countries.find(c => c.id === locationForm.country);
        const selectedState = states.find(s => s.id === locationForm.state);
        const selectedCity = cities.find(c => c.id === locationForm.city);
        
        const locationData = {
          name: locationForm.name.trim(),
          code: locationForm.code.toUpperCase().trim(),
          description: locationForm.description?.trim() || null,
          company: locationForm.companyId,
          address: locationForm.address?.trim() || null,
          city: selectedCity?.name || locationForm.city?.trim() || null,
          state: selectedState?.name || locationForm.state?.trim() || null,
          country: selectedCountry?.name || locationForm.country?.trim() || null,
          postal_code: locationForm.postalCode?.trim() || null,
          phone: locationForm.phone?.trim() || null,
          email: locationForm.email?.trim() || null,
          manager: locationForm.manager?.trim() || null,
          location_type: locationForm.locationType,
          latitude: locationForm.coordinates.latitude ? parseFloat(locationForm.coordinates.latitude) : null,
          longitude: locationForm.coordinates.longitude ? parseFloat(locationForm.coordinates.longitude) : null,
          operating_hours: locationForm.operatingHours,
          is_active: locationForm.isActive,
        };

        if (editingItem) {
          const response = await api.put(`${currentTab.endpoint}${editingItem.id}/`, locationData);
          setLocations(prev => 
            prev.map(location => 
              location.id === editingItem.id ? response.data : location
            )
          );
          setSnackbar({ open: true, message: 'Location updated successfully!', severity: 'success' });
        } else {
          const response = await api.post(currentTab.endpoint, locationData);
          setLocations(prev => [...prev, response.data]);
          setSnackbar({ open: true, message: 'Location added successfully!', severity: 'success' });
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.detail || 'Error saving. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const currentTab = tabConfig[activeTab];
      await api.delete(`${currentTab.endpoint}${itemId}/`);
      currentTab.setData(prev => prev.filter(item => item.id !== itemId));
      setSnackbar({ open: true, message: `${currentTab.label.slice(0, -1)} deleted successfully!`, severity: 'success' });
    } catch (error) {
      console.error('Error deleting:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.detail || 'Error deleting. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const getStatesForCountry = (countryId) => {
    if (!countryId) return [];
    const filteredStates = states.filter(state => state.country === countryId);
    console.log('Filtering states for country:', countryId, 'Found states:', filteredStates);
    return filteredStates;
  };

  const getCitiesForState = (stateId) => {
    if (!stateId) return [];
    const filteredCities = cities.filter(city => city.state === stateId);
    console.log('Filtering cities for state:', stateId, 'Found cities:', filteredCities);
    return filteredCities;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    if (activeTab === 0) {
      // Company form - handle cascading field clearing
      if (field === 'country') {
        setCompanyForm(prev => ({
          ...prev,
          [field]: value,
          state: '', // Clear state when country changes
          city: '', // Clear city when country changes
        }));
      } else if (field === 'state') {
        setCompanyForm(prev => ({
          ...prev,
          [field]: value,
          city: '', // Clear city when state changes
        }));
      } else {
        setCompanyForm(prev => ({
          ...prev,
          [field]: value,
        }));
      }
    } else {
      // Location form - handle cascading field clearing
      if (field === 'country') {
        setLocationForm(prev => ({
          ...prev,
          [field]: value,
          state: '', // Clear state when country changes
          city: '', // Clear city when country changes
        }));
      } else if (field === 'state') {
        setLocationForm(prev => ({
          ...prev,
          [field]: value,
          city: '', // Clear city when state changes
        }));
      } else {
        setLocationForm(prev => ({
          ...prev,
          [field]: value,
        }));
      }
    }
  };

  const handleCoordinateChange = (latitude, longitude) => {
    setLocationForm(prev => ({
      ...prev,
      coordinates: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    }));
  };

  const getLocationTypeIcon = (type) => {
    return locationTypeConfig[type]?.icon || <StoreIcon />;
  };

  const getLocationTypeColor = (type) => {
    return locationTypeConfig[type]?.color || 'primary';
  };

  const getLocationTypeLabel = (type) => {
    return locationTypeConfig[type]?.label || type;
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please log in to access the Organization management.
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="Organization Management" 
          subtitle="Manage your companies and locations in a unified interface"
        />
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {tabConfig.map((tab, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${tab.color === 'primary' ? themeColor : '#9c27b0'}20, ${tab.color === 'primary' ? themeColor : '#ba68c8'}10)`,
              border: `1px solid ${tab.color === 'primary' ? themeColor : '#9c27b0'}30`,
              borderRadius: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" color={`${tab.color}.main`} sx={{ fontWeight: 'bold' }}>
                      {tab.data.length}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {tab.data.length === 1 ? tab.label : tab.label === 'Company' ? 'Companies' : 'Locations'}
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: `${tab.color}.main`, 
                    width: 60, 
                    height: 60,
                    boxShadow: 2
                  }}>
                    {tab.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
        <Card sx={{ 
          boxShadow: 3,
          borderRadius: 0,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: themeColor,
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="organization tabs"
                textColor="inherit"
                TabIndicatorProps={{ style: { backgroundColor: 'white', height: 3 } }}
                sx={{ 
                  '& .MuiTab-root': { 
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
                  },
                  '& .Mui-selected': { 
                    color: 'white !important',
                    fontWeight: 600,
                    '& .MuiSvgIcon-root': { color: 'white !important' }
                  }
                }}
              >
                {tabConfig.map((tab, index) => (
                  <Tab
                    key={index}
                    label={tab.label}
                  />
                ))}
              </Tabs>
              <ActionButton
                onClick={() => handleOpenDialog()}
                startIcon={<AddIcon />}
              >
                Add {tabConfig[activeTab].label}
              </ActionButton>
            </Box>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {loading && <LinearProgress />}
            
            {/* Data Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600, color: themeColor }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: themeColor }}>Code</TableCell>
                    {activeTab === 1 && <TableCell sx={{ fontWeight: 600, color: themeColor }}>Company</TableCell>}
                    {activeTab === 1 && <TableCell sx={{ fontWeight: 600, color: themeColor }}>Type</TableCell>}
                    {activeTab === 0 && <TableCell sx={{ fontWeight: 600, color: themeColor }}>Contact</TableCell>}
                    <TableCell sx={{ fontWeight: 600, color: themeColor }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: themeColor }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tabConfig[activeTab].data.map((item, index) => (
                      <TableRow hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }} key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: themeColor,
                              width: 32,
                              height: 32
                            }}>
                              {activeTab === 0 ? <BusinessIcon /> : getLocationTypeIcon(item.location_type)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.name}
                              </Typography>
                              {item.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {item.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.code} 
                            size="small" 
                            sx={{ 
                              borderColor: themeColor, 
                              color: themeColor 
                            }}
                            variant="outlined"
                          />
                        </TableCell>
                        {activeTab === 1 && (
                          <TableCell sx={{ color: themeColor }}>
                            {companies.find(c => c.id === item.company)?.name || 'Unknown'}
                          </TableCell>
                        )}
                        {activeTab === 1 && (
                          <TableCell>
                            <Chip
                              icon={getLocationTypeIcon(item.location_type)}
                              label={getLocationTypeLabel(item.location_type)}
                              sx={{
                                borderColor: themeColor,
                                color: themeColor,
                                '& .MuiChip-icon': {
                                  color: themeColor
                                }
                              }}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        )}
                        {activeTab === 0 && (
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {item.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <EmailIcon sx={{ fontSize: 14, color: themeColor }} />
                                  <Typography variant="caption" sx={{ color: themeColor }}>{item.email}</Typography>
                                </Box>
                              )}
                              {item.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PhoneIcon sx={{ fontSize: 14, color: themeColor }} />
                                  <Typography variant="caption" sx={{ color: themeColor }}>{item.phone}</Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                        )}
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
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(item.id)}
                                color="error"
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
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: 4
          }
        }}
      >
        <DialogTitle sx={{ background: themeColor, color: 'white' }}>
          {`${editingItem ? 'Edit' : 'Add'} ${tabConfig[activeTab].label}`}
        </DialogTitle>
        <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Name"
                value={activeTab === 0 ? companyForm.name : locationForm.name}
                onChange={handleInputChange('name')}
                required
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Code"
                value={activeTab === 0 ? companyForm.code : locationForm.code}
                onChange={handleInputChange('code')}
                required
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={activeTab === 0 ? companyForm.description : locationForm.description}
                onChange={handleInputChange('description')}
                multiline
                rows={2}
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>

            {/* Location-specific fields */}
            {activeTab === 1 && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Company</InputLabel>
                    <Select
                      value={locationForm.companyId}
                      onChange={handleInputChange('companyId')}
                      label="Company"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    >
                      {companies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name} ({company.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Location Type</InputLabel>
                    <Select
                      value={locationForm.locationType}
                      onChange={handleInputChange('locationType')}
                      label="Location Type"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    >
                      {Object.entries(locationTypeConfig).map(([key, config]) => (
                        <MenuItem key={key} value={key}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {config.icon}
                            {config.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: themeColor }}>Country</InputLabel>
                    <Select
                      value={locationForm.country}
                      onChange={handleInputChange('country')}
                      label="Country"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
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
                      value={locationForm.state}
                      onChange={handleInputChange('state')}
                      label="State"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    >
                      {getStatesForCountry(locationForm.country).map((state) => (
                        <MenuItem key={state.id} value={state.id}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={activeTab === 0 ? companyForm.address : locationForm.address}
                onChange={handleInputChange('address')}
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: themeColor }}>Country</InputLabel>
                <Select
                  value={activeTab === 0 ? companyForm.country : locationForm.country}
                  onChange={handleInputChange('country')}
                  label="Country"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: themeColor }}>State</InputLabel>
                <Select
                  value={activeTab === 0 ? companyForm.state : locationForm.state}
                  onChange={handleInputChange('state')}
                  label="State"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                >
                  {getStatesForCountry(activeTab === 0 ? companyForm.country : locationForm.country).map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: themeColor }}>City</InputLabel>
                <Select
                  value={activeTab === 0 ? companyForm.city : locationForm.city}
                  onChange={handleInputChange('city')}
                  label="City"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                >
                  {getCitiesForState(activeTab === 0 ? companyForm.state : locationForm.state).map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={activeTab === 0 ? companyForm.postalCode : locationForm.postalCode}
                onChange={handleInputChange('postalCode')}
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={activeTab === 0 ? companyForm.phone : locationForm.phone}
                onChange={handleInputChange('phone')}
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={activeTab === 0 ? companyForm.email : locationForm.email}
                onChange={handleInputChange('email')}
                type="email"
                variant="outlined"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            {activeTab === 0 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={companyForm.website}
                  onChange={handleInputChange('website')}
                  variant="outlined"
                  InputLabelProps={{ sx: { color: themeColor } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
              </Grid>
            )}
            {activeTab === 1 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manager"
                  value={locationForm.manager}
                  onChange={handleInputChange('manager')}
                  variant="outlined"
                  InputLabelProps={{ sx: { color: themeColor } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
              </Grid>
            )}

            {/* Company Logo and Status */}
            {activeTab === 0 && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {companyForm.logo && (
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      border: '2px dashed #ccc', 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {typeof companyForm.logo === 'string' ? (
                        <img 
                          src={companyForm.logo} 
                          alt="Company Logo" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <img 
                          src={URL.createObjectURL(companyForm.logo)} 
                          alt="Company Logo Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      )}
                    </Box>
                  )}
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="company-logo-upload"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setCompanyForm(prev => ({ ...prev, logo: file }));
                        }
                      }}
                    />
                    <label htmlFor="company-logo-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<BusinessIcon />}
                        size="small"
                        sx={{ mb: 0 }}
                      >
                        {companyForm.logo ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                    </label>
                    {companyForm.logo && (
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => setCompanyForm(prev => ({ ...prev, logo: null }))}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={activeTab === 0 ? 6 : 12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={activeTab === 0 ? companyForm.isActive : locationForm.isActive}
                    onChange={(e) => handleInputChange('isActive')({ target: { value: e.target.checked } })}
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

            {/* Location-specific coordinates and map */}
            {activeTab === 1 && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    value={locationForm.coordinates.latitude || ''}
                    onChange={(e) => setLocationForm(prev => ({
                      ...prev,
                      coordinates: { ...prev.coordinates, latitude: e.target.value }
                    }))}
                    type="number"
                    inputProps={{ step: "0.000001" }}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    value={locationForm.coordinates.longitude || ''}
                    onChange={(e) => setLocationForm(prev => ({
                      ...prev,
                      coordinates: { ...prev.coordinates, longitude: e.target.value }
                    }))}
                    type="number"
                    inputProps={{ step: "0.000001" }}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocationMap
                    latitude={locationForm.coordinates.latitude ? parseFloat(locationForm.coordinates.latitude) : null}
                    longitude={locationForm.coordinates.longitude ? parseFloat(locationForm.coordinates.longitude) : null}
                    onLocationChange={handleCoordinateChange}
                    locationName={locationForm.name || "New Location"}
                    height="250px"
                    editable={true}
                  />
                </Grid>
              </>
            )}
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
            {editingItem ? 'Update' : 'Save'}
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
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UnifiedOrganizationPage;
