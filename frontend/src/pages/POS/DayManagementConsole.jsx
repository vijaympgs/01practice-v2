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
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Event as DayManagementIcon,
  PlayArrow as DayOpenIcon,
  Computer as SessionIcon,
  Stop as DayEndIcon,
  Dashboard as DashboardIcon,
  Assessment as StatusIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';

// Import existing components for consolidation
import DayOpenPage from './DayOpenPage';
import SessionOpenPage from './SessionOpenPage';
import DayEndProcessModule from './DayEndProcessModule';

/**
 * Day Management Console
 * Consolidates Day Open, Session Open, and Day End functions into one unified interface
 * Provides a centralized dashboard for day management operations
 */
const DayManagementConsole = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // State for tracking day operations
  const [dayStatus, setDayStatus] = useState({
    hasActiveDay: false,
    activeSession: null,
    dayEndCompleted: false,
  });

  // Check active day status on component mount
  useEffect(() => {
    checkDayStatus();
  }, []);

  const checkDayStatus = async () => {
    setLoading(true);
    try {
      // Check for active day open
      const dayResponse = await fetch('/api/day-opens/active/');
      const hasActiveDay = dayResponse.ok && dayResponse.data;
      
      // Check for active session
      let activeSession = null;
      try {
        const sessionResponse = await fetch('/pos-sessions/', {
          params: { status: 'open', page_size: 1 }
        });
        const sessions = sessionResponse.data?.results || [];
        activeSession = sessions.length > 0 ? sessions[0] : null;
      } catch (error) {
        console.warn('Could not check session status:', error);
      }
      
      setDayStatus({
        hasActiveDay,
        activeSession,
        dayEndCompleted: false,
      });
    } catch (error) {
      console.error('Error checking day status:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'day-open',
      label: 'Day Open',
      icon: <DayOpenIcon />,
      description: 'Open the business day and initialize operations',
      component: DayOpenPage,
      props: { showHeader: false, condensed: true },
    },
    {
      id: 'session-open',
      label: 'Session Open',
      icon: <SessionIcon />,
      description: 'Start a new POS session with opening balance',
      component: SessionOpenPage,
      props: { showHeader: false, condensed: true },
    },
    {
      id: 'day-end',
      label: 'Day End',
      icon: <DayEndIcon />,
      description: 'Complete day end process and generate reports',
      component: DayEndProcessModule,
      props: { showHeader: false },
    },
  ];

  const statusCards = [
    {
      title: 'Business Day Status',
      icon: <DashboardIcon />,
      color: dayStatus.hasActiveDay ? 'success' : 'warning',
      value: dayStatus.hasActiveDay ? 'Active' : 'Not Open',
      details: dayStatus.hasActiveDay 
        ? `Business Date: ${dayStatus.hasActiveDay.business_date || 'N/A'}`
        : 'No active business day',
    },
    {
      title: 'Session Status',
      icon: <SessionIcon />,
      color: dayStatus.activeSession ? 'info' : 'default',
      value: dayStatus.activeSession ? 'Active' : 'No Active Session',
      details: dayStatus.activeSession 
        ? `Session: ${dayStatus.activeSession.session_number || 'N/A'}`
        : 'No active session',
    },
    {
      title: 'Day End Status',
      icon: <DayEndIcon />,
      color: dayStatus.dayEndCompleted ? 'success' : 'default',
      value: dayStatus.dayEndCompleted ? 'Completed' : 'Pending',
      details: dayStatus.dayEndCompleted 
        ? `Completed at ${new Date().toLocaleTimeString()}`
        : 'Day end not yet completed',
    },
  ];

  const getTabColor = (tabId) => {
    switch (tabId) {
      case 'day-open':
        return theme.palette.success.main;
      case 'session-open':
        return theme.palette.info.main;
      case 'day-end':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const renderTabContent = (tab) => {
    const TabComponent = tabs.find(t => t.id === tab.id)?.component;
    if (TabComponent) {
      return <TabComponent {...tab.props} />;
    }
    return null;
  };

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
              title="Day Management Console"
              subtitle="Centralized hub for day management operations"
              icon={<DayManagementIcon />}
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
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    {status.icon}
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
            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Stack direction="row" spacing={1}>
                {tabs.map((tab, index) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab(tab.id)}
                    startIcon={tab.icon}
                    sx={{
                      backgroundColor: activeTab === tab.id ? getTabColor(tab.id) : 'transparent',
                      color: activeTab === tab.id ? 'white' : 'text.primary',
                      borderColor: activeTab === tab.id ? getTabColor(tab.id) : 'divider',
                      px: 3,
                      py: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: activeTab === tab.id ? alpha(getTabColor(tab.id), 0.08) : 'transparent',
                      },
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Tab Content */}
            <Box sx={{ minHeight: 400 }}>
              {renderTabContent(tabs[activeTab])}
            </Box>

            {/* Quick Actions */}
            <Box sx={{ 
              borderTop: 1, 
              borderColor: 'divider', 
              pt: 2, 
              mt: 2 
            }}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DayOpenIcon />}
                  onClick={() => setActiveTab('day-open')}
                  sx={{ minWidth: 140 }}
                >
                  Quick Day Open
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<SessionIcon />}
                  onClick={() => setActiveTab('session-open')}
                  sx={{ minWidth: 160 }}
                >
                  Quick Session Open
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<DayEndIcon />}
                  onClick={() => setActiveTab('day-end')}
                  sx={{ minWidth: 140 }}
                >
                  Quick Day End
                </Button>
              </Stack>
            </Box>

            {/* Information Panel */}
            <Alert 
              severity="info" 
              sx={{ mt: 2 }}
            >
              <Typography variant="body2">
                <strong>Day Management Console</strong> provides a unified interface for all day operations. 
                Navigate between tabs for detailed functions or use the quick action buttons above for immediate access.
              </Typography>
            </Alert>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default DayManagementConsole;
