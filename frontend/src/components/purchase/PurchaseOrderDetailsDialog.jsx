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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const PurchaseOrderDetailsDialog = ({ order, open, onClose }) => {
  if (!order) return null;

  // Mock order items
  const orderItems = [
    {
      id: 1,
      product_name: 'Premium Coffee Beans - Dark Roast',
      product_sku: 'PCB-DR-001',
      quantity_ordered: 50,
      quantity_received: 50,
      unit_cost: 12.99,
      discount_percentage: 5,
      line_total: 617.025,
      expected_delivery: '2025-01-08'
    },
    {
      id: 2,
      product_name: 'Artisan Tea Blend - Earl Grey',
      product_sku: 'ATB-EG-002',
      quantity_ordered: 25,
      quantity_received: 25,
      unit_cost: 18.50,
      discount_percentage: 0,
      line_total: 462.50,
      expected_delivery: '2025-01-08'
    },
    {
      id: 3,
      product_name: 'Ceramic Coffee Cups Set',
      product_sku: 'CCS-001',
      quantity_ordered: 10,
      quantity_received: 10,
      unit_cost: 45.99,
      discount_percentage: 10,
      line_total: 413.91,
      expected_delivery: '2025-01-08'
    },
    {
      id: 4,
      product_name: 'Digital Coffee Scale',
      product_sku: 'DCS-001',
      quantity_ordered: 5,
      quantity_received: 5,
      unit_cost: 78.99,
      discount_percentage: 0,
      line_total: 394.95,
      expected_delivery: '2025-01-08'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      pending: 'warning',
      ordered: 'info',
      'partially_received': 'secondary',
      received: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      pending: 'Pending',
      ordered: 'Ordered',
      'partially_received': 'Partially Received',
      received: 'Received',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Purchase Order steps
  const getStepStatus = () => {
    switch (order.status) {
      case 'draft': return 0;
      case 'pending': return 1;
      case 'ordered': return 2;
      case 'partially_received': return 3;
      case 'received': return 4;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const steps = [
    'Draft Created',
    'Pending Approval',
    'Ordered',
    'Partially Received',
    'Fully Received'
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShippingIcon color="primary" />
          <Typography variant="h6">
            Purchase Order Details - {order.po_number}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Chip 
              label={getStatusLabel(order.status)} 
              color={getStatusColor(order.status)} 
              size="large"
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Order Status Stepper */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Progress
                </Typography>
                <Stepper activeStep={getStepStatus()} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DateIcon fontSize="small" />
                  Order Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">PO Number:</Typography>
                    <Typography variant="body2" fontWeight="bold">{order.po_number}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                    <Typography variant="body2">{formatDate(order.ordered_date)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Expected Delivery:</Typography>
                    <Typography variant="body2">{formatDate(order.expected_delivery)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Created By:</Typography>
                    <Typography variant="body2">{order.created_by}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Total Items:</Typography>
                    <Typography variant="body2">{order.items_count}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Supplier Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  Supplier Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" fontWeight="bold">{order.supplier_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact: contact@supplier.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: +1 (555) 123-4567
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Address: 123 Business St, City, ST 12345
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Items ({orderItems.length})
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">SKU</TableCell>
                        <TableCell align="center">Qty Ordered</TableCell>
                        <TableCell align="center">Qty Received</TableCell>
                        <TableCell align="right">Unit Cost</TableCell>
                        <TableCell align="center">Discount</TableCell>
                        <TableCell align="right">Line Total</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell align="center">{item.product_sku}</TableCell>
                          <TableCell align="center">{item.quantity_ordered}</TableCell>
                          <TableCell align="center">{item.quantity_received}</TableCell>
                          <TableCell align="right">{formatCurrency(item.unit_cost)}</TableCell>
                          <TableCell align="center">{item.discount_percentage}%</TableCell>
                          <TableCell align="right" fontWeight="bold">
                            {formatCurrency(item.line_total)}
                          </TableCell>
                          <TableCell align="center">
                            {item.quantity_ordered === item.quantity_received ? (
                              <Chip label="Complete" color="success" size="small" />
                            ) : (
                              <Chip label="Partial" color="warning" size="small" />
                            )}
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
                    {formatCurrency(order.total_amount * 0.95)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Discount:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="success">
                    -{formatCurrency(order.total_amount * 0.05)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Tax (8.25%):</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(order.total_amount * 0.0825)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(order.total_amount)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Notes */}
          {order.notes && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Notes
                  </Typography>
                  <Typography variant="body2">{order.notes}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="outlined" startIcon={<CheckIcon />} disabled={order.status !== 'pending'}>
          Approve Order
        </Button>
        <Button variant="contained" color="success" disabled={order.status === 'received'}>
          Mark as Received
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDetailsDialog;


