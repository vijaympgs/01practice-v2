import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as SalesIcon,
  MonetizationOn as MoneyIcon,
  Receipt as ReceiptIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

const SalesWidget = () => {
  // Mock sales data
  const todaysData = {
    sales: '$2,456.78',
    orders: 23,
    averageOrder: '$106.82',
    trend: '+12.5%',
    chartData: [85, 92, 78, 96, 88, 93, 89]
  };

  const weeklyData = {
    sales: '$14,520.45',
    orders: 134,
    averageOrder: '$108.36',
    trend: '+8.2%',
    chartData: [420, 485, 520, 480, 545, 520, 530]
  };

  const monthlyData = {
    sales: '$45,678.90',
    orders: 456,
    averageOrder: '$100.17',
    trend: '+12.5%',
    chartData: [1200, 1350, 1420, 1380, 1550, 1480, 1560]
  };

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SalesIcon color="primary" />
            Sales Performance
          </Typography>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Today's Sales */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Today's Sales
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {todaysData.sales}
            </Typography>
            <Chip 
              label={todaysData.trend} 
              size="small" 
              color="success"
              icon={<TrendingUpIcon sx={{ fontSize: '16px !important' }} />}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {/* {todaysData.orders} orders • Average: {todaysData.averageOrder} */}
            23 orders • Average: $106.82
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {weeklyData.orders}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This Week
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="info.main">
                {monthlyData.orders}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This Month
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Progress Trend */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Sales Goal Progress</Typography>
            <Typography variant="body2" fontWeight="bold">92%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={92} 
            sx={{ height: 6, borderRadius: 3 }}
            color="success"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesWidget;

