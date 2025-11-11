import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("Checking users in database...")
print(f"Total users: {User.objects.count()}")

if User.objects.exists():
    print("\nUser list:")
    for user in User.objects.all()[:10]:
        print(f"  Username: {user.username}")
        print(f"  Email: {user.email}")
        print(f"  Active: {user.is_active}")
        print(f"  Staff: {user.is_staff}")
        print(f"  Superuser: {user.is_superuser}")
        print("---")
else:
    print("No users found in database!")
    print("\nCreating a test user...")
    
    # Create a test user
    test_user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User',
        is_active=True
    )
    
    print(f"Created test user: {test_user.username}")
    print(f"Login credentials:")
    print(f"  Username: testuser")
    print(f"  Password: testpass123")
