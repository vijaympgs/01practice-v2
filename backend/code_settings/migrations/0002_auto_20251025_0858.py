from django.db import migrations
from django.contrib.auth import get_user_model

User = get_user_model()

def create_default_code_settings(apps, schema_editor):
    CodeSetting = apps.get_model('code_settings', 'CodeSetting')
    
    # Get or create a default user for the migration
    try:
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(
                username='admin',
                email='admin@example.com',
                password='admin123'
            )
    except:
        user = None
    
    default_settings = [
        # System Codes
        {
            'category': 'SYSTEM',
            'code_type': 'Invoice Number',
            'code_prefix': 'INV',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Auto-generated invoice numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'YEARLY',
        },
        {
            'category': 'SYSTEM',
            'code_type': 'Receipt Number',
            'code_prefix': 'RCP',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Auto-generated receipt numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'YEARLY',
        },
        {
            'category': 'SYSTEM',
            'code_type': 'Transaction ID',
            'code_prefix': 'TXN',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Auto-generated transaction IDs',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'YEARLY',
        },
        
        # Transaction Codes
        {
            'category': 'TRANSACTION',
            'code_type': 'Sales Order',
            'code_prefix': 'SO',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Sales order numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'YEARLY',
        },
        {
            'category': 'TRANSACTION',
            'code_type': 'Refund Number',
            'code_prefix': 'REF',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Refund transaction numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'YEARLY',
        },
        {
            'category': 'TRANSACTION',
            'code_type': 'Exchange Number',
            'code_prefix': 'EXC',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Exchange transaction numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'YEARLY',
        },
        
        # Customer Codes
        {
            'category': 'CUSTOMER',
            'code_type': 'Customer ID',
            'code_prefix': 'CUST',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Customer identification numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'NEVER',
        },
        {
            'category': 'CUSTOMER',
            'code_type': 'Loyalty Card',
            'code_prefix': 'LC',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Loyalty card numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'NEVER',
        },
        
        # Product Codes
        {
            'category': 'PRODUCT',
            'code_type': 'Product SKU',
            'code_prefix': 'SKU',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Product SKU numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'NEVER',
        },
        {
            'category': 'PRODUCT',
            'code_type': 'Barcode',
            'code_prefix': '',
            'code_suffix': '',
            'starting_number': 100000000000,
            'current_number': 100000000000,
            'number_format': '000000000000',
            'description': 'Product barcode numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'NEVER',
        },
        
        # Payment Codes
        {
            'category': 'PAYMENT',
            'code_type': 'Payment Reference',
            'code_prefix': 'PAY',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Payment reference numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'YEARLY',
        },
        {
            'category': 'PAYMENT',
            'code_type': 'Cash Drawer Session',
            'code_prefix': 'CDS',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Cash drawer session numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'DAILY',
        },
        
        # Report Codes
        {
            'category': 'REPORT',
            'code_type': 'Report ID',
            'code_prefix': 'RPT',
            'code_suffix': '',
            'starting_number': 1,
            'current_number': 0,
            'number_format': '000000',
            'description': 'Report identification numbers',
            'is_active': True,
            'auto_generate': True,
            'reset_frequency': 'YEARLY',
        },
    ]
    
    for setting_data in default_settings:
        CodeSetting.objects.get_or_create(
            category=setting_data['category'],
            code_type=setting_data['code_type'],
            defaults={
                **setting_data,
            }
        )

def reverse_create_default_code_settings(apps, schema_editor):
    CodeSetting = apps.get_model('code_settings', 'CodeSetting')
    CodeSetting.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('code_settings', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_code_settings, reverse_create_default_code_settings),
    ]