import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import PageTitle from '../../components/common/PageTitle';

// Debug switch - Set to 'true' to enable detailed debugging logs
const DEBUG_MODE = false;

/**
 * Location Selection Page
 * 
 * Appears after login for admin/backoffice users who need to select a location
 * to work with. This location is stored in session (localStorage) and does not
 * modify the user's profile.
 * 
 * Rules:
 * - Only shown for admin/backoffice users (admin, backofficemanager, backofficeuser)
 * - POS users (posuser, posmanager) skip this page and use their assigned location
 * - Selected location is stored in session only, not in user profile
 * - Location can be changed anytime from user profile/settings
 */
const LocationSelectionPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { displaySuccess, displayError } = useNotification();

  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Roles that need location selection
  const locationSelectionRoles = ['admin', 'backofficemanager', 'backofficeuser'];
  const needsLocationSelection = user && locationSelectionRoles.includes(user.role);

  // Add useEffect to load locations when component mounts
  useEffect(() => {
    if (DEBUG_MODE) {
      console.log('🎯 LocationSelectionPage: Component mounted');
      console.log('👤 LocationSelectionPage: User in useEffect:', user);
      console.log('🔍 LocationSelectionPage: needsLocationSelection:', needsLocationSelection);
    }
    
    if (needsLocationSelection) {
      if (DEBUG_MODE) console.log('🚀 LocationSelectionPage: Calling loadLocations from useEffect');
      loadLocations();
    } else {
      if (DEBUG_MODE) console.log('⏭️ LocationSelectionPage: Skipping location load - user does not need location selection');
      setLoading(false);
    }
  }, [user, needsLocationSelection]);

  const loadLocations = async () => {
    try {
      if (DEBUG_MODE) console.log('🚀 LocationSelectionPage: Starting loadLocations...');
      setLoading(true);
      setError('');

      if (DEBUG_MODE) {
        console.log('🔄 LocationSelectionPage: Loading locations...');
        console.log('👤 LocationSelectionPage: User:', user);
        console.log('🔑 LocationSelectionPage: Token exists:', !!localStorage.getItem('accessToken'));
        console.log('🌐 LocationSelectionPage: API Base URL:', import.meta.env.VITE_API_BASE_URL || '/api');
      }

      const response = await api.get('/organization/locations/', {
        params: { location_type: 'store', is_active: true }
      });

      if (DEBUG_MODE) {
        console.log('✅ LocationSelectionPage: API Response received:', response.status);
        console.log('📊 LocationSelectionPage: Response data:', response.data);
      }

      const locationsData = Array.isArray(response.data)
        ? response.data
        : (response.data?.results || []);

      // Filter to only store locations
      const storeLocations = locationsData.filter(
        loc => loc.location_type === 'store' && loc.is_active
      );

      if (DEBUG_MODE) console.log('📍 Store locations found:', storeLocations.length);
      setLocations(storeLocations);

      // Pre-select user's assigned location if available
      if (user?.pos_location_id) {
        const userLocation = storeLocations.find(loc => loc.id === user.pos_location_id);
        if (userLocation) {
          setSelectedLocationId(user.pos_location_id);
          if (DEBUG_MODE) console.log('🎯 Pre-selected user location:', userLocation.name);
        }
      }

      if (storeLocations.length === 0) {
        setError('No active store locations found. Please contact administrator to create locations.');
      }
    } catch (error) {
      console.error('❌ Error loading locations:', error);
      if (DEBUG_MODE) {
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
      }

      // Provide more specific error messages
      if (error.response?.status === 401) {
        setError('Authentication error. Please log in again.');
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to access locations. Please contact administrator.');
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setError('Request timeout. The server is taking too long to respond. Please try again.');
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setError('Network error. Unable to connect to the server. Please check your connection.');
      } else {
        setError(`Failed to load locations: ${error.message || 'Unknown error'}. Please try again or contact administrator.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    setSelectedLocationId(e.target.value);
    setError('');
  };

  const handleContinue = () => {
    if (!selectedLocationId) {
      setError('Please select a location to continue.');
      return;
    }

    setSubmitting(true);

    // Find selected location details
    const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

    if (selectedLocation) {
      if (DEBUG_MODE) console.log('💾 LocationSelectionPage: Saving location to session:', selectedLocation);
      
      // Store location in session (localStorage)
      localStorage.setItem('session_location_id', selectedLocation.id);
      localStorage.setItem('session_location_name', selectedLocation.name);
      localStorage.setItem('session_location_code', selectedLocation.code || '');
      localStorage.setItem('session_location_selected_at', new Date().toISOString());

      // Verify the data was saved
      const savedLocation = {
        session_location_id: localStorage.getItem('session_location_id'),
        session_location_name: localStorage.getItem('session_location_name'),
        session_location_code: localStorage.getItem('session_location_code'),
        session_location_selected_at: localStorage.getItem('session_location_selected_at')
      };
      if (DEBUG_MODE) console.log('✅ LocationSelectionPage: Saved session data:', savedLocation);

      displaySuccess(`Location "${selectedLocation.name}" selected. You can change it anytime from settings.`);

      // Navigate to dashboard
      setTimeout(() => {
        if (DEBUG_MODE) console.log('🚀 LocationSelectionPage: Navigating to dashboard...');
        navigate('/');
      }, 500);
    } else {
      setError('Selected location not found. Please try again.');
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
      loadLocations();
    } else {
      setError('Maximum retry attempts reached. Please skip location selection for now or contact administrator.');
    }
  };

  const handleSkip = () => {
    // Skip location selection - user can select later
    // This is useful for admins who might want to work across all locations
    localStorage.setItem('session_location_skipped', 'true');
    localStorage.setItem('session_location_skipped_at', new Date().toISOString());

    displaySuccess('Location selection skipped. You can select a location anytime from your profile.');

    navigate('/');
  };

  const handleUseAssignedLocation = () => {
    // Use user's assigned location as fallback
    if (user?.pos_location_id && user?.pos_location_name) {
      localStorage.setItem('session_location_id', user.pos_location_id);
      localStorage.setItem('session_location_name', user.pos_location_name);
      localStorage.setItem('session_location_code', user.pos_location_code || '');
      localStorage.setItem('session_location_selected_at', new Date().toISOString());

      displaySuccess(`Using your assigned location: ${user.pos_location_name}`);

      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      displayError('No assigned location found. Please skip location selection or contact administrator.');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'white',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LocationIcon sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
            <PageTitle
              title="Select Location"
              subtitle="Choose a location to work with for this session"
              variant="h4"
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> This location selection is for this session only and does not
              modify your user profile. POS users will use their assigned location automatically.
            </Typography>
          </Alert>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Location *</InputLabel>
            <Select
              value={selectedLocationId}
              label="Select Location *"
              onChange={handleLocationChange}
              disabled={submitting || locations.length === 0}
              required
            >
              {locations.length === 0 ? (
                <MenuItem disabled value="">
                  No locations available
                </MenuItem>
              ) : (
                locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name} {location.code ? `(${location.code})` : ''}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {user?.pos_location_name && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                Your assigned location: <strong>{user.pos_location_name}</strong>
                {selectedLocationId === user.pos_location_id && ' (Currently Selected)'}
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={handleSkip}
              disabled={submitting}
              sx={{ borderRadius: 2 }}
            >
              Skip for Now
            </Button>
            
            {/* Show retry button when there's an error and locations failed to load */}
            {error && locations.length === 0 && retryCount < 3 && (
              <Button
                variant="outlined"
                color="warning"
                onClick={handleRetry}
                disabled={submitting}
                sx={{ borderRadius: 2 }}
              >
                Retry ({retryCount + 1}/3)
              </Button>
            )}
            
            {/* Show use assigned location button when user has assigned location */}
            {error && locations.length === 0 && user?.pos_location_id && (
              <Button
                variant="outlined"
                color="success"
                onClick={handleUseAssignedLocation}
                disabled={submitting}
                sx={{ borderRadius: 2 }}
              >
                Use Assigned Location
              </Button>
            )}
            
            <Button
              variant="contained"
              onClick={handleContinue}
              disabled={submitting || !selectedLocationId || locations.length === 0}
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 2 }}
            >
              {submitting ? 'Continue...' : 'Continue'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              You can change the location anytime from your profile or settings.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LocationSelectionPage;
