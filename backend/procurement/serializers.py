"""
Procurement Serializers
NewBorn Retail™ - AI-Powered Enterprise ERP System
"""

from rest_framework import serializers
from .models import (
    PurchaseRequest, PurchaseRequestItem,
    PurchaseEnquiry, PurchaseEnquiryItem,
    PurchaseQuotation, PurchaseQuotationItem,
    PurchaseOrder, PurchaseOrderItem,
    GoodsReceivedNote, GoodsReceivedNoteItem,
    PurchaseInvoice, PurchaseInvoiceItem,
    PurchaseReturn, PurchaseReturnItem,
    PurchaseRequisition, PurchaseRequisitionLine
)


# ============================================================================
# Purchase Request Serializers
# ============================================================================

class PurchaseRequestItemSerializer(serializers.ModelSerializer):
    """Purchase Request Item Serializer"""
    product_code = serializers.CharField(source='product.code', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = PurchaseRequestItem
        fields = [
            'id', 'purchase_request', 'product', 'product_code', 'product_name',
            'item_code', 'description', 'quantity', 'unit_price', 'total', 'notes'
        ]


class PurchaseRequestSerializer(serializers.ModelSerializer):
    """Purchase Request Serializer"""
    requested_by_name = serializers.CharField(source='requested_by.username', read_only=True)
    requested_by_email = serializers.EmailField(source='requested_by.email', read_only=True)
    items = PurchaseRequestItemSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PurchaseRequest
        fields = [
            'id', 'request_number', 'request_date', 'requested_by', 'requested_by_name',
            'requested_by_email', 'department', 'priority', 'justification',
            'expected_delivery', 'total_amount', 'status', 'approval_status',
            'created_at', 'updated_at', 'notes', 'items', 'items_count'
        ]
        read_only_fields = ['id', 'request_number', 'created_at', 'updated_at']
    
    def get_items_count(self, obj):
        return obj.items.count()


class PurchaseRequestCreateSerializer(serializers.ModelSerializer):
    """Purchase Request Create/Update Serializer"""
    items = PurchaseRequestItemSerializer(many=True)
    
    class Meta:
        model = PurchaseRequest
        fields = [
            'request_date', 'requested_by', 'department', 'priority',
            'justification', 'expected_delivery', 'status', 'approval_status',
            'notes', 'items'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        request = PurchaseRequest.objects.create(**validated_data)
        
        for item_data in items_data:
            PurchaseRequestItem.objects.create(purchase_request=request, **item_data)
        
        # Update total amount
        request.total_amount = sum(item.total for item in request.items.all())
        request.save()
        
        return request
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update request fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items if provided
        if items_data is not None:
            # Delete existing items
            instance.items.all().delete()
            
            # Create new items
            for item_data in items_data:
                PurchaseRequestItem.objects.create(purchase_request=instance, **item_data)
            
            # Update total amount
            instance.total_amount = sum(item.total for item in instance.items.all())
            instance.save()
        
        return instance


# ============================================================================
# Purchase Enquiry Serializers
# ============================================================================

class PurchaseEnquiryItemSerializer(serializers.ModelSerializer):
    """Purchase Enquiry Item Serializer"""
    
    class Meta:
        model = PurchaseEnquiryItem
        fields = [
            'id', 'purchase_enquiry', 'product', 'item_code', 'description',
            'quantity', 'unit_price', 'total'
        ]


class PurchaseEnquirySerializer(serializers.ModelSerializer):
    """Purchase Enquiry Serializer"""
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    purchase_request_number = serializers.CharField(source='purchase_request.request_number', read_only=True)
    items = PurchaseEnquiryItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = PurchaseEnquiry
        fields = [
            'id', 'enquiry_number', 'enquiry_date', 'purchase_request',
            'purchase_request_number', 'supplier', 'supplier_name',
            'total_amount', 'status', 'created_at', 'updated_at', 'notes', 'items'
        ]
        read_only_fields = ['id', 'enquiry_number', 'created_at', 'updated_at']


# ============================================================================
# Purchase Quotation Serializers
# ============================================================================

class PurchaseQuotationItemSerializer(serializers.ModelSerializer):
    """Purchase Quotation Item Serializer"""
    
    class Meta:
        model = PurchaseQuotationItem
        fields = [
            'id', 'purchase_quotation', 'product', 'item_code', 'description',
            'quantity', 'unit_price', 'discount_percentage', 'discount_amount',
            'tax_percentage', 'tax_amount', 'total', 'lead_time_days'
        ]
        read_only_fields = ['discount_amount', 'tax_amount', 'total']


class PurchaseQuotationSerializer(serializers.ModelSerializer):
    """Purchase Quotation Serializer"""
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    enquiry_number = serializers.CharField(source='purchase_enquiry.enquiry_number', read_only=True)
    items = PurchaseQuotationItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = PurchaseQuotation
        fields = [
            'id', 'quotation_number', 'quotation_date', 'valid_until',
            'purchase_enquiry', 'enquiry_number', 'supplier', 'supplier_name',
            'subtotal', 'tax_amount', 'discount_amount', 'total_amount',
            'status', 'created_at', 'updated_at', 'notes', 'items'
        ]
        read_only_fields = ['id', 'quotation_number', 'created_at', 'updated_at']


# ============================================================================
# Purchase Order Serializers
# ============================================================================

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    """Purchase Order Item Serializer"""
    pending_quantity = serializers.DecimalField(max_digits=10, decimal_places=3, read_only=True)
    
    class Meta:
        model = PurchaseOrderItem
        fields = [
            'id', 'purchase_order', 'product', 'item_code', 'description',
            'quantity', 'unit_price', 'discount_percentage', 'discount_amount',
            'tax_percentage', 'tax_amount', 'total', 'received_quantity',
            'pending_quantity', 'notes'
        ]
        read_only_fields = ['discount_amount', 'tax_amount', 'total', 'pending_quantity']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    """Purchase Order Serializer"""
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    request_number = serializers.CharField(source='purchase_request.request_number', read_only=True)
    quotation_number = serializers.CharField(source='purchase_quotation.quotation_number', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'order_number', 'order_date', 'purchase_request', 'request_number',
            'purchase_quotation', 'quotation_number', 'supplier', 'supplier_name',
            'priority', 'delivery_date', 'payment_terms', 'delivery_address',
            'special_instructions', 'subtotal', 'tax_amount', 'discount_amount',
            'total_amount', 'status', 'created_by', 'created_by_name',
            'created_at', 'updated_at', 'notes', 'items'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at', 'created_by']


# ============================================================================
# GRN Serializers
# ============================================================================

class GoodsReceivedNoteItemSerializer(serializers.ModelSerializer):
    """GRN Item Serializer"""
    
    class Meta:
        model = GoodsReceivedNoteItem
        fields = [
            'id', 'grn', 'purchase_order_item', 'product', 'item_code', 'description',
            'ordered_quantity', 'received_quantity', 'accepted_quantity',
            'rejected_quantity', 'batch_number', 'expiry_date', 'condition',
            'unit_price', 'total', 'remarks'
        ]
        read_only_fields = ['total']


class GoodsReceivedNoteSerializer(serializers.ModelSerializer):
    """GRN Serializer"""
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    purchase_order_number = serializers.CharField(source='purchase_order.order_number', read_only=True)
    received_by_name = serializers.CharField(source='received_by.username', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    items = GoodsReceivedNoteItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = GoodsReceivedNote
        fields = [
            'id', 'grn_number', 'grn_date', 'purchase_order', 'purchase_order_number',
            'supplier', 'supplier_name', 'delivery_note', 'challan_number',
            'total_amount', 'received_amount', 'pending_amount', 'received_by',
            'received_by_name', 'inspected_by', 'location', 'location_name',
            'status', 'remarks', 'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['id', 'grn_number', 'created_at', 'updated_at']


# ============================================================================
# Purchase Invoice Serializers
# ============================================================================

class PurchaseInvoiceItemSerializer(serializers.ModelSerializer):
    """Purchase Invoice Item Serializer"""
    
    class Meta:
        model = PurchaseInvoiceItem
        fields = [
            'id', 'purchase_invoice', 'product', 'item_code', 'description',
            'quantity', 'unit_price', 'discount_percentage', 'discount_amount',
            'tax_percentage', 'tax_amount', 'total', 'grn_item'
        ]
        read_only_fields = ['discount_amount', 'tax_amount', 'total']


class PurchaseInvoiceSerializer(serializers.ModelSerializer):
    """Purchase Invoice Serializer"""
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    grn_number = serializers.CharField(source='grn.grn_number', read_only=True)
    items = PurchaseInvoiceItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = PurchaseInvoice
        fields = [
            'id', 'invoice_number', 'invoice_date', 'grn', 'grn_number',
            'supplier', 'supplier_name', 'subtotal', 'tax_amount',
            'discount_amount', 'net_amount', 'paid_amount', 'balance_amount',
            'due_date', 'payment_terms', 'status', 'created_at', 'updated_at',
            'notes', 'items'
        ]
        read_only_fields = ['id', 'invoice_number', 'balance_amount', 'created_at', 'updated_at']


# ============================================================================
# Purchase Return Serializers
# ============================================================================

class PurchaseReturnItemSerializer(serializers.ModelSerializer):
    """Purchase Return Item Serializer"""
    
    class Meta:
        model = PurchaseReturnItem
        fields = [
            'id', 'purchase_return', 'product', 'item_code', 'description',
            'quantity', 'unit_price', 'tax_percentage', 'tax_amount', 'total',
            'grn_item', 'return_reason'
        ]
        read_only_fields = ['tax_amount', 'total']


class PurchaseReturnSerializer(serializers.ModelSerializer):
    """Purchase Return Serializer"""
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    grn_number = serializers.CharField(source='grn.grn_number', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    items = PurchaseReturnItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = PurchaseReturn
        fields = [
            'id', 'return_number', 'return_date', 'grn', 'grn_number',
            'supplier', 'supplier_name', 'subtotal', 'tax_amount', 'total_amount',
            'return_reason', 'status', 'created_by', 'created_by_name',
            'created_at', 'updated_at', 'notes', 'items'
        ]
        read_only_fields = ['id', 'return_number', 'created_at', 'updated_at', 'created_by']


# ============================================================================
# Purchase Requisition Serializers (4.1)
# ============================================================================

class PurchaseRequisitionLineSerializer(serializers.ModelSerializer):
    """Purchase Requisition Line Serializer"""
    item_code = serializers.CharField(source='item.item_code', read_only=True)
    item_name = serializers.CharField(source='item.item_name', read_only=True)
    uom_code = serializers.CharField(source='uom.code', read_only=True)
    uom_name = serializers.CharField(source='uom.description', read_only=True)
    remaining_qty = serializers.DecimalField(max_digits=15, decimal_places=3, read_only=True)
    
    class Meta:
        model = PurchaseRequisitionLine
        fields = [
            'id', 'purchase_requisition', 'item', 'item_code', 'item_name',
            'uom', 'uom_code', 'uom_name', 'requested_qty',
            'already_ordered_qty', 'remaining_qty', 'required_by_date',
            'line_remarks', 'line_status', 'line_number'
        ]
        read_only_fields = ['id', 'already_ordered_qty', 'remaining_qty', 'line_status']


class PurchaseRequisitionSerializer(serializers.ModelSerializer):
    """Purchase Requisition Header Serializer"""
    requested_by_name = serializers.CharField(source='requested_by.username', read_only=True)
    requesting_location_name = serializers.CharField(source='requesting_location.name', read_only=True)
    supplier_hint_name = serializers.CharField(source='supplier_hint.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    lines = PurchaseRequisitionLineSerializer(many=True, read_only=True)
    
    class Meta:
        model = PurchaseRequisition
        fields = [
            'id', 'company', 'pr_number', 'pr_status', 'requested_by', 'requested_by_name',
            'requesting_location', 'requesting_location_name', 'required_by_date',
            'priority', 'supplier_hint', 'supplier_hint_name', 'remarks',
            'approval_required', 'approved_by', 'approved_by_name', 'approved_at',
            'rejected_by', 'rejected_at', 'rejection_reason', 'converted_to_po',
            'created_at', 'updated_at', 'created_by', 'lines'
        ]
        read_only_fields = [
            'id', 'pr_number', 'pr_status', 'approved_by', 'approved_at',
            'rejected_by', 'rejected_at', 'converted_to_po', 'created_at',
            'updated_at', 'created_by'
        ]

class PurchaseRequisitionCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating PR with lines"""
    lines = PurchaseRequisitionLineSerializer(many=True)
    
    class Meta:
        model = PurchaseRequisition
        fields = [
            'company', 'requesting_location', 'required_by_date', 'priority',
            'supplier_hint', 'remarks', 'lines'
        ]
    
    def create(self, validated_data):
        lines_data = validated_data.pop('lines', [])
        user = self.context['request'].user
        
        # Set defaults
        validated_data['requested_by'] = user
        validated_data['created_by'] = user
        
        # Create header
        pr = PurchaseRequisition.objects.create(**validated_data)
        
        # Create lines
        for i, line_data in enumerate(lines_data):
            PurchaseRequisitionLine.objects.create(
                purchase_requisition=pr,
                line_number=i+1,
                **line_data
            )
            
        return pr

    def update(self, instance, validated_data):
        lines_data = validated_data.pop('lines', [])
        
        # Update header fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle lines (simple replacement for now, or smart update)
        # For simplicity in this iteration: delete all and recreate if provided
        if lines_data:
            instance.lines.all().delete()
            for i, line_data in enumerate(lines_data):
                PurchaseRequisitionLine.objects.create(
                    purchase_requisition=instance,
                    line_number=i+1,
                    **line_data
                )
        
        return instance
