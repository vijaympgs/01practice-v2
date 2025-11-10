import React from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import { Science as ScienceIcon } from '@mui/icons-material';

const ProductsTest = () => {
  const handleTestAPI = async () => {
    try {
      console.log('Testing API...');
      const response = await fetch('http://localhost:8000/api/products/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        alert(`API Success! Found ${data.results?.length || 0} products`);
      } else {
        alert(`API Error: ${data.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      alert(`Network Error: ${error.message}`);
    }
  };

  const handleTestAuth = () => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    console.log('Auth tokens:', { token, refreshToken });
    alert(`Token: ${token ? 'Present' : 'Missing'}\nRefresh: ${refreshToken ? 'Present' : 'Missing'}`);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <PageTitle 
          title="Products Test Page" 
          subtitle="Debug interface for testing products API and authentication"
          showIcon={true}
          icon={<ScienceIcon />}
        />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Debug Tools:
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="contained" onClick={handleTestAuth}>
              Check Authentication
            </Button>
            <Button variant="contained" onClick={handleTestAPI}>
              Test Products API
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Instructions:
          </Typography>
          <ol>
            <li>Click "Check Authentication" to see if you're logged in</li>
            <li>Click "Test Products API" to test the API directly</li>
            <li>Check the browser console (F12) for detailed logs</li>
            <li>If authentication fails, go to <a href="/login">Login Page</a></li>
          </ol>
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current URL: {window.location.href}
          </Typography>
          <Typography variant="body2">
            This is a test page to debug the Products functionality.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsTest;

































