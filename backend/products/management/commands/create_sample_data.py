"""
Django management command to create sample products and customers
Run: python manage.py create_sample_data

Creates:
- 10 sample products (items)
- 5 sample customers
"""
from django.core.management.base import BaseCommand
from products.models import Product
from customers.models import Customer
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Creates 10 sample products and 5 sample customers'

    def handle(self, *args, **options):
        products_created = 0
        customers_created = 0
        
        # Sample product data
        sample_products = [
            {
                'name': 'Wireless Mouse',
                'sku': 'PROD-001',
                'description': 'Ergonomic wireless mouse with 2.4GHz connectivity',
                'barcode': '1234567890123',
                'price': Decimal('29.99'),
                'cost': Decimal('15.00'),
                'stock_quantity': 50,
                'minimum_stock': 10,
                'maximum_stock': 100,
                'brand': 'TechBrand',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'USB Keyboard',
                'sku': 'PROD-002',
                'description': 'Mechanical USB keyboard with RGB backlight',
                'barcode': '1234567890124',
                'price': Decimal('79.99'),
                'cost': Decimal('40.00'),
                'stock_quantity': 30,
                'minimum_stock': 5,
                'maximum_stock': 50,
                'brand': 'TechBrand',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'HDMI Cable 2m',
                'sku': 'PROD-003',
                'description': 'High-speed HDMI cable 2 meters length',
                'barcode': '1234567890125',
                'price': Decimal('12.99'),
                'cost': Decimal('5.00'),
                'stock_quantity': 100,
                'minimum_stock': 20,
                'maximum_stock': 200,
                'brand': 'CablePro',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'USB-C Hub',
                'sku': 'PROD-004',
                'description': '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader',
                'barcode': '1234567890126',
                'price': Decimal('45.99'),
                'cost': Decimal('22.00'),
                'stock_quantity': 25,
                'minimum_stock': 5,
                'maximum_stock': 50,
                'brand': 'TechBrand',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'Laptop Stand',
                'sku': 'PROD-005',
                'description': 'Adjustable aluminum laptop stand',
                'barcode': '1234567890127',
                'price': Decimal('34.99'),
                'cost': Decimal('15.00'),
                'stock_quantity': 40,
                'minimum_stock': 10,
                'maximum_stock': 80,
                'brand': 'ErgoDesk',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'Webcam HD 1080p',
                'sku': 'PROD-006',
                'description': 'HD 1080p webcam with built-in microphone',
                'barcode': '1234567890128',
                'price': Decimal('59.99'),
                'cost': Decimal('30.00'),
                'stock_quantity': 35,
                'minimum_stock': 8,
                'maximum_stock': 70,
                'brand': 'TechBrand',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'Wireless Headphones',
                'sku': 'PROD-007',
                'description': 'Bluetooth wireless headphones with noise cancellation',
                'barcode': '1234567890129',
                'price': Decimal('89.99'),
                'cost': Decimal('45.00'),
                'stock_quantity': 20,
                'minimum_stock': 5,
                'maximum_stock': 40,
                'brand': 'AudioPro',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'USB Flash Drive 64GB',
                'sku': 'PROD-008',
                'description': 'USB 3.0 flash drive 64GB capacity',
                'barcode': '1234567890130',
                'price': Decimal('19.99'),
                'cost': Decimal('8.00'),
                'stock_quantity': 75,
                'minimum_stock': 15,
                'maximum_stock': 150,
                'brand': 'StorageTech',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'Monitor Stand',
                'sku': 'PROD-009',
                'description': 'Dual monitor stand with gas spring arms',
                'barcode': '1234567890131',
                'price': Decimal('129.99'),
                'cost': Decimal('65.00'),
                'stock_quantity': 15,
                'minimum_stock': 3,
                'maximum_stock': 30,
                'brand': 'ErgoDesk',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
            {
                'name': 'Laptop Cooling Pad',
                'sku': 'PROD-010',
                'description': 'USB-powered laptop cooling pad with 3 fans',
                'barcode': '1234567890132',
                'price': Decimal('24.99'),
                'cost': Decimal('10.00'),
                'stock_quantity': 60,
                'minimum_stock': 12,
                'maximum_stock': 120,
                'brand': 'CoolTech',
                'is_active': True,
                'is_taxable': True,
                'tax_rate': Decimal('18.00'),
            },
        ]
        
        # Sample customer data
        sample_customers = [
            {
                'first_name': 'John',
                'last_name': 'Smith',
                'phone': '9876543210',
                'email': 'john.smith@email.com',
                'customer_type': 'individual',
                'address_line_1': '123 Main Street',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'postal_code': '400001',
                'country': 'India',
                'is_active': True,
            },
            {
                'first_name': 'Priya',
                'last_name': 'Patel',
                'phone': '9876543211',
                'email': 'priya.patel@email.com',
                'customer_type': 'individual',
                'address_line_1': '456 Park Avenue',
                'city': 'Delhi',
                'state': 'Delhi',
                'postal_code': '110001',
                'country': 'India',
                'is_active': True,
            },
            {
                'first_name': 'Raj',
                'last_name': 'Kumar',
                'phone': '9876543212',
                'email': 'raj.kumar@email.com',
                'customer_type': 'individual',
                'address_line_1': '789 MG Road',
                'city': 'Bangalore',
                'state': 'Karnataka',
                'postal_code': '560001',
                'country': 'India',
                'is_active': True,
            },
            {
                'first_name': 'Tech',
                'last_name': 'Solutions',
                'company_name': 'Tech Solutions Pvt Ltd',
                'phone': '9876543213',
                'email': 'info@techsolutions.com',
                'customer_type': 'business',
                'address_line_1': '101 Business Park',
                'city': 'Hyderabad',
                'state': 'Telangana',
                'postal_code': '500001',
                'country': 'India',
                'credit_limit': Decimal('50000.00'),
                'is_active': True,
            },
            {
                'first_name': 'Amit',
                'last_name': 'Sharma',
                'phone': '9876543214',
                'email': 'amit.sharma@email.com',
                'customer_type': 'vip',
                'address_line_1': '202 VIP Lane',
                'city': 'Pune',
                'state': 'Maharashtra',
                'postal_code': '411001',
                'country': 'India',
                'discount_percentage': Decimal('10.00'),
                'is_vip': True,
                'is_active': True,
            },
        ]
        
        # Create products
        self.stdout.write('\nCreating Products...\n')
        for product_data in sample_products:
            sku = product_data['sku']
            product, created = Product.objects.get_or_create(
                sku=sku,
                defaults=product_data
            )
            
            if created:
                products_created += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created product: {product.name} (SKU: {sku})')
                )
            else:
                # Update existing product
                for key, value in product_data.items():
                    setattr(product, key, value)
                product.save()
                self.stdout.write(
                    self.style.WARNING(f'Updated product: {product.name} (SKU: {sku})')
                )
        
        # Create customers
        self.stdout.write('\nCreating Customers...\n')
        for customer_data in sample_customers:
            phone = customer_data['phone']
            # Check if customer exists by phone
            customer = Customer.objects.filter(phone=phone).first()
            
            if not customer:
                # Create new customer (customer_code will be auto-generated)
                customer = Customer(**customer_data)
                customer.save()  # This will auto-generate customer_code
                customers_created += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created customer: {customer.full_name} (Code: {customer.customer_code})')
                )
            else:
                # Update existing customer
                for key, value in customer_data.items():
                    setattr(customer, key, value)
                customer.save()
                self.stdout.write(
                    self.style.WARNING(f'Updated customer: {customer.full_name} (Code: {customer.customer_code})')
                )
        
        # Summary
        self.stdout.write(
            self.style.SUCCESS(
                f'\nCompleted!\n'
                f'   Products: {products_created} created\n'
                f'   Customers: {customers_created} created\n'
            )
        )

