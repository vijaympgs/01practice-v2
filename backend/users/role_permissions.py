"""
Role Permission Templates

Defines default permissions for each role based on business requirements.

Role Hierarchy:
1. Superuser: No restrictions, can perform all roles
2. Administrator: User & Permission, Settings, Business Preferences, Master Data Management, Item Management, Organization Setup
3. POS Manager: Terminal Setup, Day Open, Day End, POS Preferences, Authorization for Critical POS Operations
4. POS User: POS Billing, Add New masters on-the-fly from transaction
5. Back Office Manager: Discounts, Approvals (PO draft to PO Approve/Reject, etc.)
6. Back Office User: All back office screens

Permissions:
- can_view: Can view/access the page
- can_create: Can create new records
- can_edit: Can edit existing records
- can_delete: Can delete records
"""

# Menu items by category for easy reference
MASTER_DATA_MENUS = [
    'master_configuration',
    'master_general',
    'master_uom_setup',
    'master_uom_conversion',
    'master_customers',
    'master_vendors',
]

ITEM_MANAGEMENT_MENUS = [
    'item_master',
    'item_attributes',
    'item_attribute_values',
]

ORGANIZATION_SETUP_MENUS = [
    'organization',
    'item_tax_setup',
]

SECURITY_MENUS = [
    'user_permissions',
]

SYSTEM_SETTINGS_MENUS = [
    'system_settings',
    'business_rules',
    'user_preferences',
    'settlement_settings',
    'pay_modes',
    'code_settings',
]

POS_CRITICAL_OPERATIONS = [
    'pos_settlement',  # Settlement approval
    'pos_billing',     # Bill/Line level discount authorization
]

POS_MANAGER_MENUS = [
    'pos_terminal_configuration',  # Terminal Setup
    'pos_shift_management',        # Day Open equivalent
    'pos_day_end',                 # Day End
    'pos_session_management',
    'pos_advanced_settlement',
] + POS_CRITICAL_OPERATIONS

POS_USER_MENUS = [
    'pos_billing',  # POS Billing only
    # On-the-fly creation handled via can_create permission on masters
]

BACKOFFICE_MANAGER_MENUS = [
    'procurement_purchase_request',
    'procurement_purchase_enquiry',
    'procurement_purchase_quotation',
    'procurement_purchase_order',
    'procurement_goods_received',
    'procurement_purchase_invoice',
    'procurement_purchase_return',
    'procurement_advice',
    # Discounts and Approvals handled via can_edit permission
]

BACKOFFICE_USER_MENUS = [
    # All back office screens (Sales, Procurement, Stock Nexus, Inventory, Reports)
    'sales_management',
    'sales_order_management',
    'customer_management',
    'procurement_purchase_request',
    'procurement_purchase_enquiry',
    'procurement_purchase_quotation',
    'procurement_purchase_order',
    'procurement_goods_received',
    'procurement_purchase_invoice',
    'procurement_purchase_return',
    'procurement_advice',
    'stock_nexus_initial_setup',
    'stock_nexus_movement_tracking',
    'stock_nexus_transfer_confirm',
    'stock_nexus_count_adjust',
    'inventory_management',
    'inventory_go_live',
    'sales_reports',
    'inventory_reports',
    'pos_reports',
]

# Role Permission Templates
ROLE_PERMISSION_TEMPLATES = {
    'admin': {
        'display_name': 'Administrator',
        'description': 'Full access to all menu items across Master Data Management, Organization Setup, Item Management, Point of Sale, Inventory Management, Procurement, Stock Nexus, Sales, Reports, and System',
        'menu_items': {
            # Security
            'user_permissions': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== SYSTEM ====================
            'system_settings': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'business_rules': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'user_preferences': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'settlement_settings': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pay_modes': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'code_settings': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== MASTER DATA MANAGEMENT ====================
            'master_configuration': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'master_general': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'master_uom_setup': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'master_uom_conversion': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'master_customers': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'master_vendors': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== ORGANIZATION SETUP ====================
            'organization': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'item_tax_setup': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== ITEM MANAGEMENT ====================
            'item_master': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'item_attributes': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'item_attribute_values': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== POINT OF SALE ====================
            'pos_terminal_configuration': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_shift_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_session_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_billing': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_settlement': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_day_end': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_terminal': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_receivables': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_advanced_settlement': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_advanced_receivables': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_delivery': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_advanced_delivery': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_advanced_terminal': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_advanced_day_end': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_code_master': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_sessions': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_terminal_setup': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== INVENTORY MANAGEMENT ====================
            'inventory_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'inventory_go_live': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== PROCUREMENT ====================
            'procurement_purchase_request': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_enquiry': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_quotation': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_order': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_goods_received': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_invoice': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_return': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_advice': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== STOCK NEXUS ====================
            'stock_nexus_initial_setup': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'stock_nexus_movement_tracking': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'stock_nexus_transfer_confirm': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'stock_nexus_count_adjust': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== SALES ====================
            'sales_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'sales_order_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'customer_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== REPORTS ====================
            'sales_reports': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'inventory_reports': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_reports': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
        }
    },
    
    'posmanager': {
        'display_name': 'POS Manager',
        'description': 'Full POS management: Terminal Configuration, Shift Management, Day End, Billing, Settlement, and master data access',
        'menu_items': {
            # Masters (for POS operations)
            'master_customers': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'item_master': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'item_attributes': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},
            'item_attribute_values': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'pay_modes': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # POS Configuration (Full Access)
            'pos_terminal_configuration': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_shift_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},  # Day Open
            'pos_day_end': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # POS Operations (Full Access)
            'pos_billing': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'pos_settlement': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
        }
    },
    
    'posuser': {
        'display_name': 'POS User',
        'description': 'POS Billing, Settlement, Day End, Terminal Configuration, Shift Management, and on-the-fly master creation',
        'menu_items': {
            # Masters (on-the-fly creation)
            'master_customers': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'item_master': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'item_attributes': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},
            'item_attribute_values': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'pay_modes': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},
            
            # POS Configuration (View Only)
            'pos_terminal_configuration': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},
            'pos_shift_management': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},  # Day Open
            
            # POS Operations
            'pos_billing': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'pos_settlement': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'pos_day_end': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},
        }
    },
    
    'backofficemanager': {
        'display_name': 'Back Office Manager',
        'description': 'Full access to Master Data, Organization Setup, Item Management, and full CRUD on Inventory, Procurement, Stock Nexus, and Sales',
        'menu_items': {
            # ==================== MASTER DATA MANAGEMENT (All screens: A, C, V) ====================
            'master_configuration': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'master_general': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'master_uom_setup': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'master_uom_conversion': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'master_customers': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'master_vendors': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            
            # ==================== ORGANIZATION SETUP (All screens: A, V) ====================
            'organization': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},
            'item_tax_setup': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},
            
            # ==================== ITEM MANAGEMENT (All screens: A, C, V) ====================
            'item_master': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'item_attributes': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'item_attribute_values': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            
            # ==================== INVENTORY MANAGEMENT (All screens: A, C, V, E, D) ====================
            'inventory_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'inventory_go_live': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== PROCUREMENT (All screens: A, C, V, E, D) ====================
            'procurement_purchase_request': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_enquiry': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_quotation': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_order': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_goods_received': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_invoice': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_purchase_return': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'procurement_advice': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== STOCK NEXUS (All screens: A, C, V, E, D) ====================
            'stock_nexus_initial_setup': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'stock_nexus_movement_tracking': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'stock_nexus_transfer_confirm': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'stock_nexus_count_adjust': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            
            # ==================== SALES (All screens: A, C, V, E, D) ====================
            'sales_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'sales_order_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
            'customer_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True},
        }
    },
    
    'backofficeuser': {
        'display_name': 'Back Office User',
        'description': 'Back office operations with create/view access and limited edit on Inventory, Procurement, Stock Nexus, and Sales',
        'menu_items': {
            # ==================== MASTERS (Specific items) ====================
            'master_customers': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'master_vendors': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'item_master': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            'item_attributes': {'can_access': True, 'can_view': True, 'can_create': False, 'can_edit': False, 'can_delete': False},
            'item_attribute_values': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': False, 'can_delete': False},
            
            # ==================== INVENTORY MANAGEMENT (All screens: A, C, V, E) ====================
            'inventory_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'inventory_go_live': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            
            # ==================== PROCUREMENT (All screens: A, C, V, E) ====================
            'procurement_purchase_request': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'procurement_purchase_enquiry': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'procurement_purchase_quotation': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'procurement_purchase_order': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'procurement_goods_received': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'procurement_purchase_invoice': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'procurement_purchase_return': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'procurement_advice': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            
            # ==================== STOCK NEXUS (All screens: A, C, V, E) ====================
            'stock_nexus_initial_setup': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'stock_nexus_movement_tracking': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'stock_nexus_transfer_confirm': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'stock_nexus_count_adjust': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            
            # ==================== SALES (All screens: A, C, V, E) ====================
            'sales_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'sales_order_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
            'customer_management': {'can_access': True, 'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': False},
        }
    },
}


def get_role_permissions(role):
    """Get permission template for a role"""
    return ROLE_PERMISSION_TEMPLATES.get(role, {})


def apply_role_template_to_user(user, role_template=None):
    """
    Apply role template permissions to a user.
    
    Args:
        user: User instance
        role_template: Optional specific role template to apply. If None, uses user's role.
    
    Returns:
        dict: Permissions { menu_item_id: { can_view, can_create, can_edit, can_delete } }
    """
    # Use provided template or user's current role
    role_to_use = role_template or user.role
    
    template = get_role_permissions(role_to_use)
    if not template:
        return {}
    
    permissions = {}
    for menu_item_id, perms in template.get('menu_items', {}).items():
        permissions[menu_item_id] = perms.copy()
    
    return permissions


def check_superuser_bypass(user):
    """Check if user is superuser (no restrictions)"""
    return user.is_superuser

