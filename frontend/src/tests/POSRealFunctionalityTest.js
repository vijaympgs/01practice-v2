/**
 * OptiMind Retail™ POS System - Real Functionality Test
 * 
 * Test what's actually working in the POS system
 */

import indexedDBManager from '../services/IndexedDBManager';
import productManager from '../services/ProductManager';
import transactionManager from '../services/TransactionManager';

class POSRealFunctionalityTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: [],
      details: []
    };
  }

  /**
   * Run real functionality tests
   */
  async runRealFunctionalityTests() {
    console.log('🧪 Starting Real POS Functionality Tests...');

    try {
      // Test 1: IndexedDB Real Operations
      await this.testIndexedDBRealOperations();
      
      // Test 2: Product Manager Real Operations
      await this.testProductManagerRealOperations();
      
      // Test 3: Transaction Manager Real Operations
      await this.testTransactionManagerRealOperations();
      
      // Test 4: Data Persistence Real Test
      await this.testDataPersistenceReal();
      
      // Test 5: Search Functionality
      await this.testSearchFunctionality();
      
      this.printTestResults();

    } catch (error) {
      console.error('❌ Real functionality tests failed:', error);
      this.testResults.errors.push(error.message);
    }
  }

  /**
   * Test IndexedDB real operations
   */
  async testIndexedDBRealOperations() {
    console.log('🔧 Testing IndexedDB real operations...');
    
    try {
      // Initialize
      await indexedDBManager.initialize();
      
      // Test adding real data
      const realProductId = `real_product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const realProduct = {
        id: realProductId,
        name: 'Real Test Product',
        price: 25.99,
        cost: 15.99,
        category: 'Electronics',
        barcode: '1234567890123',
        isActive: true,
        createdAt: new Date(),
        lastUpdated: new Date()
      };

      await indexedDBManager.upsert('products', realProduct);
      
      // Test retrieving real data
      const retrievedProduct = await indexedDBManager.get('products', realProductId);
      
      if (!retrievedProduct || retrievedProduct.name !== realProduct.name) {
        throw new Error('IndexedDB real operations failed');
      }

      this.testResults.passed++;
      this.testResults.details.push('✅ IndexedDB real operations working');
      console.log('✅ IndexedDB real operations test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`IndexedDB real operations failed: ${error.message}`);
      this.testResults.details.push('❌ IndexedDB real operations failed');
      console.error('❌ IndexedDB real operations test failed:', error);
    }
  }

  /**
   * Test Product Manager real operations
   */
  async testProductManagerRealOperations() {
    console.log('📦 Testing Product Manager real operations...');
    
    try {
      // Initialize product manager
      await productManager.initialize();
      
      // Test adding real product
      const pmProductId = `pm_real_product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const realProduct = {
        id: pmProductId,
        name: 'Product Manager Test Product',
        price: 19.99,
        cost: 12.99,
        category: 'Books',
        barcode: '9876543210987',
        isActive: true
      };

      await productManager.addProduct(realProduct);
      
      // Test retrieving product
      const retrievedProduct = await productManager.getProduct(pmProductId);
      
      if (!retrievedProduct || retrievedProduct.name !== realProduct.name) {
        throw new Error('Product Manager real operations failed');
      }

      this.testResults.passed++;
      this.testResults.details.push('✅ Product Manager real operations working');
      console.log('✅ Product Manager real operations test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`Product Manager real operations failed: ${error.message}`);
      this.testResults.details.push('❌ Product Manager real operations failed');
      console.error('❌ Product Manager real operations test failed:', error);
    }
  }

  /**
   * Test Transaction Manager real operations
   */
  async testTransactionManagerRealOperations() {
    console.log('💰 Testing Transaction Manager real operations...');
    
    try {
      // Initialize transaction manager
      await transactionManager.initialize();
      
      // Create a test product ID for the transaction
      const testProductId = `tm_test_product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Test creating real transaction
      const tmTransactionId = `tm_real_transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const realTransaction = {
        id: tmTransactionId,
        items: [{
          productId: testProductId,
          quantity: 3,
          price: 19.99,
          total: 59.97
        }],
        total: 59.97,
        status: 'completed',
        timestamp: new Date(),
        customer: {
          id: 'test_customer_1',
          name: 'Test Customer'
        }
      };

      await transactionManager.createTransaction(realTransaction);
      
      // Test retrieving transaction
      const retrievedTransaction = await transactionManager.getTransaction(tmTransactionId);
      
      if (!retrievedTransaction || retrievedTransaction.total !== realTransaction.total) {
        throw new Error('Transaction Manager real operations failed');
      }

      this.testResults.passed++;
      this.testResults.details.push('✅ Transaction Manager real operations working');
      console.log('✅ Transaction Manager real operations test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`Transaction Manager real operations failed: ${error.message}`);
      this.testResults.details.push('❌ Transaction Manager real operations failed');
      console.error('❌ Transaction Manager real operations test failed:', error);
    }
  }

  /**
   * Test data persistence real
   */
  async testDataPersistenceReal() {
    console.log('💾 Testing data persistence real...');
    
    try {
      // Get all products
      const products = await indexedDBManager.getAll('products');
      
      // Get all transactions
      const transactions = await indexedDBManager.getAll('transactions');
      
      console.log(`📊 Found ${products.length} products and ${transactions.length} transactions`);
      
      if (products.length === 0 && transactions.length === 0) {
        throw new Error('No data found in IndexedDB');
      }

      this.testResults.passed++;
      this.testResults.details.push(`✅ Data persistence working - ${products.length} products, ${transactions.length} transactions`);
      console.log('✅ Data persistence real test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`Data persistence real failed: ${error.message}`);
      this.testResults.details.push('❌ Data persistence real failed');
      console.error('❌ Data persistence real test failed:', error);
    }
  }

  /**
   * Test search functionality
   */
  async testSearchFunctionality() {
    console.log('🔍 Testing search functionality...');
    
    try {
      // Test product search
      const searchResults = await productManager.searchProducts('Test');
      
      if (!Array.isArray(searchResults)) {
        throw new Error('Search functionality failed');
      }

      this.testResults.passed++;
      this.testResults.details.push(`✅ Search functionality working - found ${searchResults.length} results`);
      console.log('✅ Search functionality test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`Search functionality failed: ${error.message}`);
      this.testResults.details.push('❌ Search functionality failed');
      console.error('❌ Search functionality test failed:', error);
    }
  }

  /**
   * Print test results
   */
  printTestResults() {
    const totalTests = this.testResults.passed + this.testResults.failed;
    const successRate = (this.testResults.passed / totalTests) * 100;

    console.log('\n🧪 REAL FUNCTIONALITY TEST RESULTS');
    console.log('=====================================');
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`📊 Success Rate: ${successRate.toFixed(2)}%`);
    
    console.log('\n📋 DETAILED RESULTS:');
    this.testResults.details.forEach((detail, index) => {
      console.log(`${index + 1}. ${detail}`);
    });
    
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (successRate === 100) {
      console.log('\n🎉 ALL REAL FUNCTIONALITY TESTS PASSED! POS system is actually working!');
    } else {
      console.log('\n⚠️ Some tests failed. Please review the errors above.');
    }
  }

  /**
   * Clean up test data
   */
  async cleanup() {
    try {
      await indexedDBManager.clearStore('products');
      await indexedDBManager.clearStore('transactions');
      console.log('🧹 Test data cleaned up');
    } catch (error) {
      console.error('❌ Failed to cleanup test data:', error);
    }
  }
}

// Export test runner
export default POSRealFunctionalityTest;
