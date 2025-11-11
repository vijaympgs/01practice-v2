import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  Notifications,
  Warning,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material';

// Real-time analytics data simulation
const generateAnalyticsData = () => ({
  sales: {
    current: Math.floor(Math.random() * 10000) + 5000,
    previous: Math.floor(Math.random() * 10000) + 4000,
    trend: Math.random() > 0.5 ? 'up' : 'down',
  },
  inventory: {
    totalItems: Math.floor(Math.random() * 5000) + 2000,
    lowStock: Math.floor(Math.random() * 50) + 10,
    outOfStock: Math.floor(Math.random() * 10) + 1,
  },
  customers: {
    active: Math.floor(Math.random() * 1000) + 500,
    newToday: Math.floor(Math.random() * 50) + 10,
    loyalty: Math.floor(Math.random() * 200) + 100,
  },
  alerts: [
    {
      id: 1,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'iPhone 15 Pro Max - Only 5 units remaining',
      time: '2 minutes ago',
      icon: <Warning />,
    },
    {
      id: 2,
      type: 'info',
      title: 'New Customer',
      message: 'John Smith registered as new customer',
      time: '5 minutes ago',
      icon: <Info />,
    },
    {
      id: 3,
      type: 'success',
      title: 'Payment Received',
      message: 'Payment of $1,250 received from ABC Corp',
      time: '8 minutes ago',
      icon: <CheckCircle />,
    },
    {
      id: 4,
      type: 'error',
      title: 'System Alert',
      message: 'Backup process failed - Retry scheduled',
      time: '12 minutes ago',
      icon: <Error />,
    },
  ],
});

const RealTimeAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = () => {
      setAnalyticsData(generateAnalyticsData());
      setLastUpdate(new Date());
      setLoading(false);
    };

    // Initial load
    fetchData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData());
      setLastUpdate(new Date());
      setLoading(false);
    }, 1000);
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const calculatePercentage = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
    ) : (
      <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
    );
  };

  if (!analyticsData) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Loading real-time analytics...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            fontSize: '1.5rem', // Consistent sizing with other dashboard titles
            fontWeight: 600,
            lineHeight: 1.2
          }}
        >
          Real-Time Analytics
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`Last update: ${lastUpdate.toLocaleTimeString()}`}
            size="small"
            variant="outlined"
          />
          <Tooltip title="Refresh Now">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={3}>
        {/* Sales Analytics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Performance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ mr: 2 }}>
                  ${analyticsData.sales.current.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getTrendIcon(analyticsData.sales.trend)}
                  <Typography
                    variant="body2"
                    color={analyticsData.sales.trend === 'up' ? 'success.main' : 'error.main'}
                    sx={{ ml: 1 }}
                  >
                    {calculatePercentage(analyticsData.sales.current, analyticsData.sales.previous)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                vs. previous period: ${analyticsData.sales.previous.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Analytics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {analyticsData.inventory.totalItems.toLocaleString()} Items
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip
                    label={`${analyticsData.inventory.lowStock} Low Stock`}
                    color="warning"
                    size="small"
                  />
                  <Chip
                    label={`${analyticsData.inventory.outOfStock} Out of Stock`}
                    color="error"
                    size="small"
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total inventory value: $125,430
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Analytics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Metrics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {analyticsData.customers.active.toLocaleString()} Active
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip
                    label={`${analyticsData.customers.newToday} New Today`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`${analyticsData.customers.loyalty} Loyalty Members`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Customer satisfaction: 4.8/5
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Real-Time Alerts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Real-Time Alerts & Notifications
                </Typography>
              </Box>
              <List>
                {analyticsData.alerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${getAlertColor(alert.type)}.main` }}>
                          {alert.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={alert.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {alert.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < analyticsData.alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeAnalytics;

