import React, { useState } from 'react';
import {
  ListItem,
  Box,
  Typography,
  IconButton,
  TextField,
  Collapse,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';

const CartItem = ({ item, onUpdateQuantity, onUpdatePrice, onUpdateDiscount, onRemove }) => {
  const [expanded, setExpanded] = useState(false);

  const subtotal = item.quantity * item.unit_price;
  const taxableAmount = subtotal - item.discount_amount;
  const taxAmount = (taxableAmount * item.tax_rate) / 100;
  const total = taxableAmount + taxAmount;

  return (
    <ListItem
      sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        p: 1.5,
      }}
    >
      {/* Main Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {item.product.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.product.sku || item.product.barcode}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ p: 0.5 }}
          >
            {expanded ? <CollapseIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onRemove(item.product.id)}
            color="error"
            sx={{ p: 0.5 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Quick Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.product.id, e.target.value)}
            inputProps={{ min: 0.001, step: 0.1, style: { textAlign: 'center' } }}
            sx={{ width: 70 }}
          />
          <Typography variant="body2">×</Typography>
          <Typography variant="body2" fontWeight="bold">
            ${parseFloat(item.unit_price).toFixed(2)}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="primary">
          ${total.toFixed(2)}
        </Typography>
      </Box>

      {/* Expanded Details */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              label="Unit Price"
              size="small"
              type="number"
              value={item.unit_price}
              onChange={(e) => onUpdatePrice(item.product.id, e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
            />
            <TextField
              label="Discount"
              size="small"
              type="number"
              value={item.discount_amount}
              onChange={(e) => onUpdateDiscount(item.product.id, e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
            />
          </Box>
          
          {/* Calculation Breakdown */}
          <Box sx={{ bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Subtotal:
              </Typography>
              <Typography variant="caption">${subtotal.toFixed(2)}</Typography>
            </Box>
            {item.discount_amount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="error">
                  Item Discount:
                </Typography>
                <Typography variant="caption" color="error">
                  -${item.discount_amount.toFixed(2)}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Tax ({item.tax_rate}%):
              </Typography>
              <Typography variant="caption">${taxAmount.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" fontWeight="bold">
                Line Total:
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </ListItem>
  );
};

export default CartItem;





