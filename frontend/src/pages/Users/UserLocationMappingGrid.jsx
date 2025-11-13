import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Store as StoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

const UserLocationMappingGrid = () => {
  const { displaySuccess, displayError } = useNotification();
  
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [mappingData, setMappingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Filter states
  const [roleFilter, setRoleFilter] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load users and locations in parallel
      const [usersResponse, locationsResponse, mappingsResponse] = await Promise.all([
        api.get('/users/users/'),
        api.get('/organization/locations/', { params: { is_active: true } }),
        api.get('/users/user-location-mappings/')
      ]);

      const usersData = usersResponse.data.results || usersResponse.data || [];
      const locationsData = locationsResponse.data.results || locationsResponse.data || [];
      const mappingsData = mappingsResponse.data.results || mappingsResponse.data || [];

      // Filter users based on role filter
      const filteredUsers = roleFilter 
        ? usersData.filter(user => user.role === roleFilter)
        : usersData;

      // Filter locations based on type filter
      const filteredLocations = locationTypeFilter
        ? locationsData.filter(loc => loc.location_type === locationTypeFilter)
        : locationsData;

      setUsers(filteredUsers);
      setLocations(filteredLocations);

      // Process mapping data into grid format
      const gridData = {};
      filteredUsers.forEach(user => {
        gridData[user.id] = {};
        filteredLocations.forEach(location => {
          gridData[user.id][location.id] = {
            back_office: false,
            pos: false
          };
        });
      });

      // Populate with existing mappings
      mappingsData.forEach(mapping => {
        if (gridData[mapping.user] && gridData[mapping.user][mapping.location]) {
          const accessType = mapping.access_type;
          if (accessType === 'back_office') {
            gridData[mapping.user][mapping.location].back_office = mapping.is_active;
          } else if (accessType === 'pos') {
            gridData[mapping.user][mapping.location].pos = mapping.is_active;
          } else if (accessType === 'both') {
            gridData[mapping.user][mapping.location].back_office = mapping.is_active;
            gridData[mapping.user][mapping.location].pos = mapping.is_active;
          }
        }
      });

      setMappingData(gridData);
    } catch (error) {
      console.error('Error loading mapping data:', error);
      setError('Failed to load user-location mapping data');
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (userId, locationId, accessType, value) => {
    setMappingData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [locationId]: {
          ...prev[userId][locationId],
          [accessType]: value
        }
      }
    }));
  };

  const handleSaveMappings = async () => {
    try {
      setSaving(true);
      
      // Convert mapping data to API format
      const mappings = [];
      Object.keys(mappingData).forEach(userId => {
        Object.keys(mappingData[userId]).forEach(locationId => {
          const mapping = mappingData[userId][locationId];
          
          // Add back_office mapping if checked
          if (mapping.back_office) {
            mappings.push({
              user_id: userId,
              location_id: locationId,
              access_type: 'back_office',
              is_active: true
            });
          }
          
          // Add POS mapping if checked
          if (mapping.pos) {
            mappings.push({
              user_id: userId,
              location_id: locationId,
              access_type: 'pos',
              is_active: true
            });
          }
        });
      });

      await api.post('/users/user-location-mappings/bulk/', { mappings });
      displaySuccess('User-location mappings saved successfully');
      
      // Reload data to get latest state
      await loadData();
    } catch (error) {
      console.error('Error saving mappings:', error);
      displayError('Failed to save user-location mappings');
    } finally {
      setSaving(false);
    }
  };

  const getLocationIcon = (locationType) => {
    switch (locationType) {
      case 'store':
        return <StoreIcon />;
      case 'headquarters':
        return <BusinessIcon />;
      default:
        return <LocationIcon />;
    }
  };

  const getLocationTypeColor = (locationType) => {
    switch (locationType) {
      case 'store':
        return 'success';
      case 'headquarters':
        return 'error';
      case 'warehouse':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'posmanager':
      case 'backofficemanager':
        return 'warning';
      case 'posuser':
      case 'backofficeuser':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          User-Location Mapping
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure location access for users. Check boxes to grant Back Office or POS access to specific locations.
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role Filter</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role Filter"
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="posmanager">POS Manager</MenuItem>
                <MenuItem value="posuser">POS User</MenuItem>
                <MenuItem value="backofficemanager">Back Office Manager</MenuItem>
                <MenuItem value="backofficeuser">Back Office User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Location Type</InputLabel>
              <Select
                value={locationTypeFilter}
                onChange={(e) => setLocationTypeFilter(e.target.value)}
                label="Location Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="store">Store</MenuItem>
                <MenuItem value="headquarters">Headquarters</MenuItem>
                <MenuItem value="warehouse">Warehouse</MenuItem>
                <MenuItem value="distribution">Distribution Center</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={showOnlyActive}
                  onChange={(e) => setShowOnlyActive(e.target.checked)}
                />
              }
              label="Show Only Active"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadData}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSaveMappings}
                disabled={saving || loading}
              >
                {saving ? 'Saving...' : 'Save Mappings'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Mapping Grid */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200, position: 'sticky', left: 0, zIndex: 3, bgcolor: 'background.paper' }}>
                  User
                </TableCell>
                <TableCell sx={{ minWidth: 100, position: 'sticky', left: 200, zIndex: 3, bgcolor: 'background.paper' }}>
                  Role
                </TableCell>
                {locations.map(location => (
                  <TableCell key={location.id} sx={{ minWidth: 150 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getLocationIcon(location.location_type)}
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {location.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {location.code}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ position: 'sticky', left: 0, zIndex: 2, bgcolor: 'background.paper' }}></TableCell>
                <TableCell sx={{ position: 'sticky', left: 200, zIndex: 2, bgcolor: 'background.paper' }}></TableCell>
                {locations.map(location => (
                  <TableCell key={`header-${location.id}`}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label="Back Office" 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                      <Chip 
                        label="POS" 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ position: 'sticky', left: 0, zIndex: 1, bgcolor: 'background.paper' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.full_name || user.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ position: 'sticky', left: 200, zIndex: 1, bgcolor: 'background.paper' }}>
                    <Chip
                      label={user.role}
                      size="small"
                      color={getRoleColor(user.role)}
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  {locations.map(location => (
                    <TableCell key={location.id}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Checkbox
                          size="small"
                          checked={mappingData[user.id]?.[location.id]?.back_office || false}
                          onChange={(e) => handleMappingChange(user.id, location.id, 'back_office', e.target.checked)}
                          disabled={saving}
                        />
                        <Checkbox
                          size="small"
                          checked={mappingData[user.id]?.[location.id]?.pos || false}
                          onChange={(e) => handleMappingChange(user.id, location.id, 'pos', e.target.checked)}
                          disabled={saving}
                        />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Legend */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legend
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox size="small" disabled />
                <Typography variant="body2">
                  Back Office Access - User can access back office functions at this location
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox size="small" disabled />
                <Typography variant="body2">
                  POS Access - User can access POS functions at this location
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserLocationMappingGrid;
