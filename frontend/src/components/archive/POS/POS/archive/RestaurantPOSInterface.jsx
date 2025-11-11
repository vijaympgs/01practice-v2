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
  Toolbar,
  Avatar,
  Badge,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Discount as DiscountIcon,
  Loyalty as LoyaltyIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  LocalOffer as OfferIcon,
  AccountBalance as BankIcon,
  Sync as SyncIcon,
  Star as StarIcon
} from '@mui/icons-material';

const RestaurantPOSInterface = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('Beverages');
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPoints, setCustomerPoints] = useState(1012);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [orderId, setOrderId] = useState('Order 0201-3346-79');
  const [showWarehouseDialog, setShowWarehouseDialog] = useState(false);
  const [autoRestock, setAutoRestock] = useState({
    main: false,
    jakarta: false,
    bandung: false,
    surabaya: true
  });

  // Mock data for restaurant products
  const [products] = useState([
    { id: 1, name: 'Lemon Squash', price: 5.00, category: 'Beverages', image: '🍋', code: 'B0101' },
    { id: 2, name: 'Cappuccino', price: 6.50, category: 'Beverages', image: '☕', code: 'B0102' },
    { id: 3, name: 'Orange Soda', price: 4.00, category: 'Beverages', image: '🥤', code: 'B0103' },
    { id: 4, name: 'Cookies n Cream', price: 6.00, category: 'Beverages', image: '🍪', code: 'B0104' },
    { id: 5, name: 'Lychee Tea', price: 2.00, category: 'Beverages', image: '🍵', code: 'B0105' },
    { id: 6, name: 'Strawberry Juice', price: 8.00, category: 'Beverages', image: '🍓', code: 'B0106' },
    { id: 7, name: 'Red Mojito', price: 6.50, category: 'Beverages', image: '🍹', code: 'B0107' },
    { id: 8, name: 'Banana Smoothie', price: 7.00, category: 'Beverages', image: '🍌', code: 'B0108' },
    { id: 9, name: 'Lemon Tea', price: 2.00, category: 'Beverages', image: '🍋', code: 'B0109' },
    { id: 10, name: 'Blue Ocean', price: 7.00, category: 'Beverages', image: '🌊', code: 'B0110' },
    { id: 11, name: 'Pink Mojito', price: 6.50, category: 'Beverages', image: '🍹', code: 'B0111' },
    { id: 12, name: 'Sweet Exotic', price: 9.00, category: 'Beverages', image: '🥭', code: 'B0112' },
    { id: 13, name: 'Chicken Soup', price: 8.50, category: 'Soup', image: '🍲', code: 'S0101' },
    { id: 14, name: 'Tomato Soup', price: 6.00, category: 'Soup', image: '🍅', code: 'S0102' },
    { id: 15, name: 'Mushroom Soup', price: 7.50, category: 'Soup', image: '🍄', code: 'S0103' },
    { id: 16, name: 'Garlic Bread', price: 4.50, category: 'Appetizer', image: '🍞', code: 'A0101' },
    { id: 17, name: 'Caesar Salad', price: 9.00, category: 'Appetizer', image: '🥗', code: 'A0102' },
    { id: 18, name: 'Chicken Wings', price: 12.00, category: 'Appetizer', image: '🍗', code: 'A0103' }
  ]);

  const categories = ['Beverages', 'Soup', 'Appetizer', 'Main Course', 'Desserts', 'Sides'];
  const suggestedItems = [
    { id: 19, name: 'Spicy Seafood Fried Noodle', price: 7.50, image: '🍜', code: 'M0101' },
    { id: 20, name: 'Japanese Spicy Curry Salmon', price: 8.50, image: '🐟', code: 'M0102' }
  ];

  // Filter products by category and search
  const filteredProducts = products.filter(product => 
    product.category === selectedCategory && 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Clear order
  const clearOrder = () => {
    setCartItems([]);
    setOrderId(`Order ${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 100)}`);
  };

  // New order
  const newOrder = () => {
    clearOrder();
  };

  // Handle payment
  const handlePayment = () => {
    console.log('Processing payment for order:', orderId);
    console.log('Total amount:', transactionTotal);
    // Process payment logic here
  };

  const taxAmount = transactionTotal * 0.1; // 10% tax
  const finalTotal = transactionTotal + taxAmount;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar sx={{ minHeight: '60px !important', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
              HASHMICRO THINK FORWARD
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              {currentDate.toLocaleDateString('en-GB')} {currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#d32f2f' }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Cashier 1
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content - 3 Column Layout */}
      <Box sx={{ flexGrow: 1, display: 'flex', p: 1, gap: 1 }}>
        {/* Left Column - Product Selection */}
        <Paper sx={{ width: '35%', display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Category Menu */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Menu
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <IconButton size="small">
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', flexGrow: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    color={selectedCategory === category ? 'error' : 'default'}
                    sx={{ 
                      minWidth: 100,
                      fontWeight: selectedCategory === category ? 'bold' : 'normal'
                    }}
                  />
                ))}
              </Box>
              <IconButton size="small">
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Order Menu */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Menu
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                select
                value="All Item"
                sx={{ minWidth: 120 }}
              >
                <option value="All Item">All Item</option>
              </TextField>
              <TextField
                size="small"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ flexGrow: 1 }}
              />
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Product Grid */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Grid container spacing={1}>
              {filteredProducts.map((product) => (
                <Grid item xs={6} key={product.id}>
                  <Card 
                    sx={{ 
                      height: 120,
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
                    <CardContent sx={{ p: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {product.image}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 0.5 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        {/* Middle Column - Features & Customer */}
        <Paper sx={{ width: '30%', display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Feature Menu */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Feature Menu
            </Typography>
            <Grid container spacing={1}>
              {[
                { label: 'Print Receipt', icon: <PrintIcon /> },
                { label: 'Disc Value', icon: <DiscountIcon /> },
                { label: 'Global Disc', icon: <OfferIcon /> },
                { label: 'Quickly Paid [Bank]', icon: <BankIcon /> },
                { label: 'Return is [OFF]', icon: <ClearIcon /> },
                { label: 'Cash In/Out', icon: <PaymentIcon /> },
                { label: 'Cash Opened', icon: <PaymentIcon /> },
                { label: 'Assigned Seller', icon: <PersonIcon /> },
                { label: 'Recommend is [ON]', icon: <StarIcon /> },
                { label: 'Set Start Categ', icon: <SettingsIcon /> },
                { label: 'Sync Backend', icon: <SyncIcon /> },
                { label: 'Deselect Customer', icon: <PersonIcon /> }
              ].map((feature, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={feature.icon}
                    sx={{ 
                      height: 40,
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      justifyContent: 'flex-start'
                    }}
                  >
                    {feature.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Customer Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Customer
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search Customers"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                color="error"
                sx={{ flexGrow: 1 }}
                startIcon={<PersonIcon />}
              >
                Customers
              </Button>
              <Button
                variant="outlined"
                sx={{ flexGrow: 1 }}
                startIcon={<AddIcon />}
              >
                Add Customers
              </Button>
            </Box>
            
            {/* Customer Points */}
            <Paper sx={{ p: 2, bgcolor: '#e3f2fd', mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Customer Points
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Client's Point</Typography>
                  <Typography variant="body2" color="success.main">+1123</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Plus Point</Typography>
                  <Typography variant="body2" color="success.main">+12</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Redeem Point</Typography>
                  <Typography variant="body2" color="error.main">-123</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Remaining Point</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{customerPoints}</Typography>
                </Box>
              </Box>
            </Paper>

            <Button
              fullWidth
              variant="contained"
              color="error"
              size="large"
              startIcon={<LoyaltyIcon />}
            >
              Feature
            </Button>
          </Box>

          {/* Numeric Keypad */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Numeric Keypad
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Typography variant="caption" sx={{ flexGrow: 1, textAlign: 'center' }}>Qty</Typography>
              <Typography variant="caption" sx={{ flexGrow: 1, textAlign: 'center' }}>Disc</Typography>
              <Typography variant="caption" sx={{ flexGrow: 1, textAlign: 'center' }}>Price</Typography>
            </Box>
            <Grid container spacing={1}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '+/-', 0, '⌫'].map((num) => (
                <Grid item xs={4} key={num}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => console.log('Keypad:', num)}
                    sx={{
                      height: 40,
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {num}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        {/* Right Column - Current Order & Payment */}
        <Paper sx={{ width: '35%', display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Current Order Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Current Order
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<AddIcon />}
                onClick={newOrder}
              >
                New Order
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearOrder}
              >
                Clear Order
              </Button>
            </Box>
          </Box>

          {/* Order Items */}
          <Box sx={{ flexGrow: 1, mb: 2 }}>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{item.image}</Typography>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.code}
                            </Typography>
                          </Box>
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
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Receipt Order */}
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Receipt Order
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {orderId}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total Items/Quantities</Typography>
                <Typography variant="body2">${transactionTotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Before Taxes</Typography>
                <Typography variant="body2">${transactionTotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Taxes</Typography>
                <Typography variant="body2">${taxAmount.toFixed(2)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Payment Button */}
          <Button
            fullWidth
            variant="contained"
            color="error"
            size="large"
            startIcon={<PaymentIcon />}
            onClick={handlePayment}
            sx={{ height: 60, fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            Paid - Total ${finalTotal.toFixed(2)}
          </Button>
        </Paper>
      </Box>

      {/* Suggested Items Section */}
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          Suggested Items
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {suggestedItems.map((item) => (
            <Card key={item.id} sx={{ width: 300, display: 'flex' }}>
              <Box sx={{ width: 120, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                <Typography variant="h3">{item.image}</Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ${item.price.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button size="small" variant="outlined">Clear</Button>
                  <IconButton size="small"><RemoveIcon /></IconButton>
                  <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>1</Typography>
                  <IconButton size="small"><AddIcon /></IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Warehouse Management Dialog */}
      <Dialog open={showWarehouseDialog} onClose={() => setShowWarehouseDialog(false)}>
        <DialogTitle>Warehouse Management</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
            {[
              { name: 'Main Warehouse', item: 'Chicken', key: 'main' },
              { name: 'Jakarta Warehouse', item: 'Noodle', key: 'jakarta' },
              { name: 'Bandung Warehouse', item: 'Curry Soup', key: 'bandung' },
              { name: 'Surabaya Warehouse', item: 'Chilli Sauce', key: 'surabaya' }
            ].map((warehouse) => (
              <Box key={warehouse.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box>
                  <Typography variant="h6">{warehouse.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{warehouse.item}</Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoRestock[warehouse.key]}
                      onChange={(e) => setAutoRestock(prev => ({
                        ...prev,
                        [warehouse.key]: e.target.checked
                      }))}
                    />
                  }
                  label="Auto Restock"
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarehouseDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantPOSInterface;
