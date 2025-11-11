import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';

const StockOverview = ({ onRefresh, onStockAdjust, onEditStock }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState({
    quantity: '',
    reason: '',
    movementType: 'adjustment'
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockStockData = [
      {
        id: '1',
        product: {
          name: 'Samsung Galaxy S24',
          sku: 'SAM-GAL-S24-128',
          category: 'Smartphones'
        },
        current_stock: 45,
        reserved_stock: 12,
        available_stock: 33,
        min_stock_level: 20,
        max_stock_level: 100,
        reorder_point: 25,
        cost_price: 899.99,
        selling_price: 1299.99,
        location: 'Warehouse A',
        bin_location: 'A-15-03',
        status: 'in_stock',
        last_movement_date: '2025-01-10T14:30:00Z',
        stock_turnover: 2.3,
        days_supply: 45
      },
      {
        id: '2',
        product: {
          name: 'Apple MacBook Pro 16"',
          sku: 'APP-MBP-16-512',
          category: 'Laptops'
        },
        current_stock: 8,
        reserved_stock: 3,
        available_stock: 5,
        min_stock_level: 10,
        max_stock_level: 50,
        reorder_point: 12,
        cost_price: 2399.99,
        selling_price: 2999.99,
        location: 'Warehouse A',
        bin_location: 'A-08-01',
        status: 'low_stock',
        last_movement_date: '2025-01-09T16:45:00Z',
        stock_turnover: 1.8,
        days_supply: 20
      },
      {
        id: '3',
        product: {
          name: 'Dell OptiPlex 7090',
          sku: 'DEL-OPT-7090-256',
          category: 'Desktops'
        },
        current_stock: 0,
        reserved_stock: 0,
        available_stock: 0,
        min_stock_level: 5,
        max_stock_level: 30,
        reorder_point: 8,
        cost_price: 699.99,
        selling_price: 899.99,
        location: 'Warehouse B',
        bin_location: 'B-12-05',
        status: 'out_of_stock',
        last_movement_date: '2025-01-08T10:15:00Z',
        stock_turnover: 3.2,
        days_supply: 0
      }
    ];

    setStockData(mockStockData);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'error';
      case 'discontinued': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock': return <CheckCircleIcon />;
      case 'low_stock': return <WarningIcon />;
      case 'out_of_stock': return <WarningIcon />;
      default: return <InventoryIcon />;
    }
  };

  const getStockUtilization = (current, max) => {
    if (max === 0) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const handleStockAdjust = (stock) => {
    setSelectedStock(stock);
    setAdjustmentForm({
      quantity: '',
      reason: '',
      movementType: 'adjustment'
    });
    setAdjustDialogOpen(true);
  };

  const handleEditStock = (stock) => {
    setSelectedStock(stock);
    setEditDialogOpen(true);
  };

  const handleAdjustmentSubmit = () => {
    // Handle stock adjustment logic
    console.log('Stock adjustment:', adjustmentForm);
    setAdjustDialogOpen(false);
    onRefresh && onRefresh();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading stock data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Stock Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stockData.map((stock) => (
          <Grid item xs={12} md={6} lg={4} key={stock.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: stock.status === 'out_of_stock' ? '2px solid #f44336' : 
                       stock.status === 'low_stock' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {stock.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      SKU: {stock.product.sku}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(stock.status)}
                      label={stock.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(stock.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Adjust Stock">
                      <IconButton size="small" onClick={() => handleStockAdjust(stock)}>
                        <TrendingUpIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Stock">
                      <IconButton size="small" onClick={() => handleEditStock(stock)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Stock Levels */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Current Stock</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stock.current_stock} units
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getStockUtilization(stock.current_stock, stock.max_stock_level)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stock.status === 'out_of_stock' ? '#f44336' : 
                                        stock.status === 'low_stock' ? '#ff9800' : '#4caf50'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Min: {stock.min_stock_level}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Max: {stock.max_stock_level}
                    </Typography>
                  </Box>
                </Box>

                {/* Stock Details */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Available</Typography>
                    <Typography variant="body2" color="primary" fontWeight={600}>
                      {stock.available_stock}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Reserved</Typography>
                    <Typography variant="body2" color="warning.main">
                      {stock.reserved_stock}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Days Supply</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stock.days_supply} days
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Location & Pricing */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {stock.bin_location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ShoppingCartIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(stock.selling_price)}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                {stock.status === 'low_stock' && (
                  <Alert severity="warning" sx={{ mt: 1, py: 0.5 }}>
                    <Typography variant="caption">
                      Below reorder point ({stock.reorder_point})
                    </Typography>
                  </Alert>
                )}

                {stock.status === 'out_of_stock' && (
                  <Alert severity="error" sx={{ mt: 1, py: 0.5 }}>
                    <Typography variant="caption">
                      Out of stock - immediate reorder required
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustDialogOpen} onClose={() => setAdjustDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adjust Stock Level</DialogTitle>
        <DialogContent>
          {selectedStock && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Product: {selectedStock.product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Stock: {selectedStock.current_stock} units
              </Typography>
            </Box>
          )}
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Movement Type</InputLabel>
            <Select
              value={adjustmentForm.movementType}
              onChange={(e) => setAdjustmentForm({ ...adjustmentForm, movementType: e.target.value })}
            >
              <MenuItem value="adjustment">Stock Adjustment</MenuItem>
              <MenuItem value="transfer_in">Transfer In</MenuItem>
              <MenuItem value="transfer_out">Transfer Out</MenuItem>
              <MenuItem value="damage">Damage</MenuItem>
              <MenuItem value="theft">Theft</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Quantity Change"
            type="number"
            value={adjustmentForm.quantity}
            onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: e.target.value })}
            sx={{ mb: 2 }}
            helperText="Positive for increase, negative for decrease"
          />

          <TextField
            fullWidth
            label="Reason"
            multiline
            rows={3}
            value={adjustmentForm.reason}
            onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
            placeholder="Enter reason for stock adjustment..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAdjustmentSubmit} variant="contained">
            Apply Adjustment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Stock Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Stock Settings</DialogTitle>
        <DialogContent>
          {selectedStock && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Product: {selectedStock.product.name}
              </Typography>
              
              <TextField
                fullWidth
                label="Minimum Stock Level"
                type="number"
                defaultValue={selectedStock.min_stock_level}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Maximum Stock Level"
                type="number"
                defaultValue={selectedStock.max_stock_level}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Reorder Point"
                type="number"
                defaultValue={selectedStock.reorder_point}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Location"
                defaultValue={selectedStock.location}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Bin Location"
                defaultValue={selectedStock.bin_location}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockOverview;
