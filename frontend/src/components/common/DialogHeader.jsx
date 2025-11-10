import React, { useState, useEffect } from 'react';
import { DialogTitle, Box } from '@mui/material';

const DialogHeader = ({ 
  title, 
  icon = null,
  children,
  sx = {}
}) => {
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const themeResponse = await fetch('/api/theme/active-theme/');
        if (themeResponse.ok) {
          const themeData = await themeResponse.json();
          setThemeColor(themeData.primary_color || '#1976d2');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const headerStyles = {
    background: themeColor,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    ...sx
  };

  return (
    <DialogTitle sx={headerStyles}>
      <Box component="span">
        {title}
      </Box>
      {children}
    </DialogTitle>
  );
};

export default DialogHeader;





