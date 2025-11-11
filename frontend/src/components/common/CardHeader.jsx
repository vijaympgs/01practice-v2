import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import themeService from '../../services/themeService';

const CardHeader = ({ 
  title, 
  children, 
  sx = {},
  titleVariant = 'h6',
  titleSx = {}
}) => {
  const [themeColor, setThemeColor] = useState('#1565C0'); // Default Deep Blue
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        const themeColors = await themeService.getThemeColors();
        setThemeColor(themeColors.primary);
      } catch (error) {
        console.error('Error loading theme for CardHeader:', error);
        // Keep default color if theme loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const headerStyles = {
    background: themeColor,
    color: 'white',
    p: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 0,
    ...sx
  };

  const titleStyles = {
    fontWeight: 600,
    color: 'white',
    ...titleSx
  };

  // Show loading state if theme is still loading
  if (isLoading) {
    return (
      <Box sx={{
        background: '#1976d2',
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 0,
        ...sx
      }}>
        <Typography variant={titleVariant} sx={titleStyles}>
          {title}
        </Typography>
        {children}
      </Box>
    );
  }

  return (
    <Box sx={headerStyles}>
      <Typography variant={titleVariant} sx={titleStyles}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default CardHeader;

