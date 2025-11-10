import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
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
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const ProfilePage = () => {
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
    if (user) {
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
  }, [user, canSelectLocation]);

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
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    alert('Changes discarded.');
  };

  const getInitials = () => {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: '1.8rem', // Consistent with dashboard
            fontWeight: 600,
            lineHeight: 1.2
          }}
        >
          👤 User Profile
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: '0.875rem', // 14px - smaller secondary text
            fontWeight: 400,
            lineHeight: 1.4,
            mt: 0.5
          }}
        >
          Manage your personal information, preferences, and account settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: 32,
                      fontWeight: 'bold'
                    }}
                  >
                    {getInitials()}
                  </Avatar>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      bgcolor: 'background.paper',
                      border: '2px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'background.paper'
                      }
                    }}
                  >
                    <CameraIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {profile.role} • {profile.department}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label={profile.role} size="small" color="primary" variant="outlined" />
                    <Chip label={`Joined ${profile.joinDate}`} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {profile.email} • {profile.phone}
                  </Typography>
                </Box>

                <Box>
                  <Button
                    variant={isEditing ? "contained" : "outlined"}
                    startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    color={isEditing ? "success" : "primary"}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      sx={{ ml: 1 }}
                      color="error"
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Personal Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    disabled={!isEditing}
                    helperText="Brief description about yourself"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                Contact Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Assigned Location (POS)"
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    disabled
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    helperText="This is your assigned POS location. Contact administrator to change it."
                  />
                </Grid>
                
                {/* Session Location Selector for Admin/Backoffice users */}
                {canSelectLocation && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <BusinessIcon sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" fontWeight={500}>
                        Session Location (Current Work Location)
                      </Typography>
                    </Box>
                    <FormControl fullWidth>
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
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.emailNotifications}
                        onChange={(e) => handleNestedChange('notifications', 'emailNotifications', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.salesAlerts}
                        onChange={(e) => handleNestedChange('notifications', 'salesAlerts', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Sales Alerts"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.inventoryAlerts}
                        onChange={(e) => handleNestedChange('notifications', 'inventoryAlerts', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Inventory Alerts"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.securityAlerts}
                        onChange={(e) => handleNestedChange('notifications', 'securityAlerts', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Security Alerts"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.dailyReports}
                        onChange={(e) => handleNestedChange('notifications', 'dailyReports', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Daily Reports"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Privacy Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.privacy.activityTracking}
                        onChange={(e) => handleNestedChange('privacy', 'activityTracking', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Activity Tracking"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.privacy.dataSharing}
                        onChange={(e) => handleNestedChange('privacy', 'dataSharing', e.target.checked)}
                        disabled={!isEditing}
                      />
                    }
                    label="Data Sharing"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Information
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                For security-related changes like password, two-factor authentication, or access permissions, 
                please contact your system administrator.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Last login: Today 2:30 PM • Last password change: January 15, 2024 • 
                Two-factor authentication: Disabled • Account status: Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
