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
  Settings,
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
  Lock,
  LockOpen,
  Security,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StockFreeze = () => {
  const navigate = useNavigate();
  const [freezes, setFreezes] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFreeze, setSelectedFreeze] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  useEffect(() => {
    const mockFreezes = [
      {
        id: 'SF001',
        freezeDate: '2025-01-10',
        location: 'Main Warehouse A',
        locationCode: 'WH001',
        status: 'Active',
        freezeType: 'Full Location',
        scope: 'All Products',
        initiatedBy: 'John Smith',
        approvedBy: 'Jane Doe',
        scheduledStart: '2025-01-10 09:00',
        scheduledEnd: '2025-01-10 17:00',
        actualStart: '2025-01-10 09:00',
        actualEnd: null,
        reason: 'Monthly stock take',
        affectedItems: 150,
        restrictedOperations: ['Sales', 'Transfers', 'Issuances'],
        exceptions: []
      },
      {
        id: 'SF002',
        freezeDate: '2025-01-09',
        location: 'Branch Store B',
        locationCode: 'ST001',
        status: 'Completed',
        freezeType: 'Product Category',
        scope: 'Electronics',
        initiatedBy: 'Mike Johnson',
        approvedBy: 'Sarah Wilson',
        scheduledStart: '2025-01-09 08:00',
        scheduledEnd: '2025-01-09 16:00',
        actualStart: '2025-01-09 08:00',
        actualEnd: '2025-01-09 15:45',
        reason: 'Category-specific audit',
        affectedItems: 45,
        restrictedOperations: ['Sales', 'Transfers'],
        exceptions: ['Emergency sales with manager approval']
      },
      {
        id: 'SF003',
        freezeDate: '2025-01-08',
        location: 'Branch Store C',
        locationCode: 'ST002',
        status: 'Scheduled',
        freezeType: 'Specific Products',
        scope: 'High-Value Items',
        initiatedBy: 'Lisa Brown',
        approvedBy: 'Tom Davis',
        scheduledStart: '2025-01-12 09:00',
        scheduledEnd: '2025-01-12 17:00',
        actualStart: null,
        actualEnd: null,
        reason: 'Security audit for high-value inventory',
        affectedItems: 25,
        restrictedOperations: ['All Operations'],
        exceptions: []
      }
    ];

    const mockProducts = [
      { code: 'PROD001', name: 'Premium Widget A', category: 'Electronics', availableQty: 100 },
      { code: 'PROD002', name: 'Standard Component B', category: 'Components', availableQty: 50 },
      { code: 'PROD003', name: 'Advanced Module C', category: 'Electronics', availableQty: 25 },
      { code: 'PROD004', name: 'Testing Equipment D', category: 'Equipment', availableQty: 50 }
    ];

    const mockLocations = [
      { code: 'WH001', name: 'Main Warehouse A', type: 'Warehouse' },
      { code: 'ST001', name: 'Branch Store B', type: 'Store' },
      { code: 'ST002', name: 'Branch Store C', type: 'Store' },
      { code: 'ST003', name: 'Branch Store D', type: 'Store' }
    ];

    setFreezes(mockFreezes);
    setProducts(mockProducts);
    setLocations(mockLocations);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'error';
      case 'Completed': return 'success';
      case 'Scheduled': return 'warning';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const handleActivate = (freeze) => {
    // Implement activate logic
    setSnackbar({
      open: true,
      message: `Stock freeze ${freeze.id} activated`,
      severity: 'success'
    });
  };

  const handleDeactivate = (freeze) => {
    // Implement deactivate logic
    setSnackbar({
      open: true,
      message: `Stock freeze ${freeze.id} deactivated`,
      severity: 'success'
    });
  };

  const handleCancel = (freeze) => {
    // Implement cancel logic
    setSnackbar({
      open: true,
      message: `Stock freeze ${freeze.id} cancelled`,
      severity: 'success'
    });
  };

  const handleView = (freeze) => {
    setSelectedFreeze(freeze);
    setDialogOpen(true);
  };

  const filteredFreezes = freezes.filter(freeze => {
    const matchesSearch = freeze.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freeze.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || freeze.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: freezes.length,
    active: freezes.filter(f => f.status === 'Active').length,
    completed: freezes.filter(f => f.status === 'Completed').length,
    scheduled: freezes.filter(f => f.status === 'Scheduled').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Settings color="primary" />
          Count Scope Lock (Stock Freeze)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Lock stock movements during counting periods to ensure accurate inventory
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Freezes
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
                    Active Freezes
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats.active}
                  </Typography>
                </Box>
                <Lock color="error" sx={{ fontSize: 40 }} />
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
                    Completed
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.completed}
                  </Typography>
                </Box>
                <LockOpen color="success" sx={{ fontSize: 40 }} />
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
                    Scheduled
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.scheduled}
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
              placeholder="Search freezes..."
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
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
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
                New Freeze
              </Button>
              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => {}}
              >
                Global Lock
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

      {/* Freezes Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Freeze ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Freeze Type</TableCell>
              <TableCell>Scope</TableCell>
              <TableCell>Initiated By</TableCell>
              <TableCell align="center">Affected Items</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Scheduled</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFreezes.map((freeze) => (
              <TableRow key={freeze.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {freeze.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {freeze.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {freeze.locationCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {freeze.freezeType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {freeze.scope}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {freeze.initiatedBy}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {freeze.affectedItems}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={freeze.status}
                    size="small"
                    color={getStatusColor(freeze.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {freeze.scheduledStart}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(freeze)}
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
                    {freeze.status === 'Scheduled' && (
                      <Tooltip title="Activate Freeze">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleActivate(freeze)}
                        >
                          <Lock />
                        </IconButton>
                      </Tooltip>
                    )}
                    {freeze.status === 'Active' && (
                      <Tooltip title="Deactivate Freeze">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleDeactivate(freeze)}
                        >
                          <LockOpen />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Cancel Freeze">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleCancel(freeze)}
                        disabled={freeze.status === 'Completed'}
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Freeze Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Stock Freeze Details - {selectedFreeze?.id}
        </DialogTitle>
        <DialogContent>
          {selectedFreeze && (
            <Box>
              {/* Freeze Header */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Location Details
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedFreeze.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedFreeze.locationCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Freeze Information
                      </Typography>
                      <Typography variant="body2">
                        <strong>Type:</strong> {selectedFreeze.freezeType}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Scope:</strong> {selectedFreeze.scope}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Affected Items:</strong> {selectedFreeze.affectedItems}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Restricted Operations */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Restricted Operations
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {selectedFreeze.restrictedOperations.map((operation, index) => (
                  <Chip
                    key={index}
                    label={operation}
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Box>

              {/* Exceptions */}
              {selectedFreeze.exceptions.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Exceptions</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {selectedFreeze.exceptions.map((exception, index) => (
                      <Box key={index} sx={{ mb: 1, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="body2">
                          {exception}
                        </Typography>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Schedule Information */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Schedule Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Scheduled Start"
                    value={selectedFreeze.scheduledStart}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Scheduled End"
                    value={selectedFreeze.scheduledEnd}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Actual Start"
                    value={selectedFreeze.actualStart || 'Not Started'}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Actual End"
                    value={selectedFreeze.actualEnd || 'Not Ended'}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason"
                    value={selectedFreeze.reason}
                    disabled
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Print />}>
            Print Freeze Report
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

export default StockFreeze;
