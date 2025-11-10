import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  Speed as SpeedIcon,
  Assignment as ReportsIcon,
} from '@mui/icons-material';
import SalesWidget from '../../components/dashboard/SalesWidget';
import InventoryWidget from '../../components/dashboard/InventoryWidget';
import FinancialWidget from '../../components/dashboard/FinancialWidget';
import CustomerWidget from '../../components/dashboard/CustomerWidget';

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

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <PageTitle 
        title="Dashboard" 
        subtitle="Welcome to NewBorn Retail™"
        showIcon={true}
        icon={<SpeedIcon />}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Sales"
            value="$0"
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="#4caf50"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value="0"
            icon={<ShoppingCart sx={{ color: 'white' }} />}
            color="#2196f3"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value="0"
            icon={<People sx={{ color: 'white' }} />}
            color="#ff9800"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value="0"
            icon={<Inventory sx={{ color: 'white' }} />}
            color="#f44336"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Start Guide
            </Typography>
            <Typography variant="body2" paragraph>
              1. Set up your product categories
            </Typography>
            <Typography variant="body2" paragraph>
              2. Add products to your inventory
            </Typography>
            <Typography variant="body2" paragraph>
              3. Register customers
            </Typography>
            <Typography variant="body2">
              4. Start making sales at the POS terminal
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;














