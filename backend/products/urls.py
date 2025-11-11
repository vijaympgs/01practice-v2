from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # Product CRUD operations
    path('', views.ProductListCreateView.as_view(), name='product-list-create'),
    path('<uuid:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    
    # Product statistics and analytics
    path('stats/', views.product_stats, name='product-stats'),
    
    # Product search and filtering
    path('search/', views.search_products, name='product-search'),
    path('low-stock/', views.low_stock_products, name='low-stock-products'),
    
    # Bulk operations
    path('bulk-update-stock/', views.bulk_update_stock, name='bulk-update-stock'),
    
    # UOM CRUD operations
    path('uom/', views.UOMListCreateView.as_view(), name='uom-list-create'),
    path('uom/<uuid:pk>/', views.UOMDetailView.as_view(), name='uom-detail'),
    
    # UOM Conversion CRUD operations
    path('uom-conversion/', views.UOMConversionListCreateView.as_view(), name='uom-conversion-list-create'),
    path('uom-conversion/<uuid:pk>/', views.UOMConversionDetailView.as_view(), name='uom-conversion-detail'),
    
    # Item Master CRUD operations
    path('item-master/', views.ItemMasterListCreateView.as_view(), name='item-master-list-create'),
    path('item-master/<uuid:pk>/', views.ItemMasterDetailView.as_view(), name='item-master-detail'),
    
    # Advanced Item Master CRUD operations
    path('advanced-item-master/', views.AdvancedItemMasterListCreateView.as_view(), name='advanced-item-master-list-create'),
    path('advanced-item-master/<uuid:pk>/', views.AdvancedItemMasterDetailView.as_view(), name='advanced-item-master-detail'),
    
    # Brand CRUD operations
    path('brands/', views.BrandListCreateView.as_view(), name='brand-list-create'),
    path('brands/<uuid:pk>/', views.BrandDetailView.as_view(), name='brand-detail'),
    
    # Department CRUD operations
    path('departments/', views.DepartmentListCreateView.as_view(), name='department-list-create'),
    path('departments/<uuid:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
    
    # Division CRUD operations
    path('divisions/', views.DivisionListCreateView.as_view(), name='division-list-create'),
    path('divisions/<uuid:pk>/', views.DivisionDetailView.as_view(), name='division-detail'),
]























