#!/usr/bin/env python
"""
Data migration script to sync existing users with role-based location mappings.
This script creates UserLocationMapping records for existing users based on their roles.
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

def migrate_existing_users():
    """
    Migrate existing users to use the new role-based location mapping system.
    """
    print("Starting migration of existing users to role-based location mappings...")
    print("=" * 60)
    
    users = User.objects.all()
    total_users = users.count()
    migrated_count = 0
    error_count = 0
    
    print(f"Found {total_users} users to migrate")
    print()
    
    for user in users:
        try:
            print(f"Migrating user: {user.username} (Role: {user.role})")
            
            # Get accessible locations based on role
            accessible_locations = user.get_accessible_locations()
            accessible_count = accessible_locations.count()
            
            print(f"  - Accessible locations: {accessible_count}")
            
            if accessible_count == 0:
                print(f"  - WARNING: No accessible locations for this user!")
                error_count += 1
                continue
            
            # Remove existing mappings that are no longer accessible
            UserLocationMapping.objects.filter(user=user).exclude(
                location__in=accessible_locations
            ).delete()
            
            created_count = 0
            updated_count = 0
            
            # Create or update mappings for accessible locations
            for location in accessible_locations:
                # Determine access type based on role and location type
                if user.role == 'posuser':
                    access_type = 'pos'
                elif user.role in ['backofficemanager', 'backofficeuser']:
                    access_type = 'back_office'
                elif user.role == 'posmanager':
                    access_type = 'both'  # POS managers can access both POS and back office
                elif user.role == 'admin':
                    access_type = 'both'  # Admins can access both
                else:
                    access_type = 'back_office'
                
                # For POS users, only create one mapping (first location)
                if user.role == 'posuser':
                    existing_mapping = UserLocationMapping.objects.filter(
                        user=user,
                        access_type__in=['pos', 'both']
                    ).first()
                    
                    if existing_mapping:
                        if existing_mapping.location_id != location.id:
                            existing_mapping.location = location
                            existing_mapping.save()
                            updated_count += 1
                            print(f"    - Updated POS mapping to: {location.name}")
                        else:
                            print(f"    - POS mapping already exists: {location.name}")
                    else:
                        UserLocationMapping.objects.create(
                            user=user,
                            location=location,
                            access_type=access_type,
                            is_default=True,
                            created_by=None  # System migration
                        )
                        created_count += 1
                        print(f"    - Created POS mapping: {location.name}")
                        break  # Only one location for POS users
                else:
                    # For other roles, create mapping for each accessible location
                    mapping, created = UserLocationMapping.objects.get_or_create(
                        user=user,
                        location=location,
                        access_type=access_type,
                        defaults={
                            'is_active': True,
                            'is_default': False,
                            'created_by': None,  # System migration
                        }
                    )
                    
                    if created:
                        created_count += 1
                        print(f"    - Created mapping: {location.name} ({access_type})")
                    else:
                        updated_count += 1
                        print(f"    - Mapping exists: {location.name} ({access_type})")
            
            print(f"  - Created: {created_count}, Updated: {updated_count}")
            migrated_count += 1
            
        except Exception as e:
            print(f"  - ERROR: {str(e)}")
            error_count += 1
        
        print()
    
    print("=" * 60)
    print(f"Migration Summary:")
    print(f"  Total users: {total_users}")
    print(f"  Successfully migrated: {migrated_count}")
    print(f"  Errors: {error_count}")
    print()
    
    # Show final statistics
    total_mappings = UserLocationMapping.objects.count()
    print(f"Total UserLocationMapping records: {total_mappings}")
    
    # Show breakdown by role
    print("\nMappings by role:")
    for role_choice, role_display in User.ROLE_CHOICES:
        role_mappings = UserLocationMapping.objects.filter(user__role=role_choice).count()
        print(f"  {role_display}: {role_mappings}")
    
    print("\nMigration completed successfully!")

if __name__ == '__main__':
    migrate_existing_users()
