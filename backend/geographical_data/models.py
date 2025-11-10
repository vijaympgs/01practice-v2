from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
import uuid

User = get_user_model()

class Country(models.Model):
    """Country model for geographical data"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, unique=True, validators=[
        RegexValidator(
            regex=r'^[A-Z]{2,3}$',
            message='Country code must be 2-3 uppercase letters (ISO format)'
        )
    ])
    phone_code = models.CharField(max_length=5, blank=True, null=True)
    currency_code = models.CharField(max_length=3, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='countries_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='countries_updated')
    
    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"
        ordering = ['name']
        db_table = 'geographical_data_country'
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class State(models.Model):
    """State/Province model for geographical data"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, blank=True, null=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='states')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='states_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='states_updated')
    
    class Meta:
        verbose_name = "State"
        verbose_name_plural = "States"
        ordering = ['country__name', 'name']
        unique_together = ['name', 'country']
        db_table = 'geographical_data_state'
    
    def __str__(self):
        return f"{self.name}, {self.country.name}"


class City(models.Model):
    """City model for geographical data"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, blank=True, null=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='cities')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='cities_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='cities_updated')
    
    class Meta:
        verbose_name = "City"
        verbose_name_plural = "Cities"
        ordering = ['country__name', 'state__name', 'name']
        unique_together = ['name', 'state']
        db_table = 'geographical_data_city'
    
    def __str__(self):
        return f"{self.name}, {self.state.name}, {self.country.name}"
    
    @property
    def full_address(self):
        """Return formatted full address"""
        return f"{self.name}, {self.state.name}, {self.country.name}"



