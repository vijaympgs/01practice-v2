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
  Star,
  StarBorder,
} from '@mui/icons-material';

const ProductVariantsManager = () => {
  const [variants, setVariants] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max - 256GB - Natural Titanium',
      sku: 'PRD-2025-001250-001',
      attributes: {
        storage: '256GB',
        color: 'Natural Titanium',
      },
      price: 1199.00,
      cost: 899.00,
      stock: 25,
      image: '/api/placeholder/100/100',
      status: 'active',
      featured: true,
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max - 512GB - Natural Titanium',
      sku: 'PRD-2025-001250-002',
      attributes: {
        storage: '512GB',
        color: 'Natural Titanium',
      },
      price: 1399.00,
      cost: 1099.00,
      stock: 15,
      image: '/api/placeholder/100/100',
      status: 'active',
      featured: false,
    },
    {
      id: 3,
      name: 'iPhone 15 Pro Max - 256GB - Blue Titanium',
      sku: 'PRD-2025-001250-003',
      attributes: {
        storage: '256GB',
        color: 'Blue Titanium',
      },
      price: 1199.00,
      cost: 899.00,
      stock: 8,
      image: '/api/placeholder/100/100',
      status: 'active',
      featured: false,
    },
    {
      id: 4,
      name: 'iPhone 15 Pro Max - 512GB - Blue Titanium',
      sku: 'PRD-2025-001250-004',
      attributes: {
        storage: '512GB',
        color: 'Blue Titanium',
      },
      price: 1399.00,
      cost: 1099.00,
      stock: 0,
      image: '/api/placeholder/100/100',
      status: 'inactive',
      featured: false,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    attributes: {
      storage: '',
      color: '',
    },
    price: 0,
    cost: 0,
    stock: 0,
    image: '',
    status: 'active',
    featured: false,
  });

  const attributeOptions = {
    storage: ['128GB', '256GB', '512GB', '1TB'],
    color: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    size: ['Small', 'Medium', 'Large', 'Extra Large'],
    material: ['Cotton', 'Polyester', 'Wool', 'Silk'],
  };

  const handleAddVariant = () => {
    setEditingVariant(null);
    setFormData({
      name: '',
      sku: '',
      attributes: { storage: '', color: '' },
      price: 0,
      cost: 0,
      stock: 0,
      image: '',
      status: 'active',
      featured: false,
    });
    setDialogOpen(true);
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    setFormData({ ...variant });
    setDialogOpen(true);
  };

  const handleDeleteVariant = (id) => {
    setVariants(variants.filter(variant => variant.id !== id));
  };

  const handleSaveVariant = () => {
    if (editingVariant) {
      // Update existing variant
      setVariants(variants.map(variant => 
        variant.id === editingVariant.id ? { ...formData, id: editingVariant.id } : variant
      ));
    } else {
      // Add new variant
      const newVariant = {
        ...formData,
        id: Date.now(),
      };
      setVariants([...variants, newVariant]);
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingVariant(null);
  };

  const toggleVariantStatus = (id) => {
    setVariants(variants.map(variant => 
      variant.id === id ? { ...variant, status: variant.status === 'active' ? 'inactive' : 'active' } : variant
    ));
  };

  const toggleFeatured = (id) => {
    setVariants(variants.map(variant => 
      variant.id === id ? { ...variant, featured: !variant.featured } : variant
    ));
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'error' };
    if (stock < 10) return { status: 'Low Stock', color: 'warning' };
    return { status: 'In Stock', color: 'success' };
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Product Variants
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage different variations of this product
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddVariant}
        >
          Add Variant
        </Button>
      </Box>

      {/* Variants Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Variant</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Attributes</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((variant) => {
              const stockStatus = getStockStatus(variant.stock);
              return (
                <TableRow key={variant.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={variant.image}
                        sx={{ width: 40, height: 40 }}
                      >
                        <Image />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {variant.name}
                        </Typography>
                        <Chip
                          label={stockStatus.status}
                          color={stockStatus.color}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {variant.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(variant.attributes).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      ${variant.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ${variant.cost}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={stockStatus.color}>
                      {variant.stock}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={variant.status}
                      color={variant.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleFeatured(variant.id)}
                      color={variant.featured ? 'warning' : 'default'}
                    >
                      {variant.featured ? <Star /> : <StarBorder />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditVariant(variant)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={variant.status === 'active' ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => toggleVariantStatus(variant.id)}
                        >
                          {variant.status === 'active' ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteVariant(variant.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingVariant ? 'Edit Variant' : 'Add New Variant'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Variant Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </Grid>

            {/* Dynamic Attributes */}
            {Object.entries(attributeOptions).map(([attribute, options]) => (
              <Grid item xs={12} sm={6} key={attribute}>
                <FormControl fullWidth>
                  <InputLabel>{attribute.charAt(0).toUpperCase() + attribute.slice(1)}</InputLabel>
                  <Select
                    value={formData.attributes[attribute] || ''}
                    label={attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                    onChange={(e) => setFormData({
                      ...formData,
                      attributes: {
                        ...formData.attributes,
                        [attribute]: e.target.value
                      }
                    })}
                  >
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              />
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

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                }
                label="Featured Variant"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSaveVariant} variant="contained" startIcon={<Save />}>
            {editingVariant ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductVariantsManager;

