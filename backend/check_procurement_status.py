#!/usr/bin/env python
"""
Check the status of procurement menu items in the database
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import MenuItemType

def check_procurement_status():
    """Check the status of procurement menu items"""
    
    print("Checking Procurement Menu Items Status")
    print("=" * 50)
    
    # Get all procurement menu items
    procurement_items = MenuItemType.objects.filter(category='Procurement')
    
    print(f"Total procurement menu items: {procurement_items.count()}")
    print()
    
    for item in procurement_items:
        print(f"Menu Item: {item.display_name}")
        print(f"  - Menu Item ID: {item.menu_item_id}")
        print(f"  - Is Active: {item.is_active}")
        print(f"  - Path: {item.path}")
        print(f"  - Order: {item.order}")
        print("---")
    
    # Check active vs inactive counts
    active_count = procurement_items.filter(is_active=True).count()
    inactive_count = procurement_items.filter(is_active=False).count()
    
    print(f"\nSummary:")
    print(f"  - Active: {active_count}")
    print(f"  - Inactive: {inactive_count}")
    
    # Check if frontend is using static menu structure
    print(f"\nFrontend Integration Check:")
    print(f"  - Backend API should filter out inactive items")
    print(f"  - Frontend menuService.js has: if (!item.is_active) return;")
    print(f"  - If frontend still shows items, it might be using static menu structure")
    
    return procurement_items

if __name__ == '__main__':
    check_procurement_status()
