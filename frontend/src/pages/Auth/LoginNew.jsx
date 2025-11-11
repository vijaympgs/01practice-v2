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
  Card,
  CardContent,
  Fade,
  Zoom,
  Avatar,
  Divider,
  Paper,
  Container,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Business,
  Person,
  Lock,
  Login,
  Store,
  TrendingUp,
  Security,
  Speed,
  CheckCircle,
  ShoppingCart,
  Inventory,
  Analytics,
  Support,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import api from '../../services/api';

const LoginNew = () => {
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
      const response = await api.get('/organizations/companies/');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    if (error) {
      dispatch(clearError());
    }
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

  const features = [
    { icon: <ShoppingCart />, title: 'Point of Sale', desc: 'Complete POS system' },
    { icon: <Inventory />, title: 'Inventory Management', desc: 'Real-time stock tracking' },
    { icon: <Analytics />, title: 'Analytics Dashboard', desc: 'Business insights' },
    { icon: <Support />, title: '24/7 Support', desc: 'Always here to help' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
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
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding & Features */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 4 }}>
                {/* Logo and Branding */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      mr: 2,
                      boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                    }}
                  >
                    <Store sx={{ fontSize: 30, color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 0.5,
                      }}
                    >
                      NewBorn Retail™
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}
                    >
                      AI-Powered POS System
                    </Typography>
                  </Box>
                </Box>

                {/* Main Heading */}
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                >
                  Sign in to your retail management dashboard
                </Typography>

                {/* Features Grid */}
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Zoom in timeout={1200 + index * 200} key={index}>
                      <Grid item xs={6}>
                        <Card
                          sx={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 2,
                            p: 2,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.15)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                              mx: 'auto',
                              mb: 1,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {feature.icon}
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {feature.desc}
                          </Typography>
                        </Card>
                      </Grid>
                    </Zoom>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1500}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Form Header */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
                      Sign In
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      Enter your credentials to access your account
                    </Typography>
                  </Box>

                  {/* Error Alert */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Login Form */}
                  <Box component="form" onSubmit={handleSubmit}>
                    {/* Company Selection */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Company</InputLabel>
                      <Select
                        value={formData.company}
                        label="Company"
                        onChange={handleInputChange('company')}
                        startAdornment={
                          <InputAdornment position="start">
                            <Business sx={{ color: '#666' }} />
                          </InputAdornment>
                        }
                      >
                        {companies.map((company) => (
                          <MenuItem key={company.id} value={company.id}>
                            {company.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Username Field */}
                    <TextField
                      fullWidth
                      label="Username"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#666' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Password Field */}
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#666' }} />
                          </InputAdornment>
                        ),
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
                    />

                    {/* Remember Me & Forgot Password */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Remember me"
                      />
                      <Link href="#" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                        Forgot password?
                      </Link>
                    </Box>

                    {/* Login Button */}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        mb: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                        },
                      }}
                      startIcon={<Login />}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    {/* Divider */}
                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" sx={{ color: '#999' }}>
                        or
                      </Typography>
                    </Divider>

                    {/* Demo Access */}
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        borderColor: '#ddd',
                        color: '#666',
                        '&:hover': {
                          borderColor: '#999',
                          backgroundColor: 'rgba(0,0,0,0.04)',
                        },
                      }}
                      onClick={() => {
                        setFormData({
                          company: companies[0]?.id || '',
                          username: 'demo',
                          password: 'demo123',
                        });
                      }}
                    >
                      Try Demo Account
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginNew;
