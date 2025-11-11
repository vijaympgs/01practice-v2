import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import customerService from '../../../services/customerService';

const QuickCustomerForm = ({ open, onClose, onCustomerCreated }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.first_name || !formData.last_name || !formData.phone) {
      setError('First name, last name, and phone are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const customerData = {
        ...formData,
        is_active: true,
      };

      const newCustomer = await customerService.create(customerData);
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
      });
      
      // Notify parent
      onCustomerCreated(newCustomer);
    } catch (err) {
      console.error('Error creating customer:', err);
      setError(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
      });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Quick Add Customer
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add a new customer quickly. Only basic information required.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name *"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                autoFocus
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name *"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
                placeholder="e.g., 1234567890"
                helperText="Phone number is required for customer identification"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email (Optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                placeholder="customer@example.com"
              />
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 <strong>Tip:</strong> You can add more details (address, credit limit, etc.) later from the Customers page.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
          >
            {loading ? 'Creating...' : 'Create Customer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuickCustomerForm;





