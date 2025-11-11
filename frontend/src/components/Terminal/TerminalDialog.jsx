import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Switch,
  FormControlLabel,
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
  Paper,
  Autocomplete,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../services/api';

const TRANSACTION_TYPES = [
  { value: 'estimation', label: 'Estimation' },
  { value: 'gift_voucher', label: 'Gift Voucher' },
  { value: 'inter_company_sales', label: 'Inter Company Sales' },
  { value: 'payment', label: 'Payment' },
  { value: 'receipt', label: 'Receipt' },
  { value: 'refund', label: 'Refund' },
  { value: 'sales_order', label: 'Sales Order' },
  { value: 'sales_return_request', label: 'Sales Return Request' },
];

const TENDER_TYPES = [
  { value: 'cards', label: 'Cards' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'credit', label: 'Credit' },
  { value: 'credit_note', label: 'CreditNote' },
  { value: 'due', label: 'Due' },
  { value: 'coupons', label: 'Coupons' },
  { value: 'fcoupons', label: 'FCoupons' },
  { value: 'currency', label: 'Currency' },
];

const TerminalDialog = ({ open, mode, terminal, locations, onClose, onSave, saving }) => {
  const [themeColor, setThemeColor] = useState('#1976d2');
  
  // Load theme from API
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch('/api/theme/active-theme/');
        if (response.ok) {
          const themeData = await response.json();
          setThemeColor(themeData.primary_color || '#1976d2');
        } else {
          const cachedTheme = localStorage.getItem('activeTheme');
          if (cachedTheme) {
            const parsedTheme = JSON.parse(cachedTheme);
            if (parsedTheme?.primary_color) {
              setThemeColor(parsedTheme.primary_color);
              return;
            }
          }
          setThemeColor('#1976d2');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setThemeColor('#1976d2');
      }
    };
    if (open) {
      loadTheme();
    }
  }, [open]);
  
  // Terminal Details
  const [formData, setFormData] = useState({
    name: '', // Required field
    locationId: '',
    terminalCode: '',
    description: '',
    systemName: '',
    autoLoginPos: false,
    floorLocation: '',
  });

  // Transaction Settings
  const [transactionSettings, setTransactionSettings] = useState(
    TRANSACTION_TYPES.map(type => ({
      transactionType: type.value,
      allow: false,
      printerTemplateId: '',
    }))
  );
  const [printerTemplates, setPrinterTemplates] = useState([]);
  
  // Tender Mappings
  const [tenderMappings, setTenderMappings] = useState(
    TENDER_TYPES.map(type => ({
      tenderType: type.value,
      minimumValue: 0,
      maximumValue: 0,
      allowTender: false,
      allowRefund: false,
    }))
  );
  
  // Department Mappings
  const [departmentMappings, setDepartmentMappings] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Peripheral Devices
  const [hardwareConfig, setHardwareConfig] = useState({
    weighingMachine: {
      attached: false,
      port: '',
      dataBits: '',
      stopBits: '',
      bitsPerSec: '',
      parity: '',
      connectionType: 'serial_port',
    },
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Load terminal data and related mappings
  useEffect(() => {
    if (!open) return; // Only load when dialog is open
    
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const loadData = async () => {
      try {
        if (terminal?.id) {
          // Load terminal basic data
          if (isMounted) {
            setFormData({
              name: terminal.name || '',
              locationId: terminal.location?.id || terminal.location || '',
              terminalCode: terminal.terminal_code || terminal.terminalCode || '',
              description: terminal.description || '',
              systemName: terminal.system_name || terminal.systemName || '',
              autoLoginPos: terminal.auto_login_pos || terminal.autoLoginPos || false,
              floorLocation: terminal.floor_location || terminal.floorLocation || '',
            });
            
            const locationId = terminal.location?.id || terminal.location;
            if (locationId && locations?.length > 0) {
              const location = locations.find(l => l.id === locationId);
              if (isMounted) setSelectedLocation(location || null);
            }
            
            // Load related data only if authenticated
            const token = localStorage.getItem('accessToken');
            if (token) {
              await loadRelatedData(terminal.id);
            }
          }
        } else {
          // Reset form for new terminal
          if (isMounted) {
            setFormData({
              name: '',
              locationId: '',
              terminalCode: '',
              description: '',
              systemName: '',
              autoLoginPos: false,
              floorLocation: '',
            });
            setSelectedLocation(null);
          }
        }
        
        // Load dropdowns only if authenticated
        const token = localStorage.getItem('accessToken');
        if (token) {
          await Promise.all([
            loadPrinterTemplates(),
            loadCategories()
          ]);
        }
      } catch (error) {
        console.error('Error loading terminal data:', error);
        // Don't set state if component unmounted
        if (isMounted) {
          // Silently fail - these are optional data loads
        }
      }
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [open, terminal?.id]); // Only depend on open and terminal.id, not full terminal object or locations array

  const loadRelatedData = async (terminalId) => {
    if (!terminalId) return;
    
    // Check authentication first
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('Not authenticated, skipping related data load');
      return;
    }
    
    setLoadingRelated(true);
    try {
      // Load transaction settings
      try {
        const transResponse = await api.get(`/pos-masters/terminals/${terminalId}/transaction_settings/`);
        if (transResponse.data) {
          const transData = Array.isArray(transResponse.data) 
            ? transResponse.data 
            : (transResponse.data.results || []);
          
          if (Array.isArray(transData)) {
            // Map to our format
            const mapped = TRANSACTION_TYPES.map(type => {
              const existing = transData.find(t => t.transaction_type === type.value);
              return existing ? {
                transactionType: existing.transaction_type,
                allow: existing.allow,
                printerTemplateId: existing.printer_template?.id || existing.printer_template || '',
              } : {
                transactionType: type.value,
                allow: false,
                printerTemplateId: '',
              };
            });
            setTransactionSettings(mapped);
          }
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.warn('Error loading transaction settings (non-critical):', error.response?.status || error.message);
        }
      }
      
      // Load tender mappings
      try {
        const tenderResponse = await api.get(`/pos-masters/terminals/${terminalId}/tender_mappings/`);
        if (tenderResponse.data) {
          const tenderData = Array.isArray(tenderResponse.data) 
            ? tenderResponse.data 
            : (tenderResponse.data.results || []);
          
          if (Array.isArray(tenderData)) {
            const mapped = TENDER_TYPES.map(type => {
              const existing = tenderData.find(t => t.tender_type === type.value);
              return existing ? {
                tenderType: existing.tender_type,
                minimumValue: existing.minimum_value || 0,
                maximumValue: existing.maximum_value || 0,
                allowTender: existing.allow_tender || false,
                allowRefund: existing.allow_refund || false,
              } : {
                tenderType: type.value,
                minimumValue: 0,
                maximumValue: 0,
                allowTender: false,
                allowRefund: false,
              };
            });
            setTenderMappings(mapped);
          }
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.warn('Error loading tender mappings (non-critical):', error.response?.status || error.message);
        }
      }
      
      // Load department mappings
      try {
        const deptResponse = await api.get(`/pos-masters/terminals/${terminalId}/department_mappings/`);
        if (deptResponse.data) {
          const deptData = Array.isArray(deptResponse.data) 
            ? deptResponse.data 
            : (deptResponse.data.results || []);
          
          if (Array.isArray(deptData)) {
            setDepartmentMappings(deptData);
          }
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.warn('Error loading department mappings (non-critical):', error.response?.status || error.message);
        }
      }
    } catch (error) {
      // Only log if not 401 (handled above)
      if (error.response?.status !== 401) {
        console.error('Error loading related data:', error);
      }
    } finally {
      setLoadingRelated(false);
    }
  };

  const loadPrinterTemplates = async () => {
    try {
      // Check authentication first
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('Not authenticated, skipping printer templates load');
        return;
      }
      
      const response = await api.get('/pos-masters/printer-templates/');
      if (response.data) {
        // Handle both array and paginated response
        const templatesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.results || []);
        
        if (Array.isArray(templatesData)) {
          setPrinterTemplates(templatesData);
        }
      }
    } catch (error) {
      // Silently fail - printer templates are optional
      if (error.response?.status !== 401) {
        console.warn('Error loading printer templates (non-critical):', error.response?.status || error.message);
      }
    }
  };

  const loadCategories = async () => {
    try {
      // Check authentication first
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('Not authenticated, skipping categories load');
        return;
      }
      
      // Fix: Use correct endpoint - should be /categories/ not /categories/categories/
      const response = await api.get('/categories/');
      if (response.data) {
        // Handle both array and paginated response
        const categoriesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.results || []);
        
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
          // Initialize department mappings only if empty and we have categories
          setDepartmentMappings(prev => {
            if (prev.length === 0) {
              return categoriesData.map(cat => ({
                departmentId: cat.id,
                departmentName: cat.name,
                allow: false,
              }));
            }
            return prev;
          });
        }
      }
    } catch (error) {
      // Silently fail - categories are optional
      if (error.response?.status !== 401) {
        console.warn('Error loading categories (non-critical):', error.response?.status || error.message);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (event, newValue) => {
    setSelectedLocation(newValue);
    setFormData(prev => ({
      ...prev,
      locationId: newValue?.id || ''
    }));
  };

  const handleTransactionSettingChange = (index, field, value) => {
    const updated = [...transactionSettings];
    updated[index] = { ...updated[index], [field]: value };
    setTransactionSettings(updated);
  };

  const handleTenderMappingChange = (index, field, value) => {
    const updated = [...tenderMappings];
    updated[index] = { ...updated[index], [field]: value };
    setTenderMappings(updated);
  };

  const handleDepartmentMappingChange = (index, allow) => {
    const updated = [...departmentMappings];
    updated[index] = { ...updated[index], allow };
    setDepartmentMappings(updated);
  };

  const handleSubmit = async () => {
    // Validation - Required fields
    if (!formData.name || !formData.name.trim()) {
      alert('Terminal Name is required');
      return;
    }
    if (!formData.terminalCode || !formData.terminalCode.trim()) {
      alert('Terminal Code is required');
      return;
    }
    if (!formData.locationId) {
      alert('Location is required');
      return;
    }
    
    try {
      // Prepare terminal data - exclude read-only nested fields from create/update
      const terminalData = {
        ...formData,
        location: formData.locationId,
        hardware_config: hardwareConfig,
        // Note: transaction_settings, tender_mappings, department_mappings 
        // are handled separately via their own endpoints after terminal creation
      };
      
      await onSave(terminalData);
    } catch (error) {
      console.error('Error saving terminal:', error);
      // Re-throw to show error in UI
      throw error;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          background: themeColor,
          color: 'white',
          py: 2,
          px: 3,
          fontWeight: 600,
        }}
      >
        Terminal Configuration
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
        {/* Basic Information Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" color={themeColor} sx={{ mb: 2 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            
            <Grid item xs={12} md={6} sx={{ mt: 1 }}>
              <Autocomplete
                options={locations || []}
                value={selectedLocation}
                onChange={handleLocationChange}
                getOptionLabel={(option) => option?.name || ''}
                disabled={mode === 'view'}
                noOptionsText={locations?.length === 0 ? "No locations available. Please create a location first." : "No options"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location"
                    required
                    placeholder={locations?.length === 0 ? "No locations available" : "Select location"}
                    error={locations?.length === 0}
                    helperText={locations?.length === 0 ? "Please create a location in Organization > Locations first" : ""}
                    InputLabelProps={{ sx: { color: themeColor } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Terminal Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={mode === 'view'}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                helperText="Required: Unique name for this terminal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Terminal Code"
                value={formData.terminalCode}
                onChange={(e) => handleChange('terminalCode', e.target.value)}
                disabled={mode === 'view'}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                helperText="Required: Unique code (e.g., TILL-001)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Terminal Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={mode === 'view'}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="System Name"
                value={formData.systemName}
                onChange={(e) => handleChange('systemName', e.target.value)}
                disabled={mode === 'view'}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                helperText="User-defined identifier used in integrations and audit logs"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoLoginPos}
                    onChange={(e) => handleChange('autoLoginPos', e.target.checked)}
                    disabled={mode === 'view'}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                    }}
                  />
                }
                label="Auto Login POS"
                sx={{ '& .MuiFormControlLabel-label': { color: themeColor, fontWeight: 500 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Floor"
                value={formData.floorLocation}
                onChange={(e) => handleChange('floorLocation', e.target.value)}
                disabled={mode === 'view'}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Transaction Settings Section */}
        <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: themeColor }} />}>
            <Typography variant="h6" fontWeight="600" color={themeColor}>
              Transaction Settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Transaction Type</TableCell>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Allow</TableCell>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Printer Template</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionSettings.map((setting, index) => (
                  <TableRow key={setting.transactionType}>
                    <TableCell>{TRANSACTION_TYPES.find(t => t.value === setting.transactionType)?.label}</TableCell>
                    <TableCell>
                      <Switch
                        checked={setting.allow}
                        onChange={(e) => handleTransactionSettingChange(index, 'allow', e.target.checked)}
                        disabled={mode === 'view'}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth disabled={mode === 'view' || !setting.allow}>
                        <Select
                          value={setting.printerTemplateId || ''}
                          onChange={(e) => handleTransactionSettingChange(index, 'printerTemplateId', e.target.value)}
                          sx={{ borderRadius: 0 }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {printerTemplates.map(template => (
                            <MenuItem key={template.id} value={template.id}>
                              {template.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Tender Mapping Section */}
        <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: themeColor }} />}>
            <Typography variant="h6" fontWeight="600" color={themeColor}>
              Tender Mapping
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Tender Type</TableCell>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Min Value</TableCell>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Max Value</TableCell>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Allow Tender</TableCell>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Allow Refund</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenderMappings.map((mapping, index) => (
                  <TableRow key={mapping.tenderType}>
                    <TableCell>{TENDER_TYPES.find(t => t.value === mapping.tenderType)?.label}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={mapping.minimumValue}
                        onChange={(e) => handleTenderMappingChange(index, 'minimumValue', parseFloat(e.target.value) || 0)}
                        disabled={mode === 'view'}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={mapping.maximumValue}
                        onChange={(e) => handleTenderMappingChange(index, 'maximumValue', parseFloat(e.target.value) || 0)}
                        disabled={mode === 'view'}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={mapping.allowTender}
                        onChange={(e) => handleTenderMappingChange(index, 'allowTender', e.target.checked)}
                        disabled={mode === 'view'}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={mapping.allowRefund}
                        onChange={(e) => handleTenderMappingChange(index, 'allowRefund', e.target.checked)}
                        disabled={mode === 'view'}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Department Mapping Section */}
        <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: themeColor }} />}>
            <Typography variant="h6" fontWeight="600" color={themeColor}>
              Department Mapping
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>Allow</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => {
                  const mapping = departmentMappings.find(m => m.departmentId === category.id || m.department?.id === category.id);
                  return (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <Switch
                          checked={mapping?.allow || false}
                          onChange={(e) => {
                            const mapIndex = departmentMappings.findIndex(m => m.departmentId === category.id || m.department?.id === category.id);
                            if (mapIndex >= 0) {
                              handleDepartmentMappingChange(mapIndex, e.target.checked);
                            } else {
                              setDepartmentMappings([...departmentMappings, {
                                departmentId: category.id,
                                departmentName: category.name,
                                allow: e.target.checked,
                              }]);
                            }
                          }}
                          disabled={mode === 'view'}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Peripheral Devices Section */}
        <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: themeColor }} />}>
            <Typography variant="h6" fontWeight="600" color={themeColor}>
              Peripheral Devices
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={hardwareConfig.weighingMachine?.attached || false}
                    onChange={(e) => setHardwareConfig({
                      ...hardwareConfig,
                      weighingMachine: {
                        ...hardwareConfig.weighingMachine,
                        attached: e.target.checked,
                      },
                    })}
                    disabled={mode === 'view'}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                    }}
                  />
                }
                label="Weighing Machine Attached"
                sx={{ '& .MuiFormControlLabel-label': { color: themeColor, fontWeight: 500 } }}
              />
            </Grid>
              {/* Add more hardware config fields as needed */}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, backgroundColor: 'grey.50' }}>
        <Button
          onClick={onClose}
          disabled={saving}
          variant="outlined"
          sx={{
            borderColor: themeColor,
            color: themeColor,
            '&:hover': { borderColor: themeColor, backgroundColor: `${themeColor}20` }
          }}
        >
          Cancel
        </Button>
        {mode !== 'view' && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            sx={{
              backgroundColor: themeColor,
              '&:hover': { backgroundColor: `${themeColor}dd` }
            }}
          >
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TerminalDialog;

