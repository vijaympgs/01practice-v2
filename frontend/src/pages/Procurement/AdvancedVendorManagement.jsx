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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Avatar,
  Rating,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Save,
  Refresh,
  Add,
  Edit,
  Delete,
  Business,
  LocalShipping,
  AttachMoney,
  Analytics,
  Assessment,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  Warning,
  CheckCircle,
  Schedule,
  Phone,
  Email,
  LocationOn,
  AccountBalance,
  Security,
  Speed,
  ExpandMore,
  Visibility,
  VisibilityOff,
  CloudUpload,
  Download,
} from '@mui/icons-material';

const AdvancedVendorManagement = ({ onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  // Comprehensive vendor data structure
  const [vendors, setVendors] = useState([
    {
      id: 1,
      basicInfo: {
        name: 'Apple Inc.',
        code: 'VENDOR-001',
        type: 'Manufacturer',
        category: 'Electronics',
        status: 'active',
        registrationDate: '2024-01-15',
        website: 'https://apple.com',
        description: 'Leading technology company specializing in consumer electronics',
      },
      contactInfo: {
        primaryContact: 'John Smith',
        email: 'procurement@apple.com',
        phone: '+1-555-0123',
        address: '1 Apple Park Way, Cupertino, CA 95014',
        country: 'United States',
        timezone: 'PST',
      },
      financialInfo: {
        currency: 'USD',
        paymentTerms: 'Net 30',
        creditLimit: 1000000,
        currentBalance: 125000,
        taxId: 'TAX123456789',
        bankDetails: {
          bankName: 'Wells Fargo',
          accountNumber: '****1234',
          routingNumber: '121000248',
        },
      },
      performance: {
        overallRating: 4.8,
        deliveryScore: 95,
        qualityScore: 98,
        communicationScore: 92,
        costScore: 88,
        totalOrders: 245,
        onTimeDelivery: 94,
        qualityIssues: 2,
        averageResponseTime: '2 hours',
        lastOrderDate: '2024-12-15',
        nextReviewDate: '2025-03-15',
      },
      certifications: [
        { name: 'ISO 9001:2015', expiryDate: '2025-12-31', status: 'valid' },
        { name: 'RoHS Compliance', expiryDate: '2026-06-30', status: 'valid' },
        { name: 'FCC Certification', expiryDate: '2025-09-15', status: 'valid' },
      ],
      documents: [
        { name: 'Vendor Agreement.pdf', type: 'contract', uploadDate: '2024-01-15' },
        { name: 'Insurance Certificate.pdf', type: 'insurance', uploadDate: '2024-02-01' },
        { name: 'Tax Certificate.pdf', type: 'tax', uploadDate: '2024-01-20' },
      ],
      products: [
        { id: 1, name: 'iPhone 15 Pro Max', sku: 'PRD-2025-001250', category: 'Smartphones' },
        { id: 2, name: 'iPad Pro', sku: 'PRD-2025-001251', category: 'Tablets' },
        { id: 3, name: 'MacBook Pro', sku: 'PRD-2025-001252', category: 'Laptops' },
      ],
    },
    {
      id: 2,
      basicInfo: {
        name: 'Samsung Electronics',
        code: 'VENDOR-002',
        type: 'Manufacturer',
        category: 'Electronics',
        status: 'active',
        registrationDate: '2024-02-01',
        website: 'https://samsung.com',
        description: 'Global technology leader in consumer electronics and semiconductors',
      },
      contactInfo: {
        primaryContact: 'Sarah Johnson',
        email: 'procurement@samsung.com',
        phone: '+1-555-0124',
        address: '85 Challenger Road, Ridgefield Park, NJ 07660',
        country: 'United States',
        timezone: 'EST',
      },
      financialInfo: {
        currency: 'USD',
        paymentTerms: 'Net 45',
        creditLimit: 800000,
        currentBalance: 89000,
        taxId: 'TAX987654321',
        bankDetails: {
          bankName: 'Bank of America',
          accountNumber: '****5678',
          routingNumber: '026009593',
        },
      },
      performance: {
        overallRating: 4.6,
        deliveryScore: 92,
        qualityScore: 95,
        communicationScore: 89,
        costScore: 91,
        totalOrders: 189,
        onTimeDelivery: 91,
        qualityIssues: 4,
        averageResponseTime: '4 hours',
        lastOrderDate: '2024-12-10',
        nextReviewDate: '2025-02-01',
      },
      certifications: [
        { name: 'ISO 14001:2015', expiryDate: '2025-08-31', status: 'valid' },
        { name: 'CE Marking', expiryDate: '2026-03-15', status: 'valid' },
      ],
      documents: [
        { name: 'Master Agreement.pdf', type: 'contract', uploadDate: '2024-02-01' },
        { name: 'Quality Manual.pdf', type: 'quality', uploadDate: '2024-02-15' },
      ],
      products: [
        { id: 4, name: 'Galaxy S24 Ultra', sku: 'PRD-2025-002100', category: 'Smartphones' },
        { id: 5, name: 'Galaxy Tab S9', sku: 'PRD-2025-002101', category: 'Tablets' },
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    basicInfo: {
      name: '',
      code: '',
      type: 'Manufacturer',
      category: '',
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
      website: '',
      description: '',
    },
    contactInfo: {
      primaryContact: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      timezone: '',
    },
    financialInfo: {
      currency: 'USD',
      paymentTerms: 'Net 30',
      creditLimit: 0,
      currentBalance: 0,
      taxId: '',
      bankDetails: {
        bankName: '',
        accountNumber: '',
        routingNumber: '',
      },
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: 'Vendor saved successfully!',
      severity: 'success'
    });
    console.log('Saving vendor data:', formData);
  };

  const handleAddVendor = () => {
    setEditingVendor(null);
    setFormData({
      basicInfo: {
        name: '',
        code: '',
        type: 'Manufacturer',
        category: '',
        status: 'active',
        registrationDate: new Date().toISOString().split('T')[0],
        website: '',
        description: '',
      },
      contactInfo: {
        primaryContact: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        timezone: '',
      },
      financialInfo: {
        currency: 'USD',
        paymentTerms: 'Net 30',
        creditLimit: 0,
        currentBalance: 0,
        taxId: '',
        bankDetails: {
          bankName: '',
          accountNumber: '',
          routingNumber: '',
        },
      },
    });
    setDialogOpen(true);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setDialogOpen(true);
  };

  const handleDeleteVendor = (id) => {
    setVendors(vendors.filter(vendor => vendor.id !== id));
    setSnackbar({
      open: true,
      message: 'Vendor deleted successfully',
      severity: 'success'
    });
  };

  const toggleVendorStatus = (id) => {
    setVendors(vendors.map(vendor => 
      vendor.id === id ? {
        ...vendor,
        basicInfo: {
          ...vendor.basicInfo,
          status: vendor.basicInfo.status === 'active' ? 'inactive' : 'active'
        }
      } : vendor
    ));
  };

  const renderVendorList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vendor</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Performance</TableCell>
            <TableCell>Financial</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Business />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {vendor.basicInfo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vendor.basicInfo.code}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={vendor.basicInfo.type}
                  color="secondary"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={vendor.performance.overallRating} readOnly precision={0.1} size="small" />
                  <Typography variant="body2">
                    {vendor.performance.overallRating}/5
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" color="primary">
                    ${vendor.financialInfo.currentBalance.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    of ${vendor.financialInfo.creditLimit.toLocaleString()}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={vendor.basicInfo.status}
                  color={vendor.basicInfo.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEditVendor(vendor)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={vendor.basicInfo.status === 'active' ? 'Deactivate' : 'Activate'}>
                    <IconButton
                      size="small"
                      onClick={() => toggleVendorStatus(vendor.id)}
                    >
                      {vendor.basicInfo.status === 'active' ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteVendor(vendor.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderVendorDetails = (vendor) => (
    <Grid container spacing={3}>
      {/* Basic Information */}
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
                  label="Vendor Name"
                  value={vendor.basicInfo.name}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vendor Code"
                  value={vendor.basicInfo.code}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Type"
                  value={vendor.basicInfo.type}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={vendor.basicInfo.description}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Contact Information */}
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
                  label="Primary Contact"
                  value={vendor.contactInfo.primaryContact}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={vendor.contactInfo.email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={vendor.contactInfo.phone}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  value={vendor.contactInfo.address}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="body1">Overall Rating:</Typography>
                  <Rating value={vendor.performance.overallRating} readOnly precision={0.1} />
                  <Typography variant="h6">{vendor.performance.overallRating}/5</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Delivery Score</Typography>
                  <LinearProgress variant="determinate" value={vendor.performance.deliveryScore} />
                  <Typography variant="body2">{vendor.performance.deliveryScore}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Quality Score</Typography>
                  <LinearProgress variant="determinate" value={vendor.performance.qualityScore} />
                  <Typography variant="body2">{vendor.performance.qualityScore}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Communication Score</Typography>
                  <LinearProgress variant="determinate" value={vendor.performance.communicationScore} />
                  <Typography variant="body2">{vendor.performance.communicationScore}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Cost Score</Typography>
                  <LinearProgress variant="determinate" value={vendor.performance.costScore} />
                  <Typography variant="body2">{vendor.performance.costScore}%</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Financial Information */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Financial Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Credit Limit"
                  value={`$${vendor.financialInfo.creditLimit.toLocaleString()}`}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Balance"
                  value={`$${vendor.financialInfo.currentBalance.toLocaleString()}`}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Payment Terms"
                  value={vendor.financialInfo.paymentTerms}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Currency"
                  value={vendor.financialInfo.currency}
                  InputProps={{ readOnly: true }}
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
        return renderVendorList();
      case 1:
        return vendors.length > 0 ? renderVendorDetails(vendors[0]) : (
          <Alert severity="info">Select a vendor to view details</Alert>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info">
                Vendor Performance Analytics will be implemented in the next iteration.
              </Alert>
            </Grid>
          </Grid>
        );
      default:
        return renderVendorList();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Advanced Vendor Management" 
            subtitle="Comprehensive vendor relationship and performance management"
            showIcon={true}
            icon={<Business />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {onClose && (
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ color: 'text.secondary', borderColor: 'text.secondary' }}
            >
              Close
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddVendor}
          >
            Add Vendor
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
            label="Vendor List" 
            iconPosition="start"
          />
          <Tab 
            icon={<Analytics />} 
            label="Vendor Details" 
            iconPosition="start"
          />
          <Tab 
            icon={<Assessment />} 
            label="Performance Analytics" 
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor Name"
                value={formData.basicInfo.name}
                onChange={(e) => handleInputChange('basicInfo', 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor Code"
                value={formData.basicInfo.code}
                onChange={(e) => handleInputChange('basicInfo', 'code', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.basicInfo.type}
                  label="Type"
                  onChange={(e) => handleInputChange('basicInfo', 'type', e.target.value)}
                >
                  <MenuItem value="Vendor">Vendor (General)</MenuItem>
                  <MenuItem value="Supplier">Supplier (Raw Materials)</MenuItem>
                  <MenuItem value="Distributor">Distributor (Finished Products)</MenuItem>
                  <MenuItem value="Manufacturer">Manufacturer</MenuItem>
                  <MenuItem value="Wholesaler">Wholesaler</MenuItem>
                  <MenuItem value="Service Provider">Service Provider</MenuItem>
                  <MenuItem value="Consultant">Consultant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.basicInfo.category}
                  label="Category"
                  onChange={(e) => handleInputChange('basicInfo', 'category', e.target.value)}
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Fashion">Fashion</MenuItem>
                  <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                  <MenuItem value="Automotive">Automotive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.basicInfo.description}
                onChange={(e) => handleInputChange('basicInfo', 'description', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            {editingVendor ? 'Update' : 'Save'}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdvancedVendorManagement;

