import { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Facebook,
  Twitter,
  Instagram,
  Close,
  HelpOutline as HelpIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import { getPublicCompanies } from '../../services/publicApiService';

const Login = () => {
  const [formData, setFormData] = useState({
    company: '',
    username: '',
    password: '',
    theme: 'blue',
  });
  const [companies, setCompanies] = useState([]);
  const [availableThemes, setAvailableThemes] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companyError, setCompanyError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSetupMode, setShowSetupMode] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [logoClickCount, setLogoClickCount] = useState(0);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    loadCompanies();
    loadActiveTheme();
    loadAvailableThemes();
    
    // Keyboard shortcut for setup mode: Ctrl+Shift+S
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setShowSetupMode(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadCompanies = async (retryCount = 0) => {
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000; // 1 second
    
    setLoadingCompanies(true);
    setCompanyError('');
    
    try {
      const companiesData = await getPublicCompanies();
      
      if (companiesData.length === 0) {
        setCompanyError('No active companies found. Please create a company through Django admin (/admin) or ensure companies are marked as "Active" in the database.');
      } else {
        console.log(`✅ Loaded ${companiesData.length} company(ies)`);
        setCompanyError(''); // Clear any previous errors
      }
      
      setCompanies(companiesData);
    } catch (error) {
      console.error('❌ Error loading companies:', error);
      
      // Retry logic for transient failures
      if (retryCount < MAX_RETRIES && (
        error.code === 'ERR_NETWORK' || 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout') ||
        error.message.includes('Network Error')
      )) {
        console.log(`⚠️ Retrying company load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return loadCompanies(retryCount + 1);
      }
      
      // Build user-friendly error message
      let errorMessage = 'Failed to load companies. ';
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage += 'Cannot connect to backend server. ';
        errorMessage += 'Please ensure the backend is running on http://localhost:8000. ';
        errorMessage += 'Check: 1) Backend server is started, 2) Port 8000 is not blocked, 3) No firewall issues.';
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage += 'Request timed out. ';
        errorMessage += 'The backend server may be slow or unresponsive. ';
        errorMessage += 'Please check backend logs for errors.';
      } else if (error.status === 404) {
        errorMessage += 'API endpoint not found. ';
        errorMessage += 'Please ensure the backend is running and the organization app is properly installed.';
      } else if (error.status === 500) {
        errorMessage += 'Server error. ';
        errorMessage += error.message || 'Check backend logs for details.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      setCompanyError(errorMessage);
      
      // If no companies loaded, show error
      if (companies.length === 0) {
        // Error already set above
      }
    } finally {
      setLoadingCompanies(false);
    }
  };

  const loadActiveTheme = () => {
    // Check localStorage for active theme (global variable)
    try {
      const cachedTheme = localStorage.getItem('activeTheme');
      if (cachedTheme) {
        const parsedTheme = JSON.parse(cachedTheme);
        if (parsedTheme?.theme_name) {
          setFormData(prev => ({ ...prev, theme: parsedTheme.theme_name }));
          return;
        }
      }
    } catch (error) {
      console.error('❌ Error reading cached theme:', error);
    }
    // Default to blue if no theme found
    setFormData(prev => ({ ...prev, theme: 'blue' }));
  };

  const loadAvailableThemes = async () => {
    try {
      const response = await fetch('/api/theme/themes/');
      if (response.ok) {
        const themes = await response.json();
        setAvailableThemes(themes.results || themes);
        console.log('✅ Loaded themes from API:', themes.results || themes);
      } else {
        console.warn('⚠️ Failed to load themes from API, using fallback');
        // Fallback themes if API fails
        setAvailableThemes([
          { theme_name: 'red', primary_color: '#D32F2F', name: 'Red Theme' },
          { theme_name: 'green', primary_color: '#388E3C', name: 'Green Theme' },
          { theme_name: 'blue', primary_color: '#1976D2', name: 'Blue Theme' },
          { theme_name: 'black', primary_color: '#212121', name: 'Black Theme' },
        ]);
      }
    } catch (error) {
      console.error('❌ Error loading themes:', error);
      // Fallback themes if API fails
      setAvailableThemes([
        { theme_name: 'red', primary_color: '#D32F2F', name: 'Red Theme' },
        { theme_name: 'green', primary_color: '#388E3C', name: 'Green Theme' },
        { theme_name: 'blue', primary_color: '#1976D2', name: 'Blue Theme' },
        { theme_name: 'black', primary_color: '#212121', name: 'Black Theme' },
      ]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for setup mode bypass
    if (showSetupMode && setupPassword === 'skiploginfornow') {
      // Store selected theme in localStorage (global variable) - no API call
      if (formData.theme) {
        const themeData = {
          theme_name: formData.theme,
          primary_color: formData.theme === 'blue' ? '#1565C0' : '#333333',
          secondary_color: formData.theme === 'blue' ? '#FF5722' : '#666666',
          background_color: formData.theme === 'blue' ? '#f5f5f5' : '#1a1a1a',
          is_active: true
        };
        localStorage.setItem('activeTheme', JSON.stringify(themeData));
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: themeData }));
      }
      
      // Set setup mode in localStorage
      localStorage.setItem('setupMode', 'true');
      localStorage.setItem('setupModeTime', new Date().toISOString());
      
      // Redirect to settings page
      navigate('/settings');
      return;
    }
    
    // Store selected theme in localStorage (global variable) - no API call
    if (formData.theme) {
      // Find the selected theme from available themes
      const selectedTheme = availableThemes.find(theme => theme.theme_name === formData.theme);
      
      // Use theme data from API or fallback to hardcoded values
      const themeData = {
        theme_name: formData.theme,
        name: selectedTheme?.name || formData.theme,
        primary_color: selectedTheme?.primary_color || (formData.theme === 'blue' ? '#1565C0' : '#333333'),
        secondary_color: selectedTheme?.secondary_color || (formData.theme === 'blue' ? '#FF5722' : '#666666'),
        background_color: selectedTheme?.background_color || (formData.theme === 'blue' ? '#f5f5f5' : '#1a1a1a'),
        text_color: selectedTheme?.text_color || (formData.theme === 'black' ? '#ffffff' : '#000000'),
        is_active: true
      };
      localStorage.setItem('activeTheme', JSON.stringify(themeData));
      console.log('✅ Theme stored in global variable (localStorage):', themeData.theme_name);
      
      // Trigger theme change event for immediate UI update
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: themeData }));
    }
    
    const result = await dispatch(login({ 
      username: formData.username, 
      password: formData.password 
    }));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 5) {
      setShowSetupMode(true);
      setLogoClickCount(0);
    }
    // Reset count after 2 seconds
    setTimeout(() => setLogoClickCount(0), 2000);
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        background: '#f5f5f5',
        p: 2,
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      }}
    >
      {/* Main Container - 10"x5" */}
      <Box
        sx={{
          width: 1000, // 10 inches at 100px per inch
          height: 500, // 5 inches at 100px per inch
          display: 'flex',
          borderRadius: 0,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          background: 'white',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <Close />
        </IconButton>

      {/* Left Panel - Image Background */}
      <Box
        onClick={handleLogoClick}
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          background: 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%',
            backgroundPosition: '0 0, 0 0, 0 0',
            backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
          }}
        />
      </Box>

      {/* Right Panel - White Background with Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          background: 'white',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Login Form */}
          <Box>
            <PageTitle 
              title="Sign In" 
              subtitle="Access your NewBorn Retail™ account"
              variant="h4"
            />

          {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

            <form onSubmit={handleSubmit}>
              <FormControl
                fullWidth
                margin="dense"
                required
                disabled={loadingCompanies || companies.length === 0}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#1976D2',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1565C0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976D2',
                    },
                  },
                }}
              >
                <InputLabel>Company {loadingCompanies ? '(Loading...)' : ''}</InputLabel>
                <Select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  label={`Company ${loadingCompanies ? '(Loading...)' : ''}`}
                >
                  {companies.length === 0 && !loadingCompanies && (
                    <MenuItem disabled value="">
                      No companies available
                    </MenuItem>
                  )}
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name} {company.code ? `(${company.code})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {companyError && (
                <Alert 
                  severity={companies.length === 0 ? "warning" : "error"} 
                  sx={{ mb: 2, borderRadius: 2 }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={() => {
                        setCompanyError('');
                        loadCompanies();
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      Retry
                    </Button>
                  }
                >
                  {companyError}
                  {companies.length === 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        To resolve this issue:
                      </Typography>
                      <Typography variant="body2" component="div" sx={{ pl: 1 }}>
                        <strong>API Configuration:</strong><br/>
                        • Frontend calls: <code>{window.location.origin}/api/organization/companies/public/</code><br/>
                        • Vite proxy forwards to: <code>http://localhost:8000/api/organization/companies/public/</code><br/>
                        <br/>
                        <strong>Check these:</strong><br/>
                        1. Backend is running: Open <a href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer">http://localhost:8000/admin</a><br/>
                        2. Check browser console (F12) for detailed API logs<br/>
                        3. Restart frontend dev server if proxy config changed<br/>
                        4. Or use Setup Mode (Ctrl+Shift+S) to bypass login
                      </Typography>
                    </Box>
                  )}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="dense"
                required
                autoComplete="username"
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#1976D2',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1565C0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976D2',
                    },
                  },
                }}
              />
            
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
                margin="dense"
              required
              autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: showSetupMode ? 1 : 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#1976D2',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1565C0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976D2',
                    },
                  },
                }}
              />

              {/* Setup Mode Password Field */}
              {showSetupMode && (
                <>
                  <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                    Setup Mode Active - Enter setup password to bypass login
                  </Alert>
                  <TextField
                    fullWidth
                    label="Setup Password"
                    name="setupPassword"
                    type="password"
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    margin="dense"
                    placeholder="Enter 'skiploginfornow'"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#FF9800',
                        },
                        '&:hover fieldset': {
                          borderColor: '#F57C00',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF9800',
                        },
                      },
                    }}
                  />
                </>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 1,
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#1976D2',
                        '&.Mui-checked': {
                          color: '#1976D2',
                        },
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: '#666',
                      fontSize: '0.9rem',
                    },
                  }}
                />
                
                {/* Theme Selection - Square Boxes */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {availableThemes.map((theme) => (
                    <Box
                      key={theme.theme_name}
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme.theme_name }))}
                      sx={{
                        position: 'relative',
                        width: 24,
                        height: 24,
                        borderRadius: '0px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          '& .theme-box': {
                            border: '2px solid #1976D2',
                            boxShadow: `0 0 8px rgba(25, 118, 210, 0.4)`
                          }
                        }
                      }}
                      title={`Switch to ${theme.name || theme.theme_name}`}
                    >
                      {/* Active indicator - Yellow border */}
                      {formData.theme === theme.theme_name && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '-2px',
                            left: '-2px',
                            right: '-2px',
                            bottom: '-2px',
                            borderRadius: '6px',
                            border: '2px solid #FFD700',
                            boxShadow: '0 0 6px rgba(255, 215, 0, 0.4)',
                            zIndex: 10,
                            animation: 'themePulse 2s ease-in-out infinite',
                            '@keyframes themePulse': {
                              '0%, 100%': {
                                opacity: 1,
                              },
                              '50%': {
                                opacity: 0.7,
                              },
                            },
                          }}
                        />
                      )}
                      {/* Theme color box */}
                      <Box
                        className="theme-box"
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '0px',
                          background: theme.primary_color || '#1976D2',
                          border: formData.theme === theme.theme_name ? '2px solid #1976D2' : '2px solid rgba(0,0,0,0.2)',
                          boxShadow: formData.theme === theme.theme_name ? '0 0 6px rgba(25, 118, 210, 0.3)' : '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                      />
                    </Box>
                  ))}
                </Box>

              <Link
                component="button"
                variant="body2"
                  sx={{
                    color: '#1976D2',
                    fontWeight: 500,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => {
                    console.log('Forgot password clicked');
                  }}
                type="button"
              >
                  Forgot password?
              </Link>
            </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: '#1976D2',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    background: '#1565C0',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Login'}
              </Button>
          </form>

          {/* Setup Mode Help */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <HelpIcon sx={{ fontSize: 16, color: '#666' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                fontSize: '0.75rem',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#1976D2',
                },
              }}
              onClick={() => {
                setShowSetupMode(true);
                setSetupPassword('');
              }}
            >
              Need Database Setup? Click here or press <strong>Ctrl+Shift+S</strong>
            </Typography>
          </Box>
          </Box>
        </Box>
      </Box>
      </Box>
      </Box>
  );
};

export default Login;
