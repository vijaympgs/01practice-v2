import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import inventoryService from '../../services/inventoryService';

const InventoryList = ({ onRefresh, onStockAdjust }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, [page, rowsPerPage, searchQuery, statusFilter, categoryFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
      };

      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category_id = categoryFilter;

      const response = await inventoryService.getInventoryList(params);
      
      setInventory(response.data.results || response.data);
      setTotalCount(response.data.count || response.data.length);
    } catch (err) {
      setError('Failed to load inventory');
      console.error('Inventory load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleAdjustStock = () => {
    if (selectedItem) {
      // Pass selected item to parent for stock adjustment
      onStockAdjust(selectedItem);
    }
    handleMenuClose();
  };

  const handleViewMovements = () => {
    if (selectedItem) {
      // Navigate to movements view or open dialog
      console.log('View movements for:', selectedItem.id);
    }
    handleMenuClose();
  };

  const getStatusChip = (status, currentStock, minStock) => {
    let color = 'default';
    let label = status;

    if (status === 'out_of_stock') {
      color = 'error';
      label = 'Out of Stock';
    } else if (status === 'low_stock') {
      color = 'warning';
      label = 'Low Stock';
    } else {
      color = 'success';
      label = 'In Stock';
    }

    return <Chip label={label} color={color} size="small" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const columns = [
    {
      id: 'product_name',
      label: 'Product',
      minWidth: 200,
      render: (item) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {item.product_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SKU: {item.product_sku}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'category_name',
      label: 'Category',
      minWidth: 120,
      render: (item) => (
        <Chip label={item.category_name || 'Uncategorized'} size="small" variant="outlined" />
      ),
    },
    {
      id: 'current_stock',
      label: 'Stock Level',
      minWidth: 100,
      align: 'center',
      render: (item) => (
        <Box textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            {item.current_stock}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            / {item.available_stock} available
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (item) => getStatusChip(item.status, item.current_stock, item.min_stock_level),
    },
    {
      id: 'cost_price',
      label: 'Cost Price',
      minWidth: 100,
      align: 'right',
      render: (item) => formatCurrency(item.cost_price),
    },
    {
      id: 'selling_price',
      label: 'Selling Price',
      minWidth: 100,
      align: 'right',
      render: (item) => formatCurrency(item.selling_price),
    },
    {
      id: 'value_total',
      label: 'Total Value',
      minWidth: 100,
      align: 'right',
      render: (item) => formatCurrency(item.value_total),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 80,
      align: 'center',
      render: (item) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, item)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading inventory...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="in_stock">In Stock</MenuItem>
                  <MenuItem value="low_stock">Low Stock</MenuItem>
                  <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {/* Reset filters */}}
              >
                Clear Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {/* New inventory item */}}
                fullWidth
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ minWidth: column.minWidth, backgroundColor: 'grey.50' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow hover key={item.id}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                      >
                        {column.render ? column.render(item) : item[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleAdjustStock}>
          <EditIcon sx={{ mr: 1 }} />
          Adjust Stock
        </MenuItem>
        <MenuItem onClick={handleViewMovements}>
          <AssessmentIcon sx={{ mr: 1 }} />
          View Movements
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default InventoryList;
