import React, { useState } from 'react';
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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  RadioGroup,
  Radio,
  FormControlLabel as RadioFormControlLabel,
} from '@mui/material';
import {
  Save,
  Refresh,
  Add,
  Edit,
  Delete,
  Person,
  Analytics,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  Warning,
  CheckCircle,
  Schedule,
  Visibility,
  VisibilityOff,
  FilterList,
  Group,
  Assessment,
  PieChart,
  BarChart,
  ShowChart,
  ExpandMore,
  Business,
  Home,
  Work,
  School,
  Favorite,
  History,
  Receipt,
  Payment,
  Security,
} from '@mui/icons-material';

const CustomerSegmentation = () => {
  const [segments, setSegments] = useState([
    {
      id: 1,
      name: 'High Value Customers',
      description: 'Customers with high lifetime value and frequent purchases',
      criteria: {
        lifetimeValue: { min: 10000, max: null },
        purchaseFrequency: 'monthly',
        lastPurchaseDays: 30,
        orderCount: { min: 10, max: null },
      },
      customerCount: 245,
      totalValue: 2450000,
      averageValue: 10000,
      growthRate: 12.5,
      status: 'active',
      color: 'success',
      rules: [
        'Lifetime value > $10,000',
        'Purchase frequency: Monthly or higher',
        'Last purchase within 30 days',
        'Total orders > 10',
      ],
    },
    {
      id: 2,
      name: 'At-Risk Customers',
      description: 'Customers showing signs of churn or reduced engagement',
      criteria: {
        lifetimeValue: { min: 1000, max: 5000 },
        purchaseFrequency: 'quarterly',
        lastPurchaseDays: 90,
        orderCount: { min: 3, max: 10 },
      },
      customerCount: 156,
      totalValue: 468000,
      averageValue: 3000,
      growthRate: -8.2,
      status: 'active',
      color: 'warning',
      rules: [
        'Lifetime value between $1,000 - $5,000',
        'Purchase frequency: Quarterly or lower',
        'Last purchase > 90 days ago',
        'Total orders between 3-10',
      ],
    },
    {
      id: 3,
      name: 'New Customers',
      description: 'Recently acquired customers in their first year',
      criteria: {
        lifetimeValue: { min: 100, max: 1000 },
        purchaseFrequency: 'any',
        lastPurchaseDays: 365,
        orderCount: { min: 1, max: 3 },
        customerSince: 365,
      },
      customerCount: 892,
      totalValue: 356800,
      averageValue: 400,
      growthRate: 45.8,
      status: 'active',
      color: 'info',
      rules: [
        'Customer since < 365 days',
        'Lifetime value between $100 - $1,000',
        'Total orders between 1-3',
      ],
    },
    {
      id: 4,
      name: 'Premium Loyalty Members',
      description: 'Gold and Platinum tier loyalty program members',
      criteria: {
        loyaltyTier: ['Gold', 'Platinum'],
        lifetimeValue: { min: 5000, max: null },
        purchaseFrequency: 'monthly',
        lastPurchaseDays: 60,
      },
      customerCount: 89,
      totalValue: 890000,
      averageValue: 10000,
      growthRate: 15.3,
      status: 'active',
      color: 'primary',
      rules: [
        'Loyalty tier: Gold or Platinum',
        'Lifetime value > $5,000',
        'Purchase frequency: Monthly or higher',
        'Last purchase within 60 days',
      ],
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: {
      lifetimeValue: { min: 0, max: null },
      purchaseFrequency: 'any',
      lastPurchaseDays: 30,
      orderCount: { min: 1, max: null },
      loyaltyTier: [],
    },
    rules: [],
  });

  const getSegmentColor = (color) => {
    switch (color) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'primary': return 'primary';
      default: return 'default';
    }
  };

  const getGrowthIcon = (growthRate) => {
    if (growthRate > 0) return <TrendingUp color="success" />;
    if (growthRate < 0) return <TrendingDown color="error" />;
    return <TrendingUp color="disabled" />;
  };

  const handleAddSegment = () => {
    setEditingSegment(null);
    setFormData({
      name: '',
      description: '',
      criteria: {
        lifetimeValue: { min: 0, max: null },
        purchaseFrequency: 'any',
        lastPurchaseDays: 30,
        orderCount: { min: 1, max: null },
        loyaltyTier: [],
      },
      rules: [],
    });
    setDialogOpen(true);
  };

  const handleEditSegment = (segment) => {
    setEditingSegment(segment);
    setFormData(segment);
    setDialogOpen(true);
  };

  const handleDeleteSegment = (id) => {
    setSegments(segments.filter(segment => segment.id !== id));
  };

  const handleSaveSegment = () => {
    if (editingSegment) {
      // Update existing segment
      setSegments(segments.map(segment => 
        segment.id === editingSegment.id ? { ...formData, id: editingSegment.id } : segment
      ));
    } else {
      // Add new segment
      const newSegment = {
        ...formData,
        id: Date.now(),
        customerCount: 0,
        totalValue: 0,
        averageValue: 0,
        growthRate: 0,
        status: 'active',
        color: 'default',
      };
      setSegments([...segments, newSegment]);
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingSegment(null);
  };

  const renderSegmentCard = (segment) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {segment.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {segment.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={`${segment.customerCount} customers`}
                color={getSegmentColor(segment.color)}
                size="small"
              />
              <Chip
                label={`$${segment.totalValue.toLocaleString()}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip
                icon={getGrowthIcon(segment.growthRate)}
                label={`${segment.growthRate > 0 ? '+' : ''}${segment.growthRate}%`}
                color={segment.growthRate > 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" color="primary">
              ${segment.averageValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Value
            </Typography>
          </Box>
        </Box>

        {/* Segment Rules */}
        <Typography variant="subtitle2" gutterBottom>
          Segmentation Rules
        </Typography>
        <List dense>
          {segment.rules.map((rule, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary={rule} />
            </ListItem>
          ))}
        </List>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" startIcon={<Analytics />}>
              View Analytics
            </Button>
            <Button size="small" startIcon={<Person />}>
              View Customers
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => handleEditSegment(segment)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => handleDeleteSegment(segment.id)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderSegmentAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Segment Distribution
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <PieChart sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Pie chart visualization will be implemented with Chart.js
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
              Segment Performance
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <BarChart sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Bar chart visualization will be implemented with Chart.js
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
              Segment Trends
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Customer Segmentation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage customer segments for targeted marketing and analysis
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSegment}
        >
          Create Segment
        </Button>
      </Box>

      {/* Segments List */}
      <Grid container spacing={3}>
        {segments.map((segment) => (
          <Grid item xs={12} md={6} key={segment.id}>
            {renderSegmentCard(segment)}
          </Grid>
        ))}
      </Grid>

      {/* Analytics Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Segmentation Analytics
        </Typography>
        {renderSegmentAnalytics()}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSegment ? 'Edit Segment' : 'Create New Segment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Segment Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Segmentation Criteria
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" gutterBottom>
                Lifetime Value Range
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  label="Min"
                  type="number"
                  value={formData.criteria.lifetimeValue.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      lifetimeValue: {
                        ...formData.criteria.lifetimeValue,
                        min: parseFloat(e.target.value)
                      }
                    }
                  })}
                  InputProps={{ startAdornment: '$' }}
                />
                <Typography variant="body2">to</Typography>
                <TextField
                  size="small"
                  label="Max"
                  type="number"
                  value={formData.criteria.lifetimeValue.max || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      lifetimeValue: {
                        ...formData.criteria.lifetimeValue,
                        max: e.target.value ? parseFloat(e.target.value) : null
                      }
                    }
                  })}
                  InputProps={{ startAdornment: '$' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Purchase Frequency</InputLabel>
                <Select
                  value={formData.criteria.purchaseFrequency}
                  label="Purchase Frequency"
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      purchaseFrequency: e.target.value
                    }
                  })}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Purchase (Days Ago)"
                type="number"
                value={formData.criteria.lastPurchaseDays}
                onChange={(e) => setFormData({
                  ...formData,
                  criteria: {
                    ...formData.criteria,
                    lastPurchaseDays: parseInt(e.target.value)
                  }
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" gutterBottom>
                Order Count Range
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  label="Min"
                  type="number"
                  value={formData.criteria.orderCount.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      orderCount: {
                        ...formData.criteria.orderCount,
                        min: parseInt(e.target.value)
                      }
                    }
                  })}
                />
                <Typography variant="body2">to</Typography>
                <TextField
                  size="small"
                  label="Max"
                  type="number"
                  value={formData.criteria.orderCount.max || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      orderCount: {
                        ...formData.criteria.orderCount,
                        max: e.target.value ? parseInt(e.target.value) : null
                      }
                    }
                  })}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSaveSegment} variant="contained">
            {editingSegment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerSegmentation;

