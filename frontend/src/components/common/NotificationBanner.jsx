import React from 'react';
import { Box, Typography, IconButton, Alert } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

/**
 * Notification Banner Component
 * Displays error or success messages in a banner format with theme support
 * 
 * @param {Object} props
 * @param {string} props.type - 'error' or 'success'
 * @param {string} props.message - Main message text
 * @param {Array} props.items - Array of error items to display (optional)
 * @param {boolean} props.open - Whether to show the banner
 * @param {Function} props.onClose - Callback when banner is closed
 * @param {string} props.themeColor - Theme color for success banners (optional)
 */
const NotificationBanner = ({ 
  type = 'error', 
  message, 
  items = [], 
  open = true, 
  onClose,
  themeColor = '#1976d2'
}) => {
  if (!open || !message) return null;

  // Error styling (pale red background)
  const errorStyles = {
    backgroundColor: '#FFE5E5', // Pale red background
    borderLeft: '4px solid #D32F2F',
    color: '#D32F2F',
  };

  // Success styling (pale green background)
  const successStyles = {
    backgroundColor: '#E8F5E9', // Pale green background
    borderLeft: '4px solid #4CAF50',
    color: '#2E7D32',
  };

  const styles = type === 'error' ? errorStyles : successStyles;

  return (
    <Box
      sx={{
        ...styles,
        px: 3,
        py: 2,
        mb: 2,
        borderRadius: '4px',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ flex: 1, pr: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            mb: items.length > 0 ? 1 : 0,
            fontSize: '0.95rem',
          }}
        >
          {message}
        </Typography>
        {items && items.length > 0 && (
          <Box component="ul" sx={{ m: 0, pl: 3, fontSize: '0.9rem' }}>
            {items.map((item, index) => (
              <Typography
                key={index}
                component="li"
                variant="body2"
                sx={{
                  mb: 0.5,
                  '&:last-child': { mb: 0 },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
      {onClose && (
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: 'inherit',
            opacity: 0.7,
            '&:hover': {
              opacity: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default NotificationBanner;

