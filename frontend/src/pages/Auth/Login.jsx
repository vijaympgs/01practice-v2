import {
  Brush,
  Business,
  Close,
  Contrast,
  HelpOutline as HelpIcon,
  Palette,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import { getPublicCompanies } from '../../services/publicApiService';
import { clearError, login } from '../../store/slices/authSlice';
import PlatformVersionModal from '../../components/PlatformVersionModal';

const Login = () => {
  const [formData, setFormData] = useState({
    company: '',
    username: '',
    password: '',
    theme: 'blue',
  });
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companyError, setCompanyError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSetupMode, setShowSetupMode] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [branding, setBranding] = useState({
    company_name: 'A B ™ learning',
    logo_url: null,
    tagline: 'Empowering Retail Excellence'
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    loadCompanies();
    loadActiveTheme();

    // Keyboard shortcut for setup mode: Ctrl+Shift+S
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setShowSetupMode(true);
      }
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setShowVersionModal(prev => !prev);
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
      const themeData = {
        theme_name: formData.theme,
        primary_color: formData.theme === 'blue' ? '#1565C0' : '#333333',
        secondary_color: formData.theme === 'blue' ? '#FF5722' : '#666666',
        background_color: formData.theme === 'blue' ? '#f5f5f5' : '#1a1a1a',
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
      }}
    >
      {/* Simple Centered Login Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 450,
          p: 4,
          borderRadius: 2,
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

        {/* Login Form - With Simple Title */}
        <Box>
          {/* Simple Sign In Title */}
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 3,
              fontWeight: 600,
              color: '#1565C0',
            }}
          >
            Sign in
          </Typography>

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
                      <strong>API Configuration:</strong><br />
                      • Frontend calls: <code>{window.location.origin}/api/organization/companies/public/</code><br />
                      • Vite proxy forwards to: <code>http://localhost:8000/api/organization/companies/public/</code><br />
                      <br />
                      <strong>Check these:</strong><br />
                      1. Backend is running: Open <a href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer">http://localhost:8000/admin</a><br />
                      2. Check browser console (F12) for detailed API logs<br />
                      3. Restart frontend dev server if proxy config changed<br />
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

              {/* Theme Selection - Small Square Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {[
                  { theme_name: 'blue', primary_color: '#1565C0' },
                  { theme_name: 'black', primary_color: '#333333' },
                  { theme_name: 'green', primary_color: '#2E7D32' },
                  { theme_name: 'purple', primary_color: '#7B1FA2' }
                ].map((theme) => (
                  <Tooltip title={`${theme.theme_name.charAt(0).toUpperCase() + theme.theme_name.slice(1)} Theme`} arrow>
                    <Box
                      key={theme.theme_name}
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme.theme_name }))}
                      sx={{
                        position: 'relative',
                        width: 20,
                        height: 20,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.2)',
                          '& .theme-circle': {
                            border: '2px solid #1976D2',
                            boxShadow: `0 0 12px rgba(25, 118, 210, 0.5)`
                          }
                        }
                      }}
                    >
                      {/* Active indicator - Yellow outer circle */}
                      {formData.theme === theme.theme_name && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '-4px',
                            left: '-4px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '3px solid #FFD700',
                            boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                            zIndex: 10,
                            animation: 'themePulse 2s ease-in-out infinite',
                            '@keyframes themePulse': {
                              '0%, 100%': {
                                transform: 'scale(1)',
                                opacity: 1,
                              },
                              '50%': {
                                transform: 'scale(1.05)',
                                opacity: 0.8,
                              },
                            },
                          }}
                        />
                      )}
                      {/* Theme color square */}
                      <Box
                        className="theme-circle"
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.primary_color} 0%, ${theme.primary_color}dd 100%)`,
                          border: formData.theme === theme.theme_name ? '2px solid #1976D2' : '2px solid rgba(0,0,0,0.1)',
                          boxShadow: formData.theme === theme.theme_name ? '0 0 12px rgba(25, 118, 210, 0.4)' : 'none',
                        }}
                      />
                    </Box>
                  </Tooltip>
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
        </Box>
      </Box>

      {/* Version Modal */}
      <PlatformVersionModal
        open={showVersionModal}
        onClose={() => setShowVersionModal(false)}
      />

      {/* Hint Text */}
      <Box sx={{ position: 'absolute', bottom: 16 }}>
        <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.75rem' }}>
          Press <Box component="span" sx={{ px: 0.5, py: 0.25, border: '1px solid #ddd', borderRadius: 1, bgcolor: '#fff' }}>Ctrl</Box> + <Box component="span" sx={{ px: 0.5, py: 0.25, border: '1px solid #ddd', borderRadius: 1, bgcolor: '#fff' }}>L</Box> for platform info
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
