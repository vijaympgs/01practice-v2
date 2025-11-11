import React, { useState } from 'react';
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
  Person,
  Email,
  Phone,
  LocationOn,
  AttachMoney,
  ShoppingCart,
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Visibility,
  VisibilityOff,
  CloudUpload,
  Download,
  Send,
  Chat,
  Notifications,
  Loyalty,
  Assessment,
  Analytics,
  ExpandMore,
  Business,
  Home,
  Work,
  School,
  Favorite,
  History,
  Receipt,
  Payment,
  Security,
} from '@mui/icons-material';
import CustomerSegmentation from '../../components/crm/CustomerSegmentation';
import LoyaltyProgramManager from '../../components/crm/LoyaltyProgramManager';

const AdvancedCustomerMaster = () => {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Comprehensive customer data structure
  const [customers, setCustomers] = useState([
    {
      id: 1,
      profile: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        dateOfBirth: '1985-06-15',
        gender: 'Male',
        maritalStatus: 'Married',
        avatar: '/api/placeholder/100/100',
        customerSince: '2020-03-15',
        status: 'active',
        customerType: 'Premium',
        source: 'Website',
      },
      demographics: {
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
        },
        occupation: 'Software Engineer',
        company: 'Tech Corp Inc.',
        annualIncome: '$75,000 - $100,000',
        education: 'Bachelor\'s Degree',
        interests: ['Technology', 'Gaming', 'Sports', 'Travel'],
      },
      purchaseHistory: [
        {
          id: 1,
          date: '2024-12-15',
          orderNumber: 'ORD-2024-001250',
          items: 3,
          total: 1299.99,
          status: 'delivered',
          products: ['iPhone 15 Pro Max', 'AirPods Pro', 'MagSafe Charger'],
        },
        {
          id: 2,
          date: '2024-11-28',
          orderNumber: 'ORD-2024-001180',
          items: 2,
          total: 899.99,
          status: 'delivered',
          products: ['iPad Air', 'Apple Pencil'],
        },
        {
          id: 3,
          date: '2024-10-12',
          orderNumber: 'ORD-2024-001050',
          items: 1,
          total: 249.99,
          status: 'delivered',
          products: ['Apple Watch Series 9'],
        },
      ],
      loyalty: {
        tier: 'Gold',
        points: 12500,
        lifetimeValue: 15499.97,
        nextTierPoints: 5000,
        tierBenefits: [
          'Free shipping on all orders',
          'Early access to new products',
          'Exclusive discounts',
          'Priority customer support',
        ],
        rewards: [
          { name: 'Birthday Discount', value: '$25', expiry: '2025-06-15' },
          { name: 'Referral Bonus', value: '$50', expiry: '2025-01-31' },
        ],
      },
      communication: {
        preferences: {
          email: true,
          sms: true,
          phone: false,
          push: true,
        },
        history: [
          {
            id: 1,
            date: '2024-12-16',
            type: 'email',
            subject: 'Order Confirmation - ORD-2024-001250',
            status: 'sent',
            channel: 'Email',
          },
          {
            id: 2,
            date: '2024-12-15',
            type: 'sms',
            subject: 'Your order is ready for pickup',
            status: 'delivered',
            channel: 'SMS',
          },
          {
            id: 3,
            date: '2024-12-10',
            type: 'email',
            subject: 'New Product Alert: iPhone 15 Pro Max',
            status: 'opened',
            channel: 'Email',
          },
        ],
      },
      analytics: {
        totalOrders: 15,
        averageOrderValue: 899.99,
        lastPurchaseDate: '2024-12-15',
        purchaseFrequency: 'Monthly',
        preferredCategories: ['Electronics', 'Accessories'],
        satisfactionRating: 4.8,
        lifetimeValue: 15499.97,
        churnRisk: 'Low',
        predictedNextPurchase: '2025-01-15',
      },
      financial: {
        creditLimit: 5000,
        currentBalance: 0,
        paymentMethod: 'Credit Card',
        creditScore: 750,
        paymentHistory: 'Excellent',
        preferredPayment: 'Credit Card',
        billingAddress: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
        },
      },
    },
    {
      id: 2,
      profile: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0124',
        dateOfBirth: '1990-09-22',
        gender: 'Female',
        maritalStatus: 'Single',
        avatar: '/api/placeholder/100/100',
        customerSince: '2021-07-10',
        status: 'active',
        customerType: 'Regular',
        source: 'Social Media',
      },
      demographics: {
        address: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'United States',
        },
        occupation: 'Marketing Manager',
        company: 'Creative Agency',
        annualIncome: '$60,000 - $75,000',
        education: 'Master\'s Degree',
        interests: ['Fashion', 'Beauty', 'Travel', 'Food'],
      },
      purchaseHistory: [
        {
          id: 4,
          date: '2024-12-10',
          orderNumber: 'ORD-2024-001200',
          items: 5,
          total: 599.99,
          status: 'shipped',
          products: ['Fashion Bundle', 'Beauty Kit', 'Accessories'],
        },
      ],
      loyalty: {
        tier: 'Silver',
        points: 7500,
        lifetimeValue: 8999.99,
        nextTierPoints: 2500,
        tierBenefits: [
          'Free shipping on orders over $50',
          'Birthday discount',
          'Newsletter with exclusive offers',
        ],
        rewards: [
          { name: 'Welcome Bonus', value: '$10', expiry: '2025-07-10' },
        ],
      },
      communication: {
        preferences: {
          email: true,
          sms: false,
          phone: false,
          push: true,
        },
        history: [
          {
            id: 4,
            date: '2024-12-11',
            type: 'email',
            subject: 'Order Shipped - ORD-2024-001200',
            status: 'sent',
            channel: 'Email',
          },
        ],
      },
      analytics: {
        totalOrders: 8,
        averageOrderValue: 749.99,
        lastPurchaseDate: '2024-12-10',
        purchaseFrequency: 'Quarterly',
        preferredCategories: ['Fashion', 'Beauty'],
        satisfactionRating: 4.5,
        lifetimeValue: 8999.99,
        churnRisk: 'Medium',
        predictedNextPurchase: '2025-03-10',
      },
      financial: {
        creditLimit: 3000,
        currentBalance: 0,
        paymentMethod: 'PayPal',
        creditScore: 720,
        paymentHistory: 'Good',
        preferredPayment: 'PayPal',
        billingAddress: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'United States',
        },
      },
    },
  ]);

  const [formData, setFormData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      maritalStatus: 'Single',
      status: 'active',
      customerType: 'Regular',
      source: 'Website',
    },
    demographics: {
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
      },
      occupation: '',
      company: '',
      annualIncome: '',
      education: '',
      interests: [],
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
      message: 'Customer saved successfully!',
      severity: 'success'
    });
    console.log('Saving customer data:', formData);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        maritalStatus: 'Single',
        status: 'active',
        customerType: 'Regular',
        source: 'Website',
      },
      demographics: {
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
        },
        occupation: '',
        company: '',
        annualIncome: '',
        education: '',
        interests: [],
      },
    });
    setDialogOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setDialogOpen(true);
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    setSnackbar({
      open: true,
      message: 'Customer deleted successfully',
      severity: 'success'
    });
  };

  const toggleCustomerStatus = (id) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? {
        ...customer,
        profile: {
          ...customer.profile,
          status: customer.profile.status === 'active' ? 'inactive' : 'active'
        }
      } : customer
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'premium': return 'warning';
      default: return 'default';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Gold': return 'warning';
      case 'Silver': return 'info';
      case 'Bronze': return 'secondary';
      default: return 'default';
    }
  };

  const renderCustomerList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Loyalty</TableCell>
            <TableCell>Analytics</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={customer.profile.avatar} sx={{ width: 48, height: 48 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {customer.profile.firstName} {customer.profile.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customer since {new Date(customer.profile.customerSince).getFullYear()}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{customer.profile.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.profile.phone}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Chip
                    label={customer.loyalty.tier}
                    color={getTierColor(customer.loyalty.tier)}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {customer.loyalty.points.toLocaleString()} points
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" color="primary">
                    ${customer.analytics.lifetimeValue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {customer.analytics.totalOrders} orders
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={customer.profile.status}
                  color={getStatusColor(customer.profile.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={customer.profile.status === 'active' ? 'Deactivate' : 'Activate'}>
                    <IconButton
                      size="small"
                      onClick={() => toggleCustomerStatus(customer.id)}
                    >
                      {customer.profile.status === 'active' ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCustomer(customer.id)}
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

  const renderCustomerDetails = (customer) => (
    <Grid container spacing={3}>
      {/* Profile & Demographics */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile & Demographics
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar src={customer.profile.avatar} sx={{ width: 80, height: 80 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {customer.profile.firstName} {customer.profile.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer.profile.customerType} Customer
                </Typography>
                <Chip
                  label={customer.loyalty.tier}
                  color={getTierColor(customer.loyalty.tier)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={customer.profile.email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={customer.profile.phone}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  value={`${customer.demographics.address.street}, ${customer.demographics.address.city}, ${customer.demographics.address.state} ${customer.demographics.address.zipCode}`}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={customer.demographics.occupation}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={customer.demographics.company}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Loyalty & Rewards */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Loyalty & Rewards
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" color="primary">
                {customer.loyalty.points.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Points Balance
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Progress to Next Tier
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(customer.loyalty.points / (customer.loyalty.points + customer.loyalty.nextTierPoints)) * 100} 
              />
              <Typography variant="caption" color="text.secondary">
                {customer.loyalty.nextTierPoints} points to next tier
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Tier Benefits
            </Typography>
            <List dense>
              {customer.loyalty.tierBenefits.map((benefit, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Available Rewards
            </Typography>
            {customer.loyalty.rewards.map((reward, index) => (
              <Chip
                key={index}
                label={`${reward.name}: ${reward.value}`}
                color="success"
                variant="outlined"
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Purchase History */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Purchase History
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Order #</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Products</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customer.purchaseHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          ${order.total}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={order.status === 'delivered' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {order.products.join(', ')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return renderCustomerList();
      case 1:
        return customers.length > 0 ? renderCustomerDetails(customers[0]) : (
          <Alert severity="info">Select a customer to view details</Alert>
        );
      case 2:
        return <CustomerSegmentation />;
      case 3:
        return <LoyaltyProgramManager />;
      default:
        return renderCustomerList();
    }
  };

  return (
    <Box sx={{ pt: 5, pb: 3, pl: 3, pr: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: '1.8rem', // Consistent with dashboard
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            Advanced Customer Master
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.875rem', // 14px - smaller secondary text
              fontWeight: 400,
              lineHeight: 1.4,
              mt: 0.5
            }}
          >
            Comprehensive customer relationship management and analytics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCustomer}
          >
            Add Customer
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
            icon={<Person />} 
            label="Customer List" 
            iconPosition="start"
          />
          <Tab 
            icon={<Analytics />} 
            label="Customer Details" 
            iconPosition="start"
          />
          <Tab 
            icon={<Assessment />} 
            label="Customer Segmentation" 
            iconPosition="start"
          />
          <Tab 
            icon={<Loyalty />} 
            label="Loyalty Programs" 
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.profile.firstName}
                onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.profile.lastName}
                onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.profile.email}
                onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.profile.phone}
                onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.profile.dateOfBirth}
                onChange={(e) => handleInputChange('profile', 'dateOfBirth', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.profile.gender}
                  label="Gender"
                  onChange={(e) => handleInputChange('profile', 'gender', e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            {editingCustomer ? 'Update' : 'Save'}
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

export default AdvancedCustomerMaster;
