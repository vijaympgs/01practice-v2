import React, { useState } from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Paper,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  TrendingUp as TrendsIcon,
  ShoppingCart as SalesIcon,
  Inventory as InventoryIcon,
  MonetizationOn as FinancialIcon,
  People as CustomerIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import SalesReportsTab from '../components/reports/SalesReportsTab';
import InventoryReportsTab from '../components/reports/InventoryReportsTab';
import FinancialReportsTab from '../components/reports/FinancialReportsTab';
import CustomerReportsTab from '../components/reports/CustomerReportsTab';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const reportCategories = [
    {
      id: 'sales',
      label: 'Sales Reports',
      icon: <SalesIcon />,
      description: 'Revenue, transactions, and sales performance analytics'
    },
    {
      id: 'inventory',
      label: 'Inventory Reports',
      icon: <InventoryIcon />,
      description: 'Stock levels, movement, and procurement analytics'
    },
    {
      id: 'financial',
      label: 'Financial Reports',
      icon: <FinancialIcon />,
      description: 'Profit & loss, cash flow, and financial insights'
    },
    {
      id: 'customers',
      label: 'Customer Reports',
      icon: <CustomerIcon />,
      description: 'Customer behavior, loyalty, and demographic analytics'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <SalesReportsTab />;
      case 1:
        return <InventoryReportsTab />;
      case 2:
        return <FinancialReportsTab />;
      case 3:
        return <CustomerReportsTab />;
      default:
        return <SalesReportsTab />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 3 }}>
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="📊 Reports & Analytics" 
          subtitle="Comprehensive business intelligence and performance analytics"
          showIcon={true}
          icon={<ReportsIcon />}
        />
      </Box>

      {/* Quick Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendsIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                +12.5%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenue Growth
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SalesIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                $45,678
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Month Sales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                47
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Stock Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CustomerIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                234
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feature Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {reportCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                border: activeTab === index ? 2 : 1,
                borderColor: activeTab === index ? 'primary.main' : 'divider',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => setActiveTab(index)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: activeTab === index ? 'primary.main' : 'text.secondary', mb: 2 }}>
                  {category.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {category.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Report Settings
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select value="this_month" label="Date Range">
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="this_week">This Week</MenuItem>
                  <MenuItem value="this_month">This Month</MenuItem>
                  <MenuItem value="last_month">Last Month</MenuItem>
                  <MenuItem value="this_quarter">This Quarter</MenuItem>
                  <MenuItem value="this_year">This Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Starting Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                defaultValue="2025-01-01"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Ending Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                defaultValue="2025-01-31"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" fullWidth>
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="reports tabs">
            {reportCategories.map((category, index) => (
              <Tab
                key={category.id}
                label={category.label}
                icon={category.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {/* Tab Content */}
      <Card>
        <CardContent sx={{ p: 0, minHeight: '400px' }}>
          {renderTabContent()}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReportsPage;
