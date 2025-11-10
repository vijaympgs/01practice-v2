from rest_framework import serializers
from .models import Product, UOM, UOMConversion, ItemMaster, AdvancedItemMaster, ItemAttribute, ItemPackage, PackageComponent, SecondarySupplier, SupplierBarcode, AlternateItem, ItemComponent, ItemTaxDetail, ItemSpecification, ItemPriceHistory, Brand, Department, Division


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model.
    """
    
    profit_margin = serializers.ReadOnlyField()
    profit_amount = serializers.ReadOnlyField()
    stock_status = serializers.ReadOnlyField()
    stock_value = serializers.ReadOnlyField()
    can_be_sold = serializers.ReadOnlyField()
    display_price = serializers.ReadOnlyField(source='get_display_price')
    display_cost = serializers.ReadOnlyField(source='get_display_cost')
    display_profit_margin = serializers.ReadOnlyField(source='get_display_profit_margin')
    display_stock_value = serializers.ReadOnlyField(source='get_display_stock_value')
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'sku', 'barcode',
            'price', 'cost', 'stock_quantity', 'minimum_stock', 'maximum_stock',
            'weight', 'dimensions', 'color', 'size', 'brand', 'model',
            'is_active', 'is_taxable', 'tax_rate', 'image',
            'profit_margin', 'profit_amount', 'stock_status', 'stock_value',
            'can_be_sold', 'display_price', 'display_cost', 
            'display_profit_margin', 'display_stock_value',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        """Validate product name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Product name must be at least 2 characters long.")
        return value.strip()
    
    def validate_sku(self, value):
        """Validate SKU."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("SKU must be at least 2 characters long.")
        return value.strip().upper()
    
    def validate_barcode(self, value):
        """Validate barcode."""
        if value:
            return value.strip()
        return value
    
    def validate_price(self, value):
        """Validate price."""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value
    
    def validate_cost(self, value):
        """Validate cost."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Cost cannot be negative.")
        return value
    
    def validate_stock_quantity(self, value):
        """Validate stock quantity."""
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value
    
    def validate_minimum_stock(self, value):
        """Validate minimum stock."""
        if value < 0:
            raise serializers.ValidationError("Minimum stock cannot be negative.")
        return value
    
    def validate_maximum_stock(self, value):
        """Validate maximum stock."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Maximum stock cannot be negative.")
        return value
    
    def validate_tax_rate(self, value):
        """Validate tax rate."""
        if value < 0 or value > 100:
            raise serializers.ValidationError("Tax rate must be between 0 and 100.")
        return value
    
    def validate(self, attrs):
        """Cross-field validation."""
        # Validate cost is not greater than price
        if attrs.get('cost') and attrs.get('price') and attrs['cost'] > attrs['price']:
            raise serializers.ValidationError({
                'cost': 'Cost price cannot be greater than selling price.'
            })
        
        # Validate minimum stock is not greater than maximum stock
        if (attrs.get('maximum_stock') and attrs.get('minimum_stock') and 
            attrs['minimum_stock'] > attrs['maximum_stock']):
            raise serializers.ValidationError({
                'minimum_stock': 'Minimum stock cannot be greater than maximum stock.'
            })
        
        return attrs


class ProductCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new products.
    """
    
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'sku', 'barcode',
            'price', 'cost', 'stock_quantity', 'minimum_stock', 'maximum_stock',
            'weight', 'dimensions', 'color', 'size', 'brand', 'model',
            'is_active', 'is_taxable', 'tax_rate', 'image'
        ]
    
    def validate_name(self, value):
        """Validate product name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Product name must be at least 2 characters long.")
        return value.strip()
    
    def validate_sku(self, value):
        """Validate SKU."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("SKU must be at least 2 characters long.")
        return value.strip().upper()
    
    def validate_barcode(self, value):
        """Validate barcode."""
        if value:
            return value.strip()
        return value
    
    def validate_price(self, value):
        """Validate price."""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value
    
    def validate_cost(self, value):
        """Validate cost."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Cost cannot be negative.")
        return value
    
    def validate_stock_quantity(self, value):
        """Validate stock quantity."""
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value
    
    def validate_minimum_stock(self, value):
        """Validate minimum stock."""
        if value < 0:
            raise serializers.ValidationError("Minimum stock cannot be negative.")
        return value
    
    def validate_maximum_stock(self, value):
        """Validate maximum stock."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Maximum stock cannot be negative.")
        return value
    
    def validate_tax_rate(self, value):
        """Validate tax rate."""
        if value < 0 or value > 100:
            raise serializers.ValidationError("Tax rate must be between 0 and 100.")
        return value
    
    def validate(self, attrs):
        """Cross-field validation."""
        # Validate cost is not greater than price
        if attrs.get('cost') and attrs.get('price') and attrs['cost'] > attrs['price']:
            raise serializers.ValidationError({
                'cost': 'Cost price cannot be greater than selling price.'
            })
        
        # Validate minimum stock is not greater than maximum stock
        if (attrs.get('maximum_stock') and attrs.get('minimum_stock') and 
            attrs['minimum_stock'] > attrs['maximum_stock']):
            raise serializers.ValidationError({
                'minimum_stock': 'Minimum stock cannot be greater than maximum stock.'
            })
        
        return attrs


class ProductUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating products.
    """
    
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'sku', 'barcode',
            'price', 'cost', 'stock_quantity', 'minimum_stock', 'maximum_stock',
            'weight', 'dimensions', 'color', 'size', 'brand', 'model',
            'is_active', 'is_taxable', 'tax_rate', 'image'
        ]
    
    def validate_name(self, value):
        """Validate product name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Product name must be at least 2 characters long.")
        return value.strip()
    
    def validate_sku(self, value):
        """Validate SKU."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("SKU must be at least 2 characters long.")
        return value.strip().upper()
    
    def validate_barcode(self, value):
        """Validate barcode."""
        if value:
            return value.strip()
        return value
    
    def validate_price(self, value):
        """Validate price."""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value
    
    def validate_cost(self, value):
        """Validate cost."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Cost cannot be negative.")
        return value
    
    def validate_stock_quantity(self, value):
        """Validate stock quantity."""
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value
    
    def validate_minimum_stock(self, value):
        """Validate minimum stock."""
        if value < 0:
            raise serializers.ValidationError("Minimum stock cannot be negative.")
        return value
    
    def validate_maximum_stock(self, value):
        """Validate maximum stock."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Maximum stock cannot be negative.")
        return value
    
    def validate_tax_rate(self, value):
        """Validate tax rate."""
        if value < 0 or value > 100:
            raise serializers.ValidationError("Tax rate must be between 0 and 100.")
        return value
    
    def validate(self, attrs):
        """Cross-field validation."""
        # Validate cost is not greater than price
        if attrs.get('cost') and attrs.get('price') and attrs['cost'] > attrs['price']:
            raise serializers.ValidationError({
                'cost': 'Cost price cannot be greater than selling price.'
            })
        
        # Validate minimum stock is not greater than maximum stock
        if (attrs.get('maximum_stock') and attrs.get('minimum_stock') and 
            attrs['minimum_stock'] > attrs['maximum_stock']):
            raise serializers.ValidationError({
                'minimum_stock': 'Minimum stock cannot be greater than maximum stock.'
            })
        
        return attrs


class ProductListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for product lists.
    """
    
    stock_status = serializers.ReadOnlyField()
    display_price = serializers.ReadOnlyField(source='get_display_price')
    display_cost = serializers.ReadOnlyField(source='get_display_cost')
    display_profit_margin = serializers.ReadOnlyField(source='get_display_profit_margin')
    can_be_sold = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'barcode',
            'price', 'cost', 'stock_quantity', 'minimum_stock',
            'brand', 'model', 'is_active', 'stock_status',
            'display_price', 'display_cost', 'display_profit_margin',
            'can_be_sold', 'created_at', 'updated_at'
        ]


class ProductStatsSerializer(serializers.Serializer):
    """
    Serializer for product statistics.
    """
    
    total_products = serializers.IntegerField()
    active_products = serializers.IntegerField()
    inactive_products = serializers.IntegerField()
    out_of_stock_products = serializers.IntegerField()
    low_stock_products = serializers.IntegerField()
    overstocked_products = serializers.IntegerField()
    total_stock_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    average_profit_margin = serializers.DecimalField(max_digits=5, decimal_places=2)
    products_by_category = serializers.DictField()
    top_selling_products = serializers.ListField()
    low_stock_alerts = serializers.ListField()


class UOMSerializer(serializers.ModelSerializer):
    """Serializer for UOM model"""
    
    flags = serializers.ReadOnlyField()
    
    class Meta:
        model = UOM
        fields = [
            'id', 'code', 'description', 'basis', 'decimals',
            'is_stock_uom', 'is_purchase_uom', 'is_sales_uom',
            'is_active', 'created_at', 'updated_at', 'flags'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'flags']
    
    def validate_code(self, value):
        """Validate UOM code"""
        if not value.strip():
            raise serializers.ValidationError("UOM code is required")
        return value.strip().upper()
    
    def validate_description(self, value):
        """Validate UOM description"""
        if not value.strip():
            raise serializers.ValidationError("UOM description is required")
        return value.strip()
    
    def validate_decimals(self, value):
        """Validate decimals"""
        if value < 0 or value > 10:
            raise serializers.ValidationError("Decimals must be between 0 and 10")
        return value


class UOMListSerializer(serializers.ModelSerializer):
    """Simplified serializer for UOM list views"""
    
    flags = serializers.ReadOnlyField()
    
    class Meta:
        model = UOM
        fields = ['id', 'code', 'description', 'basis', 'decimals', 'flags', 'is_active']


class UOMConversionSerializer(serializers.ModelSerializer):
    """Serializer for UOM Conversion model"""
    
    from_uom_code = serializers.CharField(source='from_uom.code', read_only=True)
    from_uom_description = serializers.CharField(source='from_uom.description', read_only=True)
    to_uom_code = serializers.CharField(source='to_uom.code', read_only=True)
    to_uom_description = serializers.CharField(source='to_uom.description', read_only=True)
    
    class Meta:
        model = UOMConversion
        fields = [
            'id', 'from_uom', 'to_uom', 'from_uom_code', 'from_uom_description',
            'to_uom_code', 'to_uom_description', 'conversion_factor', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'from_uom_code', 'from_uom_description', 'to_uom_code', 'to_uom_description']
    
    def validate(self, attrs):
        """Validate conversion factor and prevent self-conversion"""
        if attrs.get('from_uom') == attrs.get('to_uom'):
            raise serializers.ValidationError("From UOM and To UOM cannot be the same")
        
        if attrs.get('conversion_factor') <= 0:
            raise serializers.ValidationError("Conversion factor must be greater than 0")
        
        return attrs


class UOMConversionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for UOM Conversion list views"""
    
    from_uom_code = serializers.CharField(source='from_uom.code', read_only=True)
    from_uom_description = serializers.CharField(source='from_uom.description', read_only=True)
    to_uom_code = serializers.CharField(source='to_uom.code', read_only=True)
    to_uom_description = serializers.CharField(source='to_uom.description', read_only=True)
    
    class Meta:
        model = UOMConversion
        fields = ['id', 'from_uom_code', 'from_uom_description', 'to_uom_code', 'to_uom_description', 'conversion_factor', 'is_active']


class ItemMasterSerializer(serializers.ModelSerializer):
    """Serializer for Item Master model"""
    
    base_uom_code = serializers.CharField(source='base_uom.code', read_only=True)
    purchase_uom_code = serializers.CharField(source='purchase_uom.code', read_only=True)
    sales_uom_code = serializers.CharField(source='sales_uom.code', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    profit_margin = serializers.ReadOnlyField()
    
    class Meta:
        model = ItemMaster
        fields = [
            'id', 'ean_upc_code', 'item_code', 'item_name', 'short_name', 'brand', 'supplier',
            'cost_price', 'landing_cost', 'sell_price', 'mrp', 'store_pickup', 'sales_margin',
            'tax_inclusive', 'allow_buy_back', 'allow_negative_stock',
            'base_uom', 'purchase_uom', 'sales_uom', 'base_uom_code', 'purchase_uom_code', 'sales_uom_code',
            'category', 'category_name',
            'tax_code', 'hsn_code', 'tax_slab',
            'material_type', 'material_group', 'item_type', 'exchange_type',
            'is_active', 'created_at', 'updated_at', 'profit_margin'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'base_uom_code', 'purchase_uom_code', 'sales_uom_code', 'category_name', 'profit_margin']


class ItemMasterListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Item Master list views"""
    
    base_uom_code = serializers.CharField(source='base_uom.code', read_only=True)
    purchase_uom_code = serializers.CharField(source='purchase_uom.code', read_only=True)
    sales_uom_code = serializers.CharField(source='sales_uom.code', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = ItemMaster
        fields = ['id', 'item_code', 'item_name', 'brand', 'cost_price', 'sell_price', 'mrp', 'base_uom_code', 'purchase_uom_code', 'sales_uom_code', 'category_name', 'is_active']


# Advanced Item Master Serializers
class AdvancedItemMasterSerializer(serializers.ModelSerializer):
    """Serializer for Advanced Item Master model"""
    
    stock_uom_code = serializers.CharField(source='stock_uom.code', read_only=True)
    purchase_uom_code = serializers.CharField(source='purchase_uom.code', read_only=True)
    sales_uom_code = serializers.CharField(source='sales_uom.code', read_only=True)
    
    class Meta:
        model = AdvancedItemMaster
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'stock_uom_code', 'purchase_uom_code', 'sales_uom_code']


class AdvancedItemMasterListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Advanced Item Master list views"""
    
    stock_uom_code = serializers.CharField(source='stock_uom.code', read_only=True)
    purchase_uom_code = serializers.CharField(source='purchase_uom.code', read_only=True)
    sales_uom_code = serializers.CharField(source='sales_uom.code', read_only=True)
    
    class Meta:
        model = AdvancedItemMaster
        fields = ['id', 'item_code', 'item_name', 'short_name', 'supplier', 'manufacturer', 'division', 'department', 'group', 'item_status', 'item_type', 'stock_uom_code', 'purchase_uom_code', 'sales_uom_code', 'is_active']


# Brand Serializers
class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model"""
    
    class Meta:
        model = Brand
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


# Department Serializers
class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    
    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


# Division Serializers
class DivisionSerializer(serializers.ModelSerializer):
    """Serializer for Division model"""
    
    class Meta:
        model = Division
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']























