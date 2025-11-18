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

print('=== TESTING CATEGORY TYPE MAPPING ===')
print('Backend API response categories:')
for category, items in data['categories'].items():
    print(f'  {category}: {len(items)} items')

# Simulate frontend conversion
categoryTypeMap = {
    'Home': 'DASHBOARD',
    'Point of Sale': 'POS',
    'Inventory Management': 'INVENTORY',
    'Item': 'ITEM_MANAGEMENT',
    'Master Data Management': 'MASTER_DATA',
    'Procurement': 'PROCUREMENT',
    'Reports': 'REPORTS',
    'System': 'SYSTEM',
    'User & Permissions': 'USER_MANAGEMENT',
    'Organization Setup': 'ORGANIZATION',
    'Sales': 'SALES',
    'Stock Nexus': 'INVENTORY'
}

print('\nFrontend converted categories with types:')
for category, items in data['categories'].items():
    categoryType = categoryTypeMap.get(category, 'OTHER')
    print(f'  {category} -> {categoryType}: {len(items)} items')
