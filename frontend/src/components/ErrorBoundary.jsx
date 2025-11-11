import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" color="error" gutterBottom>
              🚨 Component Error
            </Typography>
            <Typography variant="h6" gutterBottom>
              Error: {this.state.error?.message || 'Unknown error'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Stack: {this.state.error?.stack?.split('\n').slice(0, 3).join('\n')}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => this.setState({ hasError: false, error: null })}
              sx={{ mr: 2 }}
            >
              Retry
            </Button>
            <Button 
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;



