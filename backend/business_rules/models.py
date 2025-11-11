from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()

class BusinessRule(models.Model):
    """
    Business Rules for POS system configuration
    """
    
    RULE_TYPES = [
        ('boolean', 'Boolean (Yes/No)'),
        ('integer', 'Integer'),
        ('decimal', 'Decimal'),
        ('string', 'Text'),
        ('choice', 'Choice'),
    ]
    
    CATEGORIES = [
        ('stock_management', 'Stock Management'),
        ('pricing_quantity', 'Pricing & Quantity'),
        ('discounts_loyalty', 'Discounts & Loyalty'),
        ('rounding_amounts', 'Rounding & Amounts'),
        ('customer_sales', 'Customer & Sales Management'),
        ('billing_documents', 'Billing & Documents'),
        ('advanced_settings', 'Advanced Settings'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(help_text="Description of what this rule does")
    category = models.CharField(max_length=50, choices=CATEGORIES)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    default_value = models.TextField(help_text="Default value as string")
    current_value = models.TextField(help_text="Current value as string")
    is_active = models.BooleanField(default=True)
    is_required = models.BooleanField(default=False)
    help_text = models.TextField(blank=True, null=True, help_text="Help text for users")
    validation_rules = models.JSONField(default=dict, blank=True, help_text="Validation rules as JSON")
    sequence = models.PositiveIntegerField(default=0, help_text="Display order for POS preferences")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='business_rules_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='business_rules_updated')
    
    class Meta:
        db_table = 'business_rules'
        verbose_name = 'Business Rule'
        verbose_name_plural = 'Business Rules'
        ordering = ['sequence', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    def get_value(self):
        """Get the current value in the correct type"""
        if self.rule_type == 'boolean':
            return self.current_value.lower() == 'true'
        elif self.rule_type == 'integer':
            return int(self.current_value) if self.current_value else 0
        elif self.rule_type == 'decimal':
            return float(self.current_value) if self.current_value else 0.0
        else:
            return self.current_value
    
    def set_value(self, value):
        """Set the current value as string"""
        self.current_value = str(value)
    
    def reset_to_default(self):
        """Reset to default value"""
        self.current_value = self.default_value
        self.save()


class BusinessRuleHistory(models.Model):
    """
    Track changes to business rules
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business_rule = models.ForeignKey(BusinessRule, on_delete=models.CASCADE, related_name='history')
    old_value = models.TextField()
    new_value = models.TextField()
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'business_rule_history'
        verbose_name = 'Business Rule History'
        verbose_name_plural = 'Business Rule History'
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.business_rule.name} - {self.changed_at}"


class SettlementSettings(models.Model):
    """
    Settlement Validation Settings
    Checklist for settlement validation rules
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Settlement Validation Checklist
    check_suspended_bills = models.BooleanField(
        default=True, 
        help_text="Check for suspended bills before allowing settlement"
    )
    check_partial_transactions = models.BooleanField(
        default=True,
        help_text="Check for partial transactions before allowing settlement"
    )
    require_settlement_before_session_close = models.BooleanField(
        default=True,
        help_text="Require settlement completion before closing session"
    )
    allow_deferred_settlement = models.BooleanField(
        default=True,
        help_text="Allow settlement to be done later (next day)"
    )
    require_session_ownership_to_close = models.BooleanField(
        default=True,
        help_text="Only session starter can close the session"
    )
    block_billing_on_pending_settlement = models.BooleanField(
        default=True,
        help_text="Block billing if previous session has pending settlement"
    )
    block_session_start_on_pending_settlement = models.BooleanField(
        default=True,
        help_text="Block new session start if previous session has pending settlement"
    )
    
    # Display and Notification Settings
    show_pending_settlement_alert = models.BooleanField(
        default=True,
        help_text="Show alert for pending settlements on POS open"
    )
    auto_remind_pending_settlement = models.BooleanField(
        default=True,
        help_text="Automatically remind about pending settlements"
    )
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='settlement_settings_updated')
    
    class Meta:
        db_table = 'settlement_settings'
        verbose_name = 'Settlement Settings'
        verbose_name_plural = 'Settlement Settings'
    
    def __str__(self):
        return f"Settlement Settings - {self.updated_at}"


class SettlementSettingDefinition(models.Model):
    """
    Metadata definitions for settlement settings with explicit sequencing
    """

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
        db_table = 'settlement_setting_definitions'
        verbose_name = 'Settlement Setting Definition'
        verbose_name_plural = 'Settlement Setting Definitions'
        ordering = ['category_sequence', 'sequence']

    def __str__(self):
        return f"{self.category_title} :: {self.field_label}"
