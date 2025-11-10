import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Business,
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  GetApp,
  Refresh,
  CheckCircle,
  Cancel,
  Warning,
  Inventory,
  Person,
  Print,
  Visibility,
  ExpandMore,
  AccountBalance,
  Assignment,
  LocalShipping
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const IntercompanyTransfers = () => {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  useEffect(() => {
    const mockTransfers = [
      {
        id: 'ICT001',
        transferDate: '2025-01-10',
        fromEntity: 'Retail Corp India',
        fromEntityCode: 'RCI001',
        toEntity: 'Retail Corp Singapore',
        toEntityCode: 'RCS001',
        status: 'Completed',
        totalItems: 3,
        totalValue: 45000.00,
        initiatedBy: 'John Smith',
        approvedBy: 'Jane Doe',
        currency: 'USD',
        exchangeRate: 83.25,
        transferType: 'Stock Transfer',
        customsDetails: {
          customsDeclarationNo: 'CD001',
          shippingAgent: 'Global Logistics Ltd',
          estimatedDelivery: '2025-01-25',
          shippingMode: 'Sea Freight',
          insuranceValue: 45000.00
        },
        items: [
          {
            productCode: 'PROD001',
            productName: 'Premium Widget A',
            transferQty: 100,
            unitPrice: 150.00,
            totalValue: 15000.00,
            batchNo: 'BATCH001',
            expiryDate: '2025-12-31',
            hsnCode: '8517.12.00',
            customsValue: 15000.00
          },
          {
            productCode: 'PROD002',
            productName: 'Standard Component B',
            transferQty: 50,
            unitPrice: 200.00,
            totalValue: 10000.00,
            batchNo: 'BATCH002',
            expiryDate: '2025-11-30',
            hsnCode: '8517.12.00',
            customsValue: 10000.00
          },
          {
            productCode: 'PROD003',
            productName: 'Advanced Module C',
            transferQty: 100,
            unitPrice: 200.00,
            totalValue: 20000.00,
            batchNo: 'BATCH003',
            expiryDate: '2025-10-31',
            hsnCode: '8517.12.00',
            customsValue: 20000.00
          }
        ]
      },
      {
        id: 'ICT002',
        transferDate: '2025-01-09',
        fromEntity: 'Retail Corp Singapore',
        fromEntityCode: 'RCS001',
        toEntity: 'Retail Corp India',
        toEntityCode: 'RCI001',
        status: 'In Transit',
        totalItems: 2,
        totalValue: 35000.00,
        initiatedBy: 'Mike Johnson',
        approvedBy: 'Sarah Wilson',
        currency: 'USD',
        exchangeRate: 83.15,
        transferType: 'Stock Transfer',
        customsDetails: {
          customsDeclarationNo: 'CD002',
          shippingAgent: 'Maritime Shipping Co',
          estimatedDelivery: '2025-01-28',
          shippingMode: 'Sea Freight',
          insuranceValue: 35000.00
        },
        items: [
          {
            productCode: 'PROD004',
            productName: 'Testing Equipment D',
            transferQty: 25,
            unitPrice: 800.00,
            totalValue: 20000.00,
            batchNo: 'BATCH004',
            expiryDate: '2025-09-30',
            hsnCode: '9030.20.00',
            customsValue: 20000.00
          },
          {
            productCode: 'PROD005',
            productName: 'Specialized Tool E',
            transferQty: 50,
            unitPrice: 300.00,
            totalValue: 15000.00,
            batchNo: 'BATCH005',
            expiryDate: '2025-08-31',
            hsnCode: '8207.19.00',
            customsValue: 15000.00
          }
        ]
      },
      {
        id: 'ICT003',
        transferDate: '2025-01-08',
        fromEntity: 'Retail Corp India',
        fromEntityCode: 'RCI001',
        toEntity: 'Retail Corp Malaysia',
        toEntityCode: 'RCM001',
        status: 'Pending Approval',
        totalItems: 4,
        totalValue: 28000.00,
        initiatedBy: 'Lisa Brown',
        approvedBy: null,
        currency: 'USD',
        exchangeRate: 83.50,
        transferType: 'Stock Transfer',
        customsDetails: {
          customsDeclarationNo: '',
          shippingAgent: '',
          estimatedDelivery: '2025-01-30',
          shippingMode: 'Air Freight',
          insuranceValue: 28000.00
        },
        items: [
          {
            productCode: 'PROD006',
            productName: 'Quality Control Kit F',
            transferQty: 20,
            unitPrice: 700.00,
            totalValue: 14000.00,
            batchNo: 'BATCH006',
            expiryDate: '2025-07-31',
            hsnCode: '9031.80.00',
            customsValue: 14000.00
          },
          {
            productCode: 'PROD007',
            productName: 'Calibration Device G',
            transferQty: 35,
            unitPrice: 400.00,
            totalValue: 14000.00,
            batchNo: 'BATCH007',
            expiryDate: '2025-06-30',
            hsnCode: '9031.80.00',
            customsValue: 14000.00
          }
        ]
      }
    ];

    const mockProducts = [
      { code: 'PROD001', name: 'Premium Widget A', availableQty: 500 },
      { code: 'PROD002', name: 'Standard Component B', availableQty: 200 },
      { code: 'PROD003', name: 'Advanced Module C', availableQty: 75 },
      { code: 'PROD004', name: 'Testing Equipment D', availableQty: 50 },
      { code: 'PROD005', name: 'Specialized Tool E', availableQty: 100 },
      { code: 'PROD006', name: 'Quality Control Kit F', availableQty: 30 },
      { code: 'PROD007', name: 'Calibration Device G', availableQty: 60 }
    ];

    const mockEntities = [
      { code: 'RCI001', name: 'Retail Corp India', country: 'India' },
      { code: 'RCS001', name: 'Retail Corp Singapore', country: 'Singapore' },
      { code: 'RCM001', name: 'Retail Corp Malaysia', country: 'Malaysia' },
      { code: 'RCT001', name: 'Retail Corp Thailand', country: 'Thailand' }
    ];

    setTransfers(mockTransfers);
    setProducts(mockProducts);
    setEntities(mockEntities);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Transit': return 'info';
      case 'Pending Approval': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleApprove = (transfer) => {
    // Implement approve logic
    setSnackbar({
      open: true,
      message: `Intercompany transfer ${transfer.id} approved`,
      severity: 'success'
    });
  };

  const handleCancel = (transfer) => {
    // Implement cancel logic
    setSnackbar({
      open: true,
      message: `Intercompany transfer ${transfer.id} cancelled`,
      severity: 'success'
    });
  };

  const handleView = (transfer) => {
    setSelectedTransfer(transfer);
    setDialogOpen(true);
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.fromEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: transfers.length,
    completed: transfers.filter(t => t.status === 'Completed').length,
    inTransit: transfers.filter(t => t.status === 'In Transit').length,
    pendingApproval: transfers.filter(t => t.status === 'Pending Approval').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business color="primary" />
          Cross-Entity Logistics (CEL)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage stock transfers between different legal entities with customs and compliance tracking
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Transfers
                  </Typography>
                  <Typography variant="h4">
                    {stats.total}
                  </Typography>
                </Box>
                <Inventory color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.completed}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    In Transit
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.inTransit}
                  </Typography>
                </Box>
                <LocalShipping color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Approval
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pendingApproval}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="In Transit">In Transit</MenuItem>
                <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
              >
                New Transfer
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => setLoading(true)}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Transfers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transfer ID</TableCell>
              <TableCell>From Entity</TableCell>
              <TableCell>To Entity</TableCell>
              <TableCell>Initiated By</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="center">Currency</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransfers.map((transfer) => (
              <TableRow key={transfer.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {transfer.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {transfer.fromEntity}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transfer.fromEntityCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {transfer.toEntity}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transfer.toEntityCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {transfer.initiatedBy}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {transfer.totalItems}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    ${transfer.totalValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={transfer.currency}
                    size="small"
                    color="primary"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={transfer.status}
                    size="small"
                    color={getStatusColor(transfer.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {transfer.transferDate}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(transfer)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Transfer">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => {}}
                      >
                        <Print />
                      </IconButton>
                    </Tooltip>
                    {transfer.status === 'Pending Approval' && (
                      <Tooltip title="Approve Transfer">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleApprove(transfer)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Cancel Transfer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCancel(transfer)}
                        disabled={transfer.status === 'Completed'}
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transfer Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          Cross-Entity Transfer - {selectedTransfer?.id}
        </DialogTitle>
        <DialogContent>
          {selectedTransfer && (
            <Box>
              {/* Transfer Header */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="error.main">
                        From Entity
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedTransfer.fromEntity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedTransfer.fromEntityCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="success.main">
                        To Entity
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedTransfer.toEntity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedTransfer.toEntityCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Customs Details */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Customs & Shipping Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Customs Declaration No"
                        value={selectedTransfer.customsDetails.customsDeclarationNo || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Shipping Agent"
                        value={selectedTransfer.customsDetails.shippingAgent || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Estimated Delivery"
                        value={selectedTransfer.customsDetails.estimatedDelivery || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Shipping Mode"
                        value={selectedTransfer.customsDetails.shippingMode || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Exchange Rate"
                        value={selectedTransfer.exchangeRate}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Insurance Value"
                        value={`$${selectedTransfer.customsDetails.insuranceValue.toLocaleString()}`}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Transfer Items */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Transfer Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Transfer Qty</TableCell>
                      <TableCell align="center">Batch No</TableCell>
                      <TableCell align="center">Expiry Date</TableCell>
                      <TableCell align="center">HSN Code</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Customs Value</TableCell>
                      <TableCell align="right">Total Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTransfer.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {item.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.productCode}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {item.transferQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.batchNo}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.expiryDate}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {item.hsnCode}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ${item.unitPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            ${item.customsValue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            ${item.totalValue.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Print />}>
            Print Transfer Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
    </Box>
  );
};

export default IntercompanyTransfers;
