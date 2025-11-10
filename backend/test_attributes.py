"""
Test script to populate sample attributes and attribute values.
Run this script to create test data for the Attributes feature.
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from categories.models import Attribute, AttributeValue

def create_sample_attributes():
    """Create sample attributes and their values."""
    
    # Color Attribute
    color_attr, created = Attribute.objects.get_or_create(
        name='Color',
        defaults={
            'description': 'Product color',
            'data_type': 'select',
            'is_active': True,
            'sort_order': 1
        }
    )
    
    if created:
        print(f"Created attribute: {color_attr.name}")
        # Create color values
        colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Orange', 'Purple']
        for idx, color in enumerate(colors):
            AttributeValue.objects.create(
                attribute=color_attr,
                value=color,
                is_active=True,
                sort_order=idx + 1
            )
        print(f"Created {len(colors)} color values")
    
    # Size Attribute
    size_attr, created = Attribute.objects.get_or_create(
        name='Size',
        defaults={
            'description': 'Product size',
            'data_type': 'select',
            'is_active': True,
            'sort_order': 2
        }
    )
    
    if created:
        print(f"Created attribute: {size_attr.name}")
        # Create size values
        sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        for idx, size in enumerate(sizes):
            AttributeValue.objects.create(
                attribute=size_attr,
                value=size,
                is_active=True,
                sort_order=idx + 1
            )
        print(f"Created {len(sizes)} size values")
    
    # Brand Attribute
    brand_attr, created = Attribute.objects.get_or_create(
        name='Brand',
        defaults={
            'description': 'Product brand',
            'data_type': 'select',
            'is_active': True,
            'sort_order': 3
        }
    )
    
    if created:
        print(f"Created attribute: {brand_attr.name}")
        # Create brand values
        brands = ['Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas']
        for idx, brand in enumerate(brands):
            AttributeValue.objects.create(
                attribute=brand_attr,
                value=brand,
                is_active=True,
                sort_order=idx + 1
            )
        print(f"Created {len(brands)} brand values")
    
    # Material Attribute
    material_attr, created = Attribute.objects.get_or_create(
        name='Material',
        defaults={
            'description': 'Product material',
            'data_type': 'select',
            'is_active': True,
            'sort_order': 4
        }
    )
    
    if created:
        print(f"Created attribute: {material_attr.name}")
        # Create material values
        materials = ['Cotton', 'Polyester', 'Leather', 'Plastic', 'Metal', 'Wood']
        for idx, material in enumerate(materials):
            AttributeValue.objects.create(
                attribute=material_attr,
                value=material,
                is_active=True,
                sort_order=idx + 1
            )
        print(f"Created {len(materials)} material values")
    
    # Capacity Attribute (for electronics)
    capacity_attr, created = Attribute.objects.get_or_create(
        name='Capacity',
        defaults={
            'description': 'Storage capacity',
            'data_type': 'select',
            'is_active': True,
            'sort_order': 5
        }
    )
    
    if created:
        print(f"Created attribute: {capacity_attr.name}")
        # Create capacity values
        capacities = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']
        for idx, capacity in enumerate(capacities):
            AttributeValue.objects.create(
                attribute=capacity_attr,
                value=capacity,
                is_active=True,
                sort_order=idx + 1
            )
        print(f"Created {len(capacities)} capacity values")
    
    print("\n=== Summary ===")
    print(f"Total attributes: {Attribute.objects.count()}")
    print(f"Total attribute values: {AttributeValue.objects.count()}")
    print("\nAttributes created successfully!")


def clear_all_attributes():
    """Clear all attributes and attribute values."""
    AttributeValue.objects.all().delete()
    Attribute.objects.all().delete()
    print("All attributes and values cleared.")


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--clear':
        clear_all_attributes()
    else:
        create_sample_attributes()



