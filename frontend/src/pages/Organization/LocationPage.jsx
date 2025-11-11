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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Map as MapIcon,
  Store as StoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import LocationMap from '../../components/common/LocationMap';

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
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
    isActive: true,
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
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
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

        // Load companies
        const companiesResponse = await api.get('/organization/companies/');
        const companiesData = companiesResponse.data.results || companiesResponse.data;
        
        // Map backend field names to frontend field names for companies
        const mappedCompanies = companiesData.map(company => ({
          ...company,
          postalCode: company.postal_code,
          taxId: company.tax_id,
          registrationNumber: company.registration_number,
          isActive: company.is_active,
        }));
        
        setCompanies(mappedCompanies);
        
        // Load locations
        const locationsResponse = await api.get('/organization/locations/');
        const locationsData = locationsResponse.data.results || locationsResponse.data;
        
        // Map backend field names to frontend field names for locations
        const mappedLocations = locationsData.map(location => ({
          ...location,
          companyId: location.company,
          companyName: location.company_name,
          postalCode: location.postal_code,
          locationType: location.location_type,
          isActive: location.is_active,
          coordinates: {
            latitude: location.latitude ? location.latitude.toString() : '',
            longitude: location.longitude ? location.longitude.toString() : '',
          },
          operatingHours: location.operating_hours || {},
        }));
        
        setLocations(mappedLocations);
      } catch (error) {
        console.error('Error loading data:', error);
        if (error.response?.status === 401) {
          setSnackbar({ 
            open: true, 
            message: 'Authentication required. Please log in.', 
            severity: 'error' 
          });
        } else {
          setSnackbar({ 
            open: true, 
            message: 'Error loading data. Please check your connection.', 
            severity: 'error' 
          });
        }
      }
    };
    
    loadData();
  }, []);

  const handleOpenDialog = (location = null) => {
    if (location) {
      setEditingLocation(location);
      setFormData(location);
    } else {
      setEditingLocation(null);
      setFormData({
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
        isActive: true,
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
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLocation(null);
  };

  const handleSave = async () => {
    let locationData; // Declare outside try block for error logging
    
    try {
      // Validate required fields
      if (!formData.name || !formData.code || !formData.companyId) {
        setSnackbar({ 
          open: true, 
          message: 'Location name, code, and company are required fields.', 
          severity: 'error' 
        });
        return;
      }

      // Validate code format (uppercase letters and numbers only)
      const codeRegex = /^[A-Z0-9]+$/;
      if (!codeRegex.test(formData.code.toUpperCase())) {
        setSnackbar({ 
          open: true, 
          message: 'Location code must contain only uppercase letters and numbers.', 
          severity: 'error' 
        });
        return;
      }

      // Map frontend field names to backend field names
      locationData = {
        name: formData.name.trim(),
        code: formData.code.toUpperCase().trim(), // Ensure code is uppercase and trimmed
        description: formData.description?.trim() || null,
        company: formData.companyId, // Company ID is UUID string, not integer
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state: formData.state?.trim() || null,
        country: formData.country?.trim() || null,
        postal_code: formData.postalCode?.trim() || null,
        phone: formData.phone?.trim() || null,
        email: formData.email?.trim() || null,
        manager: formData.manager?.trim() || null,
        location_type: formData.locationType,
        latitude: formData.coordinates.latitude ? parseFloat(formData.coordinates.latitude) : null,
        longitude: formData.coordinates.longitude ? parseFloat(formData.coordinates.longitude) : null,
        operating_hours: formData.operatingHours,
        is_active: formData.isActive,
      };

      if (editingLocation) {
        // Update existing location
        const response = await api.put(`/organization/locations/${editingLocation.id}/`, locationData);
        setLocations(prev => 
          prev.map(location => 
            location.id === editingLocation.id 
              ? { ...response.data, id: editingLocation.id, updatedAt: new Date().toISOString().split('T')[0] }
              : location
          )
        );
        setSnackbar({ open: true, message: 'Location updated successfully!', severity: 'success' });
      } else {
        // Add new location
        const response = await api.post('/organization/locations/', locationData);
        const newLocation = {
          ...response.data,
          id: response.data.id,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setLocations(prev => [...prev, newLocation]);
        setSnackbar({ open: true, message: 'Location added successfully!', severity: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving location:', error);
      console.error('Error details:', error.response?.data);
      console.error('Location data sent:', locationData);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.location_type?.[0] || 
                 error.response?.data?.detail || 
                 error.response?.data?.message || 
                 'Error saving location. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (locationId) => {
    try {
      await api.delete(`/organization/locations/${locationId}/`);
      setLocations(prev => prev.filter(location => location.id !== locationId));
      setSnackbar({ open: true, message: 'Location deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting location:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error deleting location. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Special validation for headquarters
    if (field === 'locationType' && value === 'headquarters') {
      const companyId = formData.companyId;
      if (companyId) {
        const existingHeadquarters = locations.find(
          location => location.companyId === companyId && 
                     location.locationType === 'headquarters' && 
                     location.id !== editingLocation?.id
        );
        
        if (existingHeadquarters) {
          setSnackbar({ 
            open: true, 
            message: 'This company already has a headquarters location. Only one headquarters is allowed per company.', 
            severity: 'error' 
          });
          return; // Don't update the field
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMapLocationChange = (latitude, longitude) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    }));
  };

  const handleCoordinateChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      coordinates: { 
        ...prev.coordinates, 
        [field]: value 
      },
    }));
  };

  const handleOperatingHoursChange = (day, field) => (event) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: event.target.value,
        },
      },
    }));
  };

  const getLocationTypeColor = (type) => {
    switch (type) {
      case 'store': return 'success';
      case 'headquarters': return 'primary';
      case 'warehouse': return 'warning';
      case 'distribution': return 'info';
      default: return 'default';
    }
  };

  const getLocationTypeIcon = (type) => {
    switch (type) {
      case 'store': return <StoreIcon />;
      case 'headquarters': return <BusinessIcon />;
      case 'warehouse': return <MapIcon />;
      case 'distribution': return <LocationIcon />;
      default: return <LocationIcon />;
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
          <LocationIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Authentication Required
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please log in to access the Location Management system.
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
          title="Location Management" 
          subtitle="Manage physical locations, stores, offices, and facilities"
          showIcon={true}
          icon={<LocationIcon />}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <LocationIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{locations.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Locations
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
                  <StoreIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {locations.filter(l => l.locationType === 'store').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stores
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
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {locations.filter(l => l.locationType === 'headquarters').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Head Quarters
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
                  <MapIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {locations.filter(l => l.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Locations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Locations Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Locations</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Location
            </Button>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <LocationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Locations Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {companies.length === 0 
                            ? 'First create a company, then add locations for that company'
                            : 'Start by creating your first location for your company'
                          }
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenDialog()}
                          disabled={companies.length === 0}
                        >
                          {companies.length === 0 ? 'Create Company First' : 'Create Location'}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {location.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {location.code} • {location.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={location.companyName} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getLocationTypeIcon(location.locationType)}
                        label={location.locationType}
                        color={getLocationTypeColor(location.locationType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {location.address}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {location.city}, {location.state} {location.postalCode}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 16, mr: 1 }} />
                          {location.manager}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ fontSize: 16, mr: 1 }} />
                          {location.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={location.isActive ? 'Active' : 'Inactive'}
                        color={location.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(location)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(location.id)}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingLocation ? 'Edit Location' : 'Add New Location'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location Code"
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Company</InputLabel>
                <Select
                  value={formData.companyId}
                  onChange={handleInputChange('companyId')}
                  label="Company"
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
                <InputLabel>Location Type</InputLabel>
                <Select
                  value={formData.locationType}
                  onChange={handleInputChange('locationType')}
                  label="Location Type"
                >
                  <MenuItem value="store">Store</MenuItem>
                  <MenuItem 
                    value="headquarters"
                    disabled={Boolean(
                      formData.companyId && 
                      locations.some(
                        location => location.companyId === formData.companyId && 
                                   location.locationType === 'headquarters' && 
                                   location.id !== editingLocation?.id
                      )
                    )}
                  >
                    Head Quarters
                    {formData.companyId && 
                     locations.some(
                       location => location.companyId === formData.companyId && 
                                  location.locationType === 'headquarters' && 
                                  location.id !== editingLocation?.id
                     ) && 
                     ' (Already exists for this company)'
                    }
                  </MenuItem>
                  <MenuItem value="warehouse">Warehouse</MenuItem>
                  <MenuItem value="distribution">Distribution Center</MenuItem>
                </Select>
              </FormControl>
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
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={handleInputChange('city')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State/Province"
                value={formData.state}
                onChange={handleInputChange('state')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={handleInputChange('country')}
              />
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
                label="Manager"
                value={formData.manager}
                onChange={handleInputChange('manager')}
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
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Coordinates
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Latitude"
                value={formData.coordinates.latitude || ''}
                onChange={handleCoordinateChange('latitude')}
                placeholder="e.g., 40.7128"
                helperText="Enter latitude coordinate (-90 to 90)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Longitude"
                value={formData.coordinates.longitude || ''}
                onChange={handleCoordinateChange('longitude')}
                placeholder="e.g., -74.0060"
                helperText="Enter longitude coordinate (-180 to 180)"
              />
            </Grid>
            
            {/* Map Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Map Location
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <LocationMap
                latitude={formData.coordinates.latitude ? parseFloat(formData.coordinates.latitude) : null}
                longitude={formData.coordinates.longitude ? parseFloat(formData.coordinates.longitude) : null}
                onLocationChange={handleMapLocationChange}
                locationName={formData.name || "New Location"}
                height="350px"
                editable={true}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Operating Hours
                </Typography>
              </Divider>
            </Grid>
            {Object.keys(formData.operatingHours).map((day) => (
              <Grid item xs={12} sm={6} md={4} key={day}>
                <Card variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                      {day}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.operatingHours[day].isOpen}
                          onChange={(e) => handleOperatingHoursChange(day, 'isOpen')(e)}
                        />
                      }
                      label={formData.operatingHours[day].isOpen ? 'Open' : 'Closed'}
                    />
                    {formData.operatingHours[day].isOpen && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <TextField
                          size="small"
                          label="Open"
                          type="time"
                          value={formData.operatingHours[day].open}
                          onChange={handleOperatingHoursChange(day, 'open')}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          size="small"
                          label="Close"
                          type="time"
                          value={formData.operatingHours[day].close}
                          onChange={handleOperatingHoursChange(day, 'close')}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Active Location"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
            {editingLocation ? 'Update' : 'Save'}
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

export default LocationPage;
