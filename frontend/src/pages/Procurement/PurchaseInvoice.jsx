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
  AccountBalance,
  Payment,
  Description,
  Calculate,
  Visibility,
  FileCopy,
} from '@mui/icons-material';

const PurchaseInvoice = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [grns, setGrns] = useState([]);

  // Load data from API
  const [invoices, setInvoices] = useState([]);

  const [formData, setFormData] = useState({
    invoiceDate: new Date().toISOString().split('T')[0],
    supplier: '',
    grnId: '',
    invoiceNumber: '',
    dueDate: '',
    paymentTerms: 'Net 30',
    discountAmount: 0,
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
    taxAmount: 0
  });

  const statuses = ['draft', 'pending_approval', 'approved', 'paid', 'partial_paid', 'cancelled'];
  const paymentTerms = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt', '2/10 Net 30'];

  // Load data from API
  useEffect(() => {
    loadPurchaseInvoices();
    loadProducts();
    loadSuppliers();
    loadGRNs();
  }, []);

  // Map API response to frontend format
  const mapInvoiceFromAPI = (apiInvoice) => ({
    id: apiInvoice.id,
    invoiceDate: apiInvoice.invoice_date,
    supplier: apiInvoice.supplier,
    supplier_name: apiInvoice.supplier_name,
    grnId: apiInvoice.grn,
    grn_number: apiInvoice.grn_number,
    invoiceNumber: apiInvoice.invoice_number,
    status: apiInvoice.status || 'pending_approval',
    totalAmount: parseFloat(apiInvoice.subtotal || 0),
    taxAmount: parseFloat(apiInvoice.tax_amount || 0),
    discountAmount: parseFloat(apiInvoice.discount_amount || 0),
    netAmount: parseFloat(apiInvoice.net_amount || 0),
    paidAmount: parseFloat(apiInvoice.paid_amount || 0),
    balanceAmount: parseFloat(apiInvoice.balance_amount || 0),
    dueDate: apiInvoice.due_date,
    paymentTerms: apiInvoice.payment_terms || '',
    items: (apiInvoice.items || []).map(item => ({
      id: item.id,
      itemCode: item.item_code || '',
      product: item.product,
      product_name: item.product_name,
      description: item.description || '',
      quantity: item.quantity || 0,
      unitPrice: parseFloat(item.unit_price || 0),
      taxRate: parseFloat(item.tax_percentage || 0),
      taxAmount: parseFloat(item.tax_amount || 0),
      discount_percentage: parseFloat(item.discount_percentage || 0),
      total: parseFloat(item.total || 0)
    })),
    notes: apiInvoice.notes || '',
    created_at: apiInvoice.created_at,
    updated_at: apiInvoice.updated_at
  });

  // Map frontend format to API format
  const mapInvoiceToAPI = (frontendInvoice) => ({
    invoice_date: frontendInvoice.invoiceDate,
    grn: frontendInvoice.grnId || null,
    supplier: frontendInvoice.supplier || null,
    due_date: frontendInvoice.dueDate || null,
    payment_terms: frontendInvoice.paymentTerms || '',
    discount_amount: parseFloat(frontendInvoice.discountAmount || 0),
    notes: frontendInvoice.remarks || '',
    status: frontendInvoice.status || 'pending_approval',
    items: frontendInvoice.items.map(item => ({
      product: item.product || null,
      item_code: item.itemCode,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      discount_percentage: item.discount_percentage || 0,
      tax_percentage: item.taxRate || 0
    }))
  });

  const loadPurchaseInvoices = async () => {
    try {
      setLoading(true);
      const response = await procurementService.getPurchaseInvoices();
      const invoicesData = response.results || response;
      const mappedInvoices = Array.isArray(invoicesData) ? invoicesData.map(mapInvoiceFromAPI) : [];
      setInvoices(mappedInvoices);
    } catch (error) {
      console.error('Error loading purchase invoices:', error);
      displayError('Failed to load purchase invoices');
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingInvoice(null);
  };

  const handleAdd = () => {
    setEditingInvoice(null);
    setFormData({
      invoiceDate: new Date().toISOString().split('T')[0],
      supplier: '',
      grnId: '',
      invoiceNumber: '',
      dueDate: '',
      paymentTerms: 'Net 30',
      discountAmount: 0,
      items: [],
      remarks: ''
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceDate: invoice.invoiceDate,
      supplier: invoice.supplier,
      grnId: invoice.grnId,
      invoiceNumber: invoice.invoiceNumber,
      dueDate: invoice.dueDate,
      paymentTerms: invoice.paymentTerms,
      discountAmount: invoice.discountAmount,
      items: invoice.items,
      remarks: invoice.remarks
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase invoice?')) {
      return;
    }
    
    try {
      await procurementService.deletePurchaseInvoice(id);
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      displaySuccess('Purchase Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase invoice:', error);
      displayError('Failed to delete purchase invoice');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const invoiceData = {
        ...formData,
        supplier: formData.supplier || null,
        grnId: formData.grnId || null,
        status: editingInvoice ? editingInvoice.status : 'pending_approval'
      };
      
      const apiData = mapInvoiceToAPI(invoiceData);
      
      let savedInvoice;
      if (editingInvoice) {
        savedInvoice = await procurementService.updatePurchaseInvoice(editingInvoice.id, apiData);
        displaySuccess('Purchase Invoice updated successfully');
      } else {
        savedInvoice = await procurementService.createPurchaseInvoice(apiData);
        displaySuccess('Purchase Invoice created successfully');
      }
      
      await loadPurchaseInvoices();
      setDialogOpen(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error saving purchase invoice:', error);
      displayError(error.response?.data?.detail || 'Failed to save purchase invoice');
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
        taxAmount: 0
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
    const netAmount = totalAmount + taxAmount - formData.discountAmount;
    return { totalAmount, taxAmount, netAmount };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'default';
      case 'pending_approval': return 'warning';
      case 'approved': return 'success';
      case 'paid': return 'success';
      case 'partial_paid': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Paid': return 'success';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Invoice #</TableCell>
            <TableCell>GRN ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {invoice.id}
                </Typography>
              </TableCell>
              <TableCell>{invoice.invoiceDate}</TableCell>
              <TableCell>{invoice.supplier}</TableCell>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.grnId}</TableCell>
              <TableCell>
                <Chip
                  label={invoice.status}
                  color={getStatusColor(invoice.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  ₹{invoice.netAmount.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  fontWeight="bold" 
                  color={invoice.balanceAmount > 0 ? "error.main" : "success.main"}
                >
                  ₹{invoice.balanceAmount.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2"
                  color={new Date(invoice.dueDate) < new Date() && invoice.balanceAmount > 0 ? "error.main" : "inherit"}
                >
                  {invoice.dueDate}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(invoice)}>
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
                    <IconButton size="small" onClick={() => handleDelete(invoice.id)}>
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
          label="Invoice Date"
          type="date"
          value={formData.invoiceDate}
          onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
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
        <TextField
          fullWidth
          label="Invoice Number"
          value={formData.invoiceNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
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
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Payment Terms</InputLabel>
          <Select
            value={formData.paymentTerms}
            label="Payment Terms"
            onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
          >
            {paymentTerms.map((term) => (
              <MenuItem key={term} value={term}>{term}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Discount Amount"
          type="number"
          value={formData.discountAmount}
          onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
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
          Invoice Items
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
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Total"
              value={newItem.quantity * newItem.unitPrice}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Tax"
              value={(newItem.quantity * newItem.unitPrice * newItem.taxRate / 100).toFixed(2)}
              disabled
            />
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
              Invoice Items
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
                    <Typography variant="body2">
                      Discount: ₹{formData.discountAmount.toLocaleString()}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Net Amount: ₹{netAmount.toLocaleString()}
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

  const renderPaymentSchedule = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Payment Schedule
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Due Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.items.length > 0 && (
                <TableRow>
                  <TableCell>{formData.dueDate}</TableCell>
                  <TableCell>₹{calculateTotals().netAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip label="Pending" color="warning" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Payment />}>
                      Pay
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Purchase Invoice (PI)" 
            subtitle="Process and manage supplier invoices"
            showIcon={true}
            icon={<Receipt />}
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
            New Invoice
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
            All Invoices
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
            variant={activeTab === 'overdue' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('overdue')}
            startIcon={<Warning />}
          >
            Overdue
          </Button>
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'list' ? 'All Purchase Invoices' : 
               activeTab === 'draft' ? 'Draft Invoices' :
               activeTab === 'pending' ? 'Pending Approval' :
               activeTab === 'approved' ? 'Approved Invoices' : 'Overdue Invoices'}
            </Typography>
            <Chip
              label={`${invoices.length} Invoices`}
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
          {editingInvoice ? 'Edit' : 'Create New'} Purchase Invoice
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Invoice Details</StepLabel>
              </Step>
              <Step>
                <StepLabel>Items & Pricing</StepLabel>
              </Step>
              <Step>
                <StepLabel>Payment Schedule</StepLabel>
              </Step>
            </Stepper>

            {activeStep === 0 && renderForm()}
            {activeStep === 1 && renderItemForm()}
            {activeStep === 2 && renderPaymentSchedule()}
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
              {editingInvoice ? 'Update' : 'Save'} Invoice
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

export default PurchaseInvoice;
