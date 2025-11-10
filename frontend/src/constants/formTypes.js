/**
 * 🏷️ RetailPWA Form Categorization System
 * 
 * This file defines the internal categorization system for all forms
 * in the RetailPWA application. Each form is categorized as:
 * - MASTER: Master data forms (Products, Categories, Customers, etc.)
 * - TRANSACTION: Business transaction forms (Sales, Purchases, Payments, etc.)
 * - REPORTS: Report generation and configuration forms
 */

// ============================================================================
// 📋 FORM TYPE CONSTANTS
// ============================================================================

export const FORM_TYPES = {
  MASTER: 'MASTER',
  TRANSACTION: 'TRANSACTION',
  REPORTS: 'REPORTS'
};

// ============================================================================
// 🎨 FORM TYPE CONFIGURATIONS
// ============================================================================

export const FORM_TYPE_CONFIG = {
  [FORM_TYPES.MASTER]: {
    label: 'Master Data',
    description: 'Core business data that serves as reference for transactions',
    color: 'primary',
    icon: 'Database',
    characteristics: {
      // Master forms typically have:
      hasPreview: true,           // Preview section to show final data
      hasTabs: true,             // Multiple tabs for organization
      hasAuditFields: true,      // Created/Updated timestamps
      hasStatusToggle: true,     // Active/Inactive status
      hasValidation: 'strict',   // Strict validation rules
      hasSearch: true,           // Search functionality in lists
      hasFilters: true,          // Advanced filtering
      hasBulkActions: true,      // Bulk operations
      hasPagination: true,       // Paginated lists
      hasExport: true,           // Export capabilities
      hasImport: false,          // Usually no import for master data
      hasWorkflow: false,        // No approval workflow
      hasVersioning: false       // No version control
    },
    layout: {
      dialogSize: 'lg',          // Large dialog for complex forms
      cardLayout: 'detailed',    // Detailed card layout with avatars
      headerStyle: 'professional', // Professional header with counts
      actionPlacement: 'context-menu' // Actions in context menu
    }
  },

  [FORM_TYPES.TRANSACTION]: {
    label: 'Transaction',
    description: 'Business transactions and operational activities',
    color: 'success',
    icon: 'Receipt',
    characteristics: {
      // Transaction forms typically have:
      hasPreview: true,           // Preview before submission
      hasTabs: true,             // Multiple sections (Header, Lines, Summary)
      hasAuditFields: true,      // Full audit trail
      hasStatusToggle: false,    // Status managed by workflow
      hasValidation: 'business', // Business rule validation
      hasSearch: true,           // Search transactions
      hasFilters: true,          // Date ranges, status filters
      hasBulkActions: false,     // Usually no bulk operations
      hasPagination: true,       // Paginated transaction lists
      hasExport: true,           // Export for reporting
      hasImport: true,           // Import from external systems
      hasWorkflow: true,         // Approval/status workflow
      hasVersioning: true        // Version control for changes
    },
    layout: {
      dialogSize: 'xl',          // Extra large for complex transactions
      cardLayout: 'transaction', // Transaction-specific layout
      headerStyle: 'dashboard',  // Dashboard-style header with metrics
      actionPlacement: 'toolbar' // Actions in toolbar
    }
  },

  [FORM_TYPES.REPORTS]: {
    label: 'Reports',
    description: 'Report generation and configuration forms',
    color: 'info',
    icon: 'Analytics',
    characteristics: {
      // Report forms typically have:
      hasPreview: true,           // Preview report output
      hasTabs: true,             // Parameters, Filters, Output
      hasAuditFields: false,     // No audit for report configs
      hasStatusToggle: false,    // No status for reports
      hasValidation: 'parameters', // Parameter validation
      hasSearch: false,          // No search for report configs
      hasFilters: false,         // Filters are part of report params
      hasBulkActions: false,     // No bulk operations
      hasPagination: false,      // Usually limited report configs
      hasExport: true,           // Export report results
      hasImport: false,          // No import for reports
      hasWorkflow: false,        // No workflow for reports
      hasVersioning: false       // No versioning for report configs
    },
    layout: {
      dialogSize: 'lg',          // Large dialog for parameters
      cardLayout: 'simple',      // Simple card layout
      headerStyle: 'minimal',    // Minimal header
      actionPlacement: 'dialog'  // Actions in dialog
    }
  }
};

// ============================================================================
// 📊 MODULE CATEGORIZATION
// ============================================================================

export const MODULE_CATEGORIES = {
  // MASTER DATA MODULES
  products: FORM_TYPES.MASTER,
  categories: FORM_TYPES.MASTER,
  customers: FORM_TYPES.MASTER,
  suppliers: FORM_TYPES.MASTER,
  users: FORM_TYPES.MASTER,
  inventory_items: FORM_TYPES.MASTER,
  tax_rates: FORM_TYPES.MASTER,
  payment_methods: FORM_TYPES.MASTER,
  warehouses: FORM_TYPES.MASTER,
  brands: FORM_TYPES.MASTER,
  units: FORM_TYPES.MASTER,
  layout_preferences: FORM_TYPES.MASTER,

  // TRANSACTION MODULES
  sales: FORM_TYPES.TRANSACTION,
  purchases: FORM_TYPES.TRANSACTION,
  payments: FORM_TYPES.TRANSACTION,
  receipts: FORM_TYPES.TRANSACTION,
  inventory_adjustments: FORM_TYPES.TRANSACTION,
  stock_transfers: FORM_TYPES.TRANSACTION,
  returns: FORM_TYPES.TRANSACTION,
  refunds: FORM_TYPES.TRANSACTION,
  pos_transactions: FORM_TYPES.TRANSACTION,

  // REPORT MODULES
  sales_reports: FORM_TYPES.REPORTS,
  inventory_reports: FORM_TYPES.REPORTS,
  financial_reports: FORM_TYPES.REPORTS,
  customer_reports: FORM_TYPES.REPORTS,
  product_reports: FORM_TYPES.REPORTS,
  tax_reports: FORM_TYPES.REPORTS,
  dashboard_reports: FORM_TYPES.REPORTS
};

// ============================================================================
// 🛠️ UTILITY FUNCTIONS
// ============================================================================

/**
 * Get form type configuration for a module
 * @param {string} moduleName - Name of the module
 * @returns {Object} Form type configuration
 */
export const getFormTypeConfig = (moduleName) => {
  const formType = MODULE_CATEGORIES[moduleName] || FORM_TYPES.MASTER;
  return FORM_TYPE_CONFIG[formType];
};

/**
 * Get form type for a module
 * @param {string} moduleName - Name of the module
 * @returns {string} Form type (MASTER, TRANSACTION, REPORTS)
 */
export const getFormType = (moduleName) => {
  return MODULE_CATEGORIES[moduleName] || FORM_TYPES.MASTER;
};

/**
 * Check if a module is of specific form type
 * @param {string} moduleName - Name of the module
 * @param {string} formType - Form type to check
 * @returns {boolean} True if module matches form type
 */
export const isFormType = (moduleName, formType) => {
  return getFormType(moduleName) === formType;
};

/**
 * Get all modules of a specific form type
 * @param {string} formType - Form type to filter by
 * @returns {Array} Array of module names
 */
export const getModulesByFormType = (formType) => {
  return Object.keys(MODULE_CATEGORIES).filter(
    module => MODULE_CATEGORIES[module] === formType
  );
};

/**
 * Get form characteristics for a module
 * @param {string} moduleName - Name of the module
 * @returns {Object} Form characteristics
 */
export const getFormCharacteristics = (moduleName) => {
  const config = getFormTypeConfig(moduleName);
  return config.characteristics;
};

/**
 * Get layout configuration for a module
 * @param {string} moduleName - Name of the module
 * @returns {Object} Layout configuration
 */
export const getLayoutConfig = (moduleName) => {
  const config = getFormTypeConfig(moduleName);
  return config.layout;
};

/**
 * Check if a module should have a specific feature
 * @param {string} moduleName - Name of the module
 * @param {string} feature - Feature to check (e.g., 'hasPreview', 'hasTabs')
 * @returns {boolean} True if module should have the feature
 */
export const hasFeature = (moduleName, feature) => {
  const characteristics = getFormCharacteristics(moduleName);
  return characteristics[feature] || false;
};

// ============================================================================
// 📋 FORM TYPE METADATA
// ============================================================================

export const FORM_TYPE_METADATA = {
  [FORM_TYPES.MASTER]: {
    examples: [
      'Products - Manage product catalog',
      'Categories - Organize product categories',
      'Customers - Customer information',
      'Suppliers - Vendor management'
    ],
    commonFields: [
      'name', 'description', 'is_active', 'created_at', 'updated_at'
    ],
    commonTabs: [
      'Basic Information', 'Details', 'Settings', 'Preview'
    ],
    commonActions: [
      'Create', 'Edit', 'Delete', 'Activate', 'Deactivate', 'Export'
    ]
  },

  [FORM_TYPES.TRANSACTION]: {
    examples: [
      'Sales - Customer sales transactions',
      'Purchases - Supplier purchase orders',
      'Payments - Payment processing',
      'Inventory Adjustments - Stock corrections'
    ],
    commonFields: [
      'transaction_date', 'reference_number', 'status', 'total_amount'
    ],
    commonTabs: [
      'Header Information', 'Line Items', 'Payment Details', 'Summary'
    ],
    commonActions: [
      'Create', 'Edit', 'Submit', 'Approve', 'Reject', 'Print', 'Email'
    ]
  },

  [FORM_TYPES.REPORTS]: {
    examples: [
      'Sales Report - Sales performance analysis',
      'Inventory Report - Stock level reports',
      'Financial Report - Financial summaries',
      'Customer Report - Customer analytics'
    ],
    commonFields: [
      'report_name', 'date_range', 'filters', 'output_format'
    ],
    commonTabs: [
      'Parameters', 'Filters', 'Formatting', 'Preview'
    ],
    commonActions: [
      'Generate', 'Preview', 'Export', 'Schedule', 'Email', 'Print'
    ]
  }
};

// ============================================================================
// 🎨 VISUAL INDICATORS
// ============================================================================

export const getFormTypeIndicator = (moduleName) => {
  const formType = getFormType(moduleName);
  const config = FORM_TYPE_CONFIG[formType];
  
  return {
    type: formType,
    label: config.label,
    color: config.color,
    icon: config.icon,
    description: config.description
  };
};

// ============================================================================
// 📊 STATISTICS
// ============================================================================

export const getFormTypeStats = () => {
  const stats = {
    [FORM_TYPES.MASTER]: 0,
    [FORM_TYPES.TRANSACTION]: 0,
    [FORM_TYPES.REPORTS]: 0
  };

  Object.values(MODULE_CATEGORIES).forEach(type => {
    stats[type]++;
  });

  return {
    stats,
    total: Object.keys(MODULE_CATEGORIES).length,
    breakdown: Object.keys(stats).map(type => ({
      type,
      count: stats[type],
      percentage: ((stats[type] / Object.keys(MODULE_CATEGORIES).length) * 100).toFixed(1)
    }))
  };
};

export default {
  FORM_TYPES,
  FORM_TYPE_CONFIG,
  MODULE_CATEGORIES,
  getFormTypeConfig,
  getFormType,
  isFormType,
  getModulesByFormType,
  getFormCharacteristics,
  getLayoutConfig,
  hasFeature,
  getFormTypeIndicator,
  getFormTypeStats
};
