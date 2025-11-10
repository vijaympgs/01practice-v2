#!/usr/bin/env python
import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
users = User.objects.all()
print('Total users:', users.count())
for user in users:
    print(f'User: {user.username}, Role: {user.role}, Active: {user.is_active}')

# Create a test user if no users exist
if users.count() == 0:
    print('Creating test user...')
    user = User.objects.create_user(
        username='admin',
        email='admin@example.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        role='admin',
        is_staff=True,
        is_superuser=True
    )
    print(f'Created test user: {user.username}')
else:
    # Update existing user to have known password
    user = users.first()
    user.set_password('admin123')
    user.role = 'admin'
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f'Updated user {user.username} with known password')
