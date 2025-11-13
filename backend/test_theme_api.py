#!/usr/bin/env python
"""
Test the theme API endpoints
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import requests
import json

def test_theme_api():
    """Test the theme API endpoints"""
    
    print("Testing Theme API Endpoints...")
    print("=" * 50)
    
    base_url = "http://localhost:8000/api/theme"
    
    # Test 1: Get all themes
    print("1. Testing GET /api/theme/themes/")
    try:
        response = requests.get(f"{base_url}/themes/")
        if response.status_code == 200:
            themes = response.json()
            print(f"   [SUCCESS] Found {len(themes)} themes")
            for theme in themes:
                print(f"   - {theme['name']} ({theme['theme_name']})")
                print(f"     Primary: {theme['primary_color']}")
                print(f"     Secondary: {theme['secondary_color']}")
                print(f"     Background: {theme['background_color']}")
                print(f"     Text: {theme['text_color']}")
                print()
        else:
            print(f"   [ERROR] Status: {response.status_code}")
    except Exception as e:
        print(f"   [ERROR] {str(e)}")
    
    # Test 2: Get active theme
    print("2. Testing GET /api/theme/active-theme/")
    try:
        response = requests.get(f"{base_url}/active-theme/")
        if response.status_code == 200:
            active_theme = response.json()
            print(f"   [SUCCESS] Active theme: {active_theme['name']}")
            print(f"   Primary: {active_theme['primary_color']}")
            print(f"   Secondary: {active_theme['secondary_color']}")
            print(f"   Background: {active_theme['background_color']}")
            print(f"   Text: {active_theme['text_color']}")
        else:
            print(f"   [ERROR] Status: {response.status_code}")
    except Exception as e:
        print(f"   [ERROR] {str(e)}")
    
    # Test 3: Set active theme (try to set red theme)
    print("3. Testing POST /api/theme/set-active-theme/")
    try:
        # First get all themes to find red theme
        themes_response = requests.get(f"{base_url}/themes/")
        if themes_response.status_code == 200:
            themes = themes_response.json()
            red_theme = next((t for t in themes if t['theme_name'] == 'red'), None)
            
            if red_theme:
                response = requests.post(
                    f"{base_url}/set-active-theme/",
                    json={'theme_id': red_theme['id']}
                )
                if response.status_code == 200:
                    updated_theme = response.json()
                    print(f"   [SUCCESS] Set active theme to: {updated_theme['name']}")
                else:
                    print(f"   [ERROR] Status: {response.status_code}")
            else:
                print("   [ERROR] Red theme not found")
        else:
            print("   [ERROR] Could not get themes to test with")
    except Exception as e:
        print(f"   [ERROR] {str(e)}")
    
    print()
    print("Theme API testing completed!")

if __name__ == "__main__":
    test_theme_api()
