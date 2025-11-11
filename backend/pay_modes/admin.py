from django.contrib import admin
from .models import PayMode, PayModeSettings, PayModeHistory, PayModeSettingDefinition

@admin.register(PayMode)
class PayModeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'payment_type', 'is_active', 'min_amount', 'max_amount', 'display_order', 'updated_at')
    list_filter = ('payment_type', 'is_active', 'requires_authorization', 'allow_refund')
    search_fields = ('name', 'code', 'description')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'payment_type', 'description')
        }),
        ('Configuration', {
            'fields': ('is_active', 'requires_authorization', 'min_amount', 'max_amount', 'display_order')
        }),
        ('Display Settings', {
            'fields': ('icon_name', 'color_code')
        }),
        ('Refund Settings', {
            'fields': ('allow_refund', 'allow_partial_refund', 'requires_receipt')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PayModeSettings)
class PayModeSettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'default_cash_paymode', 'require_payment_confirmation', 'allow_multiple_payments', 'updated_at')
    readonly_fields = ('created_at', 'updated_at', 'updated_by')
    fieldsets = (
        ('General Settings', {
            'fields': ('default_cash_paymode', 'require_payment_confirmation', 'allow_multiple_payments')
        }),
        ('Cash Handling', {
            'fields': ('enable_cash_drawer', 'auto_open_cash_drawer')
        }),
        ('Card Settings', {
            'fields': ('enable_card_payments', 'require_card_pin')
        }),
        ('Digital Payments', {
            'fields': ('enable_upi_payments', 'enable_qr_code')
        }),
        ('Refund Settings', {
            'fields': ('allow_refunds', 'require_refund_authorization', 'max_refund_percentage')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PayModeHistory)
class PayModeHistoryAdmin(admin.ModelAdmin):
    list_display = ('paymode', 'field_name', 'old_value', 'new_value', 'changed_by', 'changed_at')
    list_filter = ('changed_at', 'field_name', 'paymode__payment_type')
    search_fields = ('paymode__name', 'reason')
    readonly_fields = ('changed_at',)


@admin.register(PayModeSettingDefinition)
class PayModeSettingDefinitionAdmin(admin.ModelAdmin):
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
