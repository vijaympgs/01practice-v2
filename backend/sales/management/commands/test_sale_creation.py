"""
Django management command to test sale creation as a developer
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from sales.models import Sale, SaleItem, Payment, POSSession, DayOpen
from products.models import Product
from customers.models import Customer
from organization.models import Location
from decimal import Decimal
from django.utils import timezone

User = get_user_model()


class Command(BaseCommand):
    help = 'Test sale creation to validate serializer fixes'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Testing Sale Creation...\n'))

        try:
            # Get or create required data
            user = User.objects.filter(username='admin').first()
            if not user:
                self.stdout.write(self.style.ERROR('ERROR: Admin user not found'))
                return

            location = Location.objects.filter(is_active=True).first()
            if not location:
                self.stdout.write(self.style.ERROR('ERROR: No active location found'))
                return

            day_open = DayOpen.objects.filter(location=location, is_active=True).first()
            if not day_open:
                self.stdout.write(self.style.WARNING('WARNING: No active Day Open found, creating one...'))
                day_open = DayOpen.objects.create(
                    business_date=timezone.now().date(),
                    location=location,
                    is_active=True
                )

            session = POSSession.objects.filter(status='open').first()
            if not session:
                self.stdout.write(self.style.WARNING('WARNING: No active session found, creating one...'))
                from pos_masters.models import Terminal
                terminal = Terminal.objects.filter(is_active=True).first()
                if not terminal:
                    self.stdout.write(self.style.ERROR('ERROR: No terminal found'))
                    return
                session = POSSession.objects.create(
                    terminal=terminal,
                    cashier=user,
                    location=location,
                    opening_cash=Decimal('1000.00'),
                    status='open'
                )

            product = Product.objects.filter(is_active=True).first()
            if not product:
                self.stdout.write(self.style.ERROR('ERROR: No active product found'))
                return

            self.stdout.write(self.style.SUCCESS(f'OK: User: {user.username}'))
            self.stdout.write(self.style.SUCCESS(f'OK: Location: {location.name}'))
            self.stdout.write(self.style.SUCCESS(f'OK: Day Open: {day_open.id}'))
            self.stdout.write(self.style.SUCCESS(f'OK: Session: {session.session_number}'))
            self.stdout.write(self.style.SUCCESS(f'OK: Product: {product.name} ({product.sku})'))
            self.stdout.write('')

            # Test sale creation using serializer
            self.stdout.write('Creating sale using serializer...')
            from sales.serializers import SaleCreateSerializer
            from rest_framework.test import APIRequestFactory
            from django.test import RequestFactory

            # Prepare sale data
            sale_data = {
                'sale_type': 'cash',
                'customer': None,
                'cashier': user.id,
                'pos_session': session.id,
                'location': location.id,
                'discount_percentage': Decimal('5.00'),
                'notes': 'Developer test sale',
                'status': 'completed',
                'items': [
                    {
                        'product': product.id,
                        'quantity': Decimal('2.00'),
                        'unit_price': product.price,
                        'discount_amount': Decimal('0.00'),
                        'tax_rate': product.tax_rate if hasattr(product, 'tax_rate') else Decimal('10.00')
                    }
                ],
                'payments': [
                    {
                        'payment_method': 'cash',
                        'amount': Decimal('220.00'),
                        'change_amount': Decimal('10.00'),  # This should be accepted but not saved
                        'status': 'completed'
                    }
                ]
            }

            # Create request context
            factory = RequestFactory()
            request = factory.post('/api/sales/', sale_data, content_type='application/json')
            request.user = user

            # Serialize and validate
            serializer = SaleCreateSerializer(data=sale_data, context={'request': request})
            
            if serializer.is_valid():
                self.stdout.write(self.style.SUCCESS('OK: Serializer validation passed'))
                
                # Create the sale
                sale = serializer.save()
                
                self.stdout.write(self.style.SUCCESS(f'OK: Sale created successfully!'))
                self.stdout.write(self.style.SUCCESS(f'   Sale ID: {sale.id}'))
                self.stdout.write(self.style.SUCCESS(f'   Sale Number: {sale.sale_number}'))
                self.stdout.write(self.style.SUCCESS(f'   Total Amount: {sale.total_amount}'))
                self.stdout.write(self.style.SUCCESS(f'   Items: {sale.items.count()}'))
                self.stdout.write(self.style.SUCCESS(f'   Payments: {sale.payments.count()}'))

                # Verify payment doesn't have change_amount
                payment = sale.payments.first()
                if payment:
                    self.stdout.write(self.style.SUCCESS(f'   Payment Amount: {payment.amount}'))
                    if hasattr(payment, 'change_amount'):
                        self.stdout.write(self.style.WARNING(f'   WARNING: Payment has change_amount field (unexpected)'))
                    else:
                        self.stdout.write(self.style.SUCCESS(f'   OK: Payment correctly doesn\'t have change_amount field'))

                # Cleanup - delete test sale
                self.stdout.write('\nCleaning up test sale...')
                sale.delete()
                self.stdout.write(self.style.SUCCESS('OK: Test sale deleted'))

                self.stdout.write(self.style.SUCCESS('\nOK: All tests passed!'))
            else:
                self.stdout.write(self.style.ERROR('ERROR: Serializer validation failed:'))
                self.stdout.write(self.style.ERROR(str(serializer.errors)))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'ERROR: {str(e)}'))
            import traceback
            self.stdout.write(self.style.ERROR(traceback.format_exc()))

