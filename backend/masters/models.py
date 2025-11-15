from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
import uuid
import os

User = get_user_model()


class UploadSession(models.Model):
    """
    Track upload sessions for master data uploads
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_name = models.CharField(max_length=200, help_text="Name of the upload session")
    description = models.TextField(blank=True, null=True, help_text="Description of the upload session")
    
    # File information
    excel_file = models.FileField(
        upload_to='master_uploads/',
        validators=[FileExtensionValidator(allowed_extensions=['xlsx', 'xls'])],
        help_text="Excel file containing master data"
    )
    error_file = models.FileField(
        upload_to='master_upload_errors/',
        blank=True, null=True,
        validators=[FileExtensionValidator(allowed_extensions=['xlsx', 'xls'])],
        help_text="Excel file with error details"
    )
    file_name = models.CharField(max_length=255, help_text="Original file name")
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    
    # Status and processing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    progress_percentage = models.PositiveIntegerField(default=0, help_text="Upload progress percentage")
    current_step = models.CharField(max_length=100, blank=True, null=True, help_text="Current processing step")
    
    # Results
    total_records = models.PositiveIntegerField(default=0, help_text="Total records to process")
    processed_records = models.PositiveIntegerField(default=0, help_text="Records processed so far")
    successful_records = models.PositiveIntegerField(default=0, help_text="Successfully processed records")
    failed_records = models.PositiveIntegerField(default=0, help_text="Failed records")
    skipped_records = models.PositiveIntegerField(default=0, help_text="Skipped records")
    
    # Error information
    error_message = models.TextField(blank=True, null=True, help_text="Error message if upload failed")
    error_details = models.JSONField(default=dict, blank=True, help_text="Detailed error information")
    
    # Timestamps and user
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    started_at = models.DateTimeField(blank=True, null=True, help_text="When processing started")
    completed_at = models.DateTimeField(blank=True, null=True, help_text="When processing completed")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='upload_sessions')
    
    class Meta:
        verbose_name = "Upload Session"
        verbose_name_plural = "Upload Sessions"
        ordering = ['-created_at']
        db_table = 'masters_upload_session'
    
    def __str__(self):
        return f"{self.session_name} - {self.get_status_display()}"
    
    @property
    def duration(self):
        """Calculate processing duration"""
        if self.started_at and self.completed_at:
            return self.completed_at - self.started_at
        elif self.started_at:
            from django.utils import timezone
            return timezone.now() - self.started_at
        return None
    
    @property
    def success_rate(self):
        """Calculate success rate percentage"""
        if self.total_records > 0:
            return (self.successful_records / self.total_records) * 100
        return 0
    
    @property
    def is_processing(self):
        """Check if upload is currently processing"""
        return self.status == 'processing'
    
    @property
    def is_completed(self):
        """Check if upload is completed"""
        return self.status in ['completed', 'failed', 'cancelled']


class MasterDataTemplate(models.Model):
    """
    Define master data templates and sheet configurations
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True, help_text="Template name")
    description = models.TextField(blank=True, null=True, help_text="Template description")
    version = models.CharField(max_length=20, default='1.0', help_text="Template version")
    
    # Template configuration
    sheet_configurations = models.JSONField(
        default=dict,
        help_text="Configuration for each sheet in the template"
    )
    
    # Status
    is_active = models.BooleanField(default=True, help_text="Whether this template is active")
    is_default = models.BooleanField(default=False, help_text="Whether this is the default template")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_templates')
    
    class Meta:
        verbose_name = "Master Data Template"
        verbose_name_plural = "Master Data Templates"
        ordering = ['name']
        db_table = 'masters_template'
    
    def __str__(self):
        return f"{self.name} v{self.version}"


class ImportLog(models.Model):
    """
    Track individual record import results
    """
    
    RESULT_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('skipped', 'Skipped'),
        ('warning', 'Warning'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    upload_session = models.ForeignKey(UploadSession, on_delete=models.CASCADE, related_name='import_logs')
    
    # Record information
    sheet_name = models.CharField(max_length=100, help_text="Sheet name where record was found")
    row_number = models.PositiveIntegerField(help_text="Row number in the sheet")
    model_name = models.CharField(max_length=100, help_text="Target model name")
    record_identifier = models.CharField(max_length=200, help_text="Record identifier (e.g., code, name)")
    
    # Result
    result = models.CharField(max_length=20, choices=RESULT_CHOICES, help_text="Import result")
    message = models.TextField(blank=True, null=True, help_text="Result message")
    
    # Data
    original_data = models.JSONField(default=dict, help_text="Original data from Excel")
    processed_data = models.JSONField(default=dict, blank=True, help_text="Processed data after validation")
    
    # Object reference (if successfully created)
    content_type = models.ForeignKey('contenttypes.ContentType', on_delete=models.SET_NULL, null=True, blank=True)
    object_id = models.UUIDField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Import Log"
        verbose_name_plural = "Import Logs"
        ordering = ['upload_session', 'sheet_name', 'row_number']
        db_table = 'masters_import_log'
        indexes = [
            models.Index(fields=['upload_session', 'result']),
            models.Index(fields=['sheet_name', 'row_number']),
            models.Index(fields=['model_name']),
        ]
    
    def __str__(self):
        return f"{self.upload_session.session_name} - {self.sheet_name} Row {self.row_number} - {self.get_result_display()}"


class ValidationRule(models.Model):
    """
    Define validation rules for master data fields
    """
    
    RULE_TYPE_CHOICES = [
        ('required', 'Required'),
        ('unique', 'Unique'),
        ('min_length', 'Minimum Length'),
        ('max_length', 'Maximum Length'),
        ('min_value', 'Minimum Value'),
        ('max_value', 'Maximum Value'),
        ('regex', 'Regular Expression'),
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('numeric', 'Numeric'),
        ('positive', 'Positive Number'),
        ('choice', 'Choice'),
        ('foreign_key', 'Foreign Key'),
        ('custom', 'Custom'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, help_text="Rule name")
    model_name = models.CharField(max_length=100, help_text="Target model name")
    field_name = models.CharField(max_length=100, help_text="Target field name")
    rule_type = models.CharField(max_length=20, choices=RULE_TYPE_CHOICES, help_text="Type of validation rule")
    
    # Rule parameters
    parameters = models.JSONField(default=dict, help_text="Rule parameters (e.g., min_length, pattern, choices)")
    error_message = models.CharField(max_length=500, help_text="Error message to display")
    
    # Status
    is_active = models.BooleanField(default=True, help_text="Whether this rule is active")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_validation_rules')
    
    class Meta:
        verbose_name = "Validation Rule"
        verbose_name_plural = "Validation Rules"
        ordering = ['model_name', 'field_name', 'name']
        db_table = 'masters_validation_rule'
        unique_together = ['model_name', 'field_name', 'name']
    
    def __str__(self):
        return f"{self.model_name}.{self.field_name} - {self.name}"


class MasterDataCache(models.Model):
    """
    Cache for master data to improve performance
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model_name = models.CharField(max_length=100, help_text="Model name")
    cache_key = models.CharField(max_length=200, help_text="Cache key")
    cache_data = models.JSONField(help_text="Cached data")
    
    # Cache metadata
    expires_at = models.DateTimeField(help_text="When cache expires")
    hit_count = models.PositiveIntegerField(default=0, help_text="Number of times cache was hit")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Master Data Cache"
        verbose_name_plural = "Master Data Cache"
        ordering = ['model_name', 'cache_key']
        db_table = 'masters_cache'
        unique_together = ['model_name', 'cache_key']
        indexes = [
            models.Index(fields=['model_name', 'cache_key']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.model_name} - {self.cache_key}"
    
    @property
    def is_expired(self):
        """Check if cache is expired"""
        from django.utils import timezone
        return timezone.now() > self.expires_at
    
    def increment_hit_count(self):
        """Increment hit count"""
        self.hit_count += 1
        self.save(update_fields=['hit_count'])
