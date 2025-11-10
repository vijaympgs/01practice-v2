/**
 * Embedded Database Manager for Offline POS Operations
 * Uses IndexedDB for unlimited offline storage with automatic sync capabilities
 */

class EmbeddedDBManager {
  constructor() {
    this.dbName = 'OptiMindRetailPOS';
    this.version = 1;
    this.db = null;
    this.isInitialized = false;
    
    // Object stores configuration
    this.objectStores = [
      {
        name: 'transactions',
        keyPath: 'id',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp', unique: false },
          { name: 'operatorId', keyPath: 'operatorId', unique: false },
          { name: 'status', keyPath: 'status', unique: false },
          { name: 'syncStatus', keyPath: 'syncStatus', unique: false }
        ]
      },
      {
        name: 'products',
        keyPath: 'id',
        indexes: [
          { name: 'barcode', keyPath: 'barcode', unique: true },
          { name: 'name', keyPath: 'name', unique: false },
          { name: 'category', keyPath: 'category', unique: false },
          { name: 'isActive', keyPath: 'isActive', unique: false }
        ]
      },
      {
        name: 'customers',
        keyPath: 'id',
        indexes: [
          { name: 'phone', keyPath: 'phone', unique: true },
          { name: 'email', keyPath: 'email', unique: true },
          { name: 'name', keyPath: 'name', unique: false }
        ]
      },
      {
        name: 'inventory',
        keyPath: 'id',
        indexes: [
          { name: 'productId', keyPath: 'productId', unique: true },
          { name: 'currentStock', keyPath: 'currentStock', unique: false },
          { name: 'lastUpdated', keyPath: 'lastUpdated', unique: false }
        ]
      },
      {
        name: 'syncQueue',
        keyPath: 'id',
        indexes: [
          { name: 'entityType', keyPath: 'entityType', unique: false },
          { name: 'operation', keyPath: 'operation', unique: false },
          { name: 'timestamp', keyPath: 'timestamp', unique: false },
          { name: 'status', keyPath: 'status', unique: false }
        ]
      },
      {
        name: 'shifts',
        keyPath: 'id',
        indexes: [
          { name: 'operatorId', keyPath: 'operatorId', unique: false },
          { name: 'startTime', keyPath: 'startTime', unique: false },
          { name: 'endTime', keyPath: 'endTime', unique: false },
          { name: 'status', keyPath: 'status', unique: false }
        ]
      },
      {
        name: 'cashDrawer',
        keyPath: 'id',
        indexes: [
          { name: 'shiftId', keyPath: 'shiftId', unique: false },
          { name: 'timestamp', keyPath: 'timestamp', unique: false },
          { name: 'operation', keyPath: 'operation', unique: false }
        ]
      },
      {
        name: 'receipts',
        keyPath: 'id',
        indexes: [
          { name: 'transactionId', keyPath: 'transactionId', unique: true },
          { name: 'timestamp', keyPath: 'timestamp', unique: false },
          { name: 'status', keyPath: 'status', unique: false }
        ]
      }
    ];
  }

  /**
   * Initialize the IndexedDB database
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('❌ Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('✅ Embedded Database initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('🔄 Creating object stores for embedded database...');

        // Create object stores and indexes
        this.objectStores.forEach(storeConfig => {
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            const store = db.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath,
              autoIncrement: true
            });

            // Create indexes
            storeConfig.indexes.forEach(indexConfig => {
              store.createIndex(
                indexConfig.name,
                indexConfig.keyPath,
                { unique: indexConfig.unique || false }
              );
            });

            console.log(`✅ Created object store: ${storeConfig.name}`);
          }
        });
      };
    });
  }

  /**
   * Ensure database is initialized
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Generic add operation
   */
  async add(storeName, data) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => {
        console.log(`✅ Added to ${storeName}:`, data.id || data);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Failed to add to ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Generic get operation
   */
  async get(storeName, key) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Failed to get from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Generic update operation
   */
  async update(storeName, data) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => {
        console.log(`✅ Updated in ${storeName}:`, data.id);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Failed to update in ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Generic delete operation
   */
  async delete(storeName, key) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        console.log(`✅ Deleted from ${storeName}:`, key);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ Failed to delete from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Generic get all operation
   */
  async getAll(storeName, filter = null) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result;
        
        if (filter) {
          results = results.filter(filter);
        }
        
        resolve(results);
      };

      request.onerror = () => {
        console.error(`❌ Failed to get all from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get by index
   */
  async getByIndex(storeName, indexName, value) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.get(value);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Failed to get by index from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get all by index
   */
  async getAllByIndex(storeName, indexName, value) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Failed to get all by index from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Count records in store
   */
  async count(storeName) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Failed to count ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Add to sync queue
   */
  async addToSyncQueue(entityType, entityId, operation, data, priority = 1) {
    const syncItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      entityType,
      entityId,
      operation, // 'create', 'update', 'delete'
      data,
      priority,
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0,
      maxRetries: 3
    };

    await this.add('syncQueue', syncItem);
    console.log(`📤 Added to sync queue: ${entityType} ${operation}`);
  }

  /**
   * Get sync queue items
   */
  async getSyncQueue(status = 'pending') {
    return await this.getAllByIndex('syncQueue', 'status', status);
  }

  /**
   * Update sync queue item
   */
  async updateSyncQueueItem(itemId, updates) {
    const item = await this.get('syncQueue', itemId);
    if (item) {
      const updatedItem = { ...item, ...updates };
      await this.update('syncQueue', updatedItem);
    }
  }

  /**
   * Clear completed sync queue items
   */
  async clearCompletedSyncQueue() {
    const completed = await this.getAllByIndex('syncQueue', 'status', 'completed');
    for (const item of completed) {
      await this.delete('syncQueue', item.id);
    }
    console.log(`🗑️ Cleared ${completed.length} completed sync queue items`);
  }

  /**
   * Get database statistics
   */
  async getStats() {
    await this.ensureInitialized();
    
    const stats = {};
    
    try {
      for (const storeConfig of this.objectStores) {
        const count = await this.count(storeConfig.name);
        stats[storeConfig.name] = count;
      }
      
      return {
        totalRecords: Object.values(stats).reduce((sum, count) => sum + count, 0),
        storeStats: stats,
        lastUpdated: new Date(),
        databaseName: this.dbName,
        version: this.version
      };
    } catch (error) {
      console.error('❌ Failed to get database stats:', error);
      return {
        totalRecords: 0,
        storeStats: {},
        lastUpdated: new Date(),
        error: error.message
      };
    }
  }

  /**
   * Export all data for backup
   */
  async exportData() {
    await this.ensureInitialized();
    
    const exportData = {};
    
    for (const storeConfig of this.objectStores) {
      exportData[storeConfig.name] = await this.getAll(storeConfig.name);
    }
    
    return {
      exportDate: new Date(),
      databaseName: this.dbName,
      version: this.version,
      data: exportData
    };
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAllData() {
    await this.ensureInitialized();
    
    for (const storeConfig of this.objectStores) {
      const transaction = this.db.transaction([storeConfig.name], 'readwrite');
      const store = transaction.objectStore(storeConfig.name);
      await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    
    console.log('🗑️ Cleared all embedded database data');
  }
}

export default EmbeddedDBManager;
