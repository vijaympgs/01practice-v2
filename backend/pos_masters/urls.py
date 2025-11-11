from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    POSMasterViewSet, 
    POSMasterSettingsViewSet, 
    POSMasterMappingViewSet,
    CurrencyDenominationViewSet,
    SettlementReasonViewSet,
    TerminalViewSet,
    PrinterTemplateViewSet,
    TerminalTransactionSettingViewSet,
    TerminalTenderMappingViewSet,
    TerminalDepartmentMappingViewSet
)

router = DefaultRouter()
router.register(r'masters', POSMasterViewSet)
router.register(r'settings', POSMasterSettingsViewSet, basename='pos-master-settings')
router.register(r'mappings', POSMasterMappingViewSet)
router.register(r'currency-denominations', CurrencyDenominationViewSet, basename='currency-denominations')
router.register(r'settlement-reasons', SettlementReasonViewSet, basename='settlement-reasons')
router.register(r'terminals', TerminalViewSet, basename='terminals')
router.register(r'printer-templates', PrinterTemplateViewSet, basename='printer-templates')
router.register(r'terminal-transaction-settings', TerminalTransactionSettingViewSet, basename='terminal-transaction-settings')
router.register(r'terminal-tender-mappings', TerminalTenderMappingViewSet, basename='terminal-tender-mappings')
router.register(r'terminal-department-mappings', TerminalDepartmentMappingViewSet, basename='terminal-department-mappings')

urlpatterns = [
    path('', include(router.urls)),
]
