import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

/**
 * Adjustments Tab Component
 * Handles manual adjustments, refunds, and cash drops
 */
const AdjustmentsTab = ({ settlement, addAdjustment, removeAdjustment }) => {
  const theme = useTheme();
  const [adjustmentDialog, setAdjustmentDialog] = useState({ open: false, type: 'add' });
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const handleAddAdjustment = () => {
    const amount = parseFloat(adjustmentAmount);
    const reason = adjustmentReason.trim();

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!reason) {
      alert('Please enter a reason for the adjustment');
      return;
    }

    const adjustment = {
      id: Date.now().toString(),
      type: adjustmentDialog.type,
      amount,
      reason,
      timestamp: new Date().toISOString(),
    };

    addAdjustment(adjustment);

    setAdjustmentDialog({ open: false, type: 'add' });
    setAdjustmentAmount('');
    setAdjustmentReason('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const adjustmentsNetImpact = settlement?.adjustments?.reduce((sum, adjustment) => {
    return adjustment.type === 'add' ? sum + adjustment.amount : sum - adjustment.amount;
  }, 0) || 0;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Adjustments & Cash Management
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAdjustmentDialog({ open: true, type: 'add' })}
          sx={{ minWidth: 150 }}
        >
          Add Cash
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RemoveIcon />}
          onClick={() => setAdjustmentDialog({ open: true, type: 'subtract' })}
          sx={{ minWidth: 150 }}
        >
          Subtract Cash
        </Button>
        <Chip
          label={`Net Impact: ${formatCurrency(adjustmentsNetImpact)}`}
          color={adjustmentsNetImpact === 0 ? 'default' : adjustmentsNetImpact > 0 ? 'success' : 'warning'}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Adjustments Table */}
      {settlement?.adjustments?.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Recorded</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settlement.adjustments.map((adjustment) => (
                <TableRow key={adjustment.id}>
                  <TableCell>
                    <Chip
                      size="small"
                      label={adjustment.type === 'add' ? 'Added' : 'Subtracted'}
                      color={adjustment.type === 'add' ? 'success' : 'error'}
                      variant="outlined"
                      icon={adjustment.type === 'add' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {formatCurrency(adjustment.amount)}
                  </TableCell>
                  <TableCell>{adjustment.reason}</TableCell>
                  <TableCell>
                    {new Date(adjustment.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeAdjustment(adjustment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No adjustments recorded.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Use the buttons above to add cash adjustments for discrepancies, refunds, or cash drops.
          </Typography>
        </Card>
      )}

      {/* Adjustment Dialog */}
      <Dialog open={adjustmentDialog.open} onClose={() => setAdjustmentDialog({ open: false, type: 'add' })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {adjustmentDialog.type === 'add' ? 'Add Cash' : 'Subtract Cash'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Amount"
              type="number"
              value={adjustmentAmount}
              onChange={(e) => setAdjustmentAmount(e.target.value)}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label="Reason"
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Enter reason for this adjustment..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustmentDialog({ open: false, type: 'add' })}>
            Cancel
          </Button>
          <Button onClick={handleAddAdjustment} variant="contained">
            {adjustmentDialog.type === 'add' ? 'Add' : 'Subtract'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdjustmentsTab;
