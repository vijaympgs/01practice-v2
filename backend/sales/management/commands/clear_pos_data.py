"""
Management command to clear all POS-related data:
- All Sessions (POSSession)
- All Day Open records (DayOpen)
- All Day Close records (DayClose)
- All Bills/Sales (Sale) and related items/payments
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from sales.models import POSSession, DayOpen, DayClose, Sale, SaleItem, Payment


class Command(BaseCommand):
    help = 'Delete all POS sessions, day opens, day closes, and sale/bill records'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm deletion (required to actually delete data)',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(self.style.WARNING(
                'WARNING: This will delete ALL POS data!\n'
                '   - All Sessions\n'
                '   - All Day Open records\n'
                '   - All Day Close records\n'
                '   - All Sales/Bills and related items/payments\n\n'
                '   To proceed, run with --confirm flag:\n'
                '   python manage.py clear_pos_data --confirm'
            ))
            return

        self.stdout.write(self.style.WARNING('Starting deletion of all POS data...'))

        with transaction.atomic():
            # Count records before deletion
            session_count = POSSession.objects.count()
            day_open_count = DayOpen.objects.count()
            day_close_count = DayClose.objects.count()
            sale_count = Sale.objects.count()
            sale_item_count = SaleItem.objects.count()
            payment_count = Payment.objects.count()

            self.stdout.write(f'\nCurrent records:')
            self.stdout.write(f'   - Sessions: {session_count}')
            self.stdout.write(f'   - Day Opens: {day_open_count}')
            self.stdout.write(f'   - Day Closes: {day_close_count}')
            self.stdout.write(f'   - Sales/Bills: {sale_count}')
            self.stdout.write(f'   - Sale Items: {sale_item_count}')
            self.stdout.write(f'   - Payments: {payment_count}')

            # Delete in order (respecting foreign key constraints)
            # 1. Delete Payments (references Sale)
            self.stdout.write('\nDeleting Payments...')
            deleted_payments = Payment.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'   SUCCESS: Deleted {deleted_payments[0]} payment(s)'))

            # 2. Delete Sale Items (references Sale)
            self.stdout.write('Deleting Sale Items...')
            deleted_items = SaleItem.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'   SUCCESS: Deleted {deleted_items[0]} sale item(s)'))

            # 3. Delete Sales/Bills
            self.stdout.write('Deleting Sales/Bills...')
            deleted_sales = Sale.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'   SUCCESS: Deleted {deleted_sales[0]} sale(s)'))

            # 4. Delete Sessions (may reference DayOpen, but should be fine)
            self.stdout.write('Deleting POS Sessions...')
            deleted_sessions = POSSession.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'   SUCCESS: Deleted {deleted_sessions[0]} session(s)'))

            # 5. Delete Day Closes
            self.stdout.write('Deleting Day Closes...')
            deleted_day_closes = DayClose.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'   SUCCESS: Deleted {deleted_day_closes[0]} day close(s)'))

            # 6. Delete Day Opens (should be last)
            self.stdout.write('Deleting Day Opens...')
            deleted_day_opens = DayOpen.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'   SUCCESS: Deleted {deleted_day_opens[0]} day open(s)'))

        self.stdout.write(self.style.SUCCESS(
            '\nSUCCESS: Successfully deleted all POS data!\n'
            '   All sessions, day opens, day closes, and sales/bills have been removed.'
        ))

