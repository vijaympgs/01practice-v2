from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # Item (Parent)
    path('items/', views.ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<uuid:pk>/', views.ItemDetailView.as_view(), name='item-detail'),
    
    # Item Variant (SKU)
    path('variants/', views.ItemVariantListCreateView.as_view(), name='variant-list-create'),
    path('variants/<uuid:pk>/', views.ItemVariantDetailView.as_view(), name='variant-detail'),
    
    # UOM
    path('uom/', views.UOMListCreateView.as_view(), name='uom-list-create'),
    path('uom/<uuid:pk>/', views.UOMDetailView.as_view(), name='uom-detail'),
    
    # UOM Conversion
    path('uom-conversion/', views.UOMConversionListCreateView.as_view(), name='uom-conversion-list-create'),
    path('uom-conversion/<uuid:pk>/', views.UOMConversionDetailView.as_view(), name='uom-conversion-detail'),

    # Brand
    path('brands/', views.BrandListCreateView.as_view(), name='brand-list-create'),
    path('brands/<uuid:pk>/', views.BrandDetailView.as_view(), name='brand-detail'),
]
