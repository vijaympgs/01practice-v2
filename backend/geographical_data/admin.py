from django.contrib import admin
from .models import Country, State, City


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'phone_code', 'currency_code', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code']
    ordering = ['name']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'country', 'is_active', 'created_at']
    list_filter = ['is_active', 'country', 'created_at']
    search_fields = ['name', 'code', 'country__name']
    ordering = ['country__name', 'name']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'state', 'country', 'postal_code', 'is_active', 'created_at']
    list_filter = ['is_active', 'state', 'country', 'created_at']
    search_fields = ['name', 'code', 'state__name', 'country__name']
    ordering = ['country__name', 'state__name', 'name']
    readonly_fields = ['id', 'created_at', 'updated_at']



