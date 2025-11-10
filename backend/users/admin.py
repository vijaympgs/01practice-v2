from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()

try:
    from .models import POSFunction, RolePOSFunctionMapping
except ImportError:
    POSFunction = None
    RolePOSFunctionMapping = None


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'pos_location', 'is_active', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_superuser', 'is_active']
    search_fields = ['username', 'first_name', 'last_name', 'email']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'profile_image', 'pos_location')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'email', 'first_name', 'last_name')}),
    )


if POSFunction:
    @admin.register(POSFunction)
    class POSFunctionAdmin(admin.ModelAdmin):
        """Admin interface for POS Function model."""
        list_display = ['function_code', 'function_name', 'category', 'keyboard_shortcut', 'is_critical', 'is_active', 'order']
        list_filter = ['category', 'is_critical', 'is_active']
        search_fields = ['function_code', 'function_name', 'description']
        ordering = ['category', 'order']


if RolePOSFunctionMapping:
    @admin.register(RolePOSFunctionMapping)
    class RolePOSFunctionMappingAdmin(admin.ModelAdmin):
        """Admin interface for Role POS Function Mapping model."""
        list_display = ['role', 'function', 'is_allowed', 'requires_approval', 'created_by', 'created_at']
        list_filter = ['role', 'is_allowed', 'requires_approval']
        search_fields = ['role', 'function__function_code', 'function__function_name']
        readonly_fields = ['created_at', 'updated_at']
        ordering = ['role', 'function__category', 'function__order']
























































