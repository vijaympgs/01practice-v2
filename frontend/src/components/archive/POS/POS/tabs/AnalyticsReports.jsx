import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Paper,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const AnalyticsReports = ({ mode, embeddedDB, posService, syncEngine, onMessage }) => {
  const [analytics, setAnalytics] = useState({
    today: { sales: 0, transactions: 0, customers: 0 },
    thisWeek: { sales: 0, transactions: 0, customers: 0 },
    thisMonth: { sales: 0, transactions: 0, customers: 0 }
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [embeddedDB, posService]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load transaction statistics
      if (posService) {
        const stats = await posService.getTransactionStats();
        
        // Mock analytics data (in real implementation, this would come from analytics engine)
        setAnalytics({
          today: {
            sales: stats.totalRevenue || 1250.50,
            transactions: stats.completed || 45,
            customers: 38
          },
          thisWeek: {
            sales: stats.totalRevenue * 7 || 8750.35,
            transactions: stats.completed * 7 || 315,
            customers: 266
          },
          thisMonth: {
            sales: stats.totalRevenue * 30 || 37510.50,
            transactions: stats.completed * 30 || 1350,
            customers: 1140
          }
        });

        // Load recent transactions
        if (embeddedDB) {
          const transactions = await embeddedDB.getAll('transactions', t => t.status === 'completed');
          setRecentTransactions(transactions.slice(-10).reverse());
        }
      }

      // Mock top products data
      setTopProducts([
        { id: '1', name: 'Premium Coffee', sales: 125, revenue: 623.75 },
        { id: '2', name: 'Chocolate Croissant', sales: 89, revenue: 310.61 },
        { id: '3', name: 'Green Tea', sales: 76, revenue: 227.24 },
        { id: '4', name: 'Sandwich', sales: 45, revenue: 314.55 },
        { id: '5', name: 'Energy Drink', sales: 67, revenue: 267.33 }
      ]);

    } catch (error) {
      onMessage(`❌ Failed to load analytics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    loadAnalytics();
    onMessage('✅ Analytics refreshed');
    handleMenuClose();
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" color={color} fontWeight="bold">
          {typeof value === 'number' ? (value.toLocaleString()) : value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Loading analytics...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Analytics & Reports
        </Typography>
        <Box>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleRefresh}>
              <RefreshIcon sx={{ mr: 1 }} />
              Refresh Data
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ height: 'calc(100% - 60px)' }}>
        {/* Today's Performance */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Today's Performance
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Sales"
                value={formatCurrency(analytics.today.sales)}
                icon={<MoneyIcon color="success" />}
                color="success"
                subtitle="Today's revenue"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Transactions"
                value={analytics.today.transactions}
                icon={<CartIcon color="primary" />}
                color="primary"
                subtitle="Completed today"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Customers"
                value={analytics.today.customers}
                icon={<PeopleIcon color="info" />}
                color="info"
                subtitle="Unique customers"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Weekly & Monthly Overview */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Performance Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  This Week
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sales:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(analytics.thisWeek.sales)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Transactions:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.thisWeek.transactions}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Customers:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.thisWeek.customers}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  This Month
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sales:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(analytics.thisMonth.sales)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Transactions:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.thisMonth.transactions}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Customers:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.thisMonth.customers}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Selling Products
              </Typography>
              
              {topProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No product data available
                </Typography>
              ) : (
                <List>
                  {topProducts.map((product, index) => (
                    <ListItem key={product.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Chip 
                          label={index + 1} 
                          color={index < 3 ? 'primary' : 'default'} 
                          size="small" 
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.name}
                        secondary={`${product.sales} sold • ${formatCurrency(product.revenue)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              
              {recentTransactions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent transactions
                </Typography>
              ) : (
                <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                  {recentTransactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CartIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={transaction.id}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {formatTime(transaction.timestamp)}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip 
                                  label={formatCurrency(transaction.total)} 
                                  size="small" 
                                  color="success" 
                                />
                                <Chip 
                                  label={`${transaction.items?.length || 0} items`} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentTransactions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Mode Indicator */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label={mode === 'online' ? 'Online Mode - Real-time Analytics' : 'Offline Mode - Local Analytics'}
              color={mode === 'online' ? 'success' : 'warning'}
              icon={<TrendingUpIcon />}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsReports;
