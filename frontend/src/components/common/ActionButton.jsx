import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

const ActionButton = ({ 
  children, 
  variant = 'contained',
  sx = {},
  ...props 
}) => {
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        setThemeColor(themeData.activeColor || '#1976d2');
      } catch (error) {
        console.log('Error parsing saved theme:', error);
      }
    }
  }, []);

  // Convert hex to RGB for rgba
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '25, 118, 210'; // Default blue RGB
  };

  const buttonStyles = {
    bgcolor: `rgba(${hexToRgb(themeColor)}, 0.2)`,
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: `1px solid rgba(${hexToRgb(themeColor)}, 0.3)`,
    borderRadius: 0,
    px: 3,
    py: 1,
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.95rem',
    '&:hover': {
      bgcolor: `rgba(${hexToRgb(themeColor)}, 0.3)`,
      transform: 'scale(1.05)'
    },
    '&:disabled': {
      bgcolor: 'rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.5)',
      transform: 'none'
    },
    transition: 'all 0.3s ease',
    ...sx
  };

  return (
    <Button variant={variant} sx={buttonStyles} {...props}>
      {children}
    </Button>
  );
};

export default ActionButton;
