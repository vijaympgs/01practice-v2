import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  People as CustomerIcon,
  Favorite as LoyaltyIcon,
  ShoppingCart as PurchaseIcon,
} from '@mui/icons-material';

const CustomerReportsTab = () => {
  const customerMetrics = [
    { title: 'Total Customers', value: '1,245', change: '+8.2%', positive: true },
    { title: 'Active Customers', value: '892', change: '+12.5%', positive: true },
    { title: 'New Customers', value: '156', change: '+15.3%', positive: true },
    { title: 'Avg Order Value', value: '$89.45', change: '+5.1%', positive: true },
  ];

  const topCustomers = [
    { 
      name: 'John Smith', 
      email: 'john@email.com',
      totalOrders: 23, 
      totalSpent: 2156.78, 
      avgOrderValue: 93.77,
      loyaltyTier: 'Gold',
      lastPurchase: '2025-01-02'
    },
    { 
      name: 'Sarah Johnson', 
      email: 'sarah@email.com',
      totalOrders: 19, 
      totalSpent: 1892.34, 
      avgOrderValue: 99.60,
      loyaltyTier: 'Gold',
      lastPurchase: '2025-01-01'
    },
    { 
      name: 'Michael Brown', 
      email: 'mike@email.com',
      totalOrders: 15, 
      totalSpent: 1654.12, 
      avgOrderValue: 110.27,
      loyaltyTier: 'Silver',
      lastPurchase: '2024-12-30'
    },
    { 
      name: 'Emily Davis', 
      email: 'emily@email.com',
      totalOrders: 12, 
      totalSpent: 1342.89, 
      avgOrderValue: 111.91,
      loyaltyTier: 'Silver',
      lastPurchase: '2024-12-28'
    },
    { 
      name: 'David Wilson', 
      email: 'david@email.com',
      totalOrders: 18, 
      totalSpent: 1523.67, 
      avgOrderValue: 84.65,
      loyaltyTier: 'Silver',
      lastPurchase: '2024-12-27'
    },
  ];

  const loyaltySegment = [
    { tier: 'Gold', count: 45, percentage: '18.5%', avgSpent: '$125.67' },
    { tier: 'Silver', count: 78, percentage: '32.1%', avgSpent: '$89.34' },
    { tier: 'Bronze', count: 322, percentage: '49.4%', avgSpent: '$45.78' },
  ];

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Gold': return 'warning';
      case 'Silver': return 'default';
      case 'Bronze': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        👥 Customer Reports & Analytics
      </Typography>

      {/* Customer Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {customerMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {metric.title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {metric.value}
              </Typography>
              <Typography 
                variant="body2" 
                color={metric.positive ? 'success.main' : 'error.main'}
              >
                {metric.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Customer Segmentation Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Customer Segmentation Analysis
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.50' }}>
                <Typography variant="h6" color="text.secondary">
                  Customer Segmentation Chart Placeholder
                  <br />
                  Demographics, Purchase Behavior, Loyalty Tiers
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Loyalty Tier Distribution
              </Typography>
              {loyaltySegment.map((segment) => (
                <Box key={segment.tier} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{segment.tier}</Typography>
                    <Typography variant="body2" fontWeight="bold">{segment.count}</Typography>
                  </Box>
                  <Box sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 1 }}>
                    {segment.percentage} • Avg: {segment.avgSpent}
                  </Box>
                  <Box sx={{ 
                    width: '100%', 
                    height: 4, 
                    backgroundColor: 'grey.200', 
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      width: segment.percentage, 
                      height: '100%', 
                      backgroundColor: segment.tier === 'Gold' ? 'warning.main' : segment.tier === 'Silver' ? 'primary.main' : 'success.main'
                    }} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Customers */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🏆 Top Customers by Revenue
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Total Orders</TableCell>
                  <TableCell align="right">Total Spent</TableCell>
                  <TableCell align="right">Avg Order Value</TableCell>
                  <TableCell align="center">Loyalty Tier</TableCell>
                  <TableCell align="center">Last Purchase</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCustomers.map((customer, index) => (
                  <TableRow key={customer.email}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: CUST-{String(index + 1).padStart(4, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {customer.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="bold">
                        {customer.totalOrders}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        ${customer.totalSpent.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        ${customer.avgOrderValue.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={customer.loyaltyTier} 
                        color={getTierColor(customer.loyaltyTier)}
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {customer.lastPurchase}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerReportsTab;
