import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Toolbar,
  Typography,
  Divider,
  Box,
  Collapse,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  ShoppingCart,
  People,
  Category,
  Store,
  Group,
  Inventory,
  Assessment,
  Settings,
  AccountCircle,
  Receipt,
  Payment,
  TrendingUp,
  ExpandLess,
  ExpandMore,
  PointOfSale,
  Launch,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 280;

const SimplifiedSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen] = useState(true); // Always open for simplicity
  const [expandedSections, setExpandedSections] = useState({
    'master-data': true,
    'transactions': true,
    'reports': false,
    'settings': true
  });

  // Get sidebar background color from localStorage
  const [sidebarBgColor, setSidebarBgColor] = useState('#212121');
  
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('sidebarPreferences');
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        if (preferences.sidebar_background_color) {
          setSidebarBgColor(preferences.sidebar_background_color);
        }
      }
    } catch (error) {
      console.error('Error loading sidebar preferences:', error);
    }
  }, []);

  const menuCategories = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      description: 'Main dashboard and overview',
      color: '#1976d2'
    },
    {
      id: 'master-data',
      title: 'Master Data',
      icon: <Store />,
      description: 'Core business data management',
      color: '#1976d2',
      items: [
        {
          text: 'Products',
          icon: <ShoppingCart />,
          path: '/products',
          description: 'Manage product catalog, pricing, and inventory',
          badge: '100+'
        },
        {
          text: 'Categories',
          icon: <Category />,
          path: '/categories',
          description: 'Organize products into categories and subcategories',
          badge: '15+'
        },
        {
          text: 'Customers',
          icon: <People />,
          path: '/customers',
          description: 'Customer database and relationship management',
          badge: '250+'
        },
        {
          text: 'Suppliers',
          icon: <Group />,
          path: '/suppliers',
          description: 'Supplier information and purchase management',
          badge: '25+'
        }
      ]
    },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: <Receipt />,
      description: 'Sales and purchase operations',
      color: '#2e7d32',
      items: [
        {
          text: 'POS Screen',
          icon: <PointOfSale />,
          path: '/pos',
          description: 'Point of sale terminal for sales transactions',
          badge: 'Live'
        },
        {
          text: 'Inventory',
          icon: <Inventory />,
          path: '/inventory',
          description: 'Stock management and inventory tracking',
          badge: 'Coming Soon'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: <Assessment />,
      description: 'Business intelligence and reporting',
      color: '#1976d2',
      items: [
        {
          text: 'Sales Reports',
          icon: <TrendingUp />,
          path: '/reports',
          description: 'Sales performance and revenue analytics',
          badge: 'Coming Soon'
        }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings />,
      description: 'System configuration and preferences',
      color: '#666666',
      items: [
        {
          text: 'Layout Preferences',
          icon: <Settings />,
          path: '/settings/layout-preferences',
          description: 'Customize sidebar and layout settings',
          badge: 'New'
        },
        {
          text: 'Wireframe Launchpad',
          icon: <Launch />,
          path: '/wireframes',
          description: 'Jump to any UI wireframe for quick reviews',
          badge: 'New'
        },
        {
          text: 'System Settings',
          icon: <AccountCircle />,
          path: '/settings',
          description: 'General system configuration',
          badge: 'Coming Soon'
        }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Helper function to determine text color based on background
  const getTextColor = (opacity = 1) => {
    const isLightBackground = sidebarBgColor === '#ffffff' || sidebarBgColor === '#f5f5f5';
    if (isLightBackground) {
      return `rgba(0,0,0,${opacity})`;
    }
    return `rgba(255,255,255,${opacity})`;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: sidebarBgColor,
          color: sidebarBgColor === '#ffffff' || sidebarBgColor === '#f5f5f5' ? '#000000' : 'white',
          overflow: 'hidden',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      }}
      open={sidebarOpen}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: getTextColor(), fontWeight: 'bold' }}>
          Flow Retail
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: `${getTextColor(0.1)}40` }} />

      <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
        <List>
          {menuCategories.map((category) => (
            <React.Fragment key={category.id}>
              {/* Category Header */}
              <ListItem 
                disablePadding 
                sx={{ 
                  mb: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                }}
              >
                <ListItemButton 
                  onClick={category.path ? () => navigate(category.path) : undefined}
                  sx={{ 
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
                  }}
                >
                  <ListItemIcon sx={{ color: category.color, minWidth: 36 }}>
                    {category.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={category.title}
                    secondary={category.description}
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 600,
                      sx: { color: getTextColor() }
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.75rem',
                      sx: { color: getTextColor(0.7) }
                    }}
                  />
                  {category.items && (
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        size="small"
                        onClick={() => toggleSection(category.id)}
                        sx={{ color: getTextColor(0.7) }}
                      >
                        {expandedSections[category.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Category Items */}
              {category.items && (
                <Collapse in={expandedSections[category.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    {category.items.map((item) => (
                      <ListItem key={item.text} disablePadding>
                        <ListItemButton 
                          onClick={() => navigate(item.path)}
                          selected={location.pathname === item.path}
                          sx={{ 
                            borderRadius: 1,
                            mb: 0.25,
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                            '&.Mui-selected': {
                              backgroundColor: category.color,
                              color: 'white',
                              '& .MuiListItemIcon-root': { color: 'white' },
                              '& .MuiListItemText-root': { color: 'white' },
                              '&:hover': {
                                backgroundColor: category.color,
                                opacity: 0.8,
                              }
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: getTextColor(0.8), minWidth: 32 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text}
                            secondary={item.description}
                            primaryTypographyProps={{ 
                              fontSize: '0.85rem',
                              sx: { color: getTextColor() }
                            }}
                            secondaryTypographyProps={{ 
                              fontSize: '0.7rem',
                              sx: { color: getTextColor(0.6) }
                            }}
                          />
                          {item.badge && (
                            <Chip
                              label={item.badge}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                backgroundColor: item.badge === 'Live' ? '#4caf50' : 
                                                item.badge === 'Coming Soon' ? '#ff9800' : '#2196f3',
                                color: 'white',
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${getTextColor(0.1)}40` }}>
        <Typography variant="caption" sx={{ color: getTextColor(0.5), fontSize: '0.7rem' }}>
          Flow Retail System v1.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SimplifiedSidebar;
