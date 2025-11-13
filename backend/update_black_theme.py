#!/usr/bin/env python
"""
Update the Black theme colors to be different from Blue theme
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

def update_black_theme():
    """Update the Black theme colors"""
    
    print("Updating Black Theme colors...")
    print("=" * 50)
    
    try:
        # Find the black theme
        black_theme = ThemeSetting.objects.filter(theme_name='black').first()
        
        if black_theme:
            print(f"Found Black Theme: {black_theme.name}")
            print(f"Current colors:")
            print(f"  Primary: {black_theme.primary_color}")
            print(f"  Secondary: {black_theme.secondary_color}")
            print(f"  Background: {black_theme.background_color}")
            print(f"  Text: {black_theme.text_color}")
            print()
            
            # Update to new colors
            black_theme.primary_color = '#000000'
            black_theme.secondary_color = '#333333'
            black_theme.background_color = '#0d0d0d'
            black_theme.text_color = '#ffffff'
            black_theme.name = 'Black Theme'
            black_theme.save()
            
            print("Updated Black Theme colors:")
            print(f"  Primary: {black_theme.primary_color}")
            print(f"  Secondary: {black_theme.secondary_color}")
            print(f"  Background: {black_theme.background_color}")
            print(f"  Text: {black_theme.text_color}")
            print()
            print("[SUCCESS] Black theme updated successfully!")
        else:
            print("[ERROR] Black theme not found in database")
            
    except Exception as e:
        print(f"[ERROR] Error updating black theme: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_black_theme()
