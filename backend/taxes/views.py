from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import TaxType, TaxRate
from .serializers import (
    TaxTypeSerializer, TaxRateSerializer, 
    TaxRateCreateSerializer, BulkTaxRateCreateSerializer
)

class TaxTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for managing tax types"""
    queryset = TaxType.objects.all()
    serializer_class = TaxTypeSerializer
    
    def get_queryset(self):
        queryset = TaxType.objects.all()
        country = self.request.query_params.get('country', None)
        if country:
            queryset = queryset.filter(country__icontains=country)
        return queryset.order_by('name')

class TaxRateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing tax rates"""
    queryset = TaxRate.objects.select_related('tax_type').all()
    serializer_class = TaxRateSerializer
    
    def get_queryset(self):
        queryset = TaxRate.objects.select_related('tax_type').all()
        tax_type = self.request.query_params.get('tax_type', None)
        country = self.request.query_params.get('country', None)
        
        if tax_type:
            queryset = queryset.filter(tax_type__id=tax_type)
        if country:
            queryset = queryset.filter(country__icontains=country)
            
        return queryset.order_by('tax_type__name', 'sort_order', 'name')
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Bulk create tax rates"""
        serializer = BulkTaxRateCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    result = serializer.save()
                    response_serializer = TaxRateSerializer(result['tax_rates'], many=True)
                    return Response({
                        'message': f"Successfully created {len(result['tax_rates'])} tax rates",
                        'data': response_serializer.data
                    }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'error': f'Failed to create tax rates: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Clear all tax rates"""
        try:
            with transaction.atomic():
                count = TaxRate.objects.count()
                TaxRate.objects.all().delete()
                return Response({
                    'message': f'Successfully deleted {count} tax rates'
                }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': f'Failed to clear tax rates: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)