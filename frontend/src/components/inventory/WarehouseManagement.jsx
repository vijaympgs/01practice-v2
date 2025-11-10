import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Badge,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Warehouse as WarehouseIcon,
  LocationOn as LocationIcon,
  QrCode as QrCodeIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Map as MapIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';

const WarehouseManagement = ({ onRefresh }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [bins, setBins] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [binDialogOpen, setBinDialogOpen] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockWarehouses = [
      {
        id: '1',
        name: 'Main Warehouse',
        code: 'WH001',
        address: '123 Industrial Blvd, Tech City, TC 12345',
        capacity: 10000,
        usedCapacity: 7500,
        utilizationRate: 75,
        zones: 5,
        bins: 250,
        status: 'active',
        manager: 'John Smith',
        phone: '+1-555-0123',
        email: 'john.smith@company.com',
        operatingHours: '24/7',
        temperature: 'Controlled (18-22°C)',
        humidity: '45-55%',
        securityLevel: 'High',
        lastAudit: '2025-01-08T10:00:00Z',
        nextAudit: '2025-02-08T10:00:00Z'
      },
      {
        id: '2',
        name: 'Cold Storage Facility',
        code: 'WH002',
        address: '456 Refrigeration Ave, Tech City, TC 12346',
        capacity: 5000,
        usedCapacity: 3200,
        utilizationRate: 64,
        zones: 3,
        bins: 120,
        status: 'active',
        manager: 'Sarah Johnson',
        phone: '+1-555-0456',
        email: 'sarah.johnson@company.com',
        operatingHours: '6 AM - 10 PM',
        temperature: 'Cold (-2°C to 4°C)',
        humidity: '30-40%',
        securityLevel: 'Medium',
        lastAudit: '2025-01-05T14:30:00Z',
        nextAudit: '2025-02-05T14:30:00Z'
      },
      {
        id: '3',
        name: 'Distribution Center',
        code: 'WH003',
        address: '789 Logistics Way, Tech City, TC 12347',
        capacity: 8000,
        usedCapacity: 4800,
        utilizationRate: 60,
        zones: 4,
        bins: 180,
        status: 'maintenance',
        manager: 'Mike Wilson',
        phone: '+1-555-0789',
        email: 'mike.wilson@company.com',
        operatingHours: '7 AM - 11 PM',
        temperature: 'Ambient (15-25°C)',
        humidity: '40-60%',
        securityLevel: 'High',
        lastAudit: '2025-01-03T09:15:00Z',
        nextAudit: '2025-02-03T09:15:00Z'
      }
    ];

    const mockBins = [
      {
        id: '1',
        warehouseId: '1',
        binCode: 'A-01-01',
        zone: 'Zone A',
        aisle: '01',
        shelf: '01',
        level: 'Ground',
        capacity: 100,
        usedCapacity: 75,
        utilizationRate: 75,
        status: 'occupied',
        lastAccessed: '2025-01-10T14:30:00Z',
        products: [
          { name: 'Samsung Galaxy S24', sku: 'SAM-GAL-S24-128', quantity: 25 },
          { name: 'Apple MacBook Pro 16"', sku: 'APP-MBP-16-512', quantity: 15 }
        ],
        temperature: 'Normal',
        humidity: '45%'
      },
      {
        id: '2',
        warehouseId: '1',
        binCode: 'A-01-02',
        zone: 'Zone A',
        aisle: '01',
        shelf: '02',
        level: 'Ground',
        capacity: 100,
        usedCapacity: 50,
        utilizationRate: 50,
        status: 'partial',
        lastAccessed: '2025-01-09T16:45:00Z',
        products: [
          { name: 'Dell OptiPlex 7090', sku: 'DEL-OPT-7090-256', quantity: 20 }
        ],
        temperature: 'Normal',
        humidity: '48%'
      },
      {
        id: '3',
        warehouseId: '1',
        binCode: 'B-02-01',
        zone: 'Zone B',
        aisle: '02',
        shelf: '01',
        level: 'Ground',
        capacity: 100,
        usedCapacity: 0,
        utilizationRate: 0,
        status: 'empty',
        lastAccessed: '2025-01-08T10:15:00Z',
        products: [],
        temperature: 'Normal',
        humidity: '52%'
      }
    ];

    setWarehouses(mockWarehouses);
    setBins(mockBins);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'error';
      case 'occupied': return 'success';
      case 'partial': return 'warning';
      case 'empty': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon />;
      case 'maintenance': return <WarningIcon />;
      case 'inactive': return <WarningIcon />;
      case 'occupied': return <InventoryIcon />;
      case 'partial': return <WarningIcon />;
      case 'empty': return <InventoryIcon />;
      default: return <InventoryIcon />;
    }
  };

  const handleAddWarehouse = () => {
    setSelectedWarehouse(null);
    setWarehouseDialogOpen(true);
  };

  const handleEditWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseDialogOpen(true);
  };

  const handleAddBin = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setBinDialogOpen(true);
  };

  const getUtilizationColor = (rate) => {
    if (rate >= 90) return 'error';
    if (rate >= 75) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading warehouse data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant={mapView ? 'contained' : 'outlined'}
            startIcon={<MapIcon />}
            onClick={() => setMapView(!mapView)}
          >
            {mapView ? 'Table View' : 'Map View'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddWarehouse}
          >
            Add Warehouse
          </Button>
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon />}
          >
            Scan Barcode
          </Button>
        </Box>
      </Box>

      {mapView ? (
        /* Map View */
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Warehouse Map View
            </Typography>
            <Box
              sx={{
                height: 400,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: 1
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <MapIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Interactive warehouse map will be displayed here
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Integration with mapping service required
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : (
        /* Table View */
        <Grid container spacing={3}>
          {/* Warehouse Cards */}
          {warehouses.map((warehouse) => (
            <Grid item xs={12} md={6} lg={4} key={warehouse.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: warehouse.status === 'maintenance' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {warehouse.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {warehouse.code} • {warehouse.address}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(warehouse.status)}
                        label={warehouse.status.toUpperCase()}
                        color={getStatusColor(warehouse.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditWarehouse(warehouse)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Capacity Utilization */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Capacity Utilization</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {warehouse.utilizationRate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={warehouse.utilizationRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: warehouse.utilizationRate >= 90 ? '#f44336' : 
                                         warehouse.utilizationRate >= 75 ? '#ff9800' : '#4caf50'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Used: {warehouse.usedCapacity.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total: {warehouse.capacity.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Warehouse Details */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Manager</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {warehouse.manager}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Zones</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {warehouse.zones}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Bins</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {warehouse.bins}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Temperature</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {warehouse.temperature}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddBin(warehouse)}
                      sx={{ flex: 1 }}
                    >
                      Add Bin
                    </Button>
                    <Button
                      size="small"
                      startIcon={<InventoryIcon />}
                      sx={{ flex: 1 }}
                    >
                      View Bins
                    </Button>
                  </Box>

                  {/* Audit Info */}
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Last Audit: {formatDate(warehouse.lastAudit)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Next Audit: {formatDate(warehouse.nextAudit)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Bin Management Table */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Bin Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<QrCodeIcon />}>
                Scan Bin
              </Button>
              <Button size="small" startIcon={<PrintIcon />}>
                Print Labels
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bin Code</TableCell>
                  <TableCell>Zone</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Utilization</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Last Accessed</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bins.map((bin) => (
                  <TableRow key={bin.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <InventoryIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {bin.binCode}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {bin.level}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={bin.zone}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Aisle {bin.aisle}, Shelf {bin.shelf}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {bin.capacity} units
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={bin.utilizationRate}
                          sx={{
                            width: 60,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: bin.utilizationRate >= 90 ? '#f44336' : 
                                             bin.utilizationRate >= 75 ? '#ff9800' : '#4caf50'
                            }
                          }}
                        />
                        <Typography variant="caption">
                          {bin.utilizationRate}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(bin.status)}
                        label={bin.status.toUpperCase()}
                        color={getStatusColor(bin.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        {bin.products.map((product, index) => (
                          <Typography key={index} variant="caption" display="block">
                            {product.name} ({product.quantity})
                          </Typography>
                        ))}
                        {bin.products.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            Empty
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(bin.lastAccessed)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Bin">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Label">
                          <IconButton size="small">
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Warehouse Dialog */}
      <Dialog open={warehouseDialogOpen} onClose={() => setWarehouseDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Warehouse Name"
                defaultValue={selectedWarehouse?.name || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Warehouse Code"
                defaultValue={selectedWarehouse?.code || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                defaultValue={selectedWarehouse?.address || ''}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Manager"
                defaultValue={selectedWarehouse?.manager || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                defaultValue={selectedWarehouse?.phone || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                defaultValue={selectedWarehouse?.email || ''}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                defaultValue={selectedWarehouse?.capacity || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Operating Hours"
                defaultValue={selectedWarehouse?.operatingHours || ''}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  defaultValue={selectedWarehouse?.status || 'active'}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Security Level"
                defaultValue={selectedWarehouse?.securityLevel || ''}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarehouseDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">
            {selectedWarehouse ? 'Update' : 'Create'} Warehouse
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bin Dialog */}
      <Dialog open={binDialogOpen} onClose={() => setBinDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Bin</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Warehouse: {selectedWarehouse?.name}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Zone"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Aisle"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Shelf"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Level"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Bin Code"
                placeholder="Auto-generated"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBinDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Bin</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarehouseManagement;
