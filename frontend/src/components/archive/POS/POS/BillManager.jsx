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
  Badge
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Delete,
  Search,
  Close,
  Save,
  Receipt,
  Warning,
  CheckCircle,
  Error,
  AttachMoney,
  Person,
  ShoppingCart,
  History,
  QrCode,
  Print,
  ExpandMore,
  Add,
  Remove,
  Edit,
  Restore,
  Visibility,
  AccessTime,
  LocalOffer,
  TrendingUp
} from '@mui/icons-material';

const BillManager = ({ open, onClose, session, onResumeBill }) => {
  const [heldBills, setHeldBills] = useState([]);
  const [activeBills, setActiveBills] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billDetailsDialog, setBillDetailsDialog] = useState(false);
  const [voidBillDialog, setVoidBillDialog] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  useEffect(() => {
    const mockHeldBills = [
      {
        id: 'HOLD001',
        customer: { name: 'John Doe', phone: '+91-9876543210' },
        items: [
          { name: 'Premium Widget A', quantity: 2, price: 150.00, total: 300.00 },
          { name: 'Standard Component B', quantity: 1, price: 75.00, total: 75.00 }
        ],
        total: 375.00,
        tax: 67.50,
        grandTotal: 442.50,
        holdTime: '2025-01-10 14:30:00',
        holdReason: 'Customer went to ATM',
        cashier: 'Jane Smith',
        status: 'held',
        expiryTime: '2025-01-10 16:30:00'
      },
      {
        id: 'HOLD002',
        customer: { name: 'ABC Corporation', phone: '+91-9876543211' },
        items: [
          { name: 'Advanced Module C', quantity: 1, price: 250.00, total: 250.00 }
        ],
        total: 250.00,
        tax: 45.00,
        grandTotal: 295.00,
        holdTime: '2025-01-10 15:15:00',
        holdReason: 'Checking product specifications',
        cashier: 'Mike Johnson',
        status: 'held',
        expiryTime: '2025-01-10 17:15:00'
      }
    ];

    const mockActiveBills = [
      {
        id: 'ACTIVE001',
        customer: { name: 'Sarah Wilson', phone: '+91-9876543212' },
        items: [
          { name: 'Testing Equipment D', quantity: 1, price: 500.00, total: 500.00 },
          { name: 'Quality Control Kit E', quantity: 2, price: 125.00, total: 250.00 }
        ],
        total: 750.00,
        tax: 135.00,
        grandTotal: 885.00,
        startTime: '2025-01-10 15:45:00',
        cashier: 'Alice Brown',
        status: 'active',
        sessionId: session.id
      }
    ];

    setHeldBills(mockHeldBills);
    setActiveBills(mockActiveBills);
  }, [session.id]);

  const filteredHeldBills = heldBills.filter(bill =>
    bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customer.phone.includes(searchTerm)
  );

  const filteredActiveBills = activeBills.filter(bill =>
    bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customer.phone.includes(searchTerm)
  );

  const handleResumeBill = (bill) => {
    if (onResumeBill) {
      onResumeBill(bill);
      setSnackbar({
        open: true,
        message: `Bill ${bill.id} resumed successfully`,
        severity: 'success'
      });
      onClose();
    }
  };

  const handleVoidBill = (bill) => {
    setSelectedBill(bill);
    setVoidBillDialog(true);
  };

  const confirmVoidBill = () => {
    if (!voidReason.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a reason for voiding the bill',
        severity: 'error'
      });
      return;
    }

    const voidedBill = {
      ...selectedBill,
      status: 'voided',
      voidReason: voidReason,
      voidTime: new Date().toISOString(),
      voidedBy: session.user.name
    };

    if (selectedBill.status === 'held') {
      setHeldBills(prev => prev.filter(bill => bill.id !== selectedBill.id));
    } else if (selectedBill.status === 'active') {
      setActiveBills(prev => prev.filter(bill => bill.id !== selectedBill.id));
    }

    setSnackbar({
      open: true,
      message: `Bill ${selectedBill.id} voided successfully`,
      severity: 'success'
    });

    setVoidBillDialog(false);
    setSelectedBill(null);
    setVoidReason('');
  };

  const handleDeleteBill = (bill) => {
    if (window.confirm(`Are you sure you want to permanently delete bill ${bill.id}?`)) {
      if (bill.status === 'held') {
        setHeldBills(prev => prev.filter(b => b.id !== bill.id));
      } else if (bill.status === 'active') {
        setActiveBills(prev => prev.filter(b => b.id !== bill.id));
      }

      setSnackbar({
        open: true,
        message: `Bill ${bill.id} deleted successfully`,
        severity: 'success'
      });
    }
  };

  const getBillStatusColor = (status) => {
    switch (status) {
      case 'held': return 'warning';
      case 'active': return 'success';
      case 'voided': return 'error';
      default: return 'default';
    }
  };

  const getBillStatusIcon = (status) => {
    switch (status) {
      case 'held': return <Pause />;
      case 'active': return <PlayArrow />;
      case 'voided': return <Stop />;
      default: return <Receipt />;
    }
  };

  const isBillExpired = (expiryTime) => {
    if (!expiryTime) return false;
    return new Date() > new Date(expiryTime);
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
            <Typography variant="h6">Bill Management</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Search */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search bills by ID, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<QrCode />}
                  fullWidth
                >
                  Scan Bill QR
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab 
                label={
                  <Badge badgeContent={heldBills.length} color="warning">
                    Held Bills
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={activeBills.length} color="success">
                    Active Bills
                  </Badge>
                } 
              />
              <Tab label="Bill History" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Held Bills Tab */}
            <Typography variant="h6" gutterBottom>
              Held Bills ({filteredHeldBills.length})
            </Typography>
            {filteredHeldBills.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Pause sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No held bills found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredHeldBills.map((bill) => (
                  <Grid item xs={12} key={bill.id}>
                    <Card 
                      sx={{ 
                        border: isBillExpired(bill.expiryTime) ? 2 : 1,
                        borderColor: isBillExpired(bill.expiryTime) ? 'error.main' : 'divider',
                        bgcolor: isBillExpired(bill.expiryTime) ? 'error.light' : 'background.paper'
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Avatar sx={{ bgcolor: 'warning.main' }}>
                                <Pause />
                              </Avatar>
                              <Box>
                                <Typography variant="h6">
                                  Bill #{bill.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {bill.customer.name} • {bill.customer.phone}
                                </Typography>
                              </Box>
                              <Chip
                                label={isBillExpired(bill.expiryTime) ? 'Expired' : 'Held'}
                                color={isBillExpired(bill.expiryTime) ? 'error' : 'warning'}
                                size="small"
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Hold Reason:</strong> {bill.holdReason}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Hold Time:</strong> {bill.holdTime}
                            </Typography>
                            {bill.expiryTime && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Expires:</strong> {bill.expiryTime}
                              </Typography>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'right', mb: 2 }}>
                              <Typography variant="h6" color="primary">
                                ₹{bill.grandTotal.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {bill.items.length} items
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<PlayArrow />}
                                onClick={() => handleResumeBill(bill)}
                                color="success"
                              >
                                Resume
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setBillDetailsDialog(true);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Stop />}
                                onClick={() => handleVoidBill(bill)}
                                color="error"
                              >
                                Void
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
            {/* Active Bills Tab */}
            <Typography variant="h6" gutterBottom>
              Active Bills ({filteredActiveBills.length})
            </Typography>
            {filteredActiveBills.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PlayArrow sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No active bills found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredActiveBills.map((bill) => (
                  <Grid item xs={12} key={bill.id}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Avatar sx={{ bgcolor: 'success.main' }}>
                                <PlayArrow />
                              </Avatar>
                              <Box>
                                <Typography variant="h6">
                                  Bill #{bill.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {bill.customer.name} • {bill.customer.phone}
                                </Typography>
                              </Box>
                              <Chip
                                label="Active"
                                color="success"
                                size="small"
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary">
                              <strong>Started:</strong> {bill.startTime}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'right', mb: 2 }}>
                              <Typography variant="h6" color="primary">
                                ₹{bill.grandTotal.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {bill.items.length} items
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setBillDetailsDialog(true);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Stop />}
                                onClick={() => handleVoidBill(bill)}
                                color="error"
                              >
                                Void
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

          <TabPanel value={tabValue} index={2}>
            {/* Bill History Tab */}
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <History sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Bill history and analytics coming soon
              </Typography>
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bill Details Dialog */}
      <Dialog open={billDetailsDialog} onClose={() => setBillDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Bill Details - {selectedBill?.id}
        </DialogTitle>
        <DialogContent>
          {selectedBill && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body1">{selectedBill.customer.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body1">{selectedBill.customer.phone}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip
                    label={selectedBill.status}
                    color={getBillStatusColor(selectedBill.status)}
                    icon={getBillStatusIcon(selectedBill.status)}
                  />
                </Box>
                {selectedBill.holdReason && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Hold Reason:</Typography>
                    <Typography variant="body1">{selectedBill.holdReason}</Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Bill Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Bill ID:</Typography>
                  <Typography variant="body1">{selectedBill.id}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Cashier:</Typography>
                  <Typography variant="body1">{selectedBill.cashier}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                  <Typography variant="h6" color="primary">₹{selectedBill.grandTotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Items Count:</Typography>
                  <Typography variant="body1">{selectedBill.items.length}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Items
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
                      {selectedBill.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">₹{item.total.toFixed(2)}</TableCell>
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
          <Button onClick={() => setBillDetailsDialog(false)}>Close</Button>
          {selectedBill?.status === 'held' && (
            <Button variant="contained" onClick={() => {
              handleResumeBill(selectedBill);
              setBillDetailsDialog(false);
            }}>
              Resume Bill
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Void Bill Dialog */}
      <Dialog open={voidBillDialog} onClose={() => setVoidBillDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Void Bill - {selectedBill?.id}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. The bill will be permanently voided.
          </Alert>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bill Amount: ₹{selectedBill?.grandTotal.toLocaleString()}
          </Typography>

          <TextField
            fullWidth
            label="Reason for voiding"
            multiline
            rows={3}
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            placeholder="Enter reason for voiding this bill..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoidBillDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmVoidBill}>
            Void Bill
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

export default BillManager;
