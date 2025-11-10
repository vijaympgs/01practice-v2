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
  Tabs,
  Tab,
  Box as MuiBox
} from '@mui/material';
import {
  LocalShipping,
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
  LocationOn,
  SwapHoriz,
  Visibility,
  Print
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LocationTransfers = () => {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);

  // Mock data
  useEffect(() => {
    const mockTransfers = [
      {
        id: 'LT001',
        transferDate: '2025-01-10',
        fromLocation: 'Main Warehouse A',
        fromLocationCode: 'WH001',
        toLocation: 'Branch Store B',
        toLocationCode: 'ST001',
        status: 'Completed',
        totalItems: 3,
        totalValue: 15750.00,
        transferredBy: 'John Smith',
        approvedBy: 'Jane Doe',
        items: [
          {
            productCode: 'PROD001',
            productName: 'Premium Widget A',
            requestedQty: 50,
            transferredQty: 50,
            unitPrice: 150.00,
            totalValue: 7500.00,
            batchNo: 'BATCH001',
            expiryDate: '2025-12-31'
          },
          {
            productCode: 'PROD002',
            productName: 'Standard Component B',
            requestedQty: 35,
            transferredQty: 35,
            unitPrice: 235.71,
            totalValue: 8250.00,
            batchNo: 'BATCH002',
            expiryDate: '2025-11-30'
          }
        ]
      },
      {
        id: 'LT002',
        transferDate: '2025-01-09',
        fromLocation: 'Branch Store C',
        fromLocationCode: 'ST002',
        toLocation: 'Main Warehouse A',
        toLocationCode: 'WH001',
        status: 'In Transit',
        totalItems: 2,
        totalValue: 9800.00,
        transferredBy: 'Mike Johnson',
        approvedBy: 'Sarah Wilson',
        items: [
          {
            productCode: 'PROD003',
            productName: 'Advanced Module C',
            requestedQty: 20,
            transferredQty: 20,
            unitPrice: 490.00,
            totalValue: 9800.00,
            batchNo: 'BATCH003',
            expiryDate: '2025-10-31'
          }
        ]
      },
      {
        id: 'LT003',
        transferDate: '2025-01-08',
        fromLocation: 'Main Warehouse A',
        fromLocationCode: 'WH001',
        toLocation: 'Branch Store D',
        toLocationCode: 'ST003',
        status: 'Pending',
        totalItems: 4,
        totalValue: 12300.00,
        transferredBy: 'Lisa Brown',
        approvedBy: 'Tom Davis',
        items: [
          {
            productCode: 'PROD004',
            productName: 'Testing Equipment D',
            requestedQty: 15,
            transferredQty: 0,
            unitPrice: 820.00,
            totalValue: 12300.00,
            batchNo: 'BATCH004',
            expiryDate: '2025-09-30'
          }
        ]
      }
    ];

    const mockProducts = [
      { code: 'PROD001', name: 'Premium Widget A', availableQty: 500 },
      { code: 'PROD002', name: 'Standard Component B', availableQty: 200 },
      { code: 'PROD003', name: 'Advanced Module C', availableQty: 75 },
      { code: 'PROD004', name: 'Testing Equipment D', availableQty: 50 }
    ];

    const mockLocations = [
      { code: 'WH001', name: 'Main Warehouse A', type: 'Warehouse' },
      { code: 'ST001', name: 'Branch Store B', type: 'Store' },
      { code: 'ST002', name: 'Branch Store C', type: 'Store' },
      { code: 'ST003', name: 'Branch Store D', type: 'Store' },
      { code: 'WH002', name: 'Secondary Warehouse', type: 'Warehouse' }
    ];

    setTransfers(mockTransfers);
    setProducts(mockProducts);
    setLocations(mockLocations);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Transit': return 'info';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleComplete = (transfer) => {
    // Implement complete logic
    setSnackbar({
      open: true,
      message: `Transfer ${transfer.id} marked as completed`,
      severity: 'success'
    });
  };

  const handleCancel = (transfer) => {
    // Implement cancel logic
    setSnackbar({
      open: true,
      message: `Transfer ${transfer.id} cancelled`,
      severity: 'success'
    });
  };

  const handleView = (transfer) => {
    setSelectedTransfer(transfer);
    setDialogOpen(true);
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: transfers.length,
    completed: transfers.filter(t => t.status === 'Completed').length,
    inTransit: transfers.filter(t => t.status === 'In Transit').length,
    pending: transfers.filter(t => t.status === 'Pending').length
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
          <MuiBox sx={{ p: 3 }}>
            {children}
          </MuiBox>
        )}
      </div>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalShipping color="primary" />
          Location Transfers
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage stock transfers between bins, zones, or warehouses within the same legal entity
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
                <SwapHoriz color="info" sx={{ fontSize: 40 }} />
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
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pending}
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
                <MenuItem value="Pending">Pending</MenuItem>
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
              <TableCell>From Location</TableCell>
              <TableCell>To Location</TableCell>
              <TableCell>Transferred By</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="right">Total Value</TableCell>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'error.main' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {transfer.fromLocation}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transfer.fromLocationCode}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'success.main' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {transfer.toLocation}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transfer.toLocationCode}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {transfer.transferredBy}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {transfer.totalItems}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    ₹{transfer.totalValue.toLocaleString()}
                  </Typography>
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
                    {transfer.status === 'In Transit' && (
                      <Tooltip title="Mark Complete">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleComplete(transfer)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    {transfer.status === 'Pending' && (
                      <Tooltip title="Cancel Transfer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleCancel(transfer)}
                        >
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transfer Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Transfer Details - {selectedTransfer?.id}
        </DialogTitle>
        <DialogContent>
          {selectedTransfer && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="error.main">
                        From Location
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedTransfer.fromLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedTransfer.fromLocationCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="success.main">
                        To Location
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedTransfer.toLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedTransfer.toLocationCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Transfer Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Requested Qty</TableCell>
                      <TableCell align="center">Transferred Qty</TableCell>
                      <TableCell align="center">Batch No</TableCell>
                      <TableCell align="center">Expiry Date</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
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
                          <Typography variant="body2">
                            {item.requestedQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {item.transferredQty}
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
                        <TableCell align="right">
                          <Typography variant="body2">
                            ₹{item.unitPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            ₹{item.totalValue.toLocaleString()}
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
            Print Transfer
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

export default LocationTransfers;
