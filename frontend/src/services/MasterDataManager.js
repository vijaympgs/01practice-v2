/**
 * OptiMind Retail™ POS System - Master Data Manager
 * 
 * Handles master data replication from head office:
 * - Product catalog synchronization
 * - Customer database replication
 * - Pricing and promotion updates
 * - Inventory level synchronization
 * - Configuration management
 */

import indexedDBManager from './IndexedDBManager.js';
import syncEngine from './SyncEngine.js';
import api from './api.js';

class MasterDataManager {
  constructor() {
    this.isInitialized = false;
    this.replicationStatus = {
      lastReplication: null,
      isReplicating: false,
      pendingUpdates: 0,
      failedUpdates: 0
    };
    this.masterDataVersion = null;
  }

  /**
   * Initialize master data manager
   */
  async initialize() {
    try {
      await indexedDBManager.initialize();
      await syncEngine.initialize();
      
      // Get current master data version
      await this.getMasterDataVersion();
      
      this.isInitialized = true;
      console.log('✅ Master Data Manager initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize Master Data Manager:', error);
      throw error;
    }
  }

  /**
   * Get master data version from server
   */
  async getMasterDataVersion() {
    try {
      const response = await api.get('/master-data/version/');
      this.masterDataVersion = response.data;
      console.log('📊 Master data version:', this.masterDataVersion);
      return this.masterDataVersion;
    } catch (error) {
      console.error('❌ Failed to get master data version:', error);
      // Use local version if server is unavailable
      const localVersion = await indexedDBManager.get('masterDataVersion', 'local');
      this.masterDataVersion = localVersion || { version: '1.0.0', lastUpdated: new Date() };
      return this.masterDataVersion;
    }
  }

  /**
   * Replicate master data from head office
   */
  async replicateMasterData() {
    if (this.replicationStatus.isReplicating) {
      console.log('⚠️ Replication already in progress');
      return;
    }

    try {
      this.replicationStatus.isReplicating = true;
      console.log('🔄 Starting master data replication...');
      
      // 1. Replicate product catalog
      await this.replicateProducts();
      
      // 2. Replicate customer database
      await this.replicateCustomers();
      
      // 3. Replicate pricing and promotions
      await this.replicatePricing();
      
      // 4. Replicate inventory levels
      await this.replicateInventory();
      
      // 5. Update master data version
      await this.updateMasterDataVersion();
      
      this.replicationStatus.lastReplication = new Date();
      console.log('✅ Master data replication completed');
      
    } catch (error) {
      console.error('❌ Master data replication failed:', error);
      this.replicationStatus.failedUpdates++;
    } finally {
      this.replicationStatus.isReplicating = false;
    }
  }

  /**
   * Replicate product catalog
   */
  async replicateProducts() {
    try {
      console.log('📦 Replicating product catalog...');
      
      const response = await api.get('/products/master-data/', {
        params: {
          include_inactive: false,
          limit: 10000
        }
      });
      
      const products = response.data.results || response.data;
      
      for (const product of products) {
        await this.updateLocalProduct(product);
      }
      
      console.log(`✅ Replicated ${products.length} products`);
      
    } catch (error) {
      console.error('❌ Failed to replicate products:', error);
      throw error;
    }
  }

  /**
   * Update local product with master data
   */
  async updateLocalProduct(masterProduct) {
    try {
      const localProduct = await indexedDBManager.get('products', masterProduct.id);
      
      if (!localProduct) {
        // New product from master data
        await indexedDBManager.add('products', {
          ...masterProduct,
          source: 'master_data',
          lastReplicated: new Date()
        });
        console.log(`➕ Added new product from master data: ${masterProduct.name}`);
      } else {
        // Update existing product
        const updatedProduct = {
          ...localProduct,
          ...masterProduct,
          source: 'master_data',
          lastReplicated: new Date(),
          // Preserve local inventory levels
          inventory: localProduct.inventory || masterProduct.inventory
        };
        
        await indexedDBManager.update('products', updatedProduct);
        console.log(`🔄 Updated product from master data: ${masterProduct.name}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to update local product ${masterProduct.id}:`, error);
    }
  }

  /**
   * Replicate customer database
   */
  async replicateCustomers() {
    try {
      console.log('👥 Replicating customer database...');
      
      const response = await api.get('/customers/master-data/', {
        params: {
          include_inactive: false,
          limit: 10000
        }
      });
      
      const customers = response.data.results || response.data;
      
      for (const customer of customers) {
        await this.updateLocalCustomer(customer);
      }
      
      console.log(`✅ Replicated ${customers.length} customers`);
      
    } catch (error) {
      console.error('❌ Failed to replicate customers:', error);
      throw error;
    }
  }

  /**
   * Update local customer with master data
   */
  async updateLocalCustomer(masterCustomer) {
    try {
      const localCustomer = await indexedDBManager.get('customers', masterCustomer.id);
      
      if (!localCustomer) {
        // New customer from master data
        await indexedDBManager.add('customers', {
          ...masterCustomer,
          source: 'master_data',
          lastReplicated: new Date()
        });
        console.log(`➕ Added new customer from master data: ${masterCustomer.name}`);
      } else {
        // Update existing customer
        const updatedCustomer = {
          ...localCustomer,
          ...masterCustomer,
          source: 'master_data',
          lastReplicated: new Date()
        };
        
        await indexedDBManager.update('customers', updatedCustomer);
        console.log(`🔄 Updated customer from master data: ${masterCustomer.name}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to update local customer ${masterCustomer.id}:`, error);
    }
  }

  /**
   * Replicate pricing and promotions
   */
  async replicatePricing() {
    try {
      console.log('💰 Replicating pricing and promotions...');
      
      const response = await api.get('/pricing/master-data/', {
        params: {
          active_only: true,
          limit: 10000
        }
      });
      
      const pricingData = response.data.results || response.data;
      
      for (const pricing of pricingData) {
        await this.updateLocalPricing(pricing);
      }
      
      console.log(`✅ Replicated ${pricingData.length} pricing records`);
      
    } catch (error) {
      console.error('❌ Failed to replicate pricing:', error);
      // Don't throw error, pricing is not critical
    }
  }

  /**
   * Update local pricing with master data
   */
  async updateLocalPricing(masterPricing) {
    try {
      const localPricing = await indexedDBManager.get('pricing', masterPricing.id);
      
      if (!localPricing) {
        await indexedDBManager.add('pricing', {
          ...masterPricing,
          source: 'master_data',
          lastReplicated: new Date()
        });
      } else {
        const updatedPricing = {
          ...localPricing,
          ...masterPricing,
          source: 'master_data',
          lastReplicated: new Date()
        };
        
        await indexedDBManager.update('pricing', updatedPricing);
      }
      
    } catch (error) {
      console.error(`❌ Failed to update local pricing ${masterPricing.id}:`, error);
    }
  }

  /**
   * Replicate inventory levels
   */
  async replicateInventory() {
    try {
      console.log('📦 Replicating inventory levels...');
      
      const response = await api.get('/inventory/master-data/', {
        params: {
          limit: 10000
        }
      });
      
      const inventoryData = response.data.results || response.data;
      
      for (const inventory of inventoryData) {
        await this.updateLocalInventory(inventory);
      }
      
      console.log(`✅ Replicated ${inventoryData.length} inventory records`);
      
    } catch (error) {
      console.error('❌ Failed to replicate inventory:', error);
      // Don't throw error, inventory can be updated locally
    }
  }

  /**
   * Update local inventory with master data
   */
  async updateLocalInventory(masterInventory) {
    try {
      const localInventory = await indexedDBManager.get('inventory', masterInventory.id);
      
      if (!localInventory) {
        await indexedDBManager.add('inventory', {
          ...masterInventory,
          source: 'master_data',
          lastReplicated: new Date()
        });
      } else {
        // Merge inventory levels intelligently
        const updatedInventory = {
          ...localInventory,
          ...masterInventory,
          source: 'master_data',
          lastReplicated: new Date(),
          // Preserve local adjustments
          localAdjustments: localInventory.localAdjustments || []
        };
        
        await indexedDBManager.update('inventory', updatedInventory);
      }
      
    } catch (error) {
      console.error(`❌ Failed to update local inventory ${masterInventory.id}:`, error);
    }
  }

  /**
   * Update master data version
   */
  async updateMasterDataVersion() {
    try {
      const versionData = {
        id: 'local',
        version: this.masterDataVersion.version,
        lastUpdated: new Date(),
        lastReplicated: new Date()
      };
      
      await indexedDBManager.update('masterDataVersion', versionData);
      console.log('📊 Master data version updated');
      
    } catch (error) {
      console.error('❌ Failed to update master data version:', error);
    }
  }

  /**
   * Get replication status
   */
  getReplicationStatus() {
    return {
      ...this.replicationStatus,
      masterDataVersion: this.masterDataVersion,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Get replication statistics
   */
  async getReplicationStats() {
    const products = await indexedDBManager.getAll('products');
    const customers = await indexedDBManager.getAll('customers');
    const pricing = await indexedDBManager.getAll('pricing');
    const inventory = await indexedDBManager.getAll('inventory');
    
    return {
      totalProducts: products.length,
      masterDataProducts: products.filter(p => p.source === 'master_data').length,
      totalCustomers: customers.length,
      masterDataCustomers: customers.filter(c => c.source === 'master_data').length,
      totalPricingRecords: pricing.length,
      totalInventoryRecords: inventory.length,
      lastReplication: this.replicationStatus.lastReplication,
      masterDataVersion: this.masterDataVersion
    };
  }

  /**
   * Force immediate replication
   */
  async forceReplication() {
    console.log('🔄 Forcing immediate master data replication...');
    await this.replicateMasterData();
  }

  /**
   * Clear master data
   */
  async clearMasterData() {
    await indexedDBManager.clearStore('products');
    await indexedDBManager.clearStore('customers');
    await indexedDBManager.clearStore('pricing');
    await indexedDBManager.clearStore('inventory');
    console.log('🗑️ Master data cleared');
  }
}

// Export singleton instance
const masterDataManager = new MasterDataManager();
export default masterDataManager;
