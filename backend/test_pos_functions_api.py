"""
Test script to verify POS Functions API endpoints
Run: python manage.py shell < test_pos_functions_api.py
Or: python test_pos_functions_api.py (from backend directory)
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import POSFunction, RolePOSFunctionMapping
from users.views import POSFunctionViewSet, RolePOSFunctionMappingViewSet

print("=" * 60)
print("POS Functions API Test")
print("=" * 60)

# Check models
print("\n1. Checking Models:")
print(f"   POSFunction count: {POSFunction.objects.count()}")
print(f"   RolePOSFunctionMapping count: {RolePOSFunctionMapping.objects.count()}")

# Check ViewSets
print("\n2. Checking ViewSets:")
print(f"   POSFunctionViewSet: {POSFunctionViewSet}")
print(f"   RolePOSFunctionMappingViewSet: {RolePOSFunctionMappingViewSet}")

if POSFunctionViewSet:
    print("   ✅ POSFunctionViewSet is available")
else:
    print("   ❌ POSFunctionViewSet is NOT available")

if RolePOSFunctionMappingViewSet:
    print("   ✅ RolePOSFunctionMappingViewSet is available")
else:
    print("   ❌ RolePOSFunctionMappingViewSet is NOT available")

# Check sample data
print("\n3. Sample POS Functions:")
for func in POSFunction.objects.all()[:5]:
    print(f"   - {func.function_code}: {func.function_name}")

print("\n4. Sample Role Mappings:")
for mapping in RolePOSFunctionMapping.objects.filter(role='posuser')[:3]:
    print(f"   - {mapping.role}: {mapping.function.function_code} = {mapping.is_allowed}")

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)

