#!/usr/bin/env python
"""
Update existing Item Master records with Category and Sub-Category assignments.

This script updates existing items to have proper item_category and item_subcategory
assignments based on their current data or predefined mappings.
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import ItemMaster
from categories.models import ItemCategory, ItemSubCategory


def update_items_with_categories():
    """Update existing items with category and sub-category assignments."""
    
    print("Updating Item Master records with Category and Sub-Category assignments...")
    print("=" * 70)
    
    # Get all categories and subcategories
    categories = ItemCategory.objects.filter(is_active=True)
    subcategories = ItemSubCategory.objects.filter(is_active=True)
    
    print(f"Found {categories.count()} active categories")
    print(f"Found {subcategories.count()} active subcategories")
    print()
    
    # Create category mapping based on item codes or names
    category_mapping = {
        # Electronics
        'ELEC': 'Electronics',
        'MOB': 'Electronics',
        'TV': 'Electronics',
        'LAP': 'Electronics',
        'FRIDGE': 'Electronics',
        'WM': 'Electronics',
        
        # Apparels
        'APP': 'Apparels',
        'MENS': 'Apparels',
        'WOMENS': 'Apparels',
        'KIDS': 'Apparels',
        'FOOTWEAR': 'Apparels',
        'ACC': 'Apparels',
        
        # Home & Kitchen
        'HOME': 'Home & Kitchen',
        'FURN': 'Home & Kitchen',
        'KITCHEN': 'Home & Kitchen',
        'COOK': 'Home & Kitchen',
        'DECOR': 'Home & Kitchen',
        'BEDDING': 'Home & Kitchen',
        
        # Sports & Fitness
        'SPORTS': 'Sports & Fitness',
        'FITNESS': 'Sports & Fitness',
        'SPORTS_WEAR': 'Sports & Fitness',
        'OUTDOOR': 'Sports & Fitness',
        'TEAM': 'Sports & Fitness',
        'SPORTS_ACC': 'Sports & Fitness',
        
        # Books & Media
        'MEDIA': 'Books & Media',
        'FICTION': 'Books & Media',
        'NON_FIC': 'Books & Media',
        'EDU': 'Books & Media',
        'MOVIES': 'Books & Media',
        'MUSIC': 'Books & Media',
    }
    
    # Create subcategory mapping
    subcategory_mapping = {
        # Electronics subcategories
        'IP15PM': ('Electronics', 'Mobiles'),
        'SGS24U': ('Electronics', 'Mobiles'),
        'GP8P': ('Electronics', 'Mobiles'),
        'OP12': ('Electronics', 'Mobiles'),
        'XM14P': ('Electronics', 'Mobiles'),
        'SS55Q4K': ('Electronics', 'Televisions'),
        'LG65O4K': ('Electronics', 'Televisions'),
        'SN50L4K': ('Electronics', 'Televisions'),
        'MI43STV': ('Electronics', 'Televisions'),
        'TCL55Q': ('Electronics', 'Televisions'),
        
        # Apparels subcategories
        'MCT001': ('Apparels', "Men's Clothing"),
        'MDJ001': ('Apparels', "Men's Clothing"),
        'MFS001': ('Apparels', "Men's Clothing"),
        'MSS001': ('Apparels', "Men's Clothing"),
        'MWJ001': ('Apparels', "Men's Clothing"),
        
        # Home & Kitchen subcategories
        'MO20L': ('Home & Kitchen', 'Kitchen Appliances'),
        'EK15L': ('Home & Kitchen', 'Kitchen Appliances'),
        'MG750W': ('Home & Kitchen', 'Kitchen Appliances'),
        'IC2000W': ('Home & Kitchen', 'Kitchen Appliances'),
        'TS2S': ('Home & Kitchen', 'Kitchen Appliances'),
        
        # Sports & Fitness subcategories
        'YMP': ('Sports & Fitness', 'Fitness Equipment'),
        'DS5KG': ('Sports & Fitness', 'Fitness Equipment'),
        'TM': ('Sports & Fitness', 'Fitness Equipment'),
        'EB': ('Sports & Fitness', 'Fitness Equipment'),
        'RBS': ('Sports & Fitness', 'Fitness Equipment'),
        
        # Books & Media subcategories
        'TGG': ('Books & Media', 'Fiction Books'),
        'TKAM': ('Books & Media', 'Fiction Books'),
        '1984': ('Books & Media', 'Fiction Books'),
        'PAP': ('Books & Media', 'Fiction Books'),
        'TTCR': ('Books & Media', 'Fiction Books'),
    }
    
    # Get all items
    items = ItemMaster.objects.all()
    print(f"Processing {items.count()} items...")
    print()
    
    updated_count = 0
    skipped_count = 0
    
    for item in items:
        try:
            # Determine category and subcategory
            category_name = None
            subcategory_name = None
            
            # Try to match by item code first
            if item.item_code in subcategory_mapping:
                category_name, subcategory_name = subcategory_mapping[item.item_code]
            elif item.item_code in category_mapping:
                category_name = category_mapping[item.item_code]
            else:
                # Try to match by item name
                item_code_upper = item.item_code.upper()
                for code, (cat, subcat) in subcategory_mapping.items():
                    if code in item_code_upper:
                        category_name = cat
                        subcategory_name = subcat
                        break
                
                if not category_name:
                    for code, cat in category_mapping.items():
                        if code in item_code_upper:
                            category_name = cat
                            break
            
            # Get category object
            category_obj = None
            subcategory_obj = None
            
            if category_name:
                try:
                    category_obj = ItemCategory.objects.get(name=category_name)
                    print(f"  [OK] Found category: {category_name}")
                except ItemCategory.DoesNotExist:
                    print(f"  [WARN] Category not found: {category_name}")
                    skipped_count += 1
                    continue
            
            if subcategory_name and category_obj:
                try:
                    subcategory_obj = ItemSubCategory.objects.get(
                        name=subcategory_name, 
                        category=category_obj
                    )
                    print(f"  [OK] Found subcategory: {subcategory_name}")
                except ItemSubCategory.DoesNotExist:
                    print(f"  [WARN] Subcategory not found: {subcategory_name}")
                    # Continue with category only
            
            # Update the item
            if category_obj:
                item.item_category = category_obj
                item.item_subcategory = subcategory_obj
                item.save()
                updated_count += 1
                print(f"  [SUCCESS] Updated: {item.item_code} -> {category_name} ({subcategory_name or 'No subcategory'})")
            else:
                print(f"  [SKIP] Skipped: {item.item_code} - No matching category")
                skipped_count += 1
                
        except Exception as e:
            print(f"  [ERROR] Error updating {item.item_code}: {str(e)}")
            skipped_count += 1
    
    print()
    print("=" * 70)
    print(f"UPDATE SUMMARY:")
    print(f"   Total items processed: {items.count()}")
    print(f"   Items updated: {updated_count}")
    print(f"   Items skipped: {skipped_count}")
    print(f"   Success rate: {(updated_count / items.count() * 100):.1f}%")
    print()
    
    # Show category breakdown
    print("CATEGORY BREAKDOWN:")
    for category in categories:
        item_count = ItemMaster.objects.filter(item_category=category).count()
        if item_count > 0:
            print(f"   {category.name}: {item_count} items")
    
    print()
    print("Update completed successfully!")


def verify_assignments():
    """Verify the category assignments."""
    print("Verifying category assignments...")
    print("=" * 50)
    
    items = ItemMaster.objects.all()
    with_category = ItemMaster.objects.exclude(item_category__isnull=True).count()
    with_subcategory = ItemMaster.objects.exclude(item_subcategory__isnull=True).count()
    
    print(f"Total items: {items.count()}")
    print(f"Items with category: {with_category}")
    print(f"Items with subcategory: {with_subcategory}")
    print(f"Items without category: {items.count() - with_category}")
    print()
    
    # Show items by category
    print("ITEMS BY CATEGORY:")
    for category in ItemCategory.objects.all():
        category_items = ItemMaster.objects.filter(item_category=category)
        print(f"\n{category.name} ({category.code}):")
        for item in category_items:
            subcategory_name = item.item_subcategory.name if item.item_subcategory else "No subcategory"
            print(f"  - {item.item_code}: {item.item_name} ({subcategory_name})")


if __name__ == "__main__":
    update_items_with_categories()
    print()
    verify_assignments()
