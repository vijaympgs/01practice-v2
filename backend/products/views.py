from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum, Avg, F
from django.db import transaction
from .models import Product, UOM, UOMConversion, ItemMaster, AdvancedItemMaster, ItemAttribute, ItemPackage, PackageComponent, SecondarySupplier, SupplierBarcode, AlternateItem, ItemComponent, ItemTaxDetail, ItemSpecification, ItemPriceHistory, Brand, Department, Division
from .serializers import (
    ProductSerializer, ProductCreateSerializer, ProductUpdateSerializer,
    ProductListSerializer, ProductStatsSerializer, UOMSerializer, UOMListSerializer,
    UOMConversionSerializer, UOMConversionListSerializer, ItemMasterSerializer, ItemMasterListSerializer,
    AdvancedItemMasterSerializer, AdvancedItemMasterListSerializer, BrandSerializer, DepartmentSerializer, DivisionSerializer
)
from categories.models import Category


class ProductListCreateView(generics.ListCreateAPIView):
    """
    List all products or create a new product.
    """
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_taxable', 'brand', 'model']
    search_fields = ['name', 'sku', 'barcode', 'description', 'brand', 'model']
    ordering_fields = ['name', 'sku', 'price', 'stock_quantity', 'created_at', 'updated_at']
    ordering = ['name']
    
    def get_queryset(self):
        """Get products queryset with optional filtering."""
        queryset = Product.objects.all()
        
        # Filter by stock status
        stock_status = self.request.query_params.get('stock_status', None)
        if stock_status:
            if stock_status == 'out_of_stock':
                queryset = queryset.filter(stock_quantity__lte=0)
            elif stock_status == 'low_stock':
                queryset = queryset.filter(stock_quantity__lte=F('minimum_stock'))
            elif stock_status == 'in_stock':
                queryset = queryset.filter(stock_quantity__gt=0)
            elif stock_status == 'overstocked':
                queryset = queryset.filter(
                    stock_quantity__gte=F('maximum_stock'),
                    maximum_stock__isnull=False
                )
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by stock range
        min_stock = self.request.query_params.get('min_stock', None)
        max_stock = self.request.query_params.get('max_stock', None)
        if min_stock:
            queryset = queryset.filter(stock_quantity__gte=min_stock)
        if max_stock:
            queryset = queryset.filter(stock_quantity__lte=max_stock)
        
        return queryset
    
    def get_serializer_class(self):
        """Return appropriate serializer based on request method."""
        if self.request.method == 'POST':
            return ProductCreateSerializer
        return ProductListSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new product."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    product = serializer.save()
                    response_serializer = ProductSerializer(product)
                    return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'error': 'Failed to create product',
                    'details': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a product.
    """
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Product.objects.all()
    
    def get_serializer_class(self):
        """Return appropriate serializer based on request method."""
        if self.request.method in ['PUT', 'PATCH']:
            return ProductUpdateSerializer
        return ProductSerializer
    
    def update(self, request, *args, **kwargs):
        """Update a product."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    product = serializer.save()
                    response_serializer = ProductSerializer(product)
                    return Response(response_serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({
                    'error': 'Failed to update product',
                    'details': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Delete a product."""
        instance = self.get_object()
        
        # Check if product can be deleted
        if instance.stock_quantity > 0:
            return Response({
                'error': 'Cannot delete product with stock. Please set stock to 0 first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                instance.delete()
                return Response({
                    'message': 'Product deleted successfully'
                }, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                'error': 'Failed to delete product',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated] if not settings.DEBUG else [])
def product_stats(request):
    """
    Get product statistics.
    """
    try:
        # Basic counts
        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        inactive_products = Product.objects.filter(is_active=False).count()
        
        # Stock status counts
        out_of_stock_products = Product.objects.filter(stock_quantity__lte=0).count()
        low_stock_products = Product.objects.filter(
            stock_quantity__lte=F('minimum_stock'),
            stock_quantity__gt=0
        ).count()
        overstocked_products = Product.objects.filter(
            stock_quantity__gte=F('maximum_stock'),
            maximum_stock__isnull=False
        ).count()
        
        # Financial calculations
        total_stock_value = Product.objects.aggregate(
            total=Sum(F('stock_quantity') * F('cost'))
        )['total'] or 0
        
        average_profit_margin = Product.objects.filter(
            cost__isnull=False,
            price__gt=0
        ).aggregate(
            avg_margin=Avg(
                (F('price') - F('cost')) / F('price') * 100
            )
        )['avg_margin'] or 0
        
        # Products by brand (since Product model doesn't have category)
        products_by_brand = Product.objects.values('brand').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Top selling products (placeholder - will be implemented with sales module)
        top_selling_products = Product.objects.filter(
            is_active=True
        ).order_by('-stock_quantity')[:10].values(
            'id', 'name', 'sku', 'price', 'stock_quantity'
        )
        
        # Low stock alerts
        low_stock_alerts = Product.objects.filter(
            stock_quantity__lte=F('minimum_stock'),
            is_active=True
        ).values(
            'id', 'name', 'sku', 'stock_quantity', 'minimum_stock'
        )
        
        stats = {
            'total_products': total_products,
            'active_products': active_products,
            'inactive_products': inactive_products,
            'out_of_stock_products': out_of_stock_products,
            'low_stock_products': low_stock_products,
            'overstocked_products': overstocked_products,
            'total_stock_value': total_stock_value,
            'average_profit_margin': average_profit_margin,
            'products_by_brand': list(products_by_brand),
            'top_selling_products': list(top_selling_products),
            'low_stock_alerts': list(low_stock_alerts)
        }
        
        serializer = ProductStatsSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to get product statistics',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated] if not settings.DEBUG else [])
def bulk_update_stock(request):
    """
    Bulk update stock quantities for multiple products.
    """
    try:
        updates = request.data.get('updates', [])
        if not updates:
            return Response({
                'error': 'No updates provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        updated_products = []
        errors = []
        
        with transaction.atomic():
            for update in updates:
                product_id = update.get('product_id')
                new_stock = update.get('stock_quantity')
                
                if not product_id or new_stock is None:
                    errors.append({
                        'product_id': product_id,
                        'error': 'Missing product_id or stock_quantity'
                    })
                    continue
                
                try:
                    product = Product.objects.get(id=product_id)
                    if new_stock < 0:
                        errors.append({
                            'product_id': product_id,
                            'error': 'Stock quantity cannot be negative'
                        })
                        continue
                    
                    product.stock_quantity = new_stock
                    product.save()
                    updated_products.append({
                        'id': product.id,
                        'name': product.name,
                        'sku': product.sku,
                        'stock_quantity': product.stock_quantity
                    })
                    
                except Product.DoesNotExist:
                    errors.append({
                        'product_id': product_id,
                        'error': 'Product not found'
                    })
                except Exception as e:
                    errors.append({
                        'product_id': product_id,
                        'error': str(e)
                    })
        
        return Response({
            'message': f'Updated {len(updated_products)} products',
            'updated_products': updated_products,
            'errors': errors
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to bulk update stock',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated] if not settings.DEBUG else [])
def search_products(request):
    """
    Search products with advanced filtering.
    """
    try:
        query = request.query_params.get('q', '')
        brand = request.query_params.get('brand', None)
        min_price = request.query_params.get('min_price', None)
        max_price = request.query_params.get('max_price', None)
        in_stock_only = request.query_params.get('in_stock_only', 'false').lower() == 'true'
        active_only = request.query_params.get('active_only', 'true').lower() == 'true'
        
        queryset = Product.objects.all()
        
        # Apply filters
        if active_only:
            queryset = queryset.filter(is_active=True)
        
        if in_stock_only:
            queryset = queryset.filter(stock_quantity__gt=0)
        
        if brand:
            queryset = queryset.filter(brand__icontains=brand)
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Apply search query
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(sku__icontains=query) |
                Q(barcode__icontains=query) |
                Q(description__icontains=query) |
                Q(brand__icontains=query) |
                Q(model__icontains=query)
            )
        
        # Limit results
        limit = int(request.query_params.get('limit', 50))
        queryset = queryset[:limit]
        
        serializer = ProductListSerializer(queryset, many=True)
        return Response({
            'products': serializer.data,
            'count': len(serializer.data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to search products',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated] if not settings.DEBUG else [])
def low_stock_products(request):
    """
    Get products with low stock.
    """
    try:
        threshold = int(request.query_params.get('threshold', 0))
        
        queryset = Product.objects.filter(
            stock_quantity__lte=F('minimum_stock') + threshold,
            is_active=True
        ).order_by('stock_quantity')
        
        serializer = ProductListSerializer(queryset, many=True)
        return Response({
            'products': serializer.data,
            'count': len(serializer.data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to get low stock products',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UOMListCreateView(generics.ListCreateAPIView):
    """List all UOMs or create a new UOM"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = UOM.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UOMListSerializer
        return UOMSerializer


class UOMDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a UOM instance"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = UOM.objects.all()
    serializer_class = UOMSerializer


class UOMConversionListCreateView(generics.ListCreateAPIView):
    """List all UOM Conversions or create a new UOM Conversion"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = UOMConversion.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UOMConversionListSerializer
        return UOMConversionSerializer


class UOMConversionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a UOM Conversion instance"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = UOMConversion.objects.all()
    serializer_class = UOMConversionSerializer


class ItemMasterListCreateView(generics.ListCreateAPIView):
    """List all Item Masters or create a new Item Master"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = ItemMaster.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ItemMasterListSerializer
        return ItemMasterSerializer


class ItemMasterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an Item Master instance"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = ItemMaster.objects.all()
    serializer_class = ItemMasterSerializer


class AdvancedItemMasterListCreateView(generics.ListCreateAPIView):
    """List all Advanced Item Masters or create a new Advanced Item Master"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = AdvancedItemMaster.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AdvancedItemMasterListSerializer
        return AdvancedItemMasterSerializer


class AdvancedItemMasterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an Advanced Item Master instance"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = AdvancedItemMaster.objects.all()
    serializer_class = AdvancedItemMasterSerializer


# Brand Views
class BrandListCreateView(generics.ListCreateAPIView):
    """List all brands or create a new brand"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']


class BrandDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a brand instance"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


# Department Views
class DepartmentListCreateView(generics.ListCreateAPIView):
    """List all departments or create a new department"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a department instance"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


# Division Views
class DivisionListCreateView(generics.ListCreateAPIView):
    """List all divisions or create a new division"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']


class DivisionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a division instance"""
    
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
