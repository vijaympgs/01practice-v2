import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import procurementService from '../../services/procurementService';
import productService from '../../services/productService';
import supplierService from '../../services/supplierService';
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
  LocalShipping,
  Receipt,
  Warning,
  ExpandMore,
} from '@mui/icons-material';

const GoodsReceivedNote = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGRN, setEditingGRN] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [locations, setLocations] = useState([]);

  // Load data from API
  const [grns, setGrns] = useState([]);

  const [formData, setFormData] = useState({
    grnDate: new Date().toISOString().split('T')[0],
    supplier: '',
    purchaseOrderId: '',
    deliveryNote: '',
    challanNumber: '',
    receivedBy: '',
    inspectedBy: '',
    location: '',
    remarks: '',
    items: []
  });

  const [newItem, setNewItem] = useState({
    itemCode: '',
    description: '',
    orderedQty: 0,
    receivedQty: 0,
    acceptedQty: 0,
    rejectedQty: 0,
    unitPrice: 0,
    total: 0,
    batchNumber: '',
    expiryDate: '',
    condition: 'Good',
    remarks: ''
  });

  const statuses = ['draft', 'partial', 'complete', 'rejected', 'under_inspection'];
  const conditions = ['good', 'damaged', 'defective', 'incomplete'];

  // Load data from API
  useEffect(() => {
    loadGRNs();
    loadProducts();
    loadSuppliers();
    loadPurchaseOrders();
    loadLocations();
  }, []);

  const loadGRNs = async () => {
    try {
      setLoading(true);
      const response = await procurementService.getGoodsReceivedNotes();
      const grnsData = response.results || response;
      const mappedGRNs = Array.isArray(grnsData) ? grnsData.map(mapGRNFromAPI) : [];
      setGrns(mappedGRNs);
    } catch (error) {
      console.error('Error loading GRNs:', error);
      displayError('Failed to load Goods Received Notes');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts();
      const productsData = response.results || response;
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await supplierService.getSuppliers();
      const suppliersData = response.results || response;
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const loadPurchaseOrders = async () => {
    try {
      const response = await procurementService.getPurchaseOrders({ status: 'order_placed' });
      const ordersData = response.results || response;
      setPurchaseOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await api.get('/organization/locations/');
      const locationsData = response.data.results || response.data;
      setLocations(Array.isArray(locationsData) ? locationsData : []);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  // Map API response to frontend format
  const mapGRNFromAPI = (apiGRN) => ({
    id: apiGRN.id,
    grn_number: apiGRN.grn_number,
    grnDate: apiGRN.grn_date,
    purchase_order: apiGRN.purchase_order,
    order_number: apiGRN.order_number,
    supplier: apiGRN.supplier,
    supplier_name: apiGRN.supplier_name,
    status: apiGRN.status || 'draft',
    totalAmount: parseFloat(apiGRN.total_amount || 0),
    receivedAmount: parseFloat(apiGRN.received_amount || 0),
    pendingAmount: parseFloat(apiGRN.pending_amount || 0),
    deliveryNote: apiGRN.delivery_note || '',
    challanNumber: apiGRN.challan_number || '',
    receivedBy: apiGRN.received_by_name || '',
    inspectedBy: apiGRN.inspected_by_name || '',
    location: apiGRN.location,
    location_name: apiGRN.location_name,
    remarks: apiGRN.notes || '',
    items: (apiGRN.items || []).map(item => ({
      id: item.id,
      itemCode: item.item_code || '',
      product: item.product,
      description: item.description || '',
      orderedQty: item.ordered_quantity || 0,
      receivedQty: item.received_quantity || 0,
      acceptedQty: item.accepted_quantity || 0,
      rejectedQty: item.rejected_quantity || 0,
      unitPrice: parseFloat(item.unit_price || 0),
      total: parseFloat(item.total || 0),
      batchNumber: item.batch_number || '',
      expiryDate: item.expiry_date,
      condition: item.condition || 'good',
      remarks: item.remarks || ''
    })),
    created_at: apiGRN.created_at,
    updated_at: apiGRN.updated_at
  });

  // Map frontend format to API format
  const mapGRNToAPI = (frontendGRN) => ({
    grn_date: frontendGRN.grnDate,
    purchase_order: frontendGRN.purchaseOrderId || null,
    supplier: frontendGRN.supplier || null,
    delivery_note: frontendGRN.deliveryNote || '',
    challan_number: frontendGRN.challanNumber || '',
    received_by: frontendGRN.receivedBy || user?.id || null,
    inspected_by: frontendGRN.inspectedBy || null,
    location: frontendGRN.location || null,
    status: frontendGRN.status || 'draft',
    notes: frontendGRN.remarks || '',
    items: frontendGRN.items.map(item => ({
      product: item.product || null,
      item_code: item.itemCode,
      description: item.description,
      ordered_quantity: item.orderedQty,
      received_quantity: item.receivedQty,
      accepted_quantity: item.acceptedQty,
      rejected_quantity: item.rejectedQty,
      unit_price: item.unitPrice,
      batch_number: item.batchNumber || '',
      expiry_date: item.expiryDate || null,
      condition: item.condition || 'good',
      remarks: item.remarks || ''
    }))
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingGRN(null);
  };

  const handleAdd = () => {
    setEditingGRN(null);
    setFormData({
      grnDate: new Date().toISOString().split('T')[0],
      supplier: '',
      purchaseOrderId: '',
      deliveryNote: '',
      challanNumber: '',
      receivedBy: '',
      inspectedBy: '',
      location: '',
      remarks: '',
      items: []
    });
    setDialogOpen(true);
  };

  const handleEdit = (grn) => {
    setEditingGRN(grn);
    setFormData({
      grnDate: grn.grnDate,
      supplier: grn.supplier,
      purchaseOrderId: grn.purchaseOrderId,
      deliveryNote: grn.deliveryNote,
      challanNumber: grn.challanNumber,
      receivedBy: grn.receivedBy,
      inspectedBy: grn.inspectedBy,
      location: grn.location,
      remarks: grn.remarks,
      items: grn.items
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this GRN?')) {
      return;
    }
    
    try {
      await procurementService.deleteGoodsReceivedNote(id);
      setGrns(prev => prev.filter(grn => grn.id !== id));
      displaySuccess('GRN deleted successfully');
    } catch (error) {
      console.error('Error deleting GRN:', error);
      displayError('Failed to delete GRN');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const grnData = {
        ...formData,
        purchaseOrderId: formData.purchaseOrderId || null,
        supplier: formData.supplier || null,
        location: formData.location || null,
        status: editingGRN ? editingGRN.status : 'draft'
      };
      
      const apiData = mapGRNToAPI(grnData);
      
      let savedGRN;
      if (editingGRN) {
        savedGRN = await procurementService.updateGoodsReceivedNote(editingGRN.id, apiData);
        displaySuccess('GRN updated successfully');
      } else {
        savedGRN = await procurementService.createGoodsReceivedNote(apiData);
        displaySuccess('GRN created successfully');
      }
      
      await loadGRNs();
      setDialogOpen(false);
      setEditingGRN(null);
    } catch (error) {
      console.error('Error saving GRN:', error);
      displayError(error.response?.data?.detail || 'Failed to save GRN');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.itemCode && newItem.description && newItem.receivedQty > 0 && newItem.unitPrice > 0) {
      const total = newItem.acceptedQty * newItem.unitPrice;
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, total }]
      }));
      setNewItem({
        itemCode: '',
        description: '',
        orderedQty: 0,
        receivedQty: 0,
        acceptedQty: 0,
        rejectedQty: 0,
        unitPrice: 0,
        total: 0,
        batchNumber: '',
        expiryDate: '',
        condition: 'Good',
        remarks: ''
      });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleQuantityChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-calculate accepted qty if received qty changes
    if (field === 'receivedQty') {
      updatedItems[index].acceptedQty = value;
    }
    
    // Recalculate total
    updatedItems[index].total = updatedItems[index].acceptedQty * updatedItems[index].unitPrice;
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Partial': return 'warning';
      case 'Complete': return 'success';
      case 'Rejected': return 'error';
      case 'Under Inspection': return 'info';
      default: return 'default';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Good': return 'success';
      case 'Damaged': return 'warning';
      case 'Defective': return 'error';
      case 'Incomplete': return 'info';
      default: return 'default';
    }
  };

  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>GRN ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>PO ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Received Amount</TableCell>
            <TableCell>Pending Amount</TableCell>
            <TableCell>Received By</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grns.map((grn) => (
            <TableRow key={grn.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {grn.id}
                </Typography>
              </TableCell>
              <TableCell>{grn.grnDate}</TableCell>
              <TableCell>{grn.supplier}</TableCell>
              <TableCell>{grn.purchaseOrderId}</TableCell>
              <TableCell>
                <Chip
                  label={grn.status}
                  color={getStatusColor(grn.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  ₹{grn.receivedAmount.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color={grn.pendingAmount > 0 ? "warning.main" : "success.main"}>
                  ₹{grn.pendingAmount.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>{grn.receivedBy}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(grn)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(grn.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print">
                    <IconButton size="small" color="primary">
                      <Print />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Details">
                    <IconButton size="small" color="info">
                      <Receipt />
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

  const renderForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="GRN Date"
          type="date"
          value={formData.grnDate}
          onChange={(e) => setFormData(prev => ({ ...prev, grnDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={supplierList}
          value={formData.supplier}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, supplier: newValue }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Supplier"
              placeholder="Select supplier"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={poList}
          value={formData.purchaseOrderId}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, purchaseOrderId: newValue }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Purchase Order ID"
              placeholder="Select PO"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Delivery Note"
          value={formData.deliveryNote}
          onChange={(e) => setFormData(prev => ({ ...prev, deliveryNote: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Challan Number"
          value={formData.challanNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, challanNumber: e.target.value }))}
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
              <MenuItem key={location} value={location}>{location}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Received By"
          value={formData.receivedBy}
          onChange={(e) => setFormData(prev => ({ ...prev, receivedBy: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Inspected By"
          value={formData.inspectedBy}
          onChange={(e) => setFormData(prev => ({ ...prev, inspectedBy: e.target.value }))}
        />
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

  const renderItemForm = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Received Items
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Item Code"
              value={newItem.itemCode}
              onChange={(e) => setNewItem(prev => ({ ...prev, itemCode: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Description"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Ordered"
              type="number"
              value={newItem.orderedQty}
              onChange={(e) => setNewItem(prev => ({ ...prev, orderedQty: parseInt(e.target.value) || 0 }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Received"
              type="number"
              value={newItem.receivedQty}
              onChange={(e) => {
                const received = parseInt(e.target.value) || 0;
                setNewItem(prev => ({ 
                  ...prev, 
                  receivedQty: received,
                  acceptedQty: received
                }));
              }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Accepted"
              type="number"
              value={newItem.acceptedQty}
              onChange={(e) => setNewItem(prev => ({ ...prev, acceptedQty: parseInt(e.target.value) || 0 }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Rejected"
              type="number"
              value={newItem.rejectedQty}
              onChange={(e) => setNewItem(prev => ({ ...prev, rejectedQty: parseInt(e.target.value) || 0 }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Unit Price"
              type="number"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Batch No"
              value={newItem.batchNumber}
              onChange={(e) => setNewItem(prev => ({ ...prev, batchNumber: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              sx={{ height: '56px' }}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {formData.items.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Items Received
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Ordered</TableCell>
                    <TableCell>Received</TableCell>
                    <TableCell>Accepted</TableCell>
                    <TableCell>Rejected</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Batch</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.orderedQty}</TableCell>
                      <TableCell>{item.receivedQty}</TableCell>
                      <TableCell>{item.acceptedQty}</TableCell>
                      <TableCell>{item.rejectedQty}</TableCell>
                      <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>₹{item.total.toLocaleString()}</TableCell>
                      <TableCell>{item.batchNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.condition}
                          color={getConditionColor(item.condition)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleRemoveItem(index)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="h6">
                Total Received Amount: ₹{formData.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Goods Received Note (GRN)" 
            subtitle="Manage goods receipt and quality inspection processes"
            showIcon={true}
            icon={<LocalShipping />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            New GRN
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
          <Button
            variant={activeTab === 'list' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('list')}
            startIcon={<Search />}
          >
            All GRNs
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('draft')}
            startIcon={<Edit />}
          >
            Draft
          </Button>
          <Button
            variant={activeTab === 'partial' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('partial')}
            startIcon={<Warning />}
          >
            Partial
          </Button>
          <Button
            variant={activeTab === 'complete' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('complete')}
            startIcon={<CheckCircle />}
          >
            Complete
          </Button>
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'list' ? 'All Goods Received Notes' : 
               activeTab === 'draft' ? 'Draft GRNs' :
               activeTab === 'partial' ? 'Partial Receipts' : 'Complete Receipts'}
            </Typography>
            <Chip
              label={`${grns.length} GRNs`}
              color="primary"
              variant="outlined"
            />
          </Box>
          {renderList()}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          {editingGRN ? 'Edit' : 'Create New'} Goods Received Note
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {renderForm()}
            {renderItemForm()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
            {editingGRN ? 'Update' : 'Save'} GRN
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

export default GoodsReceivedNote;
