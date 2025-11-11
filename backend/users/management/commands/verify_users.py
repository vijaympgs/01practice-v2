"""
Django management command to verify users and their status
Run: python manage.py verify_users
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Verify users and their login credentials'

    def handle(self, *args, **options):
        users = User.objects.all()
        
        self.stdout.write(self.style.SUCCESS(f'\nTotal users: {users.count()}\n'))
        
        for user in users:
            self.stdout.write(f'Username: {user.username}')
            self.stdout.write(f'  Role: {user.role}')
            self.stdout.write(f'  Active: {user.is_active}')
            self.stdout.write(f'  Staff: {user.is_staff}')
            self.stdout.write(f'  Superuser: {user.is_superuser}')
            self.stdout.write(f'  Email: {user.email}')
            
            # Test password
            test_passwords = {
                'admin': 'admin',
                'boadmin': 'boadmin',
                'bouser': 'bouser',
                'posadmin': 'posadmin',
                'posuser': 'posuser',
            }
            
            if user.username in test_passwords:
                password = test_passwords[user.username]
                if user.check_password(password):
                    self.stdout.write(self.style.SUCCESS('  [PASS] Password check: PASSED'))
                else:
                    self.stdout.write(self.style.ERROR('  [FAIL] Password check: FAILED'))
            
            # Check role validity
            valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
            if user.role not in valid_roles:
                self.stdout.write(self.style.ERROR(f'  [FAIL] Invalid role: {user.role} (not in {valid_roles})'))
            else:
                self.stdout.write(self.style.SUCCESS('  [PASS] Role is valid'))
            
            if not user.is_active:
                self.stdout.write(self.style.WARNING('  [WARN] User is INACTIVE - cannot login'))
            
            self.stdout.write('')

