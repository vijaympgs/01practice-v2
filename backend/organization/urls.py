from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, LocationViewSet, OperatingHoursViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'operating-hours', OperatingHoursViewSet)

urlpatterns = [
    path('', include(router.urls)),
]



