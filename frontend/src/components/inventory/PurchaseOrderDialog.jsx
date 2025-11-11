import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Grid,
  Autocomplete,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import inventoryService from '../../services/inventoryService';
import supplierService from '../../services/supplierService';
import productService from '../../services/productService';

const PurchaseOrderDialog = ({ open, onClose, onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderItems, setOrderItems] = useState([{ product: null, quantity: 1, unitCost: 0 }]);
  const [priority, setPriority] = useState('medium');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setSelectedSupplier(null);
      setOrderItems([{ product: null, quantity: 1, unitCost: 0 }]);
      setPriority('medium');
      setExpectedDeliveryDate('');
      setNotes('');
      setError(null);
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [suppliersData, productsData] = await Promise.all([
        supplierService.getSuppliers({ page_size: 1000 }),
        productService.getProducts({ page_size: 1000 }),
      ]);
      
      setSuppliers(suppliersData.data.results || suppliersData.data);
      setProducts(productsData.data.results || productsData.data);
    } catch (err) {
      setError('Failed to load data');
      console.error('Data fetch error:', err);
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product: null, quantity: 1, unitCost: 0 }]);
  };

  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setOrderItems(updatedItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.quantity * item.unitCost);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!selectedSupplier || orderItems.length === 0) {
      setError('Please select a supplier and add at least one item');
      return;
    }

    // Validate items
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      if (!item.product || item.quantity <= 0 || item.unitCost <= 0) {
        setError(`Invalid data for item ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        supplier: selectedSupplier.id,
        priority: priority,
        expected_delivery_date: expectedDeliveryDate || null,
        notes: notes,
        items: orderItems.map(item => ({
          product: item.product.id,
          quantity_ordered: item.quantity,
          unit_cost: item.unitCost,
          discount_percentage: 0,
          expected_delivery_date: expectedDeliveryDate || null,
          notes: '',
        })),
      };

      await inventoryService.createPurchaseOrder(orderData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">New Purchase Order</Typography>
        <Typography variant="body2" color="text.secondary">
          Create a new purchase order to replenish inventory
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Supplier Selection */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={suppliers}
              getOptionLabel={(option) => option.name}
              value={selectedSupplier}
              onChange={(event, newValue) => setSelectedSupplier(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  placeholder="Select supplier..."
                  required
                  fullWidth
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.supplier_code} • {option.email}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Grid>

          {/* Priority */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Expected Delivery Date */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Expected Delivery Date"
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
            />
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            
            {orderItems.map((item, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <Autocomplete
                      options={products}
                      getOptionLabel={(option) => `${option.name} (${option.sku})`}
                      value={item.product}
                      onChange={(event, newValue) => updateOrderItem(index, 'product', newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product"
                          size="small"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      size="small"
                      required
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Unit Cost"
                      type="number"
                      value={item.unitCost}
                      onChange={(e) => updateOrderItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                      size="small"
                      required
                      inputProps={{ step: '0.01', min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={3} md={2}>
                    <TextField
                      label="Line Total"
                      value={(item.quantity * item.unitCost).toFixed(2)}
                      size="small"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={1} md={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeOrderItem(index)}
                      disabled={orderItems.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addOrderItem}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Add Item
            </Button>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="body2">
                Items: {orderItems.filter(item => item.product).length}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !selectedSupplier || orderItems.filter(item => item.product).length === 0}
        >
          {loading ? 'Creating...' : 'Create Purchase Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDialog;


