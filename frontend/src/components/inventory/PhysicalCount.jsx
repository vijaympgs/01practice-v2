import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Badge,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PhysicalCount = ({ onRefresh }) => {
  const [counts, setCounts] = useState([]);
  const [activeCount, setActiveCount] = useState(null);
  const [countDialogOpen, setCountDialogOpen] = useState(false);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [scanningMode, setScanningMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockCounts = [
      {
        id: '1',
        countNumber: 'PC-2025-001',
        warehouse: 'Main Warehouse',
        zone: 'Zone A',
        status: 'completed',
        startDate: '2025-01-08T09:00:00Z',
        endDate: '2025-01-08T17:00:00Z',
        plannedItems: 150,
        countedItems: 150,
        varianceItems: 3,
        accuracy: 98.0,
        varianceValue: 1250.75,
        countedBy: 'John Smith',
        approvedBy: 'Sarah Johnson',
        items: [
          {
            id: '1',
            product: {
              name: 'Samsung Galaxy S24',
              sku: 'SAM-GAL-S24-128',
              category: 'Smartphones'
            },
            binLocation: 'A-01-01',
            systemQuantity: 25,
            countedQuantity: 25,
            variance: 0,
            varianceValue: 0,
            status: 'matched'
          },
          {
            id: '2',
            product: {
              name: 'Apple MacBook Pro 16"',
              sku: 'APP-MBP-16-512',
              category: 'Laptops'
            },
            binLocation: 'A-01-01',
            systemQuantity: 15,
            countedQuantity: 13,
            variance: -2,
            varianceValue: -4799.98,
            status: 'variance'
          },
          {
            id: '3',
            product: {
              name: 'Dell OptiPlex 7090',
              sku: 'DEL-OPT-7090-256',
              category: 'Desktops'
            },
            binLocation: 'A-01-02',
            systemQuantity: 20,
            countedQuantity: 22,
            variance: 2,
            varianceValue: 1399.98,
            status: 'variance'
          }
        ]
      },
      {
        id: '2',
        countNumber: 'PC-2025-002',
        warehouse: 'Main Warehouse',
        zone: 'Zone B',
        status: 'in_progress',
        startDate: '2025-01-10T08:00:00Z',
        endDate: null,
        plannedItems: 200,
        countedItems: 120,
        varianceItems: 0,
        accuracy: 100.0,
        varianceValue: 0,
        countedBy: 'Mike Wilson',
        approvedBy: null,
        items: [
          {
            id: '4',
            product: {
              name: 'iPad Pro 12.9"',
              sku: 'APP-IPAD-PRO-256',
              category: 'Tablets'
            },
            binLocation: 'B-02-01',
            systemQuantity: 30,
            countedQuantity: 30,
            variance: 0,
            varianceValue: 0,
            status: 'matched'
          }
        ]
      },
      {
        id: '3',
        countNumber: 'PC-2025-003',
        warehouse: 'Cold Storage Facility',
        zone: 'Zone A',
        status: 'planned',
        startDate: null,
        endDate: null,
        plannedItems: 75,
        countedItems: 0,
        varianceItems: 0,
        accuracy: 0,
        varianceValue: 0,
        countedBy: null,
        approvedBy: null,
        items: []
      }
    ];

    setCounts(mockCounts);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'planned': return 'info';
      case 'cancelled': return 'error';
      case 'matched': return 'success';
      case 'variance': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'in_progress': return <PlayIcon />;
      case 'planned': return <AssessmentIcon />;
      case 'cancelled': return <StopIcon />;
      case 'matched': return <CheckCircleIcon />;
      case 'variance': return <WarningIcon />;
      case 'error': return <ErrorIcon />;
      default: return <InventoryIcon />;
    }
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'success';
    if (variance < 0) return 'error';
    return 'default';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return <TrendingUpIcon />;
    if (variance < 0) return <TrendingDownIcon />;
    return null;
  };

  const handleStartCount = (count) => {
    setActiveCount(count);
    setActiveStep(0);
    setCountDialogOpen(true);
  };

  const handleCreateCount = () => {
    setActiveCount(null);
    setActiveStep(0);
    setCountDialogOpen(true);
  };

  const handleScanBarcode = () => {
    setScanningMode(true);
    setScanDialogOpen(true);
  };

  const steps = ['Planning', 'Counting', 'Validation', 'Adjustment', 'Approval'];

  const renderStepContent = (step) => {
    if (!activeCount) return null;

    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Count Planning - {activeCount.countNumber}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Count Number"
                  defaultValue={activeCount.countNumber}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Warehouse</InputLabel>
                  <Select defaultValue={activeCount.warehouse}>
                    <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                    <MenuItem value="Cold Storage Facility">Cold Storage Facility</MenuItem>
                    <MenuItem value="Distribution Center">Distribution Center</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Zone</InputLabel>
                  <Select defaultValue={activeCount.zone}>
                    <MenuItem value="Zone A">Zone A</MenuItem>
                    <MenuItem value="Zone B">Zone B</MenuItem>
                    <MenuItem value="Zone C">Zone C</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Planned Items"
                  type="number"
                  defaultValue={activeCount.plannedItems}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Count Team"
                  defaultValue={activeCount.countedBy}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  placeholder="Enter count planning notes..."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Physical Counting
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Scan barcodes or manually enter quantities for each item
            </Alert>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<QrCodeIcon />}
                onClick={handleScanBarcode}
                disabled={scanningMode}
              >
                {scanningMode ? 'Scanning...' : 'Start Scanning'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
              >
                Add Item Manually
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Bin Location</TableCell>
                    <TableCell>System Qty</TableCell>
                    <TableCell>Counted Qty</TableCell>
                    <TableCell>Variance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCount.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.product.category}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.product.sku}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.binLocation}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{item.systemQuantity}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          defaultValue={item.countedQuantity}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {getVarianceIcon(item.variance)}
                          <Typography 
                            variant="body2" 
                            color={getVarianceColor(item.variance)}
                            fontWeight={600}
                          >
                            {item.variance > 0 ? '+' : ''}{item.variance}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(item.status)}
                          label={item.status.toUpperCase()}
                          color={getStatusColor(item.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Count Validation
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Review all variances before proceeding to adjustments
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {activeCount.plannedItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Planned Items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {activeCount.countedItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Counted Items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="warning.main">
                      {activeCount.varianceItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Variance Items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Variance Summary
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>System Qty</TableCell>
                      <TableCell>Counted Qty</TableCell>
                      <TableCell>Variance</TableCell>
                      <TableCell>Variance Value</TableCell>
                      <TableCell>Action Required</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeCount.items.filter(item => item.status === 'variance').map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.systemQuantity}</TableCell>
                        <TableCell>{item.countedQuantity}</TableCell>
                        <TableCell>
                          <Typography 
                            color={getVarianceColor(item.variance)}
                            fontWeight={600}
                          >
                            {item.variance > 0 ? '+' : ''}{item.variance}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            color={getVarianceColor(item.variance)}
                            fontWeight={600}
                          >
                            {item.varianceValue > 0 ? '+' : ''}{formatCurrency(item.varianceValue)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={<Checkbox />}
                            label="Approve Adjustment"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Adjustment Processing
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Adjustments will be applied to inventory after approval
            </Alert>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Adjustment Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="success.main">
                        {formatCurrency(Math.abs(activeCount.varianceValue))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Adjustment Value
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {activeCount.varianceItems}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Items to Adjust
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <TextField
              fullWidth
              label="Adjustment Notes"
              multiline
              rows={4}
              placeholder="Enter reason for adjustments..."
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={<Checkbox />}
              label="I confirm that all adjustments are accurate and authorized"
              sx={{ mb: 2 }}
            />
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Final Approval
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              Physical count completed successfully
            </Alert>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {activeCount.accuracy}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Count Accuracy
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main">
                      {activeCount.countedItems}/{activeCount.plannedItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Items Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Approval Notes"
              multiline
              rows={3}
              placeholder="Enter approval notes..."
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Approved By</InputLabel>
              <Select>
                <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
                <MenuItem value="Mike Wilson">Mike Wilson</MenuItem>
                <MenuItem value="Lisa Chen">Lisa Chen</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading physical count data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Physical Count Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon />}
            onClick={handleScanBarcode}
          >
            Scan Barcode
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCount}
          >
            New Count
          </Button>
        </Box>
      </Box>

      {/* Count Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {counts.map((count) => (
          <Grid item xs={12} md={6} lg={4} key={count.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: count.status === 'in_progress' ? '2px solid #ff9800' : 
                       count.status === 'completed' ? '2px solid #4caf50' : '1px solid #e0e0e0',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {count.countNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {count.warehouse} • {count.zone}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(count.status)}
                      label={count.status.toUpperCase()}
                      color={getStatusColor(count.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Report">
                      <IconButton size="small">
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {count.status === 'completed' ? '100%' : 
                       count.status === 'in_progress' ? `${Math.round((count.countedItems / count.plannedItems) * 100)}%` : '0%'}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={count.status === 'completed' ? 100 : 
                           count.status === 'in_progress' ? (count.countedItems / count.plannedItems) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: count.status === 'completed' ? '#4caf50' : 
                                       count.status === 'in_progress' ? '#ff9800' : '#2196f3'
                      }
                    }}
                  />
                </Box>

                {/* Count Details */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Planned Items</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {count.plannedItems}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Counted Items</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {count.countedItems}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Variances</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {count.varianceItems}
                    </Typography>
                  </Box>
                  {count.accuracy > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Accuracy</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {count.accuracy}%
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Actions */}
                {count.status === 'planned' && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStartCount(count)}
                    sx={{ mb: 1 }}
                  >
                    Start Count
                  </Button>
                )}

                {count.status === 'in_progress' && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStartCount(count)}
                  >
                    Continue Count
                  </Button>
                )}

                {count.countedBy && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Counted by: {count.countedBy}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Count Dialog */}
      <Dialog open={countDialogOpen} onClose={() => setCountDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            Physical Count Process
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCountDialogOpen(false)}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained">
              Next
            </Button>
          ) : (
            <Button variant="contained" color="success">
              Complete Count
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Barcode Scan Dialog */}
      <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Barcode Scanner</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: 200,
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              mb: 2
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <QrCodeIcon sx={{ fontSize: 48, color: '#fff', mb: 1 }} />
              <Typography variant="body2" color="white">
                {scanningMode ? 'Scanning...' : 'Ready to Scan'}
              </Typography>
            </Box>
          </Box>
          
          <TextField
            fullWidth
            label="Manual Entry"
            placeholder="Enter barcode manually"
            sx={{ mb: 2 }}
          />
          
          <Alert severity="info">
            Point your device camera at the barcode or enter manually
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScanDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => {
              setScanningMode(!scanningMode);
              if (scanningMode) setScanDialogOpen(false);
            }}
          >
            {scanningMode ? 'Stop Scanning' : 'Start Scanning'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhysicalCount;
