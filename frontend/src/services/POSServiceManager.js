/**
 * POS Service Manager - Unified service layer for POS operations
 * Handles both online and offline modes seamlessly
 */

class POSServiceManager {
  constructor(embeddedDB) {
    this.embeddedDB = embeddedDB;
    this.isInitialized = false;
    this.currentTransaction = null;
    this.currentCart = [];
    this.currentShift = null;
    this.currentCashDrawer = null;
    
    // Configuration
    this.config = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.17:8000/api',
      timeout: 5000,
      retryAttempts: 3,
      retryDelay: 1000
    };
  }

  /**
   * Initialize the POS service manager
   */
  async initialize() {
    try {
      console.log('🔄 Initializing POS Service Manager...');
      
      // Load current shift if exists
      await this.loadCurrentShift();
      
      // Load current cash drawer if exists
      await this.loadCurrentCashDrawer();
      
      this.isInitialized = true;
      console.log('✅ POS Service Manager initialized');
    } catch (error) {
      console.error('❌ POS Service Manager initialization failed:', error);
      throw error;
    }
  }

  /**
   * Check if online mode is available
   */
  async isOnlineModeAvailable() {
    try {
      if (!navigator.onLine) return false;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(`${this.config.apiBaseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Start new transaction
   */
  async startTransaction(operatorId, sessionId) {
    try {
      const transaction = {
        id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        operatorId,
        sessionId,
        timestamp: new Date(),
        status: 'in_progress',
        items: [],
        customer: null,
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        payments: [],
        totalPaid: 0,
        change: 0,
        notes: '',
        suspendedAt: null,
        completedAt: null,
        syncStatus: 'pending'
      };

      this.currentTransaction = transaction;
      this.currentCart = [];

      // Save to embedded DB
      await this.embeddedDB.add('transactions', transaction);

      console.log('✅ Transaction started:', transaction.id);
      return transaction;
    } catch (error) {
      console.error('❌ Failed to start transaction:', error);
      throw error;
    }
  }

  /**
   * Add product to cart
   */
  async addProductToCart(product, quantity = 1) {
    if (!this.currentTransaction) {
      throw new Error('No active transaction. Please start a transaction first.');
    }

    try {
      // Check if product already exists in cart
      const existingItem = this.currentCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        // Add new item
        const cartItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          total: product.price * quantity,
          taxRate: product.taxRate || 0,
          barcode: product.barcode,
          category: product.category,
          cost: product.cost || 0
        };
        
        this.currentCart.push(cartItem);
      }

      // Update transaction totals
      await this.updateTransactionTotals();

      console.log(`✅ Added ${product.name} to cart`);
      return this.currentCart;
    } catch (error) {
      console.error('❌ Failed to add product to cart:', error);
      throw error;
    }
  }

  /**
   * Update product quantity in cart
   */
  async updateProductQuantity(productId, newQuantity) {
    if (!this.currentTransaction) {
      throw new Error('No active transaction.');
    }

    try {
      const item = this.currentCart.find(item => item.productId === productId);
      if (item) {
        if (newQuantity <= 0) {
          await this.removeProductFromCart(productId);
        } else {
          item.quantity = newQuantity;
          item.total = item.quantity * item.price;
          await this.updateTransactionTotals();
        }
      }

      return this.currentCart;
    } catch (error) {
      console.error('❌ Failed to update quantity:', error);
      throw error;
    }
  }

  /**
   * Remove product from cart
   */
  async removeProductFromCart(productId) {
    if (!this.currentTransaction) {
      throw new Error('No active transaction.');
    }

    try {
      this.currentCart = this.currentCart.filter(item => item.productId !== productId);
      await this.updateTransactionTotals();

      console.log('✅ Product removed from cart');
      return this.currentCart;
    } catch (error) {
      console.error('❌ Failed to remove product from cart:', error);
      throw error;
    }
  }

  /**
   * Update transaction totals
   */
  async updateTransactionTotals() {
    if (!this.currentTransaction) return;

    try {
      // Calculate subtotal
      const subtotal = this.currentCart.reduce((sum, item) => sum + item.total, 0);
      
      // Calculate tax
      const tax = this.currentCart.reduce((sum, item) => {
        return sum + (item.total * (item.taxRate || 0) / 100);
      }, 0);

      // Apply discount if any
      const discount = this.currentTransaction.discount || 0;
      
      // Calculate total
      const total = subtotal + tax - discount;

      // Update transaction
      this.currentTransaction.subtotal = subtotal;
      this.currentTransaction.tax = tax;
      this.currentTransaction.total = total;
      this.currentTransaction.items = [...this.currentCart];

      // Update in embedded DB
      await this.embeddedDB.update('transactions', this.currentTransaction);

      return this.currentTransaction;
    } catch (error) {
      console.error('❌ Failed to update transaction totals:', error);
      throw error;
    }
  }

  /**
   * Add payment to transaction
   */
  async addPayment(paymentMethod, amount, reference = null) {
    if (!this.currentTransaction) {
      throw new Error('No active transaction.');
    }

    try {
      const payment = {
        id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        method: paymentMethod, // 'cash', 'card', 'digital', 'voucher'
        amount: parseFloat(amount),
        reference,
        timestamp: new Date()
      };

      this.currentTransaction.payments.push(payment);
      this.currentTransaction.totalPaid = this.currentTransaction.payments.reduce(
        (sum, payment) => sum + payment.amount, 0
      );
      this.currentTransaction.change = this.currentTransaction.totalPaid - this.currentTransaction.total;

      // Update in embedded DB
      await this.embeddedDB.update('transactions', this.currentTransaction);

      console.log(`✅ Payment added: ${paymentMethod} - $${amount}`);
      return this.currentTransaction;
    } catch (error) {
      console.error('❌ Failed to add payment:', error);
      throw error;
    }
  }

  /**
   * Complete transaction
   */
  async completeTransaction() {
    if (!this.currentTransaction || this.currentCart.length === 0) {
      throw new Error('No transaction to complete.');
    }

    try {
      // Check if fully paid
      if (this.currentTransaction.totalPaid < this.currentTransaction.total) {
        throw new Error(`Transaction not fully paid. Outstanding: $${(this.currentTransaction.total - this.currentTransaction.totalPaid).toFixed(2)}`);
      }

      // Finalize transaction
      this.currentTransaction.status = 'completed';
      this.currentTransaction.completedAt = new Date();
      this.currentTransaction.syncStatus = 'pending';

      // Update inventory
      await this.updateInventory();

      // Save final transaction
      await this.embeddedDB.update('transactions', this.currentTransaction);

      // Add to sync queue
      await this.embeddedDB.addToSyncQueue(
        'transaction',
        this.currentTransaction.id,
        'create',
        this.currentTransaction,
        1
      );

      // Generate receipt
      await this.generateReceipt();

      console.log('✅ Transaction completed:', this.currentTransaction.id);

      // Clear current transaction
      const completedTransaction = { ...this.currentTransaction };
      this.currentTransaction = null;
      this.currentCart = [];

      return completedTransaction;
    } catch (error) {
      console.error('❌ Failed to complete transaction:', error);
      throw error;
    }
  }

  /**
   * Suspend transaction
   */
  async suspendTransaction() {
    if (!this.currentTransaction) {
      throw new Error('No transaction to suspend.');
    }

    try {
      this.currentTransaction.status = 'suspended';
      this.currentTransaction.suspendedAt = new Date();
      this.currentTransaction.syncStatus = 'pending';

      await this.embeddedDB.update('transactions', this.currentTransaction);

      console.log('✅ Transaction suspended:', this.currentTransaction.id);

      // Clear current transaction
      const suspendedTransaction = { ...this.currentTransaction };
      this.currentTransaction = null;
      this.currentCart = [];

      return suspendedTransaction;
    } catch (error) {
      console.error('❌ Failed to suspend transaction:', error);
      throw error;
    }
  }

  /**
   * Update inventory levels
   */
  async updateInventory() {
    try {
      for (const item of this.currentCart) {
        // Get current inventory
        const inventory = await this.embeddedDB.getByIndex('inventory', 'productId', item.productId);
        
        if (inventory) {
          // Update stock
          inventory.currentStock -= item.quantity;
          inventory.lastUpdated = new Date();
          
          await this.embeddedDB.update('inventory', inventory);
          
          // Add to sync queue
          await this.embeddedDB.addToSyncQueue(
            'inventory',
            inventory.id,
            'update',
            inventory,
            2
          );
        }
      }
    } catch (error) {
      console.error('❌ Failed to update inventory:', error);
      throw error;
    }
  }

  /**
   * Generate receipt
   */
  async generateReceipt() {
    try {
      const receipt = {
        id: `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        transactionId: this.currentTransaction.id,
        timestamp: new Date(),
        content: this.formatReceiptContent(),
        status: 'pending',
        printStatus: 'pending',
        emailStatus: 'pending'
      };

      await this.embeddedDB.add('receipts', receipt);
      
      console.log('✅ Receipt generated:', receipt.id);
      return receipt;
    } catch (error) {
      console.error('❌ Failed to generate receipt:', error);
      throw error;
    }
  }

  /**
   * Format receipt content
   */
  formatReceiptContent() {
    const transaction = this.currentTransaction;
    const storeInfo = {
      name: 'OptiMind Retail Store',
      address: '123 Business St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'store@optimind-retail.com'
    };

    return {
      header: {
        storeName: storeInfo.name,
        address: storeInfo.address,
        phone: storeInfo.phone,
        email: storeInfo.email,
        receiptNumber: transaction.id,
        date: transaction.timestamp.toLocaleDateString(),
        time: transaction.timestamp.toLocaleTimeString()
      },
      items: this.currentCart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      totals: {
        subtotal: transaction.subtotal,
        tax: transaction.tax,
        discount: transaction.discount,
        total: transaction.total,
        paid: transaction.totalPaid,
        change: transaction.change
      },
      payments: transaction.payments,
      footer: {
        thankYou: 'Thank you for your business!',
        returnPolicy: 'Returns accepted within 30 days with receipt'
      }
    };
  }

  /**
   * Load current shift
   */
  async loadCurrentShift() {
    try {
      const shifts = await this.embeddedDB.getAll('shifts', shift => 
        shift.status === 'active'
      );
      
      if (shifts.length > 0) {
        this.currentShift = shifts[0];
        console.log('✅ Current shift loaded:', this.currentShift.id);
      }
    } catch (error) {
      console.error('❌ Failed to load current shift:', error);
    }
  }

  /**
   * Start new shift
   */
  async startShift(operatorId, openingCash = 0) {
    try {
      const shift = {
        id: `SHIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        operatorId,
        startTime: new Date(),
        endTime: null,
        openingCash,
        closingCash: null,
        totalSales: 0,
        totalTransactions: 0,
        status: 'active',
        syncStatus: 'pending'
      };

      await this.embeddedDB.add('shifts', shift);
      this.currentShift = shift;

      // Start cash drawer
      await this.startCashDrawer(shift.id, openingCash);

      console.log('✅ Shift started:', shift.id);
      return shift;
    } catch (error) {
      console.error('❌ Failed to start shift:', error);
      throw error;
    }
  }

  /**
   * End current shift
   */
  async endShift(closingCash) {
    if (!this.currentShift) {
      throw new Error('No active shift to end.');
    }

    try {
      this.currentShift.endTime = new Date();
      this.currentShift.closingCash = closingCash;
      this.currentShift.status = 'completed';
      this.currentShift.syncStatus = 'pending';

      await this.embeddedDB.update('shifts', this.currentShift);

      // End cash drawer
      await this.endCashDrawer(closingCash);

      console.log('✅ Shift ended:', this.currentShift.id);

      // Add to sync queue
      await this.embeddedDB.addToSyncQueue(
        'shift',
        this.currentShift.id,
        'update',
        this.currentShift,
        1
      );

      const completedShift = { ...this.currentShift };
      this.currentShift = null;

      return completedShift;
    } catch (error) {
      console.error('❌ Failed to end shift:', error);
      throw error;
    }
  }

  /**
   * Load current cash drawer
   */
  async loadCurrentCashDrawer() {
    try {
      if (this.currentShift) {
        const drawers = await this.embeddedDB.getAll('cashDrawer', drawer => 
          drawer.shiftId === this.currentShift.id && drawer.status === 'open'
        );
        
        if (drawers.length > 0) {
          this.currentCashDrawer = drawers[0];
          console.log('✅ Current cash drawer loaded:', this.currentCashDrawer.id);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load current cash drawer:', error);
    }
  }

  /**
   * Start cash drawer
   */
  async startCashDrawer(shiftId, openingCash = 0) {
    try {
      const cashDrawer = {
        id: `DRAWER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        shiftId,
        openingCash,
        currentCash: openingCash,
        status: 'open',
        operations: [],
        timestamp: new Date(),
        syncStatus: 'pending'
      };

      await this.embeddedDB.add('cashDrawer', cashDrawer);
      this.currentCashDrawer = cashDrawer;

      console.log('✅ Cash drawer opened:', cashDrawer.id);
      return cashDrawer;
    } catch (error) {
      console.error('❌ Failed to start cash drawer:', error);
      throw error;
    }
  }

  /**
   * End cash drawer
   */
  async endCashDrawer(closingCash) {
    if (!this.currentCashDrawer) {
      throw new Error('No active cash drawer to close.');
    }

    try {
      this.currentCashDrawer.closingCash = closingCash;
      this.currentCashDrawer.status = 'closed';
      this.currentCashDrawer.syncStatus = 'pending';

      await this.embeddedDB.update('cashDrawer', this.currentCashDrawer);

      console.log('✅ Cash drawer closed:', this.currentCashDrawer.id);

      // Add to sync queue
      await this.embeddedDB.addToSyncQueue(
        'cashDrawer',
        this.currentCashDrawer.id,
        'update',
        this.currentCashDrawer,
        1
      );

      const completedDrawer = { ...this.currentCashDrawer };
      this.currentCashDrawer = null;

      return completedDrawer;
    } catch (error) {
      console.error('❌ Failed to end cash drawer:', error);
      throw error;
    }
  }

  /**
   * Get current cart
   */
  getCurrentCart() {
    return this.currentCart;
  }

  /**
   * Get current transaction
   */
  getCurrentTransaction() {
    return this.currentTransaction;
  }

  /**
   * Get current shift
   */
  getCurrentShift() {
    return this.currentShift;
  }

  /**
   * Get current cash drawer
   */
  getCurrentCashDrawer() {
    return this.currentCashDrawer;
  }

  /**
   * Search products
   */
  async searchProducts(query) {
    try {
      const products = await this.embeddedDB.getAll('products', product => 
        product.isActive && (
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.barcode.includes(query) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
      );

      return products;
    } catch (error) {
      console.error('❌ Failed to search products:', error);
      throw error;
    }
  }

  /**
   * Get product by barcode
   */
  async getProductByBarcode(barcode) {
    try {
      return await this.embeddedDB.getByIndex('products', 'barcode', barcode);
    } catch (error) {
      console.error('❌ Failed to get product by barcode:', error);
      throw error;
    }
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats() {
    try {
      const transactions = await this.embeddedDB.getAll('transactions');
      
      const stats = {
        total: transactions.length,
        completed: transactions.filter(t => t.status === 'completed').length,
        suspended: transactions.filter(t => t.status === 'suspended').length,
        totalRevenue: transactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + t.total, 0),
        averageTransaction: 0
      };

      if (stats.completed > 0) {
        stats.averageTransaction = stats.totalRevenue / stats.completed;
      }

      return stats;
    } catch (error) {
      console.error('❌ Failed to get transaction stats:', error);
      throw error;
    }
  }
}

export default POSServiceManager;
