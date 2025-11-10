from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()

class PayMode(models.Model):
    """
    Payment Methods configuration for POS system
    """
    
    PAYMENT_TYPES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('netbanking', 'Net Banking'),
        ('wallet', 'Digital Wallet'),
        ('cheque', 'Cheque'),
        ('credit', 'Credit'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Under Maintenance'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, help_text="Payment method name")
    code = models.CharField(max_length=20, unique=True, help_text="Short code for payment method")
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES, help_text="Type of payment")
    description = models.TextField(blank=True, null=True, help_text="Description of payment method")
    
    # Configuration
    is_active = models.BooleanField(default=True, help_text="Whether this payment method is active")
    requires_authorization = models.BooleanField(default=False, help_text="Requires manager authorization")
    min_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Minimum transaction amount")
    max_amount = models.DecimalField(max_digits=10, decimal_places=2, default=999999.99, help_text="Maximum transaction amount")
    
    # Display settings
    display_order = models.PositiveIntegerField(default=0, help_text="Order for display in POS")
    icon_name = models.CharField(max_length=50, blank=True, null=True, help_text="Icon name for UI")
    color_code = models.CharField(max_length=7, default='#2196F3', help_text="Color code for UI (hex)")
    
    # Additional settings
    allow_refund = models.BooleanField(default=True, help_text="Allow refunds through this method")
    allow_partial_refund = models.BooleanField(default=True, help_text="Allow partial refunds")
    requires_receipt = models.BooleanField(default=False, help_text="Requires receipt printing")
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='paymodes_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='paymodes_updated')
    
    class Meta:
        db_table = 'pay_modes'
        verbose_name = 'Pay Mode'
        verbose_name_plural = 'Pay Modes'
        ordering = ['display_order', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    def is_available_for_amount(self, amount):
        """Check if payment method is available for given amount"""
        return self.is_active and self.min_amount <= amount <= self.max_amount


class PayModeSettings(models.Model):
    """
    Global settings for payment modes
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # General settings
    default_cash_paymode = models.ForeignKey(PayMode, on_delete=models.SET_NULL, null=True, blank=True, 
                                            related_name='default_cash_settings', 
                                            help_text="Default cash payment method")
    require_payment_confirmation = models.BooleanField(default=False, help_text="Require confirmation for all payments")
    allow_multiple_payments = models.BooleanField(default=True, help_text="Allow multiple payment methods per transaction")
    
    # Cash handling
    enable_cash_drawer = models.BooleanField(default=True, help_text="Enable cash drawer functionality")
    auto_open_cash_drawer = models.BooleanField(default=False, help_text="Auto-open cash drawer on cash payment")
    
    # Card settings
    enable_card_payments = models.BooleanField(default=True, help_text="Enable card payment processing")
    require_card_pin = models.BooleanField(default=False, help_text="Require PIN for card transactions")
    
    # UPI/Digital settings
    enable_upi_payments = models.BooleanField(default=True, help_text="Enable UPI payment processing")
    enable_qr_code = models.BooleanField(default=True, help_text="Enable QR code generation")
    
    # Refund settings
    allow_refunds = models.BooleanField(default=True, help_text="Allow refunds in POS")
    require_refund_authorization = models.BooleanField(default=True, help_text="Require authorization for refunds")
    max_refund_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=100.00, 
                                             help_text="Maximum refund percentage allowed")
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='paymode_settings_updated')
    
    class Meta:
        db_table = 'pay_mode_settings'
        verbose_name = 'Pay Mode Settings'
        verbose_name_plural = 'Pay Mode Settings'
    
    def __str__(self):
        return f"Pay Mode Settings - {self.updated_at}"


class PayModeHistory(models.Model):
    """
    Track changes to payment modes
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    paymode = models.ForeignKey(PayMode, on_delete=models.CASCADE, related_name='history')
    field_name = models.CharField(max_length=50, help_text="Field that was changed")
    old_value = models.TextField(help_text="Previous value")
    new_value = models.TextField(help_text="New value")
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(blank=True, null=True, help_text="Reason for change")
    
    class Meta:
        db_table = 'pay_mode_history'
        verbose_name = 'Pay Mode History'
        verbose_name_plural = 'Pay Mode History'
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.paymode.name} - {self.field_name} - {self.changed_at}"


class PayModeSettingDefinition(models.Model):
    """Metadata definitions for pay mode settings with explicit sequencing"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category_key = models.CharField(max_length=64)
    category_title = models.CharField(max_length=128)
    category_sequence = models.PositiveIntegerField(default=1)
    field_name = models.CharField(max_length=128, unique=True)
    field_label = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    sequence = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    help_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'paymode_setting_definitions'
        verbose_name = 'Pay Mode Setting Definition'
        verbose_name_plural = 'Pay Mode Setting Definitions'
        ordering = ['category_sequence', 'sequence']

    def __str__(self):
        return f"{self.category_title} :: {self.field_label}"