import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Computer as TerminalIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  Settings as SettingsIcon,
  Monitor as MonitorIcon,
  CloudSync as CloudSyncIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  RestartAlt as RestartIcon,
  NetworkCheck as NetworkIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Update as UpdateIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Timeline as TimelineIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';

const AdvancedTerminalFeatures = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
  // Terminal state
  const [terminals, setTerminals] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [terminalDialog, setTerminalDialog] = useState({ open: false, terminal: null, type: 'add' });
  
  // Terminal form state
  const [terminalData, setTerminalData] = useState({
    id: '',
    name: '',
    terminalId: '',
    location: '',
    ipAddress: '',
    macAddress: '',
    status: 'offline', // offline, online, maintenance, error
    lastSync: '',
    version: '',
    hardware: {
      cpu: '',
      memory: '',
      storage: '',
      os: '',
    },
    configuration: {
      autoSync: true,
      backupEnabled: true,
      monitoringEnabled: true,
      updateChannel: 'stable',
    },
    performance: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkLatency: 0,
    },
    logs: [],
    alerts: [],
  });
  
  // Sync state
  const [syncStatus, setSyncStatus] = useState({
    isRunning: false,
    progress: 0,
    currentOperation: '',
    errors: [],
  });
  
  // Monitoring state
  const [monitoringData, setMonitoringData] = useState({
    activeTerminals: 0,
    totalTerminals: 0,
    syncErrors: 0,
    performanceIssues: 0,
    lastHealthCheck: '',
  });

  useEffect(() => {
    initializeAdvancedTerminals();
  }, []);

  const initializeAdvancedTerminals = async () => {
    try {
      setLoading(true);
      
      // Load mock data
      await loadTerminals();
      await loadMonitoringData();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize advanced terminals: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadTerminals = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTerminals = [
        {
          id: '1',
          name: 'Terminal-001',
          terminalId: 'T001',
          location: 'Main Store - Counter 1',
          ipAddress: '192.168.1.101',
          macAddress: '00:1B:44:11:3A:B7',
          status: 'online',
          lastSync: '2025-01-27T10:30:00Z',
          version: '2.1.0',
          hardware: {
            cpu: 'Intel Core i5-8400',
            memory: '8GB DDR4',
            storage: '256GB SSD',
            os: 'Windows 10 Pro',
          },
          configuration: {
            autoSync: true,
            backupEnabled: true,
            monitoringEnabled: true,
            updateChannel: 'stable',
          },
          performance: {
            cpuUsage: 45,
            memoryUsage: 62,
            diskUsage: 78,
            networkLatency: 12,
          },
          logs: [
            { timestamp: '2025-01-27T10:30:00Z', level: 'info', message: 'Sync completed successfully' },
            { timestamp: '2025-01-27T10:25:00Z', level: 'warning', message: 'High CPU usage detected' },
            { timestamp: '2025-01-27T10:20:00Z', level: 'info', message: 'Terminal started' },
          ],
          alerts: [
            { id: '1', type: 'warning', message: 'Disk usage above 75%', timestamp: '2025-01-27T10:25:00Z' },
          ],
        },
        {
          id: '2',
          name: 'Terminal-002',
          terminalId: 'T002',
          location: 'Main Store - Counter 2',
          ipAddress: '192.168.1.102',
          macAddress: '00:1B:44:11:3A:B8',
          status: 'maintenance',
          lastSync: '2025-01-27T09:15:00Z',
          version: '2.0.9',
          hardware: {
            cpu: 'Intel Core i3-8100',
            memory: '4GB DDR4',
            storage: '128GB SSD',
            os: 'Windows 10 Home',
          },
          configuration: {
            autoSync: false,
            backupEnabled: true,
            monitoringEnabled: true,
            updateChannel: 'beta',
          },
          performance: {
            cpuUsage: 78,
            memoryUsage: 85,
            diskUsage: 92,
            networkLatency: 45,
          },
          logs: [
            { timestamp: '2025-01-27T09:15:00Z', level: 'error', message: 'Sync failed - network timeout' },
            { timestamp: '2025-01-27T09:10:00Z', level: 'warning', message: 'Memory usage critical' },
            { timestamp: '2025-01-27T09:05:00Z', level: 'info', message: 'Maintenance mode activated' },
          ],
          alerts: [
            { id: '2', type: 'error', message: 'Sync failed - network timeout', timestamp: '2025-01-27T09:15:00Z' },
            { id: '3', type: 'critical', message: 'Memory usage critical', timestamp: '2025-01-27T09:10:00Z' },
          ],
        },
        {
          id: '3',
          name: 'Terminal-003',
          terminalId: 'T003',
          location: 'Branch Store - Counter 1',
          ipAddress: '192.168.2.101',
          macAddress: '00:1B:44:11:3A:B9',
          status: 'offline',
          lastSync: '2025-01-26T18:30:00Z',
          version: '2.1.0',
          hardware: {
            cpu: 'AMD Ryzen 5 3600',
            memory: '16GB DDR4',
            storage: '512GB SSD',
            os: 'Windows 11 Pro',
          },
          configuration: {
            autoSync: true,
            backupEnabled: true,
            monitoringEnabled: true,
            updateChannel: 'stable',
          },
          performance: {
            cpuUsage: 0,
            memoryUsage: 0,
            diskUsage: 0,
            networkLatency: 0,
          },
          logs: [
            { timestamp: '2025-01-26T18:30:00Z', level: 'info', message: 'Terminal shutdown' },
            { timestamp: '2025-01-26T18:25:00Z', level: 'info', message: 'Last sync completed' },
          ],
          alerts: [
            { id: '4', type: 'critical', message: 'Terminal offline', timestamp: '2025-01-26T18:30:00Z' },
          ],
        },
      ];
      
      setTerminals(mockTerminals);
    } catch (error) {
      console.error('Failed to load terminals:', error);
    }
  };

  const loadMonitoringData = async () => {
    try {
      const monitoring = {
        activeTerminals: terminals.filter(t => t.status === 'online').length,
        totalTerminals: terminals.length,
        syncErrors: terminals.reduce((sum, t) => sum + t.alerts.filter(a => a.type === 'error').length, 0),
        performanceIssues: terminals.reduce((sum, t) => sum + t.alerts.filter(a => a.type === 'warning' || a.type === 'critical').length, 0),
        lastHealthCheck: new Date().toISOString(),
      };
      
      setMonitoringData(monitoring);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTerminalSelect = (terminal) => {
    setSelectedTerminal(terminal);
  };

  const handleAddTerminal = () => {
    setTerminalData({
      id: '',
      name: '',
      terminalId: '',
      location: '',
      ipAddress: '',
      macAddress: '',
      status: 'offline',
      lastSync: '',
      version: '2.1.0',
      hardware: {
        cpu: '',
        memory: '',
        storage: '',
        os: '',
      },
      configuration: {
        autoSync: true,
        backupEnabled: true,
        monitoringEnabled: true,
        updateChannel: 'stable',
      },
      performance: {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkLatency: 0,
      },
      logs: [],
      alerts: [],
    });
    setTerminalDialog({ open: true, terminal: null, type: 'add' });
  };

  const handleEditTerminal = (terminal) => {
    setTerminalData(terminal);
    setTerminalDialog({ open: true, terminal, type: 'edit' });
  };

  const handleSaveTerminal = async () => {
    try {
      setSaving(true);
      
      if (terminalDialog.type === 'add') {
        const newTerminal = {
          ...terminalData,
          id: Date.now().toString(),
        };
        setTerminals(prev => [...prev, newTerminal]);
      } else {
        setTerminals(prev => prev.map(terminal => 
          terminal.id === terminalData.id ? terminalData : terminal
        ));
      }
      
      setTerminalDialog({ open: false, terminal: null, type: 'add' });
      setSnackbar({ open: true, message: 'Terminal saved successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save terminal: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setSyncStatus({
        isRunning: true,
        progress: 0,
        currentOperation: 'Starting sync...',
        errors: [],
      });
      
      // Simulate sync process
      const steps = [
        'Connecting to terminals...',
        'Checking terminal status...',
        'Syncing configuration...',
        'Syncing data...',
        'Verifying sync...',
        'Completing sync...',
      ];
      
      for (let i = 0; i < steps.length; i++) {
        setSyncStatus(prev => ({
          ...prev,
          progress: ((i + 1) / steps.length) * 100,
          currentOperation: steps[i],
        }));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setSyncStatus({
        isRunning: false,
        progress: 100,
        currentOperation: 'Sync completed successfully',
        errors: [],
      });
      
      setSnackbar({ open: true, message: 'All terminals synced successfully!', severity: 'success' });
      
    } catch (error) {
      setSyncStatus({
        isRunning: false,
        progress: 0,
        currentOperation: 'Sync failed',
        errors: [error.message],
      });
      
      setSnackbar({ open: true, message: 'Sync failed: ' + error.message, severity: 'error' });
    }
  };

  const handleTerminalAction = async (terminalId, action) => {
    try {
      const terminal = terminals.find(t => t.id === terminalId);
      if (!terminal) return;
      
      switch (action) {
        case 'start':
          setTerminals(prev => prev.map(t => 
            t.id === terminalId ? { ...t, status: 'online' } : t
          ));
          break;
        case 'stop':
          setTerminals(prev => prev.map(t => 
            t.id === terminalId ? { ...t, status: 'offline' } : t
          ));
          break;
        case 'restart':
          setTerminals(prev => prev.map(t => 
            t.id === terminalId ? { ...t, status: 'maintenance' } : t
          ));
          setTimeout(() => {
            setTerminals(prev => prev.map(t => 
              t.id === terminalId ? { ...t, status: 'online' } : t
            ));
          }, 3000);
          break;
        case 'sync':
          // Simulate sync
          setTerminals(prev => prev.map(t => 
            t.id === terminalId ? { ...t, lastSync: new Date().toISOString() } : t
          ));
          break;
      }
      
      setSnackbar({ open: true, message: `Terminal ${action} completed!`, severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to ${action} terminal: ` + error.message, severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      online: 'success',
      offline: 'error',
      maintenance: 'warning',
      error: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      online: <CheckIcon />,
      offline: <ErrorIcon />,
      maintenance: <WarningIcon />,
      error: <ErrorIcon />,
    };
    return icons[status] || <ErrorIcon />;
  };

  const getPerformanceColor = (value, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) return 'error';
    if (value >= thresholds.warning) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 3
    }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          px: 3,
          mb: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <TerminalIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  mb: 0.5
                }}
              >
                Advanced Terminal Features
              </Typography>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Multi-terminal management, synchronization, and monitoring
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Monitoring Dashboard */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Active Terminals
                </Typography>
                <Typography variant="h4" color="primary">
                  {monitoringData.activeTerminals}/{monitoringData.totalTerminals}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Online
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Sync Errors
                </Typography>
                <Typography variant="h4" color="error">
                  {monitoringData.syncErrors}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Issues
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  Performance Issues
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {monitoringData.performanceIssues}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Last Health Check
                </Typography>
                <Typography variant="body2" color="success.main">
                  {new Date(monitoringData.lastHealthCheck).toLocaleTimeString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(monitoringData.lastHealthCheck).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sync Status */}
        {syncStatus.isRunning && (
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CloudSyncIcon color="primary" />
                <Typography variant="h6">
                  Synchronizing All Terminals
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={syncStatus.progress} 
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {syncStatus.currentOperation} ({Math.round(syncStatus.progress)}%)
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Paper 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: theme.palette.grey[600],
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light + '15',
                },
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
              },
            }}
          >
            <Tab icon={<TerminalIcon />} iconPosition="start" label="Terminals" />
            <Tab icon={<SyncIcon />} iconPosition="start" label="Synchronization" />
            <Tab icon={<MonitorIcon />} iconPosition="start" label="Monitoring" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Configuration" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Terminal Actions */}
              <Box sx={{ p: 3, borderBottom: '1px solid #dee2e6' }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Terminal Management
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SyncIcon />}
                      onClick={handleSyncAll}
                      disabled={syncStatus.isRunning}
                    >
                      Sync All
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddTerminal}
                    >
                      Add Terminal
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Terminals Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Terminal</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Performance</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Last Sync</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {terminals.map((terminal) => (
                      <TableRow 
                        key={terminal.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {terminal.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {terminal.terminalId} • {terminal.ipAddress}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {terminal.location}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(terminal.status)}
                            label={terminal.status} 
                            color={getStatusColor(terminal.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title={`CPU: ${terminal.performance.cpuUsage}%`}>
                              <Chip 
                                label={`CPU ${terminal.performance.cpuUsage}%`}
                                color={getPerformanceColor(terminal.performance.cpuUsage)}
                                size="small"
                              />
                            </Tooltip>
                            <Tooltip title={`Memory: ${terminal.performance.memoryUsage}%`}>
                              <Chip 
                                label={`RAM ${terminal.performance.memoryUsage}%`}
                                color={getPerformanceColor(terminal.performance.memoryUsage)}
                                size="small"
                              />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {terminal.lastSync ? new Date(terminal.lastSync).toLocaleString() : 'Never'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleTerminalSelect(terminal)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Terminal">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditTerminal(terminal)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Sync Terminal">
                              <IconButton 
                                size="small" 
                                onClick={() => handleTerminalAction(terminal.id, 'sync')}
                                color="secondary"
                              >
                                <SyncIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Restart Terminal">
                              <IconButton 
                                size="small" 
                                onClick={() => handleTerminalAction(terminal.id, 'restart')}
                                color="warning"
                              >
                                <RestartIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Synchronization Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced sync features and configuration
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Monitoring
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time terminal monitoring and alerts
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Terminal Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced configuration and settings management
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Terminal Dialog */}
      <Dialog open={terminalDialog.open} onClose={() => setTerminalDialog({ open: false, terminal: null, type: 'add' })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TerminalIcon />
            <Typography variant="h6">
              {terminalDialog.type === 'add' ? 'Add New Terminal' : 'Edit Terminal'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Terminal Name"
                value={terminalData.name}
                onChange={(e) => setTerminalData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Terminal-001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Terminal ID"
                value={terminalData.terminalId}
                onChange={(e) => setTerminalData(prev => ({ ...prev, terminalId: e.target.value }))}
                placeholder="e.g., T001"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={terminalData.location}
                onChange={(e) => setTerminalData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Main Store - Counter 1"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IP Address"
                value={terminalData.ipAddress}
                onChange={(e) => setTerminalData(prev => ({ ...prev, ipAddress: e.target.value }))}
                placeholder="e.g., 192.168.1.101"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MAC Address"
                value={terminalData.macAddress}
                onChange={(e) => setTerminalData(prev => ({ ...prev, macAddress: e.target.value }))}
                placeholder="e.g., 00:1B:44:11:3A:B7"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={terminalData.configuration.autoSync}
                    onChange={(e) => setTerminalData(prev => ({ 
                      ...prev, 
                      configuration: { ...prev.configuration, autoSync: e.target.checked }
                    }))}
                  />
                }
                label="Auto Sync"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={terminalData.configuration.backupEnabled}
                    onChange={(e) => setTerminalData(prev => ({ 
                      ...prev, 
                      configuration: { ...prev.configuration, backupEnabled: e.target.checked }
                    }))}
                  />
                }
                label="Backup Enabled"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTerminalDialog({ open: false, terminal: null, type: 'add' })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveTerminal}
            disabled={saving || !terminalData.name || !terminalData.terminalId}
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {terminalDialog.type === 'add' ? 'Add Terminal' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdvancedTerminalFeatures;
