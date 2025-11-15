from django.urls import path, include
from django.contrib import admin

from . import views

app_name = 'masters'

urlpatterns = [
    # Simplified upload interface
    path('upload/', views.master_data_upload, name='upload'),
    
    # AJAX processing endpoint
    path('process-upload/', views.process_upload, name='process_upload'),
    
    # Standalone template download (not tied to admin)
    path('download-template/', views.download_template_standalone, name='download_template_standalone'),
    
    # Error file download
    path('download-error/<uuid:session_id>/', views.download_error_file, name='download_error_file'),
    
    # Admin URLs will be automatically included by Django admin site
]
