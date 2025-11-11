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
        """Admin interface for Role POS Function Mapping."""
        list_display = ['role', 'function', 'is_allowed', 'requires_approval', 'created_by', 'created_at']
        list_filter = ['role', 'is_allowed', 'requires_approval']
        search_fields = ['role', 'function__function_code', 'function__function_name']
        readonly_fields = ['created_at', 'updated_at']
        ordering = ['role', 'function__category', 'function__order']


# Import UserLocationMapping model
try:
    from .models import UserLocationMapping
except ImportError:
    UserLocationMapping = None

if UserLocationMapping:
    @admin.register(UserLocationMapping)
    class UserLocationMappingAdmin(admin.ModelAdmin):
        """Admin interface for User Location Mapping."""
        list_display = [
            'user', 'location', 'access_type', 'is_active', 'is_default', 
            'created_at', 'created_by'
        ]
        list_filter = [
            'user', 'location', 'location__company', 'access_type', 'is_active', 'is_default'
        ]
        search_fields = [
            'user__username', 'location__name', 'location__code'
        ]
        readonly_fields = ['created_at', 'updated_at']
        ordering = ['user__username', 'location__name']
        
        def get_queryset(self, request):
            # Filter based on user role for security
            qs = super().get_queryset(request)
            
            # If user is not superuser, only show mappings they created
            if not request.user.is_superuser:
                qs = qs.filter(created_by=request.user)
            
            return qs
        
        def formfield_for_foreignkey(self, db_field, request, **kwargs):
            # Filter location choices based on user role
            if db_field.name == 'location':
                form = super().formfield_for_foreignkey(db_field, request, **kwargs)
                
                if not request.user.is_superuser:
                    # For non-superusers, only show locations they can access
                    user = request.user
                    if hasattr(user, 'get_accessible_locations'):
                        accessible_locations = user.get_accessible_locations()
                        form.queryset = form.queryset.filter(id__in=accessible_locations)
                
                return form
            return super().formfield_for_foreignkey(db_field, request, **kwargs)
        
        def get_readonly_fields(self, request, obj=None):
            readonly_fields = super().get_readonly_fields(request, obj)
            if not request.user.is_superuser:
                readonly_fields += ['created_by']
            return readonly_fields
