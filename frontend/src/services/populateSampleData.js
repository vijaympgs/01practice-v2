/**
 * Script to populate the IndexedDB with sample data for testing
 */

import indexedDBManager from './IndexedDBManager';
import productManager from './ProductManager';
import { sampleProducts } from './sampleData';

export const populateSampleData = async () => {
  try {
    console.log('🚀 Starting to populate sample data...');
    
    // Initialize managers
    await indexedDBManager.initialize();
    await productManager.initialize();
    
    // Clear existing data (optional - for clean testing)
    // await indexedDBManager.clearStore('products');
    // await indexedDBManager.clearStore('inventory');
    
    // Add sample products
    let addedCount = 0;
    for (const productData of sampleProducts) {
      try {
        await productManager.addProduct(productData);
        addedCount++;
        console.log(`✅ Added product: ${productData.name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to add product ${productData.name}:`, error.message);
      }
    }
    
    console.log(`🎉 Sample data population complete! Added ${addedCount} products.`);
    
    // Get statistics
    const stats = await productManager.getProductStats();
    console.log('📊 Product Statistics:', stats);
    
    return {
      success: true,
      addedCount,
      stats
    };
    
  } catch (error) {
    console.error('❌ Failed to populate sample data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Auto-populate when this module is imported (for development)
if (process.env.NODE_ENV === 'development') {
  // Only populate if no products exist
  indexedDBManager.initialize().then(async () => {
    const existingProducts = await indexedDBManager.getAll('products');
    if (existingProducts.length === 0) {
      console.log('🔄 No products found, populating sample data...');
      await populateSampleData();
    } else {
      console.log(`📦 Found ${existingProducts.length} existing products, skipping sample data population.`);
    }
  }).catch(error => {
    console.error('❌ Failed to check existing products:', error);
  });
}
