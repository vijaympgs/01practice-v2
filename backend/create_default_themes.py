#!/usr/bin/env python
"""
Create default themes for the system
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from theme_management.models import ThemeSetting

def create_default_themes():
    """Create default themes if they don't exist"""
    
    print("Creating default themes...")
    print("=" * 50)
    
    try:
        created_themes = ThemeSetting.create_default_themes()
        
        if created_themes:
            print(f"[SUCCESS] Created {len(created_themes)} default themes:")
            for theme in created_themes:
                print(f"  - {theme.name} ({theme.theme_name})")
                print(f"    Primary: {theme.primary_color}")
                print(f"    Secondary: {theme.secondary_color}")
                print(f"    Background: {theme.background_color}")
                print(f"    Text: {theme.text_color}")
                print()
        else:
            print("[INFO] Default themes already exist")
        
        # Show all themes
        all_themes = ThemeSetting.get_all_themes()
        print(f"Total themes in system: {all_themes.count()}")
        print()
        
        print("Available Themes:")
        for theme in all_themes:
            status = "[ACTIVE]" if theme.is_active else "[INACTIVE]"
            print(f"  {status} {theme.name} ({theme.theme_name})")
        
        # Show active theme
        active_theme = ThemeSetting.get_active_theme()
        if active_theme:
            print()
            print(f"[THEME] Current Active Theme: {active_theme.name}")
            print(f"   Primary Color: {active_theme.primary_color}")
            print(f"   Secondary Color: {active_theme.secondary_color}")
            print(f"   Background Color: {active_theme.background_color}")
            print(f"   Text Color: {active_theme.text_color}")
        
        print()
        print("[SUCCESS] Theme setup completed successfully!")
        
    except Exception as e:
        print(f"[ERROR] Error creating themes: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_default_themes()
