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
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Assignment as OrderIcon,
  TrendingUp as SalesIcon,
  ShoppingCartCheckout as PurchaseIcon,
  Assessment as AnalyticsIcon,
  TrendingDown as DownIcon,
  TrendingUp as UpIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
// Temporarily comment out imports to test
// import SalesOrdersTab from '../components/orders/SalesOrdersTab';
// import PurchaseOrdersTab from '../components/orders/PurchaseOrdersTab';
// import OrderAnalyticsTab from '../components/orders/OrderAnalyticsTab';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const transactionCategories = [
    {
      id: 'sales',
      label: 'Sales Transactions',
      icon: <SalesIcon />,
      description: 'Customer sales orders and receipts',
      stats: { count: 234, amount: '$45,678', trend: '+12.5%' }
    },
    {
      id: 'purchases',
      label: 'Purchase Transactions',
      icon: <PurchaseIcon />,
      description: 'Supplier purchase orders and invoices',
      stats: { count: 47, amount: '$12,345', trend: '-3.2%' }
    },
    {
      id: 'analytics',
      label: 'Transaction Analytics',
      icon: <AnalyticsIcon />,
      description: 'Transaction performance and business intelligence',
      stats: { count: 'N/A', amount: 'N/A', trend: '+8.7%' }
    }
  ];

  const recentOrders = [
    { id: 'SO-001', type: 'Sales', customer: 'John Doe', amount: '$125.50', status: 'Completed', time: '2 min ago' },
    { id: 'PO-002', type: 'Purchase', supplier: 'ABC Supplies', amount: '$450.00', status: 'Pending', time: '15 min ago' },
    { id: 'SO-003', type: 'Sales', customer: 'Jane Smith', amount: '$89.99', status: 'Processing', time: '32 min ago' },
    { id: 'PO-004', type: 'Purchase', supplier: 'XYZ Corp', amount: '$275.75', status: 'Approved', time: '1 hour ago' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Box sx={{ p: 3 }}><Typography>Sales Transactions Tab - Loading...</Typography></Box>;
      case 1:
        return <Box sx={{ p: 3 }}><Typography>Purchase Transactions Tab - Loading...</Typography></Box>;
      case 2:
        return <Box sx={{ p: 3 }}><Typography>Transaction Analytics Tab - Loading...</Typography></Box>;
      default:
        return <Box sx={{ p: 3 }}><Typography>Default Tab</Typography></Box>;
    }
  };

  const getOrderTypeIcon = (type) => {
    return type === 'Sales' ? <SalesIcon /> : <PurchaseIcon />;
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'warning';
      case 'Pending': return 'info';

      case 'Approved': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 3 }}>
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="💼 Transaction Management" 
          subtitle="Sales and purchase transactions tracking, management, and analytics"
          showIcon={true}
          icon={<OrderIcon />}
        />
      </Box>

      {/* Order Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SalesIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                234
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sales Orders (30d)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <UpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  +12.5%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PurchaseIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                47
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Purchase Orders (30d)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <DownIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="caption" color="warning.main">
                  -3.2%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                $45,678
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Order Value
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <UpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  +8.7%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                $12.3h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Processing Time
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <DownIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  -2.1%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction Categories */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {transactionCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {category.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Count: {category.stats.count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Trend: {category.stats.trend}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Orders Activity
          </Typography>
          <List>
            {recentOrders.map((order, index) => (
              <div key={order.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: order.type === 'Sales' ? 'success.main' : 'warning.main' }}>
                      {getOrderTypeIcon(order.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {order.id}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={order.type} 
                          color={order.type === 'Sales' ? 'success' : 'warning'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {order.type === 'Sales' ? order.customer : order.supplier}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {order.amount}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={order.status} 
                          color={getOrderStatusColor(order.status)}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {order.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentOrders.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="orders tabs">
            {orderCategories.map((category, index) => (
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

export default OrdersPage;
