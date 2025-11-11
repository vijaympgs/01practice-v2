from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Customer
from .serializers import (
    CustomerListSerializer,
    CustomerDetailSerializer,
    CustomerCreateSerializer,
    CustomerUpdateSerializer,
    CustomerStatsSerializer,
    CustomerSearchSerializer,
    CustomerHistorySerializer,
    CustomerBulkUpdateSerializer
)


class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing customers with full CRUD operations.
    """
    queryset = Customer.objects.all()
    permission_classes = [IsAuthenticated] if not settings.DEBUG else []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Search fields
    search_fields = [
        'first_name', 'last_name', 'company_name', 'customer_code',
        'email', 'phone', 'mobile'
    ]
    
    # Filter fields
    filterset_fields = {
        'customer_type': ['exact', 'in'],
        'is_active': ['exact'],
        'is_vip': ['exact'],
        'allow_credit': ['exact'],
        'city': ['exact', 'icontains'],
        'state': ['exact', 'icontains'],
        'country': ['exact', 'icontains'],
        'created_at': ['gte', 'lte', 'exact'],
        'last_purchase_date': ['gte', 'lte', 'exact', 'isnull'],
    }
    
    # Ordering fields
    ordering_fields = [
        'first_name', 'last_name', 'company_name', 'customer_code',
        'customer_type', 'created_at', 'last_purchase_date'
    ]
    ordering = ['last_name', 'first_name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return CustomerListSerializer
        elif self.action == 'create':
            return CustomerCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CustomerUpdateSerializer
        elif self.action == 'search':
            return CustomerSearchSerializer
        return CustomerDetailSerializer
    
    def get_queryset(self):
        """Filter queryset based on query parameters."""
        queryset = Customer.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            if status_filter == 'active':
                queryset = queryset.filter(is_active=True)
            elif status_filter == 'inactive':
                queryset = queryset.filter(is_active=False)
            elif status_filter == 'vip':
                queryset = queryset.filter(is_vip=True)
            elif status_filter == 'new':
                # New customers (created in last 30 days with no purchases)
                thirty_days_ago = timezone.now() - timedelta(days=30)
                queryset = queryset.filter(
                    created_at__gte=thirty_days_ago,
                    last_purchase_date__isnull=True
                )
        
        # Filter by customer type
        customer_type = self.request.query_params.get('customer_type', None)
        if customer_type:
            queryset = queryset.filter(customer_type=customer_type)
        
        # Filter by credit status
        credit_filter = self.request.query_params.get('credit', None)
        if credit_filter == 'enabled':
            queryset = queryset.filter(allow_credit=True)
        elif credit_filter == 'disabled':
            queryset = queryset.filter(allow_credit=False)
        
        return queryset
    
    def perform_create(self, serializer):
        """Create customer with additional processing."""
        customer = serializer.save()
        
        # Log customer creation (can be enhanced with actual logging)
        print(f"New customer created: {customer.display_name} ({customer.customer_code})")
    
    def perform_update(self, serializer):
        """Update customer with additional processing."""
        customer = serializer.save()
        
        # Log customer update (can be enhanced with actual logging)
        print(f"Customer updated: {customer.display_name} ({customer.customer_code})")
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get customer statistics."""
        try:
            # Calculate statistics
            total_customers = Customer.objects.count()
            active_customers = Customer.objects.filter(is_active=True).count()
            inactive_customers = total_customers - active_customers
            
            # New customers this month
            first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            new_customers_this_month = Customer.objects.filter(
                created_at__gte=first_day_of_month
            ).count()
            
            # Customer type breakdown
            vip_customers = Customer.objects.filter(is_vip=True).count()
            business_customers = Customer.objects.filter(customer_type='business').count()
            individual_customers = Customer.objects.filter(customer_type='individual').count()
            
            # Credit information
            customers_with_credit = Customer.objects.filter(allow_credit=True).count()
            total_credit_limit = Customer.objects.filter(
                allow_credit=True
            ).aggregate(
                total=Sum('credit_limit')
            )['total'] or 0
            
            # Average discount
            avg_discount = Customer.objects.aggregate(
                avg=Avg('discount_percentage')
            )['avg'] or 0
            
            stats_data = {
                'total_customers': total_customers,
                'active_customers': active_customers,
                'inactive_customers': inactive_customers,
                'new_customers_this_month': new_customers_this_month,
                'vip_customers': vip_customers,
                'business_customers': business_customers,
                'individual_customers': individual_customers,
                'customers_with_credit': customers_with_credit,
                'total_credit_limit': total_credit_limit,
                'average_discount_percentage': round(avg_discount, 2)
            }
            
            serializer = CustomerStatsSerializer(stats_data)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': f'Error calculating customer statistics: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced customer search."""
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {'error': 'Search query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Perform search across multiple fields
        customers = Customer.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(company_name__icontains=query) |
            Q(customer_code__icontains=query) |
            Q(email__icontains=query) |
            Q(phone__icontains=query) |
            Q(mobile__icontains=query)
        ).filter(is_active=True)[:20]  # Limit to 20 results
        
        serializer = CustomerSearchSerializer(customers, many=True)
        return Response({
            'count': customers.count(),
            'results': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get customer purchase history."""
        customer = self.get_object()
        
        # This will be enhanced when Sales module is implemented
        history_data = {
            'customer_id': customer.id,
            'total_purchases': customer.get_total_purchases(),
            'purchase_count': customer.get_purchase_count(),
            'average_purchase_amount': customer.get_average_purchase_amount(),
            'last_purchase_date': customer.get_last_purchase_date(),
            'first_purchase_date': None,  # Will be implemented with Sales
            'favorite_products': [],  # Will be implemented with Sales
            'purchase_frequency': 'new' if customer.is_new_customer() else 'unknown'
        }
        
        serializer = CustomerHistorySerializer(history_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update multiple customers."""
        serializer = CustomerBulkUpdateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        customer_ids = serializer.validated_data['customer_ids']
        updates = serializer.validated_data['updates']
        
        try:
            # Get customers to update
            customers = Customer.objects.filter(id__in=customer_ids)
            
            if customers.count() != len(customer_ids):
                return Response(
                    {'error': 'Some customer IDs were not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Apply updates
            updated_count = customers.update(**updates)
            
            return Response({
                'message': f'Successfully updated {updated_count} customers',
                'updated_count': updated_count,
                'updates_applied': updates
            })
            
        except Exception as e:
            return Response(
                {'error': f'Error during bulk update: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export customers data (placeholder for future implementation)."""
        # This can be enhanced to export to CSV, Excel, etc.
        customers = self.filter_queryset(self.get_queryset())
        serializer = CustomerListSerializer(customers, many=True)
        
        return Response({
            'message': 'Export functionality will be implemented in future version',
            'count': customers.count(),
            'sample_data': serializer.data[:5]  # Return first 5 as sample
        })
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a customer."""
        customer = self.get_object()
        customer.is_active = True
        customer.save()
        
        serializer = self.get_serializer(customer)
        return Response({
            'message': f'Customer {customer.display_name} has been activated',
            'customer': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a customer."""
        customer = self.get_object()
        customer.is_active = False
        customer.save()
        
        serializer = self.get_serializer(customer)
        return Response({
            'message': f'Customer {customer.display_name} has been deactivated',
            'customer': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def toggle_vip(self, request, pk=None):
        """Toggle VIP status for a customer."""
        customer = self.get_object()
        customer.is_vip = not customer.is_vip
        
        # Auto-set customer type to VIP if making VIP
        if customer.is_vip and customer.customer_type not in ['business', 'wholesale']:
            customer.customer_type = 'vip'
        
        customer.save()
        
        serializer = self.get_serializer(customer)
        vip_status = 'granted' if customer.is_vip else 'removed'
        
        return Response({
            'message': f'VIP status {vip_status} for {customer.display_name}',
            'customer': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recently created customers."""
        days = int(request.query_params.get('days', 7))
        since_date = timezone.now() - timedelta(days=days)
        
        recent_customers = Customer.objects.filter(
            created_at__gte=since_date
        ).order_by('-created_at')
        
        serializer = CustomerListSerializer(recent_customers, many=True)
        return Response({
            'count': recent_customers.count(),
            'days': days,
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def birthdays(self, request):
        """Get customers with birthdays this month."""
        current_month = timezone.now().month
        
        birthday_customers = Customer.objects.filter(
            date_of_birth__month=current_month,
            is_active=True
        ).order_by('date_of_birth__day')
        
        serializer = CustomerListSerializer(birthday_customers, many=True)
        return Response({
            'count': birthday_customers.count(),
            'month': current_month,
            'results': serializer.data
        })




