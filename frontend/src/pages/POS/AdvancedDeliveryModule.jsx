import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  ListItemAvatar,
  Slider,
  Rating,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  LocalShipping as DeliveryIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Assessment as ReportIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  DirectionsCar as CarIcon,
  Route as RouteIcon,
  GpsFixed as GpsIcon,
  MyLocation as MyLocationIcon,
  Navigation as NavigationIcon,
  Speed as SpeedIcon,
  BatteryFull as BatteryIcon,
  SignalCellularAlt as SignalIcon,
  Update as UpdateIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  RestartAlt as RestartIcon,
  Assignment as AssignmentIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Flag as FlagIcon,
  PriorityHigh as PriorityHighIcon,
  Check as CheckIcon2,
  Cancel as CancelIcon,
  Send as SendIcon,
  AutoAwesome as AutoAwesomeIcon,
  CalendarToday as CalendarIcon,
  AccessAlarm as AlarmIcon,
  Timer as TimerIcon,
  ScheduleSend as ScheduleSendIcon,
  Map as MapIcon,
  Directions as DirectionsIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { currencyService } from '../../services/currencyService';

const AdvancedDeliveryModule = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  
  // Delivery state
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryDialog, setDeliveryDialog] = useState({ open: false, delivery: null, type: 'add' });
  
  // Delivery form state
  const [deliveryData, setDeliveryData] = useState({
    id: '',
    deliveryId: '',
    orderId: '',
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
      landmark: '',
      instructions: '',
    },
    deliveryDate: '',
    deliveryTime: '',
    deliveryWindow: {
      start: '',
      end: '',
    },
    status: 'pending', // pending, assigned, picked_up, in_transit, delivered, failed, cancelled
    priority: 'medium', // low, medium, high, urgent
    driverId: '',
    driverName: '',
    driverPhone: '',
    vehicleId: '',
    vehicleType: 'bike', // bike, car, van, truck
    vehicleNumber: '',
    route: {
      optimized: false,
      distance: 0,
      estimatedTime: 0,
      actualTime: 0,
      waypoints: [],
    },
    tracking: {
      enabled: true,
      lastUpdate: '',
      currentLocation: {
        latitude: 0,
        longitude: 0,
      },
      speed: 0,
      batteryLevel: 100,
      signalStrength: 100,
    },
    items: [],
    payment: {
      method: 'cash', // cash, card, online, cod
      amount: 0,
      collected: false,
      collectedAt: '',
    },
    deliveryProof: {
      signature: '',
      photo: '',
      notes: '',
      deliveredAt: '',
    },
    notifications: {
      customerNotified: false,
      driverNotified: false,
      managerNotified: false,
      lastNotification: '',
    },
    metadata: {
      location: '',
      department: '',
      costCenter: '',
      notes: '',
      tags: [],
    },
  });
  
  // Driver state
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    driver: '',
    dateFrom: '',
    dateTo: '',
    priority: 'all',
    vehicleType: 'all',
  });
  
  // Data states
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [summary, setSummary] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    inTransitDeliveries: 0,
    completedToday: 0,
    averageDeliveryTime: 0,
    onTimeDeliveryRate: 0,
  });

  useEffect(() => {
    initializeAdvancedDelivery();
  }, []);

  const initializeAdvancedDelivery = async () => {
    try {
      setLoading(true);
      
      // Load currencies
      const currencyList = await currencyService.getActiveCurrencies();
      setCurrencies(currencyList);
      
      // Load mock data
      await loadDeliveries();
      await loadDrivers();
      await loadVehicles();
      await calculateSummary();
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initialize advanced delivery: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveries = async () => {
    try {
      // Mock data - replace with actual API call
      const mockDeliveries = [
        {
          id: '1',
          deliveryId: 'DEL-001',
          orderId: 'ORD-001',
          customerId: 'C001',
          customerName: 'John Doe',
          customerPhone: '+91-9876543210',
          customerEmail: 'john.doe@email.com',
          deliveryAddress: {
            street: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India',
            coordinates: {
              latitude: 19.0760,
              longitude: 72.8777,
            },
            landmark: 'Near Central Mall',
            instructions: 'Call before delivery',
          },
          deliveryDate: '2025-01-27',
          deliveryTime: '14:00',
          deliveryWindow: {
            start: '13:00',
            end: '15:00',
          },
          status: 'in_transit',
          priority: 'medium',
          driverId: 'D001',
          driverName: 'Rajesh Kumar',
          driverPhone: '+91-9876543211',
          vehicleId: 'V001',
          vehicleType: 'bike',
          vehicleNumber: 'MH-01-AB-1234',
          route: {
            optimized: true,
            distance: 5.2,
            estimatedTime: 25,
            actualTime: 0,
            waypoints: [
              { latitude: 19.0760, longitude: 72.8777, name: 'Store' },
              { latitude: 19.0860, longitude: 72.8877, name: 'Customer Location' },
            ],
          },
          tracking: {
            enabled: true,
            lastUpdate: '2025-01-27T13:45:00Z',
            currentLocation: {
              latitude: 19.0810,
              longitude: 72.8827,
            },
            speed: 25,
            batteryLevel: 85,
            signalStrength: 90,
          },
          items: [
            { id: '1', name: 'Product A', quantity: 2, weight: 1.5 },
            { id: '2', name: 'Product B', quantity: 1, weight: 0.8 },
          ],
          payment: {
            method: 'cod',
            amount: 1500.00,
            collected: false,
            collectedAt: '',
          },
          deliveryProof: {
            signature: '',
            photo: '',
            notes: '',
            deliveredAt: '',
          },
          notifications: {
            customerNotified: true,
            driverNotified: true,
            managerNotified: false,
            lastNotification: '2025-01-27T13:30:00Z',
          },
          metadata: {
            location: 'Main Store',
            department: 'Delivery',
            costCenter: 'CC001',
            notes: 'Regular delivery',
            tags: ['Standard', 'COD'],
          },
        },
        {
          id: '2',
          deliveryId: 'DEL-002',
          orderId: 'ORD-002',
          customerId: 'C002',
          customerName: 'Alice Smith',
          customerPhone: '+91-9876543212',
          customerEmail: 'alice.smith@email.com',
          deliveryAddress: {
            street: '456 Park Avenue',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India',
            coordinates: {
              latitude: 28.6139,
              longitude: 77.2090,
            },
            landmark: 'Near Metro Station',
            instructions: 'Leave at reception if not available',
          },
          deliveryDate: '2025-01-27',
          deliveryTime: '16:00',
          deliveryWindow: {
            start: '15:00',
            end: '17:00',
          },
          status: 'assigned',
          priority: 'high',
          driverId: 'D002',
          driverName: 'Suresh Patel',
          driverPhone: '+91-9876543213',
          vehicleId: 'V002',
          vehicleType: 'car',
          vehicleNumber: 'DL-01-CD-5678',
          route: {
            optimized: false,
            distance: 8.5,
            estimatedTime: 35,
            actualTime: 0,
            waypoints: [
              { latitude: 28.6139, longitude: 77.2090, name: 'Store' },
              { latitude: 28.6239, longitude: 77.2190, name: 'Customer Location' },
            ],
          },
          tracking: {
            enabled: true,
            lastUpdate: '2025-01-27T14:00:00Z',
            currentLocation: {
              latitude: 28.6139,
              longitude: 77.2090,
            },
            speed: 0,
            batteryLevel: 100,
            signalStrength: 95,
          },
          items: [
            { id: '3', name: 'Product C', quantity: 1, weight: 2.0 },
          ],
          payment: {
            method: 'online',
            amount: 2500.00,
            collected: true,
            collectedAt: '2025-01-27T12:00:00Z',
          },
          deliveryProof: {
            signature: '',
            photo: '',
            notes: '',
            deliveredAt: '',
          },
          notifications: {
            customerNotified: true,
            driverNotified: true,
            managerNotified: false,
            lastNotification: '2025-01-27T14:00:00Z',
          },
          metadata: {
            location: 'Branch Store',
            department: 'Delivery',
            costCenter: 'CC002',
            notes: 'High priority delivery',
            tags: ['High Priority', 'Online Payment'],
          },
        },
        {
          id: '3',
          deliveryId: 'DEL-003',
          orderId: 'ORD-003',
          customerId: 'C003',
          customerName: 'Bob Johnson',
          customerPhone: '+91-9876543214',
          customerEmail: 'bob.johnson@email.com',
          deliveryAddress: {
            street: '789 Garden Road',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001',
            country: 'India',
            coordinates: {
              latitude: 12.9716,
              longitude: 77.5946,
            },
            landmark: 'Near IT Park',
            instructions: 'Office delivery - call reception',
          },
          deliveryDate: '2025-01-26',
          deliveryTime: '11:00',
          deliveryWindow: {
            start: '10:00',
            end: '12:00',
          },
          status: 'delivered',
          priority: 'low',
          driverId: 'D003',
          driverName: 'Vikram Singh',
          driverPhone: '+91-9876543215',
          vehicleId: 'V003',
          vehicleType: 'van',
          vehicleNumber: 'KA-01-EF-9012',
          route: {
            optimized: true,
            distance: 12.3,
            estimatedTime: 45,
            actualTime: 42,
            waypoints: [
              { latitude: 12.9716, longitude: 77.5946, name: 'Store' },
              { latitude: 12.9816, longitude: 77.6046, name: 'Customer Location' },
            ],
          },
          tracking: {
            enabled: true,
            lastUpdate: '2025-01-26T11:42:00Z',
            currentLocation: {
              latitude: 12.9816,
              longitude: 77.6046,
            },
            speed: 0,
            batteryLevel: 75,
            signalStrength: 85,
          },
          items: [
            { id: '4', name: 'Product D', quantity: 3, weight: 4.5 },
            { id: '5', name: 'Product E', quantity: 2, weight: 2.0 },
          ],
          payment: {
            method: 'card',
            amount: 3500.00,
            collected: true,
            collectedAt: '2025-01-26T11:42:00Z',
          },
          deliveryProof: {
            signature: 'Bob Johnson',
            photo: 'delivery_photo_001.jpg',
            notes: 'Delivered to reception',
            deliveredAt: '2025-01-26T11:42:00Z',
          },
          notifications: {
            customerNotified: true,
            driverNotified: true,
            managerNotified: true,
            lastNotification: '2025-01-26T11:45:00Z',
          },
          metadata: {
            location: 'Main Store',
            department: 'Delivery',
            costCenter: 'CC001',
            notes: 'Office delivery completed',
            tags: ['Office', 'Card Payment'],
          },
        },
      ];
      
      setDeliveries(mockDeliveries);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    }
  };

  const loadDrivers = async () => {
    try {
      const mockDrivers = [
        { id: 'D001', name: 'Rajesh Kumar', phone: '+91-9876543211', status: 'active', rating: 4.5 },
        { id: 'D002', name: 'Suresh Patel', phone: '+91-9876543213', status: 'active', rating: 4.2 },
        { id: 'D003', name: 'Vikram Singh', phone: '+91-9876543215', status: 'active', rating: 4.8 },
      ];
      setDrivers(mockDrivers);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    }
  };

  const loadVehicles = async () => {
    try {
      const mockVehicles = [
        { id: 'V001', type: 'bike', number: 'MH-01-AB-1234', status: 'active', capacity: 50 },
        { id: 'V002', type: 'car', number: 'DL-01-CD-5678', status: 'active', capacity: 200 },
        { id: 'V003', type: 'van', number: 'KA-01-EF-9012', status: 'active', capacity: 500 },
      ];
      setVehicles(mockVehicles);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    }
  };

  const calculateSummary = () => {
    const totalDeliveries = deliveries.length;
    const pendingDeliveries = deliveries.filter(d => d.status === 'pending' || d.status === 'assigned').length;
    const inTransitDeliveries = deliveries.filter(d => d.status === 'in_transit').length;
    const completedToday = deliveries.filter(d => 
      d.deliveryDate === new Date().toISOString().split('T')[0] && d.status === 'delivered'
    ).length;
    const averageDeliveryTime = deliveries.length > 0 
      ? deliveries.reduce((sum, d) => sum + (d.route.actualTime || d.route.estimatedTime), 0) / deliveries.length 
      : 0;
    const onTimeDeliveryRate = deliveries.length > 0 
      ? (deliveries.filter(d => d.status === 'delivered' && d.route.actualTime <= d.route.estimatedTime).length / deliveries.length) * 100 
      : 0;
    
    setSummary({
      totalDeliveries,
      pendingDeliveries,
      inTransitDeliveries,
      completedToday,
      averageDeliveryTime,
      onTimeDeliveryRate,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDeliverySelect = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleAssignDriver = async (deliveryId, driverId) => {
    try {
      const delivery = deliveries.find(d => d.id === deliveryId);
      const driver = drivers.find(d => d.id === driverId);
      if (!delivery || !driver) return;
      
      const updatedDelivery = {
        ...delivery,
        status: 'assigned',
        driverId: driver.id,
        driverName: driver.name,
        driverPhone: driver.phone,
        tracking: {
          ...delivery.tracking,
          lastUpdate: new Date().toISOString(),
        },
      };
      
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? updatedDelivery : d));
      setSnackbar({ open: true, message: 'Driver assigned successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to assign driver: ' + error.message, severity: 'error' });
    }
  };

  const handleStartDelivery = async (deliveryId) => {
    try {
      const delivery = deliveries.find(d => d.id === deliveryId);
      if (!delivery) return;
      
      const updatedDelivery = {
        ...delivery,
        status: 'in_transit',
        tracking: {
          ...delivery.tracking,
          lastUpdate: new Date().toISOString(),
        },
      };
      
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? updatedDelivery : d));
      setSnackbar({ open: true, message: 'Delivery started successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to start delivery: ' + error.message, severity: 'error' });
    }
  };

  const handleCompleteDelivery = async (deliveryId) => {
    try {
      const delivery = deliveries.find(d => d.id === deliveryId);
      if (!delivery) return;
      
      const updatedDelivery = {
        ...delivery,
        status: 'delivered',
        deliveryProof: {
          ...delivery.deliveryProof,
          deliveredAt: new Date().toISOString(),
        },
        tracking: {
          ...delivery.tracking,
          lastUpdate: new Date().toISOString(),
        },
      };
      
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? updatedDelivery : d));
      setSnackbar({ open: true, message: 'Delivery completed successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to complete delivery: ' + error.message, severity: 'error' });
    }
  };

  const handleOptimizeRoute = async (deliveryId) => {
    try {
      const delivery = deliveries.find(d => d.id === deliveryId);
      if (!delivery) return;
      
      // Simulate route optimization
      const optimizedRoute = {
        ...delivery.route,
        optimized: true,
        distance: delivery.route.distance * 0.9, // 10% reduction
        estimatedTime: Math.round(delivery.route.estimatedTime * 0.85), // 15% reduction
      };
      
      const updatedDelivery = {
        ...delivery,
        route: optimizedRoute,
      };
      
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? updatedDelivery : d));
      setSnackbar({ open: true, message: 'Route optimized successfully!', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to optimize route: ' + error.message, severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'info',
      assigned: 'warning',
      picked_up: 'secondary',
      in_transit: 'primary',
      delivered: 'success',
      failed: 'error',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <ScheduleIcon />,
      assigned: <AssignmentIcon />,
      picked_up: <CheckBoxIcon />,
      in_transit: <CarIcon />,
      delivered: <CheckIcon />,
      failed: <ErrorIcon />,
      cancelled: <CancelIcon />,
    };
    return icons[status] || <ScheduleIcon />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      urgent: 'error',
    };
    return colors[priority] || 'default';
  };

  const getVehicleIcon = (vehicleType) => {
    const icons = {
      bike: <SpeedIcon />,
      car: <CarIcon />,
      van: <CarIcon />,
      truck: <CarIcon />,
    };
    return icons[vehicleType] || <CarIcon />;
  };

  const formatCurrency = (amount) => {
    return currencyService.formatCurrency(amount, selectedCurrency);
  };

  const getCurrencySymbol = () => {
    return currencyService.getCurrencySymbol(selectedCurrency);
  };

  const getFilteredDeliveries = () => {
    let filtered = deliveries;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(d => d.status === filters.status);
    }
    
    if (filters.driver) {
      filtered = filtered.filter(d => 
        d.driverName.toLowerCase().includes(filters.driver.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(d => d.deliveryDate >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(d => d.deliveryDate <= filters.dateTo);
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(d => d.priority === filters.priority);
    }
    
    if (filters.vehicleType !== 'all') {
      filtered = filtered.filter(d => d.vehicleType === filters.vehicleType);
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 3
    }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          px: 3,
          mb: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <DeliveryIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  mb: 0.5
                }}
              >
                Advanced Delivery
              </Typography>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Route optimization, GPS tracking, and delivery management
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Summary Dashboard */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Total Deliveries
                </Typography>
                <Typography variant="h4" color="primary">
                  {summary.totalDeliveries}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  Pending Deliveries
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {summary.pendingDeliveries}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Awaiting assignment
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main" gutterBottom>
                  In Transit
                </Typography>
                <Typography variant="h4" color="info.main">
                  {summary.inTransitDeliveries}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Currently delivering
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  On-Time Rate
                </Typography>
                <Typography variant="h4" color="success.main">
                  {Math.round(summary.onTimeDeliveryRate)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Delivery success
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: theme.palette.grey[600],
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light + '15',
                },
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
              },
            }}
          >
            <Tab icon={<DeliveryIcon />} iconPosition="start" label="Deliveries" />
            <Tab icon={<RouteIcon />} iconPosition="start" label="Route Optimization" />
            <Tab icon={<GpsIcon />} iconPosition="start" label="GPS Tracking" />
            <Tab icon={<PersonIcon />} iconPosition="start" label="Drivers" />
            <Tab icon={<ReportIcon />} iconPosition="start" label="Reports" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Filters */}
              <Box sx={{ p: 3, borderBottom: '1px solid #dee2e6' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search Driver"
                      value={filters.driver}
                      onChange={(e) => setFilters(prev => ({ ...prev, driver: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        label="Status"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="assigned">Assigned</MenuItem>
                        <MenuItem value="picked_up">Picked Up</MenuItem>
                        <MenuItem value="in_transit">In Transit</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        label="Priority"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="urgent">Urgent</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Vehicle Type</InputLabel>
                      <Select
                        value={filters.vehicleType}
                        onChange={(e) => setFilters(prev => ({ ...prev, vehicleType: e.target.value }))}
                        label="Vehicle Type"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="bike">Bike</MenuItem>
                        <MenuItem value="car">Car</MenuItem>
                        <MenuItem value="van">Van</MenuItem>
                        <MenuItem value="truck">Truck</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="outlined"
                      onClick={() => setFilters({
                        status: 'all',
                        driver: '',
                        dateFrom: '',
                        dateTo: '',
                        priority: 'all',
                        vehicleType: 'all',
                      })}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Deliveries Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Delivery</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Driver</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Vehicle</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredDeliveries().map((delivery) => (
                      <TableRow 
                        key={delivery.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {delivery.deliveryId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {delivery.orderId} • {delivery.deliveryDate}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {delivery.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {delivery.customerPhone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {delivery.driverName || 'Unassigned'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {delivery.driverPhone || ''}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getVehicleIcon(delivery.vehicleType)}
                            <Box>
                              <Typography variant="body2">
                                {delivery.vehicleType.toUpperCase()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {delivery.vehicleNumber}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(delivery.status)}
                            label={delivery.status.replace('_', ' ')} 
                            color={getStatusColor(delivery.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={delivery.priority}
                            color={getPriorityColor(delivery.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeliverySelect(delivery)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {delivery.status === 'pending' && (
                              <Tooltip title="Assign Driver">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleAssignDriver(delivery.id, 'D001')}
                                  color="primary"
                                >
                                  <AssignmentIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {delivery.status === 'assigned' && (
                              <Tooltip title="Start Delivery">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleStartDelivery(delivery.id)}
                                  color="success"
                                >
                                  <StartIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {delivery.status === 'in_transit' && (
                              <Tooltip title="Complete Delivery">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleCompleteDelivery(delivery.id)}
                                  color="success"
                                >
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Optimize Route">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOptimizeRoute(delivery.id)}
                                color="secondary"
                              >
                                <RouteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Track Delivery">
                              <IconButton size="small" color="info">
                                <GpsIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Route Optimization
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered route optimization and delivery planning
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                GPS Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time tracking and location monitoring
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Driver Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Driver performance, ratings, and management
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive delivery analytics and reporting
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdvancedDeliveryModule;
