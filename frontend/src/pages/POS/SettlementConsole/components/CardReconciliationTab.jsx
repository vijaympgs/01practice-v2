import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  CreditCard as CardIcon,
  AccountBalanceWallet as WalletIcon,
  Smartphone as PhoneIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

/**
 * Card Reconciliation Tab Component
 * Handles card, UPI, and digital payment reconciliation
 */
const CardReconciliationTab = ({ settlement }) => {
  const theme = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate payment breakdown
  const paymentBreakdown = settlement?.transactions?.reduce(
    (acc, transaction) => {
      const method = (transaction.paymentMethod || transaction.payment_method || '').toLowerCase();
      const total = parseFloat(transaction.total || 0);
      if (method.includes('card')) {
        acc.card += total;
      } else if (method.includes('upi') || method.includes('wallet') || method.includes('digital') || method.includes('online')) {
        acc.digital += total;
      } else {
        acc.others += total;
      }
      return acc;
    },
    { card: 0, digital: 0, others: 0 }
  ) || { card: 0, digital: 0, others: 0 };

  const nonCashTransactions = settlement?.transactions?.filter(t => 
    !['cash', ''].includes((t.paymentMethod || t.payment_method || '').toLowerCase())
  ) || [];

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Card & Digital Payment Reconciliation
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CardIcon sx={{ color: theme.palette.info.main, fontSize: 32 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Card Payments
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatCurrency(paymentBreakdown.card)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PhoneIcon sx={{ color: theme.palette.success.main, fontSize: 32 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  UPI & Wallets
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatCurrency(paymentBreakdown.digital)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WalletIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Other Methods
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatCurrency(paymentBreakdown.others)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mb: 2 }}>
        Verify these totals against processor reports. Capture any mismatches as adjustments before closing the session.
      </Alert>

      {/* Transactions Table */}
      {nonCashTransactions.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nonCashTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.saleNumber || transaction.id}</TableCell>
                  <TableCell>{transaction.paymentMethod || transaction.payment_method}</TableCell>
                  <TableCell align="right">{formatCurrency(transaction.total)}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: transaction.status === 'completed' ? 'success.light' : 'warning.light',
                        color: transaction.status === 'completed' ? 'success.dark' : 'warning.dark',
                      }}
                    >
                      {transaction.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {nonCashTransactions.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No non-cash transactions found for this session.
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default CardReconciliationTab;
