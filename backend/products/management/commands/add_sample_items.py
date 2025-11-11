"""
Management command to add 50 sample items to the Product master.
Includes various categories: Soap, Shampoo, Soft Drinks, TV, Electronics, etc.
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import Product
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Add 50 sample items to the Product master'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing sample products before adding new ones',
        )

    def handle(self, *args, **options):
        # Sample products data
        sample_products = [
            # Personal Care - Soap
            {'name': 'Lux Soap - Rose', 'sku': 'SOAP-LUX-ROSE-001', 'price': Decimal('25.00'), 'cost': Decimal('18.00'), 'brand': 'Lux', 'description': 'Premium rose scented soap', 'stock_quantity': 100},
            {'name': 'Dove Soap - Cream', 'sku': 'SOAP-DOVE-CREAM-001', 'price': Decimal('35.00'), 'cost': Decimal('25.00'), 'brand': 'Dove', 'description': 'Moisturizing cream soap', 'stock_quantity': 80},
            {'name': 'Lifebuoy Soap - Total', 'sku': 'SOAP-LIFE-TOTAL-001', 'price': Decimal('22.00'), 'cost': Decimal('15.00'), 'brand': 'Lifebuoy', 'description': 'Germ protection soap', 'stock_quantity': 120},
            {'name': 'Pears Soap - Original', 'sku': 'SOAP-PEARS-ORG-001', 'price': Decimal('40.00'), 'cost': Decimal('28.00'), 'brand': 'Pears', 'description': 'Original transparent soap', 'stock_quantity': 90},
            {'name': 'Hamam Soap - Neem', 'sku': 'SOAP-HAMAM-NEEM-001', 'price': Decimal('28.00'), 'cost': Decimal('20.00'), 'brand': 'Hamam', 'description': 'Neem and turmeric soap', 'stock_quantity': 110},
            
            # Personal Care - Shampoo
            {'name': 'Head & Shoulders Shampoo', 'sku': 'SHMP-HS-250ML', 'price': Decimal('145.00'), 'cost': Decimal('100.00'), 'brand': 'Head & Shoulders', 'description': 'Anti-dandruff shampoo 250ml', 'stock_quantity': 60},
            {'name': 'Pantene Shampoo - Smooth', 'sku': 'SHMP-PAN-SMOOTH-250', 'price': Decimal('135.00'), 'cost': Decimal('95.00'), 'brand': 'Pantene', 'description': 'Smooth & silky shampoo 250ml', 'stock_quantity': 70},
            {'name': 'L\'Oreal Shampoo - Total Repair', 'sku': 'SHMP-LOREAL-TR-250', 'price': Decimal('175.00'), 'cost': Decimal('120.00'), 'brand': 'L\'Oreal', 'description': 'Total repair shampoo 250ml', 'stock_quantity': 50},
            {'name': 'Sunsilk Shampoo - Straight', 'sku': 'SHMP-SUNSILK-STR-250', 'price': Decimal('125.00'), 'cost': Decimal('85.00'), 'brand': 'Sunsilk', 'description': 'Straight & sleek shampoo', 'stock_quantity': 75},
            {'name': 'Clinic Plus Shampoo', 'sku': 'SHMP-CLINIC-250ML', 'price': Decimal('115.00'), 'cost': Decimal('80.00'), 'brand': 'Clinic Plus', 'description': 'Long and strong shampoo', 'stock_quantity': 65},
            
            # Beverages - Soft Drinks
            {'name': 'Coca Cola - 750ml', 'sku': 'DRINK-COKE-750', 'price': Decimal('40.00'), 'cost': Decimal('28.00'), 'brand': 'Coca Cola', 'description': 'Carbonated soft drink', 'stock_quantity': 200},
            {'name': 'Pepsi - 750ml', 'sku': 'DRINK-PEPSI-750', 'price': Decimal('38.00'), 'cost': Decimal('27.00'), 'brand': 'Pepsi', 'description': 'Carbonated soft drink', 'stock_quantity': 180},
            {'name': 'Sprite - 750ml', 'sku': 'DRINK-SPRITE-750', 'price': Decimal('38.00'), 'cost': Decimal('27.00'), 'brand': 'Sprite', 'description': 'Lemon-lime soft drink', 'stock_quantity': 150},
            {'name': 'Fanta - Orange 750ml', 'sku': 'DRINK-FANTA-750', 'price': Decimal('38.00'), 'cost': Decimal('27.00'), 'brand': 'Fanta', 'description': 'Orange flavored drink', 'stock_quantity': 160},
            {'name': '7UP - 750ml', 'sku': 'DRINK-7UP-750', 'price': Decimal('38.00'), 'cost': Decimal('27.00'), 'brand': '7UP', 'description': 'Lemon-lime carbonated drink', 'stock_quantity': 140},
            {'name': 'Mountain Dew - 750ml', 'sku': 'DRINK-MTDEW-750', 'price': Decimal('40.00'), 'cost': Decimal('28.00'), 'brand': 'Mountain Dew', 'description': 'Citrus flavored drink', 'stock_quantity': 130},
            
            # Electronics - TV
            {'name': 'Samsung 32 inch Smart TV', 'sku': 'TV-SAMSUNG-32-SMART', 'price': Decimal('25000.00'), 'cost': Decimal('22000.00'), 'brand': 'Samsung', 'description': '32 inch Full HD Smart LED TV', 'stock_quantity': 5},
            {'name': 'LG 43 inch Smart TV', 'sku': 'TV-LG-43-SMART', 'price': Decimal('35000.00'), 'cost': Decimal('30000.00'), 'brand': 'LG', 'description': '43 inch 4K Ultra HD Smart TV', 'stock_quantity': 4},
            {'name': 'Sony 55 inch 4K TV', 'sku': 'TV-SONY-55-4K', 'price': Decimal('65000.00'), 'cost': Decimal('55000.00'), 'brand': 'Sony', 'description': '55 inch 4K HDR Android TV', 'stock_quantity': 3},
            {'name': 'OnePlus 43 inch Y1 TV', 'sku': 'TV-ONEPLUS-43-Y1', 'price': Decimal('28000.00'), 'cost': Decimal('24000.00'), 'brand': 'OnePlus', 'description': '43 inch Full HD Smart Android TV', 'stock_quantity': 6},
            {'name': 'Mi TV 4A 32 inch', 'sku': 'TV-MI-32-4A', 'price': Decimal('15000.00'), 'cost': Decimal('13000.00'), 'brand': 'Xiaomi', 'description': '32 inch HD Ready Android TV', 'stock_quantity': 8},
            
            # Electronics - Mobile Phones
            {'name': 'Samsung Galaxy M34', 'sku': 'MOBILE-SAM-M34', 'price': Decimal('18999.00'), 'cost': Decimal('16500.00'), 'brand': 'Samsung', 'description': '6GB RAM, 128GB Storage', 'stock_quantity': 10},
            {'name': 'Redmi Note 12', 'sku': 'MOBILE-REDMI-NOTE12', 'price': Decimal('14999.00'), 'cost': Decimal('13000.00'), 'brand': 'Xiaomi', 'description': '4GB RAM, 64GB Storage', 'stock_quantity': 12},
            {'name': 'Realme Narzo 60', 'sku': 'MOBILE-REALME-NARZO60', 'price': Decimal('12999.00'), 'cost': Decimal('11000.00'), 'brand': 'Realme', 'description': '4GB RAM, 128GB Storage', 'stock_quantity': 15},
            
            # Groceries - Rice & Pulses
            {'name': 'Basmati Rice - 5kg', 'sku': 'RICE-BASMATI-5KG', 'price': Decimal('450.00'), 'cost': Decimal('380.00'), 'brand': 'India Gate', 'description': 'Premium basmati rice 5kg pack', 'stock_quantity': 40},
            {'name': 'Toor Dal - 1kg', 'sku': 'DAL-TOOR-1KG', 'price': Decimal('140.00'), 'cost': Decimal('115.00'), 'brand': 'Tata', 'description': 'Split pigeon peas 1kg', 'stock_quantity': 80},
            {'name': 'Moong Dal - 1kg', 'sku': 'DAL-MOONG-1KG', 'price': Decimal('150.00'), 'cost': Decimal('125.00'), 'brand': 'Tata', 'description': 'Split green gram 1kg', 'stock_quantity': 75},
            
            # Snacks
            {'name': 'Lay\'s Classic Salted', 'sku': 'SNACK-LAYS-CLASSIC', 'price': Decimal('20.00'), 'cost': Decimal('14.00'), 'brand': 'Lay\'s', 'description': 'Classic salted potato chips', 'stock_quantity': 150},
            {'name': 'Kurkure Masala Munch', 'sku': 'SNACK-KURKURE-MASALA', 'price': Decimal('20.00'), 'cost': Decimal('14.00'), 'brand': 'Kurkure', 'description': 'Masala munch snacks', 'stock_quantity': 140},
            {'name': 'Haldiram\'s Namkeen', 'sku': 'SNACK-HALDIRAM-NAMKEEN', 'price': Decimal('45.00'), 'cost': Decimal('32.00'), 'brand': 'Haldiram\'s', 'description': 'Mixed namkeen 200g', 'stock_quantity': 100},
            
            # Dairy Products
            {'name': 'Amul Milk - Full Cream 500ml', 'sku': 'DAIRY-AMUL-MILK-500', 'price': Decimal('32.00'), 'cost': Decimal('26.00'), 'brand': 'Amul', 'description': 'Full cream milk 500ml', 'stock_quantity': 120},
            {'name': 'Amul Butter - 100g', 'sku': 'DAIRY-AMUL-BUTTER-100', 'price': Decimal('55.00'), 'cost': Decimal('45.00'), 'brand': 'Amul', 'description': 'Pure butter 100g', 'stock_quantity': 90},
            {'name': 'Amul Cheese - 200g', 'sku': 'DAIRY-AMUL-CHEESE-200', 'price': Decimal('125.00'), 'cost': Decimal('100.00'), 'brand': 'Amul', 'description': 'Processed cheese 200g', 'stock_quantity': 70},
            
            # Cooking Oil
            {'name': 'Sunflower Oil - 1L', 'sku': 'OIL-SUNFLOWER-1L', 'price': Decimal('145.00'), 'cost': Decimal('120.00'), 'brand': 'Fortune', 'description': 'Refined sunflower oil 1L', 'stock_quantity': 60},
            {'name': 'Mustard Oil - 1L', 'sku': 'OIL-MUSTARD-1L', 'price': Decimal('155.00'), 'cost': Decimal('130.00'), 'brand': 'Fortune', 'description': 'Mustard oil 1L', 'stock_quantity': 55},
            
            # Tea & Coffee
            {'name': 'Tata Tea Gold - 500g', 'sku': 'TEA-TATA-GOLD-500', 'price': Decimal('280.00'), 'cost': Decimal('235.00'), 'brand': 'Tata', 'description': 'Premium tea 500g', 'stock_quantity': 50},
            {'name': 'Red Label Tea - 500g', 'sku': 'TEA-REDLABEL-500', 'price': Decimal('240.00'), 'cost': Decimal('200.00'), 'brand': 'Brooke Bond', 'description': 'Strong tea 500g', 'stock_quantity': 65},
            {'name': 'Nescafe Classic - 100g', 'sku': 'COFFEE-NESCAFE-100', 'price': Decimal('185.00'), 'cost': Decimal('155.00'), 'brand': 'Nescafe', 'description': 'Instant coffee 100g', 'stock_quantity': 45},
            
            # Biscuits
            {'name': 'Parle-G Biscuits', 'sku': 'BISC-PARLEG-200G', 'price': Decimal('25.00'), 'cost': Decimal('18.00'), 'brand': 'Parle', 'description': 'Glucose biscuits 200g', 'stock_quantity': 200},
            {'name': 'Good Day Cookies', 'sku': 'BISC-GOODDAY-200G', 'price': Decimal('35.00'), 'cost': Decimal('25.00'), 'brand': 'Britannia', 'description': 'Cashew and almond cookies', 'stock_quantity': 150},
            {'name': 'Oreo Cookies', 'sku': 'BISC-OREO-150G', 'price': Decimal('50.00'), 'cost': Decimal('38.00'), 'brand': 'Oreo', 'description': 'Chocolate cream cookies', 'stock_quantity': 120},
            
            # Detergents
            {'name': 'Surf Excel - 1kg', 'sku': 'DET-SURFEXCEL-1KG', 'price': Decimal('185.00'), 'cost': Decimal('150.00'), 'brand': 'Surf Excel', 'description': 'Detergent powder 1kg', 'stock_quantity': 70},
            {'name': 'Tide Plus - 1kg', 'sku': 'DET-TIDE-1KG', 'price': Decimal('175.00'), 'cost': Decimal('145.00'), 'brand': 'Tide', 'description': 'Detergent powder 1kg', 'stock_quantity': 75},
            {'name': 'Ariel Matic - 1kg', 'sku': 'DET-ARIEL-1KG', 'price': Decimal('195.00'), 'cost': Decimal('160.00'), 'brand': 'Ariel', 'description': 'Front load detergent 1kg', 'stock_quantity': 60},
            
            # Stationery
            {'name': 'Reynolds Ball Pen - Blue', 'sku': 'STN-RYN-BP-BLUE', 'price': Decimal('10.00'), 'cost': Decimal('6.00'), 'brand': 'Reynolds', 'description': 'Blue ball point pen', 'stock_quantity': 300},
            {'name': 'Classmate Notebook - 200 Pages', 'sku': 'STN-CLASSMATE-200', 'price': Decimal('85.00'), 'cost': Decimal('65.00'), 'brand': 'ITC', 'description': '200 pages ruled notebook', 'stock_quantity': 100},
            
            # Home & Kitchen
            {'name': 'Prestige Pressure Cooker - 5L', 'sku': 'KIT-PRESTIGE-PC-5L', 'price': Decimal('1250.00'), 'cost': Decimal('1000.00'), 'brand': 'Prestige', 'description': '5 liter pressure cooker', 'stock_quantity': 20},
            {'name': 'Borosil Glass Set - 6 Pcs', 'sku': 'KIT-BOROSIL-6PC', 'price': Decimal('450.00'), 'cost': Decimal('350.00'), 'brand': 'Borosil', 'description': '6 piece glass set', 'stock_quantity': 30},
            
            # Additional items to reach 50
            {'name': 'Maggi Noodles - Masala', 'sku': 'FOOD-MAGGI-MASALA', 'price': Decimal('14.00'), 'cost': Decimal('10.00'), 'brand': 'Maggi', 'description': 'Instant masala noodles', 'stock_quantity': 250},
            {'name': 'Britannia Bread - White', 'sku': 'FOOD-BREAD-WHITE-400', 'price': Decimal('42.00'), 'cost': Decimal('32.00'), 'brand': 'Britannia', 'description': 'White bread 400g', 'stock_quantity': 80},
        ]

        if options['clear']:
            # Clear existing sample products (optional)
            existing_count = Product.objects.count()
            self.stdout.write(self.style.WARNING(f'Clearing {existing_count} existing products...'))
            Product.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'Cleared {existing_count} products'))

        created_count = 0
        skipped_count = 0

        with transaction.atomic():
            for product_data in sample_products:
                # Check if product with same name or SKU already exists
                if Product.objects.filter(name=product_data['name']).exists():
                    self.stdout.write(self.style.WARNING(f'Skipping {product_data["name"]} - already exists'))
                    skipped_count += 1
                    continue
                
                if Product.objects.filter(sku=product_data['sku']).exists():
                    self.stdout.write(self.style.WARNING(f'Skipping {product_data["sku"]} - SKU already exists'))
                    skipped_count += 1
                    continue

                # Generate barcode if not provided
                if 'barcode' not in product_data or not product_data.get('barcode'):
                    product_data['barcode'] = f'BC{product_data["sku"].replace("-", "")}'

                # Set defaults
                product_data.setdefault('tax_rate', Decimal('18.00'))
                product_data.setdefault('minimum_stock', 10)
                product_data.setdefault('is_active', True)
                product_data.setdefault('is_taxable', True)

                try:
                    Product.objects.create(**product_data)
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Created: {product_data["name"]}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error creating {product_data["name"]}: {str(e)}'))
                    skipped_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'\nCompleted!\n'
            f'Created: {created_count} products\n'
            f'Skipped: {skipped_count} products\n'
            f'Total products in database: {Product.objects.count()}'
        ))

