import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { AccountBalanceWallet as SettlementIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { businessRulesService } from '../../services/businessRulesService';

const SettlementSettingsPage = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadSettlementSettings();
  }, []);

  const loadSettlementSettings = async () => {
    try {
      setLoading(true);
      const data = await businessRulesService.getSettlementSettings();
      setSettings(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load settlement settings: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (field, value) => {
    try {
      setSaving(true);
      const updatedSettings = { ...settings, [field]: value };
      await businessRulesService.updateSettlementSettings({ [field]: value });
      setSettings(updatedSettings);
      setSnackbar({ open: true, message: 'Settlement settings updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update settings: ' + error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Container maxWidth="lg">
        <PageTitle title="Settlement Settings" subtitle="Configure settlement validation rules" />
        <Alert severity="warning">No settlement settings found. Please contact administrator.</Alert>
      </Container>
    );
  }

  const settingsFields = [
    {
      category: 'Settlement Validation',
      icon: '✓',
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
      category: 'Session Management',
      icon: '🔐',
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
      category: 'Billing & Session Blocks',
      icon: '🚫',
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
      category: 'Notifications',
      icon: '🔔',
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
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 3
    }}>
      <PageTitle 
        title="Settlement Settings" 
        subtitle="Configure settlement validation and session management rules"
      />

      <Container maxWidth="lg">
        {settingsFields.map((category, idx) => (
          <Card 
            key={idx}
            sx={{ 
              mb: 3,
              borderRadius: 0,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  p: 2,
                  borderBottom: '1px solid #dee2e6'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.grey[800],
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {category.icon} {category.category}
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {category.fields.map((field) => (
                    <Grid item xs={12} md={6} key={field.name}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 0,
                          border: '1px solid #e9ecef',
                          '&:hover': {
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {field.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          {field.description}
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings[field.name] || false}
                              onChange={(e) => handleChange(field.name, e.target.checked)}
                              disabled={saving}
                              color="primary"
                            />
                          }
                          label={settings[field.name] ? 'Enabled' : 'Disabled'}
                          sx={{ ml: 0 }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>

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

export default SettlementSettingsPage;
