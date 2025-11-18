#!/usr/bin/env python
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from users.views import MenuVisibilityView
from django.test import RequestFactory
from users.models import User

def test_icon_mapping():
    """Test icon mapping from backend to frontend"""
    
    print('=== ICON MAPPING TEST ===')
    
    # Get backend data
    factory = RequestFactory()
    request = factory.get('/users/menu-visibility/')
    request.user = User.objects.first()
    view = MenuVisibilityView()
    response = view.get(request)
    data = response.data
    
    # Simulate frontend icon mapping
    iconMap = {
        # Dashboard
        'dashboard': 'Dashboard',
        
        # Point of Sale
        'pos_terminal_configuration': 'Computer',
        'pos_day_management_console': 'Event',
        'pos_day_open': 'PlayArrow',
        'pos_session_open': 'PlayArrow',
        'pos_billing': 'PointOfSale',
        'pos_settlement': 'Receipt',
        'pos_session_close': 'Stop',
        'pos_day_end': 'Event',
        
        # Inventory Management
        'inventory_management': 'Inventory',
        'inventory_go_live': 'Storage',
        
        # Item Management
        'item_master': 'Inventory',
        'item_attributes': 'Settings',
        'item_attribute_values': 'Assignment',
        
        # Master Data
        'master_configuration': 'Category',
        'master_general': 'Assignment',
        'master_uom_setup': 'Category',
        'master_uom_conversion': 'TrendingUp',
        'master_customers': 'People',
        'master_vendors': 'Business',
        
        # Procurement
        'procurement_purchase_request': 'ShoppingCart',
        'procurement_purchase_enquiry': 'Search',
        'procurement_purchase_quotation': 'RequestQuote',
        'procurement_purchase_order': 'ShoppingCartCheckout',
        'procurement_goods_received': 'LocalShipping',
        'procurement_purchase_invoice': 'Receipt',
        'procurement_purchase_return': 'AssignmentReturn',
        'procurement_advice': 'Lightbulb',
        
        # Reports
        'sales_reports': 'Analytics',
        'inventory_reports': 'Assessment',
        'pos_reports': 'ReportsIcon',
        
        # System
        'admin_tools': 'AdminPanelSettings',
        'system_settings': 'DatabaseIcon',
        'layout_preferences': 'ViewQuilt',
        'digital_marketing_console': 'Language',
        'web_console': 'Code',
        'html_preview_tool': 'Preview',
        'database_client': 'CodeIcon',
        'wireframe_index': 'Launch',
        'business_rules': 'Assignment',
        'business_rules_general': 'Settings',
    }
    
    # Category fallback icons
    categoryIcons = {
        'Home': 'Dashboard',
        'Point of Sale': 'PointOfSale',
        'Inventory Management': 'Inventory',
        'Item': 'Category',
        'Master Data Management': 'Assignment',
        'Procurement': 'LocalShipping',
        'Reports': 'Assessment',
        'System': 'Settings'
    }
    
    print('Backend menu items and their mapped icons:')
    all_icon_mappings = []
    
    for category_title, items in data['categories'].items():
        print(f'\n{category_title}:')
        for item in items:
            # Try to find icon by menu_item_id first
            icon_name = iconMap.get(item['menu_item_id'])
            
            # Fallback to category-based icons
            if not icon_name:
                icon_name = categoryIcons.get(item['category'], 'Category')
            
            print(f'  {item["display_name"]} ({item["menu_item_id"]}) -> {icon_name}')
            all_icon_mappings.append(icon_name)
    
    # Check for unique icon names
    unique_icons = list(set(all_icon_mappings))
    print(f'\nTotal unique icon names used: {len(unique_icons)}')
    print('Icon names:', unique_icons)
    
    # Check Sidebar iconComponents mapping (from the code I saw)
    sidebar_icon_components = {
        'Dashboard', 'People', 'Settings', 'Category', 'Inventory', 'ShoppingCart',
        'PointOfSale', 'Business', 'Assignment', 'Assessment', 'Storage', 'Receipt',
        'Analytics', 'LocalShipping', 'TrendingUp', 'AccessTime', 'AccountBalance',
        'Event', 'Code', 'ShoppingCartCheckout', 'Description', 'AdminPanelSettings',
        'Archive', 'CheckCircle', 'Close', 'Keyboard', 'Public', 'Launch',
        'SettingsApplications', 'Computer', 'TerminalConfiguration', 'DayOpen',
        'SessionClose', 'PlayArrow', 'Stop', 'PurchaseQuotation', 'RequestQuote',
        'InitialSetup', 'SettingsSuggest', 'ViewQuilt', 'Web', 'Preview',
        'DatabaseIcon', 'CodeIcon', 'SettingsIcon', 'LayoutPreferences',
        'DayManagementConsole', 'SalesOrder'
    }
    
    print(f'\nSidebar has {len(sidebar_icon_components)} icon components mapped')
    
    # Find missing icons
    missing_icons = []
    for icon_name in unique_icons:
        if icon_name not in sidebar_icon_components:
            missing_icons.append(icon_name)
    
    if missing_icons:
        print(f'❌ MISSING ICONS: {missing_icons}')
        print('These icons are generated by menuService but not mapped in Sidebar!')
    else:
        print('✅ All icons are properly mapped in Sidebar')
    
    return len(missing_icons) == 0

if __name__ == '__main__':
    test_icon_mapping()
