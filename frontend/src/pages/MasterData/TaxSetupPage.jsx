import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import api from '../../services/api';

const TaxSetupPage = () => {
  const [taxRates, setTaxRates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedCountry, setExpandedCountry] = useState('');
  const [taxDataLoaded, setTaxDataLoaded] = useState(false);
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue

  const [taxForm, setTaxForm] = useState({
    name: '',
    rate: '',
    description: '',
    is_active: true,
    tax_type: 'percentage', // percentage or fixed
    sort_order: 1
  });

  const taxTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount' }
  ];

  // Load countries from Country Master
  const loadCountriesFromMaster = async () => {
    try {
      const response = await api.get('/geographical-data/countries/');
      const data = response.data;
      const countryList = data.results || data;
      
      if (Array.isArray(countryList) && countryList.length > 0) {
        setCountries(countryList);
        console.log('Loaded countries from API:', countryList);
        return;
      }
      
      // Fallback to sample countries if API returns empty
      console.log('Using fallback countries');
      setCountries([
        { id: '1', name: 'India', code: 'IN' },
        { id: '2', name: 'United States', code: 'US' },
        { id: '3', name: 'United Kingdom', code: 'GB' },
        { id: '4', name: 'Canada', code: 'CA' },
        { id: '5', name: 'Australia', code: 'AU' },
      ]);
    } catch (error) {
      console.error('Error loading countries:', error);
      // Fallback to sample countries on error
      setCountries([
        { id: '1', name: 'India', code: 'IN' },
        { id: '2', name: 'United States', code: 'US' },
        { id: '3', name: 'United Kingdom', code: 'GB' },
        { id: '4', name: 'Canada', code: 'CA' },
        { id: '5', name: 'Australia', code: 'AU' },
      ]);
    }
  };

  // Load tax data for all countries on component mount
  const loadAllTaxData = async () => {
    // Prevent duplicate loading
    if (taxDataLoaded || countries.length === 0) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Get all countries from the master
      const allTaxRates = [];
      
      // Load tax data for each country
      for (const country of countries) {
        const countryTaxRates = getTaxDataForCountry(country.name);
        allTaxRates.push(...countryTaxRates);
      }
      
      // Set all tax rates
      setTaxRates(allTaxRates);
      
      // Save to backend automatically
      await saveTaxDataToBackend(allTaxRates);
      
      setTaxDataLoaded(true);
      
      setSnackbar({
        open: true,
        message: `Loaded tax data for ${countries.length} countries`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error loading tax data:', error);
      setSnackbar({
        open: true,
        message: 'Error loading tax data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get tax data for a specific country
  const getTaxDataForCountry = (countryName) => {
    let countryTaxRates = [];
    
    if (countryName === 'India') {
      countryTaxRates = [
        {
          id: 'gst-0',
          name: 'GST 0%',
          rate: 0,
          description: 'Zero-rated goods and services',
          is_active: true,
          tax_type: 'percentage',
          sort_order: 1,
          country: countryName
        },
          {
            id: 'gst-5',
            name: 'GST 5%',
            rate: 5,
            description: 'Essential goods and services',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 2,
            country: countryName
          },
          {
            id: 'gst-12',
            name: 'GST 12%',
            rate: 12,
            description: 'Processed food items and certain services',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 3,
            country: countryName
          },
          {
            id: 'gst-18',
            name: 'GST 18%',
            rate: 18,
            description: 'Standard rate for most goods and services',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 4,
            country: countryName
          },
          {
            id: 'gst-28',
            name: 'GST 28%',
            rate: 28,
            description: 'Luxury goods and demerit items',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 5,
            country: countryName
          }
        ];
      } else if (countryName === 'United States') {
        countryTaxRates = [
          {
            id: 'sales-tax-0',
            name: 'Sales Tax 0%',
            rate: 0,
            description: 'Tax-free states',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 1,
            country: countryName
          },
          {
            id: 'sales-tax-4',
            name: 'Sales Tax 4%',
            rate: 4,
            description: 'Low tax states',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 2,
            country: countryName
          },
          {
            id: 'sales-tax-8',
            name: 'Sales Tax 8%',
            rate: 8,
            description: 'Standard sales tax',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 3,
            country: countryName
          },
          {
            id: 'sales-tax-10',
            name: 'Sales Tax 10%',
            rate: 10,
            description: 'High tax states',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 4,
            country: countryName
          }
        ];
      } else {
        // Generic tax rates for other countries
        countryTaxRates = [
          {
            id: 'vat-0',
            name: 'VAT 0%',
            rate: 0,
            description: 'Zero-rated items',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 1,
            country: countryName
          },
          {
            id: 'vat-10',
            name: 'VAT 10%',
            rate: 10,
            description: 'Reduced rate',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 2,
            country: countryName
          },
          {
            id: 'vat-20',
            name: 'VAT 20%',
            rate: 20,
            description: 'Standard rate',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 3,
            country: countryName
          }
        ];
      }

      // Sort by sort order
      countryTaxRates.sort((a, b) => (a.sort_order || 1) - (b.sort_order || 1));
      
      return countryTaxRates;
  };

  // Load tax rates from localStorage
  const loadTaxRates = () => {
    try {
      const saved = localStorage.getItem('taxRates');
      if (saved) {
        setTaxRates(JSON.parse(saved));
        // Reset expanded state when loading from localStorage
        setExpandedCountry('');
      } else {
        // Initialize with sample data
        const sampleTaxRates = [
          {
            id: '1',
            name: 'GST',
            rate: '18',
            description: 'Goods and Services Tax',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 1,
            country: 'India'
          },
          {
            id: '2',
            name: 'CGST',
            rate: '9',
            description: 'Central GST',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 2,
            country: 'India'
          },
          {
            id: '3',
            name: 'SGST',
            rate: '9',
            description: 'State GST',
            is_active: true,
            tax_type: 'percentage',
            sort_order: 3,
            country: 'India'
          }
        ];
        setTaxRates(sampleTaxRates);
        localStorage.setItem('taxRates', JSON.stringify(sampleTaxRates));
        // Auto-expand India accordion for sample data
        setExpandedCountry('India');
      }
    } catch (error) {
      console.error('Error loading tax rates:', error);
      setTaxRates([]);
      setExpandedCountry('');
    }
  };

  // Save tax rates to localStorage
  const saveTaxRates = (newTaxRates) => {
    try {
      localStorage.setItem('taxRates', JSON.stringify(newTaxRates));
      setTaxRates(newTaxRates);
      // Note: expandedCountry state is preserved during save operations
    } catch (error) {
      console.error('Error saving tax rates:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setTaxForm(prev => ({
      ...prev,
      [field]: field === 'rate' || field === 'sort_order' ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle form save
  const handleSave = () => {
    try {
      if (!taxForm.name.trim()) {
        setSnackbar({
          open: true,
          message: 'Tax name is required',
          severity: 'error',
        });
        return;
      }

      if (!taxForm.rate || taxForm.rate <= 0) {
        setSnackbar({
          open: true,
          message: 'Tax rate must be greater than 0',
          severity: 'error',
        });
        return;
      }

      // Check for duplicate tax names
      const existingTax = taxRates.find(tax => 
        tax.name.toLowerCase().trim() === taxForm.name.toLowerCase().trim() &&
        tax.id !== editingTax?.id
      );

      if (existingTax) {
        setSnackbar({
          open: true,
          message: `"${taxForm.name}" already exists. Please choose a different name.`,
          severity: 'error',
        });
        return;
      }

      if (editingTax) {
        // Update existing tax
        const updatedTaxRates = taxRates.map(tax => 
          tax.id === editingTax.id 
            ? { ...taxForm, id: editingTax.id }
            : tax
        );
        saveTaxRates(updatedTaxRates);
        setSnackbar({
          open: true,
          message: 'Tax rate updated successfully!',
          severity: 'success',
        });
      } else {
        // Add new tax
        const newTax = {
          ...taxForm,
          id: Date.now().toString(),
        };
        const updatedTaxRates = [...taxRates, newTax];
        saveTaxRates(updatedTaxRates);
        setSnackbar({
          open: true,
          message: 'Tax rate created successfully!',
          severity: 'success',
        });
      }

      setOpenDialog(false);
      setEditingTax(null);
      setTaxForm({
        name: '',
        rate: '',
        description: '',
        is_active: true,
        tax_type: 'percentage',
        sort_order: 1
      });
    } catch (error) {
      console.error('Error saving tax rate:', error);
      setSnackbar({
        open: true,
        message: 'Error saving tax rate. Please try again.',
        severity: 'error',
      });
    }
  };

  // Handle delete
  const handleDelete = (taxId) => {
    try {
      const updatedTaxRates = taxRates.filter(tax => tax.id !== taxId);
      saveTaxRates(updatedTaxRates);
      setSnackbar({
        open: true,
        message: 'Tax rate deleted successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting tax rate:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting tax rate. Please try again.',
        severity: 'error',
      });
    }
  };

  // Handle dialog open
  const handleOpenDialog = (tax = null) => {
    setEditingTax(tax);
    if (tax) {
      setTaxForm({
        name: tax.name,
        rate: tax.rate,
        description: tax.description,
        is_active: tax.is_active,
        tax_type: tax.tax_type,
        sort_order: tax.sort_order
      });
    } else {
      setTaxForm({
        name: '',
        rate: '',
        description: '',
        is_active: true,
        tax_type: 'percentage',
        sort_order: taxRates.length + 1
      });
    }
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTax(null);
    setTaxForm({
      name: '',
      rate: '',
      description: '',
      is_active: true,
      tax_type: 'percentage',
      sort_order: 1
    });
  };

  // API Functions for Tax Management
  const createTaxType = async (taxTypeData) => {
    try {
      const response = await api.post('/taxes/tax-types/', taxTypeData);
      return response.data;
    } catch (error) {
      console.error('Error creating tax type:', error);
      throw error;
    }
  };

  const createTaxRate = async (taxRateData) => {
    try {
      const response = await api.post('/taxes/tax-rates/', taxRateData);
      return response.data;
    } catch (error) {
      console.error('Error creating tax rate:', error);
      throw error;
    }
  };

  const bulkCreateTaxRates = async (taxRatesData) => {
    try {
      const response = await api.post('/taxes/tax-rates/bulk_create/', {
        tax_rates: taxRatesData
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk creating tax rates:', error);
      throw error;
    }
  };

  const clearAllTaxRates = async () => {
    try {
      const response = await api.delete('/taxes/tax-rates/clear_all/');
      return response.data;
    } catch (error) {
      console.error('Error clearing tax rates:', error);
      throw error;
    }
  };

  const clearAllTaxTypes = async () => {
    try {
      // Get all tax types first
      const taxTypesResponse = await api.get('/taxes/tax-types/');
      const taxTypes = taxTypesResponse.data.results || taxTypesResponse.data;
      
      // Delete each tax type (this will cascade delete tax rates)
      for (const taxType of taxTypes) {
        await api.delete(`/taxes/tax-types/${taxType.id}/`);
      }
      
      return { message: `Cleared ${taxTypes.length} tax types` };
    } catch (error) {
      console.error('Error clearing tax types:', error);
      throw error;
    }
  };

  // Save tax data to backend
  const saveTaxDataToBackend = async (taxRatesToSave = null) => {
    const dataToSave = taxRatesToSave || taxRates;
    
    if (dataToSave.length === 0) {
      setSnackbar({
        open: true,
        message: 'No tax rates to save',
        severity: 'warning',
      });
      return;
    }

    try {
      setLoading(true);
      
      // First, clear existing tax types (this will cascade delete tax rates)
      await clearAllTaxTypes();
      
      // Group tax rates by country and create appropriate tax types
      const taxTypesMap = new Map();
      const taxRatesToSaveArray = [];
      
      // Get unique countries from tax rates
      const countriesFromTax = [...new Set(dataToSave.map(tax => tax.country).filter(Boolean))];
      
      for (const country of countriesFromTax) {
        const countryTaxRates = dataToSave.filter(tax => tax.country === country);
        
        // Create a tax type for this country
        const taxTypeKey = `${country.toLowerCase().replace(/\s+/g, '_')}_tax`;
        const taxTypeData = {
          name: `${country} Tax System`,
          code: taxTypeKey.toUpperCase(),
          description: `Tax rates for ${country}`,
          country: country,
          is_active: true
        };
        taxTypesMap.set(taxTypeKey, taxTypeData);
        
        // Prepare tax rate data for this country
        countryTaxRates.forEach(tax => {
          taxRatesToSaveArray.push({
            name: tax.name,
            rate: tax.rate,
            description: tax.description,
            country: tax.country,
            sort_order: tax.sort_order || 1,
            is_active: tax.is_active,
            tax_type_key: taxTypeKey // Temporary key to match with tax type
          });
        });
      }
      
      // Create tax types first
      const createdTaxTypes = new Map();
      for (const [key, taxTypeData] of taxTypesMap) {
        try {
          const createdTaxType = await createTaxType(taxTypeData);
          createdTaxTypes.set(key, createdTaxType);
        } catch (taxTypeError) {
          console.error(`Error creating tax type ${taxTypeData.name}:`, taxTypeError);
          console.error('Error details:', taxTypeError.response?.data);
          
          // If tax type already exists, try to get it
          if (taxTypeError.response?.status === 400) {
            try {
              const existingTaxTypes = await api.get('/taxes/tax-types/');
              const existingType = existingTaxTypes.data.results?.find(t => t.code === taxTypeData.code);
              if (existingType) {
                createdTaxTypes.set(key, existingType);
                continue;
              }
            } catch (fetchError) {
              console.error('Error fetching existing tax types:', fetchError);
            }
          }
          
          // Don't throw error, just skip this tax type
          console.warn(`Skipping tax type ${taxTypeData.name} due to error`);
        }
      }
      
      // Skip if no tax types were created
      if (createdTaxTypes.size === 0) {
        throw new Error('No tax types could be created');
      }
      
      // Update tax rates with actual tax type IDs
      const finalTaxRates = taxRatesToSaveArray
        .filter(taxRate => createdTaxTypes.has(taxRate.tax_type_key))
        .map(taxRate => ({
          ...taxRate,
          tax_type: createdTaxTypes.get(taxRate.tax_type_key).id
        }));
      
      // Remove the temporary key
      const cleanTaxRates = finalTaxRates.map(({ tax_type_key, ...rest }) => rest);
      
      // Bulk create tax rates only if we have some
      if (cleanTaxRates.length > 0) {
        await bulkCreateTaxRates(cleanTaxRates);
      }
      
      setSnackbar({
        open: true,
        message: `Successfully saved ${dataToSave.length} tax rates to database`,
        severity: 'success',
      });
      
    } catch (error) {
      console.error('Error saving tax data:', error);
      let errorMessage = 'Error saving tax data';
      
      if (error.response?.data) {
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.code) {
          errorMessage = `Tax type code already exists: ${error.response.data.code}`;
        } else if (typeof error.response.data === 'object') {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load theme color
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

  // Load data on component mount
  useEffect(() => {
    loadCountriesFromMaster();
  }, []);
  
  // Auto-load tax data when countries are loaded
  useEffect(() => {
    if (countries.length > 0) {
      loadAllTaxData();
    }
  }, [countries.length]);

  // Group tax rates by country for accordion display
  const groupedTaxRatesByCountry = taxRates.reduce((acc, tax) => {
    const country = tax.country || 'Unknown Country';
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(tax);
    return acc;
  }, {});

  // Sort countries alphabetically
  const sortedCountries = Object.keys(groupedTaxRatesByCountry).sort();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <PageTitle 
          title="Tax Setup" 
          subtitle="Manage tax rates and configurations for your business"
          showIcon={true}
          icon={<AssignmentIcon />}
        />
      </Box>

      {/* Country Selection */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, minWidth: '120px' }}>
              Select Country:
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => {
                  const countryId = e.target.value;
                  setSelectedCountry(countryId);
                  
                  // Find the country name and expand its accordion
                  if (countryId) {
                    const selectedCountryData = countries.find(c => c.id === countryId);
                    if (selectedCountryData) {
                      setExpandedCountry(selectedCountryData.name);
                    }
                  } else {
                    setExpandedCountry('');
                  }
                }}
                label="Country"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MenuItem value="">
                  <em>Select a country</em>
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name} ({country.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Progress Indicator Card */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`, color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <AssignmentIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Tax Configuration Status
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {sortedCountries.length > 0 
                  ? `Configured for ${sortedCountries.length} countr${sortedCountries.length !== 1 ? 'ies' : 'y'} with ${taxRates.length} tax rate${taxRates.length !== 1 ? 's' : ''}`
                  : 'No tax rates configured yet'
                }
              </Typography>
            </Box>
            {sortedCountries.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                {sortedCountries.slice(0, 3).map((country) => (
                  <Chip 
                    key={country}
                    label={country} 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 600
                    }}
                    size="small"
                  />
                ))}
                {sortedCountries.length > 3 && (
                  <Chip 
                    label={`+${sortedCountries.length - 3} more`} 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      color: 'white',
                      fontWeight: 600
                    }}
                    size="small"
                  />
                )}
              </Box>
            )}
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min((taxRates.length / 20) * 100, 100)} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'rgba(255,255,255,0.8)'
              }
            }} 
          />
        </CardContent>
      </Card>

      {/* Tax Rates Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Tax Rates by Country
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Government-provided tax rates organized by country, loaded from official sources
        </Typography>
      </Box>

      {/* Tax Rates by Country Accordion */}
      {sortedCountries.length > 0 ? (
        sortedCountries.map((country) => {
          const countryTaxes = groupedTaxRatesByCountry[country];
          const activeCount = countryTaxes.filter(tax => tax.is_active).length;
          const inactiveCount = countryTaxes.length - activeCount;
          
          return (
            <Accordion 
              key={country} 
              sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}
              expanded={expandedCountry === country}
              onChange={(event, isExpanded) => {
                setExpandedCountry(isExpanded ? country : '');
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
                  color: 'white',
                  borderRadius: '8px 8px 0 0',
                  '&.Mui-expanded': {
                    borderRadius: '8px 8px 0 0'
                  },
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ mr: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                      {country}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Tax System Configuration
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`${countryTaxes.length} rate${countryTaxes.length !== 1 ? 's' : ''}`} 
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontWeight: 600
                      }}
                      size="small"
                    />
                    {activeCount > 0 && (
                      <Chip 
                        label={`${activeCount} active`} 
                        sx={{ 
                          backgroundColor: 'rgba(76,175,80,0.8)', 
                          color: 'white',
                          fontWeight: 600
                        }}
                        size="small"
                      />
                    )}
                    {inactiveCount > 0 && (
                      <Chip 
                        label={`${inactiveCount} inactive`} 
                        sx={{ 
                          backgroundColor: 'rgba(158,158,158,0.8)', 
                          color: 'white',
                          fontWeight: 600
                        }}
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <TableContainer component={Paper} sx={{ borderRadius: '0 0 8px 8px' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Tax Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Sort Order</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {countryTaxes
                        .sort((a, b) => (a.sort_order || 1) - (b.sort_order || 1))
                        .map((tax) => (
                        <TableRow key={tax.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {tax.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium" sx={{ color: 'primary.main' }}>
                              {tax.rate}{tax.tax_type === 'percentage' ? '%' : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={tax.tax_type === 'percentage' ? 'Percentage' : 'Fixed'} 
                              color={tax.tax_type === 'percentage' ? 'primary' : 'secondary'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {tax.description || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {tax.sort_order || 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={tax.is_active ? 'Active' : 'Inactive'} 
                              color={tax.is_active ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Tax Rates Loaded
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tax rates will be automatically loaded for all countries
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Only government-provided tax rates are available for use
          </Typography>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingTax ? 'Edit Tax Rate' : 'Add Tax Rate'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Tax Name"
              value={taxForm.name}
              onChange={handleInputChange('name')}
              required
              placeholder="e.g., GST, VAT, Sales Tax"
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Rate"
                type="number"
                value={taxForm.rate}
                onChange={handleInputChange('rate')}
                required
                placeholder="Enter tax rate"
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={taxForm.tax_type}
                  onChange={handleInputChange('tax_type')}
                  label="Type"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {taxTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Description"
              value={taxForm.description}
              onChange={handleInputChange('description')}
              placeholder="Optional description"
              multiline
              rows={2}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={taxForm.sort_order}
                onChange={handleInputChange('sort_order')}
                inputProps={{ min: 1, max: 999 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={taxForm.is_active}
                  onChange={handleInputChange('is_active')}
                  label="Status"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {editingTax ? 'Update' : 'Create'}
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

export default TaxSetupPage;
