from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()


class Product(models.Model):
    """Product model"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True, validators=[MinValueValidator(2)])
    description = models.TextField(blank=True, null=True)
    sku = models.CharField(max_length=100, unique=True)
    barcode = models.CharField(max_length=100, unique=True, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, validators=[MinValueValidator(0)])
    stock_quantity = models.PositiveIntegerField(default=0)
    minimum_stock = models.PositiveIntegerField(default=0)
    maximum_stock = models.PositiveIntegerField(blank=True, null=True)
    weight = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    dimensions = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_taxable = models.BooleanField(default=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['name']
        db_table = 'products'
    
    def __str__(self):
        return self.name
    
    @property
    def profit_margin(self):
        """Calculate profit margin percentage"""
        if self.cost and self.price:
            return ((self.price - self.cost) / self.cost) * 100
        return 0
    
    @property
    def profit_amount(self):
        """Calculate profit amount"""
        if self.cost and self.price:
            return self.price - self.cost
        return 0
    
    @property
    def stock_status(self):
        """Get stock status"""
        if self.stock_quantity == 0:
            return 'out_of_stock'
        elif self.stock_quantity <= self.minimum_stock:
            return 'low_stock'
        elif self.maximum_stock and self.stock_quantity >= self.maximum_stock:
            return 'overstocked'
        else:
            return 'in_stock'
    
    @property
    def stock_value(self):
        """Calculate stock value"""
        return self.stock_quantity * self.cost if self.cost else 0
    
    @property
    def can_be_sold(self):
        """Check if product can be sold"""
        return self.is_active and self.stock_quantity > 0


class UOM(models.Model):
    """Unit of Measure model"""
    
    BASIS_CHOICES = [
        ('length', 'Length'),
        ('units', 'Units'),
        ('volume', 'Volume'),
        ('capacity', 'Capacity'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True)
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
        unique_together = ['from_uom', 'to_uom']
    
    def __str__(self):
        return f"{self.from_uom.code} to {self.to_uom.code} ({self.conversion_factor})"
    
    def convert(self, value):
        """Convert a value from from_uom to to_uom"""
        return value * self.conversion_factor
    
    def reverse_convert(self, value):
        """Convert a value from to_uom back to from_uom"""
        return value / self.conversion_factor


class ItemMaster(models.Model):
    """Item Master model for comprehensive item management"""
    
    MATERIAL_TYPE_CHOICES = [
        ('raw', 'Raw Material'),
        ('finished', 'Finished Good'),
        ('semi', 'Semi-Finished'),
        ('consumable', 'Consumable'),
        ('service', 'Service'),
    ]
    
    ITEM_TYPE_CHOICES = [
        ('spare', 'Spare'),
        ('device', 'Device'),
        ('ew', 'EW'),
        ('accessory', 'Accessory'),
    ]
    
    EXCHANGE_TYPE_CHOICES = [
        ('none', 'None'),
        ('allowed', 'Allowed'),
        ('exchange_only', 'Exchange Only'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # General Information
    ean_upc_code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    item_code = models.CharField(max_length=50, unique=True)
    item_name = models.CharField(max_length=200)
    short_name = models.CharField(max_length=100, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    supplier = models.CharField(max_length=200, blank=True, null=True)
    
    # Pricing
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    landing_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    store_pickup = models.BooleanField(default=False)
    sales_margin = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Taxes
    tax_inclusive = models.BooleanField(default=False)
    
    # Sales
    allow_buy_back = models.BooleanField(default=False)
    allow_negative_stock = models.BooleanField(default=False)
    
    # Packing
    base_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, related_name='base_items')
    purchase_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, related_name='purchase_items')
    sales_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, related_name='sales_items')
    
    # Category
    category = models.ForeignKey('categories.Category', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Local Tax (GST)
    tax_code = models.CharField(max_length=50, blank=True, null=True)
    hsn_code = models.CharField(max_length=50, blank=True, null=True)
    tax_slab = models.CharField(max_length=50, blank=True, null=True)
    
    # Item Type
    material_type = models.CharField(max_length=20, choices=MATERIAL_TYPE_CHOICES, default='finished')
    material_group = models.CharField(max_length=100, blank=True, null=True)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES, default='device')
    exchange_type = models.CharField(max_length=20, choices=EXCHANGE_TYPE_CHOICES, default='none')
    
    # Status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_items')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_items')
    
    class Meta:
        verbose_name = "Item Master"
        verbose_name_plural = "Item Masters"
        ordering = ['item_name']
        db_table = 'products_item_master'
    
    def __str__(self):
        return f"{self.item_code} - {self.item_name}"
    
    @property
    def profit_margin(self):
        """Calculate profit margin"""
        if self.cost_price and self.sell_price:
            return ((self.sell_price - self.cost_price) / self.cost_price) * 100
        return 0


class AdvancedItemMaster(models.Model):
    """Advanced Item Master model with comprehensive item management"""
    
    # Item Type Choices
    ITEM_TYPE_CHOICES = [
        ('merchandise', 'Merchandise Item'),
        ('non_merchandise', 'Non-Merchandise Item'),
        ('non_physical', 'Non-Physical'),
    ]
    
    # Stock Valuation Method Choices
    VALUATION_METHOD_CHOICES = [
        ('fifo', 'First-In First-Out (FIFO)'),
        ('lifo', 'Last-In Last-Out (LIFO)'),
        ('average', 'Average Cost'),
    ]
    
    # Stock Issue Type Choices
    ISSUE_TYPE_CHOICES = [
        ('fifo', 'FIFO'),
        ('lifo', 'LIFO'),
    ]
    
    # Default Price Type Choices
    PRICE_TYPE_CHOICES = [
        ('retail', 'Retail'),
        ('wholesale', 'Wholesale'),
        ('customer_specific', 'Customer Specific'),
    ]
    
    # Movement Type Choices
    MOVEMENT_TYPE_CHOICES = [
        ('fast', 'Fast Moving'),
        ('medium', 'Medium Moving'),
        ('slow', 'Slow Moving'),
    ]
    
    # Warranty Type Choices
    WARRANTY_TYPE_CHOICES = [
        ('manufacturer', 'Manufacturer Warranty'),
        ('extended', 'Extended Warranty'),
        ('none', 'No Warranty'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Tab 1: General Information
    item_code = models.CharField(max_length=50, unique=True)
    item_name = models.CharField(max_length=200)
    short_name = models.CharField(max_length=100, blank=True, null=True)
    supplier = models.CharField(max_length=200, blank=True, null=True)
    manufacturer = models.CharField(max_length=200, blank=True, null=True)
    division = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    group = models.CharField(max_length=100, blank=True, null=True)
    item_status = models.CharField(max_length=50, default='active')
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES, default='merchandise')
    stock_valuation_method = models.CharField(max_length=20, choices=VALUATION_METHOD_CHOICES, default='fifo')
    stock_issue_type = models.CharField(max_length=20, choices=ISSUE_TYPE_CHOICES, default='fifo')
    default_price_type = models.CharField(max_length=20, choices=PRICE_TYPE_CHOICES, default='retail')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPE_CHOICES, default='medium')
    taxable = models.BooleanField(default=True)
    batch_item_flag = models.BooleanField(default=False)
    pack_items = models.BooleanField(default=False)
    weighted_article_flag = models.BooleanField(default=False)
    serialized_item_flag = models.BooleanField(default=False)
    item_part_flag = models.BooleanField(default=False)
    accessory_flag = models.BooleanField(default=False)
    warranty_flag = models.BooleanField(default=False)
    warranty_type = models.CharField(max_length=20, choices=WARRANTY_TYPE_CHOICES, default='none')
    warranty_period = models.IntegerField(default=0)
    extended_warranty_type = models.CharField(max_length=50, blank=True, null=True)
    extended_warranty_period = models.IntegerField(default=0)
    warranty_in_months = models.IntegerField(default=0)
    extended_warranty_details = models.CharField(max_length=200, blank=True, null=True)
    hs_code = models.CharField(max_length=50, blank=True, null=True)
    stock_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, related_name='advanced_stock_items')
    purchase_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, related_name='advanced_purchase_items')
    sales_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, related_name='advanced_sales_items')
    item_image = models.ImageField(upload_to='items/', blank=True, null=True)
    
    # Tab 10: Price Details
    weighted_average_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_advanced_items')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_advanced_items')
    
    class Meta:
        verbose_name = "Advanced Item Master"
        verbose_name_plural = "Advanced Item Masters"
        ordering = ['item_name']
        db_table = 'products_advanced_item_master'
    
    def __str__(self):
        return f"{self.item_code} - {self.item_name}"


class ItemAttribute(models.Model):
    """Item Attributes mapping for Tab 2"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='item_attributes')
    attribute_name = models.CharField(max_length=100)
    attribute_value = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Item Attribute"
        verbose_name_plural = "Item Attributes"
        db_table = 'products_item_attribute'
        unique_together = ['item', 'attribute_name']


class ItemPackage(models.Model):
    """Item Packages for Tab 3"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='packages')
    package_code = models.CharField(max_length=50)
    package_name = models.CharField(max_length=200)
    package_type = models.CharField(max_length=50, blank=True, null=True)
    package_description = models.TextField(blank=True, null=True)
    package_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True)
    package_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    package_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    package_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Item Package"
        verbose_name_plural = "Item Packages"
        db_table = 'products_item_package'
    
    def __str__(self):
        return f"{self.package_code} - {self.package_name}"


class PackageComponent(models.Model):
    """Package Components for Tab 3"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    package = models.ForeignKey(ItemPackage, on_delete=models.CASCADE, related_name='components')
    component_item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Package Component"
        verbose_name_plural = "Package Components"
        db_table = 'products_package_component'


class SecondarySupplier(models.Model):
    """Secondary Supplier Details for Tab 5"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='secondary_suppliers')
    supplier_code = models.CharField(max_length=50)
    supplier_name = models.CharField(max_length=200)
    supplier_item_code = models.CharField(max_length=50, blank=True, null=True)
    supplier_item_description = models.CharField(max_length=500, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    priority = models.IntegerField(default=1)
    lead_time = models.IntegerField(default=0)
    minimum_order_qty = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Secondary Supplier"
        verbose_name_plural = "Secondary Suppliers"
        db_table = 'products_secondary_supplier'
    
    def __str__(self):
        return f"{self.supplier_code} - {self.supplier_name}"


class SupplierBarcode(models.Model):
    """Supplier Barcode for Tab 5"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    secondary_supplier = models.ForeignKey(SecondarySupplier, on_delete=models.CASCADE, related_name='barcodes')
    barcode = models.CharField(max_length=100, unique=True)
    barcode_type = models.CharField(max_length=50, default='EAN')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Supplier Barcode"
        verbose_name_plural = "Supplier Barcodes"
        db_table = 'products_supplier_barcode'


class AlternateItem(models.Model):
    """Alternate Items Mapping for Tab 6"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='alternate_items')
    alternate_item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='main_items')
    substitution_reason = models.CharField(max_length=200, blank=True, null=True)
    priority = models.IntegerField(default=1)
    auto_substitute = models.BooleanField(default=False)
    allow_package_substitution = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Alternate Item"
        verbose_name_plural = "Alternate Items"
        db_table = 'products_alternate_item'
        unique_together = ['item', 'alternate_item']


class ItemComponent(models.Model):
    """Component Mapping for Tab 7"""
    
    COMPONENT_TYPE_CHOICES = [
        ('accessory', 'Accessory'),
        ('item_part', 'Item Part'),
        ('pack_item', 'Pack Item'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='components')
    component_item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='main_item_components')
    component_type = models.CharField(max_length=20, choices=COMPONENT_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    mandatory = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Item Component"
        verbose_name_plural = "Item Components"
        db_table = 'products_item_component'


class ItemTaxDetail(models.Model):
    """Tax Details for Tab 8"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='tax_details')
    tax_code = models.CharField(max_length=50)
    tax_slab = models.CharField(max_length=50, blank=True, null=True)
    tax_type = models.CharField(max_length=50, blank=True, null=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_inclusive = models.BooleanField(default=False)
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    applicable_from = models.DateField(blank=True, null=True)
    applicable_to = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Item Tax Detail"
        verbose_name_plural = "Item Tax Details"
        db_table = 'products_item_tax_detail'


class ItemSpecification(models.Model):
    """Item Specifications for Tab 9"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='specifications')
    specifications = models.TextField()
    technical_details = models.TextField(blank=True, null=True)
    additional_notes = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_item_specifications')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_item_specifications')
    
    class Meta:
        verbose_name = "Item Specification"
        verbose_name_plural = "Item Specifications"
        db_table = 'products_item_specification'


class ItemPriceHistory(models.Model):
    """Price History for Tab 10"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(AdvancedItemMaster, on_delete=models.CASCADE, related_name='price_history')
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    margin_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    effective_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Item Price History"
        verbose_name_plural = "Item Price Histories"
        db_table = 'products_item_price_history'
        ordering = ['-effective_date']


class Brand(models.Model):
    """Brand model for merchandise management"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True)
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
    
    def __str__(self):
        return self.name


class Department(models.Model):
    """Department model for merchandise management"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_departments')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_departments')
    
    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        db_table = 'products_department'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Division(models.Model):
    """Division model for merchandise management"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_divisions')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_divisions')
    
    class Meta:
        verbose_name = "Division"
        verbose_name_plural = "Divisions"
        db_table = 'products_division'
        ordering = ['name']
    
    def __str__(self):
        return self.name
