from rest_framework import serializers
from django.db import transaction
from .models import Inventory, StockMovement, PurchaseOrder, PurchaseOrderItem, StockAlert
from products.models import Product
from suppliers.models import Supplier


class InventorySerializer(serializers.ModelSerializer):
    """Serializer for inventory management"""
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    # category_name = serializers.CharField(source='product.category.name', read_only=True)
    stock_status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Inventory
        fields = [
            'id', 'product', 'product_name', 'product_sku', # 'category_name',
            'current_stock', 'reserved_stock', 'available_stock',
            'min_stock_level', 'max_stock_level', 'reorder_point', 'reorder_quantity',
            'cost_price', 'selling_price', 'location', 'bin_location',
            'last_movement_date', 'status', 'stock_status_display',
            'is_active', 'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['id', 'available_stock', 'status', 'last_movement_date', 'created_at', 'updated_at']

    def validate_current_stock(self, value):
        """Validate current stock is not negative"""
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value

    def validate_min_stock_level(self, value):
        """Validate min stock level"""
        if hasattr(self, 'initial_data'):
            current_stock = self.initial_data.get('current_stock', 0)
            if value > current_stock:
                pass  # Allow but could trigger alerts
        return value


class InventoryListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for inventory listing"""
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    # category_name = serializers.CharField(source='product.category.name', read_only=True)
    value_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Inventory
        fields = [
            'id', 'product', 'product_name', 'product_sku', # 'category_name',
            'current_stock', 'available_stock', 'min_stock_level',
            'cost_price', 'selling_price', 'status', 'value_total', 'location'
        ]

    def get_value_total(self, obj):
        """Calculate total value of inventory"""
        return obj.current_stock * obj.cost_price


class StockMovementSerializer(serializers.ModelSerializer):
    """Serializer for stock movements"""
    
    product_name = serializers.CharField(source='inventory.product.name', read_only=True)
    product_sku = serializers.CharField(source='inventory.product.sku', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True, allow_null=True)
    created_by_name = serializers.SerializerMethodField()
    movement_type_display = serializers.CharField(source='get_movement_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    def get_created_by_name(self, obj):
        """Get created by user name"""
        if obj.created_by:
            if hasattr(obj.created_by, 'get_full_name'):
                return obj.created_by.get_full_name() or obj.created_by.username
            return obj.created_by.username
        return 'System'
    
    class Meta:
        model = StockMovement
        fields = [
            'id', 'inventory', 'product_name', 'product_sku',
            'movement_type', 'movement_type_display', 'quantity_change',
            'quantity_before', 'quantity_after', 'unit_cost', 'total_cost',
            'reference_number', 'supplier', 'supplier_name',
            'reason', 'notes', 'status', 'status_display',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'quantity_before', 'quantity_after', 'created_at', 'updated_at']

    def validate(self, data):
        """Validate stock movement data"""
        # Ensure we have required fields for certain movement types
        movement_type = data.get('movement_type')
        
        if movement_type in ['purchase', 'return_to_supplier'] and not data.get('supplier'):
            raise serializers.ValidationError(
                f"Supplier is required for movement type: {movement_type}"
            )
            
        return data


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    """Serializer for purchase order items"""
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = PurchaseOrderItem
        fields = [
            'id', 'product', 'product_name', 'product_sku',
            'quantity_ordered', 'quantity_received', 'unit_cost',
            'discount_percentage', 'discount_amount', 'line_total',
            'expected_delivery_date', 'notes'
        ]
        read_only_fields = ['id', 'line_total']

    def validate_quantity_ordered(self, value):
        """Validate ordered quantity"""
        if value <= 0:
            raise serializers.ValidationError("Ordered quantity must be greater than 0")
        return value

    def validate_unit_cost(self, value):
        """Validate unit cost"""
        if value < 0:
            raise serializers.ValidationError("Unit cost cannot be negative")
        return value


class PurchaseOrderSerializer(serializers.ModelSerializer):
    """Serializer for purchase orders"""
    
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    supplier_code = serializers.CharField(source='supplier.supplier_code', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'po_number', 'supplier', 'supplier_name', 'supplier_code',
            'status', 'status_display', 'priority', 'priority_display',
            'order_date', 'expected_delivery_date', 'actual_delivery_date',
            'total_amount', 'tax_amount', 'discount_amount',
            'notes', 'terms_conditions',
            'created_by', 'created_by_name', 'approved_by', 'approved_by_name',
            'approved_at', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'po_number', 'order_date', 'total_amount',
            'approved_by', 'approved_at', 'created_at', 'updated_at'
        ]

    def validate_expected_delivery_date(self, value):
        """Validate delivery date"""
        from django.utils import timezone
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Delivery date cannot be in the past")
        return value


class PurchaseOrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating purchase orders with items"""
    
    items = PurchaseOrderItemSerializer(many=True)
    
    class Meta:
        model = PurchaseOrder
        fields = [
            'supplier', 'priority', 'expected_delivery_date',
            'notes', 'terms_conditions', 'items'
        ]

    def validate_items(self, value):
        """Validate purchase order items"""
        if not value:
            raise serializers.ValidationError("At least one item is required")
            
        products = [item['product'].id for item in value]
        if len(products) != len(set(products)):
            raise serializers.ValidationError("Duplicate products in order")
            
        return value


class StockAlertSerializer(serializers.ModelSerializer):
    """Serializer for stock alerts"""
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.full_name', read_only=True)
    
    class Meta:
        model = StockAlert
        fields = [
            'id', 'product', 'product_name', 'product_sku',
            'alert_type', 'alert_type_display', 'severity', 'severity_display',
            'message', 'current_stock', 'threshold_value',
            'is_active', 'is_resolved', 'resolved_by', 'resolved_by_name',
            'resolved_at', 'resolution_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'current_stock', 'threshold_value',
            'resolved_by', 'resolved_at', 'created_at', 'updated_at'
        ]


class StockAdjustmentSerializer(serializers.Serializer):
    """Serializer for stock adjustments"""
    
    inventory_id = serializers.UUIDField()
    adjustment_type = serializers.ChoiceField(choices=[
        ('increase', 'Increase Stock'),
        ('decrease', 'Decrease Stock'),
        ('set', 'Set Stock Level')
    ])
    quantity = serializers.IntegerField()
    reason = serializers.CharField(max_length=500)
    notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    
    def validate_inventory_id(self, value):
        """Validate inventory exists"""
        try:
            Inventory.objects.get(id=value)
        except Inventory.DoesNotExist:
            raise serializers.ValidationError("Inventory item not found")
        return value

    def validate_quantity(self, value):
        """Validate adjustment quantity"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value

    def validate(self, data):
        """Validate adjustment data"""
        adjustment_type = data.get('adjustment_type')
        quantity = data.get('quantity')
        
        if adjustment_type == 'decrease':
            inventory = Inventory.objects.get(id=data['inventory_id'])
            if inventory.current_stock < quantity:
                raise serializers.ValidationError(
                    f"Cannot decrease stock below zero. Current stock: {inventory.current_stock}"
                )
                
        return data


class InventoryStatsSerializer(serializers.Serializer):
    """Serializer for inventory statistics"""
    
    total_items = serializers.IntegerField()
    total_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    low_stock_items = serializers.IntegerField()
    out_of_stock_items = serializers.IntegerField()
    alert_count = serializers.IntegerField()
    recent_movements = serializers.IntegerField()


