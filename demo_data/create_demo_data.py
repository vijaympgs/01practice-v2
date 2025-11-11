#!/usr/bin/env python
"""
Non-interactive script to create demo locations and users
- Creates locations for each of the 6 location types
- Creates 5 demo users for different roles
- Assigns locations to users based on their roles
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
from django.db import transaction


def create_demo_data():
    """Create demo locations and users"""
    print("=== CREATING DEMO DATA ===")
    
    with transaction.atomic():
        # Get or create DEFCO company
        company, created = Company.objects.get_or_create(
            code='DEFCO',
            defaults={
                'name': 'Default Company',
                'description': 'Default demo company for testing',
                'address': '123 Demo Street',
                'city': 'Demo City',
                'state': 'Demo State',
                'country': 'Demo Country',
                'phone': '+1-234-567-8900',
                'email': 'info@defco.com',
                'currency': 'USD',
                'timezone': 'UTC',
            }
        )
        if created:
            print(f"+ Created company: {company.name}")
        else:
            print(f"+ Using existing company: {company.name}")
        
        # Create locations for each type
        location_data = [
            {
                'name': 'DEFCO Headquarters',
                'code': 'DEFCO_HQ',
                'location_type': 'headquarters',
                'address': '100 Corporate Plaza',
                'city': 'Business District',
                'state': 'Central State',
                'country': 'Demo Country',
                'phone': '+1-234-567-8901',
                'manager': 'John Manager',
            },
            {
                'name': 'DEFCO Main Store',
                'code': 'DEFCO_STORE1',
                'location_type': 'store',
                'address': '200 Shopping Avenue',
                'city': 'Retail District',
                'state': 'Central State',
                'country': 'Demo Country',
                'phone': '+1-234-567-8902',
                'manager': 'Sarah Store',
            },
            {
                'name': 'DEFCO Central Warehouse',
                'code': 'DEFCO_WH1',
                'location_type': 'warehouse',
                'address': '300 Industrial Park',
                'city': 'Logistics Zone',
                'state': 'Central State',
                'country': 'Demo Country',
                'phone': '+1-234-567-8903',
                'manager': 'Mike Warehouse',
            },
            {
                'name': 'DEFCO Distribution Center',
                'code': 'DEFCO_DC1',
                'location_type': 'distribution',
                'address': '400 Distribution Hub',
                'city': 'Logistics Zone',
                'state': 'Central State',
                'country': 'Demo Country',
                'phone': '+1-234-567-8904',
                'manager': 'David Distribution',
            },
            {
                'name': 'DEFCO Manufacturing Plant',
                'code': 'DEFCO_FACTORY1',
                'location_type': 'factory',
                'address': '500 Industrial Estate',
                'city': 'Manufacturing Zone',
                'state': 'Central State',
                'country': 'Demo Country',
                'phone': '+1-234-567-8905',
                'manager': 'Robert Factory',
            },
            {
                'name': 'DEFCO Premium Showroom',
                'code': 'DEFCO_SHOW1',
                'location_type': 'showroom',
                'address': '600 Showroom Street',
                'city': 'Premium District',
                'state': 'Central State',
                'country': 'Demo Country',
                'phone': '+1-234-567-8906',
                'manager': 'Lisa Showroom',
            },
        ]
        
        created_locations = {}
        for loc_data in location_data:
            location, created = Location.objects.get_or_create(
                code=loc_data['code'],
                company=company,
                defaults=loc_data
            )
            if created:
                print(f"+ Created location: {location.name} ({location.location_type})")
            else:
                print(f"+ Using existing location: {location.name} ({location.location_type})")
            created_locations[loc_data['location_type']] = location
        
        # Create demo users
        user_data = [
            {
                'username': 'admin_demo',
                'email': 'admin@defco.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'password': 'admin123',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'username': 'bomanager_demo',
                'email': 'bomanager@defco.com',
                'first_name': 'Back Office',
                'last_name': 'Manager',
                'role': 'backofficemanager',
                'password': 'bomanager123',
                'is_staff': True,
            },
            {
                'username': 'bouser_demo',
                'email': 'bouser@defco.com',
                'first_name': 'Back Office',
                'last_name': 'User',
                'role': 'backofficeuser',
                'password': 'bouser123',
            },
            {
                'username': 'posadmin_demo',
                'email': 'posadmin@defco.com',
                'first_name': 'POS',
                'last_name': 'Admin',
                'role': 'posmanager',
                'password': 'posadmin123',
            },
            {
                'username': 'posuser_demo',
                'email': 'posuser@defco.com',
                'first_name': 'POS',
                'last_name': 'User',
                'role': 'posuser',
                'password': 'posuser123',
            },
        ]
        
        created_users = {}
        for user_info in user_data:
            user, created = User.objects.get_or_create(
                username=user_info['username'],
                defaults={
                    'email': user_info['email'],
                    'first_name': user_info['first_name'],
                    'last_name': user_info['last_name'],
                    'role': user_info['role'],
                    'is_staff': user_info.get('is_staff', False),
                    'is_superuser': user_info.get('is_superuser', False),
                }
            )
            
            if created:
                user.set_password(user_info['password'])
                user.save()
                print(f"+ Created user: {user.username} ({user.role})")
            else:
                print(f"+ Using existing user: {user.username} ({user.role})")
            
            created_users[user_info['role']] = user
        
        # Assign locations to users based on their roles
        print("\n=== ASSIGNING LOCATIONS TO USERS ===")
        
        # Admin: Access to all locations (back_office access)
        admin_user = created_users['admin']
        for loc_type, location in created_locations.items():
            mapping, created = UserLocationMapping.objects.get_or_create(
                user=admin_user,
                location=location,
                access_type='back_office',
                defaults={
                    'is_active': True,
                    'is_default': loc_type == 'headquarters',
                }
            )
            if created:
                print(f"+ Admin -> {location.name} (back_office)")
        
        # Back Office Manager: Access to all locations except headquarters (back_office access)
        bomanager_user = created_users['backofficemanager']
        for loc_type, location in created_locations.items():
            if loc_type != 'headquarters':
                mapping, created = UserLocationMapping.objects.get_or_create(
                    user=bomanager_user,
                    location=location,
                    access_type='back_office',
                    defaults={
                        'is_active': True,
                        'is_default': loc_type == 'store',
                    }
                )
                if created:
                    print(f"+ BO Manager -> {location.name} (back_office)")
        
        # Back Office User: Access to all locations except headquarters (back_office access)
        bouser_user = created_users['backofficeuser']
        for loc_type, location in created_locations.items():
            if loc_type != 'headquarters':
                mapping, created = UserLocationMapping.objects.get_or_create(
                    user=bouser_user,
                    location=location,
                    access_type='back_office',
                    defaults={
                        'is_active': True,
                        'is_default': loc_type == 'store',
                    }
                )
                if created:
                    print(f"+ BO User -> {location.name} (back_office)")
        
        # POS Admin: Access to all store locations (both POS and back_office access)
        posadmin_user = created_users['posmanager']
        for loc_type, location in created_locations.items():
            if loc_type in ['store', 'showroom']:
                mapping, created = UserLocationMapping.objects.get_or_create(
                    user=posadmin_user,
                    location=location,
                    access_type='both',
                    defaults={
                        'is_active': True,
                        'is_default': loc_type == 'store',
                    }
                )
                if created:
                    print(f"+ POS Admin -> {location.name} (both)")
        
        # POS User: Access to one store location only (POS access)
        posuser_user = created_users['posuser']
        store_location = created_locations['store']
        posuser_user.pos_location = store_location
        posuser_user.save()
        
        mapping, created = UserLocationMapping.objects.get_or_create(
            user=posuser_user,
            location=store_location,
            access_type='pos',
            defaults={
                'is_active': True,
                'is_default': True,
            }
        )
        if created:
            print(f"+ POS User -> {store_location.name} (pos)")
        
        print(f"\n+ Demo data setup complete!")
        print(f"\n=== LOGIN CREDENTIALS ===")
        for user_info in user_data:
            print(f"{user_info['username']}: {user_info['password']}")
        
        return created_locations, created_users


if __name__ == '__main__':
    print("DEMO DATA SETUP SCRIPT (NON-INTERACTIVE)")
    print("=" * 50)
    
    create_demo_data()
