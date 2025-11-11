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
  CardGiftcard,
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
  Redeem,
  Send,
  Description,
  LocalOffer,
  ConfirmationNumber
} from '@mui/icons-material';

const GiftVoucherManager = ({ open, onClose, session, onVoucherRedemption }) => {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [newVoucherDialog, setNewVoucherDialog] = useState(false);
  const [voucherDetailsDialog, setVoucherDetailsDialog] = useState(false);
  const [redeemDialog, setRedeemDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [newVoucher, setNewVoucher] = useState({
    amount: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    message: '',
    expiryDate: '',
    type: 'gift'
  });

  const [redeemVoucher, setRedeemVoucher] = useState({
    voucherCode: '',
    amount: 0,
    customer: null
  });

  const voucherStatuses = [
    { id: 'all', name: 'All Vouchers', color: 'default' },
    { id: 'active', name: 'Active', color: 'success' },
    { id: 'redeemed', name: 'Redeemed', color: 'info' },
    { id: 'expired', name: 'Expired', color: 'warning' },
    { id: 'cancelled', name: 'Cancelled', color: 'error' }
  ];

  const voucherTypes = [
    { id: 'gift', name: 'Gift Voucher', description: 'General purpose gift voucher' },
    { id: 'discount', name: 'Discount Voucher', description: 'Percentage or fixed discount' },
    { id: 'promotional', name: 'Promotional Voucher', description: 'Special promotional offer' }
  ];

  // Mock vouchers data
  const mockVouchers = [
    {
      id: 'GV001',
      code: 'GIFT2025001',
      amount: 500.00,
      originalAmount: 500.00,
      type: 'gift',
      status: 'active',
      recipientName: 'Sarah Wilson',
      recipientEmail: 'sarah@email.com',
      recipientPhone: '+91-9876543210',
      message: 'Happy Birthday! Enjoy shopping with us.',
      issuedDate: '2025-01-08 10:30:00',
      expiryDate: '2025-07-08',
      redeemedDate: null,
      redeemedAmount: 0,
      redeemedBy: null,
      issuedBy: 'John Smith',
      lastUpdated: '2025-01-08 10:30:00'
    },
    {
      id: 'GV002',
      code: 'DISC2025002',
      amount: 200.00,
      originalAmount: 200.00,
      type: 'discount',
      status: 'redeemed',
      recipientName: 'ABC Corporation',
      recipientEmail: 'orders@abc.com',
      recipientPhone: '+91-9876543211',
      message: 'Thank you for your loyalty!',
      issuedDate: '2025-01-05 14:15:00',
      expiryDate: '2025-04-05',
      redeemedDate: '2025-01-09 16:20:00',
      redeemedAmount: 150.00,
      redeemedBy: 'Jane Doe',
      issuedBy: 'Mike Johnson',
      lastUpdated: '2025-01-09 16:20:00'
    },
    {
      id: 'GV003',
      code: 'PROMO2025003',
      amount: 1000.00,
      originalAmount: 1000.00,
      type: 'promotional',
      status: 'expired',
      recipientName: 'XYZ Industries',
      recipientEmail: 'contact@xyz.com',
      recipientPhone: '+91-9876543212',
      message: 'New Year Special Offer',
      issuedDate: '2024-12-20 09:00:00',
      expiryDate: '2025-01-05',
      redeemedDate: null,
      redeemedAmount: 0,
      redeemedBy: null,
      issuedBy: 'Alice Brown',
      lastUpdated: '2024-12-20 09:00:00'
    }
  ];

  useEffect(() => {
    if (open) {
      setVouchers(mockVouchers);
    }
  }, [open]);

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.recipientPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateVoucher = () => {
    const voucher = {
      id: `GV${String(vouchers.length + 1).padStart(3, '0')}`,
      code: `GIFT2025${String(vouchers.length + 1).padStart(3, '0')}`,
      ...newVoucher,
      amount: parseFloat(newVoucher.amount),
      originalAmount: parseFloat(newVoucher.amount),
      status: 'active',
      issuedDate: new Date().toISOString(),
      redeemedDate: null,
      redeemedAmount: 0,
      redeemedBy: null,
      issuedBy: session.user.name,
      lastUpdated: new Date().toISOString()
    };

    setVouchers(prev => [voucher, ...prev]);
    setNewVoucherDialog(false);
    setNewVoucher({
      amount: '',
      recipientName: '',
      recipientEmail: '',
      recipientPhone: '',
      message: '',
      expiryDate: '',
      type: 'gift'
    });

    setSnackbar({
      open: true,
      message: `Gift Voucher ${voucher.code} created successfully`,
      severity: 'success'
    });
  };

  const handleRedeemVoucher = () => {
    if (!redeemVoucher.voucherCode) {
      setSnackbar({
        open: true,
        message: 'Please enter voucher code',
        severity: 'error'
      });
      return;
    }

    const voucher = vouchers.find(v => v.code === redeemVoucher.voucherCode);
    if (!voucher) {
      setSnackbar({
        open: true,
        message: 'Voucher not found',
        severity: 'error'
      });
      return;
    }

    if (voucher.status !== 'active') {
      setSnackbar({
        open: true,
        message: 'Voucher is not active',
        severity: 'error'
      });
      return;
    }

    if (new Date() > new Date(voucher.expiryDate)) {
      setSnackbar({
        open: true,
        message: 'Voucher has expired',
        severity: 'error'
      });
      return;
    }

    const redeemAmount = Math.min(redeemVoucher.amount, voucher.amount);
    const updatedVoucher = {
      ...voucher,
      amount: voucher.amount - redeemAmount,
      status: voucher.amount - redeemAmount === 0 ? 'redeemed' : 'active',
      redeemedDate: voucher.amount - redeemAmount === 0 ? new Date().toISOString() : null,
      redeemedAmount: (voucher.redeemedAmount || 0) + redeemAmount,
      redeemedBy: session.user.name,
      lastUpdated: new Date().toISOString()
    };

    setVouchers(prev => prev.map(v => v.id === voucher.id ? updatedVoucher : v));

    if (onVoucherRedemption) {
      onVoucherRedemption({
        voucher: updatedVoucher,
        amount: redeemAmount,
        customer: redeemVoucher.customer
      });
    }

    setSnackbar({
      open: true,
      message: `Voucher ${voucher.code} redeemed for ₹${redeemAmount.toFixed(2)}`,
      severity: 'success'
    });

    setRedeemDialog(false);
    setRedeemVoucher({
      voucherCode: '',
      amount: 0,
      customer: null
    });
  };

  const getStatusColor = (status) => {
    const statusObj = voucherStatuses.find(s => s.id === status);
    return statusObj ? statusObj.color : 'default';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'gift': return <CardGiftcard />;
      case 'discount': return <LocalOffer />;
      case 'promotional': return <ConfirmationNumber />;
      default: return <CardGiftcard />;
    }
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
            <Typography variant="h6">Gift Voucher Management</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setNewVoucherDialog(true)}
              >
                New Voucher
              </Button>
              <Button
                variant="outlined"
                startIcon={<Redeem />}
                onClick={() => setRedeemDialog(true)}
              >
                Redeem Voucher
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
                  placeholder="Search vouchers by code, recipient name, email, or phone..."
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
                    {voucherStatuses.map((status) => (
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
                  Scan Voucher QR
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="All Vouchers" />
              <Tab label="Active Vouchers" />
              <Tab label="Redeemed Vouchers" />
              <Tab label="Voucher Analytics" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* All Vouchers Tab */}
            <Typography variant="h6" gutterBottom>
              All Vouchers ({filteredVouchers.length})
            </Typography>
            {filteredVouchers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CardGiftcard sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No vouchers found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredVouchers.map((voucher) => (
                  <Grid item xs={12} key={voucher.id}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {getTypeIcon(voucher.type)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6">
                                  {voucher.code}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {voucher.recipientName} • {voucher.recipientEmail}
                                </Typography>
                              </Box>
                              <Chip
                                label={voucher.status}
                                color={getStatusColor(voucher.status)}
                                size="small"
                              />
                              <Chip
                                label={voucher.type}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Issued:</strong> {voucher.issuedDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Expires:</strong> {voucher.expiryDate}
                            </Typography>
                            {voucher.redeemedDate && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Redeemed:</strong> {voucher.redeemedDate}
                              </Typography>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'right', mb: 2 }}>
                              <Typography variant="h6" color="primary">
                                ₹{voucher.amount.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Original: ₹{voucher.originalAmount.toLocaleString()}
                              </Typography>
                              {voucher.redeemedAmount > 0 && (
                                <Typography variant="body2" color="text.secondary">
                                  Redeemed: ₹{voucher.redeemedAmount.toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => {
                                  setSelectedVoucher(voucher);
                                  setVoucherDetailsDialog(true);
                                }}
                              >
                                View
                              </Button>
                              {voucher.status === 'active' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<Redeem />}
                                  onClick={() => {
                                    setRedeemVoucher(prev => ({
                                      ...prev,
                                      voucherCode: voucher.code,
                                      amount: voucher.amount
                                    }));
                                    setRedeemDialog(true);
                                  }}
                                >
                                  Redeem
                                </Button>
                              )}
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Print />}
                              >
                                Print
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
            {/* Active Vouchers Tab */}
            <Typography variant="h6" gutterBottom>
              Active Vouchers ({vouchers.filter(v => v.status === 'active').length})
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Redeemed Vouchers Tab */}
            <Typography variant="h6" gutterBottom>
              Redeemed Vouchers ({vouchers.filter(v => v.status === 'redeemed').length})
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Voucher Analytics Tab */}
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <TrendingUp sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Voucher analytics and insights coming soon
              </Typography>
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Voucher Details Dialog */}
      <Dialog open={voucherDetailsDialog} onClose={() => setVoucherDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Voucher Details - {selectedVoucher?.code}
        </DialogTitle>
        <DialogContent>
          {selectedVoucher && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Recipient Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body1">{selectedVoucher.recipientName}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body1">{selectedVoucher.recipientEmail}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body1">{selectedVoucher.recipientPhone}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Message:</Typography>
                  <Typography variant="body1">{selectedVoucher.message}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Voucher Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Code:</Typography>
                  <Typography variant="body1" fontWeight="medium">{selectedVoucher.code}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Type:</Typography>
                  <Chip
                    label={selectedVoucher.type}
                    icon={getTypeIcon(selectedVoucher.type)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip
                    label={selectedVoucher.status}
                    color={getStatusColor(selectedVoucher.status)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Current Amount:</Typography>
                  <Typography variant="h6" color="primary">₹{selectedVoucher.amount.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Original Amount:</Typography>
                  <Typography variant="body1">₹{selectedVoucher.originalAmount.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Issued Date:</Typography>
                  <Typography variant="body1">{selectedVoucher.issuedDate}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Expiry Date:</Typography>
                  <Typography variant="body1">{selectedVoucher.expiryDate}</Typography>
                </Box>
                {selectedVoucher.redeemedDate && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Redeemed Date:</Typography>
                    <Typography variant="body1">{selectedVoucher.redeemedDate}</Typography>
                  </Box>
                )}
                {selectedVoucher.redeemedAmount > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Redeemed Amount:</Typography>
                    <Typography variant="body1">₹{selectedVoucher.redeemedAmount.toLocaleString()}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoucherDetailsDialog(false)}>Close</Button>
          {selectedVoucher?.status === 'active' && (
            <Button variant="contained" onClick={() => {
              setRedeemVoucher(prev => ({
                ...prev,
                voucherCode: selectedVoucher.code,
                amount: selectedVoucher.amount
              }));
              setVoucherDetailsDialog(false);
              setRedeemDialog(true);
            }}>
              Redeem Voucher
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Redeem Voucher Dialog */}
      <Dialog open={redeemDialog} onClose={() => setRedeemDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Redeem Voucher</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Voucher Code"
                value={redeemVoucher.voucherCode}
                onChange={(e) => setRedeemVoucher(prev => ({ ...prev, voucherCode: e.target.value }))}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <QrCode />
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Redemption Amount"
                type="number"
                value={redeemVoucher.amount}
                onChange={(e) => setRedeemVoucher(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
                InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name (Optional)"
                value={redeemVoucher.customer?.name || ''}
                onChange={(e) => setRedeemVoucher(prev => ({
                  ...prev,
                  customer: { ...prev.customer, name: e.target.value }
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRedeemDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRedeemVoucher}>
            Redeem Voucher
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Voucher Dialog */}
      <Dialog open={newVoucherDialog} onClose={() => setNewVoucherDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Gift Voucher</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Voucher Amount"
                type="number"
                value={newVoucher.amount}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, amount: e.target.value }))}
                required
                InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Voucher Type</InputLabel>
                <Select
                  value={newVoucher.type}
                  onChange={(e) => setNewVoucher(prev => ({ ...prev, type: e.target.value }))}
                  label="Voucher Type"
                >
                  {voucherTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box>
                        <Typography variant="body2">{type.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipient Name"
                value={newVoucher.recipientName}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, recipientName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Recipient Email"
                type="email"
                value={newVoucher.recipientEmail}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, recipientEmail: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Recipient Phone"
                value={newVoucher.recipientPhone}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, recipientPhone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={newVoucher.expiryDate}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, expiryDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Personal Message"
                multiline
                rows={3}
                value={newVoucher.message}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal message for the recipient..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewVoucherDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateVoucher}>
            Create Voucher
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

export default GiftVoucherManager;
