import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box, Typography, Button, Paper } from '@mui/material';
import { LocationOn, MyLocation } from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMap = ({ 
  latitude, 
  longitude, 
  onLocationChange, 
  locationName = "Location",
  height = "400px",
  editable = true 
}) => {
  const [position, setPosition] = useState([latitude || 40.7128, longitude || -74.0060]); // Default to NYC
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Update map position when latitude/longitude props change (from user input)
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      const newPosition = [parseFloat(latitude), parseFloat(longitude)];
      setPosition(newPosition);
    }
  }, [latitude, longitude]);

  const handleMapClick = (e) => {
    if (editable && isEditing) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onLocationChange(newPosition[0], newPosition[1]);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = [position.coords.latitude, position.coords.longitude];
          setPosition(newPosition);
          onLocationChange(newPosition[0], newPosition[1]);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  // Component to update map center when coordinates change
  const MapUpdater = () => {
    const map = useMapEvents({});
    
    useEffect(() => {
      if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
        const newPosition = [parseFloat(latitude), parseFloat(longitude)];
        map.setView(newPosition, map.getZoom());
      }
    }, [latitude, longitude, map]);
    
    return null;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: height }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn color="primary" />
          Map Location
        </Typography>
        {editable && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={isEditing ? "contained" : "outlined"}
              size="small"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done Editing" : "Edit Location"}
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MyLocation />}
              onClick={getCurrentLocation}
            >
              Use Current Location
            </Button>
          </Box>
        )}
      </Box>

      {isEditing && editable && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Click on the map to set the location coordinates
        </Typography>
      )}

      <Box sx={{ height: 'calc(100% - 80px)', borderRadius: 1, overflow: 'hidden' }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={position}>
            <Popup>
              <Typography variant="body2">
                <strong>{locationName}</strong><br />
                Lat: {position[0].toFixed(6)}<br />
                Lng: {position[1].toFixed(6)}
              </Typography>
            </Popup>
          </Marker>

          {editable && <MapClickHandler />}
          <MapUpdater />
        </MapContainer>
      </Box>

      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </Typography>
        {editable && (
          <Typography variant="caption" color="text.secondary">
            {isEditing ? "Click on map to set location" : "Click 'Edit Location' to modify"}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default LocationMap;
