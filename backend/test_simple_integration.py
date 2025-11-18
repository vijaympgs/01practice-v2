#!/usr/bin/env python
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from users.views import MenuVisibilityView
from django.test import RequestFactory
from users.models import User

factory = RequestFactory()
request = factory.get('/users/menu-visibility/')
request.user = User.objects.first()
view = MenuVisibilityView()
response = view.get(request)
data = response.data

print('=== INTEGRATION TEST RESULTS ===')
print(f'Status: {response.status_code}')
print(f'Categories returned: {len(data["categories"])}')
print(f'Active items: {data["statistics"]["active_items"]}')
print(f'Inactive items: {data["statistics"]["inactive_items"]}')

print('\nVisible categories:')
for category, items in data['categories'].items():
    print(f'  {category}: {len(items)} items')

print('\nHidden categories (should not appear in frontend):')
from users.models import MenuItemType
all_categories = set(MenuItemType.objects.values_list('category', flat=True).distinct())
active_categories = set(data['categories'].keys())
hidden_categories = all_categories - active_categories
for category in hidden_categories:
    count = MenuItemType.objects.filter(category=category, is_active=False).count()
    print(f'  {category}: {count} inactive items')

total_frontend_items = sum(len(items) for items in data['categories'].values())
expected_active = data['statistics']['active_items']

print(f'\nFrontend will receive: {total_frontend_items} items')
print(f'Expected active items: {expected_active}')

if total_frontend_items == expected_active:
    print('SUCCESS: Menu visibility fix is working!')
else:
    print('PROBLEM: Mismatch in item counts')
