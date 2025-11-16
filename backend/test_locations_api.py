#!/usr/bin/env python
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from organization.models import Location, Company
from django.contrib.auth import get_user_model

User = get_user_model()

print('=== Testing Location API Data ===')

# Check companies
companies = Company.objects.all()
print(f'Total companies: {companies.count()}')
for company in companies:
    print(f'  - {company.name} ({company.code}) - Active: {company.is_active}')

# Check locations
locations = Location.objects.all()
print(f'\nTotal locations: {locations.count()}')
for location in locations:
    print(f'  - {location.name} ({location.code}) - {location.location_type} - Active: {location.is_active} - Company: {location.company.name}')

# Check store locations specifically
store_locations = Location.objects.filter(location_type='store', is_active=True)
print(f'\nActive store locations: {store_locations.count()}')
for location in store_locations:
    print(f'  - {location.name} ({location.code}) - Company: {location.company.name}')

# Check admin user
try:
    admin_user = User.objects.get(username='admin')
    print(f'\nAdmin user found: {admin_user.username} - Role: {admin_user.role} - Is Superuser: {admin_user.is_superuser}')
    if hasattr(admin_user, 'pos_location') and admin_user.pos_location:
        print(f'  Assigned location: {admin_user.pos_location.name}')
    else:
        print('  No assigned location')
except User.DoesNotExist:
    print('\nAdmin user not found!')

print('\n=== Test Complete ===')
