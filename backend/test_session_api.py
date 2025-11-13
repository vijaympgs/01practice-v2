#!/usr/bin/env python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login/', json={'username': 'admin', 'password': 'admin123'})
token = response.json()['access']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Test session API
response = requests.get('http://localhost:8000/api/pos-sessions/', headers=headers, params={'status': 'open', 'page_size': 1})
print('Session API Status:', response.status_code)
if response.status_code == 200:
    data = response.json()
    sessions = data.get('results', [])
    print(f'Active sessions found: {len(sessions)}')
    if sessions:
        print('First session:', sessions[0])
    else:
        print('No active sessions')
else:
    print('Error:', response.text)
