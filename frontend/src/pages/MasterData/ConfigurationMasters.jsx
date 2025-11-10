import React, { useState } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Save,
  Refresh,
  Add,
  Edit,
  Delete,
  Settings,
  Description,
  Code,
  Preview,
  Science,
} from '@mui/icons-material';

const ConfigurationMasters = () => {
  const [activeTab, setActiveTab] = useState('codeGeneration');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Code Generation Settings
  const [codeGenerationSettings, setCodeGenerationSettings] = useState({
    product: {
      prefix: 'PRD',
      suffix: '',
      length: 8,
      includeYear: true,
      includeMonth: false,
      includeDay: false,
      sequenceStart: 1,
      currentSequence: 1250,
      separator: '-',
      example: 'PRD-2025-001250',
    },
    customer: {
      prefix: 'CUST',
      suffix: '',
      length: 8,
      includeYear: true,
      includeMonth: false,
      includeDay: false,
      sequenceStart: 1,
      currentSequence: 850,
      separator: '-',
      example: 'CUST-2025-000850',
    },
    supplier: {
      prefix: 'SUPP',
      suffix: '',
      length: 8,
      includeYear: true,
      includeMonth: false,
      includeDay: false,
      sequenceStart: 1,
      currentSequence: 120,
      separator: '-',
      example: 'SUPP-2025-000120',
    },
    category: {
      prefix: 'CAT',
      suffix: '',
      length: 6,
      includeYear: false,
      includeMonth: false,
      includeDay: false,
      sequenceStart: 1,
      currentSequence: 45,
      separator: '-',
      example: 'CAT-000045',
    },
  });

  // Document Numbering Settings
  const [documentSettings, setDocumentSettings] = useState({
    salesInvoice: {
      prefix: 'SI',
      suffix: '',
      length: 10,
      includeYear: true,
      includeMonth: true,
      includeDay: false,
      sequenceStart: 1,
      currentSequence: 12500,
      separator: '/',
      resetFrequency: 'yearly',
      example: 'SI/2025/01/0012500',
    },
    purchaseOrder: {
      prefix: 'PO',
      suffix: '',
      length: 10,
      includeYear: true,
      includeMonth: true,
      includeDay: false,
      sequenceStart: 1,
      currentSequence: 8500,
      separator: '/',
      resetFrequency: 'yearly',
      example: 'PO/2025/01/0008500',
    },
    goodsReceipt: {
      prefix: 'GRN',
      suffix: '',
      length: 10,
      includeYear: true,
      includeMonth: true,
      includeDay: false,
      sequenceStart: 1,
      currentSequence: 3200,
      separator: '/',
      resetFrequency: 'yearly',
      example: 'GRN/2025/01/0003200',
    },
    stockTransfer: {
      prefix: 'ST',
      suffix: '',
      length: 8,
      includeYear: true,
      includeMonth: true,
      includeDay: false,
      sequenceStart: 1,
      currentSequence: 850,
      separator: '/',
      resetFrequency: 'yearly',
      example: 'ST/2025/01/000850',
    },
  });

  const handleCodeGenerationChange = (entity, field, value) => {
    setCodeGenerationSettings(prev => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [field]: value
      }
    }));
  };

  const handleDocumentSettingsChange = (document, field, value) => {
    setDocumentSettings(prev => ({
      ...prev,
      [document]: {
        ...prev[document],
        [field]: value
      }
    }));
  };

  const generateExample = (settings) => {
    let example = settings.prefix;
    
    if (settings.separator) example += settings.separator;
    
    if (settings.includeYear) example += new Date().getFullYear();
    if (settings.includeMonth) example += (new Date().getMonth() + 1).toString().padStart(2, '0');
    if (settings.includeDay) example += new Date().getDate().toString().padStart(2, '0');
    
    if (settings.separator) example += settings.separator;
    
    const sequence = settings.currentSequence.toString().padStart(settings.length - settings.prefix.length - (settings.separator ? 2 : 0) - (settings.includeYear ? 4 : 0) - (settings.includeMonth ? 2 : 0) - (settings.includeDay ? 2 : 0), '0');
    example += sequence;
    
    if (settings.suffix) example += settings.separator + settings.suffix;
    
    return example;
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: 'Configuration saved successfully!',
      severity: 'success'
    });
  };

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: 'Configuration refreshed from server',
      severity: 'info'
    });
  };

  const renderCodeGenerationSettings = () => (
    <Grid container spacing={3}>
      {Object.entries(codeGenerationSettings).map(([entity, settings]) => (
        <Grid item xs={12} md={6} key={entity}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                {entity} Code Generation
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prefix"
                    value={settings.prefix}
                    onChange={(e) => handleCodeGenerationChange(entity, 'prefix', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Suffix"
                    value={settings.suffix}
                    onChange={(e) => handleCodeGenerationChange(entity, 'suffix', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Length"
                    type="number"
                    value={settings.length}
                    onChange={(e) => handleCodeGenerationChange(entity, 'length', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Separator"
                    value={settings.separator}
                    onChange={(e) => handleCodeGenerationChange(entity, 'separator', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sequence Start"
                    type="number"
                    value={settings.sequenceStart}
                    onChange={(e) => handleCodeGenerationChange(entity, 'sequenceStart', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Sequence"
                    type="number"
                    value={settings.currentSequence}
                    onChange={(e) => handleCodeGenerationChange(entity, 'currentSequence', parseInt(e.target.value))}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Include in Code:
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.includeYear}
                        onChange={(e) => handleCodeGenerationChange(entity, 'includeYear', e.target.checked)}
                      />
                    }
                    label="Year"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.includeMonth}
                        onChange={(e) => handleCodeGenerationChange(entity, 'includeMonth', e.target.checked)}
                      />
                    }
                    label="Month"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.includeDay}
                        onChange={(e) => handleCodeGenerationChange(entity, 'includeDay', e.target.checked)}
                      />
                    }
                    label="Day"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Example:
                </Typography>
                <Chip
                  label={generateExample(settings)}
                  color="primary"
                  variant="outlined"
                />
                <IconButton size="small" color="primary">
                  <Preview />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDocumentNumberingSettings = () => (
    <Grid container spacing={3}>
      {Object.entries(documentSettings).map(([document, settings]) => (
        <Grid item xs={12} md={6} key={document}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                {document.replace(/([A-Z])/g, ' $1')} Numbering
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prefix"
                    value={settings.prefix}
                    onChange={(e) => handleDocumentSettingsChange(document, 'prefix', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Suffix"
                    value={settings.suffix}
                    onChange={(e) => handleDocumentSettingsChange(document, 'suffix', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Length"
                    type="number"
                    value={settings.length}
                    onChange={(e) => handleDocumentSettingsChange(document, 'length', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Separator"
                    value={settings.separator}
                    onChange={(e) => handleDocumentSettingsChange(document, 'separator', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sequence Start"
                    type="number"
                    value={settings.sequenceStart}
                    onChange={(e) => handleDocumentSettingsChange(document, 'sequenceStart', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Sequence"
                    type="number"
                    value={settings.currentSequence}
                    onChange={(e) => handleDocumentSettingsChange(document, 'currentSequence', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Reset Frequency</InputLabel>
                    <Select
                      value={settings.resetFrequency}
                      label="Reset Frequency"
                      onChange={(e) => handleDocumentSettingsChange(document, 'resetFrequency', e.target.value)}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                      <MenuItem value="never">Never</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Include in Document Number:
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.includeYear}
                        onChange={(e) => handleDocumentSettingsChange(document, 'includeYear', e.target.checked)}
                      />
                    }
                    label="Year"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.includeMonth}
                        onChange={(e) => handleDocumentSettingsChange(document, 'includeMonth', e.target.checked)}
                      />
                    }
                    label="Month"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.includeDay}
                        onChange={(e) => handleDocumentSettingsChange(document, 'includeDay', e.target.checked)}
                      />
                    }
                    label="Day"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Example:
                </Typography>
                <Chip
                  label={generateExample(settings)}
                  color="success"
                  variant="outlined"
                />
                <IconButton size="small" color="primary">
                  <Preview />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderSystemSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-generate codes"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Validate code uniqueness"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Allow manual code entry"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable code preview"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Require approval for code changes"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Log all code generation activities"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Allow duplicate codes across entities"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable code history tracking"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'codeGeneration':
        return renderCodeGenerationSettings();
      case 'documentNumbering':
        return renderDocumentNumberingSettings();
      case 'systemSettings':
        return renderSystemSettings();
      default:
        return renderCodeGenerationSettings();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Configuration Masters" 
            subtitle="Manage code generation and document numbering settings"
            showIcon={true}
            icon={<Settings />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
          >
            Save Configuration
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
          <Button
            variant={activeTab === 'codeGeneration' ? 'contained' : 'outlined'}
            startIcon={<Code />}
            onClick={() => setActiveTab('codeGeneration')}
          >
            Code Generation
          </Button>
          <Button
            variant={activeTab === 'documentNumbering' ? 'contained' : 'outlined'}
            startIcon={<Description />}
            onClick={() => setActiveTab('documentNumbering')}
          >
            Document Numbering
          </Button>
          <Button
            variant={activeTab === 'systemSettings' ? 'contained' : 'outlined'}
            startIcon={<Settings />}
            onClick={() => setActiveTab('systemSettings')}
          >
            System Settings
          </Button>
        </Box>
      </Card>

      {/* Content */}
      {renderTabContent()}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfigurationMasters;
