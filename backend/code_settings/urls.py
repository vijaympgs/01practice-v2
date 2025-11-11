from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CodeSettingViewSet, CodeSettingHistoryViewSet, CodeSettingTemplateViewSet, CodeSettingRuleViewSet

router = DefaultRouter()
router.register(r'settings', CodeSettingViewSet)
router.register(r'history', CodeSettingHistoryViewSet)
router.register(r'templates', CodeSettingTemplateViewSet)
router.register(r'rules', CodeSettingRuleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
