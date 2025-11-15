/**
 * Menu Service
 * 
 * This service manages dynamic menu structure from the backend
 * and provides real-time menu updates with subcategory support.
 */
import api from './api';

class MenuService {
  constructor() {
    this.menuStructure = null;
    this.categories = [];
    this.isLoading = false;
    this.listeners = [];
  }

  /**
   * Get complete menu structure from backend
   */
  async getCompleteMenuStructure() {
    try {
      console.log('🔄 Loading complete menu structure from backend...');
      
      // Try to load from API first
      try {
        const response = await api.get('/users/menu-structure/');
        const menuData = response.data;
        
        console.log('✅ Menu structure loaded from API:', menuData);
        
        // Process the menu data to include subcategories
        const processedData = this.processMenuData(menuData);
        
        this.menuStructure = processedData;
        this.categories = processedData.categories || [];
        
        // Notify listeners
        this.notifyListeners();
        
        return processedData;
      } catch (apiError) {
        console.warn('⚠️ Could not load menu from API, using fallback:', apiError.message);
        
        // Fallback to static menu structure
        const fallbackData = this.getFallbackMenuStructure();
        this.menuStructure = fallbackData;
        this.categories = fallbackData.categories || [];
        
        return fallbackData;
      }
    } catch (error) {
      console.error('❌ Error loading menu structure:', error);
      
      // Ultimate fallback
      const fallbackData = this.getFallbackMenuStructure();
      this.menuStructure = fallbackData;
      this.categories = fallbackData.categories || [];
      
      return fallbackData;
    }
  }

  /**
   * Process menu data to add subcategories and organize structure
   */
  processMenuData(menuData) {
    try {
      console.log('🔄 Processing menu data for subcategories...');
      
      // If menuData already has categories with subcategories, return as-is
      if (menuData.categories && menuData.categories.length > 0) {
        const hasSubcategories = menuData.categories.some(cat => 
          cat.items && cat.items.some(item => item.subcategory)
        );
        
        if (hasSubcategories) {
          console.log('✅ Menu data already has subcategories');
          return menuData;
        }
      }
      
      // Add subcategories to System menu items
      const processedData = {
        ...menuData,
        categories: (menuData.categories || []).map(category => {
          if (category.title === 'System') {
            return {
              ...category,
              items: (category.items || []).map(item => {
                // Add subcategory based on item type or module
                let subcategory = null;
                
                if (item.moduleName) {
                  // Admin Tools items
                  if (['admin_tools', 'database_configuration', 'layout_preferences', 'digital_marketing_console', 'web_console', 'html_preview_tool', 'dataops_studio'].includes(item.moduleName)) {
                    subcategory = 'Admin Tools';
                  }
                  // Business Rules items
                  else if (['pos_preferences', 'business_rules'].includes(item.moduleName)) {
                    subcategory = 'Business Rules';
                  }
                  // Other System items
                  else {
                    subcategory = 'Other System';
                  }
                }
                
                return {
                  ...item,
                  subcategory: subcategory,
                  isSubcategory: subcategory !== null
                };
              })
            };
          }
          
          return category;
        })
      };
      
      console.log('✅ Menu data processed with subcategories');
      return processedData;
    } catch (error) {
      console.error('❌ Error processing menu data:', error);
      return menuData;
    }
  }

  /**
   * Get fallback menu structure (static)
   */
  getFallbackMenuStructure() {
    console.log('🔄 Using fallback menu structure...');
    
    return {
      categories: [
        {
          title: 'Home',
          type: 'DASHBOARD',
          path: '/dashboard',
          icon: 'Dashboard',
          description: 'Main dashboard and overview'
        },
        {
          title: 'User & Permissions',
          type: 'USER_MANAGEMENT',
          icon: 'People',
          description: 'User management and permissions',
          items: [
            {
              text: 'Users',
              path: '/users',
              icon: 'People',
              moduleName: 'users'
            },
            {
              text: 'User Permissions',
              path: '/user-permissions',
              icon: 'AdminPanelSettings',
              moduleName: 'user_permissions'
            },
            {
              text: 'POS Function Mapping',
              path: '/user-permissions/pos-functions',
              icon: 'Settings',
              moduleName: 'pos_function_mapping'
            }
          ]
        },
        {
          title: 'Master Data Management',
          type: 'MASTER_DATA',
          icon: 'Category',
          description: 'Master data configuration',
          items: [
            {
              text: 'General Master',
              path: '/master-data/general',
              icon: 'Assignment',
              moduleName: 'general_master'
            },
            {
              text: 'Configuration',
              path: '/master-data/configuration',
              icon: 'Settings',
              moduleName: 'configuration'
            },
            {
              text: 'UOM Setup',
              path: '/master-data/uom-setup',
              icon: 'Category',
              moduleName: 'uom_setup'
            },
            {
              text: 'UOM Conversion',
              path: '/master-data/uom-conversion',
              icon: 'TrendingUp',
              moduleName: 'uom_conversion'
            }
          ]
        },
        {
          title: 'Organization Setup',
          type: 'ORGANIZATION',
          icon: 'Business',
          description: 'Organization and company setup',
          items: [
            {
              text: 'Companies',
              path: '/organization',
              icon: 'Business',
              moduleName: 'companies'
            },
            {
              text: 'Locations',
              path: '/organization/locations',
              icon: 'LocationOn',
              moduleName: 'locations'
            }
          ]
        },
        {
          title: 'Item',
          type: 'ITEM_MANAGEMENT',
          icon: 'Category',
          description: 'Item and product management',
          items: [
            {
              text: 'Item Categories',
              path: '/item/categories',
              icon: 'Category',
              moduleName: 'item_categories'
            },
            {
              text: 'Item Master',
              path: '/item/item-master',
              icon: 'Inventory',
              moduleName: 'item_master'
            },
            {
              text: 'Attributes',
              path: '/item/attributes',
              icon: 'Settings',
              moduleName: 'item_attributes'
            },
            {
              text: 'Tax Setup',
              path: '/item/tax-setup',
              icon: 'Receipt',
              moduleName: 'tax_setup'
            }
          ]
        },
        {
          title: 'Point of Sale',
          type: 'POS',
          icon: 'PointOfSale',
          description: 'Point of Sale operations',
          items: [
            {
              text: 'Terminal Configuration',
              path: '/pos/terminal-configuration',
              icon: 'Computer',
              moduleName: 'terminal_configuration'
            },
            {
              text: 'Day Management Console',
              path: '/pos/day-management-console',
              icon: 'Event',
              moduleName: 'day_management_console'
            },
            {
              text: 'Day Open',
              path: '/pos/day-open',
              icon: 'PlayArrow',
              moduleName: 'day_open'
            },
            {
              text: 'Session Open',
              path: '/pos/session-open',
              icon: 'PlayArrow',
              moduleName: 'session_open'
            },
            {
              text: 'POS Desktop',
              path: '/pos/desktop',
              icon: 'PointOfSale',
              moduleName: 'pos_desktop'
            },
            {
              text: 'Settlement',
              path: '/pos/settlement',
              icon: 'Receipt',
              moduleName: 'settlement'
            }
          ]
        },
        {
          title: 'Procurement',
          type: 'PROCUREMENT',
          icon: 'LocalShipping',
          description: 'Procurement and purchasing',
          items: [
            {
              text: 'Purchase Request',
              path: '/procurement/purchase-request',
              icon: 'ShoppingCart',
              moduleName: 'purchase_request'
            },
            {
              text: 'Purchase Enquiry',
              path: '/procurement/purchase-enquiry',
              icon: 'Search',
              moduleName: 'purchase_enquiry'
            },
            {
              text: 'Purchase Quotation',
              path: '/procurement/purchase-quotation',
              icon: 'RequestQuote',
              moduleName: 'purchase_quotation'
            },
            {
              text: 'Purchase Order',
              path: '/procurement/purchase-order',
              icon: 'ShoppingCartCheckout',
              moduleName: 'purchase_order'
            },
            {
              text: 'Goods Received Note',
              path: '/procurement/goods-received-note',
              icon: 'LocalShipping',
              moduleName: 'goods_received_note'
            },
            {
              text: 'Purchase Invoice',
              path: '/procurement/purchase-invoice',
              icon: 'Receipt',
              moduleName: 'purchase_invoice'
            }
          ]
        },
        {
          title: 'Sales',
          type: 'SALES',
          icon: 'ShoppingCart',
          description: 'Sales and customer management',
          items: [
            {
              text: 'Sales Order Management',
              path: '/sales-order-management',
              icon: 'ShoppingCartCheckout',
              moduleName: 'sales_order_management'
            }
          ]
        },
        {
          title: 'Stock Nexus',
          type: 'INVENTORY',
          icon: 'Storage',
          description: 'Stock and inventory management',
          items: [
            {
              text: 'Initial Setup',
              path: '/stock-nexus/initial-setup',
              icon: 'SettingsSuggest',
              moduleName: 'initial_setup'
            },
            {
              text: 'Movement Tracking',
              path: '/stock-nexus/movement-tracking',
              icon: 'TrendingUp',
              moduleName: 'movement_tracking'
            },
            {
              text: 'Transfer Confirm',
              path: '/stock-nexus/transfer-confirm',
              icon: 'Launch',
              moduleName: 'transfer_confirm'
            },
            {
              text: 'Count Adjust',
              path: '/stock-nexus/count-adjust',
              icon: 'Assessment',
              moduleName: 'count_adjust'
            }
          ]
        },
        {
          title: 'Reports',
          type: 'REPORTS',
          icon: 'Assessment',
          description: 'Reports and analytics',
          items: [
            {
              text: 'Sales Report',
              path: '/reports/sales',
              icon: 'Analytics',
              moduleName: 'sales_report'
            }
          ]
        },
        {
          title: 'System',
          type: 'SYSTEM',
          icon: 'Settings',
          description: 'System administration and tools',
          items: [
            {
              text: 'Admin Tools',
              path: '/settings/admin-tools',
              icon: 'AdminPanelSettings',
              moduleName: 'admin_tools',
              subcategory: 'Admin Tools'
            },
            {
              text: 'Database Configuration',
              path: '/settings',
              icon: 'DatabaseIcon',
              moduleName: 'database_configuration',
              subcategory: 'Admin Tools'
            },
            {
              text: 'Layout Preferences',
              path: '/settings/layout-preferences',
              icon: 'ViewQuilt',
              moduleName: 'layout_preferences',
              subcategory: 'Admin Tools'
            },
            {
              text: 'Digital Marketing Console',
              path: '/settings/digital-marketing',
              icon: 'Language',
              moduleName: 'digital_marketing_console',
              subcategory: 'Admin Tools'
            },
            {
              text: 'Web Console',
              path: '/settings/web-console',
              icon: 'Code',
              moduleName: 'web_console',
              subcategory: 'Admin Tools'
            },
            {
              text: 'HTML Preview Tool',
              path: '/settings/html-preview',
              icon: 'Preview',
              moduleName: 'html_preview_tool',
              subcategory: 'Admin Tools'
            },
            {
              text: 'DataOps Studio',
              path: '/settings/dataops-studio',
              icon: 'CodeIcon',
              moduleName: 'dataops_studio',
              subcategory: 'Admin Tools'
            },
            {
              text: 'POS Preferences',
              path: '/business-rules/general',
              icon: 'Settings',
              moduleName: 'pos_preferences',
              subcategory: 'Business Rules'
            },
            {
              text: 'Business Rules',
              path: '/business-rules',
              icon: 'Assignment',
              moduleName: 'business_rules',
              subcategory: 'Business Rules'
            },
            {
              text: 'Wireframe Launchpad',
              path: '/wireframes',
              icon: 'Launch',
              moduleName: 'wireframe_launchpad',
              subcategory: 'Other System'
            }
          ]
        }
      ]
    };
  }

  /**
   * Get menu categories
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Get menu structure
   */
  getMenuStructure() {
    return this.menuStructure;
  }

  /**
   * Add a listener for menu changes
   */
  onMenuChange(callback) {
    this.listeners.push(callback);
    
    // Return cleanup function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of menu changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.menuStructure);
      } catch (error) {
        console.error('Error notifying menu listener:', error);
      }
    });
  }

  /**
   * Refresh menu structure
   */
  async refreshMenu() {
    try {
      this.isLoading = true;
      const menuData = await this.getCompleteMenuStructure();
      return menuData;
    } catch (error) {
      console.error('Error refreshing menu:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get menu items by category
   */
  getMenuItemsByCategory(categoryTitle) {
    const category = this.categories.find(cat => cat.title === categoryTitle);
    return category ? (category.items || []) : [];
  }

  /**
   * Get all menu items
   */
  getAllMenuItems() {
    return this.categories.flatMap(category => (category.items || []));
  }

  /**
   * Get menu item by path
   */
  getMenuItemByPath(path) {
    return this.getAllMenuItems().find(item => item.path === path);
  }

  /**
   * Get subcategories for a category
   */
  getSubcategories(categoryTitle) {
    const category = this.categories.find(cat => cat.title === categoryTitle);
    if (!category || !category.items) {
      return [];
    }
    
    const subcategories = new Set();
    category.items.forEach(item => {
      if (item.subcategory) {
        subcategories.add(item.subcategory);
      }
    });
    
    return Array.from(subcategories);
  }

  /**
   * Get menu items by subcategory
   */
  getMenuItemsBySubcategory(categoryTitle, subcategoryName) {
    const category = this.categories.find(cat => cat.title === categoryTitle);
    if (!category || !category.items) {
      return [];
    }
    
    return category.items.filter(item => item.subcategory === subcategoryName);
  }

  /**
   * Search menu items
   */
  searchMenuItems(query) {
    if (!query || query.trim() === '') {
      return this.getAllMenuItems();
    }

    const searchQuery = query.toLowerCase().trim();
    
    return this.getAllMenuItems().filter(item => {
      const searchText = (item.text || '').toLowerCase();
      const searchPath = (item.path || '').toLowerCase();
      const searchModule = (item.moduleName || '').toLowerCase();
      
      return searchText.includes(searchQuery) ||
             searchPath.includes(searchQuery) ||
             searchModule.includes(searchQuery);
    });
  }

  /**
   * Get favorite menu items
   */
  getFavoriteMenuItems() {
    // This would integrate with a favorites system
    const favorites = localStorage.getItem('favoriteMenuItems');
    if (favorites) {
      try {
        const favoritePaths = JSON.parse(favorites);
        return this.getAllMenuItems().filter(item => favoritePaths.includes(item.path));
      } catch (error) {
        console.error('Error parsing favorites:', error);
        return [];
      }
    }
    return [];
  }

  /**
   * Add menu item to favorites
   */
  addToFavorites(path) {
    try {
      const favorites = this.getFavoriteMenuItems().map(item => item.path);
      if (!favorites.includes(path)) {
        favorites.push(path);
        localStorage.setItem('favoriteMenuItems', JSON.stringify(favorites));
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  /**
   * Remove menu item from favorites
   */
  removeFromFavorites(path) {
    try {
      const favorites = this.getFavoriteMenuItems().map(item => item.path);
      const index = favorites.indexOf(path);
      if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favoriteMenuItems', JSON.stringify(favorites));
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(path) {
    const favorites = this.getFavoriteMenuItems().map(item => item.path);
    const index = favorites.indexOf(path);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(path);
    }
    
    localStorage.setItem('favoriteMenuItems', JSON.stringify(favorites));
    this.notifyListeners();
  }

  /**
   * Check if menu item is favorited
   */
  isFavorite(path) {
    const favorites = this.getFavoriteMenuItems().map(item => item.path);
    return favorites.includes(path);
  }

  /**
   * Get notification count for a menu item
   */
  getNotificationCount(moduleName) {
    // Mock notification counts - replace with real data
    const counts = {
      'pos_terminal': 3,
      'inventory_management': 2,
      'sales_management': 1,
      'admin_tools': 1,
      'business_rules': 0,
      'database_configuration': 0,
      'layout_preferences': 0,
      'digital_marketing_console': 0,
      'web_console': 0,
      'html_preview_tool': 0,
      'dataops_studio': 0,
      'pos_preferences': 0,
      'business_rules': 0,
      'wireframe_launchpad': 0
    };
    return counts[moduleName] || 0;
  }

  /**
   * Get menu statistics
   */
  getMenuStatistics() {
    const totalItems = this.getAllMenuItems().length;
    const totalCategories = this.categories.length;
    const categoriesWithSubcategories = this.categories.filter(cat => 
      cat.items && cat.items.some(item => item.subcategory)
    ).length;
    
    return {
      totalItems,
      totalCategories,
      categoriesWithSubcategories,
      hasSubcategories: categoriesWithSubcategories > 0
    };
  }

  /**
   * Validate menu structure
   */
  validateMenuStructure() {
    const issues = [];
    
    if (!this.menuStructure || !this.menuStructure.categories) {
      issues.push('No menu structure found');
      return issues;
    }
    
    // Check for required fields
    this.categories.forEach((category, categoryIndex) => {
      if (!category.title) {
        issues.push(`Category ${categoryIndex} missing title`);
      }
      
      if (category.items && Array.isArray(category.items)) {
        category.items.forEach((item, itemIndex) => {
          if (!item.text && !item.path) {
            issues.push(`Category ${category.title}, item ${itemIndex} missing text or path`);
          }
        });
      }
    });
    
    return issues;
  }

  /**
   * Export menu structure to JSON
   */
  exportToJSON() {
    return JSON.stringify(this.menuStructure, null, 2);
  }

  /**
   * Import menu structure from JSON
   */
  importFromJSON(jsonString) {
    try {
      const menuData = JSON.parse(jsonString);
      this.menuStructure = menuData;
      this.categories = menuData.categories || [];
      this.notifyListeners();
      return menuData;
    } catch (error) {
      console.error('Error importing menu structure from JSON:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const menuService = new MenuService();

export default menuService;
