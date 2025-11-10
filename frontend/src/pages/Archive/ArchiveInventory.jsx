import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Inventory } from '@mui/icons-material';

const ArchiveInventory = () => {
  return (
    <Box sx={{ p: 3 }}>
      <PageTitle 
        title="Archive - Legacy Inventory" 
        subtitle="Legacy inventory management interface for reference"
        showIcon={true}
        icon={<Inventory />}
      />

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legacy Inventory Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This was the original inventory management interface that has been replaced by the new Stock Nexus structure.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Replaced by:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>📦 Stock Nexus - Initial Setup & Global View</li>
              <li>📦 Stock Nexus - Core Stock Movement & Tracking</li>
              <li>📦 Stock Nexus - T2C (Transfer-to-Confirm)</li>
              <li>📦 Stock Nexus - Count-to-Adjust (C2A)</li>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArchiveInventory;
