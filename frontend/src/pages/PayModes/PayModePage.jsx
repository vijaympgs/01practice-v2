import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
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
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { payModeService } from '../../services/payModeService';

const PayModePage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialog, setDialog] = useState({ open: false, mode: 'new', method: null });
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [historyDialog, setHistoryDialog] = useState({ open: false, method: null, history: [] });
  
  // Theme color state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue

  useEffect(() => {
    loadPaymentMethods();
    loadSettings();
    // Load theme color from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      setThemeColor(theme.activeColor);
    }
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const data = await payModeService.getAllPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load payment methods: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await payModeService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewMethod = () => {
    setDialog({ open: true, mode: 'new', method: null });
  };

  const handleEditMethod = (method) => {
    setDialog({ open: true, mode: 'edit', method });
  };

  const handleViewMethod = (method) => {
    setDialog({ open: true, mode: 'view', method });
  };

  const handleDeleteMethod = async (method) => {
    if (window.confirm(`Are you sure you want to delete "${method.name}"?`)) {
      try {
        setSaving(true);
        await payModeService.deletePaymentMethod(method.id);
        setSnackbar({ open: true, message: 'Payment method deleted successfully', severity: 'success' });
        loadPaymentMethods();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete payment method: ' + error.message, severity: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleToggleStatus = async (method) => {
    try {
      setSaving(true);
      await payModeService.toggleStatus(method.id, { reason: 'Status toggled from UI' });
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
      loadPaymentMethods();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleViewHistory = async (method) => {
    try {
      const history = await payModeService.getMethodHistory(method.id);
      setHistoryDialog({ open: true, method, history });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load history: ' + error.message, severity: 'error' });
    }
  };

  const handleSaveMethod = async (methodData) => {
    try {
      setSaving(true);
      if (dialog.mode === 'new') {
        await payModeService.createPaymentMethod(methodData);
        setSnackbar({ open: true, message: 'Payment method created successfully', severity: 'success' });
      } else {
        await payModeService.updatePaymentMethod(dialog.method.id, methodData);
        setSnackbar({ open: true, message: 'Payment method updated successfully', severity: 'success' });
      }
      setDialog({ open: false, mode: 'new', method: null });
      loadPaymentMethods();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save payment method: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (settingsData) => {
    try {
      setSaving(true);
      await payModeService.updateSettings(settingsData);
      setSnackbar({ open: true, message: 'Settings updated successfully', severity: 'success' });
      setSettingsDialog(false);
      loadSettings();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update settings: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getPaymentTypeIcon = (type) => {
    const icons = {
      cash: '💵',
      card: '💳',
      upi: '📱',
      netbanking: '🏦',
      wallet: '👛',
      cheque: '📄',
      credit: '📊',
      other: '💳',
    };
    return icons[type] || '💳';
  };

  const getPaymentTypeColor = (type) => {
    const colors = {
      cash: '#4CAF50',
      card: '#2196F3',
      upi: '#9C27B0',
      netbanking: '#607D8B',
      wallet: '#E91E63',
      cheque: '#795548',
      credit: '#FF5722',
      other: '#9E9E9E',
    };
    return colors[type] || '#9E9E9E';
  };

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
      {/* Page Title */}
      <PageTitle 
        title="Pay Mode Configuration" 
        subtitle="Manage payment methods and settings" 
      />

      <Container maxWidth="lg">
        {/* Tabs */}
        <Paper 
          sx={{ 
            mb: 3,
            borderRadius: 0,
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
                borderRadius: '0px 0px 0 0',
              },
            }}
          >
            <Tab icon={<PaymentIcon />} iconPosition="start" label="Payment Methods" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
                  Payment Methods
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleNewMethod}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    },
                    borderRadius: 0,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  New Payment Method
                </Button>
              </Box>

              {/* Payment Methods Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount Range</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow 
                        key={method.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ fontSize: '1.2rem' }}>
                              {getPaymentTypeIcon(method.payment_type)}
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {method.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {method.code}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={method.payment_type_display} 
                            size="small"
                            sx={{ 
                              backgroundColor: getPaymentTypeColor(method.payment_type) + '20',
                              color: getPaymentTypeColor(method.payment_type),
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Switch
                              checked={method.is_active}
                              onChange={() => handleToggleStatus(method)}
                              disabled={saving}
                              color="primary"
                            />
                            <Chip 
                              label={method.is_active ? 'Active' : 'Inactive'} 
                              size="small"
                              color={method.is_active ? 'success' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            ₹{method.min_amount} - ₹{method.max_amount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {method.display_order}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewMethod(method)}
                                disabled={saving}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditMethod(method)}
                                disabled={saving}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="History">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewHistory(method)}
                                disabled={saving}
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteMethod(method)}
                                disabled={saving}
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
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
                  Payment Settings
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
                    borderRadius: 0,
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
                      <Paper sx={{ p: 2, borderRadius: 0 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          General Settings
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel
                            control={<Switch checked={settings.require_payment_confirmation} disabled />}
                            label="Require Payment Confirmation"
                          />
                          <FormControlLabel
                            control={<Switch checked={settings.allow_multiple_payments} disabled />}
                            label="Allow Multiple Payments"
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, borderRadius: 0 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Cash Handling
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel
                            control={<Switch checked={settings.enable_cash_drawer} disabled />}
                            label="Enable Cash Drawer"
                          />
                          <FormControlLabel
                            control={<Switch checked={settings.auto_open_cash_drawer} disabled />}
                            label="Auto-open Cash Drawer"
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, borderRadius: 0 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Card Settings
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel
                            control={<Switch checked={settings.enable_card_payments} disabled />}
                            label="Enable Card Payments"
                          />
                          <FormControlLabel
                            control={<Switch checked={settings.require_card_pin} disabled />}
                            label="Require Card PIN"
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, borderRadius: 0 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Digital Payments
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel
                            control={<Switch checked={settings.enable_upi_payments} disabled />}
                            label="Enable UPI Payments"
                          />
                          <FormControlLabel
                            control={<Switch checked={settings.enable_qr_code} disabled />}
                            label="Enable QR Code"
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

      {/* Payment Method Dialog */}
      <PaymentMethodDialog
        open={dialog.open}
        mode={dialog.mode}
        method={dialog.method}
        onClose={() => setDialog({ open: false, mode: 'new', method: null })}
        onSave={handleSaveMethod}
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
        method={historyDialog.method}
        history={historyDialog.history}
        onClose={() => setHistoryDialog({ open: false, method: null, history: [] })}
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

// Payment Method Dialog Component
const PaymentMethodDialog = ({ open, mode, method, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    payment_type: 'cash',
    description: '',
    is_active: true,
    requires_authorization: false,
    min_amount: 0,
    max_amount: 999999.99,
    display_order: 0,
    icon_name: '',
    color_code: '#2196F3',
    allow_refund: true,
    allow_partial_refund: true,
    requires_receipt: false,
  });

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name || '',
        code: method.code || '',
        payment_type: method.payment_type || 'cash',
        description: method.description || '',
        is_active: method.is_active || true,
        requires_authorization: method.requires_authorization || false,
        min_amount: method.min_amount || 0,
        max_amount: method.max_amount || 999999.99,
        display_order: method.display_order || 0,
        icon_name: method.icon_name || '',
        color_code: method.color_code || '#2196F3',
        allow_refund: method.allow_refund || true,
        allow_partial_refund: method.allow_partial_refund || true,
        requires_receipt: method.requires_receipt || false,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        payment_type: 'cash',
        description: '',
        is_active: true,
        requires_authorization: false,
        min_amount: 0,
        max_amount: 999999.99,
        display_order: 0,
        icon_name: '',
        color_code: '#2196F3',
        allow_refund: true,
        allow_partial_refund: true,
        requires_receipt: false,
      });
    }
  }, [method]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const paymentTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'netbanking', label: 'Net Banking' },
    { value: 'wallet', label: 'Digital Wallet' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'credit', label: 'Credit' },
    { value: 'other', label: 'Other' },
  ];

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
        {mode === 'new' && 'Create New Payment Method'}
        {mode === 'edit' && 'Edit Payment Method'}
        {mode === 'view' && 'View Payment Method'}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Payment Method Name"
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
              <InputLabel>Payment Type</InputLabel>
              <Select
                value={formData.payment_type}
                onChange={(e) => handleChange('payment_type', e.target.value)}
                disabled={mode === 'view'}
              >
                {paymentTypes.map((type) => (
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
              label="Minimum Amount"
              type="number"
              value={formData.min_amount}
              onChange={(e) => handleChange('min_amount', parseFloat(e.target.value) || 0)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maximum Amount"
              type="number"
              value={formData.max_amount}
              onChange={(e) => handleChange('max_amount', parseFloat(e.target.value) || 999999.99)}
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
                  checked={formData.requires_receipt}
                  onChange={(e) => handleChange('requires_receipt', e.target.checked)}
                  disabled={mode === 'view'}
                />
              }
              label="Requires Receipt"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allow_refund}
                  onChange={(e) => handleChange('allow_refund', e.target.checked)}
                  disabled={mode === 'view'}
                />
              }
              label="Allow Refund"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allow_partial_refund}
                  onChange={(e) => handleChange('allow_partial_refund', e.target.checked)}
                  disabled={mode === 'view'}
                />
              }
              label="Allow Partial Refund"
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
        Payment Settings Configuration
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              General Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.require_payment_confirmation || false}
                  onChange={(e) => handleChange('require_payment_confirmation', e.target.checked)}
                />
              }
              label="Require Payment Confirmation"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allow_multiple_payments || false}
                  onChange={(e) => handleChange('allow_multiple_payments', e.target.checked)}
                />
              }
              label="Allow Multiple Payments"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cash Handling
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enable_cash_drawer || false}
                  onChange={(e) => handleChange('enable_cash_drawer', e.target.checked)}
                />
              }
              label="Enable Cash Drawer"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.auto_open_cash_drawer || false}
                  onChange={(e) => handleChange('auto_open_cash_drawer', e.target.checked)}
                />
              }
              label="Auto-open Cash Drawer"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Card Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enable_card_payments || false}
                  onChange={(e) => handleChange('enable_card_payments', e.target.checked)}
                />
              }
              label="Enable Card Payments"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.require_card_pin || false}
                  onChange={(e) => handleChange('require_card_pin', e.target.checked)}
                />
              }
              label="Require Card PIN"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Digital Payments
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enable_upi_payments || false}
                  onChange={(e) => handleChange('enable_upi_payments', e.target.checked)}
                />
              }
              label="Enable UPI Payments"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enable_qr_code || false}
                  onChange={(e) => handleChange('enable_qr_code', e.target.checked)}
                />
              }
              label="Enable QR Code"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Refund Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allow_refunds || false}
                  onChange={(e) => handleChange('allow_refunds', e.target.checked)}
                />
              }
              label="Allow Refunds"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.require_refund_authorization || false}
                  onChange={(e) => handleChange('require_refund_authorization', e.target.checked)}
                />
              }
              label="Require Refund Authorization"
            />
            <TextField
              fullWidth
              label="Maximum Refund Percentage"
              type="number"
              value={formData.max_refund_percentage || 100}
              onChange={(e) => handleChange('max_refund_percentage', parseFloat(e.target.value) || 100)}
              sx={{ mt: 2 }}
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
const HistoryDialog = ({ open, method, history, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        History - {method?.name}
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

export default PayModePage;
