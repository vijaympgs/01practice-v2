/**
 * Menu structure utility - extracts menu categories from Sidebar
 * This is a centralized place to get menu structure
 * Note: Icons are removed as they're not needed for the grid structure
 */

export const getMenuCategories = (menuVisibility) => [
  {
    title: 'Home',
    type: 'DASHBOARD',
    icon: null,
    color: 'primary',
    path: '/',
    items: []
  },
  {
    title: 'User & Permissions',
    type: 'USER_PERMISSIONS',
    icon: null,
    color: 'primary',
    description: '',
    path: '/user-permissions',
    items: [
      { text: 'Role Permissions', icon: null, path: '/user-permissions', moduleName: 'user_permissions' },
      { text: 'POS Function Mapping', icon: null, path: '/user-permissions/pos-functions', moduleName: 'pos_function_mapping' },
    ]
  },
  {
    title: 'Master Data Management',
    type: 'MASTER',
    icon: null,
    color: 'info',
    description: '',
    items: [
      { text: 'Merchandise', icon: null, path: '/master-data/configuration', moduleName: 'master_configuration' },
      { text: 'General', icon: null, path: '/master-data/general', moduleName: 'master_general' },
      { text: 'UOM Setup', icon: null, path: '/master-data/uom-setup', moduleName: 'master_uom_setup' },
      { text: 'UOM Conversion', icon: null, path: '/master-data/uom-conversion', moduleName: 'master_uom_conversion' },
      { text: 'Customers', icon: null, path: '/master-data/customers', moduleName: 'master_customers' },
      { text: 'Vendors', icon: null, path: '/master-data/vendors', moduleName: 'master_vendors' },
    ]
  },
  {
    title: 'Organization Setup',
    type: 'ORGANIZATION',
    icon: null,
    color: 'primary',
    description: '',
    items: [
      { text: 'Organization Master', icon: null, path: '/organization', moduleName: 'organization' },
      { text: 'Tax Setup', icon: null, path: '/item/tax-setup', moduleName: 'item_tax_setup' },
    ]
  },
  {
    title: 'Item',
    type: 'ITEM',
    icon: null,
    color: 'success',
    description: '',
    items: [
      { text: 'Item Master', icon: null, path: '/item/item-master', moduleName: 'item_master' },
      { text: 'Attributes', icon: null, path: '/item/attributes', moduleName: 'item_attributes' },
      { text: 'Attribute Values', icon: null, path: '/item/attribute-values', moduleName: 'item_attribute_values' },
    ]
  },
  {
    title: 'Point of Sale',
    type: 'POS_LEGACY',
    icon: null,
    color: 'success',
    description: '',
    items: [
      { text: 'Terminal Configuration', icon: null, path: '/pos/terminal-configuration', moduleName: 'pos_terminal_configuration' },
      { text: 'Day Open', icon: null, path: '/pos/day-open', moduleName: 'pos_day_open' },
      { text: 'Session Open', icon: null, path: '/pos/session-open', moduleName: 'pos_session_open' },
      { text: 'POS Billing', icon: null, path: '/pos/desktop', moduleName: 'pos_billing' },
      { text: 'Settlement', icon: null, path: '/pos/settlement', moduleName: 'pos_settlement' },
      { text: 'Session Close', icon: null, path: '/pos/session-close', moduleName: 'pos_session_close' },
      { text: 'Home Delivery', icon: null, path: '/pos/home-delivery', moduleName: 'pos_home_delivery', hidden: true },
      { text: 'Customer Receivables', icon: null, path: '/pos/customer-receivables', moduleName: 'pos_customer_receivables', hidden: true },
      { text: 'Day End', icon: null, path: '/pos/day-end', moduleName: 'pos_day_end' },
      { text: 'Day Close', icon: null, path: '/pos/day-close', moduleName: 'pos_day_close', hidden: true },
      { text: 'Terminal Setup', icon: null, path: '/pos/terminal-setup', moduleName: 'pos_terminal_setup', hidden: true },
      { text: 'Shift Management', icon: null, path: '/pos/shift-management', moduleName: 'pos_shift_management', hidden: true },
      { text: 'Session Management', icon: null, path: '/pos/session-management', moduleName: 'pos_session_management', hidden: true },
      { text: 'Code Master', icon: null, path: '/pos/code-master', moduleName: 'pos_code_master', hidden: true },
    ]
  },
  {
    title: 'Point of Sale (V2)',
    type: 'POS_V2',
    icon: null,
    color: 'success',
    description: '',
    hidden: true,
    items: [
      { text: 'POS Shift Console', icon: null, path: '/posv2/shift-workflow', moduleName: 'posv2_shift_workflow', hidden: true },
      { text: 'POS Billing', icon: null, path: '/posv2/desktop', moduleName: 'posv2_billing', hidden: true },
      { text: 'Terminal Configuration', icon: null, path: '/posv2/terminal-configuration', moduleName: 'posv2_terminal_configuration', hidden: true },
    ]
  },
  {
    title: 'Inventory Management',
    type: 'INVENTORY_MGMT',
    icon: null,
    color: 'warning',
    description: '',
    items: [
      { text: 'Inventory', icon: null, path: '/inventory', moduleName: 'inventory_management' },
      { text: 'System Go Live', icon: null, path: '/inventory/system-go-live', moduleName: 'inventory_go_live' },
    ]
  },
  {
    title: 'Procurement',
    type: 'PROCUREMENT',
    icon: null,
    color: 'info',
    description: '',
    items: [
      { text: 'Purchase Request', icon: null, path: '/procurement/purchase-request', moduleName: 'procurement_purchase_request' },
      { text: 'Purchase Enquiry', icon: null, path: '/procurement/purchase-enquiry', moduleName: 'procurement_purchase_enquiry' },
      { text: 'Purchase Quotation', icon: null, path: '/procurement/purchase-quotation', moduleName: 'procurement_purchase_quotation' },
      { text: 'Purchase Order', icon: null, path: '/procurement/purchase-order', moduleName: 'procurement_purchase_order' },
      { text: 'Goods Received Note', icon: null, path: '/procurement/goods-received-note', moduleName: 'procurement_goods_received' },
      { text: 'Purchase Invoice', icon: null, path: '/procurement/purchase-invoice', moduleName: 'procurement_purchase_invoice' },
      { text: 'Purchase Return', icon: null, path: '/procurement/purchase-return', moduleName: 'procurement_purchase_return' },
      { text: 'Procurement Advice', icon: null, path: '/procurement/procurement-advice', moduleName: 'procurement_advice' },
    ]
  },
  {
    title: 'Stock Nexus',
    type: 'STOCK_NEXUS',
    icon: null,
    color: 'success',
    description: '',
    items: [
      { text: 'Initial Setup', icon: null, path: '/stock-nexus/initial-setup', moduleName: 'stock_nexus_initial_setup' },
      { text: 'Movement Tracking', icon: null, path: '/stock-nexus/movement-tracking', moduleName: 'stock_nexus_movement_tracking' },
      { text: 'Transfer Confirm', icon: null, path: '/stock-nexus/transfer-confirm', moduleName: 'stock_nexus_transfer_confirm' },
      { text: 'Count Adjust', icon: null, path: '/stock-nexus/count-adjust', moduleName: 'stock_nexus_count_adjust' },
    ]
  },
  {
    title: 'Sales',
    type: 'SALES',
    icon: null,
    color: 'primary',
    description: '',
    items: [
      { text: 'Sales', icon: null, path: '/sales', moduleName: 'sales_management' },
      { text: 'Sales Order', icon: null, path: '/sales-order-management', moduleName: 'sales_order_management' },
      { text: 'Customer Management', icon: null, path: '/customer-management', moduleName: 'customer_management' },
      { text: 'Customer Management', icon: null, path: '/customer-management', moduleName: 'customer_management' },
      { text: 'Customer', icon: null, path: '/customer-management', moduleName: 'customer_management' },
    ]
  },
  {
    title: 'Reports',
    type: 'REPORTS',
    icon: null,
    color: 'info',
    description: '',
    items: [
      { text: 'Sales Reports', icon: null, path: '/reports/sales', moduleName: 'sales_reports' },
      { text: 'Inventory Reports', icon: null, path: '/reports/inventory', moduleName: 'inventory_reports' },
      { text: 'POS Reports', icon: null, path: '/reports/pos', moduleName: 'pos_reports' },
    ]
  },
  {
    title: 'System',
    type: 'SYSTEM',
    icon: null,
    color: 'secondary',
    description: '',
    items: [
      { text: 'Admin Tools', icon: null, path: '/settings/admin-tools', moduleName: 'admin_tools' },
      { text: 'Database Configuration', icon: null, path: '/settings', moduleName: 'system_settings', parentCategory: 'admin_tools' },
      { text: 'Layout Preferences', icon: null, path: '/settings/layout-preferences', moduleName: 'layout_preferences', parentCategory: 'admin_tools' },
      { text: 'Digital Marketing Console', icon: null, path: '/settings/digital-marketing', moduleName: 'digital_marketing_console', parentCategory: 'admin_tools' },
      { text: 'Web Console', icon: null, path: '/settings/web-console', moduleName: 'web_console', parentCategory: 'admin_tools' },
      { text: 'HTML Preview Tool', icon: null, path: '/settings/html-preview', moduleName: 'html_preview_tool', parentCategory: 'admin_tools' },
      { text: 'DataOps Studio', icon: null, path: '/settings/dataops-studio', moduleName: 'database_client', parentCategory: 'admin_tools' },
      { text: 'Wireframe Launchpad', icon: null, path: '/wireframes', moduleName: 'wireframe_index', parentCategory: 'admin_tools' },
      { text: 'Business Rules', icon: null, path: '/business-rules', moduleName: 'business_rules' },
      { text: 'POS Preferences', icon: null, path: '/business-rules/general', moduleName: 'business_rules_general', parentCategory: 'business_rules' },
    ]
  },
  // Archive category
  {
    title: 'Archive',
    type: 'ARCHIVE',
    icon: null,
    color: 'secondary',
    description: '',
    items: [
      { text: 'Shift', icon: null, path: '/pos/shift-management', moduleName: 'pos_shift_management' },
    ]
  },
];

