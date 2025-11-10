import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const BuildInfo = () => {
  const now = new Date();
  const buildTime = now.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      fontSize: '0.75rem',
      opacity: 0.7,
      mt: 0.5
    }}>
      <Chip 
        label={`v1.0`} 
        size="small" 
        color="primary" 
        variant="outlined"
        sx={{ fontSize: '0.7rem', height: '18px' }}
      />
      <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
        Built: {buildTime}
      </Typography>
    </Box>
  );
};

export default BuildInfo;



