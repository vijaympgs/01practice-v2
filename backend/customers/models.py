from django.db import models
from django.core.validators import MinLengthValidator, RegexValidator
from django.core.exceptions import ValidationError
import uuid
import re


class Customer(models.Model):
    """
    Customer model for the retail POS system.
    Represents customers who make purchases in the store.
    """
    
    # Customer Types
    CUSTOMER_TYPES = [
        ('individual', 'Individual'),
        ('business', 'Business'),
        ('wholesale', 'Wholesale'),
        ('vip', 'VIP'),
    ]
    
    # Basic Information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_code = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique customer code (auto-generated)"
    )
    
    # Personal Information
    first_name = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2)],
        help_text="Customer's first name"
    )
    last_name = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2)],
        help_text="Customer's last name"
    )
    company_name = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Company name (for business customers)"
    )
    customer_type = models.CharField(
        max_length=20,
        choices=CUSTOMER_TYPES,
        default='individual',
        help_text="Type of customer"
    )
    
    # Contact Information
    email = models.EmailField(
        blank=True,
        null=True,
        help_text="Customer's email address"
    )
    phone = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        help_text="Customer's phone number"
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
        help_text="Customer's mobile number"
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
        help_text="Tax ID/SSN (for business customers)"
    )
    credit_limit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Credit limit for the customer"
    )
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Default discount percentage"
    )
    
    # Status and Settings
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this customer is active"
    )
    is_vip = models.BooleanField(
        default=False,
        help_text="VIP customer status"
    )
    allow_credit = models.BooleanField(
        default=False,
        help_text="Allow credit purchases"
    )
    
    # Notes and Additional Info
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the customer"
    )
    date_of_birth = models.DateField(
        blank=True,
        null=True,
        help_text="Customer's date of birth"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_purchase_date = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Date of last purchase"
    )
    
    class Meta:
        db_table = 'customers'
        ordering = ['last_name', 'first_name']
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'
        indexes = [
            models.Index(fields=['customer_code']),
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['customer_type']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        if self.company_name:
            return f"{self.company_name} ({self.customer_code})"
        return f"{self.full_name} ({self.customer_code})"
    
    def save(self, *args, **kwargs):
        """Override save to auto-generate customer code."""
        if not self.customer_code:
            self.customer_code = self.generate_customer_code()
        super().save(*args, **kwargs)
    
    def clean(self):
        """Custom validation for the Customer model."""
        super().clean()
        
        # Validate email format if provided
        if self.email:
            email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_regex, self.email):
                raise ValidationError({
                    'email': 'Enter a valid email address.'
                })
        
        # Validate business customers have company name
        if self.customer_type == 'business' and not self.company_name:
            raise ValidationError({
                'company_name': 'Company name is required for business customers.'
            })
        
        # Validate credit limit is not negative
        if self.credit_limit < 0:
            raise ValidationError({
                'credit_limit': 'Credit limit cannot be negative.'
            })
        
        # Validate discount percentage is between 0 and 100
        if self.discount_percentage < 0 or self.discount_percentage > 100:
            raise ValidationError({
                'discount_percentage': 'Discount percentage must be between 0 and 100.'
            })
    
    @property
    def full_name(self):
        """Return the customer's full name."""
        return f"{self.first_name} {self.last_name}".strip()
    
    @property
    def display_name(self):
        """Return the best display name for the customer."""
        if self.company_name:
            return f"{self.company_name} ({self.full_name})"
        return self.full_name
    
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
    def generate_customer_code(cls):
        """Generate a unique customer code."""
        import random
        import string
        
        while True:
            # Generate code in format: CUST-XXXXXX
            code = 'CUST-' + ''.join(random.choices(string.digits, k=6))
            if not cls.objects.filter(customer_code=code).exists():
                return code
    
    def get_total_purchases(self):
        """Get total purchase amount for this customer."""
        # This will be implemented when Sales module is ready
        return 0.00
    
    def get_purchase_count(self):
        """Get total number of purchases for this customer."""
        # This will be implemented when Sales module is ready
        return 0
    
    def get_average_purchase_amount(self):
        """Get average purchase amount for this customer."""
        count = self.get_purchase_count()
        if count > 0:
            return self.get_total_purchases() / count
        return 0.00
    
    def get_last_purchase_date(self):
        """Get the date of the last purchase."""
        return self.last_purchase_date
    
    def is_new_customer(self):
        """Check if this is a new customer (no purchases yet)."""
        return self.get_purchase_count() == 0
    
    def get_customer_status(self):
        """Get customer status based on activity."""
        if not self.is_active:
            return 'inactive'
        elif self.is_vip:
            return 'vip'
        elif self.is_new_customer():
            return 'new'
        elif self.last_purchase_date:
            from datetime import datetime, timedelta
            if self.last_purchase_date < datetime.now().date() - timedelta(days=365):
                return 'inactive_long'
            elif self.last_purchase_date < datetime.now().date() - timedelta(days=90):
                return 'inactive_recent'
        return 'active'
    
    def can_make_credit_purchase(self, amount):
        """Check if customer can make a credit purchase of given amount."""
        if not self.allow_credit:
            return False
        
        # This will be enhanced when we implement credit tracking
        return amount <= self.credit_limit
    
    def get_available_credit(self):
        """Get available credit amount."""
        if not self.allow_credit:
            return 0.00
        
        # This will be enhanced when we implement credit tracking
        return self.credit_limit
    
    def get_display_customer_type(self):
        """Get formatted customer type for display."""
        return dict(self.CUSTOMER_TYPES).get(self.customer_type, self.customer_type)