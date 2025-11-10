import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Divider,
  Alert,
  Badge,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AnalyticsIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InventoryAnalytics = ({ onRefresh }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [viewMode, setViewMode] = useState('cards');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockAnalyticsData = {
      kpis: {
        totalValue: 2847590.50,
        totalItems: 1247,
        turnoverRate: 4.2,
        accuracyRate: 98.7,
        stockoutRate: 2.1,
        carryingCost: 125430.75
      },
      abcAnalysis: [
        { category: 'A', items: 125, value: 1875000, percentage: 65.8, color: '#ff4444' },
        { category: 'B', items: 312, value: 712500, percentage: 25.0, color: '#ffaa00' },
        { category: 'C', items: 810, value: 260090.50, percentage: 9.2, color: '#00aa00' }
      ],
      turnoverTrend: [
        { month: 'Jan', turnover: 3.8, value: 2100000 },
        { month: 'Feb', turnover: 4.1, value: 2250000 },
        { month: 'Mar', turnover: 3.9, value: 2180000 },
        { month: 'Apr', turnover: 4.3, value: 2400000 },
        { month: 'May', turnover: 4.0, value: 2320000 },
        { month: 'Jun', turnover: 4.2, value: 2450000 },
        { month: 'Jul', turnover: 4.5, value: 2600000 },
        { month: 'Aug', turnover: 4.2, value: 2480000 },
        { month: 'Sep', turnover: 4.1, value: 2420000 },
        { month: 'Oct', turnover: 4.3, value: 2510000 },
        { month: 'Nov', turnover: 4.0, value: 2380000 },
        { month: 'Dec', turnover: 4.2, value: 2847590 }
      ],
      topProducts: [
        { name: 'Samsung Galaxy S24', sku: 'SAM-GAL-S24-128', turnover: 8.5, value: 450000, growth: 12.5 },
        { name: 'Apple MacBook Pro 16"', sku: 'APP-MBP-16-512', turnover: 6.2, value: 380000, growth: 8.3 },
        { name: 'Dell OptiPlex 7090', sku: 'DEL-OPT-7090-256', turnover: 7.8, value: 320000, growth: 15.2 },
        { name: 'iPad Pro 12.9"', sku: 'APP-IPAD-PRO-256', turnover: 5.9, value: 280000, growth: 6.7 },
        { name: 'Sony WH-1000XM5', sku: 'SON-WH-1000XM5', turnover: 9.1, value: 180000, growth: 18.4 }
      ],
      slowMoving: [
        { name: 'Old Gaming Console', sku: 'GAME-CON-OLD-001', daysInStock: 180, value: 15000, recommendation: 'Discount' },
        { name: 'Legacy Printer Model', sku: 'PRINT-LEG-001', daysInStock: 220, value: 8500, recommendation: 'Clearance' },
        { name: 'Outdated Smartphone', sku: 'PHONE-OUT-001', daysInStock: 165, value: 12000, recommendation: 'Bundle' }
      ],
      stockoutAlerts: [
        { product: 'Samsung Galaxy S24', daysOut: 3, lostSales: 45000, priority: 'high' },
        { product: 'Apple MacBook Pro 16"', daysOut: 1, lostSales: 25000, priority: 'medium' },
        { product: 'Dell OptiPlex 7090', daysOut: 5, lostSales: 18000, priority: 'high' }
      ]
    };

    setAnalyticsData(mockAnalyticsData);
    setLoading(false);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'Discount': return 'warning';
      case 'Clearance': return 'error';
      case 'Bundle': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading inventory analytics...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Card View">
              <IconButton 
                size="small" 
                color={viewMode === 'cards' ? 'primary' : 'default'}
                onClick={() => setViewMode('cards')}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="List View">
              <IconButton 
                size="small" 
                color={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => setViewMode('list')}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            size="small"
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            size="small"
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {formatCurrency(analyticsData.kpis.totalValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Inventory Value
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                  +12.5%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {analyticsData.kpis.totalItems.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Items
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                  +8.2%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {analyticsData.kpis.turnoverRate}x
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Turnover Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                  +0.3x
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {analyticsData.kpis.accuracyRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accuracy Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                  +1.2%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {analyticsData.kpis.stockoutRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stockout Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingDownIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                  -0.8%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {formatCurrency(analyticsData.kpis.carryingCost)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Carrying Cost
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingDownIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                  -5.3%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* ABC Analysis Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ABC Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Inventory value distribution by category
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.abcAnalysis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.abcAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>

              <Box sx={{ mt: 2 }}>
                {analyticsData.abcAnalysis.map((item) => (
                  <Box key={item.category} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: item.color,
                          borderRadius: '50%'
                        }}
                      />
                      <Typography variant="body2">Category {item.category}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {item.items} items ({item.percentage}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Turnover Trend Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Turnover Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monthly turnover rate and inventory value
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.turnoverTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="turnover" 
                    stroke="#2196F3" 
                    strokeWidth={2}
                    name="Turnover Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Tables */}
      <Grid container spacing={3}>
        {/* Top Performing Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Top Performing Products
                </Typography>
                <Chip label="High Turnover" color="success" size="small" />
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Turnover</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {product.sku}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${product.turnover}x`}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {formatCurrency(product.value)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUpIcon fontSize="small" color="success" />
                            <Typography variant="body2" color="success.main">
                              {product.growth}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Slow Moving Items */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Slow Moving Items
                </Typography>
                <Chip label="Action Required" color="warning" size="small" />
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Days in Stock</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Recommendation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.slowMoving.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {item.sku}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${item.daysInStock} days`}
                            color="warning"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {formatCurrency(item.value)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.recommendation}
                            color={getRecommendationColor(item.recommendation)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stockout Alerts */}
      {analyticsData.stockoutAlerts.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningIcon color="warning" />
              <Typography variant="h6">
                Stockout Alerts
              </Typography>
              <Badge badgeContent={analyticsData.stockoutAlerts.length} color="error" />
            </Box>
            
            <Grid container spacing={2}>
              {analyticsData.stockoutAlerts.map((alert, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Alert 
                    severity={alert.priority === 'high' ? 'error' : 'warning'}
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {alert.product}
                    </Typography>
                    <Typography variant="caption">
                      Out of stock for {alert.daysOut} days
                    </Typography>
                    <Typography variant="caption" display="block">
                      Potential lost sales: {formatCurrency(alert.lostSales)}
                    </Typography>
                  </Alert>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default InventoryAnalytics;
