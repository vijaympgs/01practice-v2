import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CameraAlt as CameraIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const ProfileDialog = ({ open, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [locations, setLocations] = useState([]);
  const [sessionLocationId, setSessionLocationId] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(false);
  
  // Roles that can select session location
  // Note: 'superuser' is not a role choice in User model, but we check is_superuser flag separately
  const locationSelectionRoles = ['admin', 'backofficemanager', 'backofficeuser'];
  const isSuperuser = user?.is_superuser || user?.is_staff;
  // Normalize role: handle both string and object formats, trim whitespace, convert to lowercase
  const userRole = user?.role 
    ? String(user.role).trim().toLowerCase().replace(/\s+/g, '') // Remove spaces and convert to lowercase
    : '';
  const canSelectLocation = isSuperuser || 
                            userRole === 'admin' || 
                            (userRole && locationSelectionRoles.includes(userRole));

  // Load user data from Redux
  const [profile, setProfile] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.pos_location_name || 'Not assigned',
    role: user?.role || '',
    department: '',
    joinDate: user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : '',
    bio: '',
    notifications: {
      emailNotifications: true,
      salesAlerts: true,
      inventoryAlerts: true,
      securityAlerts: true,
      dailyReports: false,
    },
    privacy: {
      profileVisibility: 'internal',
      activityTracking: true,
      dataSharing: false,
    }
  });

  // Load locations and session location
  useEffect(() => {
    if (open && user) {
      // Update profile from user
      setProfile(prev => ({
        ...prev,
        firstName: user?.first_name || prev.firstName,
        lastName: user?.last_name || prev.lastName,
        email: user?.email || prev.email,
        phone: user?.phone || prev.phone,
        location: user?.pos_location_name || prev.location,
        role: user?.role || prev.role,
        joinDate: user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : prev.joinDate,
      }));

      // Get session location
      const sessionLocation = localStorage.getItem('session_location_id');
      if (sessionLocation) {
        setSessionLocationId(sessionLocation);
      }

      // Load locations for admin/backoffice users
      if (canSelectLocation) {
        loadLocations();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user, canSelectLocation]);

  const loadLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await api.get('/organization/locations/', {
        params: { location_type: 'store', is_active: true }
      });
      const locationsData = Array.isArray(response.data)
        ? response.data
        : (response.data?.results || []);
      setLocations(locationsData);
    } catch (error) {
      console.error('Error loading locations:', error);
      displayError('Failed to load locations');
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleSessionLocationChange = async (locationId) => {
    try {
      const selectedLocation = locations.find(loc => loc.id === locationId);
      if (selectedLocation) {
        localStorage.setItem('session_location_id', selectedLocation.id);
        localStorage.setItem('session_location_name', selectedLocation.name);
        localStorage.setItem('session_location_code', selectedLocation.code || '');
        localStorage.setItem('session_location_selected_at', new Date().toISOString());
        setSessionLocationId(locationId);
        displaySuccess(`Session location changed to "${selectedLocation.name}"`);
      }
    } catch (error) {
      displayError('Failed to update session location');
    }
  };

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedChange = (parentKey, key, value) => {
    setProfile(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    displaySuccess('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original user data
    if (user) {
      setProfile(prev => ({
        ...prev,
        firstName: user?.first_name || prev.firstName,
        lastName: user?.last_name || prev.lastName,
        email: user?.email || prev.email,
        phone: user?.phone || prev.phone,
        location: user?.pos_location_name || prev.location,
        role: user?.role || prev.role,
      }));
    }
  };

  const getInitials = () => {
    const first = profile.firstName?.[0] || '';
    const last = profile.lastName?.[0] || '';
    return (first + last).toUpperCase() || user?.username?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                fontSize: 24,
                fontWeight: 'bold'
              }}
            >
              {getInitials()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.role} • {profile.email}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              Personal Information
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profile.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                disabled={!isEditing}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                disabled={!isEditing}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                disabled={!isEditing}
                size="small"
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                disabled={!isEditing}
                size="small"
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assigned Location (POS)"
                value={profile.location}
                disabled
                size="small"
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                }}
                helperText="This is your assigned POS location. Contact administrator to change it."
              />
            </Grid>
            
            {/* Session Location Selector for Admin/Backoffice users */}
            {canSelectLocation && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={500}>
                    Session Location (Current Work Location)
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Location</InputLabel>
                  <Select
                    value={sessionLocationId || ''}
                    label="Select Location"
                    onChange={(e) => handleSessionLocationChange(e.target.value)}
                    disabled={loadingLocations}
                  >
                    {locations.length === 0 ? (
                      <MenuItem disabled value="">
                        {loadingLocations ? 'Loading...' : 'No locations available'}
                      </MenuItem>
                    ) : (
                      locations.map((location) => (
                        <MenuItem key={location.id} value={location.id}>
                          {location.name} {location.code ? `(${location.code})` : ''}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Select a location for this session. This does not modify your assigned location.
                  </Typography>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmailIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              Notification Preferences
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.notifications.emailNotifications}
                    onChange={(e) => handleNestedChange('notifications', 'emailNotifications', e.target.checked)}
                    disabled={!isEditing}
                    size="small"
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.notifications.salesAlerts}
                    onChange={(e) => handleNestedChange('notifications', 'salesAlerts', e.target.checked)}
                    disabled={!isEditing}
                    size="small"
                  />
                }
                label="Sales Alerts"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.notifications.inventoryAlerts}
                    onChange={(e) => handleNestedChange('notifications', 'inventoryAlerts', e.target.checked)}
                    disabled={!isEditing}
                    size="small"
                  />
                }
                label="Inventory Alerts"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.notifications.securityAlerts}
                    onChange={(e) => handleNestedChange('notifications', 'securityAlerts', e.target.checked)}
                    disabled={!isEditing}
                    size="small"
                  />
                }
                label="Security Alerts"
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
            <Typography variant="body2">
              <strong>Location Info:</strong> Your assigned location is set by administrator. 
              {canSelectLocation && ' You can change your session location above for the current session only.'}
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        <Button
          variant={isEditing ? "outlined" : "contained"}
          startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
          onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          color={isEditing ? "error" : "primary"}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
        {isEditing && (
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            color="success"
          >
            Save Changes
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;

