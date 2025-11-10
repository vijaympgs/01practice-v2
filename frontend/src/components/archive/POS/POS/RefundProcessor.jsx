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
  AccordionDetails
} from '@mui/material';
import {
  AssignmentReturn,
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
  Delete
} from '@mui/icons-material';

const RefundProcessor = ({ open, onClose, session }) => {
  const [refundType, setRefundType] = useState('with_receipt');
  const [originalSale, setOriginalSale] = useState(null);
  const [refundItems, setRefundItems] = useState([]);
  const [refundReason, setRefundReason] = useState('');
  const [refundMethod, setRefundMethod] = useState('original');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [processing, setProcessing] = useState(false);

  // Mock sales data
  const mockSales = [
    {
      id: 'SALE001',
      date: '2025-01-10',
      time: '14:30',
      customer: { name: 'John Doe', phone: '+91-9876543210' },
      items: [
        { id: 'P001', name: 'Premium Widget A', quantity: 2, price: 150.00, total: 300.00 },
        { id: 'P002', name: 'Standard Component B', quantity: 1, price: 75.00, total: 75.00 }
      ],
      total: 375.00,
      tax: 67.50,
      grandTotal: 442.50,
      payment: { method: 'Cash', amount: 442.50, change: 0 },
      cashier: 'Jane Smith',
      status: 'completed'
    },
    {
      id: 'SALE002',
      date: '2025-01-09',
      time: '16:45',
      customer: { name: 'ABC Corporation', phone: '+91-9876543211' },
      items: [
        { id: 'P003', name: 'Advanced Module C', quantity: 1, price: 250.00, total: 250.00 },
        { id: 'P004', name: 'Testing Equipment D', quantity: 1, price: 500.00, total: 500.00 }
      ],
      total: 750.00,
      tax: 135.00,
      grandTotal: 885.00,
      payment: { method: 'Card', amount: 885.00 },
      cashier: 'Mike Johnson',
      status: 'completed'
    }
  ];

  const refundReasons = [
    'Defective Product',
    'Wrong Item',
    'Customer Changed Mind',
    'Product Not as Described',
    'Size/Color Issue',
    'Duplicate Purchase',
    'Damaged in Transit',
    'Other'
  ];

  const refundMethods = [
    { id: 'original', name: 'Original Payment Method', description: 'Refund to original payment method' },
    { id: 'cash', name: 'Cash Refund', description: 'Refund in cash' },
    { id: 'credit_note', name: 'Credit Note', description: 'Issue store credit' },
    { id: 'exchange', name: 'Exchange', description: 'Exchange for different items' }
  ];

  useEffect(() => {
    if (open) {
      setRefundItems([]);
      setOriginalSale(null);
      setRefundReason('');
      setRefundMethod('original');
    }
  }, [open]);

  const handleSearchSale = () => {
    // Simulate search
    const foundSale = mockSales.find(sale => 
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.phone.includes(searchTerm) ||
      sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (foundSale) {
      setOriginalSale(foundSale);
      setSnackbar({
        open: true,
        message: 'Sale found successfully',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'No sale found with the given criteria',
        severity: 'error'
      });
    }
  };

  const handleAddRefundItem = (item) => {
    const existingItem = refundItems.find(refundItem => refundItem.id === item.id);
    
    if (existingItem) {
      setRefundItems(prev => prev.map(refundItem =>
        refundItem.id === item.id
          ? { ...refundItem, quantity: Math.min(refundItem.quantity + 1, item.quantity) }
          : refundItem
      ));
    } else {
      setRefundItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const handleUpdateRefundQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setRefundItems(prev => prev.filter(item => item.id !== itemId));
      return;
    }

    const originalItem = originalSale?.items.find(item => item.id === itemId);
    const maxQuantity = originalItem?.quantity || 0;

    setRefundItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.min(newQuantity, maxQuantity) }
        : item
    ));
  };

  const calculateRefundTotal = () => {
    return refundItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateRefundTax = () => {
    return calculateRefundTotal() * 0.18; // 18% tax
  };

  const calculateRefundGrandTotal = () => {
    return calculateRefundTotal() + calculateRefundTax();
  };

  const processRefund = async () => {
    if (refundItems.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select items to refund',
        severity: 'error'
      });
      return;
    }

    if (!refundReason) {
      setSnackbar({
        open: true,
        message: 'Please select a refund reason',
        severity: 'error'
      });
      return;
    }

    setProcessing(true);

    try {
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const refund = {
        id: `REF${Date.now()}`,
        originalSaleId: originalSale.id,
        items: refundItems,
        reason: refundReason,
        method: refundMethod,
        total: calculateRefundTotal(),
        tax: calculateRefundTax(),
        grandTotal: calculateRefundGrandTotal(),
        processedBy: session.user.name,
        processedAt: new Date(),
        status: 'completed'
      };

      console.log('Refund processed:', refund);

      setSnackbar({
        open: true,
        message: `Refund processed successfully. Amount: ₹${calculateRefundGrandTotal().toLocaleString()}`,
        severity: 'success'
      });

      // Reset form
      setRefundItems([]);
      setOriginalSale(null);
      setRefundReason('');
      setRefundMethod('original');
      onClose();

    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Refund processing failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
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
            <Typography variant="h6">Refund Processing</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Refund Type Selection */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Refund Type
            </Typography>
            <RadioGroup
              value={refundType}
              onChange={(e) => setRefundType(e.target.value)}
              row
            >
              <FormControlLabel
                value="with_receipt"
                control={<Radio />}
                label="With Receipt"
              />
              <FormControlLabel
                value="without_receipt"
                control={<Radio />}
                label="Without Receipt"
              />
            </RadioGroup>
          </Paper>

          {/* Search Original Sale */}
          {refundType === 'with_receipt' && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Find Original Sale
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    placeholder="Search by Sale ID, Customer Phone, or Customer Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    onClick={handleSearchSale}
                    fullWidth
                    startIcon={<Search />}
                  >
                    Search Sale
                  </Button>
                </Grid>
              </Grid>

              {/* Original Sale Display */}
              {originalSale && (
                <Card sx={{ mt: 2, bgcolor: 'primary.light' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary.contrastText" gutterBottom>
                      Original Sale Found
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="primary.contrastText">
                          Sale ID: {originalSale.id}
                        </Typography>
                        <Typography variant="body2" color="primary.contrastText">
                          Date: {originalSale.date} {originalSale.time}
                        </Typography>
                        <Typography variant="body2" color="primary.contrastText">
                          Customer: {originalSale.customer.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="primary.contrastText">
                          Total: ₹{originalSale.grandTotal.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="primary.contrastText">
                          Payment: {originalSale.payment.method}
                        </Typography>
                        <Typography variant="body2" color="primary.contrastText">
                          Cashier: {originalSale.cashier}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Paper>
          )}

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Select Items" />
              <Tab label="Refund Details" />
              <Tab label="Process Refund" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Select Items Tab */}
            {originalSale ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Items to Refund
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Original Qty</TableCell>
                        <TableCell align="center">Refund Qty</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Refund Amount</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {originalSale.items.map((item) => {
                        const refundItem = refundItems.find(refundItem => refundItem.id === item.id);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {item.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {item.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateRefundQuantity(item.id, (refundItem?.quantity || 0) - 1)}
                                  disabled={!refundItem || refundItem.quantity <= 0}
                                >
                                  <Remove />
                                </IconButton>
                                <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
                                  {refundItem?.quantity || 0}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateRefundQuantity(item.id, (refundItem?.quantity || 0) + 1)}
                                  disabled={refundItem?.quantity >= item.quantity}
                                >
                                  <Add />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                ₹{item.price.toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="medium">
                                ₹{((refundItem?.quantity || 0) * item.price).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant={refundItem ? 'contained' : 'outlined'}
                                onClick={() => handleAddRefundItem(item)}
                                disabled={refundItem?.quantity >= item.quantity}
                              >
                                {refundItem ? 'Added' : 'Add'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Receipt sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Please search and select the original sale first
                </Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Refund Details Tab */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Refund Items
                  </Typography>
                  {refundItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No items selected for refund
                    </Typography>
                  ) : (
                    <List>
                      {refundItems.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemText
                            primary={item.name}
                            secondary={`Quantity: ${item.quantity} x ₹${item.price}`}
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="body2" fontWeight="medium">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Refund Details
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Refund Reason</InputLabel>
                    <Select
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      label="Refund Reason"
                    >
                      {refundReasons.map((reason) => (
                        <MenuItem key={reason} value={reason}>
                          {reason}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Refund Method</InputLabel>
                    <Select
                      value={refundMethod}
                      onChange={(e) => setRefundMethod(e.target.value)}
                      label="Refund Method"
                    >
                      {refundMethods.map((method) => (
                        <MenuItem key={method.id} value={method.id}>
                          <Box>
                            <Typography variant="body2">{method.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">₹{calculateRefundTotal().toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax:</Typography>
                    <Typography variant="body2">₹{calculateRefundTax().toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total Refund:</Typography>
                    <Typography variant="h6" color="primary">
                      ₹{calculateRefundGrandTotal().toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Process Refund Tab */}
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <AssignmentReturn sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Process Refund
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Review the refund details and process the refund
              </Typography>

              {refundItems.length > 0 && (
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.light' }}>
                  <Typography variant="h6" color="primary.contrastText" gutterBottom>
                    Refund Summary
                  </Typography>
                  <Typography variant="body2" color="primary.contrastText">
                    Items: {refundItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                  <Typography variant="body2" color="primary.contrastText">
                    Reason: {refundReason}
                  </Typography>
                  <Typography variant="body2" color="primary.contrastText">
                    Method: {refundMethods.find(m => m.id === refundMethod)?.name}
                  </Typography>
                  <Typography variant="h6" color="primary.contrastText" sx={{ mt: 1 }}>
                    Total: ₹{calculateRefundGrandTotal().toFixed(2)}
                  </Typography>
                </Paper>
              )}

              <Button
                variant="contained"
                size="large"
                startIcon={processing ? <div>Processing...</div> : <AssignmentReturn />}
                onClick={processRefund}
                disabled={processing || refundItems.length === 0}
                sx={{ minWidth: 200 }}
              >
                {processing ? 'Processing Refund...' : 'Process Refund'}
              </Button>
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {tabValue > 0 && (
            <Button onClick={() => setTabValue(tabValue - 1)}>
              Previous
            </Button>
          )}
          {tabValue < 2 && (
            <Button
              variant="contained"
              onClick={() => setTabValue(tabValue + 1)}
              disabled={tabValue === 0 && refundItems.length === 0}
            >
              Next
            </Button>
          )}
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

export default RefundProcessor;
