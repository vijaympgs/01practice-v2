import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import PageTitle from '../../components/common/PageTitle';
import SidebarSettings from '../../components/SidebarSettings';

const LayoutPreferencesPage = () => {
  const handleSaveSettings = (preferences) => {
    console.log('Sidebar settings saved:', preferences);
    // Custom save logic can be implemented here
  };

  const handleResetSettings = () => {
    console.log('Sidebar settings reset to defaults');
    // Custom reset logic can be implemented here
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 4, pb: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <PageTitle 
            title="Layout Preferences" 
            subtitle="Customize application layout and display settings"
            showIcon={true}
            icon={<Settings />}
          />
          <Typography variant="body2" color="text.secondary">
            Customize your sidebar and layout preferences
          </Typography>
        </Box>

        {/* Sidebar Settings Component */}
        <SidebarSettings 
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
        />

        {/* Information */}
        <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            📋 Development Notes
          </Typography>
          <Typography variant="body2" paragraph>
            This page demonstrates our <strong>MASTER Data</strong> form template:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">
              ✅ <strong>Decoupled Settings</strong>: Sidebar settings can be enabled/disabled independently
            </Typography>
            <Typography component="li" variant="body2">
              ✅ <strong>Standalone Component</strong>: Settings component works without LayoutContext dependency
            </Typography>
            <Typography component="li" variant="body2">
              ✅ <strong>Professional Validation</strong>: Real-time error checking and feedback
            </Typography>
            <Typography component="li" variant="body2">
              ✅ <strong>Easy Integration</strong>: Can be used in any page or dialog
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            Settings are automatically saved to localStorage and can be synchronized with backend when needed.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};


export default LayoutPreferencesPage;
