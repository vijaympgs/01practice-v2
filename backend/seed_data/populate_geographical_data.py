"""
Geographical Data Population Script
Populates the database with countries, states, and cities from seed data files
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from geographical_data.models import Country, State, City
from django.contrib.auth import get_user_model

User = get_user_model()

# Import seed data
from middle_east_data import get_middle_east_data
from south_africa_data import get_south_africa_data
from india_data import get_india_data
from botswana_data import get_botswana_data
from us_data import get_us_data
from uk_data import get_uk_data

def populate_geographical_data():
    """Populate the database with geographical seed data"""
    
    print("Starting geographical data population...")
    
    # Get or create a system user for created_by/updated_by fields
    system_user, created = User.objects.get_or_create(
        username='system',
        defaults={
            'email': 'system@example.com',
            'first_name': 'System',
            'last_name': 'User',
            'is_active': True,
            'is_staff': True
        }
    )
    
    if created:
        print(f"Created system user: {system_user.username}")
    
    # Combine all seed data
    all_seed_data = []
    all_seed_data.extend(get_middle_east_data())
    all_seed_data.extend(get_south_africa_data())
    all_seed_data.extend(get_india_data())
    all_seed_data.extend(get_botswana_data())
    all_seed_data.extend(get_us_data())
    all_seed_data.extend(get_uk_data())
    
    total_countries = 0
    total_states = 0
    total_cities = 0
    
    for country_data in all_seed_data:
        # Create or update country
        country, created = Country.objects.update_or_create(
            code=country_data['code'],
            defaults={
                'name': country_data['name'],
                'phone_code': country_data.get('phone_code'),
                'currency_code': country_data.get('currency_code'),
                'is_active': True,
                'created_by': system_user,
                'updated_by': system_user
            }
        )
        
        if created:
            print(f"Created country: {country.name}")
            total_countries += 1
        else:
            print(f"Updated country: {country.name}")
        
        # Create states and cities
        for state_data in country_data.get('states', []):
            # Create or update state
            state, created = State.objects.update_or_create(
                name=state_data['name'],
                country=country,
                defaults={
                    'code': state_data.get('code'),
                    'is_active': True,
                    'created_by': system_user,
                    'updated_by': system_user
                }
            )
            
            if created:
                print(f"  Created state: {state.name}")
                total_states += 1
            else:
                print(f"  Updated state: {state.name}")
            
            # Create cities
            for city_data in state_data.get('cities', []):
                city, created = City.objects.update_or_create(
                    name=city_data['name'],
                    state=state,
                    country=country,
                    defaults={
                        'code': city_data.get('code'),
                        'postal_code': city_data.get('postal_code'),
                        'latitude': city_data.get('latitude'),
                        'longitude': city_data.get('longitude'),
                        'is_active': True,
                        'created_by': system_user,
                        'updated_by': system_user
                    }
                )
                
                if created:
                    print(f"    Created city: {city.name}")
                    total_cities += 1
                else:
                    print(f"    Updated city: {city.name}")
    
    print(f"\nPopulation completed!")
    print(f"Total countries: {total_countries}")
    print(f"Total states: {total_states}")
    print(f"Total cities: {total_cities}")
    
    # Display summary
    print(f"\nDatabase summary:")
    print(f"Countries in DB: {Country.objects.count()}")
    print(f"States in DB: {State.objects.count()}")
    print(f"Cities in DB: {City.objects.count()}")

def clear_geographical_data():
    """Clear all existing geographical data"""
    print("Clearing existing geographical data...")
    
    City.objects.all().delete()
    State.objects.all().delete()
    Country.objects.all().delete()
    
    print("All geographical data cleared.")

def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == '--clear':
        clear_geographical_data()
        return
    
    if len(sys.argv) > 1 and sys.argv[1] == '--help':
        print("Usage: python populate_geographical_data.py [--clear]")
        print("  --clear: Clear all existing geographical data before populating")
        print("  --help: Show this help message")
        return
    
    populate_geographical_data()

if __name__ == '__main__':
    main()
