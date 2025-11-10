import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { ArrowBack, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchivePurchaseOrders = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Legacy Purchase Orders (Archive)" 
            subtitle="Legacy purchase orders interface for reference"
            showIcon={true}
            icon={<ShoppingCart />}
          />
          <Typography variant="body1" color="text.secondary">
            Legacy purchase order interface for reference
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/purchase-orders')}
        >
          View Current Purchase Orders
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is the archived version of the Purchase Orders interface. The current enhanced version is available in Source-to-Pay (S2P).
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legacy Purchase Order Interface
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This archive contains the original purchase order forms that were replaced 
            with the enhanced Source-to-Pay (S2P) workflow engine for comprehensive procurement management.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<Assignment />}
              onClick={() => navigate('/purchase-orders')}
              sx={{ mr: 2 }}
            >
              Go to Current Purchase Orders
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/procurement-workflows')}
            >
              Go to S2P Workflow Engine
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArchivePurchaseOrders;
