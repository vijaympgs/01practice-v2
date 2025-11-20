/**
 * Menu structure utility - extracts menu categories from Sidebar
 * This is a centralized place to get menu structure
 * Icons are now included for the enhanced sidebar with comprehensive icon mappings
 */

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
    description: '',
    path: '/user-permissions',
    items: [
      { text: 'Role Permissions', icon: 'AdminPanelSettings', path: '/user-permissions', moduleName: 'user_permissions' },
      { text: 'POS Function Mapping', icon: 'Settings', path: '/user-permissions/pos-functions', moduleName: 'pos_function_mapping' },
    ]
  },
  {
    title: 'Master Data Management',
    type: 'MASTER',
    icon: 'Category',
    color: 'info',
    description: '',
    items: [
      { text: 'Merchandise', icon: 'Inventory', path: '/master-data/configuration', moduleName: 'master_configuration' },
      { text: 'General', icon: 'Assignment', path: '/master-data/general', moduleName: 'master_general' },
      { text: 'UOM Setup', icon: 'Category', path: '/master-data/uom-setup', moduleName: 'master_uom_setup' },
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
    description: '',
    items: [
      { text: 'Organization Master', icon: 'Business', path: '/organization', moduleName: 'organization' },
      { text: 'Tax Setup', icon: 'Receipt', path: '/item/tax-setup', moduleName: 'item_tax_setup' },
    ]
  },
  {
    title: 'Item',
    type: 'ITEM',
    icon: 'Inventory',
    color: 'success',
    description: '',
    items: [
      { text: 'Item Master', icon: 'Inventory', path: '/item/item-master', moduleName: 'item_master' },
      { text: 'Attributes', icon: 'Settings', path: '/item/attributes', moduleName: 'item_attributes' },
      { text: 'Attribute Values', icon: 'Category', path: '/item/attribute-values', moduleName: 'item_attribute_values' },
    ]
  },
  {
    title: 'Point of Sale',
    type: 'POS_LEGACY',
    icon: 'PointOfSale',
    color: 'success',
    description: '',
    items: [
      { text: 'Terminal Configuration', icon: 'Computer', path: '/pos/terminal-configuration', moduleName: 'pos_terminal_configuration' },
      { text: 'Day Open', icon: 'PlayArrow', path: '/pos/day-open', moduleName: 'pos_day_open' },
      { text: 'Session Open', icon: 'PlayArrow', path: '/pos/session-open', moduleName: 'pos_session_open' },
      { text: 'POS Billing', icon: 'PointOfSale', path: '/pos/desktop', moduleName: 'pos_billing' },
      { text: 'Settlement', icon: 'Receipt', path: '/pos/settlement', moduleName: 'pos_settlement' },
      { text: 'Day Management Console', icon: 'Event', path: '/pos/day-management-console', moduleName: 'pos_day_management' },
      { text: 'Session Close', icon: 'Stop', path: '/pos/session-close', moduleName: 'pos_session_close' },
      { text: 'Home Delivery', icon: 'LocalShipping', path: '/pos/home-delivery', moduleName: 'pos_home_delivery', hidden: true },
      { text: 'Customer Receivables', icon: 'Receipt', path: '/pos/customer-receivables', moduleName: 'pos_customer_receivables', hidden: true },
      { text: 'Day End', icon: 'Close', path: '/pos/day-end', moduleName: 'pos_day_end' },
      { text: 'Day Close', icon: 'Close', path: '/pos/day-close', moduleName: 'pos_day_close', hidden: true },
      { text: 'Terminal Setup', icon: 'Computer', path: '/pos/terminal-setup', moduleName: 'pos_terminal_setup', hidden: true },
      { text: 'Shift Management', icon: 'AccessTime', path: '/pos/shift-management', moduleName: 'pos_shift_management', hidden: true },
      { text: 'Session Management', icon: 'AccessTime', path: '/pos/session-management', moduleName: 'pos_session_management', hidden: true },
      { text: 'Code Master', icon: 'Code', path: '/pos/code-master', moduleName: 'pos_code_master', hidden: true },
    ]
  },
  {
    title: 'Point of Sale (V2)',
    type: 'POS_V2',
    icon: 'PointOfSale',
    color: 'success',
    description: '',
    hidden: true,
    items: [
      { text: 'POS Shift Console', icon: 'AccessTime', path: '/posv2/shift-workflow', moduleName: 'posv2_shift_workflow', hidden: true },
      { text: 'POS Billing', icon: 'PointOfSale', path: '/posv2/desktop', moduleName: 'posv2_billing', hidden: true },
      { text: 'Terminal Configuration', icon: 'Computer', path: '/posv2/terminal-configuration', moduleName: 'posv2_terminal_configuration', hidden: true },
    ]
  },
  {
    title: 'Inventory Management',
    type: 'INVENTORY_MGMT',
    icon: 'Storage',
    color: 'warning',
    description: '',
    items: [
      { text: 'Inventory', icon: 'Inventory', path: '/inventory', moduleName: 'inventory_management' },
      { text: 'System Go Live', icon: 'SettingsSuggest', path: '/inventory/system-go-live', moduleName: 'inventory_go_live' },
    ]
  },
  {
    title: 'Procurement',
    type: 'PROCUREMENT',
    icon: 'LocalShipping',
    color: 'info',
    description: '',
    items: [
      { text: 'Purchase Request', icon: 'ShoppingCart', path: '/procurement/purchase-request', moduleName: 'procurement_purchase_request' },
      { text: 'Purchase Enquiry', icon: 'Search', path: '/procurement/purchase-enquiry', moduleName: 'procurement_purchase_enquiry' },
      { text: 'Purchase Quotation', icon: 'RequestQuote', path: '/procurement/purchase-quotation', moduleName: 'procurement_purchase_quotation' },
      { text: 'Purchase Order', icon: 'ShoppingCartCheckout', path: '/procurement/purchase-order', moduleName: 'procurement_purchase_order' },
      { text: 'Goods Received Note', icon: 'LocalShipping', path: '/procurement/goods-received-note', moduleName: 'procurement_goods_received' },
      { text: 'Purchase Invoice', icon: 'Receipt', path: '/procurement/purchase-invoice', moduleName: 'procurement_purchase_invoice' },
      { text: 'Purchase Return', icon: 'AssignmentReturn', path: '/procurement/purchase-return', moduleName: 'procurement_purchase_return' },
      { text: 'Procurement Advice', icon: 'Lightbulb', path: '/procurement/procurement-advice', moduleName: 'procurement_advice' },
    ]
  },
  {
    title: 'Stock Nexus',
    type: 'STOCK_NEXUS',
    icon: 'Storage',
    color: 'success',
    description: '',
    items: [
      { text: 'Initial Setup', icon: 'SettingsSuggest', path: '/stock-nexus/initial-setup', moduleName: 'stock_nexus_initial_setup' },
      { text: 'Movement Tracking', icon: 'TrendingUp', path: '/stock-nexus/movement-tracking', moduleName: 'stock_nexus_movement_tracking' },
      { text: 'Transfer Confirm', icon: 'Launch', path: '/stock-nexus/transfer-confirm', moduleName: 'stock_nexus_transfer_confirm' },
      { text: 'Count Adjust', icon: 'Assessment', path: '/stock-nexus/count-adjust', moduleName: 'stock_nexus_count_adjust' },
    ]
  },
  {
    title: 'Sales',
    type: 'SALES',
    icon: 'ShoppingCart',
    color: 'primary',
    description: '',
    items: [
      { text: 'Sales', icon: 'ShoppingCart', path: '/sales', moduleName: 'sales_management' },
      { text: 'Sales Order', icon: 'ShoppingCartCheckout', path: '/sales-order-management', moduleName: 'sales_order_management' },
      { text: 'Customer Management', icon: 'People', path: '/customer-management', moduleName: 'customer_management' },
      { text: 'Customer Management', icon: 'People', path: '/customer-management', moduleName: 'customer_management' },
      { text: 'Customer', icon: 'People', path: '/customer-management', moduleName: 'customer_management' },
    ]
  },
  {
    title: 'Reports',
    type: 'REPORTS',
    icon: 'Assessment',
    color: 'info',
    description: '',
    items: [
      { text: 'Sales Reports', icon: 'Analytics', path: '/reports/sales', moduleName: 'sales_reports' },
      { text: 'Inventory Reports', icon: 'Assessment', path: '/reports/inventory', moduleName: 'inventory_reports' },
      { text: 'POS Reports', icon: 'Assessment', path: '/reports/pos', moduleName: 'pos_reports' },
    ]
  },
  {
    title: 'System',
    type: 'SYSTEM',
    icon: 'Settings',
    color: 'secondary',
    description: '',
    items: [
      { text: 'Admin Tools', icon: 'AdminPanelSettings', path: '/settings/admin-tools', moduleName: 'admin_tools', subcategory: 'Admin Tools' },
      { text: 'Database Configuration', icon: 'DatabaseIcon', path: '/settings', moduleName: 'system_settings', subcategory: 'Admin Tools' },
      { text: 'Layout Preferences', icon: 'ViewQuilt', path: '/settings/layout-preferences', moduleName: 'layout_preferences', subcategory: 'Admin Tools' },
      { text: 'Digital Marketing Console', icon: 'Language', path: '/settings/digital-marketing', moduleName: 'digital_marketing_console', subcategory: 'Admin Tools' },
      { text: 'HTML Preview Tool', icon: 'Preview', path: '/settings/html-preview', moduleName: 'html_preview_tool', subcategory: 'Admin Tools' },
      { text: 'DataOps Studio', icon: 'CodeIcon', path: '/settings/dataops-studio', moduleName: 'database_client', subcategory: 'Admin Tools' },
      { text: 'Wireframe Launchpad', icon: 'Launch', path: '/wireframes', moduleName: 'wireframe_index', subcategory: 'Admin Tools' },
      { text: 'Business Rules', icon: 'Assignment', path: '/business-rules', moduleName: 'business_rules', subcategory: 'Business Rules' },
      { text: 'POS Preferences', icon: 'Settings', path: '/business-rules/general', moduleName: 'business_rules_general', subcategory: 'Business Rules' },
    ]
  },
  // Archive category
  {
    title: 'Archive',
    type: 'ARCHIVE',
    icon: 'Archive',
    color: 'secondary',
    description: '',
    items: [
      { text: 'Shift', icon: 'AccessTime', path: '/pos/shift-management', moduleName: 'pos_shift_management' },
    ]
  },
];
