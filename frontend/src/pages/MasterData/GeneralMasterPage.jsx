import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as PublicIcon,
  LocationCity as LocationCityIcon,
  LocationOn as LocationOnIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Flag as FlagIcon,
  Terrain as TerrainIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import themeService from '../../services/themeService';

const GeneralMasterPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Theme color state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    
    // Load theme color from themeService
    const loadTheme = async () => {
      try {
        const theme = await themeService.getActiveTheme();
        if (theme && theme.primary_color) {
          setThemeColor(theme.primary_color);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please log in to access the General Master data management.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <PageTitle 
          title="General Masters" 
          subtitle="Geographical data management - Forms hidden, data populated from seed files"
        />
      </Box>

      {/* Main Content Card */}
      <Card sx={{ 
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Information Message */}
          <Box sx={{ 
            backgroundColor: 'info.light', 
            color: 'info.contrastText',
            p: 3,
            borderRadius: 1,
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom>
              Geographical Data Management
            </Typography>
            <Typography variant="body1">
              The geographical data is part of seed data files containing comprehensive information for multiple regions.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" component="div">
                <ul>
                  <li>Middle East (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman)</li>
                  <li>South Africa (Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape)</li>
                  <li>India (Maharashtra, Karnataka, Tamil Nadu, Delhi, Gujarat, West Bengal, Uttar Pradesh, Rajasthan, Andhra Pradesh, Telangana)</li>
                  <li>Botswana (All 9 districts with major cities)</li>
                  <li>United States (California, Texas, New York, Florida, Illinois)</li>
                  <li>United Kingdom (England, Scotland, Wales, Northern Ireland)</li>
                </ul>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Total Data:</strong> 6 countries, 50+ states, 250+ cities with complete information including codes, postal codes, and coordinates.
            </Typography>
          </Box>

          {/* Data Summary */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: themeColor, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4">6</Typography>
                      <Typography variant="body2">Countries</Typography>
                    </Box>
                    <PublicIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: themeColor, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4">50+</Typography>
                      <Typography variant="body2">States/Provinces</Typography>
                    </Box>
                    <TerrainIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: themeColor, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4">250+</Typography>
                      <Typography variant="body2">Cities</Typography>
                    </Box>
                    <LocationCityIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ borderRadius: 0 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GeneralMasterPage;
