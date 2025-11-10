import React from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import { Container, Typography, Box, Button } from '@mui/material';

const ProductsBasic = () => {
  const handleTest = () => {
    alert('Products Basic page is working!');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <PageTitle 
          title="Products Basic Page" 
          subtitle="This is a very basic Products page to test if the route is working"
          showIcon={true}
        />

        <Button variant="contained" onClick={handleTest}>
          Test Button
        </Button>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Debug Info:
          </Typography>
          <Typography variant="body2">
            Current URL: {window.location.href}
          </Typography>
          <Typography variant="body2">
            Page loaded at: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsBasic;

































