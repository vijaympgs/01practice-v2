from django.contrib import admin
from .models import BusinessRule, BusinessRuleHistory, SettlementSettings, SettlementSettingDefinition

@admin.register(BusinessRule)
class BusinessRuleAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category', 'rule_type', 'current_value', 'is_active', 'updated_at')
    list_filter = ('category', 'rule_type', 'is_active', 'is_required')
    search_fields = ('name', 'code', 'description')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description', 'category', 'rule_type')
        }),
        ('Values', {
            'fields': ('default_value', 'current_value', 'validation_rules')
        }),
        ('Settings', {
            'fields': ('is_active', 'is_required', 'help_text')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(BusinessRuleHistory)
class BusinessRuleHistoryAdmin(admin.ModelAdmin):
    list_display = ('business_rule', 'old_value', 'new_value', 'changed_by', 'changed_at')
    list_filter = ('changed_at', 'business_rule__category')
    search_fields = ('business_rule__name', 'reason')
    readonly_fields = ('changed_at',)

@admin.register(SettlementSettings)
class SettlementSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'updated_at', 
        'check_suspended_bills', 
        'check_partial_transactions',
        'allow_deferred_settlement'
    )
    list_filter = (
        'check_suspended_bills',
        'check_partial_transactions', 
        'require_settlement_before_session_close',
        'allow_deferred_settlement',
        'require_session_ownership_to_close'
    )
    readonly_fields = ('created_at', 'updated_at', 'updated_by')
    
    fieldsets = (
        ('Settlement Validation', {
            'fields': (
                'check_suspended_bills',
                'check_partial_transactions',
                'require_settlement_before_session_close',
            )
        }),
        ('Session Management', {
            'fields': (
                'allow_deferred_settlement',
                'require_session_ownership_to_close',
            )
        }),
        ('Billing & Session Blocks', {
            'fields': (
                'block_billing_on_pending_settlement',
                'block_session_start_on_pending_settlement',
            )
        }),
        ('Notifications', {
            'fields': (
                'show_pending_settlement_alert',
                'auto_remind_pending_settlement',
            )
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'updated_by'),
            'classes': ('collapse',)
        }),
    )


@admin.register(SettlementSettingDefinition)
class SettlementSettingDefinitionAdmin(admin.ModelAdmin):
    list_display = (
        'category_sequence',
        'sequence',
        'category_title',
        'field_label',
        'field_name',
        'is_active',
    )
    list_filter = ('category_key', 'is_active')
    search_fields = ('field_label', 'field_name', 'category_title')
    ordering = ('category_sequence', 'sequence')
