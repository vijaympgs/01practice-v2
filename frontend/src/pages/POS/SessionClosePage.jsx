import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as PermanentCloseIcon,
  PauseCircle as TemporaryCloseIcon,
  Person as PersonIcon,
  Computer as TerminalIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import PageTitle from '../../components/common/PageTitle';

/**
 * Session Close Page
 * Based on 2.4.3.12. Session Logoff specification
 * 
 * Features:
 * - Temporary Close: User can re-logon with same session with authorization
 * - Permanent Close: Closes session for that day, sales consolidated, no further transactions
 * 
 * Fields (all read-only except close mode):
 * - User Code, User Name, Location, Till Code, Sale Date
 * - Session Date, Session Start Time, Session Close Time
 * - Float Amount
 * - Mode of closing: Temporary or Permanent
 */
const SessionClosePage = ({ showHeader = true, condensed = false, routePrefix = '/pos' }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const { displaySuccess, displayError } = useNotification();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Current session data
  const [currentSession, setCurrentSession] = useState(null);
  
  // Session display data - mostly read-only
  const [sessionData, setSessionData] = useState({
    userCode: '',
    userName: '',
    location: '',
    locationName: '',
    tillCode: '',
    tillName: '',
    saleDate: '',
    sessionDate: '',
    sessionStartTime: '',
    sessionCloseTime: '',
    floatAmount: '',
    sessionNumber: '',
    sessionShiftLabel: '',
  });

  // Close mode: 'temporary' or 'permanent'
  const [closeMode, setCloseMode] = useState('temporary');

  // Load current open session
  useEffect(() => {
    loadCurrentSession();
  }, []);

  const deriveSessionShiftLabel = (sessionNumber) => {
    if (!sessionNumber) return '';
    const match = sessionNumber.match(/(\d+)$/);
    if (match) {
      const sequence = parseInt(match[1], 10);
      if (!Number.isNaN(sequence)) {
        return `Session ${sequence}`;
      }
    }
    return sessionNumber;
  };

  const loadCurrentSession = async () => {
    try {
      setLoading(true);
      
      // Get current user data
      const userCode = user?.username || user?.id || '';
      const userName = user?.first_name && user?.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user?.username || '';

      // Find open session for this user
      let openSession = null;
      try {
        const sessionsResponse = await api.get('/pos-sessions/', {
          params: { 
            cashier: user?.id,
            status: 'open',
            ordering: '-opened_at',
            page_size: 1 
          }
        });
        
        const sessions = sessionsResponse.data?.results || sessionsResponse.data || [];
        if (sessions.length > 0) {
          openSession = sessions[0];
          setCurrentSession(openSession);
        } else {
          displayError('No open session found. Please open a session first.');
          setTimeout(() => navigate(`${routePrefix}/session-open`), 2000);
          return;
        }
      } catch (error) {
        console.error('Error loading session:', error);
        displayError('Failed to load current session.');
        return;
      }

      // Get user's POS location
      let locationCode = '';
      let locationName = '';
      let terminalCode = '';
      let terminalName = '';

      try {
        if (user?.pos_location_id) {
          const locationResponse = await api.get(`/organization/locations/${user.pos_location_id}/`);
          if (locationResponse.data) {
            locationCode = locationResponse.data.code || '';
            locationName = locationResponse.data.name || '';
          }
        }

        // Get terminal for this session
        if (openSession.terminal) {
          const terminalResponse = await api.get(`/pos-masters/terminals/${openSession.terminal}/`);
          if (terminalResponse.data) {
            terminalCode = terminalResponse.data.code || terminalResponse.data.name || '';
            terminalName = terminalResponse.data.name || '';
          }
        }
      } catch (error) {
        console.warn('Error loading location/terminal:', error);
      }

      // Get current business date
      const today = new Date();
      const businessDate = today.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });

      // Format session dates and times
      const sessionOpenDate = openSession.opened_at 
        ? new Date(openSession.opened_at).toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          })
        : businessDate;

      const sessionStartTime = openSession.opened_at
        ? new Date(openSession.opened_at).toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
          })
        : '';

      const sessionCloseTime = today.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      });

      setSessionData({
        userCode,
        userName,
        location: locationCode,
        locationName,
        tillCode: terminalCode,
        tillName: terminalName,
        saleDate: businessDate,
        sessionDate: sessionOpenDate,
        sessionStartTime,
        sessionCloseTime,
        floatAmount: openSession.opening_cash || '0.00',
        sessionNumber: openSession.session_number || '',
        sessionShiftLabel: deriveSessionShiftLabel(openSession.session_number),
      });

    } catch (error) {
      console.error('Error loading session data:', error);
      displayError('Failed to load session data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModeChange = (event) => {
    setCloseMode(event.target.value);
  };

  const handleCloseSession = () => {
    if (!currentSession) {
      displayError('No session found to close.');
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmCloseSession = async () => {
    setConfirmDialogOpen(false);
    
    if (!currentSession) {
      displayError('No session found to close.');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare close payload
      const closePayload = {
        status: 'closed',
        closed_at: new Date().toISOString(),
        close_mode: closeMode, // 'temporary' or 'permanent'
      };

      // If permanent close, calculate expected cash and differences
      if (closeMode === 'permanent') {
        // Calculate expected cash from session sales
        try {
          const salesResponse = await api.get('/sales/sales/', {
            params: {
              pos_session: currentSession.id,
              status: 'completed'
            }
          });
          
          const sales = salesResponse.data?.results || salesResponse.data || [];
          const totalSales = sales.reduce((sum, sale) => {
            return sum + parseFloat(sale.total_amount || 0);
          }, 0);
          
          const expectedCash = parseFloat(sessionData.floatAmount) + totalSales;
          closePayload.expected_cash = expectedCash;
          closePayload.settlement_status = 'completed';
        } catch (error) {
          console.warn('Could not calculate expected cash:', error);
        }
      }

      // Update session to closed
      const response = await api.patch(`/pos-sessions/${currentSession.id}/`, closePayload);

      if (response.data) {
        if (closeMode === 'permanent') {
          displaySuccess(`${sessionData.sessionShiftLabel || sessionData.sessionNumber} permanently closed. Sales have been consolidated.`);
          // Redirect after delay
          setTimeout(() => {
            navigate(routePrefix === '/pos' ? '/pos' : `${routePrefix}/shift-workflow`);
          }, 2000);
        } else {
          displaySuccess(`${sessionData.sessionShiftLabel || sessionData.sessionNumber} temporarily closed. You can reopen it with authorization.`);
          // Redirect after delay
          setTimeout(() => {
            navigate(routePrefix === '/pos' ? '/pos' : `${routePrefix}/shift-workflow`);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error closing session:', error);
      const errorMsg = error.response?.data?.detail 
        || error.response?.data?.message 
        || 'Failed to close session. Please try again.';
      displayError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderNoSession = () => (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: showHeader ? 2 : 0,
        borderColor: showHeader ? 'divider' : 'transparent',
        bgcolor: 'background.paper',
        p: { xs: 2, md: showHeader ? 3 : 2 },
      }}
    >
      <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
        No open session found. Please open a session first.
      </Alert>
      <Button
        variant="contained"
        onClick={() => navigate(`${routePrefix}/session-open`)}
      >
        Go to Session Open
      </Button>
    </Paper>
  );

  const renderMainContent = () => (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: showHeader ? 2 : 0,
        borderColor: showHeader ? 'divider' : 'transparent',
        bgcolor: 'background.paper',
        p: { xs: 2, md: showHeader ? 3 : 2 },
      }}
    >
      {!condensed && (
        <Typography
          variant="h6"
          sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}
        >
          <CloseIcon color="primary" />
          Session Logoff Information
        </Typography>
      )}

      <Grid container spacing={condensed ? 2 : 3}>
        {[
          { label: 'User Code', value: sessionData.userCode },
          { label: 'User Name', value: sessionData.userName },
          { label: 'Location', value: sessionData.locationName || sessionData.location || 'Not assigned' },
          { label: 'Till Code', value: sessionData.tillName || sessionData.tillCode || 'Not configured' },
          { label: 'Sale Date', value: sessionData.saleDate },
          {
            label: 'Session (Shift)',
            value: sessionData.sessionShiftLabel || sessionData.sessionNumber,
            helper: !condensed && sessionData.sessionNumber ? `Session code: ${sessionData.sessionNumber}` : undefined,
          },
          { label: 'Session Date', value: sessionData.sessionDate },
          { label: 'Session Start Time', value: sessionData.sessionStartTime },
          { label: 'Session Close Time', value: sessionData.sessionCloseTime },
        ].map(({ label, value, helper }) => (
          <Grid item xs={12} md={6} key={label}>
            <TextField
              fullWidth
              label={label}
              value={value}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              helperText={helper}
            />
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Float Amount"
            value={sessionData.floatAmount}
            InputProps={{
              readOnly: true,
              startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              Mode of Closing the Session
            </FormLabel>
            <RadioGroup value={closeMode} onChange={handleCloseModeChange} row sx={{ gap: 3 }}>
              {[
                {
                  key: 'temporary',
                  icon: <TemporaryCloseIcon />,
                  title: 'Temporary Close',
                  description: 'User can re-logon with the same session with authorization.',
                },
                {
                  key: 'permanent',
                  icon: <PermanentCloseIcon />,
                  title: 'Permanent Close',
                  description: 'Closes the session for that date and consolidates sales.',
                },
              ].map((mode) => (
                <Paper
                  key={mode.key}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    cursor: 'pointer',
                    border: closeMode === mode.key ? '2px solid' : '1px solid',
                    borderColor: closeMode === mode.key ? 'primary.main' : 'divider',
                    bgcolor: closeMode === mode.key ? 'action.selected' : 'background.paper',
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => setCloseMode(mode.key)}
                >
                  <Box sx={{ p: 2 }}>
                    <FormControlLabel
                      value={mode.key}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                          >
                            {mode.icon} {mode.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {mode.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Box>
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Alert
            severity={closeMode === 'permanent' ? 'warning' : 'info'}
            sx={{ mt: 2, borderRadius: 2 }}
            icon={closeMode === 'permanent' ? <LockIcon /> : <TemporaryCloseIcon />}
          >
            <Typography variant="body2">
              {closeMode === 'permanent'
                ? '⚠️ Permanent Close: This will close the session permanently. Sales will be consolidated and no further transactions can occur on the same business date.'
                : 'ℹ️ Temporary Close: Reopen this session later with authorization to continue transactions.'}
            </Typography>
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(routePrefix === '/pos' ? '/pos' : `${routePrefix}/shift-workflow`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color={closeMode === 'permanent' ? 'error' : 'primary'}
              startIcon={closeMode === 'permanent' ? <PermanentCloseIcon /> : <TemporaryCloseIcon />}
              onClick={handleCloseSession}
              disabled={submitting}
              size="large"
            >
              {submitting
                ? 'Closing Session...'
                : closeMode === 'permanent'
                ? 'Permanently Close Session'
                : 'Temporarily Close Session'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  if (loading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: showHeader ? theme.palette.grey[50] : 'transparent',
          minHeight: showHeader ? '100vh' : 'auto',
          py: showHeader ? { xs: 2, md: 3 } : 0,
        }}
      >
        <Box
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            px: showHeader ? { xs: 2, md: 3 } : 0,
            minHeight: showHeader ? '70vh' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: showHeader ? theme.palette.grey[50] : 'transparent',
        minHeight: showHeader ? '100vh' : 'auto',
        py: showHeader ? { xs: 2, md: 3 } : 0,
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          px: showHeader ? { xs: 2, md: 3 } : 0,
        }}
      >
        <Stack spacing={showHeader ? 3 : 2}>
          {showHeader && (
            <PageTitle
              title="Session Close"
              subtitle="Close the current POS session temporarily or permanently."
            />
          )}

          {currentSession ? renderMainContent() : renderNoSession()}
        </Stack>
      </Box>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Session Close</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {closeMode === 'permanent'
              ? `Are you sure you want to PERMANENTLY close session ${sessionData.sessionNumber}? This action cannot be undone. Sales will be consolidated and no further transactions will be allowed for this session on ${sessionData.saleDate}.`
              : `Are you sure you want to TEMPORARILY close session ${sessionData.sessionNumber}? You can reopen this session later with proper authorization.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmCloseSession}
            variant="contained"
            color={closeMode === 'permanent' ? 'error' : 'primary'}
            autoFocus
          >
            {closeMode === 'permanent' ? 'Permanently Close' : 'Temporarily Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionClosePage;

