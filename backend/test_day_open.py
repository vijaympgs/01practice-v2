#!/usr/bin/env python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login/', json={'username': 'admin', 'password': 'admin123'})
token = response.json()['access']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Test active day open again
response = requests.get('http://localhost:8000/api/day-opens/active/', headers=headers)
print('Active Day Open Status:', response.status_code)
if response.status_code == 200:
    print('SUCCESS: Active day open found')
    print('Response:', response.json())
else:
    print('Response:', response.text)
