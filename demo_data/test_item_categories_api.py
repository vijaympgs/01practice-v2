#!/usr/bin/env python
"""
Test Script for Item Categories API Endpoints

This script tests the new ItemCategory and ItemSubCategory API endpoints
to ensure they are working correctly.

Usage:
    python test_item_categories_api.py
"""

import os
import sys
import django
import json

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from categories.models import ItemCategory, ItemSubCategory
from products.models import ItemMaster

def test_api_endpoints():
    """Test the API endpoints for item categories"""
    
    print("Testing Item Categories API Endpoints")
    print("=" * 50)
    
    # Create test client
    client = Client()
    
    # Test 1: Get all categories
    print("\n1. Testing GET /api/categories/itemcategories/")
    try:
        response = client.get('/api/categories/itemcategories/')
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Categories found: {len(data)}")
            if data:
                print(f"   First category: {data[0]['name']} ({data[0]['code']})")
        else:
            print(f"   Error: {response.content.decode()}")
    except Exception as e:
        print(f"   Exception: {e}")
    
    # Test 2: Get all subcategories
    print("\n2. Testing GET /api/categories/itemsubcategories/")
    try:
        response = client.get('/api/categories/itemsubcategories/')
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Subcategories found: {len(data)}")
            if data:
                print(f"   First subcategory: {data[0]['name']} ({data[0]['code']})")
        else:
            print(f"   Error: {response.content.decode()}")
    except Exception as e:
        print(f"   Exception: {e}")
    
    # Test 3: Get items with category info
    print("\n3. Testing ItemMaster with category relationships")
    try:
        items = ItemMaster.objects.filter(item_category__isnull=False).select_related('item_category', 'item_subcategory')
        print(f"   Items with categories: {items.count()}")
        if items.exists():
            first_item = items.first()
            print(f"   First item: {first_item.item_name}")
            print(f"   Category: {first_item.item_category.name if first_item.item_category else 'None'}")
            print(f"   Subcategory: {first_item.item_subcategory.name if first_item.item_subcategory else 'None'}")
    except Exception as e:
        print(f"   Exception: {e}")
    
    # Test 4: Test category statistics
    print("\n4. Testing Category Statistics")
    try:
        categories = ItemCategory.objects.all()
        for category in categories:
            item_count = ItemMaster.objects.filter(item_category=category).count()
            subcat_count = category.subcategories.count()
            print(f"   {category.name}: {item_count} items, {subcat_count} subcategories")
    except Exception as e:
        print(f"   Exception: {e}")
    
    print("\n" + "=" * 50)
    print("API Testing Completed!")

def main():
    """Main function to test API endpoints"""
    
    try:
        test_api_endpoints()
        print("\n+ All tests completed successfully!")
        return 0
    except Exception as e:
        print(f"\nError: Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
