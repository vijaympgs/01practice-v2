from django.contrib import admin
from .models import (
    POSMaster, POSMasterSettings, POSMasterHistory, POSMasterMapping, 
    CurrencyDenomination, Terminal, PrinterTemplate, TerminalTransactionSetting,
    TerminalTenderMapping, TerminalDepartmentMapping, SettlementReason
)

@admin.register(POSMaster)
class POSMasterAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'master_type', 'is_active', 'is_system_generated', 'display_order', 'updated_at')
    list_filter = ('master_type', 'is_active', 'is_system_generated', 'requires_authorization')
    search_fields = ('name', 'code', 'description')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'master_type', 'description')
        }),
        ('Configuration', {
            'fields': ('is_active', 'is_system_generated', 'requires_authorization', 'display_order')
        }),
        ('Display Settings', {
            'fields': ('icon_name', 'color_code')
        }),
        ('Permissions', {
            'fields': ('allow_edit', 'allow_delete')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(POSMasterSettings)
class POSMasterSettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'enable_auto_code_generation', 'code_prefix_length', 'allow_duplicate_names', 'updated_at')
    readonly_fields = ('created_at', 'updated_at', 'updated_by')
    fieldsets = (
        ('Code Generation', {
            'fields': ('enable_auto_code_generation', 'code_prefix_length')
        }),
        ('Display Settings', {
            'fields': ('allow_duplicate_names', 'default_display_order', 'show_inactive_items')
        }),
        ('Validation Settings', {
            'fields': ('require_description', 'validate_code_format')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(POSMasterHistory)
class POSMasterHistoryAdmin(admin.ModelAdmin):
    list_display = ('pos_master', 'field_name', 'old_value', 'new_value', 'changed_by', 'changed_at')
    list_filter = ('changed_at', 'field_name', 'pos_master__master_type')
    search_fields = ('pos_master__name', 'reason')
    readonly_fields = ('changed_at',)

@admin.register(POSMasterMapping)
class POSMasterMappingAdmin(admin.ModelAdmin):
    list_display = ('pos_master', 'mapping_type', 'mapped_entity_name', 'is_active', 'created_at')
    list_filter = ('mapping_type', 'is_active', 'pos_master__master_type')
    search_fields = ('pos_master__name', 'mapped_entity_name')
    readonly_fields = ('created_at', 'updated_at', 'created_by')

@admin.register(CurrencyDenomination)
class CurrencyDenominationAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'currency', 'denomination_type', 'value', 'is_active', 'display_order')
    list_filter = ('denomination_type', 'is_active', 'currency')
    search_fields = ('display_name', 'currency__name', 'currency__code')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    fieldsets = (
        ('Currency Information', {
            'fields': ('currency',)
        }),
        ('Denomination Details', {
            'fields': ('denomination_type', 'value', 'display_name')
        }),
        ('Display Settings', {
            'fields': ('display_order', 'is_active')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PrinterTemplate)
class PrinterTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'template_type', 'is_default', 'is_active', 'created_at')
    list_filter = ('template_type', 'is_default', 'is_active')
    search_fields = ('name', 'template_type')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'template_type', 'template_content', 'is_default', 'is_active')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TerminalTransactionSetting)
class TerminalTransactionSettingAdmin(admin.ModelAdmin):
    list_display = ('terminal', 'transaction_type', 'allow', 'printer_template', 'updated_at')
    list_filter = ('transaction_type', 'allow', 'terminal')
    search_fields = ('terminal__name', 'terminal__terminal_code', 'transaction_type')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    fieldsets = (
        ('Transaction Settings', {
            'fields': ('terminal', 'transaction_type', 'allow', 'printer_template')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TerminalTenderMapping)
class TerminalTenderMappingAdmin(admin.ModelAdmin):
    list_display = ('terminal', 'tender_type', 'allow_tender', 'allow_refund', 'minimum_value', 'maximum_value', 'updated_at')
    list_filter = ('tender_type', 'allow_tender', 'allow_refund', 'terminal')
    search_fields = ('terminal__name', 'terminal__terminal_code', 'tender_type')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    fieldsets = (
        ('Tender Mapping', {
            'fields': ('terminal', 'tender_type', 'minimum_value', 'maximum_value', 'allow_tender', 'allow_refund')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TerminalDepartmentMapping)
class TerminalDepartmentMappingAdmin(admin.ModelAdmin):
    list_display = ('terminal', 'department', 'allow', 'updated_at')
    list_filter = ('allow', 'terminal', 'department')
    search_fields = ('terminal__name', 'terminal__terminal_code', 'department__name')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    fieldsets = (
        ('Department Mapping', {
            'fields': ('terminal', 'department', 'allow')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )


@admin.register(SettlementReason)
class SettlementReasonAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'reason_type', 'module_ref', 'is_active', 'updated_at')
    list_filter = ('reason_type', 'is_active', 'module_ref')
    search_fields = ('name', 'code', 'module_ref', 'app_ref')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    fieldsets = (
        ('Reason Details', {
            'fields': ('name', 'code', 'reason_type', 'description')
        }),
        ('References', {
            'fields': ('module_ref', 'app_ref')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Terminal)
class TerminalAdmin(admin.ModelAdmin):
    list_display = ('name', 'terminal_code', 'terminal_type', 'company', 'location', 'status', 'is_active', 'last_sync', 'updated_at')
    list_filter = ('terminal_type', 'status', 'is_active', 'network_type', 'company', 'location')
    search_fields = ('name', 'terminal_code', 'description', 'serial_number', 'ip_address', 'mac_address', 'system_name')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by', 'last_sync', 'system_name')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'terminal_code', 'terminal_type', 'description', 'is_active', 'status', 'system_name', 'auto_login_pos')
        }),
        ('Location & Company', {
            'fields': ('company', 'location', 'floor_location', 'department')
        }),
        ('Contact Information', {
            'fields': ('contact_person', 'contact_phone', 'contact_email', 'operating_hours', 'installation_date')
        }),
        ('Network Configuration', {
            'fields': ('ip_address', 'mac_address', 'serial_number', 'network_type', 'wifi_ssid', 'wifi_password')
        }),
        ('Hardware Configuration', {
            'fields': ('hardware_config',),
            'classes': ('collapse',)
        }),
        ('Regional Settings', {
            'fields': ('currency', 'language', 'timezone', 'date_format', 'time_format')
        }),
        ('Business Rules', {
            'fields': ('allow_discounts', 'allow_refunds', 'require_customer_info', 
                      'max_transaction_amount', 'min_transaction_amount', 
                      'max_discount_percentage', 'require_manager_approval')
        }),
        ('Operational Settings', {
            'fields': ('auto_receipt', 'auto_print', 'enable_loyalty', 'enable_offline_mode',
                      'sync_interval', 'session_timeout')
        }),
        ('Tax Configuration', {
            'fields': ('tax_rate', 'tax_inclusive', 'enable_tax_calculation')
        }),
        ('Backup Settings', {
            'fields': ('auto_backup', 'backup_interval', 'backup_retention')
        }),
        ('Security Settings', {
            'fields': ('require_pin', 'audit_log_enabled', 'enable_biometric',
                      'max_login_attempts', 'lockout_duration')
        }),
        ('Sync Information', {
            'fields': ('last_sync',),
            'classes': ('collapse',)
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )
