import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import DialogHeader from '../../components/common/DialogHeader';
import ActionButton from '../../components/common/ActionButton';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Snackbar,
  CircularProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const POSProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Theme color state
  const [themeColor, setThemeColor] = useState('#1976d2'); // Default blue
  
  // Form state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('new'); // 'new', 'edit', 'view'
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    loadPrograms();
    // Load theme color from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      setThemeColor(theme.activeColor);
    }
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      const mockPrograms = [
        { id: 1, name: 'Point of Sale', code: 'POS', description: 'Main POS billing operations', is_active: true, is_mapped: true, can_delete: false },
        { id: 2, name: 'Customer Master', code: 'CUST', description: 'Customer management operations', is_active: true, is_mapped: true, can_delete: false },
        { id: 3, name: 'Cashier Settlement', code: 'SETTLE', description: 'Cashier settlement operations', is_active: true, is_mapped: false, can_delete: true },
        { id: 4, name: 'Day End', code: 'DAYEND', description: 'Day end closing operations', is_active: true, is_mapped: false, can_delete: true },
        { id: 5, name: 'Customer Receivables', code: 'RECEIV', description: 'Customer receivables management', is_active: true, is_mapped: false, can_delete: true },
        { id: 6, name: 'Home Delivery', code: 'DELIVERY', description: 'Home delivery operations', is_active: true, is_mapped: false, can_delete: true },
        { id: 7, name: 'Code Settings', code: 'CODES', description: 'System code management', is_active: true, is_mapped: false, can_delete: true },
      ];
      setPrograms(mockPrograms);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load programs: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setFormData({ name: '', code: '', description: '', is_active: true });
    setDialogMode('new');
    setSelectedProgram(null);
    setOpenDialog(true);
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      code: program.code,
      description: program.description,
      is_active: program.is_active,
    });
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleView = (program) => {
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      code: program.code,
      description: program.description,
      is_active: program.is_active,
    });
    setDialogMode('view');
    setOpenDialog(true);
  };

  const handleDelete = async (program) => {
    if (!program.can_delete) {
      setSnackbar({ 
        open: true, 
        message: `Cannot delete "${program.name}" - it is mapped to one or more roles`, 
        severity: 'error' 
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete program "${program.name}"?`)) {
      try {
        setLoading(true);
        // Mock API call - replace with actual API
        console.log('Deleting program:', program.id);
        setSnackbar({ open: true, message: 'Program deleted successfully', severity: 'success' });
        loadPrograms();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete program: ' + error.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!formData.name || !formData.code) {
        throw new Error('Please fill in all required fields');
      }

      // Mock API call - replace with actual API
      console.log('Saving program:', formData);
      
      if (dialogMode === 'new') {
        setSnackbar({ open: true, message: 'Program created successfully', severity: 'success' });
      } else if (dialogMode === 'edit') {
        setSnackbar({ open: true, message: 'Program updated successfully', severity: 'success' });
      }

      setOpenDialog(false);
      loadPrograms();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to save program', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ name: '', code: '', description: '', is_active: true });
  };

  const handleClose = () => {
    setOpenDialog(false);
    setFormData({ name: '', code: '', description: '', is_active: true });
    setSelectedProgram(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 3
    }}>
      {/* Page Title */}
      <PageTitle 
        title="POS Programs / Operations" 
        subtitle="Manage POS programs and operations that can be mapped to roles and users" 
      />

      {/* Action Buttons */}
      <Box sx={{ px: 3 }}>
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.700' }}>
              Programs List
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionButton
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadPrograms}
                disabled={loading}
              >
                Refresh
              </ActionButton>
              <ActionButton
                startIcon={<AddIcon />}
                onClick={handleNew}
                disabled={loading}
              >
                New Program
              </ActionButton>
            </Box>
          </Box>
        </Paper>

        {/* Excel-like Table */}
        <Paper
          sx={{
            borderRadius: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700', textAlign: 'center' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700', textAlign: 'center' }}>Mapped</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : programs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8, color: 'grey.500' }}>
                      No programs found
                    </TableCell>
                  </TableRow>
                ) : (
                  programs.map((program, index) => (
                    <TableRow 
                      key={program.id} 
                      hover
                      sx={{
                        backgroundColor: index % 2 === 0 ? 'white' : 'grey.50',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease',
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{program.name}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{program.code}</TableCell>
                      <TableCell>{program.description}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={program.is_active ? 'Active' : 'Inactive'}
                          color={program.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={program.is_mapped ? 'Yes' : 'No'}
                          color={program.is_mapped ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() => handleView(program)}
                              disabled={loading}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                },
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(program)}
                              disabled={loading}
                              sx={{
                                color: 'success.main',
                                '&:hover': {
                                  backgroundColor: 'success.light',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={program.can_delete ? "Delete" : "Cannot delete - mapped to roles"}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(program)}
                                disabled={loading || !program.can_delete}
                                sx={{
                                  color: program.can_delete ? 'error.main' : 'grey.400',
                                  '&:hover': {
                                    backgroundColor: program.can_delete ? 'error.light' : 'transparent',
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 2,
            px: 3,
            fontWeight: 600,
          }}
        >
          {dialogMode === 'new' && 'Create New Program'}
          {dialogMode === 'edit' && 'Edit Program'}
          {dialogMode === 'view' && 'View Program'}
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Program Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={dialogMode === 'view'}
                required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Program Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled={dialogMode === 'view'}
                required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={dialogMode === 'view'}
                multiline
                rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    disabled={dialogMode === 'view'}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{
              borderRadius: 0,
              px: 3,
            }}
          >
            Close
          </Button>
          {dialogMode !== 'view' && (
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 0,
                px: 3,
                '&:hover': {
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default POSProgramsPage;
