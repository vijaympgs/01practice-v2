// This is a comprehensive enhancement plan - creating full implementation would be very large
// I'll create a modular approach with helper utilities

/**
 * Ultra Premium Item Master - Enhancement Utilities
 * 
 * Features:
 * 1. Bulk Actions (multi-select)
 * 2. Advanced Filters (category, date range)
 * 3. Export to CSV/Excel
 * 4. Image File Upload
 * 5. Barcode Scanning
 * 6. Drag-and-Drop Reordering
 */

// ============================================
// 1. CSV/Excel Export Utility
// ============================================

export const exportToCSV = (data, filename = 'items_export.csv') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Define headers
    const headers = ['Item Code', 'Item Name', 'Supplier', 'Manufacturer', 'Status', 'Type'];

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(item => [
            item.item_code || '',
            `"${item.item_name || ''}"`, // Wrap in quotes to handle commas
            item.supplier || '',
            item.manufacturer || '',
            item.is_active ? 'Active' : 'Inactive',
            item.item_type || ''
        ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToExcel = async (data, filename = 'items_export.xlsx') => {
    // For Excel export, we'll use a library approach
    // Install: npm install xlsx

    try {
        const XLSX = await import('xlsx');

        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Item Code', 'Item Name', 'Supplier', 'Manufacturer', 'Status', 'Type', 'Division', 'Department'],
            ...data.map(item => [
                item.item_code,
                item.item_name,
                item.supplier || '',
                item.manufacturer || '',
                item.is_active ? 'Active' : 'Inactive',
                item.item_type || '',
                item.division || '',
                item.department || ''
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Items');
        XLSX.writeFile(wb, filename);
    } catch (error) {
        console.error('Excel export error:', error);
        // Fallback to CSV
        exportToCSV(data, filename.replace('.xlsx', '.csv'));
    }
};

// ============================================
// 2. Image Upload Utility
// ============================================

export const handleImageUpload = (file, onSuccess, onError) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        onError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        onError('File size must be less than 5MB');
        return;
    }

    // Create FileReader to convert to base64 or upload to server
    const reader = new FileReader();

    reader.onload = (e) => {
        const base64Image = e.target.result;
        onSuccess(base64Image);
    };

    reader.onerror = () => {
        onError('Error reading file');
    };

    reader.readAsDataURL(file);
};

// Upload to server (alternative to base64)
export const uploadImageToServer = async (file, api) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await api.post('/upload/item-image/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.image_url;
    } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload image');
    }
};

// ============================================
// 3. Barcode Scanner Utility
// ============================================

export const initBarcodeScanner = (onScan, onError) => {
    let barcode = '';
    let lastKeyTime = Date.now();

    const handleKeyPress = (e) => {
        const currentTime = Date.now();

        // If more than 100ms between keys, reset (not a scanner)
        if (currentTime - lastKeyTime > 100) {
            barcode = '';
        }

        lastKeyTime = currentTime;

        // Enter key signals end of barcode scan
        if (e.key === 'Enter') {
            if (barcode.length > 0) {
                onScan(barcode);
                barcode = '';
            }
        } else if (e.key.length === 1) {
            // Add character to barcode
            barcode += e.key;
        }
    };

    // Add event listener
    window.addEventListener('keypress', handleKeyPress);

    // Return cleanup function
    return () => {
        window.removeEventListener('keypress', handleKeyPress);
    };
};

// Camera-based barcode scanner (using QuaggaJS or similar)
export const startCameraScanner = async (videoElement, onDetected) => {
    try {
        const Quagga = await import('quagga');

        Quagga.init({
            inputStream: {
                type: 'LiveStream',
                target: videoElement,
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: 'environment'
                }
            },
            decoder: {
                readers: ['ean_reader', 'code_128_reader', 'code_39_reader']
            }
        }, (err) => {
            if (err) {
                console.error('Barcode scanner init error:', err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected((data) => {
            if (data && data.codeResult) {
                onDetected(data.codeResult.code);
            }
        });

        return () => Quagga.stop();
    } catch (error) {
        console.error('Camera scanner error:', error);
    }
};

// ============================================
// 4. Bulk Actions Utility
// ============================================

export const performBulkAction = async (action, selectedIds, items, api) => {
    switch (action) {
        case 'delete':
            // Bulk delete
            const deletePromises = selectedIds.map(id =>
                api.delete(`/products/advanced-item-master/${id}/`)
            );
            await Promise.all(deletePromises);
            return { success: true, message: `${selectedIds.length} items deleted` };

        case 'activate':
            // Bulk activate
            const activatePromises = selectedIds.map(id => {
                const item = items.find(i => i.id === id);
                return api.put(`/products/advanced-item-master/${id}/`, { ...item, is_active: true });
            });
            await Promise.all(activatePromises);
            return { success: true, message: `${selectedIds.length} items activated` };

        case 'deactivate':
            // Bulk deactivate
            const deactivatePromises = selectedIds.map(id => {
                const item = items.find(i => i.id === id);
                return api.put(`/products/advanced-item-master/${id}/`, { ...item, is_active: false });
            });
            await Promise.all(deactivatePromises);
            return { success: true, message: `${selectedIds.length} items deactivated` };

        case 'export':
            // Export selected items
            const selectedItems = items.filter(item => selectedIds.includes(item.id));
            exportToCSV(selectedItems, 'selected_items.csv');
            return { success: true, message: `${selectedIds.length} items exported` };

        default:
            return { success: false, message: 'Unknown action' };
    }
};

// ============================================
// 5. Advanced Filters Utility
// ============================================

export const applyAdvancedFilters = (items, filters) => {
    return items.filter(item => {
        // Category filter
        if (filters.category && item.category !== filters.category) {
            return false;
        }

        // Status filter
        if (filters.status !== 'all') {
            if (filters.status === 'active' && !item.is_active) return false;
            if (filters.status === 'inactive' && item.is_active) return false;
        }

        // Type filter
        if (filters.type && filters.type !== 'all' && item.item_type !== filters.type) {
            return false;
        }

        // Date range filter (created_at)
        if (filters.dateFrom) {
            const itemDate = new Date(item.created_at);
            const fromDate = new Date(filters.dateFrom);
            if (itemDate < fromDate) return false;
        }

        if (filters.dateTo) {
            const itemDate = new Date(item.created_at);
            const toDate = new Date(filters.dateTo);
            if (itemDate > toDate) return false;
        }

        // Supplier filter
        if (filters.supplier && !item.supplier?.toLowerCase().includes(filters.supplier.toLowerCase())) {
            return false;
        }

        return true;
    });
};

// ============================================
// 6. Drag and Drop Reordering Utility
// ============================================

export const reorderItems = (items, startIndex, endIndex) => {
    const result = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Update sort_order for all items
    return result.map((item, index) => ({
        ...item,
        sort_order: index + 1
    }));
};

export const saveSortOrder = async (items, api) => {
    try {
        const updatePromises = items.map(item =>
            api.put(`/products/advanced-item-master/${item.id}/`, {
                ...item,
                sort_order: item.sort_order
            })
        );
        await Promise.all(updatePromises);
        return { success: true };
    } catch (error) {
        console.error('Error saving sort order:', error);
        return { success: false, error };
    }
};

// ============================================
// Helper: Generate Sample Data for Testing
// ============================================

export const generateSampleItems = (count = 10) => {
    const types = ['merchandise', 'non_merchandise', 'non_physical'];
    const suppliers = ['Supplier A', 'Supplier B', 'Supplier C'];
    const manufacturers = ['Manufacturer X', 'Manufacturer Y', 'Manufacturer Z'];

    return Array.from({ length: count }, (_, i) => ({
        id: `item-${i + 1}`,
        item_code: `ITM${String(i + 1).padStart(4, '0')}`,
        item_name: `Sample Item ${i + 1}`,
        short_name: `Item ${i + 1}`,
        supplier: suppliers[i % suppliers.length],
        manufacturer: manufacturers[i % manufacturers.length],
        item_type: types[i % types.length],
        is_active: Math.random() > 0.3,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        sort_order: i + 1
    }));
};
