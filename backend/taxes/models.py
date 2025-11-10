from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()

class TaxType(models.Model):
    """Model for different types of taxes (GST, VAT, Sales Tax, etc.)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_tax_types')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_tax_types')

    class Meta:
        db_table = 'taxes_tax_type'
        verbose_name = 'Tax Type'
        verbose_name_plural = 'Tax Types'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"

class TaxRate(models.Model):
    """Model for specific tax rates under each tax type"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tax_type = models.ForeignKey(TaxType, on_delete=models.CASCADE, related_name='tax_rates')
    name = models.CharField(max_length=200)
    rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_tax_rates')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_tax_rates')

    class Meta:
        db_table = 'taxes_tax_rate'
        verbose_name = 'Tax Rate'
        verbose_name_plural = 'Tax Rates'
        ordering = ['tax_type', 'sort_order', 'name']
        unique_together = ['tax_type', 'name']

    def __str__(self):
        return f"{self.name} - {self.rate}%"