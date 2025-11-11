import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchiveProducts = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Legacy Products (Archive)" 
            subtitle="Legacy products interface for reference"
            showIcon={true}
            icon={<Inventory />}
          />
          <Typography variant="body1" color="text.secondary">
            Legacy product management interface for reference
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
        >
          View Current Products
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is the archived version of the Products interface. The current enhanced version is available in the Product Catalog.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legacy Product Management Interface
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This archive contains the original product management forms and interfaces that were replaced 
            with the enhanced Product Catalog and Enhanced Item Master in the Master Data Management section.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/products')}
              sx={{ mr: 2 }}
            >
              Go to Current Product Catalog
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/enhanced-item-master')}
            >
              Go to Enhanced Item Master
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArchiveProducts;
