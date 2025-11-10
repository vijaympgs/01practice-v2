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
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Payment,
  AccountBalanceWallet,
  CreditCard,
  QrCode,
  AttachMoney,
  Receipt,
  CheckCircle,
  Error,
  Warning,
  Info,
  Close,
  Print,
  Email
} from '@mui/icons-material';

const PaymentProcessor = ({ open, onClose, cartTotal, cartTax, grandTotal, onPaymentComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const steps = ['Select Payment Method', 'Enter Details', 'Process Payment', 'Complete'];

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash',
      icon: <AccountBalanceWallet />,
      color: 'success',
      fields: ['amountTendered', 'change']
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard />,
      color: 'primary',
      fields: ['cardNumber', 'cardType', 'cardHolderName', 'expiryDate', 'cvv']
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <QrCode />,
      color: 'info',
      fields: ['upiId', 'upiProvider']
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <AttachMoney />,
      color: 'warning',
      fields: ['walletType', 'walletId']
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <Receipt />,
      color: 'secondary',
      fields: ['accountNumber', 'bankName', 'transactionId']
    }
  ];

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setPaymentDetails({});
    setActiveStep(1);
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateChange = () => {
    if (paymentMethod === 'cash' && paymentDetails.amountTendered) {
      const change = parseFloat(paymentDetails.amountTendered) - grandTotal;
      setPaymentDetails(prev => ({
        ...prev,
        change: change > 0 ? change.toFixed(2) : '0.00'
      }));
    }
  };

  useEffect(() => {
    if (paymentMethod === 'cash') {
      calculateChange();
    }
  }, [paymentDetails.amountTendered, grandTotal, paymentMethod]);

  const validatePaymentDetails = () => {
    const method = paymentMethods.find(m => m.id === paymentMethod);
    if (!method) return false;

    for (const field of method.fields) {
      if (field === 'change') continue; // Skip change field as it's calculated
      if (!paymentDetails[field]) {
        setSnackbar({
          open: true,
          message: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          severity: 'error'
        });
        return false;
      }
    }
    return true;
  };

  const processPayment = async () => {
    if (!validatePaymentDetails()) return;

    setProcessing(true);
    setActiveStep(2);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentResult = {
        id: `PAY${Date.now()}`,
        method: paymentMethod,
        amount: grandTotal,
        details: paymentDetails,
        status: 'success',
        timestamp: new Date(),
        transactionId: `TXN${Date.now()}`
      };

      setActiveStep(3);
      setSnackbar({
        open: true,
        message: 'Payment processed successfully!',
        severity: 'success'
      });

      // Complete payment after a short delay
      setTimeout(() => {
        onPaymentComplete(paymentResult);
        handleClose();
      }, 3000);

    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Payment processing failed. Please try again.',
        severity: 'error'
      });
      setActiveStep(1);
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setPaymentMethod('');
    setPaymentDetails({});
    setProcessing(false);
    onClose();
  };

  const renderPaymentMethodSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Payment Method
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose how the customer wants to pay
      </Typography>

      <Grid container spacing={2}>
        {paymentMethods.map((method) => (
          <Grid item xs={12} sm={6} md={4} key={method.id}>
            <Card
              sx={{
                cursor: 'pointer',
                border: paymentMethod === method.id ? 2 : 1,
                borderColor: paymentMethod === method.id ? 'primary.main' : 'divider',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <IconButton
                  color={method.color}
                  sx={{ fontSize: 40, mb: 1 }}
                >
                  {method.icon}
                </IconButton>
                <Typography variant="body1" fontWeight="medium">
                  {method.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderPaymentDetails = () => {
    const method = paymentMethods.find(m => m.id === paymentMethod);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Payment Details - {method?.name}
        </Typography>

        {paymentMethod === 'cash' && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount Tendered"
                type="number"
                value={paymentDetails.amountTendered || ''}
                onChange={(e) => handlePaymentDetailsChange('amountTendered', e.target.value)}
                InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Change"
                value={paymentDetails.change || '0.00'}
                disabled
                InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
              />
            </Grid>
          </Grid>
        )}

        {paymentMethod === 'card' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={paymentDetails.cardNumber || ''}
                onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Card Type</InputLabel>
                <Select
                  value={paymentDetails.cardType || ''}
                  onChange={(e) => handlePaymentDetailsChange('cardType', e.target.value)}
                  label="Card Type"
                >
                  <MenuItem value="visa">Visa</MenuItem>
                  <MenuItem value="mastercard">Mastercard</MenuItem>
                  <MenuItem value="amex">American Express</MenuItem>
                  <MenuItem value="rupay">RuPay</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={paymentDetails.cardHolderName || ''}
                onChange={(e) => handlePaymentDetailsChange('cardHolderName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={paymentDetails.expiryDate || ''}
                onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                placeholder="MM/YY"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CVV"
                type="password"
                value={paymentDetails.cvv || ''}
                onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                placeholder="123"
              />
            </Grid>
          </Grid>
        )}

        {paymentMethod === 'upi' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="UPI ID"
                value={paymentDetails.upiId || ''}
                onChange={(e) => handlePaymentDetailsChange('upiId', e.target.value)}
                placeholder="example@paytm"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>UPI Provider</InputLabel>
                <Select
                  value={paymentDetails.upiProvider || ''}
                  onChange={(e) => handlePaymentDetailsChange('upiProvider', e.target.value)}
                  label="UPI Provider"
                >
                  <MenuItem value="paytm">Paytm</MenuItem>
                  <MenuItem value="phonepe">PhonePe</MenuItem>
                  <MenuItem value="gpay">Google Pay</MenuItem>
                  <MenuItem value="bhim">BHIM</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {paymentMethod === 'wallet' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Wallet Type</InputLabel>
                <Select
                  value={paymentDetails.walletType || ''}
                  onChange={(e) => handlePaymentDetailsChange('walletType', e.target.value)}
                  label="Wallet Type"
                >
                  <MenuItem value="paytm">Paytm</MenuItem>
                  <MenuItem value="mobikwik">MobiKwik</MenuItem>
                  <MenuItem value="freecharge">FreeCharge</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Wallet ID/Phone"
                value={paymentDetails.walletId || ''}
                onChange={(e) => handlePaymentDetailsChange('walletId', e.target.value)}
                placeholder="Enter wallet ID or phone number"
              />
            </Grid>
          </Grid>
        )}

        {paymentMethod === 'bank_transfer' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Number"
                value={paymentDetails.accountNumber || ''}
                onChange={(e) => handlePaymentDetailsChange('accountNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name"
                value={paymentDetails.bankName || ''}
                onChange={(e) => handlePaymentDetailsChange('bankName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Transaction ID"
                value={paymentDetails.transactionId || ''}
                onChange={(e) => handlePaymentDetailsChange('transactionId', e.target.value)}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    );
  };

  const renderProcessing = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Payment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Processing Payment...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we process your payment
      </Typography>
    </Box>
  );

  const renderComplete = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom color="success.main">
        Payment Successful!
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Transaction ID: TXN{Date.now()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Amount: ₹{grandTotal.toLocaleString()}
      </Typography>
    </Box>
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Payment Processing</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Payment Summary */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light' }}>
            <Typography variant="h6" color="primary.contrastText" gutterBottom>
              Payment Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="primary.contrastText">Subtotal:</Typography>
              <Typography variant="body2" color="primary.contrastText">₹{cartTotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="primary.contrastText">Tax:</Typography>
              <Typography variant="body2" color="primary.contrastText">₹{cartTax.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 1, bgcolor: 'primary.contrastText' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="primary.contrastText">Total:</Typography>
              <Typography variant="h6" color="primary.contrastText">₹{grandTotal.toLocaleString()}</Typography>
            </Box>
          </Paper>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          {activeStep === 0 && renderPaymentMethodSelection()}
          {activeStep === 1 && renderPaymentDetails()}
          {activeStep === 2 && renderProcessing()}
          {activeStep === 3 && renderComplete()}
        </DialogContent>

        <DialogActions>
          {activeStep < 2 && (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              {activeStep === 1 && (
                <Button
                  variant="contained"
                  onClick={processPayment}
                  disabled={processing}
                  startIcon={<Payment />}
                >
                  Process Payment
                </Button>
              )}
            </>
          )}
          {activeStep === 3 && (
            <Button variant="contained" onClick={handleClose}>
              Close
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

export default PaymentProcessor;
