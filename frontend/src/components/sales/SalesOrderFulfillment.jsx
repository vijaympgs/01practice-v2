import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Inventory as PackageIcon,
  Assignment as AssignmentIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';

const SalesOrderFulfillment = ({ orders = [], onUpdateStatus, onViewDetails, onPrintPickingList }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Mock data - replace with actual API data
  const fulfillmentOrders = orders.length > 0 ? orders : [
    {
      id: 'SO-001',
      orderNumber: 'SO-2024-001',
      customer: { name: 'ABC Corporation', email: 'contact@abc.com' },
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
      status: 'Approved',
      fulfillmentStage: 'Picking',
      priority: 'High',
      total: 2450.00,
      salesPerson: 'John Smith',
      itemsCount: 3,
      pickedItems: 2,
      packedItems: 0,
      shippedItems: 0,
      items: [
        { product: 'Product A', sku: 'PROD-A-001', quantity: 10, picked: 10, location: 'A1-B2' },
        { product: 'Product B', sku: 'PROD-B-002', quantity: 5, picked: 5, location: 'B3-C1' },
        { product: 'Product C', sku: 'PROD-C-003', quantity: 3, picked: 0, location: 'C2-D1' }
      ],
      warehouse: 'Main Warehouse',
      assignedTo: 'Warehouse Team A'
    },
    {
      id: 'SO-002',
      orderNumber: 'SO-2024-002',
      customer: { name: 'XYZ Industries', email: 'sales@xyz.com' },
      orderDate: '2024-01-16',
      deliveryDate: '2024-01-22',
      status: 'Approved',
      fulfillmentStage: 'Packing',
      priority: 'Normal',
      total: 1890.50,
      salesPerson: 'Jane Doe',
      itemsCount: 2,
      pickedItems: 2,
      packedItems: 1,
      shippedItems: 0,
      items: [
        { product: 'Product D', sku: 'PROD-D-004', quantity: 8, picked: 8, location: 'D3-E1' },
        { product: 'Product E', sku: 'PROD-E-005', quantity: 4, picked: 4, location: 'E2-F1' }
      ],
      warehouse: 'Main Warehouse',
      assignedTo: 'Warehouse Team B'
    },
    {
      id: 'SO-003',
      orderNumber: 'SO-2024-003',
      customer: { name: 'DEF Enterprises', email: 'info@def.com' },
      orderDate: '2024-01-17',
      deliveryDate: '2024-01-25',
      status: 'Approved',
      fulfillmentStage: 'Shipped',
      priority: 'Urgent',
      total: 3200.75,
      salesPerson: 'Mike Johnson',
      itemsCount: 5,
      pickedItems: 5,
      packedItems: 5,
      shippedItems: 5,
      items: [
        { product: 'Product F', sku: 'PROD-F-006', quantity: 6, picked: 6, location: 'F3-G1' },
        { product: 'Product G', sku: 'PROD-G-007', quantity: 3, picked: 3, location: 'G2-H1' },
        { product: 'Product H', sku: 'PROD-H-008', quantity: 2, picked: 2, location: 'H3-I1' },
        { product: 'Product I', sku: 'PROD-I-009', quantity: 4, picked: 4, location: 'I2-J1' },
        { product: 'Product J', sku: 'PROD-J-010', quantity: 1, picked: 1, location: 'J3-K1' }
      ],
      warehouse: 'Main Warehouse',
      assignedTo: 'Warehouse Team C',
      trackingNumber: 'TRK123456789',
      shippingMethod: 'Standard Shipping'
    }
  ];

  const fulfillmentStages = [
    { value: 'All', label: 'All Stages', color: 'default' },
    { value: 'Picking', label: 'Picking', color: 'warning' },
    { value: 'Packing', label: 'Packing', color: 'info' },
    { value: 'Shipped', label: 'Shipped', color: 'success' },
    { value: 'Delivered', label: 'Delivered', color: 'success' }
  ];

  const getStageColor = (stage) => {
    const stageInfo = fulfillmentStages.find(s => s.value === stage);
    return stageInfo ? stageInfo.color : 'default';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'error';
      case 'High': return 'warning';
      case 'Normal': return 'success';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getProgressPercentage = (order) => {
    const totalItems = order.itemsCount;
    const completedItems = order.shippedItems;
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  const getFulfillmentProgress = (order) => {
    const totalItems = order.itemsCount;
    const picked = order.pickedItems;
    const packed = order.packedItems;
    const shipped = order.shippedItems;
    
    return {
      picked: totalItems > 0 ? (picked / totalItems) * 100 : 0,
      packed: totalItems > 0 ? (packed / totalItems) * 100 : 0,
      shipped: totalItems > 0 ? (shipped / totalItems) * 100 : 0
    };
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    const filteredOrders = selectedStage === 'All' 
      ? fulfillmentOrders 
      : fulfillmentOrders.filter(order => order.fulfillmentStage === selectedStage);
      
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrderForDetails(order);
    setShowDetailsDialog(true);
  };

  const handleUpdateStage = (orderId, newStage) => {
    onUpdateStatus(orderId, newStage);
  };

  const handlePrintPickingList = (orderId) => {
    onPrintPickingList(orderId);
  };

  const filteredOrders = selectedStage === 'All' 
    ? fulfillmentOrders 
    : fulfillmentOrders.filter(order => order.fulfillmentStage === selectedStage);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: '1.8rem', fontWeight: 600 }}>
            Sales Order Fulfillment
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<InventoryIcon />} label={`${fulfillmentOrders.length} Total Orders`} color="primary" variant="outlined" />
            <Chip icon={<PackageIcon />} label={`${fulfillmentOrders.filter(o => o.fulfillmentStage === 'Picking').length} Picking`} color="warning" variant="outlined" />
            <Chip icon={<ShippingIcon />} label={`${fulfillmentOrders.filter(o => o.fulfillmentStage === 'Shipped').length} Shipped`} color="success" variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon />}
            disabled={selectedOrders.length === 0}
          >
            Bulk Scan
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            disabled={selectedOrders.length === 0}
          >
            Print Lists
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Fulfillment Stage</InputLabel>
                <Select
                  value={selectedStage}
                  label="Fulfillment Stage"
                  onChange={(e) => setSelectedStage(e.target.value)}
                >
                  {fulfillmentStages.map((stage) => (
                    <MenuItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PlayArrowIcon />}
                  disabled={selectedOrders.length === 0}
                  onClick={() => selectedOrders.forEach(id => handleUpdateStage(id, 'Picking'))}
                >
                  Start Picking
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShippingIcon />}
                  disabled={selectedOrders.length === 0}
                  onClick={() => selectedOrders.forEach(id => handleUpdateStage(id, 'Shipped'))}
                >
                  Mark Shipped
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length}
                    checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Order Details</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Fulfillment Stage</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => {
                const isSelected = selectedOrders.includes(order.id);
                const progress = getFulfillmentProgress(order);
                
                return (
                  <TableRow key={order.id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.orderNumber}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={order.priority}
                            color={getPriorityColor(order.priority)}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {order.itemsCount} items
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {order.customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.fulfillmentStage}
                        color={getStageColor(order.fulfillmentStage)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">Picked</Typography>
                          <Typography variant="caption">{progress.picked.toFixed(0)}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress.picked} 
                          color="warning"
                          sx={{ mb: 1, height: 4, borderRadius: 2 }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">Packed</Typography>
                          <Typography variant="caption">{progress.packed.toFixed(0)}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress.packed} 
                          color="info"
                          sx={{ mb: 1, height: 4, borderRadius: 2 }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">Shipped</Typography>
                          <Typography variant="caption">{progress.shipped.toFixed(0)}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress.shipped} 
                          color="success"
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.warehouse}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.assignedTo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(order)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Picking List">
                          <IconButton
                            size="small"
                            onClick={() => handlePrintPickingList(order.id)}
                          >
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {order.fulfillmentStage === 'Picking' && (
                          <Tooltip title="Mark as Packing">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleUpdateStage(order.id, 'Packing')}
                            >
                              <PackageIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {order.fulfillmentStage === 'Packing' && (
                          <Tooltip title="Mark as Shipped">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleUpdateStage(order.id, 'Shipped')}
                            >
                              <ShippingIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon color="primary" />
            Fulfillment Details - {selectedOrderForDetails?.orderNumber}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrderForDetails && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Customer" 
                        secondary={selectedOrderForDetails.customer.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Delivery Date" 
                        secondary={new Date(selectedOrderForDetails.deliveryDate).toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Warehouse" 
                        secondary={selectedOrderForDetails.warehouse}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Assigned To" 
                        secondary={selectedOrderForDetails.assignedTo}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Fulfillment Progress
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PackageIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Picked Items" 
                        secondary={`${selectedOrderForDetails.pickedItems} / ${selectedOrderForDetails.itemsCount}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssignmentIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Packed Items" 
                        secondary={`${selectedOrderForDetails.packedItems} / ${selectedOrderForDetails.itemsCount}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ShippingIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Shipped Items" 
                        secondary={`${selectedOrderForDetails.shippedItems} / ${selectedOrderForDetails.itemsCount}`}
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Item Details
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>SKU</TableCell>
                          <TableCell align="center">Quantity</TableCell>
                          <TableCell align="center">Picked</TableCell>
                          <TableCell>Location</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrderForDetails.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="center">{item.picked}</TableCell>
                            <TableCell>{item.location}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<PrintIcon />}>
            Print Details
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesOrderFulfillment;
