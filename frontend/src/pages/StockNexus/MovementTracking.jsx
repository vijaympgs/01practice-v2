import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

const MovementTracking = () => {
  return (
    <Box sx={{ p: 3 }}>
      <PageTitle 
        title="Core Stock Movement & Tracking" 
        subtitle="Stock reservation, allocation, and issuance processes"
        showIcon={true}
        icon={<LocalShipping />}
      />

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Core Stock Movement & Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This section handles all stock movement processes including reservation, allocation, and issuance.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Available Functions:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Stock Allocation - Reserve stock for specific purposes</li>
              <li>Stock Requisition - Request stock from warehouse</li>
              <li>Material Issuance - Issue materials to departments</li>
              <li>Stock Reservation - Reserve stock for orders</li>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MovementTracking;
