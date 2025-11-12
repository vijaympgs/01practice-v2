import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
  Collapse,
  Chip,
  Badge,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard,
  PointOfSale,
  Inventory,
  Category,
  ShoppingCart,
  People,
  Person,
  LocalShipping,
  Assessment,
  Settings,
  Storage as DatabaseIcon,
  Storage as StorageIcon,
  Receipt,
  Business,
  Assignment,
  Analytics as ReportsIcon,
  TrendingUp,
  AccessTime,
  AccountBalance as FinanceIcon,
  AccountBalance,
  AccountBalanceWallet,
  Event,
  Code as CodeIcon,
  ShoppingCartCheckout,
  Description as OrderIcon,
  AdminPanelSettings,
  ExpandLess,
  ExpandMore,
  Search,
  AssignmentReturn,
  Lightbulb,
  Notifications,
  Star,
  StarBorder,
  Archive,
  CheckCircle as DayOpenIcon,
  Close as DayCloseIcon,
  Keyboard,
  Public,
  Launch,
  Computer,
  PlayArrow,
  Stop,
  RequestQuote,
  SettingsSuggest,
  ViewQuilt,
  Language,
  Preview,
} from '@mui/icons-material';

import { iconMap } from '../../utils/menuStructure';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLayout } from '../../contexts/LayoutContext';
import { getMenuCategories } from '../../utils/menuStructure';

// Icon mapping object to convert string names to actual icon components
const iconComponents = {
  'Dashboard': Dashboard,
  'People': People,
  'Settings': Settings,
  'Category': Category,
  'Inventory': Inventory,
  'ShoppingCart': ShoppingCart,
  'PointOfSale': PointOfSale,
  'Business': Business,
  'Assignment': Assignment,
  'Assessment': Assessment,
  'Storage': DatabaseIcon,
  'Receipt': Receipt,
  'Analytics': ReportsIcon,
  'LocalShipping': LocalShipping,
  'TrendingUp': TrendingUp,
  'AccessTime': AccessTime,
  'AccountBalance': AccountBalance,
  'Event': Event,
  'Code': CodeIcon,
  'ShoppingCartCheckout': ShoppingCartCheckout,
  'Description': OrderIcon,
  'AdminPanelSettings': AdminPanelSettings,
  'Archive': Archive,
  'CheckCircle': DayOpenIcon,
  'Close': DayCloseIcon,
  'Keyboard': Keyboard,
  'Public': Public,
  'Launch': Launch,
  // New icons for missing menu items
  'SettingsApplications': Settings,
  'Computer': Computer,
  'TerminalConfiguration': Computer,
  'DayOpen': PlayArrow,
  'SessionClose': Stop,
  'PlayArrow': PlayArrow,
  'Stop': Stop,
  'PurchaseQuotation': RequestQuote,
  'RequestQuote': RequestQuote,
  'InitialSetup': SettingsSuggest,
  'SettingsSuggest': SettingsSuggest,
  'ViewQuilt': ViewQuilt,
  'Web': Language,
  'Preview': Preview,
  // Admin Tools icons (should already work but ensuring completeness)
  'DatabaseIcon': DatabaseIcon,
  'CodeIcon': CodeIcon,
  'SettingsIcon': Settings,
  'LayoutPreferences': ViewQuilt,
  // Day Management Console icon
  'DayManagementConsole': Event,
  // Fallback icons for missing ones
  'SalesOrder': ShoppingCart,
};

// Helper function to get icon component from string name
const getIconComponent = (iconName) => {
  if (!iconName) return null;
  const IconComponent = iconComponents[iconName];
  return IconComponent ? <IconComponent /> : null;
};

// Using centralized menu structure from utils/menuStructure.js

const Sidebar = ({ open = true, showSidebar = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get layout context - hooks must be called at top level
  const layoutContext = useLayout();
  
  // Load hidden menu categories from localStorage
  const [hiddenMenuCategories, setHiddenMenuCategories] = useState(new Set());
  
  // Safely get menu visibility with fallbacks
  const menuVisibility = layoutContext?.getMenuVisibility || {};
  const visibilityMap = typeof menuVisibility === 'function' ? menuVisibility() : (menuVisibility || {});

  // Load hidden menu categories from localStorage on component mount
  useEffect(() => {
    const loadHiddenCategories = () => {
      const savedHiddenCategories = localStorage.getItem('hiddenMenuCategories');
      if (savedHiddenCategories) {
        try {
          const parsed = JSON.parse(savedHiddenCategories);
          setHiddenMenuCategories(new Set(parsed));
          console.log('🔍 Sidebar: Loaded hidden menu categories from localStorage:', Array.from(parsed));
        } catch (error) {
          console.error('Error parsing hidden menu categories:', error);
        }
      }
    };

    loadHiddenCategories();
    
    // Listen for changes to hidden menu categories in localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'hiddenMenuCategories') {
        console.log('🔍 Sidebar: Storage change detected for hiddenMenuCategories');
        loadHiddenCategories();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const shouldShowCategory = (category) => {
    if (!category) {
      return false;
    }

    if (category.hidden) {
      return false;
    }

    // Check if category is in hidden menu categories
    if (hiddenMenuCategories.has(category.title)) {
      return false;
    }

    return true;
  };
  
  // Enhanced behavior and styles with responsive design
  const behavior = {
    showIcons: true,
    showLabels: !isMobile,
    expandedSections: {
      'Home': true,
      'User & Permissions': false,
      'Master Data': true,
      'Organization Setup': true,
      'Item': true,
      'Opening Stock': false,
      'Procurement': false,
      'Sales': false,
      'Stock Transfers': false,
      'Physical Inventory': false,
      'Point of Sale': true,
      'Reports': false,
      'System Settings': false
      // 'Archive': false  // Archive category hidden
    }
  };
  
  // Load sidebar preferences from localStorage
  const getSidebarPreferences = () => {
    try {
      const saved = localStorage.getItem('sidebarPreferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        return {
          width: prefs.sidebar_width || (isMobile ? 280 : 320),
          position: prefs.sidebar_position || 'left',
          theme: prefs.sidebar_theme || 'light',
          compact: prefs.sidebar_compact_mode !== undefined ? prefs.sidebar_compact_mode : isMobile
        };
      }
    } catch (error) {
      console.error('Error loading sidebar preferences:', error);
    }
    return {
      width: isMobile ? 280 : 320,
      position: 'left',
      theme: 'light',
      compact: isMobile
    };
  };

  const styles = getSidebarPreferences();
  
  const [expandedSections, setExpandedSections] = useState(behavior.expandedSections);
  const [favorites, setFavorites] = useState(new Set(['/pos/day-open', '/inventory']));
  const [topMenuAnchors, setTopMenuAnchors] = useState({}); // Track menu anchors for top position

  const handleSectionToggle = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const isItemVisible = (item) => {
    if (!item) return false;
    const moduleName = item.moduleName;

    if (moduleName && visibilityMap[moduleName] === false) {
      return false;
    }

    if (item.hidden) {
      if (moduleName) {
        return visibilityMap[moduleName] === true;
      }
      return false;
    }

    return true;
  };

  const toggleFavorite = (path) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(path)) {
        newFavorites.delete(path);
      } else {
        newFavorites.add(path);
      }
      return newFavorites;
    });
  };

  const getNotificationCount = (moduleName) => {
    // Mock notification counts - replace with real data
    const counts = {
      'pos_terminal': 3,
      'inventory_management': 2,
      'sales_management': 1,
    };
    return counts[moduleName] || 0;
  };

  if (!showSidebar) {
    return null;
  }

  const renderCategoryHeader = (category) => {
    if (!category || !category.type) return null; // Skip Dashboard section header or invalid categories
    if (!shouldShowCategory(category)) return null;
    
    const isExpanded = expandedSections[category.title];
    const hasDirectPath = category.path && (!category.items || category.items.length === 0);
    const isPOSLegacyCategory = category.title === 'Point of Sale';
    const isSelected = hasDirectPath && location.pathname === category.path;
    
    return (
      <ListItem key={`header-${category.title}`} disablePadding>
        <ListItemButton 
          onClick={() => {
            if (isPOSLegacyCategory) {
              handleSectionToggle(category.title);
            } else if (hasDirectPath) {
              navigate(category.path);
            } else {
              handleSectionToggle(category.title);
            }
          }}
          selected={isSelected}
          sx={{
            py: styles.compact ? 0.5 : 0.75,
            px: styles.compact ? 1.25 : 1.5,
            borderRadius: 1,
            mx: 0.5,
            mb: 0.25,
            backgroundColor: isExpanded ? 'primary.50' : 'transparent',
            border: isExpanded ? '1px solid' : 'none',
            borderColor: isExpanded ? 'primary.200' : 'transparent',
            '&.Mui-selected': {
              backgroundColor: hasDirectPath ? 'primary.100' : 'primary.main',
              color: hasDirectPath ? 'primary.main' : 'primary.contrastText',
              '&:hover': {
                backgroundColor: hasDirectPath ? 'primary.200' : 'primary.dark',
              },
            },
            '&:hover': {
              backgroundColor: isExpanded ? 'primary.100' : 'action.hover',
              transform: 'translateX(2px)',
              transition: 'all 0.2s ease-in-out',
            }
          }}
        >
          {behavior.showIcons && (
            <ListItemIcon sx={{ 
              minWidth: styles.compact ? 32 : 36, 
              '& .MuiSvgIcon-root': { 
                fontSize: '1.2rem',
                color: isExpanded ? 'primary.main' : 'action.active'
              } 
            }}>
              {getIconComponent(category.icon)}
            </ListItemIcon>
          )}
          {behavior.showLabels && (
            <ListItemText 
              primary={
                <Typography 
                  variant="subtitle2" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: styles.compact ? '0.7rem' : '0.75rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: isExpanded ? 'primary.main' : 'text.primary'
                  }}
                >
                  {category.title}
                </Typography>
              }
              secondary={
                category.description && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: styles.compact ? '0.6rem' : '0.65rem',
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {category.description}
                  </Typography>
                )
              }
            />
          )}
          {!hasDirectPath && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </Box>
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const renderMenuItem = (item, isSubItemParam = false, hasSubItems = false) => {
    // Safety check - if item is null/undefined, return null
    if (!item || typeof item !== 'object') {
      return null;
    }
    
    // Ensure item has required properties
    if (!item.path && !item.text) {
      return null;
    }

    if (!isItemVisible(item)) {
      return null;
    }
    
    try {
      const isSelected = location.pathname === (item.path || '');
      const isSubGroup = item.isSubGroup || false;
      const isSubItem = item.isSubItem || isSubItemParam;
    
    // For items with sub-items, add expand/collapse toggle
    const isExpanded = hasSubItems ? expandedSections[item.moduleName] : false;
    const handleToggle = (e) => {
      e.stopPropagation();
      setExpandedSections(prev => ({
        ...prev,
        [item.moduleName]: !prev[item.moduleName]
      }));
    };
    
    const isSubSubItem = item.isSubSubItem || false;
    const isFavorite = favorites.has(item.path);
    const notificationCount = getNotificationCount(item.moduleName);
    
    return (
      <ListItem key={item.text || item.path || `item-${Math.random()}`} disablePadding>
        <ListItemButton
          selected={isSelected}
          onClick={() => item.path && navigate(item.path)}
          sx={{
            pl: isSubGroup ? (styles.compact ? 2.5 : 3) : 
                isSubSubItem ? (styles.compact ? 6 : 7) :
                isSubItem ? (styles.compact ? 4 : 5) : 
                (styles.compact ? 1.5 : 2),
            pr: styles.compact ? 0.75 : 1,
            py: styles.compact ? 0.25 : 0.5,
            mx: styles.compact ? 0.25 : 0.5,
            mb: 0.125,
            borderRadius: 1,
            backgroundColor: isSubGroup ? 'action.selected' : 'transparent',
            borderLeft: isSubGroup ? '3px solid' : 'none',
            borderLeftColor: isSubGroup ? 'primary.main' : 'transparent',
            position: 'relative',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              }
            },
            '&:hover': {
              backgroundColor: isSubGroup ? 'action.hover' : 'action.hover',
              borderRadius: 1,
              transform: 'translateX(2px)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
        >
          {behavior.showIcons && item.icon && (
            <ListItemIcon sx={{ 
              minWidth: isSubGroup ? (styles.compact ? 28 : 32) : 
                       isSubSubItem ? (styles.compact ? 24 : 28) :
                       isSubItem ? (styles.compact ? 28 : 32) : 
                       (styles.compact ? 32 : 36),
              color: isSelected ? 'inherit' : (isSubGroup ? 'primary.main' : 'action.active'),
              '& .MuiSvgIcon-root': { fontSize: '1.1rem' }
            }}>
              {getIconComponent(item.icon)}
            </ListItemIcon>
          )}
          {behavior.showLabels && (
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant={isSubGroup ? 'body1' : isSubSubItem ? 'body2' : isSubItem ? 'body2' : 'body1'}
                    fontWeight={isSubGroup ? 600 : isSelected ? 600 : 400}
                    fontSize={styles.compact ? 
                      (isSubGroup ? '0.75rem' : isSubSubItem ? '0.65rem' : isSubItem ? '0.7rem' : '0.75rem') : 
                      (isSubGroup ? '0.8rem' : isSubSubItem ? '0.7rem' : isSubItem ? '0.75rem' : '0.8rem')
                    }
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: isSubGroup ? 'primary.main' : 'inherit',
                      flex: 1
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              }
            />
          )}
          
          {/* Expand/Collapse icon for items with sub-items */}
          {hasSubItems && (
            <IconButton 
              size="small" 
              onClick={handleToggle}
              sx={{ ml: 'auto', mr: 0.5, color: 'inherit' }}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          
          {/* Right side controls: Notifications and Favorite toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: hasSubItems ? 0 : 'auto' }}>
            {/* Notification badge */}
            {notificationCount > 0 && (
              <Chip
                label={notificationCount}
                size="small"
                sx={{
                  height: '18px',
                  minWidth: '18px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  backgroundColor: '#FF5722',
                  color: '#ffffff',
                  '& .MuiChip-label': {
                    px: 0.5
                  }
                }}
              />
            )}
            
            {/* Favorite toggle button */}
            <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.path);
                }}
                sx={{ 
                  p: 0.25,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                {isFavorite ? (
                  <Star sx={{ fontSize: '0.9rem', color: 'warning.main' }} />
                ) : (
                  <StarBorder sx={{ fontSize: '0.9rem' }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </ListItemButton>
      </ListItem>
    );
    } catch (error) {
      console.error('Error rendering menu item:', error, item);
      return null;
    }
  };

  // Handle top position differently (horizontal sidebar)
  if (styles.position === 'top') {
    const menuCategories = getMenuCategories(menuVisibility)
      .filter(shouldShowCategory)
      .filter(category => category.type !== 'ARCHIVE');
    
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 64, // Below header
          left: 0,
          right: 0,
          height: open ? (isMobile ? '48px' : '56px') : 0, // Minimal height for top sidebar
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          zIndex: theme.zIndex.drawer,
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Horizontal Menu Bar */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center',
            height: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            px: 1,
            gap: 0.5,
            py: 0.5,
            '&::-webkit-scrollbar': {
              height: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '2px',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.3)',
              },
            },
          }}
        >
          {/* Home/Dashboard Button */}
          {menuCategories
            .filter(category => category.type === 'DASHBOARD')
            .map(category => (
              <ListItemButton
                key={category.title}
                selected={location.pathname === category.path}
                onClick={() => category.path && navigate(category.path)}
                sx={{
                  minWidth: 'auto',
                  px: isMobile ? 1.5 : 2,
                  py: isMobile ? 0.5 : 0.75,
                  borderRadius: 1,
                  flexShrink: 0,
                  height: isMobile ? '40px' : '48px',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <Dashboard sx={{ mr: isMobile ? 0.5 : 1, fontSize: isMobile ? '1rem' : '1.1rem' }} />
                {/* Home shows only icon - no text */}
              </ListItemButton>
            ))}
          
          {/* Divider */}
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          
          {/* Menu Categories with Dropdowns */}
          {menuCategories
            .filter(category => category.type !== 'DASHBOARD')
            .map((category) => {
              // Safety check - ensure categoryItems is always an array
              const categoryItems = Array.isArray(category.items) ? category.items.filter(Boolean) : [];
              const hasItems = categoryItems.length > 0;
              const anchorKey = category.title;
              const anchorEl = topMenuAnchors[anchorKey] || null;
              const isMenuOpen = Boolean(anchorEl);
              
              const handleMenuOpen = (event) => {
                if (hasItems) {
                  setTopMenuAnchors(prev => ({ ...prev, [anchorKey]: event.currentTarget }));
                } else if (category.path) {
                  navigate(category.path);
                }
              };
              
              const handleMenuClose = () => {
                setTopMenuAnchors(prev => {
                  const newAnchors = { ...prev };
                  delete newAnchors[anchorKey];
                  return newAnchors;
                });
              };
              
              // Check if any item in category is selected
              const isCategorySelected = categoryItems.some(item => item.path === location.pathname);
              
              return (
                <React.Fragment key={category.title}>
                  <ListItemButton
                    onClick={handleMenuOpen}
                    selected={isCategorySelected}
                    sx={{
                      minWidth: 'auto',
                      px: isMobile ? 1.5 : 2,
                      py: isMobile ? 0.5 : 0.75,
                      borderRadius: 1,
                      flexShrink: 0,
                      height: isMobile ? '40px' : '48px',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    }}
                  >
                    {category.icon && (
                      <Box component="span" sx={{ mr: isMobile ? 0.5 : 1, display: 'flex', alignItems: 'center' }}>
                        {getIconComponent(category.icon)}
                      </Box>
                    )}
                    {!isMobile && category.title !== 'Home' && (
                      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                        {category.title}
                      </Typography>
                    )}
                    {hasItems && (
                      <ExpandMore sx={{ ml: 0.5, fontSize: '0.9rem' }} />
                    )}
                  </ListItemButton>
                  
                  {/* Dropdown Menu for Category Items */}
                  {hasItems && (
                    <Menu
                      anchorEl={anchorEl}
                      open={isMenuOpen}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      PaperProps={{
                        sx: {
                          maxHeight: 'calc(100vh - 180px)',
                          maxWidth: 280,
                          mt: 1,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <Box sx={{ py: 1 }}>
                        {categoryItems.filter(Boolean).map((item, index) => {
                          // Safety check - skip null/undefined items
                          if (!item) {
                            return null;
                          }
                          
                          const isSelected = location.pathname === item.path;
                          const isFavorite = favorites.has(item.path);
                          
                          return (
                            <MenuItem
                              key={item.path || item.text || index}
                              selected={isSelected}
                              onClick={() => {
                                if (item.path) {
                                  navigate(item.path);
                                }
                                handleMenuClose();
                              }}
                              sx={{
                                px: 2,
                                py: 1,
                                '&.Mui-selected': {
                                  backgroundColor: 'primary.main',
                                  color: 'primary.contrastText',
                                  '&:hover': {
                                    backgroundColor: 'primary.dark',
                                  },
                                },
                              }}
                            >
                              {item.icon && (
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  {getIconComponent(item.icon)}
                                </ListItemIcon>
                              )}
                              <ListItemText 
                                primary={item.text}
                                primaryTypographyProps={{
                                  fontSize: '0.875rem',
                                }}
                              />
                              {isFavorite && (
                                <Typography sx={{ ml: 1, fontSize: '0.75rem' }}>⭐</Typography>
                              )}
                            </MenuItem>
                          );
                        })}
                      </Box>
                    </Menu>
                  )}
                </React.Fragment>
              );
            })}
        </Box>
      </Box>
    );
  }

  return (
    <Drawer
      variant="persistent"
      open={open}
      anchor={styles.position}
      sx={{
        width: styles.width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: styles.width,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          color: 'inherit',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          borderRight: styles.position === 'left' ? '1px solid #e0e0e0' : 'none',
          borderLeft: styles.position === 'right' ? '1px solid #e0e0e0' : 'none',
          overflowX: 'hidden',
          boxShadow: styles.position === 'left' ? '2px 0 12px rgba(0,0,0,0.08)' : '-2px 0 12px rgba(0,0,0,0.08)',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.3)',
            },
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Toolbar />
      
      {/* Sticky Home Section */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1, 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <List dense={styles.compact} sx={{ py: 0, px: 0.5 }}>
          {getMenuCategories(menuVisibility)
            .filter(shouldShowCategory)
            .filter(category => category.type !== 'ARCHIVE')  // Hide Archive category
            .filter(category => category.type === 'DASHBOARD')
            .map(category => (
              <Box key={category.title} sx={{ mb: 0.5 }}>
                {renderCategoryHeader(category)}
              </Box>
            ))}
        </List>
      </Box>

      {/* Sticky Favorites Section with Accordion */}
      {Array.from(favorites).length > 0 && (
        <Box sx={{ 
          position: 'sticky', 
          top: '48px', 
          zIndex: 1, 
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Accordion 
            defaultExpanded={true}
            sx={{ 
              boxShadow: 'none',
              '&:before': { display: 'none' },
              borderBottom: '1px solid #e0e0e0'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: 'auto',
                '&.Mui-expanded': {
                  minHeight: 'auto'
                },
                '& .MuiAccordionSummary-content': {
                  margin: '8px 0'
                }
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.7rem'
                }}
              >
                ⭐ Favorites ({Array.from(favorites).length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, pb: 1 }}>
              <List dense={styles.compact} sx={{ py: 0, px: 0.5 }}>
                {Array.from(favorites).map(favPath => {
                  const allItems = getMenuCategories(menuVisibility)
                    .filter(shouldShowCategory)
                    .filter(category => category.type !== 'ARCHIVE')  // Hide Archive category
                    .flatMap(cat => (cat.items || []).filter(isItemVisible))
                    .find(item => item && item.path === favPath);
                  
                  return allItems ? renderMenuItem(allItems) : null;
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      
      {/* Scrollable Menu Categories */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {getMenuCategories(menuVisibility)
          .filter(shouldShowCategory)
          .filter(category => category.type !== 'ARCHIVE')  // Hide Archive category
          .filter(category => category.type !== 'DASHBOARD')
          .map((category) => (
            <Box key={category.title} sx={{ mb: category.type ? 0.5 : 0.125 }}>
              <List dense={styles.compact} sx={{ py: 0, px: 0.5 }}>
                {category.type && (
                  <>
                    {renderCategoryHeader(category)}
                    <Collapse in={expandedSections[category.title]} timeout="auto" unmountOnExit>
                      <List dense={styles.compact} disablePadding sx={{ pb: 1 }}>
                        {(category.items || []).filter(isItemVisible).map((item, index) => {
                          // Safety check - skip null/undefined items
                          if (!item || !item.path) {
                            return null;
                          }
                          
                          // Handle sub-categories (like "Point Of Sale - Phase 2")
                          const subItems = (category.items || []).filter(i => i && i.parentCategory === item.moduleName && isItemVisible(i));
                          const hasSubItems = subItems.length > 0;
                          
                          // Skip items that are sub-items
                          if (item.parentCategory) {
                            return null;
                          }
                          
                          return (
                            <React.Fragment key={`menu-${index}`}>
                              {renderMenuItem(item, true, hasSubItems)}
                              {hasSubItems && (
                                <Collapse in={expandedSections[item.moduleName]} timeout="auto" unmountOnExit>
                                  <List component="div" disablePadding>
                                    {subItems.filter(Boolean).map((subItem, subIndex) => 
                                      subItem ? (
                                        <Box key={`sub-${subIndex}`} sx={{ pl: 4 }}>
                                          {renderMenuItem(subItem, true)}
                                        </Box>
                                      ) : null
                                    )}
                                  </List>
                                </Collapse>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </List>
                    </Collapse>
                  </>
                )}
              </List>
              {category.type && (
                <Divider 
                  sx={{ 
                    mx: 2, 
                    my: 0.5,
                    borderColor: 'rgba(0,0,0,0.06)'
                  }} 
                />
              )}
            </Box>
          ))}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
