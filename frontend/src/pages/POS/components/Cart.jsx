import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  List,
  TextField,
  Chip,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import CartItem from './CartItem';
import CustomerSelector from './CustomerSelector';

const Cart = ({
  items,
  customer,
  discount,
  notes,
  totals,
  onUpdateQuantity,
  onUpdatePrice,
  onUpdateDiscount,
  onRemoveItem,
  onSetCustomer,
  onSetDiscount,
  onSetNotes,
  onClearCart,
  onCheckout,
  loading,
}) => {
  const [customerDialogOpen, setCustomerDialogOpen] = React.useState(false);

  return (
    <>
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CartIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Cart ({items.length})
            </Typography>
          </Box>
          {items.length > 0 && (
            <IconButton onClick={onClearCart} size="small" color="error">
              <ClearIcon />
            </IconButton>
          )}
        </Box>

        {/* Customer */}
        <Box sx={{ mb: 2 }}>
          {customer ? (
            <Chip
              icon={<PersonIcon />}
              label={`${customer.first_name} ${customer.last_name}`}
              onDelete={() => onSetCustomer(null)}
              color="primary"
              variant="outlined"
            />
          ) : (
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => setCustomerDialogOpen(true)}
              size="small"
            >
              Add Customer
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Cart Items */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary',
              }}
            >
              <CartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="body1">Cart is empty</Typography>
              <Typography variant="body2">Scan or search products to add</Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onUpdatePrice={onUpdatePrice}
                  onUpdateDiscount={onUpdateDiscount}
                  onRemove={onRemoveItem}
                />
              ))}
            </List>
          )}
        </Box>

        {/* Discount */}
        {items.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Bill Discount (%)"
              type="number"
              size="small"
              fullWidth
              value={discount}
              onChange={(e) => onSetDiscount(parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Totals */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="body2">${totals.subtotal}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tax:
            </Typography>
            <Typography variant="body2">${totals.tax}</Typography>
          </Box>
          {parseFloat(totals.discount) > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="error">
                Discount:
              </Typography>
              <Typography variant="body2" color="error">
                -${totals.discount}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              ${totals.total}
            </Typography>
          </Box>
        </Box>

        {/* Notes */}
        {items.length > 0 && (
          <TextField
            label="Notes (optional)"
            multiline
            rows={2}
            size="small"
            fullWidth
            value={notes}
            onChange={(e) => onSetNotes(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

        {/* Checkout Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onCheckout}
          disabled={items.length === 0 || loading}
          sx={{ py: 1.5 }}
        >
          Proceed to Payment
        </Button>
      </Paper>

      {/* Customer Selector Dialog */}
      <CustomerSelector
        open={customerDialogOpen}
        onClose={() => setCustomerDialogOpen(false)}
        onSelect={(selectedCustomer) => {
          onSetCustomer(selectedCustomer);
          setCustomerDialogOpen(false);
        }}
      />
    </>
  );
};

export default Cart;





