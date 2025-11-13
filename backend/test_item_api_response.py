#!/usr/bin/env python
"""
Test script to check Item Master API response structure
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import ItemMaster
from products.serializers import ItemMasterListSerializer

def test_api_response():
    """Test the Item Master API response structure"""
    
    print("Testing Item Master API Response...")
    print("=" * 50)
    
    # Get a sample item to check the API response
    items = ItemMaster.objects.all()[:3]
    serializer = ItemMasterListSerializer(items, many=True)
    
    print("Sample API Response:")
    for item_data in serializer.data:
        print(f"  {item_data}")
    print()
    
    # Check specific fields in the model
    print("Database Field Values:")
    for item in items:
        print(f"Item: {item.item_code}")
        print(f"  item_category: {item.item_category}")
        print(f"  item_category_id: {item.item_category_id}")
        print(f"  item_subcategory: {item.item_subcategory}")
        print(f"  item_subcategory_id: {item.item_subcategory_id}")
        print()
    
    # Check Electronics category items
    electronics_items = ItemMaster.objects.filter(item_category__name='Electronics')
    print(f"Electronics items in database: {electronics_items.count()}")
    for item in electronics_items[:3]:
        print(f"  - {item.item_code}: {item.item_name} (Category ID: {item.item_category_id})")
    print()
    
    # Check categories
    from categories.models import ItemCategory
    categories = ItemCategory.objects.all()
    print("Available Categories:")
    for cat in categories:
        print(f"  - {cat.name} (ID: {cat.id})")

if __name__ == "__main__":
    test_api_response()
