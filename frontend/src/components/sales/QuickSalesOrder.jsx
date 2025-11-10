import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const QuickSalesOrder = ({ onSave, onCancel, customers = [], products = [] }) => {
  const [formData, setFormData] = useState({
    customer: null,
    salesPerson: '',
    paymentTerms: 'Net 30',
    notes: ''
  });

  const [lineItems, setLineItems] = useState([
    { product: null, quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const [errors, setErrors] = useState({});

  // Mock data if not provided
  const customerOptions = customers.length > 0 ? customers : [
    { id: 1, name: 'ABC Corporation', email: 'contact@abc.com' },
    { id: 2, name: 'XYZ Industries', email: 'sales@xyz.com' },
    { id: 3, name: 'DEF Enterprises', email: 'info@def.com' }
  ];

  const productOptions = products.length > 0 ? products : [
    { id: 1, name: 'Product A', sku: 'PROD-A-001', price: 100.00, stock: 50 },
    { id: 2, name: 'Product B', sku: 'PROD-B-002', price: 150.00, stock: 30 },
    { id: 3, name: 'Product C', sku: 'PROD-C-003', price: 200.00, stock: 25 }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...lineItems];
    newLineItems[index][field] = value;
    
    // Recalculate total
    if (field === 'product' && value) {
      newLineItems[index].unitPrice = value.price;
    }
    
    const unitPrice = newLineItems[index].unitPrice || 0;
    const quantity = newLineItems[index].quantity || 0;
    newLineItems[index].total = unitPrice * quantity;
    
    setLineItems(newLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { product: null, quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer) {
      newErrors.customer = 'Customer is required';
    }
    
    if (!formData.salesPerson) {
      newErrors.salesPerson = 'Sales person is required';
    }
    
    if (lineItems.some(item => !item.product)) {
      newErrors.lineItems = 'All line items must have a product';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const orderData = {
        ...formData,
        lineItems: lineItems.filter(item => item.product),
        ...calculateTotals(),
        status: 'Draft',
        orderDate: new Date().toISOString().split('T')[0]
      };
      onSave(orderData);
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon color="primary" />
            Quick Sales Order
          </Typography>
          
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Order Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={customerOptions}
                getOptionLabel={(option) => option.name}
                value={formData.customer}
                onChange={(_, value) => handleInputChange('customer', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer"
                    error={!!errors.customer}
                    helperText={errors.customer}
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sales Person"
                value={formData.salesPerson}
                onChange={(e) => handleInputChange('salesPerson', e.target.value)}
                error={!!errors.salesPerson}
                helperText={errors.salesPerson}
                size="small"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Terms</InputLabel>
                <Select
                  value={formData.paymentTerms}
                  label="Payment Terms"
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                >
                  <MenuItem value="Net 15">Net 15</MenuItem>
                  <MenuItem value="Net 30">Net 30</MenuItem>
                  <MenuItem value="Net 45">Net 45</MenuItem>
                  <MenuItem value="COD">Cash on Delivery</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                size="small"
              />
            </Grid>

            {/* Line Items */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Order Items
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addLineItem}
                  size="small"
                >
                  Add Item
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Autocomplete
                            options={productOptions}
                            getOptionLabel={(option) => `${option.name} (${option.sku}) - $${option.price}`}
                            value={item.product}
                            onChange={(_, value) => handleLineItemChange(index, 'product', value)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select product"
                                size="small"
                                variant="standard"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            size="small"
                            variant="standard"
                            inputProps={{ min: 1 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ${item.unitPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${item.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => removeLineItem(index)}
                            disabled={lineItems.length === 1}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {errors.lineItems && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.lineItems}
                </Alert>
              )}
            </Grid>

            {/* Order Totals */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax (8%):</Typography>
                    <Typography>${tax.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Create Order
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuickSalesOrder;
