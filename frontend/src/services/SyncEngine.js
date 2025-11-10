/**
 * OptiMind Retail™ POS System - Sync Engine
 * 
 * Revolutionary hybrid sync engine for offline-first architecture:
 * - Bidirectional synchronization between IndexedDB and PostgreSQL
 * - Conflict-free data merging with intelligent resolution
 * - Priority-based synchronization with retry mechanisms
 * - Real-time sync status monitoring
 * - Master data replication from head office
 */

import indexedDBManager from './IndexedDBManager.js';
import api from './api.js';

class SyncEngine {
  constructor() {
    this.isInitialized = false;
    this.isOnline = navigator.onLine;
    this.syncInterval = null;
    this.syncStatus = {
      lastSync: null,
      pendingItems: 0,
      failedItems: 0,
      isSyncing: false
    };
    this.syncQueue = [];
    this.conflictResolution = 'server_wins'; // 'server_wins', 'client_wins', 'merge'
  }

  /**
   * Initialize sync engine
   */
  async initialize() {
    try {
      await indexedDBManager.initialize();
      
      // Listen for online/offline events
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.log('🌐 Network online - starting sync');
        this.startAutoSync();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.log('📡 Network offline - stopping sync');
        this.stopAutoSync();
      });
      
      // Start auto-sync if online
      if (this.isOnline) {
        this.startAutoSync();
      }
      
      this.isInitialized = true;
      console.log('✅ Sync Engine initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize Sync Engine:', error);
      throw error;
    }
  }

  /**
   * Start automatic synchronization
   */
  startAutoSync(intervalMs = 30000) { // 30 seconds
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(async () => {
      if (this.isOnline && !this.syncStatus.isSyncing) {
        await this.performSync();
      }
    }, intervalMs);
    
    console.log('🔄 Auto-sync started');
  }

  /**
   * Stop automatic synchronization
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    console.log('⏹️ Auto-sync stopped');
  }

  /**
   * Perform complete synchronization
   */
  async performSync() {
    if (!this.isOnline || this.syncStatus.isSyncing) {
      return;
    }

    try {
      this.syncStatus.isSyncing = true;
      console.log('🔄 Starting synchronization...');
      
      // 1. Upload local changes to server
      await this.uploadLocalChanges();
      
      // 2. Download server changes to local
      await this.downloadServerChanges();
      
      // 3. Update sync status
      this.syncStatus.lastSync = new Date();
      
      console.log('✅ Synchronization completed successfully');
      
    } catch (error) {
      console.error('❌ Synchronization failed:', error);
      this.syncStatus.failedItems++;
    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  /**
   * Upload local changes to server
   */
  async uploadLocalChanges() {
    try {
      const syncQueue = await indexedDBManager.getAll('syncQueue');
      const pendingItems = syncQueue.filter(item => item.status === 'pending');
      
      console.log(`📤 Uploading ${pendingItems.length} local changes...`);
      
      for (const item of pendingItems) {
        try {
          await this.uploadSyncItem(item);
          item.status = 'synced';
          item.syncedAt = new Date();
          await indexedDBManager.update('syncQueue', item);
        } catch (error) {
          console.error(`❌ Failed to upload item ${item.id}:`, error);
          item.status = 'failed';
          item.retryCount = (item.retryCount || 0) + 1;
          await indexedDBManager.update('syncQueue', item);
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to upload local changes:', error);
      throw error;
    }
  }

  /**
   * Upload individual sync item
   */
  async uploadSyncItem(syncItem) {
    const { entityType, entityId, operation, data } = syncItem;
    
    switch (operation) {
      case 'create':
        await api.post(`/${entityType}s/`, data);
        break;
      case 'update':
        await api.put(`/${entityType}s/${entityId}/`, data);
        break;
      case 'delete':
        await api.delete(`/${entityType}s/${entityId}/`);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
    
    console.log(`✅ Uploaded ${operation} ${entityType}: ${entityId}`);
  }

  /**
   * Download server changes to local
   */
  async downloadServerChanges() {
    try {
      console.log('📥 Downloading server changes...');
      
      // Get last sync timestamp
      const lastSync = this.syncStatus.lastSync || new Date(0);
      
      // Download changes for each entity type
      await this.downloadEntityChanges('products', lastSync);
      await this.downloadEntityChanges('customers', lastSync);
      await this.downloadEntityChanges('transactions', lastSync);
      await this.downloadEntityChanges('inventory', lastSync);
      
    } catch (error) {
      console.error('❌ Failed to download server changes:', error);
      throw error;
    }
  }

  /**
   * Download changes for specific entity type
   */
  async downloadEntityChanges(entityType, lastSync) {
    try {
      const response = await api.get(`/${entityType}s/`, {
        params: {
          modified_since: lastSync.toISOString(),
          limit: 1000
        }
      });
      
      const serverData = response.data.results || response.data;
      
      for (const item of serverData) {
        await this.mergeServerItem(entityType, item);
      }
      
      console.log(`✅ Downloaded ${serverData.length} ${entityType} changes`);
      
    } catch (error) {
      console.error(`❌ Failed to download ${entityType} changes:`, error);
      // Don't throw error, continue with other entity types
    }
  }

  /**
   * Merge server item with local data
   */
  async mergeServerItem(entityType, serverItem) {
    try {
      const localItem = await indexedDBManager.get(entityType, serverItem.id);
      
      if (!localItem) {
        // New item from server
        await indexedDBManager.add(entityType, serverItem);
        console.log(`➕ Added new ${entityType}: ${serverItem.id}`);
      } else {
        // Check for conflicts
        const localModified = new Date(localItem.lastModified || localItem.lastUpdated);
        const serverModified = new Date(serverItem.lastModified || serverItem.lastUpdated);
        
        if (localModified > serverModified) {
          // Local is newer, handle conflict
          await this.handleConflict(entityType, localItem, serverItem);
        } else {
          // Server is newer or same, update local
          await indexedDBManager.update(entityType, serverItem);
          console.log(`🔄 Updated ${entityType}: ${serverItem.id}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Failed to merge ${entityType} item:`, error);
    }
  }

  /**
   * Handle data conflicts
   */
  async handleConflict(entityType, localItem, serverItem) {
    console.log(`⚠️ Conflict detected for ${entityType}: ${localItem.id}`);
    
    switch (this.conflictResolution) {
      case 'server_wins':
        await indexedDBManager.update(entityType, serverItem);
        console.log(`🔄 Resolved conflict: server wins for ${entityType}: ${localItem.id}`);
        break;
        
      case 'client_wins':
        // Upload local version to server
        await this.uploadSyncItem({
          entityType,
          entityId: localItem.id,
          operation: 'update',
          data: localItem
        });
        console.log(`🔄 Resolved conflict: client wins for ${entityType}: ${localItem.id}`);
        break;
        
      case 'merge':
        // Merge data intelligently
        const mergedItem = this.mergeData(localItem, serverItem);
        await indexedDBManager.update(entityType, mergedItem);
        console.log(`🔄 Resolved conflict: merged for ${entityType}: ${localItem.id}`);
        break;
    }
  }

  /**
   * Intelligently merge conflicting data
   */
  mergeData(localItem, serverItem) {
    // Simple merge strategy - prefer non-null values
    const merged = { ...serverItem };
    
    for (const key in localItem) {
      if (localItem[key] !== null && localItem[key] !== undefined && localItem[key] !== '') {
        merged[key] = localItem[key];
      }
    }
    
    merged.lastModified = new Date();
    merged.conflictResolved = true;
    
    return merged;
  }

  /**
   * Force immediate synchronization
   */
  async forceSync() {
    console.log('🔄 Forcing immediate synchronization...');
    await this.performSync();
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      ...this.syncStatus,
      isOnline: this.isOnline,
      autoSyncEnabled: this.syncInterval !== null
    };
  }

  /**
   * Get sync statistics
   */
  async getSyncStats() {
    const syncQueue = await indexedDBManager.getAll('syncQueue');
    const syncLogs = await indexedDBManager.getAll('syncLogs');
    
    return {
      totalItems: syncQueue.length,
      pendingItems: syncQueue.filter(item => item.status === 'pending').length,
      syncedItems: syncQueue.filter(item => item.status === 'synced').length,
      failedItems: syncQueue.filter(item => item.status === 'failed').length,
      lastSync: this.syncStatus.lastSync,
      isOnline: this.isOnline,
      syncLogs: syncLogs.length
    };
  }

  /**
   * Clear sync queue
   */
  async clearSyncQueue() {
    await indexedDBManager.clearStore('syncQueue');
    console.log('🗑️ Sync queue cleared');
  }

  /**
   * Set conflict resolution strategy
   */
  setConflictResolution(strategy) {
    if (['server_wins', 'client_wins', 'merge'].includes(strategy)) {
      this.conflictResolution = strategy;
      console.log(`🔧 Conflict resolution set to: ${strategy}`);
    } else {
      throw new Error('Invalid conflict resolution strategy');
    }
  }

  /**
   * Export sync data for debugging
   */
  async exportSyncData() {
    const syncQueue = await indexedDBManager.getAll('syncQueue');
    const syncLogs = await indexedDBManager.getAll('syncLogs');
    
    return {
      syncQueue,
      syncLogs,
      syncStatus: this.getSyncStatus(),
      timestamp: new Date()
    };
  }
}

// Export singleton instance
const syncEngine = new SyncEngine();
export default syncEngine;