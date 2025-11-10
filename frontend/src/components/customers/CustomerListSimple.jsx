import React from 'react';
import {
  Box, Button, Typography, Container, Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const CustomerListSimple = ({ onAddCustomer, onEditCustomer, onViewCustomer }) => {
  
  const handleAddClick = () => {
    console.log('Add Customer button clicked!');
    if (onAddCustomer) {
      console.log('Calling onAddCustomer function');
      onAddCustomer();
    } else {
      console.log('ERROR: onAddCustomer function not provided');
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Customers
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            size="large"
          >
            Add Customer
          </Button>
        </Box>
        
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Customer List (Simplified for Testing)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click "Add Customer" button to test the form functionality
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CustomerListSimple;








