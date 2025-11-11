from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Supplier


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    """
    Admin configuration for Supplier model.
    """
    
    list_display = [
        'supplier_code', 'display_name_admin', 'supplier_type_badge',
        'contact_person', 'email', 'phone', 'city', 'status_badges',
        'lead_time_days', 'total_orders_display', 'created_at'
    ]
    
    list_filter = [
        'supplier_type', 'is_active', 'is_preferred', 'is_verified',
        'payment_terms', 'created_at', 'last_order_date', 'country', 'state'
    ]
    
    search_fields = [
        'supplier_code', 'company_name', 'trade_name', 'contact_person',
        'email', 'phone', 'mobile'
    ]
    
    readonly_fields = [
        'id', 'supplier_code', 'created_at', 'updated_at',
        'display_name', 'full_address'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'id', 'supplier_code', 'company_name', 'trade_name',
                'supplier_type', 'display_name'
            )
        }),
        ('Contact Information', {
            'fields': (
                ('contact_person', 'contact_title'),
                ('email', 'phone'),
                ('mobile', 'website'),
            )
        }),
        ('Address', {
            'fields': (
                'address_line_1', 'address_line_2',
                ('city', 'state'),
                ('postal_code', 'country'),
                'full_address'
            )
        }),
        ('Business Information', {
            'fields': (
                'tax_id',
                ('payment_terms', 'lead_time_days'),
                ('credit_limit', 'discount_percentage'),
                'minimum_order_amount',
            )
        }),
        ('Status & Settings', {
            'fields': (
                ('is_active', 'is_preferred'),
                'is_verified',
            )
        }),
        ('Additional Information', {
            'fields': (
                'notes',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at', 'updated_at', 'last_order_date'
            ),
            'classes': ('collapse',)
        })
    )
    
    ordering = ['company_name']
    date_hierarchy = 'created_at'
    
    actions = [
        'activate_suppliers', 'deactivate_suppliers',
        'make_preferred', 'remove_preferred',
        'verify_suppliers', 'unverify_suppliers'
    ]
    
    def display_name_admin(self, obj):
        """Display supplier name with link to detail."""
        url = reverse('admin:suppliers_supplier_change', args=[obj.pk])
        return format_html('<a href="{}">{}</a>', url, obj.display_name)
    display_name_admin.short_description = 'Supplier Name'
    display_name_admin.admin_order_field = 'company_name'
    
    def supplier_type_badge(self, obj):
        """Display supplier type as colored badge."""
        colors = {
            'manufacturer': '#28a745',    # Green
            'distributor': '#007bff',     # Blue
            'wholesaler': '#6f42c1',      # Purple
            'retailer': '#fd7e14',        # Orange
            'dropshipper': '#20c997',     # Teal
            'service_provider': '#6c757d', # Gray
        }
        color = colors.get(obj.supplier_type, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.get_display_supplier_type()
        )
    supplier_type_badge.short_description = 'Type'
    supplier_type_badge.admin_order_field = 'supplier_type'
    
    def status_badges(self, obj):
        """Display status badges."""
        badges = []
        
        # Active/Inactive badge
        if obj.is_active:
            badges.append(
                '<span style="background-color: #28a745; color: white; padding: 2px 6px; '
                'border-radius: 10px; font-size: 10px; margin-right: 2px;">Active</span>'
            )
        else:
            badges.append(
                '<span style="background-color: #dc3545; color: white; padding: 2px 6px; '
                'border-radius: 10px; font-size: 10px; margin-right: 2px;">Inactive</span>'
            )
        
        # Preferred badge
        if obj.is_preferred:
            badges.append(
                '<span style="background-color: #ffc107; color: black; padding: 2px 6px; '
                'border-radius: 10px; font-size: 10px; margin-right: 2px;">Preferred</span>'
            )
        
        # Verified badge
        if obj.is_verified:
            badges.append(
                '<span style="background-color: #17a2b8; color: white; padding: 2px 6px; '
                'border-radius: 10px; font-size: 10px; margin-right: 2px;">Verified</span>'
            )
        
        return format_html(''.join(badges))
    status_badges.short_description = 'Status'
    
    def total_orders_display(self, obj):
        """Display total orders (placeholder)."""
        total = obj.get_total_orders()
        count = obj.get_order_count()
        if count > 0:
            return format_html(
                '<strong>${:.2f}</strong><br><small>({} orders)</small>',
                total, count
            )
        return format_html('<span style="color: #6c757d;">No orders</span>')
    total_orders_display.short_description = 'Total Orders'
    
    # Admin Actions
    def activate_suppliers(self, request, queryset):
        """Activate selected suppliers."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} suppliers were successfully activated.')
    activate_suppliers.short_description = 'Activate selected suppliers'
    
    def deactivate_suppliers(self, request, queryset):
        """Deactivate selected suppliers."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} suppliers were successfully deactivated.')
    deactivate_suppliers.short_description = 'Deactivate selected suppliers'
    
    def make_preferred(self, request, queryset):
        """Make selected suppliers preferred."""
        updated = queryset.update(is_preferred=True)
        self.message_user(request, f'{updated} suppliers were granted preferred status.')
    make_preferred.short_description = 'Grant preferred status'
    
    def remove_preferred(self, request, queryset):
        """Remove preferred status from selected suppliers."""
        updated = queryset.update(is_preferred=False)
        self.message_user(request, f'Preferred status removed from {updated} suppliers.')
    remove_preferred.short_description = 'Remove preferred status'
    
    def verify_suppliers(self, request, queryset):
        """Verify selected suppliers."""
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} suppliers were verified.')
    verify_suppliers.short_description = 'Verify suppliers'
    
    def unverify_suppliers(self, request, queryset):
        """Unverify selected suppliers."""
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} suppliers were unverified.')
    unverify_suppliers.short_description = 'Unverify suppliers'
    
    def get_queryset(self, request):
        """Optimize queryset for admin list view."""
        return super().get_queryset(request).select_related()
    
    def save_model(self, request, obj, form, change):
        """Custom save logic for admin."""
        super().save_model(request, obj, form, change)
        
        # Log the action
        action = 'updated' if change else 'created'
        print(f"Supplier {action} via admin: {obj.display_name} ({obj.supplier_code})")
    
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)  # Add custom CSS if needed
        }
        js = ('admin/js/custom_admin.js',)  # Add custom JS if needed