import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  Button,
  Divider,
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const DEFAULT_PREFERENCES = {
  sidebar_width: 280,
  sidebar_position: 'left',
  sidebar_theme: 'dark',
  sidebar_background_color: '#212121',
  sidebar_auto_collapse: false,
  sidebar_show_icons: true,
  sidebar_show_labels: true,
  sidebar_compact_mode: false,
};

// Predefined color options for sidebar background
const SIDEBAR_COLORS = [
  { name: 'Dark Gray', value: '#212121', label: 'Professional' },
  { name: 'Charcoal', value: '#424242', label: 'Modern' },
  { name: 'Navy Blue', value: '#1a237e', label: 'Corporate' },
  { name: 'Deep Purple', value: '#4a148c', label: 'Elegant' },
  { name: 'Dark Green', value: '#1b5e20', label: 'Natural' },
  { name: 'Maroon', value: '#b71c1c', label: 'Warm' },
  { name: 'Black', value: '#000000', label: 'Minimalist' },
  { name: 'Light Gray', value: '#f5f5f5', label: 'Bright' },
  { name: 'White', value: '#ffffff', label: 'Clean' },
];

const SidebarSettings = ({ onSave, onReset }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('sidebarPreferences');
    if (saved) {
      try {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(saved) });
      } catch (error) {
        console.error('Error loading sidebar preferences:', error);
      }
    }
  }, []);

  const handleChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('sidebarPreferences', JSON.stringify(preferences));
      if (onSave) onSave(preferences);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setHasChanges(true);
    if (onReset) onReset();
  };

  return (
    <Card sx={{ maxWidth: 600, m: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Sidebar Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure sidebar display preferences
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Sidebar Width: {preferences.sidebar_width}px
          </Typography>
          <Slider
            value={preferences.sidebar_width}
            onChange={(e, value) => handleChange('sidebar_width', value)}
            min={200}
            max={400}
            step={20}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Sidebar Position</InputLabel>
            <Select
              value={preferences.sidebar_position}
              label="Sidebar Position"
              onChange={(e) => handleChange('sidebar_position', e.target.value)}
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="right">Right</MenuItem>
              <MenuItem value="top">Top</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sidebar Theme</InputLabel>
              <Select
                value={preferences.sidebar_theme}
                label="Sidebar Theme"
                onChange={(e) => handleChange('sidebar_theme', e.target.value)}
              >
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="auto">Auto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Background Color</InputLabel>
              <Select
                value={preferences.sidebar_background_color}
                label="Background Color"
                onChange={(e) => handleChange('sidebar_background_color', e.target.value)}
              >
                {SIDEBAR_COLORS.map((color) => (
                  <MenuItem key={color.value} value={color.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color.value,
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                        }}
                      />
                      <Box>
                        <Typography variant="body2">{color.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {color.label}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Custom Color:</Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: preferences.sidebar_background_color,
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <TextField
                size="small"
                label="Hex Color"
                value={preferences.sidebar_background_color}
                onChange={(e) => handleChange('sidebar_background_color', e.target.value)}
                placeholder="#212121"
                sx={{ width: 120 }}
                inputProps={{ 
                  pattern: '^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$',
                  maxLength: 7 
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Behavior
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.sidebar_auto_collapse}
                onChange={(e) => handleChange('sidebar_auto_collapse', e.target.checked)}
              />
            }
            label="Auto collapse on mobile"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.sidebar_show_icons}
                onChange={(e) => handleChange('sidebar_show_icons', e.target.checked)}
              />
            }
            label="Show icons"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.sidebar_show_labels}
                onChange={(e) => handleChange('sidebar_show_labels', e.target.checked)}
              />
            }
            label="Show labels"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.sidebar_compact_mode}
                onChange={(e) => handleChange('sidebar_compact_mode', e.target.checked)}
              />
            }
            label="Compact mode"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save Preferences
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SidebarSettings;
