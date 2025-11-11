import React, { useState } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Public,
  AttachMoney,
  LocationOn,
  Flag,
  Map,
  Domain,
  Refresh,
} from '@mui/icons-material';

const ApplicationSetupMasters = () => {
  const [activeTab, setActiveTab] = useState('countries');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Sample data - in real app, this would come from API
  const [data, setData] = useState({
    countries: [
      { id: 1, code: 'US', name: 'United States', currency: 'USD', phoneCode: '+1', status: 'active' },
      { id: 2, code: 'IN', name: 'India', currency: 'INR', phoneCode: '+91', status: 'active' },
      { id: 3, code: 'GB', name: 'United Kingdom', currency: 'GBP', phoneCode: '+44', status: 'active' },
      { id: 4, code: 'DE', name: 'Germany', currency: 'EUR', phoneCode: '+49', status: 'active' },
    ],
    currencies: [
      { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2, status: 'active' },
      { id: 2, code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2, status: 'active' },
      { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2, status: 'active' },
      { id: 4, code: 'INR', name: 'Indian Rupee', symbol: '₹', decimalPlaces: 2, status: 'active' },
    ],
    regions: [
      { id: 1, name: 'North America', country: 'United States', status: 'active' },
      { id: 2, name: 'South Asia', country: 'India', status: 'active' },
      { id: 3, name: 'Western Europe', country: 'Germany', status: 'active' },
      { id: 4, name: 'British Isles', country: 'United Kingdom', status: 'active' },
    ],
    states: [
      { id: 1, name: 'California', code: 'CA', country: 'United States', region: 'North America', status: 'active' },
      { id: 2, name: 'New York', code: 'NY', country: 'United States', region: 'North America', status: 'active' },
      { id: 3, name: 'Maharashtra', code: 'MH', country: 'India', region: 'South Asia', status: 'active' },
      { id: 4, name: 'Karnataka', code: 'KA', country: 'India', region: 'South Asia', status: 'active' },
    ],
    districts: [
      { id: 1, name: 'Los Angeles', state: 'California', country: 'United States', status: 'active' },
      { id: 2, name: 'Manhattan', state: 'New York', country: 'United States', status: 'active' },
      { id: 3, name: 'Mumbai', state: 'Maharashtra', country: 'India', status: 'active' },
      { id: 4, name: 'Bangalore', state: 'Karnataka', country: 'India', status: 'active' },
    ],
    areas: [
      { id: 1, name: 'Downtown LA', district: 'Los Angeles', state: 'California', status: 'active' },
      { id: 2, name: 'Midtown', district: 'Manhattan', state: 'New York', status: 'active' },
      { id: 3, name: 'Bandra', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 4, name: 'Koramangala', district: 'Bangalore', state: 'Karnataka', status: 'active' },
    ],
    divisions: [
      { id: 1, name: 'Electronics', code: 'ELC', description: 'Electronic goods and gadgets', status: 'active' },
      { id: 2, name: 'Fashion', code: 'FSH', description: 'Clothing and accessories', status: 'active' },
      { id: 3, name: 'Home & Garden', code: 'HNG', description: 'Home improvement and garden supplies', status: 'active' },
      { id: 4, name: 'Sports', code: 'SPT', description: 'Sports equipment and apparel', status: 'active' },
    ],
  });

  const [formData, setFormData] = useState({
    countries: { code: '', name: '', currency: '', phoneCode: '', status: 'active' },
    currencies: { code: '', name: '', symbol: '', decimalPlaces: 2, status: 'active' },
    regions: { name: '', country: '', status: 'active' },
    states: { name: '', code: '', country: '', region: '', status: 'active' },
    districts: { name: '', state: '', country: '', status: 'active' },
    areas: { name: '', district: '', state: '', status: 'active' },
    divisions: { name: '', code: '', description: '', status: 'active' },
  });

  const tabs = [
    { id: 'countries', label: 'Countries', icon: <Public />, color: 'primary' },
    { id: 'currencies', label: 'Currencies', icon: <AttachMoney />, color: 'success' },
    { id: 'regions', label: 'Regions', icon: <LocationOn />, color: 'info' },
    { id: 'states', label: 'States', icon: <Flag />, color: 'warning' },
    { id: 'districts', label: 'Districts', icon: <Map />, color: 'error' },
    { id: 'areas', label: 'Areas', icon: <Domain />, color: 'secondary' },
    { id: 'divisions', label: 'Divisions', icon: <Domain />, color: 'primary' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingItem(null);
    setFormData(prev => ({
      ...prev,
      [tabId]: {
        code: '',
        name: '',
        currency: '',
        phoneCode: '',
        symbol: '',
        decimalPlaces: 2,
        country: '',
        region: '',
        state: '',
        district: '',
        description: '',
        status: 'active'
      }
    }));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(prev => ({
      ...prev,
      [activeTab]: { ...item }
    }));
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    setData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(item => item.id !== id)
    }));
    setSnackbar({
      open: true,
      message: 'Item deleted successfully',
      severity: 'success'
    });
  };

  const handleSave = () => {
    if (editingItem) {
      // Update existing item
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(item => 
          item.id === editingItem.id ? { ...formData[activeTab], id: editingItem.id } : item
        )
      }));
      setSnackbar({
        open: true,
        message: 'Item updated successfully',
        severity: 'success'
      });
    } else {
      // Add new item
      const newItem = {
        ...formData[activeTab],
        id: Date.now() // In real app, this would be generated by backend
      };
      setData(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newItem]
      }));
      setSnackbar({
        open: true,
        message: 'Item added successfully',
        severity: 'success'
      });
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const renderTable = () => {
    const currentData = data[activeTab];
    const columns = getColumnsForTab(activeTab);

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === 'currency' && item.symbol ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{item.symbol}</Typography>
                        <Typography variant="body2">{item[column.id]}</Typography>
                      </Box>
                    ) : (
                      item[column.id]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Chip
                    label={item.status}
                    color={item.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(item)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getColumnsForTab = (tabId) => {
    const columnMap = {
      countries: [
        { id: 'code', label: 'Code' },
        { id: 'name', label: 'Name' },
        { id: 'currency', label: 'Currency' },
        { id: 'phoneCode', label: 'Phone Code' },
      ],
      currencies: [
        { id: 'code', label: 'Code' },
        { id: 'name', label: 'Name' },
        { id: 'symbol', label: 'Symbol' },
        { id: 'decimalPlaces', label: 'Decimal Places' },
      ],
      regions: [
        { id: 'name', label: 'Region Name' },
        { id: 'country', label: 'Country' },
      ],
      states: [
        { id: 'name', label: 'State Name' },
        { id: 'code', label: 'Code' },
        { id: 'country', label: 'Country' },
        { id: 'region', label: 'Region' },
      ],
      districts: [
        { id: 'name', label: 'District Name' },
        { id: 'state', label: 'State' },
        { id: 'country', label: 'Country' },
      ],
      areas: [
        { id: 'name', label: 'Area Name' },
        { id: 'district', label: 'District' },
        { id: 'state', label: 'State' },
      ],
      divisions: [
        { id: 'name', label: 'Division Name' },
        { id: 'code', label: 'Code' },
        { id: 'description', label: 'Description' },
      ],
    };
    return columnMap[tabId] || [];
  };

  const renderForm = () => {
    const currentForm = formData[activeTab];
    const columns = getColumnsForTab(activeTab);

    return (
      <Grid container spacing={2}>
        {columns.map((column) => {
          if (column.id === 'country' || column.id === 'region' || column.id === 'state') {
            return (
              <Grid item xs={12} sm={6} key={column.id}>
                <FormControl fullWidth>
                  <InputLabel>{column.label}</InputLabel>
                  <Select
                    value={currentForm[column.id]}
                    label={column.label}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [activeTab]: {
                        ...prev[activeTab],
                        [column.id]: e.target.value
                      }
                    }))}
                  >
                    {data[column.id]?.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            );
          }

          if (column.id === 'decimalPlaces') {
            return (
              <Grid item xs={12} sm={6} key={column.id}>
                <FormControl fullWidth>
                  <InputLabel>{column.label}</InputLabel>
                  <Select
                    value={currentForm[column.id]}
                    label={column.label}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [activeTab]: {
                        ...prev[activeTab],
                        [column.id]: parseInt(e.target.value)
                      }
                    }))}
                  >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            );
          }

          return (
            <Grid item xs={12} sm={6} key={column.id}>
              <TextField
                fullWidth
                label={column.label}
                value={currentForm[column.id]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [activeTab]: {
                    ...prev[activeTab],
                    [column.id]: e.target.value
                  }
                }))}
                multiline={column.id === 'description'}
                rows={column.id === 'description' ? 3 : 1}
              />
            </Grid>
          );
        })}
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={currentForm.status}
              label="Status"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                [activeTab]: {
                  ...prev[activeTab],
                  status: e.target.value
                }
              }))}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Application Setup Masters" 
            subtitle="Manage geographical and organizational master data"
            showIcon={true}
            icon={<Settings />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add New
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2 }}>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'contained' : 'outlined'}
              startIcon={tab.icon}
              onClick={() => handleTabChange(tab.id)}
              sx={{ 
                mb: 1,
                ...(activeTab === tab.id && { bgcolor: `${tab.color}.main` })
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {tabs.find(tab => tab.id === activeTab)?.label} Master
            </Typography>
            <Chip
              label={`${data[activeTab].length} records`}
              color="primary"
              variant="outlined"
            />
          </Box>
          {renderTable()}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit' : 'Add New'} {tabs.find(tab => tab.id === activeTab)?.label}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {renderForm()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
            {editingItem ? 'Update' : 'Save'}
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

export default ApplicationSetupMasters;

