import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Divider,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  QrCodeScanner as BarcodeIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  Category as CategoryIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const DesktopPOSInterfaceSimple = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [invoiceInput, setInvoiceInput] = useState('');
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data for products
  const [products] = useState([
    { id: 1, name: 'Butter Milk Pouch', price: 10.00, category: 'Dairy Products', sku: 'SKU: 1001' },
    { id: 2, name: 'Butter Milk Powder', price: 12.00, category: 'Dairy Products', sku: 'SKU: 1002' },
    { id: 3, name: 'Fresh Milk 1L', price: 15.00, category: 'Dairy Products', sku: 'SKU: 1003' },
    { id: 4, name: 'Yogurt 500ml', price: 20.00, category: 'Dairy Products', sku: 'SKU: 1004' },
    { id: 5, name: 'Cheese Slice', price: 25.00, category: 'Dairy Products', sku: 'SKU: 1005' },
    { id: 6, name: 'Butter 100g', price: 30.00, category: 'Dairy Products', sku: 'SKU: 1006' },
    { id: 7, name: 'Apple', price: 5.00, category: 'Fruits', sku: 'SKU: 2001' },
    { id: 8, name: 'Banana', price: 3.00, category: 'Fruits', sku: 'SKU: 2002' },
    { id: 9, name: 'Orange', price: 4.00, category: 'Fruits', sku: 'SKU: 2003' }
  ]);

  const categories = ['All Categories', 'Vegetables', 'Garments', 'Footwear', 'Grocery', 'Fruits', 'Electronics', 'Dairy Products', 'Health', 'Others'];

  // Filter products by category
  const filteredProducts = selectedCategory === 'All Categories' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Calculate transaction total
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTransactionTotal(total);
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Handle barcode scan
  const handleBarcodeScan = () => {
    console.log('Barcode scanned:', barcodeInput);
    setBarcodeInput('');
  };

  // Handle payment
  const handlePayment = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    console.log('Processing payment:', paymentMethod);
  };

  // Update responsive breakpoints based on window size
  const isMobileScreen = windowSize.width < 768;
  const isTabletScreen = windowSize.width >= 768 && windowSize.width < 1200;
  const isDesktopScreen = windowSize.width >= 1200;

  // If mobile, show mobile-optimized version
  if (isMobileScreen) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Mobile POS Interface
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please use the mobile-optimized POS interface for smaller screens.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Current screen width: {windowSize.width}px
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#2c3e50', height: 60 }}>
        <Toolbar sx={{ minHeight: '60px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mr: 3 }}>
              {currentDate.toLocaleDateString('en-GB')} {currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <TextField
              size="small"
              placeholder="Counter Name"
              sx={{ 
                bgcolor: 'white', 
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' }
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="inherit">
              <ReceiptIcon />
            </IconButton>
            <IconButton color="inherit">
              <PaymentIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', p: 1, gap: 1 }}>
        {/* Left Panel - Transaction Details */}
        <Paper sx={{ width: '40%', display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Customer Input */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>

          {/* Search Inputs */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Scan Barcode"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
              InputProps={{
                startAdornment: <BarcodeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              size="small"
              placeholder="Scan Invoice"
              value={invoiceInput}
              onChange={(e) => setInvoiceInput(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          </Box>

          {/* Transaction List */}
          <Box sx={{ flexGrow: 1, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Items
            </Typography>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.sku}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body2">{item.quantity}</Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Transaction Summary */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: '#2c3e50', 
            color: 'white',
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon />
              Transaction Summary
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CartIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body2">Items</Typography>
                </Box>
                <Chip 
                  label={cartItems.length} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#2c3e50',
                    fontWeight: 'bold'
                  }} 
                />
              </Box>

              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Total Amount</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ₹{transactionTotal.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pt: 1
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Grand Total
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#4caf50'
                  }}
                >
                  ₹{transactionTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Simple Numeric Keypad */}
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Numeric Keypad
            </Typography>
            
            <Grid container spacing={1}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <Grid item xs={4} key={num}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => console.log('Number clicked:', num)}
                    sx={{
                      height: 50,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      bgcolor: 'white',
                      color: 'text.primary',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    {num}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Paper>

        {/* Right Panel - Product Selection */}
        <Paper sx={{ width: '60%', display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Category Title */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon />
              {selectedCategory}
            </Typography>
            <Chip 
              label={`${filteredProducts.length} items`} 
              color="primary" 
              variant="outlined" 
            />
          </Box>

          <Box sx={{ display: 'flex', flexGrow: 1, gap: 2 }}>
            {/* Product Grid */}
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={4} key={product.id}>
                    <Card 
                      sx={{ 
                        height: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3
                        }
                      }}
                      onClick={() => addToCart(product)}
                    >
                      <Box sx={{ 
                        height: 100, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: '#f5f5f5',
                        position: 'relative'
                      }}>
                        <Typography variant="h4" sx={{ color: 'text.secondary' }}>📦</Typography>
                        <Chip 
                          label={product.sku}
                          size="small"
                          sx={{ 
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'medium',
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {product.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography 
                            variant="h6" 
                            color="primary" 
                            sx={{ fontWeight: 'bold' }}
                          >
                            ₹{product.price.toFixed(2)}
                          </Typography>
                          
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            sx={{ 
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'primary.dark'
                              }
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Category List & Payment Options */}
            <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Categories */}
              <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'contained' : 'outlined'}
                      onClick={() => setSelectedCategory(category)}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none'
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </Box>
              </Paper>
              
              {/* Payment Options */}
              <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" gutterBottom>
                  Payment Methods
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['CASH', 'CARD', 'CARD & PRINT', 'OTHER'].map((method) => (
                    <Button
                      key={method}
                      variant={selectedPayment === method ? 'contained' : 'outlined'}
                      onClick={() => handlePayment(method)}
                      sx={{
                        height: 50,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      {method}
                    </Button>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DesktopPOSInterfaceSimple;
