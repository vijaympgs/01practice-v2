import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Grid,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { getFormTypeIndicator } from '../../constants/formTypes';

const LayoutPreferencesForm = ({ preferences, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    // Sidebar Settings Only
    sidebar_width: 240,
    sidebar_position: 'left',
    sidebar_theme: 'light',
    sidebar_auto_collapse: false,
    sidebar_show_icons: true,
    sidebar_show_labels: true,
    sidebar_compact_mode: false,
    sidebar_expanded_sections: {
      'Master Data': true,
      'Transactions': false,
      'Reports & Analytics': false
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get form type indicator for layout_preferences
  const formIndicator = getFormTypeIndicator('layout_preferences');

  useEffect(() => {
    if (preferences) {
      setFormData({
        name: preferences.name || 'Sidebar Configuration',
        description: preferences.description || '',
        is_active: preferences.is_active ?? true,
        // Sidebar Settings Only
        sidebar_width: preferences.sidebar_width || 240,
        sidebar_position: preferences.sidebar_position || 'left',
        sidebar_theme: preferences.sidebar_theme || 'light',
        sidebar_auto_collapse: preferences.sidebar_auto_collapse ?? false,
        sidebar_show_icons: preferences.sidebar_show_icons ?? true,
        sidebar_show_labels: preferences.sidebar_show_labels ?? true,
        sidebar_compact_mode: preferences.sidebar_compact_mode ?? false,
        sidebar_expanded_sections: preferences.sidebar_expanded_sections || {
          'Master Data': true,
          'Transactions': false,
          'Reports & Analytics': false
        }
      });
    }
  }, [preferences]);


  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' || event.target.type === 'switch'
      ? event.target.checked
      : event.target.value;

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Configuration name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Configuration name must be at least 2 characters';
    }

    if (formData.sidebar_width < 200 || formData.sidebar_width > 400) {
      newErrors.sidebar_width = 'Sidebar width must be between 200 and 400 pixels';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '70vh',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">
              {preferences ? 'Edit Sidebar Preferences' : 'Create Sidebar Configuration'}
            </Typography>
            <Chip
              label={formIndicator.label}
              color={formIndicator.color}
              size="small"
              variant="outlined"
            />
          </Box>
          <Button
            onClick={onClose}
            color="inherit"
            size="small"
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Error Alert */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the errors below
            </Alert>
          )}

          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sidebar Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize the sidebar appearance, behavior, and default settings
            </Typography>
          </Box>

          {/* Basic Configuration */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Configuration Name *"
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={handleChange('is_active')}
                      color="primary"
                    />
                  }
                  label="Active Configuration"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={handleChange('description')}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Sidebar Settings */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Sidebar Settings
            </Typography>
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sidebar Width (px)"
                    type="number"
                    value={formData.sidebar_width}
                    onChange={handleChange('sidebar_width')}
                    error={!!errors.sidebar_width}
                    helperText={errors.sidebar_width || 'Between 200-400 pixels'}
                    inputProps={{ min: 200, max: 400 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sidebar Position</InputLabel>
                    <Select
                      value={formData.sidebar_position}
                      onChange={handleChange('sidebar_position')}
                      label="Sidebar Position"
                    >
                      <MenuItem value="left">Left Side</MenuItem>
                      <MenuItem value="right">Right Side</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sidebar Theme</InputLabel>
                    <Select
                      value={formData.sidebar_theme}
                      onChange={handleChange('sidebar_theme')}
                      label="Sidebar Theme"
                    >
                      <MenuItem value="light">Light Theme</MenuItem>
                      <MenuItem value="dark">Dark Theme</MenuItem>
                      <MenuItem value="auto">Auto (Follow System)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.sidebar_auto_collapse}
                        onChange={handleChange('sidebar_auto_collapse')}
                        color="primary"
                      />
                    }
                    label="Auto Collapse on Small Screens"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Automatically collapse sidebar on mobile devices
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.sidebar_show_icons}
                        onChange={handleChange('sidebar_show_icons')}
                        color="primary"
                      />
                    }
                    label="Show Menu Icons"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Display icons next to menu items
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.sidebar_show_labels}
                        onChange={handleChange('sidebar_show_labels')}
                        color="primary"
                      />
                    }
                    label="Show Menu Labels"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Display text labels for menu items
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.sidebar_compact_mode}
                        onChange={handleChange('sidebar_compact_mode')}
                        color="primary"
                      />
                    }
                    label="Compact Sidebar Mode"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Reduce spacing and padding in sidebar
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Default Expanded Sections
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose which menu sections should be expanded by default
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.sidebar_expanded_sections['Master Data']}
                            onChange={(e) => {
                              const newSections = { ...formData.sidebar_expanded_sections };
                              newSections['Master Data'] = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                sidebar_expanded_sections: newSections
                              }));
                            }}
                            color="primary"
                          />
                        }
                        label="Master Data"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.sidebar_expanded_sections['Transactions']}
                            onChange={(e) => {
                              const newSections = { ...formData.sidebar_expanded_sections };
                              newSections['Transactions'] = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                sidebar_expanded_sections: newSections
                              }));
                            }}
                            color="primary"
                          />
                        }
                        label="Transactions"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.sidebar_expanded_sections['Reports & Analytics']}
                            onChange={(e) => {
                              const newSections = { ...formData.sidebar_expanded_sections };
                              newSections['Reports & Analytics'] = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                sidebar_expanded_sections: newSections
                              }));
                            }}
                            color="primary"
                          />
                        }
                        label="Reports & Analytics"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Preview Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Configuration Preview
            </Typography>
            <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Configuration:</strong> {formData.name || 'Untitled Configuration'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Status:</strong> 
                    <Chip 
                      label={formData.is_active ? 'Active' : 'Inactive'} 
                      color={formData.is_active ? 'success' : 'default'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Sidebar Width:</strong> {formData.sidebar_width}px
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Sidebar Position:</strong> {formData.sidebar_position}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Sidebar Theme:</strong> {formData.sidebar_theme}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Auto Collapse:</strong> {formData.sidebar_auto_collapse ? 'Yes' : 'No'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Show Icons:</strong> {formData.sidebar_show_icons ? 'Yes' : 'No'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Show Labels:</strong> {formData.sidebar_show_labels ? 'Yes' : 'No'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Compact Mode:</strong> {formData.sidebar_compact_mode ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
                
                {formData.description && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Description:</strong> {formData.description}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            size="large"
          >
            {loading ? 'Saving...' : (preferences ? 'Update Preferences' : 'Create Configuration')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LayoutPreferencesForm;

