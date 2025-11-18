#!/usr/bin/env python
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from users.models import MenuItemType

print('=== TESTING ON/OFF FUNCTIONALITY ===')

# Get current state
total_items = MenuItemType.objects.count()
active_items = MenuItemType.objects.filter(is_active=True).count()
inactive_items = total_items - active_items

print(f'Current state: {active_items} active, {inactive_items} inactive')

# Test turning OFF a menu item
item_to_toggle = MenuItemType.objects.filter(is_active=True).first()
if item_to_toggle:
    print(f'Turning OFF: {item_to_toggle.display_name} ({item_to_toggle.category})')
    item_to_toggle.is_active = False
    item_to_toggle.save()
    
    # Check new state
    new_active = MenuItemType.objects.filter(is_active=True).count()
    new_inactive = total_items - new_active
    print(f'After turning OFF: {new_active} active, {new_inactive} inactive')
    
    # Test turning it back ON
    print(f'Turning ON: {item_to_toggle.display_name}')
    item_to_toggle.is_active = True
    item_to_toggle.save()
    
    final_active = MenuItemType.objects.filter(is_active=True).count()
    final_inactive = total_items - final_active
    print(f'After turning ON: {final_active} active, {final_inactive} inactive')
    
    print('SUCCESS: On/off functionality is working!')
else:
    print('No active items found to test')
