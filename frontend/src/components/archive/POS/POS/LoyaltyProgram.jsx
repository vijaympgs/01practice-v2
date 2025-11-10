import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Loyalty,
  Star,
  StarBorder,
  Add,
  Remove,
  Search,
  Close,
  Save,
  TrendingUp,
  AttachMoney,
  Person,
  History,
  QrCode,
  Print,
  ExpandMore,
  Edit,
  Delete,
  Visibility,
  LocalOffer,
  CardGiftcard,
  Redeem,
  EmojiEvents,
  Diamond
} from '@mui/icons-material';

const LoyaltyProgram = ({ open, onClose, session, customer, cartTotal, onPointsRedemption }) => {
  const [customerPoints, setCustomerPoints] = useState(0);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [pointsToEarn, setPointsToEarn] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loyaltyTiers = [
    { name: 'Bronze', minPoints: 0, color: '#CD7F32', multiplier: 1.0 },
    { name: 'Silver', minPoints: 1000, color: '#C0C0C0', multiplier: 1.2 },
    { name: 'Gold', minPoints: 5000, color: '#FFD700', multiplier: 1.5 },
    { name: 'Platinum', minPoints: 10000, color: '#E5E4E2', multiplier: 2.0 }
  ];

  // Mock rewards data
  const mockRewards = [
    {
      id: 'R001',
      name: '₹50 Discount',
      type: 'discount',
      pointsRequired: 500,
      value: 50,
      description: 'Get ₹50 off your purchase',
      validUntil: '2025-12-31',
      applicableOn: 'All Products'
    },
    {
      id: 'R002',
      name: 'Free Shipping',
      type: 'shipping',
      pointsRequired: 300,
      value: 0,
      description: 'Free shipping on your order',
      validUntil: '2025-12-31',
      applicableOn: 'Orders above ₹500'
    },
    {
      id: 'R003',
      name: 'Premium Product Sample',
      type: 'product',
      pointsRequired: 800,
      value: 0,
      description: 'Get a free sample of our premium product',
      validUntil: '2025-12-31',
      applicableOn: 'Premium Products'
    },
    {
      id: 'R004',
      name: '₹100 Store Credit',
      type: 'credit',
      pointsRequired: 1000,
      value: 100,
      description: '₹100 store credit for future purchases',
      validUntil: '2025-12-31',
      applicableOn: 'All Products'
    }
  ];

  useEffect(() => {
    if (open && customer) {
      // Load customer points and rewards
      const customerData = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        totalPoints: customer.loyaltyPoints || 0,
        tier: getCustomerTier(customer.loyaltyPoints || 0),
        pointsHistory: [
          { date: '2025-01-10', type: 'earned', points: 50, description: 'Purchase at Store' },
          { date: '2025-01-08', type: 'redeemed', points: -100, description: 'Redeemed ₹10 discount' },
          { date: '2025-01-05', type: 'earned', points: 75, description: 'Purchase at Store' }
        ]
      };
      
      setCustomerPoints(customerData.totalPoints);
      setAvailableRewards(mockRewards);
      setPointsToEarn(Math.floor(cartTotal * 0.05)); // 5% points on purchase
    }
  }, [open, customer, cartTotal]);

  const getCustomerTier = (points) => {
    for (let i = loyaltyTiers.length - 1; i >= 0; i--) {
      if (points >= loyaltyTiers[i].minPoints) {
        return loyaltyTiers[i];
      }
    }
    return loyaltyTiers[0];
  };

  const handleRedeemPoints = (reward) => {
    if (customerPoints < reward.pointsRequired) {
      setSnackbar({
        open: true,
        message: 'Insufficient points for this reward',
        severity: 'error'
      });
      return;
    }

    setSelectedReward(reward);
    setPointsToRedeem(reward.pointsRequired);
  };

  const confirmRedemption = () => {
    if (!selectedReward) return;

    const redemption = {
      id: `RED${Date.now()}`,
      rewardId: selectedReward.id,
      rewardName: selectedReward.name,
      pointsUsed: pointsToRedeem,
      value: selectedReward.value,
      type: selectedReward.type,
      redeemedAt: new Date(),
      customerId: customer.id,
      appliedBy: session.user.name
    };

    // Apply redemption to cart
    if (onPointsRedemption) {
      onPointsRedemption(redemption);
    }

    // Update customer points
    setCustomerPoints(prev => prev - pointsToRedeem);

    setSnackbar({
      open: true,
      message: `Reward redeemed successfully! ${selectedReward.description}`,
      severity: 'success'
    });

    setSelectedReward(null);
    setPointsToRedeem(0);
  };

  const calculateDiscount = () => {
    if (!selectedReward) return 0;
    
    if (selectedReward.type === 'discount') {
      return Math.min(selectedReward.value, cartTotal * 0.5); // Max 50% discount
    }
    return selectedReward.value;
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  if (!customer) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Loyalty Program</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Customer Selected
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please select a customer to access loyalty program features
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const currentTier = getCustomerTier(customerPoints);
  const nextTier = loyaltyTiers.find(tier => tier.minPoints > customerPoints);
  const progressToNextTier = nextTier ? 
    ((customerPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Loyalty Program - {customer.name}</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Customer Points Summary */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: currentTier.color, width: 60, height: 60 }}>
                    <Star />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="primary.contrastText">
                      {customerPoints.toLocaleString()} Points
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                      {currentTier.name} Member
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" color="primary.contrastText" gutterBottom>
                    Progress to {nextTier?.name || 'Max Tier'}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progressToNextTier}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: currentTier.color
                      }
                    }}
                  />
                  {nextTier && (
                    <Typography variant="caption" color="primary.contrastText">
                      {nextTier.minPoints - customerPoints} points to go
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Points Earning Preview */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'success.light' }}>
            <Typography variant="h6" color="success.contrastText" gutterBottom>
              Points You'll Earn
            </Typography>
            <Typography variant="h4" color="success.contrastText">
              +{pointsToEarn} Points
            </Typography>
            <Typography variant="body2" color="success.contrastText">
              From this purchase (₹{cartTotal.toLocaleString()})
            </Typography>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Available Rewards" />
              <Tab label="Points History" />
              <Tab label="Tier Benefits" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Available Rewards */}
            <Typography variant="h6" gutterBottom>
              Available Rewards
            </Typography>
            <Grid container spacing={2}>
              {availableRewards.map((reward) => (
                <Grid item xs={12} sm={6} md={4} key={reward.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedReward?.id === reward.id ? 2 : 1,
                      borderColor: selectedReward?.id === reward.id ? 'primary.main' : 'divider',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                    onClick={() => setSelectedReward(reward)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <CardGiftcard />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" noWrap>
                            {reward.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reward.pointsRequired} points
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {reward.description}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={reward.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Button
                          size="small"
                          variant={selectedReward?.id === reward.id ? 'contained' : 'outlined'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRedeemPoints(reward);
                          }}
                          disabled={customerPoints < reward.pointsRequired}
                        >
                          {customerPoints >= reward.pointsRequired ? 'Redeem' : 'Insufficient Points'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Selected Reward Details */}
            {selectedReward && (
              <Paper sx={{ p: 2, mt: 3, bgcolor: 'primary.light' }}>
                <Typography variant="h6" color="primary.contrastText" gutterBottom>
                  Selected Reward
                </Typography>
                <Typography variant="body1" color="primary.contrastText" gutterBottom>
                  {selectedReward.name} - {selectedReward.description}
                </Typography>
                <Typography variant="body2" color="primary.contrastText">
                  Points Required: {selectedReward.pointsRequired}
                </Typography>
                <Typography variant="body2" color="primary.contrastText">
                  Value: ₹{calculateDiscount().toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={confirmRedemption}
                  sx={{ mt: 2 }}
                  startIcon={<Redeem />}
                >
                  Confirm Redemption
                </Button>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Points History */}
            <Typography variant="h6" gutterBottom>
              Points History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>2025-01-10</TableCell>
                    <TableCell>
                      <Chip label="Earned" color="success" size="small" />
                    </TableCell>
                    <TableCell>+50</TableCell>
                    <TableCell>Purchase at Store</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-01-08</TableCell>
                    <TableCell>
                      <Chip label="Redeemed" color="warning" size="small" />
                    </TableCell>
                    <TableCell>-100</TableCell>
                    <TableCell>Redeemed ₹10 discount</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-01-05</TableCell>
                    <TableCell>
                      <Chip label="Earned" color="success" size="small" />
                    </TableCell>
                    <TableCell>+75</TableCell>
                    <TableCell>Purchase at Store</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Tier Benefits */}
            <Typography variant="h6" gutterBottom>
              Loyalty Tiers & Benefits
            </Typography>
            <Grid container spacing={2}>
              {loyaltyTiers.map((tier, index) => (
                <Grid item xs={12} sm={6} md={3} key={tier.name}>
                  <Card 
                    sx={{ 
                      border: currentTier.name === tier.name ? 2 : 1,
                      borderColor: currentTier.name === tier.name ? tier.color : 'divider',
                      bgcolor: currentTier.name === tier.name ? `${tier.color}20` : 'background.paper'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: tier.color, width: 60, height: 60, mx: 'auto', mb: 2 }}>
                        <Star />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {tier.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {tier.minPoints}+ Points
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tier.multiplier}x Points Multiplier
                      </Typography>
                      {currentTier.name === tier.name && (
                        <Chip label="Current Tier" color="primary" size="small" sx={{ mt: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default LoyaltyProgram;
