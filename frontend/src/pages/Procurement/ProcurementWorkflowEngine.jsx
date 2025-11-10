import React, { useState } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  Save,
  Refresh,
  Add,
  Edit,
  Delete,
  Send,
  CheckCircle,
  Schedule,
  Warning,
  Error,
  TrendingUp,
  TrendingDown,
  Business,
  LocalShipping,
  AttachMoney,
  Description,
  Assignment,
  ExpandMore,
  Visibility,
  VisibilityOff,
  CloudUpload,
  Download,
  Approval,
  Block,
  PlayArrow,
  Pause,
  Stop,
} from '@mui/icons-material';

const ProcurementWorkflowEngine = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [workflowType, setWorkflowType] = useState('rfq');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Sample workflow data
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      type: 'RFQ',
      title: 'iPhone 15 Pro Max Procurement RFQ',
      status: 'sent',
      priority: 'high',
      createdDate: '2024-12-15',
      dueDate: '2024-12-22',
      vendorCount: 3,
      totalValue: 500000,
      currentStep: 2,
      steps: [
        { id: 1, name: 'RFQ Creation', status: 'completed', date: '2024-12-15' },
        { id: 2, name: 'Vendor Selection', status: 'completed', date: '2024-12-16' },
        { id: 3, name: 'RFQ Distribution', status: 'in_progress', date: '2024-12-17' },
        { id: 4, name: 'Quote Collection', status: 'pending', date: null },
        { id: 5, name: 'Quote Evaluation', status: 'pending', date: null },
        { id: 6, name: 'Vendor Selection', status: 'pending', date: null },
        { id: 7, name: 'PO Generation', status: 'pending', date: null },
      ],
      vendors: [
        { name: 'Apple Inc.', status: 'responded', quote: 1199.00, delivery: '7 days' },
        { name: 'Samsung Electronics', status: 'pending', quote: null, delivery: null },
        { name: 'Best Buy Wholesale', status: 'responded', quote: 1249.00, delivery: '14 days' },
      ],
    },
    {
      id: 2,
      type: 'PO',
      title: 'Gaming Laptop Purchase Order',
      status: 'approved',
      priority: 'medium',
      createdDate: '2024-12-10',
      dueDate: '2024-12-25',
      vendorCount: 1,
      totalValue: 75000,
      currentStep: 6,
      steps: [
        { id: 1, name: 'PO Creation', status: 'completed', date: '2024-12-10' },
        { id: 2, name: 'Budget Approval', status: 'completed', date: '2024-12-11' },
        { id: 3, name: 'Vendor Confirmation', status: 'completed', date: '2024-12-12' },
        { id: 4, name: 'Payment Processing', status: 'completed', date: '2024-12-13' },
        { id: 5, name: 'Production Start', status: 'completed', date: '2024-12-14' },
        { id: 6, name: 'Quality Check', status: 'in_progress', date: '2024-12-17' },
        { id: 7, name: 'Delivery', status: 'pending', date: null },
      ],
      vendors: [
        { name: 'Dell Technologies', status: 'confirmed', quote: 1599.00, delivery: '15 days' },
      ],
    },
  ]);

  const workflowTypes = [
    { value: 'rfq', label: 'Request for Quotation (RFQ)', icon: <Description />, color: 'primary' },
    { value: 'po', label: 'Purchase Order (PO)', icon: <Assignment />, color: 'success' },
    { value: 'grn', label: 'Goods Receipt Note (GRN)', icon: <LocalShipping />, color: 'info' },
    { value: 'invoice', label: 'Invoice Processing', icon: <AttachMoney />, color: 'warning' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in_progress': return <Schedule />;
      case 'pending': return <Warning />;
      case 'cancelled': return <Error />;
      default: return <Warning />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const renderWorkflowCard = (workflow) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {workflow.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                label={workflow.type}
                color="primary"
                size="small"
                variant="outlined"
              />
              <Chip
                label={workflow.status}
                color={getStatusColor(workflow.status)}
                size="small"
              />
              <Chip
                label={workflow.priority}
                color={getPriorityColor(workflow.priority)}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" color="primary">
              ${workflow.totalValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {workflow.vendorCount} vendors
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {workflow.currentStep}/{workflow.steps.length} steps
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(workflow.currentStep / workflow.steps.length) * 100} 
          />
        </Box>

        {/* Workflow Steps */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Step: {workflow.steps[workflow.currentStep - 1]?.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {workflow.steps.slice(0, 4).map((step, index) => (
              <Chip
                key={step.id}
                icon={getStatusIcon(step.status)}
                label={step.name}
                color={getStatusColor(step.status)}
                size="small"
                variant={step.status === 'pending' ? 'outlined' : 'filled'}
              />
            ))}
            {workflow.steps.length > 4 && (
              <Chip
                label={`+${workflow.steps.length - 4} more`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Vendor Status */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Vendor Responses
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {workflow.vendors.map((vendor, index) => (
              <Chip
                key={index}
                label={vendor.name}
                color={vendor.status === 'responded' ? 'success' : 'default'}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" startIcon={<Visibility />}>
              View Details
            </Button>
            <Button size="small" startIcon={<Edit />}>
              Edit
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Approve">
              <IconButton size="small" color="success">
                <Approval />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton size="small" color="error">
                <Block />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderWorkflowSteps = (workflow) => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Workflow Steps
        </Typography>
        <Stepper activeStep={workflow.currentStep - 1} orientation="vertical">
          {workflow.steps.map((step, index) => (
            <Step key={step.id} completed={step.status === 'completed'}>
              <StepLabel
                optional={
                  <Typography variant="caption">
                    {step.date ? new Date(step.date).toLocaleDateString() : 'Pending'}
                  </Typography>
                }
              >
                {step.name}
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Step {step.id} of {workflow.steps.length}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      icon={getStatusIcon(step.status)}
                      label={step.status}
                      color={getStatusColor(step.status)}
                      size="small"
                    />
                    {step.status === 'in_progress' && (
                      <Button size="small" startIcon={<PlayArrow />}>
                        Continue
                      </Button>
                    )}
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  );

  const renderVendorResponses = (workflow) => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Vendor Responses
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Quote</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workflow.vendors.map((vendor, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <Business />
                      </Avatar>
                      <Typography variant="body2">{vendor.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.status}
                      color={vendor.status === 'responded' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {vendor.quote ? (
                      <Typography variant="body2" color="primary">
                        ${vendor.quote}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {vendor.delivery ? (
                      <Typography variant="body2">
                        {vendor.delivery}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        TBD
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Quote">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Reminder">
                        <IconButton size="small">
                          <Send />
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
  );

  const renderWorkflowTypeSelection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Create New Workflow
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select the type of procurement workflow you want to create
        </Typography>
      </Grid>
      {workflowTypes.map((type) => (
        <Grid item xs={12} md={6} key={type.value}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: workflowType === type.value ? 2 : 1,
              borderColor: workflowType === type.value ? `${type.color}.main` : 'divider',
              '&:hover': { borderColor: `${type.color}.main` }
            }}
            onClick={() => setWorkflowType(type.value)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: `${type.color}.main` }}>
                  {type.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {type.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.value === 'rfq' && 'Request quotes from multiple vendors'}
                    {type.value === 'po' && 'Create and manage purchase orders'}
                    {type.value === 'grn' && 'Process goods receipt and quality checks'}
                    {type.value === 'invoice' && 'Handle invoice processing and payments'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => setSnackbar({ open: true, message: 'Workflow creation will be implemented in the next iteration', severity: 'info' })}
        >
          Create {workflowTypes.find(t => t.value === workflowType)?.label}
        </Button>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            {workflows.map((workflow) => (
              <Grid item xs={12} key={workflow.id}>
                {renderWorkflowCard(workflow)}
              </Grid>
            ))}
          </Grid>
        );
      case 1:
        return renderWorkflowTypeSelection();
      case 2:
        return workflows.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderWorkflowSteps(workflows[0])}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderVendorResponses(workflows[0])}
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">No workflows available</Alert>
        );
      default:
        return (
          <Grid container spacing={3}>
            {workflows.map((workflow) => (
              <Grid item xs={12} key={workflow.id}>
                {renderWorkflowCard(workflow)}
              </Grid>
            ))}
          </Grid>
        );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Source-to-Pay (S2P) Workflow Engine" 
            subtitle="End-to-end procurement workflow automation"
            showIcon={true}
            icon={<Workflow />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setActiveStep(1)}
          >
            New Workflow
          </Button>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
          <Button
            variant={activeStep === 0 ? 'contained' : 'outlined'}
            onClick={() => setActiveStep(0)}
            startIcon={<Assignment />}
          >
            Active Workflows
          </Button>
          <Button
            variant={activeStep === 1 ? 'contained' : 'outlined'}
            onClick={() => setActiveStep(1)}
            startIcon={<Add />}
          >
            Create Workflow
          </Button>
          <Button
            variant={activeStep === 2 ? 'contained' : 'outlined'}
            onClick={() => setActiveStep(2)}
            startIcon={<TrendingUp />}
          >
            Workflow Analytics
          </Button>
        </Box>
      </Card>

      {/* Content */}
      {renderTabContent()}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProcurementWorkflowEngine;

