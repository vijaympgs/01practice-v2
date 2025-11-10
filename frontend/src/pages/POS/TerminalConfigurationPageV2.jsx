import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  KeyboardArrowRight as ArrowRightIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Science as TestIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  PowerSettingsNew as PowerIcon,
  DeviceHub as DeviceIcon,
  Wifi as WifiIcon,
  Lan as LanIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

import api from '../../services/api';
import terminalService from '../../services/terminalService';
import terminalManager from '../../services/TerminalManager';
import TerminalDialog from '../../components/Terminal/TerminalDialog';

const TerminalConfigurationPageV2 = () => {
  const theme = useTheme();

  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [dialog, setDialog] = useState({ open: false, mode: 'new', terminal: null });
  const [testDialog, setTestDialog] = useState({ open: false, terminal: null, results: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadTerminals();
    loadCompaniesAndLocations();
  }, []);

  const loadCompaniesAndLocations = async () => {
    try {
      const companiesResponse = await api.get('/organization/companies/public/');
      setCompanies(Array.isArray(companiesResponse.data) ? companiesResponse.data : (companiesResponse.data?.results || []));

      const locationsResponse = await api.get('/organization/locations/');
      const locationData = Array.isArray(locationsResponse.data)
        ? locationsResponse.data
        : (locationsResponse.data?.results || []);
      setLocations(locationData);
    } catch (error) {
      console.error('Failed to load companies/locations:', error);
    }
  };

  const loadTerminals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pos-masters/terminals/');
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      const formatted = data.map((item) => terminalService.convertToFrontendFormat(item));
      setTerminals(formatted);
      if (!selectedTerminal && formatted.length > 0) {
        setSelectedTerminal(formatted[0]);
      }
    } catch (error) {
      console.error('Error loading terminals:', error);
      setSnackbar({ open: true, message: 'Failed to load terminals.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTerminal = (terminal) => {
    setSelectedTerminal(terminal);
  };

  const handleNewTerminal = () => {
    setDialog({ open: true, mode: 'new', terminal: null });
  };

  const handleEditTerminal = (terminal) => {
    setDialog({ open: true, mode: 'edit', terminal });
  };

  const handleViewTerminal = (terminal) => {
    setDialog({ open: true, mode: 'view', terminal });
  };

  const handleDeleteTerminal = async (terminal) => {
    if (!window.confirm(`Delete terminal "${terminal.name}"?`)) return;
    try {
      setSaving(true);
      await terminalService.deleteTerminal(terminal.id);
      setSnackbar({ open: true, message: 'Terminal deleted.', severity: 'success' });
      await loadTerminals();
    } catch (error) {
      console.error('Failed to delete terminal:', error);
      setSnackbar({ open: true, message: 'Failed to delete terminal.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (terminal) => {
    try {
      setSaving(true);
      await terminalService.toggleTerminalStatus(terminal.id);
      setSnackbar({ open: true, message: 'Terminal status updated.', severity: 'success' });
      await loadTerminals();
    } catch (error) {
      console.error('Error toggling status:', error);
      setSnackbar({ open: true, message: 'Failed to update status.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestTerminal = async (terminal) => {
    try {
      setSaving(true);
      const results = await terminalManager.testTerminalComponents();
      setTestDialog({ open: true, terminal, results });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to run diagnostics.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTerminal = async (terminalData) => {
    try {
      setSaving(true);
      const payload = {
        ...terminalData,
        company: terminalData.companyId || terminalData.company || null,
        location: terminalData.locationId || terminalData.location || null,
      };
      delete payload.transaction_settings;
      delete payload.tender_mappings;
      delete payload.department_mappings;

      if (dialog.mode === 'new') {
        await terminalService.createTerminal(payload);
        setSnackbar({ open: true, message: 'Terminal created.', severity: 'success' });
      } else if (dialog.terminal) {
        await terminalService.updateTerminal(dialog.terminal.id, payload);
        setSnackbar({ open: true, message: 'Terminal updated.', severity: 'success' });
      }

      setDialog({ open: false, mode: 'new', terminal: null });
      await loadTerminals();
    } catch (error) {
      console.error('Error saving terminal:', error);
      const errorMessage = error.response?.data?.detail
        || Object.values(error.response?.data || {}).flat().join(', ')
        || error.message
        || 'Failed to save terminal';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const metrics = useMemo(() => {
    const total = terminals.length;
    const active = terminals.filter((t) => t.isActive || t.is_active).length;
    const offline = terminals.filter((t) => (t.status || '').toLowerCase() === 'offline').length;
    const needsSync = terminals.filter((t) => !t.lastSync && !t.last_sync).length;
    return [
      { label: 'Total Terminals', value: total, color: theme.palette.primary.main },
      { label: 'Active', value: active, color: theme.palette.success.main },
      { label: 'Offline', value: offline, color: theme.palette.error.main },
      { label: 'Never Synced', value: needsSync, color: theme.palette.warning.main },
    ];
  }, [terminals, theme.palette]);

  const resolveCompanyName = (terminal) => {
    if (!terminal) return 'Unassigned';
    if (terminal.company?.name) return terminal.company.name;
    if (terminal.companyName || terminal.company_name) return terminal.companyName || terminal.company_name;
    const companyId = terminal.companyId || terminal.company_id || terminal.company;
    if (!companyId) return 'Unassigned';
    const company = companies.find((c) => c.id === companyId);
    return company?.name || `Company ID: ${companyId}`;
  };

  const resolveLocationName = (terminal) => {
    if (!terminal) return 'Unassigned';
    if (terminal.location?.name) return terminal.location.name;
    if (terminal.locationName || terminal.location_name) return terminal.locationName || terminal.location_name;
    const locationId = terminal.locationId || terminal.location_id || terminal.location;
    if (!locationId) return 'Unassigned';
    const location = locations.find((loc) => loc.id === locationId);
    return location?.name || `Location ID: ${locationId}`;
  };

  const detailFields = selectedTerminal
    ? [
        {
          key: 'terminalType',
          label: 'Terminal Type',
          content: (
            <Chip
              label={selectedTerminal.terminalType || selectedTerminal.terminal_type || 'N/A'}
              size="small"
              sx={{ borderRadius: 99 }}
            />
          ),
        },
        {
          key: 'company',
          label: 'Company',
          content: <Typography variant="body2">{resolveCompanyName(selectedTerminal)}</Typography>,
        },
        {
          key: 'location',
          label: 'Location',
          content: (
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {selectedTerminal.locationName ||
                  selectedTerminal.location_name ||
                  selectedTerminal.location?.name ||
                  'Unassigned'}
              </Typography>
            </Stack>
          ),
        },
        {
          key: 'network',
          label: 'Network',
          content: (
            <Stack direction="row" spacing={1} alignItems="center">
              {(selectedTerminal.networkType || selectedTerminal.network_type) === 'wifi' ? (
                <WifiIcon fontSize="small" color="action" />
              ) : (
                <LanIcon fontSize="small" color="action" />
              )}
              <Typography variant="body2">
                {(selectedTerminal.networkType || selectedTerminal.network_type || 'Ethernet').toUpperCase()}
              </Typography>
            </Stack>
          ),
        },
        {
          key: 'serialNumber',
          label: 'Serial Number',
          content: (
            <Typography variant="body2">
              {selectedTerminal.serialNumber || selectedTerminal.serial_number || 'N/A'}
            </Typography>
          ),
        },
        {
          key: 'installationDate',
          label: 'Installation Date',
          content: (
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {selectedTerminal.installationDate || selectedTerminal.installation_date
                  ? new Date(
                      selectedTerminal.installationDate || selectedTerminal.installation_date
                    ).toLocaleDateString()
                  : 'Not recorded'}
              </Typography>
            </Stack>
          ),
        },
        {
          key: 'contactPerson',
          label: 'Contact Person',
          content: (
            <Typography variant="body2">
              {selectedTerminal.contactPerson || selectedTerminal.contact_person || 'Not assigned'}
            </Typography>
          ),
        },
        {
          key: 'contactPhone',
          label: 'Contact Phone',
          content: (
            <Typography variant="body2">
              {selectedTerminal.contactPhone || selectedTerminal.contact_phone || '—'}
            </Typography>
          ),
        },
        {
          key: 'contactEmail',
          label: 'Contact Email',
          content: (
            <Typography variant="body2">
              {selectedTerminal.contactEmail || selectedTerminal.contact_email || '—'}
            </Typography>
          ),
        },
        {
          key: 'floor',
          label: 'Floor / Zone',
          content: (
            <Typography variant="body2">
              {selectedTerminal.floorLocation || selectedTerminal.floor_location || '—'}
            </Typography>
          ),
        },
        {
          key: 'autoLogin',
          label: 'Auto Login POS',
          content: (
            <Chip
              label={selectedTerminal.autoLoginPos || selectedTerminal.auto_login_pos ? 'Enabled' : 'Disabled'}
              size="small"
              color={selectedTerminal.autoLoginPos || selectedTerminal.auto_login_pos ? 'success' : 'default'}
              sx={{ borderRadius: 99 }}
            />
          ),
        },
      ]
    : [];

  const healthFields = selectedTerminal
    ? [
        {
          key: 'lastSync',
          label: 'Last Sync',
          value:
            selectedTerminal.lastSync || selectedTerminal.last_sync
              ? new Date(selectedTerminal.lastSync || selectedTerminal.last_sync).toLocaleString()
              : 'Never',
        },
        {
          key: 'firmware',
          label: 'Firmware',
          value: selectedTerminal.firmwareVersion || selectedTerminal.firmware_version || '—',
        },
        {
          key: 'offlineMode',
          label: 'Offline Mode',
          value: selectedTerminal.enableOfflineMode ? 'Enabled' : 'Disabled',
        },
      ]
    : [];

  if (loading) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)}, ${theme.palette.background.default})`,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: { xs: 2, md: 4 },
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            Terminal Control Center
            <Chip
              label="1"
              sx={{
                borderRadius: '50%',
                width: 28,
                height: 28,
                fontWeight: 600,
                backgroundColor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
              }}
              size="small"
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Oversee terminal status, sync health, and on-the-fly configuration updates.
          </Typography>
          {selectedTerminal && (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mt: 1, '& .MuiChip-root': { borderRadius: 99 } }}
            >
              <Chip
                label={`${selectedTerminal.name || 'Terminal'} (${(selectedTerminal.terminalType || selectedTerminal.terminal_type || 'Type').toUpperCase()})`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Company: ${resolveCompanyName(selectedTerminal)}`}
                variant="outlined"
              />
              <Chip
                label={`Location: ${resolveLocationName(selectedTerminal)}`}
                variant="outlined"
              />
              {(selectedTerminal.contactPerson || selectedTerminal.contact_person) && (
                <Chip
                  label={`${selectedTerminal.contactPerson || selectedTerminal.contact_person} (Contact)`}
                  variant="outlined"
                />
              )}
              {(selectedTerminal.contactPhone || selectedTerminal.contact_phone) && (
                <Chip
                  label={`Phone: ${selectedTerminal.contactPhone || selectedTerminal.contact_phone}`}
                  variant="outlined"
                />
              )}
              {(selectedTerminal.contactEmail || selectedTerminal.contact_email) && (
                <Chip
                  label={`Email: ${selectedTerminal.contactEmail || selectedTerminal.contact_email}`}
                  variant="outlined"
                />
              )}
              {(selectedTerminal.operatingHours || selectedTerminal.operating_hours) && (
                <Chip
                  label={`Hours: ${selectedTerminal.operatingHours || selectedTerminal.operating_hours}`}
                  variant="outlined"
                />
              )}
            </Stack>
          )}
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadTerminals} disabled={saving}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewTerminal}>
            New Terminal
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: 2,
                background: alpha(metric.color, 0.08),
                borderColor: alpha(metric.color, 0.3),
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                {metric.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: metric.color }}>
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 0,
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
              minHeight: { md: 540 },
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Terminal Fleet
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {terminals.length} terminals mapped
              </Typography>
            </Stack>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Stack spacing={1.5} sx={{ overflowY: 'auto' }}>
              {terminals.map((terminal) => {
                const isActive = selectedTerminal?.id === terminal.id;
                const statusLabel = terminal.status || terminal.status_display || (terminal.isActive || terminal.is_active ? 'Active' : 'Inactive');
                const statusColor = (terminal.isActive || terminal.is_active)
                  ? theme.palette.success.main
                  : theme.palette.error.main;

                return (
                  <Paper
                    key={terminal.id}
                    variant="outlined"
                    onClick={() => handleSelectTerminal(terminal)}
                    sx={{
                      borderRadius: 0,
                      borderColor: isActive ? alpha(theme.palette.primary.main, 0.6) : alpha(theme.palette.divider, 0.6),
                      background: isActive ? alpha(theme.palette.primary.main, 0.08) : theme.palette.background.paper,
                      px: 2,
                      py: 1.5,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.12)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            background: alpha(statusColor, 0.18),
                            display: 'grid',
                            placeItems: 'center',
                            color: statusColor,
                          }}
                        >
                          <DeviceIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {terminal.name || 'Unnamed Terminal'}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={statusLabel} size="small" sx={{ borderRadius: 99 }} />
                            <Typography variant="caption" color="text.secondary">
                              {terminal.terminalCode || terminal.terminal_code}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title="View">
                          <IconButton size="small" onClick={(event) => { event.stopPropagation(); handleViewTerminal(terminal); }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={(event) => { event.stopPropagation(); handleEditTerminal(terminal); }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Diagnostics">
                          <IconButton size="small" onClick={(event) => { event.stopPropagation(); handleTestTerminal(terminal); }}>
                            <TestIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={terminal.isActive || terminal.is_active ? 'Deactivate' : 'Activate'}>
                          <IconButton size="small" onClick={(event) => { event.stopPropagation(); handleToggleStatus(terminal); }}>
                            <PowerIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(event) => { event.stopPropagation(); handleDeleteTerminal(terminal); }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <ArrowRightIcon fontSize="small" sx={{ color: alpha(theme.palette.text.secondary, 0.6) }} />
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
              {terminals.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No terminals configured yet.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 0,
              p: 3,
              height: '100%',
              minHeight: { md: 540 },
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            {selectedTerminal ? (
              <Stack spacing={2.5} sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedTerminal.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedTerminal.description || 'No description provided.'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => handleEditTerminal(selectedTerminal)}>
                      Edit
                    </Button>
                    <Button size="small" variant="contained" onClick={() => handleTestTerminal(selectedTerminal)}>
                      Run Diagnostics
                    </Button>
                  </Stack>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Grid container spacing={2}>
                  {detailFields.map((field) => (
                    <Grid item xs={12} sm={6} key={field.key}>
                      <Stack spacing={0.75}>
                        <Typography variant="caption" color="text.secondary">
                          {field.label}
                        </Typography>
                        {field.content}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                <Stack spacing={2}>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Sync & Health
                  </Typography>
                  <Grid container spacing={2}>
                    {healthFields.map((field) => (
                      <Grid item xs={12} sm={4} key={field.key}>
                        <Paper variant="outlined" sx={{ borderRadius: 0, p: 2, height: '100%' }}>
                          <Typography variant="caption" color="text.secondary">
                            {field.label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                            {field.value}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Quick Notes</Typography>
                  <Paper variant="outlined" sx={{ borderRadius: 0, p: 2 }}>
                    <TextField
                      value={selectedTerminal.notes || ''}
                      placeholder="Add operational notes..."
                      multiline
                      minRows={3}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                      onChange={(event) => setSelectedTerminal({ ...selectedTerminal, notes: event.target.value })}
                    />
                    <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSnackbar({ open: true, message: 'Notes saved locally.', severity: 'info' })}
                      >
                        Save Note
                      </Button>
                    </Stack>
                  </Paper>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={2} sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6">Select a terminal to see details</Typography>
                <Typography variant="body2" color="text.secondary">
                  Insights, hardware summary, and diagnostics controls will appear here.
                </Typography>
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      <TerminalDialog
        open={dialog.open}
        mode={dialog.mode}
        terminal={dialog.terminal}
        locations={locations}
        onClose={() => setDialog({ open: false, mode: 'new', terminal: null })}
        onSave={handleSaveTerminal}
        saving={saving}
      />

      <DiagnosticsDialog
        open={testDialog.open}
        terminal={testDialog.terminal}
        results={testDialog.results}
        onClose={() => setTestDialog({ open: false, terminal: null, results: null })}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const DiagnosticsDialog = ({ open, terminal, results, onClose }) => {
  const theme = useTheme();
  const diagnostics = results || {};
  const items = [
    { key: 'printer', label: 'Printer Connection', status: diagnostics.printer?.status || 'success' },
    { key: 'scanner', label: 'Scanner Connection', status: diagnostics.scanner?.status || 'success' },
    { key: 'cashDrawer', label: 'Cash Drawer', status: diagnostics.cashDrawer?.status || 'warning' },
    { key: 'network', label: 'Network Reachability', status: diagnostics.network?.status || 'success' },
    { key: 'sync', label: 'Cloud Sync', status: diagnostics.sync?.status || 'warning' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Diagnostics • {terminal?.name || 'Terminal'}
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {items.map((item) => (
            <ListItem key={item.key} sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
              <ListItemIcon sx={{ color: getStatusColor(item.status) }}>
                <TestIcon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={diagnostics[item.key]?.message || (item.status === 'success' ? 'Operational' : 'Needs attention')}
              />
              <Chip label={item.status.toUpperCase()} size="small" sx={{ borderRadius: 99, background: alpha(getStatusColor(item.status), 0.12), color: getStatusColor(item.status) }} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerminalConfigurationPageV2;
