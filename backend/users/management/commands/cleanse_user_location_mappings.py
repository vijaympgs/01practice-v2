from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from organization.models import Location
from users.models import UserLocationMapping

User = get_user_model()


class Command(BaseCommand):
    help = 'Cleanse User Location Mapping data and create clean set based on user roles'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted/created without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))
        
        # Step 1: Delete existing mappings
        existing_mappings = UserLocationMapping.objects.all()
        existing_count = existing_mappings.count()
        
        if dry_run:
            self.stdout.write(f'Would delete {existing_count} existing user-location mappings')
        else:
            existing_mappings.delete()
            self.stdout.write(self.style.SUCCESS(f'Deleted {existing_count} existing user-location mappings'))
        
        # Step 2: Get all active locations
        active_locations = Location.objects.filter(is_active=True)
        self.stdout.write(f'Found {active_locations.count()} active locations')
        
        # Step 3: Create new mappings based on user roles
        users = User.objects.all()
        created_count = 0
        
        for user in users:
            locations_for_user = self.get_locations_for_user(user, active_locations)
            locations_list = list(locations_for_user)  # Convert QuerySet to list
            
            for idx, location in enumerate(locations_list):
                access_type = self.get_access_type_for_user(user)
                
                if dry_run:
                    self.stdout.write(f'Would create mapping: {user.username} -> {location.name} ({access_type})')
                    created_count += 1
                else:
                    mapping, created = UserLocationMapping.objects.get_or_create(
                        user=user,
                        location=location,
                        access_type=access_type,
                        defaults={
                            'is_active': True,
                            'is_default': idx == 0,  # First location is default
                            'created_by': None,  # System created
                        }
                    )
                    if created:
                        created_count += 1
                        self.stdout.write(f'Created mapping: {user.username} -> {location.name} ({access_type})')
        
        # Summary
        if dry_run:
            self.stdout.write(self.style.WARNING(f'DRY RUN: Would create {created_count} new mappings'))
        else:
            self.stdout.write(self.style.SUCCESS(f'SUCCESS: Created {created_count} new user-location mappings'))
        
        self.stdout.write(self.style.SUCCESS('User Location Mapping cleansing completed!'))

    def get_locations_for_user(self, user, active_locations):
        """Get locations accessible to user based on their role"""
        if user.role == 'admin':
            # Admin: All locations
            return active_locations
        elif user.role == 'backofficemanager':
            # BO Admin: All locations except headquarters
            return active_locations.exclude(location_type='headquarters')
        elif user.role == 'posmanager':
            # POS Admin: All POS locations (stores only)
            return active_locations.filter(location_type='store')
        elif user.role == 'backofficeuser':
            # BO User: All locations except headquarters
            return active_locations.exclude(location_type='headquarters')
        elif user.role == 'posuser':
            # POS User: Only first store (simplified for now)
            return active_locations.filter(location_type='store')[:1]
        else:
            # Default: No locations
            return Location.objects.none()

    def get_access_type_for_user(self, user):
        """Get access type for user based on their role"""
        if user.role == 'admin':
            return 'both'
        elif user.role == 'backofficemanager':
            return 'back_office'
        elif user.role == 'posmanager':
            return 'both'
        elif user.role == 'backofficeuser':
            return 'back_office'
        elif user.role == 'posuser':
            return 'pos'
        else:
            return 'back_office'  # Default
