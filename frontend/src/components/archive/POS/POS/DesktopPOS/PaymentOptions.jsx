import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CardIcon,
  AccountBalance as CashIcon,
  PhoneAndroid as PhoneIcon,
  QrCode as QRIcon
} from '@mui/icons-material';

const PaymentOptions = ({ onPaymentSelect, selectedPayment }) => {
  const paymentMethods = [
    {
      id: 'cash',
      label: 'CASH',
      color: '#4caf50',
      icon: <CashIcon />,
      description: 'Cash Payment'
    },
    {
      id: 'card',
      label: 'CARD',
      color: '#2196f3',
      icon: <CardIcon />,
      description: 'Card Payment'
    },
    {
      id: 'card_print',
      label: 'CARD & PRINT',
      color: '#9c27b0',
      icon: <PaymentIcon />,
      description: 'Card + Receipt'
    },
    {
      id: 'other',
      label: 'OTHER',
      color: '#757575',
      icon: <PaymentIcon />,
      description: 'Other Payment'
    }
  ];

  const digitalWallets = [
    {
      id: 'phonepe',
      label: 'PhonePe',
      color: '#5f259f',
      logo: '📱'
    },
    {
      id: 'paytm',
      label: 'Paytm',
      color: '#00baf2',
      logo: '💳'
    },
    {
      id: 'gpay',
      label: 'G Pay',
      color: '#4285f4',
      logo: '🔵'
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Payment Methods */}
      <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentIcon />
          Payment Methods
        </Typography>
        
        <Grid container spacing={1}>
          {paymentMethods.map((method) => (
            <Grid item xs={6} key={method.id}>
              <Button
                fullWidth
                variant={selectedPayment === method.id ? 'contained' : 'outlined'}
                onClick={() => onPaymentSelect(method.id)}
                sx={{
                  height: 60,
                  bgcolor: selectedPayment === method.id ? method.color : 'white',
                  color: selectedPayment === method.id ? 'white' : method.color,
                  border: `2px solid ${method.color}`,
                  '&:hover': {
                    bgcolor: method.color,
                    color: 'white'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5
                }}
              >
                {method.icon}
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  {method.label}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Digital Wallets */}
      <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon />
          Digital Wallets
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {digitalWallets.map((wallet) => (
            <Button
              key={wallet.id}
              variant={selectedPayment === wallet.id ? 'contained' : 'outlined'}
              onClick={() => onPaymentSelect(wallet.id)}
              sx={{
                height: 50,
                bgcolor: selectedPayment === wallet.id ? wallet.color : 'white',
                color: selectedPayment === wallet.id ? 'white' : wallet.color,
                border: `1px solid ${wallet.color}`,
                '&:hover': {
                  bgcolor: wallet.color,
                  color: 'white'
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                p: 2
              }}
            >
              <Avatar sx={{ 
                width: 30, 
                height: 30, 
                bgcolor: wallet.color,
                fontSize: '1rem'
              }}>
                {wallet.logo}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {wallet.label}
              </Typography>
            </Button>
          ))}
        </Box>
      </Paper>

      {/* QR Code Payment */}
      <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Button
          fullWidth
          variant={selectedPayment === 'qr' ? 'contained' : 'outlined'}
          onClick={() => onPaymentSelect('qr')}
          sx={{
            height: 60,
            bgcolor: selectedPayment === 'qr' ? '#ff9800' : 'white',
            color: selectedPayment === 'qr' ? 'white' : '#ff9800',
            border: '2px solid #ff9800',
            '&:hover': {
              bgcolor: '#ff9800',
              color: 'white'
            },
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <QRIcon />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            QR Code Payment
          </Typography>
        </Button>
      </Paper>

      {/* Payment Status */}
      {selectedPayment && (
        <Paper sx={{ p: 2, bgcolor: '#e8f5e8', borderRadius: 1, border: '1px solid #4caf50' }}>
          <Chip
            label={`Selected: ${paymentMethods.find(m => m.id === selectedPayment)?.label || 
                    digitalWallets.find(w => w.id === selectedPayment)?.label || 
                    'QR Code Payment'}`}
            color="success"
            variant="filled"
            sx={{ fontWeight: 'bold' }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default PaymentOptions;
