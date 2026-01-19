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
  LinearProgress,
  Badge,
} from '@mui/material';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as attributeService from '../../services/attributeService';

const AttributesPage = () => {
  const [attributes, setAttributes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue

  // Form data for attribute
  const [attributeForm, setAttributeForm] = useState({
    caption: '',
    description: '',
    data_type: 'text',
    is_required: false,
    is_active: true,
    display_order: 1,
  });


  const dataTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'list', label: 'List (Country)' },
  ];

  // Maximum number of attributes allowed
  const MAX_ATTRIBUTES = 20;

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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);

    if (token) {
      loadAttributes();
    }
  }, []);

  const loadAttributes = async () => {
    setLoading(true);
    try {
      const data = await attributeService.fetchAttributes();
      // Map backend data to frontend format
      const mappedAttributes = data.map(attr => attributeService.mapBackendToFrontend(attr));
      setAttributes(mappedAttributes);
    } catch (error) {
      console.error('Error loading attributes:', error);
      setSnackbar({
        open: true,
        message: 'Error loading attributes. Please try again.',
        severity: 'error',
      });
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (attribute = null) => {
    setEditingAttribute(attribute);
    if (attribute) {
      setAttributeForm({
        caption: attribute.caption,
        description: attribute.description,
        data_type: attribute.data_type,
        is_required: attribute.is_required,
        is_active: attribute.is_active,
        display_order: attribute.display_order || 1,
      });
    } else {
      setAttributeForm({
        caption: '',
        description: '',
        data_type: 'text',
        is_required: false,
        is_active: true,
        display_order: attributes.length + 1,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAttribute(null);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setAttributeForm(prev => ({
      ...prev,
      [field]: field === 'display_order' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!attributeForm.caption.trim()) {
        setSnackbar({
          open: true,
          message: 'Caption is required',
          severity: 'error',
        });
        return;
      }

      setLoading(true);

      if (editingAttribute) {
        // Update existing attribute via API
        const updatedAttribute = await attributeService.updateAttribute(
          editingAttribute.id,
          attributeForm
        );

        // Map backend response to frontend format
        const mappedAttribute = attributeService.mapBackendToFrontend(updatedAttribute);

        // Update local state
        const updatedAttributes = attributes.map(attr =>
          attr.id === editingAttribute.id ? mappedAttribute : attr
        );
        setAttributes(updatedAttributes);

        setSnackbar({
          open: true,
          message: 'Attribute updated successfully!',
          severity: 'success',
        });
      } else {
        // Check if we've reached the maximum limit
        if (attributes.length >= MAX_ATTRIBUTES) {
          setSnackbar({
            open: true,
            message: `Maximum limit of ${MAX_ATTRIBUTES} attributes reached. Please delete an existing attribute before adding a new one.`,
            severity: 'error',
          });
          setLoading(false);
          return;
        }

        // Create new attribute via API
        const newAttribute = await attributeService.createAttribute(attributeForm);

        // Map backend response to frontend format
        const mappedAttribute = attributeService.mapBackendToFrontend(newAttribute);

        // Update local state
        setAttributes([...attributes, mappedAttribute]);

        setSnackbar({
          open: true,
          message: 'Attribute created successfully!',
          severity: 'success',
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving attribute:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error saving attribute. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      try {
        setLoading(true);

        // Delete via API
        await attributeService.deleteAttribute(id);

        // Update local state
        const updatedAttributes = attributes.filter(attr => attr.id !== id);
        setAttributes(updatedAttributes);

        setSnackbar({
          open: true,
          message: 'Attribute deleted successfully!',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error deleting attribute:', error);
        const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          'Error deleting attribute. Please try again.';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getDataTypeColor = (dataType) => {
    const colors = {
      text: 'primary',
      number: 'secondary',
      date: 'success',
      boolean: 'warning',
      list: 'info',
    };
    return colors[dataType] || 'default';
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please log in to access the Attributes management.
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
      <PageTitle
        title="Attributes Management"
        subtitle="Manage product attributes and their configurations"
      />

      {/* Attribute Limit Progress Indicator */}
      <Card sx={{
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        mb: 3,
        background: `linear-gradient(135deg, ${themeColor}15 0%, ${themeColor}25 100%)`,
        border: `1px solid ${themeColor}20`
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                bgcolor: attributes.length >= MAX_ATTRIBUTES ? 'error.main' :
                  attributes.length >= MAX_ATTRIBUTES * 0.8 ? 'warning.main' : 'success.main',
                width: 48,
                height: 48
              }}>
                {attributes.length >= MAX_ATTRIBUTES ? <WarningIcon /> :
                  attributes.length >= MAX_ATTRIBUTES * 0.8 ? <InfoIcon /> : <CheckCircleIcon />}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Attribute Capacity Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {attributes.length >= MAX_ATTRIBUTES ?
                    'Maximum capacity reached' :
                    `You have room for ${MAX_ATTRIBUTES - attributes.length} more attributes`
                  }
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                color: attributes.length >= MAX_ATTRIBUTES ? 'error.main' :
                  attributes.length >= MAX_ATTRIBUTES * 0.8 ? 'warning.main' : 'success.main'
              }}>
                {attributes.length}/{MAX_ATTRIBUTES}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attributes Used
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((attributes.length / MAX_ATTRIBUTES) * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(attributes.length / MAX_ATTRIBUTES) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: `${themeColor}15`,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: attributes.length >= MAX_ATTRIBUTES ? 'error.main' :
                    attributes.length >= MAX_ATTRIBUTES * 0.8 ? 'warning.main' : themeColor
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Main Content Card */}
      <Card sx={{
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <CardHeader title="List">
          <ActionButton
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
            disabled={attributes.length >= MAX_ATTRIBUTES}
          >
            <Badge
              badgeContent={attributes.length >= MAX_ATTRIBUTES ? 0 : MAX_ATTRIBUTES - attributes.length}
              color="warning"
              sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', fontWeight: 'bold' } }}
            >
              Add Attribute
            </Badge>
          </ActionButton>
        </CardHeader>

        <CardContent sx={{ p: 0 }}>
          {/* Data Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Caption</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Data Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Required</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Display Order</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: themeColor }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: themeColor }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attributes
                  .sort((a, b) => (a.display_order || 1) - (b.display_order || 1))
                  .map((attribute) => (
                    <TableRow key={attribute.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {attribute.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {attribute.caption}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {attribute.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={dataTypes.find(dt => dt.value === attribute.data_type)?.label || attribute.data_type}
                          color={getDataTypeColor(attribute.data_type)}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={attribute.is_required ? 'Yes' : 'No'}
                          color={attribute.is_required ? 'error' : 'default'}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {attribute.display_order || 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={attribute.is_active ? 'Active' : 'Inactive'}
                          color={attribute.is_active ? 'success' : 'default'}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(attribute)}
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
                              onClick={() => handleDelete(attribute.id)}
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
        <DialogHeader
          title={`${editingAttribute ? 'Edit' : 'Add'} Attribute`}
          icon={<AssignmentIcon />}
        />
        <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Grid container spacing={1}>


            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Caption"
                value={attributeForm.caption}
                onChange={handleInputChange('caption')}
                required
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: themeColor }}>Data Type</InputLabel>
                <Select
                  value={attributeForm.data_type}
                  onChange={handleInputChange('data_type')}
                  label="Data Type"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                >
                  {dataTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={attributeForm.description}
                onChange={handleInputChange('description')}
                multiline
                rows={3}
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Display Order"
                type="number"
                value={attributeForm.display_order}
                onChange={handleInputChange('display_order')}
                inputProps={{ min: 1, max: 999 }}
                helperText="Order in which this attribute appears (1 = first)"
                InputLabelProps={{ sx: { color: themeColor } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={attributeForm.is_required}
                    onChange={handleInputChange('is_required')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: themeColor },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: themeColor }
                    }}
                  />
                }
                label="Required Field"
                sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500, color: themeColor } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={attributeForm.is_active}
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
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCloseDialog}
            startIcon={<CancelIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            {editingAttribute ? 'Update' : 'Create'}
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

export default AttributesPage;
