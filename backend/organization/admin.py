from django.contrib import admin
from .models import Company, Location, OperatingHours


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """Admin interface for Company model"""
    
    list_display = ['name', 'code', 'city', 'country', 'currency', 'is_active', 'created_at']
    list_filter = ['is_active', 'currency', 'timezone', 'country', 'created_at']
    search_fields = ['name', 'code', 'description', 'city', 'state', 'email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description', 'is_active')
        }),
        ('Address Information', {
            'fields': ('address', 'city', 'state', 'country', 'postal_code')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'website')
        }),
        ('Business Information', {
            'fields': ('tax_id', 'registration_number', 'currency', 'timezone')
        }),
        ('Company Branding', {
            'fields': ('logo',),
            'description': 'Upload company logo (recommended size: 200x200px)'
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Creating new object
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    """Admin interface for Location model"""
    
    list_display = ['name', 'code', 'company', 'location_type', 'city', 'manager', 'is_active']
    list_filter = ['is_active', 'location_type', 'company', 'country', 'created_at']
    search_fields = ['name', 'code', 'description', 'city', 'state', 'manager', 'email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description', 'company', 'location_type', 'is_active')
        }),
        ('Address Information', {
            'fields': ('address', 'city', 'state', 'country', 'postal_code')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'manager')
        }),
        ('Location Details', {
            'fields': ('latitude', 'longitude', 'operating_hours')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Creating new object
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(OperatingHours)
class OperatingHoursAdmin(admin.ModelAdmin):
    """Admin interface for OperatingHours model"""
    
    list_display = ['location', 'day', 'is_open', 'open_time', 'close_time']
    list_filter = ['is_open', 'day', 'location']
    search_fields = ['location__name', 'location__code']
    
    fieldsets = (
        ('Operating Hours', {
            'fields': ('location', 'day', 'is_open', 'open_time', 'close_time')
        }),
    )