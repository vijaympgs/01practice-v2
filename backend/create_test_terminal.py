#!/usr/bin/env python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login/', json={'username': 'admin', 'password': 'admin123'})
token = response.json()['access']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Create a test terminal
terminal_data = {
    'name': 'Main Counter Terminal',
    'terminal_code': 'TERM001',
    'location': 'ae57acf2-66af-4f58-b4de-e396b5a62719',  # Main Store location ID
    'is_active': True,
    'system_name': 'PC-MAIN-COUNTER'
}

response = requests.post('http://localhost:8000/api/pos-masters/terminals/', headers=headers, json=terminal_data)
print('Create Terminal Status:', response.status_code)
if response.status_code == 201:
    print('SUCCESS: Terminal created')
    print('Terminal:', response.json())
else:
    print('Response:', response.text)
