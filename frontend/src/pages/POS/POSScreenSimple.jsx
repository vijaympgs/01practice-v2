import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
} from '@mui/material';

const POSScreenSimple = () => {
  const [testState, setTestState] = useState('Working');

  return (
    <Box sx={{ height: '100vh', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Column - Search */}
        <Grid item xs={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Product Search</Typography>
            <Typography variant="body2">Simplified POS - No Redux, No API calls</Typography>
            <Typography variant="h3">Test State: {testState}</Typography>
          </Paper>
        </Grid>

        {/* Right Column - Cart */}
        <Grid item xs={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Shopping Cart</Typography>
            <Typography variant="body1">This is the cart area</Typography>
            <Button variant="contained" onClick={() => setTestState(testState === 'Working' ? 'Great!' : 'Working')}>
              Click Me
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POSScreenSimple;



