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
  Divider
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
  LocalShipping,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DemandReservation = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  useEffect(() => {
    const mockReservations = [
      {
        id: 'RES001',
        customerName: 'ABC Corporation',
        customerCode: 'CUST001',
        productName: 'Premium Widget A',
        productCode: 'PROD001',
        requestedQty: 100,
        reservedQty: 80,
        availableQty: 120,
        reservationDate: '2025-01-10',
        expiryDate: '2025-01-17',
        status: 'Active',
        priority: 'High',
        salesPerson: 'John Smith',
        notes: 'Urgent requirement for Q1 project'
      },
      {
        id: 'RES002',
        customerName: 'XYZ Industries',
        customerCode: 'CUST002',
        productName: 'Standard Component B',
        productCode: 'PROD002',
        requestedQty: 50,
        reservedQty: 50,
        availableQty: 75,
        reservationDate: '2025-01-09',
        expiryDate: '2025-01-16',
        status: 'Fulfilled',
        priority: 'Medium',
        salesPerson: 'Jane Doe',
        notes: 'Regular monthly order'
      },
      {
        id: 'RES003',
        customerName: 'Tech Solutions Ltd',
        customerCode: 'CUST003',
        productName: 'Advanced Module C',
        productCode: 'PROD003',
        requestedQty: 25,
        reservedQty: 0,
        availableQty: 15,
        reservationDate: '2025-01-08',
        expiryDate: '2025-01-15',
        status: 'Pending',
        priority: 'Low',
        salesPerson: 'Mike Johnson',
        notes: 'Waiting for stock replenishment'
      }
    ];

    const mockProducts = [
      { code: 'PROD001', name: 'Premium Widget A', availableQty: 120 },
      { code: 'PROD002', name: 'Standard Component B', availableQty: 75 },
      { code: 'PROD003', name: 'Advanced Module C', availableQty: 15 }
    ];

    const mockCustomers = [
      { code: 'CUST001', name: 'ABC Corporation' },
      { code: 'CUST002', name: 'XYZ Industries' },
      { code: 'CUST003', name: 'Tech Solutions Ltd' }
    ];

    setReservations(mockReservations);
    setProducts(mockProducts);
    setCustomers(mockCustomers);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Fulfilled': return 'info';
      case 'Pending': return 'warning';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const handleReserve = (reservation) => {
    setSelectedReservation(reservation);
    setDialogOpen(true);
  };

  const handleUnreserve = (reservation) => {
    // Implement unreserve logic
    setSnackbar({
      open: true,
      message: `Unreserved ${reservation.reservedQty} units for ${reservation.productName}`,
      severity: 'success'
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedReservation(null);
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reservations.length,
    active: reservations.filter(r => r.status === 'Active').length,
    fulfilled: reservations.filter(r => r.status === 'Fulfilled').length,
    pending: reservations.filter(r => r.status === 'Pending').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assignment color="primary" />
          Demand Reservation (Reserve/Unreserve)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage stock reservations for customer demands and sales orders
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
                    Total Reservations
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
                    Active Reservations
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.active}
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
                    Fulfilled
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.fulfilled}
                  </Typography>
                </Box>
                <LocalShipping color="info" sx={{ fontSize: 40 }} />
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
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search reservations..."
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
                <MenuItem value="Fulfilled">Fulfilled</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
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
                New Reservation
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

      {/* Reservations Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reservation ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="center">Requested</TableCell>
              <TableCell align="center">Reserved</TableCell>
              <TableCell align="center">Available</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Sales Person</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {reservation.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {reservation.reservationDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {reservation.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {reservation.customerCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {reservation.productName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {reservation.productCode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {reservation.requestedQty}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium" color="success.main">
                    {reservation.reservedQty}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium" color="info.main">
                    {reservation.availableQty}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={reservation.priority}
                    size="small"
                    color={getPriorityColor(reservation.priority)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={reservation.status}
                    size="small"
                    color={getStatusColor(reservation.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {reservation.salesPerson}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Reserve Stock">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleReserve(reservation)}
                        disabled={reservation.status === 'Fulfilled'}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Unreserve Stock">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleUnreserve(reservation)}
                        disabled={reservation.reservedQty === 0}
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

      {/* Reservation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedReservation ? 'Update Reservation' : 'New Reservation'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                renderInput={(params) => (
                  <TextField {...params} label="Customer" required />
                )}
                value={customers.find(c => c.code === selectedReservation?.customerCode) || null}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                renderInput={(params) => (
                  <TextField {...params} label="Product" required />
                )}
                value={products.find(p => p.code === selectedReservation?.productCode) || null}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Requested Quantity"
                type="number"
                defaultValue={selectedReservation?.requestedQty || 0}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Reserved Quantity"
                type="number"
                defaultValue={selectedReservation?.reservedQty || 0}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  defaultValue={selectedReservation?.priority || 'Medium'}
                  label="Priority"
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                defaultValue={selectedReservation?.notes || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {selectedReservation ? 'Update' : 'Create'} Reservation
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

export default DemandReservation;
