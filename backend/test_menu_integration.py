#!/usr/bin/env python
"""
Test script to verify the menu integration fix
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

def test_menu_integration():
    """Test the complete menu integration"""
    
    print("=== Menu Integration Test ===")
    
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
    
    print(f"\n=== Backend API Response ===")
    print(f"Status Code: {response.status_code}")
    print(f"Total Categories: {len(data['categories'])}")
    print(f"Active Items: {data['statistics']['active_items']}")
    print(f"Inactive Items: {data['statistics']['inactive_items']}")
    
    # Show categories that should be visible
    print(f"\n=== Visible Categories (should appear in frontend) ===")
    for category, items in data['categories'].items():
        print(f'✅ {category} ({len(items)} items)')
        for item in items:
            print(f'   - {item["display_name"]}')
    
    # Check for categories that should be hidden
    from users.models import MenuItemType
    all_categories = MenuItemType.objects.values_list('category', flat=True).distinct()
    active_categories = set(data['categories'].keys())
    hidden_categories = set(all_categories) - active_categories
    
    if hidden_categories:
        print(f"\n=== Hidden Categories (should NOT appear in frontend) ===")
        for category in hidden_categories:
            count = MenuItemType.objects.filter(category=category, is_active=False).count()
            print(f'❌ {category} ({count} inactive items)')
    
    # Simulate frontend conversion
    print(f"\n=== Frontend Conversion Simulation ===")
    
    # Convert API response to frontend format (similar to what the frontend does)
    categories = []
    if data.categories and isinstance(data.categories, dict):
        for category_title, items in data.categories.items():
            category = {
                'title': category_title,
                'items': []
            }
            
            for item in items:
                frontend_item = {
                    'text': item['display_name'],
                    'path': item['path'],
                    'moduleName': item['menu_item_id'],
                    'is_active': item['is_active']
                }
                category['items'].append(frontend_item)
            
            categories.append(category)
    
    print(f"Frontend will receive {len(categories)} categories:")
    total_frontend_items = 0
    for category in categories:
        print(f"  - {category['title']}: {len(category['items'])} items")
        total_frontend_items += len(category['items'])
    
    print(f"Total frontend menu items: {total_frontend_items}")
    
    # Verify the fix
    expected_active_items = data['statistics']['active_items']
    if total_frontend_items == expected_active_items:
        print(f"\n✅ SUCCESS: Frontend receives correct number of active items ({total_frontend_items})")
        print("✅ The on/off switch should now work properly!")
    else:
        print(f"\n❌ PROBLEM: Frontend receives {total_frontend_items} items but expected {expected_active_items}")
    
    return data

if __name__ == '__main__':
    test_menu_integration()
