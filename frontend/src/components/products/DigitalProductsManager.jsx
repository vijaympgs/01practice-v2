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
  Alert,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  CloudUpload,
  Download,
  Visibility,
  VisibilityOff,
  VideoFile,
  AudioFile,
  Description,
  Image,
  Code,
  Security,
  Schedule,
  CheckCircle,
  Warning,
  ExpandMore,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
} from '@mui/icons-material';

const DigitalProductsManager = () => {
  const [digitalProducts, setDigitalProducts] = useState([
    {
      id: 1,
      name: 'Complete React Development Course',
      sku: 'DIGITAL-2025-001',
      type: 'Course',
      format: 'Video',
      description: 'Learn React from basics to advanced concepts',
      fileSize: '2.5 GB',
      duration: '15 hours',
      price: 199.00,
      downloadLimit: 3,
      expiryDays: 365,
      status: 'active',
      featured: true,
      files: [
        { name: 'Introduction.mp4', size: '500 MB', type: 'video' },
        { name: 'Components.pdf', size: '2 MB', type: 'document' },
        { name: 'Exercises.zip', size: '50 MB', type: 'archive' },
      ],
      sales: 1250,
      revenue: 248750.00,
    },
    {
      id: 2,
      name: 'Premium Stock Photos Pack',
      sku: 'DIGITAL-2025-002',
      type: 'Media',
      format: 'Image',
      description: 'High-quality stock photos for commercial use',
      fileSize: '1.2 GB',
      duration: null,
      price: 49.00,
      downloadLimit: 10,
      expiryDays: null,
      status: 'active',
      featured: false,
      files: [
        { name: 'Nature Photos.zip', size: '800 MB', type: 'archive' },
        { name: 'Urban Photos.zip', size: '400 MB', type: 'archive' },
      ],
      sales: 890,
      revenue: 43610.00,
    },
    {
      id: 3,
      name: 'Business Template Pack',
      sku: 'DIGITAL-2025-003',
      type: 'Template',
      format: 'Document',
      description: 'Professional business document templates',
      fileSize: '150 MB',
      duration: null,
      price: 29.00,
      downloadLimit: 5,
      expiryDays: 180,
      status: 'active',
      featured: false,
      files: [
        { name: 'Invoices.xlsx', size: '5 MB', type: 'document' },
        { name: 'Presentations.pptx', size: '120 MB', type: 'document' },
        { name: 'Reports.docx', size: '25 MB', type: 'document' },
      ],
      sales: 567,
      revenue: 16443.00,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    type: 'Course',
    format: 'Video',
    description: '',
    fileSize: '',
    duration: '',
    price: 0,
    downloadLimit: 3,
    expiryDays: null,
    status: 'active',
    featured: false,
    files: [],
  });

  const productTypes = [
    { value: 'Course', label: 'Online Course' },
    { value: 'Ebook', label: 'E-book' },
    { value: 'Software', label: 'Software' },
    { value: 'Template', label: 'Template' },
    { value: 'Media', label: 'Media' },
    { value: 'Music', label: 'Music' },
    { value: 'Game', label: 'Game' },
  ];

  const formats = {
    Course: ['Video', 'Audio', 'Document'],
    Ebook: ['PDF', 'EPUB', 'MOBI'],
    Software: ['Windows', 'Mac', 'Linux', 'Mobile'],
    Template: ['Document', 'Presentation', 'Spreadsheet'],
    Media: ['Image', 'Video', 'Audio'],
    Music: ['MP3', 'FLAC', 'WAV'],
    Game: ['PC', 'Console', 'Mobile'],
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'Video': return <VideoFile />;
      case 'Audio': return <AudioFile />;
      case 'Document': return <Description />;
      case 'Image': return <Image />;
      case 'PDF': return <Description />;
      default: return <Code />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'processing': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      type: 'Course',
      format: 'Video',
      description: '',
      fileSize: '',
      duration: '',
      price: 0,
      downloadLimit: 3,
      expiryDays: null,
      status: 'active',
      featured: false,
      files: [],
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setDialogOpen(true);
  };

  const handleDeleteProduct = (id) => {
    setDigitalProducts(digitalProducts.filter(product => product.id !== id));
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Update existing product
      setDigitalProducts(digitalProducts.map(product => 
        product.id === editingProduct.id ? { ...formData, id: editingProduct.id } : product
      ));
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: Date.now(),
        sales: 0,
        revenue: 0,
      };
      setDigitalProducts([...digitalProducts, newProduct]);
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const toggleProductStatus = (id) => {
    setDigitalProducts(digitalProducts.map(product => 
      product.id === id ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' } : product
    ));
  };

  const toggleFeatured = (id) => {
    setDigitalProducts(digitalProducts.map(product => 
      product.id === id ? { ...product, featured: !product.featured } : product
    ));
  };

  const handleFileUpload = () => {
    setUploadDialogOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Digital Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage digital products, courses, and downloadable content
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
        >
          Add Digital Product
        </Button>
      </Box>

      {/* Digital Products Grid */}
      <Grid container spacing={3}>
        {digitalProducts.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product.id}>
            <Card>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    height: 200,
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                    {getFormatIcon(product.format)}
                  </Avatar>
                </Box>
                {product.featured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                  />
                )}
                <Chip
                  label={product.type}
                  color="secondary"
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                />
              </Box>
              
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={getFormatIcon(product.format)}
                    label={product.format}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={product.fileSize}
                    size="small"
                    variant="outlined"
                  />
                  {product.duration && (
                    <Chip
                      label={product.duration}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      {product.sales} sold
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      ${product.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={product.status}
                    color={getStatusColor(product.status)}
                    size="small"
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Upload Files">
                      <IconButton
                        size="small"
                        onClick={handleFileUpload}
                      >
                        <CloudUpload />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={product.status === 'active' ? 'Deactivate' : 'Activate'}>
                      <IconButton
                        size="small"
                        onClick={() => toggleProductStatus(product.id)}
                      >
                        {product.status === 'active' ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProduct(product.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Digital Product' : 'Add New Digital Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Product Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Product Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, format: formats[e.target.value][0] })}
                >
                  {productTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={formData.format}
                  label="Format"
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                >
                  {formats[formData.type]?.map((format) => (
                    <MenuItem key={format} value={format}>
                      {format}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="File Size"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="e.g., 2.5 GB"
              />
            </Grid>

            {formData.type === 'Course' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 15 hours"
                />
              </Grid>
            )}

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
                label="Download Limit"
                type="number"
                value={formData.downloadLimit}
                onChange={(e) => setFormData({ ...formData, downloadLimit: parseInt(e.target.value) })}
                helperText="Number of times customer can download"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Days"
                type="number"
                value={formData.expiryDays || ''}
                onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value ? parseInt(e.target.value) : null })}
                helperText="Leave empty for no expiry"
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
                  <MenuItem value="processing">Processing</MenuItem>
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
                label="Featured Product"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSaveProduct} variant="contained" startIcon={<Save />}>
            {editingProduct ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Digital Files</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & Drop Files Here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Or click to browse and select files
            </Typography>
            <Button variant="contained" startIcon={<CloudUpload />}>
              Choose Files
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Upload Progress
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <VideoFile />
              </ListItemIcon>
              <ListItemText
                primary="Introduction.mp4"
                secondary="500 MB"
              />
              <LinearProgress variant="determinate" value={75} sx={{ width: 100 }} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText
                primary="Components.pdf"
                secondary="2 MB"
              />
              <LinearProgress variant="determinate" value={100} sx={{ width: 100 }} />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Upload Files
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DigitalProductsManager;

