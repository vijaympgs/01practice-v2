import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Inventory,
  Warning,
  CheckCircle,
  Error,
  Search,
  Close,
  Save,
  Refresh,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Person,
  ShoppingCart,
  History,
  QrCode,
  Print,
  ExpandMore,
  Edit,
  Delete,
  Visibility,
  LocalOffer,
  CardGiftcard,
  Redeem,
  EmojiEvents,
  Diamond,
  Store,
  LocationOn,
  Category,
  QrCodeScanner
} from '@mui/icons-material';

const InventoryIntegration = ({ open, onClose, session, selectedProduct, onStockUpdate }) => {
  const [inventoryData, setInventoryData] = useState({});
  const [stockAlerts, setStockAlerts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock inventory data
  const mockInventory = {
    'P001': {
      id: 'P001',
      name: 'Premium Widget A',
      sku: 'PW-A-001',
      barcode: '1234567890123',
      currentStock: 45,
      reservedStock: 5,
      availableStock: 40,
      minStock: 10,
      maxStock: 100,
      locations: {
        'Main Store': { stock: 30, reserved: 3 },
        'Warehouse A': { stock: 15, reserved: 2 }
      },
      lastUpdated: '2025-01-10 14:30:00',
      status: 'available'
    },
    'P002': {
      id: 'P002',
      name: 'Standard Component B',
      sku: 'SC-B-002',
      barcode: '2345678901234',
      currentStock: 8,
      reservedStock: 2,
      availableStock: 6,
      minStock: 15,
      maxStock: 50,
      locations: {
        'Main Store': { stock: 8, reserved: 2 }
      },
      lastUpdated: '2025-01-10 13:15:00',
      status: 'low_stock'
    },
    'P003': {
      id: 'P003',
      name: 'Advanced Module C',
      sku: 'AM-C-003',
      barcode: '3456789012345',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      minStock: 5,
      maxStock: 25,
      locations: {},
      lastUpdated: '2025-01-09 16:45:00',
      status: 'out_of_stock'
    }
  };

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'main_store', name: 'Main Store' },
    { id: 'warehouse_a', name: 'Warehouse A' },
    { id: 'warehouse_b', name: 'Warehouse B' }
  ];

  useEffect(() => {
    if (open) {
      setInventoryData(mockInventory);
      generateStockAlerts();
      setSearchTerm(selectedProduct?.id || '');
    }
  }, [open, selectedProduct]);

  const generateStockAlerts = () => {
    const alerts = [];
    const lowStock = [];

    Object.values(mockInventory).forEach(product => {
      if (product.availableStock <= product.minStock) {
        alerts.push({
          id: `ALERT_${product.id}`,
          productId: product.id,
          productName: product.name,
          currentStock: product.availableStock,
          minStock: product.minStock,
          severity: product.availableStock === 0 ? 'critical' : 'warning',
          message: product.availableStock === 0 
            ? `${product.name} is out of stock` 
            : `${product.name} is low on stock (${product.availableStock}/${product.minStock})`
        });
        
        if (product.availableStock < product.minStock) {
          lowStock.push(product);
        }
      }
    });

    setStockAlerts(alerts);
    setLowStockItems(lowStock);
  };

  const handleStockAdjustment = (productId, adjustment, reason) => {
    const product = inventoryData[productId];
    if (!product) return;

    const newStock = Math.max(0, product.currentStock + adjustment);
    const updatedProduct = {
      ...product,
      currentStock: newStock,
      availableStock: Math.max(0, newStock - product.reservedStock),
      lastUpdated: new Date().toISOString(),
      status: newStock === 0 ? 'out_of_stock' : 
              newStock <= product.minStock ? 'low_stock' : 'available'
    };

    setInventoryData(prev => ({
      ...prev,
      [productId]: updatedProduct
    }));

    if (onStockUpdate) {
      onStockUpdate(updatedProduct);
    }

    setSnackbar({
      open: true,
      message: `Stock updated for ${product.name}: ${adjustment > 0 ? '+' : ''}${adjustment} units`,
      severity: 'success'
    });

    generateStockAlerts();
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'error';
      default: return 'default';
    }
  };

  const getStockStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle />;
      case 'low_stock': return <Warning />;
      case 'out_of_stock': return <Error />;
      default: return <Inventory />;
    }
  };

  const filteredProducts = Object.values(inventoryData).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesLocation = selectedLocation === 'all' || 
                           Object.keys(product.locations).some(loc => 
                             loc.toLowerCase().replace(' ', '_') === selectedLocation
                           );
    return matchesSearch && matchesLocation;
  });

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Inventory Integration</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={generateStockAlerts}
              >
                Refresh
              </Button>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Stock Alerts */}
          {stockAlerts.length > 0 && (
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.light' }}>
              <Typography variant="h6" gutterBottom>
                Stock Alerts ({stockAlerts.length})
              </Typography>
              <List>
                {stockAlerts.map((alert) => (
                  <ListItem key={alert.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alert.severity === 'critical' ? 'error.main' : 'warning.main' }}>
                        {alert.severity === 'critical' ? <Error /> : <Warning />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={alert.productName}
                      secondary={alert.message}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={alert.severity === 'critical' ? 'Critical' : 'Warning'}
                        color={alert.severity === 'critical' ? 'error' : 'warning'}
                        size="small"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Search and Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search products by name, SKU, or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    label="Location"
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<QrCode />}
                  fullWidth
                >
                  Scan Barcode
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Current Stock" />
              <Tab label="Stock Movements" />
              <Tab label="Low Stock Items" />
              <Tab label="Stock Adjustments" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Current Stock Tab */}
            <Typography variant="h6" gutterBottom>
              Current Stock Levels
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">SKU</TableCell>
                    <TableCell align="center">Current Stock</TableCell>
                    <TableCell align="center">Available</TableCell>
                    <TableCell align="center">Reserved</TableCell>
                    <TableCell align="center">Min/Max</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.barcode}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {product.sku}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="medium">
                          {product.currentStock}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="success.main">
                          {product.availableStock}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="warning.main">
                          {product.reservedStock}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {product.minStock}/{product.maxStock}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={product.status.replace('_', ' ')}
                          color={getStockStatusColor(product.status)}
                          icon={getStockStatusIcon(product.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            // Open stock adjustment dialog
                          }}
                        >
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Stock Movements Tab */}
            <Typography variant="h6" gutterBottom>
              Recent Stock Movements
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <History sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Stock movement history coming soon
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Low Stock Items Tab */}
            <Typography variant="h6" gutterBottom>
              Low Stock Items ({lowStockItems.length})
            </Typography>
            {lowStockItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  All items are adequately stocked
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {lowStockItems.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card sx={{ border: 1, borderColor: 'warning.main' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'warning.main' }}>
                            <Warning />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" noWrap>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              SKU: {product.sku}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Stock vs Minimum Required
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(product.availableStock / product.minStock) * 100}
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: 'warning.light',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: 'warning.main'
                              }
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {product.availableStock} / {product.minStock} units
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="warning.main">
                            {product.availableStock} units
                          </Typography>
                          <Button
                            size="small"
                            variant="contained"
                            color="warning"
                          >
                            Reorder
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Stock Adjustments Tab */}
            <Typography variant="h6" gutterBottom>
              Stock Adjustments
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Edit sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Stock adjustment tools coming soon
              </Typography>
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default InventoryIntegration;
