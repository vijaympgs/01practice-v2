from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    CategoryTreeView,
    CategorySearchView,
    CategoryBulkUpdateView,
    CategoryStatsView,
    AttributeListCreateView,
    AttributeDetailView,
    AttributeValueListCreateView,
    AttributeValueDetailView,
    AttributeValuesByAttributeView,
    ProductAttributeTemplateListCreateView,
    ProductAttributeTemplateDetailView
)

app_name = 'categories'

urlpatterns = [
    # Basic CRUD operations
    path('', CategoryListCreateView.as_view(), name='category-list-create'),
    path('<uuid:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # Specialized views
    path('tree/', CategoryTreeView.as_view(), name='category-tree'),
    path('search/', CategorySearchView.as_view(), name='category-search'),
    path('bulk-update/', CategoryBulkUpdateView.as_view(), name='category-bulk-update'),
    path('stats/', CategoryStatsView.as_view(), name='category-stats'),
    
    # Attribute URLs
    path('attributes/', AttributeListCreateView.as_view(), name='attribute-list-create'),
    path('attributes/<uuid:pk>/', AttributeDetailView.as_view(), name='attribute-detail'),
    path('attributes/<uuid:attribute_id>/values/', AttributeValuesByAttributeView.as_view(), name='attribute-values'),
    
    # Attribute Value URLs
    path('attribute-values/', AttributeValueListCreateView.as_view(), name='attribute-value-list-create'),
    path('attribute-values/<uuid:pk>/', AttributeValueDetailView.as_view(), name='attribute-value-detail'),

    # Product Attribute Template URLs
    path('templates/', ProductAttributeTemplateListCreateView.as_view(), name='template-list-create'),
    path('templates/<uuid:pk>/', ProductAttributeTemplateDetailView.as_view(), name='template-detail'),
]
