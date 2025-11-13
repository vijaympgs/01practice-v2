#!/usr/bin/env python
"""
Simple test script for Django Admin Menu Controller
Tests the menu visibility API endpoints and functionality
"""

import os
import sys
import django
import json
import requests
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

django.setup()

from django.contrib.auth import get_user_model
from users.models import MenuItemType, UserPermission, GroupPermission
from django.contrib.auth.models import Group

User = get_user_model()

# Configuration
BASE_URL = 'http://127.0.0.1:8000'
API_BASE_URL = f'{BASE_URL}/api'

def get_auth_token():
    """Get authentication token for testing"""
    try:
        response = requests.post(f'{API_BASE_URL}/auth/login/', json={
            'username': 'admin',
            'password': 'admin123'
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get('access', data.get('access_token', ''))
        else:
            print(f"Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_menu_items_endpoint(token):
    """Test menu items API endpoint"""
    print("\nTesting Menu Items API Endpoint...")
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f'{API_BASE_URL}/users/menu-items/', headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Menu Items API working!")
            print(f"   - Total items: {data.get('total_items', 0)}")
            print(f"   - Active items: {data.get('active_items', 0)}")
            print(f"   - Inactive items: {data.get('inactive_items', 0)}")
            print(f"   - Categories: {list(data.get('categories', {}).keys())}")
            return True
        else:
            print(f"FAILED: Menu Items API failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"ERROR: Menu Items API error: {e}")
        return False

def test_menu_visibility_endpoint(token):
    """Test menu visibility API endpoint"""
    print("\nTesting Menu Visibility API Endpoint...")
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f'{API_BASE_URL}/users/menu-visibility/', headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Menu Visibility API working!")
            print(f"   - Total items: {data.get('statistics', {}).get('total_items', 0)}")
            print(f"   - Active items: {data.get('statistics', {}).get('active_items', 0)}")
            print(f"   - Active percentage: {data.get('statistics', {}).get('active_percentage', 0)}%")
            print(f"   - Categories: {list(data.get('categories', {}).keys())}")
            return True
        else:
            print(f"FAILED: Menu Visibility API failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"ERROR: Menu Visibility API error: {e}")
        return False

def test_user_menu_permissions_endpoint(token):
    """Test user menu permissions API endpoint"""
    print("\nTesting User Menu Permissions API Endpoint...")
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f'{API_BASE_URL}/users/menu-permissions/', headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: User Menu Permissions API working!")
            print(f"   - User role: {data.get('user_role', 'unknown')}")
            print(f"   - Total permissions: {data.get('total_permissions', 0)}")
            print(f"   - Active menu items: {len(data.get('active_menu_items', []))}")
            print(f"   - Last updated: {data.get('timestamp', 'unknown')}")
            return True
        else:
            print(f"FAILED: User Menu Permissions API failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"ERROR: User Menu Permissions API error: {e}")
        return False

def test_database_models():
    """Test database models directly"""
    print("\nTesting Database Models...")
    
    try:
        # Test MenuItemType model
        menu_items = MenuItemType.objects.all()
        print(f"SUCCESS: MenuItemType model working!")
        print(f"   - Total menu items in DB: {menu_items.count()}")
        print(f"   - Active items: {menu_items.filter(is_active=True).count()}")
        
        # Test UserPermission model
        user_permissions = UserPermission.objects.all()
        print(f"SUCCESS: UserPermission model working!")
        print(f"   - Total user permissions: {user_permissions.count()}")
        
        # Test GroupPermission model
        group_permissions = GroupPermission.objects.all()
        print(f"SUCCESS: GroupPermission model working!")
        print(f"   - Total group permissions: {group_permissions.count()}")
        
        return True
    except Exception as e:
        print(f"ERROR: Database models error: {e}")
        return False

def test_django_admin_setup():
    """Test Django admin setup"""
    print("\nTesting Django Admin Setup...")
    
    try:
        # Check if admin user exists
        admin_user = User.objects.filter(username='admin').first()
        if admin_user:
            print(f"SUCCESS: Admin user found: {admin_user.username}")
            print(f"   - Role: {admin_user.role}")
            print(f"   - Is staff: {admin_user.is_staff}")
            print(f"   - Is superuser: {admin_user.is_superuser}")
        else:
            print(f"FAILED: Admin user not found")
            return False
        
        # Check if groups exist
        groups = Group.objects.all()
        print(f"SUCCESS: Groups found: {groups.count()}")
        for group in groups:
            print(f"   - {group.name}")
        
        return True
    except Exception as e:
        print(f"ERROR: Django admin setup error: {e}")
        return False

def test_menu_visibility_update(token):
    """Test menu visibility update functionality"""
    print("\nTesting Menu Visibility Update...")
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        
        # Test bulk activation
        data = {'activate_all': True}
        response = requests.post(f'{API_BASE_URL}/users/menu-visibility/', headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"SUCCESS: Menu visibility update working!")
            print(f"   - Updated items: {result.get('updated_count', 0)}")
            print(f"   - Message: {result.get('message', '')}")
            return True
        else:
            print(f"FAILED: Menu visibility update failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"ERROR: Menu visibility update error: {e}")
        return False

def main():
    """Main test function"""
    print("Django Admin Menu Controller Test Suite")
    print("=" * 50)
    print(f"Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"API Base URL: {API_BASE_URL}")
    print("=" * 50)
    
    # Test results
    results = []
    
    # Test 1: Database Models
    results.append(test_database_models())
    
    # Test 2: Django Admin Setup
    results.append(test_django_admin_setup())
    
    # Test 3: Get Authentication Token
    print("\nGetting Authentication Token...")
    token = get_auth_token()
    if token:
        print(f"SUCCESS: Authentication successful!")
        results.append(True)
        
        # Test 4: Menu Items API
        results.append(test_menu_items_endpoint(token))
        
        # Test 5: Menu Visibility API
        results.append(test_menu_visibility_endpoint(token))
        
        # Test 6: User Menu Permissions API
        results.append(test_user_menu_permissions_endpoint(token))
        
        # Test 7: Menu Visibility Update
        results.append(test_menu_visibility_update(token))
        
    else:
        print(f"FAILED: Authentication failed!")
        results.append(False)
    
    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(results)
    total = len(results)
    
    print(f"PASSED: {passed}/{total}")
    print(f"FAILED: {total - passed}/{total}")
    
    if passed == total:
        print("ALL TESTS PASSED! Django Admin Menu Controller is working correctly.")
    else:
        print("Some tests failed. Please check the implementation.")
    
    print("=" * 50)
    
    return passed == total

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
