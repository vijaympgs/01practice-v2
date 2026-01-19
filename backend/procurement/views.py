"""
Procurement Views
NewBorn Retail™ - AI-Powered Enterprise ERP System
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import (
    PurchaseRequest, PurchaseRequestItem,
    PurchaseEnquiry, PurchaseEnquiryItem,
    PurchaseQuotation, PurchaseQuotationItem,
    PurchaseOrder, PurchaseOrderItem,
    GoodsReceivedNote, GoodsReceivedNoteItem,
    PurchaseInvoice, PurchaseInvoiceItem,
    PurchaseReturn, PurchaseReturnItem,
    PurchaseRequisition, PurchaseRequisitionLine
)

from .serializers import (
    PurchaseRequestSerializer, PurchaseRequestCreateSerializer, PurchaseRequestItemSerializer,
    PurchaseEnquirySerializer, PurchaseEnquiryItemSerializer,
    PurchaseQuotationSerializer, PurchaseQuotationItemSerializer,
    PurchaseOrderSerializer, PurchaseOrderItemSerializer,
    GoodsReceivedNoteSerializer, GoodsReceivedNoteItemSerializer,
    PurchaseInvoiceSerializer, PurchaseInvoiceItemSerializer,
    PurchaseReturnSerializer, PurchaseReturnItemSerializer,
    PurchaseRequisitionSerializer, PurchaseRequisitionCreateUpdateSerializer,
    PurchaseRequisitionLineSerializer
)


# ============================================================================
# Purchase Request ViewSets
# ============================================================================

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    """Purchase Request ViewSet"""
    queryset = PurchaseRequest.objects.all().select_related('requested_by')
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'department']
    search_fields = ['request_number', 'requested_by__username', 'department']
    ordering = ['-request_date', '-created_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PurchaseRequestCreateSerializer
        return PurchaseRequestSerializer
    
    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)


class PurchaseRequestItemViewSet(viewsets.ModelViewSet):
    """Purchase Request Item ViewSet"""
    queryset = PurchaseRequestItem.objects.all().select_related('product')
    serializer_class = PurchaseRequestItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_request']


# ============================================================================
# Purchase Enquiry ViewSets
# ============================================================================

class PurchaseEnquiryViewSet(viewsets.ModelViewSet):
    """Purchase Enquiry ViewSet"""
    queryset = PurchaseEnquiry.objects.all().select_related('supplier', 'purchase_request')
    serializer_class = PurchaseEnquirySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['supplier', 'status', 'purchase_request']
    search_fields = ['enquiry_number', 'supplier__name']
    ordering = ['-enquiry_date', '-created_at']


class PurchaseEnquiryItemViewSet(viewsets.ModelViewSet):
    """Purchase Enquiry Item ViewSet"""
    queryset = PurchaseEnquiryItem.objects.all().select_related('product')
    serializer_class = PurchaseEnquiryItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_enquiry']


# ============================================================================
# Purchase Quotation ViewSets
# ============================================================================

class PurchaseQuotationViewSet(viewsets.ModelViewSet):
    """Purchase Quotation ViewSet"""
    queryset = PurchaseQuotation.objects.all().select_related('supplier', 'purchase_enquiry')
    serializer_class = PurchaseQuotationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['supplier', 'status', 'purchase_enquiry']
    search_fields = ['quotation_number', 'supplier__name']
    ordering = ['-quotation_date', '-created_at']


class PurchaseQuotationItemViewSet(viewsets.ModelViewSet):
    """Purchase Quotation Item ViewSet"""
    queryset = PurchaseQuotationItem.objects.all().select_related('product')
    serializer_class = PurchaseQuotationItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_quotation']


# ============================================================================
# Purchase Order ViewSets
# ============================================================================

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """Purchase Order ViewSet"""
    queryset = PurchaseOrder.objects.all().select_related('supplier', 'created_by', 'purchase_request', 'purchase_quotation')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['supplier', 'status', 'priority']
    search_fields = ['order_number', 'supplier__name']
    ordering = ['-order_date', '-created_at']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve purchase order"""
        order = self.get_object()
        if order.status not in ['draft', 'pending_approval']:
            return Response(
                {'error': 'Only draft or pending approval orders can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'approved'
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def place_order(self, request, pk=None):
        """Place order with supplier"""
        order = self.get_object()
        if order.status != 'approved':
            return Response(
                {'error': 'Only approved orders can be placed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'order_placed'
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)


class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    """Purchase Order Item ViewSet"""
    queryset = PurchaseOrderItem.objects.all().select_related('product')
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_order']


# ============================================================================
# GRN ViewSets
# ============================================================================

class GoodsReceivedNoteViewSet(viewsets.ModelViewSet):
    """GRN ViewSet"""
    queryset = GoodsReceivedNote.objects.all().select_related('supplier', 'purchase_order', 'received_by', 'location')
    serializer_class = GoodsReceivedNoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['supplier', 'status', 'purchase_order']
    search_fields = ['grn_number', 'supplier__name', 'delivery_note']
    ordering = ['-grn_date', '-created_at']
    
    def perform_create(self, serializer):
        serializer.save(received_by=self.request.user)


class GoodsReceivedNoteItemViewSet(viewsets.ModelViewSet):
    """GRN Item ViewSet"""
    queryset = GoodsReceivedNoteItem.objects.all().select_related('product', 'purchase_order_item')
    serializer_class = GoodsReceivedNoteItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['grn']


# ============================================================================
# Purchase Invoice ViewSets
# ============================================================================

class PurchaseInvoiceViewSet(viewsets.ModelViewSet):
    """Purchase Invoice ViewSet"""
    queryset = PurchaseInvoice.objects.all().select_related('supplier', 'grn')
    serializer_class = PurchaseInvoiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['supplier', 'status', 'grn']
    search_fields = ['invoice_number', 'supplier__name']
    ordering = ['-invoice_date', '-created_at']
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve purchase invoice"""
        invoice = self.get_object()
        if invoice.status != 'pending_approval':
            return Response(
                {'error': 'Only pending approval invoices can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        invoice.status = 'approved'
        invoice.save()
        
        serializer = self.get_serializer(invoice)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark invoice as paid"""
        invoice = self.get_object()
        paid_amount = request.data.get('paid_amount', invoice.net_amount)
        
        if paid_amount > invoice.net_amount:
            return Response(
                {'error': 'Paid amount cannot exceed net amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        invoice.paid_amount = paid_amount
        if paid_amount == invoice.net_amount:
            invoice.status = 'paid'
        elif paid_amount > 0:
            invoice.status = 'partial_paid'
        
        invoice.save()
        
        serializer = self.get_serializer(invoice)
        return Response(serializer.data)


class PurchaseInvoiceItemViewSet(viewsets.ModelViewSet):
    """Purchase Invoice Item ViewSet"""
    queryset = PurchaseInvoiceItem.objects.all().select_related('product')
    serializer_class = PurchaseInvoiceItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_invoice']


# ============================================================================
# Purchase Return ViewSets
# ============================================================================

class PurchaseReturnViewSet(viewsets.ModelViewSet):
    """Purchase Return ViewSet"""
    queryset = PurchaseReturn.objects.all().select_related('supplier', 'grn', 'created_by')
    serializer_class = PurchaseReturnSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['supplier', 'status', 'grn']
    search_fields = ['return_number', 'supplier__name']
    ordering = ['-return_date', '-created_at']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class PurchaseReturnItemViewSet(viewsets.ModelViewSet):
    """Purchase Return Item ViewSet"""
    queryset = PurchaseReturnItem.objects.all().select_related('product')
    serializer_class = PurchaseReturnItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_return']

# ============================================================================
# Purchase Requisition ViewSets (4.1)
# ============================================================================

class PurchaseRequisitionViewSet(viewsets.ModelViewSet):
    """Purchase Requisition ViewSet"""
    queryset = PurchaseRequisition.objects.all().select_related(
        'requested_by', 'requesting_location', 'supplier_hint', 
        'approved_by', 'rejected_by', 'created_by'
    )
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pr_status', 'priority', 'requesting_location', 'company', 'requested_by']
    search_fields = ['pr_number', 'requested_by__username', 'remarks']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PurchaseRequisitionCreateUpdateSerializer
        return PurchaseRequisitionSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, requested_by=self.request.user)
        
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit PR for approval"""
        pr = self.get_object()
        if pr.pr_status != 'DRAFT':
            return Response(
                {'error': 'Only draft PRs can be submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if lines exist
        if not pr.lines.exists():
            return Response(
                {'error': 'Cannot submit PR with no lines'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        pr.pr_status = 'SUBMITTED'
        pr.save()
        
        # If approval not required, auto-approve (simple logic for now)
        if not pr.approval_required:
            from django.utils import timezone
            pr.pr_status = 'APPROVED'
            pr.approved_by = request.user # Auto-approve by submitter if no approval needed
            pr.approved_at = timezone.now()
            pr.save()
            
        return Response(PurchaseRequisitionSerializer(pr).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve PR"""
        pr = self.get_object()
        if pr.pr_status != 'SUBMITTED':
            return Response(
                {'error': 'Only submitted PRs can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        from django.utils import timezone
        pr.pr_status = 'APPROVED'
        pr.approved_by = request.user
        pr.approved_at = timezone.now()
        pr.save()
        
        return Response(PurchaseRequisitionSerializer(pr).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject PR"""
        pr = self.get_object()
        if pr.pr_status != 'SUBMITTED':
            return Response(
                {'error': 'Only submitted PRs can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        reason = request.data.get('reason', '')
        if not reason:
             return Response(
                {'error': 'Rejection reason is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        from django.utils import timezone
        pr.pr_status = 'REJECTED'
        pr.rejected_by = request.user
        pr.rejected_at = timezone.now()
        pr.rejection_reason = reason
        pr.save()
        
        return Response(PurchaseRequisitionSerializer(pr).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel PR"""
        pr = self.get_object()
        if pr.pr_status in ['FULLY_ORDERED', 'CLOSED', 'CANCELLED']:
            return Response(
                {'error': f'Cannot cancel PR in {pr.pr_status} status'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check if any lines are ordered
        if pr.lines.filter(already_ordered_qty__gt=0).exists():
             return Response(
                {'error': 'Cannot cancel PR with ordered lines'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        pr.pr_status = 'CANCELLED'
        pr.save()
        
        # Cancel all lines
        pr.lines.update(line_status='CANCELLED')
        
        return Response(PurchaseRequisitionSerializer(pr).data)


class PurchaseRequisitionLineViewSet(viewsets.ModelViewSet):
    """Purchase Requisition Line ViewSet"""
    queryset = PurchaseRequisitionLine.objects.all().select_related('item', 'uom', 'item_variant')
    serializer_class = PurchaseRequisitionLineSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_requisition', 'line_status']
