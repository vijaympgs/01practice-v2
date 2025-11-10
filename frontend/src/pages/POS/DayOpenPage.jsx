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
  Stack,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { alpha, useTheme } from '@mui/material/styles';
import { useNotification } from '../../contexts/NotificationContext';
import PageTitle from '../../components/common/PageTitle';

/**
 * Day Open Page
 * Store-level day start process
 * Establishes business date and resets document sequences
 */
const DayOpenPage = ({
  showHeader = true,
  routePrefix = '/pos',
  onContinueSession = null,
}) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { displaySuccess, displayError } = useNotification();
  const theme = useTheme();
  const canvasBg = theme.palette.background?.default || '#f5f5f5';

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeDayOpen, setActiveDayOpen] = useState(null);
  const [themeColor, setThemeColor] = useState('#1976d2');

  // Form data
  const [formData, setFormData] = useState({
    businessDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Load theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const themeResponse = await fetch('/api/theme/active-theme/');
        if (themeResponse.ok) {
          const themeData = await themeResponse.json();
          setThemeColor(themeData.primary_color || '#1976d2');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Load active day open status
  useEffect(() => {
    checkActiveDayOpen();
  }, []);

  const checkActiveDayOpen = async () => {
    const TIMEOUT_MS = 5000; // 5 seconds - shorter timeout
    
    // IMMEDIATELY set loading to true, but also set a safety timeout
    setLoading(true);
    
    // Safety timeout - ALWAYS stop loading after timeout, no matter what
    const safetyTimeout = setTimeout(() => {
      console.warn('⚠️ Safety timeout - forcing loading to false');
      setLoading(false);
    }, TIMEOUT_MS + 1000); // 1 second buffer
    
    try {
      const response = await api.get('/day-opens/active/', {
        timeout: TIMEOUT_MS
      });
      
      clearTimeout(safetyTimeout);
      
      if (response.data) {
        setActiveDayOpen(response.data);
      } else {
        setActiveDayOpen(null);
      }
      setLoading(false);
    } catch (error) {
      clearTimeout(safetyTimeout);
      
      // ALWAYS stop loading on ANY error
      setLoading(false);
      setActiveDayOpen(null);
      
      // Handle different error types
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.error('❌ Day Open API timeout');
        displayError('Backend server is not responding. Please ensure the backend is running on port 8000.');
      } else if (error.response?.status === 404) {
        // 404 is OK - no active day open
        console.log('ℹ️ No active day open found');
        // Don't show error for 404 - it's expected
      } else if (error.response?.status === 400) {
        // 400 usually means no location assigned
        const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'No location assigned';
        console.warn('⚠️ Location issue:', errorMsg);
        displayError(errorMsg + '. Please select a location from your profile menu.');
      } else if (!error.response) {
        // Network error
        console.error('❌ Network error:', error.message);
        displayError('Cannot connect to backend server. Please check if backend is running.');
      } else {
        // Other errors
        console.error('Error checking active day open:', error);
        const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Failed to load day open status';
        displayError(errorMsg);
      }
    }
  };

  const handleOpenDay = async () => {
    try {
      setSubmitting(true);

      const response = await api.post('/day-opens/open/', {
        business_date: formData.businessDate,
        notes: formData.notes,
      });

      displaySuccess('Day opened successfully!');
      setActiveDayOpen(response.data);
      setFormData({ businessDate: new Date().toISOString().split('T')[0], notes: '' });
    } catch (error) {
      // Extract specific error message from backend
      let message = 'Failed to open day. Please try again.';
      let detail = '';
      
      if (error.response?.data) {
        // Check for error field first
        if (error.response.data.error) {
          message = error.response.data.error;
        } 
        // Check for detail field (DRF standard)
        else if (error.response.data.detail) {
          message = error.response.data.detail;
        }
        // Check for message field
        else if (error.response.data.message) {
          message = error.response.data.message;
        }
        // Check for non_field_errors (DRF validation errors)
        else if (error.response.data.non_field_errors) {
          message = Array.isArray(error.response.data.non_field_errors) 
            ? error.response.data.non_field_errors[0] 
            : error.response.data.non_field_errors;
        }
        
        // Get detailed error if available
        if (error.response.data.detail && error.response.data.detail !== message) {
          detail = error.response.data.detail;
        }
      }
      
      // Combine message and detail
      if (detail) {
        message = `${message}\n\nDetails: ${detail}`;
      }
      
      // Provide helpful guidance for common errors
      if (message.includes('location') || message.includes('Location')) {
        message += '\n\nPlease ensure your user profile has a POS location assigned. Contact your administrator.';
      }
      
      console.error('Day Open Error:', error.response?.data || error);
      displayError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDay = async () => {
    try {
      setSubmitting(true);

      await api.post(`/day-opens/${activeDayOpen.id}/close/`);

      displaySuccess('Day closed successfully!');
      setActiveDayOpen(null);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to close day. Please try again.';
      displayError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const summaryTiles = activeDayOpen
    ? [
        {
          key: 'location',
          label: 'Location',
          icon: <LocationIcon sx={{ color: themeColor }} />,
          value: activeDayOpen.location_name || 'N/A',
        },
        {
          key: 'businessDate',
          label: 'Business Date',
          icon: <DateIcon sx={{ color: themeColor }} />,
          value: new Date(activeDayOpen.business_date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        },
        {
          key: 'openedBy',
          label: 'Opened By',
          icon: <PersonIcon sx={{ color: themeColor }} />,
          value: activeDayOpen.opened_by_name || 'N/A',
        },
        {
          key: 'openedAt',
          label: 'Opened At',
          icon: <TimeIcon sx={{ color: themeColor }} />,
          value: `${formatDateTime(activeDayOpen.opened_at).date} ${formatDateTime(activeDayOpen.opened_at).time}`,
        },
        {
          key: 'nextSale',
          label: 'Next Sale Number',
          value: activeDayOpen.next_sale_number,
        },
        {
          key: 'nextSession',
          label: 'Next Session Number',
          value: activeDayOpen.next_session_number,
        },
      ]
    : [];

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
              title="Day Open"
              subtitle="Open the business day, initialize document sequences, and activate operations."
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
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : activeDayOpen ? (
              <Stack spacing={3}>
                <Alert
                  severity="success"
                  sx={{
                    '& .MuiAlert-message': { width: '100%' },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Business day is active
                  </Typography>
                  <Typography variant="body2">
                    Review the day context and proceed to Session Open when ready.
                  </Typography>
                </Alert>

                <Grid container spacing={2}>
                  {summaryTiles.map((tile) => (
                    <Grid item xs={12} md={6} key={tile.key}>
                      <Paper
                        variant="outlined"
                        sx={{
                          borderRadius: 0,
                          borderColor: alpha(themeColor, 0.25),
                          bgcolor: alpha(themeColor, 0.05),
                          p: 2,
                          minHeight: 104,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
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
                  {activeDayOpen.notes && (
                    <Grid item xs={12}>
                      <Paper
                        variant="outlined"
                        sx={{
                          borderRadius: 0,
                          borderColor: alpha(themeColor, 0.25),
                          bgcolor: alpha(themeColor, 0.03),
                          p: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                          Notes
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {activeDayOpen.notes}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    size={showHeader ? 'large' : 'medium'}
                    onClick={() => {
                      if (typeof onContinueSession === 'function') {
                        onContinueSession();
                      } else {
                        navigate(`${routePrefix}/session-open`);
                      }
                    }}
                    sx={{
                      backgroundColor: themeColor,
                      px: 3,
                      borderRadius: 0,
                      '&:hover': { backgroundColor: themeColor, opacity: 0.9 },
                    }}
                  >
                    Continue to Session Open
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Alert severity="info">
                  <Typography variant="subtitle1" fontWeight={600}>
                    No active business day
                  </Typography>
                  <Typography variant="body2">
                    Set the business date and open the day to enable POS operations.
                  </Typography>
                </Alert>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: 0,
                        borderColor: alpha(themeColor, 0.25),
                        p: 2,
                        height: '100%',
                        bgcolor: alpha(themeColor, 0.03),
                      }}
                    >
                      <TextField
                        label="Business Date"
                        type="date"
                        value={formData.businessDate}
                        onChange={(e) => setFormData({ ...formData, businessDate: e.target.value })}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true, sx: { color: themeColor } }}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 0 },
                        }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: 0,
                        borderColor: alpha(themeColor, 0.25),
                        p: 2,
                        height: '100%',
                        bgcolor: alpha(themeColor, 0.03),
                      }}
                    >
                      <TextField
                        label="Notes (Optional)"
                        multiline
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        fullWidth
                        placeholder="Any additional notes or remarks..."
                        InputLabelProps={{ sx: { color: themeColor } }}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 0 },
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={!submitting ? <StartIcon /> : undefined}
                    onClick={handleOpenDay}
                    disabled={submitting || !formData.businessDate}
                    sx={{
                      backgroundColor: themeColor,
                      px: 3,
                      minWidth: 160,
                      borderRadius: 0,
                      '&:hover': { backgroundColor: themeColor, opacity: 0.92 },
                    }}
                  >
                    {submitting ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Open Day'}
                  </Button>
                </Box>
              </Stack>
            )}
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default DayOpenPage;

