import { useState, useEffect, useRef } from 'react';
import { Box, CssBaseline, Toolbar, Fade, useTheme, useMediaQuery } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatBot from '../chat/ChatBot';
import StatusBar from '../common/StatusBar';
import { fetchCurrentUser } from '../../store/slices/authSlice';
import authService from '../../services/authService';

const AppLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prevPathRef = useRef(location.pathname);

  const [chatBotVisible, setChatBotVisible] = useState(() => {
    try {
      const stored = localStorage.getItem('chatBotVisible');
      if (stored !== null) {
        return JSON.parse(stored) === true;
      }
    } catch (error) {
      console.warn('Error reading chat bot visibility from localStorage:', error);
    }
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem('chatBotVisible', JSON.stringify(chatBotVisible));
    } catch (error) {
      console.warn('Error saving chat bot visibility to localStorage:', error);
    }
  }, [chatBotVisible]);

  const handleToggleChatBot = (nextValue) => {
    setChatBotVisible(nextValue);
  };

  // Enhanced sidebar state with responsive behavior
  // Load sidebar state from localStorage on mount, default to open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebarOpenState');
      if (saved !== null) {
        return JSON.parse(saved) === true;
      }
    } catch (error) {
      console.warn('Error loading sidebar state from localStorage:', error);
    }
    // Default: open on desktop, closed on mobile
    return !isMobile;
  });

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sidebarOpenState', JSON.stringify(sidebarOpen));
    } catch (error) {
      console.warn('Error saving sidebar state to localStorage:', error);
    }
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Get sidebar preferences from localStorage
  const getSidebarPreferences = () => {
    try {
      const saved = localStorage.getItem('sidebarPreferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        return {
          width: Number(prefs.width) || 280,
          position: prefs.position || 'left',
        };
      }
    } catch (error) {
      console.warn('Error reading sidebar preferences:', error);
    }
    return {
      width: 280,
      position: 'left',
    };
  };

  const sidebarPrefs = getSidebarPreferences();

  // Online/sync status state (moved from Header)
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'error'

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isPOSBillingRoute =
    location.pathname === '/pos/desktop' ||
    location.pathname === '/pos/billing' ||
    location.pathname.startsWith('/posv2/desktop');
  const isShiftWorkflowRoute = location.pathname.startsWith('/posv2/shift-workflow');
  const isDataOpsRoute = location.pathname === '/settings/dataops-studio';
  const isHtmlConsoleRoute = location.pathname === '/settings/html-preview';
  const hideSidebar = isDataOpsRoute || isShiftWorkflowRoute || isPOSBillingRoute;
  const showSidebar = !hideSidebar;

  // Restore sidebar state when navigating away from hidden-sidebar routes
  useEffect(() => {
    const currentPath = location.pathname;
    prevPathRef.current = currentPath;
    
    // On mobile, auto-close sidebar on route change
    if (isMobile) {
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
      return;
    }
    
    if (showSidebar) {
      try {
        const saved = localStorage.getItem('sidebarOpenState');
        if (saved !== null) {
          const shouldBeOpen = JSON.parse(saved) === true;
          if (shouldBeOpen !== sidebarOpen) {
            setSidebarOpen(shouldBeOpen);
          }
        } else if (!sidebarOpen) {
          setSidebarOpen(true);
        }
      } catch (error) {
        if (!sidebarOpen) {
          setSidebarOpen(true);
        }
      }
    }
  }, [location.pathname, isMobile, showSidebar, sidebarOpen]);

  // Update sidebar state when screen size changes
  // Only auto-close on mobile if not manually set
  useEffect(() => {
    // On mobile, close sidebar by default
    // On desktop, restore saved state or default to open
    if (isMobile) {
      setSidebarOpen(false);
    } else {
        if (showSidebar) {
          try {
            const saved = localStorage.getItem('sidebarOpenState');
            if (saved !== null) {
              setSidebarOpen(JSON.parse(saved) === true);
            } else {
              setSidebarOpen(true);
            }
          } catch (error) {
            setSidebarOpen(true);
          }
        }
    }
  }, [isMobile, showSidebar]);

  useEffect(() => {
    // Always fetch user if authenticated (token exists) and user is not already loaded
    const TIMEOUT_MS = 10000; // 10 second timeout
    
    if (authService.isAuthenticated() && !user) {
      console.log('🔄 Fetching current user...');
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User fetch timeout')), TIMEOUT_MS)
      );
      
      // Race between user fetch and timeout
      Promise.race([
        dispatch(fetchCurrentUser()),
        timeoutPromise
      ])
        .then((result) => {
          if (result && fetchCurrentUser.fulfilled.match(result)) {
            console.log('✅ User loaded:', result.payload);
          } else if (result && fetchCurrentUser.rejected.match(result)) {
            console.error('❌ Failed to load user:', result.error);
          }
        })
        .catch((error) => {
          if (error.message?.includes('timeout')) {
            console.error('❌ User fetch timeout - Backend may not be running');
          } else {
            console.error('❌ User fetch error:', error);
          }
          // Don't block UI - allow user to see the app even if user fetch fails
        });
    }
  }, [dispatch, user]);

  if (isHtmlConsoleRoute) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        <CssBaseline />
        <Outlet />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', position: 'relative', minHeight: '100vh' }}>
      <CssBaseline />
      <Header 
        onMenuClick={toggleSidebar} 
        isOnline={isOnline}
        syncStatus={syncStatus}
        chatBotVisible={chatBotVisible}
        onToggleChatBot={handleToggleChatBot}
      />
      <Sidebar open={sidebarOpen || false} showSidebar={showSidebar} />
      
      {/* Enhanced Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: showSidebar && sidebarOpen && sidebarPrefs.position === 'left' && !isMobile ? `${sidebarPrefs.width}px` : '0px',
          marginRight: showSidebar && sidebarOpen && sidebarPrefs.position === 'right' && !isMobile ? `${sidebarPrefs.width}px` : '0px',
          marginTop: showSidebar && sidebarOpen && sidebarPrefs.position === 'top' && !isMobile ? (isMobile ? '48px' : '56px') : '0px',
          transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          overflow: 'auto',
          padding: 0,
          margin: 0,
          position: 'relative',
          // Enhanced scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.3)',
            },
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar /> {/* Spacer for fixed header */}
        {/* Top sidebar takes minimal space - no extra spacer needed */}
        
        {/* Content with fade animation */}
        <Fade in timeout={300}>
          <Box sx={{ 
            minHeight: 'calc(100vh - 64px)',
            position: 'relative',
            paddingTop: showSidebar && sidebarOpen && sidebarPrefs.position === 'top' && !isMobile ? '16px' : '0px',
            paddingBottom: '16px', // Standard padding at bottom
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
            }
          }}>
            <Outlet />
          </Box>
        </Fade>
      </Box>
      
      {/* AI ChatBot Assistant */}
      {chatBotVisible && <ChatBot />}
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && showSidebar && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {!(isShiftWorkflowRoute || isPOSBillingRoute) && (
        <StatusBar
          message={isOnline ? 'System ready' : 'Working offline'}
          userInfo={`User: ${user?.full_name || user?.username || 'Guest'}`}
          loading={syncStatus === 'syncing'}
          isOnline={isOnline}
          syncStatus={syncStatus}
        />
      )}
    </Box>
  );
};

export default AppLayout;











