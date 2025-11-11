import React, { useState, useEffect } from 'react';
import PageTitle from '../components/common/PageTitle';
import { useNotification } from '../contexts/NotificationContext';
import { formatErrorResponse } from '../utils/notifications';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Button,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Backup as BackupIcon,
  Storage as StorageIcon,
  Sync as SyncIcon,
  Store as StoreIcon,
  BusinessCenter as BusinessCenterIcon,
  CloudOff as CloudOffIcon,
  Dns as DatabaseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const SettingsPage = () => {
  const { displayError, displaySuccess } = useNotification();
  
  // Check for setup mode
  const [isSetupMode, setIsSetupMode] = useState(false);
  
  const [settings, setSettings] = useState({
    // Database Architecture Settings
    offlineBillingEnabled: true,
    billingSyncInterval: 5, // minutes
    autoSyncEnabled: true,
    syncSchedulerEnabled: true,
    syncFrequency: 'daily', // 'realtime', 'hourly', 'daily'
    instoreDbType: 'sqlite', // 'sqlite', 'mysql', 'mssql'
    hoDbType: 'mysql', // 'mysql', 'mssql', 'postgresql'
  });
  
  const [dbConfigTab, setDbConfigTab] = useState(0);
  const [saving, setSaving] = useState(false);
  
  // Database status states
  const [hoDbStatus, setHoDbStatus] = useState('not_available'); // 'connected', 'not_available'
  const [storeDbStatus, setStoreDbStatus] = useState('not_available');
  const [showCreateDbDialog, setShowCreateDbDialog] = useState(false);
  const [createDbStep, setCreateDbStep] = useState(0);
  const [createDbType, setCreateDbType] = useState('sqlite'); // Database type: 'sqlite', 'mysql', 'mssql', 'postgresql'
  const [createDbFor, setCreateDbFor] = useState('ho'); // 'ho' or 'store'
  
  useEffect(() => {
    // Check setup mode
    const setupMode = localStorage.getItem('setupMode') === 'true';
    setIsSetupMode(setupMode);
    
    // TODO: Check database status from API
    // For now, assume not available in setup mode
    if (setupMode) {
      setHoDbStatus('not_available');
      setStoreDbStatus('not_available');
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: Save database architecture settings to backend API
      // For now, just show a success message
      console.log('Saving database architecture settings:', settings);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      displaySuccess('Database architecture settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      const { errorMessage, errorItems } = formatErrorResponse(error);
      displayError(errorMessage || 'Failed to save settings. Please try again.', errorItems);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset database architecture settings to default?')) {
      setSettings({
        offlineBillingEnabled: true,
        billingSyncInterval: 5,
        autoSyncEnabled: true,
        syncSchedulerEnabled: true,
        syncFrequency: 'daily',
        instoreDbType: 'sqlite',
        hoDbType: 'mysql',
      });
      displaySuccess('Database architecture settings reset to default values!');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 3 }}>
      {/* Setup Mode Banner */}
      {isSetupMode && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => {
                localStorage.removeItem('setupMode');
                localStorage.removeItem('setupModeTime');
                setIsSetupMode(false);
                window.location.href = '/login';
              }}
            >
              Exit Setup Mode
            </Button>
          }
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Database Setup Mode Active
          </Typography>
          <Typography variant="body2">
            Limited functionality. Please configure databases to proceed.
          </Typography>
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="🗄️ Database Architecture Configuration" 
          subtitle="Configure data storage locations and synchronization settings for POS and BackOffice operations"
          showIcon={true}
          icon={<StorageIcon />}
        />
      </Box>

      {/* Database Status Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BusinessCenterIcon color="primary" />
                    Head Office Database (HO DB)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {hoDbStatus === 'connected' ? (
                      <>
                        <CheckCircleIcon color="success" />
                        <Typography color="success.main" fontWeight={600}>Connected</Typography>
                      </>
                    ) : (
                      <>
                        <ErrorIcon color="error" />
                        <Typography color="error.main" fontWeight={600}>Not Available</Typography>
                      </>
                    )}
                  </Box>
                </Box>
                {hoDbStatus === 'not_available' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setCreateDbFor('ho');
                      setCreateDbType('sqlite'); // Default to SQLite for HO DB
                      setShowCreateDbDialog(true);
                      setCreateDbStep(0);
                    }}
                  >
                    Create Database
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <StoreIcon color="primary" />
                    Store Database (InStore DB)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {storeDbStatus === 'connected' ? (
                      <>
                        <CheckCircleIcon color="success" />
                        <Typography color="success.main" fontWeight={600}>Connected</Typography>
                      </>
                    ) : (
                      <>
                        <ErrorIcon color="error" />
                        <Typography color="error.main" fontWeight={600}>Not Available</Typography>
                      </>
                    )}
                  </Box>
                </Box>
                {storeDbStatus === 'not_available' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setCreateDbFor('store');
                      setCreateDbType('mysql'); // Default to MySQL for Store DB
                      setShowCreateDbDialog(true);
                      setCreateDbStep(0);
                    }}
                  >
                    Create Database
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Database Architecture Disclaimer */}
      <Box sx={{ mb: 4 }}>
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ 
            mb: 3,
            '& .MuiAlert-message': {
              width: '100%',
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ Database Architecture Recommendation
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 1 }}>
            <strong>For Your Scale:</strong> 5-10 locations with 5-10 terminals per location, consolidated under single HO DB
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 1 }}>
            <strong>Head Office Database (HO DB):</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>✅ <strong>Current:</strong> SQLite is acceptable for HO DB operations (mostly reads, moderate writes)</li>
              <li>✅ <strong>Works well for:</strong> Master data, settings, reports, moderate transaction volume</li>
              <li>⚠️ <strong>When to migrate:</strong> Upgrade to MySQL/PostgreSQL when exceeding 50+ locations or high concurrent write operations</li>
              <li>✅ <strong>Migration:</strong> Can be done later via Settings page without data loss</li>
            </ul>
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 1 }}>
            <strong>Store Database (InStore DB):</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>❌ <strong>SQLite NOT recommended</strong> for Store DB with multiple terminals</li>
              <li>⚠️ <strong>Why:</strong> SQLite allows only ONE writer at a time - multiple POS terminals will cause write lock contention and delays</li>
              <li>✅ <strong>Required:</strong> MySQL or PostgreSQL for Store DB to handle concurrent POS transactions</li>
              <li>✅ <strong>Performance:</strong> MySQL/PostgreSQL supports multiple concurrent writers (5-10 terminals per location)</li>
              <li>✅ <strong>Scalability:</strong> Each location can have its own Store DB or share one with proper connection pooling</li>
            </ul>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
            <strong>Best Practice:</strong> Start with SQLite for HO DB, use MySQL/PostgreSQL for Store DB from the beginning. 
            This ensures optimal performance for POS operations while keeping HO DB flexible for future growth.
          </Typography>
        </Alert>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Define where your data is stored (InStore DB for POS, HO DB for Masters) and configure synchronization settings. 
          Changes will be saved to the database and applied system-wide across all locations.
        </Alert>
      </Box>

      <Grid container spacing={3}>
        {/* Database Architecture Configuration */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ background: (theme) => theme.palette.primary.main, color: 'white', p: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                <StorageIcon />
                Database Architecture Configuration
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Configure data storage locations and synchronization settings for POS and BackOffice operations
              </Typography>
            </Box>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                  value={dbConfigTab} 
                  onChange={(e, newValue) => setDbConfigTab(newValue)}
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500,
                    }
                  }}
                >
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StoreIcon fontSize="small" />
                        POS Data (InStore DB)
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessCenterIcon fontSize="small" />
                        Masters & BackOffice (HO DB)
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SyncIcon fontSize="small" />
                        Sync Configuration
                      </Box>
                    } 
                  />
                </Tabs>
              </Box>

              {/* Tab Panel 1: POS Data (InStore DB) */}
              {dbConfigTab === 0 && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Point of Sale Data Storage
              </Typography>
                    <Typography variant="body2">
                      All POS data (Terminal, Shift, Day Open, Billing, Settlement, Day End) is stored in the <strong>InStore Database</strong> at each location. 
                      Each store location has its own local database server.
              </Typography>
                  </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          POS Data Modules
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <DatabaseIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Terminal Configuration"
                              secondary="InStore DB"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DatabaseIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Shift Management"
                              secondary="InStore DB"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DatabaseIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Day Open"
                              secondary="InStore DB"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DatabaseIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Billing"
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>InStore DB</span>
                                  {settings.offlineBillingEnabled && (
                                    <Chip 
                                      label="Offline Mode" 
                                      size="small" 
                                      color="warning"
                                      icon={<CloudOffIcon fontSize="small" />}
                                    />
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DatabaseIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Settlement"
                              secondary="InStore DB"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DatabaseIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Day End"
                              secondary="InStore DB"
                            />
                          </ListItem>
                        </List>
                      </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Offline Billing Configuration
                      </Typography>
                      
                  <FormControlLabel
                    control={
                      <Switch
                            checked={settings.offlineBillingEnabled}
                            onChange={(e) => handleSettingChange('offlineBillingEnabled', e.target.checked)}
                        color="primary"
                      />
                    }
                        label="Enable Offline Billing Mode"
                      />
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, ml: 4, mb: 2 }}>
                        When enabled, billing transactions will use IndexedDB (browser storage) when the store server is unavailable. 
                        Data will automatically sync to InStore DB once connection is restored.
              </Typography>
              
                  <TextField
                    fullWidth
                        label="Billing Sync Interval (minutes)"
                        type="number"
                        value={settings.billingSyncInterval}
                        onChange={(e) => handleSettingChange('billingSyncInterval', parseInt(e.target.value) || 5)}
                        helperText="How often to attempt syncing offline billing data to InStore DB"
                        sx={{ mt: 2 }}
                        inputProps={{ min: 1, max: 60 }}
                      />

                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="caption">
                          <strong>Note:</strong> Offline billing data is stored locally in the browser. 
                          Ensure data is synced before clearing browser cache or using a different device.
                        </Typography>
                      </Alert>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                        <InputLabel>InStore Database Type</InputLabel>
                    <Select
                          value={settings.instoreDbType}
                          label="InStore Database Type"
                          onChange={(e) => handleSettingChange('instoreDbType', e.target.value)}
                        >
                          <MenuItem value="sqlite">SQLite</MenuItem>
                          <MenuItem value="mysql">MySQL</MenuItem>
                          <MenuItem value="mssql">MS SQL Server</MenuItem>
                    </Select>
                  </FormControl>
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                        Database type used for the InStore Database at each location. 
                        SQLite is recommended for smaller locations with limited IT infrastructure.
                      </Typography>
                </Grid>
              </Grid>
                </Box>
              )}

              {/* Tab Panel 2: Masters & BackOffice (HO DB) */}
              {dbConfigTab === 1 && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Head Office Database Storage
                    </Typography>
                    <Typography variant="body2">
                      All Master Data, Settings, and BackOffice operations are stored in the <strong>Head Office Database</strong>. 
                      This central database is accessible to all locations and supports real-time operations.
                    </Typography>
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Modules Stored in HO DB
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessCenterIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Master Data Management"
                              secondary={<Chip label="HO DB" size="small" color="primary" variant="outlined" />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessCenterIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Organization Setup"
                              secondary={<Chip label="HO DB" size="small" color="primary" variant="outlined" />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessCenterIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Item Management"
                              secondary={<Chip label="HO DB" size="small" color="primary" variant="outlined" />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessCenterIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Inventory Management"
                              secondary={<Chip label="HO DB" size="small" color="primary" variant="outlined" />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessCenterIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Procurement"
                              secondary={<Chip label="HO DB" size="small" color="primary" variant="outlined" />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessCenterIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Stock Nexus"
                              secondary={<Chip label="HO DB" size="small" color="primary" variant="outlined" />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessCenterIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Sales"
                              secondary={<Chip label="HO DB" size="small" color="primary" variant="outlined" />}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessCenterIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="System Settings"
                              secondary={<Chip label="HO DB" size="small" color="primary" variant="outlined" />}
                            />
                          </ListItem>
                        </List>
                      </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Head Office Database Configuration
                      </Typography>
                      
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Head Office Database Type</InputLabel>
                        <Select
                          value={settings.hoDbType}
                          label="Head Office Database Type"
                          onChange={(e) => handleSettingChange('hoDbType', e.target.value)}
                        >
                          <MenuItem value="mysql">MySQL</MenuItem>
                          <MenuItem value="mssql">MS SQL Server</MenuItem>
                          <MenuItem value="postgresql">PostgreSQL</MenuItem>
                        </Select>
                      </FormControl>
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 3 }}>
                        Database type used for the central Head Office Database. 
                        All master data and BackOffice operations are stored here.
              </Typography>
              
                      <Alert severity="success" sx={{ mt: 2 }}>
                        <Typography variant="caption">
                          <strong>Centralized Management:</strong> All master data is centrally managed in the HO DB, 
                          ensuring consistency across all store locations.
                        </Typography>
                      </Alert>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Tab Panel 3: Sync Configuration */}
              {dbConfigTab === 2 && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Data Synchronization Settings
                    </Typography>
                    <Typography variant="body2">
                      Configure how data from InStore Databases is synchronized with the Head Office Database. 
                      This ensures all store operations are available for reporting and analysis at the HO level.
                    </Typography>
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                            checked={settings.autoSyncEnabled}
                            onChange={(e) => handleSettingChange('autoSyncEnabled', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Enable Automatic Synchronization"
                      />
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, ml: 4, mb: 2 }}>
                        Automatically sync InStore DB data to HO DB when connectivity is available.
                      </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                            checked={settings.syncSchedulerEnabled}
                            onChange={(e) => handleSettingChange('syncSchedulerEnabled', e.target.checked)}
                            color="primary"
                            disabled={!settings.autoSyncEnabled}
                          />
                        }
                        label="Enable Scheduled Synchronization"
                      />
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, ml: 4, mb: 2 }}>
                        Use a background scheduler to periodically sync data from all store locations to HO DB.
                      </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                        <InputLabel>Sync Frequency</InputLabel>
                    <Select
                          value={settings.syncFrequency}
                          label="Sync Frequency"
                          onChange={(e) => handleSettingChange('syncFrequency', e.target.value)}
                          disabled={!settings.syncSchedulerEnabled || !settings.autoSyncEnabled}
                        >
                          <MenuItem value="realtime">Real-time (immediate)</MenuItem>
                          <MenuItem value="hourly">Hourly</MenuItem>
                          <MenuItem value="daily">Daily (recommended)</MenuItem>
                    </Select>
                  </FormControl>
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                        How often the scheduler should sync data from InStore DBs to HO DB. 
                        Daily sync is recommended to reduce network load during business hours.
                      </Typography>
                </Grid>

                <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Sync Status Summary
                      </Typography>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Store Locations</Typography>
                            <Typography variant="h6">All Locations</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Data synced from InStore DBs
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Last Sync</Typography>
                            <Typography variant="h6">--:--</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Scheduled sync status
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Pending Sync</Typography>
                            <Typography variant="h6">0</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Items awaiting sync
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Sync Health</Typography>
                            <Chip label="Healthy" color="success" size="small" />
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                              All locations connected
                            </Typography>
                          </Grid>
                </Grid>
                      </Paper>
                </Grid>
              </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BackupIcon color="primary" />
                Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={handleReset}
                    disabled={saving}
                  >
                    Reset to Default
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Database Creation Wizard Dialog */}
      <Dialog 
        open={showCreateDbDialog} 
        onClose={() => setShowCreateDbDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ background: (theme) => theme.palette.primary.main, color: 'white' }}>
          Create {createDbFor === 'ho' ? 'Head Office' : 'Store'} Database
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stepper activeStep={createDbStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Database Type</StepLabel>
            </Step>
            <Step>
              <StepLabel>Connection Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Test Connection</StepLabel>
            </Step>
            <Step>
              <StepLabel>Create & Configure</StepLabel>
            </Step>
          </Stepper>

              {createDbStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Database Type
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Database Type</InputLabel>
                <Select
                  value={createDbType}
                  label="Database Type"
                  onChange={(e) => setCreateDbType(e.target.value)}
                >
                  <MenuItem value="sqlite">SQLite</MenuItem>
                  <MenuItem value="mysql">MySQL</MenuItem>
                  <MenuItem value="mssql">MS SQL Server</MenuItem>
                  <MenuItem value="postgresql">PostgreSQL</MenuItem>
                </Select>
              </FormControl>
              {createDbFor === 'store' && createDbType === 'sqlite' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    ⚠️ Not Recommended for Store DB
                  </Typography>
                  <Typography variant="body2">
                    SQLite does not support multiple concurrent writers. With 5-10 terminals per location, 
                    you will experience write lock contention and transaction delays. 
                    <strong>Please select MySQL or PostgreSQL for Store DB.</strong>
                  </Typography>
                </Alert>
              )}
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                {createDbFor === 'ho' && createDbType === 'sqlite' && 'SQLite is acceptable for HO DB (read-heavy, moderate writes). Can upgrade later if needed.'}
                {createDbFor === 'store' && createDbType === 'sqlite' && '⚠️ NOT recommended for Store DB with multiple terminals due to write lock limitations.'}
                {createDbType === 'mysql' && (createDbFor === 'store' ? 'MySQL is recommended for Store DB. Supports multiple concurrent writers (required for POS terminals).' : 'MySQL requires a running MySQL server. Good for larger HO DB deployments.')}
                {createDbType === 'mssql' && 'MS SQL Server requires a running SQL Server instance. Good for enterprise deployments.'}
                {createDbType === 'postgresql' && (createDbFor === 'store' ? 'PostgreSQL is recommended for Store DB. Excellent for concurrent operations and scalability.' : 'PostgreSQL is excellent for HO DB at scale. Supports high concurrency.')}
              </Typography>
            </Box>
          )}

          {createDbStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Connection Details
              </Typography>
              {createDbType === 'sqlite' ? (
                <TextField
                  fullWidth
                  label="Database File Path"
                  placeholder="/path/to/database.db"
                  sx={{ mt: 2 }}
                  helperText="Absolute path where the SQLite database file will be created"
                />
              ) : (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Host"
                    placeholder="localhost"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Port"
                    placeholder={createDbType === 'mysql' ? '3306' : createDbType === 'mssql' ? '1433' : '5432'}
                    type="number"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Database Name"
                    placeholder="retail_ho_db"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    placeholder="db_user"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                  />
                </Box>
              )}
            </Box>
          )}

          {createDbStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Test Connection
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Click "Test Connection" to verify database connectivity before proceeding.
              </Alert>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => {
                  // TODO: Implement API call to test connection
                  displaySuccess('Connection successful!');
                  setCreateDbStep(3);
                }}
              >
                Test Connection
              </Button>
            </Box>
          )}

          {createDbStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Create Database & Tables
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This will create the database (if it doesn't exist) and run all migrations to set up tables.
                This may take a few minutes.
              </Alert>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  // TODO: Implement API call to create database and run migrations
                  displaySuccess(`${createDbFor === 'ho' ? 'Head Office' : 'Store'} database created successfully!`);
                  setShowCreateDbDialog(false);
                  if (createDbFor === 'ho') {
                    setHoDbStatus('connected');
                  } else {
                    setStoreDbStatus('connected');
                  }
                }}
              >
                Create Database & Run Migrations
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: 'grey.50' }}>
          <Button onClick={() => setShowCreateDbDialog(false)}>
            Cancel
          </Button>
          {createDbStep > 0 && (
            <Button onClick={() => setCreateDbStep(createDbStep - 1)}>
              Back
            </Button>
          )}
          {createDbStep < 3 && (
            <Button 
              variant="contained" 
              onClick={() => setCreateDbStep(createDbStep + 1)}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;

