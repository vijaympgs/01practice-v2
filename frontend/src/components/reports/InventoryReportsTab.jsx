import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import {
  Warning as WarningIcon,
  TrendingDown as DownIcon,
  TrendingUp as UpIcon,
} from '@mui/icons-material';

const InventoryReportsTab = () => {
  // Mock inventory data
  const lowStockItems = [
    { name: 'Premium Coffee Beans', current: 5, reorder: 20, category: 'Coffee', sku: 'PCB-001' },
    { name: 'Artisan Tea Leaves', current: 8, reorder: 15, category: 'Tea', sku: 'ATL-002' },
    { name: 'Ceramic Mugs', current: 12, reorder: 25, category: 'Accessories', sku: 'CM-003' },
    { name: 'Coffee Filters', current: 3, reorder: 50, category: 'Accessories', sku: 'CF-004' },
    { name: 'Milk Frother', current: 7, reorder: 10, category: 'Equipment', sku: 'MF-005' },
  ];

  const inventoryMetrics = [
    { title: 'Total Products', value: '1,245', change: '+2.1%', positive: true },
    { title: 'Stock Value', value: '$125,678.90', change: '+5.8%', positive: true },
    { title: 'Low Stock Alert', value: '47', change: '12', positive: false },
    { title: 'Stock Turnover', value: '4.2x', change: '+0.3x', positive: true },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        📦 Inventory Reports & Analytics
      </Typography>

      {/* Inventory Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {inventoryMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {metric.title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {metric.value}
              </Typography>
              <Typography variant="body2" color={metric.positive ? 'success.main' : 'warning.main'}>
                {metric.change} {metric.positive ? 'increase' : 'items'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Low Stock Alert */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon />
          <Typography variant="body2" fontWeight="bold">
            {lowStockItems.length} products are running low on stock and require immediate attention.
          </Typography>
        </Box>
      </Alert>

      {/* Low Stock Items Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ⚠️ Low Stock Items Requiring Reorder
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Current Stock</TableCell>
                  <TableCell align="center">Reorder Point</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action Required</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockItems.map((item, index) => (
                  <TableRow key={item.sku}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={item.category} size="small" color="default" />
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={item.current <= item.reorder ? 'error.main' : 'warning.main'}
                      >
                        {item.current}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{item.reorder}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {item.current <= item.reorder ? (
                        <Chip label="Critical" color="error" size="small" />
                      ) : (
                        <Chip label="Low" color="warning" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="error.main">
                        Place Order
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InventoryReportsTab;

