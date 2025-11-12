from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Uses UUID as primary key for better security and scalability.
    """
    
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('posmanager', 'POS Manager'),
        ('posuser', 'POS User'),
        ('backofficemanager', 'Back Office Manager'),
        ('backofficeuser', 'Back Office User'),
        # Removed: 'manager' and 'cashier' - not required per business requirements
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='posuser')
    phone = models.CharField(max_length=20, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # POS Location mapping - Each POS user can have only 1 POS location mapped
    pos_location = models.ForeignKey(
        'organization.Location',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pos_users',
        limit_choices_to={'location_type': 'store', 'is_active': True},
        help_text="POS location assignment (only for POS users, one location per user)"
    )
    
    class Meta:
        db_table = 'users'
        ordering = ['username']
        
    def __str__(self):
        return self.username
    
    @property
    def full_name(self):
        """Return the user's full name."""
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name}".strip()
        return self.username
    
    def get_accessible_locations(self):
        """
        Get locations this user can access based on their role.
        Implements role-based location access rules.
        """
        from organization.models import Location
        
        if self.role == 'admin':
            # Admin: All locations
            return Location.objects.filter(is_active=True)
        elif self.role == 'backofficemanager':
            # BO Admin: All locations except headquarters
            return Location.objects.filter(is_active=True).exclude(location_type='headquarters')
        elif self.role == 'posmanager':
            # POS Admin: All POS locations (stores only)
            return Location.objects.filter(is_active=True, location_type='store')
        elif self.role == 'backofficeuser':
            # BO User: All locations except headquarters
            return Location.objects.filter(is_active=True).exclude(location_type='headquarters')
        elif self.role == 'posuser':
            # POS User: Only assigned POS location from UserLocationMapping
            return self.get_pos_user_locations()
        else:
            # Default: No access
            return Location.objects.none()
    
    def get_accessible_location_types(self):
        """
        Get location types this user can access based on their role.
        """
        if self.role == 'admin':
            return ['store', 'headquarters', 'warehouse', 'distribution', 'factory', 'showroom']
        elif self.role in ['backofficemanager', 'backofficeuser']:
            return ['store', 'warehouse', 'distribution', 'factory', 'showroom']
        elif self.role in ['posmanager', 'posuser']:
            return ['store']
        else:
            return []
    
    def get_pos_user_locations(self):
        """
        Get POS locations assigned to this POS user through UserLocationMapping.
        """
        if self.role != 'posuser':
            from organization.models import Location
            return Location.objects.none()
        
        from organization.models import Location
        from .models import UserLocationMapping
        return Location.objects.filter(
            user_mappings__user=self,
            user_mappings__access_type__in=['pos', 'both'],
            user_mappings__is_active=True,
            is_active=True
        ).distinct()
    
    def can_access_location(self, location):
        """
        Check if user can access a specific location based on their role.
        """
        if not location or not location.is_active:
            return False
        
        accessible_locations = self.get_accessible_locations()
        return accessible_locations.filter(id=location.id).exists()
    
    def get_default_location(self):
        """
        Get the default location for this user based on their role and mappings.
        """
        if self.role == 'posuser':
            # For POS users, get their assigned POS location
            pos_locations = self.get_pos_user_locations()
            if pos_locations.exists():
                # Try to get the default mapped location first
                from .models import UserLocationMapping
                default_mapping = UserLocationMapping.objects.filter(
                    user=self,
                    access_type__in=['pos', 'both'],
                    is_default=True,
                    is_active=True
                ).first()
                
                if default_mapping:
                    return default_mapping.location
                else:
                    # Return first available POS location
                    return pos_locations.first()
        
        # For other roles, return first accessible location
        accessible_locations = self.get_accessible_locations()
        return accessible_locations.first()


class MenuItemType(models.Model):
    """
    Menu Item Type Mapping - Categorizes menu items by type and subtype
    This model maintains the mapping of menu items to their types (Master, Security, Transaction)
    and transaction subtypes (POS, BackOffice)
    """
    
    MENU_TYPE_CHOICES = [
        ('MASTER', 'Master'),
        ('SECURITY', 'Security'),
        ('TRANSACTION', 'Transaction'),
        ('SYSTEM', 'System'),
        ('DASHBOARD', 'Dashboard'),
    ]
    
    TRANSACTION_SUBTYPE_CHOICES = [
        ('POS', 'POS'),
        ('BACKOFFICE', 'BackOffice'),
        (None, 'N/A'),
    ]
    
    menu_item_id = models.CharField(max_length=100, unique=True, db_index=True)
    display_name = models.CharField(max_length=200)
    menu_type = models.CharField(max_length=20, choices=MENU_TYPE_CHOICES)
    transaction_subtype = models.CharField(
        max_length=20, 
        choices=TRANSACTION_SUBTYPE_CHOICES, 
        null=True, 
        blank=True,
        help_text="Only applicable for TRANSACTION type"
    )
    category = models.CharField(max_length=100, help_text="Menu category (e.g., 'Master Data Management')")
    path = models.CharField(max_length=200, help_text="Frontend route path")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display order within category")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'menu_item_types'
        ordering = ['category', 'order', 'display_name']
        verbose_name = 'Menu Controller'
        verbose_name_plural = 'Menu Controller'
        indexes = [
            models.Index(fields=['menu_type']),
            models.Index(fields=['transaction_subtype']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return f"{self.display_name} ({self.menu_type})"
    
    @property
    def is_master(self):
        """Check if menu item is a master type"""
        return self.menu_type == 'MASTER'
    
    @property
    def is_security(self):
        """Check if menu item is a security type"""
        return self.menu_type == 'SECURITY'
    
    @property
    def is_transaction(self):
        """Check if menu item is a transaction type"""
        return self.menu_type == 'TRANSACTION'
    
    @property
    def is_pos_transaction(self):
        """Check if menu item is a POS transaction"""
        return self.menu_type == 'TRANSACTION' and self.transaction_subtype == 'POS'
    
    @property
    def is_backoffice_transaction(self):
        """Check if menu item is a BackOffice transaction"""
        return self.menu_type == 'TRANSACTION' and self.transaction_subtype == 'BACKOFFICE'


class UserPermission(models.Model):
    """
    User Permissions - Granular permissions for each user on each menu item
    """
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='permissions')
    menu_item = models.ForeignKey(
        MenuItemType, 
        on_delete=models.CASCADE, 
        related_name='user_permissions',
        to_field='menu_item_id'
    )
    
    # Granular permissions
    can_access = models.BooleanField(default=False, help_text="Can access/see the menu item (controls visibility)")
    can_view = models.BooleanField(default=False, help_text="Can view/access the page")
    can_create = models.BooleanField(default=False, help_text="Can create new records")
    can_edit = models.BooleanField(default=False, help_text="Can edit existing records")
    can_delete = models.BooleanField(default=False, help_text="Can delete records")
    
    # Override flag - if True, this permission overrides group/role defaults
    override = models.BooleanField(default=False, help_text="Override group/role permissions")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='created_permissions'
    )
    
    class Meta:
        db_table = 'user_permissions'
        unique_together = ['user', 'menu_item']
        indexes = [
            models.Index(fields=['user', 'menu_item']),
            models.Index(fields=['menu_item', 'can_view']),
        ]
        verbose_name = 'User Permission'
        verbose_name_plural = 'User Permissions'
    
    def __str__(self):
        return f"{self.user.username} - {self.menu_item.display_name}"


class GroupPermission(models.Model):
    """
    Group/Role Permissions - Default permissions for roles
    This allows setting default permissions for roles that can be inherited by users
    """
    
    group = models.ForeignKey(
        'auth.Group',
        on_delete=models.CASCADE,
        related_name='menu_permissions'
    )
    role_key = models.CharField(
        max_length=50,
        help_text="Role key for quick lookup (e.g., 'posmanager', 'posuser')"
    )
    menu_item = models.ForeignKey(
        MenuItemType,
        on_delete=models.CASCADE,
        related_name='group_permissions',
        to_field='menu_item_id'
    )
    
    # Granular permissions
    can_access = models.BooleanField(default=False, help_text="Can access/see the menu item (controls visibility)")
    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'group_permissions'
        unique_together = ['group', 'menu_item']
        indexes = [
            models.Index(fields=['role_key', 'menu_item']),
            models.Index(fields=['group', 'menu_item']),
        ]
        verbose_name = 'Group Permission'
        verbose_name_plural = 'Group Permissions'
    
    def __str__(self):
        return f"{self.group.name} - {self.menu_item.display_name}"


class POSFunction(models.Model):
    """
    POS Function Master - Defines all available POS functions
    """
    FUNCTION_CATEGORY_CHOICES = [
        ('BASIC', 'Basic Operations'),
        ('DISCOUNT', 'Discount Operations'),
        ('PAYMENT', 'Payment Operations'),
        ('TRANSACTION', 'Transaction Management'),
        ('ADMIN', 'Administrative'),
    ]
    
    function_code = models.CharField(max_length=50, unique=True, db_index=True)  # e.g., 'F1', 'ALT_F3', 'CTRL_F4'
    function_name = models.CharField(max_length=100)  # e.g., 'Customer', 'Suspend Transaction'
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=FUNCTION_CATEGORY_CHOICES)
    keyboard_shortcut = models.CharField(max_length=20)  # e.g., 'F1', 'Alt+F3', 'Ctrl+F4'
    is_critical = models.BooleanField(default=False, help_text="Requires special authorization")
    order = models.IntegerField(default=0, help_text="Display order within category")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pos_functions'
        ordering = ['category', 'order']
        verbose_name = 'POS Function'
        verbose_name_plural = 'POS Functions'
        indexes = [
            models.Index(fields=['function_code']),
            models.Index(fields=['category', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.function_code} - {self.function_name}"


class RolePOSFunctionMapping(models.Model):
    """
    Role-POS Function Mapping - Maps roles to allowed POS functions
    """
    role = models.CharField(max_length=30, choices=User.ROLE_CHOICES)
    function = models.ForeignKey(POSFunction, on_delete=models.CASCADE, related_name='role_mappings')
    is_allowed = models.BooleanField(default=True)
    requires_approval = models.BooleanField(default=False, help_text="For critical functions")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='created_pos_function_mappings'
    )
    
    class Meta:
        db_table = 'role_pos_function_mappings'
        unique_together = ['role', 'function']
        indexes = [
            models.Index(fields=['role', 'is_allowed']),
            models.Index(fields=['function', 'role']),
        ]
        verbose_name = 'Role POS Function Mapping'
        verbose_name_plural = 'Role POS Function Mappings'
    
    def __str__(self):
        return f"{self.role} - {self.function.function_code}"


class UserLocationMapping(models.Model):
    """
    User-Location Mapping - Maps users to locations with different access types
    Allows users to have access to multiple locations with different permission levels
    """
    
    ACCESS_TYPE_CHOICES = [
        ('back_office', 'Back Office'),
        ('pos', 'POS'),
        ('both', 'Both'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='location_mappings')
    location = models.ForeignKey(
        'organization.Location',
        on_delete=models.CASCADE,
        related_name='user_mappings'
    )
    access_type = models.CharField(
        max_length=20,
        choices=ACCESS_TYPE_CHOICES,
        default='back_office',
        help_text="Type of access user has at this location"
    )
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(
        default=False,
        help_text="Mark as default location for this user"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_location_mappings'
    )
    
    class Meta:
        db_table = 'user_location_mappings'
        unique_together = ['user', 'location', 'access_type']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['location', 'is_active']),
            models.Index(fields=['access_type', 'is_active']),
        ]
        verbose_name = 'User Location Mapping'
        verbose_name_plural = 'User Location Mappings'
    
    def __str__(self):
        return f"{self.user.username} - {self.location.name} ({self.get_access_type_display()})"
    
    def clean(self):
        """Custom validation for the model"""
        from django.core.exceptions import ValidationError
        
        # Ensure only one default location per user per access type
        if self.is_default:
            existing_default = UserLocationMapping.objects.filter(
                user=self.user,
                access_type=self.access_type,
                is_default=True,
                is_active=True
            ).exclude(id=self.id)
            
            if existing_default.exists():
                raise ValidationError({
                    'is_default': f'Only one default location is allowed per user for {self.get_access_type_display()} access.'
                })
    
    def save(self, *args, **kwargs):
        """Override save to run clean validation"""
        self.clean()
        super().save(*args, **kwargs)
