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
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import {
  Assessment,
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
  QrCodeScanner,
  Assignment,
  PlayArrow,
  Pause,
  Stop
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StockTake = () => {
  const navigate = useNavigate();
  const { displaySuccess, displayError } = useNotification();
  const [stockTakes, setStockTakes] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStockTake, setSelectedStockTake] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load data from backend
  useEffect(() => {
    loadStockTakes();
    loadProducts();
    loadLocations();
  }, []);

  // Group StockMovements by reference_number (stock take ID) to create stock takes
  const groupMovementsToStockTakes = (movements) => {
    const stockTakeMap = {};
    
    movements.forEach(movement => {
      // Filter for physical count adjustments (reason contains "Physical Count" or "Stock Take")
      if (!movement.reason?.includes('Physical Count') && !movement.reason?.includes('Stock Take')) {
        return;
      }
      
      const refNum = movement.reference_number || `ST-${movement.id}`;
      if (!stockTakeMap[refNum]) {
        stockTakeMap[refNum] = {
          id: refNum,
          stockTakeDate: movement.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          location: movement.inventory?.location || '',
          locationCode: '',
          status: movement.status === 'completed' ? 'Completed' : movement.status === 'pending' ? 'In Progress' : 'Scheduled',
          totalItems: 0,
          countedItems: 0,
          progress: 0,
          initiatedBy: movement.created_by_name || 'System',
          teamMembers: [],
          scheduledStart: movement.created_at || '',
          scheduledEnd: null,
          actualStart: movement.status === 'completed' || movement.status === 'pending' ? movement.created_at : null,
          actualEnd: movement.status === 'completed' ? movement.updated_at : null,
          items: []
        };
      }
      
      const varianceQty = movement.quantity_change; // This is the adjustment amount
      const systemQty = movement.quantity_before;
      const countedQty = movement.quantity_after;
      
      stockTakeMap[refNum].items.push({
        productCode: movement.product_sku || '',
        productName: movement.product_name || '',
        systemQty: systemQty,
        countedQty: countedQty,
        varianceQty: varianceQty,
        varianceValue: parseFloat(movement.total_cost) || 0,
        batchNo: movement.reference_number || '',
        expiryDate: null,
        countedBy: movement.created_by_name || 'System',
        countTime: movement.created_at || '',
        notes: movement.notes || movement.reason || '',
        movementId: movement.id,
        inventoryId: movement.inventory?.id
      });
      
      stockTakeMap[refNum].totalItems += 1;
      if (countedQty !== null && countedQty !== undefined) {
        stockTakeMap[refNum].countedItems += 1;
      }
    });
    
    // Calculate progress for each stock take
    Object.values(stockTakeMap).forEach(st => {
      st.progress = st.totalItems > 0 ? Math.round((st.countedItems / st.totalItems) * 100) : 0;
    });
    
    return Object.values(stockTakeMap);
  };

  const loadStockTakes = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getStockMovements({
        movement_type: 'adjustment',
        // Filter by reason containing "Physical Count" or "Stock Take"
      });
      
      const movements = response.data.results || response.data || [];
      const stockTakesList = groupMovementsToStockTakes(movements);
      setStockTakes(stockTakesList);
    } catch (error) {
      console.error('Error loading stock takes:', error);
      displayError('Failed to load stock takes');
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
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Scheduled': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleStart = async (stockTake) => {
    try {
      setLoading(true);
      // Update all movements in stock take to pending status (in progress)
      const updatePromises = stockTake.items.map(item => 
        api.patch(`/inventory/movements/${item.movementId}/`, {
          status: 'pending'
        })
      );
      
      await Promise.all(updatePromises);
      await loadStockTakes();
      displaySuccess(`Stock take ${stockTake.id} started`);
    } catch (error) {
      console.error('Error starting stock take:', error);
      displayError('Failed to start stock take');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async (stockTake) => {
    try {
      setLoading(true);
      // Note: Pausing might not change status, just log it
      displaySuccess(`Stock take ${stockTake.id} paused`);
    } catch (error) {
      console.error('Error pausing stock take:', error);
      displayError('Failed to pause stock take');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (stockTake) => {
    try {
      setLoading(true);
      // Update all movements in stock take to completed status
      const updatePromises = stockTake.items.map(item => 
        api.patch(`/inventory/movements/${item.movementId}/`, {
          status: 'completed'
        })
      );
      
      await Promise.all(updatePromises);
      await loadStockTakes();
      displaySuccess(`Stock take ${stockTake.id} completed`);
    } catch (error) {
      console.error('Error completing stock take:', error);
      displayError('Failed to complete stock take');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (stockTake) => {
    setSelectedStockTake(stockTake);
    setDialogOpen(true);
  };

  const filteredStockTakes = stockTakes.filter(stockTake => {
    const matchesSearch = stockTake.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stockTake.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || stockTake.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: stockTakes.length,
    completed: stockTakes.filter(st => st.status === 'Completed').length,
    inProgress: stockTakes.filter(st => st.status === 'In Progress').length,
    scheduled: stockTakes.filter(st => st.status === 'Scheduled').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment color="primary" />
          Stock Take
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Physical inventory counting and accuracy verification
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
                    Total Stock Takes
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
                    In Progress
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.inProgress}
                  </Typography>
                </Box>
                <PlayArrow color="info" sx={{ fontSize: 40 }} />
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
                    Scheduled
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.scheduled}
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
              placeholder="Search stock takes..."
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
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
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
                New Stock Take
              </Button>
              <Button
                variant="outlined"
                startIcon={<QrCodeScanner />}
                onClick={() => {}}
              >
                Scanner Mode
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadStockTakes}
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

      {/* Stock Takes Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stock Take ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Initiated By</TableCell>
              <TableCell align="center">Progress</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="center">Team Size</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Scheduled</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStockTakes.map((stockTake) => (
              <TableRow key={stockTake.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {stockTake.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {stockTake.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stockTake.locationCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {stockTake.initiatedBy}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={stockTake.progress} 
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stockTake.countedItems}/{stockTake.totalItems}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {stockTake.totalItems}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {stockTake.teamMembers.length}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={stockTake.status}
                    size="small"
                    color={getStatusColor(stockTake.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {stockTake.scheduledStart}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(stockTake)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Report">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => {}}
                      >
                        <Print />
                      </IconButton>
                    </Tooltip>
                    {stockTake.status === 'Scheduled' && (
                      <Tooltip title="Start Stock Take">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleStart(stockTake)}
                        >
                          <PlayArrow />
                        </IconButton>
                      </Tooltip>
                    )}
                    {stockTake.status === 'In Progress' && (
                      <Tooltip title="Complete Stock Take">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleComplete(stockTake)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    {stockTake.status === 'In Progress' && (
                      <Tooltip title="Pause Stock Take">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handlePause(stockTake)}
                        >
                          <Pause />
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

      {/* Stock Take Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          Stock Take Details - {selectedStockTake?.id}
        </DialogTitle>
        <DialogContent>
          {selectedStockTake && (
            <Box>
              {/* Stock Take Header */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Location Details
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedStockTake.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedStockTake.locationCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Progress Summary
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: '60%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={selectedStockTake.progress} 
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        </Box>
                        <Typography variant="h6">
                          {selectedStockTake.progress}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {selectedStockTake.countedItems} of {selectedStockTake.totalItems} items counted
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Team Members */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Team Members
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {selectedStockTake.teamMembers.map((member, index) => (
                  <Chip
                    key={index}
                    label={member}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>

              {/* Counted Items */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Counted Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">System Qty</TableCell>
                      <TableCell align="center">Counted Qty</TableCell>
                      <TableCell align="center">Variance</TableCell>
                      <TableCell align="right">Variance Value</TableCell>
                      <TableCell align="center">Counted By</TableCell>
                      <TableCell align="center">Count Time</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedStockTake.items.map((item, index) => (
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
                            {item.systemQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {item.countedQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            color={item.varianceQty > 0 ? 'success.main' : item.varianceQty < 0 ? 'error.main' : 'text.primary'}
                          >
                            {item.varianceQty > 0 ? '+' : ''}{item.varianceQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            color={item.varianceValue > 0 ? 'success.main' : item.varianceValue < 0 ? 'error.main' : 'text.primary'}
                          >
                            {item.varianceValue > 0 ? '+' : ''}₹{item.varianceValue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.countedBy}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.countTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.notes}
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
            Print Stock Take Report
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

export default StockTake;
