#!/usr/bin/env python
import os
import django
import json
import requests

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Test login with requests
url = 'http://localhost:8000/api/auth/login/'
data = {
    'username': 'admin',
    'password': 'admin123'
}

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

print('Testing login with data:', json.dumps(data, indent=2))
print('Headers:', headers)

try:
    response = requests.post(url, json=data, headers=headers)
    print('Status Code:', response.status_code)
    print('Response Headers:', dict(response.headers))
    print('Response Body:', response.text)
    
    if response.status_code == 200:
        print('SUCCESS: Login worked!')
        response_data = response.json()
        if 'access' in response_data:
            print('Access token:', response_data['access'][:50] + '...')
        if 'refresh' in response_data:
            print('Refresh token:', response_data['refresh'][:50] + '...')
        if 'user' in response_data:
            print('User info:', response_data['user'])
    else:
        print('FAILED: Login failed')
        
except Exception as e:
    print('ERROR:', str(e))
