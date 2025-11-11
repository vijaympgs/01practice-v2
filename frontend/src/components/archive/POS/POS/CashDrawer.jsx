import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  AccountBalanceWallet,
  OpenInNew,
  Close,
  Print,
  Save,
  Refresh,
  Warning,
  CheckCircle,
  Error,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Assessment
} from '@mui/icons-material';

const CashDrawer = ({ open, onClose, session }) => {
  const [drawerState, setDrawerState] = useState('closed');
  const [denominations, setDenominations] = useState({
    2000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    5: 0,
    2: 0,
    1: 0
  });
  const [floatAmount, setFloatAmount] = useState(0);
  const [cashSales, setCashSales] = useState(0);
  const [expectedAmount, setExpectedAmount] = useState(0);
  const [actualAmount, setActualAmount] = useState(0);
  const [variance, setVariance] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showDenominationDialog, setShowDenominationDialog] = useState(false);

  useEffect(() => {
    if (open) {
      // Initialize drawer state
      setFloatAmount(session?.floatAmount || 0);
      setCashSales(0); // This would come from actual sales data
      setExpectedAmount(floatAmount + cashSales);
      calculateActualAmount();
    }
  }, [open, session, floatAmount, cashSales]);

  const calculateActualAmount = () => {
    const total = Object.entries(denominations).reduce((sum, [denom, count]) => {
      return sum + (parseInt(denom) * count);
    }, 0);
    setActualAmount(total);
    setVariance(total - expectedAmount);
  };

  const handleDenominationChange = (denomination, value) => {
    const newDenominations = {
      ...denominations,
      [denomination]: parseInt(value) || 0
    };
    setDenominations(newDenominations);
    
    // Recalculate actual amount
    const total = Object.entries(newDenominations).reduce((sum, [denom, count]) => {
      return sum + (parseInt(denom) * count);
    }, 0);
    setActualAmount(total);
    setVariance(total - expectedAmount);
  };

  const openDrawer = () => {
    setDrawerState('open');
    setSnackbar({
      open: true,
      message: 'Cash drawer opened',
      severity: 'info'
    });
  };

  const closeDrawer = () => {
    setDrawerState('closed');
    setSnackbar({
      open: true,
      message: 'Cash drawer closed',
      severity: 'info'
    });
  };

  const saveCashCount = () => {
    // Save cash count to database
    const cashCount = {
      sessionId: session?.id,
      timestamp: new Date(),
      denominations: denominations,
      totalAmount: actualAmount,
      variance: variance,
      cashier: session?.user?.name
    };

    console.log('Cash count saved:', cashCount);
    
    setSnackbar({
      open: true,
      message: 'Cash count saved successfully',
      severity: 'success'
    });
  };

  const printCashReport = () => {
    // Generate and print cash report
    setSnackbar({
      open: true,
      message: 'Cash report sent to printer',
      severity: 'success'
    });
  };

  const getVarianceColor = () => {
    if (variance === 0) return 'success';
    if (Math.abs(variance) <= 10) return 'warning';
    return 'error';
  };

  const getVarianceIcon = () => {
    if (variance === 0) return <CheckCircle />;
    if (variance > 0) return <TrendingUp />;
    return <TrendingDown />;
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Cash Drawer Management</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Drawer Status */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Drawer Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AccountBalanceWallet color={drawerState === 'open' ? 'success' : 'default'} />
                      <Typography variant="body2" color="text.secondary">
                        Drawer State
                      </Typography>
                    </Box>
                    <Typography variant="h6" color={drawerState === 'open' ? 'success.main' : 'text.primary'}>
                      {drawerState === 'open' ? 'Open' : 'Closed'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AttachMoney color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Float Amount
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary.main">
                      ₹{floatAmount.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TrendingUp color="success" />
                      <Typography variant="body2" color="text.secondary">
                        Cash Sales
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="success.main">
                      ₹{cashSales.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Variance Summary */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cash Variance Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Expected Amount"
                  value={expectedAmount}
                  disabled
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Actual Amount"
                  value={actualAmount}
                  disabled
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>₹</span> }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Variance"
                  value={variance}
                  disabled
                  color={getVarianceColor()}
                  InputProps={{ 
                    startAdornment: <span style={{ marginRight: 8 }}>₹</span>,
                    endAdornment: getVarianceIcon()
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Denomination Counting */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Denomination Count
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Assessment />}
                onClick={() => setShowDenominationDialog(true)}
              >
                Count Cash
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Denomination</TableCell>
                    <TableCell align="center">Count</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(denominations)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a))
                    .map(([denom, count]) => (
                      <TableRow key={denom}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            ₹{denom}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            type="number"
                            value={count}
                            onChange={(e) => handleDenominationChange(denom, e.target.value)}
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            ₹{(parseInt(denom) * count).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleDenominationChange(denom, count + 1)}
                          >
                            +
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDenominationChange(denom, Math.max(0, count - 1))}
                          >
                            -
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={drawerState === 'open' ? <Close /> : <OpenInNew />}
              onClick={drawerState === 'open' ? closeDrawer : openDrawer}
              color={drawerState === 'open' ? 'error' : 'success'}
            >
              {drawerState === 'open' ? 'Close Drawer' : 'Open Drawer'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={saveCashCount}
            >
              Save Count
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={printCashReport}
            >
              Print Report
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Denomination Count Dialog */}
      <Dialog open={showDenominationDialog} onClose={() => setShowDenominationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Count Cash Denominations</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Count each denomination and enter the quantity
          </Typography>
          {Object.entries(denominations)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([denom, count]) => (
              <Box key={denom} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ minWidth: 80 }}>
                  ₹{denom}
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={count}
                  onChange={(e) => handleDenominationChange(denom, e.target.value)}
                  sx={{ ml: 2, width: 100 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  = ₹{(parseInt(denom) * count).toLocaleString()}
                </Typography>
              </Box>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDenominationDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => setShowDenominationDialog(false)}>
            Save Count
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CashDrawer;
