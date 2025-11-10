import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const SalesOrderInvoicing = ({ orders = [], onGenerateInvoice, onSendInvoice, onPrintInvoice }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [invoiceStatus, setInvoiceStatus] = useState('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: 'Net 30',
    taxRate: 8.0,
    notes: '',
    includeShipping: true,
    autoSend: false
  });

  // Mock data - replace with actual API data
  const invoicingOrders = orders.length > 0 ? orders : [
    {
      id: 'SO-001',
      orderNumber: 'SO-2024-001',
      customer: { 
        name: 'ABC Corporation', 
        email: 'billing@abc.com',
        billingAddress: '123 Business St, City, State 12345'
      },
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
      status: 'Shipped',
      invoiceStatus: 'Pending',
      salesPerson: 'John Smith',
      itemsCount: 3,
      shippedDate: '2024-01-18',
      lineItems: [
        { product: 'Product A', sku: 'PROD-A-001', quantity: 10, unitPrice: 100.00, total: 1000.00 },
        { product: 'Product B', sku: 'PROD-B-002', quantity: 5, unitPrice: 150.00, total: 750.00 },
        { product: 'Product C', sku: 'PROD-C-003', quantity: 3, unitPrice: 200.00, total: 600.00 }
      ],
      subtotal: 2350.00,
      tax: 188.00,
      shipping: 50.00,
      total: 2588.00
    },
    {
      id: 'SO-002',
      orderNumber: 'SO-2024-002',
      customer: { 
        name: 'XYZ Industries', 
        email: 'accounts@xyz.com',
        billingAddress: '456 Industrial Ave, City, State 54321'
      },
      orderDate: '2024-01-16',
      deliveryDate: '2024-01-22',
      status: 'Shipped',
      invoiceStatus: 'Generated',
      total: 1890.50,
      salesPerson: 'Jane Doe',
      itemsCount: 2,
      shippedDate: '2024-01-19',
      invoiceNumber: 'INV-2024-002',
      invoiceDate: '2024-01-19',
      dueDate: '2024-02-18',
      lineItems: [
        { product: 'Product D', sku: 'PROD-D-004', quantity: 8, unitPrice: 120.00, total: 960.00 },
        { product: 'Product E', sku: 'PROD-E-005', quantity: 4, unitPrice: 150.00, total: 600.00 }
      ],
      subtotal: 1560.00,
      tax: 124.80,
      shipping: 30.00,
      grandTotal: 1714.80
    },
    {
      id: 'SO-003',
      orderNumber: 'SO-2024-003',
      customer: { 
        name: 'DEF Enterprises', 
        email: 'finance@def.com',
        billingAddress: '789 Corporate Blvd, City, State 98765'
      },
      orderDate: '2024-01-17',
      deliveryDate: '2024-01-25',
      status: 'Shipped',
      invoiceStatus: 'Sent',
      total: 3200.75,
      salesPerson: 'Mike Johnson',
      itemsCount: 5,
      shippedDate: '2024-01-20',
      invoiceNumber: 'INV-2024-003',
      invoiceDate: '2024-01-20',
      dueDate: '2024-02-19',
      sentDate: '2024-01-20',
      lineItems: [
        { product: 'Product F', sku: 'PROD-F-006', quantity: 6, unitPrice: 200.00, total: 1200.00 },
        { product: 'Product G', sku: 'PROD-G-007', quantity: 3, unitPrice: 180.00, total: 540.00 },
        { product: 'Product H', sku: 'PROD-H-008', quantity: 2, unitPrice: 250.00, total: 500.00 },
        { product: 'Product I', sku: 'PROD-I-009', quantity: 4, unitPrice: 150.00, total: 600.00 },
        { product: 'Product J', sku: 'PROD-J-010', quantity: 1, unitPrice: 300.00, total: 300.00 }
      ],
      subtotal: 3140.00,
      tax: 251.20,
      shipping: 75.00,
      grandTotal: 3466.20
    }
  ];

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Generated': return 'info';
      case 'Sent': return 'success';
      case 'Paid': return 'success';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  const getInvoiceStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <PendingIcon />;
      case 'Generated': return <ReceiptIcon />;
      case 'Sent': return <SendIcon />;
      case 'Paid': return <CheckCircleIcon />;
      case 'Overdue': return <WarningIcon />;
      default: return <PendingIcon />;
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    const filteredOrders = invoiceStatus === 'All' 
      ? invoicingOrders 
      : invoicingOrders.filter(order => order.invoiceStatus === invoiceStatus);
      
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleGenerateInvoice = (order) => {
    setSelectedOrderForInvoice(order);
    setInvoiceSettings(prev => ({
      ...prev,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    setShowInvoiceDialog(true);
  };

  const handleSendInvoice = (order) => {
    setSelectedOrderForInvoice(order);
    setShowSendDialog(true);
  };

  const confirmGenerateInvoice = () => {
    if (selectedOrderForInvoice) {
      onGenerateInvoice(selectedOrderForInvoice.id, invoiceSettings);
    }
    setShowInvoiceDialog(false);
    setSelectedOrderForInvoice(null);
  };

  const confirmSendInvoice = () => {
    if (selectedOrderForInvoice) {
      onSendInvoice(selectedOrderForInvoice.id);
    }
    setShowSendDialog(false);
    setSelectedOrderForInvoice(null);
  };

  const filteredOrders = invoiceStatus === 'All' 
    ? invoicingOrders 
    : invoicingOrders.filter(order => order.invoiceStatus === invoiceStatus);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: '1.8rem', fontWeight: 600 }}>
            Sales Order Invoicing
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<ReceiptIcon />} label={`${invoicingOrders.length} Total Orders`} color="primary" variant="outlined" />
            <Chip icon={<PendingIcon />} label={`${invoicingOrders.filter(o => o.invoiceStatus === 'Pending').length} Pending`} color="warning" variant="outlined" />
            <Chip icon={<SendIcon />} label={`${invoicingOrders.filter(o => o.invoiceStatus === 'Sent').length} Sent`} color="success" variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ReceiptIcon />}
            disabled={selectedOrders.length === 0}
          >
            Generate Selected
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            disabled={selectedOrders.length === 0}
          >
            Send Selected
          </Button>
        </Box>
      </Box>

      {/* Invoice Guidelines */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Invoicing Guidelines:</strong> Only shipped orders can be invoiced. 
          Ensure all order details are accurate before generating invoices.
        </Typography>
      </Alert>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Invoice Status</InputLabel>
                <Select
                  value={invoiceStatus}
                  label="Invoice Status"
                  onChange={(e) => setInvoiceStatus(e.target.value)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Generated">Generated</MenuItem>
                  <MenuItem value="Sent">Sent</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length}
                    checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Order Details</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Invoice Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Shipped Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => {
                const isSelected = selectedOrders.includes(order.id);
                
                return (
                  <TableRow key={order.id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.orderNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.itemsCount} items • {order.salesPerson}
                        </Typography>
                        {order.invoiceNumber && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            Invoice: {order.invoiceNumber}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {order.customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getInvoiceStatusIcon(order.invoiceStatus)}
                        label={order.invoiceStatus}
                        color={getInvoiceStatusColor(order.invoiceStatus)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ${order.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {new Date(order.shippedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onPrintInvoice(order.id)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {order.invoiceStatus === 'Pending' && (
                          <Tooltip title="Generate Invoice">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleGenerateInvoice(order)}
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {order.invoiceStatus === 'Generated' && (
                          <Tooltip title="Send Invoice">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleSendInvoice(order)}
                            >
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Print Invoice">
                          <IconButton
                            size="small"
                            onClick={() => onPrintInvoice(order.id)}
                          >
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Generate Invoice Dialog */}
      <Dialog open={showInvoiceDialog} onClose={() => setShowInvoiceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon color="primary" />
            Generate Invoice - {selectedOrderForInvoice?.orderNumber}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrderForDetails && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Invoice Number"
                    value={invoiceSettings.invoiceNumber}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Invoice Date"
                    type="date"
                    value={invoiceSettings.invoiceDate}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, invoiceDate: e.target.value }))}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={invoiceSettings.dueDate}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, dueDate: e.target.value }))}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Terms</InputLabel>
                    <Select
                      value={invoiceSettings.paymentTerms}
                      label="Payment Terms"
                      onChange={(e) => setInvoiceSettings(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    >
                      <MenuItem value="Net 15">Net 15</MenuItem>
                      <MenuItem value="Net 30">Net 30</MenuItem>
                      <MenuItem value="Net 45">Net 45</MenuItem>
                      <MenuItem value="Net 60">Net 60</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tax Rate (%)"
                    type="number"
                    value={invoiceSettings.taxRate}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                    size="small"
                    inputProps={{ step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={invoiceSettings.includeShipping}
                        onChange={(e) => setInvoiceSettings(prev => ({ ...prev, includeShipping: e.target.checked }))}
                      />
                    }
                    label="Include Shipping"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={invoiceSettings.notes}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, notes: e.target.value }))}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInvoiceDialog(false)}>Cancel</Button>
          <Button onClick={confirmGenerateInvoice} variant="contained" startIcon={<SaveIcon />}>
            Generate Invoice
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Invoice Dialog */}
      <Dialog open={showSendDialog} onClose={() => setShowSendDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon color="primary" />
            Send Invoice - {selectedOrderForInvoice?.orderNumber}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Invoice will be sent to: <strong>{selectedOrderForInvoice?.customer.email}</strong>
            </Typography>
          </Alert>
          
          <FormControlLabel
            control={
              <Switch
                checked={invoiceSettings.autoSend}
                onChange={(e) => setInvoiceSettings(prev => ({ ...prev, autoSend: e.target.checked }))}
              />
            }
            label="Auto-send future invoices to this customer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSendDialog(false)}>Cancel</Button>
          <Button onClick={confirmSendInvoice} variant="contained" startIcon={<SendIcon />}>
            Send Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesOrderInvoicing;
