from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'', SupplierViewSet, basename='supplier')

urlpatterns = [
    path('', include(router.urls)),
]

# Available endpoints:
# GET    /api/suppliers/                    - List suppliers with pagination and filtering
# POST   /api/suppliers/                    - Create new supplier
# GET    /api/suppliers/{id}/               - Get supplier details
# PUT    /api/suppliers/{id}/               - Update supplier (full)
# PATCH  /api/suppliers/{id}/               - Update supplier (partial)
# DELETE /api/suppliers/{id}/               - Delete supplier

# Custom endpoints:
# GET    /api/suppliers/stats/              - Supplier statistics
# GET    /api/suppliers/search/?q=query     - Search suppliers
# GET    /api/suppliers/{id}/performance/   - Supplier performance metrics
# POST   /api/suppliers/bulk_update/        - Bulk update suppliers
# GET    /api/suppliers/contacts/           - Get supplier contact info only
# POST   /api/suppliers/{id}/activate/      - Activate supplier
# POST   /api/suppliers/{id}/deactivate/    - Deactivate supplier
# POST   /api/suppliers/{id}/toggle_preferred/  - Toggle preferred status
# POST   /api/suppliers/{id}/toggle_verified/   - Toggle verified status
# GET    /api/suppliers/recent/             - Recent suppliers
# GET    /api/suppliers/preferred/          - Preferred suppliers only
# GET    /api/suppliers/by_type/?type=X     - Suppliers by type
# GET    /api/suppliers/export/             - Export suppliers data








