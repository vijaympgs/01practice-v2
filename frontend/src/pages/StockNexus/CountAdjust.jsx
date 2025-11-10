import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Assessment } from '@mui/icons-material';

const CountAdjust = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Assessment sx={{ mr: 2, fontSize: 40, color: 'secondary.main' }} />
        <Box>
        <PageTitle 
          title="Count-to-Adjust (C2A)" 
          subtitle="Stock count adjustment and reconciliation"
          showIcon={true}
          icon={<Calculate />}
        />
          <Typography variant="body1" color="text.secondary">
            Physical count and inventory reconciliation
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Count-to-Adjust (C2A)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This section focuses on confirming the physical reality of your stock and correcting the system records.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Inventory Accuracy Cycle (IAC):
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <li>Stock Take - Physical inventory counting</li>
              <li>Stock Freeze - Lock inventory for counting</li>
              <li>Stock Adjustment - Variance reconciliation</li>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Additional Functions:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Count Scope Lock</li>
              <li>Counting Area Definition</li>
              <li>Count Sheet Entry</li>
              <li>Variance Reconciliation & Posting</li>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CountAdjust;
