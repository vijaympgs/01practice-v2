"""
Test script to add country records with phone codes and currency codes
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from geographical_data.models import Country, State, City
from django.contrib.auth import get_user_model

User = get_user_model()

def create_test_countries():
    """Create test countries with phone codes and currencies"""
    
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"Created test user: {user.username}")
    
    # Sample countries data
    countries_data = [
        {
            'name': 'India',
            'code': 'IND',
            'phone_code': '+91',
            'currency_code': 'INR',
            'is_active': True
        },
        {
            'name': 'United States',
            'code': 'USA',
            'phone_code': '+1',
            'currency_code': 'USD',
            'is_active': True
        },
        {
            'name': 'United Kingdom',
            'code': 'GBR',
            'phone_code': '+44',
            'currency_code': 'GBP',
            'is_active': True
        },
        {
            'name': 'Canada',
            'code': 'CAN',
            'phone_code': '+1',
            'currency_code': 'CAD',
            'is_active': True
        },
        {
            'name': 'Australia',
            'code': 'AUS',
            'phone_code': '+61',
            'currency_code': 'AUD',
            'is_active': True
        },
        {
            'name': 'Germany',
            'code': 'DEU',
            'phone_code': '+49',
            'currency_code': 'EUR',
            'is_active': True
        },
        {
            'name': 'France',
            'code': 'FRA',
            'phone_code': '+33',
            'currency_code': 'EUR',
            'is_active': True
        },
        {
            'name': 'Japan',
            'code': 'JPN',
            'phone_code': '+81',
            'currency_code': 'JPY',
            'is_active': True
        },
        {
            'name': 'China',
            'code': 'CHN',
            'phone_code': '+86',
            'currency_code': 'CNY',
            'is_active': True
        },
        {
            'name': 'Brazil',
            'code': 'BRA',
            'phone_code': '+55',
            'currency_code': 'BRL',
            'is_active': True
        },
    ]
    
    print("\n=== Creating Countries ===\n")
    
    for country_data in countries_data:
        country, created = Country.objects.get_or_create(
            code=country_data['code'],
            defaults={
                'name': country_data['name'],
                'phone_code': country_data['phone_code'],
                'currency_code': country_data['currency_code'],
                'is_active': country_data['is_active'],
                'created_by': user
            }
        )
        
        if created:
            print(f"[OK] Created: {country.name} ({country.code}) - Phone: {country.phone_code}, Currency: {country.currency_code}")
        else:
            print(f"[EXISTS] Already exists: {country.name} ({country.code}) - Phone: {country.phone_code}, Currency: {country.currency_code}")
    
    print(f"\n=== Total Countries: {Country.objects.count()} ===")
    
    # Display all countries
    print("\n=== All Countries in Database ===\n")
    for country in Country.objects.all().order_by('name'):
        print(f"ID: {country.id}")
        print(f"Name: {country.name}")
        print(f"Code: {country.code}")
        print(f"Phone Code: {country.phone_code}")
        print(f"Currency Code: {country.currency_code}")
        print(f"Active: {country.is_active}")
        print(f"Created: {country.created_at}")
        print("-" * 50)


def create_test_states():
    """Create test states for countries"""
    
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    # Sample states data
    states_data = [
        {'name': 'Maharashtra', 'code': 'MH', 'country_code': 'IND'},
        {'name': 'Karnataka', 'code': 'KA', 'country_code': 'IND'},
        {'name': 'Tamil Nadu', 'code': 'TN', 'country_code': 'IND'},
        {'name': 'California', 'code': 'CA', 'country_code': 'USA'},
        {'name': 'Texas', 'code': 'TX', 'country_code': 'USA'},
        {'name': 'New York', 'code': 'NY', 'country_code': 'USA'},
        {'name': 'Ontario', 'code': 'ON', 'country_code': 'CAN'},
        {'name': 'Quebec', 'code': 'QC', 'country_code': 'CAN'},
        {'name': 'New South Wales', 'code': 'NSW', 'country_code': 'AUS'},
        {'name': 'Victoria', 'code': 'VIC', 'country_code': 'AUS'},
    ]
    
    print("\n=== Creating States ===\n")
    
    for state_data in states_data:
        try:
            country = Country.objects.get(code=state_data['country_code'])
            state, created = State.objects.get_or_create(
                name=state_data['name'],
                country=country,
                defaults={
                    'code': state_data['code'],
                    'is_active': True,
                    'created_by': user
                }
            )
            
            if created:
                print(f"[OK] Created: {state.name} ({state.code}) - Country: {country.name}")
            else:
                print(f"[EXISTS] Already exists: {state.name} ({state.code}) - Country: {country.name}")
        except Country.DoesNotExist:
            print(f"[ERROR] Country not found: {state_data['country_code']}")
    
    print(f"\n=== Total States: {State.objects.count()} ===")


def create_test_cities():
    """Create test cities for states"""
    
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    # Sample cities data
    cities_data = [
        {'name': 'Mumbai', 'code': 'MUM', 'state_name': 'Maharashtra', 'country_code': 'IND'},
        {'name': 'Bangalore', 'code': 'BLR', 'state_name': 'Karnataka', 'country_code': 'IND'},
        {'name': 'Chennai', 'code': 'CHN', 'state_name': 'Tamil Nadu', 'country_code': 'IND'},
        {'name': 'Los Angeles', 'code': 'LA', 'state_name': 'California', 'country_code': 'USA'},
        {'name': 'Houston', 'code': 'HOU', 'state_name': 'Texas', 'country_code': 'USA'},
        {'name': 'Toronto', 'code': 'TOR', 'state_name': 'Ontario', 'country_code': 'CAN'},
        {'name': 'Montreal', 'code': 'MON', 'state_name': 'Quebec', 'country_code': 'CAN'},
        {'name': 'Sydney', 'code': 'SYD', 'state_name': 'New South Wales', 'country_code': 'AUS'},
        {'name': 'Melbourne', 'code': 'MEL', 'state_name': 'Victoria', 'country_code': 'AUS'},
    ]
    
    print("\n=== Creating Cities ===\n")
    
    for city_data in cities_data:
        try:
            country = Country.objects.get(code=city_data['country_code'])
            state = State.objects.get(name=city_data['state_name'], country=country)
            
            city, created = City.objects.get_or_create(
                name=city_data['name'],
                state=state,
                defaults={
                    'code': city_data['code'],
                    'country': country,
                    'is_active': True,
                    'created_by': user
                }
            )
            
            if created:
                print(f"[OK] Created: {city.name} ({city.code}) - State: {state.name}, Country: {country.name}")
            else:
                print(f"[EXISTS] Already exists: {city.name} ({city.code}) - State: {state.name}, Country: {country.name}")
        except (Country.DoesNotExist, State.DoesNotExist) as e:
            print(f"[ERROR] Error: {city_data['name']} - {e}")
    
    print(f"\n=== Total Cities: {City.objects.count()} ===")


def clear_all_data():
    """Clear all test data"""
    print("\n=== Clearing All Data ===\n")
    
    City.objects.all().delete()
    print("[OK] Deleted all cities")
    
    State.objects.all().delete()
    print("[OK] Deleted all states")
    
    Country.objects.all().delete()
    print("[OK] Deleted all countries")
    
    print("\n[OK] All data cleared!")


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Test script for Country/State/City data')
    parser.add_argument('--clear', action='store_true', help='Clear all existing data')
    parser.add_argument('--countries', action='store_true', help='Create countries only')
    parser.add_argument('--states', action='store_true', help='Create states only')
    parser.add_argument('--cities', action='store_true', help='Create cities only')
    
    args = parser.parse_args()
    
    if args.clear:
        clear_all_data()
    
    if args.countries:
        create_test_countries()
    elif args.states:
        create_test_states()
    elif args.cities:
        create_test_cities()
    else:
        # Create all data by default
        create_test_countries()
        create_test_states()
        create_test_cities()
    
    print("\n=== Script Complete ===")

