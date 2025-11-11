import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as CancelIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import PurchaseOrderDetailsDialog from '../components/purchase/PurchaseOrderDetailsDialog';

const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [page, rowsPerPage, searchQuery, statusFilter]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockData = {
        results: [
          {
            id: '1',
            po_number: 'PO-000001',
            supplier_name: 'Coffee Supply Co.',
            status: 'ordered',
            total_amount: 1580.50,
            items_count: 4,
            ordered_date: '2025-01-02T14:30:00Z',
            expected_delivery: '2025-01-08T00:00:00Z',
            created_by: 'Admin User',
            notes: 'Urgent delivery required'
          },
          {
            id: '2',
            po_number: 'PO-000002',
            supplier_name: 'Tea Masters LLC',
            status: 'pending',
            total_amount: 845.75,
            items_count: 6,
            ordered_date: '2025-01-01T10:15:00Z',
            expected_delivery: '2025-01-10T00:00:00Z',
            created_by: 'Admin User',
            notes: 'Special blend order'
          },
          {
            id: '3',
            po_number: 'PO-000003',
            supplier_name: 'Kitchen Equipment Inc',
            status: 'received',
            total_amount: 2250.00,
            items_count: 3,
            ordered_date: '2024-12-28T16:45:00Z',
            expected_delivery: '2025-01-05T00:00:00Z',
            created_by: 'Admin User',
            notes: 'Grinder replacement order'
          }
        ],
        count: 3
      };
      
      setPurchaseOrders(mockData.results);
      setTotalCount(mockData.count);
    } catch (err) {
      setError('Failed to load purchase orders');
      console.error('Purchase orders load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleApproveOrder = (orderId) => {
    // Mock approval
    alert(`Purchase Order ${orderId} approved!`);
  };

  const handleCancelOrder = (orderId) => {
    // Mock cancellation
    alert(`Purchase Order ${orderId} cancelled!`);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      pending: 'warning',
      ordered: 'info',
      'partially_received': 'primary',
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

  const columns = [
    {
      id: 'po_number',
      label: 'PO #',
      minWidth: 120,
      render: (order) => (
        <Box>
          <Typography variant="body2" fontWeight="bold" color="primary">
            {order.po_number}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(order.ordered_date).toLocaleDateString()}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'supplier_name',
      label: 'Supplier',
      minWidth: 180,
      render: (order) => (
        <Typography variant="body2">
          {order.supplier_name}
        </Typography>
      ),
    },
    {
      id: 'items_count',
      label: 'Items',
      minWidth: 80,
      align: 'center',
      render: (order) => (
        <Typography variant="body2">
          {order.items_count}
        </Typography>
      ),
    },
    {
      id: 'total_amount',
      label: 'Total Amount',
      minWidth: 140,
      align: 'right',
      render: (order) => (
        <Typography variant="body2" fontWeight="bold">
          ${order.total_amount.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 130,
      render: (order) => (
        <Chip 
          label={getStatusLabel(order.status)} 
          color={getStatusColor(order.status)} 
          size="small" 
        />
      ),
    },
    {
      id: 'expected_delivery',
      label: 'Expected Delivery',
      minWidth: 140,
      render: (order) => (
        <Typography variant="body2">
          {new Date(order.expected_delivery).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: 'created_by',
      label: 'Created By',
      minWidth: 120,
      render: (order) => (
        <Typography variant="body2">
          {order.created_by}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'center',
      render: (order) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => handleViewOrder(order)}>
            <VisibilityIcon />
          </IconButton>
          {order.status === 'pending' && (
            <IconButton 
              size="small" 
              color="success"
              onClick={() => handleApproveOrder(order.id)}
            >
              <ApproveIcon />
            </IconButton>
          )}
          {(order.status === 'pending' || order.status === 'draft') && (
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleCancelOrder(order.id)}
            >
              <CancelIcon />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4, pb: 3 }}>
        <Typography>Loading purchase orders...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: '1.8rem', // Consistent with dashboard
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            📦 Purchase Orders
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.875rem', // 14px - smaller secondary text
              fontWeight: 400,
              lineHeight: 1.4,
              mt: 0.5
            }}
          >
            Manage supplier purchases, track deliveries, and inventory replenishments
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<AssessmentIcon />}>
            Procurement Reports
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            New Purchase Order
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ShippingIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {totalCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {purchaseOrders.filter(po => po.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Approval
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {purchaseOrders.filter(po => po.status === 'ordered').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Order
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  ${purchaseOrders.reduce((sum, po) => sum + po.total_amount, 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search purchase orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="ordered">Ordered</MenuItem>
                  <MenuItem value="received">Received</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Expected Delivery"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="outlined" startIcon={<FilterIcon />} fullWidth>
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ minWidth: column.minWidth, backgroundColor: 'grey.50' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseOrders.map((order) => (
                  <TableRow hover key={order.id}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                      >
                        {column.render ? column.render(order) : order[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Purchase Order Details Dialog */}
      <PurchaseOrderDetailsDialog 
        order={selectedOrder}
        open={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedOrder(null);
        }}
      />
    </Container>
  );
};

export default PurchaseOrdersPage;
