from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    """
    Admin configuration for Customer model.
    """
    
    list_display = [
        'customer_code', 'display_name_admin', 'customer_type_badge',
        'email', 'phone', 'city', 'status_badge', 'vip_badge',
        'total_purchases_display', 'created_at'
    ]
    
    list_filter = [
        'customer_type', 'is_active', 'is_vip', 'allow_credit',
        'created_at', 'last_purchase_date', 'country', 'state'
    ]
    
    search_fields = [
        'customer_code', 'first_name', 'last_name', 'company_name',
        'email', 'phone', 'mobile'
    ]
    
    readonly_fields = [
        'id', 'customer_code', 'created_at', 'updated_at',
        'full_name', 'display_name', 'full_address'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'id', 'customer_code', 'customer_type',
                ('first_name', 'last_name'),
                'company_name'
            )
        }),
        ('Contact Information', {
            'fields': (
                ('email', 'phone'),
                'mobile',
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
                ('credit_limit', 'discount_percentage'),
            )
        }),
        ('Status & Settings', {
            'fields': (
                ('is_active', 'is_vip'),
                'allow_credit',
            )
        }),
        ('Additional Information', {
            'fields': (
                'date_of_birth',
                'notes',
            )
        }),
        ('Computed Fields', {
            'fields': (
                'full_name', 'display_name'
            ),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': (
                'created_at', 'updated_at', 'last_purchase_date'
            ),
            'classes': ('collapse',)
        })
    )
    
    ordering = ['last_name', 'first_name']
    date_hierarchy = 'created_at'
    
    actions = [
        'activate_customers', 'deactivate_customers',
        'make_vip', 'remove_vip',
        'enable_credit', 'disable_credit'
    ]
    
    def display_name_admin(self, obj):
        """Display customer name with link to detail."""
        url = reverse('admin:customers_customer_change', args=[obj.pk])
        return format_html('<a href="{}">{}</a>', url, obj.display_name)
    display_name_admin.short_description = 'Customer Name'
    display_name_admin.admin_order_field = 'last_name'
    
    def customer_type_badge(self, obj):
        """Display customer type as colored badge."""
        colors = {
            'individual': '#28a745',  # Green
            'business': '#007bff',    # Blue
            'wholesale': '#6f42c1',   # Purple
            'vip': '#ffc107',         # Yellow
        }
        color = colors.get(obj.customer_type, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.get_display_customer_type()
        )
    customer_type_badge.short_description = 'Type'
    customer_type_badge.admin_order_field = 'customer_type'
    
    def status_badge(self, obj):
        """Display active status as colored badge."""
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 2px 8px; '
                'border-radius: 12px; font-size: 11px; font-weight: bold;">Active</span>'
            )
        else:
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 2px 8px; '
                'border-radius: 12px; font-size: 11px; font-weight: bold;">Inactive</span>'
            )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'is_active'
    
    def vip_badge(self, obj):
        """Display VIP status."""
        if obj.is_vip:
            return format_html(
                '<span style="background-color: #ffc107; color: black; padding: 2px 8px; '
                'border-radius: 12px; font-size: 11px; font-weight: bold;">VIP</span>'
            )
        return '-'
    vip_badge.short_description = 'VIP'
    vip_badge.admin_order_field = 'is_vip'
    
    def total_purchases_display(self, obj):
        """Display total purchases (placeholder)."""
        total = obj.get_total_purchases()
        count = obj.get_purchase_count()
        if count > 0:
            return format_html(
                '<strong>${:.2f}</strong><br><small>({} purchases)</small>',
                total, count
            )
        return format_html('<span style="color: #6c757d;">No purchases</span>')
    total_purchases_display.short_description = 'Total Purchases'
    
    # Admin Actions
    def activate_customers(self, request, queryset):
        """Activate selected customers."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} customers were successfully activated.')
    activate_customers.short_description = 'Activate selected customers'
    
    def deactivate_customers(self, request, queryset):
        """Deactivate selected customers."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} customers were successfully deactivated.')
    deactivate_customers.short_description = 'Deactivate selected customers'
    
    def make_vip(self, request, queryset):
        """Make selected customers VIP."""
        updated = queryset.update(is_vip=True)
        self.message_user(request, f'{updated} customers were granted VIP status.')
    make_vip.short_description = 'Grant VIP status'
    
    def remove_vip(self, request, queryset):
        """Remove VIP status from selected customers."""
        updated = queryset.update(is_vip=False)
        self.message_user(request, f'VIP status removed from {updated} customers.')
    remove_vip.short_description = 'Remove VIP status'
    
    def enable_credit(self, request, queryset):
        """Enable credit for selected customers."""
        updated = queryset.update(allow_credit=True)
        self.message_user(request, f'Credit enabled for {updated} customers.')
    enable_credit.short_description = 'Enable credit'
    
    def disable_credit(self, request, queryset):
        """Disable credit for selected customers."""
        updated = queryset.update(allow_credit=False)
        self.message_user(request, f'Credit disabled for {updated} customers.')
    disable_credit.short_description = 'Disable credit'
    
    def get_queryset(self, request):
        """Optimize queryset for admin list view."""
        return super().get_queryset(request).select_related()
    
    def save_model(self, request, obj, form, change):
        """Custom save logic for admin."""
        super().save_model(request, obj, form, change)
        
        # Log the action
        action = 'updated' if change else 'created'
        print(f"Customer {action} via admin: {obj.display_name} ({obj.customer_code})")
    
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)  # Add custom CSS if needed
        }
        js = ('admin/js/custom_admin.js',)  # Add custom JS if needed