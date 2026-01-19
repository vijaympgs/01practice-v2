from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from .models import Item, ItemVariant, UOM, UOMConversion, Brand
from .serializers import (
    ItemSerializer, ItemVariantSerializer, UOMSerializer,
    UOMConversionSerializer, BrandSerializer
)

class UOMListCreateView(generics.ListCreateAPIView):
    """List all UOMs or create a new UOM"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = UOM.objects.all()
    serializer_class = UOMSerializer
    filterset_fields = ['company', 'is_active', 'is_stock_uom', 'is_purchase_uom', 'is_sales_uom']
    search_fields = ['code', 'description']

class UOMDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a UOM instance"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = UOM.objects.all()
    serializer_class = UOMSerializer

class UOMConversionListCreateView(generics.ListCreateAPIView):
    """List all UOM Conversions or create a new UOM Conversion"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = UOMConversion.objects.all()
    serializer_class = UOMConversionSerializer
    filterset_fields = ['company', 'from_uom', 'to_uom']

class UOMConversionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a UOM Conversion instance"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = UOMConversion.objects.all()
    serializer_class = UOMConversionSerializer

class BrandListCreateView(generics.ListCreateAPIView):
    """List all brands or create a new brand"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company', 'is_active']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']

class BrandDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a brand instance"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class ItemListCreateView(generics.ListCreateAPIView):
    """List all Items (Parent) or create a new Item"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company', 'status', 'item_type', 'brand', 'category']
    search_fields = ['item_name', 'item_code']
    ordering_fields = ['item_name', 'item_code', 'created_at']
    ordering = ['item_name']

class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an Item instance"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class ItemVariantListCreateView(generics.ListCreateAPIView):
    """List all Item Variants (SKUs) or create a new Variant"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = ItemVariant.objects.all()
    serializer_class = ItemVariantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company', 'item', 'is_active', 'sku_code']
    search_fields = ['variant_name', 'sku_code', 'barcode']
    ordering_fields = ['variant_name', 'sku_code']
    ordering = ['variant_name']

class ItemVariantDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an Item Variant instance"""
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    queryset = ItemVariant.objects.all()
    serializer_class = ItemVariantSerializer
