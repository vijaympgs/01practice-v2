from django.contrib import admin
from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.utils.html import format_html

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


# Import MenuItemType model for admin interface
try:
    from .models import MenuItemType, UserPermission, GroupPermission
except ImportError:
    MenuItemType = None
    UserPermission = None
    GroupPermission = None


if MenuItemType:
    @admin.register(MenuItemType)
    class MenuControllerAdmin(admin.ModelAdmin):
        """Admin interface for Menu Item Type - Global Menu Controller"""
        list_display = [
            'category_badge', 
            'display_name', 
            'menu_item_id', 
            'menu_type', 
            'transaction_subtype',
            'is_active', 
            'order'
        ]
        list_filter = [
            'menu_type', 
            'transaction_subtype', 
            'category', 
            'is_active'
        ]
        search_fields = [
            'display_name', 
            'menu_item_id', 
            'category', 
            'description'
        ]
        # list_editable = ['is_active', 'order']  # Disabled due to multiselect conflicts
        list_editable = ['order']  # Only order is editable
        ordering = ['category', 'order', 'display_name']
        
        def formfield_for_dbfield(self, db_field, request, **kwargs):
            """Override form field for is_active to use multiselect widget"""
            if db_field.name == 'is_active':
                from django.forms import CheckboxSelectMultiple, ChoiceField
                from django import forms
                
                # Create a custom form field that handles boolean to list conversion
                class ActiveStatusField(forms.ChoiceField):
                    def __init__(self, *args, **kwargs):
                        choices = [
                            ('active', 'Active'),
                            ('inactive', 'Inactive')
                        ]
                        kwargs['choices'] = choices
                        kwargs['widget'] = forms.CheckboxSelectMultiple
                        kwargs['required'] = False
                        super().__init__(*args, **kwargs)
                    
                    def prepare_value(self, value):
                        """Convert boolean value to list for widget"""
                        if value is True:
                            return ['active']
                        elif value is False:
                            return ['inactive']
                        return []
                    
                    def clean(self, value):
                        """Convert list back to boolean"""
                        if value is None:
                            return False
                        if isinstance(value, list):
                            return 'active' in value
                        return 'active' in [value] if value else False
                    
                    def to_python(self, value):
                        """Convert the submitted value to a Python object"""
                        if value is None:
                            return False
                        if isinstance(value, list):
                            return 'active' in value
                        return 'active' in [value] if value else False
                    
                    def has_changed(self, initial, data):
                        """Override has_changed to handle boolean/list comparison"""
                        initial_bool = self.to_python(initial)
                        data_bool = self.to_python(data)
                        return initial_bool != data_bool
                
                kwargs['form_class'] = ActiveStatusField
                
            return super().formfield_for_dbfield(db_field, request, **kwargs)
        
        def category_badge(self, obj):
            """Display category with color coding"""
            category_colors = {
                'Home': '#4caf50',
                'User & Permissions': '#2196f3',
                'Master Data Management': '#ff9800',
                'Organization Setup': '#9c27b0',
                'Item': '#673ab7',
                'Point of Sale': '#f44336',
                'Inventory Management': '#009688',
                'Procurement': '#795548',
                'Stock Nexus': '#607d8b',
                'Sales': '#e91e63',
                'Reports': '#3f51b5',
                'System': '#9e9e9e',
            }
            color = category_colors.get(obj.category, '#666666')
            return format_html(
                '<span style="background-color: {}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold;">{}</span>',
                color,
                obj.category
            )
        category_badge.short_description = 'Menu Category'
        
        fieldsets = (
            ('Basic Information', {
                'fields': (
                    'display_name', 
                    'menu_item_id', 
                    'description', 
                    'category', 
                    'path'
                )
            }),
            ('Classification', {
                'fields': (
                    'menu_type', 
                    'transaction_subtype'
                ),
                'classes': ('collapse',)
            }),
            ('Display Control', {
                'fields': (
                    'is_active', 
                    'order'
                )
            }),
        )
        
        actions = [
            'bulk_activate_menu_items', 
            'bulk_deactivate_menu_items',
            'reset_menu_order'
        ]
        
        def bulk_activate_menu_items(self, request, queryset):
            """Activate selected menu items"""
            updated = queryset.update(is_active=True)
            self.message_user(
                request, 
                f'Successfully activated {updated} menu item(s).', 
                messages.SUCCESS
            )
        bulk_activate_menu_items.short_description = "Activate selected menu items"
        
        def bulk_deactivate_menu_items(self, request, queryset):
            """Deactivate selected menu items"""
            updated = queryset.update(is_active=False)
            self.message_user(
                request, 
                f'Successfully deactivated {updated} menu item(s).', 
                messages.WARNING
            )
        bulk_deactivate_menu_items.short_description = "Deactivate selected menu items"
        
        def reset_menu_order(self, request, queryset):
            """Reset menu order to default (10, 20, 30...)"""
            for index, item in enumerate(queryset):
                item.order = (index + 1) * 10
                item.save()
            self.message_user(
                request, 
                f'Reset order for {queryset.count()} menu item(s).', 
                messages.INFO
            )
        reset_menu_order.short_description = "Reset menu order"
        
        def get_queryset(self, request):
            qs = super().get_queryset(request)
            # Order by category, then order, then display name
            return qs.order_by('category', 'order', 'display_name')
        
        def changelist_view(self, request, extra_context=None):
            """Add custom context to changelist view"""
            extra_context = extra_context or {}
            
            # Add statistics
            total_items = MenuItemType.objects.count()
            active_items = MenuItemType.objects.filter(is_active=True).count()
            inactive_items = total_items - active_items
            
            extra_context.update({
                'total_menu_items': total_items,
                'active_menu_items': active_items,
                'inactive_menu_items': inactive_items,
                'menu_stats': {
                    'total': total_items,
                    'active': active_items,
                    'inactive': inactive_items,
                    'active_percentage': round((active_items / total_items * 100) if total_items > 0 else 0, 1)
                }
            })
            
            return super().changelist_view(request, extra_context)


if UserPermission:
    @admin.register(UserPermission)
    class UserPermissionAdmin(admin.ModelAdmin):
        """Admin interface for User Permissions"""
        list_display = [
            'user', 
            'menu_item', 
            'can_access', 
            'can_view', 
            'can_create', 
            'can_edit', 
            'can_delete',
            'override'
        ]
        list_filter = [
            'can_access', 
            'can_view', 
            'can_create', 
            'can_edit', 
            'can_delete',
            'override',
            'menu_item__category',
            'menu_item__menu_type'
        ]
        search_fields = [
            'user__username', 
            'menu_item__display_name', 
            'menu_item__menu_item_id'
        ]
        list_editable = [
            'can_access', 
            'can_view', 
            'can_create', 
            'can_edit', 
            'can_delete'
        ]
        ordering = ['user__username', 'menu_item__category', 'menu_item__order']
        
        actions = [
            'sync_with_active_menu_items',
            'reset_permissions_to_template',
            'bulk_grant_access',
            'bulk_revoke_access'
        ]
        
        def sync_with_active_menu_items(self, request, queryset):
            """Sync permissions with active menu items"""
            from django.db.models import Q
            
            # Get currently active menu items
            active_menu_items = MenuItemType.objects.filter(is_active=True)
            active_menu_ids = [item.id for item in active_menu_items]
            
            # Deactivate permissions for inactive menu items
            inactive_permissions = queryset.filter(
                ~Q(menu_item__id__in=active_menu_ids)
            )
            updated = inactive_permissions.update(
                can_access=False, 
                can_view=False, 
                can_create=False, 
                can_edit=False, 
                can_delete=False
            )
            
            self.message_user(
                request, 
                f'Updated permissions for {updated} inactive menu items.', 
                messages.INFO
            )
        sync_with_active_menu_items.short_description = "Sync with active menu items"
        
        def reset_permissions_to_template(self, request, queryset):
            """Reset permissions to role template defaults"""
            # This would integrate with the existing template system
            self.message_user(
                request, 
                'Permission reset to template - feature to be implemented.', 
                messages.INFO
            )
        reset_permissions_to_template.short_description = "Reset to template defaults"
        
        def bulk_grant_access(self, request, queryset):
            """Grant full access to selected permissions"""
            updated = queryset.update(
                can_access=True, 
                can_view=True, 
                can_create=True, 
                can_edit=True, 
                can_delete=True
            )
            self.message_user(
                request, 
                f'Granted full access to {updated} permission(s).', 
                messages.SUCCESS
            )
        bulk_grant_access.short_description = "Grant full access"
        
        def bulk_revoke_access(self, request, queryset):
            """Revoke all access from selected permissions"""
            updated = queryset.update(
                can_access=False, 
                can_view=False, 
                can_create=False, 
                can_edit=False, 
                can_delete=False
            )
            self.message_user(
                request, 
                f'Revoked access from {updated} permission(s).', 
                messages.WARNING
            )
        bulk_revoke_access.short_description = "Revoke all access"


if GroupPermission:
    @admin.register(GroupPermission)
    class GroupPermissionAdmin(admin.ModelAdmin):
        """Admin interface for Group/Role Permissions"""
        list_display = [
            'group', 
            'role_key', 
            'menu_item', 
            'can_access', 
            'can_view', 
            'can_create', 
            'can_edit', 
            'can_delete'
        ]
        list_filter = [
            'role_key', 
            'can_access', 
            'can_view', 
            'can_create', 
            'can_edit', 
            'can_delete',
            'menu_item__category',
            'menu_item__menu_type'
        ]
        search_fields = [
            'group__name', 
            'role_key', 
            'menu_item__display_name', 
            'menu_item__menu_item_id'
        ]
        list_editable = [
            'can_access', 
            'can_view', 
            'can_create', 
            'can_edit', 
            'can_delete'
        ]
        ordering = ['role_key', 'menu_item__category', 'menu_item__order']
        
        actions = [
            'sync_with_active_menu_items',
            'apply_role_template',
            'bulk_grant_access',
            'bulk_revoke_access'
        ]
        
        def sync_with_active_menu_items(self, request, queryset):
            """Sync role permissions with active menu items"""
            from django.db.models import Q
            
            # Get currently active menu items
            active_menu_items = MenuItemType.objects.filter(is_active=True)
            active_menu_ids = [item.id for item in active_menu_items]
            
            # Deactivate permissions for inactive menu items
            inactive_permissions = queryset.filter(
                ~Q(menu_item__id__in=active_menu_ids)
            )
            updated = inactive_permissions.update(
                can_access=False, 
                can_view=False, 
                can_create=False, 
                can_edit=False, 
                can_delete=False
            )
            
            self.message_user(
                request, 
                f'Updated role permissions for {updated} inactive menu items.', 
                messages.INFO
            )
        sync_with_active_menu_items.short_description = "Sync with active menu items"
        
        def apply_role_template(self, request, queryset):
            """Apply role template to selected permissions"""
            # This would integrate with the existing template system
            self.message_user(
                request, 
                'Role template application - feature to be implemented.', 
                messages.INFO
            )
        apply_role_template.short_description = "Apply role template"
        
        def bulk_grant_access(self, request, queryset):
            """Grant full access to selected role permissions"""
            updated = queryset.update(
                can_access=True, 
                can_view=True, 
                can_create=True, 
                can_edit=True, 
                can_delete=True
            )
            self.message_user(
                request, 
                f'Granted full access to {updated} role permission(s).', 
                messages.SUCCESS
            )
        bulk_grant_access.short_description = "Grant full access"
        
        def bulk_revoke_access(self, request, queryset):
            """Revoke all access from selected role permissions"""
            updated = queryset.update(
                can_access=False, 
                can_view=False, 
                can_create=False, 
                can_edit=False, 
                can_delete=False
            )
            self.message_user(
                request, 
                f'Revoked access from {updated} role permission(s).', 
                messages.WARNING
            )
        bulk_revoke_access.short_description = "Revoke all access"
