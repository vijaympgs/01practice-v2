import { useState, useEffect, useMemo, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Chip,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  GlobalStyles,
  Divider,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  ListItemIcon,
  Paper,
  CircularProgress,
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItemButton,
  Switch,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Notifications,
  Settings,
  Search,
  Fullscreen,
  FullscreenExit,
  Brightness4,
  Brightness7,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Wifi,
  WifiOff,
  Sync,
  SyncProblem,
  ChatBubbleOutline,
  Lightbulb as FlashlightIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import api from '../../services/api';
import axios from 'axios';
import themeService from '../../services/themeService';
// import { useNotification } from '../../contexts/NotificationContext'; // Temporarily disabled for menu controller testing

// Fallback notification functions
const useNotification = () => ({
  displaySuccess: (message) => console.log('SUCCESS:', message),
  displayError: (message) => console.error('ERROR:', message),
  displayInfo: (message) => console.log('INFO:', message),
  displayWarning: (message) => console.warn('WARNING:', message)
});
import { getMenuCategories } from '../../utils/menuStructure';
import brandingService from '../../services/brandingService';

const Header = ({ onMenuClick, isOnline = true, syncStatus = 'synced', chatBotVisible = true, onToggleChatBot = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [availableThemes, setAvailableThemes] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const searchInputRef = useRef(null);
  const searchAnchorRef = useRef(null);
  
  // Location selector state
  const [locations, setLocations] = useState([]);
  const [sessionLocationId, setSessionLocationId] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(false);
  
  // Branding configuration state
  const [brandingConfig, setBrandingConfig] = useState(null);
  
  // Company data state
  const [companyData, setCompanyData] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { displaySuccess, displayError } = useNotification();
  
  const hideMenuButton = location.pathname.startsWith('/pos/billing');

  const menuEntries = useMemo(() => {
    const categories = getMenuCategories({});
    const entries = [];

    categories.forEach((category) => {
      if (category.path) {
        entries.push({
          label: category.title,
          path: category.path,
          category: category.title,
        });
      }

      if (Array.isArray(category.items)) {
        category.items.forEach((item) => {
          entries.push({
            label: item.text,
            path: item.path,
            category: category.title,
          });
        });
      }
    });

    // Deduplicate by path to avoid repeated entries
    const uniqueByPath = new Map();
    entries.forEach((entry) => {
      if (!uniqueByPath.has(entry.path)) {
        uniqueByPath.set(entry.path, entry);
      }
    });

    return Array.from(uniqueByPath.values());
  }, []);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return menuEntries.slice(0, 12);
    }

    return menuEntries
      .map((entry) => {
        const labelScore = entry.label.toLowerCase().includes(query) ? 2 : 0;
        const categoryScore = entry.category.toLowerCase().includes(query) ? 1 : 0;
        const startsWithScore = entry.label.toLowerCase().startsWith(query) ? 3 : 0;
        const score = labelScore + categoryScore + startsWithScore;
        return { ...entry, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
      .slice(0, 12);
  }, [menuEntries, searchQuery]);

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (searchAnchorRef.current) {
          setSearchAnchor(searchAnchorRef.current);
        }
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    setSearchError('');
    const focusTimer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
      }
    }, 0);
    return () => clearTimeout(focusTimer);
  }, [searchOpen]);

  const handleSearchOpen = (event) => {
    setSearchAnchor(event?.currentTarget || searchAnchorRef.current);
    setSearchOpen(true);
    setSearchQuery('');
    setSearchError('');
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchAnchor(null);
    setSearchQuery('');
    setSearchError('');
  };

  const handleSearchNavigate = (path) => {
    handleSearchClose();
    navigate(path);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = searchQuery.trim();
      if (!input) {
        setSearchError('Enter a valid path');
        return;
      }

      const normalizedInput = input.toLowerCase();
      let targetPath = '';

      const findPathMatch = (pathQuery) => {
        const exactPath = menuEntries.find((entry) => entry.path.toLowerCase() === pathQuery.toLowerCase());
        if (exactPath) return exactPath.path;
        const partialPath = menuEntries.find((entry) => entry.path.toLowerCase().includes(pathQuery.toLowerCase()));
        return partialPath ? partialPath.path : '';
      };

      if (input.startsWith('/')) {
        targetPath = findPathMatch(normalizedInput);
      } else {
        const exactMatch = menuEntries.find((entry) => entry.label.toLowerCase() === normalizedInput);
        const partialMatch = menuEntries.find((entry) => entry.label.toLowerCase().includes(normalizedInput));
        if (exactMatch) {
          targetPath = exactMatch.path;
        } else if (partialMatch) {
          targetPath = partialMatch.path;
        } else {
          // As a final fallback, see if the text corresponds to a path (user omitted slash)
          targetPath = findPathMatch(`/${normalizedInput.replace(/\\s+/g, '-')}`);
        }
      }

      if (targetPath) {
        handleSearchNavigate(targetPath);
      } else {
        setSearchError(`No match for "${input}"`);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleSearchClose();
    }
  };


  // Helper functions for sync status
  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return (
          <Sync 
            sx={{ 
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              }
            }} 
          />
        );
      case 'error':
        return <SyncProblem />;
      default:
        return <Sync />;
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'success';
    }
  };

  // Roles that can select session location
  // Note: 'superuser' is not a role choice in User model, but we check is_superuser flag separately
  const locationSelectionRoles = ['admin', 'backofficemanager', 'backofficeuser'];
  const isSuperuser = user?.is_superuser || user?.is_staff;
  // Normalize role: handle both string and object formats, trim whitespace, convert to lowercase
  const userRole = user?.role 
    ? String(user.role).trim().toLowerCase().replace(/\s+/g, '') // Remove spaces and convert to lowercase
    : '';
  
  // Admin users should ALWAYS be able to select location
  // Check multiple conditions:
  // 1. is_superuser or is_staff (Django admin flags) - highest priority
  // 2. role === 'admin' (explicit admin role)
  // 3. role in locationSelectionRoles array
  const canSelectLocation = isSuperuser || 
                            userRole === 'admin' || 
                            (userRole && locationSelectionRoles.includes(userRole));
  
  // Debug logging - Enhanced for troubleshooting location picker visibility
  useEffect(() => {
    if (user) {
      const debugInfo = {
        username: user.username,
        role: user.role,
        roleType: typeof user.role,
        roleRaw: user.role,
        is_staff: user.is_staff,
        is_superuser: user.is_superuser,
        userRoleNormalized: userRole,
        isSuperuser,
        canSelectLocation,
        locationSelectionRoles,
        'willShowSelector': canSelectLocation ? '✅ YES' : '❌ NO',
        'reason': canSelectLocation 
          ? (isSuperuser ? 'is_superuser/is_staff flag' : userRole === 'admin' ? 'admin role' : 'role in allowed list')
          : `Role "${userRole}" not in [${locationSelectionRoles.join(', ')}] and not superuser/staff`
      };
      console.log('🔍 Header - Location Picker Visibility Check:', debugInfo);
      
      // Also log to help user troubleshoot
      if (!canSelectLocation) {
        console.warn('⚠️ Location picker will NOT be visible. User role:', userRole, 'Allowed roles:', locationSelectionRoles);
      }
    } else {
      console.warn('⚠️ Header - No user object found - location picker will not show');
    }
  }, [user, userRole, isSuperuser, canSelectLocation, locationSelectionRoles]);
  
  // Location selector visibility determined by canSelectLocation

  // Load branding configuration
  useEffect(() => {
    const loadBrandingConfig = async () => {
      try {
        // Wait for branding service to load
        await brandingService.loadConfig();
        const config = brandingService.getConfig();
        setBrandingConfig(config);
        console.log('🎯 Header branding config loaded:', config?.company);
        
        // Listen for branding changes
        const cleanup = brandingService.onBrandingChange((newConfig) => {
          setBrandingConfig(newConfig);
          console.log('🔄 Header branding config updated:', newConfig?.company);
        });
        
        return cleanup;
      } catch (error) {
        console.error('❌ Error loading branding configuration:', error);
        // Set fallback config
        setBrandingConfig({
          company: {
            main_name: 'NewBorn',
            sub_name: 'Retail',
            trademark: '™',
            tagline: 'AI-Powered',
            main_color: '#FF5722',
            text_color: '#ffffff',
            show_tagline: true,
            show_trademark: true
          }
        });
      }
    };

    loadBrandingConfig();
    
    return () => {
      // Cleanup branding listener on unmount
      const cleanup = brandingService.onBrandingChange(() => {});
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // Load themes from database
  useEffect(() => {
    const loadThemes = async () => {
      try {
        // Check localStorage first for faster theme loading
        const cachedTheme = localStorage.getItem('activeTheme');
        if (cachedTheme) {
          try {
            const parsedTheme = JSON.parse(cachedTheme);
            setCurrentTheme(parsedTheme);
            applyThemeToUI(parsedTheme);
          } catch (e) {
            console.error('Error parsing cached theme:', e);
          }
        }
        
        // Initialize default themes if they don't exist
        await themeService.initializeDefaultThemes();
        
        // Load available themes
        const themes = await themeService.getAllThemes();
        setAvailableThemes(themes);
        
        // Load current active theme from database
        const activeTheme = await themeService.getActiveTheme();
        setCurrentTheme(activeTheme);
        
        // Apply current theme to UI
        if (activeTheme) {
          applyThemeToUI(activeTheme);
        }
      } catch (error) {
        console.error('Error loading themes:', error);
        // Fallback to default themes
        setAvailableThemes([
          { id: 1, theme_name: 'blue', primary_color: '#1565C0', secondary_color: '#FF5722', is_active: true },
          { id: 2, theme_name: 'black', primary_color: '#333333', secondary_color: '#666666', is_active: false }
        ]);
        setCurrentTheme({ theme_name: 'blue', primary_color: '#1565C0', secondary_color: '#FF5722' });
      }
    };

    loadThemes();
  }, []);

  // Apply theme to UI elements
  const applyThemeToUI = (theme) => {
    console.log('Applying theme:', theme);
    
    // Apply theme to AppBar
    const appBar = document.querySelector('.MuiAppBar-root');
    if (appBar) {
      appBar.style.background = `linear-gradient(135deg, ${theme.primary_color} 0%, ${theme.primary_color}dd 100%)`;
      console.log('AppBar background set to:', theme.primary_color);
    }
    
    // Apply theme to page background
    const bgColor = theme.background_color || '#f5f5f5';
    document.body.style.backgroundColor = bgColor;
    console.log('Body background set to:', bgColor);
    
    // Store theme in localStorage for persistence
    localStorage.setItem('activeTheme', JSON.stringify(theme));
    console.log('Theme saved to localStorage');
    
    // Apply theme to sidebar category headers
    const style = document.createElement('style');
    style.id = 'theme-styles';
    style.textContent = `
      /* Category Headers ONLY - Master Data Management, User & Permissions, etc. */
      .MuiListItemButton-root .MuiListItemText-root .MuiTypography-root {
        color: ${theme.primary_color} !important;
      }
      .MuiListItemButton-root .MuiListItemText-root span {
        color: ${theme.primary_color} !important;
      }
      .MuiListItemButton-root .MuiListItemText-root p {
        color: ${theme.primary_color} !important;
      }
      /* Category Headers - MUI Icons (theme color) */
      .MuiListItemButton-root .MuiListItemIcon-root .MuiSvgIcon-root {
        color: ${theme.primary_color} !important;
      }
      /* Selected menu items - grey background, BLACK text color */
      .MuiListItemButton-root.Mui-selected {
        background-color: #f5f5f5 !important;
        border-left: 3px solid #e0e0e0 !important;
      }
      .MuiListItemButton-root.Mui-selected .MuiListItemText-root .MuiTypography-root {
        color: #000000 !important;
      }
      .MuiListItemButton-root.Mui-selected .MuiListItemText-root span {
        color: #000000 !important;
      }
      .MuiListItemButton-root.Mui-selected .MuiListItemText-root p {
        color: #000000 !important;
      }
      .MuiListItemButton-root.Mui-selected .MuiListItemIcon-root {
        color: #000000 !important;
      }
      /* Override: All menu items (except category headers) - always black text */
      .MuiListItemButton-root:not(.Mui-selected) .MuiListItemText-root .MuiTypography-root {
        color: #000000 !important;
      }
      .MuiListItemButton-root:not(.Mui-selected) .MuiListItemText-root span {
        color: #000000 !important;
      }
      .MuiListItemButton-root:not(.Mui-selected) .MuiListItemText-root p {
        color: #000000 !important;
      }
      .MuiListItemButton-root:not(.Mui-selected) .MuiListItemIcon-root {
        color: #000000 !important;
      }
    `;
    
    // Remove existing theme styles
    const existingStyle = document.getElementById('theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add new theme styles
    document.head.appendChild(style);
  };


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Load locations and session location for admin/backoffice users
  useEffect(() => {
    // Add timeout to prevent infinite waiting
    const TIMEOUT_MS = 5000; // 5 seconds timeout for location loading
    
    if (user) {
      console.log('🔍 Location Load Check:', { 
        canSelectLocation, 
        user: user?.username,
        is_staff: user?.is_staff,
        is_superuser: user?.is_superuser,
        role: user?.role,
        userRole,
        locationSelectionRoles
      });
      if (canSelectLocation) {
        console.log('✅ Loading locations for eligible user');
        // Load locations with timeout
        const timeoutId = setTimeout(() => {
          console.warn('⚠️ Location loading timeout - setting loading to false');
          setLoadingLocations(false);
        }, TIMEOUT_MS);
        
        loadLocations().finally(() => {
          clearTimeout(timeoutId);
        });
      } else {
        console.log('⚠️ User not eligible for location selection - role:', userRole, 'isSuperuser:', isSuperuser);
      }
    } else {
      console.log('⚠️ No user object - cannot check location eligibility');
    }
  }, [canSelectLocation, user, userRole, isSuperuser]);

  // Set session location ID only after locations are loaded and value exists in options
  useEffect(() => {
    if (canSelectLocation && locations.length > 0) {
      const sessionLocation = localStorage.getItem('session_location_id');
      // Only set if the location ID exists in the loaded locations
      if (sessionLocation && locations.some(loc => loc.id === sessionLocation)) {
        setSessionLocationId(sessionLocation);
      } else {
        // Clear invalid value
        setSessionLocationId('');
      }
    }
  }, [locations, canSelectLocation]);

  const loadLocations = async () => {
    const TIMEOUT_MS = 5000; // 5 seconds timeout - shorter for faster feedback
    let abortTimeout = null;
    
    try {
      setLoadingLocations(true);
      console.log('🔄 Loading locations...');
      
      // Create AbortController
      const abortController = new AbortController();
      abortTimeout = setTimeout(() => {
        abortController.abort();
      }, TIMEOUT_MS);
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          if (abortTimeout) clearTimeout(abortTimeout);
          reject(new Error('Location loading timeout after 5 seconds'));
        }, TIMEOUT_MS)
      );
      
      // Try without filters first - load all active locations
      // Then filter on frontend if needed
      // Use relative URL to work with Vite proxy
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const locationsUrl = `${apiBaseUrl}/organization/locations/`;
      
      console.log('🔍 Fetching locations from:', locationsUrl);
      
      // Use axios directly with timeout and AbortController
      const apiPromise = axios.get(locationsUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: TIMEOUT_MS,
        signal: abortController.signal,
      }).then((response) => {
        if (abortTimeout) clearTimeout(abortTimeout);
        return response;
      });
      
      // Race between API call and timeout
      const response = await Promise.race([apiPromise, timeoutPromise]);
      
      const locationsData = Array.isArray(response.data)
        ? response.data
        : (response.data?.results || []);
      
      console.log('✅ Locations API Response:', response.data);
      console.log('✅ Locations loaded:', locationsData.length, 'locations');
      console.log('✅ Location details:', locationsData);
      
      // Filter to active locations only (store type filter removed - show all location types)
      const activeLocations = locationsData.filter(loc => loc.is_active !== false);
      
      console.log('✅ Active locations after filter:', activeLocations.length);
      setLocations(activeLocations);
    } catch (error) {
      if (abortTimeout) clearTimeout(abortTimeout);
      
      console.error('❌ Error loading locations:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      
      if (error.message?.includes('timeout')) {
        console.error('❌ Location loading timeout - Backend may not be responding');
        displayError('Location loading timeout. Please check backend connection.');
      } else if (error.response?.status === 401) {
        console.error('❌ Unauthorized - token may be expired');
        displayError('Authentication required. Please log in again.');
      } else {
        console.error('Error details:', error.response?.data);
      }
      // Set empty array on error so UI doesn't hang
      setLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleLocationChange = async (locationId) => {
    try {
      const selectedLocation = locations.find(loc => loc.id === locationId);
      if (selectedLocation) {
        // Store selected location in localStorage
        localStorage.setItem('session_location_id', selectedLocation.id);
        localStorage.setItem('session_location_name', selectedLocation.name);
        localStorage.setItem('session_location_code', selectedLocation.code || '');
        localStorage.setItem('session_location_selected_at', new Date().toISOString());
        setSessionLocationId(locationId);
        displaySuccess(`Location changed to "${selectedLocation.name}"`);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      displayError('Failed to update location');
    }
  };

  // Fetch company data (name and logo) when authenticated
  useEffect(() => {
    const fetchCompanyData = async () => {
      // Check if user is authenticated
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // Not authenticated, skip company data fetch
        setCompanyData(null);
        setCompanyLogo(null);
        return;
      }

      setLoadingCompany(true);
      console.log('🔄 Fetching company data for authenticated user...');

      try {
        // Try authenticated endpoint first
        const response = await api.get('/organization/companies/');
        const companies = response.data.results || response.data;
        
        if (companies.length > 0) {
          const company = companies[0];
          console.log('✅ Company data fetched:', company);
          
          // Set company data (name and other details)
          setCompanyData(company);
          
          // Set company logo if available
          if (company.logo) {
            setCompanyLogo(company.logo);
          }
        } else {
          console.warn('⚠️ No company data found');
          setCompanyData(null);
          setCompanyLogo(null);
        }
      } catch (error) {
        console.error('❌ Error fetching company data:', error);
        
        // Only log non-401 errors (401 is expected if not authenticated)
        if (error.response?.status !== 401) {
          console.error('Error details:', error.response?.data);
        }
        
        // Try public endpoint as fallback
        try {
          const publicResponse = await api.get('/organization/companies/public/');
          const companies = publicResponse.data.results || publicResponse.data;
          
          if (companies.length > 0) {
            const company = companies[0];
            console.log('🌐 Using public company data:', company);
            
            // Set company data (name and other details)
            setCompanyData(company);
            
            // Set company logo if available
            if (company.logo) {
              setCompanyLogo(company.logo);
            }
          } else {
            console.warn('⚠️ No public company data found');
            setCompanyData(null);
            setCompanyLogo(null);
          }
        } catch (publicError) {
          console.warn('⚠️ No public company data available:', publicError.message);
          setCompanyData(null);
          setCompanyLogo(null);
        }
      } finally {
        setLoadingCompany(false);
      }
    };

    fetchCompanyData();
  }, [user]); // Re-fetch when user changes

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  const handleToggleChatBot = (event) => {
    event.stopPropagation();
    onToggleChatBot(event.target.checked);
  };


  return (
    <>
      <GlobalStyles
        styles={{
          '@keyframes themePulse': {
            '0%, 100%': { 
              transform: 'scale(1)', 
              opacity: 1,
              boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)'
            },
            '50%': { 
              transform: 'scale(1.05)', 
              opacity: 0.9,
              boxShadow: '0 0 12px rgba(255, 215, 0, 0.8)'
            }
          }
        }}
      />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        }}
      >
      <Toolbar sx={{ minHeight: '64px !important', px: { xs: 1, sm: 2 } }}>
        {!hideMenuButton && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              if (location.pathname === '/settings/dataops-studio') {
                navigate('/');
              } else {
                onMenuClick?.();
              }
            }}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Company Logo */}
          {companyLogo ? (
            <Box
              component="img"
              src={companyLogo}
              alt="Company Logo"
              sx={{
                height: 40,
                width: 'auto',
                maxWidth: 120,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.5))'
                }
              }}
            />
          ) : loadingCompany ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : null}

          {/* Company Name and Branding Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                fontFamily: '"Inter", "Roboto", sans-serif',
                lineHeight: 1.2,
                margin: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                letterSpacing: '0.3px',
                opacity: 0.95
              }}
            >
              {loadingCompany ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <>
                  {/* Company Name (from logged-in company data) */}
                  {companyData && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '1em'
                      }}
                    >
                      {companyData.name || 'Company'}
                    </Typography>
                  )}
                  
                  {/* Branding Details (from .cfg file) */}
                  {brandingConfig && brandingConfig.company && (
                    <>
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: brandingConfig.company?.main_color || '#FF5722',
                          fontWeight: 700,
                          fontSize: '1em',
                          textShadow: `0 2px 4px ${brandingConfig.company?.main_color ? brandingConfig.company.main_color + '40' : 'rgba(255,87,34,0.4)'}, 0 0 8px ${brandingConfig.company?.main_color ? brandingConfig.company.main_color + '20' : 'rgba(255,87,34,0.2)'}`
                        }}
                      >
                        {brandingConfig.company?.main_name || 'NewBorn'}
                      </Typography>
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: brandingConfig.company?.text_color || 'white',
                          fontWeight: 700,
                          fontSize: '1em'
                        }}
                      >
                        {brandingConfig.company?.sub_name || 'Retail'}
                      </Typography>
                      {brandingConfig.company?.show_trademark !== false && (
                        <Typography 
                          component="span" 
                          sx={{ 
                            fontSize: '0.7rem',
                            color: brandingConfig.company?.main_color || '#FF5722',
                            fontWeight: 600,
                            fontStyle: 'italic',
                            textShadow: `0 2px 4px ${brandingConfig.company?.main_color ? brandingConfig.company.main_color + '40' : 'rgba(255,87,34,0.4)'}, 0 0 8px ${brandingConfig.company?.main_color ? brandingConfig.company.main_color + '20' : 'rgba(255,87,34,0.2)'}`
                          }}
                        >
                          {brandingConfig.company?.trademark || '™'}
                        </Typography>
                      )}
                    </>
                  )}
                  
                  {/* Company Tagline (from company data) */}
                  {companyData?.tagline && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500,
                        fontSize: '0.5em',
                        opacity: 0.8
                      }}
                    >
                      {companyData.tagline}
                    </Typography>
                  )}
                  
                  {/* Branding Tagline (from .cfg file) */}
                  {brandingConfig && brandingConfig.company && brandingConfig.company?.show_tagline !== false && !companyData?.tagline && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: brandingConfig.company?.text_color || 'white',
                        fontWeight: 500,
                        fontSize: '0.5em',
                        opacity: 0.9
                      }}
                    >
                      {brandingConfig.company?.tagline || 'AI-Powered'}
                    </Typography>
                  )}
                </>
              )}
            </Typography>
          </Box>
        </Box>


        {/* Status Indicators - Moved to StatusBar */}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} ref={searchAnchorRef}>
          {/* Search Button */}
          <Tooltip title="Search (Ctrl+K)">
            <IconButton color="inherit" size="small" onClick={handleSearchOpen}>
              <Search />
            </IconButton>
          </Tooltip>

          {/* Fullscreen Toggle */}
          <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
            <IconButton color="inherit" size="small" onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              size="small" 
              onClick={handleNotificationMenu}
            >
              <Badge badgeContent={notificationCount} color="error" size="small">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton 
              color="inherit" 
              size="small"
              onClick={() => navigate('/settings')}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
          {!isMobile && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.875rem'
            }}
          >
            {user?.full_name || user?.username || 'Admin User'}
          </Typography>
          )}
          
          {/* Profile Icon Button - Always show and clickable */}
          <IconButton
            size="medium"
            onClick={handleMenu}
            color="inherit"
            aria-label="profile menu"
            aria-controls={Boolean(anchorEl) ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out'
              },
              p: 1
            }}
          >
            {user?.profile_image ? (
              <Avatar 
                src={user.profile_image} 
                sx={{ 
                  width: 32, 
                  height: 32,
                  border: '2px solid rgba(255,255,255,0.2)'
                }} 
              />
            ) : (
              <AccountCircle sx={{ fontSize: 28 }} />
            )}
          </IconButton>
          
          {/* Online and Sync Status Chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <Tooltip title={isOnline ? 'Online' : 'Offline'}>
              <Chip
                icon={isOnline ? <Wifi /> : <WifiOff />}
                label={isOnline ? 'Online' : 'Offline'}
                size="small"
                color={isOnline ? 'success' : 'error'}
                sx={{ 
                  fontSize: '0.7rem',
                  height: '24px',
                  backgroundColor: isOnline ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                  color: 'white',
                  '& .MuiChip-icon': { fontSize: '0.9rem', color: 'white' }
                }}
              />
            </Tooltip>

            <Tooltip title={`Sync Status: ${syncStatus}`}>
              <Chip
                icon={getSyncIcon()}
                label={syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'error' ? 'Sync Error' : 'Synced'}
                size="small"
                color={getSyncColor()}
                sx={{ 
                  fontSize: '0.7rem',
                  height: '24px',
                  backgroundColor: getSyncColor() === 'info' ? 'rgba(33, 150, 243, 0.9)' : 
                                 getSyncColor() === 'error' ? 'rgba(244, 67, 54, 0.9)' : 
                                 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  '& .MuiChip-icon': { 
                    fontSize: '0.9rem', 
                    color: 'white'
                  }
                }}
              />
            </Tooltip>
          </Box>
          
          {/* Location Display - Top Right */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            {sessionLocationId && (() => {
              const selectedLocation = locations.find(loc => loc.id === sessionLocationId);
              return selectedLocation ? (
                <Chip
                  icon={<LocationIcon />}
                  label={selectedLocation.name}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '0.75rem',
                    height: '28px',
                    '& .MuiChip-icon': {
                      color: 'white',
                      fontSize: '0.875rem'
                    }
                  }}
                />
              ) : null;
            })()}
          </Box>
        </Box>
      </Toolbar>

      {/* Global Search Dropdown */}
      <Menu
        anchorEl={searchAnchor}
        open={searchOpen}
        onClose={handleSearchClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ sx: { width: 340, p: 0 } }}
        PaperProps={{ sx: { borderRadius: 1, overflow: 'hidden', mt: 1 } }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlashlightIcon sx={{ color: '#FFA500', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFA500' }}>
              Torch
            </Typography>
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a path or command..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSearchError('');
            }}
            onKeyDown={handleSearchKeyDown}
            inputRef={searchInputRef}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pr: 1 }}>
                  <Search fontSize="small" />
                </Box>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
          {searchError && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {searchError}
            </Typography>
          )}
        </Box>
      </Menu>
      </AppBar>

      {/* User Menu - Profile Dropdown with Location Selector and Logout */}
      {/* Always show menu when anchorEl is set (user clicked profile icon) */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 'calc(100vh - 120px)', // Account for header (64px) + status bar (40px) + margins (16px)
            mt: 1,
            mb: 1,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 1400, // Higher than StatusBar (1300) but below modals
            overflow: 'auto',
          }
        }}
        MenuListProps={{
          sx: {
            maxHeight: 'calc(100vh - 120px)',
            overflow: 'auto',
          }
        }}
        // Keep menu open even if user data is loading
        disableAutoFocusItem={!user}
      >
        {/* User Info Section - Always show */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          {user ? (
            <>
              <Typography variant="subtitle2" fontWeight="600">
                {user?.full_name || user?.username || 'User'}
              </Typography>
              {user?.email && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {user.email}
                </Typography>
              )}
              {user?.role && (
                <Chip 
                  label={user.role} 
                  size="small" 
                  sx={{ mt: 0.5, fontSize: '0.7rem' }}
                />
              )}
            </>
          ) : (
            <>
              <Typography variant="subtitle2" fontWeight="600">
                User Profile
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Loading user info...
              </Typography>
            </>
          )}
        </Box>
        
        {/* Location Selector Section - For Admin/Backoffice users only */}
        {canSelectLocation && (
          <>
            <Box 
              sx={{ 
                px: 2, 
                py: 1.5,
                visibility: canSelectLocation ? 'visible' : 'hidden',
                display: canSelectLocation ? 'block' : 'none',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Select Location
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  value={sessionLocationId || ''}
                  label="Location"
                  onChange={(e) => handleLocationChange(e.target.value)}
                  disabled={loadingLocations}
                  onClick={(e) => e.stopPropagation()}
                  onOpen={(e) => e.stopPropagation()}
                  MenuProps={{
                    onClick: (e) => e.stopPropagation(),
                    onClose: (e) => e.stopPropagation(),
                    disablePortal: false,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  {locations.length === 0 ? (
                    <MenuItem disabled value="">
                      {loadingLocations ? 'Loading...' : 'No locations available'}
                    </MenuItem>
                  ) : (
                    locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        <LocationIcon sx={{ fontSize: 18, mr: 1 }} />
                        {location.name} {location.code ? `(${location.code})` : ''}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>
            <Divider />
          </>
        )}

        <MenuItem
          onClick={(e) => e.stopPropagation()}
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <ListItemIcon>
            <ChatBubbleOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Chat Assistant"
            secondary={chatBotVisible ? 'On' : 'Off'}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
          />
          <Switch
            edge="end"
            size="small"
            checked={chatBotVisible}
            onChange={(event) => {
              event.stopPropagation();
              onToggleChatBot(event.target.checked);
            }}
            inputProps={{ 'aria-label': 'toggle chat assistant' }}
          />
        </MenuItem>
        <Divider />

        {/* Logout Option - Always show */}
        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.dark',
              '& .MuiSvgIcon-root': {
                color: 'error.dark',
              }
            }
          }}
        >
          <ListItemIcon>
            <Logout sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{ maxHeight: '400px' }}
      >
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">
            New POS transaction completed
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">
            Low inventory alert for Product #123
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">
            System backup completed successfully
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
