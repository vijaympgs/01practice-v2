"""
Procurement Models
NewBorn Retail™ - AI-Powered Enterprise ERP System
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

User = get_user_model()
from products.models import ItemVariant


# ============================================================================
# Purchase Request Models
# ============================================================================

class PurchaseRequest(models.Model):
    """
    Purchase Request - Initial procurement request from departments
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('converted', 'Converted to PO'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_number = models.CharField(max_length=50, unique=True, db_index=True)
    request_date = models.DateField(db_index=True)
    
    # Requestor details
    requested_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='purchase_requests')
    department = models.CharField(max_length=100, blank=True)
    
    # Request details
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    justification = models.TextField(blank=True)
    expected_delivery = models.DateField(null=True, blank=True)
    
    # Financial
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    approval_status = models.CharField(max_length=50, default='Pending Approval')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'purchase_requests'
        ordering = ['-request_date', '-created_at']
        indexes = [
            models.Index(fields=['request_number']),
            models.Index(fields=['status', 'request_date']),
            models.Index(fields=['requested_by', 'request_date']),
        ]
    
    def __str__(self):
        return f"{self.request_number} - {self.requested_by.username}"
    
    def save(self, *args, **kwargs):
        if not self.request_number:
            # Generate request number
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            last_request = PurchaseRequest.objects.filter(
                request_number__startswith=f'PR-{date_str}'
            ).order_by('-request_number').first()
            
            if last_request:
                last_num = int(last_request.request_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.request_number = f'PR-{date_str}-{str(new_num).zfill(3)}'
        
        super().save(*args, **kwargs)


class PurchaseRequestItem(models.Model):
    """
    Purchase Request Line Items
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_request = models.ForeignKey(
        PurchaseRequest, 
        on_delete=models.CASCADE, 
        related_name='items'
    )
    
    # Item details
    product = models.ForeignKey(
        ItemVariant,
        on_delete=models.PROTECT,
        related_name='purchase_request_items',
        null=True,
        blank=True
    )
    item_code = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=500)
    
    # Quantities and pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(Decimal('0.001'))])
    unit_price = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=18, decimal_places=2)
    
    # Metadata
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'purchase_request_items'
        ordering = ['id']
    
    def save(self, *args, **kwargs):
        self.total = self.quantity * self.unit_price
        super().save(*args, **kwargs)


# ============================================================================
# Purchase Enquiry Models
# ============================================================================

class PurchaseEnquiry(models.Model):
    """
    Purchase Enquiry - Request for quotation from suppliers
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent to Suppliers'),
        ('responded', 'Responded'),
        ('closed', 'Closed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enquiry_number = models.CharField(max_length=50, unique=True, db_index=True)
    enquiry_date = models.DateField(db_index=True)
    
    # Reference
    purchase_request = models.ForeignKey(
        PurchaseRequest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='enquiries'
    )
    
    # Supplier
    supplier = models.ForeignKey(
        'suppliers.Supplier',
        on_delete=models.PROTECT,
        related_name='purchase_enquiries'
    )
    
    # Financial
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'purchase_enquiries'
        ordering = ['-enquiry_date', '-created_at']
        indexes = [
            models.Index(fields=['enquiry_number']),
            models.Index(fields=['supplier', 'enquiry_date']),
        ]
    
    def __str__(self):
        return f"{self.enquiry_number} - {self.supplier.name}"
    
    def save(self, *args, **kwargs):
        if not self.enquiry_number:
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            last_enquiry = PurchaseEnquiry.objects.filter(
                enquiry_number__startswith=f'PE-{date_str}'
            ).order_by('-enquiry_number').first()
            
            if last_enquiry:
                last_num = int(last_enquiry.enquiry_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.enquiry_number = f'PE-{date_str}-{str(new_num).zfill(3)}'
        
        super().save(*args, **kwargs)


class PurchaseEnquiryItem(models.Model):
    """
    Purchase Enquiry Line Items
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_enquiry = models.ForeignKey(
        PurchaseEnquiry,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    # Item details
    product = models.ForeignKey(
        ItemVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    item_code = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=500)
    
    # Quantities and pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(Decimal('0.001'))])
    unit_price = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=18, decimal_places=2)
    
    class Meta:
        db_table = 'purchase_enquiry_items'
        ordering = ['id']
    
    def save(self, *args, **kwargs):
        self.total = self.quantity * self.unit_price
        super().save(*args, **kwargs)


# ============================================================================
# Purchase Quotation Models
# ============================================================================

class PurchaseQuotation(models.Model):
    """
    Purchase Quotation - Supplier response to enquiry
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('received', 'Received'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quotation_number = models.CharField(max_length=50, unique=True, db_index=True)
    quotation_date = models.DateField(db_index=True)
    valid_until = models.DateField(null=True, blank=True)
    
    # References
    purchase_enquiry = models.ForeignKey(
        PurchaseEnquiry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='quotations'
    )
    
    # Supplier
    supplier = models.ForeignKey(
        'suppliers.Supplier',
        on_delete=models.PROTECT,
        related_name='purchase_quotations'
    )
    
    # Financial
    subtotal = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'purchase_quotations'
        ordering = ['-quotation_date', '-created_at']
        indexes = [
            models.Index(fields=['quotation_number']),
            models.Index(fields=['supplier', 'status']),
        ]
    
    def __str__(self):
        return f"{self.quotation_number} - {self.supplier.name}"
    
    def save(self, *args, **kwargs):
        if not self.quotation_number:
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            last_quote = PurchaseQuotation.objects.filter(
                quotation_number__startswith=f'PQ-{date_str}'
            ).order_by('-quotation_number').first()
            
            if last_quote:
                last_num = int(last_quote.quotation_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.quotation_number = f'PQ-{date_str}-{str(new_num).zfill(3)}'
        
        super().save(*args, **kwargs)


class PurchaseQuotationItem(models.Model):
    """
    Purchase Quotation Line Items
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_quotation = models.ForeignKey(
        PurchaseQuotation,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    # Item details
    product = models.ForeignKey(
        ItemVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    item_code = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=500)
    
    # Quantities and pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(Decimal('0.001'))])
    unit_price = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=18, decimal_places=2)
    
    # Lead time
    lead_time_days = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'purchase_quotation_items'
        ordering = ['id']
    
    def save(self, *args, **kwargs):
        # Calculate line total
        subtotal = self.quantity * self.unit_price
        self.discount_amount = subtotal * (self.discount_percentage / 100)
        self.tax_amount = (subtotal - self.discount_amount) * (self.tax_percentage / 100)
        self.total = subtotal - self.discount_amount + self.tax_amount
        
        super().save(*args, **kwargs)


# ============================================================================
# Purchase Order Models
# ============================================================================

class PurchaseOrder(models.Model):
    """
    Purchase Order - Final procurement order to supplier
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending_approval', 'Pending Approval'),
        ('approved', 'Approved'),
        ('order_placed', 'Order Placed'),
        ('partially_received', 'Partially Received'),
        ('fully_received', 'Fully Received'),
        ('invoice_received', 'Invoice Received'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    order_date = models.DateField(db_index=True)
    
    # References
    purchase_request = models.ForeignKey(
        PurchaseRequest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='purchase_orders'
    )
    purchase_quotation = models.ForeignKey(
        PurchaseQuotation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='purchase_orders'
    )
    
    # Supplier
    supplier = models.ForeignKey(
        'suppliers.Supplier',
        on_delete=models.PROTECT,
        related_name='procurement_purchase_orders'
    )
    
    # Order details
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    delivery_date = models.DateField(null=True, blank=True)
    payment_terms = models.CharField(max_length=100, blank=True)
    delivery_address = models.TextField(blank=True)
    special_instructions = models.TextField(blank=True)
    
    # Financial
    subtotal = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    
    # Status
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='draft')
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='procurement_purchase_orders_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'procurement_purchase_orders'
        ordering = ['-order_date', '-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['supplier', 'status']),
            models.Index(fields=['status', 'order_date']),
        ]
    
    def __str__(self):
        return f"{self.order_number} - {self.supplier.name}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            last_order = PurchaseOrder.objects.filter(
                order_number__startswith=f'PO-{date_str}'
            ).order_by('-order_number').first()
            
            if last_order:
                last_num = int(last_order.order_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.order_number = f'PO-{date_str}-{str(new_num).zfill(3)}'
        
        super().save(*args, **kwargs)


class PurchaseOrderItem(models.Model):
    """
    Purchase Order Line Items
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    # Item details
    product = models.ForeignKey(
        ItemVariant,
        on_delete=models.PROTECT,
        related_name='purchase_order_items',
        null=True,
        blank=True
    )
    item_code = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=500)
    
    # Quantities and pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(Decimal('0.001'))])
    unit_price = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=18, decimal_places=2)
    
    # Received tracking
    received_quantity = models.DecimalField(max_digits=10, decimal_places=3, default=Decimal('0.000'))
    
    # Metadata
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'procurement_purchase_order_items'
        ordering = ['id']
    
    def save(self, *args, **kwargs):
        # Calculate line total
        subtotal = self.quantity * self.unit_price
        self.discount_amount = subtotal * (self.discount_percentage / 100)
        self.tax_amount = (subtotal - self.discount_amount) * (self.tax_percentage / 100)
        self.total = subtotal - self.discount_amount + self.tax_amount
        
        super().save(*args, **kwargs)
    
    @property
    def pending_quantity(self):
        return max(Decimal('0.000'), self.quantity - self.received_quantity)


# ============================================================================
# Goods Received Note (GRN) Models
# ============================================================================

class GoodsReceivedNote(models.Model):
    """
    Goods Received Note - Receipt of goods from supplier
    """
    STATUS_CHOICES = [
        ('partial', 'Partial'),
        ('complete', 'Complete'),
        ('closed', 'Closed'),
    ]
    
    CONDITION_CHOICES = [
        ('good', 'Good'),
        ('damaged', 'Damaged'),
        ('partial', 'Partial'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    grn_number = models.CharField(max_length=50, unique=True, db_index=True)
    grn_date = models.DateField(db_index=True)
    
    # References
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.PROTECT,
        related_name='procurement_grns'
    )
    
    # Supplier
    supplier = models.ForeignKey(
        'suppliers.Supplier',
        on_delete=models.PROTECT,
        related_name='procurement_grns_supplier'
    )
    
    # Delivery details
    delivery_note = models.CharField(max_length=100, blank=True)
    challan_number = models.CharField(max_length=100, blank=True)
    
    # Financial
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    received_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    pending_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    
    # Received by
    received_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='procurement_grns_received'
    )
    inspected_by = models.CharField(max_length=100, blank=True)
    
    # Location
    location = models.ForeignKey(
        'organization.Location',
        on_delete=models.PROTECT,
        related_name='procurement_grns',
        null=True,
        blank=True
    )
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='partial')
    
    # Metadata
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'procurement_grns'
        ordering = ['-grn_date', '-created_at']
        indexes = [
            models.Index(fields=['grn_number']),
            models.Index(fields=['purchase_order', 'grn_date']),
            models.Index(fields=['supplier', 'status']),
        ]
    
    def __str__(self):
        return f"{self.grn_number} - {self.purchase_order.order_number}"
    
    def save(self, *args, **kwargs):
        if not self.grn_number:
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            last_grn = GoodsReceivedNote.objects.filter(
                grn_number__startswith=f'GRN-{date_str}'
            ).order_by('-grn_number').first()
            
            if last_grn:
                last_num = int(last_grn.grn_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.grn_number = f'GRN-{date_str}-{str(new_num).zfill(3)}'
        
        super().save(*args, **kwargs)


class GoodsReceivedNoteItem(models.Model):
    """
    GRN Line Items
    """
    CONDITION_CHOICES = [
        ('good', 'Good'),
        ('damaged', 'Damaged'),
        ('partial', 'Partial'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    grn = models.ForeignKey(
        GoodsReceivedNote,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    # Purchase order item reference
    purchase_order_item = models.ForeignKey(
        PurchaseOrderItem,
        on_delete=models.PROTECT,
        related_name='grn_items'
    )
    
    # Item details
    product = models.ForeignKey(
        ItemVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    item_code = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=500)
    
    # Quantities
    ordered_quantity = models.DecimalField(max_digits=10, decimal_places=3)
    received_quantity = models.DecimalField(max_digits=10, decimal_places=3)
    accepted_quantity = models.DecimalField(max_digits=10, decimal_places=3, default=Decimal('0.000'))
    rejected_quantity = models.DecimalField(max_digits=10, decimal_places=3, default=Decimal('0.000'))
    
    # Batch tracking
    batch_number = models.CharField(max_length=100, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    
    # Condition
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    
    # Pricing
    unit_price = models.DecimalField(max_digits=18, decimal_places=2)
    total = models.DecimalField(max_digits=18, decimal_places=2)
    
    # Metadata
    remarks = models.TextField(blank=True)
    
    class Meta:
        db_table = 'procurement_grn_items'
        ordering = ['id']
    
    def save(self, *args, **kwargs):
        self.total = self.received_quantity * self.unit_price
        super().save(*args, **kwargs)


# ============================================================================
# Purchase Invoice Models
# ============================================================================

class PurchaseInvoice(models.Model):
    """
    Purchase Invoice - Supplier invoice for received goods
    """
    STATUS_CHOICES = [
        ('pending_approval', 'Pending Approval'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
        ('partial_paid', 'Partially Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=50, unique=True, db_index=True)
    invoice_date = models.DateField(db_index=True)
    
    # References
    grn = models.ForeignKey(
        GoodsReceivedNote,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoices'
    )
    
    # Supplier
    supplier = models.ForeignKey(
        'suppliers.Supplier',
        on_delete=models.PROTECT,
        related_name='purchase_invoices'
    )
    
    # Financial
    subtotal = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    net_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    
    # Payment tracking
    paid_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    balance_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    due_date = models.DateField(null=True, blank=True)
    payment_terms = models.CharField(max_length=100, blank=True)
    
    # Status
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending_approval')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'purchase_invoices'
        ordering = ['-invoice_date', '-created_at']
        indexes = [
            models.Index(fields=['invoice_number']),
            models.Index(fields=['supplier', 'status']),
            models.Index(fields=['status', 'due_date']),
        ]
    
    def __str__(self):
        return f"{self.invoice_number} - {self.supplier.name}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            last_invoice = PurchaseInvoice.objects.filter(
                invoice_number__startswith=f'PI-{date_str}'
            ).order_by('-invoice_number').first()
            
            if last_invoice:
                last_num = int(last_invoice.invoice_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.invoice_number = f'PI-{date_str}-{str(new_num).zfill(3)}'
        
        # Calculate balance
        self.balance_amount = self.net_amount - self.paid_amount
        
        super().save(*args, **kwargs)


class PurchaseInvoiceItem(models.Model):
    """
    Purchase Invoice Line Items
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_invoice = models.ForeignKey(
        PurchaseInvoice,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    # Item details
    product = models.ForeignKey(
        ItemVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    item_code = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=500)
    
    # Quantities and pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    unit_price = models.DecimalField(max_digits=18, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=18, decimal_places=2)
    
    # GRN reference
    grn_item = models.ForeignKey(
        GoodsReceivedNoteItem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    class Meta:
        db_table = 'purchase_invoice_items'
        ordering = ['id']
    
    def save(self, *args, **kwargs):
        # Calculate line total
        subtotal = self.quantity * self.unit_price
        self.discount_amount = subtotal * (self.discount_percentage / 100)
        self.tax_amount = (subtotal - self.discount_amount) * (self.tax_percentage / 100)
        self.total = subtotal - self.discount_amount + self.tax_amount
        
        super().save(*args, **kwargs)


# ============================================================================
# Purchase Return Models
# ============================================================================

class PurchaseReturn(models.Model):
    """
    Purchase Return - Return of goods to supplier
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending_approval', 'Pending Approval'),
        ('approved', 'Approved'),
        ('returned', 'Returned'),
        ('credited', 'Credited'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    return_number = models.CharField(max_length=50, unique=True, db_index=True)
    return_date = models.DateField(db_index=True)
    
    # References
    grn = models.ForeignKey(
        GoodsReceivedNote,
        on_delete=models.PROTECT,
        related_name='purchase_returns'
    )
    
    # Supplier
    supplier = models.ForeignKey(
        'suppliers.Supplier',
        on_delete=models.PROTECT,
        related_name='purchase_returns'
    )
    
    # Financial
    subtotal = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    
    # Return details
    return_reason = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='draft')
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='created_purchase_returns')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'purchase_returns'
        ordering = ['-return_date', '-created_at']
        indexes = [
            models.Index(fields=['return_number']),
            models.Index(fields=['supplier', 'status']),
        ]
    
    def __str__(self):
        return f"{self.return_number} - {self.supplier.name}"
    
    def save(self, *args, **kwargs):
        if not self.return_number:
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            last_return = PurchaseReturn.objects.filter(
                return_number__startswith=f'PRTN-{date_str}'
            ).order_by('-return_number').first()
            
            if last_return:
                last_num = int(last_return.return_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.return_number = f'PRTN-{date_str}-{str(new_num).zfill(3)}'
        
        super().save(*args, **kwargs)


class PurchaseReturnItem(models.Model):
    """
    Purchase Return Line Items
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_return = models.ForeignKey(
        PurchaseReturn,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    # Item details
    product = models.ForeignKey(
        ItemVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    item_code = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=500)
    
    # Quantities and pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(Decimal('0.001'))])
    unit_price = models.DecimalField(max_digits=18, decimal_places=2)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=18, decimal_places=2)
    
    # GRN reference
    grn_item = models.ForeignKey(
        GoodsReceivedNoteItem,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    
    # Return reason
    return_reason = models.CharField(max_length=500, blank=True)
    
    class Meta:
        db_table = 'purchase_return_items'
        ordering = ['id']
    
    def save(self, *args, **kwargs):
        subtotal = self.quantity * self.unit_price
        self.tax_amount = subtotal * (self.tax_percentage / 100)
        self.total = subtotal + self.tax_amount
        
        super().save(*args, **kwargs)


# ============================================================================
# Purchase Requisition Models (4.1 - New BBP Implementation)
# ============================================================================

class PurchaseRequisition(models.Model):
    """
    Purchase Requisition - Internal request to procure goods/services
    Template: _txn_02 (Medium Transaction)
    """
    
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('APPROVED', 'Approved'),
        ('PARTIALLY_ORDERED', 'Partially Ordered'),
        ('FULLY_ORDERED', 'Fully Ordered'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
        ('CLOSED', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('NORMAL', 'Normal'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey('organization.Company', on_delete=models.PROTECT, related_name='purchase_requisitions')
    pr_number = models.CharField(max_length=30, unique=True, db_index=True)
    pr_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT', db_index=True)
    
    # Requesting info
    requested_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='requested_prs')
    requesting_location = models.ForeignKey('organization.Location', on_delete=models.PROTECT, related_name='purchase_requisitions')
    required_by_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='NORMAL')
    
    # Optional supplier hint
    supplier_hint = models.ForeignKey('suppliers.Supplier', on_delete=models.SET_NULL, null=True, blank=True, related_name='requisition_hints')
    
    # Additional info
    remarks = models.TextField(blank=True)
    
    # Approval workflow
    approval_required = models.BooleanField(default=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_prs')
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='rejected_prs')
    rejected_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # PO conversion tracking
    converted_to_po = models.BooleanField(default=False)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_prs')
    
    class Meta:
        db_table = 'purchase_requisition'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['company', 'pr_status']),
            models.Index(fields=['requesting_location', 'pr_status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['pr_number']),
        ]
    
    def __str__(self):
        return f"{self.pr_number} - {self.get_pr_status_display()}"
    
    def save(self, *args, **kwargs):
        if not self.pr_number:
            # Generate PR number: PR-YYYYMMDD-XXX
            from django.utils import timezone
            date_str = timezone.now().strftime('%Y%m%d')
            last_pr = PurchaseRequisition.objects.filter(
                pr_number__startswith=f'PR-{date_str}'
            ).order_by('-pr_number').first()
            
            if last_pr:
                last_num = int(last_pr.pr_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.pr_number = f'PR-{date_str}-{str(new_num).zfill(4)}'
        
        super().save(*args, **kwargs)


class PurchaseRequisitionLine(models.Model):
    """Purchase Requisition Line - Individual item request"""
    
    LINE_STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('PARTIALLY_ORDERED', 'Partially Ordered'),
        ('FULLY_ORDERED', 'Fully Ordered'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_requisition = models.ForeignKey(PurchaseRequisition, on_delete=models.CASCADE, related_name='lines')
    
    # Item reference
    item = models.ForeignKey(ItemVariant, on_delete=models.PROTECT, related_name='item_pr_lines')
    # item_variant = models.ForeignKey('products.ItemVariant', on_delete=models.PROTECT, related_name='variant_pr_lines', null=True, blank=True)
    
    # Quantity & UOM
    uom = models.ForeignKey('products.UOM', on_delete=models.PROTECT, related_name='uom_pr_lines')
    requested_qty = models.DecimalField(max_digits=15, decimal_places=3, validators=[MinValueValidator(Decimal('0.001'))])
    already_ordered_qty = models.DecimalField(max_digits=15, decimal_places=3, default=Decimal('0'))
    
    # Line-specific info
    required_by_date = models.DateField(null=True, blank=True)
    line_remarks = models.TextField(blank=True)
    line_status = models.CharField(max_length=20, choices=LINE_STATUS_CHOICES, default='OPEN')
    
    # Sequence
    line_number = models.IntegerField(default=1)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'purchase_requisition_line'
        ordering = ['purchase_requisition', 'line_number']
        indexes = [
            models.Index(fields=['purchase_requisition', 'line_status']),
            models.Index(fields=['item', 'line_status']),
        ]
    
    def __str__(self):
        return f"{self.purchase_requisition.pr_number} - Line {self.line_number}"
    
    @property
    def remaining_qty(self):
        """Calculate remaining quantity to be ordered"""
        return self.requested_qty - self.already_ordered_qty


class PurchaseRequisitionPOLink(models.Model):
    """Link between PR lines and PO lines - tracks fulfillment"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pr_line = models.ForeignKey(PurchaseRequisitionLine, on_delete=models.CASCADE, related_name='po_links')
    
    # These will reference PurchaseOrder models (to be enhanced in 4.2)
    purchase_order = models.UUIDField(help_text="Reference to Purchase Order ID")
    po_line = models.UUIDField(help_text="Reference to Purchase Order Line ID")
    
    ordered_qty_from_pr = models.DecimalField(max_digits=15, decimal_places=3, validators=[MinValueValidator(Decimal('0.001'))])
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'purchase_requisition_po_link'
        indexes = [
            models.Index(fields=['pr_line']),
            models.Index(fields=['purchase_order']),
        ]
    
    def __str__(self):
        return f"PR Line {self.pr_line_id} → PO {self.purchase_order}"
