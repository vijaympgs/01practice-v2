import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const SalesOrderAnalytics = ({ orders = [], onRefresh, onExport }) => {
  const [timePeriod, setTimePeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock analytics data - replace with actual API data
  const analyticsData = {
    summary: {
      totalOrders: 156,
      totalRevenue: 245680.50,
      averageOrderValue: 1575.00,
      conversionRate: 12.5,
      growthRate: 8.2
    },
    topCustomers: [
      { name: 'ABC Corporation', orders: 25, revenue: 45680.00, growth: 15.2 },
      { name: 'XYZ Industries', orders: 18, revenue: 32450.00, growth: 8.5 },
      { name: 'DEF Enterprises', orders: 15, revenue: 28900.00, growth: -2.1 },
      { name: 'GHI Solutions', orders: 12, revenue: 23400.00, growth: 22.8 },
      { name: 'JKL Corp', orders: 10, revenue: 18900.00, growth: 5.3 }
    ],
    topProducts: [
      { name: 'Product A', sku: 'PROD-A-001', orders: 45, revenue: 45000.00, growth: 12.5 },
      { name: 'Product B', sku: 'PROD-B-002', orders: 38, revenue: 57000.00, growth: 8.2 },
      { name: 'Product C', sku: 'PROD-C-003', orders: 32, revenue: 64000.00, growth: 15.8 },
      { name: 'Product D', sku: 'PROD-D-004', orders: 28, revenue: 33600.00, growth: -3.2 },
      { name: 'Product E', sku: 'PROD-E-005', orders: 25, revenue: 37500.00, growth: 6.7 }
    ],
    salesTeam: [
      { name: 'John Smith', orders: 42, revenue: 67890.00, target: 60000.00, performance: 113.2 },
      { name: 'Jane Doe', orders: 38, revenue: 54320.00, target: 55000.00, performance: 98.8 },
      { name: 'Mike Johnson', orders: 35, revenue: 62340.00, target: 60000.00, performance: 103.9 },
      { name: 'Sarah Wilson', orders: 31, revenue: 45670.00, target: 50000.00, performance: 91.3 },
      { name: 'Tom Brown', orders: 28, revenue: 38980.00, target: 45000.00, performance: 86.6 }
    ],
    monthlyTrends: [
      { month: 'Jan', orders: 145, revenue: 228900.00 },
      { month: 'Feb', orders: 162, revenue: 245680.50 },
      { month: 'Mar', orders: 178, revenue: 267890.00 },
      { month: 'Apr', orders: 195, revenue: 289450.00 },
      { month: 'May', orders: 212, revenue: 312670.00 },
      { month: 'Jun', orders: 189, revenue: 278340.00 }
    ]
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'success';
    if (growth < 0) return 'error';
    return 'default';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUpIcon />;
    if (growth < 0) return <TrendingDownIcon />;
    return null;
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 100) return 'success';
    if (performance >= 90) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: '1.8rem', fontWeight: 600 }}>
            Sales Order Analytics
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<AssessmentIcon />} label="Performance Dashboard" color="primary" variant="outlined" />
            <Chip icon={<TrendingUpIcon />} label={`${analyticsData.summary.growthRate}% Growth`} color="success" variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExport}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={timePeriod}
                  label="Time Period"
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="90days">Last 90 Days</MenuItem>
                  <MenuItem value="1year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  label="Metric"
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  <MenuItem value="all">All Metrics</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="orders">Orders</MenuItem>
                  <MenuItem value="customers">Customers</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                fullWidth
                size="small"
              >
                Advanced Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analyticsData.summary.totalOrders}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ReceiptIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    ${analyticsData.summary.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Order Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    ${analyticsData.summary.averageOrderValue}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <ShoppingCartIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Growth Rate
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                    +{analyticsData.summary.growthRate}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Customers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Top Customers
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell align="center">Orders</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="center">Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topCustomers.map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {customer.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {customer.orders}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${customer.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getGrowthIcon(customer.growth)}
                            label={`${customer.growth > 0 ? '+' : ''}${customer.growth}%`}
                            color={getGrowthColor(customer.growth)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCartIcon color="primary" />
                Top Products
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Orders</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="center">Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.sku}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {product.orders}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${product.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getGrowthIcon(product.growth)}
                            label={`${product.growth > 0 ? '+' : ''}${product.growth}%`}
                            color={getGrowthColor(product.growth)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Team Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Sales Team Performance
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sales Person</TableCell>
                      <TableCell align="center">Orders</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Target</TableCell>
                      <TableCell align="center">Performance</TableCell>
                      <TableCell>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.salesTeam.map((person, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {person.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {person.orders}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${person.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ${person.target.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${person.performance}%`}
                            color={getPerformanceColor(person.performance)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ minWidth: 100 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(person.performance, 100)}
                              color={getPerformanceColor(person.performance)}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesOrderAnalytics;
