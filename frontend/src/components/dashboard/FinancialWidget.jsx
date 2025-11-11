import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  MonetizationOn as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  Receipt as ReceiptIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

const FinancialWidget = () => {
  // Mock financial data
  const cashFlowData = [
    { account: 'Cash Register', balance: 1250.45, trend: '+', lastWeek: 1180.23 },
    { account: 'Credit Cards', balance: 4567.89, trend: '+', lastWeek: 4321.45 },
    { account: 'Bank Account', balance: 25890.12, trend: '+', lastWeek: 24650.78 },
  ];

  const todaysMetrics = {
    revenue: '$2,456.78',
    expenses: '$847.32',
    profit: '$1,609.46',
    profitMargin: '65.5%',
    trend: '+8.2%'
  };

  const monthlyMetrics = {
    totalRevenue: '$45,678.90',
    totalExpenses: '$26,753.45',
    netProfit: '$18,925.45',
    margin: '41.4%'
  };

  const topExpenses = [
    { category: 'Inventory Purchases', amount: '$12,450.00', percentage: '46.5%' },
    { category: 'Staff Wages', amount: '$6,800.00', percentage: '25.4%' },
    { category: 'Rent & Utilities', amount: '$4,200.00', percentage: '15.7%' },
    { category: 'Marketing', amount: '$1,800.00', percentage: '6.7%' },
    { category: 'Other', amount: '$1,503.45', percentage: '5.7%' }
  ];

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon color="primary" />
            Financial Overview
          </Typography>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Today's Financial Summary */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'success.light', borderRadius: 1, color: 'white' }}>
          <Typography variant="subtitle2" gutterBottom>
            Today's Performance
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="h6" fontWeight="bold">
                {todaysMetrics.revenue}
              </Typography>
              <Typography variant="caption">Revenue</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" fontWeight="bold" color="background.paper">
                {todaysMetrics.profit}
              </Typography>
              <Typography variant="caption">Profit</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" fontWeight="bold">
                {todaysMetrics.profitMargin}
              </Typography>
              <Typography variant="caption">Margin</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Cash Flow Overview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Cash Flow Summary
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="center">Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cashFlowData.map((account) => (
                  <TableRow key={account.account}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BalanceIcon fontSize="small" color="action" />
                        <Typography variant="body2">{account.account}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        ${account.balance.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2" 
                        color="success.main"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
                      >
                        <TrendingUpIcon fontSize="small" />
                        {((account.balance / account.lastWeek - 1) * 100).toFixed(1)}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Monthly Financial Overview */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Month Performance
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Revenue</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {monthlyMetrics.totalRevenue}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Net Profit</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {monthlyMetrics.netProfit}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinancialWidget;

