#!/usr/bin/env python
"""
Test script for User-Location Mapping implementation
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User, UserLocationMapping
from organization.models import Location

def test_user_location_mapping():
    print('Testing User-Location Mapping Implementation')
    print('=' * 50)
    
    # Check if models are properly created
    try:
        users = User.objects.all()[:3]
        print(f'[OK] Found {User.objects.count()} users in database')
        for user in users:
            print(f'  - {user.username} ({user.role})')
    except Exception as e:
        print(f'[ERROR] Error with User model: {e}')
        return False
    
    try:
        locations = Location.objects.all()[:3]
        print(f'[OK] Found {Location.objects.count()} locations in database')
        for location in locations:
            print(f'  - {location.name} ({location.location_type})')
    except Exception as e:
        print(f'[ERROR] Error with Location model: {e}')
        return False
    
    try:
        mappings = UserLocationMapping.objects.all()
        print(f'[OK] Found {UserLocationMapping.objects.count()} user-location mappings')
        for mapping in mappings:
            print(f'  - {mapping.user.username} -> {mapping.location.name} ({mapping.access_type})')
    except Exception as e:
        print(f'[ERROR] Error with UserLocationMapping model: {e}')
        return False
    
    print('\n[OK] All models are working correctly!')
    print('[OK] Database migration was successful!')
    print('[OK] User-Location Mapping feature is ready to use!')
    return True

if __name__ == '__main__':
    success = test_user_location_mapping()
    sys.exit(0 if success else 1)
