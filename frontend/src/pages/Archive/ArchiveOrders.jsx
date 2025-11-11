import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { ArrowBack, Receipt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchiveOrders = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Legacy Orders (Archive)" 
            subtitle="Legacy orders interface for reference"
            showIcon={true}
            icon={<Assignment />}
          />
          <Typography variant="body1" color="text.secondary">
            Legacy orders interface for reference
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
        >
          View Current Orders
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is the archived version of the Orders interface. The current enhanced version is available in Lead-to-Cash (L2C).
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legacy Orders Interface
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This archive contains the original orders management forms that were replaced 
            with the enhanced Sales Order Management workflow in the Lead-to-Cash (L2C) section.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<Receipt />}
              onClick={() => navigate('/orders')}
              sx={{ mr: 2 }}
            >
              Go to Current Orders
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/sales-order-management')}
            >
              Go to Sales Order Management
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArchiveOrders;
