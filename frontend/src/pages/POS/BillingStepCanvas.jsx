import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Tooltip,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HistoryIcon from '@mui/icons-material/History';

const metricDefinitions = [
  {
    label: 'Live Sales',
    value: '₹0.00',
    sublabel: 'Last 15 min',
    icon: <SpeedIcon fontSize="small" />,
  },
  {
    label: 'Active Carts',
    value: '3',
    sublabel: 'Awaiting checkout',
    icon: <ShoppingCartIcon fontSize="small" />,
  },
  {
    label: 'Customers Waiting',
    value: '2',
    sublabel: 'Across terminals',
    icon: <PeopleIcon fontSize="small" />,
  },
  {
    label: 'Suspended Bills',
    value: '5',
    sublabel: 'Require attention',
    icon: <PendingActionsIcon fontSize="small" />,
  },
];

const activeCartSamples = [
  {
    id: 'CART-1045',
    customer: 'Walk-in',
    items: 4,
    amount: '₹2,450.00',
    status: 'Scanning',
    updatedAt: '2m ago',
  },
  {
    id: 'CART-1044',
    customer: 'Rachit S.',
    items: 8,
    amount: '₹5,320.00',
    status: 'Payment Pending',
    updatedAt: '5m ago',
  },
  {
    id: 'CART-1043',
    customer: 'Walk-in',
    items: 2,
    amount: '₹780.00',
    status: 'Awaiting Offers',
    updatedAt: '9m ago',
  },
];

const quickActions = [
  {
    label: 'New Sale',
    icon: <PlayCircleIcon />,
    variant: 'contained',
  },
  {
    label: 'Suspended Bills',
    icon: <PendingActionsIcon />,
    variant: 'outlined',
  },
  {
    label: 'Billing History',
    icon: <HistoryIcon />,
    variant: 'outlined',
  },
];

const BillingStepCanvas = ({ condensed = false }) => {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: condensed ? 1 : 3,
        p: { xs: 2, md: condensed ? 2 : 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        background: theme.palette.background.paper,
        boxShadow: condensed ? 'none' : '0 28px 60px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Billing Console
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor live billing activity and action suspended carts.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip
            icon={<ReceiptLongIcon fontSize="small" />}
            label="POS Ready"
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: condensed ? 'solid' : 'dashed' }} />

      <Grid container spacing={condensed ? 1.5 : 2}>
        {metricDefinitions.map((metric) => (
          <Grid item xs={6} md={3} key={metric.label}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: condensed ? 1 : 2,
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                background: alpha(theme.palette.primary.main, 0.04),
                borderColor: alpha(theme.palette.primary.main, 0.12),
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  {metric.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metric.sublabel}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
          gap: condensed ? 1.5 : 2.5,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            borderRadius: condensed ? 1 : 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Active Carts
            </Typography>
            <Chip label="Live" color="warning" size="small" />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
            These carts are linked with terminals and awaiting cashier action.
          </Typography>
          <List
            dense
            sx={{
              flex: 1,
              overflow: 'auto',
              pr: 1,
            }}
          >
            {activeCartSamples.map((cart) => (
              <ListItem
                key={cart.id}
                sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  borderRadius: 1.5,
                  mb: 1,
                  alignItems: 'flex-start',
                }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {cart.id}
                      </Typography>
                      <Chip label={cart.status} size="small" color="info" variant="outlined" />
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {cart.customer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cart.items} item(s) • {cart.amount}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" display="block">
                        Updated {cart.updatedAt}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: condensed ? 1 : 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            background: alpha(theme.palette.secondary.main, 0.04),
            borderColor: alpha(theme.palette.secondary.main, 0.16),
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Stack spacing={1.5}>
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                startIcon={action.icon}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Today&apos;s Summary
            </Typography>
            <Tooltip title="Rolling sales performance (placeholder)">
              <Typography variant="body2">Sales pace: ₹32,500/hour</Typography>
            </Tooltip>
            <Tooltip title="Average checkout duration (placeholder)">
              <Typography variant="body2">Avg. billing time: 3m 15s</Typography>
            </Tooltip>
            <Tooltip title="Suspended invoices awaiting action (placeholder)">
              <Typography variant="body2">Invoices to resume: 5</Typography>
            </Tooltip>
          </Stack>
        </Paper>
      </Box>
    </Paper>
  );
};

export default BillingStepCanvas;


