/**
 * Table to Menu Mapping Utility
 * Maps database table names to sidebar menu categories and items
 * This provides a structured view of database tables aligned with the application's menu structure
 */

// We'll use the Sidebar structure directly since it has the exact category names
// Import from Sidebar would cause circular dependency, so we'll define it here
const getMenuCategoriesFromSidebar = () => {
  // This matches the structure from Sidebar.jsx
  return [
    { title: 'User & Permissions', items: ['Role Permissions', 'POS Function Mapping'] },
    { title: 'Master Data', items: ['Merchandise', 'General', 'UOM Setup', 'UOM Conversion', 'Customers', 'Vendors'] },
    { title: 'Organization Setup', items: ['Organization Master', 'Tax Setup'] },
    { title: 'Item', items: ['Item Master', 'Attributes', 'Attribute Values'] },
    { title: 'Opening Stock', items: ['Opening Stock'] },
    { title: 'Procurement', items: ['Purchase Request', 'Purchase Enquiry', 'Purchase Quotation', 'Purchase Order', 'Goods Received Note', 'Purchase Invoice', 'Purchase Return', 'Procurement Advice'] },
    { title: 'Sales', items: ['Sales', 'Sales Order', 'Customer'] },
    { title: 'Stock Transfers', items: ['Initial Setup', 'Movement Tracking', 'Transfer Confirm', 'Count Adjust'] },
    { title: 'Physical Inventory', items: ['Physical Inventory', 'System Go Live'] },
    { title: 'Point of Sale', items: [
      'Day Open',
      'Session Open',
      'POS Billing',
      'Settlement',
      'Session Close',
      'Day Close',
      'Terminal Configuration',
      'Terminal Setup',
      'Shift Management',
      'Session Management',
      'Customer Receivables',
      'Home Delivery',
      'Day End',
      'Code Master',
    ] },
    { title: 'Point of Sale (V2)', items: ['POS Shift Console', 'POS Billing', 'Terminal Configuration'] },
    { title: 'Reports', items: ['Sales Reports', 'Inventory Reports', 'POS Reports'] },
    { title: 'System Settings', items: ['Settings', 'Layout Preferences', 'DataOps Studio', 'Business Rules', 'Settlement Settings', 'Pay Mode'] },
    { title: 'Archive', items: ['Shift'] },
  ];
};

/**
 * Map table name to menu category and menu item
 * @param {string} tableName - Database table name
 * @returns {Object|null} - { category, menuItem, moduleName } or null if no match
 */
export const mapTableToMenu = (tableName) => {
  // Normalize table name (lowercase, remove underscores prefix)
  const normalizedName = tableName.toLowerCase().replace(/^django_|^auth_|^authtoken_/, '');
  
  // Map table name patterns to menu items
  const tableMapping = {
    // User & Permissions
    'users': { category: 'User & Permissions', menuItem: 'Role Permissions', moduleName: 'user_permissions' },
    'user_role_permissions': { category: 'User & Permissions', menuItem: 'Role Permissions', moduleName: 'user_permissions' },
    'role_permissions': { category: 'User & Permissions', menuItem: 'Role Permissions', moduleName: 'user_permissions' },
    'user_permissions': { category: 'User & Permissions', menuItem: 'Role Permissions', moduleName: 'user_permissions' },
    'pos_function_mapping': { category: 'User & Permissions', menuItem: 'POS Function Mapping', moduleName: 'pos_function_mapping' },
    'pos_functions': { category: 'User & Permissions', menuItem: 'POS Function Mapping', moduleName: 'pos_function_mapping' },
    
    // Master Data
    'customers': { category: 'Master Data', menuItem: 'Customers', moduleName: 'master_customers' },
    'customer': { category: 'Master Data', menuItem: 'Customers', moduleName: 'master_customers' },
    'vendors': { category: 'Master Data', menuItem: 'Vendors', moduleName: 'master_vendors' },
    'vendor': { category: 'Master Data', menuItem: 'Vendors', moduleName: 'master_vendors' },
    'suppliers': { category: 'Master Data', menuItem: 'Vendors', moduleName: 'master_vendors' },
    'supplier': { category: 'Master Data', menuItem: 'Vendors', moduleName: 'master_vendors' },
    'uom': { category: 'Master Data', menuItem: 'UOM Setup', moduleName: 'master_uom_setup' },
    'unit_of_measure': { category: 'Master Data', menuItem: 'UOM Setup', moduleName: 'master_uom_setup' },
    'uom_conversion': { category: 'Master Data', menuItem: 'UOM Conversion', moduleName: 'master_uom_conversion' },
    'master_configuration': { category: 'Master Data', menuItem: 'Merchandise', moduleName: 'master_configuration' },
    'merchandise': { category: 'Master Data', menuItem: 'Merchandise', moduleName: 'master_configuration' },
    'general_master': { category: 'Master Data', menuItem: 'General', moduleName: 'master_general' },
    'general': { category: 'Master Data', menuItem: 'General', moduleName: 'master_general' },
    
    // Organization Setup
    'organization': { category: 'Organization Setup', menuItem: 'Organization Master', moduleName: 'organization' },
    'company': { category: 'Organization Setup', menuItem: 'Organization Master', moduleName: 'organization' },
    'location': { category: 'Organization Setup', menuItem: 'Organization Master', moduleName: 'organization' },
    'locations': { category: 'Organization Setup', menuItem: 'Organization Master', moduleName: 'organization' },
    'tax': { category: 'Organization Setup', menuItem: 'Tax Setup', moduleName: 'item_tax_setup' },
    'taxes': { category: 'Organization Setup', menuItem: 'Tax Setup', moduleName: 'item_tax_setup' },
    'tax_setup': { category: 'Organization Setup', menuItem: 'Tax Setup', moduleName: 'item_tax_setup' },
    'geographical_data_country': { category: 'Organization Setup', menuItem: 'Organization Master', moduleName: 'organization' },
    'geographical_data_state': { category: 'Organization Setup', menuItem: 'Organization Master', moduleName: 'organization' },
    'geographical_data_city': { category: 'Organization Setup', menuItem: 'Organization Master', moduleName: 'organization' },
    
    // Item
    'products': { category: 'Item', menuItem: 'Item Master', moduleName: 'item_master' },
    'product': { category: 'Item', menuItem: 'Item Master', moduleName: 'item_master' },
    'categories': { category: 'Item', menuItem: 'Item Master', moduleName: 'item_master' },
    'category': { category: 'Item', menuItem: 'Item Master', moduleName: 'item_master' },
    'item_attributes': { category: 'Item', menuItem: 'Attributes', moduleName: 'item_attributes' },
    'attributes': { category: 'Item', menuItem: 'Attributes', moduleName: 'item_attributes' },
    'attribute_values': { category: 'Item', menuItem: 'Attribute Values', moduleName: 'item_attribute_values' },
    'item_attribute_values': { category: 'Item', menuItem: 'Attribute Values', moduleName: 'item_attribute_values' },
    
    // Opening Stock
    'opening_stock': { category: 'Opening Stock', menuItem: 'Opening Stock', moduleName: 'opening_stock' },
    
    // Procurement
    'purchase_request': { category: 'Procurement', menuItem: 'Purchase Request', moduleName: 'procurement_purchase_request' },
    'procurement_purchase_request': { category: 'Procurement', menuItem: 'Purchase Request', moduleName: 'procurement_purchase_request' },
    'purchase_enquiry': { category: 'Procurement', menuItem: 'Purchase Enquiry', moduleName: 'procurement_purchase_enquiry' },
    'procurement_purchase_enquiry': { category: 'Procurement', menuItem: 'Purchase Enquiry', moduleName: 'procurement_purchase_enquiry' },
    'purchase_quotation': { category: 'Procurement', menuItem: 'Purchase Quotation', moduleName: 'procurement_purchase_quotation' },
    'procurement_purchase_quotation': { category: 'Procurement', menuItem: 'Purchase Quotation', moduleName: 'procurement_purchase_quotation' },
    'purchase_order': { category: 'Procurement', menuItem: 'Purchase Order', moduleName: 'procurement_purchase_order' },
    'procurement_purchase_order': { category: 'Procurement', menuItem: 'Purchase Order', moduleName: 'procurement_purchase_order' },
    'goods_received_note': { category: 'Procurement', menuItem: 'Goods Received Note', moduleName: 'procurement_goods_received' },
    'procurement_goods_received': { category: 'Procurement', menuItem: 'Goods Received Note', moduleName: 'procurement_goods_received' },
    'grn': { category: 'Procurement', menuItem: 'Goods Received Note', moduleName: 'procurement_goods_received' },
    'purchase_invoice': { category: 'Procurement', menuItem: 'Purchase Invoice', moduleName: 'procurement_purchase_invoice' },
    'procurement_purchase_invoice': { category: 'Procurement', menuItem: 'Purchase Invoice', moduleName: 'procurement_purchase_invoice' },
    'purchase_return': { category: 'Procurement', menuItem: 'Purchase Return', moduleName: 'procurement_purchase_return' },
    'procurement_purchase_return': { category: 'Procurement', menuItem: 'Purchase Return', moduleName: 'procurement_purchase_return' },
    'procurement_advice': { category: 'Procurement', menuItem: 'Procurement Advice', moduleName: 'procurement_advice' },
    
    // Sales
    'sales': { category: 'Sales', menuItem: 'Sales', moduleName: 'sales_management' },
    'sale': { category: 'Sales', menuItem: 'Sales', moduleName: 'sales_management' },
    'saleitem': { category: 'Sales', menuItem: 'Sales', moduleName: 'sales_management' },
    'sale_item': { category: 'Sales', menuItem: 'Sales', moduleName: 'sales_management' },
    'payment': { category: 'Sales', menuItem: 'Sales', moduleName: 'sales_management' },
    'payments': { category: 'Sales', menuItem: 'Sales', moduleName: 'sales_management' },
    'sales_order': { category: 'Sales', menuItem: 'Sales Order', moduleName: 'sales_order_management' },
    'order': { category: 'Sales', menuItem: 'Sales Order', moduleName: 'sales_order_management' },
    'orders': { category: 'Sales', menuItem: 'Sales Order', moduleName: 'sales_order_management' },
    
    // Stock Transfers
    'stock_transfer': { category: 'Stock Transfers', menuItem: 'Initial Setup', moduleName: 'stock_nexus_initial_setup' },
    'stock_transfers': { category: 'Stock Transfers', menuItem: 'Initial Setup', moduleName: 'stock_nexus_initial_setup' },
    'movement_tracking': { category: 'Stock Transfers', menuItem: 'Movement Tracking', moduleName: 'stock_nexus_movement_tracking' },
    'transfer_confirm': { category: 'Stock Transfers', menuItem: 'Transfer Confirm', moduleName: 'stock_nexus_transfer_confirm' },
    'count_adjust': { category: 'Stock Transfers', menuItem: 'Count Adjust', moduleName: 'stock_nexus_count_adjust' },
    'stock_adjustment': { category: 'Stock Transfers', menuItem: 'Count Adjust', moduleName: 'stock_nexus_count_adjust' },
    
    // Physical Inventory
    'inventory': { category: 'Physical Inventory', menuItem: 'Physical Inventory', moduleName: 'inventory_management' },
    'inventory_movement': { category: 'Physical Inventory', menuItem: 'Physical Inventory', moduleName: 'inventory_management' },
    'physical_inventory': { category: 'Physical Inventory', menuItem: 'Physical Inventory', moduleName: 'inventory_management' },
    'system_go_live': { category: 'Physical Inventory', menuItem: 'System Go Live', moduleName: 'inventory_go_live' },
    
    // Point of Sale
    'pos_session': { category: 'Point of Sale', menuItem: 'Session Open', moduleName: 'pos_session_open' },
    'pos_sessions': { category: 'Point of Sale', menuItem: 'Session Open', moduleName: 'pos_session_open' },
    'session': { category: 'Point of Sale', menuItem: 'Session Open', moduleName: 'pos_session_open' },
    'day_open': { category: 'Point of Sale', menuItem: 'Day Open', moduleName: 'pos_day_open' },
    'day_close': { category: 'Point of Sale', menuItem: 'Day Close', moduleName: 'pos_day_close' },
    'terminal': { category: 'Point of Sale', menuItem: 'Terminal Configuration', moduleName: 'pos_terminal_configuration' },
    'terminals': { category: 'Point of Sale', menuItem: 'Terminal Configuration', moduleName: 'pos_terminal_configuration' },
    'pos_master': { category: 'Point of Sale', menuItem: 'Terminal Configuration', moduleName: 'pos_terminal_configuration' },
    'pos_masters': { category: 'Point of Sale', menuItem: 'Terminal Configuration', moduleName: 'pos_terminal_configuration' },
    'pos_master_mappings': { category: 'Point of Sale', menuItem: 'Terminal Configuration', moduleName: 'pos_terminal_configuration' },
    'pos_master_history': { category: 'Point of Sale', menuItem: 'Terminal Configuration', moduleName: 'pos_terminal_configuration' },
    'settlement': { category: 'Point of Sale', menuItem: 'Settlement', moduleName: 'pos_settlement' },
    'settlements': { category: 'Point of Sale', menuItem: 'Settlement', moduleName: 'pos_settlement' },
    
    // Reports (if any reporting tables exist)
    'report': { category: 'Reports', menuItem: 'Sales Reports', moduleName: 'sales_reports' },
    'reports': { category: 'Reports', menuItem: 'Sales Reports', moduleName: 'sales_reports' },
    
    // System Settings
    'business_rule': { category: 'System Settings', menuItem: 'Business Rules', moduleName: 'business_rules' },
    'business_rules': { category: 'System Settings', menuItem: 'Business Rules', moduleName: 'business_rules' },
    'pay_mode': { category: 'System Settings', menuItem: 'Pay Mode', moduleName: 'pay_modes' },
    'pay_modes': { category: 'System Settings', menuItem: 'Pay Mode', moduleName: 'pay_modes' },
    'payment_mode': { category: 'System Settings', menuItem: 'Pay Mode', moduleName: 'pay_modes' },
    'code_setting': { category: 'System Settings', menuItem: 'Settings', moduleName: 'system_settings' },
    'code_settings': { category: 'System Settings', menuItem: 'Settings', moduleName: 'system_settings' },
    'theme': { category: 'System Settings', menuItem: 'Settings', moduleName: 'system_settings' },
    'theme_management': { category: 'System Settings', menuItem: 'Settings', moduleName: 'system_settings' },
    'settlement_settings': { category: 'System Settings', menuItem: 'Settlement Settings', moduleName: 'settlement_settings' },
    'menu_item': { category: 'System Settings', menuItem: 'Settings', moduleName: 'system_settings' },
    'menu_item_type': { category: 'System Settings', menuItem: 'Settings', moduleName: 'system_settings' },
  };
  
  // Direct match
  if (tableMapping[normalizedName]) {
    return tableMapping[normalizedName];
  }
  
  // Pattern matching for tables with prefixes/suffixes
  for (const [pattern, mapping] of Object.entries(tableMapping)) {
    if (normalizedName.includes(pattern) || normalizedName.startsWith(pattern) || normalizedName.endsWith(pattern)) {
      return mapping;
    }
  }
  
  // Try to infer from table name structure
  // e.g., "sales_order_item" -> Sales > Sales Order
  const parts = normalizedName.split('_');
  if (parts.length > 1) {
    // Check first part
    if (tableMapping[parts[0]]) {
      return tableMapping[parts[0]];
    }
    // Check second part
    if (parts.length > 1 && tableMapping[parts[1]]) {
      return tableMapping[parts[1]];
    }
    // Check combined first two parts
    if (parts.length > 1 && tableMapping[`${parts[0]}_${parts[1]}`]) {
      return tableMapping[`${parts[0]}_${parts[1]}`];
    }
  }
  
  // Default: System Settings > Settings (for unmapped tables)
  return { category: 'System Settings', menuItem: 'Settings', moduleName: 'system_settings' };
};

/**
 * Organize tables by menu structure
 * @param {Array} tables - Array of table objects with name, row_count, etc.
 * @returns {Object} - Organized structure: { [category]: { [menuItem]: [tables] } }
 */
export const organizeTablesByMenu = (tables) => {
  const organized = {};
  
  tables.forEach(table => {
    const mapping = mapTableToMenu(table.name);
    const category = mapping.category;
    const menuItem = mapping.menuItem;
    
    if (!organized[category]) {
      organized[category] = {};
    }
    if (!organized[category][menuItem]) {
      organized[category][menuItem] = [];
    }
    
    organized[category][menuItem].push(table);
  });
  
  // Sort tables within each menu item
  Object.keys(organized).forEach(category => {
    Object.keys(organized[category]).forEach(menuItem => {
      organized[category][menuItem].sort((a, b) => a.name.localeCompare(b.name));
    });
  });
  
  return organized;
};

/**
 * Get menu categories in order (matching Sidebar structure)
 * @returns {Array} - Array of category objects with title and items
 */
export const getMenuCategoriesOrdered = () => {
  return getMenuCategoriesFromSidebar();
};

export default {
  mapTableToMenu,
  organizeTablesByMenu,
  getMenuCategoriesOrdered,
};

