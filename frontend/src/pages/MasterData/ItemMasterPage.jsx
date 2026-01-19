import React, { useState, useEffect, useRef } from 'react';
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
    Checkbox,
    Menu,
    Collapse,
    Badge,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
import ItemMasterFormDialog from '../../components/forms/ItemMasterFormDialog';
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
    Settings as SettingsIcon,
    Description as DescriptionIcon,
    Timeline as TimelineIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    CloudUpload as CloudUploadIcon,
    QrCodeScanner as ScanIcon,
    DragIndicator as DragIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import {
    exportToCSV,
    exportToExcel,
    handleImageUpload,
    initBarcodeScanner,
    performBulkAction,
    applyAdvancedFilters,
    reorderItems,
    saveSortOrder
} from '../../utils/itemMasterEnhancements';

const ItemMasterPage = () => {
    // Core state
    const [items, setItems] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // UI State
    const [viewMode, setViewMode] = useState('table');
    const [density, setDensity] = useState('comfortable');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    // Bulk Actions State
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [bulkActionAnchor, setBulkActionAnchor] = useState(null);

    // Advanced Filters State
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        dateFrom: null,
        dateTo: null,
        supplier: ''
    });

    // Image Upload State
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Barcode Scanner State
    const [openScanner, setOpenScanner] = useState(false);
    const [scannedCode, setScannedCode] = useState('');

    // Additional state for comprehensive form
    const [categories, setCategories] = useState([]);
    const [themeColor] = useState('#1976d2');
    const [attributes, setAttributes] = useState([]);
    const [attributeValues, setAttributeValues] = useState({});

    // Form state - Comprehensive from original ItemMasterPage
    const [form, setForm] = useState({
        // General
        ean_upc_code: '',
        item_code: '',
        item_name: '',
        short_name: '',
        brand: '',
        supplier: '',

        // Pricing
        cost_price: '',
        landing_cost: '',
        sell_price: '',
        mrp: '',
        store_pickup: false,
        sales_margin: '',

        // Taxes
        tax_inclusive: false,

        // Sales
        allow_buy_back: false,
        allow_negative_stock: false,

        // Packing
        base_uom: '',
        purchase_uom: '',
        sales_uom: '',

        // Category
        category: '',

        // Local Tax (GST)
        tax_code: '',
        hsn_code: '',
        tax_slab: '',

        // Item Type
        material_type: 'finished',
        material_group: '',
        item_type: 'device',
        exchange_type: 'none',

        // Image
        item_image: '',

        // Status
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

    // ============================================
    // INITIALIZATION
    // ============================================

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);

        if (token) {
            loadData();
            loadUOMs();
            loadCategories();
            loadAttributes();
        }
    }, []);

    // Initialize barcode scanner
    useEffect(() => {
        const cleanup = initBarcodeScanner(
            (barcode) => {
                console.log('Barcode scanned:', barcode);
                setScannedCode(barcode);
                searchByBarcode(barcode);
            },
            (error) => console.error('Scanner error:', error)
        );

        return cleanup;
    }, [items]);

    // Apply filters
    useEffect(() => {
        let filtered = items;

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.item_code?.toLowerCase().includes(query) ||
                item.item_name?.toLowerCase().includes(query) ||
                item.supplier?.toLowerCase().includes(query) ||
                item.manufacturer?.toLowerCase().includes(query)
            );
        }

        // Apply advanced filters
        filtered = applyAdvancedFilters(filtered, filters);

        setFilteredItems(filtered);
    }, [searchQuery, items, filters]);

    // ============================================
    // DATA LOADING
    // ============================================

    const loadUOMs = async () => {
        try {
            const response = await api.get('/products/uom/');
            setUoms(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading UOMs:', error);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadAttributes = async () => {
        try {
            // Load attributes from localStorage (Attributes Management page)
            const savedAttributes = localStorage.getItem('attributes');
            const attrs = savedAttributes ? JSON.parse(savedAttributes).filter(attr => attr.is_active) : [];
            setAttributes(attrs);

            // Load attribute values from localStorage (Attribute Values page)
            const savedValues = localStorage.getItem('attributeValues');
            const allValues = savedValues ? JSON.parse(savedValues).filter(val => val.is_active) : [];

            // Group values by attribute_id
            const valuesMap = {};
            for (const attr of attrs) {
                valuesMap[attr.id] = allValues.filter(val => val.attribute_id === attr.id);
            }
            setAttributeValues(valuesMap);
        } catch (error) {
            console.error('Error loading attributes:', error);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products/item-master/');
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

    // ============================================
    // BULK ACTIONS
    // ============================================

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(filteredItems.map(item => item.id));
            setSelectAll(true);
        } else {
            setSelected([]);
            setSelectAll(false);
        }
    };

    const handleSelectOne = (id) => {
        const currentIndex = selected.indexOf(id);
        const newSelected = [...selected];

        if (currentIndex === -1) {
            newSelected.push(id);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelected(newSelected);
        setSelectAll(newSelected.length === filteredItems.length);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleBulkAction = async (action) => {
        setBulkActionAnchor(null);
        setLoading(true);

        try {
            const result = await performBulkAction(action, selected, items, api);

            if (result.success) {
                setSnackbar({
                    open: true,
                    message: result.message,
                    severity: 'success',
                });
                setSelected([]);

                if (action !== 'export') {
                    await loadData();
                }
            }
        } catch (error) {
            console.error('Bulk action error:', error);
            setSnackbar({
                open: true,
                message: 'Error performing bulk action. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // DIALOG HANDLERS
    // ============================================

    const handleOpenDialog = (item = null) => {
        setEditingItem(item);
        setTabValue(0);
        setImagePreview(null);

        if (item) {
            setForm({
                ean_upc_code: item.ean_upc_code || '',
                item_code: item.item_code || '',
                item_name: item.item_name || '',
                short_name: item.short_name || '',
                brand: item.brand || '',
                supplier: item.supplier || '',
                cost_price: item.cost_price || '',
                landing_cost: item.landing_cost || '',
                sell_price: item.sell_price || '',
                mrp: item.mrp || '',
                store_pickup: item.store_pickup || false,
                sales_margin: item.sales_margin || '',
                tax_inclusive: item.tax_inclusive || false,
                allow_buy_back: item.allow_buy_back || false,
                allow_negative_stock: item.allow_negative_stock || false,
                base_uom: item.base_uom || '',
                purchase_uom: item.purchase_uom || '',
                sales_uom: item.sales_uom || '',
                category: item.category || '',
                tax_code: item.tax_code || '',
                hsn_code: item.hsn_code || '',
                tax_slab: item.tax_slab || '',
                material_type: item.material_type || 'finished',
                material_group: item.material_group || '',
                item_type: item.item_type || 'device',
                exchange_type: item.exchange_type || 'none',
                item_image: item.item_image || '',
                is_active: item.is_active !== false,
            });

            if (item.item_image) {
                setImagePreview(item.item_image);
            }
        } else {
            setForm({
                ean_upc_code: '',
                item_code: '',
                item_name: '',
                short_name: '',
                brand: '',
                supplier: '',
                cost_price: '',
                landing_cost: '',
                sell_price: '',
                mrp: '',
                store_pickup: false,
                sales_margin: '',
                tax_inclusive: false,
                allow_buy_back: false,
                allow_negative_stock: false,
                base_uom: '',
                purchase_uom: '',
                sales_uom: '',
                category: '',
                tax_code: '',
                hsn_code: '',
                tax_slab: '',
                material_type: 'finished',
                material_group: '',
                item_type: 'device',
                exchange_type: 'none',
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
        setImagePreview(null);
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

            const dataToSend = {
                ...form,
                cost_price: form.cost_price ? parseFloat(form.cost_price) : 0,
                landing_cost: form.landing_cost ? parseFloat(form.landing_cost) : 0,
                sell_price: form.sell_price ? parseFloat(form.sell_price) : 0,
                mrp: form.mrp ? parseFloat(form.mrp) : 0,
                sales_margin: form.sales_margin ? parseFloat(form.sales_margin) : 0,
            };

            if (editingItem) {
                await api.put(`/products/item-master/${editingItem.id}/`, dataToSend);
                setSnackbar({
                    open: true,
                    message: 'Item updated successfully!',
                    severity: 'success',
                });
            } else {
                await api.post('/products/item-master/', dataToSend);
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
                await api.delete(`/products/item-master/${id}/`);
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
        if (duplicatedItem.item_image) {
            setImagePreview(duplicatedItem.item_image);
        }
        setOpenDialog(true);
    };

    // ============================================
    // IMAGE UPLOAD
    // ============================================

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        handleImageUpload(
            file,
            (base64Image) => {
                setImagePreview(base64Image);
                setForm({ ...form, item_image: base64Image });
                setUploading(false);
                setSnackbar({
                    open: true,
                    message: 'Image uploaded successfully!',
                    severity: 'success'
                });
            },
            (error) => {
                setUploading(false);
                setSnackbar({
                    open: true,
                    message: error,
                    severity: 'error'
                });
            }
        );
    };

    // ============================================
    // BARCODE SCANNER
    // ============================================

    const searchByBarcode = (barcode) => {
        const found = items.find(item => item.item_code === barcode);
        if (found) {
            handleOpenDialog(found);
            setSnackbar({
                open: true,
                message: `Item found: ${found.item_name}`,
                severity: 'success'
            });
        } else {
            setSnackbar({
                open: true,
                message: `No item found with code: ${barcode}`,
                severity: 'warning'
            });
        }
    };

    // ============================================
    // DRAG AND DROP
    // ============================================

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = reorderItems(
            filteredItems,
            result.source.index,
            result.destination.index
        );

        setFilteredItems(reorderedItems);

        // Save to backend (optional - implement if backend supports sort_order)
        saveSortOrder(reorderedItems, api).then(response => {
            if (response.success) {
                setSnackbar({
                    open: true,
                    message: 'Order saved successfully!',
                    severity: 'success'
                });
            }
        }).catch(() => {
            // Silent fail - sort order not critical
        });
    };

    // ============================================
    // UTILITIES
    // ============================================

    const getItemImage = (item) => {
        if (item.item_image) {
            return item.item_image;
        }
        return `https://via.placeholder.com/80x80/1976d2/FFFFFF?text=${item.item_code?.[0] || 'I'}`;
    };

    const handleExportCSV = () => {
        const dataToExport = selected.length > 0
            ? items.filter(item => selected.includes(item.id))
            : filteredItems;
        exportToCSV(dataToExport, `items_export_${new Date().toISOString().split('T')[0]}.csv`);
        setSnackbar({
            open: true,
            message: `Exported ${dataToExport.length} items to CSV`,
            severity: 'success'
        });
    };

    const handleExportExcel = () => {
        const dataToExport = selected.length > 0
            ? items.filter(item => selected.includes(item.id))
            : filteredItems;
        exportToExcel(dataToExport, `items_export_${new Date().toISOString().split('T')[0]}.xlsx`);
        setSnackbar({
            open: true,
            message: `Exported ${dataToExport.length} items to Excel`,
            severity: 'success'
        });
    };

    // ============================================
    // RENDER
    // ============================================

    if (!isAuthenticated) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                    Authentication Required
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Please log in to access Item Master.
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
                title="Item Master"
                subtitle="Comprehensive item management with advanced features"
            />

            {/* Main Controls Bar */}
            <Card sx={{
                borderRadius: 0,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                mb: 2,
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                }
            }}>
                <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Search Bar */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by code, name, supplier..."
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

                        {/* Scanner Button */}
                        <Grid item xs={6} md={1}>
                            <Tooltip title="Barcode Scanner" arrow>
                                <IconButton
                                    color="primary"
                                    onClick={() => setOpenScanner(true)}
                                    sx={{
                                        bgcolor: 'primary.light',
                                        '&:hover': { bgcolor: 'primary.main', color: 'white' }
                                    }}
                                >
                                    <ScanIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        {/* Advanced Filters Toggle */}
                        <Grid item xs={6} md={2}>
                            <Button
                                fullWidth
                                size="small"
                                startIcon={<FilterIcon />}
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                variant={showAdvancedFilters ? 'contained' : 'outlined'}
                            >
                                Filters
                            </Button>
                        </Grid>

                        {/* View Toggle */}
                        <Grid item xs={6} md={2}>
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                                size="small"
                                fullWidth
                            >
                                <ToggleButton value="table" aria-label="table view">
                                    <ViewListIcon fontSize="small" />
                                </ToggleButton>
                                <ToggleButton value="grid" aria-label="grid view">
                                    <ViewModuleIcon fontSize="small" />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>

                        {/* Density Toggle */}
                        <Grid item xs={6} md={3}>
                            <ToggleButtonGroup
                                value={density}
                                exclusive
                                onChange={(e, newDensity) => newDensity && setDensity(newDensity)}
                                size="small"
                                fullWidth
                            >
                                <ToggleButton value="compact" aria-label="compact density">
                                    <DensitySmallIcon fontSize="small" />
                                </ToggleButton>
                                <ToggleButton value="comfortable" aria-label="comfortable density">
                                    <DensityMediumIcon fontSize="small" />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Advanced Filters Panel */}
            <Collapse in={showAdvancedFilters}>
                <Card sx={{ mb: 2, borderRadius: 0, bgcolor: 'grey.50' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        label="Status"
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value="active">Active Only</MenuItem>
                                        <MenuItem value="inactive">Inactive Only</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={filters.type}
                                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                        label="Type"
                                    >
                                        <MenuItem value="all">All Types</MenuItem>
                                        <MenuItem value="merchandise">Merchandise</MenuItem>
                                        <MenuItem value="non_merchandise">Non-Merchandise</MenuItem>
                                        <MenuItem value="non_physical">Non-Physical</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="From Date"
                                        value={filters.dateFrom}
                                        onChange={(newValue) => setFilters({ ...filters, dateFrom: newValue })}
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="To Date"
                                        value={filters.dateTo}
                                        onChange={(newValue) => setFilters({ ...filters, dateTo: newValue })}
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    size="small"
                                    onClick={() => setFilters({
                                        status: 'all',
                                        type: 'all',
                                        dateFrom: null,
                                        dateTo: null,
                                        supplier: ''
                                    })}
                                >
                                    Clear All Filters
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Collapse>

            {/* Main Content Card */}
            <Card sx={{
                borderRadius: 0,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <CardHeader title={`Items (${filteredItems.length})`}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {selected.length > 0 && (
                            <Chip
                                label={`${selected.length} selected`}
                                onDelete={() => setSelected([])}
                                color="primary"
                                size="small"
                            />
                        )}

                        {selected.length > 0 && (
                            <IconButton
                                size="small"
                                onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                                color="primary"
                            >
                                <Badge badgeContent={selected.length} color="error">
                                    <MoreIcon />
                                </Badge>
                            </IconButton>
                        )}

                        <Button
                            startIcon={<DownloadIcon />}
                            onClick={handleExportCSV}
                            size="small"
                            variant="outlined"
                        >
                            CSV
                        </Button>

                        <Button
                            startIcon={<DownloadIcon />}
                            onClick={handleExportExcel}
                            size="small"
                            variant="outlined"
                        >
                            Excel
                        </Button>

                        <ActionButton onClick={() => handleOpenDialog()} startIcon={<AddIcon />}>
                            Add New
                        </ActionButton>
                    </Stack>
                </CardHeader>

                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ p: 3 }}>
                            {[...Array(5)].map((_, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Skeleton variant="rectangular" height={density === 'compact' ? 50 : 70} sx={{ borderRadius: 1 }} />
                                </Box>
                            ))}
                        </Box>
                    ) : viewMode === 'table' ? (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="items-list">
                                {(provided) => (
                                    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                                        <Table size={density === 'compact' ? 'small' : 'medium'}>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            indeterminate={selected.length > 0 && selected.length < filteredItems.length}
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Drag</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Item Code</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                                                {filteredItems.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                                        {(provided, snapshot) => (
                                                            <TableRow
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                sx={{
                                                                    bgcolor: snapshot.isDragging ? 'action.hover' : 'inherit',
                                                                    '&:hover': {
                                                                        bgcolor: 'grey.50',
                                                                        transform: snapshot.isDragging ? 'none' : 'translateX(4px)',
                                                                        transition: 'all 0.2s ease'
                                                                    },
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        checked={isSelected(item.id)}
                                                                        onChange={() => handleSelectOne(item.id)}
                                                                    />
                                                                </TableCell>
                                                                <TableCell {...provided.dragHandleProps}>
                                                                    <DragIcon color="action" />
                                                                </TableCell>
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
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : (
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
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                                            <Checkbox
                                                                checked={isSelected(item.id)}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectOne(item.id);
                                                                }}
                                                                size="small"
                                                            />
                                                            <Typography variant="subtitle2" fontWeight="bold" flex={1}>
                                                                {item.item_code}
                                                            </Typography>
                                                        </Stack>
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

            {/* Bulk Action Menu */}
            <Menu
                anchorEl={bulkActionAnchor}
                open={Boolean(bulkActionAnchor)}
                onClose={() => setBulkActionAnchor(null)}
            >
                <MenuItem onClick={() => handleBulkAction('activate')}>
                    <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} /> Activate Selected
                </MenuItem>
                <MenuItem onClick={() => handleBulkAction('deactivate')}>
                    <CancelIcon sx={{ mr: 1, color: 'warning.main' }} /> Deactivate Selected
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleBulkAction('export')}>
                    <DownloadIcon sx={{ mr: 1, color: 'info.main' }} /> Export Selected
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleBulkAction('delete')}>
                    <DeleteIcon sx={{ mr: 1, color: 'error.main' }} /> Delete Selected
                </MenuItem>
            </Menu>

            {/* Floating Bulk Action Bar */}
            {selected.length > 0 && (
                <Fade in>
                    <Box sx={{
                        position: 'fixed',
                        bottom: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1300,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 3,
                        py: 2,
                        borderRadius: 2,
                        boxShadow: 6,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center'
                    }}>
                        <Typography fontWeight="bold">
                            {selected.length} item{selected.length > 1 ? 's' : ''} selected
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleBulkAction('activate')}
                        >
                            Activate
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleBulkAction('export')}
                        >
                            Export
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleBulkAction('delete')}
                        >
                            Delete
                        </Button>
                        <IconButton
                            size="small"
                            onClick={() => setSelected([])}
                            sx={{ color: 'white' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Fade>
            )}

            {/* Add/Edit Dialog - Comprehensive Form */}
            <ItemMasterFormDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSave={handleSave}
                form={form}
                onChange={handleInputChange}
                editingItem={editingItem}
                uoms={uoms}
                categories={categories}
                attributes={attributes}
                attributeValues={attributeValues}
                themeColor={themeColor}
            />

            {/* Barcode Scanner Dialog */}
            <Dialog open={openScanner} onClose={() => setOpenScanner(false)} maxWidth="sm" fullWidth>
                <DialogHeader title="Scan Barcode" icon={<ScanIcon />} />
                <DialogContent>
                    <Typography gutterBottom>
                        Point your barcode scanner at the screen or enter code manually
                    </Typography>
                    <TextField
                        fullWidth
                        label="Scanned Barcode"
                        value={scannedCode}
                        onChange={(e) => setScannedCode(e.target.value)}
                        sx={{ mt: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => searchByBarcode(scannedCode)}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenScanner(false)}>Close</Button>
                    <Button variant="contained" onClick={() => searchByBarcode(scannedCode)}>
                        Search
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

export default ItemMasterPage;

