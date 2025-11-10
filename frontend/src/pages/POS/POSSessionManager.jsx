import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  PlayArrow as StartSessionIcon,
  Stop as EndSessionIcon,
  Security,
} from '@mui/icons-material';

import accessControlManager from '../../services/AccessControlManager';
import securityManager from '../../services/SecurityManager';
import PageTitle from '../../components/common/PageTitle';

const POSSessionManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Authentication state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Session state
  const [sessionNotes, setSessionNotes] = useState('');

  // Initialize managers
  useEffect(() => {
    const initializeManagers = async () => {
      try {
        setLoading(true);
        await accessControlManager.initialize();
        await securityManager.initialize();
        
        // Check if user is already authenticated
        const user = accessControlManager.getCurrentUser();
        const session = accessControlManager.getCurrentSession();
        
        if (user && session) {
          setCurrentUser(user);
          setCurrentSession(session);
          setIsAuthenticated(true);
        }
        
        setSuccess('Session Manager initialized successfully!');
        console.log('✅ Session Manager initialized');
      } catch (error) {
        console.error('❌ Failed to initialize Session Manager:', error);
        setError('Failed to initialize Session Manager: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeManagers();
  }, []);

  // Authenticate operator
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const user = await accessControlManager.authenticateOperator(username, password);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      setSuccess(`Welcome, ${user.name}!`);
      setUsername('');
      setPassword('');
      
      console.log('✅ Operator authenticated:', user.name);
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      setError('Authentication failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Start session
  const handleStartSession = async () => {
    if (!isAuthenticated) {
      setError('Please login first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const session = await accessControlManager.startSession(currentUser.id, 'pos');
      setCurrentSession(session);
      
      setSuccess('Session started successfully!');
      console.log('✅ Session started:', session.id);
    } catch (error) {
      console.error('❌ Failed to start session:', error);
      setError('Failed to start session: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // End session
  const handleEndSession = async () => {
    if (!currentSession) {
      setError('No active session to end');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await accessControlManager.endSession(currentSession.id, sessionNotes);
      setCurrentSession(null);
      
      setSuccess('Session ended successfully!');
      setSessionNotes('');
      console.log('✅ Session ended');
    } catch (error) {
      console.error('❌ Failed to end session:', error);
      setError('Failed to end session: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await accessControlManager.logout();
      setCurrentUser(null);
      setCurrentSession(null);
      setIsAuthenticated(false);
      
      setSuccess('Logged out successfully!');
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Failed to logout:', error);
      setError('Failed to logout: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to POS
  const handleNavigateToPOS = () => {
    if (!currentSession) {
      setError('Please start a session first');
      return;
    }
    
    // Navigate to POS interface
    window.location.href = '/pos-indexeddb';
  };

  return (
    <Box sx={{ height: '100vh', p: 2, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1976d2', color: 'white' }}>
        <PageTitle 
          title="POS Session Management" 
          subtitle="Manage POS user sessions and authentication"
          showIcon={true}
          icon={<Security />}
        />
      </Paper>

      <Grid container spacing={2} sx={{ height: 'calc(100vh - 120px)' }}>
        {/* Left Column - Authentication */}
        <Grid item xs={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              🔑 Operator Authentication
            </Typography>
            
            {!isAuthenticated ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="admin"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="admin123"
                />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Login'}
                </Button>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <strong>Default Credentials:</strong><br />
                  Username: admin<br />
                  Password: admin123
                </Alert>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      👤 Logged In As
                    </Typography>
                    <Typography variant="body1">
                      <strong>Name:</strong> {currentUser.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Role:</strong> {currentUser.role}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Username:</strong> {currentUser.username}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  disabled={loading}
                  color="error"
                >
                  {loading ? <CircularProgress size={20} /> : 'Logout'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Session Management */}
        <Grid item xs={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              ⏱️ Session Management
            </Typography>
            
            {!isAuthenticated ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please login first to manage sessions
              </Alert>
            ) : (
              <Box sx={{ mt: 2 }}>
                {!currentSession ? (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No active session. Start a new session to begin POS operations.
                    </Alert>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<StartSessionIcon />}
                      onClick={handleStartSession}
                      disabled={loading}
                      sx={{ mb: 2 }}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Start POS Session'}
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          📊 Active Session
                        </Typography>
                        <Typography variant="body1">
                          <strong>Session ID:</strong> {currentSession.id}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Started:</strong> {new Date(currentSession.startTime).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Status:</strong> 
                          <Chip label={currentSession.status} color="success" size="small" sx={{ ml: 1 }} />
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <TextField
                      fullWidth
                      label="Session Notes (Optional)"
                      multiline
                      rows={3}
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      sx={{ mb: 2 }}
                      placeholder="Add notes about this session..."
                    />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleNavigateToPOS}
                          sx={{ mb: 1 }}
                        >
                          🛒 Go to POS
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<EndSessionIcon />}
                          onClick={handleEndSession}
                          disabled={loading}
                          color="error"
                        >
                          {loading ? <CircularProgress size={20} /> : 'End Session'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default POSSessionManager;
