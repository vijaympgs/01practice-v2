import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

const TransferConfirm = () => {
  return (
    <Box sx={{ p: 3 }}>
      <PageTitle 
        title="Transfer-to-Confirm (T2C)" 
        subtitle="Internal location transfers and stock movements"
        showIcon={true}
        icon={<LocalShipping />}
      />

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Transfer-to-Confirm (T2C)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This section manages all stock transfers within the organization's physical and legal entities.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Location Transfers:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <li>Stock Transfer Out (LTO) - Outbound transfer manifest</li>
              <li>Stock Transfer In (LTI) - Inbound transfer confirmation</li>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Cross-Entity Logistics (CEL):
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Intercompany Transfers (ICT) - Cross-entity transfers</li>
              <li>Legal Entity Movements</li>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransferConfirm;
