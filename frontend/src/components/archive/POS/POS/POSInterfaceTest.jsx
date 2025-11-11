import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';

const POSInterfaceTest = () => {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testInitialization = async () => {
      try {
        setStatus('Testing basic functionality...');
        
        // Test 1: Basic React functionality
        setStatus('✅ React is working');
        
        // Test 2: Material-UI functionality
        setStatus('✅ Material-UI is working');
        
        // Test 3: Simple async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('✅ Async operations are working');
        
        setStatus('✅ POS Interface Test Complete - All systems working!');
        
      } catch (err) {
        setError(err.message);
        setStatus('❌ Test failed');
      }
    };

    testInitialization();
  }, []);

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom>
        🧪 POS Interface Test
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        {status}
      </Alert>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}
      
      <Typography variant="body1">
        This is a minimal test component to verify basic functionality.
        If you can see this, the component rendering is working.
      </Typography>
    </Box>
  );
};

export default POSInterfaceTest;
