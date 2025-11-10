from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import (
    POSMaster, POSMasterSettings, POSMasterHistory, POSMasterMapping,
    CurrencyDenomination, Terminal, PrinterTemplate, TerminalTransactionSetting,
    TerminalTenderMapping, TerminalDepartmentMapping, SettlementReason
)
from .serializers import (
    POSMasterSerializer, POSMasterCreateUpdateSerializer, 
    POSMasterSettingsSerializer, POSMasterHistorySerializer, POSMasterMappingSerializer,
    CurrencyDenominationSerializer, TerminalSerializer, TerminalCreateUpdateSerializer,
    PrinterTemplateSerializer, TerminalTransactionSettingSerializer,
    TerminalTenderMappingSerializer, TerminalDepartmentMappingSerializer,
    SettlementReasonSerializer
)

class POSMasterViewSet(viewsets.ModelViewSet):
    queryset = POSMaster.objects.all()
    serializer_class = POSMasterSerializer
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return POSMasterCreateUpdateSerializer
        return POSMasterSerializer
    
    def get_queryset(self):
        queryset = POSMaster.objects.all()
        master_type = self.request.query_params.get('master_type', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if master_type:
            queryset = queryset.filter(master_type=master_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('master_type', 'display_order', 'name')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if not instance.can_be_deleted():
            return Response(
                {"detail": "Cannot delete this master data as it is system generated or not allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def master_types(self, request):
        """Get all available master types"""
        master_types = POSMaster.MASTER_TYPES
        return Response([{'value': mt[0], 'label': mt[1]} for mt in master_types])
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get master data grouped by type"""
        master_type = request.query_params.get('type', None)
        if not master_type:
            return Response({"detail": "Master type is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        masters = POSMaster.objects.filter(master_type=master_type, is_active=True).order_by('display_order', 'name')
        serializer = self.get_serializer(masters, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get history for a specific master data"""
        pos_master = self.get_object()
        history = POSMasterHistory.objects.filter(pos_master=pos_master).order_by('-changed_at')
        serializer = POSMasterHistorySerializer(history, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def mappings(self, request, pk=None):
        """Get mappings for a specific master data"""
        pos_master = self.get_object()
        mappings = POSMasterMapping.objects.filter(pos_master=pos_master, is_active=True)
        serializer = POSMasterMappingSerializer(mappings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle active status of master data"""
        pos_master = self.get_object()
        old_status = pos_master.is_active
        
        with transaction.atomic():
            pos_master.is_active = not pos_master.is_active
            pos_master.updated_by = request.user
            pos_master.save()
            
            # Create history entry
            POSMasterHistory.objects.create(
                pos_master=pos_master,
                field_name='is_active',
                old_value=str(old_status),
                new_value=str(pos_master.is_active),
                changed_by=request.user,
                reason=request.data.get('reason', 'Status toggled')
            )
        
        serializer = self.get_serializer(pos_master)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_import(self, request):
        """Bulk import master data"""
        data = request.data.get('data', [])
        master_type = request.data.get('master_type')
        
        if not master_type:
            return Response({"detail": "Master type is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        created_count = 0
        errors = []
        
        for item in data:
            try:
                POSMaster.objects.create(
                    name=item.get('name'),
                    code=item.get('code'),
                    master_type=master_type,
                    description=item.get('description', ''),
                    created_by=request.user,
                    updated_by=request.user
                )
                created_count += 1
            except Exception as e:
                errors.append(f"Error creating {item.get('name')}: {str(e)}")
        
        return Response({
            'created_count': created_count,
            'errors': errors,
            'message': f'Successfully created {created_count} master data items'
        })

class POSMasterSettingsViewSet(viewsets.ModelViewSet):
    queryset = POSMasterSettings.objects.all()
    serializer_class = POSMasterSettingsSerializer
    
    def get_object(self):
        """Get or create settings object"""
        obj, created = POSMasterSettings.objects.get_or_create(pk=1)
        return obj
    
    def list(self, request, *args, **kwargs):
        """Return single settings object"""
        settings = self.get_object()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """Update settings"""
        settings = self.get_object()
        serializer = self.get_serializer(settings, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)

class POSMasterMappingViewSet(viewsets.ModelViewSet):
    queryset = POSMasterMapping.objects.all()
    serializer_class = POSMasterMappingSerializer
    
    def get_queryset(self):
        queryset = POSMasterMapping.objects.all()
        pos_master_id = self.request.query_params.get('pos_master_id', None)
        mapping_type = self.request.query_params.get('mapping_type', None)
        
        if pos_master_id:
            queryset = queryset.filter(pos_master_id=pos_master_id)
        if mapping_type:
            queryset = queryset.filter(mapping_type=mapping_type)
        
        return queryset.order_by('pos_master__name', 'mapped_entity_name')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class CurrencyDenominationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Currency Denominations Master
    """
    queryset = CurrencyDenomination.objects.all()
    serializer_class = CurrencyDenominationSerializer
    
    def get_queryset(self):
        queryset = CurrencyDenomination.objects.all()
        
        # Filter by currency
        currency_id = self.request.query_params.get('currency_id', None)
        if currency_id:
            queryset = queryset.filter(currency_id=currency_id)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by type
        denomination_type = self.request.query_params.get('type', None)
        if denomination_type:
            queryset = queryset.filter(denomination_type=denomination_type)
        
        return queryset.order_by('-value')  # Highest value first
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def by_currency(self, request):
        """
        Get all active denominations for a specific currency
        """
        currency_id = request.query_params.get('currency_id', None)
        if not currency_id:
            return Response(
                {"detail": "currency_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Verify currency exists
            currency = get_object_or_404(POSMaster, id=currency_id, master_type='currency')
            
            # Get active denominations
            denominations = CurrencyDenomination.objects.filter(
                currency=currency,
                is_active=True
            ).order_by('-value')
            
            serializer = self.get_serializer(denominations, many=True)
            return Response(serializer.data)
        except POSMaster.DoesNotExist:
            return Response(
                {"detail": "Currency not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """
        Bulk create currency denominations
        """
        currency_id = request.data.get('currency_id')
        denominations = request.data.get('denominations', [])
        
        if not currency_id or not denominations:
            return Response(
                {"detail": "currency_id and denominations are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            currency = get_object_or_404(POSMaster, id=currency_id, master_type='currency')
            
            created_count = 0
            errors = []
            
            with transaction.atomic():
                for denom_data in denominations:
                    try:
                        CurrencyDenomination.objects.create(
                            currency=currency,
                            denomination_type=denom_data.get('denomination_type'),
                            value=denom_data.get('value'),
                            display_name=denom_data.get('display_name'),
                            display_order=denom_data.get('display_order', 0),
                            is_active=denom_data.get('is_active', True),
                            created_by=request.user
                        )
                        created_count += 1
                    except Exception as e:
                        errors.append(f"Error creating {denom_data.get('display_name')}: {str(e)}")
            
            return Response({
                'created_count': created_count,
                'errors': errors,
                'message': f'Successfully created {created_count} denominations'
            })
        except POSMaster.DoesNotExist:
            return Response(
                {"detail": "Currency not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class SettlementReasonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Settlement Reason master data (shortage/excess).
    """

    queryset = SettlementReason.objects.all()
    serializer_class = SettlementReasonSerializer

    def get_queryset(self):
        queryset = SettlementReason.objects.all()
        reason_type = self.request.query_params.get('reason_type')
        is_active = self.request.query_params.get('is_active')
        module_ref = self.request.query_params.get('module_ref')

        if reason_type:
            queryset = queryset.filter(reason_type=reason_type)
        if module_ref:
            queryset = queryset.filter(module_ref=module_ref)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset.order_by('reason_type', 'name')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class TerminalViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Terminal CRUD operations
    """
    queryset = Terminal.objects.all()
    serializer_class = TerminalSerializer
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TerminalCreateUpdateSerializer
        elif self.action == 'retrieve':
            # Use detail serializer with nested relationships for retrieve
            from .serializers import TerminalDetailSerializer
            return TerminalDetailSerializer
        return TerminalSerializer
    
    def get_queryset(self):
        queryset = Terminal.objects.select_related('company', 'location').all()
        
        # Filter by company
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        
        # Filter by location
        location_id = self.request.query_params.get('location', None)
        if location_id:
            queryset = queryset.filter(location_id=location_id)
        
        # Filter by status
        terminal_status = self.request.query_params.get('status', None)
        if terminal_status:
            queryset = queryset.filter(status=terminal_status)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by terminal type
        terminal_type = self.request.query_params.get('terminal_type', None)
        if terminal_type:
            queryset = queryset.filter(terminal_type=terminal_type)
        
        return queryset.order_by('terminal_code', 'name')
    
    def perform_create(self, serializer):
        """Save with user information"""
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        """Update with user information"""
        serializer.save(updated_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle active status of terminal"""
        terminal = self.get_object()
        terminal.is_active = not terminal.is_active
        terminal.updated_by = request.user
        terminal.save()
        
        serializer = self.get_serializer(terminal)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update terminal status (active, inactive, maintenance, error)"""
        terminal = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in [choice[0] for choice in Terminal.STATUS_CHOICES]:
            return Response(
                {"detail": f"Invalid status. Must be one of: {[c[0] for c in Terminal.STATUS_CHOICES]}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        terminal.status = new_status
        terminal.updated_by = request.user
        terminal.save()
        
        serializer = self.get_serializer(terminal)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def sync(self, request, pk=None):
        """Mark terminal as synced (update last_sync timestamp)"""
        terminal = self.get_object()
        terminal.update_last_sync()
        
        serializer = self.get_serializer(terminal)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get', 'post'])
    def identify_by_hostname(self, request):
        """
        Identify or register terminal by hostname/system_name
        
        GET: Find terminal by hostname
        POST: Find or create terminal by hostname
        
        Query params (GET) or body (POST):
        - hostname: System hostname/PC name
        - location_id: Optional location ID to filter/assign
        - auto_create: Optional flag to auto-create if not found (POST only)
        """
        hostname = None
        
        if request.method == 'GET':
            hostname = request.query_params.get('hostname')
            location_id = request.query_params.get('location_id')
        else:  # POST
            hostname = request.data.get('hostname') or request.data.get('system_name')
            location_id = request.data.get('location_id') or request.data.get('location')
            auto_create = request.data.get('auto_create', False)
        
        if not hostname:
            return Response(
                {"detail": "hostname parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find terminal by system_name
        queryset = Terminal.objects.filter(system_name=hostname)
        
        # Filter by location if provided
        if location_id:
            queryset = queryset.filter(location_id=location_id)
        
        terminal = queryset.first()
        
        if terminal:
            # Terminal found
            serializer = self.get_serializer(terminal)
            return Response({
                'found': True,
                'terminal': serializer.data
            })
        else:
            # Terminal not found
            if request.method == 'POST' and auto_create:
                # Auto-create terminal if requested
                try:
                    # Generate a terminal code from hostname
                    terminal_code = hostname.upper().replace('-', '').replace('_', '')[:20]
                    # Ensure uniqueness
                    base_code = terminal_code
                    counter = 1
                    while Terminal.objects.filter(terminal_code=terminal_code).exists():
                        terminal_code = f"{base_code[:17]}{counter:03d}"[:20]
                        counter += 1
                    
                    # Create terminal
                    terminal_data = {
                        'name': f"Terminal {hostname}",
                        'terminal_code': terminal_code,
                        'system_name': hostname,
                        'location_id': location_id,
                        'is_active': True,
                        'status': 'active',
                        'created_by': request.user,
                        'updated_by': request.user,
                    }
                    
                    serializer = TerminalCreateUpdateSerializer(data=terminal_data)
                    if serializer.is_valid():
                        terminal = serializer.save()
                        response_serializer = self.get_serializer(terminal)
                        return Response({
                            'found': False,
                            'created': True,
                            'terminal': response_serializer.data
                        }, status=status.HTTP_201_CREATED)
                    else:
                        return Response(
                            {'detail': 'Failed to create terminal', 'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except Exception as e:
                    return Response(
                        {'detail': f'Error creating terminal: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:
                # Terminal not found and not creating
                return Response({
                    'found': False,
                    'created': False,
                    'message': f'No terminal found with system_name: {hostname}',
                    'hostname': hostname
                }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def get_client_hostname(self, request):
        """
        Get client hostname/PC name from request headers
        Attempts to detect the client's hostname from various request headers
        """
        import socket
        
        hostname = None
        
        # Try to get from custom header (if frontend sends it)
        hostname = request.headers.get('X-Client-Hostname') or request.headers.get('X-PC-Name')
        
        # Try to get from referer or origin (limited value)
        if not hostname:
            referer = request.headers.get('Referer', '')
            origin = request.headers.get('Origin', '')
            # Extract hostname from URL if available
            if referer:
                try:
                    from urllib.parse import urlparse
                    parsed = urlparse(referer)
                    hostname = parsed.hostname
                except:
                    pass
        
        # Fallback: Get server hostname (not ideal, but better than nothing)
        if not hostname:
            try:
                hostname = socket.gethostname()
            except:
                hostname = 'unknown'
        
        return Response({
            'hostname': hostname,
            'source': 'X-Client-Hostname' if request.headers.get('X-Client-Hostname') 
                      else 'X-PC-Name' if request.headers.get('X-PC-Name')
                      else 'referer' if referer
                      else 'server'
        })
    
    @action(detail=False, methods=['get'])
    def terminal_types(self, request):
        """Get all available terminal types"""
        terminal_types = Terminal.TERMINAL_TYPE_CHOICES
        return Response([{'value': tt[0], 'label': tt[1]} for tt in terminal_types])
    
    @action(detail=True, methods=['get'])
    def transaction_settings(self, request, pk=None):
        """Get transaction settings for a terminal"""
        terminal = self.get_object()
        settings = terminal.transaction_settings.all()
        serializer = TerminalTransactionSettingSerializer(settings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def tender_mappings(self, request, pk=None):
        """Get tender mappings for a terminal"""
        terminal = self.get_object()
        mappings = terminal.tender_mappings.all()
        serializer = TerminalTenderMappingSerializer(mappings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def department_mappings(self, request, pk=None):
        """Get department mappings for a terminal"""
        terminal = self.get_object()
        mappings = terminal.department_mappings.all()
        serializer = TerminalDepartmentMappingSerializer(mappings, many=True)
        return Response(serializer.data)


class PrinterTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for PrinterTemplate CRUD operations"""
    queryset = PrinterTemplate.objects.all()
    serializer_class = PrinterTemplateSerializer
    
    def get_queryset(self):
        queryset = PrinterTemplate.objects.all()
        template_type = self.request.query_params.get('template_type', None)
        if template_type:
            queryset = queryset.filter(template_type=template_type)
        is_default = self.request.query_params.get('is_default', None)
        if is_default is not None:
            queryset = queryset.filter(is_default=is_default.lower() == 'true')
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset.order_by('template_type', 'name')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save()


class TerminalTransactionSettingViewSet(viewsets.ModelViewSet):
    """ViewSet for TerminalTransactionSetting CRUD operations"""
    queryset = TerminalTransactionSetting.objects.all()
    serializer_class = TerminalTransactionSettingSerializer
    
    def get_queryset(self):
        queryset = TerminalTransactionSetting.objects.select_related('terminal', 'printer_template').all()
        terminal_id = self.request.query_params.get('terminal', None)
        if terminal_id:
            queryset = queryset.filter(terminal_id=terminal_id)
        transaction_type = self.request.query_params.get('transaction_type', None)
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)
        return queryset.order_by('terminal', 'transaction_type')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save()


class TerminalTenderMappingViewSet(viewsets.ModelViewSet):
    """ViewSet for TerminalTenderMapping CRUD operations"""
    queryset = TerminalTenderMapping.objects.all()
    serializer_class = TerminalTenderMappingSerializer
    
    def get_queryset(self):
        queryset = TerminalTenderMapping.objects.select_related('terminal').all()
        terminal_id = self.request.query_params.get('terminal', None)
        if terminal_id:
            queryset = queryset.filter(terminal_id=terminal_id)
        tender_type = self.request.query_params.get('tender_type', None)
        if tender_type:
            queryset = queryset.filter(tender_type=tender_type)
        return queryset.order_by('terminal', 'tender_type')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save()


class TerminalDepartmentMappingViewSet(viewsets.ModelViewSet):
    """ViewSet for TerminalDepartmentMapping CRUD operations"""
    queryset = TerminalDepartmentMapping.objects.all()
    serializer_class = TerminalDepartmentMappingSerializer
    
    def get_queryset(self):
        queryset = TerminalDepartmentMapping.objects.select_related('terminal', 'department').all()
        terminal_id = self.request.query_params.get('terminal', None)
        if terminal_id:
            queryset = queryset.filter(terminal_id=terminal_id)
        department_id = self.request.query_params.get('department', None)
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        return queryset.order_by('terminal', 'department')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save()
