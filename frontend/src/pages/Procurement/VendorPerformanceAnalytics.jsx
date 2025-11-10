import React, { useState } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Rating,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save,
  Refresh,
  Add,
  Edit,
  Delete,
  Business,
  LocalShipping,
  AttachMoney,
  Analytics,
  Assessment,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  Warning,
  CheckCircle,
  Schedule,
  Speed,
  ExpandMore,
  Visibility,
  VisibilityOff,
  CloudUpload,
  Download,
  FilterList,
  Sort,
  BarChart,
  PieChart,
  ShowChart,
} from '@mui/icons-material';

const VendorPerformanceAnalytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Comprehensive vendor performance data
  const [vendorPerformance, setVendorPerformance] = useState([
    {
      id: 1,
      vendor: {
        name: 'Apple Inc.',
        code: 'VENDOR-001',
        category: 'Electronics',
        status: 'active',
        avatar: '/api/placeholder/40/40',
      },
      metrics: {
        overallScore: 94,
        deliveryPerformance: 96,
        qualityScore: 98,
        costCompetitiveness: 89,
        communicationRating: 92,
        innovationScore: 95,
        sustainabilityScore: 88,
        complianceScore: 100,
      },
      kpis: {
        totalOrders: 245,
        onTimeDelivery: 94,
        qualityIssues: 2,
        averageResponseTime: '2 hours',
        priceVariance: -2.5,
        defectRate: 0.8,
        leadTime: 7,
        fillRate: 98,
      },
      trends: {
        deliveryTrend: 'up',
        qualityTrend: 'stable',
        costTrend: 'down',
        satisfactionTrend: 'up',
      },
      rankings: {
        overall: 1,
        delivery: 1,
        quality: 1,
        cost: 3,
        innovation: 1,
      },
      alerts: [
        { type: 'warning', message: 'Price increase expected next quarter' },
        { type: 'info', message: 'New product line available' },
      ],
    },
    {
      id: 2,
      vendor: {
        name: 'Samsung Electronics',
        code: 'VENDOR-002',
        category: 'Electronics',
        status: 'active',
        avatar: '/api/placeholder/40/40',
      },
      metrics: {
        overallScore: 91,
        deliveryPerformance: 92,
        qualityScore: 95,
        costCompetitiveness: 94,
        communicationRating: 89,
        innovationScore: 92,
        sustainabilityScore: 85,
        complianceScore: 98,
      },
      kpis: {
        totalOrders: 189,
        onTimeDelivery: 91,
        qualityIssues: 4,
        averageResponseTime: '4 hours',
        priceVariance: 1.2,
        defectRate: 1.5,
        leadTime: 10,
        fillRate: 96,
      },
      trends: {
        deliveryTrend: 'stable',
        qualityTrend: 'up',
        costTrend: 'stable',
        satisfactionTrend: 'stable',
      },
      rankings: {
        overall: 2,
        delivery: 2,
        quality: 2,
        cost: 1,
        innovation: 2,
      },
      alerts: [
        { type: 'success', message: 'Quality improvements implemented' },
      ],
    },
    {
      id: 3,
      vendor: {
        name: 'Dell Technologies',
        code: 'VENDOR-003',
        category: 'Electronics',
        status: 'active',
        avatar: '/api/placeholder/40/40',
      },
      metrics: {
        overallScore: 87,
        deliveryPerformance: 88,
        qualityScore: 90,
        costCompetitiveness: 91,
        communicationRating: 85,
        innovationScore: 89,
        sustainabilityScore: 92,
        complianceScore: 95,
      },
      kpis: {
        totalOrders: 156,
        onTimeDelivery: 88,
        qualityIssues: 6,
        averageResponseTime: '6 hours',
        priceVariance: -1.8,
        defectRate: 2.1,
        leadTime: 12,
        fillRate: 94,
      },
      trends: {
        deliveryTrend: 'up',
        qualityTrend: 'up',
        costTrend: 'down',
        satisfactionTrend: 'up',
      },
      rankings: {
        overall: 3,
        delivery: 3,
        quality: 3,
        cost: 2,
        innovation: 3,
      },
      alerts: [
        { type: 'warning', message: 'Lead time extension requested' },
        { type: 'info', message: 'New sustainability initiatives' },
      ],
    },
  ]);

  const getScoreColor = (score) => {
    if (score >= 95) return 'success';
    if (score >= 85) return 'warning';
    return 'error';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      default: return <TrendingUp color="disabled" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const renderVendorScorecard = (vendor) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={vendor.vendor.avatar} sx={{ width: 48, height: 48 }}>
              <Business />
            </Avatar>
            <Box>
              <Typography variant="h6">{vendor.vendor.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {vendor.vendor.code} • {vendor.vendor.category}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" color={`${getScoreColor(vendor.metrics.overallScore)}.main`}>
              {vendor.metrics.overallScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overall Score
            </Typography>
          </Box>
        </Box>

        {/* Performance Metrics */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Object.entries(vendor.metrics).slice(1, 5).map(([key, value]) => (
            <Grid item xs={6} sm={3} key={key}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color={`${getScoreColor(value)}.main`}>
                  {value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* KPIs */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom>
          Key Performance Indicators
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">Total Orders</Typography>
              <Typography variant="h6">{vendor.kpis.totalOrders}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">On-Time Delivery</Typography>
              <Typography variant="h6" color="success.main">{vendor.kpis.onTimeDelivery}%</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">Quality Issues</Typography>
              <Typography variant="h6" color={vendor.kpis.qualityIssues > 5 ? 'error.main' : 'success.main'}>
                {vendor.kpis.qualityIssues}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">Response Time</Typography>
              <Typography variant="h6">{vendor.kpis.averageResponseTime}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Alerts */}
        {vendor.alerts.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Alerts & Notifications
            </Typography>
            {vendor.alerts.map((alert, index) => (
              <Alert key={index} severity={getAlertColor(alert.type)} sx={{ mb: 1 }}>
                {alert.message}
              </Alert>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderPerformanceComparison = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Vendor Performance Comparison
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell align="center">Overall Score</TableCell>
                <TableCell align="center">Delivery</TableCell>
                <TableCell align="center">Quality</TableCell>
                <TableCell align="center">Cost</TableCell>
                <TableCell align="center">Communication</TableCell>
                <TableCell align="center">Ranking</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendorPerformance.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={vendor.vendor.avatar} sx={{ width: 32, height: 32 }}>
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {vendor.vendor.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vendor.vendor.code}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color={`${getScoreColor(vendor.metrics.overallScore)}.main`}>
                      {vendor.metrics.overallScore}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="body2">{vendor.metrics.deliveryPerformance}</Typography>
                      {getTrendIcon(vendor.trends.deliveryTrend)}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="body2">{vendor.metrics.qualityScore}</Typography>
                      {getTrendIcon(vendor.trends.qualityTrend)}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="body2">{vendor.metrics.costCompetitiveness}</Typography>
                      {getTrendIcon(vendor.trends.costTrend)}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{vendor.metrics.communicationRating}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`#${vendor.rankings.overall}`}
                      color={vendor.rankings.overall === 1 ? 'success' : vendor.rankings.overall === 2 ? 'warning' : 'default'}
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
  );

  const renderPerformanceTrends = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Delivery Performance Trends
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <BarChart sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Chart visualization will be implemented with Chart.js
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quality Score Distribution
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <PieChart sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Pie chart visualization will be implemented with Chart.js
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cost Performance Analysis
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <ShowChart sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Line chart visualization will be implemented with Chart.js
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return (
          <Grid container spacing={3}>
            {vendorPerformance.map((vendor) => (
              <Grid item xs={12} md={6} lg={4} key={vendor.id}>
                {renderVendorScorecard(vendor)}
              </Grid>
            ))}
          </Grid>
        );
      case 1:
        return renderPerformanceComparison();
      case 2:
        return renderPerformanceTrends();
      default:
        return (
          <Grid container spacing={3}>
            {vendorPerformance.map((vendor) => (
              <Grid item xs={12} md={6} lg={4} key={vendor.id}>
                {renderVendorScorecard(vendor)}
              </Grid>
            ))}
          </Grid>
        );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Vendor Performance Analytics" 
            subtitle="Comprehensive vendor performance metrics and analytics"
            showIcon={true}
            icon={<Analytics />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Assessment />} 
            label="Vendor Scorecards" 
            iconPosition="start"
          />
          <Tab 
            icon={<BarChart />} 
            label="Performance Comparison" 
            iconPosition="start"
          />
          <Tab 
            icon={<ShowChart />} 
            label="Trends & Analytics" 
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* Content */}
      {renderTabContent()}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorPerformanceAnalytics;

