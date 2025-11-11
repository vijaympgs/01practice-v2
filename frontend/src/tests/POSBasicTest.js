/**
 * OptiMind Retail™ POS System - Basic Functionality Test
 * 
 * Simple test to verify basic POS functionality is working
 */

import indexedDBManager from '../services/IndexedDBManager';
import productManager from '../services/ProductManager';
import transactionManager from '../services/TransactionManager';

class POSBasicTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Run basic functionality tests
   */
  async runBasicTests() {
    console.log('🧪 Starting Basic POS Functionality Tests...');

    try {
      // Test 1: IndexedDB Initialization
      await this.testIndexedDBInitialization();
      
      // Test 2: Product Management
      await this.testProductManagement();
      
      // Test 3: Transaction Management
      await this.testTransactionManagement();
      
      // Test 4: Data Persistence
      await this.testDataPersistence();
      
      this.printTestResults();

    } catch (error) {
      console.error('❌ Basic tests failed:', error);
      this.testResults.errors.push(error.message);
    }
  }

  /**
   * Test IndexedDB initialization
   */
  async testIndexedDBInitialization() {
    console.log('🔧 Testing IndexedDB initialization...');
    
    try {
      await indexedDBManager.initialize();
      this.testResults.passed++;
      console.log('✅ IndexedDB initialization test passed');
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`IndexedDB initialization failed: ${error.message}`);
      console.error('❌ IndexedDB initialization test failed:', error);
    }
  }

  /**
   * Test product management
   */
  async testProductManagement() {
    console.log('📦 Testing product management...');
    
    try {
      // Create a test product
      const testProduct = {
        id: 'test_product_1',
        name: 'Test Product',
        price: 10.99,
        cost: 5.99,
        category: 'Test Category',
        barcode: '1234567890123',
        isActive: true
      };

      // Add product
      await productManager.addProduct(testProduct);
      
      // Retrieve product
      const retrievedProduct = await productManager.getProduct(testProduct.id);
      
      if (!retrievedProduct || retrievedProduct.name !== testProduct.name) {
        throw new Error('Product management failed');
      }

      this.testResults.passed++;
      console.log('✅ Product management test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`Product management failed: ${error.message}`);
      console.error('❌ Product management test failed:', error);
    }
  }

  /**
   * Test transaction management
   */
  async testTransactionManagement() {
    console.log('💰 Testing transaction management...');
    
    try {
      // Create a test transaction
      const testTransaction = {
        id: 'test_transaction_1',
        items: [{
          productId: 'test_product_1',
          quantity: 2,
          price: 10.99,
          total: 21.98
        }],
        total: 21.98,
        status: 'pending',
        timestamp: new Date()
      };

      // Create transaction
      await transactionManager.createTransaction(testTransaction);
      
      // Retrieve transaction
      const retrievedTransaction = await transactionManager.getTransaction(testTransaction.id);
      
      if (!retrievedTransaction || retrievedTransaction.total !== testTransaction.total) {
        throw new Error('Transaction management failed');
      }

      this.testResults.passed++;
      console.log('✅ Transaction management test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`Transaction management failed: ${error.message}`);
      console.error('❌ Transaction management test failed:', error);
    }
  }

  /**
   * Test data persistence
   */
  async testDataPersistence() {
    console.log('💾 Testing data persistence...');
    
    try {
      // Get all products
      const products = await indexedDBManager.getAll('products');
      
      // Get all transactions
      const transactions = await indexedDBManager.getAll('transactions');
      
      if (products.length === 0 || transactions.length === 0) {
        throw new Error('Data persistence failed');
      }

      this.testResults.passed++;
      console.log('✅ Data persistence test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`Data persistence failed: ${error.message}`);
      console.error('❌ Data persistence test failed:', error);
    }
  }

  /**
   * Print test results
   */
  printTestResults() {
    const totalTests = this.testResults.passed + this.testResults.failed;
    const successRate = (this.testResults.passed / totalTests) * 100;

    console.log('\n🧪 BASIC FUNCTIONALITY TEST RESULTS');
    console.log('=====================================');
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`📊 Success Rate: ${successRate.toFixed(2)}%`);
    
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (successRate === 100) {
      console.log('\n🎉 ALL BASIC TESTS PASSED! POS system is functioning correctly!');
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
export default POSBasicTest;
