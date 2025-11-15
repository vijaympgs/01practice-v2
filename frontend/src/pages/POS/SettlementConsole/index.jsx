import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  MonetizationOn as MoneyIcon,
  Assessment as StatusIcon,
  CreditCard as CardIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  DoneAll as DoneAllIcon,
  CheckCircle as CheckIcon,
  PointOfSale as CashDrawerIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/common/PageTitle';

// Import tab components
import CashCountTab from './components/CashCountTab';
import CardReconciliationTab from './components/CardReconciliationTab';
import AdjustmentsTab from './components/AdjustmentsTab';
import CompleteSettlementTab from './components/CompleteSettlementTab';

// Import hooks
import { useSettlementState } from './hooks/useSettlementState';
import { useStatusCards } from './hooks/useStatusCards';

/**
 * Settlement Console
 * Tab-based settlement interface similar to Day Management Console
 * Provides easy navigation between settlement steps with status overview
 */
const SettlementConsole = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cash-count');
  const [loading, setLoading] = useState(false);
  
  // Use custom hooks for state management
  const { 
    settlement, 
    updateSettlement, 
    updateDenomination,
    addAdjustment,
    removeAdjustment,
    completeSettlement,
    settlementValidation,
    loading: settlementLoading,
    saving
  } = useSettlementState();
  
  const { 
    statusCards, 
    refreshStatus 
  } = useStatusCards(settlement);

  // Check for active session on component mount
  useEffect(() => {
    refreshStatus();
  }, []);

  const tabs = [
    {
      id: 'cash-count',
      label: 'Cash Count',
      icon: <MoneyIcon />,
      description: 'Count, verify and record physical cash by denomination',
      component: CashCountTab,
      color: theme.palette.success.main,
    },
    {
      id: 'card-reconciliation',
      label: 'Card Reconciliation',
      icon: <CardIcon />,
      description: 'Match processor reports for card, UPI and wallet payments',
      component: CardReconciliationTab,
      color: theme.palette.info.main,
    },
    {
      id: 'adjustments',
      label: 'Adjustments',
      icon: <TrendingUpIcon />,
      description: 'Track manual adjustments, refunds and cash drops',
      component: AdjustmentsTab,
      color: theme.palette.warning.main,
    },
    {
      id: 'complete-settlement',
      label: 'Complete Settlement',
      icon: <DoneAllIcon />,
      description: 'Final review and complete the settlement handover',
      component: CompleteSettlementTab,
      color: theme.palette.error.main,
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Helper function to convert icon string to React component
  const getIconComponent = (iconName) => {
    const iconMap = {
      'MoneyIcon': <MoneyIcon />,
      'CardIcon': <CardIcon />,
      'TrendingUpIcon': <TrendingUpIcon />,
      'TrendingDownIcon': <TrendingDownIcon />,
      'DoneAllIcon': <DoneAllIcon />,
      'CheckIcon': <CheckIcon />,
    };
    return iconMap[iconName] || <MoneyIcon />;
  };

  const renderTabContent = () => {
    const activeTabData = tabs.find(t => t.id === activeTab);
    if (activeTabData && activeTabData.component) {
      const TabComponent = activeTabData.component;
      const commonProps = {
        settlement,
        updateSettlement,
        updateDenomination,
        addAdjustment,
        removeAdjustment,
        completeSettlement,
        settlementValidation,
        saving
      };
      
      // Pass only the props that each component needs
      switch (activeTab) {
        case 'cash-count':
          return <TabComponent {...commonProps} />;
        case 'card-reconciliation':
          return <TabComponent {...commonProps} />;
        case 'adjustments':
          return <TabComponent {...commonProps} />;
        case 'complete-settlement':
          return <TabComponent {...commonProps} />;
        default:
          return <TabComponent {...commonProps} />;
      }
    }
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography variant="body1" color="text.secondary">
          Component not found for tab: {activeTab}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        py: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PageTitle
              title="Settlement Console"
              subtitle="Tab-based settlement workflow for shift handover and reconciliation"
              icon={<CashDrawerIcon />}
              showIcon
            />
          </Box>

          {/* Status Overview Cards */}
          <Grid container spacing={2}>
            {statusCards.map((status, index) => (
              <Grid item xs={12} md={3} key={status.title}>
                <Card
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette[status.color]?.main || theme.palette.grey[500], 0.2)}`,
                    bgcolor: alpha(theme.palette[status.color]?.main || theme.palette.grey[500], 0.04),
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    }
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    {getIconComponent(status.icon)}
                    <Typography variant="h6" fontWeight={600}>
                      {status.title}
                    </Typography>
                    <Chip
                      label={status.value}
                      color={status.color}
                      variant="filled"
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {status.details}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Main Console Area */}
          <Paper
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              p: 3,
              bgcolor: 'background.paper',
            }}
          >
            {/* Tab Navigation - Styled as Action Buttons */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="contained"
                    onClick={() => handleTabChange(tab.id)}
                    startIcon={tab.icon}
                    sx={{
                      backgroundColor: activeTab === tab.id ? tab.color : 'grey.500',
                      color: 'white',
                      px: 3,
                      py: 1.5,
                      minWidth: 160,
                      borderRadius: 1,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: activeTab === tab.id ? 2 : 1,
                      '&:hover': {
                        backgroundColor: tab.color,
                        boxShadow: 3,
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Tab Content */}
            <Box sx={{ minHeight: 400 }}>
              {renderTabContent()}
            </Box>

            {/* Information Panel */}
            <Alert 
              severity="info" 
              sx={{ mt: 2 }}
            >
              <Typography variant="body2">
                <strong>Settlement Console</strong> provides a tab-based interface for all settlement operations. 
                Navigate between tabs to access detailed functions for cash counting, payment reconciliation, adjustments, and final settlement completion.
              </Typography>
            </Alert>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default SettlementConsole;
