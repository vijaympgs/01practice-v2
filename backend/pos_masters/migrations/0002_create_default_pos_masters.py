from django.db import migrations

def create_default_pos_masters(apps, schema_editor):
    POSMaster = apps.get_model('pos_masters', 'POSMaster')
    
    default_masters = [
        # Bank Masters
        {
            'name': 'State Bank of India',
            'code': 'SBI',
            'master_type': 'bank',
            'description': 'State Bank of India',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 1,
            'icon_name': 'account_balance',
            'color_code': '#4CAF50',
        },
        {
            'name': 'HDFC Bank',
            'code': 'HDFC',
            'master_type': 'bank',
            'description': 'HDFC Bank Limited',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 2,
            'icon_name': 'account_balance',
            'color_code': '#2196F3',
        },
        {
            'name': 'ICICI Bank',
            'code': 'ICICI',
            'master_type': 'bank',
            'description': 'ICICI Bank Limited',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 3,
            'icon_name': 'account_balance',
            'color_code': '#FF9800',
        },
        
        # Currency Masters
        {
            'name': 'Indian Rupee',
            'code': 'INR',
            'master_type': 'currency',
            'description': 'Indian Rupee',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 1,
            'icon_name': 'currency_rupee',
            'color_code': '#4CAF50',
        },
        {
            'name': 'US Dollar',
            'code': 'USD',
            'master_type': 'currency',
            'description': 'US Dollar',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 2,
            'icon_name': 'attach_money',
            'color_code': '#2196F3',
        },
        
        # Tax Type Masters
        {
            'name': 'GST',
            'code': 'GST',
            'master_type': 'tax_type',
            'description': 'Goods and Services Tax',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 1,
            'icon_name': 'receipt',
            'color_code': '#4CAF50',
        },
        {
            'name': 'CGST',
            'code': 'CGST',
            'master_type': 'tax_type',
            'description': 'Central Goods and Services Tax',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 2,
            'icon_name': 'receipt',
            'color_code': '#2196F3',
        },
        {
            'name': 'SGST',
            'code': 'SGST',
            'master_type': 'tax_type',
            'description': 'State Goods and Services Tax',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 3,
            'icon_name': 'receipt',
            'color_code': '#FF9800',
        },
        
        # Discount Type Masters
        {
            'name': 'Percentage Discount',
            'code': 'PERC',
            'master_type': 'discount_type',
            'description': 'Percentage based discount',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 1,
            'icon_name': 'percent',
            'color_code': '#4CAF50',
        },
        {
            'name': 'Fixed Amount Discount',
            'code': 'FIXED',
            'master_type': 'discount_type',
            'description': 'Fixed amount discount',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 2,
            'icon_name': 'money_off',
            'color_code': '#2196F3',
        },
        
        # Customer Type Masters
        {
            'name': 'Regular Customer',
            'code': 'REG',
            'master_type': 'customer_type',
            'description': 'Regular walk-in customer',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 1,
            'icon_name': 'person',
            'color_code': '#4CAF50',
        },
        {
            'name': 'VIP Customer',
            'code': 'VIP',
            'master_type': 'customer_type',
            'description': 'VIP customer with special privileges',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 2,
            'icon_name': 'star',
            'color_code': '#FF9800',
        },
        {
            'name': 'Wholesale Customer',
            'code': 'WHOLESALE',
            'master_type': 'customer_type',
            'description': 'Wholesale customer',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 3,
            'icon_name': 'business',
            'color_code': '#2196F3',
        },
        
        # Unit of Measure Masters
        {
            'name': 'Piece',
            'code': 'PCS',
            'master_type': 'unit_of_measure',
            'description': 'Individual pieces',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 1,
            'icon_name': 'inventory',
            'color_code': '#4CAF50',
        },
        {
            'name': 'Kilogram',
            'code': 'KG',
            'master_type': 'unit_of_measure',
            'description': 'Weight in kilograms',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 2,
            'icon_name': 'scale',
            'color_code': '#2196F3',
        },
        {
            'name': 'Liter',
            'code': 'LTR',
            'master_type': 'unit_of_measure',
            'description': 'Volume in liters',
            'is_active': True,
            'is_system_generated': True,
            'display_order': 3,
            'icon_name': 'local_drink',
            'color_code': '#FF9800',
        },
        
        # Reason Code Masters
        {
            'name': 'Damaged Goods',
            'code': 'DAMAGE',
            'master_type': 'reason_code',
            'description': 'Goods damaged during handling',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 1,
            'icon_name': 'warning',
            'color_code': '#F44336',
        },
        {
            'name': 'Expired Goods',
            'code': 'EXPIRED',
            'master_type': 'reason_code',
            'description': 'Goods past expiry date',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 2,
            'icon_name': 'schedule',
            'color_code': '#FF9800',
        },
        {
            'name': 'Customer Return',
            'code': 'RETURN',
            'master_type': 'reason_code',
            'description': 'Customer returned goods',
            'is_active': True,
            'is_system_generated': False,
            'display_order': 3,
            'icon_name': 'assignment_return',
            'color_code': '#2196F3',
        },
    ]
    
    for master_data in default_masters:
        POSMaster.objects.get_or_create(
            code=master_data['code'],
            master_type=master_data['master_type'],
            defaults=master_data
        )

def create_default_pos_master_settings(apps, schema_editor):
    POSMasterSettings = apps.get_model('pos_masters', 'POSMasterSettings')
    
    # Get or create settings
    settings, created = POSMasterSettings.objects.get_or_create(pk=1)
    
    if created:
        # Set default values
        settings.enable_auto_code_generation = True
        settings.code_prefix_length = 3
        settings.allow_duplicate_names = False
        settings.default_display_order = 0
        settings.show_inactive_items = False
        settings.require_description = False
        settings.validate_code_format = True
        
        settings.save()

def reverse_create_default_data(apps, schema_editor):
    POSMaster = apps.get_model('pos_masters', 'POSMaster')
    POSMasterSettings = apps.get_model('pos_masters', 'POSMasterSettings')
    
    POSMaster.objects.all().delete()
    POSMasterSettings.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('pos_masters', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_pos_masters, reverse_create_default_data),
        migrations.RunPython(create_default_pos_master_settings, reverse_create_default_data),
    ]
