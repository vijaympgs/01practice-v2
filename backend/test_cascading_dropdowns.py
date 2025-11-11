"""
Test script to verify cascading dropdown functionality for Country → State → City
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from geographical_data.models import Country, State, City

def test_cascading_dropdowns():
    """Test cascading dropdown functionality"""
    print("=" * 80)
    print("TESTING CASCADING DROPDOWNS: Country -> State -> City")
    print("=" * 80)
    
    # Get all countries
    countries = Country.objects.all()
    print(f"\nTotal Countries: {countries.count()}")
    
    for country in countries:
        print(f"\nCountry: {country.name} (ID: {country.id})")
        
        # Get states for this country
        states = State.objects.filter(country=country)
        print(f"  States: {states.count()}")
        
        for state in states:
            print(f"    State: {state.name} (ID: {state.id})")
            
            # Get cities for this state
            cities = City.objects.filter(state=state)
            print(f"      Cities: {cities.count()}")
            
            for city in cities:
                print(f"        City: {city.name} (ID: {city.id})")
                print(f"          Country ID: {city.country.id}")
                print(f"          State ID: {city.state.id}")
    
    print("\n" + "=" * 80)
    print("TESTING FRONTEND FILTERING LOGIC")
    print("=" * 80)
    
    # Test filtering logic
    if countries.exists():
        test_country = countries.first()
        print(f"\nTesting with Country: {test_country.name} (ID: {test_country.id})")
        
        # Get states for this country
        states_for_country = State.objects.filter(country=test_country)
        print(f"States filtered by country: {states_for_country.count()}")
        
        for state in states_for_country:
            print(f"  - {state.name} (ID: {state.id})")
            
            # Get cities for this state
            cities_for_state = City.objects.filter(state=state)
            print(f"    Cities filtered by state: {cities_for_state.count()}")
            
            for city in cities_for_state:
                print(f"      - {city.name} (ID: {city.id})")
    
    print("\n" + "=" * 80)
    print("VERIFICATION COMPLETE")
    print("=" * 80)

if __name__ == '__main__':
    test_cascading_dropdowns()

