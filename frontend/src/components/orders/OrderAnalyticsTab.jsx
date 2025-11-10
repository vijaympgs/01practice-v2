import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  TrendingUp as UpIcon,
  TrendingDown as DownIcon,
  Assessment as AnalyticsIcon,
  ShoppingCart as OrderIcon,
  AttachMoney as RevenueIcon,
  Schedule as TimeIcon,
  Person as CustomerIcon,
} from '@mui/icons-material';

const OrderAnalyticsTab = () => {
  const [period, setPeriod] = useState('30d');
  const [orderType, setOrderType] = useState('all');

  // Mock analytics data
  const analyticsData = {
    salesOrders: {
      total: 234,
      completed: 218,
      pending: 12,
      cancelled: 4,
      avgProcessingTime: 2.3,
      totalRevenue: 45678.50,
      avgOrderValue: 195.37,
      topCustomers: [
        { name: 'John Doe', orders: 15, value: 2875.50 },
        { name: 'Jane Smith', orders: 12, value: 2340.25 },
        { name: 'Mike Johnson', orders: 10, value: 1987.75 },
      ]
    },
    purchaseOrders: {
      total: 47,
      pending: 8,
      approved: 25,
      received: 12,
      cancelled: 2,
      avgProcessingTime: 18.5,
      totalValue: 12345.80,
      avgOrderValue: 262.78,
      topSuppliers: [
        { name: 'Coffee Supply Co.', orders: 7, value: 3450.25 },
        { name: 'Tea Masters LLC', orders: 5, value: 2280.75 },
        { name: 'Kitchen Equipment Inc', orders: 4, value: 1985.30 },
      ]
    }
  };

  const getOverallMetrics = () => {
    const sales = analyticsData.salesOrders;
    const purchases = analyticsData.purchaseOrders;
    
    return {
      totalOrders: sales.total + purchases.total,
      totalRevenue: sales.totalRevenue,
      totalProcurement: purchases.totalValue,
      avgProcessingTime: (sales.avgProcessingTime + purchases.avgProcessingTime) / 2,
      orderCompletionRate: (sales.completed + purchases.approved + purchases.received) / (sales.total + purchases.total) * 100
    };
  };

  const getTrendData = (type) => {
    // Mock trend data - in real app, this would come from API
    const trends = {
      sales: { count: '+12.5%', revenue: '+18.2%', avgValue: '+8.7%' },
      purchases: { count: '-3.2%', value: '+5.1%', avgValue: '+2.3%' }
    };
    return trends[type];
  };

  const handleExportAnalytics = () => {
    console.log('Export analytics data');
    // Implement export functionality
  };

  const handleGenerateReport = () => {
    console.log('Generate order analytics report');
    // Implement report generation
  };

  const OverallMetrics = () => {
    const metrics = getOverallMetrics();
    const trends = {
      orders: '+8.3%',
      revenue: '+16.4%',
      procurement: '+2.1%',
      completion: '+3.7%'
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <OrderIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metrics.totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Orders ({period})
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  {trends.orders}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <RevenueIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                ${metrics.totalRevenue.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Sales Revenue
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  {trends.revenue}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TimeIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {metrics.avgProcessingTime.toFixed(1)}h
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Avg Processing Time
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DownIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  -15.2%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {metrics.orderCompletionRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Completion Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  {trends.completion}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const SalesOrderMetrics = () => {
    const sales = analyticsData.salesOrders;
    const trends = getTrendData('sales');

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OrderIcon color="success" />
            Sales Order Analytics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {sales.completed}/{sales.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed Orders
                </Typography>
                <Chip size="small" label={`${trends.count}`} color="success" sx={{ mt: 1 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  ${sales.avgOrderValue.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Order Value
                </Typography>
                <Chip size="small" label={`${trends.avgValue}`} color="primary" sx={{ mt: 1 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" color="warning.main" fontWeight="bold">
                  {sales.avgProcessingTime}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Processing Time
                </Typography>
                <Chip size="small" label="-5.2%" color="success" sx={{ mt: 1 }} />
              </Box>
            </Grid>
          </Grid>

          {/* Top Customers */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Top Customers ({period})
          </Typography>
          <List>
            {sales.topCustomers.map((customer, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CustomerIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={customer.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption">
                          {customer.orders} orders
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          ${customer.value.toFixed(2)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < sales.topCustomers.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const PurchaseOrderMetrics = () => {
    const purchases = analyticsData.purchaseOrders;
    const trends = getTrendData('purchases');

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OrderIcon color="warning" />
            Purchase Order Analytics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" color="info.main" fontWeight="bold">
                  {purchases.approved}/{purchases.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved Orders
                </Typography>
                <Chip size="small" label={`${trends.count}`} color="warning" sx={{ mt: 1 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  ${purchases.avgOrderValue.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Order Value
                </Typography>
                <Chip size="small" label={`${trends.avgValue}`} color="primary" sx={{ mt: 1 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" color="warning.main" fontWeight="bold">
                  {purchases.avgProcessingTime}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Processing Time
                </Typography>
                <Chip size="small" label="+2.5%" color="error" sx={{ mt: 1 }} />
              </Box>
            </Grid>
          </Grid>

          {/* Status Breakdown */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Order Status Breakdown
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip label={`Pending: ${purchases.pending}`} color="info" />
            <Chip label={`Approved: ${purchases.approved}`} color="success" />
            <Chip label={`Received: ${purchases.received}`} color="success" />
            <Chip label={`Cancelled: ${purchases.cancelled}`} color="error" />
          </Box>

          {/* Top Suppliers */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Top Suppliers ({period})
          </Typography>
          <List>
            {purchases.topSuppliers.map((supplier, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <OrderIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={supplier.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption">
                          {supplier.orders} orders
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          ${supplier.value.toFixed(2)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < purchases.topSuppliers.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon color="info" />
        Transaction Analytics Dashboard
      </Typography>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Period</InputLabel>
          <Select value={period} label="Time Period" onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="1y">Last Year</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Order Type</InputLabel>
          <Select value={orderType} label="Order Type" onChange={(e) => setOrderType(e.target.value)}>
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="sales">Sales Orders</MenuItem>
            <MenuItem value="purchases">Purchase Orders</MenuItem>
          </Select>
        </FormControl>

        <ButtonGroup size="small">
          <Button startIcon={<AnalyticsIcon />} onClick={handleGenerateReport}>
            Generate Report
          </Button>
          <Button onClick={handleExportAnalytics}>
            Export Data
          </Button>
        </ButtonGroup>
      </Box>

      {/* Overall Metrics */}
      <OverallMetrics />

      {/* Detailed Analytics */}
      {(orderType === 'all' || orderType === 'sales') && (
        <SalesOrderMetrics />
      )}
      
      {(orderType === 'all' || orderType === 'purchases') && (
        <PurchaseOrderMetrics />
      )}
    </Box>
  );
};

export default OrderAnalyticsTab;
