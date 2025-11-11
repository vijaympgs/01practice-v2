import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Person as PersonIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import customerService from '../../../services/customerService';
import QuickCustomerForm from './QuickCustomerForm';

const CustomerSelector = ({ open, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  useEffect(() => {
    if (open) {
      loadCustomers();
    }
  }, [open, searchTerm]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const params = {
        is_active: true,
        page_size: 20,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }

      const data = await customerService.getAll(params);
      setCustomers(data.results || []);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (customer) => {
    onSelect(customer);
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  const handleCustomerCreated = (newCustomer) => {
    setQuickAddOpen(false);
    onSelect(newCustomer);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon />
              <Typography variant="h6" fontWeight="bold">
                Select Customer
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={() => setQuickAddOpen(true)}
            >
              New
            </Button>
          </Box>
        </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 0 }
          }}
          autoFocus
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : customers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              {searchTerm ? 'No customers found' : 'Start typing to search customers'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {customers.map((customer) => (
              <ListItem
                key={customer.id}
                button
                onClick={() => handleSelect(customer)}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 0,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {customer.first_name} {customer.last_name}
                      </Typography>
                      {customer.is_vip && (
                        <Chip label="VIP" size="small" color="warning" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {customer.phone}
                      </Typography>
                      {customer.email && (
                        <Typography variant="body2" color="text.secondary">
                          {customer.email}
                        </Typography>
                      )}
                      {customer.company_name && (
                        <Typography variant="body2" color="text.secondary">
                          {customer.company_name}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={handleClose} sx={{ borderRadius: 0 }}>Cancel</Button>
      </DialogActions>
      </Dialog>

      {/* Quick Add Customer Dialog */}
      <QuickCustomerForm
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
    </>
  );
};

export default CustomerSelector;

