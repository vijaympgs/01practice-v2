from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
import uuid

User = get_user_model()


class Company(models.Model):
    """Company model for organizational setup"""
    
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
        ('INR', 'Indian Rupee'),
        ('CAD', 'Canadian Dollar'),
        ('AUD', 'Australian Dollar'),
    ]
    
    TIMEZONE_CHOICES = [
        ('UTC', 'UTC'),
        ('America/New_York', 'America/New_York'),
        ('America/Chicago', 'America/Chicago'),
        ('America/Denver', 'America/Denver'),
        ('America/Los_Angeles', 'America/Los_Angeles'),
        ('Europe/London', 'Europe/London'),
        ('Europe/Paris', 'Europe/Paris'),
        ('Asia/Kolkata', 'Asia/Kolkata'),
        ('Asia/Tokyo', 'Asia/Tokyo'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=20, unique=True, validators=[
        RegexValidator(
            regex=r'^[A-Z0-9]+$',
            message='Code must contain only uppercase letters and numbers'
        )
    ])
    description = models.TextField(blank=True, null=True)
    
    # Address Information
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Contact Information
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Business Information
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    timezone = models.CharField(max_length=50, choices=TIMEZONE_CHOICES, default='UTC')
    
    # Company Branding
    logo = models.ImageField(
        upload_to='company_logos/', 
        blank=True, 
        null=True,
        help_text='Company logo image (recommended size: 200x200px)'
    )
    
    # Status and Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_companies')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_companies')
    
    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"
        ordering = ['name']
        db_table = 'organization_company'
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    @property
    def full_address(self):
        """Return formatted full address"""
        address_parts = [self.address, self.city, self.state, self.country, self.postal_code]
        return ', '.join(filter(None, address_parts))
    
    @property
    def contact_info(self):
        """Return formatted contact information"""
        return {
            'phone': self.phone,
            'email': self.email,
            'website': self.website
        }


class Location(models.Model):
    """Location model for physical locations, stores, offices, etc."""
    
    LOCATION_TYPE_CHOICES = [
        ('store', 'Store'),
        ('headquarters', 'Head Quarters'),
        ('warehouse', 'Warehouse'),
        ('distribution', 'Distribution Center'),
        ('factory', 'Factory'),
        ('showroom', 'Showroom'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True, validators=[
        RegexValidator(
            regex=r'^[A-Z0-9]+$',
            message='Code must contain only uppercase letters and numbers'
        )
    ])
    description = models.TextField(blank=True, null=True)
    
    # Company Relationship
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='locations')
    
    # Address Information
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Contact Information
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    manager = models.CharField(max_length=100, blank=True, null=True)
    
    # Location Details
    location_type = models.CharField(max_length=20, choices=LOCATION_TYPE_CHOICES, default='store')
    
    # Coordinates
    latitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    
    # Operating Hours (stored as JSON)
    operating_hours = models.JSONField(default=dict, blank=True)
    
    # Status and Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_locations')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_locations')
    
    class Meta:
        verbose_name = "Location"
        verbose_name_plural = "Locations"
        ordering = ['company', 'name']
        db_table = 'organization_location'
        unique_together = ['company', 'code']
    
    def __str__(self):
        return f"{self.name} ({self.code}) - {self.company.name}"
    
    @property
    def full_address(self):
        """Return formatted full address"""
        address_parts = [self.address, self.city, self.state, self.country, self.postal_code]
        return ', '.join(filter(None, address_parts))
    
    @property
    def coordinates(self):
        """Return coordinates as tuple"""
        if self.latitude and self.longitude:
            return (float(self.latitude), float(self.longitude))
        return None
    
    def get_operating_hours_for_day(self, day):
        """Get operating hours for a specific day"""
        return self.operating_hours.get(day, {'isOpen': False, 'open': '09:00', 'close': '18:00'})
    
    def is_open_now(self):
        """Check if location is currently open (simplified check)"""
        # This is a simplified implementation
        # In a real application, you'd check current time against operating hours
        return self.is_active
    
    def clean(self):
        """Custom validation for the model"""
        from django.core.exceptions import ValidationError
        
        # Ensure only one headquarters per company
        if self.location_type == 'headquarters':
            existing_headquarters = Location.objects.filter(
                company=self.company,
                location_type='headquarters',
                is_active=True
            ).exclude(id=self.id)
            
            if existing_headquarters.exists():
                raise ValidationError({
                    'location_type': 'Only one headquarters location is allowed per company.'
                })
    
    def save(self, *args, **kwargs):
        """Override save to run clean validation"""
        self.clean()
        super().save(*args, **kwargs)


class OperatingHours(models.Model):
    """Model to store operating hours for locations"""
    
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='hours')
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    is_open = models.BooleanField(default=True)
    open_time = models.TimeField(default='09:00')
    close_time = models.TimeField(default='18:00')
    
    class Meta:
        verbose_name = "Operating Hours"
        verbose_name_plural = "Operating Hours"
        unique_together = ['location', 'day']
        db_table = 'organization_operating_hours'
    
    def __str__(self):
        if self.is_open:
            return f"{self.location.name} - {self.get_day_display()}: {self.open_time} - {self.close_time}"
        else:
            return f"{self.location.name} - {self.get_day_display()}: Closed"