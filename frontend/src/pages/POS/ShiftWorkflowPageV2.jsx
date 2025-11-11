import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Divider, Button, Grid } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import DayOpenPage from './DayOpenPage';
import SessionOpenPage from './SessionOpenPage';
import SettlementModuleV2 from './SettlementModuleV2';
import SessionClosePage from './SessionClosePage';
import DayClosePage from './DayClosePage';
import BillingStepCanvas from './BillingStepCanvas';

const STEPS = [
  {
    key: 'day-open',
    title: 'Day Open',
    subtitle: 'Start the business day',
  },
  {
    key: 'session-open',
    title: 'Session Open',
    subtitle: 'Prepare cashiers for billing',
  },
  {
    key: 'billing',
    title: 'Billing',
    subtitle: 'POS (Point of Sale) billing',
  },
  {
    key: 'operator-cash-up',
    title: 'Operator Cash-Up',
    subtitle: 'Reconcile Cashier Collections',
  },
  {
    key: 'session-close',
    title: 'Session Close',
    subtitle: 'Close cashier sessions',
  },
  {
    key: 'day-close',
    title: 'Day Close',
    subtitle: 'End of Day Reconciliation',
  },
];

const ShiftWorkflowPageV2 = () => {
  const theme = useTheme();
  const [activeStepKey, setActiveStepKey] = useState('day-open');
  const steps = STEPS;

  const renderStepContent = (stepKey) => {
    switch (stepKey) {
      case 'day-open':
        return (
          <DayOpenPage
            showHeader={false}
            routePrefix="/posv2"
            onContinueSession={() => setActiveStepKey('session-open')}
          />
        );
      case 'session-open':
        return (
          <SessionOpenPage
            showHeader={false}
            condensed
            routePrefix="/posv2"
          />
        );
      case 'operator-cash-up':
        return <SettlementModuleV2 showHeader={false} condensed routePrefix="/posv2" />;
      case 'session-close':
        return <SessionClosePage showHeader={false} condensed routePrefix="/posv2" />;
      case 'day-close':
        return <DayClosePage showHeader={false} condensed routePrefix="/posv2" />;
      case 'billing':
        return <BillingStepCanvas condensed />;
      default:
        return (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 0,
              p: 4,
              textAlign: 'center',
              background: alpha(theme.palette.background.paper, 0.9),
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
              We are crafting the new {steps.find((step) => step.key === stepKey)?.title || 'workflow'} experience. Stay tuned for more updates.
            </Typography>
            <Button variant="outlined" size="small" onClick={() => setActiveStepKey('day-open')}>
              Back to Day Open
            </Button>
          </Paper>
        );
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: theme.palette.grey[50],
        display: 'flex',
        flexDirection: 'column',
        pt: 1,
        pb: 0,
        px: { xs: 1.5, md: 2 },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          POS Console
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Navigate day operations from Day Open to Day Close without leaving the canvas.
        </Typography>
      </Box>
      <Grid container spacing={2.5} sx={{ flex: 1, minHeight: 0, alignItems: 'stretch' }}>
        <Grid item xs={12} md={3} sx={{ display: 'flex' }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 0,
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              background: theme.palette.background.paper,
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
              height: '100%',
              width: '100%',
              minHeight: '100%',
            }}
          >
            <Stack spacing={1}>
              {steps.map((step) => {
                const isActive = activeStepKey === step.key;

                return (
                  <Paper
                    key={step.key}
                    variant="outlined"
                    onClick={() => setActiveStepKey(step.key)}
                    sx={{
                      borderRadius: 0,
                      borderColor: isActive ? alpha(theme.palette.primary.main, 0.6) : alpha(theme.palette.divider, 0.6),
                      background: isActive ? alpha(theme.palette.primary.main, 0.08) : theme.palette.background.paper,
                      px: 1.5,
                      py: 1,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
                      },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: isActive ? 700 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {step.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {step.subtitle}
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9} sx={{ display: 'flex' }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 0,
              p: { xs: 1.5, md: 2 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: theme.palette.background.paper,
              boxShadow: '0 28px 60px rgba(15, 23, 42, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
              {renderStepContent(activeStepKey)}
            </Box>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
};

export default ShiftWorkflowPageV2;
