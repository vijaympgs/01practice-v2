import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  IconButton,
  Button,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
} from '@mui/icons-material';
import { getMenuCategories } from '../../utils/menuStructure';
import api from '../../services/api';
import userPermissionService from '../../services/userPermissionService';
import { useNotification } from '../../contexts/NotificationContext';
import StatusBar from '../../components/common/StatusBar';
import { formatErrorResponse } from '../../utils/notifications';

const UserAndPermissionPage = () => {
  const { displayError, displaySuccess } = useNotification();
  
  // Theme loading (as per Master Pattern)
  const [themeColor, setThemeColor] = useState('#1976d2');
  const [statusMessage, setStatusMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0); // Tab state: 0 = Role Permissions, 1 = User-Role Mapping, 2 = User-Location Mapping
  const [users, setUsers] = useState([]); // For User-Role Mapping tab
  const [userRoleMapping, setUserRoleMapping] = useState({}); // { userId: roleKey }
  const [userLocationMapping, setUserLocationMapping] = useState({}); // { userId: locationId }
  const [locations, setLocations] = useState([]); // For Location-User Mapping tab
  const [viewTemplateMenuAnchor, setViewTemplateMenuAnchor] = useState(null); // For role template selection menu
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const fileInputRef = React.useRef(null);
  
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // First check localStorage (global variable)
        const cachedTheme = localStorage.getItem('activeTheme');
        if (cachedTheme) {
          try {
            const parsedTheme = JSON.parse(cachedTheme);
            setThemeColor(parsedTheme.primary_color || '#1976d2');
            return; // Exit early if we have cached theme
          } catch (parseError) {
            console.warn('Error parsing cached theme:', parseError);
          }
        }
        
        // No API fallback needed - we're using localStorage only
        // Theme is set from localStorage above, so if we get here, use default
      } catch (error) {
        console.error('Error loading theme:', error);
        // Set default theme on error
        setThemeColor('#1976d2');
      }
    };
    
    // Wrap in error handler to prevent unhandled promise rejection
    loadTheme().catch(error => {
      console.error('Unhandled error in loadTheme:', error);
      setThemeColor('#1976d2');
    });
  }, []);

  // Fixed list of roles (X-axis of matrix)
  const roles = [
    { key: 'admin', label: 'Administrator', description: 'Full access to all features' },
    { key: 'posmanager', label: 'POS Manager', description: 'POS operations and management' },
    { key: 'posuser', label: 'POS User', description: 'POS billing and on-the-fly creation' },
    { key: 'backofficemanager', label: 'Back Office Manager', description: 'Back office operations and approvals' },
    { key: 'backofficeuser', label: 'Back Office User', description: 'Back office screens access' },
  ];
  
  const [menuColumns, setMenuColumns] = useState([]);
  const [permissions, setPermissions] = useState({}); // { roleKey: { menuItemId: { can_view, can_create, can_edit, can_delete } } }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState({}); // { roleKey: true/false }
  const [viewTemplateDialog, setViewTemplateDialog] = useState({
    open: false,
    templateData: null,
    loading: false,
  });
  
  // Available role templates
  const roleTemplates = [
    { value: 'admin', label: 'Administrator', description: 'Full access to all features' },
    { value: 'posmanager', label: 'POS Manager', description: 'POS operations and management' },
    { value: 'posuser', label: 'POS User', description: 'POS billing and on-the-fly creation' },
    { value: 'backofficemanager', label: 'Back Office Manager', description: 'Back office operations and approvals' },
    { value: 'backofficeuser', label: 'Back Office User', description: 'Back office screens access' },
  ];

  // Initialize all categories and sub-categories as expanded by default
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const categories = getMenuCategories({});
    const categorySet = new Set();
    categories.forEach(cat => {
      if (cat.type && cat.type !== 'DASHBOARD' && cat.items && cat.items.length > 0) {
        categorySet.add(cat.type);
      }
    });
    return categorySet;
  });
  
  const [expandedSubCategories, setExpandedSubCategories] = useState(() => {
    const categories = getMenuCategories({});
    const subCategorySet = new Set();
    categories.forEach(cat => {
      if (cat.items) {
        cat.items.forEach(item => {
          if (item.parentCategory) {
            subCategorySet.add(item.parentCategory);
          }
        });
      }
    });
    return subCategorySet;
  });

  // Extract menu structure into columns (runs first)
  useEffect(() => {
    const categories = getMenuCategories({});
    const columns = [];

        categories.forEach((category) => {
      if (category.type && category.type !== 'DASHBOARD') {
        // Group items by parent category (for sub-categories) FIRST
        const subCategories = new Map();
        const directItems = [];

        category.items.forEach((item) => {
          if (item.parentCategory) {
            if (!subCategories.has(item.parentCategory)) {
              subCategories.set(item.parentCategory, []);
            }
            subCategories.get(item.parentCategory).push(item);
          } else {
            directItems.push(item);
          }
        });

        // Only add category column if it has items (direct items or subcategories with items)
        const hasAnyItems = directItems.length > 0 || subCategories.size > 0;
        
        if (hasAnyItems) {
          // Add category column
          columns.push({
            id: `cat-${category.type}`,
            level: 0,
            type: 'category',
            category: category.title,
            subCategory: '',
            menuItem: '',
            moduleName: category.type || '',
          });
        }

        // Add sub-categories and their items (only if category has items)
        if (hasAnyItems) {
          subCategories.forEach((subItems, parentModuleName) => {
            const parentItem = category.items.find(
              (item) => item.moduleName === parentModuleName
            );
            
            if (parentItem && subItems.length > 0) {
              columns.push({
                id: `subcat-${parentModuleName}`,
                level: 1,
                type: 'subcategory',
                category: category.title,
                subCategory: parentItem.text,
                menuItem: '',
                moduleName: parentModuleName || '',
              });

              subItems.forEach((item, index) => {
                // Create unique ID by including category, subcategory, moduleName/text, and index to avoid duplicates
                const itemIdentifier = item.moduleName || item.text || item.path || `index-${index}`;
                const uniqueId = `item-${category.type || category.title}-${parentModuleName}-${itemIdentifier}-${index}`;
                columns.push({
                  id: uniqueId,
                  level: 2,
                  type: 'menuitem',
                  category: category.title,
                  subCategory: parentItem.text,
                  menuItem: item.text,
                  moduleName: item.moduleName || '',
                  path: item.path || '',
                });
              });
            }
          });
        }

        // Add direct items (no sub-category) - only if category has items
        if (hasAnyItems) {
          directItems.forEach((item, index) => {
            // Create unique ID by including category, moduleName/text, and index to avoid duplicates
            // Use item.text to ensure uniqueness even if moduleName is duplicated
            const itemIdentifier = item.moduleName || item.text || item.path || `index-${index}`;
            const uniqueId = `item-${category.type || category.title}-direct-${itemIdentifier}-${index}`;
            columns.push({
              id: uniqueId,
              level: 1,
              type: 'menuitem',
              category: category.title,
              subCategory: '',
              menuItem: item.text,
              moduleName: item.moduleName || '',
              path: item.path || '',
            });
          });
        }
      }
    });

    setMenuColumns(columns);
  }, []);

  // Load role template permissions for pre-population (defined as function that can be reused)
  const loadRoleTemplatePermissions = React.useCallback(async () => {
      const templatePerms = {};
      console.log('📥 Loading template permissions, menuColumns length:', menuColumns.length);
      console.log('📋 Sample menuColumns:', menuColumns.slice(0, 5).map(c => ({ id: c.id, moduleName: c.moduleName, type: c.type })));
      
      for (const role of roles) {
        try {
          // Get template permissions from backend
          const templateData = await userPermissionService.getRoleTemplate(role.key);
          if (templateData) {
            templatePerms[role.key] = {};
            
            // Prefer raw dictionary format if available (more efficient)
            const menuItemsDict = templateData.menu_items_dict || {};
            
            if (Object.keys(menuItemsDict).length > 0) {
              // Use raw dictionary format
              console.log(`Template data for ${role.key}:`, Object.keys(menuItemsDict).length, 'items (dict)');
              
              for (const menuItemId in menuItemsDict) {
                const perms = menuItemsDict[menuItemId];
                
                // Map to column IDs - find all matching columns by moduleName
                const matchingColumns = menuColumns.filter(col => col.moduleName === menuItemId);
                
                if (matchingColumns.length > 0) {
                  // Map to all matching column IDs
                  matchingColumns.forEach(matchingColumn => {
                    templatePerms[role.key][matchingColumn.id] = { ...perms };
                  });
                } else {
                  // Log when template item doesn't match any column (this might be the issue!)
                  console.warn(`⚠️ Template item "${menuItemId}" for role "${role.key}" has no matching column in menuColumns`, {
                    menuItemId,
                    role: role.key,
                    availableModuleNames: [...new Set(menuColumns.map(c => c.moduleName))].slice(0, 10),
                  });
                }
                
                // Always store by menu_item_id formats for fallback lookup (even if no column match)
                templatePerms[role.key][`item-${menuItemId}`] = { ...perms };
                templatePerms[role.key][menuItemId] = { ...perms };
              }
            } else if (templateData.menu_items && Array.isArray(templateData.menu_items)) {
              // Fallback to array format
              console.log(`Template data for ${role.key}:`, templateData.menu_items.length, 'items (array)');
              
              templateData.menu_items.forEach((menuItem) => {
                const menuItemId = menuItem.menu_item_id || menuItem.id || menuItem;
                
                // Extract permissions from the menu item object
                const perms = {
                  can_access: menuItem.can_access || false,
                  can_view: menuItem.can_view || false,
                  can_create: menuItem.can_create || false,
                  can_edit: menuItem.can_edit || false,
                  can_delete: menuItem.can_delete || false,
                };
                
                // Map to column IDs - find all matching columns by moduleName
                const matchingColumns = menuColumns.filter(col => col.moduleName === menuItemId);
                
                if (matchingColumns.length > 0) {
                  // Map to all matching column IDs
                  matchingColumns.forEach(matchingColumn => {
                    templatePerms[role.key][matchingColumn.id] = { ...perms };
                  });
                } else {
                  // Log when template item doesn't match any column
                  console.warn(`⚠️ Template item "${menuItemId}" for role "${role.key}" has no matching column (array format)`, {
                    menuItemId,
                    role: role.key,
                  });
                }
                
                // Always store by menu_item_id formats for fallback lookup (even if no column match)
                templatePerms[role.key][`item-${menuItemId}`] = { ...perms };
                templatePerms[role.key][menuItemId] = { ...perms };
              });
            }
            
            console.log(`Mapped template permissions for ${role.key}:`, Object.keys(templatePerms[role.key]).length, 'keys');
          }
        } catch (error) {
          // If 403 Forbidden, re-throw to be caught by caller
          if (error.response?.status === 403) {
            throw error;
          }
          // Otherwise, log warning but continue (templates are optional defaults)
          console.warn(`Could not load template for ${role.key}:`, error);
          templatePerms[role.key] = {};
        }
      }
      
      console.log('Final template permissions:', templatePerms);
      return templatePerms;
    }, [menuColumns, roles]);

  // Fetch role permissions (after menuColumns is ready)
  useEffect(() => {
    if (menuColumns.length === 0) return; // Wait for menu columns
    
    // Check authentication before making API calls
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('Not authenticated, skipping permissions load');
      setLoading(false);
      return;
    }
    
    let isMounted = true; // Flag to prevent state updates after unmount
    let hasRun = false; // Prevent multiple runs
    
    const fetchData = async () => {
      // Prevent multiple simultaneous calls
      if (hasRun) return;
      hasRun = true;
      
      try {
        if (isMounted) {
          setLoading(true);
          setStatusMessage('Loading permissions...');
        }
        
        // Load permissions for all roles
        const permissionsData = {};
        
        // CRITICAL: Load template permissions FIRST to ensure they're available for merge
        let templatePermissions = {};
        try {
          templatePermissions = await loadRoleTemplatePermissions(); // Pre-load templates
          console.log('Template permissions loaded:', Object.keys(templatePermissions).length, 'roles');
        } catch (templateError) {
          // If template loading fails due to 403, re-throw to be caught by outer catch
          if (templateError.response?.status === 403) {
            throw templateError;
          }
          // If 401, don't retry - user not authenticated
          if (templateError.response?.status === 401) {
            if (isMounted) {
              displayError('Authentication Required', ['Your session has expired. Please log in again.']);
              setTimeout(() => window.location.href = '/login', 2000);
            }
            return;
          }
          // Otherwise, log warning but continue (templates are optional defaults)
          console.warn('Template permissions could not be loaded, continuing without defaults:', templateError);
        }
        
        for (const role of roles) {
          // Check if still mounted before each API call
          if (!isMounted) return;
          
          try {
            const rolePerms = await userPermissionService.getRolePermissions(role.key);
            // Convert menu_item_id format to column.id format
            permissionsData[role.key] = {};
            for (const menuItemId in rolePerms) {
              // Map to column IDs (handle duplicates by assigning to all matching columns)
              const matchingColumns = menuColumns.filter(col => col.moduleName === menuItemId);
              if (matchingColumns.length > 0) {
                matchingColumns.forEach(matchingColumn => {
                  // Create a new object reference for React to detect changes
                  permissionsData[role.key][matchingColumn.id] = { ...rolePerms[menuItemId] };
                });
              }
              
              // Also store by menu_item_id formats for fallback lookup
              permissionsData[role.key][`item-${menuItemId}`] = { ...rolePerms[menuItemId] };
              permissionsData[role.key][menuItemId] = { ...rolePerms[menuItemId] };
            }
          } catch (error) {
            // Check for 403 Forbidden (admin-only access)
            if (error.response?.status === 403) {
              // Re-throw to be caught by outer catch block
              throw error;
            }
            // If 401, stop all API calls
            if (error.response?.status === 401) {
              if (isMounted) {
                displayError('Authentication Required', ['Your session has expired. Please log in again.']);
                setTimeout(() => window.location.href = '/login', 2000);
              }
              return;
            }
            // If no permissions in DB, initialize with empty object (will be merged with template)
            console.warn(`No permissions found for role ${role.key}, will use template defaults`, error);
            permissionsData[role.key] = {};
          }
        }
        
        // Merge template permissions where DB permissions are missing (pre-populate)
        // Always use template as base, then override with DB permissions if they exist
        for (const role of roles) {
          // Start with template permissions as default
          const roleTemplatePerms = templatePermissions[role.key] || {};
          const roleDbPerms = permissionsData[role.key] || {};
          
          console.log(`Merging for ${role.key}:`, {
            templateKeys: Object.keys(roleTemplatePerms).length,
            dbKeys: Object.keys(roleDbPerms).length,
          });
          
          // Always start with template, then merge DB on top (DB overrides template)
          const merged = {};
          
          // First, copy all template permissions
          for (const key in roleTemplatePerms) {
            merged[key] = { ...roleTemplatePerms[key] };
          }
          
          // Then, merge/override with DB permissions (DB takes precedence)
          for (const key in roleDbPerms) {
            merged[key] = {
              ...(roleTemplatePerms[key] || {
                can_access: false,
                can_view: false,
                can_create: false,
                can_edit: false,
                can_delete: false,
              }),
              ...roleDbPerms[key]
            };
          }
          
          permissionsData[role.key] = merged;
          console.log(`✅ Final merged for ${role.key}:`, Object.keys(merged).length, 'keys');
          
          // Debug: Log sample keys to verify templates are included
          const sampleKeys = Object.keys(merged).slice(0, 5);
          console.log(`📋 Sample keys for ${role.key}:`, sampleKeys);
          sampleKeys.forEach(key => {
            console.log(`  - ${key}:`, merged[key]);
          });
        }
        
        if (isMounted) {
          console.log('Setting permissions state with', Object.keys(permissionsData).length, 'roles');
          setPermissions(permissionsData);
          setStatusMessage('');
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Error fetching role permissions:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // Check for 403 Forbidden (admin-only access)
        if (error.response?.status === 403) {
          const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Access Denied';
          displayError(
            'Access Denied: User & Permissions Page',
            [
              errorMsg,
              'Only users with "admin" role can access this page.',
              'Please log in as "admin" to manage role permissions.',
              'Current user role is insufficient for this operation.'
            ]
          );
        } else if (error.response?.status === 401) {
          displayError(
            'Authentication Required',
            [
              'Your session has expired. Please log in again.',
              'Redirecting to login page...'
            ]
          );
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          displayError('Failed to load permissions. Please refresh the page.');
        }
        setPermissions({});
        setStatusMessage('');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Wrap fetchData call in error handler
    fetchData().catch(error => {
      console.error('Unhandled error in fetchData:', error);
      if (isMounted) {
        setLoading(false);
        setPermissions({});
        setStatusMessage('');
      }
    });
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [menuColumns.length]); // Only depend on menuColumns.length, not the array itself or loadRoleTemplatePermissions

  // Fetch locations for User-Location Mapping tab (Tab 2)
  useEffect(() => {
    if (activeTab === 2) {
      // Check authentication before making API calls
      const token = localStorage.getItem('accessToken');
      if (!token) {
        displayError('Authentication required. Please log in again.');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }

      const fetchLocations = async () => {
        try {
          setLoading(true);
          setStatusMessage('Loading locations...');
          
          // Fetch only store locations (location_type='store')
          const response = await api.get('/organization/locations/');
          let locationsList = [];
          
          if (response.data?.results && Array.isArray(response.data.results)) {
            locationsList = response.data.results.filter(loc => loc.location_type === 'store' && loc.is_active);
          } else if (Array.isArray(response.data)) {
            locationsList = response.data.filter(loc => loc.location_type === 'store' && loc.is_active);
          }
          
          setLocations(locationsList);
          setStatusMessage('');
          
          // Also load users to populate location mapping
          const usersResponse = await api.get('/auth/users/');
          let usersList = [];
          
          if (usersResponse.data?.results && Array.isArray(usersResponse.data.results)) {
            usersList = usersResponse.data.results.filter(u => u.role === 'posuser' || u.role === 'posmanager');
          } else if (Array.isArray(usersResponse.data)) {
            usersList = usersResponse.data.filter(u => u.role === 'posuser' || u.role === 'posmanager');
          }
          
          // Initialize location mapping from user data
          const initialMapping = {};
          usersList.forEach(user => {
            if (user.pos_location_id) {
              initialMapping[user.id] = user.pos_location_id;
            }
          });
          setUserLocationMapping(initialMapping);
          setUsers(usersList); // Store POS users for the table
          setStatusMessage('');
        } catch (error) {
          console.error('Error fetching locations:', error);
          
          // Handle 401 specifically
          if (error.response?.status === 401) {
            displayError('Your session has expired. Please log in again.');
            setTimeout(() => window.location.href = '/login', 2000);
          } else {
            displayError('Failed to load locations. Please try again.');
          }
          
          setLocations([]);
          setStatusMessage('');
        } finally {
          setLoading(false);
        }
      };
      
      fetchLocations();
    }
  }, [activeTab]);

  // Fetch users for User-Role Mapping tab
  useEffect(() => {
    if (activeTab === 1) {
      // Check authentication before making API calls
      const token = localStorage.getItem('accessToken');
      if (!token) {
        displayError('Authentication required. Please log in again.');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }

      const fetchUsers = async () => {
        try {
          setLoading(true);
          setStatusMessage('Loading users...');
          
          // Try different possible response formats - Fix: Use correct endpoint
          const response = await api.get('/auth/users/');
          let usersList = [];
          
          // Handle paginated response (with 'results' key)
          if (response.data?.results && Array.isArray(response.data.results)) {
            usersList = response.data.results;
          } 
          // Handle direct array response
          else if (Array.isArray(response.data)) {
            usersList = response.data;
          } 
          // Handle nested data response
          else if (response.data?.data && Array.isArray(response.data.data)) {
            usersList = response.data.data;
          } 
          // Handle single user object (unlikely but handle it)
          else if (response.data && typeof response.data === 'object' && !response.data.results) {
            // Check if it's actually a user object with id/username
            if (response.data.id || response.data.username) {
              usersList = [response.data];
            }
          }
          
          console.log('Users API Response:', { 
            status: response.status, 
            hasResults: !!response.data?.results,
            isArray: Array.isArray(response.data),
            usersCount: usersList.length,
            sampleUser: usersList[0]
          });
          
          if (usersList.length === 0) {
            console.warn('No users found in response:', response.data);
            displayError('No users found. Please create users through Django admin or check API response.');
          } else {
            setUsers(usersList);
            
            // Initialize user-role mapping with current user roles
            const initialMapping = {};
            usersList.forEach(user => {
              initialMapping[user.id] = user.role || 'posuser';
            });
            setUserRoleMapping(initialMapping);
            setStatusMessage('');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          console.error('Error response:', error.response?.data);
          
          // Handle 401 specifically
          if (error.response?.status === 401) {
            displayError('Your session has expired. Please log in again.');
            setTimeout(() => window.location.href = '/login', 2000);
          } else {
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to load users. Please try again.';
            displayError(errorMsg);
          }
          
          setUsers([]);
          setStatusMessage('');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUsers();
    }
  }, [activeTab]);

  // Handle permission change (4-column: View, Create, Edit, Delete)
  const handlePermissionChange = (roleKey, menuItemId, permissionType, checked) => {
    setPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[roleKey]) {
        newPerms[roleKey] = {};
      }
      if (!newPerms[roleKey][menuItemId]) {
        newPerms[roleKey][menuItemId] = {};
      }
      newPerms[roleKey][menuItemId] = {
        ...newPerms[roleKey][menuItemId],
        [permissionType]: checked,
      };
      return newPerms;
    });
  };

  // Handle category permission change (all items in category)
  const handleCategoryChange = (roleKey, categoryType, permissionType, checked) => {
    const categoryItemIds = getCategoryItems(categoryType);
    
    setPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[roleKey]) {
        newPerms[roleKey] = {};
      }
      categoryItemIds.forEach(itemId => {
        newPerms[roleKey][itemId] = {
          ...newPerms[roleKey][itemId],
          [permissionType]: checked,
        };
      });
      return newPerms;
    });
  };

  const getCellPadding = (level) => {
    return {
      pl: level === 0 ? 1 : level === 1 ? 2 : 3, // Reduced padding for compact fit
      pr: 0.5,
      py: 0.5, // Reduced vertical padding
      fontWeight: level === 0 ? 600 : level === 1 ? 500 : 400,
    };
  };

  const getCellText = (column) => {
    if (column.type === 'category') {
      return column.category;
    } else if (column.type === 'subcategory') {
      return column.subCategory;
    } else {
      return column.menuItem;
    }
  };

  const getCategoryItems = (categoryType) => {
    const categoryColumn = menuColumns.find(col => col.type === 'category' && col.moduleName === categoryType);
    if (!categoryColumn) return [];
    
    const categoryTitle = categoryColumn.category;
    const items = [];
    
    // Find all items that belong to this category (including subcategories and their items)
    menuColumns.forEach(col => {
      if (col.category === categoryTitle && col.type !== 'category') {
        items.push(col.id);
      }
    });
    
    return items;
  };

  const toggleCategory = (categoryType) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryType)) {
        newSet.delete(categoryType);
      } else {
        newSet.add(categoryType);
      }
      return newSet;
    });
  };

  const toggleSubCategory = (subCategoryModuleName) => {
    setExpandedSubCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subCategoryModuleName)) {
        newSet.delete(subCategoryModuleName);
      } else {
        newSet.add(subCategoryModuleName);
      }
      return newSet;
    });
  };

  const isColumnVisible = (column) => {
    if (column.type === 'category') {
      return true;
    } else if (column.type === 'subcategory') {
      const parentCategory = menuColumns.find(
        col => col.type === 'category' && col.category === column.category
      );
      if (!parentCategory) return false;
      return expandedCategories.has(parentCategory.moduleName);
    } else if (column.type === 'menuitem') {
      const parentCategory = menuColumns.find(
        col => col.type === 'category' && col.category === column.category
      );
      if (!parentCategory) return false;
      
      if (!expandedCategories.has(parentCategory.moduleName)) {
        return false;
      }
      
      if (column.subCategory) {
        const parentSubCategory = menuColumns.find(
          col => col.type === 'subcategory' && 
          col.category === column.category && 
          col.subCategory === column.subCategory
        );
        if (!parentSubCategory) return false;
        return expandedSubCategories.has(parentSubCategory.moduleName);
      }
      
      return true;
    }
    return true;
  };

  const visibleColumns = menuColumns.filter(col => isColumnVisible(col));

  // Save role permissions
  const handleSave = async () => {
    setSaving(true);
    setStatusMessage('Saving permissions...');
    try {
      // Format permissions for API (role-based)
      const formattedPermissions = userPermissionService.formatRolePermissionsForAPI(permissions);
      
      // Send to backend
      const response = await userPermissionService.saveBulkRolePermissions(formattedPermissions);
      
      setStatusMessage('');
      displaySuccess(
        `Role permissions saved successfully! (${response.created || 0} created, ${response.updated || 0} updated)`
      );
    } catch (error) {
      console.error('Error saving role permissions:', error);
      setStatusMessage('');
      
      // Extract error details using utility
      const { errorMessage, errorItems } = formatErrorResponse(error);
      displayError(errorMessage || 'Error saving role permissions', errorItems);
    } finally {
      setSaving(false);
    }
  };

  // View role template details (for reference)
  const handleViewTemplate = async (roleTemplate) => {
    setViewTemplateDialog({ open: true, templateData: null, loading: true });
    setStatusMessage(`Loading template for ${roleTemplate}...`);
    try {
      const templateData = await userPermissionService.getRoleTemplate(roleTemplate);
      if (!templateData) {
        throw new Error('Template data is empty');
      }
      setViewTemplateDialog({ open: true, templateData, loading: false });
      setStatusMessage('');
    } catch (error) {
      console.error('Error loading template:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.message || 
                       error.message || 
                       'Error loading template details. Please check the console and try again.';
      displayError(errorMsg);
      setViewTemplateDialog({ open: false, templateData: null, loading: false });
      setStatusMessage('');
    }
  };

  // Apply role template to a role (initialize permissions from template)
  const handleApplyTemplateToRole = async (roleKey) => {
    setApplyingTemplate(prev => ({ ...prev, [roleKey]: true }));
    setStatusMessage(`Applying template to ${roleKey}...`);
    try {
      const response = await userPermissionService.applyRoleTemplateToRole(roleKey);
      
      // Small delay to ensure backend has committed changes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reload permissions for this role after applying template
      const rolePerms = await userPermissionService.getRolePermissions(roleKey);
      
      // Update permissions state with new template-based permissions
      // Clear old permissions for this role and rebuild from scratch
      setPermissions(prev => {
        const newPerms = { ...prev };
        // Create a fresh permissions object for this role
        const rolePermissions = {};
        
        // Map backend menu_item_id to frontend column.id
        for (const menuItemId in rolePerms) {
          // Find all matching columns by moduleName
          const matchingColumns = menuColumns.filter(col => col.moduleName === menuItemId);
          
          if (matchingColumns.length > 0) {
            // Map to all matching columns (handle duplicates)
            matchingColumns.forEach(matchingColumn => {
              rolePermissions[matchingColumn.id] = { ...rolePerms[menuItemId] };
            });
          }
          
          // Also store by menu_item_id formats for fallback lookup
          rolePermissions[`item-${menuItemId}`] = { ...rolePerms[menuItemId] };
          rolePermissions[menuItemId] = { ...rolePerms[menuItemId] };
        }
        
        // Create new state object to force React re-render
        return {
          ...newPerms,
          [roleKey]: rolePermissions
        };
      });
      
      // Force a re-render by triggering a state update
      // This ensures React detects the permission changes
      // Wrap in try-catch to prevent unhandled promise rejection
      try {
        setTimeout(() => {
          setPermissions(prev => ({ ...prev }));
        }, 50);
      } catch (timerError) {
        console.warn('Error in permission state update timer:', timerError);
      }
      
      setStatusMessage('');
      displaySuccess(
        `Template applied successfully to ${roleKey}! (${response.permissions_created || 0} created, ${response.permissions_updated || 0} updated)`
      );
    } catch (error) {
      console.error('Error applying template:', error);
      setStatusMessage('');
      
      // Check for 401 Unauthorized error
      if (error.response?.status === 401) {
        displayError(
          'Authentication failed. Please log in again.',
          ['Your session may have expired. Please refresh the page and log in again.']
        );
        // Optionally redirect to login after a delay
        try {
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } catch (redirectError) {
          console.warn('Error setting up redirect:', redirectError);
        }
      } else {
        // Extract error details using utility
        const { errorMessage, errorItems } = formatErrorResponse(error);
        displayError(errorMessage || 'Error applying template', errorItems);
      }
    } finally {
      setApplyingTemplate(prev => ({ ...prev, [roleKey]: false }));
    }
  };

  // Permission types for 5-column matrix (with Access + full text labels)
  const permissionTypes = [
    { key: 'can_access', label: 'Access', tooltip: 'Access - Controls menu item visibility' },
    { key: 'can_view', label: 'View', tooltip: 'View - Can view/access the page' },
    { key: 'can_create', label: 'Create', tooltip: 'Create - Can create new records' },
    { key: 'can_edit', label: 'Edit', tooltip: 'Edit - Can edit existing records' },
    { key: 'can_delete', label: 'Delete', tooltip: 'Delete - Can delete records' },
  ];

  // Excel Download Handler
  const handleDownloadExcel = async () => {
    try {
      setStatusMessage('Downloading Excel template...');
      
      // Use api instance to ensure proper base URL and authentication
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.17:8000/api';
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        displayError('Authentication required', ['Please log in to download the Excel template.']);
        return;
      }
      
      const url = `${apiBaseUrl}/auth/roles/permissions/export-excel/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });
      
      if (!response.ok) {
        // Try to parse error as JSON, fallback to text
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.detail || errorData.message || `Failed to download: ${response.statusText}`);
      }
      
      // Get blob from response
      const blob = await response.blob();
      
      // Verify blob type
      if (!blob.type || !blob.type.includes('spreadsheet')) {
        console.warn('Unexpected blob type:', blob.type);
      }
      
      // Create blob URL and download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'role_permissions_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      displaySuccess('Excel template downloaded successfully');
      setStatusMessage('');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      console.error('Error details:', error.response?.data || error.message);
      const errorMsg = error.message || 'Error downloading Excel template. Please check your connection and try again.';
      displayError(errorMsg);
      setStatusMessage('');
    }
  };

  // Excel Upload Handler
  const handleUploadExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      displayError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    try {
      setUploadingExcel(true);
      setStatusMessage('Uploading and importing Excel file...');

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/auth/roles/permissions/import-excel/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      displaySuccess(
        `Excel file imported successfully! ${response.data.imported || 0} imported, ${response.data.updated || 0} updated.`
      );
      setStatusMessage('');

      // Reload permissions after import
      if (menuColumns.length > 0) {
        const fetchData = async () => {
          try {
            const permissionsData = {};
            const templatePermissions = await loadRoleTemplatePermissions();

            for (const role of roles) {
              try {
                const rolePerms = await userPermissionService.getRolePermissions(role.key);
                permissionsData[role.key] = {};
                for (const menuItemId in rolePerms) {
                  const matchingColumns = menuColumns.filter(col => col.moduleName === menuItemId);
                  if (matchingColumns.length > 0) {
                    matchingColumns.forEach(matchingColumn => {
                      permissionsData[role.key][matchingColumn.id] = { ...rolePerms[menuItemId] };
                    });
                  }
                  permissionsData[role.key][`item-${menuItemId}`] = { ...rolePerms[menuItemId] };
                  permissionsData[role.key][menuItemId] = { ...rolePerms[menuItemId] };
                }
              } catch (error) {
                permissionsData[role.key] = templatePermissions[role.key] || {};
              }
            }

            for (const role of roles) {
              const roleTemplatePerms = templatePermissions[role.key] || {};
              const roleDbPerms = permissionsData[role.key] || {};
              const merged = { ...roleTemplatePerms };
              for (const key in roleDbPerms) {
                merged[key] = {
                  ...(roleTemplatePerms[key] || {}),
                  ...roleDbPerms[key]
                };
              }
              for (const key in roleTemplatePerms) {
                if (!merged[key]) {
                  merged[key] = { ...roleTemplatePerms[key] };
                }
              }
              permissionsData[role.key] = merged;
            }

            setPermissions(permissionsData);
          } catch (error) {
            console.error('Error reloading permissions:', error);
          }
        };

        fetchData();
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading Excel:', error);
      const { errorMessage, errorItems } = formatErrorResponse(error);
      displayError(errorMessage || 'Error importing Excel file', errorItems);
      setStatusMessage('');
    } finally {
      setUploadingExcel(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title - Master Pattern */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="User and Permission" 
          subtitle="Manage role-based permissions across all menu categories, sub-categories, and menu items. Assign users to roles in a separate tab."
        />
      </Box>

      {/* Status Bar */}
      <StatusBar 
        message={statusMessage} 
        loading={saving || uploadingExcel || Object.values(applyingTemplate).some(val => val)} 
        themeColor={themeColor}
      />

      {/* Card with Tabs - Master Pattern */}
      <Card sx={{ borderRadius: 0 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
              },
              '& .Mui-selected': {
                color: themeColor,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: themeColor,
                height: 3,
              },
            }}
          >
            <Tab label="Role Permissions Matrix" />
            <Tab label="User-Role Mapping" />
            <Tab label="User-Location Mapping" />
          </Tabs>
        </Box>

        {/* Tab Panel 0: Role Permissions Matrix */}
        {activeTab === 0 && (
          <>
            <Box sx={{ 
              p: 2, 
              background: themeColor, 
              color: 'white',
              border: `2px solid ${themeColor}`, // Complete border around header
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">List</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={(e) => {
                      setViewTemplateMenuAnchor(e.currentTarget);
                    }}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    View Role Template
                  </Button>
                  {/* Role Template Selection Menu */}
                  <Menu
                    anchorEl={viewTemplateMenuAnchor}
                    open={Boolean(viewTemplateMenuAnchor)}
                    onClose={() => setViewTemplateMenuAnchor(null)}
                    PaperProps={{
                      sx: {
                        minWidth: 280,
                        maxWidth: 400,
                        mt: 1,
                      },
                    }}
                  >
                    {roles.map((role, index) => (
                      <MenuItem
                        key={role.key}
                        onClick={() => {
                          handleViewTemplate(role.key);
                          setViewTemplateMenuAnchor(null);
                        }}
                        sx={{
                          py: 1.5,
                          px: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: themeColor }}>
                              {role.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {role.description}
                            </Typography>
                          </Box>
                          <VisibilityIcon sx={{ color: themeColor, fontSize: '20px' }} />
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                  
                  {/* Excel Download Button */}
                  <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleDownloadExcel}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Download Excel
                  </Button>
                  
                  {/* Excel Upload Button */}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    disabled={uploadingExcel}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {uploadingExcel ? 'Uploading...' : 'Upload Excel'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      style={{ display: 'none' }}
                      onChange={handleUploadExcel}
                    />
                  </Button>
                  
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                      backgroundColor: 'white',
                      color: themeColor,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Permissions'}
                  </Button>
                </Box>
              </Box>
            </Box>

            <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 0, 
                maxHeight: 'calc(100vh - 300px)', 
                overflowX: 'hidden', // No horizontal scroll - auto-fit
                width: '100%',
              }}
            >
              <Table 
                stickyHeader 
                size="small"
                sx={{
                  tableLayout: 'fixed', // Fixed layout for consistent column widths
                  width: '100%',
                }}
              >
                <TableHead>
                  <TableRow>
                    {/* Menu Item Column (Y-axis) */}
                    <TableCell
                      sx={{
                        backgroundColor: themeColor,
                        color: 'white',
                        fontWeight: 600,
                        borderRight: '1px solid rgba(255,255,255,0.2)',
                        position: 'sticky',
                        left: 0,
                        zIndex: 3,
                        width: '15%', // Fixed width for menu item column (15% of table)
                        minWidth: '150px',
                        maxWidth: '200px',
                        p: 0.75,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                        Menu Item
                      </Typography>
                    </TableCell>
                    {/* Role Columns with 5 Permission Columns Each (X-axis) */}
                    {roles.map((role) => (
                      <TableCell
                        key={role.key}
                        colSpan={5}
                        sx={{
                          backgroundColor: themeColor,
                          color: 'white',
                          fontWeight: 600,
                          borderRight: '1px solid rgba(255,255,255,0.2)',
                          textAlign: 'center',
                          p: 0.5, // Minimal padding
                          width: '17%', // Each role gets ~17% width (5 roles = 85%, menu column = 15%)
                          minWidth: '120px',
                          maxWidth: '150px',
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.2 }}>
                            {role.label}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: '0.55rem', 
                              opacity: 0.9,
                              textAlign: 'center',
                              lineHeight: 1.1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              maxWidth: '100%',
                            }}
                          >
                            {role.description}
                          </Typography>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                  {/* Permission Type Headers Row - Rotated 90 degrees */}
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: themeColor,
                        color: 'white',
                        position: 'sticky',
                        left: 0,
                        zIndex: 2,
                        borderRight: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                    {roles.map((role) => (
                      permissionTypes.map((permType) => (
                        <TableCell
                          key={`${role.key}-${permType.key}`}
                          sx={{
                            backgroundColor: themeColor,
                            color: 'white',
                            fontWeight: 600,
                            textAlign: 'center',
                            borderRight: '1px solid rgba(255,255,255,0.2)',
                            width: '3.4%', // Each permission column gets 3.4% of table width (17% role / 5 permissions)
                            minWidth: 18,
                            maxWidth: 24,
                            height: 80, // Reduced height
                            p: 0.15, // Minimal padding
                            verticalAlign: 'bottom',
                            position: 'relative',
                          }}
                        >
                          <Tooltip title={permType.tooltip}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.65rem', // Smaller font
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed',
                                transform: 'rotate(180deg)',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                                lineHeight: 1.2, // Tighter line height
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                              }}
                            >
                              {permType.label}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      ))
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleColumns.map((column) => {
                    const isExpanded = column.type === 'category' 
                      ? expandedCategories.has(column.moduleName)
                      : column.type === 'subcategory'
                      ? expandedSubCategories.has(column.moduleName)
                      : false;
                    
                    // Check if category has children (items) that belong to it
                    const hasChildren = column.type === 'category' 
                      ? menuColumns.some(col => 
                          col.category === column.category && 
                          col.type !== 'category' && 
                          col.type !== 'subcategory' && // Only direct menu items
                          (!col.subCategory || col.subCategory === '') // Not in a subcategory
                        )
                      : column.type === 'subcategory'
                      ? menuColumns.some(col => 
                          col.category === column.category && 
                          col.subCategory === column.subCategory && 
                          col.type === 'menuitem'
                        )
                      : false;
                    
                    return (
                      <TableRow
                        key={column.id}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'grey.50',
                          },
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        {/* Menu Item Name Cell (sticky left) */}
                        <TableCell
                            sx={{
                              position: 'sticky',
                              left: 0,
                              zIndex: 2,
                              backgroundColor: 'inherit',
                              borderRight: '2px solid',
                              borderColor: 'divider',
                              ...getCellPadding(column.level),
                              color: column.level === 0 ? themeColor : column.level === 1 ? themeColor : 'text.primary',
                              fontWeight: column.level === 0 ? 600 : column.level === 1 ? 500 : 400,
                              width: '15%', // Fixed width matching header
                              minWidth: '150px',
                              maxWidth: '200px',
                            }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {(column.type === 'category' || column.type === 'subcategory') && hasChildren && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (column.type === 'category') {
                                    toggleCategory(column.moduleName);
                                  } else {
                                    toggleSubCategory(column.moduleName);
                                  }
                                }}
                                sx={{
                                  padding: '2px',
                                  color: themeColor,
                                  '& .MuiSvgIcon-root': {
                                    fontSize: '18px', // Smaller icons
                                  },
                                  '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                  },
                                }}
                              >
                                {isExpanded ? (
                                  <ExpandMoreIcon />
                                ) : (
                                  <ChevronRightIcon />
                                )}
                              </IconButton>
                            )}
                            {(!hasChildren || column.type === 'menuitem') && (
                              <Box sx={{ width: 20 }} /> // Reduced spacer
                            )}
                            <Typography
                              component="span"
                              sx={{
                                color: column.level === 0 ? themeColor : column.level === 1 ? themeColor : 'text.primary',
                                fontWeight: column.level === 0 ? 600 : column.level === 1 ? 500 : 400,
                                fontSize: column.level === 0 ? '0.75rem' : column.level === 1 ? '0.7rem' : '0.65rem', // Responsive font sizes
                                lineHeight: 1.2, // Tighter line height
                              }}
                            >
                              {getCellText(column)}
                            </Typography>
                          </Box>
                        </TableCell>
                        {/* Permission Checkboxes (5 columns per role) */}
                        {roles.map((role) => (
                          permissionTypes.map((permType) => {
                            // Check permissions in priority order:
                            // 1. column.id (preferred - most specific)
                            // 2. item-{moduleName} (fallback format)
                            // 3. moduleName (direct lookup)
                            // 4. cat-{category} for category rows
                            // Enhanced lookup: Check all possible key formats in priority order
                            let permData = null;
                            let isChecked = false;
                            
                            // Priority 1: Exact column.id match (most specific)
                            permData = permissions[role.key]?.[column.id];
                            if (permData) {
                              isChecked = permData[permType.key] ?? false;
                            } else {
                              // Priority 2: item-{moduleName} format
                              permData = permissions[role.key]?.[`item-${column.moduleName}`];
                              if (permData) {
                                isChecked = permData[permType.key] ?? false;
                              } else {
                                // Priority 3: Direct moduleName lookup
                                permData = permissions[role.key]?.[column.moduleName];
                                if (permData) {
                                  isChecked = permData[permType.key] ?? false;
                                } else {
                                  // Priority 4: Category format (for category rows)
                                  if (column.type === 'category') {
                                    permData = permissions[role.key]?.[`cat-${column.moduleName}`];
                                    if (permData) {
                                      isChecked = permData[permType.key] ?? false;
                                    }
                                  }
                                }
                              }
                            }
                            
                            // Final fallback: Default to false if no permission found
                            isChecked = isChecked ?? false;
                            
                            // Enhanced debug logging to trace template loading issue
                            if (role.key === 'admin' && column.moduleName === 'user_permissions' && permType.key === 'can_access') {
                              console.log('🔍 Checkbox Debug - user_permissions can_access:', {
                                role: role.key,
                                columnId: column.id,
                                moduleName: column.moduleName,
                                permType: permType.key,
                                isChecked,
                                permData,
                                hasColumnId: !!permissions[role.key]?.[column.id],
                                hasItemFormat: !!permissions[role.key]?.[`item-${column.moduleName}`],
                                hasDirectModule: !!permissions[role.key]?.[column.moduleName],
                                allKeysForRole: Object.keys(permissions[role.key] || {}).slice(0, 10),
                                totalKeysForRole: Object.keys(permissions[role.key] || {}).length,
                              });
                            }
                            
                            // Debug for first few menu items to see if templates are loading
                            if (role.key === 'admin' && ['master_configuration', 'pos_billing', 'system_settings'].includes(column.moduleName) && permType.key === 'can_view') {
                              if (!permData || !permData[permType.key]) {
                                console.warn(`⚠️ Missing permission for admin.${column.moduleName}.${permType.key}`, {
                                  columnId: column.id,
                                  moduleName: column.moduleName,
                                  availableKeys: Object.keys(permissions[role.key] || {}).filter(k => k.includes(column.moduleName)).slice(0, 5),
                                });
                              }
                            }
                            
                            
                            return (
                              <TableCell
                                key={`${role.key}-${column.id}-${permType.key}`}
                                sx={{
                                  textAlign: 'center',
                                  borderRight: '1px solid',
                                  borderColor: 'divider',
                                  p: 0.15, // Minimal padding for compact fit
                                  width: '3.4%', // Match header width
                                  minWidth: 18,
                                  maxWidth: 24,
                                }}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onChange={(e) => {
                                    handlePermissionChange(role.key, column.id, permType.key, e.target.checked);
                                  }}
                                  size="small"
                                  sx={{
                                    padding: '2px', // Minimal padding
                                    color: themeColor,
                                    '& .MuiSvgIcon-root': {
                                      fontSize: '18px', // Smaller checkbox
                                    },
                                    '&.Mui-checked': {
                                      color: themeColor,
                                    },
                                  }}
                                />
                              </TableCell>
                            );
                          })
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
            </CardContent>
          </>
        )}

        {/* Tab Panel 1: User-Role Mapping */}
        {activeTab === 1 && (
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: themeColor }}>
                Assign Users to Roles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Map users to roles. Users will inherit permissions from their assigned role.
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: themeColor }} />
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No users found. Please create users through Django admin.</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Username
                      </TableCell>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Current Role
                      </TableCell>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Assign Role
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => {
                      const currentRole = user.role || 'posuser';
                      const assignedRole = userRoleMapping[user.id] || currentRole;
                      
                      return (
                        <TableRow
                          key={user.id}
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: 'grey.50' },
                            '&:hover': { backgroundColor: 'action.hover' },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={roles.find(r => r.key === currentRole)?.label || currentRole}
                              size="small"
                              sx={{
                                backgroundColor: themeColor,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                              <InputLabel>Select Role</InputLabel>
                              <Select
                                value={assignedRole}
                                label="Select Role"
                                onChange={(e) => {
                                  setUserRoleMapping(prev => ({
                                    ...prev,
                                    [user.id]: e.target.value,
                                  }));
                                }}
                              >
                                {roles.map((role) => (
                                  <MenuItem key={role.key} value={role.key}>
                                    {role.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {users.length > 0 && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    // Reset to original roles
                    const originalMapping = {};
                    users.forEach(user => {
                      originalMapping[user.id] = user.role || 'posuser';
                    });
                    setUserRoleMapping(originalMapping);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={async () => {
                    // TODO: Save user-role mappings to backend
                    displaySuccess('User-role mappings will be saved. (Backend integration pending)');
                  }}
                  sx={{
                    backgroundColor: themeColor,
                    '&:hover': {
                      backgroundColor: themeColor,
                      opacity: 0.9,
                    },
                  }}
                >
                  Save Mappings
                </Button>
              </Box>
            )}
          </CardContent>
        )}

        {/* Tab Panel 2: User-Location Mapping */}
        {activeTab === 2 && (
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: themeColor }}>
                Map POS Users to Locations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assign store locations to POS users. Each POS user can be mapped to only one location.
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: themeColor }} />
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No POS users found. Only users with 'posuser' or 'posmanager' role can be mapped to locations.</Typography>
              </Box>
            ) : locations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No store locations found. Please create store locations in Organization Setup.</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Username
                      </TableCell>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Role
                      </TableCell>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Current Location
                      </TableCell>
                      <TableCell sx={{ backgroundColor: themeColor, color: 'white', fontWeight: 600 }}>
                        Assign Location
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => {
                      const currentLocationId = user.pos_location_id || userLocationMapping[user.id] || '';
                      
                      return (
                        <TableRow
                          key={user.id}
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: 'grey.50' },
                            '&:hover': { backgroundColor: 'action.hover' },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={roles.find(r => r.key === user.role)?.label || user.role}
                              size="small"
                              sx={{
                                backgroundColor: themeColor,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {user.pos_location_name ? (
                              <Chip
                                label={user.pos_location_name}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">Not assigned</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 250 }}>
                              <InputLabel>Select Location</InputLabel>
                              <Select
                                value={userLocationMapping[user.id] || currentLocationId || ''}
                                label="Select Location"
                                onChange={(e) => {
                                  setUserLocationMapping(prev => ({
                                    ...prev,
                                    [user.id]: e.target.value || null,
                                  }));
                                }}
                              >
                                <MenuItem value="">
                                  <em>None (Unassign)</em>
                                </MenuItem>
                                {locations.map((location) => (
                                  <MenuItem key={location.id} value={location.id}>
                                    {location.name} ({location.code})
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {users.length > 0 && locations.length > 0 && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    // Reset to original locations
                    const originalMapping = {};
                    users.forEach(user => {
                      if (user.pos_location_id) {
                        originalMapping[user.id] = user.pos_location_id;
                      }
                    });
                    setUserLocationMapping(originalMapping);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={async () => {
                    try {
                      setSaving(true);
                      setStatusMessage('Saving location mappings...');
                      
                      // Update each user's location
                      const updates = [];
                      for (const userId in userLocationMapping) {
                        const locationId = userLocationMapping[userId];
                        try {
                          await api.patch(`/auth/users/${userId}/`, {
                            pos_location: locationId || null
                          });
                          updates.push({ userId, success: true });
                        } catch (error) {
                          console.error(`Error updating user ${userId}:`, error);
                          updates.push({ userId, success: false, error });
                        }
                      }
                      
                      const successCount = updates.filter(u => u.success).length;
                      setStatusMessage('');
                      displaySuccess(`Location mappings saved successfully! ${successCount} of ${updates.length} users updated.`);
                      
                      // Reload users to refresh location data
                      const usersResponse = await api.get('/auth/users/');
                      let usersList = [];
                      if (usersResponse.data?.results && Array.isArray(usersResponse.data.results)) {
                        usersList = usersResponse.data.results.filter(u => u.role === 'posuser' || u.role === 'posmanager');
                      } else if (Array.isArray(usersResponse.data)) {
                        usersList = usersResponse.data.filter(u => u.role === 'posuser' || u.role === 'posmanager');
                      }
                      setUsers(usersList);
                      
                      // Update mapping state with fresh data
                      const freshMapping = {};
                      usersList.forEach(user => {
                        if (user.pos_location_id) {
                          freshMapping[user.id] = user.pos_location_id;
                        }
                      });
                      setUserLocationMapping(freshMapping);
                    } catch (error) {
                      console.error('Error saving location mappings:', error);
                      setStatusMessage('');
                      displayError('Error saving location mappings. Please try again.');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  sx={{
                    backgroundColor: themeColor,
                    '&:hover': {
                      backgroundColor: themeColor,
                      opacity: 0.9,
                    },
                  }}
                >
                  Save Mappings
                </Button>
              </Box>
            )}
          </CardContent>
        )}
      </Card>

      {/* View Template Dialog */}
      <Dialog
        open={viewTemplateDialog.open}
        onClose={() => setViewTemplateDialog({ open: false, templateData: null, loading: false })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: themeColor,
            color: 'white',
            fontWeight: 600,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <VisibilityIcon />
          <Box>
            <Typography variant="h6">
              {viewTemplateDialog.templateData?.display_name || 'Template Details'}
            </Typography>
            {viewTemplateDialog.templateData?.description && (
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mt: 0.5 }}>
                {viewTemplateDialog.templateData.description}
              </Typography>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, maxHeight: '70vh', overflow: 'auto' }}>
          {viewTemplateDialog.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : viewTemplateDialog.templateData ? (
            <Box>
              {/* Template Description */}
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Description:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {viewTemplateDialog.templateData.description || 'No description available'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Total Menu Items: {viewTemplateDialog.templateData.total_items || 0}
                </Typography>
              </Box>

              {/* Group by Category and Subcategory */}
              {(() => {
                const menuItems = viewTemplateDialog.templateData.menu_items || [];
                const categories = getMenuCategories();
                
                // Group items by category, then subcategory
                const grouped = {};
                menuItems.forEach(item => {
                  let categoryName = item.category || 'Other';
                  let subcategoryName = item.subcategory || null;
                  
                  // Try to find category from menu structure
                  for (const cat of categories) {
                    const foundItem = cat.items?.find(i => i.moduleName === item.menu_item_id);
                    if (foundItem) {
                      categoryName = cat.title;
                      break;
                    }
                  }
                  
                  if (!grouped[categoryName]) {
                    grouped[categoryName] = {};
                  }
                  
                  const subcatKey = subcategoryName || '_direct';
                  if (!grouped[categoryName][subcatKey]) {
                    grouped[categoryName][subcatKey] = [];
                  }
                  grouped[categoryName][subcatKey].push(item);
                });
                
                return Object.keys(grouped).map((categoryName) => (
                  <Box key={categoryName} sx={{ mb: 3 }}>
                    {/* Category Header */}
                    <Box
                      sx={{
                        backgroundColor: themeColor,
                        color: 'white',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {categoryName}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        ({Object.values(grouped[categoryName]).flat().length} items)
                      </Typography>
                    </Box>
                    
                    {/* Subcategories and Items */}
                    {Object.keys(grouped[categoryName]).map((subcatKey) => {
                      const items = grouped[categoryName][subcatKey];
                      const isSubcategory = subcatKey !== '_direct';
                      
                      return (
                        <Box key={subcatKey} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                          {/* Subcategory Header */}
                          {isSubcategory && (
                            <Box
                              sx={{
                                backgroundColor: 'grey.100',
                                p: 1.5,
                                pl: 3,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: themeColor }}>
                                {subcatKey}
                              </Typography>
                            </Box>
                          )}
                          
                          {/* Menu Items Table */}
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ backgroundColor: 'grey.50', fontWeight: 600, minWidth: 200 }}>
                                    Menu Item
                                  </TableCell>
                                  <TableCell sx={{ backgroundColor: 'grey.50', fontWeight: 600, textAlign: 'center', minWidth: 60 }}>
                                    Access
                                  </TableCell>
                                  <TableCell sx={{ backgroundColor: 'grey.50', fontWeight: 600, textAlign: 'center', minWidth: 60 }}>
                                    View
                                  </TableCell>
                                  <TableCell sx={{ backgroundColor: 'grey.50', fontWeight: 600, textAlign: 'center', minWidth: 60 }}>
                                    Create
                                  </TableCell>
                                  <TableCell sx={{ backgroundColor: 'grey.50', fontWeight: 600, textAlign: 'center', minWidth: 60 }}>
                                    Edit
                                  </TableCell>
                                  <TableCell sx={{ backgroundColor: 'grey.50', fontWeight: 600, textAlign: 'center', minWidth: 60 }}>
                                    Delete
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {items.map((item, index) => (
                                  <TableRow
                                    key={item.menu_item_id || index}
                                    sx={{
                                      '&:nth-of-type(odd)': { backgroundColor: 'grey.50' },
                                      '&:hover': { backgroundColor: 'action.hover' },
                                    }}
                                  >
                                    <TableCell sx={{ fontWeight: 500 }}>
                                      {item.display_name || item.menu_item_id}
                                    </TableCell>
                                    <TableCell align="center">
                                      {item.can_access ? '✓' : '✗'}
                                    </TableCell>
                                    <TableCell align="center">
                                      {item.can_view ? '✓' : '✗'}
                                    </TableCell>
                                    <TableCell align="center">
                                      {item.can_create ? '✓' : '✗'}
                                    </TableCell>
                                    <TableCell align="center">
                                      {item.can_edit ? '✓' : '✗'}
                                    </TableCell>
                                    <TableCell align="center">
                                      {item.can_delete ? '✓' : '✗'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      );
                    })}
                  </Box>
                ));
              })()}
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No template data available</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            onClick={() => setViewTemplateDialog({ open: false, templateData: null, loading: false })}
            variant="contained"
            sx={{ backgroundColor: themeColor }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAndPermissionPage;
