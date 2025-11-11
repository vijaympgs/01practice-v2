import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Alert,
  Divider,
  Stack,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  List as ListIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';

const AttributeValuesPage = () => {
  const [attributeValues, setAttributeValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCountryDialog, setOpenCountryDialog] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Theme color state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue

  // Form data for attribute value
  const [valueForm, setValueForm] = useState({
    attribute_id: '',
    value: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  // Form data for country
  const [countryForm, setCountryForm] = useState({
    name: '',
    code: '',
    phone_code: '',
    currency_code: 'USD',
    is_active: true,
  });

  // Currency options
  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' },
  ];

  // Handle country form input changes
  const handleCountryInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setCountryForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle country form save
  const handleCountrySave = async () => {
    try {
      if (!countryForm.name.trim() || !countryForm.code.trim()) {
        setSnackbar({
          open: true,
          message: 'Name and Code are required',
          severity: 'error',
        });
        return;
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/geographical-data/countries/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: countryForm.name.trim(),
          code: countryForm.code.trim().toUpperCase(),
          phone_code: countryForm.phone_code || null,
          currency_code: countryForm.currency_code,
          is_active: countryForm.is_active,
        }),
      });

      if (response.ok) {
        const newCountry = await response.json();
        setCountries(prev => [...prev, newCountry]);
        setSnackbar({
          open: true,
          message: 'Country created successfully!',
          severity: 'success',
        });
        setOpenCountryDialog(false);
        setCountryForm({
          name: '',
          code: '',
          phone_code: '',
          currency_code: 'USD',
          is_active: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create country');
      }
    } catch (error) {
      console.error('Error creating country:', error);
      setSnackbar({
        open: true,
        message: `Error creating country: ${error.message}`,
        severity: 'error',
      });
    }
  };

  // Handle country dialog close
  const handleCountryDialogClose = () => {
    setOpenCountryDialog(false);
    setCountryForm({
      name: '',
      code: '',
      phone_code: '',
      currency_code: 'USD',
      is_active: true,
    });
  };

  // Sample data for different data types
  const getSampleDataForDataType = (dataType) => {
    switch (dataType) {
      case 'text':
        return ['Small', 'Medium', 'Large', 'Extra Large'];
      case 'number':
        return ['1', '2', '3', '4', '5'];
      case 'date':
        return ['2024-01-01', '2024-06-15', '2024-12-31'];
      case 'boolean':
        return ['Yes', 'No'];
      case 'list':
        return ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
      default:
        return [];
    }
  };

  // Check if a value already exists under the selected attribute
  const isDuplicateValue = (value) => {
    if (!valueForm.attribute_id || !value.trim()) return false;
    
    return attributeValues.some(existingValue => 
      existingValue.attribute_id === valueForm.attribute_id && 
      existingValue.value.toLowerCase().trim() === value.toLowerCase().trim() &&
      existingValue.id !== editingValue?.id
    );
  };

  // Get the selected attribute name for display
  const getSelectedAttributeName = () => {
    const selectedAttribute = attributes.find(attr => attr.id === valueForm.attribute_id);
    return selectedAttribute ? selectedAttribute.caption : 'this attribute';
  };

  // Get selected attribute's data type
  const getSelectedAttributeDataType = () => {
    const selectedAttribute = attributes.find(attr => attr.id === valueForm.attribute_id);
    return selectedAttribute ? selectedAttribute.data_type : 'text';
  };

  // Render dynamic value field based on data type
  const renderValueField = () => {
    const dataType = getSelectedAttributeDataType();
    
    switch (dataType) {
      case 'text':
        return (
          <TextField
            fullWidth
            label="Value"
            value={valueForm.value}
            onChange={handleInputChange('value')}
            required
            placeholder="Enter text value"
            error={isDuplicateValue(valueForm.value)}
            helperText={isDuplicateValue(valueForm.value) ? `"${valueForm.value}" already exists under ${getSelectedAttributeName()}` : ''}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />
        );
      
      case 'number':
        return (
          <TextField
            fullWidth
            label="Value"
            type="number"
            value={valueForm.value}
            onChange={handleInputChange('value')}
            required
            placeholder="Enter number value"
            error={isDuplicateValue(valueForm.value)}
            helperText={isDuplicateValue(valueForm.value) ? `"${valueForm.value}" already exists under ${getSelectedAttributeName()}` : ''}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />
        );
      
      case 'date':
        return (
          <TextField
            fullWidth
            label="Value"
            type="date"
            value={valueForm.value}
            onChange={handleInputChange('value')}
            required
            InputLabelProps={{ shrink: true }}
            error={isDuplicateValue(valueForm.value)}
            helperText={isDuplicateValue(valueForm.value) ? `"${valueForm.value}" already exists under ${getSelectedAttributeName()}` : ''}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />
        );
      
      case 'boolean':
        return (
          <FormControl fullWidth error={isDuplicateValue(valueForm.value)}>
            <InputLabel>Value</InputLabel>
            <Select
              value={valueForm.value}
              onChange={handleInputChange('value')}
              label="Value"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
            {isDuplicateValue(valueForm.value) && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                "{valueForm.value}" already exists under {getSelectedAttributeName()}
              </Typography>
            )}
          </FormControl>
        );
      
      case 'list':
        return (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'stretch' }}>
              <FormControl fullWidth error={isDuplicateValue(valueForm.value)}>
                <InputLabel>Value</InputLabel>
                <Select
                  value={valueForm.value}
                  onChange={handleInputChange('value')}
                  label="Value"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={() => setOpenCountryDialog(true)}
                sx={{
                  minWidth: 'auto',
                  width: '56px',
                  height: '56px',
                  borderRadius: 0,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                    color: 'primary.dark'
                  }
                }}
                title="Add new country"
              >
                +
              </Button>
            </Box>
            {isDuplicateValue(valueForm.value) && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                "{valueForm.value}" already exists under {getSelectedAttributeName()}
              </Typography>
            )}
          </Box>
        );
      
      default:
        return (
          <TextField
            fullWidth
            label="Value"
            value={valueForm.value}
            onChange={handleInputChange('value')}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />
        );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    // Load theme color
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
    
    if (token) {
      loadData();
    }
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      // Load attributes
      const savedAttributes = localStorage.getItem('attributes');
      if (savedAttributes) {
        setAttributes(JSON.parse(savedAttributes));
      }

      // Load attribute values
      const savedValues = localStorage.getItem('attributeValues');
      if (savedValues) {
        setAttributeValues(JSON.parse(savedValues));
      } else {
        setAttributeValues([]);
      }

      // Load countries from API
      loadCountries();
    } catch (error) {
      console.error('Error loading data:', error);
      setSnackbar({
        open: true,
        message: 'Error loading data. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      // Try to load from API first
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('/api/geographical-data/countries/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const countryList = data.results || data;
          if (Array.isArray(countryList) && countryList.length > 0) {
            setCountries(countryList);
            return;
          }
        }
      }
      
      // Fallback to sample countries if API fails or returns empty
      console.log('Using fallback countries');
      setCountries([
        { id: '1', name: 'India' },
        { id: '2', name: 'United States' },
        { id: '3', name: 'United Kingdom' },
        { id: '4', name: 'Canada' },
        { id: '5', name: 'Australia' },
      ]);
    } catch (error) {
      console.error('Error loading countries:', error);
      // Fallback to sample countries
      setCountries([
        { id: '1', name: 'India' },
        { id: '2', name: 'United States' },
        { id: '3', name: 'United Kingdom' },
        { id: '4', name: 'Canada' },
        { id: '5', name: 'Australia' },
      ]);
    }
  };

  const handleOpenDialog = (value = null) => {
    setEditingValue(value);
    if (value) {
      setValueForm({
        attribute_id: value.attribute_id,
        value: value.value,
        description: value.description,
        sort_order: value.sort_order,
        is_active: value.is_active,
      });
    } else {
      setValueForm({
        attribute_id: '',
        value: '',
        description: '',
        sort_order: 0,
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingValue(null);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    // Clear value field when attribute changes to prevent invalid data
    if (field === 'attribute_id') {
      setValueForm(prev => ({
        ...prev,
        [field]: value,
        value: '' // Clear the value when attribute changes
      }));
    } else {
      setValueForm(prev => ({
        ...prev,
        [field]: field === 'sort_order' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSave = () => {
    try {
      if (!valueForm.attribute_id) {
        setSnackbar({
          open: true,
          message: 'Please select an attribute',
          severity: 'error',
        });
        return;
      }

      if (!valueForm.value.trim()) {
        setSnackbar({
          open: true,
          message: 'Value is required',
          severity: 'error',
        });
        return;
      }

      // Check for duplicate values under the same attribute category
      const existingValue = attributeValues.find(value => 
        value.attribute_id === valueForm.attribute_id && 
        value.value.toLowerCase().trim() === valueForm.value.toLowerCase().trim() &&
        value.id !== editingValue?.id // Exclude current value when editing
      );

      if (existingValue) {
        const attributeName = attributes.find(attr => attr.id === valueForm.attribute_id)?.caption || 'this attribute';
        setSnackbar({
          open: true,
          message: `"${valueForm.value}" already exists under ${attributeName}. Please choose a different value.`,
          severity: 'error',
        });
        return;
      }

      if (editingValue) {
        // Update existing value
        const updatedValues = attributeValues.map(val => 
          val.id === editingValue.id 
            ? { 
                ...val, 
                ...valueForm,
                updated_at: new Date().toISOString()
              }
            : val
        );
        setAttributeValues(updatedValues);
        localStorage.setItem('attributeValues', JSON.stringify(updatedValues));
        setSnackbar({
          open: true,
          message: 'Attribute value updated successfully!',
          severity: 'success',
        });
      } else {
        // Create new value
        const newValue = {
          id: `val_${Date.now()}`,
          ...valueForm,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const updatedValues = [...attributeValues, newValue];
        setAttributeValues(updatedValues);
        localStorage.setItem('attributeValues', JSON.stringify(updatedValues));
        setSnackbar({
          open: true,
          message: 'Attribute value created successfully!',
          severity: 'success',
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving attribute value:', error);
      setSnackbar({
        open: true,
        message: 'Error saving attribute value. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this attribute value?')) {
      try {
        const updatedValues = attributeValues.filter(val => val.id !== id);
        setAttributeValues(updatedValues);
        localStorage.setItem('attributeValues', JSON.stringify(updatedValues));
        setSnackbar({
          open: true,
          message: 'Attribute value deleted successfully!',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error deleting attribute value:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting attribute value. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const getAttributeName = (attributeId) => {
    const attribute = attributes.find(attr => attr.id === attributeId);
    return attribute ? `${attribute.code} - ${attribute.caption}` : 'Unknown';
  };

  const getAttributeCaption = (attributeId) => {
    const attribute = attributes.find(attr => attr.id === attributeId);
    return attribute ? attribute.caption : 'Unknown';
  };

  // Group values by attribute
  const groupedValues = attributeValues.reduce((acc, value) => {
    const attributeName = getAttributeCaption(value.attribute_id);
    if (!acc[attributeName]) {
      acc[attributeName] = [];
    }
    acc[attributeName].push(value);
    return acc;
  }, {});

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please log in to access the Attribute Values management.
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
      <PageTitle 
        title="Attribute Values Management" 
        subtitle="Manage values for each attribute category"
      />

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <CardHeader title="List">
          <ActionButton
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Add Value
          </ActionButton>
        </CardHeader>

        <CardContent sx={{ p: 0 }}>
          {/* Accordion Layout for Attribute Categories */}
          {Object.keys(groupedValues).length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Attribute Values Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first attribute value to get started.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              {Object.entries(groupedValues).map(([attributeName, values]) => (
                <Accordion key={attributeName} sx={{ mb: 2, borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      bgcolor: 'grey.50',
                      borderRadius: 0,
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <AssignmentIcon sx={{ color: themeColor }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: themeColor }}>
                        {attributeName}
                      </Typography>
                      <Chip 
                        label={`${values.length} ${values.length === 1 ? 'value' : 'values'}`}
                        sx={{ 
                          ml: 'auto',
                          bgcolor: themeColor,
                          color: 'white',
                          borderRadius: 0,
                          fontWeight: 600
                        }}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 600, color: themeColor }}>Value</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: themeColor }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: themeColor }}>Sort Order</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: themeColor }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, color: themeColor }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {values.map((value) => (
                            <TableRow key={value.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {value.value}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {value.description || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {value.sort_order}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={value.is_active ? 'Active' : 'Inactive'}
                                  color={value.is_active ? 'success' : 'default'}
                                  size="small"
                                  sx={{ borderRadius: 0 }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenDialog(value)}
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
                                      onClick={() => handleDelete(value.id)}
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
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: themeColor,
          color: 'white'
        }}>
          {editingValue ? 'Edit' : 'Add'} Attribute Value
        </DialogTitle>
        <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Grid container spacing={1}>

            
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: themeColor }}>Attribute Category</InputLabel>
                <Select
                  value={valueForm.attribute_id}
                  onChange={handleInputChange('attribute_id')}
                  label="Attribute Category"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                >
                  {attributes.map((attribute) => (
                    <MenuItem key={attribute.id} value={attribute.id}>
                      {attribute.code} - {attribute.caption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={valueForm.sort_order}
                onChange={handleInputChange('sort_order')}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              {renderValueField()}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={valueForm.description}
                onChange={handleInputChange('description')}
                multiline
                rows={3}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>


            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={valueForm.is_active}
                    onChange={handleInputChange('is_active')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                    }}
                  />
                }
                label="Active"
                sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500, color: themeColor } }}
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
            {editingValue ? 'Update' : 'Create'}
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

      {/* Add Country Dialog */}
      <Dialog open={openCountryDialog} onClose={handleCountryDialogClose} maxWidth="md" fullWidth>
        <DialogHeader title="Add Country" icon={<AssignmentIcon />} />
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name *"
                value={countryForm.name}
                onChange={handleCountryInputChange('name')}
                required
                placeholder="Enter country name"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code *"
                value={countryForm.code}
                onChange={handleCountryInputChange('code')}
                required
                placeholder="Enter country code"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Code"
                value={countryForm.phone_code}
                onChange={handleCountryInputChange('phone_code')}
                placeholder="Enter phone code"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency Code</InputLabel>
                <Select
                  value={countryForm.currency_code}
                  onChange={handleCountryInputChange('currency_code')}
                  label="Currency Code"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                >
                  {currencyOptions.map((currency) => (
                    <MenuItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                Status
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={countryForm.is_active}
                    onChange={handleCountryInputChange('is_active')}
                    color="primary"
                  />
                }
                label="Active"
                sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCountryDialogClose}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCountrySave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttributeValuesPage;
