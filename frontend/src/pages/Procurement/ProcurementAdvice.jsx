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
  Tooltip,
  Alert,
  Snackbar,
  Stack,
  Autocomplete,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Send,
  Search,
  Inventory,
  Person,
  CalendarToday,
  AttachMoney,
  Refresh,
  CheckCircle,
  Pending,
  Error,
  Print,
  Receipt,
  Warning,
  ExpandMore,
  TrendingUp,
  Assessment,
  Description,
  Calculate,
  Visibility,
  FileCopy,
  Lightbulb,
  Analytics,
} from '@mui/icons-material';

const ProcurementAdvice = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);

  // Sample data - in real app, this would come from API
  const [advices, setAdvices] = useState([
    {
      id: 'PA-2025-001',
      adviceDate: '2025-01-10',
      category: 'Cost Optimization',
      priority: 'High',
      title: 'Office Furniture Procurement Strategy',
      description: 'Recommendation to consolidate office furniture purchases with Supplier A for better pricing and faster delivery',
      status: 'Active',
      estimatedSavings: 15000.00,
      implementationCost: 5000.00,
      roi: 200,
      impact: 'Cost Reduction',
      recommendations: [
        {
          item: 'Office Chairs',
          currentSupplier: 'Multiple Suppliers',
          recommendedSupplier: 'Supplier A',
          currentCost: 1200.00,
          recommendedCost: 1100.00,
          savings: 100.00,
          quantity: 50,
          totalSavings: 5000.00
        },
        {
          item: 'Desk Lamps',
          currentSupplier: 'Supplier B',
          recommendedSupplier: 'Supplier A',
          currentCost: 650.00,
          recommendedCost: 580.00,
          savings: 70.00,
          quantity: 30,
          totalSavings: 2100.00
        }
      ],
      implementationPlan: {
        phase1: 'Negotiate contract with Supplier A',
        phase2: 'Transfer existing orders',
        phase3: 'Monitor performance and savings',
        estimatedDuration: '2 weeks',
        responsiblePerson: 'Procurement Manager'
      },
      riskAssessment: {
        risk: 'Medium',
        mitigation: 'Maintain backup supplier relationships',
        contingency: 'Alternative suppliers identified'
      },
      approvalWorkflow: {
        submittedBy: 'Procurement Analyst',
        submittedDate: '2025-01-10',
        reviewedBy: 'Procurement Manager',
        reviewedDate: '2025-01-11',
        approvedBy: null,
        approvedDate: null,
        status: 'Under Review'
      },
      attachments: ['cost_analysis.pdf', 'supplier_comparison.pdf'],
      remarks: 'High priority due to significant cost savings potential'
    },
    {
      id: 'PA-2025-002',
      adviceDate: '2025-01-09',
      category: 'Supplier Management',
      priority: 'Medium',
      title: 'IT Equipment Supplier Diversification',
      description: 'Recommendation to diversify IT equipment suppliers to reduce dependency on single vendor',
      status: 'Implemented',
      estimatedSavings: 8000.00,
      implementationCost: 2000.00,
      roi: 300,
      impact: 'Risk Mitigation',
      recommendations: [
        {
          item: 'Laptop Computers',
          currentSupplier: 'Tech Supplier',
          recommendedSupplier: 'Computer World',
          currentCost: 4200.00,
          recommendedCost: 4000.00,
          savings: 200.00,
          quantity: 20,
          totalSavings: 4000.00
        },
        {
          item: 'Wireless Mouse',
          currentSupplier: 'Tech Supplier',
          recommendedSupplier: 'IT Solutions',
          currentCost: 650.00,
          recommendedCost: 600.00,
          savings: 50.00,
          quantity: 40,
          totalSavings: 2000.00
        }
      ],
      implementationPlan: {
        phase1: 'Establish contracts with new suppliers',
        phase2: 'Gradual transition of orders',
        phase3: 'Performance evaluation',
        estimatedDuration: '4 weeks',
        responsiblePerson: 'IT Procurement Lead'
      },
      riskAssessment: {
        risk: 'Low',
        mitigation: 'Gradual transition with parallel suppliers',
        contingency: 'Maintain existing supplier relationships'
      },
      approvalWorkflow: {
        submittedBy: 'IT Procurement Lead',
        submittedDate: '2025-01-09',
        reviewedBy: 'IT Manager',
        reviewedDate: '2025-01-10',
        approvedBy: 'Procurement Manager',
        approvedDate: '2025-01-11',
        status: 'Approved'
      },
      attachments: ['supplier_analysis.pdf', 'risk_assessment.pdf'],
      remarks: 'Successfully implemented with positive results'
    }
  ]);

  const [formData, setFormData] = useState({
    adviceDate: new Date().toISOString().split('T')[0],
    category: '',
    priority: 'Medium',
    title: '',
    description: '',
    impact: '',
    estimatedSavings: 0,
    implementationCost: 0,
    recommendations: [],
    remarks: ''
  });

  const [newRecommendation, setNewRecommendation] = useState({
    item: '',
    currentSupplier: '',
    recommendedSupplier: '',
    currentCost: 0,
    recommendedCost: 0,
    quantity: 0
  });

  const [implementationPlan, setImplementationPlan] = useState({
    phase1: '',
    phase2: '',
    phase3: '',
    estimatedDuration: '',
    responsiblePerson: ''
  });

  const categories = ['Cost Optimization', 'Supplier Management', 'Process Improvement', 'Risk Mitigation', 'Quality Enhancement', 'Technology Upgrade'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const impacts = ['Cost Reduction', 'Risk Mitigation', 'Quality Improvement', 'Process Efficiency', 'Technology Advancement', 'Compliance'];
  const statuses = ['Draft', 'Under Review', 'Approved', 'Rejected', 'Implemented', 'Active'];
  const risks = ['Low', 'Medium', 'High', 'Critical'];
  const supplierList = ['Supplier A', 'Supplier B', 'Supplier C', 'Tech Supplier', 'Computer World', 'IT Solutions'];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setEditingAdvice(null);
  };

  const handleAdd = () => {
    setEditingAdvice(null);
    setFormData({
      adviceDate: new Date().toISOString().split('T')[0],
      category: '',
      priority: 'Medium',
      title: '',
      description: '',
      impact: '',
      estimatedSavings: 0,
      implementationCost: 0,
      recommendations: [],
      remarks: ''
    });
    setImplementationPlan({
      phase1: '',
      phase2: '',
      phase3: '',
      estimatedDuration: '',
      responsiblePerson: ''
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleEdit = (advice) => {
    setEditingAdvice(advice);
    setFormData({
      adviceDate: advice.adviceDate,
      category: advice.category,
      priority: advice.priority,
      title: advice.title,
      description: advice.description,
      impact: advice.impact,
      estimatedSavings: advice.estimatedSavings,
      implementationCost: advice.implementationCost,
      recommendations: advice.recommendations,
      remarks: advice.remarks
    });
    setImplementationPlan(advice.implementationPlan);
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    setAdvices(prev => prev.filter(advice => advice.id !== id));
    setSnackbar({
      open: true,
      message: 'Procurement Advice deleted successfully',
      severity: 'success'
    });
  };

  const handleSave = () => {
    if (editingAdvice) {
      // Update existing advice
      const roi = formData.implementationCost > 0 ? ((formData.estimatedSavings / formData.implementationCost) * 100) : 0;
      setAdvices(prev => prev.map(advice => 
        advice.id === editingAdvice.id ? { 
          ...advice, 
          ...formData,
          roi,
          implementationPlan
        } : advice
      ));
      setSnackbar({
        open: true,
        message: 'Procurement Advice updated successfully',
        severity: 'success'
      });
    } else {
      // Add new advice
      const roi = formData.implementationCost > 0 ? ((formData.estimatedSavings / formData.implementationCost) * 100) : 0;
      const newAdvice = {
        id: `PA-2025-${String(advices.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'Draft',
        roi,
        implementationPlan,
        riskAssessment: {
          risk: 'Medium',
          mitigation: 'To be assessed',
          contingency: 'To be defined'
        },
        approvalWorkflow: {
          submittedBy: 'Current User',
          submittedDate: new Date().toISOString().split('T')[0],
          reviewedBy: null,
          reviewedDate: null,
          approvedBy: null,
          approvedDate: null,
          status: 'Draft'
        },
        attachments: []
      };
      setAdvices(prev => [...prev, newAdvice]);
      setSnackbar({
        open: true,
        message: 'Procurement Advice created successfully',
        severity: 'success'
      });
    }
    setDialogOpen(false);
  };

  const handleAddRecommendation = () => {
    if (newRecommendation.item && newRecommendation.currentSupplier && newRecommendation.recommendedSupplier) {
      const savings = newRecommendation.currentCost - newRecommendation.recommendedCost;
      const totalSavings = savings * newRecommendation.quantity;
      setFormData(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, { ...newRecommendation, savings, totalSavings }],
        estimatedSavings: prev.estimatedSavings + totalSavings
      }));
      setNewRecommendation({
        item: '',
        currentSupplier: '',
        recommendedSupplier: '',
        currentCost: 0,
        recommendedCost: 0,
        quantity: 0
      });
    }
  };

  const handleRemoveRecommendation = (index) => {
    const removedRecommendation = formData.recommendations[index];
    setFormData(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index),
      estimatedSavings: prev.estimatedSavings - removedRecommendation.totalSavings
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Under Review': return 'info';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Implemented': return 'success';
      case 'Active': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Advice ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Est. Savings</TableCell>
            <TableCell>ROI %</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advices.map((advice) => (
            <TableRow key={advice.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {advice.id}
                </Typography>
              </TableCell>
              <TableCell>{advice.adviceDate}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {advice.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {advice.description.substring(0, 50)}...
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={advice.category}
                  color="info"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={advice.priority}
                  color={getPriorityColor(advice.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={advice.status}
                  color={getStatusColor(advice.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  ₹{advice.estimatedSavings.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  fontWeight="bold" 
                  color={advice.roi > 100 ? "success.main" : advice.roi > 50 ? "warning.main" : "error.main"}
                >
                  {advice.roi.toFixed(0)}%
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(advice)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View">
                    <IconButton size="small" color="info">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print">
                    <IconButton size="small" color="primary">
                      <Print />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy">
                    <IconButton size="small" color="secondary">
                      <FileCopy />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(advice.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Advice Date"
          type="date"
          value={formData.adviceDate}
          onChange={(e) => setFormData(prev => ({ ...prev, adviceDate: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            label="Category"
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={formData.priority}
            label="Priority"
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
          >
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>{priority}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Impact</InputLabel>
          <Select
            value={formData.impact}
            label="Impact"
            onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
          >
            {impacts.map((impact) => (
              <MenuItem key={impact} value={impact}>{impact}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Estimated Savings"
          type="number"
          value={formData.estimatedSavings}
          onChange={(e) => setFormData(prev => ({ ...prev, estimatedSavings: parseFloat(e.target.value) || 0 }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Implementation Cost"
          type="number"
          value={formData.implementationCost}
          onChange={(e) => setFormData(prev => ({ ...prev, implementationCost: parseFloat(e.target.value) || 0 }))}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Remarks"
          multiline
          rows={3}
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
        />
      </Grid>
    </Grid>
  );

  const renderRecommendations = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recommendations
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Item"
              value={newRecommendation.item}
              onChange={(e) => setNewRecommendation(prev => ({ ...prev, item: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Current Supplier"
              value={newRecommendation.currentSupplier}
              onChange={(e) => setNewRecommendation(prev => ({ ...prev, currentSupplier: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Recommended Supplier"
              value={newRecommendation.recommendedSupplier}
              onChange={(e) => setNewRecommendation(prev => ({ ...prev, recommendedSupplier: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Current Cost"
              type="number"
              value={newRecommendation.currentCost}
              onChange={(e) => setNewRecommendation(prev => ({ ...prev, currentCost: parseFloat(e.target.value) || 0 }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Rec. Cost"
              type="number"
              value={newRecommendation.recommendedCost}
              onChange={(e) => setNewRecommendation(prev => ({ ...prev, recommendedCost: parseFloat(e.target.value) || 0 }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={newRecommendation.quantity}
              onChange={(e) => setNewRecommendation(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Savings"
              value={((newRecommendation.currentCost - newRecommendation.recommendedCost) * newRecommendation.quantity).toFixed(2)}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddRecommendation}
              sx={{ height: '56px' }}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {formData.recommendations.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommendation Details
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Current Supplier</TableCell>
                    <TableCell>Recommended Supplier</TableCell>
                    <TableCell>Current Cost</TableCell>
                    <TableCell>Rec. Cost</TableCell>
                    <TableCell>Savings/Unit</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total Savings</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.recommendations.map((rec, index) => (
                    <TableRow key={index}>
                      <TableCell>{rec.item}</TableCell>
                      <TableCell>{rec.currentSupplier}</TableCell>
                      <TableCell>{rec.recommendedSupplier}</TableCell>
                      <TableCell>₹{rec.currentCost.toLocaleString()}</TableCell>
                      <TableCell>₹{rec.recommendedCost.toLocaleString()}</TableCell>
                      <TableCell>₹{rec.savings.toLocaleString()}</TableCell>
                      <TableCell>{rec.quantity}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          ₹{rec.totalSavings.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleRemoveRecommendation(index)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="h6" fontWeight="bold">
                Total Estimated Savings: ₹{formData.estimatedSavings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ROI: {formData.implementationCost > 0 ? ((formData.estimatedSavings / formData.implementationCost) * 100).toFixed(0) : 0}%
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderImplementationPlan = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Implementation Plan
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phase 1"
              multiline
              rows={2}
              value={implementationPlan.phase1}
              onChange={(e) => setImplementationPlan(prev => ({ ...prev, phase1: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phase 2"
              multiline
              rows={2}
              value={implementationPlan.phase2}
              onChange={(e) => setImplementationPlan(prev => ({ ...prev, phase2: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phase 3"
              multiline
              rows={2}
              value={implementationPlan.phase3}
              onChange={(e) => setImplementationPlan(prev => ({ ...prev, phase3: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Duration"
              value={implementationPlan.estimatedDuration}
              onChange={(e) => setImplementationPlan(prev => ({ ...prev, estimatedDuration: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Responsible Person"
              value={implementationPlan.responsiblePerson}
              onChange={(e) => setImplementationPlan(prev => ({ ...prev, responsiblePerson: e.target.value }))}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Procurement Advice" 
            subtitle="Strategic procurement recommendations and insights"
            showIcon={true}
            icon={<Lightbulb />}
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
            startIcon={<Lightbulb />}
            onClick={handleAdd}
          >
            New Advice
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
          <Button
            variant={activeTab === 'list' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('list')}
            startIcon={<Search />}
          >
            All Advice
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('draft')}
            startIcon={<Edit />}
          >
            Draft
          </Button>
          <Button
            variant={activeTab === 'review' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('review')}
            startIcon={<Pending />}
          >
            Under Review
          </Button>
          <Button
            variant={activeTab === 'approved' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('approved')}
            startIcon={<CheckCircle />}
          >
            Approved
          </Button>
          <Button
            variant={activeTab === 'active' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('active')}
            startIcon={<TrendingUp />}
          >
            Active
          </Button>
        </Box>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {activeTab === 'list' ? 'All Procurement Advice' : 
               activeTab === 'draft' ? 'Draft Advice' :
               activeTab === 'review' ? 'Under Review' :
               activeTab === 'approved' ? 'Approved Advice' : 'Active Recommendations'}
            </Typography>
            <Chip
              label={`${advices.length} Advice`}
              color="primary"
              variant="outlined"
            />
          </Box>
          {renderList()}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          {editingAdvice ? 'Edit' : 'Create New'} Procurement Advice
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Basic Information</StepLabel>
              </Step>
              <Step>
                <StepLabel>Recommendations</StepLabel>
              </Step>
              <Step>
                <StepLabel>Implementation Plan</StepLabel>
              </Step>
            </Stepper>

            {activeStep === 0 && renderForm()}
            {activeStep === 1 && renderRecommendations()}
            {activeStep === 2 && renderImplementationPlan()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>
              Back
            </Button>
          )}
          {activeStep < 2 ? (
            <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained">
              Next
            </Button>
          ) : (
            <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
              {editingAdvice ? 'Update' : 'Save'} Advice
            </Button>
          )}
        </DialogActions>
      </Dialog>

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

export default ProcurementAdvice;
