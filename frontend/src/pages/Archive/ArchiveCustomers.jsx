import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { ArrowBack, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchiveCustomers = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Legacy Customers (Archive)" 
            subtitle="Legacy customers interface for reference"
            showIcon={true}
            icon={<People />}
          />
          <Typography variant="body1" color="text.secondary">
            Legacy customer management interface for reference
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/customers')}
        >
          View Current Customers
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is the archived version of the Customers interface. The current enhanced version is available in Master Data Management.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legacy Customer Management Interface
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This archive contains the original customer management forms that were replaced 
            with the enhanced Customer management and Advanced Customer Master interfaces.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<People />}
              onClick={() => navigate('/customers')}
              sx={{ mr: 2 }}
            >
              Go to Current Customer Management
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/customer-management')}
            >
              Go to Advanced Customer Master
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArchiveCustomers;
