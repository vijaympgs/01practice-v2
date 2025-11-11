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
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Schedule,
} from '@mui/icons-material';

import shiftManager from '../../services/ShiftManager.js';
import terminalManager from '../../services/TerminalManager.js';
import CounterSettlementDialog from '../../components/POS/CounterSettlementDialog.jsx';
import PageTitle from '../../components/common/PageTitle';

const ShiftManagementPage = () => {
  // Theme state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Shift data
  const [shiftData, setShiftData] = useState({
    name: '',
    operatorId: '',
    operatorName: '',
    shiftType: 'regular',
    openingCash: 0
  });

  // Shift management state
  const [currentShift, setCurrentShift] = useState(null);
  const [shiftHistory, setShiftHistory] = useState([]);
  const [shiftStatistics, setShiftStatistics] = useState(null);
  const [shiftStatus, setShiftStatus] = useState(null);
  
  // Dialog states
  const [openStartShift, setOpenStartShift] = useState(false);
  const [openCloseShift, setOpenCloseShift] = useState(false);
  const [openCounterSettlement, setOpenCounterSettlement] = useState(false);
  const [openShiftHistory, setOpenShiftHistory] = useState(false);
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

  // Initialize shift manager
  useEffect(() => {
    const initializeShift = async () => {
      try {
        setLoading(true);
        
        await shiftManager.initialize();
        const status = shiftManager.getShiftStatus();
        setShiftStatus(status);
        
        if (status.hasActiveShift) {
          const shift = shiftManager.getCurrentShift();
          setCurrentShift(shift);
        }
        
        // Load shift history and statistics
        await loadShiftHistory();
        await loadShiftStatistics();
        
      } catch (error) {
        setError('Failed to initialize shift manager: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeShift();
  }, []);

  // Load shift history
  const loadShiftHistory = async () => {
    try {
      const history = await shiftManager.getShiftHistory();
      setShiftHistory(history);
    } catch (error) {
      console.error('Failed to load shift history:', error);
    }
  };

  // Load shift statistics
  const loadShiftStatistics = async () => {
    try {
      const stats = await shiftManager.getShiftStatistics();
      setShiftStatistics(stats);
    } catch (error) {
      console.error('Failed to load shift statistics:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setShiftData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Start new shift
  const handleStartShift = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get terminal information
      const terminal = terminalManager.getCurrentTerminal();
      if (!terminal) {
        throw new Error('No terminal registered. Please setup terminal first.');
      }

      // 🎯 BUSINESS RULE VALIDATION: Check if shift can be started
      const userId = shiftData.operatorId || terminal.operatorId;
      const validation = await shiftManager.canStartShift(terminal.id, userId);
      
      if (!validation.allowed) {
        setError(validation.message || 'Cannot start shift');
        setSnackbar({ 
          open: true, 
          message: validation.message || 'Cannot start shift', 
          severity: 'error' 
        });
        setLoading(false);
        return;
      }
      
      const shiftPayload = {
        ...shiftData,
        terminalId: terminal.id,
        locationId: terminal.locationId,
        companyId: terminal.companyId
      };
      
      const newShift = await shiftManager.createShift(shiftPayload);
      setCurrentShift(newShift);
      
      const status = shiftManager.getShiftStatus();
      setShiftStatus(status);
      
      setOpenStartShift(false);
      setSuccess('Shift started successfully!');
      setSnackbar({ open: true, message: 'Shift started successfully!', severity: 'success' });
      
      // Reset form
      setShiftData({
        name: '',
        operatorId: '',
        operatorName: '',
        shiftType: 'regular',
        openingCash: 0
      });
      
    } catch (error) {
      setError('Failed to start shift: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to start shift: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Close current shift
  const handleCloseShift = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const closedShift = await shiftManager.closeShift({
        closingCash: closingCash
      });
      
      setCurrentShift(null);
      const status = shiftManager.getShiftStatus();
      setShiftStatus(status);
      
      setOpenCloseShift(false);
      setSuccess('Shift closed successfully!');
      setSnackbar({ open: true, message: 'Shift closed successfully!', severity: 'success' });
      
      // Reload history and statistics
      await loadShiftHistory();
      await loadShiftStatistics();
      
      setClosingCash(0);
      
    } catch (error) {
      setError('Failed to close shift: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to close shift: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Counter Settlement - Updated with validation
  const handleCounterSettlement = async (settlementData) => {
    try {
      setLoading(true);
      setError(null);
      
      // 🎯 BUSINESS RULE VALIDATION: Check if shift can be closed
      if (!currentShift) {
        throw new Error('No active shift to close');
      }
      
      const validation = await shiftManager.canCloseShift(currentShift.id);
      
      if (!validation.allowed) {
        setError(validation.message || 'Cannot close shift');
        setSnackbar({ 
          open: true, 
          message: validation.message || 'Cannot close shift', 
          severity: 'error' 
        });
        setOpenCounterSettlement(false);
        setLoading(false);
        return;
      }
      
      // Set closing cash from settlement
      setClosingCash(settlementData.totalCash);
      
      // Close shift with settlement data
      const closedShift = await shiftManager.closeShift({
        closingCash: settlementData.totalCash,
        settlement: settlementData
      });
      
      setCurrentShift(null);
      const status = shiftManager.getShiftStatus();
      setShiftStatus(status);
      
      setOpenCounterSettlement(false);
      setSuccess('Shift closed with settlement successfully!');
      setSnackbar({ open: true, message: 'Shift closed with settlement successfully!', severity: 'success' });
      
      // Reload history and statistics
      await loadShiftHistory();
      await loadShiftStatistics();
      
    } catch (error) {
      setError('Failed to close shift: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to close shift: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Validate shift
  const handleValidateShift = async () => {
    try {
      setLoading(true);
      const validation = await shiftManager.validateShift();
      
      if (validation.isValid) {
        setSuccess('Shift validation passed!');
        setSnackbar({ open: true, message: 'Shift validation passed!', severity: 'success' });
      } else {
        setError('Shift validation failed: ' + validation.errors.join(', '));
        setSnackbar({ open: true, message: 'Shift validation failed: ' + validation.errors.join(', '), severity: 'error' });
      }
      
    } catch (error) {
      setError('Failed to validate shift: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to validate shift: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setLoading(true);
      await loadShiftHistory();
      await loadShiftStatistics();
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

  return (
    <Box sx={{ height: '100vh', p: 2, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <PageTitle 
          title="Shift Management" 
          subtitle="Manage POS shifts and operator sessions"
          showIcon={true}
          icon={<Schedule />}
        />
      </Paper>

      <Grid container spacing={2}>
        {/* Current Shift Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              📊 Current Shift Status
            </Typography>
            
            {currentShift ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Chip
                      label={currentShift.status}
                      color={currentShift.status === 'active' ? 'success' : 'error'}
                      icon={<TimeIcon />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={currentShift.shiftType}
                      color="primary"
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Shift ID:</strong> {currentShift.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Operator:</strong> {currentShift.operatorName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Start Time:</strong> {new Date(currentShift.startTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Duration:</strong> {formatDuration(new Date() - new Date(currentShift.startTime))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Opening Cash:</strong> {formatCurrency(currentShift.openingCash)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Sales:</strong> {formatCurrency(currentShift.totalSales)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Transactions:</strong> {currentShift.totalTransactions}
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
                    Close Shift
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<TimeIcon />}
                    onClick={handleValidateShift}
                    disabled={loading}
                  >
                    Validate
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  No active shift. Start a new shift to begin operations.
                </Alert>
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={() => setOpenStartShift(true)}
                  disabled={loading}
                >
                  Start New Shift
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Shift Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              📈 Shift Statistics
            </Typography>
            
            {shiftStatistics ? (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {shiftStatistics.totalShifts}
                      </Typography>
                      <Typography variant="body2">Total Shifts</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success">
                        {shiftStatistics.activeShifts}
                      </Typography>
                      <Typography variant="body2">Active Shifts</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info">
                        {formatCurrency(shiftStatistics.totalSales)}
                      </Typography>
                      <Typography variant="body2">Total Sales</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning">
                        {shiftStatistics.totalTransactions}
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

        {/* Shift Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              🔧 Shift Actions
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<PlayIcon />}
                onClick={() => setOpenStartShift(true)}
                disabled={loading || !!currentShift}
              >
                Start New Shift
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => setOpenShiftHistory(true)}
                disabled={loading}
              >
                View History
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

      {/* Start Shift Dialog */}
      <Dialog open={openStartShift} onClose={() => setOpenStartShift(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Start New Shift
          <IconButton
            onClick={() => setOpenStartShift(false)}
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
                label="Shift Name"
                value={shiftData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter shift name (e.g., Morning Shift, Evening Shift)"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Operator ID"
                value={shiftData.operatorId}
                onChange={(e) => handleInputChange('operatorId', e.target.value)}
                placeholder="Enter operator ID"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Operator Name"
                value={shiftData.operatorName}
                onChange={(e) => handleInputChange('operatorName', e.target.value)}
                placeholder="Enter operator name"
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Shift Type</InputLabel>
                <Select
                  value={shiftData.shiftType}
                  onChange={(e) => handleInputChange('shiftType', e.target.value)}
                  label="Shift Type"
                >
                  <MenuItem value="regular">Regular Shift</MenuItem>
                  <MenuItem value="overtime">Overtime Shift</MenuItem>
                  <MenuItem value="weekend">Weekend Shift</MenuItem>
                  <MenuItem value="holiday">Holiday Shift</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Opening Cash"
                type="number"
                value={shiftData.openingCash}
                onChange={(e) => handleInputChange('openingCash', parseFloat(e.target.value) || 0)}
                placeholder="Enter opening cash amount"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStartShift(false)}>Cancel</Button>
          <Button
            onClick={handleStartShift}
            variant="contained"
            disabled={loading || !shiftData.operatorName}
          >
            {loading ? 'Starting...' : 'Start Shift'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close Shift Dialog */}
      <Dialog open={openCloseShift} onClose={() => setOpenCloseShift(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Close Current Shift
          <IconButton
            onClick={() => setOpenCloseShift(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {currentShift && (
            <Box sx={{ mt: 1 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Closing shift for {currentShift.operatorName}
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Opening Cash: {formatCurrency(currentShift.openingCash)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Sales: {formatCurrency(currentShift.totalSales)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Expected Cash: {formatCurrency(currentShift.expectedCash)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {formatDuration(new Date() - new Date(currentShift.startTime))}
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
          <Button onClick={() => setOpenCloseShift(false)}>Cancel</Button>
          <Button
            onClick={handleCloseShift}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Closing...' : 'Close Shift'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shift History Dialog */}
      <Dialog open={openShiftHistory} onClose={() => setOpenShiftHistory(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Shift History
          <IconButton
            onClick={() => setOpenShiftHistory(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Shift ID</TableCell>
                  <TableCell>Operator</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Opening Cash</TableCell>
                  <TableCell>Closing Cash</TableCell>
                  <TableCell>Total Sales</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shiftHistory.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{shift.id}</TableCell>
                    <TableCell>{shift.operatorName}</TableCell>
                    <TableCell>{new Date(shift.startTime).toLocaleString()}</TableCell>
                    <TableCell>{shift.endTime ? new Date(shift.endTime).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>
                      {shift.endTime ? formatDuration(new Date(shift.endTime) - new Date(shift.startTime)) : 'N/A'}
                    </TableCell>
                    <TableCell>{formatCurrency(shift.openingCash)}</TableCell>
                    <TableCell>{formatCurrency(shift.closingCash)}</TableCell>
                    <TableCell>{formatCurrency(shift.totalSales)}</TableCell>
                    <TableCell>
                      <Chip
                        label={shift.status}
                        color={shift.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShiftHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Counter Settlement Dialog */}
      {currentShift && (
        <CounterSettlementDialog
          open={openCounterSettlement}
          onClose={() => setOpenCounterSettlement(false)}
          onConfirm={handleCounterSettlement}
          expectedCash={currentShift.expectedCash || currentShift.openingCash}
          title="Shift Counter Settlement"
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

export default ShiftManagementPage;
