from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.utils import timezone
import uuid

User = get_user_model()

class POSMaster(models.Model):
    """
    POS-specific master data codes
    """
    
    MASTER_TYPES = [
        ('bank', 'Bank'),
        ('payment_method', 'Payment Method'),
        ('currency', 'Currency'),
        ('tax_type', 'Tax Type'),
        ('discount_type', 'Discount Type'),
        ('loyalty_type', 'Loyalty Type'),
        ('customer_type', 'Customer Type'),
        ('supplier_type', 'Supplier Type'),
        ('product_category', 'Product Category'),
        ('unit_of_measure', 'Unit of Measure'),
        ('warehouse', 'Warehouse'),
        ('counter', 'Counter'),
        ('shift', 'Shift'),
        ('reason_code', 'Reason Code'),
        ('sale_type', 'Sale Type'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Under Maintenance'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, help_text="Master data name")
    code = models.CharField(max_length=20, help_text="Short code for master data")
    master_type = models.CharField(max_length=20, choices=MASTER_TYPES, help_text="Type of master data")
    description = models.TextField(blank=True, null=True, help_text="Description of master data")
    
    # Configuration
    is_active = models.BooleanField(default=True, help_text="Whether this master data is active")
    is_system_generated = models.BooleanField(default=False, help_text="System generated vs user created")
    requires_authorization = models.BooleanField(default=False, help_text="Requires manager authorization")
    
    # Display settings
    display_order = models.PositiveIntegerField(default=0, help_text="Order for display in POS")
    icon_name = models.CharField(max_length=50, blank=True, null=True, help_text="Icon name for UI")
    color_code = models.CharField(max_length=7, default='#2196F3', help_text="Color code for UI (hex)")
    
    # Additional settings
    allow_edit = models.BooleanField(default=True, help_text="Allow editing of this master data")
    allow_delete = models.BooleanField(default=True, help_text="Allow deletion of this master data")
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='pos_masters_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='pos_masters_updated')
    
    class Meta:
        db_table = 'pos_masters'
        verbose_name = 'POS Master'
        verbose_name_plural = 'POS Masters'
        ordering = ['master_type', 'display_order', 'name']
        unique_together = ['code', 'master_type']
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    def can_be_deleted(self):
        """Check if this master data can be deleted"""
        return self.allow_delete and not self.is_system_generated


class POSMasterSettings(models.Model):
    """
    Global settings for POS Masters
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # General settings
    enable_auto_code_generation = models.BooleanField(default=True, help_text="Enable automatic code generation")
    code_prefix_length = models.PositiveIntegerField(default=3, help_text="Length of code prefix")
    allow_duplicate_names = models.BooleanField(default=False, help_text="Allow duplicate names across types")
    
    # Display settings
    default_display_order = models.PositiveIntegerField(default=0, help_text="Default display order for new items")
    show_inactive_items = models.BooleanField(default=False, help_text="Show inactive items in POS")
    
    # Validation settings
    require_description = models.BooleanField(default=False, help_text="Require description for all master data")
    validate_code_format = models.BooleanField(default=True, help_text="Validate code format")
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='pos_master_settings_updated')
    
    class Meta:
        db_table = 'pos_master_settings'
        verbose_name = 'POS Master Settings'
        verbose_name_plural = 'POS Master Settings'
    
    def __str__(self):
        return f"POS Master Settings - {self.updated_at}"


class POSMasterHistory(models.Model):
    """
    Track changes to POS Masters
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pos_master = models.ForeignKey(POSMaster, on_delete=models.CASCADE, related_name='history')
    field_name = models.CharField(max_length=50, help_text="Field that was changed")
    old_value = models.TextField(help_text="Previous value")
    new_value = models.TextField(help_text="New value")
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(blank=True, null=True, help_text="Reason for change")
    
    class Meta:
        db_table = 'pos_master_history'
        verbose_name = 'POS Master History'
        verbose_name_plural = 'POS Master History'
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.pos_master.name} - {self.field_name} - {self.changed_at}"


class POSMasterMapping(models.Model):
    """
    Mapping between POS Masters and other entities
    """
    
    MAPPING_TYPES = [
        ('geographical', 'Geographical Data'),
        ('business_rule', 'Business Rule'),
        ('pay_mode', 'Pay Mode'),
        ('user_role', 'User Role'),
        ('terminal', 'Terminal'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pos_master = models.ForeignKey(POSMaster, on_delete=models.CASCADE, related_name='mappings')
    mapping_type = models.CharField(max_length=20, choices=MAPPING_TYPES)
    mapped_entity_id = models.CharField(max_length=100, help_text="ID of the mapped entity")
    mapped_entity_name = models.CharField(max_length=200, help_text="Name of the mapped entity")
    is_active = models.BooleanField(default=True)
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='pos_master_mappings_created')
    
    class Meta:
        db_table = 'pos_master_mappings'
        verbose_name = 'POS Master Mapping'
        verbose_name_plural = 'POS Master Mappings'
        unique_together = ['pos_master', 'mapping_type', 'mapped_entity_id']
    
    def __str__(self):
        return f"{self.pos_master.name} -> {self.mapped_entity_name}"


class CurrencyDenomination(models.Model):
    """
    Currency Denominations Master for Counter Settlement
    Stores denominations (notes/coins) for each currency
    """
    
    DENOMINATION_TYPES = [
        ('note', 'Note'),
        ('coin', 'Coin'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Link to Currency (from POSMaster with master_type='currency')
    currency = models.ForeignKey(
        POSMaster, 
        on_delete=models.CASCADE, 
        related_name='denominations',
        limit_choices_to={'master_type': 'currency'}
    )
    
    # Denomination details
    denomination_type = models.CharField(max_length=10, choices=DENOMINATION_TYPES, help_text="Note or Coin")
    value = models.DecimalField(max_digits=18, decimal_places=2, help_text="Denomination value")
    display_name = models.CharField(max_length=100, help_text="Display name (e.g., '$100', '₹500')")
    
    # Display settings
    display_order = models.PositiveIntegerField(default=0, help_text="Order for display")
    is_active = models.BooleanField(default=True, help_text="Whether this denomination is active")
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='currency_denominations_created')
    
    class Meta:
        db_table = 'currency_denominations'
        verbose_name = 'Currency Denomination'
        verbose_name_plural = 'Currency Denominations'
        ordering = ['currency', '-value']  # Sort by value descending
        unique_together = ['currency', 'value', 'denomination_type']
    
    def __str__(self):
        return f"{self.display_name} ({self.currency.code})"


class Terminal(models.Model):
    """
    POS Terminal Configuration Model
    Stores configuration for each POS terminal/register
    """
    
    TERMINAL_TYPE_CHOICES = [
        ('till', 'Till'),
        ('counter', 'Counter'),
        ('kiosk', 'Kiosk'),
        ('mobile', 'Mobile'),
    ]
    
    NETWORK_TYPE_CHOICES = [
        ('ethernet', 'Ethernet'),
        ('wifi', 'WiFi'),
        ('cellular', 'Cellular'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Under Maintenance'),
        ('error', 'Error'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic Information
    name = models.CharField(max_length=100, help_text="Terminal name")
    terminal_code = models.CharField(max_length=20, unique=True, help_text="Unique terminal code")
    terminal_type = models.CharField(max_length=20, choices=TERMINAL_TYPE_CHOICES, default='till')
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    # Location & Company (using organization models)
    company = models.ForeignKey('organization.Company', on_delete=models.CASCADE, related_name='terminals', null=True, blank=True)
    location = models.ForeignKey('organization.Location', on_delete=models.CASCADE, related_name='terminals', null=True, blank=True)
    floor_location = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    
    # System Configuration (NEW FIELDS)
    system_name = models.CharField(
        max_length=100, 
        blank=True,
        help_text="System hostname (auto-generated from hostname, not editable by user)"
    )
    auto_login_pos = models.BooleanField(
        default=False,
        help_text="Enable automatic login to POS system"
    )
    
    # Contact Information
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    operating_hours = models.CharField(max_length=200, blank=True, null=True)
    installation_date = models.DateField(blank=True, null=True)
    
    # Network Configuration
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    mac_address = models.CharField(max_length=17, blank=True, null=True, help_text="Format: XX:XX:XX:XX:XX:XX")
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    network_type = models.CharField(max_length=20, choices=NETWORK_TYPE_CHOICES, default='ethernet')
    wifi_ssid = models.CharField(max_length=100, blank=True, null=True)
    wifi_password = models.CharField(max_length=100, blank=True, null=True)
    
    # Hardware Configuration (stored as JSON for flexibility)
    hardware_config = models.JSONField(default=dict, blank=True, help_text="Printer, scanner, display, cash drawer settings")
    
    # Regional Settings
    currency = models.CharField(max_length=3, default='INR')
    language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='Asia/Kolkata')
    date_format = models.CharField(max_length=20, default='DD/MM/YYYY')
    time_format = models.CharField(max_length=10, default='24', help_text="12 or 24")
    
    # Business Rules
    allow_discounts = models.BooleanField(default=True)
    allow_refunds = models.BooleanField(default=True)
    require_customer_info = models.BooleanField(default=False)
    max_transaction_amount = models.DecimalField(max_digits=18, decimal_places=2, default=100000)
    min_transaction_amount = models.DecimalField(max_digits=18, decimal_places=2, default=1)
    max_discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50)
    require_manager_approval = models.BooleanField(default=False)
    
    # Operational Settings
    auto_receipt = models.BooleanField(default=True)
    auto_print = models.BooleanField(default=True)
    enable_loyalty = models.BooleanField(default=False)
    enable_offline_mode = models.BooleanField(default=True)
    sync_interval = models.PositiveIntegerField(default=300, help_text="Seconds")
    session_timeout = models.PositiveIntegerField(default=900, help_text="Seconds")
    
    # Tax Configuration
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18)
    tax_inclusive = models.BooleanField(default=False)
    enable_tax_calculation = models.BooleanField(default=True)
    
    # Backup Settings
    auto_backup = models.BooleanField(default=True)
    backup_interval = models.PositiveIntegerField(default=3600, help_text="Seconds")
    backup_retention = models.PositiveIntegerField(default=30, help_text="Days")
    
    # Security Settings
    require_pin = models.BooleanField(default=False)
    audit_log_enabled = models.BooleanField(default=True)
    enable_biometric = models.BooleanField(default=False)
    max_login_attempts = models.PositiveIntegerField(default=3)
    lockout_duration = models.PositiveIntegerField(default=900, help_text="Seconds")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    last_sync = models.DateTimeField(blank=True, null=True)
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='terminals_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='terminals_updated')
    
    class Meta:
        db_table = 'pos_terminals'
        verbose_name = 'Terminal'
        verbose_name_plural = 'Terminals'
        ordering = ['terminal_code', 'name']
        indexes = [
            models.Index(fields=['terminal_code']),
            models.Index(fields=['company', 'location']),
            models.Index(fields=['status', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.terminal_code})"
    
    def get_hardware_config(self, device_type):
        """Get hardware configuration for a specific device type"""
        return self.hardware_config.get(device_type, {})
    
    def update_last_sync(self):
        """Update last sync timestamp"""
        from django.utils import timezone
        self.last_sync = timezone.now()
        self.save(update_fields=['last_sync'])
    
    def save(self, *args, **kwargs):
        """Override save to auto-populate system_name from hostname if empty"""
        import socket
        # Only auto-populate if system_name is not set (blank or None)
        # This allows manual setting of system_name (e.g., from client hostname)
        if not self.system_name or self.system_name.strip() == '':
            try:
                # Get server hostname as fallback
                self.system_name = socket.gethostname()
            except:
                self.system_name = 'localhost'
        super().save(*args, **kwargs)


class PrinterTemplate(models.Model):
    """
    Printer Template Model
    Stores printer template definitions for various transaction types
    """
    
    TEMPLATE_TYPES = [
        ('estimation', 'Estimation'),
        ('gift_voucher', 'Gift Voucher'),
        ('receipt', 'Receipt'),
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('sales_order', 'Sales Order'),
        ('sales_return_request', 'Sales Return Request'),
        ('inter_company_sales', 'Inter Company Sales'),
        ('default', 'Default'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, help_text="Template name (e.g., 'Default Estimation Print Template')")
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES, default='default')
    template_content = models.TextField(blank=True, help_text="Template structure/content (JSON or formatted text)")
    is_default = models.BooleanField(default=False, help_text="Is this the default template for this type?")
    is_active = models.BooleanField(default=True)
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='printer_templates_created')
    
    class Meta:
        db_table = 'printer_templates'
        verbose_name = 'Printer Template'
        verbose_name_plural = 'Printer Templates'
        ordering = ['template_type', 'name']
        indexes = [
            models.Index(fields=['template_type', 'is_default']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"


class TerminalTransactionSetting(models.Model):
    """
    Terminal Transaction Settings Model
    Defines which transaction types are allowed for a terminal and their printer templates
    """
    
    TRANSACTION_TYPES = [
        ('estimation', 'Estimation'),
        ('gift_voucher', 'Gift Voucher'),
        ('inter_company_sales', 'Inter Company Sales'),
        ('payment', 'Payment'),
        ('receipt', 'Receipt'),
        ('refund', 'Refund'),
        ('sales_order', 'Sales Order'),
        ('sales_return_request', 'Sales Return Request'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, related_name='transaction_settings')
    transaction_type = models.CharField(max_length=50, choices=TRANSACTION_TYPES)
    allow = models.BooleanField(default=False, help_text="Allow this transaction type on this terminal")
    printer_template = models.ForeignKey(
        PrinterTemplate, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Printer template to use for this transaction type"
    )
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='transaction_settings_created')
    
    class Meta:
        db_table = 'terminal_transaction_settings'
        verbose_name = 'Terminal Transaction Setting'
        verbose_name_plural = 'Terminal Transaction Settings'
        unique_together = [['terminal', 'transaction_type']]
        indexes = [
            models.Index(fields=['terminal', 'transaction_type']),
        ]
    
    def __str__(self):
        return f"{self.terminal.name} - {self.get_transaction_type_display()}"


class TerminalTenderMapping(models.Model):
    """
    Terminal Tender Mapping Model
    Defines tender type limits and permissions for each terminal
    """
    
    TENDER_TYPES = [
        ('cards', 'Cards'),
        ('cash', 'Cash'),
        ('cheque', 'Cheque'),
        ('credit', 'Credit'),
        ('credit_note', 'CreditNote'),
        ('due', 'Due'),
        ('coupons', 'Coupons'),
        ('fcoupons', 'FCoupons'),
        ('currency', 'Currency'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, related_name='tender_mappings')
    tender_type = models.CharField(max_length=50, choices=TENDER_TYPES)
    minimum_value = models.DecimalField(
        max_digits=18, 
        decimal_places=2, 
        default=0.00,
        help_text="Minimum transaction value allowed for this tender type"
    )
    maximum_value = models.DecimalField(
        max_digits=18, 
        decimal_places=2, 
        default=0.00,
        help_text="Maximum transaction value allowed for this tender type (0 = no limit)"
    )
    allow_tender = models.BooleanField(default=False, help_text="Allow this tender type for payments")
    allow_refund = models.BooleanField(default=False, help_text="Allow this tender type for refunds")
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='tender_mappings_created')
    
    class Meta:
        db_table = 'terminal_tender_mappings'
        verbose_name = 'Terminal Tender Mapping'
        verbose_name_plural = 'Terminal Tender Mappings'
        unique_together = [['terminal', 'tender_type']]
        indexes = [
            models.Index(fields=['terminal', 'tender_type']),
        ]
    
    def __str__(self):
        return f"{self.terminal.name} - {self.get_tender_type_display()}"


class TerminalDepartmentMapping(models.Model):
    """
    Terminal Department Mapping Model
    Defines which departments are accessible on each terminal
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, related_name='department_mappings')
    # Note: Using Category model as Department (verify if Department model exists separately)
    department = models.ForeignKey(
        'categories.Category', 
        on_delete=models.CASCADE,
        related_name='terminal_mappings',
        help_text="Department/Category that can be accessed on this terminal"
    )
    allow = models.BooleanField(default=False, help_text="Allow access to this department on this terminal")
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='department_mappings_created')
    
    class Meta:
        db_table = 'terminal_department_mappings'
        verbose_name = 'Terminal Department Mapping'
        verbose_name_plural = 'Terminal Department Mappings'
        unique_together = [['terminal', 'department']]
        indexes = [
            models.Index(fields=['terminal', 'department']),
        ]
    
    def __str__(self):
        return f"{self.terminal.name} - {self.department.name if self.department else 'N/A'}"


class SettlementReason(models.Model):
    """
    Reason codes for settlement variance (shortage/excess) tracking.
    """

    REASON_TYPE_CHOICES = [
        ('shortage', 'Shortage'),
        ('excess', 'Excess'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True, help_text="Unique reason code (e.g., SHORT)")
    name = models.CharField(max_length=120, help_text="Display name for the reason")
    reason_type = models.CharField(max_length=20, choices=REASON_TYPE_CHOICES, help_text="Reason category")
    module_ref = models.CharField(max_length=100, help_text="Module reference (e.g., 'POS_OPERATOR_CASHUP')")
    app_ref = models.CharField(max_length=100, blank=True, help_text="Application reference (e.g., 'POS_APP')")
    description = models.TextField(blank=True, help_text="Optional description for additional context")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='settlement_reasons_created'
    )
    updated_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='settlement_reasons_updated'
    )

    class Meta:
        db_table = 'pos_settlement_reasons'
        verbose_name = 'Settlement Reason'
        verbose_name_plural = 'Settlement Reasons'
        ordering = ['reason_type', 'name']
        indexes = [
            models.Index(fields=['reason_type', 'is_active']),
            models.Index(fields=['module_ref']),
        ]

    def __str__(self):
        return f"{self.name} ({self.reason_type})"

    def save(self, *args, **kwargs):
        if self.code:
            self.code = self.code.upper()
        super().save(*args, **kwargs)