from django.urls import path
from . import views

app_name = 'theme_management'

urlpatterns = [
    # Theme CRUD operations
    path('themes/', views.ThemeSettingListCreateView.as_view(), name='theme-list-create'),
    path('themes/<int:pk>/', views.ThemeSettingDetailView.as_view(), name='theme-detail'),
    
    # Theme management endpoints
    path('active-theme/', views.get_active_theme, name='active-theme'),
    path('set-active-theme/', views.set_active_theme, name='set-active-theme'),
    path('create-theme/', views.create_theme_from_request, name='create-theme'),
]
