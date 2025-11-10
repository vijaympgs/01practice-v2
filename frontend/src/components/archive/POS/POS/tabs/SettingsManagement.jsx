import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  Divider,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const SettingsManagement = ({ mode, embeddedDB, posService, onMessage }) => {
  const [settings, setSettings] = useState({
    store: {
      name: 'OptiMind Retail Store',
      address: '123 Business St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'store@optimind-retail.com',
      taxRate: 8.0
    },
    pos: {
      autoPrintReceipts: true,
      requireCustomerInfo: false,
      allowSuspendedSales: true,
      enableBarcodeScanner: true,
      defaultPaymentMethod: 'cash'
    },
    security: {
      requireOperatorLogin: true,
      sessionTimeout: 30,
      auditTrail: true,
      dataEncryption: true
    }
  });
  const [products, setProducts] = useState([]);
  const [operators, setOperators] = useState([]);
  const [editDialog, setEditDialog] = useState({ open: false, type: '', data: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    loadProducts();
    loadOperators();
  }, [embeddedDB]);

  const loadSettings = async () => {
    try {
      // In a real implementation, this would load from embeddedDB
      // For now, using default settings
      console.log('Settings loaded');
    } catch (error) {
      onMessage(`❌ Failed to load settings: ${error.message}`);
    }
  };

  const loadProducts = async () => {
    try {
      if (embeddedDB) {
        const allProducts = await embeddedDB.getAll('products');
        setProducts(allProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadOperators = async () => {
    // Mock operators data
    setOperators([
      { id: '1', name: 'John Smith', role: 'Manager', active: true },
      { id: '2', name: 'Sarah Johnson', role: 'Cashier', active: true },
      { id: '3', name: 'Mike Davis', role: 'Cashier', active: false }
    ]);
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      if (embeddedDB) {
        await embeddedDB.add('settings', {
          id: 'main_settings',
          ...settings,
          lastUpdated: new Date()
        });
      }
      
      onMessage('✅ Settings saved successfully');
    } catch (error) {
      onMessage(`❌ Failed to save settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (type, data = null) => {
    setEditDialog({ open: true, type, data });
  };

  const closeEditDialog = () => {
    setEditDialog({ open: false, type: '', data: null });
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (embeddedDB) {
        if (editDialog.data) {
          await embeddedDB.update('products', { ...editDialog.data, ...productData });
        } else {
          await embeddedDB.add('products', productData);
        }
        loadProducts();
        onMessage('✅ Product saved successfully');
      }
    } catch (error) {
      onMessage(`❌ Failed to save product: ${error.message}`);
    }
    closeEditDialog();
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (embeddedDB) {
        await embeddedDB.delete('products', productId);
        loadProducts();
        onMessage('✅ Product deleted successfully');
      }
    } catch (error) {
      onMessage(`❌ Failed to delete product: ${error.message}`);
    }
  };

  const SettingCard = ({ title, icon, children }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Settings & Management
      </Typography>

      <Grid container spacing={2} sx={{ height: 'calc(100% - 60px)' }}>
        {/* Store Settings */}
        <Grid item xs={12} md={6}>
          <SettingCard title="Store Information" icon={<SettingsIcon color="primary" />}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Store Name"
                  value={settings.store.name}
                  onChange={(e) => handleSettingChange('store', 'name', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={settings.store.address}
                  onChange={(e) => handleSettingChange('store', 'address', e.target.value)}
                  size="small"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={settings.store.phone}
                  onChange={(e) => handleSettingChange('store', 'phone', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={settings.store.email}
                  onChange={(e) => handleSettingChange('store', 'email', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  type="number"
                  value={settings.store.taxRate}
                  onChange={(e) => handleSettingChange('store', 'taxRate', parseFloat(e.target.value))}
                  size="small"
                />
              </Grid>
            </Grid>
          </SettingCard>
        </Grid>

        {/* POS Settings */}
        <Grid item xs={12} md={6}>
          <SettingCard title="POS Configuration" icon={<ReceiptIcon color="primary" />}>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Auto Print Receipts"
                  secondary="Automatically print receipts after each transaction"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.pos.autoPrintReceipts}
                    onChange={(e) => handleSettingChange('pos', 'autoPrintReceipts', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Require Customer Info"
                  secondary="Ask for customer information on every transaction"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.pos.requireCustomerInfo}
                    onChange={(e) => handleSettingChange('pos', 'requireCustomerInfo', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Allow Suspended Sales"
                  secondary="Enable suspend/resume functionality"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.pos.allowSuspendedSales}
                    onChange={(e) => handleSettingChange('pos', 'allowSuspendedSales', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Enable Barcode Scanner"
                  secondary="Use barcode scanner for product lookup"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.pos.enableBarcodeScanner}
                    onChange={(e) => handleSettingChange('pos', 'enableBarcodeScanner', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText primary="Default Payment Method" />
                <ListItemSecondaryAction>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.pos.defaultPaymentMethod}
                      onChange={(e) => handleSettingChange('pos', 'defaultPaymentMethod', e.target.value)}
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="card">Card</MenuItem>
                      <MenuItem value="digital">Digital</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingCard>
        </Grid>

        {/* Product Management */}
        <Grid item xs={12} md={6}>
          <SettingCard title="Product Management" icon={<InventoryIcon color="primary" />}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openEditDialog('product')}
                size="small"
              >
                Add Product
              </Button>
            </Box>
            
            <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
              {products.map((product) => (
                <ListItem key={product.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={product.name}
                    secondary={`${product.category} • $${product.price} • Stock: ${product.currentStock || 0}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={() => openEditDialog('product', product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </SettingCard>
        </Grid>

        {/* User Management */}
        <Grid item xs={12} md={6}>
          <SettingCard title="Operator Management" icon={<PersonIcon color="primary" />}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openEditDialog('operator')}
                size="small"
              >
                Add Operator
              </Button>
            </Box>
            
            <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
              {operators.map((operator) => (
                <ListItem key={operator.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={operator.name}
                    secondary={operator.role}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={operator.active ? 'Active' : 'Inactive'}
                      color={operator.active ? 'success' : 'default'}
                      size="small"
                    />
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </SettingCard>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              disabled={loading}
              size="large"
            >
              Save All Settings
            </Button>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={mode === 'online' ? 'Settings synced with server' : 'Settings saved locally'}
                color={mode === 'online' ? 'success' : 'warning'}
                size="small"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editDialog.type === 'product' ? 'Product Details' : 'Operator Details'}
        </DialogTitle>
        <DialogContent>
          {editDialog.type === 'product' && (
            <ProductEditForm
              product={editDialog.data}
              onSave={handleSaveProduct}
              onCancel={closeEditDialog}
            />
          )}
          {editDialog.type === 'operator' && (
            <OperatorEditForm
              operator={editDialog.data}
              onSave={() => {}} // Implement operator save
              onCancel={closeEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Product Edit Form Component
const ProductEditForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    barcode: product?.barcode || '',
    price: product?.price || 0,
    cost: product?.cost || 0,
    category: product?.category || '',
    taxRate: product?.taxRate || 8,
    currentStock: product?.currentStock || 0,
    minLevel: product?.minLevel || 10,
    isActive: product?.isActive ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Barcode"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Tax Rate (%)"
            type="number"
            value={formData.taxRate}
            onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Current Stock"
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) })}
          />
        </Grid>
      </Grid>
      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={onCancel} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
          Save
        </Button>
      </DialogActions>
    </Box>
  );
};

// Operator Edit Form Component
const OperatorEditForm = ({ operator, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: operator?.name || '',
    role: operator?.role || 'Cashier',
    active: operator?.active ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Operator Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Cashier">Cashier</MenuItem>
              <MenuItem value="Supervisor">Supervisor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={onCancel} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
          Save
        </Button>
      </DialogActions>
    </Box>
  );
};

export default SettingsManagement;
