import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Store as StoreIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import salesService from '../../../services/salesService';

const SessionDialog = ({ open, onClose, onSessionOpen }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [openingCash, setOpeningCash] = useState('100.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenSession = async () => {
    const amount = parseFloat(openingCash);
    
    if (!amount || amount < 0) {
      setError('Please enter a valid opening cash amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sessionData = {
        cashier: currentUser.id,
        opening_cash: amount,
      };

      const session = await salesService.openSession(amount);
      onSessionOpen(session);
    } catch (err) {
      console.error('Error opening session:', err);
      setError(err.response?.data?.message || 'Failed to open session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StoreIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Open POS Session
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Start a new cashier session to begin processing sales. Enter the opening cash amount in the drawer.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Cashier:</strong> {currentUser?.username || 'Unknown'}
          </Typography>
          <Typography variant="body2">
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <TextField
          label="Opening Cash Amount"
          type="number"
          value={openingCash}
          onChange={(e) => setOpeningCash(e.target.value)}
          fullWidth
          inputProps={{ min: 0, step: 0.01 }}
          InputProps={{
            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
          }}
          helperText="Count the cash in the drawer and enter the amount"
          autoFocus
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleOpenSession}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Opening...' : 'Open Session'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionDialog;





