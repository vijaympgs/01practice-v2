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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  Code as CodeIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  PlayArrow as GenerateIcon,
  RestartAlt as ResetIcon,
  ContentCopy as CopyIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { codeSettingsService } from '../../services/codeSettingsService';

const CodeSettingsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [codeSettings, setCodeSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialog, setDialog] = useState({ open: false, mode: 'new', setting: null });
  const [historyDialog, setHistoryDialog] = useState({ open: false, setting: null, history: [] });
  const [generateDialog, setGenerateDialog] = useState({ open: false, setting: null, generatedCode: '' });
  
  // Theme color state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCodeSettings();
    // Load theme color from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      setThemeColor(theme.activeColor);
    }
  }, []);

  const loadCodeSettings = async () => {
    try {
      setLoading(true);
      const data = await codeSettingsService.getAllCodeSettings();
      setCodeSettings(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load code settings: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewSetting = () => {
    setDialog({ open: true, mode: 'new', setting: null });
  };

  const handleEditSetting = (setting) => {
    setDialog({ open: true, mode: 'edit', setting });
  };

  const handleViewSetting = (setting) => {
    setDialog({ open: true, mode: 'view', setting });
  };

  const handleDeleteSetting = async (setting) => {
    if (window.confirm(`Are you sure you want to delete "${setting.code_type}"?`)) {
      try {
        setSaving(true);
        await codeSettingsService.deleteCodeSetting(setting.id);
        setSnackbar({ open: true, message: 'Code setting deleted successfully', severity: 'success' });
        loadCodeSettings();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete code setting: ' + error.message, severity: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleToggleStatus = async (setting) => {
    try {
      setSaving(true);
      await codeSettingsService.toggleStatus(setting.id, { is_active: !setting.is_active });
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
      loadCodeSettings();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateCode = async (setting) => {
    try {
      setSaving(true);
      const generatedCode = await codeSettingsService.generateCode(setting.id);
      setGenerateDialog({ open: true, setting, generatedCode });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to generate code: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetCounter = async (setting) => {
    if (window.confirm(`Are you sure you want to reset the counter for "${setting.code_type}"?`)) {
      try {
        setSaving(true);
        await codeSettingsService.resetCounter(setting.id);
        setSnackbar({ open: true, message: 'Counter reset successfully', severity: 'success' });
        loadCodeSettings();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to reset counter: ' + error.message, severity: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleViewHistory = async (setting) => {
    try {
      setSaving(true);
      const history = await codeSettingsService.getHistory(setting.id);
      setHistoryDialog({ open: true, setting, history });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load history: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSetting = async (settingData) => {
    try {
      setSaving(true);
      if (dialog.mode === 'new') {
        await codeSettingsService.createCodeSetting(settingData);
        setSnackbar({ open: true, message: 'Code setting created successfully', severity: 'success' });
      } else {
        await codeSettingsService.updateCodeSetting(settingData.id, settingData);
        setSnackbar({ open: true, message: 'Code setting updated successfully', severity: 'success' });
      }
      setDialog({ open: false, mode: 'new', setting: null });
      loadCodeSettings();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save code setting: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      SYSTEM: '#4CAF50',
      TRANSACTION: '#2196F3',
      CUSTOMER: '#FF9800',
      PRODUCT: '#9C27B0',
      PAYMENT: '#F44336',
      TAX: '#607D8B',
      DISCOUNT: '#795548',
      LOYALTY: '#E91E63',
      REPORT: '#009688',
      OTHER: '#9E9E9E',
    };
    return colors[category] || '#9E9E9E';
  };

  const getStatusColor = (status) => {
    return status ? 'success' : 'default';
  };

  const getFilteredSettings = () => {
    let filtered = codeSettings;
    
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(setting => setting.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(setting => 
        setting.code_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const categories = [
    'ALL', 'SYSTEM', 'TRANSACTION', 'CUSTOMER', 'PRODUCT', 
    'PAYMENT', 'TAX', 'DISCOUNT', 'LOYALTY', 'REPORT', 'OTHER'
  ];

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
        title="Code Settings Management" 
        subtitle="Manage system codes, numbering sequences, and auto-generation rules" 
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
            <Tab icon={<CodeIcon />} iconPosition="start" label="Code Settings" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Templates" />
            <Tab icon={<HistoryIcon />} iconPosition="start" label="History" />
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
                  Code Settings Management
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleNewSetting}
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
                  New Code Setting
                </Button>
              </Box>

              {/* Filters */}
              <Box sx={{ p: 3, borderBottom: '1px solid #dee2e6' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search code settings..."
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => {
                          setSelectedCategory('ALL');
                          setSearchTerm('');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Code Settings Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Code Setting</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Format</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Current Number</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredSettings().map((setting) => (
                      <TableRow 
                        key={setting.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ color: getCategoryColor(setting.category) }}>
                              <CodeIcon />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {setting.code_type}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {setting.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={setting.category} 
                            size="small"
                            sx={{ 
                              backgroundColor: getCategoryColor(setting.category) + '20',
                              color: getCategoryColor(setting.category),
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {setting.code_prefix}{setting.number_format}{setting.code_suffix}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {setting.current_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Switch
                              checked={setting.is_active}
                              onChange={() => handleToggleStatus(setting)}
                              disabled={saving}
                              color="primary"
                            />
                            <Chip 
                              label={setting.is_active ? 'Active' : 'Inactive'} 
                              size="small"
                              color={getStatusColor(setting.is_active)}
                              variant="outlined"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Generate Code">
                              <IconButton 
                                size="small" 
                                onClick={() => handleGenerateCode(setting)}
                                disabled={saving || !setting.is_active}
                              >
                                <GenerateIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset Counter">
                              <IconButton 
                                size="small" 
                                onClick={() => handleResetCounter(setting)}
                                disabled={saving}
                              >
                                <ResetIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewSetting(setting)}
                                disabled={saving}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditSetting(setting)}
                                disabled={saving}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="History">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewHistory(setting)}
                                disabled={saving}
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteSetting(setting)}
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
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Code Setting Templates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Templates for common code settings will be available here.
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Code Setting History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                History of all code setting changes will be displayed here.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Code Setting Dialog */}
      <CodeSettingDialog
        open={dialog.open}
        mode={dialog.mode}
        setting={dialog.setting}
        onClose={() => setDialog({ open: false, mode: 'new', setting: null })}
        onSave={handleSaveSetting}
        saving={saving}
      />

      {/* Generate Code Dialog */}
      <GenerateCodeDialog
        open={generateDialog.open}
        setting={generateDialog.setting}
        generatedCode={generateDialog.generatedCode}
        onClose={() => setGenerateDialog({ open: false, setting: null, generatedCode: '' })}
      />

      {/* History Dialog */}
      <HistoryDialog
        open={historyDialog.open}
        setting={historyDialog.setting}
        history={historyDialog.history}
        onClose={() => setHistoryDialog({ open: false, setting: null, history: [] })}
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

// Code Setting Dialog Component
const CodeSettingDialog = ({ open, mode, setting, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    category: 'SYSTEM',
    code_type: '',
    code_prefix: '',
    code_suffix: '',
    starting_number: 1,
    current_number: 0,
    number_format: '000000',
    description: '',
    is_active: true,
    auto_generate: true,
    reset_frequency: 'NEVER',
  });

  useEffect(() => {
    if (setting) {
      setFormData({ ...setting });
    } else {
      setFormData({
        category: 'SYSTEM',
        code_type: '',
        code_prefix: '',
        code_suffix: '',
        starting_number: 1,
        current_number: 0,
        number_format: '000000',
        description: '',
        is_active: true,
        auto_generate: true,
        reset_frequency: 'NEVER',
      });
    }
  }, [setting]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const categories = [
    { value: 'SYSTEM', label: 'System Codes' },
    { value: 'TRANSACTION', label: 'Transaction Codes' },
    { value: 'CUSTOMER', label: 'Customer Codes' },
    { value: 'PRODUCT', label: 'Product Codes' },
    { value: 'PAYMENT', label: 'Payment Codes' },
    { value: 'TAX', label: 'Tax Codes' },
    { value: 'DISCOUNT', label: 'Discount Codes' },
    { value: 'LOYALTY', label: 'Loyalty Codes' },
    { value: 'REPORT', label: 'Report Codes' },
    { value: 'OTHER', label: 'Other Codes' },
  ];

  const resetFrequencies = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'YEARLY', label: 'Yearly' },
    { value: 'NEVER', label: 'Never' },
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
        {mode === 'new' && 'Create New Code Setting'}
        {mode === 'edit' && 'Edit Code Setting'}
        {mode === 'view' && 'View Code Setting'}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                disabled={mode === 'view'}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Code Type"
              value={formData.code_type}
              onChange={(e) => handleChange('code_type', e.target.value)}
              disabled={mode === 'view'}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Code Prefix"
              value={formData.code_prefix}
              onChange={(e) => handleChange('code_prefix', e.target.value)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Number Format"
              value={formData.number_format}
              onChange={(e) => handleChange('number_format', e.target.value)}
              disabled={mode === 'view'}
              placeholder="000000"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Code Suffix"
              value={formData.code_suffix}
              onChange={(e) => handleChange('code_suffix', e.target.value)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Starting Number"
              type="number"
              value={formData.starting_number}
              onChange={(e) => handleChange('starting_number', parseInt(e.target.value) || 1)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Current Number"
              type="number"
              value={formData.current_number}
              onChange={(e) => handleChange('current_number', parseInt(e.target.value) || 0)}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Reset Frequency</InputLabel>
              <Select
                value={formData.reset_frequency}
                onChange={(e) => handleChange('reset_frequency', e.target.value)}
                disabled={mode === 'view'}
              >
                {resetFrequencies.map((frequency) => (
                  <MenuItem key={frequency.value} value={frequency.value}>
                    {frequency.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={mode === 'view'}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
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
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.auto_generate}
                    onChange={(e) => handleChange('auto_generate', e.target.checked)}
                    disabled={mode === 'view'}
                  />
                }
                label="Auto Generate"
              />
            </Box>
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

// Generate Code Dialog Component
const GenerateCodeDialog = ({ open, setting, generatedCode, onClose }) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,
          px: 3,
          fontWeight: 600,
        }}
      >
        Generated Code
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {setting?.code_type}
          </Typography>
          <Paper 
            sx={{ 
              p: 3, 
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: 0
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: '#667eea'
              }}
            >
              {generatedCode}
            </Typography>
          </Paper>
          <Button
            variant="outlined"
            startIcon={<CopyIcon />}
            onClick={handleCopyCode}
            sx={{ mt: 2 }}
          >
            Copy Code
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// History Dialog Component
const HistoryDialog = ({ open, setting, history, onClose }) => {
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
        History - {setting?.code_type}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Changed At</TableCell>
                <TableCell>Changed By</TableCell>
                <TableCell>Field</TableCell>
                <TableCell>Old Value</TableCell>
                <TableCell>New Value</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.changed_at).toLocaleString()}</TableCell>
                  <TableCell>{item.changed_by}</TableCell>
                  <TableCell>{item.field_name}</TableCell>
                  <TableCell>{item.old_value}</TableCell>
                  <TableCell>{item.new_value}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CodeSettingsPage;
