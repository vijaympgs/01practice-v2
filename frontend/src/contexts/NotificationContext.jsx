import React, { createContext, useContext, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import NotificationBanner from '../components/common/NotificationBanner';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    type: 'error', // 'error' or 'success'
    message: '',
    items: [],
  });
  const [themeColor, setThemeColor] = useState('#1976d2');

  // Load theme color from localStorage
  React.useEffect(() => {
    const loadTheme = () => {
      try {
        const cachedTheme = localStorage.getItem('activeTheme');
        if (cachedTheme) {
          const parsedTheme = JSON.parse(cachedTheme);
          setThemeColor(parsedTheme.primary_color || '#1976d2');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();

    // Listen for theme changes
    const handleThemeChange = () => loadTheme();
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const displayError = useCallback((message, items = []) => {
    setNotification({
      open: true,
      type: 'error',
      message: typeof message === 'string' ? message : 'An error occurred',
      items: Array.isArray(items) ? items : [],
    });

    // Auto-dismiss after 10 seconds for errors
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 10000);
  }, []);

  const displaySuccess = useCallback((message) => {
    setNotification({
      open: true,
      type: 'success',
      message: typeof message === 'string' ? message : 'Operation successful',
      items: [],
    });

    // Auto-dismiss after 5 seconds for success
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 5000);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        displayError,
        displaySuccess,
        closeNotification,
      }}
    >
      {children}
      {notification.open && (
        <Box
          sx={{
            position: 'fixed',
            top: 80, // Below header, aligned with page title area
            left: {
              xs: '16px', // Mobile: sidebar hidden
              md: 'calc(320px + 16px)', // Desktop: next to sidebar (320px sidebar + 16px margin) when visible
            },
            width: {
              xs: 'calc(100% - 32px)', // Mobile: full width minus margins
              md: 'calc(100% - 320px - 32px)', // Desktop: full width minus sidebar and margins
            },
            maxWidth: '600px', // Max width for readability
            zIndex: 9999,
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Match sidebar transition
          }}
        >
        <NotificationBanner
          type={notification.type}
          message={notification.message}
          items={notification.items}
          open={notification.open}
          onClose={closeNotification}
          themeColor={themeColor}
        />
        </Box>
      )}
    </NotificationContext.Provider>
  );
};

