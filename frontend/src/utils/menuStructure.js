/**
 * Menu structure utility - extracts menu categories from Sidebar
 * This is a centralized place to get menu structure
 */

// Icon mapping for menu items - using string identifiers instead of JSX components
const iconMap = {
  'Dashboard': 'Dashboard',
  'People': 'People',
  'SettingsIcon': 'Settings',
  'Category': 'Category',
  'Inventory': 'Inventory',
  'ShoppingCart': 'ShoppingCart',
  'PointOfSale': 'PointOfSale',
  'Business': 'Business',
  'Assignment': 'Assignment',
  'Assessment': 'Assessment',
  'DatabaseIcon': 'Storage',
  'Receipt': 'Receipt',
  'ReportsIcon': 'Analytics',
  'LocalShipping': 'LocalShipping',
  'TrendingUp': 'TrendingUp',
  'AccessTime': 'AccessTime',
  'AccountBalance': 'AccountBalance',
  'Event': 'Event',
  'CodeIcon': 'Code',
  'ShoppingCartCheckout': 'ShoppingCartCheckout',
  'OrderIcon': 'Description',
  'AdminPanelSettings': 'AdminPanelSettings',
  'Archive': 'Archive',
  'DayOpenIcon': 'CheckCircle',
  'DayCloseIcon': 'Close',
  'Keyboard': 'Keyboard',
  'Public': 'Public',
  'Launch': 'Launch',
  'POSFunctionMapping': 'SettingsApplications',
  'TerminalConfiguration': 'Computer',
  'DayOpen': 'PlayArrow',
  'SessionClose': 'Stop',
  'PurchaseQuotation': 'RequestQuote',
  'InitialSetup': 'SettingsSuggest',
  'SalesOrder': 'ShoppingCart',
  'DatabaseConfiguration': 'Storage',
  'LayoutPreferences': 'ViewQuilt',
  'WebConsole': 'Web',
  'HTMLPreviewTool': 'Preview',
  'DayManagementConsole': 'Event',
};

export const getMenuCategories = (menuVisibility) => [
  {
    title: 'Home',
    type: 'DASHBOARD',
    icon: 'Dashboard',
    color: 'primary',
    path: '/',
    items: []
  },
  {
    title: 'User & Permissions',
    type: 'USER_PERMISSIONS',
    icon: 'People',
    color: 'primary',
    description: 'Manage user roles and permissions',
    path: '/user-permissions',
    items: [
      { text: 'Role Permissions', icon: 'AdminPanelSettings', path: '/user-permissions', moduleName: 'user_permissions' },
      { text: 'POS Function Mapping', icon: 'POSFunctionMapping', path: '/user-permissions/pos-functions', moduleName: 'pos_function_mapping' },
    ]
  },
  {
    title: 'Master Data Management',
    type: 'MASTER',
    icon: 'Category',
    color: 'info',
    description: 'Configure master data and classifications',
    items: [
      { text: 'Merchandise', icon: 'ShoppingCart', path: '/master-data/configuration', moduleName: 'master_configuration' },
      { text: 'General', icon: 'Assignment', path: '/master-data/general', moduleName: 'master_general' },
      { text: 'UOM Setup', icon: 'SettingsIcon', path: '/master-data/uom-setup', moduleName: 'master_uom_setup' },
      { text: 'UOM Conversion', icon: 'TrendingUp', path: '/master-data/uom-conversion', moduleName: 'master_uom_conversion' },
      { text: 'Customers', icon: 'People', path: '/master-data/customers', moduleName: 'master_customers' },
      { text: 'Vendors', icon: 'LocalShipping', path: '/master-data/vendors', moduleName: 'master_vendors' },
    ]
  },
  {
    title: 'Organization Setup',
    type: 'ORGANIZATION',
    icon: 'Business',
    color: 'primary',
    description: 'Configure organization and tax settings',
    items: [
      { text: 'Organization Master', icon: 'Business', path: '/organization', moduleName: 'organization' },
      { text: 'Tax Setup', icon: 'Receipt', path: '/item/tax-setup', moduleName: 'item_tax_setup' },
    ]
  },
  {
    title: 'Item',
    type: 'ITEM',
    icon: 'Category',
    color: 'success',
    description: 'Manage items, attributes, and classifications',
    items: [
      { text: 'Item Master', icon: 'Inventory', path: '/item/item-master', moduleName: 'item_master' },
      { text: 'Attributes', icon: 'Category', path: '/item/attributes', moduleName: 'item_attributes' },
      { text: 'Attribute Values', icon: 'Assignment', path: '/item/attribute-values', moduleName: 'item_attribute_values' },
    ]
  },
  {
    title: 'Point of Sale',
    type: 'POS_LEGACY',
    icon: 'PointOfSale',
    color: 'success',
    description: 'Point of Sale operations and management',
    items: [
      { text: 'Terminal Configuration', icon: 'TerminalConfiguration', path: '/pos/terminal-configuration', moduleName: 'pos_terminal_configuration' },
      { text: 'Day Management Console', icon: 'DayManagementConsole', path: '/pos/day-management-console', moduleName: 'pos_day_management_console' },
      { text: 'Day Open', icon: 'DayOpen', path: '/pos/day-open', moduleName: 'pos_day_open' },
      { text: 'Session Open', icon: 'AccessTime', path: '/pos/session-open', moduleName: 'pos_session_open' },
      { text: 'POS Billing', icon: 'PointOfSale', path: '/pos/desktop', moduleName: 'pos_billing' },
      { text: 'Settlement', icon: 'Receipt', path: '/pos/settlement', moduleName: 'pos_settlement' },
      { text: 'Session Close', icon: 'SessionClose', path: '/pos/session-close', moduleName: 'pos_session_close' },
      { text: 'Home Delivery', icon: 'LocalShipping', path: '/pos/home-delivery', moduleName: 'pos_home_delivery', hidden: true },
      { text: 'Customer Receivables', icon: 'AccountBalance', path: '/pos/customer-receivables', moduleName: 'pos_customer_receivables', hidden: true },
      { text: 'Day End', icon: 'Event', path: '/pos/day-end', moduleName: 'pos_day_end' },
      { text: 'Day Close', icon: 'Close', path: '/pos/day-close', moduleName: 'pos_day_close', hidden: true },
      { text: 'Terminal Setup', icon: 'SettingsIcon', path: '/pos/terminal-setup', moduleName: 'pos_terminal_setup', hidden: true },
      { text: 'Shift Management', icon: 'AccessTime', path: '/pos/shift-management', moduleName: 'pos_shift_management', hidden: true },
      { text: 'Session Management', icon: 'AccessTime', path: '/pos/session-management', moduleName: 'pos_session_management', hidden: true },
      { text: 'Code Master', icon: 'CodeIcon', path: '/pos/code-master', moduleName: 'pos_code_master', hidden: true },
    ]
  },
  {
    title: 'Point of Sale (V2)',
    type: 'POS_V2',
    icon: 'PointOfSale',
    color: 'success',
    description: 'Next generation Point of Sale',
    hidden: true,
    items: [
      { text: 'POS Shift Console', icon: 'AccessTime', path: '/posv2/shift-workflow', moduleName: 'posv2_shift_workflow', hidden: true },
      { text: 'POS Billing', icon: 'PointOfSale', path: '/posv2/desktop', moduleName: 'posv2_billing', hidden: true },
      { text: 'Terminal Configuration', icon: 'SettingsIcon', path: '/posv2/terminal-configuration', moduleName: 'posv2_terminal_configuration', hidden: true },
    ]
  },
  {
    title: 'Inventory Management',
    type: 'INVENTORY_MGMT',
    icon: 'Inventory',
    color: 'warning',
    description: 'Inventory and stock management',
    items: [
      { text: 'Inventory', icon: 'Inventory', path: '/inventory', moduleName: 'inventory_management' },
      { text: 'System Go Live', icon: 'Launch', path: '/inventory/system-go-live', moduleName: 'inventory_go_live' },
    ]
  },
  {
    title: 'Procurement',
    type: 'PROCUREMENT',
    icon: 'LocalShipping',
    color: 'info',
    description: 'Purchase and procurement management',
    items: [
      { text: 'Purchase Request', icon: 'ShoppingCartCheckout', path: '/procurement/purchase-request', moduleName: 'procurement_purchase_request' },
      { text: 'Purchase Enquiry', icon: 'Public', path: '/procurement/purchase-enquiry', moduleName: 'procurement_purchase_enquiry' },
      { text: 'Purchase Quotation', icon: 'PurchaseQuotation', path: '/procurement/purchase-quotation', moduleName: 'procurement_purchase_quotation' },
      { text: 'Purchase Order', icon: 'ShoppingCart', path: '/procurement/purchase-order', moduleName: 'procurement_purchase_order' },
      { text: 'Goods Received Note', icon: 'LocalShipping', path: '/procurement/goods-received-note', moduleName: 'procurement_goods_received' },
      { text: 'Purchase Invoice', icon: 'Receipt', path: '/procurement/purchase-invoice', moduleName: 'procurement_purchase_invoice' },
      { text: 'Purchase Return', icon: 'ShoppingCartCheckout', path: '/procurement/purchase-return', moduleName: 'procurement_purchase_return' },
      { text: 'Procurement Advice', icon: 'Assessment', path: '/procurement/procurement-advice', moduleName: 'procurement_advice' },
    ]
  },
  {
    title: 'Stock Nexus',
    type: 'STOCK_NEXUS',
    icon: 'Inventory',
    color: 'success',
    description: 'Stock transfer and movement management',
    items: [
      { text: 'Initial Setup', icon: 'InitialSetup', path: '/stock-nexus/initial-setup', moduleName: 'stock_nexus_initial_setup' },
      { text: 'Movement Tracking', icon: 'TrendingUp', path: '/stock-nexus/movement-tracking', moduleName: 'stock_nexus_movement_tracking' },
      { text: 'Transfer Confirm', icon: 'CheckCircle', path: '/stock-nexus/transfer-confirm', moduleName: 'stock_nexus_transfer_confirm' },
      { text: 'Count Adjust', icon: 'Assessment', path: '/stock-nexus/count-adjust', moduleName: 'stock_nexus_count_adjust' },
    ]
  },
  {
    title: 'Sales',
    type: 'SALES',
    icon: 'ShoppingCart',
    color: 'primary',
    description: 'Sales and customer management',
    items: [
      { text: 'Sales', icon: 'ShoppingCart', path: '/sales', moduleName: 'sales_management' },
      { text: 'Sales Order', icon: 'OrderIcon', path: '/sales-order-management', moduleName: 'sales_order_management' },
      { text: 'Customer Management', icon: 'People', path: '/customer-management', moduleName: 'customer_management' },
      { text: 'Customer Management', icon: 'People', path: '/customer-management', moduleName: 'customer_management' },
      { text: 'Customer', icon: 'People', path: '/customer-management', moduleName: 'customer_management' },
    ]
  },
  {
    title: 'Reports',
    type: 'REPORTS',
    icon: 'ReportsIcon',
    color: 'info',
    description: 'Business reports and analytics',
    items: [
      { text: 'Sales Reports', icon: 'TrendingUp', path: '/reports/sales', moduleName: 'sales_reports' },
      { text: 'Inventory Reports', icon: 'Inventory', path: '/reports/inventory', moduleName: 'inventory_reports' },
      { text: 'POS Reports', icon: 'PointOfSale', path: '/reports/pos', moduleName: 'pos_reports' },
    ]
  },
  {
    title: 'System',
    type: 'SYSTEM',
    icon: 'SettingsIcon',
    color: 'secondary',
    description: 'System administration and tools',
    items: [
      { text: 'Admin Tools', icon: 'AdminPanelSettings', path: '/settings/admin-tools', moduleName: 'admin_tools' },
      { text: 'Database Configuration', icon: 'DatabaseIcon', path: '/settings', moduleName: 'system_settings', parentCategory: 'admin_tools' },
      { text: 'Layout Preferences', icon: 'SettingsIcon', path: '/settings/layout-preferences', moduleName: 'layout_preferences', parentCategory: 'admin_tools' },
      { text: 'Digital Marketing Console', icon: 'Public', path: '/settings/digital-marketing', moduleName: 'digital_marketing_console', parentCategory: 'admin_tools' },
      { text: 'Web Console', icon: 'CodeIcon', path: '/settings/web-console', moduleName: 'web_console', parentCategory: 'admin_tools' },
      { text: 'HTML Preview Tool', icon: 'CodeIcon', path: '/settings/html-preview', moduleName: 'html_preview_tool', parentCategory: 'admin_tools' },
      { text: 'DataOps Studio', icon: 'DatabaseIcon', path: '/settings/dataops-studio', moduleName: 'database_client', parentCategory: 'admin_tools' },
      { text: 'Wireframe Launchpad', icon: 'Launch', path: '/wireframes', moduleName: 'wireframe_index', parentCategory: 'admin_tools' },
      { text: 'Business Rules', icon: 'SettingsIcon', path: '/business-rules', moduleName: 'business_rules' },
      { text: 'POS Preferences', icon: 'SettingsIcon', path: '/business-rules/general', moduleName: 'business_rules_general', parentCategory: 'business_rules' },
    ]
  },
  // Archive category
  {
    title: 'Archive',
    type: 'ARCHIVE',
    icon: 'Archive',
    color: 'secondary',
    description: 'Archived features and functions',
    items: [
      { text: 'Shift', icon: 'AccessTime', path: '/pos/shift-management', moduleName: 'pos_shift_management' },
    ]
  },
];

// Export icon mapping for use in components
export { iconMap };

// Helper function to convert string icon names to actual icon components
// This should be used in components that need to render the icons
export const getIconComponent = (iconName) => {
  // Import this function in components and use it to convert string names to icons
  // The actual icon components should be imported in the consuming component
  return iconName || null;
};
