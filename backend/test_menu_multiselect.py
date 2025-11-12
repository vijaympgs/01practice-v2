#!/usr/bin/env python
"""
Test script to verify the multiselect functionality for is_active field in Django admin
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import TestCase
from django.contrib.auth import get_user_model
from users.models import MenuItemType

User = get_user_model()

def test_multiselect_functionality():
    """Test the multiselect functionality for is_active field"""
    
    print("Testing Multiselect Functionality for is_active Field")
    print("=" * 50)
    
    # Check if MenuItemType model exists
    try:
        menu_items = MenuItemType.objects.all()
        print(f"[OK] MenuItemType model found with {menu_items.count()} items")
    except Exception as e:
        print(f"[ERROR] Error accessing MenuItemType model: {e}")
        return False
    
    # Test creating a new menu item
    print("\n1. Testing menu item creation...")
    try:
        test_item = MenuItemType.objects.create(
            menu_item_id='test_multiselect_001',
            display_name='Test Multiselect Item',
            menu_type='MASTER',
            category='Test Category',
            path='/test-multiselect',
            description='Test item for multiselect functionality',
            is_active=True,
            order=999
        )
        print(f"[OK] Created test menu item: {test_item.display_name} (is_active={test_item.is_active})")
    except Exception as e:
        print(f"[ERROR] Error creating test menu item: {e}")
        return False
    
    # Test updating is_active field
    print("\n2. Testing is_active field update...")
    try:
        test_item.is_active = False
        test_item.save()
        print(f"[OK] Updated is_active to False: {test_item.is_active}")
        
        test_item.is_active = True
        test_item.save()
        print(f"[OK] Updated is_active to True: {test_item.is_active}")
    except Exception as e:
        print(f"[ERROR] Error updating is_active field: {e}")
        return False
    
    # Test admin form field
    print("\n3. Testing admin form field configuration...")
    try:
        from users.admin import MenuControllerAdmin
        admin_instance = MenuControllerAdmin(MenuItemType, None)
        
        # Test formfield_for_dbfield method
        from django.db import models
        is_active_field = MenuItemType._meta.get_field('is_active')
        
        # Mock request object
        class MockRequest:
            pass
        
        form_field = admin_instance.formfield_for_dbfield(is_active_field, MockRequest())
        
        if form_field:
            print(f"[OK] Form field created successfully: {type(form_field).__name__}")
            print(f"   - Widget: {type(form_field.widget).__name__}")
            print(f"   - Choices: {getattr(form_field, 'choices', 'N/A')}")
            
            # Test the prepare_value method
            test_true = form_field.prepare_value(True)
            test_false = form_field.prepare_value(False)
            print(f"   - prepare_value(True): {test_true}")
            print(f"   - prepare_value(False): {test_false}")
            
            # Test the clean method
            clean_true = form_field.clean(['active'])
            clean_false = form_field.clean(['inactive'])
            clean_both = form_field.clean(['active', 'inactive'])
            clean_none = form_field.clean([])
            print(f"   - clean(['active']): {clean_true}")
            print(f"   - clean(['inactive']): {clean_false}")
            print(f"   - clean(['active', 'inactive']): {clean_both}")
            print(f"   - clean([]): {clean_none}")
            
        else:
            print("[ERROR] Form field creation failed")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error testing admin form field: {e}")
        return False
    
    # Clean up test data
    print("\n4. Cleaning up test data...")
    try:
        test_item.delete()
        print("[OK] Test menu item deleted successfully")
    except Exception as e:
        print(f"[ERROR] Error deleting test menu item: {e}")
    
    print("\n" + "=" * 50)
    print("[OK] Multiselect functionality test completed successfully!")
    print("\nNext steps:")
    print("1. Start Django development server: python manage.py runserver")
    print("2. Go to Django admin: http://localhost:8000/admin/")
    print("3. Navigate to Menu Controller (MenuItemType)")
    print("4. Edit any menu item to see the multiselect is_active field")
    print("5. The is_active field should now show checkboxes for 'Active' and 'Inactive'")
    
    return True

if __name__ == '__main__':
    test_multiselect_functionality()
