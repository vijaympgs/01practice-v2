import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import inventoryService from '../../services/inventoryService';
import productService from '../../services/productService';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
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
  AssignmentReturn,
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
  LocalShipping,
  Person,
  Print,
  Visibility,
  ExpandMore,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StockTransferOut = () => {
  const navigate = useNavigate();
  const { displaySuccess, displayError } = useNotification();
  const [manifests, setManifests] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedManifest, setSelectedManifest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);

  // Load data from backend
  useEffect(() => {
    loadTransfers();
    loadProducts();
    loadLocations();
  }, []);

  // Group StockMovements by reference_number to create manifests
  const groupMovementsToManifests = (movements) => {
    const manifestMap = {};
    
    movements.forEach(movement => {
      const refNum = movement.reference_number || movement.id;
      if (!manifestMap[refNum]) {
        manifestMap[refNum] = {
          id: refNum,
          manifestDate: movement.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          fromLocation: movement.inventory?.location || '',
          fromLocationCode: '',
          toLocation: movement.notes || '', // Store to_location in notes
          toLocationCode: '',
          status: movement.status === 'completed' ? 'Dispatched' : movement.status === 'pending' ? 'Ready for Dispatch' : 'Draft',
          totalItems: 0,
          totalValue: 0,
          preparedBy: movement.created_by_name || 'System',
          approvedBy: null,
          dispatchedBy: movement.status === 'completed' ? movement.created_by_name : null,
          transportDetails: {
            vehicleNo: '',
            driverName: '',
            driverPhone: '',
            expectedDelivery: '',
            transportMode: 'Road'
          },
          items: []
        };
      }
      
      manifestMap[refNum].items.push({
        productCode: movement.product_sku || '',
        productName: movement.product_name || '',
        requestedQty: Math.abs(movement.quantity_change),
        dispatchedQty: movement.status === 'completed' ? Math.abs(movement.quantity_change) : 0,
        unitPrice: parseFloat(movement.unit_cost) || 0,
        totalValue: parseFloat(movement.total_cost) || 0,
        batchNo: movement.reference_number || '',
        expiryDate: null,
        serialNumbers: [],
        inventoryId: movement.inventory?.id,
        movementId: movement.id
      });
      
      manifestMap[refNum].totalItems += 1;
      manifestMap[refNum].totalValue += parseFloat(movement.total_cost) || 0;
    });
    
    return Object.values(manifestMap);
  };

  const loadTransfers = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getStockMovements({
        movement_type: 'transfer_out'
      });
      
      const movements = response.data.results || response.data || [];
      const manifestsList = groupMovementsToManifests(movements);
      setManifests(manifestsList);
    } catch (error) {
      console.error('Error loading transfers:', error);
      displayError('Failed to load transfer manifests');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts({ is_active: true });
      const productsList = response.results || response || [];
      setProducts(productsList.map(p => ({
        code: p.sku || p.id,
        name: p.name,
        availableQty: p.inventory?.current_stock || 0
      })));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await api.get('/organization/locations/');
      const locationsList = response.data.results || response.data || [];
      setLocations(locationsList.map(loc => ({
        code: loc.code || loc.id,
        name: loc.name || loc.location_name,
        type: loc.type || 'Warehouse'
      })));
    } catch (error) {
      console.error('Error loading locations:', error);
      // Fallback
      setLocations([
        { code: 'WH001', name: 'Main Warehouse A', type: 'Warehouse' },
        { code: 'ST001', name: 'Branch Store B', type: 'Store' }
      ]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Dispatched': return 'success';
      case 'Ready for Dispatch': return 'info';
      case 'Draft': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleDispatch = async (manifest) => {
    try {
      setLoading(true);
      // Update all movements in manifest to completed status
      const updatePromises = manifest.items.map(item => 
        api.patch(`/inventory/movements/${item.movementId}/`, {
          status: 'completed'
        })
      );
      
      await Promise.all(updatePromises);
      await loadTransfers();
      displaySuccess(`Transfer Out manifest ${manifest.id} dispatched successfully`);
    } catch (error) {
      console.error('Error dispatching transfer:', error);
      displayError('Failed to dispatch transfer manifest');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (manifest) => {
    try {
      setLoading(true);
      // Update movements to pending (ready for dispatch)
      const updatePromises = manifest.items.map(item => 
        api.patch(`/inventory/movements/${item.movementId}/`, {
          status: 'pending'
        })
      );
      
      await Promise.all(updatePromises);
      await loadTransfers();
      displaySuccess(`Transfer Out manifest ${manifest.id} approved`);
    } catch (error) {
      console.error('Error approving transfer:', error);
      displayError('Failed to approve transfer manifest');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (manifest) => {
    if (!window.confirm(`Are you sure you want to cancel transfer manifest ${manifest.id}?`)) {
      return;
    }
    
    try {
      setLoading(true);
      // Update movements to cancelled status
      const updatePromises = manifest.items.map(item => 
        api.patch(`/inventory/movements/${item.movementId}/`, {
          status: 'cancelled'
        })
      );
      
      await Promise.all(updatePromises);
      await loadTransfers();
      displaySuccess(`Transfer Out manifest ${manifest.id} cancelled`);
    } catch (error) {
      console.error('Error cancelling transfer:', error);
      displayError('Failed to cancel transfer manifest');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (manifest) => {
    setSelectedManifest(manifest);
    setDialogOpen(true);
  };

  const filteredManifests = manifests.filter(manifest => {
    const matchesSearch = manifest.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifest.toLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifest.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || manifest.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: manifests.length,
    dispatched: manifests.filter(m => m.status === 'Dispatched').length,
    readyForDispatch: manifests.filter(m => m.status === 'Ready for Dispatch').length,
    draft: manifests.filter(m => m.status === 'Draft').length
  };

  const steps = [
    'Create Manifest',
    'Add Items',
    'Transport Details',
    'Approval',
    'Dispatch'
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentReturn color="primary" />
          Transfer Out (T/O) Manifest
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create and manage stock transfer out manifests for inter-location movements
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
                    Total Manifests
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
                    Dispatched
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.dispatched}
                  </Typography>
                </Box>
                <LocalShipping color="success" sx={{ fontSize: 40 }} />
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
                    Ready for Dispatch
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.readyForDispatch}
                  </Typography>
                </Box>
                <Assignment color="info" sx={{ fontSize: 40 }} />
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
                    Draft
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.draft}
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
              placeholder="Search manifests..."
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
                <MenuItem value="Dispatched">Dispatched</MenuItem>
                <MenuItem value="Ready for Dispatch">Ready for Dispatch</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
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
                New Manifest
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadTransfers}
                disabled={loading}
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

      {/* Manifests Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Manifest ID</TableCell>
              <TableCell>From Location</TableCell>
              <TableCell>To Location</TableCell>
              <TableCell>Prepared By</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredManifests.map((manifest) => (
              <TableRow key={manifest.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {manifest.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {manifest.fromLocation}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {manifest.fromLocationCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {manifest.toLocation}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {manifest.toLocationCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {manifest.preparedBy}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {manifest.totalItems}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    ₹{manifest.totalValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={manifest.status}
                    size="small"
                    color={getStatusColor(manifest.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {manifest.manifestDate}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(manifest)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Manifest">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => {}}
                      >
                        <Print />
                      </IconButton>
                    </Tooltip>
                    {manifest.status === 'Ready for Dispatch' && (
                      <Tooltip title="Dispatch">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleDispatch(manifest)}
                        >
                          <LocalShipping />
                        </IconButton>
                      </Tooltip>
                    )}
                    {manifest.status === 'Draft' && (
                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleApprove(manifest)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Cancel">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCancel(manifest)}
                        disabled={manifest.status === 'Dispatched'}
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

      {/* Manifest Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          Transfer Out Manifest - {selectedManifest?.id}
        </DialogTitle>
        <DialogContent>
          {selectedManifest && (
            <Box>
              {/* Manifest Header */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="error.main">
                        From Location
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedManifest.fromLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedManifest.fromLocationCode}
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
                        {selectedManifest.toLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedManifest.toLocationCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Transport Details */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Transport Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Vehicle Number"
                        value={selectedManifest.transportDetails.vehicleNo || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Driver Name"
                        value={selectedManifest.transportDetails.driverName || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Driver Phone"
                        value={selectedManifest.transportDetails.driverPhone || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Expected Delivery"
                        value={selectedManifest.transportDetails.expectedDelivery || ''}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Manifest Items */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Manifest Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Requested Qty</TableCell>
                      <TableCell align="center">Dispatched Qty</TableCell>
                      <TableCell align="center">Batch No</TableCell>
                      <TableCell align="center">Expiry Date</TableCell>
                      <TableCell align="center">Serial Numbers</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedManifest.items.map((item, index) => (
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
                            {item.dispatchedQty}
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
                          <Typography variant="body2">
                            {item.serialNumbers.length > 0 ? 
                              item.serialNumbers.join(', ') : 'N/A'}
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
            Print Manifest
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

export default StockTransferOut;
