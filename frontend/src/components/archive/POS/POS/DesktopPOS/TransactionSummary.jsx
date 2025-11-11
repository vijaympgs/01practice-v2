import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  LocalOffer as DiscountIcon,
  AccountBalance as TaxIcon
} from '@mui/icons-material';

const TransactionSummary = ({ itemsCount, total, tax, discount, grandTotal }) => {
  const finalTotal = grandTotal || (total + tax - discount);

  return (
    <Paper sx={{ 
      p: 2, 
      bgcolor: '#2c3e50', 
      color: 'white',
      borderRadius: 1,
      mb: 2
    }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptIcon />
        Transaction Summary
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Items Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CartIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">Items</Typography>
          </Box>
          <Chip 
            label={itemsCount} 
            size="small" 
            sx={{ 
              bgcolor: 'white', 
              color: '#2c3e50',
              fontWeight: 'bold'
            }} 
          />
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

        {/* Total Amount */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">Total Amount</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            ₹{total.toFixed(2)}
          </Typography>
        </Box>

        {/* Tax Amount */}
        {tax > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TaxIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">Tax Amount</Typography>
            </Box>
            <Typography variant="body2">
              ₹{tax.toFixed(2)}
            </Typography>
          </Box>
        )}

        {/* Discount */}
        {discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DiscountIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">Discount</Typography>
            </Box>
            <Typography variant="body2" color="success.light">
              -₹{discount.toFixed(2)}
            </Typography>
          </Box>
        )}

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

        {/* Grand Total */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pt: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Grand Total
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold',
              color: '#4caf50'
            }}
          >
            ₹{finalTotal.toFixed(2)}
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 1,
          pt: 1,
          borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Chip 
            label={`${itemsCount} items`}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontSize: '0.7rem'
            }}
          />
          <Chip 
            label={`Tax: ₹${tax.toFixed(2)}`}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontSize: '0.7rem'
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default TransactionSummary;
