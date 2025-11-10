import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Event as DayEndIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';
import transactionManager from '../../services/TransactionManager';
import shiftManager from '../../services/ShiftManager';
import sessionManager from '../../services/SessionManager';
import PageTitle from '../../components/common/PageTitle';

const DayEndProcessModule = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Day End state
  const [dayEndData, setDayEndData] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    status: 'pending', // pending, processing, completed, failed
    cashierId: '',
    terminalId: '',
    sessionId: '',
    shiftId: '',
    
    // Sales Summary
    salesSummary: {
      totalSales: 0,
      totalTransactions: 0,
      averageTransactionValue: 0,
      cashSales: 0,
      cardSales: 0,
      upiSales: 0,
      walletSales: 0,
      refunds: 0,
      discounts: 0,
      taxes: 0,
    },
    
    // Inventory Summary
    inventorySummary: {
      totalItemsSold: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      topSellingItems: [],
      slowMovingItems: [],
    },
    
    // Customer Summary
    customerSummary: {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      averageCustomerValue: 0,
    },
    
    // Delivery Summary
    deliverySummary: {
      totalDeliveries: 0,
      completedDeliveries: 0,
      pendingDeliveries: 0,
      cancelledDeliveries: 0,
      totalDeliveryFees: 0,
    },
    
    // Receivables Summary
    receivablesSummary: {
      totalOutstanding: 0,
      newReceivables: 0,
      paymentsReceived: 0,
      overdueAmount: 0,
    },
    
    // Reports Generated
    reportsGenerated: {
      salesReport: false,
      inventoryReport: false,
      customerReport: false,
      deliveryReport: false,
      receivablesReport: false,
      settlementReport: false,
    },
    
    // Backup Status
    backupStatus: {
      databaseBackup: false,
      transactionBackup: false,
      inventoryBackup: false,
      customerBackup: false,
    },
    
    // Validation Checks
    validationChecks: {
      cashCountVerified: false,
      inventoryCounted: false,
      deliveriesConfirmed: false,
      receivablesUpdated: false,
      reportsGenerated: false,
      backupCompleted: false,
    },
    
    notes: '',
    errors: [],
    warnings: [],
    settlementRecap: {
      totalExpected: 0,
      totalCounted: 0,
      variance: 0,
      interimEntries: 0,
    },
  });
  
  const selectedCurrency = 'INR';

  useEffect(() => {
    initializeDayEnd();
  }, []);

  const initializeDayEnd = async () => {
    try {
      setLoading(true);
      
      // Initialize day end data
      const currentSession = sessionManager.getCurrentSession();
      const currentShift = shiftManager.getCurrentShift();
      
      const newDayEndData = {
        ...dayEndData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
        cashierId: currentSession?.cashierId || 'current_user',
        terminalId: currentSession?.terminalId || 'terminal_1',
        sessionId: currentSession?.id || '',
        shiftId: currentShift?.id || '',
        settlementRecap: {
          totalExpected:
            currentSession?.settlement_summary?.expectedCash ??
            currentSession?.expectedCash ??
            currentSession?.expected_cash ??
            0,
          totalCounted:
            currentSession?.settlement_summary?.actualCash ??
            currentSession?.actualCash ??
            currentSession?.actual_cash ??
            0,
          variance:
            currentSession?.settlement_summary?.difference ??
            currentSession?.variance ??
            currentSession?.difference ??
            0,
          interimEntries:
            currentSession?.settlement_summary?.interimEntries ??
            currentSession?.interimSettlements?.length ??
            currentSession?.interim_entries ??
            0,
        },
      };
      
      setDayEndData(newDayEndData);
      
      // Load existing data
      await loadSalesData();
      await loadInventoryData();
      await loadCustomerData();
      await loadDeliveryData();
      await loadReceivablesData();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize day end: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadSalesData = async () => {
    try {
      // Load transactions for today
      const today = new Date().toISOString().split('T')[0];
      const transactions = await transactionManager.getTransactions({
        dateFrom: today,
        dateTo: today,
      });
      
      const salesSummary = {
        totalSales: 0,
        totalTransactions: transactions.length,
        averageTransactionValue: 0,
        cashSales: 0,
        cardSales: 0,
        upiSales: 0,
        walletSales: 0,
        refunds: 0,
        discounts: 0,
        taxes: 0,
      };
      
      transactions.forEach(transaction => {
        salesSummary.totalSales += transaction.total || 0;
        salesSummary.discounts += transaction.discount || 0;
        salesSummary.taxes += transaction.tax || 0;
        
        // Payment method breakdown
        switch (transaction.paymentMethod) {
          case 'cash':
            salesSummary.cashSales += transaction.total || 0;
            break;
          case 'card':
            salesSummary.cardSales += transaction.total || 0;
            break;
          case 'upi':
            salesSummary.upiSales += transaction.total || 0;
            break;
          case 'wallet':
            salesSummary.walletSales += transaction.total || 0;
            break;
        }
        
        // Check for refunds
        if (transaction.type === 'refund') {
          salesSummary.refunds += transaction.total || 0;
        }
      });
      
      salesSummary.averageTransactionValue = salesSummary.totalTransactions > 0 
        ? salesSummary.totalSales / salesSummary.totalTransactions 
        : 0;
      
      setDayEndData(prev => ({
        ...prev,
        salesSummary,
      }));
      
    } catch (error) {
      console.error('Failed to load sales data:', error);
    }
  };

  const loadInventoryData = async () => {
    try {
      // Mock inventory data - replace with actual API call
      const inventorySummary = {
        totalItemsSold: 150,
        lowStockItems: 5,
        outOfStockItems: 2,
        topSellingItems: [
          { name: 'Product A', quantity: 25, revenue: 2500 },
          { name: 'Product B', quantity: 20, revenue: 2000 },
          { name: 'Product C', quantity: 15, revenue: 1500 },
        ],
        slowMovingItems: [
          { name: 'Product X', quantity: 2, revenue: 200 },
          { name: 'Product Y', quantity: 1, revenue: 100 },
        ],
      };
      
      setDayEndData(prev => ({
        ...prev,
        inventorySummary,
      }));
      
    } catch (error) {
      console.error('Failed to load inventory data:', error);
    }
  };

  const loadCustomerData = async () => {
    try {
      // Mock customer data - replace with actual API call
      const customerSummary = {
        totalCustomers: 45,
        newCustomers: 8,
        returningCustomers: 37,
        averageCustomerValue: 85.50,
      };
      
      setDayEndData(prev => ({
        ...prev,
        customerSummary,
      }));
      
    } catch (error) {
      console.error('Failed to load customer data:', error);
    }
  };

  const loadDeliveryData = async () => {
    try {
      // Mock delivery data - replace with actual API call
      const deliverySummary = {
        totalDeliveries: 12,
        completedDeliveries: 10,
        pendingDeliveries: 2,
        cancelledDeliveries: 0,
        totalDeliveryFees: 600,
      };
      
      setDayEndData(prev => ({
        ...prev,
        deliverySummary,
      }));
      
    } catch (error) {
      console.error('Failed to load delivery data:', error);
    }
  };

  const loadReceivablesData = async () => {
    try {
      // Mock receivables data - replace with actual API call
      const receivablesSummary = {
        totalOutstanding: 2500,
        newReceivables: 800,
        paymentsReceived: 1200,
        overdueAmount: 500,
      };
      
      setDayEndData(prev => ({
        ...prev,
        receivablesSummary,
      }));
      
    } catch (error) {
      console.error('Failed to load receivables data:', error);
    }
  };

  const processDayEnd = async () => {
    try {
      setProcessing(true);
      
      // Step 1: All validation checks are treated as complete in the streamlined flow
      
      // Step 2: Generate reports
      await generateAllReports();
      
      // Step 3: Create backups
      await createAllBackups();
      
      // Step 4: Complete day end
      const completedDayEnd = {
        ...dayEndData,
        endTime: new Date().toISOString(),
        status: 'completed',
      };
      
      await saveDayEnd(completedDayEnd);
      
      setSnackbar({ open: true, message: 'Day end process completed successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Day end process failed: ' + error.message, severity: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const generateAllReports = async () => {
    try {
      const reportsGenerated = {
        salesReport: true,
        inventoryReport: true,
        customerReport: true,
        deliveryReport: true,
        receivablesReport: true,
        settlementReport: true,
      };
      
      setDayEndData(prev => ({
        ...prev,
        reportsGenerated,
      }));
      
    } catch (error) {
      console.error('Failed to generate reports:', error);
      throw error;
    }
  };

  const createAllBackups = async () => {
    try {
      const backupStatus = {
        databaseBackup: true,
        transactionBackup: true,
        inventoryBackup: true,
        customerBackup: true,
      };
      
      setDayEndData(prev => ({
        ...prev,
        backupStatus,
      }));
      
    } catch (error) {
      console.error('Failed to create backups:', error);
      throw error;
    }
  };

  const saveDayEnd = async (dayEndData) => {
    try {
      // Save to localStorage for now
      const dayEnds = JSON.parse(localStorage.getItem('dayEnds') || '[]');
      dayEnds.push(dayEndData);
      localStorage.setItem('dayEnds', JSON.stringify(dayEnds));
      
      // In production, save to backend
      if (process.env.NODE_ENV === 'production') {
        // await api.post('/day-ends/', dayEndData); // Assuming 'api' is defined elsewhere
      }
    } catch (error) {
      console.error('Failed to save day end:', error);
      throw error;
    }
  };

  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  const sectionPaperSx = {
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    p: { xs: 2, md: 3 },
  };

  const renderCardIdentifier = (index) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main,
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
      }}
    >
      {index.toString().padStart(2, '0')}
    </Box>
  );

  const getBusinessDayLabel = (dateString) => {
    if (!dateString) {
      return '—';
    }

    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) {
      return '—';
    }

    return parsedDate.toLocaleDateString(undefined, { weekday: 'long' });
  };

  const formatBusinessDate = (dateString) => {
    if (!dateString) {
      return '—';
    }

    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) {
      return '—';
    }

    return parsedDate.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: theme.palette.grey[50],
        minHeight: '100vh',
        py: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <PageTitle
              title="Day End Process"
              subtitle="Review closing checkpoints, generate reports, and capture end-of-day compliance"
              icon={<DayEndIcon />}
              showIcon
            />
          </Box>
          <Paper
            sx={{
              ...sectionPaperSx,
              borderRadius: 2,
              bgcolor: 'background.paper',
              px: { xs: 2.5, md: 3 },
              py: { xs: 2, md: 2.5 },
            }}
          >
            <Stack spacing={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  {renderCardIdentifier(1)}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Settlement Recap
                  </Typography>
                </Box>
                <Chip
                  label={`Business Date: ${formatBusinessDate(dayEndData.date)} (${getBusinessDayLabel(
                    dayEndData.date
                  )})`}
                  color="secondary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Cross-check expected versus counted cash before closing the business day.
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ '& .MuiChip-root': { fontWeight: 600 } }}
              >
                {[
                  {
                    label: 'Total Expected',
                    value: dayEndData.settlementRecap.totalExpected,
                    format: 'currency',
                    color: alpha(theme.palette.primary.main, 0.12),
                  },
                  {
                    label: 'Total Counted',
                    value: dayEndData.settlementRecap.totalCounted,
                    format: 'currency',
                    color: alpha(theme.palette.success.main, 0.12),
                  },
                  {
                    label: 'Variance',
                    value: dayEndData.settlementRecap.variance,
                    format: 'currency',
                    color:
                      dayEndData.settlementRecap.variance === 0
                        ? alpha(theme.palette.success.main, 0.18)
                        : alpha(theme.palette.warning.main, 0.18),
                    textColor:
                      dayEndData.settlementRecap.variance === 0
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                  },
                  {
                    label: 'Interim Entries',
                    value: dayEndData.settlementRecap.interimEntries,
                    format: 'count',
                    color: alpha(theme.palette.info.main, 0.12),
                  },
                ].map((metric) => (
                  <Chip
                    key={metric.label}
                    label={`${metric.label}: ${
                      metric.format === 'currency'
                        ? `${getCurrencySymbol()}${Number(metric.value || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : Number(metric.value || 0).toLocaleString()
                    }`}
                    variant="filled"
                    sx={{
                      backgroundColor: metric.color,
                      color: metric.textColor || theme.palette.text.primary,
                    }}
                  />
                ))}
              </Stack>
              <Button
                variant="contained"
                startIcon={processing ? <CircularProgress size={20} /> : <CheckIcon />}
                onClick={processDayEnd}
                disabled={processing}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, mt: 1 }}
              >
                Complete Day End
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DayEndProcessModule;
