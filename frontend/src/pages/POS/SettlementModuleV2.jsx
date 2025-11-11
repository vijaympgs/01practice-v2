import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Grid,
  IconButton,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  AccountBalance as CashDrawerIcon,
  Call as CallIcon,
  QuestionAnswer as HelpIcon,
  Settings as SettingsIcon,
  AccessTime,
  Receipt,
  AccountBalance,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { currencyService } from '../../services/currencyService';
import transactionManager from '../../services/TransactionManager';
import shiftManager from '../../services/ShiftManager';
import sessionManager from '../../services/SessionManager';
import { businessRulesService } from '../../services/businessRulesService';
import api from '../../services/api';

const SettlementModuleV2 = ({ showHeader = true, condensed = false, routePrefix = '/pos' }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [activeStepKey, setActiveStepKey] = useState('cash');

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
  });

  const [adjustmentDialog, setAdjustmentDialog] = useState({ open: false, type: 'add' });
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const [settlementValidation, setSettlementValidation] = useState(null);
  const [settlementSettings, setSettlementSettings] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);
  const [selectedCurrency] = useState('INR');
  const [settlementHistory, setSettlementHistory] = useState([]);
  const [managerSignOff, setManagerSignOff] = useState({
    managerName: '',
    notes: '',
    confirmed: false,
  });
  const [settlementReasons, setSettlementReasons] = useState([]);
  const [varianceReasonId, setVarianceReasonId] = useState('');
  const [interimSettlements, setInterimSettlements] = useState([]);
  const [interimDialog, setInterimDialog] = useState({ open: false });
  const [interimReasonId, setInterimReasonId] = useState('');
  const [interimNotes, setInterimNotes] = useState('');
  const [baseExpectedCash, setBaseExpectedCash] = useState(0);

  useEffect(() => {
    initializeSettlement();
  }, []);

const loadSettlementReasons = async () => {
  try {
    const response = await api.get('/pos-masters/settlement-reasons/', {
      params: {
        is_active: true,
        module_ref: 'POS_OPERATOR_CASHUP',
      },
    });
      const payload = response.data || [];
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : [];
      setSettlementReasons(list);
  } catch (error) {
    console.error('Failed to load settlement reasons:', error);
      setSettlementReasons([]);
  }
};

  const initializeSettlement = async () => {
    try {
      setLoading(true);
      try {
        const settings = await businessRulesService.getSettlementSettings();
        setSettlementSettings(settings);
      } catch (error) {
        console.error('Failed to load settlement settings:', error);
      }

      let session = null;
      try {
        const response = await api.get('/sales/pos-sessions/current/');
        session = response.data;
      } catch (error) {
        session = sessionManager.getCurrentSession();
      }

      const shift = shiftManager.getCurrentShift();

      if (session) {
        setCurrentSession(session);
        setCurrentShift(shift);
        await validateSettlementPreConditions(session.id);

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
        await loadSessionTransactions(session.id);
      } else {
        setSnackbar({ open: true, message: 'No active session found', severity: 'warning' });
      }
      await loadSettlementReasons();
      await loadSettlementHistory();
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
      let transactions = [];
      try {
        const response = await api.get('/sales/sales/', {
          params: {
            session: sessionId,
            page_size: 1000,
          },
        });
        const sales = response.data.results || response.data || [];
        transactions = sales.map((sale) => ({
          id: sale.id,
          saleNumber: sale.sale_number,
          total: parseFloat(sale.total_amount || 0),
          paymentMethod: sale.payment_method || 'cash',
          status: sale.status,
          createdAt: sale.created_at,
        }));
      } catch (error) {
        transactions = await transactionManager.getTransactions({ sessionId });
      }

      const cashTransactions = transactions.filter((t) =>
        t.paymentMethod === 'cash' || t.payment_method === 'cash'
      );
      const expectedCash = cashTransactions.reduce((sum, t) => sum + (t.total || 0), 0);

      setSettlement((prev) => ({
        ...prev,
        transactions: transactions,
        expectedCash: expectedCash,
        closingBalance: prev.openingBalance + expectedCash,
      }));
      setBaseExpectedCash((current) => (current > 0 ? current : expectedCash));
    } catch (error) {
      console.error('Failed to load session transactions:', error);
    }
  };

  const updateDenomination = (denomination, count) => {
    const sanitizedCount = Math.max(0, count);
    setSettlement((prev) => {
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
      type: adjustmentDialog.type,
      amount,
      reason,
      timestamp: new Date().toISOString(),
    };

    setSettlement((prev) => ({
      ...prev,
      adjustments: [...prev.adjustments, adjustment],
    }));

    setAdjustmentDialog({ open: false, type: 'add' });
    setAdjustmentAmount('');
    setAdjustmentReason('');
  };

  const handleOpenInterimDialog = () => {
    const dialogVarianceType = settlement.difference < 0 ? 'shortage' : settlement.difference > 0 ? 'excess' : null;
    let defaultReason = '';
    if (dialogVarianceType === 'shortage' && shortageReasons.length > 0) {
      defaultReason = shortageReasons[0].id;
    } else if (dialogVarianceType === 'excess' && excessReasons.length > 0) {
      defaultReason = excessReasons[0].id;
    }
    setInterimReasonId(defaultReason);
    setInterimNotes('');
    setInterimDialog({ open: true, varianceType: dialogVarianceType });
  };

  const handleCloseInterimDialog = () => {
    setInterimDialog({ open: false });
  };

  const handleConfirmInterimSettlement = () => {
    const interimAmount = settlement.actualCash;
    const varianceTypeForInterim = interimDialog.varianceType;
    const reasonRequired = varianceTypeForInterim === 'shortage' || varianceTypeForInterim === 'excess';

    if (interimAmount <= 0) {
      setSnackbar({ open: true, message: 'Count cash before recording an interim settlement.', severity: 'warning' });
      return;
    }

    if (reasonRequired && !interimReasonId) {
      setSnackbar({ open: true, message: 'Select a variance reason before recording the interim settlement.', severity: 'warning' });
      return;
    }

    const nextSequence = interimSettlements.length + 1;
    const reasonRecord = settlementReasons.find((reason) => reason.id === interimReasonId);
    const denominationSnapshot = Object.fromEntries(
      Object.entries(settlement.denominations).map(([key, value]) => [key, { ...value }])
    );

    const snapshot = {
      id: Date.now().toString(),
      sequence: nextSequence,
      amount: interimAmount,
      variance: settlement.difference,
      reasonId: interimReasonId || null,
      reasonName: reasonRecord?.name || '',
      reasonType: reasonRecord?.reason_type || '',
      notes: interimNotes.trim(),
      timestamp: new Date().toISOString(),
      denominations: denominationSnapshot,
    };

    setInterimSettlements((prev) => [...prev, snapshot]);
    setSettlement((prev) => {
      const clearedDenominations = Object.keys(prev.denominations).reduce((acc, key) => {
        acc[key] = { count: 0, amount: 0 };
        return acc;
      }, {});
      const remainingExpectedCash = Math.max(prev.expectedCash - interimAmount, 0);
      return {
        ...prev,
        denominations: clearedDenominations,
        actualCash: 0,
        expectedCash: remainingExpectedCash,
        closingBalance: prev.openingBalance + remainingExpectedCash,
        difference: 0,
      };
    });
    setVarianceReasonId('');
    setInterimDialog({ open: false });
    setInterimReasonId('');
    setInterimNotes('');
    setSnackbar({
      open: true,
      message: `Interim settlement #${nextSequence} recorded.`,
      severity: 'success',
    });
  };

  const completeSettlement = async () => {
    try {
      if ((varianceType === 'shortage' || varianceType === 'excess') && !varianceReasonId) {
        setSnackbar({
          open: true,
          message: 'Select a variance reason before completing the settlement.',
          severity: 'warning',
        });
        return;
      }

      setSaving(true);
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
        interimSettlements,
        varianceReasonId,
        totalExpected,
        totalCounted,
      };

      if (currentSession) {
        try {
          const settlementData = {
            closing_cash: totalCounted,
            total_counted_cash: totalCounted,
            denominations: settlement.denominations,
            expected_cash: settlement.expectedCash,
            total_expected_cash: totalExpected,
            actual_cash: settlement.actualCash,
            variance: settlement.difference,
            adjustments: settlement.adjustments,
            notes: settlement.notes,
            settlement_completed: true,
            interim_settlements: interimSettlements,
            variance_reason_id: varianceReasonId || null,
          };

          await api.post(`/sales/pos-sessions/${currentSession.id}/close/`, settlementData);
          await sessionManager.updateSessionSettlement(currentSession.id, {
            totalExpectedCash: totalExpected,
            totalCountedCash: totalCounted,
            remainingExpectedCash: settlement.expectedCash,
            currentActualCash: settlement.actualCash,
            variance: settlement.difference,
            denominations: settlement.denominations,
            adjustments: settlement.adjustments,
            interimSettlements,
            varianceReasonId,
          });
        } catch (error) {
          console.error('Failed to close session via API:', error);
          await sessionManager.closeSession({
            closingCash: totalCounted,
            totalCountedCash: totalCounted,
            totalExpectedCash: totalExpected,
            settlementCompleted: true,
            settlementData: completedSettlement,
            interimSettlements,
          });
        }
      }

      await saveSettlement(completedSettlement);
      setSnackbar({
        open: true,
        message: 'Settlement completed successfully! Redirecting to Day Close...',
        severity: 'success',
      });
      setInterimSettlements([]);
      setTimeout(() => {
        navigate(`${routePrefix}/day-close`);
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
      const settlements = JSON.parse(localStorage.getItem('settlements') || '[]');
      settlements.push({
        ...settlementData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('settlements', JSON.stringify(settlements));
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

  const formatCurrency = (amount) => currencyService.formatCurrency(amount, selectedCurrency);
  const getCurrencySymbol = () => currencyService.getCurrencySymbol(selectedCurrency);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      completed: 'success',
      verified: 'info',
    };
    return colors[status] || 'default';
  };

  const shortageReasons = useMemo(
    () => settlementReasons.filter((reason) => reason.reason_type === 'shortage'),
    [settlementReasons]
  );
  const excessReasons = useMemo(
    () => settlementReasons.filter((reason) => reason.reason_type === 'excess'),
    [settlementReasons]
  );
  const interimTotal = useMemo(
    () => interimSettlements.reduce((sum, entry) => sum + (entry.amount || 0), 0),
    [interimSettlements]
  );
  const totalCounted = useMemo(
    () => interimTotal + settlement.actualCash,
    [interimTotal, settlement.actualCash]
  );
  const varianceType = settlement.difference < 0 ? 'shortage' : settlement.difference > 0 ? 'excess' : null;
  const totalExpected = baseExpectedCash;

  const paymentBreakdown = useMemo(() => (
    settlement.transactions.reduce(
      (acc, transaction) => {
        const method = (transaction.paymentMethod || transaction.payment_method || '').toLowerCase();
        const total = parseFloat(transaction.total || 0);
        if (method.includes('cash')) acc.cash += total;
        else if (method.includes('card')) acc.card += total;
        else if (method.includes('upi') || method.includes('wallet') || method.includes('digital') || method.includes('online')) acc.digital += total;
        else acc.others += total;
        return acc;
      },
      { cash: 0, card: 0, digital: 0, others: 0 }
    )
  ), [settlement.transactions]);

  const adjustmentsNetImpact = useMemo(() => (
    settlement.adjustments.reduce((sum, adjustment) => adjustment.type === 'add' ? sum + adjustment.amount : sum - adjustment.amount, 0)
  ), [settlement.adjustments]);

  const refundTotal = useMemo(() => (
    settlement.refunds.reduce((sum, refund) => sum + parseFloat(refund.amount || 0), 0)
  ), [settlement.refunds]);

  useEffect(() => {
    if (!varianceType) {
      setVarianceReasonId('');
      return;
    }
    const options = varianceType === 'shortage' ? shortageReasons : excessReasons;
    if (!options.length) {
      setVarianceReasonId('');
      return;
    }
    setVarianceReasonId((current) => {
      if (current && options.some((option) => option.id === current)) {
        return current;
      }
      return options[0].id;
    });
  }, [varianceType, shortageReasons, excessReasons]);

  const nonCashTotal = paymentBreakdown.card + paymentBreakdown.digital + paymentBreakdown.others;

  const varianceReasonRequired = varianceType === 'shortage' || varianceType === 'excess';
  const completeBlockedByValidation = settlementValidation && !settlementValidation.allowed;
  const varianceReasonMissing = varianceReasonRequired && !varianceReasonId;
  const completeDisabled = saving || completeBlockedByValidation || varianceReasonMissing;
  const interimDisabled = settlement.actualCash <= 0;
  const currentVarianceReasonOptions = varianceType === 'shortage'
    ? shortageReasons
    : varianceType === 'excess'
      ? excessReasons
      : [];

  const cashStepCompleted = settlement.actualCash > 0;
  const cardStepCompleted = nonCashTotal > 0;
  const adjustmentsStepCompleted = settlement.adjustments.length > 0;
  const signoffStepCompleted = settlement.status === 'completed';

  const timelineSteps = useMemo(() => ([
    {
      key: 'cash',
      title: 'Cash Drawer Count',
      subtitle: 'Count and verify physical cash by denomination',
      icon: <AccountBalance fontSize="small" />, 
      status: cashStepCompleted ? 'complete' : 'in-progress',
      caption: settlement.startTime ? new Date(settlement.startTime).toLocaleTimeString() : 'Not started',
    },
    {
      key: 'card',
      title: 'Card & Digital Checks',
      subtitle: 'Match processor totals for cards, UPI & wallets',
      icon: <Receipt fontSize="small" />,
      status: cardStepCompleted ? 'complete' : 'pending',
      caption: cardStepCompleted ? 'Ready for verification' : 'Pending',
    },
    {
      key: 'adjustments',
      title: 'Adjustments & Drops',
      subtitle: 'Record discounts, refunds and cash drops',
      icon: <SettingsIcon fontSize="small" />,
      status: adjustmentsStepCompleted ? 'in-review' : 'pending',
      caption: `${settlement.adjustments.length} record(s)`,
    },
    {
      key: 'handover',
      title: 'Manager Handover',
      subtitle: 'Capture notes and complete sign-off',
      icon: <AccessTime fontSize="small" />,
      status: signoffStepCompleted ? 'complete' : 'pending',
      caption: signoffStepCompleted ? 'Completed' : 'Awaiting sign-off',
    },
  ]), [cashStepCompleted, cardStepCompleted, adjustmentsStepCompleted, signoffStepCompleted, settlement.adjustments.length, settlement.startTime, settlement.status]);

  const renderStepContent = () => {
    switch (activeStepKey) {
      case 'cash':
        return (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              {[
                { label: 'Opening Float', value: formatCurrency(settlement.openingBalance) },
                { label: 'Expected Cash', value: formatCurrency(settlement.expectedCash) },
                { label: 'Counted Cash', value: formatCurrency(settlement.actualCash) },
                {
                  label: 'Variance',
                  value: formatCurrency(settlement.difference),
                  color: settlement.difference === 0 ? theme.palette.success.main : theme.palette.warning.main,
                },
              ].map((metric) => (
                <Grid item xs={12} md={3} key={metric.label}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: alpha(theme.palette.primary.main, 0.12),
                      background: alpha(theme.palette.primary.main, 0.04),
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600, color: metric.color || 'inherit' }}>
                      {metric.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={1.5}>
              {Object.entries(settlement.denominations).map(([denomination, data]) => (
                <Grid item xs={6} sm={3} md={2} key={denomination}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      borderColor: alpha(theme.palette.grey[500], 0.24),
                      backgroundColor: theme.palette.background.paper,
                      display: 'grid',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {`${getCurrencySymbol()}${denomination}`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                      <IconButton size="small" onClick={() => updateDenomination(denomination, data.count - 1)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data.count}
                      </Typography>
                      <IconButton size="small" onClick={() => updateDenomination(denomination, data.count + 1)}>
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
          </Stack>
        );
      case 'card':
        return (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              {[
                { label: 'Card Payments', value: formatCurrency(paymentBreakdown.card) },
                { label: 'UPI & Wallets', value: formatCurrency(paymentBreakdown.digital) },
                { label: 'Other Methods', value: formatCurrency(paymentBreakdown.others) },
                { label: 'Non-Cash Total', value: formatCurrency(nonCashTotal) },
              ].map((metric) => (
                <Grid item xs={12} md={3} key={metric.label}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: alpha(theme.palette.secondary.main, 0.2),
                      background: alpha(theme.palette.secondary.main, 0.06),
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                      {metric.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Verify these totals against processor reports. Capture any mismatches as adjustments before closing the session.
            </Alert>
          </Stack>
        );
      case 'adjustments':
        return (
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAdjustmentDialog({ open: true, type: 'add' })}
              >
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
                variant="outlined"
              />
            </Box>

            {settlement.adjustments.length === 0 ? (
              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, py: 6, display: 'grid', placeItems: 'center', color: 'text.secondary' }}
              >
                No adjustments recorded.
              </Paper>
            ) : (
              <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}
              >
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
                            size="small"
                            label={adjustment.type === 'add' ? 'Added' : 'Subtracted'}
                            color={adjustment.type === 'add' ? 'success' : 'error'}
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
                            onClick={() => setSettlement((prev) => ({
                              ...prev,
                              adjustments: prev.adjustments.filter((a) => a.id !== adjustment.id),
                            }))}
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
      default:
        return (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Refunds Processed
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(refundTotal)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Settlement Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Summarize variance, handover details, or next shift instructions.
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
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            {interimSettlements.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Interim Settlements
                </Typography>
                <List dense disablePadding>
                  {interimSettlements.map((entry) => (
                    <ListItem key={entry.id} disableGutters sx={{ py: 0.4 }}>
                      <ListItemText
                        primary={`Interim ${entry.sequence} • ${formatCurrency(entry.amount)}`}
                        secondary={[
                          new Date(entry.timestamp).toLocaleString(),
                          entry.reasonName,
                          entry.variance ? `Variance: ${formatCurrency(entry.variance)}` : null,
                        ].filter(Boolean).join(' • ')}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                Ensure cashier & manager sign-offs are captured before completion.
              </Typography>
              <Button
                variant="contained"
                onClick={completeSettlement}
                disabled={completeDisabled}
                startIcon={saving ? <CircularProgress size={20} /> : <AccountBalance />}
              >
                Complete Settlement
              </Button>
            </Stack>
          </Stack>
        );
    }
  };

  const varianceDisplayColor = settlement.difference === 0
    ? theme.palette.success.main
    : settlement.difference > 0
      ? theme.palette.info.main
      : theme.palette.warning.main;

  const metrics = [
    {
      label: 'Total Expected',
      value: formatCurrency(totalExpected),
    },
    {
      label: 'Interim Settled',
      value: `${formatCurrency(interimTotal)}${interimSettlements.length ? ` (${interimSettlements.length})` : ''}`,
    },
    {
      label: 'Expected Remaining',
      value: formatCurrency(settlement.expectedCash),
    },
    {
      label: 'Total Counted',
      value: formatCurrency(totalCounted),
    },
    {
      label: 'Counted (Current)',
      value: formatCurrency(settlement.actualCash),
    },
    {
      label: 'Variance',
      value: formatCurrency(settlement.difference),
      valueColor: varianceDisplayColor,
    },
  ];

  const interimDialogReasons = interimDialog.varianceType === 'shortage'
    ? shortageReasons
    : interimDialog.varianceType === 'excess'
      ? excessReasons
      : [];
  const interimRequiresReason = interimDialog.varianceType === 'shortage' || interimDialog.varianceType === 'excess';
  const interimDialogDisabled = settlement.actualCash <= 0 || (interimRequiresReason && !interimReasonId);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: condensed ? 200 : '70vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: condensed ? 'transparent' : theme.palette.grey[50],
        minHeight: condensed ? 'auto' : '100vh',
        py: condensed ? 0 : { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 2, md: showHeader ? 3 : 2 },
          display: 'flex',
          flexDirection: 'column',
          gap: condensed ? 2 : 3,
        }}
      >
        {showHeader && (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: { xs: 2, md: 3 },
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              bgcolor: 'background.paper',
            }}
          >
            <CashDrawerIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Settlement • Shift {currentShift?.name || currentShift?.id || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Session {currentSession?.session_number || currentSession?.id || '—'} • Cashier{' '}
                {currentSession?.operator?.username || settlement.cashierId || '—'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={settlement.status.toUpperCase()} color={getStatusColor(settlement.status)} />
              <Tooltip title="Open documentation">
                <IconButton size="small">
                  <LaunchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Call manager">
                <IconButton size="small">
                  <CallIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        )}

        <Grid
          container
          sx={{
            flex: condensed ? 'unset' : 1,
            gap: { xs: 2, md: condensed ? 2 : 3 },
          }}
        >
          <Grid item xs={12} md={condensed ? 4 : 3}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: condensed ? 1 : 3,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: condensed ? 1 : 1.5,
                background: alpha(theme.palette.background.paper, condensed ? 1 : 0.9),
                boxShadow: condensed ? 'none' : '0 28px 60px rgba(15, 23, 42, 0.12)',
                position: condensed ? 'relative' : 'sticky',
                top: condensed ? 'auto' : 96,
                maxHeight: condensed ? 440 : 'none',
                overflowY: condensed ? 'auto' : 'visible',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 1 }}>
                Settlement Timeline
              </Typography>
              <Stack spacing={condensed ? 1 : 1.5}>
                {timelineSteps.map((step) => {
                  const isActive = step.key === activeStepKey;
                  const statusColor = step.status === 'complete'
                    ? theme.palette.success.main
                    : step.status === 'in-progress'
                      ? theme.palette.primary.main
                      : step.status === 'in-review'
                        ? theme.palette.warning.main
                        : theme.palette.grey[500];

                  return (
                    <Paper
                      key={step.key}
                      variant="outlined"
                      onClick={() => setActiveStepKey(step.key)}
                      sx={{
                        p: condensed ? 1.25 : 1.5,
                        borderRadius: condensed ? 1 : 2,
                        borderColor: isActive
                          ? alpha(theme.palette.primary.main, 0.6)
                          : alpha(theme.palette.divider, 0.6),
                        background: isActive
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.background.paper, condensed ? 1 : 0.9),
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive
                          ? `0 16px 36px ${alpha(theme.palette.primary.main, 0.2)}`
                          : condensed
                            ? 'none'
                            : '0 8px 18px rgba(15, 23, 42, 0.08)',
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: condensed ? 32 : 36,
                            height: condensed ? 32 : 36,
                            borderRadius: condensed ? 1 : 2,
                            background: alpha(statusColor, 0.15),
                            color: statusColor,
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {step.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: isActive ? 700 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {step.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {step.subtitle}
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ my: condensed ? 1 : 1.5, borderStyle: condensed ? 'solid' : 'dashed' }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                          size="small"
                          label={step.caption}
                          sx={{ borderRadius: 99 }}
                        />
                        <Chip
                          size="small"
                          label={
                            step.status === 'complete'
                              ? 'Done'
                              : step.status === 'in-progress'
                                ? 'In progress'
                                : step.status === 'in-review'
                                  ? 'Review'
                                  : 'Pending'
                          }
                          color={
                            step.status === 'complete'
                              ? 'success'
                              : step.status === 'in-progress'
                                ? 'primary'
                                : step.status === 'in-review'
                                  ? 'warning'
                                  : 'default'
                          }
                          variant={isActive ? 'filled' : 'outlined'}
                          sx={{ borderRadius: 99 }}
                        />
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={condensed ? 8 : 9}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: condensed ? 1 : 3,
                p: { xs: 2, md: condensed ? 2 : 3 },
                minHeight: condensed ? 'auto' : 520,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                background: theme.palette.background.paper,
                boxShadow: condensed ? 'none' : '0 28px 60px rgba(15, 23, 42, 0.08)',
                overflow: condensed ? 'auto' : 'hidden',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {timelineSteps.find((step) => step.key === activeStepKey)?.title || 'Settlement'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip label={`Expected: ${formatCurrency(settlement.expectedCash)}`} variant="outlined" size="small" />
                  <Chip label={`Counted: ${formatCurrency(settlement.actualCash)}`} variant="outlined" size="small" />
                  <Chip
                    label={`Variance: ${formatCurrency(settlement.difference)}`}
                    color={settlement.difference === 0 ? 'success' : 'warning'}
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </Stack>

              <Divider sx={{ borderStyle: condensed ? 'solid' : 'dashed' }} />

              {renderStepContent()}
            </Paper>
          </Grid>
        </Grid>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            bgcolor: 'background.paper',
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={{ xs: 2, lg: 3 }}
            justifyContent="space-between"
            alignItems={{ lg: 'center' }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 1.5, md: 2.5 }}
              flexWrap="wrap"
            >
              {metrics.map((metric) => (
                <Box key={metric.label} sx={{ minWidth: { xs: '100%', sm: 160 } }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
                  >
                    {metric.label}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: metric.valueColor || 'inherit' }}
                  >
                    {metric.value}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 1.5, md: 2 }}
              alignItems={{ md: 'center' }}
            >
              {varianceReasonRequired && currentVarianceReasonOptions.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Variance Reason</InputLabel>
                  <Select
                    label="Variance Reason"
                    value={varianceReasonId}
                    onChange={(event) => setVarianceReasonId(event.target.value)}
                  >
                    {currentVarianceReasonOptions.map((reason) => (
                      <MenuItem key={reason.id} value={reason.id}>
                        {reason.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select reason for the {varianceType === 'shortage' ? 'shortage' : 'excess'}.
                  </FormHelperText>
                </FormControl>
              )}

              {varianceReasonRequired && currentVarianceReasonOptions.length === 0 && (
                <Alert severity="warning" sx={{ borderRadius: 1 }}>
                  Configure {varianceType === 'shortage' ? 'shortage' : 'excess'} reasons to track variance.
                </Alert>
              )}

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  size={condensed ? 'small' : 'medium'}
                  onClick={handleOpenInterimDialog}
                  disabled={interimDisabled || saving}
                >
                  Interim Settlement
                </Button>
                <Button
                  variant="contained"
                  size={condensed ? 'small' : 'medium'}
                  onClick={completeSettlement}
                  disabled={completeDisabled}
                  startIcon={saving ? <CircularProgress size={18} /> : <AccountBalance fontSize="small" />}
                >
                  {saving ? 'Completing…' : 'Complete Settlement'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Box>
      <Dialog
        open={Boolean(interimDialog.open)}
        onClose={handleCloseInterimDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Record Interim Settlement</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2">
              This will log the counted cash and reset the drawer for continued billing while preserving denomination details.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Counted Cash
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatCurrency(settlement.actualCash)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Variance
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: varianceDisplayColor }}>
                  {formatCurrency(settlement.difference)}
                </Typography>
              </Box>
            </Stack>
            {interimRequiresReason && (
              <FormControl size="small" fullWidth>
                <InputLabel>Variance Reason</InputLabel>
                <Select
                  label="Variance Reason"
                  value={interimReasonId}
                  onChange={(event) => setInterimReasonId(event.target.value)}
                >
                  {interimDialogReasons.map((reason) => (
                    <MenuItem key={reason.id} value={reason.id}>
                      {reason.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Select reason for the {interimDialog.varianceType === 'shortage' ? 'shortage' : 'excess'}.
                </FormHelperText>
              </FormControl>
            )}
            <TextField
              label="Notes"
              value={interimNotes}
              onChange={(event) => setInterimNotes(event.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInterimDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmInterimSettlement}
            variant="contained"
            disabled={interimDialogDisabled}
          >
            Record Interim
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 1 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettlementModuleV2;
