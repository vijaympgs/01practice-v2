import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
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
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  AccountBalance as BankIcon,
  AttachMoney as CurrencyIcon,
  Receipt as TaxIcon,
  Percent as DiscountIcon,
  Person as CustomerIcon,
  Inventory as UOMIcon,
  Warning as ReasonIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { posMasterService } from '../../services/posMasterService';

const POSMastersPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [masters, setMasters] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialog, setDialog] = useState({ open: false, mode: 'new', master: null });
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [historyDialog, setHistoryDialog] = useState({ open: false, master: null, history: [] });
  const [masterTypes, setMasterTypes] = useState([]);

  useEffect(() => {
    loadMasters();
    loadSettings();
    loadMasterTypes();
  }, []);

  const loadMasters = async () => {
    try {
      setLoading(true);
      const data = await posMasterService.getAllMasters();
      setMasters(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load POS masters: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await posMasterService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadMasterTypes = async () => {
    try {
      const data = await posMasterService.getMasterTypes();
      setMasterTypes(data);
    } catch (error) {
      console.error('Failed to load master types:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewMaster = () => {
    setDialog({ open: true, mode: 'new', master: null });
  };

  const handleEditMaster = (master) => {
    setDialog({ open: true, mode: 'edit', master });
  };

  const handleViewMaster = (master) => {
    setDialog({ open: true, mode: 'view', master });
  };

  const handleDeleteMaster = async (master) => {
    if (window.confirm(`Are you sure you want to delete "${master.name}"?`)) {
      try {
        setSaving(true);
        await posMasterService.deleteMaster(master.id);
        setSnackbar({ open: true, message: 'POS master deleted successfully', severity: 'success' });
        loadMasters();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete POS master: ' + error.message, severity: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleToggleStatus = async (master) => {
    try {
      setSaving(true);
      await posMasterService.toggleStatus(master.id, { reason: 'Status toggled from UI' });
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
      loadMasters();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleViewHistory = async (master) => {
    try {
      const history = await posMasterService.getMasterHistory(master.id);
      setHistoryDialog({ open: true, master, history });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load history: ' + error.message, severity: 'error' });
    }
  };

  const handleSaveMaster = async (masterData) => {
    try {
      setSaving(true);
      if (dialog.mode === 'new') {
        await posMasterService.createMaster(masterData);
        setSnackbar({ open: true, message: 'POS master created successfully', severity: 'success' });
      } else {
        await posMasterService.updateMaster(dialog.master.id, masterData);
        setSnackbar({ open: true, message: 'POS master updated successfully', severity: 'success' });
      }
      setDialog({ open: false, mode: 'new', master: null });
      loadMasters();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save POS master: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (settingsData) => {
    try {
      setSaving(true);
      await posMasterService.updateSettings(settingsData);
      setSnackbar({ open: true, message: 'Settings updated successfully', severity: 'success' });
      setSettingsDialog(false);
      loadSettings();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update settings: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getMasterTypeIcon = (type) => {
    const icons = {
      bank: <BankIcon />,
      currency: <CurrencyIcon />,
      tax_type: <TaxIcon />,
      discount_type: <DiscountIcon />,
      customer_type: <CustomerIcon />,
      unit_of_measure: <UOMIcon />,
      reason_code: <ReasonIcon />,
      other: <StorageIcon />,
    };
    return icons[type] || <StorageIcon />;
  };

  const getMasterTypeColor = (type) => {
    const colors = {
      bank: '#4CAF50',
      currency: '#2196F3',
      tax_type: '#FF9800',
      discount_type: '#9C27B0',
      customer_type: '#E91E63',
      unit_of_measure: '#607D8B',
      reason_code: '#F44336',
      other: '#9E9E9E',
    };
    return colors[type] || '#9E9E9E';
  };

  const groupedMasters = masters.reduce((acc, master) => {
    if (!acc[master.master_type]) {
      acc[master.master_type] = [];
    }
    acc[master.master_type].push(master);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 3
    }}>
      {/* Modern Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          px: 3,
          mb: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <StorageIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  mb: 0.5
                }}
              >
                POS Masters
              </Typography>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Manage POS-specific master data and codes
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Tabs */}
        <Paper 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: theme.palette.grey[600],
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light + '15',
                },
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
              },
            }}
          >
            <Tab icon={<StorageIcon />} iconPosition="start" label="Master Data" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  p: 3,
                  borderBottom: '1px solid #dee2e6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.grey[800] }}>
                  POS Master Data
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleNewMaster}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    },
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  New Master Data
                </Button>
              </Box>

              {/* Master Data by Type */}
              <Box sx={{ p: 3 }}>
                {Object.entries(groupedMasters).map(([type, typeMasters]) => (
                  <Accordion key={type} sx={{ mb: 2 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: getMasterTypeColor(type) + '10',
                        '&:hover': {
                          backgroundColor: getMasterTypeColor(type) + '20',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ color: getMasterTypeColor(type) }}>
                          {getMasterTypeIcon(type)}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {masterTypes.find(t => t.value === type)?.label || type}
                        </Typography>
                        <Chip 
                          label={`${typeMasters.length} items`} 
                          size="small"
                          sx={{ 
                            backgroundColor: getMasterTypeColor(type) + '20',
                            color: getMasterTypeColor(type),
                            fontWeight: 500
                          }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>System</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {typeMasters.map((master) => (
                              <TableRow 
                                key={master.id}
                                sx={{ 
                                  '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                                  '&:hover': { backgroundColor: '#e3f2fd' }
                                }}
                              >
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ fontSize: '1.2rem', color: master.color_code }}>
                                      {master.icon_name && '🔹'}
                                    </Box>
                                    <Box>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {master.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {master.description}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={master.code} 
                                    size="small"
                                    sx={{ 
                                      backgroundColor: getMasterTypeColor(master.master_type) + '20',
                                      color: getMasterTypeColor(master.master_type),
                                      fontWeight: 500
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Switch
                                      checked={master.is_active}
                                      onChange={() => handleToggleStatus(master)}
                                      disabled={saving || master.is_system_generated}
                                      color="primary"
                                    />
                                    <Chip 
                                      label={master.is_active ? 'Active' : 'Inactive'} 
                                      size="small"
                                      color={master.is_active ? 'success' : 'default'}
                                      variant="outlined"
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={master.is_system_generated ? 'System' : 'User'} 
                                    size="small"
                                    color={master.is_system_generated ? 'warning' : 'info'}
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {master.display_order}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="View Details">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleViewMaster(master)}
                                        disabled={saving}
                                      >
                                        <ViewIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleEditMaster(master)}
                                        disabled={saving || master.is_system_generated}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="History">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleViewHistory(master)}
                                        disabled={saving}
                                      >
                                        <HistoryIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleDeleteMaster(master)}
                                        disabled={saving || !master.can_be_deleted_display}
                                        color="error"
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
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
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Settings Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  p: 3,
                  borderBottom: '1px solid #dee2e6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.grey[800] }}>
                  POS Master Settings
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={() => setSettingsDialog(true)}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    },
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Configure Settings
                </Button>
              </Box>

              {/* Settings Display */}
              {settings && (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Code Generation
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel
                            control={<Switch checked={settings.enable_auto_code_generation} disabled />}
                            label="Enable Auto Code Generation"
                          />
                          <Typography variant="body2" color="text.secondary">
                            Code Prefix Length: {settings.code_prefix_length}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Display Settings
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel
                            control={<Switch checked={settings.allow_duplicate_names} disabled />}
                            label="Allow Duplicate Names"
                          />
                          <FormControlLabel
                            control={<Switch checked={settings.show_inactive_items} disabled />}
                            label="Show Inactive Items"
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Validation Settings
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel
                            control={<Switch checked={settings.require_description} disabled />}
                            label="Require Description"
                          />
                          <FormControlLabel
                            control={<Switch checked={settings.validate_code_format} disabled />}
                            label="Validate Code Format"
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Master Data Dialog */}
      <MasterDataDialog
        open={dialog.open}
        mode={dialog.mode}
        master={dialog.master}
        masterTypes={masterTypes}
        onClose={() => setDialog({ open: false, mode: 'new', master: null })}
        onSave={handleSaveMaster}
        saving={saving}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsDialog}
        settings={settings}
        onClose={() => setSettingsDialog(false)}
        onSave={handleSaveSettings}
        saving={saving}
      />

      {/* History Dialog */}
      <HistoryDialog
        open={historyDialog.open}
        master={historyDialog.master}
        history={historyDialog.history}
        onClose={() => setHistoryDialog({ open: false, master: null, history: [] })}
      />

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

// Master Data Dialog Component
const MasterDataDialog = ({ open, mode, master, masterTypes, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    master_type: 'bank',
    description: '',
    is_active: true,
    requires_authorization: false,
    display_order: 0,
    icon_name: '',
    color_code: '#2196F3',
    allow_edit: true,
    allow_delete: true,
  });

  useEffect(() => {
    if (master) {
      setFormData({
        name: master.name || '',
        code: master.code || '',
        master_type: master.master_type || 'bank',
        description: master.description || '',
        is_active: master.is_active || true,
        requires_authorization: master.requires_authorization || false,
        display_order: master.display_order || 0,
        icon_name: master.icon_name || '',
        color_code: master.color_code || '#2196F3',
        allow_edit: master.allow_edit || true,
        allow_delete: master.allow_delete || true,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        master_type: 'bank',
        description: '',
        is_active: true,
        requires_authorization: false,
        display_order: 0,
        icon_name: '',
        color_code: '#2196F3',
        allow_edit: true,
        allow_delete: true,
      });
    }
  }, [master]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,
          px: 3,
          fontWeight: 600,
        }}
      >
        {mode === 'new' && 'Create New Master Data'}
        {mode === 'edit' && 'Edit Master Data'}
        {mode === 'view' && 'View Master Data'}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Master Data Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={mode === 'view'}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Code"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              disabled={mode === 'view'}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Master Type</InputLabel>
              <Select
                value={formData.master_type}
                onChange={(e) => handleChange('master_type', e.target.value)}
                disabled={mode === 'view'}
              >
                {masterTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Display Order"
              type="number"
              value={formData.display_order}
              onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Icon Name"
              value={formData.icon_name}
              onChange={(e) => handleChange('icon_name', e.target.value)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Color Code"
              type="color"
              value={formData.color_code}
              onChange={(e) => handleChange('color_code', e.target.value)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Settings
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  disabled={mode === 'view'}
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.requires_authorization}
                  onChange={(e) => handleChange('requires_authorization', e.target.checked)}
                  disabled={mode === 'view'}
                />
              }
              label="Requires Authorization"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allow_edit}
                  onChange={(e) => handleChange('allow_edit', e.target.checked)}
                  disabled={mode === 'view'}
                />
              }
              label="Allow Edit"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        {mode !== 'view' && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              },
            }}
          >
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Settings Dialog Component
const SettingsDialog = ({ open, settings, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,
          px: 3,
          fontWeight: 600,
        }}
      >
        POS Master Settings Configuration
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Code Generation
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enable_auto_code_generation || false}
                  onChange={(e) => handleChange('enable_auto_code_generation', e.target.checked)}
                />
              }
              label="Enable Auto Code Generation"
            />
            <TextField
              fullWidth
              label="Code Prefix Length"
              type="number"
              value={formData.code_prefix_length || 3}
              onChange={(e) => handleChange('code_prefix_length', parseInt(e.target.value) || 3)}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Display Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allow_duplicate_names || false}
                  onChange={(e) => handleChange('allow_duplicate_names', e.target.checked)}
                />
              }
              label="Allow Duplicate Names"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.show_inactive_items || false}
                  onChange={(e) => handleChange('show_inactive_items', e.target.checked)}
                />
              }
              label="Show Inactive Items"
            />
            <TextField
              fullWidth
              label="Default Display Order"
              type="number"
              value={formData.default_display_order || 0}
              onChange={(e) => handleChange('default_display_order', parseInt(e.target.value) || 0)}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Validation Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.require_description || false}
                  onChange={(e) => handleChange('require_description', e.target.checked)}
                />
              }
              label="Require Description"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.validate_code_format || false}
                  onChange={(e) => handleChange('validate_code_format', e.target.checked)}
                />
              }
              label="Validate Code Format"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            },
          }}
        >
          {saving ? <CircularProgress size={20} /> : 'Save Settings'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// History Dialog Component
const HistoryDialog = ({ open, master, history, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        History - {master?.name}
      </DialogTitle>
      <DialogContent>
        {history.map((entry, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">
                {entry.changed_by_name || 'System'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(entry.changed_at).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {entry.field_name}: {entry.old_value}
              </Typography>
              <Typography variant="body2">→</Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.new_value}
              </Typography>
            </Box>
            {entry.reason && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Reason: {entry.reason}
              </Typography>
            )}
          </Paper>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default POSMastersPage;
