"""
Procurement URLs
NewBorn Retail™ - AI-Powered Enterprise ERP System
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PurchaseRequestViewSet, PurchaseRequestItemViewSet,
    PurchaseEnquiryViewSet, PurchaseEnquiryItemViewSet,
    PurchaseQuotationViewSet, PurchaseQuotationItemViewSet,
    PurchaseOrderViewSet, PurchaseOrderItemViewSet,
    GoodsReceivedNoteViewSet, GoodsReceivedNoteItemViewSet,
    PurchaseInvoiceViewSet, PurchaseInvoiceItemViewSet,
    PurchaseReturnViewSet, PurchaseReturnItemViewSet
)

router = DefaultRouter()

# Purchase Requests
router.register(r'purchase-requests', PurchaseRequestViewSet, basename='purchase-request')
router.register(r'purchase-request-items', PurchaseRequestItemViewSet, basename='purchase-request-item')

# Purchase Enquiries
router.register(r'purchase-enquiries', PurchaseEnquiryViewSet, basename='purchase-enquiry')
router.register(r'purchase-enquiry-items', PurchaseEnquiryItemViewSet, basename='purchase-enquiry-item')

# Purchase Quotations
router.register(r'purchase-quotations', PurchaseQuotationViewSet, basename='purchase-quotation')
router.register(r'purchase-quotation-items', PurchaseQuotationItemViewSet, basename='purchase-quotation-item')

# Purchase Orders
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'purchase-order-items', PurchaseOrderItemViewSet, basename='purchase-order-item')

# GRNs
router.register(r'grns', GoodsReceivedNoteViewSet, basename='grn')
router.register(r'grn-items', GoodsReceivedNoteItemViewSet, basename='grn-item')

# Purchase Invoices
router.register(r'purchase-invoices', PurchaseInvoiceViewSet, basename='purchase-invoice')
router.register(r'purchase-invoice-items', PurchaseInvoiceItemViewSet, basename='purchase-invoice-item')

# Purchase Returns
router.register(r'purchase-returns', PurchaseReturnViewSet, basename='purchase-return')
router.register(r'purchase-return-items', PurchaseReturnItemViewSet, basename='purchase-return-item')

urlpatterns = [
    path('', include(router.urls)),
]

