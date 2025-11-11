from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InventoryViewSet, StockMovementViewSet, PurchaseOrderViewSet, StockAlertViewSet

router = DefaultRouter()
router.register(r'inventory', InventoryViewSet)
router.register(r'movements', StockMovementViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'alerts', StockAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
]


