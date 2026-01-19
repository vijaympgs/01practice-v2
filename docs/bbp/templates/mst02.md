## 🎯 **Overview**

MST_TEMPLATE_02 provides a comprehensive template for medium-complexity master data management screens. It includes advanced filtering, dual layout modes, bulk operations, and full CRUD functionality with validation.

---

## ✨ **Features Checklist**

### **Core Features**
- [x] **Advanced Filtering** - Multiple filter criteria with search
- [x] **Dual Layout Modes** - Table view + Card view with density toggle
- [x] **CRUD Operations** - Create, Read, Update, Delete with validation
- [x] **Bulk Actions** - Multi-select with batch operations
- [x] **Import/Export** - CSV/Excel import and export functionality
- [x] **Pagination** - Server-side and client-side pagination
- [x] **Sorting** - Multi-column sorting with persistence
- [x] **Status Management** - Active/Inactive status with workflow

### **UI/UX Features**
- [x] **Responsive Design** - Mobile, tablet, desktop optimized
- [x] **Skeleton Loaders** - Loading states with smooth transitions
- [x] **Empty States** - Helpful messages when no data
- [x] **Error Handling** - User-friendly error messages
- [x] **Accessibility** - WCAG 2.1 AA compliance
- [x] **Keyboard Navigation** - Full keyboard support

---

## 🏗️ **Component Structure**

```
YourMaster/
├── YourMaster.jsx          # Main component
├── YourMasterForm.jsx      # Create/Edit form
├── YourMasterCard.jsx      # Card view component
├── YourMasterTable.jsx     # Table view component
├── YourMasterFilters.jsx   # Advanced filters
├── YourMasterList.jsx      # List container
├── mockData.js            # Mock data for development
└── YOUR_MASTER_DOCUMENTATION.md
```

---

## 📱 **File Organization & Naming**

### **Naming Convention**
```javascript
// Component Files
YourMaster.jsx              // Main component (PascalCase)
YourMasterForm.jsx          // Form component
YourMasterCard.jsx          // Card component
YourMasterTable.jsx         // Table component

// Data Files
yourMasterMockData.js       // Mock data (camelCase)
useYourMaster.js            // Custom hooks (camelCase)

// Styles
YourMaster.module.css       // Component styles (if using CSS modules)
```

### **Export Structure**
```javascript
// YourMaster/index.js
export { default as YourMaster } from './YourMaster';
export { default as YourMasterForm } from './YourMasterForm';
export { default as YourMasterCard } from './YourMasterCard';
export { default as YourMasterTable } from './YourMasterTable';
```

---

## 🔄 **State Management Pattern**

### **Main Component State**
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedItems, setSelectedItems] = useState([]);
const [filters, setFilters] = useState({
  search: '',
  status: 'all',
  category: 'all',
  dateRange: null
});
const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'
const [density, setDensity] = useState('comfortable'); // 'compact' | 'comfortable'
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0
});
const [sortBy, setSortBy] = useState({ field: 'name', direction: 'asc' });
```

### **Form State Pattern**
```javascript
const [formData, setFormData] = useState({
  id: null,
  name: '',
  code: '',
  description: '',
  status: 'active',
  // ... other fields
});

const [formErrors, setFormErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

---

## 🔌 **API Integration Points**

### **Data Fetching**
```javascript
// API Endpoints
const API_ENDPOINTS = {
  FETCH_ALL: '/api/your-masters',
  FETCH_BY_ID: '/api/your-masters/:id',
  CREATE: '/api/your-masters',
  UPDATE: '/api/your-masters/:id',
  DELETE: '/api/your-masters/:id',
  BULK_DELETE: '/api/your-masters/bulk-delete',
  IMPORT: '/api/your-masters/import',
  EXPORT: '/api/your-masters/export'
};

// Example API Call
const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch(API_ENDPOINTS.FETCH_ALL);
    const result = await response.json();
    setData(result.data);
    setPagination(prev => ({ ...prev, total: result.total }));
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### **Error Handling Pattern**
```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    setError(error.response.data.message || 'Server error occurred');
  } else if (error.request) {
    // Network error
    setError('Network error. Please check your connection.');
  } else {
    // Other error
    setError('An unexpected error occurred.');
  }
};
```

---

## 🎨 **UI/UX Guidelines**

### **Design Tokens Usage**
```javascript
import { colors, spacing, typography } from '../tokens/designTokens';

// Consistent styling
const containerStyle = {
  backgroundColor: colors.surface.background,
  padding: spacing.md,
  borderRadius: spacing.sm,
};
```

### **Responsive Breakpoints**
```javascript
const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
};
```

### **Loading States**
```javascript
// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);
```

---

## 📋 **Code Examples**

### **Main Component Structure**
```javascript
import React, { useState, useEffect, useCallback } from 'react';
import { colors, spacing, typography } from '../tokens/designTokens';
import Button from '../Button';
import Input from '../Input';
import Table from '../Table';

const YourMaster = () => {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  // Callbacks
  const handleCreate = useCallback(() => {
    // Handle create action
  }, []);

  const handleEdit = useCallback((item) => {
    // Handle edit action
  }, []);

  const handleDelete = useCallback((id) => {
    // Handle delete action
  }, []);

  // Render
  return (
    <div className="min-h-screen bg-neutralBg-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Your Master</h1>
      </div>

      {/* Filters */}
      <YourMasterFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Data Display */}
      {viewMode === 'table' ? (
        <YourMasterTable 
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <YourMasterCard 
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default YourMaster;
```

### **Form Component Pattern**
```javascript
const YourMasterForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.code?.trim()) {
      newErrors.code = 'Code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Name *
        </label>
        <Input
          value={formData.name || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          disabled={isSubmitting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
        >
          {formData.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```javascript
// YourMaster.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourMaster from './YourMaster';

describe('YourMaster', () => {
  test('renders master list', () => {
    render(<YourMaster />);
    expect(screen.getByText('Your Master')).toBeInTheDocument();
  });

  test('handles create action', async () => {
    const mockOnCreate = jest.fn();
    render(<YourMaster onCreate={mockOnCreate} />);
    
    fireEvent.click(screen.getByText('Add New'));
    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalled();
    });
  });
});
```

### **Integration Tests**
```javascript
// Test API integration
describe('YourMaster API Integration', () => {
  test('fetches data on mount', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData, total: 1 })
    });

    render(<YourMaster />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });
});
```

---

## 🔧 **Customization Guide**

### **Adding New Fields**
1. Update the data model in `mockData.js`
2. Add form fields to `YourMasterForm.jsx`
3. Update table columns in `YourMasterTable.jsx`
4. Add validation rules as needed

### **Modifying Filters**
1. Update filter state in main component
2. Add new filter controls to `YourMasterFilters.jsx`
3. Implement filter logic in data fetching

### **Changing Layout**
1. Modify grid classes in main component
2. Update responsive breakpoints
3. Adjust card/table layouts as needed

---

## 📊 **Performance Considerations**

### **Optimization Techniques**
- **Memoization**: Use `React.memo` for expensive components
- **Debouncing**: Debounce search inputs
- **Virtual Scrolling**: For large datasets
- **Lazy Loading**: Load data on demand
- **Code Splitting**: Split components by route

### **Example Optimization**
```javascript
import React, { memo, useMemo, useCallback } from 'react';

const YourMasterCard = memo(({ item, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => {
    onEdit(item.id);
  }, [item.id, onEdit]);

  const formattedData = useMemo(() => {
    return {
      ...item,
      formattedDate: new Date(item.createdAt).toLocaleDateString()
    };
  }, [item]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
      {/* Card content */}
    </div>
  );
});
```

---

## 🚀 **Quick Start Implementation**

### **Step 1: Copy Structure**
```bash
cp -r templates/MST_TEMPLATE_02 YourMaster
```

### **Step 2: Rename Files**
```bash
# Rename all files following the naming convention
mv ProductMaster.jsx YourMaster.jsx
mv ProductMasterForm.jsx YourMasterForm.jsx
# ... etc
```

### **Step 3: Update Content**
1. Replace "Product" with your entity name
2. Update data model and fields
3. Customize validation rules
4. Adjust API endpoints
5. Update business logic

### **Step 4: Test Integration**
1. Import and use in your main app
2. Test all CRUD operations
3. Verify responsive design
4. Check accessibility compliance

---

## 📚 **Related Documentation**

- **Design Tokens**: `../tokens/designTokens.js`
- **Component Library**: `COMPONENT_LIBRARY.md`
- **State Patterns**: `STATE_PATTERNS.md`
- **Product Master Implementation**: `../ProductMaster/PRODUCT_MASTER_DOCUMENTATION.md`

# MST_TEMPLATE_03 - Complex Master Template

**Based on Complex Master Components**
**Complexity Level**: Complex
**Use Cases**: Bill of Materials (BOM), Price Lists, Warehouse Management, Complex Configurations

---