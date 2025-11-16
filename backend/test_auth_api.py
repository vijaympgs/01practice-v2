#!/usr/bin/env python
import os
import sys
import django
import requests
import json

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print('=== Testing API Authentication ===')

# Test login
login_data = {
    'username': 'admin',
    'password': 'admin123'
}

try:
    print('Testing login...')
    response = requests.post('http://localhost:8000/api/auth/login/', json=login_data)
    print(f'Login status: {response.status_code}')
    
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get('access')
        print(f'Got access token: {access_token[:20]}...' if access_token else 'No access token')
        
        # Test locations API with token
        if access_token:
            print('\nTesting locations API with authentication...')
            headers = {'Authorization': f'Bearer {access_token}'}
            
            # Test the exact API call the frontend makes
            params = {'location_type': 'store', 'is_active': True}
            response = requests.get('http://localhost:8000/api/organization/locations/', 
                                 headers=headers, params=params)
            
            print(f'Locations API status: {response.status_code}')
            
            if response.status_code == 200:
                locations_data = response.json()
                print(f'Success! Got {len(locations_data)} locations')
                for loc in locations_data[:2]:
                    print(f'  - {loc.get("name", "N/A")} ({loc.get("code", "N/A")})')
            else:
                print(f'Error: {response.text}')
    else:
        print(f'Login failed: {response.text}')
        
except requests.exceptions.ConnectionError:
    print('Error: Could not connect to backend server. Make sure it\'s running on localhost:8000')
except Exception as e:
    print(f'Error: {e}')

print('\n=== Test Complete ===')
