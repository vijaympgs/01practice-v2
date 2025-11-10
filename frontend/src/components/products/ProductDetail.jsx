import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const ProductDetail = ({ product, onEdit, onDelete, onClose }) => {
  if (!product) {
    return (
      <Alert severity="info">
        No product selected
      </Alert>
    );
  }

  const getStockStatusChip = (status) => {
    const statusConfig = {
      'out_of_stock': { color: 'error', icon: <CancelIcon />, label: 'Out of Stock' },
      'low_stock': { color: 'warning', icon: <WarningIcon />, label: 'Low Stock' },
      'in_stock': { color: 'success', icon: <CheckCircleIcon />, label: 'In Stock' },
      'overstocked': { color: 'info', icon: <InventoryIcon />, label: 'Overstocked' }
    };
    
    const config = statusConfig[status] || statusConfig['in_stock'];
    
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="filled"
      />
    );
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatProfitMargin = (margin) => {
    return `${parseFloat(margin).toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getProfitMarginColor = (margin) => {
    if (margin < 0) return 'error';
    if (margin < 20) return 'warning';
    return 'success';
  };

  const getStockProgress = () => {
    if (!product.maximum_stock || product.maximum_stock === 0) {
      return 0;
    }
    return Math.min((product.stock_quantity / product.maximum_stock) * 100, 100);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Product Details
        </Typography>
        <Box display="flex" gap={1}>
          <Tooltip title="Edit Product">
            <IconButton onClick={() => onEdit(product)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton 
              onClick={() => onDelete(product)} 
              color="error"
              disabled={product.stock_quantity > 0}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Product Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {product.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    SKU
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {product.sku}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Barcode
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {product.barcode || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  {product.category ? (
                    <Chip
                      label={product.category.name}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No Category
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {product.description || 'No description available'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Image */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Image
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" justifyContent="center">
                {product.image ? (
                  <Avatar
                    src={product.image}
                    alt={product.name}
                    sx={{ width: 200, height: 200 }}
                    variant="rounded"
                  />
                ) : (
                  <Avatar
                    sx={{ width: 200, height: 200, bgcolor: 'grey.300' }}
                    variant="rounded"
                  >
                    <ImageIcon sx={{ fontSize: 80, color: 'grey.500' }} />
                  </Avatar>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pricing Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Selling Price</strong></TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary">
                          {formatPrice(product.price)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Cost Price</strong></TableCell>
                      <TableCell align="right">
                        {product.cost ? formatPrice(product.cost) : 'N/A'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Profit Amount</strong></TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body1" 
                          color={product.profit_amount >= 0 ? 'success.main' : 'error.main'}
                        >
                          {product.profit_amount ? formatPrice(product.profit_amount) : 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Profit Margin</strong></TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body1" 
                          color={`${getProfitMarginColor(product.profit_margin)}.main`}
                        >
                          {formatProfitMargin(product.profit_margin)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Current Stock</strong></TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">
                          {product.stock_quantity}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Minimum Stock</strong></TableCell>
                      <TableCell align="right">
                        {product.minimum_stock}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Maximum Stock</strong></TableCell>
                      <TableCell align="right">
                        {product.maximum_stock || 'N/A'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Stock Status</strong></TableCell>
                      <TableCell align="right">
                        {getStockStatusChip(product.stock_status)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Stock Value</strong></TableCell>
                      <TableCell align="right">
                        {product.stock_value ? formatPrice(product.stock_value) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              {product.maximum_stock && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Stock Level Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getStockProgress()}
                    color={getStockProgress() > 80 ? 'warning' : 'primary'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {getStockProgress().toFixed(1)}% of maximum stock
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Brand</strong></TableCell>
                      <TableCell>{product.brand || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Model</strong></TableCell>
                      <TableCell>{product.model || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Color</strong></TableCell>
                      <TableCell>{product.color || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Size</strong></TableCell>
                      <TableCell>{product.size || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Weight</strong></TableCell>
                      <TableCell>{product.weight ? `${product.weight} kg` : 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Dimensions</strong></TableCell>
                      <TableCell>{product.dimensions || 'N/A'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Status & Tax Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status & Tax Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell>
                        <Chip
                          label={product.is_active ? 'Active' : 'Inactive'}
                          color={product.is_active ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Can be Sold</strong></TableCell>
                      <TableCell>
                        <Chip
                          label={product.can_be_sold ? 'Yes' : 'No'}
                          color={product.can_be_sold ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Taxable</strong></TableCell>
                      <TableCell>
                        <Chip
                          label={product.is_taxable ? 'Yes' : 'No'}
                          color={product.is_taxable ? 'info' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Tax Rate</strong></TableCell>
                      <TableCell>
                        {product.is_taxable ? `${product.tax_rate}%` : 'N/A'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Timestamps */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timestamps
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(product.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Updated At
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(product.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetail;


















































