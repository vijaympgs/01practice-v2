import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Paper,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const SalesTransactions = ({ mode, embeddedDB, posService, onMessage }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentCart, setCurrentCart] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load sample products on mount
  useEffect(() => {
    loadSampleProducts();
  }, []);

  // Load current transaction and cart
  useEffect(() => {
    if (posService) {
      setCurrentTransaction(posService.getCurrentTransaction());
      setCurrentCart(posService.getCurrentCart());
    }
  }, [posService]);

  const loadSampleProducts = async () => {
    const sampleProducts = [
      {
        id: '1',
        name: 'Premium Coffee',
        barcode: '9876543210987',
        price: 4.99,
        cost: 2.50,
        category: 'Beverages',
        taxRate: 8,
        isActive: true,
        currentStock: 100
      },
      {
        id: '2',
        name: 'Chocolate Croissant',
        barcode: '1234567890123',
        price: 3.49,
        cost: 1.75,
        category: 'Pastries',
        taxRate: 8,
        isActive: true,
        currentStock: 50
      },
      {
        id: '3',
        name: 'Green Tea',
        barcode: '4567890123456',
        price: 2.99,
        cost: 1.50,
        category: 'Beverages',
        taxRate: 8,
        isActive: true,
        currentStock: 75
      },
      {
        id: '4',
        name: 'Sandwich',
        barcode: '7890123456789',
        price: 6.99,
        cost: 3.50,
        category: 'Food',
        taxRate: 8,
        isActive: true,
        currentStock: 25
      },
      {
        id: '5',
        name: 'Energy Drink',
        barcode: '2345678901234',
        price: 3.99,
        cost: 2.00,
        category: 'Beverages',
        taxRate: 8,
        isActive: true,
        currentStock: 60
      }
    ];

    setProducts(sampleProducts);
    setSearchResults(sampleProducts);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(products);
      return;
    }

    try {
      setLoading(true);
      
      if (posService) {
        const results = await posService.searchProducts(searchQuery);
        setSearchResults(results);
      } else {
        // Fallback client-side search
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.barcode.includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      onMessage(`❌ Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      if (!currentTransaction) {
        onMessage('⚠️ Please start a transaction first');
        return;
      }

      if (posService) {
        await posService.addProductToCart(product, 1);
        setCurrentCart(posService.getCurrentCart());
        setCurrentTransaction(posService.getCurrentTransaction());
        onMessage(`✅ Added ${product.name} to cart`);
      } else {
        // Fallback cart management
        const existingItem = currentCart.find(item => item.productId === product.id);
        
        if (existingItem) {
          existingItem.quantity += 1;
          existingItem.total = existingItem.quantity * existingItem.price;
        } else {
          const newItem = {
            id: `item-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            total: product.price,
            barcode: product.barcode,
            category: product.category
          };
          currentCart.push(newItem);
        }
        
        setCurrentCart([...currentCart]);
        onMessage(`✅ Added ${product.name} to cart`);
      }
    } catch (error) {
      onMessage(`❌ Failed to add to cart: ${error.message}`);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      if (posService) {
        await posService.updateProductQuantity(productId, newQuantity);
        setCurrentCart(posService.getCurrentCart());
        setCurrentTransaction(posService.getCurrentTransaction());
      } else {
        // Fallback quantity update
        const updatedCart = currentCart.map(item => 
          item.productId === productId 
            ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
            : item
        ).filter(item => item.quantity > 0);
        
        setCurrentCart(updatedCart);
      }
    } catch (error) {
      onMessage(`❌ Failed to update quantity: ${error.message}`);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      if (posService) {
        await posService.removeProductFromCart(productId);
        setCurrentCart(posService.getCurrentCart());
        setCurrentTransaction(posService.getCurrentTransaction());
      } else {
        // Fallback removal
        setCurrentCart(currentCart.filter(item => item.productId !== productId));
      }
      onMessage('✅ Item removed from cart');
    } catch (error) {
      onMessage(`❌ Failed to remove item: ${error.message}`);
    }
  };

  const startNewTransaction = async () => {
    try {
      if (posService) {
        const transaction = await posService.startTransaction('OP001', 'SESS001');
        setCurrentTransaction(transaction);
        setCurrentCart([]);
        onMessage('🛒 New transaction started');
      } else {
        // Fallback transaction creation
        const transaction = {
          id: `TXN-${Date.now()}`,
          operatorId: 'OP001',
          sessionId: 'SESS001',
          timestamp: new Date(),
          status: 'in_progress',
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0
        };
        setCurrentTransaction(transaction);
        setCurrentCart([]);
        onMessage('🛒 New transaction started');
      }
    } catch (error) {
      onMessage(`❌ Failed to start transaction: ${error.message}`);
    }
  };

  const calculateTotals = () => {
    const subtotal = currentCart.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const totals = calculateTotals();

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Panel - Product Search */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Search
              </Typography>
              
              {/* Search Bar */}
              <TextField
                fullWidth
                label="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleSearch} disabled={loading}>
                        Search
                      </Button>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />

              {/* Product List */}
              <Box sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
                {searchResults.map((product) => (
                  <Card 
                    key={product.id} 
                    sx={{ mb: 1, cursor: 'pointer' }}
                    onClick={() => handleAddToCart(product)}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={8}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.category} • {product.barcode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Stock: {product.currentStock}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="primary">
                            ${product.price}
                          </Typography>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                          >
                            Add
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Cart & Transaction */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Current Transaction
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<CartIcon />}
                  onClick={startNewTransaction}
                  disabled={currentTransaction}
                >
                  New Transaction
                </Button>
              </Box>

              {currentTransaction && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Transaction ID: {currentTransaction.id}
                </Alert>
              )}

              {/* Cart Items */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Cart Items ({currentCart.length})
                </Typography>
                
                {currentCart.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Cart is empty. Add products to start.
                  </Typography>
                ) : (
                  <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    {currentCart.map((item) => (
                      <ListItem key={item.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={item.name}
                          secondary={`$${item.price} each`}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                          <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'right' }}>
                            ${item.total.toFixed(2)}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFromCart(item.productId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              {/* Totals */}
              {currentCart.length > 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">${totals.subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax (8%):</Typography>
                    <Typography variant="body2">${totals.tax.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold">${totals.total.toFixed(2)}</Typography>
                  </Box>
                </Paper>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<ReceiptIcon />}
                  disabled={currentCart.length === 0}
                  sx={{ flex: 2 }}
                >
                  Process Payment
                </Button>
                <Button
                  variant="outlined"
                  disabled={currentCart.length === 0}
                >
                  Suspend
                </Button>
              </Box>

              {/* Mode Indicator */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Chip
                  label={mode === 'online' ? 'Online Mode' : 'Offline Mode'}
                  color={mode === 'online' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesTransactions;
