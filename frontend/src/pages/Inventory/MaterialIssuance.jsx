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
  FormControlLabel
} from '@mui/material';
import {
  Receipt,
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
  LocalShipping,
  Person,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MaterialIssuance = () => {
  const navigate = useNavigate();
  const [issuances, setIssuances] = useState([]);
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIssuance, setSelectedIssuance] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  useEffect(() => {
    const mockIssuances = [
      {
        id: 'ISS001',
        issuanceDate: '2025-01-10',
        department: 'Production',
        departmentCode: 'DEPT001',
        requestedBy: 'John Smith',
        approvedBy: 'Jane Doe',
        status: 'Issued',
        totalItems: 5,
        totalValue: 12500.00,
        items: [
          {
            productCode: 'PROD001',
            productName: 'Raw Material A',
            requestedQty: 100,
            issuedQty: 100,
            unitPrice: 50.00,
            totalValue: 5000.00,
            batchNo: 'BATCH001',
            expiryDate: '2025-12-31'
          },
          {
            productCode: 'PROD002',
            productName: 'Component B',
            requestedQty: 50,
            issuedQty: 50,
            unitPrice: 150.00,
            totalValue: 7500.00,
            batchNo: 'BATCH002',
            expiryDate: '2025-11-30'
          }
        ]
      },
      {
        id: 'ISS002',
        issuanceDate: '2025-01-09',
        department: 'Maintenance',
        departmentCode: 'DEPT002',
        requestedBy: 'Mike Johnson',
        approvedBy: 'Sarah Wilson',
        status: 'Pending',
        totalItems: 3,
        totalValue: 8500.00,
        items: [
          {
            productCode: 'PROD003',
            productName: 'Spare Part C',
            requestedQty: 25,
            issuedQty: 0,
            unitPrice: 340.00,
            totalValue: 8500.00,
            batchNo: 'BATCH003',
            expiryDate: '2025-10-31'
          }
        ]
      },
      {
        id: 'ISS003',
        issuanceDate: '2025-01-08',
        department: 'Quality Control',
        departmentCode: 'DEPT003',
        requestedBy: 'Lisa Brown',
        approvedBy: 'Tom Davis',
        status: 'Approved',
        totalItems: 2,
        totalValue: 4200.00,
        items: [
          {
            productCode: 'PROD004',
            productName: 'Testing Equipment D',
            requestedQty: 10,
            issuedQty: 0,
            unitPrice: 420.00,
            totalValue: 4200.00,
            batchNo: 'BATCH004',
            expiryDate: '2025-09-30'
          }
        ]
      }
    ];

    const mockProducts = [
      { code: 'PROD001', name: 'Raw Material A', availableQty: 500 },
      { code: 'PROD002', name: 'Component B', availableQty: 200 },
      { code: 'PROD003', name: 'Spare Part C', availableQty: 75 },
      { code: 'PROD004', name: 'Testing Equipment D', availableQty: 50 }
    ];

    const mockDepartments = [
      { code: 'DEPT001', name: 'Production' },
      { code: 'DEPT002', name: 'Maintenance' },
      { code: 'DEPT003', name: 'Quality Control' },
      { code: 'DEPT004', name: 'Research & Development' }
    ];

    setIssuances(mockIssuances);
    setProducts(mockProducts);
    setDepartments(mockDepartments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Issued': return 'success';
      case 'Approved': return 'info';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const handleIssue = (issuance) => {
    // Implement issue logic
    setSnackbar({
      open: true,
      message: `Issued materials for ${issuance.id}`,
      severity: 'success'
    });
  };

  const handleWithdraw = (issuance) => {
    // Implement withdraw logic
    setSnackbar({
      open: true,
      message: `Withdrawn materials for ${issuance.id}`,
      severity: 'success'
    });
  };

  const handleApprove = (issuance) => {
    // Implement approve logic
    setSnackbar({
      open: true,
      message: `Approved issuance ${issuance.id}`,
      severity: 'success'
    });
  };

  const filteredIssuances = issuances.filter(issuance => {
    const matchesSearch = issuance.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issuance.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issuance.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || issuance.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: issuances.length,
    issued: issuances.filter(i => i.status === 'Issued').length,
    pending: issuances.filter(i => i.status === 'Pending').length,
    approved: issuances.filter(i => i.status === 'Approved').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt color="primary" />
          Material Issuance (Issue/Withdraw)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage material issuance to departments and track withdrawals
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
                    Total Issuances
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
                    Issued
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.issued}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
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
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pending}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
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
                <Assignment color="info" sx={{ fontSize: 40 }} />
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
              placeholder="Search issuances..."
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
                <MenuItem value="Issued">Issued</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
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
                New Issuance
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

      {/* Issuances Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Issuance ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Approved By</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIssuances.map((issuance) => (
              <TableRow key={issuance.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {issuance.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {issuance.department}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {issuance.departmentCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {issuance.requestedBy}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {issuance.approvedBy}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {issuance.totalItems}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    ₹{issuance.totalValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={issuance.status}
                    size="small"
                    color={getStatusColor(issuance.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {issuance.issuanceDate}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {issuance.status === 'Approved' && (
                      <Tooltip title="Issue Materials">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleIssue(issuance)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    {issuance.status === 'Pending' && (
                      <Tooltip title="Approve Issuance">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleApprove(issuance)}
                        >
                          <Assignment />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Withdraw Materials">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleWithdraw(issuance)}
                        disabled={issuance.status !== 'Issued'}
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

      {/* Issuance Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>New Material Issuance</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={departments}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                renderInput={(params) => (
                  <TextField {...params} label="Department" required />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Requested By"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Items to Issue
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Requested Qty</TableCell>
                      <TableCell align="center">Available Qty</TableCell>
                      <TableCell align="center">Issue Qty</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Autocomplete
                          size="small"
                          options={products}
                          getOptionLabel={(option) => `${option.name} (${option.code})`}
                          renderInput={(params) => (
                            <TextField {...params} label="Select Product" />
                          )}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField size="small" type="number" />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="info.main">
                          100
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <TextField size="small" type="number" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ₹50.00
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          ₹5,000.00
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose/Notes"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Issuance</Button>
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

export default MaterialIssuance;
