from django.db import migrations

def create_default_programs(apps, schema_editor):
    """
    Create default POS programs
    """
    POSProgram = apps.get_model('pos_programs', 'POSProgram')
    
    default_programs = [
        {
            'name': 'Point of Sale',
            'code': 'POS',
            'description': 'Main POS billing operations',
            'is_active': True
        },
        {
            'name': 'Customer Master',
            'code': 'CUST',
            'description': 'Customer management operations',
            'is_active': True
        },
        {
            'name': 'Cashier Settlement',
            'code': 'SETTLE',
            'description': 'Cashier settlement operations',
            'is_active': True
        },
        {
            'name': 'Day End',
            'code': 'DAYEND',
            'description': 'Day end closing operations',
            'is_active': True
        },
        {
            'name': 'Customer Receivables',
            'code': 'RECEIV',
            'description': 'Customer receivables management',
            'is_active': True
        },
        {
            'name': 'Home Delivery',
            'code': 'DELIVERY',
            'description': 'Home delivery operations',
            'is_active': True
        },
        {
            'name': 'Code Settings',
            'code': 'CODES',
            'description': 'System code management',
            'is_active': True
        },
    ]
    
    for program_data in default_programs:
        POSProgram.objects.get_or_create(
            code=program_data['code'],
            defaults=program_data
        )

def reverse_create_default_programs(apps, schema_editor):
    """
    Remove default programs
    """
    POSProgram = apps.get_model('pos_programs', 'POSProgram')
    POSProgram.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('pos_programs', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(
            create_default_programs,
            reverse_create_default_programs
        ),
    ]
