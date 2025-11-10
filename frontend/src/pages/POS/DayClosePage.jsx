import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  ReceiptLong as ReceiptLongIcon,
  ListAlt as ListAltIcon,
  Savings as SavingsIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import PageTitle from '../../components/common/PageTitle';

/**
 * Day Close Page
 * Store-level day end process
 * Finalizes all business day activities with checklist validation
 */
const DayClosePage = ({ showHeader = true, condensed = false, routePrefix = '/pos' }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { displaySuccess, displayError } = useNotification();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeDayOpen, setActiveDayOpen] = useState(null);
  const [themeColor, setThemeColor] = useState('#1976d2');
  const [settlementSummary, setSettlementSummary] = useState({
    loading: false,
    error: null,
    sessions: [],
    totals: {
      expected: 0,
      counted: 0,
      variance: 0,
      interimCount: 0,
    },
  });

  // Checklist items
  const [checklist, setChecklist] = useState({
    all_sessions_closed: false,
    all_settlements_completed: false,
    reports_generated: false,
    backup_completed: false,
    cash_counted: false,
    inventory_verified: false,
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

  useEffect(() => {
    if (activeDayOpen && activeDayOpen.business_date) {
      loadSettlementSummary(activeDayOpen);
    } else {
      setSettlementSummary((prev) => ({
        ...prev,
        sessions: [],
        totals: {
          expected: 0,
          counted: 0,
          variance: 0,
          interimCount: 0,
        },
      }));
    }
  }, [activeDayOpen]);

  const checkActiveDayOpen = async () => {
    const TIMEOUT_MS = 10000; // 10 seconds
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - Backend server may not be running')), TIMEOUT_MS)
    );
    
    try {
      setLoading(true);
      
      // Race between API call and timeout
      const response = await Promise.race([
        api.get('/day-opens/active/'),
        timeoutPromise
      ]);
      
      if (response.data) {
        setActiveDayOpen(response.data);
      } else {
        setActiveDayOpen(null);
      }
    } catch (error) {
      if (error.message?.includes('timeout')) {
        console.error('❌ Day Close API timeout:', error.message);
        displayError('Backend server is not responding. Please ensure the backend is running on port 8000.');
        setActiveDayOpen(null); // Set to null on timeout to allow UI to render
      } else if (error.response?.status === 404) {
        // 404 is expected if no day is open - not an error
        setActiveDayOpen(null);
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('ETIMEDOUT')) {
        console.error('❌ Connection timeout:', error);
        displayError('Cannot connect to backend server. Please check if backend is running.');
        setActiveDayOpen(null); // Set to null on connection error
      } else {
        console.error('Error checking active day open:', error);
        displayError('Failed to load day open status. Please try again.');
        setActiveDayOpen(null); // Set to null on other errors
      }
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  const normalizeSessionsResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const loadSettlementSummary = async (dayContext) => {
    try {
      setSettlementSummary((prev) => ({ ...prev, loading: true, error: null }));
      const response = await api.get('/sales/pos-sessions/', {
        params: {
          status: 'closed',
          ordering: '-closed_at',
          page_size: 100,
        },
      });

      const sessionsRaw = normalizeSessionsResponse(response.data);
      const businessDateKey = new Date(dayContext.business_date).toISOString().slice(0, 10);
      const locationId =
        dayContext.location ||
        dayContext.location_id ||
        dayContext.locationId ||
        dayContext.location?.id ||
        null;

      let totalExpected = 0;
      let totalCounted = 0;
      let totalInterims = 0;

      const mappedSessions = sessionsRaw
        .filter((session) => {
          if (!session.closed_at) return false;
          const closedDateKey = new Date(session.closed_at).toISOString().slice(0, 10);
          if (closedDateKey !== businessDateKey) return false;

          if (locationId) {
            const sessionLocation =
              session.location ||
              session.location_id ||
              session.locationId ||
              session.location?.id ||
              null;
            if (sessionLocation && String(sessionLocation) !== String(locationId)) {
              return false;
            }
          }
          return true;
        })
        .map((session) => {
          const expected = Number(session.base_expected_cash ?? session.expected_cash ?? 0) || 0;
          const counted = Number(session.total_counted_cash ?? session.closing_cash ?? 0) || 0;
          const variance = counted - expected;
          const interimList = Array.isArray(session.interim_settlements)
            ? session.interim_settlements
            : [];
          const varianceReason = session.variance_reason_name || session.variance_reason || '';

          totalExpected += expected;
          totalCounted += counted;
          totalInterims += interimList.length;

          return {
            id: session.id,
            sessionNumber: session.session_number,
            cashierName: session.cashier_name || session.cashier,
            expected,
            counted,
            variance,
            varianceReason,
            interimList,
            closedAt: session.closed_at,
          };
        });

      setSettlementSummary({
        loading: false,
        error: null,
        sessions: mappedSessions,
        totals: {
          expected: totalExpected,
          counted: totalCounted,
          variance: totalCounted - totalExpected,
          interimCount: totalInterims,
        },
      });
    } catch (error) {
      console.error('Failed to load settlement summary:', error);
      setSettlementSummary({
        loading: false,
        error:
          'Unable to load session settlement recap. You can still continue after verifying settlements manually.',
        sessions: [],
        totals: {
          expected: 0,
          counted: 0,
          variance: 0,
          interimCount: 0,
        },
      });
    }
  };

  const handleCompleteDayClose = async () => {
    try {
      setSubmitting(true);

      // Use the correct endpoint: /day-opens/{id}/close/
      if (!activeDayOpen || !activeDayOpen.id) {
        displayError('No active day open found');
        return;
      }

      const response = await api.post(`/day-opens/${activeDayOpen.id}/close/`, {
        checklist_items: checklist,
      });

      displaySuccess('Day closed successfully!');
      setActiveDayOpen(null);
      // Navigate to day open page after successful close
      setTimeout(() => {
        navigate(`${routePrefix}/day-open`);
      }, 1500);
    } catch (error) {
      console.error('Day Close Error:', error.response?.data || error);
      let message = 'Failed to close day. Please try again.';
      
      if (error.response?.data) {
        if (error.response.data.error) {
          message = error.response.data.error;
        } else if (error.response.data.detail) {
          message = error.response.data.detail;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else if (error.response.data.non_field_errors) {
          message = Array.isArray(error.response.data.non_field_errors)
            ? error.response.data.non_field_errors[0]
            : error.response.data.non_field_errors;
        }
      }
      
      displayError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const allChecksCompleted = Object.values(checklist).every((checked) => checked);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <Box sx={{ p: showHeader ? 3 : 0 }}>
      {showHeader && (
        <PageTitle 
          title="Day Close" 
          subtitle="Finalize business day and consolidate all operations"
        />
      )}

      <Grid container spacing={condensed ? 2 : 3} sx={{ mt: showHeader ? 0 : 1 }}>
        {/* Active Day Info */}
        <Grid item xs={12}>
          <Card
            elevation={showHeader ? 1 : 0}
            sx={{
              borderRadius: condensed ? 1 : undefined,
              boxShadow: condensed ? 'none' : undefined,
            }}
          >
            <CardContent>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : !activeDayOpen ? (
                <Alert severity="warning">
                  <Typography variant="subtitle1" fontWeight="600">
                    No active day open
                  </Typography>
                  <Typography variant="body2">
                    Please open a business day first before closing.
                  </Typography>
                </Alert>
              ) : (
                <>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Active Day Information
                    </Typography>
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <LocationIcon sx={{ color: themeColor, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">Location</Typography>
                      </Box>
                      <Typography variant="h6" color={themeColor}>
                        {activeDayOpen.location_name || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <DateIcon sx={{ color: themeColor, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">Business Date</Typography>
                      </Box>
                      <Typography variant="h6" color={themeColor}>
                        {new Date(activeDayOpen.business_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom color={themeColor} sx={{ mb: 2 }}>
                        Day Close Checklist
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        All items must be checked before completing day close
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checklist.all_sessions_closed}
                                onChange={(e) =>
                                  setChecklist({ ...checklist, all_sessions_closed: e.target.checked })
                                }
                                sx={{
                                  color: themeColor,
                                  '&.Mui-checked': { color: themeColor },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body1">
                                All sessions are closed
                              </Typography>
                            }
                            sx={{ color: themeColor }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checklist.all_settlements_completed}
                                onChange={(e) =>
                                  setChecklist({ ...checklist, all_settlements_completed: e.target.checked })
                                }
                                sx={{
                                  color: themeColor,
                                  '&.Mui-checked': { color: themeColor },
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="600" color="#d32f2f">
                                  All settlements are completed
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Critical: No "Settle Later" items pending
                                </Typography>
                              </Box>
                            }
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checklist.reports_generated}
                                onChange={(e) =>
                                  setChecklist({ ...checklist, reports_generated: e.target.checked })
                                }
                                sx={{
                                  color: themeColor,
                                  '&.Mui-checked': { color: themeColor },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body1">
                                Reports generated and reviewed
                              </Typography>
                            }
                            sx={{ color: themeColor }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checklist.backup_completed}
                                onChange={(e) =>
                                  setChecklist({ ...checklist, backup_completed: e.target.checked })
                                }
                                sx={{
                                  color: themeColor,
                                  '&.Mui-checked': { color: themeColor },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body1">
                                Data backup completed
                              </Typography>
                            }
                            sx={{ color: themeColor }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checklist.cash_counted}
                                onChange={(e) =>
                                  setChecklist({ ...checklist, cash_counted: e.target.checked })
                                }
                                sx={{
                                  color: themeColor,
                                  '&.Mui-checked': { color: themeColor },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body1">
                                Cash counted and reconciled
                              </Typography>
                            }
                            sx={{ color: themeColor }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checklist.inventory_verified}
                                onChange={(e) =>
                                  setChecklist({ ...checklist, inventory_verified: e.target.checked })
                                }
                                sx={{
                                  color: themeColor,
                                  '&.Mui-checked': { color: themeColor },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body1">
                                Inventory verified and accurate
                              </Typography>
                            }
                            sx={{ color: themeColor }}
                          />
                        </Grid>
                      </Grid>

                      {!allChecksCompleted && (
                        <Alert severity="warning" sx={{ mt: 3 }}>
                          <Typography variant="body2">
                            Please complete all checklist items before closing the day.
                          </Typography>
                        </Alert>
                      )}

                      <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
                        <Button
                          variant="outlined"
                          onClick={checkActiveDayOpen}
                          sx={{
                            borderColor: themeColor,
                            color: themeColor,
                            '&:hover': { backgroundColor: `${themeColor}10`, borderColor: themeColor },
                          }}
                        >
                          Refresh
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<CloseIcon />}
                          onClick={handleCompleteDayClose}
                          disabled={submitting || !allChecksCompleted}
                          sx={{
                            backgroundColor: '#d32f2f',
                            '&:hover': { backgroundColor: '#b71c1c' },
                          }}
                        >
                          {submitting ? <CircularProgress size={24} /> : 'Close Day'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: condensed ? 1 : 2,
              p: { xs: 2, md: condensed ? 2 : 3 },
              background: condensed ? 'transparent' : 'inherit',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ md: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Settlement Recap
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cross-check expected vs counted cash per session before closing the business day.
                </Typography>
              </Box>
              <Chip
                icon={<ReceiptLongIcon fontSize="small" />}
                color="primary"
                label={`Sessions: ${settlementSummary.sessions.length}`}
              />
            </Stack>

            <Grid container spacing={condensed ? 1.5 : 2.5} sx={{ mt: 2 }}>
              <Grid item xs={6} md={3}>
                <StatTile
                  title="Total Expected"
                  value={formatCurrency(settlementSummary.totals.expected)}
                  icon={<SavingsIcon />}
                  color={themeColor}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatTile
                  title="Total Counted"
                  value={formatCurrency(settlementSummary.totals.counted)}
                  icon={<MoneyIcon />}
                  color={themeColor}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatTile
                  title="Variance"
                  value={formatCurrency(settlementSummary.totals.variance)}
                  icon={<WarningIcon />}
                  color={
                    settlementSummary.totals.variance === 0
                      ? '#2e7d32'
                      : settlementSummary.totals.variance > 0
                        ? '#0288d1'
                        : '#d32f2f'
                  }
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatTile
                  title="Interim Entries"
                  value={settlementSummary.totals.interimCount}
                  icon={<ListAltIcon />}
                  color={themeColor}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              {settlementSummary.loading ? (
                <Box display="flex" justifyContent="center" py={3}>
                  <CircularProgress size={20} />
                </Box>
              ) : settlementSummary.error ? (
                <Alert severity="warning">{settlementSummary.error}</Alert>
              ) : settlementSummary.sessions.length === 0 ? (
                <Alert severity="info">
                  No closed sessions with settlements found for this business date. Ensure Operator Cash-Up is
                  completed before proceeding.
                </Alert>
              ) : (
                <List
                  dense
                  sx={{
                    maxHeight: condensed ? 220 : 320,
                    overflowY: 'auto',
                    mt: 1,
                  }}
                >
                  {settlementSummary.sessions.map((session) => (
                    <SessionListItem key={session.id} session={session} themeColor={themeColor} />
                  ))}
                </List>
              )}
            </Box>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              justifyContent="flex-end"
              alignItems={{ md: 'center' }}
              sx={{ mt: 3 }}
            >
              <Button
                variant="outlined"
                onClick={checkActiveDayOpen}
                sx={{
                  borderColor: themeColor,
                  color: themeColor,
                  '&:hover': { backgroundColor: `${themeColor}10`, borderColor: themeColor },
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={submitting ? <CircularProgress size={20} /> : <CloseIcon />}
                onClick={handleCompleteDayClose}
                disabled={submitting || !allChecksCompleted}
                sx={{
                  backgroundColor: !allChecksCompleted ? '#9e9e9e' : '#d32f2f',
                  '&:hover': { backgroundColor: !allChecksCompleted ? '#9e9e9e' : '#b71c1c' },
                }}
              >
                Close Day
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value || 0);

const StatTile = ({ title, value, icon, color }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      borderRadius: 1.5,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      borderColor: alpha(color, 0.2),
    }}
  >
    <Avatar
      sx={{
        width: 36,
        height: 36,
        bgcolor: alpha(color, 0.12),
        color,
      }}
    >
      {icon}
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const SessionListItem = ({ session, themeColor }) => {
  const varianceColor =
    session.variance === 0 ? 'success' : session.variance > 0 ? 'info' : 'error';

  return (
    <ListItem
      sx={{
        border: `1px solid ${alpha(themeColor, 0.2)}`,
        borderRadius: 1.5,
        mb: 1,
        alignItems: 'flex-start',
      }}
    >
      <Avatar
        sx={{
          mr: 1.5,
          bgcolor: alpha(themeColor, 0.12),
          color: themeColor,
          mt: 0.5,
        }}
      >
        {session.sessionNumber?.slice(-2) || '?'}
      </Avatar>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {session.sessionNumber}
            </Typography>
            <Chip size="small" label={formatCurrency(session.counted)} variant="outlined" color="primary" />
            <Chip size="small" label={formatCurrency(session.variance)} variant="outlined" color={varianceColor} />
          </Stack>
        }
        secondary={
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Cashier: {session.cashierName || '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Expected {formatCurrency(session.expected)} • Counted {formatCurrency(session.counted)}
            </Typography>
            {session.varianceReason && (
              <Typography variant="caption" color="text.secondary">
                Variance reason: {session.varianceReason}
              </Typography>
            )}
            {session.interimList.length > 0 && (
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Interim Entries
                    </Typography>
                    {session.interimList.map((entry, index) => (
                      <Typography key={index} variant="caption" display="block">
                        #{entry.sequence || index + 1} • {formatCurrency(entry.amount)} •{' '}
                        {entry.reasonName || entry.reasonType || '—'}
                      </Typography>
                    ))}
                  </Box>
                }
                placement="top-start"
              >
                <Chip
                  size="small"
                  label={`Interims: ${session.interimList.length}`}
                  variant="outlined"
                  color="default"
                />
              </Tooltip>
            )}
          </Stack>
        }
      />
    </ListItem>
  );
};

export default DayClosePage;

