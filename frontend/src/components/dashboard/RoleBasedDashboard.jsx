import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Inventory,
  People,
  AttachMoney,
  Notifications,
  Settings,
  Refresh,
  MoreVert,
} from '@mui/icons-material';

// Role-based dashboard configuration
const roleConfigs = {
  sales_manager: {
    title: 'Sales Manager Dashboard',
    color: 'primary',
    tiles: [
      {
        id: 'revenue_trend',
        title: 'Revenue Trend',
        value: '$45,230',
        change: '+12.5%',
        trend: 'up',
        icon: <TrendingUp />,
        color: 'success',
      },
      {
        id: 'top_products',
        title: 'Top Products',
        value: 'iPhone 15',
        change: '3.2k sales',
        trend: 'up',
        icon: <ShoppingCart />,
        color: 'primary',
      },
      {
        id: 'team_performance',
        title: 'Team Performance',
        value: '94%',
        change: '+5.2%',
        trend: 'up',
        icon: <People />,
        color: 'info',
      },
      {
        id: 'conversion_rate',
        title: 'Conversion Rate',
        value: '23.8%',
        change: '+2.1%',
        trend: 'up',
        icon: <AttachMoney />,
        color: 'warning',
      },
    ],
  },
  store_manager: {
    title: 'Store Manager Dashboard',
    color: 'success',
    tiles: [
      {
        id: 'daily_target',
        title: 'Daily Target',
        value: '$12,500',
        change: '78%',
        trend: 'up',
        icon: <TrendingUp />,
        color: 'success',
      },
      {
        id: 'inventory_alerts',
        title: 'Inventory Alerts',
        value: '12',
        change: 'Low Stock',
        trend: 'down',
        icon: <Inventory />,
        color: 'error',
      },
      {
        id: 'staff_schedule',
        title: 'Staff Schedule',
        value: '8 Active',
        change: '2 Breaks',
        trend: 'neutral',
        icon: <People />,
        color: 'info',
      },
      {
        id: 'customer_satisfaction',
        title: 'Customer Satisfaction',
        value: '4.8/5',
        change: '+0.3',
        trend: 'up',
        icon: <ShoppingCart />,
        color: 'primary',
      },
      {
        id: 'revenue_target',
        title: 'Revenue Target',
        value: '$45,230',
        change: '92%',
        trend: 'up',
        icon: <TrendingUp />,
        color: 'success',
      },
      {
        id: 'active_promotions',
        title: 'Active Promotions',
        value: '8',
        change: '3 Ending Soon',
        trend: 'neutral',
        icon: <Notifications />,
        color: 'warning',
      },
    ],
  },
  cashier: {
    title: 'Cashier Dashboard',
    color: 'info',
    tiles: [
      {
        id: 'today_sales',
        title: 'Today\'s Sales',
        value: '$3,420',
        change: '47 transactions',
        trend: 'up',
        icon: <ShoppingCart />,
        color: 'success',
      },
      {
        id: 'quick_actions',
        title: 'Quick Actions',
        value: 'POS Ready',
        change: 'New Sale',
        trend: 'neutral',
        icon: <AttachMoney />,
        color: 'primary',
      },
      {
        id: 'customer_lookup',
        title: 'Customer Lookup',
        value: 'Search',
        change: 'Find Customer',
        trend: 'neutral',
        icon: <People />,
        color: 'info',
      },
      {
        id: 'transaction_history',
        title: 'Recent Transactions',
        value: 'Last 10',
        change: 'View All',
        trend: 'neutral',
        icon: <TrendingUp />,
        color: 'warning',
      },
    ],
  },
  inventory_manager: {
    title: 'Inventory Manager Dashboard',
    color: 'warning',
    tiles: [
      {
        id: 'stock_levels',
        title: 'Stock Levels',
        value: '2,847',
        change: 'Items in Stock',
        trend: 'neutral',
        icon: <Inventory />,
        color: 'primary',
      },
      {
        id: 'reorder_alerts',
        title: 'Reorder Alerts',
        value: '23',
        change: 'Items to Order',
        trend: 'down',
        icon: <Notifications />,
        color: 'error',
      },
      {
        id: 'supplier_performance',
        title: 'Supplier Performance',
        value: '94%',
        change: 'On-Time Delivery',
        trend: 'up',
        icon: <People />,
        color: 'success',
      },
      {
        id: 'inventory_value',
        title: 'Inventory Value',
        value: '$125,430',
        change: '+8.2%',
        trend: 'up',
        icon: <AttachMoney />,
        color: 'info',
      },
    ],
  },
};

const RoleBasedDashboard = ({ userRole = 'store_manager' }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const config = roleConfigs[userRole] || roleConfigs.store_manager;

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(config);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userRole, config]);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 500);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'down':
        return <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && !dashboardData) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: '1.8rem', // Consistent with main dashboard
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            {config.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.875rem', // 14px - smaller secondary text
              fontWeight: 400,
              lineHeight: 1.4
            }}
          >
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Dashboard Tiles - Balanced Compact Layout */}
      <Grid container spacing={2}>
        {config.tiles.map((tile) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={tile.id}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  borderColor: `${tile.color}.main`,
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Avatar sx={{ bgcolor: `${tile.color}.main`, width: 32, height: 32 }}>
                    {React.cloneElement(tile.icon, { sx: { fontSize: 18 } })}
                  </Avatar>
                  <IconButton size="small" sx={{ width: 24, height: 24 }}>
                    <MoreVert sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                
                <Typography 
                  variant="body2" 
                  component="div" 
                  gutterBottom 
                  sx={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 500, 
                    lineHeight: 1.2,
                    color: 'text.secondary',
                    mb: 0.5
                  }}
                >
                  {tile.title}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 'bold', 
                    fontSize: '1.25rem', 
                    lineHeight: 1.2,
                    color: 'text.primary'
                  }}
                >
                  {tile.value}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getTrendIcon(tile.trend) && React.cloneElement(getTrendIcon(tile.trend), { sx: { fontSize: 14 } })}
                  <Chip 
                    label={tile.change}
                    size="small"
                    color={getTrendColor(tile.trend)}
                    variant="outlined"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem', 
                      '& .MuiChip-label': { px: 0.5 }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions Section - Balanced */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <ShoppingCart sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>New Sale</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Start POS
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Inventory sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>Inventory</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Check Stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <People sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>Customers</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Manage
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <AttachMoney sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>Reports</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Analytics
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <TrendingUp sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>Analytics</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Insights
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Notifications sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>Alerts</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Notifications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RoleBasedDashboard;

