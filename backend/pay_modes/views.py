from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import PayMode, PayModeSettings, PayModeHistory, PayModeSettingDefinition
from .serializers import (
    PayModeSerializer,
    PayModeCreateUpdateSerializer,
    PayModeSettingsSerializer,
    PayModeHistorySerializer,
    PayModeSettingDefinitionSerializer,
)

class PayModeViewSet(viewsets.ModelViewSet):
    queryset = PayMode.objects.all()
    serializer_class = PayModeSerializer
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PayModeCreateUpdateSerializer
        return PayModeSerializer
    
    def get_queryset(self):
        queryset = PayMode.objects.all()
        payment_type = self.request.query_params.get('payment_type', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if payment_type:
            queryset = queryset.filter(payment_type=payment_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('display_order', 'name')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if payment method is used in any transactions
        # This would need to be implemented based on your transaction model
        # if instance.transactions.exists():
        #     return Response(
        #         {"detail": "Cannot delete payment method as it is used in transactions."},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def payment_types(self, request):
        """Get all available payment types"""
        payment_types = PayMode.PAYMENT_TYPES
        return Response([{'value': pt[0], 'label': pt[1]} for pt in payment_types])
    
    @action(detail=False, methods=['get'])
    def available_for_amount(self, request):
        """Get payment methods available for a specific amount"""
        amount = float(request.query_params.get('amount', 0))
        available_modes = PayMode.objects.filter(is_active=True).filter(
            min_amount__lte=amount,
            max_amount__gte=amount
        ).order_by('display_order', 'name')
        
        serializer = self.get_serializer(available_modes, many=True, context={'amount': amount})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get history for a specific payment method"""
        paymode = self.get_object()
        history = PayModeHistory.objects.filter(paymode=paymode).order_by('-changed_at')
        serializer = PayModeHistorySerializer(history, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle active status of payment method"""
        paymode = self.get_object()
        old_status = paymode.is_active
        
        with transaction.atomic():
            paymode.is_active = not paymode.is_active
            paymode.updated_by = request.user
            paymode.save()
            
            # Create history entry
            PayModeHistory.objects.create(
                paymode=paymode,
                field_name='is_active',
                old_value=str(old_status),
                new_value=str(paymode.is_active),
                changed_by=request.user,
                reason=request.data.get('reason', 'Status toggled')
            )
        
        serializer = self.get_serializer(paymode)
        return Response(serializer.data)

class PayModeSettingsViewSet(viewsets.ModelViewSet):
    queryset = PayModeSettings.objects.all()
    serializer_class = PayModeSettingsSerializer
    
    def get_object(self):
        """Get or create settings object"""
        obj, created = PayModeSettings.objects.get_or_create(pk=1)
        return obj
    
    def _get_definitions(self):
        definitions = PayModeSettingDefinition.objects.filter(is_active=True).order_by('category_sequence', 'sequence')
        return PayModeSettingDefinitionSerializer(definitions, many=True).data

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
        """Update settings"""
        settings = self.get_object()
        serializer = self.get_serializer(settings, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)
