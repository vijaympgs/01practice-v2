import React from 'react';
import {
  Box,
  Paper,
  Button,
  Grid,
  Typography,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  PersonAdd as CustomerIcon,
  Pause as SuspendIcon,
  PlayArrow as ResumeIcon,
  LocalOffer as DiscountIcon,
  Delete as ClearIcon,
  Payment as CheckoutIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

const QuickAccessPanel = ({
  cartItemCount = 0,
  onCustomer,
  onDiscount,
  onSuspend,
  onResume,
  onClear,
  onCheckout,
  onHelp,
  disabled = false,
}) => {
  return (
    <Paper sx={{ p: 1, mb: 2, bgcolor: 'grey.50' }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Quick Actions
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={3}>
          <Tooltip title="F3: Add Customer" arrow>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<CustomerIcon />}
              onClick={onCustomer}
              disabled={disabled}
            >
              Customer
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Tooltip title="F4: Apply Discount" arrow>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<DiscountIcon />}
              onClick={onDiscount}
              disabled={disabled || cartItemCount === 0}
            >
              Discount
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Tooltip title="Ctrl+S: Suspend Sale" arrow>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<SuspendIcon />}
              onClick={onSuspend}
              disabled={disabled || cartItemCount === 0}
            >
              Suspend
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Tooltip title="Ctrl+R: Resume Sale" arrow>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<ResumeIcon />}
              onClick={onResume}
              disabled={disabled}
            >
              Resume
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      
      <Grid container spacing={1} sx={{ mt: 0.5 }}>
        <Grid item xs={4}>
          <Tooltip title="F9: Clear Cart" arrow>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              color="error"
              startIcon={<ClearIcon />}
              onClick={onClear}
              disabled={disabled || cartItemCount === 0}
            >
              Clear
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={4}>
          <Tooltip title="F1: Keyboard Shortcuts" arrow>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<HelpIcon />}
              onClick={onHelp}
              disabled={disabled}
            >
              Help
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={4}>
          <Tooltip title="F8 or F12: Checkout" arrow>
            <Badge badgeContent={cartItemCount} color="primary">
              <Button
                fullWidth
                variant="contained"
                size="small"
                startIcon={<CheckoutIcon />}
                onClick={onCheckout}
                disabled={disabled || cartItemCount === 0}
              >
                Checkout
              </Button>
            </Badge>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuickAccessPanel;





