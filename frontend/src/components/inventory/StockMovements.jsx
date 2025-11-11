import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
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
  Badge,
  Avatar,
} from '@mui/material';
import {
  SwapHoriz as TransferIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  LocationOn as LocationIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';

const StockMovements = ({ onRefresh }) => {
  const [movements, setMovements] = useState([]);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [transferForm, setTransferForm] = useState({
    fromLocation: '',
    toLocation: '',
    product: '',
    quantity: '',
    reason: ''
  });
  const [adjustmentForm, setAdjustmentForm] = useState({
    product: '',
    quantity: '',
    reason: '',
    movementType: 'adjustment'
  });
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockMovements = [
      {
        id: '1',
        movement_type: 'transfer_in',
        product: {
          name: 'Samsung Galaxy S24',
          sku: 'SAM-GAL-S24-128',
          category: 'Smartphones'
        },
        quantity_change: 50,
        quantity_before: 45,
        quantity_after: 95,
        unit_cost: 899.99,
        total_cost: 44999.50,
        reference_number: 'TR-000001',
        from_location: 'Warehouse B',
        to_location: 'Warehouse A',
        reason: 'Stock redistribution for better availability',
        notes: 'Transfer completed successfully',
        status: 'completed',
        created_by: 'John Smith',
        created_at: '2025-01-10T14:30:00Z'
      },
      {
        id: '2',
        movement_type: 'adjustment',
        product: {
          name: 'Apple MacBook Pro 16"',
          sku: 'APP-MBP-16-512',
          category: 'Laptops'
        },
        quantity_change: -2,
        quantity_before: 8,
        quantity_after: 6,
        unit_cost: 2399.99,
        total_cost: 4799.98,
        reference_number: 'ADJ-000002',
        from_location: 'Warehouse A',
        to_location: null,
        reason: 'Physical count discrepancy - damaged units found',
        notes: 'Two units found damaged during cycle count',
        status: 'completed',
        created_by: 'Sarah Johnson',
        created_at: '2025-01-10T11:15:00Z'
      },
      {
        id: '3',
        movement_type: 'transfer_out',
        product: {
          name: 'Dell OptiPlex 7090',
          sku: 'DEL-OPT-7090-256',
          category: 'Desktops'
        },
        quantity_change: -10,
        quantity_before: 25,
        quantity_after: 15,
        unit_cost: 699.99,
        total_cost: 6999.90,
        reference_number: 'TR-000003',
        from_location: 'Warehouse A',
        to_location: 'Store Location 1',
        reason: 'Store restocking',
        notes: 'Regular store restocking transfer',
        status: 'completed',
        created_by: 'Mike Wilson',
        created_at: '2025-01-09T16:45:00Z'
      },
      {
        id: '4',
        movement_type: 'damage',
        product: {
          name: 'iPad Pro 12.9"',
          sku: 'APP-IPAD-PRO-256',
          category: 'Tablets'
        },
        quantity_change: -1,
        quantity_before: 12,
        quantity_after: 11,
        unit_cost: 1099.99,
        total_cost: 1099.99,
        reference_number: 'DMG-000004',
        from_location: 'Warehouse A',
        to_location: null,
        reason: 'Damaged during handling',
        notes: 'Screen cracked during unloading process',
        status: 'completed',
        created_by: 'Lisa Chen',
        created_at: '2025-01-09T09:30:00Z'
      },
      {
        id: '5',
        movement_type: 'theft',
        product: {
          name: 'Sony WH-1000XM5',
          sku: 'SON-WH-1000XM5',
          category: 'Audio'
        },
        quantity_change: -1,
        quantity_before: 8,
        quantity_after: 7,
        unit_cost: 399.99,
        total_cost: 399.99,
        reference_number: 'THF-000005',
        from_location: 'Warehouse A',
        to_location: null,
        reason: 'Security incident - missing item',
        notes: 'Item reported missing during security audit',
        status: 'pending',
        created_by: 'Security Team',
        created_at: '2025-01-08T20:15:00Z'
      }
    ];

    setMovements(mockMovements);
    setLoading(false);
  }, []);

  const getMovementTypeColor = (type) => {
    switch (type) {
      case 'transfer_in': return 'success';
      case 'transfer_out': return 'info';
      case 'adjustment': return 'warning';
      case 'damage': return 'error';
      case 'theft': return 'error';
      case 'return': return 'secondary';
      default: return 'default';
    }
  };

  const getMovementTypeIcon = (type) => {
    switch (type) {
      case 'transfer_in': return <TrendingUpIcon />;
      case 'transfer_out': return <TrendingDownIcon />;
      case 'adjustment': return <EditIcon />;
      case 'damage': return <WarningIcon />;
      case 'theft': return <WarningIcon />;
      default: return <InventoryIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleTransferStock = () => {
    setTransferForm({
      fromLocation: '',
      toLocation: '',
      product: '',
      quantity: '',
      reason: ''
    });
    setTransferDialogOpen(true);
  };

  const handleStockAdjustment = () => {
    setAdjustmentForm({
      product: '',
      quantity: '',
      reason: '',
      movementType: 'adjustment'
    });
    setAdjustmentDialogOpen(true);
  };

  const handleTransferSubmit = () => {
    // Handle transfer logic
    console.log('Stock transfer:', transferForm);
    setTransferDialogOpen(false);
    onRefresh && onRefresh();
  };

  const handleAdjustmentSubmit = () => {
    // Handle adjustment logic
    console.log('Stock adjustment:', adjustmentForm);
    setAdjustmentDialogOpen(false);
    onRefresh && onRefresh();
  };

  const movementTypes = [
    { value: 'transfer_in', label: 'Transfer In', color: 'success' },
    { value: 'transfer_out', label: 'Transfer Out', color: 'info' },
    { value: 'adjustment', label: 'Adjustment', color: 'warning' },
    { value: 'damage', label: 'Damage', color: 'error' },
    { value: 'theft', label: 'Theft', color: 'error' },
    { value: 'return', label: 'Return', color: 'secondary' }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading stock movements...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<TransferIcon />}
          onClick={handleTransferStock}
          sx={{
            borderColor: '#2196f3',
            color: '#2196f3',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(33, 150, 243, 0.04)'
            }
          }}
        >
          Transfer Stock
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleStockAdjustment}
          sx={{
            borderColor: '#ff9800',
            color: '#ff9800',
            '&:hover': {
              borderColor: '#f57c00',
              backgroundColor: 'rgba(255, 152, 0, 0.04)'
            }
          }}
        >
          Stock Adjustment
        </Button>
        <Button
          variant="outlined"
          startIcon={<ViewIcon />}
          sx={{
            borderColor: '#4caf50',
            color: '#4caf50',
            '&:hover': {
              borderColor: '#388e3c',
              backgroundColor: 'rgba(76, 175, 80, 0.04)'
            }
          }}
        >
          Movement Reports
        </Button>
      </Box>

      {/* Movement Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {movementTypes.map((type) => {
          const count = movements.filter(m => m.movement_type === type.value).length;
          return (
            <Grid item xs={12} md={6} lg={2} key={type.value}>
              <Card 
                sx={{ 
                  textAlign: 'center',
                  border: `2px solid`,
                  borderColor: `${type.color}.main`,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardContent>
                  <Avatar sx={{ bgcolor: `${type.color}.main`, mx: 'auto', mb: 1 }}>
                    {getMovementTypeIcon(type.value)}
                  </Avatar>
                  <Typography variant="h6" color={`${type.color}.main`}>
                    {count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Movements Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Recent Stock Movements
            </Typography>
            <Button startIcon={<PrintIcon />} size="small">
              Export Report
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Movement</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity Change</TableCell>
                  <TableCell>From/To Location</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: `${getMovementTypeColor(movement.movement_type)}.main`, width: 32, height: 32 }}>
                          {getMovementTypeIcon(movement.movement_type)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {movement.movement_type.replace('_', ' ').toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {movement.reason}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {movement.product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {movement.product.sku}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {movement.quantity_change > 0 ? (
                          <TrendingUpIcon color="success" fontSize="small" />
                        ) : (
                          <TrendingDownIcon color="error" fontSize="small" />
                        )}
                        <Typography 
                          variant="body2" 
                          fontWeight={600}
                          color={movement.quantity_change > 0 ? 'success.main' : 'error.main'}
                        >
                          {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {movement.quantity_before} → {movement.quantity_after}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {movement.from_location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              From: {movement.from_location}
                            </Typography>
                          </Box>
                        )}
                        {movement.to_location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              To: {movement.to_location}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {movement.reference_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(movement.total_cost)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @ {formatCurrency(movement.unit_cost)}/unit
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {movement.created_by}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(movement.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={movement.status.toUpperCase()}
                        color={getStatusColor(movement.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Movement">
                          <IconButton size="small">
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Transfer Stock Dialog */}
      <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Transfer Stock Between Locations</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>From Location</InputLabel>
            <Select
              value={transferForm.fromLocation}
              onChange={(e) => setTransferForm({ ...transferForm, fromLocation: e.target.value })}
            >
              <MenuItem value="warehouse-a">Warehouse A</MenuItem>
              <MenuItem value="warehouse-b">Warehouse B</MenuItem>
              <MenuItem value="store-1">Store Location 1</MenuItem>
              <MenuItem value="store-2">Store Location 2</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>To Location</InputLabel>
            <Select
              value={transferForm.toLocation}
              onChange={(e) => setTransferForm({ ...transferForm, toLocation: e.target.value })}
            >
              <MenuItem value="warehouse-a">Warehouse A</MenuItem>
              <MenuItem value="warehouse-b">Warehouse B</MenuItem>
              <MenuItem value="store-1">Store Location 1</MenuItem>
              <MenuItem value="store-2">Store Location 2</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Product</InputLabel>
            <Select
              value={transferForm.product}
              onChange={(e) => setTransferForm({ ...transferForm, product: e.target.value })}
            >
              <MenuItem value="samsung-s24">Samsung Galaxy S24</MenuItem>
              <MenuItem value="macbook-pro">Apple MacBook Pro 16"</MenuItem>
              <MenuItem value="dell-optiplex">Dell OptiPlex 7090</MenuItem>
              <MenuItem value="ipad-pro">iPad Pro 12.9"</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Quantity to Transfer"
            type="number"
            value={transferForm.quantity}
            onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />

          <TextField
            fullWidth
            label="Transfer Reason"
            multiline
            rows={3}
            value={transferForm.reason}
            onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
            placeholder="Enter reason for stock transfer..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTransferSubmit} variant="contained">
            Transfer Stock
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustmentDialogOpen} onClose={() => setAdjustmentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Stock Adjustment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Movement Type</InputLabel>
            <Select
              value={adjustmentForm.movementType}
              onChange={(e) => setAdjustmentForm({ ...adjustmentForm, movementType: e.target.value })}
            >
              <MenuItem value="adjustment">Stock Adjustment</MenuItem>
              <MenuItem value="damage">Damage</MenuItem>
              <MenuItem value="theft">Theft</MenuItem>
              <MenuItem value="return">Return</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Product</InputLabel>
            <Select
              value={adjustmentForm.product}
              onChange={(e) => setAdjustmentForm({ ...adjustmentForm, product: e.target.value })}
            >
              <MenuItem value="samsung-s24">Samsung Galaxy S24</MenuItem>
              <MenuItem value="macbook-pro">Apple MacBook Pro 16"</MenuItem>
              <MenuItem value="dell-optiplex">Dell OptiPlex 7090</MenuItem>
              <MenuItem value="ipad-pro">iPad Pro 12.9"</MenuItem>
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
          <Button onClick={() => setAdjustmentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAdjustmentSubmit} variant="contained">
            Apply Adjustment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockMovements;
