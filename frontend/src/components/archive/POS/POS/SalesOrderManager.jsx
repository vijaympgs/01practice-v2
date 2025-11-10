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
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Assignment,
  Add,
  Edit,
  Delete,
  Search,
  Close,
  Save,
  Print,
  Email,
  Visibility,
  Person,
  ShoppingCart,
  AttachMoney,
  CalendarToday,
  LocationOn,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  Warning,
  TrendingUp,
  QrCode,
  Receipt,
  Description,
  Schedule
} from '@mui/icons-material';

const SalesOrderManager = ({ open, onClose, session, onConvertToSale }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrderDialog, setNewOrderDialog] = useState(false);
  const [orderDetailsDialog, setOrderDetailsDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [newOrder, setNewOrder] = useState({
    customer: null,
    items: [],
    deliveryDate: '',
    deliveryAddress: '',
    notes: '',
    priority: 'normal'
  });

  const orderStatuses = [
    { id: 'all', name: 'All Orders', color: 'default' },
    { id: 'pending', name: 'Pending', color: 'warning' },
    { id: 'confirmed', name: 'Confirmed', color: 'info' },
    { id: 'processing', name: 'Processing', color: 'primary' },
    { id: 'ready', name: 'Ready for Pickup', color: 'success' },
    { id: 'delivered', name: 'Delivered', color: 'success' },
    { id: 'cancelled', name: 'Cancelled', color: 'error' }
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: 'success' },
    { id: 'normal', name: 'Normal', color: 'info' },
    { id: 'high', name: 'High', color: 'warning' },
    { id: 'urgent', name: 'Urgent', color: 'error' }
  ];

  // Mock orders data
  const mockOrders = [
    {
      id: 'SO001',
      customer: { name: 'ABC Corporation', phone: '+91-9876543210', email: 'orders@abc.com' },
      items: [
        { id: 'P001', name: 'Premium Widget A', quantity: 10, unitPrice: 150.00, total: 1500.00 },
        { id: 'P002', name: 'Standard Component B', quantity: 5, unitPrice: 75.00, total: 375.00 }
      ],
      total: 1875.00,
      tax: 337.50,
      grandTotal: 2212.50,
      status: 'pending',
      priority: 'high',
      orderDate: '2025-01-10 09:30:00',
      deliveryDate: '2025-01-15',
      deliveryAddress: '123 Business Park, Mumbai - 400001',
      notes: 'Urgent order for client meeting',
      createdBy: 'John Smith',
      lastUpdated: '2025-01-10 09:30:00'
    },
    {
      id: 'SO002',
      customer: { name: 'XYZ Industries', phone: '+91-9876543211', email: 'procurement@xyz.com' },
      items: [
        { id: 'P003', name: 'Advanced Module C', quantity: 3, unitPrice: 250.00, total: 750.00 },
        { id: 'P004', name: 'Testing Equipment D', quantity: 1, unitPrice: 500.00, total: 500.00 }
      ],
      total: 1250.00,
      tax: 225.00,
      grandTotal: 1475.00,
      status: 'confirmed',
      priority: 'normal',
      orderDate: '2025-01-09 14:15:00',
      deliveryDate: '2025-01-12',
      deliveryAddress: '789 Industrial Area, Bangalore - 560001',
      notes: 'Regular monthly order',
      createdBy: 'Jane Doe',
      lastUpdated: '2025-01-09 16:20:00'
    },
    {
      id: 'SO003',
      customer: { name: 'John Doe', phone: '+91-9876543212', email: 'john@email.com' },
      items: [
        { id: 'P001', name: 'Premium Widget A', quantity: 2, unitPrice: 150.00, total: 300.00 }
      ],
      total: 300.00,
      tax: 54.00,
      grandTotal: 354.00,
      status: 'ready',
      priority: 'normal',
      orderDate: '2025-01-08 11:45:00',
      deliveryDate: '2025-01-10',
      deliveryAddress: '456 Residential Street, Delhi - 110001',
      notes: 'Customer pickup preferred',
      createdBy: 'Mike Johnson',
      lastUpdated: '2025-01-10 08:30:00'
    }
  ];

  useEffect(() => {
    if (open) {
      setOrders(mockOrders);
    }
  }, [open]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.phone.includes(searchTerm) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = () => {
    const order = {
      id: `SO${String(orders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      total: newOrder.items.reduce((sum, item) => sum + item.total, 0),
      tax: newOrder.items.reduce((sum, item) => sum + item.total, 0) * 0.18,
      grandTotal: newOrder.items.reduce((sum, item) => sum + item.total, 0) * 1.18,
      status: 'pending',
      orderDate: new Date().toISOString(),
      createdBy: session.user.name,
      lastUpdated: new Date().toISOString()
    };

    setOrders(prev => [order, ...prev]);
    setNewOrderDialog(false);
    setNewOrder({
      customer: null,
      items: [],
      deliveryDate: '',
      deliveryAddress: '',
      notes: '',
      priority: 'normal'
    });

    setSnackbar({
      open: true,
      message: `Sales Order ${order.id} created successfully`,
      severity: 'success'
    });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, lastUpdated: new Date().toISOString() }
        : order
    ));

    setSnackbar({
      open: true,
      message: `Order ${orderId} status updated to ${newStatus}`,
      severity: 'success'
    });
  };

  const handleConvertToSale = (order) => {
    if (onConvertToSale) {
      onConvertToSale(order);
      setSnackbar({
        open: true,
        message: `Order ${order.id} converted to sale`,
        severity: 'success'
      });
      onClose();
    }
  };

  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find(s => s.id === status);
    return statusObj ? statusObj.color : 'default';
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.id === priority);
    return priorityObj ? priorityObj.color : 'default';
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
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Sales Order Management</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setNewOrderDialog(true)}
              >
                New Order
              </Button>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Search and Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search orders by ID, customer name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    {orderStatuses.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<QrCode />}
                  fullWidth
                >
                  Scan Order QR
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="All Orders" />
              <Tab label="Pending Orders" />
              <Tab label="Ready Orders" />
              <Tab label="Order Analytics" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* All Orders Tab */}
            <Typography variant="h6" gutterBottom>
              All Orders ({filteredOrders.length})
            </Typography>
            {filteredOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No orders found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredOrders.map((order) => (
                  <Grid item xs={12} key={order.id}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <Assignment />
                              </Avatar>
                              <Box>
                                <Typography variant="h6">
                                  Order #{order.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {order.customer.name} • {order.customer.phone}
                                </Typography>
                              </Box>
                              <Chip
                                label={order.status.replace('_', ' ')}
                                color={getStatusColor(order.status)}
                                size="small"
                              />
                              <Chip
                                label={order.priority}
                                color={getPriorityColor(order.priority)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Order Date:</strong> {order.orderDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Delivery Date:</strong> {order.deliveryDate}
                            </Typography>
                            {order.notes && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Notes:</strong> {order.notes}
                              </Typography>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'right', mb: 2 }}>
                              <Typography variant="h6" color="primary">
                                ₹{order.grandTotal.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {order.items.length} items
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOrderDetailsDialog(true);
                                }}
                              >
                                View
                              </Button>
                              {order.status === 'ready' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<ShoppingCart />}
                                  onClick={() => handleConvertToSale(order)}
                                >
                                  Convert to Sale
                                </Button>
                              )}
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Edit />}
                              >
                                Edit
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Pending Orders Tab */}
            <Typography variant="h6" gutterBottom>
              Pending Orders ({orders.filter(o => o.status === 'pending').length})
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Ready Orders Tab */}
            <Typography variant="h6" gutterBottom>
              Ready for Pickup ({orders.filter(o => o.status === 'ready').length})
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Order Analytics Tab */}
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <TrendingUp sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Order analytics and insights coming soon
              </Typography>
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsDialog} onClose={() => setOrderDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details - {selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body1">{selectedOrder.customer.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body1">{selectedOrder.customer.phone}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body1">{selectedOrder.customer.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Delivery Address:</Typography>
                  <Typography variant="body1">{selectedOrder.deliveryAddress}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                  <Typography variant="body1">{selectedOrder.orderDate}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Delivery Date:</Typography>
                  <Typography variant="body1">{selectedOrder.deliveryDate}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip
                    label={selectedOrder.status}
                    color={getStatusColor(selectedOrder.status)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Priority:</Typography>
                  <Chip
                    label={selectedOrder.priority}
                    color={getPriorityColor(selectedOrder.priority)}
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                  <Typography variant="h6" color="primary">₹{selectedOrder.grandTotal.toLocaleString()}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">₹{item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">₹{item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {selectedOrder.notes && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1">{selectedOrder.notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailsDialog(false)}>Close</Button>
          {selectedOrder?.status === 'ready' && (
            <Button variant="contained" onClick={() => {
              handleConvertToSale(selectedOrder);
              setOrderDetailsDialog(false);
            }}>
              Convert to Sale
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* New Order Dialog */}
      <Dialog open={newOrderDialog} onClose={() => setNewOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Sales Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newOrder.customer?.name || ''}
                onChange={(e) => setNewOrder(prev => ({
                  ...prev,
                  customer: { ...prev.customer, name: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newOrder.customer?.phone || ''}
                onChange={(e) => setNewOrder(prev => ({
                  ...prev,
                  customer: { ...prev.customer, phone: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newOrder.customer?.email || ''}
                onChange={(e) => setNewOrder(prev => ({
                  ...prev,
                  customer: { ...prev.customer, email: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Delivery Date"
                type="date"
                value={newOrder.deliveryDate}
                onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newOrder.priority}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priority"
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.id} value={priority.id}>
                      {priority.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address"
                multiline
                rows={2}
                value={newOrder.deliveryAddress}
                onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryAddress: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newOrder.notes}
                onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions or notes..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewOrderDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOrder}>
            Create Order
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

export default SalesOrderManager;
