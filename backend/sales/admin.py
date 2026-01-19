from django.contrib import admin
from .models import Sale, SaleItem, Payment, POSSession, DayOpen, DayClose


class SaleItemInline(admin.TabularInline):
    """Inline for sale items."""
    model = SaleItem
    extra = 0
    readonly_fields = ['tax_amount', 'line_total']
    fields = [
        'product', 'quantity', 'unit_price', 'discount_amount',
        'tax_amount', 'line_total'
    ]


class PaymentInline(admin.TabularInline):
    """Inline for payments."""
    model = Payment
    extra = 0
    readonly_fields = ['payment_date']


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    """Admin configuration for Sale model."""
    
    list_display = [
        'sale_number', 'customer', 'sale_type', 'total_amount',
        'status', 'cashier', 'sale_date'
    ]
    list_filter = ['status', 'sale_type', 'sale_date']
    search_fields = ['sale_number', 'customer__first_name', 'customer__last_name']
    readonly_fields = [
        'sale_number', 'subtotal', 'tax_amount', 'total_amount',
        'sale_date', 'completed_at', 'created_at', 'updated_at'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('sale_number', 'sale_type', 'status')
        }),
        ('Parties', {
            'fields': ('customer', 'cashier', 'pos_session')
        }),
        ('Delivery', {
            'fields': (
                'delivery_type', 'delivery_address'
            ),
            'classes': ('collapse',)
        }),
        ('Financial', {
            'fields': (
                'subtotal', 'tax_amount', 'discount_percentage',
                'discount_amount', 'total_amount'
            )
        }),
        ('Timestamps', {
            'fields': ('sale_date', 'completed_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Additional', {
            'fields': ('notes',),
            'classes': ('collapse',)
        })
    )
    
    inlines = [SaleItemInline, PaymentInline]
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of completed sales."""
        if obj and obj.status == 'completed':
            return False
        return super().has_delete_permission(request, obj)


@admin.register(SaleItem)
class SaleItemAdmin(admin.ModelAdmin):
    """Admin configuration for SaleItem model."""
    
    list_display = [
        'sale', 'product', 'quantity', 'unit_price',
        'discount_amount', 'tax_amount', 'line_total'
    ]
    list_filter = ['sale__sale_date']
    search_fields = ['sale__sale_number', 'product__variant_name']
    readonly_fields = ['tax_amount', 'line_total']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin configuration for Payment model."""
    
    list_display = [
        'sale', 'payment_method', 'amount', 'status', 'payment_date'
    ]
    list_filter = ['payment_method', 'status', 'payment_date']
    search_fields = ['sale__sale_number', 'transaction_reference']
    readonly_fields = ['payment_date']


@admin.register(POSSession)
class POSSessionAdmin(admin.ModelAdmin):
    """Admin configuration for POSSession model."""
    
    list_display = [
        'session_number', 'cashier', 'opening_cash',
        'total_sales', 'status', 'opened_at', 'variance_reason'
    ]
    list_filter = ['status', 'opened_at', 'variance_reason']
    search_fields = ['session_number', 'cashier__username']
    readonly_fields = [
        'session_number', 'opened_at', 'closed_at',
        'expected_cash', 'cash_difference', 'total_sales',
        'interim_settlements'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('session_number', 'cashier', 'status')
        }),
        ('Cash Management', {
            'fields': (
                'opening_cash', 'closing_cash', 'expected_cash', 'base_expected_cash',
                'total_counted_cash', 'cash_difference', 'variance_reason'
            )
        }),
        ('Summary', {
            'fields': ('total_sales',)
        }),
        ('Timestamps', {
            'fields': ('opened_at', 'closed_at')
        }),
        ('Notes', {
            'fields': ('notes', 'interim_settlements'),
            'classes': ('collapse',)
        })
    )


@admin.register(DayOpen)
class DayOpenAdmin(admin.ModelAdmin):
    """Admin configuration for DayOpen model."""
    
    list_display = ['location', 'business_date', 'is_active', 'opened_by', 'opened_at']
    list_filter = ['is_active', 'business_date', 'location']
    search_fields = ['location__name', 'business_date']
    readonly_fields = ['opened_at', 'closed_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('location', 'business_date', 'is_active')
        }),
        ('Document Sequences', {
            'fields': ('next_sale_number', 'next_session_number')
        }),
        ('Details', {
            'fields': ('opened_by', 'closed_by', 'notes')
        }),
        ('Timestamps', {
            'fields': ('opened_at', 'closed_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(DayClose)
class DayCloseAdmin(admin.ModelAdmin):
    """Admin configuration for DayClose model."""
    
    list_display = ['location', 'business_date', 'status', 'initiated_by', 'initiated_at']
    list_filter = ['status', 'business_date', 'location']
    search_fields = ['location__name', 'business_date']
    readonly_fields = ['initiated_at', 'completed_at', 'reverted_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('location', 'business_date', 'status')
        }),
        ('Checklist', {
            'fields': ('checklist_items',)
        }),
        ('Consolidation', {
            'fields': (
                'total_transactions', 'total_sales_amount',
                'total_sessions', 'total_items_sold'
            )
        }),
        ('Document Sequences', {
            'fields': ('next_sale_number', 'next_session_number')
        }),
        ('Details', {
            'fields': ('initiated_by', 'reverted_by', 'notes')
        }),
        ('Errors & Warnings', {
            'fields': ('errors', 'warnings'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('initiated_at', 'completed_at', 'reverted_at'),
            'classes': ('collapse',)
        })
    )
