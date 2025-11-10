import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Edit as EditIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Notes as NotesIcon,
  Timeline as TimelineIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const SalesOrderDetails = ({ order, onEdit, onClose, onPrint, onEmail }) => {
  const [showTimeline, setShowTimeline] = useState(false);

  // Mock order data - replace with actual data
  const orderData = order || {
    id: 'SO-001',
    orderNumber: 'SO-2024-001',
    customer: {
      name: 'ABC Corporation',
      email: 'contact@abc.com',
      phone: '+1-555-0123',
      address: '123 Business St, City, State 12345'
    },
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    status: 'Approved',
    priority: 'High',
    salesPerson: 'John Smith',
    paymentTerms: 'Net 30',
    shippingMethod: 'Standard Shipping',
    notes: 'Please ensure careful handling of fragile items.',
    isUrgent: true,
    lineItems: [
      {
        product: { name: 'Product A', sku: 'PROD-A-001' },
        quantity: 10,
        unitPrice: 100.00,
        discount: 5,
        total: 950.00
      },
      {
        product: { name: 'Product B', sku: 'PROD-B-002' },
        quantity: 5,
        unitPrice: 150.00,
        discount: 0,
        total: 750.00
      },
      {
        product: { name: 'Product C', sku: 'PROD-C-003' },
        quantity: 3,
        unitPrice: 200.00,
        discount: 10,
        total: 540.00
      }
    ],
    subtotal: 2240.00,
    tax: 179.20,
    total: 2419.20,
    timeline: [
      { date: '2024-01-15', action: 'Order Created', user: 'John Smith', status: 'completed' },
      { date: '2024-01-16', action: 'Order Approved', user: 'Manager', status: 'completed' },
      { date: '2024-01-17', action: 'Inventory Allocated', user: 'Warehouse', status: 'completed' },
      { date: '2024-01-18', action: 'Order Picked', user: 'Warehouse', status: 'completed' },
      { date: '2024-01-19', action: 'Order Shipped', user: 'Shipping', status: 'completed' },
      { date: '2024-01-20', action: 'Order Delivered', user: 'Logistics', status: 'pending' }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Pending': return 'warning';
      case 'Approved': return 'info';
      case 'In Progress': return 'primary';
      case 'Shipped': return 'secondary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'error';
      case 'High': return 'warning';
      case 'Normal': return 'success';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft': return <EditIcon />;
      case 'Pending': return <PendingIcon />;
      case 'Approved': return <CheckCircleIcon />;
      case 'In Progress': return <InventoryIcon />;
      case 'Shipped': return <ShippingIcon />;
      case 'Completed': return <CheckCircleIcon />;
      case 'Cancelled': return <CloseIcon />;
      default: return <PendingIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon color="primary" />
                {orderData.orderNumber}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={getStatusIcon(orderData.status)}
                  label={orderData.status}
                  color={getStatusColor(orderData.status)}
                  variant="outlined"
                />
                <Chip
                  label={orderData.priority}
                  color={getPriorityColor(orderData.priority)}
                  size="small"
                  variant="outlined"
                />
                {orderData.isUrgent && (
                  <Chip
                    label="Urgent"
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<TimelineIcon />}
                onClick={() => setShowTimeline(true)}
                size="small"
              >
                Timeline
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={onPrint}
                size="small"
              >
                Print
              </Button>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={onEmail}
                size="small"
              >
                Email
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onEdit}
                size="small"
              >
                Edit
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    Customer Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{orderData.customer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {orderData.customer.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {orderData.customer.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {orderData.customer.address}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon color="primary" />
                    Order Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Order Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(orderData.orderDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Delivery Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(orderData.deliveryDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Sales Person
                      </Typography>
                      <Typography variant="body1">
                        {orderData.salesPerson}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Terms
                      </Typography>
                      <Typography variant="body1">
                        {orderData.paymentTerms}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Shipping Method
                      </Typography>
                      <Typography variant="body1">
                        {orderData.shippingMethod}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Line Items */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Order Line Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">SKU</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="center">Discount</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderData.lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.product.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {item.product.sku}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ${item.unitPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.discount}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${item.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon color="primary" />
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>${orderData.subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax (8%):</Typography>
                    <Typography>${orderData.tax.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                      ${orderData.total.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Notes */}
            {orderData.notes && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NotesIcon color="primary" />
                      Notes
                    </Typography>
                    <Typography variant="body2">
                      {orderData.notes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Timeline Dialog */}
      <Dialog open={showTimeline} onClose={() => setShowTimeline(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon color="primary" />
            Order Timeline
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {orderData.timeline.map((event, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Avatar sx={{ 
                    bgcolor: event.status === 'completed' ? 'success.main' : 'warning.main',
                    width: 32,
                    height: 32
                  }}>
                    {event.status === 'completed' ? <CheckCircleIcon /> : <PendingIcon />}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={event.action}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.date).toLocaleDateString()} - {event.user}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTimeline(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesOrderDetails;
