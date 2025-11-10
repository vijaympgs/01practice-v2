from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal
import uuid
from datetime import datetime, date, timedelta
from pos_masters.models import SettlementReason

User = get_user_model()


class Sale(models.Model):
    """
    Main sales transaction model supporting multiple sale types.
    Represents a complete transaction with items, payments, and customer details.
    """
    
    SALE_TYPES = [
        ('cash', 'Cash Sale'),
        ('credit', 'Credit Sale'),
        ('voucher', 'Gift Voucher Sale'),
        ('layaway', 'Layaway Sale'),
        ('service', 'Miscellaneous/Service Sale'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),                      # Suspended/Not completed
        ('completed', 'Completed'),              # Finalized
        ('cancelled', 'Cancelled'),              # Voided
        ('refunded', 'Refunded'),                # Full refund
        ('partial_refund', 'Partially Refunded'),
    ]
    
    DELIVERY_TYPES = [
        ('immediate', 'Immediate'),
        ('home_delivery', 'Home Delivery'),
    ]
    
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sale_number = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Auto-generated: SALE-YYYYMMDD-XXXX"
    )
    sale_type = models.CharField(
        max_length=20,
        choices=SALE_TYPES,
        default='cash'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    
    # Relationships
    customer = models.ForeignKey(
        'customers.Customer',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sales'
    )
    cashier = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='sales_cashier'
    )
    pos_session = models.ForeignKey(
        'sales.POSSession',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sales',
        help_text="POS session during which this sale was made"
    )
    location = models.ForeignKey(
        'organization.Location',
        on_delete=models.PROTECT,
        related_name='sales',
        help_text="Store location where sale was made"
    )
    terminal = models.ForeignKey(
        'pos_masters.Terminal',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sales',
        help_text="Terminal/Till where sale was made"
    )
    
    # Financial Fields
    subtotal = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    
    # Delivery
    delivery_type = models.CharField(max_length=20, choices=DELIVERY_TYPES, default='immediate')
    delivery_address = models.TextField(blank=True)
    
    # Metadata
    sale_date = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sales_created')
    
    class Meta:
        db_table = 'sales'
        ordering = ['-sale_date']
        indexes = [
            models.Index(fields=['sale_date']),
            models.Index(fields=['status', 'sale_date']),
            models.Index(fields=['location', 'sale_date']),
        ]
    
    def __str__(self):
        return f"{self.sale_number} - {self.total_amount}"
    
    def save(self, *args, **kwargs):
        if not self.sale_number:
            self.sale_number = self.generate_sale_number()
        super().save(*args, **kwargs)
    
    @classmethod
    def generate_sale_number(cls, day_open=None):
        """Generate unique sale number from Day Open sequence or fallback."""
        from django.utils import timezone
        
        # Try to get from Day Open if provided or find active one
        if not day_open and hasattr(cls, 'location'):
            try:
                # This will be set during creation via serializer
                day_open = getattr(cls, '_day_open_for_sequence', None)
            except:
                pass
        
        if day_open:
            # Use Day Open's next_sale_number sequence
            sale_number = day_open.next_sale_number
            
            # Extract and increment the number
            parts = sale_number.split('-')
            if len(parts) == 3:
                try:
                    current_num = int(parts[-1])
                    new_num = current_num + 1
                    # Update Day Open's next sequence
                    day_open.next_sale_number = f'{parts[0]}-{parts[1]}-{new_num:04d}'
                    day_open.save(update_fields=['next_sale_number'])
                except ValueError:
                    # Fallback if parsing fails
                    pass
            
            return sale_number
        
        # Fallback: Generate based on today's date
        today = date.today()
        date_str = today.strftime('%Y%m%d')
        prefix = f'SALE-{date_str}-'
        
        last_sale = cls.objects.filter(
            sale_number__startswith=prefix
        ).order_by('-sale_number').first()
        
        if last_sale:
            last_num = int(last_sale.sale_number.split('-')[-1])
            new_num = last_num + 1
        else:
            new_num = 1
        
        return f'{prefix}{new_num:04d}'


class SaleItem(models.Model):
    """Items in a sale transaction."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT, related_name='sale_items')
    
    quantity = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(Decimal('0.001'))])
    unit_price = models.DecimalField(max_digits=18, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    line_total = models.DecimalField(max_digits=18, decimal_places=2)
    
    class Meta:
        db_table = 'sale_items'
    
    def __str__(self):
        return f"{self.sale.sale_number} - {self.product.name} x{self.quantity}"


class Payment(models.Model):
    """Payment records for a sale."""
    
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('wallet', 'Wallet'),
        ('cheque', 'Cheque'),
        ('credit', 'Credit'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    payment_date = models.DateTimeField(auto_now_add=True)
    reference_number = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'payments'


class POSSession(models.Model):
    """POS cashier session management."""
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]
    
    SETTLEMENT_STATUS_CHOICES = [
        ('pending', 'Settlement Pending'),
        ('completed', 'Settlement Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_number = models.CharField(max_length=50, unique=True, db_index=True)
    cashier = models.ForeignKey(User, on_delete=models.PROTECT, related_name='pos_sessions')
    terminal = models.ForeignKey(
        'pos_masters.Terminal',
        on_delete=models.PROTECT,
        related_name='pos_sessions',
        null=True,
        blank=True,
        help_text="Terminal/Till where this session is opened"
    )
    location = models.ForeignKey(
        'organization.Location',
        on_delete=models.PROTECT,
        related_name='pos_sessions',
        null=True,
        blank=True,
        help_text="Location where this session is opened"
    )
    
    opening_cash = models.DecimalField(max_digits=10, decimal_places=2)
    closing_cash = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    expected_cash = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cash_difference = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    opened_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    close_mode = models.CharField(
        max_length=20,
        choices=[('temporary', 'Temporary'), ('permanent', 'Permanent')],
        null=True,
        blank=True,
        help_text="Mode of closing: temporary (can reopen) or permanent (final close)"
    )
    settlement_status = models.CharField(
        max_length=20, 
        choices=SETTLEMENT_STATUS_CHOICES, 
        default='pending',
        help_text="Settlement completion status for deferred settlement flow"
    )
    
    total_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    base_expected_cash = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Baseline expected cash before interim settlements"
    )
    total_counted_cash = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total counted cash including interim settlements"
    )
    interim_settlements = models.JSONField(
        default=list,
        blank=True,
        help_text="Snapshots of interim settlements captured during the session"
    )
    variance_reason = models.ForeignKey(
        SettlementReason,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pos_sessions',
        help_text="Variance reason selected during final settlement"
    )
    
    class Meta:
        db_table = 'pos_sessions'
        ordering = ['-opened_at']
    
    def __str__(self):
        return f"{self.session_number} - {self.cashier.username}"
    
    def save(self, *args, **kwargs):
        if not self.session_number:
            self.session_number = self.generate_session_number()
        super().save(*args, **kwargs)
    
    @classmethod
    def generate_session_number(cls, day_open=None):
        """Generate unique session number from Day Open sequence or fallback."""
        # Try to get from Day Open if provided
        if not day_open:
            try:
                day_open = getattr(cls, '_day_open_for_sequence', None)
            except:
                pass
        
        if day_open:
            # Use Day Open's next_session_number sequence
            session_number = day_open.next_session_number
            
            # Extract and increment the number
            parts = session_number.split('-')
            if len(parts) == 3:
                try:
                    current_num = int(parts[-1])
                    new_num = current_num + 1
                    # Update Day Open's next sequence
                    day_open.next_session_number = f'{parts[0]}-{parts[1]}-{new_num:04d}'
                    day_open.save(update_fields=['next_session_number'])
                except ValueError:
                    # Fallback if parsing fails
                    pass
            
            return session_number
        
        # Fallback: Generate based on today's date
        today = date.today()
        date_str = today.strftime('%Y%m%d')
        prefix = f'SES-{date_str}-'
        
        last_session = cls.objects.filter(
            session_number__startswith=prefix
        ).order_by('-session_number').first()
        
        if last_session:
            last_num = int(last_session.session_number.split('-')[-1])
            new_num = last_num + 1
        else:
            new_num = 1
        
        return f'{prefix}{new_num:04d}'


class DayOpen(models.Model):
    """
    Day Open model - Store level day start process
    Establishes business date and resets document sequences
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    location = models.ForeignKey(
        'organization.Location',
        on_delete=models.PROTECT,
        related_name='day_opens',
        limit_choices_to={'location_type': 'store'},
        help_text="Store location for this day open"
    )
    business_date = models.DateField(
        db_index=True,
        help_text="Business date (sale date) being opened"
    )
    
    # Day open process details
    opened_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='day_opens_initiated',
        help_text="User who opened the business day"
    )
    opened_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    closed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='day_opens_closed',
        help_text="User who closed the day open"
    )
    
    # Document sequences for the day
    next_sale_number = models.CharField(
        max_length=50,
        default='SALE-YYYYMMDD-0001',
        help_text="Next sale number sequence for this business date"
    )
    next_session_number = models.CharField(
        max_length=50,
        default='SES-YYYYMMDD-0001',
        help_text="Next session number sequence for this business date"
    )
    
    # Status
    is_active = models.BooleanField(default=True, help_text="Is this day open still active?")
    notes = models.TextField(blank=True, help_text="Additional notes about the day open")
    
    class Meta:
        db_table = 'day_opens'
        ordering = ['-business_date', '-opened_at']
        unique_together = [['location', 'business_date']]
        indexes = [
            models.Index(fields=['location', 'business_date']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"Day Open - {self.location.name} - {self.business_date} ({'Active' if self.is_active else 'Closed'})"
    
    def close_day_open(self):
        """Close the day open (mark as inactive)"""
        self.is_active = False
        self.closed_at = timezone.now()
        self.save()


class DayClose(models.Model):
    """
    Day Close model - Store level day end process
    Tracks day closure for each location (store) and business date
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('reverted', 'Reverted'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    location = models.ForeignKey(
        'organization.Location',
        on_delete=models.PROTECT,
        related_name='day_closes',
        limit_choices_to={'location_type': 'store'},
        help_text="Store location for this day close"
    )
    business_date = models.DateField(
        db_index=True,
        help_text="Business date (sale date) that is being closed"
    )
    
    # Close process details
    initiated_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='day_closes_initiated',
        help_text="User who initiated the day close"
    )
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    reverted_at = models.DateTimeField(null=True, blank=True)
    reverted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='day_closes_reverted',
        help_text="User who reverted the day close"
    )
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Checklist items (all must be true for day close)
    checklist_items = models.JSONField(
        default=dict,
        help_text="JSON object tracking completion of checklist items"
    )
    
    # Consolidated data (snapshot at time of close)
    total_transactions = models.IntegerField(default=0, help_text="Total number of transactions for the day")
    total_sales_amount = models.DecimalField(
        max_digits=18, 
        decimal_places=2, 
        default=Decimal('0.00'),
        help_text="Total sales amount for the day"
    )
    total_sessions = models.IntegerField(default=0, help_text="Number of sessions closed")
    total_items_sold = models.IntegerField(default=0, help_text="Total items sold")
    
    # Document number sequences reset
    next_sale_number = models.CharField(
        max_length=50,
        default='SALE-YYYYMMDD-0001',
        help_text="Next sale number sequence for next business date"
    )
    next_session_number = models.CharField(
        max_length=50,
        default='SES-YYYYMMDD-0001',
        help_text="Next session number sequence for next business date"
    )
    
    # Notes and errors
    notes = models.TextField(blank=True, help_text="Additional notes about the day close")
    errors = models.JSONField(default=list, help_text="Any errors encountered during day close")
    warnings = models.JSONField(default=list, help_text="Warnings during day close")
    
    class Meta:
        db_table = 'day_closes'
        ordering = ['-business_date', '-initiated_at']
        unique_together = [['location', 'business_date']]
        indexes = [
            models.Index(fields=['location', 'business_date']),
            models.Index(fields=['status', 'business_date']),
        ]
    
    def __str__(self):
        return f"Day Close - {self.location.name} - {self.business_date} ({self.status})"
    
    def can_be_reverted(self):
        """
        Check if day close can be reverted
        Condition: No transactions exist for the current sale date (today)
        """
        today = timezone.now().date()
        
        # If business_date is not today, check if today has transactions
        if self.business_date != today:
            # Check for any sales on today's date
            from sales.models import Sale
            today_sales = Sale.objects.filter(
                location=self.location,
                sale_date__date=today,
                status__in=['completed', 'draft']
            ).exists()
            
            return not today_sales
        
        return True
    
    def complete_day_close(self):
        """
        Complete the day close process:
        1. Verify all checklist items are complete
        2. Consolidate all sales for the business date
        3. Update document number sequences for next business date
        4. Mark status as completed
        """
        # Verify checklist
        required_checks = [
            'all_sessions_closed',
            'all_settlements_completed',  # Critical: all "Settle Later" items must be settled
            'reports_generated',
            'backup_completed',
            'cash_counted',
            'inventory_verified',
        ]
        
        checklist = self.checklist_items or {}
        missing_checks = [check for check in required_checks if not checklist.get(check, False)]
        
        if missing_checks:
            raise ValidationError(f"Missing checklist items: {', '.join(missing_checks)}")
        
        # Additional validation: Check if any sessions have pending settlements
        pending_settlements = POSSession.objects.filter(
            cashier__pos_location=self.location,
            opened_at__date=self.business_date,
            settlement_status='pending'
        ).exists()
        
        if pending_settlements:
            raise ValidationError(
                "Cannot complete day close: Some sessions have pending settlements marked 'Later'. "
                "Please complete all deferred settlements before closing the day."
            )
        
        # Consolidate sales data
        from sales.models import Sale, POSSession
        
        sales = Sale.objects.filter(
            location=self.location,
            sale_date__date=self.business_date,
            status='completed'
        )
        
        sessions = POSSession.objects.filter(
            cashier__pos_location=self.location,
            opened_at__date=self.business_date,
            status='closed'
        )
        
        self.total_transactions = sales.count()
        self.total_sales_amount = sum(sale.total_amount for sale in sales)
        self.total_sessions = sessions.count()
        self.total_items_sold = sum(
            sale.items.count() for sale in sales
        )
        
        # Calculate next business date (next day)
        next_date = self.business_date + timedelta(days=1)
        next_date_str = next_date.strftime('%Y%m%d')
        
        # Reset document number sequences for next business date
        self.next_sale_number = f'SALE-{next_date_str}-0001'
        self.next_session_number = f'SES-{next_date_str}-0001'
        
        # Mark as completed
        self.status = 'completed'
        self.completed_at = timezone.now()
        
        self.save()
        
        return {
            'total_transactions': self.total_transactions,
            'total_sales_amount': float(self.total_sales_amount),
            'total_sessions': self.total_sessions,
            'next_sale_number': self.next_sale_number,
            'next_session_number': self.next_session_number,
        }
