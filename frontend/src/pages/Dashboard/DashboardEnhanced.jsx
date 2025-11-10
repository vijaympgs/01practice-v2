import React, { useState } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  Speed as SpeedIcon,
  Assignment as ReportsIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import SalesWidget from '../../components/dashboard/SalesWidget';
import InventoryWidget from '../../components/dashboard/InventoryWidget';
import FinancialWidget from '../../components/dashboard/FinancialWidget';
import CustomerWidget from '../../components/dashboard/CustomerWidget';
import RoleBasedDashboard from '../../components/dashboard/RoleBasedDashboard';
import RealTimeAnalytics from '../../components/dashboard/RealTimeAnalytics';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardEnhanced = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Box>
        <PageTitle 
          title="📊 Dashboard" 
          subtitle="Welcome to NewBorn Retail™ - Real-time business overview"
          showIcon={true}
          icon={<DashboardIcon />}
        />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip 
            icon={<SpeedIcon />}
            label="System Health: Excellent" 
            color="success" 
            size="small" 
          />
          <Button variant="outlined" startIcon={<ReportsIcon />}>
            View Reports
          </Button>
        </Box>
      </Box>

      {/* Top Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Sales"
            value="$2,456"
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="#4caf50"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inventory Items"
            value="47 Low"
            icon={<Inventory sx={{ color: 'white' }} />}
            color="#ff9800"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value="1,245"
            icon={<People sx={{ color: 'white' }} />}
            color="#2196f3"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cash Flow"
            value="+8.2%"
            icon={<ShoppingCart sx={{ color: 'white' }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Main Widgets */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <SalesWidget />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FinancialWidget />
        </Grid>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InventoryWidget />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomerWidget />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          🚀 Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">Start POS Sale</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Inventory sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">Stock Adjustment</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <People sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">Manage Customers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <ReportsIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">View Reports</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardEnhanced;
