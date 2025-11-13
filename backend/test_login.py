import os
import sys
import django
import requests

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def test_login():
    """Test login functionality"""
    
    print("Testing Login Functionality")
    print("=" * 40)
    
    # Check users
    admin_user = User.objects.filter(username='admin').first()
    if admin_user:
        print(f"Admin user found: {admin_user.username}")
        print(f"Email: {admin_user.email}")
        print(f"Active: {admin_user.is_active}")
        print(f"Staff: {admin_user.is_staff}")
        print(f"Superuser: {admin_user.is_superuser}")
    else:
        print("Admin user not found!")
        return
    
    # Test login API
    print("\nTesting login API...")
    
    login_url = "http://localhost:8000/api/auth/login/"
    
    # Test with different password combinations
    test_passwords = ["admin123", "admin", "password", "123456"]
    
    for password in test_passwords:
        print(f"\nTrying password: {password}")
        
        try:
            response = requests.post(
                login_url,
                json={
                    "username": "admin",
                    "password": password
                },
                headers={
                    "Content-Type": "application/json"
                },
                timeout=5
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                print("✅ LOGIN SUCCESSFUL!")
                data = response.json()
                if 'access' in data:
                    print(f"Access token: {data['access'][:50]}...")
                if 'user' in data:
                    print(f"User info: {data['user']}")
                return True
            elif response.status_code == 400:
                print("❌ Bad Request - Invalid credentials or format")
            else:
                print(f"❌ Error: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Connection Error - Backend server may not be running")
            return False
        except requests.exceptions.Timeout:
            print("❌ Timeout Error")
            return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    print("\n❌ All password attempts failed")
    print("You may need to reset the admin password")
    
    # Option to reset password
    reset = input("\nReset admin password to 'admin123'? (y/n): ")
    if reset.lower() == 'y':
        admin_user.set_password('admin123')
        admin_user.save()
        print("✅ Password reset to 'admin123'")
        print("Try logging in again")
    
    return False

if __name__ == '__main__':
    test_login()
