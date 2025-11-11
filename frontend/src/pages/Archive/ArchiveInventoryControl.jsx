import React, { useState } from 'react';
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
  Tabs,
  Tab,
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
  PlayArrow,
  Stop,
  Upload,
  Download,
  Visibility,
  FileCopy,
  LocalShipping,
  Assignment,
  Assessment,
  Settings,
  Business,
} from '@mui/icons-material';

const ArchiveInventoryControl = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Tab structure for different inventory functions
  const tabs = [
    { label: 'System Go-Live', icon: <Inventory />, id: 'go-live' },
    { label: 'Stock Allocation', icon: <Assignment />, id: 'allocation' },
    { label: 'Stock Requisition', icon: <Receipt />, id: 'requisition' },
    { label: 'Location Transfers', icon: <LocalShipping />, id: 'transfers' },
    { label: 'Stock Transfer Out', icon: <LocalShipping />, id: 'transfer-out' },
    { label: 'Stock Transfer In', icon: <LocalShipping />, id: 'transfer-in' },
    { label: 'Intercompany Transfers', icon: <Business />, id: 'intercompany' },
    { label: 'Stock Take', icon: <Assessment />, id: 'stock-take' },
    { label: 'Stock Freeze', icon: <Settings />, id: 'freeze' },
    { label: 'Stock Adjustment', icon: <Assignment />, id: 'adjustment' },
  ];

  // Sample data for demonstration
  const [inventoryData, setInventoryData] = useState({
    goLive: [
      {
        id: 'OSE-001',
        item: 'Office Chairs',
        location: 'Main Warehouse',
        quantity: 100,
        unitCost: 1200,
        totalValue: 120000,
        status: 'Entered'
      }
    ],
    allocations: [
      {
        id: 'SA-001',
        item: 'Office Chairs',
        requestedBy: 'Sales Team',
        quantity: 10,
        location: 'Main Warehouse',
        status: 'Allocated'
      }
    ],
    requisitions: [
      {
        id: 'SR-001',
        item: 'Desk Lamps',
        requestedBy: 'HR Department',
        quantity: 5,
        location: 'Branch Office A',
        status: 'Pending'
      }
    ],
    transfers: [
      {
        id: 'LT-001',
        item: 'Laptop Computers',
        fromLocation: 'IT Warehouse',
        toLocation: 'Branch Office B',
        quantity: 3,
        status: 'In Transit'
      }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderSystemGoLive = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">System Go-Live - Opening Stock Entry</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          New Entry
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Entry ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Total Value</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.goLive.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{entry.item}</TableCell>
                <TableCell>{entry.location}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>₹{entry.unitCost.toLocaleString()}</TableCell>
                <TableCell>₹{entry.totalValue.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip label={entry.status} color="warning" size="small" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton size="small">
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
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderStockAllocation = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Stock Allocation Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          New Allocation
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Allocation ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.allocations.map((allocation) => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.id}</TableCell>
                <TableCell>{allocation.item}</TableCell>
                <TableCell>{allocation.requestedBy}</TableCell>
                <TableCell>{allocation.quantity}</TableCell>
                <TableCell>{allocation.location}</TableCell>
                <TableCell>
                  <Chip label={allocation.status} color="success" size="small" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton size="small">
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
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderStockRequisition = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Stock Requisition Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          New Requisition
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Requisition ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.requisitions.map((requisition) => (
              <TableRow key={requisition.id}>
                <TableCell>{requisition.id}</TableCell>
                <TableCell>{requisition.item}</TableCell>
                <TableCell>{requisition.requestedBy}</TableCell>
                <TableCell>{requisition.quantity}</TableCell>
                <TableCell>{requisition.location}</TableCell>
                <TableCell>
                  <Chip label={requisition.status} color="warning" size="small" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton size="small">
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
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderLocationTransfers = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Location Transfer Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          New Transfer
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transfer ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>From Location</TableCell>
              <TableCell>To Location</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell>{transfer.id}</TableCell>
                <TableCell>{transfer.item}</TableCell>
                <TableCell>{transfer.fromLocation}</TableCell>
                <TableCell>{transfer.toLocation}</TableCell>
                <TableCell>{transfer.quantity}</TableCell>
                <TableCell>
                  <Chip label={transfer.status} color="info" size="small" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton size="small">
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
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return renderSystemGoLive();
      case 1: return renderStockAllocation();
      case 2: return renderStockRequisition();
      case 3: return renderLocationTransfers();
      default:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {tabs[activeTab]?.label} - Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This feature is under development
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Archive - Inventory Control" 
            subtitle="Legacy inventory control interface for reference"
            showIcon={true}
            icon={<Inventory />}
          />
          <Typography variant="body1" color="text.secondary">
            Legacy inventory control interface for reference
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          ))}
        </Tabs>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          {renderTabContent()}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingEntry ? 'Edit' : 'Create New'} {tabs[activeTab]?.label}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Form for {tabs[activeTab]?.label} will be implemented here
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={() => setDialogOpen(false)} variant="contained" startIcon={<Save />}>
            Save
          </Button>
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

export default ArchiveInventoryControl;
