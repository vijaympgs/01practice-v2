import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import {
  MonetizationOn as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  DoneAll as DoneAllIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

/**
 * Cash Count Tab Component
 * Handles cash counting and denomination breakdown
 */
const CashCountTab = ({ settlement, updateSettlement, updateDenomination }) => {
  const theme = useTheme();

  const handleDenominationChange = (denomination, count) => {
    updateDenomination(denomination, count);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrencySymbol = () => {
    return '₹';
  };

  return (
    <Stack spacing={3}>
      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1.5 }}>
                <MoneyIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Opening Float
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {formatCurrency(settlement?.openingBalance || 0)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e3f2fd 100%)',
              border: '1px solid #e3f2fd',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 1.5 }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Expected Cash
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  {formatCurrency(settlement?.expectedCash || 0)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%)',
              border: '1px solid #e8eaf6',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 1.5 }}>
                <DoneAllIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Counted Cash
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {formatCurrency(settlement?.actualCash || 0)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              background: (settlement?.difference || 0) === 0 
                ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
                : (settlement?.difference || 0) > 0
                ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
                : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
              border: '1px solid',
              borderColor: (settlement?.difference || 0) === 0 ? '#c8e6c9' : (settlement?.difference || 0) > 0 ? '#ffe0b2' : '#ffcdd2',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ 
                bgcolor: (settlement?.difference || 0) === 0 
                  ? theme.palette.success.main 
                  : (settlement?.difference || 0) > 0 
                  ? theme.palette.warning.main 
                  : theme.palette.error.main, 
                mr: 1.5 
              }}>
                {(settlement?.difference || 0) === 0 ? <DoneAllIcon /> : 
                 (settlement?.difference || 0) > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Variance
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: (settlement?.difference || 0) === 0 
                      ? theme.palette.success.main 
                      : (settlement?.difference || 0) > 0 
                      ? theme.palette.warning.main 
                      : theme.palette.error.main 
                  }}
                >
                  {formatCurrency(settlement?.difference || 0)}
                </Typography>
                {(settlement?.difference || 0) !== 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {(settlement?.difference || 0) > 0 ? 'Excess' : 'Shortage'}
                  </Typography>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Denomination Section */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoneyIcon sx={{ color: theme.palette.primary.main }} />
          Denomination Breakdown
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(settlement?.denominations || {}).map(([denomination, data]) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={denomination}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {getCurrencySymbol()}{denomination}
                  </Typography>
                  <Chip 
                    label={formatCurrency(data.amount || 0)} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDenominationChange(denomination, Math.max(0, (data?.count || 0) - 10))}
                    sx={{ 
                      minWidth: 40, 
                      height: 40,
                      borderRadius: 2,
                      '&:hover': { bgcolor: 'error.main', color: 'white' }
                    }}
                  >
                    <RemoveIcon />
                  </Button>
                  <TextField
                    type="number"
                    value={data?.count || 0}
                    onChange={(e) => handleDenominationChange(denomination, parseInt(e.target.value) || 0)}
                    inputProps={{ 
                      min: 0, 
                      style: { textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 }
                    }}
                    sx={{ 
                      width: 80,
                      '& .MuiOutlinedInput-input': { textAlign: 'center' }
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleDenominationChange(denomination, (data?.count || 0) + 10)}
                    sx={{ 
                      minWidth: 40, 
                      height: 40,
                      borderRadius: 2,
                      '&:hover': { bgcolor: 'success.main' }
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

export default CashCountTab;
