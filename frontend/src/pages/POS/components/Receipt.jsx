import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Print as PrintIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';

const Receipt = ({ open, sale, payments, changeAmount, onClose, onPrint }) => {
  const currentDate = new Date().toLocaleString();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        {/* Success Message */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <SuccessIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
          <Typography variant="h5" fontWeight="bold" color="success.main">
            Sale Completed!
          </Typography>
        </Box>

        {/* Receipt Content */}
        <Box
          id="receipt"
          sx={{
            bgcolor: 'white',
            p: 3,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            fontFamily: 'monospace',
          }}
        >
          {/* Store Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              RETAIL POS
            </Typography>
            <Typography variant="body2">123 Main Street</Typography>
            <Typography variant="body2">City, State 12345</Typography>
            <Typography variant="body2">Tel: (555) 123-4567</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Sale Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Receipt #:</strong> {sale.sale_number}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {currentDate}
            </Typography>
            <Typography variant="body2">
              <strong>Cashier:</strong> {sale.cashier_name}
            </Typography>
            {sale.customer_name && (
              <Typography variant="body2">
                <strong>Customer:</strong> {sale.customer_name}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Items */}
          <Table size="small">
            <TableBody>
              {sale.items?.map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ border: 'none', py: 0.5 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.product_name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', py: 0.5 }}>
                      <Typography variant="body2">
                        {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 0.5 }} />
                    <TableCell align="right" sx={{ border: 'none', py: 0.5 }}>
                      <Typography variant="body2">
                        ${parseFloat(item.total).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          {/* Totals */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">
                ${parseFloat(sale.subtotal).toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2">
                ${parseFloat(sale.tax_amount).toFixed(2)}
              </Typography>
            </Box>
            {parseFloat(sale.discount_amount) > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Discount:</Typography>
                <Typography variant="body2">
                  -${parseFloat(sale.discount_amount).toFixed(2)}
                </Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                TOTAL:
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                ${parseFloat(sale.total_amount).toFixed(2)}
              </Typography>
            </Box>

            {/* Payment Details */}
            <Divider sx={{ my: 1 }} />
            
            {payments.map((payment, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">
                  {payment.payment_method.replace('_', ' ').toUpperCase()}:
                </Typography>
                <Typography variant="body2">
                  ${parseFloat(payment.amount).toFixed(2)}
                </Typography>
              </Box>
            ))}
            
            {changeAmount > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" fontWeight="bold">
                    CHANGE:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${changeAmount.toFixed(2)}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Thank you for your business!
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Please keep this receipt for your records
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onPrint} startIcon={<PrintIcon />}>
          Print Receipt
        </Button>
        <Button variant="contained" onClick={onClose}>
          New Sale
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Receipt;





