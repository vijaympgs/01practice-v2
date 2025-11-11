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
} from '@mui/material';
import inventoryService from '../../services/inventoryService';
import productService from '../../services/productService';

const StockAdjustmentDialog = ({ open, onClose, onSuccess, inventoryItem = null }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('increase');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchInventoryData();
      if (inventoryItem) {
        setSelectedItem(inventoryItem);
      }
    }
  }, [open, inventoryItem]);

  useEffect(() => {
    if (!inventoryItem && selectedItem) {
      // Reset form when new item is selected
      setAdjustmentType('increase');
      setQuantity('');
      setReason('');
      setNotes('');
    }
  }, [selectedItem, inventoryItem]);

  const fetchInventoryData = async () => {
    try {
      const response = await inventoryService.getInventoryList({ page_size: 1000 });
      setInventoryData(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedItem || !quantity || !reason) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await inventoryService.adjustStock(selectedItem.id, {
        adjustment_type: adjustmentType,
        quantity: parseInt(quantity),
        reason: reason,
        notes: notes,
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedItem(inventoryItem || null);
    setAdjustmentType('increase');
    setQuantity('');
    setReason('');
    setNotes('');
    setError(null);
    onClose();
  };

  const getNewStockLevel = () => {
    if (!selectedItem || !quantity) return null;

    const currentStock = selectedItem.current_stock || 0;
    const adjustment = parseInt(quantity) || 0;

    if (adjustmentType === 'increase') {
      return currentStock + adjustment;
    } else if (adjustmentType === 'decrease') {
      return Math.max(0, currentStock - adjustment);
    } else {
      return adjustment;
    }
  };

  const isQuantityValid = () => {
    if (!selectedItem || !quantity) return true;
    
    const adjustment = parseInt(quantity);
    if (adjustmentType === 'decrease') {
      return adjustment <= selectedItem.current_stock;
    }
    return adjustment > 0;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Stock Adjustment</Typography>
        <Typography variant="body2" color="text.secondary">
          Adjust inventory levels for products
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Product Selection */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={inventoryData}
              getOptionLabel={(option) => `${option.product_name} (${option.product_sku})`}
              value={selectedItem}
              onChange={(event, newValue) => setSelectedItem(newValue)}
              disabled={!!inventoryItem} // Disable if item is preselected
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product"
                  placeholder="Search products..."
                  required
                  fullWidth
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box width="100%">
                    <Typography variant="body2" fontWeight="bold">
                      {option.product_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      SKU: {option.product_sku} • Stock: {option.current_stock} • $ {option.cost_price}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Grid>

          {/* Adjustment Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Adjustment Type</InputLabel>
              <Select
                value={adjustmentType}
                label="Adjustment Type"
                onChange={(e) => setAdjustmentType(e.target.value)}
              >
                <MenuItem value="increase">Increase Stock</MenuItem>
                <MenuItem value="decrease">Decrease Stock</MenuItem>
                <MenuItem value="set">Set Stock Level</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Quantity */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={adjustmentType === 'set' ? 'New Stock Quantity' : 'Adjustment Quantity'}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              error={!isQuantityValid()}
              helperText={
                !isQuantityValid() 
                  ? 'Cannot reduce stock below zero'
                  : adjustmentType === 'increase'
                  ? 'Add this amount to current stock'
                  : adjustmentType === 'decrease'
                  ? 'Subtract this amount from current stock'
                  : 'Set stock to this exact amount'
              }
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Current Stock Display */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Current Stock"
              value={selectedItem?.current_stock || 0}
              InputProps={{ readOnly: true }}
              sx={{ '& .MuiInputBase-input': { backgroundColor: 'grey.100' } }}
            />
          </Grid>

          {/* New Stock Level Preview */}
          {quantity && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Stock Level"
                value={getNewStockLevel() || ''}
                InputProps={{ readOnly: true }}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    fontWeight: 'bold'
                  } 
                }}
              />
            </Grid>
          )}

          {/* Reason */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Reason</InputLabel>
              <Select
                value={reason}
                label="Reason"
                onChange={(e) => setReason(e.target.value)}
              >
                <MenuItem value="stock_adjustment">Stock Adjustment</MenuItem>
                <MenuItem value="damage">Product Damage</MenuItem>
                <MenuItem value="theft">Theft</MenuItem>
                <MenuItem value="return">Return from Customer</MenuItem>
                <MenuItem value="supplier_return">Return to Supplier</MenuItem>
                <MenuItem value="audit">Inventory Audit</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes about this adjustment..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !selectedItem || !quantity || !reason || !isQuantityValid()}
        >
          {loading ? 'Adjusting...' : 'Adjust Stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockAdjustmentDialog;
