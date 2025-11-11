import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PageTitle from '../../components/common/PageTitle';
import {
  Analytics as AnalyticsIcon,
  Sync as SyncIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  Store as StoreIcon,
} from '@mui/icons-material';

// Import all our managers
import indexedDBManager from '../../services/IndexedDBManager';
import productManager from '../../services/ProductManager';
import transactionManager from '../../services/TransactionManager';
import securityManager from '../../services/SecurityManager';
import accessControlManager from '../../services/AccessControlManager';
import syncEngine from '../../services/SyncEngine';
import masterDataManager from '../../services/MasterDataManager';
import analyticsEngine from '../../services/AnalyticsEngine';

const POSEnterpriseDemo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  
  // System status
  const [systemStatus, setSystemStatus] = useState({
    indexedDB: false,
    security: false,
    accessControl: false,
    sync: false,
    masterData: false,
    analytics: false
  });
  
  // Demo data
  const [demoStats, setDemoStats] = useState({
    products: 0,
    customers: 0,
    transactions: 0,
    syncStatus: null,
    analytics: null
  });

  // Initialize all systems
  useEffect(() => {
    const initializeAllSystems = async () => {
      try {
        setLoading(true);
        console.log('🚀 Initializing OptiMind Retail™ POS Enterprise Demo...');
        
        // Initialize all managers
        await indexedDBManager.initialize();
        await productManager.initialize();
        await transactionManager.initialize();
        await securityManager.initialize();
        await accessControlManager.initialize();
        await syncEngine.initialize();
        await masterDataManager.initialize();
        await analyticsEngine.initialize();
        
        // Update system status
        setSystemStatus({
          indexedDB: true,
          security: true,
          accessControl: true,
          sync: true,
          masterData: true,
          analytics: true
        });
        
        // Get demo statistics
        await loadDemoStats();
        
        setSuccess('All systems initialized successfully!');
        console.log('✅ All systems initialized');
        
      } catch (error) {
        console.error('❌ Failed to initialize systems:', error);
        setError('Failed to initialize systems: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAllSystems();
  }, []);

  // Load demo statistics
  const loadDemoStats = async () => {
    try {
      const products = await indexedDBManager.getAll('products');
      const customers = await indexedDBManager.getAll('customers');
      const transactions = await indexedDBManager.getAll('transactions');
      const syncStatus = syncEngine.getSyncStatus();
      const analytics = await analyticsEngine.getAnalyticsDashboard();
      
      setDemoStats({
        products: products.length,
        customers: customers.length,
        transactions: transactions.length,
        syncStatus,
        analytics
      });
    } catch (error) {
      console.error('❌ Failed to load demo stats:', error);
    }
  };

  // Demo functions
  const runSecurityDemo = async () => {
    try {
      setLoading(true);
      
      // Encrypt some data
      const testData = { cardNumber: '1234567890123456', cvv: '123' };
      const encrypted = await securityManager.encryptPaymentData(testData);
      
      // Decrypt data
      const decrypted = await securityManager.decryptPaymentData(encrypted);
      
      // Generate security report
      const report = await securityManager.generateSecurityReport();
      
      setSuccess('Security demo completed! Check console for details.');
      console.log('🔐 Security Demo Results:', { encrypted, decrypted, report });
      
    } catch (error) {
      setError('Security demo failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runSyncDemo = async () => {
    try {
      setLoading(true);
      
      // Force sync
      await syncEngine.forceSync();
      
      // Get sync stats
      const stats = await syncEngine.getSyncStats();
      
      setSuccess('Sync demo completed! Check console for details.');
      console.log('🔄 Sync Demo Results:', stats);
      
    } catch (error) {
      setError('Sync demo failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runAnalyticsDemo = async () => {
    try {
      setLoading(true);
      
      // Get comprehensive analytics
      const dashboard = await analyticsEngine.getAnalyticsDashboard();
      
      setSuccess('Analytics demo completed! Check console for details.');
      console.log('📊 Analytics Demo Results:', dashboard);
      
    } catch (error) {
      setError('Analytics demo failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runMasterDataDemo = async () => {
    try {
      setLoading(true);
      
      // Force master data replication
      await masterDataManager.forceReplication();
      
      // Get replication stats
      const stats = await masterDataManager.getReplicationStats();
      
      setSuccess('Master data demo completed! Check console for details.');
      console.log('📦 Master Data Demo Results:', stats);
      
    } catch (error) {
      setError('Master data demo failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', p: 2, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <PageTitle 
          title="NewBorn Retail™ POS Enterprise Demo" 
          subtitle="Enterprise-grade point of sale demonstration"
          showIcon={true}
          icon={<Store />}
        />
        <Typography variant="subtitle1">
          Revolutionary Offline-First Retail POS System - All Systems Integrated
        </Typography>
      </Paper>

      {/* System Status */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          🚀 System Status
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(systemStatus).map(([system, status]) => (
            <Grid item xs={2} key={system}>
              <Chip
                label={system}
                color={status ? 'success' : 'error'}
                icon={status ? <SpeedIcon /> : <CircularProgress size={16} />}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Demo Statistics */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 Demo Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {demoStats.products}
                </Typography>
                <Typography variant="body2">Products</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="secondary">
                  {demoStats.customers}
                </Typography>
                <Typography variant="body2">Customers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success">
                  {demoStats.transactions}
                </Typography>
                <Typography variant="body2">Transactions</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="info">
                  {demoStats.syncStatus?.isOnline ? 'Online' : 'Offline'}
                </Typography>
                <Typography variant="body2">Sync Status</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Demo Tabs */}
      <Paper sx={{ p: 2 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="Security Demo" icon={<SecurityIcon />} />
          <Tab label="Sync Demo" icon={<SyncIcon />} />
          <Tab label="Analytics Demo" icon={<AnalyticsIcon />} />
          <Tab label="Master Data Demo" icon={<TrendingUpIcon />} />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {currentTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                🔐 Security Demo
              </Typography>
              <Typography variant="body2" gutterBottom>
                Test AES-256 encryption, PCI compliance, and security features.
              </Typography>
              <Button
                variant="contained"
                startIcon={<SecurityIcon />}
                onClick={runSecurityDemo}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Run Security Demo'}
              </Button>
            </Box>
          )}

          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                🔄 Sync Demo
              </Typography>
              <Typography variant="body2" gutterBottom>
                Test bidirectional synchronization between IndexedDB and PostgreSQL.
              </Typography>
              <Button
                variant="contained"
                startIcon={<SyncIcon />}
                onClick={runSyncDemo}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Run Sync Demo'}
              </Button>
            </Box>
          )}

          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📊 Analytics Demo
              </Typography>
              <Typography variant="body2" gutterBottom>
                Test real-time analytics and predictive insights.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AnalyticsIcon />}
                onClick={runAnalyticsDemo}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Run Analytics Demo'}
              </Button>
            </Box>
          )}

          {currentTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📦 Master Data Demo
              </Typography>
              <Typography variant="body2" gutterBottom>
                Test master data replication from head office.
              </Typography>
              <Button
                variant="contained"
                startIcon={<TrendingUpIcon />}
                onClick={runMasterDataDemo}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Run Master Data Demo'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default POSEnterpriseDemo;
