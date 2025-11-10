import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import {
  Person,
  Add,
  Edit,
  Delete,
  Search,
  Close,
  Save,
  Phone,
  Email,
  LocationOn,
  CreditCard,
  History,
  Star,
  Loyalty,
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  CalendarToday,
  Visibility,
  QrCode
} from '@mui/icons-material';

const CustomerManager = ({ open, onClose, onCustomerSelect, selectedCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [newCustomerDialog, setNewCustomerDialog] = useState(false);
  const [customerDetailsDialog, setCustomerDetailsDialog] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'individual',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    preferences: {
      notifications: true,
      loyaltyProgram: false,
      marketing: false
    }
  });

  // Mock data
  useEffect(() => {
    const mockCustomers = [
      {
        id: 'C001',
        name: 'ABC Corporation',
        phone: '+91-9876543210',
        email: 'contact@abc.com',
        type: 'Corporate',
        address: {
          street: '123 Business Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        joinDate: '2024-01-15',
        totalPurchases: 125000,
        totalOrders: 45,
        lastPurchase: '2025-01-08',
        loyaltyPoints: 1250,
        status: 'Active',
        preferences: {
          notifications: true,
          loyaltyProgram: true,
          marketing: true
        },
        purchaseHistory: [
          { date: '2025-01-08', amount: 2500, items: 3 },
          { date: '2024-12-20', amount: 1800, items: 2 },
          { date: '2024-11-15', amount: 3200, items: 5 }
        ]
      },
      {
        id: 'C002',
        name: 'John Doe',
        phone: '+91-9876543211',
        email: 'john@email.com',
        type: 'Individual',
        address: {
          street: '456 Residential Street',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        joinDate: '2024-03-10',
        totalPurchases: 45000,
        totalOrders: 18,
        lastPurchase: '2025-01-05',
        loyaltyPoints: 450,
        status: 'Active',
        preferences: {
          notifications: true,
          loyaltyProgram: true,
          marketing: false
        },
        purchaseHistory: [
          { date: '2025-01-05', amount: 1200, items: 2 },
          { date: '2024-12-28', amount: 800, items: 1 },
          { date: '2024-11-20', amount: 1500, items: 3 }
        ]
      },
      {
        id: 'C003',
        name: 'XYZ Industries',
        phone: '+91-9876543212',
        email: 'info@xyz.com',
        type: 'Corporate',
        address: {
          street: '789 Industrial Area',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        joinDate: '2024-02-20',
        totalPurchases: 89000,
        totalOrders: 32,
        lastPurchase: '2024-12-15',
        loyaltyPoints: 890,
        status: 'Active',
        preferences: {
          notifications: false,
          loyaltyProgram: true,
          marketing: true
        },
        purchaseHistory: [
          { date: '2024-12-15', amount: 3200, items: 4 },
          { date: '2024-11-10', amount: 2800, items: 3 },
          { date: '2024-10-05', amount: 1900, items: 2 }
        ]
      }
    ];

    setCustomers(mockCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || customer.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateCustomer = () => {
    const customer = {
      id: `C${String(customers.length + 1).padStart(3, '0')}`,
      ...newCustomer,
      joinDate: new Date().toISOString().split('T')[0],
      totalPurchases: 0,
      totalOrders: 0,
      lastPurchase: null,
      loyaltyPoints: 0,
      status: 'Active',
      purchaseHistory: []
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomerDialog(false);
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      type: 'individual',
      address: { street: '', city: '', state: '', pincode: '' },
      preferences: { notifications: true, loyaltyProgram: false, marketing: false }
    });

    setSnackbar({
      open: true,
      message: 'Customer created successfully',
      severity: 'success'
    });
  };

  const handleSelectCustomer = (customer) => {
    onCustomerSelect(customer);
    setSnackbar({
      open: true,
      message: `${customer.name} selected`,
      severity: 'success'
    });
  };

  const handleViewCustomerDetails = (customer) => {
    setSelectedCustomerDetails(customer);
    setCustomerDetailsDialog(true);
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Customer Management</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setNewCustomerDialog(true)}
              >
                New Customer
              </Button>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Search and Filter */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Customer Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Customer Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="corporate">Corporate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<QrCode />}
                  fullWidth
                >
                  Scan Customer Card
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="All Customers" />
              <Tab label="Recent Customers" />
              <Tab label="Loyalty Members" />
              <Tab label="Corporate Clients" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* All Customers */}
            <Grid container spacing={2}>
              {filteredCustomers.map((customer) => (
                <Grid item xs={12} sm={6} md={4} key={customer.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedCustomer?.id === customer.id ? 2 : 1,
                      borderColor: selectedCustomer?.id === customer.id ? 'primary.main' : 'divider'
                    }}
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Person />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" noWrap>
                            {customer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {customer.type}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCustomerDetails(customer);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" />
                          {customer.phone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" />
                          {customer.email}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={`₹${customer.totalPurchases.toLocaleString()}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {customer.loyaltyPoints > 0 && (
                          <Chip
                            label={`${customer.loyaltyPoints} pts`}
                            size="small"
                            color="warning"
                            icon={<Star />}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Recent Customers */}
            <Typography variant="body2" color="text.secondary">
              Customers with recent purchases (last 30 days)
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Loyalty Members */}
            <Typography variant="body2" color="text.secondary">
              Customers enrolled in loyalty program
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Corporate Clients */}
            <Typography variant="body2" color="text.secondary">
              Corporate customers with business accounts
            </Typography>
          </TabPanel>
        </DialogContent>
      </Dialog>

      {/* New Customer Dialog */}
      <Dialog open={newCustomerDialog} onClose={() => setNewCustomerDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Customer Type</InputLabel>
                <Select
                  value={newCustomer.type}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, type: e.target.value }))}
                  label="Customer Type"
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={newCustomer.address.street}
                onChange={(e) => setNewCustomer(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={newCustomer.address.city}
                onChange={(e) => setNewCustomer(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pincode"
                value={newCustomer.address.pincode}
                onChange={(e) => setNewCustomer(prev => ({
                  ...prev,
                  address: { ...prev.address, pincode: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Preferences
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newCustomer.preferences.notifications}
                    onChange={(e) => setNewCustomer(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, notifications: e.target.checked }
                    }))}
                  />
                }
                label="Receive notifications"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newCustomer.preferences.loyaltyProgram}
                    onChange={(e) => setNewCustomer(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, loyaltyProgram: e.target.checked }
                    }))}
                  />
                }
                label="Enroll in loyalty program"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCustomerDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCustomer}>
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={customerDetailsDialog} onClose={() => setCustomerDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Customer Details - {selectedCustomerDetails?.name}
        </DialogTitle>
        <DialogContent>
          {selectedCustomerDetails && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body1">{selectedCustomerDetails.phone}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body1">{selectedCustomerDetails.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Type:</Typography>
                  <Chip label={selectedCustomerDetails.type} size="small" />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Join Date:</Typography>
                  <Typography variant="body1">{selectedCustomerDetails.joinDate}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Purchase Statistics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Purchases:</Typography>
                  <Typography variant="h6" color="primary">₹{selectedCustomerDetails.totalPurchases.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Orders:</Typography>
                  <Typography variant="body1">{selectedCustomerDetails.totalOrders}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Loyalty Points:</Typography>
                  <Typography variant="h6" color="warning.main">{selectedCustomerDetails.loyaltyPoints}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Last Purchase:</Typography>
                  <Typography variant="body1">{selectedCustomerDetails.lastPurchase || 'Never'}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Recent Purchase History
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="center">Items</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCustomerDetails.purchaseHistory.map((purchase, index) => (
                        <TableRow key={index}>
                          <TableCell>{purchase.date}</TableCell>
                          <TableCell align="right">₹{purchase.amount.toLocaleString()}</TableCell>
                          <TableCell align="center">{purchase.items}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomerDetailsDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => {
            handleSelectCustomer(selectedCustomerDetails);
            setCustomerDetailsDialog(false);
          }}>
            Select Customer
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default CustomerManager;
