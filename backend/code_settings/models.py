from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class CodeSetting(models.Model):
    """
    Main model for managing various system codes and settings
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(
        max_length=50,
        choices=[
            ('SYSTEM', 'System Codes'),
            ('TRANSACTION', 'Transaction Codes'),
            ('CUSTOMER', 'Customer Codes'),
            ('PRODUCT', 'Product Codes'),
            ('PAYMENT', 'Payment Codes'),
            ('TAX', 'Tax Codes'),
            ('DISCOUNT', 'Discount Codes'),
            ('LOYALTY', 'Loyalty Codes'),
            ('REPORT', 'Report Codes'),
            ('OTHER', 'Other Codes'),
        ],
        help_text="Category of the code setting"
    )
    code_type = models.CharField(max_length=100, help_text="Type of code (e.g., Invoice Prefix, Receipt Number)")
    code_prefix = models.CharField(max_length=10, blank=True, null=True, help_text="Prefix for the code")
    code_suffix = models.CharField(max_length=10, blank=True, null=True, help_text="Suffix for the code")
    starting_number = models.IntegerField(default=1, help_text="Starting number for auto-generation")
    current_number = models.IntegerField(default=0, help_text="Current number in sequence")
    number_format = models.CharField(
        max_length=20,
        default='000000',
        help_text="Number format (e.g., 000000 for 6-digit numbers)"
    )
    description = models.TextField(blank=True, null=True, help_text="Description of the code setting")
    is_active = models.BooleanField(default=True)
    auto_generate = models.BooleanField(default=True, help_text="Whether to auto-generate codes")
    reset_frequency = models.CharField(
        max_length=20,
        choices=[
            ('DAILY', 'Daily'),
            ('WEEKLY', 'Weekly'),
            ('MONTHLY', 'Monthly'),
            ('YEARLY', 'Yearly'),
            ('NEVER', 'Never'),
        ],
        default='NEVER',
        help_text="How often to reset the counter"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='code_settings_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='code_settings_updated')

    class Meta:
        verbose_name = "Code Setting"
        verbose_name_plural = "Code Settings"
        ordering = ['category', 'code_type']
        unique_together = ('category', 'code_type')
        db_table = 'code_settings'

    def __str__(self):
        return f"{self.category}: {self.code_type}"

    def generate_next_code(self):
        """Generate the next code in sequence"""
        if not self.auto_generate:
            return None
        
        self.current_number += 1
        self.save()
        
        # Format the number according to the format
        formatted_number = str(self.current_number).zfill(len(self.number_format))
        
        # Build the complete code
        code_parts = []
        if self.code_prefix:
            code_parts.append(self.code_prefix)
        code_parts.append(formatted_number)
        if self.code_suffix:
            code_parts.append(self.code_suffix)
        
        return ''.join(code_parts)

    def reset_counter(self):
        """Reset the counter to starting number"""
        self.current_number = self.starting_number - 1
        self.save()


class CodeSettingHistory(models.Model):
    """
    History of code setting changes
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code_setting = models.ForeignKey(CodeSetting, on_delete=models.CASCADE, related_name='history')
    old_value = models.TextField(blank=True, null=True)
    new_value = models.TextField(blank=True, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    reason = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Code Setting History"
        verbose_name_plural = "Code Setting Histories"
        ordering = ['-changed_at']
        db_table = 'code_setting_history'

    def __str__(self):
        return f"History for {self.code_setting.code_type} at {self.changed_at.strftime('%Y-%m-%d %H:%M')}"


class CodeSettingTemplate(models.Model):
    """
    Templates for common code settings
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template_name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50)
    code_type = models.CharField(max_length=100)
    code_prefix = models.CharField(max_length=10, blank=True, null=True)
    code_suffix = models.CharField(max_length=10, blank=True, null=True)
    starting_number = models.IntegerField(default=1)
    number_format = models.CharField(max_length=20, default='000000')
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='code_templates_created')

    class Meta:
        verbose_name = "Code Setting Template"
        verbose_name_plural = "Code Setting Templates"
        ordering = ['template_name']
        db_table = 'code_setting_templates'

    def __str__(self):
        return self.template_name


class CodeSettingRule(models.Model):
    """
    Rules for code generation and validation
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rule_name = models.CharField(max_length=100, unique=True)
    rule_type = models.CharField(
        max_length=50,
        choices=[
            ('VALIDATION', 'Validation Rule'),
            ('GENERATION', 'Generation Rule'),
            ('FORMAT', 'Format Rule'),
            ('RESET', 'Reset Rule'),
        ]
    )
    rule_expression = models.TextField(help_text="Rule expression or logic")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='code_rules_created')

    class Meta:
        verbose_name = "Code Setting Rule"
        verbose_name_plural = "Code Setting Rules"
        ordering = ['rule_name']
        db_table = 'code_setting_rules'

    def __str__(self):
        return self.rule_name