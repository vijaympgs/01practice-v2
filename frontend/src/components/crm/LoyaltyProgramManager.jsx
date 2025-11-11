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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save,
  Refresh,
  Add,
  Edit,
  Delete,
  Loyalty,
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Schedule,
  Visibility,
  VisibilityOff,
  CardGiftcard,
  Redeem,
  Assessment,
  Analytics,
  ExpandMore,
  Person,
  Group,
  AttachMoney,
  Percent,
  CalendarToday,
  Settings,
} from '@mui/icons-material';

const LoyaltyProgramManager = () => {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  // Comprehensive loyalty program data
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([
    {
      id: 1,
      name: 'Premium Rewards Program',
      description: 'Our flagship loyalty program for high-value customers',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      tiers: [
        {
          name: 'Bronze',
          minPoints: 0,
          maxPoints: 999,
          benefits: [
            '1% cashback on all purchases',
            'Birthday discount',
            'Newsletter with exclusive offers',
          ],
          color: 'secondary',
          memberCount: 1250,
        },
        {
          name: 'Silver',
          minPoints: 1000,
          maxPoints: 4999,
          benefits: [
            '2% cashback on all purchases',
            'Free shipping on orders over $50',
            'Early access to sales',
            'Birthday discount',
          ],
          color: 'info',
          memberCount: 890,
        },
        {
          name: 'Gold',
          minPoints: 5000,
          maxPoints: 9999,
          benefits: [
            '3% cashback on all purchases',
            'Free shipping on all orders',
            'Priority customer support',
            'Exclusive product access',
            'Birthday gift',
          ],
          color: 'warning',
          memberCount: 245,
        },
        {
          name: 'Platinum',
          minPoints: 10000,
          maxPoints: null,
          benefits: [
            '5% cashback on all purchases',
            'Free shipping on all orders',
            'Dedicated account manager',
            'Exclusive events access',
            'Personal shopping assistant',
            'Birthday luxury gift',
          ],
          color: 'primary',
          memberCount: 89,
        },
      ],
      earningRules: [
        {
          id: 1,
          name: 'Purchase Points',
          description: 'Earn 1 point per $1 spent',
          multiplier: 1,
          category: 'All Products',
          status: 'active',
        },
        {
          id: 2,
          name: 'Electronics Bonus',
          description: 'Earn 2x points on electronics',
          multiplier: 2,
          category: 'Electronics',
          status: 'active',
        },
        {
          id: 3,
          name: 'Referral Bonus',
          description: 'Earn 500 points for each referral',
          multiplier: 1,
          category: 'Referral',
          status: 'active',
        },
      ],
      redemptionRules: [
        {
          id: 1,
          name: 'Cash Back',
          description: 'Redeem points for cash back',
          rate: 100, // 100 points = $1
          minRedemption: 1000,
          status: 'active',
        },
        {
          id: 2,
          name: 'Discount Vouchers',
          description: 'Redeem points for discount vouchers',
          rate: 150, // 150 points = $1 discount
          minRedemption: 1500,
          status: 'active',
        },
      ],
      analytics: {
        totalMembers: 2474,
        activeMembers: 2156,
        totalPointsIssued: 1250000,
        totalPointsRedeemed: 890000,
        redemptionRate: 71.2,
        averagePointsPerMember: 505,
        programValue: 125000,
      },
    },
  ]);

  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: 'Birthday Discount',
      type: 'discount',
      value: 25,
      valueType: 'percentage',
      description: '25% off on your birthday',
      eligibility: 'All tiers',
      status: 'active',
      usageCount: 156,
      redemptionRate: 68.5,
    },
    {
      id: 2,
      name: 'Free Shipping',
      type: 'benefit',
      value: 0,
      valueType: 'fixed',
      description: 'Free shipping on all orders',
      eligibility: 'Gold and Platinum',
      status: 'active',
      usageCount: 892,
      redemptionRate: 95.2,
    },
    {
      id: 3,
      name: 'Welcome Bonus',
      type: 'points',
      value: 500,
      valueType: 'points',
      description: '500 bonus points for new members',
      eligibility: 'New members',
      status: 'active',
      usageCount: 445,
      redemptionRate: 100,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    tiers: [],
    earningRules: [],
    redemptionRules: [],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTierColor = (color) => {
    switch (color) {
      case 'primary': return 'primary';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'secondary': return 'secondary';
      default: return 'default';
    }
  };

  const renderProgramOverview = () => (
    <Grid container spacing={3}>
      {loyaltyPrograms.map((program) => (
        <Grid item xs={12} key={program.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {program.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {program.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={program.status}
                      color={program.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                    <Chip
                      label={`${program.analytics.totalMembers} members`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={`${program.analytics.redemptionRate}% redemption`}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary">
                    ${program.analytics.programValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Program Value
                  </Typography>
                </Box>
              </Box>

              {/* Program Tiers */}
              <Typography variant="h6" gutterBottom>
                Loyalty Tiers
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {program.tiers.map((tier, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: `${getTierColor(tier.color)}.main` }}>
                            <Star />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{tier.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {tier.minPoints} - {tier.maxPoints || '∞'} points
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="primary" gutterBottom>
                          {tier.memberCount} members
                        </Typography>
                        <List dense>
                          {tier.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                            <ListItem key={benefitIndex} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <CheckCircle color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={benefit}
                                primaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                          ))}
                          {tier.benefits.length > 2 && (
                            <Typography variant="caption" color="text.secondary">
                              +{tier.benefits.length - 2} more benefits
                            </Typography>
                          )}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Analytics Summary */}
              <Typography variant="h6" gutterBottom>
                Program Analytics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {program.analytics.totalMembers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Members
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {program.analytics.activeMembers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Members
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="warning.main">
                      {program.analytics.totalPointsIssued.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Points Issued
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="info.main">
                      {program.analytics.averagePointsPerMember}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Points/Member
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderRewardsManagement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Rewards & Benefits</Typography>
          <Button variant="contained" startIcon={<Add />}>
            Add Reward
          </Button>
        </Box>
      </Grid>
      
      {rewards.map((reward) => (
        <Grid item xs={12} md={6} lg={4} key={reward.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <CardGiftcard />
                </Avatar>
                <Box>
                  <Typography variant="h6">{reward.name}</Typography>
                  <Chip
                    label={reward.type}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {reward.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Eligibility: {reward.eligibility}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usage: {reward.usageCount} times
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Redemption Rate: {reward.redemptionRate}%
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<Edit />}>
                  Edit
                </Button>
                <Button size="small" startIcon={<Analytics />}>
                  Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderProgramAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Membership Trends
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Line chart visualization will be implemented with Chart.js
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
              Tier Distribution
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
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
              Points Issuance vs Redemption
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Analytics sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Bar chart visualization will be implemented with Chart.js
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
        return renderProgramOverview();
      case 1:
        return renderRewardsManagement();
      case 2:
        return renderProgramAnalytics();
      default:
        return renderProgramOverview();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Loyalty Program Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage loyalty programs, tiers, rewards, and customer engagement
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
          >
            Create Program
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Loyalty />} 
            label="Program Overview" 
            iconPosition="start"
          />
          <Tab 
            icon={<CardGiftcard />} 
            label="Rewards Management" 
            iconPosition="start"
          />
          <Tab 
            icon={<Analytics />} 
            label="Program Analytics" 
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

export default LoyaltyProgramManager;

