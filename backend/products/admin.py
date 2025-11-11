from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Product, UOM, UOMConversion, ItemMaster


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin configuration for Product model.
    """
    
    list_display = [
        'name', 'sku', 'barcode', 'price', 'cost',
        'stock_quantity', 'stock_status_display', 'profit_margin_display',
        'is_active', 'created_at'
    ]
    
    list_filter = [
        'is_active', 'is_taxable', 'brand', 'model',
        'created_at', 'updated_at'
    ]
    
    search_fields = [
        'name', 'sku', 'barcode', 'description', 'brand', 'model'
    ]
    
    readonly_fields = [
        'id', 'profit_margin', 'profit_amount', 'stock_status',
        'stock_value', 'can_be_sold', 'created_at', 'updated_at',
        'image_preview'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'id', 'name', 'description', 'sku', 'barcode'
            )
        }),
        ('Pricing', {
            'fields': (
                'price', 'cost', 'profit_margin', 'profit_amount'
            )
        }),
        ('Inventory', {
            'fields': (
                'stock_quantity', 'minimum_stock', 'maximum_stock',
                'stock_status', 'stock_value', 'can_be_sold'
            )
        }),
        ('Product Details', {
            'fields': (
                'weight', 'dimensions', 'color', 'size', 'brand', 'model'
            ),
            'classes': ('collapse',)
        }),
        ('Tax & Status', {
            'fields': (
                'is_active', 'is_taxable', 'tax_rate'
            )
        }),
        ('Media', {
            'fields': (
                'image', 'image_preview'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at', 'updated_at'
            ),
            'classes': ('collapse',)
        })
    )
    
    ordering = ['name']
    
    def stock_status_display(self, obj):
        """Display stock status with color coding."""
        status = obj.stock_status
        colors = {
            'out_of_stock': 'red',
            'low_stock': 'orange',
            'in_stock': 'green',
            'overstocked': 'blue'
        }
        color = colors.get(status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            status.replace('_', ' ').title()
        )
    stock_status_display.short_description = 'Stock Status'
    
    def profit_margin_display(self, obj):
        """Display profit margin with color coding."""
        margin = obj.profit_margin
        if margin < 0:
            color = 'red'
        elif margin < 20:
            color = 'orange'
        else:
            color = 'green'
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{:.1f}%</span>',
            color,
            margin
        )
    profit_margin_display.short_description = 'Profit Margin'
    
    def image_preview(self, obj):
        """Display image preview in admin."""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 200px;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = 'Image Preview'
    
    def get_queryset(self, request):
        """Optimize queryset for admin list view."""
        return super().get_queryset(request)
    
    def save_model(self, request, obj, form, change):
        """Custom save logic for admin."""
        # Validate the model before saving
        obj.full_clean()
        super().save_model(request, obj, form, change)
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of products with stock."""
        if obj and obj.stock_quantity > 0:
            return False
        return super().has_delete_permission(request, obj)
    
    def get_readonly_fields(self, request, obj=None):
        """Make certain fields readonly based on conditions."""
        readonly_fields = list(super().get_readonly_fields(request, obj))
        
        # Make SKU readonly after creation to prevent changes
        if obj and obj.pk:
            readonly_fields.append('sku')
        
        return readonly_fields
    
    actions = ['activate_products', 'deactivate_products', 'reset_stock']
    
    def activate_products(self, request, queryset):
        """Activate selected products."""
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            f'{updated} products were successfully activated.'
        )
    activate_products.short_description = "Activate selected products"
    
    def deactivate_products(self, request, queryset):
        """Deactivate selected products."""
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            f'{updated} products were successfully deactivated.'
        )
    deactivate_products.short_description = "Deactivate selected products"
    
    def reset_stock(self, request, queryset):
        """Reset stock quantity to 0 for selected products."""
        updated = queryset.update(stock_quantity=0)
        self.message_user(
            request,
            f'Stock quantity was reset to 0 for {updated} products.'
        )
    reset_stock.short_description = "Reset stock to 0"
    
    class Media:
        css = {
            'all': ('admin/css/product_admin.css',)
        }
        js = ('admin/js/product_admin.js',)


@admin.register(UOM)
class UOMAdmin(admin.ModelAdmin):
    """Admin configuration for UOM model"""
    
    list_display = ['code', 'description', 'basis', 'decimals', 'is_stock_uom', 'is_purchase_uom', 'is_sales_uom', 'is_active']
    list_filter = ['basis', 'is_stock_uom', 'is_purchase_uom', 'is_sales_uom', 'is_active']
    search_fields = ['code', 'description']
    ordering = ['code']


@admin.register(UOMConversion)
class UOMConversionAdmin(admin.ModelAdmin):
    """Admin configuration for UOM Conversion model"""
    
    list_display = ['from_uom', 'to_uom', 'conversion_factor', 'is_active']
    list_filter = ['is_active', 'from_uom', 'to_uom']
    search_fields = ['from_uom__code', 'to_uom__code']
    ordering = ['from_uom', 'to_uom']


@admin.register(ItemMaster)
class ItemMasterAdmin(admin.ModelAdmin):
    """Admin configuration for Item Master model"""
    
    list_display = ['item_code', 'item_name', 'brand', 'cost_price', 'sell_price', 'mrp', 'is_active']
    list_filter = ['is_active', 'material_type', 'item_type', 'exchange_type']
    search_fields = ['item_code', 'item_name', 'brand', 'ean_upc_code']
    ordering = ['item_name']