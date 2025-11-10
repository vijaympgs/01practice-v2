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
    PurchaseReturn, PurchaseReturnItem
)

from .serializers import (
    PurchaseRequestSerializer, PurchaseRequestCreateSerializer, PurchaseRequestItemSerializer,
    PurchaseEnquirySerializer, PurchaseEnquiryItemSerializer,
    PurchaseQuotationSerializer, PurchaseQuotationItemSerializer,
    PurchaseOrderSerializer, PurchaseOrderItemSerializer,
    GoodsReceivedNoteSerializer, GoodsReceivedNoteItemSerializer,
    PurchaseInvoiceSerializer, PurchaseInvoiceItemSerializer,
    PurchaseReturnSerializer, PurchaseReturnItemSerializer
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
