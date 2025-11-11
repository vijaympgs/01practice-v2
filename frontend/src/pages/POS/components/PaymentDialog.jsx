import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Phone as MobileIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import salesService from '../../../services/salesService';
import Receipt from './Receipt';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'credit_card', label: 'Credit Card', icon: <CardIcon /> },
  { value: 'debit_card', label: 'Debit Card', icon: <CardIcon /> },
  { value: 'mobile', label: 'Mobile Payment', icon: <MobileIcon /> },
];

const QUICK_CASH = [20, 50, 100, 200, 500];

const PaymentDialog = ({
  open,
  onClose,
  cartItems,
  customer,
  discount,
  notes,
  totals,
  session,
  onComplete,
}) => {
  const currentUser = useSelector((state) => state.auth.user);
  
  const [payments, setPayments] = useState([]);
  const [currentMethod, setCurrentMethod] = useState('cash');
  const [currentAmount, setCurrentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedSale, setCompletedSale] = useState(null);

  const totalAmount = parseFloat(totals.total);
  const paidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const remainingAmount = totalAmount - paidAmount;
  const changeAmount = paidAmount > totalAmount ? paidAmount - totalAmount : 0;

  const handleAddPayment = () => {
    const amount = parseFloat(currentAmount);
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > remainingAmount + 0.01) {
      // Allow overpayment for change
      if (currentMethod !== 'cash') {
        setError('Non-cash payments cannot exceed remaining amount');
        return;
      }
    }

    setPayments([...payments, {
      payment_method: currentMethod,
      amount: amount,
    }]);

    setCurrentAmount('');
    setError('');
  };

  const handleQuickCash = (amount) => {
    if (remainingAmount <= 0) return;
    
    setPayments([...payments, {
      payment_method: 'cash',
      amount: Math.max(amount, remainingAmount),
    }]);
  };

  const handleRemovePayment = (index) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleCompleteSale = async () => {
    if (remainingAmount > 0.01) {
      setError('Payment incomplete. Please add more payments.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get location from session - required by backend
      const locationId = session?.locationId || session?.location?.id || session?.location;
      
      // Validate location is available (backend requires it)
      if (!locationId) {
        setError('Location information is missing. Please ensure a POS session is open with a valid location.');
        setLoading(false);
        return;
      }
      
      // Map payment methods to valid Payment model choices: 'cash', 'card', 'upi', 'wallet', 'cheque', 'credit'
      const paymentMethodMap = {
        'cash': 'cash',
        'card': 'card',
        'credit_card': 'card',
        'debit_card': 'card',
        'upi': 'upi',
        'wallet': 'wallet',
        'cheque': 'cheque',
        'credit': 'credit',
        'mobile': 'wallet', // Map mobile to wallet
        'bank_transfer': 'card'
      };
      
      // Map and validate payment methods in payments array
      const validatedPayments = payments.map(payment => {
        const originalMethod = payment.payment_method;
        const validMethod = paymentMethodMap[originalMethod] || 'cash';
        return {
          payment_method: validMethod,
          amount: parseFloat(payment.amount) || 0,
          status: 'completed',
          ...(payment.reference_number && { reference_number: payment.reference_number }),
          ...(payment.notes && { notes: payment.notes })
        };
      });
      
      // Create sale
      const saleData = {
        sale_type: 'cash',
        cashier: currentUser.id,
        customer: customer?.id || null,
        status: 'completed',
        discount_percentage: discount,
        notes,
        pos_session: session?.id || null,
        location: locationId, // Include location explicitly
        items: cartItems.map(item => ({
          product: item.product.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_amount: item.discount_amount,
          tax_rate: item.tax_rate,
        })),
        payments: validatedPayments,
      };

      // Add timeout protection for the API call
      const PAYMENT_TIMEOUT = 35000; // 35 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Payment request timed out. Please check your connection and try again.'));
        }, PAYMENT_TIMEOUT);
      });
      
      const sale = await Promise.race([
        salesService.create(saleData),
        timeoutPromise
      ]);
      
      setCompletedSale(sale);
      
      // Don't close immediately, show receipt first
    } catch (err) {
      console.error('Error completing sale:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code
      });
      
      // Log full error response for debugging
      if (err.response?.data) {
        console.error('📋 Full error response:', JSON.stringify(err.response.data, null, 2));
      }
      
      // Handle timeout errors specifically
      let errorMessage = 'Failed to complete sale';
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('timed out')) {
        errorMessage = 'Payment request timed out. Please check your internet connection and try again.';
      } else if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors.join(', ')
            : errorData.non_field_errors;
        } else {
          // Try to extract field-specific errors (handle nested objects/arrays)
          const fieldErrors = Object.entries(errorData)
            .filter(([key]) => key !== 'detail' && key !== 'message' && key !== 'error')
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(', ')}`;
              } else if (typeof value === 'object' && value !== null) {
                // Handle nested objects - convert to JSON string for readability
                try {
                  // If it's an array of objects, try to extract meaningful messages
                  if (Array.isArray(value)) {
                    const messages = value.map(v => {
                      if (typeof v === 'object') {
                        return Object.entries(v).map(([k, v]) => `${k}: ${v}`).join(', ');
                      }
                      return String(v);
                    });
                    return `${key}: ${messages.join('; ')}`;
                  } else {
                    // Single object - stringify it
                    return `${key}: ${JSON.stringify(value)}`;
                  }
                } catch (e) {
                  return `${key}: ${String(value)}`;
                }
              } else {
                return `${key}: ${String(value)}`;
              }
            })
            .join('; ');
          if (fieldErrors) {
            errorMessage = fieldErrors;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (completedSale) {
      onComplete();
    }
    // Reset state
    setPayments([]);
    setCurrentAmount('');
    setError('');
    setCompletedSale(null);
    setLoading(false);
    onClose();
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Show receipt after sale completion
  if (completedSale) {
    return (
      <Receipt
        open={open}
        sale={completedSale}
        payments={payments}
        changeAmount={changeAmount}
        onClose={handleClose}
        onPrint={handlePrintReceipt}
      />
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentIcon />
          <Typography variant="h6" fontWeight="bold">
            Payment
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Total Amount */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Total Amount:</Typography>
            <Typography variant="h4" fontWeight="bold">
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {/* Payment Summary */}
        {payments.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Payments Received:
            </Typography>
            {payments.map((payment, index) => (
              <Chip
                key={index}
                label={`${PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.label}: $${parseFloat(payment.amount).toFixed(2)}`}
                onDelete={() => handleRemovePayment(index)}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Paid:</Typography>
              <Typography fontWeight="bold">${paidAmount.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color={remainingAmount > 0 ? 'error' : 'success.main'}>
                Remaining:
              </Typography>
              <Typography fontWeight="bold" color={remainingAmount > 0 ? 'error' : 'success.main'}>
                ${remainingAmount.toFixed(2)}
              </Typography>
            </Box>
            {changeAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="info.main">Change:</Typography>
                <Typography fontWeight="bold" color="info.main">
                  ${changeAmount.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Payment Method Selection */}
        {remainingAmount > 0.01 && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Select Payment Method:
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {PAYMENT_METHODS.map((method) => (
                <Grid item xs={6} sm={3} key={method.value}>
                  <Button
                    variant={currentMethod === method.value ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => setCurrentMethod(method.value)}
                    startIcon={method.icon}
                  >
                    {method.label}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Amount Input */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Amount"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddPayment();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddPayment}
                disabled={!currentAmount}
              >
                Add
              </Button>
            </Box>

            {/* Quick Cash Buttons */}
            {currentMethod === 'cash' && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Quick Cash:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {QUICK_CASH.map((amount) => (
                    <Button
                      key={amount}
                      variant="outlined"
                      onClick={() => handleQuickCash(amount)}
                      disabled={remainingAmount <= 0}
                    >
                      ${amount}
                    </Button>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={() => handleQuickCash(Math.ceil(remainingAmount))}
                    disabled={remainingAmount <= 0}
                  >
                    Exact
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCompleteSale}
          disabled={remainingAmount > 0.01 || loading || payments.length === 0}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Processing...' : 'Complete Sale'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;





