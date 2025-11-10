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
  Schedule,
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
  AttachMoney,
  CalendarToday,
  QrCode,
  Receipt,
  CheckCircle,
  Cancel,
  Warning,
  TrendingUp,
  Payment,
  Send,
  Description,
  LocalOffer,
  ConfirmationNumber,
  AccountBalanceWallet,
  Timeline
} from '@mui/icons-material';

const LayawayManager = ({ open, onClose, session, onLayawayCompletion }) => {
  const [layaways, setLayaways] = useState([]);
  const [selectedLayaway, setSelectedLayaway] = useState(null);
  const [newLayawayDialog, setNewLayawayDialog] = useState(false);
  const [layawayDetailsDialog, setLayawayDetailsDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [newLayaway, setNewLayaway] = useState({
    customer: null,
    items: [],
    totalAmount: 0,
    depositAmount: 0,
    balanceAmount: 0,
    paymentSchedule: 'weekly',
    dueDate: '',
    notes: ''
  });

  const [payment, setPayment] = useState({
    amount: 0,
    method: 'cash',
    notes: ''
  });

  const layawayStatuses = [
    { id: 'all', name: 'All Layaways', color: 'default' },
    { id: 'active', name: 'Active', color: 'info' },
    { id: 'completed', name: 'Completed', color: 'success' },
    { id: 'cancelled', name: 'Cancelled', color: 'error' },
    { id: 'overdue', name: 'Overdue', color: 'warning' }
  ];

  const paymentSchedules = [
    { id: 'weekly', name: 'Weekly', description: 'Payments every week' },
    { id: 'biweekly', name: 'Bi-weekly', description: 'Payments every two weeks' },
    { id: 'monthly', name: 'Monthly', description: 'Payments every month' },
    { id: 'custom', name: 'Custom', description: 'Custom payment schedule' }
  ];

  // Mock layaways data
  const mockLayaways = [
    {
      id: 'LA001',
      customer: { name: 'John Smith', phone: '+91-9876543210', email: 'john@email.com' },
      items: [
        { id: 'P001', name: 'Premium Widget A', quantity: 2, unitPrice: 150.00, total: 300.00 },
        { id: 'P002', name: 'Standard Component B', quantity: 1, unitPrice: 75.00, total: 75.00 }
      ],
      totalAmount: 375.00,
      tax: 67.50,
      grandTotal: 442.50,
      depositAmount: 88.50,
      balanceAmount: 354.00,
      paidAmount: 88.50,
      paymentSchedule: 'weekly',
      dueDate: '2025-02-10',
      status: 'active',
      startDate: '2025-01-10 14:30:00',
      lastPaymentDate: '2025-01-10 14:30:00',
      nextPaymentDate: '2025-01-17',
      payments: [
        {
          id: 'PAY001',
          amount: 88.50,
          method: 'cash',
          date: '2025-01-10 14:30:00',
          type: 'deposit',
          processedBy: 'Jane Doe'
        }
      ],
      notes: 'Customer prefers weekly payments',
      createdBy: 'Jane Doe',
      lastUpdated: '2025-01-10 14:30:00'
    },
    {
      id: 'LA002',
      customer: { name: 'Sarah Wilson', phone: '+91-9876543211', email: 'sarah@email.com' },
      items: [
        { id: 'P003', name: 'Advanced Module C', quantity: 1, unitPrice: 250.00, total: 250.00 }
      ],
      totalAmount: 250.00,
      tax: 45.00,
      grandTotal: 295.00,
      depositAmount: 59.00,
      balanceAmount: 236.00,
      paidAmount: 295.00,
      paymentSchedule: 'monthly',
      dueDate: '2025-03-15',
      status: 'completed',
      startDate: '2024-12-15 10:15:00',
      lastPaymentDate: '2025-01-15 16:20:00',
      nextPaymentDate: null,
      payments: [
        {
          id: 'PAY002',
          amount: 59.00,
          method: 'card',
          date: '2024-12-15 10:15:00',
          type: 'deposit',
          processedBy: 'Mike Johnson'
        },
        {
          id: 'PAY003',
          amount: 118.00,
          method: 'cash',
          date: '2025-01-15 16:20:00',
          type: 'payment',
          processedBy: 'Alice Brown'
        },
        {
          id: 'PAY004',
          amount: 118.00,
          method: 'upi',
          date: '2025-01-15 16:20:00',
          type: 'final_payment',
          processedBy: 'Alice Brown'
        }
      ],
      notes: 'Completed early',
      createdBy: 'Mike Johnson',
      lastUpdated: '2025-01-15 16:20:00'
    }
  ];

  useEffect(() => {
    if (open) {
      setLayaways(mockLayaways);
    }
  }, [open]);

  const filteredLayaways = layaways.filter(layaway => {
    const matchesSearch = layaway.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         layaway.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         layaway.customer.phone.includes(searchTerm) ||
                         layaway.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || layaway.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateLayaway = () => {
    const layaway = {
      id: `LA${String(layaways.length + 1).padStart(3, '0')}`,
      ...newLayaway,
      tax: newLayaway.totalAmount * 0.18,
      grandTotal: newLayaway.totalAmount * 1.18,
      balanceAmount: (newLayaway.totalAmount * 1.18) - newLayaway.depositAmount,
      paidAmount: newLayaway.depositAmount,
      status: 'active',
      startDate: new Date().toISOString(),
      lastPaymentDate: new Date().toISOString(),
      nextPaymentDate: calculateNextPaymentDate(newLayaway.paymentSchedule),
      payments: [
        {
          id: `PAY${Date.now()}`,
          amount: newLayaway.depositAmount,
          method: 'cash',
          date: new Date().toISOString(),
          type: 'deposit',
          processedBy: session.user.name
        }
      ],
      createdBy: session.user.name,
      lastUpdated: new Date().toISOString()
    };

    setLayaways(prev => [layaway, ...prev]);
    setNewLayawayDialog(false);
    setNewLayaway({
      customer: null,
      items: [],
      totalAmount: 0,
      depositAmount: 0,
      balanceAmount: 0,
      paymentSchedule: 'weekly',
      dueDate: '',
      notes: ''
    });

    setSnackbar({
      open: true,
      message: `Layaway ${layaway.id} created successfully`,
      severity: 'success'
    });
  };

  const handleMakePayment = (layawayId) => {
    const layaway = layaways.find(l => l.id === layawayId);
    if (!layaway) return;

    setSelectedLayaway(layaway);
    setPayment({
      amount: Math.min(payment.amount || layaway.balanceAmount, layaway.balanceAmount),
      method: 'cash',
      notes: ''
    });
    setPaymentDialog(true);
  };

  const processPayment = () => {
    if (!selectedLayaway || payment.amount <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid payment amount',
        severity: 'error'
      });
      return;
    }

    const newPayment = {
      id: `PAY${Date.now()}`,
      amount: payment.amount,
      method: payment.method,
      date: new Date().toISOString(),
      type: selectedLayaway.paidAmount + payment.amount >= selectedLayaway.grandTotal ? 'final_payment' : 'payment',
      processedBy: session.user.name,
      notes: payment.notes
    };

    const updatedLayaway = {
      ...selectedLayaway,
      paidAmount: selectedLayaway.paidAmount + payment.amount,
      balanceAmount: selectedLayaway.balanceAmount - payment.amount,
      status: selectedLayaway.balanceAmount - payment.amount <= 0 ? 'completed' : 'active',
      lastPaymentDate: new Date().toISOString(),
      nextPaymentDate: selectedLayaway.balanceAmount - payment.amount <= 0 ? null : calculateNextPaymentDate(selectedLayaway.paymentSchedule),
      payments: [...selectedLayaway.payments, newPayment],
      lastUpdated: new Date().toISOString()
    };

    setLayaways(prev => prev.map(l => l.id === selectedLayaway.id ? updatedLayaway : l));

    if (updatedLayaway.status === 'completed' && onLayawayCompletion) {
      onLayawayCompletion(updatedLayaway);
    }

    setSnackbar({
      open: true,
      message: `Payment of ₹${payment.amount.toFixed(2)} processed successfully`,
      severity: 'success'
    });

    setPaymentDialog(false);
    setSelectedLayaway(null);
    setPayment({
      amount: 0,
      method: 'cash',
      notes: ''
    });
  };

  const calculateNextPaymentDate = (schedule) => {
    const now = new Date();
    switch (schedule) {
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case 'biweekly':
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().split('T')[0];
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
  };

  const getStatusColor = (status) => {
    const statusObj = layawayStatuses.find(s => s.id === status);
    return statusObj ? statusObj.color : 'default';
  };

  const getPaymentProgress = (layaway) => {
    return (layaway.paidAmount / layaway.grandTotal) * 100;
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
            <Typography variant="h6">Layaway Management</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setNewLayawayDialog(true)}
              >
                New Layaway
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
                  placeholder="Search layaways by ID, customer name, phone, or email..."
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
                    {layawayStatuses.map((status) => (
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
                  Scan Layaway QR
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="All Layaways" />
              <Tab label="Active Layaways" />
              <Tab label="Payment Due" />
              <Tab label="Completed Layaways" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* All Layaways Tab */}
            <Typography variant="h6" gutterBottom>
              All Layaways ({filteredLayaways.length})
            </Typography>
            {filteredLayaways.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Schedule sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No layaways found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredLayaways.map((layaway) => (
                  <Grid item xs={12} key={layaway.id}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <Schedule />
                              </Avatar>
                              <Box>
                                <Typography variant="h6">
                                  Layaway #{layaway.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {layaway.customer.name} • {layaway.customer.phone}
                                </Typography>
                              </Box>
                              <Chip
                                label={layaway.status}
                                color={getStatusColor(layaway.status)}
                                size="small"
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Due Date:</strong> {layaway.dueDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Next Payment:</strong> {layaway.nextPaymentDate || 'N/A'}
                            </Typography>
                            
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Payment Progress
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={getPaymentProgress(layaway)}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                ₹{layaway.paidAmount.toFixed(2)} / ₹{layaway.grandTotal.toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'right', mb: 2 }}>
                              <Typography variant="h6" color="primary">
                                ₹{layaway.grandTotal.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Balance: ₹{layaway.balanceAmount.toFixed(2)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Paid: ₹{layaway.paidAmount.toFixed(2)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => {
                                  setSelectedLayaway(layaway);
                                  setLayawayDetailsDialog(true);
                                }}
                              >
                                View
                              </Button>
                              {layaway.status === 'active' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<Payment />}
                                  onClick={() => handleMakePayment(layaway.id)}
                                >
                                  Payment
                                </Button>
                              )}
                              {layaway.status === 'completed' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<CheckCircle />}
                                  onClick={() => {
                                    if (onLayawayCompletion) {
                                      onLayawayCompletion(layaway);
                                    }
                                  }}
                                >
                                  Complete
                                </Button>
                              )}
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
            {/* Active Layaways Tab */}
            <Typography variant="h6" gutterBottom>
              Active Layaways ({layaways.filter(l => l.status === 'active').length})
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Payment Due Tab */}
            <Typography variant="h6" gutterBottom>
              Payment Due ({layaways.filter(l => l.status === 'active' && new Date(l.nextPaymentDate) <= new Date()).length})
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Completed Layaways Tab */}
            <Typography variant="h6" gutterBottom>
              Completed Layaways ({layaways.filter(l => l.status === 'completed').length})
            </Typography>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Layaway Details Dialog */}
      <Dialog open={layawayDetailsDialog} onClose={() => setLayawayDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Layaway Details - {selectedLayaway?.id}
        </DialogTitle>
        <DialogContent>
          {selectedLayaway && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body1">{selectedLayaway.customer.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body1">{selectedLayaway.customer.phone}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body1">{selectedLayaway.customer.email}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Layaway Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                  <Typography variant="h6" color="primary">₹{selectedLayaway.grandTotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Paid Amount:</Typography>
                  <Typography variant="body1">₹{selectedLayaway.paidAmount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Balance Amount:</Typography>
                  <Typography variant="body1" color="warning.main">₹{selectedLayaway.balanceAmount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip
                    label={selectedLayaway.status}
                    color={getStatusColor(selectedLayaway.status)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Due Date:</Typography>
                  <Typography variant="body1">{selectedLayaway.dueDate}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Next Payment:</Typography>
                  <Typography variant="body1">{selectedLayaway.nextPaymentDate || 'N/A'}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Payment History
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Processed By</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedLayaway.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>
                            <Chip
                              label={payment.type.replace('_', ' ')}
                              size="small"
                              color={payment.type === 'deposit' ? 'primary' : 'success'}
                            />
                          </TableCell>
                          <TableCell>{payment.processedBy}</TableCell>
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
          <Button onClick={() => setLayawayDetailsDialog(false)}>Close</Button>
          {selectedLayaway?.status === 'active' && (
            <Button variant="contained" onClick={() => {
              handleMakePayment(selectedLayaway.id);
              setLayawayDetailsDialog(false);
            }}>
              Make Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Make Payment - {selectedLayaway?.id}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Balance Amount: ₹{selectedLayaway?.balanceAmount.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Amount"
                type="number"
                value={payment.amount}
                onChange={(e) => setPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
                InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={payment.method}
                  onChange={(e) => setPayment(prev => ({ ...prev, method: e.target.value }))}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (Optional)"
                multiline
                rows={2}
                value={payment.notes}
                onChange={(e) => setPayment(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={processPayment}>
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Layaway Dialog */}
      <Dialog open={newLayawayDialog} onClose={() => setNewLayawayDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Layaway</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newLayaway.customer?.name || ''}
                onChange={(e) => setNewLayaway(prev => ({
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
                value={newLayaway.customer?.phone || ''}
                onChange={(e) => setNewLayaway(prev => ({
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
                value={newLayaway.customer?.email || ''}
                onChange={(e) => setNewLayaway(prev => ({
                  ...prev,
                  customer: { ...prev.customer, email: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Amount"
                type="number"
                value={newLayaway.totalAmount}
                onChange={(e) => {
                  const total = parseFloat(e.target.value) || 0;
                  const deposit = total * 0.2; // 20% deposit
                  setNewLayaway(prev => ({
                    ...prev,
                    totalAmount: total,
                    depositAmount: deposit,
                    balanceAmount: total - deposit
                  }));
                }}
                required
                InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deposit Amount"
                type="number"
                value={newLayaway.depositAmount}
                onChange={(e) => {
                  const deposit = parseFloat(e.target.value) || 0;
                  setNewLayaway(prev => ({
                    ...prev,
                    depositAmount: deposit,
                    balanceAmount: prev.totalAmount - deposit
                  }));
                }}
                required
                InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Schedule</InputLabel>
                <Select
                  value={newLayaway.paymentSchedule}
                  onChange={(e) => setNewLayaway(prev => ({ ...prev, paymentSchedule: e.target.value }))}
                  label="Payment Schedule"
                >
                  {paymentSchedules.map((schedule) => (
                    <MenuItem key={schedule.id} value={schedule.id}>
                      <Box>
                        <Typography variant="body2">{schedule.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {schedule.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={newLayaway.dueDate}
                onChange={(e) => setNewLayaway(prev => ({ ...prev, dueDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newLayaway.notes}
                onChange={(e) => setNewLayaway(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions or notes..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewLayawayDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateLayaway}>
            Create Layaway
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

export default LayawayManager;
