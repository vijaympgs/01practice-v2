import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton
} from '@mui/material';
import {
  AccountBalance as CashIcon,
  PlayArrow as StartIcon,
  Stop as EndIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon
} from '@mui/icons-material';

const CashPayments = ({ mode, embeddedDB, posService, onMessage }) => {
  const [currentShift, setCurrentShift] = useState(null);
  const [currentCashDrawer, setCurrentCashDrawer] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [openingCash, setOpeningCash] = useState(0);
  const [closingCash, setClosingCash] = useState(0);
  const [cashOperations, setCashOperations] = useState([]);

  useEffect(() => {
    loadCurrentShift();
    loadShifts();
  }, [posService]);

  const loadCurrentShift = () => {
    if (posService) {
      const shift = posService.getCurrentShift();
      const drawer = posService.getCurrentCashDrawer();
      setCurrentShift(shift);
      setCurrentCashDrawer(drawer);
    }
  };

  const loadShifts = async () => {
    try {
      if (embeddedDB) {
        const allShifts = await embeddedDB.getAll('shifts');
        setShifts(allShifts.slice(-10)); // Last 10 shifts
      }
    } catch (error) {
      console.error('Failed to load shifts:', error);
    }
  };

  const handleStartShift = async () => {
    try {
      if (posService) {
        const shift = await posService.startShift('OP001', openingCash);
        setCurrentShift(shift);
        setCurrentCashDrawer(posService.getCurrentCashDrawer());
        onMessage('✅ Shift started successfully');
        setDialogOpen(false);
        setOpeningCash(0);
      }
    } catch (error) {
      onMessage(`❌ Failed to start shift: ${error.message}`);
    }
  };

  const handleEndShift = async () => {
    try {
      if (posService) {
        const shift = await posService.endShift(closingCash);
        setCurrentShift(null);
        setCurrentCashDrawer(null);
        onMessage('✅ Shift ended successfully');
        setDialogOpen(false);
        setClosingCash(0);
        loadShifts();
      }
    } catch (error) {
      onMessage(`❌ Failed to end shift: ${error.message}`);
    }
  };

  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
    if (type === 'start') {
      setActiveStep(0);
    } else if (type === 'end') {
      setActiveStep(1);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getShiftStats = () => {
    if (!currentShift) return { totalSales: 0, totalTransactions: 0, duration: 0 };
    
    const duration = currentShift.endTime 
      ? new Date(currentShift.endTime) - new Date(currentShift.startTime)
      : new Date() - new Date(currentShift.startTime);
    
    return {
      totalSales: currentShift.totalSales || 0,
      totalTransactions: currentShift.totalTransactions || 0,
      duration: Math.floor(duration / (1000 * 60)) // minutes
    };
  };

  const shiftStats = getShiftStats();

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Current Shift Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Shift Status
              </Typography>

              {currentShift ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Shift Active - {currentShift.id}
                  </Alert>

                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Shift Information
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Operator:</Typography>
                      <Typography variant="body2">OP001</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Start Time:</Typography>
                      <Typography variant="body2">
                        {new Date(currentShift.startTime).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Duration:</Typography>
                      <Typography variant="body2">{shiftStats.duration} minutes</Typography>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Performance
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Total Sales:</Typography>
                      <Typography variant="body2">${shiftStats.totalSales.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Transactions:</Typography>
                      <Typography variant="body2">{shiftStats.totalTransactions}</Typography>
                    </Box>
                  </Paper>

                  {currentCashDrawer && (
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Cash Drawer
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Opening Cash:</Typography>
                        <Typography variant="body2">${currentCashDrawer.openingCash.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Current Cash:</Typography>
                        <Typography variant="body2">${currentCashDrawer.currentCash.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Status:</Typography>
                        <Chip 
                          label={currentCashDrawer.status} 
                          color={currentCashDrawer.status === 'open' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Paper>
                  )}

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<EndIcon />}
                    fullWidth
                    onClick={() => openDialog('end')}
                  >
                    End Shift
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    No active shift. Start a new shift to begin operations.
                  </Alert>

                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<StartIcon />}
                    fullWidth
                    onClick={() => openDialog('start')}
                  >
                    Start New Shift
                  </Button>
                </Box>
              )}

              {/* Mode Indicator */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Chip
                  label={mode === 'online' ? 'Online Mode' : 'Offline Mode'}
                  color={mode === 'online' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Shift History */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Shifts
              </Typography>

              {shifts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No shift history available
                </Typography>
              ) : (
                <List sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
                  {shifts.map((shift) => (
                    <ListItem key={shift.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={`${shift.operatorId} - ${new Date(shift.startTime).toLocaleDateString()}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(shift.startTime).toLocaleTimeString()} - {shift.endTime ? new Date(shift.endTime).toLocaleTimeString() : 'Active'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Chip label={`Sales: $${shift.totalSales?.toFixed(2) || '0.00'}`} size="small" />
                              <Chip label={`TXN: ${shift.totalTransactions || 0}`} size="small" />
                              <Chip 
                                label={shift.status} 
                                color={shift.status === 'completed' ? 'success' : shift.status === 'active' ? 'primary' : 'default'}
                                size="small"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Start/End Shift Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'start' ? 'Start New Shift' : 'End Current Shift'}
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Cash Count</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {dialogType === 'start' 
                    ? 'Enter the opening cash amount in the drawer'
                    : 'Enter the closing cash amount in the drawer'
                  }
                </Typography>
                <TextField
                  fullWidth
                  label={dialogType === 'start' ? 'Opening Cash' : 'Closing Cash'}
                  type="number"
                  value={dialogType === 'start' ? openingCash : closingCash}
                  onChange={(e) => dialogType === 'start' ? setOpeningCash(parseFloat(e.target.value) || 0) : setClosingCash(parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <CashIcon sx={{ mr: 1 }} />
                  }}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={dialogType === 'start' ? handleStartShift : handleEndShift}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {dialogType === 'start' ? 'Start Shift' : 'End Shift'}
                  </Button>
                  <Button
                    onClick={() => setDialogOpen(false)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CashPayments;
