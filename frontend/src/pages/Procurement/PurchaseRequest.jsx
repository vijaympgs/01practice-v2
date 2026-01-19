import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/common/PageTitle';
import procurementService from '../../services/procurementService';
import productService from '../../services/productService';
import itemMasterService from '../../services/itemMasterService';
import organizationService from '../../services/organizationService';
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
  Autocomplete,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Send,
  Search,
  Refresh,
  CheckCircle,
  Pending,
  Assignment,
  Block,
  Visibility
} from '@mui/icons-material';

const PurchaseRequest = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();

  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Data states
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    required_by_date: '',
    requesting_location: '',
    priority: 'NORMAL',
    supplier_hint: '',
    remarks: '',
    lines: []
  });

  const [newLine, setNewLine] = useState({
    item: null, // Selected item object
    uom: '',
    requested_qty: 1,
    required_by_date: '',
    line_remarks: ''
  });

  const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

  // Load initial data
  useEffect(() => {
    loadPurchaseRequisitions();
    loadMasterData();
  }, []);

  const loadPurchaseRequisitions = async () => {
    try {
      setLoading(true);
      const response = await procurementService.getPurchaseRequisitions();
      setRequests(response.results || response || []);
    } catch (error) {
      console.error('Error loading purchase requisitions:', error);
      displayError('Failed to load purchase requisitions');
    } finally {
      setLoading(false);
    }
  };

  const loadMasterData = async () => {
    try {
      const [itemsRes, uomsRes, locationsRes, suppliersRes] = await Promise.all([
        itemMasterService.getItems(),
        productService.getUOMs(),
        organizationService.getLocations(),
        supplierService.getSuppliers()
      ]);

      setItems(itemsRes.results || itemsRes || []);
      setUoms(uomsRes.results || uomsRes || []);
      setLocations(locationsRes.results || locationsRes || []);
      setSuppliers(suppliersRes.results || suppliersRes || []);
    } catch (error) {
      console.error('Error loading master data:', error);
      displayError('Failed to load master data');
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingRequest(null);
  };

  const handleAdd = () => {
    setEditingRequest(null);
    setFormData({
      required_by_date: '',
      requesting_location: '',
      priority: 'NORMAL',
      supplier_hint: '',
      remarks: '',
      lines: []
    });
    setDialogOpen(true);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setFormData({
      required_by_date: request.required_by_date || '',
      requesting_location: request.requesting_location || '',
      priority: request.priority || 'NORMAL',
      supplier_hint: request.supplier_hint || '',
      remarks: request.remarks || '',
      lines: request.lines.map(line => ({
        ...line,
        item: items.find(i => i.id === line.item) || { id: line.item, item_code: line.item_code, item_name: line.item_name },
        uom: line.uom
      }))
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase requisition?')) {
      return;
    }

    try {
      await procurementService.deletePurchaseRequisition(id);
      setRequests(prev => prev.filter(req => req.id !== id));
      displaySuccess('Purchase Requisition deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase requisition:', error);
      displayError('Failed to delete purchase requisition');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate
      if (!formData.requesting_location) {
        displayError('Requesting Location is required');
        setLoading(false);
        return;
      }
      if (formData.lines.length === 0) {
        displayError('At least one item line is required');
        setLoading(false);
        return;
      }

      const apiData = {
        company: locations.find(l => l.id === formData.requesting_location)?.company || null, // Assuming location has company
        requesting_location: formData.requesting_location,
        required_by_date: formData.required_by_date || null,
        priority: formData.priority,
        supplier_hint: formData.supplier_hint || null,
        remarks: formData.remarks,
        lines: formData.lines.map(line => ({
          item: line.item.id,
          uom: line.uom,
          requested_qty: line.requested_qty,
          required_by_date: line.required_by_date || null,
          line_remarks: line.line_remarks
        }))
      };

      // If company is missing from location, we might need to fetch it or handle it.
      // For now, let's assume the backend handles it or we pick the first company if not available.
      // Or better, let the backend infer company from location if possible, but the model requires company.
      // I'll try to find company from location.
      const location = locations.find(l => l.id === formData.requesting_location);
      if (location && location.company) {
        apiData.company = location.company;
      } else {
        // Fallback or error?
        // If location.company is an ID, it's fine.
      }

      let savedRequest;
      if (editingRequest) {
        savedRequest = await procurementService.updatePurchaseRequisition(editingRequest.id, apiData);
        displaySuccess('Purchase Requisition updated successfully');
      } else {
        savedRequest = await procurementService.createPurchaseRequisition(apiData);
        displaySuccess('Purchase Requisition created successfully');
      }

      await loadPurchaseRequisitions();
      setDialogOpen(false);
      setEditingRequest(null);
    } catch (error) {
      console.error('Error saving purchase requisition:', error);
      displayError(error.response?.data?.detail || 'Failed to save purchase requisition');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (id) => {
    try {
      await procurementService.submitPurchaseRequisition(id);
      displaySuccess('Purchase Requisition submitted successfully');
      loadPurchaseRequisitions();
    } catch (error) {
      displayError('Failed to submit purchase requisition');
    }
  };

  const handleApprove = async (id) => {
    try {
      await procurementService.approvePurchaseRequisition(id);
      displaySuccess('Purchase Requisition approved successfully');
      loadPurchaseRequisitions();
    } catch (error) {
      displayError('Failed to approve purchase requisition');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await procurementService.rejectPurchaseRequisition(id, reason);
      displaySuccess('Purchase Requisition rejected successfully');
      loadPurchaseRequisitions();
    } catch (error) {
      displayError('Failed to reject purchase requisition');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this PR?')) return;
    try {
      await procurementService.cancelPurchaseRequisition(id);
      displaySuccess('Purchase Requisition cancelled successfully');
      loadPurchaseRequisitions();
    } catch (error) {
      displayError('Failed to cancel purchase requisition');
    }
  };

  const handleAddLine = () => {
    if (newLine.item && newLine.uom && newLine.requested_qty > 0) {
      setFormData(prev => ({
        ...prev,
        lines: [...prev.lines, { ...newLine }]
      }));
      setNewLine({
        item: null,
        uom: '',
        requested_qty: 1,
        required_by_date: '',
        line_remarks: ''
      });
    } else {
      displayError('Please fill in Item, UOM and Quantity');
    }
  };

  const handleRemoveLine = (index) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'SUBMITTED': return 'info';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'CANCELLED': return 'error';
      case 'FULLY_ORDERED': return 'success';
      case 'PARTIALLY_ORDERED': return 'warning';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'success';
      case 'NORMAL': return 'info';
      case 'HIGH': return 'warning';
      case 'URGENT': return 'error';
      default: return 'default';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'list') return true;
    if (activeTab === 'draft') return req.pr_status === 'DRAFT';
    if (activeTab === 'pending') return req.pr_status === 'SUBMITTED';
    if (activeTab === 'approved') return req.pr_status === 'APPROVED';
    return true;
  });

  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>PR Number</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Requested By</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {request.pr_number}
                </Typography>
              </TableCell>
              <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{request.requested_by_name}</TableCell>
              <TableCell>{request.requesting_location_name}</TableCell>
              <TableCell>
                <Chip
                  label={request.priority}
                  color={getPriorityColor(request.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={request.pr_status}
                  color={getStatusColor(request.pr_status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{request.lines?.length || 0}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="View/Edit">
                    <IconButton size="small" onClick={() => handleEdit(request)}>
                      {request.pr_status === 'DRAFT' ? <Edit /> : <Visibility />}
                    </IconButton>
                  </Tooltip>

                  {request.pr_status === 'DRAFT' && (
                    <>
                      <Tooltip title="Submit">
                        <IconButton size="small" color="primary" onClick={() => handleSubmit(request.id)}>
                          <Send />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(request.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                  {request.pr_status === 'SUBMITTED' && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton size="small" color="success" onClick={() => handleApprove(request.id)}>
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton size="small" color="error" onClick={() => handleReject(request.id)}>
                          <Block />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                  {['APPROVED', 'SUBMITTED', 'DRAFT'].includes(request.pr_status) && (
                    <Tooltip title="Cancel">
                      <IconButton size="small" color="warning" onClick={() => handleCancel(request.id)}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {filteredRequests.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Requesting Location</InputLabel>
          <Select
            value={formData.requesting_location}
            label="Requesting Location"
            onChange={(e) => setFormData(prev => ({ ...prev, requesting_location: e.target.value }))}
            disabled={!!editingRequest && editingRequest.pr_status !== 'DRAFT'}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
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
            disabled={!!editingRequest && editingRequest.pr_status !== 'DRAFT'}
          >
            {priorities.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Required By Date"
          type="date"
          value={formData.required_by_date}
          onChange={(e) => setFormData(prev => ({ ...prev, required_by_date: e.target.value }))}
          InputLabelProps={{ shrink: true }}
          disabled={!!editingRequest && editingRequest.pr_status !== 'DRAFT'}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Suggested Supplier (Optional)</InputLabel>
          <Select
            value={formData.supplier_hint}
            label="Suggested Supplier (Optional)"
            onChange={(e) => setFormData(prev => ({ ...prev, supplier_hint: e.target.value }))}
            disabled={!!editingRequest && editingRequest.pr_status !== 'DRAFT'}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {suppliers.map((sup) => (
              <MenuItem key={sup.id} value={sup.id}>{sup.company_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Remarks"
          multiline
          rows={2}
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
          disabled={!!editingRequest && editingRequest.pr_status !== 'DRAFT'}
        />
      </Grid>
    </Grid>
  );

  const renderLineForm = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Items
        </Typography>

        {(!editingRequest || editingRequest.pr_status === 'DRAFT') && (
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={items}
                getOptionLabel={(option) => `${option.item_code} - ${option.item_name}`}
                value={newLine.item}
                onChange={(event, newValue) => {
                  setNewLine(prev => ({
                    ...prev,
                    item: newValue,
                    uom: newValue?.purchase_uom || newValue?.base_uom || '' // Auto-select UOM if available
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Item" />}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>UOM</InputLabel>
                <Select
                  value={newLine.uom}
                  label="UOM"
                  onChange={(e) => setNewLine(prev => ({ ...prev, uom: e.target.value }))}
                >
                  {uoms.map((uom) => (
                    <MenuItem key={uom.id} value={uom.id}>{uom.code}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newLine.requested_qty}
                onChange={(e) => setNewLine(prev => ({ ...prev, requested_qty: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Line Remarks"
                value={newLine.line_remarks}
                onChange={(e) => setNewLine(prev => ({ ...prev, line_remarks: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                onClick={handleAddLine}
                startIcon={<Add />}
                fullWidth
                sx={{ height: '56px' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        )}

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>UOM</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.lines.map((line, index) => (
                <TableRow key={index}>
                  <TableCell>{line.item?.item_code} - {line.item?.item_name}</TableCell>
                  <TableCell>{uoms.find(u => u.id === line.uom)?.code || line.uom_code || line.uom}</TableCell>
                  <TableCell>{line.requested_qty}</TableCell>
                  <TableCell>{line.line_remarks}</TableCell>
                  <TableCell>
                    {(!editingRequest || editingRequest.pr_status === 'DRAFT') && (
                      <IconButton size="small" onClick={() => handleRemoveLine(index)}>
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {formData.lines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No items added</TableCell>
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
        <PageTitle
          title="Purchase Requisition"
          subtitle="Manage internal purchase requests"
          showIcon={true}
          icon={<Assignment />}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadPurchaseRequisitions}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            New Requisition
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
            All Requests
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('draft')}
            startIcon={<Edit />}
          >
            Drafts
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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderList()
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingRequest ? (editingRequest.pr_status === 'DRAFT' ? 'Edit Requisition' : 'View Requisition') : 'Create New Requisition'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {renderForm()}
            {renderLineForm()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Close
          </Button>
          {(!editingRequest || editingRequest.pr_status === 'DRAFT') && (
            <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
              {editingRequest ? 'Update' : 'Save'}
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

export default PurchaseRequest;
