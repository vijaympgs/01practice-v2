import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as CancelIcon,
  ShoppingCartCheckout as PurchaseIcon,
} from '@mui/icons-material';

const PurchaseOrdersTab = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const loadPurchaseOrders = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockOrders = [
        {
          id: 'PO-001',
          po_number: 'PO-2025-001',
          supplier: 'Coffee Supply Co.',
          supplier_email: 'orders@coffeesupply.com',
          total_amount: 1250.75,
          status: 'pending',
          items_count: 15,
          created_at: '2025-01-03T09:30:00Z',
          approved_by: null,
          approved_at: null,
          expected_delivery: '2025-01-10'
        },
        {
          id: 'PO-002',
          po_number: 'PO-2025-002',
          supplier: 'Tea Masters LLC',
          supplier_email: 'procurement@teamasters.com',
          total_amount: 890.50,
          status: 'approved',
          items_count: 8,
          created_at: '2025-01-03T08:15:00Z',
          approved_by: 'John Admin',
          approved_at: '2025-01-03T10:00:00Z',
          expected_delivery: '2025-01-08'
        },
        {
          id: 'PO-003',
          po_number: 'PO-2025-003',
          supplier: 'Kitchen Equipment Inc',
          supplier_email: 'sales@kitchenequip.com',
          total_amount: 2340.25,
          status: 'received',
          items_count: 22,
          created_at: '2025-01-02T14:20:00Z',
          approved_by: 'Sarah Manager',
          approved_at: '2025-01-02T16:30:00Z',
          expected_delivery: '2025-01-05'
        },
        {
          id: 'PO-004',
          po_number: 'PO-2025-004',
          supplier: 'Office Supplies Plus',
          supplier_email: 'orders@officesupplies.com',
          total_amount: 567.80,
          status: 'cancelled',
          items_count: 6,
          created_at: '2025-01-01T11:45:00Z',
          approved_by: null,
          approved_at: null,
          expected_delivery: '2025-01-07'
        }
      ];
      
      setPurchaseOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'info';
      case 'approved': return 'success';
      case 'ordered': return 'warning';
      case 'received': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <ApproveIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <PurchaseIcon />;
    }
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleApproveOrder = (orderId) => {
    console.log('Approve order:', orderId);
    // Implement order approval logic
  };

  const handleCancelOrder = (orderId) => {
    console.log('Cancel order:', orderId);
    // Implement order cancellation logic
  };

  const handleEditOrder = (orderId) => {
    console.log('Edit order:', orderId);
    // Implement order editing
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PurchaseIcon color="warning" />
        Purchase Transactions Management
      </Typography>

      {/* Order Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" color="info.main" fontWeight="bold">
                {purchaseOrders.filter(o => o.status === 'pending').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending Approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {purchaseOrders.filter(o => o.status === 'approved').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Approved Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {purchaseOrders.filter(o => o.status === 'received').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Received Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                ${purchaseOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Order Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<PurchaseIcon />}
          sx={{ mr: 2 }}
        >
          New Purchase Transaction
        </Button>
        <Button 
          variant="outlined" 
          color="info"
          startIcon={<SearchIcon />}
        >
          Advanced Search
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search purchase transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="ordered">Ordered</MenuItem>
            <MenuItem value="received">Received</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expected Delivery</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {order.po_number}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {order.supplier}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.supplier_email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{order.items_count}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    ${order.total_amount.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                    color={getStatusColor(order.status)}
                    icon={getStatusIcon(order.status)}
                  />
                </TableCell>
                <TableCell>
                  {order.expected_delivery ? (
                    <Typography variant="caption">
                      {new Date(order.expected_delivery).toLocaleDateString()}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      TBD
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {new Date(order.created_at).toLocaleDateString()}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewOrder(order)}
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditOrder(order.id)}
                      color="warning"
                    >
                      <EditIcon />
                    </IconButton>
                    {order.status === 'pending' && (
                      <>
                        <IconButton 
                          size="small" 
                          onClick={() => handleApproveOrder(order.id)}
                          color="success"
                        >
                          <ApproveIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleCancelOrder(order.id)}
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredOrders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No purchase transactions found matching your criteria.
          </Typography>
        </Box>
      )}

      {/* Order Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Purchase Order Details - {selectedOrder?.po_number}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Order details content would go here */}
              <Typography variant="h6" gutterBottom>
                Supplier Information
              </Typography>
              <Typography variant="body1">{selectedOrder.supplier}</Typography>
              <Typography variant="body2" color="text.secondary">{selectedOrder.supplier_email}</Typography>
              
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Typography variant="body1">Total Amount: ${selectedOrder.total_amount.toFixed(2)}</Typography>
              <Typography variant="body1">Items: {selectedOrder.items_count}</Typography>
              <Typography variant="body1">Status: {selectedOrder.status}</Typography>
              {selectedOrder.expected_delivery && (
                <Typography variant="body1">Expected Delivery: {new Date(selectedOrder.expected_delivery).toLocaleDateString()}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          <Button onClick={() => setDetailsDialogOpen(false)} variant="contained">Edit Order</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrdersTab;
