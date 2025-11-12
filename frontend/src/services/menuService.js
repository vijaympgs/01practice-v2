import api from './api';

/**
 * Menu Service - Dynamic menu loading from backend
 * Integrates with Django admin menu controller
 */

class MenuService {
  /**
   * Get active menu items from backend
   */
  async getMenuItems() {
    try {
      const response = await api.get('/users/menu-items/');
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Return fallback structure
      return this.getFallbackMenuStructure();
    }
  }

  /**
   * Get menu visibility settings
   */
  async getMenuVisibility() {
    try {
      const response = await api.get('/users/menu-visibility/');
      return response.data;
    } catch (error) {
      console.error('Error fetching menu visibility:', error);
      return { categories: {}, statistics: {} };
    }
  }

  /**
   * Get user's menu permissions filtered by active menu items
   */
  async getUserMenuPermissions() {
    try {
      const response = await api.get('/users/menu-permissions/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user menu permissions:', error);
      return { permissions: {}, active_menu_items: [] };
    }
  }

  /**
   * Get menu statistics (admin only)
   */
  async getMenuStatistics() {
    try {
      const response = await api.get('/users/menu-statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching menu statistics:', error);
      return null;
    }
  }

  /**
   * Update menu visibility (admin only)
   */
  async updateMenuVisibility(data) {
    try {
      const response = await api.post('/users/menu-visibility/', data);
      return response.data;
    } catch (error) {
      console.error('Error updating menu visibility:', error);
      throw error;
    }
  }

  /**
   * Build dynamic menu structure from backend data
   */
  buildMenuFromBackend(menuItemsData, userPermissions = {}) {
    const categories = {};
    
    // Group menu items by category
    Object.values(menuItemsData.categories || {}).forEach(categoryItems => {
      categoryItems.forEach(item => {
        if (!item.is_active) return; // Skip inactive items
        
        const category = item.category || 'Other';
        if (!categories[category]) {
          categories[category] = {
            title: category,
            type: this.getCategoryType(category),
            icon: this.getCategoryIcon(category),
            color: this.getCategoryColor(category),
            description: this.getCategoryDescription(category),
            items: []
          };
        }
        
        // Check if user has permission for this menu item
        const hasPermission = userPermissions[item.menu_item_id]?.can_access || false;
        
        // For now, show all active items regardless of permissions (to debug the issue)
        // TODO: Re-enable permission checking after debugging
        if (hasPermission || true) {
          categories[category].items.push({
            text: item.display_name,
            path: item.path,
            moduleName: item.menu_item_id,
            icon: this.getItemIcon(item.menu_item_id),
          });
        }
      });
    });
    
    return Object.values(categories);
  }

  /**
   * Get category type based on category name
   */
  getCategoryType(category) {
    const typeMap = {
      'Home': 'DASHBOARD',
      'User & Permissions': 'SECURITY',
      'Master Data Management': 'MASTER',
      'Organization Setup': 'MASTER',
      'Item': 'MASTER',
      'Point of Sale': 'TRANSACTION',
      'Point of Sale (V2)': 'TRANSACTION',
      'Inventory Management': 'TRANSACTION',
      'Procurement': 'TRANSACTION',
      'Stock Nexus': 'TRANSACTION',
      'Sales': 'TRANSACTION',
      'Reports': 'SYSTEM',
      'System': 'SYSTEM',
      'Archive': 'SYSTEM',
    };
    return typeMap[category] || 'SYSTEM';
  }

  /**
   * Get category icon
   */
  getCategoryIcon(category) {
    const iconMap = {
      'Home': 'Dashboard',
      'User & Permissions': 'People',
      'Master Data Management': 'Category',
      'Organization Setup': 'Business',
      'Item': 'Category',
      'Point of Sale': 'PointOfSale',
      'Point of Sale (V2)': 'PointOfSale',
      'Inventory Management': 'Inventory',
      'Procurement': 'LocalShipping',
      'Stock Nexus': 'Inventory',
      'Sales': 'ShoppingCart',
      'Reports': 'Analytics',
      'System': 'Settings',
      'Archive': 'Archive',
    };
    return iconMap[category] || 'Category';
  }

  /**
   * Get category color
   */
  getCategoryColor(category) {
    const colorMap = {
      'Home': 'primary',
      'User & Permissions': 'primary',
      'Master Data Management': 'info',
      'Organization Setup': 'primary',
      'Item': 'success',
      'Point of Sale': 'success',
      'Point of Sale (V2)': 'success',
      'Inventory Management': 'warning',
      'Procurement': 'info',
      'Stock Nexus': 'success',
      'Sales': 'primary',
      'Reports': 'info',
      'System': 'secondary',
      'Archive': 'secondary',
    };
    return colorMap[category] || 'primary';
  }

  /**
   * Get category description
   */
  getCategoryDescription(category) {
    const descriptionMap = {
      'Home': 'Main dashboard and overview',
      'User & Permissions': 'Manage user roles and permissions',
      'Master Data Management': 'Configure master data and classifications',
      'Organization Setup': 'Configure organization and tax settings',
      'Item': 'Manage items, attributes, and classifications',
      'Point of Sale': 'Point of Sale operations and management',
      'Point of Sale (V2)': 'Next generation Point of Sale',
      'Inventory Management': 'Inventory and stock management',
      'Procurement': 'Purchase and procurement management',
      'Stock Nexus': 'Stock transfer and movement management',
      'Sales': 'Sales and customer management',
      'Reports': 'Business reports and analytics',
      'System': 'System administration and tools',
      'Archive': 'Archived features and functions',
    };
    return descriptionMap[category] || '';
  }

  /**
   * Get item icon based on module name
   */
  getItemIcon(moduleName) {
    const iconMap = {
      'dashboard': 'Dashboard',
      'user_permissions': 'AdminPanelSettings',
      'pos_function_mapping': 'SettingsApplications',
      'master_configuration': 'ShoppingCart',
      'master_general': 'Assignment',
      'item_master': 'Inventory',
      'pos_terminal_configuration': 'Computer',
      'pos_day_management_console': 'Event',
      'pos_billing': 'PointOfSale',
      'admin_tools': 'AdminPanelSettings',
      'inventory_management': 'Inventory',
      'sales_management': 'ShoppingCart',
      'sales_reports': 'TrendingUp',
      'inventory_reports': 'Inventory',
      'pos_reports': 'PointOfSale',
    };
    return iconMap[moduleName] || 'Category';
  }

  /**
   * Get fallback menu structure for when backend is unavailable
   */
  getFallbackMenuStructure() {
    return {
      categories: {
        'Home': [
          {
            id: '1',
            menu_item_id: 'dashboard',
            display_name: 'Dashboard',
            menu_type: 'DASHBOARD',
            transaction_subtype: null,
            category: 'Home',
            path: '/',
            is_active: true,
            order: 10,
          }
        ],
        'Point of Sale': [
          {
            id: '2',
            menu_item_id: 'pos_day_management_console',
            display_name: 'Day Management Console',
            menu_type: 'TRANSACTION',
            transaction_subtype: 'POS',
            category: 'Point of Sale',
            path: '/pos/day-management-console',
            is_active: true,
            order: 20,
          }
        ],
        'System': [
          {
            id: '3',
            menu_item_id: 'admin_tools',
            display_name: 'Admin Tools',
            menu_type: 'SYSTEM',
            transaction_subtype: null,
            category: 'System',
            path: '/settings/admin-tools',
            is_active: true,
            order: 10,
          }
        ]
      },
      total_items: 3,
      active_items: 3,
      inactive_items: 0,
    };
  }

  /**
   * Get complete menu structure with permissions
   */
  async getCompleteMenuStructure() {
    try {
      // Get menu items and user permissions in parallel
      const [menuItemsData, userPermissionsData] = await Promise.all([
        this.getMenuItems(),
        this.getUserMenuPermissions()
      ]);

      // Build menu structure from backend data
      const menuStructure = this.buildMenuFromBackend(
        menuItemsData,
        userPermissionsData.permissions
      );

      return {
        categories: menuStructure,
        statistics: menuItemsData.statistics || {},
        userPermissions: userPermissionsData.permissions || {},
        activeMenuItems: userPermissionsData.active_menu_items || [],
        lastUpdated: userPermissionsData.timestamp,
      };
    } catch (error) {
      console.error('Error getting complete menu structure:', error);
      // Return fallback structure
      return {
        categories: this.buildMenuFromBackend(this.getFallbackMenuStructure()),
        statistics: {},
        userPermissions: {},
        activeMenuItems: ['dashboard', 'pos_day_management_console', 'admin_tools'],
        lastUpdated: new Date().toISOString(),
      };
    }
  }
}

// Create and export singleton instance
const menuService = new MenuService();

export default menuService;
