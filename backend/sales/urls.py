from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SaleViewSet, SaleItemViewSet, PaymentViewSet, POSSessionViewSet,
    DayOpenViewSet, DayCloseViewSet
)

router = DefaultRouter()
router.register(r'sales', SaleViewSet, basename='sale')
router.register(r'sale-items', SaleItemViewSet, basename='saleitem')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'pos-sessions', POSSessionViewSet, basename='possession')
router.register(r'day-opens', DayOpenViewSet, basename='dayopen')
router.register(r'day-closes', DayCloseViewSet, basename='dayclose')

urlpatterns = [
    path('', include(router.urls)),
]





