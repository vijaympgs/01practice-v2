import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import { getMenuCategories } from '../../utils/menuStructure';

const componentRegistry = {
  '/': '../Dashboard/DashboardModern.jsx',
  '/dashboard': '../Dashboard/DashboardModern.jsx',
  '/home': '../Dashboard/DashboardModern.jsx',
  '/under-construction': '../UnderConstruction.jsx',
  '/organization': '../Organization/UnifiedOrganizationPage.jsx',
  '/master-data/general': '../MasterData/GeneralMasterPage.jsx',
  '/master-data/configuration': '../MasterData/ConfigurationPage.jsx',
  '/master-data/uom-setup': '../MasterData/UOMSetupPage.jsx',
  '/master-data/uom-conversion': '../MasterData/UOMConversionPage.jsx',
  '/master-data/customers': '../SimpleCustomerPage.jsx',
  '/master-data/vendors': '../SimpleVendorPage.jsx',
  '/item/attributes': '../Item/AttributesPage.jsx',
  '/item/attribute-values': '../Item/AttributeValuesPage.jsx',
  '/item/tax-setup': '../MasterData/TaxSetupPage.jsx',
  '/item/tax-slab': '../Item/TaxSlabPage.jsx',
  '/item/item-master': '../MasterData/ItemMasterPage.jsx',
  '/item/advanced-item-master': '../MasterData/AdvancedItemMasterPage.jsx',
  '/company-master': '../MasterData/CompanyMasterPage.jsx',
  '/setup-masters': '../MasterData/ApplicationSetupMasters.jsx',
  '/configuration-masters': '../MasterData/ConfigurationMasters.jsx',
  '/enhanced-item-master': '../MasterData/EnhancedItemMaster.jsx',
  '/users': '../UsersPage.jsx',
  '/user-permissions': '../Users/UserAndPermissionPage.jsx',
  '/user-permissions/pos-functions': '../Users/POSFunctionMappingPage.jsx',
  '/security': '../Security/SecurityPage.jsx',
  '/business-rules': '../BusinessRules/BusinessRulesPage.jsx',
  '/business-rules/general': '../BusinessRules/BusinessRulesPage.jsx',
  '/settings/dataops-studio': '../Settings/DatabaseClientPage.jsx',
  '/pos-masters': '../POSMasters/POSMastersPage.jsx',
  '/code-settings': '../CodeSettings/CodeSettingsPage.jsx',
  '/inventory': '../InventoryPage.jsx',
  '/inventory/system-go-live': '../Inventory/SystemGoLive.jsx',
  '/procurement-workflows': '../Procurement/ProcurementWorkflowEngine.jsx',
  '/purchases': '../PurchaseOrdersPage.jsx',
  '/sales': '../SalesPage.jsx',
  '/sales-order-management': '../SalesOrderManagementPage.jsx',
  '/customer-management': '../CRM/AdvancedCustomerMaster.jsx',
  '/pos': '../POS/POSScreen.jsx',
  '/pos-indexeddb': '../POS/POSScreenIndexedDB.jsx',
  '/pos-session-manager': '../POS/POSSessionManager.jsx',
  '/pos-test-runner': '../POS/POSTestRunner.jsx',
  '/pos-status-check': '../POS/POSStatusCheck.jsx',
  '/pos-sessions': '../POS/POSSessionManagement.jsx',
  '/pos/terminal-setup': '../POS/TerminalSetupPageEnhanced.jsx',
  '/pos/terminal-configuration': '../POS/TerminalConfigurationPageV2.jsx',
  '/pos/day-open': '../POS/DayOpenPage.jsx',
  '/pos/session-open': '../POS/SessionOpenPage.jsx',
  '/pos/shift-management': '../POS/ShiftManagementPage.jsx',
  '/pos/session-management': '../POS/SessionManagementPage.jsx',
  '/pos/desktop': '../POS/POSDesktop.jsx',
  '/pos/billing': '../POS/POSDesktop.jsx',
  '/pos/settlement': '../POS/SettlementModuleV2.jsx',
  '/pos/session-close': '../POS/SessionClosePage.jsx',
  '/pos/day-close': '../POS/DayClosePage.jsx',
  '/pos/customer-receivables': '../POS/CustomerReceivablesModule.jsx',
  '/pos/home-delivery': '../POS/HomeDeliveryConfirmationModule.jsx',
  '/pos/day-end': '../POS/DayEndProcessModule.jsx',
  '/pos/code-master': '../POS/CodeMasterModule.jsx',
  '/pos/advanced-terminal-features': '../POS/AdvancedTerminalFeatures.jsx',
  '/pos/advanced-settlement': '../POS/AdvancedSettlementModule.jsx',
  '/pos/advanced-receivables': '../POS/AdvancedReceivablesModule.jsx',
  '/pos/advanced-delivery': '../POS/AdvancedDeliveryModule.jsx',
  '/pos/advanced-day-end': '../POS/AdvancedDayEndModule.jsx',
  '/posv2/terminal-configuration': '../POS/TerminalConfigurationPageV2.jsx',
  '/posv2/day-open': '../POS/DayOpenPage.jsx',
  '/posv2/session-open': '../POS/SessionOpenPage.jsx',
  '/posv2/desktop': '../POS/POSDesktop.jsx',
  '/posv2/settlement': '../POS/SettlementModuleV2.jsx',
  '/posv2/session-close': '../POS/SessionClosePage.jsx',
  '/posv2/day-end': '../POS/DayEndProcessModule.jsx',
  '/posv2/day-close': '../POS/DayClosePage.jsx',
  '/posv2/shift-workflow': '../POS/ShiftWorkflowPageV2.jsx',
  '/reports': '../ReportsPage.jsx',
  '/settings': '../SettingsPage.jsx',
  '/settings/layout-preferences': '../Settings/LayoutPreferencesPage.jsx',
  '/settings/digital-marketing': '../Admin/DigitalMarketingConsole.jsx',
  '/settings/web-console': '../Admin/WebConsole.jsx',
  '/profile': '../ProfilePage.jsx',
  '/procurement/purchase-request': '../Procurement/PurchaseRequest.jsx',
  '/procurement/purchase-enquiry': '../Procurement/PurchaseEnquiry.jsx',
  '/procurement/purchase-quotation': '../Procurement/PurchaseQuotation.jsx',
  '/procurement/purchase-order': '../Procurement/PurchaseOrder.jsx',
  '/procurement/goods-received-note': '../Procurement/GoodsReceivedNote.jsx',
  '/procurement/purchase-invoice': '../Procurement/PurchaseInvoice.jsx',
  '/procurement/purchase-return': '../Procurement/PurchaseReturn.jsx',
  '/procurement/procurement-advice': '../Procurement/ProcurementAdvice.jsx',
  '/stock-nexus/initial-setup': '../StockNexus/InitialSetup.jsx',
  '/stock-nexus/movement-tracking': '../StockNexus/MovementTracking.jsx',
  '/stock-nexus/transfer-confirm': '../StockNexus/TransferConfirm.jsx',
  '/stock-nexus/count-adjust': '../StockNexus/CountAdjust.jsx',
  '/wireframes': '../Wireframes/WireframeIndex.jsx',
};

const componentLoaders = import.meta.glob('../**/*.jsx');
const codeLoaders = import.meta.glob('../**/*.jsx', { as: 'raw' });

const SidebarContainer = styled(Paper)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  borderRadius: theme.shape.borderRadius,
  borderColor: alpha(theme.palette.divider, 0.7),
  padding: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

const Panel = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  borderColor: alpha(theme.palette.divider, 0.7),
  minHeight: 480,
}));

const CodeBlock = styled('pre')(({ theme }) => ({
  flex: 1,
  margin: 0,
  padding: theme.spacing(2),
  overflow: 'auto',
  backgroundColor: '#0b1120',
  color: '#cbd5f5',
  fontFamily: '"Fira Code", Menlo, Consolas, monospace',
  fontSize: 13,
  borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
}));

const getTreeData = () => {
  const rawCategories = getMenuCategories({});

  const sanitizeItems = (category) => {
    const seenPaths = new Set();
    const effectiveItems = [];

    const pushItem = (item) => {
      if (!item || !item.path) return;
      if (item.hidden) return;
      if (seenPaths.has(item.path)) return;
      seenPaths.add(item.path);
      effectiveItems.push({
        text: item.text || category.title,
        path: item.path,
        moduleName: item.moduleName,
      });
    };

    if (category.path) {
      pushItem({
        text: category.title,
        path: category.path,
        moduleName: category.type?.toLowerCase(),
      });
    }

    (category.items || []).forEach(pushItem);

    return effectiveItems;
  };

  return rawCategories
    .filter((category) => category && !category.hidden)
    .map((category) => ({
      id: category.type || category.title,
      title: category.title,
      description: category.description,
      items: sanitizeItems(category),
    }))
    .filter((category) => category.items.length > 0);
};

const HtmlPreviewTool = () => {
  const theme = useTheme();
  const categories = useMemo(() => getTreeData(), []);
  const [selectedPath, setSelectedPath] = useState(() => {
    const firstCategory = categories[0];
    return firstCategory ? firstCategory.items[0]?.path : null;
  });
  const [filePath, setFilePath] = useState(() =>
    selectedPath ? componentRegistry[selectedPath] : null
  );
  const [code, setCode] = useState('');
  const [previewComponent, setPreviewComponent] = useState(() => null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [activeTab, setActiveTab] = useState('source');

  useEffect(() => {
    if (!selectedPath) {
      setFilePath(null);
      setCode('');
      setPreviewComponent(() => null);
      setLoadError(null);
      return;
    }
    const targetFile = componentRegistry[selectedPath];
    setFilePath(targetFile || null);
  }, [selectedPath]);

  useEffect(() => {
    if (!filePath) {
      setCode('');
      setPreviewComponent(() => null);
      setLoadError('No preview available for this screen.');
      return;
    }

    const componentLoader = componentLoaders[filePath];
    const codeLoader = codeLoaders[filePath];

    let active = true;
    setLoadError(null);
    setPreviewComponent(() => null);
    setCode('');

    if (codeLoader) {
      setLoadingCode(true);
      codeLoader()
        .then((raw) => {
          if (!active) return;
          setCode(raw);
        })
        .catch((error) => {
          if (!active) return;
          console.error('HtmlPreviewTool: failed to load source', error);
          setCode('// Source unavailable. Check console for details.');
        })
        .finally(() => {
          if (active) setLoadingCode(false);
        });
    } else {
      setCode('// Source unavailable for this screen.');
      setLoadingCode(false);
    }

    if (componentLoader) {
      setLoadingPreview(true);
      setLoadError(null);
      componentLoader()
        .then((module) => {
          if (!active) return;
          const Component = module?.default || module;
          if (!Component) {
            setPreviewComponent(() => null);
            setLoadError('Component exported without default render.');
            return;
          }
          setPreviewComponent(() => Component);
        })
        .catch((error) => {
          if (!active) return;
          console.error('HtmlPreviewTool: failed to load component', error);
          setPreviewComponent(() => null);
          setLoadError('Unable to render this screen in isolation.');
        })
        .finally(() => {
          if (active) setLoadingPreview(false);
        });
    } else {
      setLoadingPreview(false);
      setPreviewComponent(() => null);
      setLoadError('Preview component not registered.');
    }

    return () => {
      active = false;
    };
  }, [filePath, reloadToken]);

  const handleRefresh = () => {
    if (!filePath) return;
    setReloadToken((token) => token + 1);
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).catch((error) => {
      console.error('HtmlPreviewTool: copy failed', error);
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        px: { xs: 1.5, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Admin • HTML Console
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Explore wireframes by module, inspect their JSX, and review the live markup render. No data
          plumbing—just the UI surface.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2.5}
        alignItems="stretch"
        sx={{ flex: 1 }}
      >
        <SidebarContainer variant="outlined">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Wireframe Explorer
            </Typography>
            <Tooltip title="Force reload">
              <span>
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={!filePath}
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          <Divider />
          {categories.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                No screens mapped yet.
              </Typography>
            </Stack>
          ) : (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <List
                disablePadding
                subheader={
                  <ListSubheader component="div" sx={{ bgcolor: 'transparent', px: 0, fontWeight: 600 }}>
                    All Screens
                  </ListSubheader>
                }
              >
                {categories.map((category) => (
                  <Box key={category.id} sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, px: 0.5, mb: 0.5, textTransform: 'uppercase', fontSize: 11, color: 'text.secondary' }}>
                      {category.title}
                    </Typography>
                    <List disablePadding dense>
                      {category.items.map((item) => (
                        <ListItemButton
                          key={item.path}
                          selected={selectedPath === item.path}
                          onClick={() => setSelectedPath(item.path)}
                          sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.12),
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                              },
                            },
                          }}
                        >
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{ fontSize: 13, fontWeight: selectedPath === item.path ? 600 : 400 }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>
                ))}
              </List>
            </Box>
          )}
        </SidebarContainer>

        <Stack spacing={2.5} sx={{ flex: 1, minHeight: 520 }}>
          <Panel variant="outlined">
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              aria-label="HTML console tabs"
              sx={{
                px: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              }}
            >
              <Tab
                label="Source"
                value="source"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              />
              <Tab
                label="Preview"
                value="preview"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              />
            </Tabs>

            {activeTab === 'source' && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2, py: 1, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}` }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Source Viewer
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {filePath ? filePath.replace('../', 'src/pages/') : 'Select a screen from the explorer'}
                    </Typography>
                  </Box>
                  <Tooltip title="Copy code">
                    <span>
                      <IconButton size="small" onClick={handleCopyCode} disabled={!code}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
                {loadingCode ? (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ flex: 1, py: 4 }}
                    spacing={1}
                  >
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                      Loading source...
                    </Typography>
                  </Stack>
                ) : (
                  <CodeBlock>{code || '// Select a screen to view its JSX'}</CodeBlock>
                )}
              </Box>
            )}

            {activeTab === 'preview' && (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: alpha(theme.palette.background.default, 0.6),
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, px: 1 }}
                >
                  Rendered without backend wiring—layout only.
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {loadingPreview ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Loading preview...
                      </Typography>
                    </Stack>
                  ) : loadError ? (
                    <Stack spacing={1} alignItems="center" justifyContent="center" textAlign="center">
                      <WarningAmberRoundedIcon color="warning" />
                      <Typography variant="body2" color="text.secondary">
                        {loadError}
                      </Typography>
                    </Stack>
                  ) : previewComponent ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        overflow: 'auto',
                        borderRadius: theme.shape.borderRadius,
                        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                        p: 2,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      {React.createElement(previewComponent)}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Select a screen to preview its UI shell.
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Panel>
        </Stack>
      </Stack>
    </Box>
  );
};

export default HtmlPreviewTool;
