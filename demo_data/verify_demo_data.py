#!/usr/bin/env python
"""
Verify demo data was created correctly
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from organization.models import Company, Location
from users.models import User, UserLocationMapping

print('=== FINAL VERIFICATION ===')
print(f'Companies: {Company.objects.count()}')
print(f'Locations: {Location.objects.count()}')
print(f'Users: {User.objects.count()}')
print(f'User-Location Mappings: {UserLocationMapping.objects.count()}')

print('\n=== LOCATIONS BY TYPE ===')
for loc_type, _ in Location.LOCATION_TYPE_CHOICES:
    count = Location.objects.filter(location_type=loc_type).count()
    print(f'{loc_type}: {count}')

print('\n=== USERS BY ROLE ===')
for role, _ in User.ROLE_CHOICES:
    count = User.objects.filter(role=role).count()
    print(f'{role}: {count}')

print('\n=== SAMPLE USER-LOCATION MAPPINGS ===')
mappings = UserLocationMapping.objects.all()[:10]
for mapping in mappings:
    print(f'{mapping.user.username} -> {mapping.location.name} ({mapping.access_type})')

print('\n=== LOGIN CREDENTIALS ===')
demo_users = ['admin_demo', 'bomanager_demo', 'bouser_demo', 'posadmin_demo', 'posuser_demo']
for username in demo_users:
    try:
        user = User.objects.get(username=username)
        print(f'{username}: (role: {user.role})')
    except User.DoesNotExist:
        print(f'{username}: NOT FOUND')
