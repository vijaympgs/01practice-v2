#!/usr/bin/env python
"""
Create menu items for Django Admin Menu Controller
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

django.setup()

from users.models import MenuItemType

def create_menu_items():
    """Create initial menu items"""
    
    menu_items = [
        {
            'display_name': 'Dashboard',
            'menu_item_id': 'dashboard',
            'menu_type': 'DASHBOARD',
            'transaction_subtype': None,
            'category': 'Home',
            'path': '/',
            'description': 'Main dashboard and overview',
            'is_active': True,
            'order': 10,
        },
        {
            'display_name': 'Role Permissions',
            'menu_item_id': 'user_permissions',
            'menu_type': 'SECURITY',
            'transaction_subtype': None,
            'category': 'User & Permissions',
            'path': '/user-permissions',
            'description': 'Manage user roles and permissions',
            'is_active': True,
            'order': 10,
        },
        {
            'display_name': 'Terminal Configuration',
            'menu_item_id': 'pos_terminal_configuration',
            'menu_type': 'TRANSACTION',
            'transaction_subtype': 'POS',
            'category': 'Point of Sale',
            'path': '/pos/terminal-configuration',
            'description': 'Configure POS terminals',
            'is_active': True,
            'order': 10,
        },
        {
            'display_name': 'Day Management Console',
            'menu_item_id': 'pos_day_management_console',
            'menu_type': 'TRANSACTION',
            'transaction_subtype': 'POS',
            'category': 'Point of Sale',
            'path': '/pos/day-management-console',
            'description': 'Day management console for POS operations',
            'is_active': True,
            'order': 20,
        },
        {
            'display_name': 'POS Billing',
            'menu_item_id': 'pos_billing',
            'menu_type': 'TRANSACTION',
            'transaction_subtype': 'POS',
            'category': 'Point of Sale',
            'path': '/pos/desktop',
            'description': 'POS billing and sales operations',
            'is_active': True,
            'order': 50,
        },
        {
            'display_name': 'Admin Tools',
            'menu_item_id': 'admin_tools',
            'menu_type': 'SYSTEM',
            'transaction_subtype': None,
            'category': 'System',
            'path': '/settings/admin-tools',
            'description': 'System administration tools',
            'is_active': True,
            'order': 10,
        },
    ]

    # Clear existing menu items and create new ones
    MenuItemType.objects.all().delete()
    
    for item_data in menu_items:
        MenuItemType.objects.create(**item_data)

    print(f'Created {MenuItemType.objects.count()} menu items')
    print(f'Active items: {MenuItemType.objects.filter(is_active=True).count()}')
    
    # Display created items
    for item in MenuItemType.objects.all():
        print(f'  - {item.display_name} ({item.menu_item_id}) - Active: {item.is_active}')

if __name__ == '__main__':
    create_menu_items()
