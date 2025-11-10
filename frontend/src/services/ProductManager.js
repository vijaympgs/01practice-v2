/**
 * OptiMind Retail™ POS System - Product Manager
 * 
 * Handles product catalog operations:
 * - Product search and retrieval
 * - Barcode scanning
 * - Category management
 * - Inventory integration
 * - Master data replication ready
 */

import indexedDBManager from './IndexedDBManager.js';

class ProductManager {
  constructor() {
    this.categories = [];
    this.searchCache = new Map();
  }

  /**
   * Initialize product manager
   */
  async initialize() {
    await indexedDBManager.initialize();
    console.log('✅ Product Manager initialized');
  }

  /**
   * Add product to catalog
   */
  async addProduct(productData) {
    const product = {
      id: productData.id || this.generateProductId(),
      name: productData.name,
      description: productData.description || '',
      sku: productData.sku || '',
      barcode: productData.barcode || '',
      category: productData.category || 'General',
      price: parseFloat(productData.price) || 0,
      cost: parseFloat(productData.cost) || 0,
      taxRate: parseFloat(productData.taxRate) || 0,
      inventory: {
        current: parseInt(productData.currentStock) || 0,
        reserved: 0,
        minLevel: parseInt(productData.minLevel) || 0,
        maxLevel: parseInt(productData.maxLevel) || 1000
      },
      images: productData.images || [],
      attributes: productData.attributes || {},
      isActive: productData.isActive !== false,
      createdAt: new Date(),
      lastUpdated: new Date(),
      syncStatus: 'pending'
    };

    // Save to IndexedDB
      await indexedDBManager.upsert('products', product);

    // Create inventory record
    await this.createInventoryRecord(product);

    // Add to sync queue for head office
    await indexedDBManager.addToSyncQueue(
      'product',
      product.id,
      'create',
      product,
      60 // Medium priority for products
    );

    console.log('✅ Product added:', product.name);
    return product;
  }

  /**
   * Update existing product
   */
  async updateProduct(productId, updateData) {
    const existingProduct = await indexedDBManager.get('products', productId);
    
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const updatedProduct = {
      ...existingProduct,
      ...updateData,
      lastUpdated: new Date(),
      syncStatus: 'pending'
    };

    // Save to IndexedDB
    await indexedDBManager.update('products', updatedProduct);

    // Update inventory if stock changed
    if (updateData.currentStock !== undefined) {
      await this.updateInventoryLevel(productId, updateData.currentStock);
    }

    // Add to sync queue
    await indexedDBManager.addToSyncQueue(
      'product',
      productId,
      'update',
      updatedProduct,
      60
    );

    console.log('✅ Product updated:', updatedProduct.name);
    return updatedProduct;
  }

  /**
   * Get product by ID
   */
  async getProduct(productId) {
    return await indexedDBManager.get('products', productId);
  }

  /**
   * Get product by barcode
   */
  async getProductByBarcode(barcode) {
    return await indexedDBManager.getProductByBarcode(barcode);
  }

  /**
   * Search products by name
   */
  async searchProducts(query, options = {}) {
    const {
      category = null,
      activeOnly = true,
      limit = 50
    } = options;

    // Check cache first
    const cacheKey = `${query}_${category}_${activeOnly}_${limit}`;
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey);
    }

    const results = await indexedDBManager.searchProducts(query);
    
    // Apply filters
    let filteredResults = results;
    
    if (activeOnly) {
      filteredResults = filteredResults.filter(product => product.isActive);
    }
    
    if (category) {
      filteredResults = filteredResults.filter(product => product.category === category);
    }

    // Limit results
    const limitedResults = filteredResults.slice(0, limit);

    // Cache results for 5 minutes
    this.searchCache.set(cacheKey, limitedResults);
    setTimeout(() => this.searchCache.delete(cacheKey), 5 * 60 * 1000);

    return limitedResults;
  }

  /**
   * Get all products
   */
  async getAllProducts(options = {}) {
    const {
      category = null,
      activeOnly = true,
      limit = null,
      offset = 0
    } = options;

    let allProducts = await indexedDBManager.getAll('products');

    // Apply filters
    if (activeOnly) {
      allProducts = allProducts.filter(product => product.isActive);
    }

    if (category) {
      allProducts = allProducts.filter(product => product.category === category);
    }

    // Apply pagination
    if (limit) {
      allProducts = allProducts.slice(offset, offset + limit);
    }

    return allProducts;
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category) {
    return await this.getAllProducts({ category, activeOnly: true });
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts() {
    const allProducts = await indexedDBManager.getAll('products');
    
    const lowStockProducts = [];
    
    for (const product of allProducts) {
      if (!product.isActive) continue;
      
      const inventory = await this.getInventoryLevel(product.id);
      if (inventory.current <= product.inventory.minLevel) {
        lowStockProducts.push(product);
      }
    }
    
    return lowStockProducts;
  }

  /**
   * Get out of stock products
   */
  async getOutOfStockProducts() {
    const allProducts = await indexedDBManager.getAll('products');
    
    const outOfStock = [];
    for (const product of allProducts) {
      if (!product.isActive) continue;
      
      const inventory = await this.getInventoryLevel(product.id);
      if (inventory.current <= 0) {
        outOfStock.push(product);
      }
    }
    
    return outOfStock;
  }

  /**
   * Get all categories
   */
  async getCategories() {
    const allProducts = await indexedDBManager.getAll('products');
    const categories = [...new Set(allProducts.map(product => product.category))];
    
    return categories.sort();
  }

  /**
   * Add category
   */
  async addCategory(categoryName) {
    if (!this.categories.includes(categoryName)) {
      this.categories.push(categoryName);
      console.log('✅ Category added:', categoryName);
    }
    
    return this.categories;
  }

  /**
   * Create inventory record for product
   */
  async createInventoryRecord(product) {
    const inventory = {
      id: product.id,
      productId: product.id,
      productName: product.name,
      currentStock: product.inventory.current,
      reservedStock: product.inventory.reserved,
      availableStock: product.inventory.current - product.inventory.reserved,
      minLevel: product.inventory.minLevel,
      maxLevel: product.inventory.maxLevel,
      lastUpdated: new Date(),
      syncStatus: 'pending'
    };

    await indexedDBManager.add('inventory', inventory);
    
    // Add to sync queue
    await indexedDBManager.addToSyncQueue(
      'inventory',
      product.id,
      'create',
      inventory,
      80 // High priority for inventory
    );
  }

  /**
   * Get inventory level for product
   */
  async getInventoryLevel(productId) {
    const inventory = await indexedDBManager.get('inventory', productId);
    
    if (!inventory) {
      return {
        current: 0,
        reserved: 0,
        available: 0,
        minLevel: 0,
        maxLevel: 0
      };
    }

    return {
      current: inventory.currentStock,
      reserved: inventory.reservedStock,
      available: inventory.availableStock,
      minLevel: inventory.minLevel,
      maxLevel: inventory.maxLevel,
      lastUpdated: inventory.lastUpdated
    };
  }

  /**
   * Update inventory level
   */
  async updateInventoryLevel(productId, newLevel, reason = 'manual_adjustment') {
    const inventory = await indexedDBManager.get('inventory', productId);
    
    if (!inventory) {
      throw new Error('Inventory record not found for product');
    }

    const oldLevel = inventory.currentStock;
    inventory.currentStock = newLevel;
    inventory.availableStock = newLevel - inventory.reservedStock;
    inventory.lastUpdated = new Date();
    inventory.syncStatus = 'pending';

    await indexedDBManager.update('inventory', inventory);

    // Log inventory change
    await this.logInventoryChange(productId, oldLevel, newLevel, reason);

    // Add to sync queue
    await indexedDBManager.addToSyncQueue(
      'inventory',
      productId,
      'update',
      inventory,
      80
    );

    console.log(`📦 Inventory updated for ${inventory.productName}: ${oldLevel} → ${newLevel}`);
  }

  /**
   * Log inventory change
   */
  async logInventoryChange(productId, oldLevel, newLevel, reason) {
    const change = {
      id: `INV_${productId}_${Date.now()}`,
      productId,
      oldLevel,
      newLevel,
      difference: newLevel - oldLevel,
      reason,
      timestamp: new Date(),
      operatorId: 'system' // TODO: Get from current session
    };

    // Save inventory change log
    await indexedDBManager.add('inventoryChanges', change);
  }

  /**
   * Reserve inventory
   */
  async reserveInventory(productId, quantity) {
    const inventory = await indexedDBManager.get('inventory', productId);
    
    if (!inventory) {
      throw new Error('Inventory record not found');
    }

    if (inventory.availableStock < quantity) {
      throw new Error('Insufficient stock available');
    }

    inventory.reservedStock += quantity;
    inventory.availableStock -= quantity;
    inventory.lastUpdated = new Date();

    await indexedDBManager.update('inventory', inventory);
    
    console.log(`🔒 Reserved ${quantity} units of ${inventory.productName}`);
  }

  /**
   * Release reserved inventory
   */
  async releaseInventory(productId, quantity) {
    const inventory = await indexedDBManager.get('inventory', productId);
    
    if (!inventory) {
      throw new Error('Inventory record not found');
    }

    inventory.reservedStock = Math.max(0, inventory.reservedStock - quantity);
    inventory.availableStock = inventory.currentStock - inventory.reservedStock;
    inventory.lastUpdated = new Date();

    await indexedDBManager.update('inventory', inventory);
    
    console.log(`🔓 Released ${quantity} units of ${inventory.productName}`);
  }

  /**
   * Get product statistics
   */
  async getProductStats() {
    const allProducts = await indexedDBManager.getAll('products');
    const allInventory = await indexedDBManager.getAll('inventory');
    
    const stats = {
      totalProducts: allProducts.length,
      activeProducts: allProducts.filter(p => p.isActive).length,
      categories: (await this.getCategories()).length,
      lowStockProducts: (await this.getLowStockProducts()).length,
      outOfStockProducts: (await this.getOutOfStockProducts()).length,
      totalInventoryValue: allInventory.reduce((sum, inv) => {
        const product = allProducts.find(p => p.id === inv.productId);
        return sum + (inv.currentStock * (product?.cost || 0));
      }, 0)
    };

    return stats;
  }

  /**
   * Generate unique product ID
   */
  generateProductId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `PROD_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Clear search cache
   */
  clearSearchCache() {
    this.searchCache.clear();
    console.log('🗑️ Product search cache cleared');
  }
}

// Export singleton instance
const productManager = new ProductManager();
export default productManager;
