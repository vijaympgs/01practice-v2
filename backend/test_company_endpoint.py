"""
Test script to verify Company public endpoint
Run: python manage.py shell < test_company_endpoint.py
Or: python test_company_endpoint.py (from backend directory)
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from organization.models import Company
from organization.views import CompanyViewSet
from organization.serializers import CompanyListSerializer

print("=" * 60)
print("Company Public Endpoint Test")
print("=" * 60)

# Check models
print("\n1. Checking Models:")
print(f"   Company count: {Company.objects.count()}")
print(f"   Active companies: {Company.objects.filter(is_active=True).count()}")

# Check serializer
print("\n2. Checking Serializer:")
try:
    companies = Company.objects.filter(is_active=True)
    serializer = CompanyListSerializer(companies, many=True)
    print(f"   ✅ Serializer works: {len(serializer.data)} companies")
    if serializer.data:
        print(f"   Sample data: {serializer.data[0]}")
except Exception as e:
    print(f"   ❌ Serializer error: {e}")
    import traceback
    traceback.print_exc()

# Check ViewSet
print("\n3. Checking ViewSet:")
try:
    print(f"   CompanyViewSet: {CompanyViewSet}")
    print(f"   ✅ ViewSet imported successfully")
except Exception as e:
    print(f"   ❌ ViewSet import error: {e}")
    import traceback
    traceback.print_exc()

# Test endpoint
print("\n4. Testing Endpoint:")
try:
    client = Client()
    response = client.get('/api/organization/companies/public/')
    print(f"   Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print(f"   ✅ Endpoint works!")
        import json
        data = json.loads(response.content)
        print(f"   Response: {json.dumps(data, indent=2)[:500]}")
    else:
        print(f"   ❌ Endpoint failed with status {response.status_code}")
        print(f"   Response: {response.content.decode()[:500]}")
except Exception as e:
    print(f"   ❌ Endpoint test error: {e}")
    import traceback
    traceback.print_exc()

# Check URL routing
print("\n5. Checking URL Routing:")
try:
    from django.urls import reverse, resolve
    from django.urls.exceptions import NoReverseMatch
    
    # Try to reverse the URL
    try:
        url = reverse('company-public')
        print(f"   ✅ URL reverse works: {url}")
    except NoReverseMatch:
        # Try to find the URL pattern
        from django.urls import get_resolver
        resolver = get_resolver()
        patterns = []
        for pattern in resolver.url_patterns:
            if 'organization' in str(pattern):
                patterns.append(str(pattern))
        print(f"   Organization URL patterns: {patterns}")
        
        # Check if the action is registered
        from organization.views import CompanyViewSet
        actions = CompanyViewSet.get_extra_actions()
        print(f"   ViewSet actions: {[a.url_name for a in actions]}")
        
except Exception as e:
    print(f"   ❌ URL routing check error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)

