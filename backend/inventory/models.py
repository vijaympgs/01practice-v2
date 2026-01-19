from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from products.models import ItemVariant
from suppliers.models import Supplier
from organization.models import Company
import uuid

User = get_user_model()

class Inventory(models.Model):
    """Main inventory model for tracking stock levels per product variant (SKU)"""
    
    STATUS_CHOICES = [
        ('in_stock', 'In Stock'),
        ('low_stock', 'Low Stock'),
        ('out_of_stock', 'Out of Stock'),
        ('discontinued', 'Discontinued'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='inventory_items', null=True, blank=True)
    product = models.OneToOneField(ItemVariant, on_delete=models.CASCADE, related_name='inventory')
    current_stock = models.PositiveIntegerField(default=0, help_text="Current quantity in stock")
    reserved_stock = models.PositiveIntegerField(default=0, help_text="Stock reserved for orders")
    available_stock = models.PositiveIntegerField(default=0, help_text="Stock available for sale")
    min_stock_level = models.PositiveIntegerField(default=0, help_text="Minimum stock before reorder")
    max_stock_level = models.PositiveIntegerField(default=0, help_text="Maximum stock capacity")
    reorder_point = models.PositiveIntegerField(default=0, help_text="Stock level to trigger reorder")
    reorder_quantity = models.PositiveIntegerField(default=0, help_text="Quantity to order when reordering")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Average cost per unit")
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Current selling price")
    location = models.CharField(max_length=100, blank=True, help_text="Physical location (warehouse/section)")
    bin_location = models.CharField(max_length=50, blank=True, help_text="Specific bin or shelf location")
    last_movement_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_stock')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='inventory_created')

    class Meta:
        db_table = 'inventory'
        verbose_name_plural = 'Inventory Items'
        ordering = ['-updated_at']
        unique_together = ['company', 'product']

    def __str__(self):
        return f"{self.product.variant_name} ({self.current_stock} units)"

    def update_available_stock(self):
        """Update available stock by subtracting reserved stock"""
        self.available_stock = max(0, self.current_stock - self.reserved_stock)
        return self.available_stock
    
    def can_fulfill_order(self, quantity):
        """Check if we can fulfill an order with given quantity"""
        return self.available_stock >= quantity

    def reserve_stock(self, quantity):
        """Reserve stock for an order"""
        if self.available_stock >= quantity:
            self.reserved_stock += quantity
            self.update_available_stock()
            self.save(update_fields=['reserved_stock', 'available_stock', 'updated_at'])
            return True
        return False

    def release_reserved_stock(self, quantity):
        """Release reserved stock (for cancelled orders)"""
        self.reserved_stock = max(0, self.reserved_stock - quantity)
        self.update_available_stock()
        self.save(update_fields=['reserved_stock', 'available_stock', 'updated_at'])

    def stock_level_status(self):
        """Determine stock level status"""
        if self.current_stock == 0:
            return 'out_of_stock'
        elif self.current_stock <= self.min_stock_level:
            return 'low_stock'
        else:
            return 'in_stock'

    def save(self, *args, **kwargs):
        """Override save to automatically update stock status and available stock"""
        self.update_available_stock()
        self.status = self.stock_level_status()
        super().save(*args, **kwargs)


class StockMovement(models.Model):
    """Model to track all stock movements (in/out/adjustments)"""
    
    MOVEMENT_TYPES = [
        ('purchase', 'Purchase'),
        ('sale', 'Sale'),
        ('adjustment', 'Adjustment'),
        ('transfer_in', 'Transfer In'),
        ('transfer_out', 'Transfer Out'),
        ('return', 'Return'),
        ('damage', 'Damage'),
        ('theft', 'Theft'),
        ('production', 'Production'),
        ('return_to_supplier', 'Return to Supplier'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='stock_movements', null=True, blank=True)
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity_change = models.IntegerField(help_text="Positive for incoming stock, negative for outgoing")
    quantity_before = models.PositiveIntegerField(help_text="Stock level before this movement")
    quantity_after = models.PositiveIntegerField(help_text="Stock level after this movement")
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    reference_number = models.CharField(max_length=10, blank=True, help_text="PO/SO number")
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(blank=True, help_text="Reason for adjustment")
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stock_movements'
        verbose_name_plural = 'Stock Movements'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.inventory.product.variant_name} - {self.get_movement_type_display()} ({self.quantity_change:+d})"

    def save(self, *args, **kwargs):
        """Ensure stock levels are updated when movement is created"""
        if not self.pk:  # Only on creation
            self.quantity_before = self.inventory.current_stock
            self.quantity_after = self.quantity_before + self.quantity_change
            
            # Update inventory stock
            self.inventory.current_stock = self.quantity_after
            self.inventory.last_movement_date = self.created_at
            self.inventory.save(update_fields=['current_stock', 'last_movement_date', 'updated_at'])
            
        super().save(*args, **kwargs)


class PurchaseOrder(models.Model):
    """Purchase orders for buying inventory from suppliers"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('ordered', 'Ordered'),
        ('received', 'Received'),
        ('partial', 'Partially Received'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='purchase_orders', null=True, blank=True)
    po_number = models.CharField(max_length=20, unique=True, help_text="Purchase Order Number")
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='purchase_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    order_date = models.DateTimeField(auto_now_add=True)
    expected_delivery_date = models.DateTimeField(null=True, blank=True)
    actual_delivery_date = models.DateTimeField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    terms_conditions = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_pos')
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'purchase_orders'
        verbose_name_plural = 'Purchase Orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"PO-{self.po_number} - {self.supplier.name}"

    def generate_po_number(self):
        """Generate unique PO number"""
        if not self.po_number:
            last_po = PurchaseOrder.objects.filter(
                po_number__startswith='PO-'
            ).order_by('-po_number').first()
            
            if last_po:
                last_number = int(last_po.po_number.split('-')[1])
                new_number = last_number + 1
            else:
                new_number = 1
                
            self.po_number = f"PO-{new_number:06d}"
        
        return self.po_number

    def calculate_total(self):
        """Calculate total amount from items"""
        total = sum(item.line_total for item in self.items.all())
        self.total_amount = total
        return total

    def approve(self, user):
        """Approve the purchase order"""
        self.status = 'approved'
        self.approved_by = user
        self.approved_at = timezone.now()
        self.save()

    def create_stock_movements(self):
        """Create stock movements for received items"""
        for item in self.items.all():
            if item.received_quantity > 0:
                inventory, created = Inventory.objects.get_or_create(
                    product=item.product,
                    company=self.company,
                    defaults={
                        'current_stock': 0,
                        'cost_price': item.unit_cost,
                        'created_by': self.created_by
                    }
                )
                
                StockMovement.objects.create(
                    inventory=inventory,
                    company=self.company,
                    movement_type='purchase',
                    quantity_change=item.received_quantity,
                    quantity_before=inventory.current_stock,
                    unit_cost=item.unit_cost,
                    total_cost=item.line_total,
                    reference_number=self.po_number,
                    supplier=self.supplier,
                    reason=f"Purchase order {self.po_number}",
                    created_by=self.created_by,
                    status='completed'
                )

    def save(self, *args, **kwargs):
        """Override save to generate PO number"""
        self.generate_po_number()
        super().save(*args, **kwargs)


class PurchaseOrderItem(models.Model):
    """Individual items in a purchase order"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(ItemVariant, on_delete=models.CASCADE)
    quantity_ordered = models.PositiveIntegerField()
    quantity_received = models.PositiveIntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)
    expected_delivery_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'purchase_order_items'
        verbose_name_plural = 'Purchase Order Items'
        unique_together = ['purchase_order', 'product']

    def __str__(self):
        return f"{self.product.variant_name} - {self.quantity_ordered} units"

    def calculate_line_total(self):
        """Calculate line total after discount"""
        subtotal = self.quantity_ordered * self.unit_cost
        if self.discount_percentage > 0:
            self.discount_amount = subtotal * (self.discount_percentage / 100)
        else:
            self.discount_amount = Decimal('0.00')
        
        self.line_total = subtotal - self.discount_amount
        return self.line_total

    def is_fully_received(self):
        """Check if item is fully received"""
        return self.quantity_received >= self.quantity_ordered

    def save(self, *args, **kwargs):
        """Override save to calculate totals"""
        self.calculate_line_total()
        super().save(*args, **kwargs)


class StockAlert(models.Model):
    """Stock alerts for low inventory or other issues"""
    
    ALERT_TYPES = [
        ('low_stock', 'Low Stock'),
        ('out_of_stock', 'Out of Stock'),
        ('overstock', 'Overstock'),
        ('expiry', 'Expiry Alert'),
        ('slow_moving', 'Slow Moving'),
        ('fast_moving', 'Fast Moving'),
        ('theft_risk', 'Theft Risk'),
        ('quality', 'Quality Issue'),
    ]

    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='stock_alerts', null=True, blank=True)
    product = models.ForeignKey(ItemVariant, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    message = models.TextField()
    current_stock = models.PositiveIntegerField()
    threshold_value = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stock_alerts'
        verbose_name_plural = 'Stock Alerts'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.variant_name} - {self.get_alert_type_display()}"

    def resolve(self, user, notes=""):
        """Mark alert as resolved"""
        self.is_resolved = True
        self.is_active = False
        self.resolved_by = user
        self.resolved_at = timezone.now()
        self.resolution_notes = notes
        self.save()

    @classmethod
    def create_low_stock_alert(cls, product):
        """Create low stock alert for a product"""
        inventory = product.inventory.first()
        if inventory and inventory.current_stock <= inventory.min_stock_level:
            alert, created = cls.objects.get_or_create(
                product=product,
                company=product.company,
                alert_type='low_stock',
                is_active=True,
                is_resolved=False,
                defaults={
                    'severity': 'high' if inventory.current_stock == 0 else 'medium',
                    'message': f"Stock level is {inventory.current_stock}, below minimum of {inventory.min_stock_level}",
                    'current_stock': inventory.current_stock,
                    'threshold_value': inventory.min_stock_level
                }
            )
            return alert
        return None

    @classmethod
    def create_out_of_stock_alert(cls, product):
        """Create out of stock alert"""
        alert, created = cls.objects.get_or_create(
            product=product,
            company=product.company,
            alert_type='out_of_stock',
            is_active=True,
            is_resolved=False,
            defaults={
                'severity': 'critical',
                'message': "Product is out of stock",
                'current_stock': 0,
                'threshold_value': 0
            }
        )
        return alert