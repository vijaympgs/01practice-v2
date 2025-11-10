from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Country, State, City
from .serializers import (
    CountrySerializer, StateSerializer, CitySerializer,
    CountryListSerializer, StateListSerializer, CityListSerializer
)


class CountryViewSet(viewsets.ModelViewSet):
    """ViewSet for Country model"""
    
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'code']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return CountryListSerializer
        return CountrySerializer
    
    def perform_create(self, serializer):
        """Set created_by user"""
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        """Set updated_by user"""
        serializer.save(updated_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def states(self, request, pk=None):
        """Get all states for a country"""
        country = self.get_object()
        states = country.states.all()
        serializer = StateListSerializer(states, many=True)
        return Response(serializer.data)


class StateViewSet(viewsets.ModelViewSet):
    """ViewSet for State model"""
    
    queryset = State.objects.select_related('country').all()
    serializer_class = StateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'country']
    search_fields = ['name', 'code', 'country__name']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['country__name', 'name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return StateListSerializer
        return StateSerializer
    
    def perform_create(self, serializer):
        """Set created_by user"""
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        """Set updated_by user"""
        serializer.save(updated_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def cities(self, request, pk=None):
        """Get all cities for a state"""
        state = self.get_object()
        cities = state.cities.all()
        serializer = CityListSerializer(cities, many=True)
        return Response(serializer.data)


class CityViewSet(viewsets.ModelViewSet):
    """ViewSet for City model"""
    
    queryset = City.objects.select_related('state', 'country').all()
    serializer_class = CitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'state', 'country']
    search_fields = ['name', 'code', 'state__name', 'country__name']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['country__name', 'state__name', 'name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return CityListSerializer
        return CitySerializer
    
    def perform_create(self, serializer):
        """Set created_by user"""
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        """Set updated_by user"""
        serializer.save(updated_by=self.request.user)



