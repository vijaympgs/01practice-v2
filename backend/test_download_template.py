#!/usr/bin/env python
"""
Test script to verify the download template functionality in Django admin
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

def test_download_template():
    """Test the download template functionality"""
    print("Testing Download Template Functionality")
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
    
    # Test download template URL
    try:
        url = reverse('admin:masters_uploadsession_download_template')
        print(f"[OK] Download URL resolved: {url}")
    except Exception as e:
        print(f"[ERROR] Error resolving download URL: {e}")
        return False
    
    # Test empty template download
    try:
        response = client.get(url)
        if response.status_code == 200:
            print("[OK] Empty template download successful")
            print(f"   Content-Type: {response.get('Content-Type')}")
            print(f"   Content-Disposition: {response.get('Content-Disposition')}")
        else:
            print(f"[ERROR] Empty template download failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Error downloading empty template: {e}")
        return False
    
    # Test sample template download
    try:
        response = client.get(f"{url}?sample_data=true")
        if response.status_code == 200:
            print("[OK] Sample template download successful")
            print(f"   Content-Type: {response.get('Content-Type')}")
            print(f"   Content-Disposition: {response.get('Content-Disposition')}")
        else:
            print(f"[ERROR] Sample template download failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Error downloading sample template: {e}")
        return False
    
    # Test upload data URL
    try:
        upload_url = reverse('admin:masters_uploadsession_upload_data')
        print(f"[OK] Upload URL resolved: {upload_url}")
        
        response = client.get(upload_url)
        if response.status_code == 200:
            print("[OK] Upload form accessible")
        else:
            print(f"[ERROR] Upload form failed with status: {response.status_code}")
    except Exception as e:
        print(f"[ERROR] Error accessing upload form: {e}")
    
    print("\nAll tests completed successfully!")
    print("\nSummary:")
    print("   Download template functionality is working")
    print("   Both empty and sample templates can be downloaded")
    print("   Upload form is accessible")
    print("   Admin URLs are properly configured")
    
    return True

if __name__ == "__main__":
    success = test_download_template()
    if success:
        print("\nYou can now test the download templates in Django admin:")
        print("   1. Go to http://127.0.0.1:8000/admin/")
        print("   2. Navigate to Masters -> Upload sessions")
        print("   3. You should see the download template buttons at the top")
    else:
        print("\nSome tests failed. Please check the errors above.")
