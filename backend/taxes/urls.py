from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaxTypeViewSet, TaxRateViewSet

router = DefaultRouter()
router.register(r'tax-types', TaxTypeViewSet)
router.register(r'tax-rates', TaxRateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]



