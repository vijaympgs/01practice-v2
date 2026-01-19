from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Attribute, AttributeValue, ProductAttributeTemplate, ProductAttributeTemplateLine


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for Category model.
    """
    
    list_display = [
        'name', 'parent', 'company', 'is_active', 'sort_order', 
        'level', 'children_count', 'created_at'
    ]
    list_filter = ['company', 'is_active', 'parent', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['sort_order', 'name']
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('company', 'name', 'description', 'parent')
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
        """Display the hierarchy level of the category."""
        return obj.level
    
    level.short_description = 'Level'
    level.admin_order_field = 'parent'
    
    def children_count(self, obj):
        """Display the number of child categories."""
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
        return super().get_queryset(request).select_related('parent', 'company')
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Customize parent field to show only active categories."""
        if db_field.name == "parent":
            kwargs["queryset"] = Category.objects.filter(is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def save_model(self, request, obj, form, change):
        """Custom save logic for category."""
        super().save_model(request, obj, form, change)
        
        # Log the action
        if change:
            self.message_user(request, f'Category "{obj.name}" was updated successfully.')
        else:
            self.message_user(request, f'Category "{obj.name}" was created successfully.')
    
    def delete_model(self, request, obj):
        """Custom delete logic with safety checks."""
        if not obj.can_be_deleted():
            self.message_user(
                request, 
                f'Cannot delete category "{obj.name}" - it has products or child categories.',
                level='ERROR'
            )
            return
        
        super().delete_model(request, obj)
        self.message_user(request, f'Category "{obj.name}" was deleted successfully.')
    
    class Media:
        css = {
            'all': ('admin/css/category_admin.css',)
        }
        js = ('admin/js/category_admin.js',)


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    """
    Admin interface for Attribute model.
    """
    
    list_display = ['name', 'attribute_code', 'input_type', 'is_active', 'sort_order', 'values_count', 'created_at']
    list_filter = ['company', 'is_active', 'input_type', 'created_at']
    search_fields = ['name', 'attribute_code', 'description']
    ordering = ['sort_order', 'name']
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('company', 'attribute_code', 'name', 'description', 'input_type', 'value_source')
        }),
        ('Behavior', {
             'fields': ('is_variant_dimension', 'is_search_facet')
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
    
    list_display = ['attribute', 'value_label', 'value_code', 'is_active', 'sort_order', 'created_at']
    list_filter = ['is_active', 'attribute', 'created_at']
    search_fields = ['value_label', 'value_code', 'description']
    ordering = ['sort_order', 'value_label']
    list_editable = ['is_active', 'sort_order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('company', 'attribute', 'value_code', 'value_label', 'description', 'is_default')
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


class ProductAttributeTemplateLineInline(admin.TabularInline):
    model = ProductAttributeTemplateLine
    extra = 1


@admin.register(ProductAttributeTemplate)
class ProductAttributeTemplateAdmin(admin.ModelAdmin):
    list_display = ['template_name', 'template_code', 'template_mode', 'company', 'is_active']
    list_filter = ['company', 'template_mode', 'is_active']
    search_fields = ['template_name', 'template_code']
    inlines = [ProductAttributeTemplateLineInline]