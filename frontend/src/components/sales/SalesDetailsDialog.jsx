import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Payment as PaymentIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';

const SalesDetailsDialog = ({ sale, open, onClose }) => {
  if (!sale) return null;

  // Mock sale items
  const saleItems = [
    {
      id: 1,
      product_name: 'Premium Coffee Beans',
      quantity: 2,
      unit_price: 12.99,
      total_price: 25.98,
      product_sku: 'PC-001'
    },
    {
      id: 2,
      product_name: 'Artisan Tea Blend',
      quantity: 1,
      unit_price: 8.99,
      total_price: 8.99,
      product_sku: 'AT-002'
    },
    {
      id: 3,
      product_name: 'Ceramic Mug',
      quantity: 2,
      unit_price: 15.99,
      total_price: 31.98,
      product_sku: 'CM-003'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      pending: 'warning',
      cancelled: 'error',
      paid: 'success',
      failed: 'error',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="primary" />
          <Typography variant="h6">
            Sale Details - {sale.sale_number}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Sale Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon fontSize="small" />
                  Transaction Info
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Sale Number:</Typography>
                    <Typography variant="body2" fontWeight="bold">{sale.sale_number}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Date:</Typography>
                    <Typography variant="body2">{formatDate(sale.created_at)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Chip 
                      label={sale.transaction_status} 
                      color={getStatusColor(sale.transaction_status)} 
                      size="small" 
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Cashier:</Typography>
                    <Typography variant="body2">{sale.cashier_name}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  Customer Info
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography variant="body2">{sale.customer_name || 'Walk-in Customer'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
                    <Chip 
                      label={sale.payment_status} 
                      color={getStatusColor(sale.payment_status)} 
                      size="small" 
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Items List */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CartIcon fontSize="small" />
                  Items Purchased ({saleItems.length})
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">SKU</TableCell>
                        <TableCell align="center">Qty</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {saleItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell align="center">{item.product_sku}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell align="right" fontWeight="bold">
                            {formatCurrency(item.total_price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Financial Summary */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Financial Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(sale.total_amount - sale.tax_amount + sale.discount_amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Discount:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="error">
                    -{formatCurrency(sale.discount_amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Tax:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(sale.tax_amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(sale.total_amount)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" startIcon={<PaymentIcon />}>
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalesDetailsDialog;
