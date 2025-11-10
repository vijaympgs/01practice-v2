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
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

import POSBasicTest from '../../tests/POSBasicTest';
import POSSimpleTest from '../../tests/POSSimpleTest';
import POSRealFunctionalityTest from '../../tests/POSRealFunctionalityTest';
import PageTitle from '../../components/common/PageTitle';

const POSTestRunner = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const runTests = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const testRunner = new POSRealFunctionalityTest();
      await testRunner.runRealFunctionalityTests();
      
      setTestResults(testRunner.testResults);
      setSuccess('Tests completed successfully!');
      
    } catch (error) {
      setError('Tests failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cleanupTests = async () => {
    try {
      setLoading(true);
      const testRunner = new POSRealFunctionalityTest();
      await testRunner.cleanup();
      setSuccess('Test data cleaned up successfully!');
    } catch (error) {
      setError('Cleanup failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', p: 2, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <PageTitle 
          title="POS System Test Runner" 
          subtitle="Test POS system components and functionality"
          showIcon={true}
          icon={<ScienceIcon />}
        />
      </Paper>

      {/* Test Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          🚀 Test Controls
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <PlayIcon />}
            onClick={runTests}
            disabled={loading}
          >
            {loading ? 'Running Tests...' : 'Run Real Functionality Tests'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cleanupTests}
            disabled={loading}
          >
            Cleanup Test Data
          </Button>
        </Box>
      </Paper>

      {/* Test Results */}
      {testResults && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            📊 Test Results
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success">
                    {testResults.passed}
                  </Typography>
                  <Typography variant="body2">Passed</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="error">
                    {testResults.failed}
                  </Typography>
                  <Typography variant="body2">Failed</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%
                  </Typography>
                  <Typography variant="body2">Success Rate</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="info">
                    {testResults.passed + testResults.failed}
                  </Typography>
                  <Typography variant="body2">Total Tests</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Test Status */}
          <Box sx={{ mt: 2 }}>
            <Chip
              label={testResults.failed === 0 ? 'All Tests Passed' : 'Some Tests Failed'}
              color={testResults.failed === 0 ? 'success' : 'error'}
              icon={testResults.failed === 0 ? <CheckIcon /> : <ErrorIcon />}
            />
          </Box>

          {/* Errors */}
          {testResults.errors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                ❌ Errors:
              </Typography>
              {testResults.errors.map((error, index) => (
                <Alert key={index} severity="error" sx={{ mb: 1 }}>
                  {error}
                </Alert>
              ))}
            </Box>
          )}
        </Paper>
      )}

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

export default POSTestRunner;
