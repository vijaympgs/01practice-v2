import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  MonetizationOn as MoneyIcon,
  TrendingUp as UpIcon,
  Savings as ProfitIcon,
} from '@mui/icons-material';

const FinancialReportsTab = () => {
  const financialMetrics = [
    { title: 'Total Revenue', value: '$45,678.90', change: '+12.5%', positive: true },
    { title: 'Gross Profit', value: '$32,175.22', change: '+15.2%', positive: true },
    { title: 'Net Profit', value: '$18,925.45', change: '+8.7%', positive: true },
    { title: 'Profit Margin', value: '41.4%', change: '+2.1%', positive: true },
  ];

  const monthlyData = [
    { month: 'Jan 2025', revenue: 45678.90, profit: 18925.45, expenses: 26753.45 },
    { month: 'Dec 2024', revenue: 38542.12, profit: 16231.23, expenses: 22310.89 },
    { month: 'Nov 2024', revenue: 41235.67, profit: 17326.88, expenses: 23908.79 },
    { month: 'Oct 2024', revenue: 39876.34, profit: 16545.67, expenses: 23330.67 },
    { month: 'Sep 2024', revenue: 42356.78, profit: 17847.56, expenses: 24509.22 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        💰 Financial Reports & Analytics
      </Typography>

      {/* Financial Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {financialMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {metric.title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {metric.value}
              </Typography>
              <Typography 
                variant="body2" 
                color={metric.positive ? 'success.main' : 'error.main'}
              >
                {metric.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

   {/* Profit & Loss Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Profit & Loss Trend - Last 5 Months
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.50' }}>
                <Typography variant="h6" color="text.secondary">
                  Interactive Financial Chart Placeholder
                  <br />
                  Revenue vs Profit vs Expenses
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* P&L Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Monthly Profit & Loss Statement
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Expenses</TableCell>
                  <TableCell align="right">Profit</TableCell>
                  <TableCell align="right">Margin</TableCell>
                  <TableCell align="center">Growth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyData.map((row, index) => (
                  <TableRow key={row.month}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {row.month}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        ${row.revenue.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        ${row.expenses.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        ${row.profit.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {((row.profit / row.revenue) * 100).toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {index > 0 ? (
                        <Typography 
                          variant="body2" 
                          color={
                            row.revenue > monthlyData[index - 1].revenue 
                              ? 'success.main' 
                              : 'error.main'
                          }
                        >
                          {row.revenue > monthlyData[index - 1].revenue ? (
                            <UpIcon fontSize="small" />
                          ) : (
                            '-'
                          )}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinancialReportsTab;

