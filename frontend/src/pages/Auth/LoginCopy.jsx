import { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import api from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    company: '',
    username: '',
    password: '',
  });
  const [companies, setCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await api.get('/organization/companies/public/');
      const companiesData = response.data;
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
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
    const result = await dispatch(login({ 
      username: formData.username, 
      password: formData.password 
    }));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
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

      {/* Left Panel - Blue Background with Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Retail Technology Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(135deg, rgba(25,118,210,0.9) 0%, rgba(21,101,192,0.9) 100%),
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)
            `,
            backgroundSize: '60px 60px, 60px 60px, 100% 100%, 100% 100%, 100% 100%',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0',
            backgroundRepeat: 'repeat, repeat, no-repeat, no-repeat, no-repeat',
          }}
        />

        {/* Retail Tech Icons Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M20 20h20v20H20zM60 20h20v20H60zM20 60h20v20H20zM60 60h20v20H60z'/%3E%3Cpath d='M30 30h10v10H30zM70 30h10v10H70zM30 70h10v10H30zM70 70h10v10H70z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
              url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M0 0h20v20H0zM30 0h20v20H30zM60 0h20v20H60zM0 30h20v20H0zM30 30h20v20H30zM60 30h20v20H60zM0 60h20v20H0zM30 60h20v20H30zM60 60h20v20H60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            backgroundSize: '100px 100px, 80px 80px',
            backgroundPosition: '0 0, 50px 50px',
            backgroundRepeat: 'repeat',
            opacity: 0.7,
          }}
        />

        {/* Shopping Cart Icon */}
        <Box
          sx={{
            position: 'absolute',
            top: 60,
            left: 60,
            width: 50,
            height: 50,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 6s ease-in-out infinite',
            '&::before': {
              content: '"🛒"',
              fontSize: '24px',
              opacity: 0.8,
            }
          }}
        />
        
        {/* POS Terminal */}
        <Box
          sx={{
            position: 'absolute',
            top: 120,
            right: 80,
            width: 60,
            height: 40,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 8s ease-in-out infinite reverse',
            '&::before': {
              content: '"💳"',
              fontSize: '20px',
              opacity: 0.7,
            }
          }}
        />
        
        {/* Cash Register */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 100,
            left: 70,
            width: 45,
            height: 35,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 7s ease-in-out infinite',
            '&::before': {
              content: '"💰"',
              fontSize: '18px',
              opacity: 0.8,
            }
          }}
        />
        
        {/* Shopping Bags */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 140,
            right: 70,
            width: 35,
            height: 45,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 9s ease-in-out infinite reverse',
            '&::before': {
              content: '"🛍️"',
              fontSize: '20px',
              opacity: 0.7,
            }
          }}
        />
        
        {/* Barcode Scanner */}
        <Box
          sx={{
            position: 'absolute',
            top: 200,
            left: 30,
            width: 40,
            height: 30,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 6.5s ease-in-out infinite',
            '&::before': {
              content: '"📱"',
              fontSize: '16px',
              opacity: 0.8,
            }
          }}
        />
        
        {/* Store Counter */}
        <Box
          sx={{
            position: 'absolute',
            top: 250,
            right: 40,
            width: 55,
            height: 25,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 8.5s ease-in-out infinite reverse',
            '&::before': {
              content: '"🏪"',
              fontSize: '18px',
              opacity: 0.7,
            }
          }}
        />
        
        {/* Receipt Printer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 200,
            left: 40,
            width: 30,
            height: 40,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 7.5s ease-in-out infinite',
            '&::before': {
              content: '"🧾"',
              fontSize: '16px',
              opacity: 0.8,
            }
          }}
        />
        
        {/* Price Tag */}
        <Box
          sx={{
            position: 'absolute',
            top: 180,
            right: 20,
            width: 25,
            height: 35,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 5.5s ease-in-out infinite reverse',
            '&::before': {
              content: '"🏷️"',
              fontSize: '14px',
              opacity: 0.7,
            }
          }}
        />

        {/* Circuit Pattern Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0zM40 40h40v40H40zM80 0h40v40H80zM0 80h40v40H0zM80 80h40v40H80z'/%3E%3Cpath d='M20 20h20v20H20zM60 60h20v20H60zM100 20h20v20H100zM20 100h20v20H20zM100 100h20v20H100z'/%3E%3Cpath d='M30 30h10v10H30zM70 70h10v10H70zM110 30h10v10H110zM30 110h10v10H30zM110 110h10v10H110z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            backgroundSize: '120px 120px',
            backgroundPosition: '0 0',
            backgroundRepeat: 'repeat',
            opacity: 0.6,
          }}
        />

        {/* Logo */}
        <Box sx={{ position: 'relative', zIndex: 2, alignSelf: 'flex-start', mb: 4 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                width: 12,
                height: 12,
                background: '#1976D2',
                borderRadius: '50%',
              },
            }}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 400 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Hello, welcome!
            </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: '1.1rem',
            }}
          >
            Transform your retail operations with intelligent automation, real-time insights, and seamless customer experiences that drive growth
            </Typography>
          </Box>
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
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1976D2',
                mb: 3,
                textAlign: 'left',
              }}
            >
              Sign In
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
                <InputLabel>Company</InputLabel>
                <Select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  label="Company"
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
                  mb: 2,
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
      </Box>
      </Box>
      </Box>
  );
};

export default Login;
