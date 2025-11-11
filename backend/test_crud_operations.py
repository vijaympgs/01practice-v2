"""
Test script to verify CRUD operations for Country, State, City
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from geographical_data.models import Country, State, City

def test_crud_operations():
    """Test CRUD operations for Country, State, City"""
    print("=" * 80)
    print("TESTING CRUD OPERATIONS")
    print("=" * 80)
    
    # CREATE
    print("\n1. CREATE OPERATION")
    print("-" * 80)
    
    # Create a test country
    test_country = Country.objects.create(
        name="Test Country",
        code="TC",
        phone_code="+123",
        currency_code="USD",
        is_active=True
    )
    print(f"Created Country: {test_country.name} (ID: {test_country.id})")
    
    # Create a test state
    test_state = State.objects.create(
        name="Test State",
        code="TS",
        country=test_country,
        is_active=True
    )
    print(f"Created State: {test_state.name} (ID: {test_state.id})")
    
    # Create a test city
    test_city = City.objects.create(
        name="Test City",
        code="TC",
        state=test_state,
        country=test_country,
        postal_code="12345",
        latitude="40.7128",
        longitude="-74.0060",
        is_active=True
    )
    print(f"Created City: {test_city.name} (ID: {test_city.id})")
    
    # READ
    print("\n2. READ OPERATION")
    print("-" * 80)
    
    # Read country
    country = Country.objects.get(id=test_country.id)
    print(f"Read Country: {country.name} - Phone: {country.phone_code}, Currency: {country.currency_code}")
    
    # Read state
    state = State.objects.get(id=test_state.id)
    print(f"Read State: {state.name} - Country: {state.country.name}")
    
    # Read city
    city = City.objects.get(id=test_city.id)
    print(f"Read City: {city.name} - State: {city.state.name}, Country: {city.country.name}")
    
    # UPDATE
    print("\n3. UPDATE OPERATION")
    print("-" * 80)
    
    # Update country
    country.phone_code = "+456"
    country.currency_code = "EUR"
    country.save()
    print(f"Updated Country: {country.name} - Phone: {country.phone_code}, Currency: {country.currency_code}")
    
    # Update state
    state.code = "TS2"
    state.save()
    print(f"Updated State: {state.name} - Code: {state.code}")
    
    # Update city
    city.postal_code = "54321"
    city.save()
    print(f"Updated City: {city.name} - Postal Code: {city.postal_code}")
    
    # DELETE
    print("\n4. DELETE OPERATION")
    print("-" * 80)
    
    # Delete city (cascade will be tested)
    city_id = city.id
    city.delete()
    print(f"Deleted City: {city_id}")
    
    # Delete state
    state_id = state.id
    state.delete()
    print(f"Deleted State: {state_id}")
    
    # Delete country
    country_id = country.id
    country.delete()
    print(f"Deleted Country: {country_id}")
    
    print("\n" + "=" * 80)
    print("CRUD OPERATIONS TEST COMPLETE")
    print("=" * 80)

if __name__ == '__main__':
    test_crud_operations()



