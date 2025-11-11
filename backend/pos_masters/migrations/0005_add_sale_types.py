from django.db import migrations

def create_default_sale_types(apps, schema_editor):
    POSMaster = apps.get_model('pos_masters', 'POSMaster')
    
    sale_types = [
        {
            'name': 'Cash Sale',
            'code': 'cash',
            'master_type': 'sale_type',
            'description': 'Cash sale transaction',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 1,
            'icon_name': 'money',
            'color_code': '#4CAF50',
        },
        {
            'name': 'Credit Sale',
            'code': 'credit',
            'master_type': 'sale_type',
            'description': 'Credit sale transaction',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 2,
            'icon_name': 'credit_card',
            'color_code': '#2196F3',
        },
        {
            'name': 'Gift Voucher Sale',
            'code': 'voucher',
            'master_type': 'sale_type',
            'description': 'Gift voucher sale transaction',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 3,
            'icon_name': 'card_giftcard',
            'color_code': '#FF9800',
        },
        {
            'name': 'Layaway Sale',
            'code': 'layaway',
            'master_type': 'sale_type',
            'description': 'Layaway sale transaction',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 4,
            'icon_name': 'shopping_bag',
            'color_code': '#9C27B0',
        },
        {
            'name': 'Miscellaneous/Service Sale',
            'code': 'service',
            'master_type': 'sale_type',
            'description': 'Miscellaneous or service sale transaction',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 5,
            'icon_name': 'build',
            'color_code': '#607D8B',
        },
    ]
    
    for sale_type in sale_types:
        POSMaster.objects.get_or_create(
            code=sale_type['code'],
            master_type=sale_type['master_type'],
            defaults=sale_type
        )

def reverse_create_sale_types(apps, schema_editor):
    POSMaster = apps.get_model('pos_masters', 'POSMaster')
    POSMaster.objects.filter(master_type='sale_type').delete()

class Migration(migrations.Migration):

    dependencies = [
        ('pos_masters', '0004_printertemplate_terminal_terminaldepartmentmapping_and_more'),
    ]

    operations = [
        migrations.RunPython(create_default_sale_types, reverse_create_sale_types),
    ]

