from django.db import migrations

def create_default_payment_methods(apps, schema_editor):
    PayMode = apps.get_model('pay_modes', 'PayMode')
    
    default_payment_methods = [
        {
            'name': 'Cash',
            'code': 'CASH',
            'payment_type': 'cash',
            'description': 'Cash payment method',
            'is_active': True,
            'requires_authorization': False,
            'min_amount': 0.00,
            'max_amount': 999999.99,
            'display_order': 1,
            'icon_name': 'cash',
            'color_code': '#4CAF50',
            'allow_refund': True,
            'allow_partial_refund': True,
            'requires_receipt': False,
        },
        {
            'name': 'Credit Card',
            'code': 'CREDIT_CARD',
            'payment_type': 'card',
            'description': 'Credit card payment',
            'is_active': True,
            'requires_authorization': False,
            'min_amount': 1.00,
            'max_amount': 50000.00,
            'display_order': 2,
            'icon_name': 'credit_card',
            'color_code': '#2196F3',
            'allow_refund': True,
            'allow_partial_refund': True,
            'requires_receipt': True,
        },
        {
            'name': 'Debit Card',
            'code': 'DEBIT_CARD',
            'payment_type': 'card',
            'description': 'Debit card payment',
            'is_active': True,
            'requires_authorization': False,
            'min_amount': 1.00,
            'max_amount': 50000.00,
            'display_order': 3,
            'icon_name': 'debit_card',
            'color_code': '#FF9800',
            'allow_refund': True,
            'allow_partial_refund': True,
            'requires_receipt': True,
        },
        {
            'name': 'UPI',
            'code': 'UPI',
            'payment_type': 'upi',
            'description': 'Unified Payments Interface',
            'is_active': True,
            'requires_authorization': False,
            'min_amount': 1.00,
            'max_amount': 100000.00,
            'display_order': 4,
            'icon_name': 'upi',
            'color_code': '#9C27B0',
            'allow_refund': True,
            'allow_partial_refund': True,
            'requires_receipt': True,
        },
        {
            'name': 'Net Banking',
            'code': 'NET_BANKING',
            'payment_type': 'netbanking',
            'description': 'Internet banking payment',
            'is_active': True,
            'requires_authorization': False,
            'min_amount': 1.00,
            'max_amount': 200000.00,
            'display_order': 5,
            'icon_name': 'account_balance',
            'color_code': '#607D8B',
            'allow_refund': True,
            'allow_partial_refund': True,
            'requires_receipt': True,
        },
        {
            'name': 'Digital Wallet',
            'code': 'WALLET',
            'payment_type': 'wallet',
            'description': 'Digital wallet payment (Paytm, PhonePe, etc.)',
            'is_active': True,
            'requires_authorization': False,
            'min_amount': 1.00,
            'max_amount': 25000.00,
            'display_order': 6,
            'icon_name': 'account_balance_wallet',
            'color_code': '#E91E63',
            'allow_refund': True,
            'allow_partial_refund': True,
            'requires_receipt': True,
        },
        {
            'name': 'Cheque',
            'code': 'CHEQUE',
            'payment_type': 'cheque',
            'description': 'Cheque payment',
            'is_active': True,
            'requires_authorization': True,
            'min_amount': 1.00,
            'max_amount': 1000000.00,
            'display_order': 7,
            'icon_name': 'description',
            'color_code': '#795548',
            'allow_refund': False,
            'allow_partial_refund': False,
            'requires_receipt': True,
        },
        {
            'name': 'Credit',
            'code': 'CREDIT',
            'payment_type': 'credit',
            'description': 'Credit/Account payment',
            'is_active': True,
            'requires_authorization': True,
            'min_amount': 1.00,
            'max_amount': 500000.00,
            'display_order': 8,
            'icon_name': 'credit_score',
            'color_code': '#FF5722',
            'allow_refund': False,
            'allow_partial_refund': False,
            'requires_receipt': True,
        },
    ]
    
    for method_data in default_payment_methods:
        PayMode.objects.get_or_create(
            code=method_data['code'],
            defaults=method_data
        )

def create_default_paymode_settings(apps, schema_editor):
    PayModeSettings = apps.get_model('pay_modes', 'PayModeSettings')
    PayMode = apps.get_model('pay_modes', 'PayMode')
    
    # Get or create settings
    settings, created = PayModeSettings.objects.get_or_create(pk=1)
    
    if created:
        # Set default cash payment method
        cash_paymode = PayMode.objects.filter(code='CASH').first()
        if cash_paymode:
            settings.default_cash_paymode = cash_paymode
        
        # Set default values
        settings.require_payment_confirmation = False
        settings.allow_multiple_payments = True
        settings.enable_cash_drawer = True
        settings.auto_open_cash_drawer = False
        settings.enable_card_payments = True
        settings.require_card_pin = False
        settings.enable_upi_payments = True
        settings.enable_qr_code = True
        settings.allow_refunds = True
        settings.require_refund_authorization = True
        settings.max_refund_percentage = 100.00
        
        settings.save()

def reverse_create_default_data(apps, schema_editor):
    PayMode = apps.get_model('pay_modes', 'PayMode')
    PayModeSettings = apps.get_model('pay_modes', 'PayModeSettings')
    
    PayMode.objects.all().delete()
    PayModeSettings.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('pay_modes', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_payment_methods, reverse_create_default_data),
        migrations.RunPython(create_default_paymode_settings, reverse_create_default_data),
    ]
