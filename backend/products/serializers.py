from rest_framework import serializers
from .models import Item, ItemVariant, VariantAttribute, UOM, UOMConversion, Brand, ItemTaxDetail
from categories.serializers import ProductAttributeTemplateSerializer

class UOMSerializer(serializers.ModelSerializer):
    """Serializer for UOM model"""
    
    flags = serializers.ReadOnlyField()
    
    class Meta:
        model = UOM
        fields = [
            'id', 'company', 'code', 'description', 'basis', 'decimals',
            'is_stock_uom', 'is_purchase_uom', 'is_sales_uom',
            'is_active', 'created_at', 'updated_at', 'flags'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'flags']
    
    def validate_code(self, value):
        """Validate UOM code"""
        if not value.strip():
            raise serializers.ValidationError("UOM code is required")
        return value.strip()
    
    def validate_decimals(self, value):
        """Validate decimals"""
        if value < 0 or value > 10:
            raise serializers.ValidationError("Decimals must be between 0 and 10")
        return value

class UOMConversionSerializer(serializers.ModelSerializer):
    """Serializer for UOM Conversion model"""
    
    from_uom_code = serializers.CharField(source='from_uom.code', read_only=True)
    to_uom_code = serializers.CharField(source='to_uom.code', read_only=True)
    
    class Meta:
        model = UOMConversion
        fields = [
            'id', 'company', 'from_uom', 'to_uom', 'from_uom_code', 
            'to_uom_code', 'conversion_factor', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'from_uom_code', 'to_uom_code']
    
    def validate(self, attrs):
        """Validate conversion factor and prevent self-conversion"""
        if attrs.get('from_uom') == attrs.get('to_uom'):
            raise serializers.ValidationError("From UOM and To UOM cannot be the same")
        
        if attrs.get('conversion_factor') <= 0:
            raise serializers.ValidationError("Conversion factor must be greater than 0")
        
        return attrs

class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model"""
    class Meta:
        model = Brand
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class VariantAttributeSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    value_label = serializers.CharField(source='attribute_value.value_label', read_only=True)

    class Meta:
        model = VariantAttribute
        fields = ['id', 'attribute', 'attribute_value', 'attribute_name', 'value_label']

class ItemVariantSerializer(serializers.ModelSerializer):
    """Serializer for Item Variant (SKU)"""
    attributes = VariantAttributeSerializer(many=True, read_only=True)
    sales_uom_code = serializers.CharField(source='sales_uom.code', read_only=True)
    
    class Meta:
        model = ItemVariant
        fields = [
            'id', 'company', 'item', 'sku_code', 'variant_name', 
            'is_default_variant', 'sales_uom', 'purchase_uom', 'stock_uom', 
            'barcode', 'default_price', 'default_cost', 'is_active', 
            'created_at', 'updated_at', 'attributes', 'sales_uom_code'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ItemSerializer(serializers.ModelSerializer):
    """Serializer for Item (Parent)"""
    variants = ItemVariantSerializer(many=True, read_only=True)
    stock_uom_code = serializers.CharField(source='stock_uom.code', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    
    class Meta:
        model = Item
        fields = [
            'id', 'company', 'item_code', 'item_name', 'short_name', 'item_type',
            'attribute_template', 'category', 'brand', 'stock_uom',
            'is_serialized', 'is_lot_tracked', 'is_taxable', 'status',
            'created_at', 'updated_at', 'variants', 'stock_uom_code', 
            'category_name', 'brand_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'variants']

class ItemTaxDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTaxDetail
        fields = '__all__'
