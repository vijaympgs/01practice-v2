import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Favorite as LoyaltyIcon,
  ShoppingCart as PurchaseIcon,
  MoreVert as MoreIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const CustomerWidget = () => {
  // Mock customer data
  const newCustomers = [
    { name: 'Sarah Johnson', joined: '2 hours ago', purchases: 1, value: '$89.99' },
    { name: 'Michael Brown', joined: '4 hours ago', purchases: 0, value: '$0.00' },
    { name: 'Emily Davis', joined: '1 day ago', purchases: 3, value: '$156.78' },
  ];

  const topCustomers = [
    { name: 'John Smith', tier: 'Gold', purchases: 23, value: '$2,156.78' },
    { name: 'Anna Wilson', tier: 'Gold', purchases: 19, value: '$1,892.34' },
    { name: 'David Chen', tier: 'Silver', purchases: 15, value: '$1,654.12' },
  ];

  const customerMetrics = {
    total: 1245,
    active: 892,
    new: 47,
    loyal: 234 // Gold + Silver tier
  };

  const satisfactionScore = 4.7;
  const loyaltyRate = 78.5;

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon color="primary" />
            Customer Overview
          </Typography>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Customer Metrics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {customerMetrics.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Customers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {customerMetrics.new}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                New This Week
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Satisfaction & Loyalty */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Customer Satisfaction</Typography>
            <Typography variant="body2" fontWeight="bold">
              {satisfactionScore}/5.0 ⭐
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(satisfactionScore / 5) * 100} 
            sx={{ height: 6, borderRadius: 3, mb: 2 }}
            color="success"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Customer Retention</Typography>
            <Typography variant="body2" fontWeight="bold">
              {loyaltyRate}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={loyaltyRate} 
            sx={{ height: 6, borderRadius: 3 }}
            color="info"
          />
        </Box>

        {/* Recent Customers */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Recent Customers
          </Typography>
          <List dense>
            {newCustomers.map((customer, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <PersonAddIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={customer.name}
                  secondary={`Joined ${customer.joined} • ${customer.purchases} purchases`}
                />
                <Chip 
                  label={customer.value} 
                  size="small" 
                  color={parseFloat(customer.value.replace('$', '')) > 0 ? 'success' : 'default'}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Loyalty Tier Distribution */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Loyalty Breakdown
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  45
                </Typography>
                <Typography variant="caption">Gold</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="info.main">
                  189
                </Typography>
                <Typography variant="caption">Silver</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  1011
                </Typography>
                <Typography variant="caption">Bronze</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerWidget;

