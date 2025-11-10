import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  Divider,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { currencyDenominationService } from '../../services/currencyDenominationService';
import { currencyService } from '../../services/currencyService';

const CounterSettlementDialog = ({ open, onClose, onConfirm, expectedCash, title = 'Counter Settlement' }) => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState('');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('USD');
  const [denominations, setDenominations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [denominationCounts, setDenominationCounts] = useState({});
  const [overrideAmount, setOverrideAmount] = useState('');
  const [useOverride, setUseOverride] = useState(false);

  // Fetch currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currenciesList = await currencyService.getAllCurrencies();
        setCurrencies(currenciesList);
        if (currenciesList.length > 0) {
          setSelectedCurrencyId(currenciesList[0].id);
          setSelectedCurrencyCode(currenciesList[0].code);
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
        setError('Failed to load currencies');
      }
    };
    
    if (open) {
      fetchCurrencies();
    }
  }, [open]);

  // Fetch denominations when currency changes
  useEffect(() => {
    const fetchDenominations = async () => {
      if (!selectedCurrencyId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const denoms = await currencyDenominationService.getDenominationsByCurrency(selectedCurrencyId);
        setDenominations(denoms);
        
        // Initialize counts
        const counts = {};
        denoms.forEach(denom => {
          counts[denom.id] = 0;
        });
        setDenominationCounts(counts);
      } catch (error) {
        console.error('Error fetching denominations:', error);
        setError('Failed to load denominations');
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedCurrencyId && open) {
      fetchDenominations();
    }
  }, [selectedCurrencyId, open]);

  const handleCurrencyChange = (event) => {
    const currencyId = event.target.value;
    const currency = currencies.find(c => c.id === currencyId);
    setSelectedCurrencyId(currencyId);
    setSelectedCurrencyCode(currency ? currency.code : 'USD');
    setDenominationCounts({});
  };

  const handleDenominationChange = (denominationId, value) => {
    setDenominationCounts(prev => ({
      ...prev,
      [denominationId]: parseInt(value) || 0
    }));
  };

  // Calculate total from denominations
  const calculateTotal = () => {
    if (useOverride && overrideAmount) {
      return parseFloat(overrideAmount) || 0;
    }

    let total = 0;
    denominations.forEach(denom => {
      const count = denominationCounts[denom.id] || 0;
      total += count * parseFloat(denom.value);
    });
    
    return total;
  };

  const totalCash = calculateTotal();
  const variance = totalCash - expectedCash;
  const variancePercentage = expectedCash > 0 ? (variance / expectedCash) * 100 : 0;

  const handleConfirm = () => {
    const settlementData = {
      currency: selectedCurrencyCode,
      currencyId: selectedCurrencyId,
      denominations: denominations.map(denom => ({
        denomination: denom.display_name,
        value: denom.value,
        count: denominationCounts[denom.id] || 0,
        type: denom.denomination_type
      })),
      totalCash,
      expectedCash,
      variance,
      variancePercentage,
      settlementDateTime: new Date(),
      useOverride
    };
    
    onConfirm(settlementData);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrencyCode
    }).format(amount || 0);
  };

  // Group denominations by type
  const notes = denominations.filter(d => d.denomination_type === 'note');
  const coins = denominations.filter(d => d.denomination_type === 'coin');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            💰 {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Currency Selector */}
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e3f2fd' }}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={selectedCurrencyId}
                onChange={handleCurrencyChange}
                label="Currency"
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Expected Cash */}
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6" gutterBottom>
              Expected Cash
            </Typography>
            <Typography variant="h4" color="primary">
              {formatCurrency(expectedCash)}
            </Typography>
          </Paper>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : (
            <>
              {/* Cash Notes */}
              {notes.length > 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Cash Notes
                  </Typography>
                  <Grid container spacing={2}>
                    {notes.map((denom) => (
                      <Grid item xs={6} md={4} key={denom.id}>
                        <TextField
                          fullWidth
                          label={denom.display_name}
                          type="number"
                          value={denominationCounts[denom.id] || 0}
                          onChange={(e) => handleDenominationChange(denom.id, e.target.value)}
                          inputProps={{ min: 0, step: 1 }}
                          InputProps={{
                            startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}

              {/* Coins */}
              {coins.length > 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Coins
                  </Typography>
                  <Grid container spacing={2}>
                    {coins.map((denom) => (
                      <Grid item xs={6} md={4} key={denom.id}>
                        <TextField
                          fullWidth
                          label={denom.display_name}
                          type="number"
                          value={denominationCounts[denom.id] || 0}
                          onChange={(e) => handleDenominationChange(denom.id, e.target.value)}
                          inputProps={{ min: 0, step: 1 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}

              {/* Summary */}
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                  Settlement Summary
                </Typography>
                
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Item</strong></TableCell>
                      <TableCell align="right"><strong>Amount</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {denominations.map((denom) => {
                      const count = denominationCounts[denom.id] || 0;
                      const amount = count * parseFloat(denom.value);
                      return amount > 0 ? (
                        <TableRow key={denom.id}>
                          <TableCell>{count} x {denom.display_name}</TableCell>
                          <TableCell align="right">{formatCurrency(amount)}</TableCell>
                        </TableRow>
                      ) : null;
                    })}
                    
                    <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                      <TableCell><strong>Total Cash</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(totalCash)}</strong></TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell>Expected Cash</TableCell>
                      <TableCell align="right">{formatCurrency(expectedCash)}</TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ backgroundColor: Math.abs(variance) > 0 ? '#fff3cd' : '#d4edda' }}>
                      <TableCell><strong>Variance</strong></TableCell>
                      <TableCell align="right">
                        <strong style={{ color: variance > 0 ? '#28a745' : variance < 0 ? '#dc3545' : '#28a745' }}>
                          {formatCurrency(variance)} ({variancePercentage.toFixed(2)}%)
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>

              {/* Variance Alert */}
              {Math.abs(variance) > 0 && (
                <Alert 
                  severity={variance > 0 ? 'warning' : 'error'} 
                  sx={{ mb: 2 }}
                >
                  {variance > 0 
                    ? `Overage: ${formatCurrency(variance)} - Please verify the count`
                    : `Shortage: ${formatCurrency(Math.abs(variance))} - Please investigate`
                  }
                </Alert>
              )}

              {/* Override Option */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Override Total (Optional)
                </Typography>
                <TextField
                  fullWidth
                  label="Manual Total Entry"
                  type="number"
                  value={overrideAmount}
                  onChange={(e) => {
                    setOverrideAmount(e.target.value);
                    setUseOverride(e.target.value !== '');
                  }}
                  placeholder="Enter total manually if needed"
                  helperText="Use this if you prefer to enter total directly instead of counting denominations"
                />
              </Paper>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
          disabled={loading}
        >
          Confirm Settlement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CounterSettlementDialog;
