import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Tabs,
    Tab,
    Box,
    Button,
    Typography,
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Inventory as InventoryIcon,
} from '@mui/icons-material';
import DialogHeader from '../common/DialogHeader';

const ItemMasterFormDialog = ({
    open,
    onClose,
    onSave,
    form,
    onChange,
    editingItem,
    uoms = [],
    categories = [],
    attributes = [],
    attributeValues = {},
    themeColor = '#1976d2',
}) => {
    const [tabValue, setTabValue] = React.useState(0);

    const materialTypeOptions = [
        { value: 'raw', label: 'Raw Material' },
        { value: 'finished', label: 'Finished Good' },
        { value: 'semi', label: 'Semi-Finished' },
        { value: 'consumable', label: 'Consumable' },
        { value: 'service', label: 'Service' },
    ];

    const itemTypeOptions = [
        { value: 'spare', label: 'Spare' },
        { value: 'device', label: 'Device' },
        { value: 'ew', label: 'EW' },
        { value: 'accessory', label: 'Accessory' },
    ];

    const exchangeTypeOptions = [
        { value: 'none', label: 'None' },
        { value: 'allowed', label: 'Allowed' },
        { value: 'exchange_only', label: 'Exchange Only' },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogHeader
                title={`${editingItem ? 'Edit' : 'Add'} Item`}
                icon={<InventoryIcon />}
            />

            <DialogContent sx={{ p: 1, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                {/* Tabs */}
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="General" />
                    <Tab label="Pricing & Tax" />
                    <Tab label="Preferences" />
                    <Tab label="Attributes" />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ p: 1 }}>
                    {/* General Tab */}
                    {tabValue === 0 && (
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                                <TextField
                                    fullWidth
                                    label="EAN/UPC Code"
                                    value={form.ean_upc_code || ''}
                                    onChange={onChange('ean_upc_code')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Item Code"
                                    value={form.item_code || ''}
                                    onChange={onChange('item_code')}
                                    required
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Item Name"
                                    value={form.item_name || ''}
                                    onChange={onChange('item_name')}
                                    required
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Short Name"
                                    value={form.short_name || ''}
                                    onChange={onChange('short_name')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Brand"
                                    value={form.brand || ''}
                                    onChange={onChange('brand')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Supplier"
                                    value={form.supplier || ''}
                                    onChange={onChange('supplier')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>

                            {/* UOM Fields */}
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: themeColor }}>Base/Stock UOM</InputLabel>
                                    <Select
                                        value={form.base_uom || ''}
                                        onChange={onChange('base_uom')}
                                        label="Base/Stock UOM"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                    >
                                        {uoms.map((uom) => (
                                            <MenuItem key={uom.id} value={uom.id}>
                                                {uom.code} - {uom.description}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: themeColor }}>Purchase UOM</InputLabel>
                                    <Select
                                        value={form.purchase_uom || ''}
                                        onChange={onChange('purchase_uom')}
                                        label="Purchase UOM"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                    >
                                        {uoms.map((uom) => (
                                            <MenuItem key={uom.id} value={uom.id}>
                                                {uom.code} - {uom.description}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: themeColor }}>Sales UOM</InputLabel>
                                    <Select
                                        value={form.sales_uom || ''}
                                        onChange={onChange('sales_uom')}
                                        label="Sales UOM"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                    >
                                        {uoms.map((uom) => (
                                            <MenuItem key={uom.id} value={uom.id}>
                                                {uom.code} - {uom.description}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Category */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: themeColor }}>Category</InputLabel>
                                    <Select
                                        value={form.category || ''}
                                        onChange={onChange('category')}
                                        label="Category"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Item Type, Exchange Type, Material Type */}
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: themeColor }}>Item Type</InputLabel>
                                    <Select
                                        value={form.item_type || 'device'}
                                        onChange={onChange('item_type')}
                                        label="Item Type"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                    >
                                        {itemTypeOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: themeColor }}>Exchange Type</InputLabel>
                                    <Select
                                        value={form.exchange_type || 'none'}
                                        onChange={onChange('exchange_type')}
                                        label="Exchange Type"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                    >
                                        {exchangeTypeOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: themeColor }}>Material Type</InputLabel>
                                    <Select
                                        value={form.material_type || 'finished'}
                                        onChange={onChange('material_type')}
                                        label="Material Type"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                    >
                                        {materialTypeOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}

                    {/* Pricing & Tax Tab */}
                    {tabValue === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Cost Price"
                                    type="number"
                                    value={form.cost_price || ''}
                                    onChange={onChange('cost_price')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Landing Cost"
                                    type="number"
                                    value={form.landing_cost || ''}
                                    onChange={onChange('landing_cost')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Sell Price"
                                    type="number"
                                    value={form.sell_price || ''}
                                    onChange={onChange('sell_price')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="MRP (Maximum Retail Price)"
                                    type="number"
                                    value={form.mrp || ''}
                                    onChange={onChange('mrp')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Sales Margin %"
                                    type="number"
                                    value={form.sales_margin || ''}
                                    onChange={onChange('sales_margin')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>

                            {/* Local Tax Fields */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Tax Code (GST)"
                                    value={form.tax_code || ''}
                                    onChange={onChange('tax_code')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="HSN Code"
                                    value={form.hsn_code || ''}
                                    onChange={onChange('hsn_code')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Tax Slab %"
                                    type="number"
                                    value={form.tax_slab || ''}
                                    onChange={onChange('tax_slab')}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: themeColor } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.tax_inclusive || false}
                                            onChange={onChange('tax_inclusive')}
                                            color="primary"
                                        />
                                    }
                                    label="Tax Inclusive"
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* Preferences Tab */}
                    {tabValue === 2 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.allow_buy_back || false}
                                            onChange={onChange('allow_buy_back')}
                                            color="primary"
                                        />
                                    }
                                    label="Allow Buy Back"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.allow_negative_stock || false}
                                            onChange={onChange('allow_negative_stock')}
                                            color="primary"
                                        />
                                    }
                                    label="Allow Negative Stock"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.store_pickup || false}
                                            onChange={onChange('store_pickup')}
                                            color="primary"
                                        />
                                    }
                                    label="Store Pickup Available"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.is_active !== false}
                                            onChange={onChange('is_active')}
                                            color="primary"
                                        />
                                    }
                                    label="Active"
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* Attributes Tab */}
                    {tabValue === 3 && (
                        <Grid container spacing={3}>
                            {/* Dynamic Attributes */}
                            {attributes.length === 0 ? (
                                <Grid item xs={12}>
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No attributes configured. Please configure attributes in Attributes Management.
                                        </Typography>
                                    </Box>
                                </Grid>
                            ) : (
                                attributes.map((attr) => (
                                    <Grid item xs={12} sm={6} key={attr.id}>
                                        <FormControl fullWidth>
                                            <InputLabel sx={{ color: themeColor }}>{attr.caption}</InputLabel>
                                            <Select
                                                value={form[`attribute_${attr.id}`] || ''}
                                                onChange={(e) => {
                                                    if (onChange) {
                                                        onChange(`attribute_${attr.id}`)({ target: { value: e.target.value } });
                                                    }
                                                }}
                                                label={attr.caption}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                            >
                                                {(attributeValues[attr.id] || []).map((val) => (
                                                    <MenuItem key={val.id} value={val.id}>
                                                        {val.value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    startIcon={<CancelIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {editingItem ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ItemMasterFormDialog;
