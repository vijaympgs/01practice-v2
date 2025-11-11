from django.contrib import admin
from django.utils.html import format_html
from .models import ProductClassification, ItemCategory, ItemSubCategory, Attribute, AttributeValue


@admin.register(ProductClassification)
class ProductClassificationAdmin(admin.ModelAdmin):
    """
    Admin interface for ProductClassification model.
    """
    
    list_display = [
        'name', 'parent', 'is_active', 'sort_order', 
        'level', 'children_count', 'created_at'
    ]
    list_filter = ['is_active', 'parent', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['sort_order', 'name']
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'parent')
        }),
        ('Settings', {
            'fields': ('is_active', 'sort_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def level(self, obj):
        """Display the hierarchy level of the classification."""
        return obj.level
    
    level.short_description = 'Level'
    level.admin_order_field = 'parent'
    
    def children_count(self, obj):
        """Display the number of child classifications."""
        count = obj.get_children().count()
        if count > 0:
            return format_html(
                '<span style="color: green;">{}</span>',
                count
            )
        return count
    
    children_count.short_description = 'Children'
    
    def get_queryset(self, request):
        """Optimize queryset for admin list view."""
        return super().get_queryset(request).select_related('parent')
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Customize parent field to show only active classifications."""
        if db_field.name == "parent":
            kwargs["queryset"] = ProductClassification.objects.filter(is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def save_model(self, request, obj, form, change):
        """Custom save logic for classification."""
        super().save_model(request, obj, form, change)
        
        # Log the action
        if change:
            self.message_user(request, f'Product Classification "{obj.name}" was updated successfully.')
        else:
            self.message_user(request, f'Product Classification "{obj.name}" was created successfully.')
    
    def delete_model(self, request, obj):
        """Custom delete logic with safety checks."""
        if not obj.can_be_deleted():
            self.message_user(
                request, 
                f'Cannot delete classification "{obj.name}" - it has products or child classifications.',
                level='ERROR'
            )
            return
        
        super().delete_model(request, obj)
        self.message_user(request, f'Product Classification "{obj.name}" was deleted successfully.')


@admin.register(ItemCategory)
class ItemCategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for ItemCategory model.
    """
    
    list_display = [
        'name', 'code', 'is_active', 'sort_order', 
        'subcategories_count', 'items_count', 'created_at'
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code', 'description']
    ordering = ['sort_order', 'name']
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description')
        }),
        ('Settings', {
            'fields': ('is_active', 'sort_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def subcategories_count(self, obj):
        """Display the number of active subcategories."""
        count = obj.subcategories_count
        if count > 0:
            return format_html(
                '<span style="color: green;">{}</span>',
                count
            )
        return count
    
    subcategories_count.short_description = 'Subcategories'
    
    def items_count(self, obj):
        """Display the number of items in this category."""
        count = obj.items_count
        if count > 0:
            return format_html(
                '<span style="color: blue;">{}</span>',
                count
            )
        return count
    
    items_count.short_description = 'Items'


@admin.register(ItemSubCategory)
class ItemSubCategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for ItemSubCategory model.
    """
    
    list_display = [
        'category', 'name', 'code', 'is_active', 'sort_order', 
        'items_count', 'created_at'
    ]
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'code', 'description', 'category__name']
    ordering = ['category', 'sort_order', 'name']
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('category', 'name', 'code', 'description')
        }),
        ('Settings', {
            'fields': ('is_active', 'sort_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def items_count(self, obj):
        """Display the number of items in this sub-category."""
        count = obj.items_count
        if count > 0:
            return format_html(
                '<span style="color: blue;">{}</span>',
                count
            )
        return count
    
    items_count.short_description = 'Items'


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    """
    Admin interface for Attribute model.
    """
    
    list_display = ['name', 'data_type', 'is_active', 'sort_order', 'values_count', 'created_at']
    list_filter = ['is_active', 'data_type', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['sort_order', 'name']
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'data_type')
        }),
        ('Settings', {
            'fields': ('is_active', 'sort_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def values_count(self, obj):
        """Display the number of values for this attribute."""
        count = obj.values.filter(is_active=True).count()
        if count > 0:
            return format_html(
                '<span style="color: green;">{}</span>',
                count
            )
        return count
    
    values_count.short_description = 'Values'


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    """
    Admin interface for AttributeValue model.
    """
    
    list_display = ['attribute', 'value', 'is_active', 'sort_order', 'created_at']
    list_filter = ['is_active', 'attribute', 'created_at']
    search_fields = ['value', 'description']
    ordering = ['sort_order', 'value']
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('attribute', 'value', 'description')
        }),
        ('Settings', {
            'fields': ('is_active', 'sort_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        """Optimize queryset for admin list view."""
        return super().get_queryset(request).select_related('attribute')
