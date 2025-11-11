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

  // Roles that need location selection
  const locationSelectionRoles = ['admin', 'backofficemanager', 'backofficeuser'];
  const needsLocationSelection = user && locationSelectionRoles.includes(user.role);

  // Redirect if user is not authenticated or doesn't need location selection
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!needsLocationSelection) {
      navigate('/');
      return;
    }
    
    // Load locations only if user is authenticated and needs location selection
    loadLocations();
  }, [user, needsLocationSelection, navigate]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user's accessible locations based on role
      const response = await api.get(`/users/${user.id}/accessible-locations/`);
      
      const locationsData = Array.isArray(response.data)
        ? response.data
        : (response.data?.results || []);

      setLocations(locationsData);

      // Pre-select user's default location
      if (locationsData.length > 0) {
        // Try to get user's default location
        try {
          const defaultResponse = await api.get(`/users/${user.id}/default-location/`);
          if (defaultResponse.data && defaultResponse.data.id) {
            setSelectedLocationId(defaultResponse.data.id);
          } else {
            // Fallback to first location
            setSelectedLocationId(locationsData[0].id);
          }
        } catch (defaultError) {
          // Fallback to first location
          setSelectedLocationId(locationsData[0].id);
        }
      }

      if (locationsData.length === 0) {
        setError('No accessible locations found for your role. Please contact administrator.');
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      setError('Failed to load locations. Please try again or contact administrator.');
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
      // Store location in session (localStorage)
      localStorage.setItem('session_location_id', selectedLocation.id);
      localStorage.setItem('session_location_name', selectedLocation.name);
      localStorage.setItem('session_location_code', selectedLocation.code || '');
      localStorage.setItem('session_location_selected_at', new Date().toISOString());

      displaySuccess(`Location "${selectedLocation.name}" selected. You can change it anytime from settings.`);

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      setError('Selected location not found. Please try again.');
      setSubmitting(false);
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

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleSkip}
              disabled={submitting}
              sx={{ borderRadius: 2 }}
            >
              Skip for Now
            </Button>
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
