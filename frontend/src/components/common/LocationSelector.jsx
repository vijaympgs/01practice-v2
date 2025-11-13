import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Box,
  Typography,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import { useActiveOperation } from '../../contexts/ActiveOperationContext';

const LocationSelector = ({ 
  variant = 'header', 
  showLabel = true, 
  size = 'small',
  fullWidth = true,
  sx = {},
  onLocationChange,
}) => {
  const { user } = useSelector((state) => state.auth);
  const { displaySuccess, displayError, displayWarning } = useNotification();
  const { hasActiveOperation, getActiveOperationTypes, OPERATION_TYPES } = useActiveOperation();
  
  const [locations, setLocations] = useState([]);
  const [sessionLocationId, setSessionLocationId] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingLocationId, setPendingLocationId] = useState(null);

  // Determine if user can select locations
  const canSelectLocation = user && (
    user.is_superuser || 
    user.is_staff || 
    user.role === 'admin' || 
    user.role === 'backofficemanager' || 
    user.role === 'backofficeuser'
  );

  // Check if location switching is blocked
  const isLocationSwitchBlocked = hasActiveOperation();
  const activeOperationTypes = getActiveOperationTypes();

  // Load user's accessible locations
  useEffect(() => {
    if (user) {
      loadAccessibleLocations();
    }
  }, [user]);

  // Set session location from localStorage
  useEffect(() => {
    const sessionLocation = localStorage.getItem('session_location_id');
    if (sessionLocation && locations.some(loc => loc.id === sessionLocation)) {
      setSessionLocationId(sessionLocation);
    }
  }, [locations]);

  const loadAccessibleLocations = async () => {
    try {
      setLoadingLocations(true);
      
      // Use the new role-based API endpoint
      const response = await api.get(`/users/${user.id}/accessible-locations/`);
      const locationsData = Array.isArray(response.data) ? response.data : [];
      
      setLocations(locationsData);
      
      // If user has only one location, set it as default
      if (locationsData.length === 1) {
        const singleLocation = locationsData[0];
        localStorage.setItem('session_location_id', singleLocation.id);
        localStorage.setItem('session_location_name', singleLocation.name);
        localStorage.setItem('session_location_code', singleLocation.code || '');
        setSessionLocationId(singleLocation.id);
      }
    } catch (error) {
      console.error('Error loading accessible locations:', error);
      displayError('Failed to load accessible locations');
      setLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleLocationChange = async (locationId) => {
    // Check if location switching is blocked
    if (isLocationSwitchBlocked) {
      setPendingLocationId(locationId);
      setShowWarningDialog(true);
      return;
    }

    await performLocationChange(locationId);
  };

  const performLocationChange = async (locationId) => {
    try {
      setLoading(true);
      
      const selectedLocation = locations.find(loc => loc.id === locationId);
      if (!selectedLocation) {
        displayError('Selected location not found');
        return;
      }

      // Update localStorage
      localStorage.setItem('session_location_id', selectedLocation.id);
      localStorage.setItem('session_location_name', selectedLocation.name);
      localStorage.setItem('session_location_code', selectedLocation.code || '');
      localStorage.setItem('session_location_selected_at', new Date().toISOString());
      
      setSessionLocationId(locationId);
      
      displaySuccess(`Location changed to "${selectedLocation.name}"`);
      
      // Call parent callback if provided
      if (onLocationChange) {
        onLocationChange(selectedLocation);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      displayError('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const forceLocationChange = () => {
    setShowWarningDialog(false);
    if (pendingLocationId) {
      performLocationChange(pendingLocationId);
      setPendingLocationId(null);
    }
  };

  const cancelLocationChange = () => {
    setShowWarningDialog(false);
    setPendingLocationId(null);
  };

  // Don't render if user cannot select locations
  if (!user || !canSelectLocation) {
    return null;
  }

  // For single location users, show disabled selector
  const isSingleLocation = locations.length === 1;

  return (
    <>
      <Box sx={{ ...sx }}>
        {isLocationSwitchBlocked && (
          <Alert 
            severity="warning" 
            sx={{ mb: 1, py: 0.5 }}
            icon={<WarningIcon fontSize="small" />}
          >
            <Typography variant="caption">
              Location switching is disabled during: {activeOperationTypes.join(', ')}
            </Typography>
          </Alert>
        )}
        
        <Tooltip 
          title={
            isSingleLocation 
              ? "Single location access - location switching not available" 
              : isLocationSwitchBlocked 
                ? "Location switching is disabled during active operations"
                : ""
          }
        >
          <FormControl 
            size={size} 
            fullWidth={fullWidth}
            disabled={loadingLocations || loading || isSingleLocation}
          >
            {showLabel && <InputLabel>Location</InputLabel>}
            <Select
              value={sessionLocationId || ''}
              label={showLabel ? "Location" : undefined}
              onChange={(e) => handleLocationChange(e.target.value)}
              disabled={loadingLocations || loading || isSingleLocation}
              startAdornment={
                isLocationSwitchBlocked && (
                  <Tooltip title="Location switching is disabled during active operations">
                    <LockIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                  </Tooltip>
                )
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isLocationSwitchBlocked ? 'rgba(255, 152, 0, 0.08)' : 
                                   isSingleLocation ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  '&.Mui-disabled': {
                    backgroundColor: isSingleLocation ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.12)',
                    opacity: isSingleLocation ? 0.8 : 1,
                  },
                },
              }}
            >
            {locations.length === 0 ? (
              <MenuItem disabled value="">
                {loadingLocations ? 'Loading...' : 'No locations available'}
              </MenuItem>
            ) : (
              locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" />
                    <Box>
                      <Typography variant="body2">{location.name}</Typography>
                      {location.code && (
                        <Typography variant="caption" color="text.secondary">
                          {location.code}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </MenuItem>
              ))
            )}
          </Select>
          </FormControl>
        </Tooltip>
      </Box>

      {/* Warning Dialog for Active Operations */}
      <Dialog 
        open={showWarningDialog} 
        onClose={cancelLocationChange}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            Active Operations Detected
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You have active operations that may be lost if you switch locations:
          </Typography>
          <Box sx={{ ml: 2 }}>
            {activeOperationTypes.map((operationType, index) => (
              <Chip
                key={index}
                label={operationType.replace('_', ' ').toUpperCase()}
                size="small"
                color="warning"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            It's recommended to complete or save your current work before switching locations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLocationChange} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={forceLocationChange} 
            variant="contained" 
            color="warning"
            startIcon={<WarningIcon />}
          >
            Switch Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LocationSelector;
