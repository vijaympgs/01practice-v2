#!/usr/bin/env python
"""
Test script to check menu visibility API response
"""

import os
import sys
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

django.setup()

from users.views import MenuVisibilityView
from django.test import RequestFactory
from users.models import User

def test_menu_visibility_api():
    """Test the menu visibility API endpoint"""
    
    print("=== Menu Visibility API Test ===")
    
    # Create a mock request
    factory = RequestFactory()
    request = factory.get('/users/menu-visibility/')
    
    # Get first user
    user = User.objects.first()
    if not user:
        print("No users found in database")
        return
    
    request.user = user
    print(f"Testing as user: {user.username} (role: {user.role})")
    
    # Test the menu visibility endpoint
    view = MenuVisibilityView()
    response = view.get(request)
    data = response.data
    
    print(f"\n=== API Response Summary ===")
    print(f"Total categories: {len(data['categories'])}")
    print(f"Active items: {data['statistics']['active_items']}")
    print(f"Inactive items: {data['statistics']['inactive_items']}")
    
    print(f"\n=== Categories and Items ===")
    for category, items in data['categories'].items():
        print(f'\n{category} ({len(items)} items):')
        for item in items:
            status = "ACTIVE" if item['is_active'] else "INACTIVE"
            print(f'  [{status}] {item["display_name"]} ({item["menu_item_id"]})')
    
    # Check for inactive items that should be filtered out
    inactive_items_found = []
    for category, items in data['categories'].items():
        for item in items:
            if not item['is_active']:
                inactive_items_found.append(f"{category} -> {item['display_name']}")
    
    if inactive_items_found:
        print(f"\n⚠️  PROBLEM: Found {len(inactive_items_found)} inactive items in API response!")
        for item in inactive_items_found:
            print(f"  - {item}")
        print("\nThis API should only return ACTIVE items!")
    else:
        print(f"\n✅ GOOD: API only returns active items")
    
    return data

if __name__ == '__main__':
    test_menu_visibility_api()
