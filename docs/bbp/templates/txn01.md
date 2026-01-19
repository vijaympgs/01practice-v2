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
