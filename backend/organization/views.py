from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from django.conf import settings
from .models import Company, Location, OperatingHours
from .serializers import (
    CompanySerializer, CompanyListSerializer, CompanyDetailSerializer,
    LocationSerializer, LocationListSerializer, LocationDetailSerializer,
    OperatingHoursSerializer
)


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for Company model"""
    
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'currency', 'timezone', 'country']
    search_fields = ['name', 'code', 'description', 'city', 'state']
    ordering_fields = ['name', 'code', 'created_at', 'updated_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return CompanyListSerializer
        elif self.action == 'retrieve':
            return CompanyDetailSerializer
        return CompanySerializer
    
    def perform_create(self, serializer):
        """Set created_by user"""
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        """Set updated_by user"""
        serializer.save(updated_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def locations(self, request, pk=None):
        """Get all locations for a company"""
        company = self.get_object()
        locations = company.locations.all()
        serializer = LocationListSerializer(locations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active companies"""
        companies = Company.objects.filter(is_active=True)
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get company statistics"""
        total_companies = Company.objects.count()
        active_companies = Company.objects.filter(is_active=True).count()
        companies_with_locations = Company.objects.filter(locations__isnull=False).distinct().count()
        
        return Response({
            'total_companies': total_companies,
            'active_companies': active_companies,
            'inactive_companies': total_companies - active_companies,
            'companies_with_locations': companies_with_locations,
        })
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Get all active companies for public access (login form)"""
        try:
            # Get all active companies, ordered by name
            companies = Company.objects.filter(is_active=True).order_by('name')
            
            # Serialize with request context for logo URLs
            serializer = CompanyListSerializer(
                companies, 
                many=True, 
                context={'request': request}
            )
            
            return Response(serializer.data)
        except Exception as e:
            import traceback
            import logging
            
            logger = logging.getLogger(__name__)
            error_trace = traceback.format_exc()
            
            # Log full error for debugging
            logger.error(f"Error in companies/public endpoint: {e}")
            logger.error(error_trace)
            
            # Return user-friendly error message
            return Response(
                {
                    'error': 'Failed to load companies',
                    'detail': str(e) if settings.DEBUG else 'An error occurred while loading companies'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LocationViewSet(viewsets.ModelViewSet):
    """ViewSet for Location model"""
    
    queryset = Location.objects.select_related('company')
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'location_type', 'company', 'country']
    search_fields = ['name', 'code', 'description', 'city', 'state', 'manager']
    ordering_fields = ['name', 'code', 'created_at', 'updated_at']
    ordering = ['company', 'name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return LocationListSerializer
        elif self.action == 'retrieve':
            return LocationDetailSerializer
        return LocationSerializer
    
    def perform_create(self, serializer):
        """Set created_by user"""
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        """Set updated_by user"""
        serializer.save(updated_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def operating_hours(self, request, pk=None):
        """Get operating hours for a location"""
        location = self.get_object()
        hours = location.hours.all()
        serializer = OperatingHoursSerializer(hours, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def set_operating_hours(self, request, pk=None):
        """Set operating hours for a location"""
        location = self.get_object()
        hours_data = request.data.get('hours', [])
        
        # Clear existing hours
        location.hours.all().delete()
        
        # Create new hours
        for hour_data in hours_data:
            hour_data['location'] = location.id
            serializer = OperatingHoursSerializer(data=hour_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'Operating hours updated successfully'})
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get locations grouped by type"""
        location_type = request.query_params.get('type')
        if location_type:
            locations = Location.objects.filter(location_type=location_type)
        else:
            locations = Location.objects.all()
        
        serializer = self.get_serializer(locations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_company(self, request):
        """Get locations by company"""
        company_id = request.query_params.get('company')
        if company_id:
            locations = Location.objects.filter(company_id=company_id)
        else:
            locations = Location.objects.all()
        
        serializer = self.get_serializer(locations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get location statistics"""
        total_locations = Location.objects.count()
        active_locations = Location.objects.filter(is_active=True).count()
        
        # Count by type
        type_counts = {}
        for location_type, _ in Location.LOCATION_TYPE_CHOICES:
            type_counts[location_type] = Location.objects.filter(location_type=location_type).count()
        
        # Count by company
        company_counts = {}
        companies = Company.objects.all()
        for company in companies:
            company_counts[company.name] = company.locations.count()
        
        return Response({
            'total_locations': total_locations,
            'active_locations': active_locations,
            'inactive_locations': total_locations - active_locations,
            'by_type': type_counts,
            'by_company': company_counts,
        })


class OperatingHoursViewSet(viewsets.ModelViewSet):
    """ViewSet for OperatingHours model"""
    
    queryset = OperatingHours.objects.all()
    serializer_class = OperatingHoursSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['location', 'day', 'is_open']
    
    def perform_create(self, serializer):
        """Set created_by user"""
        serializer.save()
    
    def perform_update(self, serializer):
        """Set updated_by user"""
        serializer.save()