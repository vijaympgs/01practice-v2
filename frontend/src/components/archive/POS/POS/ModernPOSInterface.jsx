import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Stack,
  Badge,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  CreditCard,
  AttachMoney,
  Person,
  Phone,
  Email,
  LocationOn,
  Loyalty,
  CardGiftcard,
  Receipt,
  Close,
  KeyboardArrowDown,
  Refresh,
  LocalOffer,
  Inventory,
  Settings,
  CheckCircle,
} from '@mui/icons-material';

const ModernPOSInterface = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(2); // Yellow Leopard Print Bag is selected
  const [keypadValue, setKeypadValue] = useState('');
  const [activeNavigation, setActiveNavigation] = useState('actions');

  // Sample transaction data
  const transactionItems = [
    {
      id: 1,
      name: 'Brown Aviator Sunglasses',
      quantity: -1,
      salesRep: 'John Doe',
      total: -142.50,
      isReturn: true,
    },
    {
      id: 2,
      name: 'Green Class Ring',
      quantity: -1,
      salesRep: 'Jane Smith',
      total: -61.75,
      isReturn: true,
    },
    {
      id: 3,
      name: 'Yellow Leopard Print Bag',
      quantity: 1,
      salesRep: 'Mike Johnson',
      total: 270.00,
      isReturn: false,
    },
  ];

  const customerInfo = {
    name: 'Karen Berg',
    id: '2001',
    phone: '+1 (555) 123-4567',
    email: 'karen.berg@email.com',
    loyaltyCard: '55103',
    balance: 0.00,
    marketingOptIn: false,
    address: '712 1st Ave SW, Kirkland, WA 98007, USA',
    profileImage: null,
  };

  const transactionSummary = {
    lines: 3,
    discounts: 19.25,
    subtotal: 65.75,
    tax: 4.11,
    payments: 0.00,
    changeDue: 69.86,
  };

  const actionButtons = [
    { label: 'Set quantity', icon: <Add />, color: 'success' },
    { label: 'Add loyalty card', icon: <Loyalty />, color: 'success' },
    { label: 'Change unit of measure', icon: <Settings />, color: 'success' },
    { label: 'Return product', icon: <Refresh />, color: 'success' },
    { label: 'Line comment', icon: <Receipt />, color: 'success' },
    { label: 'Gift cards', icon: <CardGiftcard />, color: 'default' },
    { label: 'Transaction options', icon: <ShoppingCart />, color: 'default' },
    { label: 'Voids', icon: <Close />, color: 'default' },
    { label: 'Tax overrides', icon: <Refresh />, color: 'default' },
  ];

  const navigationItems = [
    { id: 'actions', label: 'ACTIONS', icon: <CheckCircle /> },
    { id: 'orders', label: 'ORDERS', icon: <Receipt /> },
    { id: 'discounts', label: 'DISCOUNTS', icon: <LocalOffer /> },
    { id: 'products', label: 'PRODUCTS', icon: <Inventory /> },
  ];

  const handleKeypadInput = (value) => {
    if (value === 'backspace') {
      setKeypadValue(prev => prev.slice(0, -1));
    } else if (value === 'enter') {
      // Handle enter action
      console.log('Enter pressed:', keypadValue);
      setKeypadValue('');
    } else {
      setKeypadValue(prev => prev + value);
    }
  };

  const keypadButtons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['±', '0', '.'],
  ];

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Paper sx={{ 
        height: 60, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 3,
        backgroundColor: '#424242',
        color: 'white',
        borderRadius: 0
      }}>
        <Typography variant="h6" fontWeight="bold">
          Transaction
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" sx={{ color: 'white' }}>
            <Typography>−</Typography>
          </IconButton>
          <IconButton size="small" sx={{ color: 'white' }}>
            <Typography>□</Typography>
          </IconButton>
          <IconButton size="small" sx={{ color: 'white' }}>
            <Typography>×</Typography>
          </IconButton>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        gap: 1, 
        p: 1,
        overflow: 'hidden'
      }}>
        {/* Left Panel - Transaction Lines */}
        <Paper sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
          >
            <Tab label="Lines" />
            <Tab label="Payments" />
          </Tabs>
          
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ITEM</TableCell>
                  <TableCell align="center">QUANTITY</TableCell>
                  <TableCell>SALES REPRESENTATIVE</TableCell>
                  <TableCell align="right">TOTAL (WITHOUT TAX)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionItems.map((item) => (
                  <TableRow 
                    key={item.id}
                    sx={{ 
                      backgroundColor: selectedItem === item.id ? '#4caf50' : 'transparent',
                      color: selectedItem === item.id ? 'white' : 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: selectedItem === item.id ? '#4caf50' : '#f5f5f5'
                      }
                    }}
                    onClick={() => setSelectedItem(item.id)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <KeyboardArrowDown fontSize="small" />
                        {item.name}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={item.quantity} 
                        size="small"
                        color={item.quantity < 0 ? 'error' : 'default'}
                        variant={item.quantity < 0 ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell>{item.salesRep}</TableCell>
                    <TableCell align="right">
                      <Typography 
                        color={item.total < 0 ? 'error' : 'inherit'}
                        fontWeight="bold"
                      >
                        {item.total < 0 ? `($${Math.abs(item.total).toFixed(2)})` : `$${item.total.toFixed(2)}`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        {/* Middle Panel - Customer Info & Keypad */}
        <Paper sx={{ 
          width: 350, 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          {/* Customer Information */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: '#4caf50' }}>
                <Person fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {customerInfo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {customerInfo.id}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <IconButton size="small">
                    <Phone fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <Email fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">LOYALTY CARD:</Typography>
                <Typography variant="body2" fontWeight="bold">{customerInfo.loyaltyCard}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">BALANCE:</Typography>
                <Typography variant="body2" fontWeight="bold">${customerInfo.balance.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">MARKETING OPT-IN:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {customerInfo.marketingOptIn ? 'YES' : 'NO'}
                </Typography>
              </Box>
            </Stack>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                HOME ADDRESS:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {customerInfo.address}
              </Typography>
              <Chip label="PRIMARY" size="small" color="primary" />
            </Box>
            
            <TextField
              fullWidth
              placeholder="Search or enter quantity"
              size="small"
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Numeric Keypad */}
          <Box sx={{ flex: 1, p: 2, backgroundColor: '#f5f5f5' }}>
            <Grid container spacing={1}>
              {keypadButtons.map((row, rowIndex) => (
                <Grid container item key={rowIndex} spacing={1}>
                  {row.map((button) => (
                    <Grid item xs={4} key={button}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          height: 50,
                          backgroundColor: 'white',
                          color: 'black',
                          border: '1px solid #e0e0e0',
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          }
                        }}
                        onClick={() => handleKeypadInput(button)}
                      >
                        {button}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              ))}
              
              {/* Special buttons row */}
              <Grid container item spacing={1}>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      height: 50,
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid #e0e0e0',
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                    onClick={() => handleKeypadInput('backspace')}
                  >
                    <Delete />
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      height: 50,
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid #e0e0e0',
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                    onClick={() => handleKeypadInput('*')}
                  >
                    *
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      height: 50,
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid #e0e0e0',
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                    onClick={() => handleKeypadInput('abc')}
                  >
                    abc
                  </Button>
                </Grid>
              </Grid>
              
              {/* Enter button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    height: 50,
                    backgroundColor: '#4caf50',
                    color: 'white',
                    '&:hover': { backgroundColor: '#45a049' }
                  }}
                  onClick={() => handleKeypadInput('enter')}
                >
                  ←
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Right Panel - Action Buttons & Navigation */}
        <Paper sx={{ 
          width: 300, 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          {/* Action Buttons Grid */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Grid container spacing={1}>
              {actionButtons.map((button, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      height: 60,
                      backgroundColor: button.color === 'success' ? '#4caf50' : '#424242',
                      color: 'white',
                      fontSize: '0.75rem',
                      flexDirection: 'column',
                      gap: 0.5,
                      '&:hover': {
                        backgroundColor: button.color === 'success' ? '#45a049' : '#616161',
                      }
                    }}
                  >
                    {button.icon}
                    {button.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
            
            {/* Payment Buttons */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  height: 60,
                  backgroundColor: '#4caf50',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
                startIcon={<AttachMoney />}
              >
                Pay cash
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  height: 60,
                  backgroundColor: '#4caf50',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
                startIcon={<CreditCard />}
              >
                Pay card
              </Button>
            </Box>
          </Box>

          {/* Vertical Navigation */}
          <Box sx={{ 
            width: 60, 
            backgroundColor: '#424242',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2
          }}>
            {navigationItems.map((item) => (
              <IconButton
                key={item.id}
                sx={{
                  mb: 2,
                  color: activeNavigation === item.id ? '#4caf50' : 'white',
                  backgroundColor: activeNavigation === item.id ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                onClick={() => setActiveNavigation(item.id)}
              >
                {item.icon}
              </IconButton>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Bottom Transaction Summary */}
      <Paper sx={{ 
        height: 80, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 3,
        backgroundColor: 'white',
        borderRadius: 0,
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography variant="body1">
            <strong>LINES:</strong> {transactionSummary.lines}
          </Typography>
          <Typography variant="body1">
            <strong>DISCOUNTS:</strong> ${transactionSummary.discounts.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>SUBTOTAL:</strong> ${transactionSummary.subtotal.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>TAX:</strong> ${transactionSummary.tax.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>PAYMENTS:</strong> ${transactionSummary.payments.toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            CHANGE DUE
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="#4caf50"
          >
            ${transactionSummary.changeDue.toFixed(2)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ModernPOSInterface;
