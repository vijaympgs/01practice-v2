import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const InventoryStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const statsCards = [
    {
      title: 'Total Items',
      value: stats.total_items || 0,
      icon: <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.total_value),
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success',
    },
    {
      title: 'Low Stock Items',
      value: stats.low_stock_items || 0,
      icon: <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning',
    },
    {
      title: 'Out of Stock',
      value: stats.out_of_stock_items || 0,
      icon: <TrendingDownIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error',
    },
    {
      title: 'Active Alerts',
      value: stats.alert_count || 0,
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info',
    },
    {
      title: 'Recent Movements',
      value: stats.recent_movements || 0,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statsCards.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                {item.icon}
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {item.title}
              </Typography>
              {item.title === 'Low Stock Items' && item.value > 0 && (
                <Chip 
                  label="Attention Needed" 
                  size="small" 
                  color="warning" 
                  sx={{ mt: 1 }} 
                />
              )}
              {item.title === 'Out of Stock' && item.value > 0 && (
                <Chip 
                  label="Critical" 
                  size="small" 
                  color="error" 
                  sx={{ mt: 1 }} 
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default InventoryStats;


