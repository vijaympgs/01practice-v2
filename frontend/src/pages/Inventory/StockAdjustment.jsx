import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch
} from '@mui/material';
import {
  Assignment,
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  GetApp,
  Refresh,
  CheckCircle,
  Cancel,
  Warning,
  Inventory,
  Person,
  Print,
  Visibility,
  ExpandMore,
  TrendingUp,
  TrendingDown,
  Assessment,
  PostAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StockAdjustment = () => {
  const navigate = useNavigate();
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  useEffect(() => {
    const mockAdjustments = [
      {
        id: 'SA001',
        adjustmentDate: '2025-01-10',
        location: 'Main Warehouse A',
        locationCode: 'WH001',
        status: 'Posted',
        adjustmentType: 'Stock Take Variance',
        reason: 'Monthly stock take discrepancies',
        initiatedBy: 'John Smith',
        approvedBy: 'Jane Doe',
        postedBy: 'Mike Johnson',
        totalItems: 15,
        totalVarianceValue: 2750.00,
        stockTakeId: 'ST001',
        items: [
          {
            productCode: 'PROD001',
            productName: 'Premium Widget A',
            systemQty: 100,
            physicalQty: 98,
            varianceQty: -2,
            unitCost: 150.00,
            varianceValue: -300.00,
            batchNo: 'BATCH001',
            expiryDate: '2025-12-31',
            reason: 'Damaged during handling',
            adjustmentType: 'Damage'
          },
          {
            productCode: 'PROD002',
            productName: 'Standard Component B',
            systemQty: 50,
            physicalQty: 52,
            varianceQty: 2,
            unitCost: 190.00,
            varianceValue: 380.00,
            batchNo: 'BATCH002',
            expiryDate: '2025-11-30',
            reason: 'Found in back shelf',
            adjustmentType: 'Found'
          },
          {
            productCode: 'PROD003',
            productName: 'Advanced Module C',
            systemQty: 25,
            physicalQty: 23,
            varianceQty: -2,
            unitCost: 250.00,
            varianceValue: -500.00,
            batchNo: 'BATCH003',
            expiryDate: '2025-10-31',
            reason: 'Theft reported',
            adjustmentType: 'Theft'
          }
        ]
      },
      {
        id: 'SA002',
        adjustmentDate: '2025-01-09',
        location: 'Branch Store B',
        locationCode: 'ST001',
        status: 'Approved',
        adjustmentType: 'Damage Adjustment',
        reason: 'Water damage from leak',
        initiatedBy: 'Sarah Wilson',
        approvedBy: 'Tom Davis',
        postedBy: null,
        totalItems: 8,
        totalVarianceValue: -12500.00,
        stockTakeId: null,
        items: [
          {
            productCode: 'PROD004',
            productName: 'Testing Equipment D',
            systemQty: 20,
            physicalQty: 15,
            varianceQty: -5,
            unitCost: 2500.00,
            varianceValue: -12500.00,
            batchNo: 'BATCH004',
            expiryDate: '2025-09-30',
            reason: 'Water damage from roof leak',
            adjustmentType: 'Damage'
          }
        ]
      },
      {
        id: 'SA003',
        adjustmentDate: '2025-01-08',
        location: 'Branch Store C',
        locationCode: 'ST002',
        status: 'Pending Approval',
        adjustmentType: 'Expiry Adjustment',
        reason: 'Expired products disposal',
        initiatedBy: 'Lisa Brown',
        approvedBy: null,
        postedBy: null,
        totalItems: 12,
        totalVarianceValue: -8500.00,
        stockTakeId: null,
        items: [
          {
            productCode: 'PROD005',
            productName: 'Perishable Item E',
            systemQty: 30,
            physicalQty: 18,
            varianceQty: -12,
            unitCost: 708.33,
            varianceValue: -8500.00,
            batchNo: 'BATCH005',
            expiryDate: '2025-01-05',
            reason: 'Products expired and disposed',
            adjustmentType: 'Expiry'
          }
        ]
      }
    ];

    const mockProducts = [
      { code: 'PROD001', name: 'Premium Widget A', availableQty: 100 },
      { code: 'PROD002', name: 'Standard Component B', availableQty: 50 },
      { code: 'PROD003', name: 'Advanced Module C', availableQty: 25 },
      { code: 'PROD004', name: 'Testing Equipment D', availableQty: 50 },
      { code: 'PROD005', name: 'Perishable Item E', availableQty: 30 }
    ];

    const mockLocations = [
      { code: 'WH001', name: 'Main Warehouse A', type: 'Warehouse' },
      { code: 'ST001', name: 'Branch Store B', type: 'Store' },
      { code: 'ST002', name: 'Branch Store C', type: 'Store' },
      { code: 'ST003', name: 'Branch Store D', type: 'Store' }
    ];

    setAdjustments(mockAdjustments);
    setProducts(mockProducts);
    setLocations(mockLocations);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Posted': return 'success';
      case 'Approved': return 'info';
      case 'Pending Approval': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getAdjustmentTypeColor = (type) => {
    switch (type) {
      case 'Found': return 'success';
      case 'Damage': return 'error';
      case 'Theft': return 'error';
      case 'Expiry': return 'warning';
      default: return 'default';
    }
  };

  const handleApprove = (adjustment) => {
    // Implement approve logic
    setSnackbar({
      open: true,
      message: `Adjustment ${adjustment.id} approved`,
      severity: 'success'
    });
  };

  const handlePost = (adjustment) => {
    // Implement post logic
    setSnackbar({
      open: true,
      message: `Adjustment ${adjustment.id} posted to inventory`,
      severity: 'success'
    });
  };

  const handleReject = (adjustment) => {
    // Implement reject logic
    setSnackbar({
      open: true,
      message: `Adjustment ${adjustment.id} rejected`,
      severity: 'success'
    });
  };

  const handleView = (adjustment) => {
    setSelectedAdjustment(adjustment);
    setDialogOpen(true);
  };

  const filteredAdjustments = adjustments.filter(adjustment => {
    const matchesSearch = adjustment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adjustment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || adjustment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: adjustments.length,
    posted: adjustments.filter(a => a.status === 'Posted').length,
    approved: adjustments.filter(a => a.status === 'Approved').length,
    pendingApproval: adjustments.filter(a => a.status === 'Pending Approval').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <PageTitle 
          title="Variance Reconciliation & Posting" 
          subtitle="Review and post stock adjustments based on physical count variances"
          showIcon={true}
          icon={<Assignment />}
        />
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Adjustments
                  </Typography>
                  <Typography variant="h4">
                    {stats.total}
                  </Typography>
                </Box>
                <Inventory color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Posted
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.posted}
                  </Typography>
                </Box>
                <PostAdd color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Approved
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.approved}
                  </Typography>
                </Box>
                <CheckCircle color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Approval
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pendingApproval}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search adjustments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Posted">Posted</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
              >
                New Adjustment
              </Button>
              <Button
                variant="outlined"
                startIcon={<Assessment />}
                onClick={() => {}}
              >
                Variance Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => setLoading(true)}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Adjustments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Adjustment ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Initiated By</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="right">Total Variance</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdjustments.map((adjustment) => (
              <TableRow key={adjustment.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {adjustment.id}
                  </Typography>
                  {adjustment.stockTakeId && (
                    <Typography variant="caption" color="primary">
                      From: {adjustment.stockTakeId}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {adjustment.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {adjustment.locationCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {adjustment.adjustmentType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {adjustment.initiatedBy}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {adjustment.totalItems}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    color={adjustment.totalVarianceValue > 0 ? 'success.main' : adjustment.totalVarianceValue < 0 ? 'error.main' : 'text.primary'}
                  >
                    {adjustment.totalVarianceValue > 0 ? '+' : ''}₹{adjustment.totalVarianceValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={adjustment.status}
                    size="small"
                    color={getStatusColor(adjustment.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {adjustment.adjustmentDate}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(adjustment)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Report">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => {}}
                      >
                        <Print />
                      </IconButton>
                    </Tooltip>
                    {adjustment.status === 'Approved' && (
                      <Tooltip title="Post Adjustment">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handlePost(adjustment)}
                        >
                          <PostAdd />
                        </IconButton>
                      </Tooltip>
                    )}
                    {adjustment.status === 'Pending Approval' && (
                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleApprove(adjustment)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    {adjustment.status === 'Pending Approval' && (
                      <Tooltip title="Reject">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleReject(adjustment)}
                        >
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Adjustment Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          Variance Adjustment - {selectedAdjustment?.id}
        </DialogTitle>
        <DialogContent>
          {selectedAdjustment && (
            <Box>
              {/* Adjustment Header */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Location Details
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedAdjustment.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAdjustment.locationCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Adjustment Summary
                      </Typography>
                      <Typography variant="body2">
                        <strong>Type:</strong> {selectedAdjustment.adjustmentType}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Total Items:</strong> {selectedAdjustment.totalItems}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={selectedAdjustment.totalVarianceValue > 0 ? 'success.main' : selectedAdjustment.totalVarianceValue < 0 ? 'error.main' : 'text.primary'}
                      >
                        <strong>Total Variance:</strong> {selectedAdjustment.totalVarianceValue > 0 ? '+' : ''}₹{selectedAdjustment.totalVarianceValue.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Adjustment Items */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Adjustment Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">System Qty</TableCell>
                      <TableCell align="center">Physical Qty</TableCell>
                      <TableCell align="center">Variance Qty</TableCell>
                      <TableCell align="center">Adjustment Type</TableCell>
                      <TableCell align="center">Batch No</TableCell>
                      <TableCell align="center">Expiry Date</TableCell>
                      <TableCell align="right">Unit Cost</TableCell>
                      <TableCell align="right">Variance Value</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedAdjustment.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {item.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.productCode}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.systemQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {item.physicalQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            color={item.varianceQty > 0 ? 'success.main' : item.varianceQty < 0 ? 'error.main' : 'text.primary'}
                          >
                            {item.varianceQty > 0 ? '+' : ''}{item.varianceQty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={item.adjustmentType}
                            size="small"
                            color={getAdjustmentTypeColor(item.adjustmentType)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.batchNo}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.expiryDate}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ₹{item.unitCost.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            color={item.varianceValue > 0 ? 'success.main' : item.varianceValue < 0 ? 'error.main' : 'text.primary'}
                          >
                            {item.varianceValue > 0 ? '+' : ''}₹{item.varianceValue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.reason}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Print />}>
            Print Adjustment Report
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

export default StockAdjustment;
