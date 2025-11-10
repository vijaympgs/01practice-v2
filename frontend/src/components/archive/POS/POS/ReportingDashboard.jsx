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
  ListItemAvatar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingCart,
  Person,
  Inventory,
  LocalOffer,
  Print,
  Download,
  Email,
  Close,
  Save,
  History,
  QrCode,
  ExpandMore,
  Edit,
  Delete,
  Visibility,
  CardGiftcard,
  Redeem,
  EmojiEvents,
  Diamond,
  PieChart,
  BarChart,
  ShowChart,
  CalendarToday,
  FilterList,
  Refresh
} from '@mui/icons-material';

const ReportingDashboard = ({ open, onClose, session }) => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(),
    end: new Date()
  });
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: <AttachMoney />, description: 'Transaction and revenue summary' },
    { id: 'products', name: 'Product Report', icon: <Inventory />, description: 'Product performance and sales' },
    { id: 'customers', name: 'Customer Report', icon: <Person />, description: 'Customer analytics and behavior' },
    { id: 'payments', name: 'Payment Report', icon: <ShoppingCart />, description: 'Payment method analysis' },
    { id: 'loyalty', name: 'Loyalty Report', icon: <LocalOffer />, description: 'Loyalty program metrics' }
  ];

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'yesterday', name: 'Yesterday' },
    { id: 'this_week', name: 'This Week' },
    { id: 'last_week', name: 'Last Week' },
    { id: 'this_month', name: 'This Month' },
    { id: 'last_month', name: 'Last Month' },
    { id: 'custom', name: 'Custom Range' }
  ];

  // Mock data for reports
  const mockSalesData = {
    summary: {
      totalSales: 125000,
      totalTransactions: 156,
      averageTransaction: 801.28,
      totalTax: 22500,
      netSales: 102500,
      refunds: 2500,
      netRevenue: 100000
    },
    hourlyData: [
      { hour: '09:00', sales: 8500, transactions: 12 },
      { hour: '10:00', sales: 12000, transactions: 18 },
      { hour: '11:00', sales: 15000, transactions: 22 },
      { hour: '12:00', sales: 18000, transactions: 28 },
      { hour: '13:00', sales: 14000, transactions: 20 },
      { hour: '14:00', sales: 16000, transactions: 24 },
      { hour: '15:00', sales: 19000, transactions: 26 },
      { hour: '16:00', sales: 17000, transactions: 23 },
      { hour: '17:00', sales: 11000, transactions: 16 }
    ],
    topProducts: [
      { name: 'Premium Widget A', sales: 25000, quantity: 125, revenue: 31250 },
      { name: 'Standard Component B', sales: 18000, quantity: 180, revenue: 22500 },
      { name: 'Advanced Module C', sales: 15000, quantity: 75, revenue: 18750 },
      { name: 'Testing Equipment D', sales: 12000, quantity: 24, revenue: 15000 }
    ]
  };

  const mockCustomerData = {
    summary: {
      totalCustomers: 89,
      newCustomers: 12,
      returningCustomers: 77,
      averageOrderValue: 1404.49,
      customerRetention: 86.5
    },
    topCustomers: [
      { name: 'ABC Corporation', purchases: 45000, orders: 18, lastVisit: '2025-01-10' },
      { name: 'John Doe', purchases: 32000, orders: 15, lastVisit: '2025-01-09' },
      { name: 'XYZ Industries', purchases: 28000, orders: 12, lastVisit: '2025-01-08' },
      { name: 'Sarah Wilson', purchases: 25000, orders: 14, lastVisit: '2025-01-10' }
    ]
  };

  const mockPaymentData = {
    summary: {
      cashSales: 45000,
      cardSales: 55000,
      upiSales: 20000,
      walletSales: 5000,
      totalPayments: 125000
    },
    paymentMethods: [
      { method: 'Cash', amount: 45000, percentage: 36.0, transactions: 89 },
      { method: 'Credit/Debit Card', amount: 55000, percentage: 44.0, transactions: 45 },
      { method: 'UPI', amount: 20000, percentage: 16.0, transactions: 18 },
      { method: 'Digital Wallet', amount: 5000, percentage: 4.0, transactions: 4 }
    ]
  };

  const generateReport = () => {
    setSnackbar({
      open: true,
      message: `${reportTypes.find(r => r.id === reportType)?.name} generated successfully`,
      severity: 'success'
    });
  };

  const exportReport = (format) => {
    setSnackbar({
      open: true,
      message: `Report exported as ${format.toUpperCase()} successfully`,
      severity: 'success'
    });
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Reporting Dashboard</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={generateReport}
              >
                Refresh
              </Button>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Report Configuration */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report Configuration
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="Report Type"
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {type.icon}
                          <Box>
                            <Typography variant="body2">{type.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    label="Date Range"
                  >
                    {dateRanges.map((range) => (
                      <MenuItem key={range.id} value={range.id}>
                        {range.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  onClick={generateReport}
                  fullWidth
                  startIcon={<Assessment />}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Summary" />
              <Tab label="Detailed Data" />
              <Tab label="Charts & Analytics" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Summary Tab */}
            {reportType === 'sales' && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <AttachMoney />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            ₹{mockSalesData.summary.totalSales.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Sales
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ShoppingCart />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {mockSalesData.summary.totalTransactions}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Transactions
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                          <TrendingUp />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            ₹{mockSalesData.summary.averageTransaction.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Avg Transaction
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <Assessment />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            ₹{mockSalesData.summary.netRevenue.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Net Revenue
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {reportType === 'customers' && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {mockCustomerData.summary.totalCustomers}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Customers
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <TrendingUp />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {mockCustomerData.summary.newCustomers}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            New Customers
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                          <AttachMoney />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            ₹{mockCustomerData.summary.averageOrderValue.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Avg Order Value
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <LocalOffer />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {mockCustomerData.summary.customerRetention}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Retention Rate
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Detailed Data Tab */}
            {reportType === 'sales' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Top Selling Products
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Quantity Sold</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Avg Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockSalesData.topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="center">{product.quantity}</TableCell>
                          <TableCell align="right">₹{product.revenue.toLocaleString()}</TableCell>
                          <TableCell align="right">₹{(product.revenue / product.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {reportType === 'customers' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Top Customers
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell align="center">Total Orders</TableCell>
                        <TableCell align="right">Total Purchases</TableCell>
                        <TableCell>Last Visit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockCustomerData.topCustomers.map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell align="center">{customer.orders}</TableCell>
                          <TableCell align="right">₹{customer.purchases.toLocaleString()}</TableCell>
                          <TableCell>{customer.lastVisit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {reportType === 'payments' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment Method Analysis
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Payment Method</TableCell>
                        <TableCell align="center">Transactions</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockPaymentData.paymentMethods.map((method, index) => (
                        <TableRow key={index}>
                          <TableCell>{method.method}</TableCell>
                          <TableCell align="center">{method.transactions}</TableCell>
                          <TableCell align="right">₹{method.amount.toLocaleString()}</TableCell>
                          <TableCell align="right">{method.percentage}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Charts & Analytics Tab */}
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BarChart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Charts & Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive charts and analytics coming soon
              </Typography>
            </Box>
          </TabPanel>

          {/* Export Options */}
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export Options
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={() => exportReport('pdf')}
              >
                Print PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => exportReport('excel')}
              >
                Export Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<Email />}
                onClick={() => exportReport('email')}
              >
                Email Report
              </Button>
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
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

export default ReportingDashboard;
