import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import procurementService from '../../services/procurementService';
import productService from '../../services/productService';
import supplierService from '../../services/supplierService';
import { useNotification } from '../../contexts/NotificationContext';
import api from '../../services/api';
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
  Undo,
  LocalShipping,
  AssignmentReturn,
  Description,
  Calculate,
  Visibility,
  FileCopy,
} from '@mui/icons-material';

const PurchaseReturn = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReturn, setEditingReturn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [grns, setGrns] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);

  // Load data from API
  const [returns, setReturns] = useState([]);

  const [formData, setFormData] = useState({
    returnDate: new Date().toISOString().split('T')[0],
    supplier: '',
    invoiceId: '',
    grnId: '',
    returnReason: '',
    returnType: '',
    creditNoteNumber: '',
    items: [],
    remarks: ''
  });

  const [newItem, setNewItem] = useState({
    itemCode: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    total: 0,
    taxRate: 18,
    taxAmount: 0,
    reason: '',
    condition: 'Good'
  });

  const [returnInstructions, setReturnInstructions] = useState({
    returnMethod: 'Supplier Pickup',
    returnAddress: '',
    contactPerson: '',
    contactNumber: '',
    expectedReturnDate: ''
  });

  const statuses = ['draft', 'pending_approval', 'approved', 'returned', 'credited', 'cancelled'];
  const returnReasons = ['Defective Goods', 'Wrong Specification', 'Damaged in Transit', 'Wrong Item', 'Over Shipment', 'Customer Return'];
  const returnTypes = ['Quality Issue', 'Specification Mismatch', 'Transportation Damage', 'Order Error', 'Customer Request', 'Supplier Error'];
  const returnMethods = ['Supplier Pickup', 'Courier', 'Own Transport', 'Third Party'];
  const conditions = ['Good', 'Damaged', 'Defective', 'Used'];

  // Load data from API
  useEffect(() => {
    loadPurchaseReturns();
    loadProducts();
    loadSuppliers();
    loadGRNs();
    loadPurchaseInvoices();
  }, []);

  // Map API response to frontend format
  const mapReturnFromAPI = (apiReturn) => ({
    id: apiReturn.id,
    returnDate: apiReturn.return_date,
    supplier: apiReturn.supplier,
    supplier_name: apiReturn.supplier_name,
    grnId: apiReturn.grn,
    grn_number: apiReturn.grn_number,
    returnNumber: apiReturn.return_number,
    returnReason: apiReturn.return_reason || '',
    status: apiReturn.status || 'draft',
    totalAmount: parseFloat(apiReturn.subtotal || 0),
    taxAmount: parseFloat(apiReturn.tax_amount || 0),
    netAmount: parseFloat(apiReturn.total_amount || 0),
    items: (apiReturn.items || []).map(item => ({
      id: item.id,
      itemCode: item.item_code || '',
      product: item.product,
      product_name: item.product_name,
      description: item.description || '',
      quantity: item.quantity || 0,
      unitPrice: parseFloat(item.unit_price || 0),
      taxRate: parseFloat(item.tax_percentage || 0),
      taxAmount: parseFloat(item.tax_amount || 0),
      total: parseFloat(item.total || 0),
      reason: item.return_reason || '',
      condition: item.condition || 'Good'
    })),
    notes: apiReturn.notes || '',
    created_at: apiReturn.created_at,
    updated_at: apiReturn.updated_at
  });

  // Map frontend format to API format
  const mapReturnToAPI = (frontendReturn) => ({
    return_date: frontendReturn.returnDate,
    grn: frontendReturn.grnId || null,
    supplier: frontendReturn.supplier || null,
    return_reason: frontendReturn.returnReason || '',
    notes: frontendReturn.remarks || '',
    status: frontendReturn.status || 'draft',
    items: frontendReturn.items.map(item => ({
      product: item.product || null,
      item_code: item.itemCode,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      tax_percentage: item.taxRate || 0,
      return_reason: item.reason || '',
      condition: item.condition || 'Good'
    }))
  });

  const loadPurchaseReturns = async () => {
    try {
      setLoading(true);
      const response = await procurementService.getPurchaseReturns();
      const returnsData = response.results || response;
      const mappedReturns = Array.isArray(returnsData) ? returnsData.map(mapReturnFromAPI) : [];
      setReturns(mappedReturns);
    } catch (error) {
      console.error('Error loading purchase returns:', error);
      displayError('Failed to load purchase returns');
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

  const loadGRNs = async () => {
    try {
      const response = await procurementService.getGRNs();
      const grnsData = response.results || response;
      setGrns(Array.isArray(grnsData) ? grnsData : []);
    } catch (error) {
      console.error('Error loading GRNs:', error);
    }
  };

  const loadPurchaseInvoices = async () => {
    try {
      const response = await procurementService.getPurchaseInvoices();
      const invoicesData = response.results || response;
      setPurchaseInvoices(Array.isArray(invoicesData) ? invoicesData : []);
    } catch (error) {
      console.error('Error loading purchase invoices:', error);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingReturn(null);
  };

  const handleAdd = () => {
    setEditingReturn(null);
    setFormData({
      returnDate: new Date().toISOString().split('T')[0],
      supplier: '',
      invoiceId: '',
      grnId: '',
      returnReason: '',
      returnType: '',
      creditNoteNumber: '',
      items: [],
      remarks: ''
    });
    setReturnInstructions({
      returnMethod: 'Supplier Pickup',
      returnAddress: '',
      contactPerson: '',
      contactNumber: '',
      expectedReturnDate: ''
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleEdit = (returnItem) => {
    setEditingReturn(returnItem);
    setFormData({
      returnDate: returnItem.returnDate,
      supplier: returnItem.supplier,
      invoiceId: returnItem.invoiceId,
      grnId: returnItem.grnId,
      returnReason: returnItem.returnReason,
      returnType: returnItem.returnType,
      creditNoteNumber: returnItem.creditNoteNumber,
      items: returnItem.items,
      remarks: returnItem.remarks
    });
    setReturnInstructions(returnItem.returnInstructions);
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase return?')) {
      return;
    }
    
    try {
      await procurementService.deletePurchaseReturn(id);
      setReturns(prev => prev.filter(returnItem => returnItem.id !== id));
      displaySuccess('Purchase Return deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase return:', error);
      displayError('Failed to delete purchase return');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const returnData = {
        ...formData,
        supplier: formData.supplier || null,
        grnId: formData.grnId || null,
        status: editingReturn ? editingReturn.status : 'draft'
      };
      
      const apiData = mapReturnToAPI(returnData);
      
      let savedReturn;
      if (editingReturn) {
        savedReturn = await procurementService.updatePurchaseReturn(editingReturn.id, apiData);
        displaySuccess('Purchase Return updated successfully');
      } else {
        savedReturn = await procurementService.createPurchaseReturn(apiData);
        displaySuccess('Purchase Return created successfully');
      }
      
      await loadPurchaseReturns();
      setDialogOpen(false);
      setEditingReturn(null);
    } catch (error) {
      console.error('Error saving purchase return:', error);
      displayError(error.response?.data?.detail || 'Failed to save purchase return');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.itemCode && newItem.description && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const total = newItem.quantity * newItem.unitPrice;
      const taxAmount = total * (newItem.taxRate / 100);
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, total, taxAmount }]
      }));
      setNewItem({
        itemCode: '',
        description: '',
        quantity: 0,
        unitPrice: 0,
        total: 0,
        taxRate: 18,
        taxAmount: 0,
        reason: '',
        condition: 'Good'
      });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = formData.items.reduce((sum, item) => sum + item.taxAmount, 0);
    const netAmount = totalAmount + taxAmount;
    return { totalAmount, taxAmount, netAmount };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Pending Approval': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Returned': return 'info';
      case 'Credit Issued': return 'success';
      default: return 'default';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Good': return 'success';
      case 'Damaged': return 'warning';
      case 'Defective': return 'error';
      case 'Used': return 'info';
      default: return 'default';
    }
  };

  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Return ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Invoice ID</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Credit Note</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returns.map((returnItem) => (
            <TableRow key={returnItem.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {returnItem.id}
                </Typography>
              </TableCell>
              <TableCell>{returnItem.returnDate}</TableCell>
              <TableCell>{returnItem.supplier}</TableCell>
              <TableCell>{returnItem.invoiceId}</TableCell>
              <TableCell>
                <Chip
                  label={returnItem.returnReason}
                  color="info"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={returnItem.status}
                  color={getStatusColor(returnItem.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  ₹{returnItem.netAmount.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                {returnItem.creditNoteNumber ? (
                  <Chip
                    label={returnItem.creditNoteNumber}
                    color="success"
                    size="small"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(returnItem)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
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
                  <Tooltip title="Copy">
                    <IconButton size="small" color="secondary">
                      <FileCopy />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(returnItem.id)}>
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

  const renderForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Return Date"
          type="date"
          value={formData.returnDate}
          onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
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
          options={invoiceList}
          value={formData.invoiceId}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, invoiceId: newValue }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Invoice ID"
              placeholder="Select invoice"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={grnList}
          value={formData.grnId}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, grnId: newValue }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="GRN ID"
              placeholder="Select GRN"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Return Reason</InputLabel>
          <Select
            value={formData.returnReason}
            label="Return Reason"
            onChange={(e) => setFormData(prev => ({ ...prev, returnReason: e.target.value }))}
          >
            {returnReasons.map((reason) => (
              <MenuItem key={reason} value={reason}>{reason}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Return Type</InputLabel>
          <Select
            value={formData.returnType}
            label="Return Type"
            onChange={(e) => setFormData(prev => ({ ...prev, returnType: e.target.value }))}
          >
            {returnTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Credit Note Number"
          value={formData.creditNoteNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, creditNoteNumber: e.target.value }))}
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
          Return Items
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
          <Grid item xs={12} md={2}>
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
              label="Quantity"
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
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
              label="Tax Rate %"
              type="number"
              value={newItem.taxRate}
              onChange={(e) => setNewItem(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Return Reason"
              value={newItem.reason}
              onChange={(e) => setNewItem(prev => ({ ...prev, reason: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                value={newItem.condition}
                label="Condition"
                onChange={(e) => setNewItem(prev => ({ ...prev, condition: e.target.value }))}
              >
                {conditions.map((condition) => (
                  <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              sx={{ height: '56px' }}
            >
              Add Item
            </Button>
          </Grid>
        </Grid>

        {formData.items.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Return Items
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Tax Rate</TableCell>
                    <TableCell>Tax Amount</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>₹{item.total.toLocaleString()}</TableCell>
                      <TableCell>{item.taxRate}%</TableCell>
                      <TableCell>₹{item.taxAmount.toLocaleString()}</TableCell>
                      <TableCell>{item.reason}</TableCell>
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
              {(() => {
                const { totalAmount, taxAmount, netAmount } = calculateTotals();
                return (
                  <Box>
                    <Typography variant="body2">
                      Sub Total: ₹{totalAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Tax Amount: ₹{taxAmount.toLocaleString()}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Net Return Amount: ₹{netAmount.toLocaleString()}
                    </Typography>
                  </Box>
                );
              })()}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderReturnInstructions = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Return Instructions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Return Method</InputLabel>
              <Select
                value={returnInstructions.returnMethod}
                label="Return Method"
                onChange={(e) => setReturnInstructions(prev => ({ ...prev, returnMethod: e.target.value }))}
              >
                {returnMethods.map((method) => (
                  <MenuItem key={method} value={method}>{method}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Expected Return Date"
              type="date"
              value={returnInstructions.expectedReturnDate}
              onChange={(e) => setReturnInstructions(prev => ({ ...prev, expectedReturnDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Return Address"
              multiline
              rows={3}
              value={returnInstructions.returnAddress}
              onChange={(e) => setReturnInstructions(prev => ({ ...prev, returnAddress: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Person"
              value={returnInstructions.contactPerson}
              onChange={(e) => setReturnInstructions(prev => ({ ...prev, contactPerson: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Contact Number"
              value={returnInstructions.contactNumber}
              onChange={(e) => setReturnInstructions(prev => ({ ...prev, contactNumber: e.target.value }))}
              sx={{ mt: 2 }}
            />
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
            title="Purchase Return (PRN)" 
            subtitle="Manage purchase returns and supplier credit notes"
            showIcon={true}
            icon={<Undo />}
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
            startIcon={<AssignmentReturn />}
            onClick={handleAdd}
          >
            New Return
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
            All Returns
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('draft')}
            startIcon={<Edit />}
          >
            Draft
          </Button>
          <Button
            variant={activeTab === 'pending' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('pending')}
            startIcon={<Pending />}
          >
            Pending Approval
          </Button>
          <Button
            variant={activeTab === 'approved' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('approved')}
            startIcon={<CheckCircle />}
          >
            Approved
          </Button>
          <Button
            variant={activeTab === 'returned' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('returned')}
            startIcon={<LocalShipping />}
          >
            Returned
          </Button>
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'list' ? 'All Purchase Returns' : 
               activeTab === 'draft' ? 'Draft Returns' :
               activeTab === 'pending' ? 'Pending Approval' :
               activeTab === 'approved' ? 'Approved Returns' : 'Returned Items'}
            </Typography>
            <Chip
              label={`${returns.length} Returns`}
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
          {editingReturn ? 'Edit' : 'Create New'} Purchase Return
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Return Details</StepLabel>
              </Step>
              <Step>
                <StepLabel>Items & Pricing</StepLabel>
              </Step>
              <Step>
                <StepLabel>Return Instructions</StepLabel>
              </Step>
            </Stepper>

            {activeStep === 0 && renderForm()}
            {activeStep === 1 && renderItemForm()}
            {activeStep === 2 && renderReturnInstructions()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>
              Back
            </Button>
          )}
          {activeStep < 2 ? (
            <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained">
              Next
            </Button>
          ) : (
            <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
              {editingReturn ? 'Update' : 'Save'} Return
            </Button>
          )}
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

export default PurchaseReturn;
