import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Avatar,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  Speed as SpeedIcon,
  Refresh,
  Settings,
  Warning,
  CheckCircle,
  Error,
  Info,
  Savings as SavingsIcon,
  AttachMoney as AttachMoneyIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';
// import { useUserRole } from '../../contexts/UserRoleContext'; // Temporarily disabled for menu controller testing
import { alpha } from '@mui/material/styles';

const DashboardModern = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  // const { userRole, getCurrentRole } = useUserRole(); // Temporarily disabled for menu controller testing
  const userRole = 'store_manager'; // Fallback value
  const getCurrentRole = () => ({ id: 'store_manager', name: 'Store Manager' }); // Fallback function
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get theme color from localStorage
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        setThemeColor(themeData.activeColor || '#1976d2');
      } catch (error) {
        console.log('Error parsing saved theme:', error);
      }
    }
  }, []);

  // Mock data for alerts and notifications
  const [alerts] = useState([
    { type: 'warning', title: 'Low Stock Alert', message: '5 items are running low on inventory', icon: <Warning /> },
    { type: 'info', title: 'System Update', message: 'New features available in POS module', icon: <Info /> },
    { type: 'success', title: 'Backup Complete', message: 'Daily backup completed successfully', icon: <CheckCircle /> },
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    uptime: '99.9%',
    responseTime: '45ms',
    activeUsers: 0,
    transactionsToday: 0,
  });

  // Real-time data fetching
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // Fetch real system metrics
        const response = await fetch('/api/dashboard/metrics');
        if (response.ok) {
          const data = await response.json();
          setSystemMetrics({
            uptime: data.uptime || '99.9%',
            responseTime: data.responseTime || '45ms',
            activeUsers: data.activeUsers || 0,
            transactionsToday: data.transactionsToday || 0,
          });
        }
      } catch (error) {
        console.log('Using fallback data - API not available');
        // Fallback to simulated real-time data
        setSystemMetrics(prev => ({
          ...prev,
          activeUsers: Math.floor(Math.random() * 20) + 5,
          transactionsToday: Math.floor(Math.random() * 50) + 100,
          responseTime: `${Math.floor(Math.random() * 20) + 30}ms`,
        }));
      }
    };

    // Initial fetch
    fetchRealTimeData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate data refresh
    if (isRefreshing) {
      const timer = setTimeout(() => {
        setIsRefreshing(false);
        setLastRefresh(new Date());
        // Update metrics on manual refresh
        setSystemMetrics(prev => ({
          ...prev,
          activeUsers: Math.floor(Math.random() * 20) + 5,
          transactionsToday: Math.floor(Math.random() * 50) + 100,
          responseTime: `${Math.floor(Math.random() * 20) + 30}ms`,
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing]);


  const handleRefresh = () => {
    setIsRefreshing(true);
  };


  const renderSystemMetrics = () => (
    <Grid container spacing={1} sx={{ mb: 1 }}>
      <Grid item xs={6} sm={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          color: 'white',
          borderRadius: 0,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-2px)' }
        }}>
          <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
            <CheckCircle sx={{ fontSize: '1.5rem', mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
              {systemMetrics.uptime}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              System Uptime
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          color: 'white',
          borderRadius: 0,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-2px)' }
        }}>
          <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
            <SpeedIcon sx={{ fontSize: '1.5rem', mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
              {systemMetrics.responseTime}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              Response Time
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white',
          borderRadius: 0,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-2px)' }
        }}>
          <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
            <People sx={{ fontSize: '1.5rem', mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
              {systemMetrics.activeUsers}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              Active Users
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
          color: 'white',
          borderRadius: 0,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-2px)' }
        }}>
          <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
            <TrendingUp sx={{ fontSize: '1.5rem', mb: 0.5 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
              {systemMetrics.transactionsToday}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              Transactions Today
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    return (
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        <Grid container spacing={1} sx={{ height: '100%' }}>
          {/* Quick Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', minHeight: '100px', borderRadius: 0 }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <TrendingUp sx={{ fontSize: '1.8rem', color: 'success.main', mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                  $45,230
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Today's Revenue
                </Typography>
                <Chip 
                  label="+12.5%" 
                  color="success" 
                  size="small" 
                  sx={{ mt: 0.5, fontSize: '0.65rem', height: '20px' }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', minHeight: '100px', borderRadius: 0 }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <ShoppingCart sx={{ fontSize: '1.8rem', color: 'primary.main', mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                  156
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Transactions
                </Typography>
                <Chip 
                  label="+8.2%" 
                  color="success" 
                  size="small" 
                  sx={{ mt: 0.5, fontSize: '0.65rem', height: '20px' }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', minHeight: '100px', borderRadius: 0 }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <Inventory sx={{ fontSize: '1.8rem', color: 'warning.main', mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                  1,234
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Products
                </Typography>
                <Chip 
                  label="5 Low" 
                  color="warning" 
                  size="small" 
                  sx={{ mt: 0.5, fontSize: '0.65rem', height: '20px' }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', minHeight: '100px', borderRadius: 0 }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                <People sx={{ fontSize: '1.8rem', color: 'info.main', mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                  89
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Customers
                </Typography>
                <Chip 
                  label="+3 New" 
                  color="info" 
                  size="small" 
                  sx={{ mt: 0.5, fontSize: '0.65rem', height: '20px' }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recent Activity */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', minHeight: '200px', borderRadius: 0 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Recent Activity
                </Typography>
                <Box sx={{ maxHeight: '150px', overflow: 'auto' }}>
                  {[
                    { action: 'New sale completed', amount: '$125.50', time: '2 min ago' },
                    { action: 'Inventory updated', amount: 'iPhone 15', time: '5 min ago' },
                    { action: 'Customer registered', amount: 'John Doe', time: '8 min ago' },
                    { action: 'Payment received', amount: '$89.99', time: '12 min ago' },
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      py: 1,
                      borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                        {item.action} • {item.amount} • {item.time}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', minHeight: '200px', overflow: 'hidden', borderRadius: 0 }}>
              <CardContent sx={{ height: '100%', overflow: 'hidden' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 1,
                  height: 'calc(100% - 40px)',
                  overflow: 'hidden'
                }}>
                  {[
                    { label: 'New Sale', icon: <ShoppingCart />, color: 'primary' },
                    { label: 'Add Product', icon: <Inventory />, color: 'success' },
                    { label: 'View Reports', icon: <TrendingUp />, color: 'info' },
                    { label: 'Manage Users', icon: <People />, color: 'warning' },
                  ].map((action, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        minHeight: '60px',
                        justifyContent: 'flex-start',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <Box sx={{ 
                        p: 0.5, 
                        borderRadius: '50%', 
                        backgroundColor: `${action.color}.main`,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {action.icon}
                      </Box>
                      <Typography variant="caption" fontWeight="medium">
                        {action.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)', // Full height minus header
      overflow: 'hidden', // Prevent scrolling
      display: 'flex',
      flexDirection: 'column',
      pt: 2, 
      pb: 2, 
      pl: { xs: 1, sm: 2 }, 
      pr: { xs: 1, sm: 2 },
      // Add pulse animation
      '@keyframes pulse': {
        '0%': {
          opacity: 1,
          transform: 'scale(1)',
        },
        '50%': {
          opacity: 0.5,
          transform: 'scale(1.1)',
        },
        '100%': {
          opacity: 1,
          transform: 'scale(1)',
        },
      },
    }}>
      {/* Compact Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 1,
        flexShrink: 0
      }}>
        {/* Live Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PageTitle 
          title="Dashboard" 
          subtitle="Real-time system overview and analytics"
          variant="h6"
        />
          <Box sx={{ 
            width: 6, 
            height: 6, 
            borderRadius: '50%', 
            backgroundColor: 'success.main',
            animation: 'pulse 2s infinite'
          }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Live • {lastRefresh.toLocaleTimeString()}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Auto-refresh: 30s
          </Typography>
        </Box>

        {/* System Health & Actions */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip 
            icon={<SpeedIcon />}
            label={`System Health: ${systemMetrics.uptime} • ${systemMetrics.responseTime}`} 
            color="success" 
            size="small"
            sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
          <Tooltip title="Refresh Dashboard">
            <IconButton 
              onClick={handleRefresh}
              disabled={isRefreshing}
              sx={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dashboard Settings">
            <IconButton>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* System Metrics */}
      <Box sx={{ mb: 1, flexShrink: 0 }}>
        {renderSystemMetrics()}
      </Box>

      {/* Compact Alerts Section */}
      <Box sx={{ mb: 1, flexShrink: 0 }}>
        <Grid container spacing={1}>
          {alerts.map((alert, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Alert 
                severity={alert.type} 
                icon={alert.icon}
                sx={{ 
                  borderRadius: 1,
                  py: 1,
                  '& .MuiAlert-message': { width: '100%' },
                  '& .MuiAlert-icon': { fontSize: '1rem' }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0.5 }}>
                  {alert.title}
                </AlertTitle>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  {alert.message}
                </Typography>
              </Alert>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Refresh Progress */}
      {isRefreshing && (
        <LinearProgress 
          sx={{ 
            mb: 2,
            borderRadius: 1,
            height: 4
          }} 
        />
      )}

      {/* Dashboard Content - Flexible Area */}
      <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default DashboardModern;
