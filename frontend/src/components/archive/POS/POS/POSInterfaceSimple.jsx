import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  CircularProgress,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';

const POSInterfaceSimple = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    initializePOS();
  }, []);

  const initializePOS = async () => {
    try {
      setLoading(true);
      setMessage('🚀 Initializing Simple POS System...');
      
      console.log('🔄 Starting Simple POS initialization...');
      
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create sample products
      const sampleProducts = [
        {
          id: '1',
          name: 'Premium Coffee',
          price: 4.99,
          barcode: '123456789',
          category: 'Beverages'
        },
        {
          id: '2', 
          name: 'Chocolate Croissant',
          price: 3.49,
          barcode: '987654321',
          category: 'Pastries'
        },
        {
          id: '3',
          name: 'Green Tea',
          price: 2.99,
          barcode: '456789123',
          category: 'Beverages'
        }
      ];
      
      setProducts(sampleProducts);
      setSearchResults(sampleProducts);
      
      setIsInitialized(true);
      setMessage('✅ Simple POS System ready!');
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(`❌ Initialization failed: ${error.message}`);
      console.error('Simple POS Initialization Error:', error);
      
      // Set fallback state
      setIsInitialized(true);
      setProducts([]);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(products);
      return;
    }
    
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery)
    );
    
    setSearchResults(filtered);
  };

  const handleAddToCart = (product) => {
    setMessage(`✅ Added ${product.name} to cart`);
    setTimeout(() => setMessage(null), 1500);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        p: 4 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Initializing Simple POS System...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Setting up basic transaction processing
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100vh', overflow: 'hidden' }}>
      {message && (
        <Alert 
          severity={message.includes('❌') ? 'error' : 'success'}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        🏪 Simple POS System
      </Typography>

      <Grid container spacing={2}>
        {/* Search Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Search
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSearch}
                  sx={{ minWidth: 120 }}
                >
                  Search
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Found {searchResults.length} products
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {searchResults.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    
                    <Typography variant="h5" color="primary" gutterBottom>
                      ${product.price}
                    </Typography>
                    
                    <Chip 
                      label={product.category} 
                      size="small" 
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Barcode: {product.barcode}
                    </Typography>
                    
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {searchResults.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different search term
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default POSInterfaceSimple;
