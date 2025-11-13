#!/usr/bin/env python
"""
Demo Data Creation Script for Item Categories and Sub-Categories

This script creates demo data for the new ItemCategory and ItemSubCategory models
to support the Item Master categorization system.

Usage:
    python create_item_categories_demo.py
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from categories.models import ItemCategory, ItemSubCategory
from products.models import ItemMaster
from django.contrib.auth import get_user_model

User = get_user_model()

def create_item_categories():
    """Create demo item categories"""
    
    categories_data = [
        {
            'name': 'Electronics',
            'code': 'ELEC',
            'description': 'Electronic devices and accessories',
            'sort_order': 1,
            'subcategories': [
                {'name': 'Mobiles', 'code': 'MOB', 'description': 'Mobile phones and smartphones'},
                {'name': 'Televisions', 'code': 'TV', 'description': 'TV and home entertainment'},
                {'name': 'Laptops', 'code': 'LAP', 'description': 'Laptop computers and accessories'},
                {'name': 'Refrigerators', 'code': 'FRIDGE', 'description': 'Refrigerators and cooling appliances'},
                {'name': 'Washing Machines', 'code': 'WM', 'description': 'Washing machines and laundry appliances'},
            ]
        },
        {
            'name': 'Apparels',
            'code': 'APP',
            'description': 'Clothing and fashion items',
            'sort_order': 2,
            'subcategories': [
                {'name': "Men's Clothing", 'code': 'MENS', 'description': "Clothing for men"},
                {'name': "Women's Clothing", 'code': 'WOMENS', 'description': "Clothing for women"},
                {'name': "Kids Clothing", 'code': 'KIDS', 'description': "Clothing for children"},
                {'name': 'Footwear', 'code': 'FOOTWEAR', 'description': 'Shoes and footwear'},
                {'name': 'Accessories', 'code': 'ACC', 'description': 'Fashion accessories'},
            ]
        },
        {
            'name': 'Home & Kitchen',
            'code': 'HOME',
            'description': 'Home appliances and kitchen items',
            'sort_order': 3,
            'subcategories': [
                {'name': 'Furniture', 'code': 'FURN', 'description': 'Home and office furniture'},
                {'name': 'Kitchen Appliances', 'code': 'KITCHEN', 'description': 'Kitchen and cooking appliances'},
                {'name': 'Cookware', 'code': 'COOK', 'description': 'Cooking utensils and cookware'},
                {'name': 'Home Decor', 'code': 'DECOR', 'description': 'Home decoration items'},
                {'name': 'Bedding', 'code': 'BEDDING', 'description': 'Bed sheets, pillows, and bedding'},
            ]
        },
        {
            'name': 'Sports & Fitness',
            'code': 'SPORTS',
            'description': 'Sports equipment and fitness items',
            'sort_order': 4,
            'subcategories': [
                {'name': 'Fitness Equipment', 'code': 'FITNESS', 'description': 'Exercise and fitness equipment'},
                {'name': 'Sports Apparel', 'code': 'SPORTS_WEAR', 'description': 'Sports clothing and apparel'},
                {'name': 'Outdoor Gear', 'code': 'OUTDOOR', 'description': 'Outdoor and adventure equipment'},
                {'name': 'Team Sports', 'code': 'TEAM', 'description': 'Team sports equipment'},
                {'name': 'Sports Accessories', 'code': 'SPORTS_ACC', 'description': 'Sports accessories and gear'},
            ]
        },
        {
            'name': 'Books & Media',
            'code': 'MEDIA',
            'description': 'Books, music, and entertainment media',
            'sort_order': 5,
            'subcategories': [
                {'name': 'Fiction Books', 'code': 'FICTION', 'description': 'Fiction and literature books'},
                {'name': 'Non-Fiction Books', 'code': 'NON_FIC', 'description': 'Non-fiction and educational books'},
                {'name': 'Educational Books', 'code': 'EDU', 'description': 'Educational and reference books'},
                {'name': 'Movies', 'code': 'MOVIES', 'description': 'Movies and films'},
                {'name': 'Music', 'code': 'MUSIC', 'description': 'Music albums and recordings'},
            ]
        }
    ]
    
    created_categories = []
    created_subcategories = []
    
    print("Creating Item Categories...")
    
    for cat_data in categories_data:
        # Create or get category
        category, created = ItemCategory.objects.get_or_create(
            code=cat_data['code'],
            defaults={
                'name': cat_data['name'],
                'description': cat_data['description'],
                'sort_order': cat_data['sort_order'],
                'is_active': True
            }
        )
        
        if created:
            print(f"  + Created category: {category.name} ({category.code})")
        else:
            print(f"  + Category already exists: {category.name} ({category.code})")
        
        created_categories.append(category)
        
        # Create subcategories
        for sub_data in cat_data['subcategories']:
            subcategory, created = ItemSubCategory.objects.get_or_create(
                category=category,
                code=sub_data['code'],
                defaults={
                    'name': sub_data['name'],
                    'description': sub_data['description'],
                    'sort_order': len(created_subcategories) + 1,
                    'is_active': True
                }
            )
            
            if created:
                print(f"    + Created subcategory: {subcategory.name} ({subcategory.code})")
            else:
                print(f"    + Subcategory already exists: {subcategory.name} ({subcategory.code})")
            
            created_subcategories.append(subcategory)
    
    print(f"\n+ Created {len(created_categories)} categories and {len(created_subcategories)} subcategories")
    return created_categories, created_subcategories

def create_demo_items(categories, subcategories):
    """Create demo items with category assignments"""
    
    demo_items = [
        # Electronics - Mobiles
        {'name': 'iPhone 15 Pro Max', 'code': 'IP15PM', 'category_code': 'ELEC', 'subcategory_code': 'MOB', 'price': 119999.00},
        {'name': 'Samsung Galaxy S24 Ultra', 'code': 'SGS24U', 'category_code': 'ELEC', 'subcategory_code': 'MOB', 'price': 124999.00},
        {'name': 'Google Pixel 8 Pro', 'code': 'GP8P', 'category_code': 'ELEC', 'subcategory_code': 'MOB', 'price': 89999.00},
        {'name': 'OnePlus 12', 'code': 'OP12', 'category_code': 'ELEC', 'subcategory_code': 'MOB', 'price': 64999.00},
        {'name': 'Xiaomi 14 Pro', 'code': 'XM14P', 'category_code': 'ELEC', 'subcategory_code': 'MOB', 'price': 54999.00},
        
        # Electronics - Televisions
        {'name': 'Samsung 55" QLED 4K TV', 'code': 'SS55Q4K', 'category_code': 'ELEC', 'subcategory_code': 'TV', 'price': 45999.00},
        {'name': 'LG 65" OLED 4K TV', 'code': 'LG65O4K', 'category_code': 'ELEC', 'subcategory_code': 'TV', 'price': 89999.00},
        {'name': 'Sony 50" LED 4K TV', 'code': 'SN50L4K', 'category_code': 'ELEC', 'subcategory_code': 'TV', 'price': 34999.00},
        {'name': 'Mi 43" Smart TV', 'code': 'MI43STV', 'category_code': 'ELEC', 'subcategory_code': 'TV', 'price': 22999.00},
        {'name': 'TCL 55" QLED TV', 'code': 'TCL55Q', 'category_code': 'ELEC', 'subcategory_code': 'TV', 'price': 28999.00},
        
        # Apparels - Men's Clothing
        {'name': 'Men\'s Cotton T-Shirt', 'code': 'MCT001', 'category_code': 'APP', 'subcategory_code': 'MENS', 'price': 499.00},
        {'name': 'Men\'s Denim Jeans', 'code': 'MDJ001', 'category_code': 'APP', 'subcategory_code': 'MENS', 'price': 1299.00},
        {'name': 'Men\'s Formal Shirt', 'code': 'MFS001', 'category_code': 'APP', 'subcategory_code': 'MENS', 'price': 899.00},
        {'name': 'Men\'s Sports Shorts', 'code': 'MSS001', 'category_code': 'APP', 'subcategory_code': 'MENS', 'price': 699.00},
        {'name': 'Men\'s Winter Jacket', 'code': 'MWJ001', 'category_code': 'APP', 'subcategory_code': 'MENS', 'price': 2499.00},
        
        # Home & Kitchen - Kitchen Appliances
        {'name': 'Microwave Oven 20L', 'code': 'MO20L', 'category_code': 'HOME', 'subcategory_code': 'KITCHEN', 'price': 5999.00},
        {'name': 'Electric Kettle 1.5L', 'code': 'EK15L', 'category_code': 'HOME', 'subcategory_code': 'KITCHEN', 'price': 1299.00},
        {'name': 'Mixer Grinder 750W', 'code': 'MG750W', 'category_code': 'HOME', 'subcategory_code': 'KITCHEN', 'price': 2999.00},
        {'name': 'Induction Cooktop 2000W', 'code': 'IC2000W', 'category_code': 'HOME', 'subcategory_code': 'KITCHEN', 'price': 2499.00},
        {'name': 'Toaster 2 Slice', 'code': 'TS2S', 'category_code': 'HOME', 'subcategory_code': 'KITCHEN', 'price': 899.00},
        
        # Sports & Fitness - Fitness Equipment
        {'name': 'Yoga Mat Premium', 'code': 'YMP', 'category_code': 'SPORTS', 'subcategory_code': 'FITNESS', 'price': 799.00},
        {'name': 'Dumbbells Set 5kg', 'code': 'DS5KG', 'category_code': 'SPORTS', 'subcategory_code': 'FITNESS', 'price': 1299.00},
        {'name': 'Treadmill Manual', 'code': 'TM', 'category_code': 'SPORTS', 'subcategory_code': 'FITNESS', 'price': 8999.00},
        {'name': 'Exercise Bike', 'code': 'EB', 'category_code': 'SPORTS', 'subcategory_code': 'FITNESS', 'price': 12999.00},
        {'name': 'Resistance Bands Set', 'code': 'RBS', 'category_code': 'SPORTS', 'subcategory_code': 'FITNESS', 'price': 499.00},
        
        # Books & Media - Fiction Books
        {'name': 'The Great Gatsby', 'code': 'TGG', 'category_code': 'MEDIA', 'subcategory_code': 'FICTION', 'price': 299.00},
        {'name': 'To Kill a Mockingbird', 'code': 'TKAM', 'category_code': 'MEDIA', 'subcategory_code': 'FICTION', 'price': 349.00},
        {'name': '1984 by George Orwell', 'code': '1984', 'category_code': 'MEDIA', 'subcategory_code': 'FICTION', 'price': 399.00},
        {'name': 'Pride and Prejudice', 'code': 'PAP', 'category_code': 'MEDIA', 'subcategory_code': 'FICTION', 'price': 299.00},
        {'name': 'The Catcher in the Rye', 'code': 'TTCR', 'category_code': 'MEDIA', 'subcategory_code': 'FICTION', 'price': 349.00},
    ]
    
    print("\nCreating Demo Items...")
    
    # Get or create a default user for created_by field
    try:
        default_user = User.objects.first()
        if not default_user:
            default_user = User.objects.create_user(
                username='admin',
                email='admin@example.com',
                password='admin123'
            )
            print("  ✓ Created default admin user")
    except Exception as e:
        print(f"  ⚠ Warning: Could not create default user: {e}")
        default_user = None
    
    created_items = []
    
    for item_data in demo_items:
        # Find category and subcategory
        category = ItemCategory.objects.filter(code=item_data['category_code']).first()
        subcategory = ItemSubCategory.objects.filter(
            category=category,
            code=item_data['subcategory_code']
        ).first() if category else None
        
        if not category:
            print(f"  ⚠ Category not found for {item_data['name']} ({item_data['category_code']})")
            continue
        
        # Create or get item
        item, created = ItemMaster.objects.get_or_create(
            item_code=item_data['code'],
            defaults={
                'item_name': item_data['name'],
                'item_category': category,
                'item_subcategory': subcategory,
                'cost_price': item_data['price'] * 0.7,  # 70% of sell price
                'sell_price': item_data['price'],
                'mrp': item_data['price'] * 1.1,  # 10% more than sell price
                'is_active': True,
                'created_by': default_user
            }
        )
        
        if created:
            print(f"  + Created item: {item.item_name} ({item.item_code})")
            created_items.append(item)
        else:
            # Update existing item with category info
            item.item_category = category
            item.item_subcategory = subcategory
            item.save()
            print(f"  + Updated item: {item.item_name} ({item.item_code})")
            created_items.append(item)
    
    print(f"\n+ Created/Updated {len(created_items)} demo items")
    return created_items

def main():
    """Main function to create demo data"""
    
    print("Starting Item Categories Demo Data Creation")
    print("=" * 50)
    
    try:
        # Create categories and subcategories
        categories, subcategories = create_item_categories()
        
        # Create demo items
        items = create_demo_items(categories, subcategories)
        
        print("\n" + "=" * 50)
        print("+ Demo data creation completed successfully!")
        print(f"Summary:")
        print(f"   - Categories: {len(categories)}")
        print(f"   - Subcategories: {len(subcategories)}")
        print(f"   - Items: {len(items)}")
        
        # Display statistics
        print(f"\nCategory Statistics:")
        for category in categories:
            item_count = ItemMaster.objects.filter(item_category=category).count()
            subcat_count = category.subcategories.filter(is_active=True).count()
            print(f"   - {category.name}: {item_count} items, {subcat_count} subcategories")
        
    except Exception as e:
        print(f"\nError creating demo data: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
