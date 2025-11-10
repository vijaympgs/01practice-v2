import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Pause as PauseIcon } from '@mui/icons-material';
import salesService from '../../../services/salesService';

const SuspendedSalesDialog = ({ open, onClose, onResume }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadSuspendedSales();
    }
  }, [open]);

  const loadSuspendedSales = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await salesService.getSuspended();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading suspended sales:', err);
      setError('Failed to load suspended sales');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async (sale) => {
    try {
      const saleData = await salesService.resume(sale.id);
      onResume(saleData);
    } catch (err) {
      console.error('Error resuming sale:', err);
      setError('Failed to resume sale');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PauseIcon />
          <Typography variant="h6" fontWeight="bold">
            Suspended Sales
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : sales.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No suspended sales found
            </Typography>
          </Box>
        ) : (
          <List>
            {sales.map((sale) => (
              <ListItem
                key={sale.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => handleResume(sale)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {sale.sale_number}
                      </Typography>
                      <Chip label="Draft" size="small" color="warning" />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Customer: {sale.customer_name || 'Walk-in'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Items: {sale.items?.length || 0} | Total: ${parseFloat(sale.total_amount || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(sale.sale_date).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuspendedSalesDialog;





