import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import procurementService from '../../services/procurementService';
import productService from '../../services/productService';
import supplierService from '../../services/supplierService';
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Send,
  Search,
  Assignment,
  Person,
  CalendarToday,
  AttachMoney,
  Refresh,
  CheckCircle,
  Pending,
  Error,
  Print,
  Email,
  LocalShipping,
  Receipt,
  ShoppingCart,
} from '@mui/icons-material';

const PurchaseOrder = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [purchaseQuotations, setPurchaseQuotations] = useState([]);

  // Load data from API
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    supplier: '',
    quotationId: '',
    requestId: '',
    priority: 'Medium',
    deliveryDate: '',
    paymentTerms: '',
    deliveryAddress: '',
    specialInstructions: '',
    items: []
  });

  const [newItem, setNewItem] = useState({
    itemCode: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  const statuses = ['draft', 'pending_approval', 'approved', 'order_placed', 'partially_received', 'fully_received', 'invoice_received', 'closed', 'cancelled'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  // Load data from API
  useEffect(() => {
    loadPurchaseOrders();
    loadProducts();
    loadSuppliers();
    loadPurchaseRequests();
    loadPurchaseQuotations();
  }, []);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await procurementService.getPurchaseOrders();
      const ordersData = response.results || response;
      const mappedOrders = Array.isArray(ordersData) ? ordersData.map(mapOrderFromAPI) : [];
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
      displayError('Failed to load purchase orders');
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

  const loadPurchaseRequests = async () => {
    try {
      const response = await procurementService.getPurchaseRequests({ status: 'approved' });
      const requestsData = response.results || response;
      setPurchaseRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error) {
      console.error('Error loading purchase requests:', error);
    }
  };

  const loadPurchaseQuotations = async () => {
    try {
      const response = await procurementService.getPurchaseQuotations({ status: 'accepted' });
      const quotationsData = response.results || response;
      setPurchaseQuotations(Array.isArray(quotationsData) ? quotationsData : []);
    } catch (error) {
      console.error('Error loading purchase quotations:', error);
    }
  };

  // Map API response to frontend format
  const mapOrderFromAPI = (apiOrder) => ({
    id: apiOrder.id,
    order_number: apiOrder.order_number,
    orderDate: apiOrder.order_date,
    purchase_request: apiOrder.purchase_request,
    request_number: apiOrder.request_number,
    purchase_quotation: apiOrder.purchase_quotation,
    quotation_number: apiOrder.quotation_number,
    supplier: apiOrder.supplier,
    supplier_name: apiOrder.supplier_name,
    priority: apiOrder.priority || 'medium',
    deliveryDate: apiOrder.delivery_date,
    paymentTerms: apiOrder.payment_terms || '',
    deliveryAddress: apiOrder.delivery_address || '',
    specialInstructions: apiOrder.special_instructions || '',
    status: apiOrder.status || 'draft',
    totalAmount: parseFloat(apiOrder.total_amount || 0),
    subtotal: parseFloat(apiOrder.subtotal || 0),
    tax_amount: parseFloat(apiOrder.tax_amount || 0),
    discount_amount: parseFloat(apiOrder.discount_amount || 0),
    created_by_name: apiOrder.created_by_name,
    items: (apiOrder.items || []).map(item => ({
      id: item.id,
      itemCode: item.item_code || '',
      product: item.product,
      description: item.description || '',
      quantity: item.quantity || 0,
      unitPrice: parseFloat(item.unit_price || 0),
      discount_percentage: parseFloat(item.discount_percentage || 0),
      tax_percentage: parseFloat(item.tax_percentage || 0),
      received_quantity: parseFloat(item.received_quantity || 0),
      pending_quantity: parseFloat(item.pending_quantity || 0),
      total: parseFloat(item.total || 0),
      notes: item.notes || ''
    })),
    created_at: apiOrder.created_at,
    updated_at: apiOrder.updated_at
  });

  // Map frontend format to API format
  const mapOrderToAPI = (frontendOrder) => ({
    order_date: frontendOrder.orderDate,
    purchase_request: frontendOrder.purchase_request || null,
    purchase_quotation: frontendOrder.purchase_quotation || null,
    supplier: frontendOrder.supplier || null,
    priority: frontendOrder.priority || 'medium',
    delivery_date: frontendOrder.deliveryDate || null,
    payment_terms: frontendOrder.paymentTerms || '',
    delivery_address: frontendOrder.deliveryAddress || '',
    special_instructions: frontendOrder.specialInstructions || '',
    status: frontendOrder.status || 'draft',
    notes: '',
    items: frontendOrder.items.map(item => ({
      product: item.product || null,
      item_code: item.itemCode,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      discount_percentage: item.discount_percentage || 0,
      tax_percentage: item.tax_percentage || 0,
      notes: item.notes || ''
    }))
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingOrder(null);
  };

  const handleAdd = () => {
    setEditingOrder(null);
    setFormData({
      orderDate: new Date().toISOString().split('T')[0],
      supplier: '',
      quotationId: '',
      requestId: '',
      priority: 'Medium',
      deliveryDate: '',
      paymentTerms: '',
      deliveryAddress: '',
      specialInstructions: '',
      items: []
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      orderDate: order.orderDate,
      supplier: order.supplier,
      quotationId: order.quotationId,
      requestId: order.requestId,
      priority: order.priority,
      deliveryDate: order.deliveryDate,
      paymentTerms: order.paymentTerms,
      deliveryAddress: order.deliveryAddress,
      specialInstructions: order.specialInstructions,
      items: order.items.map(item => ({ ...item, receivedQty: 0 }))
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase order?')) {
      return;
    }
    
    try {
      await procurementService.deletePurchaseOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
      displaySuccess('Purchase Order deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      displayError('Failed to delete purchase order');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const orderData = {
        ...formData,
        purchase_request: formData.requestId || null,
        purchase_quotation: formData.quotationId || null,
        supplier: formData.supplier || null,
        status: editingOrder ? editingOrder.status : 'draft'
      };
      
      const apiData = mapOrderToAPI(orderData);
      
      let savedOrder;
      if (editingOrder) {
        savedOrder = await procurementService.updatePurchaseOrder(editingOrder.id, apiData);
        displaySuccess('Purchase Order updated successfully');
      } else {
        savedOrder = await procurementService.createPurchaseOrder(apiData);
        displaySuccess('Purchase Order created successfully');
      }
      
      await loadPurchaseOrders();
      setDialogOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error saving purchase order:', error);
      displayError(error.response?.data?.detail || 'Failed to save purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.itemCode && newItem.description && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const total = newItem.quantity * newItem.unitPrice;
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, total, receivedQty: 0 }]
      }));
      setNewItem({
        itemCode: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Pending Approval': return 'warning';
      case 'Approved': return 'info';
      case 'Order Placed': return 'primary';
      case 'Partially Received': return 'warning';
      case 'Fully Received': return 'success';
      case 'Invoice Received': return 'info';
      case 'Closed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      case 'Urgent': return 'error';
      default: return 'default';
    }
  };

  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>PO ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Quotation ID</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {order.id}
                </Typography>
              </TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>{order.supplier}</TableCell>
              <TableCell>{order.quotationId}</TableCell>
              <TableCell>
                <Chip
                  label={order.priority}
                  color={getPriorityColor(order.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  ₹{order.totalAmount.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>{order.deliveryDate}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(order)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(order.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print">
                    <IconButton size="small" color="primary">
                      <Print />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Email">
                    <IconButton size="small" color="primary">
                      <Email />
                    </IconButton>
                  </Tooltip>
                  {order.status === 'Order Placed' && (
                    <Tooltip title="Receive Goods">
                      <IconButton size="small" color="success">
                        <Receipt />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Order Date"
          type="date"
          value={formData.orderDate}
          onChange={(e) => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Delivery Date"
          type="date"
          value={formData.deliveryDate}
          onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
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
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={formData.priority}
            label="Priority"
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
          >
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>{priority}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={quotationList}
          value={formData.quotationId}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, quotationId: newValue }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Related Quotation ID"
              placeholder="Select quotation"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={requestList}
          value={formData.requestId}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, requestId: newValue }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Related Request ID"
              placeholder="Select request"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Payment Terms"
          value={formData.paymentTerms}
          onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
          placeholder="e.g., Net 30 days"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Delivery Address"
          multiline
          rows={2}
          value={formData.deliveryAddress}
          onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Special Instructions"
          multiline
          rows={2}
          value={formData.specialInstructions}
          onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
        />
      </Grid>
    </Grid>
  );

  const renderItemForm = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Item Code"
              value={newItem.itemCode}
              onChange={(e) => setNewItem(prev => ({ ...prev, itemCode: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Description"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Unit Price"
              type="number"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
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
              Ordered Items
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
                Total Order Amount: ₹{formData.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const steps = [
    {
      label: 'Basic Information',
      description: 'Enter order details and supplier information',
      content: renderBasicInfo()
    },
    {
      label: 'Order Items',
      description: 'Add items to the purchase order',
      content: renderItemForm()
    },
    {
      label: 'Review & Submit',
      description: 'Review order details and submit for approval',
      content: (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Order ID:</strong> {editingOrder ? editingOrder.id : `PO-2025-${String(orders.length + 1).padStart(3, '0')}`}</Typography>
              <Typography variant="body2"><strong>Supplier:</strong> {formData.supplier}</Typography>
              <Typography variant="body2"><strong>Order Date:</strong> {formData.orderDate}</Typography>
              <Typography variant="body2"><strong>Delivery Date:</strong> {formData.deliveryDate}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Payment Terms:</strong> {formData.paymentTerms}</Typography>
              <Typography variant="body2"><strong>Priority:</strong> {formData.priority}</Typography>
              <Typography variant="body2"><strong>Total Items:</strong> {formData.items.length}</Typography>
              <Typography variant="h6" color="primary">
                <strong>Total Amount:</strong> ₹{formData.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Purchase Order (PO)" 
            subtitle="Create and manage purchase orders to suppliers"
            showIcon={true}
            icon={<ShoppingCart />}
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
            New Order
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
            All Orders
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('draft')}
            startIcon={<Edit />}
          >
            Draft
          </Button>
          <Button
            variant={activeTab === 'approved' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('approved')}
            startIcon={<CheckCircle />}
          >
            Approved
          </Button>
          <Button
            variant={activeTab === 'in_progress' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('in_progress')}
            startIcon={<LocalShipping />}
          >
            In Progress
          </Button>
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'list' ? 'All Purchase Orders' : 
               activeTab === 'draft' ? 'Draft Orders' :
               activeTab === 'approved' ? 'Approved Orders' : 'Orders In Progress'}
            </Typography>
            <Chip
              label={`${orders.length} orders`}
              color="primary"
              variant="outlined"
            />
          </Box>
          {renderList()}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Edit' : 'Create New'} Purchase Order
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                    {step.content}
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => index === steps.length - 1 ? handleSave() : setActiveStep(index + 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Save Order' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(index - 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Cancel
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

export default PurchaseOrder;
