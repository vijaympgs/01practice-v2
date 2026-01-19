## 🎯 **Overview**

MST_TEMPLATE_03 provides a comprehensive template for complex master data management screens. It includes advanced features like hierarchical data structures, complex relationships, versioning, approval workflows, and sophisticated business logic.

---

## ✨ **Features Checklist**

### **Core Features**
- [x] **Advanced CRUD Operations** - Create, Read, Update, Delete with complex validation
- [x] **Hierarchical Data** - Tree structures and parent-child relationships
- [x] **Version Control** - Versioning and change tracking
- [x] **Approval Workflow** - Multi-level approval processes
- [x] **Complex Filtering** - Advanced search with multiple criteria
- [x] **Bulk Operations** - Advanced batch processing with validation
- [x] **Import/Export** - Multiple formats with validation
- [x] **Audit Trail** - Complete change history and logging

### **Advanced Features**
- [x] **Multi-layout Modes** - Table, Tree, Card, and Graph views
- [x] **Real-time Collaboration** - Multi-user editing with conflict resolution
- [x] **Advanced Validation** - Complex business rules and cross-field validation
- [x] **Workflow Integration** - Integration with approval systems
- [x] **Document Management** - File attachments and versioning
- [x] **API Integration** - RESTful and GraphQL support
- [x] **Performance Optimization** - Virtual scrolling and lazy loading
- [x] **Accessibility** - WCAG 2.1 AAA compliance

### **Enterprise Features**
- [x] **Role-based Access** - Granular permissions and access control
- [x] **Multi-tenancy** - Tenant isolation and data segregation
- [x] **Data Encryption** - Field-level encryption for sensitive data
- [x] **Compliance** - GDPR, SOX, and industry compliance features
- [x] **Reporting** - Advanced analytics and reporting capabilities
- [x] **Integration** - ERP, CRM, and third-party system integration

---

## 🏗️ **Component Structure**

```
YourComplexMaster/
├── YourComplexMaster.jsx           # Main component
├── YourComplexMasterForm.jsx       # Advanced form with validation
├── YourComplexMasterTable.jsx      # Advanced table with features
├── YourComplexMasterTree.jsx       # Hierarchical tree view
├── YourComplexMasterCard.jsx       # Advanced card view
├── YourComplexMasterGraph.jsx      # Graph/network visualization
├── YourComplexMasterFilters.jsx    # Advanced filtering system
├── YourComplexMasterWorkflow.jsx   # Approval workflow components
├── YourComplexMasterVersions.jsx   # Version control components
├── YourComplexMasterAudit.jsx      # Audit trail components
├── YourComplexMasterImport.jsx     # Import/export components
├── YourComplexMasterCollaboration.jsx # Real-time collaboration
├── YourComplexMasterPermissions.jsx # Role-based access control
├── mockData.js                     # Complex mock data
├── validationSchemas.js            # Complex validation rules
├── businessRules.js                # Business logic engine
└── YOUR_COMPLEX_MASTER_DOCUMENTATION.md
```

---

## 📱 **File Organization & Naming**

### **Naming Convention**
```javascript
// Component Files
YourComplexMaster.jsx              // Main component (PascalCase)
YourComplexMasterForm.jsx          // Advanced form component
YourComplexMasterTable.jsx         // Advanced table component
YourComplexMasterTree.jsx          // Tree view component
YourComplexMasterCard.jsx          // Card view component
YourComplexMasterGraph.jsx         // Graph visualization component

// Data Files
yourComplexMasterMockData.js       // Complex mock data (camelCase)
useYourComplexMaster.js            // Custom hooks (camelCase)
yourComplexMasterValidation.js     // Validation schemas (camelCase)
yourComplexMasterBusinessRules.js  // Business rules (camelCase)

// Styles
YourComplexMaster.module.css       // Component styles (if using CSS modules)
```

### **Export Structure**
```javascript
// YourComplexMaster/index.js
export { default as YourComplexMaster } from './YourComplexMaster';
export { default as YourComplexMasterForm } from './YourComplexMasterForm';
export { default as YourComplexMasterTable } from './YourComplexMasterTable';
export { default as YourComplexMasterTree } from './YourComplexMasterTree';
export { default as YourComplexMasterCard } from './YourComplexMasterCard';
export { default as YourComplexMasterGraph } from './YourComplexMasterGraph';
export { validationSchemas } from './validationSchemas';
export { businessRules } from './businessRules';
```

---

## 🔄 **State Management Pattern**

### **Main Component State**
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedItems, setSelectedItems] = useState([]);
const [viewMode, setViewMode] = useState('table'); // 'table' | 'tree' | 'card' | 'graph'
const [filters, setFilters] = useState({
  search: '',
  status: 'all',
  category: 'all',
  dateRange: null,
  advancedFilters: {},
  customFilters: {},
});
const [pagination, setPagination] = useState({
  page: 1,
  limit: 20,
  total: 0,
});
const [sortBy, setSortBy] = useState({ field: 'name', direction: 'asc' });
const [expandedNodes, setExpandedNodes] = useState(new Set());
const [selectedNode, setSelectedNode] = useState(null);

// Advanced state
const [versions, setVersions] = useState([]);
const [currentVersion, setCurrentVersion] = useState(null);
const [workflowState, setWorkflowState] = useState({});
const [permissions, setPermissions] = useState({});
const [collaborators, setCollaborators] = useState([]);
const [auditTrail, setAuditTrail] = useState([]);
const [conflicts, setConflicts] = useState([]);
```

### **Complex Form State**
```javascript
const [formData, setFormData] = useState({
  id: null,
  name: '',
  code: '',
  description: '',
  status: 'draft',
  category: '',
  parent: null,
  children: [],
  metadata: {},
  customFields: {},
  attachments: [],
  versions: [],
  workflow: {},
  permissions: {},
  // ... other complex fields
});

const [formErrors, setFormErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [validationState, setValidationState] = useState({});
const [businessRuleViolations, setBusinessRuleViolations] = useState([]);
```

---

## 🔌 **API Integration Points**

### **Complex API Endpoints**
```javascript
const API_ENDPOINTS = {
  // Basic CRUD
  FETCH_ALL: '/api/your-complex-masters',
  FETCH_BY_ID: '/api/your-complex-masters/:id',
  CREATE: '/api/your-complex-masters',
  UPDATE: '/api/your-complex-masters/:id',
  DELETE: '/api/your-complex-masters/:id',
  
  // Hierarchical operations
  FETCH_CHILDREN: '/api/your-complex-masters/:id/children',
  FETCH_TREE: '/api/your-complex-masters/tree',
  MOVE_NODE: '/api/your-complex-masters/:id/move',
  
  // Version control
  FETCH_VERSIONS: '/api/your-complex-masters/:id/versions',
  CREATE_VERSION: '/api/your-complex-masters/:id/versions',
  RESTORE_VERSION: '/api/your-complex-masters/:id/versions/:versionId/restore',
  
  // Workflow
  FETCH_WORKFLOW: '/api/your-complex-masters/:id/workflow',
  SUBMIT_FOR_APPROVAL: '/api/your-complex-masters/:id/submit',
  APPROVE: '/api/your-complex-masters/:id/approve',
  REJECT: '/api/your-complex-masters/:id/reject',
  
  // Collaboration
  FETCH_COLLABORATORS: '/api/your-complex-masters/:id/collaborators',
  ADD_COLLABORATOR: '/api/your-complex-masters/:id/collaborators',
  LOCK_RECORD: '/api/your-complex-masters/:id/lock',
  UNLOCK_RECORD: '/api/your-complex-masters/:id/unlock',
  
  // Audit and compliance
  FETCH_AUDIT_TRAIL: '/api/your-complex-masters/:id/audit',
  FETCH_COMPLIANCE: '/api/your-complex-masters/:id/compliance',
  
  // Advanced operations
  BULK_OPERATIONS: '/api/your-complex-masters/bulk',
  VALIDATE_BUSINESS_RULES: '/api/your-complex-masters/validate',
  SEARCH_ADVANCED: '/api/your-complex-masters/search',
  EXPORT_DATA: '/api/your-complex-masters/export',
  IMPORT_DATA: '/api/your-complex-masters/import',
};
```

---

## 🎨 **UI/UX Guidelines**

### **Complex Layout Structure**
```javascript
return (
  <div className="min-h-screen bg-neutralBg-50 flex">
    {/* Sidebar for navigation */}
    <div className="w-64 bg-white border-r border-surface-200">
      <YourComplexMasterSidebar 
        data={data}
        selectedNode={selectedNode}
        onNodeSelect={setSelectedNode}
        expandedNodes={expandedNodes}
        onNodeExpand={handleNodeExpand}
      />
    </div>

    {/* Main content area */}
    <div className="flex-1 flex flex-col">
      {/* Header with actions */}
      <div className="bg-white border-b border-surface-200 p-4">
        <YourComplexMasterHeader 
          data={selectedNode}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAction={handleAction}
          permissions={permissions}
        />
      </div>

      {/* Advanced filters */}
      <div className="bg-white border-b border-surface-200 p-4">
        <YourComplexMasterFilters 
          filters={filters}
          onFiltersChange={setFilters}
          onAdvancedFilters={handleAdvancedFilters}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 p-6">
        {viewMode === 'table' && (
          <YourComplexMasterTable 
            data={data}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSort={handleSort}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        )}
        
        {viewMode === 'tree' && (
          <YourComplexMasterTree 
            data={data}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
            onNodeMove={handleNodeMove}
            expandedNodes={expandedNodes}
          />
        )}
        
        {viewMode === 'card' && (
          <YourComplexMasterCard 
            data={data}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        
        {viewMode === 'graph' && (
          <YourComplexMasterGraph 
            data={data}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
          />
        )}
      </div>
    </div>

    {/* Collaboration panel */}
    {collaborators.length > 0 && (
      <div className="w-80 bg-white border-l border-surface-200">
        <YourComplexMasterCollaboration 
          collaborators={collaborators}
          conflicts={conflicts}
          onConflictResolve={handleConflictResolve}
        />
      </div>
    )}

    {/* Advanced form modal */}
    {showForm && (
      <YourComplexMasterForm
        initialData={selectedItem}
        onSave={handleSave}
        onCancel={() => setShowForm(false)}
        validationSchema={validationSchemas}
        businessRules={businessRules}
        permissions={permissions}
      />
    )}
  </div>
);
```

---

## 📋 **Code Examples**

### **Main Component Structure**
```javascript
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { colors, spacing, typography } from '../tokens/designTokens';
import Button from '../Button';
import Input from '../Input';
import Table from '../Table';
import { validationSchemas } from './validationSchemas';
import { businessRules } from './businessRules';

const YourComplexMaster = () => {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  // Effects
  useEffect(() => {
    fetchData();
    fetchPermissions();
    fetchCollaborators();
  }, []);

  // Memoized computations
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = !filters.search || 
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.code.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      
      // Advanced filtering
      const matchesAdvancedFilters = Object.entries(filters.advancedFilters).every(([key, value]) => {
        if (!value) return true;
        return item.metadata?.[key] === value;
      });
      
      return matchesSearch && matchesStatus && matchesCategory && matchesAdvancedFilters;
    });
  }, [data, filters]);

  const treeData = useMemo(() => {
    return buildTreeStructure(filteredData);
  }, [filteredData]);

  // Callbacks
  const fetchData = useCallback(async () => {
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
  }, []);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
    fetchNodeDetails(node.id);
  }, []);

  const handleNodeExpand = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleNodeMove = useCallback(async (nodeId, newParentId) => {
    try {
      await fetch(API_ENDPOINTS.MOVE_NODE.replace(':id', nodeId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: newParentId }),
      });
      
      setData(prev => updateNodePosition(prev, nodeId, newParentId));
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const validateBusinessRules = useCallback((data) => {
    const violations = [];
    
    // Check business rules
    Object.values(businessRules).forEach(rule => {
      const violation = rule.validate(data);
      if (violation) {
        violations.push(violation);
      }
    });
    
    setBusinessRuleViolations(violations);
    return violations.length === 0;
  }, []);

  return (
    <div className="min-h-screen bg-neutralBg-50 flex">
      {/* Tree sidebar */}
      <div className="w-64 bg-white border-r border-surface-200">
        <YourComplexMasterTree
          data={treeData}
          selectedNode={selectedNode}
          onNodeSelect={handleNodeSelect}
          onNodeExpand={handleNodeExpand}
          onNodeMove={handleNodeMove}
          expandedNodes={expandedNodes}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-surface-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-surface-900">Your Complex Master</h1>
            
            <div className="flex items-center space-x-4">
              {/* View mode selector */}
              <div className="flex bg-surface-100 rounded-lg p-1">
                {['table', 'tree', 'card', 'graph'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-600 hover:text-surface-900'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <Button onClick={handleCreate}>
                Create New
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced filters */}
        <div className="bg-white border-b border-surface-200 p-4">
          <YourComplexMasterFilters
            filters={filters}
            onFiltersChange={setFilters}
            onAdvancedFilters={handleAdvancedFilters}
          />
        </div>

        {/* Content area */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {viewMode === 'table' && (
                <YourComplexMasterTable
                  data={filteredData}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSort={handleSort}
                />
              )}
              
              {viewMode === 'card' && (
                <YourComplexMasterCard
                  data={filteredData}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
              
              {viewMode === 'graph' && (
                <YourComplexMasterGraph
                  data={treeData}
                  onNodeSelect={handleNodeSelect}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Collaboration panel */}
      {collaborators.length > 0 && (
        <div className="w-80 bg-white border-l border-surface-200">
          <YourComplexMasterCollaboration
            collaborators={collaborators}
            conflicts={conflicts}
            onConflictResolve={handleConflictResolve}
          />
        </div>
      )}
    </div>
  );
};

export default YourComplexMaster;
```

### **Advanced Form Component**
```javascript
import React, { useState, useEffect, useCallback } from 'react';
import { validationSchemas } from './validationSchemas';
import { businessRules } from './businessRules';

const YourComplexMasterForm = ({ 
  initialData, 
  onSave, 
  onCancel, 
  validationSchema, 
  businessRules,
  permissions 
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationState, setValidationState] = useState({});
  const [businessRuleViolations, setBusinessRuleViolations] = useState([]);

  const validateForm = useCallback(async () => {
    const newErrors = {};
    let isValid = true;

    // Schema validation
    if (validationSchema) {
      try {
        await validationSchema.validate(formData, { abortEarly: false });
      } catch (validationError) {
        validationError.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
        isValid = false;
      }
    }

    // Business rules validation
    const violations = [];
    Object.values(businessRules).forEach(rule => {
      const violation = rule.validate(formData);
      if (violation) {
        violations.push(violation);
        isValid = false;
      }
    });

    setBusinessRuleViolations(violations);
    setErrors(newErrors);
    return isValid;
  }, [formData, validationSchema, businessRules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!await validateForm()) return;
    
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
      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">
            Code *
          </label>
          <Input
            value={formData.code || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            error={errors.code}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Hierarchical relationship */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Parent
        </label>
        <YourComplexMasterParentSelector
          value={formData.parent}
          onChange={(parent) => setFormData(prev => ({ ...prev, parent }))}
          disabled={isSubmitting}
        />
      </div>

      {/* Custom fields */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Custom Fields
        </label>
        <YourComplexMasterCustomFields
          fields={formData.customFields || {}}
          onChange={(customFields) => setFormData(prev => ({ ...prev, customFields }))}
          disabled={isSubmitting}
        />
      </div>

      {/* Business rule violations */}
      {businessRuleViolations.length > 0 && (
        <div className="bg-accent-50 border border-accent-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-accent-800 mb-2">Business Rule Violations</h4>
          <ul className="text-sm text-accent-700 space-y-1">
            {businessRuleViolations.map((violation, index) => (
              <li key={index}>{violation.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form actions */}
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
          disabled={Object.keys(errors).length > 0 || businessRuleViolations.length > 0}
        >
          {formData.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default YourComplexMasterForm;
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```javascript
// YourComplexMaster.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourComplexMaster from './YourComplexMaster';

describe('YourComplexMaster', () => {
  test('renders complex master with tree view', () => {
    render(<YourComplexMaster />);
    expect(screen.getByText('Your Complex Master')).toBeInTheDocument();
  });

  test('handles node selection', async () => {
    render(<YourComplexMaster />);
    
    const firstNode = screen.getByText('Root Node');
    fireEvent.click(firstNode);
    
    await waitFor(() => {
      expect(screen.getByText('Node Details')).toBeInTheDocument();
    });
  });

  test('handles view mode switching', async () => {
    render(<YourComplexMaster />);
    
    fireEvent.click(screen.getByText('Tree'));
    expect(screen.getByTestId('tree-view')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Card'));
    expect(screen.getByTestId('card-view')).toBeInTheDocument();
  });

  test('validates business rules', async () => {
    const mockBusinessRules = {
      noDuplicateCodes: {
        validate: (data) => data.code ? null : { message: 'Code is required' }
      }
    };
    
    render(<YourComplexMaster businessRules={mockBusinessRules} />);
    
    fireEvent.click(screen.getByText('Create New'));
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Code is required')).toBeInTheDocument();
    });
  });
});
```

### **Integration Tests**
```javascript
describe('YourComplexMaster API Integration', () => {
  test('fetches hierarchical data', async () => {
    const mockTreeData = {
      data: [
        { id: 1, name: 'Root', parent: null },
        { id: 2, name: 'Child 1', parent: 1 },
        { id: 3, name: 'Child 2', parent: 1 },
      ]
    };
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockTreeData
    });

    render(<YourComplexMaster />);
    
    await waitFor(() => {
      expect(screen.getByText('Root')).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });
});
```

---

## 🔧 **Customization Guide**

### **Adding New Business Rules**
```javascript
// businessRules.js
export const businessRules = {
  // Existing rules...
  
  newRule: {
    validate: (data) => {
      if (data.value > data.maxValue) {
        return { message: 'Value cannot exceed maximum', field: 'value' };
      }
      return null;
    },
  },
};
```

### **Adding Custom Validation Schemas**
```javascript
// validationSchemas.js
import * as yup from 'yup';

export const validationSchemas = {
  yourComplexMaster: yup.object().shape({
    name: yup.string().required('Name is required'),
    code: yup.string().required('Code is required'),
    // Add custom validation
    customField: yup.string().when('category', {
      is: 'special',
      then: yup.string().required('Custom field is required for special category'),
      otherwise: yup.string(),
    }),
  }),
};
```

---

## 📊 **Performance Considerations**

### **Optimization Techniques**
- **Virtual Scrolling**: For large datasets
- **Tree Virtualization**: For deep hierarchies
- **Memoization**: For expensive calculations
- **Lazy Loading**: For on-demand data loading
- **Web Workers**: For background processing

### **Example Optimization**
```javascript
import React, { memo, useMemo, useCallback } from 'react';

const YourComplexMasterTree = memo(({ data, onNodeSelect }) => {
  const treeData = useMemo(() => {
    return buildOptimizedTree(data);
  }, [data]);

  const handleNodeClick = useCallback((node) => {
    onNodeSelect(node);
  }, [onNodeSelect]);

  return (
    <div>
      {treeData.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          onClick={handleNodeClick}
        />
      ))}
    </div>
  );
});
```

---

## 🚀 **Quick Start Implementation**

### **Step 1: Copy Structure**
```bash
cp -r templates/MST_TEMPLATE_03 YourComplexMaster
```

### **Step 2: Rename Files**
```bash
# Rename all files following the naming convention
mv ProductMaster.jsx YourComplexMaster.jsx
mv ProductMasterForm.jsx YourComplexMasterForm.jsx
# ... etc
```

### **Step 3: Update Content**
1. Replace "Product" with your entity name
2. Update data model for hierarchical relationships
3. Customize business rules and validation
4. Adjust API endpoints for complex operations
5. Update workflow and approval logic

### **Step 4: Test Integration**
1. Import and use in your main app
2. Test hierarchical operations
3. Verify business rule validation
4. Check approval workflow
5. Test collaboration features

---

## 📚 **Related Documentation**

- **Design Tokens**: `../tokens/designTokens.js`
- **Component Library**: `COMPONENT_LIBRARY.md`
- **State Patterns**: `STATE_PATTERNS.md`
- **MST_TEMPLATE_02**: `MST_TEMPLATE_02.md`
- **TXN_TEMPLATE_03**: `TXN_TEMPLATE_03.md`

# TXN_TEMPLATE_01 - Simple Transaction Template

**Based on Simple Transaction Components**
**Complexity Level**: Simple
**Use Cases**: Journal Entries, Adjustments, Simple Transfers

---

## 🎯 **Overview**

TXN_TEMPLATE_01 provides a streamlined template for simple transaction screens. It includes basic transaction management, simple line items, and essential workflow features while maintaining consistency with the design system.

---

## ✨ **Features Checklist**

### **Core Transaction Features**
- [x] **Basic Header** - Simple transaction metadata
- [x] **Simple Line Items** - Basic item management
- [x] **Basic Workflow** - Simple state machine (draft → posted)
- [x] **Basic Calculations** - Simple totals and validation
- [x] **Reference Integration** - Link to master data
- [x] **Basic Validation** - Required field validation
- [x] **Error Handling** - User-friendly error messages
- [x] **Responsive Design** - Mobile, tablet, desktop optimized
- [x] **Accessibility** - WCAG 2.1 AA compliance

### **Simplified Features**
- [x] **No Complex Workflow** - Simple draft → posted flow
- [x] **No Multi-mode** - Single transaction mode only
- [x] **No Document Generation** - Basic save only
- [x] **No Import/Export** - Manual entry only
- [x] **No Advanced Calculations** - Basic totals only
- [x] **No Audit Trail** - Simple logging only

---

## 🏗️ **Component Structure**

```
YourSimpleTransaction/
├── YourSimpleTransaction.jsx         # Main transaction component
├── YourSimpleTransactionHeader.jsx    # Header/metadata section
├── YourSimpleTransactionItems.jsx     # Simple line items
├── YourSimpleTransactionTotals.jsx    # Basic calculations
├── mockData.js                       # Mock data for development
└── YOUR_SIMPLE_TRANSACTION_DOCUMENTATION.md
```

---

## 📱 **File Organization & Naming**

### **Naming Convention**
```javascript
// Component Files
YourSimpleTransaction.jsx           // Main component (PascalCase)
YourSimpleTransactionHeader.jsx     // Header component
YourSimpleTransactionItems.jsx      // Line items component
YourSimpleTransactionTotals.jsx     // Totals component

// Data Files
yourSimpleTransactionMockData.js    // Mock data (camelCase)
useYourSimpleTransaction.js          // Custom hooks (camelCase)

// Constants
yourSimpleTransactionConstants.js    // Transaction constants
yourSimpleTransactionStateMachine.js // Simple state machine
```

### **Export Structure**
```javascript
// YourSimpleTransaction/index.js
export { default as YourSimpleTransaction } from './YourSimpleTransaction';
export { default as YourSimpleTransactionHeader } from './YourSimpleTransactionHeader';
export { default as YourSimpleTransactionItems } from './YourSimpleTransactionItems';
export { statusMachine } from './yourSimpleTransactionStateMachine';
```

---

## 🔄 **State Management Pattern**

### **Main Transaction State**
```javascript
const [transactionData, setTransactionData] = useState({
  id: null,
  transactionNumber: '',
  transactionDate: new Date().toISOString().split('T')[0],
  referenceId: null,
  referenceNumber: '',
  notes: '',
  status: 'draft',
});

const [lineItems, setLineItems] = useState([]);
const [loading, setLoading] = useState(false);
const [showReferenceSelection, setShowReferenceSelection] = useState(false);
```

### **Simple State Machine**
```javascript
const statusMachine = {
  draft: { 
    next: 'posted', 
    label: 'Draft', 
    color: 'text-surface-600',
    description: 'Initial draft state'
  },
  posted: { 
    next: null, 
    label: 'Posted', 
    color: 'text-success-600',
    description: 'Transaction posted to ledger'
  }
};
```

---

## 🔌 **API Integration Points**

### **Simple Transaction Endpoints**
```javascript
const API_ENDPOINTS = {
  // Transaction CRUD
  FETCH_ALL: '/api/your-simple-transactions',
  FETCH_BY_ID: '/api/your-simple-transactions/:id',
  CREATE: '/api/your-simple-transactions',
  UPDATE: '/api/your-simple-transactions/:id',
  DELETE: '/api/your-simple-transactions/:id',
  
  // Reference Data
  FETCH_REFERENCES: '/api/references',
  FETCH_REFERENCE_ITEMS: '/api/references/:id/items',
  
  // Workflow
  POST: '/api/your-simple-transactions/:id/post',
};
```

### **Data Fetching Pattern**
```javascript
const fetchTransaction = async (id) => {
  setLoading(true);
  try {
    const response = await fetch(API_ENDPOINTS.FETCH_BY_ID.replace(':id', id));
    if (!response.ok) throw new Error('Failed to fetch transaction');
    
    const result = await response.json();
    setTransactionData(result.transaction);
    setLineItems(result.lineItems || []);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 **UI/UX Guidelines**

### **Simple Transaction Layout**
```javascript
return (
  <div className="min-h-screen bg-neutralBg-50 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <YourSimpleTransactionHeader 
          data={transactionData}
          onChange={setTransactionData}
          statusMachine={statusMachine}
        />
      </div>

      {/* Reference Selection */}
      {showReferenceSelection && (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
          <YourSimpleTransactionReferenceSelection 
            onSelect={handleReferenceSelect}
          />
        </div>
      )}

      {/* Line Items */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <YourSimpleTransactionItems 
          items={lineItems}
          onChange={setLineItems}
        />
      </div>

      {/* Totals and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <YourSimpleTransactionTotals 
          items={lineItems}
          onSave={handleSave}
          onPost={handlePost}
          loading={loading}
          status={transactionData.status}
        />
      </div>
    </div>
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

const YourSimpleTransaction = () => {
  // State management
  const [transactionData, setTransactionData] = useState({
    id: null,
    transactionNumber: '',
    transactionDate: new Date().toISOString().split('T')[0],
    referenceId: null,
    referenceNumber: '',
    notes: '',
    status: 'draft',
  });

  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effects
  useEffect(() => {
    generateTransactionNumber();
  }, []);

  // Callbacks
  const generateTransactionNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const number = `TXN-${year}${month}-${random}`;
    
    setTransactionData(prev => ({ ...prev, transactionNumber: number }));
  }, []);

  const calculateTotals = useCallback(() => {
    const total = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    return {
      total: Math.round(total * 100) / 100,
    };
  }, [lineItems]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...transactionData,
        lineItems,
        totals: calculateTotals(),
      };
      
      // API call
      console.log('Saving transaction:', payload);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      await fetch(API_ENDPOINTS.POST.replace(':id', transactionData.id));
      setTransactionData(prev => ({ ...prev, status: 'posted' }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutralBg-50 p-6">
      {/* Transaction Header */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Your Simple Transaction</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMachine[transactionData.status].color} bg-surface-100`}>
              {statusMachine[transactionData.status].label}
            </span>
            <Button onClick={handleSave} loading={loading}>
              Save Transaction
            </Button>
            {transactionData.status === 'draft' && (
              <Button onClick={handlePost} loading={loading}>
                Post Transaction
              </Button>
            )}
          </div>
        </div>

        {/* Transaction Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Transaction Number
            </label>
            <Input
              value={transactionData.transactionNumber}
              onChange={(e) => setTransactionData(prev => ({ ...prev, transactionNumber: e.target.value }))}
              placeholder="Auto-generated"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Transaction Date
            </label>
            <Input
              type="date"
              value={transactionData.transactionDate}
              onChange={(e) => setTransactionData(prev => ({ ...prev, transactionDate: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Reference Number
            </label>
            <Input
              value={transactionData.referenceNumber}
              onChange={(e) => setTransactionData(prev => ({ ...prev, referenceNumber: e.target.value }))}
              placeholder="Reference number"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-surface-700 mb-1">
            Notes
          </label>
          <textarea
            value={transactionData.notes}
            onChange={(e) => setTransactionData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-surface-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            placeholder="Transaction notes..."
          />
        </div>
      </div>

      {/* Line Items Section */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">Line Items</h2>
        
        <Table
          columns={[
            { header: 'Description', accessor: 'description' },
            { 
              header: 'Amount', 
              accessor: 'amount',
              cell: (row) => (
                <Input
                  type="number"
                  step="0.01"
                  value={row.amount}
                  onChange={(e) => updateLineItem(row.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-24"
                  containerClassName="mb-0"
                />
              )
            },
            { 
              header: 'Account', 
              accessor: 'account',
              cell: (row) => (
                <select
                  className="w-full px-2 py-1 border border-surface-300 rounded text-sm"
                  value={row.account}
                  onChange={(e) => updateLineItem(row.id, 'account', e.target.value)}
                >
                  <option value="">Select Account</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              )
            },
            {
              header: 'Actions',
              cell: (row) => (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => removeLineItem(row.id)}
                >
                  Remove
                </Button>
              )
            }
          ]}
          data={lineItems}
          empty={lineItems.length === 0}
          emptyMessage="No line items added. Add items to get started."
        />

        <div className="mt-4">
          <Button onClick={addLineItem}>
            Add Line Item
          </Button>
        </div>
      </div>

      {/* Totals Section */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Transaction Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                <span className="text-sm font-medium text-surface-700">Status</span>
                <span className="text-sm text-surface-600">{statusMachine[transactionData.status].label}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                <span className="text-sm font-medium text-surface-700">Line Items</span>
                <span className="text-sm text-surface-600">{lineItems.length} items</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Transaction Totals</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-bold text-surface-900 pt-2 border-t border-surface-200">
                <span>Total:</span>
                <span>${calculateTotals().total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourSimpleTransaction;
```

### **Line Items Management**
```javascript
const YourSimpleTransactionItems = ({ items, onChange }) => {
  const updateLineItem = useCallback((id, field, value) => {
    onChange(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        return updatedItem;
      }
      return item;
    }));
  }, [onChange]);

  const removeLineItem = useCallback((id) => {
    onChange(prev => prev.filter(item => item.id !== id));
  }, [onChange]);

  return (
    <div>
      <Table
        columns={[
          { header: 'Description', accessor: 'description' },
          { header: 'Amount', accessor: 'amount' },
          { header: 'Account', accessor: 'account' },
          {
            header: 'Actions',
            cell: (row) => (
              <Button
                variant="accent"
                size="sm"
                onClick={() => removeLineItem(row.id)}
              >
                Remove
              </Button>
            )
          }
        ]}
        data={items}
      />
    </div>
  );
};
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```javascript
// YourSimpleTransaction.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourSimpleTransaction from './YourSimpleTransaction';

describe('YourSimpleTransaction', () => {
  test('renders transaction form', () => {
    render(<YourSimpleTransaction />);
    expect(screen.getByText('Your Simple Transaction')).toBeInTheDocument();
  });

  test('generates transaction number on mount', () => {
    render(<YourSimpleTransaction />);
    expect(screen.getByDisplayValue(/TXN-\d{8}-\d{3}/)).toBeInTheDocument();
  });

  test('calculates totals correctly', async () => {
    render(<YourSimpleTransaction />);
    
    // Add line items
    fireEvent.click(screen.getByText('Add Line Item'));
    
    // Verify calculations
    await waitFor(() => {
      expect(screen.getByText(/\$0\.00/)).toBeInTheDocument();
    });
  });

  test('handles save action', async () => {
    const mockSave = jest.fn();
    render(<YourSimpleTransaction onSave={mockSave} />);
    
    fireEvent.click(screen.getByText('Save Transaction'));
    
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionNumber: expect.stringMatching(/TXN-/),
          lineItems: expect.any(Array)
        })
      );
    });
  });
});
```

### **Integration Tests**
```javascript
describe('YourSimpleTransaction API Integration', () => {
  test('saves transaction successfully', async () => {
    const mockSave = jest.fn();
    render(<YourSimpleTransaction onSave={mockSave} />);
    
    fireEvent.click(screen.getByText('Save Transaction'));
    
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionNumber: expect.stringMatching(/TXN-/),
          lineItems: expect.any(Array)
        })
      );
    });
  });
});
```

---

## 🔧 **Customization Guide**

### **Adding New Transaction Fields**
1. Update `transactionData` state in main component
2. Add form fields to header section
3. Update validation rules
4. Modify API payload structure

### **Modifying Workflow States**
1. Update `statusMachine` object
2. Add new status transitions
3. Update action buttons
4. Add workflow logic

### **Changing Line Item Structure**
1. Update line item state structure
2. Modify table columns
3. Update calculation logic
4. Adjust validation rules

---

## 📊 **Performance Considerations**

### **Optimization Techniques**
- **Memoization**: Use `useMemo` for expensive calculations
- **Debouncing**: Debounce input changes
- **Virtual Scrolling**: For large line item lists
- **Lazy Loading**: Load reference data on demand

### **Example Optimization**
```javascript
import React, { memo, useMemo, useCallback } from 'react';

const YourSimpleTransactionItems = memo(({ items, onChange }) => {
  const totals = useMemo(() => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }, [items]);

  const handleItemChange = useCallback((id, field, value) => {
    onChange(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, [onChange]);

  return (
    <div>
      <div className="mb-4">Total: ${totals.toFixed(2)}</div>
      {/* Render items */}
    </div>
  );
});
```

---

## 🚀 **Quick Start Implementation**

### **Step 1: Copy Structure**
```bash
cp -r templates/TXN_TEMPLATE_01 YourSimpleTransaction
```

### **Step 2: Rename Files**
```bash
# Rename all files following the naming convention
mv PurchaseOrder.jsx YourSimpleTransaction.jsx
mv PurchaseOrderHeader.jsx YourSimpleTransactionHeader.jsx
# ... etc
```

### **Step 3: Update Content**
1. Replace "Purchase Order" with your transaction name
2. Update state machine and workflow
3. Customize validation rules
4. Adjust API endpoints
5. Update business logic

### **Step 4: Test Integration**
1. Import and use in your main app
2. Test transaction workflow
3. Verify calculations
4. Check posting functionality

---

## 📚 **Related Documentation**

- **Design Tokens**: `../tokens/designTokens.js`
- **Component Library**: `COMPONENT_LIBRARY.md`
- **State Patterns**: `STATE_PATTERNS.md`
- **TXN_TEMPLATE_02**: `TXN_TEMPLATE_02.md`
- **MST_TEMPLATE_01**: `MST_TEMPLATE_01.md`

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Based on**: Simple Transaction Components v1.0.0

# TXN_TEMPLATE_02 - Medium Transaction Template

**Based on Purchase Order Component**
**Complexity Level**: Medium
**Use Cases**: Purchase Orders, Sales Orders, Invoices, Goods Receipt/Issue

------------------------------------------------------------------------
TXN_TEMPLATE_02_RESUME

# TXN_TEMPLATE_02 - Medium Transaction Template

**Based on Purchase Order Component**
**Complexity Level**: Medium
**Use Cases**: Purchase Orders, Sales Orders, Invoices, Goods Receipt/Issue

---

## 🎯 **Overview**

TXN_TEMPLATE_02 provides a comprehensive template for medium-complexity transaction screens. It includes header management, line item processing, workflow state machines, document generation, and multi-mode processing capabilities.

---

## ✨ **Features Checklist**

### **Core Transaction Features**
- [x] **Header Section** - Transaction metadata and status management
- [x] **Line Items Grid** - Dynamic item management with calculations
- [x] **Workflow Management** - State machine for approval flow
- [x] **Document Generation** - PDF/Excel export capabilities
- [x] **Reference Integration** - Link to masters and other transactions
- [x] **Validation Engine** - Business rule validation
- [x] **Audit Trail** - Change tracking and history
- [x] **Multi-mode Support** - Single and batch processing modes

### **Data Processing Features**
- [x] **Real-time Calculations** - Automatic totals, taxes, discounts
- [x] **Search Integration** - Auto-complete for master data
- [x] **CSV Import** - Bulk data import functionality
- [x] **Data Validation** - Client and server-side validation
- [x] **Error Handling** - Graceful error recovery
- [x] **Concurrent Editing** - Conflict detection and resolution

### **UI/UX Features**
- [x] **Status Timeline** - Visual workflow progress indicator
- [x] **Modal Wizards** - Step-by-step transaction creation
- [x] **Quick Actions** - Generate next transaction in flow
- [x] **Responsive Design** - Mobile, tablet, desktop optimized
- [x] **Loading States** - Skeleton loaders and progress indicators
- [x] **Accessibility** - WCAG 2.1 AA compliance

---

## 🏗️ **Component Structure**

```
YourTransaction/
├── YourTransaction.jsx         # Main transaction component
├── YourTransactionHeader.jsx    # Header/metadata section
├── YourTransactionItems.jsx     # Line items management
├── YourTransactionTotals.jsx    # Calculations and totals
├── YourTransactionTimeline.jsx  # Status workflow timeline
├── YourTransactionModals.jsx    # Import/export modals
├── mockData.js                 # Mock data for development
└── YOUR_TRANSACTION_DOCUMENTATION.md
```

---

## 📱 **File Organization & Naming**

### **Naming Convention**
```javascript
// Component Files
YourTransaction.jsx           // Main component (PascalCase)
YourTransactionHeader.jsx     // Header component
YourTransactionItems.jsx      // Line items component
YourTransactionTotals.jsx     // Totals component

// Data Files
yourTransactionMockData.js    // Mock data (camelCase)
useYourTransaction.js          // Custom hooks (camelCase)

// Constants
yourTransactionConstants.js    // Transaction constants
yourTransactionStateMachine.js // State machine definition
```

### **Export Structure**
```javascript
// YourTransaction/index.js
export { default as YourTransaction } from './YourTransaction';
export { default as YourTransactionHeader } from './YourTransactionHeader';
export { default as YourTransactionItems } from './YourTransactionItems';
export { statusMachine } from './yourTransactionStateMachine';
```

---

## 🔄 **State Management Pattern**

### **Main Transaction State**
```javascript
const [transactionData, setTransactionData] = useState({
  id: null,
  transactionNumber: '',
  transactionDate: new Date().toISOString().split('T')[0],
  referenceId: null,
  referenceNumber: '',
  supplier: '',
  customer: '',
  status: 'draft',
  notes: '',
  terms: 'NET 30',
  dueDate: '',
});

const [lineItems, setLineItems] = useState([]);
const [selectedReferences, setSelectedReferences] = useState([]);
const [showReferenceSelection, setShowReferenceSelection] = useState(false);
const [multipleMode, setMultipleMode] = useState(false);
const [loading, setLoading] = useState(false);
const [showImportModal, setShowImportModal] = useState(false);
const [showExportModal, setShowExportModal] = useState(false);
```

### **State Machine Pattern**
```javascript
const statusMachine = {
  draft: { 
    next: 'submitted', 
    label: 'Draft', 
    color: 'text-surface-600',
    description: 'Initial draft state'
  },
  submitted: { 
    next: 'approved', 
    label: 'Submitted', 
    color: 'text-primary-600',
    description: 'Submitted for approval'
  },
  approved: { 
    next: 'processed', 
    label: 'Approved', 
    color: 'text-success-600',
    description: 'Approved by manager'
  },
  processed: { 
    next: 'closed', 
    label: 'Processed', 
    color: 'text-success-600',
    description: 'Transaction processed'
  },
  closed: { 
    next: null, 
    label: 'Closed', 
    color: 'text-surface-900',
    description: 'Transaction completed'
  }
};
```

---

## 🔌 **API Integration Points**

### **Transaction Endpoints**
```javascript
const API_ENDPOINTS = {
  // Transaction CRUD
  FETCH_ALL: '/api/your-transactions',
  FETCH_BY_ID: '/api/your-transactions/:id',
  CREATE: '/api/your-transactions',
  UPDATE: '/api/your-transactions/:id',
  DELETE: '/api/your-transactions/:id',
  
  // Reference Data
  FETCH_REFERENCES: '/api/references',
  FETCH_REFERENCE_ITEMS: '/api/references/:id/items',
  
  // Bulk Operations
  BULK_CREATE: '/api/your-transactions/bulk-create',
  BULK_UPDATE: '/api/your-transactions/bulk-update',
  
  // Import/Export
  IMPORT_CSV: '/api/your-transactions/import',
  EXPORT_EXCEL: '/api/your-transactions/export',
  
  // Workflow
  SUBMIT_FOR_APPROVAL: '/api/your-transactions/:id/submit',
  APPROVE: '/api/your-transactions/:id/approve',
  REJECT: '/api/your-transactions/:id/reject',
  PROCESS: '/api/your-transactions/:id/process'
};
```

### **Data Fetching Pattern**
```javascript
const fetchTransaction = async (id) => {
  setLoading(true);
  try {
    const response = await fetch(API_ENDPOINTS.FETCH_BY_ID.replace(':id', id));
    if (!response.ok) throw new Error('Failed to fetch transaction');
    
    const result = await response.json();
    setTransactionData(result.transaction);
    setLineItems(result.lineItems || []);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 **UI/UX Guidelines**

### **Transaction Layout Structure**
```javascript
return (
  <div className="min-h-screen bg-neutralBg-50 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <YourTransactionHeader 
          data={transactionData}
          onChange={setTransactionData}
          statusMachine={statusMachine}
        />
      </div>

      {/* Reference Selection */}
      {showReferenceSelection && (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
          <YourTransactionReferenceSelection 
            multipleMode={multipleMode}
            onSelect={handleReferenceSelect}
          />
        </div>
      )}

      {/* Line Items */}
      {lineItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
          <YourTransactionItems 
            items={lineItems}
            onChange={setLineItems}
          />
        </div>
      )}

      {/* Totals and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <YourTransactionTotals 
          items={lineItems}
          onSave={handleSave}
          loading={loading}
        />
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <YourTransactionTimeline 
          currentStatus={transactionData.status}
          statusMachine={statusMachine}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
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

const YourTransaction = () => {
  // State management
  const [transactionData, setTransactionData] = useState({
    id: null,
    transactionNumber: '',
    transactionDate: new Date().toISOString().split('T')[0],
    status: 'draft',
  });

  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Effects
  useEffect(() => {
    generateTransactionNumber();
  }, []);

  // Callbacks
  const generateTransactionNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const number = `TXN-${year}${month}-${random}`;
    
    setTransactionData(prev => ({ ...prev, transactionNumber: number }));
  }, []);

  const calculateTotals = useCallback(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate), 0);
    const total = subtotal + tax;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }, [lineItems]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...transactionData,
        lineItems,
        totals: calculateTotals(),
      };
      
      // API call
      console.log('Saving transaction:', payload);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutralBg-50 p-6">
      {/* Transaction Header */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Your Transaction</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMachine[transactionData.status].color} bg-surface-100`}>
              {statusMachine[transactionData.status].label}
            </span>
            <Button onClick={handleSave} loading={loading}>
              Save Transaction
            </Button>
          </div>
        </div>

        {/* Transaction Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Transaction Number
            </label>
            <Input
              value={transactionData.transactionNumber}
              onChange={(e) => setTransactionData(prev => ({ ...prev, transactionNumber: e.target.value }))}
              placeholder="Auto-generated"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Transaction Date
            </label>
            <Input
              type="date"
              value={transactionData.transactionDate}
              onChange={(e) => setTransactionData(prev => ({ ...prev, transactionDate: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">Line Items</h2>
        
        <Table
          columns={[
            { header: 'Item Code', accessor: 'code' },
            { header: 'Description', accessor: 'description' },
            { 
              header: 'Quantity', 
              accessor: 'quantity',
              cell: (row) => (
                <Input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => updateLineItem(row.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-20"
                  containerClassName="mb-0"
                />
              )
            },
            { 
              header: 'Unit Price', 
              accessor: 'unitPrice',
              cell: (row) => (
                <Input
                  type="number"
                  step="0.01"
                  value={row.unitPrice}
                  onChange={(e) => updateLineItem(row.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-24"
                  containerClassName="mb-0"
                />
              )
            },
            { 
              header: 'Line Total', 
              accessor: 'lineTotal',
              cell: (row) => `$${(row.quantity * row.unitPrice).toFixed(2)}`
            }
          ]}
          data={lineItems}
          empty={lineItems.length === 0}
          emptyMessage="No line items added. Add items to get started."
        />
      </div>

      {/* Totals Section */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Transaction Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                <span className="text-sm font-medium text-surface-700">Status</span>
                <span className="text-sm text-surface-600">{statusMachine[transactionData.status].label}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Transaction Totals</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-surface-600">Subtotal:</span>
                <span className="font-medium">${calculateTotals().subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Tax:</span>
                <span className="font-medium">${calculateTotals().tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-surface-900 pt-2 border-t border-surface-200">
                <span>Total:</span>
                <span>${calculateTotals().total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourTransaction;
```

### **Line Items Management**
```javascript
const YourTransactionItems = ({ items, onChange }) => {
  const updateLineItem = useCallback((id, field, value) => {
    onChange(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
          updatedItem.lineTotal = updatedItem.quantity * updatedItem.unitPrice * (1 + updatedItem.taxRate);
        }
        return updatedItem;
      }
      return item;
    }));
  }, [onChange]);

  const removeLineItem = useCallback((id) => {
    onChange(prev => prev.filter(item => item.id !== id));
  }, [onChange]);

  return (
    <div>
      {/* Search and Add Items */}
      <div className="mb-4">
        <Input
          placeholder="Search for items..."
          // Add search functionality
        />
      </div>

      {/* Items Table */}
      <Table
        columns={[
          { header: 'Code', accessor: 'code' },
          { header: 'Description', accessor: 'description' },
          { header: 'Quantity', accessor: 'quantity' },
          { header: 'Unit Price', accessor: 'unitPrice' },
          { header: 'Total', accessor: 'lineTotal' },
          {
            header: 'Actions',
            cell: (row) => (
              <Button
                variant="accent"
                size="sm"
                onClick={() => removeLineItem(row.id)}
              >
                Remove
              </Button>
            )
          }
        ]}
        data={items}
      />
    </div>
  );
};
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```javascript
// YourTransaction.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourTransaction from './YourTransaction';

describe('YourTransaction', () => {
  test('renders transaction form', () => {
    render(<YourTransaction />);
    expect(screen.getByText('Your Transaction')).toBeInTheDocument();
  });

  test('generates transaction number on mount', () => {
    render(<YourTransaction />);
    expect(screen.getByDisplayValue(/TXN-\d{8}-\d{3}/)).toBeInTheDocument();
  });

  test('calculates totals correctly', async () => {
    render(<YourTransaction />);
    
    // Add line items
    fireEvent.click(screen.getByText('Add Item'));
    
    // Verify calculations
    await waitFor(() => {
      expect(screen.getByText(/\$100\.00/)).toBeInTheDocument();
    });
  });
});
```

### **Integration Tests**
```javascript
describe('YourTransaction API Integration', () => {
  test('saves transaction successfully', async () => {
    const mockSave = jest.fn();
    render(<YourTransaction onSave={mockSave} />);
    
    fireEvent.click(screen.getByText('Save Transaction'));
    
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionNumber: expect.stringMatching(/TXN-/),
          lineItems: expect.any(Array)
        })
      );
    });
  });
});
```

---

## 🔧 **Customization Guide**

### **Adding New Transaction Fields**
1. Update `transactionData` state in main component
2. Add form fields to header section
3. Update validation rules
4. Modify API payload structure

### **Modifying Workflow States**
1. Update `statusMachine` object
2. Add new status transitions
3. Update timeline component
4. Add workflow actions

### **Changing Line Item Structure**
1. Update line item state structure
2. Modify table columns
3. Update calculation logic
4. Adjust import/export format

---

## 📊 **Performance Considerations**

### **Optimization Techniques**
- **Memoization**: Use `useMemo` for expensive calculations
- **Debouncing**: Debounce search inputs
- **Virtual Scrolling**: For large line item lists
- **Lazy Loading**: Load reference data on demand

### **Example Optimization**
```javascript
import React, { memo, useMemo, useCallback } from 'react';

const YourTransactionItems = memo(({ items, onChange }) => {
  const totals = useMemo(() => {
    return items.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [items]);

  const handleItemChange = useCallback((id, field, value) => {
    onChange(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, [onChange]);

  return (
    <div>
      <div className="mb-4">Total: ${totals.toFixed(2)}</div>
      {/* Render items */}
    </div>
  );
});
```

---

## 🚀 **Quick Start Implementation**

### **Step 1: Copy Structure**
```bash
cp -r templates/TXN_TEMPLATE_02 YourTransaction
```

### **Step 2: Rename Files**
```bash
# Rename all files following the naming convention
mv PurchaseOrder.jsx YourTransaction.jsx
mv PurchaseOrderHeader.jsx YourTransactionHeader.jsx
# ... etc
```

### **Step 3: Update Content**
1. Replace "Purchase Order" with your transaction name
2. Update state machine and workflow
3. Customize validation rules
4. Adjust API endpoints
5. Update business logic

### **Step 4: Test Integration**
1. Import and use in your main app
2. Test transaction workflow
3. Verify calculations
4. Check approval flow

---

## 📚 **Related Documentation**

- **Design Tokens**: `../tokens/designTokens.js`
- **Component Library**: `COMPONENT_LIBRARY.md`
- **State Patterns**: `STATE_PATTERNS.md`
- **Purchase Order Implementation**: `../PurchaseTransactions/PURCHASE_TRANSACTIONS_DOCUMENTATION.md`
