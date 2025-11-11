import React, { useState, useEffect } from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import { Container, Typography, Box, Button, Alert, TextField, Card, CardContent } from '@mui/material';
import { BugReport as BugReportIcon } from '@mui/icons-material';
import { fetchProducts } from '../store/slices/productSlice';
import { login } from '../store/slices/authSlice';

const ProductsDebug = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [loginData, setLoginData] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [apiTest, setApiTest] = useState(null);

  useEffect(() => {
    console.log('ProductsDebug: useEffect triggered');
    if (isAuthenticated) {
      dispatch(fetchProducts());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', loginData);
      await dispatch(login(loginData));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleTestAPI = async () => {
    try {
      console.log('Testing API directly...');
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      
      const response = await fetch('http://localhost:8000/api/products/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      setApiTest({
        status: response.status,
        data: data,
        success: response.ok
      });
    } catch (error) {
      console.error('API Error:', error);
      setApiTest({
        status: 'error',
        data: error.message,
        success: false
      });
    }
  };

  const handleLoadProducts = () => {
    console.log('Loading products via Redux...');
    dispatch(fetchProducts());
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <PageTitle 
          title="Products Debug Page" 
          subtitle="Debug interface for testing products API and authentication"
          showIcon={true}
          icon={<BugReportIcon />}
        />

        {/* Authentication Status */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Authentication Status
            </Typography>
            <Typography variant="body2">
              Authenticated: {isAuthenticated ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2">
              User: {user ? user.username : 'None'}
            </Typography>
            <Typography variant="body2">
              Token: {localStorage.getItem('accessToken') ? 'Present' : 'Missing'}
            </Typography>
          </CardContent>
        </Card>

        {/* Login Form */}
        {!isAuthenticated && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Login
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  size="small"
                />
                <Button variant="contained" onClick={handleLogin}>
                  Login
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* API Test */}
        {isAuthenticated && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Test
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="contained" onClick={handleTestAPI}>
                  Test API Direct
                </Button>
                <Button variant="contained" onClick={handleLoadProducts}>
                  Load Products via Redux
                </Button>
              </Box>
              {apiTest && (
                <Alert severity={apiTest.success ? 'success' : 'error'} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">API Test Result:</Typography>
                  <Typography variant="body2">Status: {apiTest.status}</Typography>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                    {JSON.stringify(apiTest.data, null, 2)}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products Status */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Products Status
            </Typography>
            <Typography variant="body2">
              Loading: {loading ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2">
              Error: {error || 'None'}
            </Typography>
            <Typography variant="body2">
              Products Count: {products ? products.length : 0}
            </Typography>
            {products && products.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">First Product:</Typography>
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                  {JSON.stringify(products[0], null, 2)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Debug Information:
            </Typography>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
              {JSON.stringify({ 
                isAuthenticated, 
                user: user?.username || null,
                loading, 
                error, 
                productsCount: products?.length || 0,
                token: localStorage.getItem('accessToken') ? 'Present' : 'Missing'
              }, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProductsDebug;

































