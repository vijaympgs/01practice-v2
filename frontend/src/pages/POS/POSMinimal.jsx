import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const POSMinimal = () => {
  return (
    <Box sx={{ height: '100vh', p: 2 }}>
      <Paper sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PageTitle 
          title="POS SCREEN WORKING!" 
          subtitle="Minimal POS interface for testing"
          showIcon={true}
          icon={<ShoppingCart />}
        />
      </Paper>
    </Box>
  );
};

export default POSMinimal;



