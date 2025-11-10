import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Paper,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Sync as SyncIcon,
  CloudSync as CloudSyncIcon,
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Storage as StorageIcon,
  History as HistoryIcon
} from '@mui/icons-material';

const SyncStatus = ({ 
  mode, 
  syncStatus, 
  embeddedDB, 
  syncEngine, 
  onMessage, 
  onModeChange, 
  onSyncStatusChange 
}) => {
  const [syncQueue, setSyncQueue] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [syncHistory, setSyncHistory] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    loadSyncData();
    loadDatabaseStats();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      loadSyncData();
      loadDatabaseStats();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [embeddedDB, syncEngine]);

  const loadSyncData = async () => {
    try {
      if (embeddedDB) {
        // Load sync queue
        const queue = await embeddedDB.getSyncQueue('pending');
        setSyncQueue(queue);

        // Load sync history
        const history = await embeddedDB.getSyncQueue('completed');
        setSyncHistory(history.slice(-10)); // Last 10 completed syncs
      }
    } catch (error) {
      console.error('Failed to load sync data:', error);
    }
  };

  const loadDatabaseStats = async () => {
    try {
      if (embeddedDB) {
        const stats = await embeddedDB.getStats();
        setDbStats(stats);
      }
    } catch (error) {
      console.error('Failed to load database stats:', error);
    }
  };

  const handleForceSync = async () => {
    try {
      setIsSyncing(true);
      onSyncStatusChange('syncing');
      
      if (syncEngine) {
        await syncEngine.performSync();
        onSyncStatusChange('connected');
        setLastSyncTime(new Date());
        onMessage('✅ Manual sync completed successfully');
      } else {
        // Simulate sync for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        onSyncStatusChange('connected');
        setLastSyncTime(new Date());
        onMessage('✅ Sync simulation completed');
      }
    } catch (error) {
      onSyncStatusChange('disconnected');
      onMessage(`❌ Sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
      loadSyncData();
    }
  };

  const handleClearSyncQueue = async () => {
    try {
      if (embeddedDB) {
        await embeddedDB.clearCompletedSyncQueue();
        onMessage('✅ Sync queue cleared');
        loadSyncData();
      }
    } catch (error) {
      onMessage(`❌ Failed to clear sync queue: ${error.message}`);
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'connected':
        return <CheckIcon color="success" />;
      case 'syncing':
        return <CircularProgress size={20} />;
      case 'disconnected':
        return <ErrorIcon color="error" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'connected':
        return 'success';
      case 'syncing':
        return 'info';
      case 'disconnected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const formatSyncItem = (item) => {
    const operations = {
      create: 'Created',
      update: 'Updated',
      delete: 'Deleted'
    };
    
    return `${operations[item.operation] || item.operation} ${item.entityType} (${item.entityId})`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Sync & Status
      </Typography>

      <Grid container spacing={2} sx={{ height: 'calc(100% - 60px)' }}>
        {/* Connection Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Connection Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={loadSyncData}
                    size="small"
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SyncIcon />}
                    onClick={handleForceSync}
                    disabled={isSyncing || syncStatus === 'syncing'}
                    size="small"
                  >
                    {isSyncing ? 'Syncing...' : 'Force Sync'}
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {mode === 'online' ? <OnlineIcon color="success" /> : <OfflineIcon color="warning" />}
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Mode
                      </Typography>
                    </Box>
                    <Chip
                      label={mode === 'online' ? 'Online' : 'Offline'}
                      color={mode === 'online' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {getSyncStatusIcon()}
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Sync Status
                      </Typography>
                    </Box>
                    <Chip
                      label={syncStatus === 'connected' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Local Only'}
                      color={getSyncStatusColor()}
                      size="small"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <HistoryIcon color="info" />
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Last Sync
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sync Queue */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Sync Queue ({syncQueue.length})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearSyncQueue}
                  disabled={syncQueue.length === 0}
                >
                  Clear Completed
                </Button>
              </Box>

              {syncQueue.length === 0 ? (
                <Alert severity="success">
                  No pending sync operations
                </Alert>
              ) : (
                <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                  {syncQueue.map((item, index) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {item.operation === 'create' && <UploadIcon color="success" />}
                        {item.operation === 'update' && <SyncIcon color="info" />}
                        {item.operation === 'delete' && <DownloadIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={formatSyncItem(item)}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(item.timestamp).toLocaleString()}
                            </Typography>
                            <Chip
                              label={`Priority: ${item.priority}`}
                              size="small"
                              color={item.priority === 1 ? 'error' : item.priority === 2 ? 'warning' : 'default'}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Database Statistics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Database Statistics
              </Typography>

              {dbStats ? (
                <Box>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Storage Overview
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Total Records:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {dbStats.totalRecords.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Last Updated:</Typography>
                      <Typography variant="body2">
                        {new Date(dbStats.lastUpdated).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Database:</Typography>
                      <Typography variant="body2">{dbStats.databaseName}</Typography>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Store Breakdown
                    </Typography>
                    <List dense>
                      {Object.entries(dbStats.storeStats).map(([store, count]) => (
                        <ListItem key={store} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <StorageIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={store.charAt(0).toUpperCase() + store.slice(1)}
                            secondary={`${count} records`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              ) : (
                <Alert severity="info">
                  Loading database statistics...
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sync History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Sync History
              </Typography>

              {syncHistory.length === 0 ? (
                <Alert severity="info">
                  No sync history available
                </Alert>
              ) : (
                <List sx={{ maxHeight: '200px', overflow: 'auto' }}>
                  {syncHistory.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={formatSyncItem(item)}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Completed: {new Date(item.timestamp).toLocaleString()}
                              </Typography>
                              <Chip
                                label="Synced"
                                color="success"
                                size="small"
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < syncHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              System Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Browser:
                </Typography>
                <Typography variant="body2">
                  {navigator.userAgent.split(' ')[0]}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Platform:
                </Typography>
                <Typography variant="body2">
                  {navigator.platform}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Online:
                </Typography>
                <Typography variant="body2">
                  {navigator.onLine ? 'Yes' : 'No'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Storage:
                </Typography>
                <Typography variant="body2">
                  IndexedDB Available
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SyncStatus;
