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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Send,
  Search,
  Description,
  Person,
  CalendarToday,
  AttachMoney,
  Refresh,
  CheckCircle,
  Pending,
  Error,
  ExpandMore,
  Compare,
  RequestQuote,
} from '@mui/icons-material';

const PurchaseQuotation = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseEnquiries, setPurchaseEnquiries] = useState([]);

  // Load data from API
  const [quotations, setQuotations] = useState([]);

  const [formData, setFormData] = useState({
    quotationDate: new Date().toISOString().split('T')[0],
    supplier: '',
    enquiryId: '',
    validUntil: '',
    terms: '',
    deliveryTime: '',
    notes: '',
    items: []
  });

  const [newItem, setNewItem] = useState({
    itemCode: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  const statuses = ['received', 'under_review', 'accepted', 'rejected', 'expired'];

  // Load data from API
  useEffect(() => {
    loadPurchaseQuotations();
    loadProducts();
    loadSuppliers();
    loadPurchaseEnquiries();
  }, []);

  const loadPurchaseQuotations = async () => {
    try {
      setLoading(true);
      const response = await procurementService.getPurchaseQuotations();
      const quotationsData = response.results || response;
      const mappedQuotations = Array.isArray(quotationsData) ? quotationsData.map(mapQuotationFromAPI) : [];
      setQuotations(mappedQuotations);
    } catch (error) {
      console.error('Error loading purchase quotations:', error);
      displayError('Failed to load purchase quotations');
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

  const loadPurchaseEnquiries = async () => {
    try {
      const response = await procurementService.getPurchaseEnquiries({ status: 'sent' });
      const enquiriesData = response.results || response;
      setPurchaseEnquiries(Array.isArray(enquiriesData) ? enquiriesData : []);
    } catch (error) {
      console.error('Error loading purchase enquiries:', error);
    }
  };

  // Map API response to frontend format
  const mapQuotationFromAPI = (apiQuotation) => ({
    id: apiQuotation.id,
    quotation_number: apiQuotation.quotation_number,
    quotationDate: apiQuotation.quotation_date,
    validUntil: apiQuotation.valid_until,
    purchase_enquiry: apiQuotation.purchase_enquiry,
    enquiry_number: apiQuotation.enquiry_number,
    supplier: apiQuotation.supplier,
    supplier_name: apiQuotation.supplier_name,
    status: apiQuotation.status || 'received',
    totalAmount: parseFloat(apiQuotation.total_amount || 0),
    subtotal: parseFloat(apiQuotation.subtotal || 0),
    tax_amount: parseFloat(apiQuotation.tax_amount || 0),
    discount_amount: parseFloat(apiQuotation.discount_amount || 0),
    items: (apiQuotation.items || []).map(item => ({
      id: item.id,
      itemCode: item.item_code || '',
      product: item.product,
      description: item.description || '',
      quantity: item.quantity || 0,
      unitPrice: parseFloat(item.unit_price || 0),
      discount_percentage: parseFloat(item.discount_percentage || 0),
      tax_percentage: parseFloat(item.tax_percentage || 0),
      total: parseFloat(item.total || 0),
      lead_time_days: item.lead_time_days || 0
    })),
    terms: apiQuotation.notes || '',
    created_at: apiQuotation.created_at,
    updated_at: apiQuotation.updated_at
  });

  // Map frontend format to API format
  const mapQuotationToAPI = (frontendQuotation) => ({
    quotation_date: frontendQuotation.quotationDate,
    valid_until: frontendQuotation.validUntil || null,
    purchase_enquiry: frontendQuotation.purchase_enquiry || null,
    supplier: frontendQuotation.supplier || null,
    status: frontendQuotation.status || 'received',
    notes: frontendQuotation.terms || '',
    items: frontendQuotation.items.map(item => ({
      product: item.product || null,
      item_code: item.itemCode,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      discount_percentage: item.discount_percentage || 0,
      tax_percentage: item.tax_percentage || 0,
      lead_time_days: item.lead_time_days || 0
    }))
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingQuotation(null);
  };

  const handleAdd = () => {
    setEditingQuotation(null);
    setFormData({
      quotationDate: new Date().toISOString().split('T')[0],
      supplier: '',
      enquiryId: '',
      validUntil: '',
      terms: '',
      deliveryTime: '',
      notes: '',
      items: []
    });
    setDialogOpen(true);
  };

  const handleEdit = (quotation) => {
    setEditingQuotation(quotation);
    setFormData({
      quotationDate: quotation.quotationDate,
      supplier: quotation.supplier,
      enquiryId: quotation.enquiryId,
      validUntil: quotation.validUntil,
      terms: quotation.terms,
      deliveryTime: quotation.deliveryTime,
      notes: quotation.notes,
      items: quotation.items
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase quotation?')) {
      return;
    }
    
    try {
      await procurementService.deletePurchaseQuotation(id);
      setQuotations(prev => prev.filter(quote => quote.id !== id));
      displaySuccess('Purchase Quotation deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase quotation:', error);
      displayError('Failed to delete purchase quotation');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const quotationData = {
        ...formData,
        purchase_enquiry: formData.enquiryId || null,
        status: editingQuotation ? editingQuotation.status : 'received'
      };
      
      const apiData = mapQuotationToAPI(quotationData);
      
      let savedQuotation;
      if (editingQuotation) {
        savedQuotation = await procurementService.updatePurchaseQuotation(editingQuotation.id, apiData);
        displaySuccess('Purchase Quotation updated successfully');
      } else {
        savedQuotation = await procurementService.createPurchaseQuotation(apiData);
        displaySuccess('Purchase Quotation created successfully');
      }
      
      await loadPurchaseQuotations();
      setDialogOpen(false);
      setEditingQuotation(null);
    } catch (error) {
      console.error('Error saving purchase quotation:', error);
      displayError(error.response?.data?.detail || 'Failed to save purchase quotation');
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
      case 'Received': return 'info';
      case 'Under Review': return 'warning';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      case 'Expired': return 'default';
      default: return 'default';
    }
  };

  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Quotation ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Enquiry ID</TableCell>
            <TableCell>Valid Until</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Delivery Time</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {quotation.id}
                </Typography>
              </TableCell>
              <TableCell>{quotation.quotationDate}</TableCell>
              <TableCell>{quotation.supplier}</TableCell>
              <TableCell>{quotation.enquiryId}</TableCell>
              <TableCell>{quotation.validUntil}</TableCell>
              <TableCell>
                <Chip
                  label={quotation.status}
                  color={getStatusColor(quotation.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  ₹{quotation.totalAmount.toLocaleString()}
                  {quotation.comparison.isBestPrice && (
                    <Chip label="Best Price" color="success" size="small" sx={{ ml: 1 }} />
                  )}
                </Typography>
              </TableCell>
              <TableCell>{quotation.deliveryTime}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(quotation)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(quotation.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Compare">
                    <IconButton size="small" color="primary">
                      <Compare />
                    </IconButton>
                  </Tooltip>
                  {quotation.status === 'Under Review' && (
                    <Tooltip title="Accept">
                      <IconButton size="small" color="success">
                        <CheckCircle />
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
          label="Quotation Date"
          type="date"
          value={formData.quotationDate}
          onChange={(e) => setFormData(prev => ({ ...prev, quotationDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Valid Until"
          type="date"
          value={formData.validUntil}
          onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
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
          options={enquiryList}
          value={formData.enquiryId}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, enquiryId: newValue }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Related Enquiry ID"
              placeholder="Select enquiry"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Payment Terms"
          value={formData.terms}
          onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
          placeholder="e.g., Net 30 days"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Delivery Time"
          value={formData.deliveryTime}
          onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
          placeholder="e.g., 15 days"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Notes"
          multiline
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </Grid>
    </Grid>
  );

  const renderItemForm = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quotation Items
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
              Quoted Items
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
                Total Quoted Amount: ₹{formData.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderComparisonView = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quotation Comparison for PE-2025-001
      </Typography>
      {quotations.filter(q => q.enquiryId === 'PE-2025-001').map((quotation, index) => (
        <Accordion key={quotation.id}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mr: 2 }}>
              <Typography variant="subtitle1">
                {quotation.supplier} - {quotation.id}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" fontWeight="bold">
                  ₹{quotation.totalAmount.toLocaleString()}
                </Typography>
                <Chip
                  label={`Rank ${quotation.comparison.rank}`}
                  color={quotation.comparison.isBestPrice ? 'success' : 'default'}
                  size="small"
                />
                {quotation.comparison.isBestPrice && (
                  <Chip label="Best Price" color="success" size="small" />
                )}
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Delivery Time: {quotation.deliveryTime}</Typography>
                <Typography variant="subtitle2">Terms: {quotation.terms}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Notes: {quotation.notes}</Typography>
                {quotation.comparison.savings > 0 && (
                  <Typography variant="subtitle2" color="success.main">
                    Savings: ₹{quotation.comparison.savings.toLocaleString()}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Purchase Quotation (PQ)" 
            subtitle="Manage supplier quotations and price comparisons"
            showIcon={true}
            icon={<RequestQuote />}
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
            New Quotation
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
            All Quotations
          </Button>
          <Button
            variant={activeTab === 'received' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('received')}
            startIcon={<Description />}
          >
            Received
          </Button>
          <Button
            variant={activeTab === 'under_review' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('under_review')}
            startIcon={<Pending />}
          >
            Under Review
          </Button>
          <Button
            variant={activeTab === 'comparison' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('comparison')}
            startIcon={<Compare />}
          >
            Comparison
          </Button>
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'list' ? 'All Purchase Quotations' : 
               activeTab === 'received' ? 'Received Quotations' :
               activeTab === 'under_review' ? 'Under Review' : 'Quotation Comparison'}
            </Typography>
            <Chip
              label={`${quotations.length} quotations`}
              color="primary"
              variant="outlined"
            />
          </Box>
          {activeTab === 'comparison' ? renderComparisonView() : renderList()}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingQuotation ? 'Edit' : 'Create New'} Purchase Quotation
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
            {editingQuotation ? 'Update' : 'Save'} Quotation
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

export default PurchaseQuotation;
