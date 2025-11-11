#!/usr/bin/env python
import os
import django
import json
import requests

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# First, login to get token
login_url = 'http://localhost:8000/api/auth/login/'
login_data = {
    'username': 'admin',
    'password': 'admin123'
}

print('=== Logging in ===')
response = requests.post(login_url, json=login_data)
if response.status_code != 200:
    print('Login failed:', response.text)
    exit(1)

login_response = response.json()
access_token = login_response['access']
print('Login successful!')

# Test the failing endpoints
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

endpoints_to_test = [
    ('GET', '/api/auth/pos-functions/', 'POS Functions'),
    ('GET', '/api/pos-sessions/current/', 'Current POS Session'),
    ('GET', '/api/day-opens/active/', 'Active Day Open'),
    ('POST', '/api/day-opens/open/', 'Open Day'),
]

print('\n=== Testing API Endpoints ===')

for method, endpoint, name in endpoints_to_test:
    url = f'http://localhost:8000{endpoint}'
    print(f'\n--- Testing {name} ({method} {endpoint}) ---')
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json={})
        
        print(f'Status Code: {response.status_code}')
        
        if response.status_code == 200:
            print('SUCCESS')
            data = response.json()
            if isinstance(data, list):
                print(f'Response: {len(data)} items')
            elif isinstance(data, dict):
                print(f'Response keys: {list(data.keys())}')
            else:
                print(f'Response: {str(data)[:100]}...')
        else:
            print('FAILED')
            print(f'Response: {response.text}')
            
    except Exception as e:
        print(f'ERROR: {str(e)}')

print('\n=== API Testing Complete ===')
