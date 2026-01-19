from django.contrib import admin
from .models import Item, ItemVariant, UOM, UOMConversion, Brand

class ItemVariantInline(admin.TabularInline):
    model = ItemVariant
    extra = 1

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['item_name', 'item_code', 'item_type', 'brand', 'category', 'status', 'company']
    list_filter = ['company', 'status', 'item_type', 'brand']
    search_fields = ['item_name', 'item_code']
    inlines = [ItemVariantInline]

@admin.register(ItemVariant)
class ItemVariantAdmin(admin.ModelAdmin):
    list_display = ['variant_name', 'sku_code', 'item', 'default_price', 'company']
    list_filter = ['company', 'is_active']
    search_fields = ['variant_name', 'sku_code']

@admin.register(UOM)
class UOMAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'company', 'is_active']
    list_filter = ['company', 'is_active']

@admin.register(UOMConversion)
class UOMConversionAdmin(admin.ModelAdmin):
    list_display = ['from_uom', 'to_uom', 'conversion_factor', 'company']
    list_filter = ['company']

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'company']
    list_filter = ['company']