from django.db import models
from django.core.validators import MinLengthValidator
import uuid


class ProductClassification(models.Model):
    """
    Product classification model for organizing products in the POS system.
    (Renamed from Category to avoid confusion with ItemCategory)
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=100, 
        unique=True,
        validators=[MinLengthValidator(2)],
        help_text="Classification name (e.g., Electronics, Clothing, Food)"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Optional description of the classification"
    )
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='children',
        help_text="Parent classification for hierarchical organization"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this classification is active and can be used"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Order for displaying classifications (lower numbers first)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'product_classifications'
        ordering = ['sort_order', 'name']
        verbose_name = 'Product Classification'
        verbose_name_plural = 'Product Classifications'
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name
    
    @property
    def full_path(self):
        """Return the full hierarchical path of the classification."""
        if self.parent:
            return f"{self.parent.full_path} > {self.name}"
        return self.name
    
    @property
    def level(self):
        """Return the depth level of the classification in the hierarchy."""
        if self.parent:
            return self.parent.level + 1
        return 0
    
    def get_children(self):
        """Return all active child classifications."""
        return self.children.filter(is_active=True)
    
    def get_descendants(self):
        """Return all descendant classifications (children, grandchildren, etc.)."""
        descendants = []
        for child in self.get_children():
            descendants.append(child)
            descendants.extend(child.get_descendants())
        return descendants
    
    def has_products(self):
        """Check if this classification has any products."""
        return self.products.exists()
    
    def can_be_deleted(self):
        """Check if this classification can be safely deleted."""
        return not self.has_products() and not self.get_children().exists()


class ItemCategory(models.Model):
    """
    Item Category model for Item Master categorization
    """
    
    name = models.CharField(
        max_length=100, 
        unique=True,
        validators=[MinLengthValidator(2)],
        help_text="Item category name (e.g., Electronics, Apparels, Home & Kitchen)"
    )
    code = models.CharField(
        max_length=20, 
        unique=True,
        help_text="Item category code (e.g., ELEC, APP, HOME)"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Optional description of the item category"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this item category is active and can be used"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Order for displaying item categories (lower numbers first)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'item_categories'
        ordering = ['sort_order', 'name']
        verbose_name = 'Item Category'
        verbose_name_plural = 'Item Categories'
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    @property
    def subcategories_count(self):
        """Return the number of active subcategories."""
        return self.subcategories.filter(is_active=True).count()
    
    @property
    def items_count(self):
        """Return the number of items in this category."""
        return self.items.count()


class ItemSubCategory(models.Model):
    """
    Item Sub-Category model for Item Master sub-categorization
    """
    
    category = models.ForeignKey(
        ItemCategory, 
        on_delete=models.CASCADE, 
        related_name='subcategories',
        help_text="Parent item category"
    )
    name = models.CharField(
        max_length=100,
        help_text="Item sub-category name (e.g., Mobiles, Televisions, Men's Clothing)"
    )
    code = models.CharField(
        max_length=20,
        help_text="Item sub-category code (e.g., MOB, TV, MENS)"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Optional description of the item sub-category"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this item sub-category is active and can be used"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Order for displaying item sub-categories (lower numbers first)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'item_subcategories'
        ordering = ['category', 'sort_order', 'name']
        unique_together = ['category', 'code']
        verbose_name = 'Item Sub-Category'
        verbose_name_plural = 'Item Sub-Categories'
    
    def __str__(self):
        return f"{self.category.name} > {self.name} ({self.code})"
    
    @property
    def items_count(self):
        """Return the number of items in this sub-category."""
        return self.items.count()


class Attribute(models.Model):
    """
    Attribute model for defining product attributes (e.g., Color, Size, Brand).
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Attribute name (e.g., Color, Size, Brand)"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Optional description of the attribute"
    )
    data_type = models.CharField(
        max_length=20,
        choices=[
            ('text', 'Text'),
            ('number', 'Number'),
            ('boolean', 'Boolean'),
            ('date', 'Date'),
            ('select', 'Select (LOV)'),
        ],
        default='select',
        help_text="Data type for the attribute"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this attribute is active"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Order for displaying attributes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories_attribute'
        ordering = ['sort_order', 'name']
        verbose_name = 'Attribute'
        verbose_name_plural = 'Attributes'
    
    def __str__(self):
        return self.name


class AttributeValue(models.Model):
    """
    AttributeValue model for storing specific values of attributes.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name='values',
        help_text="The attribute this value belongs to"
    )
    value = models.CharField(
        max_length=200,
        help_text="The attribute value"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Optional description of the value"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this value is active"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Order for displaying values"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories_attribute_value'
        ordering = ['sort_order', 'value']
        verbose_name = 'Attribute Value'
        verbose_name_plural = 'Attribute Values'
        unique_together = ['attribute', 'value']
    
    def __str__(self):
        return f"{self.attribute.name}: {self.value}"
