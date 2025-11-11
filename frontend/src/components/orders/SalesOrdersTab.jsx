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
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  TrendingUp as SalesIcon,
} from '@mui/icons-material';

const SalesOrdersTab = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const loadSalesOrders = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockOrders = [
        {
          id: 'SO-001',
          customer: 'John Doe',
          customer_email: 'john@example.com',
          total_amount: 125.50,
          status: 'completed',
          items_count: 3,
          created_at: '2025-01-03T10:30:00Z',
          payment_method: 'card',
          payment_status: 'paid'
        },
        {
          id: 'SO-002',
          customer: 'Jane Smith',
          customer_email: 'jane@example.com',
          total_amount: 89.99,
          status: 'processing',
          items_count: 2,
          created_at: '2025-01-03T09:15:00Z',
          payment_method: 'cash',
          payment_status: 'paid'
        },
        {
          id: 'SO-003',
          customer: 'Mike Johnson',
          customer_email: 'mike@example.com',
          total_amount: 234.75,
          status: 'pending',
          items_count: 5,
          created_at: '2025-01-03T08:45:00Z',
          payment_method: 'card',
          payment_status: 'pending'
        },
        {
          id: 'SO-004',
          customer: 'Sarah Wilson',
          customer_email: 'sarah@example.com',
          total_amount: 156.30,
          status: 'completed',
          items_count: 4,
          created_at: '2025-01-03T07:20:00Z',
          payment_method: 'cash',
          payment_status: 'paid'
        }
      ];
      
      setSalesOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load sales orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (orderId) => {
    console.log('View order:', orderId);
    // Implement order details view
  };

  const handleEditOrder = (orderId) => {
    console.log('Edit order:', orderId);
    // Implement order editing
  };

  const handlePrintReceipt = (orderId) => {
    console.log('Print receipt for:', orderId);
    // Implement receipt printing
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SalesIcon color="success" />
        Sales Transactions Management
      </Typography>

      {/* Order Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {salesOrders.filter(o => o.status === 'completed').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completed Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" color="warning.main" fontWeight="bold">
                {salesOrders.filter(o => o.status === 'processing').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Processing Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" color="info.main" fontWeight="bold">
                {salesOrders.filter(o => o.status === 'pending').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                ${salesOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Sales Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search orders..."
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
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
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
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {order.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {order.customer}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.customer_email}
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
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1)}
                    </Typography>
                    <br />
                    <Chip 
                      size="small" 
                      label={order.payment_status} 
                      color={getPaymentStatusColor(order.payment_status)}
                      variant="outlined"
                    />
                  </Box>
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
                      onClick={() => handleViewOrder(order.id)}
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
                    <IconButton 
                      size="small" 
                      onClick={() => handlePrintReceipt(order.id)}
                      color="success"
                    >
                      <ReceiptIcon />
                    </IconButton>
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
            No sales orders found matching your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SalesOrdersTab;
