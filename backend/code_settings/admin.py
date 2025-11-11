from django.contrib import admin
from .models import CodeSetting, CodeSettingHistory, CodeSettingTemplate, CodeSettingRule

@admin.register(CodeSetting)
class CodeSettingAdmin(admin.ModelAdmin):
    list_display = ('code_type', 'category', 'code_prefix', 'current_number', 'is_active', 'auto_generate', 'updated_at')
    list_filter = ('category', 'is_active', 'auto_generate', 'reset_frequency')
    search_fields = ('code_type', 'description', 'code_prefix', 'code_suffix')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('category', 'code_type', 'description')
        }),
        ('Code Configuration', {
            'fields': ('code_prefix', 'code_suffix', 'starting_number', 'current_number', 'number_format')
        }),
        ('Settings', {
            'fields': ('is_active', 'auto_generate', 'reset_frequency')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(CodeSettingHistory)
class CodeSettingHistoryAdmin(admin.ModelAdmin):
    list_display = ('code_setting', 'changed_by', 'changed_at', 'old_value', 'new_value')
    list_filter = ('code_setting__category', 'changed_by')
    search_fields = ('code_setting__code_type', 'reason')
    readonly_fields = ('changed_at',)

@admin.register(CodeSettingTemplate)
class CodeSettingTemplateAdmin(admin.ModelAdmin):
    list_display = ('template_name', 'category', 'code_type', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('template_name', 'code_type', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(CodeSettingRule)
class CodeSettingRuleAdmin(admin.ModelAdmin):
    list_display = ('rule_name', 'rule_type', 'is_active', 'created_at')
    list_filter = ('rule_type', 'is_active')
    search_fields = ('rule_name', 'description')
    readonly_fields = ('created_at', 'updated_at')