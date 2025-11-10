from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import POSProgramViewSet

router = DefaultRouter()
router.register(r'programs', POSProgramViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
