import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { ArrowBack, Business } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchiveSuppliers = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Legacy Suppliers (Archive)" 
            subtitle="Legacy suppliers interface for reference"
            showIcon={true}
            icon={<Business />}
          />
          <Typography variant="body1" color="text.secondary">
            Legacy supplier/vendor management interface for reference
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/suppliers')}
        >
          View Current Vendors
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is the archived version of the Suppliers interface. The current enhanced version is available in Master Data Management.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legacy Supplier Management Interface
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This archive contains the original supplier management forms that were replaced 
            with the enhanced Vendor management interface in the Master Data Management section.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<Business />}
              onClick={() => navigate('/suppliers')}
              sx={{ mr: 2 }}
            >
              Go to Current Vendor Management
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArchiveSuppliers;
