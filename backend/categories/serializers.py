from rest_framework import serializers
from .models import Category, Attribute, AttributeValue, ProductAttributeTemplate, ProductAttributeTemplateLine


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model.
    """
    
    full_path = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    children_count = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    can_be_deleted = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'company', 'name', 'description', 'parent', 'is_active', 
            'sort_order', 'created_at', 'updated_at', 'full_path', 
            'level', 'children_count', 'products_count', 'can_be_deleted'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_children_count(self, obj):
        """Return the number of active child categories."""
        return obj.get_children().count()
    
    def get_products_count(self, obj):
        """Return the number of products in this category."""
        return obj.products.count() if hasattr(obj, 'products') else 0
    
    def validate_name(self, value):
        """Validate category name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Category name must be at least 2 characters long.")
        return value.strip()
    
    def validate_parent(self, value):
        """Validate parent category."""
        if value and value == self.instance:
            raise serializers.ValidationError("A category cannot be its own parent.")
        return value


class CategoryCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new categories.
    """
    
    class Meta:
        model = Category
        fields = [
            'company', 'name', 'description', 'parent', 'is_active', 'sort_order'
        ]
    
    def validate_name(self, value):
        """Validate category name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Category name must be at least 2 characters long.")
        return value.strip()
    
    def validate_parent(self, value):
        """Validate parent category."""
        if value and not value.is_active:
            raise serializers.ValidationError("Parent category must be active.")
        return value


class CategoryUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating categories.
    """
    
    class Meta:
        model = Category
        fields = [
            'company', 'name', 'description', 'parent', 'is_active', 'sort_order'
        ]
    
    def validate_name(self, value):
        """Validate category name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Category name must be at least 2 characters long.")
        return value.strip()
    
    def validate_parent(self, value):
        """Validate parent category."""
        if value and value == self.instance:
            raise serializers.ValidationError("A category cannot be its own parent.")
        if value and not value.is_active:
            raise serializers.ValidationError("Parent category must be active.")
        return value


class CategoryTreeSerializer(serializers.ModelSerializer):
    """
    Serializer for hierarchical category tree structure.
    """
    
    children = serializers.SerializerMethodField()
    full_path = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'company', 'name', 'description', 'is_active', 'sort_order',
            'full_path', 'level', 'children'
        ]
    
    def get_children(self, obj):
        """Return child categories in tree structure."""
        children = obj.get_children()
        if children.exists():
            return CategoryTreeSerializer(children, many=True, context=self.context).data
        return []


class CategoryListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for category lists.
    """
    
    full_path = serializers.ReadOnlyField()
    level = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'company', 'name', 'description', 'is_active', 
            'sort_order', 'full_path', 'level'
        ]


class AttributeValueSerializer(serializers.ModelSerializer):
    """
    Serializer for AttributeValue model.
    """
    
    class Meta:
        model = AttributeValue
        fields = [
            'id', 'company', 'attribute', 'value_code', 'value_label', 
            'description', 'is_default', 'is_active', 'sort_order', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttributeSerializer(serializers.ModelSerializer):
    """
    Serializer for Attribute model.
    """
    
    values = AttributeValueSerializer(many=True, read_only=True)
    values_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Attribute
        fields = [
            'id', 'company', 'attribute_code', 'name', 'description', 
            'input_type', 'value_source', 'is_variant_dimension', 
            'is_search_facet', 'is_active', 'sort_order', 
            'created_at', 'updated_at', 'values', 'values_count'
        ]
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
        fields = [
            'id', 'company', 'attribute_code', 'name', 'description', 
            'input_type', 'is_active', 'sort_order', 'values_count'
        ]
    
    def get_values_count(self, obj):
        """Return the number of active values for this attribute."""
        return obj.values.filter(is_active=True).count()


class ProductAttributeTemplateLineSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductAttributeTemplateLine.
    """
    class Meta:
        model = ProductAttributeTemplateLine
        fields = '__all__'


class ProductAttributeTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductAttributeTemplate.
    """
    lines = ProductAttributeTemplateLineSerializer(many=True, read_only=True)

    class Meta:
        model = ProductAttributeTemplate
        fields = '__all__'
