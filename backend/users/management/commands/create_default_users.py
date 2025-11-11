"""
Django management command to create default users
Run: python manage.py create_default_users

Creates:
- admin/admin (Superuser) - No role restrictions, can perform all roles
- boadmin/boadmin (Back Office Manager) - Back office administration and management
- bouser/bouser (Back Office User) - Back office operations and data entry
- posadmin/posadmin (POS Manager) - Terminal Setup, Day Open, Day End, POS Preferences, Authorization for Critical POS Operations
- posuser/posuser (POS User) - POS Billing, Add New masters on-the-fly from transaction
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates default users: Admin, Back Office Admin, Back Office User, POS Admin, and POS User'

    def handle(self, *args, **options):
        users_to_create = [
            {
                'username': 'admin',
                'password': 'admin',
                'email': 'admin@flowretail.com',
                'first_name': 'System',
                'last_name': 'Administrator',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            },
            {
                'username': 'boadmin',
                'password': 'boadmin',
                'email': 'boadmin@flowretail.com',
                'first_name': 'Back Office',
                'last_name': 'Administrator',
                'role': 'backofficemanager',
                'is_staff': True,
                'is_superuser': False,
                'is_active': True,
            },
            {
                'username': 'bouser',
                'password': 'bouser',
                'email': 'bouser@flowretail.com',
                'first_name': 'Back Office',
                'last_name': 'User',
                'role': 'backofficeuser',
                'is_staff': False,
                'is_superuser': False,
                'is_active': True,
            },
            {
                'username': 'posadmin',
                'password': 'posadmin',
                'email': 'posadmin@flowretail.com',
                'first_name': 'POS',
                'last_name': 'Administrator',
                'role': 'posmanager',
                'is_staff': True,
                'is_superuser': False,
                'is_active': True,
            },
            {
                'username': 'posuser',
                'password': 'posuser',
                'email': 'posuser@flowretail.com',
                'first_name': 'POS',
                'last_name': 'User',
                'role': 'posuser',
                'is_staff': False,
                'is_superuser': False,
                'is_active': True,
            },
        ]

        created_count = 0
        updated_count = 0

        for user_data in users_to_create:
            username = user_data.pop('username')
            password = user_data.pop('password')

            user, created = User.objects.get_or_create(
                username=username,
                defaults=user_data
            )

            if created:
                user.set_password(password)
                user.save()
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created user: {username}')
                )
            else:
                # Update existing user
                for key, value in user_data.items():
                    setattr(user, key, value)
                user.set_password(password)
                user.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated user: {username}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nCompleted: {created_count} created, {updated_count} updated'
            )
        )

