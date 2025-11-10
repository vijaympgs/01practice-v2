from django.db import models
from django.core.validators import MinLengthValidator
import uuid


class Category(models.Model):
    """
    Product category model for organizing products in the POS system.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=100, 
        unique=True,
        validators=[MinLengthValidator(2)],
        help_text="Category name (e.g., Electronics, Clothing, Food)"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Optional description of the category"
    )
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='children',
        help_text="Parent category for hierarchical organization"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this category is active and can be used"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Order for displaying categories (lower numbers first)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories'
        ordering = ['sort_order', 'name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name
    
    @property
    def full_path(self):
        """Return the full hierarchical path of the category."""
        if self.parent:
            return f"{self.parent.full_path} > {self.name}"
        return self.name
    
    @property
    def level(self):
        """Return the depth level of the category in the hierarchy."""
        if self.parent:
            return self.parent.level + 1
        return 0
    
    def get_children(self):
        """Return all active child categories."""
        return self.children.filter(is_active=True)
    
    def get_descendants(self):
        """Return all descendant categories (children, grandchildren, etc.)."""
        descendants = []
        for child in self.get_children():
            descendants.append(child)
            descendants.extend(child.get_descendants())
        return descendants
    
    def has_products(self):
        """Check if this category has any products."""
        return self.products.exists()
    
    def can_be_deleted(self):
        """Check if this category can be safely deleted."""
        return not self.has_products() and not self.get_children().exists()


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
