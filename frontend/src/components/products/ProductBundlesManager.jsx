import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Inventory,
  AttachMoney,
  Image,
  Settings,
  Visibility,
  VisibilityOff,
  ShoppingCart,
  Search,
} from '@mui/icons-material';

const ProductBundlesManager = () => {
  const [bundles, setBundles] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max Complete Bundle',
      sku: 'BUNDLE-2025-001',
      description: 'Complete iPhone 15 Pro Max package with accessories',
      bundlePrice: 1499.00,
      individualPrice: 1650.00,
      savings: 151.00,
      savingsPercent: 9.2,
      items: [
        { id: 1, name: 'iPhone 15 Pro Max 256GB', sku: 'PRD-2025-001250', quantity: 1, price: 1199.00 },
        { id: 2, name: 'AirPods Pro (2nd Gen)', sku: 'PRD-2025-002100', quantity: 1, price: 249.00 },
        { id: 3, name: 'MagSafe Charger', sku: 'PRD-2025-003050', quantity: 1, price: 39.00 },
        { id: 4, name: 'Clear Case', sku: 'PRD-2025-004010', quantity: 1, price: 49.00 },
      ],
      image: '/api/placeholder/300/200',
      status: 'active',
      featured: true,
    },
    {
      id: 2,
      name: 'Gaming Setup Bundle',
      sku: 'BUNDLE-2025-002',
      description: 'Complete gaming setup for PC enthusiasts',
      bundlePrice: 2999.00,
      individualPrice: 3450.00,
      savings: 451.00,
      savingsPercent: 13.1,
      items: [
        { id: 5, name: 'Gaming Laptop', sku: 'PRD-2025-005100', quantity: 1, price: 1999.00 },
        { id: 6, name: 'Gaming Mouse', sku: 'PRD-2025-006020', quantity: 1, price: 89.00 },
        { id: 7, name: 'Gaming Keyboard', sku: 'PRD-2025-007030', quantity: 1, price: 159.00 },
        { id: 8, name: 'Gaming Headset', sku: 'PRD-2025-008040', quantity: 1, price: 199.00 },
        { id: 9, name: 'Gaming Mousepad', sku: 'PRD-2025-009050', quantity: 1, price: 29.00 },
      ],
      image: '/api/placeholder/300/200',
      status: 'active',
      featured: false,
    },
  ]);

  const [availableProducts] = useState([
    { id: 1, name: 'iPhone 15 Pro Max 256GB', sku: 'PRD-2025-001250', price: 1199.00, category: 'Electronics' },
    { id: 2, name: 'AirPods Pro (2nd Gen)', sku: 'PRD-2025-002100', price: 249.00, category: 'Audio' },
    { id: 3, name: 'MagSafe Charger', sku: 'PRD-2025-003050', price: 39.00, category: 'Accessories' },
    { id: 4, name: 'Clear Case', sku: 'PRD-2025-004010', price: 49.00, category: 'Accessories' },
    { id: 5, name: 'Gaming Laptop', sku: 'PRD-2025-005100', price: 1999.00, category: 'Electronics' },
    { id: 6, name: 'Gaming Mouse', sku: 'PRD-2025-006020', price: 89.00, category: 'Gaming' },
    { id: 7, name: 'Gaming Keyboard', sku: 'PRD-2025-007030', price: 159.00, category: 'Gaming' },
    { id: 8, name: 'Gaming Headset', sku: 'PRD-2025-008040', price: 199.00, category: 'Gaming' },
    { id: 9, name: 'Gaming Mousepad', sku: 'PRD-2025-009050', price: 29.00, category: 'Gaming' },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    bundlePrice: 0,
    image: '',
    status: 'active',
    featured: false,
    items: [],
  });

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleAddBundle = () => {
    setEditingBundle(null);
    setFormData({
      name: '',
      sku: '',
      description: '',
      bundlePrice: 0,
      image: '',
      status: 'active',
      featured: false,
      items: [],
    });
    setDialogOpen(true);
  };

  const handleEditBundle = (bundle) => {
    setEditingBundle(bundle);
    setFormData({ ...bundle });
    setDialogOpen(true);
  };

  const handleDeleteBundle = (id) => {
    setBundles(bundles.filter(bundle => bundle.id !== id));
  };

  const handleSaveBundle = () => {
    if (editingBundle) {
      // Update existing bundle
      setBundles(bundles.map(bundle => 
        bundle.id === editingBundle.id ? { ...formData, id: editingBundle.id } : bundle
      ));
    } else {
      // Add new bundle
      const newBundle = {
        ...formData,
        id: Date.now(),
        individualPrice: formData.items.reduce((total, item) => total + (item.price * item.quantity), 0),
        savings: formData.items.reduce((total, item) => total + (item.price * item.quantity), 0) - formData.bundlePrice,
        savingsPercent: ((formData.items.reduce((total, item) => total + (item.price * item.quantity), 0) - formData.bundlePrice) / formData.items.reduce((total, item) => total + (item.price * item.quantity), 0) * 100).toFixed(1),
      };
      setBundles([...bundles, newBundle]);
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingBundle(null);
  };

  const toggleBundleStatus = (id) => {
    setBundles(bundles.map(bundle => 
      bundle.id === id ? { ...bundle, status: bundle.status === 'active' ? 'inactive' : 'active' } : bundle
    ));
  };

  const toggleFeatured = (id) => {
    setBundles(bundles.map(bundle => 
      bundle.id === id ? { ...bundle, featured: !bundle.featured } : bundle
    ));
  };

  const handleAddProducts = () => {
    setProductDialogOpen(true);
  };

  const handleProductSelection = (productId, checked) => {
    if (checked) {
      const product = availableProducts.find(p => p.id === productId);
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    } else {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(selectedProducts.map(product => 
      product.id === productId ? { ...product, quantity: parseInt(quantity) } : product
    ));
  };

  const handleAddSelectedProducts = () => {
    setFormData({
      ...formData,
      items: [...formData.items, ...selectedProducts]
    });
    setSelectedProducts([]);
    setProductDialogOpen(false);
  };

  const removeItemFromBundle = (itemId) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Product Bundles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage product bundles with special pricing
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddBundle}
        >
          Create Bundle
        </Button>
      </Box>

      {/* Bundles Grid */}
      <Grid container spacing={3}>
        {bundles.map((bundle) => (
          <Grid item xs={12} md={6} key={bundle.id}>
            <Card>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${bundle.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(0,0,0,0.5)' }}>
                    <Inventory />
                  </Avatar>
                </Box>
                {bundle.featured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                  />
                )}
                <Chip
                  label={`Save ${bundle.savingsPercent}%`}
                  color="success"
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                />
              </Box>
              
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {bundle.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {bundle.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${bundle.bundlePrice}
                  </Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through', alignSelf: 'center' }}>
                    ${bundle.individualPrice}
                  </Typography>
                  <Chip
                    label={`Save $${bundle.savings}`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {bundle.items.length} items included
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={bundle.status}
                    color={bundle.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditBundle(bundle)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={bundle.status === 'active' ? 'Deactivate' : 'Activate'}>
                      <IconButton
                        size="small"
                        onClick={() => toggleBundleStatus(bundle.id)}
                      >
                        {bundle.status === 'active' ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteBundle(bundle.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Bundle Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bundle Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bundle SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bundle Price"
                type="number"
                value={formData.bundlePrice}
                onChange={(e) => setFormData({ ...formData, bundlePrice: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Bundle Items ({formData.items.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddProducts}
                >
                  Add Products
                </Button>
              </Box>

              {formData.items.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {item.sku}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => removeItemFromBundle(item.id)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  No products added to this bundle yet. Click "Add Products" to get started.
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                }
                label="Featured Bundle"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSaveBundle} variant="contained" startIcon={<Save />}>
            {editingBundle ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Selection Dialog */}
      <Dialog open={productDialogOpen} onClose={() => setProductDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Products to Bundle</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Select products to add to this bundle:
            </Typography>
          </Box>
          
          <List>
            {availableProducts.map((product) => (
              <ListItem key={product.id}>
                <Checkbox
                  checked={selectedProducts.some(p => p.id === product.id)}
                  onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                />
                <ListItemText
                  primary={product.name}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography variant="body2" fontFamily="monospace">
                        {product.sku}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        ${product.price}
                      </Typography>
                      <Chip label={product.category} size="small" variant="outlined" />
                    </Box>
                  }
                />
                {selectedProducts.some(p => p.id === product.id) && (
                  <ListItemSecondaryAction>
                    <TextField
                      size="small"
                      type="number"
                      label="Qty"
                      value={selectedProducts.find(p => p.id === product.id)?.quantity || 1}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      sx={{ width: 80 }}
                    />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddSelectedProducts} 
            variant="contained"
            disabled={selectedProducts.length === 0}
          >
            Add Selected ({selectedProducts.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductBundlesManager;
