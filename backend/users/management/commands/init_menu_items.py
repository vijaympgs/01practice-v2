"""
Django management command to initialize menu items from menu_mapping.py
Run: python manage.py init_menu_items

Populates MenuItemType table with all menu items from menu_mapping.py
"""
from django.core.management.base import BaseCommand
from users.models import MenuItemType
from users.menu_mapping import MENU_ITEMS_MAPPING, MenuType, TransactionSubType


class Command(BaseCommand):
    help = 'Initialize menu items from menu_mapping.py to MenuItemType table'

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for menu_item_id, item_data in MENU_ITEMS_MAPPING.items():
            menu_type = item_data['type'].value if hasattr(item_data['type'], 'value') else str(item_data['type'])
            transaction_subtype = (
                item_data['subtype'].value if item_data['subtype'] and hasattr(item_data['subtype'], 'value')
                else str(item_data['subtype']) if item_data['subtype'] else None
            )
            
            menu_item, created = MenuItemType.objects.update_or_create(
                menu_item_id=menu_item_id,
                defaults={
                    'display_name': item_data['display_name'],
                    'menu_type': menu_type,
                    'transaction_subtype': transaction_subtype,
                    'category': item_data['category'],
                    'path': item_data['path'],
                    'description': item_data.get('description', ''),
                    'is_active': True,
                    'order': item_data.get('order', 0),
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created menu item: {menu_item.display_name}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated menu item: {menu_item.display_name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nCompleted: {created_count} created, {updated_count} updated, {skipped_count} skipped'
            )
        )

