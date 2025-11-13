#!/usr/bin/env python
"""
Comprehensive test script for Day Management Console API endpoints
Tests all the backend APIs that the Day Management Console depends on
"""
import requests
import json
from datetime import datetime

BASE_URL = 'http://localhost:8000/api'

def login():
    """Login and get auth token"""
    print("🔐 Logging in...")
    response = requests.post(f'{BASE_URL}/auth/login/', json={
        'username': 'admin', 
        'password': 'admin123'
    })
    
    if response.status_code == 200:
        token = response.json()['access']
        headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
        print("✅ Login successful")
        return headers
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def test_day_open_api(headers):
    """Test Day Open API endpoints"""
    print("\n📅 Testing Day Open API...")
    
    # Test active day open
    response = requests.get(f'{BASE_URL}/day-opens/active/', headers=headers)
    print(f"Active Day Open Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Active day open found:")
        print(f"   - Business Date: {data.get('business_date')}")
        print(f"   - Location: {data.get('location_name')}")
        print(f"   - Opened By: {data.get('opened_by_name')}")
        print(f"   - Next Sale Number: {data.get('next_sale_number')}")
        print(f"   - Next Session Number: {data.get('next_session_number')}")
        return data
    elif response.status_code == 404:
        print("ℹ️ No active day open found")
        return None
    else:
        print(f"❌ Error checking active day open: {response.text}")
        return None

def test_session_api(headers):
    """Test Session API endpoints"""
    print("\n💻 Testing Session API...")
    
    # Test active sessions
    response = requests.get(f'{BASE_URL}/pos-sessions/', headers=headers, params={
        'status': 'open', 
        'page_size': 1
    })
    print(f"Active Sessions Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        sessions = data.get('results', [])
        print(f"✅ Found {len(sessions)} active sessions")
        
        if sessions:
            session = sessions[0]
            print(f"   - Session Number: {session.get('session_number')}")
            print(f"   - Status: {session.get('status')}")
            print(f"   - Terminal: {session.get('terminal_name')}")
            return session
        else:
            print("   - No active sessions")
            return None
    else:
        print(f"❌ Error checking sessions: {response.text}")
        return None

def test_terminal_api(headers):
    """Test Terminal API endpoints"""
    print("\n🖥️ Testing Terminal API...")
    
    response = requests.get(f'{BASE_URL}/pos-masters/terminals/', headers=headers)
    print(f"Terminals Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        terminals = data.get('results', data)
        print(f"✅ Found {len(terminals)} terminals")
        
        for terminal in terminals[:3]:  # Show first 3
            print(f"   - {terminal.get('name')} ({terminal.get('terminal_code')})")
        
        return terminals
    else:
        print(f"❌ Error checking terminals: {response.text}")
        return []

def test_theme_api():
    """Test Theme API endpoint"""
    print("\n🎨 Testing Theme API...")
    
    response = requests.get(f'{BASE_URL}/theme/active-theme/')
    print(f"Theme API Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Active theme found:")
        print(f"   - Primary Color: {data.get('primary_color')}")
        print(f"   - Theme Name: {data.get('name')}")
        return data
    else:
        print(f"❌ Error checking theme: {response.text}")
        return None

def test_user_location_api(headers):
    """Test User Location API"""
    print("\n📍 Testing User Location API...")
    
    response = requests.get(f'{BASE_URL}/users/me/', headers=headers)
    print(f"User Profile Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ User profile found:")
        print(f"   - Username: {data.get('username')}")
        print(f"   - Location: {data.get('pos_location_name')}")
        print(f"   - Location Code: {data.get('pos_location_code')}")
        return data
    else:
        print(f"❌ Error checking user profile: {response.text}")
        return None

def test_day_end_workflow_simulation(headers):
    """Simulate day end workflow requirements"""
    print("\n📊 Testing Day End Workflow Requirements...")
    
    # Test transaction data availability
    response = requests.get(f'{BASE_URL}/sales/', headers=headers, params={
        'page_size': 1
    })
    print(f"Sales API Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        sales = data.get('results', data)
        print(f"✅ Sales API accessible - Found {len(sales)} sales records")
    else:
        print(f"⚠️ Sales API not available: {response.text}")
    
    # Test inventory data availability
    response = requests.get(f'{BASE_URL}/products/', headers=headers, params={
        'page_size': 1
    })
    print(f"Products API Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        products = data.get('results', data)
        print(f"✅ Products API accessible - Found {len(products)} products")
    else:
        print(f"⚠️ Products API not available: {response.text}")

def main():
    """Run all tests"""
    print("🚀 Starting Day Management Console API Tests")
    print("=" * 50)
    
    # Login first
    headers = login()
    if not headers:
        return
    
    # Test all required APIs
    day_open = test_day_open_api(headers)
    active_session = test_session_api(headers)
    terminals = test_terminal_api(headers)
    theme = test_theme_api()
    user_profile = test_user_location_api(headers)
    
    # Test workflow requirements
    test_day_end_workflow_simulation(headers)
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 TEST SUMMARY")
    print("=" * 50)
    
    print(f"✅ Authentication: Working")
    print(f"✅ Day Open API: Working" if day_open else "ℹ️ Day Open API: No active day")
    print(f"✅ Session API: Working" if active_session is not None else "ℹ️ Session API: No active sessions")
    print(f"✅ Terminal API: Working" if terminals else "❌ Terminal API: Failed")
    print(f"✅ Theme API: Working" if theme else "❌ Theme API: Failed")
    print(f"✅ User Profile API: Working" if user_profile else "❌ User Profile API: Failed")
    
    # Console readiness check
    print(f"\n🎯 DAY MANAGEMENT CONSOLE READINESS:")
    
    if day_open:
        print("✅ Day Open component should show active day status")
    else:
        print("ℹ️ Day Open component should show 'No active day' state")
    
    if terminals:
        print("✅ Session Open component should have terminals available")
    else:
        print("❌ Session Open component may have terminal selection issues")
    
    if active_session:
        print("✅ Console should show active session status")
    else:
        print("ℹ️ Console should show 'No active session' state")
    
    print("\n🌐 Frontend should be accessible at: http://localhost:3001")
    print("🔗 Navigate to Day Management Console to test UI integration")

if __name__ == "__main__":
    main()
