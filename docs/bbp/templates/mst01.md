# MST_TEMPLATE_01 - Simple Master Template

**Based on Simple Master Components**
**Complexity Level**: Simple
**Use Cases**: Product Categories, UOM, Tax Codes, Simple Lookups

---

## 🎯 **Overview**

MST_TEMPLATE_01 provides a streamlined template for simple master data management screens. It includes basic CRUD operations, simple filtering, and essential UI components while maintaining consistency with the design system.

---

## ✨ **Features Checklist**

### **Core Features**
- [x] **Basic CRUD Operations** - Create, Read, Update, Delete with validation
- [x] **Simple Filtering** - Text search and basic filter options
- **Single Layout Mode** - Table view with basic sorting
- [x] **Status Management** - Active/Inactive status toggle
- [x] **Basic Validation** - Required field validation
- [x] **Responsive Design** - Mobile, tablet, desktop optimized
- [x] **Error Handling** - User-friendly error messages
- [x] **Accessibility** - WCAG 2.1 AA compliance
- **Keyboard Navigation** - Full keyboard support

### **Simplified Features**
- [x] **No Bulk Operations** - Single item operations only
- [x] **No Import/Export** - Basic CRUD only
- [x] **No Dual Layout** - Table view only
- [x] **No Advanced Filtering** - Basic search and status filter
- [x] **No Pagination** - Client-side only
- [x] **No Complex Validation** - Basic required field validation

---

## 🏗️ **Component Structure**

```
YourSimpleMaster/
├── YourSimpleMaster.jsx          # Main component
├── YourSimpleMasterForm.jsx      # Create/Edit form
├── YourSimpleMasterTable.jsx     # Table view component
├── YourSimpleMasterFilters.jsx   # Basic filters
├── mockData.js                # Mock data for development
└── YOUR_SIMPLE_MASTER_DOCUMENTATION.md
```

---

## 📱 **File Organization & Naming**

### **Naming Convention**
```javascript
// Component Files
YourSimpleMaster.jsx           // Main component (PascalCase)
YourSimpleMasterForm.jsx          // Form component
YourSimpleMasterTable.jsx         // Table component

// Data Files
yourSimpleMasterMockData.js       // Mock data (camelCase)
useYourSimpleMaster.js          // Custom hooks (camelCase)

// Styles
YourSimpleMaster.module.css       # Component styles (if using CSS modules)
```

### **Export Structure**
```javascript
// YourSimpleMaster/index.js
export { default as YourSimpleMaster } from './YourSimpleMaster';
export { default as YourSimpleMasterForm } from './YourSimpleMasterForm';
export { default as YourSimpleMasterTable } from './YourSimpleMasterTable';
```

---

## 🔄 **State Management Pattern**

### **Main Component State**
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);
const [showForm, setShowForm] = useState(false);
const [filters, setFilters] = useState({
  search: '',
  status: 'all',
  category: 'all',
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
  // ... other simple fields
});

const [formErrors, setFormErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

---

## 🔌 **API Integration Points**

### **Simple API Endpoints**
```javascript
const API_ENDPOINTS = {
  FETCH_ALL: '/api/your-simple-masters',
  FETCH_BY_ID: '/api/your-simple-masters/:id',
  CREATE: '/api/your-simple-masters',
  UPDATE: '/api/your-simple-masters/:id',
  DELETE: '/api/your-simple-masters/:id',
};
```

### **Data Fetching Pattern**
```javascript
const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch(API_ENDPOINTS.FETCH_ALL);
    const result = await response.json();
    setData(result.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 **UI/UX Guidelines**

### **Simple Layout Structure**
```javascript
return (
  <div className="min-h-screen bg-neutralBg-50 p-6">
    {/* Header */}
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
      <h1 className="text-2xl font-bold text-surface-900">Your Simple Master</h1>
      <Button onClick={() => setShowForm(true)}>
        Add New
      </Button>
    </div>

    {/* Filters */}
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
      <YourSimpleMasterFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>

    {/* Data Table */}
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
      <YourSimpleMasterTable 
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
      />
    </div>

    {/* Form Modal */}
    {showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <YourSimpleMasterForm
            initialData={selectedItem}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    )}
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

const YourSimpleMaster = () => {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  // Callbacks
  const handleCreate = useCallback(() => {
    setSelectedItem({});
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setSelectedItem(item);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    setLoading(true);
    try {
      await fetch(API_ENDPOINTS.DELETE.replace(':id', id));
      setData(prev => prev => prev.filter(item => item.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      if (formData.id) {
        // Update existing item
        await fetch(API_ENDPOINTS.UPDATE.replace(':id', formData.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new item
        const response = await fetch(API_ENDPOINTS.CREATE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const newItem = await response.json();
        setData(prev => [...prev, newItem]);
      }
      
      setShowForm(false);
      setSelectedItem(null);
    } catch (error) {
      setFormErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filters
  const filteredData = data.filter(item => {
    const matchesSearch = !filters.search || 
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.code.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy.field];
    const bValue = b[sortBy.field];
    
    if (sortBy.direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  return (
    <div className="min-h-screen bg-neutralBg-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Your Simple Master</h1>
        <div className="flex justify-between items-center">
          <Button onClick={handleCreate}>
            Add New
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value })}
            className="px-3 py-2 border border-surface-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value })}
            className="px-3 py-2 border border-surface-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-transparent border-solid border-gray-300"></div>
          </div>
        ) : (
          <Table
            columns={[
              { header: 'Code', accessor: 'code' },
              { header: 'Name', accessor: 'name' },
              { header: 'Status', accessor: 'status' },
              {
                header: 'Actions',
                cell: (row) => (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )
              }
            ]}
            data={sortedData}
            empty={sortedData.length === 0}
            emptyMessage="No data found. Try adjusting your filters."
          />
        </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">
              {selectedItem?.id ? 'Edit Item' : 'Add New Item'}
            </h2>
            
            <YourSimpleMasterForm
              initialData={selectedItem}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-8v6a8 8 0 100-8H2a8 8 0 100-8v6a8 8 0 100-8H2a8 8 0 100-8v6a8 8 0 100-8z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourSimpleMaster;
```

### **Simple Form Component**
```javascript
import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import Input from '../Input';

const YourSimpleMasterForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    code: '',
    description: '',
    status: 'active',
  });

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
      onCancel();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Name *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value })}
          error={errors.name}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Code *
        </label>
        <Input
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value })}
          error={errors.code}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-surface-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value })}
          className="w-full px-3 py-2 border border-surface-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          disabled={isSubmitting}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
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
          disabled={Object.keys(errors).length > 0}
        >
          {formData.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default YourSimpleMasterForm;
```

### **Simple Table Component**
```javascript
import React from 'react';
import Button from '../Button';
import Table from '../Table';

const YourSimpleMasterTable = ({ 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  onSort,
  empty = false,
  emptyMessage = 'No data available'
}) => {
  const columns = [
    { header: 'Code', accessor: 'code' },
    { header: 'Name', accessor: 'name' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.status === 'active' 
            ? 'bg-success-100 text-success-800' 
            : 'bg-surface-100 text-surface-600'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={() => onDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      empty={empty}
      emptyMessage={emptyMessage}
      onSort={onSort}
    />
  );
};

export default YourSimpleMasterTable;
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```javascript
// YourSimpleMaster.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourSimpleMaster from './YourSimpleMaster';

describe('YourSimpleMaster', () => {
  test('renders master list', () => {
    render(<YourSimpleMaster />);
    expect(screen.getByText('Your Simple Master')).toBeInTheDocument();
  });

  test('handles create action', async () => {
    const mockOnCreate = jest.fn();
    render(<YourSimpleMaster onCreate={mockOnCreate} />);
    
    fireEvent.click(screen.getByText('Add New'));
    
    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: null,
          name: '',
          code: '',
          description: '',
          status: 'active',
        })
      );
    });
  });

  test('handles edit action', async () => {
    const mockItem = { id: 1, name: 'Test Item', code: 'TEST001', status: 'active' };
    const mockOnEdit = jest.fn();
    
    render(<YourSimpleMaster onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(mockItem);
    });
  });

  test('handles delete action', async () => {
    const mockItem = { id: 1, name: 'Test Item', code: 'TEST001', status: 'active' };
    const mockOnDelete = jest.fn();
    
    render(<YourSimpleMaster onDelete={mockOnDelete} />);
    
    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockItem.id);
    });
  });
});
```

### **Integration Tests**
```javascript
describe('YourSimpleMaster API Integration', () => {
  test('fetches and displays data', async () => {
    const mockData = [{ id: 1, name: 'Test Item', code: 'TEST001', status: 'active' }];
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData, total: 1 })
    });

    render(<YourSimpleMaster />);
    
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
2. Add form fields to `YourSimpleMasterForm.jsx`
3. Update table columns in `YourSimpleMasterTable.jsx`
4. Add validation rules as needed

### **Modifying Filters**
1. Update filter state in main component
2. Add new filter controls to `YourSimpleMasterFilters.jsx`
3. Implement filter logic in data fetching

### **Changing Layout**
1. Modify grid classes in main component
2. Update responsive breakpoints
3. Adjust table layouts as needed

---

## 📊 **Performance Considerations**

### **Optimization Techniques**
- **Memoization**: Use `React.memo` for expensive components
- **Debouncing**: Debounce search inputs
- **Virtual Scrolling**: For large datasets (if needed)
- **Lazy Loading**: Load data on demand

### **Example Optimization**
```javascript
import React, { memo } from 'react';

const YourSimpleMasterTable = memo(({ data, onEdit, onDelete }) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => onEdit(item)}>Edit</button>
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
});
```

---

## 🚀 **Quick Start Implementation**

### **Step 1: Copy Structure**
```bash
cp -r templates/MST_TEMPLATE_01 YourSimpleMaster
```

### **Step 2: Rename Files**
```bash
# Rename all files following the naming convention
mv ProductMaster.jsx YourSimpleMaster.jsx
mv ProductMasterForm.jsx YourSimpleMasterForm.jsx
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
- **MST_TEMPLATE_02**: `MST_TEMPLATE_02.md`
- **TXN_TEMPLATE_02**: `TXN_TEMPLATE_02.md`

# MST_TEMPLATE_02 - Medium Master Template

**Based on Product Master Component**
**Complexity Level**: Medium
**Use Cases**: Products, Suppliers, Customers, Chart of Accounts