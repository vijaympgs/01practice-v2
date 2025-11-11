from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import ProductClassification, ItemCategory, ItemSubCategory, Attribute, AttributeValue
from .serializers import (
    CategorySerializer,
    CategoryCreateSerializer,
    CategoryUpdateSerializer,
    CategoryTreeSerializer,
    CategoryListSerializer,
    AttributeSerializer,
    AttributeListSerializer,
    AttributeValueSerializer,
    ItemCategorySerializer,
    ItemSubCategorySerializer
)


class CategoryListCreateView(generics.ListCreateAPIView):
    """
    List all categories or create a new category.
    
    GET: Returns a paginated list of categories
    POST: Creates a new category
    """
    
    queryset = ProductClassification.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else [] if not settings.DEBUG else []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'parent']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'sort_order', 'created_at']
    ordering = ['sort_order', 'name']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CategoryCreateSerializer
        return CategoryListSerializer
    
    def get_queryset(self):
        """Filter categories based on user permissions and query parameters."""
        queryset = ProductClassification.objects.all()
        
        # Filter by active status if specified
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by parent category
        parent_id = self.request.query_params.get('parent_id')
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        
        # Filter root categories (no parent)
        root_only = self.request.query_params.get('root_only')
        if root_only and root_only.lower() == 'true':
            queryset = queryset.filter(parent__isnull=True)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Create a new category with proper response."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        
        # Return full category details
        response_serializer = CategorySerializer(category)
        return Response(
            {
                'message': 'Category created successfully',
                'category': response_serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a category.
    
    GET: Returns category details
    PUT/PATCH: Updates category
    DELETE: Deletes category (if safe to delete)
    """
    
    queryset = ProductClassification.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CategoryUpdateSerializer
        return CategorySerializer
    
    def destroy(self, request, *args, **kwargs):
        """Delete category with safety checks."""
        category = self.get_object()
        
        if not category.can_be_deleted():
            return Response(
                {
                    'error': 'Cannot delete category',
                    'message': 'Category has products or child categories. Please remove them first.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        category.delete()
        return Response(
            {'message': 'Category deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


class CategoryTreeView(APIView):
    """
    Get categories in hierarchical tree structure.
    
    GET: Returns categories organized in a tree structure
    """
    serializer_class = CategoryTreeSerializer
    
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    
    def get(self, request):
        """Return categories in tree structure."""
        # Get root categories (no parent)
        root_categories = ProductClassification.objects.filter(
            parent__isnull=True,
            is_active=True
        ).order_by('sort_order', 'name')
        
        serializer = CategoryTreeSerializer(root_categories, many=True)
        return Response({
            'categories': serializer.data,
            'total': root_categories.count()
        })


class CategorySearchView(APIView):
    """
    Search categories with advanced filtering.
    
    GET: Returns filtered categories based on search criteria
    """
    serializer_class = CategoryListSerializer
    
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    
    def get(self, request):
        """Search categories with various filters."""
        query = request.query_params.get('q', '')
        is_active = request.query_params.get('is_active')
        parent_id = request.query_params.get('parent_id')
        level = request.query_params.get('level')
        
        queryset = ProductClassification.objects.all()
        
        # Text search
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query)
            )
        
        # Filter by active status
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by parent
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        
        # Filter by level (depth in hierarchy)
        if level is not None:
            try:
                level = int(level)
                if level == 0:
                    queryset = queryset.filter(parent__isnull=True)
                else:
                    # This is a simplified approach - in a real app you might want to use a more efficient method
                    queryset = queryset.filter(parent__isnull=False)
            except ValueError:
                pass
        
        # Order results
        queryset = queryset.order_by('sort_order', 'name')
        
        serializer = CategoryListSerializer(queryset, many=True)
        return Response({
            'categories': serializer.data,
            'total': queryset.count(),
            'query': query
        })


class CategoryBulkUpdateView(APIView):
    """
    Bulk update categories (activate/deactivate, reorder).
    
    POST: Bulk update multiple categories
    """
    serializer_class = CategoryUpdateSerializer
    
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    
    def post(self, request):
        """Bulk update categories."""
        action = request.data.get('action')
        category_ids = request.data.get('category_ids', [])
        
        if not action or not category_ids:
            return Response(
                {'error': 'Action and category_ids are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        categories = ProductClassification.objects.filter(id__in=category_ids)
        
        if action == 'activate':
            categories.update(is_active=True)
            message = f'{categories.count()} categories activated'
        elif action == 'deactivate':
            categories.update(is_active=False)
            message = f'{categories.count()} categories deactivated'
        elif action == 'reorder':
            sort_orders = request.data.get('sort_orders', {})
            for category in categories:
                if str(category.id) in sort_orders:
                    category.sort_order = sort_orders[str(category.id)]
                    category.save()
            message = f'{categories.count()} categories reordered'
        else:
            return Response(
                {'error': 'Invalid action. Use: activate, deactivate, or reorder'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'message': message,
            'updated_count': categories.count()
        })


class CategoryStatsView(APIView):
    """
    Get category statistics.
    
    GET: Returns category statistics and counts
    """
    serializer_class = CategoryListSerializer
    
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    
    def get(self, request):
        """Return category statistics."""
        total_categories = ProductClassification.objects.count()
        active_categories = ProductClassification.objects.filter(is_active=True).count()
        inactive_categories = total_categories - active_categories
        root_categories = ProductClassification.objects.filter(parent__isnull=True).count()
        
        # Categories with products (when products are implemented)
        categories_with_products = 0  # Will be updated when products are implemented
        
        return Response({
            'total_categories': total_categories,
            'active_categories': active_categories,
            'inactive_categories': inactive_categories,
            'root_categories': root_categories,
            'categories_with_products': categories_with_products
        })


class AttributeListCreateView(generics.ListCreateAPIView):
    """
    List all attributes or create a new attribute.
    
    GET: Returns a paginated list of attributes
    POST: Creates a new attribute
    """
    
    queryset = Attribute.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'data_type']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'sort_order', 'created_at']
    ordering = ['sort_order', 'name']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AttributeSerializer
        return AttributeListSerializer


class AttributeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an attribute.
    
    GET: Returns attribute details
    PUT/PATCH: Updates attribute
    DELETE: Deletes attribute
    """
    
    queryset = Attribute.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    serializer_class = AttributeSerializer


class AttributeValueListCreateView(generics.ListCreateAPIView):
    """
    List all attribute values or create a new attribute value.
    
    GET: Returns a paginated list of attribute values
    POST: Creates a new attribute value
    """
    
    queryset = AttributeValue.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'attribute']
    search_fields = ['value', 'description']
    ordering_fields = ['value', 'sort_order', 'created_at']
    ordering = ['sort_order', 'value']
    
    def get_serializer_class(self):
        return AttributeValueSerializer
    
    def get_queryset(self):
        """Filter attribute values based on query parameters."""
        queryset = AttributeValue.objects.all()
        
        # Filter by attribute if specified
        attribute_id = self.request.query_params.get('attribute_id')
        if attribute_id:
            queryset = queryset.filter(attribute_id=attribute_id)
        
        return queryset


class AttributeValueDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an attribute value.
    
    GET: Returns attribute value details
    PUT/PATCH: Updates attribute value
    DELETE: Deletes attribute value
    """
    
    queryset = AttributeValue.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    serializer_class = AttributeValueSerializer


class AttributeValuesByAttributeView(APIView):
    """
    Get all values for a specific attribute.
    
    GET: Returns all values for an attribute
    """
    
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    
    def get(self, request, attribute_id):
        """Return all values for a specific attribute."""
        try:
            attribute = Attribute.objects.get(id=attribute_id)
            values = AttributeValue.objects.filter(
                attribute=attribute,
                is_active=True
            ).order_by('sort_order', 'value')
            
            serializer = AttributeValueSerializer(values, many=True)
            return Response({
                'attribute': attribute.name,
                'values': serializer.data,
                'total': values.count()
            })
        except Attribute.DoesNotExist:
            return Response(
                {'error': 'Attribute not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ItemCategoryListCreateView(generics.ListCreateAPIView):
    """
    List all item categories or create a new item category.
    
    GET: Returns a list of item categories
    POST: Creates a new item category
    """
    
    queryset = ItemCategory.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description', 'code']
    ordering_fields = ['name', 'sort_order', 'created_at']
    ordering = ['sort_order', 'name']
    
    def get_serializer_class(self):
        return ItemCategorySerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new item category with proper response."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        
        # Return full category details
        response_serializer = ItemCategorySerializer(category)
        return Response(
            {
                'message': 'Item category created successfully',
                'category': response_serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class ItemCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an item category.
    
    GET: Returns item category details
    PUT/PATCH: Updates item category
    DELETE: Deletes item category
    """
    
    queryset = ItemCategory.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    serializer_class = ItemCategorySerializer


class ItemSubCategoryListCreateView(generics.ListCreateAPIView):
    """
    List all item subcategories or create a new item subcategory.
    
    GET: Returns a list of item subcategories
    POST: Creates a new item subcategory
    """
    
    queryset = ItemSubCategory.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'category']
    search_fields = ['name', 'description', 'code']
    ordering_fields = ['name', 'sort_order', 'created_at']
    ordering = ['sort_order', 'name']
    
    def get_serializer_class(self):
        return ItemSubCategorySerializer
    
    def get_queryset(self):
        """Filter subcategories based on query parameters."""
        queryset = ItemSubCategory.objects.all()
        
        # Filter by category if specified
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by active status if specified
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Create a new item subcategory with proper response."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subcategory = serializer.save()
        
        # Return full subcategory details
        response_serializer = ItemSubCategorySerializer(subcategory)
        return Response(
            {
                'message': 'Item subcategory created successfully',
                'subcategory': response_serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class ItemSubCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an item subcategory.
    
    GET: Returns item subcategory details
    PUT/PATCH: Updates item subcategory
    DELETE: Deletes item subcategory
    """
    
    queryset = ItemSubCategory.objects.all()
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    serializer_class = ItemSubCategorySerializer


class ItemSubCategoriesByCategoryView(APIView):
    """
    Get all subcategories for a specific item category.
    
    GET: Returns all subcategories for an item category
    """
    
    permission_classes = [permissions.IsAuthenticated] if not settings.DEBUG else []
    
    def get(self, request, category_id):
        """Return all subcategories for a specific item category."""
        try:
            category = ItemCategory.objects.get(id=category_id)
            subcategories = ItemSubCategory.objects.filter(
                category=category,
                is_active=True
            ).order_by('sort_order', 'name')
            
            serializer = ItemSubCategorySerializer(subcategories, many=True)
            return Response({
                'category': category.name,
                'subcategories': serializer.data,
                'total': subcategories.count()
            })
        except ItemCategory.DoesNotExist:
            return Response(
                {'error': 'Item category not found'},
                status=status.HTTP_404_NOT_FOUND
            )
