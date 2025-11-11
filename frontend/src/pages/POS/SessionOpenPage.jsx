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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Person as PersonIcon,
  Computer as TerminalIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import PageTitle from '../../components/common/PageTitle';
import sessionManager from '../../services/SessionManager.js';
import indexedDBManager from '../../services/IndexedDBManager.js';
import terminalService from '../../services/terminalService.js';

/**
 * Session Open Page
 * Based on 2.4.2. Session Logon specification
 * 
 * Fields:
 * - User Code (read-only): Logged in user code
 * - User Name (read-only): Logged in user name
 * - Location (read-only): Logged in location code
 * - Till Code (read-only): Logged in terminal code
 * - Sale Date (read-only): Current business date of the system
 * - Session no (read-only): System generated session No. (incremental of last session no)
 * - Session Start Date (read-only): Session start's date
 * - Session Start Time (read-only): Session start's time
 * - Float Amount (editable): User enters the float amount (opening cash balance)
 */
const SessionOpenPage = ({
  showHeader = true,
  condensed = false,
  routePrefix = '/pos',
}) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { displaySuccess, displayError } = useNotification();
  const theme = useTheme();
  const canvasBg = theme.palette.background?.default || '#f5f5f5';
  const isCondensed = condensed || !showHeader;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Session data - mostly read-only
  // Initialize session data with user defaults and current date/time immediately
  const getInitialSessionData = () => {
    const userCode = user?.username || user?.id || '';
    const userName = user?.first_name && user?.last_name 
      ? `${user.first_name} ${user.last_name}`.trim()
      : user?.username || '';
    
    // Get location from user object (available from login/getCurrentUser)
    const locationName = user?.pos_location_name || user?.pos_location?.name || '';
    const locationCode = user?.pos_location_code || user?.pos_location?.code || '';
    
    // Set current date and time immediately
    const today = new Date();
    const saleDate = today.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const sessionStartDate = today.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const sessionStartTime = today.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
    
    // Format session number (will be updated with actual number later)
    const formattedSessionNo = locationCode 
      ? `${locationCode.toUpperCase().padStart(6, '0')}-0001`
      : `SESS-0001`;
    
    return {
      userCode,
      userName,
      location: locationCode,
      locationName,
      tillCode: '',
      tillName: '',
      saleDate,
      sessionNo: formattedSessionNo,
      sessionStartDate,
      sessionStartTime,
      floatAmount: '',
    };
  };

  const [sessionData, setSessionData] = useState(getInitialSessionData());

  const [terminal, setTerminal] = useState(null);
  const [availableTerminals, setAvailableTerminals] = useState([]);
  const [selectedTerminalId, setSelectedTerminalId] = useState(null);
  const [activeDayOpen, setActiveDayOpen] = useState(null);
  const [dayOpenError, setDayOpenError] = useState(null);
  const [terminalSessionState, setTerminalSessionState] = useState({
    loading: false,
    hasOpenSession: false,
    activeSession: null,
    error: null,
  });

  const identityTiles = [
    {
      key: 'userCode',
      label: 'User Code',
      value: sessionData.userCode || '—',
    },
    {
      key: 'userName',
      label: 'User Name',
      value: sessionData.userName || '—',
    },
    {
      key: 'location',
      label: 'Location',
      value: sessionData.locationName || sessionData.location || 'Not assigned',
      icon: <LocationIcon fontSize="small" color="action" />,
    },
    {
      key: 'saleDate',
      label: 'Sale Date',
      value: sessionData.saleDate,
      icon: <DateIcon fontSize="small" color="action" />,
    },
    {
      key: 'sessionNo',
      label: 'Session No',
      value: sessionData.sessionNo,
    },
    {
      key: 'sessionStart',
      label: 'Session Start',
      value: `${sessionData.sessionStartDate} • ${sessionData.sessionStartTime}`,
      icon: <TimeIcon fontSize="small" color="action" />,
    },
  ];

  // Location comes from logged-in user only - no selection needed
  // For POS users: Use pos_location_id from user
  // For Admin/Backoffice: Use session_location_id from localStorage

  // Get PC hostname - try multiple sources
  const getHostname = async () => {
    // Priority 1: Check localStorage (user configured or previously detected)
    let hostname = localStorage.getItem('pos_terminal_hostname');
    
    // Priority 2: Try to get from backend API (if available)
    if (!hostname) {
      try {
        const backendHostname = await terminalService.getClientHostname();
        if (backendHostname && backendHostname !== 'unknown' && backendHostname !== 'localhost') {
          hostname = backendHostname;
          localStorage.setItem('pos_terminal_hostname', hostname);
        }
      } catch (error) {
        console.warn('Could not get hostname from backend:', error);
      }
    }
    
    // Priority 3: Fallback - use a browser fingerprint (consistent per browser)
    if (!hostname) {
      // Create a consistent identifier based on browser/device
      const platform = navigator.platform || 'unknown';
      const userAgent = navigator.userAgent || '';
      const language = navigator.language || 'en';
      
      // Create a hash-like identifier (consistent for same browser/device)
      const fingerprint = `${platform}-${language}-${userAgent.length}`;
      hostname = `PC-${fingerprint.slice(0, 30)}`;
      
      // Store it so it's consistent for this browser/device
      localStorage.setItem('pos_terminal_hostname', hostname);
    }
    
    return hostname;
  };

  // Load terminals for a specific location with hostname-based identification
  const loadTerminalsForLocation = async (locationId) => {
    if (!locationId) return;
    
    try {
      // First, try to identify terminal by hostname
      const hostname = await getHostname();
      let hostnameTerminal = null;
      
      try {
        console.log('🔍 Attempting to identify terminal by hostname:', hostname);
        const hostnameResult = await terminalService.identifyByHostname(hostname, locationId);
        
        if (hostnameResult.found && hostnameResult.terminal) {
          hostnameTerminal = hostnameResult.terminal;
          console.log('✅ Terminal found by hostname/system_name:', hostnameTerminal.name, '(', hostnameTerminal.system_name, ')');
        } else {
          console.log('ℹ️ No terminal found with system_name:', hostname);
          console.log('💡 Available terminals will be shown for manual selection');
        }
      } catch (error) {
        console.warn('Warning: Could not identify terminal by hostname:', error);
        // Continue with normal terminal loading
      }
      
      // Load all terminals for location
      const terminalsResponse = await api.get('/pos-masters/terminals/', {
        params: { location: locationId, is_active: true }
      });
      
      const terminals = terminalsResponse.data?.results || terminalsResponse.data || [];
      setAvailableTerminals(terminals);
      
      if (terminals.length > 0) {
        // Priority: 1. Terminal found by hostname, 2. Previously selected, 3. First terminal
        let terminalToSelect = terminals[0];
        
        // Priority 1: If hostname terminal exists and is in the list, use it
        if (hostnameTerminal) {
          const foundTerminal = terminals.find(t => t.id === hostnameTerminal.id);
          if (foundTerminal) {
            terminalToSelect = foundTerminal;
            console.log('✅ Auto-selected terminal by hostname:', terminalToSelect.name);
          }
        }
        
        // Priority 2: If we have a previously selected terminal ID and it's still in the list, use it
        if (!hostnameTerminal && selectedTerminalId) {
          const prevTerminal = terminals.find(t => t.id === selectedTerminalId);
          if (prevTerminal) {
            terminalToSelect = prevTerminal;
          }
        }
        
        setTerminal(terminalToSelect);
        setSelectedTerminalId(terminalToSelect.id);
        setSessionData(prev => ({
          ...prev,
          tillCode: terminalToSelect.terminal_code || terminalToSelect.terminalCode || '',
          tillName: terminalToSelect.name || '',
        }));
        checkTerminalOpenSession(terminalToSelect.id);
      } else {
        // No terminals found for location
        // Optionally, try to auto-create terminal by hostname if enabled
        setTerminal(null);
        setSelectedTerminalId(null);
        setSessionData(prev => ({
          ...prev,
          tillCode: '',
          tillName: '',
        }));
      }
    } catch (error) {
      console.warn('Error loading terminals for location:', error);
      setTerminal(null);
      setAvailableTerminals([]);
      setSelectedTerminalId(null);
    }
  };

  // Handle terminal selection change
  const handleTerminalChange = (terminalId) => {
    const selectedTerminal = availableTerminals.find(t => t.id === terminalId);
    if (selectedTerminal) {
      setTerminal(selectedTerminal);
      setSelectedTerminalId(terminalId);
      setSessionData(prev => ({
        ...prev,
        tillCode: selectedTerminal.terminal_code || selectedTerminal.terminalCode || '',
        tillName: selectedTerminal.name || '',
      }));
      checkTerminalOpenSession(terminalId);
    }
  };

  const checkTerminalOpenSession = async (terminalId, options = {}) => {
    if (!terminalId) {
      setTerminalSessionState({
        loading: false,
        hasOpenSession: false,
        activeSession: null,
        error: null,
      });
      return;
    }

    setTerminalSessionState({
      loading: true,
      hasOpenSession: false,
      activeSession: null,
      error: null,
    });

    try {
      const response = await api.get('/pos-sessions/', {
        params: {
          terminal: terminalId,
          status: 'open',
          ordering: '-opened_at',
          page_size: 1,
        },
      });

      const sessions = response.data?.results || response.data || [];
      if (sessions.length > 0) {
        setTerminalSessionState({
          loading: false,
          hasOpenSession: true,
          activeSession: sessions[0],
          error: null,
        });
      } else {
        setTerminalSessionState({
          loading: false,
          hasOpenSession: false,
          activeSession: null,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking terminal session status:', error);
      setTerminalSessionState({
        loading: false,
        hasOpenSession: false,
        activeSession: null,
        error: options.silent ? null : 'Unable to verify terminal session status.',
      });
    }
  };

  // Load initial data - set all user data immediately, then load terminal and session number
  useEffect(() => {
    if (user) {
      // Re-initialize with fresh user data and current date/time
      const today = new Date();
      const saleDate = today.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
      const sessionStartDate = today.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
      const sessionStartTime = today.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      });
      
      const userCode = user?.username || user?.id || '';
      const userName = user?.first_name && user?.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user?.username || '';
      
      // Get location: For POS users from pos_location, for admin/backoffice from session_location_id
      let locationCode = user?.pos_location_code || user?.pos_location?.code || '';
      let locationName = user?.pos_location_name || user?.pos_location?.name || '';
      
      // For admin/backoffice users, try to get location from localStorage
      if (!locationCode) {
        locationName = localStorage.getItem('session_location_name') || '';
        locationCode = localStorage.getItem('session_location_code') || '';
      }
      
      // Format initial session number (will be updated with actual number from API)
      const formattedSessionNo = locationCode 
        ? `${locationCode.toUpperCase().padStart(6, '0')}-0001`
        : `SESS-0001`;
      
      // Set all fields immediately
      setSessionData(prev => ({
        userCode,
        userName,
        location: locationCode,
        locationName,
        tillCode: prev.tillCode || '',
        tillName: prev.tillName || '',
        saleDate,
        sessionNo: formattedSessionNo,
        sessionStartDate,
        sessionStartTime,
        floatAmount: prev.floatAmount || '',
      }));
      
      // Load terminals for user's location
      // For POS users: Use pos_location_id
      // For Admin/Backoffice: Use session_location_id from localStorage
      const locationId = user?.pos_location_id || localStorage.getItem('session_location_id');
      if (locationId) {
        loadTerminalsForLocation(locationId);
      }
    }
    
    // Load session number (updates the sessionNo field)
    loadSessionData();
    checkDayOpen();
  }, [user]);

  useEffect(() => {
    if (selectedTerminalId) {
      checkTerminalOpenSession(selectedTerminalId);
    }
  }, [selectedTerminalId]);

  const checkDayOpen = async () => {
    const TIMEOUT_MS = 10000; // 10 seconds
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - Backend server may not be running')), TIMEOUT_MS)
    );
    
    try {
      setLoading(true); // Set loading state
      // Race between API call and timeout
      const response = await Promise.race([
        api.get('/day-opens/active/'),
        timeoutPromise
      ]);
      
      if (response.data) {
        setActiveDayOpen(response.data);
        setDayOpenError(null);
      } else {
        setActiveDayOpen(null);
      }
    } catch (error) {
      if (error.message?.includes('timeout')) {
        console.error('❌ Session Open - Day Open check timeout:', error.message);
        setDayOpenError('Backend server is not responding. Please ensure the backend is running on port 8000.');
        setActiveDayOpen(null); // Set to null on timeout
      } else if (error.response?.status === 404) {
        setActiveDayOpen(null);
        setDayOpenError('No active day open. Please open a day first before starting a session.');
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('ETIMEDOUT')) {
        console.error('❌ Connection timeout:', error);
        setDayOpenError('Cannot connect to backend server. Please check if backend is running.');
        setActiveDayOpen(null); // Set to null on connection error
      } else {
        console.error('Error checking day open:', error);
        setDayOpenError('Unable to verify day open status.');
        setActiveDayOpen(null); // Set to null on other errors
      }
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  const loadSessionData = async () => {
    try {
      setLoading(true);
      
      const locationCode = user?.pos_location_code || user?.pos_location?.code || '';
      
      // Get last session number to update session number
      let nextSessionNo = '1';
      try {
        const sessionsResponse = await api.get('/pos-sessions/', {
          params: { 
            cashier: user?.id,
            ordering: '-session_number',
            page_size: 1 
          }
        });
        
        const sessions = sessionsResponse.data?.results || sessionsResponse.data || [];
        if (sessions.length > 0) {
          const lastSession = sessions[0];
          const lastNo = parseInt(lastSession.session_number?.split('-').pop() || '0');
          nextSessionNo = String(lastNo + 1).padStart(4, '0');
        }
      } catch (error) {
        // Expected if no previous sessions exist - not an error, just use default
        if (error.response?.status !== 404) {
          console.warn('Error loading last session:', error);
          // Log more details for debugging
          console.warn('Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
        }
      }

      // Format session number (e.g., LOC001-0001)
      const formattedSessionNo = locationCode 
        ? `${locationCode.toUpperCase().padStart(6, '0')}-${nextSessionNo}`
        : `SESS-${nextSessionNo}`;

      // Update only session number (other fields already set from user data)
      setSessionData(prev => ({
        ...prev,
        sessionNo: formattedSessionNo,
      }));

    } catch (error) {
      console.error('Error loading session data:', error);
      // Don't show error to user, just log it
    } finally {
      setLoading(false);
    }
  };

  const handleFloatAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSessionData(prev => ({
        ...prev,
        floatAmount: value
      }));
    }
  };

  const handleStartSession = async () => {
    // Validation: Check Day Open first
    if (!activeDayOpen) {
      displayError('No active day open. Please open a day first from the Day Open page.');
      return;
    }

    // Validation: Float amount
    if (!sessionData.floatAmount || parseFloat(sessionData.floatAmount) < 0) {
      displayError('Please enter a valid float amount.');
      return;
    }

    // Terminal validation
    if (!terminal || !selectedTerminalId) {
      displayError('Please select a terminal for this session.');
      return;
    }

    // Location validation - get from user or session location
    const sessionLocationId = user?.pos_location_id || localStorage.getItem('session_location_id');
    if (!sessionLocationId) {
      displayError('No location available. Please select a location or contact administrator to assign a location.');
      return;
    }

    try {
      setSubmitting(true);

      // Create session
      const sessionPayload = {
        cashier: user.id,
        terminal: terminal?.id,
        location: sessionLocationId,
        opening_cash: parseFloat(sessionData.floatAmount),
        status: 'open',
        session_number: sessionData.sessionNo,
        opened_at: new Date().toISOString(),
      };

      const response = await api.post('/pos-sessions/', sessionPayload);

      if (response.data) {
        displaySuccess(`Session ${response.data.session_number || sessionData.sessionNo} opened successfully!`);
        
        // Clear any cached session data to force fresh fetch
        try {
          sessionManager.currentSession = null;
          // Clear from IndexedDB if delete method exists, otherwise just clear the manager
          if (indexedDBManager.delete) {
            await indexedDBManager.delete('session', 'current');
          } else {
            await indexedDBManager.clearStore('session');
          }
        } catch (e) {
          console.warn('Could not clear cached session:', e);
        }
        
        // Redirect to desktop POS after a short delay to allow backend to process
        // Use replace to prevent back navigation to session open page
        setTimeout(() => {
          navigate(`${routePrefix}/desktop`, { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error('Error opening session:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      // Extract error message from backend response
      let errorMsg = 'Failed to open session. Please try again.';
      
      if (error.response?.data) {
        // Check for detailed error messages (in order of priority)
        if (error.response.data.terminal) {
          // Terminal validation error (e.g., terminal already has open session)
          errorMsg = Array.isArray(error.response.data.terminal) 
            ? error.response.data.terminal[0] 
            : error.response.data.terminal;
        } else if (error.response.data.location) {
          // Location validation error
          errorMsg = Array.isArray(error.response.data.location) 
            ? error.response.data.location[0] 
            : error.response.data.location;
        } else if (error.response.data.day_open) {
          // Day open validation error (from serializer)
          errorMsg = Array.isArray(error.response.data.day_open) 
            ? error.response.data.day_open[0]
            : error.response.data.day_open;
        } else if (error.response.data.non_field_errors && Array.isArray(error.response.data.non_field_errors)) {
          errorMsg = error.response.data.non_field_errors[0];
        } else if (error.response.data.detail) {
          errorMsg = Array.isArray(error.response.data.detail) 
            ? error.response.data.detail[0]
            : error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
      } else if (error.message) {
        // Network or other errors
        errorMsg = `Network error: ${error.message}. Please check your connection and try again.`;
      }
      
      displayError(errorMsg);
      
      // If Day Open is missing, refresh the Day Open check
      if (errorMsg.includes('day open') || errorMsg.includes('Day Open')) {
        checkDayOpen();
      }
    } finally {
      setSubmitting(false);
    }
  };

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: showHeader ? '70vh' : 'auto',
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
        bgcolor: showHeader ? canvasBg : 'transparent',
        minHeight: showHeader ? '100vh' : 'auto',
        py: showHeader ? { xs: 3, md: 4 } : 0,
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
              title="Session Open"
              subtitle="Initialize a new POS session with opening cash balance."
            />
          )}

          <Paper
            variant="outlined"
            sx={{
              bgcolor: 'background.paper',
              borderColor: 'divider',
              boxShadow: 'none',
              p: { xs: 2, md: showHeader ? 3 : 2 },
            }}
          >
            <Stack spacing={isCondensed ? 2 : 3}>
              {dayOpenError && (
                <Alert
                  severity="error"
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Box sx={{ flexGrow: 1 }}>{dayOpenError}</Box>
                  <Button
                    size="small"
                    onClick={() => navigate(`${routePrefix}/day-open`)}
                    variant="outlined"
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Go to Day Open
                  </Button>
                </Alert>
              )}

              {activeDayOpen && (
                <Alert severity="success">
                  Day Open Active — Business Date: {activeDayOpen.business_date}
                </Alert>
              )}

              {terminalSessionState.error && (
                <Alert severity="warning">
                  {terminalSessionState.error}
                </Alert>
              )}

              {terminalSessionState.hasOpenSession && terminalSessionState.activeSession && (
                <Alert severity="warning">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Terminal already has an active session.
                  </Typography>
                  <Typography variant="body2">
                    Session: {terminalSessionState.activeSession.session_number || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Cashier:{' '}
                    {terminalSessionState.activeSession.cashier_name ||
                      terminalSessionState.activeSession.cashier ||
                      'N/A'}
                  </Typography>
                  {terminalSessionState.activeSession.opened_at && (
                    <Typography variant="body2">
                      Opened At:{' '}
                      {new Date(terminalSessionState.activeSession.opened_at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Close the active session from POS Console before starting a new one on this terminal.
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => selectedTerminalId && checkTerminalOpenSession(selectedTerminalId)}
                    >
                      Retry Status
                    </Button>
                  </Box>
                </Alert>
              )}

              <Grid container spacing={2}>
                {identityTiles.map((tile) => (
                  <Grid item xs={12} md={6} key={tile.key}>
                    <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: 0,
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        p: 2,
                        minHeight: 96,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.75,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        {tile.icon}
                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                          {tile.label}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" fontWeight={600}>
                        {tile.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={isCondensed ? 2 : 3} sx={{ overflow: 'hidden', mt: 0.5 }}>
                <Grid item xs={12} md={6}>
                  {availableTerminals.length > 0 ? (
                    <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: 0,
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        p: 2,
                      }}
                    >
                      <FormControl
                        fullWidth
                        size="small"
                        required
                        disabled={terminalSessionState.hasOpenSession}
                      >
                        <InputLabel>Terminal / Till</InputLabel>
                        <Select
                          value={selectedTerminalId || ''}
                          onChange={(e) => handleTerminalChange(e.target.value)}
                          label="Terminal / Till"
                        >
                          {availableTerminals.map((term) => (
                            <MenuItem key={term.id} value={term.id}>
                              {term.name} ({term.terminal_code || term.terminalCode || 'N/A'})
                            </MenuItem>
                          ))}
                        </Select>
                        {!isCondensed && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: 'block' }}
                          >
                            {availableTerminals.length > 1
                              ? 'Select terminal for this session'
                              : 'Terminal selected for this session'}
                          </Typography>
                        )}
                      </FormControl>
                    </Paper>
                  ) : (
                    <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: 0,
                        borderColor: alpha(theme.palette.error.main, 0.4),
                        bgcolor: alpha(theme.palette.error.main, 0.05),
                        p: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Terminal / Till"
                        value="Not configured"
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        size="small"
                        disabled
                        error
                        helperText={
                          isCondensed
                            ? undefined
                            : 'No terminals configured for this location. Please contact administrator.'
                        }
                      />
                    </Paper>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      borderRadius: 0,
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      p: 2,
                      height: '100%',
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Float Amount"
                      value={sessionData.floatAmount}
                      onChange={handleFloatAmountChange}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      size="small"
                      required
                      type="number"
                      inputProps={{
                        step: '0.01',
                        min: '0',
                        placeholder: '0.00',
                      }}
                      helperText={
                        isCondensed ? undefined : 'Enter the opening cash balance for this session'
                      }
                      error={sessionData.floatAmount !== '' && parseFloat(sessionData.floatAmount) < 0}
                      disabled={terminalSessionState.hasOpenSession}
                    />
                  </Paper>
                </Grid>

                {!isCondensed && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Session Logon:</strong> A session includes start and end timestamps to
                        track cashier activity. Opening a session requires entering the float amount,
                        which serves as the opening cash balance.
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'flex-end',
                      mt: isCondensed ? 1 : 2,
                    }}
                  >
                    {!isCondensed && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (routePrefix === '/posv2') {
                            navigate(`${routePrefix}/shift-workflow`);
                          } else {
                            navigate('/pos');
                          }
                        }}
                        disabled={submitting || terminalSessionState.hasOpenSession}
                        sx={{
                          minWidth: 120,
                          borderRadius: 0,
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        const targetPath =
                          routePrefix === '/posv2' ? `${routePrefix}/desktop` : '/pos/desktop';
                        navigate(targetPath);
                      }}
                      disabled={submitting}
                      sx={{ minWidth: 140, borderRadius: 0 }}
                    >
                      POS Console
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<StartIcon />}
                      onClick={handleStartSession}
                      disabled={
                        submitting ||
                        !sessionData.floatAmount ||
                        parseFloat(sessionData.floatAmount) < 0 ||
                        !activeDayOpen ||
                        !terminal ||
                        !selectedTerminalId ||
                        terminalSessionState.loading ||
                        terminalSessionState.hasOpenSession
                      }
                      size={isCondensed ? 'medium' : 'large'}
                      sx={{ minWidth: 180, borderRadius: 0 }}
                    >
                      {submitting ? 'Opening Session...' : activeDayOpen ? 'Start Session' : 'Day Open Required'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default SessionOpenPage;


