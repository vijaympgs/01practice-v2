from rest_framework import serializers
from .models import Supplier


class SupplierListSerializer(serializers.ModelSerializer):
    """
    Serializer for supplier list view with essential fields.
    """
    display_name = serializers.ReadOnlyField()
    supplier_status = serializers.SerializerMethodField()
    total_orders = serializers.SerializerMethodField()
    order_count = serializers.SerializerMethodField()
    display_supplier_type = serializers.SerializerMethodField()
    display_payment_terms = serializers.SerializerMethodField()
    
    class Meta:
        model = Supplier
        fields = [
            'id', 'supplier_code', 'company_name', 'trade_name', 'display_name',
            'supplier_type', 'display_supplier_type', 'contact_person', 'email', 'phone',
            'city', 'state', 'country', 'payment_terms', 'display_payment_terms',
            'is_active', 'is_preferred', 'is_verified', 'supplier_status',
            'total_orders', 'order_count', 'last_order_date', 'lead_time_days',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'supplier_code', 'created_at', 'updated_at']
    
    def get_supplier_status(self, obj):
        """Get supplier status."""
        return obj.get_supplier_status()
    
    def get_total_orders(self, obj):
        """Get total order amount."""
        return obj.get_total_orders()
    
    def get_order_count(self, obj):
        """Get order count."""
        return obj.get_order_count()
    
    def get_display_supplier_type(self, obj):
        """Get formatted supplier type."""
        return obj.get_display_supplier_type()
    
    def get_display_payment_terms(self, obj):
        """Get formatted payment terms."""
        return obj.get_display_payment_terms()


class SupplierDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed supplier view with all fields.
    """
    display_name = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()
    supplier_status = serializers.SerializerMethodField()
    total_orders = serializers.SerializerMethodField()
    order_count = serializers.SerializerMethodField()
    average_order_amount = serializers.SerializerMethodField()
    display_supplier_type = serializers.SerializerMethodField()
    display_payment_terms = serializers.SerializerMethodField()
    
    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ['id', 'supplier_code', 'created_at', 'updated_at']
    
    def get_supplier_status(self, obj):
        """Get supplier status."""
        return obj.get_supplier_status()
    
    def get_total_orders(self, obj):
        """Get total order amount."""
        return obj.get_total_orders()
    
    def get_order_count(self, obj):
        """Get order count."""
        return obj.get_order_count()
    
    def get_average_order_amount(self, obj):
        """Get average order amount."""
        count = obj.get_order_count()
        if count > 0:
            return obj.get_total_orders() / count
        return 0.00
    
    def get_display_supplier_type(self, obj):
        """Get formatted supplier type."""
        return obj.get_display_supplier_type()
    
    def get_display_payment_terms(self, obj):
        """Get formatted payment terms."""
        return obj.get_display_payment_terms()


class SupplierCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new suppliers.
    """
    
    class Meta:
        model = Supplier
        fields = [
            'company_name', 'trade_name', 'supplier_type', 'contact_person',
            'contact_title', 'email', 'phone', 'mobile', 'website',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code',
            'country', 'tax_id', 'payment_terms', 'credit_limit',
            'discount_percentage', 'lead_time_days', 'minimum_order_amount',
            'is_active', 'is_preferred', 'is_verified', 'notes'
        ]
    
    def validate_email(self, value):
        """Validate email uniqueness if provided."""
        if value:
            # Check if email already exists for another supplier
            if Supplier.objects.filter(email=value).exists():
                raise serializers.ValidationError("A supplier with this email already exists.")
        return value
    
    def validate_phone(self, value):
        """Validate phone number format and uniqueness."""
        if value:
            # Check if phone already exists for another supplier
            if Supplier.objects.filter(phone=value).exists():
                raise serializers.ValidationError("A supplier with this phone number already exists.")
        return value
    
    def validate_website(self, value):
        """Validate and format website URL."""
        if value and not value.startswith(('http://', 'https://')):
            value = f'https://{value}'
        return value
    
    def validate(self, data):
        """Cross-field validation."""
        # Validate credit limit
        if data.get('credit_limit', 0) < 0:
            raise serializers.ValidationError({
                'credit_limit': 'Credit limit cannot be negative.'
            })
        
        # Validate discount percentage
        discount = data.get('discount_percentage', 0)
        if discount < 0 or discount > 100:
            raise serializers.ValidationError({
                'discount_percentage': 'Discount percentage must be between 0 and 100.'
            })
        
        # Validate minimum order amount
        if data.get('minimum_order_amount', 0) < 0:
            raise serializers.ValidationError({
                'minimum_order_amount': 'Minimum order amount cannot be negative.'
            })
        
        return data


class SupplierUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating existing suppliers.
    """
    
    class Meta:
        model = Supplier
        fields = [
            'company_name', 'trade_name', 'supplier_type', 'contact_person',
            'contact_title', 'email', 'phone', 'mobile', 'website',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code',
            'country', 'tax_id', 'payment_terms', 'credit_limit',
            'discount_percentage', 'lead_time_days', 'minimum_order_amount',
            'is_active', 'is_preferred', 'is_verified', 'notes'
        ]
    
    def validate_email(self, value):
        """Validate email uniqueness if provided."""
        if value:
            # Check if email already exists for another supplier (excluding current)
            existing_supplier = Supplier.objects.filter(email=value).exclude(id=self.instance.id)
            if existing_supplier.exists():
                raise serializers.ValidationError("A supplier with this email already exists.")
        return value
    
    def validate_phone(self, value):
        """Validate phone number uniqueness."""
        if value:
            # Check if phone already exists for another supplier (excluding current)
            existing_supplier = Supplier.objects.filter(phone=value).exclude(id=self.instance.id)
            if existing_supplier.exists():
                raise serializers.ValidationError("A supplier with this phone number already exists.")
        return value
    
    def validate_website(self, value):
        """Validate and format website URL."""
        if value and not value.startswith(('http://', 'https://')):
            value = f'https://{value}'
        return value
    
    def validate(self, data):
        """Cross-field validation."""
        # Validate credit limit
        if data.get('credit_limit', 0) < 0:
            raise serializers.ValidationError({
                'credit_limit': 'Credit limit cannot be negative.'
            })
        
        # Validate discount percentage
        discount = data.get('discount_percentage', 0)
        if discount < 0 or discount > 100:
            raise serializers.ValidationError({
                'discount_percentage': 'Discount percentage must be between 0 and 100.'
            })
        
        # Validate minimum order amount
        if data.get('minimum_order_amount', 0) < 0:
            raise serializers.ValidationError({
                'minimum_order_amount': 'Minimum order amount cannot be negative.'
            })
        
        return data


class SupplierStatsSerializer(serializers.Serializer):
    """
    Serializer for supplier statistics.
    """
    total_suppliers = serializers.IntegerField()
    active_suppliers = serializers.IntegerField()
    inactive_suppliers = serializers.IntegerField()
    preferred_suppliers = serializers.IntegerField()
    verified_suppliers = serializers.IntegerField()
    unverified_suppliers = serializers.IntegerField()
    new_suppliers_this_month = serializers.IntegerField()
    suppliers_by_type = serializers.DictField()
    average_lead_time = serializers.DecimalField(max_digits=5, decimal_places=1)
    total_credit_limit = serializers.DecimalField(max_digits=15, decimal_places=2)
    average_discount_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)


class SupplierSearchSerializer(serializers.ModelSerializer):
    """
    Serializer for supplier search results.
    """
    display_name = serializers.ReadOnlyField()
    display_supplier_type = serializers.SerializerMethodField()
    
    class Meta:
        model = Supplier
        fields = [
            'id', 'supplier_code', 'company_name', 'trade_name', 'display_name',
            'supplier_type', 'display_supplier_type', 'contact_person', 'email',
            'phone', 'is_active', 'is_preferred', 'is_verified'
        ]
    
    def get_display_supplier_type(self, obj):
        """Get formatted supplier type."""
        return obj.get_display_supplier_type()


class SupplierPerformanceSerializer(serializers.Serializer):
    """
    Serializer for supplier performance metrics.
    This will be enhanced when Purchase Orders module is implemented.
    """
    supplier_id = serializers.UUIDField()
    total_orders = serializers.DecimalField(max_digits=15, decimal_places=2)
    order_count = serializers.IntegerField()
    average_order_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    last_order_date = serializers.DateTimeField()
    first_order_date = serializers.DateTimeField()
    on_time_delivery_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    quality_rating = serializers.DecimalField(max_digits=3, decimal_places=1)
    order_frequency = serializers.CharField()  # 'frequent', 'regular', 'occasional', 'rare'


class SupplierBulkUpdateSerializer(serializers.Serializer):
    """
    Serializer for bulk supplier updates.
    """
    supplier_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=1,
        max_length=100
    )
    updates = serializers.DictField(
        child=serializers.CharField(),
        required=True
    )
    
    def validate_updates(self, value):
        """Validate that only allowed fields are being updated."""
        allowed_fields = [
            'supplier_type', 'payment_terms', 'is_active', 'is_preferred',
            'is_verified', 'discount_percentage', 'credit_limit', 'lead_time_days'
        ]
        
        for field in value.keys():
            if field not in allowed_fields:
                raise serializers.ValidationError(f"Field '{field}' is not allowed for bulk updates.")
        
        return value


class SupplierContactSerializer(serializers.ModelSerializer):
    """
    Serializer for supplier contact information only.
    """
    display_name = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()
    
    class Meta:
        model = Supplier
        fields = [
            'id', 'supplier_code', 'company_name', 'display_name',
            'contact_person', 'contact_title', 'email', 'phone', 'mobile',
            'website', 'full_address', 'is_active'
        ]








