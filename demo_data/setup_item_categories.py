#!/usr/bin/env python
"""
Setup Script for Item Categories Demo Data

This script sets up the Item Categories and Sub-Categories system
and creates demo data for testing.

Usage:
    python setup_item_categories.py
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def main():
    """Main setup function"""
    
    print("Setting up Item Categories System")
    print("=" * 50)
    
    try:
        # Import and run the demo data creation
        from create_item_categories_demo import main as create_demo_data
        
        print("Running demo data creation...")
        result = create_demo_data()
        
        if result == 0:
            print("\n" + "=" * 50)
            print("✅ Setup completed successfully!")
            print("\nYou can now:")
            print("1. Start the backend server: python manage.py runserver")
            print("2. Start the frontend server: npm run dev")
            print("3. Access Django Admin: http://localhost:8000/admin/")
            print("4. Access Item Master: http://localhost:3000/item/item-master")
            print("\nDemo Data Created:")
            print("- 5 Item Categories")
            print("- 25 Sub-Categories") 
            print("- 30 Demo Items")
        else:
            print("❌ Setup failed!")
            return 1
            
    except Exception as e:
        print(f"❌ Setup error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
