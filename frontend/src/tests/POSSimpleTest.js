/**
 * OptiMind Retail™ POS System - Simple Test
 * 
 * Simple test to debug basic functionality
 */

import indexedDBManager from '../services/IndexedDBManager';

class POSSimpleTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Run simple tests
   */
  async runSimpleTests() {
    console.log('🧪 Starting Simple POS Tests...');

    try {
      // Test 1: IndexedDB Initialization
      await this.testIndexedDBInitialization();
      
      // Test 2: Basic Data Operations
      await this.testBasicDataOperations();
      
      this.printTestResults();

    } catch (error) {
      console.error('❌ Simple tests failed:', error);
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
   * Test basic data operations
   */
  async testBasicDataOperations() {
    console.log('💾 Testing basic data operations...');
    
    try {
      // Test adding data
      const testData = {
        id: 'test_1',
        name: 'Test Item',
        value: 100
      };

      await indexedDBManager.add('products', testData);
      
      // Test retrieving data
      const retrievedData = await indexedDBManager.get('products', 'test_1');
      
      if (!retrievedData || retrievedData.name !== testData.name) {
        throw new Error('Basic data operations failed');
      }

      this.testResults.passed++;
      console.log('✅ Basic data operations test passed');
      
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`Basic data operations failed: ${error.message}`);
      console.error('❌ Basic data operations test failed:', error);
    }
  }

  /**
   * Print test results
   */
  printTestResults() {
    const totalTests = this.testResults.passed + this.testResults.failed;
    const successRate = (this.testResults.passed / totalTests) * 100;

    console.log('\n🧪 SIMPLE TEST RESULTS');
    console.log('========================');
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
      console.log('\n🎉 ALL SIMPLE TESTS PASSED!');
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
      console.log('🧹 Test data cleaned up');
    } catch (error) {
      console.error('❌ Failed to cleanup test data:', error);
    }
  }
}

// Export test runner
export default POSSimpleTest;
