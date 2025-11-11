from django.db import migrations

def create_default_business_rules(apps, schema_editor):
    BusinessRule = apps.get_model('business_rules', 'BusinessRule')
    
    default_rules = [
        # Stock Management
        {
            'name': 'Stock Check Required During Billing',
            'code': 'STOCK_CHECK_REQUIRED',
            'description': 'Mandatory stock availability checks during billing',
            'category': 'stock_management',
            'rule_type': 'boolean',
            'default_value': 'true',
            'current_value': 'true',
            'help_text': 'Enable mandatory stock availability checks during billing process',
            'is_required': True,
        },
        {
            'name': 'Batch Selection Through MRP',
            'code': 'BATCH_SELECTION_MRP',
            'description': 'Display products based on MRP for batch selection',
            'category': 'stock_management',
            'rule_type': 'boolean',
            'default_value': 'false',
            'current_value': 'false',
            'help_text': 'Enable MRP-based batch selection for products',
            'is_required': False,
        },
        
        # Pricing & Quantity
        {
            'name': 'Price Change Allowed',
            'code': 'PRICE_CHANGE_ALLOWED',
            'description': 'Allow cashier to change item price during billing',
            'category': 'pricing_quantity',
            'rule_type': 'boolean',
            'default_value': 'true',
            'current_value': 'true',
            'help_text': 'Enable price modification during billing process',
            'is_required': True,
        },
        {
            'name': 'Allow Quantity Change',
            'code': 'QUANTITY_CHANGE_ALLOWED',
            'description': 'Allow manual quantity entry instead of scanning multiple times',
            'category': 'pricing_quantity',
            'rule_type': 'boolean',
            'default_value': 'true',
            'current_value': 'true',
            'help_text': 'Enable manual quantity input during billing',
            'is_required': True,
        },
        {
            'name': 'Allow Price Change Below Net Cost',
            'code': 'PRICE_BELOW_COST_ALLOWED',
            'description': 'Allow price reduction below product cost',
            'category': 'pricing_quantity',
            'rule_type': 'boolean',
            'default_value': 'false',
            'current_value': 'false',
            'help_text': 'Enable selling below cost price (requires authorization)',
            'is_required': False,
        },
        {
            'name': 'Enable Wholesale in Billing',
            'code': 'WHOLESALE_ENABLED',
            'description': 'Offer wholesale pricing for products',
            'category': 'pricing_quantity',
            'rule_type': 'boolean',
            'default_value': 'false',
            'current_value': 'false',
            'help_text': 'Enable wholesale pricing options',
            'is_required': False,
        },
        {
            'name': 'Apply Wholesale Price After Customer Selection',
            'code': 'AUTO_WHOLESALE_PRICE',
            'description': 'Auto-apply wholesale price based on customer selection',
            'category': 'pricing_quantity',
            'rule_type': 'boolean',
            'default_value': 'false',
            'current_value': 'false',
            'help_text': 'Automatically apply wholesale pricing for eligible customers',
            'is_required': False,
        },
        
        # Discounts & Loyalty
        {
            'name': 'Enable On-the-Fly Discount with Authorization',
            'code': 'ON_FLY_DISCOUNT_AUTH',
            'description': 'Allow instant discounts with password and reason',
            'category': 'discounts_loyalty',
            'rule_type': 'boolean',
            'default_value': 'true',
            'current_value': 'true',
            'help_text': 'Enable instant discount with manager authorization',
            'is_required': True,
        },
        {
            'name': 'Maximum Bill Discount %',
            'code': 'MAX_BILL_DISCOUNT_PERCENT',
            'description': 'Set maximum discount percentage allowed on bills',
            'category': 'discounts_loyalty',
            'rule_type': 'decimal',
            'default_value': '10.0',
            'current_value': '10.0',
            'help_text': 'Maximum discount percentage allowed per bill',
            'is_required': True,
            'validation_rules': {'min': 0, 'max': 100, 'step': 0.1},
        },
        {
            'name': 'User Wise Discount Definition Required',
            'code': 'USER_WISE_DISCOUNT_REQUIRED',
            'description': 'Require cashier-level discount limits',
            'category': 'discounts_loyalty',
            'rule_type': 'boolean',
            'default_value': 'false',
            'current_value': 'false',
            'help_text': 'Enforce user-specific discount limits',
            'is_required': False,
        },
        
        # Rounding & Amounts
        {
            'name': 'Allow Round Off for Final Bill Amount',
            'code': 'ROUND_OFF_ENABLED',
            'description': 'Enable bill amount rounding',
            'category': 'rounding_amounts',
            'rule_type': 'boolean',
            'default_value': 'true',
            'current_value': 'true',
            'help_text': 'Enable rounding of final bill amounts',
            'is_required': True,
        },
        {
            'name': 'Enable Auto Round Off During Billing',
            'code': 'AUTO_ROUND_OFF_ENABLED',
            'description': 'Automatically round bill amounts',
            'category': 'rounding_amounts',
            'rule_type': 'boolean',
            'default_value': 'false',
            'current_value': 'false',
            'help_text': 'Automatically round amounts during billing process',
            'is_required': False,
        },
        {
            'name': 'Round Off Level',
            'code': 'ROUND_OFF_LEVEL',
            'description': 'Decimal places (0-4) for rounding',
            'category': 'rounding_amounts',
            'rule_type': 'integer',
            'default_value': '2',
            'current_value': '2',
            'help_text': 'Number of decimal places for rounding (0-4)',
            'is_required': True,
            'validation_rules': {'min': 0, 'max': 4},
        },
        {
            'name': 'Round Off Type',
            'code': 'ROUND_OFF_TYPE',
            'description': 'Select rounding method',
            'category': 'rounding_amounts',
            'rule_type': 'choice',
            'default_value': 'normal',
            'current_value': 'normal',
            'help_text': 'Choose rounding method: Normal, Round Up, or Round Down',
            'is_required': True,
            'validation_rules': {
                'choices': [
                    {'value': 'normal', 'label': 'Normal'},
                    {'value': 'round_up', 'label': 'Round Up'},
                    {'value': 'round_down', 'label': 'Round Down'}
                ]
            },
        },
    ]
    
    for rule_data in default_rules:
        BusinessRule.objects.get_or_create(
            code=rule_data['code'],
            defaults=rule_data
        )

def reverse_create_default_business_rules(apps, schema_editor):
    BusinessRule = apps.get_model('business_rules', 'BusinessRule')
    BusinessRule.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('business_rules', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_business_rules, reverse_create_default_business_rules),
    ]
