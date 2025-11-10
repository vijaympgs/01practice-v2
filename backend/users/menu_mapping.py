"""
Menu Item Mapping for Permission Management

This module defines the structure of all menu items/UI screens in the system,
categorized by type and subtype for permission management.

Types:
- MASTER: All master data management screens
- SECURITY: User and permission management screens
- TRANSACTION: All transaction screens (Sales, POS, Procurement, etc.)

Transaction Subtypes:
- POS: Point of Sale transactions
- BACKOFFICE: Back Office transactions (Sales, Procurement, Stock Nexus, Inventory, Reports)
"""

from enum import Enum


class MenuType(str, Enum):
    """Menu item types"""
    MASTER = "MASTER"
    SECURITY = "SECURITY"
    TRANSACTION = "TRANSACTION"
    SYSTEM = "SYSTEM"  # System settings, dashboard, etc.
    DASHBOARD = "DASHBOARD"


class TransactionSubType(str, Enum):
    """Transaction subtypes"""
    POS = "POS"
    BACKOFFICE = "BACKOFFICE"


# Menu Item Mapping: menu_item_id -> type, subtype (if transaction), display_name, path
MENU_ITEMS_MAPPING = {
    # ==================== DASHBOARD ====================
    'dashboard': {
        'menu_item_id': 'dashboard',
        'type': MenuType.DASHBOARD,
        'subtype': None,
        'display_name': 'Dashboard',
        'path': '/',
        'category': 'Home',
        'description': 'Main dashboard'
    },
    
    # ==================== SECURITY ====================
    'user_permissions': {
        'menu_item_id': 'user_permissions',
        'type': MenuType.SECURITY,
        'subtype': None,
        'display_name': 'User & Permissions',
        'path': '/user-permissions',
        'category': 'User & Permissions',
        'description': 'User and permission management'
    },
    
    # ==================== MASTER ====================
    # Master Data Management
    'master_configuration': {
        'menu_item_id': 'master_configuration',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'Merchandise',
        'path': '/master-data/configuration',
        'category': 'Master Data Management',
        'description': 'Merchandise configuration'
    },
    'master_general': {
        'menu_item_id': 'master_general',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'General',
        'path': '/master-data/general',
        'category': 'Master Data Management',
        'description': 'General master data'
    },
    'master_uom_setup': {
        'menu_item_id': 'master_uom_setup',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'UOM Setup',
        'path': '/master-data/uom-setup',
        'category': 'Master Data Management',
        'description': 'Unit of Measure setup'
    },
    'master_uom_conversion': {
        'menu_item_id': 'master_uom_conversion',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'UOM Conversion',
        'path': '/master-data/uom-conversion',
        'category': 'Master Data Management',
        'description': 'UOM conversion setup'
    },
    'master_customers': {
        'menu_item_id': 'master_customers',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'Customers',
        'path': '/master-data/customers',
        'category': 'Master Data Management',
        'description': 'Customer master data'
    },
    'master_vendors': {
        'menu_item_id': 'master_vendors',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'Vendors',
        'path': '/master-data/vendors',
        'category': 'Master Data Management',
        'description': 'Vendor master data'
    },
    
    # Organization Setup
    'organization': {
        'menu_item_id': 'organization',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'Organization Master',
        'path': '/organization',
        'category': 'Organization Setup',
        'description': 'Organization master data'
    },
    'item_tax_setup': {
        'menu_item_id': 'item_tax_setup',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'Tax Setup',
        'path': '/item/tax-setup',
        'category': 'Organization Setup',
        'description': 'Tax configuration'
    },
    
    # Item Management
    'item_master': {
        'menu_item_id': 'item_master',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'Item Master',
        'path': '/item/item-master',
        'category': 'Item Management',
        'description': 'Item master data'
    },
    'item_attributes': {
        'menu_item_id': 'item_attributes',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'Attributes',
        'path': '/item/attributes',
        'category': 'Item Management',
        'description': 'Item attributes'
    },
    'item_attribute_values': {
        'menu_item_id': 'item_attribute_values',
        'type': MenuType.MASTER,
        'subtype': None,
        'display_name': 'Attribute Values',
        'path': '/item/attribute-values',
        'category': 'Item Management',
        'description': 'Item attribute values'
    },
    
    # ==================== TRANSACTIONS - POS ====================
    'pos_terminal_configuration': {
        'menu_item_id': 'pos_terminal_configuration',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Terminal Configuration',
        'path': '/pos/terminal-configuration',
        'category': 'Point of Sale',
        'description': 'POS terminal configuration'
    },
    'pos_shift_management': {
        'menu_item_id': 'pos_shift_management',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Shift Management',
        'path': '/pos/shift-management',
        'category': 'Point of Sale',
        'description': 'POS shift management'
    },
    'pos_session_management': {
        'menu_item_id': 'pos_session_management',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Session Management',
        'path': '/pos/session-management',
        'category': 'Point of Sale',
        'description': 'POS session management'
    },
    'pos_billing': {
        'menu_item_id': 'pos_billing',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Billing',
        'path': '/pos/billing',
        'category': 'Point of Sale',
        'description': 'POS billing/transaction'
    },
    'pos_settlement': {
        'menu_item_id': 'pos_settlement',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Settlement',
        'path': '/pos/settlement',
        'category': 'Point of Sale',
        'description': 'POS settlement'
    },
    'pos_day_end': {
        'menu_item_id': 'pos_day_end',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Day End Process',
        'path': '/pos/day-end',
        'category': 'Point of Sale',
        'description': 'POS day end process'
    },
    'pos_terminal_setup': {
        'menu_item_id': 'pos_terminal_setup',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Terminal Setup',
        'path': '/pos/terminal-setup',
        'category': 'Point of Sale',
        'description': 'POS terminal setup'
    },
    'pos_terminal': {
        'menu_item_id': 'pos_terminal',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'POS Terminal',
        'path': '/pos',
        'category': 'Point of Sale',
        'description': 'POS terminal main screen'
    },
    'pos_receivables': {
        'menu_item_id': 'pos_receivables',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Customer Receivables',
        'path': '/pos/customer-receivables',
        'category': 'Point of Sale',
        'description': 'POS customer receivables'
    },
    'pos_advanced_settlement': {
        'menu_item_id': 'pos_advanced_settlement',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Advanced Settlement',
        'path': '/pos/advanced-settlement',
        'category': 'Point of Sale',
        'description': 'POS advanced settlement'
    },
    'pos_advanced_receivables': {
        'menu_item_id': 'pos_advanced_receivables',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Advanced Receivables',
        'path': '/pos/advanced-receivables',
        'category': 'Point of Sale',
        'description': 'POS advanced receivables'
    },
    'pos_delivery': {
        'menu_item_id': 'pos_delivery',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Home Delivery',
        'path': '/pos/home-delivery',
        'category': 'Point of Sale',
        'description': 'POS home delivery'
    },
    'pos_advanced_delivery': {
        'menu_item_id': 'pos_advanced_delivery',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Advanced Delivery',
        'path': '/pos/advanced-delivery',
        'category': 'Point of Sale',
        'description': 'POS advanced delivery'
    },
    'pos_advanced_terminal': {
        'menu_item_id': 'pos_advanced_terminal',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Advanced Terminal Features',
        'path': '/pos/advanced-terminal-features',
        'category': 'Point of Sale',
        'description': 'POS advanced terminal features'
    },
    'pos_advanced_day_end': {
        'menu_item_id': 'pos_advanced_day_end',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Advanced Day End',
        'path': '/pos/advanced-day-end',
        'category': 'Point of Sale',
        'description': 'POS advanced day end'
    },
    'pos_code_master': {
        'menu_item_id': 'pos_code_master',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Code Master',
        'path': '/pos/code-master',
        'category': 'Point of Sale',
        'description': 'POS code master'
    },
    'pos_sessions': {
        'menu_item_id': 'pos_sessions',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.POS,
        'display_name': 'Legacy Sessions',
        'path': '/pos-sessions',
        'category': 'Point of Sale',
        'description': 'POS legacy sessions'
    },
    
    # ==================== TRANSACTIONS - BACKOFFICE ====================
    # Sales
    'sales_management': {
        'menu_item_id': 'sales_management',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Sales',
        'path': '/sales',
        'category': 'Sales',
        'description': 'Sales management'
    },
    'sales_order_management': {
        'menu_item_id': 'sales_order_management',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Sales Order Management',
        'path': '/sales-order-management',
        'category': 'Sales',
        'description': 'Sales order management'
    },
    'customer_management': {
        'menu_item_id': 'customer_management',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Customer Management',
        'path': '/customer-management',
        'category': 'Sales',
        'description': 'Customer management'
    },
    
    # Procurement
    'procurement_purchase_request': {
        'menu_item_id': 'procurement_purchase_request',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Purchase Request',
        'path': '/procurement/purchase-request',
        'category': 'Procurement',
        'description': 'Purchase request'
    },
    'procurement_purchase_enquiry': {
        'menu_item_id': 'procurement_purchase_enquiry',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Purchase Enquiry',
        'path': '/procurement/purchase-enquiry',
        'category': 'Procurement',
        'description': 'Purchase enquiry'
    },
    'procurement_purchase_quotation': {
        'menu_item_id': 'procurement_purchase_quotation',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Purchase Quotation',
        'path': '/procurement/purchase-quotation',
        'category': 'Procurement',
        'description': 'Purchase quotation'
    },
    'procurement_purchase_order': {
        'menu_item_id': 'procurement_purchase_order',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Purchase Order',
        'path': '/procurement/purchase-order',
        'category': 'Procurement',
        'description': 'Purchase order'
    },
    'procurement_goods_received': {
        'menu_item_id': 'procurement_goods_received',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Goods Received Note',
        'path': '/procurement/goods-received-note',
        'category': 'Procurement',
        'description': 'Goods received note'
    },
    'procurement_purchase_invoice': {
        'menu_item_id': 'procurement_purchase_invoice',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Purchase Invoice',
        'path': '/procurement/purchase-invoice',
        'category': 'Procurement',
        'description': 'Purchase invoice'
    },
    'procurement_purchase_return': {
        'menu_item_id': 'procurement_purchase_return',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Purchase Return',
        'path': '/procurement/purchase-return',
        'category': 'Procurement',
        'description': 'Purchase return'
    },
    'procurement_advice': {
        'menu_item_id': 'procurement_advice',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Procurement Advice',
        'path': '/procurement/procurement-advice',
        'category': 'Procurement',
        'description': 'Procurement advice'
    },
    
    # Stock Nexus
    'stock_nexus_initial_setup': {
        'menu_item_id': 'stock_nexus_initial_setup',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Initial Setup',
        'path': '/stock-nexus/initial-setup',
        'category': 'Stock Nexus',
        'description': 'Stock nexus initial setup'
    },
    'stock_nexus_movement_tracking': {
        'menu_item_id': 'stock_nexus_movement_tracking',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Movement Tracking',
        'path': '/stock-nexus/movement-tracking',
        'category': 'Stock Nexus',
        'description': 'Stock movement tracking'
    },
    'stock_nexus_transfer_confirm': {
        'menu_item_id': 'stock_nexus_transfer_confirm',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Transfer Confirm',
        'path': '/stock-nexus/transfer-confirm',
        'category': 'Stock Nexus',
        'description': 'Stock transfer confirmation'
    },
    'stock_nexus_count_adjust': {
        'menu_item_id': 'stock_nexus_count_adjust',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Count Adjust',
        'path': '/stock-nexus/count-adjust',
        'category': 'Stock Nexus',
        'description': 'Stock count adjustment'
    },
    
    # Inventory Management
    'inventory_management': {
        'menu_item_id': 'inventory_management',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'Inventory',
        'path': '/inventory',
        'category': 'Inventory Management',
        'description': 'Inventory management'
    },
    'inventory_go_live': {
        'menu_item_id': 'inventory_go_live',
        'type': MenuType.TRANSACTION,
        'subtype': TransactionSubType.BACKOFFICE,
        'display_name': 'System Go Live',
        'path': '/inventory/system-go-live',
        'category': 'Inventory Management',
        'description': 'Inventory system go live'
    },
    
    # Reports
    'sales_reports': {
        'menu_item_id': 'sales_reports',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'Sales Reports',
        'path': '/reports/sales',
        'category': 'Reports',
        'description': 'Sales reports'
    },
    'inventory_reports': {
        'menu_item_id': 'inventory_reports',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'Inventory Reports',
        'path': '/reports/inventory',
        'category': 'Reports',
        'description': 'Inventory reports'
    },
    'pos_reports': {
        'menu_item_id': 'pos_reports',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'POS Reports',
        'path': '/reports/pos',
        'category': 'Reports',
        'description': 'POS reports'
    },
    
    # ==================== SYSTEM ====================
    'system_settings': {
        'menu_item_id': 'system_settings',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'Settings',
        'path': '/settings',
        'category': 'System',
        'description': 'System settings'
    },
    'user_preferences': {
        'menu_item_id': 'user_preferences',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'Preferences',
        'path': '/user-preferences',
        'category': 'System',
        'description': 'User preferences'
    },
    'business_rules': {
        'menu_item_id': 'business_rules',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'Business Rules',
        'path': '/business-rules',
        'category': 'System',
        'description': 'Business rules configuration'
    },
    'settlement_settings': {
        'menu_item_id': 'settlement_settings',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'Settlement Settings',
        'path': '/settlement-settings',
        'category': 'System',
        'description': 'Settlement settings'
    },
    'pay_modes': {
        'menu_item_id': 'pay_modes',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'Pay Mode',
        'path': '/pay-modes',
        'category': 'System',
        'description': 'Payment modes configuration'
    },
    'code_settings': {
        'menu_item_id': 'code_settings',
        'type': MenuType.SYSTEM,
        'subtype': None,
        'display_name': 'Code Settings',
        'path': '/code-settings',
        'category': 'System',
        'description': 'Code settings configuration'
    },
}


def get_menu_item(menu_item_id):
    """Get menu item details by ID"""
    return MENU_ITEMS_MAPPING.get(menu_item_id)


def get_menu_items_by_type(menu_type):
    """Get all menu items of a specific type"""
    return [
        item for item in MENU_ITEMS_MAPPING.values()
        if item['type'] == menu_type
    ]


def get_menu_items_by_subtype(subtype):
    """Get all transaction menu items of a specific subtype"""
    return [
        item for item in MENU_ITEMS_MAPPING.values()
        if item['type'] == MenuType.TRANSACTION and item['subtype'] == subtype
    ]


def get_all_master_items():
    """Get all master menu items"""
    return get_menu_items_by_type(MenuType.MASTER)


def get_all_security_items():
    """Get all security menu items"""
    return get_menu_items_by_type(MenuType.SECURITY)


def get_all_transaction_items():
    """Get all transaction menu items"""
    return get_menu_items_by_type(MenuType.TRANSACTION)


def get_pos_transaction_items():
    """Get all POS transaction items"""
    return get_menu_items_by_subtype(TransactionSubType.POS)


def get_backoffice_transaction_items():
    """Get all back office transaction items"""
    return get_menu_items_by_subtype(TransactionSubType.BACKOFFICE)


def validate_menu_item_id(menu_item_id):
    """Validate if menu_item_id exists"""
    return menu_item_id in MENU_ITEMS_MAPPING


def get_menu_item_id_by_path(path):
    """Get menu_item_id by path (reverse lookup)"""
    for item_id, item_data in MENU_ITEMS_MAPPING.items():
        if item_data['path'] == path:
            return item_id
    return None

