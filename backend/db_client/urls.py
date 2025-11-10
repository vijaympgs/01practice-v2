from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DatabaseClientViewSet

router = DefaultRouter()
router.register(r'client', DatabaseClientViewSet, basename='db-client')

urlpatterns = [
    path('', include(router.urls)),
]

