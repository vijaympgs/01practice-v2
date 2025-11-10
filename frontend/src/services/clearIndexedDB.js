/**
 * Script to clear IndexedDB for testing
 */

export const clearIndexedDB = async () => {
  try {
    // Close any existing connections
    if (window.indexedDB) {
      // Clear the database
      const deleteRequest = indexedDB.deleteDatabase('OptiMindPOS');
      
      return new Promise((resolve, reject) => {
        deleteRequest.onsuccess = () => {
          console.log('✅ IndexedDB cleared successfully');
          resolve();
        };
        
        deleteRequest.onerror = () => {
          console.error('❌ Failed to clear IndexedDB:', deleteRequest.error);
          reject(deleteRequest.error);
        };
      });
    }
  } catch (error) {
    console.error('❌ Failed to clear IndexedDB:', error);
    throw error;
  }
};
