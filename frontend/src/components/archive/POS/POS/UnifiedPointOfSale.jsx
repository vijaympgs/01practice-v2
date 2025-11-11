import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  ShoppingCart as SalesIcon,
  AccountBalance as CashIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Sync as SyncIcon,
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
  CloudSync as SyncStatusIcon
} from '@mui/icons-material';

// Import tab components
import SalesTransactions from './tabs/SalesTransactions';
import CashPayments from './tabs/CashPayments';
import AnalyticsReports from './tabs/AnalyticsReports';
import SettingsManagement from './tabs/SettingsManagement';
import SyncStatus from './tabs/SyncStatus';

// Import services
import EmbeddedDBManager from '../../services/EmbeddedDBManager';
import POSServiceManager from '../../services/POSServiceManager';
import SyncEngine from '../../services/SyncEngine';

const UnifiedPointOfSale = () => {
  // Core state
  const [activeTab, setActiveTab] = useState(0);
  const [mode, setMode] = useState('offline'); // 'online' or 'offline'
  const [syncStatus, setSyncStatus] = useState('disconnected'); // 'connected', 'syncing', 'disconnected'
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Service managers
  const [embeddedDB, setEmbeddedDB] = useState(null);
  const [posService, setPosService] = useState(null);
  const [syncEngine, setSyncEngine] = useState(null);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Initialize POS system
  const initializePOS = useCallback(async () => {
    try {
      setLoading(true);
      setMessage('🚀 Initializing Unified Point of Sale System...');

      console.log('🔄 Starting Unified POS initialization...');

      // Initialize Embedded Database Manager
      console.log('🔄 Initializing Embedded Database...');
      const dbManager = new EmbeddedDBManager();
      await dbManager.initialize();
      setEmbeddedDB(dbManager);

      // Initialize POS Service Manager
      console.log('🔄 Initializing POS Service Manager...');
      const serviceManager = new POSServiceManager(dbManager);
      await serviceManager.initialize();
      setPosService(serviceManager);

      // Initialize Sync Engine
      console.log('🔄 Initializing Sync Engine...');
      const sync = new SyncEngine(dbManager);
      await sync.initialize();
      setSyncEngine(sync);

      // Detect initial mode
      const initialMode = await detectMode();
      setMode(initialMode);

      // Start sync monitoring
      startSyncMonitoring(sync);

      setIsInitialized(true);
      setMessage('✅ Unified POS System ready! All features available.');
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(`❌ Initialization failed: ${error.message}`);
      console.error('Unified POS Initialization Error:', error);
      
      // Set fallback state
      setIsInitialized(true);
      setMode('offline');
      setSyncStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, []);

  // Detect online/offline mode
  const detectMode = async () => {
    try {
      // Check network connectivity
      if (!navigator.onLine) {
        return 'offline';
      }

      // Check server reachability
      const response = await fetch('http://127.0.0.1:8000/api/health', {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        setSyncStatus('connected');
        return 'online';
      } else {
        setSyncStatus('disconnected');
        return 'offline';
      }
    } catch (error) {
      console.log('Server not reachable, using offline mode');
      setSyncStatus('disconnected');
      return 'offline';
    }
  };

  // Start sync monitoring
  const startSyncMonitoring = (sync) => {
    // Monitor network status
    window.addEventListener('online', async () => {
      console.log('🌐 Network connection restored');
      const newMode = await detectMode();
      setMode(newMode);
      
      if (newMode === 'online') {
        setSyncStatus('syncing');
        try {
          await sync.performSync();
          setSyncStatus('connected');
        } catch (error) {
          setSyncStatus('disconnected');
        }
      }
    });

    window.addEventListener('offline', () => {
      console.log('📡 Network connection lost');
      setMode('offline');
      setSyncStatus('disconnected');
    });

    // Periodic sync check
    const syncInterval = setInterval(async () => {
      if (mode === 'online' && sync) {
        try {
          await sync.performSync();
        } catch (error) {
          console.log('Background sync failed:', error);
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(syncInterval);
  };

  // Initialize on mount
  useEffect(() => {
    initializePOS();
  }, [initializePOS]);

  // Loading screen
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        p: 4,
        backgroundColor: '#f5f5f5'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
          Initializing Unified Point of Sale System
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Setting up embedded database and sync capabilities...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This may take a few moments
        </Typography>
      </Box>
    );
  }

  // Main interface
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header with status indicators */}
      <Paper sx={{ p: 2, borderRadius: 0, boxShadow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              🏪 Point of Sale
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unified POS System with Embedded Database
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {/* Mode indicator */}
              <Chip
                icon={mode === 'online' ? <OnlineIcon /> : <OfflineIcon />}
                label={mode === 'online' ? 'Online Mode' : 'Offline Mode'}
                color={mode === 'online' ? 'success' : 'warning'}
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
              
              {/* Sync status */}
              <Chip
                icon={<SyncStatusIcon />}
                label={syncStatus === 'connected' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Local Only'}
                color={syncStatus === 'connected' ? 'success' : syncStatus === 'syncing' ? 'info' : 'default'}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Message alerts */}
      {message && (
        <Alert 
          severity={message.includes('❌') ? 'error' : message.includes('⚠️') ? 'warning' : 'success'}
          sx={{ m: 2, mb: 0 }}
        >
          {message}
        </Alert>
      )}

      {/* Main navigation tabs */}
      <Paper sx={{ mt: 2, mx: 2, borderRadius: 2, boxShadow: 1 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '0.9rem',
              fontWeight: 600
            }
          }}
        >
          <Tab 
            icon={<SalesIcon />} 
            label="🛒 Sales & Transactions" 
            iconPosition="start"
          />
          <Tab 
            icon={<CashIcon />} 
            label="💰 Cash & Payments" 
            iconPosition="start"
          />
          <Tab 
            icon={<AnalyticsIcon />} 
            label="📊 Analytics & Reports" 
            iconPosition="start"
          />
          <Tab 
            icon={<SettingsIcon />} 
            label="⚙️ Settings & Management" 
            iconPosition="start"
          />
          <Tab 
            icon={<SyncIcon />} 
            label="🔄 Sync & Status" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab content */}
      <Box sx={{ flex: 1, p: 2, overflow: 'hidden' }}>
        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ height: '100%', p: 0 }}>
            {activeTab === 0 && (
              <SalesTransactions 
                mode={mode}
                embeddedDB={embeddedDB}
                posService={posService}
                onMessage={setMessage}
              />
            )}
            {activeTab === 1 && (
              <CashPayments 
                mode={mode}
                embeddedDB={embeddedDB}
                posService={posService}
                onMessage={setMessage}
              />
            )}
            {activeTab === 2 && (
              <AnalyticsReports 
                mode={mode}
                embeddedDB={embeddedDB}
                posService={posService}
                syncEngine={syncEngine}
                onMessage={setMessage}
              />
            )}
            {activeTab === 3 && (
              <SettingsManagement 
                mode={mode}
                embeddedDB={embeddedDB}
                posService={posService}
                onMessage={setMessage}
              />
            )}
            {activeTab === 4 && (
              <SyncStatus 
                mode={mode}
                syncStatus={syncStatus}
                embeddedDB={embeddedDB}
                syncEngine={syncEngine}
                onMessage={setMessage}
                onModeChange={setMode}
                onSyncStatusChange={setSyncStatus}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UnifiedPointOfSale;
