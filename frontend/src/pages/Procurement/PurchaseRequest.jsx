import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import procurementService from '../../services/procurementService';
import productService from '../../services/productService';
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
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  Divider,
  Stack,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Send,
  Print,
  Search,
  AttachMoney,
  Inventory,
  Person,
  CalendarToday,
  Description,
  Refresh,
  CheckCircle,
  Pending,
  Error,
  Assignment,
} from '@mui/icons-material';

const PurchaseRequest = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [products, setProducts] = useState([]);

  // Load data from API
  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    requestDate: new Date().toISOString().split('T')[0],
    requestedBy: '',
    department: '',
    priority: 'Medium',
    justification: '',
    expectedDelivery: '',
    items: []
  });

  const [newItem, setNewItem] = useState({
    itemCode: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  const departments = ['Inventory', 'IT', 'HR', 'Finance', 'Sales', 'Marketing'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['draft', 'pending', 'approved', 'rejected', 'converted'];

  // Load purchase requests from API
  useEffect(() => {
    loadPurchaseRequests();
    loadProducts();
  }, []);

  const loadPurchaseRequests = async () => {
    try {
      setLoading(true);
      const response = await procurementService.getPurchaseRequests();
      // Handle paginated response
      const requestsData = response.results || response;
      
      // Map backend fields to frontend format
      const mappedRequests = Array.isArray(requestsData) ? requestsData.map(mapRequestFromAPI) : [];
      setRequests(mappedRequests);
    } catch (error) {
      console.error('Error loading purchase requests:', error);
      displayError('Failed to load purchase requests');
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

  // Map API response to frontend format
  const mapRequestFromAPI = (apiRequest) => ({
    id: apiRequest.id,
    request_number: apiRequest.request_number,
    requestDate: apiRequest.request_date,
    requestedBy: apiRequest.requested_by_name || apiRequest.requested_by,
    requestedById: apiRequest.requested_by,
    department: apiRequest.department || '',
    priority: apiRequest.priority || 'medium',
    status: apiRequest.status || 'draft',
    totalAmount: parseFloat(apiRequest.total_amount || 0),
    items: (apiRequest.items || []).map(item => ({
      id: item.id,
      itemCode: item.item_code || item.product_code || '',
      product: item.product,
      productName: item.product_name || '',
      description: item.description || '',
      quantity: item.quantity || 0,
      unitPrice: parseFloat(item.unit_price || 0),
      total: parseFloat(item.total || 0),
      notes: item.notes || ''
    })),
    justification: apiRequest.justification || '',
    expectedDelivery: apiRequest.expected_delivery || '',
    approvalStatus: apiRequest.approval_status || 'Pending Approval',
    created_at: apiRequest.created_at,
    updated_at: apiRequest.updated_at
  });

  // Map frontend format to API format
  const mapRequestToAPI = (frontendRequest) => ({
    request_date: frontendRequest.requestDate,
    requested_by: frontendRequest.requestedById || user?.id,
    department: frontendRequest.department,
    priority: frontendRequest.priority,
    justification: frontendRequest.justification,
    expected_delivery: frontendRequest.expectedDelivery || null,
    status: frontendRequest.status || 'draft',
    items: frontendRequest.items.map(item => ({
      product: item.product || null,
      item_code: item.itemCode,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: item.total,
      notes: item.notes || ''
    }))
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingRequest(null);
  };

  const handleAdd = () => {
    setEditingRequest(null);
    setFormData({
      requestDate: new Date().toISOString().split('T')[0],
      requestedBy: '',
      department: '',
      priority: 'medium',
      justification: '',
      expectedDelivery: '',
      items: []
    });
    setDialogOpen(true);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setFormData({
      requestDate: request.requestDate,
      requestedBy: request.requestedBy,
      department: request.department,
      priority: request.priority,
      justification: request.justification,
      expectedDelivery: request.expectedDelivery,
      items: request.items
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase request?')) {
      return;
    }
    
    try {
      await procurementService.deletePurchaseRequest(id);
      setRequests(prev => prev.filter(req => req.id !== id));
      displaySuccess('Purchase Request deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase request:', error);
      displayError('Failed to delete purchase request');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const requestData = {
        ...formData,
        requestedById: user?.id,
        status: editingRequest ? editingRequest.status : 'draft'
      };
      
      const apiData = mapRequestToAPI(requestData);
      
      let savedRequest;
      if (editingRequest) {
        // Update existing request
        savedRequest = await procurementService.updatePurchaseRequest(editingRequest.id, apiData);
        displaySuccess('Purchase Request updated successfully');
      } else {
        // Create new request
        savedRequest = await procurementService.createPurchaseRequest(apiData);
        displaySuccess('Purchase Request created successfully');
      }
      
      // Reload requests to get updated data
      await loadPurchaseRequests();
      setDialogOpen(false);
      setEditingRequest(null);
    } catch (error) {
      console.error('Error saving purchase request:', error);
      displayError(error.response?.data?.detail || 'Failed to save purchase request');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.itemCode && newItem.description && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const total = newItem.quantity * newItem.unitPrice;
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, total }]
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
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Converted to PO': return 'info';
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
            <TableCell>Request ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Requested By</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Expected Delivery</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {request.id}
                </Typography>
              </TableCell>
              <TableCell>{request.requestDate}</TableCell>
              <TableCell>{request.requestedBy}</TableCell>
              <TableCell>{request.department}</TableCell>
              <TableCell>
                <Chip
                  label={request.priority}
                  color={getPriorityColor(request.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={request.status}
                  color={getStatusColor(request.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  ₹{request.totalAmount.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>{request.expectedDelivery}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(request)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(request.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  {request.status === 'Approved' && (
                    <Tooltip title="Convert to PO">
                      <IconButton size="small" color="primary">
                        <Send />
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

  const renderForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Request Date"
          type="date"
          value={formData.requestDate}
          onChange={(e) => setFormData(prev => ({ ...prev, requestDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Requested By"
          value={formData.requestedBy}
          onChange={(e) => setFormData(prev => ({ ...prev, requestedBy: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select
            value={formData.department}
            label="Department"
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <TextField
          fullWidth
          label="Expected Delivery Date"
          type="date"
          value={formData.expectedDelivery}
          onChange={(e) => setFormData(prev => ({ ...prev, expectedDelivery: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Justification"
          multiline
          rows={3}
          value={formData.justification}
          onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
        />
      </Grid>
    </Grid>
  );

  const renderItemForm = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Items
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
              Requested Items
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
                Total Amount: ₹{formData.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
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
            title="Purchase Request (PR)" 
            subtitle="Create and manage internal purchase requests"
            showIcon={true}
            icon={<Assignment />}
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
            New Request
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
            Request List
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('draft')}
            startIcon={<Edit />}
          >
            Draft Requests
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
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'list' ? 'All Purchase Requests' : 
               activeTab === 'draft' ? 'Draft Requests' :
               activeTab === 'pending' ? 'Pending Approval' : 'Approved Requests'}
            </Typography>
            <Chip
              label={`${requests.length} requests`}
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
          {editingRequest ? 'Edit' : 'Create New'} Purchase Request
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
            {editingRequest ? 'Update' : 'Save'} Request
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

export default PurchaseRequest;
