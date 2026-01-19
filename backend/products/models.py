from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from organization.models import Company
from categories.models import Category, ProductAttributeTemplate, Attribute, AttributeValue
import uuid

User = get_user_model()


class UOM(models.Model):
    """Unit of Measure model"""
    
    BASIS_CHOICES = [
        ('length', 'Length'),
        ('units', 'Units'),
        ('volume', 'Volume'),
        ('capacity', 'Capacity'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='uoms', null=True, blank=True)
    code = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    basis = models.CharField(max_length=20, choices=BASIS_CHOICES, default='units')
    decimals = models.IntegerField(default=2)
    
    # Flag fields
    is_stock_uom = models.BooleanField(default=False, verbose_name='Stock UOM')
    is_purchase_uom = models.BooleanField(default=False, verbose_name='Purchase UOM')
    is_sales_uom = models.BooleanField(default=False, verbose_name='Sales UOM')
    
    # Status and Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_uoms')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_uoms')
    
    class Meta:
        verbose_name = "Unit of Measure"
        verbose_name_plural = "Units of Measure"
        ordering = ['code']
        db_table = 'products_uom'
        unique_together = ['company', 'code']
    
    def __str__(self):
        return f"{self.code} - {self.description}"
    
    @property
    def flags(self):
        """Return active flags as list"""
        flags = []
        if self.is_stock_uom:
            flags.append('Stock')
        if self.is_purchase_uom:
            flags.append('Purchase')
        if self.is_sales_uom:
            flags.append('Sales')
        return flags


class UOMConversion(models.Model):
    """UOM Conversion model for converting between different units"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='uom_conversions', null=True, blank=True)
    from_uom = models.ForeignKey(UOM, on_delete=models.CASCADE, related_name='conversions_from')
    to_uom = models.ForeignKey(UOM, on_delete=models.CASCADE, related_name='conversions_to')
    conversion_factor = models.DecimalField(max_digits=10, decimal_places=4, help_text='Multiplier to convert from UOM to To UOM')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_uom_conversions')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_uom_conversions')
    
    class Meta:
        verbose_name = "UOM Conversion"
        verbose_name_plural = "UOM Conversions"
        ordering = ['from_uom', 'to_uom']
        db_table = 'products_uom_conversion'
        unique_together = ['company', 'from_uom', 'to_uom']
    
    def __str__(self):
        return f"{self.from_uom.code} to {self.to_uom.code} ({self.conversion_factor})"
    
    def convert(self, value):
        """Convert a value from from_uom to to_uom"""
        return value * self.conversion_factor
    
    def reverse_convert(self, value):
        """Convert a value from to_uom back to from_uom"""
        return value / self.conversion_factor


class Brand(models.Model):
    """Brand model for merchandise management"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='brands', null=True, blank=True)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_brands')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_brands')
    
    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"
        db_table = 'products_brand'
        ordering = ['name']
        unique_together = ['company', 'code']
    
    def __str__(self):
        return self.name


class Item(models.Model):
    """
    Item Master (Parent) - Defines common properties for a product style/family.
    Matches BBP 2.5 Item Master (Parent).
    """
    
    ITEM_TYPE_CHOICES = [
        ('STOCKED', 'Stocked Product'),
        ('SERVICE', 'Service'),
        ('KIT', 'Kit / Package'),
        ('GIFT', 'Gift Card'),
    ]

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('ACTIVE', 'Active'),
        ('BLOCKED', 'Blocked'),
        ('DISCONTINUED', 'Discontinued'),
        ('ARCHIVED', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    item_code = models.CharField(max_length=50) # Unique per company
    item_name = models.CharField(max_length=200)
    short_name = models.CharField(max_length=100, blank=True, null=True)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES, default='STOCKED')
    
    attribute_template = models.ForeignKey(ProductAttributeTemplate, on_delete=models.PROTECT, related_name='items')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    
    stock_uom = models.ForeignKey(UOM, on_delete=models.PROTECT, related_name='stock_items')
    
    is_serialized = models.BooleanField(default=False)
    is_lot_tracked = models.BooleanField(default=False)
    is_taxable = models.BooleanField(default=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_items')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_items')

    class Meta:
        verbose_name = "Item (Parent)"
        verbose_name_plural = "Items (Parent)"
        db_table = 'products_item'
        unique_together = ['company', 'item_code']
        ordering = ['item_name']

    def __str__(self):
        return f"{self.item_name} ({self.item_code})"


class ItemVariant(models.Model):
    """
    Item Variant (SKU) - Defines specific sellable units (e.g., Red/M, Blue/L).
    Matches BBP 2.5 Item Variant (SKU).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='item_variants', null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='variants')
    sku_code = models.CharField(max_length=80) # Unique per company
    variant_name = models.CharField(max_length=200, help_text="e.g. Red / M")
    
    is_default_variant = models.BooleanField(default=False)
    
    sales_uom = models.ForeignKey(UOM, on_delete=models.PROTECT, related_name='variant_sales')
    purchase_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, blank=True, related_name='variant_purchases')
    stock_uom = models.ForeignKey(UOM, on_delete=models.PROTECT, related_name='variant_stocks') # Usually same as parent, but explicit here
    
    barcode = models.CharField(max_length=100, blank=True, null=True) # Per SKU barcode
    
    # Pricing defaults (can be overridden by Price List)
    default_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    default_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Item Variant"
        verbose_name_plural = "Item Variants"
        db_table = 'products_item_variant'
        unique_together = ['company', 'sku_code']
        ordering = ['variant_name']

    def __str__(self):
        return f"{self.variant_name} ({self.sku_code})"


class VariantAttribute(models.Model):
    """
    Links an Item Variant to specific Attribute Values (e.g. Color=Red).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item_variant = models.ForeignKey(ItemVariant, on_delete=models.CASCADE, related_name='attributes')
    attribute = models.ForeignKey(Attribute, on_delete=models.PROTECT)
    attribute_value = models.ForeignKey(AttributeValue, on_delete=models.PROTECT)

    class Meta:
        verbose_name = "Variant Attribute"
        verbose_name_plural = "Variant Attributes"
        db_table = 'products_variant_attribute'
        unique_together = ['item_variant', 'attribute']

    def __str__(self):
        return f"{self.item_variant.sku_code} - {self.attribute.name}: {self.attribute_value.value_label}"


class ItemTaxDetail(models.Model):
    """Tax Details linked to Item (Parent)"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='tax_details')
    tax_code = models.CharField(max_length=50)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_inclusive = models.BooleanField(default=False)
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    applicable_from = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Item Tax Detail"
        db_table = 'products_item_tax_detail'
