"""
Procurement Admin
NewBorn Retail™ - AI-Powered Enterprise ERP System
"""

from django.contrib import admin
from .models import (
    PurchaseRequest, PurchaseRequestItem,
    PurchaseEnquiry, PurchaseEnquiryItem,
    PurchaseQuotation, PurchaseQuotationItem,
    PurchaseOrder, PurchaseOrderItem,
    GoodsReceivedNote, GoodsReceivedNoteItem,
    PurchaseInvoice, PurchaseInvoiceItem,
    PurchaseReturn, PurchaseReturnItem
)


# ============================================================================
# Purchase Request Admin
# ============================================================================

class PurchaseRequestItemInline(admin.TabularInline):
    """Purchase Request Item Inline"""
    model = PurchaseRequestItem
    extra = 0
    fields = ['item_code', 'description', 'quantity', 'unit_price', 'total']
    readonly_fields = ['total']


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    """Purchase Request Admin"""
    list_display = ['request_number', 'request_date', 'requested_by', 'department', 'priority', 'status', 'total_amount']
    list_filter = ['status', 'priority', 'department', 'request_date']
    search_fields = ['request_number', 'requested_by__username', 'department']
    readonly_fields = ['id', 'request_number', 'created_at', 'updated_at']
    date_hierarchy = 'request_date'
    inlines = [PurchaseRequestItemInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'request_number', 'request_date', 'requested_by', 'department')
        }),
        ('Request Details', {
            'fields': ('priority', 'justification', 'expected_delivery', 'status', 'approval_status')
        }),
        ('Financial', {
            'fields': ('total_amount',)
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


# ============================================================================
# Purchase Enquiry Admin
# ============================================================================

class PurchaseEnquiryItemInline(admin.TabularInline):
    """Purchase Enquiry Item Inline"""
    model = PurchaseEnquiryItem
    extra = 0
    fields = ['item_code', 'description', 'quantity', 'unit_price', 'total']
    readonly_fields = ['total']


@admin.register(PurchaseEnquiry)
class PurchaseEnquiryAdmin(admin.ModelAdmin):
    """Purchase Enquiry Admin"""
    list_display = ['enquiry_number', 'enquiry_date', 'supplier', 'status', 'total_amount']
    list_filter = ['status', 'enquiry_date']
    search_fields = ['enquiry_number', 'supplier__name']
    readonly_fields = ['id', 'enquiry_number', 'created_at', 'updated_at']
    date_hierarchy = 'enquiry_date'
    inlines = [PurchaseEnquiryItemInline]


# ============================================================================
# Purchase Quotation Admin
# ============================================================================

class PurchaseQuotationItemInline(admin.TabularInline):
    """Purchase Quotation Item Inline"""
    model = PurchaseQuotationItem
    extra = 0
    fields = ['item_code', 'description', 'quantity', 'unit_price', 'discount_percentage', 'tax_percentage', 'total', 'lead_time_days']
    readonly_fields = ['discount_amount', 'tax_amount', 'total']


@admin.register(PurchaseQuotation)
class PurchaseQuotationAdmin(admin.ModelAdmin):
    """Purchase Quotation Admin"""
    list_display = ['quotation_number', 'quotation_date', 'supplier', 'status', 'total_amount', 'valid_until']
    list_filter = ['status', 'quotation_date']
    search_fields = ['quotation_number', 'supplier__name']
    readonly_fields = ['id', 'quotation_number', 'created_at', 'updated_at']
    date_hierarchy = 'quotation_date'
    inlines = [PurchaseQuotationItemInline]


# ============================================================================
# Purchase Order Admin
# ============================================================================

class PurchaseOrderItemInline(admin.TabularInline):
    """Purchase Order Item Inline"""
    model = PurchaseOrderItem
    extra = 0
    fields = ['item_code', 'description', 'quantity', 'unit_price', 'received_quantity', 'total']
    readonly_fields = ['discount_amount', 'tax_amount', 'total']


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    """Purchase Order Admin"""
    list_display = ['order_number', 'order_date', 'supplier', 'status', 'priority', 'total_amount']
    list_filter = ['status', 'priority', 'order_date']
    search_fields = ['order_number', 'supplier__name']
    readonly_fields = ['id', 'order_number', 'created_at', 'updated_at', 'created_by']
    date_hierarchy = 'order_date'
    inlines = [PurchaseOrderItemInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'order_number', 'order_date', 'supplier', 'purchase_request', 'purchase_quotation')
        }),
        ('Order Details', {
            'fields': ('priority', 'delivery_date', 'payment_terms', 'delivery_address', 'special_instructions', 'status')
        }),
        ('Financial', {
            'fields': ('subtotal', 'tax_amount', 'discount_amount', 'total_amount')
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )


# ============================================================================
# GRN Admin
# ============================================================================

class GoodsReceivedNoteItemInline(admin.TabularInline):
    """GRN Item Inline"""
    model = GoodsReceivedNoteItem
    extra = 0
    fields = ['item_code', 'description', 'ordered_quantity', 'received_quantity', 'accepted_quantity', 'rejected_quantity', 'condition', 'total']
    readonly_fields = ['total']


@admin.register(GoodsReceivedNote)
class GoodsReceivedNoteAdmin(admin.ModelAdmin):
    """GRN Admin"""
    list_display = ['grn_number', 'grn_date', 'supplier', 'purchase_order', 'status', 'received_amount']
    list_filter = ['status', 'grn_date']
    search_fields = ['grn_number', 'supplier__name', 'delivery_note']
    readonly_fields = ['id', 'grn_number', 'created_at', 'updated_at']
    date_hierarchy = 'grn_date'
    inlines = [GoodsReceivedNoteItemInline]


# ============================================================================
# Purchase Invoice Admin
# ============================================================================

class PurchaseInvoiceItemInline(admin.TabularInline):
    """Purchase Invoice Item Inline"""
    model = PurchaseInvoiceItem
    extra = 0
    fields = ['item_code', 'description', 'quantity', 'unit_price', 'tax_percentage', 'total']
    readonly_fields = ['discount_amount', 'tax_amount', 'total']


@admin.register(PurchaseInvoice)
class PurchaseInvoiceAdmin(admin.ModelAdmin):
    """Purchase Invoice Admin"""
    list_display = ['invoice_number', 'invoice_date', 'supplier', 'status', 'net_amount', 'balance_amount', 'due_date']
    list_filter = ['status', 'invoice_date', 'due_date']
    search_fields = ['invoice_number', 'supplier__name']
    readonly_fields = ['id', 'invoice_number', 'balance_amount', 'created_at', 'updated_at']
    date_hierarchy = 'invoice_date'
    inlines = [PurchaseInvoiceItemInline]


# ============================================================================
# Purchase Return Admin
# ============================================================================

class PurchaseReturnItemInline(admin.TabularInline):
    """Purchase Return Item Inline"""
    model = PurchaseReturnItem
    extra = 0
    fields = ['item_code', 'description', 'quantity', 'unit_price', 'tax_percentage', 'total', 'return_reason']
    readonly_fields = ['tax_amount', 'total']


@admin.register(PurchaseReturn)
class PurchaseReturnAdmin(admin.ModelAdmin):
    """Purchase Return Admin"""
    list_display = ['return_number', 'return_date', 'supplier', 'status', 'total_amount']
    list_filter = ['status', 'return_date']
    search_fields = ['return_number', 'supplier__name']
    readonly_fields = ['id', 'return_number', 'created_at', 'updated_at', 'created_by']
    date_hierarchy = 'return_date'
    inlines = [PurchaseReturnItemInline]
