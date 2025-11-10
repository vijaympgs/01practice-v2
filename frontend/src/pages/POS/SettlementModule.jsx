import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
  InputAdornment,
} from '@mui/material';
import {
  AccountBalance as CashDrawerIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Print as PrintIcon,
  History as HistoryIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';
import { codeSettingsService } from '../../services/codeSettingsService';
import transactionManager from '../../services/TransactionManager';
import shiftManager from '../../services/ShiftManager';
import sessionManager from '../../services/SessionManager';
import { businessRulesService } from '../../services/businessRulesService';
import salesService from '../../services/salesService';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SettlementModule = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // Settlement state
  const [settlement, setSettlement] = useState({
    id: '',
    sessionId: '',
    shiftId: '',
    cashierId: '',
    startTime: '',
    endTime: '',
    openingBalance: 0,
    closingBalance: 0,
    expectedCash: 0,
    actualCash: 0,
    difference: 0,
    status: 'pending', // pending, completed, verified
    notes: '',
    denominations: {
      '2000': { count: 0, amount: 0 },
      '500': { count: 0, amount: 0 },
      '200': { count: 0, amount: 0 },
      '100': { count: 0, amount: 0 },
      '50': { count: 0, amount: 0 },
      '20': { count: 0, amount: 0 },
      '10': { count: 0, amount: 0 },
      '5': { count: 0, amount: 0 },
      '2': { count: 0, amount: 0 },
      '1': { count: 0, amount: 0 },
    },
    transactions: [],
    refunds: [],
    adjustments: [],
  });
  
  const [adjustmentDialog, setAdjustmentDialog] = useState({ open: false, type: 'add' });
  
  // Adjustment dialog state
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  
  // Validation state
  const [settlementValidation, setSettlementValidation] = useState(null);
  const [settlementSettings, setSettlementSettings] = useState(null);
  
  // Data states
  const [currentSession, setCurrentSession] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);
  const [selectedCurrency] = useState('INR');
  const [settlementHistory, setSettlementHistory] = useState([]);

  useEffect(() => {
    initializeSettlement();
  }, []);

  const initializeSettlement = async () => {
    try {
      setLoading(true);
      
      // Load settlement settings
      try {
        const settings = await businessRulesService.getSettlementSettings();
        setSettlementSettings(settings);
      } catch (error) {
        console.error('Failed to load settlement settings:', error);
      }
      
      // Get current session from backend API
      let session = null;
      try {
        const response = await api.get('/sales/pos-sessions/current/');
        session = response.data;
      } catch (error) {
        // Fallback to localStorage
        session = sessionManager.getCurrentSession();
      }
      
      // Get shift
      const shift = shiftManager.getCurrentShift();
      
      if (session) {
        setCurrentSession(session);
        setCurrentShift(shift);
        
        // Validate settlement pre-conditions
        await validateSettlementPreConditions(session.id);
        
        // Initialize settlement
        const newSettlement = {
          id: Date.now().toString(),
          sessionId: session.id,
          shiftId: shift?.id || '',
          cashierId: session.operator?.id || session.operator_id || 'current_user',
          startTime: session.start_time || session.startTime || new Date().toISOString(),
          endTime: '',
          openingBalance: parseFloat(session.opening_cash || session.openingBalance || 0),
          closingBalance: 0,
          expectedCash: 0,
          actualCash: 0,
          difference: 0,
          status: 'pending',
          notes: '',
          denominations: {
            '2000': { count: 0, amount: 0 },
            '500': { count: 0, amount: 0 },
            '200': { count: 0, amount: 0 },
            '100': { count: 0, amount: 0 },
            '50': { count: 0, amount: 0 },
            '20': { count: 0, amount: 0 },
            '10': { count: 0, amount: 0 },
            '5': { count: 0, amount: 0 },
            '2': { count: 0, amount: 0 },
            '1': { count: 0, amount: 0 },
          },
          transactions: [],
          refunds: [],
          adjustments: [],
        };
        
        setSettlement(newSettlement);
        
        // Load transactions for this session
        await loadSessionTransactions(session.id);
      } else {
        setSnackbar({ open: true, message: 'No active session found', severity: 'warning' });
      }
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize settlement: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const validateSettlementPreConditions = async (sessionId) => {
    try {
      const validation = await sessionManager.validateSettlement(sessionId);
      setSettlementValidation(validation);
      
      if (!validation.allowed) {
        const message = validation.details?.suspendedBills?.length > 0
          ? `Cannot proceed with settlement. ${validation.details.suspendedBills.length} suspended bill(s) must be completed first.`
          : validation.details?.partialTransactions?.length > 0
          ? `Cannot proceed with settlement. ${validation.details.partialTransactions.length} partial transaction(s) must be completed first.`
          : validation.reason || 'Cannot proceed with settlement due to pending transactions';
        
        setSnackbar({ open: true, message, severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to validate settlement:', error);
      setSnackbar({ open: true, message: 'Failed to validate settlement: ' + error.message, severity: 'warning' });
    }
  };

  const loadSessionTransactions = async (sessionId) => {
    try {
      // Try to load from backend API first
      let transactions = [];
      try {
        const response = await api.get('/sales/sales/', {
          params: {
            session: sessionId,
            page_size: 1000
          }
        });
        const sales = response.data.results || response.data || [];
        transactions = sales.map(sale => ({
          id: sale.id,
          saleNumber: sale.sale_number,
          total: parseFloat(sale.total_amount || 0),
          paymentMethod: sale.payment_method || 'cash',
          status: sale.status,
          createdAt: sale.created_at
        }));
      } catch (error) {
        // Fallback to transactionManager
        transactions = await transactionManager.getTransactions({ sessionId });
      }
      
      const cashTransactions = transactions.filter(t => 
        t.paymentMethod === 'cash' || t.payment_method === 'cash'
      );
      
      const expectedCash = cashTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
      
      setSettlement(prev => ({
        ...prev,
        transactions: transactions,
        expectedCash: expectedCash,
        closingBalance: prev.openingBalance + expectedCash,
      }));
    } catch (error) {
      console.error('Failed to load session transactions:', error);
    }
  };

  const updateDenomination = (denomination, count) => {
    const sanitizedCount = Math.max(0, count);
    setSettlement(prev => {
      const updatedDenominations = {
        ...prev.denominations,
        [denomination]: {
          count: sanitizedCount,
          amount: parseInt(denomination, 10) * sanitizedCount,
        },
      };
      const totalCash = Object.values(updatedDenominations).reduce((sum, denom) => sum + denom.amount, 0);
      const difference = totalCash - prev.expectedCash;
      return {
      ...prev,
        denominations: updatedDenominations,
      actualCash: totalCash,
        difference,
      };
    });
  };

  const handleAddAdjustment = () => {
    const amount = parseFloat(adjustmentAmount);
    const reason = adjustmentReason.trim();
    
    if (!amount || amount <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid amount', severity: 'warning' });
      return;
    }
    
    if (!reason) {
      setSnackbar({ open: true, message: 'Please enter a reason for the adjustment', severity: 'warning' });
      return;
    }
    
    const adjustment = {
      id: Date.now().toString(),
      type: adjustmentDialog.type, // 'add' or 'subtract'
      amount: amount,
      reason: reason,
      timestamp: new Date().toISOString(),
    };
    
    setSettlement(prev => ({
      ...prev,
      adjustments: [...prev.adjustments, adjustment],
    }));
    
    // Reset dialog state
    setAdjustmentDialog({ open: false, type: 'add' });
    setAdjustmentAmount('');
    setAdjustmentReason('');
  };

  const completeSettlement = async () => {
    try {
      setSaving(true);
      
      // Validate settlement pre-conditions again before completing
      if (currentSession) {
        const validation = await sessionManager.validateSettlement(currentSession.id);
        if (!validation.allowed) {
          const message = validation.details?.suspendedBills?.length > 0
            ? `Cannot complete settlement. ${validation.details.suspendedBills.length} suspended bill(s) must be completed first.`
            : validation.details?.partialTransactions?.length > 0
            ? `Cannot complete settlement. ${validation.details.partialTransactions.length} partial transaction(s) must be completed first.`
            : validation.reason || 'Cannot complete settlement due to pending transactions';
          
          setSnackbar({ open: true, message, severity: 'error' });
          setSaving(false);
          return;
        }
      }
      
      const completedSettlement = {
        ...settlement,
        endTime: new Date().toISOString(),
        status: 'completed',
      };
      
      // Close session with settlement data via backend API
      if (currentSession) {
        try {
          const settlementData = {
            closing_cash: settlement.actualCash,
            denominations: settlement.denominations,
            expected_cash: settlement.expectedCash,
            actual_cash: settlement.actualCash,
            variance: settlement.difference,
            adjustments: settlement.adjustments,
            notes: settlement.notes,
            settlement_completed: true
          };
          
          // Close session via API
          await api.post(`/sales/pos-sessions/${currentSession.id}/close/`, settlementData);
          
          // Also update local session manager
          await sessionManager.updateSessionSettlement(currentSession.id, {
            totalCash: settlement.actualCash,
            expectedCash: settlement.expectedCash,
            actualCash: settlement.actualCash,
            variance: settlement.difference,
            denominations: settlement.denominations,
            adjustments: settlement.adjustments
          });
        } catch (error) {
          console.error('Failed to close session via API:', error);
          // Fallback to localStorage
          await sessionManager.closeSession({
            closingCash: settlement.actualCash,
            settlementCompleted: true,
            settlementData: completedSettlement
          });
        }
      }
      
      // Save settlement to localStorage for history
      await saveSettlement(completedSettlement);
      
      // Show success and navigate to Day Close
      setSnackbar({ 
        open: true, 
        message: 'Settlement completed successfully! Redirecting to Day Close...', 
        severity: 'success' 
      });
      
      setTimeout(() => {
        navigate('/pos/day-close');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to complete settlement:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
      setSnackbar({ open: true, message: 'Failed to complete settlement: ' + errorMessage, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const saveSettlement = async (settlementData) => {
    try {
      // Save to localStorage for offline access
      const settlements = JSON.parse(localStorage.getItem('settlements') || '[]');
      settlements.push({
        ...settlementData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('settlements', JSON.stringify(settlements));
      
      // Note: Settlements are handled through POSSession close endpoint
      // The settlement data is saved when closing a session via /pos-sessions/{id}/close/
      // For now, we store in localStorage for reference
      console.log('Settlement saved to localStorage:', settlementData);
    } catch (error) {
      console.error('Failed to save settlement:', error);
      throw error;
    }
  };

  const loadSettlementHistory = async () => {
    try {
      const settlements = JSON.parse(localStorage.getItem('settlements') || '[]');
      setSettlementHistory(settlements);
    } catch (error) {
      console.error('Failed to load settlement history:', error);
    }
  };

  const formatCurrency = (amount) => {
    return currencyService.formatCurrency(amount, selectedCurrency);
  };

  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      completed: 'success',
      verified: 'info',
    };
    return colors[status] || 'default';
  };

  const paymentBreakdown = useMemo(() => {
    return settlement.transactions.reduce(
      (acc, transaction) => {
        const method = (transaction.paymentMethod || transaction.payment_method || '').toLowerCase();
        const total = parseFloat(transaction.total || 0);
        if (method.includes('cash')) {
          acc.cash += total;
        } else if (method.includes('card')) {
          acc.card += total;
        } else if (method.includes('upi') || method.includes('wallet') || method.includes('digital') || method.includes('online')) {
          acc.digital += total;
        } else {
          acc.others += total;
        }
        return acc;
      },
      { cash: 0, card: 0, digital: 0, others: 0 }
    );
  }, [settlement.transactions]);

  const adjustmentsNetImpact = useMemo(() => {
    return settlement.adjustments.reduce((sum, adjustment) => {
      return adjustment.type === 'add' ? sum + adjustment.amount : sum - adjustment.amount;
    }, 0);
  }, [settlement.adjustments]);

  const refundTotal = useMemo(() => {
    return settlement.refunds.reduce((sum, refund) => sum + parseFloat(refund.amount || 0), 0);
  }, [settlement.refunds]);

  const nonCashTotal = paymentBreakdown.card + paymentBreakdown.digital + paymentBreakdown.others;

  const cashStepCompleted = settlement.actualCash > 0;
  const cardStepCompleted = paymentBreakdown.card + paymentBreakdown.digital + paymentBreakdown.others > 0;
  const adjustmentsStepCompleted = settlement.adjustments.length > 0;
  const signoffStepCompleted = settlement.status === 'completed';

  const timelineSteps = useMemo(
    () => [
      {
        key: 'cash',
        title: '1. Cash Drawer Count',
        subtitle: 'Count, verify and record physical cash by denomination',
        status: cashStepCompleted ? 'complete' : 'in-progress',
        timestamp: settlement.startTime ? new Date(settlement.startTime).toLocaleTimeString() : 'Not started',
      },
      {
        key: 'card',
        title: '2. Card & Digital Reconciliation',
        subtitle: 'Match processor reports for card, UPI and wallet payments',
        status: cardStepCompleted ? 'complete' : 'pending',
        timestamp: cardStepCompleted ? 'Ready for verification' : 'Pending verification',
      },
      {
        key: 'adjustments',
        title: '3. Adjustments & Overrides',
        subtitle: 'Track manual adjustments, refunds and cash drops',
        status: adjustmentsStepCompleted ? 'in-review' : 'pending',
        timestamp: `${settlement.adjustments.length} record(s)`,
      },
      {
        key: 'handover',
        title: '4. Manager Approval & Handover',
        subtitle: 'Capture notes and complete the settlement handover',
        status: signoffStepCompleted ? 'complete' : 'pending',
        timestamp: signoffStepCompleted ? 'Completed' : 'Awaiting sign-off',
      },
    ],
    [cashStepCompleted, cardStepCompleted, adjustmentsStepCompleted, signoffStepCompleted, settlement.adjustments.length, settlement.startTime, settlement.status]
  );

  const renderStepContent = (stepKey) => {
    switch (stepKey) {
      case 'cash':
        return (
          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Opening Float
                    </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(settlement.openingBalance)}
                    </Typography>
                  </Paper>
                </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                      Expected Cash
                    </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(settlement.expectedCash)}
                    </Typography>
                  </Paper>
                </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Counted Cash
                    </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(settlement.actualCash)}
                    </Typography>
                  </Paper>
                </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Variance
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                      color:
                        settlement.difference === 0
                          ? theme.palette.success.main
                          : settlement.difference > 0
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    }}
                  >
                    {formatCurrency(settlement.difference)}
              </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Denomination Breakdown
              </Typography>
              <Grid container spacing={1.5}>
                {Object.entries(settlement.denominations).map(([denomination, data]) => (
                  <Grid item xs={6} sm={4} md={3} key={denomination}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        alignItems: 'stretch',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {`${getCurrencySymbol()}${denomination}`}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => updateDenomination(denomination, data.count - 1)}
                          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {data.count}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => updateDenomination(denomination, data.count + 1)}
                          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(data.amount)}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              </Box>
          </Stack>
        );
      case 'card':
        return (
          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Card Payments
                </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(paymentBreakdown.card)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    UPI & Wallets
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(paymentBreakdown.digital)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Other Methods
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(paymentBreakdown.others)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Non-Cash Total
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(nonCashTotal)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ borderRadius: 1 }}>
              Verify the totals above with processor reports before closing the session. Capture any mismatches in the adjustments
              step.
            </Alert>
          </Stack>
        );
      case 'adjustments':
        return (
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setAdjustmentDialog({ open: true, type: 'add' })}>
                    Add Cash
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RemoveIcon />}
                    onClick={() => setAdjustmentDialog({ open: true, type: 'subtract' })}
                  >
                    Subtract Cash
                  </Button>
              <Chip
                label={`Net Impact: ${formatCurrency(adjustmentsNetImpact)}`}
                color={adjustmentsNetImpact === 0 ? 'default' : adjustmentsNetImpact > 0 ? 'success' : 'warning'}
              />
              </Box>
              
              {settlement.adjustments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  No adjustments recorded yet.
                  </Typography>
                </Box>
              ) : (
              <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Reason</TableCell>
                      <TableCell>Recorded</TableCell>
                      <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {settlement.adjustments.map((adjustment) => (
                        <TableRow key={adjustment.id}>
                          <TableCell>
                            <Chip 
                            label={adjustment.type === 'add' ? 'Added' : 'Subtracted'}
                              color={adjustment.type === 'add' ? 'success' : 'error'}
                              size="small"
                            variant="outlined"
                            />
                          </TableCell>
                        <TableCell>{formatCurrency(adjustment.amount)}</TableCell>
                          <TableCell>{adjustment.reason}</TableCell>
                          <TableCell>{new Date(adjustment.timestamp).toLocaleString()}</TableCell>
                        <TableCell align="right">
                            <IconButton 
                              size="small" 
                              color="error"
                            onClick={() =>
                              setSettlement((prev) => ({
                                  ...prev,
                                adjustments: prev.adjustments.filter((a) => a.id !== adjustment.id),
                              }))
                            }
                          >
                            <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
          </Stack>
        );
      case 'handover':
        return (
          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Refunds (Processed)
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(refundTotal)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Settlement Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Capture variance details, handover comments, or instructions for the next shift.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              minRows={4}
              value={settlement.notes}
              onChange={(e) => setSettlement((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Add settlement notes..."
              InputProps={{ sx: { borderRadius: 1 } }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Ensure manager and cashier sign-offs are recorded before completing the settlement.
              </Typography>
                <Button
                  variant="contained"
                onClick={completeSettlement}
                disabled={saving || (settlementValidation && !settlementValidation.allowed)}
                startIcon={saving ? <CircularProgress size={20} /> : <CheckIcon />}
                >
                Complete Settlement
                </Button>
            </Stack>
          </Stack>
        );
      default:
        return null;
    }
  };

  const getTimelineStatusMeta = (status) => {
    switch (status) {
      case 'complete':
        return { label: 'Completed', color: 'success' };
      case 'in-progress':
        return { label: 'In Progress', color: 'primary' };
      case 'in-review':
        return { label: 'Needs Review', color: 'warning' };
      default:
        return { label: 'Pending', color: 'default' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
              </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          background: 'linear-gradient(180deg, #f5f7fa 0%, #eef2f8 40%, #f8fafc 100%)',
          color: theme.palette.text.primary,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            px: { xs: 2, md: 3 },
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            backgroundColor: '#fff',
          }}
        >
          <CashDrawerIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Counter Settlement Timeline
              </Typography>
            <Typography variant="body2" color="text.secondary">
              Guided settlement workflow for shift handover and reconciliation
                  </Typography>
                  </Box>
                  </Box>

        <Box
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: 1120,
            mx: 'auto',
            px: { xs: 1.5, md: 3 },
            py: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              position: 'sticky',
              top: { xs: 0, md: 16 },
              zIndex: 2,
              borderRadius: 2,
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 2.5 },
              borderColor: alpha(theme.palette.primary.main, 0.15),
              boxShadow: '0 16px 32px rgba(15, 23, 42, 0.12)',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={1.5}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Shift {currentShift?.name || currentShift?.id || '—'} • {currentSession?.session_number || currentSession?.id || 'Session'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cashier: {currentSession?.operator?.username || settlement.cashierId || 'Unassigned'} ·{' '}
                  {currentSession?.start_time ? new Date(currentSession.start_time).toLocaleString() : 'Start time unavailable'}
                </Typography>
                  </Box>
              <Chip
                label={settlement.status.toUpperCase()}
                color={getStatusColor(settlement.status)}
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
            </Stack>

            <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
              <Chip
                label={`Terminal: ${currentSession?.terminal?.name || currentSession?.terminal || 'Unassigned'}`}
                variant="outlined"
              />
              <Chip label={`Shift Window: ${currentShift?.start || '--'} → ${currentShift?.end || '--'}`} variant="outlined" />
              <Chip label={`Expected Bills: ${settlement.transactions.length}`} variant="outlined" />
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Expected Cash
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(settlement.expectedCash)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Counted Cash
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(settlement.actualCash)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Non-Cash Total
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(nonCashTotal)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                    Variance
                  </Typography>
                    <Typography 
                      variant="h6" 
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                      color:
                        settlement.difference === 0
                          ? theme.palette.success.main
                          : settlement.difference > 0
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    }}
                  >
                    {formatCurrency(settlement.difference)}
                    </Typography>
                </Paper>
              </Grid>
                </Grid>
                
            {settlementValidation && !settlementValidation.allowed && (
              <Alert severity="error" sx={{ borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Settlement Cannot Proceed
                  </Typography>
                <Typography variant="body2" component="div">
                  {settlementValidation.details?.suspendedBills?.length > 0 && (
                    <Box component="span" display="block">
                      • {settlementValidation.details.suspendedBills.length} suspended bill(s) must be completed first
                    </Box>
                  )}
                  {settlementValidation.details?.partialTransactions?.length > 0 && (
                    <Box component="span" display="block">
                      • {settlementValidation.details.partialTransactions.length} partial transaction(s) must be completed first
                    </Box>
                  )}
                  {!settlementValidation.details?.suspendedBills?.length &&
                    !settlementValidation.details?.partialTransactions?.length && (
                      <Box component="span" display="block">
                        • {settlementValidation.reason || 'Pending transactions must be completed'}
                      </Box>
                    )}
                </Typography>
              </Alert>
            )}
          </Paper>

          <Box
            sx={{
              position: 'relative',
              pl: { xs: 3, md: 6 },
              mt: 1,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: { xs: 8, md: 16 },
                top: 0,
                bottom: 0,
                width: '2px',
                background: `linear-gradient(${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.grey[400], 0.2)})`,
              },
            }}
          >
            {timelineSteps.map((step, index) => {
              const statusMeta = getTimelineStatusMeta(step.status);
              const statusColorValue =
                statusMeta.color !== 'default' && theme.palette[statusMeta.color]
                  ? theme.palette[statusMeta.color].main
                  : theme.palette.grey[400];

              return (
                <Paper
                  key={step.key}
                  variant="outlined"
                  sx={{
                    position: 'relative',
                    ml: { xs: 2.5, md: 5 },
                    mb: index === timelineSteps.length - 1 ? 0 : 3,
                    borderRadius: 2,
                    borderColor: alpha(statusColorValue, 0.3),
                    boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
                    background: '#ffffff',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: { xs: -22, md: -36 },
                      top: 30,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: '4px solid',
                      borderColor: statusColorValue,
                      backgroundColor: '#fff',
                      boxShadow: `0 0 0 6px ${alpha(statusColorValue, 0.18)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 1.5,
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      px: { xs: 2, md: 3 },
                      py: 2,
                      background: `linear-gradient(90deg, ${alpha(statusColorValue, 0.16)}, transparent)`,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.subtitle}
                      </Typography>
              </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={statusMeta.label} color={statusMeta.color === 'default' ? 'default' : statusMeta.color} size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {step.timestamp}
                      </Typography>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>{renderStepContent(step.key)}</Box>
                </Paper>
              );
            })}
          </Box>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 2.5 },
              boxShadow: '0 16px 32px rgba(15, 23, 42, 0.06)',
              backgroundColor: '#ffffff',
            }}
          >
            <Stack spacing={1.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Sign-off Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Cashier Sign-off
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                      {settlement.status === 'completed' ? 'Completed' : 'Pending'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Manager Approval
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                      Pending
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Settlement Code
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                      {settlement.id || '—'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Variance
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 1,
                        fontWeight: 600,
                        color:
                          settlement.difference === 0
                            ? theme.palette.success.main
                            : settlement.difference > 0
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                      }}
                    >
                      {formatCurrency(settlement.difference)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary">
                Attach supporting documents within each step and capture signatures once the manager review is complete.
              </Typography>
            </Stack>
          </Paper>

          <Paper
                variant="outlined"
            sx={{
              borderRadius: 2,
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 2.5 },
              boxShadow: '0 16px 32px rgba(15, 23, 42, 0.06)',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5} alignItems={{ sm: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Settlement History
              </Typography>
              <Button variant="outlined" startIcon={<HistoryIcon />} onClick={loadSettlementHistory}>
                Load History
              </Button>
            </Stack>
            
            {settlementHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  No settlement history found
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Session</TableCell>
                      <TableCell>Expected</TableCell>
                      <TableCell>Actual</TableCell>
                      <TableCell>Difference</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {settlementHistory.map((historyRecord) => (
                      <TableRow key={historyRecord.id}>
                        <TableCell>{historyRecord.endTime ? new Date(historyRecord.endTime).toLocaleDateString() : '—'}</TableCell>
                        <TableCell>{historyRecord.sessionId}</TableCell>
                        <TableCell>{formatCurrency(historyRecord.expectedCash)}</TableCell>
                        <TableCell>{formatCurrency(historyRecord.actualCash)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={formatCurrency(historyRecord.difference)}
                            color={historyRecord.difference === 0 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={historyRecord.status} color={getStatusColor(historyRecord.status)} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>

      <Dialog 
        open={adjustmentDialog.open} 
        onClose={() => {
          setAdjustmentDialog({ open: false, type: 'add' });
          setAdjustmentAmount('');
          setAdjustmentReason('');
        }}
        PaperProps={{ sx: { borderRadius: 0, minWidth: { xs: 280, sm: 400 } } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {adjustmentDialog.type === 'add' ? 'Add Cash' : 'Subtract Cash'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={adjustmentAmount}
            onChange={(e) => setAdjustmentAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
              sx: { borderRadius: 0 },
            }}
            autoFocus
          />
          <TextField
            fullWidth
            label="Reason"
            multiline
            rows={3}
            value={adjustmentReason}
            onChange={(e) => setAdjustmentReason(e.target.value)}
            placeholder="Enter reason for adjustment..."
            InputProps={{ sx: { borderRadius: 0 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
            setAdjustmentDialog({ open: false, type: 'add' });
            setAdjustmentAmount('');
            setAdjustmentReason('');
            }}
            sx={{ borderRadius: 0 }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddAdjustment} sx={{ borderRadius: 0 }}>
            {adjustmentDialog.type === 'add' ? 'Add' : 'Subtract'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 0 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettlementModule;
