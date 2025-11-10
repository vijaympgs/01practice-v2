from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'', CustomerViewSet, basename='customer')

urlpatterns = [
    path('', include(router.urls)),
]

# Available endpoints:
# GET    /api/customers/                    - List customers with pagination and filtering
# POST   /api/customers/                    - Create new customer
# GET    /api/customers/{id}/               - Get customer details
# PUT    /api/customers/{id}/               - Update customer (full)
# PATCH  /api/customers/{id}/               - Update customer (partial)
# DELETE /api/customers/{id}/               - Delete customer

# Custom endpoints:
# GET    /api/customers/stats/              - Customer statistics
# GET    /api/customers/search/?q=query     - Search customers
# GET    /api/customers/{id}/history/       - Customer purchase history
# POST   /api/customers/bulk_update/        - Bulk update customers
# GET    /api/customers/export/             - Export customers data
# POST   /api/customers/{id}/activate/      - Activate customer
# POST   /api/customers/{id}/deactivate/    - Deactivate customer
# POST   /api/customers/{id}/toggle_vip/    - Toggle VIP status
# GET    /api/customers/recent/             - Recent customers
# GET    /api/customers/birthdays/          - Customers with birthdays this month








