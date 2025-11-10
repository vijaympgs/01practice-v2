import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendsIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

const SalesReportsTab = () => {
  const [selectedChart, setSelectedChart] = useState('revenue');

  // Mock sales data
  const topProducts = [
    { name: 'Premium Coffee Beans', sales: 145, revenue: 1885.50, trend: '+12%' },
    { name: 'Artisan Tea Blend', sales: 98, revenue: 881.10, trend: '+8%' },
    { name: 'Ceramic Mug Set', sales: 76, revenue: 1216.24, trend: '+15%' },
    { name: 'Coffee Grinder Pro', sales: 45, revenue: 2250.00, trend: '+5%' },
    { name: 'Digital Scale', sales: 32, revenue: 2396.80, trend: '-2%' },
  ];

  const salesMetrics = [
    { title: 'Total Revenue', value: '$45,678.90', change: '+12.5%', positive: true },
    { title: 'Orders Count', value: '456', change: '+8.2%', positive: true },
    { title: 'Average Order Value', value: '$100.17', change: '+4.1%', positive: true },
    { title: 'Conversion Rate', value: '12.8%', change: '+1.2%', positive: true },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendsIcon />
        Sales Reports & Analytics
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button variant="outlined" startIcon={<DownloadIcon />}>
          Export Report
        </Button>
        <Button variant="outlined" startIcon={<PrintIcon />}>
          Print Report
        </Button>
      </Box>

      {/* Sales Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {salesMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {metric.title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {metric.value}
              </Typography>
              <Typography 
                variant="body2" 
                color={metric.positive ? 'success.main' : 'error.main'}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <TrendsIcon fontSize="small" />
                {metric.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Chart Options */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Sales Trends - Last 30 Days
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.50' }}>
                <Typography variant="h6" color="text.secondary">
                  Interactive Chart Placeholder
                  <br />
                  Revenue: $45,678.90 | Orders: 456
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Sales Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.50' }}>
                <Typography variant="h6" color="text.secondary">
                  Pie Chart Placeholder
                  <br />
                  Coffee: 45% | Tea: 30% | Accessories: 25%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Selling Products */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🏆 Top Selling Products
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="center">Units Sold</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="center">Trend</TableCell>
                  <TableCell align="center">Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={product.name}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: PC-{String(index + 1).padStart(3, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="bold">
                        {product.sales}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        ${product.revenue.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={product.trend.startsWith('+') ? 'success.main' : 'error.main'}
                      >
                        {product.trend}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ 
                        width: 60, 
                        height: 8, 
                        backgroundColor: 'grey.200', 
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${(product.sales / 145) * 100}%`, 
                          height: '100%', 
                          backgroundColor: 'primary.main' 
                        }} />
                      </Box>
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

export default SalesReportsTab;

