import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Divider,
  Grid
} from '@mui/material';
import {
  Save,
  Cancel,
  Business
} from '@mui/icons-material';

const QuickVendorDialog = ({ open, onClose, onSave, loading = false }) => {
  const [formData, setFormData] = useState({
    display_name: '',
    company_name: '',
    type: 'Vendor',
    contact_phone: '',
    contact_email: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});

  const vendorTypes = [
    'Vendor',
    'Vendor', 
    'Distributor',
    'Manufacturer',
    'Wholesaler',
    'Service Provider',
    'Consultant'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Company/Display Name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Vendor type is required';
    }
    
    // Email validation if provided
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Ensure company_name is set if display_name is provided
      const vendorData = {
        ...formData,
        company_name: formData.company_name || formData.display_name
      };
      
      onSave(vendorData);
    }
  };

  const handleClose = () => {
    // Reset form data and errors
    setFormData({
      display_name: '',
      company_name: '',
      type: 'Vendor',
      contact_phone: '',
      contact_email: '',
      is_active: true
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Business color="primary" />
        <Typography variant="h6" component="div">
          Quick Vendor Creation
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Quickly add a new vendor with essential information. You can add more details later.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company/Display Name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              error={!!errors.display_name}
              helperText={errors.display_name}
              required
              placeholder="Enter company or display name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name (Optional)"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              placeholder="Leave empty to use display name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.type} required>
              <InputLabel>Vendor Type</InputLabel>
              <Select
                value={formData.type}
                label="Vendor Type"
                onChange={(e) => handleInputChange('type', e.target.value)}
                sx={{
                  borderRadius: 2
                }}
              >
                {vendorTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              placeholder="Optional phone number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              error={!!errors.contact_email}
              helperText={errors.contact_email}
              placeholder="Optional email address"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  color="primary"
                />
              }
              label="Active Vendor"
            />
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
              Active vendors can be used in purchase orders and transactions
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={handleClose}
          startIcon={<Cancel />}
          disabled={loading}
          sx={{
            color: 'text.secondary',
            borderColor: 'text.secondary',
            '&:hover': {
              borderColor: 'text.primary'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<Save />}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          {loading ? 'Creating...' : 'Create Vendor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickVendorDialog;
