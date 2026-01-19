import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import procurementService from '../../services/procurementService';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Alert,
  Snackbar,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart,
  Refresh,
  Settings,
  Assessment,
  Help,
  FilterList,
  CheckCircle,
  Pending,
  Error,
  Schedule,
  LocalShipping,
  Receipt,
  Payment,
  Assignment,
  Search,
  Visibility,
} from '@mui/icons-material';

const PurchaseConsole = () => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  
  // Purchase data - empty initially
  const [purchases, setPurchases] = useState([]);

  // Current purchase details - empty initially
  const [currentPurchase, setCurrentPurchase] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    supplier: '',
    dateRange: new Date().toISOString().split('T')[0],
    status: '',
  });

  // Load purchases from API
  useEffect(() => {
    loadPurchases();
  }, [filters]);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await procurementService.getPurchases(filters);
      // setPurchases(response.data || []);
      
      // For now, set empty array
      setPurchases([]);
      
      if (purchases.length > 0) {
        setSelectedPurchase(purchases[0]);
        loadPurchaseDetails(purchases[0].id);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
      displayError('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchaseDetails = async (purchaseId) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await procurementService.getPurchaseDetails(purchaseId);
      // setCurrentPurchase(response.data);
      
      // For now, set null
      setCurrentPurchase(null);
    } catch (error) {
      console.error('Error loading purchase details:', error);
      displayError('Failed to load purchase details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSelect = (purchase) => {
    setSelectedPurchase(purchase);
    loadPurchaseDetails(purchase.id);
  };

  const handleCreatePR = () => {
    // TODO: Navigate to PR creation or open PR creation dialog
    navigate('/procurement/purchase-request');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Blocked': return 'error';
      case 'GRN Pending': return 'warning';
      case 'Skipped': return 'default';
      case 'Not Required': return 'default';
      case 'Not Applicable': return 'default';
      default: return 'default';
    }
  };

  const getStepIcon = (step, status) => {
    if (status === 'Completed') return <CheckCircle color="success" />;
    if (status === 'Pending') return <Pending color="warning" />;
    if (status === 'Blocked') return <Error color="error" />;
    return <Schedule color="disabled" />;
  };

  const renderLeftPanel = () => (
    <Card sx={{ height: 'calc(100vh - 200px)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Purchases
        </Typography>
        
        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Supplier</InputLabel>
                <Select
                  value={filters.supplier}
                  label="Supplier"
                  onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
                >
                  <MenuItem value="">All Suppliers</MenuItem>
                  {/* TODO: Load suppliers from API */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Date Range"
                type="date"
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Purchase List */}
        <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Loading purchases...
              </Typography>
            </Box>
          ) : purchases.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                No purchases found
              </Typography>
              <Button
                variant="contained"
                startIcon={<Assignment />}
                onClick={handleCreatePR}
                size="small"
              >
                Create Purchase Request
              </Button>
            </Box>
          ) : (
            purchases.map((purchase) => (
              <Card
                key={purchase.id}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  border: selectedPurchase?.id === purchase.id ? 2 : 1,
                  borderColor: selectedPurchase?.id === purchase.id ? 'primary.main' : 'divider',
                  bgcolor: selectedPurchase?.id === purchase.id ? 'primary.50' : 'background.paper',
                }}
                onClick={() => handlePurchaseSelect(purchase)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {purchase.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {purchase.supplier}
                  </Typography>
                  <Chip
                    label={purchase.status}
                    color={getStatusColor(purchase.status)}
                    size="small"
                  />
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderTimelinePanel = () => (
    <Card sx={{ height: 'calc(100vh - 200px)' }}>
      <CardContent>
        {/* Title Bar */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {currentPurchase ? `Purchase Order: ${currentPurchase.id}` : 'Purchase Console'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentPurchase ? 'Timeline showing procurement flow progress' : 'Select a purchase to view timeline'}
          </Typography>
        </Box>

        {currentPurchase ? (
          <>
            {/* Context Strip */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
                <Typography variant="body2">
                  <strong>{currentPurchase.supplier}</strong>
                </Typography>
                <Typography variant="body2">
                  <strong>{currentPurchase.company}</strong>
                </Typography>
                <Typography variant="body2">
                  <strong>{currentPurchase.location}</strong>
                </Typography>
                <Chip
                  label={currentPurchase.status}
                  color={getStatusColor(currentPurchase.status)}
                  size="small"
                />
              </Stack>
            </Box>

            {/* Timeline */}
            <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
              {currentPurchase.timeline?.map((step, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    border: step.current ? 2 : 1,
                    borderColor: step.current ? 'primary.main' : 'divider',
                    bgcolor: step.current ? 'primary.50' : 
                            step.status === 'Completed' ? 'grey.50' : 'background.paper',
                    opacity: step.status === 'Skipped' || step.status === 'Not Required' || step.status === 'Not Applicable' ? 0.6 : 1,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStepIcon(step.step, step.status)}
                        <Typography variant="subtitle2" fontWeight="bold">
                          {step.step}
                        </Typography>
                      </Box>
                      <Chip
                        label={step.status}
                        color={getStatusColor(step.status)}
                        size="small"
                      />
                    </Box>

                    {step.reference && (
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Reference:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {step.reference}
                          </Typography>
                        </Grid>
                        {step.date && (
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Date:
                            </Typography>
                            <Typography variant="body2">
                              {step.date}
                            </Typography>
                          </Grid>
                        )}
                        {step.requestedBy && (
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Requested By:
                            </Typography>
                            <Typography variant="body2">
                              {step.requestedBy}
                            </Typography>
                          </Grid>
                        )}
                        {step.department && (
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Department:
                            </Typography>
                            <Typography variant="body2">
                              {step.department}
                            </Typography>
                          </Grid>
                        )}
                        {step.paymentTerms && (
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Payment Terms:
                            </Typography>
                            <Typography variant="body2">
                              {step.paymentTerms}
                            </Typography>
                          </Grid>
                        )}
                        {step.totalAmount && (
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Total Amount:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              ${step.totalAmount.toLocaleString()}
                            </Typography>
                          </Grid>
                        )}
                        {step.deliveryDate && (
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Delivery Date:
                            </Typography>
                            <Typography variant="body2">
                              {step.deliveryDate}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    )}

                    {step.note && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {step.note}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Items Table */}
            {currentPurchase.items && currentPurchase.items.length > 0 && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Ordered</TableCell>
                          <TableCell align="right">Received</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentPurchase.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{item.ordered}</TableCell>
                            <TableCell align="right" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                              {item.received}
                            </TableCell>
                            <TableCell align="right">${item.unitPrice.toLocaleString()}</TableCell>
                            <TableCell align="right">${item.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}

            {/* Financial Summary */}
            {currentPurchase.financialSummary && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Financial Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal
                      </Typography>
                      <Typography variant="h6">
                        ${currentPurchase.financialSummary.subtotal.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="text.secondary">
                        Tax
                      </Typography>
                      <Typography variant="h6">
                        ${currentPurchase.financialSummary.tax.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="text.secondary">
                        Variance
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        ${currentPurchase.financialSummary.variance.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        ${currentPurchase.financialSummary.total.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Purchase Selected
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select a purchase from the left panel to view its timeline
            </Typography>
            <Button
              variant="contained"
              startIcon={<Assignment />}
              onClick={handleCreatePR}
              sx={{ mt: 2 }}
            >
              Create Purchase Request
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderActionPanel = () => (
    <Card sx={{ height: 'calc(100vh - 200px)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Actions
        </Typography>

        {currentPurchase ? (
          <Stack spacing={2}>
            {/* Actions based on current step */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<Assignment />}
              onClick={handleCreatePR}
              sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Create PR
                </Typography>
                <Typography variant="caption" sx={{ color: 'primary.100' }}>
                  Start new purchase request
                </Typography>
              </Box>
            </Button>

            <Divider />

            {/* Future actions - disabled for now */}
            <Button
              variant="outlined"
              disabled
              fullWidth
              sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Create RFQ
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available after PR approval
                </Typography>
              </Box>
            </Button>

            <Button
              variant="outlined"
              disabled
              fullWidth
              sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Create PO
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available after quotation
                </Typography>
              </Box>
            </Button>

            <Button
              variant="outlined"
              disabled
              fullWidth
              sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Post GRN
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available after PO creation
                </Typography>
              </Box>
            </Button>

            <Button
              variant="outlined"
              disabled
              fullWidth
              sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Match Invoice
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available after GRN
                </Typography>
              </Box>
            </Button>

            <Button
              variant="outlined"
              disabled
              fullWidth
              sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Process Payment
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available after invoice matching
                </Typography>
              </Box>
            </Button>
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No purchase selected
            </Typography>
            <Button
              variant="contained"
              startIcon={<Assignment />}
              onClick={handleCreatePR}
            >
              Create Purchase Request
            </Button>
          </Box>
        )}

        {/* Configuration Note */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="caption" fontWeight="bold">
            Configuration Note
          </Typography>
          <Typography variant="caption" display="block">
            Action availability is controlled by Procurement Configuration (4.10).
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Purchase Console" 
            subtitle="Unified procurement flow management and timeline tracking"
            showIcon={true}
            icon={<ShoppingCart />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Settings />}
          >
            View Config
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
          >
            View Audit
          </Button>
          <Button
            variant="outlined"
            startIcon={<Help />}
          >
            Help
          </Button>
        </Box>
      </Box>

      {/* Main Content - 3 Column Layout */}
      <Grid container spacing={3}>
        {/* Left Panel - Purchase Selector */}
        <Grid item xs={12} md={3}>
          {renderLeftPanel()}
        </Grid>

        {/* Center Panel - Timeline */}
        <Grid item xs={12} md={6}>
          {renderTimelinePanel()}
        </Grid>

        {/* Right Panel - Actions */}
        <Grid item xs={12} md={3}>
          {renderActionPanel()}
        </Grid>
      </Grid>

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

export default PurchaseConsole;