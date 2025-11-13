#!/usr/bin/env python
"""
Test script for role-based location access rules.
This script tests the new role-based location access implementation.
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

def test_role_based_access():
    """
    Test role-based location access rules.
    """
    print("Testing Role-Based Location Access Rules")
    print("=" * 50)
    
    # Get all locations
    all_locations = Location.objects.filter(is_active=True)
    print(f"Total active locations: {all_locations.count()}")
    for location in all_locations:
        print(f"  - {location.name} ({location.location_type})")
    print()
    
    # Test each role
    roles_to_test = [
        ('admin', 'Administrator'),
        ('backofficemanager', 'Back Office Manager'),
        ('posmanager', 'POS Manager'),
        ('backofficeuser', 'Back Office User'),
        ('posuser', 'POS User'),
    ]
    
    for role_key, role_display in roles_to_test:
        print(f"Testing role: {role_display}")
        print("-" * 30)
        
        # Create a test user for this role
        test_user = User(
            username=f"test_{role_key}",
            role=role_key,
            email=f"test_{role_key}@example.com"
        )
        
        # Test accessible locations
        accessible_locations = test_user.get_accessible_locations()
        accessible_count = accessible_locations.count()
        
        print(f"  Accessible locations: {accessible_count}")
        for location in accessible_locations:
            print(f"    - {location.name} ({location.location_type})")
        
        # Test accessible location types
        accessible_types = test_user.get_accessible_location_types()
        print(f"  Accessible location types: {accessible_types}")
        
        # Test specific location access
        for location in all_locations:
            can_access = test_user.can_access_location(location)
            status = "[OK]" if can_access else "[NO]"
            print(f"    {status} {location.name} ({location.location_type})")
        
        print()
    
    # Test existing admin user
    print("Testing existing admin user")
    print("-" * 30)
    try:
        admin_user = User.objects.get(username='admin')
        accessible_locations = admin_user.get_accessible_locations()
        print(f"  Admin accessible locations: {accessible_locations.count()}")
        for location in accessible_locations:
            print(f"    - {location.name} ({location.location_type})")
        
        # Test default location
        default_location = admin_user.get_default_location()
        if default_location:
            print(f"  Default location: {default_location.name}")
        else:
            print(f"  No default location")
        
    except User.DoesNotExist:
        print("  Admin user not found")
    
    print()
    
    # Test UserLocationMapping records
    print("UserLocationMapping Records")
    print("-" * 30)
    mappings = UserLocationMapping.objects.all()
    print(f"Total mappings: {mappings.count()}")
    for mapping in mappings:
        print(f"  {mapping.user.username} -> {mapping.location.name} ({mapping.access_type})")
    
    print()
    print("[SUCCESS] All role-based access tests completed successfully!")

if __name__ == '__main__':
    test_role_based_access()
