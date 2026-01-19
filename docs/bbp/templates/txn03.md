# TXN_TEMPLATE_03 - Complex Transaction Template

**Based on Point of Sales (POS) Component**
**Complexity Level**: Complex
**Use Cases**: Point of Sales, Manufacturing Orders, Multi-currency Transactions, Complex Workflows

---

## 🎯 **Overview**

TXN_TEMPLATE_03 provides a comprehensive template for complex transaction screens. It includes advanced features like real-time processing, multi-payment methods, hardware integration, offline capability, and sophisticated business logic.

---

## ✨ **Features Checklist**

### **Core Transaction Features**
- [x] **Advanced Header** - Complex transaction metadata with customer integration
- [x] **Dynamic Line Items** - Real-time item management with inventory integration
- [x] **Complex Workflow** - Multi-state machine with approval processes
- [x] **Multi-payment Processing** - Cash, card, digital wallets, split payments
- [x] **Real-time Calculations** - Dynamic pricing, taxes, discounts, promotions
- [x] **Customer Integration** - Loyalty programs, customer accounts, credit management
- [x] **Hardware Integration** - Barcode scanners, receipt printers, cash drawers
- [x] **Offline Capability** - Local storage with sync when connection restored

### **Advanced Features**
- [x] **Real-time Collaboration** - Multi-user transaction processing
- [x] **Advanced Validation** - Complex business rules and compliance checks
- [x] **Promotion Engine** - Discounts, BOGO offers, loyalty rewards
- [x] **Returns & Exchanges** - Post-sale transaction handling
- [x] **Multi-store Support** - Inter-store transfers and centralized inventory
- [x] **Currency Management** - Multi-currency with real-time exchange rates
- [x] **Tax Management** - Complex tax calculations with multiple jurisdictions
- [x] **Reporting Integration** - Real-time analytics and sales reporting

### **Enterprise Features**
- [x] **PCI Compliance** - Payment card security requirements
- [x] **Audit Trail** - Detailed transaction logging for compliance
- [x] **Role-based Access** - Granular permissions for transaction operations
- [x] **API Integration** - ERP, CRM, and third-party system integration
- [x] **Data Encryption** - End-to-end encryption for sensitive data
- [x] **Performance Optimization** - Real-time processing with sub-second response
- [x] **Accessibility** - WCAG 2.1 AAA compliance with touch optimization

---

## 🏗️ **Component Structure**

```
YourComplexTransaction/
├── YourComplexTransaction.jsx           # Main transaction component
├── YourComplexTransactionHeader.jsx    # Advanced header with customer info
├── YourComplexTransactionItems.jsx     # Dynamic line items with search
├── YourComplexTransactionPayments.jsx  # Multi-payment processing
├── YourComplexTransactionTotals.jsx    # Real-time calculations engine
├── YourComplexTransactionCustomer.jsx  # Customer management integration
├── YourComplexTransactionPromotions.jsx # Promotion and discount engine
├── YourComplexTransactionHardware.jsx  # Hardware integration layer
├── YourComplexTransactionOffline.jsx   # Offline sync management
├── YourComplexTransactionReturns.jsx   # Returns and exchanges handling
├── YourComplexTransactionReports.jsx   # Real-time reporting components
├── YourComplexTransactionCompliance.jsx # PCI compliance and security
├── mockData.js                         # Complex transaction mock data
├── pricingEngine.js                    # Dynamic pricing calculations
├── taxEngine.js                        # Multi-jurisdiction tax calculations
├── promotionEngine.js                  # Promotion and discount logic
└── YOUR_COMPLEX_TRANSACTION_DOCUMENTATION.md
```

---

## 📱 **File Organization & Naming**

### **Naming Convention**
```javascript
// Component Files
YourComplexTransaction.jsx              // Main component (PascalCase)
YourComplexTransactionHeader.jsx        // Header component
YourComplexTransactionItems.jsx         // Line items component
YourComplexTransactionPayments.jsx      // Payment processing component
YourComplexTransactionTotals.jsx        // Calculations engine
YourComplexTransactionCustomer.jsx      // Customer integration component

// Data Files
yourComplexTransactionMockData.js       // Mock data (camelCase)
useYourComplexTransaction.js            // Custom hooks (camelCase)
yourComplexTransactionPricing.js        // Pricing engine (camelCase)
yourComplexTransactionTax.js            // Tax calculations (camelCase)

// Hardware Integration
hardwareIntegration/
├── barcodeScanner.js                   // Barcode scanner integration
├── receiptPrinter.js                   // Receipt printer integration
├── cashDrawer.js                       // Cash drawer integration
└── paymentTerminal.js                  // Payment terminal integration
```

### **Export Structure**
```javascript
// YourComplexTransaction/index.js
export { default as YourComplexTransaction } from './YourComplexTransaction';
export { default as YourComplexTransactionHeader } from './YourComplexTransactionHeader';
export { default as YourComplexTransactionItems } from './YourComplexTransactionItems';
export { default as YourComplexTransactionPayments } from './YourComplexTransactionPayments';
export { pricingEngine } from './pricingEngine';
export { taxEngine } from './taxEngine';
export { promotionEngine } from './promotionEngine';
```

---

## 🔄 **State Management Pattern**

### **Main Transaction State**
```javascript
const [transactionData, setTransactionData] = useState({
  id: null,
  transactionNumber: '',
  transactionDate: new Date().toISOString().split('T')[0],
  customerId: null,
  customer: null,
  storeId: null,
  registerId: null,
  cashierId: null,
  status: 'active',
  notes: '',
  currency: 'USD',
  exchangeRate: 1.0,
});

const [lineItems, setLineItems] = useState([]);
const [payments, setPayments] = useState([]);
const [promotions, setPromotions] = useState([]);
const [totals, setTotals] = useState({
  subtotal: 0,
  tax: 0,
  discount: 0,
  serviceCharge: 0,
  total: 0,
});

// Advanced state
const [isOffline, setIsOffline] = useState(false);
const [syncQueue, setSyncQueue] = useState([]);
const [hardwareStatus, setHardwareStatus] = useState({
  barcodeScanner: 'connected',
  receiptPrinter: 'connected',
  cashDrawer: 'connected',
  paymentTerminal: 'connected',
});
const [customerSearch, setCustomerSearch] = useState('');
const [productSearch, setProductSearch] = useState('');
const [showCustomerModal, setShowCustomerModal] = useState(false);
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [processingPayment, setProcessingPayment] = useState(false);
```

### **Complex State Machine**
```javascript
const statusMachine = {
  active: { 
    next: 'payment_pending', 
    label: 'Active', 
    color: 'text-primary-600',
    description: 'Transaction in progress'
  },
  payment_pending: { 
    next: 'paid', 
    label: 'Payment Pending', 
    color: 'text-warning-600',
    description: 'Awaiting payment completion'
  },
  paid: { 
    next: 'completed', 
    label: 'Paid', 
    color: 'text-success-600',
    description: 'Payment completed successfully'
  },
  completed: { 
    next: null, 
    label: 'Completed', 
    color: 'text-success-600',
    description: 'Transaction completed and closed'
  },
  voided: { 
    next: null, 
    label: 'Voided', 
    color: 'text-accent-600',
    description: 'Transaction voided and cancelled'
  },
  refunded: { 
    next: null, 
    label: 'Refunded', 
    color: 'text-warning-600',
    description: 'Transaction refunded'
  }
};
```

---

## 🔌 **API Integration Points**

### **Complex Transaction Endpoints**
```javascript
const API_ENDPOINTS = {
  // Transaction CRUD
  FETCH_ALL: '/api/your-complex-transactions',
  FETCH_BY_ID: '/api/your-complex-transactions/:id',
  CREATE: '/api/your-complex-transactions',
  UPDATE: '/api/your-complex-transactions/:id',
  DELETE: '/api/your-complex-transactions/:id',
  
  // Customer operations
  SEARCH_CUSTOMERS: '/api/customers/search',
  FETCH_CUSTOMER: '/api/customers/:id',
  CREATE_CUSTOMER: '/api/customers',
  UPDATE_CUSTOMER: '/api/customers/:id',
  
  // Product operations
  SEARCH_PRODUCTS: '/api/products/search',
  FETCH_PRODUCT: '/api/products/:id',
  CHECK_INVENTORY: '/api/products/:id/inventory',
  UPDATE_INVENTORY: '/api/products/:id/inventory',
  
  // Pricing and promotions
  CALCULATE_PRICE: '/api/pricing/calculate',
  APPLY_PROMOTION: '/api/promotions/apply',
  VALIDATE_DISCOUNT: '/api/promotions/validate',
  
  // Payment processing
  PROCESS_PAYMENT: '/api/payments/process',
  REFUND_PAYMENT: '/api/payments/:id/refund',
  VOID_PAYMENT: '/api/payments/:id/void',
  
  // Tax calculations
  CALCULATE_TAX: '/api/tax/calculate',
  GET_TAX_RATES: '/api/tax/rates',
  
  // Hardware integration
  PRINT_RECEIPT: '/api/hardware/receipt/print',
  OPEN_CASH_DRAWER: '/api/hardware/cash-drawer/open',
  SCAN_BARCODE: '/api/hardware/barcode/scan',
  
  // Offline sync
  SYNC_TRANSACTIONS: '/api/sync/transactions',
  GET_SYNC_STATUS: '/api/sync/status',
  
  // Reporting
  GENERATE_REPORT: '/api/reports/generate',
  GET_SALES_SUMMARY: '/api/reports/sales-summary',
};
```

---

## 🎨 **UI/UX Guidelines**

### **Complex Transaction Layout**
```javascript
return (
  <div className="min-h-screen bg-neutralBg-50 flex">
    {/* Main transaction area */}
    <div className="flex-1 flex flex-col">
      {/* Header with customer info */}
      <div className="bg-white border-b border-surface-200 p-4">
        <YourComplexTransactionHeader 
          data={transactionData}
          customer={customer}
          onChange={setTransactionData}
          onCustomerSelect={handleCustomerSelect}
          hardwareStatus={hardwareStatus}
        />
      </div>

      {/* Product search and items */}
      <div className="flex-1 flex">
        {/* Left sidebar - product search */}
        <div className="w-80 bg-white border-r border-surface-200 p-4">
          <YourComplexTransactionProductSearch
            search={productSearch}
            onSearchChange={setProductSearch}
            onProductSelect={handleProductSelect}
            loading={productSearchLoading}
          />
        </div>

        {/* Main content - line items */}
        <div className="flex-1 p-4">
          <YourComplexTransactionItems
            items={lineItems}
            onChange={setLineItems}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
            promotions={promotions}
            onApplyPromotion={handleApplyPromotion}
          />
        </div>

        {/* Right sidebar - totals and actions */}
        <div className="w-80 bg-white border-l border-surface-200 p-4">
          <YourComplexTransactionTotals
            totals={totals}
            items={lineItems}
            customer={customer}
            promotions={promotions}
            currency={transactionData.currency}
          />
          
          <YourComplexTransactionActions
            transactionData={transactionData}
            totals={totals}
            onPayment={handlePayment}
            onComplete={handleComplete}
            onVoid={handleVoid}
            onSuspend={handleSuspend}
            hardwareStatus={hardwareStatus}
          />
        </div>
      </div>

      {/* Payment modal */}
      {showPaymentModal && (
        <YourComplexTransactionPayments
          totals={totals}
          customer={customer}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setShowPaymentModal(false)}
          processing={processingPayment}
          hardwareStatus={hardwareStatus}
        />
      )}

      {/* Customer modal */}
      {showCustomerModal && (
        <YourComplexTransactionCustomer
          customer={customer}
          search={customerSearch}
          onSearchChange={setCustomerSearch}
          onCustomerSelect={handleCustomerSelect}
          onCreateCustomer={handleCreateCustomer}
          onCancel={() => setShowCustomerModal(false)}
        />
      )}

      {/* Offline indicator */}
      {isOffline && (
        <div className="fixed top-4 right-4 bg-warning-100 text-warning-800 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58-9.92c.75-1.334-.213-2.98-1.742-3.486a2.5 2.5 0 00-2.829 0l-5.58 9.92a11.813 11.813 0 006.36 6.36c1.733 1.733 2.727 1.733 3.486 0l5.58-9.92c.75-1.334-.213-2.98-1.742-3.486a2.5 2.5 0 00-2.829 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Offline Mode</span>
          </div>
        </div>
      )}
    </div>
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
import { pricingEngine } from './pricingEngine';
import { taxEngine } from './taxEngine';
import { promotionEngine } from './promotionEngine';

const YourComplexTransaction = () => {
  // State management
  const [transactionData, setTransactionData] = useState({
    id: null,
    transactionNumber: '',
    transactionDate: new Date().toISOString().split('T')[0],
    customerId: null,
    customer: null,
    status: 'active',
    currency: 'USD',
  });

  const [lineItems, setLineItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    serviceCharge: 0,
    total: 0,
  });

  const [isOffline, setIsOffline] = useState(false);
  const [hardwareStatus, setHardwareStatus] = useState({
    barcodeScanner: 'connected',
    receiptPrinter: 'connected',
    cashDrawer: 'connected',
  });

  // Effects
  useEffect(() => {
    generateTransactionNumber();
    checkHardwareStatus();
    checkOnlineStatus();
    setupBarcodeScanner();
  }, []);

  // Memoized calculations
  const calculatedTotals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const discount = promotionEngine.calculateDiscount(lineItems, customer);
    const tax = taxEngine.calculateTax(lineItems, customer, transactionData);
    const serviceCharge = calculateServiceCharge(subtotal, customer);
    const total = subtotal - discount + tax + serviceCharge;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      serviceCharge: Math.round(serviceCharge * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }, [lineItems, customer, transactionData]);

  // Update totals when calculated
  useEffect(() => {
    setTotals(calculatedTotals);
  }, [calculatedTotals]);

  // Callbacks
  const generateTransactionNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const number = `POS-${year}${month}${day}-${random}`;
    
    setTransactionData(prev => ({ ...prev, transactionNumber: number }));
  }, []);

  const checkHardwareStatus = useCallback(async () => {
    try {
      const scanner = await navigator.usb.getDevices();
      const printer = await navigator.usb.getDevices();
      
      setHardwareStatus(prev => ({
        ...prev,
        barcodeScanner: scanner.length > 0 ? 'connected' : 'disconnected',
        receiptPrinter: printer.length > 0 ? 'connected' : 'disconnected',
      });
    } catch (error) {
      console.error('Hardware check failed:', error);
    }
  }, []);

  const checkOnlineStatus = useCallback(() => {
    setIsOffline(!navigator.onLine);
  }, []);

  const setupBarcodeScanner = useCallback(() => {
    // Barcode scanner setup logic
    if (hardwareStatus.barcodeScanner === 'connected') {
      // Initialize barcode scanner
      const scanner = new BarcodeScanner();
      scanner.onScan(handleBarcodeScan);
    }
  }, [hardwareStatus.barcodeScanner]);

  const handleBarcodeScan = useCallback((barcode) => {
    // Search for product by barcode
    searchProductByBarcode(barcode);
  }, []);

  const searchProductByBarcode = useCallback(async (barcode) => {
    try {
      const response = await fetch(API_ENDPOINTS.SEARCH_PRODUCTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      });
      
      const product = await response.json();
      if (product) {
        addLineItem(product);
      }
    } catch (error) {
      console.error('Barcode search failed:', error);
    }
  }, []);

  const addLineItem = useCallback((product) => {
    const existingItem = lineItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity
      setLineItems(prev => prev.map(item => 
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: 1,
        unitPrice: pricingEngine.calculatePrice(product, customer),
        originalPrice: product.price,
        taxRate: product.taxRate,
        discount: 0,
        promotions: [],
      };
      
      setLineItems(prev => [...prev, newItem]);
    }
  }, [lineItems, customer]);

  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setLineItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setLineItems(prev => prev.map(item => 
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  }, []);

  const handlePayment = useCallback(async (paymentData) => {
    setProcessingPayment(true);
    
    try {
      const payment = await processPayment(paymentData);
      setPayments(prev => [...prev, payment]);
      
      // Update transaction status
      if (payment.amount >= totals.total) {
        setTransactionData(prev => ({ ...prev, status: 'paid' }));
        await completeTransaction();
      }
      
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessingPayment(false);
    }
  }, [totals]);

  const processPayment = useCallback(async (paymentData) => {
    // Payment processing logic
    const payment = {
      id: Date.now(),
      method: paymentData.method,
      amount: paymentData.amount,
      currency: transactionData.currency,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    // Process payment through payment gateway
    if (paymentData.method === 'card') {
      await processCardPayment(paymentData);
    } else if (paymentData.method === 'cash') {
      await openCashDrawer();
    }

    return payment;
  }, [transactionData]);

  const completeTransaction = useCallback(async () => {
    try {
      // Print receipt
      await printReceipt();
      
      // Update inventory
      await updateInventory();
      
      // Sync to server if online
      if (!isOffline) {
        await syncTransaction();
      } else {
        // Add to sync queue
        setSyncQueue(prev => [...prev, transactionData]);
      }
      
      // Reset for new transaction
      resetTransaction();
    } catch (error) {
      console.error('Transaction completion failed:', error);
    }
  }, [isOffline, transactionData]);

  const resetTransaction = useCallback(() => {
    setTransactionData({
      id: null,
      transactionNumber: '',
      transactionDate: new Date().toISOString().split('T')[0],
      customerId: null,
      customer: null,
      status: 'active',
      currency: 'USD',
    });
    
    setLineItems([]);
    setPayments([]);
    setPromotions([]);
    generateTransactionNumber();
  }, []);

  return (
    <div className="min-h-screen bg-neutralBg-50 flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-surface-200 p-4">
          <YourComplexTransactionHeader
            data={transactionData}
            customer={customer}
            onChange={setTransactionData}
            onCustomerSelect={handleCustomerSelect}
            hardwareStatus={hardwareStatus}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Product search sidebar */}
          <div className="w-80 bg-white border-r border-surface-200 p-4">
            <div className="mb-4">
              <Input
                placeholder="Search products or scan barcode..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              {/* Product search results */}
              {productSearchResults.map(product => (
                <div
                  key={product.id}
                  className="p-3 border border-surface-200 rounded-lg cursor-pointer hover:bg-surface-50"
                  onClick={() => addLineItem(product)}
                >
                  <div className="font-medium text-surface-900">{product.name}</div>
                  <div className="text-sm text-surface-500">{product.sku}</div>
                  <div className="text-sm font-medium text-primary-600">
                    ${pricingEngine.calculatePrice(product, customer).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line items */}
          <div className="flex-1 p-4">
            <YourComplexTransactionItems
              items={lineItems}
              onChange={setLineItems}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              promotions={promotions}
              onApplyPromotion={handleApplyPromotion}
            />
          </div>

          {/* Totals and actions */}
          <div className="w-80 bg-white border-l border-surface-200 p-4">
            <YourComplexTransactionTotals
              totals={totals}
              items={lineItems}
              customer={customer}
              promotions={promotions}
              currency={transactionData.currency}
            />
            
            <div className="mt-6 space-y-2">
              <Button
                onClick={() => setShowPaymentModal(true)}
                disabled={lineItems.length === 0}
                className="w-full"
              >
                Payment
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSuspend}
                disabled={transactionData.status !== 'active'}
                className="w-full"
              >
                Suspend
              </Button>
              
              <Button
                variant="accent"
                onClick={handleVoid}
                disabled={transactionData.status === 'voided'}
                className="w-full"
              >
                Void
              </Button>
            </div>
          </div>
        </div>

        {/* Payment modal */}
        {showPaymentModal && (
          <YourComplexTransactionPayments
            totals={totals}
            customer={customer}
            onPaymentComplete={handlePaymentComplete}
            onCancel={() => setShowPaymentModal(false)}
            processing={processingPayment}
            hardwareStatus={hardwareStatus}
          />
        )}

        {/* Offline indicator */}
        {isOffline && (
          <div className="fixed top-4 right-4 bg-warning-100 text-warning-800 px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58-9.92c.75-1.334-.213-2.98-1.742-3.486a2.5 2.5 0 00-2.829 0l-5.58 9.92a11.813 11.813 0 006.36 6.36c1.733 1.733 2.727 1.733 3.486 0l5.58-9.92c.75-1.334-.213-2.98-1.742-3.486a2.5 2.5 0 00-2.829 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Offline Mode</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourComplexTransaction;
```

### **Payment Processing Component**
```javascript
import React, { useState, useCallback } from 'react';

const YourComplexTransactionPayments = ({ 
  totals, 
  customer, 
  onPaymentComplete, 
  onCancel, 
  processing, 
  hardwareStatus 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState(totals.total);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handlePayment = useCallback(async () => {
    const paymentData = {
      method: paymentMethod,
      amount: paymentAmount,
      cardData: paymentMethod === 'card' ? cardData : null,
    };

    await onPaymentComplete(paymentData);
  }, [paymentMethod, paymentAmount, cardData, onPaymentComplete]);

  const handleCashPayment = useCallback(async () => {
    // Open cash drawer
    if (hardwareStatus.cashDrawer === 'connected') {
      await openCashDrawer();
    }
    
    await handlePayment();
  }, [hardwareStatus, handlePayment]);

  const handleCardPayment = useCallback(async () => {
    // Process card payment
    try {
      const result = await processCardPayment(cardData);
      if (result.success) {
        await handlePayment();
      }
    } catch (error) {
      console.error('Card payment failed:', error);
    }
  }, [cardData, handlePayment]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Payment</h3>
        
        <div className="mb-4">
          <div className="text-sm font-medium text-surface-700 mb-2">
            Amount Due: ${totals.total.toFixed(2)}
          </div>
          
          <Input
            type="number"
            step="0.01"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Payment Method
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 border rounded-lg ${
                paymentMethod === 'cash'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-surface-300 text-surface-700'
              }`}
            >
              Cash
            </button>
            
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border rounded-lg ${
                paymentMethod === 'card'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-surface-300 text-surface-700'
              }`}
            >
              Card
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Card Number
              </label>
              <Input
                value={cardData.number}
                onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Expiry
                </label>
                <Input
                  value={cardData.expiry}
                  onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                  placeholder="MM/YY"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  CVV
                </label>
                <Input
                  type="password"
                  value={cardData.cvv}
                  onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Name on Card
              </label>
              <Input
                value={cardData.name}
                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={processing}
          >
            Cancel
          </Button>
          
          <Button
            onClick={paymentMethod === 'cash' ? handleCashPayment : handleCardPayment}
            loading={processing}
            disabled={paymentAmount <= 0}
          >
            {processing ? 'Processing...' : `Pay $${paymentAmount.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default YourComplexTransactionPayments;
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```javascript
// YourComplexTransaction.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourComplexTransaction from './YourComplexTransaction';

describe('YourComplexTransaction', () => {
  test('renders POS interface', () => {
    render(<YourComplexTransaction />);
    expect(screen.getByText('Search products or scan barcode')).toBeInTheDocument();
  });

  test('handles barcode scanning', async () => {
    const mockBarcodeScanner = {
      onScan: jest.fn(),
    };
    
    render(<YourComplexTransaction barcodeScanner={mockBarcodeScanner} />);
    
    // Simulate barcode scan
    const barcodeEvent = new CustomEvent('barcode', { detail: '1234567890123' });
    window.dispatchEvent(barcodeEvent);
    
    await waitFor(() => {
      expect(mockBarcodeScanner.onScan).toHaveBeenCalledWith('1234567890123');
    });
  });

  test('processes payments correctly', async () => {
    render(<YourComplexTransaction />);
    
    // Add item to cart
    fireEvent.click(screen.getByText('Add Item'));
    
    // Go to payment
    fireEvent.click(screen.getByText('Payment'));
    
    // Select cash payment
    fireEvent.click(screen.getByText('Cash'));
    
    // Complete payment
    fireEvent.click(screen.getByText('Pay $10.00'));
    
    await waitFor(() => {
      expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    });
  });

  test('handles offline mode', async () => {
    render(<YourComplexTransaction isOffline={true} />);
    
    expect(screen.getByText('Offline Mode')).toBeInTheDocument();
    
    // Test offline functionality
    fireEvent.click(screen.getByText('Add Item'));
    fireEvent.click(screen.getByText('Payment'));
    
    // Should still work in offline mode
    expect(screen.getByText('Payment')).toBeInTheDocument();
  });
});
```

### **Integration Tests**
```javascript
describe('YourComplexTransaction Hardware Integration', () => {
  test('integrates with barcode scanner', async () => {
    const mockUsb = {
      getDevices: jest.fn().mockResolvedValue([
        { vendorId: '0x1234', productName: 'Barcode Scanner' }
      ]),
    };
    
    Object.defineProperty(navigator, 'usb', {
      value: mockUsb,
      writable: true,
    });

    render(<YourComplexTransaction />);
    
    await waitFor(() => {
      expect(mockUsb.getDevices).toHaveBeenCalled();
    });
  });

  test('integrates with receipt printer', async () => {
    const mockPrint = jest.fn();
    window.print = mockPrint;

    render(<YourComplexTransaction />);
    
    // Complete a transaction
    fireEvent.click(screen.getByText('Add Item'));
    fireEvent.click(screen.getByText('Payment'));
    fireEvent.click(screen.getByText('Pay $10.00'));
    
    await waitFor(() => {
      expect(mockPrint).toHaveBeenCalled();
    });
  });
});
```

---

## 🔧 **Customization Guide**

### **Adding New Payment Methods**
```javascript
// Add new payment method to payment processing
const paymentMethods = {
  cash: { /* existing */ },
  card: { /* existing */ },
  mobile: {
    name: 'Mobile Payment',
    icon: 'smartphone',
    process: async (data) => {
      // Mobile payment processing logic
      return await processMobilePayment(data);
    },
  },
  gift_card: {
    name: 'Gift Card',
    icon: 'credit-card',
    process: async (data) => {
      // Gift card processing logic
      return await processGiftCardPayment(data);
    },
  },
};
```

### **Adding New Hardware Integration**
```javascript
// hardwareIntegration/newDevice.js
export class NewDevice {
  constructor() {
    this.device = null;
    this.connected = false;
  }

  async connect() {
    // Device connection logic
    this.device = await this.findDevice();
    this.connected = true;
  }

  async process(data) {
    // Device processing logic
    return await this.device.send(data);
  }
}
```

---

## 📊 **Performance Considerations**

### **Optimization Techniques**
- **Real-time Processing**: Sub-second response times
- **Hardware Caching**: Cache hardware status and responses
- **Offline Optimization**: Efficient local storage and sync
- **Memory Management**: Prevent memory leaks in long-running POS
- **Network Optimization**: Efficient API calls and batching

### **Example Optimization**
```javascript
import React, { memo, useMemo, useCallback } from 'react';

const YourComplexTransactionItems = memo(({ items, onChange }) => {
  const optimizedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      calculatedPrice: calculateOptimizedPrice(item),
    }));
  }, [items]);

  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    // Optimized quantity change handler
    onChange(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  }, [onChange]);

  return (
    <div>
      {optimizedItems.map(item => (
        <TransactionItem
          key={item.id}
          item={item}
          onQuantityChange={handleQuantityChange}
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
cp -r templates/TXN_TEMPLATE_03 YourComplexTransaction
```

### **Step 2: Rename Files**
```bash
# Rename all files following the naming convention
mv PurchaseOrder.jsx YourComplexTransaction.jsx
mv PurchaseOrderHeader.jsx YourComplexTransactionHeader.jsx
# ... etc
```

### **Step 3: Update Content**
1. Replace "Purchase Order" with your transaction name
2. Update hardware integration for your specific devices
3. Customize payment methods and processors
4. Adjust tax calculations for your jurisdiction
5. Update promotion engine logic

### **Step 4: Test Integration**
1. Import and use in your main app
2. Test hardware integration
3. Verify payment processing
4. Check offline functionality
5. Test real-time performance

---

## 📚 **Related Documentation**

- **Design Tokens**: `../tokens/designTokens.js`
- **Component Library**: `COMPONENT_LIBRARY.md`
- **State Patterns**: `STATE_PATTERNS.md`
- **TXN_TEMPLATE_02**: `TXN_TEMPLATE_02.md`
- **MST_TEMPLATE_03**: `MST_TEMPLATE_03.md`
