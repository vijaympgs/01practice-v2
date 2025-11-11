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
  Chip,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Web as WebIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
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
    isActive: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Master data for dropdowns
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Load companies from API
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setIsAuthenticated(false);
          setSnackbar({ 
            open: true, 
            message: 'Please log in to access organization data.', 
            severity: 'warning' 
          });
          return;
        }

        setIsAuthenticated(true);

        const response = await api.get('/organization/companies/');
        const companiesData = response.data.results || response.data;
        
        // Map backend field names to frontend field names
        const mappedCompanies = companiesData.map(company => ({
          ...company,
          postalCode: company.postal_code,
          taxId: company.tax_id,
          registrationNumber: company.registration_number,
          isActive: company.is_active,
        }));
        
        setCompanies(mappedCompanies);
      } catch (error) {
        console.error('Error loading companies:', error);
        if (error.response?.status === 401) {
          setSnackbar({ 
            open: true, 
            message: 'Authentication required. Please log in.', 
            severity: 'error' 
          });
        } else {
          setSnackbar({ 
            open: true, 
            message: 'Error loading companies. Please check your connection.', 
            severity: 'error' 
          });
        }
      }
    };
    
    loadCompanies();
  }, []);
  
  useEffect(() => {
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

  const handleOpenDialog = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({
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
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
  };

  const handleSave = async () => {
    let companyData; // Declare outside try block for error logging
    
    try {
      // Validate required fields
      if (!formData.name || !formData.code) {
        setSnackbar({ 
          open: true, 
          message: 'Company name and code are required fields.', 
          severity: 'error' 
        });
        return;
      }

      // Validate code format (uppercase letters and numbers only)
      const codeRegex = /^[A-Z0-9]+$/;
      if (!codeRegex.test(formData.code.toUpperCase())) {
        setSnackbar({ 
          open: true, 
          message: 'Company code must contain only uppercase letters and numbers.', 
          severity: 'error' 
        });
        return;
      }

      // Map frontend field names to backend field names
      companyData = {
        name: formData.name.trim(),
        code: formData.code.toUpperCase().trim(), // Ensure code is uppercase and trimmed
        description: formData.description?.trim() || null,
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state: formData.state?.trim() || null,
        country: formData.country?.trim() || null,
        postal_code: formData.postalCode?.trim() || null,
        phone: formData.phone?.trim() || null,
        email: formData.email?.trim() || null,
        website: formData.website?.trim() || null,
        tax_id: formData.taxId?.trim() || null,
        registration_number: formData.registrationNumber?.trim() || null,
        currency: formData.currency,
        timezone: formData.timezone,
        is_active: formData.isActive,
      };

      if (editingCompany) {
        // Update existing company
        const response = await api.put(`/organization/companies/${editingCompany.id}/`, companyData);
        setCompanies(prev => 
          prev.map(company => 
            company.id === editingCompany.id 
              ? { ...response.data, id: editingCompany.id, updatedAt: new Date().toISOString().split('T')[0] }
              : company
          )
        );
        setSnackbar({ open: true, message: 'Company updated successfully!', severity: 'success' });
      } else {
        // Add new company
        const response = await api.post('/organization/companies/', companyData);
        const newCompany = {
          ...response.data,
          id: response.data.id,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setCompanies(prev => [...prev, newCompany]);
        setSnackbar({ open: true, message: 'Company added successfully!', severity: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving company:', error);
      console.error('Error details:', error.response?.data);
      console.error('Company data sent:', companyData);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.detail || error.response?.data?.message || 'Error saving company. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (companyId) => {
    try {
      await api.delete(`/organization/companies/${companyId}/`);
      setCompanies(prev => prev.filter(company => company.id !== companyId));
      setSnackbar({ open: true, message: 'Company deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting company:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error deleting company. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
          <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Authentication Required
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please log in to access the Company Management system.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.href = '/login'}
            sx={{ px: 4 }}
          >
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <PageTitle 
          title="Company Management" 
          subtitle="Manage company information and organizational details"
          showIcon={true}
          icon={<BusinessIcon />}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{companies.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Companies
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <LocationIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {companies.filter(c => c.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Companies
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <WebIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {companies.filter(c => c.website).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    With Website
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <PhoneIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {companies.filter(c => c.phone).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    With Contact
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Companies Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Companies</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Company
            </Button>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Companies Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Start by creating your first company to manage your organization
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenDialog()}
                        >
                          Create First Company
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {company.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {company.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={company.code} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {company.city}, {company.state}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {company.country}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 16, mr: 1 }} />
                            {company.phone}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ fontSize: 16, mr: 1 }} />
                            {company.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={company.isActive ? 'Active' : 'Inactive'}
                          color={company.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(company)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(company.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCompany ? 'Edit Company' : 'Add New Company'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Code"
                value={formData.code}
                onChange={handleInputChange('code')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address Information
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>City</InputLabel>
                <Select
                  value={formData.city}
                  onChange={handleInputChange('city')}
                  label="City"
                >
                  {getCitiesForState(formData.state).map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state}
                  onChange={handleInputChange('state')}
                  label="State"
                >
                  {getStatesForCountry(formData.country).map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Country</InputLabel>
                <Select
                  value={formData.country}
                  onChange={handleInputChange('country')}
                  label="Country"
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
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.postalCode}
                onChange={handleInputChange('postalCode')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={handleInputChange('website')}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Business Information
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax ID"
                value={formData.taxId}
                onChange={handleInputChange('taxId')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Number"
                value={formData.registrationNumber}
                onChange={handleInputChange('registrationNumber')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Currency"
                value={formData.currency}
                onChange={handleInputChange('currency')}
                select
                SelectProps={{ native: true }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Timezone"
                value={formData.timezone}
                onChange={handleInputChange('timezone')}
                select
                SelectProps={{ native: true }}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
            {editingCompany ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

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

export default CompanyPage;
