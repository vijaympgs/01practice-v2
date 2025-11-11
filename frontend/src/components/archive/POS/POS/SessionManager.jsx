import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Login,
  Logout,
  AccountCircle,
  Security,
  AccessTime,
  Store,
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Settings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SessionManager = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    showPassword: false
  });
  const [floatAmount, setFloatAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [sessionSettings, setSessionSettings] = useState({
    autoLogout: true,
    sessionTimeout: 480, // 8 hours in minutes
    requireFloatAmount: true,
    allowMultipleSessions: false
  });

  // Mock users for demonstration
  const mockUsers = [
    {
      id: 'U001',
      username: 'cashier1',
      password: 'cashier123',
      name: 'John Smith',
      role: 'Cashier',
      permissions: ['sales', 'payments', 'customers'],
      avatar: '/avatars/cashier1.jpg'
    },
    {
      id: 'U002',
      username: 'supervisor1',
      password: 'supervisor123',
      name: 'Jane Doe',
      role: 'Supervisor',
      permissions: ['sales', 'payments', 'customers', 'void', 'discount', 'refund'],
      avatar: '/avatars/supervisor1.jpg'
    },
    {
      id: 'U003',
      username: 'manager1',
      password: 'manager123',
      name: 'Mike Johnson',
      role: 'Manager',
      permissions: ['sales', 'payments', 'customers', 'void', 'discount', 'refund', 'reports', 'settings'],
      avatar: '/avatars/manager1.jpg'
    }
  ];

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers.find(u => 
        u.username === loginForm.username && u.password === loginForm.password
      );

      if (!user) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      if (sessionSettings.requireFloatAmount && !floatAmount) {
        setError('Float amount is required');
        setLoading(false);
        return;
      }

      const newSession = {
        id: `SES${Date.now()}`,
        user: user,
        startTime: new Date(),
        floatAmount: parseFloat(floatAmount) || 0,
        status: 'active',
        tillId: 'TILL001',
        location: 'Main Store',
        transactions: 0,
        totalSales: 0
      };

      setSession(newSession);
      setSuccess(`Welcome ${user.name}! Session started successfully.`);
      setFloatAmount('');
      setLoginForm({ username: '', password: '', showPassword: false });

      // Navigate to POS screen
      navigate('/pos');
      
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      // Simulate API call for session end
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSuccess(`Session ended successfully. Goodbye ${session.user.name}!`);
      setSession(null);
      
      // Navigate to login
      navigate('/pos-login');
      
    } catch (err) {
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setLoginForm(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const getSessionDuration = () => {
    if (!session) return '00:00:00';
    
    const now = new Date();
    const start = new Date(session.startTime);
    const diff = now - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Auto-logout timer
  useEffect(() => {
    if (session && sessionSettings.autoLogout) {
      const timer = setInterval(() => {
        const now = new Date();
        const start = new Date(session.startTime);
        const diff = now - start;
        const minutesElapsed = Math.floor(diff / (1000 * 60));
        
        if (minutesElapsed >= sessionSettings.sessionTimeout) {
          handleLogout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(timer);
    }
  }, [session, sessionSettings]);

  if (session) {
    // Session Active View
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircle color="success" />
              Active Session
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => setSettingsDialog(true)} color="primary">
                <Settings />
              </IconButton>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Logout />}
                onClick={handleLogout}
                disabled={loading}
              >
                End Session
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar src={session.user.avatar} sx={{ width: 56, height: 56 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{session.user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.user.role}
                      </Typography>
                      <Chip 
                        label={session.status} 
                        size="small" 
                        color="success" 
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {session.user.permissions.map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Session Details
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Session ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {session.id}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Start Time
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(session.startTime).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime />
                      {getSessionDuration()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Float Amount
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" color="success.main">
                      ₹{session.floatAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Till & Location
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {session.tillId} - {session.location}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="body2" color="primary.contrastText">
              <strong>Session Summary:</strong> {session.transactions} transactions | 
              Total Sales: ₹{session.totalSales.toLocaleString()}
            </Typography>
          </Box>
        </Paper>

        {/* Session Settings Dialog */}
        <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Session Settings</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={sessionSettings.autoLogout}
                    onChange={(e) => setSessionSettings(prev => ({
                      ...prev,
                      autoLogout: e.target.checked
                    }))}
                  />
                }
                label="Auto Logout"
              />
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Session Timeout (minutes)</InputLabel>
                <Select
                  value={sessionSettings.sessionTimeout}
                  onChange={(e) => setSessionSettings(prev => ({
                    ...prev,
                    sessionTimeout: e.target.value
                  }))}
                  label="Session Timeout (minutes)"
                >
                  <MenuItem value={120}>2 hours</MenuItem>
                  <MenuItem value={240}>4 hours</MenuItem>
                  <MenuItem value={480}>8 hours</MenuItem>
                  <MenuItem value={720}>12 hours</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={sessionSettings.requireFloatAmount}
                    onChange={(e) => setSessionSettings(prev => ({
                      ...prev,
                      requireFloatAmount: e.target.checked
                    }))}
                  />
                }
                label="Require Float Amount"
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsDialog(false)}>Close</Button>
            <Button variant="contained" onClick={() => setSettingsDialog(false)}>
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Login View
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 500, mx: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Store sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            POS Login
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your credentials to start a new session
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Username"
            value={loginForm.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={loginForm.showPassword ? 'text' : 'password'}
            value={loginForm.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {loginForm.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
            sx={{ mb: 2 }}
          />

          {sessionSettings.requireFloatAmount && (
            <TextField
              fullWidth
              label="Float Amount"
              type="number"
              value={floatAmount}
              onChange={(e) => setFloatAmount(e.target.value)}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>₹</span>
              }}
              sx={{ mb: 2 }}
            />
          )}
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <Login />}
          onClick={handleLogin}
          disabled={loading || !loginForm.username || !loginForm.password}
          sx={{ mb: 2 }}
        >
          {loading ? 'Starting Session...' : 'Start Session'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Demo Users: cashier1, supervisor1, manager1
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Password: same as username + "123"
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SessionManager;
