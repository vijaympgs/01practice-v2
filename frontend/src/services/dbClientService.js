import api from './api';

const dbClientService = {
  /**
   * Get all database tables with metadata
   */
  async getTables() {
    const response = await api.get('/db-client/client/');
    return response.data;
  },

  /**
   * Get schema information for a specific table
   * @param {string} tableName - Name of the table
   */
  async getTableSchema(tableName) {
    const response = await api.get(`/db-client/client/schema/?table=${tableName}`);
    return response.data;
  },

  /**
   * Get preview data from a table
   * @param {string} tableName - Name of the table
   * @param {number} limit - Maximum number of rows to return (default: 100, max: 1000)
   */
  async getTablePreview(tableName, limit = 100) {
    const response = await api.get(`/db-client/client/preview/?table=${tableName}&limit=${limit}`);
    return response.data;
  },

  /**
   * Execute a SELECT query (read-only)
   * @param {string} query - SQL SELECT query
   */
  async executeQuery(query) {
    const response = await api.post('/db-client/client/execute_query/', { query });
    return response.data;
  },

  /**
   * Get all database views
   */
  async getViews() {
    const response = await api.get('/db-client/client/views/');
    return response.data;
  },

  /**
   * Get database information and statistics
   */
  async getDatabaseInfo() {
    const response = await api.get('/db-client/client/database_info/');
    return response.data;
  },

  /**
   * Get all table relationships for ER diagram
   */
  async getRelationships() {
    const response = await api.get('/db-client/client/relationships/');
    return response.data;
  },

  /**
   * Execute EXPLAIN query to get query execution plan
   * @param {string} query - SQL SELECT query
   */
  async explainQuery(query) {
    const response = await api.post('/db-client/client/explain_query/', { query });
    return response.data;
  },
};

export default dbClientService;

