import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  HealthAndSafety,
} from '@mui/icons-material';

import indexedDBManager from '../../services/IndexedDBManager';
import productManager from '../../services/ProductManager';
import transactionManager from '../../services/TransactionManager';
import PageTitle from '../../components/common/PageTitle';

const POSStatusCheck = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    indexedDB: { status: 'unknown', message: 'Not tested' },
    productManager: { status: 'unknown', message: 'Not tested' },
    transactionManager: { status: 'unknown', message: 'Not tested' },
    dataStorage: { status: 'unknown', message: 'Not tested' },
    searchFunction: { status: 'unknown', message: 'Not tested' }
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const runStatusCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const newStatus = { ...status };

      // Test IndexedDB
      try {
        await indexedDBManager.initialize();
        newStatus.indexedDB = { status: 'success', message: 'IndexedDB initialized successfully' };
      } catch (error) {
        newStatus.indexedDB = { status: 'error', message: `IndexedDB failed: ${error.message}` };
      }

      // Test Product Manager
      try {
        await productManager.initialize();
        newStatus.productManager = { status: 'success', message: 'Product Manager initialized successfully' };
      } catch (error) {
        newStatus.productManager = { status: 'error', message: `Product Manager failed: ${error.message}` };
      }

      // Test Transaction Manager
      try {
        await transactionManager.initialize();
        newStatus.transactionManager = { status: 'success', message: 'Transaction Manager initialized successfully' };
      } catch (error) {
        newStatus.transactionManager = { status: 'error', message: `Transaction Manager failed: ${error.message}` };
      }

      // Test Data Storage
      try {
        const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const testData = { id: testId, name: 'Test Item' };
        
        // Try to add new data with unique ID
        await indexedDBManager.upsert('products', testData);
        const retrieved = await indexedDBManager.get('products', testId);
        
        if (retrieved && retrieved.name === testData.name) {
          newStatus.dataStorage = { status: 'success', message: 'Data storage working correctly' };
        } else {
          newStatus.dataStorage = { status: 'error', message: 'Data storage not working correctly' };
        }
      } catch (error) {
        newStatus.dataStorage = { status: 'error', message: `Data storage failed: ${error.message}` };
      }

      // Test Search Function
      try {
        const searchResults = await productManager.searchProducts('test');
        newStatus.searchFunction = { status: 'success', message: `Search function working - found ${searchResults.length} results` };
      } catch (error) {
        newStatus.searchFunction = { status: 'error', message: `Search function failed: ${error.message}` };
      }

      setStatus(newStatus);
      setSuccess('Status check completed!');
      
    } catch (error) {
      setError('Status check failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Box sx={{ height: '100vh', p: 2, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <PageTitle 
          title="POS System Status Check" 
          subtitle="Monitor POS system health and performance"
          showIcon={true}
          icon={<HealthAndSafety />}
        />
      </Paper>

      {/* Status Check Button */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          🚀 System Status Check
        </Typography>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
          onClick={runStatusCheck}
          disabled={loading}
        >
          {loading ? 'Checking Status...' : 'Run Status Check'}
        </Button>
      </Paper>

      {/* Status Results */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 System Status Results
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText
              primary="IndexedDB Manager"
              secondary={status.indexedDB.message}
            />
            {getStatusIcon(status.indexedDB.status)}
          </ListItem>
          <Divider />
          
          <ListItem>
            <ListItemText
              primary="Product Manager"
              secondary={status.productManager.message}
            />
            {getStatusIcon(status.productManager.status)}
          </ListItem>
          <Divider />
          
          <ListItem>
            <ListItemText
              primary="Transaction Manager"
              secondary={status.transactionManager.message}
            />
            {getStatusIcon(status.transactionManager.status)}
          </ListItem>
          <Divider />
          
          <ListItem>
            <ListItemText
              primary="Data Storage"
              secondary={status.dataStorage.message}
            />
            {getStatusIcon(status.dataStorage.status)}
          </ListItem>
          <Divider />
          
          <ListItem>
            <ListItemText
              primary="Search Function"
              secondary={status.searchFunction.message}
            />
            {getStatusIcon(status.searchFunction.status)}
          </ListItem>
        </List>
      </Paper>

      {/* Summary */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          📋 Summary
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(status).map(([key, value]) => (
            <Grid item xs={6} key={key}>
              <Chip
                label={key}
                color={getStatusColor(value.status)}
                icon={getStatusIcon(value.status)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default POSStatusCheck;
