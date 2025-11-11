"""
Django management command to initialize POS functions and default role mappings.

Usage:
    python manage.py init_pos_functions
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

try:
    from users.models import POSFunction, RolePOSFunctionMapping
except ImportError:
    POSFunction = None
    RolePOSFunctionMapping = None


class Command(BaseCommand):
    help = 'Initialize POS functions and default role mappings'

    def handle(self, *args, **options):
        if not POSFunction or not RolePOSFunctionMapping:
            self.stdout.write(self.style.ERROR('POSFunction or RolePOSFunctionMapping models not found'))
            return

        # Define all POS functions
        pos_functions = [
            # Function Keys (F1-F12)
            {'function_code': 'F1', 'function_name': 'Customer', 'description': 'Open customer lookup dialog', 'category': 'BASIC', 'keyboard_shortcut': 'F1', 'is_critical': False, 'order': 1},
            {'function_code': 'F2', 'function_name': 'Product Lookup', 'description': 'Open product lookup/search', 'category': 'BASIC', 'keyboard_shortcut': 'F2', 'is_critical': False, 'order': 2},
            {'function_code': 'F3', 'function_name': 'Line Item Discount', 'description': 'Apply discount to selected line item', 'category': 'DISCOUNT', 'keyboard_shortcut': 'F3', 'is_critical': False, 'order': 3},
            {'function_code': 'F4', 'function_name': 'Bill Discount', 'description': 'Apply discount to entire bill', 'category': 'DISCOUNT', 'keyboard_shortcut': 'F4', 'is_critical': False, 'order': 4},
            {'function_code': 'F5', 'function_name': 'Cancel Transaction', 'description': 'Cancel current transaction and clear cart', 'category': 'TRANSACTION', 'keyboard_shortcut': 'F5', 'is_critical': False, 'order': 5},
            {'function_code': 'F6', 'function_name': 'Tender', 'description': 'Open payment/tender dialog', 'category': 'PAYMENT', 'keyboard_shortcut': 'F6', 'is_critical': False, 'order': 6},
            {'function_code': 'F7', 'function_name': 'Price Change', 'description': 'Override item price (requires authorization)', 'category': 'ADMIN', 'keyboard_shortcut': 'F7', 'is_critical': True, 'order': 7},
            {'function_code': 'F8', 'function_name': 'Quantity Change', 'description': 'Modify item quantity', 'category': 'BASIC', 'keyboard_shortcut': 'F8', 'is_critical': False, 'order': 8},
            {'function_code': 'F9', 'function_name': 'Clear Cart', 'description': 'Clear all items from cart', 'category': 'BASIC', 'keyboard_shortcut': 'F9', 'is_critical': False, 'order': 9},
            {'function_code': 'F10', 'function_name': 'Item Scan', 'description': 'Toggle barcode/item code entry field', 'category': 'BASIC', 'keyboard_shortcut': 'F10', 'is_critical': False, 'order': 10},
            {'function_code': 'F11', 'function_name': 'Notes', 'description': 'Add transaction notes', 'category': 'BASIC', 'keyboard_shortcut': 'F11', 'is_critical': False, 'order': 11},
            {'function_code': 'F12', 'function_name': 'Refund', 'description': 'Process refund transaction', 'category': 'PAYMENT', 'keyboard_shortcut': 'F12', 'is_critical': True, 'order': 12},
            
            # Alt Function Keys
            {'function_code': 'ALT_F1', 'function_name': 'Add Item', 'description': 'Add new item to cart', 'category': 'BASIC', 'keyboard_shortcut': 'Alt+F1', 'is_critical': False, 'order': 13},
            {'function_code': 'ALT_F3', 'function_name': 'Suspend Transaction', 'description': 'Suspend current transaction for later', 'category': 'TRANSACTION', 'keyboard_shortcut': 'Alt+F3', 'is_critical': False, 'order': 14},
            {'function_code': 'ALT_F4', 'function_name': 'Resume Transaction', 'description': 'Resume suspended transaction', 'category': 'TRANSACTION', 'keyboard_shortcut': 'Alt+F4', 'is_critical': False, 'order': 15},
            {'function_code': 'ALT_F5', 'function_name': 'Exchange', 'description': 'Process exchange/return transaction', 'category': 'TRANSACTION', 'keyboard_shortcut': 'Alt+F5', 'is_critical': False, 'order': 16},
            
            # Ctrl Function Keys
            {'function_code': 'CTRL_F1', 'function_name': 'Reprint Receipt', 'description': 'Reprint last receipt', 'category': 'ADMIN', 'keyboard_shortcut': 'Ctrl+F1', 'is_critical': False, 'order': 17},
            {'function_code': 'CTRL_F2', 'function_name': 'Void Transaction', 'description': 'Void current transaction (requires authorization)', 'category': 'ADMIN', 'keyboard_shortcut': 'Ctrl+F2', 'is_critical': True, 'order': 18},
            {'function_code': 'CTRL_F3', 'function_name': 'Bill Query', 'description': 'Query/search previous bills', 'category': 'ADMIN', 'keyboard_shortcut': 'Ctrl+F3', 'is_critical': False, 'order': 19},
            {'function_code': 'CTRL_F4', 'function_name': 'Close/Settlement', 'description': 'Open settlement/close session (requires authorization)', 'category': 'ADMIN', 'keyboard_shortcut': 'Ctrl+F4', 'is_critical': True, 'order': 20},
            {'function_code': 'CTRL_F5', 'function_name': 'Force Quit', 'description': 'Force quit and return to home (requires authorization)', 'category': 'ADMIN', 'keyboard_shortcut': 'Ctrl+F5', 'is_critical': True, 'order': 21},
        ]

        # Create or update POS functions
        functions_created = 0
        functions_updated = 0
        
        for func_data in pos_functions:
            func, created = POSFunction.objects.update_or_create(
                function_code=func_data['function_code'],
                defaults=func_data
            )
            if created:
                functions_created += 1
                self.stdout.write(self.style.SUCCESS(f'Created POS function: {func.function_code} - {func.function_name}'))
            else:
                functions_updated += 1
                self.stdout.write(self.style.WARNING(f'Updated POS function: {func.function_code} - {func.function_name}'))

        # Default role mappings
        # POS Manager: All functions allowed, critical functions require approval
        posmanager_mappings = {
            'F1': {'is_allowed': True, 'requires_approval': False},
            'F2': {'is_allowed': True, 'requires_approval': False},
            'F3': {'is_allowed': True, 'requires_approval': False},
            'F4': {'is_allowed': True, 'requires_approval': False},
            'F5': {'is_allowed': True, 'requires_approval': False},
            'F6': {'is_allowed': True, 'requires_approval': False},
            'F7': {'is_allowed': True, 'requires_approval': True},  # Price Change requires approval
            'F8': {'is_allowed': True, 'requires_approval': False},
            'F9': {'is_allowed': True, 'requires_approval': False},
            'F10': {'is_allowed': True, 'requires_approval': False},
            'F11': {'is_allowed': True, 'requires_approval': False},
            'F12': {'is_allowed': True, 'requires_approval': True},  # Refund requires approval
            'ALT_F1': {'is_allowed': True, 'requires_approval': False},
            'ALT_F3': {'is_allowed': True, 'requires_approval': False},
            'ALT_F4': {'is_allowed': True, 'requires_approval': False},
            'ALT_F5': {'is_allowed': True, 'requires_approval': False},
            'CTRL_F1': {'is_allowed': True, 'requires_approval': False},
            'CTRL_F2': {'is_allowed': True, 'requires_approval': True},  # Void requires approval
            'CTRL_F3': {'is_allowed': True, 'requires_approval': False},
            'CTRL_F4': {'is_allowed': True, 'requires_approval': True},  # Settlement requires approval
            'CTRL_F5': {'is_allowed': True, 'requires_approval': True},  # Force Quit requires approval
        }

        # POS User: Limited functions, no discounts, no admin functions
        posuser_mappings = {
            'F1': {'is_allowed': True, 'requires_approval': False},
            'F2': {'is_allowed': True, 'requires_approval': False},
            'F3': {'is_allowed': False, 'requires_approval': False},  # No line item discount
            'F4': {'is_allowed': False, 'requires_approval': False},  # No bill discount
            'F5': {'is_allowed': True, 'requires_approval': False},
            'F6': {'is_allowed': True, 'requires_approval': False},
            'F7': {'is_allowed': False, 'requires_approval': False},  # No price change
            'F8': {'is_allowed': True, 'requires_approval': False},
            'F9': {'is_allowed': True, 'requires_approval': False},
            'F10': {'is_allowed': True, 'requires_approval': False},
            'F11': {'is_allowed': True, 'requires_approval': False},
            'F12': {'is_allowed': True, 'requires_approval': True},  # Refund requires approval
            'ALT_F1': {'is_allowed': True, 'requires_approval': False},
            'ALT_F3': {'is_allowed': True, 'requires_approval': False},
            'ALT_F4': {'is_allowed': True, 'requires_approval': False},
            'ALT_F5': {'is_allowed': True, 'requires_approval': False},
            'CTRL_F1': {'is_allowed': True, 'requires_approval': False},
            'CTRL_F2': {'is_allowed': False, 'requires_approval': False},  # No void
            'CTRL_F3': {'is_allowed': True, 'requires_approval': False},
            'CTRL_F4': {'is_allowed': False, 'requires_approval': False},  # No settlement
            'CTRL_F5': {'is_allowed': False, 'requires_approval': False},  # No force quit
        }

        # Create role mappings
        mappings_created = 0
        mappings_updated = 0

        # Get admin user for created_by
        admin_user = User.objects.filter(is_superuser=True).first()

        # POS Manager mappings
        for func_code, mapping_data in posmanager_mappings.items():
            try:
                func = POSFunction.objects.get(function_code=func_code)
                mapping, created = RolePOSFunctionMapping.objects.update_or_create(
                    role='posmanager',
                    function=func,
                    defaults={
                        'is_allowed': mapping_data['is_allowed'],
                        'requires_approval': mapping_data['requires_approval'],
                        'created_by': admin_user
                    }
                )
                if created:
                    mappings_created += 1
                else:
                    mappings_updated += 1
            except POSFunction.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Function {func_code} not found, skipping mapping'))

        # POS User mappings
        for func_code, mapping_data in posuser_mappings.items():
            try:
                func = POSFunction.objects.get(function_code=func_code)
                mapping, created = RolePOSFunctionMapping.objects.update_or_create(
                    role='posuser',
                    function=func,
                    defaults={
                        'is_allowed': mapping_data['is_allowed'],
                        'requires_approval': mapping_data['requires_approval'],
                        'created_by': admin_user
                    }
                )
                if created:
                    mappings_created += 1
                else:
                    mappings_updated += 1
            except POSFunction.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Function {func_code} not found, skipping mapping'))

        self.stdout.write(self.style.SUCCESS(f'\n✅ POS Functions initialized:'))
        self.stdout.write(f'   - Functions created: {functions_created}')
        self.stdout.write(f'   - Functions updated: {functions_updated}')
        self.stdout.write(f'   - Role mappings created: {mappings_created}')
        self.stdout.write(f'   - Role mappings updated: {mappings_updated}')

