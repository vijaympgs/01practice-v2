from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    CurrentUserView,
    UpdateProfileView,
    ChangePasswordView,
    UserListView,
    UserDetailUpdateView,
    UserPermissionViewSet,
    BulkUserPermissionView,
    GetUserPermissionsView,
    ApplyRoleTemplateView,
    GetRoleTemplateView,
    GetRolePermissionsView,
    BulkRolePermissionView,
    ApplyRoleTemplateToRoleView,
    ExportRolePermissionsExcelView,
    ImportRolePermissionsExcelView,
    UserPOSPermissionsView,
)
try:
    from .views import POSFunctionViewSet, RolePOSFunctionMappingViewSet
except ImportError:
    POSFunctionViewSet = None
    RolePOSFunctionMappingViewSet = None

app_name = 'users'

# Router for ViewSets
router = DefaultRouter()
router.register(r'permissions', UserPermissionViewSet, basename='user-permission')

# Register POS Function viewsets if available
if POSFunctionViewSet:
    router.register(r'pos-functions', POSFunctionViewSet, basename='pos-function')
if RolePOSFunctionMappingViewSet:
    router.register(r'role-pos-function-mappings', RolePOSFunctionMappingViewSet, basename='role-pos-function-mapping')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<uuid:pk>/', UserDetailUpdateView.as_view(), name='user-detail-update'),
    
    # Permission routes
    path('users/<uuid:user_pk>/permissions/', GetUserPermissionsView.as_view(), name='get-user-permissions'),
    path('permissions/bulk/', BulkUserPermissionView.as_view(), name='bulk-permissions'),
    path('permissions/apply-template/', ApplyRoleTemplateView.as_view(), name='apply-role-template'),
    path('permissions/template/<str:role_template>/', GetRoleTemplateView.as_view(), name='get-role-template'),
    path('permissions/my/', GetUserPermissionsView.as_view(), name='my-permissions'),
    
    # Role-based permissions (for role matrix)
    path('roles/<str:role_key>/permissions/', GetRolePermissionsView.as_view(), name='get-role-permissions'),
    path('roles/permissions/bulk/', BulkRolePermissionView.as_view(), name='bulk-role-permissions'),
    path('roles/apply-template/', ApplyRoleTemplateToRoleView.as_view(), name='apply-role-template-to-role'),
    
    # Excel export/import
    path('roles/permissions/export-excel/', ExportRolePermissionsExcelView.as_view(), name='export-role-permissions-excel'),
    path('roles/permissions/import-excel/', ImportRolePermissionsExcelView.as_view(), name='import-role-permissions-excel'),
    
    # POS Function Permissions
    path('pos-permissions/', UserPOSPermissionsView.as_view(), name='user-pos-permissions'),
    
    # Include router URLs
    path('', include(router.urls)),
]
