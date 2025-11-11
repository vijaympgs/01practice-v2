import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { store } from './store';
import { LayoutProvider } from './contexts/LayoutContext';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ActiveOperationProvider } from './contexts/ActiveOperationContext';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/common/PrivateRoute';
import LocationGuard from './components/common/LocationGuard';
import './utils/browserTitle'; // Initialize browser title manager
import Login from './pages/Auth/Login';
import LoginNew from './pages/Auth/LoginNew';
import Register from './pages/Auth/Register';
import LocationSelectionPage from './pages/Auth/LocationSelectionPage';
import UnderConstruction from './pages/UnderConstruction';
import DashboardModern from './pages/Dashboard/DashboardModern';
import SimpleCustomerPage from './pages/SimpleCustomerPage';
import SimpleVendorPage from './pages/SimpleVendorPage';
import InventoryPage from './pages/InventoryPage';
import UsersPage from './pages/UsersPage';
import UserAndPermissionPage from './pages/Users/UserAndPermissionPage';
import POSFunctionMappingPage from './pages/Users/POSFunctionMappingPage';
import SalesPage from './pages/SalesPage';
import SecurityPage from './pages/Security/SecurityPage';
import BusinessRulesPage from './pages/BusinessRules/BusinessRulesPage';
import LayoutPreferencesPage from './pages/Settings/LayoutPreferencesPage';
import DatabaseClientPage from './pages/Settings/DatabaseClientPage';
import HtmlPreviewTool from './pages/Admin/HtmlPreviewTool';
import DigitalMarketingConsole from './pages/Admin/DigitalMarketingConsole';
import WebConsole from './pages/Admin/WebConsole';
import POSMastersPage from './pages/POSMasters/POSMastersPage';
import CodeSettingsPage from './pages/CodeSettings/CodeSettingsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import SalesOrderManagementPage from './pages/SalesOrderManagementPage';
import WireframeIndex from './pages/Wireframes/WireframeIndex';

// Organization Setup Pages
import UnifiedOrganizationPage from './pages/Organization/UnifiedOrganizationPage';

// Master Data Pages
import GeneralMasterPage from './pages/MasterData/GeneralMasterPage';
import ConfigurationPage from './pages/MasterData/ConfigurationPage';
import UOMSetupPage from './pages/MasterData/UOMSetupPage';
import UOMConversionPage from './pages/MasterData/UOMConversionPage';
import ItemMasterPage from './pages/MasterData/ItemMasterPage';
import AdvancedItemMasterPage from './pages/MasterData/AdvancedItemMasterPage';

// Item Management Pages
import AttributesPage from './pages/Item/AttributesPage';
import AttributeValuesPage from './pages/Item/AttributeValuesPage';
import TaxSetupPage from './pages/MasterData/TaxSetupPage';
import TaxSlabPage from './pages/Item/TaxSlabPage';

// Priority 1 Pages - Master Data
import CompanyMasterPage from './pages/MasterData/CompanyMasterPage';
import ApplicationSetupMasters from './pages/MasterData/ApplicationSetupMasters';
import ConfigurationMasters from './pages/MasterData/ConfigurationMasters';
import EnhancedItemMaster from './pages/MasterData/EnhancedItemMaster';

// Priority 1 Pages - Inventory & Procurement
import ProcurementWorkflowEngine from './pages/Procurement/ProcurementWorkflowEngine';

// Priority 1 Pages - CRM
import AdvancedCustomerMaster from './pages/CRM/AdvancedCustomerMaster';

// Procurement Pages
import PurchaseRequest from './pages/Procurement/PurchaseRequest';
import PurchaseEnquiry from './pages/Procurement/PurchaseEnquiry';
import PurchaseQuotation from './pages/Procurement/PurchaseQuotation';
import PurchaseOrder from './pages/Procurement/PurchaseOrder';
import GoodsReceivedNote from './pages/Procurement/GoodsReceivedNote';
import PurchaseInvoice from './pages/Procurement/PurchaseInvoice';
import PurchaseReturn from './pages/Procurement/PurchaseReturn';
import ProcurementAdvice from './pages/Procurement/ProcurementAdvice';

// Inventory Pages
import SystemGoLive from './pages/Inventory/SystemGoLive';

// Stock Nexus Pages
import InitialSetup from './pages/StockNexus/InitialSetup';
import MovementTracking from './pages/StockNexus/MovementTracking';
import TransferConfirm from './pages/StockNexus/TransferConfirm';
import CountAdjust from './pages/StockNexus/CountAdjust';

// POS Pages
import POSScreen from './pages/POS/POSScreen';
import POSScreenIndexedDB from './pages/POS/POSScreenIndexedDB';
import POSSessionManager from './pages/POS/POSSessionManager';
import POSTestRunner from './pages/POS/POSTestRunner';
import POSStatusCheck from './pages/POS/POSStatusCheck';
import POSSessionManagement from './pages/POS/POSSessionManagement';
import TerminalSetupPage from './pages/POS/TerminalSetupPageEnhanced';
import TerminalConfigurationPageV2 from './pages/POS/TerminalConfigurationPageV2';
import ShiftManagementPage from './pages/POS/ShiftManagementPage';
import SessionManagementPage from './pages/POS/SessionManagementPage';
import SessionOpenPage from './pages/POS/SessionOpenPage';
import SessionClosePage from './pages/POS/SessionClosePage';
import DayOpenPage from './pages/POS/DayOpenPage';
import DayClosePage from './pages/POS/DayClosePage';
import POSBillingEnhanced from './pages/POS/POSBillingEnhanced';
import POSDesktop from './pages/POS/POSDesktop';
import SettlementModuleV2 from './pages/POS/SettlementModuleV2';
import ShiftWorkflowPageV2 from './pages/POS/ShiftWorkflowPageV2';
import CustomerReceivablesModule from './pages/POS/CustomerReceivablesModule';
import HomeDeliveryConfirmationModule from './pages/POS/HomeDeliveryConfirmationModule';
import DayEndProcessModule from './pages/POS/DayEndProcessModule';
import CodeMasterModule from './pages/POS/CodeMasterModule';

// Advanced POS Modules
import AdvancedTerminalFeatures from './pages/POS/AdvancedTerminalFeatures';
import AdvancedSettlementModule from './pages/POS/AdvancedSettlementModule';
import AdvancedReceivablesModule from './pages/POS/AdvancedReceivablesModule';
import AdvancedDeliveryModule from './pages/POS/AdvancedDeliveryModule';
import AdvancedDayEndModule from './pages/POS/AdvancedDayEndModule';

// Archive Pages
import ArchiveProducts from './pages/Archive/ArchiveProducts';
import ArchiveCategories from './pages/Archive/ArchiveCategories';
import ArchiveCustomers from './pages/Archive/ArchiveCustomers';
import ArchiveSuppliers from './pages/Archive/ArchiveSuppliers';
import ArchivePurchaseOrders from './pages/Archive/ArchivePurchaseOrders';
import ArchiveOrders from './pages/Archive/ArchiveOrders';
import ArchiveSales from './pages/Archive/ArchiveSales';
import ArchiveReports from './pages/Archive/ArchiveReports';
import ArchiveInventoryControl from './pages/Archive/ArchiveInventoryControl';
import ArchiveInventory from './pages/Archive/ArchiveInventory';

// Create Material-UI theme with OptiMind Retail™ branding
const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0', // Deep Blue - Primary brand color
      light: '#2196F3', // Electric Blue - Light variant
      dark: '#0D47A1', // Dark Blue - Dark variant
    },
    secondary: {
      main: '#FF5722', // Orange - Secondary brand color
      light: '#FF8A65', // Light Orange
      dark: '#D84315', // Dark Orange
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1565C0', // Deep Blue for primary text
      secondary: '#666666', // Gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#1565C0',
    },
    h2: {
      fontWeight: 600,
      color: '#1565C0',
    },
    h3: {
      fontWeight: 600,
      color: '#1565C0',
    },
    h4: {
      fontWeight: 600,
      color: '#1565C0',
    },
    h5: {
      fontWeight: 600,
      color: '#1565C0',
    },
    h6: {
      fontWeight: 600,
      color: '#1565C0',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1565C0',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 0,
        },
        containedPrimary: {
          backgroundColor: '#1565C0',
          '&:hover': {
            backgroundColor: '#0D47A1',
          },
        },
        containedSecondary: {
          backgroundColor: '#FF5722',
          '&:hover': {
            backgroundColor: '#D84315',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
});

/**
 * CatchAllRoute Component
 * Handles unknown routes - redirects to login if not authenticated, otherwise to dashboard
 * This ensures users must always go through login before accessing the application
 */
const CatchAllRoute = React.memo(() => {
  // This component needs to be inside Provider, so we'll use a wrapper
  return <CatchAllRouteInner />;
});

const CatchAllRouteInner = React.memo(() => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  console.log('CatchAllRoute: isAuthenticated =', isAuthenticated);
  
  // Always redirect to login if not authenticated
  // If authenticated, redirect to dashboard (which will go through PrivateRoute)
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
});

const App = React.memo(() => {
  // Debug logging
  console.log('App component rendering...');
  
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <LayoutProvider>
            <UserRoleProvider>
              <ActiveOperationProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Authentication routes - public access */}
                <Route path="/login" element={<Login />} />
                <Route path="/login_new" element={<LoginNew />} />
                <Route path="/register" element={<Register />} />
                
                {/* Main application with layout - protected routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<LocationGuard />}>
                    <Route path="/location-selection" element={<LocationSelectionPage />} />
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<DashboardModern />} />
                      <Route path="/dashboard" element={<DashboardModern />} />
                      <Route path="/home" element={<DashboardModern />} />
                      <Route path="/under-construction" element={<UnderConstruction />} />
                  
                  {/* Organization Setup Routes */}
                  <Route path="/organization" element={<UnifiedOrganizationPage />} />
                  
                  {/* Master Data Routes */}
                  <Route path="/master-data/general" element={<GeneralMasterPage />} />
                  <Route path="/master-data/configuration" element={<ConfigurationPage />} />
                  <Route path="/master-data/uom-setup" element={<UOMSetupPage />} />
                  <Route path="/master-data/uom-conversion" element={<UOMConversionPage />} />
                  <Route path="/master-data/customers" element={<SimpleCustomerPage />} />
                  <Route path="/master-data/vendors" element={<SimpleVendorPage />} />
                  
                  {/* Item Management Routes */}
                  <Route path="/item/attributes" element={<AttributesPage />} />
                  <Route path="/item/attribute-values" element={<AttributeValuesPage />} />
                  <Route path="/item/tax-setup" element={<TaxSetupPage />} />
                  <Route path="/item/tax-slab" element={<TaxSlabPage />} />
                  <Route path="/item/item-master" element={<ItemMasterPage />} />
                  <Route path="/item/advanced-item-master" element={<AdvancedItemMasterPage />} />
                  <Route path="/company-master" element={<CompanyMasterPage />} />
                  <Route path="/setup-masters" element={<ApplicationSetupMasters />} />
                  <Route path="/configuration-masters" element={<ConfigurationMasters />} />
                  <Route path="/enhanced-item-master" element={<EnhancedItemMaster />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/user-permissions" element={<UserAndPermissionPage />} />
                  <Route path="/user-permissions/pos-functions" element={<POSFunctionMappingPage />} />
                  
                  {/* Security Module */}
                  <Route path="/security" element={<SecurityPage />} />
                  
                  {/* Business Rules Module */}
                  <Route path="/business-rules" element={<BusinessRulesPage />} />
                  <Route path="/business-rules/general" element={<BusinessRulesPage />} />
                  
                  {/* DataOps Studio */}
                  <Route path="/settings/dataops-studio" element={<DatabaseClientPage />} />
                  
                  {/* Pay Mode Module */}
                  
                  {/* POS Masters Module */}
                  <Route path="/pos-masters" element={<POSMastersPage />} />
                  <Route path="/code-settings" element={<CodeSettingsPage />} />
                  
                  {/* Inventory & Procurement Routes */}
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/procurement-workflows" element={<ProcurementWorkflowEngine />} />
                  <Route path="/purchases" element={<PurchaseOrdersPage />} />
                  
                  {/* Sales & CRM Routes */}
                  <Route path="/sales" element={<SalesPage />} />
                  <Route path="/sales-order-management" element={<SalesOrderManagementPage />} />
                  <Route path="/customer-management" element={<AdvancedCustomerMaster />} />
                  
                  {/* POS Routes */}
                  <Route path="/pos" element={<POSScreen />} />
                  <Route path="/pos-indexeddb" element={<POSScreenIndexedDB />} />
                  <Route path="/pos-session-manager" element={<POSSessionManager />} />
                  <Route path="/pos-test-runner" element={<POSTestRunner />} />
                  <Route path="/pos-status-check" element={<POSStatusCheck />} />
                  <Route path="/pos-sessions" element={<POSSessionManagement />} />
                  <Route path="/pos/terminal-setup" element={<TerminalSetupPage />} />
                  <Route path="/pos/terminal-configuration" element={<TerminalConfigurationPageV2 />} />
                  <Route path="/pos/day-open" element={<DayOpenPage />} />
                  <Route path="/pos/session-open" element={<SessionOpenPage />} />
                  <Route path="/pos/shift-management" element={<ShiftManagementPage />} />
                  <Route path="/pos/session-management" element={<SessionManagementPage />} />
                  <Route path="/pos/desktop" element={<POSDesktop />} />
                  <Route path="/pos/billing" element={<POSDesktop />} />
                  <Route path="/pos/settlement" element={<SettlementModuleV2 routePrefix="/pos" condensed showHeader={false} />} />
                  <Route path="/pos/session-close" element={<SessionClosePage />} />
                  <Route path="/pos/day-close" element={<DayClosePage />} />
                  <Route path="/pos/customer-receivables" element={<CustomerReceivablesModule />} />
                  <Route path="/pos/home-delivery" element={<HomeDeliveryConfirmationModule />} />
                  <Route path="/pos/day-end" element={<DayEndProcessModule />} />
                  <Route path="/pos/code-master" element={<CodeMasterModule />} />
                  
                  {/* Advanced POS Modules */}
                  <Route path="/pos/advanced-terminal-features" element={<AdvancedTerminalFeatures />} />
                  <Route path="/pos/advanced-settlement" element={<AdvancedSettlementModule />} />
                  <Route path="/pos/advanced-receivables" element={<AdvancedReceivablesModule />} />
                  <Route path="/pos/advanced-delivery" element={<AdvancedDeliveryModule />} />
                  <Route path="/pos/advanced-day-end" element={<AdvancedDayEndModule />} />
                  
                  {/* POS V2 Prototype Routes */}
                  <Route path="/posv2/terminal-configuration" element={<TerminalConfigurationPageV2 />} />
                  <Route path="/posv2/day-open" element={<DayOpenPage routePrefix="/posv2" />} />
                  <Route path="/posv2/session-open" element={<SessionOpenPage routePrefix="/posv2" />} />
                  <Route path="/posv2/desktop" element={<POSDesktop />} />
                  <Route path="/posv2/settlement" element={<SettlementModuleV2 routePrefix="/posv2" />} />
                  <Route path="/posv2/session-close" element={<SessionClosePage routePrefix="/posv2" />} />
                  <Route path="/posv2/day-end" element={<DayEndProcessModule />} />
                  <Route path="/posv2/day-close" element={<DayClosePage routePrefix="/posv2" />} />
                  <Route path="/posv2/shift-workflow" element={<ShiftWorkflowPageV2 />} />

                  {/* Reports & Settings */}
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/settings/layout-preferences" element={<LayoutPreferencesPage />} />
                  <Route path="/settings/digital-marketing" element={<DigitalMarketingConsole />} />
                  <Route path="/settings/html-preview" element={<HtmlPreviewTool />} />
                  <Route path="/settings/web-console" element={<WebConsole />} />
                  <Route path="/wireframes" element={<WireframeIndex />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  
        {/* Procurement Routes */}
        <Route path="/procurement/purchase-request" element={<PurchaseRequest />} />
        <Route path="/procurement/purchase-enquiry" element={<PurchaseEnquiry />} />
        <Route path="/procurement/purchase-quotation" element={<PurchaseQuotation />} />
        <Route path="/procurement/purchase-order" element={<PurchaseOrder />} />
        <Route path="/procurement/goods-received-note" element={<GoodsReceivedNote />} />
        <Route path="/procurement/purchase-invoice" element={<PurchaseInvoice />} />
        <Route path="/procurement/purchase-return" element={<PurchaseReturn />} />
        <Route path="/procurement/procurement-advice" element={<ProcurementAdvice />} />

        {/* Inventory Routes */}
        <Route path="/inventory/system-go-live" element={<SystemGoLive />} />

        {/* Stock Nexus Routes */}
        <Route path="/stock-nexus/initial-setup" element={<InitialSetup />} />
        <Route path="/stock-nexus/movement-tracking" element={<MovementTracking />} />
        <Route path="/stock-nexus/transfer-confirm" element={<TransferConfirm />} />
        <Route path="/stock-nexus/count-adjust" element={<CountAdjust />} />

        {/* Archive Routes */}
        <Route path="/archive/products" element={<ArchiveProducts />} />
        <Route path="/archive/categories" element={<ArchiveCategories />} />
        <Route path="/archive/customers" element={<ArchiveCustomers />} />
        <Route path="/archive/suppliers" element={<ArchiveSuppliers />} />
        <Route path="/archive/purchase-orders" element={<ArchivePurchaseOrders />} />
        <Route path="/archive/orders" element={<ArchiveOrders />} />
        <Route path="/archive/sales" element={<ArchiveSales />} />
        <Route path="/archive/reports" element={<ArchiveReports />} />
        <Route path="/archive/inventory-control" element={<ArchiveInventoryControl />} />
        <Route path="/archive/inventory" element={<ArchiveInventory />} />
                    </Route>
                  </Route>
                </Route>

                {/* Catch all - redirect to login if not authenticated, otherwise to dashboard */}
                <Route path="*" element={<CatchAllRoute />} />
              </Routes>
            </BrowserRouter>
              </ActiveOperationProvider>
            </UserRoleProvider>
          </LayoutProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Provider>
  );
});

export default App;
