import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

const InventoryWidget = () => {
  // Mock inventory alerts
  const criticalItems = [
    { name: 'Coffee Filters', stock: 3, required: 25 },
    { name: 'Premium Beans', stock: 8, required: 20 },
    { name: 'Ceramic Mugs', stock: 12, required: 30 }
  ];

  const inboundItems = [
    { shipment: 'SH-001', supplier: 'Coffee Supply Co.', eta: 'Today', items: 4 },
    { shipment: 'SH-002', supplier: 'Tea Masters LLC', eta: 'Tomorrow', items: 6 }
  ];

  const metrics = {
    totalProducts: 1245,
    lowStock: 47,
    outOfStock: 8,
    totalValue: 125678.90,
    turnover: 4.2
  };

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon color="primary" />
            Inventory Status
          </Typography>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Critical Stock Alert */}
        {criticalItems.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon />
              <Typography variant="body2" fontWeight="bold">
                {criticalItems.length} items critically low on stock
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Quick Metrics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {metrics.totalProducts}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Products
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {metrics.lowStock}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Low Stock Alerts
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Stock Turnover */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Stock Turnover Rate</Typography>
            <Typography variant="body2" fontWeight="bold" color="success.main">
              {metrics.turnover}x
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={75} 
            sx={{ height: 6, borderRadius: 3 }}
            color="success"
          />
        </Box>

        {/* Inbound Shipments */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Inbound Shipments
          </Typography>
          {inboundItems.map((shipment, index) => (
            <Box key={shipment.shipment} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                <CartIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" fontWeight="bold">
                  {shipment.shipment}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {shipment.supplier} • {shipment.items} items
                </Typography>
              </Box>
              <Chip label={shipment.eta} size="small" color="info" />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InventoryWidget;

