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
    ItemCategoryListCreateView,
    ItemCategoryDetailView,
    ItemSubCategoryListCreateView,
    ItemSubCategoryDetailView,
    ItemSubCategoriesByCategoryView
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
    
    # Item Category URLs
    path('itemcategories/', ItemCategoryListCreateView.as_view(), name='itemcategory-list-create'),
    path('itemcategories/<uuid:pk>/', ItemCategoryDetailView.as_view(), name='itemcategory-detail'),
    
    # Item SubCategory URLs
    path('itemsubcategories/', ItemSubCategoryListCreateView.as_view(), name='itemsubcategory-list-create'),
    path('itemsubcategories/<uuid:pk>/', ItemSubCategoryDetailView.as_view(), name='itemsubcategory-detail'),
    path('itemsubcategories/by-category/<uuid:category_id>/', ItemSubCategoriesByCategoryView.as_view(), name='itemsubcategories-by-category'),
]
