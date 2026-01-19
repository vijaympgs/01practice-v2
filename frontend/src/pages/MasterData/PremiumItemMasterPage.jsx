import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Snackbar,
    Alert,
    Divider,
    Stack,
    Avatar,
    Tooltip,
    Switch,
    FormControlLabel,
    Tabs,
    Tab,
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
    Skeleton,
    CardActionArea,
    CardMedia,
    Fade,
    Zoom,
} from '@mui/material';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Inventory as InventoryIcon,
    Info as InfoIcon,
    Search as SearchIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon,
    DensitySmall as DensitySmallIcon,
    DensityMedium as DensityMediumIcon,
    ContentCopy as CopyIcon,
    Inventory2 as StockIcon,
    Category as CategoryIcon,
    LocalOffer as LocalOfferIcon,
    Business as BusinessIcon,
    Inventory2 as PackageIcon,
    SwapHoriz as SwapHorizIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    Description as DescriptionIcon,
    Timeline as TimelineIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const PremiumItemMasterPage = () => {
    const [items, setItems] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // UI State
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [density, setDensity] = useState('comfortable'); // 'compact' or 'comfortable'
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    // Form state
    const [form, setForm] = useState({
        item_code: '',
        item_name: '',
        short_name: '',
        supplier: '',
        manufacturer: '',
        division: '',
        department: '',
        group: '',
        item_status: 'active',
        item_type: 'merchandise',
        stock_valuation_method: 'fifo',
        stock_uom: '',
        purchase_uom: '',
        sales_uom: '',
        item_image: '',
        is_active: true,
    });

    const itemTypeOptions = [
        { value: 'merchandise', label: 'Merchandise Item' },
        { value: 'non_merchandise', label: 'Non-Merchandise Item' },
        { value: 'non_physical', label: 'Non-Physical' },
    ];

    const valuationMethodOptions = [
        { value: 'fifo', label: 'First-In First-Out (FIFO)' },
        { value: 'lifo', label: 'Last-In Last-Out (LIFO)' },
        { value: 'average', label: 'Average Cost' },
    ];

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);

        if (token) {
            loadData();
            loadUOMs();
        }
    }, []);

    useEffect(() => {
        // Filter items based on search query
        if (!searchQuery.trim()) {
            setFilteredItems(items);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = items.filter(item =>
                item.item_code?.toLowerCase().includes(query) ||
                item.item_name?.toLowerCase().includes(query) ||
                item.supplier?.toLowerCase().includes(query) ||
                item.manufacturer?.toLowerCase().includes(query)
            );
            setFilteredItems(filtered);
        }
    }, [searchQuery, items]);

    const loadUOMs = async () => {
        try {
            const response = await api.get('/products/uom/');
            setUoms(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading UOMs:', error);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products/advanced-item-master/');
            setItems(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading data:', error);
            setSnackbar({
                open: true,
                message: 'Error loading items. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (item = null) => {
        setEditingItem(item);
        setTabValue(0);

        if (item) {
            setForm({
                item_code: item.item_code || '',
                item_name: item.item_name || '',
                short_name: item.short_name || '',
                supplier: item.supplier || '',
                manufacturer: item.manufacturer || '',
                division: item.division || '',
                department: item.department || '',
                group: item.group || '',
                item_status: item.item_status || 'active',
                item_type: item.item_type || 'merchandise',
                stock_valuation_method: item.stock_valuation_method || 'fifo',
                stock_uom: item.stock_uom || '',
                purchase_uom: item.purchase_uom || '',
                sales_uom: item.sales_uom || '',
                item_image: item.item_image || '',
                is_active: item.is_active !== false,
            });
        } else {
            setForm({
                item_code: '',
                item_name: '',
                short_name: '',
                supplier: '',
                manufacturer: '',
                division: '',
                department: '',
                group: '',
                item_status: 'active',
                item_type: 'merchandise',
                stock_valuation_method: 'fifo',
                stock_uom: '',
                purchase_uom: '',
                sales_uom: '',
                item_image: '',
                is_active: true,
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingItem(null);
        setTabValue(0);
    };

    const handleInputChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            if (!form.item_code.trim()) {
                setSnackbar({
                    open: true,
                    message: 'Item Code is required',
                    severity: 'error',
                });
                return;
            }

            if (!form.item_name.trim()) {
                setSnackbar({
                    open: true,
                    message: 'Item Name is required',
                    severity: 'error',
                });
                return;
            }

            if (editingItem) {
                await api.put(`/products/advanced-item-master/${editingItem.id}/`, form);
                setSnackbar({
                    open: true,
                    message: 'Item updated successfully!',
                    severity: 'success',
                });
            } else {
                await api.post('/products/advanced-item-master/', form);
                setSnackbar({
                    open: true,
                    message: 'Item created successfully!',
                    severity: 'success',
                });
            }

            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Error saving item:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.detail || 'Error saving item. Please try again.',
                severity: 'error',
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/products/advanced-item-master/${id}/`);
                setSnackbar({
                    open: true,
                    message: 'Item deleted successfully!',
                    severity: 'success',
                });
                loadData();
            } catch (error) {
                console.error('Error deleting item:', error);
                setSnackbar({
                    open: true,
                    message: 'Error deleting item. Please try again.',
                    severity: 'error',
                });
            }
        }
    };

    const handleDuplicate = (item) => {
        const duplicatedItem = {
            ...item,
            item_code: `${item.item_code}_COPY`,
            item_name: `${item.item_name} (Copy)`,
        };
        delete duplicatedItem.id;
        setForm(duplicatedItem);
        setEditingItem(null);
        setOpenDialog(true);
    };

    const getItemImage = (item) => {
        if (item.item_image) {
            return item.item_image;
        }
        // Placeholder image
        return `https://via.placeholder.com/80x80/1976d2/FFFFFF?text=${item.item_code?.[0] || 'I'}`;
    };

    if (!isAuthenticated) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                    Authentication Required
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Please log in to access Premium Item Master.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => window.location.href = '/login'}
                >
                    Go to Login
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <PageTitle
                title="Premium Item Master"
                subtitle="Advanced item management with premium UX"
            />

            {/* Filters & Controls Bar */}
            <Card sx={{
                borderRadius: 0,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                mb: 3,
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                }
            }}>
                <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Search Bar */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by code, name, supplier, or manufacturer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2 }
                                }}
                            />
                        </Grid>

                        {/* View Toggle */}
                        <Grid item xs={12} md={3}>
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                                size="small"
                                fullWidth
                            >
                                <ToggleButton value="table" aria-label="table view">
                                    <ViewListIcon sx={{ mr: 0.5 }} fontSize="small" />
                                    Table
                                </ToggleButton>
                                <ToggleButton value="grid" aria-label="grid view">
                                    <ViewModuleIcon sx={{ mr: 0.5 }} fontSize="small" />
                                    Cards
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>

                        {/* Density Toggle */}
                        <Grid item xs={12} md={3}>
                            <ToggleButtonGroup
                                value={density}
                                exclusive
                                onChange={(e, newDensity) => newDensity && setDensity(newDensity)}
                                size="small"
                                fullWidth
                            >
                                <ToggleButton value="compact" aria-label="compact density">
                                    <DensitySmallIcon sx={{ mr: 0.5 }} fontSize="small" />
                                    Compact
                                </ToggleButton>
                                <ToggleButton value="comfortable" aria-label="comfortable density">
                                    <DensityMediumIcon sx={{ mr: 0.5 }} fontSize="small" />
                                    Comfortable
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Main Content Card */}
            <Card sx={{
                borderRadius: 0,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <CardHeader title={`Items (${filteredItems.length})`}>
                    <ActionButton
                        onClick={() => handleOpenDialog()}
                        startIcon={<AddIcon />}
                    >
                        Add New Item
                    </ActionButton>
                </CardHeader>

                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        // Skeleton Loaders
                        <Box sx={{ p: 3 }}>
                            {[...Array(5)].map((_, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Skeleton variant="rectangular" height={density === 'compact' ? 50 : 70} sx={{ borderRadius: 1 }} />
                                </Box>
                            ))}
                        </Box>
                    ) : viewMode === 'table' ? (
                        // Table View
                        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                            <Table size={density === 'compact' ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Item Code</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredItems.map((item) => (
                                        <Fade in key={item.id} timeout={300}>
                                            <TableRow
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: 'grey.50',
                                                        transform: 'translateX(4px)',
                                                        transition: 'all 0.2s ease'
                                                    },
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <TableCell>
                                                    <Avatar
                                                        src={getItemImage(item)}
                                                        alt={item.item_code}
                                                        variant="rounded"
                                                        sx={{
                                                            width: density === 'compact' ? 40 : 56,
                                                            height: density === 'compact' ? 40 : 56,
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <InventoryIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {item.item_code}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {item.item_name}
                                                    </Typography>
                                                    {item.short_name && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {item.short_name}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>{item.supplier || '-'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.is_active ? 'Active' : 'Inactive'}
                                                        color={item.is_active ? 'success' : 'default'}
                                                        size="small"
                                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                                        <Tooltip title="Edit" arrow>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDialog(item)}
                                                                sx={{
                                                                    color: 'primary.main',
                                                                    '&:hover': {
                                                                        bgcolor: 'primary.light',
                                                                        color: 'white',
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Duplicate" arrow>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDuplicate(item)}
                                                                sx={{
                                                                    color: 'info.main',
                                                                    '&:hover': {
                                                                        bgcolor: 'info.light',
                                                                        color: 'white',
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                <CopyIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" arrow>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDelete(item.id)}
                                                                sx={{
                                                                    color: 'error.main',
                                                                    '&:hover': {
                                                                        bgcolor: 'error.light',
                                                                        color: 'white',
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        </Fade>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        // Grid/Card View
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                {filteredItems.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                        <Zoom in timeout={300}>
                                            <Card sx={{
                                                height: '100%',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                                                }
                                            }}>
                                                <CardActionArea onClick={() => handleOpenDialog(item)}>
                                                    <CardMedia
                                                        component="img"
                                                        height={density === 'compact' ? 140 : 180}
                                                        image={getItemImage(item)}
                                                        alt={item.item_code}
                                                        sx={{ objectFit: 'cover', bgcolor: 'grey.100' }}
                                                    />
                                                    <CardContent>
                                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                            {item.item_code}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" noWrap>
                                                            {item.item_name}
                                                        </Typography>
                                                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Chip
                                                                label={item.is_active ? 'Active' : 'Inactive'}
                                                                color={item.is_active ? 'success' : 'default'}
                                                                size="small"
                                                                sx={{ borderRadius: 1 }}
                                                            />
                                                            <Stack direction="row" spacing={0.5}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => { e.stopPropagation(); handleDuplicate(item); }}
                                                                    sx={{ color: 'info.main' }}
                                                                >
                                                                    <CopyIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                                    sx={{ color: 'error.main' }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Stack>
                                                        </Box>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Zoom>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogHeader
                    title={`${editingItem ? 'Edit' : 'Add'} Item`}
                    icon={<InventoryIcon />}
                />
                <DialogContent sx={{ p: 0 }}>
                    {/* Tabs */}
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
                    >
                        <Tab label="General" icon={<InfoIcon />} iconPosition="start" />
                        <Tab label="Inventory" icon={<StockIcon />} iconPosition="start" />
                        <Tab label="Pricing" icon={<LocalOfferIcon />} iconPosition="start" />
                    </Tabs>

                    {/* Tab Content */}
                    <Box sx={{ p: 3 }}>
                        {tabValue === 0 && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Item Code"
                                        value={form.item_code}
                                        onChange={handleInputChange('item_code')}
                                        required
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Item Name"
                                        value={form.item_name}
                                        onChange={handleInputChange('item_name')}
                                        required
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Short Name"
                                        value={form.short_name}
                                        onChange={handleInputChange('short_name')}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Supplier"
                                        value={form.supplier}
                                        onChange={handleInputChange('supplier')}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Manufacturer"
                                        value={form.manufacturer}
                                        onChange={handleInputChange('manufacturer')}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Item Type</InputLabel>
                                        <Select
                                            value={form.item_type}
                                            onChange={handleInputChange('item_type')}
                                            label="Item Type"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {itemTypeOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Image URL"
                                        value={form.item_image}
                                        onChange={handleInputChange('item_image')}
                                        placeholder="https://example.com/image.jpg"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={form.is_active}
                                                onChange={handleInputChange('is_active')}
                                                color="primary"
                                            />
                                        }
                                        label="Active"
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {tabValue === 1 && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        Inventory settings coming soon...
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}

                        {tabValue === 2 && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        Pricing details coming soon...
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        onClick={handleCloseDialog}
                        startIcon={<CancelIcon />}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        {editingItem ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PremiumItemMasterPage;
