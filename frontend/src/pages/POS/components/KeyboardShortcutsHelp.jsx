import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Divider,
} from '@mui/material';
import { Keyboard as KeyboardIcon, Close as CloseIcon } from '@mui/icons-material';

const KeyboardShortcutsHelp = ({ open, onClose }) => {
  const shortcuts = [
    {
      category: 'Quick Actions',
      items: [
        { keys: ['F2'], action: 'Focus Search', description: 'Jump to product search' },
        { keys: ['F3'], action: 'Add Customer', description: 'Open customer selector' },
        { keys: ['F4'], action: 'Apply Discount', description: 'Focus discount field' },
        { keys: ['F8', 'F12'], action: 'Checkout', description: 'Proceed to payment' },
      ],
    },
    {
      category: 'Cart Management',
      items: [
        { keys: ['Ctrl', 'S'], action: 'Suspend Sale', description: 'Save current sale as draft' },
        { keys: ['Ctrl', 'R'], action: 'Resume Sale', description: 'Load suspended sale' },
        { keys: ['Ctrl', 'X'], action: 'Clear Cart', description: 'Remove all items' },
        { keys: ['F9'], action: 'Clear Cart', description: 'Alternative shortcut' },
      ],
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['Tab'], action: 'Next Field', description: 'Move to next input' },
        { keys: ['Shift', 'Tab'], action: 'Previous Field', description: 'Move to previous input' },
        { keys: ['Enter'], action: 'Confirm/Add', description: 'Confirm action or add product' },
        { keys: ['Esc'], action: 'Cancel', description: 'Close dialog or cancel' },
      ],
    },
    {
      category: 'Product Entry',
      items: [
        { keys: ['Scan'], action: 'Barcode', description: 'Scan barcode, press Enter' },
        { keys: ['0-9'], action: 'Quick Quantity', description: 'Type number then scan' },
        { keys: ['*'], action: 'Multiply', description: 'Quantity multiplier' },
      ],
    },
    {
      category: 'Payment',
      items: [
        { keys: ['Enter'], action: 'Add Payment', description: 'Add payment amount' },
        { keys: ['Tab'], action: 'Next Method', description: 'Switch payment method' },
        { keys: ['1-9'], action: 'Quick Cash', description: 'Quick cash amounts' },
      ],
    },
    {
      category: 'Help',
      items: [
        { keys: ['F1'], action: 'Show Help', description: 'Display this help screen' },
        { keys: ['?'], action: 'Quick Help', description: 'Show quick tips' },
      ],
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyboardIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Keyboard Shortcuts
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Master these shortcuts to complete transactions in seconds!
        </Typography>

        {shortcuts.map((section, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              {section.category}
            </Typography>
            <Table size="small">
              <TableBody>
                {section.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ width: '30%', border: 'none' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {item.keys.map((key, keyIdx) => (
                          <React.Fragment key={keyIdx}>
                            <Chip
                              label={key}
                              size="small"
                              sx={{
                                bgcolor: 'grey.200',
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                              }}
                            />
                            {keyIdx < item.keys.length - 1 && (
                              <Typography variant="body2" sx={{ mx: 0.5 }}>
                                +
                              </Typography>
                            )}
                          </React.Fragment>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.action}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {index < shortcuts.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}

        <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1, mt: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            💡 Pro Tips:
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            • <strong>Barcode Scanner:</strong> Just scan and press Enter - product adds automatically
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            • <strong>Quick Quantity:</strong> Type "2" then scan = 2 units added
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            • <strong>Tab Navigation:</strong> Use Tab to move between fields without mouse
          </Typography>
          <Typography variant="body2">
            • <strong>F8 or F12:</strong> Fastest way to checkout - one key press!
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;





