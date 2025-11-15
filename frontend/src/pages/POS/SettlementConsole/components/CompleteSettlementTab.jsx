import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Alert,
  Chip,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  DoneAll as DoneAllIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

/**
 * Complete Settlement Tab Component
 * Final review and settlement completion
 */
const CompleteSettlementTab = ({ settlement, updateSettlement, completeSettlement, saving }) => {
  const theme = useTheme();
  const [managerNotes, setManagerNotes] = useState(settlement?.notes || '');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCompleteSettlement = async () => {
    // Update settlement notes
    updateSettlement({ notes: managerNotes });
    
    // Complete settlement
    const success = await completeSettlement();
    if (success) {
      console.log('Settlement completed successfully!');
    }
  };

  const canComplete = settlement?.actualCash > 0 && settlement?.difference !== 0 && !saving;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const refundTotal = settlement?.refunds?.reduce((sum, refund) => sum + parseFloat(refund.amount || 0), 0) || 0;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Complete Settlement
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Refunds Processed
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {formatCurrency(refundTotal)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Settlement Status
            </Typography>
            <Chip
              label={settlement?.status?.toUpperCase() || 'PENDING'}
              color={getStatusColor(settlement?.status)}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Settlement Notes */}
      <Card sx={{ p: 2, borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Settlement Notes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Summarize variance, handover details, or next shift instructions.
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={4}
          value={managerNotes}
          onChange={(e) => setManagerNotes(e.target.value)}
          placeholder="Add settlement notes..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Card>

      {/* Final Summary */}
      <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Final Settlement Summary
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Opening Float"
              secondary={formatCurrency(settlement?.openingBalance || 0)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Expected Cash"
              secondary={formatCurrency(settlement?.expectedCash || 0)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Counted Cash"
              secondary={formatCurrency(settlement?.actualCash || 0)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Variance"
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: settlement?.difference === 0 ? 'success.main' : 
                             settlement?.difference > 0 ? 'warning.main' : 'error.main'
                    }}
                  >
                    {formatCurrency(settlement?.difference || 0)}
                  </Typography>
                  {settlement?.difference !== 0 && (
                    <Chip
                      size="small"
                      label={settlement?.difference > 0 ? 'Excess' : 'Shortage'}
                      color={settlement?.difference > 0 ? 'warning' : 'error'}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
          {settlement?.adjustments?.length > 0 && (
            <ListItem>
              <ListItemText
                primary="Adjustments"
                secondary={`${settlement.adjustments.length} adjustment(s) recorded`}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Validation Messages */}
      {settlement?.actualCash === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <WarningIcon sx={{ mr: 1 }} />
          Cash must be counted before completing settlement.
        </Alert>
      )}

      {settlement?.difference === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <CheckIcon sx={{ mr: 1 }} />
          No variance detected. Settlement is ready for completion.
        </Alert>
      )}

      {settlement?.difference !== 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <ErrorIcon sx={{ mr: 1 }} />
          Variance detected. Please ensure this is recorded in adjustments before completing settlement.
        </Alert>
      )}

      {/* Complete Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Ensure all cash is counted and adjustments are recorded before completion.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleCompleteSettlement}
          disabled={!canComplete}
          startIcon={saving ? <CircularProgress size={20} /> : <DoneAllIcon />}
          sx={{
            minWidth: 200,
            py: 1.5,
          }}
        >
          {saving ? 'Completing...' : 'Complete Settlement'}
        </Button>
      </Box>
    </Box>
  );
};

export default CompleteSettlementTab;
