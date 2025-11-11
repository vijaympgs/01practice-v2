from rest_framework import serializers
from .models import ProductClassification, ItemCategory, ItemSubCategory, Attribute, AttributeValue


class ProductClassificationSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductClassification model.
    """
    
    full_path = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    children_count = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    can_be_deleted = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductClassification
        fields = [
            'id', 'name', 'description', 'parent', 'is_active', 
            'sort_order', 'created_at', 'updated_at', 'full_path', 
            'level', 'children_count', 'products_count', 'can_be_deleted'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_children_count(self, obj):
        """Return the number of active child classifications."""
        return obj.get_children().count()
    
    def get_products_count(self, obj):
        """Return the number of products in this classification."""
        return obj.products.count() if hasattr(obj, 'products') else 0
    
    def validate_name(self, value):
        """Validate classification name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Classification name must be at least 2 characters long.")
        return value.strip()
    
    def validate_parent(self, value):
        """Validate parent classification."""
        if value and value == self.instance:
            raise serializers.ValidationError("A classification cannot be its own parent.")
        return value


class ProductClassificationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new product classifications.
    """
    
    class Meta:
        model = ProductClassification
        fields = [
            'name', 'description', 'parent', 'is_active', 'sort_order'
        ]
    
    def validate_name(self, value):
        """Validate classification name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Classification name must be at least 2 characters long.")
        return value.strip()
    
    def validate_parent(self, value):
        """Validate parent classification."""
        if value and not value.is_active:
            raise serializers.ValidationError("Parent classification must be active.")
        return value


class ProductClassificationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating product classifications.
    """
    
    class Meta:
        model = ProductClassification
        fields = [
            'name', 'description', 'parent', 'is_active', 'sort_order'
        ]
    
    def validate_name(self, value):
        """Validate classification name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Classification name must be at least 2 characters long.")
        return value.strip()
    
    def validate_parent(self, value):
        """Validate parent classification."""
        if value and value == self.instance:
            raise serializers.ValidationError("A classification cannot be its own parent.")
        if value and not value.is_active:
            raise serializers.ValidationError("Parent classification must be active.")
        return value


class ProductClassificationTreeSerializer(serializers.ModelSerializer):
    """
    Serializer for hierarchical product classification tree structure.
    """
    
    children = serializers.SerializerMethodField()
    full_path = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductClassification
        fields = [
            'id', 'name', 'description', 'is_active', 'sort_order',
            'full_path', 'level', 'children'
        ]
    
    def get_children(self, obj):
        """Return child classifications in tree structure."""
        children = obj.get_children()
        if children.exists():
            return ProductClassificationTreeSerializer(children, many=True, context=self.context).data
        return []


class ProductClassificationListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for product classification lists.
    """
    
    full_path = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductClassification
        fields = [
            'id', 'name', 'description', 'is_active', 
            'sort_order', 'full_path', 'level'
        ]


class ItemCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for ItemCategory model.
    """
    
    subcategories_count = serializers.ReadOnlyField()
    items_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ItemCategory
        fields = [
            'id', 'name', 'code', 'description', 'is_active', 
            'sort_order', 'created_at', 'updated_at',
            'subcategories_count', 'items_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_subcategories_count(self, obj):
        """Return the number of active subcategories."""
        return obj.subcategories.filter(is_active=True).count()
    
    def get_items_count(self, obj):
        """Return the number of items in this category."""
        return obj.items.count()


class ItemSubCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for ItemSubCategory model.
    """
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_code = serializers.CharField(source='category.code', read_only=True)
    items_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ItemSubCategory
        fields = [
            'id', 'category', 'name', 'code', 'description', 'is_active', 
            'sort_order', 'created_at', 'updated_at',
            'category_name', 'category_code', 'items_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttributeValueSerializer(serializers.ModelSerializer):
    """
    Serializer for AttributeValue model.
    """
    
    class Meta:
        model = AttributeValue
        fields = ['id', 'attribute', 'value', 'description', 'is_active', 'sort_order', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttributeSerializer(serializers.ModelSerializer):
    """
    Serializer for Attribute model.
    """
    
    values = AttributeValueSerializer(many=True, read_only=True)
    values_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Attribute
        fields = ['id', 'name', 'description', 'data_type', 'is_active', 'sort_order', 'created_at', 'updated_at', 'values', 'values_count']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_values_count(self, obj):
        """Return the number of active values for this attribute."""
        return obj.values.filter(is_active=True).count()


class AttributeListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for attribute lists.
    """
    
    values_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Attribute
        fields = ['id', 'name', 'description', 'data_type', 'is_active', 'sort_order', 'values_count']


# Legacy serializers for backward compatibility
CategorySerializer = ProductClassificationSerializer
CategoryCreateSerializer = ProductClassificationCreateSerializer
CategoryUpdateSerializer = ProductClassificationUpdateSerializer
CategoryTreeSerializer = ProductClassificationTreeSerializer
CategoryListSerializer = ProductClassificationListSerializer
