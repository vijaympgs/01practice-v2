from rest_framework import serializers
from .models import Customer


class CustomerListSerializer(serializers.ModelSerializer):
    """
    Serializer for customer list view with essential fields.
    """
    full_name = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()
    customer_status = serializers.SerializerMethodField()
    total_purchases = serializers.SerializerMethodField()
    purchase_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = [
            'id', 'customer_code', 'first_name', 'last_name', 'company_name',
            'full_name', 'display_name', 'customer_type', 'email', 'phone',
            'city', 'state', 'is_active', 'is_vip', 'customer_status',
            'total_purchases', 'purchase_count', 'last_purchase_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer_code', 'created_at', 'updated_at']
    
    def get_customer_status(self, obj):
        """Get customer status."""
        return obj.get_customer_status()
    
    def get_total_purchases(self, obj):
        """Get total purchase amount."""
        return obj.get_total_purchases()
    
    def get_purchase_count(self, obj):
        """Get purchase count."""
        return obj.get_purchase_count()


class CustomerDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed customer view with all fields.
    """
    full_name = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()
    customer_status = serializers.SerializerMethodField()
    total_purchases = serializers.SerializerMethodField()
    purchase_count = serializers.SerializerMethodField()
    average_purchase_amount = serializers.SerializerMethodField()
    available_credit = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['id', 'customer_code', 'created_at', 'updated_at']
    
    def get_customer_status(self, obj):
        """Get customer status."""
        return obj.get_customer_status()
    
    def get_total_purchases(self, obj):
        """Get total purchase amount."""
        return obj.get_total_purchases()
    
    def get_purchase_count(self, obj):
        """Get purchase count."""
        return obj.get_purchase_count()
    
    def get_average_purchase_amount(self, obj):
        """Get average purchase amount."""
        return obj.get_average_purchase_amount()
    
    def get_available_credit(self, obj):
        """Get available credit."""
        return obj.get_available_credit()


class CustomerCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new customers.
    """
    
    class Meta:
        model = Customer
        fields = [
            'first_name', 'last_name', 'company_name', 'customer_type',
            'email', 'phone', 'mobile', 'address_line_1', 'address_line_2',
            'city', 'state', 'postal_code', 'country', 'tax_id',
            'credit_limit', 'discount_percentage', 'is_active', 'is_vip',
            'allow_credit', 'notes', 'date_of_birth'
        ]
    
    def validate_email(self, value):
        """Validate email uniqueness if provided."""
        if value:
            # Check if email already exists for another customer
            if Customer.objects.filter(email=value).exists():
                raise serializers.ValidationError("A customer with this email already exists.")
        return value
    
    def validate_phone(self, value):
        """Validate phone number format and uniqueness."""
        if value:
            # Check if phone already exists for another customer
            if Customer.objects.filter(phone=value).exists():
                raise serializers.ValidationError("A customer with this phone number already exists.")
        return value
    
    def validate(self, data):
        """Cross-field validation."""
        # Validate business customers have company name
        if data.get('customer_type') == 'business' and not data.get('company_name'):
            raise serializers.ValidationError({
                'company_name': 'Company name is required for business customers.'
            })
        
        # Validate VIP customers
        if data.get('is_vip') and data.get('customer_type') not in ['business', 'wholesale', 'vip']:
            data['customer_type'] = 'vip'
        
        return data


class CustomerUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating existing customers.
    """
    
    class Meta:
        model = Customer
        fields = [
            'first_name', 'last_name', 'company_name', 'customer_type',
            'email', 'phone', 'mobile', 'address_line_1', 'address_line_2',
            'city', 'state', 'postal_code', 'country', 'tax_id',
            'credit_limit', 'discount_percentage', 'is_active', 'is_vip',
            'allow_credit', 'notes', 'date_of_birth'
        ]
    
    def validate_email(self, value):
        """Validate email uniqueness if provided."""
        if value:
            # Check if email already exists for another customer (excluding current)
            existing_customer = Customer.objects.filter(email=value).exclude(id=self.instance.id)
            if existing_customer.exists():
                raise serializers.ValidationError("A customer with this email already exists.")
        return value
    
    def validate_phone(self, value):
        """Validate phone number uniqueness."""
        if value:
            # Check if phone already exists for another customer (excluding current)
            existing_customer = Customer.objects.filter(phone=value).exclude(id=self.instance.id)
            if existing_customer.exists():
                raise serializers.ValidationError("A customer with this phone number already exists.")
        return value
    
    def validate(self, data):
        """Cross-field validation."""
        # Validate business customers have company name
        if data.get('customer_type') == 'business' and not data.get('company_name'):
            raise serializers.ValidationError({
                'company_name': 'Company name is required for business customers.'
            })
        
        return data


class CustomerStatsSerializer(serializers.Serializer):
    """
    Serializer for customer statistics.
    """
    total_customers = serializers.IntegerField()
    active_customers = serializers.IntegerField()
    inactive_customers = serializers.IntegerField()
    new_customers_this_month = serializers.IntegerField()
    vip_customers = serializers.IntegerField()
    business_customers = serializers.IntegerField()
    individual_customers = serializers.IntegerField()
    customers_with_credit = serializers.IntegerField()
    total_credit_limit = serializers.DecimalField(max_digits=15, decimal_places=2)
    average_discount_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)


class CustomerSearchSerializer(serializers.ModelSerializer):
    """
    Serializer for customer search results.
    """
    full_name = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Customer
        fields = [
            'id', 'customer_code', 'first_name', 'last_name', 'company_name',
            'full_name', 'display_name', 'customer_type', 'email', 'phone',
            'is_active', 'is_vip'
        ]


class CustomerHistorySerializer(serializers.Serializer):
    """
    Serializer for customer purchase history.
    This will be enhanced when Sales module is implemented.
    """
    customer_id = serializers.UUIDField()
    total_purchases = serializers.DecimalField(max_digits=15, decimal_places=2)
    purchase_count = serializers.IntegerField()
    average_purchase_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    last_purchase_date = serializers.DateTimeField()
    first_purchase_date = serializers.DateTimeField()
    favorite_products = serializers.ListField(child=serializers.CharField())
    purchase_frequency = serializers.CharField()  # 'frequent', 'regular', 'occasional', 'rare'


class CustomerBulkUpdateSerializer(serializers.Serializer):
    """
    Serializer for bulk customer updates.
    """
    customer_ids = serializers.ListField(
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
            'customer_type', 'is_active', 'is_vip', 'allow_credit',
            'discount_percentage', 'credit_limit'
        ]
        
        for field in value.keys():
            if field not in allowed_fields:
                raise serializers.ValidationError(f"Field '{field}' is not allowed for bulk updates.")
        
        return value








