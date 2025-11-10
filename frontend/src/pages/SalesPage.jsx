import React, { useState, useEffect } from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
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
  Tabs,
  Tab,
  Paper,
  IconButton,
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
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import SalesDetailsDialog from '../components/sales/SalesDetailsDialog';
import salesManagementService from '../services/salesManagementService';

const SalesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, [page, rowsPerPage, searchQuery, statusFilter, dateFilter]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
      };

      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;

      const response = await salesManagementService.getSales(params);
      
      // Mock data for now until backend is enhanced
      const mockData = {
        results: [
          {
            id: '1',
            sale_number: 'SALE-001',
            customer_name: 'John Doe',
            total_amount: 125.50,
            tax_amount: 10.05,
            discount_amount: 5.00,
            payment_status: 'paid',
            transaction_status: 'completed',
            created_at: '2025-01-03T10:30:00Z',
            items_count: 3,
            cashier_name: 'Admin User'
          },
          {
            id: '2',
            sale_number: 'SALE-002',
            customer_name: 'Walk-in Customer',
            total_amount: 89.99,
            tax_amount: 7.20,
            discount_amount: 0.00,
            payment_status: 'paid',
            transaction_status: 'completed',
            created_at: '2025-01-03T09:15:00Z',
            items_count: 2,
            cashier_name: 'Admin User'
          },
          {
            id: '3',
            sale_number: 'SALE-003',
            customer_name: 'Jane Smith',
            total_amount: 250.75,
            tax_amount: 20.06,
            discount_amount: 15.00,
            payment_status: 'pending',
            transaction_status: 'pending',
            created_at: '2025-01-03T08:45:00Z',
            items_count: 5,
            cashier_name: 'Admin User'
          }
        ],
        count: 3
      };
      
      setSales(mockData.results);
      setTotalCount(mockData.count);
    } catch (err) {
      setError('Failed to load sales data');
      console.error('Sales load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewSale = (sale) => {
    setSelectedSale(sale);
    setDetailsDialogOpen(true);
  };

  const getStatusColor = (status, type = 'payment') => {
    const colors = {
      payment: {
        paid: 'success',
        pending: 'warning',
        failed: 'error',
        refunded: 'info'
      },
      transaction: {
        completed: 'success',
        pending: 'warning',
        cancelled: 'error',
        draft: 'secondary'
      }
    };
    return colors[type][status] || 'default';
  };

  const columns = [
    {
      id: 'sale_number',
      label: 'Sale #',
      minWidth: 100,
      render: (sale) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {sale.sale_number}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(sale.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'customer_name',
      label: 'Customer',
      minWidth: 150,
      render: (sale) => (
        <Typography variant="body2">
          {sale.customer_name || 'Walk-in Customer'}
        </Typography>
      ),
    },
    {
      id: 'items_count',
      label: 'Items',
      minWidth: 80,
      align: 'center',
      render: (sale) => (
        <Typography variant="body2">
          {sale.items_count}
        </Typography>
      ),
    },
    {
      id: 'total_amount',
      label: 'Total',
      minWidth: 120,
      align: 'right',
      render: (sale) => (
        <Typography variant="body2" fontWeight="bold">
          ${sale.total_amount.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 'payment_status',
      label: 'Payment',
      minWidth: 100,
      render: (sale) => (
        <Chip 
          label={sale.payment_status} 
          color={getStatusColor(sale.payment_status)} 
          size="small" 
        />
      ),
    },
    {
      id: 'transaction_status',
      label: 'Status',
      minWidth: 100,
      render: (sale) => (
        <Chip 
          label={sale.transaction_status} 
          color={getStatusColor(sale.transaction_status, 'transaction')} 
          size="small" 
        />
      ),
    },
    {
      id: 'cashier_name',
      label: 'Cashier',
      minWidth: 120,
      render: (sale) => (
        <Typography variant="body2">
          {sale.cashier_name}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      align: 'center',
      render: (sale) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => handleViewSale(sale)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton size="small">
            <PrintIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4, pb: 3 }}>
        <Typography>Loading sales...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <PageTitle 
            title="💳 Sales & Order Management" 
            subtitle="Track sales transactions, orders, and revenue analytics"
          />
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
            Track sales transactions, payments, and customer orders
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<AssessmentIcon />}>
            View Reports
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            New Sale
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <MonetizationOnIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  $1,456.24
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Sales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {totalCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  $89.99
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Sale
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Orders
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
                placeholder="Search sales transactions..."
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
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
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

      {/* Sales Table */}
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
                {sales.map((sale) => (
                  <TableRow hover key={sale.id}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                      >
                        {column.render ? column.render(sale) : sale[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerTableOptions={[5, 10, 25, 50]}
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

      {/* Sale Details Dialog */}
      <SalesDetailsDialog 
        sale={selectedSale}
        open={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedSale(null);
        }}
      />
    </Container>
  );
};

export default SalesPage;
