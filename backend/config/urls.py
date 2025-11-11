"""
URL configuration for NewBorn Retail™ project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from utils.proxy_views import proxy_web_content

def api_root(request):
    """API root endpoint with service information"""
    return JsonResponse({
        'service': 'Practice System Backend API',
        'version': '1.0.0',
        'status': 'running',
        'frontend_url': 'http://localhost:3004',
        'docs': '/api/docs/',
        'admin': '/admin/',
        'endpoints': {
            'products': '/api/products/',
            'customers': '/api/customers/',
            'sales': '/api/sales/',
            'pos_sessions': '/api/pos-sessions/',
            'payments': '/api/payments/',
        }
    })

def dashboard_metrics(request):
    """Simple dashboard metrics endpoint"""
    return JsonResponse({
        'total_products': 0,
        'total_customers': 0,
        'total_sales': 0,
        'total_revenue': 0,
        'active_locations': 0,
        'active_users': 1,
        'recent_activity': []
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Authentication
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('users.urls')),
    
    # Dashboard
    path('api/dashboard/metrics/', dashboard_metrics, name='dashboard_metrics'),
    
    # App URLs
    path('api/organization/', include('organization.urls')),
    path('api/geographical-data/', include('geographical_data.urls')),
    path('api/taxes/', include('taxes.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/products/', include('products.urls')),
    path('api/customers/', include('customers.urls')),
    path('api/suppliers/', include('suppliers.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/', include('sales.urls')),  # Sales, payments, POS sessions
    path('api/business-rules/', include('business_rules.urls')),
    path('api/pay-modes/', include('pay_modes.urls')),
    path('api/pos-masters/', include('pos_masters.urls')),
    path('api/code-settings/', include('code_settings.urls')),
    path('api/theme/', include('theme_management.urls')),
    path('api/procurement/', include('procurement.urls')),
    path('api/db-client/', include('db_client.urls')),
    path('api/utils/web-proxy/', proxy_web_content, name='web_console_proxy'),
    # path('api/reports/', include('reports.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
