from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessRuleViewSet, SettlementSettingsViewSet

router = DefaultRouter()
router.register(r'rules', BusinessRuleViewSet)
router.register(r'settlement-settings', SettlementSettingsViewSet, basename='settlement-settings')

urlpatterns = [
    path('', include(router.urls)),
]
