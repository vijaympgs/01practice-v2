from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import Sum, Count, Q
from django.conf import settings
from decimal import Decimal, InvalidOperation
from datetime import date, datetime

from .models import Sale, SaleItem, Payment, POSSession, DayOpen, DayClose
from pos_masters.models import SettlementReason
from .serializers import (
    SaleSerializer, SaleCreateSerializer,
    SaleItemSerializer, PaymentSerializer,
    POSSessionSerializer, DayOpenSerializer, DayCloseSerializer
)


class SaleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing sales transactions.
    
    Supports:
    - Creating new sales with items and payments
    - Listing sales with filters
    - Retrieving sale details
    - Suspending sales (draft status)
    - Resuming suspended sales
    """
    
    queryset = Sale.objects.all().select_related(
        'customer', 'cashier', 'pos_session'
    ).prefetch_related('items', 'payments')
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    search_fields = ['sale_number', 'customer__first_name', 'customer__last_name']
    filterset_fields = ['status', 'sale_type', 'customer', 'cashier', 'sale_date', 'pos_session']
    ordering_fields = ['sale_date', 'total_amount']
    ordering = ['-sale_date']
    
    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return SaleCreateSerializer
        return SaleSerializer
    
    def create(self, request, *args, **kwargs):
        """Override create to return full sale data with items and payments."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        sale = serializer.save()
        
        # Return the created sale using SaleSerializer to get full details
        # This ensures id, sale_number, and all calculated fields are included
        response_serializer = SaleSerializer(sale, context=self.get_serializer_context())
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'])
    def suspended(self, request):
        """Get all suspended (draft) sales."""
        suspended_sales = self.queryset.filter(status='draft')
        
        # Filter by current user if not admin
        if not request.user.is_staff:
            suspended_sales = suspended_sales.filter(cashier=request.user)
        
        serializer = self.get_serializer(suspended_sales, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        """Resume a suspended sale."""
        sale = self.get_object()
        
        if sale.status != 'draft':
            return Response(
                {'error': 'Only draft sales can be resumed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Return the sale data for editing
        serializer = self.get_serializer(sale)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete a sale (finalize)."""
        sale = self.get_object()
        
        if sale.status == 'completed':
            return Response(
                {'error': 'Sale is already completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if fully paid
        paid_amount = sale.get_paid_amount()
        if paid_amount < sale.total_amount:
            return Response(
                {
                    'error': 'Sale is not fully paid',
                    'total_amount': sale.total_amount,
                    'paid_amount': paid_amount,
                    'balance_due': sale.total_amount - paid_amount
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Complete the sale
        sale.status = 'completed'
        sale.completed_at = timezone.now()
        sale.save()
        
        serializer = self.get_serializer(sale)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a sale."""
        sale = self.get_object()
        reason_code = request.data.get('reason_code')
        
        if not reason_code:
            return Response(
                {'error': 'Reason code is required for cancellation'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        sale.status = 'cancelled'
        sale.reason_code = reason_code
        sale.save()
        
        serializer = self.get_serializer(sale)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today_summary(self, request):
        """Get today's sales summary."""
        today = timezone.now().date()
        
        today_sales = Sale.objects.filter(
            sale_date__date=today,
            status='completed'
        )
        
        summary = today_sales.aggregate(
            total_sales=Sum('total_amount'),
            total_transactions=Count('id'),
            total_items=Sum('items__quantity')
        )
        
        # Payment method breakdown
        from .models import Payment
        payments = Payment.objects.filter(
            sale__sale_date__date=today,
            sale__status='completed',
            status='completed'
        )
        
        payment_summary = {}
        for method, label in Payment.PAYMENT_METHODS:
            amount = payments.filter(payment_method=method).aggregate(
                total=Sum('amount')
            )['total'] or 0
            payment_summary[method] = {
                'label': label,
                'amount': amount
            }
        
        return Response({
            'date': today,
            'summary': summary,
            'payment_methods': payment_summary
        })


class SaleItemViewSet(viewsets.ModelViewSet):
    """ViewSet for managing sale line items."""
    
    queryset = SaleItem.objects.all().select_related('sale', 'product')
    serializer_class = SaleItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter items by sale if provided."""
        queryset = super().get_queryset()
        sale_id = self.request.query_params.get('sale')
        if sale_id:
            queryset = queryset.filter(sale_id=sale_id)
        return queryset


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing payments."""
    
    queryset = Payment.objects.all().select_related('sale')
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['sale', 'payment_method', 'status']
    
    def get_queryset(self):
        """Filter payments by sale if provided."""
        queryset = super().get_queryset()
        sale_id = self.request.query_params.get('sale')
        if sale_id:
            queryset = queryset.filter(sale_id=sale_id)
        return queryset


class POSSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing POS sessions.
    
    Supports:
    - Opening new session
    - Closing session with cash counting
    - Viewing session summary
    """
    
    queryset = POSSession.objects.all().select_related('cashier')
    serializer_class = POSSessionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['cashier', 'status']
    ordering = ['-opened_at']
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current open session for user."""
        # Handle anonymous/unauthenticated users gracefully
        if not request.user or request.user.is_anonymous:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Try to find session by cashier first, then by terminal if available
        session = POSSession.objects.filter(
            cashier=request.user,
            status='open'
        ).select_related('terminal', 'location', 'cashier').first()
        
        # If no session found for user, try to find any open session (for debugging)
        if not session:
            # Debug: Check if there are any open sessions at all
            all_open_sessions = POSSession.objects.filter(status='open').count()
            print(f"DEBUG: User {request.user.id} ({request.user.username}) - Total open sessions: {all_open_sessions}")
            
            return Response(
                {'error': f'No open session found for user {request.user.username} (ID: {request.user.id})'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(session)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close a POS session and calculate summary."""
        session = self.get_object()
        
        if session.status == 'closed':
            return Response(
                {'error': 'Session is already closed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        def to_decimal(value, field_name):
            if value is None:
                return None
            try:
                return Decimal(str(value))
            except (ValueError, TypeError, InvalidOperation):
                raise ValidationError({field_name: 'Invalid decimal value'})

        closing_cash_input = request.data.get('closing_cash')
        total_counted_cash_input = request.data.get('total_counted_cash')
        total_expected_cash_input = request.data.get('total_expected_cash')
        interim_settlements = request.data.get('interim_settlements', [])
        variance_reason_id = request.data.get('variance_reason_id')

        if total_counted_cash_input is None and closing_cash_input is None:
            return Response(
                {'error': 'Closing cash amount is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate session summary
        completed_sales = session.sales.filter(status='completed')
        
        session.total_sales = completed_sales.aggregate(
            total=Sum('total_amount')
        )['total'] or Decimal('0.00')
        
        # Calculate cash payments
        cash_payments = Payment.objects.filter(
            sale__pos_session=session,
            payment_method='cash',
            status='completed'
        )
        
        total_cash_payments = cash_payments.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        # Expected cash
        session.expected_cash = session.opening_cash + total_cash_payments

        if total_expected_cash_input is not None:
            session.base_expected_cash = to_decimal(total_expected_cash_input, 'total_expected_cash')
        elif session.base_expected_cash is None:
            session.base_expected_cash = session.expected_cash

        counted_cash_value = None
        try:
            if total_counted_cash_input is not None:
                counted_cash_value = to_decimal(total_counted_cash_input, 'total_counted_cash')
            elif closing_cash_input is not None:
                counted_cash_value = to_decimal(closing_cash_input, 'closing_cash')
        except ValidationError as exc:
            return Response(exc.message_dict, status=status.HTTP_400_BAD_REQUEST)

        session.total_counted_cash = counted_cash_value
        session.closing_cash = counted_cash_value
        session.cash_difference = session.closing_cash - session.expected_cash
        session.interim_settlements = interim_settlements or []
        if variance_reason_id:
            try:
                session.variance_reason = SettlementReason.objects.get(id=variance_reason_id)
            except SettlementReason.DoesNotExist:
                return Response(
                    {'variance_reason_id': 'Invalid variance reason.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            session.variance_reason = None
        
        # Close session
        session.status = 'closed'
        session.closed_at = timezone.now()
        session.notes = request.data.get('notes', '')
        session.save()
        
        serializer = self.get_serializer(session)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        """Get detailed session summary."""
        session = self.get_object()
        
        # Sales breakdown
        sales = session.sales.filter(status='completed')
        sales_summary = sales.aggregate(
            total_amount=Sum('total_amount'),
            count=Count('id')
        )
        
        # Payment method breakdown
        payments = Payment.objects.filter(
            sale__pos_session=session,
            status='completed'
        )
        
        payment_breakdown = {}
        for method, label in Payment.PAYMENT_METHODS:
            amount = payments.filter(payment_method=method).aggregate(
                total=Sum('amount')
            )['total'] or 0
            payment_breakdown[method] = {
                'label': label,
                'amount': amount
            }
        
        return Response({
            'session': self.get_serializer(session).data,
            'sales_summary': sales_summary,
            'payment_breakdown': payment_breakdown
        })


class DayOpenViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Day Open operations.
    
    Supports:
    - Opening business day for location
    - Checking active day open
    - Closing day open
    """
    
    queryset = DayOpen.objects.all().select_related('location', 'opened_by', 'closed_by')
    serializer_class = DayOpenSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['location', 'business_date', 'is_active']
    ordering = ['-business_date']
    
    def perform_create(self, serializer):
        """Set opened_by to current user and link to their location"""
        user_location = self.request.user.pos_location
        if not user_location:
            raise ValidationError('User must have a location assigned')
        serializer.save(opened_by=self.request.user, location=user_location)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active day open for user's location"""
        user_location = request.user.pos_location
        if not user_location:
            return Response(
                {'error': 'No location assigned'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        day_open = DayOpen.objects.filter(
            location=user_location,
            is_active=True
        ).first()
        
        if not day_open:
            return Response(
                {'error': 'No active day open'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(day_open)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def open(self, request):
        """Open new business day"""
        import traceback
        
        # Check user location
        user_location = request.user.pos_location
        if not user_location:
            return Response(
                {
                    'error': 'No location assigned to user. Please contact administrator to assign a location.',
                    'detail': f'User: {request.user.username} (ID: {request.user.id}) does not have a POS location assigned.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse business_date from request
        business_date_str = request.data.get('business_date')
        if business_date_str:
            try:
                # Parse date string (format: YYYY-MM-DD)
                if isinstance(business_date_str, str):
                    business_date = datetime.strptime(business_date_str, '%Y-%m-%d').date()
                elif isinstance(business_date_str, date):
                    business_date = business_date_str
                else:
                    business_date = date.today()
            except (ValueError, TypeError) as e:
                return Response(
                    {
                        'error': f'Invalid date format: {business_date_str}',
                        'detail': f'Expected format: YYYY-MM-DD. Error: {str(e)}'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            business_date = date.today()
        
        # Check if already open for this date
        existing = DayOpen.objects.filter(
            location=user_location,
            business_date=business_date
        ).first()
        
        if existing:
            return Response(
                {
                    'error': f'Day already open for {business_date.strftime("%d-%b-%Y")}. Please close the existing day first.',
                    'detail': f'Day Open ID: {existing.id}, Opened at: {existing.opened_at}'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate next document sequences
        date_str = business_date.strftime('%Y%m%d')
        next_sale_number = f'SALE-{date_str}-0001'
        next_session_number = f'SES-{date_str}-0001'
        
        # Get notes from request
        notes = request.data.get('notes', '').strip()
        
        # Create day open
        try:
            day_open = DayOpen.objects.create(
                location=user_location,
                business_date=business_date,
                opened_by=request.user,
                next_sale_number=next_sale_number,
                next_session_number=next_session_number,
                notes=notes,
                is_active=True
            )
            
            serializer = self.get_serializer(day_open)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Log full traceback for debugging
            error_trace = traceback.format_exc()
            print(f"Day Open Error: {str(e)}")
            print(f"Traceback: {error_trace}")
            
            return Response(
                {
                    'error': f'Failed to open day: {str(e)}',
                    'detail': f'Location: {user_location.name if user_location else "None"}, Date: {business_date}, User: {request.user.username}',
                    'traceback': error_trace if settings.DEBUG else None
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close the day open"""
        day_open = self.get_object()
        
        if not day_open.is_active:
            return Response(
                {'error': 'Day open is already closed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        day_open.close_day_open()
        serializer = self.get_serializer(day_open)
        return Response(serializer.data)


class DayCloseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Day Close operations.
    
    Supports:
    - Initiating day close
    - Completing day close with checklist
    - Reverting day close
    """
    
    queryset = DayClose.objects.all().select_related('location', 'initiated_by', 'reverted_by')
    serializer_class = DayCloseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['location', 'business_date', 'status']
    ordering = ['-business_date']
    
    def perform_create(self, serializer):
        """Set initiated_by to current user and link to their location"""
        user_location = self.request.user.pos_location
        if not user_location:
            raise ValidationError('User must have a location assigned')
        serializer.save(initiated_by=self.request.user, location=user_location)
    
    @action(detail=False, methods=['post'])
    def complete(self, request):
        """Complete day close process"""
        location = request.user.pos_location
        if not location:
            return Response({'error': 'No location assigned'}, status=400)
        
        business_date = request.data.get('business_date', date.today())
        checklist = request.data.get('checklist_items', {})
        
        # Create or get day close
        day_close, created = DayClose.objects.get_or_create(
            location=location,
            business_date=business_date,
            defaults={
                'initiated_by': request.user,
                'status': 'pending',
                'checklist_items': checklist
            }
        )
        
        # Complete day close
        try:
            result = day_close.complete_day_close()
            serializer = self.get_serializer(day_close)
            return Response({
                'day_close': serializer.data,
                'consolidation': result
            })
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
    
    @action(detail=True, methods=['post'])
    def revert(self, request, pk=None):
        """Revert day close"""
        day_close = self.get_object()
        
        if day_close.status != 'completed':
            return Response(
                {'error': 'Only completed day closes can be reverted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not day_close.can_be_reverted():
            return Response(
                {'error': 'Cannot revert: transactions exist for current sale date'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        day_close.status = 'reverted'
        day_close.reverted_by = request.user
        day_close.reverted_at = timezone.now()
        day_close.save()
        
        serializer = self.get_serializer(day_close)
        return Response(serializer.data)


