from django.contrib import admin
from .models import TaxType, TaxRate

@admin.register(TaxType)
class TaxTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'country', 'is_active', 'created_at']
    list_filter = ['country', 'is_active', 'created_at']
    search_fields = ['name', 'code', 'country']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['name']

@admin.register(TaxRate)
class TaxRateAdmin(admin.ModelAdmin):
    list_display = ['name', 'tax_type', 'rate', 'country', 'sort_order', 'is_active']
    list_filter = ['tax_type', 'country', 'is_active', 'created_at']
    search_fields = ['name', 'tax_type__name', 'country']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['tax_type__name', 'sort_order', 'name']