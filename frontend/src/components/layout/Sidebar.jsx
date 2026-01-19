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
  Rocket,
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLayout } from '../../contexts/LayoutContext';
import { getMenuCategories } from '../../utils/menuStructure';
import menuService from '../../services/menuService';

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
  // Missing icons that were identified
  'Search': Search,
  'Lightbulb': Lightbulb,
  'ReportsIcon': ReportsIcon,
  'Language': Language,
  'AssignmentReturn': AssignmentReturn,
  // Fallback icons for missing ones
  'SalesOrder': ShoppingCart,
  // Ultra Item Master icon
  'Rocket': Rocket,
};

// Helper function to get icon component from string name
const getIconComponent = (iconName) => {
  if (!iconName) return null;
  const IconComponent = iconComponents[iconName];
  return IconComponent ? <IconComponent /> : null;
};

// Using centralized menu structure from utils/menuStructure.js

const Sidebar = ({ open = true, showSidebar = true, favoritesVisible = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get layout context - hooks must be called at top level
  const layoutContext = useLayout();

  // State for dynamic menu from backend
  const [dynamicMenuCategories, setDynamicMenuCategories] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);

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


  // Load dynamic menu from backend on component mount
  useEffect(() => {
    const loadDynamicMenu = async () => {
      try {
        setMenuLoading(true);
        console.log('🔄 Loading dynamic menu from backend...');

        const menuData = await menuService.getCompleteMenuStructure();
        console.log('📊 Backend menu data:', menuData);

        if (menuData && menuData.categories && menuData.categories.length > 0) {
          setDynamicMenuCategories(menuData.categories);
          console.log('✅ Dynamic menu loaded with categories:', menuData.categories.map(cat => cat.title));
        } else {
          console.log('⚠️ No dynamic menu data, using static fallback');
          // Fallback to static menu structure
          setDynamicMenuCategories([]);
        }
      } catch (error) {
        console.error('❌ Error loading dynamic menu:', error);
        // Fallback to static menu structure
        setDynamicMenuCategories([]);
      } finally {
        setMenuLoading(false);
      }
    };

    loadDynamicMenu();
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
    if (!category) return null; // Skip invalid categories
    if (!shouldShowCategory(category)) return null;

    // For dynamic categories, check if they have items or a direct path
    const hasItems = category.items && category.items.length > 0;
    const hasDirectPath = category.path && (!category.items || category.items.length === 0);

    // Skip categories that have no items and no direct path (empty categories)
    if (!hasItems && !hasDirectPath) return null;

    const isExpanded = expandedSections[category.title];
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
      const isSubcategory = item.isSubcategory || false;

      // For items with sub-items, add expand/collapse toggle
      const expandKey = isSubcategory ? item.text : item.moduleName;
      const isExpanded = hasSubItems ? expandedSections[expandKey] !== false : false;
      const handleToggle = (e) => {
        e.stopPropagation();
        setExpandedSections(prev => ({
          ...prev,
          [expandKey]: !prev[expandKey]
        }));
      };

      const isSubSubItem = item.isSubSubItem || false;
      const isFavorite = favorites.has(item.path);
      const notificationCount = getNotificationCount(item.moduleName);

      return (
        <ListItem key={item.text || item.path || `item-${Math.random()}`} disablePadding>
          <ListItemButton
            selected={isSelected}
            onClick={() => {
              if (item.path) {
                navigate(item.path);
              }
            }}
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
          </ListItemButton>
        </ListItem>
      );
    } catch (error) {
      console.error('Error rendering menu item:', error, item);
      return null;
    }
  };

  const renderSubcategoryHeader = (subcategory, categoryTitle) => {
    const expandKey = `${categoryTitle}-${subcategory}`;
    const isExpanded = expandedSections[expandKey] !== false;

    return (
      <ListItem key={`subcategory-${subcategory}`} disablePadding>
        <ListItemButton
          onClick={() => handleSectionToggle(expandKey)}
          sx={{
            pl: styles.compact ? 2 : 2.5,
            pr: styles.compact ? 0.75 : 1,
            py: styles.compact ? 0.25 : 0.4,
            mx: styles.compact ? 0.25 : 0.5,
            mb: 0.125,
            borderRadius: 1,
            backgroundColor: 'action.hover',
            borderLeft: '3px solid',
            borderLeftColor: 'primary.main',
            position: 'relative',
            '&:hover': {
              backgroundColor: 'action.selected',
              transform: 'translateX(2px)',
              transition: 'all 0.2s ease-in-out',
            }
          }}
        >
          <ListItemIcon sx={{
            minWidth: styles.compact ? 24 : 28,
            color: 'primary.main',
            '& .MuiSvgIcon-root': { fontSize: '1rem' }
          }}>
            <Settings />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="body2"
                fontWeight={600}
                fontSize={styles.compact ? '0.7rem' : '0.75rem'}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'primary.main'
                }}
              >
                {subcategory}
              </Typography>
            }
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </ListItemButton>
      </ListItem>
    );
  };

  const renderCategoryItems = (category) => {
    if (!category.items || category.items.length === 0) {
      return null;
    }

    // Group items by subcategory
    const itemsWithSubcategory = category.items.filter(item => isItemVisible(item) && item.subcategory);
    const itemsWithoutSubcategory = category.items.filter(item => isItemVisible(item) && !item.subcategory);

    // Get unique subcategories
    const subcategories = [...new Set(itemsWithSubcategory.map(item => item.subcategory))];

    return (
      <>
        {/* Render items without subcategory first */}
        {itemsWithoutSubcategory.map((item) => renderMenuItem(item, false, false))}

        {/* Render subcategories and their items */}
        {subcategories.map(subcategory => {
          const expandKey = `${category.title}-${subcategory}`;
          const isExpanded = expandedSections[expandKey] !== false;
          const subcategoryItems = itemsWithSubcategory.filter(item => item.subcategory === subcategory);

          return (
            <Box key={subcategory}>
              {renderSubcategoryHeader(subcategory, category.title)}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                  {subcategoryItems.map((item) => renderMenuItem(item, true, false))}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </>
    );
  };

  // Get menu categories - prioritize dynamic menu from backend, fallback to static
  const menuCategories = dynamicMenuCategories.length > 0 ? dynamicMenuCategories : getMenuCategories(visibilityMap);

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor={styles.position}
      open={open}
      onClose={() => { }}
      sx={{
        width: styles.width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: styles.width,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0, 0, 0, 0.3)',
          },
        },
      }}
    >
      <Toolbar />

      {/* Sticky Favorites Section with Accordion */}
      {Array.from(favorites).length > 0 && favoritesVisible && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1,
          mb: 1
        }}>
          <Accordion
            defaultExpanded
            elevation={0}
            sx={{
              '&:before': { display: 'none' },
              boxShadow: 'none',
              backgroundColor: 'transparent',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: 'auto !important',
                '& .MuiAccordionSummary-content': {
                  margin: '8px 0',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ fontSize: 20, color: 'warning.main' }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Favorites
                </Typography>
                <Chip
                  label={favorites.size}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List dense>
                {Array.from(favorites).map((path) => {
                  const item = menuCategories
                    .flatMap(cat => cat.items || [])
                    .find(item => item.path === path);
                  if (!item) return null;
                  return renderMenuItem(item, false, false);
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      <List sx={{ px: 1, py: 1 }}>
        {menuCategories.map((category) => {
          if (!shouldShowCategory(category)) return null;

          const isExpanded = expandedSections[category.title];
          const hasItems = category.items && category.items.length > 0;
          const hasDirectPath = category.path && (!category.items || category.items.length === 0);

          return (
            <Box key={category.title}>
              {renderCategoryHeader(category)}

              {hasItems && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding dense>
                    {renderCategoryItems(category)}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
