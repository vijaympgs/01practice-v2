import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Receipt,
  Print,
  Email,
  Close,
  Save,
  Preview,
  Download,
  Share,
  AttachMoney,
  Store,
  Person,
  AccessTime,
  QrCode
} from '@mui/icons-material';

const ReceiptGenerator = ({ open, onClose, saleData, session }) => {
  const [receiptTemplate, setReceiptTemplate] = useState('standard');
  const [printSettings, setPrintSettings] = useState({
    printReceipt: true,
    printCustomerCopy: true,
    printMerchantCopy: false,
    emailReceipt: false,
    emailAddress: ''
  });
  const [receiptPreview, setReceiptPreview] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const templates = [
    { id: 'standard', name: 'Standard Receipt', description: 'Basic receipt format' },
    { id: 'detailed', name: 'Detailed Receipt', description: 'Detailed with item descriptions' },
    { id: 'compact', name: 'Compact Receipt', description: 'Small format for thermal printers' },
    { id: 'invoice', name: 'Invoice Format', description: 'Formal invoice format' }
  ];

  useEffect(() => {
    if (open && saleData) {
      generateReceiptPreview();
    }
  }, [open, saleData, receiptTemplate]);

  const generateReceiptPreview = () => {
    if (!saleData) return;

    const receipt = `
╔══════════════════════════════════════╗
║            OPTIMIND RETAIL™          ║
║         Point of Sale Receipt        ║
╠══════════════════════════════════════╣
║ Store: ${session?.location || 'Main Store'}
║ Till: ${session?.tillId || 'TILL001'}
║ Cashier: ${session?.user?.name || 'Unknown'}
║ Date: ${new Date().toLocaleDateString()}
║ Time: ${new Date().toLocaleTimeString()}
║ Receipt #: ${saleData.id}
╠══════════════════════════════════════╣
║ CUSTOMER: ${saleData.customer?.name || 'Walk-in Customer'}
║ Phone: ${saleData.customer?.phone || 'N/A'}
╠══════════════════════════════════════╣
║ ITEMS:
${saleData.items.map(item => 
  `║ ${item.name.padEnd(20)} ${item.quantity.toString().padStart(3)} x ₹${item.price.toFixed(2).padStart(8)} = ₹${(item.quantity * item.price).toFixed(2).padStart(8)}`
).join('\n')}
╠══════════════════════════════════════╣
║ Subtotal:${' '.repeat(20)}₹${saleData.total.toFixed(2).padStart(10)}
║ Tax (18%):${' '.repeat(18)}₹${saleData.tax.toFixed(2).padStart(10)}
║ ${'─'.repeat(34)}
║ TOTAL:${' '.repeat(23)}₹${saleData.grandTotal.toFixed(2).padStart(10)}
╠══════════════════════════════════════╣
║ Payment: ${saleData.payment.method.toUpperCase()}
║ Amount Paid: ₹${saleData.payment.amount.toFixed(2)}
${saleData.payment.change ? `║ Change: ₹${saleData.payment.change.toFixed(2)}` : ''}
╠══════════════════════════════════════╣
║ Thank you for shopping with us!
║ Visit us again soon!
║ 
║ ${'█'.repeat(34)}
║ ${'█'.repeat(34)}
║ ${'█'.repeat(34)}
║        QR Code for Digital Receipt
║ ${'█'.repeat(34)}
║ ${'█'.repeat(34)}
║ ${'█'.repeat(34)}
╠══════════════════════════════════════╣
║ Transaction ID: ${saleData.payment.transactionId || 'N/A'}
║ Session: ${session?.id || 'N/A'}
║ 
║ For support: support@optimindretail.com
║ Phone: +91-XXX-XXX-XXXX
╚══════════════════════════════════════╝
    `;

    setReceiptPreview(receipt);
  };

  const handlePrint = () => {
    // Simulate printing
    setSnackbar({
      open: true,
      message: 'Receipt sent to printer successfully',
      severity: 'success'
    });
    
    // In a real application, you would:
    // 1. Send print command to thermal printer
    // 2. Handle print queue
    // 3. Show print status
  };

  const handleEmail = () => {
    if (!printSettings.emailAddress) {
      setSnackbar({
        open: true,
        message: 'Please enter email address',
        severity: 'error'
      });
      return;
    }

    // Simulate email sending
    setSnackbar({
      open: true,
      message: `Receipt sent to ${printSettings.emailAddress}`,
      severity: 'success'
    });
  };

  const handleDownload = () => {
    // Generate PDF and download
    const element = document.createElement('a');
    const file = new Blob([receiptPreview], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `receipt_${saleData.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setSnackbar({
      open: true,
      message: 'Receipt downloaded successfully',
      severity: 'success'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Receipt',
        text: `Receipt for transaction ${saleData.id}`,
        url: window.location.href
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(receiptPreview);
      setSnackbar({
        open: true,
        message: 'Receipt copied to clipboard',
        severity: 'success'
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Receipt Generation</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Left Panel - Settings */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Receipt Settings
                </Typography>

                {/* Template Selection */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Receipt Template</InputLabel>
                  <Select
                    value={receiptTemplate}
                    onChange={(e) => setReceiptTemplate(e.target.value)}
                    label="Receipt Template"
                  >
                    {templates.map(template => (
                      <MenuItem key={template.id} value={template.id}>
                        <Box>
                          <Typography variant="body2">{template.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {template.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Print Options */}
                <Typography variant="subtitle2" gutterBottom>
                  Print Options
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={printSettings.printReceipt}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        printReceipt: e.target.checked
                      }))}
                    />
                  }
                  label="Print Receipt"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={printSettings.printCustomerCopy}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        printCustomerCopy: e.target.checked
                      }))}
                    />
                  }
                  label="Customer Copy"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={printSettings.printMerchantCopy}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        printMerchantCopy: e.target.checked
                      }))}
                    />
                  }
                  label="Merchant Copy"
                />

                {/* Email Options */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Email Options
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={printSettings.emailReceipt}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        emailReceipt: e.target.checked
                      }))}
                    />
                  }
                  label="Email Receipt"
                />
                {printSettings.emailReceipt && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Email Address"
                    value={printSettings.emailAddress}
                    onChange={(e) => setPrintSettings(prev => ({
                      ...prev,
                      emailAddress: e.target.value
                    }))}
                    sx={{ mt: 1 }}
                  />
                )}

                {/* Action Buttons */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Print />}
                    onClick={handlePrint}
                    fullWidth
                  >
                    Print Receipt
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Email />}
                    onClick={handleEmail}
                    disabled={!printSettings.emailReceipt}
                    fullWidth
                  >
                    Email Receipt
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownload}
                    fullWidth
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share />}
                    onClick={handleShare}
                    fullWidth
                  >
                    Share Receipt
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Right Panel - Preview */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Receipt Preview
                </Typography>
                <Box
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    maxHeight: 500,
                    overflow: 'auto',
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  {receiptPreview}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReceiptGenerator;
