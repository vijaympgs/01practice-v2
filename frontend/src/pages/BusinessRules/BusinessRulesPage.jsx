import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageTitle from '../../components/common/PageTitle';
import {
  Box,
  Container,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Chip,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Slider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Refresh as RefreshIcon, History as HistoryIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { businessRulesService } from '../../services/businessRulesService';
import { payModeService } from '../../services/payModeService';

const BusinessRulesPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [historyDialog, setHistoryDialog] = useState({ open: false, rule: null, history: [] });
  const [sectionMenuAnchor, setSectionMenuAnchor] = useState(null);
  const [sectionMenuRules, setSectionMenuRules] = useState([]);
  const [sectionMenuAction, setSectionMenuAction] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandAll, setExpandAll] = useState(true);
  const [settlementSettings, setSettlementSettings] = useState(null);
  const [settlementLoading, setSettlementLoading] = useState(true);
  const [settlementSaving, setSettlementSaving] = useState(false);
  const [payModeSettings, setPayModeSettings] = useState(null);
  const [payModeLoading, setPayModeLoading] = useState(true);
  const [payModeSaving, setPayModeSaving] = useState(false);
  const [payModeInputs, setPayModeInputs] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentMethodsSaving, setPaymentMethodsSaving] = useState(false);
  const [payModeDialog, setPayModeDialog] = useState({ open: false, mode: 'new', method: null });
  const [payModeHistoryDialog, setPayModeHistoryDialog] = useState({ open: false, method: null, history: [] });
  
  const scrollToSection = useCallback((id, updateHash = false) => {
    if (!id) return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (updateHash) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  }, []);

  // Theme color state

  useEffect(() => {
    loadBusinessRules();
    loadSettlementSettings();
    loadPayModeSettings();
    loadPaymentMethods();
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    if (loading || settlementLoading || payModeLoading || paymentMethodsLoading) return;
    const id = location.hash.substring(1);
    scrollToSection(id);
  }, [location.hash, loading, settlementLoading, payModeLoading, paymentMethodsLoading, scrollToSection]);

  const loadBusinessRules = async () => {
    try {
      setLoading(true);
      const data = await businessRulesService.getAllRules();
      setRules(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load business rules: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadSettlementSettings = async () => {
    try {
      setSettlementLoading(true);
      const data = await businessRulesService.getSettlementSettings();
      setSettlementSettings(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load settlement settings: ' + error.message, severity: 'error' });
    } finally {
      setSettlementLoading(false);
    }
  };

  const loadPayModeSettings = async () => {
    try {
      setPayModeLoading(true);
      const data = await payModeService.getSettings();
      setPayModeSettings(data);
      setPayModeInputs(data || {});
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load pay mode settings: ' + error.message, severity: 'error' });
    } finally {
      setPayModeLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      setPaymentMethodsLoading(true);
      const data = await payModeService.getAllPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load payment methods: ' + error.message, severity: 'error' });
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  const handleRuleChange = async (rule, newValue) => {
    try {
      setSaving(true);
      await businessRulesService.updateRule(rule.id, { current_value: newValue });
      
      // Update local state
      setRules(prevRules => 
        prevRules.map(r => 
          r.id === rule.id ? { ...r, current_value: newValue } : r
        )
      );
      
      setSnackbar({ open: true, message: 'Rule updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update rule: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async (rule) => {
    try {
      setSaving(true);
      await businessRulesService.resetToDefault(rule.id);
      
      // Update local state
      setRules(prevRules => 
        prevRules.map(r => 
          r.id === rule.id ? { ...r, current_value: r.default_value } : r
        )
      );
      
      setSnackbar({ open: true, message: 'Rule reset to default', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to reset rule: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleViewHistory = async (rule) => {
    try {
      const history = await businessRulesService.getRuleHistory(rule.id);
      setHistoryDialog({ open: true, rule, history });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load history: ' + error.message, severity: 'error' });
    }
  };

  const handleOpenSectionMenu = (event, rules, action) => {
    setSectionMenuAnchor(event.currentTarget);
    setSectionMenuRules(rules);
    setSectionMenuAction(action);
  };

  const handleCloseSectionMenu = () => {
    setSectionMenuAnchor(null);
    setSectionMenuRules([]);
    setSectionMenuAction(null);
  };

  const handleSectionMenuSelect = (rule) => {
    if (sectionMenuAction === 'history') {
      handleViewHistory(rule);
    } else if (sectionMenuAction === 'reset') {
      handleResetToDefault(rule);
    }
    handleCloseSectionMenu();
  };

  const groupedRules = rules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {});

  const settlementCategoriesConfig = useMemo(
    () => [
      {
        key: 'settlement_validation',
        title: 'Settlement Validation',
      fields: [
        {
          name: 'check_suspended_bills',
          label: 'Check for Suspended Bills',
          description: 'Check for suspended bills before allowing settlement',
        },
        {
          name: 'check_partial_transactions',
          label: 'Check for Partial Transactions',
          description: 'Check for partial transactions before allowing settlement',
        },
        {
          name: 'require_settlement_before_session_close',
          label: 'Require Settlement Before Session Close',
          description: 'Require settlement completion before closing session',
        },
      ],
    },
    {
        key: 'session_management',
        title: 'Session Management',
      fields: [
        {
          name: 'allow_deferred_settlement',
          label: 'Allow Deferred Settlement',
          description: 'Allow settlement to be done later (next day)',
        },
        {
          name: 'require_session_ownership_to_close',
          label: 'Require Session Ownership to Close',
          description: 'Only session starter can close the session',
        },
      ],
    },
    {
        key: 'billing_blocks',
        title: 'Billing & Session Blocks',
      fields: [
        {
          name: 'block_billing_on_pending_settlement',
          label: 'Block Billing on Pending Settlement',
          description: 'Block billing if previous session has pending settlement',
        },
        {
          name: 'block_session_start_on_pending_settlement',
          label: 'Block Session Start on Pending Settlement',
          description: 'Block new session start if previous session has pending settlement',
        },
      ],
    },
    {
        key: 'notifications',
        title: 'Notifications',
      fields: [
        {
          name: 'show_pending_settlement_alert',
          label: 'Show Pending Settlement Alert',
          description: 'Show alert for pending settlements on POS open',
        },
        {
          name: 'auto_remind_pending_settlement',
          label: 'Auto Remind Pending Settlement',
          description: 'Automatically remind about pending settlements',
        },
      ],
    },
    ],
    []
  );

  const payModeCategoriesConfig = useMemo(
    () => [
      {
        key: 'general',
        title: 'General Settings',
        fields: [
          {
            name: 'require_payment_confirmation',
            label: 'Require Payment Confirmation',
            description: 'Ask for confirmation before finalizing payments',
          },
          {
            name: 'allow_multiple_payments',
            label: 'Allow Multiple Payments',
            description: 'Permit combining payment methods in a single bill',
          },
        ],
      },
      {
        key: 'cash_handling',
        title: 'Cash Handling',
        fields: [
          {
            name: 'enable_cash_drawer',
            label: 'Enable Cash Drawer',
            description: 'Allow integration with cash drawer hardware',
          },
          {
            name: 'auto_open_cash_drawer',
            label: 'Auto-open Cash Drawer',
            description: 'Automatically open cash drawer after cash payments',
          },
        ],
      },
      {
        key: 'card_settings',
        title: 'Card Settings',
        fields: [
          {
            name: 'enable_card_payments',
            label: 'Enable Card Payments',
            description: 'Allow card transactions at POS',
          },
          {
            name: 'require_card_pin',
            label: 'Require Card PIN',
            description: 'Mandatory PIN entry for card payments',
          },
        ],
      },
      {
        key: 'digital_payments',
        title: 'Digital Payments',
        fields: [
          {
            name: 'enable_upi_payments',
            label: 'Enable UPI Payments',
            description: 'Allow Unified Payments Interface (UPI) transactions',
          },
          {
            name: 'enable_qr_code',
            label: 'Enable QR Code',
            description: 'Display QR codes for digital payment collection',
          },
        ],
      },
      {
        key: 'refund_settings',
        title: 'Refund Settings',
        fields: [
          {
            name: 'allow_refunds',
            label: 'Allow Refunds',
            description: 'Permit refund processing at POS',
          },
          {
            name: 'require_refund_authorization',
            label: 'Require Refund Authorization',
            description: 'Mandate supervisor approval before processing refunds',
          },
          {
            name: 'max_refund_percentage',
            label: 'Maximum Refund Percentage',
            description: 'Upper limit on refundable amount compared to original bill',
            isNumeric: true,
            min: 0,
            max: 100,
            step: 1,
          },
        ],
      },
      {
        key: 'payment_methods',
        title: 'Payment Methods Master',
        fields: [],
      },
    ],
    []
  );

  useEffect(() => {
    const initial = {};
    Object.keys(groupedRules).forEach((key) => {
      initial[`rules:${key}`] = expandAll;
    });
    if (settlementSettings) {
      settlementCategoriesConfig.forEach((category) => {
        initial[`settlement:${category.key}`] = expandAll;
      });
    }
    if (payModeSettings) {
      payModeCategoriesConfig.forEach((category) => {
        initial[`paymode:${category.key}`] = expandAll;
      });
      initial['paymode:refund_settings:percentage'] = expandAll;
    }
    setExpandedSections(initial);
  }, [groupedRules, settlementSettings, payModeSettings, expandAll, settlementCategoriesConfig, payModeCategoriesConfig]);

  const handleExpandCollapseAll = (shouldExpand) => {
    setExpandAll(shouldExpand);
    const updated = {};
    Object.keys(groupedRules).forEach((key) => {
      updated[`rules:${key}`] = shouldExpand;
    });
    if (settlementSettings) {
      settlementCategoriesConfig.forEach((category) => {
        updated[`settlement:${category.key}`] = shouldExpand;
      });
    }
    if (payModeSettings) {
      payModeCategoriesConfig.forEach((category) => {
        updated[`paymode:${category.key}`] = shouldExpand;
      });
      updated['paymode:refund_settings:percentage'] = shouldExpand;
    }
    setExpandedSections(updated);
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !(prev[sectionKey] ?? expandAll),
    }));
  };

  const handleSettlementChange = async (field, value) => {
    try {
      setSettlementSaving(true);
      await businessRulesService.updateSettlementSettings({ [field]: value });
      setSettlementSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
      setSnackbar({ open: true, message: 'Settlement setting updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update settlement setting: ' + error.message, severity: 'error' });
    } finally {
      setSettlementSaving(false);
    }
  };

  const handlePayModeChange = async (field, value) => {
    try {
      setPayModeSaving(true);
      await payModeService.updateSettings({ [field]: value });
      setPayModeSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
      setPayModeInputs((prev) => ({
        ...prev,
        [field]: value,
      }));
      setSnackbar({ open: true, message: 'Pay mode setting updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update pay mode setting: ' + error.message, severity: 'error' });
    } finally {
      setPayModeSaving(false);
    }
  };

  const getPaymentTypeColor = (type) => {
    const colors = {
      cash: '#4CAF50',
      card: '#2196F3',
      upi: '#9C27B0',
      netbanking: '#607D8B',
      wallet: '#E91E63',
      cheque: '#795548',
      credit: '#FF5722',
      other: '#9E9E9E',
    };
    return colors[type] || '#9E9E9E';
  };

  const handleOpenPayModeDialog = (mode, method = null) => {
    setPayModeDialog({ open: true, mode, method });
  };

  const handleClosePayModeDialog = () => {
    setPayModeDialog({ open: false, mode: 'new', method: null });
  };

  const handleSavePayModeMethod = async (formData) => {
    try {
      setPaymentMethodsSaving(true);
      if (payModeDialog.mode === 'edit') {
        await payModeService.updatePaymentMethod(payModeDialog.method.id, formData);
        setSnackbar({ open: true, message: 'Payment method updated successfully', severity: 'success' });
      } else {
        await payModeService.createPaymentMethod(formData);
        setSnackbar({ open: true, message: 'Payment method created successfully', severity: 'success' });
      }
      handleClosePayModeDialog();
      loadPaymentMethods();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save payment method: ' + error.message, severity: 'error' });
    } finally {
      setPaymentMethodsSaving(false);
    }
  };

  const handleViewPayModeMethod = (method) => {
    handleOpenPayModeDialog('view', method);
  };

  const handleEditPayModeMethod = (method) => {
    handleOpenPayModeDialog('edit', method);
  };

  const handleDeletePayModeMethod = async (method) => {
    if (!window.confirm(`Delete "${method.name}"?`)) {
      return;
    }
    try {
      setPaymentMethodsSaving(true);
      await payModeService.deletePaymentMethod(method.id);
      setSnackbar({ open: true, message: 'Payment method deleted successfully', severity: 'success' });
      loadPaymentMethods();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete payment method: ' + error.message, severity: 'error' });
    } finally {
      setPaymentMethodsSaving(false);
    }
  };

  const handleTogglePayModeStatus = async (method) => {
    try {
      setPaymentMethodsSaving(true);
      await payModeService.toggleStatus(method.id, { reason: 'Status toggled from Business Rules' });
      setSnackbar({ open: true, message: 'Payment method status updated', severity: 'success' });
      loadPaymentMethods();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status: ' + error.message, severity: 'error' });
    } finally {
      setPaymentMethodsSaving(false);
    }
  };

  const handleViewPayModeHistory = async (method) => {
    try {
      setPayModeHistoryDialog({ open: true, method, history: [] });
      const history = await payModeService.getMethodHistory(method.id);
      setPayModeHistoryDialog({ open: true, method, history });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load history: ' + error.message, severity: 'error' });
    }
  };

  const handleClosePayModeHistory = () => {
    setPayModeHistoryDialog({ open: false, method: null, history: [] });
  };

  const renderRuleControl = (rule) => {
    const value = rule.current_value;
    
    switch (rule.rule_type) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value === 'true'}
                onChange={(e) => handleRuleChange(rule, e.target.checked.toString())}
                disabled={saving}
                color="primary"
              />
            }
            label={value === 'true' ? 'ON' : 'OFF'}
            sx={{ ml: 0 }}
          />
        );
      
      case 'integer':
        const intValue = parseInt(value) || 0;
        const minVal = rule.validation_rules?.min || 0;
        const maxVal = rule.validation_rules?.max || 100;
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Slider
              value={intValue}
              onChange={(e, newValue) => handleRuleChange(rule, newValue.toString())}
              min={minVal}
              max={maxVal}
              disabled={saving}
              sx={{ width: 200 }}
            />
            <TextField
              value={intValue}
              onChange={(e) => handleRuleChange(rule, e.target.value)}
              type="number"
              size="small"
              sx={{ width: 80 }}
              disabled={saving}
            />
          </Box>
        );
      
      case 'decimal':
        const decValue = parseFloat(value) || 0;
        const decMin = rule.validation_rules?.min || 0;
        const decMax = rule.validation_rules?.max || 100;
        const step = rule.validation_rules?.step || 0.1;
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Slider
              value={decValue}
              onChange={(e, newValue) => handleRuleChange(rule, newValue.toString())}
              min={decMin}
              max={decMax}
              step={step}
              disabled={saving}
              sx={{ width: 200 }}
            />
            <TextField
              value={decValue}
              onChange={(e) => handleRuleChange(rule, e.target.value)}
              type="number"
              size="small"
              sx={{ width: 100 }}
              disabled={saving}
              inputProps={{ step }}
            />
          </Box>
        );
      
      case 'choice':
        const choices = rule.validation_rules?.choices || [];
        
        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={value}
              onChange={(e) => handleRuleChange(rule, e.target.value)}
              disabled={saving}
            >
              {choices.map((choice) => (
                <MenuItem key={choice.value} value={choice.value}>
                  {choice.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'string':
        return (
          <TextField
            value={value}
            onChange={(e) => handleRuleChange(rule, e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            disabled={saving}
          />
        );
      
      default:
        return <Typography variant="body2">{value}</Typography>;
    }
  };

  const getCategoryTitle = (category) => {
    const titles = {
      stock_management: 'Stock Management',
      pricing_quantity: 'Pricing & Quantity',
      discounts_loyalty: 'Discounts & Loyalty',
      rounding_amounts: 'Rounding & Amounts',
      customer_sales: 'Customer & Sales Management',
      billing_documents: 'Billing & Documents',
      advanced_settings: 'Advanced Settings',
    };
    return titles[category] || category;
  };

  const pageIdentifier = '1';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: theme.palette.background.default,
      pb: 3
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}>
              {pageIdentifier}
            </Typography>
      <PageTitle 
              title="Business Rules" 
        subtitle="Configure core POS behavior and preferences" 
              sx={{ m: 0 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => scrollToSection('paymode', true)}
              sx={{ borderRadius: 0 }}
            >
              Go to Pay Mode
            </Button>
            <Button
              size="small"
              variant={expandAll ? 'contained' : 'outlined'}
              onClick={() => handleExpandCollapseAll(true)}
              sx={{ borderRadius: 0 }}
            >
              Expand All
            </Button>
            <Button
              size="small"
              variant={!expandAll ? 'contained' : 'outlined'}
              onClick={() => handleExpandCollapseAll(false)}
              sx={{ borderRadius: 0 }}
            >
              Collapse All
            </Button>
            <Tooltip title="View history for a rule">
              <span>
                <IconButton
                  size="small"
                  onClick={(event) => handleOpenSectionMenu(event, rules, 'history')}
                  disabled={saving || rules.length === 0}
                >
                  <HistoryIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Reset a rule to its default value">
              <span>
                <IconButton
                  size="small"
                  onClick={(event) => handleOpenSectionMenu(event, rules, 'reset')}
                  disabled={saving || rules.length === 0}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {Object.entries(groupedRules).map(([category, categoryRules], sectionIndex) => {
          const sectionNumber = `${pageIdentifier}.${sectionIndex + 1}`;
          const sectionKey = `rules:${category}`;
          const isExpanded = expandedSections[sectionKey] ?? expandAll;

          return (
            <Box key={category} sx={{ mb: 3 }} id={`rules-${sectionIndex + 1}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.grey[800], display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Typography component="span" variant="body2" sx={{ color: theme.palette.primary.main }}>
                    {sectionNumber}
                  </Typography>
                  {getCategoryTitle(category)}
                </Typography>
                <Button
                  size="small"
                  onClick={() => toggleSection(sectionKey)}
            sx={{ 
                    minWidth: 48,
              borderRadius: 0,
                    border: '1px solid',
                    borderColor: 'divider',
                    color: theme.palette.primary.main,
                    lineHeight: 1,
                    fontWeight: 600,
                  }}
                >
                  {isExpanded ? '-' : '+'}
                </Button>
              </Box>
              <Divider sx={{ mb: isExpanded ? 1.5 : 0 }} />

              {isExpanded && (
                <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                  {categoryRules.map((rule, index) => {
                    const ruleNumber = `${sectionNumber}.${index + 1}`;

                    return (
                      <Box
                        component="li"
                        key={rule.id}
                sx={{
                          py: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0,
                          borderTop: index === 0 ? 'none' : '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box
                  sx={{ 
                            display: 'grid',
                            gridTemplateColumns: { xs: 'minmax(0, 1fr) auto' },
                    alignItems: 'center',
                            columnGap: 2,
                            rowGap: 0.75,
                  }}
                >
                          <Typography variant="body2" sx={{ fontWeight: 600, pr: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography component="span" variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                              {ruleNumber}
                </Typography>
                            {rule.name}
                            </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                            {renderRuleControl(rule)}
                            <Box sx={{ minWidth: 72, display: 'flex', justifyContent: 'center' }}>
                              {rule.is_required && <Chip label="Required" size="small" color="error" variant="outlined" />}
                          </Box>
                          </Box>
              </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                          {rule.description}
                          {rule.help_text && (
                            <Box component="span" sx={{ ml: 1 }}>
                              :: ℹ️ {rule.help_text}
                            </Box>
                          )}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
          </Box>
          );
        })}

        {settlementSettings && !settlementLoading && (
          <Box sx={{ mt: 4 }} id="settlement">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}>
                2
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.grey[800] }}>
                Settlement Settings
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Configure settlement validation and session management rules
            </Typography>

            {settlementCategoriesConfig.map((category, index) => {
              const sectionNumber = `2.${index + 1}`;
              const sectionKey = `settlement:${category.key}`;
              const isExpanded = expandedSections[sectionKey] ?? expandAll;

              return (
                <Box key={sectionKey} sx={{ mb: 3 }} id={`settlement-${index + 1}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                <Typography 
                      variant="body1"
                      sx={{ color: theme.palette.grey[800], display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Typography component="span" variant="body2" sx={{ color: theme.palette.primary.main }}>
                        {sectionNumber}
                      </Typography>
                      {category.title}
                    </Typography>
                    <Button
                              size="small" 
                      onClick={() => toggleSection(sectionKey)}
                  sx={{ 
                        minWidth: 48,
                          borderRadius: 0,
                        border: '1px solid',
                        borderColor: 'divider',
                        color: theme.palette.primary.main,
                        lineHeight: 1,
                    fontWeight: 600,
                      }}
                    >
                      {isExpanded ? '-' : '+'}
                    </Button>
                  </Box>
                  <Divider sx={{ mb: isExpanded ? 1.5 : 0 }} />

                  {isExpanded && (
                    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                      {category.fields.map((field, fieldIndex) => {
                        const entryNumber = `${sectionNumber}.${fieldIndex + 1}`;
                        const value = Boolean(settlementSettings?.[field.name]);

                        return (
                          <Box
                            component="li"
                            key={field.name}
                            sx={{
                              py: 1,
                    display: 'flex',
                              flexDirection: 'column',
                              gap: 0,
                              borderTop: fieldIndex === 0 ? 'none' : '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: 'minmax(0, 1fr) auto' },
                    alignItems: 'center',
                                columnGap: 2,
                                rowGap: 0.75,
                  }}
                >
                              <Typography variant="body2" sx={{ fontWeight: 600, pr: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography component="span" variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                                  {entryNumber}
                </Typography>
                                {field.label}
                            </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={value}
                                      onChange={(e) => handleSettlementChange(field.name, e.target.checked)}
                                      disabled={settlementSaving}
                                      color="primary"
                                    />
                                  }
                                  label={value ? 'Enabled' : 'Disabled'}
                                  sx={{ ml: 0 }}
                                />
                                <Box sx={{ minWidth: 72, display: 'flex', justifyContent: 'center' }} />
                              </Box>
              </Box>

                            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                              {field.description}
                              </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                            )}
                          </Box>
              );
            })}
              </Box>
        )}

        {payModeSettings && !payModeLoading && (
          <Box sx={{ mt: 4 }} id="paymode">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}>
                3
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.grey[800] }}>
                Pay Mode Settings
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Configure POS payment method behaviors and rules
            </Typography>

            {payModeCategoriesConfig.map((category, index) => {
              const sectionNumber = `3.${index + 1}`;
              const sectionKey = `paymode:${category.key}`;
              const isExpanded = expandedSections[sectionKey] ?? expandAll;

              return (
                <Box key={sectionKey} sx={{ mb: 3 }} id={`paymode-${index + 1}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.grey[800], display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Typography component="span" variant="body2" sx={{ color: theme.palette.primary.main }}>
                        {sectionNumber}
                      </Typography>
                      {category.title}
                    </Typography>
                    <Button
                                size="small" 
                      onClick={() => toggleSection(sectionKey)}
                        sx={{
                        minWidth: 48,
                          borderRadius: 0,
                        border: '1px solid',
                        borderColor: 'divider',
                        color: theme.palette.primary.main,
                        lineHeight: 1,
                        fontWeight: 600,
                      }}
                    >
                      {isExpanded ? '-' : '+'}
                    </Button>
                          </Box>
                  <Divider sx={{ mb: isExpanded ? 1.5 : 0 }} />

                  {isExpanded && (
                    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                      {category.fields && category.fields.length > 0 ? (
                        category.fields.map((field, fieldIndex) => {
                          const entryNumber = `${sectionNumber}.${fieldIndex + 1}`;
                          const currentValue = payModeSettings?.[field.name];
                          const inputValue = payModeInputs?.[field.name];
                          const isBoolean = field.isNumeric !== true;

                          return (
                            <Box
                              component="li"
                              key={field.name}
                              sx={{
                                py: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0,
                                borderTop: fieldIndex === 0 ? 'none' : '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: { xs: 'minmax(0, 1fr) auto' },
                                  alignItems: 'center',
                                  columnGap: 2,
                                  rowGap: 0.75,
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 600, pr: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography component="span" variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                                    {entryNumber}
                            </Typography>
                                  {field.label}
                            </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                                  {isBoolean ? (
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={Boolean(currentValue)}
                                          onChange={(e) => handlePayModeChange(field.name, e.target.checked)}
                                          disabled={payModeSaving}
                                          color="primary"
                                        />
                                      }
                                      label={Boolean(currentValue) ? 'Enabled' : 'Disabled'}
                                      sx={{ ml: 0 }}
                                    />
                                  ) : (
                                    <TextField
                                      type="number"
                                      variant="outlined"
                                      size="small"
                                      value={inputValue ?? ''}
                                      onChange={(e) => {
                                        const next = e.target.value === '' ? '' : Number(e.target.value);
                                        setPayModeInputs((prev) => ({
                                          ...prev,
                                          [field.name]: next,
                                        }));
                                      }}
                                      onBlur={(e) => {
                                        const raw = e.target.value;
                                        if (raw === '') {
                                          setPayModeInputs((prev) => ({
                                            ...prev,
                                            [field.name]: currentValue ?? '',
                                          }));
                                          return;
                                        }
                                        const numericValue = Number(raw);
                                        if (!Number.isNaN(numericValue)) {
                                          handlePayModeChange(field.name, numericValue);
                                        }
                                      }}
                                      inputProps={{
                                        min: field.min ?? 0,
                                        max: field.max ?? 100,
                                        step: field.step ?? 1,
                                        style: { textAlign: 'center', width: 80 },
                                      }}
                                      disabled={payModeSaving}
                                    />
                                  )}
                                  <Box sx={{ minWidth: 72, display: 'flex', justifyContent: 'center' }} />
                          </Box>
                        </Box>

                              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                                {field.description}
                              </Typography>
                            </Box>
                          );
                        })
                      ) : (
                        category.key === 'payment_methods' && (
                          <Box sx={{ mt: 1 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                                backgroundColor: theme.palette.grey[100],
                                border: '1px solid',
                                borderColor: 'divider',
                                px: 2,
                                py: 1.5,
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.grey[700] }}>
                                Manage payment methods
                              </Typography>
                              <Button
                                size="small" 
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenPayModeDialog('new')}
                                disabled={paymentMethodsSaving}
                                sx={{ borderRadius: 0 }}
                              >
                                New Payment Method
                              </Button>
                        </Box>

                            {paymentMethodsLoading ? (
                              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress size={24} />
                              </Box>
                            ) : paymentMethods.length === 0 ? (
                              <Typography variant="caption" color="text.secondary">
                                No payment methods configured yet.
                              </Typography>
                            ) : (
                              <TableContainer sx={{ border: '1px solid', borderColor: 'divider' }}>
                                <Table size="small">
                                  <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Amount Range</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {paymentMethods.map((method) => (
                                      <TableRow key={method.id}>
                                        <TableCell>
                                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {method.name}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                            <Chip 
                                            label={method.payment_type_display}
                              size="small" 
                                            sx={{
                                              backgroundColor: `${getPaymentTypeColor(method.payment_type)}20`,
                                              color: getPaymentTypeColor(method.payment_type),
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Switch
                                              checked={method.is_active}
                                              onChange={() => handleTogglePayModeStatus(method)}
                                              disabled={paymentMethodsSaving}
                                              color="primary"
                                            />
                                            <Chip
                                              label={method.is_active ? 'Active' : 'Inactive'}
                                              size="small"
                                              color={method.is_active ? 'success' : 'default'}
                              variant="outlined"
                            />
                        </Box>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="body2">
                                            ₹{method.min_amount} - ₹{method.max_amount}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="body2">{method.display_order}</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="View">
                                              <span>
                                                <IconButton size="small" onClick={() => handleViewPayModeMethod(method)} disabled={paymentMethodsSaving}>
                                                  <ViewIcon fontSize="inherit" />
                                                </IconButton>
                                              </span>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                              <span>
                                                <IconButton size="small" onClick={() => handleEditPayModeMethod(method)} disabled={paymentMethodsSaving}>
                                                  <EditIcon fontSize="inherit" />
                                                </IconButton>
                                              </span>
                                            </Tooltip>
                                            <Tooltip title="History">
                                              <span>
                                                <IconButton size="small" onClick={() => handleViewPayModeHistory(method)} disabled={paymentMethodsSaving}>
                                                  <HistoryIcon fontSize="inherit" />
                                                </IconButton>
                                              </span>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                              <span>
                                                <IconButton size="small" onClick={() => handleDeletePayModeMethod(method)} disabled={paymentMethodsSaving} color="error">
                                                  <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                              </span>
                                            </Tooltip>
              </Box>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            )}
                          </Box>
                        )
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Container>

      <Menu
        anchorEl={sectionMenuAnchor}
        open={Boolean(sectionMenuAnchor)}
        onClose={handleCloseSectionMenu}
      >
        {sectionMenuRules.map((rule) => (
          <MenuItem key={rule.id} onClick={() => handleSectionMenuSelect(rule)}>
            {rule.name}
          </MenuItem>
        ))}
        {sectionMenuRules.length === 0 && (
          <MenuItem disabled>No rules available</MenuItem>
        )}
      </Menu>

      {/* History Dialog */}
      <Dialog 
        open={historyDialog.open} 
        onClose={() => setHistoryDialog({ open: false, rule: null, history: [] })}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.grey[100],
            color: theme.palette.text.primary,
            py: 2,
            px: 3,
            fontWeight: 600,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          History - {historyDialog.rule?.name}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {historyDialog.history.map((entry, index) => (
            <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">
                  {entry.changed_by_name || 'System'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(entry.changed_at).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  From: {entry.old_value}
                </Typography>
                <Typography variant="body2">→</Typography>
                <Typography variant="body2" color="text.secondary">
                  To: {entry.new_value}
                </Typography>
              </Box>
              {entry.reason && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Reason: {entry.reason}
                </Typography>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setHistoryDialog({ open: false, rule: null, history: [] })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <PaymentMethodDialog
        open={payModeDialog.open}
        mode={payModeDialog.mode}
        method={payModeDialog.method}
        onClose={handleClosePayModeDialog}
        onSave={handleSavePayModeMethod}
        saving={paymentMethodsSaving}
      />

      <PaymentMethodHistoryDialog
        open={payModeHistoryDialog.open}
        method={payModeHistoryDialog.method}
        history={payModeHistoryDialog.history}
        onClose={handleClosePayModeHistory}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BusinessRulesPage;

const PaymentMethodDialog = ({ open, mode, method, onClose, onSave, saving }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    payment_type: 'cash',
    description: '',
    is_active: true,
    requires_authorization: false,
    min_amount: 0,
    max_amount: 999999.99,
    display_order: 0,
    icon_name: '',
    color_code: '#2196F3',
    allow_refund: true,
    allow_partial_refund: true,
    requires_receipt: false,
  });

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name || '',
        code: method.code || '',
        payment_type: method.payment_type || 'cash',
        description: method.description || '',
        is_active: Boolean(method.is_active),
        requires_authorization: Boolean(method.requires_authorization),
        min_amount: method.min_amount ?? 0,
        max_amount: method.max_amount ?? 999999.99,
        display_order: method.display_order ?? 0,
        icon_name: method.icon_name || '',
        color_code: method.color_code || '#2196F3',
        allow_refund: Boolean(method.allow_refund),
        allow_partial_refund: Boolean(method.allow_partial_refund),
        requires_receipt: Boolean(method.requires_receipt),
      });
    } else {
      setFormData({
        name: '',
        code: '',
        payment_type: 'cash',
        description: '',
        is_active: true,
        requires_authorization: false,
        min_amount: 0,
        max_amount: 999999.99,
        display_order: 0,
        icon_name: '',
        color_code: '#2196F3',
        allow_refund: true,
        allow_partial_refund: true,
        requires_receipt: false,
      });
    }
  }, [method, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const paymentTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'netbanking', label: 'Net Banking' },
    { value: 'wallet', label: 'Digital Wallet' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'credit', label: 'Credit' },
    { value: 'other', label: 'Other' },
  ];

  const isView = mode === 'view';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 0 } }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.text.primary,
          py: 2,
          px: 3,
          fontWeight: 600,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {mode === 'new' && 'Create New Payment Method'}
        {mode === 'edit' && 'Edit Payment Method'}
        {mode === 'view' && 'View Payment Method'}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Payment Method Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isView || saving}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                disabled={isView || saving}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isView || saving} size="small">
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={formData.payment_type}
                  label="Payment Type"
                  onChange={(e) => handleChange('payment_type', e.target.value)}
                >
                  {paymentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Display Order"
                type="number"
                value={formData.display_order}
                onChange={(e) => handleChange('display_order', parseInt(e.target.value, 10) || 0)}
                disabled={isView || saving}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={isView || saving}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Amount"
                type="number"
                value={formData.min_amount}
                onChange={(e) => handleChange('min_amount', parseFloat(e.target.value) || 0)}
                disabled={isView || saving}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Amount"
                type="number"
                value={formData.max_amount}
                onChange={(e) => handleChange('max_amount', parseFloat(e.target.value) || 999999.99)}
                disabled={isView || saving}
                size="small"
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Settings
          </Typography>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    disabled={isView || saving}
                  />
                }
                label="Active"
                sx={{ ml: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requires_authorization}
                    onChange={(e) => handleChange('requires_authorization', e.target.checked)}
                    disabled={isView || saving}
                  />
                }
                label="Requires Authorization"
                sx={{ ml: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requires_receipt}
                    onChange={(e) => handleChange('requires_receipt', e.target.checked)}
                    disabled={isView || saving}
                  />
                }
                label="Requires Receipt"
                sx={{ ml: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allow_refund}
                    onChange={(e) => handleChange('allow_refund', e.target.checked)}
                    disabled={isView || saving}
                  />
                }
                label="Allow Refund"
                sx={{ ml: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allow_partial_refund}
                    onChange={(e) => handleChange('allow_partial_refund', e.target.checked)}
                    disabled={isView || saving}
                  />
                }
                label="Allow Partial Refund"
                sx={{ ml: 0 }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={saving}>
          {isView ? 'Close' : 'Cancel'}
        </Button>
        {!isView && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            sx={{
              borderRadius: 0,
            }}
          >
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const PaymentMethodHistoryDialog = ({ open, method, history, onClose }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 0 } }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.text.primary,
          py: 2,
          px: 3,
          fontWeight: 600,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        History - {method?.name}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {history.length === 0 ? (
          <Typography variant="caption" color="text.secondary">
            No history available.
          </Typography>
        ) : (
          history.map((entry, index) => (
            <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">
                  {entry.changed_by_name || 'System'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(entry.changed_at).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {entry.field_name}: {entry.old_value}
                </Typography>
                <Typography variant="body2">→</Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.new_value}
                </Typography>
              </Box>
              {entry.reason && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Reason: {entry.reason}
                </Typography>
              )}
            </Box>
          ))
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
