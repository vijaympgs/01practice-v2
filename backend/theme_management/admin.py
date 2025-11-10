from django.contrib import admin
from .models import ThemeSetting

@admin.register(ThemeSetting)
class ThemeSettingAdmin(admin.ModelAdmin):
    list_display = [
        'theme_name',
        'primary_color',
        'secondary_color',
        'is_active',
        'created_by',
        'created_at'
    ]
    list_filter = ['theme_name', 'is_active', 'created_at']
    search_fields = ['theme_name', 'primary_color', 'secondary_color']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Theme Information', {
            'fields': ('theme_name', 'is_active')
        }),
        ('Colors', {
            'fields': ('primary_color', 'secondary_color', 'background_color')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Creating new theme
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
