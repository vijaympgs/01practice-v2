from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayModeViewSet, PayModeSettingsViewSet

router = DefaultRouter()
router.register(r'modes', PayModeViewSet)
router.register(r'settings', PayModeSettingsViewSet, basename='paymode-settings')

urlpatterns = [
    path('', include(router.urls)),
]
