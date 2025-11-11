from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Supplier
from .serializers import (
    SupplierListSerializer,
    SupplierDetailSerializer,
    SupplierCreateSerializer,
    SupplierUpdateSerializer,
    SupplierStatsSerializer,
    SupplierSearchSerializer,
    SupplierPerformanceSerializer,
    SupplierBulkUpdateSerializer,
    SupplierContactSerializer
)


class SupplierViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing suppliers with full CRUD operations.
    """
    queryset = Supplier.objects.all()
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Search fields
    search_fields = [
        'company_name', 'trade_name', 'supplier_code', 'contact_person',
        'email', 'phone', 'mobile'
    ]
    
    # Filter fields
    filterset_fields = {
        'supplier_type': ['exact', 'in'],
        'is_active': ['exact'],
        'is_preferred': ['exact'],
        'is_verified': ['exact'],
        'payment_terms': ['exact', 'in'],
        'city': ['exact', 'icontains'],
        'state': ['exact', 'icontains'],
        'country': ['exact', 'icontains'],
        'created_at': ['gte', 'lte', 'exact'],
        'last_order_date': ['gte', 'lte', 'exact', 'isnull'],
        'lead_time_days': ['gte', 'lte', 'exact'],
    }
    
    # Ordering fields
    ordering_fields = [
        'company_name', 'supplier_code', 'supplier_type', 'contact_person',
        'created_at', 'last_order_date', 'lead_time_days', 'credit_limit'
    ]
    ordering = ['company_name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return SupplierListSerializer
        elif self.action == 'create':
            return SupplierCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return SupplierUpdateSerializer
        elif self.action == 'search':
            return SupplierSearchSerializer
        elif self.action == 'contacts':
            return SupplierContactSerializer
        return SupplierDetailSerializer
    
    def get_queryset(self):
        """Filter queryset based on query parameters."""
        queryset = Supplier.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            if status_filter == 'active':
                queryset = queryset.filter(is_active=True)
            elif status_filter == 'inactive':
                queryset = queryset.filter(is_active=False)
            elif status_filter == 'preferred':
                queryset = queryset.filter(is_preferred=True)
            elif status_filter == 'verified':
                queryset = queryset.filter(is_verified=True)
            elif status_filter == 'unverified':
                queryset = queryset.filter(is_verified=False)
            elif status_filter == 'new':
                # New suppliers (created in last 30 days with no orders)
                thirty_days_ago = timezone.now() - timedelta(days=30)
                queryset = queryset.filter(
                    created_at__gte=thirty_days_ago,
                    last_order_date__isnull=True
                )
        
        # Filter by supplier type
        supplier_type = self.request.query_params.get('supplier_type', None)
        if supplier_type:
            queryset = queryset.filter(supplier_type=supplier_type)
        
        # Filter by payment terms
        payment_terms = self.request.query_params.get('payment_terms', None)
        if payment_terms:
            queryset = queryset.filter(payment_terms=payment_terms)
        
        return queryset
    
    def perform_create(self, serializer):
        """Create supplier with additional processing."""
        supplier = serializer.save()
        
        # Log supplier creation (can be enhanced with actual logging)
        print(f"New supplier created: {supplier.display_name} ({supplier.supplier_code})")
    
    def perform_update(self, serializer):
        """Update supplier with additional processing."""
        supplier = serializer.save()
        
        # Log supplier update (can be enhanced with actual logging)
        print(f"Supplier updated: {supplier.display_name} ({supplier.supplier_code})")
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get supplier statistics."""
        try:
            # Calculate statistics
            total_suppliers = Supplier.objects.count()
            active_suppliers = Supplier.objects.filter(is_active=True).count()
            inactive_suppliers = total_suppliers - active_suppliers
            preferred_suppliers = Supplier.objects.filter(is_preferred=True).count()
            verified_suppliers = Supplier.objects.filter(is_verified=True).count()
            unverified_suppliers = total_suppliers - verified_suppliers
            
            # New suppliers this month
            first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            new_suppliers_this_month = Supplier.objects.filter(
                created_at__gte=first_day_of_month
            ).count()
            
            # Suppliers by type
            suppliers_by_type = dict(
                Supplier.objects.values_list('supplier_type').annotate(
                    count=Count('id')
                )
            )
            
            # Performance metrics
            avg_lead_time = Supplier.objects.aggregate(
                avg=Avg('lead_time_days')
            )['avg'] or 0
            
            total_credit_limit = Supplier.objects.aggregate(
                total=Sum('credit_limit')
            )['total'] or 0
            
            avg_discount = Supplier.objects.aggregate(
                avg=Avg('discount_percentage')
            )['avg'] or 0
            
            stats_data = {
                'total_suppliers': total_suppliers,
                'active_suppliers': active_suppliers,
                'inactive_suppliers': inactive_suppliers,
                'preferred_suppliers': preferred_suppliers,
                'verified_suppliers': verified_suppliers,
                'unverified_suppliers': unverified_suppliers,
                'new_suppliers_this_month': new_suppliers_this_month,
                'suppliers_by_type': suppliers_by_type,
                'average_lead_time': round(avg_lead_time, 1),
                'total_credit_limit': total_credit_limit,
                'average_discount_percentage': round(avg_discount, 2)
            }
            
            serializer = SupplierStatsSerializer(stats_data)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': f'Error calculating supplier statistics: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced supplier search."""
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {'error': 'Search query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Perform search across multiple fields
        suppliers = Supplier.objects.filter(
            Q(company_name__icontains=query) |
            Q(trade_name__icontains=query) |
            Q(supplier_code__icontains=query) |
            Q(contact_person__icontains=query) |
            Q(email__icontains=query) |
            Q(phone__icontains=query) |
            Q(mobile__icontains=query)
        ).filter(is_active=True)[:20]  # Limit to 20 results
        
        serializer = SupplierSearchSerializer(suppliers, many=True)
        return Response({
            'count': suppliers.count(),
            'results': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def performance(self, request, pk=None):
        """Get supplier performance metrics."""
        supplier = self.get_object()
        
        # This will be enhanced when Purchase Orders module is implemented
        performance_data = {
            'supplier_id': supplier.id,
            'total_orders': supplier.get_total_orders(),
            'order_count': supplier.get_order_count(),
            'average_order_amount': 0.00,  # Will be calculated with actual orders
            'last_order_date': supplier.last_order_date,
            'first_order_date': None,  # Will be implemented with Purchase Orders
            'on_time_delivery_rate': 95.0,  # Placeholder
            'quality_rating': 4.5,  # Placeholder
            'order_frequency': 'new' if supplier.get_order_count() == 0 else 'unknown'
        }
        
        serializer = SupplierPerformanceSerializer(performance_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update multiple suppliers."""
        serializer = SupplierBulkUpdateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        supplier_ids = serializer.validated_data['supplier_ids']
        updates = serializer.validated_data['updates']
        
        try:
            # Get suppliers to update
            suppliers = Supplier.objects.filter(id__in=supplier_ids)
            
            if suppliers.count() != len(supplier_ids):
                return Response(
                    {'error': 'Some supplier IDs were not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Apply updates
            updated_count = suppliers.update(**updates)
            
            return Response({
                'message': f'Successfully updated {updated_count} suppliers',
                'updated_count': updated_count,
                'updates_applied': updates
            })
            
        except Exception as e:
            return Response(
                {'error': f'Error during bulk update: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def contacts(self, request):
        """Get supplier contact information only."""
        suppliers = self.filter_queryset(self.get_queryset())
        serializer = SupplierContactSerializer(suppliers, many=True)
        
        return Response({
            'count': suppliers.count(),
            'results': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a supplier."""
        supplier = self.get_object()
        supplier.is_active = True
        supplier.save()
        
        serializer = self.get_serializer(supplier)
        return Response({
            'message': f'Supplier {supplier.display_name} has been activated',
            'supplier': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a supplier."""
        supplier = self.get_object()
        supplier.is_active = False
        supplier.save()
        
        serializer = self.get_serializer(supplier)
        return Response({
            'message': f'Supplier {supplier.display_name} has been deactivated',
            'supplier': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def toggle_preferred(self, request, pk=None):
        """Toggle preferred status for a supplier."""
        supplier = self.get_object()
        supplier.is_preferred = not supplier.is_preferred
        supplier.save()
        
        serializer = self.get_serializer(supplier)
        preferred_status = 'granted' if supplier.is_preferred else 'removed'
        
        return Response({
            'message': f'Preferred status {preferred_status} for {supplier.display_name}',
            'supplier': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def toggle_verified(self, request, pk=None):
        """Toggle verified status for a supplier."""
        supplier = self.get_object()
        supplier.is_verified = not supplier.is_verified
        supplier.save()
        
        serializer = self.get_serializer(supplier)
        verified_status = 'verified' if supplier.is_verified else 'unverified'
        
        return Response({
            'message': f'Supplier {supplier.display_name} is now {verified_status}',
            'supplier': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recently created suppliers."""
        days = int(request.query_params.get('days', 7))
        since_date = timezone.now() - timedelta(days=days)
        
        recent_suppliers = Supplier.objects.filter(
            created_at__gte=since_date
        ).order_by('-created_at')
        
        serializer = SupplierListSerializer(recent_suppliers, many=True)
        return Response({
            'count': recent_suppliers.count(),
            'days': days,
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def preferred(self, request):
        """Get preferred suppliers only."""
        preferred_suppliers = Supplier.objects.filter(
            is_preferred=True,
            is_active=True
        ).order_by('company_name')
        
        serializer = SupplierListSerializer(preferred_suppliers, many=True)
        return Response({
            'count': preferred_suppliers.count(),
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get suppliers grouped by type."""
        supplier_type = request.query_params.get('type', None)
        
        if not supplier_type:
            return Response(
                {'error': 'Supplier type parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        suppliers = Supplier.objects.filter(
            supplier_type=supplier_type,
            is_active=True
        ).order_by('company_name')
        
        serializer = SupplierListSerializer(suppliers, many=True)
        return Response({
            'type': supplier_type,
            'count': suppliers.count(),
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export suppliers data (placeholder for future implementation)."""
        # This can be enhanced to export to CSV, Excel, etc.
        suppliers = self.filter_queryset(self.get_queryset())
        serializer = SupplierListSerializer(suppliers, many=True)
        
        return Response({
            'message': 'Export functionality will be implemented in future version',
            'count': suppliers.count(),
            'sample_data': serializer.data[:5]  # Return first 5 as sample
        })




