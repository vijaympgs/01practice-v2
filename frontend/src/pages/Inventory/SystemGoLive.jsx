import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import inventoryService from '../../services/inventoryService';
import productService from '../../services/productService';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Alert,
  Snackbar,
  Stack,
  Autocomplete,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Send,
  Search,
  Inventory,
  Person,
  CalendarToday,
  AttachMoney,
  Refresh,
  CheckCircle,
  Pending,
  Error,
  Print,
  Receipt,
  Warning,
  ExpandMore,
  PlayArrow,
  Stop,
  Upload,
  Download,
  Visibility,
  FileCopy,
  QrCodeScanner,
  Warehouse,
} from '@mui/icons-material';

const SystemGoLive = () => {
  const { displaySuccess, displayError } = useNotification();
  const [activeTab, setActiveTab] = useState('setup');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);
  const [systemStatus, setSystemStatus] = useState('Pre-Go-Live');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  // Opening stock entries from backend
  const [openingStockEntries, setOpeningStockEntries] = useState([]);

  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    location: '',
    itemCode: '',
    itemDescription: '',
    category: '',
    unitOfMeasure: 'PCS',
    openingQuantity: 0,
    unitCost: 0,
    totalValue: 0,
    batchNumber: '',
    expiryDate: '',
    condition: 'Good',
    remarks: '',
    productId: null
  });

  const [bulkUploadData, setBulkUploadData] = useState({
    file: null,
    template: 'standard',
    validation: true
  });

  const unitOfMeasures = ['PCS', 'KG', 'LTR', 'MTR', 'BOX', 'SET', 'PAIR'];
  const conditions = ['Good', 'Damaged', 'Defective', 'Used', 'New'];
  const statuses = ['Entered', 'Verified', 'Approved', 'Posted'];
  const systemStatuses = ['Pre-Go-Live', 'Go-Live Active', 'Post-Go-Live'];

  // Load data from backend
  useEffect(() => {
    loadOpeningStockEntries();
    loadProducts();
    loadLocations();
    loadCategories();
  }, []);

  // Map backend StockMovement to frontend format
  const mapMovementToEntry = (movement) => {
    return {
      id: movement.id,
      entryDate: movement.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      location: movement.inventory?.location || '',
      itemCode: movement.product_sku || '',
      itemDescription: movement.product_name || '',
      category: movement.inventory?.product?.category?.name || '',
      unitOfMeasure: 'PCS', // TODO: Get from product UOM
      openingQuantity: movement.quantity_change,
      unitCost: parseFloat(movement.unit_cost) || 0,
      totalValue: parseFloat(movement.total_cost) || (movement.quantity_change * (parseFloat(movement.unit_cost) || 0)),
      batchNumber: movement.reference_number || '',
      expiryDate: null,
      condition: 'Good',
      status: movement.status === 'completed' ? 'Verified' : 'Entered',
      enteredBy: movement.created_by_name || 'System',
      enteredDate: movement.created_at?.split('T')[0] || '',
      verifiedBy: movement.status === 'completed' ? movement.created_by_name : null,
      verifiedDate: movement.status === 'completed' ? movement.created_at?.split('T')[0] : null,
      remarks: movement.reason || movement.notes || '',
      inventoryId: movement.inventory?.id,
      productId: movement.inventory?.product?.id
    };
  };

  // Map frontend entry to backend StockMovement format
  const mapEntryToMovement = (entry, inventoryId) => {
    return {
      inventory: inventoryId,
      movement_type: 'adjustment',
      quantity_change: entry.openingQuantity,
      unit_cost: entry.unitCost.toString(),
      total_cost: entry.totalValue.toString(),
      reference_number: entry.batchNumber || '',
      reason: `Opening Stock Entry - ${entry.remarks || 'System Go-Live'}`,
      notes: entry.remarks || '',
      status: entry.status === 'Verified' ? 'completed' : 'pending'
    };
  };

  const loadOpeningStockEntries = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getStockMovements({
        movement_type: 'adjustment',
        // Filter by reason containing "Opening Stock" or get all adjustments
      });
      
      const movements = response.data.results || response.data || [];
      const entries = movements.map(mapMovementToEntry);
      setOpeningStockEntries(entries);
    } catch (error) {
      console.error('Error loading opening stock entries:', error);
      displayError('Failed to load opening stock entries');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts({ is_active: true });
      const productsList = response.results || response || [];
      setProducts(productsList);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await api.get('/organization/locations/');
      const locationsList = response.data.results || response.data || [];
      setLocations(locationsList.map(loc => ({
        id: loc.id ?? loc.uuid ?? loc.location_id ?? loc.name,
        name: loc.name || loc.location_name || loc.code || 'Unknown Location'
      })));
    } catch (error) {
      console.error('Error loading locations:', error);
      // Fallback to default locations
      setLocations([
        { id: 'main-warehouse', name: 'Main Warehouse' },
        { id: 'it-warehouse', name: 'IT Warehouse' },
        { id: 'branch-office-a', name: 'Branch Office A' },
        { id: 'branch-office-b', name: 'Branch Office B' },
        { id: 'store-location-1', name: 'Store Location 1' }
      ]);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories/categories/');
      const categoriesList = response.data.results || response.data || [];
      setCategories(categoriesList.map(cat => cat.name));
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to default categories
      setCategories(['Furniture', 'IT Equipment', 'Office Supplies', 'Electronics', 'Stationery', 'Machinery']);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingEntry(null);
  };

  const handleAdd = () => {
    setEditingEntry(null);
    setFormData({
      entryDate: new Date().toISOString().split('T')[0],
      location: '',
      itemCode: '',
      itemDescription: '',
      category: '',
      unitOfMeasure: 'PCS',
      openingQuantity: 0,
      unitCost: 0,
      totalValue: 0,
      batchNumber: '',
      expiryDate: '',
      condition: 'Good',
      remarks: '',
      productId: null
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleRefresh = async () => {
    await loadOpeningStockEntries();
    displaySuccess('Data refreshed successfully');
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      entryDate: entry.entryDate,
      location: entry.location,
      itemCode: entry.itemCode,
      itemDescription: entry.itemDescription,
      category: entry.category,
      unitOfMeasure: entry.unitOfMeasure,
      openingQuantity: entry.openingQuantity,
      unitCost: entry.unitCost,
      totalValue: entry.totalValue,
      batchNumber: entry.batchNumber,
      expiryDate: entry.expiryDate || '',
      condition: entry.condition,
      remarks: entry.remarks,
      productId: entry.productId || null
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opening stock entry?')) {
      return;
    }
    
    try {
      setLoading(true);
      await inventoryService.deleteStockMovement(id);
      await loadOpeningStockEntries();
      displaySuccess('Opening stock entry deleted successfully');
    } catch (error) {
      console.error('Error deleting opening stock entry:', error);
      displayError('Failed to delete opening stock entry');
    } finally {
      setLoading(false);
    }
  };

  // Get or create inventory for a product
  const getOrCreateInventory = async (productId, locationName, unitCost) => {
    try {
      // Try to get existing inventory
      const inventoryResponse = await inventoryService.getInventoryList({ product_id: productId, location: locationName });
      const inventoryList = inventoryResponse.data.results || inventoryResponse.data || [];
      
      if (inventoryList.length > 0) {
        return inventoryList[0].id;
      }
      
      // Create new inventory if doesn't exist
      // Note: Inventory is created automatically when StockMovement is created
      // But we need to ensure it exists first
      try {
        const newInventory = await inventoryService.createInventoryItem({
          product: productId,
          current_stock: 0,
          cost_price: unitCost.toString(),
          location: locationName,
          min_stock_level: 0,
          max_stock_level: 0,
          reorder_point: 0
        });
        return newInventory.data.id;
      } catch (createError) {
        // If creation fails, try to get again (might have been created)
        const retryResponse = await inventoryService.getInventoryList({ product_id: productId, location: locationName });
        const retryList = retryResponse.data.results || retryResponse.data || [];
        if (retryList.length > 0) {
          return retryList[0].id;
        }
        throw createError;
      }
    } catch (error) {
      console.error('Error getting/creating inventory:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!formData.location) {
      displayError('Please select a location');
      return;
    }

    if (!formData.itemCode) {
      displayError('Please select a product');
      return;
    }

    if (!formData.openingQuantity || formData.openingQuantity <= 0) {
      displayError('Opening quantity must be greater than zero');
      return;
    }

    try {
      setLoading(true);
      const totalValue = formData.openingQuantity * formData.unitCost;
      
      // Find product by SKU or ID
      const product = products.find(p => p.sku === formData.itemCode || p.id === formData.itemCode);
      if (!product) {
        displayError('Product not found. Please select a valid product.');
        return;
      }

      // Get or create inventory
      const inventoryId = await getOrCreateInventory(product.id, formData.location, formData.unitCost);
      
      const entryData = {
        ...formData,
        totalValue,
        status: 'Entered',
        productId: product.id
      };
      
      const movementData = mapEntryToMovement(entryData, inventoryId);

      if (editingEntry) {
        await inventoryService.updateStockMovement(editingEntry.id, movementData);
        displaySuccess('Opening stock entry updated successfully');
      } else {
        await inventoryService.createStockMovement(movementData);
        displaySuccess('Opening stock entry created successfully');
      }
      
      await loadOpeningStockEntries();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving opening stock entry:', error);
      displayError(error.response?.data?.detail || 'Failed to save opening stock entry');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      setLoading(true);
      const entry = openingStockEntries.find(e => e.id === id);
      if (!entry) {
        displayError('Entry not found');
        return;
      }

      await inventoryService.patchStockMovementStatus(id, {
        status: 'completed'
      });
      
      await loadOpeningStockEntries();
      displaySuccess('Opening stock entry verified successfully');
    } catch (error) {
      console.error('Error verifying opening stock entry:', error);
      displayError('Failed to verify opening stock entry');
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = () => {
    setSystemStatus('Go-Live Active');
    setSnackbar({
      open: true,
      message: 'System Go-Live activated successfully!',
      severity: 'success'
    });
  };

  const handleStopGoLive = () => {
    setSystemStatus('Post-Go-Live');
    setSnackbar({
      open: true,
      message: 'System Go-Live completed successfully!',
      severity: 'success'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entered': return 'warning';
      case 'Verified': return 'info';
      case 'Approved': return 'success';
      case 'Posted': return 'success';
      default: return 'default';
    }
  };

  const getSystemStatusColor = (status) => {
    switch (status) {
      case 'Pre-Go-Live': return 'warning';
      case 'Go-Live Active': return 'success';
      case 'Post-Go-Live': return 'info';
      default: return 'default';
    }
  };

  const renderSystemStatus = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            System Go-Live Status
          </Typography>
          <Chip
            label={systemStatus}
            color={getSystemStatusColor(systemStatus)}
            size="large"
          />
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" color="primary" gutterBottom>
                  {openingStockEntries.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Items Entered
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" color="success.main" gutterBottom>
                  {openingStockEntries.filter(entry => entry.status === 'Verified').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Items Verified
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" color="info.main" gutterBottom>
                  ₹{openingStockEntries.reduce((sum, entry) => sum + entry.totalValue, 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Opening Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          {systemStatus === 'Pre-Go-Live' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<PlayArrow />}
              onClick={handleGoLive}
              disabled={openingStockEntries.filter(entry => entry.status === 'Verified').length === 0}
            >
              Activate Go-Live
            </Button>
          )}
          {systemStatus === 'Go-Live Active' && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<Stop />}
              onClick={handleStopGoLive}
            >
              Complete Go-Live
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Download />}
          >
            Export Template
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload />}
          >
            Bulk Upload
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderList = () => {
    if (loading && openingStockEntries.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (openingStockEntries.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No opening stock entries found. Click "New Entry" to add one.
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Entry ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Item Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Total Value</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {openingStockEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {entry.id}
                </Typography>
              </TableCell>
              <TableCell>{entry.entryDate}</TableCell>
              <TableCell>{entry.location}</TableCell>
              <TableCell>{entry.itemCode}</TableCell>
              <TableCell>{entry.itemDescription}</TableCell>
              <TableCell>{entry.category}</TableCell>
              <TableCell>{entry.openingQuantity} {entry.unitOfMeasure}</TableCell>
              <TableCell>₹{entry.unitCost.toLocaleString()}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  ₹{entry.totalValue.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={entry.status}
                  color={getStatusColor(entry.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(entry)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  {entry.status === 'Entered' && (
                    <Tooltip title="Verify">
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleVerify(entry.id)}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="View">
                    <IconButton size="small" color="info">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print">
                    <IconButton size="small" color="primary">
                      <Print />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(entry.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Entry Date"
          type="date"
          value={formData.entryDate}
          onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Location</InputLabel>
          <Select
            value={formData.location}
            label="Location"
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          >
            {locations.map((location) => (
              <MenuItem key={location.id || location.name} value={location.name}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          fullWidth
          options={products}
          getOptionLabel={(option) => `${option.sku || option.id} - ${option.name || ''}`}
          value={products.find(p => p.sku === formData.itemCode || p.id === formData.itemCode) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setFormData(prev => ({
                ...prev,
                itemCode: newValue.sku || newValue.id,
                itemDescription: newValue.name || '',
                category: newValue.category?.name || '',
                productId: newValue.id
              }));
            } else {
              setFormData(prev => ({
                ...prev,
                itemCode: '',
                itemDescription: '',
                category: '',
                productId: null
              }));
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product (Search by SKU or Name)"
              placeholder="Type to search products..."
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Item Description"
          value={formData.itemDescription}
          disabled
          helperText="Auto-filled from product selection"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Category"
          value={formData.category}
          disabled
          helperText="Auto-filled from product selection"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Unit of Measure</InputLabel>
          <Select
            value={formData.unitOfMeasure}
            label="Unit of Measure"
            onChange={(e) => setFormData(prev => ({ ...prev, unitOfMeasure: e.target.value }))}
          >
            {unitOfMeasures.map((uom) => (
              <MenuItem key={uom} value={uom}>{uom}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Opening Quantity"
          type="number"
          value={formData.openingQuantity}
          onChange={(e) => {
            const qty = parseInt(e.target.value) || 0;
            const total = qty * formData.unitCost;
            setFormData(prev => ({ ...prev, openingQuantity: qty, totalValue: total }));
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Unit Cost"
          type="number"
          value={formData.unitCost}
          onChange={(e) => {
            const cost = parseFloat(e.target.value) || 0;
            const total = formData.openingQuantity * cost;
            setFormData(prev => ({ ...prev, unitCost: cost, totalValue: total }));
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Total Value"
          value={`₹${formData.totalValue.toLocaleString()}`}
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Batch Number"
          value={formData.batchNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Expiry Date"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Condition</InputLabel>
          <Select
            value={formData.condition}
            label="Condition"
            onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
          >
            {conditions.map((condition) => (
              <MenuItem key={condition} value={condition}>{condition}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Remarks"
          multiline
          rows={3}
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
        />
      </Grid>
    </Grid>
  );

  const renderBulkUpload = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Bulk Upload Opening Stock
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              fullWidth
            >
              Upload Excel File
              <input
                type="file"
                hidden
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setBulkUploadData(prev => ({ ...prev, file: e.target.files[0] }))}
              />
            </Button>
            {bulkUploadData.file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {bulkUploadData.file.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Template Type</InputLabel>
              <Select
                value={bulkUploadData.template}
                label="Template Type"
                onChange={(e) => setBulkUploadData(prev => ({ ...prev, template: e.target.value }))}
              >
                <MenuItem value="standard">Standard Template</MenuItem>
                <MenuItem value="detailed">Detailed Template</MenuItem>
                <MenuItem value="simple">Simple Template</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={bulkUploadData.validation}
                  onChange={(e) => setBulkUploadData(prev => ({ ...prev, validation: e.target.checked }))}
                />
              }
              label="Enable Data Validation"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Upload />}
              disabled={!bulkUploadData.file}
              fullWidth
            >
              Process Bulk Upload
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="System Go-Live - Opening Stock Entry" 
            subtitle="Initialize system with opening inventory quantities"
            showIcon={true}
            icon={<PlayArrow />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            disabled={systemStatus === 'Post-Go-Live'}
          >
            New Entry
          </Button>
        </Box>
      </Box>

      {/* System Status */}
      {renderSystemStatus()}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
          <Button
            variant={activeTab === 'setup' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('setup')}
            startIcon={<Inventory />}
          >
            Stock Entries
          </Button>
          <Button
            variant={activeTab === 'bulk' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('bulk')}
            startIcon={<Upload />}
          >
            Bulk Upload
          </Button>
          <Button
            variant={activeTab === 'reports' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('reports')}
            startIcon={<Receipt />}
          >
            Reports
          </Button>
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'setup' ? 'Opening Stock Entries' : 
               activeTab === 'bulk' ? 'Bulk Upload' : 'Opening Stock Reports'}
            </Typography>
            <Chip
              label={`${openingStockEntries.length} Entries`}
              color="primary"
              variant="outlined"
            />
          </Box>
          
          {activeTab === 'setup' && renderList()}
          {activeTab === 'bulk' && renderBulkUpload()}
          {activeTab === 'reports' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Opening Stock Reports Coming Soon
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingEntry ? 'Edit' : 'Create New'} Opening Stock Entry
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {renderForm()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
            {editingEntry ? 'Update' : 'Save'} Entry
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

export default SystemGoLive;
