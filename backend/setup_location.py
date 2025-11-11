#!/usr/bin/env python
import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from organization.models import Location, Company

User = get_user_model()

print('=== Setting up Location for User ===')

# Get the admin user
try:
    admin_user = User.objects.get(username='admin')
    print(f'Found user: {admin_user.username} (ID: {admin_user.id})')
except User.DoesNotExist:
    print('Admin user not found!')
    exit(1)

# Check if user already has a location
if admin_user.pos_location:
    print(f'User already has location: {admin_user.pos_location.name}')
else:
    print('User has no location assigned')

# Create or get a default company first
company, created = Company.objects.get_or_create(
    code='DEFCO',
    defaults={
        'name': 'Default Company',
        'description': 'Default company for testing',
        'address': '456 Company Ave',
        'city': 'Corporate City',
        'state': 'Business State',
        'country': 'Corporate Country',
        'postal_code': '54321',
        'phone': '+1987654321',
        'email': 'company@example.com',
        'currency': 'USD',
        'timezone': 'UTC',
        'is_active': True,
        'created_by': admin_user,
    }
)

if created:
    print(f'Created new company: {company.name}')
else:
    print(f'Using existing company: {company.name}')

# Create or get a default location
location, created = Location.objects.get_or_create(
    code='STORE001',
    defaults={
        'name': 'Main Store',
        'company': company,
        'location_type': 'store',
        'address': '123 Main Street',
        'city': 'Test City',
        'state': 'Test State',
        'country': 'Test Country',
        'postal_code': '12345',
        'phone': '+1234567890',
        'email': 'store@example.com',
        'is_active': True,
        'created_by': admin_user,
    }
)

if created:
    print(f'Created new location: {location.name}')
else:
    print(f'Using existing location: {location.name}')

# Assign location to user
admin_user.pos_location = location
admin_user.save()

print(f'Assigned location "{location.name}" to user "{admin_user.username}"')
print('Setup complete!')
