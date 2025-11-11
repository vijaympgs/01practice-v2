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
  Snackbar,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Person as PersonIcon,
  Computer as ComputerIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  AccountCircle,
} from '@mui/icons-material';

import sessionManager from '../../services/SessionManager.js';
import terminalManager from '../../services/TerminalManager.js';
import shiftManager from '../../services/ShiftManager.js';
import CounterSettlementDialog from '../../components/POS/CounterSettlementDialog.jsx';
import PageTitle from '../../components/common/PageTitle.jsx';

const SessionManagementPage = () => {
  // Theme state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Session data
  const [sessionData, setSessionData] = useState({
    name: '',
    operatorId: '',
    operatorName: '',
    sessionType: 'regular',
    openingCash: 0
  });

  // Session management state
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [sessionStatistics, setSessionStatistics] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [openStartSession, setOpenStartSession] = useState(false);
  const [openCloseSession, setOpenCloseSession] = useState(false);
  const [openCounterSettlement, setOpenCounterSettlement] = useState(false);
  const [openSessionHistory, setOpenSessionHistory] = useState(false);
  const [closingCash, setClosingCash] = useState(0);

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

  // Initialize session manager
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);
        
        await sessionManager.initialize();
        const status = sessionManager.getSessionStatus();
        setSessionStatus(status);
        
        if (status.hasActiveSession) {
          const session = sessionManager.getCurrentSession();
          setCurrentSession(session);
        }
        
        // Load session history and statistics
        await loadSessionHistory();
        await loadSessionStatistics();
        
      } catch (error) {
        setError('Failed to initialize session manager: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Load session history
  const loadSessionHistory = async () => {
    try {
      const history = await sessionManager.getSessionHistory();
      setSessionHistory(history);
    } catch (error) {
      console.error('Failed to load session history:', error);
    }
  };

  // Load session statistics
  const loadSessionStatistics = async () => {
    try {
      const stats = await sessionManager.getSessionStatistics();
      setSessionStatistics(stats);
    } catch (error) {
      console.error('Failed to load session statistics:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Start new session
  const handleStartSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get terminal and shift information
      const terminal = terminalManager.getCurrentTerminal();
      const currentShift = shiftManager.getCurrentShift();
      
      if (!terminal) {
        throw new Error('No terminal registered. Please setup terminal first.');
      }
      
      if (!currentShift) {
        throw new Error('No active shift. Please start a shift first.');
      }

      // 🎯 BUSINESS RULE VALIDATION: Check if session can be started
      const userId = sessionData.operatorId || terminal.operatorId;
      const validation = await sessionManager.canStartSession(terminal.id, userId);
      
      if (!validation.allowed) {
        setError(validation.message || 'Cannot start session');
        setSnackbar({ 
          open: true, 
          message: validation.message || 'Cannot start session', 
          severity: 'error' 
        });
        
        // If there's a pending settlement, show specific message
        if (validation.pendingSettlement) {
          setError(validation.message);
          setSnackbar({ 
            open: true, 
            message: validation.message, 
            severity: 'warning' 
          });
        }
        
        setLoading(false);
        return;
      }
      
      const sessionPayload = {
        ...sessionData,
        terminalId: terminal.id,
        locationId: terminal.locationId,
        companyId: terminal.companyId,
        shiftId: currentShift.id
      };
      
      const newSession = await sessionManager.createSession(sessionPayload);
      setCurrentSession(newSession);
      
      const status = sessionManager.getSessionStatus();
      setSessionStatus(status);
      
      setOpenStartSession(false);
      setSuccess('Session started successfully!');
      setSnackbar({ open: true, message: 'Session started successfully!', severity: 'success' });
      
      // Reset form
      setSessionData({
        name: '',
        operatorId: '',
        operatorName: '',
        sessionType: 'regular',
        openingCash: 0
      });
      
    } catch (error) {
      setError('Failed to start session: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to start session: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Close current session
  const handleCloseSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const closedSession = await sessionManager.closeSession({
        closingCash: closingCash
      });
      
      setCurrentSession(null);
      const status = sessionManager.getSessionStatus();
      setSessionStatus(status);
      
      setOpenCloseSession(false);
      setSuccess('Session closed successfully!');
      setSnackbar({ open: true, message: 'Session closed successfully!', severity: 'success' });
      
      // Reload history and statistics
      await loadSessionHistory();
      await loadSessionStatistics();
      
      setClosingCash(0);
      
    } catch (error) {
      setError('Failed to close session: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to close session: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Counter Settlement - Updated with validation
  const handleCounterSettlement = async (settlementData) => {
    try {
      setLoading(true);
      setError(null);
      
      // 🎯 BUSINESS RULE VALIDATION: Check if session can be closed
      if (!currentSession) {
        throw new Error('No active session to close');
      }
      
      const userId = sessionData.operatorId || currentSession.operatorId;
      const validation = await sessionManager.canCloseSession(currentSession.id, userId);
      
      if (!validation.allowed) {
        setError(validation.message || 'Cannot close session');
        setSnackbar({ 
          open: true, 
          message: validation.message || 'Cannot close session', 
          severity: 'error' 
        });
        setOpenCounterSettlement(false);
        setLoading(false);
        return;
      }
      
      // Update session with settlement data
      await sessionManager.updateSessionSettlement(currentSession.id, settlementData);
      
      // Set closing cash from settlement
      setClosingCash(settlementData.totalCash);
      
      // Close session with settlement data
      const closedSession = await sessionManager.closeSession({
        closingCash: settlementData.totalCash,
        settlement: settlementData,
        settlementCompleted: true,  // Mark settlement as completed
        settlementData: settlementData
      });
      
      setCurrentSession(null);
      const status = sessionManager.getSessionStatus();
      setSessionStatus(status);
      
      setOpenCounterSettlement(false);
      setSuccess('Session closed with settlement successfully!');
      setSnackbar({ open: true, message: 'Session closed with settlement successfully!', severity: 'success' });
      
      // Reload history and statistics
      await loadSessionHistory();
      await loadSessionStatistics();
      
    } catch (error) {
      setError('Failed to close session: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to close session: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Validate session
  const handleValidateSession = async () => {
    try {
      setLoading(true);
      const validation = await sessionManager.validateSession();
      
      if (validation.isValid) {
        setSuccess('Session validation passed!');
        setSnackbar({ open: true, message: 'Session validation passed!', severity: 'success' });
      } else {
        setError('Session validation failed: ' + validation.errors.join(', '));
        setSnackbar({ open: true, message: 'Session validation failed: ' + validation.errors.join(', '), severity: 'error' });
      }
      
    } catch (error) {
      setError('Failed to validate session: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to validate session: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setLoading(true);
      await loadSessionHistory();
      await loadSessionStatistics();
      setSuccess('Data refreshed successfully!');
      setSnackbar({ open: true, message: 'Data refreshed successfully!', severity: 'success' });
    } catch (error) {
      setError('Failed to refresh data: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to refresh data: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Format duration
  const formatDuration = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ height: '100vh', p: 2, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <PageTitle 
          title="Session Management" 
          subtitle="Manage POS sessions and user authentication"
          showIcon={true}
          icon={<AccountCircle />}
        />
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Current Session" icon={<PlayIcon />} />
          <Tab label="Session History" icon={<HistoryIcon />} />
          <Tab label="Statistics" icon={<AssessmentIcon />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={2}>
          {/* Current Session Status */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📊 Current Session Status
              </Typography>
              
              {currentSession ? (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Chip
                        label={currentSession.status}
                        color={currentSession.status === 'active' ? 'success' : 'error'}
                        icon={<TimeIcon />}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Chip
                        label={currentSession.sessionType}
                        color="primary"
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Session ID:</strong> {currentSession.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Operator:</strong> {currentSession.operatorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Terminal:</strong> {currentSession.terminalId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Start Time:</strong> {new Date(currentSession.startTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Duration:</strong> {formatDuration(new Date() - new Date(currentSession.startTime))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Opening Cash:</strong> {formatCurrency(currentSession.openingCash)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total Sales:</strong> {formatCurrency(currentSession.totalSales)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total Transactions:</strong> {currentSession.totalTransactions}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<StopIcon />}
                      onClick={() => setOpenCounterSettlement(true)}
                      disabled={loading}
                    >
                      Close Session
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TimeIcon />}
                      onClick={handleValidateSession}
                      disabled={loading}
                    >
                      Validate
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    No active session. Start a new session to begin operations.
                  </Alert>
                  <Button
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={() => setOpenStartSession(true)}
                    disabled={loading}
                  >
                    Start New Session
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Session Actions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🔧 Session Actions
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<PlayIcon />}
                  onClick={() => setOpenStartSession(true)}
                  disabled={loading || !!currentSession}
                >
                  Start New Session
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  Refresh Data
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Session History Tab */}
      {activeTab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            📚 Session History
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                                  <TableRow>
                    <TableCell>Session ID</TableCell>
                    <TableCell>Operator</TableCell>
                    <TableCell>Terminal</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Opening Cash</TableCell>
                    <TableCell>Closing Cash</TableCell>
                    <TableCell>Total Sales</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Settlement</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {sessionHistory.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.id}</TableCell>
                    <TableCell>{session.operatorName}</TableCell>
                    <TableCell>{session.terminalId}</TableCell>
                    <TableCell>{new Date(session.startTime).toLocaleString()}</TableCell>
                    <TableCell>{session.endTime ? new Date(session.endTime).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>
                      {session.endTime ? formatDuration(new Date(session.endTime) - new Date(session.startTime)) : 'N/A'}
                    </TableCell>
                    <TableCell>{formatCurrency(session.openingCash)}</TableCell>
                    <TableCell>{formatCurrency(session.closingCash)}</TableCell>
                    <TableCell>{formatCurrency(session.totalSales)}</TableCell>
                    <TableCell>
                      <Chip
                        label={session.status}
                        color={session.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {session.settlement_status ? (
                        <Chip
                          label={session.settlement_status}
                          color={session.settlement_status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      ) : (
                        <Chip label="N/A" size="small" variant="outlined" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Statistics Tab */}
      {activeTab === 2 && (
        <Grid container spacing={2}>
          {/* Session Statistics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📈 Session Statistics
              </Typography>
              
              {sessionStatistics ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {sessionStatistics.totalSessions}
                        </Typography>
                        <Typography variant="body2">Total Sessions</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success">
                          {sessionStatistics.activeSessions}
                        </Typography>
                        <Typography variant="body2">Active Sessions</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info">
                          {formatCurrency(sessionStatistics.totalSales)}
                        </Typography>
                        <Typography variant="body2">Total Sales</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning">
                          {sessionStatistics.totalTransactions}
                        </Typography>
                        <Typography variant="body2">Total Transactions</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No statistics available
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Payment Method Statistics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                💳 Payment Method Statistics
              </Typography>
              
              {sessionStatistics?.paymentMethodStats ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success">
                          {formatCurrency(sessionStatistics.paymentMethodStats.cash)}
                        </Typography>
                        <Typography variant="body2">Cash</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info">
                          {formatCurrency(sessionStatistics.paymentMethodStats.card)}
                        </Typography>
                        <Typography variant="body2">Card</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning">
                          {formatCurrency(sessionStatistics.paymentMethodStats.digital)}
                        </Typography>
                        <Typography variant="body2">Digital</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error">
                          {formatCurrency(sessionStatistics.paymentMethodStats.other)}
                        </Typography>
                        <Typography variant="body2">Other</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No payment method statistics available
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Start Session Dialog */}
      <Dialog open={openStartSession} onClose={() => setOpenStartSession(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Start New Session
          <IconButton
            onClick={() => setOpenStartSession(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Session Name"
                value={sessionData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter session name (e.g., Morning Session, Evening Session)"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Operator ID"
                value={sessionData.operatorId}
                onChange={(e) => handleInputChange('operatorId', e.target.value)}
                placeholder="Enter operator ID"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Operator Name"
                value={sessionData.operatorName}
                onChange={(e) => handleInputChange('operatorName', e.target.value)}
                placeholder="Enter operator name"
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Session Type</InputLabel>
                <Select
                  value={sessionData.sessionType}
                  onChange={(e) => handleInputChange('sessionType', e.target.value)}
                  label="Session Type"
                >
                  <MenuItem value="regular">Regular Session</MenuItem>
                  <MenuItem value="overtime">Overtime Session</MenuItem>
                  <MenuItem value="weekend">Weekend Session</MenuItem>
                  <MenuItem value="holiday">Holiday Session</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Opening Cash"
                type="number"
                value={sessionData.openingCash}
                onChange={(e) => handleInputChange('openingCash', parseFloat(e.target.value) || 0)}
                placeholder="Enter opening cash amount"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStartSession(false)}>Cancel</Button>
          <Button
            onClick={handleStartSession}
            variant="contained"
            disabled={loading || !sessionData.operatorName}
          >
            {loading ? 'Starting...' : 'Start Session'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close Session Dialog */}
      <Dialog open={openCloseSession} onClose={() => setOpenCloseSession(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Close Current Session
          <IconButton
            onClick={() => setOpenCloseSession(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {currentSession && (
            <Box sx={{ mt: 1 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Closing session for {currentSession.operatorName}
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Opening Cash: {formatCurrency(currentSession.openingCash)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Sales: {formatCurrency(currentSession.totalSales)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Expected Cash: {formatCurrency(currentSession.expectedCash)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {formatDuration(new Date() - new Date(currentSession.startTime))}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Closing Cash"
                    type="number"
                    value={closingCash}
                    onChange={(e) => setClosingCash(parseFloat(e.target.value) || 0)}
                    placeholder="Enter closing cash amount"
                    inputProps={{ min: 0, step: 0.01 }}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCloseSession(false)}>Cancel</Button>
          <Button
            onClick={handleCloseSession}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Closing...' : 'Close Session'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Counter Settlement Dialog */}
      {currentSession && (
        <CounterSettlementDialog
          open={openCounterSettlement}
          onClose={() => setOpenCounterSettlement(false)}
          onConfirm={handleCounterSettlement}
          expectedCash={currentSession.expectedCash || currentSession.openingCash}
          title="Session Counter Settlement"
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default SessionManagementPage;
