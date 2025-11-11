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
  Person,
  Print,
  Visibility,
  ExpandMore,
  AssignmentTurnedIn,
  Assignment,
  QrCodeScanner
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StockTransferIn = () => {
  const navigate = useNavigate();
  const [confirmations, setConfirmations] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedConfirmation, setSelectedConfirmation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  useEffect(() => {
    const mockConfirmations = [
      {
        id: 'TI001',
        confirmationDate: '2025-01-10',
        fromLocation: 'Main Warehouse A',
        fromLocationCode: 'WH001',
        toLocation: 'Branch Store B',
        toLocationCode: 'ST001',
        status: 'Confirmed',
        totalItems: 4,
        totalValue: 24500.00,
        receivedBy: 'John Smith',
        confirmedBy: 'Jane Doe',
        manifestId: 'TO001',
        discrepancies: 0,
        items: [
          {
            productCode: 'PROD001',
            productName: 'Premium Widget A',
            expectedQty: 100,
            receivedQty: 100,
            acceptedQty: 100,
            rejectedQty: 0,
            unitPrice: 150.00,
            totalValue: 15000.00,
            batchNo: 'BATCH001',
            expiryDate: '2025-12-31',
            condition: 'Good',
            notes: ''
          },
          {
            productCode: 'PROD002',
            productName: 'Standard Component B',
            expectedQty: 50,
            receivedQty: 50,
            acceptedQty: 50,
            rejectedQty: 0,
            unitPrice: 190.00,
            totalValue: 9500.00,
            batchNo: 'BATCH002',
            expiryDate: '2025-11-30',
            condition: 'Good',
            notes: ''
          }
        ]
      },
      {
        id: 'TI002',
        confirmationDate: '2025-01-09',
        fromLocation: 'Branch Store C',
        fromLocationCode: 'ST002',
        toLocation: 'Main Warehouse A',
        toLocationCode: 'WH001',
        status: 'Pending Confirmation',
        totalItems: 3,
        totalValue: 18750.00,
        receivedBy: 'Mike Johnson',
        confirmedBy: null,
        manifestId: 'TO002',
        discrepancies: 2,
        items: [
          {
            productCode: 'PROD003',
            productName: 'Advanced Module C',
            expectedQty: 75,
            receivedQty: 73,
            acceptedQty: 70,
            rejectedQty: 3,
            unitPrice: 250.00,
            totalValue: 18750.00,
            batchNo: 'BATCH003',
            expiryDate: '2025-10-31',
            condition: 'Damaged',
            notes: '2 units damaged in transit, 1 unit missing'
          }
        ]
      },
      {
        id: 'TI003',
        confirmationDate: '2025-01-08',
        fromLocation: 'Main Warehouse A',
        fromLocationCode: 'WH001',
        toLocation: 'Branch Store D',
        toLocationCode: 'ST003',
        status: 'Partially Confirmed',
        totalItems: 2,
        totalValue: 12000.00,
        receivedBy: 'Lisa Brown',
        confirmedBy: 'Tom Davis',
        manifestId: 'TO003',
        discrepancies: 1,
        items: [
          {
            productCode: 'PROD004',
            productName: 'Testing Equipment D',
            expectedQty: 20,
            receivedQty: 19,
            acceptedQty: 18,
            rejectedQty: 1,
            unitPrice: 600.00,
            totalValue: 12000.00,
            batchNo: 'BATCH004',
            expiryDate: '2025-09-30',
            condition: 'Damaged',
            notes: '1 unit damaged, 1 unit missing'
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

    setConfirmations(mockConfirmations);
    setProducts(mockProducts);
    setLocations(mockLocations);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Partially Confirmed': return 'info';
      case 'Pending Confirmation': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const handleConfirm = (confirmation) => {
    // Implement confirm logic
    setSnackbar({
      open: true,
      message: `Transfer In confirmation ${confirmation.id} completed`,
      severity: 'success'
    });
  };

  const handleReject = (confirmation) => {
    // Implement reject logic
    setSnackbar({
      open: true,
      message: `Transfer In confirmation ${confirmation.id} rejected`,
      severity: 'success'
    });
  };

  const handleView = (confirmation) => {
    setSelectedConfirmation(confirmation);
    setDialogOpen(true);
  };

  const filteredConfirmations = confirmations.filter(confirmation => {
    const matchesSearch = confirmation.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         confirmation.toLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         confirmation.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || confirmation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: confirmations.length,
    confirmed: confirmations.filter(c => c.status === 'Confirmed').length,
    partiallyConfirmed: confirmations.filter(c => c.status === 'Partially Confirmed').length,
    pendingConfirmation: confirmations.filter(c => c.status === 'Pending Confirmation').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalShipping color="primary" />
          Transfer In (T/I) Confirmation
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Confirm and verify incoming stock transfers with discrepancy tracking
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
                    Total Confirmations
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
                    Confirmed
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.confirmed}
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
                    Partially Confirmed
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.partiallyConfirmed}
                  </Typography>
                </Box>
                <AssignmentTurnedIn color="info" sx={{ fontSize: 40 }} />
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
                    Pending Confirmation
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pendingConfirmation}
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
              placeholder="Search confirmations..."
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
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Partially Confirmed">Partially Confirmed</MenuItem>
                <MenuItem value="Pending Confirmation">Pending Confirmation</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<QrCodeScanner />}
                onClick={() => setDialogOpen(true)}
              >
                Scan Manifest
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

      {/* Confirmations Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Confirmation ID</TableCell>
              <TableCell>Manifest ID</TableCell>
              <TableCell>From Location</TableCell>
              <TableCell>To Location</TableCell>
              <TableCell>Received By</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="center">Discrepancies</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConfirmations.map((confirmation) => (
              <TableRow key={confirmation.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {confirmation.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium" color="primary">
                    {confirmation.manifestId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {confirmation.fromLocation}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {confirmation.fromLocationCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {confirmation.toLocation}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {confirmation.toLocationCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {confirmation.receivedBy}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {confirmation.totalItems}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={confirmation.discrepancies}
                    size="small"
                    color={confirmation.discrepancies > 0 ? 'error' : 'success'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    ₹{confirmation.totalValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={confirmation.status}
                    size="small"
                    color={getStatusColor(confirmation.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {confirmation.confirmationDate}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(confirmation)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Confirmation">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => {}}
                      >
                        <Print />
                      </IconButton>
                    </Tooltip>
                    {confirmation.status === 'Pending Confirmation' && (
                      <Tooltip title="Confirm Receipt">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleConfirm(confirmation)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Reject">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleReject(confirmation)}
                        disabled={confirmation.status === 'Confirmed'}
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

      {/* Confirmation Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          Transfer In Confirmation - {selectedConfirmation?.id}
        </DialogTitle>
        <DialogContent>
          {selectedConfirmation && (
            <Box>
              {/* Confirmation Header */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="error.main">
                        From Location
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedConfirmation.fromLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedConfirmation.fromLocationCode}
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
                        {selectedConfirmation.toLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedConfirmation.toLocationCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Confirmation Items */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Confirmation Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Expected Qty</TableCell>
                      <TableCell align="center">Received Qty</TableCell>
                      <TableCell align="center">Accepted Qty</TableCell>
                      <TableCell align="center">Rejected Qty</TableCell>
                      <TableCell align="center">Condition</TableCell>
                      <TableCell align="center">Batch No</TableCell>
                      <TableCell align="center">Expiry Date</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedConfirmation.items.map((item, index) => (
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
                            {item.expectedQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {item.receivedQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {item.acceptedQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium" color="error.main">
                            {item.rejectedQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={item.condition}
                            size="small"
                            color={item.condition === 'Good' ? 'success' : 'error'}
                          />
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

              {/* Discrepancy Notes */}
              {selectedConfirmation.discrepancies > 0 && (
                <Accordion sx={{ mt: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="error">
                      Discrepancy Details ({selectedConfirmation.discrepancies})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {selectedConfirmation.items
                      .filter(item => item.rejectedQty > 0 || item.notes)
                      .map((item, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {item.productName} - {item.rejectedQty} units rejected
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {item.notes}
                          </Typography>
                        </Box>
                      ))}
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Print />}>
            Print Confirmation
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

export default StockTransferIn;
