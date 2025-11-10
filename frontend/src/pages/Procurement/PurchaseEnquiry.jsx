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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Send,
  Search,
  QuestionAnswer,
  Person,
  CalendarToday,
  AttachMoney,
  Refresh,
  CheckCircle,
  Pending,
  Error,
} from '@mui/icons-material';

const PurchaseEnquiry = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);

  // Load data from API
  const [enquiries, setEnquiries] = useState([]);

  const [formData, setFormData] = useState({
    enquiryDate: new Date().toISOString().split('T')[0],
    requestedBy: '',
    department: '',
    priority: 'Medium',
    enquiryDetails: '',
    expectedResponseDate: '',
    items: [],
    suppliers: []
  });

  const [newItem, setNewItem] = useState({
    itemCode: '',
    description: '',
    quantity: 1,
    estimatedPrice: 0,
    total: 0
  });

  const departments = ['Inventory', 'IT', 'HR', 'Finance', 'Sales', 'Marketing'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['draft', 'sent', 'responses_received', 'quoted', 'cancelled'];

  // Map API response to frontend format
  const mapEnquiryFromAPI = (apiEnquiry) => {
    if (!apiEnquiry || !apiEnquiry.id) {
      return null; // Skip invalid entries
    }
    return {
      id: apiEnquiry.id,
      enquiry_number: apiEnquiry.enquiry_number || '',
      enquiryDate: apiEnquiry.enquiry_date || new Date().toISOString().split('T')[0],
      purchase_request: apiEnquiry.purchase_request || null,
      purchase_request_number: apiEnquiry.purchase_request_number || '',
      supplier: apiEnquiry.supplier || null,
      supplier_name: apiEnquiry.supplier_name || '',
      requestedBy: apiEnquiry.requested_by_name || apiEnquiry.requested_by || '',
      department: apiEnquiry.department || '',
      priority: apiEnquiry.priority || 'medium',
      expectedResponseDate: apiEnquiry.expected_response_date || '',
      status: apiEnquiry.status || 'draft',
      totalEstimatedValue: parseFloat(apiEnquiry.total_amount || 0),
      items: (apiEnquiry.items || []).map(item => ({
        id: item.id,
        itemCode: item.item_code || '',
        product: item.product || null,
        description: item.description || '',
        quantity: item.quantity || 0,
        estimatedPrice: parseFloat(item.unit_price || 0),
        total: parseFloat(item.total || 0)
      })),
      enquiryDetails: apiEnquiry.notes || '',
      created_at: apiEnquiry.created_at,
      updated_at: apiEnquiry.updated_at
    };
  };

  // Map frontend format to API format
  const mapEnquiryToAPI = (frontendEnquiry) => ({
    enquiry_date: frontendEnquiry.enquiryDate,
    purchase_request: frontendEnquiry.purchase_request || null,
    supplier: frontendEnquiry.supplier || null,
    status: frontendEnquiry.status || 'draft',
    notes: frontendEnquiry.enquiryDetails || '',
    items: frontendEnquiry.items.map(item => ({
      product: item.product || null,
      item_code: item.itemCode,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.estimatedPrice,
      total: item.total
    }))
  });

  // Load data from API
  useEffect(() => {
    loadPurchaseEnquiries();
    loadProducts();
    loadSuppliers();
    loadPurchaseRequests();
  }, []);

  const loadPurchaseEnquiries = async () => {
    try {
      setLoading(true);
      const response = await procurementService.getPurchaseEnquiries();
      const enquiriesData = response.results || response || [];
      const mappedEnquiries = Array.isArray(enquiriesData) 
        ? enquiriesData.map(mapEnquiryFromAPI).filter(Boolean) 
        : [];
      setEnquiries(mappedEnquiries);
    } catch (error) {
      console.error('Error loading purchase enquiries:', error);
      displayError('Failed to load purchase enquiries');
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts();
      const productsData = response.results || response || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error loading products:', error);
      // Don't show error to user, just set empty array
      setProducts([]);
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await supplierService.getSuppliers();
      const suppliersData = response.results || response || [];
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      // Don't show error to user, just set empty array
      setSuppliers([]);
    }
  };

  const loadPurchaseRequests = async () => {
    try {
      const response = await procurementService.getPurchaseRequests({ status: 'approved' });
      const requestsData = response.results || response || [];
      setPurchaseRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error) {
      console.error('Error loading purchase requests:', error);
      // Don't show error to user, just set empty array
      setPurchaseRequests([]);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingEnquiry(null);
  };

  const handleAdd = () => {
    setEditingEnquiry(null);
    setFormData({
      enquiryDate: new Date().toISOString().split('T')[0],
      requestedBy: '',
      department: '',
      priority: 'medium',
      enquiryDetails: '',
      expectedResponseDate: '',
      items: [],
      suppliers: []
    });
    setDialogOpen(true);
  };

  const handleEdit = (enquiry) => {
    setEditingEnquiry(enquiry);
    setFormData({
      enquiryDate: enquiry.enquiryDate,
      requestedBy: enquiry.requestedBy,
      department: enquiry.department,
      priority: enquiry.priority,
      enquiryDetails: enquiry.enquiryDetails,
      expectedResponseDate: enquiry.expectedResponseDate,
      items: enquiry.items,
      suppliers: enquiry.suppliers
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase enquiry?')) {
      return;
    }
    
    try {
      await procurementService.deletePurchaseEnquiry(id);
      setEnquiries(prev => prev.filter(enq => enq.id !== id));
      displaySuccess('Purchase Enquiry deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase enquiry:', error);
      displayError('Failed to delete purchase enquiry');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const enquiryData = {
        ...formData,
        status: editingEnquiry ? editingEnquiry.status : 'draft'
      };
      
      const apiData = mapEnquiryToAPI(enquiryData);
      
      let savedEnquiry;
      if (editingEnquiry) {
        savedEnquiry = await procurementService.updatePurchaseEnquiry(editingEnquiry.id, apiData);
        displaySuccess('Purchase Enquiry updated successfully');
      } else {
        savedEnquiry = await procurementService.createPurchaseEnquiry(apiData);
        displaySuccess('Purchase Enquiry created successfully');
      }
      
      await loadPurchaseEnquiries();
      setDialogOpen(false);
      setEditingEnquiry(null);
    } catch (error) {
      console.error('Error saving purchase enquiry:', error);
      displayError(error.response?.data?.detail || 'Failed to save purchase enquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.itemCode && newItem.description && newItem.quantity > 0 && newItem.estimatedPrice > 0) {
      const total = newItem.quantity * newItem.estimatedPrice;
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, total }]
      }));
      setNewItem({
        itemCode: '',
        description: '',
        quantity: 1,
        estimatedPrice: 0,
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
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'draft': return 'default';
      case 'sent': return 'info';
      case 'responses_received': 
      case 'responses received': return 'warning';
      case 'quoted': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    const priorityLower = (priority || '').toLowerCase();
    switch (priorityLower) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Enquiry ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Requested By</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Estimated Value</TableCell>
            <TableCell>Expected Response</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {enquiries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {loading ? 'Loading enquiries...' : 'No purchase enquiries found. Click "New Enquiry" to create one.'}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {enquiry.enquiry_number || enquiry.id}
                  </Typography>
                </TableCell>
                <TableCell>{enquiry.enquiryDate || '-'}</TableCell>
                <TableCell>{enquiry.requestedBy || '-'}</TableCell>
                <TableCell>{enquiry.department || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={enquiry.priority || 'medium'}
                    color={getPriorityColor(enquiry.priority || 'medium')}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={enquiry.status || 'draft'}
                    color={getStatusColor(enquiry.status || 'draft')}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    ₹{(enquiry.totalEstimatedValue || 0).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>{enquiry.expectedResponseDate || '-'}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(enquiry)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(enquiry.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  {enquiry.status === 'Sent' && (
                    <Tooltip title="View Responses">
                      <IconButton size="small" color="primary">
                        <QuestionAnswer />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Enquiry Date"
          type="date"
          value={formData.enquiryDate}
          onChange={(e) => setFormData(prev => ({ ...prev, enquiryDate: e.target.value }))}
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
          label="Expected Response Date"
          type="date"
          value={formData.expectedResponseDate}
          onChange={(e) => setFormData(prev => ({ ...prev, expectedResponseDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          multiple
          options={supplierList}
          value={formData.suppliers}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, suppliers: newValue }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Suppliers"
              placeholder="Choose suppliers to send enquiry"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Enquiry Details"
          multiline
          rows={3}
          value={formData.enquiryDetails}
          onChange={(e) => setFormData(prev => ({ ...prev, enquiryDetails: e.target.value }))}
        />
      </Grid>
    </Grid>
  );

  const renderItemForm = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Items for Enquiry
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
              label="Estimated Price"
              type="number"
              value={newItem.estimatedPrice}
              onChange={(e) => setNewItem(prev => ({ ...prev, estimatedPrice: parseFloat(e.target.value) || 0 }))}
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
              Items for Enquiry
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Estimated Price</TableCell>
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
                      <TableCell>₹{item.estimatedPrice.toLocaleString()}</TableCell>
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
                Total Estimated Value: ₹{formData.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
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
            title="Purchase Enquiry (PE)" 
            subtitle="Create and manage purchase enquiries for suppliers"
            showIcon={true}
            icon={<Search />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadPurchaseEnquiries}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            New Enquiry
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
            All Enquiries
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('draft')}
            startIcon={<Edit />}
          >
            Draft
          </Button>
          <Button
            variant={activeTab === 'sent' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('sent')}
            startIcon={<Send />}
          >
            Sent
          </Button>
          <Button
            variant={activeTab === 'responses' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('responses')}
            startIcon={<QuestionAnswer />}
          >
            Responses Received
          </Button>
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'list' ? 'All Purchase Enquiries' : 
               activeTab === 'draft' ? 'Draft Enquiries' :
               activeTab === 'sent' ? 'Sent Enquiries' : 'Responses Received'}
            </Typography>
            <Chip
              label={`${enquiries.length} enquiries`}
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
          {editingEnquiry ? 'Edit' : 'Create New'} Purchase Enquiry
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
            {editingEnquiry ? 'Update' : 'Save'} Enquiry
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

export default PurchaseEnquiry;
