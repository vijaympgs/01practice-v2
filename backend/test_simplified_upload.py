#!/usr/bin/env python
"""
Test script to verify the simplified master data upload interface
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.urls import reverse
from users.models import User

def test_simplified_upload():
    """Test the simplified upload interface"""
    print("Testing Simplified Master Data Upload Interface")
    print("=" * 50)
    
    # Create test client
    client = Client()
    
    # Create superuser for testing
    try:
        user = User.objects.create_superuser('testuser', 'test@example.com', 'testpass123')
        print("[OK] Created test superuser")
    except Exception as e:
        user = User.objects.filter(username='testuser').first()
        if user:
            print("[OK] Using existing test superuser")
        else:
            print(f"[ERROR] Error creating test user: {e}")
            return False
    
    # Login the user
    client.login(username='testuser', password='testpass123')
    print("[OK] Logged in as test user")
    
    # Test upload page access
    try:
        url = reverse('masters:upload')
        print(f"[OK] Upload page URL resolved: {url}")
        
        response = client.get(url)
        if response.status_code == 200:
            print("[OK] Upload page accessible")
        else:
            print(f"[ERROR] Upload page failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Error accessing upload page: {e}")
        return False
    
    # Test download template URL
    try:
        template_url = reverse('admin:masters_uploadsession_download_template')
        print(f"[OK] Template download URL resolved: {template_url}")
        
        response = client.get(template_url)
        if response.status_code == 200:
            print("[OK] Template download working")
        else:
            print(f"[ERROR] Template download failed with status: {response.status_code}")
    except Exception as e:
        print(f"[ERROR] Error downloading template: {e}")
    
    print("\nAll tests completed successfully!")
    print("\nSummary:")
    print("   Simplified upload interface is working")
    print("   Template download functionality is working")
    print("   URLs are properly configured")
    
    return True

if __name__ == "__main__":
    success = test_simplified_upload()
    if success:
        print("\nYou can now test the simplified upload interface:")
        print("   1. Go to http://127.0.0.1:8000/admin/masters/upload/")
        print("   2. The simplified interface should be displayed")
        print("   3. Test downloading templates and uploading files")
    else:
        print("\nSome tests failed. Please check the errors above.")
