from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.utils.safestring import mark_safe
from django.core.exceptions import ValidationError
import openpyxl
import io
import zipfile
from datetime import datetime

from .models import UploadSession, MasterDataTemplate, ImportLog, ValidationRule, MasterDataCache
from .services.excel_template_generator import generate_template_file, save_template_to_file


# Custom admin site actions (commented out - not needed for simplified interface)
# def download_template_action(modeladmin, request, queryset):
#     """Admin action to download template"""
#     return HttpResponseRedirect(reverse('admin:masters_uploadsession_download_template'))
# download_template_action.short_description = "Download Excel Template"


# def upload_data_action(modeladmin, request, queryset):
#     """Admin action to upload data"""
#     return HttpResponseRedirect(reverse('admin:masters_uploadsession_upload_data'))
# upload_data_action.short_description = "Upload Master Data"


# Minimal admin class to keep template download URLs working but hide from admin interface
class UploadSessionAdmin(admin.ModelAdmin):
    """
    Admin interface for Upload Sessions
    """
    list_display = [
        'session_name', 'status', 'progress_percentage', 
        'total_records', 'successful_records', 'failed_records',
        'created_by', 'created_at', 'duration'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['session_name', 'description', 'file_name']
    readonly_fields = [
        'file_name', 'file_size', 'total_records', 'processed_records',
        'successful_records', 'failed_records', 'skipped_records',
        'progress_percentage', 'duration', 'created_at', 'updated_at',
        'started_at', 'completed_at', 'created_by'
    ]
    # actions = []  # No actions needed for simplified interface
    # change_list_template = 'admin/masters/change_list.html'  # Not used
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('session_name', 'description', 'excel_file')
        }),
        ('Processing Status', {
            'fields': ('status', 'progress_percentage', 'current_step')
        }),
        ('Results Summary', {
            'fields': (
                'total_records', 'processed_records', 'successful_records',
                'failed_records', 'skipped_records'
            )
        }),
        ('Error Information', {
            'fields': ('error_message', 'error_details'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at', 'started_at', 'completed_at'),
            'classes': ('collapse',)
        })
    )
    
    def duration(self, obj):
        """Display processing duration"""
        if obj.duration:
            total_seconds = int(obj.duration.total_seconds())
            hours, remainder = divmod(total_seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            
            if hours > 0:
                return f"{hours}h {minutes}m {seconds}s"
            elif minutes > 0:
                return f"{minutes}m {seconds}s"
            else:
                return f"{seconds}s"
        return "-"
    duration.short_description = "Duration"
    
    def get_urls(self):
        """Add custom URLs for upload actions"""
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('download-template/', self.admin_site.admin_view(self.download_template), name='masters_uploadsession_download_template'),
            path('upload-data/', self.admin_site.admin_view(self.upload_data), name='masters_uploadsession_upload_data'),
            path('<uuid:pk>/view-logs/', self.admin_site.admin_view(self.view_logs), name='masters_uploadsession_view_logs'),
        ]
        return custom_urls + urls
    
    def download_template(self, request):
        """Download Excel template"""
        try:
            include_sample_data = request.GET.get('sample_data', 'false').lower() == 'true'
            workbook = generate_template_file(include_sample_data)
            
            # Create response
            response = HttpResponse(
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            
            # Set filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            if include_sample_data:
                filename = f'Master_Data_Template_Sample_{timestamp}.xlsx'
            else:
                filename = f'Master_Data_Template_{timestamp}.xlsx'
            
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            # Save workbook to response
            virtual_workbook = io.BytesIO()
            workbook.save(virtual_workbook)
            virtual_workbook.seek(0)
            response.write(virtual_workbook.read())
            
            messages.success(request, f'Template {"with sample data" if include_sample_data else ""} downloaded successfully!')
            return response
            
        except Exception as e:
            messages.error(request, f'Error generating template: {str(e)}')
            return HttpResponseRedirect(reverse('admin:masters_uploadsession_changelist'))
    
    def upload_data(self, request):
        """Handle file upload"""
        if request.method == 'POST':
            try:
                excel_file = request.FILES.get('excel_file')
                if not excel_file:
                    messages.error(request, 'Please select an Excel file to upload.')
                    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
                
                # Validate file extension
                if not excel_file.name.endswith(('.xlsx', '.xls')):
                    messages.error(request, 'Please upload a valid Excel file (.xlsx or .xls).')
                    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
                
                # Create upload session
                session = UploadSession.objects.create(
                    session_name=f"Upload_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                    excel_file=excel_file,
                    file_name=excel_file.name,
                    file_size=excel_file.size,
                    created_by=request.user
                )
                
                messages.success(request, f'File uploaded successfully! Session ID: {session.id}')
                return HttpResponseRedirect(reverse('admin:masters_uploadsession_change', args=[session.id]))
                
            except Exception as e:
                messages.error(request, f'Error uploading file: {str(e)}')
                return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
        
        # Show upload form
        context = {
            'title': 'Upload Master Data',
            'opts': self.model._meta,
            'is_popup': False,
        }
        return render(request, 'admin/masters/upload_data.html', context)
    
    def view_logs(self, request, pk):
        """View import logs for a session"""
        try:
            session = UploadSession.objects.get(pk=pk)
            logs = session.import_logs.all().order_by('sheet_name', 'row_number')
            
            context = {
                'session': session,
                'logs': logs,
                'title': f'Import Logs - {session.session_name}',
                'opts': self.model._meta,
                'is_popup': False,
            }
            return render(request, 'admin/masters/view_logs.html', context)
            
        except UploadSession.DoesNotExist:
            messages.error(request, 'Upload session not found.')
            return HttpResponseRedirect(reverse('admin:masters_uploadsession_changelist'))
        except Exception as e:
            messages.error(request, f'Error loading logs: {str(e)}')
            return HttpResponseRedirect(reverse('admin:masters_uploadsession_changelist'))
    
    def change_view(self, request, object_id=None, form_url='', extra_context=None):
        """Customize change view"""
        extra_context = extra_context or {}
        extra_context['show_upload_actions'] = True
        return super().change_view(request, object_id, form_url, extra_context)
    
    def changelist_view(self, request, extra_context=None):
        """Customize changelist view"""
        extra_context = extra_context or {}
        extra_context['show_upload_actions'] = True
        return super().changelist_view(request, extra_context)


# @admin.register(MasterDataTemplate)
# class MasterDataTemplateAdmin(admin.ModelAdmin):
#     """
#     Admin interface for Master Data Templates
#     """
#     list_display = ['name', 'version', 'is_active', 'is_default', 'created_by', 'created_at']
#     list_filter = ['is_active', 'is_default', 'created_at']
#     search_fields = ['name', 'description']
#     readonly_fields = ['created_at', 'updated_at', 'created_by']
#     
#     fieldsets = (
#         ('Basic Information', {
#             'fields': ('name', 'description', 'version')
#         }),
#         ('Configuration', {
#             'fields': ('sheet_configurations',)
#         }),
#         ('Status', {
#             'fields': ('is_active', 'is_default')
#         }),
#         ('Metadata', {
#             'fields': ('created_by', 'created_at', 'updated_at'),
#             'classes': ('collapse',)
#         })
#     )


# @admin.register(ImportLog)
# class ImportLogAdmin(admin.ModelAdmin):
#     """
#     Admin interface for Import Logs
#     """
#     list_display = [
#         'upload_session', 'sheet_name', 'row_number', 'model_name',
#         'record_identifier', 'result', 'created_at'
#     ]
#     list_filter = ['result', 'sheet_name', 'model_name', 'created_at']
#     search_fields = [
#         'upload_session__session_name', 'sheet_name', 'model_name',
#         'record_identifier', 'message'
#     ]
#     readonly_fields = [
#         'upload_session', 'sheet_name', 'row_number', 'model_name',
#         'record_identifier', 'result', 'message', 'original_data',
#         'processed_data', 'content_type', 'object_id', 'created_at'
#     ]
#     
#     def has_add_permission(self, request):
#         """Import logs are read-only"""
#         return False
#     
#     def has_change_permission(self, request, obj=None):
#         """Import logs are read-only"""
#         return False
#     
#     def has_delete_permission(self, request, obj=None):
#         """Import logs are read-only"""
#         return False


# @admin.register(ValidationRule)
# class ValidationRuleAdmin(admin.ModelAdmin):
#     """
#     Admin interface for Validation Rules
#     """
#     list_display = [
#         'name', 'model_name', 'field_name', 'rule_type',
#         'is_active', 'created_by', 'created_at'
#     ]
#     list_filter = ['model_name', 'rule_type', 'is_active', 'created_at']
#     search_fields = ['name', 'model_name', 'field_name', 'error_message']
#     readonly_fields = ['created_at', 'updated_at', 'created_by']
#     
#     fieldsets = (
#         ('Basic Information', {
#             'fields': ('name', 'model_name', 'field_name', 'rule_type')
#         }),
#         ('Rule Configuration', {
#             'fields': ('parameters', 'error_message')
#         }),
#         ('Status', {
#             'fields': ('is_active',)
#         }),
#         ('Metadata', {
#             'fields': ('created_by', 'created_at', 'updated_at'),
#             'classes': ('collapse',)
#         })
#     )


# @admin.register(MasterDataCache)
# class MasterDataCacheAdmin(admin.ModelAdmin):
#     """
#     Admin interface for Master Data Cache
#     """
#     list_display = ['model_name', 'cache_key', 'expires_at', 'hit_count', 'created_at']
#     list_filter = ['model_name', 'expires_at', 'created_at']
#     search_fields = ['model_name', 'cache_key']
#     readonly_fields = ['created_at', 'updated_at']
#     
#     def has_add_permission(self, request):
#         """Cache entries are managed automatically"""
#         return False
#     
#     def has_change_permission(self, request, obj=None):
#         """Cache entries are managed automatically"""
#         return False


# Add custom admin site header
def custom_admin_site_header(context):
    """Custom admin site header"""
    return {
        **context,
        'site_header': 'Master Data Management',
        'site_title': 'Master Data Upload System',
        'index_title': 'Master Data Administration',
    }


# Add custom admin site each context
def custom_admin_site_each_context(context):
    """Custom admin site each context"""
    context.update({
        'master_data_upload_enabled': True,
        'show_upload_actions': True,
    })
    return context


# Masters admin completely removed - no admin registrations
# All functionality moved to standalone views in views.py
