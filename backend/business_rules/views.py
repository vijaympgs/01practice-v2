from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import BusinessRule, BusinessRuleHistory, SettlementSettings, SettlementSettingDefinition
from .serializers import (
    BusinessRuleSerializer, 
    BusinessRuleUpdateSerializer, 
    BusinessRuleHistorySerializer,
    SettlementSettingsSerializer,
    SettlementSettingDefinitionSerializer
)

class BusinessRuleViewSet(viewsets.ModelViewSet):
    queryset = BusinessRule.objects.all()
    serializer_class = BusinessRuleSerializer
    
    def get_serializer_class(self):
        if self.action == 'update':
            return BusinessRuleUpdateSerializer
        return BusinessRuleSerializer
    
    def get_queryset(self):
        queryset = BusinessRule.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by('sequence', 'name')
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_value = instance.current_value
        
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            # Update the rule
            self.perform_update(serializer)
            
            # Create history entry
            BusinessRuleHistory.objects.create(
                business_rule=instance,
                old_value=old_value,
                new_value=instance.current_value,
                changed_by=request.user,
                reason=request.data.get('reason', '')
            )
        
        return Response(BusinessRuleSerializer(instance).data)
    
    @action(detail=True, methods=['post'])
    def reset_to_default(self, request, pk=None):
        """Reset a business rule to its default value"""
        rule = self.get_object()
        old_value = rule.current_value
        
        with transaction.atomic():
            rule.reset_to_default()
            
            # Create history entry
            BusinessRuleHistory.objects.create(
                business_rule=rule,
                old_value=old_value,
                new_value=rule.current_value,
                changed_by=request.user,
                reason='Reset to default value'
            )
        
        return Response({'message': 'Rule reset to default value'})
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all available categories"""
        categories = BusinessRule.CATEGORIES
        return Response([{'value': cat[0], 'label': cat[1]} for cat in categories])
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get history for a specific business rule"""
        rule = self.get_object()
        history = BusinessRuleHistory.objects.filter(business_rule=rule).order_by('-changed_at')
        serializer = BusinessRuleHistorySerializer(history, many=True)
        return Response(serializer.data)

class SettlementSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Settlement Settings
    """
    queryset = SettlementSettings.objects.all()
    serializer_class = SettlementSettingsSerializer
    
    def get_object(self):
        """Get or create settings object (singleton)"""
        obj, created = SettlementSettings.objects.get_or_create(pk=1)
        return obj
    
    def _get_definitions(self):
        definitions = SettlementSettingDefinition.objects.filter(is_active=True).order_by('category_sequence', 'sequence')
        return SettlementSettingDefinitionSerializer(definitions, many=True).data

    def list(self, request, *args, **kwargs):
        """Return single settings object with metadata definitions"""
        settings = self.get_object()
        serializer = self.get_serializer(settings)
        data = serializer.data
        data['definitions'] = self._get_definitions()
        return Response(data)
    
    def retrieve(self, request, *args, **kwargs):
        """Return single settings object with metadata definitions"""
        settings = self.get_object()
        serializer = self.get_serializer(settings)
        data = serializer.data
        data['definitions'] = self._get_definitions()
        return Response(data)
    
    def update(self, request, *args, **kwargs):
        """Update settlement settings"""
        settings = self.get_object()
        serializer = self.get_serializer(settings, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Partially update settlement settings"""
        settings = self.get_object()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)
