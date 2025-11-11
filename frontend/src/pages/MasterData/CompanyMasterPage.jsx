import React, { useState } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
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
  Avatar,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Business,
  LocationOn,
  AccountBalance,
  Settings,
  IntegrationInstructions,
  Save,
  Refresh,
  CloudUpload,
} from '@mui/icons-material';

const CompanyMasterPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    // Company Profile
    companyName: 'NewBorn Retail',
    legalName: 'NewBorn Retail Pvt Ltd',
    registrationNumber: 'REG123456789',
    taxId: 'TAX987654321',
    website: 'https://newbornretail.com',
    email: 'info@newbornretail.com',
    phone: '+1-555-0123',
    address: '123 Business Street, Tech City, TC 12345',
    
    // Financial Settings
    baseCurrency: 'USD',
    fiscalYearStart: 'January',
    accountingMethod: 'accrual',
    taxCalculation: 'inclusive',
    
    // Location Network
    headquarters: {
      name: 'Headquarters',
      address: '123 Business Street, Tech City, TC 12345',
      phone: '+1-555-0123',
      email: 'hq@flowretail.com',
    },
    branches: [
      {
        id: 1,
        name: 'Downtown Store',
        code: 'DT001',
        address: '456 Main Street, Tech City, TC 12346',
        phone: '+1-555-0124',
        email: 'downtown@flowretail.com',
        status: 'active',
      },
      {
        id: 2,
        name: 'Mall Location',
        code: 'ML002',
        address: '789 Mall Drive, Tech City, TC 12347',
        phone: '+1-555-0125',
        email: 'mall@flowretail.com',
        status: 'active',
      },
    ],
    
    // Operational Settings
    businessHours: {
      monday: { open: '09:00', close: '21:00', closed: false },
      tuesday: { open: '09:00', close: '21:00', closed: false },
      wednesday: { open: '09:00', close: '21:00', closed: false },
      thursday: { open: '09:00', close: '21:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '10:00', close: '22:00', closed: false },
      sunday: { open: '11:00', close: '20:00', closed: false },
    },
    
    // Integration Settings
    apis: {
      paymentGateway: 'stripe',
      inventorySystem: 'custom',
      accountingSystem: 'quickbooks',
      crmSystem: 'salesforce',
    },
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Simulate save operation
    setSnackbar({
      open: true,
      message: 'Company master data saved successfully!',
      severity: 'success'
    });
    console.log('Saving company data:', formData);
  };

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: 'Data refreshed from server',
      severity: 'info'
    });
  };

  const renderCompanyProfile = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Legal Name"
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax ID"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
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
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFinancialSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Currency & Accounting
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Base Currency</InputLabel>
                  <Select
                    value={formData.baseCurrency}
                    label="Base Currency"
                    onChange={(e) => handleInputChange('baseCurrency', e.target.value)}
                  >
                    <MenuItem value="USD">USD - US Dollar</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="GBP">GBP - British Pound</MenuItem>
                    <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Fiscal Year Start</InputLabel>
                  <Select
                    value={formData.fiscalYearStart}
                    label="Fiscal Year Start"
                    onChange={(e) => handleInputChange('fiscalYearStart', e.target.value)}
                  >
                    <MenuItem value="January">January</MenuItem>
                    <MenuItem value="April">April</MenuItem>
                    <MenuItem value="July">July</MenuItem>
                    <MenuItem value="October">October</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Accounting Method</InputLabel>
                  <Select
                    value={formData.accountingMethod}
                    label="Accounting Method"
                    onChange={(e) => handleInputChange('accountingMethod', e.target.value)}
                  >
                    <MenuItem value="accrual">Accrual</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tax Calculation</InputLabel>
                  <Select
                    value={formData.taxCalculation}
                    label="Tax Calculation"
                    onChange={(e) => handleInputChange('taxCalculation', e.target.value)}
                  >
                    <MenuItem value="inclusive">Tax Inclusive</MenuItem>
                    <MenuItem value="exclusive">Tax Exclusive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tax Settings
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Tax settings will be configured in the Tax Master module
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable Tax Calculation"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-calculate Tax on Sales"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Enable Tax Reporting"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderLocationNetwork = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Headquarters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.headquarters.name}
                  onChange={(e) => handleNestedInputChange('headquarters', 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.headquarters.phone}
                  onChange={(e) => handleNestedInputChange('headquarters', 'phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.headquarters.email}
                  onChange={(e) => handleNestedInputChange('headquarters', 'email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Address"
                  value={formData.headquarters.address}
                  onChange={(e) => handleNestedInputChange('headquarters', 'address', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Branch Locations
        </Typography>
        <Grid container spacing={2}>
          {formData.branches.map((branch) => (
            <Grid item xs={12} md={6} key={branch.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{branch.name}</Typography>
                    <Chip 
                      label={branch.status} 
                      color={branch.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Code: {branch.code}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {branch.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {branch.phone} • {branch.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} md={6}>
            <Card sx={{ border: '2px dashed', borderColor: 'primary.main', cursor: 'pointer' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Business sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="primary">
                  Add New Branch
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to add a new branch location
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderOperationalSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Business Hours
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(formData.businessHours).map(([day, hours]) => (
                <Grid item xs={12} key={day}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {day}
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={!hours.closed}
                          onChange={(e) => {
                            const newHours = { ...hours, closed: !e.target.checked };
                            handleNestedInputChange('businessHours', day, newHours);
                          }}
                        />
                      }
                      label={hours.closed ? 'Closed' : 'Open'}
                    />
                    {!hours.closed && (
                      <>
                        <TextField
                          size="small"
                          type="time"
                          value={hours.open}
                          onChange={(e) => {
                            const newHours = { ...hours, open: e.target.value };
                            handleNestedInputChange('businessHours', day, newHours);
                          }}
                          sx={{ width: 120 }}
                        />
                        <Typography variant="body2">to</Typography>
                        <TextField
                          size="small"
                          type="time"
                          value={hours.close}
                          onChange={(e) => {
                            const newHours = { ...hours, close: e.target.value };
                            handleNestedInputChange('businessHours', day, newHours);
                          }}
                          sx={{ width: 120 }}
                        />
                      </>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Operational Policies
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable Multi-location Operations"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow Cross-location Transfers"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Enable Inventory Sharing"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Require Approval for Returns"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderIntegrationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Third-Party Integrations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Gateway</InputLabel>
                  <Select
                    value={formData.apis.paymentGateway}
                    label="Payment Gateway"
                    onChange={(e) => handleNestedInputChange('apis', 'paymentGateway', e.target.value)}
                  >
                    <MenuItem value="stripe">Stripe</MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                    <MenuItem value="square">Square</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Inventory System</InputLabel>
                  <Select
                    value={formData.apis.inventorySystem}
                    label="Inventory System"
                    onChange={(e) => handleNestedInputChange('apis', 'inventorySystem', e.target.value)}
                  >
                    <MenuItem value="custom">Custom Built</MenuItem>
                    <MenuItem value="sap">SAP</MenuItem>
                    <MenuItem value="oracle">Oracle</MenuItem>
                    <MenuItem value="netsuite">NetSuite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Accounting System</InputLabel>
                  <Select
                    value={formData.apis.accountingSystem}
                    label="Accounting System"
                    onChange={(e) => handleNestedInputChange('apis', 'accountingSystem', e.target.value)}
                  >
                    <MenuItem value="quickbooks">QuickBooks</MenuItem>
                    <MenuItem value="xero">Xero</MenuItem>
                    <MenuItem value="sage">Sage</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>CRM System</InputLabel>
                  <Select
                    value={formData.apis.crmSystem}
                    label="CRM System"
                    onChange={(e) => handleNestedInputChange('apis', 'crmSystem', e.target.value)}
                  >
                    <MenuItem value="salesforce">Salesforce</MenuItem>
                    <MenuItem value="hubspot">HubSpot</MenuItem>
                    <MenuItem value="pipedrive">Pipedrive</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              API configurations are managed in the System Settings module
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Test API Connections
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable Real-time Sync"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Enable Batch Processing"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable Error Notifications"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return renderCompanyProfile();
      case 1:
        return renderFinancialSettings();
      case 2:
        return renderLocationNetwork();
      case 3:
        return renderOperationalSettings();
      case 4:
        return renderIntegrationSettings();
      default:
        return renderCompanyProfile();
    }
  };

  return (
    <Box sx={{ pt: 4, pb: 3, pl: 3, pr: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Company Master" 
            subtitle="Manage company information, settings, and configurations"
            showIcon={true}
            icon={<Business />}
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
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Business />} 
            label="Company Profile" 
            iconPosition="start"
          />
          <Tab 
            icon={<AccountBalance />} 
            label="Financial Settings" 
            iconPosition="start"
          />
          <Tab 
            icon={<LocationOn />} 
            label="Location Network" 
            iconPosition="start"
          />
          <Tab 
            icon={<Settings />} 
            label="Operational Settings" 
            iconPosition="start"
          />
          <Tab 
            icon={<IntegrationInstructions />} 
            label="Integration Settings" 
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
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

export default CompanyMasterPage;

