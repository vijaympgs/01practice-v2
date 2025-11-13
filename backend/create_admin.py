#!/usr/bin/env python
"""
Create admin user for the system
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

django.setup()

from django.contrib.auth import get_user_model

def create_admin_user():
    """Create admin user if it doesn't exist"""
    User = get_user_model()
    
    # Check if admin user exists
    admin_user = User.objects.filter(username='admin').first()
    if admin_user:
        print(f'[OK] Admin user already exists: {admin_user.username}')
        print(f'   Email: {admin_user.email}')
        print(f'   Active: {admin_user.is_active}')
        print(f'   Staff: {admin_user.is_staff}')
        print(f'   Superuser: {admin_user.is_superuser}')
        return admin_user
    
    # Create admin user
    print('[CREATING] Admin user...')
    admin_user = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123'
    )
    
    print(f'[SUCCESS] Created admin user: {admin_user.username}')
    print(f'   Email: {admin_user.email}')
    print(f'   Active: {admin_user.is_active}')
    print(f'   Staff: {admin_user.is_staff}')
    print(f'   Superuser: {admin_user.is_superuser}')
    
    return admin_user

if __name__ == '__main__':
    create_admin_user()
    
    # List all users
    User = get_user_model()
    print('\n[USERS] All users in system:')
    for user in User.objects.all():
        print(f'  - {user.username} - {user.email}')
        print(f'    Active: {user.is_active}, Staff: {user.is_staff}, Superuser: {user.is_superuser}')
