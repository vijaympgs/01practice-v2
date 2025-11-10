import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Inventory } from '@mui/icons-material';

const InitialSetup = () => {
  return (
    <Box sx={{ p: 3 }}>
      <PageTitle 
        title="Initial Setup & Global View" 
        subtitle="System initialization and global inventory view"
        showIcon={true}
        icon={<Inventory />}
      />

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Initial Setup & Global View
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This section manages the initial setup and provides a global view of inventory operations.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Available Functions:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>System Go-Live - Opening Stock Entry</li>
              <li>Global Inventory Dashboard</li>
              <li>System Configuration</li>
              <li>Initial Data Import</li>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InitialSetup;
