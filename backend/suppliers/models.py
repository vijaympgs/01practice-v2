from django.db import models
from django.core.validators import MinLengthValidator, RegexValidator
from django.core.exceptions import ValidationError
import uuid
import re


class Supplier(models.Model):
    """
    Supplier model for the retail POS system.
    Represents suppliers who provide products to the store.
    """
    
    # Supplier Types
    SUPPLIER_TYPES = [
        ('manufacturer', 'Manufacturer'),
        ('distributor', 'Distributor'),
        ('wholesaler', 'Wholesaler'),
        ('retailer', 'Retailer'),
        ('dropshipper', 'Drop Shipper'),
        ('service_provider', 'Service Provider'),
    ]
    
    # Payment Terms
    PAYMENT_TERMS = [
        ('net_15', 'Net 15 Days'),
        ('net_30', 'Net 30 Days'),
        ('net_45', 'Net 45 Days'),
        ('net_60', 'Net 60 Days'),
        ('cod', 'Cash on Delivery'),
        ('prepaid', 'Prepaid'),
        ('credit_card', 'Credit Card'),
        ('custom', 'Custom Terms'),
    ]
    
    # Basic Information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    supplier_code = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique supplier code (auto-generated)"
    )
    
    # Company Information
    company_name = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(2)],
        help_text="Supplier company name"
    )
    trade_name = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Trade name or DBA (Doing Business As)"
    )
    supplier_type = models.CharField(
        max_length=20,
        choices=SUPPLIER_TYPES,
        default='distributor',
        help_text="Type of supplier"
    )
    
    # Contact Person Information
    contact_person = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Primary contact person name"
    )
    contact_title = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Contact person's title/position"
    )
    
    # Contact Information
    email = models.EmailField(
        blank=True,
        null=True,
        help_text="Primary email address"
    )
    phone = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        help_text="Primary phone number"
    )
    mobile = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Mobile number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        help_text="Mobile phone number"
    )
    website = models.URLField(
        blank=True,
        null=True,
        help_text="Company website URL"
    )
    
    # Address Information
    address_line_1 = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Street address line 1"
    )
    address_line_2 = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Street address line 2 (optional)"
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="City"
    )
    state = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="State/Province"
    )
    postal_code = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Postal/ZIP code"
    )
    country = models.CharField(
        max_length=100,
        default='United States',
        help_text="Country"
    )
    
    # Business Information
    tax_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Tax ID/EIN number"
    )
    
    # Financial Information
    payment_terms = models.CharField(
        max_length=20,
        choices=PAYMENT_TERMS,
        default='net_30',
        help_text="Default payment terms"
    )
    credit_limit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Credit limit with this supplier"
    )
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Default discount percentage from supplier"
    )
    
    # Status and Settings
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this supplier is active"
    )
    is_preferred = models.BooleanField(
        default=False,
        help_text="Preferred supplier status"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Supplier verification status"
    )
    
    # Performance Metrics
    lead_time_days = models.PositiveIntegerField(
        default=7,
        help_text="Average lead time in days"
    )
    minimum_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Minimum order amount"
    )
    
    # Notes
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the supplier"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_order_date = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Date of last purchase order"
    )
    
    class Meta:
        db_table = 'suppliers'
        ordering = ['company_name']
        verbose_name = 'Supplier'
        verbose_name_plural = 'Suppliers'
        indexes = [
            models.Index(fields=['supplier_code']),
            models.Index(fields=['company_name']),
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['supplier_type']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.company_name} ({self.supplier_code})"
    
    def save(self, *args, **kwargs):
        """Override save to auto-generate supplier code."""
        if not self.supplier_code:
            self.supplier_code = self.generate_supplier_code()
        super().save(*args, **kwargs)
    
    @property
    def display_name(self):
        """Return the best display name for the supplier."""
        if self.trade_name and self.trade_name != self.company_name:
            return f"{self.company_name} ({self.trade_name})"
        return self.company_name
    
    @property
    def full_address(self):
        """Return the complete formatted address."""
        address_parts = []
        
        if self.address_line_1:
            address_parts.append(self.address_line_1)
        if self.address_line_2:
            address_parts.append(self.address_line_2)
        
        city_state_zip = []
        if self.city:
            city_state_zip.append(self.city)
        if self.state:
            city_state_zip.append(self.state)
        if self.postal_code:
            city_state_zip.append(self.postal_code)
        
        if city_state_zip:
            address_parts.append(', '.join(city_state_zip))
        
        if self.country and self.country != 'United States':
            address_parts.append(self.country)
        
        return '\n'.join(address_parts) if address_parts else ''
    
    @classmethod
    def generate_supplier_code(cls):
        """Generate a unique supplier code."""
        import random
        import string
        
        while True:
            # Generate code in format: SUPP-XXXXXX
            code = 'SUPP-' + ''.join(random.choices(string.digits, k=6))
            if not cls.objects.filter(supplier_code=code).exists():
                return code
    
    def get_total_orders(self):
        """Get total order amount for this supplier."""
        # This will be implemented when Purchase Orders module is ready
        return 0.00
    
    def get_order_count(self):
        """Get total number of orders for this supplier."""
        # This will be implemented when Purchase Orders module is ready
        return 0
    
    def get_supplier_status(self):
        """Get supplier status based on activity and preferences."""
        if not self.is_active:
            return 'inactive'
        elif self.is_preferred:
            return 'preferred'
        elif not self.is_verified:
            return 'unverified'
        elif self.get_order_count() == 0:
            return 'new'
        return 'active'
    
    def get_display_supplier_type(self):
        """Get formatted supplier type for display."""
        return dict(self.SUPPLIER_TYPES).get(self.supplier_type, self.supplier_type)
    
    def get_display_payment_terms(self):
        """Get formatted payment terms for display."""
        return dict(self.PAYMENT_TERMS).get(self.payment_terms, self.payment_terms)