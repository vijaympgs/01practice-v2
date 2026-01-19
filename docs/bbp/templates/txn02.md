# TXN_TEMPLATE_02 - Medium Transaction Template

**Based on Purchase Order Component**
**Complexity Level**: Medium
**Use Cases**: Purchase Orders, Sales Orders, Invoices, Goods Receipt/Issue


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
