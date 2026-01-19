from django.db import models
from django.core.validators import MinLengthValidator
from organization.models import Company
import uuid


class Category(models.Model):
    """
    Product category model for organizing products in the POS system.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    name = models.CharField(
        max_length=100, 
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
        unique_together = ['company', 'name']
    
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
        return self.items.exists()
    
    def can_be_deleted(self):
        """Check if this category can be safely deleted."""
        return not self.has_products() and not self.get_children().exists()


class Attribute(models.Model):
    """
    Attribute model for defining product attributes (e.g., Color, Size, Brand).
    """
    
    INPUT_TYPE_CHOICES = [
        ('TEXT', 'Text'),
        ('NUMBER', 'Number'),
        ('BOOLEAN', 'Boolean'),
        ('LIST', 'List'),
        ('MULTI', 'Multi-Select'),
    ]

    VALUE_SOURCE_CHOICES = [
        ('FIXED_LIST', 'Fixed List'),
        ('FREE_TEXT', 'Free Text'),
        ('DERIVED', 'Derived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='attributes', null=True, blank=True)
    attribute_code = models.CharField(max_length=50, null=True, blank=True)
    name = models.CharField(
        max_length=100,
        help_text="Attribute name (e.g., Color, Size, Brand)"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Optional description of the attribute"
    )
    input_type = models.CharField(
        max_length=20,
        choices=INPUT_TYPE_CHOICES,
        default='LIST',
        help_text="Data type for the attribute"
    )
    value_source = models.CharField(
        max_length=20,
        choices=VALUE_SOURCE_CHOICES,
        default='FIXED_LIST',
        help_text="Source of attribute values"
    )
    is_variant_dimension = models.BooleanField(
        default=False,
        help_text="Can be used for SKU variants"
    )
    is_search_facet = models.BooleanField(
        default=False,
        help_text="Use in search filters"
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
        unique_together = ['company', 'attribute_code']
    
    def __str__(self):
        return f"{self.name} ({self.attribute_code})"


class AttributeValue(models.Model):
    """
    AttributeValue model for storing specific values of attributes.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='attribute_values', null=True, blank=True)
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name='values',
        help_text="The attribute this value belongs to"
    )
    value_code = models.CharField(max_length=50, null=True, blank=True)
    value_label = models.CharField(
        max_length=100,
        help_text="The attribute value label",
        null=True, blank=True
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Optional description of the value"
    )
    is_default = models.BooleanField(default=False)
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
        ordering = ['sort_order', 'value_label']
        verbose_name = 'Attribute Value'
        verbose_name_plural = 'Attribute Values'
        unique_together = [['company', 'attribute', 'value_code']]
    
    def __str__(self):
        return f"{self.attribute.name}: {self.value_label}"


class ProductAttributeTemplate(models.Model):
    """
    Product Attribute Template for defining sets of attributes and variant dimensions.
    """
    
    TEMPLATE_MODE_CHOICES = [
        ('SIMPLE', 'Simple'),
        ('VARIANT_MATRIX', 'Variant Matrix'),
        ('HYBRID', 'Hybrid'),
    ]
    
    ITEM_TYPE_SCOPE_CHOICES = [
        ('APPAREL', 'Apparel'),
        ('ELECTRONICS', 'Electronics'),
        ('FURNITURE', 'Furniture'),
        ('GROCERY', 'Grocery'),
        ('OTHER', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='attribute_templates', null=True, blank=True)
    template_code = models.CharField(max_length=50, null=True, blank=True)
    template_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    template_mode = models.CharField(max_length=20, choices=TEMPLATE_MODE_CHOICES, default='VARIANT_MATRIX')
    is_core_template = models.BooleanField(default=False)
    is_editable = models.BooleanField(default=True)
    item_type_scope = models.CharField(max_length=20, choices=ITEM_TYPE_SCOPE_CHOICES, blank=True, null=True)
    category_scope = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    version_no = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'categories_product_attribute_template'
        unique_together = ['company', 'template_code']
        ordering = ['template_name']

    def __str__(self):
        return f"{self.template_name} ({self.template_code})"


class ProductAttributeTemplateLine(models.Model):
    """
    Lines for ProductAttributeTemplate.
    """
    
    VALUE_MODE_CHOICES = [
        ('SINGLE', 'Single Value'),
        ('MULTI', 'Multi Value'),
        ('DERIVED', 'Derived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template = models.ForeignKey(ProductAttributeTemplate, on_delete=models.CASCADE, related_name='lines')
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE)
    is_required = models.BooleanField(default=False)
    is_variant_dimension = models.BooleanField(default=False)
    value_mode = models.CharField(max_length=20, choices=VALUE_MODE_CHOICES, default='SINGLE')
    default_value = models.ForeignKey(AttributeValue, on_delete=models.SET_NULL, null=True, blank=True)
    sequence_no = models.IntegerField(default=0)
    is_search_facet = models.BooleanField(default=False)
    is_pricing_relevant = models.BooleanField(default=False)
    is_reporting_relevant = models.BooleanField(default=False)
    is_pos_visible = models.BooleanField(default=False)

    class Meta:
        db_table = 'categories_product_attribute_template_line'
        ordering = ['sequence_no']
        unique_together = ['template', 'attribute']

    def __str__(self):
        return f"{self.template.template_code} - {self.attribute.name}"
